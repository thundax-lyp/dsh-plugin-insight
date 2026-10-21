# dsh-zero-residence

> 把长会话内容压缩为可回查指针，提供账本、召回、强制压缩和异步命令入口。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[9403444](https://github.com/1420079678-ctrl/agent-body/tree/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence)

<!-- BEGIN META -->
[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)
<!-- END META -->

**使用建议**：先在可恢复会话副本试压缩，验证关键证据能原样回查；异步命令只用于允许的测试任务，并确认宿主权限与取消边界。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：工具输出很长的任务希望缩小反复发送的历史，同时保留回查原文能力；验收需兼顾最终任务质量。

此前未入档；原生摘要和裁剪为对照，指针化适合必须保留长工具原文的任务，但暂无同预算质量结果。

## 能力与限制

- **模型工具**：zr_ledger、zr_recall、zr_compact、zr_fast。
- **后台**：确定性指针压缩引擎与挂载失败降级。

**流程与依赖**

需要保留可读取的会话事件及兼容压缩基类；异步命令依赖pwsh和可写日志目录，不能从独立spawn推断继承了宿主沙箱约束。

查看账本，触发或等待压缩，按指针召回证据后继续；若引擎未挂载先确认降级，不反复压缩。异步任务需显式查询实际退出状态。

**兼容条件**

0.1.0，深度依赖DSH compaction-basic、session与tokenMeter；zr_fast明确调用pwsh，有平台与权限差异。

**效果与成本**

压缩不调用摘要模型，但指针、回查输出与叙事仍计输入；日志磁盘和后续检索也有成本，未验证端到端费用下降。

- **思考**：可追溯指针比不可逆摘要更利于复核；如果模型频繁回读或遗失指针，省下的输入可能被额外轮次抵消。

## 工程分析

- **亮点**：继承BasicCompactionEngine以确定性指针代替摘要，原文从会话持久记录回读；另有zr_fast用pwsh派生进程并返回日志句柄。

复用原生压缩阈值和触发契约降低重写成本，挂载失败会提示仅工具模式；zr_fast查找先依赖内存记录，恢复承诺需收窄。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：零驻留指的是所压缩历史，非整个请求无token；回查依赖原始日志，异步句柄只存在本进程Map中，重载恢复不能仅靠退出码文件保证。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：固定长输出任务对照原生压缩，测原文可恢复率、合格交付和总tokens；同时测试重载后的句柄查询和失败命令。

**分析版本**

固定提交 [9403444](https://github.com/1420079678-ctrl/agent-body/tree/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-zero-residence)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 660 | 601 | 66 | — |
| .mjs | source | 3 | 182 | 167 | 4 | — |
| .ts | source | 1 | 696 | 542 | 107 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/1420079678-ctrl/agent-body/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
