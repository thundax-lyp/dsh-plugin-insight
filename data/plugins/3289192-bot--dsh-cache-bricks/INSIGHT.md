# dsh-cache-bricks

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[2e52b91](https://github.com/3289192-bot/dsh-cache-bricks/tree/2e52b914eaea5a02e5937c323160cf2fd2b8de1b)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：可视化 DSH 模型请求、缓存命中率、活动与历史请求对比。

> **核心亮点**：相对只看总token数字，attempt粒度观测、请求对比及会话定位把排查对象具体化；独立纯数据指标模块让视图共享同一口径。缓存本身由provider提供，插件不产生缓存优化。

> **风险与缺陷**：红色砖是否能定位缓存下降原因？比例来源于宿主报告且默认三桶互斥，不同provider口径错误会传播；缺字段用未知是强支持，但比较两次请求不能建立改动导致命中率下降的因果。历史日志也未必恢复内存中全部细节。

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

> **用途**：调试长会话上下文与缓存波动的本机DSH Web用户，需要把某次真实请求与对话位置对应。

参照宿主token汇总与人工读日志；此工具提供诊断可见性，不改写请求。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **后台**：请求事件归一与usage指标计算
- **界面**：缓存砖、请求详情、比较与会话定位

**流程与依赖**

依赖DSH请求观测事件、会话日志与匹配Web接口；作者公开基线0.1.7-rc.2，其他版本未由本轮验证。

请求事件→观察归一→ledger结算→指标展示→定位与比较；重启清空内存，历史字段按宿主实际日志恢复。

**效果与成本**

首次安装并匹配宿主请求事件；持续有内容内存、历史扫描和排查人力成本，无额外模型调用；采集内容可能含对话与工具参数。

可把排查从总体猜测缩到具体attempt；是否缩短诊断时间及降低账单仍需对照。

> **思考**：红色砖是否能定位缓存下降原因？比例来源于宿主报告且默认三桶互斥，不同provider口径错误会传播；缺字段用未知是强支持，但比较两次请求不能建立改动导致命中率下降的因果。历史日志也未必恢复内存中全部细节。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对只看总token数字，attempt粒度观测、请求对比及会话定位把排查对象具体化；独立纯数据指标模块让视图共享同一口径。缓存本身由provider提供，插件不产生缓存优化。

相对只看总token数字，attempt粒度观测、请求对比及会话定位把排查对象具体化；独立纯数据指标模块让视图共享同一口径。缓存本身由provider提供，插件不产生缓存优化。

effectiveToolsOf按名去重避免宿主toolHistory重复计数；指标分开缺失和零，并从dispatch起算首token时间，避免把step启动时间混入。 [固定源码](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/core/observe.ts#L1)。

<a id="detail-section-5"></a>

### 1.4 主要限制

[核查分支](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/shared/metrics.ts#L49)。

红色砖是否能定位缓存下降原因？比例来源于宿主报告且默认三桶互斥，不同provider口径错误会传播；缺字段用未知是强支持，但比较两次请求不能建立改动导致命中率下降的因果。历史日志也未必恢复内存中全部细节。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合有明确缓存排查问题的用户试用，先核对provider usage口径与采集完整度，不据颜色直接删工具或归责某个提示改动。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已实现机制由固定源码支持；效果未独立实测，未来假设未验证。

- 已检查：作者 README、包清单、源码路径 src/core/observe.ts、src/shared/metrics.ts、src/host/routes.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读指定核心源码与作者说明；未执行目标插件或测试、未安装或做真实宿主验收，未核实独立用户收益。
- 下一步：注入缺失缓存字段、重复工具声明和同内容不同元标志三类观察，并以固定provider原始usage对账；若仍把未知转零或相同工具哈希变化则否定假设。

**分析版本**

- **仓库**：[3289192-bot/dsh-cache-bricks](https://github.com/3289192-bot/dsh-cache-bricks)
- **版本号**：0.1.5（[固定提交 2e52b914](https://github.com/3289192-bot/dsh-cache-bricks/tree/2e52b914eaea5a02e5937c323160cf2fd2b8de1b)）
- **版本日期**：2026-09-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：在请求对比中显示字段来源、采集完整度和唯一变化集，可帮助排除口径变化造成的假异常；新增负担是provider归一映射与完整度传播。

注入缺失缓存字段、重复工具声明和同内容不同元标志三类观察，并以固定provider原始usage对账；若仍把未知转零或相同工具哈希变化则否定假设。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 2180 | — | — | 25526 |
| .js | source | 3 | 2095 | 1607 | 503 | — |
| .mjs | source | 9 | 4051 | 3233 | 632 | — |
| .ts | source | 25 | 12674 | 7403 | 4595 | — |
| .tsx | source | 2 | 1636 | 1225 | 336 | — |
| .ts | test | 26 | 7581 | 6110 | 855 | — |
| .js | test | 1 | 52 | 51 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/3289192-bot/dsh-cache-bricks/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
