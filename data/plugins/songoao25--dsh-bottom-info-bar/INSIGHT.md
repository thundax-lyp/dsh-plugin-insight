# Bottom Info Bar

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[ab10684](https://github.com/songoao25/dsh-bottom-info-bar/tree/ab106842d81f19198a296e3292e9a1e82823f4bc)

<!-- BEGIN META -->
[![GitHub ★ 54](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=54&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/songoao25/dsh-bottom-info-bar) [![npm 30d 20,926](https://img.shields.io/static/v1?label=npm+30d&message=20%2C926&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-bottom-info-bar) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-bottom-info-bar)
<!-- END META -->

> **功能**：在 DSH 输入框下显示当前模型、提供商余额或额度、价格及本地会话花费。

> **亮点**：集中当前模型、账户快照与会话账本，区分订阅/余额/云账单，并用worker减主线程同步SQLite；不把辅助估算当官方账单，见 [Q01](#research-q01)至 [Q04](#research-q04)。

> **主要限制**：实际优先价目表，reportedCost仅缺价回退；usage不覆盖历史/无usage调用，超时可写结果未知；默认自更新还会改自身，见 [Q03](#research-q03)、[Q05](#research-q05)。

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
  - [Q01 · 信息栏为谁补什么，根才是实际实现吗？](#detail-section-11)
  - [Q02 · 真实余额、订阅和云账单怎样取得，失败是否变零？](#detail-section-12)
  - [Q03 · usage如何变成账本金额，哪些不是实际扣款？](#detail-section-13)
  - [Q04 · 当前会话显示和管理面有什么完成/权限边界？](#detail-section-14)
  - [Q05 · 自更新是否只检查，更新成功代表正在跑新版吗？](#detail-section-15)
  - [Q06 · 谁如何最小采用，全周期成本是什么？](#detail-section-16)
  - [Q07 · 可证伪的下一步改进是什么？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：常切模型且需在下一次调用前看账户/会话花费的人，可集中查看；须区分实时账户、旧快照与本地估算，见 [Q01](#research-q01)。

原生usage/日志与提供商账户页分开查；本包集中展示，不改变定价配额。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 账户信息栏 | 发消息前看状态 | 快照可能陈旧 |
| 订阅/账单 | 按服务口径显示 | tokens不当现金 |
| 本地账本 | 会话/时间段估算 | 有价/usage与持久范围 |
| 配置/清理 | 调整显示/账本 | 有写与删除副作用 |
| 自更新 | 维护包文件 | 默认可自动装，待重启 |

**流程与依赖**

#### 依赖

| 条件 | 是否必需 | 用途 | 不满足时 |
| --- | --- | --- | --- |
| Node>=22.13/node:sqlite、React18 | 声明条件 | Host账本/Web | SQLite不可用账本降级 |
| DSH credentials/timer/client slots/connection | 必需 | 账户与显示/鉴权 | 未验实际宿主兼容 |
| 一个已有可信账户/权限 | 账户读数条件 | 远端余额/额度 | 保旧值带error |
| 可写本地账本目录 | 持久条件 | worker/SQLite | 超时不等必未写 |
| npm registry/远程价目 | 维护条件 | 更新/补价 | 动态内容非固定源码 |

#### 步骤

| 步骤 | 动作 | 判据与退路 |
| --- | --- | --- |
| 专用profile | 先关自动安装更新 | 固定版便核查 |
| 单账户 | 核provider/币种/时间/起算 | 保官方页面 |
| 已有调用 | 非关键原任务观察 | 对本地估算与官方结果 |
| 异常 | 分陈旧/无价/持久未知 | 不盲重发/清账本 |
| 退出 | 停插件核worker/维护 | 数据导出另管 |

**效果与成本**

#### 成本

| 阶段 | 资源/现金 | 人工时间 | 边界 |
| --- | --- | --- | --- |
| 首次 | 宿主/SQLite/目录 | 账户权限/口径配置 | 未测耗时 |
| 持续 | API轮询/价目/更新/磁盘 | 对账/模型别名维护 | 不改变原模型费 |
| 失败 | 写未知/维护备份 | 分API/账本/更新状态 | 重发不等恢复 |
| 退出 | 库/导出/更新备份 | 停任务保留或清数据 | 不撤官方账单 |

#### 效果

| 效果 | 支持 | 未确认 |
| --- | --- | --- |
| 集中账户状态 | 真实API/分模式 | 全服务当前可用 |
| 本地花费 | usage/价目/SQLite | 精确扣款/历史覆盖 |
| 显示一致性 | selection/版本/局部错误 | 真机快速切换 |
| 维护 | 校验/备份/回滚链 | 全失败恢复/净省时 |

> **思考**：实际优先价目表，reportedCost仅缺价回退；usage不覆盖历史/无usage调用，超时可写结果未知；默认自更新还会改自身，见 [Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：集中当前模型、账户快照与会话账本，区分订阅/余额/云账单，并用worker减主线程同步SQLite；不把辅助估算当官方账单，见 [Q01](#research-q01)至 [Q04](#research-q04)。

worker SQLite事务/唯一id、单stream末次usage与selection屏蔽有价值；端到端幂等、timeout结果与真实计价来源仍要精确说明，自更新非全批原子，见 [Q03](#research-q03)至 [Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

实际优先价目表，reportedCost仅缺价回退；usage不覆盖历史/无usage调用，超时可写结果未知；默认自更新还会改自身，见 [Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

试用：一个已有账户在专用profile先关自动安装，核来源/单位/时间和警告；只观察原本需要的非关键调用，不新增付费请求。读数误导或持久未知难解释就停用回官方账户页与原生usage，见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

根真实双面、代表账户/API/模式、usage→SQLite、客户端显示/鉴权和自更新关键链已查；未跑Host/真实账号/现价。单账户辅助显示试用；来源对账为候选。

- 已检查：作者 README、包清单、源码路径 README.md、lib/accounting.js、lib/client.js、lib/index.js、lib/ledger-client.js、lib/ledger-store.js、lib/self-update.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核根package/Host/client装配，通用余额/DeepSeek/OpenAI分支、订阅RPC及Fireworks账单代表，accounting、ledger写/worker/client与错误、自更新关键执行/校验/回滚。未逐家适配器审计、全部迁移/UI/安全或运行。
- 下一步：- 固定源码，无目标执行/账号/Host/模型请求。
- 不引用内置表作现价或财务指导。
- 账户快照/本地估算/持久确认分开，代码优先于注释。

**分析版本**

- **仓库**：[songoao25/dsh-bottom-info-bar](https://github.com/songoao25/dsh-bottom-info-bar)
- **版本号**：1.21.12（[固定提交 ab10684](https://github.com/songoao25/dsh-bottom-info-bar/tree/ab106842d81f19198a296e3292e9a1e82823f4bc)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是金额来源/持久待核状态显式化与同记录id对账，比较三故障样本下误判/重复与UI负担，见 [Q07](#research-q07)。

- 固定源码，无目标执行/账号/Host/模型请求。
- 不引用内置表作现价或财务指导。
- 账户快照/本地估算/持久确认分开，代码优先于注释。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 12 | 994 | — | — | 11744 |
| .js | source | 25 | 33568 | 28645 | 4274 | — |
| .mjs | source | 3 | 463 | 343 | 90 | — |
| .cjs | test | 20 | 5876 | 4958 | 690 | — |
| .mjs | test | 36 | 7842 | 6363 | 1110 | — |
| .js | test | 1 | 56 | 48 | 5 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/songoao25/dsh-bottom-info-bar/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/songoao25/dsh-bottom-info-bar/issues?q=is%3Aissue+created%3A2026-10-07T05%3A16%3A47.587Z..2026-11-06T05%3A16%3A47.587Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/songoao25/dsh-bottom-info-bar/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T05%3A16%3A47.587Z..2026-11-06T05%3A16%3A47.587Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：输入处的余额/额度与本地估算如何取得、持久并展示，是否足以辅助采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 信息栏为谁补什么，根才是实际实现吗？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根是实际原生Host/Web插件：package导出lib/index/client并声明bundle/client服务，Host读credentials/timer，Web挂composer dock信息栏。适合同时用多个模型、希望在发下一条消息前知道当前账号余额/额度和本地会话花费的DSH用户。参照是另开提供商账户页、看原生usage或查日志；本包把不同口径集中到当前输入处，减少查找，但不改变模型价格、配额或执行能力。

合格结果要能分清远端账户快照、本地usage估算、数据起算点和错误，而不只是多显示一个数字。README明确本地账本从插件开始计，历史调用不补成全账户账单。旧plugin子目录只是兼容链接，本根研究独立核实际代码，不把它当额外一套能力。支持很多渠道的声明不等于本轮逐家验证；此处核通用余额链、DeepSeek代表账户、订阅分流与Fireworks代表云账单。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:24-40](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/package.json#L24-L40)

真实根Host/client导出。

<details>
<summary>查看原文（17行）</summary>

```text
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./locale/*.json": "./locale/*.json",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "locale/*.json",
    "README.md",
    "README.zh-CN.md",
    "docs/INSTALL.md",
    "docs/LEDGER.md",
```

</details>

**依据 2 · 源码核查**：[package.json:48-68](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/package.json#L48-L68)

原生client/bundle/运行条件。

<details>
<summary>查看原文（21行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-settings-general",
        "@deepseek-ai/dsh-client-locale"
      ]
    }
  },
  "peerDependencies": {
    "react": "^18.0.0"
  },
  "engines": {
    "node": ">=22.13.0"
  }
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1682-1689](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/index.js#L1682-L1689)

Host真实apply。

```text
export default {
  inject: ['credentials', 'timer'],
  apply(ctx) {
    const t = hostLocale.createHostTranslator(ctx);
    // 窗口标签：在 apply 内部按当前语言偏好重新计算（模块顶层 WINDOW_LABELS 仅作安全兜底）。
    const windowLabels = { five_hour: t('host.hour'), seven_day: t('ui.weekly'), monthly: t('ui.monthly') };
    // 版本查询不在这里预热：apply 位于宿主启动关键路径上，任何多余的网络请求都会和宿主自己的
    // boot 抢 IO（issue #260）。latestVersion() 由第一次真正需要它的 RPC（信息栏/设置页）触发，
```

**依据 4 · 源码核查**：[lib/client.js:3390-3398](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/client.js#L3390-L3398)

真实dock注册。

```text
    function applyMode() {
      if (occupantDispose) { occupantDispose(); occupantDispose = null; }
      occupantDispose = slots.register(
        // 静态注册无动态沙箱的优先级自动分配：显式给低 priority（最低者渲染）以遮蔽原生 stats 栏（priority 0）
        { name: 'conversation.composer.dock', id: 'stats', priority: -1000, locale: LOCALE_NAMESPACE },
        function (slotProps) {
          return React.createElement(BottomInfoBar, Object.assign({}, slotProps, { density: density, onToggleDensity: onToggleDensity }));
        }
      );
```

**依据 5 · 作者声明**：[README.md:14-20](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/README.md#L14-L20)

作者说明模式和账本起算范围。

```text
A DeepSeek Harness plugin that adds an account information row under the composer: provider and model, real balance or subscription quota, peak/off-peak pricing, and what this session has cost.

![Bottom Info Bar in full mode](assets/bar-full.webp)

## What it shows

The bar follows the active session and picks one of three readings per provider (mutually exclusive, nothing to switch by hand): **balance** shows the real balance from the provider's own API, **subscription quota** shows each quota window's remaining allowance with its reset countdown (an exhausted window stays visible at 0% instead of disappearing, flagged low), and **cloud billing** shows this month's real spend from the official billing API. On top of that come four spend tallies — this session, today, last 30 days, all time — plus extras such as time and custom text. All four come from the plugin's own ledger, which **starts counting when the plugin first runs**: calls made before that (or before you cleared the ledger) are not included, and hovering the spend writes out the exact start of the count. For the authoritative figure for a whole session, use the provider's own balance or bill. In balance mode, hovering the balance expands it into topped-up and granted balances, so gifted credit is never conflated with the money you paid in.
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 真实余额、订阅和云账单怎样取得，失败是否变零？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

DeepSeek API Key账户配置实际user/balance端点，桌面DeepSeek-account另走宿主账号服务，两条凭据/失效原因分开；通用API链从credentials.resolve取key放Bearer头，带超时fetch，HTTP/解析/凭据异常保留旧data/fetchedAt并换error，seq防慢请求盖新快照。保留旧值不代表当前可用余额，缺key也可能仍看到旧数字。OpenAI分支明示estimate，初始topup20是代码假设，不能当真实账户余额。

订阅与云账单按provider模式互斥读取，订阅RPC只有subscription模式才kick，并带旧数据/时间/错误；额度是窗口剩余量，不能与现金余额混算。Fireworks代表链先读官方billing summary，404才回usage并明确tokens单位；token用量不是美元支出。此轮只确认请求/分流，不证明所有服务当前API、权限、金额或套餐有效。key不进UI请求明文参数也不等插件无敏感面：Host持凭据能发请求，第三方接口和宿主凭据授权仍需信任。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:2050-2071](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/index.js#L2050-L2071)

DeepSeek/API账号与OpenAI估算区分。

<details>
<summary>查看原文（22行）</summary>

```text
    // ---------- 服务商适配器（余额仅 DeepSeek 真实 API；OpenAI 为记账回退估算） ----------
    const PROVIDERS = {
      deepseek: {
        id: 'deepseek', displayName: 'DeepSeek', credential: 'DEEPSEEK_API_KEY',
        balanceAPI: 'https://api.deepseek.com/user/balance',
        estimate: false,
        parseBalance: parseBalanceInfos,
      },
      // DSH 桌面端内置 DeepSeek 账号：与上面 API Key 路是同一品牌的**两条通道**，账户键刻意分开 ——
      // 两条路的凭据与失效原因完全不同（「没配 API Key」和「账号没登录」是两句不同的话），
      // 混成一个键会让一种失效掩盖另一种。余额来自宿主账号服务，不走凭据、不发 HTTP。
      'deepseek-account': {
        id: 'deepseek-account', displayName: 'DeepSeek', credential: null, currency: 'CNY',
        balanceAPI: null,
        estimate: false,
        platformBalance: function () { return fetchDeepSeekAccountBalance(); },
      },
      openai: {
        id: 'openai', displayName: 'OpenAI', credential: 'OPENAI_API_KEY',
        balanceAPI: null, // 无公开余额 API → 记账回退
        estimate: true,
        initialTopUp: 20, // USD 起始充值额（内存态）
```

</details>

**依据 2 · 源码核查**：[lib/index.js:2268-2304](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/index.js#L2268-L2304)

凭据/真实fetch/超时与保留旧快照。

<details>
<summary>查看原文（37行）</summary>

```text
        let cred = null;
        try {
          cred = await ctx.credentials.resolve(prov.credential);
        } catch (err) {
          // 与下方 http/parse/exception 分支一致：失败保留旧 data/fetchedAt，仅换 error；seq guard 防慢请求覆盖新快照
          if (balanceSeq[pid] === seq) balances[pid] = { data: balances[pid] && balances[pid].data, fetchedAt: balances[pid] && balances[pid].fetchedAt, error: { kind: 'credentials', code: 'balance.credentials', message: t('error.balance.credentials') } };
          return;
        }
        if (!cred || !cred.value) {
          // no-key 同样保留旧快照：一次瞬断/未配置不把好数据清空（客户端据 error 显示配置引导/警示）
          if (balanceSeq[pid] === seq) balances[pid] = { data: balances[pid] && balances[pid].data, fetchedAt: balances[pid] && balances[pid].fetchedAt, error: { kind: 'no-key', code: 'balance.not-configured', params: { credential: prov.credential }, message: t('error.balance.not-configured', { credential: prov.credential }) } };
          return;
        }
        try {
          // API Key 经 HTTP 头传递，不进子进程命令行（避免 ps 可见 / shell 注入）
          const res = await fetch(freshBalanceURL(prov.balanceAPI), {
            headers: {
              Authorization: 'Bearer ' + cred.value,
              'Cache-Control': 'no-cache, no-store',
              Pragma: 'no-cache',
            },
            signal: timeoutSignal(HTTP_TIMEOUT_MS),
          });
          if (!res.ok) {
            if (balanceSeq[pid] === seq) balances[pid] = { data: balances[pid] && balances[pid].data, fetchedAt: balances[pid] && balances[pid].fetchedAt, error: { kind: 'http', code: 'request.http', message: t('error.request.http', { status: res.status }) } };
            return;
          }
          const body = await res.json();
          const parsed = prov.parseBalance(body);
          if (!parsed) {
            if (balanceSeq[pid] === seq) balances[pid] = { data: balances[pid] && balances[pid].data, fetchedAt: balances[pid] && balances[pid].fetchedAt, error: { kind: 'parse', code: 'request.parse', message: t('error.request.parse') } };
            return;
          }
          if (balanceSeq[pid] === seq) balances[pid] = { data: parsed, fetchedAt: Date.now(), error: null };
        } catch (err) {
          if (balanceSeq[pid] === seq) balances[pid] = { data: balances[pid] && balances[pid].data, fetchedAt: balances[pid] && balances[pid].fetchedAt, error: { kind: 'exception', message: String((err && err.message) || err) } };
        }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:2900-2935](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/index.js#L2900-L2935)

订阅按模式加载/缓存/错误。

<details>
<summary>查看原文（36行）</summary>

```text
    async function getSubscriptionSnapshotRpc(selection, force) {
      const sel = selection || modelSelection();
      const bm = selectionIsResolved(sel)
        ? detectBillingMode(sel.provider)
        : { mode: 'unknown', provider: '', reason: sel.reason || 'selection-unavailable' };
      const out = { mode: bm.mode, provider: sel.provider, reason: bm.reason, source: null, plan: null, planType: null, expiryAt: null, windows: [], balance: null, balanceUnit: null, fetchedAt: null, error: null };
      if (bm.mode !== 'subscription') return out;
      const sourceKey = subscriptionSourceFor(sel.provider);
      if (!sourceKey) return out;
      out.source = sourceKey;
      subscriptionEngine.markRequested(sourceKey); // 该源进入 60s 周期刷新
      subscriptionSourceProvider[sourceKey] = sel.provider; // 记住 provider（zai 系路由需要）
      const snap = subscriptionEngine.get(sourceKey);
      const nowMs = Date.now();
      // 失败退避：快照过期（>60s 无成功）且距上次失败 ≥ 退避期（60s）才重试——
      // 减少重复订阅请求，也避免“刷新失败”提示随每次轮询反复闪烁（失败期内直接读缓存快照）
      // force（客户端打开/刷新网页后的首启窗口）绕过新鲜度与失败退避，当场重查，
      // 让用户手动刷新页面时立刻拿到最新额度/余额，而不是干等下一轮自动刷新
      if (force || subscriptionEngine.isStale(sourceKey, SUBSCRIPTION_REFRESH_MS, SUBSCRIPTION_RETRY_BACKOFF_MS, nowMs)) {
        const inflight = subscriptionEngine.kick(sourceKey, subscriptionSourceProvider[sourceKey]);
        // 从未成功过（无旧数据）或强制刷新 → 等本次结果返回最新数据（含错误）；
        // 已有旧数据的普通刷新 → 后台刷新，本次直接返回快照（不阻塞轮询）
        if (!snap.data || force) await inflight;
      }
      const cur = subscriptionEngine.get(sourceKey);
      if (cur.data) {
        out.plan = cur.data.plan;
        out.windows = cur.data.windows;
        out.planType = cur.data.planType;
        out.expiryAt = cur.data.expiryAt;
        out.balance = typeof cur.data.balance === 'number' ? cur.data.balance : null;
        out.balanceUnit = cur.data.balanceUnit || null;
      }
      out.fetchedAt = cur.fetchedAt;
      out.error = cur.error;
      return out;
```

</details>

**依据 4 · 源码核查**：[lib/index.js:2740-2759](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/index.js#L2740-L2759)

云账单金额与tokens回退单位。

<details>
<summary>查看原文（20行）</summary>

```text
        const summaryRes = await fetch('https://api.fireworks.ai/v1/accounts/' + encodeURIComponent(accountId) + '/billing/summary?granularity=DAILY', {
          headers: { Authorization: 'Bearer ' + key },
          signal: timeoutSignal(HTTP_TIMEOUT_MS),
        });
        if (summaryRes.ok) {
          const spend = parseFireworksSummary(await summaryRes.json());
          if (spend == null) return { error: { kind: 'parse', code: 'request.parse', message: t('error.request.parse') } };
          return { data: { kind: 'billing', spend: Math.round(spend * 100) / 100, currency: 'USD', note: t('host.actualBillForThisPeriod') } };
        }
        if (summaryRes.status === 404) {
          const usageRes = await fetch('https://api.fireworks.ai/v1/accounts/' + encodeURIComponent(accountId) + '/billingUsage', {
            headers: { Authorization: 'Bearer ' + key },
            signal: timeoutSignal(HTTP_TIMEOUT_MS),
          });
          if (usageRes.ok) {
            const usage = parseFireworksUsage(await usageRes.json());
            if (usage != null) return { data: { kind: 'billing', usage: usage, usageUnit: 'tokens', currency: 'USD', note: t('host.actualUsageForThisPeriod') } };
            return { error: { kind: 'parse', code: 'request.parse', message: t('error.request.parse') } };
          }
          return { error: { kind: 'http', code: 'request.http', message: t('error.request.http', { status: usageRes.status }) } };
```

</details>

#### 缺口

- 未请求真实账号、逐服务核当前接口/计费权限。
  **影响**：不支持全提供商可用或数字权威性保证。
  **进一步探讨**：先对一个已有可信账户核时间/单位/错误与官方账单，不新增付费调用来验证。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · usage如何变成账本金额，哪些不是实际扣款？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

llm/stream透传原流，将usage视快照只取最后一次，finish或异常/结束时本stream用committed只记一次；没usage不记，上游拿流失败继续抛而不伪造空流。每次记账生成随机UUID，因此SQL按id去重只限制同一id，不是提供商requestId幂等；进程崩溃前未写或宿主重复触发同一调用的端到端去重未保证。中断有usage可记interrupted，但并不等请求退款。

金额先costOf静态/远程价目计算，只有billed==null才用usage.cost；注释称上报金额优先，实际分支恰好限定它是缺价回退。已有价格表即使提供方报了金额仍取表，且回算用记录时间/缓存输入/输出字段，不是支付结算。未知价格记unpriced，已有cost正常汇总冻结，仅无价回填；峰谷全空闲是假设重算，不是实际省钱。远程价目从可配置URL匿名读数字/币种表并同步worker，固定源码并不固定未来价目内容，本轮不引用其中数字为现价。

SQLite在worker，append事务把records与day/session/account聚合一起落，WAL/FULL、唯一id、目录0700/库0600有局部保护。客户端超时只是从pending移除并拒Promise，不取消已经送给worker的写入，可能出现持久已写但主线程收到未保存的未知结果；stream先置committed，失败不在本stream重试。worker fatal消息仅日志，error/exit才另置failed，不能照注释说所有fatal都会立即失败所有请求。无崩溃/并发实测，持久警告要回账本核对，不盲重复记账。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:3504-3562](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/index.js#L3504-L3562)

随机id/实际计价优先级/写失败。

<details>
<summary>查看原文（59行）</summary>

```text
    async function recordUsage(options, usage, status) {
      const u = usage || {};
      // 数值清洗：uncachedInputTokens 的 != null 对 NaN 恒真、|| 0 挡不住 Infinity/负值——
      // 统一 sanitizeTokens（NaN/Infinity/负数/非数字 → 0），坏数值不进内存汇总也不落盘
      const rec = {
        id: randomUUID(),
        ts: Date.now(),
        model: options.model || '',
        provider: options.provider || '',
        sessionId: options.sessionId || '',
        purpose: options.purpose || '',
        input: sanitizeTokens(u.uncachedInputTokens != null ? u.uncachedInputTokens : u.inputTokens),
        cacheRead: sanitizeTokens(u.cacheReadTokens),
        cacheWrite: sanitizeTokens(u.cacheWriteTokens),
        output: sanitizeTokens(u.outputTokens),
        status: status === 'interrupted' ? 'interrupted' : 'completed',
      };
      // 单调时间戳由账本 worker 在写入时保证（同毫秒并发也不会串会话），主线程不再查 lastTs。
      // Freeze the actual price at usage time.  Historical totals must not
      // change merely because the plugin's reference price table is updated.
      const billed = costOf(rec, false);
      // ① 聚合商在 usage 中直接给出的真实金额（如 OpenRouter 的 usage.cost）——
      //    官方报出的钱优先级最高，聚合商场景从此免维护静态价目表；
      // ② 价目表换算（当前各家官方单价）；③ 都没有 → unpriced 待启动回填。
      const reportedCost = parseFiniteNonNegativeAmount(u.cost);
      if (billed == null && reportedCost != null) {
        rec.cost = reportedCost;
        rec.currency = Object.hasOwn(PROVIDER_REPORTED_CURRENCY, rec.provider)
          ? PROVIDER_REPORTED_CURRENCY[rec.provider]
          : modelCurrency(rec.provider, rec.model);
        rec.pricingStatus = 'priced';
        rec.pricingVersion = 'provider-reported-' + packageVersion();
      } else if (billed != null) {
        rec.currency = modelCurrency(rec.provider, rec.model);
        rec.cost = billed;
        rec.pricingStatus = 'priced';
        rec.pricingVersion = 'builtin-' + packageVersion();
      } else {
        rec.pricingStatus = 'unpriced';
        rec.pricingVersion = null;
        // 诊断：理论上本插件任一实例的 PRICING 均应同步；若此处为 false 说明存在多副本或键名不匹配。
        // 每个模型仅首次出现时提醒一次，防止未收录模型（如订阅目录下的混合路由）高频刷日志
        const modelKey = createHash('sha256').update(rec.model).digest('hex');
        if (!unpricedWarnedModels.has(modelKey) && unpricedWarnedModels.size < 128) {
          unpricedWarnedModels.add(modelKey);
          console.warn('[dsh-bottom-info-bar] 记账未计价（每模型仅提示一次）：model="' + rec.model.slice(0, 200) + '" 价目表含该模型=' + Boolean(
            Object.hasOwn(PRICING, rec.model) || Object.hasOwn(PRICING, rec.provider + ':' + rec.model)
          ));
        }
      }
      const writeError = await appendUsageJournal(rec);
      if (writeError) {
        ledgerError = writeError;
        console.warn('[dsh-bottom-info-bar] 记账日志追加失败', writeError.message);
        return false;
      }
      perfCounters.recordUsageCount += 1;
      if (ledger && !ledger.warning) ledgerError = null;
      return true;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:3565-3604](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/index.js#L3565-L3604)

末次usage与单stream提交、错误透传。

<details>
<summary>查看原文（40行）</summary>

```text
    ctx.on('llm/stream', async function* (options, next) {
      try {
        activeUsageStreams += 1;
        let stream;
        try {
          stream = await next();
        } catch (err) {
          console.warn('[dsh-bottom-info-bar] llm/stream 获取失败，本次不记账', String((err && err.message) || err));
          throw err; // 保持错误向上传播：不把上游失败消化成空流（仅跳过记账逻辑）
        }
        let latestUsage = null;
        let sawFinish = false;
        let committed = false;
        async function commitUsage(status) {
          if (committed || !hasUsageTokens(latestUsage)) return;
          committed = true;
          try { await recordUsage(options, latestUsage, status); } catch (err) {
            ledgerError = { kind: 'journal-failed', message: String((err && err.message) || err), at: Date.now() };
            console.warn('[dsh-bottom-info-bar] 本次账单未保存', ledgerError.message);
          }
        }
        try {
          for await (const chunk of stream) {
            if (chunk && chunk.type === 'usage' && chunk.usage) {
              // DSH usage chunks are treated as snapshots.  Keep the last one
              // and commit it once when this model response finishes.
              latestUsage = Object.assign({}, chunk.usage);
            }
            if (chunk && chunk.type === 'finish') sawFinish = true;
            yield chunk;
          }
        } catch (err) {
          await commitUsage('interrupted');
          throw err;
        } finally {
          await commitUsage(sawFinish ? 'completed' : 'interrupted');
        }
      } finally {
        activeUsageStreams = Math.max(0, activeUsageStreams - 1);
      }
```

</details>

**依据 3 · 源码核查**：[lib/accounting.js:164-179](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/accounting.js#L164-L179)

冻结cost与价目换算。

<details>
<summary>查看原文（16行）</summary>

```text
  function costOf(record, forceOffpeak) {
    // v2 ledger records carry the charge as observed.  Use it for normal
    // reporting; only the "all-offpeak" forecast intentionally recalculates.
    if (!forceOffpeak && Number.isFinite(record.cost) && record.cost >= 0) return record.cost;
    const entry = pricingEntryFor(record.provider, record.model);
    if (!entry) return null;
    let p;
    if (entry.mode === 'peak-valley') {
      p = forceOffpeak ? entry.offpeak : entry[currentPeriod(record.ts)];
    } else {
      p = entry.price;
    }
    const missInput = record.input + record.cacheWrite;
    const cost = (missInput * p.inputCacheMiss + record.cacheRead * p.inputCacheHit + record.output * p.output) / 1e6;
    // 结果非有限（任一字段 NaN/Infinity/缺失）→ null；调用方统一 `c != null` 判空即排除，NaN 不会累加进任何汇总
    return Number.isFinite(cost) ? cost : null;
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1874-1877](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/index.js#L1874-L1877)

远程目录动态URL。

```text
    const REMOTE_PRICING_URL = process.env.DSH_BOTTOM_INFO_BAR_PRICING_URL
      || 'https://raw.githubusercontent.com/songoao25/dsh-bottom-info-bar/main/catalog/pricing.json';
    const REMOTE_PRICING_REFRESH_MS = 6 * 60 * 60 * 1000; // 定时刷新：6 小时
    const PRICING_CACHE_FILE = join(DATA_DIR, 'pricing-cache.json');
```

**依据 5 · 源码核查**：[lib/index.js:1908-1923](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/index.js#L1908-L1923)

同步worker后回填。

<details>
<summary>查看原文（16行）</summary>

```text
    function applyRemotePricingEntries(entries) {
      if (!entries) return 0;
      const n = accounting.setRemotePricingEntries(entries);
      if (n > 0 && ledgerClient && !LEDGER_DISABLED) {
        const synced = ledgerPricingChain
          .then(function () { return ledgerClient.setPricing(entries) })
          .catch(function (err) {
            console.warn('[dsh-bottom-info-bar] 远程价目同步到账本失败: ' + String((err && err.message) || err));
            return 0;
          });
        ledgerPricingChain = synced;
        synced.then(function () { return backfillUnpricedRecords() }).catch(function (err) {
          console.warn('[dsh-bottom-info-bar] 账本回填失败: ' + String((err && err.message) || err));
        });
      }
      return n;
```

</details>

**依据 6 · 源码核查**：[lib/ledger-store.js:154-177](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/ledger-store.js#L154-L177)

SQLite事务/WAL/权限与schema。

<details>
<summary>查看原文（24行）</summary>

```text
export function openLedgerStore(dir, hooks) {
  if (!DatabaseSync) throw problem('This DSH version cannot open the ledger. Update DSH to a version with Node.js 22.13 or newer; your existing ledger is unchanged.')
  mkdirSync(dir, { recursive: true, mode: 0o700 })
  chmodSync(dir, 0o700)
  const file = join(dir, LEDGER_FILE)
  const db = new DatabaseSync(file)
  const statements = new Map()
  const sql = text => { let s = statements.get(text); if (!s) { s = db.prepare(text); statements.set(text, s) } return s }
  const get = (text, ...args) => sql(text).get(...args)
  const run = (text, ...args) => sql(text).run(...args)
  function transaction(fn) { db.exec('BEGIN IMMEDIATE'); try { const value = fn(); db.exec('COMMIT'); return value } catch (err) { db.exec('ROLLBACK'); throw err } }
  function permissions() { for (const name of [file, file + '-wal', file + '-shm']) { if (existsSync(name)) chmodSync(name, 0o600) } }
  try {
    db.exec('PRAGMA busy_timeout=5000');
    if (get('PRAGMA user_version').user_version > 1) throw problem('This ledger needs a newer plugin version; no data has been changed.')
    db.exec(`PRAGMA busy_timeout=5000; PRAGMA cache_size=-8192; PRAGMA temp_store=FILE;
      PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA wal_autocheckpoint=256;
      CREATE TABLE IF NOT EXISTS meta(key TEXT PRIMARY KEY,value TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS records(seq INTEGER PRIMARY KEY,id TEXT NOT NULL UNIQUE,ts REAL NOT NULL,account TEXT NOT NULL,currency TEXT NOT NULL,cost REAL,offpeak REAL,folded INTEGER NOT NULL,payload TEXT NOT NULL);
      CREATE INDEX IF NOT EXISTS records_time ON records(ts);
      CREATE INDEX IF NOT EXISTS records_pending ON records(cost,seq);
      CREATE TABLE IF NOT EXISTS days(day TEXT,account TEXT,currency TEXT,input REAL,cacheRead REAL,cacheWrite REAL,output REAL,cost REAL,costOffpeak REAL,records INTEGER,unpriced INTEGER,PRIMARY KEY(day,account,currency));
      CREATE TABLE IF NOT EXISTS sessions(key TEXT PRIMARY KEY,account TEXT,norm TEXT,sessionId TEXT,input REAL,cacheRead REAL,cacheWrite REAL,output REAL,costs TEXT,minTs REAL,maxTs REAL,unpricedRecords INTEGER,unpricedTokens REAL);
      CREATE INDEX IF NOT EXISTS sessions_recent ON sessions(account,maxTs DESC);
```

</details>

**依据 7 · 源码核查**：[lib/ledger-store.js:201-216](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/ledger-store.js#L201-L216)

唯一id插入和聚合。

<details>
<summary>查看原文（16行）</summary>

```text
  function insertRecord(raw, index, source, boundary, archiveOnly = false) {
    if (!validRecord(raw)) return false
    const r = normalized(raw, index, source), payload = JSON.stringify(r)
    if (Buffer.byteLength(payload) > MAX_VALUE_BYTES) throw problem('Ledger entry exceeds the safe size limit; original files have been preserved.')
    const account = hooks.account(r) || '', currency = hooks.currency(r) || ''
    const cost = r.cost == null ? null : r.cost
    const offpeak = hooks.cost(r, true)
    const folded = archiveOnly || (boundary != null && r.ts < boundary && r.cost != null)
    const result = run('INSERT OR IGNORE INTO records(id,ts,account,currency,cost,offpeak,folded,payload) VALUES(?,?,?,?,?,?,?,?)', r.id, r.ts, account, currency, cost, offpeak, folded ? 1 : 0, payload)
    if (!result.changes || folded) return !!result.changes
    if (boundary == null || r.ts >= boundary) addDay(dayKey(r.ts), account, currency, { ...r, cost: cost || 0, costOffpeak: offpeak || 0, records: cost == null ? 0 : 1, unpriced: cost == null ? 1 : 0 })
    const rawKey = r.sessionId || (r.provider + '/' + r.model + '#' + r.ts)
    const key = account + '\0' + hooks.safeKey(rawKey)
    addSession(key, { ...r, account, costs: cost == null ? {} : { [currency]: cost }, minTs: r.ts, maxTs: r.ts, unpricedRecords: cost == null ? 1 : 0, unpricedTokens: cost == null ? r.input + r.cacheRead + r.cacheWrite + r.output : 0 })
    addAccount(account, cost || 0)
    return true
```

</details>

**依据 8 · 源码核查**：[lib/ledger-store.js:285-290](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/ledger-store.js#L285-L290)

append事务。

```text
  return {
    file, get warning() { return warning },
    append(r) { return transaction(() => insertRecord(r, 0, 'live', null)) },
    count() { return get('SELECT COUNT(*) n FROM records').n },
    lastTs() { return get('SELECT MAX(ts) ts FROM records').ts },
    providerSpend(account) { return get('SELECT cost FROM accounts WHERE account=?', account || '')?.cost || 0 },
```

**依据 9 · 源码核查**：[lib/ledger-client.js:76-104](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/ledger-client.js#L76-L104)

fatal仅日志、error失败。

<details>
<summary>查看原文（29行）</summary>

```text
  function onMessage(message) {
    if (!message || typeof message !== 'object') return
    if (message.type === 'fatal') {
      // worker 内部未捕获异常：标记账本不可用，后续调用走降级路径。
      if (state !== 'closed' && state !== 'failed') log('[dsh-bottom-info-bar] ledger worker fatal: ' + (message.error && message.error.message))
      return
    }
    const entry = pending.get(message.id)
    if (!entry) return
    pending.delete(message.id)
    if (pending.size === 0 && worker && typeof worker.unref === 'function') {
      try { worker.unref() } catch (err) { /* worker 已退出 */ }
    }
    if (message.ok) {
      entry.resolve(message.value)
    } else {
      const info = message.error || {}
      entry.reject(ledgerError(info.message || 'Ledger operation failed.', info.code, info.status))
    }
  }

  function onWorkerError(err) {
    if (state === 'closed') return
    const wrapped = ledgerError('Ledger worker failed: ' + String((err && err.message) || err), 'BIB_LEDGER_WORKER_FAILED')
    failure = wrapped
    setState('failed')
    startPromise = null
    settle(wrapped)
    log('[dsh-bottom-info-bar] ' + wrapped.message)
```

</details>

**依据 10 · 源码核查**：[lib/ledger-client.js:127-149](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/ledger-client.js#L127-L149)

超时移pending不取消worker写。

<details>
<summary>查看原文（23行）</summary>

```text
  function send(op, payload, timeoutMs) {
    return new Promise(function (resolve, reject) {
      if (state === 'failed') { reject(failure || ledgerError('Ledger is unavailable.', 'BIB_LEDGER_UNAVAILABLE')); return }
      if (state === 'closed') { reject(ledgerError('Ledger is closed.', 'BIB_LEDGER_CLOSED')); return }
      if (!worker) {
        try { worker = spawn() } catch (err) { reject(err); return }
      }
      const id = nextId += 1
      const timer = unrefTimer(setTimeout(function () {
        if (!pending.has(id)) return
        pending.delete(id)
        if (pending.size === 0 && worker && typeof worker.unref === 'function') {
          try { worker.unref() } catch (err) { /* worker 已退出 */ }
        }
        reject(ledgerError('The ledger worker did not answer "' + op + '" within ' + timeoutMs + ' ms.', 'BIB_LEDGER_TIMEOUT'))
      }, timeoutMs))
      pending.set(id, {
        resolve: function (value) { clearTimeout(timer); resolve(value) },
        reject: function (err) { clearTimeout(timer); reject(err) },
      })
      if (typeof worker.ref === 'function') worker.ref()
      try {
        worker.postMessage(Object.assign({ id: id, op: op }, payload))
```

</details>

#### 缺口

- 未做持久写失败/进程中断/多实例重复调用与价目正确性验收。
  **影响**：不能当全账户精确账单或恰好一次记录。
  **进一步探讨**：用无真实账号固定usage桩和临时账本核未知/失败/重放，再与官方单次账单对照。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 当前会话显示和管理面有什么完成/权限边界？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

Web从session模型目录取当前provider/model，切换后按selectionKey屏蔽旧账户字段；六RPC用allSettled，requestVersion/abort防迟到旧响应，30秒轮询逐端点保旧值和错误。这是显示一致性措施，不是多用户隔离。旧数据有refresh失败/持久警告，但字段可配置隐藏；用户只看数字仍可能忽略陈旧来源。

服务端以connection.requestRejection为共享鉴权前置，再限定ROUTES白名单、写动作POST；它承接宿主身份边界，本轮不审宿主认证，不称公网隔离已验证。表面不只读取：可清账本、改设置、下载安装/回滚自身。clear在activeUsageStreams>0时409，先写clear marker再清store和旧产物；产物清理失败可返回cleared:false但store.clear已完成，不能把false当没删数据。设置普通写失败保内存并返回warning，重启一致性另核。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:3606-3652](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/client.js#L3606-L3652)

模型选择/六RPC/版本与轮询。

<details>
<summary>查看原文（47行）</summary>

```text
      const loadVersionRef = React.useRef(0);
      const lastSelectionKeyRef = React.useRef('');
      const activeSessionModel = sessionModel && sessionModel.sessionId === sessionId ? sessionModel : null;
      const load = React.useCallback(function (selection) {
        // 周期顺带校准字段配置（宿主内存缓存，即回；插件页变更另有 CustomEvent 即时通道）
        refreshFieldConfig();
        const requestVersion = ++loadVersionRef.current;
        const activeSelection = selection || activeSessionModel;
        const selectionArgs = activeSelection ? { selection: { provider: activeSelection.provider, model: activeSelection.model } } : {};
        const balanceArgs = activeSelection
          ? { selection: { provider: activeSelection.provider, model: activeSelection.model } }
          : {};
        // 首启和切换模型后的第一次请求强制重查，之后的 30s 轮询走缓存节奏。
        // 这样切换回一个很久没用的服务商时不会等宿主下一轮 60s 定时器。
        const selectionKey = activeSelection ? activeSelection.provider + '\u0000' + activeSelection.model : '';
        const selectionChanged = selectionKey !== lastSelectionKeyRef.current;
        lastSelectionKeyRef.current = selectionKey;
        const force = selectionChanged || Date.now() - BOOT_AT < FORCE_REFRESH_WINDOW_MS;
        if (force) { selectionArgs.force = true; }
        const signal = abortRef.current ? abortRef.current.signal : null;
        // 逐接口容错：allSettled 等全部 settle（最坏 20s 超时兜底），任一失败只降级该端点，
        // 不拖垮其他成功数据；合并逻辑在 mergeLoadResults（失败端点保留旧值 + 记录错误）
        Promise.allSettled([
          rpc('getBalanceSnapshot', Object.assign(balanceArgs, force ? { force: true } : {}), signal),
          rpc('getPricing', selectionArgs, signal),
          rpc('getUsageSummary', Object.assign({ sessionId: sessionId }, selectionArgs), signal),
          rpc('getBillingMode', selectionArgs, signal),
          rpc('getSubscriptionSnapshot', selectionArgs, signal),
          rpc('getBillingStatus', selectionArgs, signal),
        ]).then(function (results) {
          // Do not allow a late A response to overwrite newly active B.
          if ((signal && signal.aborted) || requestVersion !== loadVersionRef.current) return;
          setState(function (s) { return mergeLoadResults(s, results, selectionKey); });
        });
      }, [resolveSessionId, activeSessionModel, sessionId]);

      React.useEffect(function () {
        load();
        const id = scheduleInterval(load, 30000);
        return function () { cancelInterval(id); };
      }, [load]);

      React.useEffect(function () {
        if (typeof document === 'undefined' || typeof document.addEventListener !== 'function') return undefined;
        const onLedgerChanged = function () { load(activeSessionModel || undefined); };
        document.addEventListener(BIB_LEDGER_EVENT, onLedgerChanged);
        return function () { document.removeEventListener(BIB_LEDGER_EVENT, onLedgerChanged); };
```

</details>

**依据 2 · 源码核查**：[lib/client.js:3732-3750](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/client.js#L3732-L3750)

切换时屏蔽旧账户。

<details>
<summary>查看原文（19行）</summary>

```text
      // While background RPCs catch up, render the newly activated session's
      // model and suppress details from the prior session rather than showing
      // a convincing but wrong provider/model combination.
      const waitForSessionModel = !!sessionId && !activeSessionModel;
      const activeSelectionKey = activeSessionModel ? activeSessionModel.provider + '\u0000' + activeSessionModel.model : '';
      // A new session/model is published before its six RPC responses return.
      // Mask every selection-scoped payload during that gap so the old account
      // can never appear beside the new provider/model, even for one render.
      const stateMatchesActiveSelection = !activeSessionModel || state.selectionKey === activeSelectionKey;
      const renderedState = stateMatchesActiveSelection ? state : {
        loading: true,
        selectionKey: activeSelectionKey,
        balance: null,
        pricing: null,
        usage: null,
        billingMode: null,
        sub: null,
        billing: null,
        errors: { balance: null, pricing: null, usage: null, billingMode: null, sub: null, billing: null },
```

</details>

**依据 3 · 源码核查**：[lib/client.js:4391-4413](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/client.js#L4391-L4413)

局部/持久警告依字段可见。

<details>
<summary>查看原文（23行）</summary>

```text
      // 全局降级提示：任一端点失败 → 旧数据照常渲染 + 角落提示（title 列出失败项），仅失败项降级
      const errors = renderedState.errors || {};
      const failedLabels = [];
      if (errors.balance) failedLabels.push(t('ui.balance.pushBalanceGroups'));
      if (errors.pricing) failedLabels.push(t('ui.pricing'));
      if (errors.usage) failedLabels.push(t('ui.spend'));
      if (errors.billingMode) failedLabels.push(t('ui.mode'));
      if (errors.sub) failedLabels.push(t('ui.subscriptionQuota'));
      if (errors.billing) failedLabels.push(t('ui.billing'));
      if (failedLabels.length > 0 && fieldVisible('refreshFailure')) {
        trailingErrorGroups.push(fieldSpan('refreshFailure', 'degraded',
          React.createElement('span', { className: 'bi-stale', key: 'degraded',
            title: failedLabels.join(t('ui.listSeparator')) + t('ui.temporarilyUnavailableKeepingTheLast') }, t('ui.refreshFailed'))));
      }
      const persistence = renderedState.usage && renderedState.usage.persistence;
      if (persistence && persistence.state && persistence.state !== 'ok' && fieldVisible('persistWarning')) {
        const snapshotOnly = persistence.state === 'snapshot-stale';
        trailingErrorGroups.push(fieldSpan('persistWarning', 'ledger-save', React.createElement('span', {
          className: snapshotOnly ? 'bi-stale' : 'bi-err',
          title: snapshotOnly
            ? t('ui.spendJournalSavedButThe') + (errorText(persistence) || t('ui.unknownReason'))
            : t('ui.thisSpendRecordWasNot') + (errorText(persistence) || t('ui.unknownReason')),
        }, snapshotOnly ? t('ui.ledgerUpdatePending') : t('ui.spendNotSaved'))));
```

</details>

**依据 4 · 源码核查**：[lib/index.js:4336-4368](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/index.js#L4336-L4368)

宿主鉴权与路由/POST限制。

<details>
<summary>查看原文（33行）</summary>

```text
    ctx.inject(['connection', 'webServer'], function (webCtx) {
      webCtx.effect(function () {
        const dispose = webCtx.webServer.register({
          kind: 'prefix',
          path: ROUTE_PREFIX,
          handler: async function (req, res) {
            let method = '';
            try {
              const rejection = webCtx.connection.requestRejection(req);
              if (rejection !== undefined) {
                respond(res, rejection, { error: rejection === 401 ? 'authentication required' : 'request rejected' });
                return;
              }
              const url = new URL(req.url || '/', 'http://localhost');
              const path = url.pathname;
              if (!path.startsWith(ROUTE_PREFIX + '/')) {
                respond(res, 404, { error: 'not found' });
                return;
              }
              method = decodeURIComponent(path.slice(ROUTE_PREFIX.length + 1));
              if (method === 'downloadUsageRecords') {
                if (req.method !== 'GET') { respond(res, 405, { error: 'downloads require GET' }); return; }
                await streamUsageExport(req, res, url.searchParams.get('format'));
                return;
              }
              const fn = Object.hasOwn(ROUTES, method) ? ROUTES[method] : null;
              if (typeof fn !== 'function') {
                respond(res, 404, { error: 'unknown method: ' + method });
                return;
              }
              if (Object.hasOwn(MUTATING, method) && req.method !== 'POST') {
                respond(res, 405, { error: 'mutating methods require POST' });
                return;
```

</details>

**依据 5 · 源码核查**：[lib/index.js:4096-4111](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/index.js#L4096-L4111)

清账本阶段与失败返回。

<details>
<summary>查看原文（16行）</summary>

```text
      clearUsageRecords: async function () {
        if (activeUsageStreams > 0) {
          const err = new Error(t('host.usageLedgerBusy'));
          err.status = 409;
          throw err;
        }
        const store = await requireLedger();
        writeFileAtomic(LEDGER_CLEAR_MARKER_FILE, JSON.stringify({ requestedAt: Date.now() }), t);
        const count = await store.clear();
        try {
          clearLedgerArtifacts();
          ledgerError = null;
          return { cleared: true, recordCount: count, warning: null };
        } catch (err) {
          ledgerError = { kind: 'clear-failed', code: 'ledger.clear-failed', message: t('error.ledger.clear-failed', { value: String(err.message || err) }), at: Date.now() };
          return { cleared: false, recordCount: count, warning: ledgerError.message };
```

</details>

**依据 6 · 源码核查**：[lib/index.js:2153-2162](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/index.js#L2153-L2162)

设置失败保内存/警告。

<details>
<summary>查看原文（10行）</summary>

```text
    function persistSettings() {
      // 落盘失败不阻断内存态生效（本会话内一致），但显式 warn 并把结果带回客户端
      try {
        writeFileAtomic(SETTINGS_FILE, JSON.stringify(fieldSettings), t);
        return null;
      } catch (err) {
        // 稳定 code + 文案一起回传：客户端按 code 取当前语言的文案（字典缺失才退回这里这句）。
        const failure = { code: 'settings.save-failed', message: t('error.settings.save-failed', { value: String((err && err.message) || err) }) };
        console.warn('[dsh-bottom-info-bar] ' + failure.message);
        return failure;
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 自更新是否只检查，更新成功代表正在跑新版吗？

**研究主题**：工程质量与复用、依赖、兼容与流程

#### 完整回答

对被判定profile安装的实例，默认autoUpdate=true，启动有延迟流程；源码/link资格受isLoadedAsProfilePlugin约束，环境off可禁。不能把信息栏当纯被动读数，默认可下载并改自身。check模式查版本不下载替换，但会saveState/日志，不能称完全不写磁盘；install走npm registry latest，强制要求integrity存在，下载tarball后校验sha512、包名/版本及路径，拒符号链接目标，再备份+逐文件temp/rename。

整批不是原子事务，失败调用rollback再清备份，rollback本身异常可能打断恢复；本轮未注入失败，不称必定完整回滚。registry的hash与包来自同一信任源，不等独立签名审计。磁盘版本与runningVersion分开，更新完成需重启激活；只升不降、回滚hold与手动模式有真实分支，但不据静态代码保证所有布局可靠。需要稳定复核同版/保留工作区的人，应先关闭自动安装；已改磁盘文件、备份和当前加载状态分别核对。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1695-1706](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/index.js#L1695-L1706)

启动资格/env禁用与延迟。

<details>
<summary>查看原文（12行）</summary>

```text
    // ---------- 自更新（2026-09-25 用户拍板：一键自更新 + 全自动，除重启）----------
    // 宿主插件管理只有「安装 / 卸载 / 启用 / 停用」，没有「更新」，对已安装的包再填同一地址会被
    // inspect 以 already-installed 拦下 —— 用户侧原本唯一路径是「卸载 → 重装」。本插件零运行时依赖，
    // 因此「更新」只需替换包内自己的文件。五条硬边界见 src/self-update.js 顶部与决策文档。
    // 启动后延迟触发，避开宿主启动高峰；任何失败只记状态，绝不打断信息栏。
    // 环境变量 DSH_BOTTOM_INFO_BAR_SELF_UPDATE=off 可整体禁用（测试隔离用，见 tests/run-all.mjs）；
    // 另外只有「确实被当作 profile 插件装载」时才启用（见 isLoadedAsProfilePlugin：开发副本与
    // link: 安装天然排除，后者自更新会改写用户的工作副本）。
    const SELF_UPDATE_ENABLED = process.env.DSH_BOTTOM_INFO_BAR_SELF_UPDATE !== 'off' && isLoadedAsProfilePlugin()
    // 首次自动检查/安装的延迟：默认 30 秒 + 0–5 秒抖动（见 src/self-update.js 的 selfUpdateDelayMs）。
    // 原来固定 8 秒，恰好落在宿主自己的启动窗口里；issue #260 之后整体后移，并可用环境变量覆盖。
    const SELF_UPDATE_DELAY_MS = selfUpdateDelayMs(process.env)
```

</details>

**依据 2 · 源码核查**：[lib/self-update.js:374-405](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/self-update.js#L374-L405)

默认autoUpdate与状态恢复。

<details>
<summary>查看原文（32行）</summary>

```text
  const runningVersion = typeof config.runningVersion === 'string' ? config.runningVersion : '0.0.0'
  const fetchImpl = config.fetch || ((...args) => fetch(...args))
  const now = config.now || (() => Date.now())
  const log = typeof config.log === 'function' ? config.log : () => {}
  const stateFile = join(dataDir, 'update-state.json')
  const logFile = join(dataDir, 'update-log.jsonl')
  const backupRoot = join(dataDir, 'update-backup')
  const keepBackups = Number.isInteger(config.keepBackups) ? config.keepBackups : 3
  const timeoutMs = Number.isFinite(config.timeoutMs) ? config.timeoutMs : 60000
  const maxBytes = Number.isFinite(config.maxBytes) ? config.maxBytes : 8 * 1024 * 1024
  const autoInstallAllowed = typeof config.autoInstallAllowed === 'function' ? config.autoInstallAllowed : () => true

  // holdVersion：用户回滚过的版本。回滚是「新版有问题」时的逃生门，若重启后 8 秒的自动检查又把它
  // 装回来，等于逃生门自己会关上。因此回滚后只暂缓「正好等于该版本」的更新，更高版本照常进行。
  let state = { autoUpdate: true, pendingVersion: null, holdVersion: null, updatedAt: null, lastError: null, lastCheckAt: null }
  // 并发去重按动作分槽：检查是纯读、安装是写，两者语义不同，不能共用一个在途 promise ——
  // 共用会让「检查在跑时来的安装请求」变成什么都不做的空转（拿到的是检查的结果）。
  const inFlight = { check: null, install: null }

  function loadState() {
    try {
      const parsed = JSON.parse(readFileSync(stateFile, 'utf8'))
      if (parsed && typeof parsed === 'object') {
        state = {
          autoUpdate: parsed.autoUpdate !== false,
          pendingVersion: typeof parsed.pendingVersion === 'string' ? parsed.pendingVersion : null,
          holdVersion: typeof parsed.holdVersion === 'string' ? parsed.holdVersion : null,
          updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : null,
          lastError: typeof parsed.lastError === 'string' ? parsed.lastError : null,
          lastCheckAt: typeof parsed.lastCheckAt === 'number' ? parsed.lastCheckAt : null,
        }
      }
```

</details>

**依据 3 · 源码核查**：[lib/self-update.js:435-473](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/self-update.js#L435-L473)

registry/强制integrity与下载超时。

<details>
<summary>查看原文（39行）</summary>

```text
  async function fetchLatestRelease() {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetchImpl(UPDATE_REGISTRY_ORIGIN + '/' + PACKAGE_NAME + '/latest', {
        headers: { accept: 'application/json' },
        signal: controller.signal,
      })
      if (!response.ok) return null
      const body = await response.json()
      if (!body || typeof body.version !== 'string') return null
      // 纵深防御：版本号会被拼进下载地址、写进状态文件、并参与版本比对，只接受规范 x.y.z。
      if (parseSemver(body.version) === null) return null
      const integrity = body.dist && typeof body.dist.integrity === 'string' ? body.dist.integrity : null
      // 拿不到校验值就不更新：宁可停在当前版本，也不去装一个无法验证的包 ——
      // 本模块会替换自己的全部文件，校验链上不允许有"静默跳过"的分支。
      // npm 对已发布版本始终提供 dist.integrity，缺失只可能是应答被动了手脚。
      if (!integrity) return null
      return { version: body.version, integrity }
    } catch {
      return null
    } finally {
      clearTimeout(timer)
    }
  }

  async function downloadTarball(version) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const url = UPDATE_REGISTRY_ORIGIN + '/' + PACKAGE_NAME + '/-/' + PACKAGE_NAME + '-' + version + '.tgz'
      const response = await fetchImpl(url, { headers: { accept: 'application/octet-stream' }, signal: controller.signal })
      if (!response.ok) throw new Error('download failed: http ' + response.status)
      const buffer = Buffer.from(await response.arrayBuffer())
      if (buffer.length === 0) throw new Error('download failed: empty body')
      if (buffer.length > maxBytes) throw new Error('download failed: too large (' + buffer.length + ' bytes)')
      return buffer
    } finally {
      clearTimeout(timer)
```

</details>

**依据 4 · 源码核查**：[lib/self-update.js:248-270](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/self-update.js#L248-L270)

包身份/sha512/路径校验。

<details>
<summary>查看原文（23行）</summary>

```text
  const manifestFile = files.find((file) => file.path === 'package.json')
  if (!manifestFile) throw new Error('payload has no package.json')
  let manifest
  try {
    manifest = JSON.parse(manifestFile.data.toString('utf8'))
  } catch {
    throw new Error('payload package.json is not valid JSON')
  }
  if (manifest.name !== PACKAGE_NAME) throw new Error('payload package name mismatch: ' + String(manifest.name))
  if (version && manifest.version !== version) throw new Error('payload version mismatch: ' + String(manifest.version) + ' != ' + version)
  if (parseSemver(manifest.version) === null) throw new Error('payload version is not semver: ' + String(manifest.version))
  if (typeof integrity === 'string' && integrity.length > 0) {
    const [algorithm, expected] = integrity.split('-')
    // 给了校验值就必须验得动：算法不是 sha512 一律拒绝，绝不「看不懂就跳过校验」。
    if (algorithm !== 'sha512' || !expected) throw new Error('payload integrity uses an unsupported algorithm: ' + String(algorithm))
    const digest = createHash('sha512').update(options.tarball).digest('base64')
    if (digest !== expected) throw new Error('payload integrity mismatch')
  }
  for (const file of files) {
    if (!isAllowedPayloadPath(file.path)) throw new Error('payload path not allowed: ' + file.path)
    if (resolveSafePath('/', file.path) === null) throw new Error('payload path escapes: ' + file.path)
  }
  return manifest
```

</details>

**依据 5 · 源码核查**：[lib/self-update.js:296-339](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/self-update.js#L296-L339)

预检、备份、逐文件替换与失败回滚。

<details>
<summary>查看原文（44行）</summary>

```text
export function applyPayload(files, context) {
  const { packageDir, backupDir, log } = context || {}
  if (!packageDir || !backupDir) throw new Error('applyPayload needs packageDir and backupDir')
  if (!Array.isArray(files)) throw new Error('applyPayload needs files')
  // 先完整预检，避免一个后置的异常路径导致前面的合法文件已经被替换。
  const targets = files.map((file) => {
    const path = file && file.path
    const target = resolveSafePayloadTarget(packageDir, path)
    if (!target) throw new Error('refusing to write outside package or through a symbolic link: ' + String(path))
    return { file, target }
  })
  const before = listPayloadFiles(packageDir)
  // 备份当前内容（含目录结构），用于失败回滚
  rmSync(backupDir, { recursive: true, force: true })
  mkdirSync(backupDir, { recursive: true })
  const backedUp = []
  for (const relative of before) {
    const source = resolveSafePath(packageDir, relative)
    const target = resolveSafePath(backupDir, relative)
    if (!source || !target || !existsSync(source)) continue
    mkdirSync(dirname(target), { recursive: true })
    copyFileSync(source, target)
    backedUp.push(relative)
  }
  const restoredFiles = () => {
    rmSync(backupDir, { recursive: true, force: true })
  }
  const written = []
  try {
    for (const entry of targets) {
      const { file, target } = entry
      mkdirSync(dirname(target), { recursive: true })
      const temp = target + '.update-tmp'
      writeFileSync(temp, file.data)
      renameSync(temp, target)
      written.push(file.path)
    }
  } catch (error) {
    rollbackPayload({ packageDir, backupDir, before: backedUp, written })
    restoredFiles()
    if (typeof log === 'function') log('update rolled back: ' + error.message)
    throw error
  }
  return { before: backedUp, written, backupDir }
```

</details>

**依据 6 · 源码核查**：[lib/self-update.js:502-532](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/self-update.js#L502-L532)

check模式仍保存状态，磁盘与运行版。

<details>
<summary>查看原文（31行）</summary>

```text
    // 用户点「检查更新」只是想确认有没有新版，而本引擎从前的 runOnce 只有一条路 —— 检查、下载、
    // 替换一气做完，于是「检查更新」按钮等于「立即安装」（用户原话：「点了一下就直接装好了」）。
    // mode:'check' 在确认远端确实更高之后立刻返回：不下载、不替换、不碰备份、不记 lastError
    // （除非这次检查本身失败），因此它对磁盘是纯读的。
    const checkOnly = !!(options && options.mode === 'check')
    const latest = await fetchLatestRelease()
    state.lastCheckAt = now()
    if (!latest) {
      state.lastError = manual ? 'check-failed' : state.lastError
      saveState()
      appendLog({ event: 'check-failed' })
      return Object.assign({}, state, { latest: null })
    }
    // 只升不降：等于或低于运行中版本一律不动
    if (compareSemver(latest.version, runningVersion) <= 0) {
      // 这里绝不抹掉 pendingVersion。它同时承担两个身份：① 「刚替换到磁盘的版本」；
      // ② 回滚时定位备份目录的唯一线索。升级成功→用户重启→运行版本追平 latest，重启后
      // 8 秒的这次检查就会走到本分支；若在此清空，用户「新版有问题想回滚」时逃生门已被焊死
      // （rollback() 会返回 nothing-to-roll-back）。「待重启」由 UI 用 diskVersion 与 runningVersion
      // 是否相等判定，不依赖本字段被清空 —— 2026-09-25 由 tests/test-self-update.mjs 抓出。
      state.lastError = null
      saveState()
      return Object.assign({}, state, { latest: latest.version })
    }
    if (checkOnly) {
      // 到这里已经证明「远端确实比在跑的版本高」，检查的使命就结束了。
      // 上一次检查的失败记录在这里清掉（网络恢复了）；更新失败的记录必须留着 ——
      // 「上次更新失败」是界面上的逃生门依据，不能被一次顺利的检查顺手抹掉。
      if (state.lastError && describeUpdateError(state.lastError) === 'check-failed') state.lastError = null
      saveState()
      return Object.assign({}, state, { latest: latest.version, checkedOnly: true })
```

</details>

**依据 7 · 源码核查**：[lib/self-update.js:550-575](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/self-update.js#L550-L575)

关闭自动安装、安装与错误状态。

<details>
<summary>查看原文（26行）</summary>

```text
    if (!state.autoUpdate && !manual) {
      saveState()
      return Object.assign({}, state, { latest: latest.version, skipped: 'auto-disabled' })
    }
    if (!manual && !autoInstallAllowed()) {
      saveState()
      return Object.assign({}, state, { latest: latest.version, skipped: 'page-visited' })
    }
    try {
      if (!await performUpdate(latest, manual)) {
        saveState()
        return Object.assign({}, state, { latest: latest.version, skipped: 'page-visited' })
      }
      state.pendingVersion = latest.version
      // 装上了一个「不等于暂缓版本」的新版：暂缓自动解除（回滚过的那个旧版本已被越过）
      state.holdVersion = null
      state.updatedAt = now()
      state.lastError = null
      saveState()
      appendLog({ event: 'updated', version: latest.version })
    } catch (error) {
      // 状态里只存代号（界面据此翻译成人话），原始报错写进日志供排查。
      const raw = error && error.message ? error.message : 'update-failed'
      state.lastError = describeUpdateError(raw)
      saveState()
      appendLog({ event: 'update-failed', version: latest.version, kind: state.lastError, message: raw })
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 谁如何最小采用，全周期成本是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

可有条件试用：已有DSH且常需知道当前账号/会话花费的人，在专用profile先关闭自更新安装，保留原账户页和原生usage，只看一个已有提供商；不额外请求付费模型来“测余额”。核当前provider、货币/额度单位、fetchedAt、账本开始时间与unpriced/保存警告，观察一条本来就要进行的非关键调用后官方账单与本地估算差异。零usage/无价不能当免费，失败保旧数据不能当实时。

首次有Node/SQLite支持、宿主client/credentials、已有账户API权限与持久目录；持续有账户轮询、远程价目/更新检查、worker磁盘及模型原有费用，插件本身不需要额外LLM来画栏也不等运行零费。失败恢复先分API陈旧、无价、写结果未知与更新待重启，不盲清账本或重发调用。退出关闭/卸载后核timer/worker和自更新任务，保留导出/备份再另行决定清账本，撤插件不会撤提供商账单。若模型/账号显示错位、估算误导预算或持久失败难解释，就停用回官方账户页与原生usage；本轮不提供现价/节费或时长保证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:3565-3604](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/index.js#L3565-L3604)

监听已有流而非另起推理。

<details>
<summary>查看原文（40行）</summary>

```text
    ctx.on('llm/stream', async function* (options, next) {
      try {
        activeUsageStreams += 1;
        let stream;
        try {
          stream = await next();
        } catch (err) {
          console.warn('[dsh-bottom-info-bar] llm/stream 获取失败，本次不记账', String((err && err.message) || err));
          throw err; // 保持错误向上传播：不把上游失败消化成空流（仅跳过记账逻辑）
        }
        let latestUsage = null;
        let sawFinish = false;
        let committed = false;
        async function commitUsage(status) {
          if (committed || !hasUsageTokens(latestUsage)) return;
          committed = true;
          try { await recordUsage(options, latestUsage, status); } catch (err) {
            ledgerError = { kind: 'journal-failed', message: String((err && err.message) || err), at: Date.now() };
            console.warn('[dsh-bottom-info-bar] 本次账单未保存', ledgerError.message);
          }
        }
        try {
          for await (const chunk of stream) {
            if (chunk && chunk.type === 'usage' && chunk.usage) {
              // DSH usage chunks are treated as snapshots.  Keep the last one
              // and commit it once when this model response finishes.
              latestUsage = Object.assign({}, chunk.usage);
            }
            if (chunk && chunk.type === 'finish') sawFinish = true;
            yield chunk;
          }
        } catch (err) {
          await commitUsage('interrupted');
          throw err;
        } finally {
          await commitUsage(sawFinish ? 'completed' : 'interrupted');
        }
      } finally {
        activeUsageStreams = Math.max(0, activeUsageStreams - 1);
      }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:4053-4067](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/index.js#L4053-L4067)

首请求/force账户刷新。

<details>
<summary>查看原文（15行）</summary>

```text
      getBalanceSnapshot: async function (args) {
        const sel = selectionFromArgs(args);
        // force：客户端刚打开/刷新网页时的强制刷新——当场重查服务商，不等 60s 周期缓存
        const force = !!(args && typeof args === 'object' && args.force === true);
        if (selectionIsResolved(sel)) {
          const key = balanceProviderKey(sel.provider);
          if (key) {
            const firstRequest = markBalanceRequested(key);
            // 首次看到某个账户时也要完成一次初始读取；之后仅由 force 或 60s
            // 后台周期刷新。这样冷启动不轮询无关账户，同时首个非 force RPC
            // 不会拿到一个看似“还没请求过”的空快照。
            if (force || firstRequest) await refreshProviderBalance(key, true);
          }
        }
        return activeBalanceSummary(Date.now(), sel);
```

</details>

**依据 3 · 源码核查**：[lib/index.js:3865-3883](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/index.js#L3865-L3883)

无账本汇总缺失不补零。

<details>
<summary>查看原文（19行）</summary>

```text
    function usageSummaryUnavailable(nowMs) {
      return {
        sessions: null, calibration: null, currentSession: null, spend: null, todaySpend: null,
        monthSpend: null, last30dSpend: null, totalSpend: null,
        persistence: ledgerError
          ? { state: ledgerError.kind, code: ledgerError.code || null, message: ledgerError.message, at: ledgerError.at || null }
          : { state: 'ok', code: null, message: null, at: null },
        now: nowMs,
      };
    }

    async function getUsageSummary(nowMs, sessionId, selection) {
      const sel = selection || modelSelection();
      if (!selectionIsResolved(sel)) return null;
      // v1.6：计算当前活跃账户，用于会话聚合过滤
      const activeAccount = accountForProvider(sel.provider);
      // 账本跑在 worker 线程里：短暂等待启动，超时按「初始化中」降级 —— 绝不在主线程上等 sqlite。
      if (!ledger) await waitForLedger(LEDGER_SUMMARY_WAIT_MS);
      if (!ledger) return usageSummaryUnavailable(nowMs);
```

</details>

**依据 4 · 源码核查**：[lib/client.js:4391-4413](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/client.js#L4391-L4413)

用户应核警告。

<details>
<summary>查看原文（23行）</summary>

```text
      // 全局降级提示：任一端点失败 → 旧数据照常渲染 + 角落提示（title 列出失败项），仅失败项降级
      const errors = renderedState.errors || {};
      const failedLabels = [];
      if (errors.balance) failedLabels.push(t('ui.balance.pushBalanceGroups'));
      if (errors.pricing) failedLabels.push(t('ui.pricing'));
      if (errors.usage) failedLabels.push(t('ui.spend'));
      if (errors.billingMode) failedLabels.push(t('ui.mode'));
      if (errors.sub) failedLabels.push(t('ui.subscriptionQuota'));
      if (errors.billing) failedLabels.push(t('ui.billing'));
      if (failedLabels.length > 0 && fieldVisible('refreshFailure')) {
        trailingErrorGroups.push(fieldSpan('refreshFailure', 'degraded',
          React.createElement('span', { className: 'bi-stale', key: 'degraded',
            title: failedLabels.join(t('ui.listSeparator')) + t('ui.temporarilyUnavailableKeepingTheLast') }, t('ui.refreshFailed'))));
      }
      const persistence = renderedState.usage && renderedState.usage.persistence;
      if (persistence && persistence.state && persistence.state !== 'ok' && fieldVisible('persistWarning')) {
        const snapshotOnly = persistence.state === 'snapshot-stale';
        trailingErrorGroups.push(fieldSpan('persistWarning', 'ledger-save', React.createElement('span', {
          className: snapshotOnly ? 'bi-stale' : 'bi-err',
          title: snapshotOnly
            ? t('ui.spendJournalSavedButThe') + (errorText(persistence) || t('ui.unknownReason'))
            : t('ui.thisSpendRecordWasNot') + (errorText(persistence) || t('ui.unknownReason')),
        }, snapshotOnly ? t('ui.ledgerUpdatePending') : t('ui.spendNotSaved'))));
```

</details>

**依据 5 · 源码核查**：[lib/self-update.js:388-405](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/self-update.js#L388-L405)

需先关注自动更新。

<details>
<summary>查看原文（18行）</summary>

```text
  let state = { autoUpdate: true, pendingVersion: null, holdVersion: null, updatedAt: null, lastError: null, lastCheckAt: null }
  // 并发去重按动作分槽：检查是纯读、安装是写，两者语义不同，不能共用一个在途 promise ——
  // 共用会让「检查在跑时来的安装请求」变成什么都不做的空转（拿到的是检查的结果）。
  const inFlight = { check: null, install: null }

  function loadState() {
    try {
      const parsed = JSON.parse(readFileSync(stateFile, 'utf8'))
      if (parsed && typeof parsed === 'object') {
        state = {
          autoUpdate: parsed.autoUpdate !== false,
          pendingVersion: typeof parsed.pendingVersion === 'string' ? parsed.pendingVersion : null,
          holdVersion: typeof parsed.holdVersion === 'string' ? parsed.holdVersion : null,
          updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : null,
          lastError: typeof parsed.lastError === 'string' ? parsed.lastError : null,
          lastCheckAt: typeof parsed.lastCheckAt === 'number' ? parsed.lastCheckAt : null,
        }
      }
```

</details>

#### 缺口

- 未运行宿主/真实账号或测时间、费用、误导率与净价值。
  **影响**：只支持单账户可退出的辅助显示试用，不能代财务核算。
  **进一步探讨**：对照一条已有调用记来源/单位/时点/差异/维护时间；超预算仍以官方账单为准。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 可证伪的下一步改进是什么？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是把每个金额显式标成“提供方上报/价目估算/无价/持久结果待核”，并针对写超时做同一记录id查询后对账，再考虑重试；现有pricingStatus/persistence/fetchedAt已有基础。增量是让读者和恢复逻辑都知道数字的证据来源，而不是加更多模型/服务商或宣称预测能省钱。

最小对照使用静态表与reportedCost冲突、写已提交但回执超时、账户API失败保旧值三类离线样本，比较金额权威性误判、重复记录与恢复时间。成本是UI密度、状态迁移/查询与幂等维护；若误判未下降反而让常规单账户更难读，就否定。没有真实需求/业务收益验证，不计为现有功能。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:3522-3558](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/index.js#L3522-L3558)

金额来源实际分支与写失败。

<details>
<summary>查看原文（37行）</summary>

```text
      // Freeze the actual price at usage time.  Historical totals must not
      // change merely because the plugin's reference price table is updated.
      const billed = costOf(rec, false);
      // ① 聚合商在 usage 中直接给出的真实金额（如 OpenRouter 的 usage.cost）——
      //    官方报出的钱优先级最高，聚合商场景从此免维护静态价目表；
      // ② 价目表换算（当前各家官方单价）；③ 都没有 → unpriced 待启动回填。
      const reportedCost = parseFiniteNonNegativeAmount(u.cost);
      if (billed == null && reportedCost != null) {
        rec.cost = reportedCost;
        rec.currency = Object.hasOwn(PROVIDER_REPORTED_CURRENCY, rec.provider)
          ? PROVIDER_REPORTED_CURRENCY[rec.provider]
          : modelCurrency(rec.provider, rec.model);
        rec.pricingStatus = 'priced';
        rec.pricingVersion = 'provider-reported-' + packageVersion();
      } else if (billed != null) {
        rec.currency = modelCurrency(rec.provider, rec.model);
        rec.cost = billed;
        rec.pricingStatus = 'priced';
        rec.pricingVersion = 'builtin-' + packageVersion();
      } else {
        rec.pricingStatus = 'unpriced';
        rec.pricingVersion = null;
        // 诊断：理论上本插件任一实例的 PRICING 均应同步；若此处为 false 说明存在多副本或键名不匹配。
        // 每个模型仅首次出现时提醒一次，防止未收录模型（如订阅目录下的混合路由）高频刷日志
        const modelKey = createHash('sha256').update(rec.model).digest('hex');
        if (!unpricedWarnedModels.has(modelKey) && unpricedWarnedModels.size < 128) {
          unpricedWarnedModels.add(modelKey);
          console.warn('[dsh-bottom-info-bar] 记账未计价（每模型仅提示一次）：model="' + rec.model.slice(0, 200) + '" 价目表含该模型=' + Boolean(
            Object.hasOwn(PRICING, rec.model) || Object.hasOwn(PRICING, rec.provider + ':' + rec.model)
          ));
        }
      }
      const writeError = await appendUsageJournal(rec);
      if (writeError) {
        ledgerError = writeError;
        console.warn('[dsh-bottom-info-bar] 记账日志追加失败', writeError.message);
        return false;
```

</details>

**依据 2 · 源码核查**：[lib/ledger-client.js:134-149](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/ledger-client.js#L134-L149)

写超时回执未知。

<details>
<summary>查看原文（16行）</summary>

```text
      const id = nextId += 1
      const timer = unrefTimer(setTimeout(function () {
        if (!pending.has(id)) return
        pending.delete(id)
        if (pending.size === 0 && worker && typeof worker.unref === 'function') {
          try { worker.unref() } catch (err) { /* worker 已退出 */ }
        }
        reject(ledgerError('The ledger worker did not answer "' + op + '" within ' + timeoutMs + ' ms.', 'BIB_LEDGER_TIMEOUT'))
      }, timeoutMs))
      pending.set(id, {
        resolve: function (value) { clearTimeout(timer); resolve(value) },
        reject: function (err) { clearTimeout(timer); reject(err) },
      })
      if (typeof worker.ref === 'function') worker.ref()
      try {
        worker.postMessage(Object.assign({ id: id, op: op }, payload))
```

</details>

**依据 3 · 源码核查**：[lib/index.js:2291-2303](https://github.com/songoao25/dsh-bottom-info-bar/blob/ab106842d81f19198a296e3292e9a1e82823f4bc/lib/index.js#L2291-L2303)

远端失败保旧值。

<details>
<summary>查看原文（13行）</summary>

```text
          if (!res.ok) {
            if (balanceSeq[pid] === seq) balances[pid] = { data: balances[pid] && balances[pid].data, fetchedAt: balances[pid] && balances[pid].fetchedAt, error: { kind: 'http', code: 'request.http', message: t('error.request.http', { status: res.status }) } };
            return;
          }
          const body = await res.json();
          const parsed = prov.parseBalance(body);
          if (!parsed) {
            if (balanceSeq[pid] === seq) balances[pid] = { data: balances[pid] && balances[pid].data, fetchedAt: balances[pid] && balances[pid].fetchedAt, error: { kind: 'parse', code: 'request.parse', message: t('error.request.parse') } };
            return;
          }
          if (balanceSeq[pid] === seq) balances[pid] = { data: parsed, fetchedAt: Date.now(), error: null };
        } catch (err) {
          if (balanceSeq[pid] === seq) balances[pid] = { data: balances[pid] && balances[pid].data, fetchedAt: balances[pid] && balances[pid].fetchedAt, error: { kind: 'exception', message: String((err && err.message) || err) } };
```

</details>

#### 缺口

- 未证明用户误判频率和对账策略净收益。
  **影响**：只形成设计候选。
  **进一步探讨**：先用三类故障样本评估误判、重复和额外界面负担。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
