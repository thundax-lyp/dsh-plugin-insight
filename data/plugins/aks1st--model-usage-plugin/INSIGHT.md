# model-usage-plugin

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[a8d1a44](https://github.com/AKS1st/model-usage-plugin/tree/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57)

<!-- BEGIN META -->
[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/model-usage-plugin) [![npm 30d 972](https://img.shields.io/static/v1?label=npm+30d&message=972&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/model-usage-plugin) [![最新发布 2026-09-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/model-usage-plugin)
<!-- END META -->

> **实现功能**：在DSH Web设置中展示模型token、估算费用、工具指标、使用趋势与DeepSeek账户余额，并从会话日志补充历史日账。

> **核心亮点**：把流usage、工具事件、去继承历史与显式套餐/价表/汇率控制接到同一设置页，减少手工整理；金额和工具指标不证明业务价值。详见[Q02](#research-q02)。

> **风险与缺陷**：历史扫描在首个会话写日键后跳过同日其它会话，自动补齐不能据此视为完整；自定义余额地址会携带回退到的key，来源检查也只比hostname。未运行漏计或越权复现。详见[Q03](#research-q03)。

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
  - [Q01 · 用量面板给谁用，什么判断有效？](#detail-section-11)
  - [Q02 · 实时、回填和计价如何合成？](#detail-section-12)
  - [Q03 · 安全与统计边界在哪里？](#detail-section-13)
  - [Q04 · 依赖、安装和日常流程是什么？](#detail-section-14)
  - [Q05 · 持久化、回填和计量有哪些工程取舍？](#detail-section-15)
  - [Q06 · 成本、采用和下一层假设是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在DSH Web混用多个模型/provider、希望知道token花在哪里和何时使用较多的个人开发者。它把模型用量、估算金额、趋势、工具频率和余额放在设置页，适合形成“哪种调用值得进一步核查”的线索。合格任务是把自有会话的实际usage准确归到模型/时间/来源，并清楚显示价格、套餐与汇率口径。

金额不是官方账单，工具调用少或失败率低也不是任务效果好。任务是否完成、代码是否正确、返工是否减少，没有从usage或工具error字段自动得到。README的“花得值不值”只能理解为相关效率指标，不应把每调用均价变成业务价值评分。

基线是手动读会话日志和官方账单、维护表格。插件将持续采集与界面聚合接到宿主，减少重复整理，但默认价和汇率是固定版本程序数据，本轮不确认其当前准确性，也不提供任何当前价格建议。若用于付费对账，需要官方账单和完整计量覆盖另行核对。

手工读会话usage、官方账单和维护表格；插件减少持续整理，不能代替合同、账单和任务效果判断。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 实时采集 | 四档usage与工具计数 | 依宿主字段，最近模型归因 |
| 历史回填 | 去继承后补日账/热力图 | 同日会话漏计，今天不补 |
| 费用解释 | 默认/自定义/provider价格与套餐 | 估算不是账单，不确认当前报价 |
| 时间展示 | 日/小时趋势与热力图 | 有保留与模型裁剪窗口 |
| 余额与汇率 | 可选外网查询 | key回退与baseUrl需可信 |
| 配置API | 价表、货币、余额与手动回填 | 回环hostname不等于完整同源/身份 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node ^22.19或>=24与DSH Web | 包声明必需 | 直接加载src ESM与浏览器模块 | 无Web profile没有目标设置页 |
| webServer、timer | host硬注入 | API、回填和持久化计时 | 未就绪不应视启动成功 |
| llm/stream与session/event契约 | 采集必需 | usage与工具归因 | 无usage统一failed，非账单证明 |
| sessionQuery | 历史回填需要 | 列表、精确读和去继承 | 面板显示unavailable，不补历史 |
| 可写DSH_HOME | 持久化必需 | musage-stats.json | 写失败保留dirty重试 |
| 汇率网络 | 可选在线刷新 | 转换显示币种 | 保留缓存或固定默认，不是当前报价 |
| 余额key和可信baseUrl | 余额查询需要 | 凭据/环境回退发请求 | 失败不影响基本统计，地址需明确可信 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定包版本，备份已有台账，核对宿主服务 | 不覆盖现有自定义价或秘密配置 |
| 安装 | 加入Web profile bundle并重启 | 设置页和API可达、事件能产生统计 |
| 校准 | 明确模型/provider、套餐、四档价和汇率来源 | 估算口径与当前实际合同分开核对 |
| 使用 | 看趋势、unknown和回填状态，再查原始日志 | 不以失败率证明业务完成 |
| 恢复 | 检查写盘与历史覆盖，必要时从备份重建 | 不把“已回填N天”等同完整日账 |

本轮只读固定源码和测试材料，不运行目标、余额请求或普通宿主冒烟。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主插件、历史日志读取与回填IO | 核对包、价表、套餐和密钥地址 | 未测大语料耗时/内存 |
| 持续使用 | 内存聚合、定时写JSON、设置页轮询及可选外网查询 | 维护报价/汇率解释与unknown归因 | 插件不增加专门LLM调用，实际主任务费用不由它消除 |
| 失败恢复 | 备份、重扫与潜在重复后台查询 | 对照缺漏日期和原始usage | 日键不代表完整日账，修复/人工成本未知 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 实时用量 | 流usage四档采集与工具事件计数 | 全部provider实际字段与并发归因正确 |
| 费用 | 显式价表/套餐/汇率选择 | 当前官方账单一致或节省金额 |
| 历史 | 去继承与缺日扫描 | 同日多会话完整性，控制流有漏计问题 |
| 决策 | 趋势与工具错误线索 | 业务产出质量和采用后净收益 |

> **思考**：历史扫描在首个会话写日键后跳过同日其它会话，自动补齐不能据此视为完整；自定义余额地址会携带回退到的key，来源检查也只比hostname。未运行漏计或越权复现。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把流usage、工具事件、去继承历史与显式套餐/价表/汇率控制接到同一设置页，减少手工整理；金额和工具指标不证明业务价值。详见[Q02](#research-q02)。

把流usage、工具事件、去继承历史与显式套餐/价表/汇率控制接到同一设置页，减少手工整理；金额和工具指标不证明业务价值。详见[Q02](#research-q02)。

状态将累计、日/小时、热力图、价表、汇率和余额分开保存，写盘先折叠小时差额，再tmp/rename发布；dirty写失败重新武装重试，dispose主动flush并回收路由。流结束后schedulePersist检查disposed，减少卸载后悬空写盘计时器。这些对长期仪表盘比只在内存加计数更完整，但单文件rename不是事件级收据，也不能恢复掉电前尚未写盘的增量。

回填用版本标记区分旧完成状态、list超时、总时间预算、失败重试和最多保留窗口；fork去继承与小时差值是值得借鉴的防重复思路。不过“日期已经存在”被用作整日完成证明，粒度不足，导致同日多会话遗漏；不能以幂等名义牺牲完整性。readSession没有withTimeout，预算只在读取前循环检查，单个永不返回的read可能越过总预算挂住，STALE_RUN又允许新一轮启动，withTimeout本身也没有取消底层操作。

默认保留120日/26小时，桶内模型按token裁24个，快照仅45日且32日模型明细；这限制负载，但不是全量长期对账明细。测试目录覆盖价格、回填、路由和迁移，已阅读其中模拟事件和假sessionQuery结构；它们是作者测试代码，不是本轮测试通过结果。若复用架构，应把完整性watermark与数据去重键分开，并为查询加真正取消/代际控制。

<a id="detail-section-5"></a>

### 1.4 主要限制

历史扫描在首个会话写日键后跳过同日其它会话，自动补齐不能据此视为完整；自定义余额地址会携带回退到的key，来源检查也只比hostname。未运行漏计或越权复现。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察。继续研究可先对照同日两个会话的人工总账，再核对余额baseUrl与凭据绑定和宿主路由认证，勿把估算或工具失败率当业务结果。详见[Q06](#research-q06)。

金额不是官方账单，工具调用少或失败率低也不是任务效果好。任务是否完成、代码是否正确、返工是否减少，没有从usage或工具error字段自动得到。README的“花得值不值”只能理解为相关效率指标，不应把每调用均价变成业务价值评分。

基线是手动读会话日志和官方账单、维护表格。插件将持续采集与界面聚合接到宿主，减少重复整理，但默认价和汇率是固定版本程序数据，本轮不确认其当前准确性，也不提供任何当前价格建议。若用于付费对账，需要官方账单和完整计量覆盖另行核对。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持被动采集与价表展示；历史同日多会话漏计和余额地址凭据绑定限制采用，事件账本为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.js、src/client.js、src/route-security.js、tests/backfill.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码读取流和工具采集、回填、价表选择、HTTP校验、余额与汇率请求、持久化及模拟测试；未核实当前报价，不执行目标。
- 下一步：进一步探讨从同日多会话、fork、跨日及中断重启的人工真值语料入手，再检查凭据发送目标与上层授权链。

**分析版本**

- **仓库**：[AKS1st/model-usage-plugin](https://github.com/AKS1st/model-usage-plugin)
- **版本号**：0.17.0（[固定提交 a8d1a44](https://github.com/AKS1st/model-usage-plugin/tree/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57)）
- **版本日期**：2026-09-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索逐会话/事件稳定ID账本与独立扫描watermark，再绑定价版本，比较漏计、重复、重启和资源负担；未实现。详见[Q06](#research-q06)。

进一步探讨从同日多会话、fork、跨日及中断重启的人工真值语料入手，再检查凭据发送目标与上层授权链。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 519 | — | — | 7707 |
| .mjs | source | 3 | 1515 | 1194 | 260 | — |
| .js | source | 3 | 4034 | 3036 | 852 | — |
| .mjs | test | 8 | 2448 | 2012 | 275 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=grey&logo=github&style=flat)](https://github.com/AKS1st/model-usage-plugin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=grey&logo=github&style=flat)](https://github.com/AKS1st/model-usage-plugin/issues?q=is%3Aissue+created%3A2026-09-22T05%3A17%3A15.925Z..2026-10-22T05%3A17%3A15.925Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/model-usage-plugin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A17%3A15.925Z..2026-10-22T05%3A17%3A15.925Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断实时用量与费用解释价值，重点核查历史完整性、凭据去向与长期持久化。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用量面板给谁用，什么判断有效？

**研究主题**：场景与需求

#### 完整回答

面向在DSH Web混用多个模型/provider、希望知道token花在哪里和何时使用较多的个人开发者。它把模型用量、估算金额、趋势、工具频率和余额放在设置页，适合形成“哪种调用值得进一步核查”的线索。合格任务是把自有会话的实际usage准确归到模型/时间/来源，并清楚显示价格、套餐与汇率口径。

金额不是官方账单，工具调用少或失败率低也不是任务效果好。任务是否完成、代码是否正确、返工是否减少，没有从usage或工具error字段自动得到。README的“花得值不值”只能理解为相关效率指标，不应把每调用均价变成业务价值评分。

基线是手动读会话日志和官方账单、维护表格。插件将持续采集与界面聚合接到宿主，减少重复整理，但默认价和汇率是固定版本程序数据，本轮不确认其当前准确性，也不提供任何当前价格建议。若用于付费对账，需要官方账单和完整计量覆盖另行核对。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-18](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/README.md#L3-L18)

作者列出用量、费用、工具指标与余额问题。

<details>
<summary>查看原文（16行）</summary>

```text
DeepSeek Harness（DSH）Web 设置面板插件：统计各模型的 token 消耗与估算费用，展示用量趋势、开发活跃度与 API 账户余额。

`npm` 安装 · MIT License · Node ^22.19 || >=24（与 DSH 一致）

![模型消耗总览页](assets/overview-light.png)

## 它回答什么

- **花了多少钱** —— 按模型估算费用，并换算到你关心的货币
- **钱花在哪个模型上** —— 费用占比（不是 token 占比：调用少但单价高的模型才是优化点）
- **什么时候贵** —— 按天 / 按小时的堆叠柱，可在费用、Tokens、工具调用三种口径间切换
- **最近是不是一直在干活** —— GitHub 风格的一年活跃度热力图
- **花得值不值** —— 工具调用数、失败率、每调用均价、每调用 Token、高频工具
- **账户还剩多少** —— 直接查询 DeepSeek 账户余额

数据全部来自你自己的会话记录，不联网上报。
```

</details>

**依据 2 · 作者声明**：[README.md:90-96](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/README.md#L90-L96)

README明确估算不等于账单。

```text

**这是估算，不是账单。** 它不含官方折扣、赠送额度、阶梯价与税费；请以官方账单为准。

### 内置默认价

首次使用自动套用，可在"模型明细"里逐个修改，或点"重置"回到内置默认。

```

**依据 3 · 源码核查**：[src/index.js:1497-1529](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/index.js#L1497-L1529)

工具失败按result.error归因，不提供业务成功判据。

<details>
<summary>查看原文（33行）</summary>

```text
  }

  // ---------- 工具调用采集 ----------

  // 工具事件不带模型，按"该会话最近一次 LLM 调用的模型"归因；会话未知时归到 unknown，
  // 仍然计入总量与工具排行，只是不参与按模型拆分。
  ctx.on('session/event', (session, event) => {
    if (!event || typeof event.type !== 'string') return
    // 有真实事件 = 语料已就绪：唤醒一次历史回填（见 kickBackfill）。
    kickBackfill()
    if (event.type !== 'tool/call' && event.type !== 'tool/result') return
    const data = event.data || {}
    const tool = typeof data.name === 'string' && data.name !== '' ? data.name : 'unknown'
    const sessionKey = session && session.id !== undefined && session.id !== null ? String(session.id) : null
    const model = sessionKey !== null ? (lastModelBySession.get(sessionKey) || 'unknown') : 'unknown'
    const failed = event.type === 'tool/result' && data.error !== undefined && data.error !== null
    const now = new Date()
    // 计入按模型的台账（toolCalls / toolFailed 走同一组 BUCKET_FIELDS）。
    // 注意工具名只在 tool/call 时累加：一次调用会产生 call 与 result 两个事件，
    // 两边都加会把调用数算成两倍。
    const isCall = event.type === 'tool/call'
    // 同时维护按模型的全量计数：首页的占比卡与效率卡要和三个关键数字同口径
    // （全部），而不是各自按时间窗口算一遍。
    const statsEntry = ensure(model)
    if (isCall) statsEntry.toolCalls += 1
    if (failed) statsEntry.toolFailed += 1
    recordBucketSample(model, {
      calls: 0, failed: 0,
      toolCalls: isCall ? 1 : 0,
      toolFailed: failed ? 1 : 0,
    }, now, isCall || failed ? tool : undefined)
    schedulePersist()
  }, { global: true })
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 实时、回填和计价如何合成？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

llm/stream中间件透传所有chunk，只保留最后一个usage，在finally记录四类token、reasoning和调用数；没有usage则增加failed。每会话保留最近模型映射，工具call计调用、result.error计失败，按最近一次LLM模型归因。小时桶并入日桶用已折叠快照补差，另有年度热力图；不是保存完整请求文本的追踪系统。

历史路径用sessionQuery列表和精确读取，先切掉inheritedEventCount避免fork继承重复，再按request/context或header取得模型并按事件日聚合。它只填缺失日期且不碰今天，不能自动补今天插件启用前的用量。更关键的是按会话边读边将日期标为已填，同日其它会话随后被跳过，见Q03。历史回填也主要补日账/热力图，不把旧usage重新送入实时累计stats。

费用主要在client按四档token与当前选择的默认/自定义/provider价格、峰谷累计量和目标汇率计算。套餐可只记token不算费用，用户可显式覆盖默认；合并别名改善展示但不产生实际账单凭证。贡献在持续流截取、带去继承处理的历史整合、可解释价格控制与同页趋势，而非新计费协议或业务产出度量。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:1640-1674](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/index.js#L1640-L1674)

流透传、最后usage和无usage失败计数。

<details>
<summary>查看原文（35行）</summary>

```text

  // 拦截每次流式模型调用：透传所有 chunk，只采集 usage。
  ctx.on('llm/stream', (options, next) => {
    const provider = options.provider
    const model = options.model
    // 记下该会话最近用的模型，供后面的工具事件归因。
    if (options.sessionId !== undefined && options.sessionId !== null) {
      const sessionKey = String(options.sessionId)
      lastModelBySession.delete(sessionKey)
      lastModelBySession.set(sessionKey, String(model || 'unknown'))
      while (lastModelBySession.size > MAX_TRACKED_SESSIONS) {
        const oldest = lastModelBySession.keys().next().value
        lastModelBySession.delete(oldest)
      }
    }
    const upstream = next()
    return (async function* wrapped() {
      let usage = null
      try {
        for await (const chunk of upstream) {
          if (chunk.type === 'usage') usage = chunk.usage
          yield chunk
        }
      } finally {
        if (usage) {
          record(model, provider, usage)
        } else {
          // 结束但没有 usage：error / aborted / 提前中断的调用，计为失败，
          // 保证每次被拦截的调用都进入统计（不"蒸发"）。
          ensure(model).failed += 1
          schedulePersist()
        }
      }
    })()
  })
```

</details>

**依据 2 · 源码核查**：[src/index.js:1454-1494](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/index.js#L1454-L1494)

token/峰谷按调用结束时间累计。

<details>
<summary>查看原文（41行）</summary>

```text
  function record(model, provider, usage) {
    const key = String(model || 'unknown')
    const entry = ensure(key)
    entry.calls += 1
    entry.inputTokens += usage.inputTokens || 0
    entry.cacheReadTokens += usage.cacheReadTokens || 0
    entry.cacheWriteTokens += usage.cacheWriteTokens || 0
    entry.outputTokens += usage.outputTokens || 0
    entry.reasoningTokens += usage.reasoningTokens || 0
    if (provider && !entry.providers.includes(provider)) entry.providers.push(provider)
    // 首次观测到该模型且用户未自定义/移除价格时，自动套用默认预设（含计价货币）。
    if (entry.calls === 1 && !prices.has(key) && !removed.has(key)) {
      const preset = presetFor(key)
      if (preset) prices.set(key, copyPreset(preset))
    }
    // 峰谷定价：按调用结束时刻判断是否落在任一高峰时段，高峰 token 单独计数，
    // 非高峰 = 总量 - 高峰量。高峰价格配置由用户为模型启用后生效（最多两个高峰时段）。
    const now = new Date()
    const delta = {
      calls: 1,
      failed: 0,
      inputTokens: usage.inputTokens || 0,
      cacheReadTokens: usage.cacheReadTokens || 0,
      cacheWriteTokens: usage.cacheWriteTokens || 0,
      outputTokens: usage.outputTokens || 0,
      reasoningTokens: usage.reasoningTokens || 0,
      peakInputTokens: 0,
      peakCacheReadTokens: 0,
      peakCacheWriteTokens: 0,
      peakOutputTokens: 0,
    }
    if (inPeak(prices.get(key), now)) {
      entry.peakInputTokens += delta.inputTokens
      entry.peakCacheReadTokens += delta.cacheReadTokens
      entry.peakCacheWriteTokens += delta.cacheWriteTokens
      entry.peakOutputTokens += delta.outputTokens
      delta.peakInputTokens = delta.inputTokens
      delta.peakCacheReadTokens = delta.cacheReadTokens
      delta.peakCacheWriteTokens = delta.cacheWriteTokens
      delta.peakOutputTokens = delta.outputTokens
    }
```

</details>

**依据 3 · 源码核查**：[src/index.js:1317-1334](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/index.js#L1317-L1334)

切继承事件再回填日账。

<details>
<summary>查看原文（18行）</summary>

```text
      const owned = Array.isArray(snapshot.events) ? snapshot.events.slice(snapshot.inheritedEventCount || 0) : []
      if (owned.length === 0) continue
      const days = aggregateSessionEvents(owned, (time) => dayKeyOf(new Date(time)))
      for (const [dayKey, totals] of days) {
        if (dayKey === todayKey) continue          // 今天归实时采集
        if (heatBuckets.has(dayKey)) continue      // 已有账（实时采过）→ 不碰，避免重复计算
        heatBuckets.set(dayKey, { tokens: totals.tokens, tools: totals.tools })
        filled += 1
        // 在这一刻累计而不是在函数返回时累计：中途抛错时，已经写进台账的日子
        // 仍然是"恢复过的历史"，不能在计数里丢掉。
        backfillDaysTotal += 1
        // 明细日账只补快照窗口内的日子：它带着逐模型信息，属于"看得见"的范围。
        if (!dayBuckets.has(dayKey) && dayBuckets.size < MAX_DAYS) {
          const bucket = makeBucket()
          for (const [model, counts] of totals.models) addToBucket(bucket, model, counts)
          recomputeBucketTotal(bucket)
          dayBuckets.set(dayKey, bucket)
        }
```

</details>

**依据 4 · 源码核查**：[src/client.js:988-1057](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/client.js#L988-L1057)

套餐、价格来源与费用公式。

<details>
<summary>查看原文（70行）</summary>

```text
             * token plan 是否**生效**。
             *
             * 三态：用户明确勾选 → 生效；用户明确取消 → 不生效（即使来自订阅型 provider，
             * 也要按量估算，例如你想看"如果走 API 会花多少"）；没表过态 → 跟随 provider：
             * 订阅型 provider 的用量本来就不按量计费，默认只记 token。
             */
            const tokenPlanActiveOf = (model) => {
              const stored = storedPriceOf(model)
              if (stored !== undefined && stored.tokenPlan === true) return true
              if (stored !== undefined && stored.tokenPlan === false) return false
              return isSubscriptionProvider(pricingProviderOf(model))
            }
            /** 该模型是否勾了 token plan（界面勾选态用生效值）。 */
            const tokenPlanOf = (model) => tokenPlanActiveOf(model)
            /** 该模型是否勾了「自定义计费」（关着就用内置默认价）。 */
            const customPricingOf = (model) => {
              const stored = storedPriceOf(model)
              return stored !== undefined && stored.customPricing === true
            }
            /** 该模型是否**支持** token plan（能力项，来自内置预设）。 */
            const tokenPlanSupportedOf = (model) => {
              const preset = presetPriceOf(model)
              if (preset !== undefined && preset.tokenPlanSupported === true) return true
              // 订阅型 provider 的模型即使不在内置名单里，也要能勾（自动规则已经把它算成套餐，
              // 用户得能取消）。
              return isSubscriptionProvider(pricingProviderOf(model))
            }
            const shapeOf = (p) => (p
              ? { currency: p.currency || 'USD', input: p.input, output: p.output, cacheRead: p.cacheRead, cacheWrite: p.cacheWrite, peak: p.peak || null, peak2: p.peak2 || null }
              : { currency: 'USD', input: 0, output: 0, cacheRead: 0, cacheWrite: 0, peak: null, peak2: null })
            /**
             * **生效**价格，费用计算与展示都走这里。
             * token plan → null（不计费）；否则按「自定义计费」开关在内置默认价与用户价之间选。
             * @param {string} model - 模型 id 或服务模型键。
             * @returns {object|null} 生效价格；null 表示按套餐处理、不计费用。
             */
            const priceOf = (model) => {
              if (tokenPlanOf(model)) return null
              return displayPriceOf(model)
            }
            /**
             * 用于**展示**的价格：与 {@link priceOf} 同一套选择规则，但不因套餐而返回 null。
             * 价格表单要照常显示（套餐关掉后还会用到），因此不能借用"生效价格"。
             * @param {string} model - 模型 id 或服务模型键。
             * @returns {object} 价格对象（缺省为零价结构）。
             */
            const displayPriceOf = (model) => {
              // provider 覆盖价是用户为"某个 provider"显式填的，天然生效（不受自定义开关影响）。
              const override = providerOverrideOf(model)
              if (override !== undefined) return shapeOf(override)
              const chosen = customPricingOf(model) ? storedPriceOf(model) : (presetPriceOf(model) || storedPriceOf(model))
              return chosen === undefined ? shapeOf(undefined) : shapeOf(chosen)
            }
            // 费用公式：高峰 token 走高峰价（高峰价留空则为 0 → 按正常价），
            // 其余走正常价；结果换算到目标货币。
            const costFrom = (counts, p) => {
              if (!p) return null
              if (!(p.input > 0 || p.output > 0 || p.cacheRead > 0 || p.cacheWrite > 0)) return null
              const peak = p.peak && p.peak.enabled ? p.peak : null
              const peakPrice = (normal, peakVal) => (peak && peakVal > 0 ? peakVal : normal)
              const own = (
                (counts.inputTokens - counts.peakInputTokens) * p.input + counts.peakInputTokens * peakPrice(p.input, peak && peak.input)
                + (counts.cacheReadTokens - counts.peakCacheReadTokens) * p.cacheRead + counts.peakCacheReadTokens * peakPrice(p.cacheRead, peak && peak.cacheRead)
                + (counts.cacheWriteTokens - counts.peakCacheWriteTokens) * p.cacheWrite + counts.peakCacheWriteTokens * peakPrice(p.cacheWrite, peak && peak.cacheWrite)
                + (counts.outputTokens - counts.peakOutputTokens) * p.output + counts.peakOutputTokens * peakPrice(p.output, peak && peak.output)
              ) / 1e6
              return (own / rateOf(p.currency)) * rateOf(target)
            }
            const costOf = (model) => {
              const row = rowOf(model)
```

</details>

**依据 5 · 源码核查**：[src/index.js:614-628](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/index.js#L614-L628)

小时日桶与折叠快照结构。

<details>
<summary>查看原文（15行）</summary>

```text
export function apply(ctx) {
  const stats = new Map()
  const prices = new Map()
  const removed = new Set()
  // 时间台账：按天与小时聚合，供趋势图使用。只累加本功能上线后的增量。
  const dayBuckets = new Map()
  const hourBuckets = new Map()
  // 每个小时"已经并入当天"的快照，让归档幂等：写盘前与跨小时都会调用，
  // 重复调用只补差值，不会把同一小时累加两遍。
  const foldedHours = new Map()
  // 工具计数的"已并入当天"快照（与 models 分开，差值法同样保证幂等）。
  const foldedHourTools = new Map()
  // 热力图台账：日期 → { tokens, tools }。只累加本版本上线后的增量。
  const heatBuckets = new Map()
  // 历史回填是否已完成。完成前每次启动都会再跑一轮（带时间预算，可续跑）。
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 安全与统计边界在哪里？

**研究主题**：缺陷与关键质疑

#### 完整回答

历史补齐有明确静态缺陷。scanBackfill逐会话求days，首个会话将某日写入heatBuckets后，后续会话只要同日就continue，日明细也随之不再累加。所以“某日已存在”不等于“该日所有会话已完整聚合”；新安装读取两份同日历史时，控制流支持漏计后读取者。今天被完全排除、createdAt与次日覆盖启发式也不能代表跨多日会话尾部都已覆盖。未执行故障复现，不量化影响比例。

模型实时归因是最近session模型，不是每个工具的因果调用ID；超过64会话会淘汰旧映射并落unknown，并行/交错调用需注意。中断但已收到usage仍记正常记录，无usage则统一failed，两者都不是业务任务成功率。价格由当前表与记录的峰谷计数解释，改价可重算显示，但不能追溯每笔原始合同/有效版本。README本身先称已删除Pro转Flash规则，随后又称仍有该规则，作者说明也有矛盾。

HTTP要求Host是回环名称，并在有Origin时比较hostname；不比较scheme或port，也不核对socket来源，不能称完整同源校验或身份认证。POST有JSON与64KiB上限，是有意义局部防线。余额配置允许任意baseUrl，refreshBalance会带内存key、credentials或环境变量key请求该地址，因此配置地址是凭据去向选择；未经信任的设置变更不能安全默认使用环境key。未核查上层路由认证或实施越权。README“不联网上报”不代表完全离线，实际有汇率和余额请求。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:1317-1335](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/index.js#L1317-L1335)

同轮首个session写日键，后续同日直接跳过。

<details>
<summary>查看原文（19行）</summary>

```text
      const owned = Array.isArray(snapshot.events) ? snapshot.events.slice(snapshot.inheritedEventCount || 0) : []
      if (owned.length === 0) continue
      const days = aggregateSessionEvents(owned, (time) => dayKeyOf(new Date(time)))
      for (const [dayKey, totals] of days) {
        if (dayKey === todayKey) continue          // 今天归实时采集
        if (heatBuckets.has(dayKey)) continue      // 已有账（实时采过）→ 不碰，避免重复计算
        heatBuckets.set(dayKey, { tokens: totals.tokens, tools: totals.tools })
        filled += 1
        // 在这一刻累计而不是在函数返回时累计：中途抛错时，已经写进台账的日子
        // 仍然是"恢复过的历史"，不能在计数里丢掉。
        backfillDaysTotal += 1
        // 明细日账只补快照窗口内的日子：它带着逐模型信息，属于"看得见"的范围。
        if (!dayBuckets.has(dayKey) && dayBuckets.size < MAX_DAYS) {
          const bucket = makeBucket()
          for (const [model, counts] of totals.models) addToBucket(bucket, model, counts)
          recomputeBucketTotal(bucket)
          dayBuckets.set(dayKey, bucket)
        }
      }
```

</details>

**依据 2 · 源码核查**：[src/index.js:1271-1283](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/index.js#L1271-L1283)

仅会话创建日和次日的覆盖启发式。

<details>
<summary>查看原文（13行）</summary>

```text
  function isSessionDayCovered(createdAt) {
    if (typeof createdAt !== 'number' || !Number.isFinite(createdAt)) return false
    const todayKey = dayKeyOf(new Date())
    const covered = (time) => {
      const key = dayKeyOf(new Date(time))
      if (key === todayKey) return true
      return heatBuckets.has(key) && dayBuckets.has(key)
    }
    const next = new Date(createdAt)
    next.setDate(next.getDate() + 1)
    return covered(createdAt) && covered(next.getTime())
  }

```

</details>

**依据 3 · 源码核查**：[src/route-security.js:4-21](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/route-security.js#L4-L21)

hostname判断而非完整origin/socket认证。

<details>
<summary>查看原文（18行）</summary>

```text
function hostnameOf(value) {
  if (typeof value !== 'string' || value.trim() === '') return undefined
  try {
    return new URL(value.includes('://') ? value : `http://${value}`).hostname.toLowerCase()
  } catch {
    return undefined
  }
}

/** Accept only requests addressed to the local web profile and its own origin. */
export function isLoopbackRequest(req) {
  const host = hostnameOf(req?.headers?.host)
  if (host === undefined || !LOOPBACK_HOSTS.has(host)) return false
  const origin = req?.headers?.origin
  if (origin === undefined) return true
  return hostnameOf(origin) === host
}

```

</details>

**依据 4 · 源码核查**：[src/index.js:1733-1758](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/index.js#L1733-L1758)

余额key回退和任意baseUrl携带Authorization。

<details>
<summary>查看原文（26行）</summary>

```text
  async function refreshBalance() {
    balance = { ...balance, status: 'loading', updatedAt: new Date().toISOString() }
    try {
      let apiKey = (balanceApiKey || '').trim()
      if (!apiKey) {
        const credentials = ctx.get('credentials')
        if (credentials !== undefined) {
          try {
            const resolved = await credentials.resolve('DEEPSEEK_API_KEY')
            if (resolved && resolved.value) apiKey = resolved.value
          } catch {
            // 凭证解析失败则继续尝试环境变量。
          }
        }
      }
      if (!apiKey && process.env.DEEPSEEK_API_KEY) apiKey = process.env.DEEPSEEK_API_KEY
      if (!apiKey) {
        balance = { status: 'error', total: null, currency: null, infos: [], updatedAt: new Date().toISOString(), message: '未配置 API Key（可在此页填写，或配置 DEEPSEEK_API_KEY）' }
        return false
      }
      const base = (balanceBaseUrl || '').trim() || process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'
      const response = await fetch(base.replace(/\/+$/, '') + '/user/balance', {
        headers: { Authorization: 'Bearer ' + apiKey },
        signal: AbortSignal.timeout(10000),
      })
      const data = await response.json()
```

</details>

**依据 5 · 源码核查**：[src/index.js:2127-2133](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/index.js#L2127-L2133)

设置操作直接写baseUrl，不限制协议域名。

```text
      case 'set-balance-config': {
        // apiKey 仅保存在会话内存，不落盘（避免明文密钥持久化）。
        if (body && typeof body.apiKey === 'string') balanceApiKey = body.apiKey
        if (body && typeof body.baseUrl === 'string') balanceBaseUrl = body.baseUrl
        schedulePersist()
        return { ok: true }
      }
```

**依据 6 · 作者声明**：[README.md:111-121](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/README.md#L111-L121)

同段价目更新说明与后续转Flash说明矛盾。

<details>
<summary>查看原文（11行）</summary>

```text
DeepSeek V4 Pro **继续提供且计费不变**，因此删掉了此前"9/14 之后改按 Flash 价计费"的规则
（留着会把 V4-Pro 的用量低估约 5 倍）。

已下线的 `deepseek-v4-flash`、`deepseek-v4-flash-0731`、`deepseek-v4-flash-vision-exp`
请求由 V4.1-Flash 提供服务并按 Flash 价计费，因此与 `deepseek-flash` 计为同一个模型
（明细页会在卡片上标注合并了哪些 id，展开可看各自分项）。按官方公告，
`deepseek-v4-pro` 在 2026-09-14 12:00（北京时间）之后同样改由 V4.1-Flash 服务并按 Flash 价计费，
插件内置了这条带生效时间的规则。

### 第三方模型

```

</details>

#### 缺口

- 同日多会话漏计、长会话跨日和并行归因的实际范围未运行测量。
  **影响**：不能把静态反例当已完成生产影响审计，但完整补齐声明不获当前控制流支持。
  **进一步探讨**：可从两个同日独立历史会话及跨三天会话的人工总账开始对照。
- 宿主上层身份控制及配置可访问者未核查。
  **影响**：局部origin缺口不等于已证明远程可利用，凭据发送风险依配置权限成立。
  **进一步探讨**：沿固定宿主路由注册链核对认证，再明确余额地址的信任和凭据绑定。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、安装和日常流程是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node ^22.19或>=24与DSH Web | 包声明必需 | 直接加载src ESM与浏览器模块 | 无Web profile没有目标设置页 |
| webServer、timer | host硬注入 | API、回填和持久化计时 | 未就绪不应视启动成功 |
| llm/stream与session/event契约 | 采集必需 | usage与工具归因 | 无usage统一failed，非账单证明 |
| sessionQuery | 历史回填需要 | 列表、精确读和去继承 | 面板显示unavailable，不补历史 |
| 可写DSH_HOME | 持久化必需 | musage-stats.json | 写失败保留dirty重试 |
| 汇率网络 | 可选在线刷新 | 转换显示币种 | 保留缓存或固定默认，不是当前报价 |
| 余额key和可信baseUrl | 余额查询需要 | 凭据/环境回退发请求 | 失败不影响基本统计，地址需明确可信 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定包版本，备份已有台账，核对宿主服务 | 不覆盖现有自定义价或秘密配置 |
| 安装 | 加入Web profile bundle并重启 | 设置页和API可达、事件能产生统计 |
| 校准 | 明确模型/provider、套餐、四档价和汇率来源 | 估算口径与当前实际合同分开核对 |
| 使用 | 看趋势、unknown和回填状态，再查原始日志 | 不以失败率证明业务完成 |
| 恢复 | 检查写盘与历史覆盖，必要时从备份重建 | 不把“已回填N天”等同完整日账 |

本轮只读固定源码和测试材料，不运行目标、余额请求或普通宿主冒烟。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:5-27](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/package.json#L5-L27)

ESM导出、Web和Node版本条件。

<details>
<summary>查看原文（23行）</summary>

```text
  "type": "module",
  "exports": {
    ".": "./src/index.js",
    "./client": "./src/client.js",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  },
  "files": [
    "src",
    "cordis.patch.yml",
    "assets"
  ],
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "scripts": {
```

</details>

**依据 2 · 源码核查**：[src/index.js:30-33](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/index.js#L30-L33)

host硬依赖。

```text
export const name = 'model-usage-plugin'
// webServer 和 timer 由 web 组合提供；声明为硬依赖使 apply 等待它们就绪，
// 路由和持久化定时器都随插件生命周期建立与清理。
export const inject = ['webServer', 'timer']
```

**依据 3 · 源码核查**：[cordis.patch.yml:1-6](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/cordis.patch.yml#L1-L6)

bundle挂载。

```text
# Bundle patch layer shipped by the model-usage-plugin package. When the package is
# active in a profile (dsh.profile.bundles), this layer is applied to the
# composition and mounts the plugin row.
- insert:
    - id: model-usage-plugin
      name: model-usage-plugin
```

**依据 4 · 作者声明**：[README.md:20-58](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/README.md#L20-L58)

安装卸载流程和保留台账说明。

<details>
<summary>查看原文（39行）</summary>

````text
## 安装

需要 DSH 的 Web profile（`dsh web` 能正常启动）。

**npm（推荐）**

```bash
dsh plugin --profile web add model-usage-plugin
dsh web          # 重启使插件生效
```

`dsh plugin` 会把包装进 profile 并自动登记为 bundle 层；本包含 `dsh.bundle.patch` 声明，无需手改配置。

**从 GitHub**

```bash
dsh plugin --profile web add github:AKS1st/model-usage-plugin
dsh web
```

**从源码（本地开发）**

```bash
git clone https://github.com/AKS1st/model-usage-plugin.git
dsh plugin --profile web add /path/to/model-usage-plugin
dsh web
```

**卸载**

```bash
dsh plugin --profile web remove model-usage-plugin
dsh web
```

统计文件 `$DSH_HOME/musage-stats.json` 会保留，需要一并清理时手动删除即可。

## 使用

````

</details>

**依据 5 · 源码核查**：[src/index.js:1376-1390](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/index.js#L1376-L1390)

sessionQuery缺失状态。

<details>
<summary>查看原文（15行）</summary>

```text
  function resolveSessionQuery(fallback) {
    const current = typeof ctx.get === 'function' ? ctx.get('sessionQuery') : undefined
    backfillSource = current === undefined ? 'injected' : 'ctx.get'
    return current === undefined ? fallback : current
  }

  // 用**延迟注入**等服务就绪，而不是在 apply 里直接 ctx.get：
  // apply 执行时该插件可能还没注册（组合里有这一行 ≠ 此刻已可读），
  // 直接查会拿到 undefined —— 这正是线上"回填没跑"的原因。
  // ctx.inject 的回调在依赖可用后触发；服务始终不存在时回调不触发，插件不受影响。
  const markBackfillUnavailable = () => {
    if (backfill.state === 'pending') backfill = { state: 'unavailable', days: 0, sessions: 0, scanned: 0, total: 0 }
  }
  if (heatBackfilled) {
    backfill = { state: 'skipped', days: 0, sessions: 0, scanned: 0, total: 0 }
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 持久化、回填和计量有哪些工程取舍？

**研究主题**：工程质量与复用

#### 完整回答

状态将累计、日/小时、热力图、价表、汇率和余额分开保存，写盘先折叠小时差额，再tmp/rename发布；dirty写失败重新武装重试，dispose主动flush并回收路由。流结束后schedulePersist检查disposed，减少卸载后悬空写盘计时器。这些对长期仪表盘比只在内存加计数更完整，但单文件rename不是事件级收据，也不能恢复掉电前尚未写盘的增量。

回填用版本标记区分旧完成状态、list超时、总时间预算、失败重试和最多保留窗口；fork去继承与小时差值是值得借鉴的防重复思路。不过“日期已经存在”被用作整日完成证明，粒度不足，导致同日多会话遗漏；不能以幂等名义牺牲完整性。readSession没有withTimeout，预算只在读取前循环检查，单个永不返回的read可能越过总预算挂住，STALE_RUN又允许新一轮启动，withTimeout本身也没有取消底层操作。

默认保留120日/26小时，桶内模型按token裁24个，快照仅45日且32日模型明细；这限制负载，但不是全量长期对账明细。测试目录覆盖价格、回填、路由和迁移，已阅读其中模拟事件和假sessionQuery结构；它们是作者测试代码，不是本轮测试通过结果。若复用架构，应把完整性watermark与数据去重键分开，并为查询加真正取消/代际控制。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:972-1025](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/index.js#L972-L1025)

tmp/rename、dirty重试、disposed guard。

<details>
<summary>查看原文（54行）</summary>

```text
  function flushSync() {
    stopWriteTimer()
    try {
      // 落盘前把"当前小时"的进行中明细并入当天台账，避免进程被杀时丢掉最后一小时。
      foldCurrentHourIntoDay()
      trimHeatBuckets()
      const state = {
        version: 7,
        targetCurrency,
        stats: Object.fromEntries(stats),
        prices: Object.fromEntries(prices),
        removed: Array.from(removed),
        dayBuckets: Object.fromEntries(dayBuckets),
        hourBuckets: Object.fromEntries(hourBuckets),
        heatBuckets: Object.fromEntries(heatBuckets),
        heatBackfillRev: heatBackfilled ? HEAT_BACKFILL_REV : 0,
        recoveredDays: backfillDaysTotal,
        balanceBaseUrl,
        balance,
        rates,
        ratesSource,
        ratesUpdatedAt,
        ratesFetchedAt,
      }
      mkdirSync(dshHome, { recursive: true })
      const tmp = dataFile + '.' + process.pid + '.tmp'
      writeFileSync(tmp, JSON.stringify(state, null, 2))
      renameSync(tmp, dataFile)
      dirty = false
    } catch {
      // 写盘失败：保留 dirty 并重新武装定时器，稍后重试。
      dirty = true
      if (writeTimer === null) {
        writeTimer = ctx.interval(() => {
          if (dirty) flushSync()
          else stopWriteTimer()
        }, flushDelayMs)
      }
    }
  }

  function schedulePersist() {
    // dispose 之后不再武装写盘定时器（in-flight 的 llm/stream 可能在
    // dispose 之后才结束，避免产生永不被清理的周期 flush）。
    if (disposed) return
    dirty = true
    if (writeTimer !== null) return
    writeTimer = ctx.interval(() => {
      if (dirty) flushSync()
      else stopWriteTimer()
    }, flushDelayMs)
  }

  // 比较价格的基础五要素（计价货币 + 四档单价），忽略峰谷配置。
```

</details>

**依据 2 · 源码核查**：[src/index.js:1217-1260](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/index.js#L1217-L1260)

withTimeout仅包装promise与运行陈旧去抖。

<details>
<summary>查看原文（44行）</summary>

```text
   */
  const withTimeout = (promise, ms, label) => new Promise((resolve, reject) => {
    let settled = false
    // `ctx.timeout` 与 `ctx.interval` 一样返回 **disposer**，不是 timer id。
    const disposeTimer = ctx.timeout(() => {
      if (settled) return
      settled = true
      reject(new Error(label + ' 超时（' + ms + 'ms）'))
    }, ms)
    promise.then((value) => {
      if (settled) return
      settled = true
      disposeTimer()
      resolve(value)
    }, (error) => {
      if (settled) return
      settled = true
      disposeTimer()
      reject(error)
    })
  })
  // 测试用 `DSH_MODEL_USAGE_BACKFILL_TIMEOUT_MS` 把等待压到毫秒级（同写盘防抖的做法）。
  const parsedTimeout = Number(process.env.DSH_MODEL_USAGE_BACKFILL_TIMEOUT_MS)
  const LIST_TIMEOUT_MS = Number.isFinite(parsedTimeout) && parsedTimeout > 0 ? parsedTimeout : 15_000
  // 一次运行可以被视为"卡住"的时长：超过它，新的尝试允许插进来（防自锁的第二道保险）。
  const STALE_RUN_MS = LIST_TIMEOUT_MS * 6

  /**
   * 回填历史日账；只填台账里缺失的日子。
   * @returns {Promise<{state: string, days: number, sessions: number, scanned: number}>} 结果。
   */
  async function runBackfill(query) {
    // `backfillRunning` 是去抖，不是锁：卡住的运行必须能被后来的尝试顶掉，
    // 否则一次挂死就等于这个功能永久失效（重启才恢复，而且每次启动都会重演）。
    if (backfillRunning && Date.now() - backfillStartedAt < STALE_RUN_MS) return backfill
    backfillRunning = true
    backfillStartedAt = Date.now()
    backfillAttempts += 1
    try {
      return await scanBackfill(query)
    } finally {
      // 无论正常返回、抛错还是超时，都必须复位。
      backfillRunning = false
    }
```

</details>

**依据 3 · 源码核查**：[src/index.js:1288-1317](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/index.js#L1288-L1317)

预算在循环边界检查，readSession未限时。

<details>
<summary>查看原文（30行）</summary>

```text
  async function scanBackfill(query) {
    const parsedBudget = Number(process.env.DSH_MODEL_USAGE_BACKFILL_BUDGET_MS)
    const budgetMs = Number.isFinite(parsedBudget) && parsedBudget > 0 ? parsedBudget : 30_000
    const startedAt = Date.now()
    const sessions = await withTimeout(query.listSessions(), LIST_TIMEOUT_MS, 'listSessions')
    // 新的在前：先补最近的日子，用户最容易先看到。
    sessions.sort((a, b) => (b.header.createdAt || 0) - (a.header.createdAt || 0))
    const todayKey = dayKeyOf(new Date())
    const total = sessions.length
    let scanned = 0
    let filled = 0
    let skipped = 0
    let complete = true
    for (const record of sessions) {
      if (Date.now() - startedAt > budgetMs) { complete = false; break }
      // 用**会话头部时间戳**跳过已经补过的日子：读一份日志要解压 + 回放，约 0.27s，
      // 而 589 个会话里绝大多数属于已知日子。不跳过的话，每轮 30 秒预算都被
      // 最新那批已知日子吃光，缺失的老日子永远轮不到——线上表现就是
      // "total 589、scanned 113、days 0、partial"，一轮轮空转。
      // 按天幂等：这一轮补上的日子，下一轮会被这里瞬间跳过，于是逐轮向更早推进。
      if (isSessionDayCovered(record.header && record.header.createdAt)) { skipped += 1; continue }
      let snapshot
      try {
        snapshot = await query.readSession(record.header.id)
      } catch {
        // 单个会话读失败（损坏 / 已被清理）不应中断整轮回填。
        continue
      }
      scanned += 1
      const owned = Array.isArray(snapshot.events) ? snapshot.events.slice(snapshot.inheritedEventCount || 0) : []
```

</details>

**依据 4 · 源码核查**：[src/index.js:46-59](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/index.js#L46-L59)

保留与桶内模型上限。

<details>
<summary>查看原文（14行）</summary>

```text
// 只累加"自本功能上线后"的增量，不做历史回填。保留窗口随数据自然老化，
// 由 MAX_DAYS / MAX_HOURS 约束条目数，避免文件无限增长。
const DAY_MS = 86_400_000
const HOUR_MS = 3_600_000
const MAX_DAYS = 120
const MAX_HOURS = 26
// 快照下发的最近天数，以及其中带 byModel 明细的天数。趋势图只画最近一段，
// 磁盘上保留 MAX_DAYS 是为了日后再放大窗口，不该让每次轮询都传满保留期。
const SERIES_SNAPSHOT_DAYS = 45
const SERIES_DETAIL_DAYS = 32
// 台账里的模型数上限：按 token 量淘汰，防止大量一次性模型把文件撑大。
const MAX_BUCKET_MODELS = 24
// 单个模型在台账里累加的计数字段（与 stats 行同名，便于前端复用同一套读法）。
// toolCalls / toolFailed 来自 session/event 的 tool/call 与 tool/result，按会话的
```

</details>

**依据 5 · 源码核查**：[src/index.js:2199-2209](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/index.js#L2199-L2209)

dispose flush和路由释放。

<details>
<summary>查看原文（11行）</summary>

```text
  ctx.on('dispose', () => {
    disposed = true
    stopWriteTimer()
    flushSync()
    for (const dispose of disposers) {
      try {
        dispose()
      } catch {
        // 忽略卸载期异常。
      }
    }
```

</details>

**依据 6 · 源码核查**：[tests/backfill.test.mjs:25-46](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/tests/backfill.test.mjs#L25-L46)

作者模拟事件测试，未运行。

<details>
<summary>查看原文（22行）</summary>

```text
test('aggregateSessionEvents sums usage per local day', () => {
  const events = [
    { type: 'request/context', time: noonOf(2), data: { provider: 'p', model: 'model-a' } },
    { type: 'assistant/message', time: noonOf(2), data: { usage: { inputTokens: 100, cacheReadTokens: 200, outputTokens: 50 } } },
    { type: 'assistant/message', time: noonOf(2), data: { usage: { inputTokens: 10, outputTokens: 5 } } },
    { type: 'tool/call', time: noonOf(2), data: { name: 'read' } },
    { type: 'tool/result', time: noonOf(2), data: { name: 'read' } },
    { type: 'tool/call', time: noonOf(2), data: { name: 'edit' } },
    { type: 'tool/result', time: noonOf(2), data: { name: 'edit', error: { message: 'boom' } } },
  ]
  const days = aggregateSessionEvents(events, dayKey)
  const entry = days.get(dayKey(noonOf(2)))
  assert.ok(entry, '应有该日的聚合')
  // tokens = 输入 + 缓存读 + 缓存写 + 输出
  assert.equal(entry.tokens, 100 + 200 + 50 + 10 + 5)
  assert.equal(entry.tools, 2, '工具调用只在 tool/call 计数')
  assert.equal(entry.toolFailed, 1, '失败只在 tool/result 带 error 时计数')
  assert.equal(entry.models.get('model-a').calls, 2)
})

test('aggregateSessionEvents follows the most recent model', () => {
  const events = [
```

</details>

#### 缺口

- 掉电、IO拒绝、readSession挂起和卸载交错时的实际行为未复现。
  **影响**：不能给持久统计完整性或有界扫描验收。
  **进一步探讨**：从临时目录与受控假查询的失败点逐一核对磁盘收据、剩余计时器及完成状态。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本、采用和下一层假设是什么？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主插件、历史日志读取与回填IO | 核对包、价表、套餐和密钥地址 | 未测大语料耗时/内存 |
| 持续使用 | 内存聚合、定时写JSON、设置页轮询及可选外网查询 | 维护报价/汇率解释与unknown归因 | 插件不增加专门LLM调用，实际主任务费用不由它消除 |
| 失败恢复 | 备份、重扫与潜在重复后台查询 | 对照缺漏日期和原始usage | 日键不代表完整日账，修复/人工成本未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 实时用量 | 流usage四档采集与工具事件计数 | 全部provider实际字段与并发归因正确 |
| 费用 | 显式价表/套餐/汇率选择 | 当前官方账单一致或节省金额 |
| 历史 | 去继承与缺日扫描 | 同日多会话完整性，控制流有漏计问题 |
| 决策 | 趋势与工具错误线索 | 业务产出质量和采用后净收益 |

建议观察。日常用量面板的场景清楚、价格选择和持久化细节较丰富，但历史完整性和余额凭据去向是先决边界；不按“历史自动补齐”承诺用于对账。读者继续探讨可先做两个同日会话人工加总、查可信baseUrl与key绑定，再阅读并行工具归因，不需要先暴露真实密钥。

未验证假设是以会话/事件稳定ID建立可重放用量账，把每日期望会话集合与扫描watermark分开，费用再绑定有效价版本与采集时间。相较当前“见到日期即完成”，可能既去重又完整；代价是更大索引、版本迁移与删除会话语义。最小对照固定两份同日会话、fork和跨日会话，注入中断重启，比较总token与人工基准、重复数、扫描耗时和状态体积；若完整性改善却资源不可接受，应采用受限窗口方案。此设计未实现，不计当前创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:1317-1335](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/index.js#L1317-L1335)

日期去重不足以代表所有会话，假设起点。

<details>
<summary>查看原文（19行）</summary>

```text
      const owned = Array.isArray(snapshot.events) ? snapshot.events.slice(snapshot.inheritedEventCount || 0) : []
      if (owned.length === 0) continue
      const days = aggregateSessionEvents(owned, (time) => dayKeyOf(new Date(time)))
      for (const [dayKey, totals] of days) {
        if (dayKey === todayKey) continue          // 今天归实时采集
        if (heatBuckets.has(dayKey)) continue      // 已有账（实时采过）→ 不碰，避免重复计算
        heatBuckets.set(dayKey, { tokens: totals.tokens, tools: totals.tools })
        filled += 1
        // 在这一刻累计而不是在函数返回时累计：中途抛错时，已经写进台账的日子
        // 仍然是"恢复过的历史"，不能在计数里丢掉。
        backfillDaysTotal += 1
        // 明细日账只补快照窗口内的日子：它带着逐模型信息，属于"看得见"的范围。
        if (!dayBuckets.has(dayKey) && dayBuckets.size < MAX_DAYS) {
          const bucket = makeBucket()
          for (const [model, counts] of totals.models) addToBucket(bucket, model, counts)
          recomputeBucketTotal(bucket)
          dayBuckets.set(dayKey, bucket)
        }
      }
```

</details>

**依据 2 · 源码核查**：[src/index.js:1640-1674](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/index.js#L1640-L1674)

被动采集不主动发起模型调用。

<details>
<summary>查看原文（35行）</summary>

```text

  // 拦截每次流式模型调用：透传所有 chunk，只采集 usage。
  ctx.on('llm/stream', (options, next) => {
    const provider = options.provider
    const model = options.model
    // 记下该会话最近用的模型，供后面的工具事件归因。
    if (options.sessionId !== undefined && options.sessionId !== null) {
      const sessionKey = String(options.sessionId)
      lastModelBySession.delete(sessionKey)
      lastModelBySession.set(sessionKey, String(model || 'unknown'))
      while (lastModelBySession.size > MAX_TRACKED_SESSIONS) {
        const oldest = lastModelBySession.keys().next().value
        lastModelBySession.delete(oldest)
      }
    }
    const upstream = next()
    return (async function* wrapped() {
      let usage = null
      try {
        for await (const chunk of upstream) {
          if (chunk.type === 'usage') usage = chunk.usage
          yield chunk
        }
      } finally {
        if (usage) {
          record(model, provider, usage)
        } else {
          // 结束但没有 usage：error / aborted / 提前中断的调用，计为失败，
          // 保证每次被拦截的调用都进入统计（不"蒸发"）。
          ensure(model).failed += 1
          schedulePersist()
        }
      }
    })()
  })
```

</details>

**依据 3 · 源码核查**：[src/index.js:972-995](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/index.js#L972-L995)

状态持久化字段包含价格/桶/汇率但非逐事件账本。

<details>
<summary>查看原文（24行）</summary>

```text
  function flushSync() {
    stopWriteTimer()
    try {
      // 落盘前把"当前小时"的进行中明细并入当天台账，避免进程被杀时丢掉最后一小时。
      foldCurrentHourIntoDay()
      trimHeatBuckets()
      const state = {
        version: 7,
        targetCurrency,
        stats: Object.fromEntries(stats),
        prices: Object.fromEntries(prices),
        removed: Array.from(removed),
        dayBuckets: Object.fromEntries(dayBuckets),
        hourBuckets: Object.fromEntries(hourBuckets),
        heatBuckets: Object.fromEntries(heatBuckets),
        heatBackfillRev: heatBackfilled ? HEAT_BACKFILL_REV : 0,
        recoveredDays: backfillDaysTotal,
        balanceBaseUrl,
        balance,
        rates,
        ratesSource,
        ratesUpdatedAt,
        ratesFetchedAt,
      }
```

</details>

**依据 4 · 源码核查**：[src/index.js:1736-1758](https://github.com/AKS1st/model-usage-plugin/blob/a8d1a444ffb02faa2818d12d6f0f1a1c22df1e57/src/index.js#L1736-L1758)

密钥回退与地址边界决定采用前置核对。

<details>
<summary>查看原文（23行）</summary>

```text
      let apiKey = (balanceApiKey || '').trim()
      if (!apiKey) {
        const credentials = ctx.get('credentials')
        if (credentials !== undefined) {
          try {
            const resolved = await credentials.resolve('DEEPSEEK_API_KEY')
            if (resolved && resolved.value) apiKey = resolved.value
          } catch {
            // 凭证解析失败则继续尝试环境变量。
          }
        }
      }
      if (!apiKey && process.env.DEEPSEEK_API_KEY) apiKey = process.env.DEEPSEEK_API_KEY
      if (!apiKey) {
        balance = { status: 'error', total: null, currency: null, infos: [], updatedAt: new Date().toISOString(), message: '未配置 API Key（可在此页填写，或配置 DEEPSEEK_API_KEY）' }
        return false
      }
      const base = (balanceBaseUrl || '').trim() || process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'
      const response = await fetch(base.replace(/\/+$/, '') + '/user/balance', {
        headers: { Authorization: 'Bearer ' + apiKey },
        signal: AbortSignal.timeout(10000),
      })
      const data = await response.json()
```

</details>

#### 缺口

- 同任务使用面板前后的对账时间、误判和实际节约未测。
  **影响**：不能以漂亮趋势图或估算金额证明净收益。
  **进一步探讨**：比较固定语料的人工对账时间、漏记数量和价目调整次数。
- 事件账本与扫描watermark设计未实现。
  **影响**：只是可证伪推导，不提升现有覆盖保证。
  **进一步探讨**：用同日多会话、fork和中断序列比较人工真值及资源开销。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
