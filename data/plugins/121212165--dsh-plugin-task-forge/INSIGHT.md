# Task Forge

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[af8cf4f](https://github.com/121212165/dsh-plugin-task-forge/tree/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-task-forge)
<!-- END META -->

> **实现功能**：把需求整理成版本化任务书，通过交接包和回读握手管理跨窗口协作。

> **核心亮点**：命令编译任务、导出交接包并记录台账；握手解析回读、缺口、STATUS 和版本，旧版本不得视为当前放行。

> **风险与缺陷**：将隐含假设和版本漂移显性化有价值；作者的无损说法不能由模板和状态字样单独证明。

<a id="detail-section-1"></a>

## 1 用途与适用场景

> **用途**：跨模型或 IDE 交接任务时，用户需要暴露接收方理解缺口并跟踪其持有版本。

普通 Markdown 任务书更低成本；有多人多窗口且频繁改版时，版本台账更有增量。

<a id="detail-section-2"></a>

## 2 能力与限制

**能力**

- **用户命令**：任务编译、relay、ack 与缺口回答。
- **模型工具**：任务书写入工具。

**流程与依赖**

需要接收方配合协议、人工回答缺口与稳定台账；不是任意外部 AI 窗口都受同一运行时控制。

编译并确认任务书、发送交接包、检查回读，补缺口后升版重新交接，最终按验收标准办结。

**兼容条件**

版本 0.2.0，依赖命令、工具、提示、模型及 agent 服务，跨 IDE 交接有额外配置。

**效果与成本**

编译、全文重发、回读和补缺口增加模型与人工轮次；高交接频率才可能抵消成本。

> **思考**：将隐含假设和版本漂移显性化有价值；作者的无损说法不能由模板和状态字样单独证明。

<a id="detail-section-3"></a>

## 3 工程分析

> **亮点**：命令编译任务、导出交接包并记录台账；握手解析回读、缺口、STATUS 和版本，旧版本不得视为当前放行。

旧版握手拒绝放行、READY 带缺口按待输入处理值得借鉴；内容语义仍需验收者判断。

<a id="detail-section-4"></a>

## 4 使用建议

先用一个有明确验收点的小任务试交接，人工比对遗漏和改版后的接收方状态。

<a id="detail-section-5"></a>

## 5 核查说明

**核查状态**：已检查源码。

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：格式检查和 READY 不能证明语义理解无损；未验证跨窗口任务成功率或模型真实遵守情况。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用有意遗漏、旧版本、虚假 READY 和并发更新样本，核对协议能拦什么及仍需人工判断什么。

**分析版本**

固定提交 [af8cf4f](https://github.com/121212165/dsh-plugin-task-forge/tree/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 138 | — | — | 2634 |
| .ts | source | 8 | 1874 | 1533 | 195 | — |
| .ts | test | 9 | 1957 | 1618 | 99 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/121212165/dsh-plugin-task-forge/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
