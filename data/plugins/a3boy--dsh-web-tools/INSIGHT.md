# dsh-web-tools

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[bb68082](https://github.com/A3Boy/dsh-web-tools/tree/bb68082d1274dc0d28ed5921bb08c7b5070fae7f)

<!-- BEGIN META -->
[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=yellow&logo=github&style=flat)](https://github.com/A3Boy/dsh-web-tools)
<!-- END META -->

> **实现功能**：为DSH统一搜索与抓取接口适配多Provider、自定义JSON源及X/小红书原生浏览器检索。

> **核心亮点**：在标准Web接口下保留服务商特性、健康容灾、自定义协议与原生平台接线，减少逐接口维护。详见[Q01](#research-q01)。

> **风险与缺陷**：统一外包装丢截断/最终URL/检索方式，off仅限制两Web工具、required失败完成也放行；通用页DNS预检未绑定最终socket。详见[Q04](#research-q04)。

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
  - [Q01 · 它给谁提供什么可验收交付，贡献在哪里？](#detail-section-11)
  - [Q02 · 语义编译和容灾具体如何工作，有什么损失？](#detail-section-12)
  - [Q03 · 关闭/始终联网可以理解成什么保证？](#detail-section-13)
  - [Q04 · 通用fetch安全链和结果完整性是否闭合？](#detail-section-14)
  - [Q05 · 自定义源与凭证的正向设计和边界是什么？](#detail-section-15)
  - [Q06 · X/小红书抓取的效果与隐私范围是什么？](#detail-section-16)
  - [Q07 · 部署及三阶段成本怎么判断？](#detail-section-17)
  - [Q08 · 现有测试能支撑怎样的工程评价？](#detail-section-18)
  - [Q09 · 怎样采用与推导可证伪的新方向？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要多源可用性和社媒详情的研究任务，必须区分发现片段/原生详情与完整范围。详见[Q01](#research-q01)。

单Provider标准Web工具或手工逐服务商/平台查询；本项是适配与调度层，不自建索引或事实认证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 标准Web Provider | 多源搜索/页面文本 | 使用宿主现有Web工具，非另注册工具 |
| 自定义JSON源 | 无脚本接口适配 | search-only，目标授权与Key信任 |
| X/小红书浏览器 | 原生详情/有限评论 | 账号/协议/分页限制 |
| Search Mode | smart/required/off | 只管两工具，失败完成非有效证据 |
| 设置与测试 | 配置/凭证/额度 | 本机peer信任，非多租户认证 |

**流程与依赖**

#### 启动与依赖

| 条件 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| DSH web/settings/credentials等 | 标准Web接口与配置 | 固定peer ABI与本机配置面 |
| Provider账号或SearXNG | 通用搜索/提取 | 实际额度/费用/可达性自核 |
| Chrome/Edge专用profile（平台） | 原生站内/详情 | 人工登录、敏感站点数据与资源 |
| 原始来源复核 | 结果采用 | 不靠成功text或false标记判全文 |


#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 核宿主并设置源/目的地 | 操作者 | Key只发可信服务，预算明确 |
| 可选登录平台 | 用户 | 专用profile与账号授权 |
| 按任务搜索或抓URL | Agent | 分清片段/原生/降级 |
| 核来源/完整性/支出 | 用户/Agent | 原页确认，必要时人工补证 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH Web/凭证/设置服务；可选服务商额度、自建SearXNG或Chrome/Edge专用profile | 选Provider/授权端点、设密钥和预算，平台需人工登录；工时未知 | 金额随服务商/模式与账户，不根据本地调用数推价格；原生平台不是免维护保证 |
| 持续使用 | 每个失败尝试/备用源请求、正文抓取/浏览器资源与宿主模型上下文 | 检查来源/时效/降级、登录失效和截断，人工核证，耗时未知 | 单attempt超时不是总链预算；多Key/深搜/失败可计费，额度显示不等硬消费上限 |
| 失败恢复 | 重试或更换源、浏览器profile/凭证重配资源 | 核失败分类、手动补抓/核全文，必要时停浏览器/重登 | reset删除专用profile需重建登录；第三方调用/账单不可由本插件回滚，工时金额未知 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多源检索可用性 | 选路/健康/错误分类 | 同条件召回/可用率与总账单 |
| 统一语义 | hints到原生参数 | 正则歧义/不同源保义程度 |
| 平台详情 | 专用profile/有限评论 | 全量分页/OCR/长期协议稳定 |
| 结果完整性 | 底层大小预算 | outer包装丢截断/finalURL，需核原页 |

> **思考**：统一外包装丢截断/最终URL/检索方式，off仅限制两Web工具、required失败完成也放行；通用页DNS预检未绑定最终socket。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：在标准Web接口下保留服务商特性、健康容灾、自定义协议与原生平台接线，减少逐接口维护。详见[Q01](#research-q01)。

在标准Web接口下保留服务商特性、健康容灾、自定义协议与原生平台接线，减少逐接口维护。详见[Q01](#research-q01)。

共享pool/finally释放、声明式单次插值、privileged配置面和出站分层可借鉴；全链字段保真/策略范围及异步CAS仍需核。详见[Q08](#research-q08)。

<a id="detail-section-5"></a>

### 1.4 主要限制

统一外包装丢截断/最终URL/检索方式，off仅限制两Web工具、required失败完成也放行；通用页DNS预检未绑定最终socket。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可信本机公开任务试用并核原始来源/预算，严格隔离/全量内容要求先核具体缺口。详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

多源适配/容灾与安全分层可核；策略范围及生产完整性投影受限；检索收据假设未验证。

- 已检查：作者 README、包清单、源码路径 README.zh-CN.md、README.md、package.json、lib/host/index.js、lib/host/registry.js、lib/host/pool.js、lib/host/fallback.js、lib/host/search-hints.js、lib/host/search-mode-runtime.js、lib/host/generic-fetch.js、lib/host/fetch-security.js、lib/host/fetch-proxy.js、lib/host/provider-transport.js、lib/host/routes.js、lib/host/custom-provider-schema.js、lib/host/providers/custom-compatible.js、lib/host/providers/tavily.js、lib/host/providers/exa.js、lib/host/providers/searxng.js、lib/host/quota.js、lib/host/sources/registry.js、lib/host/sources/xiaohongshu.js、lib/host/sources/x.js、lib/host/sources/comments.js、lib/host/browser/index.js、lib/host/browser/paths.js、lib/host/browser/profile-store.js、lib/host/browser/process-manager.js、lib/host/browser/session-manager.js、test/generic-fetch.test.ts、test/custom-provider-security.test.ts、test/runtime-scoping.test.ts、test/provider-contracts.test.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定发布lib/host入口、执行器、模式、通用fetch/出站、配置/自定义协议、平台路由/browser profile/lease与有限评论关键链；Tavily/Exa原生映射代表，未穷尽每家服务实时API；代表TS测试只读不执行。
- 下一步：固定公开任务对照单源，按坏Key/429/多源失败/零结果/裁剪/重定向/DNS变化/off其他网络及平台分页检验收据与总成本。

**分析版本**

- **仓库**：[A3Boy/dsh-web-tools](https://github.com/A3Boy/dsh-web-tools)
- **版本号**：0.3.7（[固定提交 bb68082](https://github.com/A3Boy/dsh-web-tools/tree/bb68082d1274dc0d28ed5921bb08c7b5070fae7f)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

从源到工具贯穿策略/完整性/成本收据，并给page fetch预检IP绑定；按裁剪/降级/DNS/模式与预算反例比较误用，未验证。详见[Q09](#research-q09)。

固定公开任务对照单源，按坏Key/429/多源失败/零结果/裁剪/重定向/DNS变化/off其他网络及平台分页检验收据与总成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 851 | — | — | 9327 |
| .mjs | source | 17 | 1927 | 1571 | 154 | — |
| .js | source | 97 | 24932 | 21923 | 3751 | — |
| .cjs | source | 6 | 1213 | 978 | 129 | — |
| .ts | source | 86 | 18544 | 14085 | 3047 | — |
| .tsx | source | 11 | 4780 | 4282 | 302 | — |
| .ts | test | 45 | 9926 | 8249 | 940 | — |
| .mjs | test | 4 | 1093 | 885 | 146 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/A3Boy/dsh-web-tools/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=grey&logo=github&style=flat)](https://github.com/A3Boy/dsh-web-tools/issues?q=is%3Aissue+created%3A2026-09-22T10%3A00%3A13.263Z..2026-10-22T10%3A00%3A13.263Z) [![近30天关闭 4](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=grey&logo=github&style=flat)](https://github.com/A3Boy/dsh-web-tools/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T10%3A00%3A13.263Z..2026-10-22T10%3A00%3A13.263Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：统一多源Web/社媒检索怎样兼顾语义、容灾、授权与可核结果完整性？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它给谁提供什么可验收交付，贡献在哪里？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要通用网页和社媒资料、又不想分别维护多套Agent工具的人。它注册ctx.web搜索/抓取Provider，沿DSH标准web_search/web_fetch交付URL、标题、片段或文本；8类内置通用源、可声明式自定义源、X/小红书专用浏览器来源共同在一条接口下服务。原基线为单Provider或手工切换接口。合格交付应能确认实际后端、检索方式、时间/范围、错误及截断，而非只看工具成功或片段很多。

核心贡献是SearchHints到原生参数的适配、多Key/Provider健康与fallback、配置面凭证/出站策略及平台来源接线，减少“所有源仅共同最小能力”的取舍。它不是自建搜索引擎，也不认证网页事实或平台评论代表性。普通检索与原生站内/评论具有不同证据等级，不能因统一返回字符串就互相替代。发布版最外层还会丢部分backend/retrievalMode/truncated，后文说明其保证被收窄。

#### 证据与依据

**依据 1 · 源码核查**：[README.zh-CN.md:30-37](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/README.zh-CN.md#L30-L37)

作者任务与统一接入。

```text
## 它解决什么问题

当联网能力只依赖一个 Web Provider 时，额度耗尽、限流或服务异常都可能直接中断检索；而简单接入多个搜索 API，往往又只能使用它们共同支持的基础能力，没有真正发挥不同搜索源各自擅长的搜索模式、分类、时效、域名策略和正文提取能力。

dsh-web-tools 将 Exa、Tavily、Firecrawl、Parallel、Brave、You.com、Jina、SearXNG，以及小红书、Twitter / X 接入 DSH 标准 `web_search` / `web_fetch`。

在统一 DSH 工具接口的同时，dsh-web-tools 通过 SearchHints 归一化查询意图，再针对不同 Provider 分别编译为其支持的原生参数，尽可能使用各家的分类、时效、域名、地区、深度搜索与正文提取能力；同时通过多 API Key、Provider Fallback 和平台专用浏览器会话，提高整个联网链路的可用性。

```

**依据 2 · 源码核查**：[lib/host/index.js:240-298](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/index.js#L240-L298)

共享执行器与平台注册。

<details>
<summary>查看原文（59行）</summary>

```text
    // ONE shared pool store for search + fetch: they see the same key usage
    // and health, and rebuild only when a credential actually changes.
    const poolStore = createPoolStore(resolveKeys);
    // ONE shared health store so search + fetch respect the same cooldowns.
    const healthStore = createProviderHealthStore();
    const sourceRegistry = new SpecializedSourceRegistry();
    const generalSearchProvider = createSearchProvider(resolveRuntimeConfig, resolveKeys, {
        record: (e) => stats.record({ ...e, at: Date.now() }),
    }, undefined, poolStore, healthStore, resolveSnapshot);
    const generalFetchProvider = createFetchProvider(resolveRuntimeConfig, resolveKeys, undefined, poolStore, healthStore, undefined, resolveSnapshot);
    sourceRegistry.setFallbackProviders(generalSearchProvider, generalFetchProvider);
    // Sync platformEnabled from config on boot and live updates
    configHandle.onMounted(() => {
        const cfg = readConfig();
        if (cfg.platformEnabled) {
            sourceRegistry.setPlatformEnabled(cfg.platformEnabled);
        }
    });
    // Wrap search provider with SpecializedSourceRouter for XHS / X transparent platform handling
    const routedSearchProvider = {
        id: PROVIDER_ID,
        available: () => generalSearchProvider.available(),
        search: async (request, signal) => {
            const outcome = await sourceRegistry.search(request.query, { maxResults: request.maxResults, hints: extractSearchHints(request.query) }, signal);
            if (outcome.error) {
                throw new Error(`[${outcome.error.code}] ${outcome.error.message}`);
            }
            return {
                sources: outcome.items.map((item) => ({
                    url: item.url,
                    title: item.title,
                    snippet: item.snippet,
                    publishedAt: item.publishedAt,
                })),
                truncated: false,
            };
        },
    };
    ctx.web.registerSearchProvider(routedSearchProvider);
    // Wrap fetch provider with SpecializedSourceRouter
    const routedFetchProvider = {
        id: `${PROVIDER_ID}-fetch`,
        available: () => generalFetchProvider.available(),
        fetch: async (request, signal) => {
            const outcome = await sourceRegistry.fetch(request.url, signal);
            return toRoutedFetchResponse(request.url, outcome);
        },
    };
    ctx.web.registerFetchProvider(routedFetchProvider);
    // Specialized Sources: Register Xiaohongshu and Twitter/X with NativeBrowserRuntime
    const nativeRuntime = createNativeBrowserRuntime();
    const xhsSource = new XiaohongshuSource(nativeRuntime);
    const xSource = new XSource(nativeRuntime);
    sourceRegistry.registerSource(xhsSource);
    sourceRegistry.registerSource(xSource);
    // Hook NativeBrowserRuntime lifecycle into Cordis effect
    ctx.effect(() => {
        return () => {
            nativeRuntime.dispose().catch(() => { });
```

</details>

**依据 3 · 源码核查**：[lib/host/registry.js:84-113](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/registry.js#L84-L113)

available非密钥就绪。

<details>
<summary>查看原文（30行）</summary>

```text
    };
    /** Whether one source can run without a credential. */
    const keylessOf = (sourceId, adapter, snapshot) => {
        const entry = snapshot?.get(sourceId);
        if (entry)
            return entry.keyless;
        return isKeylessSelfHosted(adapter);
    };
    return {
        id: PROVIDER_ID,
        /**
         * "Web Search provider service available": the plugin is enabled AND the
         * configured chain contains at least one enabled adapter. This deliberately
         * does NOT check that an API key is configured — keys are resolved lazily
         * per search and a missing key surfaces as an auth failure at call time.
         * UI copy treats this as "service available" (a chain provider exists), not
         * "a credential is ready"; per-key readiness is shown in the settings card.
         */
        available() {
            const cfg = resolveConfig();
            if (!cfg.enabled)
                return false;
            const snapshot = resolveSnapshot?.();
            const baseChain = fallbackChain({
                defaultProvider: cfg.defaultProvider,
                fallbackOrder: cfg.fallbackOrder,
            });
            const chain = resolveSearchChain(baseChain, cfg.searchRoutingPolicy ?? "ordered");
            return chain.some((name) => {
                if (cfg.enabledProviders[name] === false)
```

</details>

**依据 4 · 源码核查**：[lib/host/sources/registry.js:90-133](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/sources/registry.js#L90-L133)

平台/通用来源分流。

<details>
<summary>查看原文（44行）</summary>

```text
                return { items, retrievalMode: "general-web" };
            }
            return { items: [] };
        }
        const source = this.sources.get(platform);
        if (!source || !this.isPlatformEnabled(platform)) {
            return fallbackSearchToGeneralWeb(query, platform, this.fallbackSearchProvider, req?.maxResults, signal);
        }
        const nativeQuery = req?.hints?.cleanQuery?.trim() || query;
        const outcome = await source.search(nativeQuery, req, signal);
        // If native search succeeded (even 0 results), keep native outcome!
        if (outcome.error === undefined) {
            return { ...outcome, retrievalMode: "native-browser" };
        }
        // Do not hide platform authentication/access failures behind indexed web
        // results. They cannot provide native details or real comments and would
        // make an explicit platform search look successful when it was not.
        if (signal?.aborted || outcome.error.code === "aborted") {
            return outcome;
        }
        if (!outcome.error.retryable) {
            return outcome;
        }
        // Retryable browser/runtime failures may still use indexed discovery.
        return fallbackSearchToGeneralWeb(query, platform, this.fallbackSearchProvider, req?.maxResults, signal);
    }
    async routeFetch(url, signal) {
        return this.fetch(url, signal);
    }
    async fetch(url, signal) {
        let targetPlatform;
        if (validatePlatformUrl(url, "xiaohongshu")) {
            targetPlatform = "xiaohongshu";
        }
        else if (validatePlatformUrl(url, "x")) {
            targetPlatform = "x";
        }
        if (!targetPlatform) {
            if (this.fallbackFetchProvider) {
                const res = await this.fallbackFetchProvider.fetch({ url }, signal);
                return {
                    item: {
                        id: res.url || url,
                        title: res.metadata?.title || "Web Page",
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 语义编译和容灾具体如何工作，有什么损失？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

SearchHints是确定性正则/词表，不是语义模型推理。抽site/-site、平台前缀、after/before、主题、freshness和显式国家，中文语言不直接等中国、global/多国抑制单国偏置。Tavily将news/finance、日期/域名/国家编原生字段，Exa将research→publication和发布日范围，SearXNG映categories/time_range/language，各源支持范围不同。优点是意图结构复用，限制是词法歧义、日期合法性/跨语境与字段未支持时的退化，需核实际结果，不能称完整保义编译。

搜索有ordered/round-robin/random候选链；每Provider按健康key的inFlight、uses、固定顺序选，reserve/finally release共享search/fetch池，auth失败才同源换Key；429/网络/超时/5xx转下一源，Retry-After冷却避免无效请求。auth坏Key留不健康直到凭证实际变化，不是每次全池自动reset，pool模块旧注释不可替执行器语义。未知错误code默认retryable，只有bad-request/config停链、aborted终止，可能将未知协议错误变成多源开销。fetch只取一个健康Key，auth失败转下一Provider，不同于search同源循环；非重试fetch错误break native循环后仍可generic fallback。每尝试signal超时但需adapter实际受理abort，整个链总时延/费用仍受链长和宿主工具预算约束。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host/search-hints.js:121-183](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/search-hints.js#L121-L183)

词法抽取/主题。

<details>
<summary>查看原文（63行）</summary>

```text
    const rawQuery = (query ?? "").trim();
    let cleanQuery = rawQuery;
    // 1. Extract domain include/exclude
    const includeDomains = [];
    const excludeDomains = [];
    let match;
    // Extract -site:
    const excludeRe = new RegExp(SITE_EXCLUDE_RE.source, "gi");
    while ((match = excludeRe.exec(rawQuery)) !== null) {
        const domain = match[1]?.toLowerCase();
        if (domain && !excludeDomains.includes(domain)) {
            excludeDomains.push(domain);
        }
    }
    cleanQuery = cleanQuery.replace(SITE_EXCLUDE_RE, " ");
    // Extract site:
    const includeRe = new RegExp(SITE_INCLUDE_RE.source, "gi");
    while ((match = includeRe.exec(rawQuery)) !== null) {
        const domain = match[1]?.toLowerCase();
        if (domain && !includeDomains.includes(domain)) {
            includeDomains.push(domain);
        }
    }
    cleanQuery = cleanQuery.replace(SITE_INCLUDE_RE, " ");
    // 1.1 Extract Platform Hint (Xiaohongshu vs X/Twitter)
    let platform;
    let platformExplicit = false;
    const isXhsDomain = includeDomains.some((d) => d.includes("xiaohongshu.com") || d.includes("xhslink.com"));
    const isXDomain = includeDomains.some((d) => d.includes("x.com") || d.includes("twitter.com"));
    if (isXhsDomain || XIAOHONGSHU_EXPLICIT_RE.test(rawQuery)) {
        platform = "xiaohongshu";
        platformExplicit = true;
        cleanQuery = cleanQuery.replace(XIAOHONGSHU_CLEAN_RE, " ");
    }
    else if (isXDomain || X_EXPLICIT_RE.test(rawQuery)) {
        platform = "x";
        platformExplicit = true;
        cleanQuery = cleanQuery.replace(X_ROUTE_PREFIX_RE, " ").replace(X_CLEAN_RE, " ");
    }
    // 2. Extract explicit after: / before: dates
    let afterDate;
    let beforeDate;
    const afterMatch = AFTER_DATE_RE.exec(cleanQuery);
    if (afterMatch) {
        afterDate = afterMatch[1];
        cleanQuery = cleanQuery.replace(AFTER_DATE_RE, " ");
    }
    const beforeMatch = BEFORE_DATE_RE.exec(cleanQuery);
    if (beforeMatch) {
        beforeDate = beforeMatch[1];
        cleanQuery = cleanQuery.replace(BEFORE_DATE_RE, " ");
    }
    // 3. Topic classification (needed before freshness rules to avoid over-constraining evergreen technical queries)
    let topic = "general";
    if (includeDomains.some((d) => d.includes("github.com") || d.includes("gitlab.com") || d.includes("stackoverflow.com")) ||
        CODE_INDICATORS.some((re) => re.test(rawQuery))) {
        topic = "code";
    }
    else if (includeDomains.some((d) => d.includes("arxiv.org")) ||
        RESEARCH_INDICATORS.some((re) => re.test(rawQuery))) {
        topic = "research";
    }
    else if (FINANCE_INDICATORS.some((re) => re.test(rawQuery))) {
```

</details>

**依据 2 · 源码核查**：[lib/host/search-hints.js:184-268](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/search-hints.js#L184-L268)

时效与语言国家。

<details>
<summary>查看原文（85行）</summary>

```text
        topic = "finance";
    }
    else if (NEWS_INDICATORS.some((re) => re.test(rawQuery))) {
        topic = "news";
    }
    // 4. Extract freshness preset:
    // Hard freshness (day/week): applied across all topics.
    // Soft freshness (month/year keywords like latest/recent/current): applied ONLY if topic === "news"
    // or when explicit after/before is given, to avoid truncating evergreen docs like "latest React docs".
    let freshnessPreset;
    if (!afterDate && !beforeDate) {
        if (DAY_INDICATORS.some((re) => re.test(rawQuery))) {
            freshnessPreset = "day";
        }
        else if (WEEK_INDICATORS.some((re) => re.test(rawQuery))) {
            freshnessPreset = "week";
        }
        else if (topic === "news" && MONTH_INDICATORS.some((re) => re.test(rawQuery))) {
            freshnessPreset = "month";
        }
        else if (topic === "news" && YEAR_INDICATORS.some((re) => re.test(rawQuery))) {
            freshnessPreset = "year";
        }
    }
    const freshness = freshnessPreset || afterDate || beforeDate
        ? {
            preset: freshnessPreset,
            after: afterDate ?? (freshnessPreset ? calculateAfterDate(freshnessPreset, now) : undefined),
            before: beforeDate,
        }
        : undefined;
    // 5. Official / Prefer domains
    const preferOfficial = OFFICIAL_PREFERENCE_INDICATORS.some((re) => re.test(rawQuery));
    const preferDomains = [];
    if (includeDomains.length > 0) {
        // If includeDomains is present, it's also a preferred domain
        preferDomains.push(...includeDomains);
    }
    const domains = includeDomains.length > 0 || excludeDomains.length > 0 || preferDomains.length > 0 || preferOfficial
        ? {
            include: includeDomains.length > 0 ? includeDomains : undefined,
            exclude: excludeDomains.length > 0 ? excludeDomains : undefined,
            prefer: preferDomains.length > 0 ? preferDomains : undefined,
            preferOfficial,
        }
        : undefined;
    // 6. Locale hint detection (language decoupled from country!)
    // ONLY set country when explicitly mentioned in query text.
    let language;
    const hasChinese = /[\u4e00-\u9fa5]/.test(rawQuery);
    const hasJapanese = /[\u3040-\u30ff]/.test(rawQuery);
    if (hasChinese) {
        language = "zh";
    }
    else if (hasJapanese) {
        language = "ja";
    }
    let country;
    const isGlobalScope = GLOBAL_SCOPE_INDICATORS.some((re) => re.test(rawQuery));
    if (!isGlobalScope) {
        const matchedCountries = EXPLICIT_COUNTRY_PATTERNS.filter((p) => p.re.test(rawQuery)).map((p) => p.country);
        const uniqueCountries = [...new Set(matchedCountries)];
        if (uniqueCountries.length === 1) {
            country = uniqueCountries[0];
        }
    }
    const locale = language || country ? { language, country } : undefined;
    // Clean extra whitespaces in cleanQuery
    cleanQuery = cleanQuery
        .replace(/^[\s:：,，;；\-—]+|[\s:：,，;；\-—]+$/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    if (!cleanQuery)
        cleanQuery = rawQuery;
    return {
        topic,
        platform,
        platformExplicit: platformExplicit ? true : undefined,
        freshness,
        domains,
        locale,
        cleanQuery,
        rawQuery,
    };
}
```

</details>

**依据 3 · 源码核查**：[lib/host/providers/tavily.js:32-84](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/providers/tavily.js#L32-L84)

原生参数。

<details>
<summary>查看原文（53行）</summary>

```text
 */
export function buildTavilySearchBody(query, maxResults, options, hints) {
    const max_results = Math.min(Math.max(maxResults ?? 5, 1), 20);
    const cleanQ = hints?.cleanQuery ? hints.cleanQuery : query;
    const requestBody = {
        query: cleanQ,
        max_results,
        include_answer: false,
    };
    if (options?.autoParameters) {
        requestBody.auto_parameters = true;
    }
    else {
        const depth = options?.searchDepth ?? "basic";
        requestBody.search_depth = depth;
        // Tavily docs: chunks_per_source is supported on basic, advanced, fast (not ultra-fast)
        if (depth !== "ultra-fast" && typeof options?.chunksPerSource === "number") {
            requestBody.chunks_per_source = options.chunksPerSource;
        }
    }
    // 1. Topic mapping: Tavily accepts general, news, and finance.
    if (hints?.topic === "news" || hints?.topic === "finance") {
        requestBody.topic = hints.topic;
    }
    // 2. Freshness & date filtering
    if (hints?.freshness?.preset) {
        // Tavily does not allow time_range together with start_date or end_date.
        requestBody.time_range = hints.freshness.preset;
    }
    else {
        if (hints?.freshness?.after) {
            requestBody.start_date = hints.freshness.after;
        }
        if (hints?.freshness?.before) {
            requestBody.end_date = hints.freshness.before;
        }
    }
    // 3. Domain constraints
    if (hints?.domains?.include && hints.domains.include.length > 0) {
        requestBody.include_domains = hints.domains.include;
    }
    if (hints?.domains?.exclude && hints.domains.exclude.length > 0) {
        requestBody.exclude_domains = hints.domains.exclude;
    }
    // 4. Country
    if (hints?.locale?.country) {
        requestBody.country = hints.locale.country;
    }
    return requestBody;
}
export const TAVILY_META = {
    name: "tavily",
    label: "Tavily",
```

</details>

**依据 4 · 源码核查**：[lib/host/providers/exa.js:30-72](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/providers/exa.js#L30-L72)

Exa映射。

<details>
<summary>查看原文（43行）</summary>

```text
 */
export function buildExaSearchBody(query, numResults, options, hints) {
    const cleanQ = hints?.cleanQuery ? hints.cleanQuery : query;
    const body = {
        query: cleanQ,
        type: options?.searchType ?? "auto",
        numResults,
        contents: {
            highlights: true,
            ...(typeof options?.maxAgeHours === "number" ? { maxAgeHours: options.maxAgeHours } : {}),
        },
    };
    // 1. Category mapping (Exa officially uses "publication" for papers/academic, "news", "financial report")
    if (hints?.topic === "research") {
        body.category = "publication";
    }
    else if (hints?.topic === "news") {
        body.category = "news";
    }
    else if (hints?.topic === "finance") {
        body.category = "financial report";
    }
    // 2. Domain filters
    if (hints?.domains?.include && hints.domains.include.length > 0) {
        body.includeDomains = hints.domains.include;
    }
    if (hints?.domains?.exclude && hints.domains.exclude.length > 0) {
        body.excludeDomains = hints.domains.exclude;
    }
    // 3. Date filters (ISO 8601)
    if (hints?.freshness?.after) {
        body.startPublishedDate = `${hints.freshness.after}T00:00:00.000Z`;
    }
    if (hints?.freshness?.before) {
        body.endPublishedDate = `${hints.freshness.before}T23:59:59.999Z`;
    }
    // 4. User location
    if (hints?.locale?.country) {
        body.userLocation = hints.locale.country;
    }
    return body;
}
/**
```

</details>

**依据 5 · 源码核查**：[lib/host/registry.js:140-263](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/registry.js#L140-L263)

共享池/健康和失败决策。

<details>
<summary>查看原文（124行）</summary>

```text
                    continue;
                const entryInfo = snapshot?.get(providerName);
                if (entryInfo?.config && entryInfo.config.enabled === false) {
                    attempts.push({ provider: providerName, outcome: "skipped-disabled" });
                    continue;
                }
                const adapter = adapterFor(providerName, snapshot);
                if (!adapter) {
                    attempts.push({ provider: providerName, outcome: "skipped-no-adapter" });
                    continue;
                }
                let entries = await pools.poolOf(providerName);
                const keyless = keylessOf(providerName, adapter, snapshot);
                if (entries.length === 0 && keyless) {
                    // Keyless sources (self-hosted SearXNG, or a custom source with auth
                    // mode "none") execute with an empty key.
                    entries = [new PoolEntry("", 0)];
                }
                else if (entries.length === 0) {
                    attempts.push({ provider: providerName, outcome: "skipped-no-keys" });
                    continue;
                }
                // Auth-invalid keys stay unhealthy until the credential actually
                // changes (refreshPool preserves healthy=false for persisted keys).
                // If the whole pool is unusable, skip this provider — do NOT reset.
                let usable = entries.filter((e) => e.healthy);
                if (usable.length === 0) {
                    attempts.push({ provider: providerName, outcome: "skipped-no-healthy-keys" });
                    continue;
                }
                // Provider-level cooldown (Retry-After). The store uses its own clock
                // (injectable for tests) — zero HTTP when cooling down.
                if (healthStore?.isCoolingDown(providerName)) {
                    attempts.push({ provider: providerName, outcome: "skipped-cooldown" });
                    continue;
                }
                // Provider-internal key failover: on AUTH failures only, try the next
                // healthy key in the SAME provider before falling back to another
                // provider. Non-auth failures (429/5xx/network/timeout) do not rotate
                // keys — they fall through to the next provider directly.
                let providerLevelDecision = null;
                // Base URL from the request snapshot, so an override edit mid-request
                // cannot make one attempt dial a different host than another.
                const searchBaseUrl = entryInfo?.builtIn
                    ? entryInfo.endpoint?.effectiveBaseUrl
                    : cfg.providerBaseUrls[providerName];
                while (usable.length > 0) {
                    const index = selectIndex(entries);
                    const entry = entries[index];
                    if (entry)
                        reserveKey(entries, index);
                    const started = Date.now();
                    const providerOptions = cfg.providerOptions?.[providerName];
                    try {
                        const outcome = await runWithTimeout((s) => adapter.search(request.query, maxResults, entry?.key ?? "", searchBaseUrl, {
                            signal: s,
                            options: providerOptions,
                            hints: searchHints,
                        }), cfg.providerAttemptTimeoutMs, signal);
                        if (entry)
                            markUsed(entries, index);
                        const latencyMs = Date.now() - started;
                        attempts.push({ provider: providerName, outcome: "success", latencyMs });
                        stats.record({ provider: providerName, outcome: "success", latencyMs });
                        return {
                            ...outcome,
                            truncated: false,
                            attempts,
                            backend: providerName,
                        };
                    }
                    catch (error) {
                        const err = toProviderError(error);
                        const latencyMs = Date.now() - started;
                        const decision = classifyFailure(err);
                        // Caller cancellation terminates the whole chain — never fall back.
                        if (decision === "terminal") {
                            providerLevelDecision = "terminal";
                            lastError = err;
                            attempts.push({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
                            stats.record({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
                            break;
                        }
                        if (decision === "non-retryable") {
                            providerLevelDecision = "break";
                            lastError = err;
                            attempts.push({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
                            stats.record({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
                            break;
                        }
                        // retryable:
                        if (err.code === "auth") {
                            // key indicted → mark unhealthy, try the next key in this pool
                            markUnhealthy(entries, index);
                            attempts.push({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
                            stats.record({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
                            usable = entries.filter((e) => e.healthy);
                            continue;
                        }
                        // non-auth retryable (429/5xx/network/timeout) → next provider
                        lastError = err;
                        // Only rate-limit errors carry a server-requested cooldown.
                        if (err.code === "rate-limit" && typeof err.retryAfterMs === "number" && err.retryAfterMs > 0) {
                            healthStore?.cooldownFor(providerName, err.retryAfterMs, "rate-limit");
                        }
                        attempts.push({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
                        stats.record({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
                        providerLevelDecision = "next-provider";
                        break;
                    }
                    finally {
                        if (entry)
                            releaseKey(entries, index);
                    }
                }
                if (providerLevelDecision === "terminal")
                    throw toWebError(lastError);
                if (providerLevelDecision === "break")
                    break;
                // else fall through to the next provider in the chain
            }
            const reason = lastError
                ? `${lastError.code}: ${lastError.message}`
                : "no usable provider";
```

</details>

**依据 6 · 源码核查**：[lib/host/registry.js:302-395](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/registry.js#L302-L395)

fetch不同failover。

<details>
<summary>查看原文（94行）</summary>

```text
                    continue;
                const adapter = nativeEntry?.adapter ?? adapterRegistry[providerName];
                // Custom sources are search-only (fetchCapable=false), so they are
                // skipped here by construction and page fetching keeps using the
                // built-in generic fetcher below.
                if (!adapter || !adapter.fetchCapable)
                    continue; // not a native fetch backend, skip
                const entries = await pools.poolOf(providerName);
                if (entries.length === 0)
                    continue; // no credentials for this backend
                const usable = entries.filter((e) => e.healthy);
                if (usable.length === 0)
                    continue; // all keys auth-unhealthy, skip provider
                // Provider cooldown (Retry-After): skip without HTTP call.
                if (healthStore?.isCoolingDown(providerName))
                    continue;
                const index = selectIndex(entries);
                const entry = entries[index];
                if (entry)
                    reserveKey(entries, index);
                const providerOptions = cfg.providerOptions?.[providerName];
                // Native fetch endpoints stay on the official host: the base-URL
                // override applies to SEARCH only (see endpoints.ts), because a gateway
                // that proxies search may not proxy extraction.
                const fetchBaseUrl = cfg.providerBaseUrls[providerName];
                try {
                    const { text } = await runWithTimeout((sig) => adapter.fetch(request.url, entry?.key ?? "", fetchBaseUrl, {
                        signal: sig,
                        options: providerOptions,
                    }), cfg.providerAttemptTimeoutMs, signal);
                    if (entry)
                        markUsed(entries, index);
                    attempts.push({ provider: providerName, outcome: "success" });
                    return {
                        url: request.url,
                        statusCode: 200,
                        body: { kind: "text", content: text },
                        truncated: false,
                        backend: providerName,
                    };
                }
                catch (error) {
                    const err = toProviderError(error);
                    if (err.code === "auth")
                        markUnhealthy(entries, index);
                    if (err.code === "rate-limit" && typeof err.retryAfterMs === "number" && err.retryAfterMs > 0) {
                        healthStore?.cooldownFor(providerName, err.retryAfterMs, "rate-limit");
                    }
                    lastNativeError = err;
                    attempts.push({ provider: providerName, outcome: `failed:${err.code}` });
                    const decision = classifyFailure(err);
                    // Caller cancellation or terminal URL/SSRF errors should abort immediately without fallback
                    if (decision === "terminal") {
                        const terminalErr = toWebError(error);
                        terminalErr.attempts = attempts;
                        throw terminalErr;
                    }
                    if (decision === "non-retryable")
                        break;
                    // retryable → try next fetch-capable provider in the chain
                }
                finally {
                    if (entry)
                        releaseKey(entries, index);
                }
            }
            // If caller aborted, do not proceed to built-in generic fetch
            if (signal?.aborted) {
                const abortErr = new WebToolsWebError("web fetch aborted by caller");
                abortErr.code = "WEB_ABORTED";
                abortErr.attempts = attempts;
                throw abortErr;
            }
            // 2. Fallback to built-in generic HTTP fetcher (Defuddle + linkedom)
            try {
                const res = await genericFetcher(request.url, {
                    signal,
                    timeoutMs: cfg.providerAttemptTimeoutMs,
                });
                attempts.push({ provider: "builtin-http", outcome: "success" });
                return {
                    url: res.finalUrl,
                    statusCode: res.statusCode,
                    body: { kind: "text", content: res.content },
                    truncated: res.truncated,
                    backend: res.backend,
                    metadata: {
                        title: res.title,
                        author: res.author,
                        publishedAt: res.publishedAt,
                        description: res.description,
                    },
                };
            }
```

</details>

**依据 7 · 源码核查**：[lib/host/fallback.js:16-34](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/fallback.js#L16-L34)

未知错误决策。

<details>
<summary>查看原文（19行）</summary>

```text
export const RETRYABLE = new Set(["rate-limit", "timeout", "server", "network", "unavailable", "auth"]);
/** Error kinds that never trigger fallback. */
export const NON_RETRYABLE = new Set(["bad-request", "config"]);
/** Error kinds that terminate the whole chain (caller cancellation). */
export const TERMINAL = new Set(["aborted"]);
/**
 * Classify a provider failure.
 * @param opts
 * @param opts.code machine code from the provider adapter.
 * @returns {"retryable"|"non-retryable"|"terminal"}
 */
export function classifyFailure(opts) {
    const { code } = opts;
    if (TERMINAL.has(code))
        return "terminal";
    if (RETRYABLE.has(code))
        return "retryable";
    if (NON_RETRYABLE.has(code))
        return "non-retryable";
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 关闭/始终联网可以理解成什么保证？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

每session mode存在内存，turn开始冻结required/disabled用于提示和结束判断；Agent自己scope注册listeners，off时限制可见工具并monotonic guard拒web_search/web_fetch，首次step注入说明，unload撤监听和限制。相比仅提示不联网，是针对这两个工具名的运行前守卫。它不能阻止shell/curl、其他网络工具、模型服务或设置页的测试/额度/版本请求，也不会因为off就关闭已有CDP/浏览器，故README“绝不产生外部网络请求/物理隔离”超出本层范围。

required的完成条件是任意search或fetch工具result事件，不管isError是否成功；success另存但停止判定只看completed。失败已返回也可结束，符合“失败说明未知”的降级，不等每轮已取得有效外部权威依据。若没调则一次steer纠正，再停止则cancel；不能保证相关性、引用质量或证据充分。mode中途变化时liveguard/restriction读当前off，冻结required提示/turn记录却仍旧，需要向读者区分“当前工具禁止”与“本轮完成目标”。普通mode不经磁盘保存，session重建依默认auto。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host/search-mode-runtime.js:52-131](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/search-mode-runtime.js#L52-L131)

内存状态/完成与成功分开。

<details>
<summary>查看原文（80行）</summary>

```text
export class SearchModeRuntime {
    modes = new Map();
    turns = new Map();
    searchAvailable;
    constructor(searchAvailable = () => true) {
        this.searchAvailable = searchAvailable;
    }
    getMode(sessionId) {
        return this.modes.get(sessionId) ?? "auto";
    }
    setMode(sessionId, mode) {
        if (mode === "auto")
            this.modes.delete(sessionId);
        else
            this.modes.set(sessionId, mode);
    }
    /** True when this session has web search switched OFF. */
    isOff(sessionId) {
        return this.getMode(sessionId) === "off";
    }
    /** Whether a usable search provider currently exists (drives `available`). */
    available() {
        try {
            return this.searchAvailable() === true;
        }
        catch {
            return true;
        }
    }
    /**
     * Begin (or re-read) a turn. The `required` flag is frozen when a NEW turn
     * begins; mid-turn mode flips only affect the NEXT turn (no race).
     */
    beginTurn(sessionId, turn) {
        const existing = this.turns.get(sessionId);
        if (existing?.turn === turn)
            return existing;
        const state = {
            turn,
            required: this.getMode(sessionId) === "required",
            disabled: this.isOff(sessionId),
            webSearchCompleted: false,
            webSearchSucceeded: false,
            webFetchCompleted: false,
            webFetchSucceeded: false,
            correctionCount: 0,
        };
        this.turns.set(sessionId, state);
        return state;
    }
    /**
     * Record that a web_search call COMPLETED. Completion (even a total provider
     * failure) satisfies "must research first"; success additionally records that
     * fresh web data was available.
     */
    markSearchResult(sessionId, succeeded) {
        const state = this.turns.get(sessionId);
        if (!state)
            return;
        state.webSearchCompleted = true;
        state.webSearchSucceeded ||= succeeded;
    }
    /**
     * Record that a web_fetch call COMPLETED. A fetch also satisfies the
     * "must research first" requirement — a user-supplied URL is a valid
     * research action and must not be gated behind a pointless search.
     */
    markFetchResult(sessionId, succeeded) {
        const state = this.turns.get(sessionId);
        if (!state)
            return;
        state.webFetchCompleted = true;
        state.webFetchSucceeded ||= succeeded;
    }
    getTurn(sessionId) {
        return this.turns.get(sessionId);
    }
    /** Drop every state for a disposed agent/session. */
    clear(sessionId) {
        this.modes.delete(sessionId);
```

</details>

**依据 2 · 源码核查**：[lib/host/search-mode-runtime.js:233-309](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/search-mode-runtime.js#L233-L309)

per-agent guard和结束门。

<details>
<summary>查看原文（77行）</summary>

```text
 */
export function installSearchModeRuntime(ctx, _deps, runtime, messages) {
    const onCreated = ctx.on("agent/created", (payload) => {
        const agent = payload.agent;
        // Register this agent's listeners inside its own scope so scope-filtered
        // dispatch reaches them; cleaning up when the agent scope unwinds.
        return agent.ctx.effect(() => {
            // ---- layer 1: hide the web tools from this agent's tool list ---------
            // Scoped, so other sessions keep their tools. Applied at turn start and
            // lifted as soon as the mode leaves `off`.
            let liftRestriction;
            const syncRestriction = () => {
                const off = runtime.isOff(agent.id);
                if (off && liftRestriction === undefined) {
                    liftRestriction = agent.ctx.tools?.restrict?.({ deny: [...WEB_TOOL_NAMES] });
                }
                else if (!off && liftRestriction !== undefined) {
                    liftRestriction();
                    liftRestriction = undefined;
                }
            };
            // ---- layer 2: monotonic gate -----------------------------------------
            // Model inertia can still emit a call from history after a toggle; the
            // guard denies it before the body runs and cannot be re-allowed by a
            // later listener.
            const stopGuard = agent.ctx.tools?.guard?.((execution) => runtime.isOff(agent.id) && WEB_TOOL_NAMES.includes(execution.name) ? WEB_DISABLED_DENIAL : undefined);
            const stopPreStep = agent.ctx.on("agent/pre-step", async (payload, next) => {
                const decision = await next();
                if (!decision || decision.kind === "reject")
                    return decision;
                if (payload.signal?.aborted)
                    return decision;
                const state = runtime.beginTurn(agent.id, payload.turn);
                syncRestriction();
                const inject = searchModeStepMessage(state, payload.step, messages);
                if (!inject)
                    return decision;
                const entered = decision;
                // Prepend so the Search Mode policy sits before the user's direct
                // message (the model's last user-role input remains the user query).
                return {
                    kind: "enter",
                    messages: [inject, ...(entered.messages ?? [])],
                };
            });
            const stopResult = agent.ctx.on("tools/result", (exec, result) => {
                if (!exec.agent?.id)
                    return;
                const succeeded = result?.isError === false;
                if (exec?.name === "web_search")
                    runtime.markSearchResult(exec.agent.id, succeeded);
                else if (exec?.name === "web_fetch")
                    runtime.markFetchResult(exec.agent.id, succeeded);
            });
            const stopStopping = agent.ctx.on("agent/turn-stopping", (payload) => {
                if (payload.signal?.aborted)
                    return;
                const state = runtime.getTurn(agent.id);
                if (!state?.required || webResearchCompleted(state))
                    return;
                if (state.correctionCount === 0) {
                    state.correctionCount += 1;
                    agent.steer(messages.correction());
                    return;
                }
                agent.cancel({ kind: "hook", reason: "required web research was not completed" });
            });
            return () => {
                stopPreStep?.();
                stopResult?.();
                stopStopping?.();
                stopGuard?.();
                if (liftRestriction !== undefined) {
                    liftRestriction();
                    liftRestriction = undefined;
                }
                runtime.clear(agent.id);
```

</details>

**依据 3 · 源码核查**：[lib/host/index.js:84-96](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/index.js#L84-L96)

版本检查另行联网。

<details>
<summary>查看原文（13行）</summary>

```text
    if (versionCache && Date.now() - versionCache.fetchedAt < VERSION_CACHE_MS)
        return versionCache.value;
    const fallback = { currentVersion: CURRENT_VERSION, updateAvailable: false };
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        timer.unref?.();
        let response;
        try {
            response = await fetchWithProxy(RELEASES_API, {
                signal: controller.signal,
                headers: {
                    accept: "application/vnd.github+json",
```

</details>

**依据 4 · 源码核查**：[lib/host/routes.js:1013-1043](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/routes.js#L1013-L1043)

管理测试/额度/平台端点。

<details>
<summary>查看原文（31行）</summary>

```text
    "config/get": (deps) => handleConfigGet(deps),
    "config/save": (deps, payload) => handleConfigSave(deps, payload),
    "credentials/set": (deps, payload) => handleCredentialSet(deps, payload),
    "credentials/add-key": (deps, payload) => handleCredentialAddKey(deps, payload),
    "credentials/remove-key": (deps, payload) => handleCredentialRemoveKey(deps, payload),
    "credentials/describe": (deps) => handleCredentialDescribe(deps),
    "test/provider": (deps, payload) => handleTestProvider(deps, payload),
    "test/search": (deps, payload) => handleTestSearch(deps, payload),
    "quota/describe": (deps, payload) => handleQuotaDescribe(deps, payload),
    "version/check": (deps) => handleVersionCheck(deps),
    "search-mode/get": (deps, payload) => handleSearchModeGet(deps, payload),
    "search-mode/set": (deps, payload) => handleSearchModeSet(deps, payload),
    "provider-options/set": (deps, payload) => handleProviderOptionsSet(deps, payload),
    "provider-options/reset": (deps, payload) => handleProviderOptionsReset(deps, payload),
    "provider-options/batch": (deps, payload) => handleProviderOptionsBatchSet(deps, payload),
    "routing/set": (deps, payload) => handleRoutingSet(deps, payload),
    // Issue #9 — custom search sources
    "sources/describe": (deps) => handleSourcesDescribe(deps),
    "sources/create": (deps, payload) => handleSourceCreate(deps, payload),
    "sources/update": (deps, payload) => handleSourceUpdate(deps, payload),
    "sources/delete": (deps, payload) => handleSourceDelete(deps, payload),
    "sources/test": (deps, payload) => handleSourceTest(deps, payload),
    "sources/endpoint-set": (deps, payload) => handleSourceEndpointSet(deps, payload),
    "platform/status": (deps) => handlePlatformStatus(deps),
    "platform/login": (deps, payload) => handlePlatformLogin(deps, payload),
    "platform/stop": (deps, payload) => handlePlatformStop(deps, payload),
    "platform/reset": (deps, payload) => handlePlatformReset(deps, payload),
};
/** Register the fenced `/web-tools/api` prefix. Returns the disposer. */
export function registerRoutes(ctx, deps) {
    return ctx.webServer.register({
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 通用fetch安全链和结果完整性是否闭合？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

generic fetch只允许HTTP(S)、拒userinfo与私网/本地/metadata，预查所有DNS地址，最多5跳手工redirect每跳重验，正文stream5MiB上限、MIME排除二进制/PDF，HTML用linkedom+Defuddle useAsync=false本地提取，失败可保raw。这些防护和截断都有具体实现，但本地解析不等网络不外发，抓取仍请求目标/代理，模型也接文本。

DNS预查函数返回void，generic随后调用fetchWithProxy不带provider模式；fetch-proxy的page/legacy路径普通fetch/ProxyAgent重新解析，严格pinned dispatcher只用于非官方provider覆盖路径。故通用页面“预查即防rebind”不闭合，检查与连接可不同DNS/代理端解析，未复现攻击但不能外推为锁定IP。native第三方fetch先把URL交Provider，通用页URL过滤也不是第三方内部取URL行为的本地全程管控。

完整性投影有确定丢失。generic返回finalUrl/status/truncated/backend/metadata；sources.registry的general分支只把部分字段放item，丢truncated/status/backend，toRoutedFetchResponse再硬置输入url、200和truncated=false，最终工具可能把5MiB裁剪内容表示未截断，redirect最终URL也丢。搜索外包装同样只留sources与false，不暴露attempts/backend/retrievalMode。平台评论的captured/truncated仍嵌在正文，是局部保留，不能补所有抓取完整性。读者应另核原网页，不把成功text当全文。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host/generic-fetch.js:76-129](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/generic-fetch.js#L76-L129)

有界正文。

<details>
<summary>查看原文（54行）</summary>

```text
 * Reads a response stream up to `maxBytes` safely without buffering unbounded streams.
 */
async function readStreamBounded(response, maxBytes, signal) {
    if (!response.body) {
        const text = await response.text();
        return { text, truncated: false };
    }
    const reader = response.body.getReader();
    const chunks = [];
    let totalBytes = 0;
    let truncated = false;
    try {
        while (true) {
            if (signal?.aborted) {
                throw new GenericFetchError("WEB_ABORTED", "Fetch aborted by signal");
            }
            const { done, value } = await reader.read();
            if (done)
                break;
            if (value) {
                if (totalBytes + value.byteLength > maxBytes) {
                    const sliceBytes = maxBytes - totalBytes;
                    if (sliceBytes > 0) {
                        chunks.push(value.subarray(0, sliceBytes));
                        totalBytes += sliceBytes;
                    }
                    truncated = true;
                    // Cancel the rest of the stream to save network bandwidth
                    try {
                        await reader.cancel();
                    }
                    catch {
                        // ignore cancel failure
                    }
                    break;
                }
                chunks.push(value);
                totalBytes += value.byteLength;
            }
        }
    }
    finally {
        reader.releaseLock();
    }
    // Merge chunks into text
    const merged = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
        merged.set(chunk, offset);
        offset += chunk.byteLength;
    }
    const decoder = new TextDecoder("utf-8", { fatal: false, ignoreBOM: true });
    return { text: decoder.decode(merged), truncated };
}
```

</details>

**依据 2 · 源码核查**：[lib/host/generic-fetch.js:167-236](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/generic-fetch.js#L167-L236)

DNS和redirect调用。

<details>
<summary>查看原文（70行）</summary>

```text
        }, timeoutMs);
    }
    try {
        const validateAndResolveUrl = async (rawUrl) => {
            try {
                const parsed = validateFetchUrl(rawUrl);
                await validateFetchDns(parsed.hostname, customDnsLookup, controller.signal);
                return parsed;
            }
            catch (err) {
                if (controller.signal.aborted) {
                    throw new GenericFetchError(abortCause === "timeout" ? "WEB_TIMEOUT" : "WEB_ABORTED", abortCause === "timeout" ? `Fetch timed out after ${timeoutMs}ms` : "Fetch aborted by caller", { url: rawUrl });
                }
                if (err instanceof FetchSecurityError) {
                    throw new GenericFetchError(err.code, err.message, { url: rawUrl });
                }
                throw err;
            }
        };
        let currentParsedUrl = await validateAndResolveUrl(initialUrl);
        let currentUrl = currentParsedUrl.href;
        let hopCount = 0;
        let response;
        // Manual redirect loop to validate SSRF and DNS on every hop
        while (true) {
            if (controller.signal.aborted) {
                throw new GenericFetchError(abortCause === "timeout" ? "WEB_TIMEOUT" : "WEB_ABORTED", abortCause === "timeout" ? `Fetch timed out after ${timeoutMs}ms` : "Fetch aborted by signal");
            }
            if (hopCount > MAX_REDIRECT_HOPS) {
                throw new GenericFetchError("WEB_FETCH_BLOCKED", `Too many redirects (exceeded limit of ${MAX_REDIRECT_HOPS})`, { url: currentUrl });
            }
            try {
                response = await customFetch(currentUrl, {
                    method: "GET",
                    headers: {
                        "User-Agent": DEFAULT_USER_AGENT,
                        Accept: "text/html,application/xhtml+xml,application/json,text/plain,text/markdown;q=0.9,*/*;q=0.8",
                        "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
                    },
                    redirect: "manual",
                    signal: controller.signal,
                });
            }
            catch (err) {
                if (controller.signal.aborted) {
                    throw new GenericFetchError(abortCause === "timeout" ? "WEB_TIMEOUT" : "WEB_ABORTED", abortCause === "timeout" ? `Fetch timed out after ${timeoutMs}ms` : "Fetch aborted by signal");
                }
                throw new GenericFetchError("WEB_NETWORK", `Network error fetching "${currentUrl}": ${err instanceof Error ? err.message : String(err)}`, { url: currentUrl });
            }
            // Handle HTTP Redirects (301, 302, 303, 307, 308)
            if (response.status === 301 ||
                response.status === 302 ||
                response.status === 303 ||
                response.status === 307 ||
                response.status === 308) {
                const location = response.headers.get("location");
                if (!location) {
                    throw new GenericFetchError("WEB_HTTP_ERROR", `Redirect status ${response.status} missing Location header`, {
                        statusCode: response.status,
                        url: currentUrl,
                    });
                }
                // Resolve relative redirect URL against current URL
                let nextUrl;
                try {
                    nextUrl = new URL(location, currentUrl).href;
                }
                catch {
                    throw new GenericFetchError("WEB_INVALID_URL", `Invalid redirect URL "${location}" from "${currentUrl}"`);
                }
```

</details>

**依据 3 · 源码核查**：[lib/host/generic-fetch.js:261-307](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/generic-fetch.js#L261-L307)

提取与metadata。

<details>
<summary>查看原文（47行）</summary>

```text
            throw new GenericFetchError("WEB_EMPTY_CONTENT", `Fetched web page from "${currentUrl}" is empty`, {
                statusCode: response.status,
                url: currentUrl,
            });
        }
        if (typeKind === "text") {
            return {
                url: initialUrl,
                finalUrl: currentUrl,
                statusCode: response.status,
                contentType: rawContentType,
                content: bodyText,
                truncated,
                backend: "builtin-http",
                extraction: "raw-text",
            };
        }
        // HTML content: Parse with linkedom + Defuddle (strictly local, useAsync: false)
        try {
            const { document } = parseHTML(bodyText);
            const extracted = await Defuddle(document, currentUrl, {
                markdown: true,
                useAsync: false, // Disallow async third-party fallback APIs (e.g. FxTwitter) for privacy & predictability
            });
            const markdownContent = extracted?.content ? extracted.content.trim() : "";
            const finalContent = markdownContent || bodyText.trim();
            if (!finalContent) {
                throw new GenericFetchError("WEB_EMPTY_CONTENT", `Could not extract text content from "${currentUrl}"`, {
                    statusCode: response.status,
                    url: currentUrl,
                });
            }
            return {
                url: initialUrl,
                finalUrl: currentUrl,
                statusCode: response.status,
                contentType: rawContentType,
                title: extracted?.title?.trim() || undefined,
                author: extracted?.author?.trim() || undefined,
                publishedAt: extracted?.published?.trim() || undefined,
                description: extracted?.description?.trim() || undefined,
                content: finalContent,
                truncated,
                backend: "builtin-http",
                extraction: "defuddle",
            };
        }
```

</details>

**依据 4 · 源码核查**：[lib/host/fetch-security.js:181-224](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/fetch-security.js#L181-L224)

DNS仅验证返回。

<details>
<summary>查看原文（44行）</summary>

```text
    let cleanHost = hostname.toLowerCase();
    if (cleanHost.startsWith("[") && cleanHost.endsWith("]")) {
        cleanHost = cleanHost.slice(1, -1);
    }
    // If already a literal IP, validateFetchUrl already inspected it
    if (isIP(cleanHost) !== 0) {
        if (isPrivateOrRestrictedIp(cleanHost)) {
            throw new FetchSecurityError("WEB_FETCH_BLOCKED", `Access to private/restricted IP "${cleanHost}" is blocked for security reasons.`);
        }
        return;
    }
    if (signal?.aborted) {
        throw new FetchSecurityError("WEB_INVALID_URL", "DNS resolution aborted by signal");
    }
    try {
        const lookupPromise = lookupFn(cleanHost, { all: true });
        let records;
        if (signal) {
            records = await Promise.race([
                lookupPromise,
                new Promise((_, reject) => {
                    signal.addEventListener("abort", () => reject(new FetchSecurityError("WEB_INVALID_URL", "DNS resolution aborted by signal")), { once: true });
                }),
            ]);
        }
        else {
            records = await lookupPromise;
        }
        if (!records || records.length === 0) {
            throw new FetchSecurityError("WEB_INVALID_URL", `DNS resolution failed for hostname "${cleanHost}": no addresses found`);
        }
        for (const record of records) {
            if (isPrivateOrRestrictedIp(record.address)) {
                throw new FetchSecurityError("WEB_FETCH_BLOCKED", `DNS resolution for hostname "${cleanHost}" resolved to private/restricted IP "${record.address}", which is blocked for security reasons.`);
            }
        }
    }
    catch (err) {
        if (err instanceof FetchSecurityError)
            throw err;
        const msg = err instanceof Error ? err.message : String(err);
        throw new FetchSecurityError("WEB_INVALID_URL", `DNS lookup failed for hostname "${cleanHost}": ${msg}`);
    }
}
```

</details>

**依据 5 · 源码核查**：[lib/host/fetch-proxy.js:339-406](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/fetch-proxy.js#L339-L406)

provider覆盖pinning。

<details>
<summary>查看原文（68行）</summary>

```text
export async function fetchWithProxy(url, init, options) {
    const urlStr = typeof url === "string" ? url : url.href;
    const parsed = assertEndpointUrl(urlStr);
    const providerName = options?.provider;
    const providerMode = providerName !== undefined && providerName !== "";
    const isOfficial = providerMode && isOfficialForProvider(providerName, urlStr);
    // A request carrying credentials must NEVER follow redirects, so a 3xx can
    // never leak the credential to another host.
    const modifiedInit = { ...(init ?? {}) };
    if (hasAuthHeader(modifiedInit) && modifiedInit.redirect === undefined) {
        modifiedInit.redirect = "error";
    }
    // ---- provider mode + overridden destination: strict outbound policy ------
    if (providerMode && !isOfficial) {
        const port = parsed.port ? Number(parsed.port) : parsed.protocol === "https:" ? 443 : 80;
        const hostname = parsed.hostname.toLowerCase();
        const policy = { authorizations: OUTBOUND_AUTHORIZATIONS };
        const authorization = findAuthorization(hostname, port, policy);
        // Plaintext http carrying an API key requires an explicit allowHttp grant.
        if (parsed.protocol === "http:" && authorization?.allowHttp !== true) {
            throw new TransportError("destination-blocked", `Provider endpoint "${hostname}:${port}" is not authorized for plaintext http access`);
        }
        const preflight = await preflightDns(hostname, authorization ? "authorized" : "public", policy, {
            lookupAll: async (h) => {
                const dns = await import("node:dns/promises");
                const res = await dns.lookup(h, { all: true });
                return res;
            },
        });
        const proxyUrl = shouldBypassProxy(url) ? undefined : (proxyFromEnv() ?? proxyFromSystem());
        if (proxyUrl !== undefined) {
            // Through a proxy the final DNS/connection happens at the proxy, so a
            // local preflight cannot substantiate the destination. Fail closed unless
            // this exact target is authorized for proxied egress.
            if (authorization?.allowProxy !== true) {
                throw new TransportError("proxy-required", `Provider endpoint "${hostname}:${port}" is not authorized for proxied egress; add an outbound authorization with allowProxy`);
            }
            const Ctor = await getProxyAgentCtor();
            if (Ctor === null) {
                throw new TransportError("network", "undici ProxyAgent unavailable for authorized proxied egress");
            }
            let agent = agentCache.get(proxyUrl);
            if (!agent) {
                agent = new Ctor(proxyUrl);
                agentCache.set(proxyUrl, agent);
            }
            const { dispatcher: _ignored, ...rest } = modifiedInit;
            void _ignored;
            return await fetch(url, { ...rest, dispatcher: agent });
        }
        // Direct path: pin the socket to the preflighted IP, keep the dispatcher
        // alive until the response body is fully consumed.
        const pinnedDispatcher = await createPinnedDispatcher({
            address: preflight.addresses[0].address,
            port,
            servername: parsed.hostname,
            useTls: parsed.protocol === "https:",
            connectTimeoutMs: 10_000,
            connect: defaultConnect,
            signal: modifiedInit.signal ?? new AbortController().signal,
        });
        modifiedInit.dispatcher = pinnedDispatcher;
        try {
            const response = await fetch(url, modifiedInit);
            return withBodyLifetime(response, () => void destroySafely(pinnedDispatcher));
        }
        catch (err) {
            await destroySafely(pinnedDispatcher);
```

</details>

**依据 6 · 源码核查**：[lib/host/fetch-proxy.js:409-425](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/fetch-proxy.js#L409-L425)

普通页重解析路径。

<details>
<summary>查看原文（17行）</summary>

```text
    }
    // ---- official default endpoints and legacy/page mode: existing behavior --
    if (shouldBypassProxy(url))
        return await fetch(url, modifiedInit);
    const proxy = proxyFromEnv() ?? proxyFromSystem();
    if (proxy === undefined)
        return await fetch(url, modifiedInit);
    const Ctor = await getProxyAgentCtor();
    if (Ctor === null)
        return await fetch(url, modifiedInit); // undici missing → plain fetch
    let agent = agentCache.get(proxy);
    if (!agent) {
        agent = new Ctor(proxy);
        agentCache.set(proxy, agent);
    }
    const { dispatcher, ...rest } = modifiedInit;
    void dispatcher; // ignore any caller-supplied dispatcher (we own the proxy)
```

</details>

**依据 7 · 源码核查**：[lib/host/sources/registry.js:127-143](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/sources/registry.js#L127-L143)

general字段投影。

<details>
<summary>查看原文（17行）</summary>

```text
        if (!targetPlatform) {
            if (this.fallbackFetchProvider) {
                const res = await this.fallbackFetchProvider.fetch({ url }, signal);
                return {
                    item: {
                        id: res.url || url,
                        title: res.metadata?.title || "Web Page",
                        url: res.url || url,
                        text: res.body?.content || "",
                        platform: "general",
                        author: res.metadata?.author ? { name: res.metadata.author } : undefined,
                        publishedAt: res.metadata?.publishedAt,
                    },
                    retrievalMode: "general-web",
                };
            }
            return { error: { code: "runtime-unavailable", message: "No fetch provider available", retryable: false } };
```

</details>

**依据 8 · 源码核查**：[lib/host/index.js:38-79](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/index.js#L38-L79)

最终固定200/false。

<details>
<summary>查看原文（42行）</summary>

```text
let versionCache = null;
export function toRoutedFetchResponse(url, outcome) {
    if (outcome.error) {
        const error = new WebToolsWebError(`platform fetch failed (${outcome.error.code}): ${outcome.error.message}`);
        if (outcome.error.code === "aborted")
            error.code = "WEB_ABORTED";
        throw error;
    }
    const item = outcome.item;
    const rawContent = item?.text?.trim();
    if (!item || !rawContent) {
        throw new WebToolsWebError(`platform fetch returned empty content for ${url}`);
    }
    const sections = [];
    if (item.title?.trim() && !rawContent.startsWith(item.title.trim())) {
        sections.push(`# ${item.title.trim()}`);
    }
    const metadata = [];
    const author = item.author?.handle || item.author?.name;
    if (author)
        metadata.push(`Author: ${author}`);
    if (item.publishedAt)
        metadata.push(`Published: ${item.publishedAt}`);
    const engagement = [
        typeof item.likes === "number" ? `likes ${item.likes}` : undefined,
        typeof item.collects === "number" ? `collects ${item.collects}` : undefined,
        typeof item.retweets === "number" ? `retweets ${item.retweets}` : undefined,
        typeof item.replies === "number" ? `comments/replies ${item.replies}` : undefined,
    ].filter(Boolean);
    if (engagement.length > 0)
        metadata.push(`Engagement: ${engagement.join(", ")}`);
    if (metadata.length > 0)
        sections.push(metadata.join("\n"));
    sections.push(rawContent);
    if (item.images?.length)
        sections.push(`Images: ${item.images.length} attached`);
    const content = sections.join("\n\n");
    return {
        url,
        statusCode: 200,
        body: { kind: "text", content },
        truncated: false,
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 自定义源与凭证的正向设计和边界是什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

自定义三类协议只做数据模板/点路径映射，无eval；单次placeholder替换避免query中的{{apiKey}}二次展开，mapping拒prototype相关段且只走own property。Basic账号密码分credential refs，key不回显配置；自定义search-only不假设兼容extract。transport区分模型选的网页和操作者配置的端点，host/port授权、HTTP/private确认、metadata/linklocal硬阻断、DNS所有候选检查、direct socket pinning、redirect:error、JSON响应2MiB预算与reserved headers限制，具备可借鉴的出站安全分层。代理最终解析不可本地证明，需allowProxy明确授权，而不是宣称代理链同样本地pin住。

配置面以真实loopback TCP peer+sameOrigin/sec-fetch-site而非仅Host，有真实peer时优先核loopback，缺peer时只有NODE_ENV=test或任一argv/execArgv包含test子串才退化为Host判断；否则failclosed。这个字符串条件不是可信自动测试证明，普通带test字样进程也可命中；但不改变有peer的优先检查，不能据此声称真实TCP对端已绕过。它是本机配置面信任模型，反代变本地peer或其他本机进程仍需宿主认证，非多租户用户身份隔离。create先写配置再写凭证，失败补偿恢复/撤secret，update需revision并有补偿；但revision比较在异步DNS/write前完成，无原子CAS/串行锁，双请求可同时通过旧revision。补偿失败catch忽略也不等事务回滚保证。DNS preflight在combineAbort创建前等待lookup，不受后面requestTimeout直接中断；外层attempt信号能否及时结束依链中等待点，不能把15秒配置当所有DNS绝对上限。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host/providers/custom-compatible.js:82-119](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/providers/custom-compatible.js#L82-L119)

单次插值。

<details>
<summary>查看原文（38行）</summary>

```text
export function interpolatePlaceholders(template, vars) {
    return template.replace(/\{\{\s*(query|maxResults|apiKey)\s*\}\}|\{\s*(query|maxResults|apiKey)\s*\}/gi, (match, p1, p2) => {
        const token = (p1 || p2 || "").toLowerCase();
        switch (token) {
            case "query":
                return vars.query;
            case "maxresults":
                return String(vars.maxResults ?? 10);
            case "apikey":
                return vars.apiKey ?? "";
            default:
                return match;
        }
    });
}
/** Recursively interpolate placeholders in a nested JSON structure. */
export function interpolateJsonStructure(val, vars) {
    if (typeof val === "string") {
        if (/^\{\{\s*maxResults\s*\}\}$/i.test(val.trim())) {
            return vars.maxResults ?? 10;
        }
        return interpolatePlaceholders(val, vars);
    }
    if (Array.isArray(val)) {
        return val.map((item) => interpolateJsonStructure(item, vars));
    }
    if (val !== null && typeof val === "object") {
        const out = {};
        for (const [k, v] of Object.entries(val)) {
            out[k] = interpolateJsonStructure(v, vars);
        }
        return out;
    }
    return val;
}
/** Parameters actually sent, after static + dynamic merge. */
function mergeParams(config, query, maxResults) {
    const defaults = PROTOCOL_DEFAULTS[config.protocol];
```

</details>

**依据 2 · 源码核查**：[lib/host/custom-provider-schema.js:41-113](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/custom-provider-schema.js#L41-L113)

点路径禁原型/own。

<details>
<summary>查看原文（73行）</summary>

```text
 * `__proto__.x` walks the prototype chain, and `constructor`/`prototype` are
 * the classic escape hatches for a JSON-path evaluator.
 */
const FORBIDDEN_SEGMENTS = new Set(["__proto__", "constructor", "prototype", "toString", "valueOf"]);
/**
 * Parse a restricted dotted path into segments.
 *
 * Accepted: `results`, `data.results`, `data.0.items`, `0.url`.
 * Rejected: anything with brackets, whitespace, quotes, expressions, empty
 * segments, or a forbidden member name.
 *
 * @throws {CustomProviderValidationError}
 */
export function parseMappingPath(path, field, allowEmpty = false) {
    if (typeof path !== "string")
        throw new CustomProviderValidationError(field, "must be a string");
    const trimmed = path.trim();
    if (trimmed === "") {
        if (allowEmpty)
            return [];
        throw new CustomProviderValidationError(field, "must not be empty");
    }
    if (trimmed.length > MAX_PATH_CHARS) {
        throw new CustomProviderValidationError(field, `must be at most ${MAX_PATH_CHARS} characters`);
    }
    if (/[[\]()'"`\\$*?|{}=!<>+~^@#%&:;,\s]/.test(trimmed)) {
        throw new CustomProviderValidationError(field, "must be a plain dotted path of identifiers and numeric indexes (no brackets, quotes, or expressions)");
    }
    const raw = trimmed.split(".");
    if (raw.length > MAX_MAPPING_SEGMENTS) {
        throw new CustomProviderValidationError(field, `must have at most ${MAX_MAPPING_SEGMENTS} segments`);
    }
    return raw.map((segment) => {
        if (segment === "")
            throw new CustomProviderValidationError(field, "contains an empty path segment");
        if (FORBIDDEN_SEGMENTS.has(segment)) {
            throw new CustomProviderValidationError(field, `segment "${segment}" is not allowed`);
        }
        if (/^\d+$/.test(segment)) {
            const index = Number(segment);
            if (!Number.isSafeInteger(index))
                throw new CustomProviderValidationError(field, "has an out-of-range index");
            return index;
        }
        if (!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(segment)) {
            throw new CustomProviderValidationError(field, `segment "${segment}" is not a plain identifier`);
        }
        return segment;
    });
}
/**
 * Read one value out of a parsed JSON document by a restricted path.
 * Only own properties are read, and only one level is descended per segment —
 * there is no evaluation of any kind.
 */
export function readMappingPath(root, segments) {
    let cursor = root;
    for (const segment of segments) {
        if (cursor === null || cursor === undefined)
            return undefined;
        if (typeof segment === "number") {
            if (!Array.isArray(cursor))
                return undefined;
            cursor = cursor[segment];
        }
        else {
            if (typeof cursor !== "object" || Array.isArray(cursor))
                return undefined;
            if (!Object.prototype.hasOwnProperty.call(cursor, segment))
                return undefined;
            cursor = cursor[segment];
        }
    }
```

</details>

**依据 3 · 源码核查**：[lib/host/provider-transport.js:279-305](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/provider-transport.js#L279-L305)

所有DNS候选。

<details>
<summary>查看原文（27行）</summary>

```text
export async function preflightDns(hostname, trust, policy, deps) {
    const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
    const literal = isIP(host);
    // A literal address bypasses DNS entirely.
    if (literal !== 0) {
        const allowPrivate = trust === "official" || isAuthorizedPrivate(host, policy);
        assertAddressAllowed(host, allowPrivate);
        return { addresses: [{ address: host, family: literal }], allowPrivate };
    }
    let records;
    try {
        records = await deps.lookupAll(host);
    }
    catch (err) {
        throw new TransportError("network", `DNS lookup failed for "${host}": ${err instanceof Error ? err.message : String(err)}`);
    }
    if (!records || records.length === 0) {
        throw new TransportError("network", `DNS lookup for "${host}" returned no addresses`);
    }
    const allowPrivate = trust === "official" || policy.authorizations.some((entry) => entry.allowPrivate && hostMatchesAuthorization(host, entry));
    for (const record of records) {
        assertAddressAllowed(record.address, allowPrivate);
    }
    return { addresses: records, allowPrivate };
}
function isAuthorizedPrivate(host, policy) {
    return policy.authorizations.some((entry) => entry.allowPrivate && hostMatchesAuthorization(host, entry));
```

</details>

**依据 4 · 源码核查**：[lib/host/provider-transport.js:312-400](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/provider-transport.js#L312-L400)

授权、代理和pinning顺序。

<details>
<summary>查看原文（89行）</summary>

```text
export async function transact(request, overrides = {}) {
    const deps = {
        lookupAll: overrides.lookupAll ?? defaultLookupAll,
        connect: overrides.connect ?? defaultConnect,
        proxyUrl: overrides.proxyUrl,
        proxyDispatcher: overrides.proxyDispatcher,
        now: overrides.now ?? (() => Date.now()),
    };
    const parsed = assertEndpointUrl(request.url);
    const policy = request.policy;
    const port = parsed.port ? Number(parsed.port) : parsed.protocol === "https:" ? 443 : 80;
    const maxBytes = policy.maxResponseBytes ?? DEFAULT_MAX_RESPONSE_BYTES;
    // ---- 1. scheme & host authorization -----------------------------------
    const authorization = findAuthorization(parsed.hostname, port, policy);
    if (parsed.protocol === "http:") {
        const isAuthorizedHttp = authorization?.allowHttp === true;
        const allowed = request.trust === "official"
            ? isLoopbackHost(parsed.hostname)
            : (policy.allowPublicHttp === true || isAuthorizedHttp);
        if (!allowed) {
            throw new TransportError("destination-blocked", "Plain http:// endpoints are only allowed for loopback defaults or an explicitly authorized target");
        }
    }
    // ---- 2. host authorization (before DNS) --------------------------------
    if (request.trust === "authorized" && !authorization) {
        throw new TransportError("destination-blocked", `Destination "${parsed.hostname}:${port}" is not authorized`);
    }
    if ((request.trust === "official" || request.trust === "authorized") && authorization?.allowHttp && parsed.protocol === "http:") {
        // explicit http grant for a non-loopback authorized target
    }
    // ---- 3. header hygiene -------------------------------------------------
    for (const name of Object.keys(request.headers))
        assertHeaderName(name);
    // ---- 4. DNS pre-flight ------------------------------------------------
    // Runs BEFORE the proxy decision because the resolved address decides it: an
    // ambient HTTP proxy cannot reach private/LAN space (it dials from wherever
    // it runs), so a destination that resolves to a private address must be
    // dialed directly even when Windows has a system proxy configured. Without
    // this, a self-hosted source on 192.168.x.x could be saved and authorized and
    // still fail every search with `proxy-required`.
    const preflight = await preflightDns(parsed.hostname, request.trust, policy, deps);
    const pinned = preflight.addresses[0];
    const useTls = parsed.protocol === "https:";
    const privateDestination = preflight.addresses.some((record) => isPrivateOrRestrictedIp(record.address));
    // ---- 5. proxy decision (fail closed) ----------------------------------
    // Loopback and private destinations are connected directly: this only
    // bypasses proxy ROUTING, never the allowHttp/allowPrivate authorization or
    // the pinned connection below.
    const directDial = isLoopbackHost(parsed.hostname) || privateDestination;
    const proxyUrl = directDial ? undefined : deps.proxyUrl?.();
    let dispatcher;
    if (proxyUrl !== undefined && !(request.builtInOfficial === true) && !isLoopbackUrl(parsed.href)) {
        if (policy.allowProxy !== true) {
            throw new TransportError("proxy-required", "A proxy is configured and this destination is not authorized for proxied requests: the final DNS resolution and connection would happen at the proxy, so the destination cannot be verified locally");
        }
        dispatcher = await deps.proxyDispatcher?.(proxyUrl);
    }
    // Only attach the custom dispatcher when we are NOT pinning, i.e. built-in
    // official endpoints (whose host is trusted by construction) and proxied
    // requests (where the proxy performs the connection).
    const signal = combineAbort(request.signal, policy.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS);
    const init = {
        method: request.method,
        headers: request.headers,
        // A 3xx must never re-send the credential to another origin.
        redirect: "error",
        signal: signal.signal,
        ...(request.body !== undefined ? { body: request.body } : {}),
    };
    let pinnedDispatcher = undefined;
    if (dispatcher !== undefined) {
        init.dispatcher = dispatcher;
    }
    else if (request.trust === "official") {
        // Built-in official endpoint: host is trusted by construction (no DNS
        // rebinding incentive — the credential goes where it was always going),
        // so the platform fetch resolves and connects normally. The redirect and
        // size guards above still apply.
    }
    else {
        // Operator-typed destination: always pinned to a pre-validated address.
        pinnedDispatcher = await createPinnedDispatcher({
            address: pinned.address,
            port,
            servername: parsed.hostname,
            useTls,
            connectTimeoutMs: policy.connectTimeoutMs ?? DEFAULT_CONNECT_TIMEOUT_MS,
            connect: deps.connect,
            signal: signal.signal,
```

</details>

**依据 5 · 源码核查**：[lib/host/routes.js:188-207](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/routes.js#L188-L207)

配置面peer。

<details>
<summary>查看原文（20行）</summary>

```text
export function configPlaneTrust(req) {
    if (!isSameOrigin(req) || !isNotCrossSite(req))
        return false;
    const peer = peerAddressOf(req);
    if (peer !== undefined)
        return isLoopbackAddress(peer) ? "peer" : false;
    // In production DSH environments, every real connection carries req.socket.
    // Fallback to Host header is strictly confined to automated test runs
    // (where mock req objects lack sockets).
    const isTest = typeof process !== "undefined" && (process.env.NODE_ENV === "test" ||
        process.argv.some((a) => a.includes("test")) ||
        process.execArgv.some((a) => a.includes("test")));
    if (!isTest)
        return false;
    return isLoopbackHost(authorityHost(req.headers?.host)) ? "host" : false;
}
/**
 * Same-origin check: when an Origin header is present, its scheme, host, and port
 * must match the request Host authority (full origin check, preventing cross-port attacks).
 * Absent Origin → allowed (typed navigation / non-browser / in-process).
```

</details>

**依据 6 · 源码核查**：[lib/host/routes.js:644-705](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/routes.js#L644-L705)

创建和补偿。

<details>
<summary>查看原文（62行）</summary>

```text
async function handleSourceCreate(deps, payload) {
    const p = (payload ?? {});
    const list = readCustomProviders(deps);
    if (list.length >= MAX_CUSTOM_PROVIDERS) {
        throw new RouteError("config", `At most ${MAX_CUSTOM_PROVIDERS} custom sources are allowed`, 409);
    }
    // Validate BEFORE generating an id, so an invalid draft never allocates one.
    const draft = validateDraft(p.source);
    const id = generateSourceId(list.map((entry) => entry.id));
    const config = { schemaVersion: 1, id, revision: 1, ...draft };
    // Persist first, then write credentials. Creating the credential before the
    // config is durable would leave an orphan secret behind on failure.
    const cfg = deps.readConfig();
    const currentAuths = Array.isArray(cfg.outboundAuthorizations) ? [...cfg.outboundAuthorizations] : [];
    const endpointUrl = new URL(config.endpoint.baseUrl);
    const endpointPort = endpointUrl.port
        ? Number(endpointUrl.port)
        : (endpointUrl.protocol === "https:" ? 443 : 80);
    const isPrivateOrLoopback = isLocalOrPrivateHost(endpointUrl.hostname) ||
        (await resolvesToPrivateIp(endpointUrl.hostname, deps.lookupAll));
    const isHttp = endpointUrl.protocol === "http:";
    const isAlreadyAuthorized = currentAuths.some((a) => (a.host.toLowerCase() === endpointUrl.hostname.toLowerCase() ||
        (a.host.startsWith(".") && endpointUrl.hostname.toLowerCase().endsWith(a.host.toLowerCase()))) &&
        (a.port === undefined || a.port === endpointPort) &&
        (!isPrivateOrLoopback || a.allowPrivate) &&
        (!isHttp || a.allowHttp));
    let updatedAuths = currentAuths;
    if ((isPrivateOrLoopback || isHttp) && !isAlreadyAuthorized) {
        if (p.confirmTarget !== true) {
            throw new RouteError("conflict", `此搜索服务位于本地网络或使用未加密 HTTP 连接。是否允许访问 ${endpointUrl.hostname}:${endpointPort}？若配置了 API Key，对应凭证将发送给该服务。`, 409);
        }
        updatedAuths = [
            ...currentAuths,
            {
                host: endpointUrl.hostname,
                port: endpointPort,
                allowPrivate: isPrivateOrLoopback,
                allowHttp: isHttp,
                allowProxy: !isPrivateOrLoopback,
                sourceId: id,
                managedBy: "custom-source",
                note: `Operator-confirmed: ${config.name}`,
            },
        ];
    }
    await deps.writeConfig({ customProviders: [...list, config], outboundAuthorizations: updatedAuths });
    let credentialConfigured = false;
    const refs = credentialRefsOf(id, config.auth.mode);
    try {
        credentialConfigured = await applyCredentialPatch(deps, refs, p.credential);
    }
    catch (err) {
        // Compensation: the config write succeeded but the credential did not, so
        // roll the source back rather than leaving a half-configured entry.
        await deps.writeConfig({ customProviders: list, outboundAuthorizations: currentAuths }).catch(() => { });
        await deps.revokeSourceCredentials?.(id).catch(() => { });
        deps.forgetSource?.(id);
        throw err instanceof Error ? new RouteError("config", err.message, 400) : err;
    }
    return { id, saved: true, revision: config.revision, credentialConfigured };
}
/**
```

</details>

**依据 7 · 源码核查**：[lib/host/routes.js:764-863](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/routes.js#L764-L863)

非原子revision/异步更新。

<details>
<summary>查看原文（100行）</summary>

```text
async function handleSourceUpdate(deps, payload) {
    const p = (payload ?? {});
    const { list, config } = requireCustomProvider(deps, String(p.id ?? ""));
    const expected = p.revision;
    if (typeof expected !== "number" || !Number.isInteger(expected)) {
        throw new RouteError("config", "revision is required", 400);
    }
    if (expected !== config.revision) {
        // Refuse rather than overwrite: another editor (or another tab) saved first.
        throw new RouteError("conflict", "This source was modified by another operation; reload before saving", 409);
    }
    // A patch is merged onto the stored source, then the WHOLE result is
    // revalidated — a patch cannot introduce a shape the schema would reject.
    const patch = (p.patch ?? {});
    const merged = {
        ...config,
        ...patch,
        endpoint: patch.endpoint !== undefined ? { ...config.endpoint, ...patch.endpoint } : config.endpoint,
        auth: patch.auth !== undefined ? { ...config.auth, ...patch.auth } : config.auth,
        request: patch.request !== undefined ? { ...(config.request ?? {}), ...patch.request } : config.request,
        response: patch.response !== undefined ? { ...(config.response ?? {}), ...patch.response } : config.response,
    };
    const draft = validateDraft(merged, "patch");
    const next = { schemaVersion: 1, id: config.id, revision: config.revision + 1, ...draft };
    const nextList = list.map((entry) => (entry.id === config.id ? next : entry));
    const cfg = deps.readConfig();
    let updatedAuths = Array.isArray(cfg.outboundAuthorizations) ? [...cfg.outboundAuthorizations] : [];
    if (next.endpoint.baseUrl !== config.endpoint.baseUrl) {
        const endpointUrl = new URL(next.endpoint.baseUrl);
        const endpointPort = endpointUrl.port
            ? Number(endpointUrl.port)
            : (endpointUrl.protocol === "https:" ? 443 : 80);
        const isPrivateOrLoopback = isLocalOrPrivateHost(endpointUrl.hostname) ||
            (await resolvesToPrivateIp(endpointUrl.hostname, deps.lookupAll));
        const isHttp = endpointUrl.protocol === "http:";
        const isAlreadyAuthorized = updatedAuths.some((a) => (a.host.toLowerCase() === endpointUrl.hostname.toLowerCase() ||
            (a.host.startsWith(".") && endpointUrl.hostname.toLowerCase().endsWith(a.host.toLowerCase()))) &&
            (a.port === undefined || a.port === endpointPort) &&
            (!isPrivateOrLoopback || a.allowPrivate) &&
            (!isHttp || a.allowHttp));
        if ((isPrivateOrLoopback || isHttp) && !isAlreadyAuthorized) {
            if (p.confirmTarget !== true) {
                throw new RouteError("conflict", `此搜索服务位于本地网络或使用未加密 HTTP 连接。是否允许访问 ${endpointUrl.hostname}:${endpointPort}？若配置了 API Key，对应凭证将发送给该服务。`, 409);
            }
            updatedAuths.push({
                host: endpointUrl.hostname,
                port: endpointPort,
                allowPrivate: isPrivateOrLoopback,
                allowHttp: isHttp,
                allowProxy: !isPrivateOrLoopback,
                sourceId: config.id,
                managedBy: "custom-source",
                note: `Operator-confirmed: ${next.name}`,
            });
        }
        // Clean up old endpoint authorization if no other source uses it
        try {
            const oldUrl = new URL(config.endpoint.baseUrl);
            const oldPort = oldUrl.port ? Number(oldUrl.port) : (oldUrl.protocol === "https:" ? 443 : 80);
            const otherUsesOldEndpoint = nextList.some((other) => {
                if (other.id === config.id)
                    return false;
                try {
                    const u = new URL(other.endpoint.baseUrl);
                    const p = u.port ? Number(u.port) : (u.protocol === "https:" ? 443 : 80);
                    return u.hostname.toLowerCase() === oldUrl.hostname.toLowerCase() && p === oldPort;
                }
                catch {
                    return false;
                }
            });
            if (!otherUsesOldEndpoint) {
                updatedAuths = updatedAuths.filter((a) => !(a.host.toLowerCase() === oldUrl.hostname.toLowerCase() &&
                    (a.port === undefined || a.port === oldPort) &&
                    (a.managedBy === "custom-source" ||
                        a.sourceId !== undefined ||
                        a.note?.includes(config.name) ||
                        a.note?.includes(config.id) ||
                        a.note?.startsWith("Auto-authorized for custom source:"))));
            }
        }
        catch { }
    }
    await deps.writeConfig({ customProviders: nextList, outboundAuthorizations: updatedAuths });
    // A changed endpoint invalidates health/cooldown recorded against the OLD
    // destination, and a changed auth mode changes which credential refs exist.
    if (next.endpoint.baseUrl !== config.endpoint.baseUrl ||
        next.endpoint.searchPath !== config.endpoint.searchPath ||
        next.auth.mode !== config.auth.mode) {
        deps.forgetSource?.(config.id);
    }
    if (p.credential !== undefined) {
        try {
            await applyCredentialPatch(deps, credentialRefsOf(config.id, next.auth.mode), p.credential);
        }
        catch (credErr) {
            // Compensation: rollback config update if credential write fails,
            // preventing half-updated configuration from lingering.
            await deps.writeConfig({ customProviders: list, outboundAuthorizations: cfg.outboundAuthorizations }).catch(() => { });
            throw credErr;
```

</details>

#### 缺口

- 反代/多用户宿主认证、并发保存及补偿失败后的配置/secret真实状态
  **影响**：本机peer/乐观revision不能单独提供多租户授权或跨服务事务保证
  **进一步探讨**：核固定宿主认证和settings写入契约，按双旧revision、DNS等待、失败补偿保留真实状态

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · X/小红书抓取的效果与隐私范围是什么？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

使用本机Chrome/Edge专用profile、loopback调试端口和CDP页面，而不是复用个人默认profile或无凭证爬全站。profile按平台放~/.dsh/web-tools/browser-profiles，不含DSH profile/session/user隔离键，同OS用户实例可能共用登录态；浏览器自身磁盘含敏感cookie/站点数据，metadata文件sessionEstablished不是当前认证证明。runtime检查cookie名并核真实页面可用性，小红书登录墙/搜索受限标非重试，registry不以通用索引伪装原生成功；可重试运行时故障/禁用平台才转通用fallback，0结果原生成功保留。

结构化page state/GraphQL与DOM备用提高页面变动韧性，但依平台私有结构、登录/反自动化和页面加载，不等全量事实抓取。评论最多30条，每条800字符并在正文写captured/truncated，不自动穷尽分页，不做图片OCR。页面leases在close释放并闲置关浏览器，dispose停进程，reset删除专用profile需重登；这些是生命周期设计，不保证所有外部页面/账户状态可回滚。浏览器访问本来就向平台带登录态，不能把无额外API Key当匿名或零隐私成本。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host/browser/paths.js:3-11](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/browser/paths.js#L3-L11)

平台专用目录。

```text
export function getDedicatedProfileDir(platform, baseDirOverride) {
    const home = baseDirOverride || os.homedir();
    return path.join(home, ".dsh", "web-tools", "browser-profiles", platform);
}
export function getRuntimeStateDir(platform, baseDirOverride) {
    const home = baseDirOverride || os.homedir();
    return path.join(home, ".dsh", "web-tools", "browser-runtime", platform);
}
export function validatePlatformUrl(urlStr, platform) {
```

**依据 2 · 源码核查**：[lib/host/browser/process-manager.js:3-27](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/browser/process-manager.js#L3-L27)

专用profile/CDP。

<details>
<summary>查看原文（25行）</summary>

```text
export function buildSafeLaunchArgs(profileDir, port, initialUrl, minimized = false, headless = false) {
    const args = [
        `--user-data-dir=${profileDir}`,
        `--remote-debugging-address=127.0.0.1`,
        `--remote-debugging-port=${port}`,
        `--no-first-run`,
        `--no-default-browser-check`,
    ];
    if (headless) {
        args.push("--headless=new");
    }
    else if (minimized) {
        args.push("--start-minimized");
    }
    if (initialUrl) {
        args.push(initialUrl);
    }
    return args;
}
export async function launchBrowserProcess(browser, profileDir, initialUrl, minimized = false, headless = false) {
    const port = await allocateRandomPort();
    const args = buildSafeLaunchArgs(profileDir, port, initialUrl, minimized, headless);
    const cp = spawn(browser.executablePath, args, {
        stdio: "ignore",
        detached: false,
```

</details>

**依据 3 · 源码核查**：[lib/host/browser/session-manager.js:125-175](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/browser/session-manager.js#L125-L175)

cookie与活页面。

<details>
<summary>查看原文（51行）</summary>

```text
            return await this.liveSessionVerifier({
                platform: session.platform,
                cdp: session.cdp,
                signal,
            });
        }
        catch {
            return false;
        }
    }
    async hasRequiredCookies(session) {
        const config = PLATFORM_AUTH_CONFIG[session.platform];
        try {
            const res = await session.cdp.send("Storage.getCookies");
            const names = new Set((res.cookies || [])
                .filter((cookie) => {
                const cookieDomain = (cookie.domain || "").toLowerCase().replace(/^\./, "");
                return config.domains.some((domain) => {
                    const target = domain.toLowerCase().replace(/^\./, "");
                    return cookieDomain === target || cookieDomain.endsWith("." + target);
                });
            })
                .map((cookie) => cookie.name));
            return config.verifyPredicate(names);
        }
        catch {
            return false;
        }
    }
    async status(platform) {
        const browser = await this.detect();
        if (!browser) {
            return {
                platform,
                runtimeAvailable: false,
                runtimeState: "unavailable",
                authState: "unknown",
                authenticated: false,
            };
        }
        const rec = this.getRecord(platform);
        if (rec.session) {
            const auth = await this.internalCheckAuth(rec.session);
            this.profileStore.saveMetadata(platform, {
                platform,
                sessionEstablished: auth,
                browserKind: rec.session.browser.kind,
                lastVerifiedAt: Date.now(),
            });
            return {
                platform,
```

</details>

**依据 4 · 源码核查**：[lib/host/browser/session-manager.js:400-465](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/browser/session-manager.js#L400-L465)

page lease清理。

<details>
<summary>查看原文（66行）</summary>

```text
    async createPage(platform, signal, mode = "headless") {
        if (this.disposed)
            throw new Error("NativeBrowserRuntime is disposed");
        if (signal?.aborted)
            throw new Error("createPage aborted");
        const rec = this.getRecord(platform);
        this.retainLease(rec);
        try {
            const session = await this.acquireSession(platform, mode, undefined, signal);
            const createRes = await session.cdp.send("Target.createTarget", { url: "about:blank" }, undefined, signal);
            const targetId = createRes.targetId;
            const attachRes = await session.cdp.send("Target.attachToTarget", { targetId, flatten: true }, undefined, signal);
            const sessionId = attachRes.sessionId;
            let closed = false;
            return new CdpPage(targetId, sessionId, session.cdp, async () => {
                if (closed)
                    return;
                closed = true;
                try {
                    await session.cdp.send("Target.closeTarget", { targetId });
                }
                catch {
                    // Ignore closeTarget failure
                }
                finally {
                    this.releaseLease(rec);
                }
            }, (url) => {
                if (!validatePlatformUrl(url, platform)) {
                    throw new UrlDisallowedError(url, platform);
                }
            });
        }
        catch (err) {
            this.releaseLease(rec);
            throw err;
        }
    }
    retainLease(rec) {
        rec.activeLeases++;
        if (rec.idleTimer) {
            clearTimeout(rec.idleTimer);
            rec.idleTimer = undefined;
        }
    }
    releaseLease(rec) {
        if (rec.activeLeases > 0) {
            rec.activeLeases--;
        }
        if (rec.activeLeases === 0) {
            this.scheduleIdleTimer(rec);
        }
    }
    scheduleIdleTimer(rec) {
        if (rec.idleTimer) {
            clearTimeout(rec.idleTimer);
            rec.idleTimer = undefined;
        }
        if (this.idleShutdownMs > 0 && rec.activeLeases === 0 && rec.session && !this.disposed) {
            rec.idleTimer = setTimeout(() => {
                if (rec.activeLeases === 0) {
                    this.stop(rec.platform).catch(() => { });
                }
            }, this.idleShutdownMs);
        }
    }
```

</details>

**依据 5 · 源码核查**：[lib/host/browser/session-manager.js:571-622](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/browser/session-manager.js#L571-L622)

停止/reset。

<details>
<summary>查看原文（52行）</summary>

```text
        rec.pendingCancel = true;
        if (rec.idleTimer) {
            clearTimeout(rec.idleTimer);
            rec.idleTimer = undefined;
        }
        const session = rec.session;
        rec.session = undefined;
        rec.state = "stopped";
        if (session) {
            try {
                await session.cdp.send("Browser.close", {}, undefined, undefined, 1000);
            }
            catch {
                // Fallback to socket close & kill
            }
            session.cdp.close();
            const pid = session.pid;
            if (pid) {
                let dead = !this.isPidAliveFn(pid);
                const start = Date.now();
                while (!dead && Date.now() - start < 500) {
                    await new Promise((r) => setTimeout(r, 50));
                    dead = !this.isPidAliveFn(pid);
                }
                if (!dead) {
                    this.killPidFn(pid);
                    const killStart = Date.now();
                    while (!dead && Date.now() - killStart < 500) {
                        await new Promise((r) => setTimeout(r, 50));
                        dead = !this.isPidAliveFn(pid);
                    }
                }
            }
            this.stateStore.clearState(rec.platform);
        }
    }
    async stop(platform) {
        return this.enqueue(platform, async () => {
            const rec = this.getRecord(platform);
            await this.internalStop(rec);
        });
    }
    async resetSession(platform) {
        await this.stop(platform);
        this.profileStore.clearProfile(platform);
    }
    async dispose() {
        this.disposed = true;
        const platforms = Array.from(this.records.keys());
        await Promise.all(platforms.map((p) => this.stop(p)));
    }
}
```

</details>

**依据 6 · 源码核查**：[lib/host/sources/registry.js:110-133](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/sources/registry.js#L110-L133)

非重试不降级。

<details>
<summary>查看原文（24行）</summary>

```text
        if (!outcome.error.retryable) {
            return outcome;
        }
        // Retryable browser/runtime failures may still use indexed discovery.
        return fallbackSearchToGeneralWeb(query, platform, this.fallbackSearchProvider, req?.maxResults, signal);
    }
    async routeFetch(url, signal) {
        return this.fetch(url, signal);
    }
    async fetch(url, signal) {
        let targetPlatform;
        if (validatePlatformUrl(url, "xiaohongshu")) {
            targetPlatform = "xiaohongshu";
        }
        else if (validatePlatformUrl(url, "x")) {
            targetPlatform = "x";
        }
        if (!targetPlatform) {
            if (this.fallbackFetchProvider) {
                const res = await this.fallbackFetchProvider.fetch({ url }, signal);
                return {
                    item: {
                        id: res.url || url,
                        title: res.metadata?.title || "Web Page",
```

</details>

**依据 7 · 源码核查**：[lib/host/sources/comments.js:1-51](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/sources/comments.js#L1-L51)

有限评论与正文标记。

<details>
<summary>查看原文（51行）</summary>

```text
export const MAX_FETCHED_COMMENTS = 30;
const MAX_COMMENT_TEXT_LENGTH = 800;
function compactText(value) {
    const compact = value.replace(/\s+/g, " ").trim();
    if (compact.length <= MAX_COMMENT_TEXT_LENGTH)
        return { text: compact, truncated: false };
    return { text: `${compact.slice(0, MAX_COMMENT_TEXT_LENGTH - 1)}…`, truncated: true };
}
export function normalizeComments(input, limit = MAX_FETCHED_COMMENTS) {
    const comments = [];
    const seen = new Set();
    let truncated = false;
    for (const raw of input) {
        const compacted = compactText(raw.text || "");
        const text = compacted.text;
        if (!text)
            continue;
        truncated ||= compacted.truncated;
        const key = raw.id || `${raw.author?.handle || raw.author?.name || ""}\n${text}`;
        if (seen.has(key))
            continue;
        seen.add(key);
        if (comments.length >= limit) {
            return { comments, truncated: true };
        }
        comments.push({ ...raw, text });
    }
    return { comments, truncated };
}
export function appendCommentsToItem(item, rawComments, options) {
    const normalized = normalizeComments(rawComments, options.limit);
    const truncated = Boolean(options.truncated || normalized.truncated);
    if (normalized.comments.length === 0 && !truncated)
        return item;
    const emitted = new Set();
    const lines = normalized.comments.map((comment) => {
        const nested = Boolean(comment.parentId && emitted.has(comment.parentId));
        emitted.add(comment.id);
        const author = comment.author?.handle || comment.author?.name || "Unknown user";
        const likes = typeof comment.likes === "number" ? ` (${comment.likes} likes)` : "";
        return `${nested ? "  " : ""}- ${author}${likes}: ${comment.text}`;
    });
    const suffix = truncated ? ", truncated" : "";
    const section = `## ${options.heading} (${normalized.comments.length} captured${suffix})\n\n${lines.join("\n")}`;
    return {
        ...item,
        text: `${item.text?.trim() || item.title}\n\n${section}`,
        comments: normalized.comments,
        commentsTruncated: truncated,
    };
}
```

</details>

**依据 8 · 源码核查**：[lib/host/sources/xiaohongshu.js:296-352](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/sources/xiaohongshu.js#L296-L352)

详情及加载评论。

<details>
<summary>查看原文（57行）</summary>

```text
                id: url,
                title: detail.title || "小红书笔记",
                url,
                text: detail.text?.trim() || detail.title?.trim(),
                author: detail.authorName ? { name: detail.authorName, url: detail.authorUrl } : undefined,
                publishedAt: detail.publishedAt,
                likes: detail.likes,
                collects: detail.collects,
                replies: detail.comments,
                images: detail.images,
                platform: "xiaohongshu",
            };
            // The detail page hydrates its initial comment page into noteDetailMap.
            // Prefer that deterministic state over waiting for a network request that
            // may have completed before the CDP listener was attached.
            if (!structuredCommentPayload && (detail.comments || 0) > 0) {
                const commentStart = Date.now();
                while (Date.now() - commentStart < 4000) {
                    if (signal?.aborted)
                        break;
                    try {
                        structuredCommentPayload = await page.call(extractXhsCommentState, [noteId], signal);
                    }
                    catch {
                        // Keep polling while the SPA hydrates its comment state.
                    }
                    if (structuredCommentPayload)
                        break;
                    await new Promise((resolve) => setTimeout(resolve, 250));
                }
            }
            if (structuredCommentPayload) {
                commentCapture.cancel();
                const parsed = extractXhsComments(structuredCommentPayload);
                return {
                    item: appendCommentsToItem(item, parsed.comments, {
                        heading: "Comments",
                        truncated: parsed.truncated || (detail.comments || 0) > parsed.comments.length,
                    }),
                    retrievalMode: "native-browser",
                };
            }
            const commentOutcome = await commentCapture.wait();
            if (commentOutcome.state === "captured" && commentOutcome.status >= 200 && commentOutcome.status < 300) {
                const parsed = extractXhsComments(commentOutcome.json);
                return {
                    item: appendCommentsToItem(item, parsed.comments, {
                        heading: "Comments",
                        truncated: parsed.truncated || (detail.comments || 0) > parsed.comments.length,
                    }),
                    retrievalMode: "native-browser",
                };
            }
            return {
                item: appendCommentsToItem(item, [], {
                    heading: "Comments",
                    truncated: (detail.comments || 0) > 0,
```

</details>

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 部署及三阶段成本怎么判断？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

硬注入webServer/settings/credentials/web/agents/commands，沿宿主peers启用settings与标准Web工具；本地HTTP fetch无需Provider Key但只处理支持的文本，付费API须相应凭证/额度，SearXNG需自建可达实例，社媒需受支持本机浏览器和人工登录。UI需connection/locale/settings/remotes/React，发布入口lib/host/index.js与lib/client.js，不能只看TS未发布路径。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH Web/凭证/设置服务；可选服务商额度、自建SearXNG或Chrome/Edge专用profile | 选Provider/授权端点、设密钥和预算，平台需人工登录；工时未知 | 金额随服务商/模式与账户，不根据本地调用数推价格；原生平台不是免维护保证 |
| 持续使用 | 每个失败尝试/备用源请求、正文抓取/浏览器资源与宿主模型上下文 | 检查来源/时效/降级、登录失效和截断，人工核证，耗时未知 | 单attempt超时不是总链预算；多Key/深搜/失败可计费，额度显示不等硬消费上限 |
| 失败恢复 | 重试或更换源、浏览器profile/凭证重配资源 | 核失败分类、手动补抓/核全文，必要时停浏览器/重登 | reset删除专用profile需重建登录；第三方调用/账单不可由本插件回滚，工时金额未知 |

quota区分authoritative余额、response header与本地request count/unknown单位，不将不同单位伪合百分比有价值；本地次数不是美元成本或完整账单。fallback可增可用性也可把同查询送多个第三方，涉及隐私和收费选择，应按完成一次可核研究而非一次工具调用比较。无同条件召回/相关性/全文完整率/人工耗时对照，价格与净节约未知不填0。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:8-18](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/package.json#L8-L18)

实际发布入口。

<details>
<summary>查看原文（11行）</summary>

```text
  "main": "./lib/host/index.js",
  "exports": {
    ".": {
      "types": "./lib/host/index.d.ts",
      "default": "./lib/host/index.js"
    },
    "./client": {
      "types": "./lib/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./package.json": "./package.json"
```

</details>

**依据 2 · 源码核查**：[package.json:43-67](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/package.json#L43-L67)

依赖与宿主peers。

<details>
<summary>查看原文（25行）</summary>

```text
  "dependencies": {
    "defuddle": "^0.19.3",
    "linkedom": "^0.18.13",
    "undici": "^6.26.0",
    "ws": "^8.18.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-api-remotes": "^0.1.0-rc.6 || ^0.2.0-0 || ^0.2.1-0",
    "@deepseek-ai/dsh-client-connection": "^0.1.0-rc.6 || ^0.2.0-0 || ^0.2.1-0",
    "@deepseek-ai/dsh-client-locale": "^0.1.0-rc.6 || ^0.2.0-0 || ^0.2.1-0",
    "@deepseek-ai/dsh-client-ui-primitives": "^0.1.0-rc.6 || ^0.2.0-0 || ^0.2.1-0",
    "@deepseek-ai/dsh-client-ui-settings": "^0.1.0-rc.6 || ^0.2.0-0 || ^0.2.1-0",
    "@deepseek-ai/dsh-client-ui-slots": "^0.1.0-rc.6 || ^0.2.0-0 || ^0.2.1-0",
    "@deepseek-ai/dsh-credentials": "^0.1.0-rc.6 || ^0.2.0-0 || ^0.2.1-0",
    "@deepseek-ai/dsh-llm": "^0.1.0-rc.6 || ^0.2.0-0 || ^0.2.1-0",
    "@deepseek-ai/dsh-settings": "^0.1.0-rc.6 || ^0.2.0-0 || ^0.2.1-0",
    "@deepseek-ai/dsh-web": "^0.1.0-rc.6 || ^0.2.0-0 || ^0.2.1-0",
    "@deepseek-ai/schemastery": "^3.18.1",
    "react": "^18.2.0"
  },
  "scripts": {
    "build": "node -e \"require('fs').rmSync('lib',{recursive:true,force:true})\" && tsc -p tsconfig.build.json && tsdown",
    "prepack": "npm run build",
    "bundle": "tsdown",
```

</details>

**依据 3 · 源码核查**：[lib/host/index.js:26-28](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/index.js#L26-L28)

硬服务。

```text
export const name = "dsh-web-tools";
/** Services required by this plugin. */
export const inject = ["webServer", "settings", "credentials", "web", "agents", "commands"];
```

**依据 4 · 源码核查**：[lib/host/quota.js:32-68](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/quota.js#L32-L68)

本地次数/权威余额。

<details>
<summary>查看原文（37行）</summary>

```text
        supported: false,
        authoritative: false,
        unit: "unknown",
        source: "dashboard",
        fetchedAt: Date.now(),
        note,
    };
}
/**
 * A local-usage REQUEST-COUNT snapshot for providers whose actual balance
 * is only available in their dashboard (Exa, Parallel). Shows the number
 * of locally-observed searches, not a dollar amount — the audit concluded
 * that dollar estimates without mode/result-count tracking are misleading.
 */
export function localUsageQuota(count, note) {
    return {
        supported: true,
        authoritative: false,
        unit: "requests",
        used: count,
        source: "local_estimate",
        fetchedAt: Date.now(),
        note,
    };
}
/** True when a snapshot says the provider is effectively exhausted. */
export function isExhausted(snapshot) {
    if (!snapshot?.authoritative)
        return false;
    if (snapshot.remaining === undefined)
        return false;
    // self-hosted "no quota" (unit unknown, no remaining) → never exhausted
    if (snapshot.unit === "unknown" && snapshot.remaining === undefined)
        return false;
    return snapshot.remaining <= 0;
}
/** True when a snapshot is below the given fraction of its limit (router hint). */
```

</details>

**依据 5 · 源码核查**：[lib/host/registry.js:145-263](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/registry.js#L145-L263)

潜在多次尝试。

<details>
<summary>查看原文（119行）</summary>

```text
                }
                const adapter = adapterFor(providerName, snapshot);
                if (!adapter) {
                    attempts.push({ provider: providerName, outcome: "skipped-no-adapter" });
                    continue;
                }
                let entries = await pools.poolOf(providerName);
                const keyless = keylessOf(providerName, adapter, snapshot);
                if (entries.length === 0 && keyless) {
                    // Keyless sources (self-hosted SearXNG, or a custom source with auth
                    // mode "none") execute with an empty key.
                    entries = [new PoolEntry("", 0)];
                }
                else if (entries.length === 0) {
                    attempts.push({ provider: providerName, outcome: "skipped-no-keys" });
                    continue;
                }
                // Auth-invalid keys stay unhealthy until the credential actually
                // changes (refreshPool preserves healthy=false for persisted keys).
                // If the whole pool is unusable, skip this provider — do NOT reset.
                let usable = entries.filter((e) => e.healthy);
                if (usable.length === 0) {
                    attempts.push({ provider: providerName, outcome: "skipped-no-healthy-keys" });
                    continue;
                }
                // Provider-level cooldown (Retry-After). The store uses its own clock
                // (injectable for tests) — zero HTTP when cooling down.
                if (healthStore?.isCoolingDown(providerName)) {
                    attempts.push({ provider: providerName, outcome: "skipped-cooldown" });
                    continue;
                }
                // Provider-internal key failover: on AUTH failures only, try the next
                // healthy key in the SAME provider before falling back to another
                // provider. Non-auth failures (429/5xx/network/timeout) do not rotate
                // keys — they fall through to the next provider directly.
                let providerLevelDecision = null;
                // Base URL from the request snapshot, so an override edit mid-request
                // cannot make one attempt dial a different host than another.
                const searchBaseUrl = entryInfo?.builtIn
                    ? entryInfo.endpoint?.effectiveBaseUrl
                    : cfg.providerBaseUrls[providerName];
                while (usable.length > 0) {
                    const index = selectIndex(entries);
                    const entry = entries[index];
                    if (entry)
                        reserveKey(entries, index);
                    const started = Date.now();
                    const providerOptions = cfg.providerOptions?.[providerName];
                    try {
                        const outcome = await runWithTimeout((s) => adapter.search(request.query, maxResults, entry?.key ?? "", searchBaseUrl, {
                            signal: s,
                            options: providerOptions,
                            hints: searchHints,
                        }), cfg.providerAttemptTimeoutMs, signal);
                        if (entry)
                            markUsed(entries, index);
                        const latencyMs = Date.now() - started;
                        attempts.push({ provider: providerName, outcome: "success", latencyMs });
                        stats.record({ provider: providerName, outcome: "success", latencyMs });
                        return {
                            ...outcome,
                            truncated: false,
                            attempts,
                            backend: providerName,
                        };
                    }
                    catch (error) {
                        const err = toProviderError(error);
                        const latencyMs = Date.now() - started;
                        const decision = classifyFailure(err);
                        // Caller cancellation terminates the whole chain — never fall back.
                        if (decision === "terminal") {
                            providerLevelDecision = "terminal";
                            lastError = err;
                            attempts.push({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
                            stats.record({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
                            break;
                        }
                        if (decision === "non-retryable") {
                            providerLevelDecision = "break";
                            lastError = err;
                            attempts.push({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
                            stats.record({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
                            break;
                        }
                        // retryable:
                        if (err.code === "auth") {
                            // key indicted → mark unhealthy, try the next key in this pool
                            markUnhealthy(entries, index);
                            attempts.push({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
                            stats.record({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
                            usable = entries.filter((e) => e.healthy);
                            continue;
                        }
                        // non-auth retryable (429/5xx/network/timeout) → next provider
                        lastError = err;
                        // Only rate-limit errors carry a server-requested cooldown.
                        if (err.code === "rate-limit" && typeof err.retryAfterMs === "number" && err.retryAfterMs > 0) {
                            healthStore?.cooldownFor(providerName, err.retryAfterMs, "rate-limit");
                        }
                        attempts.push({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
                        stats.record({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
                        providerLevelDecision = "next-provider";
                        break;
                    }
                    finally {
                        if (entry)
                            releaseKey(entries, index);
                    }
                }
                if (providerLevelDecision === "terminal")
                    throw toWebError(lastError);
                if (providerLevelDecision === "break")
                    break;
                // else fall through to the next provider in the chain
            }
            const reason = lastError
                ? `${lastError.code}: ${lastError.message}`
                : "no usable provider";
```

</details>

#### 缺口

- 服务商实际计费、同查询多次尝试总开销、原生平台成功率和人工核证时间
  **影响**：多Key/fallback不是免费额度或已证明成本下降，功能适配也不证明结果质量
  **进一步探讨**：固定任务/策略/预算采集可核来源与总请求费、人工核证耗时，区分失败和有效产出

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 现有测试能支撑怎样的工程评价？

**研究主题**：工程质量与复用

#### 完整回答

发布JS执行器、transport、搜索模式和browser生命周期均可直接核查；TS保类型和测试组织，应用架构有纯函数SearchHints/路由、共享pool/health、typed error、abort与有界解析的可复用分层。测试里generic fetch注入Response与DNS，安全测试含地址/headers/Unicode和本地HTTP server/transport注入，runtime-scoping用假source隔离registry，provider-contracts检查UI枚举/选项，平台fixtures可检查GraphQL/结构化字段。这些支撑边界回归设计，不等第三方服务协议/真实账号持续有效或所有生产包装保metadata。

本轮只阅读代表测试与发布关键链，没有运行。库函数单测能断generic.truncated，却如果未经过sources.registry和toRoutedFetchResponse，就发现不了生产投影丢失；同理搜索模式两工具guard测试不能证明全宿主无网络。可借鉴点是测试对象与契约清楚、privileged配置面单独约束；重点补查应追端到端来源/截断/错误性质与策略范围，而非只增加同实现镜像断言。

#### 证据与依据

**依据 1 · 源码核查**：[test/generic-fetch.test.ts:1-62](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/test/generic-fetch.test.ts#L1-L62)

mock HTTP/DNS。

<details>
<summary>查看原文（62行）</summary>

```text
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { fetchGenericWebPage, GenericFetchError, MAX_FETCH_BYTES } from "../src/host/generic-fetch.ts";

describe("generic-fetch: Defuddle & linkedom extraction", () => {
  it("extracts clean markdown and metadata from standard HTML with strictly local parsing", async () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>DeepSeek Harness Architecture Guide</title>
          <meta name="author" content="DeepSeek Team">
          <meta name="description" content="An architecture overview for plugin developers.">
        </head>
        <body>
          <header>
            <nav><a href="/">Home</a> <a href="/docs">Docs</a></nav>
          </header>
          <main>
            <article>
              <h1>DeepSeek Harness Architecture Guide</h1>
              <p>DeepSeek Harness provides extensible seams for tools, models, and plugins.</p>
              <h2>Key Features</h2>
              <ul>
                <li>Multi-provider search</li>
                <li>Native browser capture</li>
                <li>Resilient fallback</li>
              </ul>
            </article>
          </main>
          <footer>
            <p>Copyright 2026</p>
          </footer>
        </body>
      </html>
    `;

    const mockFetch = async (url: string | URL, init?: RequestInit): Promise<Response> => {
      return new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    };

    const mockDnsLookup = async () => [{ address: "93.184.216.34", family: 4 }];

    const res = await fetchGenericWebPage("https://example.com/guide", {
      customFetchWithProxy: mockFetch as any,
      customDnsLookup: mockDnsLookup,
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.backend, "builtin-http");
    assert.equal(res.extraction, "defuddle");
    assert.equal(res.title, "DeepSeek Harness Architecture Guide");
    assert(res.content.includes("DeepSeek Harness provides extensible seams"));
    assert(!res.truncated);
  });

  it("handles plain text, markdown, json, and xml with raw-text extraction", async () => {
    const mockDnsLookup = async () => [{ address: "93.184.216.34", family: 4 }];

```

</details>

**依据 2 · 源码核查**：[test/custom-provider-security.test.ts:13-32](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/test/custom-provider-security.test.ts#L13-L32)

transport依赖与server。

<details>
<summary>查看原文（20行）</summary>

```text
import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import {
  assertEndpointUrl,
  assertHeaderName,
  truncateUnicodeSafe,
  assertAddressAllowed,
  isLoopbackUrl,
  preflightDns,
  transact,
  TransportError,
  type OutboundPolicy,
} from "../src/host/provider-transport.ts";
import { configPlaneTrust } from "../src/host/routes.ts";

test("Security: assertEndpointUrl enforces strict HTTP(S) structure", () => {
  // Valid endpoints
  assert.equal(assertEndpointUrl("https://search.example.com/search").href, "https://search.example.com/search");
```

</details>

**依据 3 · 源码核查**：[test/runtime-scoping.test.ts:1-43](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/test/runtime-scoping.test.ts#L1-L43)

fake source隔离。

<details>
<summary>查看原文（43行）</summary>

```text
import assert from "node:assert/strict";
import test from "node:test";
import { SpecializedSourceRegistry } from "../src/host/sources/registry.ts";
import { BraveQuotaManager, braveQuotaFromHeaders } from "../src/host/providers/brave.ts";
import type { SpecializedSource, SourceStatus, SourceSearchOutcome, SourceFetchOutcome } from "../src/host/sources/types.ts";

test("Phase 3: 1. two independent SpecializedSourceRegistries operate in isolation", async () => {
  const reg1 = new SpecializedSourceRegistry();
  const reg2 = new SpecializedSourceRegistry();

  const source1: SpecializedSource = {
    id: "x",
    name: "Twitter / X (1)",
    async status(): Promise<SourceStatus> {
      return {
        id: "x",
        name: "Twitter / X (1)",
        enabled: true,
        runtimeAvailable: true,
        runtimeState: "ready",
        authenticated: true,
      };
    },
    async search(): Promise<SourceSearchOutcome> {
      return { items: [{ id: "1", title: "Reg 1", url: "https://x.com/1", platform: "x" }] };
    },
    async fetch(): Promise<SourceFetchOutcome> {
      return { item: { id: "1", title: "Reg 1", url: "https://x.com/1", text: "Reg 1", platform: "x" } };
    },
  };

  reg1.registerSource(source1);
  reg1.setPlatformEnabled({ x: true });

  assert.equal(reg1.getSource("x")?.name, "Twitter / X (1)");
  assert.equal(reg2.getSource("x"), undefined);

  const stat1 = await reg1.getPlatformStatuses();
  const stat2 = await reg2.getPlatformStatuses();
  assert.equal(stat1.find((s) => s.id === "x")?.name, "Twitter / X (1)");
  assert.equal(stat2.find((s) => s.id === "x")?.name, "Twitter / X");
  assert.equal(stat2.find((s) => s.id === "x")?.runtimeState, "unavailable");
});
```

</details>

**依据 4 · 源码核查**：[test/provider-contracts.test.ts:1-53](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/test/provider-contracts.test.ts#L1-L53)

UI枚举契约。

<details>
<summary>查看原文（53行）</summary>

```text
/**
 * dsh-web-tools — provider-native option contracts unit tests.
 *
 * Verifies that the UI option values match the Host's sanitizer accept list
 * and the API documentation. These tests are pure JS (no DOM, no React).
 * @module
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  BRAVE_THRESHOLD_OPTIONS,
  BRAVE_TOKEN_BUDGET_PRESETS,
  PARALLEL_PRIMARY_MODES,
  PARALLEL_EXPERIMENTAL_MODES,
  PARALLEL_ALL_MODES,
  tavilyChunksVisible,
  EXA_SEARCH_TYPE_OPTIONS,
  exaPrimaryMode,
  exaPrimaryApplyable,
} from "../src/client/provider-preferences/contracts.ts";

// ------ Brave content threshold ------
test("Brave: uses disabled not off for the off/threshold value", () => {
  assert.ok(BRAVE_THRESHOLD_OPTIONS.includes("disabled"));
  assert.ok(!BRAVE_THRESHOLD_OPTIONS.includes("off"));
});

test("Brave: accepts the full Brave API enum", () => {
  assert.deepStrictEqual([...BRAVE_THRESHOLD_OPTIONS], ["strict", "balanced", "lenient", "disabled"]);
});

test("Brave: token budget presets include 32K (32768)", () => {
  assert.ok(BRAVE_TOKEN_BUDGET_PRESETS.includes(32768));
  assert.ok(BRAVE_TOKEN_BUDGET_PRESETS.includes(16384));
  assert.ok(BRAVE_TOKEN_BUDGET_PRESETS.includes(8192));
  assert.ok(BRAVE_TOKEN_BUDGET_PRESETS.includes(4096));
});

test("Brave: max token budget matches the API max of 32768", () => {
  assert.strictEqual(Math.max(...BRAVE_TOKEN_BUDGET_PRESETS), 32768);
});

// ------ Parallel mode contracts ------
test("Parallel: primary UI modes are advanced and basic only", () => {
  assert.deepStrictEqual([...PARALLEL_PRIMARY_MODES], ["advanced", "basic"]);
});

test("Parallel: experimental modes are fast and turbo", () => {
  assert.deepStrictEqual([...PARALLEL_EXPERIMENTAL_MODES], ["fast", "turbo"]);
});

test("Parallel: all modes combined match the adapter's full set", () => {
  assert.deepStrictEqual([...PARALLEL_ALL_MODES], ["advanced", "basic", "fast", "turbo"]);
```

</details>

**依据 5 · 源码核查**：[lib/host/index.js:38-79](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/index.js#L38-L79)

生产投影不能被单层检查替代。

<details>
<summary>查看原文（42行）</summary>

```text
let versionCache = null;
export function toRoutedFetchResponse(url, outcome) {
    if (outcome.error) {
        const error = new WebToolsWebError(`platform fetch failed (${outcome.error.code}): ${outcome.error.message}`);
        if (outcome.error.code === "aborted")
            error.code = "WEB_ABORTED";
        throw error;
    }
    const item = outcome.item;
    const rawContent = item?.text?.trim();
    if (!item || !rawContent) {
        throw new WebToolsWebError(`platform fetch returned empty content for ${url}`);
    }
    const sections = [];
    if (item.title?.trim() && !rawContent.startsWith(item.title.trim())) {
        sections.push(`# ${item.title.trim()}`);
    }
    const metadata = [];
    const author = item.author?.handle || item.author?.name;
    if (author)
        metadata.push(`Author: ${author}`);
    if (item.publishedAt)
        metadata.push(`Published: ${item.publishedAt}`);
    const engagement = [
        typeof item.likes === "number" ? `likes ${item.likes}` : undefined,
        typeof item.collects === "number" ? `collects ${item.collects}` : undefined,
        typeof item.retweets === "number" ? `retweets ${item.retweets}` : undefined,
        typeof item.replies === "number" ? `comments/replies ${item.replies}` : undefined,
    ].filter(Boolean);
    if (engagement.length > 0)
        metadata.push(`Engagement: ${engagement.join(", ")}`);
    if (metadata.length > 0)
        sections.push(metadata.join("\n"));
    sections.push(rawContent);
    if (item.images?.length)
        sections.push(`Images: ${item.images.length} attached`);
    const content = sections.join("\n\n");
    return {
        url,
        statusCode: 200,
        body: { kind: "text", content },
        truncated: false,
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 怎样采用与推导可证伪的新方向？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可在可信本机单用户环境、小范围公开URL任务中试用，手动核原来源/全文与实际服务商支出，不把Search Mode off当全宿主断网、required当取得权威证据或truncated=false当全文。配置新端点要确认凭证目的地，平台账号单独授权，保留必要来源定位并把片段与原生详情/评论分开。限制源于已核到的策略/投影边界，而非普通未做宿主验证。需要全量页面/评论、对恶意URL强SSRF隔离或多用户凭证隔离的部署先不依赖现有保证。

未来方向是“带策略与完整性收据的统一检索”。参照现有SearchHints/attempts和被outer wrapper丢失的metadata，返回从源到标准工具保真的receipt，含query约束采纳/不支持字段、后端/原生或fallback、finalUrl、采集时间/截断/评论范围、尝试与预算；page fetch连接也复用预检IP绑定，模式明确网络能力覆盖集合。比较单Provider和当前统一接口，以多源坏Key/429、零结果、图片主文、超过5MiB、重定向/DNS翻转、off下其他网络和所有Provider失败作最小反例。若仍把降级片段当原生或裁剪当全文、策略覆盖误标或成本预算不可解释，则否定信任收益；若收据增加上下文/核证工时却不减少误用，也否定实用性。未验证，不算现有插件能力。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host/registry.js:204-221](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/registry.js#L204-L221)

attempt/backend原始信息。

<details>
<summary>查看原文（18行）</summary>

```text
                        return {
                            ...outcome,
                            truncated: false,
                            attempts,
                            backend: providerName,
                        };
                    }
                    catch (error) {
                        const err = toProviderError(error);
                        const latencyMs = Date.now() - started;
                        const decision = classifyFailure(err);
                        // Caller cancellation terminates the whole chain — never fall back.
                        if (decision === "terminal") {
                            providerLevelDecision = "terminal";
                            lastError = err;
                            attempts.push({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
                            stats.record({ provider: providerName, outcome: `failed:${err.code}`, latencyMs });
                            break;
```

</details>

**依据 2 · 源码核查**：[lib/host/sources/registry.js:127-143](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/sources/registry.js#L127-L143)

信息损失参照。

<details>
<summary>查看原文（17行）</summary>

```text
        if (!targetPlatform) {
            if (this.fallbackFetchProvider) {
                const res = await this.fallbackFetchProvider.fetch({ url }, signal);
                return {
                    item: {
                        id: res.url || url,
                        title: res.metadata?.title || "Web Page",
                        url: res.url || url,
                        text: res.body?.content || "",
                        platform: "general",
                        author: res.metadata?.author ? { name: res.metadata.author } : undefined,
                        publishedAt: res.metadata?.publishedAt,
                    },
                    retrievalMode: "general-web",
                };
            }
            return { error: { code: "runtime-unavailable", message: "No fetch provider available", retryable: false } };
```

</details>

**依据 3 · 源码核查**：[lib/host/index.js:38-79](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/index.js#L38-L79)

外层投影参照。

<details>
<summary>查看原文（42行）</summary>

```text
let versionCache = null;
export function toRoutedFetchResponse(url, outcome) {
    if (outcome.error) {
        const error = new WebToolsWebError(`platform fetch failed (${outcome.error.code}): ${outcome.error.message}`);
        if (outcome.error.code === "aborted")
            error.code = "WEB_ABORTED";
        throw error;
    }
    const item = outcome.item;
    const rawContent = item?.text?.trim();
    if (!item || !rawContent) {
        throw new WebToolsWebError(`platform fetch returned empty content for ${url}`);
    }
    const sections = [];
    if (item.title?.trim() && !rawContent.startsWith(item.title.trim())) {
        sections.push(`# ${item.title.trim()}`);
    }
    const metadata = [];
    const author = item.author?.handle || item.author?.name;
    if (author)
        metadata.push(`Author: ${author}`);
    if (item.publishedAt)
        metadata.push(`Published: ${item.publishedAt}`);
    const engagement = [
        typeof item.likes === "number" ? `likes ${item.likes}` : undefined,
        typeof item.collects === "number" ? `collects ${item.collects}` : undefined,
        typeof item.retweets === "number" ? `retweets ${item.retweets}` : undefined,
        typeof item.replies === "number" ? `comments/replies ${item.replies}` : undefined,
    ].filter(Boolean);
    if (engagement.length > 0)
        metadata.push(`Engagement: ${engagement.join(", ")}`);
    if (metadata.length > 0)
        sections.push(metadata.join("\n"));
    sections.push(rawContent);
    if (item.images?.length)
        sections.push(`Images: ${item.images.length} attached`);
    const content = sections.join("\n\n");
    return {
        url,
        statusCode: 200,
        body: { kind: "text", content },
        truncated: false,
```

</details>

**依据 4 · 源码核查**：[lib/host/search-mode-runtime.js:223-262](https://github.com/A3Boy/dsh-web-tools/blob/bb68082d1274dc0d28ed5921bb08c7b5070fae7f/lib/host/search-mode-runtime.js#L223-L262)

工具集合守卫。

<details>
<summary>查看原文（40行）</summary>

```text
}
/** The two model-facing web tools this plugin owns the policy for. */
export const WEB_TOOL_NAMES = ["web_search", "web_fetch"];
/** Denial reason shown to the model when it calls a web tool while OFF. */
export const WEB_DISABLED_DENIAL = "Web search is switched OFF for this session, so this tool call was denied. Answer from the existing context and state what could not be verified.";
/**
 * Wire the Search Mode runtime into a host context. All agent-scoped listeners
 * register per created agent (the scope-filtered dispatch seam), and every
 * contribution is effect-scoped so stop/update/undefine removes it cleanly.
 * @param messages - pre-built official UserMessage factories ({ content, source }).
 */
export function installSearchModeRuntime(ctx, _deps, runtime, messages) {
    const onCreated = ctx.on("agent/created", (payload) => {
        const agent = payload.agent;
        // Register this agent's listeners inside its own scope so scope-filtered
        // dispatch reaches them; cleaning up when the agent scope unwinds.
        return agent.ctx.effect(() => {
            // ---- layer 1: hide the web tools from this agent's tool list ---------
            // Scoped, so other sessions keep their tools. Applied at turn start and
            // lifted as soon as the mode leaves `off`.
            let liftRestriction;
            const syncRestriction = () => {
                const off = runtime.isOff(agent.id);
                if (off && liftRestriction === undefined) {
                    liftRestriction = agent.ctx.tools?.restrict?.({ deny: [...WEB_TOOL_NAMES] });
                }
                else if (!off && liftRestriction !== undefined) {
                    liftRestriction();
                    liftRestriction = undefined;
                }
            };
            // ---- layer 2: monotonic gate -----------------------------------------
            // Model inertia can still emit a call from history after a toggle; the
            // guard denies it before the body runs and cannot be re-allowed by a
            // later listener.
            const stopGuard = agent.ctx.tools?.guard?.((execution) => runtime.isOff(agent.id) && WEB_TOOL_NAMES.includes(execution.name) ? WEB_DISABLED_DENIAL : undefined);
            const stopPreStep = agent.ctx.on("agent/pre-step", async (payload, next) => {
                const decision = await next();
                if (!decision || decision.kind === "reject")
                    return decision;
```

</details>

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
