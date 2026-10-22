# dsh-crypto-portfolio

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[d3edb74](https://github.com/0xRabit/dsh-crypto-portfolio/tree/d3edb74bef1fcb779e899c26c37b19664ecf0a9f)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/0xRabit/dsh-crypto-portfolio)
<!-- END META -->

> **实现功能**：通过 DSH 启动 Python 本地资产仪表盘，聚合链上/CEX 余额、历史、来源和健康视图。

> **核心亮点**：把多链、CEX 与历史视图接入一个自托管 DSH 插件，支持 profile 和来源切换；具体准确性仍受上游数据影响。详见[Q01](#research-q01)。

> **风险与缺陷**：HTTP 敏感 GET 未鉴权，非回环绑定可扩大暴露；CEX 黑名单过滤后的 tokens 与 raw total 求值来源不同。详见[Q03](#research-q03)与[Q04](#research-q04)。

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
  - [Q01 · 多链资产组合的目标任务和交付边界是什么？](#detail-section-11)
  - [Q02 · 刷新、黑名单、历史和多 Profile 如何组织？](#detail-section-12)
  - [Q03 · 本地 HTTP API 对密钥和资产数据的保护边界是什么？](#detail-section-13)
  - [Q04 · 汇总数字是否在失败或黑名单场景保持一致？](#detail-section-14)
  - [Q05 · 安装维护成本与财务使用风险是什么？](#detail-section-15)
  - [Q06 · 怎样把资产数字与敏感配置提升到可审计水平？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多钱包/CEX 用户在本机观察资产估值与趋势；需对账，不能替代财务账本。详见[Q01](#research-q01)。

作者要在本机汇总链上钱包与 CEX 余额、趋势、健康度和来源状态，面向自管多钱包用户。DSH 插件本身是 Cordis 壳：复制公开模板，spawn Python 子进程；Python 标准库 HTTP 服务提供独立仪表盘和 JSON API。它不交易也不持有私钥，但要处理钱包地址、交易所只读 API 密钥和本地资产历史；计算值必须视为来源依赖的估算，不是账本或投资建议。作者列的多链、CEX、健康与分享功能本轮只核部分实现，不把 README 叙述当覆盖完整性的独立验证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 刷新快照 | 汇总估值 | 上游质量决定准确性 |
| 黑名单 | 剔除可疑代币 | CEX raw total 有不一致路径 |
| 配置 API | 管理来源与 key | reveal/export 敏感 GET 无认证 |
| 多 Profile | 隔离个人组合 | 需本地备份与权限管理 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必要性 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH/Node + Python 3.9+/requests/PyNaCl | 插件运行必需 | 子进程/抓取 | 无法启动或取数 |
| 多链/行情/交易所 API | 数据必需 | 余额与估价 | 漏算或故障行 |
| Profile 本地目录/SQLite | 历史必需 | key 与快照 | 数据/配置丢失 |

#### 启动步骤

| 步骤 | 动作 | 判据或失败处理 |
| --- | --- | --- |
| 安装 | 固定包/依赖并设本地目录 | 服务仅预期地址可达 |
| 配置 | 填钱包及只读 CEX key | 检查来源掩码和本机权限 |
| 刷新 | 观察来源状态、余额与时间 | 对账并标记失败/旧值 |
| 维护 | 备份 Profile/轮换 key | 验证历史与密钥访问 |

**效果与成本**

#### 成本

| 阶段 | 资源与现金成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 首次 | DSH/Node/Python 和可能付费 API，金额未知 | 安装、配只读 key、目录权限 | API/包可达性未核 |
| 持续 | 多来源请求、SQLite 与定时线程 | 来源故障核对、备份、对账 | 额度与真实耗时未知 |
| 失败 | 漏算/错算或密钥暴露风险 | 恢复快照/换源/轮换 key | 影响金额不能估计 |

#### 效果

| 效果项 | 固定源码支持 | 尚未证实 |
| --- | --- | --- |
| 多源聚合 | 多链/CEX 抓取编排 | 余额完整度和行情精度 |
| 历史/过滤 | 当日 SQLite、当前黑名单视图 | raw CEX 总额一致性 |
| 私密性 | 默认回环、默认掩码 | reveal/export 的读侧控制 |

> **思考**：HTTP 敏感 GET 未鉴权，非回环绑定可扩大暴露；CEX 黑名单过滤后的 tokens 与 raw total 求值来源不同。详见[Q03](#research-q03)与[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把多链、CEX 与历史视图接入一个自托管 DSH 插件，支持 profile 和来源切换；具体准确性仍受上游数据影响。详见[Q01](#research-q01)。

把多链、CEX 与历史视图接入一个自托管 DSH 插件，支持 profile 和来源切换；具体准确性仍受上游数据影响。详见[Q01](#research-q01)。

分层 Profile 存储、刷新锁、失败状态与历史重算可借鉴；敏感 GET 与 CEX 原始总额需修正。详见[Q02](#research-q02)及[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

HTTP 敏感 GET 未鉴权，非回环绑定可扩大暴露；CEX 黑名单过滤后的 tokens 与 raw total 求值来源不同。详见[Q03](#research-q03)与[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅作辅助观察；先限制 API 可达性、验证密钥保护并用自己的账本对账，关键财务判断暂不依赖单一总额。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码支持已描述的入口、接线与数据流；贡献和采用价值为源码级解释，运行效果、真实宿主兼容与收益对照尚未验证。

- 已检查：作者 README、包清单、源码路径 README.zh.md、index.js、tracker/server.py、tracker/portfolio.py、tracker/storage.py、tracker/sources.py、tracker/views.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README、Node 壳及相关 Python 模块；未运行目标代码、上游 API、宿主或行情对账；旧 META 仅复用。
- 下一步：进一步探讨应按本项缺口执行：限制绑定/访问并在隔离机测本地及 LAN 未授权读取；做 CEX 黑名单夹具，比较刷新响应、DB、快照列表、历史与 UI；在隔离环境核依赖、API 成本、数据目录权限与对账误差；先做最小安全/数值修复并运行隔离测试矩阵

**分析版本**

- **仓库**：[0xRabit/dsh-crypto-portfolio](https://github.com/0xRabit/dsh-crypto-portfolio)
- **版本号**：0.2.0（[固定提交 d3edb74](https://github.com/0xRabit/dsh-crypto-portfolio/tree/d3edb74bef1fcb779e899c26c37b19664ecf0a9f)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是认证敏感读、限定绑定、统一过滤后数值并记录来源完整度，以安全矩阵与资产对账验收。详见[Q06](#research-q06)。

进一步探讨应按本项缺口执行：限制绑定/访问并在隔离机测本地及 LAN 未授权读取；做 CEX 黑名单夹具，比较刷新响应、DB、快照列表、历史与 UI；在隔离环境核依赖、API 成本、数据目录权限与对账误差；先做最小安全/数值修复并运行隔离测试矩阵

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 736 | — | — | 9120 |
| .js | source | 2 | 3939 | 3414 | 427 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/0xRabit/dsh-crypto-portfolio/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/0xRabit/dsh-crypto-portfolio/issues?q=is%3Aissue+created%3A2026-09-22T15%3A11%3A48.053Z..2026-10-22T15%3A11%3A48.053Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/0xRabit/dsh-crypto-portfolio/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T15%3A11%3A48.053Z..2026-10-22T15%3A11%3A48.053Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：自托管多来源资产仪表盘能否保护敏感配置并呈现一致、可对账的估算？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 多链资产组合的目标任务和交付边界是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

作者要在本机汇总链上钱包与 CEX 余额、趋势、健康度和来源状态，面向自管多钱包用户。DSH 插件本身是 Cordis 壳：复制公开模板，spawn Python 子进程；Python 标准库 HTTP 服务提供独立仪表盘和 JSON API。它不交易也不持有私钥，但要处理钱包地址、交易所只读 API 密钥和本地资产历史；计算值必须视为来源依赖的估算，不是账本或投资建议。作者列的多链、CEX、健康与分享功能本轮只核部分实现，不把 README 叙述当覆盖完整性的独立验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:1-13](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/README.zh.md#L1-L13)

当前固定版本复核。作者定位、依赖与安装

<details>
<summary>查看原文（13行）</summary>

````text
# dsh-crypto-portfolio

[English](README.md) | 中文

免费、100% 自托管的 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）插件：把**链上与 CEX 资产**统一到一张自包含的 Web 仪表盘上。

**依赖** `dsh` `0.1.1-rc.2`（Node `^22.19 || >=24`）· Python 3.9+ · `pip3 install requests pynacl`

```sh
dsh plugin --profile demo add dsh-crypto-portfolio   # npm
dsh --profile demo                                    # 仪表盘 http://127.0.0.1:8080
```

````

</details>

**依据 2 · 作者声明**：[README.zh.md:59-92](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/README.zh.md#L59-L92)

当前固定版本复核。作者列主要功能

<details>
<summary>查看原文（34行）</summary>

```text

- **一个 DSH 插件，拉起一个零依赖的 Web 仪表盘。** 没有框架、没有 CDN，Python 标准库 + 原生 JS。
- **覆盖 BTC / EVM / Solana / 狗狗币 / 艾达币 / Hyperliquid L1 / CEX。** DeBank 全 73 条链、BTC 双地址（P2SH + P2TR）、Solana 原生质押、狗狗币（BlockCypher）、艾达币（Koios，支持 stake 地址）、Hyperliquid 官方 API（质押 HYPE + 现货 + 永续权益 + 金库权益）、五个交易所只读 key（Binance / Bybit / Backpack / OKX / Bitget，命名 `<交易所>_read`）；OKX 同时读交易账户与资金账户，Bitget 汇总现货与真实合约账户（跳过 S 开头的模拟盘，避免把「练习钱」算进总资产）。
- **全局筛选。** 分类（BTC / EVM / Solana / 狗狗币 / 艾达币 / CEX）、钱包、网络三个下拉作用于所有面板——总额、钱包占比饼图、趋势、网络分布、代币表一起联动。
- **每个钱包最多 5 个区块浏览器。** 钱包卡片底部是一排浏览器图标：排第一的是本程序实际取数的来源（DeBank · bitaps · Jupiter · Dogechain · Cardanoscan），后面按知名度依次是 Etherscan、mempool.space、Solscan、Blockchair、CExplorer 等。狗狗币只有 3 个、艾达币只有 4 个——这两个生态确实凑不满 5 个可信浏览器。交易所账户没有链上浏览器页面，因此只显示交易所图标。
- **免费 + 付费数据源，显著区分。** EVM 走 DeBank 双 provider：付费 `debank-pro`（标注「付费」，带注册链接）与免费免 key 的 `debank-public` 兜底；CEX 五行（Binance/Bybit/Backpack/OKX/Bitget）常驻显示并带各家「获取 API key」链接（OKX、Bitget 还需填 passphrase）；每个数据源显示最近一次成功时间。
- **多 API 源自动切换。** 每个数据源配了多个 provider（价格：CoinGecko → Binance → Coinbase → OKX；BTC：blockchain.info → mempool.space；Solana RPC 多节点；Hyperliquid 双端点），挂了自动切下一个，并记住最近能用的。
- **定时每日刷新。** 每个 Profile 可设置本地时间自动刷新（服务端守护线程，关闭网页不影响）；设置页显示各数据源最后成功时间。
- **多 Profile 配置隔离。** `default` Profile 内置公开模板钱包（vitalik.eth、创世 BTC、公开 SOL、公开 DOGE、公开 ADA）与空 key；你的私人钱包和 key 放在独立命名的 Profile 里，拥有各自的快照历史。每个 Profile 可重命名（快照随之迁移），并各自维护独立的每日定时刷新时间。
- **资产健康度。** 代币明细表上方一个面板用三张卡片给组合打分——**波动性风险**（稳定币 · 比特币 · 其他，按高波动占比评级）、**集中度**（最大钱包占比，画成带两条阈值刻度的量尺）、**托管安全**（冷 · 热 · 交易所）。每一行都同时给出余额和占比，未通过的项各配一句人话建议。三条阈值都能在设置页里改（按 Profile 保存、带校验，托管安全那对是反向的），数据取自同一份已过滤黑名单的快照，因此永远和上面的总额一致。在设置里把钱包标成「冷钱包」，托管安全那项**立刻**跟着变（冷热以当前钱包列表为准，快照里的值只作为已删除钱包的兜底）。
- **手动协议持仓。** 不是每个协议都读得到：全新的协议（这次是 Papertrade）可能根本没有余额 API。在持有它的钱包下手工登记一条——协议、符号、数量、估值（USD）和登记日期——它就会像普通持仓一样进入总额、钱包卡片、链分布与健康度报告。它刻意是一个**带日期的估值**而不是实时值：不跟行情变动，刷新也不会覆盖，所以页面会一直显示你登记的那个金额和日期（代币表里该行带 `manual` 标记和日期），直到你重新登记。登记只从它自己的日期起生效，因此今天新增的一条不会改写上个月的历史。
- **「计划」标签页 —— 资产管理的操作手册。** 在 Dashboard 与 Settings 之外新增第三个标签页，把一份财务计划变成今天的操作指令。计划只需设定一次（按 Profile 存在 `plan.json`）：每种币的价格档位、每个档位每周投入多少、新增资金如何分配、哪些现金与股票仓位算作「弹药」、目标是什么。之后每次刷新它都会回答唯一重要的问题 —— **下一块钱该怎么花？**：本周各币买入额（BTC 40% / ETH 35% / HYPE+SOL 25%）、每个币当前所处档位（按自身价格判定，HYPE+SOL 跟随 BTC）、这笔钱从哪个弹药来源出、该来源还剩多少、本季度投放额度用掉多少、总资产相对各目标路径的位置与仍需的年化收益，以及当前真正生效的止盈 / 再平衡 / 回撤规则。执行记录写入 `plan_log.jsonl` 并按来源扣减弹药池，所以「还能投多少」是真实数字而不是估算。追踪器看不到的现金与股票以「手工资产」登记，并因此进入总资产与目标计算。默认值是示意用的占位数据（其中的股票与金额都是示例，在「计划设置」里替换成你自己的），标签页与它自带的示例完全一致：BTC $80,422 属 T2、ETH $2,353 属 T3，则本周为 $160 + $280 + $100 = $540。
- **分享卡片。** 顶栏「分享」按钮（就在「刷新」旁边）弹出对话框，实时预览一张 1200×630 的 PNG——总额、日环比、按币种合并的前五大持仓、资产类别甜甜圈、三条健康度结论。可以直接下载、复制图片、复制文案，或一键跳转 **X / Facebook / WhatsApp / Telegram**。全部用 canvas 手绘：不引入 `html2canvas`、不依赖 CDN，图片里也不含任何钱包地址。
- **作者链接 + 打赏。** 设置页底部有作者的社交链接（X / Discord / GitHub）与「请我喝杯咖啡」弹窗，内含 tip.md 徽章和币安支付二维码；徽章已本地内置，页面不会发出任何第三方请求。
- **可链接的页面。** `#pageSettings` 直达设置页，`#pageSettings/secWallets` 直达某个设置分区，`#pagePlan` 直达计划页——刷新或收藏后回到原处。
- **主题与多语言。** 深/浅色主题切换、中英双语（默认英文）、全站链与交易所图标。


架构长这样——每个方框都是一条真实的数据管线：

![架构图](assets/arch.svg)

## 与 DSH 的集成方式

仪表盘还会盯着自己的 Python 源码：改 `tracker/*.py` 会在几秒内自动重启（同一个进程，不需要重启 DSH），静态文件本来就是每次请求读盘，所以改界面刷新页面即可。设置页的「服务」面板里有一个「重启服务」按钮，需要强制重启时用。

不是套壳，是真插件：

- 声明 `dsh.bundle` manifest（`cordis.patch.yml`），`dsh plugin add` 直接安装。
- `apply(ctx)` 接入 Cordis 生命周期：首次运行用公开模板生成用户本地的 `profiles/default`，以子进程拉起仪表盘，`ctx.on('dispose')` 时优雅停掉。
- 除 Web UI 外还暴露 JSON API（`GET /api/refresh`、`/api/history`、`/api/tokens` 等），agent 可直接调用。

## 隐私声明（重要）

```

</details>

**依据 3 · 源码核查**：[index.js:35-72](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/index.js#L35-L72)

当前固定版本复核。模板、Python 子进程与生命周期

<details>
<summary>查看原文（38行）</summary>

```text

function seedConfigs(dataDir) {
  // seed the default profile (<dataDir>/default) from the public templates
  const dir = join(dataDir, 'default')
  mkdirSync(dir, { recursive: true })
  for (const [tpl, dst] of [['portfolio_sources.json', 'sources.json'], ['portfolio_wallets.json', 'wallets.json']]) {
    const target = join(dir, dst)
    const src = join(ROOT, 'templates', tpl)
    if (!existsSync(target) && existsSync(src)) {
      try { copyFileSync(src, target); console.log(`[dsh-crypto-portfolio] seeded profiles/default/${dst} from templates`) } catch (e) { /* ignore */ }
    }
  }
}

// Cordis hands the row's config to apply() as the SECOND argument. Reading it
// from `ctx.config` throws "cannot get property config without inject".
/** Is nothing listening on host:port? A leaked server from an earlier run would
 *  hold the port, and the new child would exit on EADDRINUSE — the dashboard then
 *  keeps serving *old code* while this plugin looks loaded. Probe first instead. */
function portFree(host, port, timeout = 800) {
  return new Promise((resolve) => {
    const sock = createConnection({ host, port })
    let done = false
    const finish = (free) => {
      if (done) return
      done = true
      sock.destroy()
      resolve(free)
    }
    sock.once('connect', () => finish(false))
    sock.once('error', () => finish(true))
    setTimeout(() => finish(true), timeout)
  })
}

// Cordis hands the row's config to apply() as the SECOND argument. Reading it
// from `ctx.config` throws "cannot get property config without inject".
export function apply(ctx, config) {
```

</details>

**依据 4 · 源码核查**：[tracker/server.py:85-171](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/server.py#L85-L171)

当前固定版本复核。仪表盘 JSON API

<details>
<summary>查看原文（87行）</summary>

```text
    server_version = "PortfolioTracker/1.0"

    def log_message(self, fmt, *args):  # silence request log
        pass

    def do_GET(self):  # noqa: N802
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        qs = urllib.parse.parse_qs(parsed.query)

        try:
            if path == "/":
                self._serve_file("index.html")
            elif path.startswith("/static/"):
                self._serve_file(path[len("/static/"):], subdir=_STATIC)
            elif path == "/api/wallets":
                code, body = _json(self._wallet_view())
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/refresh":
                # kept for curl/CLI compatibility; the dashboard POSTs. Either way
                # this is a write, so the cross-site fence applies.
                denied = self._write_guard(is_post=False)
                if denied:
                    self._reply(403, json.dumps({"error": denied}).encode(), "application/json")
                else:
                    self._handle_refresh(qs)
            elif path == "/api/current":
                snap = storage.get_latest_snapshot()
                if not snap:
                    code, body = _json({"error": "No snapshot yet - click Refresh"}, 404)
                else:
                    code, body = _json(self._snapshot_view(snap))
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/snapshot":
                d = qs.get("date", [None])[0]
                snap = storage.get_snapshot(d) if d else storage.get_latest_snapshot()
                if not snap:
                    code, body = _json({"error": f"没有 {d or '任何'} 快照"}, 404)
                else:
                    code, body = _json(self._snapshot_view(snap))
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/health":
                self._reply_json(self._health_view())
            elif path == "/api/manual":
                code, body = _json(self._manual_view())
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/plan":
                # the asset plan, evaluated against a snapshot (default: the newest)
                d = qs.get("date", [None])[0] or None
                code, body = _json(plan.analyze(d))
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/history":
                days = int(qs.get("days", ["0"])[0] or 0) or None
                code, body = _json(storage.get_history(days))
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/tokens":
                d = qs.get("date", [None])[0] or storage.get_latest_snapshot()
                d = d["date"] if isinstance(d, dict) else d
                code, body = _json({"date": d, "tokens": storage.get_tokens(d),
                                    "labels": assetlabels.known_labels(),
                                    "label_names": assetlabels.label_names(),
                                    "builtin_labels": list(assetlabels.BUILTIN_LABELS) + [assetlabels.DEFAULT_LABEL]})
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/status":
                code, body = _json(dict(_refresh_state))
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/snapshots":
                code, body = _json(storage.get_snapshot_dates())
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/labels":
                code, body = _json(self._stablecoins_view())
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/blacklist":
                code, body = _json(self._blacklist_view())
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/sources":
                # secrets are masked unless the caller explicitly asks to reveal
                reveal = (qs.get("reveal") or ["0"])[0] in ("1", "true")
                cfg = sources.load()
                code, body = _json({
                    "file": sources.sources_file(),
                    "config": cfg if reveal else sources.mask_config(cfg),
                    "masked": not reveal,
                    "last_ok": sources.failover_state(),
                    "status": status.get_status(),
                })
                self._reply(code, body, "application/json; charset=utf-8")
```

</details>

**依据 5 · 源码核查**：[tracker/portfolio.py:100-110](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/portfolio.py#L100-L110)

当前固定版本复核。统一快照入口

<details>
<summary>查看原文（11行）</summary>

```text
def fetch_all(progress=None):
    """Fetch all wallets and return unified snapshot data (does NOT save).

    progress: optional callable(stage, done, total, msg) for UI feedback.
    """
    def tick(stage, done, total, msg=""):
        if progress:
            progress(stage, done, total, msg)

    result = {"date": today_str(), "created_at": datetime.now().isoformat(timespec="seconds"),
              "wallets": [], "total_usd": 0.0, "by_chain": {}}
```

</details>

#### 缺口

- 真实地址/交易所范围、资产准确率与投资用途未核
  **影响**：不能证明全面或可据此作财务决策
  **进一步探讨**：选少量自有对账样例核余额、价格和故障显示

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 刷新、黑名单、历史和多 Profile 如何组织？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

刷新顺序拉币价、BTC/DOGE/ADA、EVM/Hyperliquid、SOL、CEX 后合成钱包行；正常行先按黑名单过滤再求总。refresh_snapshot 持锁取数、写当日覆盖式 SQLite 快照，成功后按近 90 日逐日/历史每月末尾留存；读视图与历史再按当前黑名单重算，方便追溯规则变化。Profile 路径放 sources、wallets、SQLite，安装在 node_modules 时默认移到 DSH_HOME storages，避免插件更新覆盖数据。源码可证流程；外部行情准确性、节点失败覆盖及真实性能未测。

#### 证据与依据

**依据 1 · 源码核查**：[tracker/portfolio.py:100-209](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/portfolio.py#L100-L209)

当前固定版本复核。多来源取数流程

<details>
<summary>查看原文（110行）</summary>

```text
def fetch_all(progress=None):
    """Fetch all wallets and return unified snapshot data (does NOT save).

    progress: optional callable(stage, done, total, msg) for UI feedback.
    """
    def tick(stage, done, total, msg=""):
        if progress:
            progress(stage, done, total, msg)

    result = {"date": today_str(), "created_at": datetime.now().isoformat(timespec="seconds"),
              "wallets": [], "total_usd": 0.0, "by_chain": {}}

    # 1) native prices (one CoinGecko call)
    tick("prices", 0, 1, "Fetching BTC/ETH/SOL/HYPE prices…")
    native = get_native_prices()
    btc_usd = native.get("bitcoin")
    sol_usd = native.get("solana")
    tick("prices", 1, 1, "Prices fetched")
    if native:
        status.mark_source_ok("prices")

    # 2) BTC wallets
    sats = {}
    btc_wallets = _wallet_subset("btc")
    if btc_wallets:
        tick("btc", 0, 1, "Fetching BTC balances…")
        sats = fetch_btc_satoshis([w["address"] for w in btc_wallets])
        tick("btc", 1, 1, "BTC balances fetched")
        status.mark_source_ok("btc")

    # 2b) DOGE wallets (BlockCypher) and ADA wallets (Koios)
    doge_koinu = {}
    doge_wallets = _wallet_subset("doge")
    if doge_wallets:
        tick("doge", 0, 1, "Fetching DOGE balances…")
        doge_koinu = fetch_doge_koinu([w["address"] for w in doge_wallets])
        tick("doge", 1, 1, "DOGE balances fetched")
        status.mark_source_ok("doge")

    ada_lovelace = {}
    ada_wallets = _wallet_subset("ada")
    if ada_wallets:
        tick("ada", 0, 1, "Fetching ADA balances…")
        ada_lovelace = fetch_ada_lovelace([w["address"] for w in ada_wallets])
        tick("ada", 1, 1, "ADA balances fetched")
        status.mark_source_ok("ada")

    # 3) EVM wallets (DeBank all chains + Hyperliquid native L1)
    evm_wallets = _wallet_subset("evm")
    evm_results = []
    if evm_wallets:
        total_steps = len(evm_wallets)
        for i, w in enumerate(evm_wallets):
            tick("evm", i, total_steps, f"Fetching {w['name']} (DeBank all chains + Hyperliquid L1)…")
            ew = fetch_evm_wallet(w)
            try:
                hl = fetch_hyperliquid_wallet(w, native.get("hyperliquid"),
                                              native.get("bitcoin"), native.get("ethereum"))
                ew["tokens"].extend(hl["rows"])
                status.mark_source_ok("hyperliquid")
            except Exception:  # noqa: BLE001
                pass
            evm_results.append(ew)
        tick("evm", total_steps, total_steps, "EVM/Hyperliquid fetched")
        status.mark_source_ok("debank")

    # 4) Solana wallets
    sol_wallets = _wallet_subset("sol")
    sol_rows_all = []
    if sol_wallets:
        tick("sol", 0, 3, "Fetching Solana tokens…")
        sol_data_list = [fetch_solana_wallet(w) for w in sol_wallets]
        sol_mints = [t["mint"] for d in sol_data_list for t in d["tokens"] if t["amount"] > 0]
        tick("sol", 1, 3, "Fetching SPL token prices…")
        spl_prices = get_sol_token_prices(sol_mints)
        tick("sol", 2, 3, "Birdeye price enrichment (if configured)…")
        birdeye_prices = {}
        birdeye_sol = None
        for w in sol_wallets:
            bp, bs = birdeye_wallet_prices(w["address"])
            if bp:
                birdeye_prices.update(bp)
            if bs:
                birdeye_sol = bs
        if birdeye_prices:
            spl_prices = {**spl_prices, **birdeye_prices}
        eff_sol_usd = birdeye_sol or sol_usd
        sol_rows_all = _sol_rows(sol_data_list, eff_sol_usd, spl_prices)
        tick("sol", 3, 3, "Solana fetched")
        status.mark_source_ok("solana")

    # 5) CEX accounts (Binance / Bybit / Backpack)
    # Etherscan reference source: native balances, surfaced in Settings, not merged
    try:
        esc_detail, _esc_err = fetch_etherscan(evm_wallets, native)
        if esc_detail:
            status.mark_source_ok("etherscan")
            status.set_detail("etherscan_native", esc_detail)
    except Exception:  # noqa: BLE001
        pass

    tick("cex", 0, 1, "Fetching CEX balances (Binance/Bybit/Backpack)…")
    cex_results = fetch_cex_accounts(cex_accounts(), native)
    tick("cex", 1, 1, "CEX fetched")
    for _r in cex_results:
        if _r["error"] is None:
            status.mark_source_ok(f"cex:{_r['account'].get('exchange')}")
    status.mark_source_ok("cex")

    # 6) assemble — every wallet's tokens pass through the blacklist; all totals
```

</details>

**依据 2 · 源码核查**：[tracker/portfolio.py:209-286](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/portfolio.py#L209-L286)

当前固定版本复核。黑名单过滤、总计、写快照与清理

<details>
<summary>查看原文（78行）</summary>

```text
    # 6) assemble — every wallet's tokens pass through the blacklist; all totals
    #    (wallet / chain / total) are recomputed from the filtered token rows.
    btc_rows_all = filter_rows(_btc_rows(sats, btc_usd))
    doge_rows_all = filter_rows(_chain_rows("doge", "DOGE", "Dogecoin", 1e8, doge_koinu,
                                            native.get("dogecoin"),
                                            "doge", "https://assets.coingecko.com/coins/images/5/small/dogecoin.png"))
    ada_rows_all = filter_rows(_chain_rows("ada", "ADA", "Cardano", 1e6, ada_lovelace,
                                           native.get("cardano"),
                                           "ada", "https://assets.coingecko.com/coins/images/975/small/cardano.png"))
    sol_rows_all = filter_rows(sol_rows_all)

    wallet_objs = []
    for w in walletstore.all_wallets():
        obj = {"wallet": w["name"], "address": w["address"], "type": w["type"],
               # stored with the snapshot so a historical health report still knows
               # which wallets were cold at the time
               "storage": w.get("storage") or "hot",
               "tokens": [], "total_usd": 0.0}
        if w["type"] == "btc":
            obj["tokens"] = [r for r in btc_rows_all if r["wallet"] == w["name"]]
        elif w["type"] == "doge":
            obj["tokens"] = [r for r in doge_rows_all if r["wallet"] == w["name"]]
        elif w["type"] == "ada":
            obj["tokens"] = [r for r in ada_rows_all if r["wallet"] == w["name"]]
        elif w["type"] == "evm":
            ew = next((e for e in evm_results if e["wallet"] == w["name"]), None)
            if ew:
                obj["tokens"] = ew["tokens"]
                if ew.get("error"):
                    obj["error"] = ew["error"]
        elif w["type"] == "sol":
            obj["tokens"] = [r for r in sol_rows_all if r["wallet"] == w["name"]]
        obj["tokens"] = filter_rows(obj["tokens"])
        obj["total_usd"] = round(sum(r["usd"] for r in obj["tokens"]), 2)
        for r in obj["tokens"]:
            if r.get("usd"):
                c = r.get("chain") or ""
                result["by_chain"][c] = round(result["by_chain"].get(c, 0.0) + r["usd"], 2)
        wallet_objs.append(obj)

    for res in cex_results:
        acc = res["account"]
        obj = {"wallet": acc["name"], "address": str(acc.get("exchange") or ""),
               "type": "cex", "storage": "cex", "tokens": filter_rows(res["rows"]),
               "total_usd": round(sum(r["usd"] for r in res["rows"]), 2),
               "error": res["error"], "notes": res.get("notes") or []}
        if res["error"]:
            obj["tokens"] = [{"wallet": acc["name"], "chain": str(acc.get("exchange") or "cex"),
                              "symbol": "CEX-Error", "name": res["error"],
                              "amount": 0, "price": 0, "usd": 0.0, "logo": "",
                              "token_id": f"cex-err-{acc['name']}"}]
        for r in obj["tokens"]:
            if r.get("usd"):
                result["by_chain"][r["chain"]] = round(result["by_chain"].get(r["chain"], 0.0) + r["usd"], 2)
        wallet_objs.append(obj)

    for wo in wallet_objs:
        wo["tokens"] = sorted(wo["tokens"], key=lambda r: -r["usd"])
        result["total_usd"] = round(result["total_usd"] + wo["total_usd"], 2)

    result["wallets"] = wallet_objs
    status.mark_refresh()
    return result


def refresh_snapshot(progress=None):
    """Fetch everything and save today's snapshot. Returns (data, prev_latest)."""
    with _refresh_lock:
        prev = storage.get_latest_snapshot()
        data = fetch_all(progress=progress)
        storage.save_snapshot(data)
        # token rows dominate the database, so thin the tail right after a
        # successful write instead of letting the file grow without bound
        try:
            storage.prune_snapshots()
        except Exception:  # noqa: BLE001  retention must never fail a refresh
            pass
        return data, prev
```

</details>

**依据 3 · 源码核查**：[tracker/storage.py:103-139](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/storage.py#L103-L139)

当前固定版本复核。当日 upsert/明细存储

<details>
<summary>查看原文（37行）</summary>

```text
def save_snapshot(data):
    """Upsert today's snapshot (last result of the day wins) + detail rows."""
    with _lock:
        conn = _connect()
        try:
            date = data["date"]
            now = datetime.now().isoformat(timespec="seconds")
            conn.execute(
                "INSERT OR REPLACE INTO snapshots(date, created_at, total_usd, by_chain, raw) "
                "VALUES (?,?,?,?,?)",
                (date, now, data.get("total_usd", 0.0),
                 json.dumps(data.get("by_chain", {})), json.dumps(data, ensure_ascii=False)),
            )
            conn.execute("DELETE FROM wallet_totals WHERE date=?", (date,))
            for w in data.get("wallets", []):
                conn.execute(
                    "INSERT INTO wallet_totals(date, wallet, usd) VALUES (?,?,?)",
                    (date, w["wallet"], w.get("total_usd", 0.0)))
            conn.execute("DELETE FROM tokens WHERE date=?", (date,))
            for w in data.get("wallets", []):
                for t in w.get("tokens", []):
                    conn.execute(
                        "INSERT INTO tokens(date,wallet,chain,token_id,symbol,name,amount,price,usd,logo) "
                        "VALUES (?,?,?,?,?,?,?,?,?,?)",
                        (date, t["wallet"], t.get("chain", ""), t.get("token_id", ""),
                         t.get("symbol", ""), t.get("name", ""), t.get("amount", 0.0),
                         t.get("price", 0.0), t.get("usd", 0.0), t.get("logo", "")))
            # trend aggregates for this date, from the same filtered view the UI uses
            snap = dict(data)
            snap["date"] = date
            _write_history_rows(conn, date, _history_rows_for(snap))
            conn.execute("INSERT OR REPLACE INTO meta(key, value) VALUES ('history_sig', ?)",
                         (_history_sig(conn),))
            conn.commit()
        finally:
            conn.close()

```

</details>

**依据 4 · 源码核查**：[tracker/storage.py:236-276](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/storage.py#L236-L276)

当前固定版本复核。历史视图

<details>
<summary>查看原文（41行）</summary>

```text
def get_history(days=None):
    """Trend data: dates, total per day, per-wallet and per-chain series.

    Computed from each snapshot's raw token rows through the blacklist-filtered
    view, so historical totals always match the current blacklist.
    """
    with _lock:
        conn = _connect()
        try:
            sql = "SELECT date FROM snapshots ORDER BY date DESC"
            args = []
            if days:
                sql += " LIMIT ?"
                args.append(days)
            dates = [r["date"] for r in conn.execute(sql, args).fetchall()]
            dates.reverse()
            if not dates:
                return {"dates": [], "totals": [], "wallets": {}, "chains": {}}
            _ensure_history(conn)
            wanted = set(dates)
            totals_by_date = {}
            wallets = {}
            chains = {}
            for r in conn.execute("SELECT date, kind, name, usd FROM history_totals"):
                if r["date"] not in wanted:
                    continue
                if r["kind"] == "total":
                    totals_by_date[r["date"]] = r["usd"]
                elif r["kind"] == "wallet":
                    wallets.setdefault(r["name"], {})[r["date"]] = r["usd"]
                else:
                    chains.setdefault(r["name"], {})[r["date"]] = r["usd"]
            totals = [totals_by_date.get(d, 0.0) for d in dates]
            # manual registrations are part of the portfolio from their own date on,
            # so the trend line steps up when one is registered instead of jumping
            # retroactively across the whole history
            extra_total = manual.totals_by_date(dates)
            totals = [round((totals[i] or 0.0) + extra_total.get(d, 0.0), 2)
                      for i, d in enumerate(dates)]
            extra_wallet = manual.wallet_totals_by_date(dates)
            for w, series in extra_wallet.items():
```

</details>

**依据 5 · 源码核查**：[tracker/storage.py:298-363](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/storage.py#L298-L363)

当前固定版本复核。90 日+月度保留

<details>
<summary>查看原文（66行）</summary>

```text
                "ORDER BY usd DESC", (date,)).fetchall()
            # classification is applied at read time, so editing the rules also
            # reclassifies every historical snapshot
            out = assetlabels.annotate(filter_rows([dict(r) for r in rows]))
            # manually registered protocol positions ride along: same row shape, same
            # blacklist, their own registration date (see tracker/manual.py)
            extra = assetlabels.annotate(filter_rows(manual.rows(date)))
            if extra:
                out = out + extra
                out.sort(key=lambda r: -float(r.get("usd") or 0.0))
            return out
        finally:
            conn.close()


# ————————————————————————————————————————————————————————————————
# retention
#
# Every snapshot keeps a copy of every token row, so a profile grows by roughly
# 0.75 MB per day (a 12-wallet profile reaches ~280 MB/year) with nothing ever
# removed. Keep a dense recent window for the trend chart, and thin anything older
# down to one snapshot per month so long-range history still works.
# ————————————————————————————————————————————————————————————————
KEEP_DAILY_DAYS = int(os.environ.get("PORTFOLIO_KEEP_DAILY_DAYS", "90"))
KEEP_MONTHLY = int(os.environ.get("PORTFOLIO_KEEP_MONTHLY", "24"))


def plan_retention(dates, today=None, keep_days=None, keep_monthly=None):
    """Split dated snapshots into (keep, drop).

    `dates` is any iterable of 'YYYY-MM-DD'. The newest `keep_days` calendar days
    are all kept; older dates are thinned to the last snapshot of each month, of
    which the newest `keep_monthly` months survive. Pure so it can be tested
    without a database.
    """
    keep_days = KEEP_DAILY_DAYS if keep_days is None else keep_days
    keep_monthly = KEEP_MONTHLY if keep_monthly is None else keep_monthly
    days = sorted({str(d)[:10] for d in dates})
    if not days:
        return [], []
    if today is None:
        today = datetime.now().date().isoformat()
    cutoff = (datetime.fromisoformat(today).date() - timedelta(days=keep_days - 1)).isoformat()

    keep, older = [], []
    for d in days:
        (keep if d >= cutoff else older).append(d)

    # one representative per month for the tail: the last snapshot in that month
    by_month = {}
    for d in older:
        by_month[d[:7]] = d
    # One representative per month for the tail: the last snapshot in that month.
    # A month already present in the dense window contributes nothing extra, so the
    # chart never ends up with two points a few days apart.
    represented = {d[:7] for d in keep}
    tail_months = [m for m in sorted(by_month) if m not in represented]
    keep_months = tail_months[-keep_monthly:] if keep_monthly > 0 else []
    tail_keep = {by_month[m] for m in keep_months}
    keep.extend(sorted(tail_keep))
    # every older date that is not a chosen representative goes; deriving this from
    # `older` rather than from the month map is what makes the split exhaustive
    drop = [d for d in older if d not in tail_keep]
    return sorted(keep), sorted(drop)


```

</details>

**依据 6 · 源码核查**：[index.js:17-33](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/index.js#L17-L33)

当前固定版本复核。安装态数据目录避开 node_modules

<details>
<summary>查看原文（17行）</summary>

```text

/** Where the profiles (wallets, keys, snapshot DB) live.
 *
 * Inside the package by default, but an installed plugin MUST keep them outside:
 * `dsh plugin add`/update runs pnpm, which replaces the package directory — data
 * kept there is gone after an update. So when this file sits under node_modules and
 * no directory was configured, fall back to the DSH home instead of silently
 * storing a user's portfolio in a cache directory.
 */
function resolveDataDir(config) {
  const configured = (config && config.dataDir) || process.env.PORTFOLIO_PROFILES_DIR
  if (configured) return configured.replace(/^~(?=\/)/, process.env.HOME || '~')
  if (ROOT.includes(`${'node_modules'}`)) {
    const home = process.env.DSH_HOME || join(process.env.HOME || '.', '.dsh')
    return join(home, 'storages', 'crypto-portfolio')
  }
  return join(ROOT, 'profiles')
```

</details>

#### 缺口

- 外部数据源成功率、保留策略业务适宜性未测
  **影响**：不能声称历史完整或真实总资产准确
  **进一步探讨**：真实来源对账、失败注入和长期 profile 迁移/备份验证

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地 HTTP API 对密钥和资产数据的保护边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

默认只绑 127.0.0.1，但 config.host 可改为其他地址。HTTP Handler 没有身份认证：GET /api/sources?reveal=1 会返回未遮蔽配置，GET /api/config/export 也返回 sources.load() 原始密钥和钱包/黑名单；普通 GET 资产历史、地址也无鉴权。写侧有 Sec-Fetch-Site/Origin/JSON Content-Type 防跨站栅栏，但不是本机调用者认证，也不约束这些敏感 GET；Host header 未验证。若配置为非本地绑定，能连接服务的主体可能直接读取这些数据；即便 loopback，其他本机进程可读，浏览器恶意网页跨源读取还受 SOP 等边界，不能笼统断言远程网页已可窃密。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:50-68](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/index.js#L50-L68)

当前固定版本复核。host 默认回环但可由配置覆盖

<details>
<summary>查看原文（19行）</summary>

```text
// from `ctx.config` throws "cannot get property config without inject".
/** Is nothing listening on host:port? A leaked server from an earlier run would
 *  hold the port, and the new child would exit on EADDRINUSE — the dashboard then
 *  keeps serving *old code* while this plugin looks loaded. Probe first instead. */
function portFree(host, port, timeout = 800) {
  return new Promise((resolve) => {
    const sock = createConnection({ host, port })
    let done = false
    const finish = (free) => {
      if (done) return
      done = true
      sock.destroy()
      resolve(free)
    }
    sock.once('connect', () => finish(false))
    sock.once('error', () => finish(true))
    setTimeout(() => finish(true), timeout)
  })
}
```

</details>

**依据 2 · 源码核查**：[tracker/server.py:95-171](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/server.py#L95-L171)

当前固定版本复核。GET 敏感配置和资产 API，无认证门禁

<details>
<summary>查看原文（77行）</summary>

```text
        try:
            if path == "/":
                self._serve_file("index.html")
            elif path.startswith("/static/"):
                self._serve_file(path[len("/static/"):], subdir=_STATIC)
            elif path == "/api/wallets":
                code, body = _json(self._wallet_view())
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/refresh":
                # kept for curl/CLI compatibility; the dashboard POSTs. Either way
                # this is a write, so the cross-site fence applies.
                denied = self._write_guard(is_post=False)
                if denied:
                    self._reply(403, json.dumps({"error": denied}).encode(), "application/json")
                else:
                    self._handle_refresh(qs)
            elif path == "/api/current":
                snap = storage.get_latest_snapshot()
                if not snap:
                    code, body = _json({"error": "No snapshot yet - click Refresh"}, 404)
                else:
                    code, body = _json(self._snapshot_view(snap))
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/snapshot":
                d = qs.get("date", [None])[0]
                snap = storage.get_snapshot(d) if d else storage.get_latest_snapshot()
                if not snap:
                    code, body = _json({"error": f"没有 {d or '任何'} 快照"}, 404)
                else:
                    code, body = _json(self._snapshot_view(snap))
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/health":
                self._reply_json(self._health_view())
            elif path == "/api/manual":
                code, body = _json(self._manual_view())
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/plan":
                # the asset plan, evaluated against a snapshot (default: the newest)
                d = qs.get("date", [None])[0] or None
                code, body = _json(plan.analyze(d))
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/history":
                days = int(qs.get("days", ["0"])[0] or 0) or None
                code, body = _json(storage.get_history(days))
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/tokens":
                d = qs.get("date", [None])[0] or storage.get_latest_snapshot()
                d = d["date"] if isinstance(d, dict) else d
                code, body = _json({"date": d, "tokens": storage.get_tokens(d),
                                    "labels": assetlabels.known_labels(),
                                    "label_names": assetlabels.label_names(),
                                    "builtin_labels": list(assetlabels.BUILTIN_LABELS) + [assetlabels.DEFAULT_LABEL]})
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/status":
                code, body = _json(dict(_refresh_state))
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/snapshots":
                code, body = _json(storage.get_snapshot_dates())
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/labels":
                code, body = _json(self._stablecoins_view())
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/blacklist":
                code, body = _json(self._blacklist_view())
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/sources":
                # secrets are masked unless the caller explicitly asks to reveal
                reveal = (qs.get("reveal") or ["0"])[0] in ("1", "true")
                cfg = sources.load()
                code, body = _json({
                    "file": sources.sources_file(),
                    "config": cfg if reveal else sources.mask_config(cfg),
                    "masked": not reveal,
                    "last_ok": sources.failover_state(),
                    "status": status.get_status(),
                })
                self._reply(code, body, "application/json; charset=utf-8")
```

</details>

**依据 3 · 源码核查**：[tracker/server.py:178-189](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/server.py#L178-L189)

当前固定版本复核。export 返回原始 sources.load()

<details>
<summary>查看原文（12行）</summary>

```text
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/config/export":
                code, body = _json(self._config_export())
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/profiles":
                code, body = _json(self._profiles_view())
                self._reply(code, body, "application/json; charset=utf-8")
            else:
                self._reply(404, json.dumps({"error": "not found"}).encode(), "application/json")
        except Exception as e:  # noqa: BLE001
            self._reply(500, json.dumps({"error": f"{type(e).__name__}: {e}"}).encode(),
                        "application/json")
```

</details>

**依据 4 · 源码核查**：[tracker/server.py:207-242](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/server.py#L207-L242)

当前固定版本复核。栅栏只给写侧使用

<details>
<summary>查看原文（36行）</summary>

```text
            sources.save(src)
        wallets = (cfg or {}).get("wallets")
        if isinstance(wallets, list):
            walletstore.save_all(wallets)
        blacklist_entries = (cfg or {}).get("blacklist")
        if isinstance(blacklist_entries, list):
            bl.save_all(blacklist_entries)
        stable_rules = (cfg or {}).get("stablecoins")
        if isinstance(stable_rules, list):
            assetlabels.save_all(stable_rules)
        sources.reset_failover()
        return self._config_export()

    def _write_guard(self, is_post):
        """Reject cross-site writes; returns an error string, or None when allowed.

        A browser lets a page issue a "simple" cross-site POST (text/plain, or a
        form encoding) to a loopback URL with no CORS preflight: the attacker
        cannot read the response, but the side effect still runs. The same applies
        to a GET with side effects, which is reachable from a bare <img> tag. Two
        independent fences:

          * Sec-Fetch-Site is set by the browser itself and page script cannot
            forge it, so `cross-site` is refused outright.
          * If an Origin is present it must match the Host we were reached on.

        Non-browser callers (curl, the scheduler, tests) send neither header and
        pass both checks, which is what keeps the CLI usable.
        """
        if (self.headers.get("Sec-Fetch-Site") or "").strip().lower() == "cross-site":
            return "cross-site request refused"
        origin = (self.headers.get("Origin") or "").strip()
        if origin:
            host = (self.headers.get("Host") or "").strip()
            if origin == "null":
                # opaque origin: sandboxed iframe / data: document / file:// page
```

</details>

**依据 5 · 源码核查**：[tracker/sources.py:244-290](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/sources.py#L244-L290)

当前固定版本复核。默认 mask 但 reveal 可解除

<details>
<summary>查看原文（47行）</summary>

```text
# GET /api/sources used to hand the raw API keys to the browser, so anything that
# could reach the loopback port (another local process, a log dump, a screenshot)
# saw them in the clear. The API now returns a masked stub by default and reveals
# only on an explicit request. The stub keeps a 4-char prefix/suffix so the UI can
# still show WHICH key is configured, and merge_masked guarantees a stub is never
# written back over the real key.
# ————————————————————————————————————————————————————————————————
MASK = "\u2026"                                   # …
_SECRET_KEYS = ("key", "secret", "api_key", "apikey", "password", "token")
# secrets embedded in a URL query, e.g. https://host/?api-key=<uuid>
_SECRET_IN_URL = re.compile(r"([?&](?:api[-_]?key|apikey|key|token)=)([^&\s]+)", re.I)


def mask_secret(value):
    """Recognisable stub for a secret: 'cdd7…8e1e', or a bare '…' when short."""
    v = "" if value is None else str(value)
    if not v:
        return ""
    if len(v) <= 8:
        return MASK
    return v[:4] + MASK + v[-4:]


def is_masked(value):
    return MASK in str(value if value is not None else "")


def mask_url(value):
    """Mask the secret part of a URL query string, leaving the rest readable."""
    return _SECRET_IN_URL.sub(lambda m: m.group(1) + mask_secret(m.group(2)), str(value))


def mask_config(cfg):
    """Deep copy of the config with every API key / secret replaced by a stub."""
    if isinstance(cfg, dict):
        out = {}
        for k, v in cfg.items():
            if isinstance(v, (dict, list)):
                out[k] = mask_config(v)
            elif isinstance(v, str):
                out[k] = mask_secret(v) if k.lower() in _SECRET_KEYS else mask_url(v)
            else:
                out[k] = v
        return out
    if isinstance(cfg, list):
        return [mask_config(v) for v in cfg]
    return cfg
```

</details>

#### 缺口

- 目标部署网络拓扑、主机访问控制与浏览器策略未核
  **影响**：不能推断已遭泄露或公网暴露
  **进一步探讨**：限制绑定/访问并在隔离机测本地及 LAN 未授权读取

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 汇总数字是否在失败或黑名单场景保持一致？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

CEX 合成时 tokens 使用 filter_rows(res[rows])，但同一个 obj.total_usd 却从未过滤的 res[rows] 求和；result.total_usd 也累加该值。SQLite 原始 snapshot 与 snapshots 日期列表因此可能高于过滤后 tokens 合计，违背作者“黑名单同步剔除总额”的承诺。UI 的 view_of 会按过滤后 token 重新求钱包/总体，这能修正展示视图，却不能消除底层原始快照/日期列表的差异。来源失败行写 0 美元错误 token 并标 error，应保留错误提示，不能将 0 当真实空仓。未用 CEX 黑名单样本运行验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:36-42](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/README.zh.md#L36-L42)

当前固定版本复核。作者承诺黑名单剔除总额与趋势

```text
### 二、链上浏览器看不到的"隐形资产"

有些钱是真的看不见：Solana 的原生质押账户（`getParsedStakeAccounts` 会漏）、Hyperliquid L1 的质押 HYPE 和现货、交易所的理财/资金账户——这些都不是普通 SPL/ERC20 代币，普通工具根本读不到。

**这个插件专门把它们挖出来，全部计价进总资产**——包括上面的账户里质押的 12.1 SOL、Hyperliquid 上质押的约 318 枚 HYPE。

### 三、空气币和钓鱼代币把数字搞得虚高
```

**依据 2 · 源码核查**：[tracker/portfolio.py:249-267](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/portfolio.py#L249-L267)

当前固定版本复核。CEX 过滤 tokens 但原始 rows 求 total 并累计

<details>
<summary>查看原文（19行）</summary>

```text
    for res in cex_results:
        acc = res["account"]
        obj = {"wallet": acc["name"], "address": str(acc.get("exchange") or ""),
               "type": "cex", "storage": "cex", "tokens": filter_rows(res["rows"]),
               "total_usd": round(sum(r["usd"] for r in res["rows"]), 2),
               "error": res["error"], "notes": res.get("notes") or []}
        if res["error"]:
            obj["tokens"] = [{"wallet": acc["name"], "chain": str(acc.get("exchange") or "cex"),
                              "symbol": "CEX-Error", "name": res["error"],
                              "amount": 0, "price": 0, "usd": 0.0, "logo": "",
                              "token_id": f"cex-err-{acc['name']}"}]
        for r in obj["tokens"]:
            if r.get("usd"):
                result["by_chain"][r["chain"]] = round(result["by_chain"].get(r["chain"], 0.0) + r["usd"], 2)
        wallet_objs.append(obj)

    for wo in wallet_objs:
        wo["tokens"] = sorted(wo["tokens"], key=lambda r: -r["usd"])
        result["total_usd"] = round(result["total_usd"] + wo["total_usd"], 2)
```

</details>

**依据 3 · 源码核查**：[tracker/storage.py:103-114](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/storage.py#L103-L114)

当前固定版本复核。原始总值写入 SQLite

<details>
<summary>查看原文（12行）</summary>

```text
def save_snapshot(data):
    """Upsert today's snapshot (last result of the day wins) + detail rows."""
    with _lock:
        conn = _connect()
        try:
            date = data["date"]
            now = datetime.now().isoformat(timespec="seconds")
            conn.execute(
                "INSERT OR REPLACE INTO snapshots(date, created_at, total_usd, by_chain, raw) "
                "VALUES (?,?,?,?,?)",
                (date, now, data.get("total_usd", 0.0),
                 json.dumps(data.get("by_chain", {})), json.dumps(data, ensure_ascii=False)),
```

</details>

**依据 4 · 源码核查**：[tracker/storage.py:167-173](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/storage.py#L167-L173)

当前固定版本复核。日期列表读原始总值

```text
def get_snapshot_dates():
    with _lock:
        conn = _connect()
        try:
            rows = conn.execute("SELECT date, created_at, total_usd FROM snapshots ORDER BY date").fetchall()
            return [dict(r) for r in rows]
        finally:
```

**依据 5 · 源码核查**：[tracker/views.py:13-47](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/views.py#L13-L47)

当前固定版本复核。读取视图按过滤 token 重算

<details>
<summary>查看原文（35行）</summary>

```text
def view_of(snap, storage_map=None):
    """`storage_map` is {wallet name: hot|cold} from the live wallet list.

    How a wallet is held is a property of the wallet, not a market fact, so the
    live setting wins over whatever the snapshot recorded: marking a wallet cold in
    Settings must move the health panel straight away instead of waiting for the
    next refresh. The snapshot's own value stays as the fallback, which is what
    keeps the class of a wallet that has since been removed.
    """
    # Manually registered positions (tracker/manual.py) count on the snapshot's own
    # date and later — registering one today must not rewrite last month's history.
    manual_by_wallet = manual.by_wallet(snap.get("date"))
    wallets = []
    total = 0.0
    by_chain = {}
    seen = set()
    for w in snap.get("wallets", []):
        name = w.get("wallet") or w.get("name", "")
        seen.add(name)
        # a manual row is subject to the same blacklist as a fetched one
        tokens = [t for t in w.get("tokens", []) if not is_blacklisted(t)]
        tokens += [t for t in manual_by_wallet.get(name, []) if not is_blacklisted(t)]
        wt = round(sum(float(t.get("usd", 0.0)) for t in tokens), 2)
        total += wt
        for t in tokens:
            c = t.get("chain") or ""
            if t.get("usd"):
                by_chain[c] = round(by_chain.get(c, 0.0) + float(t["usd"]), 2)
        wallets.append({"wallet": name,
                        "address": w.get("address", ""), "type": w.get("type", ""),
                        # a wallet that failed to fetch must be markable in the UI:
                        # without this an error reads as "this wallet holds nothing"
                        "error": w.get("error") or None,
                        "notes": w.get("notes") or [],
                        # storage class (cold/hot/cex) drives the health report; a
```

</details>

**依据 6 · 源码核查**：[tracker/portfolio.py:255-259](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/portfolio.py#L255-L259)

当前固定版本复核。CEX 错误行零值且有 error

```text
        if res["error"]:
            obj["tokens"] = [{"wallet": acc["name"], "chain": str(acc.get("exchange") or "cex"),
                              "symbol": "CEX-Error", "name": res["error"],
                              "amount": 0, "price": 0, "usd": 0.0, "logo": "",
                              "token_id": f"cex-err-{acc['name']}"}]
```

#### 缺口

- CEX 黑名单触发频率与仪表盘调用日期列表方式未测
  **影响**：不能量化受影响金额或所有 UI 展示
  **进一步探讨**：做 CEX 黑名单夹具，比较刷新响应、DB、快照列表、历史与 UI

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 安装维护成本与财务使用风险是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要适配 DSH/Node 预发布线、Python 3.9+ 与 requests/PyNaCl，并持续访问多个链/行情/交易所 API。作者提供 npm、tarball、GitHub 安装，但可达性和 API 免费额度本轮未查；DeBank Pro 有付费选项，其他源的可用性/政策可能变化。每次刷新可能耗十余秒，服务给 HTTP 刷新 60 秒冷却、运行线程与定时每日刷；密钥由本地 sources/profile 文件保管，主机备份和权限是采用成本。只有把它当辅助观察工具并先对账/审视暴露范围才适合试用。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:95-153](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/README.zh.md#L95-L153)

当前固定版本复核。作者安装和依赖说明

<details>
<summary>查看原文（59行）</summary>

````text
## 安装

### 依赖前提

- **`dsh` `0.1.1-rc.2`**（同一预发布线内的兼容版本）与 **Node `^22.19.0 || >=24.0.0`** —— 即 DSH 自身声明的区间。
- **Python 3.9+**，并安装两个 pip 包：

  ```sh
  pip3 install requests pynacl
  ```

  两者都是普通运行时依赖，**没有**随包 vendored —— 这样 pip 才能按你的平台/版本挑到正确的构建。

### 从 npm 安装（推荐）

装的是预构建产物，**不需要任何 build 授权**：

```sh
dsh plugin --profile demo add dsh-crypto-portfolio
dsh --profile demo
```

### 从 tarball 安装（离线 / 内网）

```sh
pnpm pack                                    # 生成 dsh-crypto-portfolio-0.1.0.tgz
dsh plugin --profile demo add ./dsh-crypto-portfolio-0.1.0.tgz
```

### 从 GitHub 安装

```sh
dsh plugin --profile demo add github:0xRabit/dsh-crypto-portfolio#<commit-sha>
```

本包是纯 JavaScript + Python，**没有任何构建步骤**，`prepare` 是空操作，因此 pnpm **不需要**你给 build 脚本放行 —— 这一点比那些以 TypeScript 源码分发的插件摩擦更小。不过仍**建议 pin 一个 commit SHA**，避免之后的推送悄悄改变你机器上执行的代码。

### 启动前先验证层是否生效

```sh
dsh --profile demo --dump-config      # 应能看到： # == dsh-crypto-portfolio
```

**看不到这一行 = bundle 没有激活**（包只被当成普通依赖装了进去）。重新 `add` 并留意它打印的警告。

### 覆盖端口

patch 会**整体替换**某一行的 `config`，所以必须把你需要的键全部写全。放到 `$DSH_HOME/profiles/demo/cordis.patch.yml`：

```yaml
- id: portfolio-tracker
  name: dsh-crypto-portfolio
  config:
    port: 8199
    host: 127.0.0.1
```

也可以设环境变量 `PORTFOLIO_PORT`。

````

</details>

**依据 2 · 源码核查**：[index.js:14-33](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/index.js#L14-L33)

当前固定版本复核。Python 与 profile 路径

<details>
<summary>查看原文（20行）</summary>

```text

const ROOT = dirname(fileURLToPath(import.meta.url))
const PYTHON = process.env.PORTFOLIO_PYTHON || 'python3'

/** Where the profiles (wallets, keys, snapshot DB) live.
 *
 * Inside the package by default, but an installed plugin MUST keep them outside:
 * `dsh plugin add`/update runs pnpm, which replaces the package directory — data
 * kept there is gone after an update. So when this file sits under node_modules and
 * no directory was configured, fall back to the DSH home instead of silently
 * storing a user's portfolio in a cache directory.
 */
function resolveDataDir(config) {
  const configured = (config && config.dataDir) || process.env.PORTFOLIO_PROFILES_DIR
  if (configured) return configured.replace(/^~(?=\/)/, process.env.HOME || '~')
  if (ROOT.includes(`${'node_modules'}`)) {
    const home = process.env.DSH_HOME || join(process.env.HOME || '.', '.dsh')
    return join(home, 'storages', 'crypto-portfolio')
  }
  return join(ROOT, 'profiles')
```

</details>

**依据 3 · 源码核查**：[tracker/server.py:42-48](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/server.py#L42-L48)

当前固定版本复核。刷新成本与冷却注释

```text
_state_lock = threading.Lock()

# A full fetch hits DeBank/Binance/CoinGecko and takes tens of seconds. Without a
# floor, anything that can reach this port (including a cross-site page, see
# _write_guard) could loop refresh and burn the upstream API quotas.
REFRESH_COOLDOWN_SECONDS = float(os.environ.get("PORTFOLIO_REFRESH_COOLDOWN", "60"))
_last_refresh_at = 0.0
```

**依据 4 · 源码核查**：[tracker/server.py:516-534](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/server.py#L516-L534)

当前固定版本复核。60秒默认冷却

<details>
<summary>查看原文（19行）</summary>

```text
                        for i, e in enumerate(bl.user_entries())]
        return {"entries": config_entries + user_entries,
                "file": bl.blacklist_file()}

    def _manual_view(self):
        """Hand-registered protocol positions + the wallets they may attach to."""
        positions = manual.positions()
        return {"positions": positions,
                "wallets": manual.wallet_names(),
                "total": manual.total(),
                "today": __import__("datetime").date.today().isoformat(),
                "file": manual.manual_file()}

    def _health_view(self):
        thresholds = healthconfig.load()
        return {"thresholds": thresholds, "defaults": healthconfig.defaults(),
                "file": healthconfig.health_file(),
                "note": "percent of the portfolio; storage is inverted (safe > warning)"}

```

</details>

**依据 5 · 源码核查**：[tracker/server.py:633-660](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/server.py#L633-L660)

当前固定版本复核。定时线程与服务

<details>
<summary>查看原文（28行）</summary>

```text
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        try:
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def _serve_file(self, name, subdir=None):
        root = subdir or _STATIC
        if ".." in name or name.startswith("/"):
            self._reply(403, b"forbidden", "text/plain")
            return
        fp = os.path.join(root, name)
        if not os.path.isfile(fp):
            self._reply(404, b"not found", "text/plain")
            return
        ext = os.path.splitext(fp)[1].lower()
        with open(fp, "rb") as f:
            self._reply(200, f.read(), MIME.get(ext, "application/octet-stream"))


_scheduler_stop = threading.Event()


def _run_scheduled(profile):
```

</details>

**依据 6 · 源码核查**：[tracker/sources.py:26-112](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/sources.py#L26-L112)

当前固定版本复核。多来源配置含付费 DeBank Pro

<details>
<summary>查看原文（87行）</summary>

```text
_DEFAULTS = {
    "debank": {
        "enabled": True,
        "chain_list_url": "https://api.debank.com/chain/list",
        "providers": [
            {"name": "debank-pro", "type": "pro", "key": "",
             "base_url": "https://pro-openapi.debank.com", "paid": True, "enabled": True},
            {"name": "debank-public", "type": "public", "key": "",
             "base_url": "https://api.debank.com", "paid": False, "enabled": True},
        ],
    },
    "btc": {
        "enabled": True,
        "providers": [
            {"name": "blockchain.info", "type": "batch",
             "url": "https://blockchain.info/balance", "enabled": True},
            {"name": "mempool.space", "type": "per_address",
             "url": "https://mempool.space/api/address/{addr}", "enabled": True},
        ],
    },
    "doge": {
        "enabled": True,
        "providers": [
            {"name": "blockcypher", "type": "per_address",
             "url": "https://api.blockcypher.com/v1/doge/main/addrs/{addr}/balance", "enabled": True},
        ],
    },
    "ada": {
        "enabled": True,
        "providers": [
            {"name": "koios", "type": "batch",
             "url": "https://api.koios.rest/api/v1/address_info",
             "stake_url": "https://api.koios.rest/api/v1/account_info", "enabled": True},
        ],
    },
    "prices": {
        "enabled": True,
        "providers": [
            {"name": "coingecko", "type": "batch",
             "url": "https://api.coingecko.com/api/v3/simple/price", "key": "", "enabled": True},
            {"name": "binance", "type": "batch",
             "url": "https://api.binance.com/api/v3/ticker/price", "enabled": True},
            {"name": "coinbase", "type": "per_pair",
             "url": "https://api.coinbase.com/v2/prices/{pair}-USD/spot", "enabled": True},
            {"name": "okx", "type": "per_pair",
             "url": "https://www.okx.com/api/v5/market/ticker", "enabled": True},
        ],
    },
    "solana": {
        "enabled": True,
        "rpc": [
            {"name": "mainnet-beta", "url": "https://api.mainnet-beta.solana.com", "enabled": True},
            {"name": "ankr-public", "url": "https://rpc.ankr.com/solana", "enabled": True},
        ],
        "spl_prices": {
            "providers": [
                {"name": "dexscreener", "type": "batch",
                 "url": "https://api.dexscreener.com/latest/dex/tokens/{mints}", "enabled": True},
                {"name": "coingecko", "type": "per_mint",
                 "url": "https://api.coingecko.com/api/v3/simple/token_price/solana",
                 "key": "", "enabled": True},
            ],
        },
        "birdeye": {
            "enabled": False,
            "key": "",
            "url": "https://public-api.birdeye.so/defi/wallet_tokens",
        },
    },
    "hyperliquid": {
        "enabled": True,
        "providers": [
            {"name": "api.hyperliquid.xyz", "url": "https://api.hyperliquid.xyz/info", "enabled": True},
            {"name": "hyperliquid-api.mainnet", "url": "https://hyperliquid-api.mainnet.hyperliquid.xyz/info", "enabled": True},
        ],
    },
    "etherscan": {
        "enabled": True,
        "api_key": "",
        "chains": ["eth"],
    },
    "cex": {
        "enabled": True,
        "accounts": [],
    },
}

```

</details>

#### 缺口

- 真实 API 额度/费用、目标环境安装与密钥文件权限未核
  **影响**：不能给费用估计或金融决策可用性结论
  **进一步探讨**：在隔离环境核依赖、API 成本、数据目录权限与对账误差

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 怎样把资产数字与敏感配置提升到可审计水平？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证方向：敏感 GET 默认仅返回脱敏数据，原始导出/reveal 需本机显式认证或离线 CLI；Host 绑定限制与认证覆盖读写。对每个钱包/来源记录采集时间、完整度与失败状态，CEX 汇总先过滤再求原始快照总额，使 SQLite、日期列表和视图一致；建立对账夹具覆盖黑名单、源故障、跨 Profile、保留和恢复。采用前建议优先处理敏感配置读取及数值不一致，再谈总资产决策用途。这些均是提议而非当前能力。

#### 证据与依据

**依据 1 · 源码核查**：[tracker/server.py:147-168](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/server.py#L147-L168)

当前固定版本复核。敏感 GET 暴露点

<details>
<summary>查看原文（22行）</summary>

```text
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/status":
                code, body = _json(dict(_refresh_state))
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/snapshots":
                code, body = _json(storage.get_snapshot_dates())
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/labels":
                code, body = _json(self._stablecoins_view())
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/blacklist":
                code, body = _json(self._blacklist_view())
                self._reply(code, body, "application/json; charset=utf-8")
            elif path == "/api/sources":
                # secrets are masked unless the caller explicitly asks to reveal
                reveal = (qs.get("reveal") or ["0"])[0] in ("1", "true")
                cfg = sources.load()
                code, body = _json({
                    "file": sources.sources_file(),
                    "config": cfg if reveal else sources.mask_config(cfg),
                    "masked": not reveal,
                    "last_ok": sources.failover_state(),
```

</details>

**依据 2 · 源码核查**：[tracker/portfolio.py:249-267](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/portfolio.py#L249-L267)

当前固定版本复核。CEX 汇总差异点

<details>
<summary>查看原文（19行）</summary>

```text
    for res in cex_results:
        acc = res["account"]
        obj = {"wallet": acc["name"], "address": str(acc.get("exchange") or ""),
               "type": "cex", "storage": "cex", "tokens": filter_rows(res["rows"]),
               "total_usd": round(sum(r["usd"] for r in res["rows"]), 2),
               "error": res["error"], "notes": res.get("notes") or []}
        if res["error"]:
            obj["tokens"] = [{"wallet": acc["name"], "chain": str(acc.get("exchange") or "cex"),
                              "symbol": "CEX-Error", "name": res["error"],
                              "amount": 0, "price": 0, "usd": 0.0, "logo": "",
                              "token_id": f"cex-err-{acc['name']}"}]
        for r in obj["tokens"]:
            if r.get("usd"):
                result["by_chain"][r["chain"]] = round(result["by_chain"].get(r["chain"], 0.0) + r["usd"], 2)
        wallet_objs.append(obj)

    for wo in wallet_objs:
        wo["tokens"] = sorted(wo["tokens"], key=lambda r: -r["usd"])
        result["total_usd"] = round(result["total_usd"] + wo["total_usd"], 2)
```

</details>

**依据 3 · 源码核查**：[tracker/views.py:13-47](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/views.py#L13-L47)

当前固定版本复核。视图可重算总额

<details>
<summary>查看原文（35行）</summary>

```text
def view_of(snap, storage_map=None):
    """`storage_map` is {wallet name: hot|cold} from the live wallet list.

    How a wallet is held is a property of the wallet, not a market fact, so the
    live setting wins over whatever the snapshot recorded: marking a wallet cold in
    Settings must move the health panel straight away instead of waiting for the
    next refresh. The snapshot's own value stays as the fallback, which is what
    keeps the class of a wallet that has since been removed.
    """
    # Manually registered positions (tracker/manual.py) count on the snapshot's own
    # date and later — registering one today must not rewrite last month's history.
    manual_by_wallet = manual.by_wallet(snap.get("date"))
    wallets = []
    total = 0.0
    by_chain = {}
    seen = set()
    for w in snap.get("wallets", []):
        name = w.get("wallet") or w.get("name", "")
        seen.add(name)
        # a manual row is subject to the same blacklist as a fetched one
        tokens = [t for t in w.get("tokens", []) if not is_blacklisted(t)]
        tokens += [t for t in manual_by_wallet.get(name, []) if not is_blacklisted(t)]
        wt = round(sum(float(t.get("usd", 0.0)) for t in tokens), 2)
        total += wt
        for t in tokens:
            c = t.get("chain") or ""
            if t.get("usd"):
                by_chain[c] = round(by_chain.get(c, 0.0) + float(t["usd"]), 2)
        wallets.append({"wallet": name,
                        "address": w.get("address", ""), "type": w.get("type", ""),
                        # a wallet that failed to fetch must be markable in the UI:
                        # without this an error reads as "this wallet holds nothing"
                        "error": w.get("error") or None,
                        "notes": w.get("notes") or [],
                        # storage class (cold/hot/cex) drives the health report; a
```

</details>

**依据 4 · 源码核查**：[tracker/server.py:379-416](https://github.com/0xRabit/dsh-crypto-portfolio/blob/d3edb74bef1fcb779e899c26c37b19664ecf0a9f/tracker/server.py#L379-L416)

当前固定版本复核。钱包 fetch 状态展示

<details>
<summary>查看原文（38行）</summary>

```text
                time_val = str((body or {}).get("time") or "").strip()
                # per-profile: an explicit profile lets the UI edit any profile's
                # schedule, not only the active one
                prof = str((body or {}).get("profile") or "").strip() or None
                if prof and not profiles.exists(prof):
                    raise ValueError(f"profile {prof!r} does not exist")
                self._reply_json(sched.set_schedule(enabled, time_val, prof))
            elif path == "/api/profiles":
                action = (body or {}).get("action")
                name = str((body or {}).get("name") or "").strip()
                if action == "switch":
                    if not name or not profiles.exists(name):
                        raise ValueError("profile does not exist")
                    profiles.set_active(name)
                    self._switch_profile()
                    self._reply_json(self._profiles_view())
                elif action == "create":
                    profiles.create_profile(
                        name, from_template=(body or {}).get("from_template", False),
                        copy_from=(body or {}).get("copy_from") or None)
                    self._reply_json(self._profiles_view())
                elif action == "rename":
                    new_name = str((body or {}).get("new_name") or "").strip()
                    if not new_name:
                        raise ValueError("new_name is required")
                    renamed_active = (profiles.active() == name)
                    profiles.rename_profile(name, new_name)
                    if renamed_active:
                        self._switch_profile()
                    self._reply_json(self._profiles_view())
                elif action == "delete":
                    profiles.delete_profile(name)
                    self._reply_json(self._profiles_view())
                else:
                    raise ValueError("action must be switch/create/rename/delete")
            elif path == "/api/restart":
                # the dashboard is a child of the plugin; restarting it here is the
                # same re-exec the file watcher uses, so no DSH restart is involved
```

</details>

#### 缺口

- 改进、独立对账与权限测试均未做
  **影响**：不能据此提高当前评分
  **进一步探讨**：先做最小安全/数值修复并运行隔离测试矩阵

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
