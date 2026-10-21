# dsh-plugin-roundtable 圆桌会议

> 在 DSH 以拓扑视图组织多角色专家协作、讨论、汇聚与用户决策。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[e2cb127](https://github.com/9931666/dsh-plugin-roundtable/tree/e2cb127bc0c2654a92cf2db64256c982c78b90e4)

<!-- BEGIN META -->
[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/9931666/dsh-plugin-roundtable) · [![npm 30d 1464](https://img.shields.io/static/v1?label=npm+30d&message=1%2C464&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@y9931666/dsh-plugin-roundtable) · [![首次发布 2026-10-01](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-10-01&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@y9931666/dsh-plugin-roundtable)
<!-- END META -->

**使用建议**：有明确讨论目标的人先用少数专家；定预算并读原文分歧，核对真实状态和消息路径，再扩大阵容，别让会议代替最终验收。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
- [未来设计假设（未验证）](#detail-section-7)
- [辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：复杂问题需要多角色观点和分歧记录，主持人组织专家并把需拍板事项交用户，交付会议记录与结论材料。

- **建议**：待验证假设：摘要按主张/证据/分歧覆盖选取并保留被截反证索引，预算区分实际/估计/在途开销，可减少后发异议被淹没和账单误解。由当前截断与估计计量推导，未实现。把关键反证放末尾、专家长输出与预算边界三组对照，测主持人采纳反证率及真实费用偏差；新增摘要模型成本要单列。

有明确讨论目标的人先用少数专家；定预算并读原文分歧，核对真实状态和消息路径，再扩大阵容，别让会议代替最终验收。

核查状态：源码支持会议组织与持久记录；未开会或验收真实模型协作，拓扑动画不证明消息实际流转或观点独立。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

参照单Agent角色模拟与人工会议纪要；不把功能数量或图拓扑作为更优决策证据。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：会议/节点/通信/预算/导出组织工具。
- **Host 路由**：会议快照与用户操作RPC。
- **界面**：拓扑会议视图、角色/阵容设置。
- **后台**：持久专家与发言/预算归集。

**流程与依赖**

tools/members拉持久子代理，node-events归集发言与用量，budget限制轮次/估计token并闭麦，state原子保存会议/JSONL，aggregator确定性压缩摘要；UI显示节点/连线并排队用户行为。

DSH持久子代理/会话事件/工具/RPC及多模型配置、本地.roundtable目录；可选服务不可当加载前置。

主持建会→阵容/连接→派发专家→归集发言/预算→汇聚→用户决策队列→主持推进/闭会/导出；专家空闲不等于业务完成。

TS双端构建，DSH版本与可选服务接线敏感；阵容只定义谁来会，不应视为执行DAG。

**效果与成本**

首次定议题/角色/模型，持续多模型token、主持转述、阅读/裁决与复审；真实费用不能从图灯或估算预算直接读出。

把讨论责任和分歧显式记录；不保证多模型独立、结论正确或比单模型更经济。

- **思考**：汇聚和预算是否保留关键分歧并控制全部成本？aggregator按发言顺序每条160字、整体4000字符前截，后来的重要反证可能不进入摘要；预算含估计token与真实计量不同，不能当精确账单硬上限。图中骨架通道也不表示真实传输，持久写入原子不等于所有多文件事实同事务。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对一个聊天内模拟角色，增量是持久专家会话、显式通信/预算与用户操作队列，并把状态图与真实子代理状态区分。模型/子代理归DSH，插件主要贡献在协作调度和可追踪材料，不是由专家数推导决策更好。

相对一个聊天内模拟角色，增量是持久专家会话、显式通信/预算与用户操作队列，并把状态图与真实子代理状态区分。模型/子代理归DSH，插件主要贡献在协作调度和可追踪材料，不是由专家数推导决策更好。

原子写与用户行为追加共锁、可选host writer惰性加载、预算恢复操作例外可借鉴；摘要截断与多文件恢复需保留证据边界。

固定源码依据：[src/index.ts](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/index.ts)、[src/tools.ts](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/tools.ts)、[src/members.ts](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/members.ts)、[src/node-events.ts](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/node-events.ts)、[src/budget.ts](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/budget.ts)、[src/state.ts](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/state.ts)、[src/aggregator.ts](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/aggregator.ts)、[src/edge-helper.ts](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/src/edge-helper.ts)、[package.json](https://github.com/9931666/dsh-plugin-roundtable/blob/e2cb127bc0c2654a92cf2db64256c982c78b90e4/package.json)。

<a id="detail-section-5"></a>

### 主要限制

汇聚和预算是否保留关键分歧并控制全部成本？aggregator按发言顺序每条160字、整体4000字符前截，后来的重要反证可能不进入摘要；预算含估计token与真实计量不同，不能当精确账单硬上限。图中骨架通道也不表示真实传输，持久写入原子不等于所有多文件事实同事务。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：1.0.0-rc.4；版本日期：2026-10-18（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[e2cb127b](https://github.com/9931666/dsh-plugin-roundtable/tree/e2cb127bc0c2654a92cf2db64256c982c78b90e4)；本轮基准：2026-10-21T04:06:46Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：抽读index/tools/members/node-events、budget/state/aggregator与edge-helper；未运行会议、真实路由或多文件故障恢复。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

待验证假设：摘要按主张/证据/分歧覆盖选取并保留被截反证索引，预算区分实际/估计/在途开销，可减少后发异议被淹没和账单误解。由当前截断与估计计量推导，未实现。把关键反证放末尾、专家长输出与预算边界三组对照，测主持人采纳反证率及真实费用偏差；新增摘要模型成本要单列。

隔离会话检查真实消息边、摘要末尾反证、预算在途、多会话身份、坏JSONL与重启；本轮不执行。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 1935 | — | — | 32429 |
| .mjs | source | 7 | 1387 | 1016 | 248 | — |
| .ts | source | 30 | 8121 | 5959 | 1748 | — |
| .tsx | source | 5 | 3125 | 2689 | 305 | — |
| .mjs | test | 17 | 1994 | 1606 | 199 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/9931666/dsh-plugin-roundtable/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
