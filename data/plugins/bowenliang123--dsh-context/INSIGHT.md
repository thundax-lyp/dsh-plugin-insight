# DSH Context

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[9e22119](https://github.com/bowenliang123/dsh-context/tree/9e221195ac7c02cff9a21311dda6d61f50cf50d3)

<!-- BEGIN META -->
[![GitHub ★ 5,162](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C162&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bowenliang123/dsh-context) [![npm 30d 519,030](https://img.shields.io/static/v1?label=npm+30d&message=519%2C030&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-context) [![最新发布 2026-11-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-context)
<!-- END META -->

> **功能**：查看 DeepSeek Harness 会话的上下文组成、演变、事件和跨会话使用概况。

> **亮点**：把宿主现有的压力数字与可追查的历史请求、上下文分项和注入来源连接起来。来源标签和历史步骤要回原事件核对。[Q01](#research-q01) [Q03](#research-q03)

> **主要限制**：上下文浏览依赖历史观察与当前窗口的明细，切换分片窗口时有待复现的错位风险。跨会话的费用是按目录估计，不能代替实际账单。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 比原生压力提示多得到什么，历史步骤能否成为定位工具？](#detail-section-11)
  - [Q02 · 活动与离线会话事实怎样被投影、回放和按窗口复用？](#detail-section-12)
  - [Q03 · Agent 注入标签和跨会话成本分别能归因到什么程度？](#detail-section-13)
  - [Q04 · 诊断试用有哪些运行、隐私和输出边界？](#detail-section-14)
  - [Q05 · 额外归因能否缩短正确定位上下文来源所需时间？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护长 DSH 会话的工程师，可从宿主压力数字追查历史步骤、工具或 Agent 注入。

常规选择是原生压力提示加手工翻转录或日志，同一占用率仍取原生投影。插件增加按步骤的浏览和带覆盖状态的聚合。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Context 会话视图 | 按历史步骤追查压力及相关事件 | 数据范围依赖有效投影或回放 |
| Agent 与注入标签 | 从消息与引用回查来源 | 标签可缺失，需查原始消息 |
| Overview | 整理活动与估算费用 | 成本口径受目录与覆盖影响 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| sessionProjections 与 Web 插槽 | 诊断必需 | 投影及呈现 | 旧宿主降级或 UI 无法显示 |
| connection 和会话 observe | 历史明细必需 | 按需读活动与历史数据 | 对应窗口不完整 |
| 模型目录价格和用量 | 成本估计必需 | 按活动汇总 | 查账单与可见覆盖 |
| systemPrompt | 配置前后缀时才需 | 注册主动提示词文本 | 空设置适合只诊断 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户创建有已知长输出的隔离会话 | 只有获准的测试数据 |
| 定位 | 从压力开会话视图，选历史步骤 | 能回查请求和相关原始事件 |
| 复核 | 检查版本、覆盖及账单口径 | 无覆盖或数字错位改查原始日志 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 资源增量未知 | 核对宿主版本、空配置与授权 | 有版本降级 |
| 持续使用 | 历史读与浏览器缓存，实际峰值未测 | 读取事件、判断来源和核对费用 | 不把估价当账单 |
| 退出 | 数据资源变化未知 | 禁用、撤回配置和回查日志 | 跨用户访问范围须先核查 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 追查长会话原因 | 步骤选择、分片与宿主投影 | 误归因率和人工节时 |
| 跨会话核对 | 使用量和有价覆盖统计 | 实际账单与覆盖流失 |
| 历史查看 | 有界观察、缓存和租约释放 | 大会话资源用量、同修订窗口切换 |

> **思考**：上下文浏览依赖历史观察与当前窗口的明细，切换分片窗口时有待复现的错位风险。跨会话的费用是按目录估计，不能代替实际账单。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把宿主现有的压力数字与可追查的历史请求、上下文分项和注入来源连接起来。来源标签和历史步骤要回原事件核对。[Q01](#research-q01) [Q03](#research-q03)

观察会话按租约、版本和持久化来源管理，复用需与分片请求的窗口身份对齐。Agent 模式和字典式别名必须保留原事件链接来复核。

<a id="detail-section-5"></a>

### 1.4 主要限制

上下文浏览依赖历史观察与当前窗口的明细，切换分片窗口时有待复现的错位风险。跨会话的费用是按目录估计，不能代替实际账单。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

有一笔已知长工具返回时可在个人隔离 Web profile 试查，保持额外提示词为空，发生空明细、跨会话错位或权限无法说明时停用插件并回到原始日志。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持多维诊断及按需构建历史的机制。定位正确率、跨用户权限与实际节时尚待验证。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、package.json、src/client/components/browserHelpers.ts、src/client/index.ts、src/client/sessionData.ts、src/client/timelineSource.ts、src/host/config.ts、src/host/facts.ts、src/host/foldInjections.ts、src/host/index.ts、src/host/overviewAggregate.ts、src/host/promptInjection.ts、tsdown.config.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件，按 Host、Web 和长历史行为抽查，不运行目标代码。
- 下一步：在不同长度且有已知正确答案的重放数据中比较两种诊断方式，记录搜索不到、缓存窗口错位、正确定位与人工复核耗时。

**分析版本**

- **仓库**：[bowenliang123/dsh-context](https://github.com/bowenliang123/dsh-context)
- **版本号**：0.85.1（[固定提交 9e22119](https://github.com/bowenliang123/dsh-context/tree/9e221195ac7c02cff9a21311dda6d61f50cf50d3)）
- **版本日期**：2026-11-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

给压力告警配带来源的步骤可减少正确定位时间。可以用已知长输出和已知缺失日志的会话回放交叉比较；如果误归因增加或总人工时间持平，则不支持。[Q05](#research-q05)

在不同长度且有已知正确答案的重放数据中比较两种诊断方式，记录搜索不到、缓存窗口错位、正确定位与人工复核耗时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 2421 | — | — | 44574 |
| .ts | source | 165 | 30798 | 28613 | 133 | — |
| .mjs | source | 4 | 285 | 255 | 0 | — |
| .tsx | source | 62 | 13827 | 13114 | 66 | — |
| .ts | test | 116 | 66448 | 61213 | 248 | — |
| .tsx | test | 1 | 125 | 114 | 0 | — |
| .js | example | 3 | 9 | 9 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/bowenliang123/dsh-context/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 74](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=74&color=737b86&logo=github)](https://github.com/bowenliang123/dsh-context/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z) [![近30天关闭 71](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=71&color=737b86&logo=github)](https://github.com/bowenliang123/dsh-context/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)



统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：运行长会话的工程师如何从压力数字定位一笔请求、工具输出或 Agent 注入，何时诊断结果不足以据此行动？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 比原生压力提示多得到什么，历史步骤能否成为定位工具？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

经常在一个 DSH 长会话中执行工具或协作的工程师，遇到压力升高时需要定位来源。插件仍读取宿主的 contextPressure、contextBreakdown 和用量投影，所以同一窗口的数字只能互相对齐。插件多提供的是会话内上下文标签及浏览器，用户能从窗口或历史步骤追查请求、消息、事件。可先开原生压力环和日志，偶尔看占比的人通常到这一步就够。复杂会话诊断可带着会话、步骤、消息和变化来源交付给同伴，避免仅报告总量。

步骤选择器有当前窗口项，默认只给最近至多 500 个，选中较早步骤可把窗口移到其周围。搜索从已经取得的序列尾部找标签或值，结果本身也最多 500，并未跨过历史回放的边界。因此在空搜索中不能据此说事件不存在，尤其应核对窗口和会话的版本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:89-102](https://github.com/bowenliang123/dsh-context/blob/9e221195ac7c02cff9a21311dda6d61f50cf50d3/README.md#L89-L102)

作者将原生数据投影与插件额外定位视图关联。

<details>
<summary>查看原文（14行）</summary>

```text
| **Token Stats** | 计费 Token 用在了哪里——总量与输入框下方聊天统计行相同，拆分为系统提示词、工具定义、用户消息、注入上下文、技能注入、工具调用、推理和回答。工具调用把工具名称与参数（提示词中重放的部分，加上输出中生成的部分）与这些工具返回的结果一并计入；回答从同一份助手内容与输出中拆出模型的回复正文；推理以同样方式拆出其思考内容；会话的缓存命中率显示在角落。 |
| **Timing Stats** | 活跃时间如何分布在模型调用、工具运行和开销之间。 |
| **Current Context** | 此刻窗口中的内容。 |
| **Context Trend** | 每个请求的大小及其变化过程。 |
| **Context Browser** | 任意请求实际由哪些内容组成。 |
| **Context Events** | 上下文窗口何时以及为何发生变化。 |
| **File Activity** | Agent 对你的文件做了什么。 |
| **命令执行** | Agent 执行了哪些命令、每次运行如何结束、主要用到了哪些程序。 |

成本估算遵循一套有文档记录的规则：[模型定价如何映射](docs/model-pricing-mapping.md)。

标题中的占用率和组成数据读取的都是与聊天输入框上下文环形图相同的**官方 Token 计量投影**（`contextPressure` / `contextBreakdown`），因此数值始终与环形图一致——卡片中的百分比就是同一占用率，精确显示到小数点后一位。

**Context Stats** 卡片中的 Agent Network 单元格（整个 Agent 家族的计费 Token 和预估成本）会跳转至 **Fleet** 标签页。输入输出一行的胶囊同样是跳转链接：**用户输入** 打开上下文浏览器的用户消息，**读取 / 写入 / 搜索 / 图片** 落到文件活动卡片并选中对应筛选。
```

</details>

**依据 2 · 源码核查**：[src/client/sessionData.ts:13-22](https://github.com/bowenliang123/dsh-context/blob/9e221195ac7c02cff9a21311dda6d61f50cf50d3/src/client/sessionData.ts#L13-L22)

界面直接取宿主压力、组成和用量。

<details>
<summary>查看原文（10行）</summary>

```text
export function useContextSession(props: SessionStandardProps): ContextSession {
  const source = useTimelineSource(props)
  return {
    source,
    data: source.data,
    pressure: projectionOf(props, 'contextPressure', contextPressureOf),
    breakdown: projectionOf(props, 'contextBreakdown', contextBreakdownOf),
    usage: projectionOf(props, 'tokenUsage', tokenUsageOf),
  }
}
```

</details>

**依据 3 · 源码核查**：[src/client/components/browserHelpers.ts:48-98](https://github.com/bowenliang123/dsh-context/blob/9e221195ac7c02cff9a21311dda6d61f50cf50d3/src/client/components/browserHelpers.ts#L48-L98)

列表按步骤序号选择有界窗口，搜索只枚举已取得的 requests。

<details>
<summary>查看原文（51行）</summary>

```text
export const STEP_PICK_MAX = 500

export interface StepPickOption {
  value: string
  label: string
}

function stepMatches(option: StepPickOption, query: string): boolean {
  return `${option.label} ${option.value}`.toLowerCase().includes(query)
}

export function stepPickOptionsOf(
  requests: readonly RequestRecord[],
  sel: 'live' | number,
  seq: number | null,
  live: StepPickOption,
  optionOf: (request: RequestRecord) => StepPickOption,
): StepPickOption[] {
  const count = requests.length
  let from = Math.max(0, count - STEP_PICK_MAX)
  if (count > STEP_PICK_MAX) {
    const newest = requests[from]
    const selSeq = typeof sel === 'number' && (seq === null || seq < newest.seq) ? sel : null
    if (selSeq !== null) {
      let low = 0
      let high = count - 1
      let idx = count - 1
      while (low <= high) {
        const mid = (low + high) >> 1
        if (requests[mid].seq >= selSeq) { idx = mid; high = mid - 1 } else low = mid + 1
      }
      from = Math.max(0, idx - (STEP_PICK_MAX >> 1))
    }
  }
  return [live, ...requests.slice(from, from + STEP_PICK_MAX).map(optionOf).reverse()]
}

export function stepPickMatchesOf(
  requests: readonly RequestRecord[],
  query: string,
  live: StepPickOption,
  optionOf: (request: RequestRecord) => StepPickOption,
): StepPickOption[] {
  const q = query.trim().toLowerCase()
  const out: StepPickOption[] = stepMatches(live, q) ? [live] : []
  for (let i = requests.length - 1; i >= 0 && out.length < STEP_PICK_MAX; i--) {
    const option = optionOf(requests[i])
    if (stepMatches(option, q)) out.push(option)
  }
  return out
}
```

</details>

#### 缺口

- 复杂实际会话下旧步骤的可检索比例未测。
  **影响**：决定这一步能否代替手工翻原始日志。
  **进一步探讨**：用前段、中段和尾段分别埋入长工具结果，在同一历史范围核对步骤和检索结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 活动与离线会话事实怎样被投影、回放和按窗口复用？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

Host 要求 sessionProjections。版本低于基线时挂 fallback 后提前返回，近期宿主才继续注册活动、头部、时间线和细读。明细连接从已活动的会话投影和镜像取结果，离线走有准入门的 observe 回放，缓存由会话 ID、观察修订及持久化服务身份组成。finally 释放观察租约。缺 session 或 observe 可能得到空响应，不能视作确实无上下文。

客户端把明细按请求、节点、文件等部分求取，修订与已接受的版本一致才合并。切换窗口时清除该部分的版本命中，等待再拉。源码同时暴露一个待复现的竞态：旧窗口请求正在飞行时，新窗口会因为 in-flight 被跳过；旧响应回来只检查 generation 和 revision，再给该部分写当前版本，finally 仅在版本不同重拉。于是同一 revision 内快速切换窗口有可能让旧片段占住新需求，下一次修订才纠正。先把这种情况视为待验证的显示边界，不据此推定所有浏览器会表现异常。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.ts:37-71](https://github.com/bowenliang123/dsh-context/blob/9e221195ac7c02cff9a21311dda6d61f50cf50d3/src/host/index.ts#L37-L71)

完整和降级投影明确分支。

<details>
<summary>查看原文（35行）</summary>

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
  const shadow = new DetailShadow(ctx, bounds, coldReads, () => observeOf(ctx))
  watchDetailChannel(ctx, bounds, coldReads, gate, shadow, pricing)
  const deltaGate: DetailChannelGate = { ...gate, live: false }
  watchDeltaChannel(ctx, bounds, coldReads, deltaGate, shadow, attribution.ownerOf.bind(attribution))
  watchFactsChannel(ctx, bounds, { gates: gate, coldReads, detailState: id => shadow.stateOf(id), cost: pricing })
  watchCommandPageChannel(ctx, resolveBounds(config), coldReads)
  watchHeadsChannel(ctx, { bounds, coldReads, cost: pricing })
  gate.retain('contextTimeline', ctx.sessionProjections.register(createContextTimelineDefinition(config, () => gate.live, pricing)))
  ctx.sessionProjections.register(createContextHeadersDefinition(name => attribution.ownerOf(name)))
  ctx.sessionProjections.register(createContextActivityDefinition())
```

</details>

**依据 2 · 源码核查**：[src/host/facts.ts:257-308](https://github.com/bowenliang123/dsh-context/blob/9e221195ac7c02cff9a21311dda6d61f50cf50d3/src/host/facts.ts#L257-L308)

活动与观察回放分支，缓存键和租约释放。

<details>
<summary>查看原文（52行）</summary>

```text
      return async (request: Request): Promise<Response> => {
        stateCache.touch()
        const getSession = ((): ((id: string) => unknown) | undefined => {
          const sessions = c.get('sessions') as SessionsFace | undefined
          return typeof sessions?.get === 'function' ? sessions.get.bind(sessions) : undefined
        })()
        const observe = observeOf(c)
        const read = await readBody(request)
        if (!read.ok) return read.response
        const wanted = partsOf(read.body, caps)
        if (wanted === null) return failure('dsh-context/bad-request', 'missing sessionId')
        const wantedDetail = detailPartsRequested(wanted.parts)
        try {
          const session = getSession?.(wanted.sessionId)
          if (session !== undefined && session !== null) {
            const state = stateOfLive(session)
            if (state === null || state === undefined) return reply({ ok: true, value: null })
            const projections = c.get('sessionProjections') as StateProjectionsFace | undefined
            const kernel = kernelOfLive(projections, session)
            const needsDetail = wantedDetail.length > 0 || wanted.parts.has('series')
            const detailState = needsDetail ? await liveDetailState(wanted.sessionId) : null
            return reply({
              ok: true,
              value: valueOf(state as TimelineState, true, wanted, kernel, detailState, bounds.maxArchiveNodes, deps.cost),
            })
          }
          if (observe === undefined) return reply({ ok: true, value: null })
          const value = await coldReads.admit(async () => {
            const observation = await observe(wanted.sessionId, { projectionMode: 'none' })
            const release = leaseOf(observation)
            try {
              const persistence = serviceIdentityOf(c.get('sessionPersistence'))
              const events = asRecord(observation)?.events
              if (!Array.isArray(events)) return null
              const revision = revisionOf(observation) ?? coldCursorOf(events)
              const header = asRecord(observation)?.header
              const cached = stateCache.get(wanted.sessionId, entry => entry.revision === revision && entry.persistence === persistence)
              if (cached !== undefined) {
                const kernel = kernelOfCold(c.get('sessionProjectionCache') as CachedSnapshotFace | undefined, header)
                return valueOf(cached.state, false, wanted, kernel, cached.state, bounds.maxArchiveNodes, deps.cost)
              }
              const state = (await foldLog(events as SessionEvent[], bounds)).state
              stateCache.set(wanted.sessionId, { persistence, revision, state })
              const kernel = kernelOfCold(c.get('sessionProjectionCache') as CachedSnapshotFace | undefined, header)
              return valueOf(state, false, wanted, kernel, state, bounds.maxArchiveNodes, deps.cost)
            } finally {
              release()
            }
          })
          return reply({ ok: true, value: value ?? null })
        } catch (err) {
          return failure('gateway/internal', err instanceof Error ? err.message : String(err))
```

</details>

**依据 3 · 源码核查**：[src/client/timelineSource.ts:406-414](https://github.com/bowenliang123/dsh-context/blob/9e221195ac7c02cff9a21311dda6d61f50cf50d3/src/client/timelineSource.ts#L406-L414)

窗口改变时更新 wantedParts 和该部分修订。

```text
  readonly ensurePart = (part: FactPart, window: FactWindow = {}): void => {
    if (this.facts === undefined || this.factsUnavailable) return
    const prev = this.wantedParts.get(part)
    const same = prev !== undefined && sameWindow(prev, window)
    if (same && this.partRev.get(part) === this.acceptedRev) return
    this.wantedParts.set(part, window)
    if (prev !== undefined && !same) this.partRev.delete(part)
    this.fetchWantedParts()
  }
```

**依据 4 · 源码核查**：[src/client/timelineSource.ts:570-576](https://github.com/bowenliang123/dsh-context/blob/9e221195ac7c02cff9a21311dda6d61f50cf50d3/src/client/timelineSource.ts#L570-L576)

每部分并发请求被去重。

```text
  private fetchWantedParts(): void {
    const facts = this.facts
    if (facts === undefined || this.detail === null || this.acceptedRev < 0 || this.factsUnavailable) return
    for (const [part, window] of this.wantedParts) {
      if (this.unavailableParts.has(part) || this.inflightParts.has(part) || this.partRev.get(part) === this.acceptedRev) continue
      void this.fetchPart(facts, part, window)
    }
```

**依据 5 · 源码核查**：[src/client/timelineSource.ts:617-660](https://github.com/bowenliang123/dsh-context/blob/9e221195ac7c02cff9a21311dda6d61f50cf50d3/src/client/timelineSource.ts#L617-L660)

响应合并判断依赖 generation/revision，未校验当前窗口身份。

<details>
<summary>查看原文（44行）</summary>

```text
  private async fetchPart(facts: FactsFetchers, part: FactPart, window: FactWindow): Promise<void> {
    const generation = this.generation
    const rev = this.acceptedRev
    this.inflightParts.add(part)
    this.emit()
    try {
      const read = await facts.part(part, window)
      if (generation !== this.generation || this.acceptedRev !== rev) return
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
      const merged = mergeFactsInto(this.detail as ContextTimelineDetail, read)
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

- 新的窗口切换竞态是否可从现有界面稳定触发未知。
  **影响**：可能在同一资料修订错看旧片段，影响问题定位。
  **进一步探讨**：延时第一个分片请求，同一 revision 切换增大窗口，检查后承载的尾部和是否有续发。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Agent 注入标签和跨会话成本分别能归因到什么程度？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

Agent 标签只处理指定来源类型。会话引用读 references 标签，其他 Agent 来源按结构化 sender、当前记录的别名，及部分事件的正文摘要提取显示名，优先级由种类决定。有名字并不证明内容来源或身份不可伪造。状态添加新 alias 有 512 项上限，达到后忽略新键；已存在键仍可修正。工具名来源存在兼容差异时，应退回对应原始事件，而不直接依据可见标签决定由哪个插件或 Agent 负责。

Overview 把窗口日期谓词传入用量与时间累加，明列 costSessions、usageSessions 和覆盖。costUsd 用目录 CostSource 聚合，缺数据可能只能给部分视图，服务也不知道实际账单折扣、缓存报价或计价账单的关账阶段。跨会话聚合适合挑选优先复核的高消耗会话，不能给财务对账盖章。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/foldInjections.ts:44-96](https://github.com/bowenliang123/dsh-context/blob/9e221195ac7c02cff9a21311dda6d61f50cf50d3/src/host/foldInjections.ts#L44-L96)

参考标签、结构化别名和正文模式参与 Agent 展示。

<details>
<summary>查看原文（53行）</summary>

```text
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
}
```

</details>

**依据 2 · 源码核查**：[src/host/foldInjections.ts:121-142](https://github.com/bowenliang123/dsh-context/blob/9e221195ac7c02cff9a21311dda6d61f50cf50d3/src/host/foldInjections.ts#L121-L142)

别名折叠有界，达到上限后新项不入状态。

<details>
<summary>查看原文（22行）</summary>

```text
function noteAgentAlias(st: TimelineState, id: string, alias: AgentAlias): boolean {
  const agents = { ...(st.agents ?? {}) }
  if (Object.hasOwn(agents, id)) {
    agents[id] = { ...agents[id], ...alias }
    st.agents = agents
    return true
  }
  if (Object.keys(agents).length >= AGENT_ALIASES_MAX) return false
  agents[id] = alias
  st.agents = agents
  return true
}

export function applyAgentAliasEvent(
  state: TimelineState,
  type: string,
  data: Record<string, unknown> | undefined,
): TimelineState | undefined {
  const fact = agentAliasEvent(type, data)
  if (fact === null) return undefined
  const st = { ...state }
  return noteAgentAlias(st, fact.id, fact.alias) ? st : undefined
```

</details>

**依据 3 · 源码核查**：[src/host/overviewAggregate.ts:243-285](https://github.com/bowenliang123/dsh-context/blob/9e221195ac7c02cff9a21311dda6d61f50cf50d3/src/host/overviewAggregate.ts#L243-L285)

按日过滤核出总量、已计价/有用量会话数和覆盖。

<details>
<summary>查看原文（43行）</summary>

```text
export function summaryOf(
  allRows: readonly HostRow[],
  rows: readonly HostRow[],
  filters: Filters,
  cost: CostSource,
  coverage: BackfillCoverage,
): OverviewSummary {
  const admit = dayPredicate(filters)
  const tokenParts = partsOf(rows, admit)
  let usage: SessionCostUsage | null = null
  let turns = 0
  const windowTiming = { calls: 0, toolCalls: 0, toolsMs: 0, wallMs: 0 }
  let costSessions = 0
  let usageSessions = 0
  let sessionsArchived = 0
  for (const row of rows) {
    const totals = activityTotalsOf(row.activity, admit)
    usage = mergeCostUsage(usage, totals.usage)
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
    tokens: usageTotals?.total ?? 0,
    turns,
    costUsd: cost.usd(usage),
    costSessions,
    usageSessions,
    cacheHit: cacheHitOf(usageTotals),
    tokenParts,
    timing: timingSumOf(rows),
    windowTiming,
    coverage,
```

</details>

#### 缺口

- 不同来源类型、别名冲突和中途回放的误归因率未知。
  **影响**：标签误判会让优化动作落到无关调用。
  **进一步探讨**：挑匿名的团队事件做已知身份标注，并用原始请求和实际账单对照覆盖。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 诊断试用有哪些运行、隐私和输出边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

个人隔离 Web profile 中用非敏感会话先查一笔已知长工具结果。明细通过连接注册，能按 sessionId 取会话及历史。该 handler 展开的是查询路径，用户级隔离取决于宿主连接和部署。共享或代理环境中应先在不同用户之间确认会话权限再考虑放出上下文或文件记录。

插件还有主动修改系统提示的单独能力。配置默认空串，宿主 systemPrompt 暴露所需 API 时才挂接。非空前后缀分别放在身份和部署 Persona 的相邻外侧，读活值且不插值。试用中留空，避免同时变更模型输入。关注诊断耗时、页面与历史回放资源、是否为额外配置承担排查人力。显示错位、明细空白或发现非预期提示内容时，先还原配置或停用插件；用原生界面、原始日志与账单复核。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/facts.ts:257-285](https://github.com/bowenliang123/dsh-context/blob/9e221195ac7c02cff9a21311dda6d61f50cf50d3/src/host/facts.ts#L257-L285)

明细从宿主连接调用并按 sessionId 选择数据。

<details>
<summary>查看原文（29行）</summary>

```text
      return async (request: Request): Promise<Response> => {
        stateCache.touch()
        const getSession = ((): ((id: string) => unknown) | undefined => {
          const sessions = c.get('sessions') as SessionsFace | undefined
          return typeof sessions?.get === 'function' ? sessions.get.bind(sessions) : undefined
        })()
        const observe = observeOf(c)
        const read = await readBody(request)
        if (!read.ok) return read.response
        const wanted = partsOf(read.body, caps)
        if (wanted === null) return failure('dsh-context/bad-request', 'missing sessionId')
        const wantedDetail = detailPartsRequested(wanted.parts)
        try {
          const session = getSession?.(wanted.sessionId)
          if (session !== undefined && session !== null) {
            const state = stateOfLive(session)
            if (state === null || state === undefined) return reply({ ok: true, value: null })
            const projections = c.get('sessionProjections') as StateProjectionsFace | undefined
            const kernel = kernelOfLive(projections, session)
            const needsDetail = wantedDetail.length > 0 || wanted.parts.has('series')
            const detailState = needsDetail ? await liveDetailState(wanted.sessionId) : null
            return reply({
              ok: true,
              value: valueOf(state as TimelineState, true, wanted, kernel, detailState, bounds.maxArchiveNodes, deps.cost),
            })
          }
          if (observe === undefined) return reply({ ok: true, value: null })
          const value = await coldReads.admit(async () => {
            const observation = await observe(wanted.sessionId, { projectionMode: 'none' })
```

</details>

**依据 2 · 源码核查**：[src/host/config.ts:47-52](https://github.com/bowenliang123/dsh-context/blob/9e221195ac7c02cff9a21311dda6d61f50cf50d3/src/host/config.ts#L47-L52)

配置的提示词两端默认为空。

```text
  overviewAutoSteps: volatileField(z.union(['100', '200', '300', 'off']).default('100').loose()),
  defaultOverviewRange: volatileField(z.union(['today', '7d', '30d']).default('30d').loose()),
  fleetTab: volatileField(z.union(['show', 'hide']).default('show').loose()),
  promptPrefix: volatileField(z.string().default('').loose()),
  promptSuffix: volatileField(z.string().default('').loose()),
})
```

**依据 3 · 源码核查**：[src/host/promptInjection.ts:14-52](https://github.com/bowenliang123/dsh-context/blob/9e221195ac7c02cff9a21311dda6d61f50cf50d3/src/host/promptInjection.ts#L14-L52)

以活配置读文本，注册前后两个固定位置的非插值段落。

<details>
<summary>查看原文（39行）</summary>

```text
function liveText(value: unknown): () => string {
  if (value !== null && typeof value === 'object' && typeof (value as { get?: unknown }).get === 'function') {
    const get = (value as { get: () => unknown }).get
    return () => {
      const text = get()
      return typeof text === 'string' ? text : ''
    }
  }
  const text = typeof value === 'string' ? value : ''
  return () => text
}

function sectionText(read: () => string): (context: unknown) => string {
  return () => {
    const text = read()
    return text.trim().length === 0 ? '' : text
  }
}

const ORDER_CLEARANCE = 1000

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

#### 缺口

- 宿主与代理的跨用户边界、长历史回放资源使用未验证。
  **影响**：个人可控数据的试用逻辑不能扩张到共享实例。
  **进一步探讨**：先用两个隔离账号测试可见范围，再用小历史和长历史分别监测堆与请求次数。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 额外归因能否缩短正确定位上下文来源所需时间？

**研究主题**：新假设与验证、效果与总成本

#### 完整回答

假设把原生压力、候选步骤和可分别取回的事实并排呈现，会缩短正确定位耗时。用同一宿主版本准备四类回放：巨大工具结果、巨大用户消息、Agent 注入、观察缺部分历史。让同一批工程师交叉使用原生压力加日志与插件视图定位，控制任务顺序。合格答案要写源事件、会话与请求步号、重新核对日志的结果；缺失资料时明确表示无法判定。然后按合格数计算从告警到人工复核的总时间，失败和重开标签都计入。成本数据另对照实际计价覆盖，也要看复核用时和资源。

如果节时仅来自过早采用错误标签、历史不足时无法判断，或切换视图的失败率掩掉收益，则不支持推广。这个试验保持主动提示词配置为空，也不先启用独立模型实验。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/components/browserHelpers.ts:59-98](https://github.com/bowenliang123/dsh-context/blob/9e221195ac7c02cff9a21311dda6d61f50cf50d3/src/client/components/browserHelpers.ts#L59-L98)

已实现按步骤范围和搜索查询，能定义比较步骤。

<details>
<summary>查看原文（40行）</summary>

```text
export function stepPickOptionsOf(
  requests: readonly RequestRecord[],
  sel: 'live' | number,
  seq: number | null,
  live: StepPickOption,
  optionOf: (request: RequestRecord) => StepPickOption,
): StepPickOption[] {
  const count = requests.length
  let from = Math.max(0, count - STEP_PICK_MAX)
  if (count > STEP_PICK_MAX) {
    const newest = requests[from]
    const selSeq = typeof sel === 'number' && (seq === null || seq < newest.seq) ? sel : null
    if (selSeq !== null) {
      let low = 0
      let high = count - 1
      let idx = count - 1
      while (low <= high) {
        const mid = (low + high) >> 1
        if (requests[mid].seq >= selSeq) { idx = mid; high = mid - 1 } else low = mid + 1
      }
      from = Math.max(0, idx - (STEP_PICK_MAX >> 1))
    }
  }
  return [live, ...requests.slice(from, from + STEP_PICK_MAX).map(optionOf).reverse()]
}

export function stepPickMatchesOf(
  requests: readonly RequestRecord[],
  query: string,
  live: StepPickOption,
  optionOf: (request: RequestRecord) => StepPickOption,
): StepPickOption[] {
  const q = query.trim().toLowerCase()
  const out: StepPickOption[] = stepMatches(live, q) ? [live] : []
  for (let i = requests.length - 1; i >= 0 && out.length < STEP_PICK_MAX; i--) {
    const option = optionOf(requests[i])
    if (stepMatches(option, q)) out.push(option)
  }
  return out
}
```

</details>

**依据 2 · 源码核查**：[src/host/facts.ts:270-308](https://github.com/bowenliang123/dsh-context/blob/9e221195ac7c02cff9a21311dda6d61f50cf50d3/src/host/facts.ts#L270-L308)

活动与历史的不同资料有效性可作为试验分层。

<details>
<summary>查看原文（39行）</summary>

```text
          const session = getSession?.(wanted.sessionId)
          if (session !== undefined && session !== null) {
            const state = stateOfLive(session)
            if (state === null || state === undefined) return reply({ ok: true, value: null })
            const projections = c.get('sessionProjections') as StateProjectionsFace | undefined
            const kernel = kernelOfLive(projections, session)
            const needsDetail = wantedDetail.length > 0 || wanted.parts.has('series')
            const detailState = needsDetail ? await liveDetailState(wanted.sessionId) : null
            return reply({
              ok: true,
              value: valueOf(state as TimelineState, true, wanted, kernel, detailState, bounds.maxArchiveNodes, deps.cost),
            })
          }
          if (observe === undefined) return reply({ ok: true, value: null })
          const value = await coldReads.admit(async () => {
            const observation = await observe(wanted.sessionId, { projectionMode: 'none' })
            const release = leaseOf(observation)
            try {
              const persistence = serviceIdentityOf(c.get('sessionPersistence'))
              const events = asRecord(observation)?.events
              if (!Array.isArray(events)) return null
              const revision = revisionOf(observation) ?? coldCursorOf(events)
              const header = asRecord(observation)?.header
              const cached = stateCache.get(wanted.sessionId, entry => entry.revision === revision && entry.persistence === persistence)
              if (cached !== undefined) {
                const kernel = kernelOfCold(c.get('sessionProjectionCache') as CachedSnapshotFace | undefined, header)
                return valueOf(cached.state, false, wanted, kernel, cached.state, bounds.maxArchiveNodes, deps.cost)
              }
              const state = (await foldLog(events as SessionEvent[], bounds)).state
              stateCache.set(wanted.sessionId, { persistence, revision, state })
              const kernel = kernelOfCold(c.get('sessionProjectionCache') as CachedSnapshotFace | undefined, header)
              return valueOf(state, false, wanted, kernel, state, bounds.maxArchiveNodes, deps.cost)
            } finally {
              release()
            }
          })
          return reply({ ok: true, value: value ?? null })
        } catch (err) {
          return failure('gateway/internal', err instanceof Error ? err.message : String(err))
```

</details>

**依据 3 · 源码核查**：[src/host/foldInjections.ts:78-96](https://github.com/bowenliang123/dsh-context/blob/9e221195ac7c02cff9a21311dda6d61f50cf50d3/src/host/foldInjections.ts#L78-L96)

可分析 Agent 标签与原始来源差异。

<details>
<summary>查看原文（19行）</summary>

```text
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
}
```

</details>

#### 缺口

- 插件和原生流程都没有同条件人时、误判率或合格率。
  **影响**：现有证据只支持条件试用。
  **进一步探讨**：以盲标注的回放和交叉顺序记录正确率与人工时。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
