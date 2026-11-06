# dsh-free-search

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[da7f4d4](https://github.com/DDDMUC/dsh-free-search/tree/da7f4d44f14feaa8e90829dd9038f7ef40e333e8)

<!-- BEGIN META -->
[![GitHub ★ 920](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=920&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/DDDMUC/dsh-free-search) [![npm 30d 84,610](https://img.shields.io/static/v1?label=npm+30d&message=84%2C610&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-free-search) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-free-search)
<!-- END META -->

> **功能**：为 DSH 提供多源搜索路由、分类回退、网页抓取与分层证据整理，可配置引擎与凭据。

> **亮点**：把路由、失败分类/冷却、缓存、多源合并与body/snippet证据分层接进DSH，原索引/网页/云服务归上游，见 [Q02](#research-q02)-[Q03](#research-q03)。

> **主要限制**：质量链可执行本机浏览器JS且no-sandbox；multi/研究预算不等所有在飞取消或现金硬cap，升级池参数在provider路径丢失；出处多非独立证据，见 [Q03](#research-q03)-[Q05](#research-q05)。

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
  - [Q01 · 名字叫免费搜索，实际是什么插件，适合什么需求？](#detail-section-11)
  - [Q02 · 一次搜索怎样选源、真正发请求并返回结果？](#detail-section-12)
  - [Q03 · research是否给出了可核证据，正文失败如何表示？](#detail-section-13)
  - [Q04 · 外发、浏览器执行和预算/取消边界是什么？](#detail-section-14)
  - [Q05 · 接管、设置、缓存和退出怎样恢复？](#detail-section-15)
  - [Q06 · 怎样最小试用，免费和成本如何核？](#detail-section-16)
  - [Q07 · 现有多源策略后还剩什么值得做？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：能核网页出处与接收方的DSH用户，隔离profile单明确来源非敏感查询，见 [Q01](#research-q01)/[Q06](#research-q06)。

原Host搜索/抓取provider与手工检索核原页。更多源/模型排序不能代替来源独立性和事实判断。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 搜索provider | 多源路由/回退 | 显式源也可能换源 |
| multi | 归一化/域多样性 | 源数非独立性/预算不全停 |
| research | body/snippet证据契约 | 非事实核验/升级池参数丢失 |
| fetch质量链 | 原站/浏览器/云抓取 | JS执行no-sandbox/有费用 |
| 设置bridge | 接管/凭据/自更新 | 写面/Host认证另核 |
| 缓存/冷却 | 减少重复/抖动 | 部分持久失败非透明 |

**流程与依赖**

#### 依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node>=20/声明DSH>=0.1.7-rc.1与服务 | 原生provider/tools | 运行兼容未验 |
| 外部网络/配置引擎 | 搜索 | 查询外发/限流/费用未知 |
| 可选key/credentials/env | 付费/高额度与模型 | 真实接收方随回退变 |
| 可选系统浏览器 | 抓取JS | no-sandbox，首试不用 |
| 可选node:sqlite/可写目录 | 正文cache | 缺失no-op，运行错误可抛 |
| 正确web配置/Host认证 | 接管/控制面 | 退出需恢复provider |

#### 步骤

| 阶段 | 动作 | 判据/退路 |
| --- | --- | --- |
| 准备 | 隔离备份完整web/凭据引用 | 明确fetch=http/禁takeover |
| 单源 | 禁其他/研究/抓取工具 | 非敏感查询/核实际外呼 |
| 判效 | 对照原Host/原页 | 链接多不当独立证据 |
| 异常 | 看实际源/notes/在飞 | 未停不盲重试 |
| 退出 | 恢复两provider再停包 | 查进程/cache/凭据 |

**效果与成本**

#### 成本

| 阶段 | 现金/资源 | 人工与未知 |
| --- | --- | --- |
| 首次 | Host/网络/可选账号 | 核引擎/接管/隐私/版本 |
| 持续 | 多源重试/云抓取/模型/浏览器/cache | 价格/额度/时延未知，审原页 |
| 失败 | 迟到外呼仍可能计费 | 查限流/在飞/部分证据 |
| 退出 | 缓存/凭据/冷却 | 恢复配置/清敏感内容 |

#### 效果

| 项目 | 当前支持 | 未验证 |
| --- | --- | --- |
| 路由 | 实际搜索/分类回退 | 全引擎可用/单源约束 |
| 合并 | URL/域多样性/成功源注记 | 事实正确与来源独立 |
| 研究 | body/snippet/部分失败字段 | 原文完整/模型判断准确 |
| 预算 | 等待/局部队列/计数 | 所有外呼强停/现金cap |
| 维护 | 可诊断/缓存 | 净省时/费用/退出恢复 |

> **思考**：质量链可执行本机浏览器JS且no-sandbox；multi/研究预算不等所有在飞取消或现金硬cap，升级池参数在provider路径丢失；出处多非独立证据，见 [Q03](#research-q03)-[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把路由、失败分类/冷却、缓存、多源合并与body/snippet证据分层接进DSH，原索引/网页/云服务归上游，见 [Q02](#research-q02)-[Q03](#research-q03)。

真实搜索/抓取/证据契约清晰，但共享计数/取消、内层质量链和配置恢复必须按实际接线解释，不信注释的全部强停/升级池保证，见 [Q02](#research-q02)-[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

质量链可执行本机浏览器JS且no-sandbox；multi/研究预算不等所有在飞取消或现金硬cap，升级池参数在provider路径丢失；出处多非独立证据，见 [Q03](#research-q03)-[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离profile只一明确源非敏感查询，确认web.fetch=http且禁takeover/抓取/research；不能核接收方或成本就退原provider和手工检索，见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定原生0.9.32/source。69文件定向核provider搜索/代表Bing、multi/失败/缓存、research正文/摘要与真实模型/抓取调用、fetch浏览器/重定向/取消、设置接管/bridge写面和缓存失败；未运行/全审全部引擎/模型/SSRF/认证/升级和成品兼容。

- 已检查：作者 README、包清单、源码路径 cordis.patch.yml、lib/cache.js、lib/cooldown.js、lib/fetch_provider.js、lib/index.js、lib/rerank.js、lib/research.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根package/patch/inject与provider注册；searchOnce单源代表Bing/缓存/失败；multi池/凭据/并发/race/merge；research执行/正文tier/worker/fields/notes/补搜参数；fetch质量链/浏览器/HTTPS重定向；settings provider接管/bridge authority/凭据/自更新；SQLite/cooldown失败。未执行全部引擎/抓取路由/模型判断/SSRF与Host认证/安装升级/自动disposer/完整缓存和计费。
- 下一步：- 下一步隔离非敏感单源查询，核实际provider/接收方/原页与原Host基线。
- 抓取浏览器/迟到multi/预算取消只假端点隔离测，不能靠工具返回代表全部停止。
- 未运行查询/模型/账号/浏览器，价格/配额/独立性和收益未知。

**分析版本**

- **仓库**：[DDDMUC/dsh-free-search](https://github.com/DDDMUC/dsh-free-search)
- **版本号**：0.9.32（[固定提交 da7f4d4](https://github.com/DDDMUC/dsh-free-search/tree/da7f4d44f14feaa8e90829dd9038f7ef40e333e8)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

共享真实外呼计数/取消上下文和待确认状态，与现deadline/race及固定单源比较；越界外呼/维护不降或误取消增加即否定，见 [Q07](#research-q07)。

- 下一步隔离非敏感单源查询，核实际provider/接收方/原页与原Host基线。
- 抓取浏览器/迟到multi/预算取消只假端点隔离测，不能靠工具返回代表全部停止。
- 未运行查询/模型/账号/浏览器，价格/配额/独立性和收益未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 1383 | — | — | 24321 |
| .js | source | 19 | 14047 | 11959 | 1712 | — |
| .mjs | source | 47 | 4964 | 4110 | 558 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/DDDMUC/dsh-free-search/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 31](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=31&color=737b86&logo=github)](https://github.com/DDDMUC/dsh-free-search/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z) [![近30天关闭 25](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=25&color=737b86&logo=github)](https://github.com/DDDMUC/dsh-free-search/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核真实搜索/抓取/研究/接管链，区分免费名义、外发与浏览器执行、预算/取消和证据可靠性。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 名字叫免费搜索，实际是什么插件，适合什么需求？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

固定dsh-free-search 0.9.32为原生DSH Host/Web bundle，清单Node>=20、DSH>=0.1.7-rc.1及可选peer是声明，非本轮兼容验收。为希望Agent返回可核网页出处的用户注册search/fetch provider与advanced/multi/research等工具/设置界面；不是独立搜索索引，结果和正文由外部引擎/网页/云抓取提供。包描述的引擎总数不当独立已验能力，本项69文件定向主链与Bing/抓取代表。

相对原Host provider/手工检索，增量是多源路由、失败分类、来源合并、缓存和正文证据分层。免费名称不保证无凭据/额度/付费，已有API key或模型端点会改变实际路径，新增fetch质量链甚至可启动本机浏览器；使用者仍须核原始页面、独立性和任务答案，不能把更多链接/模型重排当事实核验。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-12](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/package.json#L1-L12)

包身份/版本/原生exports和作者功能描述。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "dsh-free-search",
  "version": "0.9.32",
  "description": "Free web search for DeepSeek Harness: 27 engines (Bing/DuckDuckGo/AnySearch/SearXNG/Exa/Tavily/Keenable/Firecrawl/Parallel/You.com keyless; Zhihu global/site via MCP and Perplexity/SerpBase/DeepSeek (official + native tools/search)/Baidu/Kimi/Aliyun/Doubao with key; OpenAI/Gemini/Claude model built-in search, explicit-only) + auto smart routing + global engine enable/disable & fallback priority + editable zh/en language pools + multi mode (parallel full language-pool merge) + multi_search cross-source tool + failure-aware fallback (quota/auth cooldown, transient retry, fallbackOn) + time filtering + platform search + domain blocklist (blockedDomains) + web_fetch, with web settings UI.",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
```

</details>

**依据 2 · 源码核查**：[package.json:56-79](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/package.json#L56-L79)

Node与依赖声明。

<details>
<summary>查看原文（24行）</summary>

```text
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
    "@deepseek-ai/cordis": {
      "optional": true
    },
    "@deepseek-ai/dsh-client-ui-commands": {
      "optional": true
    },
```

</details>

**依据 3 · 源码核查**：[package.json:103-123](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/package.json#L103-L123)

DSH bundle/client/Host声明。

<details>
<summary>查看原文（21行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-commands",
        "@deepseek-ai/dsh-client-ui-plugin-manager",
        "@deepseek-ai/dsh-client-ui-renderer"
      ],
      "platform": "web"
    },
    "engines": {
      "dsh": ">=0.1.7-rc.1"
    },
    "compatibility": {
      "dshReleases": {
        "0.1.7-rc.1": "compatible"
      }
    }
  }
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:28-33](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/cordis.patch.yml#L28-L33)

原生Host patch入口。

```text
- insert:
    - id: web-search-free
      name: dsh-free-search
      config:
        disabledEngines: []
        bingMarket: zh-CN
```

**依据 5 · 源码核查**：[lib/index.js:3947-3951](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L3947-L3951)

真实注入web/settings/tools/systemPrompt服务。

```text
// settings / tools / systemPrompt are core DSH services and are touched inside
// inject() callbacks; older Cordis builds (DSH 0.2.1-rc.2) refuse undeclared
// property access, so declare them here as well (#107).
const inject = ["web", "settings", "tools", "systemPrompt"];

```

**依据 6 · 源码核查**：[lib/index.js:5061-5072](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L5061-L5072)

真实search/fetch provider注册。

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

**依据 7 · 源码核查**：[lib/index.js:6188-6191](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L6188-L6191)

真实research及domain工具接线。

```text
  registerResearchTool(ctx, { provider, resolveApiKey, wrapUntrustedBlock, escalationEngines: () => current().escalationEngines, getConfig: current, ns: FREE_SEARCH_NS, isToolDisabled: (id) => !toolEnabled(id) });

  // 垂直领域源直查：domain_search 工具 + 免 key 领域引擎注册表。
  registerDomainSearchTool(ctx, { wrapUntrustedBlock, getConfig: current, ns: FREE_SEARCH_NS, isToolDisabled: (id) => !toolEnabled(id) });
```

#### 缺口

- 未运行/安装/所有引擎/实际配额或用户效果，目录总数不作验收。
  **影响**：能说明集成能力，不能承诺免费稳定/优于原Host。
  **进一步探讨**：隔离profile固定成品，用一非敏感查询单允许源核真实provider和出处，再与原Host/手工检索比较。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 一次搜索怎样选源、真正发请求并返回结果？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

provider id叫ddg，available总true只是本地可注册状态；search校query，从当前配置/显式engine决定preferred，auto按语言池/禁用/allowlist/顺序选链，显式源失败仍可回退，不是只发该源。普通链剩余总时长与外部signal组合后传引擎；代表Bing真实fetch SERP再解析URL/title/snippet，空/不相关结果视失败。分类quota/auth/bot-wall/transient/invalid/unknown，非限流transient同源重试一次后按fallbackOn换源，key ring也可重试；不能把失败一律当无信息或自动全部换免费的源。

成功结果域过滤后带实际provider、必要fallback说明，短期Map LRU缓存按query/time/preferred/配置等key，fallback成功用较短TTL；只证明当前缓存机制，key未含所有语言/凭据/池变更可能短窗复用旧语义，不能承诺所有设置变更即时刷新结果。multi先按池/凭据筛选、配置上限选源，显式engines可绕配置并发上限，再真runEngineTest；只把有结果引擎计used，归一化URL合并，域多样性排序、seenIn仅溯源次级，源数不等独立性。

multi配置minSources是尽力目标，不达也返已有结果并注明；预算到点只race等待，后续Q04说明取消不完整。缓存hit不是新查询成功；测试单引擎和真实auto/multi路径也不同。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:4458-4519](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L4458-L4519)

真实provider/query/preferred/cache命中。

<details>
<summary>查看原文（62行）</summary>

```text
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
          return { ...applyBlockedFilterToResult({ ...hit.value, sources: hit.value.sources?.slice() }), _cache: "hit" };
        }
        if (hit) searchCache.delete(cacheKey);
```

</details>

**依据 2 · 源码核查**：[lib/index.js:4546-4616](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L4546-L4616)

auto/显式链/冷却/组合signal。

<details>
<summary>查看原文（71行）</summary>

```text
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

      let lastError = null;
      let usedEngine = null;
      let blockedFailure = null;
      // 首选引擎若被尝试后失败，记录失败详情（用于 Note）；multi 失败回退时沿用同一条通道
      let preferredFailure = multiFailure;
      let preferredFailureClass = null;
      // 失败感知回退（#36）：quota/auth/bot-wall 冷却中的引擎本轮直接跳过
      const cooldownNow = Date.now();
      const cooling = chain.filter((engine) => isCoolingDown(engine, cooldownNow));
      if (cooling.length > 0) {
        chain = chain.filter((engine) => !cooling.includes(engine));
        if (cooling.includes(preferred)) {
          preferredFailure = cooldowns.isSession(preferred)
            ? "after a terminal quota/auth failure"
            : "after an anti-bot block";
          preferredFailureClass = "cooldown";
        }
      }
      if (chain.length === 0) throw new Error("all search engines are unavailable (disabled or cooling down)");
      // 总超时预算：串行回退时限制整条引擎链的总时长，防止各引擎超时累加达分钟级
      const BUDGET_MS = SEARCH_BUDGET_MS;
      const deadline = Date.now() + BUDGET_MS;
      // 可变队列：transient 失败时把同一引擎插回一次再前进（#36）
      const retriedEngines = new Set();
      for (let qi = 0; qi < chain.length; qi++) {
        const engine = chain[qi];
        const remaining = deadline - Date.now();
        if (remaining <= 0) {
          throw new Error(`search timed out after ${BUDGET_MS / 1000}s`);
        }
        // 组合外部取消 signal + 剩余预算超时：官方 web_search 取消、引擎超时、总预算都能触发
        const effSignal = AbortSignal.any([...(signal !== undefined ? [signal] : []), AbortSignal.timeout(remaining)]);
        try {
          let result;
          if (engine === "ddg") {
            result = await searchDdgHtml(request.query, request.maxResults, { ...cfg, timeRange }, effSignal);
          } else if (engine === "ddg-lite") {
            result = await searchDdgLite(request.query, request.maxResults, { ...cfg, timeRange }, effSignal);
          } else if (engine === "bing") {
            result = await searchBing(request.query, request.maxResults, cfg, effSignal);
```

</details>

**依据 3 · 源码核查**：[lib/index.js:886-922](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L886-L922)

代表Bing真实网络与SERP解析/相关性检查。

<details>
<summary>查看原文（37行）</summary>

```text
async function searchBing(query, maxResults, options, signal) {
  // mkt：仅显式 bingMarket 才发。默认不发——mkt=zh-CN 在部分地区/线路会返回空 SERP 容器
  // （#71：海外 IP + mkt=zh-CN → b_algo=0），Bing 会按 Accept-Language 自行本地化。
  const profile = LANG_PROFILES[searchLanguage(configLanguage(options))];
  const params = new URLSearchParams({ q: query });
  if (options?.bingMarket) params.set("mkt", options.bingMarket);
  // Accept-Language：显式 bingMarket 时按 market 反推（避免中文 header 污染），否则用 lang 档案
  const acceptLang = options?.bingMarket
    ? (MARKET_TO_LANG[options.bingMarket] ?? activeAcceptLanguage)
    : (profile.acceptLang ?? activeAcceptLanguage);
  const adlt = options?.safeSearch ?? "off";
  if (adlt === "off") params.set("adlt", "off");
  else if (adlt === "moderate") params.set("adlt", "moderate");
  else if (adlt === "strict") params.set("adlt", "strict");
  // 注意（2026-10-13 实测）：Bing 会对可疑出口 IP 间歇性返回约 91KB 的「空 SERP」（b_algo 块数 0），
  // 表现为按请求频率收紧、减少请求后又自行恢复。曾加过「空 SERP 时多试一次」的兜底，但实测
  // 请求数翻倍反而更容易被压死，且根因在出口 IP 而非解析，故撤掉——修法应让 bing 不走可疑代理
  // （启动脚本的 NO_PROXY 排除 .bing.com 即可恢复）。
  const html = await fetchHtmlWithRetry(`${BING_URL}?${params}`, signal, acceptLang);
  const blocks = html.match(/<li class="b_algo"[\s\S]*?<\/li>/g) ?? [];
  const sources = [];
  for (const block of blocks) {
    const hrefMatch = block.match(/<a[^>]*href="(https?:\/\/[^"]+)"/);
    const titleMatch = block.match(/<h2[^>]*>[\s\S]*?<a[^>]*>(.*?)<\/a>[\s\S]*?<\/h2>/);
    const snippetMatch = block.match(/<p[^>]*>([\s\S]*?)<\/p>/);
    if (!hrefMatch) continue;
    sources.push({
      url: extractBingUrl(hrefMatch[1]),
      ...(titleMatch ? { title: stripTags(titleMatch[1]) } : {}),
      ...(snippetMatch ? { snippet: stripTags(snippetMatch[1]) } : {}),
    });
  }
  // Bing 无结果时会返回无关的缓存页：判为 0 结果，交给统一回退链换下一个引擎
  if (sources.length > 0 && !looksRelevant(query, sources)) {
    return { sources: [], truncated: false };
  }
  return { sources: uniqueSources(sources, maxResults ?? 10), truncated: false };
```

</details>

**依据 4 · 源码核查**：[lib/index.js:4835-4888](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L4835-L4888)

结果过滤/实际源/缓存/空结果处理。

<details>
<summary>查看原文（54行）</summary>

```text
            continue;
          }

          if (result.sources.length > 0) {
            // #72 结果级收口：无论走哪个引擎（其中 11 个不经过 uniqueSources），
            // 在写缓存与返回之前统一按黑名单过滤；全被屏蔽时视为该引擎 0 结果，继续下一个引擎。
            result = applyBlockedFilterToResult(result);
          }

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
          }
          lastError = new Error(`engine "${engine}" returned 0 results`);
          if (engine === preferred) { preferredFailure = "returned 0 results"; preferredFailureClass = "invalid-response"; }
          if (!fallbackOnSet.has("invalid-response")) {
            blockedFailure = { engine, failure: { class: "invalid-response", message: "returned 0 results" } };
            logger.warn('free-search: ' + engine + ' returned 0 results and "invalid-response" is not in fallbackOn, stopping');
            break;
          }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:4889-4919](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L4889-L4919)

真实分类/key冷却/transient重试/fallbackOn。

<details>
<summary>查看原文（31行）</summary>

```text
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

**依据 6 · 源码核查**：[lib/index.js:650-659](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L650-L659)

实际缓存key字段。

<details>
<summary>查看原文（10行）</summary>

```text
function buildCacheKey(query, maxResults, timeRangeLabel, preferred, disabledEngines = [], fallbackOrder = [], blockedDomains = [], multiMaxEngines = 0, multiMinSources = 1) {
  const disabledKey = normalizeDisabledEngines(disabledEngines).slice().sort().join(",");
  const orderKey = normalizeFallbackOrder(fallbackOrder).join(",");
  // #72：黑名单参与 key——改动 blockedDomains 后旧缓存自然失效，不会 5 分钟内仍命中旧结果
  const blockedKey = (Array.isArray(blockedDomains) ? blockedDomains : []).map((d) => String(d).toLowerCase().trim().replace(/^www\./, "")).slice().sort().join(",");
  // #69：multi 上限/目标成功数直接改变跑哪些引擎、结果长什么样，必须进 key
  // （reporter 验收标准明确列了这一条：缓存 key 要考虑任何改变结果语义的新设置）
  const multiKey = [Number(multiMaxEngines) || 0, Number(multiMinSources) || 1].join(":");
  return [query ?? "", maxResults ?? 5, timeRangeLabel ?? "", preferred, disabledKey, orderKey, blockedKey, multiKey].join("\u0000");
}
```

</details>

**依据 7 · 源码核查**：[lib/index.js:5348-5421](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L5348-L5421)

multi池/凭据/显式与配置上限。

<details>
<summary>查看原文（74行）</summary>

```text
  runMultiSearch = async ({ query, maxResults, engines, timeRange } = {}) => {
    if (!query || !String(query).trim()) throw new Error("query is required");
    // #72：multi_search 工具直连本函数、不经过 provider.search，自行设置活动黑名单
    setActiveBlockedDomains(current().blockedDomains);
    const q = String(query).trim();
    const limit = Math.min(Math.max(Number(maxResults) || 8, 1), 20);
    const disabled = new Set(effectiveDisabledEngines(current()));
    const parsedTimeRange = parseTimeRange(timeRange);
    const targetEngines = Array.isArray(engines) && engines.length > 0
      ? [...new Set(engines.filter((engine) => ALL_ENGINES.includes(engine) && !disabled.has(engine)))]
      : await (async () => {
          // 语言分池（评审意见 B）：并发对应语言池的全部引擎（不再截前 3）；
          // 禁用/冷却/无 key（zhihu 预探测；其余引擎在 runEngineTest 层以 "not configured" 优雅跳过）自动跳过，剩余照跑
          const cfgNow = current();
          const pool = languagePool(q, {
            zhPool: Array.isArray(cfgNow.zhPool) ? cfgNow.zhPool : undefined,
            enPool: Array.isArray(cfgNow.enPool) ? cfgNow.enPool : undefined,
          });
          const zhihuUsable = pool.some((engine) => engine.startsWith("zhihu"))
            ? Boolean(await resolveZhihuKey(true)) && !isCoolingDown("zhihu_global") && !isCoolingDown("zhihu_site")
            : false;
          const usable = pool.filter((engine) =>
            !disabled.has(engine)
            && !isCoolingDown(engine)
            && !(engine.startsWith("zhihu") && !zhihuUsable)
          );
          if (usable.length > 0) return usable;
          // 语言池全不可用：回退池外的兜底链（时间路由仍生效），保证至少有引擎照跑
          const poolSet = new Set(pool);
          return routeEngines(q, {
            timeRange: Boolean(parsedTimeRange),
            disabledEngines: effectiveDisabledEngines(cfgNow),
            allowedEngines: cfgNow.allowedEngines,
            fallbackOrder: cfgNow.fallbackOrder,
            zhPool: Array.isArray(cfgNow.zhPool) ? cfgNow.zhPool : undefined,
            enPool: Array.isArray(cfgNow.enPool) ? cfgNow.enPool : undefined,
          }).filter((engine) => !poolSet.has(engine) && !isCoolingDown(engine));
        })();

    if (targetEngines.length === 0) throw new Error("No enabled engines selected");

    // 调用方显式点名引擎时，资格过滤与并发上限都不再二次干预——尊重原意
    const explicitEngines = Array.isArray(engines) && engines.length > 0;

    // #69 §2：凭据资格必须在并发上限【之前】过滤。
    // 原状缺 key 的引擎要到 runEngineTest 才发现 not configured，而那时它已经占掉了
    // 上限名额——本机默认池 [bing, baidu, aliyun, anysearch] 里 baidu/aliyun 都没 key，
    // 上限设 3 时取走的正是这三个不可用的，唯一能跑的 anysearch 被切掉，整次 multi 失败。
    // 这里按 credentialRequirement 的 {env, settings} 描述符**复用同一条 resolveApiKey**
    // 做存在性探测（不打印、不外泄），因此只在设置页填了 key 的用户同样算合格。
    const availability = new Map();
    for (const engine of targetEngines) {
      const descs = credentialRequirement(engine);
      if (!descs) { availability.set(engine, true); continue; }
      let ok = false;
      for (const d of descs) {
        try {
          if (await resolveApiKey(d.env, d.settings ?? undefined, true)) { ok = true; break; }
        } catch { /* 探测失败按未配置处理 */ }
      }
      availability.set(engine, ok);
    }
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

```

</details>

**依据 8 · 源码核查**：[lib/index.js:5432-5459](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L5432-L5459)

真实并发与等待预算/成功来源。

<details>
<summary>查看原文（28行）</summary>

```text
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
    }
    const rawResults = [];

      for (const { engine, res } of outcomes) {
          if (res.ok) {
            // #69 §3：目标成功源数统计的是「真返回了结果的引擎」。原状只要 res.ok 就记进
            // enginesUsed，于是空手而归的引擎也被算作已用——备注会写成 enginesUsed: [a, b]
            // 而实际只有 a 有结果；更糟的是当所有引擎都返回空时 enginesUsed 仍非空，
            // 于是既不抛错也不提示，搜索"成功"地返回零结果。
            if ((res.sources ?? []).length > 0) {
              enginesUsed.push(engine);
              rawResults.push({ engine, sources: res.sources });
            } else {
```

</details>

**依据 9 · 源码核查**：[lib/index.js:5469-5498](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L5469-L5498)

目标源数不足补跑但非硬约束。

<details>
<summary>查看原文（30行）</summary>

```text
    // #69 §3：目标成功源数——主轮成功数不够时，用池外兜底链里**还没试过**的引擎补跑，
    // 达到目标即停。注意这是「尽量达到」而非硬下限：补跑也达不到时绝不移除已有结果、
    // 绝不因此抛错，只在 notes 里说明（调用方拿到的仍是主轮的有效证据）。
    if (!explicitEngines && enginesUsed.length < minSources) {
      const poolSet = new Set(attemptedEngines);
      const topUpChain = routeEngines(q, {
        timeRange: Boolean(parsedTimeRange),
        disabledEngines: cfgMulti.disabledEngines,
        fallbackOrder: cfgMulti.fallbackOrder,
        zhPool: Array.isArray(cfgMulti.zhPool) ? cfgMulti.zhPool : undefined,
        enPool: Array.isArray(cfgMulti.enPool) ? cfgMulti.enPool : undefined,
      }).filter((engine) => !poolSet.has(engine) && !disabled.has(engine) && !isCoolingDown(engine));
      for (const engine of planTopUp({
        attempted: attemptedEngines,
        succeeded: enginesUsed.length,
        minSources,
        chain: topUpChain,
      })) {
        if (enginesUsed.length >= minSources) break; // 边跑边查，达标即止
        if (Date.now() >= multiDeadlineAt) {
          // 补跑是串行的（每个引擎都有自己的超时），不设总预算时可能累加到分钟级
          failedEngines.push(`top-up [timeout] (search budget ${SEARCH_BUDGET_MS / 1000}s exceeded)`);
          break;
        }
        try {
          const res = await runEngineTest(engine, q, timeRange, limit);
          attemptedEngines.push(engine);
          if (res.ok && (res.sources ?? []).length > 0) {
            enginesUsed.push(engine);
            rawResults.push({ engine, sources: res.sources });
```

</details>

**依据 10 · 源码核查**：[lib/index.js:5510-5558](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L5510-L5558)

真实URL合并与域多样性排序。

<details>
<summary>查看原文（49行）</summary>

```text
      }
    }

    const urlMap = new Map();
    let itemSeq = 0;
    // #72：合并前过滤——引擎里未被 uniqueSources 覆盖的结果（如 anysearch）也在这里被挡住
    const blockedRaw = getActiveBlockedDomains();
    for (const { engine, sources } of rawResults) {
      const keptSources = blockedRaw.length
        ? sources.filter((s) => !isDomainBlocked(s?.url, blockedRaw))
        : sources;
      for (const source of keptSources) {
        if (!source || !source.url) continue;
        // #69 §4：合并归一化统一走 lib/url_norm.js。原状这里原样保留 u.search，
        // 导致同一页面「带 utm_*」与「不带」被当成两条、seenIn 分裂。
        const normUrl = normalizeUrlForDedupe(source.url);

        if (urlMap.has(normUrl)) {
          const entry = urlMap.get(normUrl);
          entry.seenInSet.add(engine);
          if (!entry.source.snippet && source.snippet) entry.source.snippet = source.snippet;
          if (!entry.source.title && source.title) entry.source.title = source.title;
          if (!entry.source.publishedAt && source.publishedAt) entry.source.publishedAt = source.publishedAt;
        } else {
          urlMap.set(normUrl, {
            source: { ...source },
            seenInSet: new Set([engine]),
            order: itemSeq++,
          });
        }
      }
    }

    // #69 §4：排序信号重构。原状按 seenInSet.size 降序当第一排序键，等于把"多个引擎
    // 同时返回"当作可信度证明——但引擎可能共享索引与排序偏见，六条同域结果并不等于
    // 六个独立来源。现改为：域名多样性为主（轮转交错）、原始顺序次之、时效性仅在本次
    // 搜索带时间过滤时参与，seenIn 降为末位 tiebreak（保留为溯源/佐证元数据）。
    // 只重排、不剔除——过滤是 blockedDomains 的职责。
    const mergedEntries = Array.from(urlMap.values());
    const rankedOrder = rankMergedResults(
      mergedEntries.map((entry, index) => ({
        index,
        domain: domainOf(entry.source?.url),
        order: entry.order,
        corroboration: entry.seenInSet.size,
        publishedAt: entry.source?.publishedAt,
      })),
      { appliesFreshness: Boolean(parsedTimeRange) }
    );
```

</details>

#### 缺口

- 未审全部引擎、并发多配置活动模块状态/缓存隔离、真实响应与质量。
  **影响**：只能支持代表调用和分支，返回数量/used不代表事实覆盖。
  **进一步探讨**：同查询单源/auto/multi分别记录实际域/引擎/HTTP与cache状态；改语言池/凭据时清缓存再比较，不用链接数判优。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · research是否给出了可核证据，正文失败如何表示？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

research真实注册工具，execute按depth建预算/读取抓取与可选重排/decision凭据，provider.search multi取候选，规范化/聚类后有界worker抓正文；不是只返回模型总结。fetchTiered先域过滤与SQLite新鲜缓存，再ctx.web.fetch，直接内容不足可带key调Exa/Firecrawl/Crawl4AI；ctx.web.fetch可能就是本包已接管的质量链，因此所谓direct层不一定只有一次原站HTTP，也可能已含浏览器/云回退。

候选/段落可通过模型rerank/embed/decision处理，缺key/失败降规则轻筛；向这些端点发送问题与网页内容，排序分数不是事实准确度。正文分窗/截断及同日期高相似折叠，保留URL/cluster/engine_hits/tier/cache/fetched_at；未抓候选明确kind=snippet-only，正文kind=body且independence仍unknown。原生multi provider会剥seenIn，research可退用全批enginesUsed集合并注明，不能把它当每条链接确由所有引擎返回。

全正文失败标notEvaluated/snippets only，deadline/预算部分结果notes；estimatedTokens只是字符粗估，不是账户usage/成本。补搜代码虽然传engines=escalation，但searchOnce的multi调用只透query/max/time，丢request.engines，所以当前这条入口不能保证第二轮按指定升级池而不重复主池；不要把注释计划当实际不同来源核验。既有来源可互相转引/同索引，仍需读原页与交叉核对。

#### 证据与依据

**依据 1 · 源码核查**：[lib/research.js:815-824](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/research.js#L815-L824)

真实工具注册入口。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/research.js:874-931](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/research.js#L874-L931)

真实execute/预算/key/搜索与engine_hits退化。

<details>
<summary>查看原文（58行）</summary>

```text
          async execute(args) {
            const depth = Math.min(5, Math.max(1, Math.round(args.depth ?? 3)));
            const rulesIntent = judgeIntentRules(args.question);
            const budget = makeBudget(depth);
            const state = {
              notes: [],
              firecrawlUsed: 0,
              crawl4aiUsed: 0,
              exaKey: undefined,
              firecrawlKey: undefined,
              crawl4aiKey: undefined,
              rerankKey: undefined,
              decisionKey: undefined,
            };
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

              // 阶段二 #1：意图判定升级（decision key 可用时覆盖 task/breadth；失败静默保规则版）
              const intent = await judgeIntentWithDecision(args.question, rulesIntent, state.decisionKey);
              state.notes.push(
                `intent(${intent.source}): task=${intent.task}${intent.comparison ? "+comparison" : ""} freshness=${intent.freshness} language=${intent.language} breadth=${intent.breadth ?? 1}`
              );

              // 1) 搜索：multi 模式并发 top-3 引擎融合（预算内；signal 取消在途）
              if (!budgetAllows(budget, "search")) {
                return { question: args.question, engines: "(budget exhausted)", estimatedTokens: 0, sources: [], documents: [], notes: [...state.notes, "budget_exhausted: search cap"] };
              }
              budgetUse(budget, "search");
              let search;
              try {
                search = await provider.search({ query: args.question, maxResults: 12, engine: "multi" }, budget.controller.signal);
              } catch (e) {
                return {
                  question: args.question, engines: "(search failed)", estimatedTokens: 0,
                  sources: [], documents: [],
                  notes: [`search failed: ${e.message}`, "Hint: call free_search_test to check engine health, or retry with web_search."],
                };
              }
              let mergedSources = [...(search.sources ?? [])];
              // 引擎归属（契约 engine_hits）：per-source seenIn 优先（升级池补搜注入的也在此）；multi 剥除时降级用 Note 解析的全集
              const noteEngines = enginesFromNote(search.content);

              // （阶段三 #6 宽模式已删除：升级池取代宽模式——补搜轮见下方"补搜一轮"的 escalation pool 路径）
              const engineHitsOf = (s) => (Array.isArray(s.seenIn) && s.seenIn.length ? s.seenIn : noteEngines);
              if (!mergedSources.some((s) => Array.isArray(s.seenIn) && s.seenIn.length) && noteEngines.length) {
                state.notes.push(`engine_hits: per-source seenIn unavailable — derived from enginesUsed note [${noteEngines.join(", ")}]`);
```

</details>

**依据 3 · 源码核查**：[lib/research.js:702-778](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/research.js#L702-L778)

真实缓存/ctx.web.fetch/云抓取阶梯。

<details>
<summary>查看原文（77行）</summary>

```text
async function fetchTiered(ctx, url, title, state, budget, intent) {
  // #72：黑名单站点直接不抓（缓存也不读）；不算失败，不写 note——这是用户主动配置的过滤
  if (isDomainBlocked(url)) return null;
  const now = Date.now();
  const cached = getFresh(url, DOC_CACHE_MAX_AGE_MS);
  if (cached && (intent.freshness === "none" || canUseCache(cached.fetched_at, intent.freshness, now)[0])) {
    // 契约：缓存命中另标 cache:true，fetched_at 保留真实抓取时间不替换
    return { content: cached.content, tier: "cache", truncated: false, fetchedAt: new Date(cached.fetched_at).toISOString(), updatedAt: "", cache: true };
  }
  if (cached) state.notes.push(`cache rejected for ${url}: ${canUseCache(cached.fetched_at, intent.freshness, now)[1]} (freshness=${intent.freshness}) — refetching`);

  // T1：平台官方 fetch provider（重定向/解码/大小限制白送）
  if (budgetAllows(budget, "fetchAttempt")) {
    budgetUse(budget, "fetchAttempt");
    try {
      const r = await platformFetch(ctx, url, budget.controller.signal);
      const raw = r?.body?.kind === "html" ? r.body.content : r?.body?.content || "";
      const content = r?.body?.kind === "html" ? htmlToText(raw) : String(raw || "");
      if (r.statusCode < 400 && content.length >= T1_MIN_CHARS) {
        cachePut(url, title, content);
        budgetUse(budget, "fetch");
        return { content, tier: "direct", truncated: Boolean(r.truncated), fetchedAt: new Date().toISOString(), updatedAt: parseUpdatedFromHtml(raw), cache: false };
      }
      if (r.statusCode >= 400) state.notes.push(`fetch direct failed for ${url}: HTTP ${r.statusCode}`);
      else state.notes.push(`fetch direct short for ${url}: ${content.length} chars (< ${T1_MIN_CHARS})`);
    } catch (e) {
      if (budget.controller.signal.aborted) return null; // deadline：不再启动回退
      state.notes.push(`fetch direct failed for ${url}: ${e.message}`);
    }
  }

  // T2：exa contents（$1/1000 页，文本质量好且便宜）——T1 失败（反爬/JS/过短）时承接；
  // 仅预算门控，不占 firecrawl 共享槽（firecrawl 额度保护：仅在本层失败后才走 T3）
  if (state.exaKey && budgetAllows(budget, "fetchAttempt")) {
    budgetUse(budget, "fetchAttempt");
    try {
      const text = await callExa(url, state.exaKey, budget.controller.signal);
      if (text.trim().length >= T1_MIN_CHARS) {
        cachePut(url, title, text);
        budgetUse(budget, "fetch");
        return { content: text, tier: "exa", truncated: false, fetchedAt: new Date().toISOString(), updatedAt: "", cache: false };
      }
    } catch (e) {
      state.notes.push(`exa fetch failed for ${url}: ${e.message}`);
    }
  }

  // T3：firecrawl（反爬/JS 页面）——模块级共享额度（同进程并发调用共同受限；先过预算门再占槽，避免无调用耗槽）
  if (state.firecrawlKey && budgetAllows(budget, "fetchAttempt") && borrowServiceSlot("firecrawl")) {
    budgetUse(budget, "fetchAttempt");
    try {
      const md = await callFirecrawl(url, state.firecrawlKey, budget.controller.signal);
      if (md.trim().length >= T1_MIN_CHARS) {
        cachePut(url, title, md);
        budgetUse(budget, "fetch");
        return { content: md, tier: "firecrawl", truncated: false, fetchedAt: new Date().toISOString(), updatedAt: "", cache: false };
      }
    } catch (e) {
      state.notes.push(`firecrawl fetch failed for ${url}: ${e.message}`);
    }
  }

  // T4：crawl4ai（备份）——模块级共享额度（先过预算门再占槽）
  if (state.crawl4aiKey && budgetAllows(budget, "fetchAttempt") && borrowServiceSlot("crawl4ai")) {
    budgetUse(budget, "fetchAttempt");
    try {
      const text = await callCrawl4ai(url, state.crawl4aiKey, budget.controller.signal);
      if (text.trim().length >= T1_MIN_CHARS) {
        cachePut(url, title, text);
        budgetUse(budget, "fetch");
        return { content: text, tier: "crawl4ai", truncated: false, fetchedAt: new Date().toISOString(), updatedAt: "", cache: false };
      }
    } catch (e) {
      state.notes.push(`crawl4ai fetch failed for ${url}: ${e.message}`);
    }
  }

```

</details>

**依据 4 · 源码核查**：[lib/research.js:976-1009](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/research.js#L976-L1009)

有界worker和实际fetchTiered入账。

<details>
<summary>查看原文（34行）</summary>

```text
              const enqueue = (item, why) => {
                if (!item || enqueued.has(item.key) || fetchQueue.length + fetchedResults.size >= budget.fetchMax) return;
                enqueued.add(item.key);
                fetchQueue.push({ item, why });
              };
              const fetchedResults = new Map(); // key → { item, fetch }
              // 代表优先入队；非代表默认待命（已在 ranked 中降权），仅在队列未满时补位
              for (const item of ranked) {
                if (fetchedResults.size + fetchQueue.length >= budget.fetchMax) break;
                if (item.isRep) enqueue(item, "rank");
              }
              for (const item of ranked) {
                if (fetchedResults.size + fetchQueue.length >= budget.fetchMax) break;
                enqueue(item, "rank");
              }

              const drain = async () => {
                const worker = async () => {
                  while (fetchQueue.length) {
                    if (budget.expired || budget.fetchesUsed >= budget.fetchMax) break; // 排队任务不再启动
                    const job = fetchQueue.shift();
                    const r = await fetchTiered(ctx, job.item.source.url, job.item.source.title, state, budget, intent);
                    if (r) {
                      fetchedResults.set(job.item.key, { item: job.item, fetch: r });
                    } else if (job.item.clusterId) {
                      // 契约 2.3：代表失败 → 簇成员在剩余预算内再入队（一层，不连锁）
                      for (const mi of clusters.get(job.item.clusterId).members) {
                        const member = items[mi];
                        if (member.key !== job.item.key) enqueue(member, `cluster-retry(${job.item.clusterId})`);
                      }
                    }
                  }
                };
                await Promise.all(Array.from({ length: Math.min(3, fetchQueue.length) }, worker));
```

</details>

**依据 5 · 源码核查**：[lib/research.js:1062-1110](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/research.js#L1062-L1110)

段落重排与body/时间/unknown独立性字段。

<details>
<summary>查看原文（49行）</summary>

```text
                  const tokens = queryTokens(`${args.question} ${item.source.title || ""}`);
                  const ordered = lightFilter(windows, tokens);
                  const rerankSlots = Math.max(0, budget.rerankWindowMax - budget.rerankWindowUsed); // 窗口侧独立账目
                  const chosen = ordered.slice(0, Math.min(perDocRerankCap, rerankSlots));
                  if (state.rerankKey && chosen.length && budgetAllows(budget, "rerankWindow")) {
                    budgetUse(budget, "rerankWindow", chosen.length);
                    const scores = await callRerank(args.question, chosen.map((w) => compactWindowRep(w)), state.rerankKey);
                    if (scores) {
                      rerankOkB = true;
                      topScore = Math.max(...scores);
                      kept = chosen.map((w, i) => ({ w, s: scores[i] ?? 0 })).sort((a, b) => b.s - a.s || a.w.pos - b.w.pos).slice(0, WIN_KEEP_PER_DOC).map((x) => x.w);
                    }
                  }
                  if (!rerankOkB) kept = ordered.slice(0, WIN_KEEP_PER_DOC); // 轻筛顺序兜底（含无 key/失败）
                }
                bodyDocs.push({ item, fetch, kept, windows: windows.length, rerankOkB, topScore, bi });
              }

              // token 预算逐篇分配（按重排后的文档顺序消费，剩余均分；超限窗由 assembleWindowText 标注省略）
              const totalTokenBudget = depth * 1500;
              let tokenRemaining = totalTokenBudget;
              const documents = [];
              for (const bd of bodyDocs) {
                const share = tokenRemaining / Math.max(1, bodyDocs.length - documents.length);
                const { text, used, omitted } = assembleWindowText(bd.kept, share);
                tokenRemaining = Math.max(0, tokenRemaining - used);
                const plan = foldPlans.find((p) => p.repIdx === bd.bi); // 折叠组代表：正文尾注成员清单
                let content = text || "(no window selected from body)";
                if (plan) {
                  content += `\n\n[+${plan.memberIdx.length} folded member(s) into this cluster (cos>${BODY_FOLD_THRESHOLD}): ${plan.memberIdx.map((i) => bodyEntries[i].item.source.url).join(", ")}]`;
                }
                documents.push({
                  url: bd.item.source.url,
                  title: bd.item.source.title || "",
                  kind: "body",
                  text_origin: "original",
                  engine_hits: engineHitsOf(bd.item.source),
                  published: bd.item.source.publishedAt ? `${bd.item.source.publishedAt} (source: engine result)` : "unknown",
                  updated_at: bd.fetch.updatedAt || "",
                  fetched_at: bd.fetch.fetchedAt,
                  round: 1,
                  cluster: bd.item.clusterId || bd.item.semanticCluster || "",
                  independence: "unknown",
                  tier: bd.fetch.tier,
                  cache: Boolean(bd.fetch.cache),
                  truncated: bd.fetch.truncated || omitted > 0,
                  content,
                });
              }
```

</details>

**依据 6 · 源码核查**：[lib/research.js:1135-1156](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/research.js#L1135-L1156)

snippet-only明确分层。

<details>
<summary>查看原文（22行）</summary>

```text
              // 6) snippet-only 文档：未抓取的候选以引擎摘要入契约（绝不标 body）
              for (const c of candidates) {
                if (fetchedResults.has(c.key)) continue;
                documents.push({
                  url: c.source.url,
                  title: c.source.title || "",
                  kind: "snippet-only",
                  text_origin: "original", // 搜索引擎摘录的原文片段；provider-summary 留给 AIHOT 类内容源适配器
                  engine_hits: engineHitsOf(c.source),
                  published: c.source.publishedAt ? `${c.source.publishedAt} (source: engine result)` : "unknown",
                  updated_at: "",
                  fetched_at: new Date().toISOString(), // 摘要随本次搜索获得
                  round: 1,
                  cluster: c.clusterId || c.semanticCluster || "",
                  independence: "unknown",
                  tier: "snippet",
                  cache: false,
                  truncated: false,
                  content: c.source.snippet || "(no snippet)",
                });
              }

```

</details>

**依据 7 · 源码核查**：[lib/research.js:1316-1351](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/research.js#L1316-L1351)

notEvaluated/预算notes/输出与字符估token。

<details>
<summary>查看原文（36行）</summary>

```text
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
              out.estimatedTokens = estimateTokens(
                out.sources.map((s) => s.title + s.snippet).join("") + out.documents.map((d) => d.content).join("")
              );
              return out;
            } finally {
              clearTimeout(deadlineTimer);
            }
          },
```

</details>

**依据 8 · 源码核查**：[lib/research.js:1193-1204](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/research.js#L1193-L1204)

补搜传升级池声明。

<details>
<summary>查看原文（12行）</summary>

```text
                      // 升级池补搜（用户定案 2026-10-05）：第二轮不重复主池，engine=multi + engines 清单并发升级池引擎；
                      // 禁用/无 key/冷却的引擎由 index.js runMultiSearch 自动跳过；搜索调用仍受 searchRequestsMax 约束，firecrawl 不绕过其模块限流。
                      const escalation = resolveEscalationEngines(typeof escalationEngines === "function" ? escalationEngines() : undefined);
                      state.notes.push(
                        `rewrite escalation pool: [${escalation.join(", ")}] — second-round engines from the escalation pool (primary pool not re-queried; search calls still capped at searchRequestsMax=${budget.searchRequestsMax})`
                      );
                      budgetUse(budget, "search");
                      try {
                        const r2 = await provider.search({ query: picked.query, maxResults: 8, engine: "multi", engines: escalation }, budget.controller.signal);
                        const r2Used = enginesFromNote(r2.content);
                        if (r2Used.length) state.notes.push(`rewrite engines used: [${r2Used.join(", ")}] (escalation pool after skipping disabled/keyless/failed engines)`);
                        // 二轮候选合并：键去重（与首轮 items 之外的新 URL）；升级池引擎名注入 seenIn（engine_hits 不依赖首轮 Note）
```

</details>

**依据 9 · 源码核查**：[lib/index.js:4524-4529](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L4524-L4529)

实际multi未透传request.engines。

```text
        if (typeof runMultiSearch !== "function") throw new Error("multi search is not initialized");
        try {
          const multi = await runMultiSearch({ query: request.query, maxResults: request.maxResults, timeRange: request.timeRange });
          const providerSources = (multi.sources ?? []).map(({ seenIn, ...source }) => source);
          const cached = { ...multi, sources: providerSources, provider: "multi_search", engine: "multi" };
          if (cacheKey !== null) {
```

**依据 10 · 源码核查**：[lib/rerank.js:12-39](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/rerank.js#L12-L39)

真实rerank/embed出站与失败null。

<details>
<summary>查看原文（28行）</summary>

```text
export async function rerank(query, documents, apiKey) {
  if (!apiKey || !documents?.length) return null;
  try {
    const r = await httpsJson("POST", `${SF_URL}/rerank`, {
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "BAAI/bge-reranker-v2-m3", query, documents: documents.map(String), return_documents: false }),
      timeoutMs: 15000,
    });
    if (r.status !== 200) return null;
    const out = new Array(documents.length).fill(0);
    for (const item of JSON.parse(r.text).results || []) out[item.index] = item.relevance_score ?? 0;
    return out;
  } catch { return null; }
}

/** BAAI/bge-m3 向量。返回向量数组；失败返回 null。 */
export async function embed(texts, apiKey) {
  if (!apiKey || !texts?.length) return null;
  try {
    const r = await httpsJson("POST", `${SF_URL}/embeddings`, {
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "BAAI/bge-m3", input: texts.map(String) }),
      timeoutMs: 15000,
    });
    if (r.status !== 200) return null;
    const data = JSON.parse(r.text).data || [];
    return texts.map((_, i) => data.find((d) => d.index === i)?.embedding).filter(Boolean);
  } catch { return null; }
```

</details>

#### 缺口

- 未运行所有研究阶段、rewrite门/embedding全算法、内容真实/独立性或模型费用。
  **影响**：可以整理证据元数据但不能把工具输出当已回答问题/独立核验。
  **进一步探讨**：选已知一原始页/一转载/一抓取失败样本，核body/snippet/tier/engine归属与实际源；补搜须看真请求而非notes。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 外发、浏览器执行和预算/取消边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

查询会发往实际选中的外部引擎，回退/key轮换/多源可能扩大接收方；model explicit-only设计不等任何回退都无付费，keyless/有key路径和云抓取各依配置。credentials.resolve优先，再设置和env；写凭据/自更新是额外控制面，非搜索只读语义。来源/敏感查询必须先分类，不将秘密发搜索或调试日志。blockedDomains是内容结果/抓取过滤，不是网络SSRF防火墙。

fetch质量链先https直连，失败可探测固定路径系统Chrome/Edge并spawn headless --dump-dom，临时profile且--no-sandbox，会执行网页JS；后续可用key发云抓取。httpsGetFollow按hostname/port直连并跟重定向，所读实现未对私网/loopback/DNS重绑定逐跳限制，也未设正文解压总字节上限；只允许初始https不等安全目的地/小资源。未作恶意页/SSRF复现，必须视为含代码执行与网络权限的抓取，不给“本地只读文本”保证；首次禁用fetch takeover和research，另审后才允许可信公共URL。

普通搜索可透外部signal，但fetchHtml在response头回来后已清timer和abort监听，随后response.text不在这段保护内；不能给整个正文12秒硬界。multi调用不接signal，runEngineTest也不传，Promise.race总预算不abort已发请求。research90秒controller可约束部分抓取排队/外呼，但multi实际扇出不继承，rerank/embed/decision有各自timeout未接研究controller。searchRequests预算计provider.search一次而内部可多引擎/重试，不是实际HTTP或现金12次硬上限。浏览器有abort/killTree清理但下载/付费已发生不能回滚；工具execute未接Host调用取消参数，不能承诺用户取消后全部停。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:4376-4394](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L4376-L4394)

真实credentials/settings/env来源与key轮换。

<details>
<summary>查看原文（19行）</summary>

```text
  const resolveApiKey = async (envName, settingsKey, peek = false) => {
    let raw = "";
    const credentials = getCredentials();
    if (credentials) {
      try {
        const resolved = await credentials.resolve(envName);
        if (resolved?.value) raw = resolved.value;
      } catch {}
    }
    if (!raw) {
      const cfg = current();
      if (settingsKey && cfg[settingsKey]) raw = cfg[settingsKey];
      else raw = process.env[envName] ?? "";
    }
    if (!raw) return "";
    const ring = ringFor(envName, raw);
    const picked = pickKeyFromRing(ring, peek, (key) => cooldowns.isCooling(keyCooldownId(envName, key)));
    if (picked) {
      rememberSecret(picked);
```

</details>

**依据 2 · 源码核查**：[lib/fetch_provider.js:299-362](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/fetch_provider.js#L299-L362)

真实fetch质量阶梯/初始https/浏览器/云回退。

<details>
<summary>查看原文（64行）</summary>

```text
    id: "fs-quality-fetch",
    /** 廉价本地可用性检查（seam 契约要求，禁止网络调用）。 */
    available() { return true; },
    async fetch(request, signal) {
      const url = String(request?.url || "");
      if (!/^https:\/\//i.test(url)) throw new Error(`fs-quality-fetch: only https URLs are supported (got "${url.slice(0, 60)}")`);
      const errors = [];

      // T1：直连（文本类内容；二进制交给后层——exa 取正文，PDF 等仍由 firecrawl 处理）
      try {
        const r = await httpsGetFollow(url, { headers: browserishHeaders(acceptLanguage()), signal });
        if (r.status < 400 && TEXTUAL.test(r.contentType) && r.text.length >= T1_MIN_CHARS) {
          return { url: r.url, statusCode: r.status, body: { kind: "html", content: r.text }, truncated: false };
        }
        if (r.status >= 400) errors.push(`direct HTTP ${r.status}`);
        else errors.push(`direct: ${r.contentType || "unknown type"} ${r.text.length}B`);
      } catch (e) { errors.push(`direct: ${e.message}`); }

      // T1.5：系统浏览器无头渲染（执行 JS 过挑战，抓直连拿不到的页面；无浏览器自动跳过）
      const browserPath = findSystemBrowser();
      if (browserPath) {
        try {
          const html = await browserDumpDom(browserPath, url, { signal });
          if (html && html.length >= T1_MIN_CHARS && !/403 Forbidden|\bcaptcha\b/i.test(html.slice(0, 3000))) {
            return { url, statusCode: 200, body: { kind: "html", content: html }, truncated: false };
          }
          errors.push(html ? `browser: short or challenge page (${html.length}B)` : "browser: no output (timeout or launch failure)");
        } catch (e) {
          errors.push(`browser: ${e.message}`);
        }
      }

      // T2：exa contents（$1/1000 页）——直连失败（反爬/JS/过短）时承接；firecrawl 额度保护：仅在本层失败后才走 T3
      const exaKey = await resolveApiKey("EXA_API_KEY", "exaApiKey").catch(() => undefined);
      if (exaKey) {
        try {
          const text = await callExa(url, exaKey, signal);
          if (text.trim().length >= T1_MIN_CHARS) return { url, statusCode: 200, body: { kind: "text", content: text }, truncated: false };
          errors.push("exa: short content");
        } catch (e) { errors.push(`exa: ${e.message}`); }
      }

      const firecrawlKey = await resolveApiKey("FIRECRAWL_API_KEY", "firecrawlApiKey").catch(() => undefined);
      if (firecrawlKey) {
        try {
          const md = await callFirecrawl(url, firecrawlKey, signal);
          if (md.trim().length >= T1_MIN_CHARS) return { url, statusCode: 200, body: { kind: "text", content: md }, truncated: false };
          errors.push("firecrawl: short content");
        } catch (e) { errors.push(`firecrawl: ${e.message}`); }
      }

      const crawl4aiKey = await resolveApiKey("CRAWL4AI_API_KEY", undefined).catch(() => undefined);
      if (crawl4aiKey) {
        try {
          const text = await callCrawl4ai(url, crawl4aiKey, signal);
          if (text.trim().length >= T1_MIN_CHARS) return { url, statusCode: 200, body: { kind: "text", content: text }, truncated: false };
          errors.push("crawl4ai: short content");
        } catch (e) { errors.push(`crawl4ai: ${e.message}`); }
      }

      logger?.warn?.(`fs-quality-fetch: all tiers failed for ${url}: ${errors.join("; ")}`);
      throw new Error(`fs-quality-fetch: could not fetch ${url} (${errors.join("; ")})`);
    },
  };
```

</details>

**依据 3 · 源码核查**：[lib/fetch_provider.js:44-77](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/fetch_provider.js#L44-L77)

真实headless参数含no-sandbox及临时profile。

<details>
<summary>查看原文（34行）</summary>

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
    } catch {
      if (tmpDir) try { rmSync(tmpDir, { recursive: true, force: true }); } catch { /* 忽略 */ }
      resolve(null);
      return;
    }
    let out = "";
    let done = false;
    // 杀整棵进程树：Edge/Chrome 是多进程架构，child.kill() 只杀主进程会残留渲染子进程
```

</details>

**依据 4 · 源码核查**：[lib/fetch_provider.js:79-126](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/fetch_provider.js#L79-L126)

浏览器真实进程树kill/超时/abort处理。

<details>
<summary>查看原文（48行）</summary>

```text
    //      另：spawn 的失败是异步 'error' 事件，同步 try/catch 抓不到——不挂监听器会升级成
    //      uncaughtException 把 dsh 宿主整个带走，所以 taskkill 必须挂 on("error") 并 unref。
    const killTree = () => {
      const fallback = () => { try { child.kill("SIGKILL"); } catch { /* 忽略 */ } };
      if (process.platform !== "win32") {
        try { process.kill(-child.pid, "SIGKILL"); } // 组已退出时 ESRCH，交给 fallback
        catch { fallback(); }
        return;
      }
      try {
        const killer = spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { windowsHide: true, stdio: "ignore" });
        killer.on("error", fallback);
        killer.unref();
      } catch {
        fallback();
      }
    };
    const finish = (ok) => {
      if (done) return;
      done = true;
      killTree();
      if (tmpDir) {
        // 浏览器进程退出后才能删 profile 目录；延迟清理，失败无所谓
        setTimeout(() => { try { rmSync(tmpDir, { recursive: true, force: true }); } catch { /* 忽略 */ } }, 500);
      }
      resolve(ok && out.length > 0 ? out : null);
    };
    child.stdout.on("data", (c) => {
      if (out.length < 5 * 1024 * 1024) out += c.toString("utf8");
    });
    // stderr 必须 pipe 且读取丢弃：Windows 上 Edge 无头模式 stderr 指向 NUL 会卡死（实测 exit=1/0 输出）
    child.stderr.on("data", () => {});
    child.on("error", () => finish(false));
    // 以 exit 为准：Edge/Chrome 的渲染子进程会继承 stdout pipe，"close" 可能迟迟不触发；
    // 稍等 200ms 让残余数据 flush 到齐（exit 与 stdout 到达之间有窗口）。
    child.on("exit", (code) => {
      setTimeout(() => finish(code === 0 || out.length > 0), 200);
    });
    setTimeout(() => finish(false), timeoutMs);
    if (signal) {
      if (signal.aborted) finish(false);
      else signal.addEventListener("abort", () => finish(false), { once: true });
    }
  });
}

// #88：按声明的 charset 解码。GBK/GB2312/Big5/Shift_JIS 老站很常见，
// 一律当 UTF-8 会得到整页 \uFFFD，而且不会报错、不会降级，模型直接吃一页乱码。
```

</details>

**依据 5 · 源码核查**：[lib/fetch_provider.js:193-258](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/fetch_provider.js#L193-L258)

真实直连/重定向/解压与缓冲，无此处私网门。

<details>
<summary>查看原文（66行）</summary>

```text
      if (settled) return;
      let target;
      try {
        target = new URL(current);
      } catch (error) {
        settle(false, error);
        return;
      }
      const req = transport.request(
        {
          hostname: target.hostname,
          port: target.port || (target.protocol === "http:" ? 80 : 443),
          path: target.pathname + target.search,
          method: "GET",
          headers,
          timeout: timeoutMs,
        },
        (res) => {
          activeRes = res;
          if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && left > 0) {
            res.resume();
            return hop(new URL(res.headers.location, current).toString(), left - 1);
          }

          const enc = String(res.headers["content-encoding"] || "").toLowerCase();
          let stream = res;
          try {
            if (enc.includes("br")) stream = res.pipe(zlib.createBrotliDecompress());
            else if (enc.includes("gzip")) stream = res.pipe(zlib.createGunzip());
            else if (enc.includes("deflate")) stream = res.pipe(zlib.createInflate());
          } catch {
            stream = res;
          }
          activeStream = stream;

          const chunks = [];
          // 压缩响应的解压流感知不到上游 res 的销毁：pipe 不转发 error/close，
          // 对端中途断连时解压流既不 end 也不 error，Promise 会永久挂起（#87）。
          // 因此 body 的失败必须从 res 侧判定，并主动销毁解压流。
          const bodyGone = (reason) => {
            if (settled) return;
            try {
              stream.destroy?.();
            } catch {
              // 忽略
            }
            settle(false, reason instanceof Error ? reason : new Error(String(reason)));
          };
          res.on("aborted", () => bodyGone(new Error("connection aborted while reading the response body")));
          res.on("error", (error) => bodyGone(error));
          res.on("close", () => {
            if (!res.complete) bodyGone(new Error("connection closed before the response body completed"));
          });

          stream.on("data", (chunk) => chunks.push(chunk));
          stream.on("end", () =>
            settle(true, {
              url: current,
              status: res.statusCode,
              text: decodeBody(Buffer.concat(chunks), res.headers["content-type"] || ""),
              contentType: res.headers["content-type"] || "",
            })
          );
          stream.on("error", (error) => settle(false, error));
        }
      );
```

</details>

**依据 6 · 源码核查**：[lib/index.js:738-763](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L738-L763)

fetch头后清timer与abort再读正文。

<details>
<summary>查看原文（26行）</summary>

```text
async function fetchHtml(url, signal, acceptLang) {
  // 单次请求超时 12s，避免挂起被当成 Connection error
  let response;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    const onAbort = () => controller.abort();
    signal?.addEventListener("abort", onAbort);
    response = await fetch(url, {
      headers: { "user-agent": USER_AGENT, "accept-language": acceptLang ?? activeAcceptLanguage },
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error(`connection error: ${error?.message ?? String(error)}`);
  }
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} from ${url.split("?")[0]}`);
  }
  const html = await response.text();
  // DuckDuckGo 反爬验证页检测（HTTP 202 或验证关键字）
  if (response.status === 202 || /anomaly|captcha|unusual traffic|robot check/i.test(html.slice(0, 4000))) {
    throw new Error("DuckDuckGo is rate-limited right now (anti-bot challenge, usually temporary) - Bing works");
```

</details>

**依据 7 · 源码核查**：[lib/index.js:4524-4529](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L4524-L4529)

multi无caller signal透传。

```text
        if (typeof runMultiSearch !== "function") throw new Error("multi search is not initialized");
        try {
          const multi = await runMultiSearch({ query: request.query, maxResults: request.maxResults, timeRange: request.timeRange });
          const providerSources = (multi.sources ?? []).map(({ seenIn, ...source }) => source);
          const cached = { ...multi, sources: providerSources, provider: "multi_search", engine: "multi" };
          if (cacheKey !== null) {
```

**依据 8 · 源码核查**：[lib/index.js:5149-5176](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L5149-L5176)

runEngineTest不传搜索取消。

<details>
<summary>查看原文（28行）</summary>

```text
  const runEngineTest = async (engine, query, timeRange, maxResults = 2) => {
    const cfg = current();
    // #72：runEngineTest 也被 multi_search 工具 / 设置页 bridge 直接调用，
    // 不经过 provider.search，所以这里必须自行设置活动黑名单
    setActiveBlockedDomains(cfg.blockedDomains);
    const q = query || "DeepSeek Harness";
    const n = Math.min(Math.max(Number(maxResults) || 2, 1), 20);
    const tr = parseTimeRange(timeRange);
    const attempt = async () => {
      switch (engine) {
        case "ddg":
          return await searchDdgHtml(q, n, { ...cfg, timeRange: tr });
        case "ddg-lite":
          return await searchDdgLite(q, n, { ...cfg, timeRange: tr });
        case "bing":
          return await searchBing(q, n, cfg);
        case "searxng":
          return await searchSearxng(q, n, { ...cfg, timeRange: tr, searxngBearerToken: await resolveApiKey("SEARXNG_BEARER_TOKEN", "searxngBearerToken") });
        case "degoog":
          return await searchDegoog(q, n, {
            ...cfg,
            timeRange: tr,
            lang: searchLanguage(configLanguage(cfg)),
            degoogApiKey: await resolveApiKey("DEGOOG_API_KEY", "degoogApiKey"),
          });
        case "anysearch": {
          const key = await resolveApiKey("ANYSEARCH_API_KEY", "anysearchApiKey");
          return await searchAnysearch(q, n, undefined, key);
```

</details>

**依据 9 · 源码核查**：[lib/index.js:5428-5448](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L5428-L5448)

race等待而非abort在飞。

<details>
<summary>查看原文（21行）</summary>

```text
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
    }
    const rawResults = [];
```

</details>

**依据 10 · 源码核查**：[lib/research.js:94-128](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/research.js#L94-L128)

研究预算定义/内部controller。

<details>
<summary>查看原文（35行）</summary>

```text
// ---------- 契约 2.5 预算（可执行不等式） ----------

export const DEADLINE_MS = 90_000; // 覆盖排队/请求/回退/整理；到点取消在途、排队与回退任务不再启动
export const SEARCH_REQUESTS_MAX = 12; // 全部搜索调用（含回退/重试）
export const RERANK_CANDIDATE_MAX = 12; // Stage A 候选
export const RERANK_WINDOW_MAX = 48; // Stage B 窗口
export const RERANK_INPUT_MAX = RERANK_CANDIDATE_MAX + RERANK_WINDOW_MAX;

/** 预算对象：每次外呼前 budgetAllows() 检查、budgetUse() 计数；deadline 到点由 execute 的定时器置位并 abort。 */
export function makeBudget(depth, nowMs = Date.now()) {
  const fetchMax = ENABLE_REWRITE ? depth * 2 : depth; // firstRound + rewrite ≤ depth(+≤depth)；阶段一关闭补搜故 = depth
  return {
    deadlineAt: nowMs + DEADLINE_MS,
    fetchMax,
    searchRequestsMax: SEARCH_REQUESTS_MAX,
    fetchAttemptsMax: fetchMax + 4, // 含四层回退（direct/exa/firecrawl/crawl4ai）与重试的全部抓取尝试（契约 2.5 公式不变）
    rerankCandidateMax: RERANK_CANDIDATE_MAX,
    rerankWindowMax: RERANK_WINDOW_MAX,
    searchRequestsUsed: 0,
    fetchesUsed: 0, // 成功入账的文档数（≤ fetchMax）
    fetchAttemptsUsed: 0,
    rerankCandidateUsed: 0,
    rerankWindowUsed: 0,
    controller: new AbortController(),
    deadlineHit: false,
    exhausted: null, // 'searchRequests' | 'fetches' | 'fetchAttempts' | 'rerankCandidates' | 'rerankWindows'
    get rerankMax() {
      return RERANK_INPUT_MAX;
    },
    get rerankUsed() {
      return this.rerankCandidateUsed + this.rerankWindowUsed;
    },
    get expired() {
      return this.deadlineHit || Date.now() >= this.deadlineAt;
    },
```

</details>

**依据 11 · 源码核查**：[lib/research.js:909-917](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/research.js#L909-L917)

预算仅用一次search再调用multi。

```text
              // 1) 搜索：multi 模式并发 top-3 引擎融合（预算内；signal 取消在途）
              if (!budgetAllows(budget, "search")) {
                return { question: args.question, engines: "(budget exhausted)", estimatedTokens: 0, sources: [], documents: [], notes: [...state.notes, "budget_exhausted: search cap"] };
              }
              budgetUse(budget, "search");
              let search;
              try {
                search = await provider.search({ query: args.question, maxResults: 12, engine: "multi" }, budget.controller.signal);
              } catch (e) {
```

**依据 12 · 源码核查**：[lib/rerank.js:12-39](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/rerank.js#L12-L39)

模型请求有timeout未带研究signal。

<details>
<summary>查看原文（28行）</summary>

```text
export async function rerank(query, documents, apiKey) {
  if (!apiKey || !documents?.length) return null;
  try {
    const r = await httpsJson("POST", `${SF_URL}/rerank`, {
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "BAAI/bge-reranker-v2-m3", query, documents: documents.map(String), return_documents: false }),
      timeoutMs: 15000,
    });
    if (r.status !== 200) return null;
    const out = new Array(documents.length).fill(0);
    for (const item of JSON.parse(r.text).results || []) out[item.index] = item.relevance_score ?? 0;
    return out;
  } catch { return null; }
}

/** BAAI/bge-m3 向量。返回向量数组；失败返回 null。 */
export async function embed(texts, apiKey) {
  if (!apiKey || !texts?.length) return null;
  try {
    const r = await httpsJson("POST", `${SF_URL}/embeddings`, {
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "BAAI/bge-m3", input: texts.map(String) }),
      timeoutMs: 15000,
    });
    if (r.status !== 200) return null;
    const data = JSON.parse(r.text).data || [];
    return texts.map((_, i) => data.find((d) => d.index === i)?.embedding).filter(Boolean);
  } catch { return null; }
```

</details>

#### 缺口

- 未全审所有抓取协议/redirect/网络/沙箱和取消路径，未复现资源/SSRF/恶意页或真实扣费。
  **影响**：静态风险与限制非已利用漏洞，不能用预算名代替强制停/现金cap。
  **进一步探讨**：未来仅隔离环境假端点测迟到/解压上限/重定向/取消，先查进程/请求；真实查询只允许非敏感单源，不启浏览器/付费备用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 接管、设置、缓存和退出怎样恢复？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

主包真实registerSearchProvider id ddg和fetchProvider fs-quality-fetch；settings ready后，旧Host属性就地写，新volatile ref走settings.mutate持久web指定字段。搜索unset/官方默认会接管，显式其他provider不抢；fetch unset会接管，http且fetchProviderTakeover不为false也接管，因此只关fetch takeover还应确认不是unset。settings变更可再claim默认，安装就有配置迁移/接管副作用；并非用户点搜索后才生效。

接管写锁超时/缺settings只warn并等下次apply，不据日志保证生效；所读路径没保存原provider用于自动恢复，注册disposer也未在本函数显式汇总调用，Host上下文托管未审。停用前手工恢复正确search/fetch指定字段并保留其他web配置，再确认实际provider/Host运行；不要沿旧注释假定禁用天然回官方。

settings bridge POST gate允许loopback socket+Host、配置trusted/public Host或匹配local bind，检查Origin/site但非独立token/用户身份；非纯loopback UI。bridge还能credentials.set/unset与exec pnpm add latest自更新，需匹配Host认证与信任代理，首次不触这些写面。升级成功以进程结果/再查latest答updated并提示重启，未见精确落盘/功能后验，不等新版本可用。

短期搜索cache为进程Map；正文SQLite建库失败整体no-op，但put是DELETE再INSERT非显式transaction且运行期错误会抛，可能使已抓正文按失败处理，不能说任何缓存故障都透明。cooldown持久只保存有限until条目，auth等session无限冷却不落盘；temp/rename失败尽力warn且logger可能缺，重启后可能再试。退出还需查在飞浏览器/HTTP、敏感正文cache/冷却/凭据；卸载不删除数据或撤回外发。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:5045-5072](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L5045-L5072)

实际provider选择/旧属性/新ref及注册。

<details>
<summary>查看原文（28行）</summary>

```text
  const providerSelection = (web, key) => {
    const ref = web.config?.[key];
    if (ref !== undefined && ref !== null && typeof ref.get === "function") return { ref, current: ref.get() };
    return { ref: null, current: web[key === "searchProvider" ? "searchProviderId" : "fetchProviderId"] };
  };
  // ref 形态（rc.2+）把写入攒进 ops；属性形态（旧版）就地写。
  const takeOverOps = (web, key, id, ops) => {
    const { ref } = providerSelection(web, key);
    if (ref !== null) {
      ops.push({ op: "set", path: [key], value: id });
      return;
    }
    if (key === "searchProvider") web.searchProviderId = id;
    else web.fetchProviderId = id;
  };

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

**依据 2 · 源码核查**：[lib/index.js:5078-5139](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L5078-L5139)

接管条件、settings写入及失败。

<details>
<summary>查看原文（62行）</summary>

```text
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
      );
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
```

</details>

**依据 3 · 源码核查**：[lib/index.js:4957-4978](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L4957-L4978)

设置变化后可重claim默认。

<details>
<summary>查看原文（22行）</summary>

```text
    let reclaimAttempted = false;
    const reclaimOfficialDefaults = (next) => {
      if (reclaimAttempted) return;
      const config = next.config ?? {};
      const ops = [];
      if (config.searchProvider === "deepseek-official") takeOverOps(ctx.web, "searchProvider", provider.id, ops);
      if (
        (config.fetchProvider === "http" || config.fetchProvider === undefined) &&
        current().fetchProviderTakeover !== false
      ) {
        takeOverOps(ctx.web, "fetchProvider", fetchProvider.id, ops);
      }
      if (ops.length === 0) return;
      reclaimAttempted = true;
      const fields = [...new Set(ops.map((op) => String(op.path?.[0] ?? "?")))].join(" + ");
      Promise.resolve(sctx.settings.mutate("web", ops)).then(
        () =>
          logger.info(
            `free-search: DSH's search switch put the web providers back to the official defaults — re-took ${fields}.`
          ),
        (error) =>
          logger.warn(
```

</details>

**依据 4 · 源码核查**：[lib/index.js:3486-3511](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L3486-L3511)

bridge信任多个authority分支，非独立认证。

<details>
<summary>查看原文（26行）</summary>

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
}
```

</details>

**依据 5 · 源码核查**：[lib/index.js:3769-3779](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L3769-L3779)

真实POST gate。

<details>
<summary>查看原文（11行）</summary>

```text
  const guard = (req, res) => {
    if (!isBridgeRequestAllowed(req)) {
      writeJson(res, 403, { error: "requests must come from the local host or a configured trusted host" });
      return false;
    }
    if (req.method !== "POST") {
      writeJson(res, 405, { error: "method not allowed: " + (req.method ?? "") });
      return false;
    }
    return true;
  };
```

</details>

**依据 6 · 源码核查**：[lib/index.js:3735-3765](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L3735-L3765)

真实凭据写/删。

<details>
<summary>查看原文（31行）</summary>

```text
    async credentialsSet(request) {
      const credentials = getCredentials();
      if (!credentials) return { ok: false, code: "credentials-unavailable", message: "credentials service is not available" };
      const { key, value } = request ?? {};
      const ref = KEY_REF_MAP[key];
      if (!ref) return { ok: false, code: "credentials-rejected", message: `unknown credential key "${key}"` };
      if (typeof value !== "string" || value.trim().length === 0) {
        return { ok: false, code: "credentials-rejected", message: "value is required" };
      }
      try {
        await credentials.set(ref, value.trim());
        // 用户写入新 AnySearch key：允许下次请求再试（仅忽略同值坏 key，不删除存储）
        if (key === "anysearchApiKey") ignoredAnysearchKey = "";
        return { ok: true, value: { ref, set: true } };
      } catch (error) {
        return { ok: false, code: "credentials-write-failed", message: error instanceof Error ? error.message : String(error) };
      }
    },
    // 凭据中心：删除一个引擎 key
    async credentialsUnset(request) {
      const credentials = getCredentials();
      if (!credentials) return { ok: false, code: "credentials-unavailable", message: "credentials service is not available" };
      const { key } = request ?? {};
      const ref = KEY_REF_MAP[key];
      if (!ref) return { ok: false, code: "credentials-rejected", message: `unknown credential key "${key}"` };
      try {
        await credentials.unset(ref);
        return { ok: true, value: { ref, set: false } };
      } catch (error) {
        return { ok: false, code: "credentials-write-failed", message: error instanceof Error ? error.message : String(error) };
      }
```

</details>

**依据 7 · 源码核查**：[lib/index.js:3583-3614](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L3583-L3614)

真实pnpm升级/updated提示判据。

<details>
<summary>查看原文（32行）</summary>

```text
    async updatePlugin() {
      const mode = detectInstallMode();
      if (mode === null) {
        return { ok: false, code: "install-not-found", message: "could not locate dsh-free-search in any profile" };
      }
      if (mode.isLink) {
        return {
          ok: false,
          code: "local-link-mode",
          message: "local development install (symlink) - update the source repo instead (git pull), then restart dsh",
        };
      }
      try {
        const result = await new Promise((resolve, reject) => {
          exec("pnpm add dsh-free-search@latest", { cwd: mode.profileDir, timeout: 120000 }, (error, stdout, stderr) => {
            if (error) reject(new Error(`upgrade failed: ${(stderr || stdout || error.message).trim().slice(0, 300)}`));
            else resolve(stdout);
          });
        });
        const latest = await fetchLatestVersion();
        return {
          ok: true,
          value: {
            updated: true,
            latest: latest ?? "unknown",
            message: "upgraded to latest - restart dsh to apply",
            output: String(result).trim().slice(0, 200),
          },
        };
      } catch (error) {
        return { ok: false, code: "upgrade-failed", message: error instanceof Error ? error.message : String(error) };
      }
```

</details>

**依据 8 · 源码核查**：[lib/cache.js:10-34](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/cache.js#L10-L34)

SQLite启动失败no-op与DELETE/INSERT。

<details>
<summary>查看原文（25行）</summary>

```text
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
  return r;
}

export function put(url, title, content) {
  if (!db) return;
  db.prepare("DELETE FROM pages WHERE url = ?").run(url);
  db.prepare("INSERT INTO pages(url, title, content, fetched_at) VALUES (?, ?, ?, ?)").run(url, title || "", content, Date.now());
}

```

</details>

**依据 9 · 源码核查**：[lib/cooldown.js:118-133](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/cooldown.js#L118-L133)

有限冷却持久/tmp rename/失败告警。

<details>
<summary>查看原文（16行）</summary>

```text
    if (statePath === null) return;
    const stamp = now();
    const out = [];
    for (const [id, entry] of entries) {
      if (!Number.isFinite(entry.until) || entry.until <= stamp) continue;
      out.push({ id, until: entry.until, reason: entry.reason, cls: entry.cls });
    }
    try {
      fs.mkdirSync(path.dirname(statePath), { recursive: true });
      const temp = `${statePath}.${process.pid}.tmp`;
      fs.writeFileSync(temp, JSON.stringify({ version: 1, entries: out }), "utf8");
      fs.renameSync(temp, statePath);
    } catch (error) {
      logger?.warn?.(`free-search: could not persist cooldowns (${error?.message ?? error})`);
    }
  };
```

</details>

#### 缺口

- 未审当前Host认证/自动disposer、全部bridge设置写盘/升级/数据库恢复和所有冷却。
  **影响**：配置/注册/真实服务可分离，退出需验证而非默认恢复。
  **进一步探讨**：副本记接管前后配置/实际provider，保持其他web字段，回写原值再停包；cache禁写/DB锁只副本，核实际抓取和返回。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 怎样最小试用，免费和成本如何核？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

面向能核网页出处与外发范围的DSH用户，可隔离profile先备份完整web/本插件配置与凭据引用，固定0.9.32，选择一明确允许的无key搜索源、禁其他引擎/并发/research及不需工具，明确web.fetchProvider=http且fetchProviderTakeover=false，再核真实provider。一次非敏感公共事实查询，对照原Host/手工搜索，逐条读原页。显式engine不必然只发该源，需核disabled/allowlist/回退与实际网络；无法证明单源就不发敏感查询。

首次需网络/匹配Host与Node，部分引擎key/套餐或本机已登录CLI；SQLite可选，Node20虽可装却可能无持久正文cache。持续每引擎请求、回退重试/key轮换、正文云服务/模型重排/embedding/decision可能计费，浏览器进程/缓存占CPU内存磁盘，价格/额度/延迟/人工均未知。源码价格/免费额度注释是作者口径，不作为当前官方报价或实测现金。minSources/并发/90秒是有限策略非现金硬cap，多源命中同URL不等独立证据。

只在单源结果确有相对收益且接收方/预算清楚后单独审抓取/研究；默认质量链浏览器--no-sandbox不纳入首试。失败记录provider/实际源/cache/时间/部分结果，检查在飞请求和进程再重试。退出先恢复web两provider并核原搜索/抓取，再停插件、处理敏感cache/凭据和冷却；异常/费用/目标不明就退原Host或手工检索。本轮无外部查询/账号/浏览器/模型/安装。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:4546-4580](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L4546-L4580)

显式源仍有回退与配置过滤。

<details>
<summary>查看原文（35行）</summary>

```text
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

      let lastError = null;
      let usedEngine = null;
      let blockedFailure = null;
      // 首选引擎若被尝试后失败，记录失败详情（用于 Note）；multi 失败回退时沿用同一条通道
```

</details>

**依据 2 · 源码核查**：[lib/index.js:5078-5083](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L5078-L5083)

fetch接管条件要求确认非unset。

```text
    const ops = [];

    const fetchSelection = providerSelection(ctx.web, "fetchProvider");
    if (!fetchSelection.current || (fetchSelection.current === "http" && current().fetchProviderTakeover !== false)) {
      takeOverOps(ctx.web, "fetchProvider", fetchProvider.id, ops);
      logOnce(
```

**依据 3 · 源码核查**：[lib/fetch_provider.js:44-71](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/fetch_provider.js#L44-L71)

浏览器执行不作为首试。

<details>
<summary>查看原文（28行）</summary>

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
    } catch {
      if (tmpDir) try { rmSync(tmpDir, { recursive: true, force: true }); } catch { /* 忽略 */ }
```

</details>

**依据 4 · 源码核查**：[lib/research.js:874-903](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/research.js#L874-L903)

研究获取多类付费模型/抓取key。

<details>
<summary>查看原文（30行）</summary>

```text
          async execute(args) {
            const depth = Math.min(5, Math.max(1, Math.round(args.depth ?? 3)));
            const rulesIntent = judgeIntentRules(args.question);
            const budget = makeBudget(depth);
            const state = {
              notes: [],
              firecrawlUsed: 0,
              crawl4aiUsed: 0,
              exaKey: undefined,
              firecrawlKey: undefined,
              crawl4aiKey: undefined,
              rerankKey: undefined,
              decisionKey: undefined,
            };
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

              // 阶段二 #1：意图判定升级（decision key 可用时覆盖 task/breadth；失败静默保规则版）
```

</details>

**依据 5 · 源码核查**：[lib/cache.js:10-21](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/cache.js#L10-L21)

SQLite缺失则无持久缓存。

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

**依据 6 · 源码核查**：[lib/index.js:5428-5448](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L5428-L5448)

multi预算非在飞全部取消。

<details>
<summary>查看原文（21行）</summary>

```text
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
    }
    const rawResults = [];
```

</details>

#### 缺口

- 未核服务当前官方价格/账号额度、真实时延/效果/安装/恢复。
  **影响**：不推算免费/省钱/净节时，只有可控条件小试。
  **进一步探讨**：先非敏感单源记录真实外呼与出处，用户另核账户报价；相对收益不足或不能控接收方就停，不开更多引擎补漂亮结果。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 现有多源策略后还剩什么值得做？

**研究主题**：贡献与相对优势、新假设与验证

#### 完整回答

已有多源凭据筛选/并发上限/目标源数、域多样性重排/URL归一化、失败冷却及body/snippet证据契约，不能再把泛泛“按额度调整并发/避免同源”当新能力。贡献是这些机制进入DSH检索/研究闭环，而非上游索引/事实可靠性的创新。

剩余候选是贯穿provider→multi→单引擎/抓取/模型的真实外呼计数和取消上下文，输出已发/完成/取消待确认；请求预算在每次外呼前消费，等待超时不要写成全部已停，不以该收据保证云端不计费。对照现有deadline/race和手工账户记录，用一个快速源、一个迟到源、一个重试源假端点，测预算后的新请求数、取消后的在飞时长、有效独立出处和总费用/维护。若简单禁multi/固定单源已更可靠且效果不差，或共享计数引入误取消/漏算和大维护，则不做。未实现/实验，不计已有创新。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:5428-5448](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L5428-L5448)

multi等待预算与无abort的具体接缝。

<details>
<summary>查看原文（21行）</summary>

```text
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
    }
    const rawResults = [];
```

</details>

**依据 2 · 源码核查**：[lib/index.js:5149-5176](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L5149-L5176)

单引擎适配无共同signal。

<details>
<summary>查看原文（28行）</summary>

```text
  const runEngineTest = async (engine, query, timeRange, maxResults = 2) => {
    const cfg = current();
    // #72：runEngineTest 也被 multi_search 工具 / 设置页 bridge 直接调用，
    // 不经过 provider.search，所以这里必须自行设置活动黑名单
    setActiveBlockedDomains(cfg.blockedDomains);
    const q = query || "DeepSeek Harness";
    const n = Math.min(Math.max(Number(maxResults) || 2, 1), 20);
    const tr = parseTimeRange(timeRange);
    const attempt = async () => {
      switch (engine) {
        case "ddg":
          return await searchDdgHtml(q, n, { ...cfg, timeRange: tr });
        case "ddg-lite":
          return await searchDdgLite(q, n, { ...cfg, timeRange: tr });
        case "bing":
          return await searchBing(q, n, cfg);
        case "searxng":
          return await searchSearxng(q, n, { ...cfg, timeRange: tr, searxngBearerToken: await resolveApiKey("SEARXNG_BEARER_TOKEN", "searxngBearerToken") });
        case "degoog":
          return await searchDegoog(q, n, {
            ...cfg,
            timeRange: tr,
            lang: searchLanguage(configLanguage(cfg)),
            degoogApiKey: await resolveApiKey("DEGOOG_API_KEY", "degoogApiKey"),
          });
        case "anysearch": {
          const key = await resolveApiKey("ANYSEARCH_API_KEY", "anysearchApiKey");
          return await searchAnysearch(q, n, undefined, key);
```

</details>

**依据 3 · 源码核查**：[lib/research.js:909-917](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/research.js#L909-L917)

研究计一次provider非实际扇出。

```text
              // 1) 搜索：multi 模式并发 top-3 引擎融合（预算内；signal 取消在途）
              if (!budgetAllows(budget, "search")) {
                return { question: args.question, engines: "(budget exhausted)", estimatedTokens: 0, sources: [], documents: [], notes: [...state.notes, "budget_exhausted: search cap"] };
              }
              budgetUse(budget, "search");
              let search;
              try {
                search = await provider.search({ query: args.question, maxResults: 12, engine: "multi" }, budget.controller.signal);
              } catch (e) {
```

**依据 4 · 源码核查**：[lib/index.js:5539-5558](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/index.js#L5539-L5558)

域多样性排序已有不重复发明。

<details>
<summary>查看原文（20行）</summary>

```text
        }
      }
    }

    // #69 §4：排序信号重构。原状按 seenInSet.size 降序当第一排序键，等于把"多个引擎
    // 同时返回"当作可信度证明——但引擎可能共享索引与排序偏见，六条同域结果并不等于
    // 六个独立来源。现改为：域名多样性为主（轮转交错）、原始顺序次之、时效性仅在本次
    // 搜索带时间过滤时参与，seenIn 降为末位 tiebreak（保留为溯源/佐证元数据）。
    // 只重排、不剔除——过滤是 blockedDomains 的职责。
    const mergedEntries = Array.from(urlMap.values());
    const rankedOrder = rankMergedResults(
      mergedEntries.map((entry, index) => ({
        index,
        domain: domainOf(entry.source?.url),
        order: entry.order,
        corroboration: entry.seenInSet.size,
        publishedAt: entry.source?.publishedAt,
      })),
      { appliesFreshness: Boolean(parsedTimeRange) }
    );
```

</details>

**依据 5 · 源码核查**：[lib/research.js:1135-1156](https://github.com/DDDMUC/dsh-free-search/blob/da7f4d44f14feaa8e90829dd9038f7ef40e333e8/lib/research.js#L1135-L1156)

摘要/独立性标签已有。

<details>
<summary>查看原文（22行）</summary>

```text
              // 6) snippet-only 文档：未抓取的候选以引擎摘要入契约（绝不标 body）
              for (const c of candidates) {
                if (fetchedResults.has(c.key)) continue;
                documents.push({
                  url: c.source.url,
                  title: c.source.title || "",
                  kind: "snippet-only",
                  text_origin: "original", // 搜索引擎摘录的原文片段；provider-summary 留给 AIHOT 类内容源适配器
                  engine_hits: engineHitsOf(c.source),
                  published: c.source.publishedAt ? `${c.source.publishedAt} (source: engine result)` : "unknown",
                  updated_at: "",
                  fetched_at: new Date().toISOString(), // 摘要随本次搜索获得
                  round: 1,
                  cluster: c.clusterId || c.semanticCluster || "",
                  independence: "unknown",
                  tier: "snippet",
                  cache: false,
                  truncated: false,
                  content: c.source.snippet || "(no snippet)",
                });
              }

```

</details>

#### 缺口

- 未测真实外呼数量/费用与单源质量基线，未审全部适配能否传取消。
  **影响**：新方向只针对已见预算/取消差距，不保证独立来源/省钱。
  **进一步探讨**：先假端点抓实际请求账并对比单源，只有越界外呼减少且有效出处不降才实现小范围统一上下文。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
