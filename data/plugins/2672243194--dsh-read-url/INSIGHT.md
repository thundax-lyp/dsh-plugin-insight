# URL 正文阅读器

> 读取网页、JSON 与订阅源，清理正文并提供分页续读和批量读取。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[57d9316](https://github.com/2672243194/dsh-read-url/tree/57d9316770af0d12d932c616c2bf22386d0314dc)

<!-- BEGIN META -->
[![GitHub ★ 22](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=22&color=yellow&logo=github&style=flat)](https://github.com/2672243194/dsh-read-url) · [![npm 30d 2642](https://img.shields.io/static/v1?label=npm+30d&message=2%2C642&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-read-url)
<!-- END META -->

**使用建议**：适合已有抓取结果噪声多、常需中文编码和续读的场景先对照使用；答案依赖表格或动态页面时核对原文与截断标记。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [核查说明与分析版本](#detail-section-5)
- [未来设计假设（未验证）](#detail-section-6)
- [辅助信息](#detail-section-7)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：研究者和开发者从文档、文章或 API 提取适量内容，交付保留来源及续读位置的正文；已能返回完整正文的宿主 web_fetch 是首选对照。

适合已有抓取结果噪声多、常需中文编码和续读的场景先对照使用；答案依赖表格或动态页面时核对原文与截断标记。

核查状态：源码支持本文所述机制与有限集成贡献；效果、宿主兼容和独立采用未验证。未来设计假设仅为推演，未实现、未验证。 只执行研究工程的统计/装配与结构验证，未安装插件、运行目标代码/测试或做真实宿主验收。

<a id="detail-section-3"></a>

### 能力、流程与成本

对照当前宿主提供方与简单 fetch/正文提取；未采用作者旧竞品表作为当前运行证据。

优先通过 ctx.web.fetch 获取已解码 html/text；只在服务缺失或 WEB_PROVIDER_UNAVAILABLE 时降级。正文提取、编码处理、分页串联与会话缓存共用 fetchResource；显式直连来源在跳转链持续限制 origin。


Node >=20；核心无 npm runtime依赖。ctx.web 可用性决定提供方内容；SPA/browser和代理回退的环境另有条件，不能把核心零依赖等同所有模式无需浏览器。显式直连配置需谨慎限定 origin。

模型调用 read_url/批量/链接/站点工具→选择 seam 或受限直连→解码和正文抽取→有限分页→截断返回；不足时按游标续读。错误保留 HTTP/provider 失败；插件 effect 清理会话缓存。

首次主要为网络与可选浏览器配置；持续成本包含分页额外请求、缓存过期和抽取误差的人工核对。节省token比例未在本轮实测。

可提高有限上下文下的资料密度，但密度不等于证据完整；收益需以相同问题的合格回答比较。

- **模型工具**：read_url、read_url_batch、read_url_links、read_url_site提供正文、续读与批量读取。

- **思考**：压缩输出可能把关键表格行、导航或分页上下文一起丢掉。作者旧版竞品表明确不适用于新 DeepSeek Fetch provider，不能据其推出当前优势；缓存、清理和额外分页也会影响新鲜度与耗时。

<a id="detail-section-4"></a>

### 工程贡献

fetchResource 集中保持路由边界和共享 AbortSignal，值得借鉴；大体量手写 HTML提取规则增加维护负担，复用需保留异常网页样本回归。

版本1.9.3，ESM主入口，Node>=20；README 的历史比较与作者网络测量只作作者报告。

固定源码依据：[index.js L358–409](https://github.com/2672243194/dsh-read-url/blob/57d9316770af0d12d932c616c2bf22386d0314dc/index.js#L358-L409)；[index.js L2680–2741](https://github.com/2672243194/dsh-read-url/blob/57d9316770af0d12d932c616c2bf22386d0314dc/index.js#L2680-L2741)。上述贡献与关键质疑均限定于这些固定源码，不把测试文件存在当运行通过。

- **亮点**：相对直接把整页传给模型，增量是内容类型归一、正文清理、按段落截断和可续读的组合。index.js:358-409 保留 provider 的 HTTP/策略错误，减少降级路径绕过上游规则；这比仅比较输出字符数更值得复用。

<a id="detail-section-5"></a>

### 核查说明与分析版本

- 版本依据：仓库：[2672243194/dsh-read-url](https://github.com/2672243194/dsh-read-url)；固定提交：[57d93167](https://github.com/2672243194/dsh-read-url/tree/57d9316770af0d12d932c616c2bf22386d0314dc)；版本号：1.9.3；版本日期：2026-10-19（固定提交日期，北京时间，非包发布日期）。
- 已检查与未覆盖范围：核查抓取路由、正文工具与SPA/代理模块；未对真实网站运行，未全覆盖手写HTML规则。
- 证据限制：作者功能摘要来自固定版本README；未核实独立用户采用、同条件效果或端到端收益。版本、证据原文与inventory绑定保存在本项JSON；GitHub/npm统计仅作背景，不构成采用证明。

<a id="detail-section-6"></a>

## 未来设计假设（未验证）

待验证假设：把被省略块和分页来源摘要随续读游标返回，可使研究任务按问题主动补读，而不是一味压缩。依据是已有 charsStart/returned 与来源截断标记，但正确性仍依赖抽取召回；需付出少量元数据 token。

最小验证与否定条件：固定 HTML文档、长表、GBK页面、RSS 和 provider text 各一组问题，对照原生 web_fetch；记录答案所需事实召回、输出token、请求数和总耗时。若短输出提高但关键事实召回下降，则不成立“同质量省token”。

<a id="detail-section-7"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1567 | — | — | 32828 |
| .mjs | source | 17 | 4955 | 4491 | 559 | — |
| .js | source | 3 | 3140 | 1542 | 1536 | — |

排除 0 项；解析错误 0 项。统计为固定Git范围，源码抽读不冒充全面审计；JS/TS与Markdown分别计量。默认排除为启发式，不能从LOC推算原创量或工时。

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/2672243194/dsh-read-url/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
