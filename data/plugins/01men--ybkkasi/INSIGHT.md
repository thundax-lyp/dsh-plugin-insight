# 元冰可 AI 资源治理平台

> 以 Cordis 插件树组织企业 AI 资源、身份权限、模型与数字员工治理。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[d42aa3b](https://github.com/01men/ybkkasi/tree/d42aa3bb5925f1f8be7c92337682d006484ec413)

<!-- BEGIN META -->

<!-- END META -->

**使用建议**：已有多用户治理需求的团队先在隔离环境跑一条业务链；核对拒绝、例外入口与备份恢复，再扩部门和资源，避免把启动健康当业务验收。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
- [未来设计假设（未验证）](#detail-section-7)
- [辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：已有多部门AI资源的管理员需要统一资源责任、授权与审计，交付受控访问和治理记录；单用户可先用配置文件加API网关。

- **建议**：待验证假设：从routeMatrix生成主体×权限×副作用清单，再与实际存储写入/公开入口逐一比对，可更早发现漏接治理。由注册声明集中但覆盖尚未完整验证推导，未实现自动覆盖证明。选两个部门及一条MCP业务链，测试许可、拒绝、public例外、令牌吊销与审计写失败；若越权写入或无审计变更存在则否定治理闭环，维护映射人时应单列。

已有多用户治理需求的团队先在隔离环境跑一条业务链；核对拒绝、例外入口与备份恢复，再扩部门和资源，避免把启动健康当业务验收。

核查状态：当前11类findings与评分重新核对；启动和共享鉴权集成可见，未全量审计业务路由、运行平台或做宿主验收，未来覆盖检测是假设。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

参照分散鉴权、配置文件+API网关及Cordis插件装配；无其他平台性能或采用比较。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **Host 路由**：共享权限声明gate与console身份鉴权。
- **后台**：独立Context、存储恢复和依赖装配健康检查。

**流程与依赖**

src/main.ts建独立Context，bootAll按依赖恢复存储/装配并检查必需服务；console中间件验证Bearer或演示主体，rest-gate消费principal注册权限声明并记录拒绝与变更审计。

Node/Cordis及平台存储、authn/iam/audit/HTTP总线；独立宿主与DSH bundle有不同版本条件，console principal来源和公开例外需核对。

恢复存储→依赖序挂插件→健康检查→管理员建组织资源角色→请求身份验证→gate权限→业务副作用/审计；SIGINT flushNow不证明异常断电恢复。

根包private，独立平台入口与DSH集成形态须分别核实；不将根仓库视为任意新版DSH可安装bundle。

**效果与成本**

首次配置组织/账号/域/资源迁移，持续维护权限、审计备份和升级；服务模型费用另计，现金与人工没有同条件实测。

减少授权散落和资源责任不清；是否优于现成网关取决于组织规模、迁移与维护成本，无独立采用收益证据。

- **思考**：共享gate是否证明所有入口受同一治理？console是principal构造点，bootAll也明确portal公开只读先于console，部分public path内部自校验；只审gate不能推断全入口覆盖。IMPLIED_POINTS在前端有镜像，声明与真实写副作用可能漂移；审计record调用也不等于事务已持久化，需故障恢复和越权反例。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对业务路由重复鉴权样板，增量是将principal、权限点、路由声明和审计主体统一到rest-gate接口，并在bootAll恢复存储后做装配健康检查。Cordis依赖树与通用RBAC归既有方法，插件贡献是企业AI资源治理接线与责任归属，不是由模块规模推导创新。

相对业务路由重复鉴权样板，增量是将principal、权限点、路由声明和审计主体统一到rest-gate接口，并在bootAll恢复存储后做装配健康检查。Cordis依赖树与通用RBAC归既有方法，插件贡献是企业AI资源治理接线与责任归属，不是由模块规模推导创新。

createRestGate以最小结构注入减少业务反向依赖，缺audit时changeLog快速失败，bootAll assertSingleRoot/probeTree拒绝装配不完整值得借鉴；身份与审计事务语义仍要配套。

固定源码依据：[src/main.ts](https://github.com/01men/ybkkasi/blob/d42aa3bb5925f1f8be7c92337682d006484ec413/src/main.ts)、[src/boot-all.ts](https://github.com/01men/ybkkasi/blob/d42aa3bb5925f1f8be7c92337682d006484ec413/src/boot-all.ts)、[packages/platform-core/src/rest-gate.ts](https://github.com/01men/ybkkasi/blob/d42aa3bb5925f1f8be7c92337682d006484ec413/packages/platform-core/src/rest-gate.ts)、[packages/plugin-console/src/index.ts](https://github.com/01men/ybkkasi/blob/d42aa3bb5925f1f8be7c92337682d006484ec413/packages/plugin-console/src/index.ts)、[package.json](https://github.com/01men/ybkkasi/blob/d42aa3bb5925f1f8be7c92337682d006484ec413/package.json)。

<a id="detail-section-5"></a>

### 主要限制

共享gate是否证明所有入口受同一治理？console是principal构造点，bootAll也明确portal公开只读先于console，部分public path内部自校验；只审gate不能推断全入口覆盖。IMPLIED_POINTS在前端有镜像，声明与真实写副作用可能漂移；审计record调用也不等于事务已持久化，需故障恢复和越权反例。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：1.3.0；版本日期：2026-10-21（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[d42aa3bb](https://github.com/01men/ybkkasi/tree/d42aa3bb5925f1f8be7c92337682d006484ec413)；本轮基准：2026-10-21T04:06:46Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：抽读启动、bootAll、REST gate与console principal/例外路径；未审全部业务域、数据库事务与数字员工动作。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

待验证假设：从routeMatrix生成主体×权限×副作用清单，再与实际存储写入/公开入口逐一比对，可更早发现漏接治理。由注册声明集中但覆盖尚未完整验证推导，未实现自动覆盖证明。选两个部门及一条MCP业务链，测试许可、拒绝、public例外、令牌吊销与审计写失败；若越权写入或无审计变更存在则否定治理闭环，维护映射人时应单列。

隔离平台检查路由×权限×副作用覆盖、未授权写、演示只读、public端点自校验、审计失败和重启恢复；本轮未执行目标。

<a id="detail-section-8"></a>

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

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/01men/ybkkasi/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
