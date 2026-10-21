# dsh-anchored-monitor

> 统计DSH推理文本的词汇指纹并展示波段，可选分级提示、取消当前回合与重设persona/工具。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[086bd05](https://github.com/Aik358/dsh-anchored-monitor/tree/086bd05e1e3035ddf23133f3a0ee479291a4b237)

<!-- BEGIN META -->
[![GitHub ★ 13](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=13&color=yellow&logo=github&style=flat)](https://github.com/Aik358/dsh-anchored-monitor) · [![npm 30d 987](https://img.shields.io/static/v1?label=npm+30d&message=987&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-anchored-monitor)
<!-- END META -->

**使用建议**：建议先仅观测并称为词汇指纹，不据仪表断言模型能力。未建立因果证据前不对重要长任务自动重置。

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

- **用途**：作者针对特定DeepSeek模型的锚定风格观察实验；合格指标需预测任务正确性，不能把词频直接当模型能力。

- **建议**：由可配置指标与分级动作推导，应先将词频设为候选预警，与盲评任务正确率和工具失败率联合校准，再随机化开启干预。未验证；若控任务难度/语言后词频不预测失败，或干预只改措辞而不改成功率，应否定能力仪表解释。

建议先仅观测并称为词汇指纹，不据仪表断言模型能力。未建立因果证据前不对重要长任务自动重置。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

任务测试、工具错误和人工审查直接衡量结果；词频代理更早可见但容易受风格混淆。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **后台**：独立监控进程、滑窗评分和可选干预。
- **事件监听**：会话推理与system-prompt assemble。
- **Host 路由**：监控代理及参数控制。
- **界面**：词汇指纹仪表与设置。

**流程与依赖**

DSH agents/systemPrompt/webServer、推理字段可见性、监控进程和版本一致；非目标模型/语言可使阈值失真。

采集reasoning→提词评分→波段状态→可选干预信号→宿主取消/续跑/下一次assemble重设→日志与界面显示。

**效果与成本**

首次模型/词表和阈值校准，持续监控日志、取消重跑和额外模型回合；错误干预可能丢工作进度。

实验可观测性有用，自动提高任务能力或效率尚未证明。

- **思考**：词风变化是否因果代表能力退化？换语言、引用或遵循措辞可能改变分数而不改正确性，干预也可能只优化指标。源码L2替换persona和工具目录，并非清空所有历史；作者Project2分数与能力强度宣称未获独立核实。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：将词汇代理指标、趋势与干预接进实时宿主闭环，工程增量是可配置观测/干预和实验日志；锚定假说、Minimal persona及上游模型能力不归插件原创。

将词汇代理指标、趋势与干预接进实时宿主闭环，工程增量是可配置观测/干预和实验日志；锚定假说、Minimal persona及上游模型能力不归插件原创。

特征/评分/决策分层、ack状态与loopback路由有复用价值；执行成功标记主要取决于followup送达，非任务恢复成功。 源码依据：[lib/index.js](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/lib/index.js)、[src/monitor/feature/extractor.ts](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/src/monitor/feature/extractor.ts)、[src/monitor/scoring/index.ts](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/src/monitor/scoring/index.ts)、[src/monitor/intervention/decision.ts](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/src/monitor/intervention/decision.ts)。

<a id="detail-section-5"></a>

### 主要限制

词风变化是否因果代表能力退化？换语言、引用或遵循措辞可能改变分数而不改正确性，干预也可能只优化指标。源码L2替换persona和工具目录，并非清空所有历史；作者Project2分数与能力强度宣称未获独立核实。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[Aik358/dsh-anchored-monitor](https://github.com/Aik358/dsh-anchored-monitor)
- **版本号**：0.3.1（[固定提交 086bd05e](https://github.com/Aik358/dsh-anchored-monitor/tree/086bd05e1e3035ddf23133f3a0ee479291a4b237)）
- **版本日期**：2026-09-05（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/index.js、src/monitor/feature/extractor.ts、src/monitor/scoring/index.ts、src/monitor/intervention/decision.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读lib/index.js、src/monitor/feature/extractor.ts、src/monitor/scoring/index.ts、src/monitor/intervention/decision.ts；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：固定任务/语言分层盲评，对照仅观测、随机假干预和真实干预，记录成功率/费用/取消次数；核对L2历史范围和工具权限不被误表述。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由可配置指标与分级动作推导，应先将词频设为候选预警，与盲评任务正确率和工具失败率联合校准，再随机化开启干预。未验证；若控任务难度/语言后词频不预测失败，或干预只改措辞而不改成功率，应否定能力仪表解释。

固定任务/语言分层盲评，对照仅观测、随机假干预和真实干预，记录成功率/费用/取消次数；核对L2历史范围和工具权限不被误表述。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：b6f8930ac955d628bd45952cbbcc401f3d55172172aa55b6068c0fa131882ccb。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 778 | — | — | 8614 |
| .js | source | 7 | 5473 | 5083 | 241 | — |
| .mjs | source | 5 | 476 | 396 | 53 | — |
| .ts | source | 31 | 3506 | 2946 | 265 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/Aik358/dsh-anchored-monitor/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
