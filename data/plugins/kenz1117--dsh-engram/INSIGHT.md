# dsh-engram · 记忆宫殿

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[b20f720](https://github.com/kenz1117/dsh-engram/tree/b20f7200e832140e08a582bed12c53dda49fcf22)

<!-- BEGIN META -->
[![GitHub ★ 66](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=66&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kenz1117/dsh-engram) [![npm 30d 13,163](https://img.shields.io/static/v1?label=npm+30d&message=13%2C163&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@kenz1117/dsh-engram) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@kenz1117/dsh-engram)
<!-- END META -->

> **功能**：为 DSH 提供本地 SQLite 分库、跨会话记忆搜索、引用核对、画像注入和管理面板。

> **亮点**：[Q01](#research-q01) 和 [Q03](#research-q03) 把可检索历史、会话引用批次与注入审计接入 DSH。真实任务对照和准确度未复现。

> **主要限制**：[Q02](#research-q02) 的 0.13.9 发布补丁实际指定 light，profile 采用后可能启用宿主 LLM 摄取。[Q03](#research-q03) 的证据门只核对成员和声明，真实作答及数据出口需单独验收。

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
  - [Q01 · 什么连续任务受益，与人工记忆文件如何对照？](#detail-section-11)
  - [Q02 · 宿主怎样装配记忆，项目边界与自动摄取怎样生效？](#detail-section-12)
  - [Q03 · 混合检索与证据门在哪些条件下有效？](#detail-section-13)
  - [Q04 · Node、磁盘、模型和退出成本怎样核对？](#detail-section-14)
  - [Q05 · 能否用独立任务基线验证记忆纠错和证据门？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 用于反复恢复同项目任务及核对最新约束。相比人工笔记，可以按作用域搜历史并追踪引用。

[Q01](#research-q01) 用项目笔记记录已确认规则，再对照跨会话检索与证据核对的任务用时、纠错和上下文开销。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 分库与混合检索 | 找回历史约束 | 向量不可用时可用关键词 |
| 证据批次 | 核对实际返回的引用 | 成员可用和内容真实分开 |
| 画像和摄取 | 按配置跨会话复用 | 核对发布配置、模型路线和范围 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 Node 与 DSH | 是 | SQLite 和宿主工具 | 确认宿主运行时 |
| 可写数据目录 | 是 | 持久库、缓存、日志及导出 | 先分离试用目录 |
| transformers 与模型缓存 | 语义检索需要 | 本地向量 | 可退回关键词 |
| 宿主 LLM 或远程 embedding | 按功能及配置 | 摄取、改写或远程向量 | 核对路由或关闭相关能力 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核对 profile 和数据目录 | 查清实际 ingest 与模型路线 |
| 搜索 | Agent 按 scope 检索并评估引用 | 确认关键词退化或同会话批次 |
| 验收 | 人工核对来源和最新修订 | 证据不足时补查或暂停自动路径 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node、可选模型下载与磁盘，实际未知 | 核对 profile、分库和模型来源 | 发布补丁 light 与文档默认不同 |
| 持续使用 | 累计数据库、缓存与辅助模型 token 未测 | 核对记忆错误、来源与数据去向 | 模型与用户工作负载决定开销 |
| 失败恢复 | 重嵌、模型重试及数据恢复资源未知 | 查日志、作用域和是否退化 | 本地搜索可退到 FTS |
| 退出 | 保留的库、缓存和导出空间未知 | 盘点并按授权留存 | 导出脱敏默认未选 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 检索与记忆路由 | 分库、关键词与向量融合 | 同任务的准确和新记忆可见 |
| 引用核对 | 会话内批次与成员检查 | 事实正确、反证与最终答复是否采用 |
| 降级 | 向量不可用时可保留关键词 | 冷启动和真实负载表现 |

> **思考**：[Q02](#research-q02) 的 0.13.9 发布补丁实际指定 light，profile 采用后可能启用宿主 LLM 摄取。[Q03](#research-q03) 的证据门只核对成员和声明，真实作答及数据出口需单独验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q03](#research-q03) 把可检索历史、会话引用批次与注入审计接入 DSH。真实任务对照和准确度未复现。

[Q02](#research-q02) 运行时配置、发布配置及模型路线要分别检查。[Q03](#research-q03) 批次只收录已实际输出的条目，门禁判定保持可审计。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的 0.13.9 发布补丁实际指定 light，profile 采用后可能启用宿主 LLM 摄取。[Q03](#research-q03) 的证据门只核对成员和声明，真实作答及数据出口需单独验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 隔离 profile 中先核对实际自动摄取、模型出口、导出路径和退化，再用非敏感样本核对最新纠正。发现作用域或出口不明时停止自动路径。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持分库、画像、检索和证据批次。0.13.9 精确发布补丁已核对。真实宿主合成、模型调用与收益未执行。

- 已检查：作者 README、包清单、源码路径 README.md、src/tools/create.ts、src/index.ts、package.json、cordis.patch.yml、src/config.ts、src/project/identity.ts、src/ingest/hook.ts、src/llm/client.ts、src/store/sqlite.ts、src/retrieve/evidence.ts、src/embedder/local.ts、src/embedder/remote.ts、src/routes.ts、docs/evaluation-baseline-v15.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定根 DSH 接线、摄取、分库、搜索、证据门、依赖及面板代表路径。静态读取 npm 0.13.9 固定发布补丁，未安装或执行目标、宿主、模型和测试。
- 下一步：[Q05](#research-q05) 固定同任务的来源、修订和真实答案，在同一模型做对照，记录误引、漏答、辅助 token 和人工时。

**分析版本**

- **仓库**：[kenz1117/dsh-engram](https://github.com/kenz1117/dsh-engram)
- **版本号**：0.13.9（[固定提交 b20f720](https://github.com/kenz1117/dsh-engram/tree/b20f7200e832140e08a582bed12c53dda49fcf22)）
- **版本日期**：2026-11-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设把关键主张与原文跨度和修订状态绑定，可降低引用真实却答错的问题。对照现有批次门和项目笔记，计入误拒和时间。

[Q05](#research-q05) 固定同任务的来源、修订和真实答案，在同一模型做对照，记录误引、漏答、辅助 token 和人工时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 26 | 5312 | — | — | 89085 |
| .js | source | 3 | 1054 | 937 | 45 | — |
| .mjs | source | 9 | 1439 | 1010 | 315 | — |
| .ts | source | 96 | 28112 | 20214 | 6520 | — |
| .tsx | source | 21 | 8256 | 6569 | 1335 | — |
| .ts | test | 63 | 14244 | 11875 | 1109 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/kenz1117/dsh-engram/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 28](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=28&color=737b86&logo=github)](https://github.com/kenz1117/dsh-engram/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 25](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=25&color=737b86&logo=github)](https://github.com/kenz1117/dsh-engram/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 的跨会话记忆能在何种范围内检索与核对，何时会降级或给出不足以作答的证据？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么连续任务受益，与人工记忆文件如何对照？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在同一仓库反复恢复编码时，用户可检索上次确认过的约束、来源与冲突，例如更换测试工具后辨认最新决定。人工项目笔记更新清楚且容易审阅，Engram 给 Agent 侧查询加上作用域、记忆 ID、证据引用及批次，并记录实际注入包。画像使用个人库当前条目和手工画像。会话注入内容变化和压缩时重新判断，读者仍需查原说明。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:75-88](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/README.md#L75-L88)

作者比较本地库、关键词与文件型记忆。

<details>
<summary>查看原文（14行）</summary>

```text
## 为什么是它

记忆插件不少，但多数要你先准备一整套基础设施。这里是三条主流路线与本插件的对照（对照对象为各项目公开 README 与 npm 依赖声明）：

| | **dsh-engram** | 服务端型（Postgres/pgvector/Milvus/Python 服务） | 文件型（纯 Markdown 记忆） |
|---|---|---|---|
| 安装成本 | 一条 npm 命令，**装完即用** | Docker + 数据库 + 向量库 + 迁移 | 一条 npm 命令 |
| 外部依赖 | **无**：嵌入模型离线推理，失败自动降级纯关键词并显式标记 | 必装，通常还要 LLM API Key | 无 |
| agent 工具面 | **23 个窄参数工具**，覆盖保存/检索/事实链/时间线/审计/导出/蒸馏/信念/复习全生命周期 | 常见 1–3 个（只给检索） | 常见 0–1 个 |
| 证据门 | **有**：`engram_assess` 由代码强制「声称充足 + 本批次有效证据 + nextStrategy=answer」三者齐备才判充足 | 一般无 | 一般无 |
| 审计 | 来源会话/轮次/seq 三级溯源 + 取代链 + 矛盾边 + op_log 全量流水 | 通常只有日志 | 无 |
| 复习 | **SM-2 间隔重复**：只给坐标与门牌线索，不给正文，先回忆后揭示 | 无 | 无 |
| 注入防护 | 协议标签防提示注入 + 入库脱敏 + 召回占位防自强化回声 | 无 | 无 |
| 可携带 | Markdown / JSON 导出 + Obsidian/Logseq 友好镜像 | 看实现 | 本来就是文件 |
```

</details>

**依据 2 · 源码核查**：[src/tools/create.ts:748-768](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/tools/create.ts#L748-L768)

实际输出来源坐标和批次。

<details>
<summary>查看原文（21行）</summary>

```text
      const candidates = merged.map((hit, index) => {
        const ref = evidenceRefOf(hit.record.scope, hit.record.id, hit.record.slot, deps.language)
        const edge = hit.viaEdge === undefined ? '' : message('tool.searchViaEdge', { type: hit.viaEdge.type, from: hit.viaEdge.from })
        const slot = hit.record.slot === undefined ? '' : ` ${roomLabel(hit.record.slot.room, deps.language)}#${hit.record.slot.index}`
        const date = message('tool.searchCreatedAt', { date: new Date(hit.record.createdAt).toISOString().slice(0, 10) })
        const cues = hit.cues === undefined ? '' : message('tool.searchNeighborCues', { cues: hit.cues.neighbors.join(', ') })
        const notes = factNotes.get(String(hit.record.id))
        const facts = notes === undefined ? '' : message('tool.searchAsOfFacts', { facts: notes.join(message('tool.separatorSemicolon')) })
        return {
          ref,
          line: `${index + 1}. [${hit.record.scope}/${hit.record.kind}]${slot}${date} ${truncateItem(hit.record.content)}${message('tool.searchHitIdRef', { id: hit.record.id, ref })}${edge}${cues}${facts}`,
        }
      })
      const { kept, dropped } = fitWithinBudget(candidates, entry => entry.line.length, RECALL_TOTAL_CHARS)
      const lines = kept.map(entry => entry.line)
      if (dropped > 0) lines.push(message('store.budgetDropped', { count: dropped }))
      // 证据门：把本次真正输出的 ref 登记成批次，engram_assess 只能引用这里登记过的 ref。
      const sessionId = exec.agent === undefined ? undefined : String(exec.agent.session.id)
      const batch = sessionId === undefined || kept.length === 0
        ? undefined
        : evidenceBatches.register(sessionId, kept.map(entry => entry.ref))
```

</details>

**依据 3 · 源码核查**：[src/index.ts:410-427](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/index.ts#L410-L427)

画像读个人库，考虑压缩和是否开启。

<details>
<summary>查看原文（18行）</summary>

```text
  // 摄取和证据提醒可以独立开启；关闭画像后不再查询或拼装画像包。
  if (!resolved.injectProfile) return decision
  // #32：画像「always present」不能只靠 step===1 的首轮注入——会话压缩（compaction）
  // 会把注入的快照摘要掉，而 step 在压缩/恢复后永远不会再等于 1，画像从此缺席直到
  // 重开对话。自上次注入以来出现 compaction/end 事件时，任何一轮都重新注入；哈希去重
  // 只在无压缩时生效（压缩后即使内容未变也要重注——旧包已不在上下文）。
  // 已知边界：应用重启后 state 清空，重启之前发生的压缩无法感知（此时历史快照仍在，
  // 保守不重注）；纯恢复（无压缩）时快照仍在历史里，维持不重注。
  const compactionCount = (agent.session.snapshotEvents() as unknown as readonly SessionEventLike[])
    .filter(event => event.type === 'compaction/end').length
  const compacted = sessionState.lastProfileCompactions !== null && compactionCount > sessionState.lastProfileCompactions
  if (sessionState.lastProfileCompactions === null) sessionState.lastProfileCompactions = compactionCount
  if (step !== 1 && !compacted) return decision
  const store = await openStore('user')
  // curated block：engram_profile_edit 维护的画像段，优先于自动派生画像注入。
  const curated = await store.getProfileBlock('user')
  const top = await store.topActive('user', resolved.profileTopN)
  if (top.length === 0 && curated === undefined) return decision
```

</details>

**依据 4 · 源码核查**：[src/index.ts:488-519](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/index.ts#L488-L519)

按会话哈希去重并写入实际注入包。

<details>
<summary>查看原文（32行）</summary>

```text
  // 每个 session 独立去重；新会话天然没有旧 hash，不与相邻会话共享状态。
  const dueLine = dueTotal === 0
    ? ''
    : message('core.reviewDue', { count: dueTotal, plus: dueTotal >= 50 ? '+' : '' })
  const reflectPendingLine = reflectPending === 0
    ? ''
    : message('core.reflectPending', { count: reflectPending })
  const textWithRationale = wrapWithRationale(text, top) + dueLine + reflectPendingLine
  // Профиль входит в хеш: правка правил без изменения памяти тоже должна переинжектиться.
  const hash = createHash('sha256').update(`${parts.curated ?? ''}\n${textWithRationale}`).digest('hex')
  if (!compacted && hash === sessionState.lastProfileHash) return decision
  sessionState.lastProfileHash = hash
  sessionState.lastProfileCompactions = compactionCount
  // 画像包协议标签：记忆条目是不可信历史上下文；当前请求取本轮 admitted 消息的最后一个文本块。
  // Правила профиля идут отдельным пакетом и первыми: это указания человека, а не память,
  // и шапка пакета памяти к ним не относится (решение 21.10).
  const requestText = currentUserRequestText(decision.messages)
  // 哈希、会话日志和模型必须看到同一最终文本：rationale 与 due 行不能只参与去重。
  const memoryPacket = renderMemoryPacket(textWithRationale, 'turn_start', requestText)
  const packet = parts.curated === undefined
    ? memoryPacket
    : `${renderProfilePacket(parts.curated)}\n\n${memoryPacket}`
  const packetHash = createHash('sha256').update(packet).digest('hex')
  try {
    await store.recordInjection({
      sessionId,
      packetHash,
      packet,
      memoryIds: top.map(record => record.memoryId),
      hasCurated: parts.curated !== undefined,
      compactionCount,
    })
```

</details>

#### 缺口

- 当前仓库有作者自建回归集，缺独立多项目对照和真实任务的错误率、维护人时。
  **影响**：无法外推纠错及时性或比手工笔记更准确。
  **进一步探讨**：用相同任务比较笔记和插件的最新约束采用率、证据回查和人工时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主怎样装配记忆，项目边界与自动摄取怎样生效？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主通过 bundle 挂载工具和事件，pre-step 先等待下游判定，拒绝就退出。项目工具按会话 cwd 归属，已有 origin 按归一化 remote 算库名，缺失则回退 cwd。自动摄取有 cwd 时默认写项目库并按候选判 scope，无 cwd 写个人库，所以分库提供路由而非硬隔离。本体配置缺省 ingest 为 off，README 与补丁注释也称发布关闭，但固定补丁和 npm 0.13.9 归档的实际同字节补丁指定 light。若 profile 采用该配置且未覆盖，下一轮首步可异步摄取上一轮，退出尝试补末轮，失败尽力记 pending，启动后再重放。抽取先剥协议与模式脱敏，之后仍使用宿主模型路线。 npm 归档核查见 [0.13.9 注册表版本](https://registry.npmjs.org/@kenz1117%2Fdsh-engram/0.13.9)，仅下载、校验与读取。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:44-53](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/package.json#L44-L53)

DSH bundle 及客户端声明。

<details>
<summary>查看原文（10行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale"
      ],
      "platform": "web"
    }
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-8](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/cordis.patch.yml#L1-L8)

跟踪补丁实际显式 light，与注释相反。

```text
# dsh-engram bundle patch：dsh plugin add @kenz1117/dsh-engram 时以单条目插入 profile 根，
# 行 id 指向本插件 host 半（注册 engram_ 工具与画像注入）。
# 本地实测配置：开启 light 档自动摄取（发布版不带此 config，默认 off）。
- insert:
    - id: dsh-engram
      name: '@kenz1117/dsh-engram'
      config:
        ingest: 'light'
```

**依据 3 · 作者声明**：[README.md:50-56](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/README.md#L50-L56)

作者称默认关闭摄取。

````text
## 快速开始

```sh
dsh plugin --profile web add @kenz1117/dsh-engram
```

安装后无需配置即可使用（默认分库与模型缓存在 `~/.dsh/engram`，画像注入开启，自动摄取关闭）。
````

**依据 4 · 源码核查**：[src/config.ts:547-568](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/config.ts#L547-L568)

无配置时的 off 和注入、目录默认值。

<details>
<summary>查看原文（22行）</summary>

```text
  // 数据目录跟着宿主的数据根走：`$DSH_HOME` 是宿主的单一事实源（见 @deepseek-ai/dsh-home-paths
  // 的 resolveDshHome：显式值 > `$DSH_HOME` > `~/.dsh`）。此前这里写死 `~/.dsh/engram`，
  // 迁移 home 的机器会把库留在旧盘上，且完全静默（#51）。
  const dshHome = resolveDshHome()
  const legacyDbDir = join(homedir(), '.dsh', 'engram')
  const dbDir = config.dbDir ?? join(dshHome, 'engram')
  return {
    dbDir,
    dshHome,
    dbDirExplicit: config.dbDir !== undefined,
    legacyDbDir,
    legacyMigration: config.legacyMigration ?? 'eager',
    injectProfile: config.injectProfile ?? true,
    profileTopN: config.profileTopN ?? 8,
    modelCacheDir: config.modelCacheDir ?? join(dbDir, 'models'),
    hfEndpoint: config.hfEndpoint,
    ingest: config.ingest ?? 'off',
    reflect: config.reflect ?? 'off',
    language: resolveLanguage(languageSetting ?? 'auto'),
    languageSetting,
    redactWords: config.redactWords ?? [],
    routeOverride: hasProvider && hasModel ? { provider: config.provider!, model: config.model! } : undefined,
```

</details>

**依据 5 · 源码核查**：[src/index.ts:328-349](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/index.ts#L328-L349)

下游裁决先行，已确认的会话状态进入前置钩子。

<details>
<summary>查看原文（22行）</summary>

```text
  const decision = await next()
  if (decision.kind === 'reject') return decision
  const sessionId = String(agent.session.id)
  const sessionState = preStepSession(state, sessionId)
  // Язык дворца смотрит на диалоги (решение 21.10): реплики человека лежат в событиях
  // текущей сессии — для этого не нужно читать журналы, которые стоят сотни мегабайт.
  // Реплик может ещё не быть (первый ход) — тогда сигнала просто нет.
  const observed = dominantLanguage(userTexts(agent.session.snapshotEvents() as unknown as readonly SessionEventLike[]))
  if (observed !== undefined) onDialogueLanguage(observed.language)
  // 记录当前会话在用的路由：历史回填优先复用它——历史日志里的 provider/model 是当年的，
  // 在当前环境可能已不可用（如换过提供商），用当前模型才跑得通。
  if (step === 1) {
    const currentRoute = resolved.routeOverride ?? routeFromEvents(agent.session.snapshotEvents() as unknown as readonly SessionEventLike[])
    if (currentRoute !== undefined) {
      sessionState.route = currentRoute
      state.route = currentRoute
    }
  }
  const mode = resolved.ingest
  // 写入路由：本会话有 cwd 时默认进项目宫殿、逐条采纳模型的 scope 判定；无 cwd 只能进私人宫殿。
  const routing = ingestWriteRouting(sessionCwd(agent.session), openStoreForProjectCwd, openStore)
  if (step === 1 && mode !== 'off') {
```

</details>

**依据 6 · 源码核查**：[src/index.ts:350-387](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/index.ts#L350-L387)

首步重放及后台读上一轮。

<details>
<summary>查看原文（38行）</summary>

```text
    // 重放待补做的末轮摄取（上次会话 disposed 失败/超时的 pending 键）。
    if (!state.pendingReplayed) {
      state.pendingReplayed = true
      void replayPendingIngests({
        openStore: () => openStore('user'),
        resolveSession: makeSessionResolver(ctx, agent),
        resolveStore: openStoreForProjectCwd,
        embedder,
        mode,
        routeOverride: resolved.routeOverride,
        // Провайдер Jev: панель → cordis.yml → маршрут этой сессии (тот же, что у извлечения).
        ...resolveJevField(ctx, resolved.jev, resolved.dbDir, () => sessionState.route?.provider),
        call: params => streamText(ctx, { ...params, sessionId: agent.session.id }),
        logRequest,
        signal,
      }).catch((error: unknown) => {
        console.warn(message('core.warnReplayPendingFailed'), error)
      })
    }
    // 自动摄取：新一轮第一步读上一轮日志。异步执行，失败仅告警计数。
    if (turn > 1) {
      void ingestPreviousTurn({
        events: agent.session.snapshotEvents() as unknown as readonly SessionEventLike[],
        sessionId: String(agent.id),
        turn,
        openStore: () => openStore('user'),
        openAuditStore: () => openStore('user'),
        ...routing,
        embedder,
        mode,
        routeOverride: resolved.routeOverride,
        // Провайдер Jev: панель → cordis.yml → маршрут этой сессии (тот же, что у извлечения).
        ...resolveJevField(ctx, resolved.jev, resolved.dbDir, () => sessionState.route?.provider),
        call: params => streamText(ctx, { ...params, sessionId: agent.session.id }),
        logRequest,
        signal,
      }).catch((error: unknown) => {
        console.warn(message('core.warnIngestPreviousFailed'), error)
```

</details>

**依据 7 · 源码核查**：[src/project/identity.ts:133-139](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/project/identity.ts#L133-L139)

origin hash 与 cwd fallback。

```text
  const legacyDbName = legacyProjectDbName(cwd)
  const configPath = resolveGitConfigPath(cwd)
  const origin = configPath === undefined ? undefined : readOriginUrl(configPath)
  const normalized = origin === undefined ? undefined : normalizeOriginUrl(origin)
  if (normalized === undefined) return { cwd, dbName: cwdProjectDbName(cwd), source: 'cwd', legacyDbName }
  const hash = createHash('sha256').update(normalized).digest('hex').slice(0, 24)
  return { cwd, dbName: `project-${hash}.db`, source: 'origin', legacyDbName }
```

**依据 8 · 源码核查**：[src/index.ts:1092-1111](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/index.ts#L1092-L1111)

项目 DB 按调用 cwd 打开。

<details>
<summary>查看原文（20行）</summary>

```text
  const dbNameForCwd = (cwd: string): string => {
    const cached = cwdDbNames.get(cwd)
    if (cached !== undefined) return cached
    const projectIdentity = resolveProjectIdentity(cwd)
    // 会话 cwd 同样应用旧库迁移策略；结果与告警按 cwd 缓存。
    const migration = migrateProjectDb(resolved.dbDir, projectIdentity, resolved.legacyMigration)
    const warning = migrationWarning(resolved.dbDir, projectIdentity, migration)
    if (warning !== undefined) console.warn(warning)
    cwdDbNames.set(cwd, projectIdentity.dbName)
    return projectIdentity.dbName
  }

  const openStoreForProjectCwd = (cwd: string): Promise<EngramStore> => openDb(dbNameForCwd(cwd))

  /**
   * 工具调用期的项目分库解析：按会话 cwd 归属（缺省回退插件进程目录）。
   * 面板「项目」scope、工具读写与自动摄取的 project 落点因此同一口径。
   */
  const resolveProjectStore = (cwd: string | undefined): Promise<EngramStore> =>
    cwd === undefined ? openStore('project') : openStoreForProjectCwd(cwd)
```

</details>

**依据 9 · 源码核查**：[src/ingest/hook.ts:283-293](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/ingest/hook.ts#L283-L293)

摄取的项目与候选作用域。

<details>
<summary>查看原文（11行）</summary>

```text
export function ingestWriteRouting(
  cwd: string | undefined,
  openProjectStore: (cwd: string) => Promise<EngramStore>,
  openScopeStore: (scope: EngramScope) => Promise<EngramStore>,
): IngestWriteRouting {
  if (cwd === undefined || cwd === '') return { writeScope: 'user', perCandidateScope: false }
  return {
    writeScope: 'project',
    perCandidateScope: true,
    resolveStore: scope => (scope === 'project' ? openProjectStore(cwd) : openScopeStore(scope)),
  }
```

</details>

**依据 10 · 源码核查**：[src/ingest/hook.ts:550-581](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/ingest/hook.ts#L550-L581)

召回占位、模式脱敏、路由及辅助模型输入。

<details>
<summary>查看原文（32行）</summary>

```text
  // 召回占位先行：切片内召回工具的输出替换为占位文本，阻断记忆内容回流成新记忆。
  const scoped = omitRecallToolResults(slice)
  const { texts, minSeq } = collectTexts(scoped, limits.includeAssistant)
  // 入库前协议剥离 + 密钥脱敏；交给提取模型的 userText 同样脱敏。
  const cleaned = texts.map(text => redactSecrets(sanitizeProtocolText(text)))
  if (cleaned.every(text => text === '')) {
    await auditStore.audit(INGEST_SKIP_OP, 'no-user-content', doneKey)
    return { scannedEvents: slice.length, candidates: 0, written: 0, merged: 0, deferred: 0, dropped: 0, skipped: 'no-user-content' }
  }

  const route = deps.routeOverride ?? routeFromEvents(deps.events)
  if (route === undefined) {
    // 路由取自会话日志自身，对既有历史是确定性的：无路由头的历史轮不会再有路由。
    await auditStore.audit(INGEST_SKIP_OP, 'no-route-in-log', doneKey)
    return { scannedEvents: slice.length, candidates: 0, written: 0, merged: 0, deferred: 0, dropped: 0, skipped: 'no-route-in-log' }
  }

  // 防回声室附注：上一轮调用过召回工具时，提示提取模型既有记忆的复述不是新信息。
  const recallNote = hasRecallToolCalls(scoped)
    ? message('llm.ingestRecallNote')
    : ''
  // 单块提取调用：每次真实调用先 logRequest（model-visible ⟺ logged）。空答案（推理预算
  // 耗在思考上）重试一次——旧实现的重试调用漏记 logRequest，一并补上。解析失败抛
  // ExtractFailure，由 extractChunked 的调用方按 reason 分类报告。
  const callExtract = async (texts: readonly string[]): Promise<unknown[]> => {
    const userText = `${message('llm.ingestUserPrompt')}\n${JSON.stringify(texts)}${recallNote === '' ? '' : `\n${recallNote}`}`
    deps.logRequest({ route, round, userText, maxTokens: INGEST_MAX_TOKENS, mode: deps.mode })
    const args = {
      route,
      system: ingestSystemPrompt(),
      userText,
      maxTokens: INGEST_MAX_TOKENS,
```

</details>

**依据 11 · 源码核查**：[src/llm/client.ts:113-129](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/llm/client.ts#L113-L129)

将输入交宿主 LLM 流。

<details>
<summary>查看原文（17行）</summary>

```text
  const messages: Message[] = [createUserMessage({
    content: [{ type: 'text', text: params.userText }],
    source: { kind: 'plugin:dsh-engram' },
  })]
  const options: GenerateOptions = {
    provider: params.route.provider,
    model: params.route.model,
    messages,
    system: params.system,
    maxTokens: params.maxTokens,
    sessionId: params.sessionId as never as NonNullable<GenerateOptions['sessionId']>,
    purpose: params.purpose as NonNullable<GenerateOptions['purpose']>,
    signal: params.signal,
  }
  const assembler = new BlockAssembler()
  for await (const chunk of ctx.llm.stream(options)) {
    assembler.push(chunk)
```

</details>

**依据 12 · 源码核查**：[src/index.ts:1840-1858](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/index.ts#L1840-L1858)

钩子真实注册与退出分支。

<details>
<summary>查看原文（19行）</summary>

```text
  if (resolved.injectProfile || resolved.ingest !== 'off' || resolved.assessReminder) {
    ctx.on('agent/pre-step', (payload, next) => preStep(ctx, openStore, openStoreForProjectCwd, resolved, embedder, preStepState, logIngestRequest, observeDialogueLanguage, payload, next), { prepend: true })
  }

  // 会话结束即释放该会话的证据批次（进程内注册表，避免长驻进程累积）。
  ctx.on('session/disposed', (session) => {
    const sessionId = String(session.id)
    evidenceBatches.clear(sessionId)
    preStepState.sessions.delete(sessionId)
  })

  if (resolved.ingest !== 'off') {
    // 末轮摄取闭环：disposed 是 fire-and-forget 观察器（宿主不等待），5 秒超时；
    // 失败/超时由 ingestFinalTurn 落 pending 键，下次会话首次 pre-step 重放补做。
    // 必须挂 .catch：宿主把未处理的 rejection 当致命错误（installFailLoud → process.exit），
    // 而 dispose 时会话事件源可能已 detach——任何逃逸异常都会变成整个 DSH 进程退出。
    ctx.on('session/disposed', (session) => {
      const mode = resolved.ingest
      if (mode === 'off') return
```

</details>

**依据 13 · 源码核查**：[src/index.ts:1863-1878](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/index.ts#L1863-L1878)

退出异步、指定短超时。

<details>
<summary>查看原文（16行）</summary>

```text
      void ingestFinalTurn({
        events,
        sessionId,
        turn: 0,
        slice: 'last',
        openStore: () => openStore('user'),
        openAuditStore: () => openStore('user'),
        // 末轮补做同样按该会话的 cwd 落项目宫殿并逐条判 scope。
        ...ingestWriteRouting(cwd, openStoreForProjectCwd, openStore),
        embedder,
        mode,
        routeOverride: resolved.routeOverride,
        ...resolveJevField(ctx, resolved.jev, resolved.dbDir, () => (resolved.routeOverride ?? routeFromEvents(events))?.provider),
        call: params => streamText(ctx, { ...params, sessionId: session.id }),
        logRequest: logIngestRequest,
        signal: AbortSignal.timeout(FINAL_INGEST_TIMEOUT_MS),
```

</details>

**依据 14 · 源码核查**：[src/ingest/hook.ts:736-761](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/ingest/hook.ts#L736-L761)

末轮可重试失败和 pending 持久化异常退让。

<details>
<summary>查看原文（26行）</summary>

```text
export async function ingestFinalTurn(deps: IngestDeps): Promise<IngestOutcome | null> {
  /** 末轮轮次号；取不到（无 turn/start 或事件源不可用）时不落 pending——键需要轮次。 */
  let round: number | undefined
  const persistPending = async (): Promise<void> => {
    if (round === undefined) return
    try {
      await markPendingIngest(await (deps.openAuditStore ?? deps.openStore)(), deps.sessionId, round)
    } catch {
      // pending 落库失败：摄取本就尽力而为，不再升级。
    }
  }
  try {
    round = lastTurnNumber(deps.events)
    if (round === undefined) return null
    const outcome = await ingestPreviousTurn({ ...deps, slice: 'last' })
    // 提取器用返回值报告的可重试失败与异常走同一恢复出口；确定性 skip 不落 pending。
    if (outcome.skipped === 'empty-answer'
      || outcome.skipped === 'unparseable-output'
      || outcome.skipped === 'all-candidates-failed') {
      await persistPending()
    }
    return outcome
  } catch (error) {
    await persistPending()
    console.warn(message('llm.warnFinalIngestFailed'), error)
    return null
```

</details>

#### 缺口

- 未运行宿主进行实际 profile 合成，未验证失败恢复、最新记忆可见性和脱敏覆盖。
  **影响**：不能把代码默认值当发行默认，也不能由本地 SQLite 推出处理内容始终不出设备。
  **进一步探讨**：检查合成配置、辅助模型输出路径和双项目同 origin 与无 origin 的实际落库。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 混合检索与证据门在哪些条件下有效？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

查询可经辅助改写后并发读所选 scope。SQLite 为关键词与向量用排名融合，正常向量池的维度不符时保留 FTS 并标记退化。搜索按字符预算截取，只把实际输出的引用注册给本会话。assess 查当前 session 的 batch，筛掉未登记引用，并在模型声明充分、至少一条登记引用且下一步为 answer 时给出充分。它检查成员关系，未核验这条记忆是否真实、相关、最新或支持具体结论。前置提醒添加消息，允许解释不评估，未见对最终回答的硬阻断。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/create.ts:682-715](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/tools/create.ts#L682-L715)

查询改写、scope、实际查找及融合。

<details>
<summary>查看原文（34行）</summary>

```text
    async execute(args, exec) {
      const input = args as { query: string; scope?: unknown; room?: unknown; limit?: number; asOf?: unknown }
      const scopes = scopesOf(input.scope)
      const rooms = typeof input.room === 'string' && input.room.trim() !== ''
        ? [resolveRoomInput(input.room) ?? input.room.trim()]
        : undefined
      // limit 与其余列表工具同规矩（parseCountParam）：超界报错并告知合法范围，
      // 模型可以自行修正——裸收模型传来的数会把 10⁶ 限页变成全库捞取。
      // `?? undefined`：JSON 里显式 null 与旧实现 `?? 8` 的走向一致（取缺省）。
      const limit = parseCountParam(input.limit ?? undefined, 'engram_search', 'limit', 8, 1, 50)
      const asOfMs = parseTimeParam(typeof input.asOf === 'string' ? input.asOf : undefined, 'engram_search', 'asOf')
      // 多查询改写：辅助 LLM 可用时生成 ≤3 个互补查询分别检索后 RRF 融合；
      // 失败/不可用降级原查询单查。多查询各自记录 search-exposure 审计，
      // 但曝光不再改变 accessCount/confidence；有效反馈只走 reportOutcome/reinforce。
      const rewrite = await rewriteQueries(deps, exec, input.query)
      const retrievals = await Promise.all(rewrite.queries.map(async (queryText) => {
        const vector = await queryVectorOf(deps, queryText)
        const results = await Promise.all(scopes.map(async (scope) => {
          const store = await deps.openStore(scope)
          return store.search({ text: queryText, scopes: [scope], limit, ...(rooms === undefined ? {} : { rooms }) }, vector)
        }))
        return {
          hits: results.flatMap(result => result.hits).sort((a, b) => b.score - a.score).slice(0, limit),
          degraded: results.some(result => result.degraded),
        }
      }))
      const degraded = retrievals.some(retrieval => retrieval.degraded)
      const merged = mergeQueryResults(
        retrievals,
        limit,
        RRF_CONSTANT,
        Math.floor(Math.max(0, limit) / Math.max(1, rewrite.queries.length)),
      )
      // 字符预算：单条 1200、总量 4800（超预算行丢弃并提示，防止长记忆淹没上下文）。
```

</details>

**依据 2 · 源码核查**：[src/store/sqlite.ts:1193-1229](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/store/sqlite.ts#L1193-L1229)

FTS 与向量、维度异常。

<details>
<summary>查看原文（37行）</summary>

```text
    async search(query, queryVector): Promise<SearchResult> {
      const limit = query.limit ?? 8
      type Scored = { score: number; via: SearchHit['via'] }
      const scores = new Map<string, Scored>()

      // 道 1：FTS5 关键词（2-gram OR）。
      const match = ftsMatchExpression(query.text)
      if (match !== undefined) {
        ftsSearch(match, query.scopes, query.rooms).forEach((row, index) => {
          scores.set(row.id, { score: 1 / (RRF_K + index + 1), via: 'fts' })
        })
      }

      // 道 2：向量余弦（active 且带向量的条目全量参与）。
      // 维度不符时这一路整体降级，而不是把检索打掉：写侧已经拒绝异维向量入库，
      // 所以走到这里只可能是「换了模型，库里还是旧模型的向量」——关键词一路照常，
      // 结果里标记 degraded，用户仍能搜到东西，也知道语义一路没参与。
      let degraded = true
      if (queryVector !== undefined) {
        try {
          const matrix = vectorMatrix()
          if (matrix === undefined) {
            // 空池：向量道无事可做，不算降级（与旧行为一致——空池 ranked=[] 也不降级）。
            degraded = false
          } else if (matrix === 'overflow') {
            // 超打包上限：逐行流式扫（分配多但内存有界；这个量级该换 sqlite-vec）。
            const ranked = vectorPool(query.scopes, query.rooms)
              .map(row => ({ id: row.id, sim: cosine(queryVector, blobToVec(row.embedding!)) }))
              .filter(entry => entry.sim >= MIN_COSINE)
              .sort((a, b) => b.sim - a.sim)
              .slice(0, RANK_POOL)
            ranked.forEach((entry, index) => { addScore(scores, entry.id, 1 / (RRF_K + index + 1), 'vec') })
            degraded = false
          } else {
            if (queryVector.length !== matrix.dim) {
              throw new EngramError('EMBEDDER_DIMENSION_MISMATCH', message('store.embedderDimensionMismatch', { expected: matrix.dim, found: queryVector.length }))
            }
```

</details>

**依据 3 · 源码核查**：[src/store/sqlite.ts:1243-1258](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/store/sqlite.ts#L1243-L1258)

正常向量与维度退化分支。

<details>
<summary>查看原文（16行）</summary>

```text
            hits.slice(0, RANK_POOL).forEach((hit, index) => {
              addScore(scores, matrix.ids[hit.index]!, 1 / (RRF_K + index + 1), 'vec')
            })
            degraded = false
          }
        } catch (error) {
          if (!isDimensionMismatch(error)) throw error
          if (!warnedDegradedRead) {
            warnedDegradedRead = true
            console.warn(message('store.embedderDimensionMismatch', {
              expected: storedDim ?? queryVector.length,
              found: queryVector.length,
            }))
          }
        }
      }
```

</details>

**依据 4 · 源码核查**：[src/tools/create.ts:748-769](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/tools/create.ts#L748-L769)

只登记经过预算保留的引用。

<details>
<summary>查看原文（22行）</summary>

```text
      const candidates = merged.map((hit, index) => {
        const ref = evidenceRefOf(hit.record.scope, hit.record.id, hit.record.slot, deps.language)
        const edge = hit.viaEdge === undefined ? '' : message('tool.searchViaEdge', { type: hit.viaEdge.type, from: hit.viaEdge.from })
        const slot = hit.record.slot === undefined ? '' : ` ${roomLabel(hit.record.slot.room, deps.language)}#${hit.record.slot.index}`
        const date = message('tool.searchCreatedAt', { date: new Date(hit.record.createdAt).toISOString().slice(0, 10) })
        const cues = hit.cues === undefined ? '' : message('tool.searchNeighborCues', { cues: hit.cues.neighbors.join(', ') })
        const notes = factNotes.get(String(hit.record.id))
        const facts = notes === undefined ? '' : message('tool.searchAsOfFacts', { facts: notes.join(message('tool.separatorSemicolon')) })
        return {
          ref,
          line: `${index + 1}. [${hit.record.scope}/${hit.record.kind}]${slot}${date} ${truncateItem(hit.record.content)}${message('tool.searchHitIdRef', { id: hit.record.id, ref })}${edge}${cues}${facts}`,
        }
      })
      const { kept, dropped } = fitWithinBudget(candidates, entry => entry.line.length, RECALL_TOTAL_CHARS)
      const lines = kept.map(entry => entry.line)
      if (dropped > 0) lines.push(message('store.budgetDropped', { count: dropped }))
      // 证据门：把本次真正输出的 ref 登记成批次，engram_assess 只能引用这里登记过的 ref。
      const sessionId = exec.agent === undefined ? undefined : String(exec.agent.session.id)
      const batch = sessionId === undefined || kept.length === 0
        ? undefined
        : evidenceBatches.register(sessionId, kept.map(entry => entry.ref))
      const prefix = degraded && lines.length > 0 ? message('tool.searchDegradedPrefix') : ''
```

</details>

**依据 5 · 源码核查**：[src/tools/create.ts:989-1014](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/tools/create.ts#L989-L1014)

会话批次定位、评估和审计。

<details>
<summary>查看原文（26行）</summary>

```text
    async execute(args, exec) {
      const input = args as { batchId?: unknown; sufficient?: unknown; evidenceRefs?: unknown; missing?: unknown; nextStrategy?: unknown }
      if (typeof input.batchId !== 'string' || input.batchId.trim() === '') throw new Error(message('tool.assessBatchIdRequired'))
      const sessionId = exec.agent === undefined ? undefined : String(exec.agent.session.id)
      const batch = sessionId === undefined ? undefined : evidenceBatches.get(sessionId, input.batchId.trim())
      if (batch === undefined) {
        throw new Error(message('tool.assessBatchNotFound', { batchId: input.batchId, max: MAX_BATCHES_PER_SESSION }))
      }
      const verdict = assessEvidence(batch, {
        sufficient: input.sufficient === true,
        evidenceRefs: Array.isArray(input.evidenceRefs) ? input.evidenceRefs.filter((ref): ref is string => typeof ref === 'string') : [],
        missing: typeof input.missing === 'string' ? input.missing : '',
        nextStrategy: typeof input.nextStrategy === 'string' ? input.nextStrategy : '',
      })
      // 记录判定（收尾提醒据此知道批次已处理、连续不足时升级建议）。
      if (sessionId !== undefined) evidenceBatches.recordVerdict(sessionId, batch.batchId, verdict)
      // 判定结果会回到模型上下文，写入审计日志（不进会话日志——下游插件禁止写未知事件类型）。
      const userStore = await deps.openStore('user')
      await userStore.audit('assess', batch.batchId, JSON.stringify({
        batchId: batch.batchId,
        sufficient: verdict.sufficient,
        refs: verdict.evidenceRefs,
        rejected: verdict.rejectedRefs,
        strategy: verdict.nextStrategy,
      }))
      return { sufficient: verdict.sufficient, nextStrategy: verdict.nextStrategy, text: renderAssessText(verdict, batch.batchId) }
```

</details>

**依据 6 · 源码核查**：[src/retrieve/evidence.ts:208-242](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/retrieve/evidence.ts#L208-L242)

充分的程序判据与拒绝条件。

<details>
<summary>查看原文（35行）</summary>

```text
export function assessEvidence(batch: EvidenceBatch, request: AssessRequest): AssessVerdict {
  const submitted = request.evidenceRefs
    .filter((ref): ref is string => typeof ref === 'string')
    .map(ref => ref.trim())
    .filter(ref => ref !== '')
  const unique = [...new Set(submitted)]
  const limited = unique.slice(0, MAX_EVIDENCE_REFS)
  const droppedRefs = unique.slice(MAX_EVIDENCE_REFS)
  const accepted: string[] = []
  const rejectedRefs: string[] = []
  for (const ref of limited) {
    if (batch.refs.has(ref)) accepted.push(ref)
    else rejectedRefs.push(ref)
  }

  const rawMissing = typeof request.missing === 'string' ? request.missing.trim() : ''
  const missingTruncated = rawMissing.length > MAX_MISSING_CHARS
  const missing = missingTruncated ? `${rawMissing.slice(0, MAX_MISSING_CHARS)}…` : rawMissing

  const requestedStrategy = typeof request.nextStrategy === 'string' ? request.nextStrategy.trim() : ''
  const strategy: NextStrategy = isNextStrategy(requestedStrategy) ? requestedStrategy : 'search_keyword'
  const claimed = request.sufficient === true
  const sufficient = claimed && accepted.length > 0 && strategy === 'answer'
  // 模型声称不充足却给出 answer，或声称充足却拿不出有效证据：改回继续检索。
  const nextStrategy: NextStrategy = sufficient || strategy !== 'answer' ? strategy : 'search_keyword'
  return {
    sufficient,
    evidenceRefs: accepted,
    rejectedRefs,
    droppedRefs,
    missing,
    missingTruncated,
    nextStrategy,
    requestedStrategy,
    forced: claimed !== sufficient || strategy !== requestedStrategy || nextStrategy !== strategy,
```

</details>

**依据 7 · 源码核查**：[src/retrieve/evidence.ts:51-56](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/retrieve/evidence.ts#L51-L56)

提醒允许解释跳过。

```text
export function buildAssessReminder(pendingCount: number, insufficientStreak: number): string | undefined {
  if (pendingCount <= 0) return undefined
  const base = `Evidence gate: ${pendingCount} search batch(es) from this conversation have not been assessed. `
    + 'Before answering, call engram_assess with the batchId and your evidence refs — or briefly state why assessment is not needed.'
  if (insufficientStreak < INSUFFICIENT_HINT_THRESHOLD) return base
  return `${base} Multiple insufficient verdicts in a row — try a different room (engram_search room=), engram_timeline, or ask the user for the missing details.`
```

**依据 8 · 源码核查**：[src/index.ts:391-408](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/index.ts#L391-L408)

前置提醒作为附加消息。

<details>
<summary>查看原文（18行）</summary>

```text
  if (step !== 1 && resolved.assessReminder) {
    // 证据门收尾提醒按 session 去重；批次清空后重置，后续新批次可以再次提醒。
    const pending = evidenceBatches.pendingBatches(sessionId).length
    const reminder = buildAssessReminder(pending, evidenceBatches.insufficientStreak(sessionId))
    if (reminder === undefined) sessionState.lastAssessReminder = null
    if (reminder !== undefined && reminder !== sessionState.lastAssessReminder) {
      sessionState.lastAssessReminder = reminder
      return {
        ...decision,
        messages: [
          ...decision.messages,
          createUserMessage({
            content: [{ type: 'text', text: reminder }],
            source: { kind: `plugin:${name}`, form: 'snapshot', sections: [{ name, text: reminder }] },
          }),
        ],
      }
    }
```

</details>

#### 缺口

- 真实任务的向量召回、降级频率、来源错误与跨项目误引未知。
  **影响**：合法引用仍可被错用，因此不能把 gate 作为事实校验。
  **进一步探讨**：给有效但无关、被新版本替代、跨会话及超预算引用对照，检查工具返回和最终回答。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · Node、磁盘、模型和退出成本怎样核对？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

Node 引擎要求 22.19 线或 24+，SQLite 从 Node 内置模块加载。transformers 是可选依赖，挂载即启动嵌入器，第一次可能访问模型仓；等待至多 15 秒后调用可按未获得向量处理，后台尝试本身仍可继续。配置远程向量后文本将作为 input 发到所选端点，摘要、改写和摄取可另走宿主 LLM。默认面板检查回环 peer 与 Host，启用 LAN 是不同访问边界。试用先用隔离 profile 核对 ingest、queryRewrite、画像、模型路线和输出。导出可选择脱敏预览，缺省为原内容，停用前单独盘点 DB、缓存和副本。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:95-105](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/package.json#L95-L105)

Node 与 DSH peer 引擎声明。

<details>
<summary>查看原文（11行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "*",
    "@deepseek-ai/dsh-agent": "*",
    "@deepseek-ai/dsh-client-ui-layout": "*",
    "@deepseek-ai/dsh-llm": "*",
    "@deepseek-ai/dsh-tools": "*",
    "@deepseek-ai/schemastery": "*"
  },
```

</details>

**依据 2 · 源码核查**：[package.json:125-128](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/package.json#L125-L128)

本地向量引擎是可选依赖。

```text
  },
  "optionalDependencies": {
    "@huggingface/transformers": "^4.3.2"
  },
```

**依据 3 · 源码核查**：[src/store/sqlite.ts:441-445](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/store/sqlite.ts#L441-L445)

真实 SQLite 导入。

```text
export async function openEngramStore(path: string, rankBoost: RankBoostOptions = NO_BOOST, automation: StoreAutomation = DEFAULT_AUTOMATION): Promise<EngramStore> {
  await mkdir(dirname(path), { recursive: true, mode: 0o700 })
  const { DatabaseSync } = await import('node:sqlite')
  const db = new DatabaseSync(path)
  /** 手工事务：BEGIN/COMMIT/ROLLBACK（兼容 ^22.19 引擎范围）。 */
```

**依据 4 · 源码核查**：[src/index.ts:1123-1156](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/index.ts#L1123-L1156)

预热、等待退化与卸载关闭。

<details>
<summary>查看原文（34行）</summary>

```text
  const EMBEDDER_AWAIT_GRACE_MS = 15_000
  let embedderPending: Promise<EngramEmbedder | undefined> | undefined
  const embedderAttempt = (): Promise<EngramEmbedder | undefined> => {
    if (embedderPending === undefined) {
      embedderPending = createEmbedder(resolved, registry, mountLanguage).catch((error: unknown) => {
        console.warn(message('core.warnEmbedderUnavailable'), error)
        embedderPending = undefined
        return undefined
      })
    }
    return embedderPending
  }
  const embedder: EmbedderHandle = {
    then(onfulfilled, onrejected) {
      const attempt = embedderAttempt()
      return Promise.race([
        attempt,
        new Promise<undefined>(resolve => {
          const timer = setTimeout(() => { resolve(undefined) }, EMBEDDER_AWAIT_GRACE_MS)
          void attempt.then(() => { clearTimeout(timer) })
        }),
      ]).then(onfulfilled, onrejected)
    },
  }
  // 预热：挂载即开始加载（旧实现 createEmbedder() 立即执行；句柄化后若无人 await，
  // 首次语义操作才付模型加载延迟——冷启动时首回合候选会拿不到向量且无补救重嵌）。
  void embedderAttempt()
  // Эмбеддер держит ONNX-инстанс и память под модель: при выгрузке плагина его надо
  // отпустить, иначе перемонтирование оставляет в процессе ещё один живой инстанс,
  // а память под модель не возвращается. Закрываем независимо от того, успел ли он
  // загрузиться: обещание разрешается в undefined, если модель не поднялась.
  // peek 而非 then：卸载不该触发一次全新的下载尝试。
  ctx.effect(() => () => {
    void embedderPending?.then(active => active?.close()).catch(() => { /* закрытие не чинится */ })
```

</details>

**依据 5 · 源码核查**：[src/embedder/local.ts:56-69](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/embedder/local.ts#L56-L69)

创建缓存并加载本地管线，下载源可配置。

<details>
<summary>查看原文（14行）</summary>

```text
  if (cached?.dir === cacheDir && sameSpec(cached.spec, spec)) return cached.embedder
  await mkdir(cacheDir, { recursive: true, mode: 0o700 })
  try {
    const { pipeline, env } = await import('@huggingface/transformers')
    env.cacheDir = cacheDir
    if (remoteHost !== undefined && remoteHost !== '') env.remoteHost = remoteHost
    const extractor = await pipeline('feature-extraction', spec.id, { dtype: spec.dtype })
    const embedder: EngramEmbedder = {
      model: spec.id,
      async embed(texts) {
        if (texts.length === 0) return []
        const output = await extractor([...texts], { pooling: spec.pooling, normalize: true })
        const lists = output.tolist() as number[][]
        return lists.map(list => new Float32Array(list))
```

</details>

**依据 6 · 源码核查**：[src/embedder/remote.ts:94-108](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/embedder/remote.ts#L94-L108)

远程 embedding 传文本。

<details>
<summary>查看原文（15行）</summary>

```text
  /** 单次请求；服务端给了 index 就按 index 还原顺序。 */
  const request = async (texts: readonly string[]): Promise<Float32Array[]> => {
    let response: Response
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: requestHeaders(),
        body: JSON.stringify({ model: options.model, input: [...texts], encoding_format: 'float' }),
        signal: AbortSignal.timeout(timeoutMs),
      })
    } catch (error) {
      throw new EngramError(
        'EMBEDDER_REMOTE_FAILED',
        message('store.embedderRemoteUnreachable', { baseUrl: options.baseUrl, timeoutMs }),
        { cause: error },
```

</details>

**依据 7 · 源码核查**：[src/routes.ts:142-164](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/routes.ts#L142-L164)

默认访问守卫与写入条件。

<details>
<summary>查看原文（23行）</summary>

```text
export function guardLoopback(req: IncomingMessage, res: ServerResponse, lan = false): boolean {
  const methodOk = req.method === 'GET' || req.method === 'POST'
  if (!methodOk || !isAllowedPeer(req, lan) || !isAllowedHost(req, lan)) {
    res.writeHead(403, { 'content-type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ error: forbiddenReason(lan) }))
    return false
  }
  return true
}

/** 写操作守卫：Origin 访问面 + Content-Type JSON（导出仅供守卫单元测试，#49）。 */
export function guardWrite(req: IncomingMessage, res: ServerResponse, lan: boolean): boolean {
  if (!isAllowedOrigin(req.headers.origin, lan)) {
    res.writeHead(403, { 'content-type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ error: forbiddenReason(lan) }))
    return false
  }
  if (!(req.headers['content-type'] ?? '').toLowerCase().includes('application/json')) {
    res.writeHead(415, { 'content-type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ error: 'unsupported content-type' }))
    return false
  }
  return true
```

</details>

**依据 8 · 源码核查**：[src/config.ts:575-583](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/config.ts#L575-L583)

提醒、改写及面板默认值。

```text
    assessReminder: config.assessReminder ?? true,
    reflectReminder: config.reflectReminder ?? true,
    rankRecencyWeight: config.rankRecencyWeight ?? 0.2,
    rankProofWeight: config.rankProofWeight ?? 0.1,
    queryRewrite: config.queryRewrite ?? true,
    autoSlot: config.autoSlot ?? true,
    reviewScheduling: config.reviewScheduling ?? true,
    panelAccess: config.panelAccess ?? 'loopback',
    palaceChangeWindowSec: config.palaceChangeWindowSec ?? 30,
```

**依据 9 · 源码核查**：[src/tools/create.ts:1517-1541](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/tools/create.ts#L1517-L1541)

导出格式、范围与显式脱敏。

<details>
<summary>查看原文（25行）</summary>

```text
    name: 'engram_export',
    description: message('tool.exportDescription'),
    parameters: {
      format: { type: 'string', enum: ['markdown', 'json', 'markdown-mirror'], description: message('tool.exportFormatDescription') },
      scope: { type: 'string', enum: ['user', 'project', 'shared', 'all'], description: message('tool.scopeDescriptionAll') },
      redactedView: { type: 'boolean', description: message('tool.exportRedactedDescription') },
    },
    output: {
      schema: { type: 'object', additionalProperties: false, properties: { text: { type: 'string', required: true } } },
      render: (_args, value) => [{ type: 'text', text: value.text }],
    },
    async execute(args) {
      const input = args as { format?: unknown; scope?: unknown; redactedView?: unknown }
      const format = input.format === 'json' ? 'json' : input.format === 'markdown-mirror' ? 'markdown-mirror' : 'markdown'
      const redactedView = input.redactedView === true
      const scopes = scopesOf(input.scope)
      // 脱敏视图：入库清洗可能晚于旧数据，导出前幂等重洗一遍并截断为预览。
      const preview = (content: string): string => {
        const cleaned = redactSecrets(content)
        return cleaned.length > 40 ? `${cleaned.slice(0, 40)}…` : cleaned
      }
      await mkdir(deps.exportDir, { recursive: true, mode: 0o700 })
      const written: string[] = []
      for (const scope of scopes) {
        const data = await (await deps.openStore(scope)).exportAll()
```

</details>

**依据 10 · 源码核查**：[src/index.ts:1065-1081](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/index.ts#L1065-L1081)

插件清理连接，数据存储另行处理。

<details>
<summary>查看原文（17行）</summary>

```text
  const closeStores = async (): Promise<void> => {
    await Promise.allSettled([...stores.values()].map(async pending => {
      try {
        await (await pending).close()
      } catch {
        // 关闭失败无补救动作（连接会随进程退出释放）。
      }
    }))
    stores.clear()
  }

  let stopReflectJobs: (() => Promise<void>) | undefined
  let reflectJobs: HostedReflectWorker | undefined
  ctx.effect(() => async () => {
    await stopReflectJobs?.()
    await closeStores()
  }, 'dsh-engram: close stores')
```

</details>

#### 缺口

- 未测下载大小、模型首次延时、磁盘、辅助 token 或卸载后的文件变化。
  **影响**：只有本地存储路径有源码保证，外发与持续费用取决于配置、依赖和实际调用。
  **进一步探讨**：量化首次下载和冷启动、每轮辅助 token、库及导出增长和恢复人时，核对禁用后无相同后台调用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否用独立任务基线验证记忆纠错和证据门？

**研究主题**：新假设与验证

#### 完整回答

作者已有固定小型回归集，测关键词降级、修订和不相关拒答。新的任务对照可把回答中的关键主张绑定到证据文本跨度和状态版本，要求遇到来源冲突时先提示不足，比较既有批次成员校验、纯项目笔记和增加校对的路径。选择双项目近似约束、新旧修订、问题不相关和相同术语不同含义的样本，盲评误引、漏答、人工分钟及 token。

#### 证据与依据

**依据 1 · 作者声明**：[docs/evaluation-baseline-v15.md:8-24](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/docs/evaluation-baseline-v15.md#L8-L24)

作者基线范围与语料。

<details>
<summary>查看原文（17行）</summary>

```text
## 目标

给 0.12.0 的引擎改动建立可重复、无网络、无外部模型的对照面。它不是替代 LongMemEval；公开集接入仍单独做。当前基线回答三个问题：

1. 相关记忆能否进入 top-k？
2. 知识更新后是否返回当前修订而不是旧版？
3. 无关查询是否被拒答，而不是硬凑记忆？
4. 每个候选是否携带稳定身份、revision、score 和检索通道？

## 语料

- 3 条目标记忆：偏好、项目事实、知识更新链。
- 1 条知识更新链：Jest → Vitest；旧版归档，新版 active。
- 12 条干扰记忆。
- 2 条 episode：目标部署会话 + 无关桌面整理会话。
- 1 条注入回放 fixture。
- 默认 `k=5`，关键词道降级运行（无向量），显式标记 `degraded=true`。
```

</details>

**依据 2 · 作者声明**：[docs/evaluation-baseline-v15.md:26-42](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/docs/evaluation-baseline-v15.md#L26-L42)

作者结果及无真实向量和 LLM 边界。

<details>
<summary>查看原文（17行）</summary>

```text
## 能力与指标

| 能力 | 指标 | v15 基线 |
|---|---|---:|
| recall | Recall@5 / Hit@5 / MRR | 1.00 / 1.0 / 1.00 |
| knowledge-update | 当前修订 top1 + stable memoryId | pass |
| temporal | session 过滤 + 组内时间升序 | pass |
| abstention | 无关查询 top score `<0.05` 或空结果 | 1.00 |
| provenance | stable ID + revision ID + score + via 完整率 | 100%（4/4 retrieval cases） |
| injection replay | API packet 与实际 packet 逐字一致 | pass |

## 边界

- 这是 DSH 私域 smoke/回归基线，不是公开榜单成绩；不能宣称 LongMemEval 或 LongMemEval-V2 达标。
- 当前基线没有启用真实 embedding 或 LLM rerank，因此测量的是关键词降级路径。
- 拒答阈值 0.05 是 fixture 内阈值，不能直接迁移到生产分布或公开数据集。
- LongMemEval 接入应作为独立后续项：需要外部数据、模型 reader、成本预算和稳定 reader/judge 版本。
```

</details>

**依据 3 · 源码核查**：[src/retrieve/evidence.ts:208-242](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/retrieve/evidence.ts#L208-L242)

当前证据门只检查批次成员及模型声明。

<details>
<summary>查看原文（35行）</summary>

```text
export function assessEvidence(batch: EvidenceBatch, request: AssessRequest): AssessVerdict {
  const submitted = request.evidenceRefs
    .filter((ref): ref is string => typeof ref === 'string')
    .map(ref => ref.trim())
    .filter(ref => ref !== '')
  const unique = [...new Set(submitted)]
  const limited = unique.slice(0, MAX_EVIDENCE_REFS)
  const droppedRefs = unique.slice(MAX_EVIDENCE_REFS)
  const accepted: string[] = []
  const rejectedRefs: string[] = []
  for (const ref of limited) {
    if (batch.refs.has(ref)) accepted.push(ref)
    else rejectedRefs.push(ref)
  }

  const rawMissing = typeof request.missing === 'string' ? request.missing.trim() : ''
  const missingTruncated = rawMissing.length > MAX_MISSING_CHARS
  const missing = missingTruncated ? `${rawMissing.slice(0, MAX_MISSING_CHARS)}…` : rawMissing

  const requestedStrategy = typeof request.nextStrategy === 'string' ? request.nextStrategy.trim() : ''
  const strategy: NextStrategy = isNextStrategy(requestedStrategy) ? requestedStrategy : 'search_keyword'
  const claimed = request.sufficient === true
  const sufficient = claimed && accepted.length > 0 && strategy === 'answer'
  // 模型声称不充足却给出 answer，或声称充足却拿不出有效证据：改回继续检索。
  const nextStrategy: NextStrategy = sufficient || strategy !== 'answer' ? strategy : 'search_keyword'
  return {
    sufficient,
    evidenceRefs: accepted,
    rejectedRefs,
    droppedRefs,
    missing,
    missingTruncated,
    nextStrategy,
    requestedStrategy,
    forced: claimed !== sufficient || strategy !== requestedStrategy || nextStrategy !== strategy,
```

</details>

**依据 4 · 源码核查**：[src/tools/create.ts:989-1014](https://github.com/kenz1117/dsh-engram/blob/b20f7200e832140e08a582bed12c53dda49fcf22/src/tools/create.ts#L989-L1014)

已有结构化审计可作对照。

<details>
<summary>查看原文（26行）</summary>

```text
    async execute(args, exec) {
      const input = args as { batchId?: unknown; sufficient?: unknown; evidenceRefs?: unknown; missing?: unknown; nextStrategy?: unknown }
      if (typeof input.batchId !== 'string' || input.batchId.trim() === '') throw new Error(message('tool.assessBatchIdRequired'))
      const sessionId = exec.agent === undefined ? undefined : String(exec.agent.session.id)
      const batch = sessionId === undefined ? undefined : evidenceBatches.get(sessionId, input.batchId.trim())
      if (batch === undefined) {
        throw new Error(message('tool.assessBatchNotFound', { batchId: input.batchId, max: MAX_BATCHES_PER_SESSION }))
      }
      const verdict = assessEvidence(batch, {
        sufficient: input.sufficient === true,
        evidenceRefs: Array.isArray(input.evidenceRefs) ? input.evidenceRefs.filter((ref): ref is string => typeof ref === 'string') : [],
        missing: typeof input.missing === 'string' ? input.missing : '',
        nextStrategy: typeof input.nextStrategy === 'string' ? input.nextStrategy : '',
      })
      // 记录判定（收尾提醒据此知道批次已处理、连续不足时升级建议）。
      if (sessionId !== undefined) evidenceBatches.recordVerdict(sessionId, batch.batchId, verdict)
      // 判定结果会回到模型上下文，写入审计日志（不进会话日志——下游插件禁止写未知事件类型）。
      const userStore = await deps.openStore('user')
      await userStore.audit('assess', batch.batchId, JSON.stringify({
        batchId: batch.batchId,
        sufficient: verdict.sufficient,
        refs: verdict.evidenceRefs,
        rejected: verdict.rejectedRefs,
        strategy: verdict.nextStrategy,
      }))
      return { sufficient: verdict.sufficient, nextStrategy: verdict.nextStrategy, text: renderAssessText(verdict, batch.batchId) }
```

</details>

#### 缺口

- 没有同条件的独立样本运行，增加步骤是否值得未知。
  **影响**：更严格的核对可能增加等待和错误拒答。
  **进一步探讨**：用冻结语料和同一模型检查引文是否支持主张，比较错误下降与额外成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
