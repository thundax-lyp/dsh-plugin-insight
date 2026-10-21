# Qoder 子代理聚合

> 把 Qoder 与 QoderCN 订阅 CLI 接入 DSH 子代理，展示进度与执行状态。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[9ad5c7d](https://github.com/1373700184/dsh-subagent/tree/9ad5c7dc076bc9ebd98f3c4ea100ced301d10905)

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1373700184/dsh-subagent) · [![npm 30d 22](https://img.shields.io/static/v1?label=npm+30d&message=22&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-subagent)
<!-- END META -->

**使用建议**：已有对应订阅且能隔离工作目录的团队可先做可撤销任务；配置明确超时与权限后，再评估写任务，不以可查询进度代替验收。

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

- **用途**：已有 Qoder 订阅和本地 CLI 的开发者把独立任务从父会话委派出去，交付最终文本和可查询执行记录；需在任务里显式附全上下文。

已有对应订阅且能隔离工作目录的团队可先做可撤销任务；配置明确超时与权限后，再评估写任务，不以可查询进度代替验收。

核查状态：源码支持本文所述机制与有限集成贡献；效果、宿主兼容和独立采用未验证。未来设计假设仅为推演，未实现、未验证。 只执行研究工程的统计/装配与结构验证，未安装插件、运行目标代码/测试或做真实宿主验收。

<a id="detail-section-3"></a>

### 能力、流程与成本

参照为手工执行 Qoder CLI 与宿主原生子代理；跨后端订阅桥接属于适配增量，未检查所有外部 CLI 版本。

QoderJsonProvider 声明 NO_START_CAPABILITIES 和 inheritsParentContext=false，以 stdin 传提示，spawn CLI 并折叠 stream-json 为宿主 SubagentResult；内存 ledger 提供最近运行和动作查询。


Node ^22.19 或 >=24；peer 固定 0.2.1-rc.2 的 DSH session/subagent/tools/llm；本机对应 CLI 已安装并登录、路径可执行、订阅额度可用。失去 CLI 时启动时报明确错误。

配置 provider 和匹配 tool 节点→父 Agent 准备独立任务→启动子进程→轮询账本→收敛文本→人工核查文件。CLI 静默可触发父 Agent 告警；ledger 仅保留24运行/每项200事件，进程重启不保留完整审计。

首次需 CLI 登录、版本和权限校验；每次消耗外部订阅额度并增加父侧描述/复核时间。账本截断意味着事后分析需额外保留证据；无单位任务成本实测。

改变的是任务入口与执行额度来源，并非已证明更低成本或更高质量；不继承上下文使边界清楚，也增加交接负担。

- **后台**：按配置注册Qoder/QoderCN一次性子代理提供方。
- **模型工具**：qoder_subagent_status查询有界执行账本。
- **用户命令**：按provider名注册快捷委派命令。

- **思考**：进度可见不代表任务完成合格。默认 permissionMode=bypass_permissions、timeoutSeconds 无上限，而且子代理不继承父上下文；收益可能被上下文补写、越权操作和结果复核抵消。只有记录了 result 事件也不能证明代码变更正确。

<a id="detail-section-4"></a>

### 工程贡献

Provider 与 Run 生命周期分离、有界 ledger、复用宿主 settleRunResult 是可借鉴结构；扩展新 CLI 必须实现协议和取消语义，不能只添加 provider 名称。

包版本0.5.0，web 客户端；目前只有 qoder-json driver，不支持续话、结构化输出和模型选择能力协商。

固定源码依据：[lib/index.js L132–178](https://github.com/1373700184/dsh-subagent/blob/9ad5c7dc076bc9ebd98f3c4ea100ced301d10905/lib/index.js#L132-L178)；[lib/index.js L200–246](https://github.com/1373700184/dsh-subagent/blob/9ad5c7dc076bc9ebd98f3c4ea100ced301d10905/lib/index.js#L200-L246)。上述贡献与关键质疑均限定于这些固定源码，不把测试文件存在当运行通过。

- **亮点**：相对手工切 CLI，贡献在于复用 DSH 子代理接口连接外部订阅执行，并让父 Agent/UI 查询同一个运行 id。传输与结算复用 dsh-subagent 上游 helper，新增的是 qoder-json 协议适配和有界活动账本。

<a id="detail-section-5"></a>

### 核查说明与分析版本

- 版本依据：仓库：[1373700184/dsh-subagent](https://github.com/1373700184/dsh-subagent)；固定提交：[9ad5c7dc](https://github.com/1373700184/dsh-subagent/tree/9ad5c7dc076bc9ebd98f3c4ea100ced301d10905)；版本号：0.5.0；版本日期：2026-10-21（固定提交日期，北京时间，非包发布日期）。
- 已检查与未覆盖范围：核查provider/run/账本及客户端接线，未调用外部CLI，未验证订阅计费、子进程树或宿主取消。
- 证据限制：作者功能摘要来自固定版本README；未核实独立用户采用、同条件效果或端到端收益。版本、证据原文与inventory绑定保存在本项JSON；GitHub/npm统计仅作背景，不构成采用证明。

<a id="detail-section-6"></a>

## 未来设计假设（未验证）

待验证假设：委派前附可机器检查的输入/输出契约，并把静默告警和最终文件摘要一起返回，可能降低父 Agent 对“看似完成”的误判；依据是已有事件账本能观测活动却没有业务验收。新负担是定义任务契约，不能把它冒充当前功能。

最小验证与否定条件：用相同仓库的只读检索、补丁编写、故意中断三类任务，对照手工 CLI；检查完整上下文、超时/取消后的子进程退出、result 与真实文件摘要一致性。若复核总时长或误报率不降，则集成便利不等于交付增益。

<a id="detail-section-7"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 1387 | 1237 | 103 | — |
| .md | source | 1 | 80 | — | — | 1025 |
| .mjs | source | 1 | 30 | 28 | 0 | — |

排除 0 项；解析错误 0 项。统计为固定Git范围，源码抽读不冒充全面审计；JS/TS与Markdown分别计量。默认排除为启发式，不能从LOC推算原创量或工时。

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1373700184/dsh-subagent/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/1373700184/dsh-subagent/issues?q=is%3Aissue+created%3A2026-09-21T02%3A00%3A23.779Z..2026-10-21T02%3A00%3A23.779Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1373700184/dsh-subagent/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T02%3A00%3A23.779Z..2026-10-21T02%3A00%3A23.779Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
