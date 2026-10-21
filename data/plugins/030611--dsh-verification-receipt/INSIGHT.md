# DSH Verification Receipt

> 在每轮持久化结束时保存工具次数和验证形态信号的本地 JSONL 回执。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[87f3fb0](https://github.com/030611/dsh-verification-receipt/tree/87f3fb0198090f0f26a37a52840db150609db748)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-verification-receipt) [![npm 30d 862](https://img.shields.io/static/v1?label=npm+30d&message=862&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-verification-receipt) [![首次发布 2026-08-14](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-verification-receipt)
<!-- END META -->

**使用建议**：先对照一次明确成功和一次失败的测试任务，逐项比对回执与真实命令结果。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：代码协作者希望追问某轮究竟记录过哪些执行信号，而不是只看模型完成声明。

人工查会话工具轨迹也能核对；自动摘要节省定位步骤但新增启发式误读风险。

## 能力与限制

- **事件监听**：回合结束事件驱动本地执行摘要回执。

**流程与依赖**

需要对应 session 事件和可写的 DSH_HOME，效果依赖执行轨迹是否完整记录。

回合结束后后台写回执，审阅者再与真实执行结果对照；写入失败从日志排查而非补造结果。

**兼容条件**

包版本 0.1.1，session peer 明确列出 alpha 版本，部署前须核对实际宿主。

**效果与成本**

本地日志增加存储和审查负担，不发模型请求；仍未测长期日志增长和审阅收益。

- **思考**：缩小到可检查的执行信号比声称自动验收更可靠；回执本身不能代替失败放行规则。

## 工程分析

- **亮点**：监听 turn/end 相关 session 事件，按执行轨迹和词法信号生成摘要并串行追加 JSONL。

追加队列、隐私化标识与确定性摘要可复用；接入时要保留事件丢失和写盘失败告警。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：验证形态是启发式信号，不证明测试真实执行、断言正确或最终代码可用。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：构造名称像测试但未执行测试的工具调用，观察误标，并检查中断和写盘失败后的记录边界。

**分析版本**

固定提交 [87f3fb0](https://github.com/030611/dsh-verification-receipt/tree/87f3fb0198090f0f26a37a52840db150609db748)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 482 | — | — | 4515 |
| .mjs | source | 2 | 131 | 124 | 0 | — |
| .ts | source | 3 | 424 | 327 | 56 | — |
| .ts | test | 3 | 391 | 361 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/030611/dsh-verification-receipt/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/030611/dsh-verification-receipt/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/030611/dsh-verification-receipt/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
