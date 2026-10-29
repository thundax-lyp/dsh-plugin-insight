# meow-memory

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[7e53a81](https://github.com/Phant0Meow/dsh-meow-memory/tree/7e53a81af5fb3b6671ef29e89b8f4b251f89f930)

<!-- BEGIN META -->
[![GitHub ★ 326](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=326&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Phant0Meow/dsh-meow-memory) [![npm 30d 18,516](https://img.shields.io/static/v1?label=npm+30d&message=18%2C516&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/meow-memory) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/meow-memory)
<!-- END META -->

> **功能**：以 SQLite、关键词注入和模型工具提供跨会话项目记忆，并自动反思和闲时整理。

> **亮点**：把跨会话与压缩后记忆供给、关键词项目过滤、模型维护及空闲整理接成生命周期，减少手动搬运的潜在环节。来源仍是模型和用户材料，不声称知识正确。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：同level全表相似首项合并缺项目预筛，可能覆盖异项目事实；路径信任不绑定内容且初始化失败会放行。自动整理和注入需审错与计费。见[Q03](#research-q03)至[Q05](#research-q05)。

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
  - [Q01 · 谁需要这类跨会话记忆，比人工项目笔记多什么？](#detail-section-11)
  - [Q02 · 首轮、命中和压缩后究竟注入什么？](#detail-section-12)
  - [Q03 · 自动整理与写入怎样工作，有哪些数据边界？](#detail-section-13)
  - [Q04 · 信任、存储与实际使用怎样闭环？](#detail-section-14)
  - [Q05 · 全周期成本和效果证据是什么？](#detail-section-15)
  - [Q06 · 谁可试用，什么未来方向值得验证？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向重复项目续接任务，把手工笔记查阅和重述交给注入/工具接线；合格结果是正确且可修的事实进入后续任务。见[Q01](#research-q01)。

人工项目说明和笔记更易审阅，插件增加自动供给和整理；能否净节时取决于召回、误写修正和额外调用，未有对照结果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：持久化记忆、搜索、读取、更新、项目全景及home工具。
- **事件监听**：请求前注入、压缩后回放、任务结束反思。
- **后台**：按窗口空闲触发dream并用租约/计划推进。
- **用户命令**：/dream整理和/meow-trust路径信任。
- **界面**：记忆与整理折叠属作者说明，本轮未全审客户端。

**流程与依赖**

Node SQLite、制品、宿主事件/agent和模型、工作区及home状态构成实际门槛；路径信任与备份默认值见[Q04](#research-q04)。

用单项目一次性库按写入→换会话→压缩→手动整理→恢复逐步核对，自动功能应在人工验收后决定。执行者和失败动作见[Q04](#research-q04)。

**效果与成本**

净收益受错误记忆修正与新增整理请求左右，恒定guide不能替代实际缓存计费。完整分阶段成本及效果表见[Q05](#research-q05)。

可减少反复搬运项目事实，但当错误记忆被持续重注入时纠错会抵消收益。以任务正确续接和可恢复性决定是否保留，具体条件见[Q06](#research-q06)。

> **思考**：同level全表相似首项合并缺项目预筛，可能覆盖异项目事实；路径信任不绑定内容且初始化失败会放行。自动整理和注入需审错与计费。见[Q03](#research-q03)至[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把跨会话与压缩后记忆供给、关键词项目过滤、模型维护及空闲整理接成生命周期，减少手动搬运的潜在环节。来源仍是模型和用户材料，不声称知识正确。见[Q01](#research-q01)、[Q02](#research-q02)。

计划快照、租约和故障释放提供调度治理；语义合并、内容信任和模型路由恢复仍需各自验证，不能互相替代。见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

同level全表相似首项合并缺项目预筛，可能覆盖异项目事实；路径信任不绑定内容且初始化失败会放行。自动整理和注入需审错与计费。见[Q03](#research-q03)至[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有限试用可丢弃单项目库，先明确写入与读回，再手动整理；无备份不扩大到正式历史。见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持写读、注入、分组整理、路径信任与备份路径；真实召回、语义保持、模型恢复和净费用未知，可审阅合并为未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/db.ts、src/dream.ts、src/index.ts、src/inject.ts、src/tools.ts、src/trust.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向审注入/关键词/压缩、remember合并、反思和dream推进、模型覆盖恢复、路径信任与备份；未全审home搬迁、迁移兼容、全部设置/客户端路由或宿主实现。
- 下一步：未运行目标；用固定事实集核项目/否定冲突、压缩回放、整理前后摘要、失败恢复、实际provider用量与人工修正。测试计划见[Q02](#research-q02)至[Q06](#research-q06)。

**分析版本**

- **仓库**：[Phant0Meow/dsh-meow-memory](https://github.com/Phant0Meow/dsh-meow-memory)
- **版本号**：0.32.1（[固定提交 7e53a81](https://github.com/Phant0Meow/dsh-meow-memory/tree/7e53a81af5fb3b6671ef29e89b8f4b251f89f930)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

项目范围内候选合并加可审阅变更，验证能否降低误覆盖且维持可接受重复和审核成本；不是现有能力。见[Q06](#research-q06)。

未运行目标；用固定事实集核项目/否定冲突、压缩回放、整理前后摘要、失败恢复、实际provider用量与人工修正。测试计划见[Q02](#research-q02)至[Q06](#research-q06)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .cjs | source | 1 | 42 | 39 | 3 | — |
| .mjs | source | 14 | 3259 | 2678 | 424 | — |
| .md | source | 47 | 3759 | — | — | 63231 |
| .ts | source | 33 | 12374 | 8749 | 3017 | — |
| .mjs | test | 15 | 3523 | 3008 | 366 | — |

</details>

**活跃度**

[![近30天新建 39](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=39&color=737b86&logo=github)](https://github.com/Phant0Meow/dsh-meow-memory/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z) [![近30天关闭 33](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=33&color=737b86&logo=github)](https://github.com/Phant0Meow/dsh-meow-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：适当项目边界下的可维护记忆能否减少跨会话重述，自动整理能否覆盖质量和费用代价？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要这类跨会话记忆，比人工项目笔记多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

持续在DSH处理同一项目、需要新会话继续遵守偏好和决策的人，是meow-memory的直接对象。原办法是维护项目说明/手工笔记并每次查阅或复制；插件把七层SQLite条目、模型写读工具、首轮快照、关键词命中与闲时整理串起来。合格结果是新会话拿到正确且仍有效的必要信息、项目归属正确、用户可改错，并且省下的重述超过核对负担。

它的贡献在记忆生命周期接线，不是让模型具备人类记忆。memory_remember/search/read/update/project等是真实工具入口，注入作为plugin snapshot放到用户消息前，静态guide独立注册。自动反思和dream仍由模型判断该记什么、如何总结；SQLite存住内容不保证该内容真实。

一次性任务、记忆敏感信息不可进入模型、或已由可审阅项目说明覆盖的场景，人工笔记仍可能更简单。包当前为0.32.1而README版本行仍写0.31.0，本文以固定源码和package判断，不把文档所有兼容声明扩到当前运行通过。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-4](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/package.json#L2-L4)

实际包名、版本与用途。

```text
  "name": "meow-memory",
  "version": "0.32.1",
  "description": "Cross-session project memory for DeepSeek Harness: seven-layer SQLite memory, first-turn snapshot injection, per-message keyword hits, memory_remember/search/project tools, automatic reflection with reflection-fold UI, and idle-triggered dream consolidation (peak-hour suppressed).",
```

**依据 2 · 源码核查**：[src/tools.ts:913-922](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/tools.ts#L913-L922)

实际注册的记忆工具。

<details>
<summary>查看原文（10行）</summary>

```text
export function registerMemoryTools(register: (t: ToolDefinition) => void, dir = '.dsh-meow'): void {
  // 门控判定器经 setMemoryToolGate 注入（apply 期设置；工具工厂签名保持不变）。
  register(rememberTool(dir))
  register(searchTool(dir))
  register(findSimilarTool(dir))
  register(readTool(dir))
  register(updateTool(dir))
  register(projectTool(dir))
  register(homeTool())
}
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1258-1277](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/index.ts#L1258-L1277)

恒定guide注册链。

<details>
<summary>查看原文（20行）</summary>

```text
  let guideRegistered = false
  let guideTimer = 0
  const tryRegisterGuideSection = (attempt: number): void => {
    if (guideRegistered) return
    const svc = (ctx as { get?: (name: string) => unknown }).get?.('systemPrompt') as
      | { section?: (section: { name: string; order: number; text: string }) => unknown }
      | undefined
    if (svc === undefined || typeof svc.section !== 'function') {
      if (attempt < 20) {
        guideTimer = setTimeout(() => tryRegisterGuideSection(attempt + 1), 1000) as unknown as number
      } else {
        ctx.logger.warn('meow-memory: systemPrompt 服务 20s 内未就绪，记忆手册未挂进 system prompt（memory_* 工具不受影响）')
      }
      return
    }
    try {
      const dispose = svc.section({ name: 'meow-memory:guide', order: 130, text: getMemoryGuide() })
      guideRegistered = true
      if (typeof dispose === 'function') toolDisposers.push(dispose)
      ctx.logger.info('meow-memory: guide section registered into system prompt')
```

</details>

**依据 4 · 作者声明**：[README.md:5-24](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/README.md#L5-L24)

作者用途、七层与自动整理说明，非效果验证。

<details>
<summary>查看原文（20行）</summary>

```text

为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）打造的跨会话记忆插件。

当前版本 **0.31.0** ｜ 版本变更见 [CHANGELOG.md](CHANGELOG.md) ｜ 兼容 **dsh 0.1.5**

## ✨ 功能特性

- **七层记忆**：`soul`（AI 自身）/ `user`（用户信息与偏好）/ `project`（项目信息，含 `subcategory`）/ `fact`（原子事实）/ `lesson`（教训与纠正）/ `topic`（进行中的话题，带目标句）/ `rules`（设计原则与行为准则）。每层一张 SQLite 表，UUID 带时间前缀，id 顺序即创建顺序。
- **首轮注入（长期记忆块）**：第一条用户消息前注入 soul / user / 设计原则 / 记忆导引。记忆作为独立 plugin snapshot 消息放在真实 user 消息之前，**不改写用户 prompt**；**首轮不跑关键词命中**（命中从第二轮起）。
- **每消息关键词命中**：从第二条用户消息起，每条真实用户消息检索 fact/lesson/rules/topic（全局 + 当前 project 锚定），top-2 命中注入。命中基于**条目关键词**而非全文。
- **当前 project 锚定**：带 project 参数即锚定该会话的当前项目；未锚定时命中只搜全局（用户闲聊不误伤）。
- **缓存友好设计**：静态 `meow-memory:guide` section 在 system prompt 中注册一次——文本恒定，破坏不了 provider 的 KV 缓存。
- **压缩后重注入**：会话压缩后，下一轮自动重新注入长期记忆快照 + 本会话查阅过的项目全景 + 本会话写入过的记忆原文，AI 不会因为压缩突然失忆。
- **七层之上的三件事**：写入自动去重合并、按 `updated_at` 展示记忆时间戳、全局信息用全局标记（区别于留空）。
- **按窗口 dream**：窗口空闲 ≥3 小时即允许整理，由该窗口自己的主 agent 分三轮处理（原子记忆 / topic / 项目总结），**峰时抑制**（默认北京时间 09:00–12:00、14:00–18:00，API 峰谷电价峰时）不触发。也可敲 `/dream` 立刻手动整理。
- **反思**：单次任务内连续 ≥7 个工具 step 后，插件询问模型自上次整理以来是否有值得记忆的内容。最后工具是 `memory_*` 视为已主动记忆、不重复反思。
- **外部记忆库信任门**：工作区自带的 `.dsh-meow` 若非本机创建（如 clone 的外部仓库），默认暂停注入/检索/整理——首轮提示一次，`/meow-trust` 一键信任、即刻生效；本机创建与升级前打开过的工作区自动信任，正常使用零感知。
- **客户端 UI**：注入文本折叠成横条、反思/dream 轮折叠成一条可展开的卡片、会话列表显示 dream 状态图标（🌙 已整理 / 呼吸灯 进行中 / 灰月牙斜杠 已跳过）。
- **零运行时依赖**：`node:sqlite` + 自包含 esbuild 产物（`lib/index.js`）。**无原生模块。**

```

</details>

#### 缺口

- 没有独立跨会话任务召回与纠错对照。
  **影响**：不能证明比人工项目笔记净节时或更少遗漏。
  **进一步探讨**：固定新任务与旧决策，比较正确续接、无关注入、修正时间和总模型费用。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 首轮、命中和压缩后究竟注入什么？

**研究主题**：功能与机制

#### 完整回答

首轮长期块放soul/user正文、全局且importance>=2的active rules和项目名导引，正文不按titleMax截断；titleMax只影响导引项目名。因此top-2并非所有注入的全局长度上界，库中长正文仍可能扩大上下文。真实用户消息才触发注入，工具轮和纯插件消息跳过。

后续关键词命中从active fact/lesson/rules/topic中取“全局+当前锚定项目”，排除本会话建立及已经注入的ID，再对用户文本前500字评分。匹配面是条目keywords，无关键词旧条目退回内容前100字；实际注入仍是完整原文。分数结合词交集等启发式，不是向量语义保证，关键词抽取、项目锚定错误或用户后半段信息可能影响命中。

压缩完成置待办，下一个真实用户请求注入长期快照、曾查阅项目全景和本会话写过的active条目，读取当前库最新内容而非当时文本。它提高重新供给记忆的机会，也可能把后来被合并/改写的内容带回会话。清待办在构造成功后、实际模型请求结果前完成，不能把日志re-injected当模型已正确采用。初始/压缩后这轮不跑关键词命中。

本地存储与独立消息避免直接改写用户prompt，但内容仍进入提供者上下文；“缓存友好guide恒定”只限该section，动态snapshot、其他消息和provider缓存规则仍决定实际缓存命中。

#### 证据与依据

**依据 1 · 源码核查**：[src/inject.ts:262-298](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/inject.ts#L262-L298)

完整正文、全局rules与只截断导引。

<details>
<summary>查看原文（37行）</summary>

```text
  const pushEntries = (label: string, rows: MemoryRow[]) => {
    if (rows.length === 0) return
    lines.push(lbl('inject.sectionFormat', { label }))
    for (const r of rows) {
      lines.push(`- ${r.content}`)
      injected.push(r.id) // 正文已注入 → 记入已见（命中链路不再重复注入）
    }
    lines.push('')
  }

  pushEntries(lbl('inject.aboutYou'), soul)
  pushEntries(lbl('inject.aboutUser'), user)

  // 设计原则（rules）：注入「全局适用（未标记 null / 空串 / 全局标记「全局」「global」）
  // 且 importance≥2」的——少而精的命令式准则。
  // 2026-09-19 口径修复（用户拍板）：此前只认 project === null，而文档（tools.md /
  // system-guide.md / dream-atomic.md）教模型写"全局"——按文档写的准则反而永不注入。
  const globalRules = db.list('rules', { status: 'active' }).filter((r) => isGlobalScope(r.project) && r.importance >= 2)
  pushEntries(lbl('inject.rules'), globalRules)

  // 记忆导引：说明 + 项目列表（正文/标题一律自取，不列）。
  // titleMax 落地（2026-09-10）：schema/设置页一直承诺「导引里项目名的截断长度」，
  // 此前是死配置（shortTitle 被 void）。这里按承诺截断项目名——只影响导引一行展示，
  // 记忆条目正文/标题依旧不截断（v0.19.0 拍板不变）。
  const projectNames = db.listProjectNames()
  if (projectNames.length > 0) {
    const max = o.titleMax
    const shown = projectNames.map((n) => (n.length > max ? n.slice(0, max) + '…' : n))
    lines.push(lbl('inject.sectionFormat', { label: lbl('inject.guide') }))
    lines.push(lbl('inject.guideSearchLine'))
    lines.push(lbl('inject.guideProjectLine'))
    lines.push(lbl('inject.guideProjects', { list: shown.join(' / ') }))
    lines.push('')
  }

  if (lines.length <= 2) return null // 只有标题头，无任何内容
  return { body: lines.join('\n').trimEnd(), injectedIds: injected }
```

</details>

**依据 2 · 源码核查**：[src/inject.ts:542-570](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/inject.ts#L542-L570)

项目、已见和本会话过滤，查询/关键词匹配面。

<details>
<summary>查看原文（29行）</summary>

```text
  const seenState = readSeenFile(workspace, sessionId, dir)
  const currentProject = seenState.currentProject
  const hitRows = [
    ...db.list('fact', { status: 'active' }),
    ...db.list('lesson', { status: 'active' }),
    ...db.list('rules', { status: 'active' }),
    ...db.list('topic', { status: 'active' }),
  ].filter((r) =>
    (isGlobalScope(r.project) || (currentProject !== null && projectCovers(r.project, currentProject)))
    && r.source_session !== sessionId // 本 session 建立的记忆在上下文里，不命中
    && !seenState.injected.includes(r.id), // 已注入先排除再截断（#67）：先 hitTopK 后过滤，
  ) // top-K 被旧命中占满时本轮会颗粒无收，注入数恒低于上限
  if (hitRows.length === 0) return []
  const query = userText.slice(0, 500)
  const docs = toDocs(hitRows).map((d) => ({
    ...d,
    // 匹配面 = 条目关键词（LLM 提取或自动 bigram；无关键词的旧条目回退内容前 100 字）。
    content: d.keywords.length > 0 ? d.keywords.join(' ') : d.content.slice(0, 100),
  }))
  // 命中专用打分：交集×覆盖率×艾宾浩斯(updated_at)×importance×title 加成（艾宾浩斯开着）。
  const hits = keywordHitScore(query, docs, { k: o.hitTopK })
  const byId = new Map(hitRows.map((r) => [r.id, r]))
  // 展示/注入用原文 content（docs 的 content 只是 keywords 匹配面，不能当正文）。
  // 已注入的进入本函数前就排掉了（#67），这里不再二次过滤。
  return hits
    .map((h) => {
      const row = byId.get(h.id)
      return { id: h.id, level: h.level, content: row?.content ?? h.content, project: row?.project ?? null, updated_at: row?.updated_at ?? null }
    })
```

</details>

**依据 3 · 源码核查**：[src/inject.ts:431-466](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/inject.ts#L431-L466)

压缩回放读取当前库active原文及最近写入上限。

<details>
<summary>查看原文（36行）</summary>

```text
/**
 * 压缩重注入第三块（v0.23.0）：本会话写过的记忆原文回放。
 * 数据源 = sessions/<id>.json 的 written（memory_remember/memory_update 落库痕迹，
 * 子代理代写归父窗口）∪ db 层 source_session=本会话 的新建条目（双保险，覆盖插件
 * 热更新前旧代码写入的条目）。按当前库最新数据解析原文（不缓存旧文本）；只回放
 * status=active（archived/stale 内容已失效，回放会误导）；排除快照正文与项目全景
 * 已展示的 id（防同块重复）；超出 MAX_REINJECT_WRITTEN 保留最近写入的。
 * @returns null = 本会话没有可回放的写入条目。
 */
function buildWrittenSection(
  db: MemoryDb,
  workspace: string,
  sessionId: string,
  dir: string,
  exclude: ReadonlySet<string>,
): { text: string; ids: string[] } | null {
  const ordered: string[] = [...readWritten(workspace, sessionId, dir)]
  for (const { id } of db.idsBySession(sessionId)) {
    if (!ordered.includes(id)) ordered.push(id)
  }
  const rows: MemoryRow[] = []
  for (const id of ordered) {
    if (exclude.has(id)) continue
    const found = db.findById(id)
    if (!found || found.row.status !== 'active') continue
    rows.push(found.row)
  }
  const kept = rows.slice(-MAX_REINJECT_WRITTEN)
  if (kept.length === 0) return null
  return {
    text: [
      lbl('inject.sectionFormat', { label: lbl('inject.writtenSection') }),
      lbl('inject.writtenIntro'),
      ...kept.map(fmtProjectRow),
    ].join('\n'),
    ids: kept.map((r) => r.id),
```

</details>

**依据 4 · 源码核查**：[src/index.ts:1439-1441](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/index.ts#L1439-L1441)

只有真实用户消息触发。

```text
    // 真实用户消息（跳过插件通知等，source.kind='plugin' 的进不来）。
    const userMsgs = decision.messages.filter((m: { source?: { kind?: string } }) => m.source?.kind === 'user')
    if (userMsgs.length === 0) return decision // 工具轮/纯插件消息：不注入
```

**依据 5 · 源码核查**：[src/index.ts:1468-1486](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/index.ts#L1468-L1486)

实际重注入与待办清除时序。

<details>
<summary>查看原文（19行）</summary>

```text
    // 压缩重注入（v0.21.0）：compaction/end 成功后置位的待办——下一个含真实用户
    // 消息的请求在消息前注入「长期记忆快照 + 本会话此前查阅过的项目全景」，然后清待办。
    // 本轮不跑命中链路（等同新首轮：快照先行，命中从下一轮起）。待办置位但无可注入
    // 内容（库空且项目全空）也一并清除，避免每个用户消息轮空转重查。
    if (ws && isReinjectPending(ws, sid, resolved.projectDir)) {
      const lastUser = userMsgs[userMsgs.length - 1]
      const db = getDb(ws, resolved.projectDir)
      const reinj = buildReinjection(db, ws, sid, readProjectQueried(ws, sid, resolved.projectDir), {
        hitTopK: resolved.hitTopK,
        titleMax: resolved.titleMax,
      }, resolved.projectDir)
      clearReinjectPending(ws, sid, resolved.projectDir)
      if (reinj !== null) {
        const rewritten = [...decision.messages]
        rewritten.splice(rewritten.indexOf(lastUser), 0, createMemorySnapshotMessage(reinj.text, { kind: 'reinjection', ids: reinj.injectedIds }))
        ctx.logger.info(`meow-memory: post-compaction memory re-injected (${reinj.text.length} chars)`)
        return { ...decision, messages: rewritten }
      }
      return decision
```

</details>

#### 缺口

- 准确召回、无关信息占比、长正文膨胀和实际缓存率未知。
  **影响**：不能从注入机制推出持续记忆质量或缓存节费。
  **进一步探讨**：用含过期/相似/跨项目决策的会话集，核注入内容、token、缓存计费和最终答案引用。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自动整理与写入怎样工作，有哪些数据边界？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

dream以窗口idle时间而非全局空闲判断，默认180分钟、15分钟检查，Asia/Shanghai指定时段抑制；不是查询电价服务后动态选最便宜时刻。扫描排除归档、停用、跳过与子代理等窗口，可恢复缺失agent继续整理。startWindowDream先collect计划、claim租约并保存轮次快照，首组另送记忆turn，后组safeSteer推进，最后finalize；计划固定避免整理中新记录导致索引漂移。

反思在普通任务结束检查连续工具step，默认阈值7；纯聊天、最后工具memory_*和已反思轮不重复。达到条件会给主会话另起记忆turn，增加模型请求和可能的工具写入；不是免费本地归档。用户中止不推进，dream错误释放租约待后续重试，已写条目没有在这些分支整体撤销。done反映调度收尾，不代表模型总结事实验收。

memory_remember在同level列表中以token集合Jaccard>=0.8找第一个相似条目，找到便覆盖content、关键词，按条件覆盖project等字段，再记written并读回。不先按project筛选，也没有在该分支校验相似记忆是否属于同一事实。因此相似措辞的不同项目记录可能被合并并转移归属，这是静态路径风险，未执行复现；不能把命中检索的项目过滤说成写入也隔离。该相似度也不能判断“允许”和“不允许”等事实冲突。

可选整理模型经agent/request单请求覆盖，维护进程内main/delegate配对账，下一普通请求若仍是delegate且用户未另选则恢复。这个修复依赖日志判断及内存账，源码注明宿主重启丢一次恢复状态；本轮未复现作者注释中的旧故障，也未验证当前所有路由恢复。


#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:251-263](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/index.ts#L251-L263)

默认idle、检查、抑制时段。

<details>
<summary>查看原文（13行）</summary>

```text
      idleMinutes: z.number().min(1).default(180),
      /** 抑制时段（目标时区，"HH:MM" 起止）：这些时段内不触发 dream。 */
      suppressWindows: z
        .array(z.object({ start: z.string(), end: z.string() }))
        .default([{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }]),
      /** 每个抑制时段开始前追加的不触发分钟数（峰时前 15 分钟也不触发）。 */
      suppressLeadMinutes: z.number().min(0).max(120).default(15),
      checkMinutes: z.number().min(1).default(15),
      // 用户系统是美区时间（隐私设置），抑制时段按中国时区计算
      timeZone: z.string().default('Asia/Shanghai'),
      /** rules 防 churn（测评 2026-08-25）：updated_at 距今超该天数的稳定准则不进 dream 第 1 轮清单；0=不过滤。 */
      rulesReviewDays: z.number().min(0).default(DEFAULT_RULES_REVIEW_DAYS),
    })
```

</details>

**依据 2 · 源码核查**：[src/dream.ts:375-405](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/dream.ts#L375-L405)

租约、固定计划与首组发送。

<details>
<summary>查看原文（31行）</summary>

```text
export function startWindowDream(ctx: Context, agent: { session?: { header?: { id?: string } } }, workspace: string, dir = '.dsh-meow', onDreamState?: DreamStateCallback, rulesReviewDays: number = DEFAULT_RULES_REVIEW_DAYS): boolean {
  const sessionId = agent.session?.header?.id
  if (!sessionId) return false
  const db = getDb(workspace, dir)
  const rounds = collectDreamRounds(db, sessionId, workspace, dir, rulesReviewDays)
  if (rounds.length === 0) {
    // 无本窗口记忆（建立的 ∪ 提取过的都无）：也推进 last_dream_time（= 本窗口无可整理），避免 need=true 恒成立、每轮空扫到 24h
    db.finishDream(sessionId, Date.now())
    dreamLog(workspace, dir, `dream skip-empty sid=${shortSessionId(sessionId)}`)
    onDreamState?.(sessionId, 'dreamed')
    return false
  }
  const win = db.getWindow(sessionId)
  // claimDream 的 INSERT OR IGNORE 会给新窗口行造出 last_event_time=0 哨兵，这里兜底 0
  const T = win && win.last_event_time > 0 ? win.last_event_time : Date.now()
  if (!db.claimDream(sessionId, newDreamOwner(), T, DREAM_LEASE_MS)) return false // 别处活跃租约未过期
  // 轮次计划快照（#69）：group_idx 是纯位置下标，advance 每轮重算 collectDreamRounds
  // 会让「整理中新建的记忆」改变 rounds 长度/顺序——索引漂移 = 重复 topic、跳过 atomic。
  // 快照后每条目标条目恰好被访问一次；整理中新建的记忆留给下一次 dream。
  db.setDreamMeta(`dreamplan:${sessionId}`, JSON.stringify(rounds))
  onDreamState?.(sessionId, 'dreaming')
  const msg = buildDreamMessage(db, sessionId, T, rounds, 0)
  if (!sendMemoryTurn(agent, msg, workspace, dir, `dream start sid=${shortSessionId(sessionId)}`)) {
    // 没送达：释放租约让下个周期自然重试，不把窗口卡在"进行中"。
    db.releaseDream(sessionId)
    return false
  }
  armDreamHeartbeat(sessionId, workspace, dir) // 轮内心跳：单组 >30min 不再被判死收尾
  dreamLog(workspace, dir, `dream start pid=${process.pid} session=${shortSessionId(sessionId)} rounds=${rounds.length} T=${T}`)
  return true
}
```

</details>

**依据 3 · 源码核查**：[src/dream.ts:438-454](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/dream.ts#L438-L454)

计划推进及finalize。

<details>
<summary>查看原文（17行）</summary>

```text
  const rounds: DreamRound[] = storedPlan !== undefined
    ? JSON.parse(storedPlan) as DreamRound[]
    : collectDreamRounds(db, sessionId, ws, dir, rulesReviewDays)
  const nextIdx = lease.group_idx + 1
  if (nextIdx < rounds.length) {
    // CAS 推进：多实例同收 turn-stopping 时只有一个成功，其余跳过
    if (db.advanceDreamLease(sessionId, lease.group_idx, DREAM_LEASE_MS)) {
      armDreamHeartbeat(sessionId, ws, dir) // 热重载后新模块实例没有旧心跳：推进时补挂（幂等）
      const msg = buildDreamMessage(db, sessionId, lease.T, rounds, nextIdx)
      const tag = `dream group ${nextIdx + 1}/${rounds.length}`
      // 后续组用 steer（非 followup）：连在 dream 自己的 turn 里，多组不分轮
      if (safeSteer(agent, msg, ws, dir, tag)) dreamLog(ws, dir, `${tag} steered`)
    }
    return
  }
  // 最后一轮完成 → 收尾
  finalizeDream(db, sessionId, ws, dir, lease.T, 'done', rounds.length, onDreamState)
```

</details>

**依据 4 · 源码核查**：[src/index.ts:1635-1652](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/index.ts#L1635-L1652)

用户中止、错误释放、正常推进。

<details>
<summary>查看原文（18行）</summary>

```text
    // 用户按停止（aborted/interrupted）：不反思、不推进下一组；但 dream 轮必须立即收尾，
    // 否则 DB 租约残留，窗口要等租约过期（30min）才能再 dream。
    if (endReason === 'aborted' || endReason === 'interrupted') {
      if (dreamTurn) abortDream(agent, resolved.projectDir, signalDreamState)
      return
    }
    if (dreamTurn) {
      if (endReason === 'error') {
        // steer 模式 dream 轮执行失败（LLM/网络瞬态故障，非用户中止）：释放租约不封存，
        // 下个检查周期自动重试（与 delegate 路径 done 回调的 error 分支同语义，
        // 2026-09-05 教训：封存会让一次断网永久吞掉窗口的 dream）。
        try {
          if (wsTs && sidTs) getDb(wsTs, resolved.projectDir).releaseDream(sidTs)
        } catch { /* 释放失败不阻塞（租约 30min 过期自愈兜底） */ }
        return
      }
      advanceDream(agent, resolved.projectDir, signalDreamState, resolved.dream.rulesReviewDays) // dream 轮：推进下一组或收尾（含孤儿收尾）
      return
```

</details>

**依据 5 · 源码核查**：[src/index.ts:1665-1682](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/index.ts#L1665-L1682)

反思条件与新增turn。

<details>
<summary>查看原文（18行）</summary>

```text
    if (!resolved.reflect) return
    const ws = workspaceOfAgent(agent)
    if (!ws) return
    const { sawToolCall, lastToolName, sawReflect, turnText } = scanTurn(sessionEventsOf(agent.session))
    if (sawReflect) {
      reflectQueuedTurn.delete(sidTs) // 本 turn 已反思过（含反思轮自身结束）：排队痕迹用完即清
      return
    }
    // 本 turn 已经排过一条（followup 排在 next-turn，事件流里还看不见）→ 不再重复排（issue #19）
    if (turn !== undefined && reflectQueuedTurn.get(sidTs) === turn) return
    if (!sawToolCall) return // 纯聊天轮，不反思
    if (lastToolName !== undefined && lastToolName.startsWith('memory_')) return // 已主动记忆
    if (consecutiveToolSteps(sessionEventsOf(agent.session)) < resolved.reflectTurns) return // 单任务内连续工具 step 不足
    const message = buildReflectMessage(ws, turnText, resolved.projectDir)
    // 反思任务送主会话独立新轮（v0.24 拍板进主会话；2026-09-10 起走 followup 另起
    // 一轮——steer 延续同 turn 会把 AI 的工作汇报顶成中间步骤，见 sendMemoryTurn）。
    // 换模型由下方 agent/request waterfall 承接——本 turn 带 REFLECT_MARKER 时自动覆盖模型。
    if (sendMemoryTurn(agent, message, ws, resolved.projectDir, `reflect sid=${shortSessionId(sidTs)}`)) {
```

</details>

**依据 6 · 源码核查**：[src/tools.ts:179-189](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/tools.ts#L179-L189)

Jaccard与0.8阈值。

<details>
<summary>查看原文（11行）</summary>

```text
/** bigram Jaccard 相似度（去重用）。 */
export function similarity(a: string, b: string): number {
  const sa = new Set(tokenize(a))
  const sb = new Set(tokenize(b))
  if (sa.size === 0 || sb.size === 0) return 0
  let inter = 0
  for (const t of sa) if (sb.has(t)) inter++
  return inter / (sa.size + sb.size - inter)
}

const DEDUP_THRESHOLD = 0.8
```

</details>

**依据 7 · 源码核查**：[src/tools.ts:279-310](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/tools.ts#L279-L310)

同level全表首个相似覆盖，无project预筛。

<details>
<summary>查看原文（32行）</summary>

```text
      // 去重：同 level 找相似条目 → 合并更新
      const existing = db.list(level)
      let merged: MemoryRow | undefined
      for (const r of existing) {
        if (similarity(r.content, content) >= DEDUP_THRESHOLD) {
          merged = r
          break
        }
      }
      if (merged) {
        const patch: MemoryPatch = {
          content,
          importance: Math.max(merged.importance, importance),
        }
        if (project && (level === 'project' || level === 'fact' || level === 'lesson' || level === 'topic' || level === 'rules')) patch.project = project
        if (subcategory && level === 'project') patch.subcategory = subcategory
        if (goal && level === 'topic') patch.goal = goal
        if (level === 'lesson' && corrected) patch.corrected = 1
        patch.keywords = keywords // 显式关键词才覆盖合并目标（能走到这里说明关键词非空）
        db.update(level, merged.id, patch)
        // 写痕迹（v0.23.0）：合并落库也记入 written——压缩重注入第三块回放本会话写过的记忆。
        markWritten(workspace, source_session ?? 'unknown', [merged.id], dir)
        // 读回合并后的实际存储结果（关键词等），让模型知道最终落库形态。
        const after = db.findById(merged.id)?.row
        return {
          ok: true,
          id: merged.id,
          level,
          merged: true,
          keywords: after?.keywords ?? merged.keywords,
          ...(after?.project ? { project: after.project } : {}),
        }
```

</details>

**依据 8 · 源码核查**：[src/index.ts:1714-1752](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/index.ts#L1714-L1752)

模型覆盖、配对账及恢复判断。

<details>
<summary>查看原文（39行）</summary>

```text
  if (resolved.delegate.modelSpec !== undefined) {
    const spec = resolved.delegate.modelSpec
    // #71：sid → 主模型路由 + 我们写下的 delegate 路由（配对保存，避免把 delegate 当主模型）
    const delegateRestore = new Map<string, { main: ModelRoute; route: ModelRoute }>()
    const MAX_DELEGATE_TRACKED = 512
    ctx.on('agent/request', async (payload: { agent?: { session?: { header?: SessionHeaderLike } } }, next: () => Promise<unknown>) => {
      const config = await next() as ModelRoute
      const agent = payload?.agent
      // 子代理请求不覆盖也不还原（fork 子代理已不再由本插件产生；GUI 手动 fork 的照常放行）
      if (agent === undefined || agent.session?.header?.origin === 'subagent') return config
      const sid = sessionIdOfAgent(agent)
      const events = sessionEventsOf(agent.session as never)
      if (isMemoryTaskTurn(events)) {
        // 只在本会话还没记过时记：同一反思轮第 2 步起解析出的是我们写下的 delegate 路由，
        // 记错会把 delegate 存成主模型（真机日志一次反思有 2 个 header）。无会话 id 不记（防串会话）。
        const route: ModelRoute = { provider: spec.provider ?? config.provider, model: spec.model ?? config.model }
        if (sid !== 'unknown' && !delegateRestore.has(sid)) {
          delegateRestore.set(sid, { main: mainRouteOf(config), route })
          // 进程级 Map 兜底上限（Map 保留插入序）：只保最近 MAX_DELEGATE_TRACKED 个会话
          while (delegateRestore.size > MAX_DELEGATE_TRACKED) {
            const oldest = delegateRestore.keys().next().value
            if (oldest === undefined) break
            delegateRestore.delete(oldest)
          }
        }
        ctx.logger.info(`meow-memory: memory task turn → model override ${spec.provider ?? '(inherit)'}/${spec.model ?? ''}`)
        return {
          ...config,
          ...(spec.provider !== undefined ? { provider: spec.provider } : {}),
          ...(spec.model !== undefined ? { model: spec.model } : {}),
        }
      }
      const remembered = delegateRestore.get(sid)
      if (remembered === undefined) return config // 没覆盖过 / 已还原：零开销放行
      delegateRestore.delete(sid)
      if (userSelectedAfterOverride(events, remembered.route)) return config
      if (config.provider !== remembered.route.provider || config.model !== remembered.route.model) return config // 用户换了别的模型：放行
      ctx.logger.info(`meow-memory: restore main model ${remembered.main.provider}/${remembered.main.model} after memory task turn`)
      const { reasoningEffort: _inherited, ...rest } = config
```

</details>

#### 缺口

- dream生成质量、重复尝试累计费用、跨项目相似覆盖与换模型恢复未经运行验收。
  **影响**：不能用自动整理完成标记代替正确保留/隔离和费用控制。
  **进一步探讨**：一次性库放同措辞不同项目与否定冲突，检查整理前后行摘要；注入中断和模型重载，记录总调用和恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 信任、存储与实际使用怎样闭环？

**研究主题**：依赖、兼容与流程

#### 完整回答

外部库门禁在正常启用时先于注入读取；home下注册表按归一工作区路径hash记信任，本机新建空库可登记、历史window-index播种已用路径，用户/meow-trust显式登记。不是内容摘要签名：已信任路径换库并不必然重新询问，信任也不证明库内容无恶意指令。若注册表目录创建失败，markersDir=null，isTrustedWorkspace明确fail-open；不要说任何环境都默认阻断外部库。

| 条件 | 实际依赖/状态 | 验收边界 |
|---|---|---|
| 安装 | package lib入口、prepare调用build；host schema及工具/会话事件 | 构建制品与固定提交对应未核验，未运行安装 |
| 存储 | node:sqlite、工作区.dsh-meow、home注册表/窗口索引 | 本地库仍可能通过注入送入配置模型 |
| 检索 | 正确project锚定、keywords、active状态 | project是选择范围，不是用户身份隔离 |
| 自动任务 | 主agent、可选整理模型、idle调度与租约 | 额外请求需计费和结果审阅 |
| 恢复 | 可选VACUUM INTO一致性.bak，再rename；自动备份默认关 | 只有实际存在且可恢复的快照才是退路 |

| 步骤/执行者 | 合格结果 | 失败动作 |
|---|---|---|
| 用户复制小项目建一次性库 | 库路径、信任源、版本可解释 | 外部库先审内容，不仅信任路径 |
| 用户明确写三条测试事实 | 工具返回后读回ID、project和原文 | 合并非预期时停写、保留前后快照 |
| 用户换会话及压缩 | 只注入应有内容，最终答案使用正确 | 停读并核关键词、项目与过期状态 |
| 用户手动dream再试自动 | 摘要/状态正确，费用和路由符合预期 | 停反思/dream，不用重复调用掩盖错误 |
| 维护者停用与恢复 | 原库可读、备份可恢复、模型选择可解释 | 不删库，先导出/备份再修复 |

工具还包含home目录迁移入口，本轮未全审搬迁冲突或全部设置路由；不能把上述路径核查扩成完整多实例安全保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/trust.ts:48-95](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/trust.ts#L48-L95)

注册表失败与fail-open；信任按路径hash。

<details>
<summary>查看原文（48行）</summary>

```text
export function enableWorkspaceTrust(homeDir: string = activeHomeDir()): void {
  const dir = join(homeDir, 'trusted-workspaces')
  try {
    mkdirSync(dir, { recursive: true })
    markersDir = dir
  } catch {
    markersDir = null // 建不了注册表目录 → 门不启用（fail-open），绝不影响启动
  }
}

/** 停用信任门（测试清理用；生产不调用）。 */
export function disableWorkspaceTrust(): void {
  markersDir = null
}

function markerPath(ws: string): string {
  const hash = createHash('sha256').update(normalizeWorkspacePath(ws)).digest('hex')
  return join(markersDir as string, `${hash}.json`)
}

function readMarker(ws: string): TrustMarker | undefined {
  try {
    const parsed = JSON.parse(readFileSync(markerPath(ws), 'utf8')) as TrustMarker
    if (parsed === null || typeof parsed !== 'object' || typeof parsed.path !== 'string') return undefined
    return parsed
  } catch {
    return undefined
  }
}

/** 原子写（tmp+rename，与 backupMemoryDb 同款）：注册表是安全边界，写坏不如不写。 */
function writeMarker(ws: string, marker: TrustMarker): void {
  const target = markerPath(ws)
  const tmp = `${target}.tmp`
  writeFileSync(tmp, JSON.stringify(marker, null, 1), 'utf8')
  renameSync(tmp, target)
}

/** 工作区是否已信任。门未启用时 fail-open 返回 true。 */
export function isTrustedWorkspace(ws: string): boolean {
  if (markersDir === null) return true
  const marker = readMarker(ws)
  return marker !== undefined && typeof marker.trustedAt === 'number'
}

/** 工作区记忆库是否未信任（门未启用恒为 false）。 */
export function isUntrustedMemoryWorkspace(ws: string): boolean {
  return !isTrustedWorkspace(ws)
```

</details>

**依据 2 · 源码核查**：[src/trust.ts:119-132](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/trust.ts#L119-L132)

仅新建空目录自动信任。

<details>
<summary>查看原文（14行）</summary>

```text
export function registerCreatedWorkspace(workspace: string, dir: string): void {
  if (markersDir === null) return
  if (isTrustedWorkspace(workspace)) return
  try {
    const dirPath = join(workspace, dir)
    if (existsSync(dirPath)) {
      for (const entry of readdirSync(dirPath)) {
        if (!CREATION_DIR_IGNORE.has(entry)) return // 目录非空（预置内容）→ 不登记
      }
    }
    trustWorkspace(workspace, 'created-empty')
  } catch {
    /* 判定失败不登记（fail-closed 只影响这一个新工作区，不影响既有信任） */
  }
```

</details>

**依据 3 · 源码核查**：[src/trust.ts:156-175](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/trust.ts#L156-L175)

历史窗口路径播种信任。

<details>
<summary>查看原文（20行）</summary>

```text
/** 升级播种：window-index.json（home 目录，不可伪造）里出现过的每个工作区都
 *  是本机升级前实际打开过的 → 全部登记信任，老用户零摩擦。幂等。 */
export function seedTrustedWorkspaces(
  indexFile: string = join(activeHomeDir(), 'window-index.json'),
): { trusted: number; listed: number } {
  if (markersDir === null) return { trusted: 0, listed: 0 }
  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(indexFile, 'utf8'))
  } catch {
    return { trusted: 0, listed: 0 }
  }
  if (parsed === null || typeof parsed !== 'object') return { trusted: 0, listed: 0 }
  const workspaces = new Set<string>()
  for (const ws of Object.values(parsed as Record<string, unknown>)) {
    if (typeof ws === 'string' && ws.length > 0) workspaces.add(ws)
  }
  let trusted = 0
  for (const ws of workspaces) {
    if (trustWorkspace(ws, 'window-index-seed')) trusted += 1
```

</details>

**依据 4 · 源码核查**：[src/index.ts:1443-1466](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/index.ts#L1443-L1466)

正常注入先受信任和停读门禁。

<details>
<summary>查看原文（24行）</summary>

```text
    // 外部记忆库信任门（#64）：.dsh-meow 非本机创建且未信任 → 全部记忆路径暂停
    //（下方重注入/首轮快照/命中链都不会走到）。首个用户消息前插一次性说明（不
    // 读库、不算注入），给出 /meow-trust 恢复方式。信任是活检查：/meow-trust 后
    // 下一轮即恢复正常注入，无需重启。提示记账在全局注册表（工作区文件可预置，
    // 不能当标记）。
    if (ws !== null && isUntrustedMemoryWorkspace(ws)) {
      if (!hasExternalNoticeShown(ws)) {
        markExternalNoticeShown(ws)
        try {
          const notice = resolveSlotText('external-memory-notice')
          const rewritten = [...decision.messages]
          rewritten.splice(rewritten.indexOf(userMsgs[0]), 0, createMemoryNoticeMessage(notice))
          ctx.logger.info('meow-memory: external memory library detected — paused until /meow-trust')
          return { ...decision, messages: rewritten }
        } catch {
          /* 提示失败不阻塞：按无提示停用处理 */
        }
      }
      return decision
    }

    // 记忆门控（issue #38/#28）：本窗口「停止读入」或工作区被配置停用 → 跳过全部
    // 注入路径（重注入/首轮快照/引导/命中链）。读的入口统一在此封口。
    if (ws !== null && memoryReadOff(ws, sid)) return decision
```

</details>

**依据 5 · 源码核查**：[src/db.ts:19-19](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/db.ts#L19-L19)

真实Node SQLite导入。

```text
import { DatabaseSync } from 'node:sqlite'
```

**依据 6 · 源码核查**：[src/db.ts:830-845](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/db.ts#L830-L845)

备份VACUUM INTO+rename，失败false。

<details>
<summary>查看原文（16行）</summary>

```text
export function backupMemoryDb(workspace: string, dir = '.dsh-meow'): boolean {
  try {
    const dbPath = memoryDbPath(workspace, dir)
    if (!existsSync(dbPath)) return false
    const bakPath = `${dbPath}.bak`
    let dataMtime = statSync(dbPath).mtimeMs
    const walPath = `${dbPath}-wal`
    if (existsSync(walPath)) dataMtime = Math.max(dataMtime, statSync(walPath).mtimeMs)
    if (existsSync(bakPath) && statSync(bakPath).mtimeMs >= dataMtime) return false
    const tmp = `${bakPath}.tmp`
    getDb(workspace, dir).vacuumInto(tmp)
    renameSync(tmp, bakPath)
    return true
  } catch {
    return false
  }
```

</details>

**依据 7 · 源码核查**：[src/index.ts:269-275](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/index.ts#L269-L275)

自动备份默认关闭。

```text
  /** 记忆库自动备份（#37，默认关）：每次 dream 收尾把 memory.db 快照轮转到
   *  memory.db.bak（VACUUM INTO 一致性备份，mtime 判增量）。注册期消费，改动需重载。 */
  backup: z
    .object({
      enabled: z.boolean().default(false),
    })
    .default({}),
```

**依据 8 · 源码核查**：[package.json:42-60](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/package.json#L42-L60)

prepare构建与peer说明。

<details>
<summary>查看原文（19行）</summary>

```text
  "scripts": {
    "prepare": "node build.mjs",
    "build": "node build.mjs",
    "watch": "node build.mjs --watch",
    "test": "npm run build && node scripts/check-lang.mjs && node test.mjs && node tests/config-volatile.mjs && node tests/trust.mjs && node tests/client-fold.mjs && node tests/client-i18n.mjs && node tests/settings-page.mjs && node tests/client-delegate-notice.mjs && node tests/client-delegate-vanish.mjs && node tests/client-dream-icon.mjs && node tests/client-dream-skip.mjs",
    "check-lang": "node scripts/check-lang.mjs",
    "link-workspace": "powershell -ExecutionPolicy Bypass -File scripts/link-workspace.ps1"
  },
  "peerDependencies": {
    "@deepseek-ai/schemastery": "^3.18.1",
    "@deepseek-ai/dsh-llm": "*"
  },
  "devDependencies": {
    "@deepseek-ai/schemastery": "^3.18.1",
    "esbuild": "^0.25.0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-llm": {
      "optional": true
```

</details>

#### 缺口

- 完整外部库门禁失败环境、备份恢复、多实例迁移与制品对应未知。
  **影响**：不能按本地存储或有备份函数推数据安全保证。
  **进一步探讨**：受控模拟不可写home、同路径替换库、备份恢复与多实例访问，逐一核实际状态。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 全周期成本和效果证据是什么？

**研究主题**：效果与总成本

#### 完整回答

#### 成本

| 阶段 | 成本来源 | 当前边界 |
|---|---|---|
| 启用 | 项目/全局归属、信任、制品和备份核验 | 不是安装后自动得到正确记忆 |
| 日常 | 初始全量正文、关键词召回、工具搜索、磁盘/WAL/会话状态 | top-K不限制首轮与全部回放正文长度 |
| 整理 | 反思新增turn、dream分组、可选模型和失败重试 | 峰时抑制不等于实际账单最优 |
| 核对 | 遗漏、过期、否定冲突、跨项目合并及项目锚定 | 省重述可能转为修记忆 |
| 维护/退出 | 备份恢复、版本/事件契约、停用后库与模型路由核对 | 默认不自动备份，停用不能还原已覆盖条目 |

#### 效果

| 效果 | 当前支持 | 尚未确定 |
|---|---|---|
| 跨会话供给 | SQLite持久化、首轮和压缩回放路径 | 最终任务正确率与遗漏减少 |
| 相关性 | 关键词、重要性/时间等启发式与项目过滤 | 同义、否定、长消息和关键词缺失质量 |
| 维护自动化 | 模型工具、反思与分组dream | 整理事实保持、净修正时间和长期费用 |
| 缓存 | 静态guide独立section | 动态消息下实际provider缓存与净计费 |

对照应以一个跨会话任务正确完成的总费用计量，包含读写、额外整理和人工修正。零运行时第三方模块不等于零模型费用，也不等于SQLite、磁盘及隐私核对成本为零。

#### 证据与依据

**依据 1 · 源码核查**：[src/inject.ts:262-298](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/inject.ts#L262-L298)

首轮完整正文与导引。

<details>
<summary>查看原文（37行）</summary>

```text
  const pushEntries = (label: string, rows: MemoryRow[]) => {
    if (rows.length === 0) return
    lines.push(lbl('inject.sectionFormat', { label }))
    for (const r of rows) {
      lines.push(`- ${r.content}`)
      injected.push(r.id) // 正文已注入 → 记入已见（命中链路不再重复注入）
    }
    lines.push('')
  }

  pushEntries(lbl('inject.aboutYou'), soul)
  pushEntries(lbl('inject.aboutUser'), user)

  // 设计原则（rules）：注入「全局适用（未标记 null / 空串 / 全局标记「全局」「global」）
  // 且 importance≥2」的——少而精的命令式准则。
  // 2026-09-19 口径修复（用户拍板）：此前只认 project === null，而文档（tools.md /
  // system-guide.md / dream-atomic.md）教模型写"全局"——按文档写的准则反而永不注入。
  const globalRules = db.list('rules', { status: 'active' }).filter((r) => isGlobalScope(r.project) && r.importance >= 2)
  pushEntries(lbl('inject.rules'), globalRules)

  // 记忆导引：说明 + 项目列表（正文/标题一律自取，不列）。
  // titleMax 落地（2026-09-10）：schema/设置页一直承诺「导引里项目名的截断长度」，
  // 此前是死配置（shortTitle 被 void）。这里按承诺截断项目名——只影响导引一行展示，
  // 记忆条目正文/标题依旧不截断（v0.19.0 拍板不变）。
  const projectNames = db.listProjectNames()
  if (projectNames.length > 0) {
    const max = o.titleMax
    const shown = projectNames.map((n) => (n.length > max ? n.slice(0, max) + '…' : n))
    lines.push(lbl('inject.sectionFormat', { label: lbl('inject.guide') }))
    lines.push(lbl('inject.guideSearchLine'))
    lines.push(lbl('inject.guideProjectLine'))
    lines.push(lbl('inject.guideProjects', { list: shown.join(' / ') }))
    lines.push('')
  }

  if (lines.length <= 2) return null // 只有标题头，无任何内容
  return { body: lines.join('\n').trimEnd(), injectedIds: injected }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1673-1682](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/index.ts#L1673-L1682)

自动新增反思turn。

<details>
<summary>查看原文（10行）</summary>

```text
    // 本 turn 已经排过一条（followup 排在 next-turn，事件流里还看不见）→ 不再重复排（issue #19）
    if (turn !== undefined && reflectQueuedTurn.get(sidTs) === turn) return
    if (!sawToolCall) return // 纯聊天轮，不反思
    if (lastToolName !== undefined && lastToolName.startsWith('memory_')) return // 已主动记忆
    if (consecutiveToolSteps(sessionEventsOf(agent.session)) < resolved.reflectTurns) return // 单任务内连续工具 step 不足
    const message = buildReflectMessage(ws, turnText, resolved.projectDir)
    // 反思任务送主会话独立新轮（v0.24 拍板进主会话；2026-09-10 起走 followup 另起
    // 一轮——steer 延续同 turn 会把 AI 的工作汇报顶成中间步骤，见 sendMemoryTurn）。
    // 换模型由下方 agent/request waterfall 承接——本 turn 带 REFLECT_MARKER 时自动覆盖模型。
    if (sendMemoryTurn(agent, message, ws, resolved.projectDir, `reflect sid=${shortSessionId(sidTs)}`)) {
```

</details>

**依据 3 · 源码核查**：[src/dream.ts:438-454](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/dream.ts#L438-L454)

后组继续steer至收尾。

<details>
<summary>查看原文（17行）</summary>

```text
  const rounds: DreamRound[] = storedPlan !== undefined
    ? JSON.parse(storedPlan) as DreamRound[]
    : collectDreamRounds(db, sessionId, ws, dir, rulesReviewDays)
  const nextIdx = lease.group_idx + 1
  if (nextIdx < rounds.length) {
    // CAS 推进：多实例同收 turn-stopping 时只有一个成功，其余跳过
    if (db.advanceDreamLease(sessionId, lease.group_idx, DREAM_LEASE_MS)) {
      armDreamHeartbeat(sessionId, ws, dir) // 热重载后新模块实例没有旧心跳：推进时补挂（幂等）
      const msg = buildDreamMessage(db, sessionId, lease.T, rounds, nextIdx)
      const tag = `dream group ${nextIdx + 1}/${rounds.length}`
      // 后续组用 steer（非 followup）：连在 dream 自己的 turn 里，多组不分轮
      if (safeSteer(agent, msg, ws, dir, tag)) dreamLog(ws, dir, `${tag} steered`)
    }
    return
  }
  // 最后一轮完成 → 收尾
  finalizeDream(db, sessionId, ws, dir, lease.T, 'done', rounds.length, onDreamState)
```

</details>

**依据 4 · 源码核查**：[src/index.ts:1269-1277](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/index.ts#L1269-L1277)

静态guide独立section实际注册。

```text
        ctx.logger.warn('meow-memory: systemPrompt 服务 20s 内未就绪，记忆手册未挂进 system prompt（memory_* 工具不受影响）')
      }
      return
    }
    try {
      const dispose = svc.section({ name: 'meow-memory:guide', order: 130, text: getMemoryGuide() })
      guideRegistered = true
      if (typeof dispose === 'function') toolDisposers.push(dispose)
      ctx.logger.info('meow-memory: guide section registered into system prompt')
```

#### 缺口

- 无同任务净费用、长期错误率和人工维护工时。
  **影响**：不能量化记忆收益或证明自动整理更经济。
  **进一步探讨**：对相同项目任务跑人工笔记/插件，记录正确续接、注入token、整理调用、修正与恢复工时。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 谁可试用，什么未来方向值得验证？

**研究主题**：采用判断、新假设与验证

#### 完整回答

有重复项目续接需求、愿意审阅模型写入的人，可先在可丢弃的单项目库有限试用，不直接导入完整工作历史。先写可验证事实并换会话读回，备份前后行摘要；反思和自动dream可先关闭，手动一轮验收质量与成本后再决定是否启用。外部库应先看内容再信任，信任标记不等于事实背书。

保留条件是正确续接增加、无无关/过期记忆污染，人工改错加费用低于手工笔记。出现跨项目合并、事实被否定却仍注入、模型恢复异常或备份不可恢复时，停相关读写/整理，导出原文与ID并回到可审阅笔记；重装插件不能恢复被覆盖语义。

可验证“项目边界内候选合并与可审阅变更”假设：先按level+项目范围找相似项，再把内容、项目、关键词变化形成可比较记录，对冲突或跨项目候选要求独立处理。相对同level全表首个相似直接覆盖，可能减少误合并且保留撤回依据，代价是更多重复条目、审核步骤和存储。

最小实验用相同措辞不同项目、否定差一个词、全局转项目、已有归档和并发写入，比较误覆盖、重复、人工审核时间和恢复率。若分区显著漏合并、增加负担且不降错误，就推翻或仅对高风险条目启用；当前插件未具备这一完整审阅/撤回方案。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:279-310](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/tools.ts#L279-L310)

直接覆盖是候选审核假设的真实参照。

<details>
<summary>查看原文（32行）</summary>

```text
      // 去重：同 level 找相似条目 → 合并更新
      const existing = db.list(level)
      let merged: MemoryRow | undefined
      for (const r of existing) {
        if (similarity(r.content, content) >= DEDUP_THRESHOLD) {
          merged = r
          break
        }
      }
      if (merged) {
        const patch: MemoryPatch = {
          content,
          importance: Math.max(merged.importance, importance),
        }
        if (project && (level === 'project' || level === 'fact' || level === 'lesson' || level === 'topic' || level === 'rules')) patch.project = project
        if (subcategory && level === 'project') patch.subcategory = subcategory
        if (goal && level === 'topic') patch.goal = goal
        if (level === 'lesson' && corrected) patch.corrected = 1
        patch.keywords = keywords // 显式关键词才覆盖合并目标（能走到这里说明关键词非空）
        db.update(level, merged.id, patch)
        // 写痕迹（v0.23.0）：合并落库也记入 written——压缩重注入第三块回放本会话写过的记忆。
        markWritten(workspace, source_session ?? 'unknown', [merged.id], dir)
        // 读回合并后的实际存储结果（关键词等），让模型知道最终落库形态。
        const after = db.findById(merged.id)?.row
        return {
          ok: true,
          id: merged.id,
          level,
          merged: true,
          keywords: after?.keywords ?? merged.keywords,
          ...(after?.project ? { project: after.project } : {}),
        }
```

</details>

**依据 2 · 源码核查**：[src/inject.ts:549-562](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/inject.ts#L549-L562)

读侧project范围为写侧分区提供已有语义。

<details>
<summary>查看原文（14行）</summary>

```text
  ].filter((r) =>
    (isGlobalScope(r.project) || (currentProject !== null && projectCovers(r.project, currentProject)))
    && r.source_session !== sessionId // 本 session 建立的记忆在上下文里，不命中
    && !seenState.injected.includes(r.id), // 已注入先排除再截断（#67）：先 hitTopK 后过滤，
  ) // top-K 被旧命中占满时本轮会颗粒无收，注入数恒低于上限
  if (hitRows.length === 0) return []
  const query = userText.slice(0, 500)
  const docs = toDocs(hitRows).map((d) => ({
    ...d,
    // 匹配面 = 条目关键词（LLM 提取或自动 bigram；无关键词的旧条目回退内容前 100 字）。
    content: d.keywords.length > 0 ? d.keywords.join(' ') : d.content.slice(0, 100),
  }))
  // 命中专用打分：交集×覆盖率×艾宾浩斯(updated_at)×importance×title 加成（艾宾浩斯开着）。
  const hits = keywordHitScore(query, docs, { k: o.hitTopK })
```

</details>

**依据 3 · 源码核查**：[src/db.ts:830-845](https://github.com/Phant0Meow/dsh-meow-memory/blob/7e53a81af5fb3b6671ef29e89b8f4b251f89f930/src/db.ts#L830-L845)

库快照可作为试验前后对照，但不是逐条撤回历史。

<details>
<summary>查看原文（16行）</summary>

```text
export function backupMemoryDb(workspace: string, dir = '.dsh-meow'): boolean {
  try {
    const dbPath = memoryDbPath(workspace, dir)
    if (!existsSync(dbPath)) return false
    const bakPath = `${dbPath}.bak`
    let dataMtime = statSync(dbPath).mtimeMs
    const walPath = `${dbPath}-wal`
    if (existsSync(walPath)) dataMtime = Math.max(dataMtime, statSync(walPath).mtimeMs)
    if (existsSync(bakPath) && statSync(bakPath).mtimeMs >= dataMtime) return false
    const tmp = `${bakPath}.tmp`
    getDb(workspace, dir).vacuumInto(tmp)
    renameSync(tmp, bakPath)
    return true
  } catch {
    return false
  }
```

</details>

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
