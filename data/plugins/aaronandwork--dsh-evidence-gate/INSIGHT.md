# dsh-evidence-gate

> 按工具活动索引检查结论自报依据，提供判定卡、会话开关与账本。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[845ddf4](https://github.com/AaronandWork/dsh-evidence-gate/tree/845ddf415e045eb6b2a014bca97a9c63aee1befa)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AaronandWork/dsh-evidence-gate) · [![npm 30d 888](https://img.shields.io/static/v1?label=npm+30d&message=888&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@aaronandwork/dsh-evidence-gate) · [![首次发布 2026-09-11](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@aaronandwork/dsh-evidence-gate)
<!-- END META -->

**使用建议**：需要声明可追溯性的团队可评估其账本；不能将绿色VERIFIED作为测试通过、真实阅读或事实正确的唯一证据。

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

- **用途**：用户希望区分Agent亲查、引用和假设，尤其审查“读过文件/测试通过”的承重结论；交付物是可查的声明与匹配记录，非事实真值。

- **建议**：把活动回执绑定成功状态、内容摘要、当前版本与会话委派谱系，并将weak保持UNVERIFIED，可能降低假验证。用同basename异文件、失败read、旧版本测试及无关会话同路径反例，比较误VERIFIED率和真实证据召回；若误报下降代价是大量真实证据被拒，应展示置信分层而非二值真值。

需要声明可追溯性的团队可评估其账本；不能将绿色VERIFIED作为测试通过、真实阅读或事实正确的唯一证据。

核查状态：声明分类、活动关联和账本机制源码支持；无法据此证明结论正确或模型一定过门。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

提示要求引用加人工检查工具日志；本项自动检索部分锚点，不能替代语义审查或真实复现。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：evidence_gate判定声明、evidence_gate_switch会话开关。
- **用户命令**：/evidence-gate on/off/status/report。
- **事件监听**：tools/result记录活动、systemPrompt按会话开关注入政策。
- **Host 路由**：/api/dsh-evidence-gate会话账本与开关桥。
- **界面**：输入区盾牌开关及evidence_gate判定卡。

**流程与依赖**

默认会话开关OFF；tools/result持续记录参数摘要与输出路径/URL/关键词，存每会话400项和最多50会话；开启后提示要求模型调用evidence_gate。工具按basis及非空证据分类，逐级匹配本会话/其他会话活动、输出词与存在路径，生成verdict和计数，JSON防半写持久化；UI呈现盾牌与判定卡。

DSH tools/systemPrompt/commands/session、可写DSH_HOME及Web slots；路径存在floor实现只接受Windows盘符/UNC样式，平台行为不一致。

被动收集活动（即使OFF）→按会话开启→Agent自报claim/basis/evidence→匹配判定与账本→Agent自行核验或降级；/evidence-gate显示/切换/report，不强制拦截最终输出。

DSH bundle与Web client，依赖Host工具结果事件和session上下文；同DSH_HOME多进程共用store为last-write-wins，非数据库并发保证。

**效果与成本**

现金是过门额外工具往返/提示token；人工要填证据、解释弱命中和核对版本。持久索引保留路径/输出词产生本地敏感信息管理成本；误VERIFIED可能比误拦更昂贵。

帮助发现空证据和明显不匹配声明；只有启发式关联，计数提高不证明研究质量提升。

- **思考**：VERIFIED是否超过机制能证明的范围？entryMatches可用basename与包含关系命中，且跨任意其他会话无父子关系限制；某路径存在就能weak却仍verdict=verified。它关联的是活动与文本而非claim语义，也不核工具是否成功或版本一致；模型可跳过工具直接回答，未见输出拦截器。因此“结构强制/实证”应降格为协作约束和启发式匹配。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：比纯“不要猜测”的提示多了可追踪活动索引和显式声明判定，区分已引用/未核验以及弱采信计数。贡献是声明纪律与审查线索，而非独立证据验证器；工具日志来自宿主，事实正确性仍需人工或专门验证。

比纯“不要猜测”的提示多了可追踪活动索引和显式声明判定，区分已引用/未核验以及弱采信计数。贡献是声明纪律与审查线索，而非独立证据验证器；工具日志来自宿主，事实正确性仍需人工或专门验证。

有界索引/近期会话、debounced写临时文件再rename与来源隔离使台账可恢复；弱采信单独计数有透明性，但顶层VERIFIED掩盖证据强度、跨会话归因过宽。

固定源码依据：[lib/index.js](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/lib/index.js)、[lib/client.mjs](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/lib/client.mjs)、[package.json](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/package.json)、[cordis.patch.yml](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/cordis.patch.yml)。

<a id="detail-section-5"></a>

### 主要限制

VERIFIED是否超过机制能证明的范围？entryMatches可用basename与包含关系命中，且跨任意其他会话无父子关系限制；某路径存在就能weak却仍verdict=verified。它关联的是活动与文本而非claim语义，也不核工具是否成功或版本一致；模型可跳过工具直接回答，未见输出拦截器。因此“结构强制/实证”应降格为协作约束和启发式匹配。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：0.2.1；版本日期：2026-09-12（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[845ddf41](https://github.com/AaronandWork/dsh-evidence-gate/tree/845ddf415e045eb6b2a014bca97a9c63aee1befa)；本轮基准：2026-10-21T05:26:52Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根Host活动索引、路径/URL匹配、判定、持久化及注册，client槽位与README；未执行目标，不对全部政策和匹配分支做完整审计。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

把活动回执绑定成功状态、内容摘要、当前版本与会话委派谱系，并将weak保持UNVERIFIED，可能降低假验证。用同basename异文件、失败read、旧版本测试及无关会话同路径反例，比较误VERIFIED率和真实证据召回；若误报下降代价是大量真实证据被拒，应展示置信分层而非二值真值。

未运行；最小反例集合包括失败工具结果、同名异路径、无关会话、旧版本与仅存在路径，并检查Agent不调用gate时是否仍能输出。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 761 | 658 | 53 | — |
| .js | source | 3 | 2236 | 1923 | 175 | — |
| .md | source | 1 | 249 | — | — | 3591 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AaronandWork/dsh-evidence-gate/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AaronandWork/dsh-evidence-gate/issues?q=is%3Aissue+created%3A2026-09-21T05%3A34%3A16.566Z..2026-10-21T05%3A34%3A16.566Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AaronandWork/dsh-evidence-gate/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A34%3A16.566Z..2026-10-21T05%3A34%3A16.566Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
