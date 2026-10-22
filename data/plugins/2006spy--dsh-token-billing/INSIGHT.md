# dsh-token-billing

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[098b9e8](https://github.com/2006spy/dsh-token-billing/tree/098b9e8164bd66a6f2bdbc204ece186c6ca52060)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/2006spy/dsh-token-billing)
<!-- END META -->

> **实现功能**：在DSH会话中显示实时token费用，结合路由价目与政策时间线，保存跨会话账本并提供统计、余额及CSV/JSON导出。

> **核心亮点**：把估算到usage修正、provider价优先和事件时间政策接入会话投影，再提供步骤账本与导出，减少手工整理；不是正式账单或新tokenizer。详见[Q02](#research-q02)。

> **风险与缺陷**：投影可撤销估算，但账本仅追加且同key不更新；宿主发布中间状态时退款可能留下持久条目。“节省”还涉及累计actual和跨币种口径，未运行复现。详见[Q03](#research-q03)。

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
  - [Q01 · 谁需要实时计费，合格结果是什么？](#detail-section-11)
  - [Q02 · 估算、精确usage与按路由价格怎样流转？](#detail-section-12)
  - [Q03 · 退款与持久账本能否一致？](#detail-section-13)
  - [Q04 · 安装与日常使用依赖什么？](#detail-section-14)
  - [Q05 · 工程和安全取舍是什么？](#detail-section-15)
  - [Q06 · 成本与采用建议，未来假设如何证伪？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向DSH Web中混用不同provider/模型，希望在输入框附近看到本轮消耗、并汇总跨会话支出的个人用户。核心输入是会话事件与四档usage，插件输出费用行、统计、价目配置和CSV/JSON账本。它是消费可视化工具，不负责代扣费，也不验证业务任务产出。

合格计量应区分流中的启发估算与usage、按实际路由和发生时刻取适用价格、正确处理取消/更正/重放，持久总账能解释为什么与会话视图相同或不同。金额相符还需要官方账单或真实合同核对，精确usage不代表单价、套餐和税费都准确。

直接参照为宿主usage显示加手工价目表、官方账单和表格统计。插件把这些操作收拢到会话和设置页，支持人民币政策时间线与路由价目，这是具体便利。README展示截图明确为模拟账本渲染，作者的价格实测和兼容矩阵不当成本轮独立验证；本轮不确认当前市场报价。

宿主usage加手工价目表、官方账单与表格；插件提供持续解释，不代替真实合同和业务质量评价。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 实时费用 | 估算后由usage覆盖 | 精确token不代表真实账单 |
| 按路由取价 | provider、覆盖和历史政策 | 实际中转收费需另核 |
| 账本与导出 | 跨会话步骤汇总CSV/JSON | 同键不更新，不同步撤销 |
| 统计/预算 | 趋势、占比和预算提示 | 预算只是显示，不阻止消费 |
| 本地/订阅口径 | 名义费用与配置成本比较 | 不等于真实节省，币种/累计口径需核 |
| 余额/价格更新 | 可选外部API与HTML/JSON | 依可信来源和宿主访问控制 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node ^22.19或>=24，DSH声明范围 | 包声明必需 | 加载手写lib ESM | 兼容映射为作者声明 |
| sessionProjections | 硬注入必需 | 投影注册与变化订阅 | 没有事件契约无法可靠结算 |
| settings、Web服务 | 配置页/API需要 | 命名空间、revision与HTTP | 分支延迟接入，不代表所有能力已启动 |
| Cordis、schemastery、React、zod | peer声明 | 宿主/浏览器与wire schema | 手写bundle不等于没有运行依赖 |
| 可写DSH_HOME/storages | 跨会话持久化必需 | 账本与价格缓存 | 写失败警告，不能假设有重试队列 |
| 官网或自定义价格端点 | 自动更新需要 | 双语言HTML/JSON取价 | 缓存/内置价可能继续使用，非当前报价证明 |
| key与可信DEEPSEEK_BASE_URL | 余额可选需要 | 余额请求，60秒缓存 | 失败不改变usage采集 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定包和宿主，备份ledger/cache及价目配置 | 清楚区分计量、估算与账单 |
| 安装 | 挂载Web bundle并重启 | 会话投影、费用行及设置页接通 |
| 定价 | 核对provider+model、覆盖/套餐与价格来源 | 不把中转默认价等于实际合同 |
| 使用 | 查看估算标记、四档usage和时间线 | 异常turn核对会话与持久账本一致 |
| 恢复 | 留存原账本，比较导出和原始事件 | 不将重注册误当既有账本已经更正 |

固定lib为手写实现，不是待构建src的镜像；本轮没有运行插件、测试、价格请求或宿主冒烟。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主peer、原事件和持久目录 | 核对价表、provider、兼容与备份 | 未测接入耗时和初始重放 |
| 持续使用 | 投影、每分钟检查、价目网络与全量账本写盘 | 维护计价来源和异常差异 | 不主动增加模型任务，但原任务消费仍存在 |
| 失败恢复 | 原始事件、备份和重建数据 | 处理退款/更正不同步及损坏空账 | 没有自动账本撤销/更新收据 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话反馈 | 估算/usage覆盖和异常估算退款 | 所有宿主事件次序下正确 |
| 路由定价 | provider优先、历史政策与自定义 | 当前报价及每个中转真实收费 |
| 持久统计 | 步骤键去重、导出和聚合 | 更正/删除同步，源码存在缺口 |
| 节省 | 按配置生成反事实数值 | 真实现金、固定费和跨币种可比 |

> **思考**：投影可撤销估算，但账本仅追加且同key不更新；宿主发布中间状态时退款可能留下持久条目。“节省”还涉及累计actual和跨币种口径，未运行复现。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把估算到usage修正、provider价优先和事件时间政策接入会话投影，再提供步骤账本与导出，减少手工整理；不是正式账单或新tokenizer。详见[Q02](#research-q02)。

把估算到usage修正、provider价优先和事件时间政策接入会话投影，再提供步骤账本与导出，减少手工整理；不是正式账单或新tokenizer。详见[Q02](#research-q02)。

状态机将精确usage与估算清楚区分，价目解析与模型归一化共用接口，policy按事件时刻而不是当前时间解释历史；投影wire和旧字段并存处理宿主代际。配置保存把expectedRevision传settings.replace，避免无条件覆盖配置。这些是可借鉴的工程做法，但并不弥补账本已见键只追加的语义。

HTTP注册多条stats/export/providers/config/余额端点。config/save检查POST和256KiB正文，交给settings做revision替换；所读处理器没有Host/Origin/认证判断，读取端不少也不限制method。上层webServer的授权未核查，因此不能断言远程泄露，但导出包含sessionId、模型、provider和时间，应该依据实际宿主访问控制判断数据边界。自定义价URL只要求http(s)，可请求内网或明文端点；这是配置权限所支配的网络能力，不声称已验证SSRF链。

账本和缓存都有tmp/rename但退回直接写，坏账本直接视空无隔离备份；多个宿主进程共享同一DSH_HOME时也没有锁或合并版本。projection变更订阅返回值是否可清理依宿主契约，本轮只看到timer dispose而非证明所有异步监听都回收。可复用时宜把数据投影、外部来源可信度和持久提交各自做显式收据，不用“零构建”替代运行/数据边界说明。

<a id="detail-section-5"></a>

### 1.4 主要限制

投影可撤销估算，但账本仅追加且同key不更新；宿主发布中间状态时退款可能留下持久条目。“节省”还涉及累计actual和跨币种口径，未运行复现。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察。继续探讨可先比较精确完成、估算后abort和同键更正的投影/账本/导出，再查价格来源与宿主授权；不当官方账单或真实省钱证明。详见[Q06](#research-q06)。

合格计量应区分流中的启发估算与usage、按实际路由和发生时刻取适用价格、正确处理取消/更正/重放，持久总账能解释为什么与会话视图相同或不同。金额相符还需要官方账单或真实合同核对，精确usage不代表单价、套餐和税费都准确。

直接参照为宿主usage显示加手工价目表、官方账单和表格统计。插件把这些操作收拢到会话和设置页，支持人民币政策时间线与路由价目，这是具体便利。README展示截图明确为模拟账本渲染，作者的价格实测和兼容矩阵不当成本轮独立验证；本轮不确认当前市场报价。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持估算/usage状态机和按路由取价；append-only账本与投影退款/更正存在条件一致性风险，真实节省未获证明。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/projection.js、lib/ledger.js、lib/prices.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定lib手写源码检查事件状态机、价优先、持久合并、统计和HTTP面，未完整审计catalog探测或所有UI；不执行目标，不确认当前价格。
- 下一步：进一步探讨可用固定事件序列对照投影和持久账本的估算修正/撤销，再核对价版本及同/异币种统计，记录重启和保存失败。

**分析版本**

- **仓库**：[2006spy/dsh-token-billing](https://github.com/2006spy/dsh-token-billing)
- **版本号**：0.8.1（[固定提交 098b9e8](https://github.com/2006spy/dsh-token-billing/tree/098b9e8164bd66a6f2bdbc204ece186c6ca52060)）
- **版本日期**：2026-09-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索步骤revision与upsert/tombstone修订链、价版本和原币种收据，比较投影/总账差额、重放与体积；未实现。详见[Q06](#research-q06)。

进一步探讨可用固定事件序列对照投影和持久账本的估算修正/撤销，再核对价版本及同/异币种统计，记录重启和保存失败。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 6 | 7129 | 5984 | 870 | — |
| .md | source | 1 | 401 | — | — | 8187 |
| .mjs | source | 4 | 968 | 744 | 160 | — |
| .mjs | test | 13 | 2701 | 2088 | 394 | — |
| .md | example | 1 | 18 | — | — | 338 |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=grey&logo=github&style=flat)](https://github.com/2006spy/dsh-token-billing/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/2006spy/dsh-token-billing/issues?q=is%3Aissue+created%3A2026-09-22T05%3A23%3A22.740Z..2026-10-22T05%3A23%3A22.740Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2006spy/dsh-token-billing/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A23%3A22.740Z..2026-10-22T05%3A23%3A22.740Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断固定版本实时计费投影与持久账本能否解释消费，重点核查退款、更正、价格来源和统计口径。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要实时计费，合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

面向DSH Web中混用不同provider/模型，希望在输入框附近看到本轮消耗、并汇总跨会话支出的个人用户。核心输入是会话事件与四档usage，插件输出费用行、统计、价目配置和CSV/JSON账本。它是消费可视化工具，不负责代扣费，也不验证业务任务产出。

合格计量应区分流中的启发估算与usage、按实际路由和发生时刻取适用价格、正确处理取消/更正/重放，持久总账能解释为什么与会话视图相同或不同。金额相符还需要官方账单或真实合同核对，精确usage不代表单价、套餐和税费都准确。

直接参照为宿主usage显示加手工价目表、官方账单和表格统计。插件把这些操作收拢到会话和设置页，支持人民币政策时间线与路由价目，这是具体便利。README展示截图明确为模拟账本渲染，作者的价格实测和兼容矩阵不当成本轮独立验证；本轮不确认当前市场报价。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-38](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/README.md#L17-L38)

作者说明实时估算修正与模拟截图。

<details>
<summary>查看原文（22行）</summary>

````text
## ✨ 这是什么

为 DeepSeek Harness（dsh）Web 提供**实时费用统计**：按本次会话实际的 token 用量（输入 / 输出 / 缓存读 / 缓存写四个桶）乘以模型单价，换算成费用，在输入框上方实时显示。

- **估算 → 精确自动修正**：流式生成期间用字符/4 启发式**估算**（标注「估」），收到模型的精确 usage 后**自动修正**；被中断（abort）的估算步骤**不会落地计费**。
- **零构建依赖**：手写 ESM 宿主 + `__ModuleLoader__` 客户端 bundle，与 modlens 同款立场。

> 输入框上方一行实时显示（与 TPS 同款样式）：
>
> ```
> 💸 ¥0.0302 · 12.3k in / 1.2k out · 本轮(估) ¥0.0011 · deepseek-v4-flash ¥4/M · 空闲
> ```

---

## 📸 界面一览

**统计页仪表盘（v0.7 · 纯手写 SVG 图表 · 模拟数据渲染）**：

![统计页仪表盘](docs/screenshots/stats-dashboard.png)

图中可见：KPI 概览卡（今日 / 昨日环比 / 本月·预算环 / 累计 / 调用次数）· 费用趋势折线图 · 按模型费用占比环形图 · Token 用量趋势折线图 · 按 Provider 实际花费占比环形图 · 月度预算进度条 · 账户余额 · 按模型 / 按天明细。
````

</details>

**依据 2 · 源码核查**：[lib/index.js:222-228](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/index.js#L222-L228)

会话投影步骤合并持久账本。

```text
  if (typeof ctx.sessionProjections?.onChanged === 'function') {
    ctx.sessionProjections.onChanged((session, key, value) => {
      if (key !== 'tokenBilling' || value === null || value === undefined) return
      if (Array.isArray(value.steps) && value.steps.length > 0) {
        mergeSteps(ledger, sessionIdOf(session), value.steps)
        scheduleLedgerFlush()
      }
```

**依据 3 · 源码核查**：[lib/ledger.js:289-308](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/ledger.js#L289-L308)

导出逐步骤记录，非官方结算凭证。

<details>
<summary>查看原文（20行）</summary>

```text
export function ledgerToJson(ledger) {
  return JSON.stringify(ledger, null, 2)
}

/** 导出为 CSV（表头：会话,轮次,步骤,时间,模型,提供方,输入,输出,缓存读,缓存写,费用,币种,估算）。 */
export function ledgerToCsv(ledger) {
  const esc = (v) => {
    const s = String(v ?? '')
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }
  const header = ['sessionId', 'turn', 'step', 'at', 'model', 'provider', 'input', 'output', 'cacheRead', 'cacheWrite', 'cost', 'currency', 'estimated']
  const rows = [header.join(',')]
  for (const s of ledger.steps) {
    rows.push([
      esc(s.sessionId), s.turn, s.step, s.at, esc(s.model), esc(s.provider),
      s.uncachedInputTokens, s.outputTokens, s.cacheReadTokens, s.cacheWriteTokens,
      s.cost, esc(s.currency), s.estimated ? '1' : '0',
    ].join(','))
  }
  return rows.join('\n')
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 估算、精确usage与按路由价格怎样流转？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

投影按request/header取得provider/model与系统/工具估算，step/start建立进行中状态，assistant/chunk在无精确usage时用字符/4加块开销估输出，收到usage或assistant/message.usage后覆盖四档桶并标exact。step/end按event.time取价并结算，保存最多1000条会话steps。turn/end非completed可退掉最后估算step；精确usage不因异常原因被退掉，避免把实际消耗视为不存在。

priceAt优先用户模型覆盖，再provider模型价，再内置政策时间线与全局/峰谷fallback。特定历史段按消息时刻选价，provider显式价格不参与官方峰谷；自动抓价中文页优先、英文兜底，自定义JSON端点可提供四档模型价。归一化模型ID帮助匹配历史别名，不能证明中转真实计费等于官方价。

host订阅tokenBilling变化，把步骤按sessionId|turn|step键并入全局账本，一秒合并写盘；设置改变或价格刷新会重注册投影，旧核心顶层view和新wire块兼容共存。贡献是把估算/usage状态机、路由价格来源、历史政策和用户控制接到会话投影与可导出账本，不是新tokenizer或正式财务系统。账本与退款的一致性另有Q03限制。

#### 证据与依据

**依据 1 · 源码核查**：[lib/projection.js:1222-1288](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/projection.js#L1222-L1288)

header/step/usage与结算状态转移。

<details>
<summary>查看原文（67行）</summary>

```text
export function createBillingApply(spec) {
  return function apply(state, event) {
    let touched = false
    switch (event.type) {
      case 'request/header': {
        const config = event.data?.header?.config
        state.header = config === undefined ? null : { provider: config.provider ?? '', model: config.model ?? 'unknown' }
        state.headerTokens = estimateHeaderTokens(event.data.header)
        if (state.active !== null) {
          state.active.provider = state.header?.provider ?? ''
          state.active.model = state.header?.model ?? 'unknown'
          state.active.buckets = {
            ...state.active.buckets,
            uncachedInputTokens: state.headerTokens + state.surfaceTokens,
          }
        }
        touched = true
        break
      }
      case 'step/start': {
        state.active = {
          turn: event.data.turn,
          step: event.data.step,
          provider: state.header?.provider ?? '',
          model: state.header?.model ?? 'unknown',
          exact: false,
          buckets: {
            ...zeroBuckets(),
            uncachedInputTokens: state.headerTokens + state.surfaceTokens,
          },
          blocks: {},
          pricedTokens: 0,
          pricedBlocks: 0,
        }
        touched = true
        break
      }
      case 'assistant/chunk': {
        if (state.active === null) return state
        const { chunk } = event.data
        if (chunk.type === 'usage') {
          exactStep(state.active, chunk.usage)
          touched = true
          break
        }
        if (state.active.exact) return state
        if (applyOutputChunk(state.active, chunk)) {
          const tokens = state.active.pricedBlocks === 0 ? 0 : state.active.pricedTokens + ESTIMATOR.roleOverhead
          state.active.buckets = { ...state.active.buckets, outputTokens: tokens }
          touched = true
        }
        break
      }
      case 'assistant/message': {
        if (state.active === null) return state
        if (event.data.usage !== undefined) {
          exactStep(state.active, event.data.usage)
          touched = true
        }
        break
      }
      case 'step/end': {
        if (state.active === null) return state
        settleStep(state, state.active, spec, event.time)
        touched = true
        break
      }
```

</details>

**依据 2 · 源码核查**：[lib/projection.js:1294-1300](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/projection.js#L1294-L1300)

非完成turn退估算。

```text
      case 'turn/end': {
        if (event.data.reason?.kind !== 'completed' && state.last !== null && state.last.turn === event.data.turn && state.last.estimated) {
          refundLastEstimated(state, spec)
          touched = true
        }
        break
      }
```

**依据 3 · 源码核查**：[lib/projection.js:437-470](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/projection.js#L437-L470)

显式覆盖、provider和政策价优先级。

<details>
<summary>查看原文（34行）</summary>

```text
export function priceAt(provider, model, spec, atMs) {
  // 向后兼容旧签名：priceAt(model, spec, atMs)
  if (model !== null && typeof model === 'object' && typeof spec === 'number') {
    atMs = spec
    spec = model
    model = provider
    provider = ''
  }
  const key = canonicalModelId(model)
  const override = lookupByModel(spec.overrides, model)
  if (override !== undefined) {
    return { ...override, currency: override.currency ?? spec.currency }
  }
  if (typeof provider === 'string' && provider !== '') {
    const prov = lookupByModel(spec.providerPrices?.[provider], model)
    if (prov !== undefined) {
      return { ...prov, currency: prov.currency ?? spec.currency }
    }
  }
  // 内置价格政策时间线：按消息时刻取价，历史回看不被新规追溯改写
  const policy = priceAtPolicy(spec, model, atMs)
  if (policy !== null) return policy
  const base = priceEntry(model, spec)
  const pk = spec.peak
  if (pk === null || pk === undefined || !pk.enabled || !globAny(pk.models, key)) return base
  const peakEntry = lookupByModel(pk.prices, model)
  if (peakEntry === undefined) return base
  const inPeak = inWindow(atMs, pk.windows, pk.tz, isBeforeWeekendRule(pk, atMs))
  if (inPeak) return peakEntry
  const off = lookupByModel(pk.offPeakPrices, model)
  if (off !== undefined) return off
  const rate = Number.isFinite(pk.rate) && pk.rate >= 0 ? pk.rate : DEFAULT_PEAK_RATE
  return {
    input: peakEntry.input * rate,
```

</details>

**依据 4 · 源码核查**：[lib/index.js:394-412](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/index.js#L394-L412)

双核心投影字段。

<details>
<summary>查看原文（19行）</summary>

```text
  const registerProjection = (spec) => {
    if (disposeProjection !== undefined) {
      disposeProjection()
      disposeProjection = undefined
    }
    if (spec.enabled === false) return
    const parts = createTokenBillingProjectionParts(spec)
    // 兼容双核心（0.1.0-rc.8 读顶层 schema/view；0.1.1-rc.1+ 只读 wire 块——
    // 缺 wire 时注册表视单元为 host-only：快照跳过、帧不推送、onChanged 不通知）。
    // stateSchema 校验的是持久化检查点里的单元状态（纯 JSON 契约），不是视图。
    disposeProjection = ctx.sessionProjections.register({
      key: parts.key,
      stateSchema: zod.json(),
      init: parts.init,
      apply: parts.apply,
      view: parts.view,
      wire: { viewSchema, view: parts.view },
      stateVersion: parts.stateVersion,
    })
```

</details>

**依据 5 · 源码核查**：[lib/prices.js:368-392](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/prices.js#L368-L392)

双语言价格源与超时。

<details>
<summary>查看原文（25行）</summary>

```text
export async function fetchDeepSeekPrices(fetchImpl = fetch) {
  const attempts = [
    { url: DEEPSEEK_PRICE_URL, label: '中文页' },
    { url: DEEPSEEK_PRICE_URL_EN, label: '英文页' },
  ]
  let lastError = null
  for (const { url, label } of attempts) {
    try {
      const response = await fetchImpl(url, {
        headers: { 'user-agent': 'dsh-token-billing/0.2 (price fetcher)', accept: 'text/html' },
        signal: AbortSignal.timeout(15000),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const html = await response.text()
      const parsed = parseDeepSeekPricingHtml(html)
      if (Object.keys(parsed.flat).length === 0 && (parsed.peak === null || Object.keys(parsed.peak.models).length === 0)) {
        throw new Error('未找到价格表')
      }
      return parsed
    } catch (err) {
      lastError = err
    }
  }
  throw new Error(`DeepSeek 价格抓取失败（${attempts.map((a) => a.label).join(' / ')}）：${lastError?.message ?? '未知错误'}`)
}
```

</details>

**依据 6 · 源码核查**：[lib/index.js:204-228](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/index.js#L204-L228)

host投影到持久账本。

<details>
<summary>查看原文（25行）</summary>

```text
  const ledgerFile = ledgerPath()
  let ledger = loadLedger(ledgerFile)
  let ledgerTimer = null
  const flushLedger = () => {
    ledgerTimer = null
    saveLedger(ledgerFile, ledger)
  }
  const scheduleLedgerFlush = () => {
    if (ledgerTimer !== null) return
    ledgerTimer = setTimeout(flushLedger, 1000)
  }
  /** 会话 id 提取（兼容 Session 对象 / 字符串）。 */
  const sessionIdOf = (session) => {
    if (session === null || session === undefined) return 'anon'
    if (typeof session === 'string') return session
    return String(session.id ?? session.sessionId ?? session.title ?? 'anon')
  }
  // 订阅投影变更：tokenBilling 每次结算 → 幂等合并进账本（1s 防抖落盘）
  if (typeof ctx.sessionProjections?.onChanged === 'function') {
    ctx.sessionProjections.onChanged((session, key, value) => {
      if (key !== 'tokenBilling' || value === null || value === undefined) return
      if (Array.isArray(value.steps) && value.steps.length > 0) {
        mergeSteps(ledger, sessionIdOf(session), value.steps)
        scheduleLedgerFlush()
      }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 退款与持久账本能否一致？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能仅由现有合并器推断一致。projection的settleStep先把估算step加入state.steps，turn/end异常再refundLastEstimated从steps删除并减totals。host每次onChanged看到非空steps就mergeSteps，而mergeSteps对于已见键直接continue，只追加新键，没有更新或删除。因此若宿主先发布step/end中间投影，估算会进入账本，后续退款删除不会同步撤销；即使同键后来更正费用也不会覆盖。该风险依onChanged发布时序，未读固定宿主实现，不能写成已复现所有部署必然残留。

loadLedger只验证对象和steps数组，损坏读失败静默空账；saveLedger只记录警告，host定时flush没有dirty重试，rename失败还降级直接覆盖。无账本保留上限，每次合并先遍历旧步骤建Set，写全量JSON，长期语料会增加时间与内存。会话steps虽裁1000，跨会话账本并未同样裁剪。

“本地/订阅节省”也是按配置的反事实估算。computeStats把某些模式的实际按0或localCostPerM计，未计固定订阅费、硬件、电力和人工；本地saved直接将s.cost减去targetCurrency金额，跨币种时没有先换算。perProvider和byMode分支还用已累积actual减当前s.cost，导致多步情况下saved与逐步差值不同。它不能表示真实现金节约。

#### 证据与依据

**依据 1 · 源码核查**：[lib/projection.js:1125-1140](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/projection.js#L1125-L1140)

估算step先进入投影步骤。

<details>
<summary>查看原文（16行）</summary>

```text
  state.steps.push({
    turn: active.turn,
    step: active.step,
    model,
    provider: active.provider,
    at: atMs,
    uncachedInputTokens: active.buckets.uncachedInputTokens,
    outputTokens: active.buckets.outputTokens,
    cacheReadTokens: active.buckets.cacheReadTokens,
    cacheWriteTokens: active.buckets.cacheWriteTokens,
    cost,
    currency,
    estimated,
    mode,
  })
  if (state.steps.length > 1000) state.steps.splice(0, state.steps.length - 1000)
```

</details>

**依据 2 · 源码核查**：[lib/projection.js:1199-1211](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/projection.js#L1199-L1211)

退款从投影steps删除。

<details>
<summary>查看原文（13行）</summary>

```text
    }
    // 移除对应的估算 step（从尾向前定位，避免 steps 截断后误弹其它条目）
    for (let si = state.steps.length - 1; si >= 0; si--) {
      const s = state.steps[si]
      if (s.step === last.step && s.turn === last.turn && s.estimated) {
        state.steps.splice(si, 1)
        break
      }
    }
  }
  state.last = null
  state.lastEstimated = null
  return state
```

</details>

**依据 3 · 源码核查**：[lib/index.js:222-228](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/index.js#L222-L228)

监听仅合并非空steps，无撤销。

```text
  if (typeof ctx.sessionProjections?.onChanged === 'function') {
    ctx.sessionProjections.onChanged((session, key, value) => {
      if (key !== 'tokenBilling' || value === null || value === undefined) return
      if (Array.isArray(value.steps) && value.steps.length > 0) {
        mergeSteps(ledger, sessionIdOf(session), value.steps)
        scheduleLedgerFlush()
      }
```

**依据 4 · 源码核查**：[lib/ledger.js:67-100](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/ledger.js#L67-L100)

已见键continue，不覆盖或删除。

<details>
<summary>查看原文（34行）</summary>

```text
  let changed = false
  for (const s of steps) {
    const key = `${sessionId}|${s.turn}|${s.step}`
    const record = {
      sessionId,
      turn: s.turn,
      step: s.step,
      at: Number.isFinite(s.at) ? s.at : Date.now(),
      model: s.model ?? 'unknown',
      provider: s.provider ?? '',
      uncachedInputTokens: s.uncachedInputTokens ?? 0,
      outputTokens: s.outputTokens ?? 0,
      cacheReadTokens: s.cacheReadTokens ?? 0,
      cacheWriteTokens: s.cacheWriteTokens ?? 0,
      cost: s.cost ?? 0,
      currency: s.currency ?? '¥',
      estimated: s.estimated === true,
      mode: s.mode ?? 'usage',
    }
    if (seen.has(key)) continue
    seen.add(key)
    ledger.steps.push(record)
    changed = true
  }
  return changed ? ledger : ledger
}

/* ------------------------------------------------------------------ */
/* 聚合统计                                                           */
/* ------------------------------------------------------------------ */

/** 本地时区某天零点（YYYY-MM-DD）。 */
function dayKey(atMs, tz) {
  try {
```

</details>

**依据 5 · 源码核查**：[lib/ledger.js:33-64](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/ledger.js#L33-L64)

损坏空账及保存警告/直接写降级。

<details>
<summary>查看原文（32行）</summary>

```text
/** 读取账本；不存在或损坏返回空账本。 */
export function loadLedger(filePath) {
  try {
    if (!existsSync(filePath)) return emptyLedger()
    const raw = readFileSync(filePath, 'utf8')
    const data = JSON.parse(raw)
    if (data === null || typeof data !== 'object' || !Array.isArray(data.steps)) return emptyLedger()
    return { version: LEDGER_VERSION, steps: data.steps, updatedAt: data.updatedAt ?? null }
  } catch {
    return emptyLedger()
  }
}

/** 写入账本（先写临时文件再原子改名；受限环境退化为直接写）。 */
export function saveLedger(filePath, ledger) {
  try {
    mkdirSync(dirname(filePath), { recursive: true })
    const tmp = `${filePath}.tmp`
    writeFileSync(tmp, JSON.stringify({ ...ledger, updatedAt: Date.now() }, null, 2), 'utf8')
    try {
      renameSync(tmp, filePath)
    } catch {
      writeFileSync(filePath, JSON.stringify({ ...ledger, updatedAt: Date.now() }, null, 2), 'utf8')
    }
  } catch (err) {
    console.warn(`[token-billing] 账本写入失败：${err.message}`)
  }
}

/** 幂等合并：把某个会话的 steps 并入账本（键 sessionId|turn|step，重复只覆盖）。 */
export function mergeSteps(ledger, sessionId, steps) {
  if (!Array.isArray(steps) || steps.length === 0) return ledger
```

</details>

**依据 6 · 源码核查**：[lib/ledger.js:202-244](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/ledger.js#L202-L244)

反事实节省、累计actual和跨币种相减。

<details>
<summary>查看原文（43行）</summary>

```text
    pp.calls += 1
    addCost(pp.costs, s.currency, s.cost)
    addCost(pp.nominal, s.currency, s.cost)
    if (mode === 'usage') addCost(pp.actual, s.currency, s.cost)
    else {
      // subscription / free / local：实际花费 0；本地可按 localCostPerM 折算实际成本
      if (isLocal) {
        const tokens = s.uncachedInputTokens + s.outputTokens + s.cacheReadTokens + s.cacheWriteTokens
        addCost(pp.actual, targetCurrency, tokens * localCostPerM / 1_000_000)
      }
      const saved = s.cost - (isLocal ? pp.actual[targetCurrency] ?? 0 : 0)
      if (saved > 0) addCost(pp.saved, s.currency, saved)
    }

    // metering：按收费形式分组
    let mm = byMode[mode]
    if (mm === undefined) { mm = { calls: 0, costs: {}, nominal: {}, actual: {}, saved: {} }; byMode[mode] = mm }
    mm.calls += 1
    addCost(mm.costs, s.currency, s.cost)
    addCost(mm.nominal, s.currency, s.cost)
    if (mode === 'usage') addCost(mm.actual, s.currency, s.cost)
    else {
      if (isLocal) {
        const tokens = s.uncachedInputTokens + s.outputTokens + s.cacheReadTokens + s.cacheWriteTokens
        addCost(mm.actual, targetCurrency, tokens * localCostPerM / 1_000_000)
      }
      const saved = s.cost - (isLocal ? mm.actual[targetCurrency] ?? 0 : 0)
      if (saved > 0) addCost(mm.saved, s.currency, saved)
    }

    if (isLocal) {
      // 名义价值 = 官方价计得的 cost（账本里已是）；实际成本 = 全部 token × 本地单价
      const tokens = s.uncachedInputTokens + s.outputTokens + s.cacheReadTokens + s.cacheWriteTokens
      const actual = tokens * localCostPerM / 1_000_000
      addCost(nominalTotal, s.currency, s.cost)
      addCost(actualTotal, targetCurrency, actual)
      const saved = s.cost - actual
      if (saved > 0) addCost(savingsTotal, s.currency, saved)
    }

    // cacheStats：token 桶汇总
    cacheStats.uncachedInput += s.uncachedInputTokens ?? 0
    cacheStats.output += s.outputTokens ?? 0
```

</details>

#### 缺口

- 固定宿主是否逐step发布中间投影及重注册/重放触发次序未核查。
  **影响**：源码支持跨层撤销机制缺口，不能断言每次abort都已造成持久残留。
  **进一步探讨**：继续探讨可沿宿主onChanged发布链核对，再用step/end估算→turn/end异常序列比较会话与账本。
- 长期账本规模、IO故障和不同币种节省数值没有运行对照。
  **影响**：不能量化现有用户损失或资源阈值。
  **进一步探讨**：可从两步同币种与异币种人工算例、保存拒绝和大账本重放的离线对照入手。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装与日常使用依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node ^22.19或>=24，DSH声明范围 | 包声明必需 | 加载手写lib ESM | 兼容映射为作者声明 |
| sessionProjections | 硬注入必需 | 投影注册与变化订阅 | 没有事件契约无法可靠结算 |
| settings、Web服务 | 配置页/API需要 | 命名空间、revision与HTTP | 分支延迟接入，不代表所有能力已启动 |
| Cordis、schemastery、React、zod | peer声明 | 宿主/浏览器与wire schema | 手写bundle不等于没有运行依赖 |
| 可写DSH_HOME/storages | 跨会话持久化必需 | 账本与价格缓存 | 写失败警告，不能假设有重试队列 |
| 官网或自定义价格端点 | 自动更新需要 | 双语言HTML/JSON取价 | 缓存/内置价可能继续使用，非当前报价证明 |
| key与可信DEEPSEEK_BASE_URL | 余额可选需要 | 余额请求，60秒缓存 | 失败不改变usage采集 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定包和宿主，备份ledger/cache及价目配置 | 清楚区分计量、估算与账单 |
| 安装 | 挂载Web bundle并重启 | 会话投影、费用行及设置页接通 |
| 定价 | 核对provider+model、覆盖/套餐与价格来源 | 不把中转默认价等于实际合同 |
| 使用 | 查看估算标记、四档usage和时间线 | 异常turn核对会话与持久账本一致 |
| 恢复 | 留存原账本，比较导出和原始事件 | 不将重注册误当既有账本已经更正 |

固定lib为手写实现，不是待构建src的镜像；本轮没有运行插件、测试、价格请求或宿主冒烟。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:50-65](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/package.json#L50-L65)

Node/DSH和peer依赖。

<details>
<summary>查看原文（16行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.1.0-rc.8 <0.2.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-settings": ">=0.1.0-rc.8 <0.2.0",
    "@deepseek-ai/schemastery": "^3.18.1",
    "react": "^18.2.0",
    "zod": ">=4.0.0 <5.0.0"
  },
  "files": [
    "lib",
    "cordis.patch.yml"
  ],
  "license": "MIT"
```

</details>

**依据 2 · 源码核查**：[lib/index.js:184-191](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/index.js#L184-L191)

sessionProjections硬注入。

```text
export const inject = ['sessionProjections']

/**
 * 注册 tokenBilling 投影 + 价格抓取管理（价格/配置变化时重建）。
 * @param ctx - host 插件上下文（sessionProjections + settings + webServer）。
 * @param config - 组合层配置（schema 默认值已由 loader 填充）。
 */
export function apply(ctx, config = {}) {
```

**依据 3 · 源码核查**：[lib/index.js:634-657](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/index.js#L634-L657)

Web与有界JSON请求分支。

<details>
<summary>查看原文（24行）</summary>

```text
  if (typeof ctx.inject === 'function') {
    ctx.inject(['webServer'], (host) => {
      /** 读取 POST JSON 请求体（有界）。 */
      const readJsonBody = (req) => new Promise((resolve, reject) => {
        const chunks = []
        let size = 0
        req.on('data', (chunk) => {
          size += chunk.length
          if (size > 256 * 1024) {
            reject(new Error('body too large'))
            req.destroy()
            return
          }
          chunks.push(chunk)
        })
        req.on('end', () => {
          try {
            resolve(chunks.length === 0 ? {} : JSON.parse(Buffer.concat(chunks).toString('utf8')))
          } catch {
            reject(new Error('invalid JSON body'))
          }
        })
        req.on('error', reject)
      })
```

</details>

**依据 4 · 源码核查**：[lib/index.js:239-257](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/index.js#L239-L257)

余额依赖与缓存。

<details>
<summary>查看原文（19行）</summary>

```text
  let balanceCache = { at: 0, data: null, error: null }
  /** 余额抓取：复用 DEEPSEEK_API_KEY（env 或凭证），60s 缓存。 */
  const fetchBalance = async () => {
    const now = Date.now()
    if (balanceCache.data !== null && now - balanceCache.at < 60_000) return { ok: true, ...balanceCache.data }
    if (balanceCache.error !== null && now - balanceCache.at < 60_000) return { ok: false, error: balanceCache.error }
    const key = process.env.DEEPSEEK_API_KEY
      ?? (typeof ctx.credentials === 'object' ? ctx.credentials?.DEEPSEEK_API_KEY : undefined)
      ?? ''
    if (!key) {
      balanceCache = { at: now, data: null, error: '未配置 DEEPSEEK_API_KEY' }
      return { ok: false, error: balanceCache.error }
    }
    try {
      const base = process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com'
      const res = await fetch(`${base}/user/balance`, {
        headers: { authorization: `Bearer ${key}`, accept: 'application/json' },
        signal: AbortSignal.timeout(5000),
      })
```

</details>

**依据 5 · 作者声明**：[README.md:19-22](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/README.md#L19-L22)

作者说明手写ESM与客户端bundle。

```text
为 DeepSeek Harness（dsh）Web 提供**实时费用统计**：按本次会话实际的 token 用量（输入 / 输出 / 缓存读 / 缓存写四个桶）乘以模型单价，换算成费用，在输入框上方实时显示。

- **估算 → 精确自动修正**：流式生成期间用字符/4 启发式**估算**（标注「估」），收到模型的精确 usage 后**自动修正**；被中断（abort）的估算步骤**不会落地计费**。
- **零构建依赖**：手写 ESM 宿主 + `__ModuleLoader__` 客户端 bundle，与 modlens 同款立场。
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程和安全取舍是什么？

**研究主题**：工程质量与复用

#### 完整回答

状态机将精确usage与估算清楚区分，价目解析与模型归一化共用接口，policy按事件时刻而不是当前时间解释历史；投影wire和旧字段并存处理宿主代际。配置保存把expectedRevision传settings.replace，避免无条件覆盖配置。这些是可借鉴的工程做法，但并不弥补账本已见键只追加的语义。

HTTP注册多条stats/export/providers/config/余额端点。config/save检查POST和256KiB正文，交给settings做revision替换；所读处理器没有Host/Origin/认证判断，读取端不少也不限制method。上层webServer的授权未核查，因此不能断言远程泄露，但导出包含sessionId、模型、provider和时间，应该依据实际宿主访问控制判断数据边界。自定义价URL只要求http(s)，可请求内网或明文端点；这是配置权限所支配的网络能力，不声称已验证SSRF链。

账本和缓存都有tmp/rename但退回直接写，坏账本直接视空无隔离备份；多个宿主进程共享同一DSH_HOME时也没有锁或合并版本。projection变更订阅返回值是否可清理依宿主契约，本轮只看到timer dispose而非证明所有异步监听都回收。可复用时宜把数据投影、外部来源可信度和持久提交各自做显式收据，不用“零构建”替代运行/数据边界说明。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:798-816](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/index.js#L798-L816)

配置形状、settings服务和expectedRevision。

<details>
<summary>查看原文（19行）</summary>

```text
            return
          }
          try {
            const body = await readJsonBody(req)
            if (body === null || typeof body !== 'object' || typeof body.section !== 'object' || body.section === null) {
              res.writeHead(400, { 'content-type': 'application/json' })
              res.end(JSON.stringify({ ok: false, error: 'section 必须是对象' }))
              return
            }
            const svc = typeof ctx.get === 'function' ? ctx.get('settings') : undefined
            if (!svc || typeof svc.replace !== 'function') {
              res.writeHead(500, { 'content-type': 'application/json' })
              res.end(JSON.stringify({ ok: false, error: 'settings 服务不可用' }))
              return
            }
            await svc.replace(BILLING_SETTINGS_NAMESPACE, body.section, body.expectedRevision)
            const after = readConfig()
            res.writeHead(200, { 'content-type': 'application/json' })
            res.end(JSON.stringify({ ok: true, revision: after.revision }))
```

</details>

**依据 2 · 源码核查**：[lib/index.js:825-889](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/index.js#L825-L889)

统计导出与余额HTTP数据面。

<details>
<summary>查看原文（65行）</summary>

```text
      host.webServer.register({
        name: 'token-billing-stats',
        kind: 'exact',
        path: '/token-billing/stats',
        handler: (req, res) => {
          const cfg = current()
          let providerModes = []
          try { providerModes = parseProviderModes(cfg.providerModes) } catch { providerModes = [] }
          const stats = computeStats(ledger, {
            now: Date.now(),
            tz: cfg.offPeakTz || 'Asia/Shanghai',
            localProviders: localProvidersOf(),
            localCostPerM: Number.isFinite(cfg.localCostPerM) ? cfg.localCostPerM : 0,
            currency: cfg.currency || '¥',
            providerModes,
          })
          // 图表辅助数据：近 14 天本地时区时间轴 + 月度预算（供统计页折线图/预算环使用）
          const tzNow = Date.now()
          const tzKey = cfg.offPeakTz || 'Asia/Shanghai'
          const seriesLabels = []
          for (let i = 13; i >= 0; i -= 1) seriesLabels.push(dayKeyOf(tzNow - i * 86_400_000, tzKey))
          stats.seriesLabels = seriesLabels
          stats.budget = {
            monthly: Number.isFinite(cfg.monthlyBudget) && cfg.monthlyBudget > 0 ? cfg.monthlyBudget : 0,
            currency: cfg.currency || '¥',
          }
          res.writeHead(200, { 'content-type': 'application/json' })
          res.end(JSON.stringify({ ok: true, stats }))
        },
      })

      /** 导出账本（?format=csv|json）。 */
      host.webServer.register({
        name: 'token-billing-export',
        kind: 'exact',
        path: '/token-billing/export',
        handler: (req, res) => {
          const url = new URL(req.url ?? '/', 'http://localhost')
          const format = url.searchParams.get('format') === 'csv' ? 'csv' : 'json'
          if (format === 'csv') {
            res.writeHead(200, { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="token-billing-ledger.csv"' })
            res.end('\uFEFF' + ledgerToCsv(ledger))
          } else {
            res.writeHead(200, { 'content-type': 'application/json', 'content-disposition': 'attachment; filename="token-billing-ledger.json"' })
            res.end(ledgerToJson(ledger))
          }
        },
      })

      /** 账户余额（只读，60s 缓存）。 */
      host.webServer.register({
        name: 'token-billing-balance',
        kind: 'exact',
        path: '/token-billing/balance',
        handler: async (req, res) => {
          const result = await fetchBalance()
          res.writeHead(200, { 'content-type': 'application/json' })
          res.end(JSON.stringify(result))
        },
      })
    })
  }

  installSettingsSection(ctx, BILLING_SETTINGS_NAMESPACE, Config, config ?? {}, {
    setSource: (source) => { current = source },
```

</details>

**依据 3 · 源码核查**：[lib/prices.js:399-427](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/prices.js#L399-L427)

自定义HTTP(S)价目URL与字段解析。

<details>
<summary>查看原文（29行）</summary>

```text
export async function fetchJsonPrices(url, fetchImpl = fetch) {
  if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
    throw new Error('自定义价格 URL 必须是 http(s) 地址')
  }
  const response = await fetchImpl(url, {
    headers: { accept: 'application/json', 'user-agent': 'dsh-token-billing/0.2 (price fetcher)' },
    signal: AbortSignal.timeout(15000),
  })
  if (!response.ok) throw new Error(`价格端点返回 HTTP ${response.status}`)
  const data = await response.json()
  const models = (data && typeof data === 'object' && data.models && typeof data.models === 'object') ? data.models : data
  const out = {}
  let currency = typeof data?.currency === 'string' && data.currency.length > 0 ? data.currency : null
  for (const [model, entry] of Object.entries(models)) {
    if (entry === null || typeof entry !== 'object') continue
    const parsed = {
      input: parsePriceNumber(entry.input),
      output: parsePriceNumber(entry.output),
      cacheRead: parsePriceNumber(entry.cacheRead ?? entry.cache_hit),
      cacheWrite: parsePriceNumber(entry.cacheWrite ?? entry.cache_miss),
    }
    if (parsed.input === null || parsed.output === null || parsed.cacheRead === null || parsed.cacheWrite === null) continue
    out[canonicalModelId(model)] = parsed
    if (typeof entry.currency === 'string' && entry.currency.length > 0) currency = entry.currency
  }
  if (Object.keys(out).length === 0) throw new Error('价格端点未返回任何可解析的模型价格')
  return { currency, flat: out, peak: null }
}

```

</details>

**依据 4 · 源码核查**：[lib/prices.js:883-909](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/prices.js#L883-L909)

缓存损坏回退与直接写降级。

<details>
<summary>查看原文（27行）</summary>

```text
export function loadPriceCache(filePath) {
  try {
    if (!existsSync(filePath)) return null
    const raw = readFileSync(filePath, 'utf8')
    const data = JSON.parse(raw)
    if (data === null || typeof data !== 'object' || typeof data.fetchedAt !== 'number') return null
    return data
  } catch {
    return null
  }
}

/** 写入缓存（先写临时文件再原子改名）。 */
export function savePriceCache(filePath, data) {
  try {
    mkdirSync(dirname(filePath), { recursive: true })
    const tmp = `${filePath}.tmp`
    writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8')
    try {
      renameSync(tmp, filePath)
    } catch {
      // 某些受限环境 rename 失败，退化为直接写目标
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
    }
  } catch (err) {
    console.warn(`[token-billing] 价格缓存写入失败：${err.message}`)
  }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:222-235](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/index.js#L222-L235)

变化监听和timer卸载处理。

<details>
<summary>查看原文（14行）</summary>

```text
  if (typeof ctx.sessionProjections?.onChanged === 'function') {
    ctx.sessionProjections.onChanged((session, key, value) => {
      if (key !== 'tokenBilling' || value === null || value === undefined) return
      if (Array.isArray(value.steps) && value.steps.length > 0) {
        mergeSteps(ledger, sessionIdOf(session), value.steps)
        scheduleLedgerFlush()
      }
    })
  }
  if (typeof ctx.on === 'function') {
    ctx.on('dispose', () => {
      if (ledgerTimer !== null) { clearTimeout(ledgerTimer); ledgerTimer = null }
      flushLedger()
    })
```

</details>

#### 缺口

- 固定宿主HTTP访问控制与异步订阅生命周期不在本次插件内可确认。
  **影响**：不能给整体访问安全或彻底卸载验收。
  **进一步探讨**：沿webServer和sessionProjections固定宿主实现确认授权、释放与重放契约。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本与采用建议，未来假设如何证伪？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主peer、原事件和持久目录 | 核对价表、provider、兼容与备份 | 未测接入耗时和初始重放 |
| 持续使用 | 投影、每分钟检查、价目网络与全量账本写盘 | 维护计价来源和异常差异 | 不主动增加模型任务，但原任务消费仍存在 |
| 失败恢复 | 原始事件、备份和重建数据 | 处理退款/更正不同步及损坏空账 | 没有自动账本撤销/更新收据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话反馈 | 估算/usage覆盖和异常估算退款 | 所有宿主事件次序下正确 |
| 路由定价 | provider优先、历史政策与自定义 | 当前报价及每个中转真实收费 |
| 持久统计 | 步骤键去重、导出和聚合 | 更正/删除同步，源码存在缺口 |
| 节省 | 按配置生成反事实数值 | 真实现金、固定费和跨币种可比 |

建议观察。对于想理解会话消费的人，实时投影和路由价有价值；但持久账本只追加与退款/重估不一致的条件风险，以及“节省”的计算口径，限制把它当可靠对账系统。继续研究可先用小型固定事件序列比较投影、账本和导出，再检查可信价格与访问控制，无需使用真实密钥或实际消费。

未验证假设是按session|turn|step保存带revision的upsert/tombstone事件，让账本记录估算→精确→撤销的修订链，并绑定取价来源/版本与原币种。相较当前append-only去重，可能让退款和价格重放可解释；代价是更复杂迁移和审计体积。最小对照固定精确完成、无usage结算后abort、同键usage更正和重启重放，比较会话/总账差额、重复记录、恢复工时和体积；若一致性未改善或迁移破坏原账，则不支持设计。尚未实现，不计已有创新。

#### 证据与依据

**依据 1 · 源码核查**：[lib/ledger.js:67-100](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/ledger.js#L67-L100)

只追加键去重是修订账本假设起点。

<details>
<summary>查看原文（34行）</summary>

```text
  let changed = false
  for (const s of steps) {
    const key = `${sessionId}|${s.turn}|${s.step}`
    const record = {
      sessionId,
      turn: s.turn,
      step: s.step,
      at: Number.isFinite(s.at) ? s.at : Date.now(),
      model: s.model ?? 'unknown',
      provider: s.provider ?? '',
      uncachedInputTokens: s.uncachedInputTokens ?? 0,
      outputTokens: s.outputTokens ?? 0,
      cacheReadTokens: s.cacheReadTokens ?? 0,
      cacheWriteTokens: s.cacheWriteTokens ?? 0,
      cost: s.cost ?? 0,
      currency: s.currency ?? '¥',
      estimated: s.estimated === true,
      mode: s.mode ?? 'usage',
    }
    if (seen.has(key)) continue
    seen.add(key)
    ledger.steps.push(record)
    changed = true
  }
  return changed ? ledger : ledger
}

/* ------------------------------------------------------------------ */
/* 聚合统计                                                           */
/* ------------------------------------------------------------------ */

/** 本地时区某天零点（YYYY-MM-DD）。 */
function dayKey(atMs, tz) {
  try {
```

</details>

**依据 2 · 源码核查**：[lib/projection.js:1199-1211](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/projection.js#L1199-L1211)

投影撤销需跨层传播。

<details>
<summary>查看原文（13行）</summary>

```text
    }
    // 移除对应的估算 step（从尾向前定位，避免 steps 截断后误弹其它条目）
    for (let si = state.steps.length - 1; si >= 0; si--) {
      const s = state.steps[si]
      if (s.step === last.step && s.turn === last.turn && s.estimated) {
        state.steps.splice(si, 1)
        break
      }
    }
  }
  state.last = null
  state.lastEstimated = null
  return state
```

</details>

**依据 3 · 源码核查**：[lib/index.js:204-228](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/index.js#L204-L228)

定时全账保存与变化合并成本。

<details>
<summary>查看原文（25行）</summary>

```text
  const ledgerFile = ledgerPath()
  let ledger = loadLedger(ledgerFile)
  let ledgerTimer = null
  const flushLedger = () => {
    ledgerTimer = null
    saveLedger(ledgerFile, ledger)
  }
  const scheduleLedgerFlush = () => {
    if (ledgerTimer !== null) return
    ledgerTimer = setTimeout(flushLedger, 1000)
  }
  /** 会话 id 提取（兼容 Session 对象 / 字符串）。 */
  const sessionIdOf = (session) => {
    if (session === null || session === undefined) return 'anon'
    if (typeof session === 'string') return session
    return String(session.id ?? session.sessionId ?? session.title ?? 'anon')
  }
  // 订阅投影变更：tokenBilling 每次结算 → 幂等合并进账本（1s 防抖落盘）
  if (typeof ctx.sessionProjections?.onChanged === 'function') {
    ctx.sessionProjections.onChanged((session, key, value) => {
      if (key !== 'tokenBilling' || value === null || value === undefined) return
      if (Array.isArray(value.steps) && value.steps.length > 0) {
        mergeSteps(ledger, sessionIdOf(session), value.steps)
        scheduleLedgerFlush()
      }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:430-450](https://github.com/2006spy/dsh-token-billing/blob/098b9e8164bd66a6f2bdbc204ece186c6ca52060/lib/index.js#L430-L450)

每分钟检查生命周期。

<details>
<summary>查看原文（21行）</summary>

```text
   */
  let lastPeakActive = null
  let lastSource = null
  const tick = () => {
    const cfg = current()
    const cached = lastFetched ?? loadPriceCache(cachePath)
    if (cached !== null) {
      const activeNow = peakActive(cached, cfg.offPeakForce === true, Date.now())
      if (activeNow !== lastPeakActive || cached.source !== lastSource) {
        lastPeakActive = activeNow
        lastSource = cached.source
        rebuild()
      }
    }
    refreshPrices(false).catch(() => {})
  }
  const timer = setInterval(tick, 60_000)
  if (typeof ctx.on === 'function') {
    ctx.on('dispose', () => clearInterval(timer))
  }

```

</details>

#### 缺口

- 没有采用前后对账时间、错误判断与净收益比较。
  **影响**：不能量化插件省钱或降低返工。
  **进一步探讨**：使用同语料人工真值比较差额与核对时间，并保留失败序列。
- 修订链与tombstone方案未实现。
  **影响**：不提高当前持久账本一致性保证。
  **进一步探讨**：以四类事件序列和重启为最小反例集合，检查差额/体积/迁移。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
