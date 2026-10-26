# @y9931666/dsh-plugin-crossfire

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[106ecc4](https://github.com/9931666/dsh-plugin-crossfire/tree/106ecc44c1d98c1cd6332cf8352308e722fc9f66)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/9931666/dsh-plugin-crossfire) [![npm 30d 737](https://img.shields.io/static/v1?label=npm+30d&message=737&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@y9931666/dsh-plugin-crossfire) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@y9931666/dsh-plugin-crossfire)
<!-- END META -->

> **实现功能**：按维度拉起红队评审成果，汇集候选缺陷，由用户逐条认定或驳回并保存复审历史。

> **核心亮点**：将多Agent反方意见变成用户逐条裁决和可复审旧账，persona执行/展示同源并保存轮次，不等自动证明成果正确。[Q01](#research-q01)、[Q02](#research-q02)

> **风险与缺陷**：0.2.1+ startActivation不带toolFilter、只读退为文字；缺Connection fence放行，body session比较非强授权；预算文本估算与转录/记账非事务。[Q03](#research-q03)、[Q04](#research-q04)

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
  - [Q01 · 多维红队与读者认定怎样改变缺陷复核交付？](#detail-section-11)
  - [Q02 · persona、子agent工具限制、report和定稿状态怎样接线？](#detail-section-12)
  - [Q03 · Web授权、并发和损坏转录是否影响可信性？](#detail-section-13)
  - [Q04 · 安装、模型预算、主持复核及中断恢复依赖什么？](#detail-section-14)
  - [Q05 · 幂等定稿和原子写有哪些价值及成本边界？](#detail-section-15)
  - [Q06 · 可复现缺陷收据和能力化写入授权能否改善采纳质量，怎样采用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：给已有定稿成果的用户组织反方复核，候选缺陷仍需人工复现与裁定。

单评审清单、人工红队和普通多Agent对话为替代；没有同成果同预算的合格缺陷效果排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 维度红队 | 从不同角度找反例 | 新宿主硬只读需preset，非默认保证 |
| report/collect | 发言到候选缺陷 | 归属核对，模型拆分仍需复核 |
| 人类表态/finish | 逐条认定驳回及定稿 | 自报状态非独立复现 |
| recheck/export | 核对旧缺陷并导出 | 历史按pass保存，成本非真实usage |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH及subagent/model路由 | 必需 | 专家启动与拆分 | 无法拉起或收集 |
| 已验只读preset | 新宿主硬边界必需 | 禁写/执行 | 仅persona文字约束 |
| Connection fence | Web信任边界必需 | 请求访问检查 | 缺席时放行 |
| 可写状态目录及人工复现 | 持久/交付必需 | 转录和裁决 | 部分状态需核对，不等证明 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定成果、维度、路由并验实际tools | 硬只读和围栏生效 |
| 评审 | 主持attack/collect，专家report | 发言与归属完整、坏行可见 |
| 裁决 | 用户复现后认定/驳回并定稿 | 每项依据可回读，settled非认证 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 模型路由/本地状态，金额未知 | 确认只读preset、围栏和成果范围 | 新宿主默认非硬白名单 |
| 持续 | 多专家输入/输出与拆分调用 | 逐条复现、认定/驳回 | budget非真实账单 |
| 失败恢复 | 转录/record备份及重试 | 核对归属、发言、记账和轮次 | 部分写与跨进程不一致 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 评审组织 | 维度专家、裁决与复审历史 | 合格缺陷发现率/误认定 |
| 只读边界 | 旧宿主传toolFilter | 新宿主须额外preset |
| 状态可靠性 | 进程锁、同pass幂等 | 跨进程/转录记账事务 |

> **思考**：0.2.1+ startActivation不带toolFilter、只读退为文字；缺Connection fence放行，body session比较非强授权；预算文本估算与转录/记账非事务。[Q03](#research-q03)、[Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将多Agent反方意见变成用户逐条裁决和可复审旧账，persona执行/展示同源并保存轮次，不等自动证明成果正确。[Q01](#research-q01)、[Q02](#research-q02)

将多Agent反方意见变成用户逐条裁决和可复审旧账，persona执行/展示同源并保存轮次，不等自动证明成果正确。[Q01](#research-q01)、[Q02](#research-q02)

真实persona同源落盘、锁内collect/finish和同轮upsert历史可借鉴；RPC已传坏行数，仍需分类读失败及跨进程/预算事务边界。[Q05](#research-q05)

<a id="detail-section-5"></a>

### 1.4 主要限制

0.2.1+ startActivation不带toolFilter、只读退为文字；缺Connection fence放行，body session比较非强授权；预算文本估算与转录/记账非事务。[Q03](#research-q03)、[Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

当前先观察；确认目标profile硬只读和Web访问边界后再对非关键成果试用，逐条复现缺陷并计实际模型与人工成本。[Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

评审组织、同源persona和幂等定稿由源码支持；新宿主只读退化、Web身份与多资产一致性限制采用；缺陷收据/能力授权是假设。

- 已检查：作者 README、包清单、源码路径 src/members.ts、src/state.ts、src/web-guard.ts、src/rpc.ts、src/tools.ts、src/budget.ts、README.md、src/redteam.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查专家启动、report、Web围栏、RPC状态与存储/预算；未运行目标代码、真实子Agent或Web验收，不复用旧版硬只读结论。
- 下一步：可进一步核对新宿主子Agent实际工具、无fence/伪身份、损坏转录和并发报告，再与单评审盲比真假缺陷与总成本。

**分析版本**

- **仓库**：[9931666/dsh-plugin-crossfire](https://github.com/9931666/dsh-plugin-crossfire)
- **版本号**：0.1.4（[固定提交 106ecc4](https://github.com/9931666/dsh-plugin-crossfire/tree/106ecc44c1d98c1cd6332cf8352308e722fc9f66)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是成果摘要+复现收据分层裁决、已验只读preset和连接身份能力授权，用真假缺陷/可写工具/故障矩阵检验误认定与总成本。[Q06](#research-q06)

可进一步核对新宿主子Agent实际工具、无fence/伪身份、损坏转录和并发报告，再与单评审盲比真假缺陷与总成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 293 | — | — | 3861 |
| .ts | source | 30 | 7918 | 4974 | 2428 | — |
| .tsx | source | 4 | 2548 | 2045 | 422 | — |
| .mjs | test | 20 | 3314 | 2590 | 403 | — |
| .js | test | 1 | 172 | 127 | 37 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/9931666/dsh-plugin-crossfire/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对对抗评审状态机、当前宿主只读边界与人工认定的证据含义。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 多维红队与读者认定怎样改变缺陷复核交付？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已有定稿成果、希望不同维度找反例的用户。相比普通多角色讨论，贡献是把候选缺陷逐条呈现、认定/驳回理由由用户负责，再保存定稿与旧缺陷复审，避免模型自说自结案。合格结果应是可复现缺陷与明确裁决依据，而不是更多专家文本或settled状态。作者称验收器，实际更准确是组织人工复核的工具；用户认定也不能代替独立复现或证明未发现缺陷的成果正确。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-21](https://github.com/9931666/dsh-plugin-crossfire/blob/106ecc44c1d98c1cd6332cf8352308e722fc9f66/README.md#L3-L21)

作者定位、人类表态与红队范围。

<details>
<summary>查看原文（19行）</summary>

```text
**把一个已经定稿的成果摆上台，让红队从指定维度分头攻击，由你逐条认定或驳回。**

Crossfire 是 DeepSeek Harness 的一个插件，只做一件事：**对抗式评审**。它不产出方案、不改代码、不自动修复 —— 它是验收器，不是执行器。

## 它和别的多智能体插件有什么不同

| | 协作型团队（如 AgentTeams） | 圆桌会议 | **针锋 Crossfire** |
| --- | --- | --- | --- |
| 目标 | 把活干完 | 开一场多角色会议 | **判定一份成果站不站得住** |
| 机器做什么 | 分工、执行、自动修复 | 统筹、转述、聚合 | **只挑错** |
| 谁下结论 | 流程门禁 | 主持人汇总 | **你，逐条** |
| 界面 | 成员树 / 任务 DAG | 拓扑图 + 面板 | **一张卡，四个状态** |

四条边界（越界即破坏了它存在的意义）：

1. **表态永远由人做。** 缺陷的认定 / 驳回只能在卡片上由你操作；插件**没有**、也**不该有**"代表认定缺陷"的工具。
2. **不产出方案、不改代码、不自动修复。**
3. **红队专家只读。** 它们的工具是白名单：`read` / `read_image` / `glob` / `grep` + 一个 `crossfire_report`。能取证，不能动手。
4. **你的历史表态只用于去重与复审递进**，绝不会作为"用户画像"喂给红队 —— 否则模型会预判你的偏好而干脆不提某类问题，与"反方攻击"的初衷正好相反。
```

</details>

**依据 2 · 作者声明**：[README.md:38-58](https://github.com/9931666/dsh-plugin-crossfire/blob/106ecc44c1d98c1cd6332cf8352308e722fc9f66/README.md#L38-L58)

状态机及各工具任务。

<details>
<summary>查看原文（21行）</summary>

````text
在对话里说一句「用针锋评审一下这个方案」，或者在卡片上点按钮 —— 两条路驱动的是**同一套状态机**。

```
draft ──送红队上场──▶ attacking ──收集观点──▶ judging ──定稿──▶ settled
                                                ▲                │
                                                └──── 开复审 ─────┘
                                                   （只核对旧账）
```

### 工具面（`crossfire_*`）

| 工具 | 作用 |
| --- | --- |
| `crossfire_open` | 把待验证对象摆上台（标题 + 正文 + 维度 + 强度）。状态 `draft` |
| `crossfire_stance` | 写入用户的立场与理由；没有就**从对话提炼**（`distilled=true`），但绝不虚构 |
| `crossfire_attack` | 按维度拉起只读红队专家。状态 `attacking` |
| `crossfire_collect` | 把专家发言拆成逐条可裁决的缺陷。状态 `judging` |
| `crossfire_finish` | 定稿，固化 known-flaws 清单并写入历史。状态 `settled` |
| `crossfire_recheck` | 复审：只核对上一轮已认定的缺陷是否修复 |
| `crossfire_export` | 导出 Markdown 交付物 |
| `crossfire_report` | **专家侧**：红队提交发言的唯一通道 |
````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · persona、子agent工具限制、report和定稿状态怎样接线？

**研究主题**：功能与机制

#### 完整回答

按维度与路由规划专家，persona只生成一次，成功拉起后把同份文本和实际路由落盘，便于回看真实下发材料。report用执行agent.id查归属而不接受自报expert身份，追加utterance再更新budget/reportCount。collect在同一review锁内重读记录和转录，传入malformed并按utterance/defect ID去重；finish同pass upsert快照，重复定稿不增加同轮历史。新旧宿主启动分支不同，不能只看redteam.ts白名单定义就认定新宿主执行了工具限制。

#### 证据与依据

**依据 1 · 源码核查**：[src/members.ts:197-217](https://github.com/9931666/dsh-plugin-crossfire/blob/106ecc44c1d98c1cd6332cf8352308e722fc9f66/src/members.ts#L197-L217)

实际路由和persona同源保存。

<details>
<summary>查看原文（21行）</summary>

```text
  // 路由（provider / model）由 `resolveExpertRoute` **一次决定**，记录与下发共用
  // 它的结果 —— 不允许出现"记录写 A、实际跑 B"（见该函数的注释）。
  const route = resolveExpertRoute(expert, config)
  const agentOptions: { provider?: string; model?: string; maxTokens?: number } = { ...route.agentOptions }
  if (limits.maxTokens !== undefined && limits.maxTokens > 0) {
    agentOptions.maxTokens = limits.maxTokens
  }

  // 把这位专家**实际使用的路由**写回记录：逐字段等于 `route` 的决定，取不到生效值
  // 就删掉该字段（"缺失 = 继承"必须看得见，而不是留一个空串或上一轮的残值）。
  if (route.provider === undefined) delete expert.provider
  else expert.provider = route.provider
  if (route.model === undefined) delete expert.model
  else expert.model = route.model

  // persona **只生成一次**：同一个常量既用于下发、也用于落盘。
  //
  // 这不是省一次函数调用，而是这个字段的正确性来源：如果下发与落盘各调一次
  // `expertPersona()`，任何一次参数漂移（或函数内部带了时间戳之类的非纯行为）都会让
  // "查看原提示词"显示的东西与专家真正收到的东西不是同一份 —— 而那正是我们要修的缺陷。
  const persona = expertPersona(input)
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:739-780](https://github.com/9931666/dsh-plugin-crossfire/blob/106ecc44c1d98c1cd6332cf8352308e722fc9f66/src/tools.ts#L739-L780)

专家归属、发言和预算更新主链。

<details>
<summary>查看原文（42行）</summary>

```text
    async execute(args, exec) {
      const caller = requireAgent(exec)
      // 宽限查询：归属索引是在 spawn 返回之后登记的，而子代理可能在那之前就已经
      // 跑完一轮（见 expert-events.ts 里对这段竞态的说明）。
      const located = await locateExpertChildWithGrace(caller.id)
      if (located === undefined) {
        throw new Error(
          'crossfire_report is only for red-team experts of a running review '
          + '(if you were just spawned, retry once — your review binding may still be settling)',
        )
      }
      const content = text(args.content)
      if (content === '') throw new Error('content must not be empty')

      const record = await readRecord(located.stateRoot, located.reviewId)
      if (record === undefined) throw new Error(`no review "${located.reviewId}"`)
      assertBudget(record)

      const expert = record.experts.find((candidate) => candidate.childId === caller.id)
      const expertKey = expert?.key ?? 'unknown'
      const utterance: ExpertUtterance = {
        id: randomUUID(),
        expertKey,
        kind: 'speech',
        content: content.slice(0, 20_000),
        pass: record.reviewPass,
        ts: Date.now(),
      }
      await appendTranscript(located.stateRoot, located.reviewId, utterance)
      const charged = estimateTokens(utterance.content)
      const remaining = await mutateRecord(located.stateRoot, located.reviewId, (current) => {
        chargeTokens(current, utterance.content)
        if (expert !== undefined) {
          const target = current.experts.find((candidate) => candidate.childId === caller.id)
          if (target !== undefined) {
            target.status = 'done'
            // 实时记下"提交过几次"。`defectCount` 要等 collect 拆分后才有值，
            // 在此之前卡片必须能显示这位专家确实交了东西。
            target.reportCount = (target.reportCount ?? 0) + 1
          }
        }
        return Math.max(0, current.budget.maxTokens - current.budget.usedTokens)
```

</details>

**依据 3 · 源码核查**：[src/rpc.ts:793-831](https://github.com/9931666/dsh-plugin-crossfire/blob/106ecc44c1d98c1cd6332cf8352308e722fc9f66/src/rpc.ts#L793-L831)

collect锁内重读与坏行传递。

<details>
<summary>查看原文（39行）</summary>

```text
  if (step === 'collect') {
    const llm = ctx.get('llm') as SplitLlmLike | undefined
    // 状态门禁 + 读转录 + 拆分 + 合并写回**全部在同一个临界区里**（A2 + A6）。
    //
    // 此前是"锁外读快照 → 锁外拆分 → 锁内纯拼接"：两次点击（或两个并发请求）都基于
    // 同一份旧快照拆分，第二批的 `added` 又被拼进 defects —— 裁决面上于是出现一条条
    // 一模一样的重复缺陷，用户得对同一条缺陷点两次驳回、理由写两遍。现在整段串行化：
    // 第二次进来时锁内读到的已经是第一批的结果，`collectDefects` 的 `utteranceId`
    // 幂等键直接命中，`applyCollected` 的 `id` 幂等键是第二道闸。
    //
    // 代价（刻意的）：拆分走 LLM 是十秒级的，持锁期间同一场评审的其它写操作会排队。
    // 同一场评审的写本就该串行 —— 用"排队"换"列表里不再出现重复项"。
    return await withCrossfireLock(reviewLockKey(stateRoot, reviewId), async () => {
      const current = await readRecord(stateRoot, reviewId)
      if (current === undefined) return fail(`no review "${reviewId}"`)
      if (current.status !== 'attacking' && current.status !== 'judging') {
        return fail(`review "${reviewId}" is "${current.status}" — cannot collect now`)
      }
      const transcript = await readTranscriptReport(stateRoot, reviewId)
      // 拆分阶段的有界并发上限住在 `reviewSplit` 里（engine 单点读取），
      // 因此这里不必单独传参 —— 工具侧读同一份配置，两边行为一致。
      const outcome = await collectDefects({
        record: current,
        transcript: transcript.items,
        malformed: transcript.malformed,
        llm,
        splitConfig: runtime.tools.reviewSplit,
      })
      // `collected` 报的是**真正追加的条数**，不是 `added.length`：并发的第二次调用
      // 一条都不该新增，报 added.length 会让用户看到"新增 3 条"而列表里一条没变。
      const appended = applyCollected(current, outcome.added)
      current.status = 'judging'
      await writeRecord(stateRoot, current)
      return ok({
        collected: appended,
        droppedDuplicates: outcome.droppedDuplicates,
        skippedNoise: outcome.skippedNoise,
        splitAttempts: outcome.splitAttempts,
        recheckRound: current.reviewPass > 1 && current.history.length > 0,
```

</details>

**依据 4 · 源码核查**：[src/rpc.ts:843-867](https://github.com/9931666/dsh-plugin-crossfire/blob/106ecc44c1d98c1cd6332cf8352308e722fc9f66/src/rpc.ts#L843-L867)

finish同pass幂等历史。

<details>
<summary>查看原文（25行）</summary>

```text
    return await withCrossfireLock(reviewLockKey(stateRoot, reviewId), async () => {
      const current = await readRecord(stateRoot, reviewId)
      if (current === undefined) return fail(`no review "${reviewId}"`)
      if (current.status !== 'judging' && current.status !== 'attacking' && current.status !== 'settled') {
        return fail(`review "${reviewId}" is "${current.status}" — cannot settle now`)
      }
      const snapshot: PassSnapshot = {
        pass: current.reviewPass,
        subject: current.subject.content,
        stanceText: current.stance.text,
        dimensions: [...current.dimensions],
        intensity: current.intensity,
        defects: current.defects.map((defect) => ({ ...defect })),
        finishedAt: Date.now(),
        ...(summary === '' ? {} : { revisedSummary: summary }),
      }
      // **同一 pass 在 history 里只能有一条**：已存在就原地更新它。重复定稿应当是一次
      // 幂等的更新（用户改完表态又点一次定稿是合法操作），而不是又叠一份快照 ——
      // 叠出来的历史会让复审把同一批旧账核对两遍，且先写的那份永远是最旧的。
      const existing = current.history.findIndex((item) => item.pass === current.reviewPass)
      if (existing >= 0) current.history[existing] = snapshot
      else current.history = [...current.history, snapshot]
      current.status = 'settled'
      current.settledAt = Date.now()
      await writeRecord(stateRoot, current)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Web授权、并发和损坏转录是否影响可信性？

**研究主题**：缺陷与关键质疑

#### 完整回答

新宿主startActivation分支只把persona加入prompt，没有toolFilter；旧startContinuable才传expertToolRestriction，因此0.2.1+只读边界退为文字约束，除非目标profile另有只读preset，README统一硬白名单主张不能直接成立。Web无Connection fence时rejectWebRequest允许继续，虽然fence抛错拒绝；RPC session/stateRoot来自body，judgeActor只比较已记录owner字符串，缺owner的旧数据放行，不能当强身份授权。状态锁仅进程内；JSON读取把权限/损坏/缺失都混同undefined，JSONL读失败回空且malformed0，可能把不可读误当无发言。

#### 证据与依据

**依据 1 · 源码核查**：[src/members.ts:227-268](https://github.com/9931666/dsh-plugin-crossfire/blob/106ecc44c1d98c1cd6332cf8352308e722fc9f66/src/members.ts#L227-L268)

新旧宿主的硬工具限制真实分叉。

<details>
<summary>查看原文（42行）</summary>

```text
  // 0.2.1 收敛了子代理契约：`startContinuable` 与 per-child `persona`/`toolFilter`
  // 一起被移除（persona 归 system-prompt / agent preset，工具面由 preset 拥有）。
  // 按运行时形状二选一，不把探测变成加载门禁：两个入口都缺才报错。
  //
  // **只读边界的退化**：旧宿主用 `toolFilter`（白名单）硬保证专家不能写、不能执行、
  // 不能联网；新宿主没有这个通道，边界退化为 persona 里的文字约束（见 redteam.ts
  // 的「工具边界」段）。要恢复硬边界，需要宿主提供只读 preset 并通过 `agentPreset`
  // 选择 —— 本文件已支持（见下方 agentPreset 透传），但 preset 必须在 profile 里
  // 静态声明，不能由插件运行时注册。
  const subagents = ctx.subagents as unknown as {
    startActivation?: (spec: {
      provider: string
      label: string
      request: Record<string, unknown>
      signal: AbortSignal
      delivery: 'parent' | 'caller'
    }) => Promise<{ childId: unknown }>
    startContinuable?: (spec: {
      provider: string
      label: string
      request: Record<string, unknown>
      signal: AbortSignal
    }) => Promise<{ childId: unknown }>
  }

  const label = `${EXPERT_LABEL_PREFIX}${record.reviewId}:${expert.key}`
  let childId: unknown
  if (typeof subagents.startActivation === 'function') {
    request.prompt = [...prompt, { type: 'text', text: persona }]
    const started = await subagents.startActivation({
      provider: config.provider,
      label,
      request,
      signal,
      delivery: 'parent',
    })
    childId = started.childId
  } else if (typeof subagents.startContinuable === 'function') {
    const started = await subagents.startContinuable({
      provider: config.provider,
      label,
      request: { ...request, persona, toolFilter: expertToolRestriction() },
```

</details>

**依据 2 · 源码核查**：[src/web-guard.ts:67-85](https://github.com/9931666/dsh-plugin-crossfire/blob/106ecc44c1d98c1cd6332cf8352308e722fc9f66/src/web-guard.ts#L67-L85)

缺fence放行而抛错拒绝。

<details>
<summary>查看原文（19行）</summary>

```text
/**
 * Decide whether one inbound request may proceed.
 *
 * @returns the HTTP status to reject with, or `undefined` to proceed.
 *
 * A composition without the Connection service has no fence to apply and is let
 * through — the plugin must stay usable in minimal profiles. A fence that
 * *throws* is treated as a rejection: this is a security boundary, and failing
 * open would silently undo it.
 */
export function rejectWebRequest(
  fence: ConnectionFence | undefined,
  headers: IncomingMessage['headers'],
): 401 | 403 | undefined {
  if (fence === undefined) return undefined
  try {
    return fence.requestRejection({ headers })
  } catch {
    return 403
```

</details>

**依据 3 · 源码核查**：[src/rpc.ts:242-259](https://github.com/9931666/dsh-plugin-crossfire/blob/106ecc44c1d98c1cd6332cf8352308e722fc9f66/src/rpc.ts#L242-L259)

owner比较与旧数据例外。

<details>
<summary>查看原文（18行）</summary>

```text
export function judgeActor(ownerSessionId: string | undefined, actorSession: string): ActorVerdict {
  if (actorSession === '') {
    return {
      ok: false,
      code: 'no-actor',
      message: 'this request carried no session identity — reload the page so the card can send one',
    }
  }
  // 没有 owner 的是早期数据：放行但标记为未绑定，调用方可以据此提示。
  if (ownerSessionId === undefined || ownerSessionId === '') return { ok: true, bound: false }
  if (ownerSessionId !== actorSession) {
    return {
      ok: false,
      code: 'foreign-owner',
      message: 'this review belongs to another session',
    }
  }
  return { ok: true, bound: true }
```

</details>

**依据 4 · 源码核查**：[src/rpc.ts:367-372](https://github.com/9931666/dsh-plugin-crossfire/blob/106ecc44c1d98c1cd6332cf8352308e722fc9f66/src/rpc.ts#L367-L372)

actor/root取自请求body。

```text
  return async (endpoint: string, payload: unknown): Promise<RpcResult> => {
    try {
      const body = (payload !== null && typeof payload === 'object' ? payload : {}) as Record<string, unknown>
      const session = typeof body.session === 'string' ? body.session : ''
      const reviewId = typeof body.reviewId === 'string' ? body.reviewId : ''
      const preferredRoot = typeof body.stateRoot === 'string' ? body.stateRoot : undefined
```

**依据 5 · 源码核查**：[src/state.ts:145-182](https://github.com/9931666/dsh-plugin-crossfire/blob/106ecc44c1d98c1cd6332cf8352308e722fc9f66/src/state.ts#L145-L182)

读取错误状态混同。

<details>
<summary>查看原文（38行）</summary>

```text
 * 读一个 JSON 文件；**不存在或损坏都返回 undefined**（铁律 1）。
 *
 * 调用方拿到 undefined 时应当降级，而不是把异常抛给用户界面。
 */
export async function readJsonFile<T>(file: string): Promise<T | undefined> {
  try {
    const text = await readFile(file, 'utf8')
    return JSON.parse(text) as T
  } catch {
    return undefined
  }
}

/** 追加一条 JSONL 记录（自动建目录）。 */
export async function appendJsonLine(file: string, value: unknown): Promise<void> {
  await mkdir(dirname(file), { recursive: true })
  await appendFile(file, `${JSON.stringify(value)}\n`, 'utf8')
}

/** 读取 JSONL 的结果：合法条目 + **被丢弃的坏行数**（铁律 3）。 */
export interface JsonLinesReport<T> {
  items: T[]
  /** 无法解析的行数。非 0 时调用方必须如实告知用户，不许静默吞掉。 */
  malformed: number
}

/**
 * 读 JSONL；坏行被跳过但**计数**。
 *
 * 容忍被截断的尾行（进程在写一半时崩溃留下的半行 JSON），但它同样计入
 * `malformed` —— 因为那条记录确实丢了。
 */
export async function readJsonLines<T>(file: string): Promise<JsonLinesReport<T>> {
  let text: string
  try {
    text = await readFile(file, 'utf8')
  } catch {
    return { items: [], malformed: 0 }
```

</details>

#### 缺口

- 新宿主目标preset工具面、Web暴露组合及跨进程一致性未验收
  **影响**：不能承诺只读/强授权或所有发言完整
  **进一步探讨**：在隔离profile回读子agent实际tools，测试无fence、假session、不可读转录和双进程写

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、模型预算、主持复核及中断恢复依赖什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要兼容DSH、subagent provider、可用模型路由、状态目录与卡片界面；想保留硬只读需特别核对宿主preset而不依赖persona。流程是固定成果/维度/预算、拉专家、collect后用户逐条查证、定稿与必要复审。budget计的是已输出文本粗估，不是真实模型usage；未计完整输入、隐藏推理、工具调用及拆分模型费用，不能当现金硬上限。report的assertBudget在append前、计费更新在append后，多个并发报告可同时过检查，另有转录成功而预算写失败窗口。中断需先回读专家归属、发言及record，避免重复拉起或误定稿。

#### 证据与依据

**依据 1 · 源码核查**：[src/budget.ts:31-48](https://github.com/9931666/dsh-plugin-crossfire/blob/106ecc44c1d98c1cd6332cf8352308e722fc9f66/src/budget.ts#L31-L48)

预算明确为文本长度估算。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * 估算文本的 token 成本（粗估：CJK 0.6/字，其它非空白 0.3/字符，向上取整）。
 *
 * 口径与圆桌 `budget.ts` 的 `estimateTokens` **完全一致**（逐字符 `for...of`
 * 按码点遍历，`code >= 0x2e80` 记 CJK，空白不计入 other，最后 `Math.ceil`）。
 * 这是刻意照搬而不是重新设计：两个插件对同一段中文给出的预算数字必须可比。
 *
 * 再次强调：这是一个**已说出的文本长度估算**，不是模型真实用量。
 */
export function estimateTokens(text: string): number {
  let cjk = 0
  let other = 0
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0
    if (code >= 0x2e80) cjk += 1
    else if (char.trim() !== '') other += 1
  }
  return Math.ceil(cjk * 0.6 + other * 0.3)
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:753-780](https://github.com/9931666/dsh-plugin-crossfire/blob/106ecc44c1d98c1cd6332cf8352308e722fc9f66/src/tools.ts#L753-L780)

预算检查、转录append和记账非同一事务。

<details>
<summary>查看原文（28行）</summary>

```text
      const record = await readRecord(located.stateRoot, located.reviewId)
      if (record === undefined) throw new Error(`no review "${located.reviewId}"`)
      assertBudget(record)

      const expert = record.experts.find((candidate) => candidate.childId === caller.id)
      const expertKey = expert?.key ?? 'unknown'
      const utterance: ExpertUtterance = {
        id: randomUUID(),
        expertKey,
        kind: 'speech',
        content: content.slice(0, 20_000),
        pass: record.reviewPass,
        ts: Date.now(),
      }
      await appendTranscript(located.stateRoot, located.reviewId, utterance)
      const charged = estimateTokens(utterance.content)
      const remaining = await mutateRecord(located.stateRoot, located.reviewId, (current) => {
        chargeTokens(current, utterance.content)
        if (expert !== undefined) {
          const target = current.experts.find((candidate) => candidate.childId === caller.id)
          if (target !== undefined) {
            target.status = 'done'
            // 实时记下"提交过几次"。`defectCount` 要等 collect 拆分后才有值，
            // 在此之前卡片必须能显示这位专家确实交了东西。
            target.reportCount = (target.reportCount ?? 0) + 1
          }
        }
        return Math.max(0, current.budget.maxTokens - current.budget.usedTokens)
```

</details>

**依据 3 · 作者声明**：[README.md:23-34](https://github.com/9931666/dsh-plugin-crossfire/blob/106ecc44c1d98c1cd6332cf8352308e722fc9f66/README.md#L23-L34)

作者安装和宿主条件。

<details>
<summary>查看原文（12行）</summary>

````text
## 安装

```sh
dsh plugin --profile web add @y9931666/dsh-plugin-crossfire
```

> 包名是 `@y9931666/...`（作者的 npm 账户名）；`@huanlin` 是**另一个用户**的 scope，
> 历史文档里那个包名已被占用、不可用。

安装后**重启 Harness 进程**并刷新浏览器（host 侧改动不热重载）。

环境要求：DeepSeek Harness `0.2.0-rc.2+`、Node `>= 22`（开发时为 `24.x`）。
````

</details>

#### 缺口

- 端到端实际账单、复核时间与中断恢复成功率未知
  **影响**：无法判断预算和多专家成本是否抵消增益
  **进一步探讨**：对同一成果记录全部模型usage、人工复现时间和失败恢复，比较单评审基线

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 幂等定稿和原子写有哪些价值及成本边界？

**研究主题**：工程质量与复用

#### 完整回答

同一review串行锁使collect与finish基于最新记录，真实persona保存减少展示与执行漂移，同pass更新历史避免重复旧账，值得复用。代价是LLM拆分持锁期间同review写排队；锁Map没有清理键，长期大量review需观测增长。原子write用宿主writer或随机临时文件rename，防半写但不保证跨进程不丢更新；读错误吞掉虽避免卡片消失，也损失故障分类。当前RPC已把malformed传入collect，不应把此前未传递的历史问题继续记作新版本缺陷。

#### 证据与依据

**依据 1 · 源码核查**：[src/state.ts:37-50](https://github.com/9931666/dsh-plugin-crossfire/blob/106ecc44c1d98c1cd6332cf8352308e722fc9f66/src/state.ts#L37-L50)

锁的进程作用域和Map保留。

<details>
<summary>查看原文（14行）</summary>

```text
/** Process-local mutex chain keyed by an arbitrary lock key. */
const locks = new Map<string, Promise<unknown>>()

/**
 * Serialize async operations sharing one key inside this process.
 *
 * 注意（已知限制，写在任务书里）：这是**进程内**锁，跨进程不互斥。多窗口同时
 * 操作同一场评审时，后写者覆盖前者，只靠原子写保证文件不会写坏。v0.1.0 接受。
 */
export async function withCrossfireLock<T>(key: string, operation: () => Promise<T>): Promise<T> {
  const previous = locks.get(key) ?? Promise.resolve()
  const current = previous.then(operation, operation)
  locks.set(key, current.then(() => undefined, () => undefined))
  return current
```

</details>

**依据 2 · 源码核查**：[src/state.ts:108-118](https://github.com/9931666/dsh-plugin-crossfire/blob/106ecc44c1d98c1cd6332cf8352308e722fc9f66/src/state.ts#L108-L118)

原子单文件写。

<details>
<summary>查看原文（11行）</summary>

```text
/** Atomically publish a UTF-8 text file. */
export async function writeTextAtomic(file: string, text: string): Promise<void> {
  const hostWrite = await resolveHostWriter()
  if (hostWrite !== undefined) {
    await hostWrite(file, text)
    return
  }
  await mkdir(dirname(file), { recursive: true })
  const tmp = join(dirname(file), `.${randomUUID()}.tmp`)
  await writeFile(tmp, text, 'utf8')
  await rename(tmp, file)
```

</details>

**依据 3 · 源码核查**：[src/rpc.ts:795-817](https://github.com/9931666/dsh-plugin-crossfire/blob/106ecc44c1d98c1cd6332cf8352308e722fc9f66/src/rpc.ts#L795-L817)

串行拆分成本与现有malformed传递。

<details>
<summary>查看原文（23行）</summary>

```text
    // 状态门禁 + 读转录 + 拆分 + 合并写回**全部在同一个临界区里**（A2 + A6）。
    //
    // 此前是"锁外读快照 → 锁外拆分 → 锁内纯拼接"：两次点击（或两个并发请求）都基于
    // 同一份旧快照拆分，第二批的 `added` 又被拼进 defects —— 裁决面上于是出现一条条
    // 一模一样的重复缺陷，用户得对同一条缺陷点两次驳回、理由写两遍。现在整段串行化：
    // 第二次进来时锁内读到的已经是第一批的结果，`collectDefects` 的 `utteranceId`
    // 幂等键直接命中，`applyCollected` 的 `id` 幂等键是第二道闸。
    //
    // 代价（刻意的）：拆分走 LLM 是十秒级的，持锁期间同一场评审的其它写操作会排队。
    // 同一场评审的写本就该串行 —— 用"排队"换"列表里不再出现重复项"。
    return await withCrossfireLock(reviewLockKey(stateRoot, reviewId), async () => {
      const current = await readRecord(stateRoot, reviewId)
      if (current === undefined) return fail(`no review "${reviewId}"`)
      if (current.status !== 'attacking' && current.status !== 'judging') {
        return fail(`review "${reviewId}" is "${current.status}" — cannot collect now`)
      }
      const transcript = await readTranscriptReport(stateRoot, reviewId)
      // 拆分阶段的有界并发上限住在 `reviewSplit` 里（engine 单点读取），
      // 因此这里不必单独传参 —— 工具侧读同一份配置，两边行为一致。
      const outcome = await collectDefects({
        record: current,
        transcript: transcript.items,
        malformed: transcript.malformed,
```

</details>

**依据 4 · 源码核查**：[src/rpc.ts:859-867](https://github.com/9931666/dsh-plugin-crossfire/blob/106ecc44c1d98c1cd6332cf8352308e722fc9f66/src/rpc.ts#L859-L867)

同轮历史幂等。

```text
      // **同一 pass 在 history 里只能有一条**：已存在就原地更新它。重复定稿应当是一次
      // 幂等的更新（用户改完表态又点一次定稿是合法操作），而不是又叠一份快照 ——
      // 叠出来的历史会让复审把同一批旧账核对两遍，且先写的那份永远是最旧的。
      const existing = current.history.findIndex((item) => item.pass === current.reviewPass)
      if (existing >= 0) current.history[existing] = snapshot
      else current.history = [...current.history, snapshot]
      current.status = 'settled'
      current.settledAt = Date.now()
      await writeRecord(stateRoot, current)
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 可复现缺陷收据和能力化写入授权能否改善采纳质量，怎样采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证方向是把缺陷绑定成果摘要、证据位置和最小复现收据，把用户认定与复现确认分层；对新宿主启动强制选择已验只读preset，并由服务端连接身份签发裁决能力，而非body session自报。由软只读和人类状态不等证实推导，可降低“专家说了/用户点了即真实”的误解；代价是配置与复现人工。用已知真假缺陷集、可写工具探针及伪身份/中断矩阵，比较误认定率、真实工具范围和总成本，若负担增大而不改进质量则否定。当前先观察，确认目标宿主硬只读与Web围栏后才限定试用，不把settled当质量认证。

#### 证据与依据

**依据 1 · 源码核查**：[src/members.ts:227-268](https://github.com/9931666/dsh-plugin-crossfire/blob/106ecc44c1d98c1cd6332cf8352308e722fc9f66/src/members.ts#L227-L268)

硬只读preset需要针对当前启动分支验证。

<details>
<summary>查看原文（42行）</summary>

```text
  // 0.2.1 收敛了子代理契约：`startContinuable` 与 per-child `persona`/`toolFilter`
  // 一起被移除（persona 归 system-prompt / agent preset，工具面由 preset 拥有）。
  // 按运行时形状二选一，不把探测变成加载门禁：两个入口都缺才报错。
  //
  // **只读边界的退化**：旧宿主用 `toolFilter`（白名单）硬保证专家不能写、不能执行、
  // 不能联网；新宿主没有这个通道，边界退化为 persona 里的文字约束（见 redteam.ts
  // 的「工具边界」段）。要恢复硬边界，需要宿主提供只读 preset 并通过 `agentPreset`
  // 选择 —— 本文件已支持（见下方 agentPreset 透传），但 preset 必须在 profile 里
  // 静态声明，不能由插件运行时注册。
  const subagents = ctx.subagents as unknown as {
    startActivation?: (spec: {
      provider: string
      label: string
      request: Record<string, unknown>
      signal: AbortSignal
      delivery: 'parent' | 'caller'
    }) => Promise<{ childId: unknown }>
    startContinuable?: (spec: {
      provider: string
      label: string
      request: Record<string, unknown>
      signal: AbortSignal
    }) => Promise<{ childId: unknown }>
  }

  const label = `${EXPERT_LABEL_PREFIX}${record.reviewId}:${expert.key}`
  let childId: unknown
  if (typeof subagents.startActivation === 'function') {
    request.prompt = [...prompt, { type: 'text', text: persona }]
    const started = await subagents.startActivation({
      provider: config.provider,
      label,
      request,
      signal,
      delivery: 'parent',
    })
    childId = started.childId
  } else if (typeof subagents.startContinuable === 'function') {
    const started = await subagents.startContinuable({
      provider: config.provider,
      label,
      request: { ...request, persona, toolFilter: expertToolRestriction() },
```

</details>

**依据 2 · 源码核查**：[src/rpc.ts:242-259](https://github.com/9931666/dsh-plugin-crossfire/blob/106ecc44c1d98c1cd6332cf8352308e722fc9f66/src/rpc.ts#L242-L259)

body身份比较可改能力授权。

<details>
<summary>查看原文（18行）</summary>

```text
export function judgeActor(ownerSessionId: string | undefined, actorSession: string): ActorVerdict {
  if (actorSession === '') {
    return {
      ok: false,
      code: 'no-actor',
      message: 'this request carried no session identity — reload the page so the card can send one',
    }
  }
  // 没有 owner 的是早期数据：放行但标记为未绑定，调用方可以据此提示。
  if (ownerSessionId === undefined || ownerSessionId === '') return { ok: true, bound: false }
  if (ownerSessionId !== actorSession) {
    return {
      ok: false,
      code: 'foreign-owner',
      message: 'this review belongs to another session',
    }
  }
  return { ok: true, bound: true }
```

</details>

**依据 3 · 作者声明**：[README.md:18-21](https://github.com/9931666/dsh-plugin-crossfire/blob/106ecc44c1d98c1cd6332cf8352308e722fc9f66/README.md#L18-L21)

用户表态分工为收据分层依据。

```text
1. **表态永远由人做。** 缺陷的认定 / 驳回只能在卡片上由你操作；插件**没有**、也**不该有**"代表认定缺陷"的工具。
2. **不产出方案、不改代码、不自动修复。**
3. **红队专家只读。** 它们的工具是白名单：`read` / `read_image` / `glob` / `grep` + 一个 `crossfire_report`。能取证，不能动手。
4. **你的历史表态只用于去重与复审递进**，绝不会作为"用户画像"喂给红队 —— 否则模型会预判你的偏好而干脆不提某类问题，与"反方攻击"的初衷正好相反。
```

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
