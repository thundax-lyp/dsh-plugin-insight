# Forge 记忆

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[acb136c](https://github.com/0x7A7A6572/dsh-forge-studio/tree/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-memory)

<!-- BEGIN META -->
[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 2,223](https://img.shields.io/static/v1?label=npm+30d&message=2%2C223&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-memory) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-memory)
<!-- END META -->

> **实现功能**：为 DSH 保存偏好、项目决策与关系化记忆，支持检索和跨会话使用。

> **核心亮点**：storage-domain 支撑实体、关系和审计记录，服务统一管理写入、查询与导入校验。

> **风险与缺陷**：结构化存储比散落提示词更可管理；错误或跨范围记忆可能持续影响后续决策。

<a id="detail-section-1"></a>

## 1 用途与适用场景

> **用途**：反复在项目间切换的使用者需要可管理的长期偏好和决策，而非无差别保存聊天。

项目说明和人工摘要仍是更透明的低复杂度替代；本轮只确认机制，不宣布优于其他记忆插件。

<a id="detail-section-2"></a>

## 2 能力与限制

**能力**

- **模型工具**：记忆查询和维护工具由组件接线提供。

**流程与依赖**

需要相应宿主存储和注入服务；有效性依赖记忆质量、作用域和所用模型。

保存偏好和决策后检索使用，发现冲突时修改或删除；迁移前导出并核对关系与审计范围。

**兼容条件**

组件 @zzerx/dsh-plugin-memory 0.4.3，依赖 storageDomain、systemPrompt 与工具服务。

**效果与成本**

记忆抽取、注入和纠错有模型及人工开销；没有测量净节省 token 或重复任务收益。

> **思考**：结构化存储比散落提示词更可管理；错误或跨范围记忆可能持续影响后续决策。

<a id="detail-section-3"></a>

## 3 工程分析

> **亮点**：storage-domain 支撑实体、关系和审计记录，服务统一管理写入、查询与导入校验。

持久化成功后再更新可见状态及集中 bundle 校验可借鉴，迁移需带上领域数据和关系。

<a id="detail-section-4"></a>

## 4 使用建议

先记录少量明确偏好，测试修改和删除后是否停止影响回答，再扩展自动积累。

<a id="detail-section-5"></a>

## 5 核查说明

**核查状态**：已检查源码。

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读存储服务与接线，未评测记忆命中率、冲突解决或跨项目泄漏。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用两项目相反偏好和一次纠错任务，核对召回、隔离、删除效果与额外调用。

**分析版本**

固定提交 [acb136c](https://github.com/0x7A7A6572/dsh-forge-studio/tree/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-memory)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 67 | — | — | 1250 |
| .mjs | source | 1 | 31 | 16 | 10 | — |
| .ts | source | 25 | 6528 | 5384 | 651 | — |
| .tsx | source | 10 | 1596 | 1436 | 107 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/issues?q=is%3Aissue+created%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z)



统计日期：2026-10-22。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
