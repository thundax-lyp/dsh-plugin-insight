# DSH小鲸鱼记账挂件

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[5247dd6](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget/tree/5247dd6813d6e4430728f39ccc63d43cda046022)

<!-- BEGIN META -->
[![GitHub ★ 6,023](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C023&color=yellow&logo=github&style=flat)](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget) [![npm 30d 196,943](https://img.shields.io/static/v1?label=npm+30d&message=196%2C943&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-whale-widget) [![最新发布 2026-10-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-whale-widget)
<!-- END META -->

> **实现功能**：在DSH界面显示余额、会话用量、可自定义气泡与交互提醒。

> **核心亮点**：相对手动切控制台，常驻余额和轮次提示把消费反馈放回工作界面；相对把余额差直接称花费，它显式拆分充值和消费并提供校正。增量是观察与解释的一体入口，不是新的计费真相源。泡泡、音效和角色定制主要是局部交互便利，不能作为节省API支出的证据。 依据[Q03](#research-q03)。

> **风险与缺陷**：关键质疑是两次余额采样之间发生的消费与充值能否被唯一分解。账本只能看到净差，即使分别累计正负变化，同一间隔中的充值抵消扣费仍需人工校正。partialDay检查首末观测与午夜距离，不能证明中间没有长断点。多个设备或其他应用共用账户时，账户余额变化也不能归因本机本轮；README已区分本机模型估算与账户口径。 依据[Q04](#research-q04)。

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
  - [Q01 · 谁在什么场景需要它，合格结果是什么？](#detail-section-11)
  - [Q02 · 入口、处理链及状态如何实现？](#detail-section-12)
  - [Q03 · 相对简单替代的实质增量是什么？](#detail-section-13)
  - [Q04 · 什么限制最可能使贡献不成立？](#detail-section-14)
  - [Q05 · 启动、持续与恢复依赖哪些条件？](#detail-section-15)
  - [Q06 · 全周期成本和实际效果支持到哪里？](#detail-section-16)
  - [Q07 · 实现有哪些可借鉴处和维护边界？](#detail-section-17)
  - [Q08 · 什么新假设值得验证，怎样推翻它？](#detail-section-18)
  - [Q09 · 对谁值得采用，何时停止？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向长期开着DSH并希望随时看余额和当轮消耗的个人开发者。原办法是切到账户控制台、查看usage或自行记账；合格结果是明确区分账户观测、充值校正和本地费用估计的提示。它不承担财务报销或跨用户费用归因，喜欢挂件外观也不能证明成本控制需求。

相对手动切控制台，常驻余额和轮次提示把消费反馈放回工作界面；相对把余额差直接称花费，它显式拆分充值和消费并提供校正。增量是观察与解释的一体入口，不是新的计费真相源。泡泡、音效和角色定制主要是局部交互便利，不能作为节省API支出的证据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 余额显示 | 避免切控制台 | 依赖账户API且不是交易流水 |
| 轮次提示 | 显示本地费用估计 | 依赖usage与价格 |
| 余额校正 | 说明充值与非调用调整 | 需人工真实交易依据 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 宿主Web/桌面注入 | 必需 | 显示挂件 | 无法显示 |
| 账户凭据及网络 | 余额必需 | 读取余额 | 保留旧值而非认定当前值 |
| 可写DSH_HOME | 记录必需 | 本地账本 | 保留原件回官方账单 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 安装并核对包来源 | 避免混装 |
| 2 | 确认scope与币种 | 观察部分数据标签 |
| 3 | 遇充值或断线先核账 | 不据净差结算 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 安装资源未知 | 显示与账户设置 | 非财务账本 |
| 持续使用 | 轮询资源未计量 | 检查估价与部分窗口 | 收益未实测 |
| 失败恢复 | 官方费用可能已发生 | 人工核对交易 | 不删除历史平账 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 费用可见性 | 常驻余额与轮次提示实现 | 用户支出是否下降 |
| 账户记账 | 净变化与校正逻辑 | 完整交易与本机归因 |

> **思考**：关键质疑是两次余额采样之间发生的消费与充值能否被唯一分解。账本只能看到净差，即使分别累计正负变化，同一间隔中的充值抵消扣费仍需人工校正。partialDay检查首末观测与午夜距离，不能证明中间没有长断点。多个设备或其他应用共用账户时，账户余额变化也不能归因本机本轮；README已区分本机模型估算与账户口径。 依据[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手动切控制台，常驻余额和轮次提示把消费反馈放回工作界面；相对把余额差直接称花费，它显式拆分充值和消费并提供校正。增量是观察与解释的一体入口，不是新的计费真相源。泡泡、音效和角色定制主要是局部交互便利，不能作为节省API支出的证据。 依据[Q03](#research-q03)。

相对手动切控制台，常驻余额和轮次提示把消费反馈放回工作界面；相对把余额差直接称花费，它显式拆分充值和消费并提供校正。增量是观察与解释的一体入口，不是新的计费真相源。泡泡、音效和角色定制主要是局部交互便利，不能作为节省API支出的证据。 依据[Q03](#research-q03)。

可借鉴的是账户scope+币种隔离、整数货币单位、乱序样本拒绝与注入前置。它们减少常见显示与累计混淆；迁移要同时保留原始观测窗口、校正语义和UI标签。DNS全局ipv4first是进程级副作用，应在共享宿主内审慎评估；大入口将多种UI与厂商模板集中，兼容维护责任较重。

<a id="detail-section-5"></a>

### 1.4 主要限制

关键质疑是两次余额采样之间发生的消费与充值能否被唯一分解。账本只能看到净差，即使分别累计正负变化，同一间隔中的充值抵消扣费仍需人工校正。partialDay检查首末观测与午夜距离，不能证明中间没有长断点。多个设备或其他应用共用账户时，账户余额变化也不能归因本机本轮；README已区分本机模型估算与账户口径。 依据[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可给希望少切控制台的个人用户试用常驻余额和当轮提示，先确认账户范围与部分数据标签。相对控制台切换多了界面内反馈，但不能独立计算完整交易或本机归因。出现充值抵消、长离线或官方账单对不上时停止依据挂件作预算结算，保留记录并回官方账单核对。 依据[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献为固定源码支持的机制判断；效果未实测，未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/accounting.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定版本的作者说明、注册入口和下列实际源码；未执行目标代码、安装或真实宿主验收。
- 下一步：- 已检查固定提交的README及source_paths列明的源码。
- 本轮不执行第三方代码；源码机制不等于安装、兼容或实际效果通过。
- 逐题缺口影响采用的范围已在相关回答与建议保留。

**分析版本**

- **仓库**：[MeteorNOX/DeepSeek-Balance-Whale-Widget](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget)
- **版本号**：0.4.2（[固定提交 5247dd6](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget/tree/5247dd6813d6e4430728f39ccc63d43cda046022)）
- **版本日期**：2026-10-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是保存相邻观测间最大缺口并显示“期间不可归因”，能减少用户把部分余额变化当完整日消费。用包含离线、跨午夜、充值与其他设备扣费的固定流水对比当前净差算法和带缺口说明版本；观察误认完整账单的比例及人工核对时间。若用户仍把账户估算当本机费用，或采样无法覆盖关键交易，不应升级为财务用途。 依据[Q08](#research-q08)。

- 已检查固定提交的README及source_paths列明的源码。
- 本轮不执行第三方代码；源码机制不等于安装、兼容或实际效果通过。
- 逐题缺口影响采用的范围已在相关回答与建议保留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 27246 | 26018 | 1223 | — |
| .md | source | 4 | 832 | — | — | 20477 |
| .mjs | source | 5 | 1301 | 1082 | 143 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：面向长期开着DSH并希望随时看余额和当轮消耗的个人开发者，采用价值是否由固定机制与边界支持？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在什么场景需要它，合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

面向长期开着DSH并希望随时看余额和当轮消耗的个人开发者。原办法是切到账户控制台、查看usage或自行记账；合格结果是明确区分账户观测、充值校正和本地费用估计的提示。它不承担财务报销或跨用户费用归因，喜欢挂件外观也不能证明成本控制需求。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-35](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget/blob/5247dd6813d6e4430728f39ccc63d43cda046022/README.md#L28-L35)

作者说明余额、今日已用与轮次口径。

```text
- 🐋 **常驻自启**：随 DSH Web 界面每次打开自动出现（标准 DSH bundle 插件）
- 💰 **余额**：60 秒自动刷新 + 点击鲸鱼手动刷新；余额变化时数字**滚动动画**；瞬时网络抖动自动沿用最近余额不报错。**两种取数方式，API key 优先**：① DSH 凭据里的 `DEEPSEEK_API_KEY`；② **DSH 账号登录态** —— 通过「设置 → 账号与余额」登录了 DeepSeek 账号、又没配 API key 时自动使用（**不需要去 platform 建 key**）
- 📊 **今日已用（小鲸鱼记账）**：不需要任何令牌。余额**下降**按观测累计为消费，余额**上升**（充值 / 赠金）单独记录、不会冲掉已有消费；检测到余额增加会提示「待核对余额调整」，可在「小鲸鱼记账 → **DeepSeek（内置）→ 设置 → 余额校正**」按实际累计到账金额与非调用扣减校正 —— **「已观测消费」与「余额校正」都是 DeepSeek 账户口径**（由该 API key 的余额观测得出，不含其它厂商；「本机模型费用」才是所有模型的本地估算）（逐轮明细保留 90 天或最多 2 万条、逐日归档保留 365 天，超期数据归档到 `.dshw-usage-archive.json`）；金额按 8 位小数记账、显示保留两位
- 💬 **每轮对话消耗**：监听 DSH 本机会话事件，按模型**真实 usage**（input / cache / output / reasoning tokens）换算金额，每轮结束弹出消耗泡泡；可开关、自动关闭秒数可设（0 = 不自动关闭），**泡泡内容可自定义**（模块化，金额用 `{cost}` 引用），入口：菜单 → 「音效与提示」→ 「全局设置」→ 展开「每轮消耗提示」→「编辑提示内容」
- ⛰️ **峰谷定价**：工作日高峰 9:00–12:00、14:00–18:00（北京时间），其余空闲；2026-08-23 起**周末全天谷价**。峰谷模块支持状态文字、倒计时、"梁文峰谷 / !?强强?! / 简洁"等多种样式
- 📒 **用量记录窗口**：今日模型消费、近 7 天、全部记录；模型占比条；按日期展开逐条明细（含时间与金额）；支持按日期或**模型名搜索**；模型名带友好标注（`deepseek-flash` → `DeepSeek-V4.1-Flash`，旧名标注"同 V4.1 Flash"）

### 交互
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、处理链及状态如何实现？

**研究主题**：功能与机制

#### 完整回答

入口立即注册webserver/index-inject脚本，再局部等待webServer、credentials与connection服务，避免注入等待服务而错过桌面收集。按sessionId聚合轮次，余额账本按账户scope和币种分组；observeBalance忽略重复乱序时间戳，下降计debit、上升计credit，并保留迁移前历史。显示层因此有可核对数据来源，但并非交易API。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:731-749](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget/blob/5247dd6813d6e4430728f39ccc63d43cda046022/lib/index.js#L731-L749)

注入前置与服务局部等待。

<details>
<summary>查看原文（19行）</summary>

```text
  apply(root) {
    const rowDisposers = []
    root.effect(() => () => { for (const d of rowDisposers) { try { d() } catch (err) {} } })
    // ① 结构化注入行：桌面端唯一能生效的通道（web 形态另有 tapIndex，两条并存、各自去重）
    rowDisposers.push(root.on('webserver/index-inject', (table) => {
      try {
        if (!Array.isArray(table)) return
        for (const row of table) {
          if (!row) continue
          if (row.kind === 'script-src' && row.src === '/dsh-whale/widget.js') return // 旧版本推过 → 不重复
          if (row.kind === 'script' && typeof row.text === 'string'
            && row.text.indexOf('/dsh-whale/widget.js') >= 0) return
        }
        table.push({ kind: 'script', placement: 'body', text: DESKTOP_WIDGET_ROW_TEXT })
      } catch (err) {}
    }))

    // ② 其余逻辑：等齐三个服务后再跑（等价于原来的对象级 inject，但不再挡住 ①）
    root.inject(['webServer', 'credentials', 'connection'], (ctx) => {
```

</details>

**依据 2 · 源码核查**：[lib/accounting.mjs:145-179](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget/blob/5247dd6813d6e4430728f39ccc63d43cda046022/lib/accounting.mjs#L145-L179)

scope币种、乱序及余额变化。

<details>
<summary>查看原文（35行）</summary>

```text
export function observeBalance(ledger, snapshot) {
  const at = Number(snapshot.at ?? Date.now())
  const day = beijingDay(at)
  const units = moneyUnits(snapshot.balance)
  const currency = String(snapshot.currency || 'CNY').toUpperCase()
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error('余额币种无效')
  const scope = String(snapshot.scope || 'default')
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(scope)) throw new Error('账户标识无效')
  const context = scope + '-' + currency
  let a = ledger.accounting
  if (!a || a.version !== ACCOUNTING_VERSION) {
    // Legacy totals have no trustworthy recharge metadata. Preserve them for
    // reference; begin a new explicitly timed observation window.
    a = ledger.accounting = {
      version: ACCOUNTING_VERSION, active: context, books: {}, migratedAt: at,
      legacyHistory: { ...(ledger.history || {}) },
    }
  }
  a.books ||= {}
  let book = a.books[context]
  if (!book) book = a.books[context] = { currency, days: {} }
  // Ignore duplicate/out-of-order samples, including a late sample from yesterday.
  if (book.lastAt != null && at <= book.lastAt) return balanceSummary(ledger, ledger.date)
  a.active = context
  let row = book.days[day]
  if (!row) {
    row = book.days[day] = {
      day, firstAt: at, lastAt: at, openingUnits: units, lastUnits: units,
      debitUnits: 0, creditUnits: 0, revision: 0, correction: null,
    }
  } else {
    const delta = row.lastUnits - units
    if (delta > 0) row.debitUnits += delta
    if (delta < 0) row.creditUnits -= delta
    row.lastUnits = units
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对简单替代的实质增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对手动切控制台，常驻余额和轮次提示把消费反馈放回工作界面；相对把余额差直接称花费，它显式拆分充值和消费并提供校正。增量是观察与解释的一体入口，不是新的计费真相源。泡泡、音效和角色定制主要是局部交互便利，不能作为节省API支出的证据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/accounting.mjs:1-2](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget/blob/5247dd6813d6e4430728f39ccc63d43cda046022/lib/accounting.mjs#L1-L2)

余额观测不是交易API。

```text
// Balance observations are not a transaction API. Keep them separate from
// token estimates and require explicit credits/debits for reconciliation.
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么限制最可能使贡献不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

关键质疑是两次余额采样之间发生的消费与充值能否被唯一分解。账本只能看到净差，即使分别累计正负变化，同一间隔中的充值抵消扣费仍需人工校正。partialDay检查首末观测与午夜距离，不能证明中间没有长断点。多个设备或其他应用共用账户时，账户余额变化也不能归因本机本轮；README已区分本机模型估算与账户口径。

#### 证据与依据

**依据 1 · 源码核查**：[lib/accounting.mjs:32-50](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget/blob/5247dd6813d6e4430728f39ccc63d43cda046022/lib/accounting.mjs#L32-L50)

partialDay仅比较首末缺口。

<details>
<summary>查看原文（19行）</summary>

```text
// v789（issue #184）：partialDay 改为**按实际观测缺口就地计算**，不再是硬编码 true。
//   为什么要有这个：记账只发生在「客户端界面开着 + 余额能取到」的时候，任一条不成立就完全不观测；
//   跨零点的那一段（新建当日行时 openingUnits 直接取"此刻余额"）会被新当天的起点吞掉，
//   于是「今日已用」长期显示一个明显偏小的数字，而界面上**没有任何"这是部分数据"的提示**。
//   判据（issue 里给出的算法）：观测起点距当日 00:00、或（对已经过去的日子）最后一次观测距次日 00:00，
//   超过 GAP_MS 就视为部分数据。正常运行时两个缺口都只有几分钟 ⇒ false，不会误伤正常日。
const PARTIAL_GAP_MS = 10 * 60 * 1000
function partialDayOf(day, row, now) {
  try {
    const start = Date.parse(String(day) + 'T00:00:00+08:00')
    if (!Number.isFinite(start)) return true
    const end = start + 86400000
    const first = Number(row && row.firstAt)
    const last = Number(row && row.lastAt)
    if (!Number.isFinite(first) || !Number.isFinite(last)) return true
    const beforeGap = first - start
    const afterGap = Number(now) >= end ? (end - last) : 0
    return beforeGap > PARTIAL_GAP_MS || afterGap > PARTIAL_GAP_MS
  } catch (err) { return true }
```

</details>

#### 缺口

- 净差不能分解同间隔充值与扣费，中段观测缺口未完整标注。
  **影响**：完整日消费与本机归因不成立。
  **进一步探讨**：与含离线、充值及外部扣费的完整流水对照。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续与恢复依赖哪些条件？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要宿主Web/桌面注入接口、可用DeepSeek凭据或登录态及余额网络端点。数据放DSH_HOME而非包目录；远程部署的写配置受同源/本机约束，不能为了方便绕开凭据保护。安装来源npm与github应二选一，切换先移除旧包。账本故障或校正含糊时保留数据，以提供商控制台为准。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:22-24](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget/blob/5247dd6813d6e4430728f39ccc63d43cda046022/lib/index.js#L22-L24)

用户数据归DSH_HOME。

```text
// DSH home: used for the widget memory/role/audio files, since node_modules may
// be read-only or cleaned on update.
const DSH_HOME = process.env.DSH_HOME || path.join(os.homedir(), '.dsh')
```

**依据 2 · 作者声明**：[README.md:18-23](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget/blob/5247dd6813d6e4430728f39ccc63d43cda046022/README.md#L18-L23)

来源与产品线不可混装。

```text
| **Codex 桌面应用**（跟随 Codex 窗口、无独立网页） | ⚠️ **已迁出本仓库** | [新仓库](https://github.com/Yang-huai406/Codex-Whale-Public) · [最新版下载](https://github.com/Yang-huai406/Codex-Whale-Public/releases/latest) · **已安装用户无需重装**<br>**Codex 版迁移公告**：本次迁移保留了**开发历史、历代版本与作者贡献**，并清理了旧图片中的非必要元数据（贡献者致谢见文末「致谢」）。后续更新、问题反馈与版本发布都在新仓库；反馈问题时请注明**版本、系统和复现步骤**，勿上传密钥、完整配置或未脱敏日志。 |

⚠️ **两条线互不兼容**：Codex 版不能用 `dsh plugin … add` 装进 DSH 网页，本仓库的插件也不能在 Codex 桌面里运行。

⚠️ **安装方式二选一、别混用**（npm 名 / `github:`）—— 它们是同一个包名，先后安装会并存冲突；已经是 `github:` 装的，要换 npm 名请先 `dsh plugin --profile web remove dsh-whale-widget`。

```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 全周期成本和实际效果支持到哪里？

**研究主题**：效果与总成本

#### 完整回答

首次是安装、选择显示项和检查账户范围；持续有余额轮询、usage估价及本地记录维护，具体网络与人工耗时未计量。失败恢复包含对照官方账单、确认充值与非调用扣减，不能把估价差额强行改成零。没有行为对照证明提醒减少支出，当前支持的是提高消费信息可见性而非已实测省钱。

#### 证据与依据

**依据 1 · 源码核查**：[lib/accounting.mjs:194-204](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget/blob/5247dd6813d6e4430728f39ccc63d43cda046022/lib/accounting.mjs#L194-L204)

校正需要明确金额输入。

<details>
<summary>查看原文（11行）</summary>

```text
function adjustmentUnits(value, required = false) {
  if (value === '' || value === null || value === undefined) {
    if (required) throw new Error('请填写本统计区间的累计到账金额，未充值请填 0')
    return 0
  }
  if (!/^(?:0|[1-9]\d*)(?:\.\d{1,8})?$/.test(String(value))) {
    throw new Error('金额须为非负数，最多保留 8 位小数')
  }
  const units = moneyUnits(value)
  if (units < 0) throw new Error('金额不能为负数')
  return units
```

</details>

#### 缺口

- 提醒是否减少消费与核账耗时未有同条件数据。
  **影响**：只支持可见性价值。
  **进一步探讨**：记录启用前后同任务支出与核账时间。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现有哪些可借鉴处和维护边界？

**研究主题**：工程质量与复用

#### 完整回答

可借鉴的是账户scope+币种隔离、整数货币单位、乱序样本拒绝与注入前置。它们减少常见显示与累计混淆；迁移要同时保留原始观测窗口、校正语义和UI标签。DNS全局ipv4first是进程级副作用，应在共享宿主内审慎评估；大入口将多种UI与厂商模板集中，兼容维护责任较重。

#### 证据与依据

**依据 1 · 源码核查**：[lib/accounting.mjs:6-19](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget/blob/5247dd6813d6e4430728f39ccc63d43cda046022/lib/accounting.mjs#L6-L19)

整数货币计算。

<details>
<summary>查看原文（14行）</summary>

```text
export function moneyUnits(value) {
  const n = Number(value)
  const units = Math.round(n * SCALE)
  if (!Number.isFinite(n) || !Number.isSafeInteger(units)) throw new Error('金额无效或超出可记账范围')
  return units
}

export function preciseMoney(value) { return moneyUnits(value) / SCALE }
export function addMoney(a, b) { return sumMoney([a, b]) }
export function sumMoney(values) {
  let units = 0
  for (const value of values) units += moneyUnits(value)
  if (!Number.isSafeInteger(units)) throw new Error('金额合计超出可记账范围')
  return units / SCALE
```

</details>

**依据 2 · 源码核查**：[lib/index.js:14-16](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget/blob/5247dd6813d6e4430728f39ccc63d43cda046022/lib/index.js#L14-L16)

全局DNS结果顺序调整。

```text
// Node 的 fetch(undici) 可能优先 IPv6：个别域名(如 open.bigmodel.cn)有 AAAA 记录但本机 IPv6 不通，
// 会直接报 "fetch failed"（curl 会自动回退 IPv4，所以看起来正常）。统一改为 IPv4 优先。
try { dns.setDefaultResultOrder('ipv4first') } catch (err) {}
```

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 什么新假设值得验证，怎样推翻它？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是保存相邻观测间最大缺口并显示“期间不可归因”，能减少用户把部分余额变化当完整日消费。用包含离线、跨午夜、充值与其他设备扣费的固定流水对比当前净差算法和带缺口说明版本；观察误认完整账单的比例及人工核对时间。若用户仍把账户估算当本机费用，或采样无法覆盖关键交易，不应升级为财务用途。

#### 证据与依据

**依据 1 · 源码核查**：[lib/accounting.mjs:39-50](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget/blob/5247dd6813d6e4430728f39ccc63d43cda046022/lib/accounting.mjs#L39-L50)

缺口判据为改进假设来源。

<details>
<summary>查看原文（12行）</summary>

```text
function partialDayOf(day, row, now) {
  try {
    const start = Date.parse(String(day) + 'T00:00:00+08:00')
    if (!Number.isFinite(start)) return true
    const end = start + 86400000
    const first = Number(row && row.firstAt)
    const last = Number(row && row.lastAt)
    if (!Number.isFinite(first) || !Number.isFinite(last)) return true
    const beforeGap = first - start
    const afterGap = Number(now) >= end ? (end - last) : 0
    return beforeGap > PARTIAL_GAP_MS || afterGap > PARTIAL_GAP_MS
  } catch (err) { return true }
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得采用，何时停止？

**研究主题**：采用判断

#### 完整回答

可给希望少切控制台的个人用户试用常驻余额和当轮提示，先确认账户范围与部分数据标签。相对控制台切换多了界面内反馈，但不能独立计算完整交易或本机归因。出现充值抵消、长离线或官方账单对不上时停止依据挂件作预算结算，保留记录并回官方账单核对。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-35](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget/blob/5247dd6813d6e4430728f39ccc63d43cda046022/README.md#L28-L35)

作者已区分账户和本机口径。

```text
- 🐋 **常驻自启**：随 DSH Web 界面每次打开自动出现（标准 DSH bundle 插件）
- 💰 **余额**：60 秒自动刷新 + 点击鲸鱼手动刷新；余额变化时数字**滚动动画**；瞬时网络抖动自动沿用最近余额不报错。**两种取数方式，API key 优先**：① DSH 凭据里的 `DEEPSEEK_API_KEY`；② **DSH 账号登录态** —— 通过「设置 → 账号与余额」登录了 DeepSeek 账号、又没配 API key 时自动使用（**不需要去 platform 建 key**）
- 📊 **今日已用（小鲸鱼记账）**：不需要任何令牌。余额**下降**按观测累计为消费，余额**上升**（充值 / 赠金）单独记录、不会冲掉已有消费；检测到余额增加会提示「待核对余额调整」，可在「小鲸鱼记账 → **DeepSeek（内置）→ 设置 → 余额校正**」按实际累计到账金额与非调用扣减校正 —— **「已观测消费」与「余额校正」都是 DeepSeek 账户口径**（由该 API key 的余额观测得出，不含其它厂商；「本机模型费用」才是所有模型的本地估算）（逐轮明细保留 90 天或最多 2 万条、逐日归档保留 365 天，超期数据归档到 `.dshw-usage-archive.json`）；金额按 8 位小数记账、显示保留两位
- 💬 **每轮对话消耗**：监听 DSH 本机会话事件，按模型**真实 usage**（input / cache / output / reasoning tokens）换算金额，每轮结束弹出消耗泡泡；可开关、自动关闭秒数可设（0 = 不自动关闭），**泡泡内容可自定义**（模块化，金额用 `{cost}` 引用），入口：菜单 → 「音效与提示」→ 「全局设置」→ 展开「每轮消耗提示」→「编辑提示内容」
- ⛰️ **峰谷定价**：工作日高峰 9:00–12:00、14:00–18:00（北京时间），其余空闲；2026-08-23 起**周末全天谷价**。峰谷模块支持状态文字、倒计时、"梁文峰谷 / !?强强?! / 简洁"等多种样式
- 📒 **用量记录窗口**：今日模型消费、近 7 天、全部记录；模型占比条；按日期展开逐条明细（含时间与金额）；支持按日期或**模型名搜索**；模型名带友好标注（`deepseek-flash` → `DeepSeek-V4.1-Flash`，旧名标注"同 V4.1 Flash"）

### 交互
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
