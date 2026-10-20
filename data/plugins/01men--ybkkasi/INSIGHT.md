# 元冰可 ybkkasi

> 自托管企业 AI 资源管理平台，统一纳管 MCP、Skill、Agent 和应用，提供身份、权限、计量与审计。

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/01men/ybkkasi) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-enterprise-ops) · [![最后更新 今天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E4%BB%8A%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/01men/ybkkasi/commits)
<!-- END META -->

## 版本

固定提交 [03f74c847c8af9189ce37a73321a730ceb353f2a](https://github.com/01men/ybkkasi/tree/03f74c847c8af9189ce37a73321a730ceb353f2a)

## 采用点评

- **用途**：面向需要厘清谁能调用什么、费用归谁和出了问题如何追踪的企业平台团队。合格交付物是授权可撤销、调用可归属且账目可核对；基线是现有 IAM、API 网关、费用报表和审批台账，不能直接据作者新品类表述推导市场需求已验证。
- **亮点**：自托管企业 AI 资源管理平台，统一纳管 MCP、Skill、Agent 和应用，提供身份、权限、计量与审计。
- **思考**：首次成本集中在权限映射、资产录入、账号接入与运维；持续包括数据库与备份、审计留存、渠道费用及策略维护。迁移涉及多域数据和身份关系，远高于装一个 UI 插件。没有实测企业工作负载，不能用作者自测断言数推算可靠性。 本轮未测合格任务成本、耗时或可靠性。 本轮未测合格任务成本、耗时或可靠性。
- **建议**：有多团队资产治理痛点时先评估独立测试实例与最小域，个人使用不建议为一个需求部署整个平台。

## 场景、原有办法与合格交付

目标场景是：面向需要厘清谁能调用什么、费用归谁和出了问题如何追踪的企业平台团队。合格交付物是授权可撤销、调用可归属且账目可核对；基线是现有 IAM、API 网关、费用报表和审批台账，不能直接据作者新品类表述推导市场需求已验证。 原有办法通常是使用宿主原生入口、独立脚本或人工流程；本轮没有对这些基线做运行对比。合格交付至少应同时满足功能结果正确、可恢复、没有越权副作用，并让总人工负担不高于基线。

## 依赖与使用条件

- 固定组件包：`dsh-enterprise-ops@1.3.0`。
- 声明依赖：未在组件 package.json 声明直接或 peer 依赖；宿主接线仍需按源码核对。
- 效果依赖：输入数据、宿主版本、外部服务/浏览器能力与人工复核需按具体任务确认。
- 失效时应回退到宿主原生入口或人工流程；本轮未验证安装、卸载或迁移。

## 使用流程、失败恢复与成本

准备阶段需安装固定版本并检查配置/权限；执行阶段由源码中的入口接收任务；结果仍需人工验收。异常时优先停用插件、保存原始输入与日志并回退基线，不假设自动恢复。首次成本包括安装与配置，持续成本包括上下文/模型或外部服务、复核和失败重试，迁移成本包括数据导出与清理；本轮没有运行测量，不能给出 ROI、单位任务成本或效果排名。

## 工程统计

| 范围 | 扩展名 | 文件 | 总行 | 代码 | 注释 | 空行 | Markdown 词 |
|---|---:|---:|---:|---:|---:|---:|---:|
| source | .ts | 142 | 47911 | 37479 | 7083 | 3573 | — |
| source | .md | 143 | 21547 | — | — | — | 371639 |
| source | .mjs | 25 | 13700 | 9306 | 3933 | 836 | — |
| source | .js | 54 | 20972 | 18829 | 1235 | 1064 | — |
| test | .mjs | 21 | 4505 | 3624 | 653 | 357 | — |
| source | .tsx | 2 | 267 | 194 | 53 | 21 | — |

统计覆盖：git tracked files at exact commit; component scope only。排除项：无自动排除项。解析错误：未记录。

## 能力清单

- **模型工具**：billing_wallet_balance、agent_list、agent_get、agent_offline、agent_metrics、agent_metrics_report、agent_bind_user、app_list、app_topology、app_metrics

- tools：`billing_wallet_balance`（[archive/plugin-billing/src/tools.ts:13](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/archive/plugin-billing/src/tools.ts#L13)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`agent_list`（[packages/plugin-agent/src/tools.ts:14](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-agent/src/tools.ts#L14)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`agent_get`（[packages/plugin-agent/src/tools.ts:39](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-agent/src/tools.ts#L39)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`agent_offline`（[packages/plugin-agent/src/tools.ts:59](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-agent/src/tools.ts#L59)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`agent_metrics`（[packages/plugin-agent/src/tools.ts:80](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-agent/src/tools.ts#L80)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`agent_metrics_report`（[packages/plugin-agent/src/tools.ts:93](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-agent/src/tools.ts#L93)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`agent_bind_user`（[packages/plugin-agent/src/tools.ts:117](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-agent/src/tools.ts#L117)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`app_list`（[packages/plugin-app/src/tools.ts:13](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-app/src/tools.ts#L13)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`app_topology`（[packages/plugin-app/src/tools.ts:34](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-app/src/tools.ts#L34)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`app_metrics`（[packages/plugin-app/src/tools.ts:47](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-app/src/tools.ts#L47)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`app_metrics_report`（[packages/plugin-app/src/tools.ts:60](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-app/src/tools.ts#L60)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`app_cost_breakdown`（[packages/plugin-app/src/tools.ts:90](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-app/src/tools.ts#L90)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`audit_logs`（[packages/plugin-audit/src/tools.ts:13](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-audit/src/tools.ts#L13)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`audit_alerts_list`（[packages/plugin-audit/src/tools.ts:29](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-audit/src/tools.ts#L29)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`audit_alerts_read_all`（[packages/plugin-audit/src/tools.ts:44](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-audit/src/tools.ts#L44)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`approval_decide`（[packages/plugin-audit/src/tools.ts:55](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-audit/src/tools.ts#L55)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`audit_cost_report`（[packages/plugin-audit/src/tools.ts:78](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-audit/src/tools.ts#L78)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`authn_token_issue`（[packages/plugin-authn/src/tools.ts:14](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-authn/src/tools.ts#L14)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`authn_token_revoke`（[packages/plugin-authn/src/tools.ts:35](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-authn/src/tools.ts#L35)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`authn_token_list`（[packages/plugin-authn/src/tools.ts:50](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-authn/src/tools.ts#L50)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`authn_credential_create`（[packages/plugin-authn/src/tools.ts:75](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-authn/src/tools.ts#L75)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`authn_credential_scopes`（[packages/plugin-authn/src/tools.ts:102](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-authn/src/tools.ts#L102)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`authn_credential_rotate`（[packages/plugin-authn/src/tools.ts:119](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-authn/src/tools.ts#L119)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`connect_code_create`（[packages/plugin-connect/src/host.ts:387](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-connect/src/host.ts#L387)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`connect_codes`（[packages/plugin-connect/src/host.ts:418](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-connect/src/host.ts#L418)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`connect_clients`（[packages/plugin-connect/src/host.ts:439](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-connect/src/host.ts#L439)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`connect_client_disable`（[packages/plugin-connect/src/host.ts:460](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-connect/src/host.ts#L460)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`connect_status`（[packages/plugin-connect/src/index.ts:92](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-connect/src/index.ts#L92)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`connect_setup`（[packages/plugin-connect/src/index.ts:103](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-connect/src/index.ts#L103)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`connect_login`（[packages/plugin-connect/src/index.ts:131](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-connect/src/index.ts#L131)）；确认固定源码存在对应注册/入口，未验证运行时可用性。

## 工程亮点

固定组件内共纳入 387 个 JS/TS/Markdown 文件。组件声明依赖较少，但仍不能据此推断运行简单或无外部依赖。 静态解析未记录错误。 代码与文档支持对核心接线做源码级判断，但错误恢复、持久化一致性和外部副作用仍需针对实际任务验证。关键核查入口：[src/boot-all.ts](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/src/boot-all.ts)。


cordis.patch.yml 顺序装配 platform-core、身份、资源、计量、业务域和桥；plugin-workforce/src/index.ts 串联 permit、调用与交付服务，经 workforcePolicy 窄端口注册。独立入口 node src/main.ts 与 DSH 工具桥共享业务代码。 复用时仍应单独确认宿主 API、数据生命周期、失败恢复和最小验收任务，不能只复制注册代码。

## 核查说明

- 历史对照：同一固定提交的既有结论已重新阅读并绑定本轮证据；未直接沿用旧检查时间。
- 已检查材料：目录条目、固定提交 README/package、关键源码和完整组件 inventory。
- 未完成验证：未执行插件测试，未安装到 DSH，未做真实宿主、模型、外部服务或业务结果验收。
- 证据限制：作者声明与源码机制只支持条件判断，不证明性能、安全性、可靠性或采用收益。

## Issue 活跃度

Issue：未关闭 0／已关闭 0 · 近30天：新建 0／关闭 暂未获取／更新 暂未获取

统计日期：2026-10-19。
