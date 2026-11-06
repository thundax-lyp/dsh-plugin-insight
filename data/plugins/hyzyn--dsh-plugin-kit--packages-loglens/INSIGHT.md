# @hyzyn/dsh-loglens

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[44554d7](https://github.com/hyzyn/dsh-plugin-kit/tree/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens)

<!-- BEGIN META -->
[![GitHub ★ 62](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=62&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hyzyn/dsh-plugin-kit) [![npm 30d 1,703](https://img.shields.io/static/v1?label=npm+30d&message=1%2C703&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-loglens) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-loglens)
<!-- END META -->

> **功能**：在 DSH 中查询 Elasticsearch 与 OpenSearch 日志，提供行、计数、分页边界及模型查询工具。

> **亮点**：主要增量是共用查询执行层和显式结果边界：精确总数、下界、分页、过期与分片失败分别表达，模型能依据实际结果继续查询。Docker并非本包适配器，Loki新来源未在界面主动提供；收益不能由统一UI推出，见 [Q01](#research-q01)和[Q02](#research-q02)。

> **主要限制**：级别过滤只在返回页内进行，counts与truncation仍是未筛整页；日志文档也不等于异常次数。忽略这些分母和截断会把局部结果写成全量结论，统一格式并未消除该问题，见 [Q03](#research-q03)。

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
  - [Q01 · 面向什么排障任务，相对后端原生界面增加什么？](#detail-section-11)
  - [Q02 · 模型和面板怎样实际查询ES/OS，分页如何保留快照？](#detail-section-12)
  - [Q03 · 级别筛选和计数为何不能等同全量错误次数？](#detail-section-13)
  - [Q04 · 来源权限、凭据与配置持久化有什么边界？](#detail-section-14)
  - [Q05 · 首次、持续与失败恢复成本支持怎样的采用？](#detail-section-15)
  - [Q06 · 可以提出什么可证伪的新日志判断假设？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有ES/OS日志来源和权限的开发运维人员可在DSH内查询并交模型判断，合格结果要求来源、时间窗、分母与不完整状态可回查，见 [Q01](#research-q01)。

原办法是在日志后端原生界面或HTTP中查证据，再粘贴回会话。检索与索引归后端，本组件统一入口和行模型，不保证所有方言与计数语义相同。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 单来源日志查询 | 模型与面板读取归一化行 | ES/OS需索引与方言；非跨后端关联 |
| PIT分页 | 同快照继续读取 | 条件保持一致，过期重新查 |
| 级别筛选 | 筛当前返回页 | counts仍未筛整页，不能推全量错误率 |
| 字段与聚合 | 查询字段、分组与时间分布 | 依后端能力和实际字段，不猜级别存在 |
| 来源配置 | 维护可信地址并脱敏回显 | 原值仍用于存储认证，保存warning需核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node >=22.19.0、兼容DSH与共享kit | 启动必需 | Host、工具和网络围栏 | 声明不代替运行兼容 |
| 可信ES/OS地址、索引、字段与读取权限 | 查询必需 | 真正检索和聚合 | 认证/索引错误须回原平台核对 |
| 同一查询方言、时区、窗口和筛选 | 分页解释必需 | 保持PIT与结果可比较 | 改条件应重新查询，不能复用旧页结论 |
| settings持久化服务 | 跨重启配置必需 | 保存来源清单 | 写失败可能仅内存生效，应读warning |
| Web/React slots | 面板必需 | 卡片与图表 | 工具与界面可独立失效 |
| Docker日志插件 | Docker采集来源可选 | 使用已有Docker工具 | 不是本包统一查询适配器 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户确认可信来源、索引和敏感日志范围 | 保存原平台已知文档样本 |
| 加载 | 插件注册面板与按来源收窄的工具 | 零来源先配置，不盲调查询 |
| 查询 | 用户/模型固定短窗口和方言查询 | 核对文档ID、counts与不完整原因 |
| 翻页 | 原样保留查询条件并传nextCursor | 过期重新查询，不拼不同快照 |
| 退出 | 停用来源/插件并回原平台 | 保留原查询条件供对照，不把无行当无故障 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 安装与后端访问，金额未知 | 配索引、字段与可信凭据，耗时未知 | 原值凭据仍留配置，回显脱敏不等于密钥托管 |
| 持续使用 | 查询扫描、精确计数、PIT与模型日志上下文，费用未知 | 维护方言、映射和分母解释 | 只读不代表无后端负载 |
| 失败恢复 | 重查过期或失败窗口的资源未知 | 核对分片、截断与持久化warning | 保存失败可能内存已切到新配置 |
| 退出 | 已有后端资源仍由原平台管理 | 停用来源并结束依赖该结果 | PIT尽力关闭不等于资源已实测归零 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 查询接线 | 工具和面板进入同一实际后端执行 | 外部后端可达与兼容 |
| 证据边界 | 精确/下界、分片、截断与过期分别表达 | 用户或模型是否正确解释 |
| 诊断价值 | 日志和上下文可交模型继续查询 | 根因准确率、节时与误判率 |

> **思考**：级别过滤只在返回页内进行，counts与truncation仍是未筛整页；日志文档也不等于异常次数。忽略这些分母和截断会把局部结果写成全量结论，统一格式并未消除该问题，见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：主要增量是共用查询执行层和显式结果边界：精确总数、下界、分页、过期与分片失败分别表达，模型能依据实际结果继续查询。Docker并非本包适配器，Loki新来源未在界面主动提供；收益不能由统一UI推出，见 [Q01](#research-q01)和[Q02](#research-q02)。

共用execute层、能力自述与明确截断字段值得借鉴；它们把“无结果”和“不完整”分开。相应代价是更多边界必须被读懂，来源围栏与脱敏回显也不能替代可信配置和密钥管理，见 [Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

级别过滤只在返回页内进行，counts与truncation仍是未筛整页；日志文档也不等于异常次数。忽略这些分母和截断会把局部结果写成全量结论，统一格式并未消除该问题，见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先用可信ES/OS短窗口和已知文档对照原平台，核对方言、索引、时区、计数与截断。页内级别不能推成全量错误率；游标过期、结果差异或敏感内容范围不清时停止依赖该页并回原平台。实际条件见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

查询执行与分页/计数边界有源码支持；诊断质量和查询负载未实测。不可变查询说明为研究者未验证设计，不属于现有已实现能力。

- 已检查：作者 README、包清单、源码路径 packages/loglens/README.md、packages/loglens/package.json、packages/loglens/src/index.ts、packages/loglens/src/tools.ts、packages/loglens/src/execute.ts、packages/loglens/src/query.ts、packages/loglens/src/config.ts、packages/loglens/src/net.ts、packages/loglens/src/backends/registry.ts、packages/loglens/src/backends/elastic.ts、packages/loglens/client-src/pure.js、packages/loglens/client-src/index.js、packages/kit/src/net-fence.ts 及固定范围 inventory；组件：packages/loglens。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：INVENTORY覆盖本子包；定向检查来源注册/选择、Host路由与工具注册、search执行、ES/OS分页计数、配置回显/持久化、客户端来源选项及直接共享net-fence。未审计Loki完整实现、全部图表、context所有匹配分支或后端集群安全。
- 下一步：- 已检查固定版本源码与作者说明。
- 未执行后端查询、目标测试、安装或宿主验收。
- Loki作者实测和安全叙述不视为本轮验证。
- 只推荐受控来源的有限查询，不宣称完整SSRF防护或密钥托管。

**分析版本**

- **仓库**：[hyzyn/dsh-plugin-kit](https://github.com/hyzyn/dsh-plugin-kit)
- **版本号**：0.1.8（[固定提交 44554d7](https://github.com/hyzyn/dsh-plugin-kit/tree/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是给来源、索引、时间、方言、筛选与PIT绑定不可变查询身份，让每页和模型结论引用同一说明，并区分页内与后端筛选分母。其负担与可推翻验证见 [Q06](#research-q06)。

- 已检查固定版本源码与作者说明。
- 未执行后端查询、目标测试、安装或宿主验收。
- Loki作者实测和安全叙述不视为本轮验证。
- 只推荐受控来源的有限查询，不宣称完整SSRF防护或密钥托管。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 16 | 19165 | 11325 | 7406 | — |
| .md | source | 5 | 6332 | — | — | 118650 |
| .mjs | source | 2 | 4348 | 3078 | 812 | — |
| .ts | source | 13 | 5128 | 3191 | 1681 | — |
| .ts | test | 16 | 8436 | 6666 | 1146 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/hyzyn/dsh-plugin-kit/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：统一日志查询面能否保留计数、分页与来源边界，使模型与人依据同一结果继续排障？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向什么排障任务，相对后端原生界面增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向已拥有Elasticsearch或OpenSearch日志来源、希望在DSH会话内查日志并继续让模型判断的人。原办法是先在后端原生界面或HTTP查询中收集日志再粘贴，合格结果是来源、时间、筛选、计数与不完整状态都能回查。它新增共用查询执行层、归一化行与模型工具，检索和索引本身仍由后端完成；不能把多个后端放在同一卡片解释成方言或统计含义完全一致。

注册表里有Loki适配器，但新来源下拉不主动提供Loki，已存在配置仍被识别；本轮采用建议只针对ES/OS，不替Loki背书。Docker没有适配器，组件给的是指向已有Docker日志工具的采集来源，并不自动把Docker日志变成同样支持分页和聚合的后端。一次search只查一个来源，不是跨后端关联分析。对熟悉原生平台复杂查询的人，这层简化入口未必替代原界面。

#### 证据与依据

**依据 1 · 作者声明**：[packages/loglens/README.md:5-18](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens/README.md#L5-L18)

作者定位统一查询面及来源边界。

<details>
<summary>查看原文（14行）</summary>

```text
> DSH 的日志查询面板：把 Elasticsearch / OpenSearch / Docker 归一化成**一个查询面**——同一张卡片里查、看趋势、按字段下钻；agent 侧是 `loglens_*` 只读工具。

可查后端：**Elasticsearch**、**OpenSearch**。Docker 不另做适配器，作为**采集来源**指向现成的
`docker_logs` / `docker_logs_grep`。**Loki 本版不从界面提供**（适配器与真机验收成果都在仓库里，
但它的能力闸没在真机上验过）——判据与恢复方式见 [§ 已知限制](#已知限制)。

![日志查询卡片：ES 来源上的一次查询——查询串与按方言给的可点例子、筛选芯片、时间分布（带时间刻度与峰值）、结果行（级别染色 + 身份标签）](https://cdn.jsdelivr.net/gh/hyzyn/dsh-plugin-kit@main/docs/dsh-plugin-kit-loglens-query.png)

## 特性

- **薄适配器 + 单一执行层**：[src/backends/](./src/backends/) 含三个适配器（Loki / ES / OpenSearch；
  ES 与 OpenSearch 共用一份实现，按 `flavor` 分流），Docker 不是适配器而是采集来源。归一化与夹取只在
  [src/query.ts](./src/query.ts) 一处（时间戳单位、窗口上限、`limit`、方向、游标透传），适配器不得重复夹取；
  面板与 agent 工具共用 [src/execute.ts](./src/execute.ts)，行模型与截断信号同源。
```

</details>

**依据 2 · 源码核查**：[packages/loglens/src/backends/registry.ts:13-22](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens/src/backends/registry.ts#L13-L22)

实际适配器注册，Docker无适配器。

<details>
<summary>查看原文（10行）</summary>

```text
const LOKI_BACKEND: LogBackend = createLokiBackend()
const ELASTIC_BACKEND: LogBackend = createElasticBackend({ flavor: 'es' })
const OPENSEARCH_BACKEND: LogBackend = createElasticBackend({ flavor: 'os' })

export function backendFor(kind: SourceKind): LogBackend | undefined {
  if (kind === 'loki') return LOKI_BACKEND
  if (kind === 'elasticsearch') return ELASTIC_BACKEND
  if (kind === 'opensearch') return OPENSEARCH_BACKEND
  return undefined
}
```

</details>

**依据 3 · 源码核查**：[packages/loglens/client-src/pure.js:17-35](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens/client-src/pure.js#L17-L35)

新选项与已知类型分开，Loki仅保留识别。

<details>
<summary>查看原文（19行）</summary>

```text
 * 注意这是「不主动提供」，**不是「不支持」**：适配器、游标与那次真机验收（`loglens D02`/`D03`）
 * 都还在仓库里，恢复＝把 `'loki'` 加回这一行；`KNOWN_KINDS` 一个字不动，
 * 所以（经 API / 旧配置）已经存在的 Loki 来源照旧能查、照旧如实显示。
 */
const KIND_OPTIONS = ['elasticsearch', 'opensearch', 'docker']

/** 新行的默认类型（Loki 摘掉之后取剩下的第一个）。 */
const DEFAULT_KIND = 'elasticsearch'

/**
 * 这一版**认得**的类型（判据与宿主 `src/config.ts` 的 `SOURCE_KINDS` 对齐）。
 *
 * 为什么不与 `KIND_OPTIONS` 合成一份：`draftFromTarget` / `draftProblem` 拿它做**有效性**判据。
 * 若沿用「对外提供」那一份，一条已存在的 Loki 来源在进卡片时会被**静默改写**成默认类型
 * （状态还是 loki、下拉却画成第一项，而卡片其余部分按 loki 走——同一块区域两处自相矛盾），
 * 那正是本包 `D04` 的形状。两份清单的差别就是「提供」与「认得」，别合回去。
 */
const KNOWN_KINDS = ['loki', 'elasticsearch', 'opensearch', 'docker']

```

</details>

**依据 4 · 源码核查**：[packages/loglens/src/tools.ts:446-452](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens/src/tools.ts#L446-L452)

search明确单来源查询。

```text
  add('loglens_search', defineTool({
    name: 'loglens_search',
    isConcurrencySafe: () => true,
    description: '查一个日志来源：返回归一化后的行 + 诚实的计数与截断信号。一次只查一个来源（v1 不做跨后端 fan-out）。'
      + '返回值里的时间戳一律 epoch 毫秒；**入参**的 from / to 还能写 ISO 8601 或 -30m 这类相对时间（省得自己算毫秒）。',
    parameters: {
      target: { type: 'string', description: '来源 id 或名称（loglens_sources 列出）；只有一个来源时可省略' },
```

#### 缺口

- 缺少在同一故障任务上与原生查询平台的对照。
  **影响**：不能证明统一入口减少修正时间或提高定位质量。
  **进一步探讨**：固定来源、窗口和预算，比较原生界面与DSH工具的证据完整性和总耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模型和面板怎样实际查询ES/OS，分页如何保留快照？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host向tools服务注册loglens工具，search的execute调用runSearch；面板query路由也进入该共用执行层。执行层解析来源并归一化参数后调用backend.query，ES/OS适配器把查询串传给Lucene query_string、结构化filters进入条件，再通过HTTP查询后端。结果带行、counts、truncation、warnings和后续游标，模型可据实际返回继续决定查询，而不是只能接受固定编排。

第一页打开PIT快照，之后使用PIT和search_after；过期时应重新查询，不静默另开快照。返回totalKnown区分精确总数与下界，分片失败和超时进入截断原因；最后一页尽力关闭PIT。它保留了“查到多少”和“能否认为完整”的区别，但后端查询串、时间、方向及筛选必须跨页保持一致，不能拿旧游标配新条件。网络读请求也创建PIT等临时资源，因此只读指不改业务日志，不表示没有后端负载。

#### 证据与依据

**依据 1 · 源码核查**：[packages/loglens/src/index.ts:365-391](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens/src/index.ts#L365-L391)

Host注册工具并接档位闸。

<details>
<summary>查看原文（27行）</summary>

```text
            dispose = undefined
          }
          if (!live.enabled) return
          const tools = (toolsCtx as unknown as { tools: { register(definition: unknown): () => void } }).tools
          const disposers: Array<() => void> = []
          const failures: string[] = []
          registerLoglensTools({
            config: () => live,
            backendFor,
            dockerLoaded: () => dockerPluginLoaded(ctx),
            // 注册面收窄（渐进披露 T2/T7）：零来源只放 sources；没有任何可聚合来源时跳过 facets
            include: includeFor(live),
            add: (name, definition) => {
              try {
                disposers.push(tools.register(definition))
              } catch (error) {
                failures.push(name + '：' + (error instanceof Error ? error.message : String(error)))
              }
            },
          })
          disposers.push(attachTierGate(ctx, {
            pkg: 'loglens',
            prefixes: LOGLENS_TIER_PREFIXES,
            classify: (tool) => LOGLENS_TIER_CLASS[tool],
          }))
          if (failures.length > 0) {
            console.warn('[dsh-loglens] ' + String(failures.length) + ' 个 agent 工具注册失败：' + failures.join('；'))
```

</details>

**依据 2 · 源码核查**：[packages/loglens/src/tools.ts:517-534](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens/src/tools.ts#L517-L534)

search渲染保留边界，execute调用runSearch。

<details>
<summary>查看原文（18行）</summary>

```text
         * 「条」= **日志文档**，不是「次报错」（真机反馈）：多行堆栈在采集侧常被拆成多个文档，
         * 一次 Java 异常能占 30 条，于是 `matched` 与人心里的「报错了几次」不是一个量。这条口径
         * 工具改变不了（要改得在采集侧配 multiline），但**必须说清楚**，否则计数会被当成事件数。
         */
        const docs = result.counts?.matched === undefined ? '' : '，命中 ' + String(result.counts.matched) + ' 个文档'
        const head = '返回 ' + String(result.returned) + ' 行（= ' + String(result.returned) + ' 个日志文档；多行堆栈常被拆成多条）'
          + (result.level === undefined ? '' : '（level ≥ ' + result.level + '）')
          + (result.counts?.scannedRows === undefined ? '' : '，扫描 ' + String(result.counts.scannedRows) + ' 行')
          + docs
          + (result.truncation?.truncated === true ? '（截断：' + (result.truncation.reasons ?? []).join(' / ') + '）' : '')
        const tail = [result.hint === undefined ? '' : result.hint, ...(result.warnings ?? [])].filter((item) => item !== '')
        return [{ type: 'text', text: [head, renderLines(lines, undefined, { expand: expanded }), ...tail].join('\n') }]
      },
    },
    async execute(args: unknown) {
      return await runSearch(deps, (args ?? {}) as Record<string, unknown>)
    },
  }))
```

</details>

**依据 3 · 源码核查**：[packages/loglens/src/execute.ts:132-162](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens/src/execute.ts#L132-L162)

来源解析、参数归一化、实际backend.query。

<details>
<summary>查看原文（31行）</summary>

```text
export async function runSearch(deps: ExecuteDeps, input: Record<string, unknown>): Promise<SearchOutcome> {
  const picked = resolveTarget(deps.config(), input.target)
  if (!picked.ok) throw new Error(picked.error)
  const backend = deps.backendFor(picked.target.kind)
  if (backend === undefined) throw new Error(adapterHint(picked.target.kind))
  const caps = backend.capabilities()
  /*
   * `filters` 必须**原样传下去**（2026-10-17 真机抓到的洞）：这一层被抽出来的时候漏了它，
   * 而下面的 `runFacets` 那份传了——于是结构化筛选只收窄了榜与分布，**行**照旧是全量：
   * 真机上 `filters: {container.name: prometheus}` 发出去，回来的 100 行里躺着 6 个容器，
   * matched 也是未筛的 26264（面板那句「行、时间分布与分组榜都跟着收窄」里，第一个是假的）。
   *
   * 一起漏掉的还有 Loki 那句**诚实的报错**：适配器见不得 filters 就抛「暂不支持结构化 filters」，
   * 传不到它那儿就变成「静默给了全量」——正是那段注释里说的最坏情况。守卫见
   * `test/query-route.test.ts`：走 /query 路由，断言桩后端真的收到了 filters、Loki 真的回了 400。
   */
  const normalized = normalizeQuery({
    targetId: picked.target.id,
    q: input.q,
    from: input.from,
    to: input.to,
    limit: input.limit,
    direction: input.direction,
    cursor: input.cursor,
    filters: input.filters,
  }, caps)
  if (!normalized.ok) throw new Error(normalized.error)
  const wanted = readLevel(input.level)
  if (!wanted.ok) throw new Error(wanted.error)
  const result = await backend.query(normalized.query, picked.target)
  /*
```

</details>

**依据 4 · 源码核查**：[packages/loglens/src/backends/elastic.ts:816-849](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens/src/backends/elastic.ts#L816-L849)

PIT与查询条件、排序的构造。

<details>
<summary>查看原文（34行）</summary>

```text
    async query(query: NormalizedQuery, target: LoglensTarget): Promise<LogQueryResult> {
      const access = targetAccess(target)
      const order = query.direction === 'forward' ? 'asc' : 'desc'
      let cursor: SearchAfterCursor | undefined
      if (query.cursor !== undefined) {
        const state = decodeSearchAfterCursor(query.cursor)
        if (state.kind === 'invalid') throw new Error(prefix + '游标解不开（' + state.reason + '）：请重新发起查询')
        if (state.kind === 'ok') cursor = state.cursor
      }
      // 只有第一页才开 PIT：带游标时**复用**同一个快照，过期就报过期（绝不偷偷重开）
      const pitId = cursor === undefined ? await openPit(access, targetIndex(target), target) : cursor.pitId

      /*
       * 结构化过滤（真机反馈第 2 条）：通道早就在契约里（query.ts 的 filters），只是适配器当初直接抛
       * 「暂不支持」，而工具面又没暴露——于是 agent 只能手写 Lucene 的 字段.keyword:"值" 去猜约定。
       * 现在按 _field_caps 决定怎么打（term / .keyword / match_phrase），判据在 filterClauses。
       */
      const conditions: Array<Record<string, unknown>> = [
        { range: { [ES_TIME_FIELD]: { gte: isoOf(query.from), lte: isoOf(query.to) } } },
        ...(query.filters === undefined ? [] : await filterClauses(target, access, query.filters)),
      ]
      const tiebreaker: Tiebreaker = tiebreakerByTarget.get(target.url) === undefined
        ? '_shard_doc'
        : (tiebreakerByTarget.get(target.url) as Tiebreaker)
      const must = query.q === '' ? [{ match_all: {} }] : [{ query_string: { query: query.q } }]
      const body: Record<string, unknown> = {
        size: query.limit,
        // 显式打开：要报精确命中数就得付这个代价（设计 §3.2 的归属）
        track_total_hits: true,
        query: { bool: { must, filter: conditions } },
        sort: [{ [ES_TIME_FIELD]: { order, unmapped_type: 'date' } }, { [tiebreaker]: order }],
        pit: { id: pitId, keep_alive: keepAlive },
      }
      /*
```

</details>

**依据 5 · 源码核查**：[packages/loglens/src/backends/elastic.ts:864-877](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens/src/backends/elastic.ts#L864-L877)

search_after进入实际HTTP搜索请求。

<details>
<summary>查看原文（14行）</summary>

```text
      if (cursor !== undefined) body.search_after = cursor.searchAfter

      const runSearch = async (): Promise<unknown> => callJson(target, joinUrl(access.url, '/_search'), {
        method: 'POST',
        headers: { ...access.headers, 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })

      let payload: unknown
      try {
        payload = await runSearch()
      } catch (error) {
        // 7.10 / 7.11 不认识 _shard_doc：换成 _id 再来一次，并把这台 ES 的选择记住
        if (error instanceof ElasticHttpError && tiebreaker === '_shard_doc' && looksLikeMissingShardDoc(error)) {
```

</details>

**依据 6 · 源码核查**：[packages/loglens/src/backends/elastic.ts:925-980](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens/src/backends/elastic.ts#L925-L980)

计数、分片和页终PIT处理。

<details>
<summary>查看原文（56行）</summary>

```text
      const failedShards = typeof root._shards?.failed === 'number' ? root._shards.failed : 0
      /*
       * 「还有没有更多」走**共用判据**（src/query.ts 的 pageLimitFlags），不再是一句
       * `lines.length >= limit`：那个在「命中恰好等于上限」时会误报截断、还给出一个翻过去必然
       * 空页的「下一页」（真机实测，第三十六刀）。
       *
       * `totalKnown` 由 relation 决定：只有 `track_total_hits: true` 且 ES 回 `eq` 时 matched 才是
       * 精确的——`gte` 时它只是个下界，那时只能说「可能还有」。
       */
      const limitFlags = pageLimitFlags({
        returned: lines.length,
        limit: query.limit,
        ...(matched === undefined ? {} : { matched }),
        totalKnown: matched !== undefined && relation !== 'gte',
      })
      const lastHit = rawHits[rawHits.length - 1]
      const lastSort = lastHit === undefined ? undefined : lastHit.sort

      const result: LogQueryResult = {
        lines,
        counts: countsOf({
          returned: lines.length,
          ...(matched === undefined ? {} : { matched }),
          totalRelation: relation,
        }),
        truncation: truncationOf({
          limited: limitFlags.limited,
          maybeLimited: limitFlags.maybeLimited,
          timedOut: root.timed_out === true,
          partialShards: failedShards > 0,
        }),
        /*
         * 分片失败时**把 ES 的原话带上**（2026-10-18 真机抓到的那条）：
         * 光说「部分分片失败」，`level:(ERROR` 这种少一个括号的查询串与真的分片故障长得一样，
         * 而后者用户该找运维、前者该改自己那行字。原话是唯一能分开这两件事的东西。
         */
        ...(failedShards > 0 ? (() => {
          const reasons = shardFailureReasons(root._shards)
          return reasons.length === 0
            ? {}
            : { warnings: reasons.map((reason) => '[分片] ' + reason) }
        })() : {}),
      }
      /*
       * 游标只在**确定还有**时才给（`limited`，不是 `maybeLimited`）。
       *
       * 「可能还有」那一档意味着「命中数恰好等于上限」，即这一页已经覆盖了全部命中——
       * 再给游标，用户点「下一页」得到的是空页（真机验过）。宁可不给，也不给一个必然为空的入口。
       */
      if (limitFlags.limited && Array.isArray(lastSort)) {
        result.nextCursor = encodeSearchAfterCursor({ v: 1, kind: 'es', pitId, searchAfter: lastSort })
      } else {
        // 这一页就是最后了（不管它是不是带游标来的）：把 PIT 关掉，省得它挂到过期
        await closePit(access, pitId, target)
      }
      return result
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 级别筛选和计数为何不能等同全量错误次数？

**研究主题**：缺陷与关键质疑

#### 完整回答

level参数在后端返回的这一页上筛选，而不是写入ES服务端级别条件。执行层保留未筛整页的counts和truncation，再减少lines；warning会说明筛掉多少行。因此界面或模型看到returned=3和matched=1000，不应解释为一千条中只有三个错误，也不能仅凭本页无error判服务正常。需要全量级别统计时必须核实后端是否真有可聚合级别字段；正文推断的级别不等同索引里已有字段。

一个日志文档也不等于一次异常事件，多行堆栈可以拆成许多文档。工具render显式说明文档口径，页内筛会把无级别续行排除；这可能让上下文碎片化，即使前端把级别颜色显示清楚也不消除该限制。最重要的使用约束是保存原查询窗口和筛选，并读取warnings、totalKnown与truncation后再下结论；统一格式并不保证业务事件数正确。

#### 证据与依据

**依据 1 · 源码核查**：[packages/loglens/src/execute.ts:170-201](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens/src/execute.ts#L170-L201)

级别在页内过滤且counts/truncation保留未筛口径，续行单列。

<details>
<summary>查看原文（32行）</summary>

```text
   * level 过滤在**这一页**上做（真机反馈第 7 条）。
   *
   * 为什么不推给后端：级别字段在各家索引里名字与存在性都不一样（这套集群里 log.level 是空桶，
   * 级别其实长在正文里），推下去就会变成「有时候筛了、有时候静默没筛」。所以本层如实做页内筛 +
   * 一条明说范围的 warning：counts 与 truncation 仍是**未筛的整页**。**不要**在这里指一条
   * 「用聚合看全量」的路——ES 上 log.level 常为空，按它分组也是空桶（真机实测）；后端没有
   * 级别字段时，面板与 agent 都只能页内筛 + 在查询串里搜关键字。
   */
  let lines = result.lines
  if (wanted.level !== undefined) {
    const kept = lines.filter((line) => levelMatches(line.level, wanted.level as CanonicalLevel))
    /*
     * 这句 warning 是**原话照抄**到面板上的（meta 行里那个 `.ll_warn`），所以不写 Markdown
     * 的 `**`——宿主不把文案当 Markdown 渲染，界面上会原样露出星号。另外，后半句要给一条
     * **走得通**的路：ES 上 `log.level` 常常整列是空的（级别从正文推断），那种来源连
     * `loglens_facets` 按它分组也是空桶（真机 2026-10-17 实测），只指聚合等于指一条死路。
     */
    /*
     * 续行要**单独报数**（真机 2026-10-19）：采集侧没配 multiline 时，一次异常会被拆成 5–30 个文档，
     * 其中只有首文档带级别、其余是 `\tat …` / `Caused by:` 这类续行（实测样本 63%）。
     * 它们本来就"没有级别"，按级别筛必然把它们全筛掉——**不报数就等于让它们静默消失**，
     * 而用户看到的 error 数会因此偏小、且完全不知道为什么。
     */
    const continuation = lines.filter((line) => line.levelContinuation === true).length
    warnings.push(
      'level=' + wanted.level + '（' + levelHint(wanted.level) + '）是按「返回的这一页」筛的：'
      + String(lines.length - kept.length) + ' / ' + String(lines.length) + ' 行被筛掉'
      + (continuation === 0 ? '' : '（其中 ' + String(continuation) + ' 行是**堆栈续行**——它们本身没有级别，'
        + '是上一条日志的后半截，所以必然被筛掉）')
      + '，counts 与 truncation 仍是未筛的整页——按级别看全量要求后端真有级别字段'
      + '（ES 上 log.level 常为空、级别是从正文推断的），否则只能在查询串里搜级别关键字',
    )
```

</details>

**依据 2 · 源码核查**：[packages/loglens/src/execute.ts:213-230](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens/src/execute.ts#L213-L230)

返回窗口、counts、lines与warnings。

<details>
<summary>查看原文（18行）</summary>

```text
  const hint = reasons.includes('cursor_expired')
    ? '游标已过期（PIT 有寿命）：请重新发起一次带时间窗的查询，不要接着用这个游标'
    : result.nextCursor !== undefined
      ? '这一页被 limit 截断，还有下一页：把返回值里的 nextCursor 原样传回 cursor 参数（同一时间窗、同一 direction）'
      : limited && caps.pagination === 'none'
        ? '这个来源不支持游标，命中可能不完整：请缩小时间窗（或把 limit 调小后分段查）'
        : undefined
  return {
    target: describeTarget(picked.target),
    window: { from: normalized.query.from, to: normalized.query.to },
    returned: lines.length,
    counts: result.counts,
    truncation: result.truncation,
    lines,
    ...(result.nextCursor === undefined ? {} : { nextCursor: result.nextCursor }),
    warnings,
    ...(hint === undefined ? {} : { hint }),
    ...(wanted.level === undefined ? {} : { level: wanted.level }),
```

</details>

**依据 3 · 源码核查**：[packages/loglens/src/tools.ts:517-531](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens/src/tools.ts#L517-L531)

工具说明日志文档不是报错次数。

<details>
<summary>查看原文（15行）</summary>

```text
         * 「条」= **日志文档**，不是「次报错」（真机反馈）：多行堆栈在采集侧常被拆成多个文档，
         * 一次 Java 异常能占 30 条，于是 `matched` 与人心里的「报错了几次」不是一个量。这条口径
         * 工具改变不了（要改得在采集侧配 multiline），但**必须说清楚**，否则计数会被当成事件数。
         */
        const docs = result.counts?.matched === undefined ? '' : '，命中 ' + String(result.counts.matched) + ' 个文档'
        const head = '返回 ' + String(result.returned) + ' 行（= ' + String(result.returned) + ' 个日志文档；多行堆栈常被拆成多条）'
          + (result.level === undefined ? '' : '（level ≥ ' + result.level + '）')
          + (result.counts?.scannedRows === undefined ? '' : '，扫描 ' + String(result.counts.scannedRows) + ' 行')
          + docs
          + (result.truncation?.truncated === true ? '（截断：' + (result.truncation.reasons ?? []).join(' / ') + '）' : '')
        const tail = [result.hint === undefined ? '' : result.hint, ...(result.warnings ?? [])].filter((item) => item !== '')
        return [{ type: 'text', text: [head, renderLines(lines, undefined, { expand: expanded }), ...tail].join('\n') }]
      },
    },
    async execute(args: unknown) {
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 来源权限、凭据与配置持久化有什么边界？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

来源地址来自配置，面板HTTP读查询也要求本机围栏和同源证明；来源变更属于配置写入，不应从日志只读推出无写入。共享出站层先解析地址并拒绝链路本地、元数据等硬拒档，再fetch且不跟重定向，同时限时限体积。它仍允许配置中的私网、回环与公网来源，这正是日志接入所需，不是只出站公网的隔离环境。解析检查与fetch调用是两个步骤，本轮没有证明连接层DNS绑定或完整SSRF防护，因此只接可信受控来源，不把围栏称为万能安全保证。

publicConfig和publicTarget去掉URL里的user:pass后再回显给界面与模型，但存储保留原值用于认证，不能从脱敏回显推导凭据已经由独立密钥库托管。原始日志也可能包含秘密，工具只读仍会把查到的文本交给模型。配置persist先替换live并重建工具，再等待settings更新；保存失败返回warning而不恢复旧live，无settings则只进程内有效。用户需区分当前能查与重启后仍保留，不能从一次保存请求完成推断持久化成功。

#### 证据与依据

**依据 1 · 源码核查**：[packages/loglens/src/index.ts:181-223](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens/src/index.ts#L181-L223)

回环围栏及查询同源证明。

<details>
<summary>查看原文（43行）</summary>

```text
        const loopback = isLoopbackRequestStrict(req)
        const allowed = loopback instanceof Promise ? await loopback : loopback
        if (!allowed) {
          writeJson(res, 403, { error: '仅允许本机回环访问' })
          return
        }
        const sub = new URL(req.url ?? '/', 'http://loopback').pathname.slice(ROUTE_PREFIX.length)
        if (sub !== '/config' && sub !== '/query' && sub !== '/fields' && sub !== '/facets') {
          writeJson(res, 404, { error: '未知路由：' + sub })
          return
        }
        const config = state.read()
        if (req.method === 'GET') {
          if (sub !== '/config') {
            writeJson(res, 405, { error: '只支持 POST，收到 ' + String(req.method) })
            return
          }
          // 回显脱敏：地址里的 user:pass 永不回传浏览器（loglens 外部测评 issue #13 第 9 条）
          writeJson(res, 200, { ok: true, config: publicConfig(config), plugins: { docker: state.dockerLoaded() } })
          return
        }
        if (req.method !== 'POST') {
          writeJson(res, 405, { error: '只支持 GET / POST，收到 ' + String(req.method) })
          return
        }
        if (!config.enabled && sub !== '/config') {
          writeJson(res, 403, { error: '插件已禁用（设置 → 插件配置 → 日志查询 → 启用插件）' })
          return
        }
        if (sub === '/query' || sub === '/fields' || sub === '/facets') {
          // 只读但会替请求方打到内网目标：要同源证明（见函数头）
          if (!hasSameOriginProof(req)) {
            writeJson(res, 403, { error: '缺少同源证明（' + originProofHint(req) + '）' })
            return
          }
          const payload = await readJsonBody(req)
          if (payload === undefined) {
            writeJson(res, 400, { error: '请求体不是合法的 JSON 对象' })
            return
          }
          try {
            const outcome = sub === '/query'
              ? await state.runQuery(payload)
```

</details>

**依据 2 · 源码核查**：[packages/loglens/src/config.ts:233-252](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens/src/config.ts#L233-L252)

回显脱敏但保留原值存储。

<details>
<summary>查看原文（20行）</summary>

```text
 * 给**界面与模型**看的来源：地址里的 `user:pass` 一律抹掉（2026-10-19 外部测评 issue #13 第 9 条）。
 *
 * 规格本来就是这样写的（design §4「凭据：官方凭据层 / `env:NAME` 引用，**永不回传浏览器**」；
 * ROADMAP「URL 里不留凭据——错误文案与日志里也不该有密码」），但实现漏了两处出口：
 *   - `GET /config` 原样回整份 config → 密码进了浏览器；
 *   - `loglens_sources` 工具输出 `target.url` → 密码进了模型上下文。
 *
 * 判据：**回显一律脱敏，存储仍保留原值**。存储侧不能改——ES 的 `targetAccess` 要靠 URL 里的
 * `user:pass` 现算 Basic 头，把存储也洗掉就等于把认证弄丢。所以脱敏只发生在「出去的那一侧」。
 *
 * @param target - 一条来源
 * @returns 同一形状的副本，`url` 已去掉 userinfo
 */
export function publicTarget(target: LoglensTarget): LoglensTarget {
  return { ...target, url: sanitizeUrl(target.url) }
}

/** 整份配置的对外形态（`/config` 与工具输出共用同一口径）。 */
export function publicConfig(config: LoglensConfig): LoglensConfig {
  return { ...config, targets: config.targets.map((target) => publicTarget(target)) }
```

</details>

**依据 3 · 源码核查**：[packages/loglens/src/index.ts:338-350](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens/src/index.ts#L338-L350)

先live替换再settings写入，失败warning。

<details>
<summary>查看原文（13行）</summary>

```text
      // 启用 / 停用的热生效：工具与档位闸跟着走（禁用时一个工具都不注册）
      refreshTools()
      const current = scope
      if (current === undefined) return '宿主没有 settings 服务，改动只在本次进程内有效'
      try {
        await current.update({ enabled: next.enabled, targets: next.targets })
        return undefined
      } catch (error) {
        return '写入 profile 配置失败：' + (error instanceof Error ? error.message : String(error))
      }
    }

    /*
```

</details>

**依据 4 · 源码核查**：[packages/kit/src/net-fence.ts:249-285](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit/src/net-fence.ts#L249-L285)

解析地址与硬拒范围。

<details>
<summary>查看原文（37行）</summary>

```text
export async function assertReachable(url: string, options: FenceOptions): Promise<FenceVerdict> {
  const shown = sanitizeUrl(url)
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new FenceError('transport', options.label + ' 地址不是合法 URL：' + shown, shown)
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new FenceError('blocked_address', options.label + ' 只支持 http / https 的来源地址：' + shown, shown)
  }
  const host = parsed.hostname
  let addresses: string[]
  try {
    addresses = await resolveHost(host, options)
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    throw new FenceError('dns_failed', options.label + ' 域名解析失败：' + host + '（' + detail + '）', shown)
  }
  if (addresses.length === 0) {
    throw new FenceError('dns_failed', options.label + ' 域名没有解析出任何地址：' + host, shown)
  }
  const tiers = addresses.map((address) => classifyAddress(address))
  for (let index = 0; index < addresses.length; index += 1) {
    const tier = tiers[index]
    const address = addresses[index]
    if (isHardBlockedTier(tier)) {
      throw new FenceError(
        'blocked_address',
        options.label + ' 出站围栏拦下了 ' + host + '：它解析到' + tierText(tier) + ' ' + address
          + '（链路本地 / 云元数据是明列的非目标，没有豁免；'
          + '要访问这类地址请换成可达的内网 / 回环地址）',
        shown,
      )
    }
    // 公网档**不拦**（常规做法，见文件头）：只有硬拒档在本层的射程内
  }
```

</details>

**依据 5 · 源码核查**：[packages/kit/src/net-fence.ts:400-429](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit/src/net-fence.ts#L400-L429)

另一次fetch、不跟重定向和读取上限。

<details>
<summary>查看原文（30行）</summary>

```text
export async function requestJson(options: NetRequestOptions): Promise<NetResponse> {
  const timeoutMs = options.timeoutMs === undefined ? NET_DEFAULT_TIMEOUT_MS : options.timeoutMs
  const maxBytes = options.maxBytes === undefined ? NET_MAX_RESPONSE_BYTES : options.maxBytes
  const verdict = await assertReachable(options.url, options)
  const controller = new AbortController()
  const timer = setTimeout(() => { controller.abort() }, timeoutMs)
  let response: Response
  let text: string
  try {
    response = await options.fetchImpl(options.url, { ...options.init, redirect: 'manual', signal: controller.signal })
    if (REDIRECT_STATUSES.has(response.status)) {
      const location = response.headers?.get?.('location') ?? null
      try {
        await response.body?.cancel()
      } catch {
        /* 忽略 */
      }
      throw new FenceError(
        'redirect',
        options.label + ' 来源回了 ' + String(response.status) + ' 重定向到 '
          + (location === null ? '（没给 Location）' : sanitizeUrl(location))
          + '：**不跟随重定向**（一次 302 就能绕过来源白名单），请把地址直接改成最终地址',
        verdict.url,
      )
    }
    text = await readCapped(response, maxBytes, options.label + ' ', verdict.url)
  } catch (error) {
    if (error instanceof FenceError) throw error
    if (isAbort(error)) {
      throw new FenceError(
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 首次、持续与失败恢复成本支持怎样的采用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适合已有受控ES/OS来源和日志读取权限的人做有限查询试用，先从短时间窗和已知事件样本开始，与原平台用相同方言、索引、时区和过滤条件核对。成功标准是原始文档ID和文本相符、分页不误用旧条件、部分分片失败和截断不被当作完整。它不适合凭默认页级别筛选出全量错误率，也不是跨后端根因推理的保证。

首次成本包括安装、可信来源、字段/索引映射和凭据保护；持续成本包括后端扫描、track_total_hits精确计数、PIT资源及模型读取日志费用。失败恢复需要重发过期查询、保持条件、处理分片错误和核对配置warning；金额、资源量和工时均未测。若与原平台同条件结果不符、游标过期却继续分析旧页、级别筛选被误读或凭据/敏感日志暴露，就停止依赖该结果并回原平台核对，必要时停用来源。源码支持有限有边界的试用，不支持持续安装或提高排障准确率的承诺。

#### 证据与依据

**依据 1 · 源码核查**：[packages/loglens/src/query.ts:24-35](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens/src/query.ts#L24-L35)

默认条数和15分钟窗口，体现查询预算。

<details>
<summary>查看原文（12行）</summary>

```text
/** epoch 毫秒的下限判据：小于它就当成「按秒填的」（1e11 ms ≈ 1973-03）。 */
const MS_FLOOR = 100_000_000_000

/**
 * 「只给了一端」时的兜底窗口：15 分钟。
 *
 * 为什么是它而不是 maxWindowMs（24 小时）：最常见的问法是「给我看最新的日志」，而 24 小时的
 * 尾部在昂贵的集群上是几万行——兜底该给一个**能读完**的量，宽窗留给调用方自己说明。
 */
export const FALLBACK_WINDOW_MS = 15 * 60 * 1000

/** 相对时间的写法：-30m / -2h / -1d / -90s。 */
```

</details>

**依据 2 · 源码核查**：[packages/loglens/src/backends/elastic.ts:840-849](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens/src/backends/elastic.ts#L840-L849)

精确总数和PIT请求存在资源成本。

<details>
<summary>查看原文（10行）</summary>

```text
      const must = query.q === '' ? [{ match_all: {} }] : [{ query_string: { query: query.q } }]
      const body: Record<string, unknown> = {
        size: query.limit,
        // 显式打开：要报精确命中数就得付这个代价（设计 §3.2 的归属）
        track_total_hits: true,
        query: { bool: { must, filter: conditions } },
        sort: [{ [ES_TIME_FIELD]: { order, unmapped_type: 'date' } }, { [tiebreaker]: order }],
        pit: { id: pitId, keep_alive: keepAlive },
      }
      /*
```

</details>

**依据 3 · 源码核查**：[packages/loglens/src/execute.ts:213-230](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens/src/execute.ts#L213-L230)

游标过期及页边界提示。

<details>
<summary>查看原文（18行）</summary>

```text
  const hint = reasons.includes('cursor_expired')
    ? '游标已过期（PIT 有寿命）：请重新发起一次带时间窗的查询，不要接着用这个游标'
    : result.nextCursor !== undefined
      ? '这一页被 limit 截断，还有下一页：把返回值里的 nextCursor 原样传回 cursor 参数（同一时间窗、同一 direction）'
      : limited && caps.pagination === 'none'
        ? '这个来源不支持游标，命中可能不完整：请缩小时间窗（或把 limit 调小后分段查）'
        : undefined
  return {
    target: describeTarget(picked.target),
    window: { from: normalized.query.from, to: normalized.query.to },
    returned: lines.length,
    counts: result.counts,
    truncation: result.truncation,
    lines,
    ...(result.nextCursor === undefined ? {} : { nextCursor: result.nextCursor }),
    warnings,
    ...(hint === undefined ? {} : { hint }),
    ...(wanted.level === undefined ? {} : { level: wanted.level }),
```

</details>

**依据 4 · 源码核查**：[packages/loglens/package.json:6-38](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens/package.json#L6-L38)

运行时和共享依赖声明。

<details>
<summary>查看原文（33行）</summary>

```text
  "engines": {
    "node": ">=22.19.0"
  },
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": "./client.js",
    "./package.json": "./package.json"
  },
  "dsh": {
    "manifestVersion": 1,
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "engines": {
      "dsh": ">=0.1.7-rc.2"
    },
    "client": {
      "platform": "web",
      "inject": []
    }
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.18.4",
    "@hyzyn/dsh-kit": "0.8.0"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "^4.0.4",
    "@deepseek-ai/dsh-tools": "0.1.2-rc.1",
```

</details>

#### 缺口

- 缺少同条件查询正确率、负载与人工核对数据。
  **影响**：不能量化净节时、后端成本或诊断质量提升。
  **进一步探讨**：以受控日志样本对齐索引/时区/方言，记录文档差异、分页覆盖、查询资源和修正时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 可以提出什么可证伪的新日志判断假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把来源、查询方言、索引、时间窗、筛选条件与PIT身份绑定成不可变查询说明，再让每页结果和模型结论引用同一说明。推导来自当前跨页条件需保持、页内level与未筛计数并存，以及分片错误仍可能返回行的取舍。现状已经传边界字段，但模型或用户仍可能把不同条件和分母拼成一个判断。

候选增量是让条件变化直接创建新查询身份，页内筛和后端筛显示不同分母，并在证据不完整时阻止输出全量错误率。代价是状态管理和更多显式说明，不能只增加图标。最小对照在同一批含堆栈续行、gte总数、游标过期与部分分片失败的样本上比较现状与候选，记录分母误读、跨条件引用、修正时间和任务正确率；若误读未减少或额外操作使总负担更高，就否定这个方向。没有真实用户误读与付费材料，不把它写成确定产品机会。

#### 证据与依据

**依据 1 · 源码核查**：[packages/loglens/src/execute.ts:170-201](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens/src/execute.ts#L170-L201)

页内筛和未筛分母共存。

<details>
<summary>查看原文（32行）</summary>

```text
   * level 过滤在**这一页**上做（真机反馈第 7 条）。
   *
   * 为什么不推给后端：级别字段在各家索引里名字与存在性都不一样（这套集群里 log.level 是空桶，
   * 级别其实长在正文里），推下去就会变成「有时候筛了、有时候静默没筛」。所以本层如实做页内筛 +
   * 一条明说范围的 warning：counts 与 truncation 仍是**未筛的整页**。**不要**在这里指一条
   * 「用聚合看全量」的路——ES 上 log.level 常为空，按它分组也是空桶（真机实测）；后端没有
   * 级别字段时，面板与 agent 都只能页内筛 + 在查询串里搜关键字。
   */
  let lines = result.lines
  if (wanted.level !== undefined) {
    const kept = lines.filter((line) => levelMatches(line.level, wanted.level as CanonicalLevel))
    /*
     * 这句 warning 是**原话照抄**到面板上的（meta 行里那个 `.ll_warn`），所以不写 Markdown
     * 的 `**`——宿主不把文案当 Markdown 渲染，界面上会原样露出星号。另外，后半句要给一条
     * **走得通**的路：ES 上 `log.level` 常常整列是空的（级别从正文推断），那种来源连
     * `loglens_facets` 按它分组也是空桶（真机 2026-10-17 实测），只指聚合等于指一条死路。
     */
    /*
     * 续行要**单独报数**（真机 2026-10-19）：采集侧没配 multiline 时，一次异常会被拆成 5–30 个文档，
     * 其中只有首文档带级别、其余是 `\tat …` / `Caused by:` 这类续行（实测样本 63%）。
     * 它们本来就"没有级别"，按级别筛必然把它们全筛掉——**不报数就等于让它们静默消失**，
     * 而用户看到的 error 数会因此偏小、且完全不知道为什么。
     */
    const continuation = lines.filter((line) => line.levelContinuation === true).length
    warnings.push(
      'level=' + wanted.level + '（' + levelHint(wanted.level) + '）是按「返回的这一页」筛的：'
      + String(lines.length - kept.length) + ' / ' + String(lines.length) + ' 行被筛掉'
      + (continuation === 0 ? '' : '（其中 ' + String(continuation) + ' 行是**堆栈续行**——它们本身没有级别，'
        + '是上一条日志的后半截，所以必然被筛掉）')
      + '，counts 与 truncation 仍是未筛的整页——按级别看全量要求后端真有级别字段'
      + '（ES 上 log.level 常为空、级别是从正文推断的），否则只能在查询串里搜级别关键字',
    )
```

</details>

**依据 2 · 源码核查**：[packages/loglens/src/backends/elastic.ts:816-849](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens/src/backends/elastic.ts#L816-L849)

快照与查询条件分别输入，形成绑定问题。

<details>
<summary>查看原文（34行）</summary>

```text
    async query(query: NormalizedQuery, target: LoglensTarget): Promise<LogQueryResult> {
      const access = targetAccess(target)
      const order = query.direction === 'forward' ? 'asc' : 'desc'
      let cursor: SearchAfterCursor | undefined
      if (query.cursor !== undefined) {
        const state = decodeSearchAfterCursor(query.cursor)
        if (state.kind === 'invalid') throw new Error(prefix + '游标解不开（' + state.reason + '）：请重新发起查询')
        if (state.kind === 'ok') cursor = state.cursor
      }
      // 只有第一页才开 PIT：带游标时**复用**同一个快照，过期就报过期（绝不偷偷重开）
      const pitId = cursor === undefined ? await openPit(access, targetIndex(target), target) : cursor.pitId

      /*
       * 结构化过滤（真机反馈第 2 条）：通道早就在契约里（query.ts 的 filters），只是适配器当初直接抛
       * 「暂不支持」，而工具面又没暴露——于是 agent 只能手写 Lucene 的 字段.keyword:"值" 去猜约定。
       * 现在按 _field_caps 决定怎么打（term / .keyword / match_phrase），判据在 filterClauses。
       */
      const conditions: Array<Record<string, unknown>> = [
        { range: { [ES_TIME_FIELD]: { gte: isoOf(query.from), lte: isoOf(query.to) } } },
        ...(query.filters === undefined ? [] : await filterClauses(target, access, query.filters)),
      ]
      const tiebreaker: Tiebreaker = tiebreakerByTarget.get(target.url) === undefined
        ? '_shard_doc'
        : (tiebreakerByTarget.get(target.url) as Tiebreaker)
      const must = query.q === '' ? [{ match_all: {} }] : [{ query_string: { query: query.q } }]
      const body: Record<string, unknown> = {
        size: query.limit,
        // 显式打开：要报精确命中数就得付这个代价（设计 §3.2 的归属）
        track_total_hits: true,
        query: { bool: { must, filter: conditions } },
        sort: [{ [ES_TIME_FIELD]: { order, unmapped_type: 'date' } }, { [tiebreaker]: order }],
        pit: { id: pitId, keep_alive: keepAlive },
      }
      /*
```

</details>

**依据 3 · 源码核查**：[packages/loglens/src/backends/elastic.ts:925-963](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/loglens/src/backends/elastic.ts#L925-L963)

分片与计数边界为候选约束来源。

<details>
<summary>查看原文（39行）</summary>

```text
      const failedShards = typeof root._shards?.failed === 'number' ? root._shards.failed : 0
      /*
       * 「还有没有更多」走**共用判据**（src/query.ts 的 pageLimitFlags），不再是一句
       * `lines.length >= limit`：那个在「命中恰好等于上限」时会误报截断、还给出一个翻过去必然
       * 空页的「下一页」（真机实测，第三十六刀）。
       *
       * `totalKnown` 由 relation 决定：只有 `track_total_hits: true` 且 ES 回 `eq` 时 matched 才是
       * 精确的——`gte` 时它只是个下界，那时只能说「可能还有」。
       */
      const limitFlags = pageLimitFlags({
        returned: lines.length,
        limit: query.limit,
        ...(matched === undefined ? {} : { matched }),
        totalKnown: matched !== undefined && relation !== 'gte',
      })
      const lastHit = rawHits[rawHits.length - 1]
      const lastSort = lastHit === undefined ? undefined : lastHit.sort

      const result: LogQueryResult = {
        lines,
        counts: countsOf({
          returned: lines.length,
          ...(matched === undefined ? {} : { matched }),
          totalRelation: relation,
        }),
        truncation: truncationOf({
          limited: limitFlags.limited,
          maybeLimited: limitFlags.maybeLimited,
          timedOut: root.timed_out === true,
          partialShards: failedShards > 0,
        }),
        /*
         * 分片失败时**把 ES 的原话带上**（2026-10-18 真机抓到的那条）：
         * 光说「部分分片失败」，`level:(ERROR` 这种少一个括号的查询串与真的分片故障长得一样，
         * 而后者用户该找运维、前者该改自己那行字。原话是唯一能分开这两件事的东西。
         */
        ...(failedShards > 0 ? (() => {
          const reasons = shardFailureReasons(root._shards)
          return reasons.length === 0
```

</details>

#### 缺口

- 没有用户误读样本和不可变查询说明的对照。
  **影响**：不能证明增加约束与说明优于现有warnings。
  **进一步探讨**：先收集脱敏误读案例，固定同条件任务评估分母与跨页引用错误。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
