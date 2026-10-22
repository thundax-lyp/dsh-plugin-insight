# dsh-ledger-memory

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[7aa05c4](https://github.com/18477514055/dsh-ledger-memory/tree/7aa05c4557e010c8d6decb16e96b05de36e1196a)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/18477514055/dsh-ledger-memory) [![npm 30d 3,016](https://img.shields.io/static/v1?label=npm+30d&message=3%2C016&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ledger-memory) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ledger-memory)
<!-- END META -->

> **实现功能**：为DSH项目维护台账、决策目标经验卡和活动日志，自动注入记忆、压缩前后提供胶囊与seq回读，并支持跨会话交接和项目锁定。

> **核心亮点**：将项目文件/卡片、每轮记忆接线、被压seq索引和先index后点读组合，settings缺认证拒绝、原则用真实卡片grant，减少纯摘要盲回读。详见[Q02](#research-q02)、[Q04](#research-q04)。

> **风险与缺陷**：原则grant按sid未绑定root/正文/版本；全量落盘有manual/紧急旁路；超cap单事件按事件边界无法回读，文本不是原始事件全结构。记忆写可自动git add，多资产非事务。详见[Q03](#research-q03)、[Q05](#research-q05)、[Q07](#research-q07)。

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
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 台账记忆面向什么长期任务，合格结果是什么？](#detail-section-11)
  - [Q02 · 项目记忆和注入的具体贡献是什么？](#detail-section-12)
  - [Q03 · 压缩前落盘和胶囊有什么保证与例外？](#detail-section-13)
  - [Q04 · 两段召回能否证明逐字无损？](#detail-section-14)
  - [Q05 · 路径、原则授权和敏感数据的边界是什么？](#detail-section-15)
  - [Q06 · 依赖和采用流程是什么？](#detail-section-16)
  - [Q07 · 落盘、索引与Git是否等于完整事务？](#detail-section-17)
  - [Q08 · 首次、持续与失败成本及效果怎样看？](#detail-section-18)
  - [Q09 · 当前推荐什么，进一步探索什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向跨很多轮/会话推进同一项目的DSH用户。活跃台账承接现状，决策/目标/经验卡存长期资产，活动日志保事件，压缩前后胶囊和seq索引帮助找回原话，handoff让新会话继续。它管理的是人和模型维护的项目记忆，不是自动证明项目事实的数据库。

合格记忆需明确项目、版本/时间、来源与当前状态，区分用户指令、模型推断、已作废决策和未完成目标。文件落盘不证明内容真实或任务完成；自动注入错误台账会稳定重复错误，卡片权重也不是证据真实性评分。

基线是人工LEDGER/交接文档加宿主会话日志。插件省每轮读取/提醒/压缩回溯的接线，代价是更广的持久数据、上下文和宿主生命周期耦合，适合愿意维护清单与核记忆来源的人。

人工台账/交接与宿主持久会话日志；插件省重复读取/提醒/定位，事实、权限、备份和总成本仍需人核。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 项目记忆 | 活跃台账/卡片/日志 | 内容需核真，显式root不当已授权根 |
| 每轮注入 | 整体/切块/文件anchor | 权重/hash不证明必要/正确 |
| 压缩/胶囊 | 落盘纪律/原话错误线索 | 手动/紧急旁路与硬上限 |
| 两段召回 | 当前session index→seqs | 大事件cap与文本抽取非原件全结构 |
| 原则授权 | 卡片内部grant/一次消费 | 未绑定root/内容/版本 |
| 持久化/Git | 原子文件、日志与自动add | 多文件非事务，可改变index |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=22.19与相容Cordis/DSH | 必需 | ESM与事件/工具 | peer少不等于宿主接口简单 |
| tools、agent/session事件、commands/压缩服务 | 对应能力 | 注入/回溯/压缩/交接 | 版本schema与服务查找要核 |
| 可写项目清单/台账/卡片/日志 | 记忆 | 项目长期资产 | 需要备份与来源审阅 |
| userQuestions | 模型修改原则授权 | 用户卡片 | 缺失拒绝grant而非自动放行 |
| connection/webServer与client slots | 设置面 | 认证/卡片 | 缺认证设置拒绝，核心能力可另用 |
| Git与明确stage偏好 | Git协作 | 可自动git add | 不等于提交/推送，可能改变index |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定宿主/包，备份匿名测试项目 | 不在唯一生产记忆上初试 |
| 登记 | 明确项目/清单/路径与日志档 | 核真实根、关闭不需L4和autoGitAdd |
| 读写 | 小台账/一张决策/目标卡 | 对照文件与注入来源/版本 |
| 压缩 | 人为合成历史测自动/紧急/手动 | 核落盘/胶囊/seq和实际恢复 |
| 原则 | 检查卡片目标与最终内容 | grant不是任意后续写许可 |
| 跨会话 | 锁定项目/交接单并核首轮 | 新会话不能误承其他项目 |
| 维护 | 清理/归档、Git index与备份 | 不因有日志就认为可以丢原件 |

npm发布刻意不带tools自检/变异探针；存在作者test/probes不代表安装包可跑或本轮已验收。本轮不执行这些脚本。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 复用项目文件/卡片/日志存储，需备份空间 | 设计项目清单/卡片/日志范围，核宿主事件与权限/备份 | 初始化与规则适配时间、金额未知 |
| 持续使用 | 每轮记忆注入、压缩/回读tokens与日志IO | 卡片选择、用户审阅与记忆维护 | 卡片排序不保证最少token，摘要/回读计入总usage；无独立API调用不等总费用为0 |
| 失败恢复 | 错项目/压缩旁路/超cap回读可能增加重复usage、恢复IO | 错记忆/错项目核对、Git暂存和多资产修复 | 没有端到端事务/无损证明，人工时间与金额未量化 |



#### 效果

| 目标 | 源码支持的增量 | 证据边界 |
| --- | --- | --- |
| 跨轮接续 | 文件台账与自动注入/交接 | 错误内容也可能反复注入 |
| 少全量回读 | 切块与index→seqs | hash/权重不证明任务必要性 |
| 压后查原文 | eventAt/被压范围和胶囊 | 大事件预算/缺失与文本抽取有限 |
| 控原则写权 | 真卡片grant/一次消费 | 未绑定root/正文/版本 |

不从作者72.7%二次压缩或固定阈值推断普遍收益。这些是特定会话/策略观测，不是当前固定版本在不同任务下的对照。更重要指标是事实错误、跨项目污染、任务恢复正确、总输入/缓存/输出与人工核查时间。

> **思考**：原则grant按sid未绑定root/正文/版本；全量落盘有manual/紧急旁路；超cap单事件按事件边界无法回读，文本不是原始事件全结构。记忆写可自动git add，多资产非事务。详见[Q03](#research-q03)、[Q05](#research-q05)、[Q07](#research-q07)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将项目文件/卡片、每轮记忆接线、被压seq索引和先index后点读组合，settings缺认证拒绝、原则用真实卡片grant，减少纯摘要盲回读。详见[Q02](#research-q02)、[Q04](#research-q04)。

将项目文件/卡片、每轮记忆接线、被压seq索引和先index后点读组合，settings缺认证拒绝、原则用真实卡片grant，减少纯摘要盲回读。详见[Q02](#research-q02)、[Q04](#research-q04)。

writeFileAtomic用独占wx临时文件再rename，能避免半写目标和直接覆盖同名临时文件；卡片/台账/日志/清单之间仍是多步骤，不是数据库事务。失败可能出现文件写成功但审计失败，代码有明确忽略审计错误并仍返回主写成功；不能因活动日志append-only就证明每次变更一定有同步完整审计。

普通ledger write在manifest.autoGitAdd !==false且.git存在时gitAdd当前relPath，结果staged单独返回。它不commit/push，但会改变用户index；已暂存同文件的旧内容可被更新为新内容，需要读者纳入流程。归档/迁移可能多个路径和目录变化，不应只看工具ok就结束。

运行模块大量状态/家目录stores与每session缓存，跨进程/外部编辑的CAS/锁保证不能从atomic rename推导。本轮读的是关键路径，不声称所有27k行都已逐行安全审计；较多作者probe记录能指引边界，不能替代同版本正式运行验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

原则grant按sid未绑定root/正文/版本；全量落盘有manual/紧急旁路；超cap单事件按事件边界无法回读，文本不是原始事件全结构。记忆写可自动git add，多资产非事务。详见[Q03](#research-q03)、[Q05](#research-q05)、[Q07](#research-q07)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，无敏感项目副本中核授权目标/内容、压缩旁路、回读cap、日志披露与Git index变化，再考虑重要记忆。详见[Q09](#research-q09)。

合格记忆需明确项目、版本/时间、来源与当前状态，区分用户指令、模型推断、已作废决策和未完成目标。文件落盘不证明内容真实或任务完成；自动注入错误台账会稳定重复错误，卡片权重也不是证据真实性评分。

基线是人工LEDGER/交接文档加宿主会话日志。插件省每轮读取/提醒/压缩回溯的接线，代价是更广的持久数据、上下文和宿主生命周期耦合，适合愿意维护清单与核记忆来源的人。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。项目记忆与两段回读完整，授权范围/压缩旁路/大事件回读及多资产/Git副作用需要明确采用条件。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/part1.js、lib/part2.js、lib/part3.js、lib/part4.js、lib/part5.js、lib/part6.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：大型27k行运行模块按关键链核defs/index和part1~6有关项目/块/召回/压缩/授权/持久化，非全行审计；不执行tools变异探针/宿主/模型/真实日志。
- 下一步：可继续用双项目授权、超cap/多类型事件、紧急/手动压缩与审计失败/既有暂存序列，核项目范围、恢复hash与总usage。

**分析版本**

- **仓库**：[18477514055/dsh-ledger-memory](https://github.com/18477514055/dsh-ledger-memory)
- **版本号**：1.3.0（[固定提交 7aa05c4](https://github.com/18477514055/dsh-ledger-memory/tree/7aa05c4557e010c8d6decb16e96b05de36e1196a)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索项目/材料/省略收据、原则内容与版本授权、压缩对象hash/超大事件分块及独立Git偏好，比较污染/恢复和总成本；未实现。详见[Q09](#research-q09)。

可继续用双项目授权、超cap/多类型事件、紧急/手动压缩与审计失败/既有暂存序列，核项目范围、恢复hash与总usage。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 9 | 27322 | 14680 | 11149 | — |
| .md | source | 1 | 316 | — | — | 4917 |
| .mjs | source | 290 | 56073 | 40486 | 12500 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/18477514055/dsh-ledger-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=grey&logo=github&style=flat)](https://github.com/18477514055/dsh-ledger-memory/issues?q=is%3Aissue+created%3A2026-09-22T07%3A21%3A29.573Z..2026-10-22T07%3A21%3A29.573Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/18477514055/dsh-ledger-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A21%3A29.573Z..2026-10-22T07%3A21%3A29.573Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本核项目台账/注入/压缩/召回和原则授权，区分记忆载体与事实真值、路径/内容权限及多资产恢复。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 台账记忆面向什么长期任务，合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

面向跨很多轮/会话推进同一项目的DSH用户。活跃台账承接现状，决策/目标/经验卡存长期资产，活动日志保事件，压缩前后胶囊和seq索引帮助找回原话，handoff让新会话继续。它管理的是人和模型维护的项目记忆，不是自动证明项目事实的数据库。

合格记忆需明确项目、版本/时间、来源与当前状态，区分用户指令、模型推断、已作废决策和未完成目标。文件落盘不证明内容真实或任务完成；自动注入错误台账会稳定重复错误，卡片权重也不是证据真实性评分。

基线是人工LEDGER/交接文档加宿主会话日志。插件省每轮读取/提醒/压缩回溯的接线，代价是更广的持久数据、上下文和宿主生命周期耦合，适合愿意维护清单与核记忆来源的人。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-9](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/README.md#L3-L9)

项目载体/模型定结构作者目标。

```text
一个面向 **DSH（DeepSeek Harness）** 的宿主侧插件，为每个项目建立独立、可回溯、可追查的长期记忆载体。

插件管理的对象并非对话记录，而是**项目自身的记忆载体 —— 台账**：可追溯、只追加、按周归档。
围绕台账还提供活动日志、上下文压缩与跨会话交接能力。

**不预设任何模板。** 台账的文件划分、命名与字段结构，全部由模型在初始化时依据项目类型自行确定；
插件仅承担**检测、注入、回写、归档与 Git 协作**等流程性职责。
```

**依据 2 · 作者声明**：[README.md:15-23](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/README.md#L15-L23)

跨轮记忆/胶囊/交接用途。

```text
| 问题 | 处理方式 |
|---|---|
| 新会话无法接续前一会话的项目进度 | 会话开始时注入**活跃台账全文**；内容未变更则不重复注入，以避免破坏 prompt 缓存 |
| 单个回合的产出未能沉淀 | 回合结束时将「已完成 / 受阻 / 下一步」写回活跃台账 |
| 台账持续增长、难以完整阅读 | 超出阈值时将**最旧的已完成条目**移入 `归档目录/YYYY-MM/weekN`，**只追加、不删除** |
| 细节在上下文压缩中被抹去 | 压缩**之前**将用户原话、报错原文、变更文件清单持久化为**逐字胶囊**，压缩后与台账一并注回 |
| 新会话缺少承接信息 | 生成**交接单**，并把指针推入新会话的**首轮注入**，无需使用者主动查询 |
| 需要核查台账变更来源与时间 | 台账末尾自动维护变更登记；完整历史保存在只追加的活动日志中 |
| 仅为一次性排查、不构成项目 | `ledger_note` 生成**问题记录**（现象 → 根因 → 结论 → 处理过程），不建立台账 |
```

**依据 3 · 源码核查**：[lib/index.js:212-237](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/index.js#L212-L237)

工具覆盖台账/日志/卡片/压缩。

<details>
<summary>查看原文（26行）</summary>

```text
  for (const [label, factory] of [
    ["ledger_status", () => defineStatusTool(ctx, state)],
    ["ledger_init", defineInitTool],
    ["ledger_read", defineReadTool],
    ["ledger_write", () => defineWriteTool(state)],
    ["ledger_archive", () => defineArchiveTool(state)],
    ["ledger_log", defineLogTool],
    ["ledger_recall", () => defineRecallTool(state)],
    ["ledger_log_write", () => defineLogWriteTool(state)],
    ["ledger_note", defineNoteTool],
    ["ledger_handoff", defineHandoffTool],
    ["ledger_triage", () => defineTriageTool(state)],
    ["ledger_lock", defineLockTool],
    ["ledger_conform", defineConformTool],
    // ★ 2026-10-14（D199）：**减法/搬家**那一半（`conform` 只做加法）。
    ["ledger_migrate", defineMigrateTool],
    // ★ 2026-10-14（D202，用户拍板）：**多维索引表**（卡片目录用；D136 的秩融合原样复用）。
    ["ledger_index", defineIndexTool],
    ["ledger_propose_principle", () => defineProposePrincipleTool(state)],
    // ★★★★★ 2026-10-14（D191）：原则的**授权窗口**（用户点卡片解锁"改原则的权利"）。
    [PRINCIPLE_GRANT_TOOL, () => definePrinciplesAccessTool(ctx, state)],
    ["ledger_goals", defineGoalsTool],
    // ★★★★★ 2026-10-14（D192）：**经验与教训**（模型踩过的坑）。
    ["ledger_lessons", defineLessonsTool],
    ["ledger_compact", () => defineCompactTool(ctx, state, capsule)],
    [CHECKPOINT_TOOL, () => defineCheckpointTool(ctx, state)],
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 项目记忆和注入的具体贡献是什么？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

项目清单与inspect识别活跃台账/日志/卡片路径，root默认来自执行agent cwd，也允许显式root指存在目录。工具提供读写/归档/分流/锁项目/目标经验卡和handoff。常驻pre-step负责把项目记忆和压缩后指针送进当前步，不靠模型每次记得手动cat。

存储卡片化与注入切块是两条轴。renderBlockInjection按标题split活跃台账、hash差异和模型/历史权重选块；变更块有必注保护，过长/切不出退全体路径。fileAnchor按memory kind分组再做组内相对秩，避免归档组把材料组排序分母挤偏。它是选择/缓存策略，不保证被省略内容对当前问题不重要。

贡献在项目文件作为可审记忆、每轮接线与按需seq回溯组合；没有独立训练记忆模型。协议代次检测、卡片权重/复述提示属于结构/流程，不把作者单项目取舍当通用认知规律。

#### 证据与依据

**依据 1 · 源码核查**：[lib/part3.js:1661-1688](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part3.js#L1661-L1688)

cwd/显式root选择。

<details>
<summary>查看原文（28行）</summary>

```text
export function rootFromExec(exec, args) {
  const raw = typeof args?.root === "string" ? args.root.trim() : "";
  if (raw !== "") {
    const base = projectRootOf(exec?.agent);
    const abs = path.resolve(base ?? process.cwd(), raw);
    let isDir = false;
    try {
      isDir = fs.statSync(abs).isDirectory();
    } catch {
      isDir = false;
    }
    if (!isDir) {
      throw fail(
        `project-ledger: 传进来的 root 不是一个存在的目录：\`${raw}\`（解析为 \`${abs}\`）。` +
          "显式指定项目根时它必须已经存在 —— 本插件不会替你创建它。"
      );
    }
    return abs;
  }

  const root = projectRootOf(exec?.agent);
  if (root === undefined) {
    throw fail(
      "project-ledger: 这个执行没有可用的会话工作目录（agent.session.header.cwd），" +
        "无法定位项目根。若本会话是从容器工作区开的，请用 root 参数点名子项目目录。"
    );
  }
  return root;
```

</details>

**依据 2 · 源码核查**：[lib/part3.js:1262-1295](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part3.js#L1262-L1295)

切块/fallback/hash变更。

<details>
<summary>查看原文（34行）</summary>

```text
export function renderBlockInjection(info, opts) {
  const fallback = (why) => ({ text: "", used: false, stats: { why } });
  if (info?.activeAbs === undefined) return fallback("没有活跃台账路径");
  let raw;
  try {
    raw = readTextSafe(info.activeAbs);
  } catch {
    return fallback("读盘抛错");
  }
  if (typeof raw !== "string" || raw === "") return fallback("台账读不到或为空");

  // ★ 台账过长时**不省**：那一段本来就带"已截断"警告，再切块会把语义搅乱。
  if (raw.length > numOf("maxReadChars", MAX_READ_CHARS)) return fallback("台账超过单次读取上限");

  let blocks;
  try {
    blocks = splitBlocks(raw);
  } catch {
    return fallback("切块抛错");
  }
  if (!Array.isArray(blocks) || blocks.length === 0) return fallback("切不出块");

  const afterCompaction = opts?.afterCompaction === true;

  // ── 算权重（★ 判据只来自确定性输入；模型没答的块按"必注"兜底）──
  const weighted = weightBlocks(blocks, opts?.modelAnswers, opts?.histByHash, Date.now());

  // ── 安全绳 ①：内容变了的块 ⇒ 必注 ──
  const prevHashes = new Set((opts?.prevBlocks ?? []).map((b) => b.hash));
  let changedSet = new Set();
  if (opts?.prevBlocks !== undefined) {
    try {
      changedSet = new Set(diffBlocks(opts.prevBlocks, blocks).changed.map((b) => b.hash));
    } catch {
```

</details>

**依据 3 · 源码核查**：[lib/part6.js:398-425](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part6.js#L398-L425)

同kind分组相对秩。

<details>
<summary>查看原文（28行）</summary>

```text
export function anchorFiles(files, ctx) {
  const all = Array.isArray(files) ? files.slice() : [];
  if (all.length === 0) return [];

  // ★★★★★ 先按 `kind` 分组，**在各组内部各自求相对秩**（第一版的教训见 `memorySurfaces`）。
  //   ★ 为什么不是"算完分再排序时过滤"：那样归档片段的高分仍会把
  //     **材料组的相对位置**挤压（秩是组内算的，混组算等于用错分母）。
  //   ⇒ 判据：**分母必须与分子同类**（纪律 15 的正面写法）。
  const groups = new Map();
  for (const f of all) {
    const k = typeof f.kind === "string" && f.kind !== "" ? f.kind : "material";
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(f);
  }
  const out = [];
  for (const [kind, list] of groups) {
    for (const scored of anchorWithinKind(list, ctx)) out.push({ ...scored, kind });
  }
  return out;
}

/**
 * ★ 在**一组同类文件内**做六维相对秩融合（`anchorFiles` 的唯一实现体）。
 *
 * ★ 单独抽出来是为了让自检能直接断言"组内才算秩"这条性质，
 *   而不必构造一个完整的项目目录。
 */
export function anchorWithinKind(list, ctx) {
```

</details>

**依据 4 · 源码核查**：[lib/index.js:212-237](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/index.js#L212-L237)

工具装配。

<details>
<summary>查看原文（26行）</summary>

```text
  for (const [label, factory] of [
    ["ledger_status", () => defineStatusTool(ctx, state)],
    ["ledger_init", defineInitTool],
    ["ledger_read", defineReadTool],
    ["ledger_write", () => defineWriteTool(state)],
    ["ledger_archive", () => defineArchiveTool(state)],
    ["ledger_log", defineLogTool],
    ["ledger_recall", () => defineRecallTool(state)],
    ["ledger_log_write", () => defineLogWriteTool(state)],
    ["ledger_note", defineNoteTool],
    ["ledger_handoff", defineHandoffTool],
    ["ledger_triage", () => defineTriageTool(state)],
    ["ledger_lock", defineLockTool],
    ["ledger_conform", defineConformTool],
    // ★ 2026-10-14（D199）：**减法/搬家**那一半（`conform` 只做加法）。
    ["ledger_migrate", defineMigrateTool],
    // ★ 2026-10-14（D202，用户拍板）：**多维索引表**（卡片目录用；D136 的秩融合原样复用）。
    ["ledger_index", defineIndexTool],
    ["ledger_propose_principle", () => defineProposePrincipleTool(state)],
    // ★★★★★ 2026-10-14（D191）：原则的**授权窗口**（用户点卡片解锁"改原则的权利"）。
    [PRINCIPLE_GRANT_TOOL, () => definePrinciplesAccessTool(ctx, state)],
    ["ledger_goals", defineGoalsTool],
    // ★★★★★ 2026-10-14（D192）：**经验与教训**（模型踩过的坑）。
    ["ledger_lessons", defineLessonsTool],
    ["ledger_compact", () => defineCompactTool(ctx, state, capsule)],
    [CHECKPOINT_TOOL, () => defineCheckpointTool(ctx, state)],
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 压缩前落盘和胶囊有什么保证与例外？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

默认全量压缩线作者说明70%，增量默认关闭。flushBeforeCompact通常按是否已落盘/分流与hardMaintenanceGate限制自动压缩，但manual直接放行，没有台账的项目无需落盘；全量紧急水位接近内核线也返回forcedThrough并注明本轮没先落盘。因此“先记录台账再压缩”是带明确旁路的策略，不是每种触发都绝对满足的存储事务。

胶囊把用户原话/错误/器物线索在内存和盘合并，去重后仍有user/error条数硬上限，语义与原始session日志不同。优点是压缩后能提供指向原材料的线索，不应说胶囊就是全部历史无损副本。summary自身仍依宿主压缩服务，作者探针说明和阈值不能证明所有DSH版本钩子顺序相同。

硬门提高落盘纪律也可能阻塞直到紧急旁路/内核自压，读者应把“未落盘仍压了”“被拦住”“宿主先压”作为不同结果收据，而不是只看压缩次数。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:25-44](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/README.md#L25-L44)

作者默认/先落盘说明。

<details>
<summary>查看原文（20行）</summary>

```text
## 上下文压缩机制

插件默认启用**全量压缩**；增量（分段）压缩**默认关闭**，可按需手动开启。

| 阶段 | 触发条件 | 行为 |
|---|---|---|
| ① 保底 · 全量 | 水位达到 **70%**（内核默认 80%，插件在其之前触发） | 执行全量压缩，同时保留指向原始内容的**指针**：用户原话、报错原文、变更文件清单与重读入口 |
| ② 收尾 · 交接 | 切换会话时 | 由交接单承载，使新对话无缝接续 |
| ③ 可选 · 增量 | **需手动开启**（默认关闭） | 仅压缩**最旧一段**，削减上涨区间的约一半 |

**关于默认关闭的增量压缩**：该分支曾为主要路径，现已默认关闭且不再按固定节奏调用。
依据是实测取舍 —— 压缩幅度较浅的摘要**大概率会被再次压缩**（≤5 万 token 的浅层压缩中 **72.7%** 会被二次压缩），
层级增加会导致清晰度衰减。因此当前以**全量压缩**为主路径，单次压缩更深。
`deltaTriggerPoints`（触发涨幅）与 `deltaRemovePoints`（单轮最大压缩点数）两项配置**仅在启用增量压缩时生效**。

压缩遵循一条固定约束：**先记录台账，再执行压缩** —— 尚未落盘的进展将成为唯一副本。
该约束由**周期判定**（"自上次压缩以来是否落盘"）保证，而非"是否已发出要求"
（后者会使模型被阻塞：历史上曾出现拦截近 4 小时、压缩零次的情况）。
**收尾硬门**（`hardMaintenanceGate`）默认开启：未落盘则不压缩；关闭后回退为
"拦 3 次或超 20 分钟即放行"的旧行为。
```

</details>

**依据 2 · 源码核查**：[lib/part3.js:1840-1845](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part3.js#L1840-L1845)

设置关闭/manual旁路。

```text
export function flushBeforeCompact(state, sid, info, opts) {
  const s = currentSettings();
  if (s.requireFlushBeforeCompact !== true) return { ok: true, why: "设置已关闭" };

  // ★★ 旁路 ①：人手动按的 ⇒ 直接放行（他按下就是授权）。
  if (opts?.manual === true) return { ok: true, why: "手动触发（用户已授权）" };
```

**依据 3 · 源码核查**：[lib/part3.js:1872-1895](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part3.js#L1872-L1895)

紧急水位/无台账例外。

<details>
<summary>查看原文（24行）</summary>

```text
  if (isFull) {
    // ★★★ 紧急旁路（`FULL_COMPACT_URGENT_RATIO`）：水位逼近内核硬压线 ⇒ **不再等落盘**。
    //   ★ 理由见那个常量的注释：内核 0.8 自己会压一次，**那一次抓不到逐字胶囊**；
    //     在 78% 还等落盘 = 把机会让给内核 ⇒ 用户最在意的"逐字可回读"就没了。
    if (typeof opts?.ratio === "number" && opts.ratio >= FULL_COMPACT_URGENT_RATIO) {
      return {
        ok: true,
        why:
          `水位 ${Math.round(opts.ratio * 100)}% 已逼近内核硬压线（${Math.round(KERNEL_HARD_COMPACT_RATIO * 100)}%），` +
          "再等落盘会让**内核**先压（那一次抓不到逐字胶囊）⇒ 本次放行，如实标注：**这一轮没有先落盘**",
        forcedThrough: true,
        fullUrgent: true,
      };
    }
    // ★★★ 2026-10-12（D131）：这里原来有一条"全量落盘超时兜底"（依赖 `flushOwedAt`）。
    //   而 `flushOwedAt` **从不被写** ⇒ 那条兜底**永不触发** ⇒ 已随死代码一起清掉。
    //   ★ 全量现在由**周期判据**约束（`flushedAt > lastCompactAt`）+ 下面那条
    //     `FULL_COMPACT_URGENT_RATIO` 紧急旁路接住 —— 两者都是活的。
  }

  const key = String(sid);
  // ② 这个项目没有台账 ⇒ 没有"落盘"这回事，放行（否则压缩永不发生）。
  if (info === undefined || info.activeRel === undefined) {
    return { ok: true, why: "这个项目没有台账，无需落盘" };
```

</details>

**依据 4 · 源码核查**：[lib/part3.js:1943-1977](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part3.js#L1943-L1977)

hard门与宽容阀区别。

<details>
<summary>查看原文（35行）</summary>

```text
        typeof tOwed === "number" && Date.now() - tOwed >= numOf("triageOwedMaxAgeMs", TRIAGE_OWED_MAX_AGE_MS);
      // ★★★★★ 2026-10-13（D179 硬门）：**超时放行是"宽容阀"，硬门开时它不生效。**
      //   ★ 为什么这条要一起硬：它是 D59 之后加的"避免压缩永不发生"的兜底。
      //     硬门的语义恰是"**没做完就真的不发生**" ⇒ 两者**直接冲突** ⇒ 必须二选一。
      //   ★ 但**不删**它：`hardMaintenanceGate: false` 时它照旧生效（保留回退路）。
      if (overdue && !hardMaintenanceGateOn()) {
        state.triageOwedAt.delete(key);
        state.triageBlocked.delete(key);
        return {
          ok: true,
          why:
            `要求分流已超过 ${Math.round(numOf("triageOwedMaxAgeMs", TRIAGE_OWED_MAX_AGE_MS) / 60000)} 分钟仍未做，` +
            "本次放行（避免压缩永不发生）—— 如实标注：**这一轮没有分流单**",
          forcedThrough: true,
          triageOverdue: true,
        };
      }
      const trec = state.triageBlocked.get(key) ?? { count: 0 };
      trec.count += 1;
      state.triageBlocked.set(key, trec);
      // ★★★★★ 2026-10-13（D179 硬门）：**"连续拦 N 次就放行"是宽容阀 ⇒ 硬门开时不许放行。**
      //   ★★★ 判据方向**极容易写反**（我第一版就写成了 `!hardMaintenanceGateOn() && count < GIVEUP`，
      //     那等于"硬门开 ⇒ 跳过拦截 ⇒ 直接放行"，与意图**正好相反**）：
      //     这里 `if` 为真表示**拦截**，所以硬门开时必须让条件**恒真**。
      //   ⇒ 正确写法：`count < FLUSH_BLOCK_GIVEUP || hardMaintenanceGateOn()`
      //     （旧行为：没拦够 3 次就继续拦；硬门：**永远**拦）。
      const hard = hardMaintenanceGateOn();
      if (trec.count < FLUSH_BLOCK_GIVEUP || hard) {
        return {
          ok: false,
          missing: ["分流单"],
          // ★ 文案**按硬门分两套**：硬门开着还说"超过 20 分钟会放行"= **空承诺**，
          //   而模型一旦知道"反正会放行"，硬门就当场失效（本项目最忌的那类谎）。
          reason: hard
            ? "本项目在**反复追究**模式：压缩前要先做一次分流，而**这一轮还没做**。" +
```

</details>

**依据 5 · 源码核查**：[lib/part1.js:2338-2379](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part1.js#L2338-L2379)

胶囊并集/去重后硬上限。

<details>
<summary>查看原文（42行）</summary>

```text
  const keyOf = (x) => `${x?.at ?? ""}\u0000${x?.text ?? ""}`;
  const norm = (list) =>
    (Array.isArray(list) ? list : []).filter(
      (x) => x !== null && typeof x === "object" && typeof x.text === "string" && x.text !== "",
    );
  // ★ 复用同一段逻辑装配两个桶 —— 两桶的规则**必须**一致，
  //   各写一遍就会分叉（D59 的老坑：两套判据必然分叉）。
  const unionOf = (first, second) => {
    const seen = new Set();
    const out = [];
    for (const x of [...norm(first), ...norm(second)]) {
      const k = keyOf(x);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(x);
    }
    return out;
  };
  const userRaw = unionOf(mem?.userMessages, prev?.userMessages);
  const errRaw = unionOf(mem?.errors, prev?.errors);
  // ★★★★★ 2026-10-13（D170）：默认上限取**硬上限**（不是策略上限）——
  //   这个函数把"盘上那份"与"内存这份"并起来写回盘上，而它的硬约束是
  //   **输出长度 ≥ 盘上那份长度**（D159 的形式化）。
  //   ★ 若默认取策略上限（设置值），用户把 200 调回 40 时，并集结果会被砍到 40
  //     ⇒ **盘上那 160 条当场蒸发**，正好违反它自己的硬约束。
  //   ⇒ 策略上限只在**内存**那侧生效；调用方（`persistCapsuleMemory`）显式传硬上限。
  const userMax = Number.isFinite(caps?.userMax) ? caps.userMax : CAPSULE_STORE_USER_HARD_MAX;
  const errorMax = Number.isFinite(caps?.errorMax) ? caps.errorMax : CAPSULE_STORE_ERROR_HARD_MAX;

  // 器物索引：先盘上、再内存（同路径取更晚那次）
  const prevArt = prev?.artifacts instanceof Map ? Object.fromEntries(prev.artifacts) : prev?.artifacts ?? {};
  const memArt = mem?.artifacts instanceof Map ? Object.fromEntries(mem.artifacts) : mem?.artifacts ?? {};
  const mergedArt = { ...prevArt };
  for (const [p, o] of Object.entries(memArt)) {
    if (typeof p !== "string" || p === "" || o === null || typeof o !== "object") continue;
    const old = mergedArt[p];
    if (old === undefined || String(o.at ?? "") >= String(old.at ?? "")) mergedArt[p] = o;
  }
  // ★ 截断放在**并集之后**：上限是"文件多大"，不是"这次收了几条"。
  return {
    userMessages: userRaw.slice(0, userMax),
    errors: errRaw.slice(0, errorMax),
```

</details>

#### 缺口

- 不同宿主版本钩子顺序/内核自压与故障恢复没有同版本完整轨迹。
  **影响**：不能保证所有压缩先持久化、胶囊全覆盖或压缩不阻塞。
  **进一步探讨**：可继续用无敏感合成会话核手动/自动/紧急/无台账/断流，每条记录触发、落盘hash、被压范围与恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 两段召回能否证明逐字无损？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

ledger_recall绑定exec.agent.session，index先给seq/type/chars/gist/omitted，再events只取点名seq并报skipped/notFetched/truncated；未带mode还可from/to整段。比默认从任意会话扫描更有范围，先索引后少量取正文也更可控。它返回eventTextOf抽出的文本/工具块，不是原始event JSON全部字段或日志文件字节。

readSessionRange以eventAt顺序读，缺事件/异常/空可读文本跳过；字符预算在事件边界停止，不截半事件。这样保持单条文本完整，却使一个大于硬cap的事件根本取不回，按范围分页也不能把单事件拆出；index仍可显示大小，但不等于已提供正文。reasoning默认true还意味着读取可包含模型推理材料，需区分任务需要与数据留存。

因此可追溯/按seq找原文是具体能力，“任何被压内容总能无损恢复”仍依宿主持久记录、eventTextOf覆盖、事件大小及日志完整。声明verbatim不保证原件hash一一相等或所有叙述/工具结构都被重建。

#### 证据与依据

**依据 1 · 源码核查**：[lib/part5.js:333-360](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part5.js#L333-L360)

绑定当前session与index。

<details>
<summary>查看原文（28行）</summary>

```text
    async execute(args, exec) {
      const session = exec?.agent?.session;
      // ★ D138：面板可调 ⇒ 每次执行时取（不是启动时定死）。
      const recallCap = numOf("recallMaxChars", RECALL_MAX_CHARS);
      const mode = typeof args?.mode === "string" ? args.mode : "";
      const hasSeqs = Array.isArray(args?.seqs) && args.seqs.length > 0;
      const hasRange = Number.isFinite(Number(args?.from)) && Number.isFinite(Number(args?.to));

      // ── 第一段：索引（只给"有什么"，不取正文）──
      if (mode === "index") {
        if (!hasRange) {
          return { ok: false, reason: "mode:'index' 需要 from 与 to（先给区间，才谈得上索引它）" };
        }
        const idx = readSessionIndex(session, args.from, args.to, {
          reasoning: args?.reasoning !== false,
          gistChars: args?.gistChars,
          maxRows: args?.maxRows,
        });
        if (idx.ok !== true) return { ok: false, reason: idx.reason };
        return {
          ok: true,
          mode: "index",
          from: idx.from,
          to: idx.to,
          events: idx.events,
          totalChars: idx.totalChars,
          gistChars: idx.gistChars,
          reasoning: idx.reasoning,
```

</details>

**依据 2 · 源码核查**：[lib/part5.js:375-403](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part5.js#L375-L403)

点名events/跳过/notFetched。

<details>
<summary>查看原文（29行）</summary>

```text
      if (mode === "events") {
        if (!hasSeqs) {
          return { ok: false, reason: "mode:'events' 需要 seqs:[...]（从 mode:'index' 的结果里挑）" };
        }
        const r = readSessionPicked(session, args.seqs, {
          maxChars: Math.min(recallCap, Number(args?.maxChars) || recallCap),
          reasoning: args?.reasoning !== false,
        });
        if (r.ok !== true) return { ok: false, reason: r.reason };
        return {
          ok: true,
          mode: "events",
          picked: r.picked,
          returned: r.events.length,
          chars: r.chars,
          truncated: r.truncated === true,
          reasoning: r.reasoning,
          ...(r.skipped !== undefined ? { skipped: r.skipped } : {}),
          ...(r.truncated === true
            ? {
                hint:
                  "到字符闸门就停了（只返回了前面几条）。把剩下的 seq 分两批取，或传更小的 maxChars 以外的调整。",
                notFetched: (() => {
                  const got = new Set(r.events.map((e) => e.seq));
                  return [...new Set(args.seqs.map(Number))].filter((n) => !got.has(n)).sort((x, y) => x - y);
                })(),
              }
            : {}),
          events: r.events.map((e) => ({ seq: e.seq, type: e.type, text: e.text })),
```

</details>

**依据 3 · 源码核查**：[lib/part1.js:1782-1821](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part1.js#L1782-L1821)

eventAt/抽文本/整事件预算。

<details>
<summary>查看原文（40行）</summary>

```text
export function readSessionRange(session, from, to, opts) {
  const a = Math.max(0, Number(from) || 0);
  const b = Math.max(a, Number(to) || 0);
  const maxChars = Math.max(200, Number(opts?.maxChars) || 24000);
  const withReasoning = opts?.reasoning !== false;
  if (typeof session?.eventAt !== "function") {
    return { ok: false, reason: "这个执行里没有可读的会话（session.eventAt 不存在）" };
  }
  const out = [];
  let chars = 0;
  let truncated = false;
  for (let seq = a; seq <= b; seq += 1) {
    let e;
    try {
      e = session.eventAt(seq);
    } catch {
      e = undefined;
    }
    if (e === undefined || e === null) continue;
    const text = eventTextOf(e, withReasoning);
    if (text === "") continue;
    const hit = text.length;
    if (chars + hit > maxChars) {
      // ★ 超闸门就**在事件边界截断**并如实标注 —— 绝不许悄悄截半个事件（那会失真）。
      truncated = true;
      break;
    }
    chars += hit;
    out.push({ seq, type: e.type, time: e.time, text });
  }
  return {
    ok: true,
    events: out,
    chars,
    from: a,
    to: b,
    truncated,
    reasoning: withReasoning,
  };
}
```

</details>

**依据 4 · 源码核查**：[lib/part1.js:1844-1878](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part1.js#L1844-L1878)

index使用同文本尺度并计omitted。

<details>
<summary>查看原文（35行）</summary>

```text
export function readSessionIndex(session, from, to, opts) {
  const a = Math.max(0, Number(from) || 0);
  const b = Math.max(a, Number(to) || 0);
  const withReasoning = opts?.reasoning !== false;
  // ★ gist 默认 60 字：够看出"这条在讲什么"，又不至于让索引本身变成一份正文。
  const gistChars = Math.max(20, Math.min(200, Number(opts?.gistChars) || 60));
  const maxRows = Math.max(1, Math.min(2000, Number(opts?.maxRows) || 400));
  if (typeof session?.eventAt !== "function") {
    return { ok: false, reason: "这个执行里没有可读的会话（session.eventAt 不存在）" };
  }
  const rows = [];
  let totalChars = 0;
  let omitted = 0;
  for (let seq = a; seq <= b; seq += 1) {
    let e;
    try {
      e = session.eventAt(seq);
    } catch {
      e = undefined;
    }
    if (e === undefined || e === null) continue;
    // ★★ 与取正文**同一把尺子**（`eventTextOf`）—— 否则索引报的字数与真取到的对不上。
    const text = eventTextOf(e, withReasoning);
    if (text === "") continue;
    totalChars += text.length;
    if (rows.length >= maxRows) { omitted += 1; continue; }
    const flat = text.replace(/\s+/g, " ").trim();
    rows.push({
      seq,
      type: e.type,
      time: e.time,
      chars: text.length,
      gist: flat.length > gistChars ? `${flat.slice(0, gistChars)}…` : flat,
      // ★ 只给"有没有推理块"这一个粗信号：回读时可以据此决定要不要带 reasoning。
      hasReasoning: Array.isArray(e.data?.message?.content)
```

</details>

**依据 5 · 源码核查**：[lib/part1.js:1909-1944](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part1.js#L1909-L1944)

readSessionPicked整事件maxChars预算与skipped。

<details>
<summary>查看原文（36行）</summary>

```text
export function readSessionPicked(session, seqs, opts) {
  const maxChars = Math.max(200, Number(opts?.maxChars) || 24000);
  const withReasoning = opts?.reasoning !== false;
  if (typeof session?.eventAt !== "function") {
    return { ok: false, reason: "这个执行里没有可读的会话（session.eventAt 不存在）" };
  }
  const wanted = [...new Set((Array.isArray(seqs) ? seqs : []).map((n) => Number(n)).filter((n) => Number.isFinite(n) && n >= 0))]
    .sort((x, y) => x - y);
  const out = [];
  const skipped = [];
  let chars = 0;
  let truncated = false;
  for (const seq of wanted) {
    let e;
    try {
      e = session.eventAt(seq);
    } catch {
      e = undefined;
    }
    if (e === undefined || e === null) { skipped.push(seq); continue; }
    const text = eventTextOf(e, withReasoning);
    if (text === "") { skipped.push(seq); continue; }
    if (chars + text.length > maxChars) { truncated = true; break; }
    chars += text.length;
    out.push({ seq, type: e.type, time: e.time, text });
  }
  return {
    ok: true,
    events: out,
    chars,
    truncated,
    // ★ 如实报告"点了名但取不到"的 seq —— 悄悄跳过会让模型以为自己取全了。
    ...(skipped.length > 0 ? { skipped } : {}),
    reasoning: withReasoning,
    picked: wanted.length,
  };
```

</details>

#### 缺口

- eventTextOf对所有消息/工具/推理块及超cap单事件的覆盖未有固定全类型hash样本。
  **影响**：不能承诺任意完整事件/字节无损恢复。
  **进一步探讨**：构造多块/图片/推理/工具/超cap事件，对比原始JSON、可读文本、索引和正文；明确无法返回项。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 路径、原则授权和敏感数据的边界是什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

路径helper不仅词法判定，还从未存在目标向上找第一个存在祖先realpath，与项目真实根比较，改善新文件父链接越根风险。它是文件检查，不构成所有工具/执行期间竞态安全；显式root允许任意已有目录，不是宿主批准工作区allowlist，用户需明确选项目与写入范围。

原则写入有实际内部grant而非相信模型传authorizedBy。userQuestions卡片缺失/异常不授权，只有选授权才在state按sid存短期一次窗口，成功写后consume。这是具体强于自述的门。但grant只存at/authorizedBy/reason，没有root、预期文件版本或正文hash；后续writeLedger独立选择root和content，故授予某项目原则修改权的会话可将窗口用于另一显式root/不同内容，不能把它等同精确内容/目标签署。

settings路由每请求用connection.requestRejection，缺服务503、抛错403，路由和业务都重算，属于明确failclosed。另一方面L4可逐字存用户消息、胶囊/日志/交接可含秘密且存在项目文件/用户家目录，注入还把内容送模型；“本地记忆”不等于脱敏或零披露。principles卡片与普通记忆写权限不同，不能推断全部文件操作都先有用户确认。

#### 证据与依据

**依据 1 · 源码核查**：[lib/part2.js:2044-2074](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part2.js#L2044-L2074)

新目标父祖先物理检查。

<details>
<summary>查看原文（31行）</summary>

```text
export function isUnderReal(root, target) {
  const lexical = isUnder(root, target);
  if (!lexical) {
    return {
      ok: false,
      why: `路径越界（词法判定）：${String(target)} 不在 ${String(root)} 之内`,
      lexical: "out",
    };
  }
  // ② 真实路径：从目标往上找**第一个存在的**祖先，对它做 realpath
  const rootReal = realpathOf(root);
  if (rootReal === undefined) {
    // 连项目根本身都解析不出来（不存在 / 权限）⇒ 不猜，报不可判定（调用方按拒绝处理）
    return { ok: false, why: `项目根解析不出真实路径：${String(root)}`, lexical: "unknown-root" };
  }
  const anchor = nearestExistingAncestor(target);
  if (anchor === undefined) {
    return { ok: false, why: `找不到任何已存在的祖先路径：${String(target)}`, lexical: "no-anchor" };
  }
  const anchorReal = realpathOf(anchor);
  if (anchorReal === undefined) {
    return { ok: false, why: `祖先路径的真实路径解析失败：${anchor}`, lexical: "unreadable" };
  }
  // 用"已存在祖先的真实路径 + 剩余的相对尾段"算出目标的真实位置
  const tail = path.relative(path.resolve(anchor), path.resolve(target));
  const targetReal = tail === "" ? anchorReal : path.join(anchorReal, tail);
  if (!isUnder(rootReal, targetReal)) {
    return {
      ok: false,
      why:
        `路径越界（**真实路径**）：${String(target)} 词法上在项目内，但真实位置是 ${targetReal}，` +
```

</details>

**依据 2 · 源码核查**：[lib/part3.js:1661-1678](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part3.js#L1661-L1678)

显式root只查存在目录。

<details>
<summary>查看原文（18行）</summary>

```text
export function rootFromExec(exec, args) {
  const raw = typeof args?.root === "string" ? args.root.trim() : "";
  if (raw !== "") {
    const base = projectRootOf(exec?.agent);
    const abs = path.resolve(base ?? process.cwd(), raw);
    let isDir = false;
    try {
      isDir = fs.statSync(abs).isDirectory();
    } catch {
      isDir = false;
    }
    if (!isDir) {
      throw fail(
        `project-ledger: 传进来的 root 不是一个存在的目录：\`${raw}\`（解析为 \`${abs}\`）。` +
          "显式指定项目根时它必须已经存在 —— 本插件不会替你创建它。"
      );
    }
    return abs;
```

</details>

**依据 3 · 源码核查**：[lib/part2.js:380-395](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part2.js#L380-L395)

无卡片服务不授权。

<details>
<summary>查看原文（16行）</summary>

```text
    async execute(args, exec) {
      const root = rootFromExec(exec, args);
      const agent = exec?.agent;
      const sid = String(agent?.session?.header?.id ?? "");
      if (sid === "") return { ok: false, reason: "拿不到本会话 id，无法请求授权。" };
      const info = inspect(root);

      const uq = ctx.get("userQuestions");
      if (uq === undefined || typeof uq.ask !== "function") {
        return {
          ok: false,
          reason:
            "本机没有可用的 userQuestions 服务（没有会渲染选项卡片的客户端）⇒ 卡片弹不出来，" +
            "所以**没有**任何权利被解锁。请改用自然语言问用户，或直接请他敲 " +
            "`/ledger principles <内容>` 亲手写。",
          options: OPTIONS.map((o) => o.label),
```

</details>

**依据 4 · 源码核查**：[lib/part2.js:430-451](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part2.js#L430-L451)

grant按sid不存root/hash。

<details>
<summary>查看原文（22行）</summary>

```text
      const answers = Array.isArray(result?.answers) ? result.answers : [];
      const first = answers[0] ?? {};
      const selected = Array.isArray(first.selected) ? first.selected : [];
      const picked = String(selected[0] ?? "");
      // ★ 判据只看"用户点的是不是授权那一条" —— 取不到就当**没授权**（宁可少开一次）。
      const authorized = picked.includes("授权") && !picked.includes("不授权");

      if (!authorized) {
        return {
          ok: true,
          authorized: false,
          reason: "用户没有授权（或没做出选择）⇒ 我**仍然没有**修改原则的路径，只能提议。",
        };
      }
      state.principleGrants.set(sid, { at: Date.now(), authorizedBy: "user-card", reason });
      return {
        ok: true,
        authorized: true,
        ttlMinutes: Math.round(PRINCIPLE_AUTH_TTL_MS / 60000),
        note:
          `★ 用户**已授权**：在 ${Math.round(PRINCIPLE_AUTH_TTL_MS / 60000)} 分钟内，` +
          `\`ledger_write({target:"principles", ...})\` 会成功；**改一次窗口就用掉**（要再改就再问一次）。` +
```

</details>

**依据 5 · 源码核查**：[lib/part4.js:2768-2801](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part4.js#L2768-L2801)

消费内部grant后写独立root/content。

<details>
<summary>查看原文（34行）</summary>

```text
    const grant = sidForGrant === "" ? undefined : principleGrantOf(state, sidForGrant);
    const authorizedBy = grant === undefined ? "" : grant.authorizedBy;
    if (authorizedBy === "") {
      return {
        ok: false,
        reason:
          "**根本原则条例只能由用户授权后写入** —— 这次调用没有携带**由用户动作产生**的授权，所以一个字节都没写。\n" +
          (forged
            ? "★ 注意：你（或调用方）传了 `authorizedBy`，但**那个字符串从来就不是授权凭据** ——\n" +
              "  任何人都能写一个字符串，所以它证明不了任何事（v1.2.8 起已把它从工具参数里彻底移除）。\n"
            : "") +
          "★ 正确流程（两条，任选）：\n" +
          `  ① 用 \`${PRINCIPLE_GRANT_TOOL}\` 弹一张**授权卡片**，用户点了"授权"即可（一次一授权）；\n` +
          "  ② 用 `ledger_propose_principle` 登记**一条具体提议**，" +
          "再请用户敲 `/ledger principles approve` —— ★ 批准**只在命令行层**，你调不到。",
        refused: true,
        ...(forged ? { selfAssertedAuthIgnored: true } : {}),
        hint: PRINCIPLE_GRANT_TOOL,
      };
    }
    const r = writePrinciples(root, {
      content,
      mode: explicitMode ?? "append",
      authorizedBy,
      exec,
      tag,
    });
    // ★★★ **一次一授权**：写成功后**立刻消费掉**那个窗口。
    //   ★ 为什么必须消费（而不是留着）：留着就等于"点一次 = 此后随便改"，
    //     守卫当场退化成空的。用户的原话是"解锁**改原则的权利**"，
    //     而本项目一贯的取舍是"授权针对**某一次具体修改**"（见 `PRINCIPLE_AUTH_TTL_MS`）。
    if (r.ok === true && grant !== undefined) {
      consumePrincipleGrant(state, sidForGrant);
    }
```

</details>

**依据 6 · 源码核查**：[lib/part2.js:2521-2558](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part2.js#L2521-L2558)

settings缺认证拒绝。

<details>
<summary>查看原文（38行）</summary>

```text
export function authorizeRequest(scope, req) {
  let connection;
  try {
    connection = typeof scope?.get === "function" ? scope.get("connection") : undefined;
  } catch {
    connection = undefined;
  }
  if (connection === undefined || typeof connection.requestRejection !== "function") {
    return {
      allowed: false,
      status: 503,
      error:
        "本机没有可用的 `connection` 服务（宿主请求授权上下文缺失），" +
        "已按安全默认拒绝这次设置读写。设置面板需要 DSH 宿主自带该服务时才可用；" +
        "插件本体（台账 / 压缩 / 日志）不受影响。",
    };
  }
  let rejection;
  try {
    rejection = connection.requestRejection(req);
  } catch (e) {
    return {
      allowed: false,
      status: 403,
      error: `请求授权检查失败，已拒绝：${String((e && e.message) || e)}`,
    };
  }
  if (rejection !== undefined) {
    return {
      allowed: false,
      status: rejection,
      error:
        rejection === 403
          ? "请求不是同源的（Host / Origin 未通过围栏）。"
          : "需要浏览器会话授权：请从本机打印的那条带令牌的地址打开面板。",
    };
  }
  return { allowed: true };
```

</details>

**依据 7 · 源码核查**：[lib/part2.js:2569-2589](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part2.js#L2569-L2589)

业务和路由都守卫。

<details>
<summary>查看原文（21行）</summary>

```text
export function assertAuthorized(scope, req) {
  if (req === undefined || req === null) {
    return { allowed: false, status: 503, error: "内部调用缺少请求对象，已拒绝。" };
  }
  const verdict = authorizeRequest(scope, req);
  if (verdict.allowed !== true) return verdict;
  // ★ 与路由层互证：两边都通过才算真通过（路由层若没跑过，这里也照样独立判定）。
  return { allowed: true };
}


export function installSettingsRoutes(scope, view) {
  const registered = [];
  const failures = [];
  const reg = (p, handler) => {
    try {
      const dispose = scope.webServer.register({
        kind: "exact",
        path: SETTINGS_PREFIX + p,
        // ★ D221：先过授权闸门，再进业务 handler（`handleFor` 在最外层兜异常）。
        handler: handleFor(settingsGate(scope, handler)),
```

</details>

**依据 8 · 源码核查**：[lib/part3.js:1544-1557](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part3.js#L1544-L1557)

L4用户消息落盘入口。

<details>
<summary>查看原文（14行）</summary>

```text
    // ── L4 用户消息存档（用户需求：自动记住用户发的所有消息）─────────────
    //
    // ★ 为什么在这里（`session/event`）而不是别处：这是**唯一**一条
    //   "用户说了什么"必然经过的路，而且是官方自己落盘用的那条（见文件头 ⑦）。
    //   所以它不花 token、不靠 AI 记得、也不会漏 —— 用户要的正是"**自动**记住"。
    //
    // ★ 为什么**不注入上下文**：用户明确要求了。注入的话每轮都要把历史消息
    //   再抄一遍进 prompt，那是纯亏（钱与本就不宽裕的窗口）。它只在
    //   `ledger_log`（view "users"）里按需读切片 —— 与 L0–L3 同一套规矩。
    if (type === "user/message" && levelOn(info, "L4")) {
      const um = userMessageOf(event);
      if (um !== undefined) {
        push(
          b,
```

</details>

#### 缺口

- 原则卡片授权后跨root/内容变化的受控交互没有复现。
  **影响**：静态状态显示授权范围未绑定，不称已发生未授权写入。
  **进一步探讨**：同sid两个可丢弃项目先授权A再指定B/改正文，核是否拒绝并比较root/hash绑定方案。
- 用户实际日志/胶囊内容、文件ACL和宿主模型披露配置未读取。
  **影响**：不能给无秘密/多人隔离承诺。
  **进一步探讨**：先以假秘密测试保留/注入/导出范围、权限和关闭L4后的行为。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 依赖和采用流程是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=22.19与相容Cordis/DSH | 必需 | ESM与事件/工具 | peer少不等于宿主接口简单 |
| tools、agent/session事件、commands/压缩服务 | 对应能力 | 注入/回溯/压缩/交接 | 版本schema与服务查找要核 |
| 可写项目清单/台账/卡片/日志 | 记忆 | 项目长期资产 | 需要备份与来源审阅 |
| userQuestions | 模型修改原则授权 | 用户卡片 | 缺失拒绝grant而非自动放行 |
| connection/webServer与client slots | 设置面 | 认证/卡片 | 缺认证设置拒绝，核心能力可另用 |
| Git与明确stage偏好 | Git协作 | 可自动git add | 不等于提交/推送，可能改变index |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定宿主/包，备份匿名测试项目 | 不在唯一生产记忆上初试 |
| 登记 | 明确项目/清单/路径与日志档 | 核真实根、关闭不需L4和autoGitAdd |
| 读写 | 小台账/一张决策/目标卡 | 对照文件与注入来源/版本 |
| 压缩 | 人为合成历史测自动/紧急/手动 | 核落盘/胶囊/seq和实际恢复 |
| 原则 | 检查卡片目标与最终内容 | grant不是任意后续写许可 |
| 跨会话 | 锁定项目/交接单并核首轮 | 新会话不能误承其他项目 |
| 维护 | 清理/归档、Git index与备份 | 不因有日志就认为可以丢原件 |

npm发布刻意不带tools自检/变异探针；存在作者test/probes不代表安装包可跑或本轮已验收。本轮不执行这些脚本。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:36-59](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/package.json#L36-L59)

files白名单/作者scripts/Node。

<details>
<summary>查看原文（24行）</summary>

```text
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md"
  ],
  "scripts": {
    "test": "node tools/selftest.mjs",
    "probes": "node tools/_probe-assertion-can-fail.mjs && node tools/_probe-dirty-source.mjs && node tools/_probe-capsule-persistence.mjs"
  },
  "engines": {
    "node": ">=22.19.0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-slots"
      ]
    },
    "compatibility": {
      "dsh": ">=0.1.2-alpha.2",
```

</details>

**依据 2 · 源码核查**：[lib/index.js:212-237](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/index.js#L212-L237)

多能力装配。

<details>
<summary>查看原文（26行）</summary>

```text
  for (const [label, factory] of [
    ["ledger_status", () => defineStatusTool(ctx, state)],
    ["ledger_init", defineInitTool],
    ["ledger_read", defineReadTool],
    ["ledger_write", () => defineWriteTool(state)],
    ["ledger_archive", () => defineArchiveTool(state)],
    ["ledger_log", defineLogTool],
    ["ledger_recall", () => defineRecallTool(state)],
    ["ledger_log_write", () => defineLogWriteTool(state)],
    ["ledger_note", defineNoteTool],
    ["ledger_handoff", defineHandoffTool],
    ["ledger_triage", () => defineTriageTool(state)],
    ["ledger_lock", defineLockTool],
    ["ledger_conform", defineConformTool],
    // ★ 2026-10-14（D199）：**减法/搬家**那一半（`conform` 只做加法）。
    ["ledger_migrate", defineMigrateTool],
    // ★ 2026-10-14（D202，用户拍板）：**多维索引表**（卡片目录用；D136 的秩融合原样复用）。
    ["ledger_index", defineIndexTool],
    ["ledger_propose_principle", () => defineProposePrincipleTool(state)],
    // ★★★★★ 2026-10-14（D191）：原则的**授权窗口**（用户点卡片解锁"改原则的权利"）。
    [PRINCIPLE_GRANT_TOOL, () => definePrinciplesAccessTool(ctx, state)],
    ["ledger_goals", defineGoalsTool],
    // ★★★★★ 2026-10-14（D192）：**经验与教训**（模型踩过的坑）。
    ["ledger_lessons", defineLessonsTool],
    ["ledger_compact", () => defineCompactTool(ctx, state, capsule)],
    [CHECKPOINT_TOOL, () => defineCheckpointTool(ctx, state)],
```

</details>

**依据 3 · 源码核查**：[lib/part2.js:387-395](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part2.js#L387-L395)

userQuestions依赖。

```text
      const uq = ctx.get("userQuestions");
      if (uq === undefined || typeof uq.ask !== "function") {
        return {
          ok: false,
          reason:
            "本机没有可用的 userQuestions 服务（没有会渲染选项卡片的客户端）⇒ 卡片弹不出来，" +
            "所以**没有**任何权利被解锁。请改用自然语言问用户，或直接请他敲 " +
            "`/ledger principles <内容>` 亲手写。",
          options: OPTIONS.map((o) => o.label),
```

**依据 4 · 源码核查**：[lib/part4.js:3042-3045](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part4.js#L3042-L3045)

Git自动暂存默认条件。

```text
  let staged;
  if (info.manifest?.autoGitAdd !== false && fs.existsSync(path.join(root, ".git"))) {
    const r = gitAdd(root, [relPath]);
    staged = r.ok ? true : r.stderr || r.error || "git add 失败";
```

**依据 5 · 源码核查**：[lib/part2.js:2528-2536](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part2.js#L2528-L2536)

设置认证缺失拒绝。

```text
  if (connection === undefined || typeof connection.requestRejection !== "function") {
    return {
      allowed: false,
      status: 503,
      error:
        "本机没有可用的 `connection` 服务（宿主请求授权上下文缺失），" +
        "已按安全默认拒绝这次设置读写。设置面板需要 DSH 宿主自带该服务时才可用；" +
        "插件本体（台账 / 压缩 / 日志）不受影响。",
    };
```

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 落盘、索引与Git是否等于完整事务？

**研究主题**：工程质量与复用

#### 完整回答

writeFileAtomic用独占wx临时文件再rename，能避免半写目标和直接覆盖同名临时文件；卡片/台账/日志/清单之间仍是多步骤，不是数据库事务。失败可能出现文件写成功但审计失败，代码有明确忽略审计错误并仍返回主写成功；不能因活动日志append-only就证明每次变更一定有同步完整审计。

普通ledger write在manifest.autoGitAdd !==false且.git存在时gitAdd当前relPath，结果staged单独返回。它不commit/push，但会改变用户index；已暂存同文件的旧内容可被更新为新内容，需要读者纳入流程。归档/迁移可能多个路径和目录变化，不应只看工具ok就结束。

运行模块大量状态/家目录stores与每session缓存，跨进程/外部编辑的CAS/锁保证不能从atomic rename推导。本轮读的是关键路径，不声称所有27k行都已逐行安全审计；较多作者probe记录能指引边界，不能替代同版本正式运行验收。

#### 证据与依据

**依据 1 · 源码核查**：[lib/part2.js:2145-2173](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part2.js#L2145-L2173)

独占临时文件与原子替换。

<details>
<summary>查看原文（29行）</summary>

```text
export function writeFileAtomic(file, data, opts) {
  const abs = path.resolve(file);
  const tmp = `${abs}.tmp-${process.pid}-${Date.now().toString(36)}`;
  try {
    ensureDir(path.dirname(abs));
  } catch (e) {
    return { ok: false, reason: `创建目录失败：${String((e && e.message) || e)}` };
  }
  try {
    // ① 独占创建（`wx`）：临时名撞了就直接失败，绝不覆盖别人的临时文件
    fs.writeFileSync(tmp, data, { encoding: "utf8", flag: "wx" });
  } catch (e) {
    try {
      fs.unlinkSync(tmp);
    } catch {
      /* 连临时文件都没建出来，没什么可清的 */
    }
    return { ok: false, reason: `写临时文件失败：${String((e && e.message) || e)}`, tmp };
  }
  try {
    // ② 原子替换
    fs.renameSync(tmp, abs);
  } catch (e) {
    try {
      fs.unlinkSync(tmp);
    } catch {
      /* 清理失败不掩盖真正的原因 */
    }
    return { ok: false, reason: `原子替换失败：${String((e && e.message) || e)}`, tmp };
```

</details>

**依据 2 · 源码核查**：[lib/part4.js:3036-3052](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part4.js#L3036-L3052)

审计失败不挡主写，Git暂存与staged。

<details>
<summary>查看原文（17行）</summary>

```text
    } catch {
      // 审计失败绝不影响台账写入本身。
      auditLine = undefined;
    }
  }

  let staged;
  if (info.manifest?.autoGitAdd !== false && fs.existsSync(path.join(root, ".git"))) {
    const r = gitAdd(root, [relPath]);
    staged = r.ok ? true : r.stderr || r.error || "git add 失败";
  }

  return {
    ok: true,
    target,
    mode,
    path: abs,
```

</details>

**依据 3 · 源码核查**：[lib/part1.js:2338-2379](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part1.js#L2338-L2379)

内存/盘胶囊合并及截断。

<details>
<summary>查看原文（42行）</summary>

```text
  const keyOf = (x) => `${x?.at ?? ""}\u0000${x?.text ?? ""}`;
  const norm = (list) =>
    (Array.isArray(list) ? list : []).filter(
      (x) => x !== null && typeof x === "object" && typeof x.text === "string" && x.text !== "",
    );
  // ★ 复用同一段逻辑装配两个桶 —— 两桶的规则**必须**一致，
  //   各写一遍就会分叉（D59 的老坑：两套判据必然分叉）。
  const unionOf = (first, second) => {
    const seen = new Set();
    const out = [];
    for (const x of [...norm(first), ...norm(second)]) {
      const k = keyOf(x);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(x);
    }
    return out;
  };
  const userRaw = unionOf(mem?.userMessages, prev?.userMessages);
  const errRaw = unionOf(mem?.errors, prev?.errors);
  // ★★★★★ 2026-10-13（D170）：默认上限取**硬上限**（不是策略上限）——
  //   这个函数把"盘上那份"与"内存这份"并起来写回盘上，而它的硬约束是
  //   **输出长度 ≥ 盘上那份长度**（D159 的形式化）。
  //   ★ 若默认取策略上限（设置值），用户把 200 调回 40 时，并集结果会被砍到 40
  //     ⇒ **盘上那 160 条当场蒸发**，正好违反它自己的硬约束。
  //   ⇒ 策略上限只在**内存**那侧生效；调用方（`persistCapsuleMemory`）显式传硬上限。
  const userMax = Number.isFinite(caps?.userMax) ? caps.userMax : CAPSULE_STORE_USER_HARD_MAX;
  const errorMax = Number.isFinite(caps?.errorMax) ? caps.errorMax : CAPSULE_STORE_ERROR_HARD_MAX;

  // 器物索引：先盘上、再内存（同路径取更晚那次）
  const prevArt = prev?.artifacts instanceof Map ? Object.fromEntries(prev.artifacts) : prev?.artifacts ?? {};
  const memArt = mem?.artifacts instanceof Map ? Object.fromEntries(mem.artifacts) : mem?.artifacts ?? {};
  const mergedArt = { ...prevArt };
  for (const [p, o] of Object.entries(memArt)) {
    if (typeof p !== "string" || p === "" || o === null || typeof o !== "object") continue;
    const old = mergedArt[p];
    if (old === undefined || String(o.at ?? "") >= String(old.at ?? "")) mergedArt[p] = o;
  }
  // ★ 截断放在**并集之后**：上限是"文件多大"，不是"这次收了几条"。
  return {
    userMessages: userRaw.slice(0, userMax),
    errors: errRaw.slice(0, errorMax),
```

</details>

**依据 4 · 源码核查**：[lib/index.js:209-240](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/index.js#L209-L240)

工具独立注册失败降级。

<details>
<summary>查看原文（32行）</summary>

```text
  // ── 工具 ────────────────────────────────────────────────────────────────
  // 每个各自 try/catch：一个注册失败不许拖垮其它，更不许让 apply 抛错
  // （apply 抛错 ⇒ 整个 profile 组合失败 ⇒ 内核起不来，见文件头 ②）。
  for (const [label, factory] of [
    ["ledger_status", () => defineStatusTool(ctx, state)],
    ["ledger_init", defineInitTool],
    ["ledger_read", defineReadTool],
    ["ledger_write", () => defineWriteTool(state)],
    ["ledger_archive", () => defineArchiveTool(state)],
    ["ledger_log", defineLogTool],
    ["ledger_recall", () => defineRecallTool(state)],
    ["ledger_log_write", () => defineLogWriteTool(state)],
    ["ledger_note", defineNoteTool],
    ["ledger_handoff", defineHandoffTool],
    ["ledger_triage", () => defineTriageTool(state)],
    ["ledger_lock", defineLockTool],
    ["ledger_conform", defineConformTool],
    // ★ 2026-10-14（D199）：**减法/搬家**那一半（`conform` 只做加法）。
    ["ledger_migrate", defineMigrateTool],
    // ★ 2026-10-14（D202，用户拍板）：**多维索引表**（卡片目录用；D136 的秩融合原样复用）。
    ["ledger_index", defineIndexTool],
    ["ledger_propose_principle", () => defineProposePrincipleTool(state)],
    // ★★★★★ 2026-10-14（D191）：原则的**授权窗口**（用户点卡片解锁"改原则的权利"）。
    [PRINCIPLE_GRANT_TOOL, () => definePrinciplesAccessTool(ctx, state)],
    ["ledger_goals", defineGoalsTool],
    // ★★★★★ 2026-10-14（D192）：**经验与教训**（模型踩过的坑）。
    ["ledger_lessons", defineLessonsTool],
    ["ledger_compact", () => defineCompactTool(ctx, state, capsule)],
    [CHECKPOINT_TOOL, () => defineCheckpointTool(ctx, state)],
  ]) {
    try {
      // ★★★★★★ 2026-10-14（D207）：**在唯一的注册点统一清理返回值**。
```

</details>

#### 缺口

- 并发进程/外部编辑、文件成功但审计失败的重放恢复未故障注入。
  **影响**：不能保证多资产一致、无丢更新或审计完全。
  **进一步探讨**：可丢弃项目固定断点/双进程编辑，核台账/日志/清单/index版本并提供repair收据。

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 首次、持续与失败成本及效果怎样看？

**研究主题**：效果与总成本

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 复用项目文件/卡片/日志存储，需备份空间 | 设计项目清单/卡片/日志范围，核宿主事件与权限/备份 | 初始化与规则适配时间、金额未知 |
| 持续使用 | 每轮记忆注入、压缩/回读tokens与日志IO | 卡片选择、用户审阅与记忆维护 | 卡片排序不保证最少token，摘要/回读计入总usage；无独立API调用不等总费用为0 |
| 失败恢复 | 错项目/压缩旁路/超cap回读可能增加重复usage、恢复IO | 错记忆/错项目核对、Git暂存和多资产修复 | 没有端到端事务/无损证明，人工时间与金额未量化 |

#### 效果

| 目标 | 源码支持的增量 | 证据边界 |
| --- | --- | --- |
| 跨轮接续 | 文件台账与自动注入/交接 | 错误内容也可能反复注入 |
| 少全量回读 | 切块与index→seqs | hash/权重不证明任务必要性 |
| 压后查原文 | eventAt/被压范围和胶囊 | 大事件预算/缺失与文本抽取有限 |
| 控原则写权 | 真卡片grant/一次消费 | 未绑定root/正文/版本 |

不从作者72.7%二次压缩或固定阈值推断普遍收益。这些是特定会话/策略观测，不是当前固定版本在不同任务下的对照。更重要指标是事实错误、跨项目污染、任务恢复正确、总输入/缓存/输出与人工核查时间。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-44](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/README.md#L35-L44)

作者增量取舍/硬门说明。

<details>
<summary>查看原文（10行）</summary>

```text
**关于默认关闭的增量压缩**：该分支曾为主要路径，现已默认关闭且不再按固定节奏调用。
依据是实测取舍 —— 压缩幅度较浅的摘要**大概率会被再次压缩**（≤5 万 token 的浅层压缩中 **72.7%** 会被二次压缩），
层级增加会导致清晰度衰减。因此当前以**全量压缩**为主路径，单次压缩更深。
`deltaTriggerPoints`（触发涨幅）与 `deltaRemovePoints`（单轮最大压缩点数）两项配置**仅在启用增量压缩时生效**。

压缩遵循一条固定约束：**先记录台账，再执行压缩** —— 尚未落盘的进展将成为唯一副本。
该约束由**周期判定**（"自上次压缩以来是否落盘"）保证，而非"是否已发出要求"
（后者会使模型被阻塞：历史上曾出现拦截近 4 小时、压缩零次的情况）。
**收尾硬门**（`hardMaintenanceGate`）默认开启：未落盘则不压缩；关闭后回退为
"拦 3 次或超 20 分钟即放行"的旧行为。
```

</details>

**依据 2 · 源码核查**：[lib/part3.js:1262-1295](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part3.js#L1262-L1295)

切块选择的IO/上下文来源。

<details>
<summary>查看原文（34行）</summary>

```text
export function renderBlockInjection(info, opts) {
  const fallback = (why) => ({ text: "", used: false, stats: { why } });
  if (info?.activeAbs === undefined) return fallback("没有活跃台账路径");
  let raw;
  try {
    raw = readTextSafe(info.activeAbs);
  } catch {
    return fallback("读盘抛错");
  }
  if (typeof raw !== "string" || raw === "") return fallback("台账读不到或为空");

  // ★ 台账过长时**不省**：那一段本来就带"已截断"警告，再切块会把语义搅乱。
  if (raw.length > numOf("maxReadChars", MAX_READ_CHARS)) return fallback("台账超过单次读取上限");

  let blocks;
  try {
    blocks = splitBlocks(raw);
  } catch {
    return fallback("切块抛错");
  }
  if (!Array.isArray(blocks) || blocks.length === 0) return fallback("切不出块");

  const afterCompaction = opts?.afterCompaction === true;

  // ── 算权重（★ 判据只来自确定性输入；模型没答的块按"必注"兜底）──
  const weighted = weightBlocks(blocks, opts?.modelAnswers, opts?.histByHash, Date.now());

  // ── 安全绳 ①：内容变了的块 ⇒ 必注 ──
  const prevHashes = new Set((opts?.prevBlocks ?? []).map((b) => b.hash));
  let changedSet = new Set();
  if (opts?.prevBlocks !== undefined) {
    try {
      changedSet = new Set(diffBlocks(opts.prevBlocks, blocks).changed.map((b) => b.hash));
    } catch {
```

</details>

**依据 3 · 源码核查**：[lib/part5.js:375-403](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part5.js#L375-L403)

点读与notFetched。

<details>
<summary>查看原文（29行）</summary>

```text
      if (mode === "events") {
        if (!hasSeqs) {
          return { ok: false, reason: "mode:'events' 需要 seqs:[...]（从 mode:'index' 的结果里挑）" };
        }
        const r = readSessionPicked(session, args.seqs, {
          maxChars: Math.min(recallCap, Number(args?.maxChars) || recallCap),
          reasoning: args?.reasoning !== false,
        });
        if (r.ok !== true) return { ok: false, reason: r.reason };
        return {
          ok: true,
          mode: "events",
          picked: r.picked,
          returned: r.events.length,
          chars: r.chars,
          truncated: r.truncated === true,
          reasoning: r.reasoning,
          ...(r.skipped !== undefined ? { skipped: r.skipped } : {}),
          ...(r.truncated === true
            ? {
                hint:
                  "到字符闸门就停了（只返回了前面几条）。把剩下的 seq 分两批取，或传更小的 maxChars 以外的调整。",
                notFetched: (() => {
                  const got = new Set(r.events.map((e) => e.seq));
                  return [...new Set(args.seqs.map(Number))].filter((n) => !got.has(n)).sort((x, y) => x - y);
                })(),
              }
            : {}),
          events: r.events.map((e) => ({ seq: e.seq, type: e.type, text: e.text })),
```

</details>

**依据 4 · 源码核查**：[lib/part4.js:3042-3045](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part4.js#L3042-L3045)

暂存处理成本。

```text
  let staged;
  if (info.manifest?.autoGitAdd !== false && fs.existsSync(path.join(root, ".git"))) {
    const r = gitAdd(root, [relPath]);
    staged = r.ok ? true : r.stderr || r.error || "git add 失败";
```

#### 缺口

- 没有同任务人工台账/宿主记忆与插件的正确率、总usage和复原耗时对照。
  **影响**：不能量化长期记忆提升或省钱。
  **进一步探讨**：匿名跨会话任务固定事实表，比较错误/漏记/污染、恢复成功、模型usage与维护耗时。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 当前推荐什么，进一步探索什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

先观察。项目文件/卡片、两段seq回读、settings failclosed和内部原则grant有实际工程价值；但大范围自动注入/压缩/日志/暂存会改变工作流，原则grant未绑定目标/内容，压缩落盘有旁路，任意超cap事件无法整条回读。重要项目需要先在无敏感小型副本核这些边界，不能仅凭“只追加/逐字”宣传直接替代原件和备份。

可探讨“项目/内容/版本绑定的记忆收据”。每轮注入标材料hash/项目/来源与省略原因，原则授权绑定realroot/目标正文hash/预期版本；压缩前固化被压消息对象hash，旁路显式记录可恢复范围，超大事件提供分块读取/类型覆盖收据，Git暂存单独偏好和确认。目标是让记忆/授权/恢复可核，而不是用更多记忆推断更聪明。

假设未实现。最小对照包括双项目grant、错误台账修正、超cap单事件、紧急/手动压缩、文件成功审计失败与既有暂存内容；核跨域写/注入、恢复hash、审计缺口和index变更，再比较总任务成本。若收据开销吞掉选择收益，应缩小自动化范围。

#### 证据与依据

**依据 1 · 源码核查**：[lib/part2.js:430-451](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part2.js#L430-L451)

目标/内容授权方案基线。

<details>
<summary>查看原文（22行）</summary>

```text
      const answers = Array.isArray(result?.answers) ? result.answers : [];
      const first = answers[0] ?? {};
      const selected = Array.isArray(first.selected) ? first.selected : [];
      const picked = String(selected[0] ?? "");
      // ★ 判据只看"用户点的是不是授权那一条" —— 取不到就当**没授权**（宁可少开一次）。
      const authorized = picked.includes("授权") && !picked.includes("不授权");

      if (!authorized) {
        return {
          ok: true,
          authorized: false,
          reason: "用户没有授权（或没做出选择）⇒ 我**仍然没有**修改原则的路径，只能提议。",
        };
      }
      state.principleGrants.set(sid, { at: Date.now(), authorizedBy: "user-card", reason });
      return {
        ok: true,
        authorized: true,
        ttlMinutes: Math.round(PRINCIPLE_AUTH_TTL_MS / 60000),
        note:
          `★ 用户**已授权**：在 ${Math.round(PRINCIPLE_AUTH_TTL_MS / 60000)} 分钟内，` +
          `\`ledger_write({target:"principles", ...})\` 会成功；**改一次窗口就用掉**（要再改就再问一次）。` +
```

</details>

**依据 2 · 源码核查**：[lib/part1.js:1782-1821](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part1.js#L1782-L1821)

大事件回读方案基线。

<details>
<summary>查看原文（40行）</summary>

```text
export function readSessionRange(session, from, to, opts) {
  const a = Math.max(0, Number(from) || 0);
  const b = Math.max(a, Number(to) || 0);
  const maxChars = Math.max(200, Number(opts?.maxChars) || 24000);
  const withReasoning = opts?.reasoning !== false;
  if (typeof session?.eventAt !== "function") {
    return { ok: false, reason: "这个执行里没有可读的会话（session.eventAt 不存在）" };
  }
  const out = [];
  let chars = 0;
  let truncated = false;
  for (let seq = a; seq <= b; seq += 1) {
    let e;
    try {
      e = session.eventAt(seq);
    } catch {
      e = undefined;
    }
    if (e === undefined || e === null) continue;
    const text = eventTextOf(e, withReasoning);
    if (text === "") continue;
    const hit = text.length;
    if (chars + hit > maxChars) {
      // ★ 超闸门就**在事件边界截断**并如实标注 —— 绝不许悄悄截半个事件（那会失真）。
      truncated = true;
      break;
    }
    chars += hit;
    out.push({ seq, type: e.type, time: e.time, text });
  }
  return {
    ok: true,
    events: out,
    chars,
    from: a,
    to: b,
    truncated,
    reasoning: withReasoning,
  };
}
```

</details>

**依据 3 · 源码核查**：[lib/part3.js:1872-1884](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part3.js#L1872-L1884)

压缩旁路收据基线。

<details>
<summary>查看原文（13行）</summary>

```text
  if (isFull) {
    // ★★★ 紧急旁路（`FULL_COMPACT_URGENT_RATIO`）：水位逼近内核硬压线 ⇒ **不再等落盘**。
    //   ★ 理由见那个常量的注释：内核 0.8 自己会压一次，**那一次抓不到逐字胶囊**；
    //     在 78% 还等落盘 = 把机会让给内核 ⇒ 用户最在意的"逐字可回读"就没了。
    if (typeof opts?.ratio === "number" && opts.ratio >= FULL_COMPACT_URGENT_RATIO) {
      return {
        ok: true,
        why:
          `水位 ${Math.round(opts.ratio * 100)}% 已逼近内核硬压线（${Math.round(KERNEL_HARD_COMPACT_RATIO * 100)}%），` +
          "再等落盘会让**内核**先压（那一次抓不到逐字胶囊）⇒ 本次放行，如实标注：**这一轮没有先落盘**",
        forcedThrough: true,
        fullUrgent: true,
      };
```

</details>

**依据 4 · 源码核查**：[lib/part4.js:3036-3052](https://github.com/18477514055/dsh-ledger-memory/blob/7aa05c4557e010c8d6decb16e96b05de36e1196a/lib/part4.js#L3036-L3052)

多资产/Git收据基线。

<details>
<summary>查看原文（17行）</summary>

```text
    } catch {
      // 审计失败绝不影响台账写入本身。
      auditLine = undefined;
    }
  }

  let staged;
  if (info.manifest?.autoGitAdd !== false && fs.existsSync(path.join(root, ".git"))) {
    const r = gitAdd(root, [relPath]);
    staged = r.ok ? true : r.stderr || r.error || "git add 失败";
  }

  return {
    ok: true,
    target,
    mode,
    path: abs,
```

</details>

#### 缺口

- 版本/内容授权与记忆/压缩分块收据方案未实现。
  **影响**：不作为当前权限隔离或无损优势。
  **进一步探讨**：小异常矩阵先比较错误范围/恢复成功与额外存储/提示成本。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
