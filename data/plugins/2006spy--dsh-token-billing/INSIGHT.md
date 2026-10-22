# dsh-token-billing

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[098b9e8](https://github.com/2006spy/dsh-token-billing/tree/098b9e8164bd66a6f2bdbc204ece186c6ca52060)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/2006spy/dsh-token-billing)
<!-- END META -->

> **实现功能**：为 DSH 提供按供应商、模型、时段与用量计算的实时费用与账本统计。

> **核心亮点**：相对token总量乘单价，增量是把路由、时段、缓存桶和订阅/免费/本地模式分开，且把短暂估算与落地账本区分；不是服务商结算系统，内置价格不能自动视为当前适用合同。

> **风险与缺陷**：最关键是账本身份及单价可追溯：ledger.js 的 mergeSteps 对 seen.has(key) 直接 continue，既有相同 session|turn|step 记录不会经此合并路径被修订；是否实际遇到最终 usage 回补被忽略尚未运行验证。默认汇率与 fallback 价也只是估算前提。临时文件替换不单独证明多进程写入不会丢失。

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

> **用途**：多供应商用户要追踪不同路由与缓存桶费用，避免只看模型别名误估；合格交付是可对账的费用估算及可导出账本。

参照简单token计数、余额页与源码明确借鉴的live-stats估算思路；没有服务商真实账单对账。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：实时费用显示、预算与统计看板
- **后台**：按路由时段计价、账本持久化与导出

**流程与依赖**

需要DSH会话usage/事件投影、可写storages及客户端插槽；价格更新依赖官网解析/用户覆盖，订阅费用摊分和汇率还需用户选择。

确认provider和价格模式，流式阶段看估算，精确usage到达后修正；账本按身份合并并持久化，面板按日/月/模型汇总导出；漏价或账本异常回查原始事件。

**效果与成本**

插件不直接减少模型调用；人工成本是核价、路由映射、订阅摊分和对账，账本占存储。不能由预算预警存在推出节省金额。

按路由计价与持久账本提高追查能力；准确性依赖usage和价格，不是“实时显示”即可证明。

> **思考**：最关键是账本身份及单价可追溯：ledger.js 的 mergeSteps 对 seen.has(key) 直接 continue，既有相同 session|turn|step 记录不会经此合并路径被修订；是否实际遇到最终 usage 回补被忽略尚未运行验证。默认汇率与 fallback 价也只是估算前提。临时文件替换不单独证明多进程写入不会丢失。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对token总量乘单价，增量是把路由、时段、缓存桶和订阅/免费/本地模式分开，且把短暂估算与落地账本区分；不是服务商结算系统，内置价格不能自动视为当前适用合同。

相对token总量乘单价，增量是把路由、时段、缓存桶和订阅/免费/本地模式分开，且把短暂估算与落地账本区分；不是服务商结算系统，内置价格不能自动视为当前适用合同。

lib/ledger.js 明确去重键并用临时文件替换，projection.js集中价格政策与估算规则，便于复核时间边界；不同币种分桶避免直接相加。复用需明确修订与并发写入，不把单进程幂等推广为全局事务。 源码：[lib/ledger.js](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/ledger.js)、[lib/projection.js](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/projection.js)、[lib/prices.js](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/prices.js)。

<a id="detail-section-5"></a>

### 1.4 主要限制

最关键是账本身份及单价可追溯：ledger.js 的 mergeSteps 对 seen.has(key) 直接 continue，既有相同 session|turn|step 记录不会经此合并路径被修订；是否实际遇到最终 usage 回补被忽略尚未运行验证。默认汇率与 fallback 价也只是估算前提。临时文件替换不单独证明多进程写入不会丢失。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合需要多路由费用参考的用户；先对照供应商账单核实缓存、峰谷和币种口径，再据看板调整预算。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献机制有固定源码支持；效果与采用收益为条件性解释，后续设计假设尚未验证。

- 已检查：作者 README、包清单、源码路径 lib/ledger.js、lib/projection.js、lib/prices.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定提交的所列核心实现与作者材料；未运行插件、安装、测试或真实宿主验收，未确认独立用户效果。
- 下一步：用含缓存命中、未知路由、取消、中途精确回补和峰谷跨界的一批请求对账；重启再回放检查重复/漏记，与服务商账单分币种比较。若无法绑定结算口径则继续标为估算。

**分析版本**

- **仓库**：[2006spy/dsh-token-billing](https://github.com/2006spy/dsh-token-billing)
- **版本号**：0.8.1（[固定提交 098b9e8](https://github.com/2006spy/dsh-token-billing/tree/098b9e8164bd66a6f2bdbc204ece186c6ca52060)）
- **版本日期**：2026-09-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：每笔保留价格政策版本、路由和usage修订号，将未知价显式隔离，可使重算与原始账单更可追踪。来自持久化账本和动态价格时间线组合；需要定义历史重算是否改旧金额，避免静默漂移。

用含缓存命中、未知路由、取消、中途精确回补和峰谷跨界的一批请求对账；重启再回放检查重复/漏记，与服务商账单分币种比较。若无法绑定结算口径则继续标为估算。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 6 | 7129 | 5984 | 870 | — |
| .md | source | 1 | 401 | — | — | 8187 |
| .mjs | source | 4 | 968 | 744 | 160 | — |
| .mjs | test | 13 | 2701 | 2088 | 394 | — |
| .md | example | 1 | 18 | — | — | 338 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2006spy/dsh-token-billing/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/2006spy/dsh-token-billing/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2006spy/dsh-token-billing/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
