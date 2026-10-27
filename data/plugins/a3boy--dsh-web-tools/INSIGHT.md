# dsh-web-tools

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[cfa00a7](https://github.com/A3Boy/dsh-web-tools/tree/cfa00a70b600da212915ac3a82e970e9b93ac9c2)

<!-- BEGIN META -->
[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/A3Boy/dsh-web-tools)
<!-- END META -->

> **实现功能**：为DSH提供多供应商网页搜索与抓取，以及小红书和X浏览器来源接入。

> **核心亮点**：统一宿主接口下保留后端差异并显式处理平台失败，是检索工程组合增量；不是检索算法或完整语义理解证明。见 [Q01](#research-q01)。

> **风险与缺陷**：工具成功和固定truncated:false不能代表来源完整、约束保真或图片/评论已覆盖；长查询与规则启发式还会改变检索语义。见 [Q03](#research-q03)。

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
  - [Q01 · 多来源检索解决什么任务，增量来自哪里？](#detail-section-11)
  - [Q02 · 查询语义和失败状态如何被编译与路由？](#detail-section-12)
  - [Q03 · 统一接口是否保存了完整语义与证据范围？](#detail-section-13)
  - [Q04 · 用户要承担哪些外部服务、账号与重试成本？](#detail-section-14)
  - [Q05 · 哪些设计值得借鉴，怎样控制试用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合有重复资料检索与服务中断问题的用户，合格材料仍须来源可追溯且覆盖问题。原生单服务对照见 [Q01](#research-q01)。

单供应商原生接入、最低公分母多服务代理与人工浏览器检索；未实际比较检索排名，不确认供应商当前价格。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 多后端网页搜索 | 统一请求与后备 | 后端参数能力不同 |
| 网页内容提取 | 提供正文材料 | 原文覆盖需人工核对 |
| SearchHints编译 | 映射日期/域名/主题 | 规则启发式，非通用语义理解 |
| X/小红书来源 | 登录态搜索/详情入口 | 本地浏览器、登录和平台限制 |
| 密钥/健康路由 | 对认证/限流分别恢复 | 后备调用可能增加成本 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH web/credentials/settings等 | 必需 | 注册与配置 | 不保证加载 |
| 配置供应商或自建搜索服务 | 普通检索必需 | 搜索/提取 | 无可用后端则失败 |
| 本地Chrome/Edge与平台登录 | 平台源必需 | 原生搜索/详情 | 登录/访问错误需人工处理 |
| 网络及允许的预算 | 远端请求必需 | 后端与页面访问 | 后备可能增加调用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户配置单一可信后端与预算 | 可返回可追溯样例 |
| 2 | 逐个启用备用与平台登录 | 来源及失败语义正确 |
| 3 | 执行带域名/日期的公开查询 | 对照原文确认约束和遗漏 |
| 4 | 记录所有请求和人工复核 | 费用/质量不符即停用对应路径 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | API账户/自建服务与浏览器配置 | 设置密钥、地址、登录 | 价格和配置时间未知 |
| 持续使用 | 成功及失败后备请求、模型上下文 | 核原文、维护登录/API | 无单位合格资料成本 |
| 失败恢复 | 超时和备用调用 | 检查错误分类及来源 | 不可重试登录/访问错误须人工处理 |
| 迁移退出 | 配置和账号资料管理 | 禁用提供者、撤销不需密钥 | 实际退出与迁移时间未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 服务中断恢复 | 密钥/后端分类和冷却 | 实际可用率及追加费用 |
| 参数适配 | 硬软域名与主题编译 | 全语义和全供应商等价性 |
| 平台材料 | 原生来源与失败保留 | 图片OCR、全部评论及召回 |

> **思考**：工具成功和固定truncated:false不能代表来源完整、约束保真或图片/评论已覆盖；长查询与规则启发式还会改变检索语义。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：统一宿主接口下保留后端差异并显式处理平台失败，是检索工程组合增量；不是检索算法或完整语义理解证明。见 [Q01](#research-q01)。

统一宿主接口下保留后端差异并显式处理平台失败，是检索工程组合增量；不是检索算法或完整语义理解证明。见 [Q01](#research-q01)。

意图编译、健康状态与来源路由分离便于复用；维护成本来自供应商协议和平台页面不断变化，证据覆盖仍需独立验收。见 [Q02](#research-q02) 与 [Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

工具成功和固定truncated:false不能代表来源完整、约束保真或图片/评论已覆盖；长查询与规则启发式还会改变检索语义。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议在可信本机、公开材料和小预算下试用，逐项回原文验收并记录全部尝试成本。平台来源及停止条件见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

参数编译和故障路由有源码支持；可用性/质量/总成本未实测，覆盖证明为未验证设计假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/host/index.ts、src/host/search-hints.ts、src/host/providers/parallel.ts、src/host/registry.ts、src/host/pool.ts、src/host/sources/registry.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定版本宿主注册、SearchHints规则、Parallel编译、密钥池/路由和平台registry；未逐项审阅全部八家API、浏览器脚本、通用抓取安全实现或真实服务。
- 下一步：已检查源码；未运行目标代码、测试、真实API或登录浏览器，不将作者功能声明当独立验收。

**分析版本**

- **仓库**：[A3Boy/dsh-web-tools](https://github.com/A3Boy/dsh-web-tools)
- **版本号**：0.3.8（[固定提交 cfa00a7](https://github.com/A3Boy/dsh-web-tools/tree/cfa00a70b600da212915ac3a82e970e9b93ac9c2)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是输出约束执行、覆盖和降级来源证明，帮助减少可用性与完整性混淆；对照及否定条件见 [Q05](#research-q05)。

已检查源码；未运行目标代码、测试、真实API或登录浏览器，不将作者功能声明当独立验收。

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

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/A3Boy/dsh-web-tools/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对多供应商搜索/抓取的适配增量、失败语义和合格证据边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 多来源检索解决什么任务，增量来自哪里？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要持续获得网页与社交平台材料的DSH研究用户。合格交付应能回到原页面、区分原生平台与普通索引结果，并核对正文是否覆盖问题。相对单供应商接入，贡献在统一宿主web接口下保留供应商专有参数、组织多密钥/供应商故障转移和本地登录态平台来源。它没有提出新的检索排序算法，SearchHints是规则解析与参数编译；服务端可用性改善不能自动等同相关性、召回或事实正确率提高。简单单服务配置仍是低维护替代。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:30-46](https://github.com/A3Boy/dsh-web-tools/blob/cfa00a70b600da212915ac3a82e970e9b93ac9c2/README.md#L30-L46)

作者提出单供应商中断和参数最低公分母问题。

<details>
<summary>查看原文（17行）</summary>

```text
## What problem does it solve?

When web access depends on a single provider, exhausted quota, rate limits, or timeouts can interrupt retrieval. Wrapping multiple APIs with a naive proxy often flattens them to a lowest common denominator, failing to leverage each provider's specialized search modes, categories, freshness, domain rules, and extraction capabilities.

dsh-web-tools connects Exa, Tavily, Firecrawl, Parallel, Brave, You.com, Jina, SearXNG, Xiaohongshu, and Twitter / X to DSH’s standard `web_search` / `web_fetch` interface.

While keeping the tool interface unified, dsh-web-tools normalizes search intents through SearchHints and compiles queries into native provider-specific parameters. This leverages each engine's native categories, freshness filters, domain policies, regional targeting, and content extraction, while maximizing uptime through multi-key allocation, automated failover, and dedicated browser profiles.

---

**Key Highlights**:

- **Native-Capability Adaptation Across 8 Web Providers**: Keeps the standard `web_search` / `web_fetch` contracts while compiling unified search intent into provider-specific native parameters instead of reducing every backend to the same lowest-common-denominator feature set.
- **SearchHints → Provider-Specific Parameter Compilation**: Normalizes technical, research, news, date, region, and domain constraints from queries, compiling them into provider-native parameters through deterministic code without additional LLM latency.
- **Xiaohongshu & Twitter / X Platform Sources**: Both platforms support signed-in native search, detail extraction, and returned comments or replies through dedicated local browser profiles.
- **Multi-Source Scheduling & Resilience**: Features multi-API-key pooling, 401 failover, 429 cooldown windows, configurable Ordered / Round-Robin / Random routing, and failover chains.
- **Native DSH Tool Integration**: Plugs directly into standard `web_search` / `web_fetch` without requiring new tool declarations, and includes a session-level "Search Mode" toggle.
```

</details>

**依据 2 · 源码核查**：[src/host/index.ts:295-358](https://github.com/A3Boy/dsh-web-tools/blob/cfa00a70b600da212915ac3a82e970e9b93ac9c2/src/host/index.ts#L295-L358)

统一web提供者和平台来源注册链。

<details>
<summary>查看原文（64行）</summary>

```text
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
    search: async (request: { query: string; maxResults?: number }, signal?: AbortSignal) => {
      const outcome = await sourceRegistry.search(
        request.query,
        { maxResults: request.maxResults, hints: extractSearchHints(request.query) },
        signal,
      );
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
  ctx.web.registerSearchProvider(routedSearchProvider as never);

  // Wrap fetch provider with SpecializedSourceRouter
  const routedFetchProvider = {
    id: `${PROVIDER_ID}-fetch`,
    available: () => generalFetchProvider.available(),
    fetch: async (request: { url: string }, signal?: AbortSignal) => {
      const outcome = await sourceRegistry.fetch(request.url, signal);
      return toRoutedFetchResponse(request.url, outcome);
    },
  };
  ctx.web.registerFetchProvider(routedFetchProvider as never);

  // Specialized Sources: Register Xiaohongshu and Twitter/X with NativeBrowserRuntime
  const nativeRuntime = createNativeBrowserRuntime();
  const xhsSource = new XiaohongshuSource(nativeRuntime);
  const xSource = new XSource(nativeRuntime);
  sourceRegistry.registerSource(xhsSource);
  sourceRegistry.registerSource(xSource);
```

</details>

#### 缺口

- 没有同查询集的相关性与可用性对照
  **影响**：无法量化多来源相对单服务的实际收益
  **进一步探讨**：固定问题/预算比较原生单服务、统一最低参数与完整适配，人工评相关性和可追溯性

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 查询语义和失败状态如何被编译与路由？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

SearchHints从显式site、日期、语言及主题词提取结构化意图，区分硬域名限制与软官方来源偏好。Parallel适配例将软偏好放objective、cleanQuery放search_queries、硬域名和after日期放source_policy；代码是确定性的，不额外调用LLM。通用检索共用健康状态，认证失败换同供应商密钥，限流/网络/服务器错误转下一供应商，Retry-After触发供应商冷却，调用取消终止链。平台源成功即使零结果也保留原生结论；非retryable登录/访问错误直接返回，避免以索引搜索伪装原生成功。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/search-hints.ts:93-154](https://github.com/A3Boy/dsh-web-tools/blob/cfa00a70b600da212915ac3a82e970e9b93ac9c2/src/host/search-hints.ts#L93-L154)

规则解析的具体词表与日期/site模式。

<details>
<summary>查看原文（62行）</summary>

```text
// Regex patterns for operator extraction
const SITE_INCLUDE_RE = /(?:^|\s)site:([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?:\b|\s|$)/gi;
const SITE_EXCLUDE_RE = /(?:^|\s)-site:([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?:\b|\s|$)/gi;

// Platform indicators (high precision to avoid false positives on solitary 'x' or common words)
const XIAOHONGSHU_EXPLICIT_RE = /(?:小红书|rednote|\bxsec_token\b)/i;
const XIAOHONGSHU_CLEAN_RE = /(?:(?:请\s*)?(?:在|去)?\s*(?:小红书|rednote)(?:上|里|中)?\s*(?:搜索|搜|查找|找|看看)?)/gi;

const X_EXPLICIT_RE = /(?:twitter|推特|x\.com|twitter\.com|(?:在|上)X(?:上|里|中)?|X\s*(?:平台|推特|社区|帖子|动态|热搜)|^\s*X\s*[:：])/i;
const X_ROUTE_PREFIX_RE = /^\s*X\s*[:：]\s*/i;
const X_CLEAN_RE = /(?:(?:请\s*)?(?:在|去)?\s*(?:X(?:上|里|中)|(?:twitter|推特)(?:上|里|中)?|X\s*(?:平台|推特|社区|帖子|动态|热搜)(?:上|里|中)?)\s*(?:搜索|搜|查找|找|看看)?)/gi;

// Code topic indicators (keywords or patterns)
const CODE_INDICATORS = [
  /\b(github|gitlab|npm|pnpm|cargo|pip|pypi|nuget|crates\.io|stackoverflow|golang|typescript|python|rust|c\+\+|javascript|react|vue|svelte|docker|k8s|kubernetes|linux|bash|powershell|sql|postgres|redis|git|api|sdk|graphql|rest|grpc|webhook|bug|error|issue|pr|pull request|stacktrace|exception|panic|segfault|syntax|compiler|traceback)\b/i,
  /(?:代码|函数|接口|报错|崩溃|源码|组件|配置|版本号|仓库|提交|异常|编译)/,
];

// News topic indicators
const NEWS_INDICATORS = [
  /\b(news|breaking|announced|announcement|press release|headline|journal|report|coverage)\b/i,
  /(?:新闻|快讯|发布会|报道|最新消息|突发|动态|头条)/,
];

// Finance topic indicators
const FINANCE_INDICATORS = [
  /\b(stock|shares|nasdaq|nyse|sec|10-k|10-q|earnings|revenue|market cap|valuation|ipo|crypto|bitcoin|ethereum|dividend|fiscal|quarterly|ebitda)\b/i,
  /(?:财报|股价|营收|市值|估值|财季|分红|股票|证券|上市|收益率|净利润)/,
];

// Research topic indicators
const RESEARCH_INDICATORS = [
  /\b(arxiv|paper|research|benchmark|ablation|evaluation|dataset|methodology|conference|neurips|icml|iclr|cvpr|acl|ieee|springer|nature|science)\b/i,
  /(?:论文|学术|评测|基准|消融实验|数据集|学术会议|研报|文献)/,
];

// Freshness indicators
const DAY_INDICATORS = [
  /\b(today|past 24 hours|last 24 hours|24h|today's)\b/i,
  /(?:今天|今日|过去24小时|24小时内|当天)/,
];
const WEEK_INDICATORS = [
  /\b(this week|past week|last 7 days|7d|recent week)\b/i,
  /(?:本周|这一周|过去7天|近7天|最近一周)/,
];
const MONTH_INDICATORS = [
  /\b(this month|past month|last 30 days|latest|recently|recent|newest|current)\b/i,
  /(?:本月|过去30天|近1个月|最近|最新|近期|近来)/,
];
const YEAR_INDICATORS = [
  /\b(this year|past year|last 12 months|annual)\b/i,
  /(?:今年|本年度|近1年|过去一年)/,
];

// Explicit date range in query (e.g. 2026-08-01..2026-08-20 or after:2026-01-01)
const AFTER_DATE_RE = /\bafter:(\d{4}-\d{2}-\d{2})\b/i;
const BEFORE_DATE_RE = /\bbefore:(\d{4}-\d{2}-\d{2})\b/i;

// Official source preference indicators
const OFFICIAL_PREFERENCE_INDICATORS = [
  /\b(official|primary doc|primary documentation|official docs?|official website|canonical source)\b/i,
  /(?:官方文档|官网|官方|权威来源|正规文档|官方指南)/,
```

</details>

**依据 2 · 源码核查**：[src/host/providers/parallel.ts:129-166](https://github.com/A3Boy/dsh-web-tools/blob/cfa00a70b600da212915ac3a82e970e9b93ac9c2/src/host/providers/parallel.ts#L129-L166)

硬软语义分别编译到请求参数。

<details>
<summary>查看原文（38行）</summary>

```text
): Record<string, unknown> {
  let objective = query;
  const cleanQ = hints?.cleanQuery ? hints.cleanQuery : query;

  // Soft steering via objective (Parallel official best practice)
  if (hints?.domains?.preferOfficial) {
    objective += "\nPrefer primary documentation and official sources when available.";
  } else if (hints?.domains?.prefer && hints.domains.prefer.length > 0 && !hints.domains.include) {
    objective += `\nPrefer sources from: ${hints.domains.prefer.join(", ")}.`;
  }

  // Advanced settings & source policy
  const advancedSettings: Record<string, unknown> = {
    max_results: count,
  };

  const sourcePolicy: Record<string, unknown> = {};
  if (hints?.domains?.include && hints.domains.include.length > 0) {
    sourcePolicy.include_domains = hints.domains.include;
  }
  if (hints?.domains?.exclude && hints.domains.exclude.length > 0) {
    sourcePolicy.exclude_domains = hints.domains.exclude;
  }
  if (hints?.freshness?.after) {
    sourcePolicy.after_date = hints.freshness.after;
  }

  if (Object.keys(sourcePolicy).length > 0) {
    advancedSettings.source_policy = sourcePolicy;
  }

  const body: Record<string, unknown> = {
    objective,
    search_queries: [normalizeParallelQuery(cleanQ)],
    mode: options?.mode ?? "advanced",
    advanced_settings: advancedSettings,
  };

```

</details>

**依据 3 · 源码核查**：[src/host/registry.ts:263-344](https://github.com/A3Boy/dsh-web-tools/blob/cfa00a70b600da212915ac3a82e970e9b93ac9c2/src/host/registry.ts#L263-L344)

密钥轮换、取消和限流路由。

<details>
<summary>查看原文（82行）</summary>

```text
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
        let providerLevelDecision: "next-provider" | "break" | "terminal" | null = null;
        // Base URL from the request snapshot, so an override edit mid-request
        // cannot make one attempt dial a different host than another.
        const searchBaseUrl = entryInfo?.builtIn
          ? entryInfo.endpoint?.effectiveBaseUrl
          : cfg.providerBaseUrls[providerName];
        while (usable.length > 0) {
          const index = selectIndex(entries);
          const entry = entries[index];
          if (entry) reserveKey(entries, index);
          const started = Date.now();
          const providerOptions = cfg.providerOptions?.[providerName as keyof StoredProviderOptions];
          try {
            const outcome = await runWithTimeout(
              (s) =>
                adapter.search(request.query, maxResults, entry?.key ?? "", searchBaseUrl, {
                  signal: s,
                  options: providerOptions,
                  hints: searchHints,
                }),
              cfg.providerAttemptTimeoutMs,
              signal,
            );
            if (entry) markUsed(entries, index);
            const latencyMs = Date.now() - started;
            attempts.push({ provider: providerName, outcome: "success", latencyMs });
            stats.record({ provider: providerName, outcome: "success", latencyMs });
            return {
              ...outcome,
              truncated: false,
              attempts,
              backend: providerName,
            };
          } catch (error) {
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
```

</details>

**依据 4 · 源码核查**：[src/host/sources/registry.ts:135-159](https://github.com/A3Boy/dsh-web-tools/blob/cfa00a70b600da212915ac3a82e970e9b93ac9c2/src/host/sources/registry.ts#L135-L159)

原生成功/零结果和不可重试错误保留。

<details>
<summary>查看原文（25行）</summary>

```text
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
    return fallbackSearchToGeneralWeb(
      query,
      platform,
      this.fallbackSearchProvider,
      req?.maxResults,
      signal,
    );
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 统一接口是否保存了完整语义与证据范围？

**研究主题**：缺陷与关键质疑

#### 完整回答

关键质疑是统一成功会否掩盖约束或内容缺失。规则词表无法保证任意自然语言理解；适配器间参数能力也不同，Parallel查询会被截到200字符，并非每种时间边界都映射。宿主返回映射只保留URL、标题、摘要和时间，写死truncated:false，因此不能把该标记理解成网页、平台评论或原问题已完整覆盖。README明确社交详情最多30评论/回复、每项800字且不做图片OCR，这是内容边界而非无结果。研究者必须核对实际来源和正文，不能只靠工具调用成功或多个后端数量。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/providers/parallel.ts:105-115](https://github.com/A3Boy/dsh-web-tools/blob/cfa00a70b600da212915ac3a82e970e9b93ac9c2/src/host/providers/parallel.ts#L105-L115)

查询长度限制。

<details>
<summary>查看原文（11行）</summary>

```text
/** Clamp the requested result count into Parallel's accepted range (1..20). */
export function clampParallelCount(maxResults: number | undefined): number {
  return Math.min(Math.max(maxResults ?? 5, 1), PARALLEL_MAX_RESULTS);
}

/**
 * Normalize one raw query into a Parallel search_queries entry: whitespace
 * collapsed, trimmed, and capped at 200 characters (the per-query API limit).
 */
export function normalizeParallelQuery(query: string): string {
  return query.replace(/\s+/g, " ").trim().slice(0, PARALLEL_QUERY_MAX_CHARS);
```

</details>

**依据 2 · 源码核查**：[src/host/index.ts:329-337](https://github.com/A3Boy/dsh-web-tools/blob/cfa00a70b600da212915ac3a82e970e9b93ac9c2/src/host/index.ts#L329-L337)

宿主搜索返回字段及固定截断标记。

```text
      return {
        sources: outcome.items.map((item) => ({
          url: item.url,
          title: item.title,
          snippet: item.snippet,
          publishedAt: item.publishedAt,
        })),
        truncated: false,
      };
```

**依据 3 · 作者声明**：[README.md:118-125](https://github.com/A3Boy/dsh-web-tools/blob/cfa00a70b600da212915ac3a82e970e9b93ac9c2/README.md#L118-L125)

评论上限、无OCR和降级边界。

```text
Each detail fetch includes at most 30 comments or replies, with up to 800 characters per entry. Additional pages or nested replies are explicitly marked as truncated to keep model context bounded.

> **Capability Boundary**: For Xiaohongshu notes where the primary content resides in images, the fetcher returns the title, text description, engagement metrics, image count, and loaded comments; it does not perform optical character recognition (OCR) on image text or automatically paginate through all comments.

Agents use `小红书:` or `X:` as a platform-routing prefix. The prefix selects the platform and is removed before the native search runs; for example, `小红书: DeepSeek Harness` enters only `DeepSeek Harness` into Xiaohongshu's search box.

* **General-Web Fallback**: Uses configured general search or fetch providers when a platform source is disabled, temporarily unavailable, or reports a retryable failure. Non-retryable sign-in, access-control, search-restriction, and invalid-detail errors are returned directly so indexed content is not presented as native platform results, details, or comments.
* **Automated Session Verification**: Cookies are only the first gate. Xiaohongshu requires both `a1` and `web_session`, then performs a stabilized live `/explore` check in the interactive browser. A visible login wall invalidates the old session and restores the sign-in action; a wall appearing only after search submission is reported directly as `search-restricted` rather than being hidden behind indexed web results.
```

**依据 4 · 源码核查**：[src/host/search-hints.ts:105-154](https://github.com/A3Boy/dsh-web-tools/blob/cfa00a70b600da212915ac3a82e970e9b93ac9c2/src/host/search-hints.ts#L105-L154)

主题/新鲜度依赖启发式词表。

<details>
<summary>查看原文（50行）</summary>

```text
// Code topic indicators (keywords or patterns)
const CODE_INDICATORS = [
  /\b(github|gitlab|npm|pnpm|cargo|pip|pypi|nuget|crates\.io|stackoverflow|golang|typescript|python|rust|c\+\+|javascript|react|vue|svelte|docker|k8s|kubernetes|linux|bash|powershell|sql|postgres|redis|git|api|sdk|graphql|rest|grpc|webhook|bug|error|issue|pr|pull request|stacktrace|exception|panic|segfault|syntax|compiler|traceback)\b/i,
  /(?:代码|函数|接口|报错|崩溃|源码|组件|配置|版本号|仓库|提交|异常|编译)/,
];

// News topic indicators
const NEWS_INDICATORS = [
  /\b(news|breaking|announced|announcement|press release|headline|journal|report|coverage)\b/i,
  /(?:新闻|快讯|发布会|报道|最新消息|突发|动态|头条)/,
];

// Finance topic indicators
const FINANCE_INDICATORS = [
  /\b(stock|shares|nasdaq|nyse|sec|10-k|10-q|earnings|revenue|market cap|valuation|ipo|crypto|bitcoin|ethereum|dividend|fiscal|quarterly|ebitda)\b/i,
  /(?:财报|股价|营收|市值|估值|财季|分红|股票|证券|上市|收益率|净利润)/,
];

// Research topic indicators
const RESEARCH_INDICATORS = [
  /\b(arxiv|paper|research|benchmark|ablation|evaluation|dataset|methodology|conference|neurips|icml|iclr|cvpr|acl|ieee|springer|nature|science)\b/i,
  /(?:论文|学术|评测|基准|消融实验|数据集|学术会议|研报|文献)/,
];

// Freshness indicators
const DAY_INDICATORS = [
  /\b(today|past 24 hours|last 24 hours|24h|today's)\b/i,
  /(?:今天|今日|过去24小时|24小时内|当天)/,
];
const WEEK_INDICATORS = [
  /\b(this week|past week|last 7 days|7d|recent week)\b/i,
  /(?:本周|这一周|过去7天|近7天|最近一周)/,
];
const MONTH_INDICATORS = [
  /\b(this month|past month|last 30 days|latest|recently|recent|newest|current)\b/i,
  /(?:本月|过去30天|近1个月|最近|最新|近期|近来)/,
];
const YEAR_INDICATORS = [
  /\b(this year|past year|last 12 months|annual)\b/i,
  /(?:今年|本年度|近1年|过去一年)/,
];

// Explicit date range in query (e.g. 2026-08-01..2026-08-20 or after:2026-01-01)
const AFTER_DATE_RE = /\bafter:(\d{4}-\d{2}-\d{2})\b/i;
const BEFORE_DATE_RE = /\bbefore:(\d{4}-\d{2}-\d{2})\b/i;

// Official source preference indicators
const OFFICIAL_PREFERENCE_INDICATORS = [
  /\b(official|primary doc|primary documentation|official docs?|official website|canonical source)\b/i,
  /(?:官方文档|官网|官方|权威来源|正规文档|官方指南)/,
```

</details>

#### 缺口

- 跨供应商约束保真率、图片内容遗漏和检索质量未知
  **影响**：阻碍把统一接口当完整证据采集器
  **进一步探讨**：建立长查询、否定条件、图片笔记及分页评论样例，逐项核对原内容和返回边界

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 用户要承担哪些外部服务、账号与重试成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

普通网页路径依赖已配置的供应商账户/密钥或自建SearXNG，部分抓取可走本地通用解析；平台路径则依赖本地Chrome/Edge、独立配置目录及人工登录，登录和访问限制不会被自动消除。多密钥仅用于合法轮换/分摊，失败转移可能增加请求数和付费调用，不能由“无额外LLM”推断总成本低。需要统计全部失败/超时/备用请求、模型上下文和人工全文复核。首次设置密钥、地址与平台账号后还需持续维护登录状态和API变化；恢复应看具体错误和实际来源，不对不可重试访问错误盲补位。本轮未访问真实账户或服务，价格、额度和当前可用性没有核实。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:103-125](https://github.com/A3Boy/dsh-web-tools/blob/cfa00a70b600da212915ac3a82e970e9b93ac9c2/README.md#L103-L125)

浏览器登录与平台能力边界。

<details>
<summary>查看原文（23行）</summary>

```text
## Social Platform Sources

Unlike general search engines, the plugin connects directly to native social platform sessions:

* **Native Isolated Browser Architecture**:
  * Directly controls local Edge / Chrome instances using dedicated profiles over CDP.
  * **0 browser extensions and 0 Playwright / Chromium bundles**. Cookies remain managed by the dedicated browser profile and are not written to plugin configuration, logs, or relays; the browser still sends them to the platform during normal authenticated requests.

* **Xiaohongshu**:
  * **Note Detail & Comment Fetch (`web_fetch`)**: Uses the dedicated browser profile to extract structured `__INITIAL_STATE__` data with DOM fallback while preserving signed `xsec_token` URLs. When the page loads comment data, top-level comments and returned nested replies are extracted individually.
  * **Native Search Discovery (`web_search`)**: Uses the signed-in browser and the real search controls on `/explore`, entering only the cleaned topic query rather than platform names or `site:` operators. It distinguishes login walls, security verification, and a genuinely signed-out session. Operators can temporarily disable this path with `XHS_NATIVE_SEARCH=0` while diagnosing browser issues.

* **Twitter / X**:
  * **Native Search, Tweet Detail & Replies**: Captures the X web client's GraphQL data streams (SearchTimeline / TweetDetail) over CDP, parses the target tweet and its reply tree structurally, and uses DOM extraction as a supplement and fallback. Supports `from:`, `since:`, and `until:` operators.

Each detail fetch includes at most 30 comments or replies, with up to 800 characters per entry. Additional pages or nested replies are explicitly marked as truncated to keep model context bounded.

> **Capability Boundary**: For Xiaohongshu notes where the primary content resides in images, the fetcher returns the title, text description, engagement metrics, image count, and loaded comments; it does not perform optical character recognition (OCR) on image text or automatically paginate through all comments.

Agents use `小红书:` or `X:` as a platform-routing prefix. The prefix selects the platform and is removed before the native search runs; for example, `小红书: DeepSeek Harness` enters only `DeepSeek Harness` into Xiaohongshu's search box.

* **General-Web Fallback**: Uses configured general search or fetch providers when a platform source is disabled, temporarily unavailable, or reports a retryable failure. Non-retryable sign-in, access-control, search-restriction, and invalid-detail errors are returned directly so indexed content is not presented as native platform results, details, or comments.
* **Automated Session Verification**: Cookies are only the first gate. Xiaohongshu requires both `a1` and `web_session`, then performs a stabilized live `/explore` check in the interactive browser. A visible login wall invalidates the old session and restores the sign-in action; a wall appearing only after search submission is reported directly as `search-restricted` rather than being hidden behind indexed web results.
```

</details>

**依据 2 · 源码核查**：[src/host/pool.ts:1-10](https://github.com/A3Boy/dsh-web-tools/blob/cfa00a70b600da212915ac3a82e970e9b93ac9c2/src/host/pool.ts#L1-L10)

密钥池用途限定。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * dsh-web-tools — per-provider account pool (pure logic, no I/O).
 *
 * Each provider can hold a pool of API keys (e.g. several Tavily accounts).
 * Selection policy: least-used-first with a fixed tie-break order (the key
 * list order). A key that fails a call is marked unhealthy and skipped until
 * the whole pool is exhausted, at which point health resets so a recovered
 * account can be used again.
 *
 * This serves legitimate multi-key / rollover / load-spreading scenarios only.
```

</details>

**依据 3 · 源码核查**：[src/host/registry.ts:263-344](https://github.com/A3Boy/dsh-web-tools/blob/cfa00a70b600da212915ac3a82e970e9b93ac9c2/src/host/registry.ts#L263-L344)

失败分类决定潜在追加调用。

<details>
<summary>查看原文（82行）</summary>

```text
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
        let providerLevelDecision: "next-provider" | "break" | "terminal" | null = null;
        // Base URL from the request snapshot, so an override edit mid-request
        // cannot make one attempt dial a different host than another.
        const searchBaseUrl = entryInfo?.builtIn
          ? entryInfo.endpoint?.effectiveBaseUrl
          : cfg.providerBaseUrls[providerName];
        while (usable.length > 0) {
          const index = selectIndex(entries);
          const entry = entries[index];
          if (entry) reserveKey(entries, index);
          const started = Date.now();
          const providerOptions = cfg.providerOptions?.[providerName as keyof StoredProviderOptions];
          try {
            const outcome = await runWithTimeout(
              (s) =>
                adapter.search(request.query, maxResults, entry?.key ?? "", searchBaseUrl, {
                  signal: s,
                  options: providerOptions,
                  hints: searchHints,
                }),
              cfg.providerAttemptTimeoutMs,
              signal,
            );
            if (entry) markUsed(entries, index);
            const latencyMs = Date.now() - started;
            attempts.push({ provider: providerName, outcome: "success", latencyMs });
            stats.record({ provider: providerName, outcome: "success", latencyMs });
            return {
              ...outcome,
              truncated: false,
              attempts,
              backend: providerName,
            };
          } catch (error) {
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
```

</details>

**依据 4 · 源码核查**：[package.json:49-72](https://github.com/A3Boy/dsh-web-tools/blob/cfa00a70b600da212915ac3a82e970e9b93ac9c2/package.json#L49-L72)

解析、网络与宿主依赖声明。

<details>
<summary>查看原文（24行）</summary>

```text
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

#### 缺口

- 供应商价格/实际请求量与平台登录维护时间未知
  **影响**：无法报告单位合格检索成本
  **进一步探讨**：以授权配置的小样本查询记录所有后端尝试、最终合格资料数和人工复核分钟数

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些设计值得借鉴，怎样控制试用？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

把查询意图、供应商编译、错误分类、健康状态和平台来源分层，便于在保持宿主接口的同时适配不同后端；请求快照避免配置中途编辑改变尝试目的地，是可复用的边界设计。未验证假设是给统一返回增加约束执行说明、内容覆盖与降级来源证明，可能减少研究者把可用性当完整性的误判。最小验证固定含硬域名、长查询、分页和登录限制的样例，比较现有返回与带证明返回的盲审错误率和复核时间；若只是增加上下文而未减少误判则否定。当前建议trial，限定可信本机公开材料、小预算和人工回原文；平台源需显式登录并核对原生/索引来源，关键内容缺失时停止将其用于完整性结论。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/registry.ts:272-291](https://github.com/A3Boy/dsh-web-tools/blob/cfa00a70b600da212915ac3a82e970e9b93ac9c2/src/host/registry.ts#L272-L291)

配置快照与供应商请求边界。

<details>
<summary>查看原文（20行）</summary>

```text
        // provider. Non-auth failures (429/5xx/network/timeout) do not rotate
        // keys — they fall through to the next provider directly.
        let providerLevelDecision: "next-provider" | "break" | "terminal" | null = null;
        // Base URL from the request snapshot, so an override edit mid-request
        // cannot make one attempt dial a different host than another.
        const searchBaseUrl = entryInfo?.builtIn
          ? entryInfo.endpoint?.effectiveBaseUrl
          : cfg.providerBaseUrls[providerName];
        while (usable.length > 0) {
          const index = selectIndex(entries);
          const entry = entries[index];
          if (entry) reserveKey(entries, index);
          const started = Date.now();
          const providerOptions = cfg.providerOptions?.[providerName as keyof StoredProviderOptions];
          try {
            const outcome = await runWithTimeout(
              (s) =>
                adapter.search(request.query, maxResults, entry?.key ?? "", searchBaseUrl, {
                  signal: s,
                  options: providerOptions,
```

</details>

**依据 2 · 源码核查**：[src/host/sources/registry.ts:135-159](https://github.com/A3Boy/dsh-web-tools/blob/cfa00a70b600da212915ac3a82e970e9b93ac9c2/src/host/sources/registry.ts#L135-L159)

来源与失败边界的分层。

<details>
<summary>查看原文（25行）</summary>

```text
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
    return fallbackSearchToGeneralWeb(
      query,
      platform,
      this.fallbackSearchProvider,
      req?.maxResults,
      signal,
    );
```

</details>

**依据 3 · 源码核查**：[src/host/index.ts:329-337](https://github.com/A3Boy/dsh-web-tools/blob/cfa00a70b600da212915ac3a82e970e9b93ac9c2/src/host/index.ts#L329-L337)

证明/覆盖信息假设的具体缺口。

```text
      return {
        sources: outcome.items.map((item) => ({
          url: item.url,
          title: item.title,
          snippet: item.snippet,
          publishedAt: item.publishedAt,
        })),
        truncated: false,
      };
```

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
