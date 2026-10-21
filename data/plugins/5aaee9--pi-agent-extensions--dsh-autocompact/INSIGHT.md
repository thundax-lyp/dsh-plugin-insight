# dsh-autocompact

> 为会话与模型设置自动压缩阈值，保留近期上下文并调用宿主压缩后端。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[c80abc7](https://github.com/5aaee9/pi-agent-extensions/tree/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/5aaee9/pi-agent-extensions) · [![npm 30d 735](https://img.shields.io/static/v1?label=npm+30d&message=735&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@indexyz/dsh-autocompact)
<!-- END META -->

**使用建议**：长会话且了解模型窗口时可试。先确认阈值、保留尾部和重启行为，用含工具结果的任务检查压缩后能否继续。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [场景与替代办法](#detail-section-2)
  - [能力、依赖与流程](#detail-section-3)
  - [成本与效果](#detail-section-4)
  - [工程亮点](#detail-section-5)
  - [使用判断](#detail-section-6)
  - [能力、流程与成本](#detail-section-7)
  - [工程贡献](#detail-section-8)
  - [核查说明与分析版本](#detail-section-9)
- [未来设计假设（未验证）](#detail-section-10)
- [辅助信息](#detail-section-11)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 场景与替代办法

替代是手工/compact或宿主默认压缩；项目新增细粒度触发策略，不提供独立摘要质量保证。

<a id="detail-section-3"></a>

### 能力、依赖与流程

组件index.ts按会话与provider/model维护覆盖值并访问当前Agent的compaction服务；compaction.ts要求token测量与surface节点一致，保留系统头和预算尾部并检查工具调用配对。

- **用户命令**：/autocompact会话模型阈值
- **事件监听**：请求前测量与平衡选区压缩
- **界面**：模型阈值设置

依赖commands/tokenMeter/llm及当前Agent挂载的compaction；继承@indexyz/pi-autocompact思路，包组件路径限定dsh-autocompact。

设置会话阈值或全局默认→下一请求测量→超阈值选平衡范围→调用当前后端压缩→继续请求；无合适选区让宿主处理。

<a id="detail-section-4"></a>

### 成本与效果

首次核对宿主压缩接口与模型阈值；持续压缩增加摘要模型token和延迟，人工需检查关键事实是否丢失，迁移受DSH服务接口影响。

提前触发有避免溢出的机制价值，但没有整体任务成功率或token节省对照。

<a id="detail-section-5"></a>

### 工程亮点

显式surface一致性校验和toolPairingBalancedBefore比字符截断更稳；serviceForAgent处理预设隔离。可复用纯范围选择逻辑，必须保留宿主版本与配对不变量。

源码依据：[dsh-autocompact/index.ts](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/index.ts)、[dsh-autocompact/compaction.ts](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/compaction.ts)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：适合模型上下文预算不同、希望比宿主默认更早压缩的长会话开发者。

- **建议**：待验证假设：在保留token预算之外加入用户目标/未完成工具依赖的保护标签，可改善压缩后任务恢复。对含长工具结果的同一会话比较答案一致性、压缩次数与保留体积；不假设保留更多一定更好。

长会话且了解模型窗口时可试。先确认阈值、保留尾部和重启行为，用含工具结果的任务检查压缩后能否继续。

**核查状态**：已检查固定版本源码，未安装、执行目标插件或完成真实宿主验收。已有贡献仅由固定版本源码支持，实际宿主和任务效果尚未验证；未来设计假设保持未验证。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **用户命令**：/autocompact会话模型阈值
- **事件监听**：请求前测量与平衡选区压缩
- **界面**：模型阈值设置

- **思考**：测量阈值只是压力信号，不保证压缩能保留任务语义；不可拆的大消息或配对范围使选区返回undefined，仍可能溢出。会话命令覆盖在内存里，重启不应被理解为持久配置；默认配置与临时覆盖须区分。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：作者明确这是pi-autocompact的DSH移植；可确认增量是适配DSH的surface位置和Agent平面后端，提供会话阈值而不伪改模型contextWindow。相对全局缩小模型窗口，保留真实元数据并减少跨会话副作用；压缩算法仍归宿主。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- **仓库**：[5aaee9/pi-agent-extensions](https://github.com/5aaee9/pi-agent-extensions)
- **版本号**：0.2.0（[固定提交 c80abc7c](https://github.com/5aaee9/pi-agent-extensions/tree/c80abc7c4904fee9206f8649214a211ef84961ff)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

- 已检查：dsh-autocompact/index.ts、dsh-autocompact/compaction.ts、作者README与固定范围inventory；源码抽读不等于完整审计。
- 未完成：目标插件执行、测试、安装、模型调用和真实宿主验收。
- 证据限制：核查固定提交内列明入口、核心实现及相关配置/作者材料的源码子集；未执行插件、其测试、安装、付费请求或真实宿主验收，未核实独立用户采用。
- 下一步：固定宿主验证surface漂移、超大单条、工具配对、不同模型阈值及重启覆盖丢失；本轮只阅读组件源码。

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：在保留token预算之外加入用户目标/未完成工具依赖的保护标签，可改善压缩后任务恢复。对含长工具结果的同一会话比较答案一致性、压缩次数与保留体积；不假设保留更多一定更好。

固定宿主验证surface漂移、超大单条、工具配对、不同模型阈值及重启覆盖丢失；本轮只阅读组件源码。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：dsh-autocompact；内容摘要：ec24357b1149c93ce16ad7d97590da225ddf609687dd0e5d4d701a5e96f3b54f。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 17 | 1360 | — | — | 17288 |
| .ts | source | 12 | 1490 | 920 | 467 | — |
| .tsx | source | 6 | 1009 | 770 | 184 | — |
| .ts | test | 5 | 1610 | 1366 | 100 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/5aaee9/pi-agent-extensions/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
