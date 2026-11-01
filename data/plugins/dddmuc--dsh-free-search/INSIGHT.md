# Free Search

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[7c30dd0](https://github.com/DDDMUC/dsh-free-search/tree/7c30dd059e1d9de4ffc8b779978b2152af84b0ec)

<!-- BEGIN META -->
[![GitHub ★ 770](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=770&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/DDDMUC/dsh-free-search) [![npm 30d 68,731](https://img.shields.io/static/v1?label=npm+30d&message=68%2C731&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-free-search) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-free-search)
<!-- END META -->

> **功能**：为 DSH 提供多来源网页搜索、回退和研究证据整理工具。

> **亮点**：将多源路由、失败分类、缓存和证据整理接到 DSH，而非创造各上游搜索索引。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：额外来源、回退和正文整理能否在可接受的外发数据、费用与维护成本下提高可核验结果？[Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 谁使用它，相对宿主默认搜索增加什么？](#detail-section-11)
  - [Q02 · 查询如何路由和回退，是否总能成功？](#detail-section-12)
  - [Q03 · research 如何表达正文缺失和预算限制？](#detail-section-13)
  - [Q04 · 接管、卸载与外部成本应如何管理？](#detail-section-14)
  - [Q05 · 哪些增量可归因，下一步怎样检验？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在 DSH Agent 会话中检索并核对网页出处的用户，按配置使用多个搜索来源与正文研究工具。[Q01](#research-q01)

与宿主默认单一搜索相比，它组合外部来源及回退；搜索索引和网页内容仍由上游提供。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 搜索 provider | 多引擎查询与回退 | 全失败或禁用回退仍会报错 |
| research | 汇总来源及正文窗口 | 抓取失败时只能提供摘要并标注 |
| 持久缓存 | 复用抓取正文 | SQLite 不可用时无操作 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH、Node 与 web 服务 | 必需 | 加载 provider 与工具 | 无法假定可用 |
| 外部引擎网络与凭据 | 对应引擎需要 | 查询与正文获取 | 限流、付费或失败 |
| node:sqlite | 持久缓存需要 | 保存正文与检索 | 不可用则缓存 no-op |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 备份隔离 profile 并检查引擎和外发策略 | 配置或费用不明则停止 |
| 试搜 | 使用非敏感公开查询 | 核对实际引擎和来源 |
| 研究 | 审阅正文、摘要和 notEvaluated 注记 | 不足时查原文或换来源 |
| 恢复 | 停用前恢复原 provider 并保留其他配置 | 重启后验证搜索 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 账号与外部额度未知 | 备份、核实引擎与凭据 | 版本兼容未实测 |
| 持续 | 多源并发和付费调用可能计费 | 审核来源及维护配置 | 真实价格与时延未知 |
| 恢复 | 未测 | 检查并恢复 provider | 应保留其他 web 配置 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 搜索 | 多引擎和失败分支 | 实际可用性与准确率 |
| 证据整理 | 区分正文及摘要，标注部分失败 | 内容真实性与来源独立性 |

> **思考**：额外来源、回退和正文整理能否在可接受的外发数据、费用与维护成本下提高可核验结果？[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将多源路由、失败分类、缓存和证据整理接到 DSH，而非创造各上游搜索索引。[Q01](#research-q01) [Q02](#research-q02)

搜索短期缓存、分类回退和 research 的部分结果注记提供可检验接缝；外部来源及跨配置恢复仍需实测。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

额外来源、回退和正文整理能否在可接受的外发数据、费用与维护成本下提高可核验结果？[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

先备份并隔离 profile，用非敏感查询测试允许的来源；核对 provider、实际费用和出处，停用前恢复原配置。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持代表接入和失败路径；没有执行插件、外部搜索或评测结果质量。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、lib/index.js、lib/research.js、lib/cache.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本静态检查主 provider、回退出口、research、缓存及接管代表路径；未全面审计 27 种引擎、所有抓取路由及安全，也未执行目标。
- 下一步：隔离 profile 验证接管、失败类别和卸载恢复；使用固定问题集核验外部来源及预算。

**分析版本**

- **仓库**：[DDDMUC/dsh-free-search](https://github.com/DDDMUC/dsh-free-search)
- **版本号**：0.9.26（[固定提交 7c30dd0](https://github.com/DDDMUC/dsh-free-search/tree/7c30dd059e1d9de4ffc8b779978b2152af84b0ec)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

假设按已验证来源质量与额度调整并发可提升固定预算下的有效来源覆盖；用相同查询集比较现有策略，若覆盖不改善或成本与错误增加则否定。[Q05](#research-q05)

隔离 profile 验证接管、失败类别和卸载恢复；使用固定问题集核验外部来源及预算。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 1337 | — | — | 22171 |
| .js | source | 14 | 12263 | 10497 | 1474 | — |
| .mjs | source | 39 | 4051 | 3322 | 495 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/DDDMUC/dsh-free-search/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 32](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=32&color=737b86&logo=github)](https://github.com/DDDMUC/dsh-free-search/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 29](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=29&color=737b86&logo=github)](https://github.com/DDDMUC/dsh-free-search/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查搜索接管、回退、研究输出与采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用它，相对宿主默认搜索增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要让 DSH Agent 检索网页并核对出处的用户，可以通过插件配置多个搜索来源，并调用多源搜索、垂直搜索或研究工具。插件在宿主注册搜索与抓取 provider，也注册自身工具；实际索引和网页内容来自各上游，插件贡献是接线、路由、清洗和组合而非自建索引。相比默认单一搜索，选择与回退路径更多，但并不证明结果更准、更便宜或始终可用。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-8](https://github.com/DDDMUC/dsh-free-search/blob/7c30dd059e1d9de4ffc8b779978b2152af84b0ec/package.json#L1-L8)

包名称、版本和入口。

```text
{
  "name": "dsh-free-search",
  "version": "0.9.26",
  "description": "Free web search for DeepSeek Harness: 27 engines (Bing/DuckDuckGo/AnySearch/SearXNG/Exa/Tavily/Keenable/Firecrawl/Parallel/You.com keyless; Zhihu global/site via MCP and Perplexity/SerpBase/DeepSeek (official + native tools/search)/Baidu/Kimi/Aliyun/Doubao with key; OpenAI/Gemini/Claude model built-in search, explicit-only) + auto smart routing + global engine enable/disable & fallback priority + editable zh/en language pools + multi mode (parallel full language-pool merge) + multi_search cross-source tool + failure-aware fallback (quota/auth cooldown, transient retry, fallbackOn) + time filtering + platform search + domain blocklist (blockedDomains) + web_fetch, with web settings UI.",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
```

**依据 2 · 作者声明**：[README.md:52-69](https://github.com/DDDMUC/dsh-free-search/blob/7c30dd059e1d9de4ffc8b779978b2152af84b0ec/README.md#L52-L69)

作者介绍多引擎、正文及研究能力。

<details>
<summary>查看原文（18行）</summary>

```text
- **多 key 轮换** —— 任何 key 字段（或对应环境变量）都可以用逗号 / 分号 / 换行分隔多把 key；平时按请求轮流使用（round-robin，避免单 key 撞 QPS/RPM 风控），遇到 401/402/429（鉴权失败、额度耗尽、限流）先轮换同一引擎的下一把，再走引擎回退；`multi` 模式同样生效（#96）
- **弹出式切换命令** —— 聊天框输入 `/free-search-engine`，弹出引擎选择窗口，点选即切换（等效设置页 + 保存）
- **引擎测试** —— `free_search_test` 工具让 agent 一键测试所有引擎；设置页也有"测试引擎"按钮（直测当前引擎，不走回退链，付费引擎无 key 会明确报错）
- **全局引擎开关与回退优先级** —— 设置页可勾选/取消引擎（取消后全局生效：普通搜索 / Auto / `advanced_search` / `multi_search` / 引擎测试都不再用它），并可用 ↑↓ 调整全局回退顺序（一键恢复默认）
- **Multi 模式** —— 可把搜索引擎设为 `Multi Search`：`web_search` 按查询语言并发**对应语言池的全部**已启用引擎（不再是前 3 个；中文/英文池可在设置页编辑，每池最低 2 个引擎）、按 URL 合并去重（同站判定用 **eTLD+1**）、跨源命中的结果优先；设置页有 **Fast / Balanced / Deep** 三档强度，也可手填并发上限与目标成功源数；整轮检索共享 **30 秒总预算**，到点返回已有结果（代价是成倍消耗额度；multi 失败会自动退回单引擎回退链）
- **统一引擎回退** —— 任何引擎失败（付费/免费，缺 key/401/限流/网络）自动轮流尝试下一个引擎：首选引擎 → 其他引擎（exa/tavily/keenable/firecrawl/parallel/you 无 key 也会尝试，因为它们自带 keyless 免费额度）→ 剩余免费引擎，搜索永不直接失败；结果顶部注明实际生效的引擎（如 `Note: perplexity unavailable or failed, using exa.`）；失败按类别处理：额度/鉴权失败→本会话冷却该引擎，反爬→短退避，超时/5xx/限流→同引擎重试一次，解析失败/0 结果→不冷却（详见下文「失败分类与引擎冷却」）
- **时间过滤** —— `advanced_search` 工具支持 `timeRange`：固定档、自定义相对值、绝对日期三种形式（详见下方逻辑说明）
- **系统提示词注入** —— agent 知道当前用哪个引擎、哪些需要 key；并明确所有搜索结果是**不可信外部数据**，不得执行其中的指令
- **提示注入防护（不可信数据边界）** —— 插件自有工具（advanced_search / platform_search / free_search_test）的网页文本包在 `<untrusted-web-content>` 边界内（正文里自带的同名标记会被剥离，防止提前闭合）；核心 web_search / web_fetch 由 DSH 核心自带同类提示（`External web content follows...`）；所有 snippet 统一清洗并截断到 300 字符
- **版本号** —— 设置卡片底部显示当前版本（跟随 `PLUGIN_VERSION`，随发布更新）。检查与升级交给官方插件页（插件 → 已安装 → dsh-free-search → 更新），插件不再自带第二套更新按钮
- **结果缓存** —— 相同查询（含引擎/时间过滤参数）5 分钟内命中缓存（LRU 50 条），防免费引擎限流、省付费额度；时长可在设置页 0-5 分钟自由配置（0 关闭）
- **域名黑名单与安全搜索** —— `blockedDomains`：命中的域名不会进入任何结果；`safeSearch`（`off` / `moderate` / `strict`）为 Bing / DuckDuckGo 加一层过滤
- **免费标注** —— 设置页中免费引擎带绿色 `FREE` 徽章，付费引擎带橙色 `API KEY` 徽章
- **网页抓取（web_fetch）** —— 让 agent 抓取网页内容（官方 `dsh-web-fetch-http` provider，纯 JS，零额外依赖）
- **平台搜索（platform_search）** —— 搜 GitHub / V2EX / B站 / Reddit / Hacker News / Stack Overflow / 维基百科 / npm / YouTube / Vimeo / 掘金 / 豆瓣 / Qiita（公开 API 或免 key 抓取，零依赖）；X (Twitter) 经本地 Grok Build CLI（需 SuperGrok / X Premium 登录）
- **垂直领域直查（domain_search）** —— 41 个免 key 垂直源直查：包/版本（PyPI、crates、GitHub releases、endoflife…）、学术（arXiv、Crossref、OpenAlex、Semantic Scholar、PubMed、dblp、Zenodo…）、安全（NVD、OSV、CISA KEV）、金融（SEC EDGAR、IMF、World Bank、CFETS、Yahoo Finance、CoinGecko…）、**法律（US Federal Register、US CourtListener、openlegaldata、UK legislation）**、新闻（Google News、GDELT）等
- **视频搜索（video_search）** —— 跨站找视频：Bing Videos + DuckDuckGo Videos（免 key，失败互相回退），返回视频链接、标题与来源/时长等元信息
- **一次调用完成研究（research）** —— 多引擎并发搜索 → 候选重排 → 分层抓取正文 → 段落选窗 → 带出处的 Markdown 证据包；模型组件（重排/嵌入/决策模型）全部可选，缺失或失败时静默回退规则路径
```

</details>

**依据 3 · 源码核查**：[lib/index.js:4642-4653](https://github.com/DDDMUC/dsh-free-search/blob/7c30dd059e1d9de4ffc8b779978b2152af84b0ec/lib/index.js#L4642-L4653)

注册搜索和抓取 provider。

<details>
<summary>查看原文（12行）</summary>

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
  });
  registerOnce(() => ctx.web.registerFetchProvider(fetchProvider), fetchProvider, "fetch provider");
```

</details>

**依据 4 · 源码核查**：[lib/research.js:815-825](https://github.com/DDDMUC/dsh-free-search/blob/7c30dd059e1d9de4ffc8b779978b2152af84b0ec/lib/research.js#L815-L825)

在 tools 服务注册 research。

<details>
<summary>查看原文（11行）</summary>

```text
export function registerResearchTool(ctx, { provider, resolveApiKey, wrapUntrustedBlock, escalationEngines, getConfig = () => ({}), ns, isToolDisabled = () => false } = {}) {  ctx.inject(["tools"], (sctx) => {
    localizedEffect(sctx, {
      label: "free-search: research tool",
      ns,
      getLang: () => promptLanguageOf(getConfig()),
      getEnabled: () => !(isToolDisabled("research") && isToolDisabled("cache_search")),
      register: (lang) => {
      const dispose = isToolDisabled("research") ? undefined : sctx.tools.register(
        defineTool({
          name: "research",
          description: toolDescription(lang, "research"),
```

</details>

#### 缺口

- 没有同一问题集与宿主官方搜索的质量、时延及成本对照。
  **影响**：结论限于固定源码与作者声明，不证明外部服务效果。
  **进一步探讨**：用相同公开查询评测可核验来源、错漏率、耗时及费用。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 查询如何路由和回退，是否总能成功？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

provider.search 校验查询、读取配置、先检查短期缓存；multi 模式调用多源搜索，失败后尝试单引擎链。普通链遇到部分瞬时错误会重试一次，是否进入下一引擎受 fallbackOn 控制；若错误类别不允许则立即报错，全部候选失败也抛出最后错误。README 的“搜索永不直接失败”被这些代码分支限制。缓存命中再过域名过滤，但结果过滤或重试不能证明来源真实、独立或没有遗漏。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:4066-4100](https://github.com/DDDMUC/dsh-free-search/blob/7c30dd059e1d9de4ffc8b779978b2152af84b0ec/lib/index.js#L4066-L4100)

入口、key 轮换、参数与回退配置。

<details>
<summary>查看原文（35行）</summary>

```text
  // 总控 provider：按 settings 的 provider 字段路由到任意引擎。
  // 任何引擎失败（缺 key / 401 / 限流 / 网络）都会自动轮流尝试下一个引擎，
  // 直到成功或全部失败。并在结果里附带回退提示，避免 agent 搜索直接失败。
  const provider = {
    id: "ddg",
    available() {
      return true;
    },
    // 单 query 结果缓存：key=query+maxResults+timeRangeLabel+preferred，Map 天然 LRU
    async search(request, signal) {
      // 轮换时机：首次失败后 keyRings 已经填充，此时再判断有几把 key。
      for (let attempt = 0; attempt < 10; attempt++) {
        try {
          return await provider.searchOnce(request, signal);
        } catch (error) {
          const keys = maxKeyRingLength();
          if (keys <= 1 || attempt >= keys - 1 || !isKeyRotationCandidate(error)) throw error;
          logger.warn(`free-search: retrying with the next API key (${error?.message ?? error})`);
        }
      }
      throw new Error("all search engines failed");
    },
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
      const disabledEngines = normalizeDisabledEngines(cfg.disabledEngines);
      const fallbackOnSet = new Set(normalizeFallbackOn(cfg.fallbackOn));
```

</details>

**依据 2 · 源码核查**：[lib/index.js:4115-4152](https://github.com/DDDMUC/dsh-free-search/blob/7c30dd059e1d9de4ffc8b779978b2152af84b0ec/lib/index.js#L4115-L4152)

缓存命中与 multi 失败后退单引擎。

<details>
<summary>查看原文（38行）</summary>

```text
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
          return { ...applyBlockedFilterToResult({ ...hit.value, sources: hit.value.sources?.slice() }), _cache: "hit" };
        }
        if (hit) searchCache.delete(cacheKey);
      }

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
```

</details>

**依据 3 · 源码核查**：[lib/index.js:4464-4502](https://github.com/DDDMUC/dsh-free-search/blob/7c30dd059e1d9de4ffc8b779978b2152af84b0ec/lib/index.js#L4464-L4502)

空结果与异常按 fallbackOn 停止或继续；全部失败抛错。

<details>
<summary>查看原文（39行）</summary>

```text
            return { ...cached, _cache: "miss" };
          }
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
          const message = failure.message;
          if (engine === preferred) { preferredFailure = message; preferredFailureClass = failure.class; }
          applyFailureCooldown(engine, failure.class, failure.rateLimited);
          // transient（超时/5xx/网络）：同引擎重试一次再回退，避免一次抖动丢掉好引擎；
          // 限流（rateLimited）不重试——短窗内再发必再撞，已设 60s 冷却
          if (failure.class === "transient" && !failure.rateLimited && !retriedEngines.has(engine)) {
            retriedEngines.add(engine);
            logger.warn(`free-search: engine "${engine}" failed [transient] (${message}), retrying once`);
            chain.splice(qi + 1, 0, engine);
            continue;
          }
          if (!fallbackOnSet.has(failure.class)) {
            blockedFailure = { engine, failure };
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

**依据 4 · 作者声明**：[README.md:56-57](https://github.com/DDDMUC/dsh-free-search/blob/7c30dd059e1d9de4ffc8b779978b2152af84b0ec/README.md#L56-L57)

作者声称 multi 和引擎回退，包含永不直接失败表述。

```text
- **Multi 模式** —— 可把搜索引擎设为 `Multi Search`：`web_search` 按查询语言并发**对应语言池的全部**已启用引擎（不再是前 3 个；中文/英文池可在设置页编辑，每池最低 2 个引擎）、按 URL 合并去重（同站判定用 **eTLD+1**）、跨源命中的结果优先；设置页有 **Fast / Balanced / Deep** 三档强度，也可手填并发上限与目标成功源数；整轮检索共享 **30 秒总预算**，到点返回已有结果（代价是成倍消耗额度；multi 失败会自动退回单引擎回退链）
- **统一引擎回退** —— 任何引擎失败（付费/免费，缺 key/401/限流/网络）自动轮流尝试下一个引擎：首选引擎 → 其他引擎（exa/tavily/keenable/firecrawl/parallel/you 无 key 也会尝试，因为它们自带 keyless 免费额度）→ 剩余免费引擎，搜索永不直接失败；结果顶部注明实际生效的引擎（如 `Note: perplexity unavailable or failed, using exa.`）；失败按类别处理：额度/鉴权失败→本会话冷却该引擎，反爬→短退避，超时/5xx/限流→同引擎重试一次，解析失败/0 结果→不冷却（详见下文「失败分类与引擎冷却」）
```

#### 缺口

- 未对外部引擎进行在线调用，不能证明实际可用性、限流或排序质量。
  **影响**：结论限于固定源码与作者声明，不证明外部服务效果。
  **进一步探讨**：在隔离环境模拟 401、429、空结果、禁用类别和所有引擎失败。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · research 如何表达正文缺失和预算限制？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

research 工具经过搜索、候选处理和抓取形成来源及文档，文档 schema 区分正文与仅摘要并记录获取时间和截断标记；所有正文抓取失败时会加入 notEvaluated 注记，预算或截止时间耗尽也标注部分结果。持久缓存使用 node:sqlite，初始化失败时整个缓存降为 no-op，因此声明支持 Node 20 不等于该环境可用持久缓存。代码标记仍需消费者阅读，结果不是独立事实核验。

#### 证据与依据

**依据 1 · 源码核查**：[lib/research.js:791-806](https://github.com/DDDMUC/dsh-free-search/blob/7c30dd059e1d9de4ffc8b779978b2152af84b0ec/lib/research.js#L791-L806)

文档区分 body、snippet-only、时间和截断。

<details>
<summary>查看原文（16行）</summary>

```text
const DOC_FIELDS = {
  url: { type: "string" },
  title: { type: "string" },
  kind: { type: "string", description: "body | snippet-only" }, // 摘要永远不可标 body（契约 2.6）
  text_origin: { type: "string", description: "original | provider-summary" },
  engine_hits: { type: "array", items: { type: "string" } },
  published: { type: "string", description: "带来源标注；缺失 = unknown" },
  updated_at: { type: "string", description: "页面级更新时间，可取得时" },
  fetched_at: { type: "string", description: "ISO；缓存命中保留真实抓取时间" },
  round: { type: "number" },
  cluster: { type: "string", description: "同标题簇 id；空串 = 无簇（schema 不收 null）" },
  independence: { type: "string", description: "unknown（阶段一）" },
  tier: { type: "string" },
  cache: { type: "boolean", description: "true = 命中本地缓存" },
  truncated: { type: "boolean" },
  content: { type: "string" },
```

</details>

**依据 2 · 源码核查**：[lib/research.js:815-825](https://github.com/DDDMUC/dsh-free-search/blob/7c30dd059e1d9de4ffc8b779978b2152af84b0ec/lib/research.js#L815-L825)

research 的宿主工具注册。

<details>
<summary>查看原文（11行）</summary>

```text
export function registerResearchTool(ctx, { provider, resolveApiKey, wrapUntrustedBlock, escalationEngines, getConfig = () => ({}), ns, isToolDisabled = () => false } = {}) {  ctx.inject(["tools"], (sctx) => {
    localizedEffect(sctx, {
      label: "free-search: research tool",
      ns,
      getLang: () => promptLanguageOf(getConfig()),
      getEnabled: () => !(isToolDisabled("research") && isToolDisabled("cache_search")),
      register: (lang) => {
      const dispose = isToolDisabled("research") ? undefined : sctx.tools.register(
        defineTool({
          name: "research",
          description: toolDescription(lang, "research"),
```

</details>

**依据 3 · 源码核查**：[lib/research.js:888-901](https://github.com/DDDMUC/dsh-free-search/blob/7c30dd059e1d9de4ffc8b779978b2152af84b0ec/lib/research.js#L888-L901)

截止定时器中止在途工作。

<details>
<summary>查看原文（14行）</summary>

```text
            // deadline（契约 2.5）：到点 abort 在途请求、置位后排队与回退任务不再启动
            const deadlineTimer = setTimeout(() => {
              budget.deadlineHit = true;
              budget.controller.abort();
            }, Math.max(0, budget.deadlineAt - Date.now()));

            try {
              [state.exaKey, state.firecrawlKey, state.crawl4aiKey, state.rerankKey, state.decisionKey] = await Promise.all([
                resolveApiKey("EXA_API_KEY", "exaApiKey").catch(() => undefined),
                resolveApiKey("FIRECRAWL_API_KEY", "firecrawlApiKey").catch(() => undefined),
                resolveApiKey("CRAWL4AI_API_KEY", undefined).catch(() => undefined),
                resolveApiKey("SILICONFLOW_RERANK_API_KEY", undefined).catch(() => undefined),
                resolveApiKey("DECISION_MODEL_API_KEY", undefined).catch(() => undefined),
              ]);
```

</details>

**依据 4 · 源码核查**：[lib/research.js:1314-1343](https://github.com/DDDMUC/dsh-free-search/blob/7c30dd059e1d9de4ffc8b779978b2152af84b0ec/lib/research.js#L1314-L1343)

抓取失败及预算注记和返回来源。

<details>
<summary>查看原文（30行）</summary>

```text
                }
              }
              if (bodyDocs.length === 0) {
                const noFetchKeys = !state.exaKey && !state.firecrawlKey && !state.crawl4aiKey;
                state.notes.push(
                  "notEvaluated: all fetches failed — snippets only, question not fully evaluated" +
                    (noFetchKeys
                      ? " (no Exa/Firecrawl/Crawl4AI key configured: direct fetch was the only tier available, and it failed for the URLs above — configuring a key greatly improves fetching)"
                      : "")
                );
              } else if (!bodyDocs.some((b) => b.rerankOkB)) {
                state.notes.push("stage-B rerank unavailable — light-filter fallback used");
              } else {
                // 契约 2.2/修订 10：top 段分数低只促使检查、不独立触发；阶段一仅记录
                const scores = bodyDocs.filter((b) => b.topScore !== null).map((b) => b.topScore);
                if (scores.length) state.notes.push(`stage-B top window scores: ${scores.map((s) => s.toFixed(3)).join(", ")} (recorded only; gate is phase-2)`);
              }

              // 7) 预算/超时注记（契约 2.5）
              if (budget.deadlineHit) state.notes.push("deadline_hit: 90s budget elapsed; queued work not started");
              if (budget.exhausted) state.notes.push(`budget_exhausted: ${budget.exhausted} cap reached; partial results returned`);

              const enginesNote = typeof search.content === "string" ? search.content.match(/enginesUsed: \[([^\]]*)\]/) : null;
              const out = {
                question: args.question,
                engines: enginesNote && enginesNote[1].trim() ? enginesNote[1].trim() : (search.engineUsed || search.provider || "auto"),
                sources: candidates.map((c) => ({ url: c.source.url, title: c.source.title || "", snippet: c.source.snippet || "", publishedAt: c.source.publishedAt || "" })),
                documents,
                notes: state.notes,
              };
```

</details>

**依据 5 · 源码核查**：[lib/cache.js:9-25](https://github.com/DDDMUC/dsh-free-search/blob/7c30dd059e1d9de4ffc8b779978b2152af84b0ec/lib/cache.js#L9-L25)

SQLite 初始化失败后读取返回 null。

<details>
<summary>查看原文（17行）</summary>

```text
let db = null;
try {
  const req = createRequire(import.meta.url);
  const { DatabaseSync } = req("node:sqlite");
  // 缓存位置可配置：RESEARCH_CACHE_DIR 优先（放哪、是否随备份走由用户决定），
  // 默认 ~/.cache/dsh-free-search/research.db；删掉该目录即清空缓存，无后台任务残留。
  const dir = process.env.RESEARCH_CACHE_DIR || join(homedir(), ".cache", "dsh-free-search");
  mkdirSync(dir, { recursive: true });
  db = new DatabaseSync(join(dir, "research.db"));
  db.exec("CREATE TABLE IF NOT EXISTS pages(url TEXT PRIMARY KEY, title TEXT NOT NULL DEFAULT '', content TEXT NOT NULL, fetched_at INTEGER NOT NULL)");
} catch { /* Node <22.5：缓存禁用 */ }

/** 新鲜则返回 {title, content, fetched_at}，否则 null。 */
export function getFresh(url, maxAgeMs) {
  if (!db) return null;
  const r = db.prepare("SELECT title, content, fetched_at FROM pages WHERE url = ?").get(url);
  if (!r || Date.now() - r.fetched_at > maxAgeMs) return null;
```

</details>

#### 缺口

- 缺少真实网站、重排模型和 SQLite 故障下的端到端结果。
  **影响**：结论限于固定源码与作者声明，不证明外部服务效果。
  **进一步探讨**：试无法抓取与超时页面，核对文档类型、注记、缓存和人工出处。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 接管、卸载与外部成本应如何管理？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

插件安装后会对未设置或默认官方搜索进行接管；抓取 provider 未设置或为默认 http 且未禁用接管时也会变更，已选择其他 provider 则保留。设置写入依赖 settings，writer lock 或其他写错误可导致接管失败；应读取实际配置验证。README 提醒 DSH 0.2.x 停用或卸载前清理持久选择，否则可能指向不存在的 provider；应保留其他 web 配置。搜索会向外部服务发送查询，multi 并发可能增加额度和费用，有些引擎需要凭据；黑名单、提示词警示和桥接 Host 检查均不是来源可信或完整安全的证明。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:4642-4703](https://github.com/DDDMUC/dsh-free-search/blob/7c30dd059e1d9de4ffc8b779978b2152af84b0ec/lib/index.js#L4642-L4703)

注册 provider 并条件接管搜索与抓取。

<details>
<summary>查看原文（62行）</summary>

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
  });
  registerOnce(() => ctx.web.registerFetchProvider(fetchProvider), fetchProvider, "fetch provider");

  // 接管必须先等 settings 服务就绪：rc.2 起 provider 选择是 config 的 volatile ref,
  // 只能通过 settings.mutate 写；apply 期间 settings 尚未挂载，直接取会永远拿不到。
  // 两处接管合并成一次 mutate —— 同一 tick 里连发两次，第二次会被设置文档的版本号顶掉。
  ctx.inject(["settings"], (sctx) => {
    const ops = [];

    const fetchSelection = providerSelection(ctx.web, "fetchProvider");
    if (!fetchSelection.current || (fetchSelection.current === "http" && current().fetchProviderTakeover !== false)) {
      takeOverOps(ctx.web, "fetchProvider", fetchProvider.id, ops);
      logOnce(
        logger,
        "info",
        fetchSelection.current === undefined || fetchSelection.current === null
          ? `free-search: web.fetchProvider was unset, taking over as "${fetchProvider.id}" (direct → exa → firecrawl → crawl4ai)`
          : `free-search: taking over from the default fetch provider "${fetchSelection.current}" as "${fetchProvider.id}" (direct → exa → firecrawl → crawl4ai)`
      );
    } else if (fetchSelection.current !== fetchProvider.id) {
      logOnce(
        logger,
        "warn",
        `free-search: fetch is served by provider "${fetchSelection.current}", not "${fetchProvider.id}" — web_fetch keeps its current provider. ` +
          `To use this plugin's fetch chain, set this in the profile's cordis.patch.yml:\n` +
          `- id: web\n  config:\n    fetchProvider: ${fetchProvider.id}`
      );
    }

    // 接管规则（运行时兜底，不依赖 bundle patch 是否落地）：
    //  - 未设置 searchProvider：接管；
    //  - 仍是出厂默认的官方搜索 deepseek-official：接管（安装本插件就是为了替掉它）；
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
```

</details>

**依据 2 · 源码核查**：[lib/index.js:4705-4725](https://github.com/DDDMUC/dsh-free-search/blob/7c30dd059e1d9de4ffc8b779978b2152af84b0ec/lib/index.js#L4705-L4725)

设置变更及写入失败分支。

<details>
<summary>查看原文（21行）</summary>

```text
    }

    if (ops.length === 0) return;
    if (typeof sctx.settings?.mutate !== "function") {
      logger.warn("free-search: cannot take over the web providers — the settings service is unavailable");
      return;
    }
    void Promise.resolve(sctx.settings.mutate("web", ops)).catch((error) => {
      const message = error?.message ?? String(error);
      // #82：profile 的 package.json 原子写锁超时是另一类失败——不是 provider 冲突，
      // 而是同一 profile 被并发写入，写不进配置 → 运行态和配置态对不上 → 下一轮 apply 再来一次。
      if (/timed out waiting for the writer lock/i.test(message)) {
        logOnce(
          logger,
          "warn",
          "free-search: could not write the web provider selection — the profile's package.json writer lock timed out " +
            `(${message}). Another writer is holding the same profile; this plugin retries on the next apply.`
        );
        return;
      }
      logger.warn(`free-search: failed to take over the web providers (${message})`);
```

</details>

**依据 3 · 作者声明**：[README.md:160-176](https://github.com/DDDMUC/dsh-free-search/blob/7c30dd059e1d9de4ffc8b779978b2152af84b0ec/README.md#L160-L176)

作者说明 provider 选择持久化和卸载注意。

<details>
<summary>查看原文（17行）</summary>

````text
#### 接管行为与验证

插件加载后**自动接管搜索**：

- `web.searchProvider` 未设置，或仍是 DSH 出厂默认的官方搜索 `deepseek-official` 时，自动切换为本插件的 provider（id 固定为 `ddg`）；
- 如果（你或别的插件）已显式选择其他 provider，本插件不抢占，只在启动日志输出 WARN 与切换用的 YAML。

**接管会写进 profile（DSH 0.2.x）**：从 `0.2.0-rc.2` 起 provider 选择存放在 config 的 volatile ref 里，只能经 `settings.mutate("web", …)` 写入，落盘结果就是 `profiles/<profile>/cordis.patch.yml` 多出：

```yaml
- id: web
  config:
    searchProvider: ddg
    fetchProvider: fs-quality-fetch
```

所以**停用或卸载本插件之前，请先删掉 `- id: web` 这两行**（或整行删掉让 DSH 回到出厂默认）。否则配置仍指向 `ddg` 而没有任何东西注册它，每次搜索都会失败：
````

</details>

**依据 4 · 作者声明**：[README.md:52-60](https://github.com/DDDMUC/dsh-free-search/blob/7c30dd059e1d9de4ffc8b779978b2152af84b0ec/README.md#L52-L60)

作者描述多 key、多引擎和不可信数据提示。

```text
- **多 key 轮换** —— 任何 key 字段（或对应环境变量）都可以用逗号 / 分号 / 换行分隔多把 key；平时按请求轮流使用（round-robin，避免单 key 撞 QPS/RPM 风控），遇到 401/402/429（鉴权失败、额度耗尽、限流）先轮换同一引擎的下一把，再走引擎回退；`multi` 模式同样生效（#96）
- **弹出式切换命令** —— 聊天框输入 `/free-search-engine`，弹出引擎选择窗口，点选即切换（等效设置页 + 保存）
- **引擎测试** —— `free_search_test` 工具让 agent 一键测试所有引擎；设置页也有"测试引擎"按钮（直测当前引擎，不走回退链，付费引擎无 key 会明确报错）
- **全局引擎开关与回退优先级** —— 设置页可勾选/取消引擎（取消后全局生效：普通搜索 / Auto / `advanced_search` / `multi_search` / 引擎测试都不再用它），并可用 ↑↓ 调整全局回退顺序（一键恢复默认）
- **Multi 模式** —— 可把搜索引擎设为 `Multi Search`：`web_search` 按查询语言并发**对应语言池的全部**已启用引擎（不再是前 3 个；中文/英文池可在设置页编辑，每池最低 2 个引擎）、按 URL 合并去重（同站判定用 **eTLD+1**）、跨源命中的结果优先；设置页有 **Fast / Balanced / Deep** 三档强度，也可手填并发上限与目标成功源数；整轮检索共享 **30 秒总预算**，到点返回已有结果（代价是成倍消耗额度；multi 失败会自动退回单引擎回退链）
- **统一引擎回退** —— 任何引擎失败（付费/免费，缺 key/401/限流/网络）自动轮流尝试下一个引擎：首选引擎 → 其他引擎（exa/tavily/keenable/firecrawl/parallel/you 无 key 也会尝试，因为它们自带 keyless 免费额度）→ 剩余免费引擎，搜索永不直接失败；结果顶部注明实际生效的引擎（如 `Note: perplexity unavailable or failed, using exa.`）；失败按类别处理：额度/鉴权失败→本会话冷却该引擎，反爬→短退避，超时/5xx/限流→同引擎重试一次，解析失败/0 结果→不冷却（详见下文「失败分类与引擎冷却」）
- **时间过滤** —— `advanced_search` 工具支持 `timeRange`：固定档、自定义相对值、绝对日期三种形式（详见下方逻辑说明）
- **系统提示词注入** —— agent 知道当前用哪个引擎、哪些需要 key；并明确所有搜索结果是**不可信外部数据**，不得执行其中的指令
- **提示注入防护（不可信数据边界）** —— 插件自有工具（advanced_search / platform_search / free_search_test）的网页文本包在 `<untrusted-web-content>` 边界内（正文里自带的同名标记会被剥离，防止提前闭合）；核心 web_search / web_fetch 由 DSH 核心自带同类提示（`External web content follows...`）；所有 snippet 统一清洗并截断到 300 字符
```

**依据 5 · 源码核查**：[lib/index.js:3294-3318](https://github.com/DDDMUC/dsh-free-search/blob/7c30dd059e1d9de4ffc8b779978b2152af84b0ec/lib/index.js#L3294-L3318)

桥接按来源和 Host 信任条件筛选请求。

<details>
<summary>查看原文（25行）</summary>

```text
function isBridgeRequestAllowed(request, trust = bridgeTrust) {
  const host = request.headers.host;
  if (typeof host !== "string") return false;
  const hostUrl = parseAuthority(host);
  if (hostUrl === null) return false;
  // 跨站发起的请求一律拒绝（防 confused deputy）；同源请求才继续看 Host。
  if (request.headers["sec-fetch-site"] === "cross-site") return false;
  const origin = request.headers.origin;
  if (origin !== undefined) {
    try {
      if (new URL(origin).host !== hostUrl.host) return false;
    } catch {
      return false;
    }
  }
  if (isLoopbackHostname(hostUrl.hostname)) return isLoopbackAddress(request.socket.remoteAddress);
  if (trust.hosts.some((entry) => matchesTrustedAuthority(hostUrl, entry))) return true;
  if (trust.publicHost && matchesTrustedAuthority(hostUrl, trust.publicHost)) return true;
  // 直接绑定非 loopback 地址（--host 192.168.x.x / 公网 IP）时，Host 就是绑定地址。
  const localAddress = request.socket.localAddress;
  if (typeof localAddress === "string" && localAddress !== "0.0.0.0" && localAddress !== "::") {
    const local = parseAuthority(localAddress.includes(":") ? `[${localAddress}]` : localAddress);
    if (local !== null && local.hostname === hostUrl.hostname) return true;
  }
  return false;
```

</details>

**依据 6 · 源码核查**：[package.json:53-72](https://github.com/DDDMUC/dsh-free-search/blob/7c30dd059e1d9de4ffc8b779978b2152af84b0ec/package.json#L53-L72)

Node 与宿主依赖声明。

<details>
<summary>查看原文（20行）</summary>

```text
    "type": "git",
    "url": "https://github.com/DDDMUC/dsh-free-search.git"
  },
  "engines": {
    "node": ">=20"
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.18.4"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-client-ui-commands": "^0.1.7-rc.1 || ^0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-plugin-manager": "^0.1.7-rc.1 || ^0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-renderer": "^0.1.7-rc.1 || ^0.2.0-rc.1",
    "@deepseek-ai/dsh-settings": "^0.1.7-rc.1 || ^0.2.0-rc.1",
    "@deepseek-ai/dsh-tools": "^0.1.7-rc.1 || ^0.2.0-rc.1",
    "@deepseek-ai/schemastery": "^3.18.4",
    "react": "^18.2.0"
  },
  "peerDependenciesMeta": {
```

</details>

#### 缺口

- 当前外部服务条款、价格、数据处理及真实网络效果未核验。
  **影响**：结论限于固定源码与作者声明，不证明外部服务效果。
  **进一步探讨**：先用非敏感查询和允许的免费源，在隔离 profile 记录 provider 与费用并验证恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些增量可归因，下一步怎样检验？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可归因贡献是将多源路由、失败分类、短期缓存和研究证据包接入 DSH；现成索引、网页和模型能力来自上游。假设按已验证来源质量与额度动态调整并发，比固定语言池能在相同成本下提高可核验来源覆盖；应使用同一查询集、固定预算，对比两个策略的有效独立来源、失败率、总费用和耗时。若覆盖没有改善、来源错误增多或额外成本超过收益，则否定；这不是当前插件已实现的质量保证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:4088-4109](https://github.com/DDDMUC/dsh-free-search/blob/7c30dd059e1d9de4ffc8b779978b2152af84b0ec/lib/index.js#L4088-L4109)

按配置选择引擎与失败策略。

<details>
<summary>查看原文（22行）</summary>

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
      const disabledEngines = normalizeDisabledEngines(cfg.disabledEngines);
      const fallbackOnSet = new Set(normalizeFallbackOn(cfg.fallbackOn));
      const disabledSet = new Set(disabledEngines);
      const configuredFallbackOrder = Array.isArray(cfg.fallbackOrder) ? cfg.fallbackOrder : [];
      const customFallbackOrder = hasCustomFallbackOrder(configuredFallbackOrder);
      const fallbackOrder = normalizeFallbackOrder(configuredFallbackOrder);
      // 首选引擎：free_search 工具显式指定（request.engine）优先于设置（cfg.provider）
      const preferred =
        typeof request.engine === "string" && (ALL_ENGINES.includes(request.engine) || request.engine === "auto" || request.engine === "multi")
          ? request.engine
          : cfg.provider ?? "bing";
```

</details>

**依据 2 · 源码核查**：[lib/index.js:4115-4152](https://github.com/DDDMUC/dsh-free-search/blob/7c30dd059e1d9de4ffc8b779978b2152af84b0ec/lib/index.js#L4115-L4152)

短期缓存及 multi 模式。

<details>
<summary>查看原文（38行）</summary>

```text
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
          return { ...applyBlockedFilterToResult({ ...hit.value, sources: hit.value.sources?.slice() }), _cache: "hit" };
        }
        if (hit) searchCache.delete(cacheKey);
      }

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
```

</details>

**依据 3 · 源码核查**：[lib/research.js:1332-1343](https://github.com/DDDMUC/dsh-free-search/blob/7c30dd059e1d9de4ffc8b779978b2152af84b0ec/lib/research.js#L1332-L1343)

预算注记和来源输出。

<details>
<summary>查看原文（12行）</summary>

```text
              // 7) 预算/超时注记（契约 2.5）
              if (budget.deadlineHit) state.notes.push("deadline_hit: 90s budget elapsed; queued work not started");
              if (budget.exhausted) state.notes.push(`budget_exhausted: ${budget.exhausted} cap reached; partial results returned`);

              const enginesNote = typeof search.content === "string" ? search.content.match(/enginesUsed: \[([^\]]*)\]/) : null;
              const out = {
                question: args.question,
                engines: enginesNote && enginesNote[1].trim() ? enginesNote[1].trim() : (search.engineUsed || search.provider || "auto"),
                sources: candidates.map((c) => ({ url: c.source.url, title: c.source.title || "", snippet: c.source.snippet || "", publishedAt: c.source.publishedAt || "" })),
                documents,
                notes: state.notes,
              };
```

</details>

**依据 4 · 作者声明**：[README.md:56-57](https://github.com/DDDMUC/dsh-free-search/blob/7c30dd059e1d9de4ffc8b779978b2152af84b0ec/README.md#L56-L57)

作者关于语言池和回退的描述。

```text
- **Multi 模式** —— 可把搜索引擎设为 `Multi Search`：`web_search` 按查询语言并发**对应语言池的全部**已启用引擎（不再是前 3 个；中文/英文池可在设置页编辑，每池最低 2 个引擎）、按 URL 合并去重（同站判定用 **eTLD+1**）、跨源命中的结果优先；设置页有 **Fast / Balanced / Deep** 三档强度，也可手填并发上限与目标成功源数；整轮检索共享 **30 秒总预算**，到点返回已有结果（代价是成倍消耗额度；multi 失败会自动退回单引擎回退链）
- **统一引擎回退** —— 任何引擎失败（付费/免费，缺 key/401/限流/网络）自动轮流尝试下一个引擎：首选引擎 → 其他引擎（exa/tavily/keenable/firecrawl/parallel/you 无 key 也会尝试，因为它们自带 keyless 免费额度）→ 剩余免费引擎，搜索永不直接失败；结果顶部注明实际生效的引擎（如 `Note: perplexity unavailable or failed, using exa.`）；失败按类别处理：额度/鉴权失败→本会话冷却该引擎，反爬→短退避，超时/5xx/限流→同引擎重试一次，解析失败/0 结果→不冷却（详见下文「失败分类与引擎冷却」）
```

#### 缺口

- 没有公开统一对照样本，也没有本轮实测。
  **影响**：结论限于固定源码与作者声明，不证明外部服务效果。
  **进一步探讨**：公开测试问题、预算和判分规则，人工核验来源与独立性。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
