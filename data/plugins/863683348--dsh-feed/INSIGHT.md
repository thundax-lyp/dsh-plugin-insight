# dsh-feed

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[bc59214](https://github.com/863683348/dsh-feed/tree/bc592147401c7697749390eb6a2a6cddd42af747)

<!-- BEGIN META -->
[![npm 30d 92](https://img.shields.io/static/v1?label=npm+30d&message=92&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-feed) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-feed)
<!-- END META -->

> **实现功能**：聚合GitHub topic与npm插件条目为本地JSON索引，提供搜索、统计、CLI和实验性MCP。

> **核心亮点**：作者定位开放聚合底座；实际增量是在宿主工具、CLI与极简MCP之间共享同一JSON索引和纯查询逻辑，降低下游重复抓取成本。相对人工浏览两个目录，能复用归一化数据；这是数据接入与接口整合，不是全生态语义理解或插件可用性验证。

> **风险与缺陷**：默认GitHub只读两页、npm只取100项，npm失败被catch为[]；合并键使用GitHub owner/repo与npm包名，通常不是同一身份，无法保证跨源去重。结果count和sources只表示此次得到条目，不能当完整生态覆盖或可安装数量。npm缺Star还被置0，混淆未知与真实0。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 场景与替代办法](#detail-section-2)
  - [1.2 能力、依赖与流程](#detail-section-3)
  - [1.3 成本与效果](#detail-section-4)
  - [1.4 工程亮点](#detail-section-5)
  - [1.5 用途与适用场景](#detail-section-6)
  - [1.6 能力、流程与成本](#detail-section-7)
  - [1.7 工程贡献](#detail-section-8)
  - [1.8 使用建议](#detail-section-9)
  - [1.9 核查说明与分析版本](#detail-section-10)
- [2 未来设计假设（未验证）](#detail-section-11)
- [3 辅助信息](#detail-section-12)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 场景与替代办法

替代是直接调用GitHub/npm API或浏览目录；本项目新增统一本地JSON和多入口，数据覆盖仍由有界抓取决定。

<a id="detail-section-3"></a>

### 1.2 能力、依赖与流程

lib/index.js注册feed_sync/search/stats；sync.js并行抓GitHub与npm并按名称键合并；query.js做英文词和中文二元组加权匹配；bin/dsh-feed.js复用这些函数提供CLI与逐行JSON-RPC。

- **模型工具**：feed_sync、feed_search、feed_stats
- **后台**：本地JSON索引及实验性stdio MCP

DSH tools/systemPrompt、Schemastery；显式sync访问GitHub搜索及npm registry，默认工作区.dsh/dsh-feed.json；CLI/MCP需Node运行时。

显式同步→写本地索引→本地搜索或统计→CLI/MCP读取同一文件；GitHub首屏失败抛错，npm失败可能静默形成局部索引。

<a id="detail-section-4"></a>

### 1.3 成本与效果

首次配置宿主peer依赖、索引目录及可选GitHub token；同步消耗API额度和网络，人工需核身份与失败覆盖，现金无固定服务费证据。开放JSON减少接入代码但不消除源维护。

共享数据形状有降低重复抓取的价值，无独立下游采用或准确率对照。

<a id="detail-section-5"></a>

### 1.4 工程亮点

查询与同步、存储、CLI分离，便于离线检查；MCP实现是逐行JSON解析和工具分派，不等同已通过完整MCP客户端兼容性验收。恢复覆盖与身份语义比扩展更多入口更值得先修。

源码依据：[lib/index.js](https://github.com/863683348/dsh-feed/blob/bc592147401c7697749390eb6a2a6cddd42af747/lib/index.js)、[lib/sync.js](https://github.com/863683348/dsh-feed/blob/bc592147401c7697749390eb6a2a6cddd42af747/lib/sync.js)、[lib/query.js](https://github.com/863683348/dsh-feed/blob/bc592147401c7697749390eb6a2a6cddd42af747/lib/query.js)、[bin/dsh-feed.js](https://github.com/863683348/dsh-feed/blob/bc592147401c7697749390eb6a2a6cddd42af747/bin/dsh-feed.js)。

<a id="detail-section-6"></a>

### 1.5 用途与适用场景

> **用途**：适合要在DSH之外复用插件发现数据的工具开发者；交付物是可检查的本地JSON索引。

<a id="detail-section-7"></a>

### 1.6 能力、流程与成本

**能力**

- **模型工具**：feed_sync、feed_search、feed_stats
- **后台**：本地JSON索引及实验性stdio MCP

> **思考**：默认GitHub只读两页、npm只取100项，npm失败被catch为[]；合并键使用GitHub owner/repo与npm包名，通常不是同一身份，无法保证跨源去重。结果count和sources只表示此次得到条目，不能当完整生态覆盖或可安装数量。npm缺Star还被置0，混淆未知与真实0。

<a id="detail-section-8"></a>

### 1.7 工程贡献

> **亮点**：作者定位开放聚合底座；实际增量是在宿主工具、CLI与极简MCP之间共享同一JSON索引和纯查询逻辑，降低下游重复抓取成本。相对人工浏览两个目录，能复用归一化数据；这是数据接入与接口整合，不是全生态语义理解或插件可用性验证。

<a id="detail-section-9"></a>

### 1.8 使用建议

适合把它作为候选索引接口试用。先检查本次覆盖页数和npm是否成功，再核实仓库与包的对应；搜索排序不能直接决定安装。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。已有贡献由固定版本源码支持，实际运行与宿主效果未验证；未来设计假设均未验证。

<a id="detail-section-10"></a>

### 1.9 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[863683348/dsh-feed](https://github.com/863683348/dsh-feed)
- **版本号**：0.1.0（[固定提交 bc592147](https://github.com/863683348/dsh-feed/tree/bc592147401c7697749390eb6a2a6cddd42af747)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

- 已检查：lib/index.js、lib/sync.js、lib/query.js、bin/dsh-feed.js、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定提交内列明源码和作者材料的有界抽读，静态inventory为组件范围；没有安装、执行目标代码或测试、发起插件服务请求、真实宿主验收或独立采用核实。
- 下一步：用注入假响应核对分页、npm失败、仓库与包异名，再在固定MCP客户端检查初始化通知与并发调用；本轮未执行目标代码。

<a id="detail-section-11"></a>

## 2 未来设计假设（未验证）

待验证假设：为每源加入覆盖范围、失败状态及仓库数字ID—包名映射，可让下游区分完整索引与局部结果。用同仓库不同包名、超过两页和npm失效输入，比较重复率与缺失报告；若身份来源不足，应保留未关联而不猜。

用注入假响应核对分页、npm失败、仓库与包异名，再在固定MCP客户端检查初始化通知与并发调用；本轮未执行目标代码。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：ac44c9bf9b8d84199cf93fccd51e320a2ae6ffb4142d38bcff35a61c6c187d54。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 5 | 537 | 441 | 70 | — |
| .md | source | 6 | 146 | — | — | 877 |
| .mjs | test | 1 | 61 | 54 | 2 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-12"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/863683348/dsh-feed/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
