# dsh-search

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[24bc2e4](https://github.com/439436269-ctrl/dsh-search/tree/24bc2e4b985559fe05497530b5c4484bc9168d71)

<!-- BEGIN META -->
[![npm 30d 239](https://img.shields.io/static/v1?label=npm+30d&message=239&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@vfvrpq/dsh-search) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@vfvrpq/dsh-search)
<!-- END META -->

> **实现功能**：把 DeepSeek Search/Fetch 接口接入 DSH，支持结构化搜索与正文抓取。

> **核心亮点**：相对内置搜索入口，提供显式条数、正文预算、查询操作符和搜索加抓取组合；错误与正文节选可直接交给模型复核。上游检索与rerank能力不应归为插件原创。

> **风险与缺陷**：rerank与authority字段不是事实正确性保证；research只保留开头节选，可能丢失限定条件。billedRequests按成功抓取计数，网络失败自动重试可能已被服务端执行，插件无法证明账单精确等于该字段。README费用和QPS是作者主张，本次未独立核价。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 使用建议](#detail-section-5)
  - [1.5 核查说明与分析版本](#detail-section-6)
- [2 未来设计假设（未验证）](#detail-section-7)
- [3 辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：研究或开发用户先搜候选页面再读取正文，以原始URL为证据完成回答；交付应是可追溯原文依据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

参照内置web_search/web_fetch和手工API调用；没有上游同条件召回率实验。

三个工具将query过滤、HTTP认证重试、结果归一化分离；research先搜索再顺序抓前N页，保留每页fetchError与正文节选。


DeepSeek可用API key与网络端点、DSH工具注册；上游网页需可提取，无登录交互。

构建query与过滤，调用搜索获取结构化候选，按top顺序抓取并截断，回传来源与逐页错误；模型再对关键事实fetch原文。

现金为上游Search/Fetch请求费用，实际价格与结算需单独核实；人工包括原文核查、登录/SPA失败回退及结果反证，重试可能增加请求。

减少搜索与抓取的工具编排步骤；多条摘要和高分不能替代关键事实查证。

**能力**

- **模型工具**：deepseek_search、deepseek_fetch、deepseek_research

> **思考**：rerank与authority字段不是事实正确性保证；research只保留开头节选，可能丢失限定条件。billedRequests按成功抓取计数，网络失败自动重试可能已被服务端执行，插件无法证明账单精确等于该字段。README费用和QPS是作者主张，本次未独立核价。

<a id="detail-section-4"></a>

### 1.3 工程贡献

HTTP client独占key、超时、退避与状态错误翻译；工具独立文件，research逐页保留失败。可借鉴局部失败呈现，复用时不能把成功响应计数命名为确定账单。 源码依据：[lib/client.js](https://github.com/439436269-ctrl/dsh-search/blob/24bc2e4b985559fe05497530b5c4484bc9168d71/lib/client.js#L31)、[lib/tools/research.js](https://github.com/439436269-ctrl/dsh-search/blob/24bc2e4b985559fe05497530b5c4484bc9168d71/lib/tools/research.js#L17)、[lib/query.js](https://github.com/439436269-ctrl/dsh-search/blob/24bc2e4b985559fe05497530b5c4484bc9168d71/lib/query.js#L21)。

> **亮点**：相对内置搜索入口，提供显式条数、正文预算、查询操作符和搜索加抓取组合；错误与正文节选可直接交给模型复核。上游检索与rerank能力不应归为插件原创。

<a id="detail-section-5"></a>

### 1.4 使用建议

需要结构化公开网页材料的用户可评估；版本、价格和API字段回读原文，登录态或交互站点另用浏览器，先核实账户计费口径。

**核查状态**：已实现机制有源码支持；贡献价值为条件性解释，未来设计假设未验证。本轮仅作固定版本源码核查，未安装、运行目标代码或验收宿主。

<a id="detail-section-6"></a>

### 1.5 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[439436269-ctrl/dsh-search](https://github.com/439436269-ctrl/dsh-search)
- **版本号**：0.1.0（[固定提交 24bc2e4](https://github.com/439436269-ctrl/dsh-search/tree/24bc2e4b985559fe05497530b5c4484bc9168d71)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）
- **实际范围**：固定提交源码抽读与作者材料核查；没有执行目标代码、测试、安装或真实宿主验收，没有确认独立用户效果。
- **来源**：作者README与上述固定版本源码；未确认独立采用效果，目录收录与下载统计不作效果证据。

<a id="detail-section-7"></a>

## 2 未来设计假设（未验证）

待验证假设：将请求尝试数、成功响应数与未知结算状态分开，并允许基于问题定位正文段落，可改善预算预估与证据完整性；由重试与截断边界推导，需额外数据并可能增加抓取调用。

最小验证：代理注入服务端已完成但客户端超时的响应，比较尝试/成功/未知账单展示；另用关键限定在文末的页面测截断造成的事实遗漏，无法减少误判则否定。

<a id="detail-section-8"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 157 | — | — | 1549 |
| .js | source | 13 | 1001 | 622 | 312 | — |
| .js | test | 2 | 307 | 232 | 46 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-search/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-search/issues?q=is%3Aissue+created%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-search/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z)



统计日期：2026-10-22。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
