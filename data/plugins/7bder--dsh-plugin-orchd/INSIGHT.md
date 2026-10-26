# orchd项目任务面板

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[ef331b3](https://github.com/7bder/dsh-plugin-orchd/tree/ef331b30c89854e29dc9d4954bd86e457a24b850)

<!-- BEGIN META -->
[![npm 30d 301](https://img.shields.io/static/v1?label=npm+30d&message=301&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-orchd) [![最新发布 2026-10-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-orchd)
<!-- END META -->

> **实现功能**：在DSH右侧栏显示会话项目的orchd任务、依赖图、想法和审查时间线，并提供接入指令。

> **核心亮点**：把任务目标、运行态、依赖和审查来源并置，保留孤儿/未知/裁剪，而不另造任务状态权威。详见[Q01](#research-q01)。

> **风险与缺陷**：白名单不约束项目Python副作用；detect未接运行runner，ready并不保证CLI健康或项目名一致；HTTP确认不是调用者授权。详见[Q02](#research-q02)。

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
  - [Q01 · 面板交付什么，和直接运行orchd有什么差别？](#detail-section-11)
  - [Q02 · session如何推导项目，四态检测是否真的核到运行态？](#detail-section-12)
  - [Q03 · 只读白名单和显式安装确认能保证什么？](#detail-section-13)
  - [Q04 · 合并、图和想法的可用性增量及精度边界是什么？](#detail-section-14)
  - [Q05 · 缓存、取消和进程预算有哪些实际限制？](#detail-section-15)
  - [Q06 · 启动与三阶段成本如何衡量？](#detail-section-16)
  - [Q07 · 如何评价采用，什么改进方向可被反证？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有orchd项目的开发者同屏查任务及依赖，原有基线为多次CLI与定义文档。详见[Q01](#research-q01)。

在终端运行orchd status/pool/review并分别读定义与IDEAS；任务状态/验收权威仍为引擎。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| session任务面板 | 任务目标/状态/验收同屏 | 运行ready不保证状态交叉核查 |
| 图与时间线 | 依赖异常和审查回看 | 图400上限，历史仅支持审查事件 |
| 想法看板 | 引擎清单+Markdown+归档计数 | 行协议与尾行边界 |
| 安装入口/命令 | 展示/确认交Agent | 不直接安装，但有steer副作用 |

**流程与依赖**

#### 启动与依赖

| 条件 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| webServer/workspaceRegistry | 会话项目及HTTP | 授权依宿主，路径参数不等身份 |
| Python>=3.11/可信项目orchd | 状态CLI | 不含引擎，不能执行不可信项目 |
| sidebar/slots/locale等 | 同屏面板 | 包无DSH版本上界/范围契约 |
| agents或commands（可选） | 安装指令交接 | steer是真实会话副作用 |


#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 核宿主/项目引擎与备份 | 用户 | session与主树可信且ABI匹配 |
| 安装重启并打开项目会话 | 用户/宿主 | 右栏读取绑定项目 |
| 查任务/图/想法 | 用户 | 认源时间、差异和裁剪 |
| 未接入时审阅模板 | 用户 | 安装另行授权，不把ready作健康认证 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH sidebar/Web服务、Python>=3.11、项目已有orchd引擎/定义文件 | 核项目/容器布局、可信引擎与宿主授权，未接入项目需独立安装初始化 | 插件不含引擎，不自带云模型；安装若交Agent则沿宿主模型费用，金额未知 |
| 持续使用 | status/pool/detail/review/ideas Python进程与本地解析、缓存内存 | 理解定义/状态差异、局部错误与裁剪，刷新及追溯原任务，工时未知 | TTL5/30/10秒为默认缓存期限，非实时推送/性能承诺；stdout无大小硬上限 |
| 失败恢复 | 重新探测/刷新、进程及源文件恢复资源 | 核布局标记、引擎/CLI兼容与身份，清除错误展示或恢复意外引擎副作用 | 面板不替代引擎备份恢复；无自动撤销安装/任务写入，恢复耗时金额未知 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 同屏任务判断 | 多源字段/孤儿/图异常 | 正确率和节时幅度 |
| 只请求读命令 | 参数白名单及主调用env | 项目引擎副作用、HTTP身份边界 |
| 四态和降级 | 布局/定义/Python分类与局部错误 | ready未接状态交叉核查 |

> **思考**：白名单不约束项目Python副作用；detect未接运行runner，ready并不保证CLI健康或项目名一致；HTTP确认不是调用者授权。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把任务目标、运行态、依赖和审查来源并置，保留孤儿/未知/裁剪，而不另造任务状态权威。详见[Q01](#research-q01)。

把任务目标、运行态、依赖和审查来源并置，保留孤儿/未知/裁剪，而不另造任务状态权威。详见[Q01](#research-q01)。

字段来源与unknown/unsupported显露、迭代图算法和按需读取可借鉴；缓存错误对象、检测接线及取消/输出硬预算需明确。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

白名单不约束项目Python副作用；detect未接运行runner，ready并不保证CLI健康或项目名一致；HTTP确认不是调用者授权。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，从可信引擎、受权session和检测接线边界继续研究。详见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

多层读模型与界面贡献可核；ready接线及信任/预算边界存在限制，受权观察快照为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/routes.js、lib/project.js、lib/paths.js、lib/master.js、lib/detect.js、lib/python.js、lib/orchd-cli.js、lib/cli-invoke.js、lib/config.js、lib/cache.js、lib/model.js、lib/ideas.js、lib/install-entry.js、client/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读发布host入口、路由/缓存/项目路径/布局/解释器/CLI/模型及IDEAS关键链；3243行client中数据请求、安装确认和注册代表链。未运行项目/目标/宿主。
- 下一步：固定可信引擎与数据对照CLI，按session/布局越界、错误缓存、无尾换行、裁剪环及资源洪泛反例核快照完整性。

**分析版本**

- **仓库**：[7bder/dsh-plugin-orchd](https://github.com/7bder/dsh-plugin-orchd)
- **版本号**：0.1.0（[固定提交 ef331b3](https://github.com/7bder/dsh-plugin-orchd/tree/ef331b30c89854e29dc9d4954bd86e457a24b850)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

把session/主树/引擎身份与多源采集批次组成受权观察快照，按越权/不一致/资源和裁剪反例证伪，未验证。详见[Q07](#research-q07)。

固定可信引擎与数据对照CLI，按session/布局越界、错误缓存、无尾换行、裁剪环及资源洪泛反例核快照完整性。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 15 | 7194 | 5232 | 1510 | — |
| .md | source | 1 | 121 | — | — | 1318 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7bder/dsh-plugin-orchd/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/7bder/dsh-plugin-orchd/issues?q=is%3Aissue+created%3A2026-09-22T09%3A43%3A36.530Z..2026-10-22T09%3A43%3A36.530Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7bder/dsh-plugin-orchd/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T09%3A43%3A36.530Z..2026-10-22T09%3A43%3A36.530Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：会话绑定orchd面板的观察交付、只读与数据完整性边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面板交付什么，和直接运行orchd有什么差别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已用orchd组织任务、在DSH项目会话里开发的人。原有办法是在终端分别读status/pool/review与定义、IDEAS文档；本项把当前会话项目的状态条、任务目标/验收/写范围、依赖图、想法与审查意见放右栏，保留对话主区。合格交付是项目身份正确、定义与运行态来源可辨、缺失/异常不被画成正常完整状态，不是替引擎领取或完成任务。

可识别增量是跨来源读模型和同屏决策界面。显式重要度与引擎推导重要度分开、任务采用定义∪状态并标orphans，图补悬空节点、环/自依赖并显示裁剪，审查时间线只报引擎实际提供的REVIEW_SUBMITTED而不捏造全事件史。这改变信息整理和交付形态，不改变引擎任务状态机/验收权威。README800+虚拟滚动与真引擎零变更测试是作者报告；本轮不把这些注释/声明当独立性能或只读证明。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:1-24](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/README.md#L1-L24)

场景和面板内容。

<details>
<summary>查看原文（24行）</summary>

```text
# dsh-plugin-orchd

Read-only **orchd** panel for the DeepSeek Harness (DSH) **right sidebar**: open a project session and see that
project's task board, dependency graph, ideas and review timeline next to the conversation.
No project configuration — the plugin derives the project from the session.

把 [orchd](https://github.com/7bder/orchd-core) 的项目状态带进 DSH 右侧栏的**只读面板**：

> 点开一个项目会话，面板自动检测这个项目有没有用 orchd。
> 装了 → 同屏显示任务看板、依赖图、想法与审查时间线；没装 → 给一个接入入口。

**面板没有任何写操作**：`claim` / `done` / `review` / `merge` / `amend` 一律不出现在 UI 里。

---

## 面板内容

| 视图 | 内容 |
|---|---|
| **四态检测** | `未安装` / `未初始化` / `就绪` / `异常`，每种状态各自点名原因，不是一句「出错了」 |
| **看板** | 状态分布、待办 / 在途 / 终态，状态条即筛选器；关键词、筛选、排序；800+ 任务虚拟滚动 |
| **任务详情** | 目标、验收标准、验证命令、写范围、上游依赖与下游引用（可点跳转）、审查事件时间线 |
| **依赖图** | DAG：聚焦闭包 / 活跃子图 / 含终态全图；环、自依赖与悬空上游**显式标注**，不静默少画 |
| **想法（IDEAS）** | 只读想法看板：状态分组、归档任务对照、可复制的推进命令 |
```

</details>

**依据 2 · 源码核查**：[lib/model.js:157-204](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/model.js#L157-L204)

并集与层来源。

<details>
<summary>查看原文（48行）</summary>

```text
 */
export function buildBoard({ statusJson, poolJson, index, masterPath }) {
  const stateRows = new Map()
  for (const task of Array.isArray(statusJson?.tasks) ? statusJson.tasks : []) {
    if (task !== null && typeof task === 'object' && typeof task.task_id === 'string') stateRows.set(task.task_id, task)
  }

  const blockedByTask = new Map()
  for (const entry of Array.isArray(poolJson?.pool) ? poolJson.pool : []) {
    if (entry !== null && typeof entry === 'object' && typeof entry.task_id === 'string') {
      if (Number.isInteger(entry.blocked_downstream_count)) blockedByTask.set(entry.task_id, entry.blocked_downstream_count)
    }
  }

  const weights = index?.importanceWeights ?? null
  const ids = new Set([...(index?.tasks?.keys() ?? []), ...stateRows.keys()])

  const rows = []
  for (const id of ids) {
    const definition = index?.tasks?.get(id)
    const state = stateRows.get(id)
    rows.push(buildTaskRow(definition, state, { blockedDownstream: blockedByTask.get(id) }, weights))
  }

  sortRows(rows, 'default', weights)

  const onlyInState = rows.filter((row) => row.inDefinition !== true).map((row) => row.id)
  const onlyInDefinition = rows.filter((row) => row.inState !== true).map((row) => row.id)

  const summary = summarize(statusJson?.summary, rows)

  return {
    project: index?.project ?? { name: null, brief: null, reviewMode: null },
    schemaVersion: index?.schemaVersion ?? null,
    masterPath: masterPath ?? index?.path ?? null,
    summary,
    tasks: rows,
    modules: [...(index?.modules?.values() ?? [])],
    capabilities: {
      hasDag: (index?.tasks?.size ?? 0) > 0,
      hasBlockedCount: blockedByTask.size > 0,
      hasDefinitionLayer: (index?.tasks?.size ?? 0) > 0,
      hasStateLayer: stateRows.size > 0
    },
    /** 两层不一致时显式报告（不静默丢数据）。 */
    orphans: { onlyInState, onlyInDefinition }
  }
}
```

</details>

**依据 3 · 源码核查**：[lib/model.js:260-305](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/model.js#L260-L305)

历史的支持范围。

<details>
<summary>查看原文（46行）</summary>

```text
 * 组装**审查事件时间线**（FR-8，P2 收窄）。
 *
 * 数据来源：`review --task <id> --show` → `{ task_id, comments:[{review_type, verdict, timestamp, comments}], count }`
 * （docs/03 第 5.7 节）。`timestamp` 可能为 `null` ⇒ `at` 为 `null`，UI 显示「—」
 * （FR-8.5：不得伪造时间）。`current` 补上当前状态摘要，`unsupportedTypes` 供 UI 显式说明。
 *
 * @param {object} reviewJson `review --show` 的响应（可能 undefined）
 * @param {object} stateRow `status <id>` 的 `task`（可能 undefined）
 */
export function buildReviewTimeline(reviewJson, stateRow) {
  const comments = Array.isArray(reviewJson?.comments) ? reviewJson.comments : []
  const events = comments.map((comment) => ({
    type: 'REVIEW_SUBMITTED',
    reviewType: typeof comment?.review_type === 'string' ? comment.review_type : null,
    verdict: typeof comment?.verdict === 'string' ? comment.verdict : null,
    // ⚠ 引擎可能不给 timestamp；必须落成 null 而不是 undefined（否则 JSON 往返丢键）
    at: typeof comment?.timestamp === 'string' ? comment.timestamp : null,
    text: typeof comment?.comments === 'string' ? comment.comments : null
  }))
  const source = stateRow !== null && typeof stateRow === 'object' ? stateRow : {}
  return {
    events,
    current: {
      reviewPhase: typeof source.review_phase === 'string' ? source.review_phase : null,
      reviewClaimedBy: typeof source.review_claimed_by === 'string' ? source.review_claimed_by : null,
      mergeWarning: source.merge_warning ?? null,
      reviveMarker: source.revive_marker ?? null
    },
    unsupportedTypes: [...UNSUPPORTED_HISTORY_TYPES],
    count: Number.isInteger(reviewJson?.count) ? reviewJson.count : events.length
  }
}

// ── P2b：依赖图与阻塞链（FR-7）──────────────────────────────────────────────

/**
 * 图的节点上限（FR-7.6「必要时限制渲染节点数并在 UI 上说明」）。
 *
 * 参考项目实测 813 个任务 / 390 条边：右侧栏宽度只有整页的约 1/3，一次铺满必然不可读，
 * 所以服务端就截断并把 `truncated` 报给 UI，由 UI 显式说明（不静默少画）。
 */
export const GRAPH_MAX_NODES = 400

/**
 * 组装依赖图（FR-7）。
 *
```

</details>

**依据 4 · 源码核查**：[client/client.js:3180-3228](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/client/client.js#L3180-L3228)

session右侧栏注册。

<details>
<summary>查看原文（49行）</summary>

```text
              // registry 会用 definition.kind 覆盖条目上的 kind，所以这里不重复声明；
              // id 只要求在同一类型内唯一。
              id: 'orchd-tasks',
              order: 20,
              title: () => t('title'),
              description: () => t('guideHint'),
              icon: OrchdIcon
            }
          ]
        }),
        'orchd-tasks: sidebar type'
      )

      // ② 正文：key = 类型 id；session 作用域 → inject 能拿到 sessionId
      ctx.effect(
        () => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({
          name: 'sidebar.right.pane.tab',
          key: TAB_ID,
          locale: NS,
          inject: (sessionId) => ({ sessionId })
        }, OrchdTasksPane)),
        'orchd-tasks: pane body'
      )

      // ③ tab chip 标题
      ctx.effect(
        () => ctx.slots.inject('sidebar.right.pane.tab.title', () => ctx.slots.register({
          name: 'sidebar.right.pane.tab.title',
          key: TAB_ID,
          locale: NS
        }, OrchdTasksTitle)),
        'orchd-tasks: pane title'
      )

      // ④ 会话 header 的开关（list 席位，多个条目可共存）。
      //    打开的是**右侧栏 tab**，不触碰中栏 → 与会话同屏（AC-12.5）。
      ctx.effect(
        () => ctx.slots.inject('conversation.session.header.utilities', () => ctx.slots.register({
          name: 'conversation.session.header.utilities',
          id: 'orchd-tasks-toggle',
          order: 30,
          locale: NS,
          inject: () => ({
            open: () => ctx.sidebarRight.openTab(TAB_KIND)
          })
        }, OrchdToggleButton)),
        'orchd-tasks: header toggle'
      )
    }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · session如何推导项目，四态检测是否真的核到运行态？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

HTTP只接session业务参数，不直接采用客户端路径。resolveProjectRoot从workspaceRegistry所属session找绝对path，失败再读session header cwd，realpath归一；allowRoots非空按推导根精确匹配，默认空不额外限制。它核的是session→项目映射，不是请求者→session授权。layout可由项目.layout.json指定main_worktree，或一层子目录按自声明/定义/启动器强度选主树，多个同强度候选按main/名字排序，稳定不等用户意图已消歧。对推导根的allowRoots检查没有对layout最后选出的主树再次限制，可信标记/junction是额外前提。

实际接线存在具体缺口。index只构造cli放deps.cli，没有deps.runCli；loadContext把deps.runCli传detect，于是detect走可选runCli缺省分支，读定义和Python后就ready并标statusLayer.checked=false/not-implemented-in-p0，跳过状态层CLI/项目名一致性交叉核查。context随后cachedEngineSummary可能调用statusAll，失败只返回undefined，不把ready改broken；board/graph才独立失败。这不是完整“运行态也一致”的四态保证，不能用ready作引擎健康判据。安装痕迹、layout、Python和定义损坏的状态区分仍有实际代码。

#### 证据与依据

**依据 1 · 源码核查**：[lib/project.js:38-116](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/project.js#L38-L116)

项目根与allowRoots。

<details>
<summary>查看原文（79行）</summary>

```text
export async function resolveProjectRoot(ctx, sessionId, config) {
  const warnings = []

  if (typeof sessionId !== 'string' || sessionId.trim() === '') {
    return { error: { reason: 'project-root-unresolved', detail: { why: 'session id is empty' } } }
  }

  // 1) 调试覆写：allowRoots 只影响「允许哪些根通过」，不改变推导顺序。
  //    但若配置了 allowRoots，且本会话推导不出根，仍走后面的兜底。
  let derived = null

  // 2) workspace 注册表
  const registry = ctx.get?.('workspaceRegistry') ?? ctx.workspaceRegistry
  if (registry !== undefined && registry !== null) {
    try {
      const workspaces = registry.list()
      for (const workspace of workspaces) {
        const sessionIds = workspace?.sessionIds
        if (Array.isArray(sessionIds) && sessionIds.includes(sessionId)) {
          const path = workspace.path ?? workspace.record?.path
          if (typeof path === 'string' && isAbsolute(path)) {
            derived = { root: canonicalPath(path), source: 'workspace-registry', workspaceId: workspace.id ?? workspace.workspaceId ?? null }
            break
          }
          warnings.push(`workspace ${String(workspace?.id)} owns this session but has no absolute path`)
        }
      }
    } catch (error) {
      warnings.push(`workspaceRegistry.list() failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  } else {
    warnings.push('workspaceRegistry service is unavailable')
  }

  // 3) 会话 header 的 cwd
  let sessionCwd = null
  if (derived === null && registry !== undefined && registry !== null && typeof registry.readSessionHeader === 'function') {
    try {
      const header = await registry.readSessionHeader(sessionId)
      if (typeof header?.cwd === 'string' && isAbsolute(header.cwd)) sessionCwd = header.cwd
      else warnings.push('session header has no absolute cwd')
    } catch (error) {
      warnings.push(`readSessionHeader failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  if (derived === null && sessionCwd !== null) {
    derived = { root: canonicalPath(sessionCwd), source: 'session-cwd', workspaceId: null }
  }

  if (derived === null) {
    return {
      error: {
        reason: 'project-root-unresolved',
        detail: { sessionId, warnings }
      }
    }
  }

  // allowRoots 收敛（Q5：默认空 = 不限制）
  if (Array.isArray(config.allowRoots) && config.allowRoots.length > 0) {
    const allowed = config.allowRoots.map((entry) => keyOf(entry))
    if (!allowed.includes(keyOf(derived.root))) {
      return {
        error: {
          reason: 'project-root-not-allowed',
          detail: { root: derived.root, allowRoots: config.allowRoots }
        }
      }
    }
    return { ...derived, source: 'allow-roots', warnings }
  }

  return { ...derived, sessionCwd, warnings }
}

/**
 * 忽略请求里出现的一切路径参数（NFR-2.1 / AC-1.3）。
 * @param {URL} url
```

</details>

**依据 2 · 源码核查**：[lib/paths.js:19-38](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/paths.js#L19-L38)

归一缓存身份。

<details>
<summary>查看原文（20行）</summary>

```text
export function canonicalPath(input) {
  const resolved = normalize(resolve(input))
  try {
    return normalize(realpathSync.native ? realpathSync.native(resolved) : realpathSync(resolved))
  } catch {
    return resolved
  }
}

/** 比较两个路径是否指向同一位置（Windows 大小写不敏感）。 */
export function samePath(a, b) {
  if (a === undefined || b === undefined || a === null || b === null) return false
  return keyOf(a) === keyOf(b)
}

/** 缓存键：canonicalPath + 平台相关大小写折叠。 */
export function keyOf(input) {
  const canonical = canonicalPath(input)
  return process.platform === 'win32' ? canonical.toLowerCase() : canonical
}
```

</details>

**依据 3 · 源码核查**：[lib/master.js:70-126](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/master.js#L70-L126)

多候选启发式。

<details>
<summary>查看原文（57行）</summary>

```text
function findContainerWorktree(root) {
  let entries
  try {
    entries = readdirSync(root, { withFileTypes: true })
  } catch {
    return null
  }

  const found = []
  for (const entry of entries) {
    if (!entry.isDirectory?.() || entry.name.startsWith('.')) continue
    const sub = join(root, entry.name)
    const orchdDir = join(sub, '.orchd')
    if (!isDirectory(orchdDir)) continue

    const markerPath = join(orchdDir, LAYOUT_FILENAME)
    const masterPath = join(orchdDir, MASTER_FILENAME)
    const launcherPath = join(orchdDir, LAUNCHER_FILENAME)

    let marker = null
    try {
      marker = JSON.parse(readFileSync(markerPath, 'utf8'))
    } catch {
      marker = null
    }
    const selfDeclared = marker !== null && marker?.layout === 'container' &&
      typeof marker?.main_worktree === 'string' &&
      canonicalPath(marker.main_worktree) === canonicalPath(sub)
    // 子目录自称 flat：它是**另一个独立的 flat 项目**，不是本容器的产物，跳过
    const foreignFlat = marker !== null && marker?.layout === 'flat'

    if (selfDeclared) {
      found.push({ worktree: sub, markerPath, markerRead: true, strength: 3, name: entry.name })
    } else if (!foreignFlat && isFile(masterPath)) {
      found.push({ worktree: sub, markerPath, markerRead: false, strength: 2, name: entry.name })
    } else if (!foreignFlat && isFile(launcherPath)) {
      found.push({ worktree: sub, markerPath, markerRead: false, strength: 1, name: entry.name })
    }
  }

  if (found.length === 0) return null
  found.sort((a, b) => {
    if (b.strength !== a.strength) return b.strength - a.strength
    const aMain = a.name === 'main' ? 0 : 1
    const bMain = b.name === 'main' ? 0 : 1
    if (aMain !== bMain) return aMain - bMain
    if (a.name.length !== b.name.length) return a.name.length - b.name.length
    return a.name.localeCompare(b.name)
  })

  const best = found[0]
  return {
    worktree: best.worktree,
    markerPath: best.markerPath,
    markerRead: best.markerRead,
    note: `container main worktree auto-detected (${best.strength === 3 ? 'self-declared by its own .layout.json' : best.strength === 2 ? 'has _master.json' : 'has __main__.py'}): ${best.name}`
  }
```

</details>

**依据 4 · 源码核查**：[lib/master.js:149-237](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/master.js#L149-L237)

标记及主树选择。

<details>
<summary>查看原文（89行）</summary>

```text
export function resolveLayout(root, options = {}) {
  const probeFallback = options.probeFallback !== false
  const rootCanonical = canonicalPath(root)
  const markerPath = layoutFileOf(rootCanonical)

  let marker
  let markerRead = false
  let markerError
  try {
    marker = JSON.parse(readFileSync(markerPath, 'utf8'))
    markerRead = true
  } catch (error) {
    markerError = error instanceof Error ? `${error.name}: ${error.message}` : String(error)
  }

  const build = (kind, worktree, extra = {}) => {
    const orchdDir = join(worktree, '.orchd')
    return {
      ok: true,
      kind,
      mainWorktree: worktree,
      masterPath: join(orchdDir, MASTER_FILENAME),
      storeHint: kind === 'container' ? join(dirname(worktree), '.orchd-runtime') : orchdDir,
      markerPath,
      markerRead,
      ...(markerError === undefined ? {} : { markerError }),
      ...extra
    }
  }

  const containerWorktree = markerRead && marker?.layout === 'container' && typeof marker?.main_worktree === 'string' && marker.main_worktree.trim() !== ''
    ? canonicalPath(marker.main_worktree)
    : null

  // 标记读出来是 container，但主工作树目录不存在：这是**布局标记与真实主工作树不一致**
  // （FR-2.2 的 layout-marker-mismatch），不能静默当成 flat 读下去。
  if (containerWorktree !== null && !isDirectory(join(containerWorktree, '.orchd'))) {
    return {
      ok: false,
      reason: 'layout-marker-mismatch',
      detail: {
        root: rootCanonical,
        markerPath,
        declaredMainWorktree: containerWorktree,
        hint: 'the layout marker declares a container layout, but the declared main worktree has no .orchd directory'
      }
    }
  }

  /** 主候选：标记说什么就用什么；标记缺失/不可解析/未知 → flat。 */
  let primary
  /** 备选候选（探针兜底用）：与主候选不同的那一分支。 */
  let alternate

  if (containerWorktree !== null) {
    primary = build('container', containerWorktree)
    alternate = build('flat', rootCanonical, { note: 'container marker present; flat candidate probed as fallback' })
  } else {
    const note = markerRead
      ? marker?.layout === 'flat'
        ? undefined
        : `layout marker has unknown layout ${JSON.stringify(marker?.layout)}; treated as flat`
      : undefined
    primary = build('flat', rootCanonical, note === undefined ? {} : { note })
    alternate = null
  }

  if (!probeFallback || isFile(primary.masterPath)) return primary

  if (alternate !== null && isFile(alternate.masterPath)) {
    return {
      ...primary,
      note:
        'the container layout marker disagrees with the real main worktree: the definition file was found at the container root instead'
    }
  }

  // ⚠ 根上**没有容器标记**（`alternate === null`）且根也没有定义文件时：
  //   再扫一层子目录找容器主工作树——这正是「容器根的 .orchd/ 是空的、标记只在 main/ 下」
  //   那种项目（用户实测识别不出来）。根上有标记时以标记为准，不在这里改判。
  if (alternate === null) {
    const auto = findContainerWorktree(rootCanonical)
    if (auto !== null) {
      return {
        ...build('container', auto.worktree, { note: auto.note }),
        markerPath: auto.markerPath,
        markerRead: auto.markerRead
      }
    }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:35-49](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/index.js#L35-L49)

deps没有runCli。

<details>
<summary>查看原文（15行）</summary>

```text
export function apply(ctx, rawConfig) {
  const { config, warnings } = normalizeConfig(rawConfig)
  for (const warning of warnings) ctx.logger?.warn?.(`orchd-tasks: config: ${warning}`)

  const caches = createProjectCaches(config)
  const cli = createCliInvoker(config, undefined, ctx.logger)
  const host = {
    moduleLoadedAt: MODULE_LOADED_AT,
    // cache.js 的求值时刻。HMR 级联重载时两个值会一起刷新；
    // 面板底部的「宿主模块」行只显示 moduleLoadedAt，这里同时回传以便分辨是哪个模块被换了。
    cacheModuleLoadedAt: CACHE_MODULE_LOADED_AT,
    pid: process.pid,
    uptimeMs: Math.round(process.uptime() * 1000)
  }
  const deps = { ctx, config, caches, cli, host }
```

</details>

**依据 6 · 源码核查**：[lib/routes.js:113-133](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/routes.js#L113-L133)

detect接线。

<details>
<summary>查看原文（21行）</summary>

```text
export async function loadContext(deps, sessionId, { refresh = false } = {}) {
  const { ctx, config, caches } = deps

  const resolution = await resolveProjectRoot(ctx, sessionId, config)
  if (resolution.error !== undefined) {
    return { ok: false, error: { kind: 'broken', reason: resolution.error.reason, message: reasonText(resolution.error.reason), details: resolution.error.detail } }
  }

  const valid = validateRoot(resolution.root)
  if (valid.ok !== true) {
    return { ok: false, error: { kind: 'broken', reason: valid.reason, message: reasonText(valid.reason), details: valid.detail } }
  }

  const detected = await caches.detect.get(keyOf(resolution.root), refresh, () =>
    detect({ root: resolution.root, config, runCli: deps.runCli })
  )

  return { ok: true, resolution, detected }
}

/** 定义层（带指纹缓存）。masterPath 缺失时返回 undefined。 */
```

</details>

**依据 7 · 源码核查**：[lib/detect.js:102-149](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/detect.js#L102-L149)

缺省跳过与有runner交叉检查。

<details>
<summary>查看原文（48行）</summary>

```text
      state: 'ready',
      root,
      layout,
      python,
      projectName: master.project.name,
      projectBrief: master.project.brief,
      schemaVersion: master.schemaVersion,
      taskCount: master.taskCount,
      summary: null,
      statusLayer: { checked: false, reason: 'not-implemented-in-p0' }
    }
  }

  // workDir = 主工作树：container 布局下引擎拒绝以容器根为 cwd（E036，见 orchd-cli.js 头注释）
  const status = await runCli({ root, python, layout, workDir: layout.mainWorktree, command: ['status', '--all'] })
  if (status.timedOut === true) {
    return { state: 'broken', root, reason: 'cli-timeout', detail: status, layout, python }
  }
  if (status.exitCode !== 0 || status.json?.error !== undefined) {
    return { state: 'broken', root, reason: 'cli-failed', detail: status, layout, python }
  }

  const engineName = status.json?.project?.name
  if (typeof engineName === 'string' && typeof master.project.name === 'string' && engineName !== master.project.name) {
    return {
      state: 'broken',
      root,
      reason: 'definition-state-mismatch',
      detail: { definition: master.project.name, engine: engineName },
      layout,
      python
    }
  }

  return {
    state: 'ready',
    root,
    layout,
    python,
    projectName: engineName ?? master.project.name,
    projectBrief: master.project.brief,
    schemaVersion: master.schemaVersion,
    taskCount: master.taskCount,
    summary: status.json?.summary ?? null,
    statusLayer: { checked: true }
  }
}

```

</details>

**依据 8 · 源码核查**：[lib/routes.js:218-229](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/routes.js#L218-L229)

摘要失败不改变检测结果。

<details>
<summary>查看原文（12行）</summary>

```text
}

/** ready 时取一次状态层摘要；其它态或调用失败都返回 undefined（不阻塞 context）。 */
async function cachedEngineSummary(deps, detected) {
  if (detected.state !== 'ready' || detected.python === undefined) return undefined
  const result = await loadStatusLayer(deps, detected, false)
  if (result?.ok !== true) return undefined
  const tasks = Array.isArray(result.json?.tasks) ? result.json.tasks : []
  return {
    projectName: typeof result.json?.project?.name === 'string' ? result.json.project.name : undefined,
    taskCount: tasks.length,
    summary: result.json?.summary ?? null
```

</details>

#### 缺口

- 目标宿主调用者到session的授权与主工作树受信边界
  **影响**：无路径参数和根allowlist无法单独提供跨会话保密/仅允许根执行保证
  **进一步探讨**：对照固定宿主webServer/registry权限，核layout外指向与多个候选时的授权目标

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 只读白名单和显式安装确认能保证什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

runOrchdCli在spawn前用精确命令/参数形状白名单和危险flag集拒绝写命令，以参数数组无shell执行；环境只带必要PATH/HOME等和AUTO_CLEAN=off/QUIET/不写pycache，不传ORCHD_SESSION_ID。它能证明插件只请求这些形状的读命令，不能证明任意项目自带__main__.py或其依赖不会写文件/联网/再启动进程。Python直接在主树执行，无沙箱、引擎hash/版本信任校验；项目本身必须可信。配置解释器探测另用spawnSync且继承宿主环境，并非所有子进程都按主调用白名单env构造。

安装注入是实际会话副作用，插件不自己clone，但把含clone/install命令的role=user/source=user消息交agent.steer。UI先请求entry显示文本，再confirm=true POST注入；这能防普通轮询误触，却不是不可伪造授权凭据。HTTP没有本层Origin/token/peer或请求者session检查，拿session字符串且到达路由的请求可自己带true；/orchd-install命令走当前agent身份但无需同一个HTTP确认。外部可达性取决宿主，不能把注释“desktop外壳校验”推成Web也安全。安装模板的仓库地址由配置HTTP(S)非空URL拼接到命令，无固定提交；读者确认时还需核仓库信任和版本，不把常量模板称为可复现安装。

#### 证据与依据

**依据 1 · 源码核查**：[lib/orchd-cli.js:41-89](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/orchd-cli.js#L41-L89)

白名单拒绝。

<details>
<summary>查看原文（49行）</summary>

```text
 */
export const READ_WHITELIST = Object.freeze([
  { name: 'status', shapes: [[], ['--all'], ['<task-id>'], ['--text']], why: '全局快照 / 单任务卡片' },
  { name: 'show', shapes: [['<task-id>']], why: 'status <id> 的别名' },
  { name: 'pool', shapes: [[], ['--all']], why: '就绪池 / 下游阻塞数（FR-7.3）' },
  { name: 'review', shapes: [['--task', '<task-id>', '--show']], why: '审查意见历史（FR-8.3）' },
  { name: 'validate', shapes: [[], ['<path>']], why: '定义层合法性（broken 判定辅助）' },
  // `ideas` 只有 `list` 一个子命令（实测 `ideas --help`：usage: orchd ideas [-h] {list} ...），
  // 且它只读 JSON。`idea`（单数）才是写命令（propose / confirm / drop），**不在白名单**。
  { name: 'ideas', shapes: [['list']], why: 'IDEAS 清单（title/id/status，FR-13）' }
])

/** 结构性危险词：即使出现在白名单命令的额外参数里也直接拒绝。 */
const FORBIDDEN_TOKENS = new Set(['--fix', '--takeover', '--auto-claim', '--write', '--force'])

/**
 * 判断一次调用是否被允许。
 * @param {string[]} argv 已去掉 `python` 与启动器路径
 * @returns {{ ok: true } | { ok: false, reason: 'not-whitelisted'|'argument-not-allowed'|'dangerous-flag', detail: object }}
 */
export function checkWhitelist(argv) {
  if (!Array.isArray(argv) || argv.length === 0) {
    return { ok: false, reason: 'not-whitelisted', detail: { argv } }
  }
  for (const token of argv) {
    if (typeof token === 'string' && FORBIDDEN_TOKENS.has(token)) {
      return { ok: false, reason: 'dangerous-flag', detail: { argv, token } }
    }
  }

  const entry = READ_WHITELIST.find((item) => item.name === argv[0])
  if (entry === undefined) {
    return { ok: false, reason: 'not-whitelisted', detail: { argv, allowed: READ_WHITELIST.map((item) => item.name) } }
  }

  const rest = argv.slice(1)
  const matches = entry.shapes.some((shape) => {
    if (shape.length !== rest.length) return false
    return shape.every((token, index) => {
      // `<...>` 是一个自由参数（调用方负责校验其内容，例如 task id 只允许 [a-z0-9-]）
      if (token.startsWith('<') && token.endsWith('>')) return true
      return token === rest[index]
    })
  })

  return matches
    ? { ok: true }
    : { ok: false, reason: 'argument-not-allowed', detail: { argv, allowedShapes: entry.shapes } }
}
```

</details>

**依据 2 · 源码核查**：[lib/orchd-cli.js:164-203](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/orchd-cli.js#L164-L203)

项目Python执行。

<details>
<summary>查看原文（40行）</summary>

```text
  const commandArgs = [...(python.args ?? []), launcher, ...argv]

  const startedAt = Date.now()
  return await new Promise((resolve) => {
    let settled = false
    const finish = (value) => {
      if (settled) return
      settled = true
      resolve({ ...value, elapsedMs: Date.now() - startedAt, argv })
    }

    let child
    try {
      child = spawnImpl(command, commandArgs, {
        // cwd 必须是主工作树（见函数头注释的 E036 说明）
        cwd,
        windowsHide: true,
        // env 是**白名单式**构造：只带出必要变量 + 我们的只读开关，
        // 绝不把宿主的 ORCHD_SESSION_ID（若存在）传下去（FR-10.1）。
        env: buildChildEnv(),
        stdio: ['ignore', 'pipe', 'pipe']
      })
    } catch (error) {
      finish({ outcome: 'spawn-failed', exitCode: null, json: undefined, stdout: '', stderr: '', error: String(error) })
      return
    }

    let stdout = ''
    let stderr = ''
    let timedOut = false

    const timer = setTimeout(() => {
      timedOut = true
      try {
        child.kill()
      } catch {
        /* 忽略：可能已退出 */
      }
    }, Math.max(1, timeoutMs))

```

</details>

**依据 3 · 源码核查**：[lib/orchd-cli.js:259-273](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/orchd-cli.js#L259-L273)

主调用环境。

<details>
<summary>查看原文（15行）</summary>

```text
 *
 * 导出成函数是为了在测试里直接断言「没有身份变量、只读开关都在」——
 * 这是 FR-10.1/10.2 的自动化验收点（docs/05 P1 验收 AC-10.2）。
 */
export function buildChildEnv(base = process.env) {
  const env = {}
  // 只带出运行必需的那几个：PATH（找 python 及其依赖）、SystemRoot（Windows 必需）、
  // TEMP/TMP（解释器可能需要）、HOME/USERPROFILE（少数库会读）。
  for (const key of ['PATH', 'Path', 'SystemRoot', 'windir', 'TEMP', 'TMP', 'HOME', 'USERPROFILE', 'LANG', 'LC_ALL']) {
    if (base[key] !== undefined) env[key] = base[key]
  }
  for (const [key, value] of Object.entries(CHILD_ENV)) env[key] = value
  // 明确**不设置** ORCHD_HOME（不重定向运行时根）、ORCHD_SESSION_ID（不注入身份）。
  return env
}
```

</details>

**依据 4 · 源码核查**：[lib/python.js:56-68](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/python.js#L56-L68)

解释器探测继承环境。

<details>
<summary>查看原文（13行）</summary>

```text
function probeCandidate(candidate) {
  const result = spawnSync(candidate.command, [...candidate.args, '-c', PROBE_SCRIPT], {
    encoding: 'utf8',
    timeout: PROBE_TIMEOUT_MS,
    windowsHide: true,
    env: {
      ...process.env,
      PYTHONIOENCODING: 'utf-8',
      PYTHONDONTWRITEBYTECODE: '1'
    }
  })

  if (result.error !== undefined && result.error !== null) {
```

</details>

**依据 5 · 源码核查**：[lib/install-entry.js:24-61](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/install-entry.js#L24-L61)

安装模板和用户消息。

<details>
<summary>查看原文（38行）</summary>

```text
export function buildInstallPrompt(config) {
  const repo = resolveRepo(config)
  const mirror = ORCHD_MIRROR_REPO
  const lines = [
    '请帮我用 orchd 接入当前项目。',
    '',
    '背景：这是用户从 DSH 的「orchd 任务」面板点击确认后注入的请求；面板本身是**只读**的，不会替你做安装。',
    '',
    '请按 orchd 官方流程执行：',
    '1) 先在当前项目根目录确认工作区状态（未提交改动要先说明，不要擅自丢弃）。',
    '2) 执行 orchd 官方安装器完成接入（三选一，按你的环境）：',
    `   git clone ${repo} orchd-core`,
    '   python orchd-core/install.py . --agent --cleanup',
    '   python .orchd/__main__.py status',
    '3) 安装完成后运行一次 `python .orchd/__main__.py status` 确认接入成功，并把关键结果（项目名、任务数）告诉我。',
    '',
    '注意事项：',
    '- 引擎命令必须在**主工作树**下执行；容器布局下在容器根执行会被引擎拒绝（E036）。',
    '- 不要跳过 orchd 自己的初始化步骤，也不要手工改 `.orchd/` 下的定义文件。'
  ]
  if (repo === ORCHD_OFFICIAL_REPO) {
    lines.push(`- 网络受限时可用镜像：${mirror}`)
  }
  return lines.join('\n')
}

/**
 * 手写用户消息（等价于 `createUserMessage`，见模块头注释）。
 * 冻结一下，避免被后续代码误改（上游实现也是 deepFreeze）。
 */
export function buildUserMessage(text) {
  return Object.freeze({
    id: randomUUID(),
    role: 'user',
    content: Object.freeze([Object.freeze({ type: 'text', text })]),
    source: Object.freeze({ kind: 'user' })
  })
}
```

</details>

**依据 6 · 源码核查**：[lib/install-entry.js:98-108](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/install-entry.js#L98-L108)

steer实际副作用。

<details>
<summary>查看原文（11行）</summary>

```text
 */
export function injectInstallPrompt({ ctx, sessionId, text }) {
  const support = probeInjectSupport(ctx, sessionId)
  if (support.supported !== true) {
    return { injected: false, reason: support.reason }
  }
  const agent = ctx.get('agents').get(sessionId)
  const message = buildUserMessage(text)
  agent.steer(message)
  return { injected: true, reason: null, messageId: message.id }
}
```

</details>

**依据 7 · 源码核查**：[lib/routes.js:796-862](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/routes.js#L796-L862)

confirm与状态守卫。

<details>
<summary>查看原文（67行）</summary>

```text
        applicable,
        state,
        command: INSTALL_COMMAND,
        text
      }
    }))
  } catch (error) {
    sendJson(res, 500, envelope({ ok: false, startedAt, error: internalError(error) }))
  }
}

/**
 * POST /orchd/api/install-inject —— 执行注入（FR-3.2）。
 *
 * ⚠ 本端点**只能由用户的显式确认动作触发**：`/context`、`/board`、`/ideas` 等任何轮询/刷新
 * 路径都不得调用它（FR-3.3/FR-3.5）。注入的是**插件内常量模板**（NFR-2.4），
 * 且插件自身不执行 `git clone` / `install.py`（AC-3.2）。
 */
async function handleInstallInject(deps, req, res) {
  const startedAt = Date.now()
  const body = await readJsonBody(req)
  const sessionId = typeof body?.session === 'string' ? body.session : ''
  if (sessionId === '') {
    sendJson(res, 400, envelope({ ok: false, startedAt, error: { kind: 'bad_request', reason: 'missing-session', message: 'body field `session` is required' } }))
    return
  }
  // 防御：只有用户确认时前端才带 confirm=true（避免被轮询误触发）
  if (body?.confirm !== true) {
    sendJson(res, 400, envelope({ ok: false, startedAt, error: { kind: 'bad_request', reason: 'confirm-required', message: 'injection requires explicit `confirm: true`' } }))
    return
  }
  try {
    const loaded = await loadContext(deps, sessionId, { refresh: false })
    const state = loaded.ok === true ? loaded.detected.state : null
    if (state !== 'not_installed') {
      sendJson(res, 200, envelope({
        ok: false,
        startedAt,
        error: {
          kind: 'bad_request',
          reason: 'install-entry-not-applicable',
          message: `install entry only applies to not_installed projects (current state: ${String(state)})`
        }
      }))
      return
    }
    const text = buildInstallPrompt(deps.config)
    const result = injectInstallPrompt({ ctx: deps.ctx, sessionId, text })
    if (result.injected !== true) {
      sendJson(res, 200, envelope({
        ok: false,
        startedAt,
        error: {
          kind: 'bad_request',
          reason: result.reason ?? 'injection-unavailable',
          message: reasonText(result.reason ?? 'injection-unavailable')
        }
      }))
      return
    }
    sendJson(res, 200, envelope({ ok: true, startedAt, data: { injected: true, messageId: result.messageId, text } }))
  } catch (error) {
    sendJson(res, 500, envelope({ ok: false, startedAt, error: internalError(error) }))
  }
}

/** 读 JSON body（失败返回 null，不抛）。 */
```

</details>

**依据 8 · 源码核查**：[lib/routes.js:995-1027](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/routes.js#L995-L1027)

分派仅路由/方法校验。

<details>
<summary>查看原文（33行）</summary>

```text
        deps.ctx.logger?.warn?.(`orchd-tasks: route disposer failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
  }
}

async function handleApiPrefix(deps, req, res) {
  const url = new URL(req.url ?? '/', 'http://orchd.invalid')
  // 登记本请求的日志上下文：失败的响应由 `sendJson` 统一记录（NFR-5.1）
  RESPONSE_FAILURES.set(res, { logger: deps.ctx?.logger ?? null, pathname: url.pathname, method: req.method })
  const route = ROUTES.get(url.pathname)
  if (route === undefined) {
    sendJson(res, 404, envelope({
      ok: false,
      startedAt: Date.now(),
      error: { kind: 'bad_request', reason: 'unknown-route', message: `unknown orchd api path ${url.pathname}` }
    }))
    return
  }
  if (req.method !== route.method) {
    sendJson(res, 405, envelope({
      ok: false,
      startedAt: Date.now(),
      error: {
        kind: 'bad_request',
        reason: 'method-not-allowed',
        message: `${req.method} is not allowed on ${url.pathname} (expected ${route.method})`
      }
    }))
    return
  }
  await route.handler(deps, req, res, url)
}
```

</details>

**依据 9 · 源码核查**：[lib/index.js:60-90](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/index.js#L60-L90)

用户命令路径。

<details>
<summary>查看原文（31行）</summary>

```text
  // 这正是平台第一方插件的写法（见 dsh-plan-mode），机制细节记在 docs/04 第 9 节。
  ctx.inject(['commands'], (commandCtx) => {
    commandCtx.effect(
      () =>
        commandCtx.commands.register({
          // 品牌串在运行时就是普通字符串（profile 解析不到 @deepseek-ai/dsh-brand，无法 import）
          definitionId: 'dsh-plugin-orchd',
          name: INSTALL_COMMAND,
          description: '把「用 orchd 接入当前项目」的指令交给 agent（只注入提示词，插件自己不做安装）',
          handler: async ({ agent }) => {
            // 与 HTTP 端点**同一套守卫**：只对「未接入 orchd」的项目注入（FR-3）
            const sessionId = typeof agent?.session === 'string' ? agent.session : ''
            if (sessionId === '') {
              return { kind: 'error', text: '拿不到这个会话的身份，无法判断项目是否已接入；请用面板里的复制命令手动接入。' }
            }
            const loaded = await loadContext(deps, sessionId, { refresh: true })
            const state = loaded.ok === true ? loaded.detected.state : null
            if (state !== 'not_installed') {
              return { kind: 'error', text: `A 路径只对「未接入 orchd」的项目可用（当前状态：${String(state)}）。` }
            }
            if (typeof agent.steer !== 'function') {
              return { kind: 'error', text: '这个会话没有可注入的 agent，请改用面板里的复制命令手动接入。' }
            }
            // 注入的是**插件内常量模板**（NFR-2.4），不含任何项目文件内容
            agent.steer(buildUserMessage(buildInstallPrompt(config)))
            return { kind: 'success', text: '已把接入指令交给 agent。' }
          }
        }),
      'orchd-tasks: /orchd-install command'
    )
  })
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 合并、图和想法的可用性增量及精度边界是什么？

**研究主题**：工程质量与复用

#### 完整回答

model按字段职责合并定义和状态，保留null、未知状态和两侧孤儿，summary有引擎值就采用并标source；依赖只取定义depends_on，blockedDownstream只取pool，不拿边数冒充。图采用BFS闭包、Kahn层级和迭代Tarjan环分量，400节点预算显式truncated/omitted。它是常见图算法的适配，不是新DAG求解器；环诊断只对裁剪后可见子图进行，400外的环可能不报，不能当全项目无环证明。Kahn对环后继的level也可能被前驱暂写而不代表完成拓扑排序，阅读应以显式anomalies及图范围为准。

ideas清单是状态来源，Markdown补正文；缺ideas命令降级且标unsupported；转任务通过source/additional_sources引用判断，而非直接拿归档pending当未转任务，保留两层mismatch和unknown字段有用。解析是简化行协议，不是完整Markdown语法，围栏内##/字段也可能被识别；归档流只在换行完成行调用consume，end没有消费tail，所以末尾无换行的最后id/status可能漏。未提供发布树内test目录，client注释提到的test/client.test.mjs未随此固定树可见，本轮不当已执行验收。

#### 证据与依据

**依据 1 · 源码核查**：[lib/model.js:73-108](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/model.js#L73-L108)

字段来源。

<details>
<summary>查看原文（36行）</summary>

```text
 * @param {object} [weights] 引擎的重要度权重
 */
export function buildTaskRow(definition, state, extra = {}, weights = null) {
  const definitionRow = definition ?? {}
  const stateRow = stateRowOf(state)
  // 状态层用 `task_id`（`status --all` 的 tasks[]），`pool --all` 用 `id`；两个都认。
  const stateId = state !== null && typeof state === 'object' ? (state.task_id ?? state.id) : undefined
  const id = definitionRow.id ?? (typeof stateId === 'string' ? stateId : undefined) ?? null

  return {
    id,
    name: definitionRow.name ?? (state !== null && typeof state === 'object' && typeof state.name === 'string' ? state.name : null),
    brief: definitionRow.brief ?? (state !== null && typeof state === 'object' && typeof state.brief === 'string' ? state.brief : null),
    module: definitionRow.module ?? (state !== null && typeof state === 'object' && typeof state.module === 'string' ? state.module : null),
    // ⚠ 必须归一成 `string | null`：若这里留 `undefined`，`JSON.stringify` 会**整键丢掉**
    // status，前端拿到的是一个没有该键的对象（P1 实测踩过——只有定义层、没有状态层
    // 的任务会命中）。其它字段都做了 ?? null，唯独这个字段最容易漏，FR-5.7 也要求
    // 缺字段显示占位符而不是 undefined。
    status: typeof stateRow.status === 'string' ? stateRow.status : null,
    importance: definitionRow.importance ?? null,
    /** 引擎推导的重要度（`pool --all` 里给的那份）。与显式值分开，UI 都要显示。 */
    importanceDerived: state !== null && typeof state === 'object' && typeof state.importance === 'string' ? state.importance : null,
    difficulty: definitionRow.difficulty ?? (state !== null && typeof state === 'object' && typeof state.difficulty === 'string' ? state.difficulty : null),
    claimedBy: stateRow.claimedBy,
    attemptCount: stateRow.attemptCount,
    source: definitionRow.source ?? (state !== null && typeof state === 'object' && typeof state.source === 'string' ? state.source : null),
    reviewPhase: stateRow.reviewPhase,
    reviewClaimedBy: stateRow.reviewClaimedBy,
    blockedDownstream: Number.isInteger(extra.blockedDownstream) ? extra.blockedDownstream : null,
    inDefinition: definition !== undefined && definition !== null,
    inState: state !== undefined && state !== null
  }
}

/**
 * 组装 `TaskDetail`（= TaskRow + 详情字段）。
```

</details>

**依据 2 · 源码核查**：[lib/model.js:157-227](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/model.js#L157-L227)

并集与摘要来源。

<details>
<summary>查看原文（71行）</summary>

```text
 */
export function buildBoard({ statusJson, poolJson, index, masterPath }) {
  const stateRows = new Map()
  for (const task of Array.isArray(statusJson?.tasks) ? statusJson.tasks : []) {
    if (task !== null && typeof task === 'object' && typeof task.task_id === 'string') stateRows.set(task.task_id, task)
  }

  const blockedByTask = new Map()
  for (const entry of Array.isArray(poolJson?.pool) ? poolJson.pool : []) {
    if (entry !== null && typeof entry === 'object' && typeof entry.task_id === 'string') {
      if (Number.isInteger(entry.blocked_downstream_count)) blockedByTask.set(entry.task_id, entry.blocked_downstream_count)
    }
  }

  const weights = index?.importanceWeights ?? null
  const ids = new Set([...(index?.tasks?.keys() ?? []), ...stateRows.keys()])

  const rows = []
  for (const id of ids) {
    const definition = index?.tasks?.get(id)
    const state = stateRows.get(id)
    rows.push(buildTaskRow(definition, state, { blockedDownstream: blockedByTask.get(id) }, weights))
  }

  sortRows(rows, 'default', weights)

  const onlyInState = rows.filter((row) => row.inDefinition !== true).map((row) => row.id)
  const onlyInDefinition = rows.filter((row) => row.inState !== true).map((row) => row.id)

  const summary = summarize(statusJson?.summary, rows)

  return {
    project: index?.project ?? { name: null, brief: null, reviewMode: null },
    schemaVersion: index?.schemaVersion ?? null,
    masterPath: masterPath ?? index?.path ?? null,
    summary,
    tasks: rows,
    modules: [...(index?.modules?.values() ?? [])],
    capabilities: {
      hasDag: (index?.tasks?.size ?? 0) > 0,
      hasBlockedCount: blockedByTask.size > 0,
      hasDefinitionLayer: (index?.tasks?.size ?? 0) > 0,
      hasStateLayer: stateRows.size > 0
    },
    /** 两层不一致时显式报告（不静默丢数据）。 */
    orphans: { onlyInState, onlyInDefinition }
  }
}

/**
 * 状态分布计数。
 *
 * FR-4.3 要求「与引擎自己的口径一致，直接采用引擎输出的摘要，不在前端重算」——
 * 所以引擎给了 `summary` 就**原样用它**，只有引擎没给时才退回自己数（并标记来源）。
 */
export function summarize(engineSummary, rows) {
  const keys = ['total', 'active', 'pending', 'claimed', 'done', 'in_review', 'completed', 'cancelled']
  if (engineSummary !== null && engineSummary !== undefined && typeof engineSummary === 'object') {
    const out = { source: 'engine' }
    for (const key of keys) out[key] = Number.isInteger(engineSummary[key]) ? engineSummary[key] : null
    return out
  }
  const counted = { source: 'plugin', total: rows.length, active: 0, pending: 0, claimed: 0, done: 0, in_review: 0, completed: 0, cancelled: 0 }
  for (const row of rows) {
    if (typeof row.status !== 'string') continue
    if (Object.hasOwn(counted, row.status)) counted[row.status] += 1
    if (ACTIVE_STATUSES.has(row.status)) counted.active += 1
  }
  return counted
}

```

</details>

**依据 3 · 源码核查**：[lib/model.js:442-539](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/model.js#L442-L539)

裁剪/可见图层级与环。

<details>
<summary>查看原文（98行）</summary>

```text

  // 悬空上游的占位节点：只有当它连着的下游进了子图才补进来
  for (const edge of edges) {
    if (keep.has(edge.to) && danglingIds.has(edge.from)) keep.add(edge.from)
  }

  // 截断（FR-7.6）：焦点与活跃种子优先，其次层级浅的，最后 id 字典序（结果稳定可测）
  let truncated = false
  let omitted = 0
  if (keep.size > maxNodes) {
    const rank = (id) => (id === focus ? 0 : (relation.get(id) === 'seed' ? 1 : 2))
    const ordered = [...keep].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
    const allowed = new Set(ordered.slice(0, maxNodes))
    omitted = keep.size - allowed.size
    keep = allowed
    truncated = true
  }

  const visibleEdges = edges.filter((edge) => keep.has(edge.from) && keep.has(edge.to))

  // ── 分层：子图内 Kahn 逐层剥离。环上与「被环卡住」的节点拿不到层级（level = null）──
  const level = new Map()
  {
    const indegree = new Map()
    const adjacency = new Map()
    for (const id of keep) {
      indegree.set(id, 0)
      adjacency.set(id, [])
    }
    for (const edge of visibleEdges) {
      if (edge.from === edge.to) continue
      adjacency.get(edge.from).push(edge.to)
      indegree.set(edge.to, indegree.get(edge.to) + 1)
    }
    const queue = []
    for (const id of keep) {
      if (indegree.get(id) === 0) {
        level.set(id, 0)
        queue.push(id)
      }
    }
    for (let index = 0; index < queue.length; index += 1) {
      const node = queue[index]
      for (const next of adjacency.get(node)) {
        level.set(next, Math.max(level.get(next) ?? 0, level.get(node) + 1))
        indegree.set(next, indegree.get(next) - 1)
        if (indegree.get(next) === 0) queue.push(next)
      }
    }
  }

  const nodes = [...keep].sort((a, b) => a.localeCompare(b)).map((id) => {
    const row = rowById.get(id)
    const definition = definitions.get(id)
    const missing = row === undefined
    return {
      id,
      name: row?.name ?? definition?.name ?? null,
      status: row?.status ?? null,
      module: row?.module ?? definition?.module ?? null,
      importance: row?.importance ?? definition?.importance ?? null,
      importanceDerived: row?.importanceDerived ?? null,
      // FR-7.3 的下游阻塞数**必须**是引擎口径（`pool --all` 的 blocked_downstream_count，
      // 语义是「被多少 pending 下游依赖」）。引擎没给就是 null——绝不用直接边数冒充它。
      blockedDownstream: typeof row?.blockedDownstream === 'number' ? row.blockedDownstream : null,
      terminal: isTerminalStatus(row?.status),
      inDefinition: row?.inDefinition === true || (missing && definitions.has(id)),
      inState: row?.inState === true,
      /** 悬空依赖的占位节点（任务不存在，只在图上表达「这里指向了不存在的东西」）。 */
      missing,
      level: level.get(id) ?? null,
      relation: relation.get(id) ?? null
    }
  })

  const anomalies = []
  for (const id of [...selfIds].filter((value) => keep.has(value)).sort()) {
    anomalies.push({ kind: 'self', ids: [id] })
  }
  for (const id of [...danglingIds].filter((value) => keep.has(value)).sort()) {
    anomalies.push({ kind: 'dangling', ids: [id] })
  }
  // 环：只在**自环以外**的强连通分量里找（自环已经单独报成 self，不重复报）
  {
    const adjacency = new Map()
    for (const id of keep) adjacency.set(id, [])
    for (const edge of visibleEdges) {
      if (edge.from === edge.to) continue
      if (!keep.has(edge.from) || !keep.has(edge.to)) continue
      adjacency.get(edge.from).push(edge.to)
    }
    for (const component of findStronglyConnectedComponents([...keep].sort(), adjacency)) {
      anomalies.push({ kind: 'cycle', ids: component })
    }
  }
  anomalies.sort((a, b) => a.kind.localeCompare(b.kind) || (a.ids[0] ?? '').localeCompare(b.ids[0] ?? ''))

  const terminalNodes = nodes.filter((node) => node.terminal).length
```

</details>

**依据 4 · 源码核查**：[lib/model.js:570-632](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/model.js#L570-L632)

迭代Tarjan。

<details>
<summary>查看原文（63行）</summary>

```text
 * 强连通分量（Tarjan，迭代式实现）。
 *
 * 813 个任务的全图递归深度可能上千，所以不用递归写法（Node 默认栈在极端深链上会爆）。
 * 只返回「大小 > 1」的分量——大小 1 的分量里只有自环才是异常，而自环已由调用方单独报成 `self`。
 *
 * @param {string[]} nodeIds 已排序的节点 id（保证输出稳定）
 * @param {Map<string, string[]>} adjacency
 * @returns {string[][]} 每个分量内按 id 升序
 */
function findStronglyConnectedComponents(nodeIds, adjacency) {
  const index = new Map()
  const low = new Map()
  const onStack = new Set()
  const stack = []
  const components = []
  let counter = 0

  for (const start of nodeIds) {
    if (index.has(start)) continue
    const work = [[start, 0]]
    while (work.length > 0) {
      const frame = work[work.length - 1]
      const node = frame[0]
      if (frame[1] === 0) {
        index.set(node, counter)
        low.set(node, counter)
        counter += 1
        stack.push(node)
        onStack.add(node)
      }
      const neighbours = adjacency.get(node) ?? []
      let descended = false
      while (frame[1] < neighbours.length) {
        const next = neighbours[frame[1]]
        frame[1] += 1
        if (!index.has(next)) {
          work.push([next, 0])
          descended = true
          break
        }
        if (onStack.has(next)) low.set(node, Math.min(low.get(node), index.get(next)))
      }
      if (descended) continue

      if (low.get(node) === index.get(node)) {
        const component = []
        let member
        do {
          member = stack.pop()
          onStack.delete(member)
          component.push(member)
        } while (member !== node)
        if (component.length > 1) components.push(component.sort())
      }
      work.pop()
      if (work.length > 0) {
        const parent = work[work.length - 1][0]
        low.set(parent, Math.min(low.get(parent), low.get(node)))
      }
    }
  }

  return components.sort((a, b) => (a[0] ?? '').localeCompare(b[0] ?? ''))
```

</details>

**依据 5 · 源码核查**：[lib/routes.js:630-705](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/routes.js#L630-L705)

想法合并和差异。

<details>
<summary>查看原文（76行）</summary>

```text
    const archivePath = ideasArchiveOf(mainWorktree)

    // 正文 + 归档**流式扫描**：按文件指纹/文件大小缓存；归档只扫 `## `/`- id:`/`- status:`
    // 三行，不解析正文、不把全文留在内存（FR-13.12）
    const filesKey = `${keyOf(detected.root)}|ideas`
    const files = await deps.caches.ideasFiles.get(filesKey, refresh, async () => {
      const markdown = await readTextFile(ideasPath)
      const archive = await scanArchiveFile(archivePath)
      return { markdown, archive }
    })

    const parsed = parseIdeasMarkdown(files.markdown.text ?? '')
    // ⚠ `status` 不是「是否已立任务」的标记（引擎 rules/intake.md：在途条目按 E025
    // 必须保持 pending，`taskified` 只服务撞车并入）。所以用定义层做「已转任务」判定，
    // 覆盖字面上的 pending（FR-13.3b / docs/03 E025 溯源）。
    const definition = await loadDefinition(deps, detected)
    // 引用判据 = `source` ∪ `additional_sources`（引擎 rules ④ 同判据）
    const ideaTaskIndex = buildIdeaTaskIndex(definition?.tasks)
    // 引擎不支持 `ideas` 时没有清单可合并，只读 Markdown（`mergeIdeasList(null, …)` 就是这条路，
    // 条目会带上「仅存在于 IDEAS.md」的标记，界面本来就会这么显示）
    const engineList = ideasUnsupported ? null : list.json
    const entries = applyConvertedStatus(mergeIdeasList(engineList, parsed.entries), ideaTaskIndex)
    const summary = summarizeIdeas(entries)
    // 归档分组：**与任务池对照**（用户口径 / FR-13.7）。
    // 不按归档件里的字面 status 分组——引擎明确归档不改写 status（语义是「已消费」），
    // 实测 312/373 条仍写着 pending，其中 287 条在任务池里有引用。
    // 「已丢弃」用扫描时收下的归档件自身 status（`statusById`），不能用 IDEAS.md 的状态表。
    const archived = classifyArchive(files.archive, ideaTaskIndex)
    // ⚠ 两个集合必须各自取「本层」的 id：曾误用合并后的 entries 当作引擎清单，
    // 导致只存在于 Markdown 的条目也被算成「引擎也有」，mismatches 恒为空。
    const listIds = new Set(
      (Array.isArray(list.json?.ideas) ? list.json.ideas : [])
        .map((idea) => idea?.id)
        .filter((id) => typeof id === 'string')
    )
    const markdownIds = new Set(parsed.entries.map((entry) => entry.id).filter((id) => typeof id === 'string'))

    sendJson(res, 200, envelope({
      ok: true,
      startedAt,
      data: {
        entries,
        counts: { byStatus: summary.byStatus, unknown: summary.unknown, total: summary.total },
        needsUser: summary.needsUser,
        /**
         * 引擎没有 `ideas` 子命令（旧版本）时为 true：此时列表与状态**只来自 IDEAS.md**，
         * 没有引擎清单可交叉核对。界面必须显式说明，不能装成正常。
         */
        unsupported: ideasUnsupported,
        unsupportedHint: ideasUnsupported ? 'engine-ideas-command-missing' : null,
        /**
         * 活跃层的**三分区**（用户口径）：
         *   `total = active + converted + dropped`
         * 其中 `active = 论证中 + 待补充 + 待拆解`，converted/dropped 都算离队。
         */
        active: summary.active,
        /** 活跃层内已转任务的条数（由任务池引用推出，不是归档计数） */
        converted: summary.converted,
        /** 活跃层内已丢弃（离队） */
        dropped: summary.dropped,
        archivedCount: files.archive.count,
        /**
         * 归档分组（FR-13.7）：**与任务池对照**判定「已转任务」，不按归档件里的字面 status。
         *   taskified  任务池（source ∪ additional_sources）引用了该 id
         *   dropped    未被引用且字面 status = dropped
         *   untasked   未被引用（人工裁决「已消费」离场）
         *   noId       小节缺 `- id:`，无从对照（存量数据问题，显式计数不静默丢）
         * `byLiteralStatus` 仅作诊断：引擎明确归档不改写 status，不是分组依据。
         */
        archived: { ...archived, byLiteralStatus: files.archive.byStatus ?? {} },
        // 统计条要渲染的芯片状态集合：固定 5 个想法状态，保证三分区在界面上闭合（FR-13.6）
        activeStatuses: ideaStripStatuses(),
        layers: {
          list: ideasUnsupported ? 'unsupported' : 'ok',
          markdown: files.markdown.reason === null ? 'ok' : files.markdown.reason,
          archive: files.archive.reason === null ? 'ok' : files.archive.reason
```

</details>

**依据 6 · 源码核查**：[lib/ideas.js:150-208](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/ideas.js#L150-L208)

行协议无围栏状态。

<details>
<summary>查看原文（59行）</summary>

```text
export function parseIdeasMarkdown(text) {
  const lines = String(text).split(/\r?\n/)
  const entries = []
  let current = null
  let inComment = false
  let skippedCommentSections = 0

  const push = () => {
    if (current !== null) entries.push(finalizeEntry(current))
    current = null
  }

  for (const rawLine of lines) {
    // ① HTML 注释块：整段跳过（陷阱 1）。用「出现 <!-- 到 -->」的简单状态机，
    //    因为实测文件里注释块是独立的行（`<!--` 与 `-->` 各占一行）。
    if (!inComment && rawLine.includes('<!--')) {
      inComment = true
      // 同一行里就闭合的情况（`<!-- … -->`）
      if (rawLine.includes('-->')) inComment = false
      continue
    }
    if (inComment) {
      // 注释块里的小节头必须计数并跳过，用来断言「示例条目没被当条目」
      if (SECTION_RE.test(rawLine.trim())) skippedCommentSections += 1
      if (rawLine.includes('-->')) inComment = false
      continue
    }

    const line = rawLine.replace(/\s+$/, '')
    const sectionMatch = SECTION_RE.exec(line)
    if (sectionMatch !== null) {
      push()
      current = { title: sectionMatch[1].trim(), fields: [], notes: [], extra: {} }
      continue
    }
    if (current === null) continue // 文件头与说明文字

    if (line.trim() === '') continue // 段落内的空行不结束条目（正文可能多段）

    // ② notes 追记（多行追加）：键名里带时间戳，必须单独识别（陷阱 2）
    const notesMatch = NOTES_APPEND_RE.exec(line)
    if (notesMatch !== null) {
      current.notes.push(notesMatch[2].trim())
      continue
    }

    const fieldMatch = FIELD_RE.exec(line)
    if (fieldMatch !== null) {
      current.fields.push({ key: fieldMatch[1].trim(), value: fieldMatch[2].trim() })
      continue
    }
    // 续行：追加到上一个字段（Markdown 里长正文会折行）
    if (current.fields.length > 0) {
      const last = current.fields[current.fields.length - 1]
      last.value = `${last.value}\n${line.trim()}`
    }
  }
  push()

```

</details>

**依据 7 · 源码核查**：[lib/ideas.js:407-419](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/ideas.js#L407-L419)

归档end未消费tail。

<details>
<summary>查看原文（13行）</summary>

```text
    stream.on('data', (chunk) => {
      const text = tail + chunk
      // 保留最后一行（可能被截断），下次拼接
      const lastBreak = text.lastIndexOf('\n')
      const complete = lastBreak >= 0 ? text.slice(0, lastBreak + 1) : ''
      tail = lastBreak >= 0 ? text.slice(lastBreak + 1) : text
      for (const line of complete.split('\n')) consume(line)
    })
    stream.on('error', (error) => {
      onError?.(error)
      done('archive-unreadable', String(error))
    })
    stream.on('end', () => done(null))
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 缓存、取消和进程预算有哪些实际限制？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

TTL+single-flight按realpath根合并同key请求，LRU限制完成entry数，定义用path/mtimeMs/size且无限TTL，可避免每次重建慢变索引。失败不污染缓存的注释比实现强——cache.get只排除undefined/null，不看ok；status/detail返回的{ok:false}和broken detect对象都会被缓存到TTL，故暂时故障会短时持续到刷新/过期。refresh会绕过命中但仍复用旧inflight，不是保证重跑；失败不会无限缓存，但也不是失败绝不缓存。文件指纹不是内容hash，同mtime/size变化可漏。

浏览器effects随session/task/view改变abort，图和ideas按需拉，所有slot/locale/styles注册走effect有清理；没有后台固定轮询，只按TTL与刷新，因此数据不是实时流。客户端abort没有在HTTP路由传到cli signal，后端工作仍可继续；主进程timeout只kill直接子进程并等close，未强杀升级/进程树管理，stdout/stderr不断拼接无上限，LRU也不限制inflight并发。Python探测spawnSync每候选最多8秒，会阻塞Node线程，3个候选可串行拖长首轮；默认20秒是单CLI预算，不是整个页面请求总预算。应把资源规模、可信项目和刷新频率视为条件。

#### 证据与依据

**依据 1 · 源码核查**：[lib/cache.js:44-83](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/cache.js#L44-L83)

缓存成功条件和inflight。

<details>
<summary>查看原文（40行）</summary>

```text
  /**
   * @param {string} key
   * @param {boolean} refresh 为 true 时跳过命中，强制重新计算
   * @param {() => Promise<unknown>} compute
   */
  async function get(key, refresh, compute) {
    if (refresh !== true) {
      const hit = entries.get(key)
      if (hit !== undefined && now() - hit.at < ttlMs) {
        entries.delete(key)
        entries.set(key, hit)
        return hit.value
      }
    }

    const pending = inflight.get(key)
    if (pending !== undefined) return pending

    const promise = (async () => {
      const value = await compute()
      if (value !== undefined && value !== null) {
        entries.set(key, { at: now(), value })
        evict()
      }
      return value
    })()

    inflight.set(key, promise)
    try {
      return await promise
    } finally {
      inflight.delete(key)
    }
  }

  return {
    get,
    clear: () => {
      entries.clear()
      inflight.clear()
```

</details>

**依据 2 · 源码核查**：[lib/cache.js:103-142](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/cache.js#L103-L142)

缓存/指纹。

<details>
<summary>查看原文（40行）</summary>

```text
    status: createTtlCache({ ttlMs: config.cacheTtlMs, maxEntries: limit }),
    pool: createTtlCache({ ttlMs: config.pollTtlMs, maxEntries: limit }),
    detail: createTtlCache({ ttlMs: config.detectTtlMs, maxEntries: limit * 4 }),
    review: createTtlCache({ ttlMs: 60_000, maxEntries: limit * 4 }),
    /** IDEAS 清单（`ideas list`）：变化慢，用 pollTtlMs（FR-13）。 */
    ideas: createTtlCache({ ttlMs: config.pollTtlMs, maxEntries: limit }),
    /** IDEAS 正文与归档计数：按文件指纹缓存（FR-13.12：归档不进默认加载路径）。 */
    ideasFiles: createTtlCache({ ttlMs: config.pollTtlMs, maxEntries: limit * 2 }),
    /** 定义层：TTL 视为无限，靠文件指纹失效（见 `definitionFingerprint`）。 */
    definition: createTtlCache({ ttlMs: Number.POSITIVE_INFINITY, maxEntries: limit })
  }
}

/**
 * 定义层缓存键 = 文件路径 + mtimeMs + size。
 * 文件被改写时指纹变化、自动失效；否则永久复用解析结果（2.3 MB 量级，Node 侧数十毫秒）。
 * @param {string} masterPath
 */
export function definitionFingerprint(masterPath) {
  try {
    const stat = statSync(masterPath)
    return `${keyOf(masterPath)}|${stat.mtimeMs}|${stat.size}`
  } catch {
    return `${keyOf(masterPath)}|missing`
  }
}

/**
 * 定义层读取（带指纹缓存）。
 * @param {object} caches `createProjectCaches` 的结果
 * @param {string} masterPath
 * @param {(path: string) => object} read 实际读取函数（通常是 `readMasterIndexed`）
 */
export async function cachedDefinition(caches, masterPath, read) {
  const key = definitionFingerprint(masterPath)
  return caches.definition.get(key, false, async () => read(masterPath))
}

/**
 * P0 兼容层：`detect` 缓存单独用（P0 的路由只用到它）。
```

</details>

**依据 3 · 源码核查**：[lib/orchd-cli.js:200-251](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/orchd-cli.js#L200-L251)

超时/输出/close。

<details>
<summary>查看原文（52行）</summary>

```text
        /* 忽略：可能已退出 */
      }
    }, Math.max(1, timeoutMs))

    const onAbort = () => {
      try {
        child.kill()
      } catch {
        /* 忽略 */
      }
    }
    signal?.addEventListener('abort', onAbort, { once: true })

    child.stdout.setEncoding('utf8')
    child.stdout.on('data', (chunk) => {
      stdout += chunk
    })
    child.stderr.setEncoding('utf8')
    child.stderr.on('data', (chunk) => {
      stderr += chunk
    })

    child.on('error', (error) => {
      clearTimeout(timer)
      signal?.removeEventListener('abort', onAbort)
      finish({ outcome: 'spawn-failed', exitCode: null, json: undefined, stdout, stderr, error: String(error) })
    })

    child.on('close', (code, signalName) => {
      clearTimeout(timer)
      signal?.removeEventListener('abort', onAbort)

      const json = parseJson(stdout)
      const structuredError = json !== null && typeof json === 'object' && json.error !== undefined ? json.error : undefined

      if (timedOut) {
        finish({ outcome: 'timeout', reason: 'cli-timeout', exitCode: code, signal: signalName, json, stdout, stderr, timeoutMs })
        return
      }
      if (structuredError !== undefined) {
        // 退出码 1 表示 stdout 含顶层 error（docs/03 第 5.5 节）——原样保留给 UI（FR-9.2）
        finish({ outcome: 'error', reason: 'cli-failed', exitCode: code, signal: signalName, json, engineError: structuredError, stdout, stderr })
        return
      }
      if (code !== 0) {
        finish({ outcome: 'error', reason: 'cli-failed', exitCode: code, signal: signalName, json, stdout, stderr })
        return
      }
      if (json === undefined) {
        finish({ outcome: 'unparsable', reason: 'cli-unparsable', exitCode: code, json: undefined, stdout: stdout.slice(0, 2000), stderr })
        return
      }
```

</details>

**依据 4 · 源码核查**：[lib/python.js:32-68](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/python.js#L32-L68)

同步探测预算。

<details>
<summary>查看原文（37行）</summary>

```text
const PROBE_TIMEOUT_MS = 8_000
const MINIMUM = { major: 3, minor: 11 }

/**
 * @param {object} config 规范化后的配置
 * @returns {Array<{command: string, args: string[], source: string}>} 去重后的候选
 */
export function pythonCandidates(config) {
  const list = []
  if (typeof config.pythonPath === 'string' && config.pythonPath !== '') {
    list.push({ command: config.pythonPath, args: [], source: 'config' })
  }
  for (const candidate of DEFAULT_CANDIDATES) list.push({ ...candidate, source: 'auto' })

  const seen = new Set()
  return list.filter((candidate) => {
    const key = `${candidate.command}\u0000${candidate.args.join('\u0000')}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/** 跑一个候选解释器，返回它自报的版本信息。 */
function probeCandidate(candidate) {
  const result = spawnSync(candidate.command, [...candidate.args, '-c', PROBE_SCRIPT], {
    encoding: 'utf8',
    timeout: PROBE_TIMEOUT_MS,
    windowsHide: true,
    env: {
      ...process.env,
      PYTHONIOENCODING: 'utf-8',
      PYTHONDONTWRITEBYTECODE: '1'
    }
  })

  if (result.error !== undefined && result.error !== null) {
```

</details>

**依据 5 · 源码核查**：[client/client.js:2660-2724](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/client/client.js#L2660-L2724)

取消与按需UI请求。

<details>
<summary>查看原文（65行）</summary>

```text
      React.useEffect(() => {
        if (sessionId === null) {
          setContext({ status: 'no-session', data: null, error: null, meta: null })
          return undefined
        }
        const controller = new AbortController()
        setContext((previous) => ({ ...previous, status: 'loading' }))
        api('/orchd/api/context', { session: sessionId, refresh: tick > 0 }, controller.signal)
          .then((body) => setContext({ status: 'ok', data: body.data, error: null, meta: body.meta }))
          .catch((error) => {
            if (error?.name === 'AbortError') return
            setContext((previous) => ({ status: 'error', data: previous.data, error, meta: error?.envelope?.meta }))
          })
        return () => controller.abort()
      }, [sessionId, tick])

      const contextState = context.data?.state
      React.useEffect(() => {
        if (sessionId === null || contextState !== 'ready') {
          setBoard({ status: 'idle', data: null, error: null, meta: null })
          return undefined
        }
        const controller = new AbortController()
        setBoard((previous) => ({ ...previous, status: 'loading' }))
        api('/orchd/api/board', { session: sessionId, refresh: tick > 0 }, controller.signal)
          .then((body) => setBoard({ status: 'ok', data: body.data, error: null, meta: body.meta }))
          .catch((error) => {
            if (error?.name === 'AbortError') return
            setBoard((previous) => ({ status: 'error', data: previous.data, error, meta: error?.envelope?.meta }))
          })
        return () => controller.abort()
      }, [sessionId, tick, contextState])

      // IDEAS 只在切到想法视图时才拉（NFR：不为默认视图付成本；归档只计数不进默认路径）
      React.useEffect(() => {
        if (sessionId === null || contextState !== 'ready' || view !== 'ideas') return undefined
        const controller = new AbortController()
        setIdeas((previous) => ({ ...previous, status: 'loading' }))
        api('/orchd/api/ideas', { session: sessionId, refresh: tick > 0 }, controller.signal)
          .then((body) => setIdeas({ status: 'ok', data: body.data, error: null, meta: body.meta }))
          .catch((error) => {
            if (error?.name === 'AbortError') return
            setIdeas((previous) => ({ status: 'error', data: previous.data, error, meta: error?.envelope?.meta }))
          })
        return () => controller.abort()
      }, [sessionId, tick, contextState, view])

      // 依赖图只在切到图视图时才拉（与 IDEAS 同理：默认视图不付成本）
      React.useEffect(() => {
        if (sessionId === null || contextState !== 'ready' || view !== 'graph') return undefined
        const controller = new AbortController()
        setGraph((previous) => ({ ...previous, status: 'loading' }))
        api('/orchd/api/graph', {
          session: sessionId,
          refresh: tick > 0,
          focus: graphFocus,
          includeTerminal: graphIncludeTerminal ? '1' : undefined
        }, controller.signal)
          .then((body) => setGraph({ status: 'ok', data: body.data, error: null, meta: body.meta }))
          .catch((error) => {
            if (error?.name === 'AbortError') return
            setGraph((previous) => ({ status: 'error', data: previous.data, error, meta: error?.envelope?.meta }))
          })
        return () => controller.abort()
      }, [sessionId, tick, contextState, view, graphFocus, graphIncludeTerminal])
```

</details>

**依据 6 · 源码核查**：[lib/routes.js:141-155](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/routes.js#L141-L155)

未传signal的调用。

<details>
<summary>查看原文（15行）</summary>

```text
/** 状态层 `status --all`（5 s TTL；失败不污染缓存由 cache 保证）。 */
async function loadStatusLayer(deps, detected, refresh) {
  const root = detected.root
  return deps.caches.status.get(keyOf(root), refresh, () =>
    deps.cli.statusAll({ root, workDir: detected.layout?.mainWorktree, python: detected.python })
  )
}

/** 就绪池 `pool --all`（30 s TTL，只为 `blocked_downstream_count`）。 */
async function loadPoolLayer(deps, detected, refresh) {
  const root = detected.root
  return deps.caches.pool.get(keyOf(root), refresh, () =>
    deps.cli.poolAll({ root, workDir: detected.layout?.mainWorktree, python: detected.python })
  )
}
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 启动与三阶段成本如何衡量？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要宿主webServer/workspaceRegistry，浏览器locale/slots/sidebarRightTabs/sidebarRight/shortcuts，以及已装且可信的项目orchd/Python>=3.11。插件不包含引擎，not_installed只是展示入口；用户可复制命令独立执行，或查看模板后交会话agent。包无明确engines DSH约束，兼容依具体sidebar/registry/steerABI。README“Python3”被源码最低3.11收窄；配置解释器失败不偷偷回退，利于确定性。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH sidebar/Web服务、Python>=3.11、项目已有orchd引擎/定义文件 | 核项目/容器布局、可信引擎与宿主授权，未接入项目需独立安装初始化 | 插件不含引擎，不自带云模型；安装若交Agent则沿宿主模型费用，金额未知 |
| 持续使用 | status/pool/detail/review/ideas Python进程与本地解析、缓存内存 | 理解定义/状态差异、局部错误与裁剪，刷新及追溯原任务，工时未知 | TTL5/30/10秒为默认缓存期限，非实时推送/性能承诺；stdout无大小硬上限 |
| 失败恢复 | 重新探测/刷新、进程及源文件恢复资源 | 核布局标记、引擎/CLI兼容与身份，清除错误展示或恢复意外引擎副作用 | 面板不替代引擎备份恢复；无自动撤销安装/任务写入，恢复耗时金额未知 |

收益单位是读者准确理解一组任务的目标/依赖/审查证据后作决策，不能把节点数、作者813任务示例或20秒配置当成功效果/运行工时。已经采用orchd的人可减少切终端/翻定义的接线，首次接入新项目还含引擎安装和任务规范维护。该固定发布树没有研究可用的测试文件，README开发期真引擎零变更和800+虚拟滚动为作者报告，本次仅查源码。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:20-47](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/package.json#L20-L47)

host/client装配声明。

<details>
<summary>查看原文（28行）</summary>

```text
  ],
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./client/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "client",
    "cordis.patch.yml"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-sidebar-right",
        "@deepseek-ai/dsh-client-ui-conversation"
      ]
    }
  }
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:21-49](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/index.js#L21-L49)

硬依赖与调用器。

<details>
<summary>查看原文（29行）</summary>

```text

export const name = 'dsh-plugin-orchd'
export const inject = ['webServer', 'workspaceRegistry']

/**
 * 开发期 HMR 探针的模块求值时刻。
 *
 * 它会随 「host.moduleLoadedAt」 进入 「/orchd/api/context」 的响应，从而**在面板底部可见**。
 * HMR 的模块替换会重新求值本模块 → 该值变；宿主进程没重启时 「uptime」 连续增长、「pid」 不变。
 * 三者一起看就能区分「模块热替换」与「进程重启」（见 README「迭代方式」）。
 * P4 工程化时应与 「/orchd/api/self」 一起移除，或按配置开关默认关闭。
 */
const MODULE_LOADED_AT = new Date().toISOString()

export function apply(ctx, rawConfig) {
  const { config, warnings } = normalizeConfig(rawConfig)
  for (const warning of warnings) ctx.logger?.warn?.(`orchd-tasks: config: ${warning}`)

  const caches = createProjectCaches(config)
  const cli = createCliInvoker(config, undefined, ctx.logger)
  const host = {
    moduleLoadedAt: MODULE_LOADED_AT,
    // cache.js 的求值时刻。HMR 级联重载时两个值会一起刷新；
    // 面板底部的「宿主模块」行只显示 moduleLoadedAt，这里同时回传以便分辨是哪个模块被换了。
    cacheModuleLoadedAt: CACHE_MODULE_LOADED_AT,
    pid: process.pid,
    uptimeMs: Math.round(process.uptime() * 1000)
  }
  const deps = { ctx, config, caches, cli, host }
```

</details>

**依据 3 · 源码核查**：[lib/python.js:32-33](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/python.js#L32-L33)

Python最低版本。

```text
const PROBE_TIMEOUT_MS = 8_000
const MINIMUM = { major: 3, minor: 11 }
```

**依据 4 · 源码核查**：[lib/python.js:98-126](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/python.js#L98-L126)

配置失败不回落。

<details>
<summary>查看原文（29行）</summary>

```text
  const candidates = pythonCandidates(config)
  const explicit = typeof config.pythonPath === 'string' && config.pythonPath !== ''
  const failures = []

  for (const candidate of candidates) {
    const probed = probeCandidate(candidate)
    if (!probed.ok) {
      failures.push({ command: candidate.command, args: candidate.args, source: candidate.source, reason: probed.reason })
      if (explicit) break
      continue
    }
    if (probed.major < MINIMUM.major || (probed.major === MINIMUM.major && probed.minor < MINIMUM.minor)) {
      failures.push({
        command: candidate.command,
        args: candidate.args,
        source: candidate.source,
        reason: `version ${probed.version} is below the engine minimum ${MINIMUM.major}.${MINIMUM.minor}`
      })
      if (explicit) break
      continue
    }
    return {
      path: candidate.command,
      args: [...candidate.args],
      version: probed.version,
      source: candidate.source
    }
  }

```

</details>

**依据 5 · 源码核查**：[lib/config.js:13-22](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/config.js#L13-L22)

默认预算。

<details>
<summary>查看原文（10行）</summary>

```text
export const DEFAULTS = Object.freeze({
  pythonPath: null,
  requestTimeoutMs: 20_000,
  cacheTtlMs: 5_000,
  pollTtlMs: 30_000,
  detectTtlMs: 10_000,
  maxProjectContexts: 8,
  orchdCoreRepo: null,
  allowRoots: []
})
```

</details>

**依据 6 · 源码核查**：[README.md:60-77](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/README.md#L60-L77)

作者前置/零变更说明。

<details>
<summary>查看原文（18行）</summary>

```text

- **DSH** 提供右侧栏面板席位（`sidebarRightTabs` + `sidebar.right.pane.tab`，session 作用域）。
- **项目侧装了 orchd**（项目根或容器主工作树下有 `.orchd/`）。没装的话面板会给出接入入口，不会静默失败。
- **Python 3** 在 PATH 上（`python` / `py -3` / `python3` 依次探测，也可在配置里写死 `pythonPath`）——
  面板跑的是**项目自带的**引擎入口 `python <项目>/.orchd/__main__.py`，插件不自带、不安装引擎。

## 只读保证

这是硬约束，不是口号：

- 命令白名单 **fail-closed**：不在白名单里的子进程调用根本不 spawn，被拒时记一行结构化日志。
- 子进程环境**剥掉会话身份**，读命令不会带出任何会被引擎当成「有人在动这个任务」的变量。
- 不直读账本、不碰锁、不写项目文件；面板不做文件导出（诊断信息只复制到剪贴板）。
- 开发期在**真引擎、真账本、真 git 仓库**上跑只读冒烟：比对工作区文件哈希、账本事件数、`git status`，要求零变更。

## 配置

配置写进 profile 的 `cordis.patch.yml`（`- id: orchd-tasks` 那一行的 `config:` 下），全部有默认值：
```

</details>

#### 缺口

- 同条件任务决策准确率、端到端延迟、取消后资源量和用户整理工时
  **影响**：无法给出降低成本或大规模流畅性的量化收益
  **进一步探讨**：可信固定引擎/数据集比较CLI基线，记录正确判断、总延迟、输出量和人工核对时间

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 如何评价采用，什么改进方向可被反证？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议观察，原因是运行态ready接线遗漏、HTTP身份/安装注入边界、任意项目引擎执行与无硬资源预算会影响核心只读观察承诺，而非单纯缺宿主冒烟。它的同屏多层来源与显式差异/裁剪有价值，继续探讨可从可信orchd固定版、目标session授权、最后主工作树约束和检测runner接线开始；当前不要把面板ready或无环图当引擎健康与完整性认证。

可推导“受权项目观察快照”。对比现有每路由独立CLI+缓存，先固定session到用户及主树能力，绑定引擎版本/launcherhash和采集批次，把定义/状态/pool的源指纹、时间、支持范围、未完成/裁剪原因一起交付；安装steer另需一次性确认能力和不可静默变化的模板摘要。引擎在受控只读环境/资源预算内运行，代价是兼容与启动成本。最小反例包括session越权、marker外指向、恶意launcher、engine不一致、输出洪泛/拒杀、缓存中途改定义、隐藏区环和无尾换行归档。若新快照仍把不一致称ready、越权注入或截断当完整，或成本增加而判断错误未下降，则否定效果假设。方向未验证，不算现有能力或业务收益。

#### 证据与依据

**依据 1 · 源码核查**：[lib/routes.js:113-133](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/routes.js#L113-L133)

检测接线基线。

<details>
<summary>查看原文（21行）</summary>

```text
export async function loadContext(deps, sessionId, { refresh = false } = {}) {
  const { ctx, config, caches } = deps

  const resolution = await resolveProjectRoot(ctx, sessionId, config)
  if (resolution.error !== undefined) {
    return { ok: false, error: { kind: 'broken', reason: resolution.error.reason, message: reasonText(resolution.error.reason), details: resolution.error.detail } }
  }

  const valid = validateRoot(resolution.root)
  if (valid.ok !== true) {
    return { ok: false, error: { kind: 'broken', reason: valid.reason, message: reasonText(valid.reason), details: valid.detail } }
  }

  const detected = await caches.detect.get(keyOf(resolution.root), refresh, () =>
    detect({ root: resolution.root, config, runCli: deps.runCli })
  )

  return { ok: true, resolution, detected }
}

/** 定义层（带指纹缓存）。masterPath 缺失时返回 undefined。 */
```

</details>

**依据 2 · 源码核查**：[lib/master.js:179-205](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/master.js#L179-L205)

主树信任基线。

<details>
<summary>查看原文（27行）</summary>

```text
  const containerWorktree = markerRead && marker?.layout === 'container' && typeof marker?.main_worktree === 'string' && marker.main_worktree.trim() !== ''
    ? canonicalPath(marker.main_worktree)
    : null

  // 标记读出来是 container，但主工作树目录不存在：这是**布局标记与真实主工作树不一致**
  // （FR-2.2 的 layout-marker-mismatch），不能静默当成 flat 读下去。
  if (containerWorktree !== null && !isDirectory(join(containerWorktree, '.orchd'))) {
    return {
      ok: false,
      reason: 'layout-marker-mismatch',
      detail: {
        root: rootCanonical,
        markerPath,
        declaredMainWorktree: containerWorktree,
        hint: 'the layout marker declares a container layout, but the declared main worktree has no .orchd directory'
      }
    }
  }

  /** 主候选：标记说什么就用什么；标记缺失/不可解析/未知 → flat。 */
  let primary
  /** 备选候选（探针兜底用）：与主候选不同的那一分支。 */
  let alternate

  if (containerWorktree !== null) {
    primary = build('container', containerWorktree)
    alternate = build('flat', rootCanonical, { note: 'container marker present; flat candidate probed as fallback' })
```

</details>

**依据 3 · 源码核查**：[lib/orchd-cli.js:164-203](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/orchd-cli.js#L164-L203)

引擎执行边界。

<details>
<summary>查看原文（40行）</summary>

```text
  const commandArgs = [...(python.args ?? []), launcher, ...argv]

  const startedAt = Date.now()
  return await new Promise((resolve) => {
    let settled = false
    const finish = (value) => {
      if (settled) return
      settled = true
      resolve({ ...value, elapsedMs: Date.now() - startedAt, argv })
    }

    let child
    try {
      child = spawnImpl(command, commandArgs, {
        // cwd 必须是主工作树（见函数头注释的 E036 说明）
        cwd,
        windowsHide: true,
        // env 是**白名单式**构造：只带出必要变量 + 我们的只读开关，
        // 绝不把宿主的 ORCHD_SESSION_ID（若存在）传下去（FR-10.1）。
        env: buildChildEnv(),
        stdio: ['ignore', 'pipe', 'pipe']
      })
    } catch (error) {
      finish({ outcome: 'spawn-failed', exitCode: null, json: undefined, stdout: '', stderr: '', error: String(error) })
      return
    }

    let stdout = ''
    let stderr = ''
    let timedOut = false

    const timer = setTimeout(() => {
      timedOut = true
      try {
        child.kill()
      } catch {
        /* 忽略：可能已退出 */
      }
    }, Math.max(1, timeoutMs))

```

</details>

**依据 4 · 源码核查**：[lib/install-entry.js:98-108](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/install-entry.js#L98-L108)

注入边界。

<details>
<summary>查看原文（11行）</summary>

```text
 */
export function injectInstallPrompt({ ctx, sessionId, text }) {
  const support = probeInjectSupport(ctx, sessionId)
  if (support.supported !== true) {
    return { injected: false, reason: support.reason }
  }
  const agent = ctx.get('agents').get(sessionId)
  const message = buildUserMessage(text)
  agent.steer(message)
  return { injected: true, reason: null, messageId: message.id }
}
```

</details>

**依据 5 · 源码核查**：[lib/model.js:447-457](https://github.com/7bder/dsh-plugin-orchd/blob/ef331b30c89854e29dc9d4954bd86e457a24b850/lib/model.js#L447-L457)

图裁剪。

<details>
<summary>查看原文（11行）</summary>

```text

  // 截断（FR-7.6）：焦点与活跃种子优先，其次层级浅的，最后 id 字典序（结果稳定可测）
  let truncated = false
  let omitted = 0
  if (keep.size > maxNodes) {
    const rank = (id) => (id === focus ? 0 : (relation.get(id) === 'seed' ? 1 : 2))
    const ordered = [...keep].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
    const allowed = new Set(ordered.slice(0, maxNodes))
    omitted = keep.size - allowed.size
    keep = allowed
    truncated = true
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
