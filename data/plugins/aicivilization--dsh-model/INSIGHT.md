# dsh-model

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[65a7316](https://github.com/AIcivilization/dsh-model/tree/65a73164fbabace070c16a3bccc1d13be1805661)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AIcivilization/dsh-model) [![npm 30d 6,858](https://img.shields.io/static/v1?label=npm+30d&message=6%2C858&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model)
<!-- END META -->

> **功能**：为 DSH 与兼容客户端统一接入模型来源、免费额度池、自动签到和组合回退。

> **亮点**：统一地址和设置控制面之外，免费池按来源周期、模型档位与冷却计算候选。相对逐个选择，配置和选择逻辑可集中处理。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：免费标签依赖目录和本地配置，显式 token 限额基于事后用量。回退可能把同一输入发往多个上游，流断开后也不会重做响应。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 设置页是独立网关还是对守护进程的控制入口？](#detail-section-11)
  - [Q02 · 免费池怎样选来源，token 上限能否作为零费用保证？](#detail-section-12)
  - [Q03 · 何时会重放同一请求给其他模型，何时返回截断内容？](#detail-section-13)
  - [Q04 · 如何验证预算预留和可见的来源范围是否让试用可控？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常手动切换多个模型账号或临时额度的 DSH 用户，可以用本机网关集中配置来源。

直接固定一个模型来源，或分别维护账号并手动选择。使用供应商自己的账单和费用上限。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 本地控制代理 | 管理已连接来源 | 宿主鉴权和本地守护需可用 |
| 免费池 | 按周期和冷却选择候选 | 标签与 token 记录不等于账单保证 |
| 模型组合 | 上游失败时换候选 | 可能增加外发和调用费用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 服务与设置槽位 | 设置入口必需 | 注册控制接口和页面 | 回到 CLI 或原配置 |
| 本地网关与守护 | 模型转发必需 | 执行模型组合 | 未配或不可达时报 503 |
| 上游密钥及经核实限额 | 试用条件 | 调用模型并控制费用 | 停用来源 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户先隔离配置并选一个来源 | 确认授权和供应商限额 |
| 调用 | 用户发送非敏感短任务 | 核对模型头、响应完整性和账单 |
| 排障 | 用户比较 503、额度错误和截断 | 恢复单上游并撤销试用凭据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 守护进程与本地运行资源未测 | 核对来源、密钥和预算 | 免费标签不保证无账单 |
| 持续 | 回退可能重复调用和收费 | 核账与核对出站范围 | 单位成功任务开销未测 |
| 退出 | 已有请求的花费不会撤销 | 切回原配置并撤销密钥 | 核对守护进程状态 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 配置集中 | 设置区和本地控制代理 | 真实 profile 兼容性 |
| 额度池路由 | 周期排序和来源冷却 | 费用、可用性和服务条款 |
| 失败诊断 | 可观察实际响应模型 | 截断会否被误读为成功 |

> **思考**：免费标签依赖目录和本地配置，显式 token 限额基于事后用量。回退可能把同一输入发往多个上游，流断开后也不会重做响应。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：统一地址和设置控制面之外，免费池按来源周期、模型档位与冷却计算候选。相对逐个选择，配置和选择逻辑可集中处理。[Q01](#research-q01) [Q02](#research-q02)

控制面将本地密钥与页面令牌分开，组合执行复用普通与额度池。费用控制需要独立的账单和出站验证。[Q01](#research-q01) [Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

免费标签依赖目录和本地配置，显式 token 限额基于事后用量。回退可能把同一输入发往多个上游，流断开后也不会重做响应。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

从单个低风险来源做隔离试用。确认模型头、流完成和供应商账单之后，再考虑启用回退；任何一项不清楚就切回原地址。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持设置接线、候选筛选和回退边界。供应商实际费用、账号条件与宿主兼容性待验证。

- 已检查：作者 README、包清单、源码路径 package.json、plugin/cordis.patch.yml、plugin/index.js、plugin/client.js、README.md、src/free/pool.ts、src/free/service.ts、src/combo.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读设置、Host 代理、组合和免费池主要路径。未执行插件安装、上游调用、签到、真实结算或平台部署。
- 下一步：在隔离宿主与模拟上游复现额度失败、并发超限、缺用量和断流，观察分支及回执。

**分析版本**

- **仓库**：[AIcivilization/dsh-model](https://github.com/AIcivilization/dsh-model)
- **版本号**：0.30.0（[固定提交 65a7316](https://github.com/AIcivilization/dsh-model/tree/65a73164fbabace070c16a3bccc1d13be1805661)）
- **版本日期**：2026-11-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

预留可计费请求的预算，并把允许外发的来源和流完整性写进回执，可能降低高并发时的超额与误收。[Q04](#research-q04)

在隔离宿主与模拟上游复现额度失败、并发超限、缺用量和断流，观察分支及回执。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 13 | 4318 | 3605 | 499 | — |
| .md | source | 6 | 1409 | — | — | 25193 |
| .mjs | source | 3 | 209 | 163 | 27 | — |
| .ts | source | 98 | 16393 | 12440 | 2856 | — |
| .ts | test | 39 | 3632 | 3264 | 147 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/AIcivilization/dsh-model/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/AIcivilization/dsh-model/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AIcivilization/dsh-model/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：希望减少多个模型账号与额度切换负担的 DSH 用户，能否借助固定版本的免费池获得可预测的费用、数据去向和交付？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 设置页是独立网关还是对守护进程的控制入口？

**研究主题**：场景与需求、依赖、兼容与流程、功能与机制

#### 完整回答

对频繁切换多个上游的用户，原来要分别配置地址、模型和密钥。该包在 DSH 设置提供统一控制入口，经 POST JSON、Origin 与页面 token 检查，白名单控制方法转发到回环地址的守护进程。控制密钥从本地 bridge.json 读，代理返回守护进程状态；无文件或不可达返回 503。缺 Origin 时检查允许继续，仍需 token，获取 token 的路由依赖宿主访问控制。初次启用默认在宿主启动后三秒尝试后台 setup，有环境变量、VPS、已配置和卸载标记四种跳过条件。启动与连接失败可直接恢复使用原先的上游配置。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/client.js:1573-1585](https://github.com/AIcivilization/dsh-model/blob/65a73164fbabace070c16a3bccc1d13be1805661/plugin/client.js#L1573-L1585)

设置分区与提示由宿主槽位装配。

<details>
<summary>查看原文（13行）</summary>

```text
    const name = 'dsh-model'
    // 用到的服务必须先声明，否则 ctx.slots 读不到（实测：cannot get property "slots" without inject）
    const inject = ['slots']
    function apply(ctx) {
      try {
        ctx.slots.inject('settings.section', () =>
          ctx.slots.register({ name: 'settings.section', id: 'dsh-model', order: 25, label: () => 'dsh-model' }, SettingsSection))
      } catch (error) {
        console.warn('[dsh-model] 设置页注册失败', error)
      }
      // 额度提醒挂在整个窗口的浮层上（不只设置页）；注册失败不影响别的
      try {
        ctx.slots.inject('shell.overlay', () => ctx.slots.register({ name: 'shell.overlay', id: 'dsh-model-quota' }, QuotaNotice))
```

</details>

**依据 2 · 源码核查**：[plugin/index.js:99-107](https://github.com/AIcivilization/dsh-model/blob/65a73164fbabace070c16a3bccc1d13be1805661/plugin/index.js#L99-L107)

没有 Origin 时返回真，存在 Origin 时比较 host。

```text
function sameOrigin(req) {
  const origin = req.headers?.origin
  if (!origin) return true
  try {
    return new URL(origin).host === req.headers.host
  } catch {
    return false
  }
}
```

**依据 3 · 源码核查**：[plugin/index.js:132-137](https://github.com/AIcivilization/dsh-model/blob/65a73164fbabace070c16a3bccc1d13be1805661/plugin/index.js#L132-L137)

控制调用检查 POST、JSON、来源和 token。

```text
function check(req, token, needToken = true) {
  if (req.method !== 'POST') return { code: 405, error: 'POST only' }
  if (!String(req.headers['content-type'] ?? '').includes('application/json')) return { code: 415, error: 'application/json only' }
  if (!sameOrigin(req)) return { code: 403, error: 'cross-site request refused' }
  if (needToken && String(req.headers[TOKEN_HEADER] ?? '') !== token) return { code: 403, error: 'wrong token' }
  return null
```

**依据 4 · 源码核查**：[plugin/index.js:175-238](https://github.com/AIcivilization/dsh-model/blob/65a73164fbabace070c16a3bccc1d13be1805661/plugin/index.js#L175-L238)

后台安装条件以及白名单代理、配置与连通错误。

<details>
<summary>查看原文（64行）</summary>

```text
/** 要不要后台自动装：要就返回 null，不要就返回原因。导出给测试 */
export async function autoSetupSkipReason() {
  if (process.env.DSH_MODEL_NO_AUTO_SETUP) return 'disabled'
  if (await exists(VPS_ROOT)) return 'vps'
  if (await exists(join(home(), 'bridge.json'))) return 'configured'
  if (await exists(uninstalledMarker())) return 'uninstalled'
  return null
}

async function autoSetup() {
  if (autoSetupTried) return
  autoSetupTried = true
  if (await autoSetupSkipReason()) return
  const lang = /^zh/i.test(Intl.DateTimeFormat().resolvedOptions().locale || process.env.LANG || '') ? 'zh' : 'en'
  startCli('setup', ['setup', '--skip-dsh-plugin', '--lang', lang])
}

export function apply(ctx) {
  const token = randomBytes(24).toString('hex')
  // 等 dsh 自己先起来再装
  const autoTimer = setTimeout(() => void autoSetup().catch(() => {}), 3000)
  autoTimer.unref?.()
  ctx.inject(['webServer'], (webCtx) => {
    const ws = webCtx.webServer
    if (!ws || typeof ws.register !== 'function') return
    const disposers = []
    const track = (d) => disposers.push(d)

    track(
      ws.register({
        kind: 'exact',
        path: '/api-dsh-model/call',
        handler: async (req, res) => {
          const bad = check(req, token)
          if (bad) return json(res, bad.code, { error: { code: 'refused', message: bad.error } })
          let call
          try {
            call = JSON.parse((await readBody(req)) || '{}')
          } catch {
            return json(res, 400, { error: { code: 'invalid_json', message: 'invalid JSON' } })
          }
          const method = String(call.method ?? 'GET').toUpperCase()
          const path = String(call.path ?? '')
          if (!ALLOWED.some(([m, re]) => m === method && re.test(path))) {
            return json(res, 403, { error: { code: 'not_allowed', message: `${method} ${path}` } })
          }
          let cfg
          try {
            cfg = await daemonConfig()
          } catch {
            return json(res, 503, { error: { code: 'daemon_not_configured', message: 'dsh-model daemon not configured (run dsh-model setup)' } })
          }
          try {
            const r = await fetch(`http://127.0.0.1:${cfg.port}/control${path}`, {
              method,
              headers: { Authorization: `Bearer ${cfg.secret}`, 'x-dsh-model-lang': call.lang === 'en' ? 'en' : 'zh', ...(call.body !== undefined ? { 'Content-Type': 'application/json' } : {}) },
              body: call.body !== undefined && method !== 'GET' ? JSON.stringify(call.body) : undefined,
              signal: AbortSignal.timeout(90_000),
            })
            const text = await r.text()
            res.writeHead(r.status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
            res.end(text || '{}')
          } catch {
            return json(res, 503, { error: { code: 'daemon_unreachable', message: 'dsh-model daemon is not running (run dsh-model repair)' } })
```

</details>

**依据 5 · 源码核查**：[plugin/index.js:307-326](https://github.com/AIcivilization/dsh-model/blob/65a73164fbabace070c16a3bccc1d13be1805661/plugin/index.js#L307-L326)

取 token 路由使用独立检查并允许在页面注入。

<details>
<summary>查看原文（20行）</summary>

```text
    // 令牌对不上时（dsh 重启、插件热更新）页面悄悄来换：只认同源 JSON，并且先过 dsh 自己的登录
    track(
      ws.register({
        kind: 'exact',
        path: '/api-dsh-model/token',
        handler: (req, res) => {
          const bad = check(req, token, false)
          if (bad) return json(res, bad.code, { error: { code: 'refused', message: bad.error } })
          return json(res, 200, { token })
        },
      }),
    )

    if (typeof webCtx.on === 'function') {
      track(webCtx.on('webserver/index-inject', (table) => {
        if (Array.isArray(table)) table.push({ kind: 'global', name: '__DSH_MODEL_TOKEN__', value: token })
      }))
    }
    if (typeof ws.tapIndex === 'function') {
      track(ws.tapIndex((html) => html.replace('</head>', `<script>window.__DSH_MODEL_TOKEN__=${JSON.stringify(token)}</script></head>`)))
```

</details>

#### 缺口

- 未验收不同 DSH 部署中的宿主登录和反向代理
  **影响**：无法仅凭本插件代码保证所有访问模型的保护边界
  **进一步探讨**：在隔离 profile 对照未登录、无 Origin、错误 Origin 和正确页面四种请求

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 免费池怎样选来源，token 上限能否作为零费用保证？

**研究主题**：贡献与相对优势、效果与总成本、缺陷与关键质疑、工程质量与复用

#### 完整回答

免费池以常用的 free/auto、free/smart、free/fast 暴露统一模型。候选按目录、模型标识和用户配置筛选，周期、到期顺序和模型启发式分决定先试谁，冷却过滤并限制每来源候选数。目录标成会收费的来源需要 opt-in，按已记 token 的 90% 阈值过滤。用户点名加入和自定义自报免费是独立路径，可以被标为不收费，代码并无供应商账单担保。用量来自事后记录，缺记录不增加累计，候选计算没有为并行请求预留额度。失败后的来源冷却作用于后续排序；本次请求的组合已建，仍可能尝试同来源其他候选。该策略可减少手动切换，实际现金、账户条款和到期规则还须逐个核实。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:58-70](https://github.com/AIcivilization/dsh-model/blob/65a73164fbabace070c16a3bccc1d13be1805661/README.md#L58-L70)

作者将快到期额度优先与会收费额度的显式开启作为免费池主张。

<details>
<summary>查看原文（13行）</summary>

```text
## 🆓 免费池：一把 key，用上各家官方的免费额度

魔搭每天的免费次数、Cloudflare 每天的 Neurons、OpenRouter 的 `:free` 模型、智谱 / 星火 / 千帆 / 混元的免费模型、Gemini 和 Groq 的免费档……各家都有，但分散在十几个平台。dsh-model 把它们合成**三个模型**：

| 模型 | 用哪些 |
|---|---|
| `free/auto` | 全部免费模型，强的在前 |
| `free/smart` | 只用大模型 |
| `free/fast` | 只用小而快的 |

- **快过期的先用**：每天重置的 → 每月重置的 → 有截止日的 → 长期免费的 → 本机模型兜底。
- **一家用完自动换**：限流或额度用完的那家冷却到它重置（每天的到北京时间 0 点，每月的到 1 号），换下一家。
- **绝不替你花钱**：新人代金券、「用完转付费」的额度默认**不进**免费池；要放进来，得你设一个 token 上限，用到 90% 自动移出。
```

</details>

**依据 2 · 源码核查**：[src/free/service.ts:48-61](https://github.com/AIcivilization/dsh-model/blob/65a73164fbabace070c16a3bccc1d13be1805661/src/free/service.ts#L48-L61)

有候选才注册档位，端点指向本地组合服务。

<details>
<summary>查看原文（14行）</summary>

```text
/** 引擎里的 free/<档>：有成员的档才登记 */
export function freeUpstream(candidates: Member[], bridge: { port: number; secret: string }): CompatUpstream | null {
  const models = TIERS.filter((t) => poolOrder(candidates, t, { cooldown: {} }).length > 0).map((t) => ({
    name: `${FREE_PREFIX}:${t}`,
    alias: `${FREE_PREFIX}/${t}`,
    displayName: L(...TIER_LABEL[t]),
    dshName: L(...TIER_LABEL[t]),
    rate: 0,
    group: FREE_PREFIX,
    groupLabel: L('免费池', 'Free pool'),
  }))
  if (!models.length) return null
  return { name: FREE_PREFIX, label: L('免费池', 'Free pool'), baseUrl: `http://127.0.0.1:${bridge.port}/combo/v1`, apiKey: bridge.secret, direct: true, models }
}
```

</details>

**依据 3 · 源码核查**：[src/free/pool.ts:117-175](https://github.com/AIcivilization/dsh-model/blob/65a73164fbabace070c16a3bccc1d13be1805661/src/free/pool.ts#L117-L175)

筛选、手动例外、排序、冷却与每来源限制。

<details>
<summary>查看原文（59行）</summary>

```text
export function poolCandidates(sources: PoolSource[], entries: CatalogEntry[], cfg: PoolConfig, state: Pick<PoolState, 'used'>): Member[] {
  const exclude = new Set(cfg.exclude ?? [])
  const include = new Set(cfg.include ?? [])
  const out: Member[] = []
  for (const src of sources) {
    const mine = entries.filter((e) => e.kind === 'api' && e.source === src.id)
    const opt = cfg.optIn?.[src.id]
    const capped = opt ? (state.used[src.id] ?? 0) >= opt.capTokens * CAP_RATIO : true
    for (const m of src.models) {
      if (NON_CHAT.test(m.id)) continue
      const alias = `${src.id}/${m.id}`
      if (exclude.has(alias)) continue
      const base = { alias, source: src.id, model: m.id, score: strength(m.id), fast: isFast(m.id) }
      if (src.local) {
        out.push({ ...base, cycle: 'local', charges: false })
        continue
      }
      if (src.custom) {
        out.push({ ...base, cycle: src.custom.cycle, ...(src.custom.until ? { until: src.custom.until } : {}), charges: false })
        continue
      }
      // 不花钱的额度优先；没有再看用户打开了的会扣钱的额度
      const freeHit = mine.find((e) => !e.charges && entryMatches(e, m.id, Boolean(m.free)))
      const paidHit = !freeHit && opt && !capped ? mine.find((e) => e.charges && entryMatches(e, m.id, Boolean(m.free))) : undefined
      const hit = freeHit ?? paidHit
      if (hit) {
        out.push({ ...base, cycle: hit.cycle, ...(hit.until ? { until: hit.until } : {}), charges: hit.charges, entryId: hit.id })
        continue
      }
      // 目录里没这家：只认模型目录标了免费的，当长期免费
      if (!mine.length && m.free) {
        out.push({ ...base, cycle: 'forever', charges: false })
        continue
      }
      // 用户点名加进来的（自己选的，不管收不收费）
      if (include.has(alias)) out.push({ ...base, cycle: 'forever', charges: false })
    }
  }
  return out.sort((a, b) => cycleRank(a) - cycleRank(b) || (a.until ?? '').localeCompare(b.until ?? '') || b.score - a.score || a.alias.localeCompare(b.alias))
}

/** 某个档现在该按什么顺序试（去掉冷却中的、每家最多 PER_SOURCE 个） */
export function poolOrder(candidates: Member[], tier: Tier, state: Pick<PoolState, 'cooldown'>, now = Date.now()): Member[] {
  const perSource = new Map<string, number>()
  const out: Member[] = []
  // 每家先按强弱挑出最好的几个，再放回整体顺序里
  const pool = candidates.filter((m) => (tier === 'auto' ? true : tier === 'fast' ? m.fast : !m.fast))
  const best = new Set<string>()
  const bySource = new Map<string, Member[]>()
  for (const m of pool) bySource.set(m.source, [...(bySource.get(m.source) ?? []), m])
  for (const list of bySource.values()) for (const m of [...list].sort((a, b) => b.score - a.score).slice(0, PER_SOURCE)) best.add(m.alias)
  for (const m of pool) {
    if (!best.has(m.alias)) continue
    const until = state.cooldown[m.source]
    if (until && Date.parse(until) > now) continue
    const n = perSource.get(m.source) ?? 0
    if (n >= PER_SOURCE) continue
    perSource.set(m.source, n + 1)
    out.push(m)
```

</details>

**依据 4 · 源码核查**：[src/free/service.ts:131-175](https://github.com/AIcivilization/dsh-model/blob/65a73164fbabace070c16a3bccc1d13be1805661/src/free/service.ts#L131-L175)

运行固定组合、冷却以及事后累计 opt-in 来源 token。

<details>
<summary>查看原文（45行）</summary>

```text
  /** 引擎转来的 free:<档> 请求 */
  async run(tier: Tier, inp: Pick<PoolInputs, 'config' | 'upstreams' | 'secrets'>, req: { port: number; key: string; raw: string; res: ServerResponse; signal: AbortSignal; log?: (m: string) => void }): Promise<void> {
    const state = await this.loadState()
    const order = poolOrder(await this.candidates(inp), tier, state)
    if (!order.length) {
      const body = JSON.stringify({ error: { message: L('免费池现在没有可用的模型：可能都在冷却（额度用完会等到重置时间），或还没接入免费来源。在 dsh-model 设置页的「免费额度」里看详情', 'The free pool has no model available now: they may all be cooling down (until their quota resets), or no free source is connected yet. See "Free quota" in the dsh-model settings page'), type: 'free_pool_empty', code: 'free_pool_empty' } })
      req.res.writeHead(503, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) })
      req.res.end(body)
      return
    }
    const byAlias = new Map(order.map((m) => [m.alias, m]))
    await runCombo({
      port: req.port,
      key: req.key,
      combo: { id: `${FREE_PREFIX}:${tier}`, name: L(...TIER_LABEL[tier]), models: order.map((m) => m.alias) },
      raw: req.raw,
      res: req.res,
      signal: req.signal,
      ...(req.log ? { log: req.log } : {}),
      onFailure: (alias, status, text) => {
        const m = byAlias.get(alias)
        if (!m || !isQuotaFailure(status, text)) return
        state.cooldown[m.source] = cooldownUntil(m.cycle).toISOString()
        req.log?.(`free pool: ${m.source} cooling until ${state.cooldown[m.source]} (HTTP ${status})`)
        void this.persist()
      },
    })
  }

  /** 引擎用量记录：给用户打开了的 charges 来源记 token */
  async recordUsage(batch: { alias?: string; model?: string; tokens?: Record<string, unknown>; failed?: boolean }[], optIn: PoolConfig['optIn']): Promise<void> {
    if (!optIn || !Object.keys(optIn).length) return
    const state = await this.loadState()
    let changed = false
    for (const r of batch) {
      const name = r.alias || r.model || ''
      const source = name.split('/')[0] ?? ''
      if (!optIn[source]) continue
      const t = r.tokens ?? {}
      const n = (Number(t.input_tokens) || 0) + (Number(t.output_tokens) || 0) + (Number(t.reasoning_tokens) || 0)
      if (n <= 0) continue
      state.used[source] = (state.used[source] ?? 0) + n
      changed = true
    }
    if (changed) await this.persist()
```

</details>

#### 缺口

- 目录标签与供应商账户实际账单未经对账
  **影响**：不能推出零费用或严格 token 上限
  **进一步探讨**：仅用已核对的可撤销账号做并发、无 usage 和账户额度变动对照

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 何时会重放同一请求给其他模型，何时返回截断内容？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

组合将同一请求体换上各候选的 model，向本地引擎逐个发送。网络失败或多数非 400/422 错误允许进入下一成员，部分 400/422 仍按错误文本重试，意味着同一提示可能被转发给多个上游。遇到成功状态和响应体即写状态码及实际模型响应头，流随后断开只记录并结束响应，不在已经发送的流上自动切换。客户端需要独立识别流完整性和核验实际响应模型。

#### 证据与依据

**依据 1 · 源码核查**：[src/combo.ts:52-55](https://github.com/AIcivilization/dsh-model/blob/65a73164fbabace070c16a3bccc1d13be1805661/src/combo.ts#L52-L55)

除 400/422 外大多错误允许回退，400/422 另按文本分类。

```text
export function shouldFallBack(status: number, text: string): boolean {
  if (status !== 400 && status !== 422) return true
  if (BLOCKED_RE.test(text)) return true
  return /quota|rate|limit|credit|context|too long|too many tokens|maximum|exceed|overload|unavailable|not supported|unsupported/i.test(text)
```

**依据 2 · 源码核查**：[src/combo.ts:82-119](https://github.com/AIcivilization/dsh-model/blob/65a73164fbabace070c16a3bccc1d13be1805661/src/combo.ts#L82-L119)

串行换模型、转发并写实际模型头，流错误只记录和结束。

<details>
<summary>查看原文（38行）</summary>

```text
  let last: { status: number; text: string } | undefined
  for (const model of combo.models) {
    if (run.signal.aborted) return
    let upstream: Response
    try {
      upstream = await fetch(`http://127.0.0.1:${run.port}/v1/chat/completions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${run.key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, model }),
        signal: run.signal,
      })
    } catch (error) {
      if (run.signal.aborted) return
      last = { status: 502, text: String((error as Error).message ?? error) }
      tried.push(`${model}: ${last.text.slice(0, 120)}`)
      run.onFailure?.(model, last.status, last.text)
      continue
    }
    if (upstream.ok && upstream.body) {
      if (tried.length) log(`combo ${combo.id}: ${model} answered after ${tried.length} failed (${tried.join(' | ')})`)
      res.writeHead(upstream.status, {
        'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
        'Cache-Control': 'no-cache',
        'X-Dsh-Model-Combo-Model': model,
      })
      const stream = Readable.fromWeb(upstream.body as Parameters<typeof Readable.fromWeb>[0])
      stream.on('error', (error: unknown) => {
        log(`combo ${combo.id}: ${model} stream failed mid-flight: ${String(error)}`)
        if (res.writable) res.end()
      })
      stream.pipe(res)
      return
    }
    const text = await upstream.text().catch(() => '')
    last = { status: upstream.status, text }
    tried.push(`${model}: HTTP ${upstream.status}`)
    run.onFailure?.(model, upstream.status, text)
    if (!shouldFallBack(upstream.status, text)) break
```

</details>

#### 缺口

- 未运行上游网关和客户端流完整性检查
  **影响**：不知道各客户端会否误收截断内容
  **进一步探讨**：用模拟上游覆盖 429、400、成功头后断流并观察客户端状态

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证预算预留和可见的来源范围是否让试用可控？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先关闭自动安装并采用独立配置目录，从一个已在供应商侧设置限额的可信上游做非敏感短请求，逐步启用另一个来源并对照响应模型与账单。观察到费用归属、隐私或流完整性无法确认时，停用组合，撤销测试密钥并回到固定单上游。可以试验在发送前为允许付费成员预留预算和记录允许出站来源，同时在响应回执区分预算拒绝、供应商失败和流截断。如果峰值并发的超额与重复外发没有下降，或大量正常请求被误拦，则不采用该策略。

#### 证据与依据

**依据 1 · 源码核查**：[src/free/service.ts:161-175](https://github.com/AIcivilization/dsh-model/blob/65a73164fbabace070c16a3bccc1d13be1805661/src/free/service.ts#L161-L175)

当前事后累计构成预算预留方案的对照。

<details>
<summary>查看原文（15行）</summary>

```text
  async recordUsage(batch: { alias?: string; model?: string; tokens?: Record<string, unknown>; failed?: boolean }[], optIn: PoolConfig['optIn']): Promise<void> {
    if (!optIn || !Object.keys(optIn).length) return
    const state = await this.loadState()
    let changed = false
    for (const r of batch) {
      const name = r.alias || r.model || ''
      const source = name.split('/')[0] ?? ''
      if (!optIn[source]) continue
      const t = r.tokens ?? {}
      const n = (Number(t.input_tokens) || 0) + (Number(t.output_tokens) || 0) + (Number(t.reasoning_tokens) || 0)
      if (n <= 0) continue
      state.used[source] = (state.used[source] ?? 0) + n
      changed = true
    }
    if (changed) await this.persist()
```

</details>

**依据 2 · 源码核查**：[src/combo.ts:83-113](https://github.com/AIcivilization/dsh-model/blob/65a73164fbabace070c16a3bccc1d13be1805661/src/combo.ts#L83-L113)

出站顺序与实际模型头可观察，流错误单独处理。

<details>
<summary>查看原文（31行）</summary>

```text
  for (const model of combo.models) {
    if (run.signal.aborted) return
    let upstream: Response
    try {
      upstream = await fetch(`http://127.0.0.1:${run.port}/v1/chat/completions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${run.key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, model }),
        signal: run.signal,
      })
    } catch (error) {
      if (run.signal.aborted) return
      last = { status: 502, text: String((error as Error).message ?? error) }
      tried.push(`${model}: ${last.text.slice(0, 120)}`)
      run.onFailure?.(model, last.status, last.text)
      continue
    }
    if (upstream.ok && upstream.body) {
      if (tried.length) log(`combo ${combo.id}: ${model} answered after ${tried.length} failed (${tried.join(' | ')})`)
      res.writeHead(upstream.status, {
        'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
        'Cache-Control': 'no-cache',
        'X-Dsh-Model-Combo-Model': model,
      })
      const stream = Readable.fromWeb(upstream.body as Parameters<typeof Readable.fromWeb>[0])
      stream.on('error', (error: unknown) => {
        log(`combo ${combo.id}: ${model} stream failed mid-flight: ${String(error)}`)
        if (res.writable) res.end()
      })
      stream.pipe(res)
      return
```

</details>

**依据 3 · 源码核查**：[plugin/index.js:175-189](https://github.com/AIcivilization/dsh-model/blob/65a73164fbabace070c16a3bccc1d13be1805661/plugin/index.js#L175-L189)

环境变量允许绕过后台自动部署。

<details>
<summary>查看原文（15行）</summary>

```text
/** 要不要后台自动装：要就返回 null，不要就返回原因。导出给测试 */
export async function autoSetupSkipReason() {
  if (process.env.DSH_MODEL_NO_AUTO_SETUP) return 'disabled'
  if (await exists(VPS_ROOT)) return 'vps'
  if (await exists(join(home(), 'bridge.json'))) return 'configured'
  if (await exists(uninstalledMarker())) return 'uninstalled'
  return null
}

async function autoSetup() {
  if (autoSetupTried) return
  autoSetupTried = true
  if (await autoSetupSkipReason()) return
  const lang = /^zh/i.test(Intl.DateTimeFormat().resolvedOptions().locale || process.env.LANG || '') ? 'zh' : 'en'
  startCli('setup', ['setup', '--skip-dsh-plugin', '--lang', lang])
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
