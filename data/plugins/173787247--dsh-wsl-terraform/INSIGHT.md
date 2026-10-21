# dsh-wsl-terraform

> 在 DSH 中查看 Terraform/OpenTofu 校验、计划摘要与状态资源列表。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[549e4b8](https://github.com/173787247/dsh-wsl-terraform/tree/549e4b82570a4a13ab900ac03c5593421a8c16e4)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-terraform)
<!-- END META -->

**使用建议**：适合已有 Terraform 审批流程的人先审阅沙盒计划；显式配置 allowRoots 和凭据，任何摘要都要回看完整计划后决定部署。

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

源码支持所述适配机制；贡献评价属于有固定源码依据的解释。尚未安装或运行，效果与宿主兼容未验证；新设计推演均未实现。

[重点创新推演与最小验证](#innovation)

- **用途**：基础设施维护者需要审阅拟变更资源，以计划计数、验证输出和资源地址交付复核，不在工具内执行部署。

采用建议：适合已有 Terraform 审批流程的人先审阅沙盒计划；显式配置 allowRoots 和凭据，任何摘要都要回看完整计划后决定部署。

本次比较参照为上述人工命令、平台接口或本地脚本；没有独立同任务运行对照，不声称整体收益或首创。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：tf_status、tf_validate_probe、tf_plan_summary、tf_state_list、terraform_state_list

**流程与依赖**

Node≥18、DSH、Terraform 或 tofu、已初始化工作目录和相应 provider/后端凭据必要；无自动 init；refresh=false 只减少刷新，不保证离线。

status→validate→plan→人工读摘要与原输出→独立部署；失败需处理 init、凭据、锁或 provider，插件不补偿。

**效果与成本**

既有云 API/远端后端费用及模型费可能发生；人工需初始化和审核，默认最长180秒调用、失败重试不免费，未测单位成本。

价值是让计划审阅与部署操作分开；无同资源对照实验，不能据此认定变更安全性提升。

- **思考**：核心质疑是“只读计划”是否可靠。plan 默认 refresh=true，可能联网、读取凭据和 provider/数据源；allowRoots 空时不限制目录。tfPlanSummary 只把退出码1当失败，其他异常退出可能被包装 ok:true，故摘要不能作为放行凭证。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对任意 shell 运维，增量在于暴露计划审阅的窄接口、禁止注册 apply/destroy；Terraform 的规划与 provider 行为仍属上游。用户可先看变更再走独立审批，不能把无 apply 等于无副作用。

相对任意 shell 运维，增量在于暴露计划审阅的窄接口、禁止注册 apply/destroy；Terraform 的规划与 provider 行为仍属上游。用户可先看变更再走独立审批，不能把无 apply 等于无副作用。

lib/tf.js argv 固定及 TF_INPUT=0 可借鉴；正则摘要受输出格式和截断影响；state list 的 count 来自截断后文本，不代表完整远端资源量。 源码：[index.js](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/index.js)、[lib/tf.js](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/lib/tf.js)、[test/tf.test.js](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/test/tf.test.js)。

<a id="detail-section-5"></a>

### 主要限制

核心质疑是“只读计划”是否可靠。plan 默认 refresh=true，可能联网、读取凭据和 provider/数据源；allowRoots 空时不限制目录。tfPlanSummary 只把退出码1当失败，其他异常退出可能被包装 ok:true，故摘要不能作为放行凭证。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 index.js、lib/tf.js、test/tf.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交 549e4b82570a4a13ab900ac03c5593421a8c16e4，检查作者说明、入口、所列核心实现与测试内容；未执行测试或插件、未核实外部套件和独立用户效果。
- 下一步：在隔离的无真实云资源 fixture 比较退出码0、2、1和信号终止、超时、超长输出；只有0/2可成功且未知计数不显示无变化。再人工确认 provider 的联网和状态访问。

**分析版本**

- **仓库**：[173787247/dsh-wsl-terraform](https://github.com/173787247/dsh-wsl-terraform)
- **版本号**：0.1.1（[固定提交 549e4b8](https://github.com/173787247/dsh-wsl-terraform/tree/549e4b82570a4a13ab900ac03c5593421a8c16e4)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：把计划结果分成明确0/2成功、其余未知/失败，并保留机器可读 plan artifact，可降低截断/异常时误判无变化；需额外存储与敏感数据策略，尚未实现。

在隔离的无真实云资源 fixture 比较退出码0、2、1和信号终止、超时、超长输出；只有0/2可成功且未知计数不显示无变化。再人工确认 provider 的联网和状态访问。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 117 | — | — | 472 |
| .js | source | 2 | 327 | 303 | 3 | — |
| .js | test | 1 | 11 | 10 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-terraform/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
