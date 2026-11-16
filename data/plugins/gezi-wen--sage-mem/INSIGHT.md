# sage-mem

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[2d2a25d](https://github.com/gezi-wen/sage-mem/tree/2d2a25dee813fd2b44970a78426fc9fb1c0e10ac)

<!-- BEGIN META -->
[![GitHub ★ 32](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=32&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/gezi-wen/sage-mem) [![npm 30d 15,067](https://img.shields.io/static/v1?label=npm+30d&message=15%2C067&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/sage-mem) [![最新发布 2026-11-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/sage-mem)
<!-- END META -->

> **功能**：为 DSH 提供本地 Markdown 跨会话记忆、检索注入与管理工具。

> **亮点**：把本地可审阅的 Markdown 记忆接到 DSH 提示组装，结合按摘要取材和文件版本回执，能减少在新会话重复挑选项目资料的操作。代码支持此接线，实际任务价值需对照。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：记忆版本守卫覆盖显式版本写入及宿主支持的工具事件，外部编辑仍可能竞争。自动整理可以读取历史并启动另一次模型调用，需要分别核对保存和出站。[Q03](#research-q03)

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
  - [Q01 · 它解决什么重复任务，文件式实现相对 DSH 原生能力和数据库记忆方案增加了什么？](#detail-section-11)
  - [Q02 · 记忆如何被检索、注入和主动访问？运行依赖和注入预算边界是什么？](#detail-section-12)
  - [Q03 · 写入冲突、保留文件与并发编辑如何处理，哪些风险仍未证明？](#detail-section-13)
  - [Q04 · 首次接入、持续治理和失败恢复成本如何评估？什么条件下值得采用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向每次新会话需要重新交代用户、项目或进展的 DSH 用户。项目将每条记忆存成可读、可编辑 Markdown，再按新问题挑选内容注入提示；相较每次手工找同一份项目笔记并贴入新会话，引入按问题挑选的本地记录。作者用数据库/worker作对照，但该对照是项目自述，不是独立比较；记忆质量仍取决于写入纪律和检索命中。

手工处理或宿主原生能力；没有同条件用户/效果验证，作者比较仅作为项目主张。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 主要用途 | 条件与边界 |
| --- | --- | --- |
| 提示召回 | 从 Markdown 挑选相关记录 | 候选受摘要与名额限制，可能漏召回 |
| 记忆写入与冲突提示 | 更新记录并显示 stale revision | 调用需携带版本，外部进程有竞争窗口 |
| 自动整理 | 用所选模型生成整理建议 | 默认关闭，须核对模型和记忆来源 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| DSH 与声明服务 | 加载宿主能力 | 固定支持范围待目标宿主验收 |
| 组件特定本地/远端依赖 | 见 [Q02](#research-q02) | 凭据/来源按 [Q03](#research-q03) 核验 |
| 用户配置与资源 | 启用实际场景 | 未配置则不可用或降级 |

| 阶段 | 操作 | 异常/退出 |
| --- | --- | --- |
| 首次 | 按 [Q04](#research-q04) 用隔离/最小配置 | 未确认权限/数据源时停止 |
| 持续 | 记录核心结果和人工核对 | 检查 stale/error/残留状态 |
| 退出 | 停用组件并核对副作用 | 按 [Q03](#research-q03) 回滚/清理 |

**效果与成本**

| 阶段 | 现金/资源 | 人工投入 | 未知 |
| --- | --- | --- | --- |
| 首次 | 依赖与配置，金额未知 | 安装/授权/核对 | 环境兼容未测 |
| 持续 | 运行资源/API，未计量 | 检查输出、更新 | 无同任务基线 |
| 恢复/退出 | 可能重试或清理 | 排障/核账 | 真实恢复未验证 |

| 效果项 | 当前源码可支持 | 未验证项 |
| --- | --- | --- |
| 组件任务 | 入口和机制如逐题所述 | 用户效果/质量未测 |
| 失败处理 | 固定源码有显式分支 | 真实宿主恢复未跑 |

> **思考**：记忆版本守卫覆盖显式版本写入及宿主支持的工具事件，外部编辑仍可能竞争。自动整理可以读取历史并启动另一次模型调用，需要分别核对保存和出站。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把本地可审阅的 Markdown 记忆接到 DSH 提示组装，结合按摘要取材和文件版本回执，能减少在新会话重复挑选项目资料的操作。代码支持此接线，实际任务价值需对照。[Q01](#research-q01) [Q02](#research-q02)

摘要打分与注入限额分两步执行；文件路径与版本在写入前分别核对。较新版本未必经过实际所用宿主的提示和文件意图接线。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

记忆版本守卫覆盖显式版本写入及宿主支持的工具事件，外部编辑仍可能竞争。自动整理可以读取历史并启动另一次模型调用，需要分别核对保存和出站。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

在测试配置关闭自动整理，建立一条虚构记录。核对关联与不关联问题的输出，再验证外部编辑后重载和版本冲突回执。遇到旧记忆误引时停用并保留可读的项目文档。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定提交支持入口和核心机制的源码判断；目标宿主、外部服务、用户效果与全周期成本未在本轮运行验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/memory/retrieval.js、lib/tools/memory-tools.js、package.json、lib/memory/write-protocol.js、lib/memory/write-gate.js、lib/recall/injector.js、lib/autodream/config.js、lib/autodream/gate.js、lib/autodream/engine.js、lib/autodream/llm-loop.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 gezi-wen/sage-mem (root) 的固定提交、README/manifest、入口和直接调用的关键模块；未安装或执行目标插件、宿主、浏览器、模型/API或第三方服务。
- 下一步：用相同任务比较贴项目笔记与自动注入，分别记录命中、任务通过、预算和冲突恢复时间。

**分析版本**

- **仓库**：[gezi-wen/sage-mem](https://github.com/gezi-wen/sage-mem)
- **版本号**：2.10.2（[固定提交 2d2a25d](https://github.com/gezi-wen/sage-mem/tree/2d2a25dee813fd2b44970a78426fc9fb1c0e10ac)）
- **版本日期**：2026-11-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在注入时显示约定适用范围和修订号可能帮助区分历史记忆与当前规则。用相关、无关与修订后的任务对照误召回及人工核对时间。[Q04](#research-q04)

用相同任务比较贴项目笔记与自动注入，分别记录命中、任务通过、预算和冲突恢复时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 12 | 3808 | 2894 | 711 | — |
| .md | source | 22 | 11076 | — | — | 219778 |
| .js | source | 93 | 36840 | 25206 | 10003 | — |
| .cjs | source | 2 | 309 | 217 | 69 | — |
| .mjs | test | 99 | 28967 | 22822 | 3989 | — |
| .md | test | 39 | 1507 | — | — | 21895 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/gezi-wen/sage-mem/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=6&color=737b86&logo=github)](https://github.com/gezi-wen/sage-mem/issues?q=is%3Aissue+created%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z) [![近30天关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/gezi-wen/sage-mem/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z)



统计日期：2026-11-16。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：本地 Markdown 记忆是否能在 DSH 新会话中提供可控召回，并以可审查的写入保护抵消记忆噪音与状态风险？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它解决什么重复任务，文件式实现相对 DSH 原生能力和数据库记忆方案增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向每次新会话需要重新交代用户、项目或进展的 DSH 用户。项目将每条记忆存成可读、可编辑 Markdown，再按新问题挑选内容注入提示；相较每次手工找同一份项目笔记并贴入新会话，引入按问题挑选的本地记录。作者用数据库/worker作对照，但该对照是项目自述，不是独立比较；记忆质量仍取决于写入纪律和检索命中。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:49-80](https://github.com/gezi-wen/sage-mem/blob/2d2a25dee813fd2b44970a78426fc9fb1c0e10ac/README.md#L49-L80)

作者说明新会话上下文断裂、Markdown 存储和自动注入/工具。

<details>
<summary>查看原文（32行）</summary>

```text
## 这是什么

DSH 原生没有记忆系统。每开一个新会话都是一张白纸：不记得你是谁、不记得昨天做到哪、不记得项目进行到哪一步，于是你每次都要重新交代一遍。

sage-mem 补上这一层，做法是：**把该记住的事写成一张张卡片，存在你自己电脑上**。在 DSH 把问题交给模型之前，插件按问题挑出最相关的几张、**贴在模型眼前**。

所以准确的说法不是「模型记得你」，而是「**在它开口之前，有人把相关的纸条递进了它手里**」。撤走纸条，它又是那个失忆的同事。

记忆的形态是一条记忆一个 `.md` 文件（YAML frontmatter + 正文）：用编辑器就能打开、能改、能删，也能直接拿 git 管。**这份记忆始终在你自己手里，不在某个数据库里。**

## 为什么是文件，不是数据库

大多数记忆方案走「SQLite + 常驻 worker」：记忆写进数据库就**不透明**（想看看存了什么得去查表），事件全捕获又会让库**膨胀**（「用户打了个招呼」也算一条），还要额外养一个进程和一个端口。

| | 文件式（sage-mem） | 数据库 + worker |
|---|---|---|
| 看一眼存了什么 | 打开目录 | 查表 / 写脚本 |
| 手工改一条 | 编辑器直接改 | 走 API 或 SQL |
| 迁移 / 备份 | 拷目录（能跟 git 走） | 导出工具 |
| 额外进程与端口 | 无 | 通常有 |
| 存不存谁决定 | 由 agent 按规则判断 | 常见做法是无差别全捕获 |

## 核心特性

| 特性 | 说明 |
|---|---|
| **文件式存储** | 每条记忆一个 `.md`：frontmatter 存元数据，正文存内容。无数据库、无隐藏格式 |
| **自动注入** | 每条新问题都会重新扫一遍记忆目录，按这条问题挑出最相关的几条，在模型开口之前拼进上下文 —— 不用模型自己去翻文件 |
| **模型也能自己查** | 另给模型三个工具（`search_memory` / `read_memory`，以及会写盘的 `trim_memory`），它可以主动翻记忆、按行读原文、把已经过时的一节裁去归档 |
| **写入不被覆盖** | 你正在编辑、模型同时在改的时候，后写的不会静默盖掉先写的；冲突留成待处理记录，由你决定保留哪边 |
| **零额外服务** | 无 worker、无 SQLite、无端口、无常驻进程，不需要额外的 API key 或云服务（运行时唯一的依赖是普通 npm 库 `zod`） |
| **防膨胀** | 靠规则引导模型判断「值不值得存」：无实质内容的不存，靠读代码 / git 能推出来的不存；已经长大的那几条按 16 KB / 40 KB 两条线提醒与处置（见[体积治理](#体积治理超线了怎么办)） |
```

</details>

**依据 2 · 源码核查**：[lib/index.js:83-90](https://github.com/gezi-wen/sage-mem/blob/2d2a25dee813fd2b44970a78426fc9fb1c0e10ac/lib/index.js#L83-L90)

宿主监听 system-prompt/assemble 并安装 recall injector。

```text
    // 会话级注入状态：一处持有、一处提交（见 lib/recall/state.js 的头注）。
    const injectState = createSessionInjectState()

    // 按问题检索注入：system-prompt/assemble 是异步 waterfall，监听器可 await。
    // 编排骨架在 lib/recall/injector.js，选材 / 渲染 / 预算三段是纯函数；行为由
    // test/recall-golden-test.mjs 的 11 个场景逐字节守着。
    ctx.on('system-prompt/assemble', createRecallInjector({ ctx, state: injectState, tools }))
  }
```

#### 缺口

- 没有真实用户任务频次、召回质量或与手工笔记/其他记忆方案的对照。
  **影响**：影响是否值得迁移
  **进一步探讨**：用固定项目任务记录重述次数、命中/漏召回和修改时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 记忆如何被检索、注入和主动访问？运行依赖和注入预算边界是什么？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

宿主在 system-prompt/assemble 等下游组装结果后进入召回；没有会话或被去重时直接沿用原提示。扫描读取本地目录，摘要面用 description、aliases 与文件名建立词元匹配和排序。证据门槛依语料的最大 IDF 归一，小库或关掉 gate 时跳过这道门。排序后才按名额截取；可选 MMR 仅在候选超过名额时参与。过时条目和分词遗漏会误导或漏召回，要用能对应具体记录的会话验证。主动工具另走同一记忆目录的搜索与阅读路径。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:86-90](https://github.com/gezi-wen/sage-mem/blob/2d2a25dee813fd2b44970a78426fc9fb1c0e10ac/lib/index.js#L86-L90)

system prompt 组装事件连接异步 recall 注入。

```text
    // 按问题检索注入：system-prompt/assemble 是异步 waterfall，监听器可 await。
    // 编排骨架在 lib/recall/injector.js，选材 / 渲染 / 预算三段是纯函数；行为由
    // test/recall-golden-test.mjs 的 11 个场景逐字节守着。
    ctx.on('system-prompt/assemble', createRecallInjector({ ctx, state: injectState, tools }))
  }
```

**依据 2 · 源码核查**：[lib/memory/retrieval.js:102-131](https://github.com/gezi-wen/sage-mem/blob/2d2a25dee813fd2b44970a78426fc9fb1c0e10ac/lib/memory/retrieval.js#L102-L131)

摘要候选打分和按语料 IDF 归一的证据门槛。

<details>
<summary>查看原文（30行）</summary>

```text
export function rankSummaries(query, files, opts = {}) {
  const list = Array.isArray(files) ? files : []
  const hay = list.map(summaryHay)
  const entries = list.map((f, i) => ({ f, i, score: score(query, hay[i]) }))
  const hit = entries.filter(e => e.score > 0).sort((a, b) => b.score - a.score)
  const keep = (arr) => arr.map(e => ({ ...e.f, score: e.score }))
  if (opts.gate === false || hit.length === 0) return keep(hit)
  // 语料太小就别用 IDF 判（见 MIN_GATE_CORPUS）。
  if (list.length < MIN_GATE_CORPUS) return keep(hit)

  const terms = queryTermsOf(query)
  if (!terms.length) return keep(hit)
  // 语料统计建在**全部文件**的摘要面上，不是只建在命中的那些上：IDF 的分母是
  // 「多少份记忆的摘要里有这个词元」，只拿命中集去算会把稀有词元算成随处可见。
  const tokens = hay.map(tokenize)
  const stats = buildStats(tokens.map(t => ({ tokens: t })))
  const tf = tokens.map(termFreq)
  const minRatio = Number.isFinite(opts.minRatio) ? opts.minRatio : MIN_SUMMARY_EVIDENCE_RATIO
  // **按语料自身的 IDF 尺度归一**，而不是用一个绝对量。
  //
  // 绝对量的教训（三次踩同一个坑，记下来免得第四次）：`idf` 随语料规模对数增长，
  // 所以「sum >= 1.5」在百份量级的目录里等于「命中一个约四分之一文件都有的词元就放行」——
  // 实测一个 `怎么`（df=14，idf=1.93）单靠自己就有 sum=2.01，整批 14 份候选全部通过，
  // 门槛退化成没有。而在 2 份的小目录里 `idf(df=1)` 只有 0.69，同一批真命中又全被杀。
  // 归一之后同一套阈值在两个量级上都成立。
  //
  // 分母取 `idfOf(1, N)` = 「全库独一份的词元能提供的最大权重」，也就是这套语料里
  // 单个词元的证据上限。
  const maxIdf = idfOf(1, list.length) || 1
  return keep(hit.filter(e => evidence(terms, tf[e.i], stats).sum >= minRatio * maxIdf))
```

</details>

**依据 3 · 源码核查**：[lib/memory/retrieval.js:153-162](https://github.com/gezi-wen/sage-mem/blob/2d2a25dee813fd2b44970a78426fc9fb1c0e10ac/lib/memory/retrieval.js#L153-L162)

对候选施加名额并可选 MMR 去重。

<details>
<summary>查看原文（10行）</summary>

```text
export function selectRelevant(query, files, opts = {}) {
  const k = Number.isFinite(opts.maxResults) ? Math.max(1, Math.floor(opts.maxResults)) : MAX_RESULTS
  const ranked = rankSummaries(query, files, opts)
  const lambda = Number(opts.mmr)
  // 未启用 / 候选不够名额：走老路。这里先判一次，免得为一次注定原样返回的调用去算词集。
  if (!(lambda > 0) || ranked.length <= k) return ranked.slice(0, k)
  // 用「包装对象」承载 score/terms，再把原对象映射回去 —— 不往文件对象上挂字段，
  // 免得调试视图/序列化里多出一个 Set。
  const items = ranked.map(f => ({ score: f.score, terms: bigrams(summaryHay(f)), ref: f }))
  return mmrSelect(items, { k, lambda }).map(it => it.ref)
```

</details>

**依据 4 · 源码核查**：[lib/tools/memory-tools.js:187-230](https://github.com/gezi-wen/sage-mem/blob/2d2a25dee813fd2b44970a78426fc9fb1c0e10ac/lib/tools/memory-tools.js#L187-L230)

主动检索工具从记忆文件读数据并返回结果。

<details>
<summary>查看原文（44行）</summary>

```text
export function createMemoryTools(ctx) {
  const searchMemory = {
    name: 'search_memory',
    description:
      '在本地记忆库（markdown 文件）里检索历史记忆。先用一句话摘要匹配、再按段落查正文，返回候选与命中片段。' +
      '当你需要依据既往决定、用户偏好、或继续未完成的任务，而当前上下文里没有可定位的依据时用它。' +
      'scope 选 summary 只比摘要（最省）、body 只查正文段落、all 两者都查（默认）。' +
      '结果里带 file 与行号，可直接用 read_memory 读那一段。' +
      '已标失效（invalid_at）的记忆**仍然会被搜到**，结果里会带 invalidAt / supersededBy —— 那是历史口径，不是现状。',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: '检索词或问题原文（自然语言即可）' },
        scope: { type: 'string', enum: ['summary', 'body', 'all'], description: '检索面，默认 all' },
        limit: { type: 'integer', minimum: 1, maximum: MAX_LIMIT, description: `最多返回几条候选，默认 ${DEFAULT_LIMIT}` },
        cursor: { type: 'integer', minimum: 0, description: '翻页游标：用上一次返回的 nextCursor' },
      },
      required: ['query'],
      additionalProperties: false,
    },
    output: { schema: { type: 'object' }, render: renderSearchResult },
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      const query = String(args?.query ?? '').trim()
      if (!query) return { ok: false, error: 'query 不能为空' }
      try {
        /**
         * 用 Detailed 入口（外部审查 2026-10-31，Q14）：目录级失败（ENOTDIR / EACCES…）
         * 以前被 `scanMemoryDir` 降级成空数组，工具照样回 `ok:true` + `complete:true`，
         * 「读不了记忆」就被渲染成「记忆里没有」。现在把「检索不可用」单独带出去。
         */
        const scan = await scanMemoryFilesDetailed(ctx, exec?.agent?.id ?? '')
        if (scan.complete === false) {
          const detail = (scan.errors ?? []).map((e) => `${e.code ? `${e.code}: ` : ''}${e.message}`).join('；') || '目录读取失败'
          return {
            ok: false,
            code: 'memory_unavailable',
            error: `记忆目录读不了（${detail}）。这是「检索不可用」，不代表记忆里没有匹配项 —— 换个时间重试，或检查记忆目录是否存在、是否是个目录。`,
            coverage: { searched: 0, complete: false, errors: scan.errors ?? [] },
          }
        }
        const files = scan.files
        const result = retrieve({ query, files, scope: args?.scope, limit: args?.limit, cursor: args?.cursor })
        // 2.0.0：把每条命中对应的失效信息带出去（D29 Q3）。检索本身**不过滤**失效记忆 ——
```

</details>

**依据 5 · 源码核查**：[package.json:27-72](https://github.com/gezi-wen/sage-mem/blob/2d2a25dee813fd2b44970a78426fc9fb1c0e10ac/package.json#L27-L72)

声明 Node/DSH 兼容和运行依赖。

<details>
<summary>查看原文（46行）</summary>

```text
  "engines": {
    "node": ">=18",
    "dsh": ">=0.1.2-rc.1"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-locale"
      ]
    },
    "compatibility": {
      "dsh": ">=0.1.2-rc.1",
      "dshReleases": {
        "0.1.2-rc.1": "compatible",
        "0.1.3-alpha.1": "compatible",
        "0.1.3-alpha.2": "compatible",
        "0.1.5-rc.1": "compatible",
        "0.1.6-alpha.1": "compatible",
        "0.1.6-alpha.2": "compatible",
        "0.1.7-rc.1": "compatible",
        "0.1.7-rc.2": "compatible",
        "0.2.0-rc.1": "compatible",
        "0.2.0-rc.2": "compatible",
        "0.2.1-rc.1": "compatible",
        "0.2.1-rc.3": "compatible",
        "0.2.1-rc.4": "compatible",
        "0.2.1-rc.5": "compatible"
      }
    }
  },
  "dependencies": {
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "react": "^18.0.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.2",
    "@deepseek-ai/dsh-typert-protocol": ">=0.1.2-rc.1",
    "@deepseek-ai/dsh-client-locale": ">=0.1.2-rc.1",
    "@deepseek-ai/dsh-skill-filesystem": "*",
    "react": "^18.0.0"
```

</details>

**依据 6 · 源码核查**：[lib/recall/injector.js:121-183](https://github.com/gezi-wen/sage-mem/blob/2d2a25dee813fd2b44970a78426fc9fb1c0e10ac/lib/recall/injector.js#L121-L183)

实际组装会话、目录扫描与重复指纹短路。

<details>
<summary>查看原文（63行）</summary>

```text
  return async function recallInjection(assembly, context, next) {
    const assembled = await next()
    // session id 在 try 外先取好：catch 里也要能带上它（拿到什么带什么）。
    const sessionId = context?.agent?.session?.id ?? ''
    try {
      const agent = context?.agent
      const session = agent?.session
      if (!session) return assembled
      // DSH 0.1.7 起 Session 的历史读取接口在陆续调整（snapshotEvents / eventAt /
      // ownEvents 已弃用）。deriveMessages 在 0.1.7-rc.1 实测仍在且仍同步，但这三行
      // 不是白写的：方法一旦被改名或改成异步，老写法要么静默不注入、要么把 Promise
      // 当数组展开成空。宁可日志里响一声，也不要"记忆不注入但日志一字没有"。
      if (typeof session.deriveMessages !== 'function') {
        warnLog(ctx, 'session.deriveMessages() 不可用 —— 记忆召回已跳过（DSH session API 变了？）', sessionId)
        return assembled
      }
      const derived = session.deriveMessages()
      const messages = [...(derived && typeof derived.then === 'function' ? await derived : derived)]

      // 关键：DSH 0.1.5 把工具结果（source.kind === 'tool'）和注入内容
      // （source.kind === 'plugin'）也存成 role: 'user' 的消息。只按 role 取
      // 「最后一条」会取到 tool-result，extractText 得到空串，下面的长度检查
      // 直接返回——表现就是全程静默不注入。只有 source.kind === 'user' 是真人输入。
      const userMessages = messages.filter(m => m?.role === 'user' && m?.source?.kind === 'user')
      const text = extractText(userMessages[userMessages.length - 1]?.content)

      // ── 代次：**先处理状态转换，再算正文与控制提示** ──
      // `begin()` 会把「这一次观测到的消息条数」立刻落进状态（Q08）——去重 / 零命中 /
      // 预算拒绝的轮次不会走到 commit，若不在这里落账，下一次 begin 就还拿旧基数比，
      // 压缩就永远判不出来。条数下降时它同时把签名、两本账、卡签名、baseline 标记归零。
      const ledgerKey = session.id || 'no-session-id'
      const st = state.begin(ledgerKey, messages.length)

      // 扫描本身很便宜（命中缓存时只做一次 readdir 比文件名集合，1000 份实测 0.7 ms），
      // 贵的是它后面的打分：逐份切段 + BM25。闸门因此放在扫描之后、检索之前。
      const scanned = await scanMemoryFilesDetailed(ctx, sessionId)
      const files = scanned.files

      // ── 短路闸门（2.4.3）──
      // 「问题没变、目录没变、baseline 该发的发了、冲突队列没动」同时成立时，这一步算出来的
      // 候选必然与上一步逐条相同，`selectRecall` 的签名比对也必然判去重 —— 判据已经齐了，
      // 就先判，把打分整段跳过。一个带 10 次工具调用的回合里，有 9 步走这条路。
      //
      // 三条不许短路的硬条件，缺一不可：
      //   1. `scanned.cached === true` —— 这次是**缓存命中**，说明目录名集合没变、watcher 代次也没动
      //      （代次是「只改内容、不改名」的唯一失效信号），正文与上一步逐字相同，指纹才可信。
      //      `cached !== true` 说明这次是真扫了盘 —— 内容刚被改过，而指纹里只有文件名，判不出来；
      //   2. `!st.generationChanged` —— 刚判出上下文被压缩，账本刚归零，必须重算；
      //   3. `gate !== null` —— 冲突队列读不到（`conflictsFingerprint` 返回 null）时放弃，
      //      宁可多算一遍，也不要把「看不见」当成「没变」。
      const conflicts = await conflictsFingerprint({ stateRoot: STATE_ROOT })
      const gate = conflicts === null
        ? null
        : gateFingerprint({ text, namesKey: scanned.namesKey, baselineDone: st.baselineDone, conflicts })
      if (gate !== null && scanned.cached === true && !st.generationChanged && st.gate === gate) {
        // 账照记：面板上「这一步为什么什么都没给」与「这一步根本不算」是两件事，
        // 靠 `gated: true` 分开（两者的 outcome 都是 empty）。
        if (debugEnabled()) {
          const payload = gatedDebugPayload({ nowMs: Date.now(), sessionId, text, scanned, st })
          debugRecall(payload)
          recordInjection(payload)
        }
        return assembled
```

</details>

**依据 7 · 源码核查**：[lib/recall/injector.js:315-371](https://github.com/gezi-wen/sage-mem/blob/2d2a25dee813fd2b44970a78426fc9fb1c0e10ac/lib/recall/injector.js#L315-L371)

没有改变时返回原组装结果，有内容才附加提示。

<details>
<summary>查看原文（57行）</summary>

```text
        emitDebug(makeDebug('empty'))
        return assembled
      }

      // 投递账一次写回：签名、两本账、卡签名、缺口卡、baseline 标记，以及
      // **delivered 条数**（`messageCount`）。放在这里（而不是更早）是刻意的 ——
      // 上面每一步都可能没真注进去东西，那就不该让投递账前进；一次失败把一条记忆永久
      // 挡在门外是最难查的一种。压缩判据用的**观测账**在 `begin()` 里已经落过了（Q08）。
      state.commit(ledgerKey, {
        signature,
        contentBytes,
        cardBytes: status.cardBytes,
        cardSig: status.cardSig,
        gapCard: cardBody,
        messageCount: messages.length,
        baselineDone: st.baselineDone || baselineTaken > 0,
        // 闸门与签名同一条纪律：**没投递出去就不前进**。上面任何一步空手而归都会提前
        // return，走不到这里 —— 于是一次目录抖动不会把这一步的记忆关在门外。
        gate,
      })

      emitDebug(makeDebug(parts.length > 0 ? 'injected' : 'card-only'))

      const recallText = composeRecallText({
        parts,
        cardPart,
        memoryDir: MEMORY_DIR,
        discipline: RECALL_DISCIPLINE,
        // 2.3.0：上限**现读**（模块级常量就是本次启动生效的值 —— 改了设置要重启，
        // 这一点设置页会提示）。随包技能因此不必写死任何数字。
        limits: {
          maxResults: MAX_RESULTS,
          maxChars: MAX_CHARS_PER_FILE,
          maxSessionBytes: MAX_SESSION_BYTES,
          maxFileBytes: MAX_FILE_BYTES,
        },
      })

      // ⚠️ `interpolate: false` 不是可选项，是**安全边界**（2026-11-07 真实事故）。
      // 记忆正文是用户写的 Markdown，不是提示词模板。宿主默认会对每个 context 做
      // `{{变量}}` 解析：正文里只要出现过一双大括号（`{{ }}`、`{{foo_bar}}`、`{{#if x}}`
      // 都算），解析就在**模型还没开跑**时抛错，整轮对话直接失败，报错还是
      // `malformed prompt variable reference … in context "sage-mem:recall"` ——
      // 用户既不知道自己写了什么触发它，也改不动插件。关掉解析是这个问题的唯一解，
      // 而正文本来就该逐字呈现（段落命中、行号、引用纪律全靠字面文本）。
      return {
        ...assembled,
        contexts: [...(assembled.contexts ?? []), {
          name: 'sage-mem:recall',
          order: 1000,
          text: recallText,
          interpolate: false,
        }],
      }
    } catch (err) {
      // 这是整条注入链的外壳。裸吞的代价就是 :174-193 记的那个坑：权限错、编码坏、
      // frontmatter 正则哪天不匹配，表现都是「插件在、但记忆不再注入」，日志一字没有。
```

</details>

#### 缺口

- 本轮没有用真实记忆库运行召回或测 prompt token/漏召回。
  **影响**：无法判断实际噪音和上下文成本
  **进一步探讨**：以脱敏库回放历史问题并逐条标记相关性。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 写入冲突、保留文件与并发编辑如何处理，哪些风险仍未证明？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

写入先核对安全名称和保留文件，随后采用带版本的写入协议。创建碰到已存在目标会回 already_exists；修改时文件删掉、不可读或字节 SHA-256 不等都会回 stale_revision，内容保持原样；旧调用方没传版本仍可覆盖但记录警告。原子替换避免半写可见，外部进程在校验与落盘之间修改仍可能被覆盖。宿主文件意图监听只给 write/edit 路径提供写入意图或版本守卫，不能作为拒绝策略；作者报告插件自身直接调用宿主写入不经该事件。

可选的自动整理需要另一条数据流。默认关闭自动整理，来源只含记忆，直接改写关闭；自动触发还检查退避、时间和会话数量。它可选择读取会话，并用所选 DSH 模型路由运行整理循环。只读模式约束文件操作，模型调用本身仍可能出站。启用改写前快照不完整会退出，但真实回滚、宿主事件覆盖和远端保留未验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:157-180](https://github.com/gezi-wen/sage-mem/blob/2d2a25dee813fd2b44970a78426fc9fb1c0e10ac/lib/index.js#L157-L180)

写入前检查安全名称/保留项，删除保护不可逆文件。

<details>
<summary>查看原文（24行）</summary>

```text
  async writeFile(name, content, opts) {
    // 三道闸（保留名 / 名字合法 / 影子文件）在 prepareWrite 里，顺序与另外两个写入口一致。
    const pre = await prepareWrite({
      name, content, limitBytes: MAX_FILE_BYTES,
      isReserved, nameKey, safeName,
      shadowCheck: (full) => shadowsReserved(full),
      dir: MEMORY_DIR,
      inspectEntry: inspectMemoryEntry,
    })
    if (!pre.ok) return pre
    return await writeSnapshot(pre.target, content, pre.gate, opts, { ctx: this.ctx, name: pre.safe, kind: "writeFile" })
  }

  /** 删除单个记忆文件：保留名一律拒绝（unlink 不可逆）。判定同 writeFile。 */
  async deleteFile(name) {
    if (isReserved(name)) {
      return { ok: false, error: `sage-mem: reserved file, refusing to delete: ${nameKey(name)}` }
    }
    const safe = safeName(name)
    if (!safe) return { ok: false, code: 'invalid_name', error: 'sage-mem: invalid file name' }
    // 同 writeFile：8.3 短名能绕过名字文本判据，删除保护也必须看文件身份。
    if (await shadowsReserved(join(MEMORY_DIR, safe))) {
      return { ok: false, error: `sage-mem: reserved file (它的另一个名字是 ${safe})，拒绝删除` }
    }
```

</details>

**依据 2 · 源码核查**：[lib/memory/write-protocol.js:1-22](https://github.com/gezi-wen/sage-mem/blob/2d2a25dee813fd2b44970a78426fc9fb1c0e10ac/lib/memory/write-protocol.js#L1-L22)

说明原子替换与版本并发检查的边界。

<details>
<summary>查看原文（22行）</summary>

```text
/**
 * sage-mem 记忆层 —— 写协议：**读快照带 revision、整份覆盖带守卫**（2.1.2 / 外部审查 Q02）。
 *
 * 问题：原来的 `readFile` 只交正文、不交「这份正文是哪一版」；`writeFile` / `writeArchived` /
 * `writeRaw` 只管原子替换（不暴露半截内容），**不保证没有别的更新** —— 面板读 A、别处存 B、
 * 面板再把基于 A 的 C 存回去，B 就没了，而两边都报成功。
 *
 * 契约（additive，旧调用方不受影响）：
 *   · 读：结果多一个 `revision`（正文**字节**的 sha256）；
 *   · 写：可选 `opts.expectedRevision`；对不上 → `{ok:false, code:'stale_revision'}`，
 *     当前内容一个字节不动；调用方拿新 revision 重读、比较、重新应用。
 *   · 写：可选 `opts.create`（createIfAbsent）—— 新建撞名一律 `{ok:false, code:'already_exists'}`，
 *     **绝不**走覆盖入口；
 *   · 不传 `opts` 的旧调用方照旧覆盖，但会落一条 warn（静默无守卫覆盖不再允许）。
 *   · 2.10.1：**成功**回执可能多一个 `softLimit: {bytes, level}`（越过软线时；线在 2.10.2 起是 16 KB / 40 KB）。
 *     只提醒、绝不拒写；判据在 `memory/size-policy.js`，这里不写阈值。
 *
 * 为什么单列一个模块而不是长在 `lib/index.js`：组合根有 ≤1000 行的结构守卫
 * （`test/structure-test.mjs`），而「读版本 → 比版本 → 写」这段顺序是**协议**不是组合根的接线。
 *
 * ⚠️ 边界：这是**内容 hash 守卫**，不是跨进程锁。校验与落盘之间仍有一个极窄窗口
 * （外部编辑器恰在此刻改文件仍会被覆盖）；进程内并发由 `createWriteQueue` 那一层负责，
```

</details>

**依据 3 · 源码核查**：[lib/memory/write-protocol.js:198-244](https://github.com/gezi-wen/sage-mem/blob/2d2a25dee813fd2b44970a78426fc9fb1c0e10ac/lib/memory/write-protocol.js#L198-L244)

写协议处理 create/版本冲突和原子替换。

<details>
<summary>查看原文（47行）</summary>

```text
export async function writeSnapshot(target, content, gate, opts, meta) {
  const o = opts && typeof opts === 'object' ? opts : {}
  const name = meta?.name ?? ''
  const rejected = (code, error) => ({ ok: false, code, file: name, error })

  // ① createIfAbsent：新建只能「建出来」或「明确报已存在」，没有第三条路。
  if (o.create === true) {
    if (gate?.ok) return rejected(ERR_ALREADY_EXISTS, `sage-mem: ${name} 已经存在，新建不会覆盖它（要改正文请打开它）`)
    try {
      // 2.1.10（Q10）：createIfAbsent 也负责「全新安装、父目录还不存在」这一种：
      // writeFileExclusive 的临时文件落在同一目录，目录不在就会 ENOENT（审查实测）。
      // 只建父目录、绝不动目标文件 —— 「建立索引骨架」这个意图由调用方一次说清。
      await mkdir(dirname(target), { recursive: true })
      await writeFileExclusive(target, content)
    } catch (err) {
      if (err?.code === 'EEXIST') return rejected(ERR_ALREADY_EXISTS, `sage-mem: ${name} 刚刚被别的写入建出来了，新建没有覆盖它`)
      return rejected('io_error', `sage-mem: 写入 ${name} 失败：${String(err?.message ?? err)}`)
    }
    return { ok: true, file: name, revision: revisionOf(Buffer.from(content, 'utf8')), created: true }
  }

  // ② 带 expectedRevision：盘上版本与调用方读到的不一致 → 拒绝，内容一个字节不动。
  if (o.expectedRevision !== undefined && o.expectedRevision !== null) {
    if (!gate?.ok) {
      // 读快照时还在、现在没了：这同样是「版本已变」，不能悄悄当成新建写回去。
      return rejected(ERR_STALE_REVISION, `sage-mem: ${name} 已经不在盘上了（读取之后被删除或改名），没有写入`)
    }
    let current
    try {
      current = revisionOf(await readVerified(target, gate, false))
    } catch (err) {
      return rejected(ERR_STALE_REVISION, `sage-mem: 读不到 ${name} 的当前版本（${err?.code ?? err}），没有写入`)
    }
    if (current !== o.expectedRevision) {
      // 错误正文是给用户看的：草稿还在、下一步该做什么，都要说清楚（界面直接显示它）。
      return rejected(
        ERR_STALE_REVISION,
        `sage-mem: ${name} 在你保存之前已经被别的写入改过（当前版本 ${current.slice(0, 12)}…）。你的草稿还在，请先查看最新内容再决定如何重新应用 —— 没有自动覆盖`,
      )
    }
  } else {
    // ③ 旧调用方：additive 契约允许继续工作，但必须留痕（否则「静默覆盖」永远查不出来）。
    warnLog(meta?.ctx, `${meta?.kind ?? 'write'}(${name}) ${LEGACY_WARN}`)
  }

  try {
    await writeFileAtomic(target, content)
```

</details>

**依据 4 · 源码核查**：[lib/memory/write-gate.js:6-27](https://github.com/gezi-wen/sage-mem/blob/2d2a25dee813fd2b44970a78426fc9fb1c0e10ac/lib/memory/write-gate.js#L6-L27)

描述宿主文件写意图门及其事件边界。

<details>
<summary>查看原文（22行）</summary>

```text
 * 宿主的 `fs/write-intent` / `fs/edit-intent` 会**在写入之前**问插件一次：「这次写入按什么
 * 意图做」。没有插件回答时，一次「读-改-写」之间只要有人插进来写过，后写的那个就**静默**
 * 把前一个覆盖掉 —— 谁也不报错，谁也不知情。
 *
 * 本模块的回答是：目标在记忆目录内、且我们已经知道它的当前版本时，把这次写入钉在
 * `replaceIfVersion(当前版本)` 上。于是并发写入不再互踩，而是由宿主报出 `FS_STALE_VERSION`，
 * 交给上层（冲突队列 / 人）决定怎么办。
 *
 * ## ⚠️ 两个事件都**没有「拒绝」这个动作**
 *
 * 它们是**单槽意图决策**：只能决定写入**意图**（`createIfAbsent` / `replaceIfVersion`）或编辑
 * **守卫**（`{version}`），不能阻止写入。所以这里**没有 deny、没有 null、没有抛错**——
 * 只有「给意图」「给守卫」和「不管」（返回 `undefined`）。唯一的失败信号是宿主自己报的
 * `FS_STALE_VERSION`，我们只需保证它报得出来。
 *
 * ## ⚠️ 这个事件只覆盖「工具发起的写入」（真实 headless 宿主实测）
 *
 * 宿主对这两个事件的派发范围比直觉窄：
 *
 * - **模型调内置 `write` / `edit`** 时派发（实测 `fs/write-intent = 1`：模型用 `write` 写了一个
 *   临时文件；监听器不需要声明 `inject` 也能收到，与 sage-mem 主插件的处境一致）。
 * - **插件自己调 `ctx.fs.writeText` / `editText` 时一次都不派发**（实测 0）。所以 autodream
```

</details>

**依据 5 · 源码核查**：[lib/autodream/config.js:11-21](https://github.com/gezi-wen/sage-mem/blob/2d2a25dee813fd2b44970a78426fc9fb1c0e10ac/lib/autodream/config.js#L11-L21)

默认关闭自动整理和改写，来源为记忆目录。

<details>
<summary>查看原文（11行）</summary>

```text
/** 默认配置。每一项都能从设置面板改；空 provider/model 表示跟聊天页当前默认模型。 */
export const DEFAULT_CONFIG = {
  enabled: false,
  trigger: 'manual',
  apply: false,
  source: 'memory',
  minHours: 24,
  minSessions: 5,
  provider: '',
  model: '',
  maxSteps: 24,
```

</details>

**依据 6 · 源码核查**：[lib/autodream/gate.js:18-47](https://github.com/gezi-wen/sage-mem/blob/2d2a25dee813fd2b44970a78426fc9fb1c0e10ac/lib/autodream/gate.js#L18-L47)

自动触发需通过设置、时间、扫描节流与会话量。

<details>
<summary>查看原文（30行）</summary>

```text
export async function gate() {
  await this.load()
  const cfg = this.state.config
  if (!cfg.enabled) return { ok: false, reason: '未启用' }
  if (cfg.trigger !== 'auto') return { ok: false, reason: '手动模式（不会自动触发）' }

  const now = Date.now()
  if (this.state.retryAfter && now < this.state.retryAfter) {
    return { ok: false, reason: `上次失败后的退避中（还有 ${Math.ceil((this.state.retryAfter - now) / 60000)} 分钟）` }
  }

  // ① 时间门
  const lastAt = this.state.lastRunAt
  const hoursSince = lastAt ? (now - lastAt) / 3600000 : Number.POSITIVE_INFINITY
  if (hoursSince < cfg.minHours) {
    return { ok: false, reason: `距上次整理 ${hoursSince.toFixed(1)}h < ${cfg.minHours}h` }
  }

  // ② 扫描节流（在真正扫盘之前）
  if (now - this.lastScanAt < SESSION_SCAN_INTERVAL_MS) {
    return { ok: false, reason: `扫描节流中（${Math.round((now - this.lastScanAt) / 1000)}s 前刚扫过）` }
  }
  this.lastScanAt = now

  // ③ 会话门
  const sessionCount = await countSessionsSince(this.sessionsRoot, lastAt || 0)
  if (sessionCount < cfg.minSessions) {
    return { ok: false, reason: `期间只有 ${sessionCount} 个会话更新 < ${cfg.minSessions}` }
  }
  return { ok: true, hoursSince, sessionCount }
```

</details>

**依据 7 · 源码核查**：[lib/autodream/engine.js:291-329](https://github.com/gezi-wen/sage-mem/blob/2d2a25dee813fd2b44970a78426fc9fb1c0e10ac/lib/autodream/engine.js#L291-L329)

快照失败则停止，模型循环可选择接入会话读取。

<details>
<summary>查看原文（39行）</summary>

```text
        this.phase = '运行前快照（回滚点）'
        snapshot = await this.snapshot(runId, 'run')
        // 快照不完整就不许开工。残缺的回滚点比没有回滚点**更危险**——它让人以为
        // 「退得回去」。在任何写操作之前中止，是这条路径上唯一诚实的做法。
        if (snapshot.failed.length) {
          const shown = snapshot.failed.slice(0, 3).join('、')
          throw new Error(
            `运行前快照有 ${snapshot.failed.length} 个文件没存下来（${shown}${snapshot.failed.length > 3 ? '…' : ''}），` +
              '回滚点不完整，本次整理已中止（未改动任何文件）。请检查磁盘空间与文件占用后重试。',
          )
        }
      }

      this.phase = '运行前审计'
      auditBefore = await auditMemoryDir(this.memoryDir)

      const withSessions = cfg.source === 'memory+sessions'
      runner = createToolRunner({
        memoryDir: this.memoryDir,
        sessionsRoot: this.sessionsRoot,
        apply: !!cfg.apply,
        withSessions,
        ctx: this.ctx,
      })
      const toolSchemas = autodreamToolSchemas({ apply: !!cfg.apply, withSessions })

      // 从这里往下就会真的动模型和磁盘了 —— 之后的失败按「运行期故障」处理（吃退避）。
      preflight = false
      this.phase = '运行中'
      const result = await this.agentLoop(cfg, {
        provider: route.provider,
        model: route.model,
        toolSchemas,
        runner,
        maxSteps: cfg.maxSteps,
        tokenBudget: DEFAULT_TOKEN_BUDGET,
        hoursSince: hoursSince ?? 0,
        sessionCount,
      })
```

</details>

**依据 8 · 源码核查**：[lib/autodream/llm-loop.js:135-149](https://github.com/gezi-wen/sage-mem/blob/2d2a25dee813fd2b44970a78426fc9fb1c0e10ac/lib/autodream/llm-loop.js#L135-L149)

实际调用宿主 llm.stream 并传递 provider、model、提示与消息。

<details>
<summary>查看原文（15行）</summary>

```text
export async function streamOnce(llm, req) {
  const asm = new BlockAssembler()
  const options = {
    provider: req.provider,
    model: req.model,
    system: req.system,
    messages: req.messages,
    maxTokens: req.maxTokens,
    signal: req.signal,
    purpose: 'session-title', // 标记为非交互式调用，避免被当成主对话轮次记账
  }
  if (req.tools && req.tools.length) options.tools = req.tools
  for await (const chunk of llm.stream(options)) {
    asm.push(chunk)
  }
```

</details>

#### 缺口

- 没有多进程/外部编辑器竞态和文件系统故障复现。
  **影响**：影响写保护强度判断
  **进一步探讨**：并发写入同文件并注入外部编辑，检查冲突回执和原文保留。
- 没有实际宿主下的外部同步和模型数据流记录
  **影响**：无法确认同机编辑竞争及给远端模型的内容范围
  **进一步探讨**：在隔离目录用模拟条目和独立模型配置检查覆盖结果及请求边界

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次接入、持续治理和失败恢复成本如何评估？什么条件下值得采用？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

先在隔离 DSH profile 保持自动整理关闭，写入一条虚构构建约定，再用相关与无关问题分别验证召回。手工笔记组使用同模型、同问题与同一正确性检查。首次需核对挂载、路径及备份，日常需检查错误、过期条目和追加的提示成本。若另一编辑器修改过文件，先核对版本冲突提示后重读合并。误召回、无法区分外发路径或禁用后仍有注入时，停用并检查已保留文件，回到现有项目文档。待验证假设是按适用范围与修订号展示来源能减少误选，需比较核对时间、误召回、通过任务数及模型用量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:75-89](https://github.com/gezi-wen/sage-mem/blob/2d2a25dee813fd2b44970a78426fc9fb1c0e10ac/README.md#L75-L89)

作者列出文件式记忆、注入、主动工具、冲突、治理和界面功能。

<details>
<summary>查看原文（15行）</summary>

```text
| **文件式存储** | 每条记忆一个 `.md`：frontmatter 存元数据，正文存内容。无数据库、无隐藏格式 |
| **自动注入** | 每条新问题都会重新扫一遍记忆目录，按这条问题挑出最相关的几条，在模型开口之前拼进上下文 —— 不用模型自己去翻文件 |
| **模型也能自己查** | 另给模型三个工具（`search_memory` / `read_memory`，以及会写盘的 `trim_memory`），它可以主动翻记忆、按行读原文、把已经过时的一节裁去归档 |
| **写入不被覆盖** | 你正在编辑、模型同时在改的时候，后写的不会静默盖掉先写的；冲突留成待处理记录，由你决定保留哪边 |
| **零额外服务** | 无 worker、无 SQLite、无端口、无常驻进程，不需要额外的 API key 或云服务（运行时唯一的依赖是普通 npm 库 `zod`） |
| **防膨胀** | 靠规则引导模型判断「值不值得存」：无实质内容的不存，靠读代码 / git 能推出来的不存；已经长大的那几条按 16 KB / 40 KB 两条线提醒与处置（见[体积治理](#体积治理超线了怎么办)） |
| **可整理** | 可选的「自动做梦」把记忆通读一遍：合并重复、修索引与断链，改动前先建回滚点 |
| **从 Claude Code 迁移** | 人格（`CLAUDE.md` → `AGENTS.md`）照搬；记忆按四类整理成 `.md` 即可（见[下一节](#从-claude-code-迁移)） |
| **自带使用指南** | 包内携带一份技能（`skills/sage-mem/`）：记忆长什么样、四类怎么分、什么不该存、frontmatter 的坑、检索怎么工作、索引坏了怎么修。装上插件就够了 —— Agent 拿到说明书，不需要手工配置 |

界面上还有四块能力（都可以不用）：记忆管理页、类型与标签筛选、时间线（默认是条目列表，可切星空视角）、体检与归档。

**从 2.7.0 起，记忆管理的界面入口是三选一**：两个都显示（默认）/ 只显示侧栏 / 只显示设置页 —— **至少保留一个**。
侧栏入口（1.8.0）点一下就把中央主区切到本页（页顶有「返回会话」）；设置页入口是「设置 → 记忆管理」。
开关在「插件 → sage-mem」的「界面入口」折叠行里，面板「自动整理 → 设置」里也有同一组选项；改完立即生效、不用重启。
```

</details>

**依据 2 · 源码核查**：[lib/memory/retrieval.js:37-55](https://github.com/gezi-wen/sage-mem/blob/2d2a25dee813fd2b44970a78426fc9fb1c0e10ac/lib/memory/retrieval.js#L37-L55)

注释记录摘要门槛用于减少无关召回，并列内部离线评测结果。

<details>
<summary>查看原文（19行）</summary>

```text
 * 为什么单靠「覆盖率 > 0」不够（在真实记忆目录上实测）：中文里「怎么」「什么」这类词元
 * 在大量 `description` 里都有，于是一句完全无关的「今天天气怎么样」能靠一个「怎么」
 * 命中 **14 份**记忆、一次注入近 30 KB —— 而它们全都卡在同一条分数线上
 * （实测中位数 = 最高值 0.167），排序完全分不出来。
 *
 * ⚠️ **判据是按语料尺度归一的比值，不是一个绝对量。** 这是同一个坑的第三次：
 * `idf` 随语料规模**对数增长**，绝对阈值换一个语料量级就失效。
 *   - 绝对 `sum >= 1.5` 在百份量级的目录里等于「命中一个出现在约四分之一文件里的词元就放行」——
 *     实测一个高频虚词单靠自己 sum 就有 2.01，一整批候选全部通过，门槛形同虚设；
 *   - 同一批真命中在 2 份的小目录里又全被杀（`idf(df=1)` 只有 0.69）。
 * 分母取 `idfOf(1, N)` = 这套语料里**单个词元的证据上限**（全库独一份的权重）——
 * 归一之后同一套阈值在两个量级上都成立。
 *
 * 效果实测（归一阈值 0.6）：
 *   - 真实目录：无关问题的候选数 **46 → 7**（-85%），相关题每问仍留 3–10 条
 *   - 离线评测集（端到端「摘要 ∪ 正文」）：**不只是没退化，而是更好了** ——
 *     Recall@5 58/69 → 60/69、段落严格命中 29/47 → 30/47、误注入 10/71 → 4/71。
 *     原因：被门槛清掉的弱摘要候选原先在**挤占前 5 名的名额**，把更好的正文命中挡在外面。
 *     ⚠️ 只量摘要一侧会得出「掉 8 个点」的错误结论 —— 务必量端到端。
```

</details>

**依据 3 · 源码核查**：[lib/index.js:157-180](https://github.com/gezi-wen/sage-mem/blob/2d2a25dee813fd2b44970a78426fc9fb1c0e10ac/lib/index.js#L157-L180)

写入回执、覆盖保护及删除拒绝路径。

<details>
<summary>查看原文（24行）</summary>

```text
  async writeFile(name, content, opts) {
    // 三道闸（保留名 / 名字合法 / 影子文件）在 prepareWrite 里，顺序与另外两个写入口一致。
    const pre = await prepareWrite({
      name, content, limitBytes: MAX_FILE_BYTES,
      isReserved, nameKey, safeName,
      shadowCheck: (full) => shadowsReserved(full),
      dir: MEMORY_DIR,
      inspectEntry: inspectMemoryEntry,
    })
    if (!pre.ok) return pre
    return await writeSnapshot(pre.target, content, pre.gate, opts, { ctx: this.ctx, name: pre.safe, kind: "writeFile" })
  }

  /** 删除单个记忆文件：保留名一律拒绝（unlink 不可逆）。判定同 writeFile。 */
  async deleteFile(name) {
    if (isReserved(name)) {
      return { ok: false, error: `sage-mem: reserved file, refusing to delete: ${nameKey(name)}` }
    }
    const safe = safeName(name)
    if (!safe) return { ok: false, code: 'invalid_name', error: 'sage-mem: invalid file name' }
    // 同 writeFile：8.3 短名能绕过名字文本判据，删除保护也必须看文件身份。
    if (await shadowsReserved(join(MEMORY_DIR, safe))) {
      return { ok: false, error: `sage-mem: reserved file (它的另一个名字是 ${safe})，拒绝删除` }
    }
```

</details>

#### 缺口

- 内部评测数字未在本轮复跑，实际存储/召回价值及人工治理时间未知。
  **影响**：用团队自己的脱敏语料回放并记录误注入、漏召回、重述时间和维护时间
  **进一步探讨**：若关键事实误导即清除条目并停用。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
