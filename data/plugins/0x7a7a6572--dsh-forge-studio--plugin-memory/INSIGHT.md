# Forge 记忆

> 为 DSH 保存偏好、项目决策与关系化记忆，支持检索和跨会话使用。

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) · [![npm 30d 2404](https://img.shields.io/static/v1?label=npm+30d&message=2%2C404&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-memory) · [![最后更新 4天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=4%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/commits)
<!-- END META -->

## 版本

固定提交 [acb136c0dbbf8e984bdffea9de48b6ed73d0103e](https://github.com/0x7A7A6572/dsh-forge-studio/tree/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-memory)

## 用途与采用点评

- **用途**：反复在项目间切换的使用者需要可管理的长期偏好和决策，而非无差别保存聊天。
- **亮点**：storage-domain 支撑实体、关系和审计记录，服务统一管理写入、查询与导入校验。
- **思考**：结构化存储比散落提示词更可管理；错误或跨范围记忆可能持续影响后续决策。
- **建议**：先记录少量明确偏好，测试修改和删除后是否停止影响回答，再扩展自动积累。

## 场景与替代办法

反复在项目间切换的使用者需要可管理的长期偏好和决策，而非无差别保存聊天。

项目说明和人工摘要仍是更透明的低复杂度替代；本轮只确认机制，不宣布优于其他记忆插件。

## 依赖与流程

需要相应宿主存储和注入服务；有效性依赖记忆质量、作用域和所用模型。

保存偏好和决策后检索使用，发现冲突时修改或删除；迁移前导出并核对关系与审计范围。

## 成本与效果

记忆抽取、注入和纠错有模型及人工开销；没有测量净节省 token 或重复任务收益。

结构化存储比散落提示词更可管理；错误或跨范围记忆可能持续影响后续决策。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：packages/plugin-memory；内容摘要：f207e6802abddb05860d5f4996fe3ae286fe60cb82a4c10c884374146423127f。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 67 | — | — | 1250 |
| .mjs | source | 1 | 31 | 16 | 10 | — |
| .ts | source | 25 | 6528 | 5384 | 651 | — |
| .tsx | source | 10 | 1596 | 1436 | 107 | — |

排除 1 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：记忆查询和维护工具由组件接线提供。

## 工程亮点

持久化成功后再更新可见状态及集中 bundle 校验可借鉴，迁移需带上领域数据和关系。

## 分发与兼容

组件 @zzerx/dsh-plugin-memory 0.4.3，依赖 storageDomain、systemPrompt 与工具服务。

## 历史对照

前次代码指纹为 acb136c0dbbf8e984bdffea9de48b6ed73d0103e；本轮固定为 acb136c0dbbf8e984bdffea9de48b6ed73d0103e。项目说明和人工摘要仍是更透明的低复杂度替代；本轮只确认机制，不宣布优于其他记忆插件。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读存储服务与接线，未评测记忆命中率、冲突解决或跨项目泄漏。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用两项目相反偏好和一次纠错任务，核对召回、隔离、删除效果与额外调用。

## Issue 活跃度

Issue：未关闭 0／已关闭 0 · 近30天：新建 0／关闭 0／更新 0

统计日期：2026-10-20。
