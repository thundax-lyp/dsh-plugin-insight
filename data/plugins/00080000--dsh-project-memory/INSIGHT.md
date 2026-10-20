# dsh-project-memory

> 为项目保存任务、文档、代码符号与经验记录，支持跨会话检索和按条件注入。

<!-- BEGIN META -->
[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) · [![npm 30d 4717](https://img.shields.io/static/v1?label=npm+30d&message=4%2C717&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) · [![最后更新 今天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E4%BB%8A%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory/commits)
<!-- END META -->

## 版本

固定提交 [21fc69e3e98f3864677e091477b7d543a0e54939](https://github.com/00080000/dsh-project-memory/tree/21fc69e3e98f3864677e091477b7d543a0e54939)

## 用途与采用点评

- **用途**：长周期开发者在换会话时找回任务及文件依据，交付物是可定位的上下文。
- **亮点**：session 事件同步任务，工具负责索引和检索；when 触发与 guard 收窄限制经验注入。
- **思考**：任务与文件关联有助于定位；错误经验也会持久化，引用存在不代表当前结论正确。
- **建议**：先在一个可丢弃项目中测试旧结论纠错和跨项目隔离，再决定是否长期启用。

## 场景与替代办法

长周期开发者在换会话时找回任务及文件依据，交付物是可定位的上下文。

手写项目摘要更轻；本轮代码指纹已变，应重新检查注入策略，不能继承旧效果判断。

## 依赖与流程

依赖 DSH tools、llm 及 session 事件；项目磁盘可写，增强检索还依赖本地向量资源。

正常工作积累索引，再查询和核对引用；错误条目须主动修订，迁移时携带对应项目存储。

## 成本与效果

需维护项目索引和纠错；可选向量表及查询扩展增加存储或模型调用，未测总成本。

任务与文件关联有助于定位；错误经验也会持久化，引用存在不代表当前结论正确。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：e038435a0df8202c9186666bb53d360b2db4e11e09a1d0c3d03d0b68b4713ca5。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 2263 | — | — | 48510 |
| .js | source | 53 | 14366 | 10430 | 3414 | — |
| .mjs | source | 6 | 1447 | 1189 | 156 | — |
| .ts | source | 9 | 1343 | 937 | 324 | — |
| .tsx | source | 5 | 1563 | 1333 | 151 | — |
| .mjs | test | 41 | 9671 | 7738 | 1204 | — |

排除 2 项，解析错误 4 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：入口注册任务管理、文档索引和项目记忆检索工具。
- **用户命令**：/tasks 汇集任务与经验的交互入口。

## 工程亮点

入口装配与注入准入分离，可借鉴反自激与预算闸门；复用需适配 session 身份。

## 分发与兼容

包声明 0.6.3、src/index.js 入口；源码提交与 npm tarball 未做全量比对。

## 历史对照

前次代码指纹为 fe7ac6cab91784a34996aede007d3586f0ff2def；本轮固定为 21fc69e3e98f3864677e091477b7d543a0e54939。手写项目摘要更轻；本轮代码指纹已变，应重新检查注入策略，不能继承旧效果判断。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读入口和注入闸门，未审计全部解析器或测量检索召回率。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用含过期结论的固定任务集比较手写摘要，记录纠错率、无关注入和人工分钟。

## 活跃度

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 4](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=4&color=grey&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=grey&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory/issues?q=is%3Aissue+created%3A2026-09-20T02%3A56%3A20.108Z..2026-10-20T02%3A56%3A20.108Z) · [![近30天关闭 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=grey&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T02%3A56%3A20.108Z..2026-10-20T02%3A56%3A20.108Z) · [![近30天更新 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=2&color=grey&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory/issues?q=is%3Aissue+updated%3A2026-09-20T02%3A56%3A20.108Z..2026-10-20T02%3A56%3A20.108Z)

统计日期：2026-10-20。
