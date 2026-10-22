# dsh-openviking-enhance

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[72a24cc](https://github.com/A2chitect/dsh-openviking-enhance/tree/72a24cc6755010df25b4cef39f3710290c911ec0)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/A2chitect/dsh-openviking-enhance) [![npm 30d 631](https://img.shields.io/static/v1?label=npm+30d&message=631&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-openviking-enhance) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-openviking-enhance)
<!-- END META -->

> **实现功能**：在DSH显示OpenViking Studio、会话记忆提交状态及按会话查询的召回内容。

> **核心亮点**：相比切到独立Studio，增量是在会话旁汇总记忆写入与查询状态，保留失败和具体viking路径；不实现OpenViking提取算法，也不负责记忆写入。

> **风险与缺陷**：Memory recall是否就是该轮真实用过的证据？代码基于最近消息重新search，结果受查询截断、缓存和服务当前状态影响，且加入resources来源；它是可重做的查询观察，不是历史召回收据。分数颜色也不代表事实可信度或模型采用。

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

> **用途**：使用OpenViking记忆服务的用户需要知道会话何时入库和能检索什么；合格结果是提交/失败状态可追溯，不能把可检索内容当模型实际采用内容。

直接用OpenViking Studio/API信息更原始；插件补会话关联，不替代服务本身。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：Studio、提交状态和召回侧栏。
- **Host 路由**：本地受限的OpenViking读取接口。

**流程与依赖**

OpenVikingAPI与Studio、DSH界面席位，效果依赖session身份和原记忆插件；外部服务失败时面板只能报告不能修复。

打开Studio或会话状态pill，查看commit详情；召回页取最近消息或手输query，分别查询来源，再看文本与警告。

**效果与成本**

初始需部署OpenViking与身份配置，持续轮询/重检增加服务负担和排查成本；不新增翻译或模型逻辑，不声称端到端收益。

降低查看提交与检索的窗口切换，但记忆正确率与任务效果未验证。

> **思考**：Memory recall是否就是该轮真实用过的证据？代码基于最近消息重新search，结果受查询截断、缓存和服务当前状态影响，且加入resources来源；它是可重做的查询观察，不是历史召回收据。分数颜色也不代表事实可信度或模型采用。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相比切到独立Studio，增量是在会话旁汇总记忆写入与查询状态，保留失败和具体viking路径；不实现OpenViking提取算法，也不负责记忆写入。

相比切到独立Studio，增量是在会话旁汇总记忆写入与查询状态，保留失败和具体viking路径；不实现OpenViking提取算法，也不负责记忆写入。

显式本地HTTP围栏和查询/提交服务分离值得借鉴；同源检查是访问限制，不是独立用户身份系统。重检与实际召回应保留不同证据标签。 源码依据：[src/host/recall-service.ts](https://github.com/A2chitect/dsh-openviking-enhance/blob/72a24cc6755010df25b4cef39f3710290c911ec0/src/host/recall-service.ts)、[src/host/trust-fence.ts](https://github.com/A2chitect/dsh-openviking-enhance/blob/72a24cc6755010df25b4cef39f3710290c911ec0/src/host/trust-fence.ts)。

<a id="detail-section-5"></a>

### 1.4 主要限制

Memory recall是否就是该轮真实用过的证据？代码基于最近消息重新search，结果受查询截断、缓存和服务当前状态影响，且加入resources来源；它是可重做的查询观察，不是历史召回收据。分数颜色也不代表事实可信度或模型采用。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合已有OpenViking的本机用户先观察。核对session映射和失败状态，把召回页当当前查询；远程反代会被本地信任围栏拒绝，先确认访问路径。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[A2chitect/dsh-openviking-enhance](https://github.com/A2chitect/dsh-openviking-enhance)
- **版本号**：0.2.1（[固定提交 72a24cc6](https://github.com/A2chitect/dsh-openviking-enhance/tree/72a24cc6755010df25b4cef39f3710290c911ec0)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 src/host/recall-service.ts、src/host/trust-fence.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：固定服务版本比对session映射、commit失败、缓存刷新、记忆变更前后重查差异与反代拒绝；另核对真实注入收据。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

由重新查询与真实使用差异推导，可由原记忆插件输出不可变召回收据，绑定查询、结果版本及注入状态，面板分别展示历史实际召回与当前重新检索。未验证；以记忆更新前后同会话检查是否仍能还原原轮证据，若不能则否定。

固定服务版本比对session映射、commit失败、缓存刷新、记忆变更前后重查差异与反代拒绝；另核对真实注入收据。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：8c62e7f93acea9ea6eb28a92a2e50d5c6edc1896b2aadb886e3d0f4165298639。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 7 | 1488 | 1102 | 303 | — |
| .md | source | 4 | 634 | — | — | 6559 |
| .tsx | source | 6 | 1391 | 1015 | 291 | — |
| .ts | source | 14 | 3085 | 2026 | 856 | — |
| .mjs | test | 6 | 1312 | 1045 | 203 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/A2chitect/dsh-openviking-enhance/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
