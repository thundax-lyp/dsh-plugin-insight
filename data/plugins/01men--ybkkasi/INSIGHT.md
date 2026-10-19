<!-- Generated detail view; research source and checkpoint remain unchanged. -->
# 元冰可 ybkkasi

- **用途**：统一管理企业的 MCP、Skill、Agent、应用、权限、用量与审计资产。
- **亮点**：以资源本体、身份、计量和审批贯通多个业务域，提供独立宿主及 DSH 桥接两种接入。
- **思考**：它是平台型工程而非轻量增效插件；DSH 形态仍为 experimental，治理模型是否贴合现有业务比功能数量更重要。
- **建议**：有多团队资产治理痛点时先评估独立测试实例与最小域，个人使用不建议为一个需求部署整个平台。

## 固定范围与依据

组件 github:1416699252:root，路径 仓库根，固定提交 [03f74c847c8af9189ce37a73321a730ceb353f2a](https://github.com/01men/ybkkasi/tree/03f74c847c8af9189ce37a73321a730ceb353f2a/)。本轮 20261019T091725Z-init10，核查于 2026-10-19T09:30:10.728Z。
材料：[源码快照](../../runs/2026-10-19-03/snapshots/01men--ybkkasi/SOURCE.json)、[仓库与发布记录](../../runs/2026-10-19-03/snapshots/01men--ybkkasi/REPOSITORY.json)、[统计产物](../../runs/2026-10-19-03/snapshots/01men--ybkkasi/INVENTORY.json)、[META](../../runs/2026-10-19-03/snapshots/01men--ybkkasi/META.json)。目录来源固定版本见[本轮报告](../../runs/2026-10-19-03/REPORT.md)。

## 场景、替代办法与合格交付

面向需要厘清谁能调用什么、费用归谁和出了问题如何追踪的企业平台团队。合格交付物是授权可撤销、调用可归属且账目可核对；基线是现有 IAM、API 网关、费用报表和审批台账，不能直接据作者新品类表述推导市场需求已验证。

## 实现机制与依据

cordis.patch.yml 顺序装配 platform-core、身份、资源、计量、业务域和桥；plugin-workforce/src/index.ts 串联 permit、调用与交付服务，经 workforcePolicy 窄端口注册。独立入口 node src/main.ts 与 DSH 工具桥共享业务代码。

本轮重点审读：[src/main.ts](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/src/main.ts)、[cordis.patch.yml](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/cordis.patch.yml)、[packages/plugin-workforce/src/index.ts](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-workforce/src/index.ts)、[packages/plugin-dsh-bridge/src/index.ts](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-dsh-bridge/src/index.ts)。固定文本材料已保存；完整文件统计不表示每行代码都经过人工审计。

## 安装与效果依赖

源码要求 Node >=22.6，使用原生 TS 与 node:sqlite；独立部署依赖 Cordis 运行时和平台数据目录。DSH 接入声明 >=0.1.0-rc.7 <0.2.0 且 experimental；连接器还可能需要 open-connector sidecar、OAuth与外部账户。生产需规划持久化、备份、身份和 TLS，而不只是能启动首页。

发布核查：根包 private=true，未按同名 npm 包推断发布归属。

## 用户、后台与失败流程

盘点资产和权限 → 部署独立测试实例 → 创建组织／主体／资源 → 接入一个 MCP或模型渠道 → 受控调用 → 核对计量与审计 → 演练冻结／吊销／失败恢复。DEMO_MODE 的免登只读演示不能接真实业务数据。

## 首次、持续与迁移成本

首次成本集中在权限映射、资产录入、账号接入与运维；持续包括数据库与备份、审计留存、渠道费用及策略维护。迁移涉及多域数据和身份关系，远高于装一个 UI 插件。没有实测企业工作负载，不能用作者自测断言数推算可靠性。

## 工程规模与能力清单

| 扩展名 | 范围 | 文件数 | 总行数 | Markdown字数 | 代码行 |
|---|---|---:|---:|---:|---:|
| .ts | source | 142 | 47911 | — | 37479 |
| .md | source | 143 | 21547 | 371639 | — |
| .mjs | source | 25 | 13700 | — | 9306 |
| .js | source | 54 | 20972 | — | 18829 |
| .mjs | test | 21 | 4505 | — | 3624 |
| .tsx | source | 2 | 267 | — | 194 |

口径：sloc 0.3.2／TypeScript 5.9.3，固定提交全仓根组件；仅 Markdown 与 JS／TS。Markdown 字数含标记和代码；各扩展名分列，不合成跨语言总量。scripts中的验证脚本按当前路径启发式可能归source，其数量不等于产品代码量。
生成、复制和第三方归属仍需人工辨认：lib若是交付构建结果，会与src重复，不相加为原创规模；本表保留实际收录文件面积。默认排除项及路径见统计JSON，声明文件、build/dist、依赖与其他扩展名不计。

全仓未发现正式 SKILL.md，skills目录的普通材料不按入口计数。Agent资源管理与演示员工不是 DSH Agent/Preset 定义；静态提取不能给出全平台已确认工具总数，目录声明的 83 工具／27 包／1486 断言不作为本轮独立确认数量。

自动提取的Agent、工具、事件／UI候选及未解析位置保存在统计JSON；confirmed_count=null不改成运行时确认。本条为整个平台根组件，不能把全仓规模分摊为某一个业务插件大小。

## 代码评价与可借鉴处

平台域和服务端口有明确分层，声明跨域通过事件／扩展点协作；workforce 模块把身份从执行上下文读取而不是接受 args 传入，值得关注。全仓统计含平台、控制台和脚本，不代表一个子插件大小；本轮抽读启动、桥接和员工授权链，未审遍全部域。

可借鉴资源本体、用途受限 permit、可追溯计量与授权窄端口；应先复制一个受控调用闭环和契约测试，而非整体照搬二十多个包。复用成本在业务身份映射和失效／撤销语义。

上述工程判断依据：[src/main.ts](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/src/main.ts)、[cordis.patch.yml](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/cordis.patch.yml)、[packages/plugin-workforce/src/index.ts](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-workforce/src/index.ts)、[packages/plugin-dsh-bridge/src/index.ts](https://github.com/01men/ybkkasi/blob/03f74c847c8af9189ce37a73321a730ceb353f2a/packages/plugin-dsh-bridge/src/index.ts)。

## 采用判断与最小验证

隔离实例只接一个测试 MCP：同一操作分别用允许、拒绝、过期、撤销主体执行，核对副作用与计费只发生一次，再做并发、重启和备份恢复。若不能同时解释授权和费用归属，暂不进入生产。

## 历史对照与验证边界

本条首次纳入本工程深评；added表示相对上轮三插件样本新增，不是本周新发布。 作者报告、静态核查和独立执行分开：本轮重新阅读固定源码／配置／测试，未运行目标代码、未安装目标插件、未做真实宿主验收或模型任务对照。仓库自测、发布说明属于作者材料，未作为独立通过证据。Issue数量只作背景，不证明独立采用或实际收益。

## Issue 活跃度

Issue：未关闭 0／已关闭 0 · 近30天：新建 0／关闭 0／更新 0

统计日期：2026-10-19。Issue 不含 PR。
