# dsh-progress-viz-plugin

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[7369098](https://github.com/2008924/dsh-progress-viz/tree/736909845ac33cf5ac671e1a4b6beecc814d983f/plugin)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：监听 DSH 会话语义事件并输出进度 JSON，供外部看板展示。

> **核心亮点**：相对看板直接解压会话日志，组件增量是由宿主实时输出归一化进度，减少重复解析和噪音；外部Python看板属于仓库其他部分，本组件只提供事件适配与文件协议。

> **风险与缺陷**：finished语义最影响用户判断：源码handleEvent开头对finished直接return，armIdleTimer会在turn/end后空闲超时设置finished；因此同一会话过了默认15秒再有新一轮时，ensureState仍复用旧对象，后续语义事件会被忽略，直到销毁/重建。它是观测生命周期边界，不可当成任务永久办结。

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

> **用途**：运行长任务的用户希望离开聊天后仍能看到阶段、动作和时间线；交付是会话活动观测，不是业务完成证明。

参照同仓库独立版zstd解析器与人工盯聊天；没有运行事件重放或Python看板。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **事件监听**：session/created、session/event、session/disposed
- **后台**：会话进度JSON与语义时间线输出

**流程与依赖**

需要DSH会话事件API和可写progress目录；外部看板还需Python等依赖，不能将整仓库依赖算成插件启动必需。成本采用硬编码deepseek-chat近似价而非实际路由价。

挂载组件配置输出目录，宿主事件推进todo/步骤/动作并写JSON；看板优先读插件文件，缺失回退日志解析；空闲标finished后应检查是否仍有后续任务，用户不能只凭finished验收。

**效果与成本**

持续文件重写占IO，语义过滤减少chunk级写入；人工成本是维护看板和判断进度含义。费用字段为近似，不能作实际账单。

统一轻量JSON接口便于外部消费；阶段和finished是规则推导，无法证明合格成果或剩余时间。

> **思考**：finished语义最影响用户判断：源码handleEvent开头对finished直接return，armIdleTimer会在turn/end后空闲超时设置finished；因此同一会话过了默认15秒再有新一轮时，ensureState仍复用旧对象，后续语义事件会被忽略，直到销毁/重建。它是观测生命周期边界，不可当成任务永久办结。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对看板直接解压会话日志，组件增量是由宿主实时输出归一化进度，减少重复解析和噪音；外部Python看板属于仓库其他部分，本组件只提供事件适配与文件协议。

相对看板直接解压会话日志，组件增量是由宿主实时输出归一化进度，减少重复解析和噪音；外部Python看板属于仓库其他部分，本组件只提供事件适配与文件协议。

plugin/src/index.ts的SEMANTIC_TYPES过滤与timelineMax限制有利控制噪音/体积，单会话文件加current方便消费者；但idle终结与finished短路把回合状态固化成会话终态，是复用时应拆开的状态语义。 源码：[plugin/src/index.ts](https://github.com/2008924/dsh-progress-viz/blob/736909845ac33cf5ac671e1a4b6beecc814d983f/plugin/src/index.ts)、[plugin/src/types.ts](https://github.com/2008924/dsh-progress-viz/blob/736909845ac33cf5ac671e1a4b6beecc814d983f/plugin/src/types.ts)。

<a id="detail-section-5"></a>

### 1.4 主要限制

finished语义最影响用户判断：源码handleEvent开头对finished直接return，armIdleTimer会在turn/end后空闲超时设置finished；因此同一会话过了默认15秒再有新一轮时，ensureState仍复用旧对象，后续语义事件会被忽略，直到销毁/重建。它是观测生命周期边界，不可当成任务永久办结。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合看长任务活动；先验证同会话空闲后继续工作的显示，关键任务以实际产物和会话结果验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献机制有固定源码支持；效果与采用收益为条件性解释，后续设计假设尚未验证。

- 已检查：作者 README、包清单、源码路径 plugin/src/index.ts、plugin/src/types.ts 及固定范围 inventory；组件：plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定提交的所列核心实现与作者材料；未运行插件、安装、测试或真实宿主验收，未确认独立用户效果。
- 下一步：在受控事件源发turn/end，等超过idleTimeout再发turn/start与tool/call，检查JSON时间线是否更新；再发送disposed及迟到事件。与当前实现比误终结率，若复活导致已销毁会话恢复则需要墓碑而非简单清标记。

**分析版本**

- **仓库**：[2008924/dsh-progress-viz](https://github.com/2008924/dsh-progress-viz)
- **版本号**：0.1.0（[固定提交 7369098](https://github.com/2008924/dsh-progress-viz/tree/736909845ac33cf5ac671e1a4b6beecc814d983f)）
- **版本日期**：2026-08-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：把“当前回合空闲”与“会话终结”分成两轴，并允许新turn复活进度，可减少长会话看板冻结误报。由上述finished短路推导；需防止销毁后迟到事件重建幽灵会话。

在受控事件源发turn/end，等超过idleTimeout再发turn/start与tool/call，检查JSON时间线是否更新；再发送disposed及迟到事件。与当前实现比误终结率，若复活导致已销毁会话恢复则需要墓碑而非简单清标记。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 432 | 358 | 79 | — |
| .md | source | 1 | 93 | — | — | 716 |
| .ts | source | 2 | 565 | 411 | 124 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2008924/dsh-progress-viz/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/2008924/dsh-progress-viz/issues?q=is%3Aissue+created%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2008924/dsh-progress-viz/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z)



统计日期：2026-10-22。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
