# agent-development-constraints

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[fc9af91](https://github.com/962599627/agent-development-constraints/tree/fc9af918ac14f03d63bee299cab90862adbc8963)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：将开发教训整理为项目约束库，提供提炼、精简流程及DSH约束提示和查询工具。

> **核心亮点**：相对无限增长开发日志，增量是用规则/触发/检查/证据四字段加精简流程组织经验，再用宿主上下文接线提醒模型。所谓self-evolving实际依赖人或Agent执行提炼，不是自动证明规则有效或全规则强制执行。

> **风险与缺陷**：“记录→规则→enforcement”闭环是否完整？通用约束主要是上下文注入，不能阻止违规则代码；确定性hook只覆盖脱敏规则。index顶部只读/无写注释与writeProbe和配置文件写入不一致，说明治理材料也需核查当前实现。无证据证明15条阈值或固定token节省普适。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：反复遇到同类开发错误的团队希望将事故记录转成有触发、检查和证据的规则；合格结果是同类错误减少且规则维护负担可控。

AGENTS.md和普通事故复盘都能存知识；插件补组织方法与会话提示，但需要证明比简单规则库更有效。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：constraints查询规则及用量辅助工具。
- **事件监听**：pre-step在条件满足时注入项目brief。
- **界面**：约束与用量状态卡片。

**流程与依赖**

DSH tools与pre-step decision契约、本地项目规则库；hook依赖Git/bash或PowerShell及正则配置，效果依赖真实事故证据与持续人工治理。

完成任务后人工判断教训，按DISTILL筛选抽象并写检查，再PRUNE降级/合并；后续会话读brief/工具，确定性检查仅在已配置hook触发时执行。

**效果与成本**

首次裁剪规则与技术栈库，持续提炼、去重、维护检查及注入token有成本；作者收益与token声明未独立复现。

可把经验变成可追溯的维护资产，是否降低重复缺陷依赖规则质量与执行，不由文档数量证明。

> **思考**：“记录→规则→enforcement”闭环是否完整？通用约束主要是上下文注入，不能阻止违规则代码；确定性hook只覆盖脱敏规则。index顶部只读/无写注释与writeProbe和配置文件写入不一致，说明治理材料也需核查当前实现。无证据证明15条阈值或固定token节省普适。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对无限增长开发日志，增量是用规则/触发/检查/证据四字段加精简流程组织经验，再用宿主上下文接线提醒模型。所谓self-evolving实际依赖人或Agent执行提炼，不是自动证明规则有效或全规则强制执行。

相对无限增长开发日志，增量是用规则/触发/检查/证据四字段加精简流程组织经验，再用宿主上下文接线提醒模型。所谓self-evolving实际依赖人或Agent执行提炼，不是自动证明规则有效或全规则强制执行。

单一VERSION来源、四字段规则与分层精简可借鉴；runtime注入沿真实decision结构复制减少猜字段，但宿主消息契约仍需适配。探针落盘和跨会话用量读取应在部署说明中明确。 源码依据：[index.mjs](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/index.mjs)、[core/DISTILL.md](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/core/DISTILL.md)、[core/PRUNE.md](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/core/PRUNE.md)、[scripts/sanitize-check.sh](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/scripts/sanitize-check.sh)、[install.sh](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/install.sh)。

<a id="detail-section-5"></a>

### 1.4 主要限制

“记录→规则→enforcement”闭环是否完整？通用约束主要是上下文注入，不能阻止违规则代码；确定性hook只覆盖脱敏规则。index顶部只读/无写注释与writeProbe和配置文件写入不一致，说明治理材料也需核查当前实现。无证据证明15条阈值或固定token节省普适。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合有重复事故且愿意维护规则检查的团队先选少量规则试用。安装前审阅AGENTS修改与hook范围，不把提示注入当硬门禁，也不要直接照搬全部规则。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[962599627/agent-development-constraints](https://github.com/962599627/agent-development-constraints)
- **版本号**：0.26.8（[固定提交 fc9af918](https://github.com/962599627/agent-development-constraints/tree/fc9af918ac14f03d63bee299cab90862adbc8963)）
- **版本日期**：2026-10-05（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 index.mjs、core/DISTILL.md、core/PRUNE.md、scripts/sanitize-check.sh、install.sh 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：挑选有明确反例的规则，比较普通AGENTS、仅brief、brief+可执行检查的重复错误率、误拦截与维护工时；检查安装重复运行是否保留本地规则。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

由规则已有检查字段推导，可为每条规则绑定可执行检查与触发覆盖计数，按误报/漏报决定保留、降级或删除，提示仅承担解释。未验证假设是减少规则膨胀且提高实际拦截。以历史已知事故和新任务回放比较纯提示与检查绑定，若重复错误/维护时间不改善则否定。

挑选有明确反例的规则，比较普通AGENTS、仅brief、brief+可执行检查的重复错误率、误拦截与维护工时；检查安装重复运行是否保留本地规则。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：427fe5acf1d1f4082d48ba6338b49fc9cb2ec117c926bbcb975ba93866fecbb3。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 963 | 738 | 158 | — |
| .md | source | 20 | 4107 | — | — | 42772 |
| .md | example | 1 | 168 | — | — | 1460 |
| .mjs | source | 1 | 1767 | 1178 | 503 | — |
| .mjs | test | 1 | 893 | 600 | 223 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/962599627/agent-development-constraints/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
