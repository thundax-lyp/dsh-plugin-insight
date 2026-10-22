# dsh-usage-dashboard-plus

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[ee53a4d](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/tree/ee53a4d07d212f02fe64ec64eb8a9a84163bd439)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1HelloMan1/dsh-usage-dashboard-plus) [![npm 30d 1,049](https://img.shields.io/static/v1?label=npm+30d&message=1%2C049&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-usage-dashboard-plus) [![最新发布 2026-08-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-usage-dashboard-plus)
<!-- END META -->

> **实现功能**：在 DSH 侧栏和设置页展示账户余额、调用用量与分模型费用统计。

> **核心亮点**：相对只看服务商余额，插件将会话用量、视觉旁路调用和模型分组放到一个入口，补足主模型账单看不到辅助调用的观察盲区；余额与日志费用来自不同路径，属于观测整合而非精确账务系统。

> **风险与缺陷**：同一条调用能否恰好计一次以及价格是否匹配路由最影响费用可信度。源码有默认与日期价格表，也给未识别模型 fallback 价格；未知模型被赋通用价不能当实际账单，外部日志格式/重复输入及本地日界线仍需对账。

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

> **用途**：多模型 DSH 用户希望知道账户余额及当天花费；合格交付是带价格口径的估算与可追查调用记录。

参照服务商余额页和单会话 usage；未执行跨供应商真实账单对账。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：侧栏余额与费用、设置页用量看板
- **后台**：主会话与外部视觉调用聚合

**流程与依赖**

需要可读 DSH 日志、credentials/余额服务与客户端设置接口；视觉聚合依赖外部日志格式。价格表由维护者或用户更新，不能据内置日期判断仍是当前官网价。

配置模型价格及可选外部日志，打开侧栏/设置看板；后台解压日志按日聚合并缓存余额；未知模型、读取失败与额度差异需回查原始记录。

**效果与成本**

看板自身主要占日志扫描、解压与存储资源；人工要校准模型名、价格和日志来源。没有因此节省模型费的因果证据。

将辅助视觉成本纳入观察是明确便利；费用仅估算，不可自动视为财务结算。

> **思考**：同一条调用能否恰好计一次以及价格是否匹配路由最影响费用可信度。源码有默认与日期价格表，也给未识别模型 fallback 价格；未知模型被赋通用价不能当实际账单，外部日志格式/重复输入及本地日界线仍需对账。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对只看服务商余额，插件将会话用量、视觉旁路调用和模型分组放到一个入口，补足主模型账单看不到辅助调用的观察盲区；余额与日志费用来自不同路径，属于观测整合而非精确账务系统。

相对只看服务商余额，插件将会话用量、视觉旁路调用和模型分组放到一个入口，补足主模型账单看不到辅助调用的观察盲区；余额与日志费用来自不同路径，属于观测整合而非精确账务系统。

lib/index.js 把 zstd 解码、模型计费、外部日志和投影集中在宿主；token delta 过滤减少非文本块干扰。价格时间线可借鉴，但与当前业务日期的同步及庞大日志扫描成本需实测。 源码：[lib/index.js](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/blob/ee53a4d07d212f02fe64ec64eb8a9a84163bd439/lib/index.js)、[lib/client.js](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/blob/ee53a4d07d212f02fe64ec64eb8a9a84163bd439/lib/client.js)。

<a id="detail-section-5"></a>

### 1.4 主要限制

同一条调用能否恰好计一次以及价格是否匹配路由最影响费用可信度。源码有默认与日期价格表，也给未识别模型 fallback 价格；未知模型被赋通用价不能当实际账单，外部日志格式/重复输入及本地日界线仍需对账。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合用量观察；先用自己账单核对一天数据，并为未知模型补价，再据此设预算。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献机制有固定源码支持；效果与采用收益为条件性解释，后续设计假设尚未验证。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定提交的所列核心实现与作者材料；未运行插件、安装、测试或真实宿主验收，未确认独立用户效果。
- 下一步：以同一批含主调用、失败、视觉旁路和未知模型的请求，与服务商账单及原始 usage 对账；测漏记、重复与未知价覆盖率，若无法从日志稳定关联请求则只报告用量不报精确钱数。

**分析版本**

- **仓库**：[1HelloMan1/dsh-usage-dashboard-plus](https://github.com/1HelloMan1/dsh-usage-dashboard-plus)
- **版本号**：0.2.5（[固定提交 ee53a4d](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/tree/ee53a4d07d212f02fe64ec64eb8a9a84163bd439)）
- **版本日期**：2026-09-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：在用量行保留 provider、请求身份与价格版本，并将未知价列成独立金额区间，可降低“看起来精确”的错账。推导自 fallback 与外部辅助调用合并；跨日志去重需要双方共享身份而非猜时间。

以同一批含主调用、失败、视觉旁路和未知模型的请求，与服务商账单及原始 usage 对账；测漏记、重复与未知价覆盖率，若无法从日志稳定关联请求则只报告用量不报精确钱数。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 194 | — | — | 1531 |
| .js | source | 2 | 1600 | 1441 | 109 | — |
| .mjs | test | 2 | 44 | 40 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/1HelloMan1/dsh-usage-dashboard-plus/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
