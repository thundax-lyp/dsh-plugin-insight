# dsh-ledger-memory

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[7aa05c4](https://github.com/18477514055/dsh-ledger-memory/tree/7aa05c4557e010c8d6decb16e96b05de36e1196a)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/18477514055/dsh-ledger-memory) [![npm 30d 3,016](https://img.shields.io/static/v1?label=npm+30d&message=3%2C016&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ledger-memory) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ledger-memory)
<!-- END META -->

> **实现功能**：为 DSH 项目维护台账、活动日志、上下文压缩与跨会话交接。

> **核心亮点**：作者强调可回溯长期记忆。相对手写 AGENTS/状态文件，实际增量是把项目语义分区、压缩前落盘义务和压缩后逐字回注连成协议；part5 的 triage 工具将需要常驻的约束与只需检索的依据分开。不是新的记忆模型，内容选择仍归模型。

> **风险与缺陷**：最关键是“落盘”能否代表真正保留了任务约束。硬门可检查工具调用和持久化周期，却不能证明模型写全语义；keep 上限截断也可能丢掉末尾的重要约束。胶囊原文提供回读补救，但回读仍需模型正确判断，不能从机制存在推出连续性已保证。

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

> **用途**：长期开发项目的负责人需要在压缩和换会话后找回状态、原始报错与决策依据；交付物是可追溯项目记忆，而非完整聊天复制。

参照是人工维护状态 Markdown、直接历史摘要与按需 grep 原始日志；本次未对其他记忆插件做同条件实验。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：ledger_triage、ledger_compact、ledger_recall 等台账工具（源码定义）
- **后台**：活跃台账注入、压缩胶囊与归档流程

**流程与依赖**

需要声明兼容范围内的 DSH 服务、Node ≥22.19、可写项目目录及可响应台账工具的模型；Git 记录还依赖本地 Git。宿主压缩事件变化需要维护者适配。

用户确认初始化，模型登记结构；每轮读活跃状态、写回及分流；压缩前持久化胶囊，压缩后注回；换会话用交接单；忽略写回时通过闸门再次要求，用户仍需复核关键约束。

**效果与成本**

现金主要是写回、分流、注入和回读引入的模型 token；人工成本是初始化结构、处理失效锁定及复核摘要。没有测得合格接班单位成本，作者 README 的压缩比例不作为独立复现。

潜在价值是减少接班时人工拼接记录；收益成立依赖模型正确分流及日志可定位。不能把工具回执当成记忆准确率。

> **思考**：最关键是“落盘”能否代表真正保留了任务约束。硬门可检查工具调用和持久化周期，却不能证明模型写全语义；keep 上限截断也可能丢掉末尾的重要约束。胶囊原文提供回读补救，但回读仍需模型正确判断，不能从机制存在推出连续性已保证。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：作者强调可回溯长期记忆。相对手写 AGENTS/状态文件，实际增量是把项目语义分区、压缩前落盘义务和压缩后逐字回注连成协议；part5 的 triage 工具将需要常驻的约束与只需检索的依据分开。不是新的记忆模型，内容选择仍归模型。

作者强调可回溯长期记忆。相对手写 AGENTS/状态文件，实际增量是把项目语义分区、压缩前落盘义务和压缩后逐字回注连成协议；part5 的 triage 工具将需要常驻的约束与只需检索的依据分开。不是新的记忆模型，内容选择仍归模型。

lib/part4.js 的合规修复只补已有结构缺项，lib/part5.js 把分流与压缩工具拆开，值得借鉴状态与流水分离。大量 part 文件互相导入且入口承担多类生命周期，迁移到其他宿主需要重新核对压缩与会话接线，不能直接复制即用。 源码：[lib/index.js](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/index.js)、[lib/part4.js](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part4.js)、[lib/part5.js](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part5.js)。

<a id="detail-section-5"></a>

### 1.4 主要限制

最关键是“落盘”能否代表真正保留了任务约束。硬门可检查工具调用和持久化周期，却不能证明模型写全语义；keep 上限截断也可能丢掉末尾的重要约束。胶囊原文提供回读补救，但回读仍需模型正确判断，不能从机制存在推出连续性已保证。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合频繁压缩和接班的长期项目；先在可恢复项目副本上验证一轮压缩后的约束和原文回读，再决定是否让它维护正式台账。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献机制有固定源码支持；效果与采用收益为条件性解释，后续设计假设尚未验证。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/part4.js、lib/part5.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定提交的所列核心实现与作者材料；未运行插件、安装、测试或真实宿主验收，未确认独立用户效果。
- 下一步：在同模型、同上下文预算下，对比手写状态文件与台账协议，安排包含否定约束、报错原文和并发修改的十次压缩/接班；测约束保留、原文可回读率及额外 token。若遗漏未减或成本明显增加，收回额外锚点方案。

**分析版本**

- **仓库**：[18477514055/dsh-ledger-memory](https://github.com/18477514055/dsh-ledger-memory)
- **版本号**：1.3.0（[固定提交 7aa05c4](https://github.com/18477514055/dsh-ledger-memory/tree/7aa05c4557e010c8d6decb16e96b05de36e1196a)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：把用户明确约束的逐字锚点与模型状态摘要分开验收，可能减少压缩后的约束遗漏。推导自 keep 的数量上限与模型负责选择内容的边界；新增锚点会占上下文并增加冲突处理责任。

在同模型、同上下文预算下，对比手写状态文件与台账协议，安排包含否定约束、报错原文和并发修改的十次压缩/接班；测约束保留、原文可回读率及额外 token。若遗漏未减或成本明显增加，收回额外锚点方案。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 9 | 27322 | 14680 | 11149 | — |
| .md | source | 1 | 316 | — | — | 4917 |
| .mjs | source | 290 | 56073 | 40486 | 12500 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/18477514055/dsh-ledger-memory/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
