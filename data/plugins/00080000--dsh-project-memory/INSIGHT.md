# dsh-project-memory

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[21fc69e](https://github.com/00080000/dsh-project-memory/tree/21fc69e3e98f3864677e091477b7d543a0e54939)

<!-- BEGIN META -->
[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) [![npm 30d 4,533](https://img.shields.io/static/v1?label=npm+30d&message=4%2C533&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory)
<!-- END META -->

> **实现功能**：为项目保存任务、文档、代码符号与经验记录，支持跨会话检索和按条件注入。

> **核心亮点**：session 事件同步任务，工具负责索引和检索；when 触发与 guard 收窄限制经验注入。

> **风险与缺陷**：任务与文件关联有助于定位；错误经验也会持久化，引用存在不代表当前结论正确。

<a id="detail-section-1"></a>

## 1 用途与适用场景

> **用途**：长周期开发者在换会话时找回任务及文件依据，交付物是可定位的上下文。

手写项目摘要更轻；本轮代码指纹已变，应重新检查注入策略，不能继承旧效果判断。

<a id="detail-section-2"></a>

## 2 能力与限制

**能力**

- **模型工具**：入口注册任务管理、文档索引和项目记忆检索工具。
- **用户命令**：/tasks 汇集任务与经验的交互入口。

**流程与依赖**

依赖 DSH tools、llm 及 session 事件；项目磁盘可写，增强检索还依赖本地向量资源。

正常工作积累索引，再查询和核对引用；错误条目须主动修订，迁移时携带对应项目存储。

**兼容条件**

包声明 0.6.3、src/index.js 入口；源码提交与 npm tarball 未做全量比对。

**效果与成本**

需维护项目索引和纠错；可选向量表及查询扩展增加存储或模型调用，未测总成本。

> **思考**：任务与文件关联有助于定位；错误经验也会持久化，引用存在不代表当前结论正确。

<a id="detail-section-3"></a>

## 3 工程分析

> **亮点**：session 事件同步任务，工具负责索引和检索；when 触发与 guard 收窄限制经验注入。

入口装配与注入准入分离，可借鉴反自激与预算闸门；复用需适配 session 身份。

<a id="detail-section-4"></a>

## 4 使用建议

先在一个可丢弃项目中测试旧结论纠错和跨项目隔离，再决定是否长期启用。

<a id="detail-section-5"></a>

## 5 核查说明

**核查状态**：已检查源码。

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读入口和注入闸门，未审计全部解析器或测量检索召回率。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用含过期结论的固定任务集比较手写摘要，记录纠错率、无关注入和人工分钟。

**分析版本**

固定提交 [21fc69e](https://github.com/00080000/dsh-project-memory/tree/21fc69e3e98f3864677e091477b7d543a0e54939)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 2263 | — | — | 48510 |
| .js | source | 53 | 14366 | 10430 | 3414 | — |
| .mjs | source | 6 | 1447 | 1189 | 156 | — |
| .ts | source | 9 | 1343 | 937 | 324 | — |
| .tsx | source | 5 | 1563 | 1333 | 151 | — |
| .mjs | test | 41 | 9671 | 7738 | 1204 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/00080000/dsh-project-memory/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
