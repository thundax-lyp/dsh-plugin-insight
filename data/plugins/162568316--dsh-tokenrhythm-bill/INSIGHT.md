# TokenRhythm Bill

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[4d9800c](https://github.com/162568316/dsh-tokenrhythm-bill/tree/4d9800cc534fde8dfd06e99bfe94b6af81c25d31)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/162568316/dsh-tokenrhythm-bill) [![npm 30d 1,484](https://img.shields.io/static/v1?label=npm+30d&message=1%2C484&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tokenrhythm-bill) [![最新发布 2026-10-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tokenrhythm-bill)
<!-- END META -->

> **功能**：为多平台 DSH 用户聚合余额、用量、模型连通检测和密钥管理，并在会话头显示账户余额或套餐角标。

> **亮点**：多协议/账号与面板集成，已有partial/null/单飞/轻快照减少局部重复；0.7.5增加Host页签布局适配，未改核心身份/授权逻辑。见[Q01](#research-q01)、[Q04](#research-q04)。

> **主要限制**：秘密按需GET/宿主key-use依赖Host权限；modelId及基元归属缓存缺身份，静默state保存和固定tmp/旧orig回滚可误示成功。见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 谁需要聚合账单，真实入口与基线增量？](#detail-section-11)
  - [Q02 · 密钥/密码/宿主凭据路由如何授权与持久化？](#detail-section-12)
  - [Q03 · 余额角标/检测缓存到底绑定哪个身份？](#detail-section-13)
  - [Q04 · 账单窗口/partial/null和网络生命周期保留什么事实？](#detail-section-14)
  - [Q05 · 启用、恢复、退出与净成本怎样判？](#detail-section-15)
  - [Q06 · 身份绑定收据与版本写入怎样证伪？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为有多平台账号的 DSH 用户，在面板与会话角标聚合余额/用量和密钥操作，减少门户切换。见[Q01](#research-q01)。

各平台门户查余额/窗口并手动改DSH key；本插件集成流程与读数状态，不是统一正式结算/新计价引擎。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 费用/用量聚合 | 少切门户看账号窗口 | 需核身份/单位/时间/partial，非正式账本 |
| 会话角标 | 余额/套餐轻快照 | miss/unknown可回当前账号余额，归属非总确认 |
| 连通检测 | 真实小请求排障 | 可消耗费用，modelId缓存不绑定身份 |
| 密钥/凭据管理 | 平台key和Host切换 | 秘密按需返回、并发/权限/回滚需核 |
| 后台提醒 | 定期余额预警 | 停轮询不等取消已发请求/平台副作用 |

**流程与依赖**

Node/DSH与可信Host、对应账号/网络/桌面身份按平台必需；完整依赖表见[Q05](#research-q05)。

先核Host和副本、单平台回读身份/窗口，再分别验角标/真实探测和敏感写入；步骤见[Q05](#research-q05)。

**效果与成本**

真实探测/网络、协议凭据维护和多状态恢复费用工时未知；表见[Q05](#research-q05)。

有上下文聚合与不完整信息保留，但净节时/省钱和准确度未测；效果见[Q05](#research-q05)。

> **思考**：秘密按需GET/宿主key-use依赖Host权限；modelId及基元归属缓存缺身份，静默state保存和固定tmp/旧orig回滚可误示成功。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：多协议/账号与面板集成，已有partial/null/单飞/轻快照减少局部重复；0.7.5增加Host页签布局适配，未改核心身份/授权逻辑。见[Q01](#research-q01)、[Q04](#research-q04)。

账号池过滤、清枢单飞/401一次/stale、OpenCSG窗口/partial与effect回收值得保留；不能替代请求授权/身份缓存/原子版本写入和完整body取消。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

秘密按需GET/宿主key-use依赖Host权限；modelId及基元归属缓存缺身份，静默state保存和固定tmp/旧orig回滚可误示成功。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察；源码评估者可在可信隔离profile用非敏感单平台只读。未知访问边界、错身份/缓存或文件版本/回滚不明时停管理，核平台与独立副本再修。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可核多平台面板/敏感管理和数据边界；仅UI布局较基线改变，未访问真实平台/运行目标。先观察，限定单人隔离非敏感只读评估，不据无守卫断言已泄漏。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、cordis.patch.yml、lib/index.js、lib/client.js、lib/common.js、lib/creds.js、lib/opencsg.js、lib/tierflow.js、lib/zcode.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：旧十题/全部findings、自身code依赖和证据范围复核。当前核package/patch、Host入口/serve/state/step key-use、model-check、基元角标、OpenCSG窗口/分页与纯归一、creds池/清枢取数骨架、client生命周期和新增CSS。未全审大体积client/所有平台协议、桌面登录及所有敏感路由；未运行目标或访问平台。
- 下一步：后续隔离非敏感身份/模拟上游，测跨provider缓存、角标切号、并发文件写/回滚、partial/慢body和Host授权；另核新旧Host页签布局。

**分析版本**

- **仓库**：[162568316/dsh-tokenrhythm-bill](https://github.com/162568316/dsh-tokenrhythm-bill)
- **版本号**：0.7.5（[固定提交 4d9800c](https://github.com/162568316/dsh-tokenrhythm-bill/tree/4d9800cc534fde8dfd06e99bfe94b6af81c25d31)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向：身份绑定数据收据、独立授权与带预期版本的可验证持久化，故障矩阵比较错误归属/丢更新和总负担。见[Q06](#research-q06)。

后续隔离非敏感身份/模拟上游，测跨provider缓存、角标切号、并发文件写/回滚、partial/慢body和Host授权；另核新旧Host页签布局。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 8 | 19678 | 14162 | 5098 | — |
| .md | source | 2 | 180 | — | — | 4981 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/162568316/dsh-tokenrhythm-bill/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：费用/身份读数何时可信，敏感管理/缓存/恢复边界能否支持采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要聚合账单，真实入口与基线增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是dsh-tokenrhythm-bill原生DSH插件，0.7.5。bundle挂Host+Web双面节点；Host注入webServer、读DSH settings/credentials及本面板state，持平台会话和门户协议，client侧栏/overlay/会话头角标取得归一信息。五平台默认只开基元、至少留一个，非所有厂商的正式统一账本。

面向在DSH有基元/阶跃/ZCode/清枢/OpenCSG账号、反复切门户看余额/限时额度/用量和管理密钥的个人。基线是各门户分别登录查窗口、再回DSH改模型key。增量是工作上下文内聚合和少量轻快照刷新、共享字段/账户净化与缓存规则，不是新计价协议或自动成本归因，也不建立每个任务到正式账单的因果关系。

完成必须核平台/账号、币种/单位、窗口、数据时间、cached/stale/partial和密钥归属。卡片可见、HTTP200或探测可达不是扣费正确、账单完整或任务质量；跨平台套餐/赠额也不能未经口径核对相加。

对比固定基线58b359dd…与当前git树，只client18行及package版本变化：新增[data-conversation-tabs]{flex:1 1 auto}和角标order:99适配Host页签布局，未改Host账单/缓存/授权逻辑。作者注释称新旧Host无害实测，本轮仅核CSS意图，非独立布局验收；选择器影响宿主页签本身，不局限插件内部元素，需实际Host版本对照。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-9](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/package.json#L1-L9)

版本和包主入口。

```text
{
  "name": "dsh-tokenrhythm-bill",
  "version": "0.7.5",
  "description": "基元律动费用中心：账户余额与限时额度（含体验卡兑换码入口，数据账号行带实名状态徽章）、按分类筛选的模型价格卡（含折扣与峰谷分时计价）、近 30 天用量热力日历、自定义连通检测与平台密钥管理；基元律动 / 阶跃 / ZCode / 清枢智汇 / OpenCSG 五家在「设置 → 系统管理」里独立开关（默认只显示基元，至少留一个）；阶跃页签按账号展示头像、实名状态、套餐与余额；ZCode 页签查看桌面端套餐额度（读本机凭证）；清枢智汇页签展示用户信息与套餐用量，另有按量 API Key 管理（列表掩码 / 创建即在本机留存一份明文 / 启停 / 删除）；OpenCSG 页签用账号密码登录（支持多账号），账户卡展示账户余额与待发放余额（数据时间常驻），用量页照基元版式给窗口 token/调用合计、今日用量（单独一次单日窗口请求，取不到即「—」不写 0）与按接口拆分（翻页取全量），另有平台 API Key 管理（列表掩码 / 创建即在本机留存一份明文 / 删除仅自建）；对话在用阶跃模型时头部角标显示该 key 的套餐剩余进度条，在用 OpenCSG 模型时同一格位显示该 key 归属账号的账户余额（低余量吃平台自己的告警阈值），且每轮对话结束后即时刷新这枚余额角标（复用密钥归属匹配缓存，只重取账户快照）；阶跃那枚进度条角标同样在每轮对话结束后即时刷新（复用 10 分钟密钥归属指纹缓存，只重取套餐快照）；基元那枚账户余额角标同理（跟着 DSH 实际在用那把密钥走，每轮对话结束后只重取账户余额快照）。凭据只存本机 host。",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
```

**依据 2 · 源码核查**：[cordis.patch.yml:1-9](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/cordis.patch.yml#L1-L9)

双面bundle插入。

```text
# dsh-tokenrhythm-bill bundle patch: inserts the dual-face plugin row into the web
# profile roster. The node half (exports ".") runs in the host process (settings
# parsing, credential resolution, balance/trend/keys proxying, model connectivity
# checks), and the dsh.client declaration in package.json loads the browser half
# (exports "./client") in the web GUI (sidebar.footer.action entry + shell.overlay
# panel).
- insert:
    - id: tokenrhythm-bill
      name: 'dsh-tokenrhythm-bill'
```

**依据 3 · 源码核查**：[lib/index.js:1816-1843](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L1816-L1843)

Host注入与settings/credentials/state。

<details>
<summary>查看原文（28行）</summary>

```text
export const inject = ['webServer']

export function apply(ctx) {
  // ---- DSH 目录与文件 ----
  const dshDir = () => (process.env.DSH_HOME && String(process.env.DSH_HOME))
    || (typeof os !== 'undefined' && os.homedir ? join(os.homedir(), '.dsh') : null)
  const settingsPath = () => { const d = dshDir(); return d === null ? null : join(d, 'settings.yaml') }
  const credentialsPath = () => { const d = dshDir(); return d === null ? null : join(d, '.credentials.yaml') }
  // 会话 Cookie + 面板几何都存这个文件（0600），不进浏览器、不进 settings。
  const statePath = () => { const d = dshDir(); return d === null ? null : join(d, 'tokenrhythm-bill-state.json') }
  // 旧项目名（dsh-model-balance）时代的 state 文件：新文件缺失时读它做一次性迁移。
  const legacyStatePath = () => { const d = dshDir(); return d === null ? null : join(d, 'model-balance-state.json') }

  const readTextSafe = (file) => {
    if (file === null) return ''
    try { return existsSync(file) ? readFileSync(file, 'utf8') : '' } catch { return '' }
  }

  // ---- 持久化状态（cookie / 账号列表 / prefs）：读写都 best-effort ----
  // 「某家什么都没配」的形状只写一份：初始 state 与「换账号/清空」共用这几个空壳，
  // 免得两处各写一遍字段表——漏一个字段就是「清空后仍是旧账号」这类脏状态。
  const blankStep = () => ({ accounts: [], activeAccount: '', device: '', sessions: {}, prefs: sanitizeStepPrefs({}) })
  const blankTf = () => ({ accounts: [], activeAccount: '', sessions: {}, savedKeys: {} })
  const blankOc = () => ({ accounts: [], activeAccount: '', sessions: {}, savedKeys: {} })
  let stateLoaded = false
  let state = { cookie: '', csrf: '', prefs: {}, accounts: [], activeAccount: '', update: {}, trKeys: [], step: blankStep(), tf: blankTf(), oc: blankOc() }

  const loadState = () => {
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1916-1935](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L1916-L1935)

五平台开关默认/至少一个。

<details>
<summary>查看原文（20行）</summary>

```text
  // ---- 启用的系统（0.6.2「系统管理」）----
  // 面板里能出现哪几家（基元 / 阶跃 / ZCode / 清枢智汇 / OpenCSG）：**默认只有基元**，另四家要在
  // 设置 → 系统管理里显式勾上才出现。prefs.systems 是权威；老存档里只有 0.6.x 的
  // ZCode 总开关（prefs.zcode），缺 systems 时按它推导——老用户开过 ZCode 的不会被悄悄关掉。
  // 不变式：**至少留一个**（全关等于面板空转），任何入口进来的全关状态都落回基元。
  const SYS_KEYS = ['tr', 'step', 'zcode', 'tf', 'oc']
  const systemsOf = (prefs) => {
    const p = isObj(prefs) ? prefs : {}
    const raw = isObj(p.systems) ? p.systems : {}
    const out = {}
    for (const k of SYS_KEYS) {
      if (typeof raw[k] === 'boolean') out[k] = raw[k]
      else if (k === 'zcode') out[k] = p.zcode === true
      else out[k] = k === 'tr'
    }
    // 逐键判空而不是硬点四家人的名字：以后再加系统时这条不变式不会漏改。
    if (!SYS_KEYS.some((k) => out[k] === true)) out.tr = true
    return out
  }
  // 「设置 → 系统管理」里拖出来的顺序（sysOrder）。存的是**完整排列**：SYS_KEYS 每个键都在、
```

</details>

**依据 5 · 源码核查**：[lib/client.js:7433-7454](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/client.js#L7433-L7454)

样式与后台余额轮询。

<details>
<summary>查看原文（22行）</summary>

```text
      ctx.effect(() => {
        const styleEl = document.createElement('style');
        styleEl.setAttribute('data-plugin', 'dsh-tokenrhythm-bill');
        styleEl.textContent = PANEL_CSS;
        document.head.appendChild(styleEl);
        return () => { if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl); };
      });

      // 预警轮询：每 5 分钟查一次余额（面板关着也查），临期/低余额点亮入口琥珀点；
      // 同时刷新入口常驻总余额（balanceCny）。会话未配置/失效时清空两者。
      // 清枢接管时胶囊要的清枢数也走这一轮（面板关着也查）：基元余额正是靠它常驻的，清枢没理由
      // 只在面板打开时才有数——那样面板一关，胶囊上的数就再也不更新了。
      ctx.effect(() => {
        let timer = null
        let stopped = false
        const check = async () => {
          if (stopped) return
          const m = await jsonGet(API + '/manifest')
          // host 名册里「可查基元余额」的 provider id 名单（manifest 的 providers 段就是这一份：
          // 多枚共用同一个 baseURL 的短键 jy / jy131 全在里面）。角标靠它判「这个会话在用的
          // provider 是不是基元」——没有它，用户给 provider 起的短键对不上任何产品名，
          // 角标就会在真的在用基元时整枚不出现（v0.7.3 修的正是这个）。只在真的变了时才写回，
```

</details>

**依据 6 · 源码核查**：[lib/client.js:7578-7617](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/client.js#L7578-L7617)

侧栏/overlay/会话头槽。

<details>
<summary>查看原文（40行）</summary>

```text
      ctx.effect(() => slots.inject('sidebar.footer.action', () => slots.register(
        { name: 'sidebar.footer.action', id: 'tokenrhythm-bill-entry', order: 10 },
        (props) => React.createElement(EntryButton, props),
      )), 'tokenrhythm-bill: sidebar entry');

      ctx.effect(() => slots.inject('shell.overlay', () => slots.register(
        { name: 'shell.overlay', id: 'tokenrhythm-bill-panel', order: 30 },
        () => React.createElement(Panel),
      )), 'tokenrhythm-bill: overlay panel');

      // ---- 对话头部角标：当前对话在用阶跃模型 → 该 key 的套餐剩余进度条 ----
      // 挂 conversation.session.header.utilities（list 槽，可多家共用）。不用 `corner`：
      // 那是 single 槽，已被 DSH 自己的右栏展开按钮占住。宿主没这个槽时 inject 静默不生效，
      // 面板与其它注入照常。
      // 这里**不需要**任何可选服务：该槽把 useProjection 作为标准 prop 交给每个条目，组件
      // 自己就能读到会话的模型选择（见 StepHeaderPlan 上的注释）。所以维持最朴素的注册。
      ctx.effect(() => slots.inject('conversation.session.header.utilities', () => slots.register(
        { name: 'conversation.session.header.utilities', id: 'tokenrhythm-bill-step-plan', order: 50 },
        (props) => React.createElement(StepHeaderPlan, props),
      )), 'tokenrhythm-bill: header step plan');

      // ---- 对话头部角标（OpenCSG，v0.7.3）：当前对话在用 OpenCSG 模型 → 该账号的账户余额 ----
      // 同一 list 槽的第二枚条目：两家的门控都折在「会话当前 provider 是自己家」上，一次
      // 选择只命中一家，页签行右端永远只有**一枚**角标，不抢位也不叠位。
      ctx.effect(() => slots.inject('conversation.session.header.utilities', () => slots.register(
        { name: 'conversation.session.header.utilities', id: 'tokenrhythm-bill-oc-balance', order: 55 },
        (props) => React.createElement(OcHeaderPlan, props),
      )), 'tokenrhythm-bill: header oc balance');

      // ---- 对话头部角标（基元，v0.7.3）：当前对话在用基元模型 → 本机绑定账号的账户余额 ----
      // 同一 list 槽的第三枚条目。三家的门控都折在「会话当前 provider 是自己家」上，一次选择
      // 只命中一家，页签行右端永远只有**一枚**角标，不抢位也不叠位。order 在 OC 之后（60）：
      // 数值本身互不影响，这个次序只是让「三家都注册了、但只有一家的会话在跑」时 list 槽内的
      // 排位稳定可预期（与面板页签里基元排最后一致）。
      ctx.effect(() => slots.inject('conversation.session.header.utilities', () => slots.register(
        { name: 'conversation.session.header.utilities', id: 'tokenrhythm-bill-tr-balance', order: 60 },
        (props) => React.createElement(TrHeaderPlan, props),
      )), 'tokenrhythm-bill: header tr balance');

      // ---- 快捷键呼出/收起面板 ----
```

</details>

**依据 7 · 源码核查**：[lib/client.js:8760-8780](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/client.js#L8760-L8780)

新增宿主页签flex与角标order。

<details>
<summary>查看原文（21行）</summary>

```text
       /* 宿主布局修复（2026-10-27 新版宿主实测）：新版把页签行（role=tablist，data-conversation-tabs
          锚点不变）**收进外层 .tabs 行里**，而 tablist 自身没被宿主声明 flex——宽度=内容收缩，行里
          剩下的空白不归它，角标的 margin-left:auto 便无空间可分，退化成「贴着最后一个页签」。
          把 tablist 撑到行满宽即恢复原几何：纯增量（宿主对该元素没有任何 flex 声明，不顶掉规则；
          老宿主里它的父容器不是 flex 行，flex 属性整体被忽略，两版宿主都无害）。行右端若另有宿主
          的「更多视图」钮（views.actions 有注册才渲染），撑满后它顶到行尾、角标钉其左侧——行内次序
          仍由宿主自己定，我们不越过 tablist 去 portal 外层行。 */
       [data-conversation-tabs]{flex:1 1 auto}
       /* 页签按钮在新版宿主是**动态裁剪**的：行宽不足时多余的收进「更多视图」菜单，宽度就绪后
          React 把它们追加回 tablist 末尾——追加会落在我们 portal 的角标**后面**（2026-10-27 现场：
          「轨迹」排到了角标右）。DOM 次序靠不住，flex 的 order 才靠得住：页签按钮不设 order（默认 0），
          角标 99 恒排最后，margin-left:auto 照旧把它钉在行右端。 */
      /* 皮肤（v0.7.3 · 用户从 design/badge-variants.html 六套里定稿的方案 D「状态点」）：
         面 = 主文字 5% 的极浅填充，靠 6% 发丝内描边收边 + 1px 外阴影垫一点厚度——不再用实心
         描边，三枚并排时不像三个灰盒子。总高仍是 22px（border-box，含那 1px 透明边），换肤
         **不动几何**：页签行里的位置、与标签文字的光学中线都与上一版逐像素对得上（height 由
         20px+2px 边改成 22px border-box，是同一件事的两种写法）。 */
      .dsh-mb-hplan{position:relative;display:inline-flex;align-items:center;gap:var(--mb-sp-2);min-width:0;max-width:260px;
        box-sizing:border-box;height:22px;align-self:flex-start;margin-top:-2px;margin-left:auto;padding:0 9px;order:99;
        border:1px solid transparent;border-radius:var(--mb-r-pill);
        background:color-mix(in srgb,var(--mb-txt) 5%,transparent);
```

</details>

#### 缺口

- 真实门户切换/归属纠错和新旧Host布局收益未对照
  **影响**：便利与CSS适配不等可靠管理或净节时
  **进一步探讨**：同任务核平台原窗口与面板数据/耗时，隔离Host版本查角标及其它页签。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 密钥/密码/宿主凭据路由如何授权与持久化？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

面板state包含多平台账号密码、cookie/JWT会话和本面板创建密钥的一次性明文副本。saveState直写JSON、创建mode0600但catch静默，load JSON坏/读失败走空状态；没有原子rename、加密或成功回执，0600创建选项不证明既有权限被每次收紧。用户看到可工作不等重启后仍有新数据。

serve只按pathname/method分派，当前文件未见独立请求者身份、Origin/Host/地址守卫；最终前缀直接注册webServer。平台启用开关、identifier查目标、用户点击眼睛是功能/选择，不是请求方授权。GET account/password和apikey-reveal确实可返回完整秘密，而列表掩码减少常态披露是实在改善，不能笼统声称浏览器永远不见凭据。此管理面必须依赖可信Host访问控制，本轮未核部署网关/Host实现，不据此断言已暴露或已泄漏。

stepfun/key-use读取credentials原文，再访问平台确认目标完整key、patch指定行；拒缺行/多行/不安全值。写固定tmp、rename、回读核key和行数优于无核覆盖，但远端等待期间其它请求或外部编辑可能已改orig；没有预期版本CAS/互斥。catch尝试回写orig，回滚失败忽略却响应“已回滚原内容”，不能据错误文案保证恢复，也可能覆盖对方变更。

readBody无限累积后JSON解析，空/坏返回{}；宿主是否另有限流/长度限制未知。停插件只撤入口，不撤平台新key、不清本地明文/外部写入；只忘记本地副本也不等平台撤销。先核访问边界与独立备份，再谈密钥管理，不因“本机存储”降低授权/恢复门槛。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1843-1863](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L1843-L1863)

state读cookie/密码/明文key。

<details>
<summary>查看原文（21行）</summary>

```text
  const loadState = () => {
    if (stateLoaded) return state
    stateLoaded = true
    const file = statePath()
    if (file === null) return state
    let text = readTextSafe(file)
    if (text.trim() === '') text = readTextSafe(legacyStatePath()) // 迁移：旧名 state 兜底
    try {
      const data = JSON.parse(text)
      if (isObj(data)) {
        if (typeof data.cookie === 'string') state.cookie = data.cookie
        if (typeof data.csrf === 'string') state.csrf = data.csrf
        if (typeof data.activeAccount === 'string') state.activeAccount = data.activeAccount
        if (isObj(data.prefs)) state.prefs = data.prefs
        state.accounts = sanitizeAccounts(data.accounts)
        state.update = sanitizeUpdate(data.update)
        // 基元「创建时落盘」的明文密钥副本（见 sanitizeTrSavedKeys 那段：平台只给一次，
        // 不给副本就再也复制不出来）。与账号密码同一份 0600 文件、同一信任边界。
        state.trKeys = sanitizeTrSavedKeys(data.trKeys)
        if (isObj(data.step)) {
          const stepAccounts = sanitizeStepAccounts(data.step.accounts)
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1886-1914](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L1886-L1914)

坏JSON空状态和直接best-effort保存。

<details>
<summary>查看原文（29行）</summary>

```text
        }
        if (isObj(data.oc)) {
          const ocAccounts = sanitizeOcAccounts(data.oc.accounts)
          state.oc = {
            accounts: ocAccounts,
            activeAccount: typeof data.oc.activeAccount === 'string' ? data.oc.activeAccount : '',
            // 这里的凭据是平台签的本地 JWT（Bearer），同样按账号分槽落盘；
            // 串号是安全事故，故键名必须落在账号池内。
            sessions: sanitizeOcSessions(data.oc.sessions, ocAccounts),
            // 新建时落盘的明文密钥副本（用户定稿 2026-10-17）：按账号分槽、只认账号池内的
            // 槽名（串号 = 将 A 账号的明文挂到 B 账号名下，是安全事故，见 ocNormalizeSavedKeys）。
            savedKeys: ocLib.ocNormalizeSavedKeys(data.oc.savedKeys, ocAccounts),
          }
        }
      }
    } catch { /* 不可读 → 空状态 */ }
    stepLoadSessions() // 落盘的长会话装进内存 Map（多账号并存的前提）
    tfLoadSessions() // 清枢智汇同款：30 天会话按账号分槽落盘
    ocLoadSessions() // OpenCSG 同款：本地 JWT 按账号分槽落盘
    return state
  }
  const saveState = () => {
    const file = statePath()
    if (file === null) return
    try {
      mkdirSync(dirname(file), { recursive: true })
      writeFileSync(file, JSON.stringify({ cookie: state.cookie, csrf: state.csrf, prefs: state.prefs, accounts: state.accounts, activeAccount: state.activeAccount, update: state.update, trKeys: state.trKeys, step: state.step, tf: state.tf, oc: state.oc, savedAt: Date.now() }, null, 2) + '\n', { encoding: 'utf8', mode: 0o600 })
    } catch { /* best-effort：丢持久化不丢功能 */ }
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:5506-5520](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L5506-L5520)

readBody/serve无独立身份检查。

<details>
<summary>查看原文（15行）</summary>

```text
  async function readBody(req) {
    let text = ''
    for await (const chunk of req) text += chunk
    if (text === '') return {}
    try { return JSON.parse(text) } catch { return {} }
  }

  const serve = async (req, res) => {
    try {
      const url = new URL(req.url || '/', 'http://x')
      const pathname = url.pathname

      if (pathname === '/dsh-tokenrhythm-bill/manifest' && req.method === 'GET') {
        loadState()
        const { providers, error } = readProviders()
```

</details>

**依据 4 · 源码核查**：[lib/index.js:7025-7034](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L7025-L7034)

按需GET密码完整值。

<details>
<summary>查看原文（10行）</summary>

```text
      if (pathname === '/dsh-tokenrhythm-bill/opencsg/account/password' && req.method === 'GET') {
        if (!ocEnabled()) { writeJson(res, ocDisabledResponse()); return }
        loadState()
        const want = url.searchParams.get('identifier')
        const key = ocSessKey(want === null ? state.oc.activeAccount : want)
        const hit = state.oc.accounts.find((a) => ocSessKey(a.identifier) === key)
        if (!hit) { writeJson(res, { ok: false, error: '账号不存在' }, 404); return }
        writeJson(res, { ok: true, identifier: hit.identifier, password: hit.password })
        return
      }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:7085-7094](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L7085-L7094)

按需GET密钥明文与本地forget。

<details>
<summary>查看原文（10行）</summary>

```text
      if (pathname === '/dsh-tokenrhythm-bill/opencsg/apikey-reveal' && req.method === 'GET') {
        if (!ocEnabled()) { writeJson(res, ocDisabledResponse()); return }
        const token = ocKeyRevealLocal(ocUserParam(url.searchParams), url.searchParams.get('keyId'))
        writeJson(res, token === null ? { ok: false, error: '本机没有这把密钥的完整值（只有在本面板里创建的密钥才会留存）' } : { ok: true, key: token })
        return
      }
      if (pathname === '/dsh-tokenrhythm-bill/opencsg/apikey-forget' && req.method === 'POST') {
        if (!ocEnabled()) { writeJson(res, ocDisabledResponse()); return }
        const body = await readBody(req)
        const identifier = isObj(body) && typeof body.identifier === 'string' && body.identifier.trim() !== '' ? body.identifier : undefined
```

</details>

**依据 6 · 源码核查**：[lib/index.js:6599-6654](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L6599-L6654)

key-use读orig、平台请求、tmp/rename/readback与回滚错误文案。

<details>
<summary>查看原文（56行）</summary>

```text
      if (pathname === '/dsh-tokenrhythm-bill/stepfun/key-use' && req.method === 'POST') {
        const body = await readBody(req)
        const keyId = isObj(body) && typeof body.keyId === 'string' ? body.keyId.trim()
          : (isObj(body) && typeof body.keyId === 'number' && Number.isFinite(body.keyId) ? String(body.keyId) : '')
        if (keyId === '') { writeJson(res, { ok: false, error: '缺少 keyId' }, 400); return }
        const un = stepKeyAccountOf(isObj(body) ? body.username : undefined)
        if (un === null) { writeJson(res, { ok: false, code: 'NO_STEP_ACCOUNT', error: '未配置阶跃账号（设置 → 阶跃账号）' }, 404); return }
        const cp = credentialsPath()
        if (cp === null) { writeJson(res, { ok: false, code: 'NO_FILE', error: '找不到 ~/.dsh 目录' }, 500); return }
        const orig = readTextSafe(cp)
        if (typeof orig !== 'string' || orig === '') {
          writeJson(res, { ok: false, code: 'NO_FILE', error: '读不到 .credentials.yaml——请先在「模型」页保存一次阶跃密钥' }, 500); return
        }
        const r = await stepRpc(stepLib.STEP_DEV_SERVICE, 'ListAccessKeys', {}, false, un)
        if (!r.ok) { writeJson(res, { ok: false, code: r.code, error: r.error }, 502); return }
        const list = isObj(r.data) && Array.isArray(r.data.accessKeys) ? r.data.accessKeys : []
        const hit = list.map((k) => (isObj(k) ? k : null)).find((k) => k !== null && String(k.keyId ?? k.key_id ?? '') === keyId) || null
        const fullKey = hit !== null && typeof hit.accessKey === 'string' ? hit.accessKey.trim() : ''
        if (fullKey === '') { writeJson(res, { ok: false, error: '未找到该密钥（可能刚被删除）' }, 404); return }
        const patched = patchCredentialLine(orig, 'STEP_API_KEY', fullKey)
        if (!patched.ok) {
          const msg = patched.code === 'NO_REF' ? '凭据文件里没有 STEP_API_KEY 行——请先在「模型」页保存一次阶跃密钥'
            : patched.code === 'AMBIGUOUS' ? '凭据文件里 STEP_API_KEY 出现多行，认不出哪行生效，已拒绝写入'
            : patched.code === 'UNSAFE_VALUE' ? '这把密钥含非常规字符，为避免写坏凭据文件已拒绝落盘'
            : '写入准备失败'
          writeJson(res, { ok: false, code: patched.code, error: msg }, 409); return
        }
        const tmp = cp + '.tokenrhythm.tmp'
        try {
          writeFileSync(tmp, patched.text, { mode: 0o600 })
          renameSync(tmp, cp)
          const after = readTextSafe(cp)
          const now = extractCredentialFromText('STEP_API_KEY', after)
          const sameLines = String(after).split('\n').length === orig.split('\n').length
          if (typeof after !== 'string' || String(now).trim() !== fullKey || !sameLines) throw new Error('verify')
        } catch {
          try { writeFileSync(cp, orig, { mode: 0o600 }) } catch { /* 回滚也失败：保留错误响应，不再放大 */ }
          try { if (existsSync(tmp)) unlinkSync(tmp) } catch { /* 尽力清理临时副本 */ }
          writeJson(res, { ok: false, code: 'WRITE_FAILED', error: '凭据文件写入校验未通过，已回滚原内容' }, 500); return
        }
        stepKeyPlanCache.clear()
        const act = activeCredentialKey('STEP_API_KEY')
        writeJson(res, {
          ok: true, account: un, keyId,
          keyName: hit && typeof hit.name === 'string' ? hit.name : '',
          masked: stepLib.maskStepKey(fullKey), prevMasked: stepLib.maskStepKey(patched.prev || ''),
          source: act.source,
        })
        return
      }

      // ================= ZCode（额度展示）路由 =================
      if (pathname === '/dsh-tokenrhythm-bill/zcode/quota' && req.method === 'GET') {
        if (!zcodeEnabled()) { writeJson(res, zcodeDisabledResponse()); return }
        writeJson(res, await fetchZcodeQuota(url.searchParams.get('force') === '1'))
        return
```

</details>

**依据 7 · 源码核查**：[lib/index.js:7122-7124](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L7122-L7124)

前缀生命周期注册。

```text

  ctx.effect(() => ctx.webServer.register({ kind: 'prefix', path: '/dsh-tokenrhythm-bill', handler: serve }), 'tokenrhythm-bill: routes')
}
```

#### 缺口

- 实际Host访问控制、body上限及并发/磁盘错误未验证
  **影响**：不能给共享/远程敏感管理面安全背书，也不声称已泄漏
  **进一步探讨**：隔离虚拟profile用无价值凭据测未授权请求、并发key-use/外部编辑、满盘/坏JSON和回滚失败。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 余额角标/检测缓存到底绑定哪个身份？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

model-check会对所选provider和resolveKey发送chat/completions真实Bearer请求，输入ping、max_tokens:1；最多30模型/3 worker是单批上限，30秒abort覆盖该probe的json/text读取。可能有真实请求费用/额度消耗，金额未知；HTTP成功即使非JSON也当可达，不证明模型输出、工具调用或业务质量。

buildCheckPlan只用model ID查cache，结果也按modelId写apply内Map，没有provider/baseURL/账号/key指纹维度。60秒内同名模型换provider/key可能沿用前一身份的成功/延迟；force可重测但默认语义未修。首批未完成无inflight去重，并发用户/重复点击可各起一批，单批3并发不等系统总3，不承诺防重复计费。

基元角标先解析当前明确provider，非基元早拒；cookie为空也早返回NO_SESSION，避免用户清会话后角标默默自动重登，这些是具体副作用边界。实际key读当前provider.apiKeyEnv；余额轻快照先按登录cookie取，再查平台掩码key归属。trKeyMatchesPlatform只要prefix或suffix一边成立，不是完整等值身份认证。

trKeyModeCache以key长度+头6尾4保存10分钟，没cookie/绑定账号维度，普通refresh只重余额，force才清归属表；切号但同key可能用旧hit/miss。payload在mode miss/unknown仍可返回当前登录账号account余额，只是不附key名。数值有来源但不必就是当前key归属账号余额，必须保keyLookup与stale/时间而不能让小角标暗示已核实。实际客户端切号是否每路径都force和用户是否误读未重放，保留未知。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1011-1018](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L1011-L1018)

真实探测批次/并发/预算常量。

```text
// ---- 模型批量连通检测（/model-check）：真实 1-token 请求，走用户自己的 key。
// 选哪些模型、多久一次全由客户端决定（面板打开期间）；host 只执行「这一轮」，
// 60s TTL 内存缓存防重复计费；并发与抖动参数沿用状态站防风控经验值。----
export const CHECK_MAX_MODELS = 30
export const CHECK_TTL_MS = 60 * 1000
const CHECK_TIMEOUT_MS = 30 * 1000
const CHECK_CONCURRENCY = 3
const CHECK_JITTER_MS = 15 * 1000
```

**依据 2 · 源码核查**：[lib/index.js:1045-1072](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L1045-L1072)

只按model ID命中cache。

<details>
<summary>查看原文（28行）</summary>

```text
export function buildCheckPlan(models, cache, force, now, ttl) {
  const ttlMs = Number(ttl) > 0 ? Number(ttl) : CHECK_TTL_MS
  const nowMs = typeof now === 'number' && Number.isFinite(now) ? now : Date.now()
  const hit = (id) => {
    if (cache == null) return null
    try {
      if (typeof cache.get === 'function') return cache.get(id) || null
      return isObj(cache) ? (cache[id] || null) : null
    } catch { return null }
  }
  const seen = {}
  const toProbe = []
  const cachedResults = {}
  const list = Array.isArray(models) ? models : []
  for (const raw of list) {
    if (typeof raw !== 'string') continue // 只接受字符串模型 ID（数字/对象等一律无效）
    const id = asStr(raw)
    if (id === '' || seen[id]) continue
    seen[id] = true
    if (toProbe.length >= CHECK_MAX_MODELS) break
    const h = hit(id)
    if (!force && h && typeof h === 'object' && typeof h.ts === 'number' && nowMs - h.ts < ttlMs) {
      cachedResults[id] = {
        status: h.status, ms: h.ms, error: h.error || null, errorKind: h.errorKind || null,
        checkedAt: h.checkedAt, cached: true,
      }
      continue
    }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:6089-6150](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L6089-L6150)

resolveKey、真实请求、HTTP成功判定及modelId写cache。

<details>
<summary>查看原文（62行）</summary>

```text
      if (pathname === '/dsh-tokenrhythm-bill/model-check' && req.method === 'POST') {
        const body = await readBody(req)
        const { providers } = readProviders()
        const wantId = body && typeof body.provider === 'string' ? body.provider.trim() : ''
        const provider = wantId !== ''
          ? providers.find((p) => p.id === wantId) || null
          : providers.find((p) => p.balanceCapable) || providers[0] || null
        if (!provider) { writeJson(res, { ok: false, error: '没有可用提供商（检查 settings.yaml 或 profile 补丁层里的 llm-pi-ai.providers）' }, 404); return }
        const key = resolveKey(provider)
        if (key === '') { writeJson(res, { ok: false, code: 'NO_KEY', error: '未读到 ' + provider.apiKeyEnv + '（env 与 ~/.dsh/.credentials.yaml 都没有）' }, 409); return }
        const force = body && body.force === true
        const plan = buildCheckPlan(body ? body.models : null, checkCache, force, Date.now(), CHECK_TTL_MS)
        if (plan.toProbe.length === 0 && Object.keys(plan.cachedResults).length === 0) {
          writeJson(res, { ok: false, error: '请至少勾选一个模型（models 为字符串数组，最多 ' + CHECK_MAX_MODELS + ' 个）' }, 400); return
        }
        const base = (provider.baseURL || '').replace(/\/+$/, '')
        if (base === '') { writeJson(res, { ok: false, error: '提供商 ' + provider.id + ' 的 baseURL 为空，无法探测' }, 500); return }
        const chatUrl = /\/v\d+$/.test(base) ? base + '/chat/completions' : base + '/v1/chat/completions'
        const results = {}
        for (const id of Object.keys(plan.cachedResults)) results[id] = plan.cachedResults[id]
        const started = Date.now()
        const queue = plan.toProbe.slice()
        let qIdx = 0
        const probeOne = async (modelId) => {
          await sleep(Math.floor(Math.random() * CHECK_JITTER_MS))
          const t0 = Date.now()
          const ac = new AbortController()
          const timer = setTimeout(() => ac.abort(), CHECK_TIMEOUT_MS)
          let http = 0
          let detail = '网络错误'
          try {
            const r2 = await fetch(chatUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
              body: JSON.stringify({ model: modelId, messages: [{ role: 'user', content: 'ping' }], max_tokens: 1 }),
              signal: ac.signal,
            })
            http = r2.status
            if (r2.ok) {
              detail = ''
              try { await r2.json() } catch { /* 200 非 JSON 也视为可达 */ }
            } else {
              const t = await r2.text().catch(() => '')
              let msg = t.slice(0, 160)
              try {
                const j = JSON.parse(t)
                if (isObj(j) && j.error !== undefined) msg = String((isObj(j.error) ? (j.error.message || j.error) : j.error))
              } catch { /* 保留原始文本 */ }
              detail = 'HTTP ' + http + (msg ? ' ' + msg : '')
            }
          } catch (err) {
            detail = (err && (err.name === 'AbortError' || err.name === 'TimeoutError'))
              ? '超时（' + CHECK_TIMEOUT_MS + 'ms）'
              : String((err && err.message) || err)
          } finally {
            clearTimeout(timer)
          }
          const ms = Date.now() - t0
          const cls = classifyProbe(http, detail)
          const entry = { status: cls.status, ms, error: cls.error, errorKind: cls.errorKind, checkedAt: Math.floor(Date.now() / 1000), cached: false }
          results[modelId] = entry
          checkCache.set(modelId, Object.assign({ ts: Date.now() }, entry))
```

</details>

**依据 4 · 源码核查**：[lib/index.js:6151-6167](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L6151-L6167)

单批worker池。

<details>
<summary>查看原文（17行）</summary>

```text
        }
        // 并发 ≤3 的 worker 池从共享队列取任务（JS 单线程，qIdx 无需锁）。
        await (async () => {
          const workers = []
          for (let w = 0; w < Math.min(CHECK_CONCURRENCY, queue.length); w++) {
            workers.push((async () => {
              while (qIdx < queue.length) {
                const id = queue[qIdx]
                qIdx++
                await probeOne(id)
              }
            })())
          }
          await Promise.all(workers)
        })()
        writeJson(res, {
          ok: true,
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1464-1472](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L1464-L1472)

prefix/suffix任一匹配。

```text
export function trKeyMatchesPlatform(localKey, platformKey) {
  const lk = asStr(localKey)
  if (lk === '' || !isObj(platformKey)) return false
  const prefix = asStr(platformKey.prefix)
  if (prefix !== '' && lk.startsWith(prefix)) return true
  const masked = asStr(platformKey.masked)
  const suffix = masked.includes('****') ? masked.split('****').pop() : ''
  return suffix !== '' && lk.endsWith(suffix)
}
```

**依据 6 · 源码核查**：[lib/index.js:2779-2784](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L2779-L2784)

归属表与简略key指纹。

```text
  const trKeyModeCache = new Map() // fp -> { ts, mode }（负结论也缓存：同一把 key 不必反复问）
  const trLightBal = { cookie: '', data: null, ts: 0 }
  let trLightBalTask = null // 单飞：{ cookie, p }
  // 指纹只留长度与头尾几个字符：它是 Map 的键，不该把明文 key 长期驻留在内存里。
  const trKeyFp = (key) => key.length + '#' + key.slice(0, 6) + '#' + key.slice(-4)
  const trNum = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null)
```

**依据 7 · 源码核查**：[lib/index.js:2843-2889](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L2843-L2889)

按fp缓存及miss/unknown仍返回account。

<details>
<summary>查看原文（47行）</summary>

```text
  const fetchTrKeyMode = async (key, fp, force) => {
    if (force !== true) {
      const hit = trKeyModeCache.get(fp)
      if (hit !== undefined && Date.now() - hit.ts < TR_KEYMODE_TTL_MS) return hit.mode
    }
    loadState()
    if (state.cookie === '') return { mode: 'unknown' }
    try {
      let up = await fetchWithTimeout(TOKENRHYTHM_BASE + '/api/api-keys', { headers: trHeaders(state.cookie) })
      if (up.status === 401 && (await reloginActive())) {
        up = await fetchWithTimeout(TOKENRHYTHM_BASE + '/api/api-keys', { headers: trHeaders(state.cookie) })
      }
      if (!up.ok) return { mode: 'unknown' }
      const keys = normalizePlatformKeys(await up.json().catch(() => null))
      const found = keys.find((k) => trKeyMatchesPlatform(key, k)) || null
      const mode = found === null
        ? { mode: 'miss' }
        : { mode: 'hit', match: { keyName: found.name, keyId: found.id } }
      trKeyModeCache.set(fp, { ts: Date.now(), mode })
      return mode
    } catch { return { mode: 'unknown' } }
  }

  /** 角标载荷：只带角标要用的字段（密钥名/ID + 五个读数 + 时间）。
   *  identifier（手机号/邮箱）、明文、掩码一概不出门——与阶跃 key-plan、OpenCSG
   *  key-account 同一个隐私口径（界面上出现手机号这件事，用户此前已点名否掉）。 */
  const trKeyBalancePayload = (providerId, mode, snap) => {
    const acc = snap !== null && snap.ok === true
      ? {
        balanceCny: trNum(snap.balanceCny),
        availableBalanceCny: trNum(snap.availableBalanceCny),
        frozenBalanceCny: trNum(snap.frozenBalanceCny),
        expiringBalanceCny: trNum(snap.expiringBalanceCny),
        nextExpiryAt: snap.nextExpiryAt || null,
        atMs: typeof snap.atMs === 'number' ? snap.atMs : null,
        stale: snap.stale === true,
      }
      : null
    return {
      ok: true,
      providerId,
      // 只有归属坐实时才摆密钥名（与阶跃/OpenCSG 同一规矩：没归属就不摆名字）
      key: mode !== null && mode.mode === 'hit' ? mode.match : null,
      keyLookup: mode !== null ? mode.mode : 'unknown',
      account: acc,
      accountError: acc === null ? ((snap && snap.error) || '基元余额暂不可用') : null,
    }
```

</details>

**依据 8 · 源码核查**：[lib/index.js:2900-2940](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L2900-L2940)

provider/no-session前置拒绝、余额先取与refresh/force。

<details>
<summary>查看原文（41行）</summary>

```text
  const fetchTrKeyBalance = async (force, refresh, wantProviderId) => {
    loadState()
    const { providers } = readProviders()
    // 查哪一枚 provider 只有 trResolveProvider 一处判据（点名只认它 / 点名不是基元就地拒答 /
    // 没点名退回第一枚）。拒答分支**排在下面读会话与钥匙之前**：非基元会话问一句必须零副作用
    // （一次上游都不打，更不能走到那条会用绑定账号自动重登的链上）。
    const picked = trResolveProvider(providers, wantProviderId)
    if (picked.denied) {
      const w = picked.wanted || {}
      return {
        ok: false, code: 'NO_PROVIDER', providerId: '',
        error: '当前 provider（' + asStr(w.id) + '）不是基元：baseURL ' + (asStr(w.baseURL) || '未配置'),
      }
    }
    const tp = picked.provider
    if (tp === null) {
      return { ok: false, code: 'NO_PROVIDER', providerId: '', error: '设置里没有基元 provider（baseURL 含 tokenrhythm）' }
    }
    const providerId = typeof tp.id === 'string' ? tp.id : ''
    // 没有会话就到此为止，**绝不往下走**：下面的取数遇 401 会用绑定账号自动重登（与面板
    // 余额同款自愈），而用户刚刚点过「清除会话」时那一步会把他清掉的会话悄悄登回来。
    // 未配置会话是「没有账可读」，不是「会话过期了」——两者不能混。
    if (state.cookie === '') {
      return { ok: false, code: 'NO_SESSION', providerId, error: '未配置基元会话（面板 → 余额 → 粘贴 Cookie）' }
    }
    const key = activeCredentialKey(tp.apiKeyEnv).key
    if (key === '') {
      return {
        ok: false, code: 'NO_KEY', providerId,
        error: tp.apiKeyEnv === ''
          ? '基元 provider 没配 apiKeyEnv，读不到本机在用的 key'
          : '未读到 ' + tp.apiKeyEnv + ' 的值（env 与 ~/.dsh/.credentials.yaml 都没有）',
      }
    }
    if (force === true) trKeyModeCache.clear()
    // 余额先问：它才是主读数，而 401 的自愈重登也在这条路上完成——先重登、再核对归属，
    // 两条链就不会各登一次（顺序反了就是两个 401 抢一次 30 秒冷却，必有一个被挡回）。
    const snap = await fetchTrLightBalance(state.cookie, force === true || refresh === true)
    const mode = await fetchTrKeyMode(key, trKeyFp(key), force === true)
    return trKeyBalancePayload(providerId, mode, snap)
  }
```

</details>

#### 缺口

- 跨provider/换key/切账号的真实错误归属和重复批次费用未测
  **影响**：缓存结果不能当当前身份刚验证，角标不能当正式余额归属
  **进一步探讨**：无价值账号/模拟上游对照同名模型跨身份、首批重入、普通refresh/force与miss/unknown UI。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 账单窗口/partial/null和网络生命周期保留什么事实？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

OpenCSG归一把窗口信封total/value/token/calls和行集合分开，缺字段保null不补0，created_at记录时间不直接充当日消费归因。Host月窗口首页收总量后分页每页100、有限页；第一页失败按失败记录，后页失败/触顶或行数少于total标partial；今日另开单日窗口查询，不能以月聚合行按created_at切出今日。它保留“已知窗口合计、明细不全”的区别，是可复用质量点。

平台字段/人民币分、时间窗口/赠额/套餐含义来自作者协议观察与实现，本轮没访问真实账单验证当前政策。其它平台独立适配，统一UI不等五家相同口径。null/partial和数据时间应随显示走，原始平台窗口才是核对参照，不拿成功HTTP代替业务字段正确。

共享creds净化账号池/会话，只接纳池内账号且按平台白名单处理，减少残留跨号；清枢tfCachedFetch按账号key有TTL+busy单飞、401只重登一次、失败回stale、finally移busy。不要把局部良好缓存泛化成model-check同样绑定身份。ZCode另依桌面本地身份/凭证，不只DSH模型API key，启用需相应环境。

fetchWithTimeout计时器在fetch拿headers后finally清除，外层再读text/json，因此通用15秒不覆盖完整body；model-check单probe的timer范围不同。未见前端断开到这些上游请求取消链。client有stopped/clearInterval、样式元素/effect撤回和slot回收，Host effect也撤路由；这些是生命周期出口，但停轮询/撤路由不等取消已发请求或撤平台副作用。当前CSS还触宿主data-conversation-tabs，非全部界面独立沙箱。

#### 证据与依据

**依据 1 · 源码核查**：[lib/opencsg.js:863-900](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/opencsg.js#L863-L900)

窗口/行字段与null归一。

<details>
<summary>查看原文（38行）</summary>

```text
function ocNormalizeBills(body) {
  const raw = ocIsObj(body) && ocIsObj(body.data) ? body.data : null
  if (raw === null) {
    return { ok: false, apiCount: null, valueCents: null, totalTokensIn: null, totalTokensOut: null, totalTokensReasoning: null, totalTokensCached: null, totalConsumption: null, totalCalls: null, rows: [] }
  }
  const list = Array.isArray(raw.data) ? raw.data : []
  const rows = []
  for (const r of list) {
    if (!ocIsObj(r)) continue
    let createdAtMs = ocTsToMs(r.created_at)
    if (createdAtMs !== null && createdAtMs < 0) createdAtMs = null // Go 零值（与 ocNormalizeApiKeys 同一坑）
    rows.push({
      apiId: ocStr(r.instance_name),
      tokensIn: ocPickNum(r, ['prompt_token']),
      tokensOut: ocPickNum(r, ['completion_token']),
      tokensReasoning: ocPickNum(r, ['reasoning_token']),
      tokensCached: ocPickNum(r, ['prompt_cached_token']),
      // 行级调用次数与 token 合计（2026-10-17 实测坐实，见上方注释；缺失就是 null，不当 0）
      calls: ocPickNum(r, ['count']),
      consumption: ocPickNum(r, ['consumption']),
      createdAtMs,
      costCents: ocPickNum(r, ['value', 'cost']),
    })
  }
  return {
    ok: true,
    apiCount: ocNum(raw.total),
    valueCents: ocCents(raw.total_value),
    totalTokensIn: ocNum(raw.total_prompt_token),
    totalTokensOut: ocNum(raw.total_completion_token),
    totalTokensReasoning: ocNum(raw.total_reasoning_token),
    totalTokensCached: ocNum(raw.total_prompt_cached_token),
    // 窗口 token 合计与调用次数（服务端算好的，与分页无关；行合计实测逐位相符）
    totalConsumption: ocNum(raw.total_consumption),
    totalCalls: ocNum(raw.total_count),
    rows,
  }
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:4550-4611](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L4550-L4611)

月窗有限分页、首页合计与partial。

<details>
<summary>查看原文（62行）</summary>

```text
    // 完整的行集上——首页 10 条算出来的份额是错的（门户那 10 条只是分页默认值的产物）。
    // 一行不满 100 = 已经取完，所以轻量账号仍然只打一次（实测 per=100 可用、per=500 被拒 400）。
    const win = ocLib.ocMonthWindow()
    const api = {
      scene: ocLib.OC_BILL_SCENE_API,
      fromDate: win.fromDate,
      toDate: win.toDate,
      apiCount: null,
      valueCents: null,
      totalTokensIn: null,
      totalTokensOut: null,
      totalTokensReasoning: null,
      totalTokensCached: null,
      totalConsumption: null,
      totalCalls: null,
      fetchedRows: 0,
      partial: false,
      rows: [],
    }
    if (uuid !== '') {
      const per = ocLib.OC_BILL_USAGE_PER_PAGE
      const all = []
      for (let page = 1; page <= ocLib.OC_BILL_MAX_PAGES; page++) {
        const q = ocLib.ocBillsQuery({
          scene: ocLib.OC_BILL_SCENE_API, fromDate: win.fromDate, toDate: win.toDate, per, page,
        })
        const b = await ocApi('GET', ocLib.OC_PATH.billsOf(uuid) + '?' + q, { token: sess.token, scheme: sess.scheme })
        if (!b.ok) {
          // 第一页就失败 → 整段按失败处理（与旧版同款）；后续页失败 → 已有行照样用，标 partial
          if (page === 1) {
            if (ocSessRejected(b)) return { ok: false, code: b.code, error: ocLib.ocErrorText(b.code, b.message), authFailed: true }
            noteFail(b)
          } else {
            api.partial = true
          }
          break
        }
        const bills = ocLib.ocNormalizeBills({ msg: b.message, data: b.data })
        if (page === 1) {
          // 窗口级读数只在首页收（服务端按整个窗口算的，每页回的都一样，不重复覆盖）
          api.apiCount = bills.apiCount
          api.valueCents = bills.valueCents
          api.totalTokensIn = bills.totalTokensIn
          api.totalTokensOut = bills.totalTokensOut
          api.totalTokensReasoning = bills.totalTokensReasoning
          api.totalTokensCached = bills.totalTokensCached
          api.totalConsumption = bills.totalConsumption
          api.totalCalls = bills.totalCalls
        }
        all.push(...bills.rows)
        // 取完了：这一页不满 per，或（知道 total 时）行数已经够了
        const enough = bills.rows.length < per || (bills.apiCount !== null && all.length >= bills.apiCount)
        if (enough) break
        if (page === ocLib.OC_BILL_MAX_PAGES) api.partial = true // 撞上限：还有行没取回来
      }
      api.rows = all
      api.fetchedRows = all.length
      // 按接口聚合（协议层纯函数）：界面那张 rank 表直接吃它——**同名接口的多行在这里合一**，
      // 不能让「同一个模型」在界面上出现两次（份额、调用次数都按聚合后的口径给）。
      api.apis = ocLib.ocAggregateBillsByApi(all)
      // 与窗口条数对不上一律标 partial（含「首页就失败」和「撞上限」两种情形）
      if (api.partial !== true && api.apiCount !== null && all.length < api.apiCount) api.partial = true
```

</details>

**依据 3 · 源码核查**：[lib/index.js:4613-4624](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L4613-L4624)

今日独立窗口请求。

<details>
<summary>查看原文（12行）</summary>

```text
    // ⑤ 今日账单口（v0.7.3）：窗口 = 今天 → 今天，**只取首页**。
    //    · 为什么要单独问一次：`created_at` 是记录生成时刻，切不出「今天」（见协议层
    //      ocDayWindow 的实测）；而 start_date/end_date 服务端真过滤（同日实测：月窗口 798 次
    //      调用 / 93,458,176 token，今日 24 / 1,654,251，逐天合计与月窗口信封逐位相符）。
    //    · 为什么只取一页：今日只要**窗口级**三个读数（token / 次数 / 金额），而它们都是
    //      服务端按整个窗口算好的、与分页无关（④ 已坐实）。逐接口的今日拆分这一页不做
    //      （「按接口」那张表是**本期**口径，两种窗口混在一张表里读者分不清），所以
    //      per 用平台默认的 10、page=1 就够，比翻全量便宜一个量级。
    //    · 代价：每条账户快照多一条 GET——角标那 5 分钟轮询与每轮对话结束的即时刷新都会带上
    //      它（④ 本来就要翻 1~5 页账单，这是同一个口上再加一页）。值与不值由「今日用量在
    //      别处问不出来」定：它不在任何本地数据里。
    //    · 失败不牵连整包（与 ④ 同款）：只是 today.ok=false，界面显示「—」而不是 0。
```

</details>

**依据 4 · 源码核查**：[lib/creds.js:91-112](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/creds.js#L91-L112)

账号池过滤会话。

<details>
<summary>查看原文（22行）</summary>

```text
 */
export function sanitizeSessionPool(input, accounts, cfg) {
  const o = isObj(cfg) ? cfg : {}
  const field = typeof o.field === 'string' && o.field !== '' ? o.field : 'identifier'
  const entry = typeof o.entry === 'function' ? o.entry : null
  const pool = new Set()
  if (Array.isArray(accounts)) {
    for (const a of accounts) {
      // 池子的键只认字符串账号（与账号池净化后的形态一致），非字符串一律不进池
      if (isObj(a) && typeof a[field] === 'string' && a[field] !== '') pool.add(a[field].toLowerCase())
    }
  }
  if (!isObj(input) || pool.size === 0 || entry === null) return {}
  const out = {}
  for (const [rawKey, raw] of Object.entries(input)) {
    if (!isObj(raw)) continue
    const key = text(rawKey).toLowerCase()
    if (key === '' || !pool.has(key)) continue
    const v = entry(raw)
    if (v === null || v === undefined) continue
    out[key] = v
    if (Object.keys(out).length >= POOL_LIMIT) break
```

</details>

**依据 5 · 源码核查**：[lib/index.js:3647-3693](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L3647-L3693)

清枢单飞、401一次、stale和finally。

<details>
<summary>查看原文（47行）</summary>

```text
  const tfCachedFetch = async (cfg) => {
    const { force, identifier, key, caches, busy, ttlMs, path, shapeError, prefetch, build } = cfg
    const hit = caches.get(key)
    if (!force && hit && Date.now() - hit.ts < ttlMs) return { ...hit.data, cached: true, cachedAt: hit.ts }
    const inflight = busy.get(key)
    if (inflight !== undefined) return inflight
    const p = (async () => {
      const stale = () => {
        const s = caches.get(key)
        return s ? { ...s.data, cached: true, stale: true, cachedAt: s.ts } : null
      }
      const netFail = (err) => ({ ok: false, code: 'TF_NET', error: tfLib.tfErrorText('TF_NET', String((err && err.message) || err)) })
      const sess = await tfEnsureSession(false, identifier)
      if (!sess.ok) return stale() || sess
      const pre = prefetch === undefined ? null : await prefetch()
      let live = sess
      let r = null
      try {
        r = await tfRequest(path, { cookie: live.cookie, uid: live.uid })
      } catch (err) {
        return stale() || netFail(err)
      }
      if (r.authFailed) {
        // 401 = 会话真失效（平台没有 refresh 端点）→ 丢掉这枚 cookie，用存好的密码重登
        // 一次再试。**只重试一次**：再 401 就是账号侧的问题（被踢下线/被封），
        // 继续重试只会加深封锁。
        tfClearSess(key)
        const sess2 = await tfEnsureSession(true, identifier)
        if (!sess2.ok) return stale() || sess2
        live = sess2
        try {
          r = await tfRequest(path, { cookie: live.cookie, uid: live.uid })
        } catch (err) {
          return stale() || netFail(err)
        }
      }
      if (!r.ok) return stale() || { ok: false, code: r.code, error: tfLib.tfErrorText(r.code, r.message) }
      const data = await build(live, r.data, pre)
      if (data === null) return stale() || { ok: false, code: 'TF_SHAPE', error: shapeError }
      caches.set(key, { data, ts: Date.now() })
      return { ...data, cached: false }
    })()
    busy.set(key, p)
    try { return await p } finally { busy.delete(key) }
  }

  // ---- 用户信息（/api/user/self + 近 7 天用量）----
```

</details>

**依据 6 · 源码核查**：[lib/zcode.js:141-166](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/zcode.js#L141-L166)

桌面setting/config身份读取。

<details>
<summary>查看原文（26行）</summary>

```text
  }
  try {
    const setting = JSON.parse(readFileSync(join(home, '.zcode', 'v2', 'setting.json'), 'utf8'))
    const d = typeof setting.dataBaseDir === 'string' ? absEnvPath(setting.dataBaseDir) : null
    if (d !== null) return d
  } catch { /* 缺文件/坏 JSON → 环境变量兜底 */ }
  const env = absEnvPath(process.env.ZCODE_DATA_BASE_DIR)
  if (env !== null) return env
  return home
}

// =====================================================================
// token 候选链（quota.rs candidate_tokens / zai_billing_token 移植）
// =====================================================================

export function looksLikeToken(v) {
  return typeof v === 'string' && v.trim().length > 20
}

/** config.json provider 段里 coding-plan 条目的明文 apiKey（enc: 开头的不算）。 */
function codingPlanApiKeys(config) {
  const keys = []
  const providers = isObj(config) && isObj(config.provider) ? config.provider : null
  if (providers === null) return keys
  const entries = Object.entries(providers)
    .sort(([, a], [, b]) => (isObj(b) && b.enabled === true ? 0 : 1) - (isObj(a) && a.enabled === true ? 0 : 1))
```

</details>

**依据 7 · 源码核查**：[lib/index.js:2170-2178](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L2170-L2178)

通用timer只到fetch headers。

```text
  const fetchWithTimeout = async (url, init) => {
    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), UPSTREAM_TIMEOUT_MS)
    try {
      return await fetch(url, { ...init, signal: ac.signal })
    } finally {
      clearTimeout(timer)
    }
  }
```

**依据 8 · 源码核查**：[lib/client.js:7433-7454](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/client.js#L7433-L7454)

样式回收/轮询stopped。

<details>
<summary>查看原文（22行）</summary>

```text
      ctx.effect(() => {
        const styleEl = document.createElement('style');
        styleEl.setAttribute('data-plugin', 'dsh-tokenrhythm-bill');
        styleEl.textContent = PANEL_CSS;
        document.head.appendChild(styleEl);
        return () => { if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl); };
      });

      // 预警轮询：每 5 分钟查一次余额（面板关着也查），临期/低余额点亮入口琥珀点；
      // 同时刷新入口常驻总余额（balanceCny）。会话未配置/失效时清空两者。
      // 清枢接管时胶囊要的清枢数也走这一轮（面板关着也查）：基元余额正是靠它常驻的，清枢没理由
      // 只在面板打开时才有数——那样面板一关，胶囊上的数就再也不更新了。
      ctx.effect(() => {
        let timer = null
        let stopped = false
        const check = async () => {
          if (stopped) return
          const m = await jsonGet(API + '/manifest')
          // host 名册里「可查基元余额」的 provider id 名单（manifest 的 providers 段就是这一份：
          // 多枚共用同一个 baseURL 的短键 jy / jy131 全在里面）。角标靠它判「这个会话在用的
          // provider 是不是基元」——没有它，用户给 provider 起的短键对不上任何产品名，
          // 角标就会在真的在用基元时整枚不出现（v0.7.3 修的正是这个）。只在真的变了时才写回，
```

</details>

**依据 9 · 源码核查**：[lib/client.js:7568-7585](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/client.js#L7568-L7585)

清轮询和侧栏effect注册。

<details>
<summary>查看原文（18行）</summary>

```text
        }
        const start = () => {
          check()
          timer = setInterval(check, 5 * 60 * 1000)
        }
        start()
        return () => { stopped = true; if (timer !== null) clearInterval(timer) }
      }, 'tokenrhythm-bill: alert poll');

      // 侧栏底部动作（footerActions 在 settingsArea 之前渲染 → 天然在设置按钮上方）。
      ctx.effect(() => slots.inject('sidebar.footer.action', () => slots.register(
        { name: 'sidebar.footer.action', id: 'tokenrhythm-bill-entry', order: 10 },
        (props) => React.createElement(EntryButton, props),
      )), 'tokenrhythm-bill: sidebar entry');

      ctx.effect(() => slots.inject('shell.overlay', () => slots.register(
        { name: 'shell.overlay', id: 'tokenrhythm-bill-panel', order: 30 },
        () => React.createElement(Panel),
```

</details>

#### 缺口

- 平台现时字段/窗口/金额、慢body和卸载在途行为未独立验收
  **影响**：只支持固定实现的数据保守性，非正式财务对账或完整取消保证
  **进一步探讨**：模拟缺字段/分页失败/慢body，非敏感账户对原门户窗口、币种/账号及退出在途网络。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启用、恢复、退出与净成本怎样判？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先观察，不建议普通共享/远程环境直接导入高价值账号。熟悉Host访问与本机state的单人评估者，可隔离profile只启一平台、只读非敏感小样；先核身份/窗口与平台原页面，再考虑敏感操作。model-check真实调用和密钥变更不能当只读观察附带免费功能。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH webServer/Web、Node>=20 | 面板必需 | 路由/slots/本地文件 | 路由可达不等已授权 |
| 可信Host访问边界和敏感state保护 | 导入账号前必需 | 密码/JWT/key隔离 | 不在共享未知边界上启管理 |
| 对应平台合法账号/会话和网络 | 对应查询必需 | 门户协议/分页/续登 | 不因失败把null当零 |
| DSH provider/credential | 探测/会话角标必需 | 实际模型身份 | 身份缓存有边界需重核 |
| ZCode桌面身份环境 | 该平台才需 | 本机套餐读取 | 不推断只用普通API key可查 |
| state/credentials独立副本 | 改写前必需 | 失败恢复 | 先比外部版本别盲覆旧原文 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 评估者隔离profile核Host权限并保敏感副本 | 未授权请求拒绝，原文件可恢复 |
| 单平台读 | 只启非敏感账号查余额/窗口 | 平台/账号/单位/时间/partial一致 |
| 角标/检测 | 显式核keyLookup与缓存，选择是否真实probe | force后身份/结果可核，记录真实请求 |
| 管理小样 | 另授权无价值key创建/切换/删除 | 平台真实状态、宿主文件和本地副本一致 |
| 失败退出 | 停刷新/撤入口，核在途与平台key/文件 | 本地忘记/禁用不当平台撤销 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 平台账户/副本存储未知 | 核Host/账号/窗口与权限 | 多协议接线耗时未测 |
| 持续使用 | 轮询/分页/续登、真实probe费用未知 | 凭据/协议维护、归属与完整性核查 | 单批预算非全局请求限额 |
| 失败恢复 | 重查/重下载与副本未知 | 比账号/state/credentials/平台实际 | 静默保存和并发回滚增负担 |
| 升级退出 | 敏感副本保管/撤销成本未知 | 查宿主CSS兼容、平台key、文件 | 卸载不自动清所有副作用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 少切门户 | DSH多平台面板和会话角标 | 真实查询净时间收益 |
| 不完整读数可见 | null/partial/stale/数据时间 | 当前平台业务口径与用户误读率 |
| 连通排查 | 小真实请求/单批并发和预算 | 模型任务质量、净费用或身份缓存准确 |
| 密钥操作 | 平台管理和Host凭据切换 | Host权限/并发写与恢复可靠性 |

出现错账号/缓存不明、state重启丢失、凭据文件版本冲突、无法确认回滚或未知访问边界，应停敏感管理，先核平台和独立副本再修复，不盲重试覆盖。先观察不是源码受阻：核心风险具体可核，采用前提仍未满足，不把指标缺失当阻断。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1907-1914](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L1907-L1914)

静默明文保存。

```text
  const saveState = () => {
    const file = statePath()
    if (file === null) return
    try {
      mkdirSync(dirname(file), { recursive: true })
      writeFileSync(file, JSON.stringify({ cookie: state.cookie, csrf: state.csrf, prefs: state.prefs, accounts: state.accounts, activeAccount: state.activeAccount, update: state.update, trKeys: state.trKeys, step: state.step, tf: state.tf, oc: state.oc, savedAt: Date.now() }, null, 2) + '\n', { encoding: 'utf8', mode: 0o600 })
    } catch { /* best-effort：丢持久化不丢功能 */ }
  }
```

**依据 2 · 源码核查**：[lib/index.js:6089-6150](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L6089-L6150)

探测真实请求与缓存身份。

<details>
<summary>查看原文（62行）</summary>

```text
      if (pathname === '/dsh-tokenrhythm-bill/model-check' && req.method === 'POST') {
        const body = await readBody(req)
        const { providers } = readProviders()
        const wantId = body && typeof body.provider === 'string' ? body.provider.trim() : ''
        const provider = wantId !== ''
          ? providers.find((p) => p.id === wantId) || null
          : providers.find((p) => p.balanceCapable) || providers[0] || null
        if (!provider) { writeJson(res, { ok: false, error: '没有可用提供商（检查 settings.yaml 或 profile 补丁层里的 llm-pi-ai.providers）' }, 404); return }
        const key = resolveKey(provider)
        if (key === '') { writeJson(res, { ok: false, code: 'NO_KEY', error: '未读到 ' + provider.apiKeyEnv + '（env 与 ~/.dsh/.credentials.yaml 都没有）' }, 409); return }
        const force = body && body.force === true
        const plan = buildCheckPlan(body ? body.models : null, checkCache, force, Date.now(), CHECK_TTL_MS)
        if (plan.toProbe.length === 0 && Object.keys(plan.cachedResults).length === 0) {
          writeJson(res, { ok: false, error: '请至少勾选一个模型（models 为字符串数组，最多 ' + CHECK_MAX_MODELS + ' 个）' }, 400); return
        }
        const base = (provider.baseURL || '').replace(/\/+$/, '')
        if (base === '') { writeJson(res, { ok: false, error: '提供商 ' + provider.id + ' 的 baseURL 为空，无法探测' }, 500); return }
        const chatUrl = /\/v\d+$/.test(base) ? base + '/chat/completions' : base + '/v1/chat/completions'
        const results = {}
        for (const id of Object.keys(plan.cachedResults)) results[id] = plan.cachedResults[id]
        const started = Date.now()
        const queue = plan.toProbe.slice()
        let qIdx = 0
        const probeOne = async (modelId) => {
          await sleep(Math.floor(Math.random() * CHECK_JITTER_MS))
          const t0 = Date.now()
          const ac = new AbortController()
          const timer = setTimeout(() => ac.abort(), CHECK_TIMEOUT_MS)
          let http = 0
          let detail = '网络错误'
          try {
            const r2 = await fetch(chatUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
              body: JSON.stringify({ model: modelId, messages: [{ role: 'user', content: 'ping' }], max_tokens: 1 }),
              signal: ac.signal,
            })
            http = r2.status
            if (r2.ok) {
              detail = ''
              try { await r2.json() } catch { /* 200 非 JSON 也视为可达 */ }
            } else {
              const t = await r2.text().catch(() => '')
              let msg = t.slice(0, 160)
              try {
                const j = JSON.parse(t)
                if (isObj(j) && j.error !== undefined) msg = String((isObj(j.error) ? (j.error.message || j.error) : j.error))
              } catch { /* 保留原始文本 */ }
              detail = 'HTTP ' + http + (msg ? ' ' + msg : '')
            }
          } catch (err) {
            detail = (err && (err.name === 'AbortError' || err.name === 'TimeoutError'))
              ? '超时（' + CHECK_TIMEOUT_MS + 'ms）'
              : String((err && err.message) || err)
          } finally {
            clearTimeout(timer)
          }
          const ms = Date.now() - t0
          const cls = classifyProbe(http, detail)
          const entry = { status: cls.status, ms, error: cls.error, errorKind: cls.errorKind, checkedAt: Math.floor(Date.now() / 1000), cached: false }
          results[modelId] = entry
          checkCache.set(modelId, Object.assign({ ts: Date.now() }, entry))
```

</details>

**依据 3 · 源码核查**：[lib/index.js:6599-6654](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L6599-L6654)

敏感凭据多步骤写。

<details>
<summary>查看原文（56行）</summary>

```text
      if (pathname === '/dsh-tokenrhythm-bill/stepfun/key-use' && req.method === 'POST') {
        const body = await readBody(req)
        const keyId = isObj(body) && typeof body.keyId === 'string' ? body.keyId.trim()
          : (isObj(body) && typeof body.keyId === 'number' && Number.isFinite(body.keyId) ? String(body.keyId) : '')
        if (keyId === '') { writeJson(res, { ok: false, error: '缺少 keyId' }, 400); return }
        const un = stepKeyAccountOf(isObj(body) ? body.username : undefined)
        if (un === null) { writeJson(res, { ok: false, code: 'NO_STEP_ACCOUNT', error: '未配置阶跃账号（设置 → 阶跃账号）' }, 404); return }
        const cp = credentialsPath()
        if (cp === null) { writeJson(res, { ok: false, code: 'NO_FILE', error: '找不到 ~/.dsh 目录' }, 500); return }
        const orig = readTextSafe(cp)
        if (typeof orig !== 'string' || orig === '') {
          writeJson(res, { ok: false, code: 'NO_FILE', error: '读不到 .credentials.yaml——请先在「模型」页保存一次阶跃密钥' }, 500); return
        }
        const r = await stepRpc(stepLib.STEP_DEV_SERVICE, 'ListAccessKeys', {}, false, un)
        if (!r.ok) { writeJson(res, { ok: false, code: r.code, error: r.error }, 502); return }
        const list = isObj(r.data) && Array.isArray(r.data.accessKeys) ? r.data.accessKeys : []
        const hit = list.map((k) => (isObj(k) ? k : null)).find((k) => k !== null && String(k.keyId ?? k.key_id ?? '') === keyId) || null
        const fullKey = hit !== null && typeof hit.accessKey === 'string' ? hit.accessKey.trim() : ''
        if (fullKey === '') { writeJson(res, { ok: false, error: '未找到该密钥（可能刚被删除）' }, 404); return }
        const patched = patchCredentialLine(orig, 'STEP_API_KEY', fullKey)
        if (!patched.ok) {
          const msg = patched.code === 'NO_REF' ? '凭据文件里没有 STEP_API_KEY 行——请先在「模型」页保存一次阶跃密钥'
            : patched.code === 'AMBIGUOUS' ? '凭据文件里 STEP_API_KEY 出现多行，认不出哪行生效，已拒绝写入'
            : patched.code === 'UNSAFE_VALUE' ? '这把密钥含非常规字符，为避免写坏凭据文件已拒绝落盘'
            : '写入准备失败'
          writeJson(res, { ok: false, code: patched.code, error: msg }, 409); return
        }
        const tmp = cp + '.tokenrhythm.tmp'
        try {
          writeFileSync(tmp, patched.text, { mode: 0o600 })
          renameSync(tmp, cp)
          const after = readTextSafe(cp)
          const now = extractCredentialFromText('STEP_API_KEY', after)
          const sameLines = String(after).split('\n').length === orig.split('\n').length
          if (typeof after !== 'string' || String(now).trim() !== fullKey || !sameLines) throw new Error('verify')
        } catch {
          try { writeFileSync(cp, orig, { mode: 0o600 }) } catch { /* 回滚也失败：保留错误响应，不再放大 */ }
          try { if (existsSync(tmp)) unlinkSync(tmp) } catch { /* 尽力清理临时副本 */ }
          writeJson(res, { ok: false, code: 'WRITE_FAILED', error: '凭据文件写入校验未通过，已回滚原内容' }, 500); return
        }
        stepKeyPlanCache.clear()
        const act = activeCredentialKey('STEP_API_KEY')
        writeJson(res, {
          ok: true, account: un, keyId,
          keyName: hit && typeof hit.name === 'string' ? hit.name : '',
          masked: stepLib.maskStepKey(fullKey), prevMasked: stepLib.maskStepKey(patched.prev || ''),
          source: act.source,
        })
        return
      }

      // ================= ZCode（额度展示）路由 =================
      if (pathname === '/dsh-tokenrhythm-bill/zcode/quota' && req.method === 'GET') {
        if (!zcodeEnabled()) { writeJson(res, zcodeDisabledResponse()); return }
        writeJson(res, await fetchZcodeQuota(url.searchParams.get('force') === '1'))
        return
```

</details>

**依据 4 · 源码核查**：[lib/index.js:7025-7034](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L7025-L7034)

按需完整秘密路由。

<details>
<summary>查看原文（10行）</summary>

```text
      if (pathname === '/dsh-tokenrhythm-bill/opencsg/account/password' && req.method === 'GET') {
        if (!ocEnabled()) { writeJson(res, ocDisabledResponse()); return }
        loadState()
        const want = url.searchParams.get('identifier')
        const key = ocSessKey(want === null ? state.oc.activeAccount : want)
        const hit = state.oc.accounts.find((a) => ocSessKey(a.identifier) === key)
        if (!hit) { writeJson(res, { ok: false, error: '账号不存在' }, 404); return }
        writeJson(res, { ok: true, identifier: hit.identifier, password: hit.password })
        return
      }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:7122-7124](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L7122-L7124)

路由回收。

```text

  ctx.effect(() => ctx.webServer.register({ kind: 'prefix', path: '/dsh-tokenrhythm-bill', handler: serve }), 'tokenrhythm-bill: routes')
}
```

**依据 6 · 源码核查**：[package.json:39-41](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/package.json#L39-L41)

Node环境条件。

```text
  "engines": {
    "node": ">=20"
  },
```

#### 缺口

- 净费用/查询时间、Host访问控制和恢复可接受度无对照
  **影响**：观察优先，不给普通用户直接安装/财务依赖建议
  **进一步探讨**：用隔离非敏感环境比较门户/面板的正确身份读数、误归属、请求量与人工恢复。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 身份绑定收据与版本写入怎样证伪？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是平台/账号/provider/baseURL/key不可逆指纹和配置版本绑定缓存，读数收据携窗口/查询时间/完整性，敏感操作需独立请求授权及预期文件版本。现有角标已带keyLookup/stale和分账号会话/清枢单飞，不是从零发明归属：新增在跨身份失效、可信授权与持久化回执统一。

state用原子替换、失败显式报告；key-use写前比版本并用独占临时名，回滚也验证，无法判定则明确未知。相对现共享modelId缓存与固定tmp/旧orig回滚，目标是减少错误身份命中与丢更新，不是承诺省钱或自动财务对账。重设计需保多平台差异和用户明文副本责任，不把统一“成功”藏掉部分失败。

用模拟上游/无价值账号对照同名模型跨provider/换key、切账号归属、分页后页失败、并发key-use+外部编辑、未授权reveal、满盘及慢body。记录错误身份命中、丢更新、未授权拒绝、真实请求量/延迟、人工恢复与操作负担；若没有减少错误/丢更新，或授权/版本负担超过便利，否定独立插件方向，先修现有缓存和文件写入即可。该方案未实现和盲测，不计入当前效果。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1045-1072](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L1045-L1072)

当前modelId缓存基线。

<details>
<summary>查看原文（28行）</summary>

```text
export function buildCheckPlan(models, cache, force, now, ttl) {
  const ttlMs = Number(ttl) > 0 ? Number(ttl) : CHECK_TTL_MS
  const nowMs = typeof now === 'number' && Number.isFinite(now) ? now : Date.now()
  const hit = (id) => {
    if (cache == null) return null
    try {
      if (typeof cache.get === 'function') return cache.get(id) || null
      return isObj(cache) ? (cache[id] || null) : null
    } catch { return null }
  }
  const seen = {}
  const toProbe = []
  const cachedResults = {}
  const list = Array.isArray(models) ? models : []
  for (const raw of list) {
    if (typeof raw !== 'string') continue // 只接受字符串模型 ID（数字/对象等一律无效）
    const id = asStr(raw)
    if (id === '' || seen[id]) continue
    seen[id] = true
    if (toProbe.length >= CHECK_MAX_MODELS) break
    const h = hit(id)
    if (!force && h && typeof h === 'object' && typeof h.ts === 'number' && nowMs - h.ts < ttlMs) {
      cachedResults[id] = {
        status: h.status, ms: h.ms, error: h.error || null, errorKind: h.errorKind || null,
        checkedAt: h.checkedAt, cached: true,
      }
      continue
    }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:2843-2889](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L2843-L2889)

现归属/cache与可读数状态。

<details>
<summary>查看原文（47行）</summary>

```text
  const fetchTrKeyMode = async (key, fp, force) => {
    if (force !== true) {
      const hit = trKeyModeCache.get(fp)
      if (hit !== undefined && Date.now() - hit.ts < TR_KEYMODE_TTL_MS) return hit.mode
    }
    loadState()
    if (state.cookie === '') return { mode: 'unknown' }
    try {
      let up = await fetchWithTimeout(TOKENRHYTHM_BASE + '/api/api-keys', { headers: trHeaders(state.cookie) })
      if (up.status === 401 && (await reloginActive())) {
        up = await fetchWithTimeout(TOKENRHYTHM_BASE + '/api/api-keys', { headers: trHeaders(state.cookie) })
      }
      if (!up.ok) return { mode: 'unknown' }
      const keys = normalizePlatformKeys(await up.json().catch(() => null))
      const found = keys.find((k) => trKeyMatchesPlatform(key, k)) || null
      const mode = found === null
        ? { mode: 'miss' }
        : { mode: 'hit', match: { keyName: found.name, keyId: found.id } }
      trKeyModeCache.set(fp, { ts: Date.now(), mode })
      return mode
    } catch { return { mode: 'unknown' } }
  }

  /** 角标载荷：只带角标要用的字段（密钥名/ID + 五个读数 + 时间）。
   *  identifier（手机号/邮箱）、明文、掩码一概不出门——与阶跃 key-plan、OpenCSG
   *  key-account 同一个隐私口径（界面上出现手机号这件事，用户此前已点名否掉）。 */
  const trKeyBalancePayload = (providerId, mode, snap) => {
    const acc = snap !== null && snap.ok === true
      ? {
        balanceCny: trNum(snap.balanceCny),
        availableBalanceCny: trNum(snap.availableBalanceCny),
        frozenBalanceCny: trNum(snap.frozenBalanceCny),
        expiringBalanceCny: trNum(snap.expiringBalanceCny),
        nextExpiryAt: snap.nextExpiryAt || null,
        atMs: typeof snap.atMs === 'number' ? snap.atMs : null,
        stale: snap.stale === true,
      }
      : null
    return {
      ok: true,
      providerId,
      // 只有归属坐实时才摆密钥名（与阶跃/OpenCSG 同一规矩：没归属就不摆名字）
      key: mode !== null && mode.mode === 'hit' ? mode.match : null,
      keyLookup: mode !== null ? mode.mode : 'unknown',
      account: acc,
      accountError: acc === null ? ((snap && snap.error) || '基元余额暂不可用') : null,
    }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:3647-3693](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L3647-L3693)

已有分账号单飞骨架。

<details>
<summary>查看原文（47行）</summary>

```text
  const tfCachedFetch = async (cfg) => {
    const { force, identifier, key, caches, busy, ttlMs, path, shapeError, prefetch, build } = cfg
    const hit = caches.get(key)
    if (!force && hit && Date.now() - hit.ts < ttlMs) return { ...hit.data, cached: true, cachedAt: hit.ts }
    const inflight = busy.get(key)
    if (inflight !== undefined) return inflight
    const p = (async () => {
      const stale = () => {
        const s = caches.get(key)
        return s ? { ...s.data, cached: true, stale: true, cachedAt: s.ts } : null
      }
      const netFail = (err) => ({ ok: false, code: 'TF_NET', error: tfLib.tfErrorText('TF_NET', String((err && err.message) || err)) })
      const sess = await tfEnsureSession(false, identifier)
      if (!sess.ok) return stale() || sess
      const pre = prefetch === undefined ? null : await prefetch()
      let live = sess
      let r = null
      try {
        r = await tfRequest(path, { cookie: live.cookie, uid: live.uid })
      } catch (err) {
        return stale() || netFail(err)
      }
      if (r.authFailed) {
        // 401 = 会话真失效（平台没有 refresh 端点）→ 丢掉这枚 cookie，用存好的密码重登
        // 一次再试。**只重试一次**：再 401 就是账号侧的问题（被踢下线/被封），
        // 继续重试只会加深封锁。
        tfClearSess(key)
        const sess2 = await tfEnsureSession(true, identifier)
        if (!sess2.ok) return stale() || sess2
        live = sess2
        try {
          r = await tfRequest(path, { cookie: live.cookie, uid: live.uid })
        } catch (err) {
          return stale() || netFail(err)
        }
      }
      if (!r.ok) return stale() || { ok: false, code: r.code, error: tfLib.tfErrorText(r.code, r.message) }
      const data = await build(live, r.data, pre)
      if (data === null) return stale() || { ok: false, code: 'TF_SHAPE', error: shapeError }
      caches.set(key, { data, ts: Date.now() })
      return { ...data, cached: false }
    })()
    busy.set(key, p)
    try { return await p } finally { busy.delete(key) }
  }

  // ---- 用户信息（/api/user/self + 近 7 天用量）----
```

</details>

**依据 4 · 源码核查**：[lib/index.js:6599-6654](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L6599-L6654)

写入/回滚版本缺口。

<details>
<summary>查看原文（56行）</summary>

```text
      if (pathname === '/dsh-tokenrhythm-bill/stepfun/key-use' && req.method === 'POST') {
        const body = await readBody(req)
        const keyId = isObj(body) && typeof body.keyId === 'string' ? body.keyId.trim()
          : (isObj(body) && typeof body.keyId === 'number' && Number.isFinite(body.keyId) ? String(body.keyId) : '')
        if (keyId === '') { writeJson(res, { ok: false, error: '缺少 keyId' }, 400); return }
        const un = stepKeyAccountOf(isObj(body) ? body.username : undefined)
        if (un === null) { writeJson(res, { ok: false, code: 'NO_STEP_ACCOUNT', error: '未配置阶跃账号（设置 → 阶跃账号）' }, 404); return }
        const cp = credentialsPath()
        if (cp === null) { writeJson(res, { ok: false, code: 'NO_FILE', error: '找不到 ~/.dsh 目录' }, 500); return }
        const orig = readTextSafe(cp)
        if (typeof orig !== 'string' || orig === '') {
          writeJson(res, { ok: false, code: 'NO_FILE', error: '读不到 .credentials.yaml——请先在「模型」页保存一次阶跃密钥' }, 500); return
        }
        const r = await stepRpc(stepLib.STEP_DEV_SERVICE, 'ListAccessKeys', {}, false, un)
        if (!r.ok) { writeJson(res, { ok: false, code: r.code, error: r.error }, 502); return }
        const list = isObj(r.data) && Array.isArray(r.data.accessKeys) ? r.data.accessKeys : []
        const hit = list.map((k) => (isObj(k) ? k : null)).find((k) => k !== null && String(k.keyId ?? k.key_id ?? '') === keyId) || null
        const fullKey = hit !== null && typeof hit.accessKey === 'string' ? hit.accessKey.trim() : ''
        if (fullKey === '') { writeJson(res, { ok: false, error: '未找到该密钥（可能刚被删除）' }, 404); return }
        const patched = patchCredentialLine(orig, 'STEP_API_KEY', fullKey)
        if (!patched.ok) {
          const msg = patched.code === 'NO_REF' ? '凭据文件里没有 STEP_API_KEY 行——请先在「模型」页保存一次阶跃密钥'
            : patched.code === 'AMBIGUOUS' ? '凭据文件里 STEP_API_KEY 出现多行，认不出哪行生效，已拒绝写入'
            : patched.code === 'UNSAFE_VALUE' ? '这把密钥含非常规字符，为避免写坏凭据文件已拒绝落盘'
            : '写入准备失败'
          writeJson(res, { ok: false, code: patched.code, error: msg }, 409); return
        }
        const tmp = cp + '.tokenrhythm.tmp'
        try {
          writeFileSync(tmp, patched.text, { mode: 0o600 })
          renameSync(tmp, cp)
          const after = readTextSafe(cp)
          const now = extractCredentialFromText('STEP_API_KEY', after)
          const sameLines = String(after).split('\n').length === orig.split('\n').length
          if (typeof after !== 'string' || String(now).trim() !== fullKey || !sameLines) throw new Error('verify')
        } catch {
          try { writeFileSync(cp, orig, { mode: 0o600 }) } catch { /* 回滚也失败：保留错误响应，不再放大 */ }
          try { if (existsSync(tmp)) unlinkSync(tmp) } catch { /* 尽力清理临时副本 */ }
          writeJson(res, { ok: false, code: 'WRITE_FAILED', error: '凭据文件写入校验未通过，已回滚原内容' }, 500); return
        }
        stepKeyPlanCache.clear()
        const act = activeCredentialKey('STEP_API_KEY')
        writeJson(res, {
          ok: true, account: un, keyId,
          keyName: hit && typeof hit.name === 'string' ? hit.name : '',
          masked: stepLib.maskStepKey(fullKey), prevMasked: stepLib.maskStepKey(patched.prev || ''),
          source: act.source,
        })
        return
      }

      // ================= ZCode（额度展示）路由 =================
      if (pathname === '/dsh-tokenrhythm-bill/zcode/quota' && req.method === 'GET') {
        if (!zcodeEnabled()) { writeJson(res, zcodeDisabledResponse()); return }
        writeJson(res, await fetchZcodeQuota(url.searchParams.get('force') === '1'))
        return
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1907-1914](https://github.com/162568316/dsh-tokenrhythm-bill/blob/4d9800cc534fde8dfd06e99bfe94b6af81c25d31/lib/index.js#L1907-L1914)

state无显式成功回执。

```text
  const saveState = () => {
    const file = statePath()
    if (file === null) return
    try {
      mkdirSync(dirname(file), { recursive: true })
      writeFileSync(file, JSON.stringify({ cookie: state.cookie, csrf: state.csrf, prefs: state.prefs, accounts: state.accounts, activeAccount: state.activeAccount, update: state.update, trKeys: state.trKeys, step: state.step, tf: state.tf, oc: state.oc, savedAt: Date.now() }, null, 2) + '\n', { encoding: 'utf8', mode: 0o600 })
    } catch { /* best-effort：丢持久化不丢功能 */ }
  }
```

#### 缺口

- 身份/授权/版本收据未实现且用户愿意承担的管理负担未知
  **影响**：仅可证伪修正方向，不声称已有新产品需求
  **进一步探讨**：先故障矩阵与门户对照小样，改善不抵成本则只做必要修复。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
