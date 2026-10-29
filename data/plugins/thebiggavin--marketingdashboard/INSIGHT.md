# Market Research Cockpit

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[f793de6](https://github.com/theBigGavin/marketingdashboard/tree/f793de6f9f9874c120585cd6f6b293333067fa46)

<!-- BEGIN META -->
[![GitHub ★ 427](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=427&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/theBigGavin/marketingdashboard)
<!-- END META -->

> **功能**：聚合股票、商品、资金流和新闻的市场看板，并通过 MCP 向 DSH 提供行情查询工具。

> **亮点**：同一套源适配器服务看板与 Agent，前端还将多个面板报价合并分发，减少接口和请求组织的重复；这支持集成价值，不能证明研究更准确或节时。见[Q01](#research-q01)、[Q03](#research-q03)。

> **主要限制**：get_money_flow 在东财空结果或失败时改返回涨幅榜且仍包装为成功内容，指标语义并未保持；缓存新鲜度也没有统一传播到 MCP。该源码边界会影响自动研究采用，未声称已在线复现。见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 它是真正的 DSH 插件还是行情服务，替代什么操作？](#detail-section-11)
  - [Q02 · 五个 MCP 工具如何连接数据源，失败时语义是否保持？](#detail-section-12)
  - [Q03 · 缓存、新鲜度和前端同帧能保证什么？](#detail-section-13)
  - [Q04 · 部署、运行与退出需要什么，成本效果如何判断？](#detail-section-14)
  - [Q05 · 能借鉴什么，可提出什么受约束的验证假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要跨市场整理材料的研究人员，可从统一看板和 MCP 查询取得候选信息；应核对指标与时间后再用于研究。见[Q01](#research-q01)。

基线是逐源网页查阅或分别接入接口。聚合入口省接线但增加公共源、托管和数据口径维护依赖；不创造行情数据。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| get_quotes | 按代码获取股票或外汇报价 | 依赖源可达与代码口径；实时性未验证 |
| get_boards | 查询板块涨跌排序 | 类型与排序参数需核对，不等于资金流 |
| get_futures | 获取期货与部分商品报价 | 各来源时间可能不同 |
| get_money_flow | 查询东财主力净流入 | 失败回退会变涨幅榜；不能无检查使用 |
| get_news | 获取快讯列表 | 源失败可能换快讯源，仍需查原始内容 |
| Web 看板与统一报价 | 多面板查看行情材料 | 需自托管或作者服务；同帧不等于同时点 |
| DSH MCP bundle | 配置宿主调用远端工具 | 调用远端而非本地新原生插件 |

**流程与依赖**

远端桥接依赖 DSH MCP client 和作者 endpoint，自托管依赖 Node、构建和网络源；AI 额外面板的凭据不能由“免 key”概括。条件详见[Q04](#research-q04)。

先选择部署责任，再核对工具清单、指标和时间；不能只以协议成功验收。详细步骤与退出见[Q04](#research-q04)。

**效果与成本**

部署、模型输入、故障排查及人工核对均有负担，金额和耗时未知；四阶段成本表见[Q04](#research-q04)。

统一入口和合并请求有机制依据，节时、准确率和单位合格材料成本没有实测；效果表见[Q04](#research-q04)。

> **思考**：get_money_flow 在东财空结果或失败时改返回涨幅榜且仍包装为成功内容，指标语义并未保持；缓存新鲜度也没有统一传播到 MCP。该源码边界会影响自动研究采用，未声称已在线复现。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：同一套源适配器服务看板与 Agent，前端还将多个面板报价合并分发，减少接口和请求组织的重复；这支持集成价值，不能证明研究更准确或节时。见[Q01](#research-q01)、[Q03](#research-q03)。

共享适配器、在途合并、失败退避和可选磁盘成功快照有复用价值；出口要保留语义元数据，否则各消费者仍会误读。固定语义信封的假设和否定条件见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

get_money_flow 在东财空结果或失败时改返回涨幅榜且仍包装为成功内容，指标语义并未保持；缓存新鲜度也没有统一传播到 MCP。该源码边界会影响自动研究采用，未声称已在线复现。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，不把资金流工具的正常协议响应直接当合格数据。后续先核对故障输出和新鲜度，遇指标变化、来源时间不明或空结果掩盖错误时退出该链，退回独立数据源。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

五工具与共享 handler 的源码接线已检查；资金流回退语义和出口新鲜度存在明确边界。远端部署、实时可用性与研究收益未验证，采用暂列观察。

- 已检查：作者 README、包清单、源码路径 package.json、README_CN.md、cordis.patch.yml、server/index.cjs、server/mcp-server.cjs、server/sources/eastmoney.cjs、server/lib/cache.cjs、server/lib/last-good.cjs、src/lib/market.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定提交的 bundle、包清单、MCP、资金流与涨幅适配器、缓存、成功快照和前端报价中心。未审计全部看板、托管私有层及所有数据源；未执行代码、联网行情查询或交易操作。
- 下一步：后续分别验证正常、空、断源、陈旧和降级样本；要求指标不变、时间来源可读，再比较同任务的合格材料数与纠错投入。

**分析版本**

- **仓库**：[theBigGavin/marketingdashboard](https://github.com/theBigGavin/marketingdashboard)
- **版本号**：1.4.0（[固定提交 f793de6](https://github.com/theBigGavin/marketingdashboard/tree/f793de6f9f9874c120585cd6f6b293333067fa46)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是用包含指标、来源、数据时间及降级原因的固定结果信封，并拒绝不同指标互相回退，可减少故障时的 Agent 事实误标。与直接报错比较误标、合格率和人工修正成本；更简单方案同样有效时停止复杂化。见[Q05](#research-q05)。

后续分别验证正常、空、断源、陈旧和降级样本；要求指标不变、时间来源可读，再比较同任务的合格材料数与纠错投入。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 1419 | — | — | 17677 |
| .js | source | 4 | 155 | 143 | 8 | — |
| .tsx | source | 48 | 7448 | 6770 | 447 | — |
| .cjs | source | 30 | 4634 | 3703 | 777 | — |
| .cjs | test | 5 | 781 | 657 | 89 | — |
| .ts | source | 36 | 3656 | 2925 | 442 | — |
| .ts | test | 4 | 601 | 529 | 51 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/theBigGavin/marketingdashboard/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/theBigGavin/marketingdashboard/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/theBigGavin/marketingdashboard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 接入口能否提供语义稳定、可核查新鲜度的行情材料？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它是真正的 DSH 插件还是行情服务，替代什么操作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

研究对象的主体是 React 前端加 Node 数据代理的市场研究看板，并附一个 DSH bundle，将宿主自带的 MCP client 配到作者托管的远端 /mcp。patch 没有注册新的本地 apply 实现，而是插入 @deepseek-ai/dsh-mcp-client，命名 mrd、使用 streamable-http、设置 180 秒工具超时。因此条目应按相关工具理解，附带 DSH 接入配置；不能把整个看板误写成在 DSH 进程内执行的原生行情插件。

作者面向同时查看股票、板块、商品、新闻和产业链的研究人员。可核对的任务是取得带代码和来源含义的行情材料，供人工或 Agent 比对后写研究笔记，而不是得到可直接执行的交易判断。简单基线是分别打开数据源页面，或给 Agent 单独接各数据接口。统一看板及五工具接口可减少入口和返回形态的差异；它不创造行情数据，也没有证明跨来源信息都同步、准确或有审计级血缘。

代码可确认服务器把同一组 handler 接到 MCP，并与 Web API 共用适配器。托管桥接让本地不必部署数据代理，却把可用性、版本更新与访问日志交给远端；自托管则需要自己维护 Node、前端构建、网络和源接口。package 标为 private，不能根据源码中的包版本推断存在可安装 npm 发布包。本次未访问作者演示和在线服务，源码版本与远端部署的对应关系未知。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-19](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/package.json#L1-L19)

private 应用和 build/start 脚本界定主体。

<details>
<summary>查看原文（19行）</summary>

```text
{
  "name": "my-app",
  "private": true,
  "version": "1.4.0",
  "type": "module",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "scripts": {
    "dev": "node server/dev.cjs",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "start": "node server/index.cjs",
    "test": "vitest run && node --test server/*.test.cjs"
  },
  "dependencies": {
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:20-27](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/cordis.patch.yml#L20-L27)

DSH 接入实际调用官方 MCP bridge 的远端服务。

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

**依据 3 · 源码核查**：[server/index.cjs:112-118](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/server/index.cjs#L112-L118)

MCP 直接注入现有数据 handler。

```text
// ---- MCP 层（Phase 1.5）: 同进程零依赖嵌入 ----
const { createMcpHandler } = require("./mcp-server.cjs");
const handleMcp = createMcpHandler({
  handleQuotes, handleBoards, handleBoardStocks, handleFutures,
  handleMoneyFlowEM, handleRank, handleNews, handleStockSearch,
  cache, cached,
});
```

**依据 4 · 作者声明**：[README_CN.md:49-59](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/README_CN.md#L49-L59)

作者对聚合面板与官方数据服务的定位。

<details>
<summary>查看原文（11行）</summary>

```text
金融数据工具大致分两类：**官方数据服务**（单一厂商出品、API 形态、需注册申请 Key，适合深度数据接入）和**聚合型面板**（多源公开数据聚合一屏、开箱即用，适合看盘与研究）。mrd 属于后者。两类并不互斥，但如果你想要的是「打开就能看」，差异在这五处：

| 维度 | 单一官方数据源 | mrd（聚合型面板） |
| --- | --- | --- |
| **数据广度** | 一家厂商的数据 | 腾讯 / 新浪 / 东方财富 / 华尔街见闻 / CNBC / Binance / 生意社等十余个公开源聚合一屏，A股 / 港股 / 美股 / 商品 / 美债同屏对照 |
| **可用性** | 上游服务挂了，就是挂了 | 缓存降级：服务端按接口 TTL 缓存 + 失败退避负缓存，上游抖动时仍展示最近一次可用数据；部分接口自动降级为浏览器直连 |
| **选股方式** | 清单式查询 | mystery_select 惊喜选股：一句概念 / 行业描述，筛出一组候选标的 |
| **上手成本** | 需注册官网、申请并保管 API Key | 零 Key 开箱即用：`npm start` 之后就是一屏行情（仅 AI 观察类面板可选配 Key） |
| **运维成本** | 自己接 API、自己搭展示层 | 开源自托管单进程即可跑；不想自己运维，托管版 Pro 正在筹备中 |

> 需要批量历史数据落库、合规审计级数据血缘的场景，官方数据服务更合适；需要一屏盯盘、跨市场对照、打开即用的场景，聚合型面板更合适。
```

</details>

#### 缺口

- 托管 endpoint 的运行版本未绑定本次提交
  **影响**：源码检查不能证明读者调用的是同一实现
  **进一步探讨**：后续取得部署版本标识并核对工具清单与服务响应。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 五个 MCP 工具如何连接数据源，失败时语义是否保持？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

MCP 的 tools/list 暴露 get_quotes、get_boards、get_futures、get_money_flow、get_news；tools/call 读取名称和参数后进入 callTool，返回值转成 JSON 文本放进 MCP content。报价按代码、板块按类型和排序、期货按列表、快讯按分页分别调用源适配器。工具定义和路由代码确实连接，并非只有 README 中的能力声明。本次没有实际连接 DSH 或请求行情源，运行可用性仍未知。

最影响采用的是 get_money_flow 的失败分支。工具描述承诺主力资金净流入排行，正常路径从东财按 f62 排序并输出 netIn/netRatio 等字段；但东财抛错或返回空数组时，MCP 分支调用 handleRank("changepercent", "0", "5")。handleRank 获取涨跌幅个股榜，映射价格、涨幅、成交额等字段，并不提供净流入。这还忽略用户 n，固定取 5 条。仓库中确实有新浪 handleMoneyFlow 的资金流实现，但 MCP 上下文没有注入并调用它。不能因注释写“回退新浪”就将涨幅榜当成资金流替代。

回退返回的非空普通数组仍会包装成成功 content，没有降级类型、数据口径变化或 isError 标识；再失败则吞错成空数组。因此 Agent 可能面对一个工具成功响应，却拿到不同统计对象或不明原因的空结果。这是固定源码中可确认的语义不保持分支，实际触发频率和远端部署是否包含它尚未复现。其他四个工具没有因此被证明无效，但不能用其正常入口推翻资金流边界。

错误形态也不统一。缺少代码或未知工具在 callTool 中返回 {error:...} 普通对象，tools/call 仍按普通结果转文本；真正抛错才变 JSON-RPC error。调用方需要解读内容而不能只以协议成功判定数据合格。对于自动生成研究段落的场景，先验证工具输出所代表的指标比“请求没报错”更重要。

#### 证据与依据

**依据 1 · 源码核查**：[server/mcp-server.cjs:87-99](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/server/mcp-server.cjs#L87-L99)

工具声明资金净流入及 n 参数。

<details>
<summary>查看原文（13行）</summary>

```text
  {
    name: "get_money_flow",
    description: "获取 A股主力资金净流入排行。东财主源，失败回退新浪。n=返回条数（默认20）。返回: 代码、名称、主力净流入、主力净流入占比。",
    inputSchema: {
      type: "object",
      properties: {
        n: {
          type: "string",
          description: "返回条数（默认20）",
          default: "20",
        },
      },
    },
```

</details>

**依据 2 · 源码核查**：[server/mcp-server.cjs:123-156](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/server/mcp-server.cjs#L123-L156)

实际五工具分派和资金流转涨幅榜分支。

<details>
<summary>查看原文（34行）</summary>

```text
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
  }
```

</details>

**依据 3 · 源码核查**：[server/sources/eastmoney.cjs:15-39](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/server/sources/eastmoney.cjs#L15-L39)

涨幅榜返回字段不含净流入。

<details>
<summary>查看原文（25行）</summary>

```text
  /* ---------------- 个股榜单(涨幅/跌幅/热门) — 新浪盘中 + 腾讯盘后双源 ---------------- */
  async function rankViaSina(sort, asc, want) {
    const fetchN = Math.min(100, Math.max(want * 3, 60));
    const url = `https://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodeData?page=1&num=${fetchN}&sort=${encodeURIComponent(sort)}&asc=${encodeURIComponent(asc)}&node=hs_a&symbol=&_s_r_a=page`;
    const arr = await fetchSinaJson(url);
    if (!Array.isArray(arr)) return [];
    return arr.filter((s) => num(s.trade) > 0).slice(0, want).map((s) => ({
      symbol: s.symbol,
      code: s.code,
      name: s.name,
      price: num(s.trade),
      change: num(s.pricechange),
      pct: num(s.changepercent),
      open: num(s.open),
      high: num(s.high),
      low: num(s.low),
      vol: num(s.volume),
      amount: num(s.amount), // 元
      pe: num(s.per),
      pb: num(s.pb),
      total_mv: num(s.mktcap), // 万元
      circ_mv: num(s.nmc), // 万元
      turnover: num(s.turnoverratio),
      time: s.ticktime,
    }));
```

</details>

**依据 4 · 源码核查**：[server/sources/eastmoney.cjs:73-98](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/server/sources/eastmoney.cjs#L73-L98)

handleRank 与真正新浪资金流函数是不同实现。

<details>
<summary>查看原文（26行）</summary>

```text
  async function handleRank(sort, asc, n) {
    const want = parseInt(n) || 30;
    try {
      const rows = await rankViaSina(sort, asc, want);
      if (rows.length) return rows;
    } catch { /* 新浪不可用则走腾讯 */ }
    return rankViaTencent(sort, asc, want);
  }

  /* ---------------- 新浪个股主力资金流(兜底) ---------------- */
  async function handleMoneyFlow(n) {
    const url = `https://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/MoneyFlow.ssl_bkzj_ssggzj?page=1&num=${n}&sort=netamount&asc=0`;
    const arr = await fetchSinaJson(url);
    if (!Array.isArray(arr)) return [];
    return arr.filter((s) => typeof s.name === "string" && s.name.trim()).map((s) => ({
      symbol: s.symbol,
      name: s.name,
      price: num(s.trade),
      pct: +(num(s.changeratio) * 100).toFixed(2),
      amount: num(s.amount),
      netIn: num(s.netamount), // 主力净流入(元)
      netRatio: +(num(s.ratioamount) * 100).toFixed(2),
      r0Net: num(s.r0_net), // 超大单净流入
      turnover: num(s.turnover),
    }));
  }
```

</details>

**依据 5 · 源码核查**：[server/sources/eastmoney.cjs:160-178](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/server/sources/eastmoney.cjs#L160-L178)

东财净流入正常结果具有 netIn/netRatio。

<details>
<summary>查看原文（19行）</summary>

```text
  async function handleMoneyFlowEM(n) {
    return emEnqueue(async () => {
      const fields = "f12,f14,f2,f3,f62,f184,f66,f6,f8";
      const url = `https://push2delay.eastmoney.com/api/qt/clist/get?fid=f62&po=1&pz=${n}&pn=1&np=1&fltt=2&invt=2&fs=${encodeURIComponent(EM_FS)}&fields=${fields}`;
      const diff = (await emGet(url))?.data?.diff || [];
      return diff
        .filter((s) => s.f14 && num(s.f2) > 0)
        .map((s) => ({
          symbol: emSymbol(s.f12),
          name: s.f14,
          price: num(s.f2),
          pct: num(s.f3),
          amount: num(s.f6), // 成交额(元)
          netIn: num(s.f62), // 主力净流入(元)
          netRatio: num(s.f184), // 主力净占比(%)
          r0Net: num(s.f66), // 超大单净流入
          turnover: num(s.f8),
        }));
    });
```

</details>

**依据 6 · 源码核查**：[server/mcp-server.cjs:209-230](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/server/mcp-server.cjs#L209-L230)

结果包装与异常形态。

<details>
<summary>查看原文（22行）</summary>

```text
      case "tools/call": {
        const { name, arguments: args = {} } = params;
        if (!name) return jsonrpcError(id, -32602, "Missing tool name");
        try {
          const result = await callTool(name, args, ctx);
          return jsonrpcResult(id, {
            content: [
              {
                type: "text",
                text: typeof result === "object" ? JSON.stringify(result, null, 2) : String(result),
              },
            ],
          });
        } catch (e) {
          return jsonrpcError(id, -32603, e?.message || "Tool call failed");
        }
      }

      case "resources/list":
        return jsonrpcResult(id, {
          resources: [
            { uri: "mrd://health", name: "健康状态", mimeType: "application/json" },
```

</details>

#### 缺口

- 未实际触发线上东财失败回退
  **影响**：不能报告已观测到 Agent 采用错误榜单
  **进一步探讨**：后续用固定 handler 替身分别返回正常、空与异常，核对结果契约；再核对部署版本。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 缓存、新鲜度和前端同帧能保证什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

缓存层的有界 Map、在途 Promise 合并和失败退避可减少重复上游请求。cachedMeta 在新鲜命中时返回 data/ts/stale，失败有旧值时标 stale=true，没有旧值就抛错。last-good 将成功快照保存在内存和磁盘，限制最大年龄，坏文件或过龄数据不伪造成功。适用于允许陈旧数据仍有参考价值、且调用方能识别陈旧的看板；不能由缓存存在推断上游当前可用或内容已核验。

元数据传播只在部分链路完整。旧 cached 签名直接取 cachedMeta.data，丢掉缓存层的 ts/stale。server/index 针对四类资金流 API 使用 freshness 包装，而 MCP 直接调用注入 handler，未统一经过该包装；MCP 最后又把值序列化为普通文本。因此不能将“Web API 部分端点带新鲜度”概括为五个 Agent 工具都具备统一新鲜度契约。上游数据源可能自带 time 字段，但这与代理采集时间、降级时间或行情交易时间不是同一语义。

前端 MarketHub 将订阅代码合并、按 5 秒节奏批量取值，更新同一份 entries 并通知各面板；这能减少同一报价在多个组件各自请求的差异。然而异步分组用 Promise.allSettled，失败分组被略过而旧 entries 保留；updated 写入本次接收的 now，不能据此证明上游交易时间同步。同帧显示是一种前端分发一致性，不是跨市场、跨数据类型的同时点快照。

本次没有做并发压力或断源运行验证，不能把作者“多用户友好”写成吞吐测试结果。可借鉴的结构是把缓存降级元数据显式返回给上层，但还需让 MCP 和所有消费者真正检查并展示；只在缓存内部计算而在出口丢弃，不能减少 Agent 对陈旧数据的误解。

#### 证据与依据

**依据 1 · 源码核查**：[server/lib/cache.cjs:55-91](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/server/lib/cache.cjs#L55-L91)

缓存层产生新鲜度，旧签名只返回 data。

<details>
<summary>查看原文（37行）</summary>

```text
  /** 读+写合一(路由层缓存, 带新鲜度): 新鲜命中 / inflight 合并 / 退避降级或负缓存;
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

**依据 2 · 源码核查**：[server/lib/last-good.cjs:6-25](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/server/lib/last-good.cjs#L6-L25)

磁盘快照年龄及损坏处理。

<details>
<summary>查看原文（20行）</summary>

```text
module.exports = function createLastGood({ fs, path, dir, maxAgeMs = 7 * 24 * 3600e3, writeThrottleMs = 60e3 } = {}) {
  const mem = new Map(); // key -> { data, at }
  const lastWrite = new Map(); // key -> 上次落盘时间(同 key 高频写盘节流)

  const fileOf = (key) => path.join(dir, `${String(key).replace(/[^\w.-]+/g, "_")}.json`);

  /** 读上次成功数据; 无快照/损坏/超龄(maxAgeMs)返回 null → 调用方如实报错, 不伪造 */
  function read(key) {
    const now = Date.now();
    const m = mem.get(key);
    if (m) return now - m.at < maxAgeMs ? m : null;
    try {
      const j = JSON.parse(fs.readFileSync(fileOf(key), "utf-8"));
      if (j && j.data !== undefined && now - (j.at || 0) < maxAgeMs) {
        mem.set(key, j);
        return j;
      }
    } catch { /* 无快照或损坏: 交给调用方按"无历史数据"处理 */ }
    return null;
  }
```

</details>

**依据 3 · 源码核查**：[server/index.cjs:149-163](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/server/index.cjs#L149-L163)

部分 API 的 freshness 封装。

<details>
<summary>查看原文（15行）</summary>

```text
// 数据新鲜度契约(四类资金流接口): 数据源 handler 返回 { data, stale, asof, source, partial? } 时,
// 路由用 freshness(payload, env) 包成 sentinel; 响应层把 stale/asof/source 平铺到信封(数组端点无法带字段)
// 或合并进 data(对象端点) —— 既有字段一个不动, 只做增量。env 为 cachedMeta() 的 { ts, stale }(缓存层降级)
function freshness(p, env) {
  const meta = {
    stale: !!(p && p.stale) || !!(env && env.stale),
    asof: (p && p.asof) ?? (env && env.ts) ?? null,
    source: (p && p.source) ?? null,
  };
  if (p && p.partial) meta.partial = true;
  let data = p && typeof p === "object" && "data" in p ? p.data : p;
  if (data && !Array.isArray(data) && typeof data === "object") {
    data = { ...data, stale: meta.stale, asof: meta.asof, source: meta.source };
  }
  return { __fresh: { data, meta } };
```

</details>

**依据 4 · 源码核查**：[server/index.cjs:270-283](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/server/index.cjs#L270-L283)

指定资金流路由使用封装。

<details>
<summary>查看原文（14行）</summary>

```text
  "/api/board-moneyflow": async (q) => {
    const env = await cachedMeta(`bmf:${q.get("code")}:${q.get("n")}`, 8000, () => boardMoneyFlow(q.get("code") || "", q.get("n") || "15"));
    return freshness(env.data, env);
  },
  // 个股资金流: 东财 ulist → 新浪全市场榜/个股日频; 取不到且无历史快照才报错
  "/api/stock-flow": async (q) => freshness(await stockFlow(q.get("code") || "", flowInflight)),
  "/api/stock-flows": async (q) => freshness(await stockFlows(q.get("codes") || "", flowInflight)),
  "/api/board-flow": async (q) => {
    const env = await cachedMeta(`bf:${q.get("n")}`, 120000, () => boardFlow(q.get("n") || "20"));
    return freshness(env.data, env);
  },
  // 个股所属板块: 东财 push2 f127/f128/f129 → 东财 datacenter-web F10 核心题材(行业/地域/概念)
  "/api/stock-boards": async (q) => {
    const env = await cachedMeta(`sb:${q.get("code")}`, 24 * 3600 * 1000, () => stockBoards(q.get("code") || ""));
```

</details>

**依据 5 · 源码核查**：[server/mcp-server.cjs:123-156](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/server/mcp-server.cjs#L123-L156)

MCP 直接调用 handler。

<details>
<summary>查看原文（34行）</summary>

```text
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
  }
```

</details>

**依据 6 · 源码核查**：[src/lib/market.ts:55-88](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/src/lib/market.ts#L55-L88)

批量异步分发、失败保留旧值与接收时间。

<details>
<summary>查看原文（34行）</summary>

```text
  const codes = [...refCounts.keys()];
  const stocks = codes.filter((c) => !isFuturesCode(c));
  const futures = codes.filter(isFuturesCode);
  const jobs: Promise<Record<string, { name?: string; price: number; pct: number; amount?: number; turnover?: number }>>[] = [];
  if (stocks.length) jobs.push(api.quotes(stocks));
  if (futures.length) jobs.push(api.futuresBatch(futures));
  const rs = await Promise.allSettled(jobs);
  const now = Date.now();
  let changed = false;
  for (const r of rs) {
    if (r.status !== "fulfilled") continue;
    for (const [code, q] of Object.entries(r.value)) {
      const next: HubQuote = {
        name: typeof q.name === "string" ? q.name : undefined,
        price: num(q.price),
        pct: num(q.pct),
        amount: q.amount != null ? num(q.amount) : undefined,
        turnover: q.turnover != null ? num(q.turnover) : undefined,
        updated: now,
      };
      const old = entries.get(code);
      if (!old || old.price !== next.price || old.pct !== next.pct || old.amount !== next.amount || old.turnover !== next.turnover) {
        entries.set(code, next);
        changed = true;
      }
    }
  }
  if (changed) emit();
  // TV 调试角标读取: 上次报价心跳时间与是否有变化(定位"面板不更新"是轮询死了还是行情静止)
  (window as unknown as { __hubStatus?: { t: number; changed: boolean } }).__hubStatus = { t: Date.now(), changed };
}

function onVisibility() {
  if (!document.hidden) tick();
```

</details>

#### 缺口

- MCP 各工具在真实源故障下的新鲜度字段覆盖未运行验证
  **影响**：无法据局部 freshness 设计宣称全部 Agent 输出可辨陈旧
  **进一步探讨**：逐工具记录正常、超时、旧缓存与空结果，并追到模型看到的最终内容。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署、运行与退出需要什么，成本效果如何判断？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

接入有两条路径。DSH bundle 默认连作者远端服务，依赖宿主内置 MCP client、网络和远端可用性；不需要在 DSH 内安装整套 React 数据代理。自托管则按仓库 build/start 脚本启动 Node 服务，部分源依赖系统 curl，AI 面板的私有数据可需要 API key。README 声明 Node 18+，本轮未安装依赖核实其与 Vite 7 等工具链的最低版本交集，不能把 README 的下界当已通过构建的环境。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH 的 MCP client 与远端 /mcp 网络 | DSH 默认入口必需 | 发现并调用五个工具 | 超时或协议不兼容时不能获得材料 |
| Node、前端构建及系统 curl | 自托管必需 | 服务数据代理与静态页面 | 构建、出网或部分适配器失败 |
| 各公开行情源的可访问性与接口稳定性 | 数据必需 | 获得行情、榜单和快讯 | 降级、错误或语义不同的回退 |
| AI 面板对应的 API key | 特定面板可选 | 额外 AI 统计 | 不能据“无 key”宣传推断全部面板无凭据 |
| 独立来源核对与时间口径检查 | 研究使用必需 | 判断材料是否可用于当前问题 | 工具成功不等于结果合格 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 选择 | 用户决定远端桥接或自托管 | 明确实际服务维护者与版本 |
| 配置 | DSH 加载 patch，或维护者构建并启动服务 | 工具清单与目标 endpoint 一致；本轮未验证 |
| 查询 | Agent 传代码、列表或分页参数 | 校验返回指标、字段、来源与时间 |
| 验收 | 用户与独立材料核对关键值 | 无法解释回退或陈旧时不纳入研究结论 |
| 退出 | 用户移除桥接配置，或停止自托管进程 | 保留需要的个人 watchlist 后清理部署；不删除外部数据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 远端费用政策、自己服务器费用未知 | 配 endpoint，或安装构建维护；耗时未知 | private 仓库包不等于 npm 发布 |
| 持续使用 | Agent 模型输入与服务资源，数额未知 | 复核时间、口径与来源 | 工具只聚合材料，不替代研究责任 |
| 失败恢复 | 重试、其他数据源或服务器资源未知 | 发现假成功、改用独立源、检查缓存 | 资金流失败可变成涨幅榜 |
| 迁移与退出 | 保存数据与替代服务成本未知 | 改 patch、停服务及迁移自选列表 | 公共缓存与个人数据应分别判断 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一访问 | 五工具连到服务 handler | DSH 实际连接与远端版本 |
| 减少重复请求 | 在途合并、缓存和前端统一报价结构 | 真实并发吞吐和节省比例 |
| 数据可靠性 | 部分端点标降级和数据时间 | MCP 全出口新鲜度及跨源一致性 |
| 研究效率 | 可减少分散接口接线 | 同任务合格率、纠错时间和总成本 |

采用结论为观察，尤其不建议把 get_money_flow 的内容直接写成资金流事实。一般看板场景仍可能有查阅价值，但 DSH 自动研究的关键条件是指标语义和降级状态可辨；当前源码缺口足以阻止直接推荐自动采用。用户可先在独立查询流程核对四种普通数据与资金流故障样本；出现字段变化、没有来源时间或空数组掩盖错误时停用该数据链，退回对应独立数据源。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:20-27](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/cordis.patch.yml#L20-L27)

默认远端桥接及超时。

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

**依据 2 · 作者声明**：[README_CN.md:91-115](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/README_CN.md#L91-L115)

作者自托管条件和步骤。

<details>
<summary>查看原文（25行）</summary>

````text
### 先决条件

- Node.js 18+
- 系统可用 `curl`（部分代理接口使用）

### 本地开发

```bash
npm install     # 或 pnpm install
npm run dev
```

- 前端开发服务器：<http://localhost:3000>
- 数据代理服务：<http://localhost:3001>（Vite 自动将 `/api` 代理过去）

### 生产部署

```bash
npm run build   # 构建到 dist/
# 可选：配置 API Key（AI 相关面板）
#   echo 'OPENROUTER_API_KEY=sk-or-v1-xxxx' > server/.env          # AI 观察用量面板
#   echo 'ARTIFICIAL_ANALYSIS_API_KEY=aa_xxxx' >> server/.env      # 大模型价格面板
# 可选：TTSI 全量历史 — 从 traktoken.com 下载 ttsi.csv 放到
# server/data/ttsi.csv（CC BY 4.0）；没有时趋势面板自动降级为 60 天 RSS 尾部
npm start       # 单进程启动，访问 http://localhost:3000
````

</details>

**依据 3 · 源码核查**：[package.json:1-19](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/package.json#L1-L19)

实际构建/启动入口和 private 状态。

<details>
<summary>查看原文（19行）</summary>

```text
{
  "name": "my-app",
  "private": true,
  "version": "1.4.0",
  "type": "module",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "scripts": {
    "dev": "node server/dev.cjs",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "start": "node server/index.cjs",
    "test": "vitest run && node --test server/*.test.cjs"
  },
  "dependencies": {
```

</details>

**依据 4 · 源码核查**：[server/index.cjs:112-118](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/server/index.cjs#L112-L118)

数据 handler 共享但由服务维护。

```text
// ---- MCP 层（Phase 1.5）: 同进程零依赖嵌入 ----
const { createMcpHandler } = require("./mcp-server.cjs");
const handleMcp = createMcpHandler({
  handleQuotes, handleBoards, handleBoardStocks, handleFutures,
  handleMoneyFlowEM, handleRank, handleNews, handleStockSearch,
  cache, cached,
});
```

**依据 5 · 源码核查**：[server/mcp-server.cjs:142-147](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/server/mcp-server.cjs#L142-L147)

资金流回退改变语义使采用受限。

```text
    case "get_money_flow": {
      const n = args.n || "20";
      // 先试东财，失败回退新浪
      const em = await handleMoneyFlowEM(n).catch(() => null);
      if (em && em.length) return em;
      return handleRank("changepercent", "0", "5").catch(() => []);
```

#### 缺口

- 没有同条件研究任务的时间、纠错和费用记录
  **影响**：不能断言聚合服务比逐源查阅更省总成本
  **进一步探讨**：选定研究笔记验收标准，对比相同数据问题下的两条流程。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能借鉴什么，可提出什么受约束的验证假设？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

可以借鉴的是“适配器共享，出口各自组织”与前端统一报价订阅。前者让 Web 和 Agent 避免重复维护同一供应商解析，后者把多个面板相同代码合并成一次查询。移植时需要同时保留指标单位、交易时间、采集时间、来源和陈旧原因；如果只复用 data 数组，各消费者仍可能产生不同解释。

由资金流回退变成涨幅榜及缓存元数据丢失推导一个未验证假设：所有工具采用固定语义结果信封，明确 metric、source、asof、fetched_at、stale、fallback_reason、complete，且禁止不同 metric 互相冒充回退，会减少 Agent 在上游故障时写错事实的机会。它只针对已查到的数据契约缺口，不是已有功能，也不保证需求成立或金融决策更好。

最小验证在固定正常、空、错误、陈旧和替代源样本中比较现有输出与结果信封，让相同 Agent 完成受约束的行情材料摘录。分别统计指标误标、陈旧值当当前值、无法解释的空结果、合格摘录、token 与人工修正时间。方案支持条件是误标减少、合格率不降且新增字段负担可接受；若模型仍忽略标记，或直接抛可解释错误同样可靠且更简单，就采用更简单方案，不继续扩建通用数据平台。真实源连通性需另测，不能由静态样本结果替代。

#### 证据与依据

**依据 1 · 源码核查**：[server/index.cjs:112-118](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/server/index.cjs#L112-L118)

适配器注入复用。

```text
// ---- MCP 层（Phase 1.5）: 同进程零依赖嵌入 ----
const { createMcpHandler } = require("./mcp-server.cjs");
const handleMcp = createMcpHandler({
  handleQuotes, handleBoards, handleBoardStocks, handleFutures,
  handleMoneyFlowEM, handleRank, handleNews, handleStockSearch,
  cache, cached,
});
```

**依据 2 · 源码核查**：[src/lib/market.ts:55-88](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/src/lib/market.ts#L55-L88)

统一报价中心。

<details>
<summary>查看原文（34行）</summary>

```text
  const codes = [...refCounts.keys()];
  const stocks = codes.filter((c) => !isFuturesCode(c));
  const futures = codes.filter(isFuturesCode);
  const jobs: Promise<Record<string, { name?: string; price: number; pct: number; amount?: number; turnover?: number }>>[] = [];
  if (stocks.length) jobs.push(api.quotes(stocks));
  if (futures.length) jobs.push(api.futuresBatch(futures));
  const rs = await Promise.allSettled(jobs);
  const now = Date.now();
  let changed = false;
  for (const r of rs) {
    if (r.status !== "fulfilled") continue;
    for (const [code, q] of Object.entries(r.value)) {
      const next: HubQuote = {
        name: typeof q.name === "string" ? q.name : undefined,
        price: num(q.price),
        pct: num(q.pct),
        amount: q.amount != null ? num(q.amount) : undefined,
        turnover: q.turnover != null ? num(q.turnover) : undefined,
        updated: now,
      };
      const old = entries.get(code);
      if (!old || old.price !== next.price || old.pct !== next.pct || old.amount !== next.amount || old.turnover !== next.turnover) {
        entries.set(code, next);
        changed = true;
      }
    }
  }
  if (changed) emit();
  // TV 调试角标读取: 上次报价心跳时间与是否有变化(定位"面板不更新"是轮询死了还是行情静止)
  (window as unknown as { __hubStatus?: { t: number; changed: boolean } }).__hubStatus = { t: Date.now(), changed };
}

function onVisibility() {
  if (!document.hidden) tick();
```

</details>

**依据 3 · 源码核查**：[server/mcp-server.cjs:142-147](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/server/mcp-server.cjs#L142-L147)

假设针对明确的指标替代分支。

```text
    case "get_money_flow": {
      const n = args.n || "20";
      // 先试东财，失败回退新浪
      const em = await handleMoneyFlowEM(n).catch(() => null);
      if (em && em.length) return em;
      return handleRank("changepercent", "0", "5").catch(() => []);
```

**依据 4 · 源码核查**：[server/lib/cache.cjs:89-91](https://github.com/theBigGavin/marketingdashboard/blob/f793de6f9f9874c120585cd6f6b293333067fa46/server/lib/cache.cjs#L89-L91)

元数据在旧出口丢弃。

```text
  /** 旧签名(仅取值): 绝大多数路由不需要新鲜度, 行为与改造前逐字节一致 */
  async function cached(key, ttl, fn) {
    return (await cachedMeta(key, ttl, fn)).data;
```

#### 缺口

- 结果信封改进方案未实现验证
  **影响**：只能提出可证伪设计方向
  **进一步探讨**：用固定故障样本先比较误标与纠错负担，再决定是否开发。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
