# 峰谷价任务执行器

> 根据配置的峰谷时段排队执行模型任务，提供队列查询与取消。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[fe646bc](https://github.com/439436269-ctrl/dsh-peak-runner/tree/fe646bc931b3853815a760d7eb6943d96e6cad8f)

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-peak-runner) · [![npm 30d 24](https://img.shields.io/static/v1?label=npm+30d&message=24&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-peak-runner)
<!-- END META -->

**使用建议**：适合无硬期限的文本批任务做模拟日程与测试额度验证；修正峰前窗口和路由绑定之前，不依赖其保证避峰节费。

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

- **用途**：可等待的摘要/翻译批任务，用户接受推迟执行换取预期低价；合格交付是指定模型完成的文本和可靠任务状态，而非仅到时触发。

适合无硬期限的文本批任务做模拟日程与测试额度验证；修正峰前窗口和路由绑定之前，不依赖其保证避峰节费。

核查状态：源码支持本文所述机制与有限集成贡献；效果、宿主兼容和独立采用未验证。未来设计假设仅为推演，未实现、未验证。 只执行研究工程的统计/装配与结构验证，未安装插件、运行目标代码/测试或做真实宿主验收。

<a id="detail-section-3"></a>

### 能力、流程与成本

参照手工预约/cron执行同模型与同任务；不对当前DeepSeek实际价格作核实性断言。

持久化storage domain整批任务文档，scheduler按UTC峰段/周末选择立即或setTimeout触发；runner逐任务调用ctx.llm.stream并组装文本，默认reasoning off。


Node>=22；DSH llm/storageDomain/systemPrompt/tools 0.2.0-rc.2系列；配置provider/model可用，价格时段必须适用于实际账户。宿主持续运行才能计时触发，法定节假日不能仅凭README假定已覆盖。

提交prompts→当前时段判定→持久化队列→立即执行或挂定时器→逐项更新running/done/failed→用户查询/取消。重启、并发全量写和执行中断恢复未实测；单文档队列需关注状态丢更新。

等待时间是核心代价；首次需校准价格/时区/模型，持续维护规则并复核空输出和失败。现金收益取决于实际模型账单与重试，未核实作者“两倍”价格口径。

时间可移的工作负载有调度价值；忙时延迟、路由回退和重试可能吞掉收益，未给实际节费比例。

- **模型工具**：peak_run、peak_schedule、peak_cancel。
- **后台**：持久任务队列与自持定时器。

- **思考**：最影响节费主张的是日程是否真正约束所用模型和任务启动。scheduler.shouldRunNow在“当前非峰段”直接run=true，未检查即将进入峰段，因此README承诺的峰前leadMinutes不成立；runner指定模型失败会发现任意可用模型，其价格不一定对应同日程。

<a id="detail-section-4"></a>

### 工程贡献

runner将BlockAssembler失败与空输出显式处理可借鉴；scheduler当前lead逻辑注释和代码不符。whole-document put简洁但扩展并发需序列化或版本冲突处理。

0.1.0，声明DSH0.2.0-rc.2；三模型工具和system提示，未进行宿主验收。

固定源码依据：[lib/scheduler.js L25–54](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/lib/scheduler.js#L25-L54)；[lib/runner.js L22–47](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/lib/runner.js#L22-L47)。上述贡献与关键质疑均限定于这些固定源码，不把测试文件存在当运行通过。

- **亮点**：相对用户手动等低价，贡献是价格日程与可查队列、取消、模型调用的组合。存储和LLM流来自宿主；插件按时间表改变执行时机，并未读取实时账单确认价格。

<a id="detail-section-5"></a>

### 核查说明与分析版本

- 版本依据：仓库：[439436269-ctrl/dsh-peak-runner](https://github.com/439436269-ctrl/dsh-peak-runner)；固定提交：[fe646bc9](https://github.com/439436269-ctrl/dsh-peak-runner/tree/fe646bc931b3853815a760d7eb6943d96e6cad8f)；版本号：0.1.0；版本日期：2026-10-13（固定提交日期，北京时间，非包发布日期）。
- 已检查与未覆盖范围：核查调度/队列/runner和配置，未执行时钟模拟、真实模型任务或核实最新费率；仅指出静态分支与README的差异。
- 证据限制：作者功能摘要来自固定版本README；未核实独立用户采用、同条件效果或端到端收益。版本、证据原文与inventory绑定保存在本项JSON；GitHub/npm统计仅作背景，不构成采用证明。

<a id="detail-section-6"></a>

## 未来设计假设（未验证）

待验证假设：队列任务绑定实际provider/model和价格规则版本，并以预估最长运行时间判断是否跨峰，可能比按当前时刻判断更可靠。推导自模型回退与lead窗口缺口；新增负担是维护价格规则及期限/任务时长估计。

最小验证与否定条件：不执行目标代码的本轮只静态发现边界；后续用固定时钟覆盖峰前10分钟、跨日、周末、假日与长任务，模拟目标不可用，要求实际路由与价格规则一致。对照手动排程统计合格文本/总费用/等待时间，若低价目标失配或任务跨峰成本上升则否定节费保证。

<a id="detail-section-7"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 98 | — | — | 800 |
| .js | source | 8 | 880 | 528 | 286 | — |
| .mjs | test | 3 | 318 | 250 | 32 | — |

排除 0 项；解析错误 0 项。统计为固定Git范围，源码抽读不冒充全面审计；JS/TS与Markdown分别计量。默认排除为启发式，不能从LOC推算原创量或工时。

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/439436269-ctrl/dsh-peak-runner/issues) 查看。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
