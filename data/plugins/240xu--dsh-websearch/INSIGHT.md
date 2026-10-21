# dsh-websearch

> 为 DSH 提供聚合网页搜索 provider，合并多个后端结果并支持过滤、缓存和故障降级。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[72cbba8](https://github.com/240xu/dsh-websearch/tree/72cbba8e3c19c77fea2396c7ac00c40b08df52a9)

<!-- BEGIN META -->
[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/240xu/dsh-websearch) · [![npm 30d 4802](https://img.shields.io/static/v1?label=npm+30d&message=4%2C802&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@240xu/dsh-websearch) · [![首次发布 2026-08-22](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@240xu/dsh-websearch)
<!-- END META -->

**使用建议**：先选少量可访问后端，用常见中文与时效问题核对出处、耗时和全部调用预算；逐步增加有独立增益的服务。重要研究仍应打开原文核查，不能把聚合排序当事实验证。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
  - [源码索引](#detail-section-7)
- [未来设计假设（未验证）](#detail-section-8)
- [辅助信息](#detail-section-9)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

确认聚合、限流、软失败和排名融合的组合实现；后端免密钥、价格和可达性均不据README作当前承诺。未执行真实搜索或效果评测，自适应后端预算假设待验证。

[重点创新推演与最小验证](#innovation)

- **用途**：面向研究/开发问答中需要多个网络来源的DSH用户；合格检索是相关、可访问且支持任务的结果，而非返回链接数量多。

采用建议：先选少量可访问后端，用常见中文与时效问题核对出处、耗时和全部调用预算；逐步增加有独立增益的服务。重要研究仍应打开原文核查，不能把聚合排序当事实验证。

参照单后端搜索、人工多引擎搜索与成熟RRF融合；组合解决宿主多provider歧义和多源可用性，不等于来源独立审查。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **后台**：统一web搜索provider与多后端fan-out、融合、缓存和故障冷却

**流程与依赖**

必需DSH web服务和配置选择、各后端网络和可选credential；部分后端仅配置检查便标available，公共实例/MCP端点失效需替换或禁用。缓存、历史及健康状态也需按宿主作用域理解，未证明多profile隔离。

配置provider/后端→输入查询与过滤→缓存检查/可选多查询→并发限流执行→逐后端超时与错误记录→合并、去重、融合并返回→用户核对原文；单后端失败软退化，全失败返回原因，caller取消应传回整体。

**效果与成本**

多后端每次调用和多查询可放大模型/API费用，缓存/冷却可减少重复请求但未测命中；首次配置密钥/代理/实例和持续服务变动排障计人工，不能将部分免Key宣传换算为零成本。

单后端故障时仍有结果的机制可见，降低用户手动换源负担；是否更快、更准取决于来源重叠、网络尾延迟和任务覆盖，未给无实测收益比例。

- **思考**：多后端与RRF是否真正提升证据而非放大共同转载？多个结果列表可能来自相同索引和镜像，RRF积累重复URL排名能提高共识，却不提供独立来源鉴别。并发还会等待失败尾部并增加API预算；部分成功只证明有结果，不能证明覆盖用户问题。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对宿主选择单provider或逐后端手搜，本项在一个provider后并发多种来源，避免配置多个provider造成歧义，并把失败原因/冷却状态收敛。RRF源码归因Cormack及RAG-Fusion，不计为原创算法；具体增量是DSH服务接线和失败/取消/结果融合组合。

相对宿主选择单provider或逐后端手搜，本项在一个provider后并发多种来源，避免配置多个provider造成歧义，并把失败原因/冷却状态收敛。RRF源码归因Cormack及RAG-Fusion，不计为原创算法；具体增量是DSH服务接线和失败/取消/结果融合组合。

provider.js以Promise.resolve().then(fn)把同步抛错纳入limiter的finally释放，避免漏归还并发槽，值得借鉴；聚合先完整收集后去重排序避免早截断偏向前序后端。breaker全冷却放开优先可用性，服务共同故障仍会重复尝试，不代表持续隔离保证。

<a id="detail-section-5"></a>

### 主要限制

多后端与RRF是否真正提升证据而非放大共同转载？多个结果列表可能来自相同索引和镜像，RRF积累重复URL排名能提高共识，却不提供独立来源鉴别。并发还会等待失败尾部并增加API预算；部分成功只证明有结果，不能证明覆盖用户问题。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 lib/provider.js、lib/rrf.js、lib/breaker.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查provider限流/超时/收集合并、RRF和breaker核心，未运行任何后端，未独立核实11家服务当前价格、免费额度或免Key路径；静态available仅配置可用。
- 下一步：同一30题按时效/中文/长尾分组，对比单后端、固定fan-out与预算选择；人工标记原始出处、支持率和独立来源增益，记录p95耗时、失败及全部费用。减少调用若损害长尾覆盖超过收益，则否定自适应假设。

**分析版本**

- **仓库**：[240xu/dsh-websearch](https://github.com/240xu/dsh-websearch)
- **版本号**：2.8.6（[固定提交 72cbba8e](https://github.com/240xu/dsh-websearch/tree/72cbba8e3c19c77fea2396c7ac00c40b08df52a9)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

### 源码索引

- [lib/provider.js](https://github.com/240xu/dsh-websearch/blob/72cbba8e3c19c77fea2396c7ac00c40b08df52a9/lib/provider.js)
- [lib/rrf.js](https://github.com/240xu/dsh-websearch/blob/72cbba8e3c19c77fea2396c7ac00c40b08df52a9/lib/rrf.js)
- [lib/breaker.js](https://github.com/240xu/dsh-websearch/blob/72cbba8e3c19c77fea2396c7ac00c40b08df52a9/lib/breaker.js)

<a id="detail-section-8"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：按任务类型和历史独立来源增益选择最少后端，达成证据覆盖后停止追加，来源独立性由域名/出处链辅助标注而非纯排名。它来自固定fan-out与共识融合局限；代价是维护任务覆盖标准，并可能漏掉慢但独特来源。

同一30题按时效/中文/长尾分组，对比单后端、固定fan-out与预算选择；人工标记原始出处、支持率和独立来源增益，记录p95耗时、失败及全部费用。减少调用若损害长尾覆盖超过收益，则否定自适应假设。

<a id="detail-section-9"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 1072 | — | — | 10327 |
| .js | source | 30 | 5615 | 3895 | 1343 | — |
| .mjs | test | 1 | 97 | 84 | 7 | — |
| .js | test | 17 | 2526 | 2182 | 315 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/240xu/dsh-websearch/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
