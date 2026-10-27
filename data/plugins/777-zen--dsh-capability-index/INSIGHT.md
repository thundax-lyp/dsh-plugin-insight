# dsh-capability-index

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[c180313](https://github.com/777-Zen/dsh-capability-index/tree/c1803133660c6bc30dbc2d3eda493724b801aad0)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/777-Zen/dsh-capability-index)
<!-- END META -->

> **实现功能**：在每步系统上下文中注入候选工具提示，用规则、向量召回与 not_for 过滤预审插件库。

> **核心亮点**：贡献是把“是否值得展示工具”和“模型是否最终调用”分开，并将负向 not_for 守门放在 Top-K 截断前；相比简单列全量工具，减少无关上下文。但作者已明确归档，16 条样本不足以证明利用率收益，且官方同类能力可能消解独立价值。 详见[Q03](#research-q03)。

> **风险与缺陷**：核心质疑是提示本身是否比原生 schema 更有净收益。启发式触发表可能漏掉隐含任务或把普通请求判成复杂任务，向量模型也会引入延迟；若仅提高工具曝光却增加错误调用和 token，则贡献不成立。项目归档意味着未来 DSH 接口漂移无人维护。 详见[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 谁在何种重复场景需要 dsh-capability-index，合格交付与简单替代是什么？](#detail-section-11)
  - [Q02 · dsh-capability-index 的入口、调用链、状态变化与副作用如何实现？](#detail-section-12)
  - [Q03 · 相对宿主原生能力或简单替代，dsh-capability-index 的具体增量是什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使 dsh-capability-index 的核心价值不成立？](#detail-section-14)
  - [Q05 · dsh-capability-index 启动、持续生效与失败降级依赖什么？](#detail-section-15)
  - [Q06 · dsh-capability-index 完成一个合格任务的首次、持续与失败恢复成本是什么？](#detail-section-16)
  - [Q07 · dsh-capability-index 的工程可靠性和可迁移设计如何？](#detail-section-17)
  - [Q08 · 由贡献与限制可推导什么可证伪的新设计假设？](#detail-section-18)
  - [Q09 · 哪些人应观察、试用或拒绝采用 dsh-capability-index？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：工具较多的 DSH 环境里，模型可能漏用已安装能力；基线是依靠工具 schema 和模型自行浏览。插件希望每个用户消息先得到 Top-K 提示，合格结果应是目标工具召回提高，同时无关工具提示、上下文 token 和错误调用不增加。 详见[Q01](#research-q01)。

工具较多的 DSH 环境里，模型可能漏用已安装能力；基线是依靠工具 schema 和模型自行浏览。插件希望每个用户消息先得到 Top-K 提示，合格结果应是目标工具召回提高，同时无关工具提示、上下文 token 和错误调用不增加。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 三层候选判定 | 从插件库筛出可能适用工具 | 只提示不强制；规则和向量均可能误判 |
| not_for 守门 | 在 Top-K 前排除负向场景 | 依赖工具提供质量足够的声明 |
| runtime-context 注入 | 让模型每步看到候选 | 增加上下文 token；项目已归档 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| tools.schemas 与 systemPrompt.context | 必需 | 读取工具视图并注入提示 | 接口变化会失去能力 |
| 嵌入模型资源 | 可选 | 语义召回与 not_for 相似度 | 失败时退化词面规则 |
| 能力声明 | 可选 | 关键词、复杂度与负向边界 | 缺失时只靠 schema/脚手架词表 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 建索引 | 插件读取当前 agent 工具 schema | tools/change 后缓存失效 |
| 判定 | 每个真实用户消息做触发和排序 | 无触发可返回空提示 |
| 注入 | system prompt 放入 Top-K 提示 | 模型仍自行决定是否调用 |
| 复核 | 维护者分析误召回/漏召回 | 调整词表、阈值或声明 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地嵌入资源占磁盘/内存，金额未给 | 补声明、校准阈值与样本 | 16 条样本不能代表真实库 |
| 持续使用 | 每步向量/排序计算与提示 token | 监看错误调用和漏召回 | 大型工具库延迟未知 |
| 失败恢复 | 无外部重试费；可禁用语义层 | 排查声明或回退原生 schema | 归档后需自行维护兼容 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 工具召回 | 源码实现规则、语义和负向过滤 | 真实正确调用率是否提高 |
| 上下文控制 | Top-K 而非全量重复提示 | 额外 token 与延迟净值 |
| 安全降级 | 向量失败不阻断 prompt | 降级后召回质量 |

> **思考**：核心质疑是提示本身是否比原生 schema 更有净收益。启发式触发表可能漏掉隐含任务或把普通请求判成复杂任务，向量模型也会引入延迟；若仅提高工具曝光却增加错误调用和 token，则贡献不成立。项目归档意味着未来 DSH 接口漂移无人维护。 详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：贡献是把“是否值得展示工具”和“模型是否最终调用”分开，并将负向 not_for 守门放在 Top-K 截断前；相比简单列全量工具，减少无关上下文。但作者已明确归档，16 条样本不足以证明利用率收益，且官方同类能力可能消解独立价值。 详见[Q03](#research-q03)。

贡献是把“是否值得展示工具”和“模型是否最终调用”分开，并将负向 not_for 守门放在 Top-K 截断前；相比简单列全量工具，减少无关上下文。但作者已明确归档，16 条样本不足以证明利用率收益，且官方同类能力可能消解独立价值。 详见[Q03](#research-q03)。

core 与 DSH adapter 分离，缓存按工具变化失效，异常路径刻意不打断事件分发，适合作为提示层设计参考；但归档、缺真实用户反馈和小样本评估使可靠性结论很弱。移植应先复用纯逻辑评测框架而非直接挂到生产 prompt。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

核心质疑是提示本身是否比原生 schema 更有净收益。启发式触发表可能漏掉隐含任务或把普通请求判成复杂任务，向量模型也会引入延迟；若仅提高工具曝光却增加错误调用和 token，则贡献不成立。项目归档意味着未来 DSH 接口漂移无人维护。 详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

不建议作为当前生产依赖：仓库已归档且作者承认 16 样本不足。研究工具选择提示、负向声明或离线评测的开发者可阅读源码和复现实验；只有在固定 DSH 版本上证明正确调用率净提升、额外 token 可接受且有维护接手人后再考虑试用。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认了用户消息捕获、工具索引缓存、规则/向量召回、not_for 前置过滤和 runtime-context 注入；项目已归档，作者也承认 16 条样本不足，本轮没有运行评测，所以只能确认提示机制，不能确认工具利用率净提升或当前 DSH 兼容。

- 已检查：作者 README、包清单、源码路径 README.md、lib/dsh-adapter.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 c1803133660c6bc30dbc2d3eda493724b801aad0 的作者材料、入口与关键源码；不运行插件、测试、外部服务或真实 Host；检查时间不早于 2026-10-22T15:49:47Z。
- 下一步：以同一固定工具库跑原生 schema、当前三层索引和按需门控三组盲测；预注册成功工具与禁用工具金标，记录 Top-K 召回、实际调用、错误调用、提示 token 和时延，若端到端合格率无显著改善则维持不推荐。

**分析版本**

- **仓库**：[777-Zen/dsh-capability-index](https://github.com/777-Zen/dsh-capability-index)
- **版本号**：0.2.0（[固定提交 c180313](https://github.com/777-Zen/dsh-capability-index/tree/c1803133660c6bc30dbc2d3eda493724b801aad0)）
- **版本日期**：2026-09-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是只在原生工具选择出现高熵时注入候选，而不是每步预审，可减少上下文成本同时保留召回。最小 A/B 用 100 个含/不含工具需求的盲测任务，比原生、现插件、熵门控三组的正确工具调用率、无关调用率、提示 token 和端到端合格率；净收益不超过原生即否定。 详见[Q08](#research-q08)。

以同一固定工具库跑原生 schema、当前三层索引和按需门控三组盲测；预注册成功工具与禁用工具金标，记录 Top-K 召回、实际调用、错误调用、提示 token 和时延，若端到端合格率无显著改善则维持不推荐。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 158 | — | — | 1812 |
| .mjs | source | 5 | 1507 | 1277 | 173 | — |
| .js | example | 1 | 274 | 235 | 26 | — |
| .md | example | 1 | 39 | — | — | 388 |
| .js | source | 7 | 1656 | 1066 | 506 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/777-Zen/dsh-capability-index/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/777-Zen/dsh-capability-index/issues?q=is%3Aissue+created%3A2026-09-22T16%3A03%3A22.086Z..2026-10-22T16%3A03%3A22.086Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/777-Zen/dsh-capability-index/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T16%3A03%3A22.086Z..2026-10-22T16%3A03%3A22.086Z)



统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：dsh-capability-index 在固定版本下是否以可控依赖和总成本交付其核心能力，并值得目标用户采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种重复场景需要 dsh-capability-index，合格交付与简单替代是什么？

**研究主题**：场景与需求

#### 完整回答

工具较多的 DSH 环境里，模型可能漏用已安装能力；基线是依靠工具 schema 和模型自行浏览。插件希望每个用户消息先得到 Top-K 提示，合格结果应是目标工具召回提高，同时无关工具提示、上下文 token 和错误调用不增加。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-27](https://github.com/777-Zen/dsh-capability-index/blob/c1803133660c6bc30dbc2d3eda493724b801aad0/README.md#L1-L27)

固定版本作者材料支持 Q01 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（27行）</summary>

```text
# dsh-capability-index

  > **⚠️ Archived / 已归档** — 本项目不再维护。最后版本：v0.2.0（2026-08-27）。
![Archived](https://img.shields.io/badge/status-archived-lightgrey)
  ---

  ## 这是什么

  dsh-capability-index 是一个为 DeepSeek Harness (DSH) 开发的**元插件（meta-plugin）**，目标是提高 AI agent 对已有插件库
  的利用率。

  核心思路：在 agent 处理任务前，自动扫描已启用的插件库，将"可能适用的插件"以提示块的形式注入上下文，让 agent 从"凭直觉
  选工具"变成"系统性地预审插件库"。

  ### 核心设计

  - **三层触发判定**：规则词表（硬层）→ 语义向量召回（语义层）→ `not_for` 守门闸（负向过滤）
  - **零侵入**：通过 DSH 原生 runtime-context 通道注入，不改写其他插件的工具定义
  - **模型自主决策**：只提示、不强制调用，最终决策权仍在模型

  ## 为什么停止维护

  1. DSH 正式版持续延期，生态用户基数过小，无法获得真实使用反馈
  2. 16 条样本的评估不足以证明核心价值，缺乏用户数据就无法验证效果
  3. 官方大概率会自行实现同类功能，第三方插件的护城河接近于零

  继续投入的 ROI 不合理，遂于 v0.2.0 及时止损归档。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · dsh-capability-index 的入口、调用链、状态变化与副作用如何实现？

**研究主题**：功能与机制

#### 完整回答

agent/inbox/claimed 捕获真实用户消息，tools/change 使索引缓存失效；纯逻辑层以规则触发和工具 schema 排序，语义向量尽力预取，not_for 在截断前过滤，随后通过 systemPrompt context 注入提示而不强制调用。语义引擎失败时降级词面规则。

#### 证据与依据

**依据 1 · 源码核查**：[lib/dsh-adapter.js:188-255](https://github.com/777-Zen/dsh-capability-index/blob/c1803133660c6bc30dbc2d3eda493724b801aad0/lib/dsh-adapter.js#L188-L255)

固定版本源码用于核对 Q02 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（68行）</summary>

```text
  // 工具集变更：清空全部视图缓存（事件无载荷且可能只涉单 scope，保守失效）
  ctx.on('tools/change', () => {
    try {
      viewCache.clear()
    } catch {
      // 永不打断事件分发
    }
  })

  // agent 销毁：清理其消息状态与工具视图缓存（防会话树增长下的 Map 泄漏）
  ctx.on('agent/disposed', payload => {
    try {
      const agent = payload?.agent
      if (agent === null || agent === undefined) return
      const id = String(agent.id)
      perAgent.delete(id)
      viewCache.delete(id)
    } catch {
      // 永不打断事件分发
    }
  })

  // 消息捕获：agent/inbox/claimed 先于 prompt 组装触发（时序见 handoff-notes）
  ctx.on('agent/inbox/claimed', payload => {
    try {
      const message = payload?.message
      if (message === null || message === undefined
        || message.source === undefined || message.source.kind !== 'user') return
      const { text, hasImage } = messageText(message)
      if (text === '') return
      const agent = payload?.agent ?? null
      const id = agent === null ? 'agent' : String(agent.id)
      const st = stateFor(id)
      if (st.text !== '' && st.text !== text) {
        // 消息切换：上一消息的渲染结果封存为"已提示清单"，旧向量作废
        st.lastTop = st.pendingTop
        st.pendingTop = []
        st.taskVec = null
        st.toolVecs = null
        st.notForVecs = null
        st.lastLogged = ''
      }
      st.text = text
      st.hasImage = hasImage
      if (typeof payload?.turn === 'number') st.turn = payload.turn
      // 预取向量（M2）：视图走缓存（首次才触发 schemas 克隆）；失败自动降级
      try {
        prefetchVectors(st, agent, viewFor(agent))
      } catch {
        // 预取失败不影响注入
      }
    } catch {
      // 永不打断事件分发
    }
  })

  ctx.systemPrompt.context({
    name: core.CONTEXT_NAME,
    order: core.CONTEXT_ORDER,
    text: assembly => {
      try {
        const agent = assembly?.agent
        if (agent === null || agent === undefined) return ''
        const st = stateFor(String(agent.id))
        if (st.text === '') return ''
        const view = viewFor(agent)
        const enrich = declsFor()
        const planOnly = planProbe(ctx, agent)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对宿主原生能力或简单替代，dsh-capability-index 的具体增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

贡献是把“是否值得展示工具”和“模型是否最终调用”分开，并将负向 not_for 守门放在 Top-K 截断前；相比简单列全量工具，减少无关上下文。但作者已明确归档，16 条样本不足以证明利用率收益，且官方同类能力可能消解独立价值。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-27](https://github.com/777-Zen/dsh-capability-index/blob/c1803133660c6bc30dbc2d3eda493724b801aad0/README.md#L1-L27)

固定版本作者材料支持 Q03 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（27行）</summary>

```text
# dsh-capability-index

  > **⚠️ Archived / 已归档** — 本项目不再维护。最后版本：v0.2.0（2026-08-27）。
![Archived](https://img.shields.io/badge/status-archived-lightgrey)
  ---

  ## 这是什么

  dsh-capability-index 是一个为 DeepSeek Harness (DSH) 开发的**元插件（meta-plugin）**，目标是提高 AI agent 对已有插件库
  的利用率。

  核心思路：在 agent 处理任务前，自动扫描已启用的插件库，将"可能适用的插件"以提示块的形式注入上下文，让 agent 从"凭直觉
  选工具"变成"系统性地预审插件库"。

  ### 核心设计

  - **三层触发判定**：规则词表（硬层）→ 语义向量召回（语义层）→ `not_for` 守门闸（负向过滤）
  - **零侵入**：通过 DSH 原生 runtime-context 通道注入，不改写其他插件的工具定义
  - **模型自主决策**：只提示、不强制调用，最终决策权仍在模型

  ## 为什么停止维护

  1. DSH 正式版持续延期，生态用户基数过小，无法获得真实使用反馈
  2. 16 条样本的评估不足以证明核心价值，缺乏用户数据就无法验证效果
  3. 官方大概率会自行实现同类功能，第三方插件的护城河接近于零

  继续投入的 ROI 不合理，遂于 v0.2.0 及时止损归档。
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使 dsh-capability-index 的核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

核心质疑是提示本身是否比原生 schema 更有净收益。启发式触发表可能漏掉隐含任务或把普通请求判成复杂任务，向量模型也会引入延迟；若仅提高工具曝光却增加错误调用和 token，则贡献不成立。项目归档意味着未来 DSH 接口漂移无人维护。

#### 证据与依据

**依据 1 · 源码核查**：[lib/dsh-adapter.js:188-255](https://github.com/777-Zen/dsh-capability-index/blob/c1803133660c6bc30dbc2d3eda493724b801aad0/lib/dsh-adapter.js#L188-L255)

固定版本源码用于核对 Q04 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（68行）</summary>

```text
  // 工具集变更：清空全部视图缓存（事件无载荷且可能只涉单 scope，保守失效）
  ctx.on('tools/change', () => {
    try {
      viewCache.clear()
    } catch {
      // 永不打断事件分发
    }
  })

  // agent 销毁：清理其消息状态与工具视图缓存（防会话树增长下的 Map 泄漏）
  ctx.on('agent/disposed', payload => {
    try {
      const agent = payload?.agent
      if (agent === null || agent === undefined) return
      const id = String(agent.id)
      perAgent.delete(id)
      viewCache.delete(id)
    } catch {
      // 永不打断事件分发
    }
  })

  // 消息捕获：agent/inbox/claimed 先于 prompt 组装触发（时序见 handoff-notes）
  ctx.on('agent/inbox/claimed', payload => {
    try {
      const message = payload?.message
      if (message === null || message === undefined
        || message.source === undefined || message.source.kind !== 'user') return
      const { text, hasImage } = messageText(message)
      if (text === '') return
      const agent = payload?.agent ?? null
      const id = agent === null ? 'agent' : String(agent.id)
      const st = stateFor(id)
      if (st.text !== '' && st.text !== text) {
        // 消息切换：上一消息的渲染结果封存为"已提示清单"，旧向量作废
        st.lastTop = st.pendingTop
        st.pendingTop = []
        st.taskVec = null
        st.toolVecs = null
        st.notForVecs = null
        st.lastLogged = ''
      }
      st.text = text
      st.hasImage = hasImage
      if (typeof payload?.turn === 'number') st.turn = payload.turn
      // 预取向量（M2）：视图走缓存（首次才触发 schemas 克隆）；失败自动降级
      try {
        prefetchVectors(st, agent, viewFor(agent))
      } catch {
        // 预取失败不影响注入
      }
    } catch {
      // 永不打断事件分发
    }
  })

  ctx.systemPrompt.context({
    name: core.CONTEXT_NAME,
    order: core.CONTEXT_ORDER,
    text: assembly => {
      try {
        const agent = assembly?.agent
        if (agent === null || agent === undefined) return ''
        const st = stateFor(String(agent.id))
        if (st.text === '') return ''
        const view = viewFor(agent)
        const enrich = declsFor()
        const planOnly = planProbe(ctx, agent)
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · dsh-capability-index 启动、持续生效与失败降级依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要 DSH tools.schemas、systemPrompt.context 与 inbox/tools change 事件；语义层还需要本地嵌入资源可加载，缺失则降级规则层。能力声明是可选增强；超过缓存/规模假设时没有真实大型库验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-27](https://github.com/777-Zen/dsh-capability-index/blob/c1803133660c6bc30dbc2d3eda493724b801aad0/README.md#L1-L27)

固定版本作者材料支持 Q05 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（27行）</summary>

```text
# dsh-capability-index

  > **⚠️ Archived / 已归档** — 本项目不再维护。最后版本：v0.2.0（2026-08-27）。
![Archived](https://img.shields.io/badge/status-archived-lightgrey)
  ---

  ## 这是什么

  dsh-capability-index 是一个为 DeepSeek Harness (DSH) 开发的**元插件（meta-plugin）**，目标是提高 AI agent 对已有插件库
  的利用率。

  核心思路：在 agent 处理任务前，自动扫描已启用的插件库，将"可能适用的插件"以提示块的形式注入上下文，让 agent 从"凭直觉
  选工具"变成"系统性地预审插件库"。

  ### 核心设计

  - **三层触发判定**：规则词表（硬层）→ 语义向量召回（语义层）→ `not_for` 守门闸（负向过滤）
  - **零侵入**：通过 DSH 原生 runtime-context 通道注入，不改写其他插件的工具定义
  - **模型自主决策**：只提示、不强制调用，最终决策权仍在模型

  ## 为什么停止维护

  1. DSH 正式版持续延期，生态用户基数过小，无法获得真实使用反馈
  2. 16 条样本的评估不足以证明核心价值，缺乏用户数据就无法验证效果
  3. 官方大概率会自行实现同类功能，第三方插件的护城河接近于零

  继续投入的 ROI 不合理，遂于 v0.2.0 及时止损归档。
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · dsh-capability-index 完成一个合格任务的首次、持续与失败恢复成本是什么？

**研究主题**：效果与总成本

#### 完整回答

首次要为工具补能力声明并校准词表、阈值和 not_for；持续每步执行文本判定、Top-K 排序，启用语义时还做向量编码并增加提示 token；误召回要人工纠正，漏召回仍回到原生工具选择。归档状态还带来适配维护成本。

#### 证据与依据

**依据 1 · 源码核查**：[lib/dsh-adapter.js:188-255](https://github.com/777-Zen/dsh-capability-index/blob/c1803133660c6bc30dbc2d3eda493724b801aad0/lib/dsh-adapter.js#L188-L255)

固定版本源码用于核对 Q06 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（68行）</summary>

```text
  // 工具集变更：清空全部视图缓存（事件无载荷且可能只涉单 scope，保守失效）
  ctx.on('tools/change', () => {
    try {
      viewCache.clear()
    } catch {
      // 永不打断事件分发
    }
  })

  // agent 销毁：清理其消息状态与工具视图缓存（防会话树增长下的 Map 泄漏）
  ctx.on('agent/disposed', payload => {
    try {
      const agent = payload?.agent
      if (agent === null || agent === undefined) return
      const id = String(agent.id)
      perAgent.delete(id)
      viewCache.delete(id)
    } catch {
      // 永不打断事件分发
    }
  })

  // 消息捕获：agent/inbox/claimed 先于 prompt 组装触发（时序见 handoff-notes）
  ctx.on('agent/inbox/claimed', payload => {
    try {
      const message = payload?.message
      if (message === null || message === undefined
        || message.source === undefined || message.source.kind !== 'user') return
      const { text, hasImage } = messageText(message)
      if (text === '') return
      const agent = payload?.agent ?? null
      const id = agent === null ? 'agent' : String(agent.id)
      const st = stateFor(id)
      if (st.text !== '' && st.text !== text) {
        // 消息切换：上一消息的渲染结果封存为"已提示清单"，旧向量作废
        st.lastTop = st.pendingTop
        st.pendingTop = []
        st.taskVec = null
        st.toolVecs = null
        st.notForVecs = null
        st.lastLogged = ''
      }
      st.text = text
      st.hasImage = hasImage
      if (typeof payload?.turn === 'number') st.turn = payload.turn
      // 预取向量（M2）：视图走缓存（首次才触发 schemas 克隆）；失败自动降级
      try {
        prefetchVectors(st, agent, viewFor(agent))
      } catch {
        // 预取失败不影响注入
      }
    } catch {
      // 永不打断事件分发
    }
  })

  ctx.systemPrompt.context({
    name: core.CONTEXT_NAME,
    order: core.CONTEXT_ORDER,
    text: assembly => {
      try {
        const agent = assembly?.agent
        if (agent === null || agent === undefined) return ''
        const st = stateFor(String(agent.id))
        if (st.text === '') return ''
        const view = viewFor(agent)
        const enrich = declsFor()
        const planOnly = planProbe(ctx, agent)
```

</details>

#### 缺口

- 真实插件库上的净利用率未知且项目已归档
  **影响**：无法判断提示层是否值得持续维护
  **进一步探讨**：复现 100 个盲测任务，比较正确调用、误调用、token 与时延，并指定维护责任人

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · dsh-capability-index 的工程可靠性和可迁移设计如何？

**研究主题**：工程质量与复用

#### 完整回答

core 与 DSH adapter 分离，缓存按工具变化失效，异常路径刻意不打断事件分发，适合作为提示层设计参考；但归档、缺真实用户反馈和小样本评估使可靠性结论很弱。移植应先复用纯逻辑评测框架而非直接挂到生产 prompt。

#### 证据与依据

**依据 1 · 源码核查**：[lib/dsh-adapter.js:188-255](https://github.com/777-Zen/dsh-capability-index/blob/c1803133660c6bc30dbc2d3eda493724b801aad0/lib/dsh-adapter.js#L188-L255)

固定版本源码用于核对 Q07 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（68行）</summary>

```text
  // 工具集变更：清空全部视图缓存（事件无载荷且可能只涉单 scope，保守失效）
  ctx.on('tools/change', () => {
    try {
      viewCache.clear()
    } catch {
      // 永不打断事件分发
    }
  })

  // agent 销毁：清理其消息状态与工具视图缓存（防会话树增长下的 Map 泄漏）
  ctx.on('agent/disposed', payload => {
    try {
      const agent = payload?.agent
      if (agent === null || agent === undefined) return
      const id = String(agent.id)
      perAgent.delete(id)
      viewCache.delete(id)
    } catch {
      // 永不打断事件分发
    }
  })

  // 消息捕获：agent/inbox/claimed 先于 prompt 组装触发（时序见 handoff-notes）
  ctx.on('agent/inbox/claimed', payload => {
    try {
      const message = payload?.message
      if (message === null || message === undefined
        || message.source === undefined || message.source.kind !== 'user') return
      const { text, hasImage } = messageText(message)
      if (text === '') return
      const agent = payload?.agent ?? null
      const id = agent === null ? 'agent' : String(agent.id)
      const st = stateFor(id)
      if (st.text !== '' && st.text !== text) {
        // 消息切换：上一消息的渲染结果封存为"已提示清单"，旧向量作废
        st.lastTop = st.pendingTop
        st.pendingTop = []
        st.taskVec = null
        st.toolVecs = null
        st.notForVecs = null
        st.lastLogged = ''
      }
      st.text = text
      st.hasImage = hasImage
      if (typeof payload?.turn === 'number') st.turn = payload.turn
      // 预取向量（M2）：视图走缓存（首次才触发 schemas 克隆）；失败自动降级
      try {
        prefetchVectors(st, agent, viewFor(agent))
      } catch {
        // 预取失败不影响注入
      }
    } catch {
      // 永不打断事件分发
    }
  })

  ctx.systemPrompt.context({
    name: core.CONTEXT_NAME,
    order: core.CONTEXT_ORDER,
    text: assembly => {
      try {
        const agent = assembly?.agent
        if (agent === null || agent === undefined) return ''
        const st = stateFor(String(agent.id))
        if (st.text === '') return ''
        const view = viewFor(agent)
        const enrich = declsFor()
        const planOnly = planProbe(ctx, agent)
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与限制可推导什么可证伪的新设计假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是只在原生工具选择出现高熵时注入候选，而不是每步预审，可减少上下文成本同时保留召回。最小 A/B 用 100 个含/不含工具需求的盲测任务，比原生、现插件、熵门控三组的正确工具调用率、无关调用率、提示 token 和端到端合格率；净收益不超过原生即否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/dsh-adapter.js:188-255](https://github.com/777-Zen/dsh-capability-index/blob/c1803133660c6bc30dbc2d3eda493724b801aad0/lib/dsh-adapter.js#L188-L255)

固定版本源码用于核对 Q08 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（68行）</summary>

```text
  // 工具集变更：清空全部视图缓存（事件无载荷且可能只涉单 scope，保守失效）
  ctx.on('tools/change', () => {
    try {
      viewCache.clear()
    } catch {
      // 永不打断事件分发
    }
  })

  // agent 销毁：清理其消息状态与工具视图缓存（防会话树增长下的 Map 泄漏）
  ctx.on('agent/disposed', payload => {
    try {
      const agent = payload?.agent
      if (agent === null || agent === undefined) return
      const id = String(agent.id)
      perAgent.delete(id)
      viewCache.delete(id)
    } catch {
      // 永不打断事件分发
    }
  })

  // 消息捕获：agent/inbox/claimed 先于 prompt 组装触发（时序见 handoff-notes）
  ctx.on('agent/inbox/claimed', payload => {
    try {
      const message = payload?.message
      if (message === null || message === undefined
        || message.source === undefined || message.source.kind !== 'user') return
      const { text, hasImage } = messageText(message)
      if (text === '') return
      const agent = payload?.agent ?? null
      const id = agent === null ? 'agent' : String(agent.id)
      const st = stateFor(id)
      if (st.text !== '' && st.text !== text) {
        // 消息切换：上一消息的渲染结果封存为"已提示清单"，旧向量作废
        st.lastTop = st.pendingTop
        st.pendingTop = []
        st.taskVec = null
        st.toolVecs = null
        st.notForVecs = null
        st.lastLogged = ''
      }
      st.text = text
      st.hasImage = hasImage
      if (typeof payload?.turn === 'number') st.turn = payload.turn
      // 预取向量（M2）：视图走缓存（首次才触发 schemas 克隆）；失败自动降级
      try {
        prefetchVectors(st, agent, viewFor(agent))
      } catch {
        // 预取失败不影响注入
      }
    } catch {
      // 永不打断事件分发
    }
  })

  ctx.systemPrompt.context({
    name: core.CONTEXT_NAME,
    order: core.CONTEXT_ORDER,
    text: assembly => {
      try {
        const agent = assembly?.agent
        if (agent === null || agent === undefined) return ''
        const st = stateFor(String(agent.id))
        if (st.text === '') return ''
        const view = viewFor(agent)
        const enrich = declsFor()
        const planOnly = planProbe(ctx, agent)
```

</details>

#### 缺口

- 真实插件库上的净利用率未知且项目已归档
  **影响**：无法判断提示层是否值得持续维护
  **进一步探讨**：复现 100 个盲测任务，比较正确调用、误调用、token 与时延，并指定维护责任人

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 哪些人应观察、试用或拒绝采用 dsh-capability-index？

**研究主题**：采用判断

#### 完整回答

不建议作为当前生产依赖：仓库已归档且作者承认 16 样本不足。研究工具选择提示、负向声明或离线评测的开发者可阅读源码和复现实验；只有在固定 DSH 版本上证明正确调用率净提升、额外 token 可接受且有维护接手人后再考虑试用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-27](https://github.com/777-Zen/dsh-capability-index/blob/c1803133660c6bc30dbc2d3eda493724b801aad0/README.md#L1-L27)

固定版本作者材料支持 Q09 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（27行）</summary>

```text
# dsh-capability-index

  > **⚠️ Archived / 已归档** — 本项目不再维护。最后版本：v0.2.0（2026-08-27）。
![Archived](https://img.shields.io/badge/status-archived-lightgrey)
  ---

  ## 这是什么

  dsh-capability-index 是一个为 DeepSeek Harness (DSH) 开发的**元插件（meta-plugin）**，目标是提高 AI agent 对已有插件库
  的利用率。

  核心思路：在 agent 处理任务前，自动扫描已启用的插件库，将"可能适用的插件"以提示块的形式注入上下文，让 agent 从"凭直觉
  选工具"变成"系统性地预审插件库"。

  ### 核心设计

  - **三层触发判定**：规则词表（硬层）→ 语义向量召回（语义层）→ `not_for` 守门闸（负向过滤）
  - **零侵入**：通过 DSH 原生 runtime-context 通道注入，不改写其他插件的工具定义
  - **模型自主决策**：只提示、不强制调用，最终决策权仍在模型

  ## 为什么停止维护

  1. DSH 正式版持续延期，生态用户基数过小，无法获得真实使用反馈
  2. 16 条样本的评估不足以证明核心价值，缺乏用户数据就无法验证效果
  3. 官方大概率会自行实现同类功能，第三方插件的护城河接近于零

  继续投入的 ROI 不合理，遂于 v0.2.0 及时止损归档。
```

</details>

#### 缺口

- 真实插件库上的净利用率未知且项目已归档
  **影响**：无法判断提示层是否值得持续维护
  **进一步探讨**：复现 100 个盲测任务，比较正确调用、误调用、token 与时延，并指定维护责任人

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
