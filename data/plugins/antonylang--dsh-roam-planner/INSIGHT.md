# dsh-roam-planner

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[a449dd1](https://github.com/AntonyLang/dsh-roam-planner/tree/a449dd11442dbd4550209668f20873d561b08875)

<!-- BEGIN META -->
[![npm 30d 88](https://img.shields.io/static/v1?label=npm+30d&message=88&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-roam-planner) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-roam-planner)
<!-- END META -->

> **实现功能**：在 DSH 对话与地图中编辑旅行草稿、冻结候选、采用行程并接入地点路线和可选 MCP。

> **核心亮点**：把对话转为地图可审阅的有状态行程，草稿、候选和最后采用基线分离，减少手工复制。流程明确借鉴上游，DSH适配是本次识别的增量。[Q01](#research-q01) [Q02](#research-q02)

> **风险与缺陷**：模型可通过roam_adopt直接采用，当前接口仅检查candidate状态，没有绑定用户已审阅版本的凭据。冻结不等于人工授权，也不证明路线事实正确。[Q03](#research-q03)

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
  - [Q01 · 行程工作台改变什么交付和分工？](#detail-section-11)
  - [Q02 · 草稿到采用如何接到工具与存储？](#detail-section-12)
  - [Q03 · 候选等于人工确认吗，成本与边界是什么？](#detail-section-13)
  - [Q04 · 可否让采用绑定用户审阅的候选？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要地图核对多日旅行安排的人可把聊天产出落到行程对象，仍需核实事实与真实交通条件。[Q01](#research-q01)

聊天加手工地图可完成同类计划；本插件主要减少搬运并保存状态，不替代旅行事实核验与预订。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 草稿编辑 | 保存日期地点与路线计划 | 写入可使候选失效 |
| 冻结候选 | 留出地图审阅阶段 | 复制草稿，不证明人工审批 |
| 采用行程 | 保留最终基线 | 模型工具可调用，需独立确认 |
| 地点与路线 | 显示真实位置和转场 | 外部来源与密钥条件 |
| 天气查询 | 辅助日期安排 | 预测范围和上游可用性 |
| MCP扩展 | 接铁路和笔记等 | 第三方进程、登录与条款 |
| 规划Skill | 引导检索与核验 | 提示流程不能替代事实和授权 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH ^0.2.1-rc.2与tools/webServer/skills | 启动必需 | 工具、路由和规划Skill | 核心入口不可用 |
| 地理编码、底图、路线网络源 | 对应地图操作必需 | 真实坐标和几何 | 空图或虚线路线 |
| Amap凭据 | 特定搜索可选 | 中文地点与关键词搜索 | 回退能力有限 |
| MCP sidecar环境与登录 | 扩展查询可选 | 铁路和笔记 | 对应数据不可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户安装重启并核对来源 | 地图与工具可用 |
| 草拟 | 模型写地点、填路线 | 用户核对坐标和转场 |
| 审阅 | 冻结候选并由用户检查 | 事实、费用和节奏可接受 |
| 采用 | 明确确认具体内容 | 基线正确，后续编辑另开草稿 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主、模型和地图网络，金额未知 | 安装、测试来源和密钥 | Amap与MCP可选 |
| 持续使用 | 模型、路由和外部查询费用未知 | 核实事实、坐标和行程节奏 | 无API key不等于离线 |
| 失败恢复 | 重试查询与数据资源未知 | 修坐标、重排、确认候选失效 | 采用接口不是独立人工门 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 有状态行程 | 草稿候选基线分离 | 并发与真实恢复 |
| 地图数据接入 | 地点路线与MCP入口 | 地点准确性和来源可用性 |
| 人工审阅 | UI与候选流程 | 用户授权不可绕过保障 |
| 规划效率 | 减少复制机制 | 合格率、费用和复核时间 |

> **思考**：模型可通过roam_adopt直接采用，当前接口仅检查candidate状态，没有绑定用户已审阅版本的凭据。冻结不等于人工授权，也不证明路线事实正确。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把对话转为地图可审阅的有状态行程，草稿、候选和最后采用基线分离，减少手工复制。流程明确借鉴上游，DSH适配是本次识别的增量。[Q01](#research-q01) [Q02](#research-q02)

把对话转为地图可审阅的有状态行程，草稿、候选和最后采用基线分离，减少手工复制。流程明确借鉴上游，DSH适配是本次识别的增量。[Q01](#research-q01) [Q02](#research-q02)

统一effect清理技能、工具、路由、MCP和store具有明确生命周期边界；克隆候选与保留baseline可复用。采用控制仍需区分业务状态、内容版本和用户授权。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

模型可通过roam_adopt直接采用，当前接口仅检查candidate状态，没有绑定用户已审阅版本的凭据。冻结不等于人工授权，也不证明路线事实正确。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用非交易测试行程检查地点、路线、候选与重开草稿，人工确认最终内容。订票、开放时间和现场可行性回官方来源核对；需要严格审批时先明确宿主授权配置。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

状态分离和接线有源码支持；严格人工确认不由当前采用接口保证。外部来源与行程效果未验证，令牌设计为假设。

- 已检查：作者 README、包清单、源码路径 server/trips.js、server/tools.js、index.js、PROVENANCE.md、server/skill.js、skills/travel-planning/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定行程状态、工具、入口与作者来源说明；未执行规划、地图、MCP、测试或真实宿主。
- 下一步：检查会话绑定、候选变更、直接工具采用、跨窗口竞争、外部失败与卸载清理，未执行。

**分析版本**

- **仓库**：[AntonyLang/dsh-roam-planner](https://github.com/AntonyLang/dsh-roam-planner)
- **版本号**：0.2.3（[固定提交 a449dd1](https://github.com/AntonyLang/dsh-roam-planner/tree/a449dd11442dbd4550209668f20873d561b08875)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可绑定候选摘要、revision与一次性用户确认凭据，以模型直接采用、旧候选和跨窗口竞争检验，合法审阅负担过大则否定。未实现。[Q04](#research-q04)

检查会话绑定、候选变更、直接工具采用、跨窗口竞争、外部失败与卸载清理，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 21 | 6271 | 5269 | 647 | — |
| .jsx | source | 9 | 2940 | 2553 | 196 | — |
| .md | source | 3 | 278 | — | — | 3411 |
| .mjs | source | 2 | 176 | 123 | 37 | — |
| .mjs | test | 13 | 1975 | 1678 | 122 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-24），可前往 [GitHub Issues](https://github.com/AntonyLang/dsh-roam-planner/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：检验地图行程工作台与草稿候选采用的贡献及人工确认边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 行程工作台改变什么交付和分工？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向用对话安排多日旅行、需要在地图核对地点和转场的人。合格交付是日期、停靠点与路线可查看并经用户确认的计划，而不是一段看似合理的聊天文本。与手工复制到地图相比，工具写草稿、冻结候选和地图审阅把交付变为有状态行程；与实际订票和住宿交易仍有距离。PROVENANCE 明确借鉴 roam-planner 的草稿候选采用流程和行程词汇，不能将该流程算作本项目原创。可识别贡献在 DSH 的会话绑定、工具、地图及服务组合；旅行可行性仍需地点、开放与交通事实核验，源码不会证明行程正确。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-35](https://github.com/AntonyLang/dsh-roam-planner/blob/a449dd11442dbd4550209668f20873d561b08875/README.md#L3-L35)

作者将对话、地图和候选采用连接为目标交付。

<details>
<summary>查看原文（33行）</summary>

````text
Trip planning inside [DeepSeek Harness](https://github.com/deepseek-ai): talk a plan
into existence, watch it land on a map, and adopt it when it looks right.

The agent edits a **draft**. A candidate is frozen for review, and only an explicit
**Adopt** commits it — so a hallucinated revision can never overwrite a plan you
already accepted.

## Requirements

- DeepSeek Harness `^0.2.1-rc.2` (`engines.dsh`)
- No extra services: no Docker, no database, no API key required

## Install

```text
plugin_manager install_bundle <this package or directory>
```

Then **restart DSH**: the host half loads its tools and `/roam/api` routes at
startup. After the restart the sidebar shows a **Roam Planner** icon, and the
agent gains the `roam_*` tools.

## First run

1. Click the sidebar icon — an empty panel says to ask the agent for a plan.
2. In any conversation:

   > Plan two relaxed days in Suzhou for me and my parents

3. The agent calls `roam_get_snapshot`, `roam_prepare_draft` (place **names**
   only — the host geocodes them) and `roam_fill_routes`. The panel polls every
   few seconds and follows along.
4. `roam_save_candidate` freezes the plan; a green **Adopt plan** button appears.
````

</details>

**依据 2 · 作者声明**：[PROVENANCE.md:3-15](https://github.com/AntonyLang/dsh-roam-planner/blob/a449dd11442dbd4550209668f20873d561b08875/PROVENANCE.md#L3-L15)

明确行为借鉴范围，约束贡献归属。

<details>
<summary>查看原文（13行）</summary>

```text
This package is an independent MIT implementation. It shares no source code with
TREK or roam-planner.

## Behaviour we deliberately studied

Read from the roam-planner repository (`E:\Antony\Documents\SAD\roam-planner`) to
understand the product, never to copy:

- the draft → candidate → adopt flow: the model edits a draft, a candidate is
  produced for the user, and only an explicit adopt commits the trip;
- the idea that a tool result carries a trip id back to the conversation so a
  later turn resumes the same trip;
- the field vocabulary of a trip (day, stop, leg, revision, status).
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 草稿到采用如何接到工具与存储？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

updateDraft 将修改保存为新 revision，并丢弃旧候选；saveCandidate 克隆草稿并增加候选版本；adoptCandidate 只接受 candidate 状态，把冻结内容复制为 adopted，同时保留 baseline 供后续草稿比较。该结构避免普通草稿编辑直接替换最后采用快照，属于可复用的状态分离。入口统一在 effect 注册 Skills、工具和路由，卸载依次清理并关闭 MCP 和 store。地理编码、路线、底图和天气依赖外部数据源，所谓无额外服务或API key是可启动条件，不代表离线规划或零网络依赖；可选Amap和MCP又增加密钥、进程及第三方许可。

#### 证据与依据

**依据 1 · 源码核查**：[server/trips.js:334-355](https://github.com/AntonyLang/dsh-roam-planner/blob/a449dd11442dbd4550209668f20873d561b08875/server/trips.js#L334-L355)

草稿修订与候选失效形成状态分离。

<details>
<summary>查看原文（22行）</summary>

```text
    const title = hasTitle ? normalizeTitle(patch.title) ?? record.title : record.title
    const days = hasDays ? normalizeDays(patch.days) : record.days
    const material = title !== record.title || JSON.stringify(days) !== JSON.stringify(record.days)
    const candidateDropped = state.candidates[id] !== undefined
    if (!material && record.status === STATUS_DRAFT && !candidateDropped) {
      return { tripId: id, revision: record.revision, status: record.status }
    }

    const now = clock()
    const next = {
      ...record,
      title,
      days,
      status: STATUS_DRAFT,
      revision: record.revision + 1,
      updatedAt: now,
    }
    state.trips[id] = next
    state.drafts[id] = { tripId: id, title, days: clone(days), revision: next.revision, updatedAt: now }
    delete state.candidates[id]
    await persist()
    return { tripId: id, revision: next.revision, status: next.status }
```

</details>

**依据 2 · 源码核查**：[server/trips.js:358-415](https://github.com/AntonyLang/dsh-roam-planner/blob/a449dd11442dbd4550209668f20873d561b08875/server/trips.js#L358-L415)

候选克隆、状态检查与baseline保存支持机制判断。

<details>
<summary>查看原文（58行）</summary>

```text
  /** Freeze the draft into a candidate (`version` increments, `revision` does not). */
  async function saveCandidate(tripId) {
    await ensure()
    const id = requireString(tripId, 'tripId')
    const record = state.trips[id]
    if (!record) throw bad('trip-not-found', `trip '${id}' was not found`, 404)
    assertStoredTrip(record, id)
    if (record.status === STATUS_ADOPTED) throw bad('trip-adopted', `trip '${id}' is adopted; a candidate can no longer be saved`, 409)
    if (record.status === STATUS_CANDIDATE) throw bad('already-candidate', `trip '${id}' is already a candidate`, 409)

    const now = clock()
    const version = record.version + 1
    state.candidates[id] = {
      tripId: id,
      title: record.title,
      days: clone(record.days ?? []),
      version,
      revision: record.revision,
      createdAt: now,
    }
    const next = { ...record, status: STATUS_CANDIDATE, version, updatedAt: now }
    state.trips[id] = next
    await persist()
    return { tripId: id, status: next.status, version, revision: next.revision }
  }

  /** Commit the candidate. Only a candidate can be adopted, exactly once. */
  async function adoptCandidate(tripId) {
    await ensure()
    const id = requireString(tripId, 'tripId')
    const record = state.trips[id]
    if (!record) throw bad('trip-not-found', `trip '${id}' was not found`, 404)
    assertStoredTrip(record, id)
    if (record.status !== STATUS_CANDIDATE) {
      throw bad('not-candidate', `trip '${id}' is '${record.status}'; only a candidate can be adopted`, 409)
    }
    const candidate = state.candidates[id]
    if (!isObject(candidate)) throw bad('candidate-missing', `trip '${id}' has no candidate snapshot`, 409)

    const now = clock()
    const next = {
      ...record,
      title: candidate.title,
      days: clone(candidate.days ?? []),
      status: STATUS_ADOPTED,
      revision: record.revision + 1,
      updatedAt: now,
      // The last committed plan, kept so a later draft can be compared with it.
      baseline: {
        title: candidate.title,
        days: clone(candidate.days ?? []),
        at: now,
      },
    }
    state.trips[id] = next
    delete state.candidates[id]
    delete state.drafts[id]
    await persist()
```

</details>

**依据 3 · 源码核查**：[index.js:246-269](https://github.com/AntonyLang/dsh-roam-planner/blob/a449dd11442dbd4550209668f20873d561b08875/index.js#L246-L269)

统一注册和清理体现生命周期接线。

<details>
<summary>查看原文（24行）</summary>

```text
  ctx.effect(() => {
    const skills = registerBundledSkills(ctx, skillsDir)
    for (const entry of skills.report) {
      if (!entry.ok) ctx.logger?.warn?.(`dsh-roam-planner: skill ${entry.name || '(bundle)'} — ${entry.detail}`)
    }
    const disposeTools = registerTools(ctx, trips, {
      geocoder,
      sources,
      mcp,
      defaultCity: config.defaultCity,
    })
    const disposeRoutes = registerRoutes(ctx, { trips, config, sources, settings, geocoder })
    return async () => {
      try {
        disposeRoutes()
      } finally {
        try {
          disposeTools()
        } finally {
          try {
            skills.dispose()
          } finally {
            mcp.close()
            await store.close()
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 候选等于人工确认吗，成本与边界是什么？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

不等同。roam_adopt 本身注册为模型工具，参数只有 tripId，execute 解析会话行程后直接调用 adoptCandidate，未在该边界要求用户确认令牌或候选摘要。状态机证明必须先有候选，不能证明点击者一定是人或人已审阅该版本。宿主是否另有工具审批不在本次证据中，不能据README推导严格人机授权保障。adoptCandidate也没有expectedRevision入参，对并发编辑的具体持久化序列尚未验证。成本单位应是一份事实核实、路线可走且用户接受的行程；首次安装、外部来源设置，持续模型调用与地图网络、人工事实复核，失败时修坐标和重排都占成本，金额耗时未知。适合非交易场景小范围试用，不应把Adopt状态作为事实正确或用户审批的唯一证明。

#### 证据与依据

**依据 1 · 源码核查**：[server/tools.js:532-560](https://github.com/AntonyLang/dsh-roam-planner/blob/a449dd11442dbd4550209668f20873d561b08875/server/tools.js#L532-L560)

模型工具可直接采用，入参没有确认令牌。

<details>
<summary>查看原文（29行）</summary>

```text
  register({
    name: 'roam_adopt',
    description:
      'Commit the current candidate into the adopted trip. Only a candidate can be adopted, and a trip can be adopted once; a second call fails.',
    parameters: {
      type: 'object',
      properties: { tripId: tripIdProperty },
      required: ['tripId'],
      additionalProperties: false,
    },
    output: {
      schema: {
        type: 'object',
        properties: {
          tripId: { type: 'string' },
          status: statusSchema,
          revision: { type: 'number' },
        },
        required: ['tripId', 'status', 'revision'],
        additionalProperties: false,
      },
      render(_args, value) {
        return textBlock(`Trip ${value?.tripId ?? '?'} adopted at revision ${value?.revision ?? '?'}.`)
      },
    },
    async execute(args, exec) {
      const view = await trips.resolveTrip(sessionKey(exec), requireTripId(args))
      const adopted = await trips.adoptCandidate(view.tripId)
      return { tripId: adopted.tripId, status: adopted.status, revision: adopted.revision }
```

</details>

**依据 2 · 源码核查**：[server/trips.js:385-415](https://github.com/AntonyLang/dsh-roam-planner/blob/a449dd11442dbd4550209668f20873d561b08875/server/trips.js#L385-L415)

采用检查状态与候选存在，未绑定审阅凭据或expectedRevision。

<details>
<summary>查看原文（31行）</summary>

```text
  async function adoptCandidate(tripId) {
    await ensure()
    const id = requireString(tripId, 'tripId')
    const record = state.trips[id]
    if (!record) throw bad('trip-not-found', `trip '${id}' was not found`, 404)
    assertStoredTrip(record, id)
    if (record.status !== STATUS_CANDIDATE) {
      throw bad('not-candidate', `trip '${id}' is '${record.status}'; only a candidate can be adopted`, 409)
    }
    const candidate = state.candidates[id]
    if (!isObject(candidate)) throw bad('candidate-missing', `trip '${id}' has no candidate snapshot`, 409)

    const now = clock()
    const next = {
      ...record,
      title: candidate.title,
      days: clone(candidate.days ?? []),
      status: STATUS_ADOPTED,
      revision: record.revision + 1,
      updatedAt: now,
      // The last committed plan, kept so a later draft can be compared with it.
      baseline: {
        title: candidate.title,
        days: clone(candidate.days ?? []),
        at: now,
      },
    }
    state.trips[id] = next
    delete state.candidates[id]
    delete state.drafts[id]
    await persist()
```

</details>

#### 缺口

- 宿主工具审批与并发编辑持久化行为未核查。
  **影响**：不能判断实际未经确认采用和竞争覆盖概率。
  **进一步探讨**：检查宿主审批设置，并以两入口竞争编辑和采用的受控实验核对。
- 无合格行程任务对照和外部来源可用性数据。
  **影响**：不能量化交付效率、费用或事实错误率。
  **进一步探讨**：用相同旅行约束比较聊天复制地图与工作台的总复核成本。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可否让采用绑定用户审阅的候选？

**研究主题**：新假设与验证

#### 完整回答

可提出未验证的审阅摘要令牌方案，候选冻结时计算内容摘要与revision，地图用户明确确认后产生一次性采用凭据，提交必须同时匹配候选身份、摘要和有效期限；模型工具可请求审阅但不能自行产生凭据。推导来自状态门和授权门的区别。新增成本包括凭据存储、重载与跨窗口确认、候选失效说明及无障碍交互。最小验证让模型尝试直接adopt、在审阅后编辑以及两窗口交错操作，要求旧令牌拒绝且普通草稿不改最后采用基线；若用户无法理解失效或合法操作频繁卡住，应重新设计。该方案未实现，不影响对当前状态分离价值的有限认可。

#### 证据与依据

**依据 1 · 源码核查**：[server/tools.js:532-560](https://github.com/AntonyLang/dsh-roam-planner/blob/a449dd11442dbd4550209668f20873d561b08875/server/tools.js#L532-L560)

采用工具入参边界是审阅令牌方案的推导。

<details>
<summary>查看原文（29行）</summary>

```text
  register({
    name: 'roam_adopt',
    description:
      'Commit the current candidate into the adopted trip. Only a candidate can be adopted, and a trip can be adopted once; a second call fails.',
    parameters: {
      type: 'object',
      properties: { tripId: tripIdProperty },
      required: ['tripId'],
      additionalProperties: false,
    },
    output: {
      schema: {
        type: 'object',
        properties: {
          tripId: { type: 'string' },
          status: statusSchema,
          revision: { type: 'number' },
        },
        required: ['tripId', 'status', 'revision'],
        additionalProperties: false,
      },
      render(_args, value) {
        return textBlock(`Trip ${value?.tripId ?? '?'} adopted at revision ${value?.revision ?? '?'}.`)
      },
    },
    async execute(args, exec) {
      const view = await trips.resolveTrip(sessionKey(exec), requireTripId(args))
      const adopted = await trips.adoptCandidate(view.tripId)
      return { tripId: adopted.tripId, status: adopted.status, revision: adopted.revision }
```

</details>

**依据 2 · 源码核查**：[server/trips.js:370-378](https://github.com/AntonyLang/dsh-roam-planner/blob/a449dd11442dbd4550209668f20873d561b08875/server/trips.js#L370-L378)

冻结候选已具revision和version，可作为绑定起点。

```text
    state.candidates[id] = {
      tripId: id,
      title: record.title,
      days: clone(record.days ?? []),
      version,
      revision: record.revision,
      createdAt: now,
    }
    const next = { ...record, status: STATUS_CANDIDATE, version, updatedAt: now }
```

#### 缺口

- 确认凭据与跨窗口体验未实现。
  **影响**：不能宣称已有严格人工采用门。
  **进一步探讨**：先验证模型不可伪造和旧凭据失效，再观察合法审阅成功率。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
