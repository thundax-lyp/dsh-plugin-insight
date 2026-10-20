# dsh-tool-budget

> 按运行中的Agent限制工具调用总次数，支持包含与排除规则并在超额时拦截。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[c806416](https://github.com/173787247/dsh-tool-budget/tree/c80641689728dc918a0f6fb03797e98e09a4496e)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-tool-budget)
<!-- END META -->

**使用建议**：先按一类任务观察正常调用分布，再设阈值；长后台任务查询可排除，但排除列表应保持有限。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：长任务工具调用失控时，用户需要明确停止点，合格结果是在预算内办结或及时交接，而非盲目增加调用。

此前未入档；模型token限额或人工时间盒是其他控制，本项补工具次数维度，与重复调用检测职责不同。

## 能力与限制

- **后台**：每Agent工具总次数guard及排除规则。

**流程与依赖**

依赖宿主执行guard且传入Agent对象，工具粒度和排除规则决定额度含义；仍需要用户定义合格交付。

设maxCalls，运行到办结或被拦，查看已产出证据再决定接管或开新任务；不把自动提示结论当验收。

**兼容条件**

0.1.2，Node>=18，Host-only依赖tools.guard和系统提示服务；作者套件兼容声明未在本轮宿主重跑。

**效果与成本**

无额外模型调用，但过早拦截会产生人工交接与重开任务成本；不能把次数上限换算成固定现金上限。

- **思考**：硬停止点可以防止无限尝试；若开多个子Agent，总调用和费用仍可能成倍增加。

## 工程分析

- **亮点**：index.js在tools.guard统计调用，默认80次；WeakSet防同一exec重复计数，WeakMap把每个Agent预算分开。

guard和post-execute复用计数路径、exec去重使接口兼容更清楚；状态不落盘，恢复后预算连续性需另做管理。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：限的是工具调用次数，非模型费用、token或整个团队总预算；重启与新Agent对象会改变计数范围，排除工具不计。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：覆盖边界第80/81次、并发、排除项、子Agent和重载，确认计数与实际工具副作用一致并统计误停后的恢复成本。

**分析版本**

固定提交 [c806416](https://github.com/173787247/dsh-tool-budget/tree/c80641689728dc918a0f6fb03797e98e09a4496e)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 216 | — | — | 1137 |
| .js | source | 2 | 100 | 81 | 5 | — |
| .js | test | 2 | 107 | 95 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-20），可前往 [GitHub Issues](https://github.com/173787247/dsh-tool-budget/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
