# 喵缓存账单

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[bc0d920](https://github.com/Phant0Meow/dsh-meow-cachebilling/tree/bc0d9204813d9106215f30cc31ca7b7fd3f179b7)

<!-- BEGIN META -->
[![GitHub ★ 50](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=50&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Phant0Meow/dsh-meow-cachebilling) [![npm 30d 2,588](https://img.shields.io/static/v1?label=npm+30d&message=2%2C588&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/meow-cachebilling) [![最新发布 2026-10-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/meow-cachebilling)
<!-- END META -->

> **功能**：在 DSH 上下文圆环弹层展示缓存命中、未命中与输出费用，以及逐步、每轮、会话合计和历史花费曲线。

> **亮点**：把缓存读/未命中/输出价格与step/turn/session组织到上下文弹层，并给模型峰谷桶的历史曲线，便于针对当前会话追问费用来源，见 [Q01](#research-q01)至 [Q03](#research-q03)。

> **主要限制**：usage口径与flash兜底不保证现金正确；逐位置平均不是同群体总成本，失效标签非缓存过期证明，历史落盘可降级，见 [Q02](#research-q02)至 [Q04](#research-q04)。

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
  - [Q01 · 它提供计价观察还是已经验证的省费策略？](#detail-section-11)
  - [Q02 · usage怎样变成钱，缺失字段与价格失败如何处理？](#detail-section-12)
  - [Q03 · 曲线代表怎样的群体，落盘失败和退出能保证什么？](#detail-section-13)
  - [Q04 · 界面数字、失效标签和会话切换能推断什么？](#detail-section-14)
  - [Q05 · 怎样小范围试用，换窗假设怎样被推翻？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有DSH用户想理解缓存高命中仍增费，可对一个已知价表会话观察；未匹配模型不作账单，见 [Q01](#research-q01)。

原生usage/token数、供应商实际账单与手工换算。插件提供会话内分价观察和历史形状，不代替结算或自动调度。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 分项账表 | 命中/未命中/输出及三层累计 | usage语义/价格须核，估算非结算 |
| 峰谷/固定价 | 模型与事件时间计价 | 假日异步失败退星期 |
| 历史曲线 | 探索花费增长 | 逐位置平均/桶混合非策略证明 |
| 价表设置 | UI编辑用户层 | Host版本/持久待验 |
| 缓存次数 | usage代理计数 | 不是过期/命中预测 |

**流程与依赖**

#### 依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| DSH Host投影/持久服务 | usage、历史及迁移 | 无engines兼容承诺 |
| Web slots/connection等 | 取数与弹层/设置 | DOM与Host版本需核 |
| 账户实际价表/usage口径 | 分项估算 | flash兜底不是陌生模型结算 |
| settings新旧API | 自定义费率 | 深合成/持久不能凭注释保证 |
| holiday-cn网络 | 可选假日计价/启动预取 | 失败按星期，不完全离线 |

#### 步骤

| 步骤 | 动作 | 判据/退路 |
| --- | --- | --- |
| 准备 | 备份配置/历史，脱敏单会话 | 接受年份预取网络 |
| 定口径 | 固定已知provider/费率 | 核usage缓存字段定义 |
| 观察 | 对照step/turn/session手算 | 无usage/估算不当账单 |
| 看曲线 | 查样本/模型/压缩代 | 不直接选最优换窗点 |
| 退出 | 卸载并刷新Web，核历史/设置清理 | 回日志/官方账单 |

**效果与成本**

#### 成本

| 阶段 | 现金/资源 | 人工 | 未知/风险 |
| --- | --- | --- | --- |
| 首次 | 本地Host/Web与网络 | 价格/语义/兼容核对 | 无已测接入时长 |
| 持续 | 历史磁盘与年份请求 | 维护费率/对账 | 无额外LLM的已核链不等零资源 |
| 失败 | 未落史/旧页面/错误价 | 原始usage与历史分开核 | 不承诺重启补齐 |
| 退出 | 配置/历史仍需处理 | 卸载+页面刷新+备份清理 | Host持久清理未验 |

#### 效果

| 效果 | 支持材料 | 不支持 |
| --- | --- | --- |
| 分项观察 | usage/价表/累计和警告 | 实际现金准确结算 |
| 曲线探索 | 逐位置平均/当前代 | 同群体因果/最优点 |
| 缓存诊断 | read=0/write>0计数 | 过期原因/未来概率 |
| 换窗省费 | 作者自述可提假设 | 本轮独立收益验证 |

> **思考**：usage口径与flash兜底不保证现金正确；逐位置平均不是同群体总成本，失效标签非缓存过期证明，历史落盘可降级，见 [Q02](#research-q02)至 [Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把缓存读/未命中/输出价格与step/turn/session组织到上下文弹层，并给模型峰谷桶的历史曲线，便于针对当前会话追问费用来源，见 [Q01](#research-q01)至 [Q03](#research-q03)。

流式最近样本替换、价格兜底、异步历史失败降级明确；需区分计费展示与持久、事件价格与改价后的重算、平均曲线样本和DOM生命周期，见 [Q02](#research-q02)至 [Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

usage口径与flash兜底不保证现金正确；逐位置平均不是同群体总成本，失效标签非缓存过期证明，历史落盘可降级，见 [Q02](#research-q02)至 [Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

单脱敏会话、已知provider固定实际价，先逐步手算，再观察曲线；不自动换窗或用参考价报销。对不上、切会话串数据或设置不兼容就卸载刷新，回原始usage和官方账单，见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

原生Host/Web入口、usage计价/累计、假日/设置、历史写入/曲线和DOM呈现已静态核查；没有运行宿主、供应商对账、底层storage或受控省费实验。只建议已知模型固定价的脱敏观察试用。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/client.ts、src/index.ts、src/settings.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：package/Host projection、rate编译/匹配/holiday、usage替换/累计、history key/写入/平均、Web DOM与subscription、settings保存/新旧API；未运行、未全审legacy迁移/底层Host存储/全部外部usage适配器或实验。
- 下一步：- 下一步手算一条已知价/原始usage脱敏会话，对照三层累计和官方账单。
- 再核切换/关停/落盘失败与曲线样本；原始日志保留。
- 受控换窗实验需同任务质量与完整资源记录，尚未执行。

**分析版本**

- **仓库**：[Phant0Meow/dsh-meow-cachebilling](https://github.com/Phant0Meow/dsh-meow-cachebilling)
- **版本号**：0.8.0（[固定提交 bc0d920](https://github.com/Phant0Meow/dsh-meow-cachebilling/tree/bc0d9204813d9106215f30cc31ca7b7fd3f179b7)）
- **版本日期**：2026-10-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

同任务同质量的续窗/换窗净成本实验，纳入重读和人类交接；不降总费或质量/时间损失抵消即推翻，原版未实现该策略，见 [Q05](#research-q05)。

- 下一步手算一条已知价/原始usage脱敏会话，对照三层累计和官方账单。
- 再核切换/关停/落盘失败与曲线样本；原始日志保留。
- 受控换窗实验需同任务质量与完整资源记录，尚未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 127 | 80 | 43 | — |
| .js | source | 2 | 32771 | 31489 | 1473 | — |
| .md | source | 2 | 295 | — | — | 4125 |
| .ts | source | 4 | 3330 | 2791 | 372 | — |
| .mjs | test | 3 | 416 | 325 | 54 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/Phant0Meow/dsh-meow-cachebilling/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核usage到价格/累计/历史曲线和界面真实链，区分估算、缓存标签、持久失败与未验证省费策略。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它提供计价观察还是已经验证的省费策略？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

0.8.0是原生Host/Web插件，package同时导出Host、client和bundle patch。Host注册cacheBilling投影，消费会话usage；Web在上下文圆环弹层显示一步、一轮、会话费用分项及历史曲线。面向已用DSH、想理解高缓存命中率为什么仍持续花钱的用户，参照原生token数和手工按供应商价格换算，本项把缓存命中/未命中/输出分价与当前工作界面接起来。它没有自动换窗口或改变模型请求缓存策略，显示不是支出控制。

README两天新窗口策略便宜50.1%是作者自己的特定用量比较，未说明同任务/质量/实际账单控制，不作为本轮验证。作者也明确新窗口要重读代码和人类重述。插件最多支持观察与形成实验假设，不能证明换窗一定节费，更不能将估算金额当供应商结算。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-51](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/package.json#L1-L51)

版本、Host/client导出与原生bundle。

<details>
<summary>查看原文（51行）</summary>

```text
{
  "name": "meow-cachebilling",
  "version": "0.8.0",
  "description": "喵账单：上下文圆环弹层里实时算账——一步/一轮/会话三行各带总价，缓存命中/未命中/输出三列明细的无边框小账表，外加当前模型的平均累计花费曲线（帮你赶在花销起飞前换窗口），峰谷/一口价自动计价（价目表 rates.yml 可手填），专治『缓存命中率 100% 却越用越贵』",
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "billing",
    "cache-hit",
    "cost",
    "peak-offpeak"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Phant0Meow/dsh-meow-cachebilling.git"
  },
  "author": "Phant0Meow",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/index.js",
    "lib/index.js.map",
    "lib/client.js",
    "lib/client.js.map",
    "cordis.patch.yml",
    "rates.yml"
  ],
  "license": "MIT",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-settings-plugins"
      ]
    }
  },
  "scripts": {
    "prepare": "node build.mjs",
    "build": "node build.mjs",
    "watch": "node build.mjs --watch",
    "test": "node tests/settings-mount.mjs && node tests/config-volatile.mjs && node tests/rates-holidays-compat.mjs"
```

</details>

**依据 2 · 源码核查**：[src/index.ts:980-1001](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/index.ts#L980-L1001)

真实投影注册入口。

<details>
<summary>查看原文（22行）</summary>

```text
export function apply(ctx: any, _config: any): void {
  ctx.inject(['sessionProjections'], (projectionCtx: any) => {
    // 新版 0.1.1-rc.2 契约：{ key, stateSchema, init, apply, wire: {viewSchema, view}, stateVersion }
    // 没有 wire 即 host-only 单元，状态不进客户端快照，useProjection 永远拿不到值。
    projectionCtx.sessionProjections.register({
      key: 'cacheBilling',
      // v9：history/prevGen 步目补 hc（该步缓存命中金额，平均缓存曲线的数据底座）——旧持久化行作废重放，重放后所有步自动补上
      stateVersion: 9,
      stateSchema: z.object({
        provider: z.string().nullable(),
        model: z.string().nullable(),
        last: z
          .object({
            turn: z.number().int(),
            step: z.number().int(),
            inputTokens: z.number().int().nonnegative(),
            cacheReadTokens: z.number().int().nonnegative(),
            cacheWriteTokens: z.number().int().nonnegative(),
            outputTokens: z.number().int().nonnegative(),
            model: z.string().nullable(),
            provider: z.string().nullable(),
            time: z.number(),
```

</details>

**依据 3 · 源码核查**：[src/client.ts:535-550](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/client.ts#L535-L550)

订阅cacheBilling投影。

<details>
<summary>查看原文（16行）</summary>

```text
/** 数据挂钩组件：props 由 slots 注入，useProjection 同官方条目。渲染为零尺寸占位，仅保持投影订阅存活并把数据镜像进模块级 store。 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CacheDataHook(props: any) {
  const data: CacheBillingView | undefined =
    typeof props.useProjection === 'function' ? props.useProjection('cacheBilling') : undefined

  ;(0, React.useEffect)(() => {
    latestView = data ?? undefined
    refreshOpenPanels()
  }, [data])

  return React.createElement('span', {
    'data-meow-cachebilling': 'hook',
    'data-meowcb-version': 'cmp-34',
    style: { display: 'none' },
  })
```

</details>

**依据 4 · 作者声明**：[README.md:21-32](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/README.md#L21-L32)

作者两天费用比较，不是独立实验。

<details>
<summary>查看原文（12行）</summary>

```text
这是真的，我试了换窗口勤快的策略，试了两天，然后发现，真的便宜了。


我让GPT给我算的，算法是这样的：

缓存命中实际上都是聊过的上下文，每轮带着，所以显得多。

但未命中的输入和ai输出，才是硬梆梆不能少的实际使用，是不是？

所以或许应该用“实际使用”去衡量两天不同的工作量，并比较两天的性价比。

GPT算出来我勤换窗口时，便宜了50.1%。
```

</details>

**依据 5 · 作者声明**：[README.md:54-79](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/README.md#L54-L79)

作者说明换窗重读与解释成本及观察目的。

<details>
<summary>查看原文（26行）</summary>

```text
换窗口的成本是：

AI需要重读代码的miss输入（可以通过fork减少这项成本）。

你需要重新介绍任务和规则的人力成本（可以通过记忆插件减少这项成本）。


换窗口的收益是：

缓存费用清零、从零开始重新累积。

 

有成本，有收益，所以你需要判断更好的换窗口时机。

 

换的太早：缓存本就不贵、收益少；重读代码miss费用虚耗、且重复说车轱辘话很累。

换的太晚：你的账单早已悄悄被冗长的上下文偷吃干净了。

 

所以我就需要这么一个插件，来告诉我，当前轮，纯粹上下文缓存的部分，到底花了我多少钱。

这样我才能心里有个底，才能判断什么时候该换窗口。
```

</details>

#### 缺口

- 未比较同任务质量下的实际账单及原生费用UI。
  **影响**：能判断适配增量，不能证明净省费或排他优势。
  **进一步探讨**：固定模型/价格/同任务质量，记录全程用量和人工重述成本，再与原生usage/手算对照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · usage怎样变成钱，缺失字段与价格失败如何处理？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

projection消费assistant/chunk的usage与assistant/message最终usage，要求数字turn/step；模型/供应商取最终message.source或之前request状态，time取event.time否则本机Date.now。Number(value)||0把缺失/坏数归零，状态schema另声明非负整数，但本轮未查Host执行schema的具体时机；缺失归零已足以说明显示0不等于确实无费用。公式是cacheRead×hit、input×miss+cacheWrite×write、output×output再除百万；依赖Host将input定义为独立未命中输入，若外部适配器给的是含缓存总输入必须另外核口径，不能直接保证所有路由账单一致。

provider限定条目先于通配，其内部精确再后缀匹配；未命中用内置flash峰谷价matched=false，界面警告参考估算，不能把别的模型真的按flash结算。峰谷用条目时区和事件时刻，const固定价。可选中国节假日从远端取年份表，失败退星期规则；未取到的首批调用也会先按星期算。预取与稍后数据到达可能使重放/视图重算价格改变，并无供应商账单回填保证。配置编译有时区/峰谷重叠等检查和坏条目回落，不能据此说开放dict(any)提供全字段强校验。

同一个最近turn/step样本被替换或相同直接忽略，新step累加；这不是任意乱序历史事件的全局去重。替换时旧样本费用也用当时当前费率重新算，若初次计入后价目改变，不能假定存量累计自动一致重定价；尚未运行复现。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1127-1200](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/index.ts#L1127-L1200)

实际usage来源、数值缺省及最近样本判断。

<details>
<summary>查看原文（74行）</summary>

```text
        // usage 样本，一轮就是一个 step
        let turn: unknown
        let step: unknown
        let usage: any
        let sourceModel: string | undefined
        let sourceProvider: string | undefined
        if (event.type === 'assistant/chunk' && event.data?.chunk?.type === 'usage') {
          turn = event.data.turn
          step = event.data.step
          usage = event.data.chunk.usage
        } else if (event.type === 'assistant/message' && event.data?.usage !== undefined) {
          turn = event.data.turn
          step = event.data.step
          usage = event.data.usage
          const source = event.data.message?.source
          if (typeof source?.provider === 'string') sourceProvider = source.provider
          if (typeof source?.model === 'string') sourceModel = source.model
        } else {
          // 与本单元无关的事件：返回同一引用，驱动以 Object.is 把关变更流
          return state
        }
        if (usage === undefined || typeof turn !== 'number' || typeof step !== 'number') {
          return state
        }

        const sample: Sample = {
          turn,
          step,
          inputTokens: Number(usage.inputTokens) || 0,
          cacheReadTokens: Number(usage.cacheReadTokens) || 0,
          cacheWriteTokens: Number(usage.cacheWriteTokens) || 0,
          outputTokens: Number(usage.outputTokens) || 0,
          model: sourceModel ?? state.model,
          provider: sourceProvider ?? state.provider,
          time: typeof event.time === 'number' ? event.time : Date.now(),
        }

        const prev = state.last
        // 同一 step 的替换样本，chunk 流式到 final message，数据全同则引用不变
        if (
          prev !== null &&
          prev.turn === turn &&
          prev.step === step &&
          prev.inputTokens === sample.inputTokens &&
          prev.cacheReadTokens === sample.cacheReadTokens &&
          prev.cacheWriteTokens === sample.cacheWriteTokens &&
          prev.outputTokens === sample.outputTokens &&
          prev.model === sample.model &&
          prev.provider === sample.provider
        ) {
          return state
        }
        // 新 step 是新一轮，覆盖上一轮；同 step 新样本是替换。
        // 会话累计随之维护：同 step 替换扣旧样本款加新样本款，不增轮数；新 step 整轮累加、轮数加一。失效计数同样遵循替换语义扣旧加新。
        // 当前轮累计：同 turn 累加，turn 切换重置，同 step 替换扣旧加新。
        const billed = computeCosts(sample)
        const current = { hit: billed.hit, miss: billed.miss, output: billed.output }
        const writeMiss = isWriteMiss(sample)
        const fullMiss = isFullMiss(sample)
        const sampleInputTokens = sample.inputTokens + sample.cacheReadTokens + sample.cacheWriteTokens
        // 每步花费入史：只存命中价目表的步（估算步是假数据，不入库），n 按调用计数（估算步也计数）
        const call = nextCall(state.call, turn, step)
        const history =
          billed.matched && sample.provider !== null && sample.model !== null
            ? upsertHistory(state.history, {
                n: call.n,
                t: turn,
                s: step,
                c: round9(billed.hit + billed.miss + billed.output),
                m: historyKey(sample.provider, sample.model, billed.tier),
                mi: billed.miss,
                hc: billed.hit,
              })
            : state.history
```

</details>

**依据 2 · 源码核查**：[src/index.ts:984-1001](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/index.ts#L984-L1001)

投影状态声明与非负整数token schema。

<details>
<summary>查看原文（18行）</summary>

```text
    projectionCtx.sessionProjections.register({
      key: 'cacheBilling',
      // v9：history/prevGen 步目补 hc（该步缓存命中金额，平均缓存曲线的数据底座）——旧持久化行作废重放，重放后所有步自动补上
      stateVersion: 9,
      stateSchema: z.object({
        provider: z.string().nullable(),
        model: z.string().nullable(),
        last: z
          .object({
            turn: z.number().int(),
            step: z.number().int(),
            inputTokens: z.number().int().nonnegative(),
            cacheReadTokens: z.number().int().nonnegative(),
            cacheWriteTokens: z.number().int().nonnegative(),
            outputTokens: z.number().int().nonnegative(),
            model: z.string().nullable(),
            provider: z.string().nullable(),
            time: z.number(),
```

</details>

**依据 3 · 源码核查**：[src/index.ts:518-532](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/index.ts#L518-L532)

真实分项计价公式。

<details>
<summary>查看原文（15行）</summary>

```text
function computeCosts(sample: Sample): {
  hit: number
  miss: number
  output: number
  tier: Tier | null
  matched: boolean
} {
  const { row, tier, matched } = rateOf(sample.provider, sample.model, sample.time)
  return {
    hit: round9((sample.cacheReadTokens * row.hit) / 1e6),
    miss: round9((sample.inputTokens * row.miss + sample.cacheWriteTokens * row.write) / 1e6),
    output: round9((sample.outputTokens * row.output) / 1e6),
    tier,
    matched,
  }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:428-456](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/index.ts#L428-L456)

匹配优先与未命中估算。

<details>
<summary>查看原文（29行）</summary>

```text
function lookupEntry(entries: RateEntry[], providerKey: string | null, key: string): RateEntry | null {
  // 先 provider 限定条目、再通配条目；每轮内部先精确、再后缀
  for (const preferProvider of [true, false]) {
    for (const exactPass of [true, false]) {
      for (const e of entries) {
        if (preferProvider ? e.provider !== providerKey : e.provider !== null) continue
        if (exactPass ? e.model === key : key.endsWith(e.model)) return e
      }
    }
  }
  return null
}

/** 模型在某时刻的费率行。未命中任何条目 → 按内置 flash 表的峰谷口径估算，matched=false 供客户端标注。 */
function rateOf(
  provider: string | null,
  model: string | null,
  timeMs: number,
): { row: RateRow; tier: Tier | null; matched: boolean } {
  const key = (model ?? '').toLowerCase()
  const providerKey = provider ? provider.toLowerCase() : null
  const entry = lookupEntry(mergedEntries, providerKey, key)
  if (entry === null) {
    const peak = inPeak(FALLBACK_ENTRY, timeMs)
    return { row: peak ? FALLBACK_ENTRY.peak! : FALLBACK_ENTRY.valley!, tier: peak ? 'peak' : 'offPeak', matched: false }
  }
  if (entry.kind === 'const') return { row: entry.flat!, tier: null, matched: true }
  const peak = inPeak(entry, timeMs)
  return { row: peak ? entry.peak! : entry.valley!, tier: peak ? 'peak' : 'offPeak', matched: true }
```

</details>

**依据 5 · 源码核查**：[src/index.ts:374-425](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/index.ts#L374-L425)

假日请求失败与未缓存时返回false、峰谷接线。

<details>
<summary>查看原文（52行）</summary>

```text
function fetchHolidayYear(year: number): void {
  if (holidayCache.has(year) || holidayPending.has(year)) return
  if (Date.now() - holidayLastFailAt < HOLIDAY_RETRY_MS) return
  holidayPending.add(year)
  void (async () => {
    try {
      for (const url of HOLIDAY_SOURCES(year)) {
        try {
          const res = await fetch(url, { signal: AbortSignal.timeout(HOLIDAY_TIMEOUT_MS) })
          if (!res.ok) continue
          const data = (await res.json()) as { days?: Array<{ date?: string; isOffDay?: boolean }> }
          const days = Array.isArray(data?.days) ? data.days : []
          const set = new Set<string>()
          for (const d of days) {
            if (typeof d?.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.date) && d.isOffDay === true) {
              set.add(d.date)
            }
          }
          if (set.size === 0) continue // 空数据当源异常，换下一源
          holidayCache.set(year, set)
          console.log(`[meow-cachebilling] ${year} 年法定节假日数据已加载：休假日 ${set.size} 天（holiday-cn）`)
          return
        } catch {
          /* 单源失败换下一源 */
        }
      }
      holidayLastFailAt = Date.now()
      console.warn(
        `[meow-cachebilling] ${year} 年法定节假日数据获取失败，${HOLIDAY_RETRY_MS / 60000} 分钟后随事件重试；期间峰谷按星期口径判定（假日误按峰价的可能性存在）`,
      )
    } finally {
      holidayPending.delete(year)
    }
  })()
}

/** 该时刻是否中国法定节假日（北京日期口径）。数据未就位时触发后台拉取并按 false 判定。 */
function isCnHoliday(timeMs: number): boolean {
  const date = beijingDate(timeMs)
  const year = Number(date.slice(0, 4))
  const set = holidayCache.get(year)
  if (set !== undefined) return set.has(date)
  fetchHolidayYear(year)
  return false
}

function inPeak(entry: RateEntry, timeMs: number): boolean {
  if (entry.holidays && isCnHoliday(timeMs)) return false
  const { day, minutes } = localClock(entry.clock, timeMs)
  const list = entry.peakMinutes?.get(day)
  if (!list) return false
  return list.some(([start, end]) => minutes >= start && minutes < end)
```

</details>

**依据 6 · 源码核查**：[src/index.ts:220-266](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/index.ts#L220-L266)

编译时区/峰谷约束。

<details>
<summary>查看原文（47行）</summary>

```text
function compileEntry(raw: RawEntry, label: string): { ok: true; entry: RateEntry } | { ok: false; error: string } {
  try {
    const timezone = raw.timezone ?? 'Asia/Shanghai'
    // 时区有效性：Intl 不认的名字在这里直接抛，由 catch 转成跳过该条目
    const clock = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
    const base = {
      model: raw.model.toLowerCase(),
      provider: raw.provider ? raw.provider.toLowerCase() : null,
      timezone,
      clock,
      holidays: raw.holidays === true,
      cacheSaving: raw.cacheSaving ?? null,
    }
    if (raw.const) {
      if (raw.peak || raw.valley) throw new Error('const 与 peak/valley 互斥，三选一')
      return { ok: true, entry: { ...base, kind: 'const', flat: resolveRow(raw.const) } }
    }
    if (!raw.peak) throw new Error('缺少计价形态：peak+valley 或 const 三选一')
    if (!raw.valley) throw new Error('peak 需要配套 valley（时段自动取补集，但谷价数字仍要写）')
    const peakMinutes = new Map<number, Array<[number, number]>>()
    for (const group of raw.peak.when) {
      for (const day of group.days) {
        for (const idx of resolveDayDays(day)) {
          const list = peakMinutes.get(idx) ?? []
          for (const line of group.ranges) {
            const [start, end] = parseRange(line)
            if (list.some(([s, e]) => start < e && s < end)) throw new Error(`峰时段与已有区间重叠：${line}`)
            list.push([start, end])
          }
          peakMinutes.set(idx, list.sort((a, b) => a[0] - b[0]))
        }
      }
    }
    return {
      ok: true,
      entry: { ...base, kind: 'peakvalley', peak: resolveRow(raw.peak), valley: resolveRow(raw.valley), peakMinutes },
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}
```

</details>

**依据 7 · 源码核查**：[src/index.ts:1201-1285](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/index.ts#L1201-L1285)

同最近step替换重算/新step累计分支。

<details>
<summary>查看原文（85行）</summary>

```text
        if (prev !== null && prev.turn === turn && prev.step === step) {
          const old = costOf(prev)
          const prevInputTokens = prev.inputTokens + prev.cacheReadTokens + prev.cacheWriteTokens
          const turnBase =
            state.turn !== null && state.turn.id === prev.turn
              ? state.turn
              : {
                  id: turn,
                  hitCost: 0,
                  missCost: 0,
                  outputCost: 0,
                  inputTokens: 0,
                  cacheReadTokens: 0,
                  outputTokens: 0,
                }
          return {
            ...state,
            last: sample,
            call,
            history,
            turn: {
              ...turnBase,
              id: turn,
              hitCost: turnBase.hitCost - old.hit + current.hit,
              missCost: turnBase.missCost - old.miss + current.miss,
              outputCost: turnBase.outputCost - old.output + current.output,
              inputTokens: turnBase.inputTokens - prevInputTokens + sampleInputTokens,
              cacheReadTokens:
                turnBase.cacheReadTokens - prev.cacheReadTokens + sample.cacheReadTokens,
              outputTokens: turnBase.outputTokens - prev.outputTokens + sample.outputTokens,
            },
            totals: {
              cacheHitCost: state.totals.cacheHitCost - old.hit + current.hit,
              missCost: state.totals.missCost - old.miss + current.miss,
              outputCost: state.totals.outputCost - old.output + current.output,
              inputTokens: state.totals.inputTokens - prevInputTokens + sampleInputTokens,
              cacheReadTokens:
                state.totals.cacheReadTokens - prev.cacheReadTokens + sample.cacheReadTokens,
              outputTokens: state.totals.outputTokens - prev.outputTokens + sample.outputTokens,
              rounds: state.totals.rounds,
              missSteps: state.totals.missSteps - (isWriteMiss(prev) ? 1 : 0) + (writeMiss ? 1 : 0),
              writeTokens: state.totals.writeTokens - prev.cacheWriteTokens + sample.cacheWriteTokens,
              fullMissSteps:
                state.totals.fullMissSteps - (isFullMiss(prev) ? 1 : 0) + (fullMiss ? 1 : 0),
            },
          }
        }
        const sameTurn = state.turn !== null && state.turn.id === turn
        return {
          ...state,
          last: sample,
          call,
          history,
          turn: sameTurn
            ? {
                ...state.turn!,
                hitCost: state.turn!.hitCost + current.hit,
                missCost: state.turn!.missCost + current.miss,
                outputCost: state.turn!.outputCost + current.output,
                inputTokens: state.turn!.inputTokens + sampleInputTokens,
                cacheReadTokens: state.turn!.cacheReadTokens + sample.cacheReadTokens,
                outputTokens: state.turn!.outputTokens + sample.outputTokens,
              }
            : {
                id: turn,
                hitCost: current.hit,
                missCost: current.miss,
                outputCost: current.output,
                inputTokens: sampleInputTokens,
                cacheReadTokens: sample.cacheReadTokens,
                outputTokens: sample.outputTokens,
              },
          totals: {
            cacheHitCost: state.totals.cacheHitCost + current.hit,
            missCost: state.totals.missCost + current.miss,
            outputCost: state.totals.outputCost + current.output,
            inputTokens: state.totals.inputTokens + sampleInputTokens,
            cacheReadTokens: state.totals.cacheReadTokens + sample.cacheReadTokens,
            outputTokens: state.totals.outputTokens + sample.outputTokens,
            rounds: state.totals.rounds + 1,
            missSteps: state.totals.missSteps + (writeMiss ? 1 : 0),
            writeTokens: state.totals.writeTokens + sample.cacheWriteTokens,
            fullMissSteps: state.totals.fullMissSteps + (fullMiss ? 1 : 0),
          },
        }
```

</details>

#### 缺口

- 未绑定全部Host usage适配器定义、价格变更重放和真实供应商结算。
  **影响**：多路由/改价/延迟样本不能直接作财务依据。
  **进一步探讨**：用同一已知provider小样本逐字段对照原始usage与官方账单，固定价目，再测晚到最终消息/改价重放。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 曲线代表怎样的群体，落盘失败和退出能保证什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

historyDomain保存会话逐调用费用、命中费用与模型标记。只收session-前缀窗口，历史key将provider/model别名归并并分peak/offPeak/const，没有账号、工作区、费率版本维度。平均只取updatedAt在30天内且匹配key的记录，按调用位置分别取当步有样本者均值再累加；它不是同一组会话全程总成本的简单平均，后段幸存任务/不同难度混合可能影响趋势。compaction分代可各成为一条记录；当前曲线含当前代全部精确步（可含换模型前），平均只按当前模型桶，图上不能无条件作同口径因果比较。curveCache只按historyVersion/key，不含时钟；若无更新，超过30天边界不会仅因时间自动重算。30天参与窗口不等已核永久清除策略。

usage/assistant事件2秒延迟flush，turn/end和compaction/summary触发flush，session/disposed亦flush；put为异步失败只警告，成功才增加historyVersion。storageDomain开失败仅曲线降级，当前计价仍可见；这意味着有面板数据不代表已持久。卸载只clear待写timer，close也不await全部pending，不能声称最后两秒/崩溃都不丢。迁移被异步启动，本轮未全面审迁移与底层storage原子性。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:550-579](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/index.ts#L550-L579)

窗口ID与key归并/分桶。

<details>
<summary>查看原文（30行）</summary>

```text
function isWindowSessionId(id: string): boolean {
  return id.startsWith('session-')
}

/** 记录键 → 会话 id（剥掉换代后缀 `#n`）。 */
function baseSessionId(recordId: string): string {
  return recordId.includes('#') ? recordId.slice(0, recordId.lastIndexOf('#')) : recordId
}

/** 历史桶的模型名/路由名归并表：只影响曲线分桶（平均曲线的归组），不影响价目匹配。
 * ①deepseek-flash 官方统一命名（旧数据文件里是旧名，issue #4）；②官方 api-key 与账号
 * 两条路由同价同刊例，分开记只会让曲线各自没数据（issue #5）。其余模型/路由原样保留。 */
const MODEL_KEY_ALIASES: Record<string, string> = {
  'deepseek-v4.1-flash': 'deepseek-flash',
  'deepseek-v4-flash': 'deepseek-flash',
  'deepseek-v4-flash-vision-exp': 'deepseek-flash',
  'deepseek-v4-pro-0813': 'deepseek-v4-pro',
}
const PROVIDER_KEY_ALIASES: Record<string, string> = {
  'deepseek-official': 'deepseek',
  'deepseek-account': 'deepseek',
}
const canonKeySegment = (aliases: Record<string, string>, segment: string): string =>
  aliases[segment.toLowerCase()] ?? segment.toLowerCase()

/** 模型键："provider/model/tierWord"，峰谷分开当两个模型（tierWord: peak|valley|const）。
 * 落盘前先归并旧名——新数据直接写进规范桶。 */
function historyKey(provider: string, model: string, tier: Tier | null): string {
  const word = tier === 'peak' ? 'peak' : tier === 'offPeak' ? 'valley' : 'const'
  return `${canonKeySegment(PROVIDER_KEY_ALIASES, provider)}/${canonKeySegment(MODEL_KEY_ALIASES, model)}/${word}`
```

</details>

**依据 2 · 源码核查**：[src/index.ts:623-628](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/index.ts#L623-L628)

实际历史domain定义。

```text
/** 跨会话历史域：走官方存储层，落成 DSH home 下的 meow_cachebilling.json（与 workspace.json 同层）。 */
const historyDomain = defineDomain({
  name: 'meow_cachebilling',
  version: 1,
  tables: { sessions: domainTable(historyRecordSchema) },
})
```

**依据 3 · 源码核查**：[src/index.ts:672-750](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/index.ts#L672-L750)

逐位置平均、updatedAt筛选、版本缓存和当前曲线。

<details>
<summary>查看原文（79行）</summary>

```text
function averageCurve(key: string): { avg: number[]; avgHit: number[]; sessions: number } {
  if (curveCache !== null && curveCache.version === historyVersion && curveCache.key === key) {
    return curveCache.result
  }
  const empty = { avg: [] as number[], avgHit: [] as number[], sessions: 0 }
  if (historyTable === null) {
    curveCache = { version: historyVersion, key, result: empty }
    return empty
  }
  const now = Date.now()
  let maxN = 0
  let sessions = 0
  const buckets = new Map<number, { sum: number; count: number; hitSum: number; hitCount: number }>()
  for (const [recordId, record] of historyTable.entries()) {
    if (!isWindowSessionId(baseSessionId(recordId))) continue
    if (now - record.updatedAt > RETENTION_MS) continue
    let current = ''
    let hit = false
    for (const step of record.steps) {
      const mark = record.marks[String(step.n)]
      if (mark !== undefined) current = normalizeMarkKey(mark)
      if (current !== key) continue
      hit = true
      if (step.n > maxN) maxN = step.n
      const bucket = buckets.get(step.n) ?? { sum: 0, count: 0, hitSum: 0, hitCount: 0 }
      bucket.sum += step.c
      bucket.count += 1
      if (step.hc !== undefined) {
        bucket.hitSum += step.hc
        bucket.hitCount += 1
      }
      buckets.set(step.n, bucket)
    }
    if (hit) sessions += 1
  }
  let result = empty
  if (maxN > 0) {
    const avg: number[] = []
    const avgHit: number[] = []
    let cum = 0
    let cumHit = 0
    let anyHit = false
    for (let k = 1; k <= maxN; k++) {
      const bucket = buckets.get(k)
      if (bucket !== undefined) cum += bucket.sum / bucket.count
      if (bucket !== undefined && bucket.hitCount > 0) {
        cumHit += bucket.hitSum / bucket.hitCount
        anyHit = true
      }
      avg.push(round9(cum))
      avgHit.push(round9(cumHit))
    }
    result = { avg, avgHit: anyHit ? avgHit : [], sessions }
  }
  curveCache = { version: historyVersion, key, result }
  return result
}

/** 曲线块视图数据：key=当前模型键，sessions=平均参与会话数，avg=平均累计（步 1..N 稠密），avgHit=平均缓存累计（同算法同 x 轴，仅带 hc 数据的步参与；空数组=无数据不画），cur=本会话实际累计 [[n, 累计]...]（全部精确步，含换模型前的步——钱包真实轨迹）。 */
interface CurveView {
  key: string
  sessions: number
  avg: number[]
  avgHit: number[]
  cur: Array<[number, number]>
}

function buildCurve(state: ProjectionState, tier: Tier | null, matched: boolean): CurveView | null {
  const s = state.last
  if (s === null || !matched || s.provider === null || s.model === null) return null
  const key = historyKey(s.provider, s.model, tier)
  const { avg, avgHit, sessions } = averageCurve(key)
  let cum = 0
  const cur = state.history.map((e): [number, number] => {
    cum = round9(cum + e.c)
    return [e.n, cum]
  })
  if (avg.length === 0 && cur.length === 0) return null
  return { key, sessions, avg, avgHit, cur }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:753-865](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/index.ts#L753-L865)

flush异步put、事件/timer与卸载清timer。

<details>
<summary>查看原文（113行）</summary>

```text
/** 历史落盘：投影 state.history 是唯一事实（重放可重建），这里只做搬运——usage 事件防抖 2s，turn/end 与会话关闭即写，写失败仅警告。
 * 压缩换代后双记录：当前代写 `会话id#gen`（gen 0 沿用裸会话 id，与旧记录兼容），上一代归档写成独立样本（内容 immutable，写一次即可）。 */
function installHistoryRecorder(ctx: any, table: KvTable<string, HistoryRecord>): void {
  const timers = new Map<string, ReturnType<typeof setTimeout>>()
  const archivedFlushed = new Map<string, number>()
  const flush = (session: any): void => {
    try {
      // 子代理（裸 UUID）与投影窗（fem-proj-* 等）不入史：每步模式与主线会话不可比
      if (!isWindowSessionId(String(session.id))) return
      const state = ctx.sessionProjections.stateOf(session, 'cacheBilling') as
        | ProjectionState
        | undefined
      if (state === undefined) return
      const createdAt =
        typeof session.header?.createdAt === 'number' ? session.header.createdAt : Date.now()
      const warn = (what: string, e: unknown): void => {
        console.warn(`[meow-cachebilling] 历史落盘失败（不影响账单）：${what}`, e)
      }
      const gen = state.gen
      const recordId = gen === 0 ? String(session.id) : `${session.id}#${gen}`
      if (state.history.length > 0) {
        const record: HistoryRecord = {
          createdAt,
          updatedAt: Date.now(),
          // 白名单必须带 mi/hc：hc 是消耗比较（读代码=c−hc）与平均缓存曲线的落盘数据底座（cmp-21 曾漏改此处，历史域落盘全被剥成裸四列）；mi 已无读取方、随行保留兼容旧记录
          steps: state.history.map(({ n, t, s, c, mi, hc }) => ({ n, t, s, c, mi, hc })),
          marks: deriveMarks(state.history),
          gen,
        }
        table
          .put(recordId, record)
          .then(() => {
            historyVersion += 1
          })
          .catch((e: unknown) => {
            warn(recordId, e)
          })
      }
      const archive = state.prevGen
      if (
        archive !== null &&
        archive.steps.length > 0 &&
        (archivedFlushed.get(String(session.id)) ?? -1) < archive.gen
      ) {
        const archiveId =
          archive.gen === 0 ? String(session.id) : `${session.id}#${archive.gen}`
        const archiveRecord: HistoryRecord = {
          createdAt,
          updatedAt: archive.updatedAt,
          // 归档白名单：mi 剥离（读代码改按 c−hc 取数，无须此列）；hc 保留（平均缓存跨代统计，与总价同权）
          steps: archive.steps.map(({ n, t, s, c, hc }) => ({ n, t, s, c, hc })),
          marks: { ...archive.marks },
          gen: archive.gen,
        }
        table
          .put(archiveId, archiveRecord)
          .then(() => {
            archivedFlushed.set(String(session.id), archive.gen)
            historyVersion += 1
          })
          .catch((e: unknown) => {
            warn(archiveId, e)
          })
      }
    } catch (e) {
      console.warn('[meow-cachebilling] 历史读取失败（不影响账单）：', e)
    }
  }
  ctx.on('session/event', (session: any, event: any) => {
    // 子代理/投影窗不监听不落盘
    if (!isWindowSessionId(String(session.id))) return
    // 压缩提交即写归档：手动压缩发生在 turn 之间，没有随后的 turn/end，不等防抖
    if (event.type === 'compaction/summary') {
      flush(session)
      return
    }
    if (event.type === 'turn/end') {
      const pending = timers.get(session.id)
      if (pending !== undefined) {
        clearTimeout(pending)
        timers.delete(session.id)
      }
      flush(session)
      return
    }
    const usage =
      (event.type === 'assistant/chunk' && event.data?.chunk?.type === 'usage') ||
      (event.type === 'assistant/message' && event.data?.usage !== undefined)
    if (!usage || timers.has(session.id)) return
    timers.set(
      session.id,
      setTimeout(() => {
        timers.delete(session.id)
        flush(session)
      }, 2000),
    )
  })
  ctx.on('session/disposed', (session: any) => {
    const pending = timers.get(session.id)
    if (pending !== undefined) {
      clearTimeout(pending)
      timers.delete(session.id)
    }
    flush(session)
  })
  ctx.effect(
    () => () => {
      for (const timer of timers.values()) clearTimeout(timer)
      timers.clear()
    },
    'meow-cachebilling.historyTimers',
  )
}
```

</details>

**依据 5 · 源码核查**：[src/index.ts:1552-1572](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/index.ts#L1552-L1572)

开域/关闭/异步迁移与降级。

<details>
<summary>查看原文（21行）</summary>

```text
  // ── 每步花费历史：开域 + 录盘（曲线块的数据底座，失败只降级不炸）──
  ctx.storageDomain
    .open(historyDomain)
    .then((domain: any) => {
      const table = domain.table('sessions') as KvTable<string, HistoryRecord>
      historyTable = table
      ctx.effect(
        () => () => {
          historyTable = null
          void domain.close()
        },
        'meow-cachebilling.historyDomain',
      )
      installHistoryRecorder(ctx, table)
      // 旧记录迁移（v6 时代的压缩两段连记 → 按日志里的 compaction/summary 拆代），逐条 fail-soft
      void migrateLegacyRecords(ctx, table)
      console.log('[meow-cachebilling] 历史域已打开：meow_cachebilling')
    })
    .catch((e: unknown) => {
      console.warn('[meow-cachebilling] 历史域打开失败（曲线块降级，账单不受影响）：', e)
    })
```

</details>

#### 缺口

- 未验底层持久/迁移/崩溃与真实曲线样本分布。
  **影响**：曲线只作探索，不承诺完整账本/30天自动删除/最优换窗点。
  **进一步探讨**：在脱敏副本查两种长度会话、换模型/压缩分代及put失败/关停，逐条比记录和图，保留原始日志。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 界面数字、失效标签和会话切换能推断什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

CacheDataHook把投影写模块latestView，MutationObserver按dialog角色和中英文aria-label匹配上下文弹层，再插入账表，不是稳定独立页面API。无usage显示暂无Token，没匹配价格明确警告；非有限数部分UI回退0，只是显示兜底。Host应保证订阅与当前会话对应，本项没有在latestView绑定session id，不能仅据一个React hook证明多会话并存/切换绝不串展示。

完全失效按有输入且cacheRead为0计数，写入次数按cacheWrite>0；这只能证明usage报告形状，不能证明服务端缓存已过期、前缀变更原因或下次命中概率。首次未缓存调用和适配器缺失字段都要区分。“缓存时间估算”“现在失效可能”仍明确暂未实现。所谓读代码成本来自前几轮未命中/输出的启发式归类，不是跟踪文件读取账单。

startPanelBridge确实返回disconnect observer/remove resize disposer，但apply调用未收返回；React effect也未清latestView。存在热重载后残留observer/旧数据的条件性风险，未运行复现，不称每次卸载都会串数据。退出应刷新整个Web页并复核插件卸载，而不只隐藏弹层。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.ts:151-194](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/client.ts#L151-L194)

DOM匹配、无usage与未匹配价格提示。

<details>
<summary>查看原文（44行）</summary>

```text
/** 官方弹层判定：role=dialog 加 aria-label 双语匹配上下文圆环弹层，官方 trigger 的 aria-haspopup=dialog，panel 的 aria-label 为「上下文已用」或「of context used」。 */
function isContextPanel(node: Node): node is HTMLElement {
  if (!(node instanceof HTMLElement)) return false
  if (node.getAttribute('role') !== 'dialog') return false
  const label = node.getAttribute('aria-label') ?? ''
  return /of context used|上下文已用/i.test(label)
}

/** 用最新投影刷新账单区块内容，区块骨架已在贴装时建好。 */
function renderBill(bill: HTMLElement): void {
  const doc = bill.ownerDocument
  if (!doc) return
  bill.textContent = ''

  const view = latestView
  const put = (el: HTMLElement): void => {
    bill.appendChild(el)
  }

  if (!view || !isBillableProvider(view.provider)) {
    // 无 provider 或无投影：什么都不贴，宁可不算。
    return
  }

  if (view.available !== true) {
    const empty = doc.createElement('div')
    empty.className = 'meowcb_foot'
    empty.textContent = '缓存账单：本会话暂无 Token 用量'
    put(empty)
    return
  }

  const cost = Number.isFinite(view.cost) ? (view.cost as number) : 0
  const missCost = Number.isFinite(view.missCost) ? (view.missCost as number) : 0
  const outputCost = Number.isFinite(view.outputCost) ? (view.outputCost as number) : 0
  const symbol = view.currency === 'USD' ? '$' : '¥'

  // 未命中价目表的醒目提示行仍在最顶：金额是 flash 价估算，不能穿着精确数据的外衣
  if (view.priceMatched === false) {
    const notice = doc.createElement('div')
    notice.className = 'meowcb_notice'
    notice.textContent =
      '［喵缓存账单］当前模型无价格数据，请去设置界面添加。以下为Deepseek价格，仅供参考：'
    put(notice)
```

</details>

**依据 2 · 源码核查**：[src/client.ts:427-449](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/client.ts#L427-L449)

失效次数标签和两个未实现占位。

<details>
<summary>查看原文（23行）</summary>

```text
      row.appendChild(lab)
      const num = doc.createElement('span')
      num.className = 'meowcb_cmpv'
      num.textContent = value
      row.appendChild(num)
      side.appendChild(row)
    }
    // 完全失效：有输入但缓存命中为 0（官方路由也可靠推导）；缓存失效次数：写入即失效，仅部分中转报值
    const fullMissSteps = Number.isFinite(view.sessionFullMissSteps)
      ? (view.sessionFullMissSteps as number)
      : 0
    statRow('完全失效次数', `${fullMissSteps} 次`, '有输入但缓存命中为 0 的调用次数，任何路由都可靠')
    const missSteps = Number.isFinite(view.sessionMissSteps) ? (view.sessionMissSteps as number) : 0
    if (missSteps > 0) {
      statRow(
        '缓存失效次数',
        `${missSteps} 次`,
        '发生过缓存写入的调用次数，写入即前缀变更；官方 API 不报此字段，仅部分中转有值',
      )
    }
    // 猫猫预留位：数据源口径待定义，先明示「暂未实现」（2026-09-01 猫猫要求）
    statRow('缓存时间估算', '暂未实现')
    statRow('现在失效可能', '暂未实现')
```

</details>

**依据 3 · 源码核查**：[src/index.ts:945-951](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/index.ts#L945-L951)

失效代理判据。

```text

/** 缓存失效判定：发生过缓存写入。写入即失效，官方不报写入，多数路由为 false。 */
const isWriteMiss = (s: Sample): boolean => s.cacheWriteTokens > 0

/** 完全失效判定：有输入但缓存命中为 0，整条上下文缓存全没吃上。由 cacheReadTokens 推导，任何路由都可靠，首轮无缓存可命中也算，近似。 */
const isFullMiss = (s: Sample): boolean =>
  s.inputTokens + s.cacheReadTokens + s.cacheWriteTokens > 0 && s.cacheReadTokens === 0
```

**依据 4 · 源码核查**：[src/index.ts:1409-1438](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/index.ts#L1409-L1438)

前几轮读代码成本代理与反事实全miss。

<details>
<summary>查看原文（30行）</summary>

```text
          const totalInput = s.inputTokens + s.cacheReadTokens + s.cacheWriteTokens
          const { row, tier, matched } = rateOf(s.provider, s.model, s.time)
          const cost = round9((s.cacheReadTokens * row.hit) / 1e6)
          const missCost = round9((s.inputTokens * row.miss + s.cacheWriteTokens * row.write) / 1e6)
          const outputCost = round9((s.outputTokens * row.output) / 1e6)
          const turn = state.turn
          // 消耗比较块「读代码」：跨代（归档段+当前代）按轮归组，取轮序号最小的两个 turn 的 miss+output 之和（c=命中+未命中+输出、hc=命中，未命中+输出=c−hc）——AI 开窗头两轮集中读代码的代价
          const turnRead = new Map<number, number>()
          for (const e of [
            ...(state.prevGen === null ? [] : state.prevGen.steps),
            ...state.history,
          ]) {
            turnRead.set(e.t, (turnRead.get(e.t) ?? 0) + Math.max(0, e.c - (e.hc ?? 0)))
          }
          const firstTurns = [...turnRead.keys()].sort((a, b) => a - b).slice(0, 2)
          const readCode = round9(firstTurns.reduce((sum, t) => sum + (turnRead.get(t) ?? 0), 0))
          // 「缓存失效」：当前上下文全量 token（= 圆环「上下文已用」，人+AI+工具都在里面）按当前 miss 单价折算——本轮 AI 刚输出的 token 下一轮才进上下文，不预支
          const fullMiss = round9((totalInput * row.miss) / 1e6)
          return {
            available: totalInput > 0 || s.outputTokens > 0,
            cost,
            missCost,
            outputCost,
            currency: 'CNY' as const,
            cacheReadTokens: s.cacheReadTokens,
            totalInputTokens: totalInput,
            outputTokens: s.outputTokens,
            hitRate:
              totalInput > 0 ? Math.round((s.cacheReadTokens / totalInput) * 1000) / 10 : null,
            model: s.model,
```

</details>

**依据 5 · 源码核查**：[src/client.ts:502-550](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/client.ts#L502-L550)

observer disposer和模块latestView更新。

<details>
<summary>查看原文（49行）</summary>

```text
export function startPanelBridge(): () => void {
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') {
    return () => {}
  }
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (isContextPanel(node)) {
          ensureBill(node)
          return
        }
        if (node instanceof HTMLElement) {
          const dialogs = node.querySelectorAll<HTMLElement>('[role="dialog"]')
          for (const dlg of dialogs) {
            if (isContextPanel(dlg)) {
              ensureBill(dlg)
              return
            }
          }
        }
      }
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
  // 手机上地址栏收展/旋转会改变可视区高度，弹层的精确上限跟着重算（refreshOpenPanels 内部会顺带 fit）
  const onViewportResize = (): void => refreshOpenPanels()
  window.visualViewport?.addEventListener('resize', onViewportResize)
  return () => {
    observer.disconnect()
    window.visualViewport?.removeEventListener('resize', onViewportResize)
  }
}

/** 数据挂钩组件：props 由 slots 注入，useProjection 同官方条目。渲染为零尺寸占位，仅保持投影订阅存活并把数据镜像进模块级 store。 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CacheDataHook(props: any) {
  const data: CacheBillingView | undefined =
    typeof props.useProjection === 'function' ? props.useProjection('cacheBilling') : undefined

  ;(0, React.useEffect)(() => {
    latestView = data ?? undefined
    refreshOpenPanels()
  }, [data])

  return React.createElement('span', {
    'data-meow-cachebilling': 'hook',
    'data-meowcb-version': 'cmp-34',
    style: { display: 'none' },
  })
```

</details>

**依据 6 · 源码核查**：[src/client.ts:562-599](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/client.ts#L562-L599)

apply调用bridge未收disposer及真实slot/settings接线。

<details>
<summary>查看原文（38行）</summary>

```text
export function apply(ctx: any): void {
  // 版本标记：排障用，每次改动 bump——rev 滞后时看控制台标记就知道浏览器跑的是哪一版
  console.log('[meow-cachebilling] client bundle: cmp-34')
  // 覆盖式注入：外壳重注入插件时旧 style 标签仍在 document 里，只判空插入会让升级后的新样式永远进不来
  if (typeof document !== 'undefined') {
    let tag = document.querySelector<HTMLStyleElement>(`style[data-plugin-css="${CSS_ID}"]`)
    if (tag === null) {
      tag = document.createElement('style')
      tag.dataset.plugin = 'meow-cachebilling'
      tag.dataset.pluginCss = CSS_ID
      document.head.appendChild(tag)
    }
    tag.textContent = CSS
  }
  if (typeof document !== 'undefined') {
    startPanelBridge()
  }
  // 数据挂钩仍走 slots：拿到 slots 注入的 useProjection，同官方条目的取数通道。
  ctx.slots.inject('conversation.input.right', () => {
    const dispose = ctx.slots.register(
      {
        name: 'conversation.input.right',
        id: 'meow-cachebilling-data-hook',
        order: 1,
      },
      CacheDataHook,
    )
    return () => {
      dispose()
    }
  })
  // 设置页模块（独立文件 src/settings.ts，不掺和账单渲染）：探针阶段失败也只警告，绝不影响账单。
  try {
    applySettings(ctx)
  } catch (e) {
    console.warn('[meow-cachebilling] 设置页注册失败（不影响账单）：', e)
  }
}
```

</details>

#### 缺口

- 未实测多会话切换、语言/DOM版本和卸载热加载。
  **影响**：面板应与已知会话手算核对，不能把标签当缓存诊断或未来预测。
  **进一步探讨**：快速切换两条不同usage会话、改locale/重载/卸载后核数据与observer，异常先刷新并回原始日志。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样小范围试用，换窗假设怎样被推翻？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

仅建议已有兼容本地DSH/Web的用户，选一个脱敏已知provider会话，先备份配置/历史，固定并核准该账户实际价格与usage字段，不用陌生模型的flash兜底作决策。逐step手算与面板对照，再观察step/turn/session和当前曲线；暂不据平均曲线自动切窗或记账。新旧设置API分别走register/watch与describe/document-updated/15秒轮询；新路径合成是顶层spread，并非任意嵌套字段深合并。客户端settingsScope/configForms软接线写scope.set，显示写失败；底层持久/远程授权仍由Host负责，未在本项核准所有版本。

必需sessionProjections/storageDomain/sessionPersistence，Web需slots/connection/sessions/remote/settingsSchema。包未声明Node或Host engines，不能伪造兼容下限；源码对0.1.6/0.1.7分支不等本轮验收。无额外LLM生成调用的已核计价链不代表完全离线：startup预取当年/次年holiday-cn，依次jsdelivr/rawgithub，8秒超时/30分钟失败冷却，外部可见网络元数据；请求只按年份，不上传会话正文。首次人工核费率/语义和兼容，持续存储历史/维护价格/对账，失败要区分未落史与界面成功，退出卸载+刷新、依Host清理设置/历史。现金节省和人工耗时未知。

未验证方向是把换窗建议改成受任务质量约束的净成本实验：同模型同价同一组任务，随机交替续窗与定点新窗，记录缓存读写/输出、重读代码、总结交接与人类重述时间及完成质量，不能只比某一窗口。若总费用不降、质量降低或人工成本抵消，就推翻省费建议；原版只显示曲线，没有实现此实验/策略，不给经济创新分。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1476-1549](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/index.ts#L1476-L1549)

真实双设置API/顶层合成和重编译轮询。

<details>
<summary>查看原文（74行）</summary>

```text
  // ── 设置命名空间：双层价目表的用户层 ──
  // base = 预填层（rates.yml，构建期生成进 cordis.patch.yml 的组合层——0.1.7 的设置
  // 页 base 视图读的就是它），user = 设置页/手编 settings.yaml；field 级覆盖，unset 回落预填。
  // 0.1.6 上 scope.watch → onChange → 重编译合成层：设置页改价目即时生效，无需重启。
  let currentGetter: () => unknown = (): unknown => PREFILL_RAW
  const recompile = (): void => {
    recompileMerged(currentGetter())
  }
  // dsh 0.1.7 起设置服务只剩 describe/update/mutate（register/installSection 均被移除），
  // bundled 旧 installSettingsSection 会在 ctx.inject 回调里异步炸掉——外面 try/catch
  // 够不着，只能静默失败。故按服务能力在回调内分流：
  ctx.inject(['settings'], (sctx: { settings: unknown }) => {
    const settings = sctx.settings as {
      register?: (ns: string, schema: unknown, opts: { base: unknown; validate?: (v: unknown) => void }) =>
        { get: () => unknown; watch: (cb: () => void) => unknown }
      describe?: () => Array<{ ns: string; user?: unknown }>
    }
    // ── dsh ≤0.1.6：register 还在，bundled 旧链路原样（register + watch 即时生效）──
    if (typeof settings.register === 'function') {
      try {
        installSettingsSection(ctx, SETTINGS_NS, sz.dict(sz.any()), PREFILL_RAW, {
          // RPC 写入的严格校验：任何一条编不过就拒写（手编 settings.yaml 不走这里，由 recompile 防御性回落兜底）
          validate: (value: unknown): void => {
            for (const [key, item] of Object.entries(value as Record<string, RawEntry>)) {
              const r = compileEntry(item as RawEntry, `settings · ${key}`)
              if (!r.ok) throw new Error(`条目 ${key}：${r.error}`)
            }
          },
          setSource: (get: () => unknown): void => {
            currentGetter = get
          },
          onChange: (): void => {
            recompile()
          },
        })
      } catch (e) {
        console.warn('[meow-cachebilling] 设置命名空间注册失败（账单继续使用预填层）：', e)
      }
      return
    }
    // ── dsh 0.1.7：宿主自管合成（预填 ⊕ describe().user）──
    // RPC 写入不再有 validate 闸（服务端 schema=dict(any)），坏条目由 recompileMerged
    // 逐键回落预填，与手编 settings.yaml 的防线同一道。变更感知：document-updated 事件
    // 能收到就即时重编译；事件面不可达时靠 15s 兜底轮询（快照串比对，无变化零动作）。
    currentGetter = (): unknown => {
      try {
        const desc = settings.describe?.().find((d) => d.ns === SETTINGS_NS)
        const user = (desc?.user ?? {}) as Record<string, RawEntry>
        return { ...PREFILL_RAW, ...user }
      } catch {
        return PREFILL_RAW
      }
    }
    recompile()
    try {
      ctx.on('settings/document-updated', (ns: string) => {
        if (ns === SETTINGS_NS) recompile()
      })
    } catch {
      /* 事件面不可达就走轮询 */
    }
    let lastRaw = ''
    const poll = setInterval(() => {
      try {
        const raw = JSON.stringify(currentGetter())
        if (raw !== lastRaw) {
          lastRaw = raw
          recompile()
        }
      } catch {
        /* 轮询失败静默，下个周期再试 */
      }
    }, 15_000)
    ctx.effect(() => () => clearInterval(poll), 'meow-cachebilling.settings-017-poll')
```

</details>

**依据 2 · 源码核查**：[src/settings.ts:411-441](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/settings.ts#L411-L441)

保存scope.set及错误呈现。

<details>
<summary>查看原文（31行）</summary>

```text
  const save = async (): Promise<void> => {
    if (!draft || !expanded) return
    const err = validateDraft(draft)
    if (err) {
      setError(err)
      return
    }
    const entry = buildEntry(draft)
    const key = expanded === '__new__' ? entryKey(entry) : expanded
    setBusy(true)
    try {
      const r = await scope.set(key, entry)
      // 0.1.6 settingsScope 回 {result:{ok,error}}；0.1.7 configForms 回 boolean
      //（false=宿主拒收且详情被吞）。false 必须亮红字——否则被拒写成假成功，
      // 行徽章纹丝不动，用户以为存上了（2026-09-25 探针实证过的静默失败）。
      const bad =
        r === false
          ? '宿主拒收本次写入（重启页面后重试；反复失败看浏览器控制台 [meow-cachebilling] 取证行）'
          : r && r.result && r.result.ok === false
            ? r.result.error?.message
            : null
      if (bad) {
        setError(`保存被拒绝：${bad}`)
        console.warn('[meow-cachebilling] settings 写入被宿主拒收：', key)
        return
      }
      setExpanded(null)
      setDraft(null)
    } catch (e) {
      setError(`保存失败：${e instanceof Error ? e.message : String(e)}`)
    } finally {
```

</details>

**依据 3 · 源码核查**：[src/settings.ts:831-891](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/settings.ts#L831-L891)

设置挂载及软兼容。

<details>
<summary>查看原文（61行）</summary>

```text
  const mount = (scope: any): void => {
    // 顶级分区（与「通用」「模型」「插件」平级）：list slot 契约 = id + order + label；
    // label 直接返回中文——不挂 locale 字典（第三方字典注册在官方外壳没有席位，旧卡片形态实测注册不上）。
    ctx.slots.inject('settings.section', () =>
      ctx.slots.register(
        {
          name: 'settings.section',
          id: SETTINGS_NS,
          order: 30,
          label: () => '喵缓存账单',
          inject: (): unknown => ({ scope, scan: scanCatalog }),
        },
        BillingSection,
      ),
    )
  }

  // ── 0.1.6 腿：settingsScope 服务在，原链路不变 ─────────────────────────────
  const settingsScope = softService(ctx, 'settingsScope')
  if (settingsScope !== undefined) {
    mount(settingsScope.bind({ namespace: SETTINGS_NS }))
    return
  }

  // ── 0.1.7 腿：settingsScope 被官方移除，等 configForms 提供方就绪 ──────────
  // configForms 不进 inject（0.1.6 无此服务，写进清单会整插件 pending），且客户端
  // 组合顺序不保证提供方先起——短轮询等它就绪再挂页；等不到只留一行日志，
  // 账单主体不受影响。
  const pollMs = opts?.pollMs ?? 400
  const maxPollAttempts = opts?.maxPollAttempts ?? 75
  let mounted = false
  let pollTimer: ReturnType<typeof setInterval> | undefined
  let attempts = 0
  const stopPoll = (): void => {
    if (pollTimer !== undefined) {
      clearInterval(pollTimer)
      pollTimer = undefined
    }
  }
  const attach = (): void => {
    if (mounted) return
    const configForms = softService(ctx, 'configForms')
    if (configForms === undefined || typeof configForms.get !== 'function') return
    mounted = true
    stopPoll()
    try {
      mount(configForms.get(SETTINGS_NS))
    } catch (e) {
      console.warn('[meow-cachebilling] 设置页注册失败（不影响账单）：', e)
    }
  }
  attach()
  if (!mounted) {
    pollTimer = setInterval(() => {
      attach()
      attempts += 1
      if (!mounted && attempts >= maxPollAttempts) {
        stopPoll()
        console.info('[meow-cachebilling] configForms 服务未就绪（0.1.7 设置页未注册；账单不受影响）')
      }
    }, pollMs)
```

</details>

**依据 4 · 源码核查**：[src/index.ts:350-408](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/index.ts#L350-L408)

年份URL/超时/冷却和请求体范围。

<details>
<summary>查看原文（59行）</summary>

```text
// ── 中国法定节假日（峰谷判定扣除假日，假日全天谷）───────────────────────────
// 数据源：NateScarlet/holiday-cn（跟进国务院公告的开源仓，按年一个 JSON，免费无 key）。
// jsdelivr（境内可达）与 raw.githubusercontent 双源尝试，任一成功即止；进程内缓存，
// 失败冷却后随下一个事件静默重试。全程不阻塞同步计费路径——取不到数据时按旧的纯星期
// 口径判定（宁可退回旧偏差，不让账单哑火）。isOffDay=false 的调休补班日不算假
// （官方脚注口径：周末即使补班仍是「周末」，全天谷）。

const HOLIDAY_SOURCES = (year: number): string[] => [
  `https://cdn.jsdelivr.net/gh/NateScarlet/holiday-cn@master/${year}.json`,
  `https://raw.githubusercontent.com/NateScarlet/holiday-cn/master/${year}.json`,
]
/** 年 → 休假日集合（北京日期 YYYY-MM-DD）。 */
const holidayCache = new Map<number, Set<string>>()
const holidayPending = new Set<number>()
let holidayLastFailAt = 0
/** 失败冷却：拉取失败后至少隔这么久再试，绝不逐事件重试打爆网络。 */
const HOLIDAY_RETRY_MS = 30 * 60 * 1000
const HOLIDAY_TIMEOUT_MS = 8000

/** 事件时刻 → 北京日期（en-CA 恰好输出 YYYY-MM-DD）。节假日历是北京日期概念，与条目时区无关。 */
const beijingDate = (timeMs: number): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date(timeMs))

/** 拉取一年的节假日数据（fire-and-forget，同一年并发去重，失败进冷却）。 */
function fetchHolidayYear(year: number): void {
  if (holidayCache.has(year) || holidayPending.has(year)) return
  if (Date.now() - holidayLastFailAt < HOLIDAY_RETRY_MS) return
  holidayPending.add(year)
  void (async () => {
    try {
      for (const url of HOLIDAY_SOURCES(year)) {
        try {
          const res = await fetch(url, { signal: AbortSignal.timeout(HOLIDAY_TIMEOUT_MS) })
          if (!res.ok) continue
          const data = (await res.json()) as { days?: Array<{ date?: string; isOffDay?: boolean }> }
          const days = Array.isArray(data?.days) ? data.days : []
          const set = new Set<string>()
          for (const d of days) {
            if (typeof d?.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.date) && d.isOffDay === true) {
              set.add(d.date)
            }
          }
          if (set.size === 0) continue // 空数据当源异常，换下一源
          holidayCache.set(year, set)
          console.log(`[meow-cachebilling] ${year} 年法定节假日数据已加载：休假日 ${set.size} 天（holiday-cn）`)
          return
        } catch {
          /* 单源失败换下一源 */
        }
      }
      holidayLastFailAt = Date.now()
      console.warn(
        `[meow-cachebilling] ${year} 年法定节假日数据获取失败，${HOLIDAY_RETRY_MS / 60000} 分钟后随事件重试；期间峰谷按星期口径判定（假日误按峰价的可能性存在）`,
      )
    } finally {
      holidayPending.delete(year)
    }
  })()
}
```

</details>

**依据 5 · 源码核查**：[src/index.ts:1574-1577](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/index.ts#L1574-L1577)

startup实际预取当年和次年。

```text
  // ── 法定节假日数据预热：当年 + 次年（跨年夜不空窗）；失败静默，事件触发时按冷却重试 ──
  const bjYear = Number(beijingDate(Date.now()).slice(0, 4))
  fetchHolidayYear(bjYear)
  fetchHolidayYear(bjYear + 1)
```

**依据 6 · 源码核查**：[package.json:51-61](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/package.json#L51-L61)

构建/测试声明与依赖版本，未运行。

<details>
<summary>查看原文（11行）</summary>

```text
    "test": "node tests/settings-mount.mjs && node tests/config-volatile.mjs && node tests/rates-holidays-compat.mjs"
  },
  "devDependencies": {
    "@deepseek-ai/dsh-settings": "^0.1.1-rc.2",
    "@deepseek-ai/dsh-storage-domain": "^0.1.1-rc.2",
    "@deepseek-ai/schemastery": "3.18.1",
    "esbuild": "^0.25.0",
    "yaml": "^2.9.0",
    "zod": "^4.4.3"
  }
}
```

</details>

**依据 7 · 源码核查**：[src/index.ts:44-49](https://github.com/Phant0Meow/dsh-meow-cachebilling/blob/bc0d9204813d9106215f30cc31ca7b7fd3f179b7/src/index.ts#L44-L49)

开放配置与真实必需服务。

```text
const config = sz.dict(sz.any())
Object.assign(config.meta, { volatile: true })
export const Config = config

/** 必需服务：sessionProjections 由 @deepseek-ai/dsh-session-projection 提供，storageDomain 由 @deepseek-ai/dsh-storage-domain 提供（每步花费历史的落盘层），sessionPersistence 供旧记录迁移读日志。 */
export const inject = ['sessionProjections', 'storageDomain', 'sessionPersistence']
```

#### 缺口

- 未运行兼容、设置持久/清理、受控同质量策略实验。
  **影响**：只能观察性小试；价格/历史/网络条件须先接受。
  **进一步探讨**：先核一条脱敏会话的真实usage/价表/页面状态，再决定是否做受控换窗比较，不因作者比例直接常驻或自动化。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
