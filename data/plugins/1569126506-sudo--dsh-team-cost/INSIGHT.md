# dsh-team-cost

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[72f371c](https://github.com/1569126506-sudo/dsh-team-cost/tree/72f371c7cf45578791739c06b1d949e2868536dd)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1569126506-sudo/dsh-team-cost)
<!-- END META -->

> **实现功能**：从 DSH 会话事件记团队 token/成本，提供成员预算、告警和报表。

> **核心亮点**：把会话事件的 token 桶汇入成员/模型/天账本并连接预算通知、工具报告和看板；较单会话用量视图形成团队管理入口。详见[Q01](#research-q01)。

> **风险与缺陷**：rollup 不从 JSONL 重建，崩溃/缺缓存可少报；归因纯前缀可串成员，未知模型费用为 0，CSV 按天导出丢成员/模型。见[Q02](#research-q02)、[Q03](#research-q03)。 正确价/无崩溃也只是事后计量，无并发在途预留；团队全量报表访问依宿主外层授权。

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
  - [Q01 · 团队成本管家实际计量什么并提供哪些交付入口？](#detail-section-11)
  - [Q02 · 成员归因、价格与预算怎样计算，哪些配置会导致低估或错归？](#detail-section-12)
  - [Q03 · 账本与 rollup、CSV 和配额能在崩溃后保持一致吗？](#detail-section-13)
  - [Q04 · 首次、持续和失败恢复各有哪些财务与人工成本？](#detail-section-14)
  - [Q05 · 怎样验证账本精确性并减少错误拦截？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：共用 DSH 主机的团队需看成员/模型消耗并控制预算。

单会话 provider 用量/手工 CSV 汇总也可统计；此项团队归因和预算集成有增量，但没有证明准确性或节时。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 作用 | 边界 |
| --- | --- | --- |
| 计量 | 成员/模型 token 记录 | 事件覆盖/价格未验 |
| 预算 | 阈值通知/可选拦截 | 默认 off，汇总可过期 |
| 报告 | 文本/CSV/看板 | CSV 丢部分维度 |

**流程与依赖**

| 类型 | 条件 | 边界 |
| --- | --- | --- |
| 必需 | DSH session/event/agent/request 与工具接口 | 宿主覆盖未实测 |
| 配置 | cwd 归因/模型价格/成员预算 | 未知价格零、前缀串匹配 |
| 可选 | Webhook/Typert 客户端 | 通知/看板依赖外部服务 |

| 步骤 | 动作 | 合格核验 |
| --- | --- | --- |
| 配置 | 固定成员路径和价目、关闭强拦 | 路径/价目有来源 |
| 记账 | 收集事件/JSONL、导出汇总 | 对账单与子代理清单 |
| 故障 | 停机/replay/缺缓存重启 | JSONL/rollup/配额一致 |

**效果与成本**

| 阶段 | 现金/计算/外部资源 | 人工/时间 | 未知与失败恢复 |
| --- | --- | --- | --- |
| 首次 | Node/DSH、存储、可选 Webhook 服务，价格未知 | 配成员 cwd/模型价/预算与账单基准，工时未知 | npm 发布/构建、宿主事件兼容未知 |
| 持续 | 每事件 JSONL/聚合、周期 rollup、Webhook/模型工具 token，金额未知；未知模型本地记0非免费 | 维护价目/成员规则、核对官方账单和拦截，工时未知 | 调用覆盖率、模型费与节省对账时间未知 |
| 失败恢复 | 从 JSONL 纠正 rollup/重报与重复模型请求耗 IO/token，实际成本未知 | 排查少报/错归/重复与误拦，手工重建/仲裁时间未知 | 故障率、停工与错账损失未知 |

| 已实现 | 预期价值 | 边界 |
| --- | --- | --- |
| 事件账本/预算 | 团队费用可视化 | 覆盖/价格未验 |
| 报表/CSV | 汇总成本 | CSV 固定日维度 |
| Webhook/拦截 | 提醒超支 | 汇总过期可能误拦/漏拦 |

> **思考**：rollup 不从 JSONL 重建，崩溃/缺缓存可少报；归因纯前缀可串成员，未知模型费用为 0，CSV 按天导出丢成员/模型。见[Q02](#research-q02)、[Q03](#research-q03)。 正确价/无崩溃也只是事后计量，无并发在途预留；团队全量报表访问依宿主外层授权。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把会话事件的 token 桶汇入成员/模型/天账本并连接预算通知、工具报告和看板；较单会话用量视图形成团队管理入口。详见[Q01](#research-q01)。

把会话事件的 token 桶汇入成员/模型/天账本并连接预算通知、工具报告和看板；较单会话用量视图形成团队管理入口。详见[Q01](#research-q01)。

事件监听后异步 append JSONL 和更新 cells；每15秒写 rollup，启动只读缓存不重建；价格静态表及零价 fallback、cwd 前缀归因。

即使价格正确、无崩溃且成员归因准确，计量仍发生在assistant/message已产生usage之后，store.record异步完成再evaluate。agent/request只检查现有汇总，没有为在途请求预留/锁定费用；并发请求可同时读到未超预算后放行，达到阈值后也只挡后续新请求，不停止已经发起的模型或提供全局费用硬顶。

team_cost_report.execute只接range/groupBy/csv，没有调用者或成员过滤；RPC getState返回已知及有计量记录的全部成员预算/费用和模型聚合。cwd只用来归因账目，不授权谁可读团队报表。本层是全团队管理视图，目标宿主的模型工具/Remote准入须把它限定给适当管理员；外围准入未核，不能把本地无过滤直接写成已发生跨成员泄露。

<a id="detail-section-5"></a>

### 1.4 主要限制

rollup 不从 JSONL 重建，崩溃/缺缓存可少报；归因纯前缀可串成员，未知模型费用为 0，CSV 按天导出丢成员/模型。见[Q02](#research-q02)、[Q03](#research-q03)。 正确价/无崩溃也只是事后计量，无并发在途预留；团队全量报表访问依宿主外层授权。

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离 profile 先固定成员路径、模型价和真实账单对照，测试崩溃/事件 replay/相邻路径，再考虑 alert；不要以此版结算或启用强制拦截。详见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码证实事件计量接线，但 JSONL/rollup 断层、未知模型零价和前缀错归使“精确账单/强配额”未成立；未与真实账单对照。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/store.ts、src/pricing.ts、src/attribution.ts、src/quota.ts、src/report.ts、src/config.ts、src/service.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 SHA 静态审阅 README/package 与 src 计量、存储、价格、归因、配额；未运行目标宿主/测试/账单。
- 下一步：固定多成员/子代理事件和真实账单，核原始 token 桶/计价、不同路径归因；崩溃于 flush 前、删除 rollup、重复事件、未知模型、CSV 按成员参数等对照。

**分析版本**

- **仓库**：[1569126506-sudo/dsh-team-cost](https://github.com/1569126506-sudo/dsh-team-cost)
- **版本号**：0.2.1（[固定提交 72f371c](https://github.com/1569126506-sudo/dsh-team-cost/tree/72f371c7cf45578791739c06b1d949e2868536dd)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

现版声明 JSONL 真相源却不重建/去重，未知价零与路径前缀错归；若按 sid+seq 重建、缺价标 unknown、身份/路径段归因，或可降漏计/误拦，但增启动/管理成本。故障、重复、相邻路径和未知模型对照事件/账单；若误差不降或成本超阈值即证伪。详见[Q05](#research-q05)。

固定多成员/子代理事件和真实账单，核原始 token 桶/计价、不同路径归因；崩溃于 flush 前、删除 rollup、重复事件、未知模型、CSV 按成员参数等对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 193 | 163 | 17 | — |
| .md | source | 2 | 181 | — | — | 1918 |
| .mjs | source | 2 | 128 | 98 | 18 | — |
| .ts | source | 10 | 1038 | 795 | 156 | — |
| .mjs | test | 1 | 93 | 78 | 7 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1569126506-sudo/dsh-team-cost/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/1569126506-sudo/dsh-team-cost/issues?q=is%3Aissue+created%3A2026-09-22T08%3A47%3A18.698Z..2026-10-22T08%3A47%3A18.698Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1569126506-sudo/dsh-team-cost/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T08%3A47%3A18.698Z..2026-10-22T08%3A47%3A18.698Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核团队用量计量、归因与费用/预算真实性及失败恢复。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 团队成本管家实际计量什么并提供哪些交付入口？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Host 监听 session/event 中带 usage 的 assistant/message，取 session.cwd、provider/model 和 token 桶，按成员规则计价入本地 JSONL，再提供 team_cost_report/CSV、配额告警与 Web 看板；子代理若产生同类事件也会被处理。README “精确记录每一次模型调用”“子代理全部计入”和官方论坛 2.3× 是作者陈述，固定源码只能证明事件监听路径，不能证明宿主事件覆盖、无漏/重或与官方账单一致。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-23](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/README.md#L5-L23)

作者场景/全量声明。

<details>
<summary>查看原文（19行）</summary>

```text
> DeepSeek Harness 团队级 AI 用量与成本计量插件：**按成员、按项目**精确记录每一次模型调用的 token 与费用（子代理一并计入），内置成员预算、阈值告警、Webhook 通知、可选超支拦截，以及一个可以随时向 AI 查询的报表工具。

DeepSeek Harness (`dsh`) 正在被团队共用一台主机地使用，但生态里现存的 100+ 个用量插件几乎全是**单人自用仪表盘**：它们盯着自己会话的余额，回答不了团队最关心的问题——

- 这个月**每个人**花了多少钱？
- 子代理（subagent / Agent Teams 队友）的用量去哪了？（官方论坛已有团队反馈汇总口径少算 2.3×）
- 谁超预算了？超了要不要拦？

`dsh-team-cost` 只做这一件事，把它做完整。

## 功能

- **全量计量**：监听 `session/event`，从每条 `assistant/message` 读取官方 `TokenUsage`（未命中输入 / 输出 / 缓存命中 / 缓存写入 / 推理分列）。子代理会话照常上报，全部计入。
- **成员归因**：按工作空间路径前缀规则把会话归属到成员（`members=workspace` 规则，最长前缀优先）；配 `dsh-login` 每用户工作空间时每人只需一行规则。未匹配的会话归入可配置的默认成员。
- **计价**：内置 DeepSeek 2026-09 官方价目表（峰/谷价 × 人民币/美元），其他模型通过 `price-overrides.json` 配置；未配置的模型照常计 token，费用记 0。
- **成员预算**：每个成员独立的日/月费用与 token 预算，编辑 `<dataDir>/members.json` 一分钟内生效，无需重启。
- **告警**：越过 80%/100% 阈值时触发一次通知（去重），可推送 Webhook（企微/钉钉/飞书机器人直接可用）；同时派发 `dsh-team-cost/quota-exceeded` 事件给其他插件。
- **超支拦截（可选）**：`enforce: 'total'` 超过团队日预算后拦截新模型请求；`enforce: 'members'` 尝试按成员拦截（尽力而为，见配置注释）。默认只监控不拦截。
- **报表工具**：AI 工具 `team_cost_report`——问一句"出一下本月团队成本报表"即可按成员/模型/天分组统计，支持导出 CSV。
```

</details>

**依据 2 · 源码核查**：[src/index.ts:84-115](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/index.ts#L84-L115)

事件计量接线。

<details>
<summary>查看原文（32行）</summary>

```text
  // Meter one usage-bearing assistant message. The firehose delivers every
  // session — top-level or subagent — so team and teammate spend is counted
  // in full instead of being lost to single-session dashboards.
  ctx.on('session/event', (session, event) => {
    if (event.type !== 'assistant/message') return
    const usage = event.data.usage
    if (!usage) return
    const source = event.data.message.source
    const header = session.header
    const user = attribution.resolve(header.cwd)
    const record: UsageRecord = {
      t: new Date(event.time).toISOString(),
      seq: event.seq,
      sid: header.id,
      ws: header.cwd ?? '',
      user,
      provider: source.provider,
      model: source.model,
      in: usage.inputTokens ?? 0,
      out: usage.outputTokens ?? 0,
      cr: usage.cacheReadTokens,
      cw: usage.cacheWriteTokens,
      rz: usage.reasoningTokens,
      cost: Number(pricing.cost(source.model, usage).toFixed(6)),
    }
    void store
      .record(record)
      .then(() => quota.evaluate(user))
      .then((status) => {
        if (status.over) ctx.emit('dsh-team-cost/quota-exceeded', status)
      })
      .catch(onError)
```

</details>

**依据 3 · 源码核查**：[src/index.ts:118-150](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/index.ts#L118-L150)

拦截/报告/看板注册。

<details>
<summary>查看原文（33行）</summary>

```text
  if (config.enforce !== 'off') {
    ctx.on('agent/request', (payload, next) => {
      if (config.enforce === 'total') {
        if (config.totalDailyCost > 0) {
          const totals = store.totalsFor('*')
          if (totals.todayCost >= config.totalDailyCost) {
            throw new Error(
              `[dsh-team-cost] 团队今日费用已超预算 ${totals.todayCost.toFixed(2)}/${config.totalDailyCost} ${config.currency}，新请求已被拦截`,
            )
          }
        }
      } else if (config.enforce === 'members') {
        // Best-effort member resolution from the agent's session header.
        const agent = payload.agent as { session?: { header?: { cwd?: string } } } | undefined
        const user = attribution.resolve(agent?.session?.header?.cwd)
        if (quota.isBlocked(user)) {
          throw new Error(
            `[dsh-team-cost] 成员 ${user} 已超出预算，新请求已被拦截（调整 <dataDir>/members.json 后一分钟内生效）`,
          )
        }
      }
      return next()
    })
  }

  ctx.tools.register(createReportTool({ store, currency: config.currency }))

  // RPC 服务:Web 看板经 remote.teamCost.getState() 读取快照(./typert 清单由
  // typert-loader 自动扫描注册)。
  ctx.provide(
    'teamCost',
    createTeamCostService({ store, quota, currency: config.currency, enforce: config.enforce }),
  )
```

</details>

**依据 4 · 源码核查**：[src/report.ts:16-55](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/report.ts#L16-L55)

报告工具与 CSV 入口。

<details>
<summary>查看原文（40行）</summary>

```text
export function createReportTool(deps: ReportDeps) {
  return defineTool({
    name: 'team_cost_report',
    description:
      '查询团队 AI 用量与成本报表（按成员/模型/天分组，支持 today/month/all 范围，可导出 CSV）。' +
      'Query team AI usage and cost: group by member, model, or day; optionally export CSV.',
    parameters: {
      range: { type: 'string', description: '统计范围: today | month | all (默认 today)' },
      groupBy: { type: 'string', description: '分组维度: member | model | day (默认 member)' },
      csv: { type: 'string', description: '传 "true" 时同时导出 CSV 文件并返回路径' },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args: { range?: string; groupBy?: string; csv?: string }) {
      const range = RANGES.has(args.range ?? '') ? (args.range as 'today' | 'month' | 'all') : 'today'
      const groupBy = GROUPS.has(args.groupBy ?? '') ? (args.groupBy as 'member' | 'model' | 'day') : 'member'
      const rows = deps.store.aggregate(range, groupBy)
      const label = groupBy === 'member' ? '成员' : groupBy === 'model' ? '模型' : '日期'
      const lines: string[] = [
        `团队用量报表 (${range === 'today' ? '今天' : range === 'month' ? '本月' : '全部'}, 单位: ${deps.currency})`,
        '',
        `${label} | 调用次数 | 输入 tokens | 输出 tokens | 缓存命中 | 费用`,
        '--- | --- | --- | --- | --- | ---',
      ]
      let totalCost = 0
      for (const row of rows) {
        totalCost += row.cost
        lines.push(
          `${groupBy === 'day' ? row.day : groupBy === 'member' ? row.user : row.model} | ${row.calls} | ${fmt(row.in + row.cw)} | ${fmt(row.out)} | ${fmt(row.cr)} | ${row.cost.toFixed(4)}`,
        )
      }
      lines.push('', `合计费用: ${totalCost.toFixed(4)} ${deps.currency}`)

      if (args.csv === 'true') {
        const file = await deps.store.exportCsv(range)
        lines.push('', `CSV 已导出: ${file}`)
      }
      return lines.join('\n')
```

</details>

#### 缺口

- 未对照宿主真实用量与 provider 账单。
  **影响**：覆盖率/精确性未知。
  **进一步探讨**：固定会话与子代理样本对照事件、账本和账单。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 成员归因、价格与预算怎样计算，哪些配置会导致低估或错归？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

成员归因按 cwd 最长文本前缀匹配，normalize 斜杠并小写；没有路径段边界，因此 /team/alice 会匹配 /team/alice2。未命中归默认成员。DeepSeek 名字按 startsWith/includes 匹配内置静态 2026-09 表，未知模型 fallback 0，虽计 token 却报费用 0；Peak 是静态开关而非实际时段自动识别。成员预算文件每分钟热读，拦截默认 off；members 请求钩子若取不到 agent session cwd 就落默认成员，不能当身份隔离。

即使价格正确、无崩溃且成员归因准确，计量仍发生在assistant/message已产生usage之后，store.record异步完成再evaluate。agent/request只检查现有汇总，没有为在途请求预留/锁定费用；并发请求可同时读到未超预算后放行，达到阈值后也只挡后续新请求，不停止已经发起的模型或提供全局费用硬顶。

#### 证据与依据

**依据 1 · 源码核查**：[src/attribution.ts:9-48](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/attribution.ts#L9-L48)

前缀解析和匹配。

<details>
<summary>查看原文（40行）</summary>

```text
 * Parse `memberName=workspacePathPrefix` rules. Longest prefixes win;
 * malformed entries (no '=') are ignored so a typo cannot take the
 * metering plugin down.
 */
export function parseRules(entries: readonly string[]): AttributionRule[] {
  const rules: AttributionRule[] = []
  for (const entry of entries) {
    const eq = entry.indexOf('=')
    if (eq <= 0 || eq === entry.length - 1) continue
    const member = entry.slice(0, eq).trim()
    const prefix = entry.slice(eq + 1).trim()
    if (member && prefix) rules.push({ member, prefix })
  }
  rules.sort((a, b) => b.prefix.length - a.prefix.length)
  return rules
}

/** Normalize a path for comparison: forward slashes, no trailing slash. */
function normalizePath(p: string): string {
  return p.replaceAll('\\', '/').replace(/\/+$/, '').toLowerCase()
}

export class Attribution {
  private readonly rules: AttributionRule[]

  constructor(
    entries: readonly string[],
    private readonly defaultMember: string,
  ) {
    this.rules = parseRules(entries)
  }

  /** Resolve the member for one session cwd (may be empty/unknown). */
  resolve(cwd: string | undefined): string {
    if (!cwd) return this.defaultMember
    const norm = normalizePath(cwd)
    for (const rule of this.rules) {
      if (norm.startsWith(normalizePath(rule.prefix))) return rule.member
    }
    return this.defaultMember
```

</details>

**依据 2 · 源码核查**：[src/pricing.ts:10-13](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/pricing.ts#L10-L13)

未知模型零价说明。

```text
 * The builtin catalog ships DeepSeek's published 2026-09 pricing in both
 * CNY and USD, off-peak and peak. Unknown models are not guessed: they
 * meter tokens and price at `fallbackPrice` (default 0) until an override
 * is added to <dataDir>/price-overrides.json.
```

**依据 3 · 源码核查**：[src/pricing.ts:52-82](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/pricing.ts#L52-L82)

静态价格/匹配与公式。

<details>
<summary>查看原文（31行）</summary>

```text
  priceFor(model: string): { price: ModelPrice; source: 'override' | 'builtin' | 'fallback' } {
    const override = this.overrides.get(model)
    if (override) return { price: override, source: 'override' }
    const cur = this.currency.toUpperCase() === 'USD' ? 'USD' : 'CNY'
    const m = model.toLowerCase()
    // DeepSeek route ids commonly look like deepseek-chat / deepseek-reasoner
    // / deepseek-v4.x-flash; flash-family and legacy ids resolve separately.
    if (m.startsWith('deepseek')) {
      if (m.includes('flash') || m.includes('v4')) {
        const tier = DEEPEEK_V4_FLASH[cur]
        return { price: this.peak ? tier.peak : tier.offpeak, source: 'builtin' }
      }
      return { price: DEEPSEEK_LEGACY[cur], source: 'builtin' }
    }
    return { price: this.fallback, source: 'fallback' }
  }

  /** Cost in currency major units for one call. */
  cost(
    model: string,
    usage: { inputTokens: number; outputTokens: number; cacheReadTokens?: number; cacheWriteTokens?: number },
  ): number {
    const { price } = this.priceFor(model)
    const cr = usage.cacheReadTokens ?? 0
    const cw = usage.cacheWriteTokens ?? 0
    const m = 1e6
    return (
      (cr * price.cr) / m +
      ((usage.inputTokens + cw) * price.in) / m +
      (usage.outputTokens * price.out) / m
    )
```

</details>

**依据 4 · 源码核查**：[src/config.ts:14-25](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/config.ts#L14-L25)

拦截 best-effort 注释。

<details>
<summary>查看原文（12行）</summary>

```text
  deepseekPeakPricing: boolean
  /**
   * Enforcement mode:
   * - 'off' (default): meter and alert only, never block model requests.
   * - 'total': block new model requests once the TOTAL daily cost budget is
   *   exceeded (set `totalDailyCost` > 0 to arm).
   * - 'members': additionally block a member's new requests once that member
   *   is over any of their 100% budgets. Member resolution inside the request
   *   hook is best-effort (workspace-based); sessions that cannot be resolved
   *   are allowed. Requires a DSH version whose agent payload exposes the
   *   session; when it does not, 'members' behaves like 'off' for unresolved
   *   agents — which is why 'off' remains the default.
```

</details>

**依据 5 · 源码核查**：[src/index.ts:118-140](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/index.ts#L118-L140)

total/members 拦截路径。

<details>
<summary>查看原文（23行）</summary>

```text
  if (config.enforce !== 'off') {
    ctx.on('agent/request', (payload, next) => {
      if (config.enforce === 'total') {
        if (config.totalDailyCost > 0) {
          const totals = store.totalsFor('*')
          if (totals.todayCost >= config.totalDailyCost) {
            throw new Error(
              `[dsh-team-cost] 团队今日费用已超预算 ${totals.todayCost.toFixed(2)}/${config.totalDailyCost} ${config.currency}，新请求已被拦截`,
            )
          }
        }
      } else if (config.enforce === 'members') {
        // Best-effort member resolution from the agent's session header.
        const agent = payload.agent as { session?: { header?: { cwd?: string } } } | undefined
        const user = attribution.resolve(agent?.session?.header?.cwd)
        if (quota.isBlocked(user)) {
          throw new Error(
            `[dsh-team-cost] 成员 ${user} 已超出预算，新请求已被拦截（调整 <dataDir>/members.json 后一分钟内生效）`,
          )
        }
      }
      return next()
    })
```

</details>

**依据 6 · 源码核查**：[src/index.ts:87-140](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/index.ts#L87-L140)

事后usage异步入账，再按已有汇总拦新请求，无并发预留。

<details>
<summary>查看原文（54行）</summary>

```text
  ctx.on('session/event', (session, event) => {
    if (event.type !== 'assistant/message') return
    const usage = event.data.usage
    if (!usage) return
    const source = event.data.message.source
    const header = session.header
    const user = attribution.resolve(header.cwd)
    const record: UsageRecord = {
      t: new Date(event.time).toISOString(),
      seq: event.seq,
      sid: header.id,
      ws: header.cwd ?? '',
      user,
      provider: source.provider,
      model: source.model,
      in: usage.inputTokens ?? 0,
      out: usage.outputTokens ?? 0,
      cr: usage.cacheReadTokens,
      cw: usage.cacheWriteTokens,
      rz: usage.reasoningTokens,
      cost: Number(pricing.cost(source.model, usage).toFixed(6)),
    }
    void store
      .record(record)
      .then(() => quota.evaluate(user))
      .then((status) => {
        if (status.over) ctx.emit('dsh-team-cost/quota-exceeded', status)
      })
      .catch(onError)
  })

  if (config.enforce !== 'off') {
    ctx.on('agent/request', (payload, next) => {
      if (config.enforce === 'total') {
        if (config.totalDailyCost > 0) {
          const totals = store.totalsFor('*')
          if (totals.todayCost >= config.totalDailyCost) {
            throw new Error(
              `[dsh-team-cost] 团队今日费用已超预算 ${totals.todayCost.toFixed(2)}/${config.totalDailyCost} ${config.currency}，新请求已被拦截`,
            )
          }
        }
      } else if (config.enforce === 'members') {
        // Best-effort member resolution from the agent's session header.
        const agent = payload.agent as { session?: { header?: { cwd?: string } } } | undefined
        const user = attribution.resolve(agent?.session?.header?.cwd)
        if (quota.isBlocked(user)) {
          throw new Error(
            `[dsh-team-cost] 成员 ${user} 已超出预算，新请求已被拦截（调整 <dataDir>/members.json 后一分钟内生效）`,
          )
        }
      }
      return next()
    })
```

</details>

**依据 7 · 源码核查**：[src/store.ts:61-75](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/store.ts#L61-L75)

record追加完成后才更新cells。

<details>
<summary>查看原文（15行）</summary>

```text
  async record(rec: UsageRecord): Promise<void> {
    await appendFile(this.jsonlPath(rec.t), JSON.stringify(rec) + '\n', 'utf8')
    const key = `${dayKeyOf(rec.t)}\u0000${rec.user}\u0000${rec.model}`
    let cell = this.cells.get(key)
    if (!cell) {
      cell = { day: dayKeyOf(rec.t), user: rec.user, model: rec.model, calls: 0, in: 0, out: 0, cr: 0, cw: 0, cost: 0 }
      this.cells.set(key, cell)
    }
    cell.calls += 1
    cell.in += rec.in
    cell.out += rec.out
    cell.cr += rec.cr ?? 0
    cell.cw += rec.cw ?? 0
    cell.cost += rec.cost
  }
```

</details>

#### 缺口

- 未核当前官方价格和实际成员 cwd。
  **影响**：费用及人员归属可能偏差。
  **进一步探讨**：固定跨模型账单、相似路径与跨工作区会话对照。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 账本与 rollup、CSV 和配额能在崩溃后保持一致吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

record 先 append JSONL 再更新内存 cells；rollups.json 定时约15秒写一次，启动只 loadRollups，不从 JSONL 重建，坏缓存还显式注释“rebuild lazily not implemented”。因此上次 flush 后至崩溃前已入 JSONL 的记录不会进入重启后的报表/预算；缺 rollups 时既有 JSONL 也不会装回。无 sid+seq 去重，重放事件可能重复记账。CSV export 固定 aggregate(range, day)，表头 member/model 实际为 *，所以“按成员分组导出”不会保留成员/模型。配额基于内存汇总，也会随缓存陈旧而误判。

team_cost_report.execute只接range/groupBy/csv，没有调用者或成员过滤；RPC getState返回已知及有计量记录的全部成员预算/费用和模型聚合。cwd只用来归因账目，不授权谁可读团队报表。本层是全团队管理视图，目标宿主的模型工具/Remote准入须把它限定给适当管理员；外围准入未核，不能把本地无过滤直接写成已发生跨成员泄露。

#### 证据与依据

**依据 1 · 源码核查**：[src/store.ts:20-24](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/store.ts#L20-L24)

JSONL 真相源声明。

```text
/**
 * Append-only JSONL metering log plus an in-memory aggregate, flushed to a
 * small JSON file for fast startup. The JSONL file is the source of truth;
 * rollups.json is a cache and is rebuilt from it on demand.
 */
```

**依据 2 · 源码核查**：[src/store.ts:61-75](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/store.ts#L61-L75)

先 append 后内存更新。

<details>
<summary>查看原文（15行）</summary>

```text
  async record(rec: UsageRecord): Promise<void> {
    await appendFile(this.jsonlPath(rec.t), JSON.stringify(rec) + '\n', 'utf8')
    const key = `${dayKeyOf(rec.t)}\u0000${rec.user}\u0000${rec.model}`
    let cell = this.cells.get(key)
    if (!cell) {
      cell = { day: dayKeyOf(rec.t), user: rec.user, model: rec.model, calls: 0, in: 0, out: 0, cr: 0, cw: 0, cost: 0 }
      this.cells.set(key, cell)
    }
    cell.calls += 1
    cell.in += rec.in
    cell.out += rec.out
    cell.cr += rec.cr ?? 0
    cell.cw += rec.cw ?? 0
    cell.cost += rec.cost
  }
```

</details>

**依据 3 · 源码核查**：[src/store.ts:147-169](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/store.ts#L147-L169)

缓存定时写/启动不重建。

<details>
<summary>查看原文（23行）</summary>

```text
  private async flush(): Promise<void> {
    const payload = JSON.stringify({ version: 1, cells: this.cellList() })
    const tmp = this.rollupsPath + '.tmp'
    await writeFile(tmp, payload, 'utf8')
    await rename(tmp, this.rollupsPath)
  }

  private async loadRollups(): Promise<void> {
    if (!existsSync(this.rollupsPath)) return
    try {
      const parsed: unknown = JSON.parse(await readFile(this.rollupsPath, 'utf8'))
      const cells = (parsed as { cells?: RollupCell[] }).cells
      if (Array.isArray(cells)) {
        for (const cell of cells) {
          if (cell && typeof cell.day === 'string' && typeof cell.user === 'string' && typeof cell.model === 'string') {
            this.cells.set(`${cell.day}\u0000${cell.user}\u0000${cell.model}`, cell)
          }
        }
      }
    } catch {
      // Corrupt cache: rebuild lazily is not implemented in MVP; keep going
      // with in-memory only aggregates — the JSONL log still has everything.
    }
```

</details>

**依据 4 · 源码核查**：[src/store.ts:93-114](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/store.ts#L93-L114)

聚合会按维度丢其他维。

<details>
<summary>查看原文（22行）</summary>

```text
  /** Aggregate rows over a range, grouped by 'member' | 'model' | 'day'. */
  aggregate(range: 'today' | 'month' | 'all', groupBy: 'member' | 'model' | 'day'): RollupCell[] {
    const today = this.todayKey()
    const month = this.monthKey()
    const acc = new Map<string, RollupCell>()
    for (const cell of this.cellList()) {
      if (range === 'today' && cell.day !== today) continue
      if (range === 'month' && !cell.day.startsWith(month)) continue
      const groupKey = groupBy === 'member' ? cell.user : groupBy === 'model' ? cell.model : cell.day
      let row = acc.get(groupKey)
      if (!row) {
        row = { day: cell.day, user: groupBy === 'member' ? groupKey : '*', model: groupBy === 'model' ? groupKey : '*', calls: 0, in: 0, out: 0, cr: 0, cw: 0, cost: 0 }
        acc.set(groupKey, row)
      }
      row.calls += cell.calls
      row.in += cell.in
      row.out += cell.out
      row.cr += cell.cr
      row.cw += cell.cw
      row.cost += cell.cost
    }
    return [...acc.values()].sort((a, b) => b.cost - a.cost)
```

</details>

**依据 5 · 源码核查**：[src/store.ts:137-145](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/store.ts#L137-L145)

CSV 固定按 day。

```text
  async exportCsv(range: 'today' | 'month' | 'all'): Promise<string> {
    const rows = this.aggregate(range, 'day')
    const header = 'day,member,model,calls,input_tokens,output_tokens,cache_read,cache_write,cost\n'
    const lines = rows.map((r) => `${r.day},${r.user},${r.model},${r.calls},${r.in},${r.out},${r.cr},${r.cw},${r.cost.toFixed(6)}`)
    const csv = header + lines.join('\n') + '\n'
    const file = join(this.dataDir, 'exports', `report-${range}-${Date.now()}.csv`)
    await writeFile(file, csv, 'utf8')
    return file
  }
```

**依据 6 · 源码核查**：[src/report.ts:31-54](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/report.ts#L31-L54)

报告 groupBy 与 CSV 分叉。

<details>
<summary>查看原文（24行）</summary>

```text
    async execute(args: { range?: string; groupBy?: string; csv?: string }) {
      const range = RANGES.has(args.range ?? '') ? (args.range as 'today' | 'month' | 'all') : 'today'
      const groupBy = GROUPS.has(args.groupBy ?? '') ? (args.groupBy as 'member' | 'model' | 'day') : 'member'
      const rows = deps.store.aggregate(range, groupBy)
      const label = groupBy === 'member' ? '成员' : groupBy === 'model' ? '模型' : '日期'
      const lines: string[] = [
        `团队用量报表 (${range === 'today' ? '今天' : range === 'month' ? '本月' : '全部'}, 单位: ${deps.currency})`,
        '',
        `${label} | 调用次数 | 输入 tokens | 输出 tokens | 缓存命中 | 费用`,
        '--- | --- | --- | --- | --- | ---',
      ]
      let totalCost = 0
      for (const row of rows) {
        totalCost += row.cost
        lines.push(
          `${groupBy === 'day' ? row.day : groupBy === 'member' ? row.user : row.model} | ${row.calls} | ${fmt(row.in + row.cw)} | ${fmt(row.out)} | ${fmt(row.cr)} | ${row.cost.toFixed(4)}`,
        )
      }
      lines.push('', `合计费用: ${totalCost.toFixed(4)} ${deps.currency}`)

      if (args.csv === 'true') {
        const file = await deps.store.exportCsv(range)
        lines.push('', `CSV 已导出: ${file}`)
      }
```

</details>

**依据 7 · 源码核查**：[src/report.ts:31-55](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/report.ts#L31-L55)

模型报表无调用者过滤。

<details>
<summary>查看原文（25行）</summary>

```text
    async execute(args: { range?: string; groupBy?: string; csv?: string }) {
      const range = RANGES.has(args.range ?? '') ? (args.range as 'today' | 'month' | 'all') : 'today'
      const groupBy = GROUPS.has(args.groupBy ?? '') ? (args.groupBy as 'member' | 'model' | 'day') : 'member'
      const rows = deps.store.aggregate(range, groupBy)
      const label = groupBy === 'member' ? '成员' : groupBy === 'model' ? '模型' : '日期'
      const lines: string[] = [
        `团队用量报表 (${range === 'today' ? '今天' : range === 'month' ? '本月' : '全部'}, 单位: ${deps.currency})`,
        '',
        `${label} | 调用次数 | 输入 tokens | 输出 tokens | 缓存命中 | 费用`,
        '--- | --- | --- | --- | --- | ---',
      ]
      let totalCost = 0
      for (const row of rows) {
        totalCost += row.cost
        lines.push(
          `${groupBy === 'day' ? row.day : groupBy === 'member' ? row.user : row.model} | ${row.calls} | ${fmt(row.in + row.cw)} | ${fmt(row.out)} | ${fmt(row.cr)} | ${row.cost.toFixed(4)}`,
        )
      }
      lines.push('', `合计费用: ${totalCost.toFixed(4)} ${deps.currency}`)

      if (args.csv === 'true') {
        const file = await deps.store.exportCsv(range)
        lines.push('', `CSV 已导出: ${file}`)
      }
      return lines.join('\n')
```

</details>

**依据 8 · 源码核查**：[src/service.ts:19-79](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/service.ts#L19-L79)

RPC返回全团队members及模型聚合。

<details>
<summary>查看原文（61行）</summary>

```text
  const service = {
    /** Full dashboard snapshot: member rows with budgets/totals, model rows. */
    async getState(): Promise<TeamCostState> {
      const memberRows: MemberRow[] = []
      const knownMembers = quota.memberNames()
      const seen = new Set<string>(knownMembers)
      for (const name of knownMembers) {
        const totals = store.totalsFor(name)
        const status = await quota.evaluate(name)
        const budgets = quota.budgetsFor(name)
        memberRows.push({
          name,
          todayCost: totals.todayCost,
          todayTokens: totals.todayTokens,
          monthCost: totals.monthCost,
          monthTokens: totals.monthTokens,
          dailyCost: budgets.dailyCost,
          monthlyCost: budgets.monthlyCost,
          dailyTokens: budgets.dailyTokens,
          monthlyTokens: budgets.monthlyTokens,
          level: status.level,
          over: status.over,
        })
      }
      const fold = (rows: ReturnType<UsageStore['aggregate']>): GroupRow[] =>
        rows.map((r) => ({
          key: r.model !== '*' ? r.model : r.user,
          calls: r.calls,
          inTok: r.in + r.cw,
          outTok: r.out,
          cacheRead: r.cr,
          cacheWrite: r.cw,
          cost: r.cost,
        }))
      // Members that metered activity but have no budgets file entry.
      for (const row of store.aggregate('month', 'member')) {
        if (seen.has(row.user)) continue
        seen.add(row.user)
        const totals = store.totalsFor(row.user)
        memberRows.push({
          name: row.user,
          todayCost: totals.todayCost,
          todayTokens: totals.todayTokens,
          monthCost: totals.monthCost,
          monthTokens: totals.monthTokens,
          level: 0,
          over: false,
        })
      }
      memberRows.sort((a, b) => b.monthCost - a.monthCost)
      const now = new Date()
      return {
        currency,
        enforce,
        generatedAt: now.getTime(),
        dayKey: store.todayKey(),
        monthKey: store.monthKey(),
        members: memberRows,
        todayByModel: fold(store.aggregate('today', 'model')),
        monthByModel: fold(store.aggregate('month', 'model')),
      }
```

</details>

#### 缺口

- 未故障注入真实 DSH。
  **影响**：丢汇总/重复事件的实际频率未知。
  **进一步探讨**：崩溃前后和重复事件 replay 对比 JSONL/rollups/CSV。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续和失败恢复各有哪些财务与人工成本？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次需 Node/DSH、成员工作区规则、价格覆盖、预算、可选 Webhook，校现价/身份；包 MIT，npm 渠道文档称尚未开放，安装/配置工时未知。持续每次事件追加 JSONL、定时 rollup、Webhook 与报表读取，本地存储/IO、模型工具上下文与人工账单核对均有成本；第三方模型未知价在本地被计 0 不是免费。失败恢复要从 JSONL 重建未持久的 rollup、纠正错归/重复、回溯误拦截和通知，实际脚本未内建，人工成本和可能多发模型请求无法定量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-36](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/README.md#L19-L36)

作者安装/配置声明。

<details>
<summary>查看原文（18行）</summary>

````text
- **计价**：内置 DeepSeek 2026-09 官方价目表（峰/谷价 × 人民币/美元），其他模型通过 `price-overrides.json` 配置；未配置的模型照常计 token，费用记 0。
- **成员预算**：每个成员独立的日/月费用与 token 预算，编辑 `<dataDir>/members.json` 一分钟内生效，无需重启。
- **告警**：越过 80%/100% 阈值时触发一次通知（去重），可推送 Webhook（企微/钉钉/飞书机器人直接可用）；同时派发 `dsh-team-cost/quota-exceeded` 事件给其他插件。
- **超支拦截（可选）**：`enforce: 'total'` 超过团队日预算后拦截新模型请求；`enforce: 'members'` 尝试按成员拦截（尽力而为，见配置注释）。默认只监控不拦截。
- **报表工具**：AI 工具 `team_cost_report`——问一句"出一下本月团队成本报表"即可按成员/模型/天分组统计，支持导出 CSV。

## 安装

```sh
# 从 GitHub 仓库安装
dsh plugin --profile web add https://github.com/1569126506-sudo/dsh-team-cost

# 或克隆到本地后从路径安装
git clone https://github.com/1569126506-sudo/dsh-team-cost.git
dsh plugin --profile web add ./dsh-team-cost
```

> npm 渠道（`dsh plugin --profile web add dsh-team-cost`）待账号注册开放后启用。
````

</details>

**依据 2 · 源码核查**：[src/pricing.ts:33-66](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/pricing.ts#L33-L66)

未知模型零价。

<details>
<summary>查看原文（34行）</summary>

```text
export class Pricing {
  private readonly overrides = new Map<string, ModelPrice>()

  constructor(
    private readonly currency: string,
    private readonly peak: boolean,
    private readonly fallback: ModelPrice = { cr: 0, in: 0, out: 0 },
  ) {}

  /** Load user overrides (model name → price). Later calls win. */
  setOverrides(entries: Record<string, ModelPrice>): void {
    this.overrides.clear()
    for (const [model, price] of Object.entries(entries)) {
      if (price && typeof price.in === 'number' && typeof price.out === 'number') {
        this.overrides.set(model, price)
      }
    }
  }

  priceFor(model: string): { price: ModelPrice; source: 'override' | 'builtin' | 'fallback' } {
    const override = this.overrides.get(model)
    if (override) return { price: override, source: 'override' }
    const cur = this.currency.toUpperCase() === 'USD' ? 'USD' : 'CNY'
    const m = model.toLowerCase()
    // DeepSeek route ids commonly look like deepseek-chat / deepseek-reasoner
    // / deepseek-v4.x-flash; flash-family and legacy ids resolve separately.
    if (m.startsWith('deepseek')) {
      if (m.includes('flash') || m.includes('v4')) {
        const tier = DEEPEEK_V4_FLASH[cur]
        return { price: this.peak ? tier.peak : tier.offpeak, source: 'builtin' }
      }
      return { price: DEEPSEEK_LEGACY[cur], source: 'builtin' }
    }
    return { price: this.fallback, source: 'fallback' }
```

</details>

**依据 3 · 源码核查**：[src/store.ts:34-50](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/store.ts#L34-L50)

初始化/flush。

<details>
<summary>查看原文（17行）</summary>

```text
  async init(): Promise<void> {
    await mkdir(this.dataDir, { recursive: true })
    await mkdir(join(this.dataDir, 'exports'), { recursive: true })
    await this.loadRollups()
  }

  startFlushing(onError?: (err: unknown) => void): void {
    const sec = Math.max(5, this.flushIntervalSec)
    this.flushTimer = setInterval(() => {
      this.flush().catch((err) => onError?.(err))
    }, sec * 1000)
    this.flushTimer.unref?.()
  }

  async dispose(): Promise<void> {
    if (this.flushTimer) clearInterval(this.flushTimer)
    await this.flush()
```

</details>

**依据 4 · 源码核查**：[src/store.ts:154-169](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/store.ts#L154-L169)

重建未实现。

<details>
<summary>查看原文（16行）</summary>

```text
  private async loadRollups(): Promise<void> {
    if (!existsSync(this.rollupsPath)) return
    try {
      const parsed: unknown = JSON.parse(await readFile(this.rollupsPath, 'utf8'))
      const cells = (parsed as { cells?: RollupCell[] }).cells
      if (Array.isArray(cells)) {
        for (const cell of cells) {
          if (cell && typeof cell.day === 'string' && typeof cell.user === 'string' && typeof cell.model === 'string') {
            this.cells.set(`${cell.day}\u0000${cell.user}\u0000${cell.model}`, cell)
          }
        }
      }
    } catch {
      // Corrupt cache: rebuild lazily is not implemented in MVP; keep going
      // with in-memory only aggregates — the JSONL log still has everything.
    }
```

</details>

**依据 5 · 源码核查**：[src/quota.ts:125-145](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/quota.ts#L125-L145)

阈值 webhook。

<details>
<summary>查看原文（21行）</summary>

```text
  private alertOnce(user: string, key: string, message: string): void {
    const dedupe = `${user}:${new Date().toISOString().slice(0, 10)}:${key}`
    if (this.alerted.has(dedupe)) return
    this.alerted.add(dedupe)
    const totals = this.store.totalsFor(user)
    this.onError?.(new Error(`[dsh-team-cost] ${message}`))
    if (this.webhook) {
      const body = JSON.stringify({
        plugin: 'dsh-team-cost',
        user,
        message,
        todayCost: Number(totals.todayCost.toFixed(4)),
        monthCost: Number(totals.monthCost.toFixed(4)),
        time: new Date().toISOString(),
      })
      void fetch(this.webhook, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body,
      }).catch((err) => this.onError?.(err))
    }
```

</details>

#### 缺口

- 无账单/人工工时或团队任务对照。
  **影响**：总体拥有成本与节约未知。
  **进一步探讨**：抽固定期间核本地/官方账单、人工对账和故障恢复耗时。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证账本精确性并减少错误拦截？

**研究主题**：新假设与验证、采用判断

#### 完整回答

现有事实：JSONL 是声明真相源却不重建 rollup，事件无 sid+seq 去重，未知模型价 0，cwd 纯前缀可错归；这些会在崩溃/重放/相邻成员路径下让报表和预算偏离。相对现版内存缓存，假设启动从 JSONL 按 sid+seq 去重重建 rollup、价格缺失显式 unknown 而非 0，并做路径段/身份归因，可降低报表误差与错误拦截。条件是事件身份稳定、日志可完整读取、价格版本/人工身份规则可管理；代价是启动 O(日志量)、索引/迁移、管理员补价与仲裁。最小对照：合成会话/子代理事件含重复与崩溃在 flush 前、/team/alice 与 alice2、未知模型；比较现版/改造版相对独立事件清单/官方账单的错归、漏/重计、预算误拦、启动时间；若准确性无改善或启动/管理成本超预注册阈值即证伪。现阶段不能用源码自报“精确”替代外部对账。

#### 证据与依据

**依据 1 · 源码核查**：[src/store.ts:61-75](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/store.ts#L61-L75)

记账与内存聚合。

<details>
<summary>查看原文（15行）</summary>

```text
  async record(rec: UsageRecord): Promise<void> {
    await appendFile(this.jsonlPath(rec.t), JSON.stringify(rec) + '\n', 'utf8')
    const key = `${dayKeyOf(rec.t)}\u0000${rec.user}\u0000${rec.model}`
    let cell = this.cells.get(key)
    if (!cell) {
      cell = { day: dayKeyOf(rec.t), user: rec.user, model: rec.model, calls: 0, in: 0, out: 0, cr: 0, cw: 0, cost: 0 }
      this.cells.set(key, cell)
    }
    cell.calls += 1
    cell.in += rec.in
    cell.out += rec.out
    cell.cr += rec.cr ?? 0
    cell.cw += rec.cw ?? 0
    cell.cost += rec.cost
  }
```

</details>

**依据 2 · 源码核查**：[src/store.ts:147-169](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/store.ts#L147-L169)

缺 JSONL 重建。

<details>
<summary>查看原文（23行）</summary>

```text
  private async flush(): Promise<void> {
    const payload = JSON.stringify({ version: 1, cells: this.cellList() })
    const tmp = this.rollupsPath + '.tmp'
    await writeFile(tmp, payload, 'utf8')
    await rename(tmp, this.rollupsPath)
  }

  private async loadRollups(): Promise<void> {
    if (!existsSync(this.rollupsPath)) return
    try {
      const parsed: unknown = JSON.parse(await readFile(this.rollupsPath, 'utf8'))
      const cells = (parsed as { cells?: RollupCell[] }).cells
      if (Array.isArray(cells)) {
        for (const cell of cells) {
          if (cell && typeof cell.day === 'string' && typeof cell.user === 'string' && typeof cell.model === 'string') {
            this.cells.set(`${cell.day}\u0000${cell.user}\u0000${cell.model}`, cell)
          }
        }
      }
    } catch {
      // Corrupt cache: rebuild lazily is not implemented in MVP; keep going
      // with in-memory only aggregates — the JSONL log still has everything.
    }
```

</details>

**依据 3 · 源码核查**：[src/attribution.ts:26-48](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/attribution.ts#L26-L48)

纯前缀归因。

<details>
<summary>查看原文（23行）</summary>

```text
/** Normalize a path for comparison: forward slashes, no trailing slash. */
function normalizePath(p: string): string {
  return p.replaceAll('\\', '/').replace(/\/+$/, '').toLowerCase()
}

export class Attribution {
  private readonly rules: AttributionRule[]

  constructor(
    entries: readonly string[],
    private readonly defaultMember: string,
  ) {
    this.rules = parseRules(entries)
  }

  /** Resolve the member for one session cwd (may be empty/unknown). */
  resolve(cwd: string | undefined): string {
    if (!cwd) return this.defaultMember
    const norm = normalizePath(cwd)
    for (const rule of this.rules) {
      if (norm.startsWith(normalizePath(rule.prefix))) return rule.member
    }
    return this.defaultMember
```

</details>

**依据 4 · 源码核查**：[src/pricing.ts:33-66](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/pricing.ts#L33-L66)

零价 fallback。

<details>
<summary>查看原文（34行）</summary>

```text
export class Pricing {
  private readonly overrides = new Map<string, ModelPrice>()

  constructor(
    private readonly currency: string,
    private readonly peak: boolean,
    private readonly fallback: ModelPrice = { cr: 0, in: 0, out: 0 },
  ) {}

  /** Load user overrides (model name → price). Later calls win. */
  setOverrides(entries: Record<string, ModelPrice>): void {
    this.overrides.clear()
    for (const [model, price] of Object.entries(entries)) {
      if (price && typeof price.in === 'number' && typeof price.out === 'number') {
        this.overrides.set(model, price)
      }
    }
  }

  priceFor(model: string): { price: ModelPrice; source: 'override' | 'builtin' | 'fallback' } {
    const override = this.overrides.get(model)
    if (override) return { price: override, source: 'override' }
    const cur = this.currency.toUpperCase() === 'USD' ? 'USD' : 'CNY'
    const m = model.toLowerCase()
    // DeepSeek route ids commonly look like deepseek-chat / deepseek-reasoner
    // / deepseek-v4.x-flash; flash-family and legacy ids resolve separately.
    if (m.startsWith('deepseek')) {
      if (m.includes('flash') || m.includes('v4')) {
        const tier = DEEPEEK_V4_FLASH[cur]
        return { price: this.peak ? tier.peak : tier.offpeak, source: 'builtin' }
      }
      return { price: DEEPSEEK_LEGACY[cur], source: 'builtin' }
    }
    return { price: this.fallback, source: 'fallback' }
```

</details>

**依据 5 · 源码核查**：[src/index.ts:84-115](https://github.com/1569126506-sudo/dsh-team-cost/blob/72f371c7cf45578791739c06b1d949e2868536dd/src/index.ts#L84-L115)

事件数据源。

<details>
<summary>查看原文（32行）</summary>

```text
  // Meter one usage-bearing assistant message. The firehose delivers every
  // session — top-level or subagent — so team and teammate spend is counted
  // in full instead of being lost to single-session dashboards.
  ctx.on('session/event', (session, event) => {
    if (event.type !== 'assistant/message') return
    const usage = event.data.usage
    if (!usage) return
    const source = event.data.message.source
    const header = session.header
    const user = attribution.resolve(header.cwd)
    const record: UsageRecord = {
      t: new Date(event.time).toISOString(),
      seq: event.seq,
      sid: header.id,
      ws: header.cwd ?? '',
      user,
      provider: source.provider,
      model: source.model,
      in: usage.inputTokens ?? 0,
      out: usage.outputTokens ?? 0,
      cr: usage.cacheReadTokens,
      cw: usage.cacheWriteTokens,
      rz: usage.reasoningTokens,
      cost: Number(pricing.cost(source.model, usage).toFixed(6)),
    }
    void store
      .record(record)
      .then(() => quota.evaluate(user))
      .then((status) => {
        if (status.over) ctx.emit('dsh-team-cost/quota-exceeded', status)
      })
      .catch(onError)
```

</details>

#### 缺口

- 去重/重建/未知价设计未实现。
  **影响**：假设收益及启动成本未知。
  **进一步探讨**：预注册误差与延迟阈值后做故障/身份/账单对照。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
