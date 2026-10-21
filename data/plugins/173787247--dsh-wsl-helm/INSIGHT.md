# dsh-wsl-helm

> 在DSH内查询Helm发布列表、状态和历史，限制命令与输出范围。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[f63ba08](https://github.com/173787247/dsh-wsl-helm/tree/f63ba0892507034e8d31c3969c2b5e1b277fbd60)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-helm)
<!-- END META -->

**使用建议**：先明确context，不依赖默认集群；只读查询也可能返回敏感配置，限制账号权限。

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

已有贡献：将Helm只读查询和输出限量接入工具层；增量是调用边界与结构化展示，底层部署语义仍来自Helm。

结论边界：本次为固定版本源码核查，未执行目标代码或真实宿主验收，未核实独立使用效果。下文设计假设均未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：维护Kubernetes发布时，先取得Helm状态而不让Agent直接执行升级或卸载。

- **建议**：待验证假设：调用前把省略context解析为明确集群并检查白名单，可减少默认上下文漂移；若增加的查询成本显著则缓存并绑定配置版本。

采用建议：先明确context，不依赖默认集群；只读查询也可能返回敏感配置，限制账号权限。

直接helm list/status/history或运维控制台；插件不提供部署决策与回滚验收。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：Helm可用性、发布列表、状态与历史查询。

**流程与依赖**

依赖helm、kubeconfig、集群读取权限和DSH工具服务。

先确认当前集群，再查询release列表和指定状态；与原生helm结果核对后再做人工处置。

**效果与成本**

集群查询、输出token和维护上下文白名单是主要成本，无运维提效实测。

将Helm只读查询和输出限量接入工具层；增量是调用边界与结构化展示，底层部署语义仍来自Helm。 guardContext对空context返回undefined，使用者可能落到本机默认集群；配置allowedContexts并不等于每次实际目标都已核实。

- **思考**：guardContext对空context返回undefined，使用者可能落到本机默认集群；配置allowedContexts并不等于每次实际目标都已核实。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：将Helm只读查询和输出限量接入工具层；增量是调用边界与结构化展示，底层部署语义仍来自Helm。

将Helm只读查询和输出限量接入工具层；增量是调用边界与结构化展示，底层部署语义仍来自Helm。

命令白名单与进程执行分层可复用，空参数分支应与白名单语义一起检查。

<a id="detail-section-5"></a>

### 主要限制

guardContext对空context返回undefined，使用者可能落到本机默认集群；配置allowedContexts并不等于每次实际目标都已核实。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 index.js、lib/helm.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读入口及Helm执行、上下文校验；未连接集群或执行Helm。 固定checkout的注册候选与关键主张定向抽读；未逐行完整审阅全部源码、测试、依赖及外部参照，未运行目标代码。评分仅针对文中明确的CLI/API/人工流程参照；跨场景迁移为解释性判断。
- 下一步：在允许与不允许的两个集群之间切换默认context，分别省略和显式传参，核对最终目标及拒绝行为。

**分析版本**

- **仓库**：[173787247/dsh-wsl-helm](https://github.com/173787247/dsh-wsl-helm)
- **版本号**：0.1.1（[固定提交 f63ba08](https://github.com/173787247/dsh-wsl-helm/tree/f63ba0892507034e8d31c3969c2b5e1b277fbd60)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：调用前把省略context解析为明确集群并检查白名单，可减少默认上下文漂移；若增加的查询成本显著则缓存并绑定配置版本。

在允许与不允许的两个集群之间切换默认context，分别省略和显式传参，核对最终目标及拒绝行为。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 118 | — | — | 469 |
| .js | source | 2 | 299 | 277 | 5 | — |
| .js | test | 1 | 8 | 7 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-helm/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
