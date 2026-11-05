# StrataGate AgentMemory

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[0c47fb1](https://github.com/diqierjia/StrataGate-AgentMemory/tree/0c47fb18ba04c2222f4da851dcf40ce5553cd05a)

<!-- BEGIN META -->
[![GitHub ★ 112](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=112&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/diqierjia/StrataGate-AgentMemory) [![npm 30d 8,539](https://img.shields.io/static/v1?label=npm+30d&message=8%2C539&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/stratagate-dsh) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/stratagate-dsh)
<!-- END META -->

> **功能**：为 DSH 提供分层会话记忆、事件检索、目录和提示词上下文。

> **亮点**：[Q01](#research-q01) 把分层记忆与可查询历史接到 DSH。

> **主要限制**：[Q02](#research-q02) 画像共享、后台模型输入及评测归因需分别判断。

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
  - [Q01 · StrataGate 怎样为长任务补历史？](#detail-section-11)
  - [Q02 · 模型开销、隐私和公开评测有何边界？](#detail-section-12)
  - [Q03 · 怎样判断是否值得保留？](#detail-section-13)
  - [Q04 · 怎样减少应检索而未检索的回答？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在长期项目中查找较早对话证据的用户。

保留最近窗口并由用户手工重述历史事实。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 短期记忆 | 分层组装上下文 | 模型推断待验证 |
| 长期记忆 | 保存和找回事件 | 关注画像跨空间 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH | 必需 | 会话与提示词事件 | 沿用手工回填 |
| 模型和测试库 | 必需 | 后台派生与存储 | 暂停摄取 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 隔离 profile 和测试库 | 建立对照样本 |
| 验证 | 查请求和检索证据 | 测实际成本 |
| 退出 | 禁用并核对提示词 | 备份测试库 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 模型费用未知 | 建立对照 | 未实测 |
| 持续 | 后台与主请求分别计费 | 核对错误和费用 | 按实际模型 |
| 退出 | 迁移成本未知 | 备份与清理 | 查保留范围 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 历史证据 | 可自动组装或主动找回 | 覆盖率 |
| 成本 | 作者列出不同阶段 | 实际支出 |

> **思考**：[Q02](#research-q02) 画像共享、后台模型输入及评测归因需分别判断。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把分层记忆与可查询历史接到 DSH。

[Q02](#research-q02) 保留原始证据和模型输入范围。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 画像共享、后台模型输入及评测归因需分别判断。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 用无敏感信息的测试库。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码及作者评测，未复现。

- 已检查：作者 README、包清单、源码路径 README.zh-CN.md、src/index.ts、src/llm.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根身份的 DSH 代表实现。
- 下一步：验证跨空间、账单和检索。

**分析版本**

- **仓库**：[diqierjia/StrataGate-AgentMemory](https://github.com/diqierjia/StrataGate-AgentMemory)
- **版本号**：0.3.7（[固定提交 0c47fb1](https://github.com/diqierjia/StrataGate-AgentMemory/tree/0c47fb18ba04c2222f4da851dcf40ce5553cd05a)）
- **版本日期**：2026-10-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 历史指代触发可能减少漏检。

验证跨空间、账单和检索。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 19 | 3126 | — | — | 48867 |
| .mjs | source | 7 | 1418 | 1311 | 56 | — |
| .ts | source | 49 | 19702 | 17754 | 555 | — |
| .ts | test | 44 | 19953 | 18789 | 133 | — |
| .ts | example | 1 | 87 | 74 | 4 | — |
| .mjs | example | 1 | 173 | 167 | 2 | — |
| .js | source | 1 | 4110 | 3914 | 14 | — |
| .md | example | 2 | 12 | — | — | 93 |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/diqierjia/StrataGate-AgentMemory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/diqierjia/StrataGate-AgentMemory/issues?q=is%3Aissue+created%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/diqierjia/StrataGate-AgentMemory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：如何采集会话和注入分层记忆？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · StrataGate 怎样为长任务补历史？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

需要跨会话延续项目的用户可让插件从 session/event 接收事件，通过模型摘要生成分层信息，在提示词中注入画像、目录及自动上下文，并提供主动检索工具。相比总是把长历史全部放进提示词，分层路径允许默认携带简化视图，再按任务找原始证据。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:152-195](https://github.com/diqierjia/StrataGate-AgentMemory/blob/0c47fb18ba04c2222f4da851dcf40ce5553cd05a/src/index.ts#L152-L195)

提示词组装、工具和事件订阅

<details>
<summary>查看原文（44行）</summary>

```text
  ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
    const assembled = await next()
    const contexts = [...assembled.contexts]
    try {
      const profile = runtime.renderProfileContext()
      if (profile) contexts.push({ name: 'stratagate:persistent-profile', text: profile })
    } catch (error) {
      ctx.logger.warn(`stratagate-memory profile context failed: ${renderError(error)}`)
      throw error
    }
    const session = context.agent?.session
    if (!session) return { ...assembled, contexts }
    // Open/cache Memory through Auto Context first so cold directory navigation
    // reuses the active space. Keep the directory first in the injected prompt.
    let autoMemory: { name: string; text: string } | undefined
    try {
      const text = await runtime.buildAutoContext(session)
      autoMemory = { name: 'stratagate:auto-memory', text }
    } catch (error) {
      ctx.logger.warn(`stratagate-memory auto-context failed: ${renderError(error)}`)
      runtime.notePluginError(session, error)
    }
    try {
      const directory = await runtime.buildMemoryDirectory(session)
      if (directory) contexts.push({ name: 'stratagate:memory-directory', text: directory })
    } catch (error) {
      ctx.logger.warn(`stratagate-memory directory failed: ${renderError(error)}`)
      runtime.notePluginError(session, error)
    }
    if (autoMemory) contexts.push(autoMemory)
    const feedbackSuggestion = runtime.takeFeedbackSuggestion(session)
    if (feedbackSuggestion) contexts.push({ name: 'stratagate:feedback-suggestion', text: feedbackSuggestion })
    return { ...assembled, contexts }
  })
  installRetrievalFinalization(ctx, runtime)
  registerMemoryTools(ctx, runtime)
  ctx.on('tools/result', (exec, result) => {
    if (!result.isError || !exec.agent) return
    if (exec.name === 'feedback_prepare' || exec.name.startsWith('memory_')) {
      runtime.notePluginError(exec.agent.session, result.error.message)
    }
  })
  const disposeAdminRoutes = registerAdminRoutes(ctx, runtime)
  ctx.on('session/event', (session, event) => runtime.acceptEvent(session, event))
```

</details>

**依据 2 · 源码核查**：[src/llm.ts:661-678](https://github.com/diqierjia/StrataGate-AgentMemory/blob/0c47fb18ba04c2222f4da851dcf40ce5553cd05a/src/llm.ts#L661-L678)

后台结构化摘要与事件提取

<details>
<summary>查看原文（18行）</summary>

```text
  readonly summarizer: BlockSummarizer = async (messages) => {
    const raw = object(await this.callStructured('summarizer',
      SUMMARIZER_SYSTEM_PROMPT,
      { messages: buildMemoryDerivationMessages(messages) },
    ))
    return {
      l0Title: text(raw.l0Title).slice(0, 120),
      l0Tags: strings(raw.l0Tags).slice(0, 12),
      l1Summary: text(raw.l1Summary).slice(0, 2_000),
      l2Keypoints: strings(raw.l2Keypoints).slice(0, 20),
      shouldExtract: raw.shouldExtract === true,
    }
  }

  readonly extractor: EventExtractor = async (context: ExtractionContext) => {
    const validMessageIds = new Set(context.target.l5Raw.map((message) => message.id))
    const raw = object(await this.callStructured('extractor',
      `You are the StrataGate Event Extractor. Make the final extraction decision independently of the Summarizer's high-recall pre-screen. Extract durable, evidence-backed events from target.messages, then call ${STRUCTURED_TOOLS.extractor.name} exactly once. If none qualifies, set shouldExtract=false and events=[]; give a brief reason, not an Event body.
```

</details>

**依据 3 · 作者声明**：[README.zh-CN.md:112-136](https://github.com/diqierjia/StrataGate-AgentMemory/blob/0c47fb18ba04c2222f4da851dcf40ce5553cd05a/README.zh-CN.md#L112-L136)

作者说明分层设计

<details>
<summary>查看原文（25行）</summary>

```text
## 它如何工作

![图 1：StrataGate 整体处理流程——分层对话、事件、图谱与主题目录，以及检索和证据检查](docs/assets/stratagate-memory-workflow-zh-v030.jpg)

图中展示的是答案采用后的 Event 强化流程；主动保存重复信息也可强化已有 Event。Block 展开改变的是展示层，目录与概览本身不作为强化证据。常驻画像单独提供，见[常驻画像说明](#persistent-profile)。

1. **保存对话。** 若干轮连续对话组成一个记忆块（Block），保存为从索引到原文的六种视图。旧 Block 默认展示的内容随对话推进逐渐变简，需要细节时可以重新展开。
2. **整理长期信息。** 有后续用途的事实、决定、偏好和要求被提取为事件（Event），保留时间、适用范围与来源。知识图谱据此整理当前状态，主题目录与概览把相关事件组织为章节和小节。
3. **回答时找回。** 插件默认提供当前对话、已设置的常驻画像、少量相关记忆和简短主题目录。信息不足时，Agent 可直接搜索事件、图谱或原文，也可先浏览目录、展开概览，再查找来源事件。
4. **检查证据并记录采用。** Agent 判断显式检索到的证据是否足以回答；不足时继续检索或展开，充分时据此回答，并记录实际采用的 Event，用于更新长期权重。

自动召回最多带入 **4 条 Event 和 4 个图谱节点**，预算约 **900 tokens**；主题目录另有约 **400 tokens** 的预算，内容较多时提供分类和分页入口。常驻画像、分层 Block 和尚未封存的对话分别提供，不包含在上述两项预算中。

目录和概览在后台用已有事件分批整理。读取已有目录或概览本身不调用模型、不生成证据批次，也不强化记忆。→ [记忆目录与主题概览](docs/MEMORY_TOPICS.zh-CN.md)

## 核心设计

| 机制 | 变化的内容 | 保留的内容 |
| --- | --- | --- |
| 短期记忆简化 | 旧 Block 默认使用哪个 L0–L5 视图 | L5 原始对话与工具记录 |
| 长期权重衰减 | Event 在后续召回中的优先级 | Event 历史及其来源 |

两者都随对话进度变化：短期按就绪 Block 距离计算，长期按对话轮次计算。放置几天本身不会触发这两种衰减。

<a id="layered-memory"></a>
```

</details>

#### 缺口

- 固定版本未在宿主中运行
  **影响**：不知道实际召回完整性
  **进一步探讨**：合成项目对话验证索引和检索

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模型开销、隐私和公开评测有何边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

后台摘要路径把消息派生视图给模型，自动记忆和画像会进入主提示词。作者称默认按 cwd 划分空间，持久画像跨空间；项目配置不能直接当成完整数据隔离。作者报告 LoCoMo conv-26 152 题平均评审准确率 80.46%，对照 63.22%，十次是评审重复。样本内 31 道多数票错误，包含 15 道未检索及 14 道证据判充分仍错，结果既不能外推全数据集，也不能归因给单一模块。

#### 证据与依据

**依据 1 · 源码核查**：[src/llm.ts:661-678](https://github.com/diqierjia/StrataGate-AgentMemory/blob/0c47fb18ba04c2222f4da851dcf40ce5553cd05a/src/llm.ts#L661-L678)

模型接收派生消息

<details>
<summary>查看原文（18行）</summary>

```text
  readonly summarizer: BlockSummarizer = async (messages) => {
    const raw = object(await this.callStructured('summarizer',
      SUMMARIZER_SYSTEM_PROMPT,
      { messages: buildMemoryDerivationMessages(messages) },
    ))
    return {
      l0Title: text(raw.l0Title).slice(0, 120),
      l0Tags: strings(raw.l0Tags).slice(0, 12),
      l1Summary: text(raw.l1Summary).slice(0, 2_000),
      l2Keypoints: strings(raw.l2Keypoints).slice(0, 20),
      shouldExtract: raw.shouldExtract === true,
    }
  }

  readonly extractor: EventExtractor = async (context: ExtractionContext) => {
    const validMessageIds = new Set(context.target.l5Raw.map((message) => message.id))
    const raw = object(await this.callStructured('extractor',
      `You are the StrataGate Event Extractor. Make the final extraction decision independently of the Summarizer's high-recall pre-screen. Extract durable, evidence-backed events from target.messages, then call ${STRUCTURED_TOOLS.extractor.name} exactly once. If none qualifies, set shouldExtract=false and events=[]; give a brief reason, not an Event body.
```

</details>

**依据 2 · 源码核查**：[src/index.ts:152-181](https://github.com/diqierjia/StrataGate-AgentMemory/blob/0c47fb18ba04c2222f4da851dcf40ce5553cd05a/src/index.ts#L152-L181)

画像及自动记忆注入

<details>
<summary>查看原文（30行）</summary>

```text
  ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
    const assembled = await next()
    const contexts = [...assembled.contexts]
    try {
      const profile = runtime.renderProfileContext()
      if (profile) contexts.push({ name: 'stratagate:persistent-profile', text: profile })
    } catch (error) {
      ctx.logger.warn(`stratagate-memory profile context failed: ${renderError(error)}`)
      throw error
    }
    const session = context.agent?.session
    if (!session) return { ...assembled, contexts }
    // Open/cache Memory through Auto Context first so cold directory navigation
    // reuses the active space. Keep the directory first in the injected prompt.
    let autoMemory: { name: string; text: string } | undefined
    try {
      const text = await runtime.buildAutoContext(session)
      autoMemory = { name: 'stratagate:auto-memory', text }
    } catch (error) {
      ctx.logger.warn(`stratagate-memory auto-context failed: ${renderError(error)}`)
      runtime.notePluginError(session, error)
    }
    try {
      const directory = await runtime.buildMemoryDirectory(session)
      if (directory) contexts.push({ name: 'stratagate:memory-directory', text: directory })
    } catch (error) {
      ctx.logger.warn(`stratagate-memory directory failed: ${renderError(error)}`)
      runtime.notePluginError(session, error)
    }
    if (autoMemory) contexts.push(autoMemory)
```

</details>

**依据 3 · 作者声明**：[README.zh-CN.md:405-436](https://github.com/diqierjia/StrataGate-AgentMemory/blob/0c47fb18ba04c2222f4da851dcf40ce5553cd05a/README.zh-CN.md#L405-L436)

作者报告实验边界与错误分布

<details>
<summary>查看原文（32行）</summary>

```text
## 评测结果与边界

仓库公开的 R8 对比评测使用 LoCoMo 中的 `conv-26` 对话样本，包含 **419 条消息、35 个会话和 152 道问题**，覆盖 category 1–4。

**以下成绩对应公开的 R8 实验配置，不是 0.3.0 主题目录或 0.3.2 新版事件提取的专项评测。** 不能据此推断这些更新的准确率、成本变化或独立收益。

两个系统分别生成答案，再对每道题的答案进行 **10 次独立 Judge 评审**。这里的十次指评审重复次数，不代表十次完整系统运行。

| 指标 | StrataGate | Mem0 base | 差值 |
| --- | ---: | ---: | ---: |
| 10 次评审平均准确率 | **80.46%** | 63.22% | **+17.24 个百分点** |
| 多数票正确 | **121 / 152（79.61%）** | 96 / 152（63.16%） | **+25 题** |
| 时间类问题（Temporal） | **74.86%** | 34.59% | **+40.27 个百分点** |
| 单跳问题（Single-hop） | **89.29%** | 75.14% | **+14.14 个百分点** |
| 多跳问题（Multi-hop） | **66.56%** | 61.56% | +5.00 个百分点 |
| 开放域问题（Open-domain） | 83.08% | **84.62%** | -1.54 个百分点 |

两边使用相同的问题、顺序、答案模型、Judge 模型、评审提示词、解析器和评审次数，并分别重新构建记忆。记忆抽取、检索实现、embedding 使用方式和回答上下文存在差异，因此这里比较的是两套完整系统配置。

这组结果仅覆盖 `conv-26`，不代表完整 LoCoMo 成绩，也不能单独证明短期记忆衰减、知识图谱或证据门中某一项机制带来的收益。各组件的独立作用仍需通过消融实验检验。

完整协议、逐题结果及评审波动见 [评测文档](docs/EVALUATION.md)，汇总数据见 [机器可读评测结果](benchmarks/locomo-conv26-r8-final.json)。

上述 R8 评测中，仍有 **31 道题被多数评审判为错误**。按可观察到的失败阶段划分：

| 失败阶段 | 题数 | 反映的问题 |
| --- | ---: | --- |
| 未发起检索，直接回答错误 | 15 | Agent 有时未意识到需要查找历史证据 |
| 证据被判为充分，最终答案仍然错误 | 14 | 证据可能属于相邻事件，或不足以支持完整答案 |
| 达到检索预算时，证据仍不充分 | 2 | 在给定预算内没有找到足够的信息 |

这些结果说明，在该评测范围内，仍需改进何时发起检索，以及如何判断证据是否真正回答了问题。证据门能够约束引用和评估流程，但不能保证模型的语义判断或最终答案一定正确。
```

</details>

**依据 4 · 作者声明**：[README.zh-CN.md:440-452](https://github.com/diqierjia/StrataGate-AgentMemory/blob/0c47fb18ba04c2222f4da851dcf40ce5553cd05a/README.zh-CN.md#L440-L452)

空间、画像与费用

<details>
<summary>查看原文（13行）</summary>

```text
## 使用范围与成本

**记忆空间决定哪些对话共享记忆。** DSH 默认按项目工作目录隔离；也可按会话隔离，或使用全局共享空间。主题目录只展示当前空间内可见的事件，常驻画像则跨会话、跨记忆空间提供。配置方式见[插件指南](docs/DSH.zh-CN.md)。

**回答时的上下文预算，不等于全部模型开销。** 自动召回和主题目录各有预算，常驻画像、分层 Block、当前未封存对话及后续主动检索另行提供。900 tokens 和 400 tokens 分别是相关记忆与目录的预算，不能相加后当作整个请求的固定大小。

| 环节 | 是否调用模型 | 成本来自哪里 |
| --- | --- | --- |
| 后台摘要、事件提取、图谱、主题与画像整理 | 会 | 对话、事件或画像输入、生成结果，以及有限重试 |
| 读取已有目录、概览或搜索已有记录 | 读取本身不调用模型 | 结果带入后续模型上下文时仍占 tokens |
| Agent 判断证据并生成答案 | 会 | 当前上下文、取回的证据和答案生成 |

分层视图减少的是回答时默认带入的历史内容。后台处理工具密集型对话时，会精简代码和过长工具记录的模型输入；完整记录仍保留在 L5。总费用需要结合后台处理、检索和回答的实际用量评估，不能由上下文变短直接推断。
```

</details>

#### 缺口

- 未复现评测或验证跨空间内容
  **影响**：真实质量、总费用和隐私边界未知
  **进一步探讨**：隔离项目及模型记录请求，测实际泄漏与费用

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样判断是否值得保留？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先以独立数据库、测试 profile 和合成历史试用，分别计后台整理与主模型回答的 tokens，检查跨工作区、画像以及归档后的读取。成本包括后台生成、测试样本和人工检查。退出时禁用宿主入口并备份或清理测试库，再检查新提示词。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:88-111](https://github.com/diqierjia/StrataGate-AgentMemory/blob/0c47fb18ba04c2222f4da851dcf40ce5553cd05a/README.zh-CN.md#L88-L111)

作者给出 DSH 安装路径

<details>
<summary>查看原文（24行）</summary>

````text
## 快速开始：DeepSeek Harness

如果已经安装 DeepSeek Harness，请将 StrataGate 添加到你正在使用的 profile：

```bash
dsh plugin --profile web add stratagate-dsh
```

支持整个 DSH `0.2.0` 版本族：全部 Alpha、Beta、RC 和正式版（`>=0.2.0-0 <0.2.1-0`），同时保留此前支持的宿主版本。同属 `0.2.0` 的新版本无需因版本声明而等待插件更新。

重启该 profile，之后照常使用 DSH 即可。StrataGate 会自动记录主 Agent 已完成的对话，在后台生成可搜索的记忆，并在 **DSH 设置 → StrataGate-AgentMemory** 中提供记忆界面。

数据库默认保存在：

```text
DSH_HOME/stratagate/memory.db
```

移除插件不会删除数据库。截图、配置项、记忆工具和自动记录规则见 [DeepSeek Harness 插件中文说明](docs/DSH.zh-CN.md)。

上面的命令使用 `web` profile；如果使用其他 profile，请替换 `web`。开发者可直接查看[开发与文档](#code-entry-points)。

<a id="how-stratagate-works"></a>

````

</details>

**依据 2 · 作者声明**：[README.zh-CN.md:440-456](https://github.com/diqierjia/StrataGate-AgentMemory/blob/0c47fb18ba04c2222f4da851dcf40ce5553cd05a/README.zh-CN.md#L440-L456)

模型开销与后台重建

<details>
<summary>查看原文（17行）</summary>

```text
## 使用范围与成本

**记忆空间决定哪些对话共享记忆。** DSH 默认按项目工作目录隔离；也可按会话隔离，或使用全局共享空间。主题目录只展示当前空间内可见的事件，常驻画像则跨会话、跨记忆空间提供。配置方式见[插件指南](docs/DSH.zh-CN.md)。

**回答时的上下文预算，不等于全部模型开销。** 自动召回和主题目录各有预算，常驻画像、分层 Block、当前未封存对话及后续主动检索另行提供。900 tokens 和 400 tokens 分别是相关记忆与目录的预算，不能相加后当作整个请求的固定大小。

| 环节 | 是否调用模型 | 成本来自哪里 |
| --- | --- | --- |
| 后台摘要、事件提取、图谱、主题与画像整理 | 会 | 对话、事件或画像输入、生成结果，以及有限重试 |
| 读取已有目录、概览或搜索已有记录 | 读取本身不调用模型 | 结果带入后续模型上下文时仍占 tokens |
| Agent 判断证据并生成答案 | 会 | 当前上下文、取回的证据和答案生成 |

分层视图减少的是回答时默认带入的历史内容。后台处理工具密集型对话时，会精简代码和过长工具记录的模型输入；完整记录仍保留在 L5。总费用需要结合后台处理、检索和回答的实际用量评估，不能由上下文变短直接推断。

**升级后，历史目录逐步形成。** 已有事件在后台分批整理，目录可能暂时不完整；新增或变化的事件优先处理。失败或待整理的内容仍有事件入口，普通检索继续可用。历史整理有全库共享额度、有限重试和重启恢复，不承诺固定金额；额度与恢复细节见[主题整理说明](docs/MEMORY_TOPICS.zh-CN.md)。

目录与概览可根据有效来源重建。来源被修改、遗忘或归档后，过期派生内容先隐藏，再后台重建。新版事件提取规则用于后续正常提取，不统一重写旧事件。功能测试检查这些流程与约束，实际提取、归类和证据判断仍取决于模型。
```

</details>

**依据 3 · 源码核查**：[src/index.ts:194-197](https://github.com/diqierjia/StrataGate-AgentMemory/blob/0c47fb18ba04c2222f4da851dcf40ce5553cd05a/src/index.ts#L194-L197)

事件和数据库配置

```text
  const disposeAdminRoutes = registerAdminRoutes(ctx, runtime)
  ctx.on('session/event', (session, event) => runtime.acceptEvent(session, event))

  ctx.logger.info(`stratagate-memory ready (DSH ${compatibility.cliVersion}, ${resolved.namespaceMode} namespaces, ${resolved.database})`)
```

#### 缺口

- 未实测安装、停用或归档链
  **影响**：不能估算维护投入或删除完整性
  **进一步探讨**：先用小库记录写入、读回和停用

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样减少应检索而未检索的回答？

**研究主题**：新假设与验证

#### 完整回答

可在现有自动上下文之外试验针对明确历史指代的检索触发。用保留集分别测试历史追问及当前事实，比较漏检、误触发和总 tokens。若漏检无改善或误触发和成本明显恶化，则撤回。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:162-187](https://github.com/diqierjia/StrataGate-AgentMemory/blob/0c47fb18ba04c2222f4da851dcf40ce5553cd05a/src/index.ts#L162-L187)

现有自动上下文和工具入口

<details>
<summary>查看原文（26行）</summary>

```text
    const session = context.agent?.session
    if (!session) return { ...assembled, contexts }
    // Open/cache Memory through Auto Context first so cold directory navigation
    // reuses the active space. Keep the directory first in the injected prompt.
    let autoMemory: { name: string; text: string } | undefined
    try {
      const text = await runtime.buildAutoContext(session)
      autoMemory = { name: 'stratagate:auto-memory', text }
    } catch (error) {
      ctx.logger.warn(`stratagate-memory auto-context failed: ${renderError(error)}`)
      runtime.notePluginError(session, error)
    }
    try {
      const directory = await runtime.buildMemoryDirectory(session)
      if (directory) contexts.push({ name: 'stratagate:memory-directory', text: directory })
    } catch (error) {
      ctx.logger.warn(`stratagate-memory directory failed: ${renderError(error)}`)
      runtime.notePluginError(session, error)
    }
    if (autoMemory) contexts.push(autoMemory)
    const feedbackSuggestion = runtime.takeFeedbackSuggestion(session)
    if (feedbackSuggestion) contexts.push({ name: 'stratagate:feedback-suggestion', text: feedbackSuggestion })
    return { ...assembled, contexts }
  })
  installRetrievalFinalization(ctx, runtime)
  registerMemoryTools(ctx, runtime)
```

</details>

**依据 2 · 作者声明**：[README.zh-CN.md:428-436](https://github.com/diqierjia/StrataGate-AgentMemory/blob/0c47fb18ba04c2222f4da851dcf40ce5553cd05a/README.zh-CN.md#L428-L436)

作者记录未发起检索错误

```text
上述 R8 评测中，仍有 **31 道题被多数评审判为错误**。按可观察到的失败阶段划分：

| 失败阶段 | 题数 | 反映的问题 |
| --- | ---: | --- |
| 未发起检索，直接回答错误 | 15 | Agent 有时未意识到需要查找历史证据 |
| 证据被判为充分，最终答案仍然错误 | 14 | 证据可能属于相邻事件，或不足以支持完整答案 |
| 达到检索预算时，证据仍不充分 | 2 | 在给定预算内没有找到足够的信息 |

这些结果说明，在该评测范围内，仍需改进何时发起检索，以及如何判断证据是否真正回答了问题。证据门能够约束引用和评估流程，但不能保证模型的语义判断或最终答案一定正确。
```

#### 缺口

- 真实用户历史追问分布未知
  **影响**：规则可能提高误检
  **进一步探讨**：用固定合成案例及保留集做对照

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
