# Market Research Cockpit

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[2d71054](https://github.com/theBigGavin/marketingdashboard/tree/2d71054d76bb78b82ddb7818af4bdff49a6179a7)

<!-- BEGIN META -->
[![GitHub ★ 450](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=450&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/theBigGavin/marketingdashboard)
<!-- END META -->

> **功能**：聚合行情、板块、新闻及市场研究数据，提供看板和 MCP 工具。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 汇集多个市场入口并提供 MCP；时效和实际收益未知。

> **主要限制**：[Q03](#research-q03) 资金流 fallback 调用涨跌排行，且通用 cached 丢弃新鲜度包装，不能一概当作实时同义数据。

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
  - [Q01 · 市场研究人员相对分别查询数据源获得什么？](#detail-section-11)
  - [Q02 · DSH 接入和服务端工具如何处理行情？](#detail-section-12)
  - [Q03 · 资金流失败和缓存降级会改变结果语义吗？](#detail-section-13)
  - [Q04 · 用户怎样约束使用条件和风险？](#detail-section-14)
  - [Q05 · 如何降低数据回退造成的指标误用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要同时查阅多市场行情与新闻的研究人员。

分别访问行情、新闻源或由用户自行维护 API 集成。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 行情 | 查看多市场报价 | 上游与时间需核验 |
| 资金流 | 获取资金流排行 | 失败时调用涨跌排行 |
| 新闻 | 查看快讯 | 来源可用性未测 |
| DSH 桥 | 远程调用公开工具 | 托管版本及可用性未知 |

**流程与依赖**

| 依赖 | 条件 | 作用 | 缺失影响 |
|---|---|---|---|
| DSH MCP 客户端 | DSH 接入需要 | 连接远端工具 | 工具不可用 |
| 托管端或自建 Node 服务 | 请求需要 | 聚合数据 | 无数据 |
| 上游行情接口与网络 | 实时数据需要 | 返回行情 | 回退或失败 |
| 可选 API 凭据 | 部分 AI 面板 | 授权查询 | 对应面板不可用 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 准备 | 用户选择可信部署及市场数据 | 核对时区和授权 |
| 请求 | Agent 调用所需 MCP 工具 | 检查错误与字段 |
| 复核 | 用户比对来源、单位及时间 | 缺失时不用于决策 |
| 整理 | 用户形成研究记录 | 标明来源与滞后 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | DSH、网络或自建 Node | 配置与来源核对 | 部署兼容未知 |
| 持续 | 上游请求和可选密钥 | 核实行情时间与语义 | 费用和延迟未知 |
| 故障 | 回退数据与日志 | 排查来源及语义 | 错误率未知 |

| 效果 | 材料 | 未知 |
|---|---|---|
| 多源入口 | DSH bundle 与 MCP 分派 | 托管可用性 |
| 缓存降载 | 在途复用与退避代码 | 实际时效 |
| 资金流回退 | 失败后切换排行 | 指标可比性 |

> **思考**：[Q03](#research-q03) 资金流 fallback 调用涨跌排行，且通用 cached 丢弃新鲜度包装，不能一概当作实时同义数据。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 汇集多个市场入口并提供 MCP；时效和实际收益未知。

[Q02](#research-q02) 共享在途缓存；[Q03](#research-q03) 返回旧值或切换指标需要消费方明确处理。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 资金流 fallback 调用涨跌排行，且通用 cached 丢弃新鲜度包装，不能一概当作实时同义数据。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 仅作研究线索并核对原始数据、时间与字段；发现数据过期或指标变化时停止使用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本局部静态检查，未运行服务或核验行情。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、server/mcp-server.cjs、server/lib/cache.cjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 DSH bundle、MCP 五项工具分派、资金流回退与通用缓存；未穷尽所有数据 handler、上游及部署配置。
- 下一步：固定服务版本注入上游失败并核对各工具数据字段与时间；本轮未执行。

**分析版本**

- **仓库**：[theBigGavin/marketingdashboard](https://github.com/theBigGavin/marketingdashboard)
- **版本号**：1.4.0（[固定提交 2d71054](https://github.com/theBigGavin/marketingdashboard/tree/2d71054d76bb78b82ddb7818af4bdff49a6179a7)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 统一指标来源、新鲜度和降级语义，需检验消费方及用户误判。

固定服务版本注入上游失败并核对各工具数据字段与时间；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 1419 | — | — | 17677 |
| .js | source | 4 | 155 | 143 | 8 | — |
| .tsx | source | 48 | 7448 | 6770 | 447 | — |
| .cjs | source | 30 | 4643 | 3707 | 781 | — |
| .cjs | test | 5 | 781 | 657 | 89 | — |
| .ts | source | 36 | 3656 | 2925 | 442 | — |
| .ts | test | 4 | 601 | 529 | 51 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/theBigGavin/marketingdashboard/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/theBigGavin/marketingdashboard/issues?q=is%3Aissue+created%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z) [![近30天关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/theBigGavin/marketingdashboard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH MCP 接入、市场数据回退和新鲜度边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 市场研究人员相对分别查询数据源获得什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

作者面向查看多市场行情、板块与新闻的研究者，React 看板集中展示多个来源，MCP 让 Agent 使用部分公开市场工具；原办法是分别打开行情网站和新闻源。本项目将来源聚合和调用包装在同一入口，但无法凭界面或接口存在证明报价实时、数据完整或研究绩效改善。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:31-48](https://github.com/theBigGavin/marketingdashboard/blob/2d71054d76bb78b82ddb7818af4bdff49a6179a7/README.md#L31-L48)

作者描述行情与聚合范围。

<details>
<summary>查看原文（18行）</summary>

```text
## ✨ Features

- **🌍 Global markets on one screen** — SSE / SZSE / Hang Seng / Dow / Nasdaq / S&P 500 / VIX / USD-CNY, with minute-level index charts side by side
- **🥇 Commodities & crypto** — NY gold/silver, London gold, SHFE gold, LME copper, crude oil, BTC — live prices with intraday curves
- **💵 US Treasury monitor** — 10Y / 2Y yields, 2s10s spread, yield-curve shape and its month-by-month history back to 2001
- **🔥 Sector heat radar** — Industry / concept sector rankings; click a sector to drill into constituents, leading stocks and money flow
- **💰 Money-flow tracking** — Top stocks by main-force net inflow, minute-level cumulative sector flow curves, hot / top-gainer / top-loser lists
- **⛓️ Industry-chain panorama** — Semiconductors, AI compute, EV, robotics, innovative drugs and more; upstream/midstream/downstream tickers linked to live quotes. Stock lists can be edited manually or fetched automatically from iwencai
- **🤖 AI cockpit** — OpenRouter daily rankings API tracking token-consumption trends of 50+ global LLM providers (7d–1y ranges), stacked-area share charts by provider/country/region, 60+ day long-range history
- **💹 LLM price-competition watch** — Four panels on a 2×3 grid: TTSI spend-index trend (weighted / closed-source / open-source price lines on a 0-based axis, multi-month full history from a local `ttsi.csv` CC BY 4.0 archive merged with the daily RSS tail), model price table (~400 models, sortable by intelligence / input / output / task cost), value scatter (intelligence index × task cost on a log axis, vendor colors), and a price-cut / share-shift event feed from TrakToken daily annotations
- **🪟 Earnings window (/fin)** — Earnings-season macro view: disclosure calendar (14-day rhythm bars + today's list), earnings forecasts (beat/miss stats bar + profit-range details), industry profit ranking (scale × momentum dual encoding), stock profit ranking (by amount / growth), plus per-company 12-quarter trends (revenue/profit bars + ROE/gross/net margin lines)
- **🏷️ Commodity prices page (/goods)** — Main-contract futures daily trends across 6 groups (precious / base / ferrous / energy-chem / agri / international energy) with 30d–365d ranges, plus Sunsirs spot quotes (accumulated daily) and spot–futures basis tables
- **📰 7×24 news flash** — Scrolling global financial news with auto-highlighted macro keywords and industry-chain mentions
- **🖥️ Installable desktop app** — Built-in PWA support (Web Manifest + Service Worker); install from the browser address bar and run in a standalone window
- **🍎 Native macOS app** — Swift WKWebView thin shell, follows the same pattern as Android TV
- **📺 Android TV app** — Native WebView shell (`android-tv/`) with D-pad spatial navigation, fullscreen panel zoom (proportional scaling + slideshow), split-flap ticker, tuned for legacy engines and weak GPUs
- **📱 iOS Scripting script** — TypeScript/TSX script (`scriptable/`, mirrored to `theBigGavin/mrd-scripting`) that wraps the cockpit in the Scripting app's WebView: TV mode via `?tv=1`, forced landscape, safe-area-free fullscreen, Liquid Glass exit button, local splash screen with the mrd logo (breathing animation) and a white-screen-free transition into the live dashboard
- **⚡ Zero-dependency data service** — Built-in Node proxy aggregates public market-data endpoints with in-memory caching; most endpoints need no API key and work out of the box
```

</details>

**依据 2 · 作者声明**：[README.md:237-253](https://github.com/theBigGavin/marketingdashboard/blob/2d71054d76bb78b82ddb7818af4bdff49a6179a7/README.md#L237-L253)

公开 MCP 入口。

<details>
<summary>查看原文（17行）</summary>

```text
## 🤖 MCP Server (Phase 1.5)

mrd ships a built-in **MCP server** so AI agents can call market data tools directly. No extra dependencies — it runs in the same Node.js process, reusing the shared `cached()` memory cache.

**Protocol**: [JSON-RPC 2.0](https://www.jsonrpc.org/specification) over [Streamable HTTP](https://modelcontextprotocol.io/docs/concepts/transports#streamable-http) (SSE for server→client pushes, POST for requests).

### Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/mcp` | Server metadata: version, tool list, resource list |
| `POST` | `/mcp` | JSON-RPC 2.0 request (initialize / tools/list / tools/call / ping …) |
| `GET` | `/mcp/stream` | SSE stream for server-initiated notifications |

### Authentication

No API key required for the public MCP tools. Private endpoints (`/api/mystery-select`, `/api/openrouter-usage`) are **not** exposed via MCP and require their own key configuration.
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:20-27](https://github.com/theBigGavin/marketingdashboard/blob/2d71054d76bb78b82ddb7818af4bdff49a6179a7/cordis.patch.yml#L20-L27)

DSH 远程 MCP 桥配置。

```text
- insert:
    - id: mcp-mrd
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: mrd
        transport: streamable-http
        url: https://mrd.hermes.cc.cd/mcp
        toolCallTimeoutMs: 180000
```

#### 缺口

- 未对照实时数据和人工研究流程
  **影响**：无法判断准确性、覆盖和效率
  **进一步探讨**：按固定标的和时间核对权威源及更新时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 接入和服务端工具如何处理行情？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

bundle 用官方 DSH MCP 客户端的 streamable-http 指向固定托管端点；仓库的 MCP 实现提供报价、板块、期货、资金流、新闻工具，分派到各自数据 handler。缓存层对命中复用在途结果，上游失败时可返回旧数据；cached() 会丢弃 cachedMeta 包装的 stale 和时间，因此并非所有调用都能依靠此层识别旧值。托管端的实际版本和可用性未检查。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:20-27](https://github.com/theBigGavin/marketingdashboard/blob/2d71054d76bb78b82ddb7818af4bdff49a6179a7/cordis.patch.yml#L20-L27)

托管 MCP 桥。

```text
- insert:
    - id: mcp-mrd
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: mrd
        transport: streamable-http
        url: https://mrd.hermes.cc.cd/mcp
        toolCallTimeoutMs: 180000
```

**依据 2 · 源码核查**：[server/mcp-server.cjs:122-155](https://github.com/theBigGavin/marketingdashboard/blob/2d71054d76bb78b82ddb7818af4bdff49a6179a7/server/mcp-server.cjs#L122-L155)

工具分派与 fallback。

<details>
<summary>查看原文（34行）</summary>

```text
// ---- 工具执行器 ----
async function callTool(name, args, ctx) {
  const { handleQuotes, handleBoards, handleBoardStocks, handleFutures,
          handleMoneyFlowEM, handleRank, handleNews, handleStockSearch } = ctx;
  switch (name) {
    case "get_quotes": {
      const codes = parseCsvParam(args.codes || "");
      if (!codes.length) return { error: "codes is required" };
      return handleQuotes(codes.join(","));
    }
    case "get_boards": {
      const type = args.type || "01";
      const dir = args.dir || "0";
      const n = args.n || "30";
      return handleBoards(type, dir, n);
    }
    case "get_futures": {
      const list = args.list || "hf_GC,hf_XAU,hf_SI,hf_CAD,hf_CL,hf_VX,nf_AU0,BTCUSDT";
      return handleFutures(list);
    }
    case "get_money_flow": {
      const n = args.n || "20";
      // 先试东财，失败回退新浪
      const em = await handleMoneyFlowEM(n).catch(() => null);
      if (em && em.length) return em;
      return handleRank("changepercent", "0", "5").catch(() => []);
    }
    case "get_news": {
      const page = args.page || "1";
      const size = args.size || "40";
      return handleNews(page, size);
    }
    default:
      return { error: `Unknown tool: ${name}` };
```

</details>

**依据 3 · 源码核查**：[server/lib/cache.cjs:56-91](https://github.com/theBigGavin/marketingdashboard/blob/2d71054d76bb78b82ddb7818af4bdff49a6179a7/server/lib/cache.cjs#L56-L91)

缓存、失败退避与无元数据包装。

<details>
<summary>查看原文（36行）</summary>

```text
      失败写回 failAt/failCount, 有旧数据降级返回(stale=true + ts=旧数据时间), 无旧数据抛错。
      stale 只描述"本次返回值是否来自旧数据"(上游失败降级), 与数据源自身口径无关 */
  async function cachedMeta(key, ttl, fn) {
    const now = Date.now();
    const hit = cache.get(key);
    if (hit) {
      if (hit.data !== undefined && now - hit.ts < (hit.ttl ?? ttl)) return { data: hit.data, ts: hit.ts, stale: false };
      if (hit.inflight) return hit.inflight; // 在途请求: 直接复用其结果(inflight 已解析为 { data, ts, stale })
      // 失败退避窗口内: 有旧数据降级返回, 无旧数据直接抛错 — 都不再打上游(负缓存)
      if (hit.failAt != null && now - hit.failAt < backoffOf(hit.failCount)) {
        if (hit.data !== undefined) return { data: hit.data, ts: hit.ts, stale: true };
        throw new Error("upstream degraded");
      }
    }
    const inflight = fn()
      .then((data) => {
        // fn 可返回 {__ttl, ...data} 覆盖缓存 TTL(降级/快照数据用短 TTL, 过期后重试上游)
        const effTtl = data && typeof data === "object" && data.__ttl ? data.__ttl : ttl;
        const store = data && typeof data === "object" && data.__ttl ? { ...data } : data;
        if (store && typeof store === "object" && "__ttl" in store) delete store.__ttl;
        set(key, entry(store, effTtl));
        return { data: store, ts: Date.now(), stale: false };
      })
      .catch((e) => {
        const c = cache.get(key);
        set(key, failEntry(c, ttl));
        if (c?.data !== undefined) return { data: c.data, ts: c.ts, stale: true }; // 出错回退到旧数据
        throw e;
      });
    set(key, { ts: hit?.ts || 0, data: hit?.data, inflight, ttl, failAt: hit?.failAt ?? null, failCount: hit?.failCount ?? 0 });
    return inflight;
  }

  /** 旧签名(仅取值): 绝大多数路由不需要新鲜度, 行为与改造前逐字节一致 */
  async function cached(key, ttl, fn) {
    return (await cachedMeta(key, ttl, fn)).data;
```

</details>

#### 缺口

- 未验证托管服务部署版本、数据源与输出新鲜度
  **影响**：无法保证 Agent 实际拿到对应结果
  **进一步探讨**：在受控环境固定版本比对各工具响应和 asof。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 资金流失败和缓存降级会改变结果语义吗？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

get_money_flow 首先调用东财资金流，失败或空结果后调用 handleRank("changepercent", "0", "5") 并在失败时返回空数组；这个分支调用的是涨跌幅排行，不能将其直接等同资金净流入排行。缓存 cached() 也只返回 data，可能不带 stale 元信息。具体 handler 的返回结构和上游状态需要再次核对，不能将全部 MCP 工具都认定为实时或同一质量。

#### 证据与依据

**依据 1 · 源码核查**：[server/mcp-server.cjs:142-152](https://github.com/theBigGavin/marketingdashboard/blob/2d71054d76bb78b82ddb7818af4bdff49a6179a7/server/mcp-server.cjs#L142-L152)

资金流来源及排行 fallback。

<details>
<summary>查看原文（11行）</summary>

```text
    case "get_money_flow": {
      const n = args.n || "20";
      // 先试东财，失败回退新浪
      const em = await handleMoneyFlowEM(n).catch(() => null);
      if (em && em.length) return em;
      return handleRank("changepercent", "0", "5").catch(() => []);
    }
    case "get_news": {
      const page = args.page || "1";
      const size = args.size || "40";
      return handleNews(page, size);
```

</details>

**依据 2 · 源码核查**：[server/lib/cache.cjs:58-67](https://github.com/theBigGavin/marketingdashboard/blob/2d71054d76bb78b82ddb7818af4bdff49a6179a7/server/lib/cache.cjs#L58-L67)

旧值及 stale 标记。

<details>
<summary>查看原文（10行）</summary>

```text
  async function cachedMeta(key, ttl, fn) {
    const now = Date.now();
    const hit = cache.get(key);
    if (hit) {
      if (hit.data !== undefined && now - hit.ts < (hit.ttl ?? ttl)) return { data: hit.data, ts: hit.ts, stale: false };
      if (hit.inflight) return hit.inflight; // 在途请求: 直接复用其结果(inflight 已解析为 { data, ts, stale })
      // 失败退避窗口内: 有旧数据降级返回, 无旧数据直接抛错 — 都不再打上游(负缓存)
      if (hit.failAt != null && now - hit.failAt < backoffOf(hit.failCount)) {
        if (hit.data !== undefined) return { data: hit.data, ts: hit.ts, stale: true };
        throw new Error("upstream degraded");
```

</details>

**依据 3 · 源码核查**：[server/lib/cache.cjs:79-91](https://github.com/theBigGavin/marketingdashboard/blob/2d71054d76bb78b82ddb7818af4bdff49a6179a7/server/lib/cache.cjs#L79-L91)

失败返回与 cached 丢弃包装。

<details>
<summary>查看原文（13行）</summary>

```text
      .catch((e) => {
        const c = cache.get(key);
        set(key, failEntry(c, ttl));
        if (c?.data !== undefined) return { data: c.data, ts: c.ts, stale: true }; // 出错回退到旧数据
        throw e;
      });
    set(key, { ts: hit?.ts || 0, data: hit?.data, inflight, ttl, failAt: hit?.failAt ?? null, failCount: hit?.failCount ?? 0 });
    return inflight;
  }

  /** 旧签名(仅取值): 绝大多数路由不需要新鲜度, 行为与改造前逐字节一致 */
  async function cached(key, ttl, fn) {
    return (await cachedMeta(key, ttl, fn)).data;
```

</details>

#### 缺口

- 未实测 fallback 返回结构及标注
  **影响**：无法确认调用者是否发现语义变化
  **进一步探讨**：在模拟上游失败时核查工具结果、指标单位、时间与来源。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 用户怎样约束使用条件和风险？

**研究主题**：效果与总成本、采用判断

#### 完整回答

用户可使用托管 MCP 或自行运行 Node 服务；依赖外部市场数据、网络及可选 API 凭据，费用、延迟和上游变更未知。托管模式会向服务发送用户请求的参数，运行行为和数据隐私未验证。用于研究时应核对标的、单位、时区与更新时间，并将交易决策交给有授权的原始数据与人工判断；若来源或新鲜度不可核实则停止使用结果。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:96-111](https://github.com/theBigGavin/marketingdashboard/blob/2d71054d76bb78b82ddb7818af4bdff49a6179a7/README.md#L96-L111)

Node、curl 和本地开发依赖。

<details>
<summary>查看原文（16行）</summary>

````text
## 🚀 Quick start

### Prerequisites

- Node.js 18+
- `curl` available on the system (used by some proxy endpoints)

### Local development

```bash
npm install     # or pnpm install
npm run dev
```

- Frontend dev server: <http://localhost:3000>
- Data proxy: <http://localhost:3001> (Vite proxies `/api` to it automatically)
````

</details>

**依据 2 · 作者声明**：[README.md:251-253](https://github.com/theBigGavin/marketingdashboard/blob/2d71054d76bb78b82ddb7818af4bdff49a6179a7/README.md#L251-L253)

公开与私有工具边界。

```text
### Authentication

No API key required for the public MCP tools. Private endpoints (`/api/mystery-select`, `/api/openrouter-usage`) are **not** exposed via MCP and require their own key configuration.
```

**依据 3 · 源码核查**：[cordis.patch.yml:20-27](https://github.com/theBigGavin/marketingdashboard/blob/2d71054d76bb78b82ddb7818af4bdff49a6179a7/cordis.patch.yml#L20-L27)

托管地址及超时。

```text
- insert:
    - id: mcp-mrd
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: mrd
        transport: streamable-http
        url: https://mrd.hermes.cc.cd/mcp
        toolCallTimeoutMs: 180000
```

**依据 4 · 源码核查**：[server/lib/cache.cjs:58-67](https://github.com/theBigGavin/marketingdashboard/blob/2d71054d76bb78b82ddb7818af4bdff49a6179a7/server/lib/cache.cjs#L58-L67)

可能回退历史数据。

<details>
<summary>查看原文（10行）</summary>

```text
  async function cachedMeta(key, ttl, fn) {
    const now = Date.now();
    const hit = cache.get(key);
    if (hit) {
      if (hit.data !== undefined && now - hit.ts < (hit.ttl ?? ttl)) return { data: hit.data, ts: hit.ts, stale: false };
      if (hit.inflight) return hit.inflight; // 在途请求: 直接复用其结果(inflight 已解析为 { data, ts, stale })
      // 失败退避窗口内: 有旧数据降级返回, 无旧数据直接抛错 — 都不再打上游(负缓存)
      if (hit.failAt != null && now - hit.failAt < backoffOf(hit.failCount)) {
        if (hit.data !== undefined) return { data: hit.data, ts: hit.ts, stale: true };
        throw new Error("upstream degraded");
```

</details>

#### 缺口

- 未测试实时价格、服务权限及恢复
  **影响**：无法确认生产环境时效和可用性
  **进一步探讨**：隔离测试上游故障并与授权行情对比。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何降低数据回退造成的指标误用？

**研究主题**：新假设与验证

#### 完整回答

已有缓存元数据和资金流 fallback 是设计依据；可以假设对每项 MCP 结果统一携带指标名称、来源、asof、stale 与降级原因，并在语义不等价时直接报错，能减少把旧数据或排行当资金流的误用。该假设尚未验证；通过注入失效和真实用户读数对照，测错误解释率、可用性及排障时间，若误判未降低或错误处理破坏必要工作流则否定。

#### 证据与依据

**依据 1 · 源码核查**：[server/mcp-server.cjs:142-147](https://github.com/theBigGavin/marketingdashboard/blob/2d71054d76bb78b82ddb7818af4bdff49a6179a7/server/mcp-server.cjs#L142-L147)

资金流的排行回退。

```text
    case "get_money_flow": {
      const n = args.n || "20";
      // 先试东财，失败回退新浪
      const em = await handleMoneyFlowEM(n).catch(() => null);
      if (em && em.length) return em;
      return handleRank("changepercent", "0", "5").catch(() => []);
```

**依据 2 · 源码核查**：[server/lib/cache.cjs:58-67](https://github.com/theBigGavin/marketingdashboard/blob/2d71054d76bb78b82ddb7818af4bdff49a6179a7/server/lib/cache.cjs#L58-L67)

缓存层已有时间和 stale。

<details>
<summary>查看原文（10行）</summary>

```text
  async function cachedMeta(key, ttl, fn) {
    const now = Date.now();
    const hit = cache.get(key);
    if (hit) {
      if (hit.data !== undefined && now - hit.ts < (hit.ttl ?? ttl)) return { data: hit.data, ts: hit.ts, stale: false };
      if (hit.inflight) return hit.inflight; // 在途请求: 直接复用其结果(inflight 已解析为 { data, ts, stale })
      // 失败退避窗口内: 有旧数据降级返回, 无旧数据直接抛错 — 都不再打上游(负缓存)
      if (hit.failAt != null && now - hit.failAt < backoffOf(hit.failCount)) {
        if (hit.data !== undefined) return { data: hit.data, ts: hit.ts, stale: true };
        throw new Error("upstream degraded");
```

</details>

#### 缺口

- 上游结果与现有消费方字段契约未全面审计
  **影响**：不能保证新标注可兼容或降低误判
  **进一步探讨**：先检查消费方并在受控故障下比较行为。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
