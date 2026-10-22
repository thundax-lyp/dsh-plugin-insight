# dsh-stock-market

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[02278af](https://github.com/AnacondaKC/dsh-stock-market/tree/02278af12330102c534c843a668d1c8407dbde1b)

<!-- BEGIN META -->
[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AnacondaKC/dsh-stock-market)
<!-- END META -->

> **实现功能**：在DSH侧栏显示行情，并提供沪深A股快照、走势、排行、资金流、基本面、事件、研报和资讯工具。

> **核心亮点**：把底层公开源收敛成9个业务工具，保留来源/回退/降级原因，并把会话工具目录限制与最终拒绝结合，减少任意URL拼接和只隐藏按钮的漏洞面。详见[Q02](#research-q02)。

> **风险与缺陷**：回退成功不是多源核验，fetched_at不是行情时间，degraded也不证明口径可比；会话guard依赖真实Agent和宿主契约，公开源无稳定服务保证。详见[Q03](#research-q03)。

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
  - [Q01 · 谁使用行情侧栏，合格数据结果是什么？](#detail-section-11)
  - [Q02 · 固定适配器和业务工具如何工作，贡献在哪里？](#detail-section-12)
  - [Q03 · 会话关闭、网络和输出控制可信吗，可复用什么？](#detail-section-13)
  - [Q04 · 安装、生效和失败恢复依赖什么？](#detail-section-14)
  - [Q05 · 成本和实际效果支持到哪里？](#detail-section-15)
  - [Q06 · 采用和后续假设如何判断？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人用户在DSH内获取公开证券资料并核对来源、时点和口径；不以插件查询成功替代交易或投资判断。

财经网站查询或自行编写固定接口脚本为直接参照；插件增加DSH会话内工具与侧栏，不能代替原始数据核验。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 行情/走势 | 沪深证券快照、K线和分时 | 核对行情时间、复权和来源 |
| 排行/资金流 | 市场和板块资料 | 备用统计口径可能不同，关注degraded |
| 公司/事件/研报/资讯 | 公共资料研究 | 内容来源不是独立证实或指令 |
| 会话工具开关 | 限制模型目录与实际执行 | 依赖Agent及宿主契约，不等于RPC网络总开关 |
| 行情侧栏 | 集中指数/资产/资讯观察 | 资源刷新和缓存各不相同，不保证实时服务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=22.19、Cordis及DSH peer接口 | 包声明必需 | 宿主插件、工具和RPC | optional peer表示安装层非硬依赖，不等于运行可无接口 |
| agents/connection/tools及settings | 入口与分支必需 | 工具注册、会话状态和配置 | 注入不满足会影响对应接线 |
| web客户端布局/设置/slots等包 | 侧栏需要 | 行情、会话开关与配置UI | 不能仅靠宿主工具证明UI可用 |
| 本地DSH工作区与构建工具 | 源码安装需要 | 链接peer并构建lib | README不把公共npm依赖当完整构建来源 |
| 外网访问固定财经Host | 行情操作需要 | 公开数据请求 | 无凭据不等于无网络和限流 |
| 合法会话和证券参数 | 工具操作需要 | 沪深A股范围查询 | 未声明action/URL等自由输入拒绝 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户确认固定源码、DSH工作区和构建产物 | 不把README安装行当已可直接加载源码 |
| 加载 | 构建校验后link安装到web profile | 宿主工具、RPC和侧栏分别可用 |
| 控制 | 按会话开关工具，核对日志恢复与目录限制 | 工具关闭后旧调用应受guard检查 |
| 查阅 | 核对来源、market_time与degraded | 缺失/降级时回来源复核 |
| 恢复 | 源失败接受有限回退或等待，退出用插件设置 | 不反复新会话或高频重试绕过上游约束 |

当前enabled=false保留配置RPC，便于重新打开，不代表所有网络能力被彻底卸载。源码build到lib的产物与实际安装包应另核对，本轮不运行build、live烟测或宿主。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地依赖/构建与宿主资源；金额未知 | 链接本地DSH工作区、构建、安装、确认兼容 | 无本轮安装耗时 |
| 持续使用 | 多类定时刷新、公共HTTP和模型工具输出 | 复核源、时间、降级及口径 | 模型token与网络量没有任务计量 |
| 失败恢复 | 排队、退避、换源或重新查询 | 区分取消/参数错误/上游失败及不可比数据 | 有限重试减少无界调用但不保证办结 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话内查询 | 9工具组织多源业务动作 | 相对浏览器查询的净节时 |
| 调用面约束 | 固定参数/Host、响应和最终输出上限 | 真实宿主全部策略行为 |
| 降级透明 | source/attempted/degraded/warnings | 不同源同口径误差和实时性 |

侧栏5秒刷新不是所有资源统一频率，源码对指数、全球资产、成交额、资讯等分别设置间隔，并对休市和失败退避。RPC还有不同TTL缓存，获取时间可新而市场时间旧。业务工具超时与各供应商deadline也不同，排队/回退会影响最后能获得哪些结果。没有真实任务成功率、独立数据对照和人工时间，不给投资收益、成本节省或稳定性百分比。

> **思考**：回退成功不是多源核验，fetched_at不是行情时间，degraded也不证明口径可比；会话guard依赖真实Agent和宿主契约，公开源无稳定服务保证。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把底层公开源收敛成9个业务工具，保留来源/回退/降级原因，并把会话工具目录限制与最终拒绝结合，减少任意URL拼接和只隐藏按钮的漏洞面。详见[Q02](#research-q02)。

把底层公开源收敛成9个业务工具，保留来源/回退/降级原因，并把会话工具目录限制与最终拒绝结合，减少任意URL拼接和只隐藏按钮的漏洞面。详见[Q02](#research-q02)。

会话级关闭有多层支持。最近一条stock-market/tool-access日志决定状态；禁用先安装agent.ctx.tools.restrict，再append事件，append失败会撤回新限制。执行前middleware和最终guard再次检查，能阻止旧请求里仍带的工具名称；恢复/新Agent创建时重建限制，销毁时释放。这比只隐藏按钮或只从下一次工具目录移除更完整，是可借鉴的策略分层。

边界是guard只对9个固定工具名且exec.agent存在的执行做会话判断，它不是整个进程或RPC的网络总开关。宿主需要正确提供Agent、tools.restrict和事件持久化语义，未核查实际固定宿主就不能写成已通过的权限保证。侧栏独立RPC与模型工具开关的范围也不同，用户关工具不意味着侧栏停止查行情。

网络有固定请求、拒绝重定向、并发/启动间隔、超时、有限重试和响应大小上限；这些约束资源和任意请求面，不证明公开接口有SLA或内容正确。fetched_at是获取时间，market_time可能缺失，两者不能互换。fallback只有成功响应时返回一次数据，不是多源交叉核验，degraded=false也不能推断与首选数值一致。新闻/研报为外部内容，模型需将其视为材料而非执行指令。本次没有复现权限绕过或数据错误。

<a id="detail-section-5"></a>

### 1.4 主要限制

回退成功不是多源核验，fetched_at不是行情时间，degraded也不证明口径可比；会话guard依赖真实Agent和宿主契约，公开源无稳定服务保证。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

资料查阅者可先限定小样本受控试用，与原来源核对时间和口径，检查会话关闭；降级无法解释或旧数据误导时停止依赖，不作为交易依据。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持固定接口治理、多源降级与会话访问分层贡献；实时性/口径和真实宿主行为未验收；数据适用性收据为未实现假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/stock-tools.ts、src/stock-agent-contract.ts、src/stock-agent-service.ts、src/stock-tool-access.ts、src/stock-api/public-service.ts、src/stock-api/request-control.ts、src/client/StockMarketView.tsx、src/rpc.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码检查入口、9工具契约、代表查询及回退、会话访问、公开源请求控制、RPC缓存和侧栏刷新；未逐一审计全部57接口，未执行代码或实时行情任务。
- 下一步：进一步探讨可从同证券同交易时点不同源/复权样本核对适用性，并以跨会话、恢复和过期请求验证关闭策略。

**分析版本**

- **仓库**：[AnacondaKC/dsh-stock-market](https://github.com/AnacondaKC/dsh-stock-market)
- **版本号**：0.2.0（[固定提交 02278af](https://github.com/AnacondaKC/dsh-stock-market/tree/02278af12330102c534c843a668d1c8407dbde1b)）
- **版本日期**：2026-08-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索按原问题时效/口径需求生成数据适用性收据，以固定陈旧、缺时间及跨复权样本比较误用与解释成本；未实现。详见[Q06](#research-q06)。

进一步探讨可从同证券同交易时点不同源/复权样本核对适用性，并以跨会话、恢复和过期请求验证关闭策略。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 123 | — | — | 1470 |
| .mjs | source | 8 | 356 | 316 | 2 | — |
| .ts | source | 29 | 8421 | 7676 | 171 | — |
| .tsx | source | 7 | 2123 | 1953 | 12 | — |
| .ts | test | 11 | 2892 | 2135 | 589 | — |
| .tsx | test | 5 | 837 | 737 | 4 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=grey&logo=github&style=flat)](https://github.com/AnacondaKC/dsh-stock-market/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AnacondaKC/dsh-stock-market/issues?q=is%3Aissue+created%3A2026-09-22T05%3A03%3A17.682Z..2026-10-22T05%3A03%3A17.682Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AnacondaKC/dsh-stock-market/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A03%3A17.682Z..2026-10-22T05%3A03%3A17.682Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**判断固定版本沪深行情插件的接口治理、会话控制与资料查阅价值。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用行情侧栏，合格数据结果是什么？

**研究主题：**场景与需求

#### 完整回答

面向在DSH内查看沪深A股公开行情、做资料整理和模型辅助研究的个人用户。插件提供行情侧栏与9个业务工具，查询快照、K线、排行、资金流、基本面、公告、研报、资讯和能力口径。侧栏还显示部分全球资产，不应把界面覆盖直接解释成工具支持全球证券。

合格的数据结果应有明确证券代码、来源、数据时间与获取时间、范围/复权/排序等口径，以及是否使用备用源和降级警告。一次接口返回JSON或模型生成分析不代表资料完整，更不代表投资结论正确。原有办法是访问财经网站或写接口脚本，插件增加会话内结构化查询与可控工具开关，没有下单或交易执行链。

用途是数据查阅与研究辅助，不将公开网站接口可访问性解释成正式数据授权、实时性保证或交易依据。本轮只研究固定源码，不获取当前市场事实，也不评价任何证券。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-10](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/README.md#L3-L10)

作者定位侧栏、免费工具与会话开关。

```text
DSH 的沪深 A 股行情侧栏和固定免费股票数据工具插件。

## 功能

- 右侧“行情”侧栏：顶部信息区展示上证指数、恒生指数、纳斯达克、韩国综合、日经指数、布伦特原油和纽约金主连的最新价与涨跌，支持横向滚动；侧栏支持收起、拖拽或键盘调整宽度及会话级状态保存。
- A 股行情快照：上证指数、深证成指、创业板指和科创综指来自腾讯实时行情，5 秒刷新；两市成交额与上一交易日同期比较，财经资讯来自东方财富。
- 数据接口设置：展示全部免费数据源和已接入的固定接口目录，无需配置凭据。
- 会话级股票工具开关：输入框工具行可启用或关闭全部股票工具，状态随会话日志持久化。
```

**依据 2 · 源码核查**：[src/stock-agent-contract.ts:3-22](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/stock-agent-contract.ts#L3-L22)

9工具与action的fallback口径是固定契约。

<details>
<summary>查看原文（20行）</summary>

```text
export const STOCK_AGENT_TOOL_NAMES = [
  'stock_quote',
  'stock_chart',
  'stock_ranking',
  'stock_money_flow',
  'stock_fundamentals',
  'stock_events',
  'stock_research',
  'stock_news',
  'stock_capabilities',
] as const

export type StockAgentToolName = typeof STOCK_AGENT_TOOL_NAMES[number]

export interface StockActionDefinition {
  readonly name: string
  readonly summary: string
  readonly parameters: readonly string[]
  readonly sources: readonly StockDataProvider[]
  readonly fallback: 'equivalent' | 'methodology' | 'none'
```

</details>

**依据 3 · 源码核查**：[src/stock-agent-service.ts:869-877](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/stock-agent-service.ts#L869-L877)

结果含source、attempted_sources、fallback/degraded和fetched_at。

```text
        return {
          action,
          source: response.provider,
          attempted_sources: attempted,
          fallback_used: fallbackUsed,
          degraded: candidate.degraded === true,
          fetched_at: response.fetchedAt,
          data,
          warnings,
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 固定适配器和业务工具如何工作，贡献在哪里？

**研究主题：**功能与机制、贡献与相对优势

#### 完整回答

宿主依赖agents/connection/tools，settings分支创建配置scope与StockApiService。有效enabled才注册工具和会话访问服务，RPC始终挂载以便关闭后仍能进入设置。工具层提供9个业务定义，action和业务参数分别验证，不把底层URL/Host/endpoint自由交给模型。

StockAgentService将一个action映射成有顺序的Candidate列表，source=auto时尝试这些候选，显式source则筛为指定供应商。执行前适配器验证参数、构造固定Host和Referer请求，按JSON/JSONP/GBK/页面型返回解析并做业务范围检查；结果规范化字段与记录数后回传。可回退错误才转下一候选，取消和非法请求不应被当可恢复源失败；回退会带已尝试源及警告。

贡献是把几十个底层免费接口收敛为稳定业务工具，并显式区分字段统一与统计口径不同。相较让模型直接拼财经URL，固定参数面缩小请求能力；相较简单故障切换，degraded和warning保留“不等价备用”信息。市场数据和原始接口归上游，常规适配与治理不是新行情算法，也没有证明因此提高分析准确性。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:21-41](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/index.ts#L21-L41)

工具按enabled注册，RPC保持可用以恢复设置。

<details>
<summary>查看原文（21行）</summary>

```text
export function apply(ctx: Context, config: StockMarketPluginConfig): void {
  ctx.inject(['settings'], (settingsCtx) => {
    const configScope = registerStockMarketConfig(settingsCtx.settings, config)
    const effective = configScope.get()

    // The RPC channel is always mounted so the browser config card stays
    // reachable while the plugin is disabled — otherwise the master switch
    // would lock the plugin off with no UI path back (only YAML edits).
    const stockApi = new StockApiService()
    let toolAccess: StockToolAccessService | undefined
    if (effective.enabled) {
      registerStockMarketTools(ctx, stockApi)
      toolAccess = new StockToolAccessService(ctx as never, effective.toolsEnabledByDefault)
    }
    ctx.effect(() => registerStockMarketRpc(ctx.connection, {
      stockApiService: stockApi,
      toolAccess,
      config,
      configScope,
      enabled: effective.enabled,
    }), 'dsh-stock-market: RPC channel')
```

</details>

**依据 2 · 源码核查**：[src/stock-tools.ts:17-51](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/stock-tools.ts#L17-L51)

业务工具定义、固定action参数和取消signal传递。

<details>
<summary>查看原文（35行）</summary>

```text
export function createStockMarketTools(service: StockApiService): ToolDefinition[] {
  const agent = new StockAgentService(service)
  return [
    defineTool({
      name: 'stock_quote',
      description: '查询沪深 A 股实时行情快照。证券代码统一使用 600519.SH 或 000001.SZ；默认自动选择并切换免费数据源。',
      parameters: {
        action: { type: 'string', required: true, enum: ['snapshot'], description: '固定为 snapshot。' },
        symbols: { type: 'array', required: true, items: { type: 'string' }, description: '证券代码数组，最多 60 个；full 最多 20 个。' },
        detail: { type: 'string', enum: ['basic', 'full'], description: 'basic 返回核心价格；full 增加开高低、成交量额和换手率。默认 basic。' },
        source: sourceSchema(),
      },
      output: jsonOutput(),
      timeoutMs: 25_000,
      isConcurrencySafe: () => true,
      execute: async (args, exec) => stringify(await agent.execute('stock_quote', args, exec.signal)),
    }),
    defineTool({
      name: 'stock_chart',
      description: '查询标准化 K 线或分时走势。action=kline 使用周期和复权参数；action=intraday 使用 days。默认自动故障切换。',
      parameters: {
        action: { type: 'string', required: true, enum: ['kline', 'intraday'], description: 'kline 或 intraday。' },
        symbol: symbolSchema(),
        period: { type: 'string', enum: ['1m', '5m', '15m', '30m', '60m', 'day', 'week', 'month'], description: 'K 线周期，默认 day；仅 kline。' },
        adjust: { type: 'string', enum: ['none', 'qfq', 'hfq'], description: '不复权、前复权或后复权，默认 qfq；仅 kline。' },
        start_date: { type: 'string', description: '开始日期 yyyy-MM-dd；仅 kline。' },
        end_date: { type: 'string', description: '结束日期 yyyy-MM-dd；仅 kline。' },
        days: { type: 'integer', enum: [1, 5], description: '1 日或 5 日；仅 intraday，默认 1。' },
        limit: { type: 'integer', description: '返回完整记录数，1 到 300。' },
        source: sourceSchema(),
      },
      output: jsonOutput(),
      timeoutMs: 25_000,
      isConcurrencySafe: () => true,
      execute: async (args, exec) => stringify(await agent.execute('stock_chart', args, exec.signal)),
```

</details>

**依据 3 · 源码核查**：[src/stock-api/public-service.ts:150-162](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/stock-api/public-service.ts#L150-L162)

验证、固定request、解析和范围限制链。

<details>
<summary>查看原文（13行）</summary>

```text
  async execute(
    endpoint: DocumentedPublicEndpoint,
    parameters: unknown,
    signal: AbortSignal,
  ): Promise<StockApiJson> {
    throwIfAborted(signal)
    const normalized = validateParameters(endpoint, parameters)
    const request = buildRequest(endpoint, normalized)
    const label = PROVIDER_LABELS[endpoint.provider]
    const text = await this.executeRequest(endpoint.provider, request, signal)
    const parsed = parseResponse(request.responseKind, text, label)
    validateBusinessResponse(endpoint, normalized, parsed)
    return boundJson(restrictResponseToPluginScope(endpoint, normalized, parsed))
```

</details>

**依据 4 · 源码核查**：[src/stock-agent-service.ts:842-887](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/stock-agent-service.ts#L842-L887)

source选择、错误分类、回退及降级标记。

<details>
<summary>查看原文（46行）</summary>

```text
  private async runCandidates(
    action: string,
    source: SourceChoice,
    candidates: readonly Candidate[],
    signal: AbortSignal,
  ): Promise<StockAgentResult> {
    const selected = source === 'auto' ? candidates : candidates.filter(candidate => candidate.provider === source)
    if (selected.length === 0) {
      throw badRequest(`${action} 不支持 source=${source} 或当前参数组合。`)
    }
    const attempted: StockDataProvider[] = []
    let failures = 0
    let previousProvider: StockDataProvider | undefined
    let lastFallbackError: StockApiError | undefined
    for (const candidate of selected) {
      if (!attempted.includes(candidate.provider)) attempted.push(candidate.provider)
      try {
        const response = await this.executeCandidate(candidate, signal)
        const data = candidate.normalize(response.data)
        const fallbackUsed = failures > 0
        const warnings: string[] = []
        if (fallbackUsed) {
          warnings.push(previousProvider === candidate.provider
            ? `首选数据适配路径不可用，已使用 ${providerLabel(candidate.provider)} 的备用路径。`
            : `首选免费数据源不可用，已切换至 ${providerLabel(candidate.provider)}。`)
        }
        if (candidate.warning !== undefined) warnings.push(candidate.warning)
        return {
          action,
          source: response.provider,
          attempted_sources: attempted,
          fallback_used: fallbackUsed,
          degraded: candidate.degraded === true,
          fetched_at: response.fetchedAt,
          data,
          warnings,
        }
      } catch (error) {
        if (isFatalError(error) || !isFallbackError(error)) throw error
        failures++
        previousProvider = candidate.provider
        lastFallbackError = error
      }
    }
    if (source !== 'auto' && lastFallbackError !== undefined) throw lastFallbackError
    throw new StockApiError(`${action} 的免费数据源暂时不可用。`, 'unavailable')
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 会话关闭、网络和输出控制可信吗，可复用什么？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

会话级关闭有多层支持。最近一条stock-market/tool-access日志决定状态；禁用先安装agent.ctx.tools.restrict，再append事件，append失败会撤回新限制。执行前middleware和最终guard再次检查，能阻止旧请求里仍带的工具名称；恢复/新Agent创建时重建限制，销毁时释放。这比只隐藏按钮或只从下一次工具目录移除更完整，是可借鉴的策略分层。

边界是guard只对9个固定工具名且exec.agent存在的执行做会话判断，它不是整个进程或RPC的网络总开关。宿主需要正确提供Agent、tools.restrict和事件持久化语义，未核查实际固定宿主就不能写成已通过的权限保证。侧栏独立RPC与模型工具开关的范围也不同，用户关工具不意味着侧栏停止查行情。

网络有固定请求、拒绝重定向、并发/启动间隔、超时、有限重试和响应大小上限；这些约束资源和任意请求面，不证明公开接口有SLA或内容正确。fetched_at是获取时间，market_time可能缺失，两者不能互换。fallback只有成功响应时返回一次数据，不是多源交叉核验，degraded=false也不能推断与首选数值一致。新闻/研报为外部内容，模型需将其视为材料而非执行指令。本次没有复现权限绕过或数据错误。

#### 证据与依据

**依据 1 · 源码核查**：[src/stock-tool-access.ts:45-54](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/stock-tool-access.ts#L45-L54)

目录限制、pre-execute及最终guard组合。

<details>
<summary>查看原文（10行）</summary>

```text
    ctx.effect(() => () => { this.disposeRestrictions() }, 'dsh-stock-market: tool restrictions')
    for (const agent of ctx.agents.list()) this.syncRestriction(agent)

    ctx.on('agent/created', ({ agent }) => { this.syncRestriction(agent) })
    ctx.on('agent/disposed', ({ agent }) => { this.liftRestriction(agent) })
    ctx.on('tools/pre-execute', async (exec, next) => {
      const reason = this.guardReason(exec)
      return reason === undefined ? next() : { kind: 'deny', reason }
    })
    ctx.tools.guard(exec => this.guardReason(exec))
```

</details>

**依据 2 · 源码核查**：[src/stock-tool-access.ts:63-84](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/stock-tool-access.ts#L63-L84)

禁用先限制再追加日志，失败补偿；启用先记事件再释放。

<details>
<summary>查看原文（22行）</summary>

```text
  setBySessionId(sessionId: string, enabled: boolean): boolean {
    const agent = this.requireAgent(sessionId)
    const current = foldStockToolAccess(agent.session.events, this.defaultEnabled)
    if (current === enabled) {
      this.syncRestriction(agent)
      return current
    }

    if (!enabled) {
      const installed = this.installRestriction(agent)
      try {
        appendAccessEvent(agent, false)
      } catch (error) {
        if (installed) this.liftRestriction(agent)
        throw error
      }
      return false
    }

    appendAccessEvent(agent, true)
    this.liftRestriction(agent)
    return true
```

</details>

**依据 3 · 源码核查**：[src/stock-tool-access.ts:127-137](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/stock-tool-access.ts#L127-L137)

guard依赖exec.agent，日志append持久化意图。

<details>
<summary>查看原文（11行）</summary>

```text
  private guardReason(exec: Readonly<ToolExecution>): string | undefined {
    if (!STOCK_TOOL_NAME_SET.has(exec.name) || exec.agent === undefined) return undefined
    return foldStockToolAccess(exec.agent.session.events, this.defaultEnabled) ? undefined : DISABLED_REASON
  }
}

function appendAccessEvent(agent: StockAgent, enabled: boolean): void {
  const session = agent.session as unknown as {
    append(type: string, data: { enabled: boolean }): unknown
  }
  session.append(STOCK_TOOL_ACCESS_EVENT, { enabled })
```

</details>

**依据 4 · 源码核查**：[src/stock-api/public-service.ts:240-274](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/stock-api/public-service.ts#L240-L274)

固定GET、redirect:error、有限重试及取消。

<details>
<summary>查看原文（35行）</summary>

```text
    for (let attempt = 0; attempt < 3; attempt++) {
      throwIfAborted(signal)
      await startGate.wait(signal, this.sleep)
      const fallbackUrls = request.fallbackUrls ?? []
      const requestUrl = attempt === 0 || fallbackUrls.length === 0
        ? request.url
        : fallbackUrls[Math.min(attempt - 1, fallbackUrls.length - 1)]
      try {
        const response = await fetcher(requestUrl, {
          method: 'GET',
          headers: request.headers,
          redirect: 'error',
          signal,
        })
        if (response.ok) {
          return await readBoundedText(response, request.encoding, request.maxResponseBytes ?? MAX_RESPONSE_BYTES)
        }
        try {
          await response.body?.cancel()
        } catch {
          // The HTTP status remains authoritative if cancellation fails.
        }
        if (attempt < 2 && RETRYABLE_STATUSES.has(response.status)) {
          await this.sleep(1_000 * (2 ** attempt), signal)
          continue
        }
        throw new StockApiError(`${label}请求失败：HTTP ${response.status}。`)
      } catch (error) {
        if (signal.aborted) throw new StockApiError('请求已取消。', 'cancelled')
        if (error instanceof StockApiError) throw error
        if (attempt < 2) {
          await this.sleep(1_000 * (2 ** attempt), signal)
          continue
        }
        throw new StockApiError(`${label}网络请求失败。`)
```

</details>

**依据 5 · 源码核查**：[src/stock-agent-service.ts:936-944](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/stock-agent-service.ts#L936-L944)

market_time独立字段，不能用fetched_at替代。

```text
    const base: JsonRecord = {
      symbol: symbol.canonical,
      name,
      price,
      previous_close: previousClose,
      change: change ?? calculateChange(price, previousClose),
      change_percent: changePercent ?? calculateChangePercent(price, previousClose),
      market_time: quoteTime(provider, row),
    }
```

#### 缺口

- 没有固定宿主环境对restrictions、事件恢复与过期调用的独立验收。
  **影响：**源码策略分层不能当真实运行权限已证实。
  **进一步探讨：**进一步探讨可先检查宿主执行管线与恢复事件，再以旧请求/跨会话/禁用追加失败核对边界。
- 公开源新鲜度、语义一致性和持久可用性缺少同时间对照。
  **影响：**不能把回退成功当作数据同等可信或有稳定服务保证。
  **进一步探讨：**可用同证券、同交易时点、同复权/窗口的样本比对原始来源与规范化结果，记录缺字段和延迟。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、生效和失败恢复依赖什么？

**研究主题：**依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=22.19、Cordis及DSH peer接口 | 包声明必需 | 宿主插件、工具和RPC | optional peer表示安装层非硬依赖，不等于运行可无接口 |
| agents/connection/tools及settings | 入口与分支必需 | 工具注册、会话状态和配置 | 注入不满足会影响对应接线 |
| web客户端布局/设置/slots等包 | 侧栏需要 | 行情、会话开关与配置UI | 不能仅靠宿主工具证明UI可用 |
| 本地DSH工作区与构建工具 | 源码安装需要 | 链接peer并构建lib | README不把公共npm依赖当完整构建来源 |
| 外网访问固定财经Host | 行情操作需要 | 公开数据请求 | 无凭据不等于无网络和限流 |
| 合法会话和证券参数 | 工具操作需要 | 沪深A股范围查询 | 未声明action/URL等自由输入拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户确认固定源码、DSH工作区和构建产物 | 不把README安装行当已可直接加载源码 |
| 加载 | 构建校验后link安装到web profile | 宿主工具、RPC和侧栏分别可用 |
| 控制 | 按会话开关工具，核对日志恢复与目录限制 | 工具关闭后旧调用应受guard检查 |
| 查阅 | 核对来源、market_time与degraded | 缺失/降级时回来源复核 |
| 恢复 | 源失败接受有限回退或等待，退出用插件设置 | 不反复新会话或高频重试绕过上游约束 |

当前enabled=false保留配置RPC，便于重新打开，不代表所有网络能力被彻底卸载。源码build到lib的产物与实际安装包应另核对，本轮不运行build、live烟测或宿主。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:50-69](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/package.json#L50-L69)

Node及主要peer版本声明。

<details>
<summary>查看原文（20行）</summary>

```text
  },
  "engines": {
    "node": ">=22.19.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1-rc.4",
    "@deepseek-ai/dsh-client-connection": "^0.0.1-rc.5",
    "@deepseek-ai/dsh-client-runtime": "^0.0.1-rc.5",
    "@deepseek-ai/dsh-client-ui-conversation": "^0.0.1-rc.5",
    "@deepseek-ai/dsh-client-ui-primitives": "^0.0.1-rc.5",
    "@deepseek-ai/dsh-client-ui-settings": "^0.0.1-rc.5",
    "@deepseek-ai/dsh-client-ui-settings-plugins": "^0.0.1-rc.5",
    "@deepseek-ai/dsh-client-ui-slots": "^0.0.1-rc.5",
    "@deepseek-ai/dsh-settings": "^0.0.1-rc.5",
    "@deepseek-ai/dsh-tools": "^0.0.1-rc.5",
    "@deepseek-ai/schemastery": "^3.18.1-rc.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "peerDependenciesMeta": {
```

</details>

**依据 2 · 作者声明**：[README.md:67-79](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/README.md#L67-L79)

作者说明本地工作区依赖及开发检查入口。

<details>
<summary>查看原文（13行）</summary>

````text

```bash
npm run typecheck
npm test
npm run build
npm run verify:package
```

`npm run build` 会先构建到同文件系统的暂存目录、验证产物和清单，然后以原子交换方式提升为 `lib/`；在不支持原子交换的平台上会使用可回滚的提升流程。`prepack` 会执行完整离线质量门禁并校验实际 `.tgz` 解包内容。

真实公开源烟测默认关闭，避免常规测试依赖网络：

```bash
````

</details>

**依据 3 · 源码核查**：[src/index.ts:21-41](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/index.ts#L21-L41)

关闭时仍保留配置RPC。

<details>
<summary>查看原文（21行）</summary>

```text
export function apply(ctx: Context, config: StockMarketPluginConfig): void {
  ctx.inject(['settings'], (settingsCtx) => {
    const configScope = registerStockMarketConfig(settingsCtx.settings, config)
    const effective = configScope.get()

    // The RPC channel is always mounted so the browser config card stays
    // reachable while the plugin is disabled — otherwise the master switch
    // would lock the plugin off with no UI path back (only YAML edits).
    const stockApi = new StockApiService()
    let toolAccess: StockToolAccessService | undefined
    if (effective.enabled) {
      registerStockMarketTools(ctx, stockApi)
      toolAccess = new StockToolAccessService(ctx as never, effective.toolsEnabledByDefault)
    }
    ctx.effect(() => registerStockMarketRpc(ctx.connection, {
      stockApiService: stockApi,
      toolAccess,
      config,
      configScope,
      enabled: effective.enabled,
    }), 'dsh-stock-market: RPC channel')
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 成本和实际效果支持到哪里？

**研究主题：**效果与总成本

#### 完整回答

合格任务是取得适用于本次资料问题的正确证券数据并能解释口径与时间。没有交易或收益验证，不能用“行情可见”推断经济收益。每源限流和输出上限能控制局部资源，但不等于用户总时间成本。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地依赖/构建与宿主资源；金额未知 | 链接本地DSH工作区、构建、安装、确认兼容 | 无本轮安装耗时 |
| 持续使用 | 多类定时刷新、公共HTTP和模型工具输出 | 复核源、时间、降级及口径 | 模型token与网络量没有任务计量 |
| 失败恢复 | 排队、退避、换源或重新查询 | 区分取消/参数错误/上游失败及不可比数据 | 有限重试减少无界调用但不保证办结 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话内查询 | 9工具组织多源业务动作 | 相对浏览器查询的净节时 |
| 调用面约束 | 固定参数/Host、响应和最终输出上限 | 真实宿主全部策略行为 |
| 降级透明 | source/attempted/degraded/warnings | 不同源同口径误差和实时性 |

侧栏5秒刷新不是所有资源统一频率，源码对指数、全球资产、成交额、资讯等分别设置间隔，并对休市和失败退避。RPC还有不同TTL缓存，获取时间可新而市场时间旧。业务工具超时与各供应商deadline也不同，排队/回退会影响最后能获得哪些结果。没有真实任务成功率、独立数据对照和人工时间，不给投资收益、成本节省或稳定性百分比。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/StockMarketView.tsx:86-93](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/client/StockMarketView.tsx#L86-L93)

按资源分别设置刷新、空闲与最大退避。

```text
const INDICES_POLL_INTERVAL_MS = 5_000
const GLOBAL_QUOTES_POLL_INTERVAL_MS = 10_000
const TURNOVER_POLL_INTERVAL_MS = 10_000
const LIVE_MARKET_POLL_INTERVAL_MS = 30_000
const NEWS_POLL_INTERVAL_MS = 60_000
const HOTSPOTS_POLL_INTERVAL_MS = 60_000
const IDLE_INDICES_POLL_INTERVAL_MS = 60_000
const MAX_POLL_BACKOFF_MS = 5 * 60_000
```

**依据 2 · 源码核查**：[src/rpc.ts:81-87](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/rpc.ts#L81-L87)

RPC缓存TTL与客户端刷新独立。

```text
const TENCENT_INDICES_CACHE_TTL_MS = 5_000
const SINA_GLOBAL_QUOTES_CACHE_TTL_MS = 10_000
const TENCENT_TURNOVER_CACHE_TTL_MS = 10_000
const EASTMONEY_BREADTH_CACHE_TTL_MS = 30_000
const EASTMONEY_TRENDS_CACHE_TTL_MS = 30_000
const EASTMONEY_MOVERS_CACHE_TTL_MS = 30_000
const EASTMONEY_HOTSPOTS_CACHE_TTL_MS = 60_000
```

**依据 3 · 源码核查**：[src/stock-api/public-service.ts:135-162](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/stock-api/public-service.ts#L135-L162)

每源并发与启动间隔，以及响应范围约束。

<details>
<summary>查看原文（28行）</summary>

```text
export class PublicWebsiteApiService {
  private readonly fetcher: typeof fetch | undefined
  private readonly sleep: (milliseconds: number, signal: AbortSignal) => Promise<void>
  private readonly gates: Readonly<Record<DocumentedProvider, ProviderGate>> = {
    eastmoney: new ProviderGate(2, 500),
    tencent: new ProviderGate(4, 100),
    sina: new ProviderGate(2, 300),
    tonghuashun: new ProviderGate(1, 500),
  }

  constructor(options: PublicWebsiteApiServiceOptions = {}) {
    this.fetcher = options.fetcher ?? globalThis.fetch
    this.sleep = options.sleep ?? sleepWithSignal
  }

  async execute(
    endpoint: DocumentedPublicEndpoint,
    parameters: unknown,
    signal: AbortSignal,
  ): Promise<StockApiJson> {
    throwIfAborted(signal)
    const normalized = validateParameters(endpoint, parameters)
    const request = buildRequest(endpoint, normalized)
    const label = PROVIDER_LABELS[endpoint.provider]
    const text = await this.executeRequest(endpoint.provider, request, signal)
    const parsed = parseResponse(request.responseKind, text, label)
    validateBusinessResponse(endpoint, normalized, parsed)
    return boundJson(restrictResponseToPluginScope(endpoint, normalized, parsed))
```

</details>

**依据 4 · 源码核查**：[src/stock-api/request-control.ts:18-31](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/stock-api/request-control.ts#L18-L31)

排队启动和取消保留顺序，不等于立即执行。

<details>
<summary>查看原文（14行）</summary>

```text
  async wait(signal: AbortSignal, sleep: AbortableSleep): Promise<void> {
    throwIfAborted(signal)
    const ticket = this.tail.then(async () => {
      throwIfAborted(signal)
      const delay = Math.max(0, this.nextStartAt - Date.now())
      if (delay > 0) await sleep(delay, signal)
      throwIfAborted(signal)
      this.nextStartAt = Date.now() + this.minimumIntervalMs
    })

    // Keep the queue alive after cancellation or transport failure. The
    // caller can still stop waiting immediately through waitForSignal().
    this.tail = ticket.then(() => undefined, () => undefined)
    await waitForSignal(ticket, signal)
```

</details>

#### 缺口

- 没有同时间独立数据对照和同任务人工/模型/网络成本记录。
  **影响：**无法证明多源插件整体更准确、更省时或能稳定支撑特定研究任务。
  **进一步探讨：**可从同代码同时间窗口的固定资料任务入手，分别比较字段正确率、降级可解释性、人工时间和输出token。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 采用和后续假设如何判断？

**研究主题：**新假设与验证、采用判断

#### 完整回答

建议试用，适合把它当公开资料入口、愿意核对来源时间与降级提示的DSH个人研究使用者。固定工具面、会话恢复与分层guard提供可控路径，但没有真实源烟测或同版本宿主验收，不能给值得安装结论。尤其不要把免费接口、自动回退或模型报告当成可直接执行的交易判断。

受控试用可先限定少量证券与动作，比较源页面、标准代码、复权、返回记录数和market_time，测试关闭工具后旧请求被拒且其他会话保持独立。若出现默默换口径、过期数据未说明、工具关闭不阻断或接口持续失败，就停止依赖并退回原数据入口。源码不提供交易执行，业务采用结论仅覆盖资料查阅。

可以探索显式数据适用性收据，把用户所需时效/口径与返回源时间、复权、市场范围和降级原因一起比较。它比当前简单degraded布尔更明确“这份结果是否还能回答原问题”，但增加字段契约与维护负担。最小对照可用陈旧行情、缺时间、不同复权、排行范围变化和源故障样本，比较读者识别不适用结果的正确率及解释时间。若更多标记只添噪声、不减误用，应否定收益。这个收据未实现，不计入现有创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/stock-agent-service.ts:842-877](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/stock-agent-service.ts#L842-L877)

当前来源和degraded/warnings是适用性收据的起点。

<details>
<summary>查看原文（36行）</summary>

```text
  private async runCandidates(
    action: string,
    source: SourceChoice,
    candidates: readonly Candidate[],
    signal: AbortSignal,
  ): Promise<StockAgentResult> {
    const selected = source === 'auto' ? candidates : candidates.filter(candidate => candidate.provider === source)
    if (selected.length === 0) {
      throw badRequest(`${action} 不支持 source=${source} 或当前参数组合。`)
    }
    const attempted: StockDataProvider[] = []
    let failures = 0
    let previousProvider: StockDataProvider | undefined
    let lastFallbackError: StockApiError | undefined
    for (const candidate of selected) {
      if (!attempted.includes(candidate.provider)) attempted.push(candidate.provider)
      try {
        const response = await this.executeCandidate(candidate, signal)
        const data = candidate.normalize(response.data)
        const fallbackUsed = failures > 0
        const warnings: string[] = []
        if (fallbackUsed) {
          warnings.push(previousProvider === candidate.provider
            ? `首选数据适配路径不可用，已使用 ${providerLabel(candidate.provider)} 的备用路径。`
            : `首选免费数据源不可用，已切换至 ${providerLabel(candidate.provider)}。`)
        }
        if (candidate.warning !== undefined) warnings.push(candidate.warning)
        return {
          action,
          source: response.provider,
          attempted_sources: attempted,
          fallback_used: fallbackUsed,
          degraded: candidate.degraded === true,
          fetched_at: response.fetchedAt,
          data,
          warnings,
```

</details>

**依据 2 · 源码核查**：[src/stock-agent-service.ts:936-944](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/stock-agent-service.ts#L936-L944)

行情时间可独立用于时效约束。

```text
    const base: JsonRecord = {
      symbol: symbol.canonical,
      name,
      price,
      previous_close: previousClose,
      change: change ?? calculateChange(price, previousClose),
      change_percent: changePercent ?? calculateChangePercent(price, previousClose),
      market_time: quoteTime(provider, row),
    }
```

**依据 3 · 源码核查**：[src/stock-tool-access.ts:63-84](https://github.com/AnacondaKC/dsh-stock-market/blob/02278af12330102c534c843a668d1c8407dbde1b/src/stock-tool-access.ts#L63-L84)

受控试用的关闭/启用及失败补偿路径。

<details>
<summary>查看原文（22行）</summary>

```text
  setBySessionId(sessionId: string, enabled: boolean): boolean {
    const agent = this.requireAgent(sessionId)
    const current = foldStockToolAccess(agent.session.events, this.defaultEnabled)
    if (current === enabled) {
      this.syncRestriction(agent)
      return current
    }

    if (!enabled) {
      const installed = this.installRestriction(agent)
      try {
        appendAccessEvent(agent, false)
      } catch (error) {
        if (installed) this.liftRestriction(agent)
        throw error
      }
      return false
    }

    appendAccessEvent(agent, true)
    this.liftRestriction(agent)
    return true
```

</details>

#### 缺口

- 数据适用性收据是否减少错用或只是增加字段尚无比较。
  **影响：**仍为未验证设计，不提高当前数据可靠性或采用等级。
  **进一步探讨：**可先让读者盲判固定混淆样本，再比较适用性判断和阅读成本。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
