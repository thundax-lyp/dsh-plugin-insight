# 小鲸鱼余额挂件 · 铁盆鲸鱼娘版

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[2154a5d](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/tree/2154a5deb30039f9f5825677b653a825975fcee2)

<!-- BEGIN META -->
[![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl)
<!-- END META -->

> **功能**：在 DSH 页面显示 DeepSeek 余额及观测消费，并提供铁盆角色、音效和预算提示。

> **亮点**：沿用上游账本和宿主接线，把两套铁盆角色及钢管音效接入内置预设。见 [Q01](#research-q01)、[Q03](#research-q03)。

> **主要限制**：余额变化只覆盖实际采集窗口，充值或账户切换会改变解释。反向代理也可能改变写门禁看到的 Host。见 [Q02](#research-q02)、[Q04](#research-q04)。

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
  - [Q01 · 挂件怎样出现在 Web 与 Electron？](#detail-section-11)
  - [Q02 · 显示的今日已用如何从余额得到？](#detail-section-12)
  - [Q03 · 铁盆版相对原挂件增加什么？](#detail-section-13)
  - [Q04 · 远程浏览和自定义额度接口有哪些信任前提？](#detail-section-14)
  - [Q05 · 如何判断日常查看值不值得采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有本机 DSH 且要反复查看 DeepSeek 余额的个人，可从当前对话页面读取余额和观测时间。见 [Q01](#research-q01)。

供应商账单适合正式对账，原版挂件已提供同类余额和记账能力。铁盆版沿用余额链并增加随包角色与提示音。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 余额挂件 | 在对话中查看当前余额 | 需宿主及供应商凭据可用 |
| 观测账本 | 区分不同账户和币种的余额变化 | 只覆盖采集窗口 |
| 铁盆角色与音效 | 选择随包预设 | 与上游原版共用路由 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH、WebServer、凭据及连接服务 | 基本加载需要 | 挂载页面与资源路由 | 检查宿主状态和实际资源 |
| 可访问 DeepSeek 余额服务与账号或凭据 | 余额需要 | 获取采样数据 | 明确标记错误或旧缓存 |
| 独立 profile 及本机受信配置 | 受控试用需要 | 避开原版路由冲突和远程误写 | 停用冲突版本并回供应商页面 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 本人在隔离 profile 加载单一挂件 | 页面及资源路由可见 |
| 观测 | 用单一账户读取余额与时间 | 核账户、币种和旧缓存状态 |
| 对账 | 手工查看供应商明细 | 观测消费和实际账单分别解释 |
| 退出 | 停用挂件并核页面恢复 | 宿主或账本异常时回供应商页面 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | DSH 与网络 | 选 profile、配置与核账户 | 配置耗时未知 |
| 持续 | 请求、界面渲染及本机账本 | 核旧缓存和异常 | 轮询成本与提醒效果未测 |
| 恢复 | 账本及配置备份 | 停用后核供应商账单和主机 | 真实恢复耗时未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 余额显示 | 接口回退、缓存及失败状态 | 实际到账时间和数据一致性 |
| 观测消费 | 按账户、币种与日期维护观察 | 是否完整对应供应商账单 |
| 角色提示 | 内置形象及音效分组 | 是否改善识别或减少干扰 |

单位任务为一次核对同账户余额与消费区间。

> **思考**：余额变化只覆盖实际采集窗口，充值或账户切换会改变解释。反向代理也可能改变写门禁看到的 Host。见 [Q02](#research-q02)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：沿用上游账本和宿主接线，把两套铁盆角色及钢管音效接入内置预设。见 [Q01](#research-q01)、[Q03](#research-q03)。

桌面提前注册注入，普通 Web 从 HTML 注入。余额和记账失败分别表达，资源和写操作通过统一校验。

<a id="detail-section-5"></a>

### 1.4 主要限制

余额变化只覆盖实际采集窗口，充值或账户切换会改变解释。反向代理也可能改变写门禁看到的 Host。见 [Q02](#research-q02)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在隔离配置观察单一官方余额。若来源不明、账本不同或与原版冲突，停用后查看供应商账单。见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持 Web 与 Electron 注入、余额来源回退和分本记账。铁盆素材是 fork 的主要差异，宿主可用性与正式对账未验。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、CHANGELOG.md、lib/accounting.mjs、PROVENANCE.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定源码宿主、余额、观测账本、fork 素材接线和代表凭据边界。未运行目标或接触真实凭据，未审计所有自定义供应商模板、Codex 本地统计及计价。
- 下一步：在隔离宿主核 Web 与 Electron，使用非敏感凭据对照余额和账单，并核写门禁及停用恢复。

**分析版本**

- **仓库**：[Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl)
- **版本号**：0.5.0（[固定提交 2154a5d](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/tree/2154a5deb30039f9f5825677b653a825975fcee2)）
- **版本日期**：2026-10-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可突出显示最后成功采集时间和当前账本可见区间。对照发现误读没有减少时，回退到仅显示余额并人工核对。见 [Q05](#research-q05)。

在隔离宿主核 Web 与 Electron，使用非敏感凭据对照余额和账单，并核写门禁及停用恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 21578 | 20596 | 962 | — |
| .md | source | 6 | 1033 | — | — | 23533 |
| .mjs | source | 5 | 1245 | 1028 | 141 | — |
| .mjs | test | 2 | 354 | 289 | 41 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：铁盆版挂件怎样显示可核对的 DeepSeek 余额与观测消费，相对上游增加什么，实际使用依赖哪些边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 挂件怎样出现在 Web 与 Electron？

**研究主题**：场景与需求、功能与机制、依赖、兼容与流程

#### 完整回答

面向反复在 DSH 中用 DeepSeek、想在当前页面随手查看余额的人。手工打开供应商页面可以查明细，挂件把余额和提示放回对话界面。根包通过 Cordis 挂载。Web 等宿主服务就绪后以 tapIndex 注入脚本；Electron 的静态页面通过宿主启动时收集的结构化注入行。apply 一开始就注册该行，避免凭据服务未就绪时错过收集。结构化行内联创建脚本并处理错误，目的在于路由缺失时避免脚本加载失败阻断宿主启动。随后才在依赖齐备时注册实际资源和余额路由。装载脚本成功仅证明界面入口，有效余额仍需核供应商和账户。源码与作者说明表明两版复用同一路由前缀，同 profile 应避免同时安装上游与 fork。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:13-22](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/package.json#L13-L22)

入口和随包文件。

<details>
<summary>查看原文（10行）</summary>

```text
  "type": "module",
  "main": "lib/index.js",
  "scripts": {
    "test": "node test/helpers.test.mjs && node test/host-smoke.test.mjs"
  },
  "files": [
    "lib",
    "assets",
    "cordis.patch.yml",
    "screenshots.json",
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:22-24](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/cordis.patch.yml#L22-L24)

根包补丁挂载。

```text
- insert:
    - id: dsh-whale-widget-bowl
      name: dsh-whale-widget-bowl
```

**依据 3 · 源码核查**：[lib/index.js:698-729](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/lib/index.js#L698-L729)

Electron 启动注入、去重与等待依赖。

<details>
<summary>查看原文（32行）</summary>

```text
const DESKTOP_WIDGET_ROW_TEXT =
  '(function(){try{var d=document.body||document.head||document.documentElement;if(!d)return;' +
  'var s=document.createElement("script");s.src="/dsh-whale/widget.js";' +
  's.onerror=function(){};d.appendChild(s)}catch(e){}})()'

export default {
  name: 'whale-balance-widget',
  // v758：**有意去掉对象级 `inject: ['webServer','credentials','connection']`**（issue #154 的隐患面）。
  // 对象级 inject 会把整个 apply() 推迟到三个服务就绪之后；而桌面端的注入表是**宿主启动时一次性
  // 收集**的（`dsh-desktop-host`：`collectIndexInjections()` → IPC → 渲染层），订阅一旦晚于那次收集，
  // 这一行就永远进不了表 = 桌面端挂件完全不出现（#152/#153 那位报告人无法稳定复现的正是这个竞态）。
  // 现在 apply() 立刻执行、**第一件事就是注册注入行**（它不依赖任何服务），其余逻辑原样放进
  // `root.inject([...], cb)` 局部等待 —— 语义与原来的对象级 inject 等价，但行的注册不再被推迟。
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

**依据 4 · 源码核查**：[lib/index.js:4259-4273](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/lib/index.js#L4259-L4273)

Web 注入及桌面差异。

<details>
<summary>查看原文（15行）</summary>

```text
    disposers.push(ctx.webServer.tapIndex((html) => {
      if (html.indexOf('/dsh-whale/widget.js') !== -1) return html
      const tag = '<script defer src="/dsh-whale/widget.js"></script>'
      if (html.indexOf('</body>') !== -1) return html.replace('</body>', tag + '</body>')
      return html + tag
    }))

    // —— 官方 DSH 桌面端（Electron）适配（issue #152 / #153 / #154）——
    // 桌面壳的 index.html 是**从安装包静态 dist 直接读盘**的（`dsh-app://app/`），永远不经过宿主的
    // renderIndex()，所以上面的 tapIndex 在桌面端不生效 —— 于是"宿主半区活着、客户端半区从未被请求"。
    // 桌面端唯一的注入通道是 `webserver/index-inject` 的结构化行（宿主启动时 collectIndexInjections()
    // 经 IPC 交给渲染层，渲染层按 kind 逐行应用）。
    // **该行的注册已上移到 apply() 开头**（见 `DESKTOP_WIDGET_ROW_TEXT` 上方那段注释）：两个原因 ——
    // ① 桌面端的注入表是**一次性收集**的，行必须尽早进表；② 行本身改成了**内联 script 行**，
    // 因为页面侧解释器对 `script-src` 是"加载失败即 reject 整个 boot"（issue #154 的致命启动错误）。
```

</details>

**依据 5 · 作者声明**：[CHANGELOG.md:13-15](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/CHANGELOG.md#L13-L15)

作者声明共用路径和同 profile 冲突。

```text
- **说明**：上游 v0.3.1 起的账本原子写（`lib/index.js` 的临时文件 + rename）与「余额缓存按写入时刻计 TTL」本版本**直接沿上游实现**，不再保留本仓库旧写法；跨天首次观测的记账口径由上游 `lib/accounting.mjs` 重设计覆盖
- **工程**：`npm test` 从「纯函数自检」扩成两层 —— `test/helpers.test.mjs`（纯函数 + **fork 不变量**：内置角色、钢管音效、桌面端注入行、包名 / patch id / 版本三处一致性）与 `test/host-smoke.test.mjs`（假宿主把 `lib/index.js` 真跑起来逐条打增量路由，不碰真实 `$DSH_HOME`）；专门防「跟随上游时增量悄悄丢失」。同时引入上游的 0 依赖维护脚本与 CI（`tools/ci-audit.mjs` 等，包名断言已改为本仓库，并把 `npm test` 加进 `ci.yml`）
- **变更**：版本号 0.5.0（本仓库自己的版本线，包内 `version` 字段同步）；路由前缀仍与上游一致（`/dsh-whale/`），**与原版不可共存**于同一 profile
```

#### 缺口

- 未核目标 Electron 实际装载和禁用后重启。
  **影响**：不能确认宿主启动时序普遍可靠。
  **进一步探讨**：在隔离 profile 对照启用、缺路由、禁用后重启。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 显示的今日已用如何从余额得到？

**研究主题**：功能与机制、工程质量与复用、效果与总成本

#### 完整回答

余额优先读宿主配置的 DeepSeek API 凭据，无法解析或请求失败后尝试宿主账号登录态。官方余额请求有超时及有限重试。并发余额读取复用同一请求，成功余额按写入时刻缓存，暂时失败可返回明确标旧的缓存。账户内部标识会从公共结果移除。若账本还能读但本次写入失败，返回余额并附记账错误。账本结构坏到无法读取时返回失败。

账本按账户范围和币种分本，以北京时间日分桶。当天第一次有效观测设开盘，后续分别累计下降和上升，忽略乱序重复。上升可能是充值或调整，需要核对。观测前发生的消费无法从当天记录得出，跨账户与跨币种也不能直接当总账。事件估算另存，余额变化不必然等于模型每轮费用。要核一次合格任务，应比较观测时间、账户、币种、更新标记以及官方账单。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1224-1263](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/lib/index.js#L1224-L1263)

API 凭据优先及宿主账号回退。

<details>
<summary>查看原文（40行）</summary>

```text
    async function fetchBalance() {
      // v739（用户反馈「每次新实例的第一次余额请求都失败」）：
      // ① 冷启动时凭据服务可能尚未就绪（resolve 抛错），这与「确实没配置」不同 → 短延迟重试一次；
      // ② 单次超时从 20s 收到 8s，保证「2 次尝试 + 退避」明显短于前端 FETCH_TIMEOUT_MS(25s) ——
      //    否则前端先 abort，用户看到的永远是「第一次失败」，只能干等 60 秒后的下一轮。
      let cred = null
      let credErr = null
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          cred = await ctx.credentials.resolve('DEEPSEEK_API_KEY')
          credErr = null
          break
        } catch (err) {
          credErr = err
          if (attempt === 0) { await new Promise((r) => setTimeout(r, 700)); continue }
          // v781：凭据服务报错时**也要试账号路**（以前直接 return，登录态用户就被这条挡住）
          return await accountFallback({ code: 'NO_KEY', error: '凭据读取失败: ' + String((err && err.message) || err).slice(0, 160) })
        }
      }
      if (!cred) {
        // v759（issue #157）：没有 API key 时退回 DSH 账号登录态；两条路互不干扰，API key 始终第一优先。
        return await accountFallback(null)
      }
      const apiFail = await fetchApiKeyBalance(cred)
      if (apiFail.ok) return apiFail
      // v781：key 路**任何**失败都再试一次账号路（401/结构异常/超时都算）
      void credErr
      return await accountFallback(apiFail)
    }

    // API key 路（原 fetchBalance 的主体，v781 抽出来以便"失败后回退账号路"）
    async function fetchApiKeyBalance(cred) {
      let lastErr = null
      for (let attempt = 0; attempt < 2; attempt++) {
        let res
        try {
          res = await fetch(BALANCE_URL, {
            headers: { Authorization: 'Bearer ' + cred.value },
            signal: AbortSignal.timeout(8000),
          })
```

</details>

**依据 2 · 源码核查**：[lib/index.js:2920-2969](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/lib/index.js#L2920-L2969)

公共结果、缓存及异常。

<details>
<summary>查看原文（50行）</summary>

```text
    function publicBalance(payload) {
      const { accountTag, ...visible } = payload
      const led = readUsageLedger()
      const summary = daySummary(led, todayKey())
      const nowSec = Math.floor(Date.now() / 1000)
      return {
        ...visible, version: '0.5.0', isPeak: isPeakTime(nowSec),
        // 峰谷切换点与节假日清单：前端倒计时要与宿主同源（否则法定节假日会算错切换点）
        peakNextChangeAt: nextPeakChangeAt(nowSec),
        peakHolidays: HOLIDAY_VALLEY_LIST,
        todayUsage: summary.amount, todayUsageCurrency: summary.currency,
        usageSource: summary.source, usageLabel: summary.label, usageMode: 'ledger',
        accounting: balanceSummary(led, todayKey()),
      }
    }

    function getBalance(force = false) {
      const now = Date.now()
      if (!force && balanceCache && now - balanceCache.at < BALANCE_TTL_MS) {
        return Promise.resolve(publicBalance(balanceCache.payload))
      }
      if (balanceInFlight) return balanceInFlight
      balanceInFlight = fetchBalance()
        .then((payload) => {
          if (payload.ok) {
            // v759（issue #157 报告人踩到）：**"记不了账"不该吞掉已经拿到的余额**。
            // 以前 recordLedgerUsage 抛错会被最外层 .catch 包成「余额服务异常: …」，
            // 界面看起来像"接口没通"，其实余额已经拿到了（accountTag/币种不合法就会这样）。
            // 但要与"**账本整个读不出来**"区分开：那种情况必须保持 fail-closed（见下面的 rethrow）——
            // 一边是"余额拿到了、只是没记上账"，一边是"账本已经坏了、连今日已用都算不出来"，
            // 后者若也回 ok:true，用户会以为一切正常，而账本其实不可用。
            let ledgerError = ''
            try {
              recordLedgerUsage(payload.totalBalance, payload.currency, payload.accountTag, Date.parse(payload.updatedAt))
            } catch (err) {
              ledgerError = String((err && err.message) || err).slice(0, 160)
            }
            let visible
            try {
              visible = publicBalance(payload) // 读账本算今日已用/近 7 天
            } catch (err) {
              throw err // 账本读不出来（结构损坏等）→ 交给最外层 .catch，报 ok:false 并保留原记录
            }
            balanceCache = { at: Date.now(), payload } // 先缓存：之后即使记账失败，余额也继续显示
            return ledgerError ? { ...visible, ledgerError } : visible
          }
          if (payload.transient && balanceCache) {
            return { ...publicBalance(balanceCache.payload), stale: true, error: payload.error }
          }
          return publicBalance(payload)
```

</details>

**依据 3 · 源码核查**：[lib/accounting.mjs:123-173](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/lib/accounting.mjs#L123-L173)

摘要标注、分本、时间和首观测。

<details>
<summary>查看原文（51行）</summary>

```text
export function balanceSummary(ledger, day = beijingDay()) {
  const book = currentBook(ledger)
  const row = book && book.days && book.days[day]
  if (!row) return null
  const correction = row.correction
  const needsReview = row.creditUnits > (correction ? correction.creditUnits : 0)
  const source = needsReview ? 'balance-needs-review' : correction ? 'balance-corrected' : 'balance-observed'
  return {
    day, amount: preciseMoney(observedAmount(row)), currency: book.currency, source,
    label: needsReview ? '已观测消费 · 待核对余额调整' : correction ? '已校正消费' : '已观测消费',
    firstObservedAt: row.firstAt, lastObservedAt: row.lastAt,
    openingBalance: row.openingUnits / SCALE, currentBalance: row.lastUnits / SCALE,
    observedDecrease: row.debitUnits / SCALE, observedIncrease: row.creditUnits / SCALE,
    needsReview, revision: revisionOf(ledger, row),
    ...partialDayInfo(day, row),
    credits: correction ? correction.creditsUnits / SCALE : null,
    otherDebits: correction ? correction.otherDebitsUnits / SCALE : null,
    correctedAt: correction ? correction.at : null,
  }
}

// Mutates the caller-owned ledger; this module itself never reads or writes files.
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
```

</details>

**依据 4 · 源码核查**：[lib/accounting.mjs:175-190](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/lib/accounting.mjs#L175-L190)

累计变化与显示口径。

<details>
<summary>查看原文（16行）</summary>

```text
  } else {
    const delta = row.lastUnits - units
    if (delta > 0) row.debitUnits += delta
    if (delta < 0) row.creditUnits -= delta
    row.lastUnits = units
    row.lastAt = at
  }
  book.lastAt = at
  ledger.date = day
  // Compatibility fields for the existing UI and old settings writers.
  ledger.dayStart = row.openingUnits / SCALE
  ledger.lastBalance = row.lastUnits / SCALE
  const summary = balanceSummary(ledger, day)
  ledger.todayUsage = summary.amount
  ledger.history ||= {}
  ledger.history[day] = summary.amount
```

</details>

**依据 5 · 源码核查**：[lib/accounting.mjs:244-277](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/lib/accounting.mjs#L244-L277)

事件估算与账本分离。

<details>
<summary>查看原文（34行）</summary>

```text
export function eventEstimate(ledger, day) {
  return sumMoney((Array.isArray(ledger.events) ? ledger.events : [])
    .filter(e => e.day === day).map(e => Number(e.cost) || 0))
}

export function daySummary(ledger, day) {
  const observed = balanceSummary(ledger, day)
  const estimate = eventEstimate(ledger, day)
  const books = bookBreakdown(ledger, day)
  const others = books.filter(b => !b.active)
  // 同币种才谈"合计"；不同币种只列明本数
  const otherSame = others.filter(b => !observed || b.currency === observed.currency)
  const common = { eventEstimate: estimate, eventCurrency: 'CNY', bookBreakdown: books, bookCount: books.length }
  if (observed) {
    if (!otherSame.length) return { ...observed, ...common }
    const other = sumMoney(otherSame.map(b => b.amount))
    const tail = others.length > otherSame.length ? '（另有其它币种 ' + (others.length - otherSame.length) + ' 本）' : ''
    // ⚠️ 不要把金额拼进 label：`label` 会被前端直接当"今日已用"的**前缀**显示
    //    （「<label> <金额>」），塞第二个数字会读成两个数。另给 historyHint 供面板/悬停提示用。
    return {
      ...observed, ...common, otherBookAmount: other,
      historyHint: '另有 ' + otherSame.length + ' 个历史记账本（换过 API key）· ' + other.toFixed(2) + tail,
    }
  }
  // 当前本没有这一天的记录，但别的记账本有（换/删过 API key）⇒ 显示成「已观测消费 · 历史账户」，
  // 而不是退化成「本地估算 ¥0.00」（issue #163：数据没丢，只是没有任何入口能再看到它）
  const fromOther = others[0]
  if (fromOther) {
    return {
      day, amount: fromOther.amount, currency: fromOther.currency,
      source: 'balance-observed-other-account', label: '已观测消费 · 历史账户',
      firstObservedAt: fromOther.firstObservedAt, lastObservedAt: fromOther.lastObservedAt,
      needsReview: fromOther.needsReview, ...common,
      ...partialDayInfo(day, { firstAt: fromOther.firstObservedAt, lastAt: fromOther.lastObservedAt }),
```

</details>

#### 缺口

- 充值、跨日及宿主账号切换时尚无对账样本。
  **影响**：不能把挂件显示值当正式账单。
  **进一步探讨**：对照供应商在同账户和币种下的充值及消费明细。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 铁盆版相对原挂件增加什么？

**研究主题**：贡献与相对优势、工程质量与复用

#### 完整回答

作者标明通用余额、账本及 Electron 接入来自上游 v0.3.18。此 fork 追加顶碗与拿碗两个角色和钢管音效。两角色在内置表映射到包内 PNG，列表返回 builtin 与置顶状态，删除路由明确拒绝。钢管组把按下与松开绑定两个片段，响应按片段声明返回 MIME。收益主要是同一工具的视觉与提示偏好。无需另建角色资源目录即可选择预设，实际识别速度或提醒效果没有对照。作者的素材说明将代码 MIT 与美术、音频使用条件分开，不能据代码许可证推定素材可再分发。

#### 证据与依据

**依据 1 · 作者声明**：[CHANGELOG.md:5-15](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/CHANGELOG.md#L5-L15)

作者列出上游和 fork 增量。

<details>
<summary>查看原文（11行）</summary>

```text
## 0.5.0

跟随上游 [MeteorNOX/DeepSeek-Balance-Whale-Widget](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget) 从 v0.3.0 升到 **v0.3.18**，**支持官方桌面版（Electron 客户端）**；本仓库两处增量重新落到新基座上。

- **新增：官方桌面端（Electron）可用**。上游 v0.3.12 起，桌面壳的 `index.html` 是安装包静态 `dist` 直出（`dsh-app://app/`），**不经过宿主 `renderIndex()`**，所以老的 `tapIndex`（函数式 HTML 变换）结构上过不了 IPC —— 表现就是「桌面端右下角什么都没有，控制台也不报错」。本版本随上游一并带上新链路：订阅 `webserver/index-inject` 推一行**内联 `script` 行**（不是 `script-src` 行：后者加载失败会 reject 掉 boot，正是 issue #154 那个「关掉插件后刷新应用起不来」的致命错误），由行内脚本自建 `<script src="/dsh-whale/widget.js">` 并吞掉 `onerror`；注入行在 `apply()` 首步注册，不被服务就绪推迟（issue #152/#153 的竞态）
- **整合**：上游 v0.3.1 → v0.3.18 的全部内容整体到位 —— 音效与提示面板（四入口 + 折叠）、对话名模块、DSH 账号登录态读余额、凭据外带安全修复（S1）、信任栅栏 fail-closed、记账分本可见性、峰谷补法定节假日、Codex 本地会话统计、气泡抢占顺序、桌面端窗口键避让、`wait.json` 等
- **保留增量（重新落盘，非 cherry-pick）**：顶碗 / 拿碗两套形象仍以「内置角色」形式随包提供（不可删、可置顶、旧 `roles.json` 兜底补回、前端隐藏删除按钮）；钢管音效仍为第三套内置预置组（`pipe` / `p1` / `p2`，按下 = 撞击 + 前段余音，松开 = 后段余音），可用于按压、松开与任务结束音
- **保留加固**：`size.json` 读写两侧夹紧（scale 0.6–2.5 / vol 0–1）与原子写；`role-image` / `audio-fragment` / `bubble-img` 的 id 一律按 `^[A-Za-z0-9_-]{1,64}$` 白名单校验、并以匹配结果构造路径；分桶时间兼容 epoch 秒 / 毫秒 / ISO 字符串；去掉余额与用量端点上的 `Access-Control-Allow-Origin: *`（同源不需要；上游 v0.3.18 仍带这一条）
- **说明**：上游 v0.3.1 起的账本原子写（`lib/index.js` 的临时文件 + rename）与「余额缓存按写入时刻计 TTL」本版本**直接沿上游实现**，不再保留本仓库旧写法；跨天首次观测的记账口径由上游 `lib/accounting.mjs` 重设计覆盖
- **工程**：`npm test` 从「纯函数自检」扩成两层 —— `test/helpers.test.mjs`（纯函数 + **fork 不变量**：内置角色、钢管音效、桌面端注入行、包名 / patch id / 版本三处一致性）与 `test/host-smoke.test.mjs`（假宿主把 `lib/index.js` 真跑起来逐条打增量路由，不碰真实 `$DSH_HOME`）；专门防「跟随上游时增量悄悄丢失」。同时引入上游的 0 依赖维护脚本与 CI（`tools/ci-audit.mjs` 等，包名断言已改为本仓库，并把 `npm test` 加进 `ci.yml`）
- **变更**：版本号 0.5.0（本仓库自己的版本线，包内 `version` 字段同步）；路由前缀仍与上游一致（`/dsh-whale/`），**与原版不可共存**于同一 profile
```

</details>

**依据 2 · 源码核查**：[lib/index.js:48-76](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/lib/index.js#L48-L76)

两角色、资源路径与音效组。

<details>
<summary>查看原文（29行）</summary>

```text
// 内置角色（不可删）：铁盆鲸鱼娘版随包发布的另外两套形象（assets/），与用户自导入角色
// 走同一套 roles 协议（roles.json 列表 / role-image.png 取图 / role-pin.json 置顶）。
const BUILTIN_ROLES = [
  // createdAt 用负值：sortRoles 对未置顶角色按 createdAt 倒序，负值使其恒排在真实导入角色之后
  { id: 'bowl', name: '顶碗鲸鱼娘', format: 'png', pinnedAt: null, createdAt: -1 },
  { id: 'hold', name: '拿碗鲸鱼娘', format: 'png', pinnedAt: null, createdAt: -2 },
]
// 内置角色的图片文件：包内 assets（均为 1179×1179 正方形透明画布，人物主体与默认形象按脸宽对齐）
const BUILTIN_ROLE_FILES = {
  bowl: [path.join(PACKAGE_ROOT, 'assets', 'DSniang-bowl.png')],
  hold: [path.join(PACKAGE_ROOT, 'assets', 'DSniang-hold.png')],
}
function isBuiltinRole(id) {
  return BUILTIN_ROLES.some((r) => r.id === id)
}
// 自定义音频片段存放目录（每个片段一个 <id>.wav + audio.json 索引）
const AUDIO_DIR_CANDIDATES = [
  path.join(DSH_HOME, 'whale-audio'),
  path.join(DSH_HOME, 'profiles', 'web', 'whale-audio'),
  DATA_CANDIDATES_TAIL[0] + 'whale-audio/',
  DATA_CANDIDATES_TAIL[1] + 'whale-audio/',
]
const AUDIO_INDEX_NAME = 'audio.json'
// 内置预设音效组（不可删、不可改），对应 assets 里的 Ya/D 系列
const PRESET_GROUPS = {
  duck: { id: 'duck', name: '小黄鸭', press: 'ya1', release: 'ya2', preset: true },
  fx1: { id: 'fx1', name: '音效1', press: 'd1', release: 'd2', preset: true },
  // 铁盆鲸鱼娘版新增：钢管（经典金属管落地声：按下=撞击"哐"，松开=余音"嗡……"）
  pipe: { id: 'pipe', name: '钢管', press: 'p1', release: 'p2', preset: true },
```

</details>

**依据 3 · 源码核查**：[lib/index.js:3161-3175](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/lib/index.js#L3161-L3175)

角色列表绑定内置与置顶。

<details>
<summary>查看原文（15行）</summary>

```text
    function rolesPayload() {
      const index = readRolesIndex()
      return {
        ok: true,
        roles: sortRoles(index.roles).map((r) => ({
          id: r.id,
          name: String(r.name || r.id),
          url: r.id === ROLE_DEFAULT_ID ? '/dsh-whale/image.png' : '/dsh-whale/role-image.png?id=' + encodeURIComponent(r.id),
          pinned: !!(r.pinnedAt && r.pinnedAt > 0),
          pinnedAt: r.pinnedAt || null,
          createdAt: r.createdAt || null,
          // format: 'png' | 'gif' | 'apng'（旧角色无 format 字段 → png）
          format: r.format === 'gif' || r.format === 'apng' ? r.format : 'png',
          // builtin: 随包内置角色（顶碗/拿碗），前端据此隐藏删除按钮
          builtin: isBuiltinRole(r.id),
```

</details>

**依据 4 · 源码核查**：[lib/index.js:3750-3766](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/lib/index.js#L3750-L3766)

拒绝删除内置角色。

<details>
<summary>查看原文（17行）</summary>

```text
      kind: 'exact',
      path: '/dsh-whale/role-delete.json',
      handler: async (req, res) => {
        try {
          const body = await readBodyMax(req, 8192)
          const parsed = JSON.parse(body)
          const id = String(parsed.id || '')
          if (id === ROLE_DEFAULT_ID) {
            res.writeHead(400, JSON_HEADERS)
            res.end(JSON.stringify({ ok: false, error: 'cannot delete default role' }))
            return
          }
          if (isBuiltinRole(id)) {
            res.writeHead(400, JSON_HEADERS)
            res.end(JSON.stringify({ ok: false, error: 'cannot delete builtin role' }))
            return
          }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:3924-3951](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/lib/index.js#L3924-L3951)

按音频片段的实际 MIME 输出。

<details>
<summary>查看原文（28行）</summary>

```text
    disposers.push(registerRoute({
      kind: 'exact',
      path: '/dsh-whale/audio-fragment.wav',
      handler: (req, res) => {
        try {
          const id = audioIdFromUrl(req.url)
          const bytes = loadAudioFragmentBytes(id)
          if (!bytes) throw new Error('bad fragment id')
          // 预设/内置片段可能是 mp3 也可能是 wav —— Content-Type 必须与字节匹配，
          // 否则浏览器解码路径/加载行为异常（MIME 与字节不符会导致听感差异）
          const mime = fragmentMime(id)
          res.writeHead(200, {
            'Content-Type': mime,
            'Cache-Control': 'no-store',
            'Content-Length': String(bytes.length),
          })
          res.end(bytes)
        } catch (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
          res.end('audio fragment unavailable')
        }
      },
    }))

    // 片段字节对应的 MIME：内置/预设片段按声明，自定义片段一律 wav
    function fragmentMime(fragId) {
      const f = PRESET_FRAGMENTS[fragId]
      return (f && f.mime) || 'audio/wav'
```

</details>

**依据 6 · 作者声明**：[PROVENANCE.md:3-10](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/PROVENANCE.md#L3-L10)

作者声明素材许可范围。

```text
本仓库的**代码**按 MIT 许可（见 [`LICENSE`](LICENSE)）。`assets/` 目录下的**美术素材**（图片 / 动图 / 音效）**不在 MIT 覆盖范围内**，按下面的说明「原样提供」。

## 一、许可范围

| 范围 | 许可 |
|---|---|
| `lib/`、`cordis.patch.yml`、`package.json`、文档与维护脚本 | **MIT**（见 `LICENSE`） |
| `assets/**`（图片 / 动图 / 音效） | **不适用 MIT**：由维护者提供或使用 AI 工具生成，按 **as-is** 随插件分发，仅用于运行本插件；不授予再许可，也不声明为原创作品。 |
```

#### 缺口

- 未核真实主机的音频解码、静音和提醒辨识。
  **影响**：差异只支持个性化。
  **进一步探讨**：在相同宿主对照原版和 fork 的提示识别与干扰。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 远程浏览和自定义额度接口有哪些信任前提？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

挂件路由先检查 Host 和跨站来源，再对写请求核回环 Host 或明确管理员名单，最后在可用时委托宿主信任栅栏。宿主栅栏抛异常时拒绝。旧宿主没有栅栏时，自校验依赖回环、可信 Host 和请求头。写请求的判断依据是 Host 字段，不能把它理解成验证了远端套接字或设备持有人。反向代理改写 Host 时尤其要核实际部署是否仍满足预期。余额 JSON 不开放通配 CORS，这和服务器发往供应商的请求是两层边界。

自定义模型余额会先计算目的地，再检查是否能带凭据，附加用量 URL 同样需过检查。来源头及目的地逻辑能够限制代表路径，仍需排除部署绕行，尤其是使用自定义 URL 和真实密钥前。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:759-781](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/lib/index.js#L759-L781)

Host、Origin 与异常拒绝。

<details>
<summary>查看原文（23行）</summary>

```text
    function selfRejection(req, opts) {
      try {
        const headers = (req && req.headers) || {}
        let hostUrl = null
        try { hostUrl = new URL('http://' + String(headers.host || '')) } catch (err) { return 403 } // 缺 Host / 畸形 → 拒
        const hostname = hostUrl.hostname
        const authority = hostUrl.host
        if (!isLoopbackHostname(hostname)) {
          const listed = TRUSTED_AUTHORITIES.some((e) => (e.indexOf(':') >= 0 ? e === authority.toLowerCase() : e === hostname.toLowerCase()))
          const fenceAvailable = !!(opts && opts.fenceAvailable)
          if (!listed && !fenceAvailable) return 403
        }
        // 下面两条与"信任列表"无关，任何情况下都执行：跨站标记、Origin 与 Host 不同源。
        const site = String(headers['sec-fetch-site'] || '').toLowerCase()
        if (site === 'cross-site') return 403
        const origin = headers.origin
        if (typeof origin === 'string' && origin && origin !== 'null') {
          let originUrl = null
          try { originUrl = new URL(origin) } catch (err) { return 403 }
          if (originUrl.host.toLowerCase() !== authority.toLowerCase()) return 403
        }
        return null
      } catch (err) { return 403 } // 校验器自身出错 → 拒绝（fail-closed）
```

</details>

**依据 2 · 源码核查**：[lib/index.js:796-853](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/lib/index.js#L796-L853)

写门禁、可用宿主栅栏及异常。

<details>
<summary>查看原文（58行）</summary>

```text
    // v761（安全修复 S1）：**写请求（POST/PUT/PATCH/DELETE）必须来自本机（回环）**。
    // 为什么：任意持有 DSH Web 会话的人都能 `POST /dsh-whale/api-models.json` 写一个自定义模型，
    // 而余额 / 探活 / 额度会**带着解析出来的真实凭据**去请求模型里那个 URL ⇒ 凭据外带。
    // 「改配置」等于「决定把凭据发往哪里」，所以它必须与"坐在这台机器前"绑定；
    // **只读接口不受影响**（局域网里仍能正常看挂件）。
    // 运维若确实需要远端管理，显式声明 DSHW_ADMIN_HOSTS（逗号分隔，可带端口），默认为空。
    const ADMIN_AUTHORITIES = String(process.env.DSHW_ADMIN_HOSTS || '')
      .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
    const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])
    function writeRejection(req) {
      try {
        const method = String((req && req.method) || 'GET').toUpperCase()
        if (!WRITE_METHODS.has(method)) return null
        const headers = (req && req.headers) || {}
        let hostUrl = null
        try { hostUrl = new URL('http://' + String(headers.host || '')) } catch (err) { return 403 }
        if (isLoopbackHostname(hostUrl.hostname)) return null
        const authority = hostUrl.host.toLowerCase()
        const hostname = hostUrl.hostname.toLowerCase()
        if (ADMIN_AUTHORITIES.some((e) => (e.indexOf(':') >= 0 ? e === authority : e === hostname))) return null
        if (!writeRejection.warned) {
          writeRejection.warned = true
          try {
            console.warn('[whale-balance] 已拒绝一个来自非本机的**写请求**（Host=' + authority + '）。'
              + '自 0.3.15 起，配置与凭据的改动只能在**本机**（回环地址）打开界面进行 —— '
              + '否则任何拿到 Web 会话的人都能把凭据改指向自己的服务器，从而把真实 API key 带走。'
              + '确需远端管理，请用环境变量 DSHW_ADMIN_HOSTS 声明允许的管理主机。')
          } catch (err) {}
        }
        return 403
      } catch (err) { return 403 } // 自身出错 → 拒绝（fail-closed）
    }
    function rejected(req, res) {
      const deny = (code) => {
        try { res.statusCode = code || 403; res.end() } catch (err) {}
        return true
      }
      const conn = connectionFence()
      // 先算栅栏可用性，再自校验：非回环 Host 在"栅栏可用"时交给栅栏判（它知道 --trusted-host）
      const self = selfRejection(req, { fenceAvailable: !!conn })
      if (self !== null) return deny(self)
      // v761（安全修复 S1）：写完再放行 —— 读请求不受影响
      const write = writeRejection(req)
      if (write !== null) return deny(write)
      if (!conn) return false // 已通过自校验；此刻没有宿主栅栏可委托（加载时已 warn）
      let code
      try {
        code = conn.requestRejection(req)
      } catch (err) {
        // 旧实现这里是 `return false`：栅栏自己抛异常被当成"没被拒"而静默放行（#136 的第二条路径）
        if (!rejected.warned) {
          rejected.warned = true
          try { console.warn('[whale-balance] 信任栅栏抛异常，已按拒绝处理：' + String((err && err.message) || err)) } catch (e2) {}
        }
        return deny(403)
      }
      if (code === undefined || code === null || code === false) return false
      return deny(typeof code === 'number' ? code : 403)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:856-864](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/lib/index.js#L856-L864)

路由统一门禁。

```text
    function registerRoute(route) {
      const inner = route && route.handler
      const wrapped = Object.assign({}, route, {
        handler: async (req, res) => {
          if (rejected(req, res)) return
          return inner(req, res)
        },
      })
      return ctx.webServer.register(wrapped)
```

**依据 4 · 源码核查**：[lib/index.js:642-649](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/lib/index.js#L642-L649)

JSON 同源响应。

```text
// 挂件与这些端点同源，不需要 CORS。曾经的 Access-Control-Allow-Origin: * 让任意网页
// 都能读到余额/今日已用，还能跨站 PUT 改配置（信任栅栏之外的又一层收紧），这里去掉。
const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
}

// 挂件缩放与音量的合法区间（与前端 MIN_SCALE / MAX_SCALE 一致）。size.json 是本机
```

**依据 5 · 源码核查**：[lib/index.js:2399-2427](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/lib/index.js#L2399-L2427)

自定义余额和额外用量凭据目的地检查。

<details>
<summary>查看原文（29行）</summary>

```text
      }
      const tpl = apiTemplateOf(model.provider) || {}
      const b = mergeNonEmpty(tpl.balance, model.balance) // v724：模型侧空串不再覆盖模板
      if (!b.url) return { ok: false, code: 'NO_URL', error: '未配置余额接口地址' }
      const base = String(model.baseUrl || '').replace(/\/+$/, '')
      const url = String(b.url).replace('{base}', base)
      // v761（安全修复 S1）：凭据只在目的地可信（厂商内置端点 / 本机确认过的自定义地址）时才带上
      const k = await keyForDestination(model, tpl, url)
      if (!k.key) return { ok: false, code: k.code, error: k.error }
      const key = k.key
      try {
        // v789（issue #190）：把 method / body / params 一并交给取数层（默认 GET，与以前完全一致）
        const data = await apiFetchJson(url, b.auth, key, { method: b.method, body: b.body, base: base, params: model.params })
        const j = b.json || {}
        let remaining = null
        let total = null
        let used = 0
        if (j.remaining) { const v = apiNum(pickJsonPath(data, j.remaining), j.scale); if (v !== null) remaining = v }
        if (j.total) { const v = apiNum(pickJsonPath(data, j.total), j.scale); if (v !== null) total = v }
        if (j.used) { const v = apiNum(pickJsonPath(data, j.used), j.scale); if (v !== null) used += v }
        if (b.usage && b.usage.url) {
          const u = b.usage
          // v761（安全修复 S1）：usage 是可选增强 —— 目的地不可信就跳过，绝不把凭据发出去
          const usageUrl = String(u.url).replace('{base}', base)
          if (credentialMayGoTo(model, tpl, usageUrl)) {
          const d2 = await apiFetchJson(usageUrl, u.auth || b.auth, key)
          const j2 = u.json || {}
          if (j2.used) { const v = apiNum(pickJsonPath(d2, j2.used), j2.scale); if (v !== null) used += v }
          } else { warnCredDestinationOnce(usageUrl) }
```

</details>

#### 缺口

- 反向代理改写 Host 与自定义目的地的部署组合未验。
  **影响**：不能推断公开访问安全。
  **进一步探讨**：在隔离宿主使用假密钥，验证异源写入拒绝及不可信目的地未收到凭据。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何判断日常查看值不值得采用？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

建议观察。已有本机 DSH 的 DeepSeek 用户可在隔离 profile 只验证官方余额和单一账户。先核账户、时间、币种与供应商账单，再决定是否打开角色或音效。首轮需配置兼容宿主和凭据，常驻轮询消耗网络，持续需核缓存和异常，换肤和声音还可能干扰对话。发现余额来源不明、账本不一致或与上游冲突时停用，回供应商账单。可测试的改进是在显示区强调最后成功采集、可见时间段和余额调整，比较现有显示与该方案的误读率和核对时间。若误读并未减少，回到只显示余额并人工查明细。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:2920-2969](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/lib/index.js#L2920-L2969)

当前余额和失败标记。

<details>
<summary>查看原文（50行）</summary>

```text
    function publicBalance(payload) {
      const { accountTag, ...visible } = payload
      const led = readUsageLedger()
      const summary = daySummary(led, todayKey())
      const nowSec = Math.floor(Date.now() / 1000)
      return {
        ...visible, version: '0.5.0', isPeak: isPeakTime(nowSec),
        // 峰谷切换点与节假日清单：前端倒计时要与宿主同源（否则法定节假日会算错切换点）
        peakNextChangeAt: nextPeakChangeAt(nowSec),
        peakHolidays: HOLIDAY_VALLEY_LIST,
        todayUsage: summary.amount, todayUsageCurrency: summary.currency,
        usageSource: summary.source, usageLabel: summary.label, usageMode: 'ledger',
        accounting: balanceSummary(led, todayKey()),
      }
    }

    function getBalance(force = false) {
      const now = Date.now()
      if (!force && balanceCache && now - balanceCache.at < BALANCE_TTL_MS) {
        return Promise.resolve(publicBalance(balanceCache.payload))
      }
      if (balanceInFlight) return balanceInFlight
      balanceInFlight = fetchBalance()
        .then((payload) => {
          if (payload.ok) {
            // v759（issue #157 报告人踩到）：**"记不了账"不该吞掉已经拿到的余额**。
            // 以前 recordLedgerUsage 抛错会被最外层 .catch 包成「余额服务异常: …」，
            // 界面看起来像"接口没通"，其实余额已经拿到了（accountTag/币种不合法就会这样）。
            // 但要与"**账本整个读不出来**"区分开：那种情况必须保持 fail-closed（见下面的 rethrow）——
            // 一边是"余额拿到了、只是没记上账"，一边是"账本已经坏了、连今日已用都算不出来"，
            // 后者若也回 ok:true，用户会以为一切正常，而账本其实不可用。
            let ledgerError = ''
            try {
              recordLedgerUsage(payload.totalBalance, payload.currency, payload.accountTag, Date.parse(payload.updatedAt))
            } catch (err) {
              ledgerError = String((err && err.message) || err).slice(0, 160)
            }
            let visible
            try {
              visible = publicBalance(payload) // 读账本算今日已用/近 7 天
            } catch (err) {
              throw err // 账本读不出来（结构损坏等）→ 交给最外层 .catch，报 ok:false 并保留原记录
            }
            balanceCache = { at: Date.now(), payload } // 先缓存：之后即使记账失败，余额也继续显示
            return ledgerError ? { ...visible, ledgerError } : visible
          }
          if (payload.transient && balanceCache) {
            return { ...publicBalance(balanceCache.payload), stale: true, error: payload.error }
          }
          return publicBalance(payload)
```

</details>

**依据 2 · 源码核查**：[lib/accounting.mjs:123-141](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/lib/accounting.mjs#L123-L141)

当前已展示的观测时间及调整提示。

<details>
<summary>查看原文（19行）</summary>

```text
export function balanceSummary(ledger, day = beijingDay()) {
  const book = currentBook(ledger)
  const row = book && book.days && book.days[day]
  if (!row) return null
  const correction = row.correction
  const needsReview = row.creditUnits > (correction ? correction.creditUnits : 0)
  const source = needsReview ? 'balance-needs-review' : correction ? 'balance-corrected' : 'balance-observed'
  return {
    day, amount: preciseMoney(observedAmount(row)), currency: book.currency, source,
    label: needsReview ? '已观测消费 · 待核对余额调整' : correction ? '已校正消费' : '已观测消费',
    firstObservedAt: row.firstAt, lastObservedAt: row.lastAt,
    openingBalance: row.openingUnits / SCALE, currentBalance: row.lastUnits / SCALE,
    observedDecrease: row.debitUnits / SCALE, observedIncrease: row.creditUnits / SCALE,
    needsReview, revision: revisionOf(ledger, row),
    ...partialDayInfo(day, row),
    credits: correction ? correction.creditsUnits / SCALE : null,
    otherDebits: correction ? correction.otherDebitsUnits / SCALE : null,
    correctedAt: correction ? correction.at : null,
  }
```

</details>

**依据 3 · 作者声明**：[CHANGELOG.md:13-15](https://github.com/Witherwithwinter/DeepSeek-Balance-Whale-Widget-Bowl/blob/2154a5deb30039f9f5825677b653a825975fcee2/CHANGELOG.md#L13-L15)

作者说明验证类型及上游冲突。

```text
- **说明**：上游 v0.3.1 起的账本原子写（`lib/index.js` 的临时文件 + rename）与「余额缓存按写入时刻计 TTL」本版本**直接沿上游实现**，不再保留本仓库旧写法；跨天首次观测的记账口径由上游 `lib/accounting.mjs` 重设计覆盖
- **工程**：`npm test` 从「纯函数自检」扩成两层 —— `test/helpers.test.mjs`（纯函数 + **fork 不变量**：内置角色、钢管音效、桌面端注入行、包名 / patch id / 版本三处一致性）与 `test/host-smoke.test.mjs`（假宿主把 `lib/index.js` 真跑起来逐条打增量路由，不碰真实 `$DSH_HOME`）；专门防「跟随上游时增量悄悄丢失」。同时引入上游的 0 依赖维护脚本与 CI（`tools/ci-audit.mjs` 等，包名断言已改为本仓库，并把 `npm test` 加进 `ci.yml`）
- **变更**：版本号 0.5.0（本仓库自己的版本线，包内 `version` 字段同步）；路由前缀仍与上游一致（`/dsh-whale/`），**与原版不可共存**于同一 profile
```

#### 缺口

- 没有查账错误率、日常核对耗时和宿主实测。
  **影响**：只适合观察可读性和口径。
  **进一步探讨**：对照余额挂件与供应商页面，以同一账户的充值及消费做查账任务。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
