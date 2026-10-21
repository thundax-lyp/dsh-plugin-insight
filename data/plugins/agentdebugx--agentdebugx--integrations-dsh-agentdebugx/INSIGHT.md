# AgentDebugX

> 按需将DSH当前或选定历史会话接入AgentDebugX诊断，并保存可关联的轨迹与报告。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[2437c73](https://github.com/AgentDebugX/AgentDebugX/tree/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx)

<!-- BEGIN META -->
[![GitHub ★ 66](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=66&color=yellow&logo=github&style=flat)](https://github.com/AgentDebugX/AgentDebugX) · [![npm 30d 792](https://img.shields.io/static/v1?label=npm+30d&message=792&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-agentdebugx)
<!-- END META -->

**使用建议**：先在脱敏历史会话验证映射和诊断准确性；保留原始轨迹并审查持久化范围，deep结论需独立证据。

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

- **用途**：开发者追查Agent失败需要将原始会话与诊断结论对应，不能把诊断者意见当真实根因。

- **建议**：由稳定边界和诊断事件推导，可附映射覆盖率/被排除事件清单，配独立模型与人工标签对照，区分观察与归因置信度。未验证；带已知故障的轨迹比较漏诊/误归因，覆盖率提升应改善准确率才成立。

先在脱敏历史会话验证映射和诊断准确性；保留原始轨迹并审查持久化范围，deep结论需独立证据。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

上游CLI支持更广诊断/重跑；本组件将DSH素材映射进去，不自动执行修复。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：会话发现、当前/保存轨迹诊断与能力查询。
- **用户命令**：/agentdebug状态、诊断及显式viewer入口。
- **后台**：按需Python桥接和轨迹存储。

**流程与依赖**

DSH sessions/tools/commands/llm，Node zstd支持、Python及AgentDebugX SQLite/viewer；deep另依赖模型能力。

发现历史会话并确认目标或诊断当前完成轮次，映射trajectory，启动桥接并存储诊断，回写报告ID，可显式打开viewer。

**效果与成本**

首次Python环境、轨迹存储和可选viewer，heuristic不额外调用模型；deep额外模型回合和判读成本，未测诊断收益。

减少会话导出和分析入口摩擦，实际定位速度/修复有效性未验。

- **思考**：映射成功能否保证根因正确？丢弃不完整末帧和只取完成边界会排除正在失败的信息；deep默认可由产生轨迹的同模型判断，非独立验证。保存轨迹也引入敏感上下文持久化。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：组件贡献是DSH持久会话映射、按需桥接和诊断事件可追溯；Detect-Attribute-Recover与DeepDebug算法归AgentDebugX核心，本组件不包含全部上游CLI能力。

组件贡献是DSH持久会话映射、按需桥接和诊断事件可追溯；Detect-Attribute-Recover与DeepDebug算法归AgentDebugX核心，本组件不包含全部上游CLI能力。

完整帧扫描、完成前缀、按需进程与分析ID关联值得借鉴；协议和压缩格式变更需回归。 源码依据：[integrations/dsh-agentdebugx/index.js](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/index.js)、[integrations/dsh-agentdebugx/bridge/agentdebug_bridge.py](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/bridge/agentdebug_bridge.py)、[integrations/dsh-agentdebugx/package.json](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/package.json)。

<a id="detail-section-5"></a>

### 主要限制

映射成功能否保证根因正确？丢弃不完整末帧和只取完成边界会排除正在失败的信息；deep默认可由产生轨迹的同模型判断，非独立验证。保存轨迹也引入敏感上下文持久化。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AgentDebugX/AgentDebugX](https://github.com/AgentDebugX/AgentDebugX)
- **版本号**：0.1.0（[固定提交 2437c73c](https://github.com/AgentDebugX/AgentDebugX/tree/2437c73c3183e6b6495259dfbb12464a7f07f6b8)）
- **版本日期**：2026-09-20（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 integrations/dsh-agentdebugx/index.js、integrations/dsh-agentdebugx/bridge/agentdebug_bridge.py、integrations/dsh-agentdebugx/package.json 及固定范围 inventory；组件：integrations/dsh-agentdebugx。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读integrations/dsh-agentdebugx/index.js、integrations/dsh-agentdebugx/bridge/agentdebug_bridge.py、integrations/dsh-agentdebugx/package.json；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：用已知边界的多帧/末帧截断会话核对事件数，检查选中session归属、取消、桥接异常和deep降级字段；以人工故障标签评诊断。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由稳定边界和诊断事件推导，可附映射覆盖率/被排除事件清单，配独立模型与人工标签对照，区分观察与归因置信度。未验证；带已知故障的轨迹比较漏诊/误归因，覆盖率提升应改善准确率才成立。

用已知边界的多帧/末帧截断会话核对事件数，检查选中session归属、取消、桥接异常和deep降级字段；以人工故障标签评诊断。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：integrations/dsh-agentdebugx；内容摘要：1ecee703d17adb44ef1ab6bbfa1d148eff3bab17ab6c9681b28af4643dc0074f。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 1526 | 1339 | 94 | — |
| .md | source | 2 | 346 | — | — | 2161 |
| .js | test | 1 | 747 | 672 | 24 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AgentDebugX/AgentDebugX/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
