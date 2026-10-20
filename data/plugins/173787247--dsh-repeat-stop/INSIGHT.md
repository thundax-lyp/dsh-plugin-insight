# dsh-repeat-stop

> 拦截同一Agent连续出现的同工具同参数调用，提供可配置阈值与排除规则。

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-repeat-stop) · [![最后更新 20天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=20%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/173787247/dsh-repeat-stop/commits)
<!-- END META -->

## 版本

固定提交 [cb1ed9fb558072adf80e2068b3bc7c50ff736fb9](https://github.com/173787247/dsh-repeat-stop/tree/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9)

## 用途与采用点评

- **用途**：Agent原样重试却不进展时，用户希望及时切断循环，合格结果是阻断无效调用且不妨碍正常轮询。
- **亮点**：tools.guard与post-execute共用观察函数，以WeakSet避免同一exec重复计数，参数递归排序生成调用键，WeakMap保存每个Agent连续次数。
- **思考**：在执行前阻断比只注入提醒更强；阈值并不证明剩余调用有用，也不提供跨Agent团队总限额。
- **建议**：先在短任务记录触发次数，按轮询工具配置排除；被拦后检查输入和错误原因，不通过无意义改参数规避限制。

## 场景与替代办法

Agent原样重试却不进展时，用户希望及时切断循环，合格结果是阻断无效调用且不妨碍正常轮询。

此前未入档；人工中断或固定工具总额度是替代，本项专注狭义原样循环，不能代替总预算。

## 依赖与流程

需要guard钩子可靠执行及稳定Agent对象身份；效果取决于工具命名、参数语义和排除规则。

正常执行并计连续调用，超过阈值返回阻断说明，主模型或用户诊断后换方案；新用户输入可重置连续链。

## 成本与效果

机制本身不额外调用模型，但误拦后需换路径或人工接管；恢复和重试占时间，未测省下多少费用。

在执行前阻断比只注入提醒更强；阈值并不证明剩余调用有用，也不提供跨Agent团队总限额。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：754c8f369f2ed2fc889610ed17de861da5dc967f9fe522a96a8c6c1067cb3474。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 120 | 103 | 0 | — |
| .md | source | 2 | 172 | — | — | 879 |
| .js | test | 2 | 151 | 135 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **后台**：工具执行guard、重复计数和用户消息重置。

## 工程亮点

规范化对象参数和一次exec计数适合复用；运行时WeakMap无持久恢复，重置与多Agent隔离需宿主实测。

## 分发与兼容

0.1.2，Node>=18，依赖宿主tools.guard及pre-step事件；默认阈值6，排除job_output/list/kill等查询操作。

## 历史对照

当前快照此前没有该稳定身份的研究档案。此前未入档；人工中断或固定工具总额度是替代，本项专注狭义原样循环，不能代替总预算。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只识别连续同参数，不覆盖换参数或交替工具的循环；用户消息出现时重置链，具体宿主传入messages范围未验证。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用参数顺序不同、交替工具、正常轮询和新用户消息测试计数，比较误拦率、无效调用数与任务完成率。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-repeat-stop/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-repeat-stop/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-repeat-stop/issues?q=is%3Aissue+created%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-repeat-stop/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-repeat-stop/issues?q=is%3Aissue+updated%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z)

统计日期：2026-10-20。
