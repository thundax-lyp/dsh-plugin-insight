# DSH Cost Tracker

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[a0ddc94](https://github.com/Angelyeye/dsh-cost-tracker/tree/a0ddc943eadb41c292cb0fe1e8d2a6f939d24081)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Angelyeye/dsh-cost-tracker) [![npm 30d 1,908](https://img.shields.io/static/v1?label=npm+30d&message=1%2C908&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@angelyeye/dsh-cost-tracker) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@angelyeye/dsh-cost-tracker)
<!-- END META -->

> **实现功能**：记录DSH模型调用用量和估算费用，提供仪表盘、查询工具及可选多机同步。

> **核心亮点**：按计费时代和订阅口径组织本地usage账本，统一会话查询与仪表盘，历史不被当前单价简单覆盖。[Q03](#research-q03)

> **风险与缺陷**：180天内明细超过200000条时直接截断未先汇总被删项，不能承诺全时段永远精确；实际影响未经运行复现。[Q04](#research-q04)

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
  - [Q01 · 谁需要本地用量账本，合格结果是什么？](#detail-section-11)
  - [Q02 · 流式调用怎样成为费用记录？](#detail-section-12)
  - [Q03 · 统一仪表盘之外的机制增量是什么？](#detail-section-13)
  - [Q04 · “全时段统计永远精确”在什么条件下不成立？](#detail-section-14)
  - [Q05 · 加载和可选账号需要什么？](#detail-section-15)
  - [Q06 · 统计是否降低API开支？](#detail-section-16)
  - [Q07 · 哪些持久化设计值得复用？](#detail-section-17)
  - [Q08 · 如何让估算账本成为可审计账本？](#detail-section-18)
  - [Q09 · 谁可以试用，怎样避免错误财务判断？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常切换模型、按量与订阅套餐的DSH Web用户需要知道调用量和估计费用的来源。合格结果是可与供应商账单核对的用量记录、价格口径及差异解释。简单替代为供应商用量页加电子表格；本插件提供会话内查询、统一仪表盘及可选多机汇总，不能因此视为供应商结算凭证。

基线为供应商用量页加电子表格；本轮不把作者给出的价格数值作为当前官方价格建议。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

|能力|主要用途|使用条件与边界|
|---|---|---|
|用量记录|按流式usage生成账本|无usage不入该路径|
|费用与峰谷查询|展示规则估算|不是供应商结算金额|
|历史导入/重算|补录日志与调整费用|需备份并核对幂等|
|同步|多机账本汇总|另需自建服务与凭据|
|重置|清空统计|不可恢复操作须核对|
|Web仪表盘|查看趋势和口径|加载时可能修改宿主图标文件|

#### 启动与依赖

|依赖或条件|是否必需|用途|缺失或不满足时|
|---|---|---|---|
|DSH Web、tools/webServer、本地可写存储|启动必需|捕获、查询与落盘|功能或持久化失败|
|供应商usage事件|计量必需|实际token桶|缺事件则该流不入账|
|账号与网络|余额/配额/价格功能必需|取外部数据|本地账本仍可用|
|自建云端|同步可选|多机汇总|保持本机统计|

#### 启动步骤

|步骤|执行者与动作|成功判据或失败处理|
|---|---|---|
|准备|用户备份数据并加载重启|仪表盘与工具出现|
|定口径|用户核对模型、时代、订阅|估算和现金分开|
|记录|宿主usage触发入账|抽查token与价格来源|
|验收|用户与账单对照并检查备份|差额不可解释则只作趋势参考|

#### 成本

|阶段|现金与资源成本|人工与时间投入|已知条件与未知项|
|---|---|---|---|
|首次使用|本地存储及可选云服务，金额未知|加载与核对价格/口径，耗时未知|账号功能可选|
|持续使用|记录、价格与同步请求，金额未知|对账和模型映射维护，耗时未知|没有节费实测|
|失败恢复|备份及重建统计，金额未知|查未落盘、重复导入和截断，耗时未知|应检查宿主图标补丁退出|

#### 效果

|效果项|当前证据支持|尚不能确定|
|---|---|---|
|自动用量记录|有usage时finally入账|缺usage请求覆盖率|
|历史口径|价格时代及订阅标记|账单金额一致性|
|长期汇总|旧记录转日汇总|高负载截断下总量守恒|

> **思考**：180天内明细超过200000条时直接截断未先汇总被删项，不能承诺全时段永远精确；实际影响未经运行复现。[Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：按计费时代和订阅口径组织本地usage账本，统一会话查询与仪表盘，历史不被当前单价简单覆盖。[Q03](#research-q03)

按计费时代和订阅口径组织本地usage账本，统一会话查询与仪表盘，历史不被当前单价简单覆盖。[Q03](#research-q03)

原子tmp+rename、对瞬态rename失败退避且拒绝直接覆盖，能减少半JSON；损坏文件另存为corrupt副本，方便排查。实例锁主要检查PID并提示，不应理解为跨进程原子互斥；两实例仍可能覆盖。可复用价格时代和失败持久化说明，但需要总量守恒测试、高负载压缩及宿主补丁退出策略。

<a id="detail-section-5"></a>

### 1.4 主要限制

180天内明细超过200000条时直接截断未先汇总被删项，不能承诺全时段永远精确；实际影响未经运行复现。[Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

希望观察DSH调用趋势的个人用户可在备份数据后试用，先关闭不需要的云同步和账号功能，抽样核对usage与供应商账单。保留订阅等值和按量现金的区分，检查price source及estimated；高调用量团队应先验证明细截断和多进程冲突，再纳入团队成本管理。插件统计不适合直接用于结算或报销。 [Q09](#research-q09)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查固定源码，费用为插件规则估算，未对现实价格或供应商账单独立验证；未来方案未验证。

- 已检查：作者 README、包清单、源码路径 index.js、store.js、pricing.js、price-sync.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查usage捕获、价格归类、明细存储、价格同步校验、启动宿主文件补丁；未审计全部UI/云端及凭据路径，未验证现实定价。
- 下一步：在隔离账本用合成明细检验总量守恒，并按真实账单对齐usage、时间、模型和订阅口径。

**分析版本**

- **仓库**：[Angelyeye/dsh-cost-tracker](https://github.com/Angelyeye/dsh-cost-tracker)
- **版本号**：1.9.6（[固定提交 a0ddc94](https://github.com/Angelyeye/dsh-cost-tracker/tree/a0ddc943eadb41c292cb0fe1e8d2a6f939d24081)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是每条记录携带供应商usage原文摘要、计价来源/版本、计费时点和完整性标记，并在任何淘汰前做守恒汇总，可降低误把估算当现金及高负载漏统计。推导自usage捕获、价格fallback和明细截断。最小验证覆盖无usage、跨时代边界、订阅、重启及超明细上限，逐项比较原始输入总量与明细+汇总；若差额仍不可解释或明显增加维护成本，应收缩为仅显示用量。 [Q08](#research-q08)

在隔离账本用合成明细检验总量守恒，并按真实账单对齐usage、时间、模型和订阅口径。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 15 | 10179 | 7646 | 2181 | — |
| .md | source | 6 | 2807 | — | — | 57664 |
| .mjs | source | 3 | 355 | 268 | 61 | — |
| .js | test | 22 | 6349 | 4930 | 1023 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/Angelyeye/dsh-cost-tracker/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：本地流式用量账本能否给出可解释的模型费用趋势，同时守住估算、持久化及统计完整性边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要本地用量账本，合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

经常切换模型、按量与订阅套餐的DSH Web用户需要知道调用量和估计费用的来源。合格结果是可与供应商账单核对的用量记录、价格口径及差异解释。简单替代为供应商用量页加电子表格；本插件提供会话内查询、统一仪表盘及可选多机汇总，不能因此视为供应商结算凭证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:27-51](https://github.com/Angelyeye/dsh-cost-tracker/blob/a0ddc943eadb41c292cb0fe1e8d2a6f939d24081/README.md#L27-L51)

作者列本地账本、计划等值与云同步主张。

<details>
<summary>查看原文（25行）</summary>

```text
## 它能做什么?

| | 功能 | 说明 |
| --- | --- | --- |
| 💰 | **花费统计** | 每一次 API 调用自动记账:输入 / 输出 / 缓存命中 / 缓存写入 Tokens 与费用(缓存写入按缓存命中价计),按天、按模型聚合 |
| ⏰ | **峰谷定价** | 内置单价表,高峰时段(北京时间周一至周五 9:00–12:00、14:00–18:00,**不含中国法定节假日**)与闲时半价自动区分,**周末与法定节假日全天计为闲时**(节假日表 2026 全年 33 天,可在配置页覆盖/停用;调休补班的周六周日不计高峰),本地模型(ollama 等)计 0;**单价表按「计费时代」分版**(`legacy` / `v41`),北京时间 2026-09-10 12:00 起自动切换为 V4.1 Flash 新价(2.0 / 0.04 / 8.0 高峰),并按官方脚注把旧 V4-Flash 系请求路由到 V4.1 Flash 计费;**`deepseek-v4-pro` 维持自有牌价 9.0 / 27.0 / 0.30 不做路由**(官方 2026-09-14 撤销了下线计划) |
| 🔔 | **峰谷计价提示** | **设置 → 花费统计 → 右上角齿轮 → 峰谷计价与提示**(v1.9.0 起设置集中在此,改完即可预览;DSH 0.1.7-alpha.2 起入口在「花费统计」页头的齿轮,v1.9.3):当前档位/距下次切换倒计时时段条、样式切换(**简洁单行·按24h比例** / **环形表盘·相位色点**)、简洁样式可选**双行紧凑**(上下布局,条上文下/文上条下)、「显示时间」开关、峰/谷切换前弹窗提醒与浏览器系统通知、提前提醒分钟、弹窗位置(右下角/屏幕中心)、提醒类型;侧边栏底部常驻显示时段条(窄栏/展开自适应)。看板上的同名面板改为只读回显 |
| 📌 | **六组概览卡** | 设置页顶部六张卡:今日费用 / 本月费用 / 总花费 / API 请求次数 / Tokens / **总余额**。前三个金额卡**不含订阅会员等效费用**,订阅以附注展示 |
| 👁️ | **视觉模型** | 支持 `deepseek-v4-flash-vision-exp`:legacy 时代单价与 flash 一致,2026-09-10 12:00 起随 V4.1 Flash 新价计费(该旧名已下线,请求由 V4.1 Flash 提供);图片按官方规则换算 token(每张上限 384 个,以接口用量计费) |
| 🏷️ | **官方模型名对齐** | 计费支持**官方现役名 `deepseek-flash`**(价格卡脚注 (1):「模型名请使用 `deepseek-flash`」),旧写法 `deepseek-v4.1-flash` 等归一化后命中同一档价,避免因官方改名而落入兜底估算 |
| 📊 | **可视化仪表盘** | 设置页新增「花费统计」:概览卡片、消费柱状图(按峰谷/按模型)、分模型的请求次数与 Tokens 图表,**全部支持鼠标悬停查看明细** |
| 🧭 | **多机汇总(云端同步)** | 可对接**自建云端服务**(独立仓库 `dsh-cost-cloud`,零运行时依赖):多台电脑的用量汇总到一处,看板顶部出现 **本机 / 本机+云端 / 仅云端** 三态开关,并支持**设备 × Agent 矩阵**(行合计 = 列合计 = 总计);上报内容仅 token 数、费用、时间戳与标识符,可选会话脱敏 |
| 🔥 | **用量热力图** | 设置页新增「Token 用量统计」:类 Codex 的 **26 周日用量方格热图**,按天着色(输入 / 缓存 / 输出 / 费用),悬停看当日明细、今天高亮描边,顶部显示全时段累计;**跟随三态视图**——「本机+云端 / 仅云端」下自动并入云端按天用量(卡片标题右侧标注当前口径) |
| 📈 | **订阅配额监控** | Kimi Coding Plan、**火山方舟 Coding Plan** 等订阅套餐:配额进度条、重置倒计时、等效按量费用参考。火山方舟走管控面 OpenAPI(HMAC 签名),需 AccessKeyID + SecretAccessKey |
| 💳 | **余额查询** | 一键查询 DeepSeek 官方账户余额(总余额 / 充值 / 赠送 / 状态);**已登录 DSH 账号时直接读 Platform 钱包(充值 / 赠金),不再需要 API Key(v1.9.6)** |
| 🤖 | **Agent 工具** | 直接在对话里问:"我现在花了多少钱?"——Agent 会调用 `cost_stats` / `cost_prices` 等工具回答 |
| 🔻 | **状态栏** | 聊天输入框下方实时显示:**本会话花费**(胶囊分段:本会话 / 订阅套餐 / 分模型),按会话实际用到的模型与订阅拆分,**多模型默认折叠只显示 top2,点击展开全部明细**;订阅显示具体套餐名,不再展示配额与调用次数 |
| 👁️ | **界面显示开关** | 输入框上方的花费胶囊、侧边栏峰谷时段条、设置页「花费统计」看板**三个落点各自可关**(设置 → 花费统计 → 右上角齿轮 → 数据与界面 → 界面显示),勾选即刻生效;**只影响显示**,记账、云端同步与 Agent 工具照常,配置入口(齿轮页)本身不受开关控制 |
| 💾 | **本地持久化** | 数据存本机 `~/.dsh/storages/cost-tracker-records.json`,重启不丢、不上传;**明细保留最近 180 天,更早自动压缩为永久日汇总,全时段统计永远精确且内存/磁盘有界** |
| 🕰️ | **历史导入(v1.9.0)** | 回放宿主会话日志,**把装插件之前的对话调用补录进账本**(按各自时间戳的旧价计费);只补插件不可能记到的部分(安装前 / 停机缺口),幂等可重复执行,导入记录标记 `source=import` 以便区分 |
| 🔄 | **官方价格同步(v1.9.0)** | 一键抓取官方定价页、解析各模型峰价并对比差异,应用后构建**新的计费时代**(只影响之后,历史口径不回改);每日可自动核对(只提示、不自动应用),页面改版时宁可不同步也绝不写错价 |
| 🌐 | **多厂商价格目录(v1.9.0)** | 内置 14 家厂商 / 90 个模型条目(USD→CNY 按可配汇率折算),OpenAI / Anthropic / Gemini / Qwen 等内置表之外的模型也能按**精确价**入账;支持宽松/严格匹配与**手动覆盖价** |
| ⚖️ | **Plan 与按量双轨(v1.9.0)** | 工具栏「含 Plan 总额」开关一键切换口径:关闭只算按量真金白银、订阅以附注展示;打开则金额 = 按量 + 订阅等值,图表按天并入「订阅等值」段 |
| 🔐 | **凭据零落盘(v1.9.0)** | 云端令牌与火山 SecretAccessKey 只写 DSH 凭据库(配置文件零明文,旧版明文启动时自动迁移);任何响应只回显布尔;出站请求白名单 + 强制 https + 拒绝跟随重定向(防凭据外带) |
| 📤 | **CSV 导出** | 一键导出明细 + 日汇总(purpose=rollup),方便用 Excel / Numbers 做进一步分析 |
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 流式调用怎样成为费用记录？

**研究主题**：功能与机制

#### 完整回答

llm/stream被生成器包装，保留最近usage chunk并原样yield；finally中只在usage存在时记账。normalizeTokens把输入、图片、缓存与推理字段映射为桶，按结束时Date.now选择计费时代，store.add后计划落盘和同步。没有usage的失败请求不入该记录路径，结束时间也可能与供应商跨价格边界的计费时点不同。记录链路存在不等于对所有供应商费用完整。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:614-657](https://github.com/Angelyeye/dsh-cost-tracker/blob/a0ddc943eadb41c292cb0fe1e8d2a6f939d24081/index.js#L614-L657)

捕获usage、结束时点及异步持久化。

<details>
<summary>查看原文（44行）</summary>

```text
    function recordUsage(options, usage, ts) {
      const provider = toStr(options && options.provider)
      const model = toStr(options && options.model)
      if (!provider && !model) return
      const np = normProvider(provider)
      // 记下最近一次实际使用的 provider：summary 据此判断该预热哪家的配额缓存
      if (np) lastProviderSeen = np
      // 按「调用发生的时刻」选单价版本（跨 2026-09-10 12:00 / 2026-09-14 12:00 自动切换，无需重启）。
      // 视觉模型（deepseek-v4-flash-vision-exp）的图片 token 已含在接口
      // prompt_tokens 中（每张≤384 tokens），由 normalizeTokens 归入 input
      const tokens = normalizeTokens(usage)
      const price = priceForAt(np, model, ts, tokens)
      store.add({
        // 被路由的请求以「实际计费模型规范名」入账（如 V4-Pro → deepseek-flash、
        // 旧名 deepseek-v4-flash → deepseek-flash），使按模型聚合看到的就是真实计费口径。
        ts, provider, model: price.model,
        sessionId: toStr(options && options.sessionId),
        purpose: toStr(options && options.purpose),
        cost: price.cost,
        estimated: price.estimated,
        period: price.period,
        tokens,
        subscription: price.subscription,
        source: 'live', // v1.9.0：与历史导入（source:'import'）区分，覆盖判定只认 live
      })
      schedulePersist()
      scheduleSync(4000)
    }

    async function* wrapStream(source, options) {
      let usage = null
      try {
        for await (const chunk of source) {
          if (chunk && chunk.type === 'usage' && chunk.usage) usage = chunk.usage
          yield chunk
        }
      } finally {
        if (usage) {
          try { recordUsage(options, usage, Date.now()) } catch (e) { console.error('cost record failed', e) }
        }
      }
    }

    ctx.on('llm/stream', (options, next) => wrapStream(next(), options))
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 统一仪表盘之外的机制增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

增量是按时间选择价格时代，区分订阅等值和实际按量，保留明细并汇入日汇总，同时让Agent查询。相对简单累计token乘当前价格，避免把全部历史按新价重算。官方页面解析只在校验完整时构造新时代，不自动证明当前内置价格准确；本研究只检查固定版本机制，不验证现实账单价格。

#### 证据与依据

**依据 1 · 源码核查**：[price-sync.js:91-118](https://github.com/Angelyeye/dsh-cost-tracker/blob/a0ddc943eadb41c292cb0fe1e8d2a6f939d24081/price-sync.js#L91-L118)

解析约束及失败保留旧价。

<details>
<summary>查看原文（28行）</summary>

```text
  // ---- 3. 校验：六组取齐、个数一致、数值合理、空闲≈高峰一半 ----
  const n = order.length
  for (const metricName of ['cacheRead', 'input', 'output']) {
    for (const tierName of ['offpeak', 'peak']) {
      const arr = collected[metricName][tierName]
      if (arr.length !== n) {
        throw new Error('价格块解析不完整：' + metricName + '/' + tierName + ' 期望 ' + n + ' 个值，实得 ' + arr.length + '（页面结构变化？）')
      }
      for (const v of arr) {
        if (!(v > 0 && v < 100000)) throw new Error('解析出异常单价 ' + v + '（页面结构变化？）')
      }
    }
    for (let k = 0; k < n; k += 1) {
      const off = collected[metricName].offpeak[k]
      const peak = collected[metricName].peak[k]
      const ratio = off / peak
      if (!(ratio > 0.35 && ratio < 0.65)) {
        throw new Error('「空闲时段价格为高峰的一半」校验失败：' + order[k] + ' ' + metricName + ' 空闲 ' + off + ' / 高峰 ' + peak)
      }
    }
  }
  const models = {}
  for (let k = 0; k < n; k += 1) {
    const name = order[k]
    models[name] = {
      offpeak: { input: collected.input.offpeak[k], output: collected.output.offpeak[k], cacheRead: collected.cacheRead.offpeak[k] },
      peak: { input: collected.input.peak[k], output: collected.output.peak[k], cacheRead: collected.cacheRead.peak[k] },
    }
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · “全时段统计永远精确”在什么条件下不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

存在高负载截断条件。store.add先把早于180天窗口的记录汇总，再trimDetails；trimDetails直接splice删除超出MAX_DETAILS的明细，没有把这些仍在保留窗口内的被删记录汇总。因此当180天内调用超过默认200000条时，全时段账本可能丢失这部分调用统计。这是静态路径结论，未运行高负载复现。另价格fallback和订阅等值本来就是估算，不能把estimated=false当真实账单一致性。

#### 证据与依据

**依据 1 · 源码核查**：[store.js:425-441](https://github.com/Angelyeye/dsh-cost-tracker/blob/a0ddc943eadb41c292cb0fe1e8d2a6f939d24081/store.js#L425-L441)

超上限的details直接删除，顺序可定位。

<details>
<summary>查看原文（17行）</summary>

```text
  }

  function isRecord(r) {
    return !!r && typeof r === 'object' && typeof r.ts === 'number' && r.tokens && typeof r.tokens.input === 'number'
  }

  function trimDetails() {
    if (details.length > maxDetails) details.splice(0, details.length - maxDetails)
  }

  function add(r) {
    seq += 1
    r.seq = seq
    details.push(r)
    applyRetention(details, rollups, Date.now(), detailDays)
    trimDetails()
    return r
```

</details>

#### 缺口

- 实际用户负载及截断后仪表盘差额未测
  **影响**：不能量化现实损失概率和金额
  **进一步探讨**：在隔离数据副本用缩小maxDetails构建合成记录，比较明细+汇总总量守恒，不导入正式数据

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 加载和可选账号需要什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

基本使用需DSH Web、tools与webServer服务和本地存储写权限。余额、订阅配额、官方价格同步与多机汇总分别依赖网络、账号/凭据或自建云端；这些不是本地捕获usage的必需条件。启动还调用ensureNavIconPatch，定位宿主设置壳client.js并备份、替换文件，为图标修改宿主安装目录；因此退出不仅是隐藏UI或删除插件目录，需检查该补丁与备份。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:154-197](https://github.com/Angelyeye/dsh-cost-tracker/blob/a0ddc943eadb41c292cb0fe1e8d2a6f939d24081/index.js#L154-L197)

启动时对宿主client.js的实际文件副作用。

<details>
<summary>查看原文（44行）</summary>

```text
export function ensureNavIconPatch(opts) {
  const log = (opts && opts.log) || (() => {})
  try {
    const entry = (opts && opts.entry) || (process.argv && process.argv[1]) || ''
    // 全局安装通常通过符号链接启动（如 /opt/homebrew/bin/dsh），需同时尝试 realpath
    const entries = [entry]
    try { const real = realpathSync(entry); if (real && real !== entry) entries.push(real) } catch (e) {}
    let shellFile = ''
    for (const e0 of entries) {
      let dir = dirname(e0)
      for (let i = 0; i < 8 && dir && dir !== dirname(dir); i++) {
        const candidate = join(dir, 'node_modules', '@deepseek-ai', 'dsh-client-ui-settings-general', 'lib', 'client.js')
        if (existsSync(candidate)) { shellFile = candidate; break }
        dir = dirname(dir)
      }
      if (shellFile) break
    }
    if (!shellFile) { log('skip: settings shell not found'); return false }
    const src = readFileSync(shellFile, 'utf8')
    if (src.includes('id === "cost-dashboard"')) { log('ok: already patched'); return true }
    const anchor = /function navIcon\(id\)\s*\{\s*/.exec(src)
    if (!anchor) { log('skip: navIcon() not found (shell layout changed?)'); return false }
    if (!src.includes('react_jsx_runtime') || !src.includes('SettingsRoot_module_css_default')) {
      log('skip: expected identifiers missing (shell layout changed?)'); return false
    }
    if (!existsSync(shellFile + '.cost-tracker-bak')) writeFileSync(shellFile + '.cost-tracker-bak', src)
    const at = anchor.index + anchor[0].length
    const tmp = shellFile + '.cost-tracker-tmp'
    writeFileSync(tmp, src.slice(0, at) + NAV_ICON_BRANCH + src.slice(at))
    renameSync(tmp, shellFile)
    log('ok: patch applied -> ' + shellFile)
    return true
  } catch (e) {
    log('skip: ' + String(e && e.message ? e.message : e))
    return false
  }
}

export default {
  name: 'cost-tracker',
  inject: ['tools', 'webServer'],
  apply(ctx) {
    // 侧边栏图标补丁自愈（DSH 升级覆盖外壳后自动重打；失败静默跳过）
    ensureNavIconPatch({ log: (m) => startupLog('[cost-tracker] nav-icon ' + m) })
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 统计是否降低API开支？

**研究主题**：效果与总成本

#### 完整回答

没有证据支持直接节省。以“可解释且与账单核对的一期统计”为单位，首次需加载、核对币种/模型映射与订阅口径；持续消耗存储、同步和用户对账时间。失败恢复需处理未落盘内存、损坏备份、重复导入和云端口径。价格提醒可以改变调用时间，但未观察用户是否迁移到低峰或实际降低费用。金额与人时均未知，不能从费用可见性推导ROI。

#### 证据与依据

**依据 1 · 源码核查**：[pricing.js:664-680](https://github.com/Angelyeye/dsh-cost-tracker/blob/a0ddc943eadb41c292cb0fe1e8d2a6f939d24081/pricing.js#L664-L680)

多级价格fallback存在，统计必须核对source与estimated。

<details>
<summary>查看原文（17行）</summary>

```text
/** 非订阅路径的价格解析：覆盖价 > 时代精确表（内置+同步） > 目录 > provider 兜底 > 通用兜底 */
function resolveNonPlanPrice(np, model, ts, o) {
  const ov = (o.overrides || PRICE_OVERRIDES)
  const hit = ov.get(overrideKey(np, model))
  if (hit) return { rates: hit.rates, tiered: hit.tiered, estimated: false, subscription: false, model, era: eraAt(ts).id, source: 'override' }
  const era = eraAt(ts)
  const exact = resolveModelInEra(era, model)
  if (exact) return { rates: era.models[exact], tiered: true, estimated: false, subscription: false, model: exact, era: era.id, source: era.synced ? 'synced' : 'exact' }
  if (typeof o.catalog === 'function') {
    try {
      const c = o.catalog(np, model)
      if (c && c.rates) return { rates: c.rates, tiered: false, estimated: false, subscription: false, model, era: era.id, source: 'catalog', catalog: { provider: c.provider, sourceUrl: c.sourceUrl || '', checkedAt: c.checkedAt || '', via: c.via || '' } }
    } catch (e) { /* 目录读取失败不阻断计费，落到 provider 兜底 */ }
  }
  const p = PROVIDER_RATES[np]
  if (p) return { rates: p.rates, tiered: p.tiered, estimated: true, subscription: false, model, era: era.id, source: 'provider' }
  return { rates: GENERIC_RATES, tiered: false, estimated: true, subscription: false, model, era: era.id, source: 'generic' }
```

</details>

#### 缺口

- 没有供应商账单对账及用户节费实验
  **影响**：不能确认金额准确率或成本收益
  **进一步探讨**：抽取固定期间调用逐笔对账，分别报告真实按量、订阅等值、未知和缺失usage

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 哪些持久化设计值得复用？

**研究主题**：工程质量与复用

#### 完整回答

原子tmp+rename、对瞬态rename失败退避且拒绝直接覆盖，能减少半JSON；损坏文件另存为corrupt副本，方便排查。实例锁主要检查PID并提示，不应理解为跨进程原子互斥；两实例仍可能覆盖。可复用价格时代和失败持久化说明，但需要总量守恒测试、高负载压缩及宿主补丁退出策略。

#### 证据与依据

**依据 1 · 源码核查**：[store.js:80-111](https://github.com/Angelyeye/dsh-cost-tracker/blob/a0ddc943eadb41c292cb0fe1e8d2a6f939d24081/store.js#L80-L111)

原子写与失败策略明确。

<details>
<summary>查看原文（32行）</summary>

```text
 * 原子落盘：写临时文件 → rename 覆盖目标。
 *
 * · 临时文件名带 **pid**：两个实例各写各的临时文件，不会互相盖掉半个文件
 *   （旧实现固定用 `<file>.tmp`，两实例必然抢同一个临时文件）。
 * · rename 遇瞬时占用时按 20/40/80/160ms 退避重试（默认 5 次，约 0.3s）。
 * · 仍失败**不做**「直接覆盖写」：那会让并发读方看到半个 JSON，而 store.load()
 *   一旦读到半个 JSON 会把文件改名为 `.corrupt-*` 并清空 —— 损失远大于「晚几秒落盘」。
 *   数据留在内存里，由调用方稍后重试（见 index.js 的 writeRecords 重试链）。
 *
 * @returns {{ok:boolean, attempts:number, mode:'rename'|'failed', error?:Error|null, transient?:boolean}}
 */
export function writeFileAtomic(filePath, data, opts) {
  const o = opts || {}
  const fs = Object.assign({ mkdirSync, writeFileSync, renameSync, unlinkSync }, o.fs || {})
  const sleep = o.sleep || sleepSync
  const tries = Math.max(1, Number(o.tries) || 5)
  const tmp = filePath + '.' + process.pid + '.tmp'
  const cleanup = () => { try { fs.unlinkSync(tmp) } catch (e) { /* 已被 rename 走或从未创建 */ } }
  try {
    fs.mkdirSync(dirname(filePath), { recursive: true })
    fs.writeFileSync(tmp, data, 'utf8')
  } catch (e) {
    cleanup()
    return { ok: false, attempts: 0, mode: 'failed', error: e, transient: isTransientRenameError(e) }
  }
  let attempts = 0
  let last = null
  for (let i = 0; i < tries; i++) {
    attempts += 1
    try {
      fs.renameSync(tmp, filePath)
      return { ok: true, attempts, mode: 'rename', error: last }
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 如何让估算账本成为可审计账本？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是每条记录携带供应商usage原文摘要、计价来源/版本、计费时点和完整性标记，并在任何淘汰前做守恒汇总，可降低误把估算当现金及高负载漏统计。推导自usage捕获、价格fallback和明细截断。最小验证覆盖无usage、跨时代边界、订阅、重启及超明细上限，逐项比较原始输入总量与明细+汇总；若差额仍不可解释或明显增加维护成本，应收缩为仅显示用量。

#### 证据与依据

**依据 1 · 源码核查**：[store.js:435-441](https://github.com/Angelyeye/dsh-cost-tracker/blob/a0ddc943eadb41c292cb0fe1e8d2a6f939d24081/store.js#L435-L441)

先保留再截断的顺序是守恒改进起点。

```text
  function add(r) {
    seq += 1
    r.seq = seq
    details.push(r)
    applyRetention(details, rollups, Date.now(), detailDays)
    trimDetails()
    return r
```

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 谁可以试用，怎样避免错误财务判断？

**研究主题**：采用判断

#### 完整回答

希望观察DSH调用趋势的个人用户可在备份数据后试用，先关闭不需要的云同步和账号功能，抽样核对usage与供应商账单。保留订阅等值和按量现金的区分，检查price source及estimated；高调用量团队应先验证明细截断和多进程冲突，再纳入团队成本管理。插件统计不适合直接用于结算或报销。

#### 证据与依据

**依据 1 · 源码核查**：[pricing.js:627-649](https://github.com/Angelyeye/dsh-cost-tracker/blob/a0ddc943eadb41c292cb0fe1e8d2a6f939d24081/pricing.js#L627-L649)

订阅等值路径明确标记，与按量不同。

<details>
<summary>查看原文（23行）</summary>

```text
export function priceFor(np, model, ts, opts) {
  const o = opts || {}
  // ---- 0. 订阅归类覆盖（用户在配置卡按 provider 或 provider/model 强制归类）----
  const po = planOverrideFor(np, model, o.planOverrides)
  if (po === 'plan') {
    const sub = subscriptionPlanFor(np, model)
    if (sub) return { rates: sub, tiered: false, estimated: true, subscription: true, model, era: null, source: 'plan' }
    // 无既有套餐可套：按「该渠道走订阅」处理 —— 照常解析单价（目录/时代/兜底），
    // 但标记为订阅等值口径；这正是「套餐覆盖了清单外的模型」的兜法。
    const forced = resolveNonPlanPrice(np, model, ts, o)
    forced.subscription = true
    forced.source = 'plan'
    return forced
  }
  if (po === 'api') {
    const forced = resolveNonPlanPrice(np, model, ts, o)
    forced.subscription = false
    return forced
  }
  // ---- 1. 内置订阅套餐 ----
  const sub = subscriptionPlanFor(np, model)
  if (sub) return { rates: sub, tiered: false, estimated: true, subscription: true, model, era: null, source: 'plan' }
  return resolveNonPlanPrice(np, model, ts, o)
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
