# DSH 用量与消耗

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[c398d3d](https://github.com/feiyang-dev/dsh-usage-plugin/tree/c398d3dbf34ecffc689a326410ea91900a5e8ad5)

<!-- BEGIN META -->
[![GitHub ★ 37](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=37&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/feiyang-dev/dsh-usage-plugin) [![npm 30d 1,927](https://img.shields.io/static/v1?label=npm+30d&message=1%2C927&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@feiyang666/dsh-usage-plugin) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@feiyang666/dsh-usage-plugin)
<!-- END META -->

> **功能**：在 DSH 内记录逐调用 token 与缓存用量、估算费用、查询余额并导出历史。

> **亮点**：把宿主用量事件、计价时点和冻结单价保存在同一记录，并提供可导出的本机历史。见 [Q01](#research-q01)、[Q02](#research-q02)、[Q04](#research-q04)。

> **主要限制**：缺少映射的调用会显示零金额，旧记录也可能采用当前规则。余额与用量估算需分别核对，正式结算仍看账单。见 [Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · DSH 的模型请求怎样进入用量面板？](#detail-section-11)
  - [Q02 · 面板费用如何稳定，哪些金额需要回账单？](#detail-section-12)
  - [Q03 · 余额查询怎样处理不同供应商和网络失败？](#detail-section-13)
  - [Q04 · 历史写入、导入导出与刷新有哪些边界？](#detail-section-14)
  - [Q05 · 何时值得采用，怎样验证减少误判？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向反复在 DSH 调用模型、需要按会话核对 token 与费用估算的用户。见 [Q01](#research-q01)。

供应商账单证明付款，手工汇总可按自选口径核对。插件增加在 DSH 会话里追到逐调用数据和当时单价的路径。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 用量记录 | 定位模型请求的 token | 依赖实际 usage 上报 |
| 费用估算 | 按时点比较单次和历史用量 | 映射缺失或旧历史时需人工核 |
| 余额和历史 | 查看供应商余额并导出 | 账户权限与本机数据路径需确认 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 宿主、WebServer 和客户端入口 | 基本展示需要 | 挂载流钩子、接口和面板 | 核启动日志与视图 |
| 提供方上报 token 及已知价格映射 | 费用估算需要 | 生成可核对记录 | 区分未覆盖与实际零价 |
| 供应商凭据和网络 | 查询余额需要 | 读取独立余额数据 | 检查支持类型和错误 |
| 本机可写历史目录 | 持久化与导出需要 | 保存及回读原记录 | 停止覆盖并检查路径和备份 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 在隔离配置核提供方、模型与数据根 | 面板、版本和权限可查 |
| 观测 | 跑一次短会话并核宿主 token | 同一次调用可追溯 |
| 对账 | 读取单价快照和供应商账单 | 记录未覆盖项与币种 |
| 退出 | 保留必要 JSON 并停用 | 用正式账单继续确认费用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 测试请求和本机磁盘 | 核宿主、映射、凭据及目录 | 接入耗时未知 |
| 持续 | 查询、历史与面板资源 | 对账并维护价格 | 性能和节省时间未测 |
| 恢复 | 备份和导出资源 | 查路径及还原记录 | 并发恢复未验证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 逐调用记录 | 读取模型流用量和时点 | 所有实际流均被覆盖 |
| 费用估算 | 按冻结单价或规则计算 | 供应商最终结算一致性 |
| 历史回读 | JSON 和原子文件写入 | 并发与真实权限边界 |

以一次能追到宿主调用和供应商明细的对账为单位。

> **思考**：缺少映射的调用会显示零金额，旧记录也可能采用当前规则。余额与用量估算需分别核对，正式结算仍看账单。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把宿主用量事件、计价时点和冻结单价保存在同一记录，并提供可导出的本机历史。见 [Q01](#research-q01)、[Q02](#research-q02)、[Q04](#research-q04)。

模型事件与余额接口独立，费用快照保留原计价条件。持久化避免直接覆盖已有记录，刷新以轻量指纹减少拉取。

<a id="detail-section-5"></a>

### 1.4 主要限制

缺少映射的调用会显示零金额，旧记录也可能采用当前规则。余额与用量估算需分别核对，正式结算仍看账单。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

在隔离本机先核一次已知模型请求，出现价格缺项或读档异常时停止把面板作为支出依据。见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持记录、计价、余额和导出。实际财务一致性、真实宿主权限和运行性能尚待核。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、lib/client.js、CHANGELOG.md、lib/balance.js、lib/storage.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码核事件、计费、代表余额端点、持久化、导入导出。未运行目标、未接触真实凭据或核对当前官方价格，未穷尽各平台请求。
- 下一步：在测试宿主核单次调用、取消、无 usage、未知价格、异常读档和导出，再与同一账期供应商账单对照。

**分析版本**

- **仓库**：[feiyang-dev/dsh-usage-plugin](https://github.com/feiyang-dev/dsh-usage-plugin)
- **版本号**：2.0.0（[固定提交 c398d3d](https://github.com/feiyang-dev/dsh-usage-plugin/tree/c398d3dbf34ecffc689a326410ea91900a5e8ad5)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可在费用旁增加映射、采集范围和价格版本提示。对照未降低误判时，回到按账单逐项确认。见 [Q05](#research-q05)。

在测试宿主核单次调用、取消、无 usage、未知价格、异常读档和导出，再与同一账期供应商账单对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 1431 | — | — | 26602 |
| .js | source | 7 | 5892 | 5032 | 652 | — |
| .mjs | source | 3 | 219 | 182 | 21 | — |
| .js | test | 14 | 1411 | 1182 | 119 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/feiyang-dev/dsh-usage-plugin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/feiyang-dev/dsh-usage-plugin/issues?q=is%3Aissue+created%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/feiyang-dev/dsh-usage-plugin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用量插件能否把模型请求的观测、价格计算、余额和可恢复历史连成一套可核对的记录？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH 的模型请求怎样进入用量面板？

**研究主题**：场景与需求、功能与机制、依赖、兼容与流程

#### 完整回答

用户在同一 DSH 环境发出多次模型请求，希望定位哪次调用消耗了输入、缓存和输出。供应商账单可核付款，但未必直达当前会话和调用。包补丁声明等待 fs、WebServer、subprocess、credentials、settings、sandboxPolicy 和 agents，宿主真实注册 API，客户端注册用量和余额视图。模型流钩子透传原事件，记录 usage 与结束原因，在流结束或中断时根据已收到的上报落记录。缺会话 ID 时尝试从当前 Agent 取得，因此事件关联还需核具体会话。记录使用调用开始时间和提供方模型，并为已知价格保存当时单价。流里没有上报就不能视为完整计数。单独会话事件能登记特定搜索后端调用，但覆盖不了所有供应商计费项目。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:13-23](https://github.com/feiyang-dev/dsh-usage-plugin/blob/c398d3dbf34ecffc689a326410ea91900a5e8ad5/cordis.patch.yml#L13-L23)

挂载及所需服务。

<details>
<summary>查看原文（11行）</summary>

```text
- insert:
    - id: usage-plugin
      name: '@feiyang666/dsh-usage-plugin'
      inject:
        - fs
        - webServer
        - subprocess
        - credentials
        - settings
        - sandboxPolicy
        - agents
```

</details>

**依据 2 · 源码核查**：[lib/index.js:2018-2034](https://github.com/feiyang-dev/dsh-usage-plugin/blob/c398d3dbf34ecffc689a326410ea91900a5e8ad5/lib/index.js#L2018-L2034)

实际 API 注册。

<details>
<summary>查看原文（17行）</summary>

```text
      const webServer = ctx.get('webServer')
      push('webServer=' + (webServer ? 'present' : 'undefined'))
      if (webServer && typeof webServer.register === 'function') {
        try {
          webServer.register({
            kind: 'exact',
            path: '/usage/api',
            handler: async (req, res) => {
              try {
                const body = await readBody(req)
                sendJson(res, await routeApi(body))
              } catch (e) {
                sendJson(res, { ok: false, error: msg(e) })
              }
            }
          })
          push('route-registered')
```

</details>

**依据 3 · 源码核查**：[lib/client.js:3038-3050](https://github.com/feiyang-dev/dsh-usage-plugin/blob/c398d3dbf34ecffc689a326410ea91900a5e8ad5/lib/client.js#L3038-L3050)

用量及余额视图。

<details>
<summary>查看原文（13行）</summary>

```text
      slots.inject("conversation.view", function () {
        return slots.register(
          { name: "conversation.view", id: "usage-cost-view", order: 20, label: function () { return t("用量与消耗"); } },
          function () { return el("div", { style: st.tab }, el(UsagePanel, { timer: timer })); }
        );
      });

      slots.inject("conversation.view", function () {
        return slots.register(
          { name: "conversation.view", id: "balance-view", order: 30, label: function () { return t("剩余余额查询"); } },
          function () { return el("div", { style: st.tab }, el(BalancePanel, null)); }
        );
      });
```

</details>

**依据 4 · 源码核查**：[lib/index.js:930-989](https://github.com/feiyang-dev/dsh-usage-plugin/blob/c398d3dbf34ecffc689a326410ea91900a5e8ad5/lib/index.js#L930-L989)

透传、收集及记录实际事件。

<details>
<summary>查看原文（60行）</summary>

```text
        ctx.on('llm/stream', function (options, next) {
          const source = next()
          const model = (options && options.model) || ''
          const provider = (options && options.provider) || ''
          const purpose = options && options.purpose ? String(options.purpose) : ''
          let sessionId = options && options.sessionId ? String(options.sessionId) : ''
          const startedAt = Date.now()
          let usage = null
          let finishReason = ''

          async function* observe() {
            try {
              for await (const chunk of source) {
                if (chunk && chunk.type === 'usage' && chunk.usage) {
                  usage = chunk.usage
                } else if (chunk && chunk.type === 'finish') {
                  const r = chunk.reason
                  finishReason = r ? String(r.kind || '') : ''
                }
                yield chunk
              }
            } finally {
              if (!sessionId) {
                try { const ag = currentAgent(); if (ag && ag.session && ag.session.id) sessionId = String(ag.session.id) } catch (e) {}
              }
              if (provider === 'digital-ocean' || provider === 'digitalocean') {
                try { await refreshFxRate(false) } catch (e) {}
              }
              const isDO = provider === 'digital-ocean' || provider === 'digitalocean'
              // 冻结这笔调用当时生效的三个单价（以及 DigitalOcean 的汇率），
              // 写进记录的 unit 字段。之后任何改价都不会回头改写它的费用。
              const unitSnapshot = unitSnapshotOf(model, provider, startedAt)
              if (unitSnapshot && isDO && FX.rate > 0) unitSnapshot.fx = FX.rate
              if (usage) {
                // 只记录上游真实上报的值。DeepSeek 系 provider 不报 cacheWriteTokens
                // （官方计费里"缓存写入"本就按未命中价计，不单列）。此前这里是
                // `usage.cacheWriteTokens || usage.inputTokens`，等于伪造一笔与未命中
                // 相等的缓存写入：四桶合计（输入 + 命中 + 写入 + 输出）因此系统性多算
                // 一笔，插件"总 token"永远比宿主状态栏大一截。
                // 该列的展示兜底改由 lib/client.js 负责，不再污染记录本身。
                records.push({
                  recordId: randomUUID(),
                  time: startedAt,
                  // 计费时刻：取价格档位以 pricingTime 为准，历史回填 / 导入的记录
                  // 也能借此冻结"当时生效的价格"，不随后续调价改变。
                  pricingTime: startedAt,
                  model,
                  provider,
                  purpose,
                  sessionId,
                  inputTokens: usage.inputTokens || 0,
                  outputTokens: usage.outputTokens || 0,
                  cacheReadTokens: usage.cacheReadTokens || 0,
                  cacheWriteTokens: usage.cacheWriteTokens || 0,
                  reasoningTokens: usage.reasoningTokens || 0,
                  finishReason,
                  usdCnyRate: isDO ? (FX.rate || 0) : 0,
                  fxDate: isDO ? (FX.date || '') : '',
                  ...(unitSnapshot ? { unit: unitSnapshot } : {})
                })
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1041-1047](https://github.com/feiyang-dev/dsh-usage-plugin/blob/c398d3dbf34ecffc689a326410ea91900a5e8ad5/lib/index.js#L1041-L1047)

特定搜索后端事件。

```text
        ctx.on('session/event', function (session, event) {
          if (!event || event.type !== 'web/deepseek-search-llm-request') return
          try { recordSearchBackendCall(session, event) } catch (e) { push('search-backend-threw: ' + msg(e)) }
        })
        push('session-event-listener-ok')
      } catch (e) {
        push('session-event-listener-threw: ' + (e && e.stack ? e.stack : msg(e)))
```

#### 缺口

- 实际宿主是否对所有流类型送出 usage 未核。
  **影响**：不能用面板请求数证明全部业务调用。
  **进一步探讨**：对同一会话测成功、取消和无 usage 返回，核记录及来源。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 面板费用如何稳定，哪些金额需要回账单？

**研究主题**：工程质量与复用、缺陷与关键质疑、贡献与相对优势

#### 完整回答

已知单价的调用记录保留冻结单价，auto 先读取记录内价格，旧记录无快照时按对应时刻的规则和当前配置算。DigitalOcean 路径还需要汇率，冻结记录缺值时可能回退当前汇率。显式重算可清掉单价快照，改价动作也有 reprice 参数。作者称历史冻结，但该承诺只适用于保有快照且仍选对应口径的记录。未知 provider、模型或汇率的分支会返回数值 0，用户应理解为未覆盖金额，不能等同免费。时段和法定节假日属于固定代码口径，面板计算与外部价格表可能漂移。作者声明 Search/Fetch 的成功请求费用不计入，不能靠模型 token 估回。比人工汇总，冻结单价和调用来源便于追查估算，但预算与付款仍应由正式账单确认。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:308-365](https://github.com/feiyang-dev/dsh-usage-plugin/blob/c398d3dbf34ecffc689a326410ea91900a5e8ad5/lib/index.js#L308-L365)

冻结、汇率回退及未知分支。

<details>
<summary>查看原文（58行）</summary>

```text
      // Third-party providers are priced only when a verified provider/model
      // mapping exists. Unknown mappings deliberately remain zero rather than
      // inheriting DeepSeek prices from a similar model name.
      function costFor(rec, regime) {
        const provider = String(rec.provider || '').trim().toLowerCase()
        const model = String(rec.model || '').trim().toLowerCase()
        const hit = rec.cacheReadTokens || 0
        const miss = rec.inputTokens || 0
        const out = rec.outputTokens || 0

        // auto 档 = 实际计费口径：记录自带冻结单价时一律用它，历史费用不随价格表
        // 变化。旧记录（无快照）退回下面的"按当前价格表计算"分支，由 UI 提示。
        if (regime === 'auto') {
          const frozen = costFromUnit(rec.unit, hit, miss, out)
          if (frozen !== null) {
            if (provider === 'digital-ocean' || provider === 'digitalocean') {
              const fxRate = Number((rec.unit && rec.unit.fx) || rec.usdCnyRate || FX.rate || 0)
              return fxRate > 0 ? frozen * fxRate : 0
            }
            return frozen
          }
        }

        if (provider === 'siliconflow') {
          const p = SILICONFLOW_PRICING[model]
          if (!p) return 0
          return (hit * p.cacheHit + miss * p.cacheMiss + out * p.output) / 1e6
        }

        if (provider === 'digital-ocean' || provider === 'digitalocean') {
          let p = null
          if (model.indexOf('v3.2') >= 0 || model.indexOf('v3-2') >= 0) p = DIGITALOCEAN_PRICING.v32
          else if (model.indexOf('pro') >= 0) p = DIGITALOCEAN_PRICING.pro
          else if (model.indexOf('flash') >= 0) p = DIGITALOCEAN_PRICING.flash
          if (!p) return 0
          const rate = Number(rec.usdCnyRate || FX.rate || 0)
          if (!(rate > 0)) return 0
          return ((hit * p.cacheHit + miss * p.cacheMiss + out * p.output) / 1e6) * rate
        }

        if (provider === 'amd' || provider === 'amd-gpu-cloud' || provider === 'alibaba' || provider === 'aliyun' || provider === 'qwen') return 0
        if (!isDeepseekProvider(provider)) return 0

        const mk = modelKey(rec.model)
        // 取价时刻：优先 pricingTime（记录产生时冻结的计费时刻）。旧记录没有该字段，
        // 自动退回 time，行为不变。这样历史 / 回填 / 导入的记录不会被后续调价改写费用。
        const pricedAt = rec.pricingTime || rec.time
        // base：固定按旧基础价；auto：记录发生在 2026-08-17 之前的按旧基础价，
        // 之后按该时刻对应的峰谷价表（peakValley / peakValleyV41）。
        if (regime === 'base' || (regime === 'auto' && pricedAt < EFFECTIVE_AT)) {
          const p = PRICING.base[mk]
          if (!p) return 0
          return (hit * p.cacheHit + miss * p.cacheMiss + out * p.output) / 1e6
        }
        const pv = peakValleyTableAt(pricedAt)[mk]
        if (!pv) return 0
        const p = isPeak(pricedAt) ? pv.peak : pv.offPeak
        return (hit * p.cacheHit + miss * p.cacheMiss + out * p.output) / 1e6
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1838-1859](https://github.com/feiyang-dev/dsh-usage-plugin/blob/c398d3dbf34ecffc689a326410ea91900a5e8ad5/lib/index.js#L1838-L1859)

显式重算会清单价快照。

<details>
<summary>查看原文（22行）</summary>

```text
                  if (Number.isFinite(v) && v >= 0) { dst[mk][k] = v; changed = true }
                }
              }
            }
            if (!changed) return fail('没有可用的价格更新（价格必须是非负数字）')
            invalidateProjection()
            persistPricing()
            // 只影响之后产生的记录；同时把这次改价之后的价格表存成一条历史快照。
            appendPricingHistory('edit', body && body.label ? String(body.label) : '手工修改价格表')
            // 默认只影响"之后产生的记录"：历史记录带自己的冻结单价，不会被重算。
            // 确实想用新价改写历史时，显式传 reprice: true（会清空全部快照）。
            let repriced = 0
            if (body && body.reprice === true) repriced = dropUnitSnapshots()
            if (repriced > 0) await persistNow()
            return { ok: true, repriced }
          }
          case 'repriceAll': {
            // 显式重算历史：清掉所有记录的冻结单价，让它们改用当前价格表计算。
            // 这是唯一会改写历史费用的入口，只能由用户主动触发。
            const repriced = dropUnitSnapshots()
            await persistNow()
            return { ok: true, repriced }
```

</details>

**依据 3 · 作者声明**：[CHANGELOG.md:33-38](https://github.com/feiyang-dev/dsh-usage-plugin/blob/c398d3dbf34ecffc689a326410ea91900a5e8ad5/CHANGELOG.md#L33-L38)

作者说明固定价格口径和未纳入的调用。

```text
### 计费与价格 / Pricing

- **官方价目页 2026-11-01 复核**：`deepseek-flash` / `deepseek-v4-pro` 的模型单价与 1.17.0 落地的 `peakValleyV41` 完全一致，**无需调价**；本次新增的是 Search / Fetch 的**按次计费**（¥5 / 1000 次成功请求）。该调用次数 Harness 不持久化、插件取不到，因此**只做口径声明、不计入费用**（宁可少算，不编一个看起来精确的数字）。
- **法定节假日纳入峰谷判定**：官方口径是「周一至周五（不含中国法定节假日）」，此前只处理了周末。内置 2026 年国务院公布的放假日期，可在 `pricing.json` 用 `holidays` 覆盖；**自 2026-11-01 00:00 起生效**，之前的历史调用不追溯改写。
- **价格表历史快照 `pricing-history.json`**：每次改价 / 恢复默认自动追加一条完整快照（最多 200 条，只增不改），价格页可折叠查看「某个时刻用的是哪套价」。快照**不参与任何金额计算**。
- **历史费用不被改写**：改价只影响之后产生的记录；每条记录继续冻结写入时生效的三个单价，`repriceAll` 仍是唯一会改写历史的显式入口。
```

#### 缺口

- 本轮无供应商发票样本验证费用差异。
  **影响**：不能用于替代财务账单。
  **进一步探讨**：对照同一模型及币种的已知、未知及旧记录，保留不纳入项目。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 余额查询怎样处理不同供应商和网络失败？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、功能与机制

#### 完整回答

余额查询与本机用量估算各走独立路径。提供方配置区分直连、账号、控制台令牌及不可查询；硅基流动根据模型 base URL 仅选择预设的两个 HTTPS 主机，不接受任意主机、端口或用户信息。宿主优先以进程内 undici 请求并使用进程内代理 dispatcher，带取消超时，不跟随重定向。缺 undici 可触发其他请求方式，不能将直连行为推广到所有后备。DeepSeek 返回多币种时应核完整币种列表和独立账户。配置缺失、重定向、非成功状态和不支持的账户需要分别解释，余额和本地消费在时点、覆盖范围和币种上不可直接相减。

#### 证据与依据

**依据 1 · 源码核查**：[lib/balance.js:7-65](https://github.com/feiyang-dev/dsh-usage-plugin/blob/c398d3dbf34ecffc689a326410ea91900a5e8ad5/lib/balance.js#L7-L65)

各提供方查询方式。

<details>
<summary>查看原文（59行）</summary>

```text
    credentialHintKey: 'hint.deepseek',
    queryMode: 'direct',
    modelProviderAliases: ['deepseek']
  },
  siliconflow: {
    id: 'siliconflow',
    name: 'SiliconFlow',
    credentialNames: [],
    endpoint: 'https://api.siliconflow.cn/v1/user/info',
    credentialHintKey: 'hint.siliconflow',
    queryMode: 'direct',
    modelProviderAliases: ['siliconflow', 'silicon-flow'],
    credentialHelpUrl: 'https://cloud.siliconflow.cn/account/ak'
  },
  digitalocean: {
    id: 'digitalocean',
    name: 'DigitalOcean',
    credentialNames: ['DIGITALOCEAN_TOKEN', 'DIGITALOCEAN_ACCESS_TOKEN'],
    endpoint: 'https://api.digitalocean.com/v2/customers/my/balance',
    credentialHintKey: 'hint.digitalocean',
    queryMode: 'account',
    modelProviderAliases: ['digitalocean', 'digital-ocean'],
    credentialHelpUrl: 'https://cloud.digitalocean.com/account/api/tokens'
  },
  'amd-gpu-cloud': {
    id: 'amd-gpu-cloud',
    name: 'AMD GPU Cloud',
    credentialNames: [],
    endpoint: '',
    credentialHintKey: 'hint.amd',
    queryMode: 'unsupported',
    unsupportedMessage: 'AMD GPU Cloud 当前未公开可由推理 API Key 调用的余额查询端点；请在 AMD Developer Cloud 控制台查看 credits。',
    modelProviderAliases: ['amd', 'amd-gpu-cloud'],
    credentialHelpUrl: 'https://www.amd.com/en/developer/resources/cloud-access/amd-developer-cloud.html'
  },
  'qwen-token-plan': {
    id: 'qwen-token-plan',
    name: '百炼 Token Plan',
    credentialNames: ['BAILIAN_CONSOLE_TOKEN'],
    endpoint: '',
    credentialHint: '百炼控制台 OAuth 登录 token（~/.bailian/config.json 的 access_token，用 bl auth login --console 生成）',
    queryMode: 'console-token',
    modelProviderAliases: ['aliyun', 'qwen', 'bailian', 'token-plan', '百炼', '阿里云百炼'],
    credentialHelpUrl: 'https://bailian.console.aliyun.com/cli'
  },
  // 百炼「按量付费」与 Token Plan 是两条完全不同的计费通道（issue #15）：
  // Token Plan 的配额走百炼 CLI 的控制台网关；按量付费消耗的是阿里云账户余额，
  // 只有阿里云费用中心 / BSS OpenAPI（需要主账号 AccessKey 签名）能看到，
  // 百炼的模型 API Key 查不到。这里显式列出来，是为了让用户在插件里就知道
  // 该去哪儿看，而不是反复试"查询余额"却只能看到失败。
  'bailian-payg': {
    id: 'bailian-payg',
    name: '百炼按量付费',
    credentialNames: [],
    endpoint: '',
    credentialHintKey: 'hint.bailianPayg',
    queryMode: 'unsupported',
    unsupportedMessage: '百炼「按量付费」扣的是阿里云账户余额，模型 API Key 无法查询；请在阿里云费用中心 → 账户总览查看余额与账单（BSS OpenAPI 需要主账号 AccessKey 签名，插件不代持）。Token Plan 的配额请在「百炼 Token Plan」页查询。',
    modelProviderAliases: ['aliyun-payg', 'dashscope-payg'],
```

</details>

**依据 2 · 源码核查**：[lib/balance.js:108-121](https://github.com/feiyang-dev/dsh-usage-plugin/blob/c398d3dbf34ecffc689a326410ea91900a5e8ad5/lib/balance.js#L108-L121)

区域端点限制。

<details>
<summary>查看原文（14行）</summary>

```text
export function resolveBalanceEndpoint(providerId, modelBaseURL) {
  const provider = getBalanceProvider(providerId)
  if (!provider) return ''
  if (provider.id !== 'siliconflow' || !modelBaseURL) return provider.endpoint
  try {
    const url = new URL(String(modelBaseURL))
    const allowed = url.protocol === 'https:'
      && !url.username
      && !url.password
      && !url.port
      && (url.hostname === 'api.siliconflow.cn' || url.hostname === 'api.siliconflow.com')
    if (allowed) return url.origin + '/v1/user/info'
  } catch (e) {}
  return provider.endpoint
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1130-1170](https://github.com/feiyang-dev/dsh-usage-plugin/blob/c398d3dbf34ecffc689a326410ea91900a5e8ad5/lib/index.js#L1130-L1170)

宿主请求、代理、超时及重定向处理。

<details>
<summary>查看原文（41行）</summary>

```text
      let proxyDispatcher
      let proxyDispatcherReady = false
      async function getDispatcher() {
        if (proxyDispatcherReady) return proxyDispatcher
        proxyDispatcherReady = true
        try {
          const mod = await import('undici')
          if (mod && typeof mod.EnvHttpProxyAgent === 'function') proxyDispatcher = new mod.EnvHttpProxyAgent()
        } catch (e) { proxyDispatcher = null }
        return proxyDispatcher
      }

      async function httpDirect(method, url, headers, body, timeoutMs) {
        const request = await directRequest()
        if (!request) return { ok: false, unsupported: true, error: 'undici 不可用' }
        const dispatcher = await getDispatcher()
        const controller = new AbortController()
        const timer = setTimeout(() => { try { controller.abort() } catch (e) {} }, timeoutMs || 20000)
        try {
          // 注意：undici v7 的 request() 不再接受 `maxRedirections`（改由 redirect
          // interceptor 处理），传了会直接抛
          // "maxRedirections is not supported, use the redirect interceptor"——
          // 余额查询因此整体失败过。这里不跟随重定向：账单/配额端点都是直连，
          // 3xx 一律按非 200 处理并报出状态码，比静默跟跳到未知地址更安全。
          const options = {
            method,
            headers: headers || {},
            signal: controller.signal
          }
          if (body != null) options.body = body
          if (dispatcher) options.dispatcher = dispatcher
          const res = await request(url, options)
          const text = await res.body.text()
          const rawType = res.headers && (res.headers['content-type'] || res.headers['Content-Type'])
          return { ok: true, statusCode: res.statusCode, contentType: String(rawType || ''), body: text }
        } catch (e) {
          const aborted = e && (e.name === 'AbortError' || String(e.code || '') === 'UND_ERR_ABORTED')
          return { ok: false, error: aborted ? '请求超时' : msg(e) }
        } finally {
          clearTimeout(timer)
        }
```

</details>

**依据 4 · 作者声明**：[CHANGELOG.md:24-31](https://github.com/feiyang-dev/dsh-usage-plugin/blob/c398d3dbf34ecffc689a326410ea91900a5e8ad5/CHANGELOG.md#L24-L31)

作者说明多币种及相关兼容修复。

```text
### 修复 / Fixed

- **Desktop 端费用恒为 ¥0**（[#19](https://github.com/feiyang-dev/dsh-usage-plugin/issues/19)）：桌面端官方账号的 provider id 是 `deepseek-account`，而代码只认 `deepseek-official` / `deepseek` 两个字面量，导致这类记录被判成"未知 provider"——费用恒为 0 且从不冻结单价。改为 `isDeepseekProvider()` 前缀匹配（`deepseek` / 任意 `deepseek-*`），历史记录一并算对。
- **多币种账户只显示一种货币**（[#17](https://github.com/feiyang-dev/dsh-usage-plugin/issues/17)）：`/user/balance` 会按币种各返回一条 `balance_infos`，旧实现只取 `[0]`，另一种币种静默消失且刷新时来回跳。现在保留完整列表并按币种逐行展示（总计 / 充值 / 赠送）。
- **用量日历整月日期错位一天**：`monthOffset()` 先取"北京零点"对应的时刻、再 `getUTCDay()` 读星期，而那个时刻在 UTC 上已退回前一天 16:00 —— 整月日期因此集体左移一列（2026-11 的 1 号是周日，却画在"周六"列）。改为直接用 `Date.UTC(y, m, 1)` 计算。
- **趋势图 X 轴日期在窄图下重叠**（采纳 [PR #18](https://github.com/feiyang-dev/dsh-usage-plugin/pull/18)，[@vb2250158](https://github.com/vb2250158)）：按 canvas 实测文本宽度贪心排布，首尾日期优先，放不下时只保留最近日期。
- **余额查询整体报错 `maxRedirections is not supported`**：宿主进程内改用 undici 直连时传了 undici v7 已移除的参数，导致每次余额/汇率请求都在客户端直接抛错。已移除该参数，且不跟随重定向（3xx 按非 200 原样报出）。
- **多币种 / 余额通道**：`queryMode: 'unsupported'` 的服务商改为各自携带 `unsupportedMessage`，不再共用写死 AMD 的提示。
```

#### 缺口

- 代理、凭据取用和真实多币种返回未运行。
  **影响**：不能确认现网支持的账号类型。
  **进一步探讨**：用模拟端点检查非成功、超时与双币种，再获授权后核真实账户。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 历史写入、导入导出与刷新有哪些边界？

**研究主题**：工程质量与复用、效果与总成本、缺陷与关键质疑

#### 完整回答

活跃数据目录优先使用专用环境路径、应用数据或用户目录，工作区只是回退。切换会话不主动迁移活动根。写入以独占临时文件、同步和替换收口，存在但解析损坏的记录会报错，空内容另返回空数组。导入从 CSV 或 JSON 读取候选记录，CSV 映射不含冻结价格，不能将它当成完整历史备份。JSON 导出含价格及原记录。导出路径可取请求中的目录，宿主文件写权限是边界，不能把聊天模型工作区当成全部文件保护。API 注册层直接读取请求并分派，当前仅核此层，真实远程访问控制依赖宿主。客户端先比计数、最新时间和价格版本，未变化时避免拉全量。省下资源需要实测，指纹也不等于逐字审计。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:866-903](https://github.com/feiyang-dev/dsh-usage-plugin/blob/c398d3dbf34ecffc689a326410ea91900a5e8ad5/lib/index.js#L866-L903)

活动目录优先级和迁移。

<details>
<summary>查看原文（38行）</summary>

```text
      function resolveDataRoot() {
        const out = []
        const env = ((typeof process !== 'undefined' && process.env && process.env.DSH_USAGE_DATA_DIR) || '').trim()
        if (env) out.push(normPath(env))
        const localApp = (typeof process !== 'undefined' && process.env) ? (process.env.LOCALAPPDATA || '') : ''
        if (localApp) out.push(joinPath(normPath(localApp), 'dsh-usage-plugin'))
        const roamingApp = (typeof process !== 'undefined' && process.env) ? (process.env.APPDATA || '') : ''
        if (roamingApp) out.push(joinPath(normPath(roamingApp), 'dsh-usage-plugin'))
        out.push(joinPath(normPath(os.homedir()), 'dsh-usage-data'))
        // 兜底（极少见）：以上均不可写时落到工作区，保证不丢数据并提示用户。
        try {
          const sp = ctx.get('sandboxPolicy')
          if (sp && sp.workspaceRoot) out.push(joinPath(normPath(String(sp.workspaceRoot)), 'dsh-usage'))
        } catch (e) {}
        return out
      }

      // 已知可能遗留旧数据的目录（用于一次性合并迁移），不再作为活动根。
      function knownLegacyRoots() {
        const home = normPath(os.homedir())
        const roots = [home, joinPath(home, '.dsh')]
        try {
          const sp = ctx.get('sandboxPolicy')
          if (sp && sp.workspaceRoot) roots.push(normPath(String(sp.workspaceRoot)))
        } catch (e) {}
        const agent = currentAgent()
        if (agent && agent.session && agent.session.header && agent.session.header.cwd) {
          roots.push(normPath(String(agent.session.header.cwd)))
        }
        return roots
      }

      // 会话激活后不再切换根目录（避免路径漂移/历史被拆散）；仅把工作区里
      // 可能遗留的旧记录并入固定的数据根。
      async function ensureSessionRoot() {
        if (!persistOk) return
        await migrateLegacy(knownLegacyRoots())
        persistNow()
```

</details>

**依据 2 · 源码核查**：[lib/storage.js:27-41](https://github.com/feiyang-dev/dsh-usage-plugin/blob/c398d3dbf34ecffc689a326410ea91900a5e8ad5/lib/storage.js#L27-L41)

临时文件和替换。

<details>
<summary>查看原文（15行）</summary>

```text
export async function atomicWriteText(file, text) {
  await fs.mkdir(path.dirname(file), { recursive: true })
  const temporary = file + '.' + randomUUID() + '.tmp'
  let handle
  try {
    handle = await fs.open(temporary, 'wx')
    await handle.writeFile(text, 'utf8')
    await handle.sync()
    await handle.close()
    handle = null
    await fs.rename(temporary, file)
  } finally {
    if (handle) await handle.close().catch(() => {})
    await fs.unlink(temporary).catch(() => {})
  }
```

</details>

**依据 3 · 源码核查**：[lib/storage.js:54-65](https://github.com/feiyang-dev/dsh-usage-plugin/blob/c398d3dbf34ecffc689a326410ea91900a5e8ad5/lib/storage.js#L54-L65)

读档异常与空内容。

<details>
<summary>查看原文（12行）</summary>

```text
export async function readStoredRecords(file) {
  let text
  try {
    text = await fs.readFile(file, 'utf8')
  } catch (error) {
    if (error && error.code === 'ENOENT') return []
    throw error
  }
  if (text.trim() === '') return []
  const records = JSON.parse(text)
  if (!Array.isArray(records)) throw new Error('用量数据文件的顶层必须是数组')
  return records
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1900-1959](https://github.com/feiyang-dev/dsh-usage-plugin/blob/c398d3dbf34ecffc689a326410ea91900a5e8ad5/lib/index.js#L1900-L1959)

导出和导入字段、请求目录。

<details>
<summary>查看原文（60行）</summary>

```text
          case 'export': {
            if (!root) return fail('未找到数据根目录')
            const kind = (body && body.kind) === 'json' ? 'json' : 'csv'
            const name = 'dsh-usage-' + stamp() + (kind === 'json' ? '.json' : '.csv')
            const content = kind === 'json'
              ? JSON.stringify({ exportedAt: Date.now(), pricing: PRICING, records }, null, 2)
              : buildCsv()
            const dirArg = body && body.dir ? normPath(String(body.dir)) : ''
            if (dirArg) {
              const outPath = joinPath(dirArg, name)
              const r = await writeTextFileViaNode(content, outPath)
              if (!r.ok) return fail(r.error)
              return { ok: true, path: outPath, name, dir: dirArg }
            }
            const outPath = joinPath(kind === 'json' ? dirs().json : dirs().csv, name)
            try {
              await nfsWriteText(outPath, content)
              return { ok: true, path: normPath(outPath), name, dir: kind === 'json' ? 'json' : 'csv' }
            } catch (e) { return fail(msg(e)) }
          }
          case 'exportPng': {
            const dataUrl = body && body.dataUrl ? String(body.dataUrl) : ''
            if (!dataUrl) return fail('缺少图片数据')
            const idx = dataUrl.indexOf('base64,')
            const b64 = idx >= 0 ? dataUrl.slice(idx + 7) : dataUrl
            if (!root) return fail('未找到数据根目录')
            const name = 'dsh-usage-report-' + stamp() + '.png'
            const dirArg = body && body.dir ? normPath(String(body.dir)) : ''
            const outPath = normPath(joinPath(dirArg || dirs().images, name))
            const r = await writePngFile(b64, outPath)
            if (!r.ok) return fail(r.error)
            return { ok: true, path: outPath, name, dir: dirArg || 'images' }
          }
          case 'import': {
            const content = body && body.content != null ? String(body.content) : ''
            const filename = body && body.filename ? String(body.filename) : ''
            if (!content) return fail('请选择要导入的文件')
            let parsed
            if (String(filename || '').toLowerCase().indexOf('.csv') >= 0) {
              const lines = String(content).split(/\r?\n/).filter((l) => l.trim().length > 0)
              const header = lines[0] ? parseCsvLine(lines[0]) : []
              const idx = {}
              header.forEach((h, i) => { idx[String(h).trim()] = i })
              parsed = lines.slice(1).map((line) => {
                const cells = parseCsvLine(line)
                const get = (name) => (idx[name] === undefined ? '' : (cells[idx[name]] === undefined ? '' : cells[idx[name]]))
                return {
                  time: get('time'), model: get('model'), provider: get('provider'),
                  inputTokens: get('inputTokens'), outputTokens: get('outputTokens'),
                  cacheReadTokens: get('cacheReadTokens'), cacheWriteTokens: get('cacheWriteTokens'),
                  reasoningTokens: get('reasoningTokens'), finishReason: get('finishReason')
                }
              })
            } else {
              try {
                const data = JSON.parse(content)
                parsed = Array.isArray(data) ? data : (data && Array.isArray(data.records) ? data.records : null)
              } catch (e) { parsed = null }
            }
            if (!parsed || !Array.isArray(parsed)) return fail('文件内容不是可识别的用量数据（支持 JSON 或 CSV）')
```

</details>

**依据 5 · 源码核查**：[lib/index.js:2022-2033](https://github.com/feiyang-dev/dsh-usage-plugin/blob/c398d3dbf34ecffc689a326410ea91900a5e8ad5/lib/index.js#L2022-L2033)

路由直接读请求。

<details>
<summary>查看原文（12行）</summary>

```text
          webServer.register({
            kind: 'exact',
            path: '/usage/api',
            handler: async (req, res) => {
              try {
                const body = await readBody(req)
                sendJson(res, await routeApi(body))
              } catch (e) {
                sendJson(res, { ok: false, error: msg(e) })
              }
            }
          })
```

</details>

**依据 6 · 源码核查**：[lib/client.js:2291-2318](https://github.com/feiyang-dev/dsh-usage-plugin/blob/c398d3dbf34ecffc689a326410ea91900a5e8ad5/lib/client.js#L2291-L2318)

指纹比对再拉取。

<details>
<summary>查看原文（28行）</summary>

```text
      if (!statRef.current) statRef.current = { count: -1, latest: 0, pricingVersion: -1 };

      function refresh() {
        api({ action: "list" }).then(function (res) {
          var next = res || { records: [], count: 0, dataPath: "", persistOk: false, persistError: "", pricing: null, days: [], budget: null };
          setData(next);
          setError("");
          setLoading(false);
          statRef.current = { count: next.total, latest: next.latest, pricingVersion: next.pricingVersion };
        }).catch(function (e) { setError(String((e && e.message) || e)); setLoading(false); });
      }

      /**
       * 轮询：先问 `stat`（几十字节），只有记录数 / 最新时刻 / 价格版本变了才拉全量。
       *
       * 旧实现每 10 秒直接调 `list`：等于每 10 秒把上万条记录重新投影、序列化、
       * JSON.parse、再全量重渲染一次面板——这是"用完这个插件就卡"的主因，
       * 而且数据没变化时也在白跑。
       */
      function poll() {
        try {
          if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
        } catch (e) {}
        api({ action: "stat" }).then(function (res) {
          if (!res || !res.ok) return;
          var prev = statRef.current || {};
          if (prev.count === res.count && prev.latest === res.latest && prev.pricingVersion === res.pricingVersion) return;
          refresh();
```

</details>

#### 缺口

- 未测跨 profile 并发写、导出授权及大数据面板开销。
  **影响**：不能宣称异常恢复完备或普遍提速。
  **进一步探讨**：用临时目录核损坏读档、并发写和导出目标，再测同一大历史。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 何时值得采用，怎样验证减少误判？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

建议在隔离本机 DSH 中试核一次已知模型的短会话。检查宿主 token、采集记录、冻结价和供应商账单是否可追到同一时间段，先用小份 JSON 保留原记录。初次要确认宿主权限和模型映射，持续需要校价格和过滤不适用项，失败时需人工核数据根和恢复来源。若遇到零价缺映射、历史无快照或数据读写异常，停止以面板作财务决策，回供应商对账。可以试验把未知映射、价格版本和未观测项显示在每项结果附近，比较对账错误率和人工时间。若只是多一步查阅且未降低误判，改用明确的人工核对清单。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:318-349](https://github.com/feiyang-dev/dsh-usage-plugin/blob/c398d3dbf34ecffc689a326410ea91900a5e8ad5/lib/index.js#L318-L349)

历史口径与未知返回。

<details>
<summary>查看原文（32行）</summary>

```text
        // auto 档 = 实际计费口径：记录自带冻结单价时一律用它，历史费用不随价格表
        // 变化。旧记录（无快照）退回下面的"按当前价格表计算"分支，由 UI 提示。
        if (regime === 'auto') {
          const frozen = costFromUnit(rec.unit, hit, miss, out)
          if (frozen !== null) {
            if (provider === 'digital-ocean' || provider === 'digitalocean') {
              const fxRate = Number((rec.unit && rec.unit.fx) || rec.usdCnyRate || FX.rate || 0)
              return fxRate > 0 ? frozen * fxRate : 0
            }
            return frozen
          }
        }

        if (provider === 'siliconflow') {
          const p = SILICONFLOW_PRICING[model]
          if (!p) return 0
          return (hit * p.cacheHit + miss * p.cacheMiss + out * p.output) / 1e6
        }

        if (provider === 'digital-ocean' || provider === 'digitalocean') {
          let p = null
          if (model.indexOf('v3.2') >= 0 || model.indexOf('v3-2') >= 0) p = DIGITALOCEAN_PRICING.v32
          else if (model.indexOf('pro') >= 0) p = DIGITALOCEAN_PRICING.pro
          else if (model.indexOf('flash') >= 0) p = DIGITALOCEAN_PRICING.flash
          if (!p) return 0
          const rate = Number(rec.usdCnyRate || FX.rate || 0)
          if (!(rate > 0)) return 0
          return ((hit * p.cacheHit + miss * p.cacheMiss + out * p.output) / 1e6) * rate
        }

        if (provider === 'amd' || provider === 'amd-gpu-cloud' || provider === 'alibaba' || provider === 'aliyun' || provider === 'qwen') return 0
        if (!isDeepseekProvider(provider)) return 0
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1900-1918](https://github.com/feiyang-dev/dsh-usage-plugin/blob/c398d3dbf34ecffc689a326410ea91900a5e8ad5/lib/index.js#L1900-L1918)

JSON 原记录导出路径。

<details>
<summary>查看原文（19行）</summary>

```text
          case 'export': {
            if (!root) return fail('未找到数据根目录')
            const kind = (body && body.kind) === 'json' ? 'json' : 'csv'
            const name = 'dsh-usage-' + stamp() + (kind === 'json' ? '.json' : '.csv')
            const content = kind === 'json'
              ? JSON.stringify({ exportedAt: Date.now(), pricing: PRICING, records }, null, 2)
              : buildCsv()
            const dirArg = body && body.dir ? normPath(String(body.dir)) : ''
            if (dirArg) {
              const outPath = joinPath(dirArg, name)
              const r = await writeTextFileViaNode(content, outPath)
              if (!r.ok) return fail(r.error)
              return { ok: true, path: outPath, name, dir: dirArg }
            }
            const outPath = joinPath(kind === 'json' ? dirs().json : dirs().csv, name)
            try {
              await nfsWriteText(outPath, content)
              return { ok: true, path: normPath(outPath), name, dir: kind === 'json' ? 'json' : 'csv' }
            } catch (e) { return fail(msg(e)) }
```

</details>

**依据 3 · 作者声明**：[CHANGELOG.md:33-38](https://github.com/feiyang-dev/dsh-usage-plugin/blob/c398d3dbf34ecffc689a326410ea91900a5e8ad5/CHANGELOG.md#L33-L38)

作者说明未覆盖与改价。

```text
### 计费与价格 / Pricing

- **官方价目页 2026-11-01 复核**：`deepseek-flash` / `deepseek-v4-pro` 的模型单价与 1.17.0 落地的 `peakValleyV41` 完全一致，**无需调价**；本次新增的是 Search / Fetch 的**按次计费**（¥5 / 1000 次成功请求）。该调用次数 Harness 不持久化、插件取不到，因此**只做口径声明、不计入费用**（宁可少算，不编一个看起来精确的数字）。
- **法定节假日纳入峰谷判定**：官方口径是「周一至周五（不含中国法定节假日）」，此前只处理了周末。内置 2026 年国务院公布的放假日期，可在 `pricing.json` 用 `holidays` 覆盖；**自 2026-11-01 00:00 起生效**，之前的历史调用不追溯改写。
- **价格表历史快照 `pricing-history.json`**：每次改价 / 恢复默认自动追加一条完整快照（最多 200 条，只增不改），价格页可折叠查看「某个时刻用的是哪套价」。快照**不参与任何金额计算**。
- **历史费用不被改写**：改价只影响之后产生的记录；每条记录继续冻结写入时生效的三个单价，`repriceAll` 仍是唯一会改写历史的显式入口。
```

#### 缺口

- 没有真实对账正确率及维护耗时。
  **影响**：只支持小范围可核试用。
  **进一步探讨**：用已知和未知记录构造同一账单测试，分别记录误判与核对时间。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
