# DSH Context

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[fa98a62](https://github.com/bowenliang123/dsh-context/tree/fa98a621e7aabdebdb04fc935221a4ba5bf72883)

<!-- BEGIN META -->
[![GitHub ★ 5,419](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C419&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bowenliang123/dsh-context) [![npm 30d 563,380](https://img.shields.io/static/v1?label=npm+30d&message=563%2C380&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-context) [![最新发布 2026-11-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-context)
<!-- END META -->

> **功能**：查看 DSH 会话的上下文组成、历史步骤、事件与跨会话用量概况。

> **亮点**：[Q01](#research-q01) 把原生压力投影与可导航的步骤、事件和组成相连；[Q02](#research-q02) 的分页和[Q03](#research-q03) 的物化缓存为长历史诊断提供结构化入口。

> **主要限制**：[Q02](#research-q02) 的未完整分片在同revision切窗时仍有待复现身份错位风险；[Q03](#research-q03) 的费用及[Q04](#research-q04) 的Agent别名都不等于真实账单或可信身份。

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
  - [Q01 · 原生压力之外增加了什么定位路径，时间线事件如何对应请求？](#detail-section-11)
  - [Q02 · 完整历史分页和明细窗口如何管理版本，切换窗口还可能错位吗？](#detail-section-12)
  - [Q03 · 跨会话物化缓存、项目统计与估价可以支持什么判断？](#detail-section-13)
  - [Q04 · Agent标签、主动提示词与会话访问有哪些边界？](#detail-section-14)
  - [Q05 · 哪些操作和恢复负担支持小范围试用？](#detail-section-15)
  - [Q06 · 窗口身份与覆盖说明能否改善可信诊断，如何证伪？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要追查长工具返回、资料注入与Agent协作的开发者，把上下文组成、历史步骤和源事件放到可查看的视图中。

原生上下文压力环与原始日志提供基本数值和事实；插件增加组合视图、历史导航和聚合，最终归因仍需回查原事件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 会话上下文视图 | 查看组成和压力 | 数据来自宿主投影，不是独立计量 |
| 时间线与事件导航 | 按步骤/轮次查事件及峰值 | 显示标签不证明因果或可信身份 |
| 历史分页 | 查看投影外的请求/事件等集合 | 依赖持久化/observe和修订匹配，空值不证明不存在 |
| 跨会话概况 | 按日期和项目选复核对象 | 费用是估算，覆盖与时窗须分别读 |
| /context命令 | 在对话内打开诊断 | 依赖Web命令与UI服务 |
| 提示前后缀配置 | 调整系统提示section | 默认空；与纯诊断效果分开评估 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 包声明的DSH版本和sessionProjections | 必需 | 会话投影与宿主入口 | 已知旧版本走fallback；未知兼容不能假定 |
| Web客户端注入和插槽 | 视图必需 | 页签、侧栏、命令 | 宿主数据存在也不保证UI加载 |
| connection、sessions及persistence/query | 历史查阅必需 | 取活动/持久化/观察数据 | 缺能力或读失败可返回空，不能解释为无事件 |
| 模型目录与用量记录 | 估价必需 | 汇总costUsd及覆盖 | 回真实账单核对 |
| systemPrompt | 非空提示配置时必需 | 插入前后section | 只诊断时保持空配置 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 用户用个人隔离Web profile加载并留空主动提示 | 版本/依赖和UI可识别 |
| 2 | 用户选择已知非敏感长会话 | 原生压力、步骤和事件对齐 |
| 3 | 宿主分页读取/回放，客户端合并 | revision与覆盖可解释，空明细单列 |
| 4 | 用户回原事件确认定位 | 错位或越权停止，禁用并恢复配置 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 安装资源未知 | 核对版本、隔离与配置 | 无实际启动测量 |
| 持续使用 | 分页/回放、磁盘缓存和浏览器资源未知 | 对照源事件及估价覆盖 | 未测内存峰值和节时 |
| 失败恢复 | 重新读取和缓存排查资源未知 | 保留window/rev、回日志、撤回提示 | 共享权限需独立核查 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 上下文定位 | 步骤、事件、组成与milestone导航 | 正确归因率和总人工节时 |
| 长历史读取 | 版本页、cursor、回放及租约释放 | 大会话吞吐与切窗竞态后果 |
| 跨会话概况 | 物化缓存、项目用量和费用覆盖 | 真实账单与资源收益 |

> **思考**：[Q02](#research-q02) 的未完整分片在同revision切窗时仍有待复现身份错位风险；[Q03](#research-q03) 的费用及[Q04](#research-q04) 的Agent别名都不等于真实账单或可信身份。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把原生压力投影与可导航的步骤、事件和组成相连；[Q02](#research-q02) 的分页和[Q03](#research-q03) 的物化缓存为长历史诊断提供结构化入口。

[Q02](#research-q02) 的分页rev/cursor校验和读句柄/观察租约释放可借鉴；移植须保留完整窗口身份。[Q03](#research-q03) 分片物化缓存与原子文件写可降低重复工作，但没有资源测量，不能据架构宣称性能胜出。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的未完整分片在同revision切窗时仍有待复现身份错位风险；[Q03](#research-q03) 的费用及[Q04](#research-q04) 的Agent别名都不等于真实账单或可信身份。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 用已知源事件的个人非敏感会话试查，保持主动提示为空；错位、缺历史或访问边界不能解释时停用并回原日志。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

投影、分页、缓存及展示接线已检查；窗口竞态属于源码推断，未复现；归因与资源收益没有实测，完整身份方案尚未实现。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、tsdown.config.ts、README.md、src/host/index.ts、src/client/index.ts、src/client/components/timelineMilestones.ts、src/host/history.ts、src/client/historyPaging.ts、src/client/detailStore.ts、src/host/overviewCache.ts、src/host/overviewAggregate.ts、src/host/foldInjections.ts、src/host/connection.ts、src/host/postRoute.ts、src/host/promptInjection.ts、src/host/config.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件，重点覆盖旧Q01—Q05及新detailStore/history、overview缓存/项目和milestone变化；没有全面审计全部UI、目录价格映射或共享部署鉴权。
- 下一步：不运行目标。后续以已知源事件、缺失历史与同revision切窗对照正确定位和资源总量，保留能推翻方案的结果，见[Q06](#research-q06)。

**分析版本**

- **仓库**：[bowenliang123/dsh-context](https://github.com/bowenliang123/dsh-context)
- **版本号**：0.87.1（[固定提交 fa98a62](https://github.com/bowenliang123/dsh-context/tree/fa98a621e7aabdebdb04fc935221a4ba5bf72883)）
- **版本日期**：2026-11-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出将window并入片段验收身份并显式标明历史覆盖的未验证假设，用正确定位、错误确定结论和全部诊断时间共同检验。

不运行目标。后续以已知源事件、缺失历史与同revision切窗对照正确定位和资源总量，保留能推翻方案的结果，见[Q06](#research-q06)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 2430 | — | — | 46916 |
| .ts | source | 178 | 34472 | 32030 | 136 | — |
| .mjs | source | 14 | 1498 | 1418 | 1 | — |
| .tsx | source | 66 | 14376 | 13652 | 66 | — |
| .ts | test | 144 | 74094 | 68402 | 258 | — |
| .tsx | test | 1 | 125 | 114 | 0 | — |
| .js | example | 3 | 9 | 9 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/bowenliang123/dsh-context/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 57](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=57&color=737b86&logo=github)](https://github.com/bowenliang123/dsh-context/issues?q=is%3Aissue+created%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z) [![近30天关闭 62](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=62&color=737b86&logo=github)](https://github.com/bowenliang123/dsh-context/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z)



统计日期：2026-11-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：上下文诊断视图能否把压力、步骤和原事件连成可信定位路径，分页与缓存如何影响判断？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 原生压力之外增加了什么定位路径，时间线事件如何对应请求？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

插件主要服务经常在同一DSH长会话里执行工具、注入资料或协作的开发者。合格诊断应指出压力变化所在会话、请求步骤和源事件，并回原日志核对；仅看一个高占比数字不算定位完成。原生输入框压力投影已经提供占用量，插件的增量是把组成、历史请求、事件、文件和跨会话概况放在可跳转的视图里，而不是独立创造更精确的Token计量。偶尔只看占用率的人通常可先用原生环形图。

宿主入口注册timeline、headers、activity及facts/history通道，客户端注册会话页、侧栏和/context命令。时间线标记按事件种类设显示优先级，按turn找目标请求，否则用事件seq求边界；最长耗时和最大增长则由请求记录计算。由此可把压缩、技能或Agent事件作为定位线索，但标记的视觉突出不证明该事件导致模型效果下降，也不证明待办完成等于业务交付通过。实际责任仍需查事件内容。

README的“与原生投影相同”属于作者说明，本轮核对入口与导航机制，不将它延伸为所有视图和历史数据都已实测一致。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.ts:63-105](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/host/index.ts#L63-L105)

宿主注册各会话通道、投影与overview。

<details>
<summary>查看原文（43行）</summary>

```text
  const attribution = createToolAttribution(ctx, harnessVersion)
  watchStepIdentity(ctx)
  const gate = createDetailGate(ctx)
  const bounds = resolveBounds(config)
  const shadow = new DetailShadow(ctx, historyBounds(bounds), coldReads, () => observeOf(ctx))
  watchDetailChannel(ctx, bounds, coldReads, gate, shadow, pricing)
  const deltaGate: DetailChannelGate = { ...gate, live: false }
  const ownerOf = attribution.ownerOf.bind(attribution)
  const coldStates = createColdTimelineStates(ctx, bounds, { coldReads, resolve: ownerOf })
  watchDeltaChannel(ctx, bounds, coldReads, deltaGate, shadow, ownerOf, coldStates)
  const detailStateOf = (id: string): Promise<TimelineState | null> => shadow.stateOf(id)
  watchFactsChannel(ctx, bounds, { gates: gate, coldStates, detailState: detailStateOf, cost: pricing })
  watchHistoryChannel(ctx, bounds, { coldReads, detailState: detailStateOf })
  watchCommandPageChannel(ctx, resolveBounds(config), coldReads)
  const cache = createOverviewCache({ config })
  watchHeadsChannel(ctx, { bounds, coldReads, cost: pricing, cache })
  gate.retain('contextTimeline', ctx.sessionProjections.register(createContextTimelineDefinition(config, () => gate.live, pricing)))
  ctx.sessionProjections.register(createContextHeadersDefinition(name => attribution.ownerOf(name)))
  ctx.sessionProjections.register(createContextActivityDefinition())
  watchTimelineRowSweep(ctx)
  let overview: ReturnType<typeof watchOverviewRoute> | null = null
  let warmTimer: ReturnType<typeof setTimeout> | null = null
  ctx.effect(() => () => {
    if (warmTimer !== null) clearTimeout(warmTimer)
    warmTimer = null
  }, 'dsh-context: overview warm schedule')
  const backfill = watchActivityBackfill(ctx, coldReads, undefined, {
    ownCache: cache,
    config,
    autoStart: true,
    onStart: () => { catalog.ensure() },
    onChange: () => {
      if (warmTimer !== null) return
      warmTimer = setTimeout(() => {
        warmTimer = null
        void overview?.warm()
      }, OVERVIEW_WARM_DELAY_MS)
      ;(warmTimer as { unref?: () => void }).unref?.()
    },
  })
  watchSnapshotRoute(ctx, backfill, cache, pricing)
  overview = watchOverviewRoute(ctx, pricing, backfill, { cache })
  watchPromptInjection(ctx, config)
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:89-118](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/client/index.ts#L89-L118)

客户端视图、侧栏与命令接线。

<details>
<summary>查看原文（30行）</summary>

```text
  const settings = createContextSettings()
  const heads = makeAgentHeads()
  const ContextView = makeContextView(ctx, kit, settings, heads)
  const FleetView = makeFleetView(ctx, kit, heads)

  ctx.effect(() => watchPlacement(settings, {
    tab: () => ctx.slots.inject('conversation.view', () => ctx.slots.register(
      { name: 'conversation.view', id: CONTEXT_VIEW_ID, order: 20, locale: NS, label: () => t('tab.context') },
      props => h(ContextView, props),
    )),
    sidebar: () => watchSidebarContextTab(ctx, ContextView, t, NS),
  }), 'dsh-context: placement')

  ctx.effect(() => watchFleetTab(
    ctx,
    settings,
    props => h(FleetView, props as unknown as Parameters<typeof FleetView>[0]),
    t,
    NS,
  ), 'dsh-context: fleet tab')

  const ContextJump = makeContextJumpButton(ctx, kit, settings)
  ctx.slots.inject(JUMP_SLOT, () => {
    return ctx.slots.register(
      { name: JUMP_SLOT, id: JUMP_ID, order: 20, locale: NS },
      props => h(ContextJump, props),
    )
  })

  registerContextCommand(ctx, kit)
```

</details>

**依据 3 · 源码核查**：[src/client/components/timelineMilestones.ts:8-24](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/client/components/timelineMilestones.ts#L8-L24)

事件类别的展示优先级。

<details>
<summary>查看原文（17行）</summary>

```text
export const MILESTONE_PRIORITY: Record<MilestoneKind, number> = {
  compaction: 0,
  prune: 1,
  'goal-complete': 2,
  'team-task-complete': 3,
  'todo-done': 4,
  'goal-create': 5,
  'team-task-create': 6,
  'todo-add': 7,
  ask: 8,
  longest: 9,
  growth: 10,
  spawn: 11,
  agent: 12,
  skill: 13,
  model: 14,
}
```

</details>

**依据 4 · 源码核查**：[src/client/components/timelineMilestones.ts:82-105](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/client/components/timelineMilestones.ts#L82-L105)

seq/turn定位与耗时/增长峰值计算。

<details>
<summary>查看原文（24行）</summary>

```text
export function eventTargetIndex(
  requests: RequestRecord[],
  ev: ContextEventRecord,
  granularity: 'step' | 'turn',
): number {
  if (granularity === 'turn' && typeof ev.turn === 'number') {
    const at = requests.findIndex(r => (r.turn ?? 0) === ev.turn)
    if (at >= 0) return at
  }
  return boundaryIndex(requests, ev.seq)
}

export function metricPeaksOf(requests: RequestRecord[]): { longest: Peak | null; growth: Peak | null } {
  let longest: Peak | null = null
  let growth: Peak | null = null
  let prev: number | null = null
  for (let i = 0; i < requests.length; i++) {
    const req = requests[i]
    const activeMs = req.activeMs ?? 0
    if (activeMs > 0 && (longest === null || activeMs > longest.value)) longest = { idx: i, value: activeMs }
    if (prev !== null) {
      const delta = req.total - prev
      if (delta > 0 && (growth === null || delta > growth.value)) growth = { idx: i, value: delta }
    }
```

</details>

**依据 5 · 作者声明**：[README.md:88-102](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/README.md#L88-L102)

作者解释原生投影与插件视图的分工。

<details>
<summary>查看原文（15行）</summary>

```text
| **Context Stats** | 轮次、步骤、用户输入、实时工具调用——以及根据 models.dev 价格列表估算的成本（将鼠标悬停在 `?` 上可查看每百万 Token 单价；仅 DeepSeek 区分高峰 / 非高峰：其挂牌价为谷时价，高峰时段按 2 倍计费）。 |
| **Token Stats** | 计费 Token 用在了哪里——总量与输入框下方聊天统计行相同，拆分为系统提示词、工具定义、用户消息、注入上下文、技能注入、工具调用、推理和回答。工具调用把工具名称与参数（提示词中重放的部分，加上输出中生成的部分）与这些工具返回的结果一并计入；回答从同一份助手内容与输出中拆出模型的回复正文；推理以同样方式拆出其思考内容；会话的缓存命中率显示在角落。 |
| **Timing Stats** | 活跃时间如何分布在模型调用、工具运行和开销之间。 |
| **Current Context** | 此刻窗口中的内容。 |
| **Context Timeline** | 每个请求的大小及其变化过程。 |
| **Context Browser** | 任意请求实际由哪些内容组成。 |
| **Context Events** | 上下文窗口何时以及为何发生变化。 |
| **File Activity** | Agent 对你的文件做了什么。 |
| **命令执行** | Agent 执行了哪些命令、每次运行如何结束、主要用到了哪些程序。 |

成本估算遵循一套有文档记录的规则：[模型定价如何映射](docs/model-pricing-mapping.md)。

标题中的占用率和组成数据读取的都是与聊天输入框上下文环形图相同的**官方 Token 计量投影**（`contextPressure` / `contextBreakdown`），因此数值始终与环形图一致——卡片中的百分比就是同一占用率，精确显示到小数点后一位。

**Context Stats** 卡片中的 Agent Network 单元格（整个 Agent 家族的计费 Token 和预估成本）会跳转至 **Fleet** 标签页。输入输出一行的胶囊同样是跳转链接：**用户输入** 打开上下文浏览器的用户消息，**读取 / 写入 / 搜索 / 图片** 落到文件活动卡片并选中对应筛选。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 完整历史分页和明细窗口如何管理版本，切换窗口还可能错位吗？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

历史通道从当前detail状态读取活动会话；冷会话先尝试持久化open/read并在finally关闭句柄，没有durable读能力再observeSession，并释放观察租约。冷缓存绑定持久化服务身份和stat revision，无stat时只在短新鲜期内复用。分页按part使用beforeSeq或beforeIndex，并把limit限到1000；客户端逐页要求page.rev匹配，支持cancel，拒绝停滞cursor，最终以旧到新的顺序合并。这比仅看有界投影更能覆盖历史，但页数上限、缺资料与读取失败仍可返回null，不能把空明细解释成没有发生。

客户端完整历史集合就绪后会覆盖相应requests/events，某些collection也能走完整集合路径。然而未完整的facts分片仍有一个待复现窗口身份风险：ensurePart收到同part的新window时更新wantedParts并删除partRev，但inflightParts使新请求暂缓；飞行中的旧窗口回来后，fetchPart只检查generation和acceptedRev，随后写入partRev=rev，finally只在rev改变时继续取。若同revision内切窗口且该part未由完整集合替代，旧片段可能被当成当前片段复用。

这是固定源码支持的竞态假设，不是本轮复现缺陷，不能泛化到全部历史路径。重构或更多测试文件的存在也不能代替按窗口身份核对。试用时应将选中步骤与原始事件对照，发现错位时回日志，并保留请求window/rev和响应用于定位。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/history.ts:217-226](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/host/history.ts#L217-L226)

持久化句柄finally关闭。

<details>
<summary>查看原文（10行）</summary>

```text
async function readDurableEvents(persistence: PersistenceLike | undefined, sessionId: string): Promise<SessionEvent[] | null> {
  if (persistence === undefined || typeof persistence.open !== 'function') return null
  const handle = await persistence.open(sessionId, 'read')
  try {
    const raw: unknown = await handle.read(0)
    const events = asRecord(raw)?.events
    return Array.isArray(events) ? events as SessionEvent[] : null
  } finally {
    await handle.close()
  }
```

</details>

**依据 2 · 源码核查**：[src/host/history.ts:269-328](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/host/history.ts#L269-L328)

live、durable、observe回退、缓存身份和租约释放。

<details>
<summary>查看原文（60行）</summary>

```text
          const session = getSession?.(wanted.sessionId)
          if (session !== undefined && session !== null) {
            const state = await live(wanted.sessionId)
            if (state !== null) return reply({ ok: true, value: pageValue(state, true, wanted) })
          }
          const persistence = c.get('sessionPersistence') as PersistenceLike | undefined
          const identity = serviceIdentityOf(persistence)
          const statRevision = await statRevisionOf(persistence, wanted.sessionId)
          if (statRevision === undefined) {
            const fresh = stateCache.get(wanted.sessionId, entry => entry.persistence === identity)
            if (fresh !== undefined && Date.now() - fresh.checkedAt < COLD_FRESH_MS) {
              return reply({ ok: true, value: pageValue(fresh.state, false, wanted, fresh) })
            }
          } else {
            const hit = stateCache.get(wanted.sessionId, entry => entry.persistence === identity && entry.statRevision === statRevision)
            if (hit !== undefined) {
              hit.checkedAt = Date.now()
              return reply({ ok: true, value: pageValue(hit.state, false, wanted, hit) })
            }
          }
          const value = await coldReads.admit(async () => {
            const durable = await readDurableEvents(persistence, wanted.sessionId)
            let events: SessionEvent[]
            let revision: string
            if (durable !== null) {
              events = durable
              revision = statRevision ?? coldCursorOf(durable)
            } else {
              if (observe === undefined) return null
              const observation = await observe(wanted.sessionId, { projectionMode: 'none' })
              const release = leaseOf(observation)
              try {
                const observed = asRecord(observation)?.events
                if (!Array.isArray(observed)) return null
                events = observed as SessionEvent[]
                revision = statRevision ?? revisionOf(observation) ?? coldCursorOf(events)
              } finally {
                release()
              }
            }
            const cached = stateCache.get(wanted.sessionId, entry => entry.persistence === identity
              && (statRevision === undefined ? entry.revision === revision : entry.statRevision === statRevision))
            if (cached !== undefined) {
              cached.checkedAt = Date.now()
              return pageValue(cached.state, false, wanted, cached)
            }
            const state = compactHistoryState((await foldLog(events, historyBounds(bounds))).state)
            const entry: ColdState = {
              persistence: identity,
              revision,
              ...(statRevision === undefined ? {} : { statRevision }),
              state,
              checkedAt: Date.now(),
            }
            stateCache.set(wanted.sessionId, entry)
            return pageValue(state, false, wanted, entry)
          })
          return reply({ ok: true, value: value ?? null })
        } catch (err) {
          return failure('gateway/internal', err instanceof Error ? err.message : String(err))
```

</details>

**依据 3 · 源码核查**：[src/client/historyPaging.ts:25-56](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/client/historyPaging.ts#L25-L56)

页rev/cancel及游标停滞边界。

<details>
<summary>查看原文（32行）</summary>

```text
export async function readHistoryPage(
  history: HistoryFetcher,
  part: HistoryPart,
  cursor: HistoryCursor | undefined,
  limit: number,
  options: HistoryPagingOptions,
): Promise<HistoryPage | typeof CANCELLED | null> {
  if (options.cancelled()) return CANCELLED
  const page = await history(part, cursor, limit)
  if (options.cancelled()) return CANCELLED
  return page === null || page.rev !== options.rev ? null : page
}

export async function loadAllHistory<T extends HistoryRow>(
  history: HistoryFetcher,
  part: HistoryPart,
  options: HistoryPagingOptions,
): Promise<HistoryRows<T>> {
  let cursor: HistoryCursor | undefined
  const collected: T[][] = []
  for (let pages = 0; ; pages++) {
    /* v8 ignore next 1 */
    if (pages >= HISTORY_PAGES_MAX) return null
    const page = await readHistoryPage(history, part, cursor, HISTORY_PAGE_MAX, options)
    if (page === CANCELLED || page === null) return page
    collected.push(page.rows as T[])
    const next = nextHistoryCursor(page)
    if (next === undefined || page.rows.length === 0) break
    if (next.beforeSeq === cursor?.beforeSeq && next.beforeIndex === cursor?.beforeIndex) return null
    cursor = next
  }
  return pagesOldestFirst(collected)
```

</details>

**依据 4 · 源码核查**：[src/client/historyPaging.ts:87-126](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/client/historyPaging.ts#L87-L126)

seq/ord去重和尾部合并。

<details>
<summary>查看原文（40行）</summary>

```text
export function mergeHistoryRows<T extends HistorySeqRow>(old: T[], add: T[]): T[] {
  if (add.length === 0) return old
  const last = old.at(-1)
  if (last === undefined || compareRows(add[0], last) > 0) return [...old, ...add]
  const start = overlapStart(old, add[0])
  const region = new Map<string, T>()
  for (const row of old.slice(start)) region.set(historyRowKey(row), row)
  for (const row of add) region.set(historyRowKey(row), row)
  return [...old.slice(0, start), ...[...region.values()].sort(compareRows)]
}

export async function loadTailHistory<T extends HistorySeqRow>(
  history: HistoryFetcher,
  part: HistoryPart,
  old: T[],
  options: HistoryPagingOptions,
): Promise<HistoryRows<T>> {
  const collected: T[][] = []
  let unseen = 0
  let cursor: number | undefined
  for (let pages = 0; ; pages++) {
    /* v8 ignore next 1 */
    if (pages >= HISTORY_PAGES_MAX) return null
    const page = await readHistoryPage(
      history,
      part,
      cursor === undefined ? undefined : { beforeSeq: cursor },
      HISTORY_PAGE_MAX,
      options,
    )
    if (page === CANCELLED || page === null) return page
    const rows = page.rows as unknown as T[]
    collected.push(rows)
    unseen += Math.max(0, page.first + rows.length - Math.max(page.first, old.length))
    if (unseen >= Math.max(0, page.total - old.length)
      || page.atStart || page.beforeSeq === undefined || rows.length === 0) break
    if (page.beforeSeq === cursor) return null
    cursor = page.beforeSeq
  }
  return mergeHistoryRows(old, pagesOldestFirst(collected))
```

</details>

**依据 5 · 源码核查**：[src/client/detailStore.ts:509-518](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/client/detailStore.ts#L509-L518)

同part新window只清partRev并请求刷新。

<details>
<summary>查看原文（10行）</summary>

```text
  readonly ensurePart = (part: FactPart, window: FactWindow = {}): void => {
    if (this.facts === undefined || this.factsUnavailable) return
    const prev = this.wantedParts.get(part)
    const same = prev !== undefined && sameWindow(prev, window)
    if (same && this.partRev.get(part) === this.acceptedRev) return
    this.wantedParts.set(part, window)
    if (prev !== undefined && !same) this.partRev.delete(part)
    this.ensureCollectionsFor(part)
    this.fetchWantedParts()
  }
```

</details>

**依据 6 · 源码核查**：[src/client/detailStore.ts:693-699](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/client/detailStore.ts#L693-L699)

inflight与已接受rev抑制重取。

```text
  private fetchWantedParts(): void {
    const facts = this.facts
    if (facts === undefined || this.detail === null || this.acceptedRev < 0 || this.factsUnavailable) return
    for (const [part, window] of this.wantedParts) {
      if (this.unavailableParts.has(part) || this.inflightParts.has(part) || this.partRev.get(part) === this.acceptedRev) continue
      void this.fetchPart(facts, part, window)
    }
```

**依据 7 · 源码核查**：[src/client/detailStore.ts:740-791](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/client/detailStore.ts#L740-L791)

响应检查generation/rev但未核对当前window。

<details>
<summary>查看原文（52行）</summary>

```text
  private async fetchPart(facts: FactsFetchers, part: FactPart, window: FactWindow): Promise<void> {
    if (this.isPartComplete(part)) {
      this.partRev.set(part, this.acceptedRev)
      return
    }
    const generation = this.generation
    const rev = this.acceptedRev
    this.inflightParts.add(part)
    this.emit()
    try {
      const read = await facts.part(part, window)
      if (generation !== this.generation || this.acceptedRev !== rev) return
      if (this.isPartComplete(part)) {
        this.partRev.set(part, this.acceptedRev)
        return
      }
      if (read === null) {
        this.schedulePartRetry(part)
        return
      }
      if (!('parts' in read)) {
        this.unavailableParts.add(part)
        this.dropPart(part)
        return
      }
      if (read.rev !== rev) {
        this.wantedRev = Math.max(this.wantedRev, read.rev)
        this.schedule()
        return
      }
      if (read.missing?.includes(part) === true) {
        this.unavailableParts.add(part)
        this.dropPart(part)
        return
      }
      if (read.parts[part] === undefined) {
        this.unavailableParts.add(part)
        this.dropPart(part)
        return
      }
      const merged = this.withHistory(mergeFactsInto(this.detail as ContextTimelineDetail, read))
      this.detail = merged
      this.bytes = detailBytesOf(merged)
      this.partRev.set(part, rev)
      this.clearPartRetry(part)
      this.onResize?.()
    } catch {
      if (generation === this.generation && this.acceptedRev === rev) this.schedulePartRetry(part)
    } finally {
      this.inflightParts.delete(part)
      if (generation === this.generation && this.acceptedRev !== rev) this.fetchWantedParts()
      this.emit()
```

</details>

#### 缺口

- 同revision快速切窗的实际显示后果未复现；完整collection可能绕开。
  **影响**：不能把所有视图称为错位，也不能宣称风险已修复。
  **进一步探讨**：在未完整collection下延迟旧window响应，切新window，核对响应身份、partRev及最终渲染。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 跨会话物化缓存、项目统计与估价可以支持什么判断？

**研究主题**：效果与总成本、工程质量与复用、依赖、兼容与流程

#### 完整回答

overview将已物化会话记录保存到分片文件；写入时先读分片并按保留集合/新记录合并，再通过writeFileAtomic发布，格式无效或读取失败得到空映射，写失败返回false。刷新durable identity用路径、大小和mtime识别变化，并以有界并发执行。这是降低重复回放和单次持有资源的工程安排，不能从源码推出真实内存下降或全盘缓存永久正确；未变大小/时间戳等特殊来源行为仍取决于持久化契约。

汇总将日期谓词传入活动用量，分别保留costSessions、usageSessions、coverage，并用CostSource求costUsd。项目统计按group聚合范围内每日tokens，返回有用量项目；显示名或项目归属不等于跨项目权限隔离。时间指标同时有timingSum和windowTiming，用户不能假定同一面板所有值都严格只覆盖选中日期。费用是模型目录映射后的估算，不知道真实合同、折扣或结算口径，所以适合选出需要复核的会话，不适合代替账单。

新增分片缓存、持久化和后台回填带来磁盘、读取与维护负担。没有同条件负载、价格、峰值内存和人工诊断时间，本研究不报告节时比例或单位诊断成本。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/overviewCache.ts:258-299](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/host/overviewCache.ts#L258-L299)

分片读取、merge、原子文件写与错误返回。

<details>
<summary>查看原文（42行）</summary>

```text
  const readShard = async (shard: number): Promise<Map<string, CanonicalRecord>> => {
    const records = new Map<string, CanonicalRecord>()
    try {
      const data = asRecord(JSON.parse(await fs.readFile(shardPath(path, shard))))
      if (data === null || data.format !== OVERVIEW_CACHE_FORMAT || !Array.isArray(data.sessions)) return records
      for (const entry of data.sessions) {
        const record = recordOf(entry)
        if (record !== undefined) records.set(record.materialization.facts.id, record)
      }
    } catch {}
    return records
  }

  const writeShard = async (batch: Batch, shard: number): Promise<boolean> => {
    const target = shardPath(path, shard)
    const temp = `${target}.tmp`
    try {
      const merged = await readShard(shard)
      let changed = false
      if (batch.retain !== null) {
        for (const id of merged.keys()) {
          if (batch.retain.has(id)) continue
          merged.delete(id)
          changed = true
        }
      }
      for (const descriptor of batch.records.values()) {
        if (descriptor.shard !== shard || prunedBy(batch, descriptor)) continue
        const incoming = JSON.parse(descriptor.json) as CanonicalRecord
        merged.set(descriptor.id, incoming)
        changed = true
      }
      if (!changed) return true
      const body = JSON.stringify({ format: OVERVIEW_CACHE_FORMAT, savedAt: now(), sessions: [...merged.values()] })
      await writeFileAtomic(fs, target, body)
      return true
    } catch {
      try {
        await fs.rm?.(temp)
      } catch {}
      return false
    }
```

</details>

**依据 2 · 源码核查**：[src/host/overviewCache.ts:500-525](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/host/overviewCache.ts#L500-L525)

durable identity按文件大小及mtime刷新。

<details>
<summary>查看原文（26行）</summary>

```text
    currentIds: ReadonlySet<string>,
    known: ReadonlyMap<string, DurableIdentity | null>,
  ): Promise<OverviewCacheRefresh> => {
    const identities = new Map<string, DurableIdentity | null>()
    const changed = new Set<string>()
    const targets: { id: string; identity: DurableIdentity }[] = []
    for (const id of currentIds) {
      const identity = known.get(id)
      if (identity === null || identity === undefined) continue
      targets.push({ id, identity })
    }
    await inBatches(targets, statConcurrency, async ({ id, identity }) => {
      try {
        const info = await fs.stat(identity.path)
        if (info.size === identity.sizeBytes && info.mtimeMs === identity.mtimeMs) {
          identities.set(id, identity)
          return
        }
        identities.set(id, { path: identity.path, sizeBytes: info.size, mtimeMs: info.mtimeMs })
        changed.add(id)
      } catch {
        identities.set(id, null)
        changed.add(id)
      }
    })
    return { identities, changed }
```

</details>

**依据 3 · 源码核查**：[src/host/overviewAggregate.ts:262-307](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/host/overviewAggregate.ts#L262-L307)

用量/费用覆盖与两类timing字段。

<details>
<summary>查看原文（46行）</summary>

```text
  coverage: BackfillCoverage,
): OverviewSummary {
  const admit = dayPredicate(filters)
  const tokenParts = partsOf(rows, admit)
  let usage: SessionCostUsage | null = null
  let tokens = 0
  let turns = 0
  const windowTiming = { calls: 0, toolCalls: 0, toolsMs: 0, wallMs: 0 }
  let costSessions = 0
  let usageSessions = 0
  let sessionsArchived = 0
  for (const row of rows) {
    const totals = activityTotalsOf(row.activity, admit)
    usage = mergeCostUsage(usage, totals.usage)
    tokens += totals.tokens
    turns += totals.turns
    windowTiming.calls += totals.calls
    windowTiming.toolCalls += totals.toolCalls
    windowTiming.toolsMs += totals.toolsMs
    windowTiming.wallMs += totals.wallMs
    if (cost.complete(totals.usage)) costSessions++
    if (totals.usage !== null) usageSessions++
    if (row.archived) sessionsArchived++
  }
  const usageTotals = usage === null ? null : usageTotalsOf(usage)
  return {
    sessions: rows.length,
    sessionsTotal: allRows.length,
    sessionsArchived,
    archivedScoped: sessionsArchived,
    tokens,
    turns,
    costUsd: cost.usd(usage),
    costSessions,
    usageSessions,
    cacheHit: cacheHitOf(usageTotals),
    tokenParts,
    timing: timingSumOf(rows),
    windowTiming,
    window: {
      start: filters.window.start,
      end: filters.window.end,
      from: dayKeyOf(filters.window.start),
      to: dayKeyOf(filters.window.end ?? Date.now()),
    },
    coverage,
```

</details>

**依据 4 · 源码核查**：[src/host/overviewAggregate.ts:403-423](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/host/overviewAggregate.ts#L403-L423)

项目group和日期tokens聚合。

<details>
<summary>查看原文（21行）</summary>

```text
export function projectStatsOf(rows: readonly HostRow[], filters: Filters): OverviewProjectStat[] {
  const admit = dayPredicate(filters)
  const stats = new Map<string, OverviewProjectStat>()
  for (const row of rows) {
    const key = row.group ?? UNGROUPED_KEY
    const days = row.activity?.days
    let tokens = 0
    if (days !== undefined) {
      for (const day of Object.keys(days)) {
        if (admit(day)) tokens += days[day].tokens
      }
    }
    const prev = stats.get(key)
    if (prev === undefined) stats.set(key, { key, tokens, sessions: 1 })
    else {
      prev.tokens += tokens
      prev.sessions += 1
    }
  }
  return [...stats.values()].filter(stat => stat.tokens > 0).sort((left, right) => (right.tokens - left.tokens)
    || left.key.localeCompare(right.key))
```

</details>

**依据 5 · 作者声明**：[README.md:70-78](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/README.md#L70-L78)

作者解释KPI时间归属与项目视图。

```text
| **KPI 栏** | 我的使用量如何——所选时间范围（今天 / 7 天 / 30 天）内活跃的会话，其计费 Token、预估成本、缓存命中率和轮次按 step 发起日归因；工具执行与活跃时长则统计这些会话及其子 Agent 的全部生命周期，与耗时统计卡片一致。 |
| **7 天使用量图表** | 每天的花费和用量如何——最近 7 天每天的计费 Token 和预估成本以成对柱状图展示，按会话自身各请求的时间汇总（而不是按会话最后活跃日期）。 |
| **活动热力图** | 我实际在什么时候工作——最近 8 周每日的计费 Token；点击某天即可筛选当天活跃的会话，并让三个统计卡片只看当天。 |
| **技能加载** | 加载了哪些技能、各多少次、最近何时——所选时间范围内按技能汇总的加载次数；点击可筛选加载过它的会话。 |
| **工具调用** | 运行了哪些工具、各多少次、最近何时——按日账本汇总的工具执行次数；点击可筛选运行过它的会话。 |
| **命令执行** | 运行了哪些程序、各多少次、最近何时——按程序汇总的命令执行次数（按派发计）；点击可筛选执行过它的会话。 |
| **设置入口** | 页面标题栏中的按钮——与 Context 标签页 Plugin Info 卡片中通往此插件偏好设置的受保护跳转相同。 |
| **Context Composition** | 所选时间范围内的计费 Token 用在了哪里，按 Token 卡片的计费分类（Tool Calls、Reasoning、Answers……）拆分。 |
| **会话卡片** | 四个卡片下方每个会话的概况：组成环形图、计费 Token、轮次、成本以及工作区分组 / 项目路径；可按最近活动、Token 数或上下文大小排序、搜索、按工作区分组。点击卡片即可打开会话。 |
```

#### 缺口

- 未取得相同会话负载下的缓存内存/IO与诊断时间测量。
  **影响**：无法确认新增缓存的资源收益或异常下完整性。
  **进一步探讨**：对已知长会话测冷/热读取、缺失日志和写失败，另与真实账单核对估价覆盖。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · Agent标签、主动提示词与会话访问有哪些边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

Agent注入标签只处理指定source.kind，可能从reference.label、正文固定模式或当前alias提取展示名称；512项alias上限与名称裁剪限定展示能力。标签因此是诊断线索，不能单凭文本名称判断可信身份或把异常归责给某个Agent。应保留sender/session和原始事件作为复核入口，而不是把界面别名当强认证。

会话历史route经connection注册为POST，再以body.sessionId查sessions或persistence。该插件代码未在此处理租户身份；访问控制的安全边界依赖宿主connection与部署，不能从“POST”和no-store推出跨用户隔离。在共享部署未核权限前，本研究建议只在个人隔离profile试用。

插件除读取诊断外还支持修改系统提示。prefix/suffix默认空串，systemPrompt API可用时才注册前后section，读配置活值，interpolate=false。空配置便于只评估诊断；若同时开启主动提示修改，模型行为变化不应直接归因于视图。失败或退出时应回看实际提示、撤回配置并禁用相应行。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/foldInjections.ts:33-96](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/host/foldInjections.ts#L33-L96)

source种类、正文模式、别名的展示归因。

<details>
<summary>查看原文（64行）</summary>

```text
const AGENT_ALIASES_MAX = 512
const AGENT_SOURCE_KINDS: ReadonlySet<string> = new Set(['agent-message', 'subagent-settled', 'team-message', 'session-reference'])
const RELAY_AGENT = /^Agent (\S+) sent a message:/
const SETTLED_AGENT = /^Background subagent (\S+)/

export function agentNameOf(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (trimmed === '') return undefined
  return trimmed.length > TALLY_NAME_CHARS_MAX ? trimmed.slice(0, TALLY_NAME_CHARS_MAX - 1) + '…' : trimmed
}

function textAgentOf(kind: string, content: unknown, summary: string | undefined): string | undefined {
  if (kind === 'subagent-settled') {
    const text = firstFullText(content)
    const match = SETTLED_AGENT.exec(text) ?? (summary === undefined ? null : SETTLED_AGENT.exec(summary))
    return match?.[1]
  }
  return kind === 'agent-message' ? RELAY_AGENT.exec(firstFullText(content))?.[1] : undefined
}

function referenceAgentOf(source: MessageSource): string | undefined {
  const references = Array.isArray(source.references) ? source.references : []
  const labels: string[] = []
  for (const reference of references) {
    const label = agentNameOf(reference?.label)
    if (label === undefined) continue
    if (typeof reference?.sessionId === 'string' && reference.sessionId === reference.label) continue
    labels.push(label)
  }
  if (labels.length === 0) return undefined
  return labels.length === 1 ? labels[0] : labels[0] + ' +' + String(labels.length - 1)
}

function senderIdOf(source: MessageSource): string | undefined {
  if (typeof source.senderSessionId === 'string' && source.senderSessionId !== '') return source.senderSessionId
  if (typeof source.senderId === 'string' && source.senderId !== '') return source.senderId
  return undefined
}

function agentAliasOf(state: TimelineState, id: string | undefined): AgentAlias | undefined {
  if (id === undefined) return undefined
  const agents = state.agents
  return agents !== undefined && Object.hasOwn(agents, id) ? agents[id] : undefined
}

export function agentOfInjection(source: MessageSource | null | undefined, content: unknown, state: TimelineState): string | undefined {
  if (source === undefined || source === null) return undefined
  const kind = typeof source.kind === 'string' ? source.kind : ''
  if (!AGENT_SOURCE_KINDS.has(kind)) return undefined
  if (kind === 'session-reference') return referenceAgentOf(source)
  const senderId = senderIdOf(source)
  const token = textAgentOf(kind, content, source.summary)
  if (token !== undefined && token !== senderId) return agentNameOf(token)
  const alias = agentAliasOf(state, senderId)
  const aliasName = agentNameOf(alias?.catalogName)
  if (aliasName !== undefined) return aliasName
  if (kind === 'team-message') {
    const sender = agentNameOf(source.senderName)
    if (sender !== undefined && sender !== senderId) return sender
  }
  const member = agentNameOf(alias?.memberName)
  if (member !== undefined) return member
  return agentNameOf(alias?.catalogLabel)
```

</details>

**依据 2 · 源码核查**：[src/host/connection.ts:22-36](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/host/connection.ts#L22-L36)

通过宿主connection注册POST route，没有本地用户鉴权证明。

<details>
<summary>查看原文（15行）</summary>

```text
export function registerPostRoute(
  c: EffectScope,
  connection: ConnectionHostFace | undefined,
  path: string,
  fetch: (request: Request) => Response | Promise<Response>,
  label: string,
): boolean {
  const register = fetchRouteRegistrar(connection)
  if (register === undefined) return false
  try {
    c.effect(() => register({ path, methods: ['POST'], requestBody: 'buffered', fetch }), label)
  } catch {
    return false
  }
  return true
```

</details>

**依据 3 · 源码核查**：[src/host/history.ts:257-274](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/host/history.ts#L257-L274)

sessionId来自请求并选取会话/持久化。

<details>
<summary>查看原文（18行）</summary>

```text
      const getSession = ((): ((id: string) => unknown) | undefined => {
        const sessions = c.get('sessions') as SessionsFace | undefined
        return typeof sessions?.get === 'function' ? sessions.get.bind(sessions) : undefined
      })()
      const observe = observeOf(c)
      return async (request: Request): Promise<Response> => {
        stateCache.touch()
        const read = await readBody(request)
        if (!read.ok) return read.response
        const wanted = requestOf(read.body)
        if (wanted === null) return failure('dsh-context/bad-request', 'invalid history request')
        try {
          const session = getSession?.(wanted.sessionId)
          if (session !== undefined && session !== null) {
            const state = await live(wanted.sessionId)
            if (state !== null) return reply({ ok: true, value: pageValue(state, true, wanted) })
          }
          const persistence = c.get('sessionPersistence') as PersistenceLike | undefined
```

</details>

**依据 4 · 源码核查**：[src/host/promptInjection.ts:35-52](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/host/promptInjection.ts#L35-L52)

提示section、活值和不插值设置。

<details>
<summary>查看原文（18行）</summary>

```text
export function watchPromptInjection(ctx: Context, config: Config): void {
  ctx.inject(['systemPrompt'] as never, (inner: Context) => {
    const systemPrompt = (inner as { systemPrompt?: SystemPromptFace | null }).systemPrompt
    if (systemPrompt === null || systemPrompt === undefined
      || typeof systemPrompt.section !== 'function'
      || typeof systemPrompt.getSectionOrder !== 'function') return
    systemPrompt.section({
      name: 'dsh-context:prompt-prefix',
      order: systemPrompt.getSectionOrder('HARNESS_IDENTITY') - ORDER_CLEARANCE,
      text: sectionText(liveText(config.promptPrefix)),
      interpolate: false,
    })
    systemPrompt.section({
      name: 'dsh-context:prompt-suffix',
      order: systemPrompt.getSectionOrder('DEPLOYMENT_PERSONA_SUFFIX') + ORDER_CLEARANCE,
      text: sectionText(liveText(config.promptSuffix)),
      interpolate: false,
    })
```

</details>

**依据 5 · 源码核查**：[src/host/config.ts:67-68](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/host/config.ts#L67-L68)

前后缀默认空。

```text
  promptPrefix: volatileField(z.string().default('').loose()),
  promptSuffix: volatileField(z.string().default('').loose()),
```

#### 缺口

- 宿主connection在共享部署的用户隔离未独立核实。
  **影响**：不建议直接把历史正文和文件诊断开放给多人。
  **进一步探讨**：按实际部署进行两个不同用户的会话授权边界核查。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些操作和恢复负担支持小范围试用？

**研究主题**：采用判断、效果与总成本

#### 完整回答

对需要追查长工具返回或Agent注入的个人开发者，先准备一个非敏感已知会话，在兼容Web profile加载插件，保持promptPrefix/promptSuffix为空。确认原生压力、选中步骤和事件明细能对齐，再尝试完整历史与overview；合格结果要给出源事件和不能确认的缺口，不以图形更丰富或费用更低作为完成判据。

首次负担是宿主版本、Web注入和配置核对；持续负担是历史回填、缓存和人工解释；失败恢复包括窗口身份、缺失历史及旧估价复查。现金、CPU/磁盘/内存与人工时间都没有本轮量化，不记为0。原生压力和原日志是可行退路，禁用插件后仍应核查已配置的提示是否退出。

出现同一步号内容错位、空明细被当成无事件、不同用户可见不属于自己的会话，或估价被当账单时，应停止该用途并回到原始资料。源码足以支持隔离诊断试用，但不支持安装后即可持续可靠归因或节省成本的承诺。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.ts:42-81](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/host/index.ts#L42-L81)

依赖和版本降级路径。

<details>
<summary>查看原文（40行）</summary>

```text
export const inject = ['sessionProjections']

export { Config } from './config'
export function apply(ctx: Context, config: Config): void {
  const coldReads = makeColdReadGate()
  const catalog = createCatalogService()
  const pricing = createCostSource(catalog)
  const harnessVersion = detectHarnessVersion(ctx)
  ctx.effect(() => () => { catalog.dispose() }, 'dsh-context: catalog cache')
  watchVersionChannel(ctx, catalog)
  watchBalanceChannel(ctx, harnessVersion ?? '0.0.0')
  watchRecomChannel(ctx)
  watchSkillCatalog(ctx)
  watchFleetChannel(ctx, coldReads)
  watchAttachmentChannel(ctx, coldReads)
  if (harnessVersion !== undefined && !meetsBaseline(harnessVersion)) {
    ctx.sessionProjections.register(createFallbackTimelineDefinition(harnessVersion) as never)
    ctx.sessionProjections.register(createFallbackHeadersDefinition() as never)
    ctx.sessionProjections.register(createFallbackActivityDefinition() as never)
    return
  }
  const attribution = createToolAttribution(ctx, harnessVersion)
  watchStepIdentity(ctx)
  const gate = createDetailGate(ctx)
  const bounds = resolveBounds(config)
  const shadow = new DetailShadow(ctx, historyBounds(bounds), coldReads, () => observeOf(ctx))
  watchDetailChannel(ctx, bounds, coldReads, gate, shadow, pricing)
  const deltaGate: DetailChannelGate = { ...gate, live: false }
  const ownerOf = attribution.ownerOf.bind(attribution)
  const coldStates = createColdTimelineStates(ctx, bounds, { coldReads, resolve: ownerOf })
  watchDeltaChannel(ctx, bounds, coldReads, deltaGate, shadow, ownerOf, coldStates)
  const detailStateOf = (id: string): Promise<TimelineState | null> => shadow.stateOf(id)
  watchFactsChannel(ctx, bounds, { gates: gate, coldStates, detailState: detailStateOf, cost: pricing })
  watchHistoryChannel(ctx, bounds, { coldReads, detailState: detailStateOf })
  watchCommandPageChannel(ctx, resolveBounds(config), coldReads)
  const cache = createOverviewCache({ config })
  watchHeadsChannel(ctx, { bounds, coldReads, cost: pricing, cache })
  gate.retain('contextTimeline', ctx.sessionProjections.register(createContextTimelineDefinition(config, () => gate.live, pricing)))
  ctx.sessionProjections.register(createContextHeadersDefinition(name => attribution.ownerOf(name)))
  ctx.sessionProjections.register(createContextActivityDefinition())
```

</details>

**依据 2 · 源码核查**：[src/client/detailStore.ts:740-791](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/client/detailStore.ts#L740-L791)

分片响应边界影响步骤核对。

<details>
<summary>查看原文（52行）</summary>

```text
  private async fetchPart(facts: FactsFetchers, part: FactPart, window: FactWindow): Promise<void> {
    if (this.isPartComplete(part)) {
      this.partRev.set(part, this.acceptedRev)
      return
    }
    const generation = this.generation
    const rev = this.acceptedRev
    this.inflightParts.add(part)
    this.emit()
    try {
      const read = await facts.part(part, window)
      if (generation !== this.generation || this.acceptedRev !== rev) return
      if (this.isPartComplete(part)) {
        this.partRev.set(part, this.acceptedRev)
        return
      }
      if (read === null) {
        this.schedulePartRetry(part)
        return
      }
      if (!('parts' in read)) {
        this.unavailableParts.add(part)
        this.dropPart(part)
        return
      }
      if (read.rev !== rev) {
        this.wantedRev = Math.max(this.wantedRev, read.rev)
        this.schedule()
        return
      }
      if (read.missing?.includes(part) === true) {
        this.unavailableParts.add(part)
        this.dropPart(part)
        return
      }
      if (read.parts[part] === undefined) {
        this.unavailableParts.add(part)
        this.dropPart(part)
        return
      }
      const merged = this.withHistory(mergeFactsInto(this.detail as ContextTimelineDetail, read))
      this.detail = merged
      this.bytes = detailBytesOf(merged)
      this.partRev.set(part, rev)
      this.clearPartRetry(part)
      this.onResize?.()
    } catch {
      if (generation === this.generation && this.acceptedRev === rev) this.schedulePartRetry(part)
    } finally {
      this.inflightParts.delete(part)
      if (generation === this.generation && this.acceptedRev !== rev) this.fetchWantedParts()
      this.emit()
```

</details>

**依据 3 · 源码核查**：[src/host/promptInjection.ts:35-52](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/host/promptInjection.ts#L35-L52)

主动提示配置属于独立变量。

<details>
<summary>查看原文（18行）</summary>

```text
export function watchPromptInjection(ctx: Context, config: Config): void {
  ctx.inject(['systemPrompt'] as never, (inner: Context) => {
    const systemPrompt = (inner as { systemPrompt?: SystemPromptFace | null }).systemPrompt
    if (systemPrompt === null || systemPrompt === undefined
      || typeof systemPrompt.section !== 'function'
      || typeof systemPrompt.getSectionOrder !== 'function') return
    systemPrompt.section({
      name: 'dsh-context:prompt-prefix',
      order: systemPrompt.getSectionOrder('HARNESS_IDENTITY') - ORDER_CLEARANCE,
      text: sectionText(liveText(config.promptPrefix)),
      interpolate: false,
    })
    systemPrompt.section({
      name: 'dsh-context:prompt-suffix',
      order: systemPrompt.getSectionOrder('DEPLOYMENT_PERSONA_SUFFIX') + ORDER_CLEARANCE,
      text: sectionText(liveText(config.promptSuffix)),
      interpolate: false,
    })
```

</details>

**依据 4 · 源码核查**：[src/host/overviewAggregate.ts:282-307](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/host/overviewAggregate.ts#L282-L307)

估价、覆盖与时间窗口需分读。

<details>
<summary>查看原文（26行）</summary>

```text
    if (cost.complete(totals.usage)) costSessions++
    if (totals.usage !== null) usageSessions++
    if (row.archived) sessionsArchived++
  }
  const usageTotals = usage === null ? null : usageTotalsOf(usage)
  return {
    sessions: rows.length,
    sessionsTotal: allRows.length,
    sessionsArchived,
    archivedScoped: sessionsArchived,
    tokens,
    turns,
    costUsd: cost.usd(usage),
    costSessions,
    usageSessions,
    cacheHit: cacheHitOf(usageTotals),
    tokenParts,
    timing: timingSumOf(rows),
    windowTiming,
    window: {
      start: filters.window.start,
      end: filters.window.end,
      from: dayKeyOf(filters.window.start),
      to: dayKeyOf(filters.window.end ?? Date.now()),
    },
    coverage,
```

</details>

#### 缺口

- 真实诊断合格率和恢复时间没有结果。
  **影响**：试用结论不能提升为持续安装推荐。
  **进一步探讨**：用预设源事件的会话对比原生日志流程，计入错误定位和重新加载的全部时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 窗口身份与覆盖说明能否改善可信诊断，如何证伪？

**研究主题**：新假设与验证

#### 完整回答

可从分页rev校验和分片窗口缺口推导未验证假设：把会话、revision、part和window一起作为请求/响应的验收身份，并在页面标明历史覆盖，可能比仅以revision判定命中减少错误归因。它扩展的是片段接收条件，不是增加更多图表；需要维护兼容旧facts和完整collection两条路径，其复杂性应以正确定位收益来判断。

最小对照使用巨大工具返回、Agent注入、缺失历史和同revision快速切窗四类已知源事件，保持模型、宿主、主动提示配置和会话内容相同，比较现状与完整身份/覆盖方案。记录正确源事件定位比例、错误确定结论、冷/热读取资源与从告警到人工核对完成的总时间，失败和重开都计入。若错误只被隐藏、正确定位没有增加，或总时间/资源开销抵消收益，就不支持推广。实验尚未执行，不能把该设计计入本插件已有创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/historyPaging.ts:25-56](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/client/historyPaging.ts#L25-L56)

已有page.rev/cancel可作可迁移的校验基线。

<details>
<summary>查看原文（32行）</summary>

```text
export async function readHistoryPage(
  history: HistoryFetcher,
  part: HistoryPart,
  cursor: HistoryCursor | undefined,
  limit: number,
  options: HistoryPagingOptions,
): Promise<HistoryPage | typeof CANCELLED | null> {
  if (options.cancelled()) return CANCELLED
  const page = await history(part, cursor, limit)
  if (options.cancelled()) return CANCELLED
  return page === null || page.rev !== options.rev ? null : page
}

export async function loadAllHistory<T extends HistoryRow>(
  history: HistoryFetcher,
  part: HistoryPart,
  options: HistoryPagingOptions,
): Promise<HistoryRows<T>> {
  let cursor: HistoryCursor | undefined
  const collected: T[][] = []
  for (let pages = 0; ; pages++) {
    /* v8 ignore next 1 */
    if (pages >= HISTORY_PAGES_MAX) return null
    const page = await readHistoryPage(history, part, cursor, HISTORY_PAGE_MAX, options)
    if (page === CANCELLED || page === null) return page
    collected.push(page.rows as T[])
    const next = nextHistoryCursor(page)
    if (next === undefined || page.rows.length === 0) break
    if (next.beforeSeq === cursor?.beforeSeq && next.beforeIndex === cursor?.beforeIndex) return null
    cursor = next
  }
  return pagesOldestFirst(collected)
```

</details>

**依据 2 · 源码核查**：[src/client/detailStore.ts:509-518](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/client/detailStore.ts#L509-L518)

window变化与当前命中关系。

<details>
<summary>查看原文（10行）</summary>

```text
  readonly ensurePart = (part: FactPart, window: FactWindow = {}): void => {
    if (this.facts === undefined || this.factsUnavailable) return
    const prev = this.wantedParts.get(part)
    const same = prev !== undefined && sameWindow(prev, window)
    if (same && this.partRev.get(part) === this.acceptedRev) return
    this.wantedParts.set(part, window)
    if (prev !== undefined && !same) this.partRev.delete(part)
    this.ensureCollectionsFor(part)
    this.fetchWantedParts()
  }
```

</details>

**依据 3 · 源码核查**：[src/client/detailStore.ts:740-791](https://github.com/bowenliang123/dsh-context/blob/fa98a621e7aabdebdb04fc935221a4ba5bf72883/src/client/detailStore.ts#L740-L791)

片段响应只核generation/rev，提供假设依据。

<details>
<summary>查看原文（52行）</summary>

```text
  private async fetchPart(facts: FactsFetchers, part: FactPart, window: FactWindow): Promise<void> {
    if (this.isPartComplete(part)) {
      this.partRev.set(part, this.acceptedRev)
      return
    }
    const generation = this.generation
    const rev = this.acceptedRev
    this.inflightParts.add(part)
    this.emit()
    try {
      const read = await facts.part(part, window)
      if (generation !== this.generation || this.acceptedRev !== rev) return
      if (this.isPartComplete(part)) {
        this.partRev.set(part, this.acceptedRev)
        return
      }
      if (read === null) {
        this.schedulePartRetry(part)
        return
      }
      if (!('parts' in read)) {
        this.unavailableParts.add(part)
        this.dropPart(part)
        return
      }
      if (read.rev !== rev) {
        this.wantedRev = Math.max(this.wantedRev, read.rev)
        this.schedule()
        return
      }
      if (read.missing?.includes(part) === true) {
        this.unavailableParts.add(part)
        this.dropPart(part)
        return
      }
      if (read.parts[part] === undefined) {
        this.unavailableParts.add(part)
        this.dropPart(part)
        return
      }
      const merged = this.withHistory(mergeFactsInto(this.detail as ContextTimelineDetail, read))
      this.detail = merged
      this.bytes = detailBytesOf(merged)
      this.partRev.set(part, rev)
      this.clearPartRetry(part)
      this.onResize?.()
    } catch {
      if (generation === this.generation && this.acceptedRev === rev) this.schedulePartRetry(part)
    } finally {
      this.inflightParts.delete(part)
      if (generation === this.generation && this.acceptedRev !== rev) this.fetchWantedParts()
      this.emit()
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
