# model-usage-plugin

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[a8d1a44](https://github.com/AKS1st/model-usage-plugin/tree/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57)

<!-- BEGIN META -->
[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/model-usage-plugin) [![npm 30d 972](https://img.shields.io/static/v1?label=npm+30d&message=972&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/model-usage-plugin) [![最新发布 2026-09-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/model-usage-plugin)
<!-- END META -->

> **实现功能**：聚合模型用量、工具活动及按可配置单价估算的费用趋势。

> **核心亮点**：将缓存读写、失败调用、工具活动和时间台账组成消费观察链，并有价格迁移与用户配置保护；统计机制是接线和账本管理，不是新计费模型。

> **风险与缺陷**：费用依赖内置/自填价格、汇率和provider/套餐归属；TokenPlan只记token不计费不代表订阅经济成本为零。流包装只保留最后usage，依赖宿主usage为完整口径；工具按最近模型归因是启发式，不等于工具由该模型因果产生。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在DSH内理解模型消费结构，作预算线索而非财务账单。

参照供应商账单与宿主usage事件；增量是跨模型本地台账、价格配置、趋势与历史回填。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **事件监听**：llm/stream与session/event统计
- **后台**：用量台账、持久化与历史回填
- **Host 路由**：/__musage-stats快照和配置
- **界面**：消费/趋势/价格与余额设置

**流程与依赖**

llm/stream包装器透传chunk并记最后usage，session/event按最近会话模型归因工具调用；原子临时文件rename持久化，客户端按单价/峰谷/汇率算费用，路由提供快照及操作。

宿主webServer/timer和流式事件协议、可选sessionQuery/credentials；汇率来自外部API，余额查询可配置Base URL。

流式调用结束记usage→桶聚合/定时持久化→设置页选模型与价格→本地估算→可选历史回填、汇率与余额刷新。

**效果与成本**

本地同步JSON写入和历史扫描有I/O成本；汇率与余额有网络请求，价格维护持续；无自动节约token机制。

有消费可见性实现，无账单误差、节约金额或独立效果数据。

> **思考**：费用依赖内置/自填价格、汇率和provider/套餐归属；TokenPlan只记token不计费不代表订阅经济成本为零。流包装只保留最后usage，依赖宿主usage为完整口径；工具按最近模型归因是启发式，不等于工具由该模型因果产生。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将缓存读写、失败调用、工具活动和时间台账组成消费观察链，并有价格迁移与用户配置保护；统计机制是接线和账本管理，不是新计费模型。

将缓存读写、失败调用、工具活动和时间台账组成消费观察链，并有价格迁移与用户配置保护；统计机制是接线和账本管理，不是新计费模型。

流式透传finally记录、桶裁剪与临时rename可借鉴；route-security按Host/Origin hostname判定，未核socket，不能称强本机身份认证。

源码依据：[src/index.js](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/index.js)、[src/client.js](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/client.js)、[src/route-security.js](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/route-security.js)。

<a id="detail-section-5"></a>

### 1.4 主要限制

费用依赖内置/自填价格、汇率和provider/套餐归属；TokenPlan只记token不计费不代表订阅经济成本为零。流包装只保留最后usage，依赖宿主usage为完整口径；工具按最近模型归因是启发式，不等于工具由该模型因果产生。

<a id="detail-section-6"></a>

### 1.5 使用建议

作为估算面板使用，先校准provider、套餐和单价口径；正式费用以供应商账单核对。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[AKS1st/model-usage-plugin](https://github.com/AKS1st/model-usage-plugin)
- **版本号**：0.17.0（[固定提交 a8d1a444](https://github.com/AKS1st/model-usage-plugin/tree/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57)）
- **版本日期**：2026-09-14（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/index.js、src/client.js、src/route-security.js、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：固定合成事件核最后usage语义、回填幂等、时区边界、套餐和价格迁移；再在授权账单样本对账，本轮未调用网络或真实账户。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

未验证假设：每个费用单元带价格生效版本、usage口径与归因可信度，再与供应商账单对账，可降低预算误差。比较跨provider同名模型、缓存、套餐、中断和历史迁移，报告无法对账而非归零。

固定合成事件核最后usage语义、回填幂等、时区边界、套餐和价格迁移；再在授权账单样本对账，本轮未调用网络或真实账户。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：8022fa1cc96da49c854dfc769d994eb014b3cfdb457cce07fde926501f802f3f。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 519 | — | — | 7707 |
| .mjs | source | 3 | 1515 | 1194 | 260 | — |
| .js | source | 3 | 4034 | 3036 | 852 | — |
| .mjs | test | 8 | 2448 | 2012 | 275 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/AKS1st/model-usage-plugin/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
