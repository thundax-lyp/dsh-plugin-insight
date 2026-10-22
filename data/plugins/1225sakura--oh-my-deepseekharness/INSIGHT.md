# oh-my-dsh

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[f38d8a6](https://github.com/1225Sakura/oh-my-deepseekharness/tree/f38d8a6cffca4d2beb97e3cdd53208794163b92f)

<!-- BEGIN META -->
[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=yellow&logo=github&style=flat)](https://github.com/1225Sakura/oh-my-deepseekharness) [![npm 30d 2,166](https://img.shields.io/static/v1?label=npm+30d&message=2%2C166&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness) [![最新发布 2026-10-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness)
<!-- END META -->

> **实现功能**：为 DSH 提供角色、Skill 与多智能体协调协议，支持自动推进和显式团队流程。

> **核心亮点**：入口注入协议并注册资产、命令和 MCP，team 模块维护阶段、队员身份与邮箱；实际派发与合并仍由领队模型驱动。

> **风险与缺陷**：统一委派与恢复数据面可降低自建成本；多代理可能放大误解、冲突和预算超支。

<a id="detail-section-1"></a>

## 1 用途与适用场景

> **用途**：复杂开发任务需要规划、委派与验证分工，用户希望复用一套宿主适配的编排约定。

原生单 agent 与有限手工委派是对照；只有复杂可拆分任务才值得增加协调层。

<a id="detail-section-2"></a>

## 2 能力与限制

**能力**

- **Skill**：编排和角色资产注册。
- **后台**：能力探测、团队心跳与内置 MCP server 接入。

**流程与依赖**

依赖 DSH 核心服务、subagents、storage 与模型；MCP、代码智能和工作树路径各有失败边界。

确认模式并规划、派发、收集结果、验证和整合；停滞时先看探测与阶段状态，必要时取消接管。

**兼容条件**

版本 0.4.9，要求较新的 DSH 服务组合，可选 AST/LSP 能力缺失时降级；不是零依赖协议包。

**效果与成本**

多角色和多轮评审增加模型、上下文与状态维护成本，不能以并行数量推断更快更省。

> **思考**：统一委派与恢复数据面可降低自建成本；多代理可能放大误解、冲突和预算超支。

<a id="detail-section-3"></a>

## 3 工程分析

> **亮点**：入口注入协议并注册资产、命令和 MCP，team 模块维护阶段、队员身份与邮箱；实际派发与合并仍由领队模型驱动。

能力探测、降级公告、终态限制和心跳只报告不自动杀有可借鉴性；集成面大意味着持续适配负担。

<a id="detail-section-4"></a>

## 4 使用建议

先验装探测与取消，再对单仓库小任务比较原生单 agent 和一条显式 team 流程。

<a id="detail-section-5"></a>

## 5 核查说明

**核查状态**：已检查源码。

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：作者报告的测试数未在本轮复跑；状态机与心跳不证明团队产出质量或自动协调收敛。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：固定任务和预算，测试派发失败、心跳过期、取消、冲突合并和重复恢复，核对合格交付率及总费用。

**分析版本**

固定提交 [f38d8a6](https://github.com/1225Sakura/oh-my-deepseekharness/tree/f38d8a6cffca4d2beb97e3cdd53208794163b92f)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 170 | 21855 | — | — | 256566 |
| .mjs | source | 17 | 2619 | 2171 | 300 | — |
| .js | source | 29 | 5996 | 4382 | 1280 | — |
| .js | test | 45 | 10002 | 8560 | 899 | — |
| .mjs | example | 1 | 83 | 74 | 5 | — |
| .mjs | test | 1 | 63 | 41 | 15 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1225Sakura/oh-my-deepseekharness/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/1225Sakura/oh-my-deepseekharness/issues?q=is%3Aissue+created%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1225Sakura/oh-my-deepseekharness/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z)



统计日期：2026-10-22。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
