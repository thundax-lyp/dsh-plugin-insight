# 元冰可 AI 资源治理平台

> 以 Cordis 插件树整合组织、权限、模型、MCP 与数字员工资源治理。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[d3cdcd2](https://github.com/01men/ybkkasi/tree/d3cdcd2d1923c98d81159484bde36504a5e1338d)

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/01men/ybkkasi)
<!-- END META -->

**使用建议**：适合已有明确多用户治理需求的团队先部署隔离环境；以最小权限、一条业务链和备份恢复作为采用门槛。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [核查说明与分析版本](#detail-section-5)
- [未来设计假设（未验证）](#detail-section-6)
- [辅助信息](#detail-section-7)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：面向已拥有多部门 AI 服务的管理员，交付可追溯的资源归属、授权与访问审计；小型单用户环境的替代办法是配置文件和现成网关。

适合已有明确多用户治理需求的团队先部署隔离环境；以最小权限、一条业务链和备份恢复作为采用门槛。

核查状态：源码支持本文所述机制与有限集成贡献；效果、宿主兼容和独立采用未验证。未来设计假设仅为推演，未实现、未验证。 只执行研究工程的统计/装配与结构验证，未安装插件、运行目标代码/测试或做真实宿主验收。

<a id="detail-section-3"></a>

### 能力、流程与成本

比较基线是分散路由鉴权、配置文件加 API 网关；

独立入口建立 Cordis Context 并调用 bootAll；共享 REST gate 从 exchange.principal 消费身份，把 permission 声明挂到路由注册，同时记录拒绝事件与变更审计。


Node >=22.6、Cordis 4.0.4 与平台存储为独立宿主必要条件；DSH bundle 声明 >=0.1.0-rc.7 <0.2.0，仅 web，不能外推到新宿主。身份可信性依赖 console 中间件，备份恢复依赖 opsStorage。

管理员部署平台并建立组织/资源/角色；请求经身份中间件、权限 gate、业务处理器后写审计；失败由管理员核对拒绝日志和存储。SIGINT/SIGTERM 调 flushNow 后退出，但未实际验证故障恢复。

初装需域配置、账号和资源迁移；持续成本是权限维护、备份与升级，人时未测。模型/API 现金费归各服务，不能从平台代码行数估算收益。

价值是减少授权逻辑散落和资源责任不清；是否比现有网关加资产清单更经济取决于组织规模，当前无独立采用或收益实测。

- **Host 路由**：共享gate注册权限声明并在业务处理前检查权限。
- **后台**：独立Context与bootAll装配平台服务。

- **思考**：最强支持是 guarded 和 changeLog 的集中实现；关键缺口是 gate 只消费 principal，不证明每个业务入口都由可信中间件赋值，也不证明所有写路由都使用 gate。console.read 蕴含 console.login 的镜像规则还要求前后端同步。若存在绕过入口，统一治理主张需进一步收窄。

<a id="detail-section-4"></a>

### 工程贡献

可借鉴 createRestGate 的结构类型注入和 actorOf/workCallerOf：共用可信身份但不反向依赖业务插件。移植需统一 principal 契约、事件总线与审计存储，不能只复制 requirePermission。

根包 private，版本 1.3.0；独立平台可启动入口存在，但当前不是已验证的任意 DSH 可安装包。

固定源码依据：[packages/platform-core/src/rest-gate.ts L76–111](https://github.com/01men/ybkkasi/blob/d3cdcd2d1923c98d81159484bde36504a5e1338d/packages/platform-core/src/rest-gate.ts#L76-L111)；[src/main.ts L5–22](https://github.com/01men/ybkkasi/blob/d3cdcd2d1923c98d81159484bde36504a5e1338d/src/main.ts#L5-L22)。上述贡献与关键质疑均限定于这些固定源码，不把测试文件存在当运行通过。

- **亮点**：相对各业务路由各写鉴权，贡献是将权限点、路由声明和审计主体收敛成共享接口。rest-gate 中 guarded 在处理器前判断权限，changeLog 缺 audit 时拒绝静默丢记录；这是可核查的治理集成增量，Cordis 插件化本身归上游。

<a id="detail-section-5"></a>

### 核查说明与分析版本

- 版本依据：仓库：[01men/ybkkasi](https://github.com/01men/ybkkasi)；固定提交：[d3cdcd2d](https://github.com/01men/ybkkasi/tree/d3cdcd2d1923c98d81159484bde36504a5e1338d)；版本号：1.3.0；版本日期：2026-10-21（固定提交日期，北京时间，非包发布日期）。
- 已检查与未覆盖范围：平台规模大，仅抽读启动、bootAll与共享REST gate，未审计全部业务路由、持久化和数字员工链。
- 证据限制：作者功能摘要来自固定版本README；未核实独立用户采用、同条件效果或端到端收益。版本、证据原文与inventory绑定保存在本项JSON；GitHub/npm统计仅作背景，不构成采用证明。

<a id="detail-section-6"></a>

## 未来设计假设（未验证）

待验证假设：从路由注册声明生成“主体×权限×副作用”清单，再与实际写资源路径做覆盖比对，可能比逐页面验收更早发现漏接线。推导自声明已集中而授权覆盖尚未完整审计；新增成本是维护写资源映射。

最小验证与否定条件：先选两个部门、一个 MCP 资源，按许可与拒绝各执行一遍；同时枚举直接 httpServer.register 写路由与 guarded 使用点。若未授权写入仍发生或拒绝没有对应审计，则不能认可统一治理闭环；另做令牌吊销和重启恢复验收。

<a id="detail-section-7"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 142 | 47911 | 37479 | 7083 | — |
| .md | source | 144 | 21658 | — | — | 372687 |
| .mjs | source | 26 | 14441 | 9883 | 4046 | — |
| .js | source | 54 | 20972 | 18829 | 1235 | — |
| .mjs | test | 21 | 4505 | 3624 | 653 | — |
| .tsx | source | 2 | 267 | 194 | 53 | — |

排除 0 项；解析错误 0 项。统计为固定Git范围，源码抽读不冒充全面审计；JS/TS与Markdown分别计量。默认排除为启发式，不能从LOC推算原创量或工时。

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/01men/ybkkasi/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/01men/ybkkasi/issues?q=is%3Aissue+created%3A2026-09-21T02%3A00%3A29.529Z..2026-10-21T02%3A00%3A29.529Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/01men/ybkkasi/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T02%3A00%3A29.529Z..2026-10-21T02%3A00%3A29.529Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
