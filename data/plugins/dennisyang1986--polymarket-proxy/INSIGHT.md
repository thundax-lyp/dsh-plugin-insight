# Polymarket Proxy

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[7b21965](https://github.com/dennisyang1986/polymarket-proxy/tree/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9)

<!-- BEGIN META -->
[![GitHub ★ 146](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=146&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dennisyang1986/polymarket-proxy) [![npm 30d 679](https://img.shields.io/static/v1?label=npm+30d&message=679&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-polymarket-proxy) [![最新发布 2026-11-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-polymarket-proxy)
<!-- END META -->

> **功能**：在 DSH 内查看 Polymarket 市场与账户，提供本地交易面板和两个只读模型工具。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持一个具体整合贡献：将雷达、账户摘要和用户控制的操作面板放入DSH，同时把模型接口限定为只读。其价值是减少部分跨工具拼接，实际节时与资金执行可靠性没有得到验证。

> **主要限制**：[Q04](#research-q04) 表明订单已提交、结果未知和已成交在本地记录中没有得到可靠区分；非limit的live回执也可被标filled，超时后预算可被释放。这个缺口直接限制其作为交易台的可信度，不能用小额上限或只读模型工具覆盖。

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
  - [Q01 · 谁需要这个面板，雷达与模型工具相对手工 API 多做了什么？](#detail-section-11)
  - [Q02 · DSH 如何装入两端，凭据与HTTP请求由谁约束？](#detail-section-12)
  - [Q03 · 面板确认怎样成为订单，限额和成交回执约束在哪里？](#detail-section-13)
  - [Q04 · 超时、重启与退出能保证交易所订单和本地预算一致吗？](#detail-section-14)
  - [Q05 · 一次合格查阅或交易有哪些依赖，成本和收益能确定多少？](#detail-section-15)
  - [Q06 · 现版本是否值得把账户交易交给该面板，如何决定停止？](#detail-section-16)
  - [Q07 · 显式未知订单与持久预算账是否是更有价值的下一步？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 Polymarket 账户的 DSH 用户可在同一界面查阅市场与组合；合格结果须带时间、范围和错误。作者的官网访问场景未获得独立需求验证，见 [Q01](#research-q01)。

基线是手工读取Gamma/Data API、直接使用可信账户界面或自行调用SDK。行情、签名与撮合由上游提供，插件贡献是DSH内的交互组合，不推断全球新颖性。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 市场雷达与链接查询 | 查阅热门事件或指定市场 | 分页/筛选有范围，失败可能只有部分数据 |
| 账户组合 | 展示持仓、现金与活动 | 外部API及正确钱包，未知不能当零余额 |
| 只读模型工具 | 查询雷达与组合摘要 | 不包含模型下单/撤单能力 |
| 买入/卖出面板 | 用户确认后调用SDK | 实际回执/成交需外部核对 |
| 凭据与授权 | 保存在宿主凭据服务并配置许可 | 清本地凭据不撤链上授权/挂单 |
| 本地订单与预算 | 限制本地票面和近期订单 | 不是交易所全账户账本，存在恢复缺口 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node >=24与DSH Web、tools/webServer/credentials/connection | 加载必需 | 双端面板与宿主能力 | 不保证插件成功挂载，停止配置账户 |
| Gamma/Data API与网络 | 查阅路径必需 | 行情、持仓和活动 | 返回错误/部分扫描，不能解释为空市场 |
| 官方SDK、正确钱包与本机签名材料 | 交易路径必需 | 创建生产客户端、签名和提交 | 缺凭据/SDK则bridge不就绪 |
| Relayer及账户授权 | 首次授权按账户需要 | 配置交易许可 | 不能假设已有许可，错误需核查 |
| 可信的外部订单核对方式 | 采用前提 | 确认挂单、成交和退出 | 结果不明时停止继续提交 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户先核宿主与无凭据市场读取 | 页面和工具结果含时间、筛选及错误 |
| 加载 | DSH补丁注册宿主与client | 实际出现面板和两个只读工具 |
| 账户接入 | 用户核钱包与凭据服务，按需要授权 | 独立核账户状态，不以ready当可用性验收 |
| 用户提交 | 面板送请求、宿主校验、bridge签名 | pending只表示排队，核外部回执 |
| 异常与退出 | 用户先核挂单/成交再处理本地状态 | 超时不自动重下，logout不当撤单 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本机运行、网络和账户资源；费用未知 | 核钱包与凭据、宿主准入和授权 | 未测配置工时；读公开雷达不等于需要先交私钥 |
| 持续使用 | 轮询请求、可能模型调用及交易相关费用；未定价 | 检查行情范围、回执和本地预算 | SDK与外部服务独立失败，未测单位合格任务成本 |
| 失败恢复 | 重查盘口/订单与补偿操作的资源未知 | 人工对账迟到回执、挂单与部分成交 | 不能见failed就自动重下 |
| 退出 | 已挂外部订单及授权仍可能存在 | 先在可信账户界面对账并处理挂单，再清本地凭据 | 插件logout不撤外部订单，撤授权需另处理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 同界面查阅 | 行情扫描与两个只读工具真实接线 | 独立使用频率和时间收益 |
| 本地订单提交 | SDK签名和限额路径存在 | 实际成交与预览价一致性 |
| 状态恢复 | 有本地订单和部分限价单刷新 | 超时、重启、退出的账户级一致性 |

> **思考**：[Q04](#research-q04) 表明订单已提交、结果未知和已成交在本地记录中没有得到可靠区分；非limit的live回执也可被标filled，超时后预算可被释放。这个缺口直接限制其作为交易台的可信度，不能用小额上限或只读模型工具覆盖。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持一个具体整合贡献：将雷达、账户摘要和用户控制的操作面板放入DSH，同时把模型接口限定为只读。其价值是减少部分跨工具拼接，实际节时与资金执行可靠性没有得到验证。

[Q02](#research-q02) 的宿主/浏览器/bridge职责拆分和仅从credentials服务取值可借鉴，迁移需适配DSH的slots、connection与凭据契约。[Q04](#research-q04) 显示后台订单与本地文件没有事务对账，超时包装不是撤销。可复用的是显式只读模型面，不应复用其filled/failed映射作为资金账。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q04](#research-q04) 表明订单已提交、结果未知和已成交在本地记录中没有得到可靠区分；非limit的live回执也可被标filled，超时后预算可被释放。这个缺口直接限制其作为交易台的可信度，不能用小额上限或只读模型工具覆盖。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议先观察，不把此版本用于真实资金试用。开发者先不配置签名材料检查公开读取与宿主准入；资金链只在无资金SDK替身中验证Q04反例。遇到状态不一致先停入口，再在可信账户界面对账，见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已确认DSH双端、只读模型工具与SDK交易接线；订单状态和本地预算的一致性存在源码可见缺口。新账本设计仅为未验证假设，未执行交易或宿主验收。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、README.md、index.js、bridge.js、client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：已检查根清单、补丁、README、宿主注册/扫描/交易/持久化/退出、bridge的凭据/SDK/买卖/授权，以及client页面注册和确认调用。完整静态统计见INVENTORY；代码未全仓逐行审计，外部SDK和服务实现未审计。
- 下一步：- 已检查固定源码，未运行插件或安装SDK。
- 未配置账户、签名材料或发送交易，也未做宿主加载和网络服务验收。
- 具体SDK迟到/断电后果需Q04无资金实验，源码判断不等于已复现交易损失。

**分析版本**

- **仓库**：[dennisyang1986/polymarket-proxy](https://github.com/dennisyang1986/polymarket-proxy)
- **版本号**：1.1.0（[固定提交 7b21965](https://github.com/dennisyang1986/polymarket-proxy/tree/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9)）
- **版本日期**：2026-11-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q07](#research-q07) 提出待验证的未知订单与持久预算账，把意图登记、提交、外部对账和预算释放分开；先在无资金的可控SDK回执中检验未知状态数和人工负担，未证明可实现恰好一次交易。

- 已检查固定源码，未运行插件或安装SDK。
- 未配置账户、签名材料或发送交易，也未做宿主加载和网络服务验收。
- 具体SDK迟到/断电后果需Q04无资金实验，源码判断不等于已复现交易损失。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 7934 | 7021 | 603 | — |
| .md | source | 2 | 532 | — | — | 5339 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/dennisyang1986/polymarket-proxy/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/dennisyang1986/polymarket-proxy/issues?q=is%3Aissue+created%3A2026-10-20T03%3A16%3A38.300Z..2026-11-19T03%3A16%3A38.300Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/dennisyang1986/polymarket-proxy/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-20T03%3A16%3A38.300Z..2026-11-19T03%3A16%3A38.300Z)



统计日期：2026-11-19。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对本地交易台的具体整合增量，以及订单回执与预算恢复是否足以支持账户采用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要这个面板，雷达与模型工具相对手工 API 多做了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有 Polymarket 账户、希望在 DSH 中查阅市场和账户的用户，是作者设想的人群。合格的查阅结果应包含数据时间、筛选范围与错误，而不是把热门榜当全市场或把预测行情当投资结论。插件将 Gamma 市场扫描、账户摘要与页面操作组合成同一个工作台，两个模型工具只读，省去用户自行拼接这些 API 的部分工作。行情、签名与撮合属于上游服务和 SDK；新增贡献是 DSH 内的接线与交互，不是新的交易能力。

默认扫描六页、每页100个事件，按24小时量排序，页面数限制为1—8。单页失败会被记录并以空数组继续，其余结果仍生成缓存；因此空榜和不完整榜单不能解释为市场不存在。直接链接查询可绕过雷达筛选，这是便利，也说明关键词过滤不是访问权限。作者的官网访问摩擦尚无独立用户任务或节时对照证据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-38](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/README.md#L17-L38)

作者主张的场景与边界，属于定位而非独立需求验证。

<details>
<summary>查看原文（22行）</summary>

```text
## Why Polymarket Proxy?

Polymarket's own website is not available everywhere. The deposit page may refuse to
load, the trading UI may fail to connect a wallet, or the whole site may be blocked on
your network — while your account, your positions and Polymarket's liquidity are still
there.

Polymarket Proxy is a **local panel for DeepSeek Harness** that talks to the same public
Polymarket services directly:

- it reconstructs your **deposit address** from the public Polygon deposit history, so you
  can fund an account without the website's deposit modal;
- it signs order requests with **your own private key** through Polymarket's official CLOB
  client, so you can buy and sell without the website's trading screen;
- it keeps a **live market radar** of Polymarket's highest-volume events, so you can find
  and open a market without the website's front page.

> **Eligibility is still Polymarket's decision.** This project does not create accounts,
> bypass KYC, or change where you are. Use it only with an account you are allowed to use,
> and follow Polymarket's terms and your local laws. See [Disclaimer](#disclaimer).

## Screenshots
```

</details>

**依据 2 · 源码核查**：[index.js:1198-1221](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/index.js#L1198-L1221)

定量扫描范围、分页和失败降级。

<details>
<summary>查看原文（24行）</summary>

```text
  async function sweep(locale = marketLocale()) {
    const pages = clamp(Math.round(num(state.settings.pages) || 6), 1, 8)
    const tasks = []
    for (let page = 0; page < pages; page += 1) tasks.push(page * 100)
    const byId = new Map()
    const errors = []
    const batches = await Promise.all(
      tasks.map((offset) =>
        gamma(
          `/events?closed=false&active=true&limit=100&offset=${offset}&order=volume24hr&ascending=false&locale=${locale}`,
        ).catch((error) => {
          errors.push(shortError(error))
          return []
        }),
      ),
    )
    for (const batch of batches) {
      if (!Array.isArray(batch)) continue
      for (const event of batch) if (event?.id) byId.set(String(event.id), event)
    }
    return { events: [...byId.values()], errors }
  }

  /**
```

</details>

**依据 3 · 源码核查**：[index.js:2700-2728](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/index.js#L2700-L2728)

市场工具实际执行查询。

<details>
<summary>查看原文（29行）</summary>

```text
            'the radar list; combine with no other filter.',
        },
        limit: { type: 'number', description: 'Maximum radar rows to return (default 15, max 50).' },
        refresh: { type: 'boolean', description: 'Force a fresh Gamma sweep instead of using the cache.' },
      },
    },
    output: toolResult(),
    async execute(args) {
      if (String(args?.url ?? '').trim()) {
        const raw = String(args.url).trim()
        // Accept a link, a bare event slug, or a numeric event id.
        const found = await resolveLookup({ url: raw, slug: raw, id: /^\d+$/.test(raw) ? raw : '' })
        if (!found.found) {
          return {
            text:
              found.error === 'link-required'
                ? 'That is not a Polymarket event or market link. Pass a URL such as https://polymarket.com/event/<slug>.'
                : `Polymarket has no event or market at ${String(args.url).trim()} (it may be delisted or the link is wrong).`,
          }
        }
        const { event } = found
        const where = found.inRadar
          ? 'already in the radar list'
          : found.closed
            ? 'closed — outside the radar list'
            : 'not in the radar list'
        const lines = (event.top ?? [])
          .slice(0, 8)
          .map((market) => `- ${market.groupLabel || market.question}: ${market.sides.map((side) => `${side.label} ${(side.price * 100).toFixed(1)}¢`).join(' / ')}`)
```

</details>

**依据 4 · 源码核查**：[index.js:2787-2800](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/index.js#L2787-L2800)

组合资产工具声明只读并调用portfolio。

<details>
<summary>查看原文（14行）</summary>

```text
    name: 'polymarket_portfolio',
    description:
      'Show the Polymarket portfolio for the configured wallet: total value, cash, open positions and recent ' +
      'activity. Read-only — placing and closing orders stays with the user in the panel.',
    parameters: { type: 'object', additionalProperties: false, properties: {} },
    output: toolResult(),
    async execute() {
      const snapshotValue = await portfolio(true)
      const status = await liveStatus()
      const deposit = await depositInfo()
      const head =
        `Portfolio ${snapshotValue.configured ? '' : '(not configured) '}` +
        `total ${snapshotValue.total === null ? '—' : `$${snapshotValue.total.toFixed(2)}`} · ` +
        `positions ${snapshotValue.value === null ? '—' : `$${snapshotValue.value.toFixed(2)}`} · ` +
```

</details>

#### 缺口

- 缺少与手工API/官方页面同任务对照
  **影响**：不能量化便利是否足以抵消账户配置和故障对账
  **进一步探讨**：用同一组只读查阅问题比较正确率、人工步骤和端到端时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 如何装入两端，凭据与HTTP请求由谁约束？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

根清单的 bundle 补丁按包名装入 index.js，宿主注入 tools、webServer、credentials、connection；start 实际注册两个模型工具、HTTP前缀与轮询器。client.js 通过宿主模块返回值注册主页面和侧栏，并随locale改变界面。它是实际 DSH 双端插件，不是一个只声明工具名的独立脚本。

所有HTTP请求先调用宿主 connection.requestRejection；凭据、退出与审批等敏感端点另限制loopback。该检查依赖宿主连接服务的真实实现，源码中的可选调用本身不证明任意宿主版本均执行相同准入。订单和关闭端点只经过通用准入，没有对应loopback附加检查，部署远程Web时不能把敏感端点的限制推广到全部交易路由。

bridge只从credentials服务读取引用，明确拒绝已列出的环境/.env来源；写入失败报告credentials-unavailable。私钥在本机被SDK使用，不属于插件state.json。凭据服务的落盘和加密不由本插件实现；README称宿主保存为明文YAML，这是作者说明，未核查本次宿主实例。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:28-63](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/package.json#L28-L63)

导出、bundle/client与依赖定义。

<details>
<summary>查看原文（36行）</summary>

```text
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./locale/*.json": "./locale/*.json",
    "./icon": "./icon.svg"
  },
  "files": [
    "index.js",
    "bridge.js",
    "client.js",
    "cordis.patch.yml",
    "locale/*.json",
    "keywords.default.txt",
    "icon.svg",
    "assets",
    "README.md",
    "README.zh-CN.md",
    "screenshots.json",
    "LICENSE"
  ],
  "dsh": {
    "manifestVersion": 1,
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": []
    }
  },
  "dependencies": {
    "@polymarket/client": "^0.18.0",
    "qrcode-generator": "^1.4.4",
    "viem": "^2.57.19"
  }
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/cordis.patch.yml#L1-L3)

实际宿主挂载。

```text
- insert:
    - id: polymarket-proxy
      name: 'dsh-polymarket-proxy'
```

**依据 3 · 源码核查**：[index.js:2832-2858](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/index.js#L2832-L2858)

注册与生命周期。

<details>
<summary>查看原文（27行）</summary>

```text
  function start() {
    load()
    ctx.effect(() => ctx.tools.register(marketsTool), 'polymarket-agent markets tool')
    ctx.effect(() => ctx.tools.register(portfolioTool), 'polymarket-agent portfolio tool')
    ctx.effect(
      () => ctx.webServer.register({ kind: 'prefix', path: API_PREFIX, handler: handle }),
      'polymarket-agent routes',
    )
    ctx.effect(() => {
      const warm = setTimeout(async () => {
        await load()
        await applyHostLocalePreference()
        refresh()
          .catch((error) => ctx.logger?.warn?.(`polymarket-agent warm sweep failed: ${shortError(error)}`))
          .finally(() => scheduleSweep())
      }, 4_000)
      warm.unref?.()
      scheduleSweep()
      return () => {
        clearTimeout(warm)
        if (pollTimer) clearTimeout(pollTimer)
        pollTimer = undefined
        if (saveTimer) clearTimeout(saveTimer)
      }
    }, 'polymarket-agent poller')
  }

```

</details>

**依据 4 · 源码核查**：[client.js:4228-4269](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/client.js#L4228-L4269)

客户端slot和locale接线。

<details>
<summary>查看原文（42行）</summary>

```text
    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        translate = ctx.locale.bind(NS)
        ctx.effect(() => ctx.locale.register(NS, { zh: DICT.zh, en: DICT.en }), 'polymarket-agent locale')

        const localeSnapshot = () => {
          try {
            return ctx.locale.getLocale?.() ?? ctx.locale.getSnapshot?.()
          } catch {
            return undefined
          }
        }
        localeProbe = () => syncLocale(localeSnapshot())
        ctx.effect(() => {
          syncLocale(localeSnapshot())
          return ctx.locale.subscribe(() => syncLocale(localeSnapshot()))
        }, 'polymarket-agent market locale')
        ctx.effect(
          () =>
            ctx.slots.inject('main', () =>
              ctx.slots.register({ name: 'main', key: PANEL_ID, locale: NS }, Panel),
            ),
          'polymarket-agent page',
        )
        ctx.effect(
          () =>
            ctx.slots.inject('sidebar.panellist', () =>
              ctx.slots.register(
                {
                  name: 'sidebar.panellist',
                  id: PANEL_ID,
                  order: 16,
                  locale: NS,
                  label: () => t('panel'),
                },
                PanelIconRoot,
              ),
            ),
          'polymarket-agent panel icon',
        )
      },
```

</details>

**依据 5 · 源码核查**：[index.js:2289-2302](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/index.js#L2289-L2302)

所有HTTP先进入宿主准入检查。

<details>
<summary>查看原文（14行）</summary>

```text
  async function handle(req, res) {
    try {
      // Every panel call runs through DSH's own connection admission: Host and
      // Origin checks plus the signed browser credential. A web page open in
      // the browser therefore cannot drive the trading routes.
      const rejection = ctx.connection?.requestRejection?.(req)
      if (rejection !== undefined) {
        res.writeHead(rejection, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' })
        res.end('connection-rejected')
        return
      }
      const url = new URL(req.url ?? '/', 'http://localhost')
      const route = url.pathname.slice(API_PREFIX.length) || '/'
      const method = (req.method ?? 'GET').toUpperCase()
```

</details>

**依据 6 · 源码核查**：[index.js:2395-2410](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/index.js#L2395-L2410)

配置凭据额外loopback校验。

<details>
<summary>查看原文（16行）</summary>

```text
      if (method === 'POST' && route === '/onboarding') {
        if (!isLoopback(req)) return send(res, 403, { ok: false, error: 'loopback-only' })
        return send(res, 200, await finishOnboarding(await readBody(req)))
      }
      if (method === 'POST' && route === '/credentials') {
        if (!isLoopback(req)) return send(res, 403, { ok: false, error: 'loopback-only' })
        try {
          const body = await readBody(req)
          const result = await bridge.setCredentials({
            ...(body.privateKey ? { privateKey: body.privateKey } : {}),
            ...(body.wallet ? { wallet: body.wallet } : {}),
            ...(body.relayerKey ? { relayerKey: body.relayerKey } : {}),
            ...(body.relayerAddress ? { relayerAddress: body.relayerAddress } : {}),
          })
          quoteCache = { key: '', at: 0, value: null }
          return send(res, 200, { ...result, onboarding: await onboardingView(), live: await liveStatus(true) })
```

</details>

**依据 7 · 源码核查**：[bridge.js:193-219](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/bridge.js#L193-L219)

拒绝环境来源凭据与读取失败降级。

<details>
<summary>查看原文（27行）</summary>

```text
  /**
   * Read one reference from the provider-managed store only. The credentials
   * service can also answer from the Host environment or a `.env`; those
   * layers are rejected here so the settings panel is the sole way in.
   */
  async function stored(name) {
    const service = ctx.credentials
    if (!service || typeof service.resolve !== 'function') return undefined
    try {
      const hit = await service.resolve(name)
      if (!hit?.value) return undefined
      const source = String(hit.source ?? '')
      if (AMBIENT_CREDENTIAL_SOURCES.has(source)) {
        if (!ambientWarned.has(name)) {
          ambientWarned.add(name)
          ctx.logger?.warn?.(
            `polymarket-agent: ignoring ${name} from ${source}; save it in Settings so it lives only in the DSH credentials store`,
          )
        }
        return undefined
      }
      return { value: hit.value, source: 'credentials' }
    } catch {
      return undefined
    }
  }

```

</details>

**依据 8 · 源码核查**：[bridge.js:702-714](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/bridge.js#L702-L714)

保存前检查宿主凭据服务。

<details>
<summary>查看原文（13行）</summary>

```text
  async function setCredentials(patch) {
    const service = ctx.credentials
    if (!service || typeof service.set !== 'function') throw new Error('credentials-unavailable')
    const writes = []
    if (patch?.privateKey !== undefined) {
      const key = normalizePrivateKey(patch.privateKey)
      if (!key) throw new Error('invalid-private-key')
      writes.push([CREDENTIALS.privateKey, key])
    }
    if (patch?.wallet !== undefined) {
      const wallet = normalizeAddress(patch.wallet)
      if (!wallet) throw new Error('invalid-wallet')
      writes.push([CREDENTIALS.wallet, wallet])
```

</details>

#### 缺口

- 宿主连接准入服务在实际版本和远程部署中的契约未独立核实
  **影响**：不能把本插件的调用声明等同于访问控制已在所有环境成立
  **进一步探讨**：对目标宿主版本检查connection.requestRejection实现并在独立环境验证允许与拒绝请求。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 面板确认怎样成为订单，限额和成交回执约束在哪里？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

买入先读bridge状态，校验金额、价格、最少份数与单笔/每日限额，再把pending订单放入本地数组并异步交给SDK。每日已成交金额加本地pending/open保留金额参与预算，不是查询交易所全部账户订单的全局账。默认未配置上限为单笔100美元、每日至少100美元；向导写入caps时另有25/100的回退，不能笼统写成统一的默认25美元。

所谓市价买入实际以当前ask和用户maxPrice的较小值构造限价单，向下取份数并拒绝不足最小额，避免自动扩大票面。若SDK返回live，bridge三秒后尝试撤单；这不是原子的成交或撤销保证。限价买入可保持GTC挂单。卖出读取当前持仓并裁剪请求份数，再用SDK的placeMarketOrder和最低价提交；价格与执行能力继承SDK和盘口，不承诺预览价成交。模型工具不提供写操作，但持有浏览器连接资格的HTTP调用方不必经过模型工具。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1518-1565](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/index.js#L1518-L1565)

限额默认值与本地预算口径。

<details>
<summary>查看原文（48行）</summary>

```text
   * USD caps are owned by the panel (`settings.caps`, written by the
   * onboarding wizard). There is no `.env` or process-environment fallback:
   * an unset cap is a safe default, never an ambient surprise. There is no
   * on/off switch: a configured, approved account can order immediately.
   */
  function tradingLimits() {
    const panel = state.settings?.caps && typeof state.settings.caps === 'object' ? state.settings.caps : null
    const maxOrderUsd = positive(panel?.maxOrderUsd, 100)
    const dailyUsd = positive(panel?.dailyUsd, Math.max(maxOrderUsd, 100))
    return {
      maxOrderUsd,
      dailyUsd,
      source: {
        maxOrderUsd: panel?.maxOrderUsd !== undefined ? 'panel' : 'default',
        dailyUsd: panel?.dailyUsd !== undefined ? 'panel' : 'default',
      },
    }
  }

  function spendToday() {
    return state.spend?.date === today() ? num(state.spend?.usd) : 0
  }

  /** Add a fill to today's spend exactly once per newly matched share. */
  function addSpend(amount) {
    const value = num(amount)
    if (!(value > 0)) return
    state.spend = { date: today(), usd: Number((spendToday() + value).toFixed(4)) }
  }

  /**
   * What a live BUY still reserves against the daily cap. Limit orders reserve
   * only the unfilled remainder, so a partial fill gradually releases budget.
   */
  function remainingOrderNotional(order) {
    if (order?.kind !== 'BUY') return 0
    if (order.status !== 'pending' && order.status !== 'open') return 0
    if (order.orderType === 'limit') {
      const shares = num(order.shares)
      const filled = num(order.filledShares)
      return Math.max(0, shares - filled) * num(order.price)
    }
    return num(order.notional)
  }

  function pendingNotional() {
    return state.orders.reduce((acc, order) => acc + remainingOrderNotional(order), 0)
  }
```

</details>

**依据 2 · 源码核查**：[index.js:1875-1938](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/index.js#L1875-L1938)

买入验证、pending登记与后台执行。

<details>
<summary>查看原文（64行）</summary>

```text
  async function placeBuy({ tokenId, orderType, amountUsd, maxPrice, price, shares, title, outcome, label }) {
    await load()
    const status = await liveStatus()
    if (!status.ready) return { ok: false, error: status.reason ?? 'bridge-missing', detail: status.error }
    const caps = status.limits
    const mode = orderType === 'limit' ? 'limit' : 'market'
    const limitPrice = num(price)
    const shareCount = num(shares)
    const notional = mode === 'limit' ? Number((limitPrice * shareCount).toFixed(4)) : num(amountUsd)
    if (mode === 'limit') {
      if (!(shareCount > 0)) return { ok: false, error: 'shares-required' }
      if (!(limitPrice > 0)) return { ok: false, error: 'price-required' }
    } else if (!(notional > 0)) {
      return { ok: false, error: 'amount-required' }
    }
    if (notional > caps.maxOrderUsd + 1e-9) {
      return { ok: false, error: 'order-cap', maxOrderUsd: caps.maxOrderUsd }
    }
    // Polymarket's CLOB accepts prices below 1 only; the highest valid order
    // is one tick under settlement (0.99 / 0.999 / 0.9999). There is no
    // user-facing price cap any more; the market ticket still passes the live
    // ask as its own hard ceiling.
    const capsPrice = mode === 'limit' ? limitPrice : num(maxPrice)
    if (!(capsPrice > 0) || !(capsPrice < 1)) return { ok: false, error: 'price-required' }
    const minTicket = mode === 'limit' ? 1 : Math.max(1, 5 * capsPrice)
    if (mode === 'limit' && shareCount + 1e-9 < 5) {
      return { ok: false, error: 'below-min-size', minShares: 5 }
    }
    if (notional + 1e-9 < minTicket) {
      return { ok: false, error: 'below-min-size', minUsd: Number(minTicket.toFixed(2)) }
    }
    const spend = spendToday()
    const pending = pendingNotional()
    if (spend + pending + notional > caps.dailyUsd + 1e-9) {
      return { ok: false, error: 'daily-cap', spentToday: spend, pending, dailyUsd: caps.dailyUsd }
    }
    const record = {
      id: `ord-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      kind: 'BUY',
      orderType: mode,
      at: new Date().toISOString(),
      tokenId: String(tokenId),
      title: String(title ?? ''),
      label: String(label ?? ''),
      outcome: outcome === 'YES' ? 'YES' : outcome === 'NO' ? 'NO' : 'SIDE',
      price: mode === 'limit' ? limitPrice : capsPrice,
      shares: mode === 'limit' ? shareCount : null,
      filledShares: 0,
      notional,
      status: 'pending',
      ok: false,
    }
    pushRecord(record)
    const task =
      mode === 'limit'
        ? () => bridge.buyLimit({ tokenId: String(tokenId), price: limitPrice, shares: shareCount })
        : () =>
            bridge.buy({ tokenId: String(tokenId), amountUsd: notional, maxPrice: capsPrice })
    runOrder(record, task).catch((error) =>
      ctx.logger?.warn?.(`polymarket-agent buy failed: ${shortError(error)}`),
    )
    return { ok: true, pending: true, record }
  }

```

</details>

**依据 3 · 源码核查**：[bridge.js:355-409](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/bridge.js#L355-L409)

市价型买入以限价单实现及三秒撤单。

<details>
<summary>查看原文（55行）</summary>

```text
  async function buy({ tokenId, amountUsd, maxPrice }) {
    const cfg = await config()
    const client = await getClient(cfg)
    const book = await withTimeout(client.fetchOrderBook({ assetId: String(tokenId) }), 'order-book')
    const tick = Number(book?.tickSize) || 0.01
    const minSize = Number(book?.minOrderSize) || 5
    const ask = bestAskOf(book)
    if (!(ask > 0 && ask < 1)) throw new Error('no-ask')
    const ceiling = Number(maxPrice) > 0 ? Number(maxPrice) : 1 - tick
    const limit = roundPriceToTick(Math.min(ceiling, ask), tick)
    const rawSize = Number(amountUsd) / limit
    // Reject rather than silently bumping to the 5-share floor: the ticket the
    // user confirmed must not spend more than its amount.
    if (!(rawSize >= minSize - 1e-9)) {
      throw new Error(`below-min-size:${Number((minSize * limit).toFixed(2))}`)
    }
    const size = Math.max(minSize, Math.floor(rawSize * 100 + 1e-9) / 100)
    const notional = Number((size * limit).toFixed(4))
    if (notional < 1 - 1e-9 || notional > Number(amountUsd) + 0.011) throw new Error('below-min-size')

    const signed = await withTimeout(
      client.createLimitOrder({
        assetId: String(tokenId),
        side: 'BUY',
        price: String(limit),
        size: String(size),
      }),
      'sign-order',
    )
    const response = await withTimeout(client.postOrder(signed), 'post-order')
    const ok = Boolean(response?.ok)
    // The taker order should fill or die fast; keep a stale resting bid from
    // sitting on the book after the ask moved away.
    if (ok && response.status === 'live') {
      const orderId = response.orderId
      const timer = setTimeout(() => {
        client
          .cancelOrder({ orderId })
          .catch((error) => ctx.logger?.warn?.(`polymarket-agent: cancel failed: ${shortError(error)}`))
      }, 3000)
      timer.unref?.()
    }
    return {
      ok,
      price: limit,
      size,
      notional,
      orderId: response?.orderId ?? null,
      status: response?.status ?? (ok ? 'filled' : 'failed'),
      error: ok ? undefined : shortError(response?.message ?? response?.code ?? 'order-rejected'),
    }
  }

  /**
   * Sign and submit a GTC BUY at an explicit limit price. A limit at or above
```

</details>

**依据 4 · 源码核查**：[bridge.js:414-468](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/bridge.js#L414-L468)

GTC型限价单和即时回执映射。

<details>
<summary>查看原文（55行）</summary>

```text
  async function buyLimit({ tokenId, price, shares }) {
    const cfg = await config()
    const client = await getClient(cfg)
    const requestedPrice = Number(price)
    const requestedSize = Number(shares)
    if (!(requestedPrice > 0)) throw new Error('price-required')
    if (!(requestedSize > 0)) throw new Error('shares-required')

    const book = await withTimeout(client.fetchOrderBook({ assetId: String(tokenId) }), 'order-book')
    const tick = Number(book?.tickSize) || 0.01
    const minSize = Number(book?.minOrderSize) || 5
    const limit = roundPriceToTick(requestedPrice, tick)
    const size = Math.floor(requestedSize * 100 + 1e-9) / 100
    if (!(limit > 0 && limit < 1)) throw new Error('price-required')
    if (!(size > 0)) throw new Error('shares-required')
    if (size + 1e-9 < minSize) {
      throw new Error(`below-min-size:${Number((minSize * limit).toFixed(2))}`)
    }
    const notional = Number((size * limit).toFixed(4))
    if (notional < 1 - 1e-9) {
      throw new Error(`below-min-size:${Number((1 / limit).toFixed(2))}`)
    }

    const signed = await withTimeout(
      client.createLimitOrder({
        assetId: String(tokenId),
        side: 'BUY',
        price: String(limit),
        size: String(size),
      }),
      'sign-order',
    )
    const response = await withTimeout(client.postOrder(signed), 'post-order')
    const ok = Boolean(response?.ok)
    const resting = ok && (response.status === 'live' || response.status === 'delayed')
    // `takingAmount` is the taker asset received at placement, i.e. shares for
    // a BUY. Use it when present so a partially matched crossing limit does not
    // get recorded as a full fill.
    const matchedShares = ok && !resting ? Number(response?.takingAmount) : 0
    const filledSize = ok && !resting
      ? matchedShares > 0
        ? Math.min(size, matchedShares)
        : size
      : 0
    return {
      ok,
      orderType: 'limit',
      price: limit,
      size,
      filledSize,
      remainingSize: Number((size - filledSize).toFixed(4)),
      notional,
      orderId: response?.orderId ?? null,
      status: ok ? (resting ? 'live' : 'matched') : 'failed',
      error: ok ? undefined : shortError(response?.message ?? response?.code ?? 'order-rejected'),
```

</details>

**依据 5 · 源码核查**：[index.js:1975-2006](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/index.js#L1975-L2006)

卖出从实际持仓校验并提交。

<details>
<summary>查看原文（32行）</summary>

```text
  async function placeClose({ tokenId, shares }) {
    await load()
    const status = await liveStatus()
    if (!status.ready) return { ok: false, error: status.reason ?? 'bridge-missing', detail: status.error }
    let amount = num(shares)
    if (amount <= 0) return { ok: false, error: 'shares-required' }
    const snapshot = await portfolio(true)
    const holding = snapshot.positions.find((position) => position.tokenId === String(tokenId))
    if (!holding) return { ok: false, error: 'position-missing' }
    if (holding.redeemable) return { ok: false, error: 'position-redeemable' }
    if (amount > holding.size + 1e-6) amount = holding.size
    const record = {
      id: `ord-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      kind: 'SELL',
      at: new Date().toISOString(),
      tokenId: String(tokenId),
      title: holding.title,
      label: holding.outcome,
      outcome: 'SELL',
      price: holding.currentPrice,
      shares: Number(amount.toFixed(4)),
      notional: Number((amount * holding.currentPrice).toFixed(4)),
      status: 'pending',
      ok: false,
    }
    pushRecord(record)
    runOrder(record, () => bridge.sell({ tokenId: String(tokenId), shares: amount })).catch((error) =>
      ctx.logger?.warn?.(`polymarket-agent close failed: ${shortError(error)}`),
    )
    return { ok: true, pending: true, record }
  }

```

</details>

**依据 6 · 源码核查**：[bridge.js:514-544](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/bridge.js#L514-L544)

SDK市价卖出与最低价约束。

<details>
<summary>查看原文（31行）</summary>

```text
  async function sell({ tokenId, shares }) {
    const cfg = await config()
    const client = await getClient(cfg)
    const amount = Number(shares)
    if (!(amount > 0)) throw new Error('shares-required')
    const book = await withTimeout(client.fetchOrderBook({ assetId: String(tokenId) }), 'order-book')
    const tick = Number(book?.tickSize) || 0.01
    const bid = bestBidOf(book)
    if (!(bid > 0)) throw new Error('no-bid')
    const floor = roundPriceToTick(bid * (1 - SELL_SLIPPAGE), tick)
    const response = await withTimeout(
      client.placeMarketOrder({
        assetId: String(tokenId),
        side: 'SELL',
        shares: amount,
        minPrice: String(Math.max(tick, floor)),
      }),
      'sell-order',
      60_000,
    )
    const ok = Boolean(response?.ok)
    return {
      ok,
      price: bid,
      size: amount,
      notional: Number((amount * bid).toFixed(4)),
      orderId: response?.orderId ?? null,
      status: response?.status ?? (ok ? 'filled' : 'failed'),
      error: ok ? undefined : shortError(response?.message ?? response?.code ?? 'order-rejected'),
    }
  }
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 超时、重启与退出能保证交易所订单和本地预算一致吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能。这里的关键问题不是请求能否送出，而是送出后结果未知时是否仍被正确记账。withTimeout用Promise.race返回超时，没有中止原SDK请求；runOrder捕获该错误就记failed，failed订单不再保留预算。若交易所已经收单但回复迟到，插件缺少持久的未知状态和按稳定订单身份恢复对账的通路。源码足以确认这种状态表达缺口，未执行故障实验，不能声称实际发生过重复成交。

另一处直接可见的不一致是非limit买入收到ok但status=live时，bridge只安排稍后撤单，runOrder却因!isLimit把记录记filled，并可能按全部份数计入支出。稍后撤单结果没有回写该记录；界面显示已成交不能单独作为撮合证据。

本地订单/预算用400ms防抖写state.json，直接writeFile而非原子替换；写失败只记日志。进程在持久化前退出可丢记录，重启超过五分钟的pending被转failed，没有查询交易所。logout清凭据与本地订单/支出，明确不取消外部挂单。故退出不是撤回，重新配置后的本地每日预算也不代表账户已花金额。

#### 证据与依据

**依据 1 · 源码核查**：[bridge.js:102-110](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/bridge.js#L102-L110)

超时仅竞争Promise，不取消SDK操作。

```text
function withTimeout(promise, label, ms = CALL_TIMEOUT_MS) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label}-timeout`)), ms)
    timer.unref?.()
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

```

**依据 2 · 源码核查**：[index.js:1765-1800](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/index.js#L1765-L1800)

runOrder状态映射、非limit成交标记和错误处理。

<details>
<summary>查看原文（36行）</summary>

```text
  async function runOrder(record, task) {
    try {
      const result = await task()
      const ok = Boolean(result.ok)
      const isLimit = record.orderType === 'limit'
      const resting = ok && isLimit && (result.status === 'live' || result.status === 'delayed')
      const shares = num(result.size ?? record.shares)
      const filledShares = ok
        ? Math.min(shares || Infinity, num(result.filledSize ?? (resting ? 0 : shares)))
        : 0
      const fullyFilled = ok && !resting && (!(shares > 0) || filledShares + 1e-9 >= shares)
      record.ok = ok
      record.price = num(result.price ?? record.price)
      record.shares = shares || null
      record.filledShares = Number((filledShares || 0).toFixed(4))
      record.notional = Number(num(result.notional ?? record.notional).toFixed(4))
      record.orderId = result.orderId ?? null
      record.brokerStatus = result.status
      record.status = !ok ? 'failed' : fullyFilled || !isLimit ? 'filled' : 'open'
      record.error = ok ? undefined : result.error ?? 'order-failed'
      if (record.status === 'filled' || record.status === 'failed') {
        record.finishedAt = new Date().toISOString()
        record.elapsedMs = Date.now() - Date.parse(record.at)
      }
      if (ok && record.kind === 'BUY' && record.filledShares > 0) {
        addSpend(record.filledShares * record.price)
      }
      if (ok && (fullyFilled || !isLimit)) quoteCache = { key: '', at: 0, value: null }
    } catch (error) {
      record.ok = false
      record.status = 'failed'
      record.error = shortError(error)
      record.finishedAt = new Date().toISOString()
    }
    markDirty()
  }
```

</details>

**依据 3 · 源码核查**：[bridge.js:384-400](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/bridge.js#L384-L400)

live回执仅安排异步撤单且不回写本地状态。

<details>
<summary>查看原文（17行）</summary>

```text
    const response = await withTimeout(client.postOrder(signed), 'post-order')
    const ok = Boolean(response?.ok)
    // The taker order should fill or die fast; keep a stale resting bid from
    // sitting on the book after the ask moved away.
    if (ok && response.status === 'live') {
      const orderId = response.orderId
      const timer = setTimeout(() => {
        client
          .cancelOrder({ orderId })
          .catch((error) => ctx.logger?.warn?.(`polymarket-agent: cancel failed: ${shortError(error)}`))
      }, 3000)
      timer.unref?.()
    }
    return {
      ok,
      price: limit,
      size,
```

</details>

**依据 4 · 源码核查**：[index.js:1108-1151](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/index.js#L1108-L1151)

重启pending失败化、延迟写与直接writeFile。

<details>
<summary>查看原文（44行）</summary>

```text
      }
      // An order still 'pending' after a restart can never settle by itself.
      for (const order of state.orders ?? []) {
        if (order.status !== 'pending') continue
        if (Date.now() - Date.parse(order.at) < 300_000) continue
        order.status = 'failed'
        order.ok = false
        order.error = order.error ?? 'interrupted'
      }
      loaded = true
      // Rewrite state.json so the removed address/settings key do not linger.
      if (cleaned) markDirty()
    })()
    return loading
  }

  function markDirty() {
    if (saveTimer) return
    saveTimer = setTimeout(() => {
      saveTimer = undefined
      saving = persist()
    }, 400)
    saveTimer.unref?.()
  }

  async function persistNow() {
    await mkdir(path.dirname(statePath), { recursive: true })
    await writeFile(statePath, JSON.stringify(state, null, 2), { mode: 0o600 })
  }

  async function persist() {
    try {
      await persistNow()
    } catch (error) {
      ctx.logger?.warn?.(`polymarket-agent: cannot write state: ${error}`)
    }
  }

  // ------------------------------------------------------------------ sweep

  async function gamma(pathname, timeoutMs = 20_000) {
    return fetchJson(`${GAMMA}${pathname}`, timeoutMs)
  }

```

</details>

**依据 5 · 源码核查**：[index.js:2599-2620](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/index.js#L2599-L2620)

退出删除本地记录并不撤交易所状态。

<details>
<summary>查看原文（22行）</summary>

```text

  /**
   * Log out: remove every credential and every local account record, then
   * return to setup. Public Polymarket data (positions, orders, on-chain
   * history) is not touched and cannot be deleted from here.
   */
  async function logout() {
    await load()
    await bridge.clearCredentials()
    state.orders = []
    state.onboarding = { done: false, skipped: false, completedAt: null }
    state.spend = { date: today(), usd: 0 }
    state.firstSeen = {}
    state.bootstrapped = false
    quoteCache = { key: '', at: 0, value: null }
    depositBridgeCache.clear()
    depositDiscoveryCache.clear()
    // Persist immediately: a logout that only lives in memory would reappear
    // after a restart, and a failed write must reach the caller.
    await persistNow()
    return { ok: true, onboarding: await onboardingView(), live: await liveStatus(true) }
  }
```

</details>

#### 缺口

- 尚未取得SDK迟到响应/部分成交/进程中断的可控实验记录
  **影响**：无法量化状态不一致出现概率和实际资金后果
  **进一步探讨**：在不接真实资金的SDK替身环境注入收单后超时、live后撤单失败与落盘中断，核交易所账和本地预算。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 一次合格查阅或交易有哪些依赖，成本和收益能确定多少？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

查阅依赖外部Gamma/Data API及DSH服务；账户信息和交易状态还需要正确钱包、签名材料及SDK，首次授权可能依赖Relayer。地址恢复来自历史链数据，没有历史时需要手动地址。能启动面板不等于所有这些外部路径可用。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本机运行、网络和账户资源；费用未知 | 核钱包与凭据、宿主准入和授权 | 未测配置工时；读公开雷达不等于需要先交私钥 |
| 持续使用 | 轮询请求、可能模型调用及交易相关费用；未定价 | 检查行情范围、回执和本地预算 | SDK与外部服务独立失败，未测单位合格任务成本 |
| 失败恢复 | 重查盘口/订单与补偿操作的资源未知 | 人工对账迟到回执、挂单与部分成交 | 不能见failed就自动重下 |
| 退出 | 已挂外部订单及授权仍可能存在 | 先在可信账户界面对账并处理挂单，再清本地凭据 | 插件logout不撤外部订单，撤授权需另处理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 查阅整合 | 扫描、查询、工具和面板接线存在 | 同任务节时、数据完整性和独立用户采用 |
| 本地提交 | SDK签名、价格/票面检查实际被调用 | 真实账户可用性、成交质量和服务限制 |
| 限额 | 本地记录参与校验 | 进程故障、其他客户端下单与退出重配后的账户级约束 |

SDK的approve流程在批次授权失败后查询missing项并逐项授权，最后再查询状态。它可以增加可观察性，但授权额度与交易风险不能因步骤变少就忽略；源码没有可用于估算收益或投资回报的数据。

#### 证据与依据

**依据 1 · 源码核查**：[bridge.js:261-293](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/bridge.js#L261-L293)

SDK/生产客户端依赖。

<details>
<summary>查看原文（33行）</summary>

```text
  async function sdk() {
    try {
      const [client, viem, actions] = await Promise.all([
        import('@polymarket/client'),
        import('@polymarket/client/viem'),
        import('@polymarket/client/actions'),
      ])
      return { client, viem, actions }
    } catch (error) {
      throw new Error(`sdk-unavailable: ${shortError(error)}`)
    }
  }

  async function getClient(cfg) {
    if (!cfg.privateKey) throw new Error('no-private-key')
    const mark = markOf(cfg)
    if (clientCache?.key === mark) return clientCache.client
    const lib = await sdk()
    const options = {
      signer: lib.viem.privateKey(cfg.privateKey),
      environment: { ...lib.client.production, rpc: POLYGON_RPC },
    }
    if (cfg.wallet) options.wallet = cfg.wallet
    if (cfg.relayerKey && cfg.relayerAddress) {
      options.apiKey = lib.client.relayerApiKey({ key: cfg.relayerKey, address: cfg.relayerAddress })
    }
    const client = await withTimeout(lib.client.createSecureClient(options), 'create-client')
    clientCache = { key: mark, client }
    return client
  }

  /**
   * Read-only health of the trading account. Cached briefly because the panel
```

</details>

**依据 2 · 源码核查**：[bridge.js:615-681](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/bridge.js#L615-L681)

授权批次、回退与再次验证。

<details>
<summary>查看原文（67行）</summary>

```text
      erc1155: before.erc1155.length,
    })

    report('submit', 'running')
    let submitted = 0
    let fallback = false
    try {
      // `setupTradingApprovals` checks every required allowance in one
      // JSON-RPC batch and submits a single gasless transaction. Some RPC
      // providers refuse batches that large, so a failure here is not fatal:
      // the indexed `missing` list below is enough to approve each entry
      // through the SDK's public actions.
      try {
        await withTimeout(client.setupTradingApprovals(), 'approvals-setup', 150_000)
        // The batch is a single gasless transaction; count it so the panel does
        // not claim "0 submitted" when the batch is what fixed the account.
        if (before.erc20.length + before.erc1155.length > 0) submitted += 1
      } catch (error) {
        fallback = true
        ctx.logger?.warn?.(
          `polymarket-agent: trading approval batch failed; approving entries individually: ${shortError(error)}`,
        )
      }

      const pending = missingView(await withTimeout(client.fetchTradingApprovalsState(), 'approvals-state'))
      for (const entry of pending.erc20) {
        const handle = await withTimeout(
          lib.actions.approveErc20(client, {
            tokenAddress: entry.tokenAddress,
            spenderAddress: entry.spenderAddress,
            amount: 'max',
          }),
          'approve-erc20',
          120_000,
        )
        await handle.wait()
        submitted += 1
      }
      for (const entry of pending.erc1155) {
        const handle = await withTimeout(
          lib.actions.approveErc1155ForAll(client, {
            tokenAddress: entry.tokenAddress,
            operatorAddress: entry.operatorAddress,
            approved: true,
          }),
          'approve-erc1155',
          120_000,
        )
        await handle.wait()
        submitted += 1
      }

      state = await withTimeout(client.fetchTradingApprovalsState(), 'approvals-verify')
      const missing = missingView(state)
      const fully = Boolean(state?.isFullyApproved)
      report('submit', fully ? 'ok' : 'warn', {
        submitted,
        fallback,
        fully,
        erc20: missing.erc20.length,
        erc1155: missing.erc1155.length,
      })
      statusCache = null
      return { ok: true, fully, missing, submitted, fallback }
    } catch (error) {
      return fail('submit', error)
    }
```

</details>

**依据 3 · 源码核查**：[index.js:1198-1221](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/index.js#L1198-L1221)

外部请求规模。

<details>
<summary>查看原文（24行）</summary>

```text
  async function sweep(locale = marketLocale()) {
    const pages = clamp(Math.round(num(state.settings.pages) || 6), 1, 8)
    const tasks = []
    for (let page = 0; page < pages; page += 1) tasks.push(page * 100)
    const byId = new Map()
    const errors = []
    const batches = await Promise.all(
      tasks.map((offset) =>
        gamma(
          `/events?closed=false&active=true&limit=100&offset=${offset}&order=volume24hr&ascending=false&locale=${locale}`,
        ).catch((error) => {
          errors.push(shortError(error))
          return []
        }),
      ),
    )
    for (const batch of batches) {
      if (!Array.isArray(batch)) continue
      for (const event of batch) if (event?.id) byId.set(String(event.id), event)
    }
    return { events: [...byId.values()], errors }
  }

  /**
```

</details>

**依据 4 · 源码核查**：[index.js:2599-2620](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/index.js#L2599-L2620)

退出责任不等于外部回滚。

<details>
<summary>查看原文（22行）</summary>

```text

  /**
   * Log out: remove every credential and every local account record, then
   * return to setup. Public Polymarket data (positions, orders, on-chain
   * history) is not touched and cannot be deleted from here.
   */
  async function logout() {
    await load()
    await bridge.clearCredentials()
    state.orders = []
    state.onboarding = { done: false, skipped: false, completedAt: null }
    state.spend = { date: today(), usd: 0 }
    state.firstSeen = {}
    state.bootstrapped = false
    quoteCache = { key: '', at: 0, value: null }
    depositBridgeCache.clear()
    depositDiscoveryCache.clear()
    // Persist immediately: a logout that only lives in memory would reappear
    // after a restart, and a failed write must reach the caller.
    await persistNow()
    return { ok: true, onboarding: await onboardingView(), live: await liveStatus(true) }
  }
```

</details>

#### 缺口

- 缺少同工作负载的费用、工时及合格任务数
  **影响**：无法输出单位任务成本或收益比例
  **进一步探讨**：先以无资金的公开数据查阅任务记录请求数、人工复核和正确交付，再独立评估交易恢复成本。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 现版本是否值得把账户交易交给该面板，如何决定停止？

**研究主题**：采用判断

#### 完整回答

当前建议观察。面板与只读模型查询的整合有明确实现，但作者的核心定位包含真实买卖和账户管理；不能只把建议缩成雷达查询就掩盖订单结果/预算恢复缺口。尚无足以支持真实资金试用的证据，尤其不能把pending或filled标签当交易所最终状态。

有意评估的DSH开发者可以先不配置任何签名材料，核公开市场读取、页面与模型输出是否一致，并检查连接准入拒绝路径。账户链应留在无资金的SDK替身实验，覆盖Q04的收单后超时、撤单失败和重启；不能以真实交易作为发现这些错误的办法。若出现界面订单状态与外部回执不一致，应停止使用交易入口，在可信的账户工具中核对挂单和成交，再决定是否清本地凭据。禁用插件或logout不会撤掉已送出的交易。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:2832-2858](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/index.js#L2832-L2858)

已实现的只读工具、面板API和后台接线。

<details>
<summary>查看原文（27行）</summary>

```text
  function start() {
    load()
    ctx.effect(() => ctx.tools.register(marketsTool), 'polymarket-agent markets tool')
    ctx.effect(() => ctx.tools.register(portfolioTool), 'polymarket-agent portfolio tool')
    ctx.effect(
      () => ctx.webServer.register({ kind: 'prefix', path: API_PREFIX, handler: handle }),
      'polymarket-agent routes',
    )
    ctx.effect(() => {
      const warm = setTimeout(async () => {
        await load()
        await applyHostLocalePreference()
        refresh()
          .catch((error) => ctx.logger?.warn?.(`polymarket-agent warm sweep failed: ${shortError(error)}`))
          .finally(() => scheduleSweep())
      }, 4_000)
      warm.unref?.()
      scheduleSweep()
      return () => {
        clearTimeout(warm)
        if (pollTimer) clearTimeout(pollTimer)
        pollTimer = undefined
        if (saveTimer) clearTimeout(saveTimer)
      }
    }, 'polymarket-agent poller')
  }

```

</details>

**依据 2 · 源码核查**：[index.js:1765-1800](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/index.js#L1765-L1800)

采用限制来自具体状态映射。

<details>
<summary>查看原文（36行）</summary>

```text
  async function runOrder(record, task) {
    try {
      const result = await task()
      const ok = Boolean(result.ok)
      const isLimit = record.orderType === 'limit'
      const resting = ok && isLimit && (result.status === 'live' || result.status === 'delayed')
      const shares = num(result.size ?? record.shares)
      const filledShares = ok
        ? Math.min(shares || Infinity, num(result.filledSize ?? (resting ? 0 : shares)))
        : 0
      const fullyFilled = ok && !resting && (!(shares > 0) || filledShares + 1e-9 >= shares)
      record.ok = ok
      record.price = num(result.price ?? record.price)
      record.shares = shares || null
      record.filledShares = Number((filledShares || 0).toFixed(4))
      record.notional = Number(num(result.notional ?? record.notional).toFixed(4))
      record.orderId = result.orderId ?? null
      record.brokerStatus = result.status
      record.status = !ok ? 'failed' : fullyFilled || !isLimit ? 'filled' : 'open'
      record.error = ok ? undefined : result.error ?? 'order-failed'
      if (record.status === 'filled' || record.status === 'failed') {
        record.finishedAt = new Date().toISOString()
        record.elapsedMs = Date.now() - Date.parse(record.at)
      }
      if (ok && record.kind === 'BUY' && record.filledShares > 0) {
        addSpend(record.filledShares * record.price)
      }
      if (ok && (fullyFilled || !isLimit)) quoteCache = { key: '', at: 0, value: null }
    } catch (error) {
      record.ok = false
      record.status = 'failed'
      record.error = shortError(error)
      record.finishedAt = new Date().toISOString()
    }
    markDirty()
  }
```

</details>

**依据 3 · 源码核查**：[index.js:2599-2620](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/index.js#L2599-L2620)

停止/退出后仍需外部对账。

<details>
<summary>查看原文（22行）</summary>

```text

  /**
   * Log out: remove every credential and every local account record, then
   * return to setup. Public Polymarket data (positions, orders, on-chain
   * history) is not touched and cannot be deleted from here.
   */
  async function logout() {
    await load()
    await bridge.clearCredentials()
    state.orders = []
    state.onboarding = { done: false, skipped: false, completedAt: null }
    state.spend = { date: today(), usd: 0 }
    state.firstSeen = {}
    state.bootstrapped = false
    quoteCache = { key: '', at: 0, value: null }
    depositBridgeCache.clear()
    depositDiscoveryCache.clear()
    // Persist immediately: a logout that only lives in memory would reappear
    // after a restart, and a failed write must reach the caller.
    await persistNow()
    return { ok: true, onboarding: await onboardingView(), live: await liveStatus(true) }
  }
```

</details>

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 显式未知订单与持久预算账是否是更有价值的下一步？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

待验证假设是把外部订单回执和本地预算分为两个有明确对账关系的对象，会比继续增加行情交互更有利于该交易台的可判断性。推导来自Q03的本地预算及Q04的超时失败化：先持久登记意图和保留金额，再提交；超时进入结果未知而非failed，按交易所可核实的稳定身份收敛，只有确定拒绝/撤销或已确认成交才调整保留额。市场型订单同样区分live、部分成交、撤销和成交，不把ok等同filled。

最小验证是在无资金、可控制回执的SDK替身中，对同一订单分别注入提交前失败、收单后响应丢失、部分成交、撤单失败和本地写入中断。比较现实现与候选账本方案的未解释订单数、预算释放错误数和人工对账时间。预期应同时降低前两项且不引入重复提交；如果交易所身份不可稳定查询、仍需同量人工对账或持久化负担明显超过收益，该方案就应收窄或放弃。这里没有执行实验，假设不是现版本能力，也不宣称交易恰好一次。

#### 证据与依据

**依据 1 · 源码核查**：[bridge.js:102-110](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/bridge.js#L102-L110)

未知结果产生点。

```text
function withTimeout(promise, label, ms = CALL_TIMEOUT_MS) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label}-timeout`)), ms)
    timer.unref?.()
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

```

**依据 2 · 源码核查**：[index.js:1765-1800](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/index.js#L1765-L1800)

结果被失败/成交标签压缩。

<details>
<summary>查看原文（36行）</summary>

```text
  async function runOrder(record, task) {
    try {
      const result = await task()
      const ok = Boolean(result.ok)
      const isLimit = record.orderType === 'limit'
      const resting = ok && isLimit && (result.status === 'live' || result.status === 'delayed')
      const shares = num(result.size ?? record.shares)
      const filledShares = ok
        ? Math.min(shares || Infinity, num(result.filledSize ?? (resting ? 0 : shares)))
        : 0
      const fullyFilled = ok && !resting && (!(shares > 0) || filledShares + 1e-9 >= shares)
      record.ok = ok
      record.price = num(result.price ?? record.price)
      record.shares = shares || null
      record.filledShares = Number((filledShares || 0).toFixed(4))
      record.notional = Number(num(result.notional ?? record.notional).toFixed(4))
      record.orderId = result.orderId ?? null
      record.brokerStatus = result.status
      record.status = !ok ? 'failed' : fullyFilled || !isLimit ? 'filled' : 'open'
      record.error = ok ? undefined : result.error ?? 'order-failed'
      if (record.status === 'filled' || record.status === 'failed') {
        record.finishedAt = new Date().toISOString()
        record.elapsedMs = Date.now() - Date.parse(record.at)
      }
      if (ok && record.kind === 'BUY' && record.filledShares > 0) {
        addSpend(record.filledShares * record.price)
      }
      if (ok && (fullyFilled || !isLimit)) quoteCache = { key: '', at: 0, value: null }
    } catch (error) {
      record.ok = false
      record.status = 'failed'
      record.error = shortError(error)
      record.finishedAt = new Date().toISOString()
    }
    markDirty()
  }
```

</details>

**依据 3 · 源码核查**：[index.js:1125-1151](https://github.com/dennisyang1986/polymarket-proxy/blob/7b2196516ce2f59ac0ffdfa5cb99ecc3babda9c9/index.js#L1125-L1151)

本地写入无法作为外部效果的事务提交。

<details>
<summary>查看原文（27行）</summary>

```text
    if (saveTimer) return
    saveTimer = setTimeout(() => {
      saveTimer = undefined
      saving = persist()
    }, 400)
    saveTimer.unref?.()
  }

  async function persistNow() {
    await mkdir(path.dirname(statePath), { recursive: true })
    await writeFile(statePath, JSON.stringify(state, null, 2), { mode: 0o600 })
  }

  async function persist() {
    try {
      await persistNow()
    } catch (error) {
      ctx.logger?.warn?.(`polymarket-agent: cannot write state: ${error}`)
    }
  }

  // ------------------------------------------------------------------ sweep

  async function gamma(pathname, timeoutMs = 20_000) {
    return fetchJson(`${GAMMA}${pathname}`, timeoutMs)
  }

```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
