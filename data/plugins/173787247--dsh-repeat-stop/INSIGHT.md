# dsh-repeat-stop

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[cb1ed9f](https://github.com/173787247/dsh-repeat-stop/tree/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-repeat-stop)
<!-- END META -->

> **实现功能**：拦截同一Agent连续出现的同工具同参数调用，提供可配置阈值与排除规则。

> **核心亮点**：tools.guard与post-execute共用观察函数，以WeakSet避免同一exec重复计数，参数递归排序生成调用键，WeakMap保存每个Agent连续次数。

> **风险与缺陷**：在执行前阻断比只注入提醒更强；阈值并不证明剩余调用有用，也不提供跨Agent团队总限额。

<a id="detail-section-1"></a>

## 1 用途与适用场景

> **用途**：Agent原样重试却不进展时，用户希望及时切断循环，合格结果是阻断无效调用且不妨碍正常轮询。

此前未入档；人工中断或固定工具总额度是替代，本项专注狭义原样循环，不能代替总预算。

<a id="detail-section-2"></a>

## 2 能力与限制

**能力**

- **后台**：工具执行guard、重复计数和用户消息重置。

**流程与依赖**

需要guard钩子可靠执行及稳定Agent对象身份；效果取决于工具命名、参数语义和排除规则。

正常执行并计连续调用，超过阈值返回阻断说明，主模型或用户诊断后换方案；新用户输入可重置连续链。

**兼容条件**

0.1.2，Node>=18，依赖宿主tools.guard及pre-step事件；默认阈值6，排除job_output/list/kill等查询操作。

**效果与成本**

机制本身不额外调用模型，但误拦后需换路径或人工接管；恢复和重试占时间，未测省下多少费用。

> **思考**：在执行前阻断比只注入提醒更强；阈值并不证明剩余调用有用，也不提供跨Agent团队总限额。

<a id="detail-section-3"></a>

## 3 工程分析

> **亮点**：tools.guard与post-execute共用观察函数，以WeakSet避免同一exec重复计数，参数递归排序生成调用键，WeakMap保存每个Agent连续次数。

规范化对象参数和一次exec计数适合复用；运行时WeakMap无持久恢复，重置与多Agent隔离需宿主实测。

<a id="detail-section-4"></a>

## 4 使用建议

先在短任务记录触发次数，按轮询工具配置排除；被拦后检查输入和错误原因，不通过无意义改参数规避限制。

<a id="detail-section-5"></a>

## 5 核查说明

**核查状态**：已检查源码。

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只识别连续同参数，不覆盖换参数或交替工具的循环；用户消息出现时重置链，具体宿主传入messages范围未验证。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用参数顺序不同、交替工具、正常轮询和新用户消息测试计数，比较误拦率、无效调用数与任务完成率。

**分析版本**

固定提交 [cb1ed9f](https://github.com/173787247/dsh-repeat-stop/tree/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 120 | 103 | 0 | — |
| .md | source | 2 | 172 | — | — | 879 |
| .js | test | 2 | 151 | 135 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-repeat-stop/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
