# dsh-organism

> 把插件组织为可观测器官，提供心跳、反射、自愈账本和工具schema按需门控。

<!-- BEGIN META -->
[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body) · [![最后更新 20天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=20%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body/commits)
<!-- END META -->

## 版本

固定提交 [9403444d87d5e962f9a4f0c4c10fdb48f37f7d66](https://github.com/1420079678-ctrl/agent-body/tree/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-organism)

## 用途与采用点评

- **用途**：多插件组合维护者希望统一发现工具、跟踪故障和触发恢复，合格结果是可追踪的实际恢复而非状态计数增长。
- **亮点**：组件src/index.ts连接tools与session事件、心跳和持久账本；按器官选择工具schema，反射可再次执行工具，带副作用处方要求人工裁决。
- **思考**：统一事件与恢复账本有集成价值；把任意插件命名为器官不能自动消除兼容差异，也不能证明任务成功。
- **建议**：适合愿意维护统一器官协议的实验环境；先只开启观测，再逐条批准恢复路径，验证重复故障不会重复副作用。

## 场景与替代办法

此前未入档；独立健康检查和显式恢复脚本更简单，本框架在多插件共享契约时可能减少自建接线。

## 依赖与流程

依赖可兼容的宿主事件、插件声明、可写运行目录和实际工具；自愈成功判断依赖各工具返回语义，不能只信进程或字符串成功。

登记器官与观察事件，查看体征，诊断故障，按只读/副作用处方恢复，再检查实际交付；复发时停用对应反射并人工接管。

## 成本与效果

心跳、日志、schema管理和恢复调用增加常驻负担；需配置器官契约并调反射，模型与人工排查成本未实测。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：workspace/plugins/dsh-organism；内容摘要：7f7f3a6710741af31e6fb946af39626ada1ac0047da2a3770c874e7ddecee382。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 3005 | 2705 | 318 | — |
| .mjs | source | 1 | 324 | 270 | 28 | — |
| .ts | source | 1 | 3106 | 2493 | 422 | — |

排除 1 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：body_map、body_status、body_heart、body_reflex、body_heal等器官管理工具。
- **后台**：心跳、故障账本、反射执行及schema门控。

## 工程亮点

工具登记、可见schema门控与恢复账本相连值得研究；单一大模块跨观测、提示和执行，修改一个恢复路径可能影响多处。

## 分发与兼容

0.1.1，依赖Cordis和DSH tools/llm等服务，含源码与发布lib；根仓库同时含其他器官，不能把全部规模归于本组件。


## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：自愈率和器官比喻是框架指标，不能推出智能提升或业务可用；自动反射可能形成额外调用链，未验证收敛与权限传播。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：以缺服务、超时、重复失败、需要确认的写操作测试反射和账本，比较观测模式与恢复模式的故障办结率及额外调用。

## 活跃度

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 1](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=grey&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天更新 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=1&color=grey&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body/issues?q=is%3Aissue+updated%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)

统计日期：2026-10-20。
