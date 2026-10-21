# dsh-butler-memory

> 通过MCP向DSH模型和用户面板接入Butler长期记忆、修订历史与候选接受/拒绝。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[0f64e0c](https://github.com/AndyYang12345/dsh-butler-memory/tree/0f64e0cf0420d0461fef2d49c2d6752faebc0562)

<!-- BEGIN META -->
[![npm 30d 773](https://img.shields.io/static/v1?label=npm+30d&message=773&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-butler-memory) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-butler-memory)
<!-- END META -->

**使用建议**：当前不建议直接用于重要记忆。作为历史接线参考，先核对目标DSH与上游MCP契约，再以隔离数据库验证权限和恢复。

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

- **用途**：用户与Agent共同管理长期记忆，合格写入需正确owner/revision/audit且用户知道候选与已存记忆区别。

- **建议**：由双进程及未知结果推导，可统一共享桥接并返回写入收据/版本冲突，超时仅查候选最终状态而不重放。未验证；并发accept/reject、丢响应、进程重启后双方视图应一致且不重复写。

当前不建议直接用于重要记忆。作为历史接线参考，先核对目标DSH与上游MCP契约，再以隔离数据库验证权限和恢复。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

直接MCP只有模型入口，独立框架已有面板；插件补DSH可见管理但引入两条进程链。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **Skill**：运行时复制的Butler记忆使用说明。
- **模型工具**：通过宿主MCP客户端提供memory工具。
- **界面**：记忆/修订/候选面板。
- **后台**：面板stdio桥接进程。

**流程与依赖**

DSH MCP/connection/客户端、ai-butler-memory-mcp、数据库与桥设备授权；HTTP回退是可选额外部署。

激活装skill与MCP→模型调用或面板RPC→各自桥接进程→上游查/改记忆→显示修订/候选；离线返回健康和修复说明。

**效果与成本**

首次Python桥接、数据库/可选Docker、env凭据配置；持续双进程、存储、维护旧宿主和人工记忆复核成本。

双通道透明管理的设计有参考价值，当前维护状态增加长期采用负担。

- **思考**：双通道是否共享一致权限与状态？独立进程各有生命周期，候选接受只传candidate_id，owner/revision校验依赖上游不能凭面板宣称确认；10秒超时不取消已提交MCP动作。作者已明确此DSH接入停止维护，旧兼容不能外推当前版本。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：贡献是模型与可视管理两条通道接同一记忆体系、离线健康提示；真正记忆检索/权限/审计归独立butler-memory-mcp与数据库，本接入不重实现。

贡献是模型与可视管理两条通道接同一记忆体系、离线健康提示；真正记忆检索/权限/审计归独立butler-memory-mcp与数据库，本接入不重实现。

RPC端点白名单、显式字段映射与懒加载降级清楚；错误详情脱敏、未知结果和双进程一致性须另核。 源码依据：[host/index.js](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/host/index.js)、[cordis.patch.yml](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/cordis.patch.yml)、[client/src/hostClient.ts](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/client/src/hostClient.ts)、[README.md](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/README.md)。

<a id="detail-section-5"></a>

### 主要限制

双通道是否共享一致权限与状态？独立进程各有生命周期，候选接受只传candidate_id，owner/revision校验依赖上游不能凭面板宣称确认；10秒超时不取消已提交MCP动作。作者已明确此DSH接入停止维护，旧兼容不能外推当前版本。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AndyYang12345/dsh-butler-memory](https://github.com/AndyYang12345/dsh-butler-memory)
- **版本号**：0.1.5（[固定提交 0f64e0cf](https://github.com/AndyYang12345/dsh-butler-memory/tree/0f64e0cf0420d0461fef2d49c2d6752faebc0562)）
- **版本日期**：2026-10-05（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 host/index.js、cordis.patch.yml、client/src/hostClient.ts、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读host/index.js、cordis.patch.yml、client/src/hostClient.ts、README.md；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：隔离数据集核对并发候选决策、超时后最终状态、owner/revision冲突及卸载副本；先验证最新宿主API不沿用旧测试结论。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由双进程及未知结果推导，可统一共享桥接并返回写入收据/版本冲突，超时仅查候选最终状态而不重放。未验证；并发accept/reject、丢响应、进程重启后双方视图应一致且不重复写。

隔离数据集核对并发候选决策、超时后最终状态、owner/revision冲突及卸载副本；先验证最新宿主API不沿用旧测试结论。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：4b915e5183ed8979c449cd37fc801cd0537efd0f0cca37847240f2545993fa3a。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 2 | 65 | 36 | 24 | — |
| .ts | source | 1 | 30 | 22 | 5 | — |
| .tsx | source | 2 | 566 | 516 | 29 | — |
| .md | source | 4 | 309 | — | — | 3198 |
| .js | source | 1 | 362 | 302 | 33 | — |

排除 2 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AndyYang12345/dsh-butler-memory/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
