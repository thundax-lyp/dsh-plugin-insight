# DSH Cost Meter

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[e356e79](https://github.com/Han-1413141/dsh-cost-meter/tree/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5)

<!-- BEGIN META -->
[![GitHub ★ 635](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=635&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Han-1413141/dsh-cost-meter) [![npm 30d 128,808](https://img.shields.io/static/v1?label=npm+30d&message=128%2C808&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cost-meter) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cost-meter)
<!-- END META -->

> **功能**：按 DSH 会话和模型记录用量与估算费用，区分 API 与 Plan，并查询额度和余额。

> **亮点**：[Q02](#research-q02)实际Host流到会话账本与[Q03](#research-q03)API/Plan双口径有明确观测增量；[Q04](#research-q04)写事务收据、专链源序号与内存适配分别应对局部失败。计量/持久化为本项，LLM/usage、Host身份权限、实际价格与结算来源继承外部，不能用170+清单或复杂代码量推覆盖/收益。

> **主要限制**：[Q03](#research-q03)普通窗口可能合并等量独立包装调用、未知价格/缺usage不能从零额推免费；专链已有source+seq不等于普通流全有ID。[Q04](#research-q04)退出flush失败与reset非擦除、[Q05](#research-q05)默认非强凭据白名单及可重试POST，都要与“只显示费用”区分。

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
  - [Q01 · 谁需要会话费用估算，当前入口和依赖是什么？](#detail-section-11)
  - [Q02 · 普通流怎样捕获用量、传播取消并真正持久化？](#detail-section-12)
  - [Q03 · 去重、未知价格与Plan分类怎样影响零额和一致性？](#detail-section-13)
  - [Q04 · 持久化、历史重算、自动桥与清空有哪些真实副作用？](#detail-section-14)
  - [Q05 · 自定义余额怎样使用凭据、请求端点并呈现失败？](#detail-section-15)
  - [Q06 · 如何试用、核费用与停止依赖估算？](#detail-section-16)
  - [Q07 · 哪些增量已成立，普通流收据方向如何避免重复已有机制？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 多会话/多模型、愿意核价格和对账的DSH用户，想追任务级用量；成功须核同集覆盖/漏重与供应商结算差额，不是显示了金额。

[Q01](#research-q01) 供应商结算+Host日志/人工脚本已能对账；本项补会话归因、本地价类与聚合，不能取代真实结算，未证净节时或省钱。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 流用量与会话账本 | 五桶、会话/日聚合与估算 | 最后usage、普通窗口取舍，非真实账单 |
| 价类与历史 | Plan/API、时间价格、重算/导入 | 价类需核，重算有备份/确认但非自动还原 |
| 专链计量 | billion journal来源seq/cursor和覆盖状态 | 仅匹配版本/结构，非普通流全ID |
| 余额/额度 | Host凭据与可配端点结果 | 自定义可POST/重试，名单默认不强制 |
| Web与预算 | 会话金额/历史/进度与告警 | 所查流链不以预算阻止调用 |

**流程与依赖**

| 依赖或条件 | 具体版本/作用 | 缺失或边界 |
|---|---|---|
| 插件 | dsh-cost-meter1.9.58/MIT | Host与Web，发行未运行 |
| Node/DSH | Node>=20；DSH>=0.2.0-rc.1且<0.3.0-0 | 作者适配目标0.2.2-alpha.3非本轮验收 |
| Host peers | credentials/home-paths声明0.2.0rc1起并含0.2.1/0.2.2预发范围 | 凭据读写与home路径依赖Host |
| usage/价类 | Host流usage、session/provider/model、价格/币种/Plan配置 | 缺量/未知价/错类会影响估算 |
| 本地存储 | ledger.json、配置/历史备份、journal、worker/锁 | 需备份核写，reset非全擦除 |
| 网络/凭据 | 价格刷新与可选余额/额度 | 不需源先关，审端点/白名单/方法 |
| 专用桥 | 原版billion版本/结构/Node loader能力 | 不支持回原路径，覆盖不能假定 |

| 步骤 | 操作 | 成功判据与失败处理 |
|---|---|---|
| 准备 | 固定版本/Host，备份账本与核价格币种Plan | 不明先不依赖金额，不配无关密钥 |
| 采集 | 小集正常/取消/转发/等量/缺价调用 | 核Host日志、本地及供应商同集差额 |
| 使用 | 查会话/日聚合和额度状态/时间 | 零额、stale或error不当免费/实时余额 |
| 恢复 | 保全原件，查写失败/锁/价类，确认后才重算 | 备份与pending核验，未解回供应商 |
| 退出 | 卸载Host核后台/子进程，单独处理凭据/备份 | 关标签/reset不等于停止或全删 |

**效果与成本**

| 阶段 | 现金与资源 | 人工与时间 |
|---|---|---|
| 首次 | 对照调用/本地存储费用未知 | 版本/价格/价类/端点配置分钟未知 |
| 持续 | ledger/journal/worker、可选网络资源未知 | 对账/价表/接口维护及净节时未知 |
| 失败恢复 | 备份/重算/补核资源未知 | 缺量/锁/receipt/配置恢复分钟未知 |
| 退出 | 历史/备份/原调用费用保留未知 | 核Host后台/密钥/残留时间未知 |

| 效果项 | 当前源码支持 | 尚不能证明 |
|---|---|---|
| 归因 | 实际usage映射并按sessionId聚合 | 真实收费调用全覆盖及账单误差率 |
| 去重 | ALS/十秒窗口及专链source-seq | 普通等量包装/扇出无漏记 |
| 持久化 | worker receipt、跨进程锁和fsync替换 | 所有掉电/磁盘/退出均不丢失 |
| 余额 | 配置校验、凭据解析、实际fetch与error状态 | 每厂商权限/结果正确与无副作用 |
| 经济效果 | 可提出小集对照与退路 | 净省钱/节时、硬预算和新供给结构 |

> **思考**：[Q03](#research-q03)普通窗口可能合并等量独立包装调用、未知价格/缺usage不能从零额推免费；专链已有source+seq不等于普通流全有ID。[Q04](#research-q04)退出flush失败与reset非擦除、[Q05](#research-q05)默认非强凭据白名单及可重试POST，都要与“只显示费用”区分。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)实际Host流到会话账本与[Q03](#research-q03)API/Plan双口径有明确观测增量；[Q04](#research-q04)写事务收据、专链源序号与内存适配分别应对局部失败。计量/持久化为本项，LLM/usage、Host身份权限、实际价格与结算来源继承外部，不能用170+清单或复杂代码量推覆盖/收益。

[Q02](#research-q02)取消return、[Q03](#research-q03)普通窗口与专链source/seq、[Q04](#research-q04)worker失ACK查盘receipt/跨进程锁/fsync处理具体故障；不同层保证不能混同，close失败/非强白名单与桥兼容维护仍是反例。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)普通窗口可能合并等量独立包装调用、未知价格/缺usage不能从零额推免费；专链已有source+seq不等于普通流全有ID。[Q04](#research-q04)退出flush失败与reset非擦除、[Q05](#research-q05)默认非强凭据白名单及可重试POST，都要与“只显示费用”区分。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q06](#research-q06) 先固定版本/备份/核价格与端点，小调用集对照供应商，只有差异可解释才继续；缺量/错类/写失败或凭据来源不明暂停金额依据。退出核Host后台和已启动桥/备份，保留记录回供应商账单及人工日志。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

1.9.58原生plugin代表采集、去重/价类、worker落盘、启动/重算/退出与自定义余额链已静态核查；仅建议已知小调用集对账试用。未运行目标/Host/供应商，估算非账单、预算非本轮证实硬门，不能承诺省钱或财务完整性。

- 已检查：作者 README、包清单、源码路径 README.md、lib/billing-stream.js、lib/billion-context-auto.js、lib/billion-context-billing.js、lib/billion-context-loader.js、lib/billion-context-patch.js、lib/billion-context-preload.js、lib/custom-balance.js、lib/index.js、lib/ledger-persistence.js、lib/net.js、lib/session-storage-compat.js、lib/store.js、lib/usage-dedup.js、package.json、scripts/build.mjs、src/bootstrap.js、src/ledger-writer-worker.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：旧七题/12findings完整复核；当前包/构建入口、普通usage/去重/价格类别、ledger→worker→锁/真实文件写与close、启动迁移/导入和重算接线、reset、专桥launch/preload/loader与source-seq消费、代表自定义余额凭据/fetch/结果。未全审每供应商、桥所有覆盖/修复分支、全部CLI/UI与Host RPC认证/存储后端实现或真实效果。
- 下一步：只读固定源码，研究原件装配/结构校验；未安装运行目标测试/构建/插件、Host/模型/供应商或读取真实账户。未来隔离Host/mock先核普通/专链漏重、写入/退出失败、端点/密钥边界，再授权对账，不能称本轮已测。

**分析版本**

- **仓库**：[Han-1413141/dsh-cost-meter](https://github.com/Han-1413141/dsh-cost-meter)
- **版本号**：1.9.58（[固定提交 e356e79](https://github.com/Han-1413141/dsh-cost-meter/tree/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q07](#research-q07)只针对普通流/包装接缝提出Host可信attempt ID+父包装关系及缺usage/未知价状态，比较当前窗口、已有专链和简单unknown提示/Host日志。测漏重、持久重放、人工分钟与开销；ID不可信/现有覆盖足或维护误差更大即否定，不把已实现source+seq再算新功能。

只读固定源码，研究原件装配/结构校验；未安装运行目标测试/构建/插件、Host/模型/供应商或读取真实账户。未来隔离Host/mock先核普通/专链漏重、写入/退出失败、端点/密钥边界，再授权对账，不能称本轮已测。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 324 | 15842 | — | — | 378535 |
| .js | source | 148 | 41542 | 35752 | 5272 | — |
| .mjs | source | 11 | 900 | 736 | 148 | — |
| .mjs | test | 246 | 40360 | 37147 | 2379 | — |
| .mjs | example | 6 | 263 | 230 | 28 | — |
| .md | example | 1 | 21 | — | — | 175 |
| .js | example | 1 | 3 | 3 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/Han-1413141/dsh-cost-meter/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 105](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=105&color=737b86&logo=github)](https://github.com/Han-1413141/dsh-cost-meter/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z) [![近30天关闭 103](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=103&color=737b86&logo=github)](https://github.com/Han-1413141/dsh-cost-meter/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：按固定1.9.58复核普通流及专链的计量/价类/落盘边界、凭据网络和退出副作用，形成对账采用与可证伪方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要会话费用估算，当前入口和依赖是什么？

**研究主题**：场景与需求、依赖、兼容与流程、贡献与相对优势

#### 完整回答

本项是DSH原生Host服务加Web客户端plugin，包1.9.58/MIT，Node>=20、engines.dsh >=0.2.0-rc.1 <0.3.0-0；作者把宿主floor称0.2.0、适配目标0.2.2-alpha.3，不能把兼容声明当本轮安装通过。正式入口lib/bootstrap.js由src/bootstrap.js打包：先安装billion-context launch observer，异步载入index后将apply转给真正Host生命周期；index打开本地账本、安装全局流监听/会话投影并provide costMeter，客户端经Host typert调用。凭据/home-paths是Host peer，发行业务还需实际usage和模型价表。

适合同时使用多会话/模型、愿意核价格和对账的用户：想知道哪项会话耗用了多少，而供应商账单通常是账户结算视角。成功应按同一调用集核归因覆盖、重复/漏计和本地估算与账单差额，不是页面有数字；供应商账单+Host日志/手工脚本是直接替代。会话归因、Plan等值与API估算分离有局部价值，不能取代真实结算或证明省钱。

本轮更新完整复核旧七题和12findings，重点追普通采集/去重/价类、worker落盘、启动迁移、代表自定义余额请求与退出/重算；billion专链核新增入口/能力/源序号与消费，未全审每厂商/桥内所有覆盖分支、所有CLI和UI。inventory的客户端片段解析错误须按build拼接机制解释，不能单凭分片语法报错认定发布成品不可用，其他错误也不冒充全部已消除。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-37](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/package.json#L1-L37)

版本、bootstrap/client及typert导出与Web声明。

<details>
<summary>查看原文（37行）</summary>

```text
{
  "name": "dsh-cost-meter",
  "version": "1.9.58",
  "description": "DeepSeek Harness 会话费用统计插件:本会话成本、当日费用、历史记录与官方价格同步,支持多厂商多模型价格计费(内置 170+ 模型 ID 价格目录与自动匹配)、主流 Coding Plan 订阅额度查询与显示(16 家,含 WorkBuddy 官方积分、OpenDesign 工作区查询、含小米 MiMo Token Plan 控制台 Cookie 查询、SCNet Token Plan 本地 Credits 计量与火山方舟 Volcano Ark Coding Plan AK/SK 签名查询)、自定义 Provider 余额查询(可配任意 HTTP 端点)与余额进度条、峰谷计价时段显示与切换前弹窗/系统通知提醒(位置/提前量/类型可配),界面中英双语。Session cost tracking plugin for DeepSeek Harness: per-conversation cost, daily totals, history and official price sync, with multi-vendor model pricing (built-in 170+ model-ID catalog with auto-matching), Coding Plan quota queries & display for 16 vendors (incl. WorkBuddy official credits, OpenDesign workspace queries, Xiaomi MiMo Token Plan via console cookie, local credits metering for the SCNet Token Plan and Volcano Ark Coding Plan via AK/SK signature), plan/API dual-track billing with per-1% & full-window Token Plan usage estimates, custom provider balance lookup (configurable HTTP endpoint) and balance progress bar, plus peak/off-peak pricing display with pre-switch popup & system-notification alerts (position / lead time / type configurable), in a bilingual (Chinese/English) UI.",
  "type": "module",
  "main": "lib/bootstrap.js",
  "bin": {
    "dsh-cost-meter": "./lib/billing-storage-cli.js",
    "dsh-cost-meter-repair-sessions": "./lib/repair-sessions-cli.js"
  },
  "exports": {
    ".": {
      "default": "./lib/bootstrap.js"
    },
    "./client": {
      "default": "./lib/client.js"
    },
    "./typert": {
      "default": "./lib/typert.host.js"
    },
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    },
    "compatibility": {
      "dsh": ">=0.2.0-rc.1 <0.3.0-0",
      "dshReleases": {
        "0.2.0-rc.1": "compatible",
        "0.2.0-rc.2": "compatible",
        "0.2.1-alpha.5": "compatible",
        "0.2.1-rc.1": "compatible",
```

</details>

**依据 2 · 源码核查**：[package.json:218-225](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/package.json#L218-L225)

库与Host peer具体依赖声明。

```text
  "dependencies": {
    "acorn": "8.15.0",
    "zod": "4.6.6"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-credentials": ">=0.2.0-rc.1 <0.3.0-0 || >=0.2.1-0 <0.3.0-0 || >=0.2.2-0 <0.3.0-0",
    "@deepseek-ai/dsh-home-paths": ">=0.2.0-rc.1 <0.3.0-0 || >=0.2.1-0 <0.3.0-0 || >=0.2.2-0 <0.3.0-0"
  },
```

**依据 3 · 源码核查**：[package.json:247-251](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/package.json#L247-L251)

包许可证与Node/DSH engines。

```text
  "license": "MIT",
  "engines": {
    "node": ">=20",
    "dsh": ">=0.2.0-rc.1 <0.3.0-0"
  },
```

**依据 4 · 源码核查**：[src/bootstrap.js:1-18](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/src/bootstrap.js#L1-L18)

先安装observer，转交真实apply并释放loading引用。

<details>
<summary>查看原文（18行）</summary>

```text
/** Keep startup in one module so parallel plugin imports cannot delay the hook behind UI dependencies. */
import { installBillionAuto } from '../lib/billion-context-auto.js'

// Hold the launch observer while dependencies load. The real plugin owns the
// applied lifetime, including tools that reload lib/index.js directly.
const releaseLoading = installBillionAuto()
let plugin
try { plugin = await import('./index.js') }
catch (error) { releaseLoading(); throw error }
const loadingTimer = setTimeout(releaseLoading, 0)
loadingTimer.unref?.()

export const name = 'cost-meter'
export function apply(ctx) {
  clearTimeout(loadingTimer)
  try { return plugin.apply(ctx) }
  finally { releaseLoading() }
}
```

</details>

**依据 5 · 源码核查**：[lib/index.js:3695-3708](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/index.js#L3695-L3708)

真实打开账本/创建session源与汇率定时器。

<details>
<summary>查看原文（14行）</summary>

```text
function applyCore(ctx) {
  const ledger = Ledger.open()
  // 会话存储记录源(T3):JSONL 模式仍枚举会话文件,SQLite(session-rdb)模式改走
  // 数据库;创建本身是惰性的(首次回填/导入/修复时才真正探测)。
  const sessionLifetime = new AbortController()
  let backfillTask = Promise.resolve()
  let cancelBackfill = () => sessionLifetime.abort()
  const sessionSource = createSessionRecordSource(ctx, join(resolveDshHome(), 'sessions'), { signal: sessionLifetime.signal })
  const exchangeRates = createExchangeRateRefresh(ledger)
  const refreshExchangeRates = () => exchangeRates.refresh().catch(() => {})
  const exchangeTimer = setTimeout(refreshExchangeRates, 5000)
  const exchangeDailyTimer = setInterval(refreshExchangeRates, 3600000)
  exchangeTimer.unref?.(); exchangeDailyTimer.unref?.()
  ctx.effect(() => () => { clearTimeout(exchangeTimer); clearInterval(exchangeDailyTimer); exchangeRates.dispose() }, 'cost-meter: daily exchange rates')
```

</details>

**依据 6 · 源码核查**：[lib/index.js:3850-3877](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/index.js#L3850-L3877)

全局计量注册、投影和costMeter服务实际接线。

<details>
<summary>查看原文（28行）</summary>

```text
  ctx.on('llm/stream', createLlmStreamBilling({
    activity: contextActivity(ctx),
    bridge: billionContext,
    account: (usage, model, sessionId, atMs, provider) => {
      const buckets = {
        input: usage.inputTokens ?? 0,
        output: usage.outputTokens ?? 0,
        cacheRead: usage.cacheReadTokens ?? 0,
        cacheWrite: usage.cacheWriteTokens ?? 0,
        reasoning: usage.reasoningTokens ?? 0,
      }
      // 非字符串 provider(个别路由 header 配置异常,日志渲染为 [object Object])
      // 在去重器内归一为空串,由账本按缺省渠道处理,避免脏键。
      const effective = usageDeduper.admit(sessionId, model, provider, buckets, atMs)
      if (effective === null) return
      ledger.account(buckets, model, sessionId, atMs, effective)
    },
  }), { global: true })

  // costUsage 投影:向会话历史页/推送帧提供 token 桶(客户端计价)。
  installNativeSearchBilling(ctx, ledger)

  ctx.inject(['sessionProjections'], (projectionCtx) => {
    projectionCtx.sessionProjections.register(makeCostUsageProjection(ledger))
  })

  // RPC 服务:客户端经 remote.costMeter.* 调用(./typert 清单由 typert-loader 注册)。
  ctx.provide('costMeter', createService(ctx, ledger, openRouterPrices, openDesignPrices, codexSubscription, sessionSource))
```

</details>

**依据 7 · 源码核查**：[scripts/build.mjs:27-39](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/scripts/build.mjs#L27-L39)

worker/bootstrap实际bundle输入与输出。

<details>
<summary>查看原文（13行）</summary>

```text
// Worker threads have no DSH module resolver. Ship their dependency graph in
// one file, including the pure home-path helper, rather than importing host peers.
await build({ entryPoints: [resolve(projectRoot, 'src/ledger-writer-worker.js')], outfile: resolve(projectRoot, 'lib/ledger-writer-worker.js'),
  bundle: true, platform: 'node', format: 'esm', minify: true, target: 'node20', legalComments: 'inline',
  banner: { js: '// Generated from src/ledger-writer-worker.js by scripts/build.mjs; do not edit.' } })
assert.ok(Buffer.byteLength(readFileSync(resolve(projectRoot, 'lib/ledger-writer-worker.js'))) <= 262144, 'ledger worker exceeds DSH STORE bound')

// A single import installs the local proxy observer before loading price/UI
// dependencies. Bundle its parser too, avoiding asynchronous dependency loading
// while the host starts other plugins in parallel.
await build({ entryPoints: [resolve(projectRoot, 'src/bootstrap.js')], outfile: resolve(projectRoot, 'lib/bootstrap.js'),
  bundle: true, platform: 'node', format: 'esm', external: ['./index.js'], minify: true, target: 'node20', legalComments: 'inline',
  banner: { js: '// Generated from src/bootstrap.js by scripts/build.mjs; do not edit.\n/*! Bundles Acorn.\n' + readFileSync(resolve(projectRoot, 'node_modules/acorn/LICENSE'), 'utf8').replaceAll('\r\n', '\n') + '\n*/' } })
```

</details>

**依据 8 · 源码核查**：[scripts/build.mjs:42-63](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/scripts/build.mjs#L42-L63)

片段排序、上限检查和真实拼接。

<details>
<summary>查看原文（22行）</summary>

```text
const ORDERED_FRAGMENT = /^\d{2}-[a-z0-9-]*\.js$/
const clientDir = resolve(projectRoot, 'src/client')
const fragments = readdirSync(clientDir).filter(name => name.endsWith('.js')).sort()
if (fragments.length === 0) {
  console.error('✗ src/client/ contains no .js source fragments')
  process.exit(1)
}
const unexpected = fragments.filter(name => !ORDERED_FRAGMENT.test(name))
if (unexpected.length > 0) {
  console.error(`✗ unexpected file(s) in src/client/ (must match NN-name.js so sort order stays program order): ${unexpected.join(', ')}`)
  process.exit(1)
}
for (const name of fragments) {
  // 与 DSH STORE 审核同口径:UTF-8 字节,中文文案算多字节。
  const bytes = Buffer.byteLength(readFileSync(resolve(clientDir, name), 'utf8'), 'utf8')
  if (bytes > 262144) {
    console.error(`✗ src/client/${name} exceeds 262144 bytes (${bytes}) — split the fragment`)
    process.exit(1)
  }
}

let src = fragments.map(name => readFileSync(resolve(clientDir, name), 'utf8')).join('')
```

</details>

**依据 9 · 作者声明**：[README.md:19-25](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/README.md#L19-L25)

作者修复与适配目标声明。

```text
**v1.9.58** fixes the session-cost entry disappearing when conversation usage arrives before plugin settings. The entry stays visible while loading and shows the amount once settings are ready.

**Host floor: DSH 0.2.0** · Adaptation target: **0.2.2-alpha.3**. Expand the compatibility notes below for exact declarations, host records and troubleshooting.

Release notes: [v1.9.58](docs/update-notes-1.9.58.md#english). Fully restart DSH after updating.

![Promo art](docs/promo.en.png)
```

#### 缺口

- 缺真实用户需求频率、实际Host安装及账户账单同集对照。
  **影响**：不从功能或下载数量推出采用收益。
  **进一步探讨**：隔离Host固定模型/价格，少量已知调用比供应商账单和人工归因时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 普通流怎样捕获用量、传播取消并真正持久化？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

Host apply在llm/stream以global:true安装createLlmStreamBilling，跨服务scope观察；映射input/output/cacheRead/cacheWrite/reasoning五桶，传sessionId、请求发起时间、provider。无sessionId只入日汇总，实际applyAccount在有非空会话ID时才建会话条目，不把全局总量都算当前会话。

监听先取next()得到下游，ALS有标记直接透传；外层逐次iterator.next置深度1，捕获最后一个usage并原样yield所有chunk。不是累加每个usage快照，也不是另跑推理。消费提前break/throw时finally await iterator.return（错误吞掉），退出activity，再await proxy.finish；只有已捕获usage且专用bridge未cover才调用普通account。请求下游return不是供应商必定停止/未收费的证明；缺usage的普通链没有可入账量，proxy.finish自身异常也不应被说成account日志可兜住一切。

Ledger.account选时间版本价格/币种和Plan分类，构造含会话/时间/providerKey的call，先applyAccount更新内存聚合、追加pendingAccounts后2秒调度flushAsync。账本实际在DSH_HOME/storages/cost-meter/ledger.json。内存金额/排队写入不等于磁盘确认；后台worker和退出flush见Q04，不把最后一帧或UI数字视为持久化验收。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:3846-3867](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/index.js#L3846-L3867)

真实全局监听、五桶映射、值去重与ledger.account。

<details>
<summary>查看原文（22行）</summary>

```text
  const usageDeduper = createUsageDeduper()
  // 记忆插件等可创建隔离的 llm 服务；账本是全局观察者，须跨服务作用域接收用量。
  // 子会话仍按自己的 sessionId 入账；无 sessionId 的后台调用只进入日/月总计。
  const billionContext = installBillionContextBilling(ctx, ledger)
  ctx.on('llm/stream', createLlmStreamBilling({
    activity: contextActivity(ctx),
    bridge: billionContext,
    account: (usage, model, sessionId, atMs, provider) => {
      const buckets = {
        input: usage.inputTokens ?? 0,
        output: usage.outputTokens ?? 0,
        cacheRead: usage.cacheReadTokens ?? 0,
        cacheWrite: usage.cacheWriteTokens ?? 0,
        reasoning: usage.reasoningTokens ?? 0,
      }
      // 非字符串 provider(个别路由 header 配置异常,日志渲染为 [object Object])
      // 在去重器内归一为空串,由账本按缺省渠道处理,避免脏键。
      const effective = usageDeduper.admit(sessionId, model, provider, buckets, atMs)
      if (effective === null) return
      ledger.account(buckets, model, sessionId, atMs, effective)
    },
  }), { global: true })
```

</details>

**依据 2 · 源码核查**：[lib/billing-stream.js:40-70](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/billing-stream.js#L40-L70)

ALS嵌套透传、拉取与保存最后usage，原样yield。

<details>
<summary>查看原文（31行）</summary>

```text
export function createLlmStreamBilling({ account, now = Date.now, bridge, activity }) {
  return (options, next) => {
    const downstream = next()
    // 嵌套内层(包装路由在上层计费流的消费上下文中再发起的 llm/stream):
    // 外层已记账,透传下游流,不再包裹。
    if (llmStreamDepth.getStore() !== undefined) return downstream
    // 峰谷档位按「请求发起」时刻判定:一次流式调用可能跨峰谷边界整点,
    // 按完成时刻归档会把数分钟前发起的请求算进另一个峰位(官方口径为
    // 请求侧计时;实测跨点分歧可达分毛级)。瀑布分发即请求发起时刻。
    const startedAtMs = now()
    const proxy = bridge?.createScope(options, startedAtMs)
    return (async function* costMeterStream() {
      let usage = null
      const release = activity?.enter(options?.sessionId)
      let iterator
      let completed = false
      try {
        iterator = downstream[Symbol.asyncIterator]()
        for (;;) {
          // 在深度标记内拉取下游:下游适配器(modlens 等)体内再发起的
          // ctx.llm.stream() 同步瀑布分发继承 depth=1,其监听器判定为嵌套。
          const result = await llmStreamDepth.run(1, () => proxy ? proxy.run(() => iterator.next()) : iterator.next())
          if (result.done) break
          const chunk = result.value
          if (chunk !== null && chunk !== undefined && chunk.type === 'usage' && chunk.usage != null) {
            usage = chunk.usage
            proxy?.observe(usage)
          }
          yield chunk
        }
        completed = true
```

</details>

**依据 3 · 源码核查**：[lib/billing-stream.js:71-95](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/billing-stream.js#L71-L95)

异常再抛、finally return、bridge.finish及条件入账。

<details>
<summary>查看原文（25行）</summary>

```text
      } catch (error) {
        // Names only: messages, headers and request contents may contain secrets.
        const name = /^[A-Za-z][A-Za-z0-9]{0,63}$/.test(error?.name) ? error.name : 'Error'
        console.warn(`[dsh-cost-meter] stream interrupted (${name}); context measurement deferred during generation`)
        throw error
      } finally {
        // 手写 for(;;) 不具备 for-await 的自动关闭语义:消费方提前中断(break/
        // return/throw)时必须显式向下游传播 return(),否则上游 HTTP 流会继续
        // 跑完(供应商照常计满 token,usage 块却无人读取),socket 悬挂泄漏。
        if (!completed) {
          try {
            await iterator?.return?.()
          } catch {}
        }
        release?.()
        const covered = proxy ? await proxy.finish(usage) : false
        if (usage !== null && !covered) {
          try {
            account(usage, options?.model, options?.sessionId, startedAtMs, options?.provider)
          } catch (error) {
            console.warn(`[dsh-cost-meter] 计费失败: ${String(error)}`)
          }
        }
      }
    })()
```

</details>

**依据 4 · 源码核查**：[lib/store.js:2281-2285](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/store.js#L2281-L2285)

账本真实目录及带锁load。

```text
  /** 在 $DSH_HOME 下创建/加载账本。 */
  static open() {
    const root = join(resolveDshHome(), 'storages', 'cost-meter')
    const path = join(root, 'ledger.json')
    return withLedgerLock(path, () => Ledger.load(path))
```

**依据 5 · 源码核查**：[lib/store.js:2447-2459](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/store.js#L2447-L2459)

call→内存聚合→pending→schedule真实顺序。

<details>
<summary>查看原文（13行）</summary>

```text
    const planId = cls === 'plan' ? (planProviderIdOf(provider, planBilling, modelId)
      ?? (isRoutedThirdPartyCall(provider, modelId, this.config.prices) ? 'go' : null)) : null
    const call = {
      ...(meter ? { meter } : {}),
      date: localDayKey(atMs), sessionId, atMs, recordedAt: Date.now(), planId,
      providerKey: `${typeof provider === 'string' && provider.length > 0 ? provider : 'deepseek'}:${String(modelId ?? 'default')}`,
      values: { ...buckets, calls: 1, cost, apiCost, ...frozenAmounts(cost, apiCost, pricing) },
    }
    if (!applyAccount(this, call)) return false
    this.pendingAccounts.push(call)
    this.prune()
    this.scheduleWrite()
    return true
```

</details>

**依据 6 · 源码核查**：[lib/store.js:2477-2484](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/store.js#L2477-L2484)

2秒写调度。

```text
  scheduleWrite() {
    this.writeGeneration++
    this.pendingWrite = true
    if (this.writeTimer !== null) return
    this.writeTimer = setTimeout(() => {
      this.writeTimer = null
      void this.flushAsync()
    }, 2000)
```

**依据 7 · 源码核查**：[lib/ledger-persistence.js:218-238](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/ledger-persistence.js#L218-L238)

日聚合与非空sessionId才写会话容器。

<details>
<summary>查看原文（21行）</summary>

```text
  const { date, sessionId, atMs, providerKey, values, planId } = entry
  if (!object(state.days[date])) state.days[date] = { date, ...empty(), byProviderModel: {}, sessions: [] }
  const day = state.days[date]
  if (!Array.isArray(day.sessions)) day.sessions = []
  const containers = [day]
  if (typeof sessionId === 'string' && sessionId.length > 0) {
    let session = day.sessions.find(s => s.id === sessionId)
    if (!session) {
      session = { id: sessionId, at: atMs, ...empty(), byProviderModel: {} }
      day.sessions.push(session)
    }
    containers.push(session)
  }
  for (const container of containers) {
    add(container, values)
    container.byProviderModel ??= {}
    const bucket = container.byProviderModel[providerKey] ??= empty()
    add(bucket, values)
  }
  if (planId !== null) state.planHourBuckets = appendHourBucket(state.planHourBuckets, planId, atMs,
    totalUsageTokens(values), values.cost)
```

</details>

#### 缺口

- 未验正常/多usage/取消前后、bridge失败及真实供应商停流和落盘对账。
  **影响**：不能保证捕获所有已收费调用、return必停费或UI金额已持久。
  **进一步探讨**：隔离已知调用逐帧及异常中断，对比供应商记录、Host日志和重启账本。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 去重、未知价格与Plan分类怎样影响零额和一致性？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

普通流的ALS深度按异步上下文识别内层，pull内派生多上游的扇出不能靠固定1标记区分独立费用；不从单包装修复推广任意路由。逃逸ALS的包装/上游双份usage另由usageDeduper处理：会话、归一provider/model、五桶逐位指纹和请求发起时间10秒窗；普通只与remapped互斥，包装与plain/remapped都互斥，普通等量独立调用不会互相去重。包装等量独立请求在窗口内仍可误合并；乱序请求用Math.abs时间比较，arrival clock做保留清理。不能把注释称概率低当真实漏记率测量。

pricingConfigAt按时间/会话取价格，providerPriceEntryFor解析，resolved.priced为假则priced=0；可接requestFee的官方请求费另校验。零成本可能是价格未匹配，缺桶/非法桶归零也不证明免费。cost按币种汇率折USD；billingClassOf用当前planBilling/enabledPlans/模型配置分类，Plan apiCost=0但仍有cost等值。该结构是本地估算与分类，不是供应商真实现金已验证；Plan订阅固定费/外部调用也不能从apiCost零推没有成本。

billion专链已不同：journal row生成meter.source+seq，usageCursor大于等于seq不再apply，missing usage/重置前/策略fallback也advance cursor；status计unreported/partial。applyAccount把cursor与金额纳入同一账本状态。这是已有按来源重放收据，不能沿用旧稿把所有稳定ID都当新方向；也不能反推普通account已带meter或每供应商request ID。

#### 证据与依据

**依据 1 · 源码核查**：[lib/billing-stream.js:20-28](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/billing-stream.js#L20-L28)

ALS固定标记与扇出边界作者说明。

```text
/**
 * 嵌套深度标记:值恒为 1(存在即嵌套);按异步上下文隔离,并发流互不串扰。
 *
 * 设计边界(R-7):恒定深度标记会把「外层 pull 的异步上下文内同步分发瀑布时」
 * 发起的任何 ctx.llm.stream() 一律判定为已记账的嵌套调用。单层包装链
 * (issue #48 目标:适配器在自己 stream() 体内恰好发起一次上游调用)语义正确;
 * 若未来出现扇出型路由——单次 pull 内派生 >1 条上游流——第二条及之后的上游
 * 将被误判为嵌套而漏记。出现此类路由时需改用按流实例区分的标记身份。
 */
```

**依据 2 · 源码核查**：[lib/usage-dedup.js:26-42](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/usage-dedup.js#L26-L42)

十秒窗与五桶指纹实际定义。

<details>
<summary>查看原文（17行）</summary>

```text
/** 与投影折叠(lib/index.js)/历史回放(lib/backfill.js)共用的窗口宽度。 */
export const USAGE_DEDUP_WINDOW_MS = 10_000

/**
 * (上游 provider, model, 五桶) 指纹:逐位精确比较。包装转发的双份 usage 实测逐位相同
 * (issue #48 报告「同 token 逐位相同 ×3」),无需模糊。
 */
export function usageFingerprint(model, buckets, provider) {
  return JSON.stringify([
    String(provider ?? '').trim().toLowerCase().replace(/^llm-/, ''),
    String(model ?? ''),
    buckets?.input ?? 0,
    buckets?.output ?? 0,
    buckets?.cacheRead ?? 0,
    buckets?.cacheWrite ?? 0,
    buckets?.reasoning ?? 0,
  ])
```

</details>

**依据 3 · 源码核查**：[lib/usage-dedup.js:92-113](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/usage-dedup.js#L92-L113)

会话/包装/provider归一、绝对时间窗及互斥规则。

<details>
<summary>查看原文（22行）</summary>

```text
    admit(sessionId, model, provider, buckets, atMs) {
      const prov = typeof provider === 'string' ? provider : ''
      const wrapped = isWrapperProviderId(prov)
      const effective = wrapped ? (wrapperUpstreamProvider(prov) ?? prov) : prov
      const key = typeof sessionId === 'string' && sessionId.length > 0 ? sessionId : ''
      const t = Number.isFinite(atMs) && atMs > 0 ? atMs : now()
      const clock = now()
      const fp = usageFingerprint(model, buckets, effective)
      let entry = sessions.get(key)
      if (entry === undefined) {
        entry = { plain: new Map(), remapped: new Map() }
        sessions.set(key, entry)
      }
      sweep(entry.plain, clock)
      sweep(entry.remapped, clock)
      const book = wrapped ? entry.remapped : entry.plain
      // 包装样本与普通样本、改挂样本都互斥;普通样本只与改挂样本互斥。
      const matches = source => source.get(fp)?.some(row => Math.abs(t - row.at) <= windowMs) === true
      if (wrapped ? (matches(entry.plain) || matches(entry.remapped)) : matches(entry.remapped)) {
        return null
      }
      book.set(fp, [...(book.get(fp) ?? []), { at: t, seen: clock }].slice(-maxEntries))
```

</details>

**依据 4 · 源码核查**：[lib/store.js:2409-2445](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/store.js#L2409-L2445)

真实价表解析、未知价零额、汇率/Plan API与桶归一。

<details>
<summary>查看原文（37行）</summary>

```text
  account(tokens, modelId, sessionId, atMs, provider, meter, requestFee) {
    if (this.closed) return
    if (requestFee !== undefined && (!validRequestFee(requestFee, atMs) || provider !== 'deepseek-official' || !matchesRequestFeeModel(modelId, requestFee))) throw new Error('Invalid official web request fee')
    const pricing = pricingConfigAt(this.config, atMs, sessionId, `${provider || 'deepseek'}:${modelId}`)
    const resolved = providerPriceEntryFor(provider, modelId, pricing.prices, {
      mode: pricing.priceMatch === 'exact' ? 'exact' : 'auto',
      overrides: pricing.priceOverrides,
    })
    const entry = resolved.entry ?? { cacheHit: 0, cacheMiss: 0, output: 0 }
    const peak = {
      enabled: ['deepseek-peak', 'utc-peak'].includes(resolved.billingMode) && pricing.peakEnabled === true,
      effectiveAtMs: Date.parse(pricing.peakEffectiveAt),
      windows: pricing.peakWindows,
      holidays: pricing.peakHolidays,
    }
    // 官方价格币种为人民币(issue #47)时,DeepSeek 主表(峰谷计费,含 default
    // 兜底与跨厂商兑底命中)计出的成本为人民币,按展示汇率折算为美元入账;
    // 第三方 flat 恒为美元价,直接入账。
    const priced = requestFee ? requestFee.requests * requestFee.rateCny : resolved.priced ? costOf(tokens, entry, atMs, peak) : 0
    const cost = usdFromCost(priced, requestFee ? 'CNY' : resolved.currency, fxRatesOf(pricing).CNY)
    // Plan/API 双轨分类(issue #64):plan 类调用金额只记等值(cost),apiCost 记真金白银部分;
    // Plan 类调用同时进入 provider×小时聚合桶(供 5 小时滚动窗本地量聚合)。
    const planBilling = this.config.planBilling
    const enabledPlans = enabledPlanSetOf(this.config)
    const cls = requestFee ? 'api' : billingClassOf(provider, modelId, planBilling, enabledPlans, this.config.prices)
    const apiCost = cls === 'api' ? cost : 0
    // 归一化各桶 token 数:非有限/负数一律按 0 处理,防止污染账本聚合。
    const num = value => {
      const n = Number(value)
      return Number.isFinite(n) && n > 0 ? n : 0
    }
    const buckets = {
      input: num(tokens?.input),
      output: num(tokens?.output),
      cacheRead: num(tokens?.cacheRead),
      cacheWrite: num(tokens?.cacheWrite),
      reasoning: num(tokens?.reasoning),
```

</details>

**依据 5 · 源码核查**：[lib/billion-context-billing.js:189-201](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/billion-context-billing.js#L189-L201)

专链来源seq、未报量/partial及skip或入账。

<details>
<summary>查看原文（13行）</summary>

```text
              offset = item.offset
              status.requests++
              if (!row.usage) status.unreported++
              else if (!row.complete) status.partial++
              const meter = { source: row.source + ':' + file.key, seq: row.seq }
              const reset = ledger.historyReset?.at ?? 0
              if ((ledger.usageCursors?.[meter.source] ?? 0) < meter.seq) {
                if (!row.usage || row.startedAtMs <= reset || stream.policies?.[row.groupId] === 'fallback') ledger.advanceUsageCursor(meter)
                else ledger.account(usageBuckets(row.usage), row.model, row.sessionId, row.startedAtMs, billionProvider(row, stream), meter)
              }
              if (++work >= 5000) break
            }
            files.set(file.path, { offset, size: blocked || offset < info.size && work >= 5000 ? -1 : info.size, mtime: info.mtimeMs })
```

</details>

**依据 6 · 源码核查**：[lib/ledger-persistence.js:209-217](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/ledger-persistence.js#L209-L217)

meter验证/游标拒重与skip路径。

```text
export function applyAccount(state, entry) {
  if (entry.meter) {
    const { source, seq } = entry.meter
    if (!meterSource(source) || !Number.isSafeInteger(seq) || seq < 1) throw Error('Invalid metered call identity')
    if ((state.usageCursors?.[source] ?? 0) >= seq) return false
    state.usageCursors ??= {}
    state.usageCursors[source] = seq
    if (entry.skip) return true
  }
```

#### 缺口

- 包装等量、扇出、缺价/漏usage与Plan/API实际账单偏差未量化。
  **影响**：零额不证明免费，源码去重存在取舍而非财务完整性保证。
  **进一步探讨**：同会话等量独立包装/普通、重复转发、不同模型价类和缺usage对照真实账单；分普通与专链核差额。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 持久化、历史重算、自动桥与清空有哪些真实副作用？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

flushAsync生成事务UUID，送worker；worker在跨进程账本目录锁内比磁盘revision/merge，再把transactionId写receipts和账本同一提交，回执丢失时主线程读盘查receipt再决定完成/重试，EBUSY排队、其他worker失败本次运行降同步。withLedgerLock真实mkdir lock+唯一owner并探旧owner，writeDurableJson临时wx0600、文件fsync→rename、非Windows目录fsync；这是落盘协议，不证明所有文件系统/断电测试通过。普通call的receipt是写事务，非上游模型请求ID，不能解决采集层等量误合并。

close等待在途worker，再flush(5000)并closed=true；flush失败只warn+排重试，close仍可关闭并清timer。因此退出走过close也不保证pending全已提交，应重启核账本/外部记录。常规快照stripSecrets但账本仍是本地会话ID/用量/配置，不能当加密数据库。启动3秒后先跑密钥迁移、会话历史导入/归类修复；会读Host sessions的JSONL或RDB统一源，具体每存储后端和修复callee未全审，不说启动只读/绝不改历史。手工repriceHistory需要confirmed===true、同进程repricing门，先写0600排他备份再实际recompute、flush并核pendingWrite；失败保备份不等于事务撤销，confirmed布尔不是强人类事件证明。

新bootstrap自动安装ChildProcess.prototype.spawn observer：只识别Node/Electron、原版billion-context包身份/支持版本和实际runtime结构；通过后追加--import及一次env loader信息。preload注册loader，loader再核源码hash，仅在内存返回patched source，失败走原loader；不写对方包、不改NODE_OPTIONS。dispose引用归零撤diagnostics和spawn wrapper，但已启动子进程的preload不因此被回滚；此专用兼容运行路径未实测，不能据source+seq概括全部覆盖成功。

resetHistory服务直接调用Ledger.resetHistory，清days/Plan样本/小时桶/余额基线与待写调用，记录historyReset再scheduleWrite；调用返回build不是同步落盘收据，方法本身无confirmed参数。它未删除Host会话、凭据、已有备份或全部billion journals，不是隐私擦除；专链reset前记录推进cursor而不再计款是单独语义。关闭页面也不卸载Host监听、自动任务与已存数据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/store.js:2617-2641](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/store.js#L2617-L2641)

UUID后台提交、错误读收据与EBUSY/降级接线。

<details>
<summary>查看原文（25行）</summary>

```text
  /** Background transactions share the same exclusive lock and atomic replacement. */
  flushAsync() {
    if (this.backgroundWrite) return this.backgroundWrite.promise
    if (this.closed || !this.pendingWrite) return Promise.resolve()
    if (this.backgroundWriteDisabled) { this.flush(); return Promise.resolve() }
    advancePricingHistory(this.pricingHistory, this.config)
    const local = this.snapshot(), accounts = this.pendingAccounts, accountCount = accounts.length
    const repairs = this.pendingPlanHourRepairs, repairCount = repairs.length, generation = this.writeGeneration
    const transactionId = randomUUID()
    try {
      this.backgroundWrite = this.startWrite({ path: this.path, base: this.writeBase, local, transactionId, now: Date.now(),
        pending: accounts.slice(), repairs: repairs.slice(), revision: this.diskRevision, backupHistory: this.legacyPricingHistory }, result => {
        this.backgroundWrite = null
        if (result.error) {
          // A worker may commit successfully and exit before its acknowledgement.
          // The receipt is part of the same atomic file, so replay cannot double-charge.
          let committed
          try { committed = this.readDiskSnapshot() } catch {}
          if (cleanWriteReceipts(committed?.writeReceipts).includes(transactionId)) result = { merged: committed, revision: diskRevisionOf(this.path) }
          else {
            // Another host holding the lock is temporary contention, not a broken worker.
            if (result.error.code === 'EBUSY') { if (!this.closed) this.scheduleWrite() }
            else this.fallbackWrite(result.error)
            return
          }
```

</details>

**依据 2 · 源码核查**：[src/ledger-writer-worker.js:11-30](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/src/ledger-writer-worker.js#L11-L30)

worker实际锁、merge、receipt→writeLedger→port结果。

<details>
<summary>查看原文（20行）</summary>

```text
const { path, base, local, pending, repairs, revision, backupHistory, transactionId, now, port, signal, lockId } = workerData
try {
  const result = withLedgerLock(path, () => {
    const sameDisk = revisionOf(path) === revision
    const repaired = repairDailySessionTotals(local.days)
    if (repaired.includes(local.balanceRef?.date)) local.balanceRef = null
    const ownDisk = sameDisk && !repairs.length && !repaired.length
    let merged = local
    if (!ownDisk) {
      const reader = new Ledger(local.config, {}, path, [], { pricingHistory: local.pricingHistory })
      reader.writeBase = base
      merged = mergeLedger(base, local, reader.readDiskSnapshot(), pending, now, repairs, { ownLocal: true })
    }
    merged.writeReceipts = cleanWriteReceipts([...(merged.writeReceipts ?? []), transactionId])
    writeLedger(path, merged, backupHistory)
    return { ownDisk, ...(ownDisk ? {} : { merged }), writeReceipts: merged.writeReceipts, revision: revisionOf(path) }
  }, 5000, lockId)
  port.postMessage(result)
} catch (error) { port.postMessage({ error: { message: String(error?.message ?? error), code: error?.code } }) }
finally { Atomics.store(signal, 0, 1); Atomics.notify(signal, 0); port.close() }
```

</details>

**依据 3 · 源码核查**：[lib/ledger-persistence.js:96-139](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/ledger-persistence.js#L96-L139)

跨进程目录锁实际取得/旧owner/EBUSY/释放。

<details>
<summary>查看原文（44行）</summary>

```text
export function withLedgerLock(path, action, timeoutMs = 5000, ownerId = randomUUID()) {
  mkdirSync(dirname(path), { recursive: true })
  const lock = `${path}.lock`
  const owner = `${process.pid}-${ownerId}`
  const record = ledgerLockOwner()
  const identities = new Map()
  const deadline = Date.now() + timeoutMs
  for (;;) {
    try {
      mkdirSync(lock)
      try { writeFileSync(join(lock, owner), record, { flag: 'wx' }) } catch (error) {
        try { unlinkSync(join(lock, owner)) } catch {}
        rmdirSync(lock)
        throw error
      }
      break
    } catch (error) {
      // Windows can briefly report EPERM while another process finishes removing
      // a directory whose last read handle has only just closed.
      if (!['EEXIST', 'EPERM'].includes(error.code)) throw error
      try {
        const names = readdirSync(lock)
        const previous = names.length === 1 && names[0].match(/^(\d+)-[a-f0-9-]+$/)
        if (previous) {
          // Only the contender that removes this unique owner file may remove the
          // directory. Other contenders cannot accidentally unlink a new lock.
          if (staleLedgerLockOwner(join(lock, names[0]), Number(previous[1]), identities)) {
            unlinkSync(join(lock, names[0])); rmdirSync(lock); continue
          }
        } else if (names.length === 0 && Date.now() - statSync(lock).mtimeMs > 30_000) {
          rmdirSync(lock) // Also recovers a process killed between mkdir and owner creation.
          continue
        }
      } catch (probe) {
        if (!['ENOENT', 'ENOTEMPTY', 'EEXIST', 'EPERM'].includes(probe.code)) throw probe
      }
      if (Date.now() >= deadline) throw Object.assign(new Error('Ledger is busy; preserving pending changes for retry'), { code: 'EBUSY' })
      Atomics.wait(pause, 0, 0, 10)
    }
  }
  try { return action() } finally {
    unlinkSync(join(lock, owner))
    rmdirSync(lock)
  }
```

</details>

**依据 4 · 源码核查**：[lib/ledger-persistence.js:154-170](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/ledger-persistence.js#L154-L170)

临时0600、fsync/rename与目录flush。

<details>
<summary>查看原文（17行）</summary>

```text
export function writeDurableJson(path, value) {
  const temp = `${path}.${process.pid}-${randomUUID()}.tmp`
  try {
    const fd = openSync(temp, 'wx', 0o600)
    try { writeFileSync(fd, JSON.stringify(value), 'utf8'); fsyncSync(fd) }
    finally { closeSync(fd) }
    renameSync(temp, path)
    // POSIX also requires the directory entry to be flushed after rename.
    // Windows does not support opening directories this way; the file was flushed above.
    if (process.platform !== 'win32') {
      const dir = openSync(dirname(path), 'r')
      try { fsyncSync(dir) }
      finally { closeSync(dir) }
    }
  } finally {
    try { unlinkSync(temp) } catch (error) { if (error.code !== 'ENOENT') throw error }
  }
```

</details>

**依据 5 · 源码核查**：[lib/ledger-persistence.js:184-200](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/ledger-persistence.js#L184-L200)

配置备份、历史备份与真实ledger写。

<details>
<summary>查看原文（17行）</summary>

```text
/** Call under the ledger lock, using the same secret-free config as the ledger. */
export function writeLedgerConfigBackup(path, state) {
  const value = { version: 1, config: state.config, migrations: state.migrations ?? [] }
  let previous
  try { previous = readLedgerConfigBackup(path) }
  catch (error) { if (error.code) throw error } // A malformed backup can be replaced from a healthy ledger.
  if (!equal(previous, value)) writeDurableJson(`${path}.config-bak`, value)
}

export function writeLedger(path, state, backupHistory = false) {
  if (backupHistory) {
    try { copyFileSync(path, `${path}.pricing-history-v1.bak`, constants.COPYFILE_EXCL) }
    catch (error) { if (!['EEXIST', 'ENOENT'].includes(error.code)) throw error }
  }
  // Settings are recoverable even if power is lost during the following ledger write.
  writeLedgerConfigBackup(path, state)
  writeDurableJson(path, { ...state, pricingHistory: encodePricingHistory(state.pricingHistory) })
```

</details>

**依据 6 · 源码核查**：[lib/store.js:2579-2604](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/store.js#L2579-L2604)

同步flush失败只警告并重试。

<details>
<summary>查看原文（26行）</summary>

```text
  flush(waitMs = 0) {
    if (this.backgroundWrite && !this.backgroundWrite.wait(Math.max(8000, waitMs))) return
    if (!this.pendingWrite || this.closed) return
    try {
      withLedgerLock(this.path, () => {
        advancePricingHistory(this.pricingHistory, this.config)
        const disk = this.readDiskSnapshot()
        const local = this.snapshot()
        const repaired = repairDailySessionTotals(local.days)
        if (repaired.includes(local.balanceRef?.date)) local.balanceRef = null
        const ownDisk = (disk === null || disk === this.writeBase) && !this.pendingPlanHourRepairs.length && !repaired.length
        const merged = ownDisk ? local : mergeLedger(this.writeBase, local, disk, this.pendingAccounts, Date.now(), this.pendingPlanHourRepairs, { ownLocal: true })
        // Keep runtime-only secret fallbacks in memory, never in the file or baseline.
        writeLedger(this.path, merged, this.legacyPricingHistory)
        this.legacyPricingHistory = false
        if (!ownDisk) this.adoptSnapshot(merged)
        // local is already detached; the common path needs no second clone or re-sanitize.
        this.writeBase = ownDisk ? merged : this.snapshot()
        this.pendingAccounts = []
        this.pendingPlanHourRepairs = []
        this.pendingWrite = false
        this.diskRevision = diskRevisionOf(this.path)
      }, waitMs)
    } catch (error) {
      if (error?.code !== 'EBUSY' || waitMs > 0) console.warn(`[dsh-cost-meter] 账本写入失败,稍后重试: ${String(error?.message ?? error)}`)
      if (!this.closed) this.scheduleWrite()
```

</details>

**依据 7 · 源码核查**：[lib/store.js:2668-2675](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/store.js#L2668-L2675)

close等待worker后flush再closed/清timer。

```text
  /** 停止后续写入并最终落盘(插件卸载/进程退出)。 */
  close() {
    // Keep the main loop running so worker completion/error events can reach
    // Cordis while it awaits disposal. A synchronous join blocks those events.
    if (this.backgroundWrite) return this.backgroundWrite.promise.then(() => this.close())
    this.flush(5000)              // 退出时保留同步最终提交；日常写入遇锁立即让出并重试。
    this.closed = true
    if (this.writeTimer !== null) { clearTimeout(this.writeTimer); this.writeTimer = null }
```

**依据 8 · 源码核查**：[lib/store.js:2487-2497](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/store.js#L2487-L2497)

快照stripSecrets与账本字段。

<details>
<summary>查看原文（11行）</summary>

```text
  /** A detached, secret-free baseline for merging changes from other processes. */
  snapshot() {
    return cloneLedgerSnapshot({
      version: LEDGER_VERSION, config: stripSecrets(this.config), days: this.days,
      writeReceipts: this.writeReceipts,
      balanceRef: this.balanceRef ?? null, migrations: this.migrations,
      planSamples: this.planSamples ?? {}, planHourBuckets: this.planHourBuckets ?? {},
      openrouterPriceHashes: this.openrouterPriceHashes ?? {}, historyReset: this.historyReset ?? null,
      ...(Object.keys(this.usageCursors).length ? { usageCursors: this.usageCursors } : {}),
      ...(Object.keys(this.providerPriceHashes).length ? { providerPriceHashes: this.providerPriceHashes } : {}),
      pricingHistory: this.pricingHistory,
```

</details>

**依据 9 · 源码核查**：[lib/session-storage-compat.js:606-645](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/session-storage-compat.js#L606-L645)

统一source枚举JSONL/RDB与readRecords真实转交。

<details>
<summary>查看原文（40行）</summary>

```text
export function createSessionRecordSource(ctx, sessionsRoot, options = {}) {
  const settings = options ?? {}
  const root = typeof sessionsRoot === 'string' && sessionsRoot.length > 0 ? sessionsRoot : defaultSessionsRoot()
  const currentMode = () => probeSessionStorage(ctx, settings).mode

  const listSessions = async onlySessionIds => {
    throwIfAborted(settings.signal)
    const ids = idSetOf(onlySessionIds)
    if (currentMode() === 'rdb') {
      const stored = await listStoredSessions(ctx, settings)
      return ids === null ? stored : stored.filter(row => ids.has(row.id))
    }
    if (typeof root !== 'string' || root.length === 0) return []
    const paths = listSessionLogFiles(root, ids)
    const rows = new Map()
    for (const path of Array.isArray(paths) ? paths : []) {
      const id = basename(dirname(path))
      if (typeof id !== 'string' || id.length === 0 || rows.has(id)) continue
      rows.set(id, { id, createdAt: 0, live: false })
    }
    return [...rows.values()]
  }

  return {
    get signal() {
      return settings.signal
    },
    get mode() {
      return currentMode()
    },
    listSessions,
    async listSessionIds(onlySessionIds = null) {
      const rows = await listSessions(onlySessionIds)
      return rows.map(row => row.id)
    },
    async readRecords(sessionId) {
      const result = await readSessionRecords(ctx, sessionId, { ...settings, sessionsRoot: root })
      return result ? result.records : null
    },
  }
```

</details>

**依据 10 · 源码核查**：[lib/index.js:3776-3796](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/index.js#L3776-L3796)

真实启动迁移/导入/归类修复顺序。

<details>
<summary>查看原文（21行）</summary>

```text
  const runBackfill = async () => {
    sessionLifetime.signal.throwIfAborted()
    try {
      await runSecretMigration(ctx, ledger)
    } catch (error) {
      console.warn(`[dsh-cost-meter] 存量密钥导入凭据库失败: ${String(error?.message ?? error)}`)
    }
    sessionLifetime.signal.throwIfAborted()
    try {
      await migrateCustomBalanceHeaderSecrets(ctx, ledger)
    } catch (error) {
      console.warn(`[dsh-cost-meter] 自定义余额请求头密钥迁移失败: ${String(error?.message ?? error)}`)
    }
    if (!active) return
    await runStartupImports(ledger, join(resolveDshHome(), 'sessions'), sessionSource).catch(error => {
      if (!sessionLifetime.signal.aborted) console.warn(`[dsh-cost-meter] 启动期历史导入失败: ${String(error?.message ?? error)}`)
    })
    if (active && (!ledger.migrations.includes('plan-hours-attribution-v1') || ledger.quotaStatsNeedRepair)) {
      try {
        if (!ledger.migrations.includes('plan-hours-attribution-v1')) splitLedgerApiCost(ledger)
        const repaired = await repairPlanHourBuckets(ledger, join(resolveDshHome(), 'sessions'), { isActive: () => active }, sessionSource)
```

</details>

**依据 11 · 源码核查**：[lib/index.js:3813-3828](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/index.js#L3813-L3828)

3秒启动，卸载取消并等待backfill。

<details>
<summary>查看原文（16行）</summary>

```text
  const backfillTimer = setTimeout(() => {
    backfillTask = runBackfill().catch(error => {
      if (!sessionLifetime.signal.aborted) console.warn(`[dsh-cost-meter] 启动期回填失败: ${String(error?.message ?? error)}`)
    })
    return backfillTask
  }, 3000)
  backfillTimer.unref?.()
  // 已开始的扫描也要取消并等待结束，否则文件读取会阻止 Desktop Host 退出。
  cancelBackfill = async () => {
    active = false
    clearTimeout(backfillTimer)
    sessionLifetime.abort()
    openRouterPrices.dispose()
    openDesignPrices.dispose()
    await backfillTask
  }
```

</details>

**依据 12 · 源码核查**：[lib/index.js:2577-2601](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/index.js#L2577-L2601)

重算确认、备份、真实recompute/flush与失败判断。

<details>
<summary>查看原文（25行）</summary>

```text
    async repriceHistory(confirmed, model = '') {
      if (confirmed !== true) throw new Error('Explicit confirmation is required')
      if (typeof model !== 'string' || model.length > 2048 || /[\r\n]/.test(model)
        || (model && (model.indexOf(':') <= 0 || model.endsWith(':')))) throw new Error('Invalid channel/model')
      if (repricing) throw new Error('Historical recalculation is already running')
      repricing = true
      const at = Date.now(), en = localeOf(ledger.config, ctx) === 'en'
      try {
        ledger.refresh()
        if (model && !Object.values(ledger.days).some(day => Object.hasOwn(day.byProviderModel ?? {}, model))) throw new Error(en ? 'This channel/model has no retained history' : '此渠道模型没有保留的历史记录')
        const sessions = model ? new Set(Object.values(ledger.days).flatMap(day => (day.sessions ?? [])
          .filter(row => Object.hasOwn(row.byProviderModel ?? {}, model)).map(row => row.id))) : null
        const backup = `${ledger.path}.before-reprice-${at}.json`
        fs.writeFileSync(backup, JSON.stringify(ledger.snapshot()), { encoding: 'utf8', flag: 'wx', mode: 0o600 })
        const stats = await recomputeLedgerPricingBasis(ledger, join(resolveDshHome(), 'sessions'), undefined, sessions, true, model, sessionSource)
        ledger.pricingHistory.runs[String(at)] = { at, before: stats.before, after: stats.after, days: stats.recostedDays, sessions: stats.recostedSessions, skipped: stats.skippedSessions,
          ...(model ? { model, beforeCny: stats.beforeCny, afterCny: stats.afterCny, beforeEur: stats.beforeEur, afterEur: stats.afterEur } : {}) }
        ledger.scheduleWrite()
        ledger.flush()
        if (ledger.pendingWrite) throw new Error(en ? 'Could not save recalculation; original ledger backup retained.' : '重算结果未能写入，已保留原账本备份。')
        schedulePlanHourRepair()
        return { ok: true, message: en
          ? `${model ? model + ': ' : ''}Recalculated ${stats.recostedSessions} session/day records; kept ${stats.skippedSessions} incomplete records. Original amounts retained.`
          : `${model ? model + '：' : ''}已重算 ${stats.recostedSessions} 条会话日期记录；${stats.skippedSessions} 条日志不完整，保留原金额。重算前后的记录已保存。`, state: await build(false, true) }
      } finally { repricing = false }
```

</details>

**依据 13 · 源码核查**：[lib/billion-context-auto.js:36-59](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/billion-context-auto.js#L36-L59)

实际包身份/版本/结构检查。

<details>
<summary>查看原文（24行）</summary>

```text
export function inspectBillionLaunch(args, options = {}, cache = new Map()) {
  if (!Array.isArray(args) || typeof args[0] !== 'string' || args[0].startsWith('-')) return null
  let script
  try { script = realpathSync(resolve(options.cwd ?? process.cwd(), args[0])) } catch { return null }
  if (basename(script) !== 'index.js' || basename(dirname(script)) !== 'dist') return null
  const root = dirname(dirname(script))
  let pkg
  try { pkg = JSON.parse(readSource(join(root, 'package.json'))) } catch { return null }
  if (pkg.name !== 'billion-context' || pkg.dshCostMeterCompatibility) return null
  if (billionVersionSupported(pkg.version) !== true) return { version: pkg.version, reason: 'needs_update' }
  if (typeof module.register !== 'function') return { version: pkg.version, reason: 'bridge_missing' }
  try {
    const native = join(root, 'dist/agent/dsh-native.js')
    const infos = [statSync(script), statSync(native)]
    const revision = script + ':' + infos.map(info => [info.size, info.mtimeMs, info.ctimeMs].join(':')).join(':')
    if (cache.has(revision)) return cache.get(revision)
    const source = readSource(script)
    patchBillionRuntime(source, 'proxy')
    patchBillionRuntime(readSource(native), 'native')
    const result = { script, version: pkg.version, fingerprint: createHash('sha256').update(source).digest('hex') }
    cache.set(revision, result)
    if (cache.size > 8) cache.delete(cache.keys().next().value)
    return result
  } catch { return { version: pkg.version, reason: 'changed' } }
```

</details>

**依据 14 · 源码核查**：[lib/billion-context-auto.js:78-100](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/billion-context-auto.js#L78-L100)

真实追加--import、env及替换spawn。

<details>
<summary>查看原文（23行）</summary>

```text
  const wrapped = function (options) {
    if (state.references <= 0 || !options || !Array.isArray(options.args) || !Array.isArray(options.envPairs)) return original.apply(this, arguments)
    const command = options.file, args = options.args.slice(1)
    if (typeof command !== 'string' || !['node', 'node.exe', 'nodejs'].includes(basename(command).toLowerCase()) && !options.envPairs.includes('ELECTRON_RUN_AS_NODE=1')) return original.apply(this, arguments)
    let launch
    try { launch = inspectBillionLaunch(args, options, cache) } catch {}
    try { if (launch?.reason) { state.issue = launch; bridge()?.adapterStatus?.(launch.version, launch.reason) } } catch {}
    if (!launch || launch.reason) return original.apply(this, arguments)
    state.issue = undefined
    const envPairs = options.envPairs.filter(pair => !pair.startsWith('DSH_COST_METER_BILLION_LOADER='))
    envPairs.push('DSH_COST_METER_BILLION_LOADER=' + JSON.stringify({ script: launch.script, fingerprint: launch.fingerprint }))
    const result = original.call(this, { ...options, args: [options.args[0], '--import', preload, ...args], envPairs })
    const child = this
    children.set(child.pid, child)
    const done = () => {
      children.delete(child.pid)
      for (const [origin, peer] of origins) if (peer.pid === child.pid) origins.delete(origin)
    }
    child.once('exit', done); child.once('error', done)
    return result
  }
  state.wrapped = wrapped
  prototype.spawn = wrapped
```

</details>

**依据 15 · 源码核查**：[lib/billion-context-auto.js:147-151](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/billion-context-auto.js#L147-L151)

引用归零撤hook非杀子进程。

```text
function release(state) {
  if (--state.references > 0 || globalThis[key] !== state) return
  for (const dispose of state.subscriptions) dispose()
  if (state.prototype.spawn === state.wrapped) state.prototype.spawn = state.original
  delete globalThis[key]
```

**依据 16 · 源码核查**：[lib/billion-context-preload.js:5-13](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/billion-context-preload.js#L5-L13)

读env后删除、注册loader。

```text
const raw = process.env.DSH_COST_METER_BILLION_LOADER
delete process.env.DSH_COST_METER_BILLION_LOADER
try {
  const data = JSON.parse(raw ?? 'null')
  if (data && typeof module.register === 'function' && typeof data.script === 'string' && /^[a-f\d]{64}$/.test(data.fingerprint)) {
    module.register(new URL('./billion-context-loader.js', import.meta.url), {
      parentURL: import.meta.url, data: { target: pathToFileURL(data.script).href, fingerprint: data.fingerprint },
    })
  }
```

**依据 17 · 源码核查**：[lib/billion-context-patch.js:96-103](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/billion-context-patch.js#L96-L103)

实际源码字符串编辑、imports和parse后返回。

```text
  edits.sort((a, b) => b.start - a.start || b.end - a.end)
  for (let i = 1; i < edits.length; i++) check(edits[i].end <= edits[i - 1].start, 'overlapping_runtime_hooks')
  for (const edit of edits) source = source.slice(0, edit.start) + edit.text + source.slice(edit.end)
  const offset = source.startsWith('#!') ? source.indexOf('\n') + 1 : 0
  source = source.slice(0, offset) + imports + source.slice(offset)
  try { parse(source, { sourceType: 'module', ecmaVersion: 'latest' }) }
  catch { throw billionCompatibilityError('patched_syntax_changed') }
  return { source, capabilities }
```

**依据 18 · 源码核查**：[lib/billion-context-loader.js:7-16](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/billion-context-loader.js#L7-L16)

真实hash匹配后返回内存patched source/失败原样。

<details>
<summary>查看原文（10行）</summary>

```text
export function initialize(data) { target = data.target; fingerprint = data.fingerprint }
export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context)
  if (url !== target || result.format !== 'module') return result
  try {
    const source = result.source == null ? readFileSync(new URL(url), 'utf8') : Buffer.from(result.source).toString('utf8')
    if (createHash('sha256').update(source).digest('hex') !== fingerprint) return result
    const patched = patchBillionRuntime(source, 'proxy', { proxy: new URL('./billion-context-proxy.js', import.meta.url).href })
    return { ...result, source: patched.source }
  } catch { return result } // A collection failure must never stop the original proxy.
```

</details>

**依据 19 · 源码核查**：[lib/index.js:2917-2922](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/index.js#L2917-L2922)

resetHistory RPC真实接线且无确认参数。

```text
    async resetHistory() {
      // 清空全部历史:除 days 外,Plan 百分比采样/小时桶与余额对账基准一并
      // 重置,否则残留样本仍会推算出 planStats、对账基准继续引用旧日合计,
      // 与「清空全部历史」语义不一致。
      ledger.resetHistory()
      return build(false)
```

**依据 20 · 源码核查**：[lib/store.js:2501-2509](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/store.js#L2501-L2509)

清聚合/待写、重置标记并异步保存。

```text
  resetHistory() {
    this.days = {}
    this.planSamples = {}
    this.planHourBuckets = {}
    this.balanceRef = null
    this.pendingAccounts = []
    this.pendingPlanHourRepairs = []
    this.historyReset = { id: randomUUID(), at: Date.now() }
    this.scheduleWrite()
```

#### 缺口

- 未验并发Host/worker提交后失ACK/磁盘满、close失败、billion全部覆盖与退出残留、各后端导入/重算。
  **影响**：不能保证断电无损、退出已持久、桥覆盖全或清空已擦除全部数据。
  **进一步探讨**：隔离备份后注入写/锁/重算失败核receipt和重启，检查实际桥覆盖/子进程、备份/会话/journal与敏感残留。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 自定义余额怎样使用凭据、请求端点并呈现失败？

**研究主题**：依赖、兼容与流程、功能与机制、缺陷与关键质疑

#### 完整回答

costMeter服务由Host typert暴露，调用者准入依赖Host；本组件service没有另建每用户/工作区授权门，未审Host实际认证合同，不能等同公网匿名可调或强账户隔离。代表自定义余额链由getState/build或手动刷新进入ensureCustomBalanceEntry，每项fingerprint/active抑制旧配置结果、inFlight去并发，AbortController交query；成功status ok带fetchedAt，失败status error/off，不能把remaining初始0当成功余额。刷新间隔默认15分钟，手动force等待上一请求再启动，不等于强制跳过错误退避。

query从启用配置取得URL，root-relative只跟当前Host loopback origin且拒//、空白、URL用户名密码/fragment。远端HTTPS允许；loopback HTTP允许，非回环HTTP另须allowInsecureHttp且allowedHosts精确host:port。携凭据请求有非空allowedHosts才强比对；未配名单只是warning，显式空数组也不触发拒绝，不是默认严格白名单。placeholder header先凭据库resolve再环境变量回退，实际会把解析的secret发到配置端点，应人工审来源/端点和最小权限；不能因HTTPS就信任服务。

实际method可配置，非GET/HEAD可带body，fetchWithRetry redirect:manual，拒3xx以免跨源带密钥；默认4次只重试瞬时网络错误，每次15秒timeout（与取消在支持any时组合），HTTP错误交调用方，正文读取有大小/时间界限再声明式提取remaining数值。读余额名称不保证POST幂等，网络失败后的重试可能重复服务端副作用；未知端点不能当纯读。提取失败throw而非Number(null)=0伪成功。

setCredential实际调用Host credentials.set，clearCredential调用unset，只表示该引用写/清结果，环境变量或他处备份不自动消失。启动旧secret迁移先describe，已有配置清旧明文、不覆盖；可写才set后清，失败保留并pending待下次；这是有条件迁移，不宣称所有历史密钥已抹除。未逐厂商验证额度/余额身份、接口语义、真实账号数据或Host隔离。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:3872-3877](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/index.js#L3872-L3877)

Host投影/typert服务provide接线。

```text
  ctx.inject(['sessionProjections'], (projectionCtx) => {
    projectionCtx.sessionProjections.register(makeCostUsageProjection(ledger))
  })

  // RPC 服务:客户端经 remote.costMeter.* 调用(./typert 清单由 typert-loader 注册)。
  ctx.provide('costMeter', createService(ctx, ledger, openRouterPrices, openDesignPrices, codexSubscription, sessionSource))
```

**依据 2 · 源码核查**：[lib/index.js:2423-2443](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/index.js#L2423-L2443)

getState build真实启动余额/额度查询，已有缓存可后台更新。

<details>
<summary>查看原文（21行）</summary>

```text
  const build = async (forceBalance = false, immediate = false, clientPricesRev = null) => {
    ledger.refresh()
    syncMessageLocale()
    syncBalanceAccount()
    // serve-stale(issue #76 附带 / 今日费用实时化):有过任一快照(缓存
    // fetchedAt > 0)时,过期的余额/额度刷新转入后台,getState 立即用现有值
    // 组装返回——ambient 快照(60s 轮询/投影联动刷新)不再被 15-20s 的网络
    // 查询阻塞,下一个轮询周期自然收敛;首次加载(无任何缓存)仍内联等待,
    // 保证首屏是真实数据。显式刷新 RPC(refreshBalance 等)不走本路径,
    // 保持内联强刷语义。
    const pending = []
    const kick = (warm, ensure) => {
      const task = ensure()
      if (immediate || warm && !forceBalance) task.catch(() => {})
      else pending.push(task)
    }
    kick(balanceCache.fetchedAt > 0, () => ensureBalance(forceBalance))
    kick(goQuotaCache.fetchedAt > 0, () => ensureGoQuota(false))
    const customWarm = customBalanceConfigs().every((entry, index) => entry?.enabled !== true || entry.display === 'off'
      || customBalanceCacheAt(index).fetchedAt > 0)
    kick(customWarm, () => ensureCustomBalance(false))
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1968-1984](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/index.js#L1968-L1984)

只有enabled且display非off条目才环境轮询。

<details>
<summary>查看原文（17行）</summary>

```text
    const targets = []
    if (index === null) {
      // ambient:全部启用且非 off 的条目;一条都没有时清理出空缓存(与旧单条 off 行为一致)。
      entries.forEach((entry, i) => {
        if (entry?.enabled === true && entry.display !== 'off') targets.push(i)
      })
      if (targets.length === 0) {
        for (const key of Object.keys(customBalanceCaches)) {
          discardCustomBalanceCache(key)
        }
        return
      }
    } else {
      if (entries[index]?.enabled !== true || entries[index].display === 'off') return
      targets.push(index)
    }
    await Promise.all(targets.map(i => ensureCustomBalanceEntry(force, i)))
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1986-2035](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/index.js#L1986-L2035)

真实custom query、active/fingerprint/inFlight及成功/失败快照。

<details>
<summary>查看原文（50行）</summary>

```text
  const ensureCustomBalanceEntry = async (force, index) => {
    const config = customBalanceConfigs()[index]
    const cache = customBalanceCacheAt(index)
    const current = () => active && customBalanceCaches[index] === cache && cache.fingerprint === customBalanceFingerprint(index)
    const interval = Math.max(1, Number(config?.refreshMinutes) || 15) * 60_000
    if (Date.now() < (cache.retryUntil || 0)) return
    if (!force && Date.now() - cache.fetchedAt < interval) return
    while (cache.inFlight !== undefined) {
      const prev = cache.inFlight
      if (!force) { await prev; return }
      // force 链式等待:等上一个任务结束后由本调用继续走新建流程,
      // 保证手动强制刷新不被在途任务吞掉(否则返回的是即将过期的旧数据)。
      await prev.catch(() => {})
      if (!current()) return
      if (Date.now() < (cache.retryUntil || 0)) return
      if (cache.inFlight === prev) break // 上一个任务结束后由本调用继续走新建流程
    }
    // queryCustomBalance 的单条入参重载:customBalances[i] 视图(兼容旧键,设置页
    // 面向 entries 编辑)。
    const configForEntry = { ...ledger.config, customBalance: config, customBalances: undefined }
    cache.controller = new AbortController()
    const task = queryCustomBalance(ctx, configForEntry, { signal: cache.controller.signal }).then(result => {
      if (!current()) return
      cache.fetchedAt = Date.now()
      cache.retryUntil = 0
      cache.value = { status: 'ok', message: '', fetchedAt: cache.fetchedAt, index, ...result }
    }, error => {
      if (!current()) return
      // 401/403/429 等待刷新间隔;其他临时失败仍可在下次轮询恢复。
      const now = Date.now()
      const message = error instanceof Error ? error.message : String(error)
      if (error && error.soft === true) {
        cache.fetchedAt = now
        cache.value = {
          ...emptyCustomBalance(),
          label: typeof config?.label === 'string' ? config.label : '',
          status: 'off',
          message,
          fetchedAt: now,
          index,
        }
      } else {
        Object.assign(cache, balanceRetryState(error, interval, now))
        cache.value = {
          ...emptyCustomBalance(),
          label: typeof config?.label === 'string' ? config.label : '',
          status: 'error',
          message,
          fetchedAt: now,
          index,
```

</details>

**依据 5 · 源码核查**：[lib/custom-balance.js:24-49](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/custom-balance.js#L24-L49)

Host-relative origin/URL真实校验。

<details>
<summary>查看原文（26行）</summary>

```text
/** A root-relative route follows the running host, never a persisted port or browser input. */
export const isHostRelativeBalanceUrl = value => typeof value === 'string' && value.startsWith('/')
export function customBalanceHostOrigin(ctx) {
  try {
    const server = ctx?.get?.('webServer'), port = server?.port
    if (!Number.isInteger(port) || port < 1 || port > 65535) return null
    const host = server.host === '::' || server.host === '::1' || server.host === '[::1]' ? '[::1]' : '127.0.0.1'
    if (server.host !== undefined && !['0.0.0.0', '::'].includes(server.host) && !isLoopbackHost(server.host)) return null
    return `http://${host}:${port}`
  } catch { return null }
}

export function resolveCustomBalanceUrl(value, ctx) {
  if (typeof value !== 'string' || /[\\\s\u0000-\u001f\u007f]/.test(value)) throw new Error('customBalance.request.url is not a valid URL')
  let parsed
  if (isHostRelativeBalanceUrl(value)) {
    if (value.startsWith('//')) throw new Error('customBalance.request.url must be a single-slash host-relative path')
    const origin = customBalanceHostOrigin(ctx)
    if (!origin) throw new Error('DSH web server is not listening; retry the host-relative balance query after startup')
    parsed = new URL(value, origin)
    if (parsed.origin !== origin) throw new Error('customBalance.request.url must stay on the current DSH host')
  } else {
    try { parsed = new URL(value) } catch { throw new Error('customBalance.request.url is not a valid URL') }
  }
  if (parsed.username || parsed.password || parsed.hash) throw new Error('customBalance.request.url must not contain credentials or a fragment')
  return parsed
```

</details>

**依据 6 · 源码核查**：[lib/custom-balance.js:63-83](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/custom-balance.js#L63-L83)

凭据库resolve和环境回退。

<details>
<summary>查看原文（21行）</summary>

```text
async function resolveTemplateString(value, ctx) {
  const pattern = /\{\{\s*([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g
  let out = value
  const names = [...value.matchAll(pattern)].map(match => match[1])
  for (const name of names) {
    let resolved = ''
    const credentials = ctx.get('credentials')
    if (credentials !== undefined) {
      try {
        const hit = await credentials.resolve(credentialRef(name))
        if (typeof hit?.value === 'string' && hit.value.length > 0) resolved = hit.value
      } catch {
        // fall through to env
      }
    }
    if (resolved.length === 0) resolved = String(process.env[name] ?? '').trim()
    // 函数替换而非字符串替换:resolved 是凭据/密钥,若含 $$、$&、$' 等
    // String.replace 特殊模式会被错误展开,密钥内容被破坏。
    out = out.replace(new RegExp(`\\{\\{\\s*${name}\\s*\\}\\}`, 'g'), () => resolved)
  }
  return out
```

</details>

**依据 7 · 源码核查**：[lib/custom-balance.js:109-132](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/custom-balance.js#L109-L132)

enabled与协议/HTTP精确白名单条件。

<details>
<summary>查看原文（24行）</summary>

```text
export async function queryCustomBalance(ctx, config, { signal } = {}) {
  signal?.throwIfAborted()
  const custom = config?.customBalance
  if (custom?.enabled !== true) {
    const error = new Error('custom balance disabled')
    error.soft = true
    throw error
  }
  if (custom.adapter === 'aliyun') return queryAliyunBalance(ctx, config, { signal })
  if (custom.adapter === 'tokenrhythm') return queryTokenRhythmBalance(ctx, config, { signal })
  const request = custom.request
  if (request === null || typeof request !== 'object' || typeof request.url !== 'string' || request.url.length === 0) {
    throw new Error('customBalance.request.url is required')
  }
  const parsedUrl = resolveCustomBalanceUrl(request.url, ctx)
  const loopbackTarget = isLoopbackHost(parsedUrl.hostname)
  const host = parsedUrl.host.toLowerCase()
  const allowed = Array.isArray(custom.allowedHosts)
    ? custom.allowedHosts.filter(h => typeof h === 'string' && h.trim()).map(h => h.trim().toLowerCase()) : null
  // #309: non-loopback HTTP requires both an explicit switch and the exact host:port.
  if (parsedUrl.protocol !== 'https:' && !(parsedUrl.protocol === 'http:'
    && (loopbackTarget || custom.allowInsecureHttp === true && allowed?.includes(host)))) {
    throw new Error('customBalance.request.url must use https; non-loopback HTTP requires allowInsecureHttp and an exact allowedHosts entry (host:port)')
  }
```

</details>

**依据 8 · 源码核查**：[lib/custom-balance.js:142-182](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/custom-balance.js#L142-L182)

非空allowed名单、实际headers/method/body/fetch/重定向和数值提取。

<details>
<summary>查看原文（41行）</summary>

```text
  const rawHeaders = request.headers ?? {}
  const usesCredentials = Object.entries(rawHeaders).some(([name, value]) =>
    hasCredentialPlaceholder(value) || looksLikeSecretHeaderValue(name, value))
  if (usesCredentials) {
    if (allowed !== null && allowed.length > 0 && !allowed.includes(host)) {
      throw new Error(`customBalance request host "${host}" is not in customBalance.allowedHosts; refusing to send credentials there (add it explicitly to allow)`)
    }
    if (allowed === null && !warnedHosts.has(host)) {
      warnedHosts.add(host)
      console.warn(`[dsh-cost-meter] 自定义余额请求携带凭据发往 ${host}:建议在 customBalance.allowedHosts 中显式列出该主机,防止导入他人配置导致密钥外带`)
    }
  }
  const method = typeof request.method === 'string' ? request.method.toUpperCase() : 'GET'
  const headers = await resolveHeaders(rawHeaders, ctx)
  const init = { method, headers, redirect: 'manual', signal }
  if (method !== 'GET' && method !== 'HEAD' && request.body !== undefined) {
    init.body = typeof request.body === 'string' ? request.body : JSON.stringify(request.body)
    if (!Object.keys(headers).some(name => name.toLowerCase() === 'content-type')) {
      init.headers = { ...headers, 'content-type': 'application/json' }
    }
  }
  // 瞬时网络错误自动重试(issue #28 同一封装;body 为字符串可安全重放)。
  // redirect: 'manual'(v1.6.8):禁止自动跟随重定向——凭据头会被原样带到 3xx 的
  // 目标主机,一次跨源重定向就足以把密钥发去别处;遇到重定向直接报错。
  const response = await fetchWithRetry(parsedUrl.href, init, { timeoutMs: 15000 })
  if (response.status >= 300 && response.status < 400) {
    try { await response.body?.cancel?.() } catch {}
    throw new Error(`custom balance endpoint redirected (HTTP ${String(response.status)}); redirects are refused to avoid forwarding credentials to another host`)
  }
  if (!response.ok) {
    try { await response.body?.cancel?.() } catch { /* 清理失败不掩盖 HTTP 错误。 */ }
    throw balanceHttpError(`custom balance HTTP ${String(response.status)}`, response)
  }
  const data = await readJsonBounded(response)
  const extract = custom.extract ?? {}
  // 空值感知(B-3):extractByRule 失败返回 null,而 Number(null) === 0 会
  // 蒙混过 isFinite 守卫——提取失败绝不能伪造成 remaining:0 的「成功」。
  const rawRemaining = extractByRule(data, extract.remaining)
  const remaining = toStrictNumber(rawRemaining)
  if (!Number.isFinite(remaining)) {
    throw new Error('custom balance extract.remaining is missing or not numeric')
```

</details>

**依据 9 · 源码核查**：[lib/net.js:58-93](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/net.js#L58-L93)

实际重试、取消/timeout组合和fetch调用。

<details>
<summary>查看原文（36行）</summary>

```text
export async function fetchWithRetry(url, init = {}, { attempts = 4, backoffMs = 300, timeoutMs = 0, fetchImpl = fetch } = {}) {
  // 部分 CDN(实测 api.commandcode.ai:DSH 0.1.7 宿主的全局 undici 8 dispatcher
  // 默认在请求头里协商 br)会返回压缩响应体却丢失 Content-Encoding 响应头——
  // 违反 HTTP 语义,fetch 因此不做自动解压,response.json() 对着压缩字节直接报
  // 「额度响应无法读取为有效 JSON」。brotli 流没有可靠魔数,事后嗅探无法稳健
  // 补救(与 #172/#173 的裸 gzip 场景同族但更难防);这些接口的响应都很小,压缩
  // 本无收益,故调用方未显式指定时统一默认 accept-encoding: identity 关闭
  // 内容协商,从请求侧根除,显式指定的值不被覆盖。仅对纯对象形态的 headers
  // 注入(本仓库所有调用方均如此)且不改其形状,Headers 实例等其余形态原样透传。
  const headers = init.headers
  if (headers === undefined || headers === null) {
    init = { ...init, headers: { 'accept-encoding': 'identity' } }
  } else if (typeof headers === 'object' && typeof headers.entries !== 'function'
    && !Object.keys(headers).some(name => name.toLowerCase() === 'accept-encoding')) {
    init = { ...init, headers: { ...headers, 'accept-encoding': 'identity' } }
  }
  const request = typeof fetchImpl === 'function' ? fetchImpl : fetch
  for (let attempt = 1; ; attempt++) {
    init.signal?.throwIfAborted()
    if (attempt > 1) await sleep(Math.min(1500, backoffMs * 2 ** (attempt - 2)), init.signal)
    let perAttempt = init
    if (timeoutMs > 0) {
      // 超时信号不得吞掉调用方的取消信号:两者并存时用 AbortSignal.any 组合
      // (任一触发即中止);运行时不支持 any 时退回旧行为(仅超时信号)。
      const timeoutSignal = AbortSignal.timeout(timeoutMs)
      const signal = init.signal !== undefined && init.signal !== null && typeof AbortSignal.any === 'function'
        ? AbortSignal.any([init.signal, timeoutSignal])
        : timeoutSignal
      perAttempt = { ...init, signal }
    }
    try {
      return await request(url, perAttempt)
    } catch (error) {
      if (init.signal?.aborted) throw init.signal.reason
      if (!isTransientFetchError(error) || attempt >= attempts) throw error
    }
```

</details>

**依据 10 · 源码核查**：[lib/net.js:115-153](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/net.js#L115-L153)

正文时间/长度/流取消界限。

<details>
<summary>查看原文（39行）</summary>

```text
/** 流式限制实际响应体，不依赖可能缺失或不准确的 Content-Length。 */
export async function readTextBounded(response, maxBytes = 262144, { timeoutMs = 15000, signal } = {}) {
  const tooLarge = () => Object.assign(new Error('response body is too large'), { code: 'RESPONSE_TOO_LARGE' })
  const deadline = AbortSignal.timeout(timeoutMs)
  const abort = signal ? AbortSignal.any([deadline, signal]) : deadline
  let listener, iterator, cancelBody = () => response.body?.cancel?.()
  const cancelled = new Promise((_, reject) => {
    listener = () => {
      reject(abort.reason)
      try { Promise.resolve(cancelBody()).catch(() => {}) } catch {}
      try { Promise.resolve(iterator?.return?.()).catch(() => {}) } catch {}
    }
    if (abort.aborted) listener()
    else abort.addEventListener('abort', listener, { once: true })
  })
  const read = async () => {
    if (Number(response.headers?.get?.('content-length')) > maxBytes) {
      try { await response.body?.cancel?.() } catch { /* 清理失败不掩盖长度错误。 */ }
      throw tooLarge()
    }
    if (response.body?.[Symbol.asyncIterator]) {
      const chunks = []
      let bytes = 0
      if (typeof response.body.getReader === 'function') {
        const reader = response.body.getReader()
        cancelBody = () => reader.cancel()
        iterator = { next: () => reader.read(), async return() { try { await reader.cancel() } finally { reader.releaseLock() } } }
      } else iterator = response.body[Symbol.asyncIterator]()
      try {
        for (;;) {
          abort.throwIfAborted()
          const item = await iterator.next()
          if (item.done) break
          const buffer = Buffer.from(item.value)
          bytes += buffer.length
          if (bytes > maxBytes) throw tooLarge()
          chunks.push(buffer)
        }
      } finally { try { await iterator.return?.() } catch {} }
```

</details>

**依据 11 · 源码核查**：[lib/index.js:2771-2786](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/index.js#L2771-L2786)

credentials.set及旧secret清配置实际保存。

<details>
<summary>查看原文（16行）</summary>

```text
      if (typeof value !== 'string' || value.trim().length === 0) {
        return { ok: false, message: tmsg(locale, 'credentialEmpty') }
      }
      const credentials = ctx?.get?.('credentials')
      if (credentials === undefined) {
        return { ok: false, message: tmsg(locale, 'credentialStoreUnavailable') }
      }
      try {
        await credentials.set(credentialRef(ref), value.trim())
      } catch (error) {
        return { ok: false, message: tmsg(locale, 'credentialWriteFailed', { message: String(error?.message ?? error) }) }
      }
      // 写入成功后清掉 config 中可能残留的旧明文(迁移 pending / 旧版本遗留),立即落盘。
      if (account?.id === 'default' && readSecret(ledger.config, account.base).length > 0) {
        ledger.config = writeSecret(ledger.config, account.base, '')
        ledger.scheduleWrite()
```

</details>

**依据 12 · 源码核查**：[lib/index.js:2824-2831](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/index.js#L2824-L2831)

clearCredential实际unset/错误结果。

```text
      const credentials = ctx?.get?.('credentials')
      if (credentials === undefined) {
        return { ok: false, message: tmsg(locale, 'credentialStoreUnavailable') }
      }
      try {
        await credentials.unset(credentialRef(ref))
      } catch (error) {
        return { ok: false, message: tmsg(locale, 'credentialClearFailed', { message: String(error?.message ?? error) }) }
```

**依据 13 · 源码核查**：[lib/index.js:3067-3111](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/index.js#L3067-L3111)

旧凭据describe/set后清、失败保留pending与写调度。

<details>
<summary>查看原文（45行）</summary>

```text
    const ref = secretRefOf(target)
    if (ref === null) { pending.push(target); continue }
    if (credentials === undefined) { pending.push(target); continue }

    let info = { configured: false, writable: false }
    try {
      info = await credentials.describe(credentialRef(ref))
    } catch {
      // describe 不可用(宿主版本较旧):按不可写处理,保留明文而非冒险清空。
      pending.push(target)
      continue
    }

    if (info.configured === true) {
      // 凭据库或环境变量已经有了值:不覆盖,只清掉遗留明文。
      config = writeSecret(config, target, '')
      cleared.push(target)
      continue
    }
    if (info.writable !== true) {
      // 不可写(例如被只读源遮蔽)且当前未配置:保留明文,等用户手动处理。
      pending.push(target)
      continue
    }
    try {
      await credentials.set(credentialRef(ref), value)
      config = writeSecret(config, target, '')
      imported.push(target)
    } catch (error) {
      // set 失败:保留明文,不丢用户的密钥。
      console.warn(`[dsh-cost-meter] 密钥 ${target} 导入凭据库失败,已保留原值: ${String(error?.message ?? error)}`)
      pending.push(target)
    }
  }

  ledger.config = config
  ledger.secretMigration = { ran: true, pending }

  // 只在**全部目标都处理干净**后才记完成标记;仍有 pending 时不记,下个启动周期重试。
  if (pending.length === 0) {
    if (!ledger.migrations.includes(SECRET_MIGRATION_ID)) ledger.migrations.push(SECRET_MIGRATION_ID)
    ledger.scheduleWrite()
  } else {
    // pending 存在时也要落盘(部分成功的清空需要持久化,避免下轮重复 set)。
    ledger.scheduleWrite()
```

</details>

#### 缺口

- 未验Host RPC认证/多用户隔离、全部额度接口及任意端点非幂等/凭据外带行为。
  **影响**：不能承诺配置导入安全、查询无写副作用或所有供应商额度/密钥已正确隔离。
  **进一步探讨**：隔离本地mock验证错误/跳转/超时取消/重复POST/空白名单，不用真实密钥；另核部署Host准入。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何试用、核费用与停止依赖估算？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

愿意对账的DSH用户固定1.9.58和满足声明的真实Host，备份本地账本/历史，确认自己的模型价格、币种/汇率、Plan/API类别；先关不需要的远端余额源并审allowedHosts，少量已知usage的正常/取消/重复转发/等量独立/缺价调用逐笔比较Host日志和供应商记录。实时页面金额不是账单，scope外和缺usage不能从零额推免费。预算在所查llm/stream链未进入拒绝调用门，不能把进度/告警当硬额度或防超支。

首次人工需依赖/价格/类别/凭据端点配置和对照调用，持续需供应商价表/额度接口维护、归因/账单差异复核，资源有本地账本/journal/worker和可选网络查询；失败还有锁/备份/导入重算、缺量补核的人时。现金、tokens、时间、误差率和节时均未知，不能填0；插件本身观察不另推理不表示全部资源免费。Plan等值与API估算分离是观测口径，未改变模型资源供给、定价合同、付款风险或服务责任，相对供应商账单+手工日志不据此计经济结构创新。

发现漏记/重复、缺价、分类错误、凭据来源不清或写失败，就停止将总额作财务/预算决策依据，保全账本/日志回到供应商账单核对。要退出应卸载/禁用Host插件并核close/后台和billion子进程，而非只关Web；凭据按引用清并核环境变量/备份，历史清空是聚合reset非全资料擦除。恢复时先备份再有意确认重算，金额差异未核不得自动付款或追责。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:3850-3867](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/index.js#L3850-L3867)

实际观测/入账链未以预算拒LLM。

<details>
<summary>查看原文（18行）</summary>

```text
  ctx.on('llm/stream', createLlmStreamBilling({
    activity: contextActivity(ctx),
    bridge: billionContext,
    account: (usage, model, sessionId, atMs, provider) => {
      const buckets = {
        input: usage.inputTokens ?? 0,
        output: usage.outputTokens ?? 0,
        cacheRead: usage.cacheReadTokens ?? 0,
        cacheWrite: usage.cacheWriteTokens ?? 0,
        reasoning: usage.reasoningTokens ?? 0,
      }
      // 非字符串 provider(个别路由 header 配置异常,日志渲染为 [object Object])
      // 在去重器内归一为空串,由账本按缺省渠道处理,避免脏键。
      const effective = usageDeduper.admit(sessionId, model, provider, buckets, atMs)
      if (effective === null) return
      ledger.account(buckets, model, sessionId, atMs, effective)
    },
  }), { global: true })
```

</details>

**依据 2 · 源码核查**：[lib/store.js:2409-2438](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/store.js#L2409-L2438)

价格/Plan API和零额计算。

<details>
<summary>查看原文（30行）</summary>

```text
  account(tokens, modelId, sessionId, atMs, provider, meter, requestFee) {
    if (this.closed) return
    if (requestFee !== undefined && (!validRequestFee(requestFee, atMs) || provider !== 'deepseek-official' || !matchesRequestFeeModel(modelId, requestFee))) throw new Error('Invalid official web request fee')
    const pricing = pricingConfigAt(this.config, atMs, sessionId, `${provider || 'deepseek'}:${modelId}`)
    const resolved = providerPriceEntryFor(provider, modelId, pricing.prices, {
      mode: pricing.priceMatch === 'exact' ? 'exact' : 'auto',
      overrides: pricing.priceOverrides,
    })
    const entry = resolved.entry ?? { cacheHit: 0, cacheMiss: 0, output: 0 }
    const peak = {
      enabled: ['deepseek-peak', 'utc-peak'].includes(resolved.billingMode) && pricing.peakEnabled === true,
      effectiveAtMs: Date.parse(pricing.peakEffectiveAt),
      windows: pricing.peakWindows,
      holidays: pricing.peakHolidays,
    }
    // 官方价格币种为人民币(issue #47)时,DeepSeek 主表(峰谷计费,含 default
    // 兜底与跨厂商兑底命中)计出的成本为人民币,按展示汇率折算为美元入账;
    // 第三方 flat 恒为美元价,直接入账。
    const priced = requestFee ? requestFee.requests * requestFee.rateCny : resolved.priced ? costOf(tokens, entry, atMs, peak) : 0
    const cost = usdFromCost(priced, requestFee ? 'CNY' : resolved.currency, fxRatesOf(pricing).CNY)
    // Plan/API 双轨分类(issue #64):plan 类调用金额只记等值(cost),apiCost 记真金白银部分;
    // Plan 类调用同时进入 provider×小时聚合桶(供 5 小时滚动窗本地量聚合)。
    const planBilling = this.config.planBilling
    const enabledPlans = enabledPlanSetOf(this.config)
    const cls = requestFee ? 'api' : billingClassOf(provider, modelId, planBilling, enabledPlans, this.config.prices)
    const apiCost = cls === 'api' ? cost : 0
    // 归一化各桶 token 数:非有限/负数一律按 0 处理,防止污染账本聚合。
    const num = value => {
      const n = Number(value)
      return Number.isFinite(n) && n > 0 ? n : 0
```

</details>

**依据 3 · 源码核查**：[lib/custom-balance.js:142-166](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/custom-balance.js#L142-L166)

凭据端点与实际可配置请求。

<details>
<summary>查看原文（25行）</summary>

```text
  const rawHeaders = request.headers ?? {}
  const usesCredentials = Object.entries(rawHeaders).some(([name, value]) =>
    hasCredentialPlaceholder(value) || looksLikeSecretHeaderValue(name, value))
  if (usesCredentials) {
    if (allowed !== null && allowed.length > 0 && !allowed.includes(host)) {
      throw new Error(`customBalance request host "${host}" is not in customBalance.allowedHosts; refusing to send credentials there (add it explicitly to allow)`)
    }
    if (allowed === null && !warnedHosts.has(host)) {
      warnedHosts.add(host)
      console.warn(`[dsh-cost-meter] 自定义余额请求携带凭据发往 ${host}:建议在 customBalance.allowedHosts 中显式列出该主机,防止导入他人配置导致密钥外带`)
    }
  }
  const method = typeof request.method === 'string' ? request.method.toUpperCase() : 'GET'
  const headers = await resolveHeaders(rawHeaders, ctx)
  const init = { method, headers, redirect: 'manual', signal }
  if (method !== 'GET' && method !== 'HEAD' && request.body !== undefined) {
    init.body = typeof request.body === 'string' ? request.body : JSON.stringify(request.body)
    if (!Object.keys(headers).some(name => name.toLowerCase() === 'content-type')) {
      init.headers = { ...headers, 'content-type': 'application/json' }
    }
  }
  // 瞬时网络错误自动重试(issue #28 同一封装;body 为字符串可安全重放)。
  // redirect: 'manual'(v1.6.8):禁止自动跟随重定向——凭据头会被原样带到 3xx 的
  // 目标主机,一次跨源重定向就足以把密钥发去别处;遇到重定向直接报错。
  const response = await fetchWithRetry(parsedUrl.href, init, { timeoutMs: 15000 })
```

</details>

**依据 4 · 源码核查**：[lib/index.js:2577-2596](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/index.js#L2577-L2596)

先备份/确认重算及写入失败判断。

<details>
<summary>查看原文（20行）</summary>

```text
    async repriceHistory(confirmed, model = '') {
      if (confirmed !== true) throw new Error('Explicit confirmation is required')
      if (typeof model !== 'string' || model.length > 2048 || /[\r\n]/.test(model)
        || (model && (model.indexOf(':') <= 0 || model.endsWith(':')))) throw new Error('Invalid channel/model')
      if (repricing) throw new Error('Historical recalculation is already running')
      repricing = true
      const at = Date.now(), en = localeOf(ledger.config, ctx) === 'en'
      try {
        ledger.refresh()
        if (model && !Object.values(ledger.days).some(day => Object.hasOwn(day.byProviderModel ?? {}, model))) throw new Error(en ? 'This channel/model has no retained history' : '此渠道模型没有保留的历史记录')
        const sessions = model ? new Set(Object.values(ledger.days).flatMap(day => (day.sessions ?? [])
          .filter(row => Object.hasOwn(row.byProviderModel ?? {}, model)).map(row => row.id))) : null
        const backup = `${ledger.path}.before-reprice-${at}.json`
        fs.writeFileSync(backup, JSON.stringify(ledger.snapshot()), { encoding: 'utf8', flag: 'wx', mode: 0o600 })
        const stats = await recomputeLedgerPricingBasis(ledger, join(resolveDshHome(), 'sessions'), undefined, sessions, true, model, sessionSource)
        ledger.pricingHistory.runs[String(at)] = { at, before: stats.before, after: stats.after, days: stats.recostedDays, sessions: stats.recostedSessions, skipped: stats.skippedSessions,
          ...(model ? { model, beforeCny: stats.beforeCny, afterCny: stats.afterCny, beforeEur: stats.beforeEur, afterEur: stats.afterEur } : {}) }
        ledger.scheduleWrite()
        ledger.flush()
        if (ledger.pendingWrite) throw new Error(en ? 'Could not save recalculation; original ledger backup retained.' : '重算结果未能写入，已保留原账本备份。')
```

</details>

**依据 5 · 源码核查**：[lib/store.js:2668-2675](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/store.js#L2668-L2675)

真实退出close边界。

```text
  /** 停止后续写入并最终落盘(插件卸载/进程退出)。 */
  close() {
    // Keep the main loop running so worker completion/error events can reach
    // Cordis while it awaits disposal. A synchronous join blocks those events.
    if (this.backgroundWrite) return this.backgroundWrite.promise.then(() => this.close())
    this.flush(5000)              // 退出时保留同步最终提交；日常写入遇锁立即让出并重试。
    this.closed = true
    if (this.writeTimer !== null) { clearTimeout(this.writeTimer); this.writeTimer = null }
```

**依据 6 · 源码核查**：[lib/store.js:2501-2509](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/store.js#L2501-L2509)

清历史非全文件删除。

```text
  resetHistory() {
    this.days = {}
    this.planSamples = {}
    this.planHourBuckets = {}
    this.balanceRef = null
    this.pendingAccounts = []
    this.pendingPlanHourRepairs = []
    this.historyReset = { id: randomUUID(), at: Date.now() }
    this.scheduleWrite()
```

#### 缺口

- 缺同集供应商结算/采集覆盖对照、首次持续恢复人工分钟和总资源费用。
  **影响**：只能受控试用，不能承诺省钱、财务准确或生产超支保护。
  **进一步探讨**：用已知小调用集记录差额/漏重率和人工分钟，另核正常退出与磁盘失败恢复；超出预算/错误阈值停止估算依赖。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 哪些增量已成立，普通流收据方向如何避免重复已有机制？

**研究主题**：贡献与相对优势、新假设与验证

#### 完整回答

现有贡献是把DSH实际流usage按会话/模型接入持久账本，将API估算与Plan等值区分；普通ALS/窗口应对重复包装，worker事务receipt应对提交后失ACK，专用billion journal已有source+seq/cursor、missing/partial等状态。这些边界不同：写事务UUID不能识别两个相同token的独立调用，专链seq也不自动覆盖普通流。相对供应商总账或人工日志，该组合降低部分收集/归因动作，但未证明净少错或省人工；汇总UI不改变工作组织/覆盖人群。

候选应收窄到普通流/包装Host接缝的稳定尝试收据及显式unknown状态，而不是重新发明专链序号：由可信Host给每次底层推理attempt ID，保父包装关系，消费结束记录usage是否出现、价格是否已知，只有来源/attempt相同才合并；无法传ID时明确降回heuristic并展示缺口，不能假造稳定ID。应和现有专链/原生Host日志+供应商账单及简单禁用包装去重比较。

最小实验用可丢弃Host/mock数据矩阵：同量独立包装、plain两次、上游转发、pull扇出、取消无usage、重试与写回执丢失；分别核采集漏/重、缺价零额误读、持久重放、人工对账分钟和新增开销。若Host/适配器无法传可信ID、现有专链足够覆盖目标群、只加unknown标签已解决决策问题或新增误合并/维护成本更大，则推翻。没有原型/实测，不计现有能力或省钱。

#### 证据与依据

**依据 1 · 源码核查**：[lib/usage-dedup.js:92-113](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/usage-dedup.js#L92-L113)

普通流数值窗口仍是比较基线。

<details>
<summary>查看原文（22行）</summary>

```text
    admit(sessionId, model, provider, buckets, atMs) {
      const prov = typeof provider === 'string' ? provider : ''
      const wrapped = isWrapperProviderId(prov)
      const effective = wrapped ? (wrapperUpstreamProvider(prov) ?? prov) : prov
      const key = typeof sessionId === 'string' && sessionId.length > 0 ? sessionId : ''
      const t = Number.isFinite(atMs) && atMs > 0 ? atMs : now()
      const clock = now()
      const fp = usageFingerprint(model, buckets, effective)
      let entry = sessions.get(key)
      if (entry === undefined) {
        entry = { plain: new Map(), remapped: new Map() }
        sessions.set(key, entry)
      }
      sweep(entry.plain, clock)
      sweep(entry.remapped, clock)
      const book = wrapped ? entry.remapped : entry.plain
      // 包装样本与普通样本、改挂样本都互斥;普通样本只与改挂样本互斥。
      const matches = source => source.get(fp)?.some(row => Math.abs(t - row.at) <= windowMs) === true
      if (wrapped ? (matches(entry.plain) || matches(entry.remapped)) : matches(entry.remapped)) {
        return null
      }
      book.set(fp, [...(book.get(fp) ?? []), { at: t, seen: clock }].slice(-maxEntries))
```

</details>

**依据 2 · 源码核查**：[lib/billing-stream.js:80-93](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/billing-stream.js#L80-L93)

普通无usage/专链covered条件。

<details>
<summary>查看原文（14行）</summary>

```text
        if (!completed) {
          try {
            await iterator?.return?.()
          } catch {}
        }
        release?.()
        const covered = proxy ? await proxy.finish(usage) : false
        if (usage !== null && !covered) {
          try {
            account(usage, options?.model, options?.sessionId, startedAtMs, options?.provider)
          } catch (error) {
            console.warn(`[dsh-cost-meter] 计费失败: ${String(error)}`)
          }
        }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:3853-3865](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/index.js#L3853-L3865)

普通account未传meter ID。

<details>
<summary>查看原文（13行）</summary>

```text
    account: (usage, model, sessionId, atMs, provider) => {
      const buckets = {
        input: usage.inputTokens ?? 0,
        output: usage.outputTokens ?? 0,
        cacheRead: usage.cacheReadTokens ?? 0,
        cacheWrite: usage.cacheWriteTokens ?? 0,
        reasoning: usage.reasoningTokens ?? 0,
      }
      // 非字符串 provider(个别路由 header 配置异常,日志渲染为 [object Object])
      // 在去重器内归一为空串,由账本按缺省渠道处理,避免脏键。
      const effective = usageDeduper.admit(sessionId, model, provider, buckets, atMs)
      if (effective === null) return
      ledger.account(buckets, model, sessionId, atMs, effective)
```

</details>

**依据 4 · 源码核查**：[lib/billion-context-billing.js:189-198](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/billion-context-billing.js#L189-L198)

已有专链source/seq、缺usage状态及cursor，非新发明。

<details>
<summary>查看原文（10行）</summary>

```text
              offset = item.offset
              status.requests++
              if (!row.usage) status.unreported++
              else if (!row.complete) status.partial++
              const meter = { source: row.source + ':' + file.key, seq: row.seq }
              const reset = ledger.historyReset?.at ?? 0
              if ((ledger.usageCursors?.[meter.source] ?? 0) < meter.seq) {
                if (!row.usage || row.startedAtMs <= reset || stream.policies?.[row.groupId] === 'fallback') ledger.advanceUsageCursor(meter)
                else ledger.account(usageBuckets(row.usage), row.model, row.sessionId, row.startedAtMs, billionProvider(row, stream), meter)
              }
```

</details>

**依据 5 · 源码核查**：[lib/ledger-persistence.js:209-217](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/lib/ledger-persistence.js#L209-L217)

已有meter防重放边界。

```text
export function applyAccount(state, entry) {
  if (entry.meter) {
    const { source, seq } = entry.meter
    if (!meterSource(source) || !Number.isSafeInteger(seq) || seq < 1) throw Error('Invalid metered call identity')
    if ((state.usageCursors?.[source] ?? 0) >= seq) return false
    state.usageCursors ??= {}
    state.usageCursors[source] = seq
    if (entry.skip) return true
  }
```

**依据 6 · 源码核查**：[src/ledger-writer-worker.js:24-28](https://github.com/Han-1413141/dsh-cost-meter/blob/e356e79fcaf3f07b8b4d2b1e0a777c59a76e17d5/src/ledger-writer-worker.js#L24-L28)

已有写事务UUID receipt与磁盘提交。

```text
    merged.writeReceipts = cleanWriteReceipts([...(merged.writeReceipts ?? []), transactionId])
    writeLedger(path, merged, backupHistory)
    return { ownDisk, ...(ownDisk ? {} : { merged }), writeReceipts: merged.writeReceipts, revision: revisionOf(path) }
  }, 5000, lockId)
  port.postMessage(result)
```

#### 缺口

- 普通Host可信attempt ID跨包装契约、原型和与既有专链/简单unknown提示对照均缺。
  **影响**：候选尚不能保证少漏重或值得增加复杂性。
  **进一步探讨**：先核Host可传ID的适配器边界，再按矩阵比较质量/人工/开销，目标覆盖已足或ID不可信就停止。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
