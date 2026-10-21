# 上下文交接提醒

> 消费上下文占用投影，显示提醒并在工作目录生成机器事实交接草稿。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[a889e8c](https://github.com/2JumpSinA/dsh-context-guard/tree/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2JumpSinA/dsh-context-guard) · [![npm 30d 1388](https://img.shields.io/static/v1?label=npm+30d&message=1%2C388&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@2jumpsina/dsh-context-guard)
<!-- END META -->

**使用建议**：适合愿意主动交接的长会话用户先用临时目录验证；先决定是否允许默认写入，再评估提醒阈值，不能将草稿当作已办结交接。

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

- **用途**：长期进行代码或研究会话的用户，在上下文过长前交接任务；交付物是占用提醒与仍需补全的HANDOVER草稿，而不是自动完整迁移的会话。

适合愿意主动交接的长会话用户先用临时目录验证；先决定是否允许默认写入，再评估提醒阈值，不能将草稿当作已办结交接。

核查状态：源码支持本文所述机制与有限集成贡献；效果、宿主兼容和独立采用未验证。未来设计假设仅为推演，未实现、未验证。 只执行研究工程的统计/装配与结构验证，未安装插件、运行目标代码/测试或做真实宿主验收。

<a id="detail-section-3"></a>

### 能力、流程与成本

参照宿主自动压缩、token读数和手工交接；不把作者单机历史账本当普遍节省。

宿主从 contextPressure 投影驱动纯事件状态机，迟滞、冷却和压缩标记集中处理；wire投影供UI只读展示。handover模块在阈值跨越时写机器事实块，包含成本、路径和部分消息预览。


依赖宿主sessionProjections及官方token-meter有效投影；缺窗口分母fail-closed。读写权限用于交接，提醒依赖匹配的宿主投影/UI；压缩点由宿主配置推算，缺配置时需标估计。

配置阈值和handover路径→宿主消费投影/会话事件→折叠状态→UI显示→写交接草稿→用户补任务语义并另开会话。写失败记录状态，不应阻塞占用提示；草稿不是完整任务语义摘要。

无需新增模型调用但有文件写入、信息核对、交接补全和新会话恢复成本。首次确认默认路径、忽略规则与隐私范围；作者人民币统计未独立复现。

真正价值可能是把交接提前且明确责任，而非承诺某比例省费；短任务或压缩已足够时新增提醒可能增加打断。

- **事件监听**：消费contextPressure、turn/end和compaction事件。
- **界面**：占用徽标与阈值提醒。
- **后台**：按配置写机器事实交接草稿。

- **思考**：核心质疑是提前换会话是否真的降低合格任务总成本。作者单机账本是反事实估算，重新解释任务和修复交接遗漏也耗token与人时。README顶部称轮末提醒，后文明示在投影变化时判定，不能承诺绝不在轮中。默认写HANDOVER还可能把敏感片段带入仓库。

<a id="detail-section-4"></a>

### 工程贡献

engine纯fold和host/client职责分离值得借鉴，hysteresis限制避免无法解除武装；handover模块的原子写与符号链接拒绝需目标文件系统验收。注释存在旧语义，代码与文档要联合看。

源码包名@2jumpsina/dsh-context-guard，不能安装同名非scope第三方包；当前仅源码核查，无本轮真实宿主测量。

固定源码依据：[lib/engine.mjs L1–40](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/engine.mjs#L1-L40)；[lib/handover.mjs L1–45](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/handover.mjs#L1-L45)；[README.md L139–148](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/README.md#L139-L148)。上述贡献与关键质疑均限定于这些固定源码，不把测试文件存在当运行通过。

- **亮点**：相对盯着token数字，新增“判断状态→提醒→交接草稿”的动作链；纯fold与只读UI让提示策略有单一所有者。token计量来自官方meter，非插件自行测量；零额外模型请求可由接线支持，但“零总成本”不能由此推出。

<a id="detail-section-5"></a>

### 核查说明与分析版本

- 版本依据：仓库：[2JumpSinA/dsh-context-guard](https://github.com/2JumpSinA/dsh-context-guard)；固定提交：[a889e8c0](https://github.com/2JumpSinA/dsh-context-guard/tree/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc)；版本号：0.7.5；版本日期：2026-10-20（固定提交日期，北京时间，非包发布日期）。
- 已检查与未覆盖范围：核查宿主/纯状态机/策略和交接写入模块，未复现作者账本与真实UI；注释中的历史实测不是本轮执行。
- 证据限制：作者功能摘要来自固定版本README；未核实独立用户采用、同条件效果或端到端收益。版本、证据原文与inventory绑定保存在本项JSON；GitHub/npm统计仅作背景，不构成采用证明。

<a id="detail-section-6"></a>

## 未来设计假设（未验证）

待验证假设：按“交接后恢复任务所需最小事实”检测草稿完整度，再结合实际接续成本调阈值，可能比统一45/60%更有效。由机器事实草稿留有待填槽位、单机阈值非最优推导；该完整度检查若调用模型会破坏零请求条件。

最小验证与否定条件：对相同长任务比较不开提醒、固定阈值、按任务边界交接；记录完成质量、总token和人时，包含下一会话恢复成本。若节省的旧上下文被恢复/返工抵消，则不能宣称省费；另用临时目录验证符号链接拒绝、并发写和敏感预览。

<a id="detail-section-7"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 4330 | 2981 | 1173 | — |
| .mjs | source | 13 | 4885 | 3433 | 1208 | — |
| .md | source | 3 | 894 | — | — | 12493 |
| .mjs | test | 10 | 2599 | 2001 | 388 | — |
| .mjs | example | 1 | 42 | 25 | 14 | — |

排除 0 项；解析错误 0 项。统计为固定Git范围，源码抽读不冒充全面审计；JS/TS与Markdown分别计量。默认排除为启发式，不能从LOC推算原创量或工时。

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/2JumpSinA/dsh-context-guard/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
