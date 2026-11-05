# DeepSeek Harness Control Center

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[1ec74d2](https://github.com/feibi-mochi/deepseek-harness-control-center/tree/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657)

<!-- BEGIN META -->
[![GitHub ★ 78](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=78&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/feibi-mochi/deepseek-harness-control-center) [![npm 30d 1,819](https://img.shields.io/static/v1?label=npm+30d&message=1%2C819&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepseek-harness-wallet) [![最新发布 2026-09-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepseek-harness-wallet)
<!-- END META -->

> **功能**：在DSH显示余额、用量估算和本地账本，并管理加密账户与宿主凭据切换。

> **亮点**：[Q01](#research-q01) 将usage身份、价格快照和会话视图接起来；[Q02](#research-q02) 热切换跨入宿主凭据。

> **主要限制**：[Q02](#research-q02) 列表删除不撤销宿主key，持久化与凭据不是原子事务；[Q03](#research-q03) 共享部署访问边界依赖宿主。

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
  - [Q01 · 余额、用量与价格怎样变成同一界面？](#detail-section-11)
  - [Q02 · 加密账户和热切换能否被视为事务？](#detail-section-12)
  - [Q03 · 接入、联网、权限和退出有哪些具体条件？](#detail-section-13)
  - [Q04 · 怎样证伪“本地估算足够核账”的主张？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在DSH查看多路由用量并核对余额的个人用户。

分别看官方余额页、手工记录token和编辑宿主凭据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 会话账本 | token及本地估价 | usage缺失会漏计 |
| 余额与订阅 | 固定官方来源查询 | 凭据及联网，旧快照须区分 |
| 账户管理 | 加密列表及宿主key热切换 | 删除不撤销宿主key |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web服务与slots | 必需 | host API与界面 | 缺服务无法显示 |
| credentials seam | 余额与切换必需 | 解析和写入key | 缺失或拒写显示错误 |
| 本地storages与密钥 | 保存必需 | 账本及加密账户 | 双坏锁定拒写 |
| 官方网络 | 余额订阅价格需要 | DeepSeek/Z.ai固定目的地 | 离线与旧快照必须区分 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 独立profile备份账本账户密钥及原凭据 | 可读回原key来源 |
| 核账 | 关闭planSync/pricingSync后只核一条usage | 估价和余额来源分别核对 |
| 切换 | 先测试凭据拒写和保存失败 | 显示选项与实际计费key一致才继续 |
| 退出 | 禁用插件并恢复或撤销宿主凭据 | 列表删除不能充当撤销 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 存储与网络资源未测 | 核备份和宿主访问控制 | 无自动安装实测 |
| 持续 | 余额60秒/订阅5分钟/价格6小时请求 | 处理旧价和usage缺失 | 插件本身未见推理调用，实际账单仍外部产生 |
| 失败恢复 | 保留主备及本地key需磁盘 | 核查锁定与宿主凭据 | 持久化与凭据无跨资源事务 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 用量记录 | 最后usage与稳定身份替换 | 完整性及真实重复率 |
| 价格解释 | usage时点快照与unknown价格 | 与官方结算差额 |
| 账户保护 | 加密写及双坏锁定 | 系统同用户读取和故障恢复 |

> **思考**：[Q02](#research-q02) 列表删除不撤销宿主key，持久化与凭据不是原子事务；[Q03](#research-q03) 共享部署访问边界依赖宿主。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将usage身份、价格快照和会话视图接起来；[Q02](#research-q02) 热切换跨入宿主凭据。

[Q02](#research-q02) 主备锁定和凭据拒写明确，但不能声称账户与宿主原子一致。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 列表删除不撤销宿主key，持久化与凭据不是原子事务；[Q03](#research-q03) 共享部署访问边界依赖宿主。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先只读核账，确认实际key及权限再考虑切换。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态覆盖计量、账户恢复与网络入口，未运行宿主、官方接口或支付。

- 已检查：作者 README、包清单、源码路径 index.js、lib/plans.js、src/client/core.js、src/client/wallet.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根插件host/client及只读订阅适配器；可选永久删除只承认宿主能力门控设置，不计为根提供的删除后端。
- 下一步：独立profile核usage重放/缺失、保存拒绝、密钥删除与禁用后网络。

**分析版本**

- **仓库**：[feibi-mochi/deepseek-harness-control-center](https://github.com/feibi-mochi/deepseek-harness-control-center)
- **版本号**：0.3.13（[固定提交 1ec74d2](https://github.com/feibi-mochi/deepseek-harness-control-center/tree/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657)）
- **版本日期**：2026-09-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 无稳定身份和估值来源提示是否改善核账判断需对照。

独立profile核usage重放/缺失、保存拒绝、密钥删除与禁用后网络。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 14 | 919 | — | — | 20397 |
| .js | source | 8 | 8538 | 7817 | 455 | — |
| .mjs | source | 5 | 223 | 199 | 7 | — |
| .mjs | test | 7 | 4120 | 2410 | 1582 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/feibi-mochi/deepseek-harness-control-center/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：控制中心怎样连接用量、官方余额和账户切换，能否可信核账与安全退出？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 余额、用量与价格怎样变成同一界面？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

这是DSH的host/client插件，host监听全局llm/stream，client注册会话chip与钱包设置页。监听器原样yield模型chunk，只保存最后一个usage与其接收时间，finally即使流异常也尝试记账；完全没有usage则没有账目。记录要求session/provider/model，不完整即丢弃。官方桶按配置的provider识别，其他路由保留token并可另配价格，不能将未知价格当零成本。

事件优先使用turn+step+purpose身份，其次requestId，均无则随机UUID。重复身份先减掉旧事件贡献再加新，因而有去重机制却不能保证无身份重放去重。成本使用usage事件到达时的规则/北京时间峰谷，生成事件时锁定估值，未知模型返回null。365天/2万事件是保留上界；本地token估算与官方余额来源不同，不代表官方逐笔账单，也未证明节省费用。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/wallet.js:1671-1714](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/src/client/wallet.js#L1671-L1714)

宿主界面入口

<details>
<summary>查看原文（44行）</summary>

```text
var inject = ['slots', 'sessions', 'modelDirectories', 'remote', 'remote.session']

function apply(ctx) {
  ctx.inject(['sessions'], function (scope) {
    scope.effect(function () { return installCompletionNotifier(scope) }, 'dsh-wallet: completion notifications')
    scope.effect(function () { return installMaidModelMenuGuard() }, 'dsh-wallet: maid model-menu repaint guard')
    scope.effect(function () { return installPersistentPreferenceSync() }, 'dsh-wallet: durable preference sync')
  })
  ctx.inject(['slots', 'conversation', 'modelDirectories', 'remote', 'remote.session'], function (scope) {
    scope.effect(function () {
      return scope.slots.register({
        name: 'conversation.input.left',
        id: 'wallet',
        order: 130,
        inject: function (sessionId) {
          var directory = scope.modelDirectories.directoryFor(sessionId)
          return {
            modelAware: true,
            modelDirectory: directory
          }
        }
      }, WalletChip)
    }, 'dsh-wallet: chip registration')
  })
  // Host settings panel section (dsh rc.7 settings cards): order 40 sits
  // right below the vision-toolkit section (order 30) contributed by
  // another plugin. Registered only when the host exposes the slots API
  // root, so older hosts without settings cards keep loading the wallet.
  if (ctx.slots && typeof ctx.slots.inject === 'function') {
    ctx.slots.inject('settings.section', function () {
      return ctx.slots.register({
        name: 'settings.section',
        id: 'wallet',
        order: 40,
        label: function () { return '\u94b1\u5305' },
        inject: function () {
          return {
            modelAware: true,
            sessionsService: ctx.sessions,
            modelDirectories: ctx.modelDirectories
          }
        }
      }, WalletSettingsSection)
    })
```

</details>

**依据 2 · 源码核查**：[index.js:2366-2387](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/index.js#L2366-L2387)

透明转发与最后usage采集

<details>
<summary>查看原文（22行）</summary>

```text
  const usageTap = (options, next) => {
    const downstream = next()
    return (async function* () {
      let usage = null
      let usageAt = 0
      try {
        for await (const chunk of downstream) {
          if (chunk !== null && chunk !== undefined && chunk.type === 'usage' && chunk.usage !== undefined) {
            usage = chunk.usage
            usageAt = Date.now()
          }
          yield chunk
        }
      } finally {
        if (usage !== null) {
          recordUsage(options, usage, usageAt)
          scheduleSave(ctx.logger)
        }
      }
    })()
  }
  ctx.on('llm/stream', usageTap, { global: true })
```

</details>

**依据 3 · 源码核查**：[index.js:624-636](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/index.js#L624-L636)

稳定或随机身份

<details>
<summary>查看原文（13行）</summary>

```text
function historyIdentity(options, usage, sessionId, provider, model) {
  const request = options !== null && typeof options === 'object' ? options : {}
  const report = usage !== null && typeof usage === 'object' ? usage : {}
  const meta = request.meta !== null && typeof request.meta === 'object' ? request.meta : {}
  const turn = finiteInteger(request.turn ?? meta.turn ?? report.turn)
  const step = finiteInteger(request.step ?? meta.step ?? report.step)
  const purpose = boundedString(request.purpose, 40) || ''
  if (turn !== null && step !== null) {
    return { kind: 'turn-step', turn, step, raw: 'turn-step|' + sessionId + '|' + provider + '|' + model + '|' + turn + '|' + step + '|' + purpose }
  }
  const requestId = boundedString(request.usageId ?? request.requestId ?? request.id ?? report.usageId ?? report.requestId, 160)
  if (requestId !== null) return { kind: 'request-id', requestId, raw: 'request-id|' + sessionId + '|' + provider + '|' + model + '|' + requestId }
  return { kind: 'generated', raw: 'generated|' + randomUUID() }
```

</details>

**依据 4 · 源码核查**：[index.js:698-725](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/index.js#L698-L725)

事件时刻价格快照

<details>
<summary>查看原文（28行）</summary>

```text
function createHistoryEvent(options, usage, atMs, officialProviders) {
  const request = options !== null && typeof options === 'object' ? options : {}
  const sessionId = boundedString(request.sessionId, 160)
  const provider = boundedString(request.provider, 100)
  const model = boundedString(request.model ?? request.modelName, 160)
  const day = historyDayKey(atMs)
  if (sessionId === null || provider === null || model === null || day === null) return null
  const identity = historyIdentity(request, usage, sessionId, provider, model)
  const official = isOfficialProvider(provider, officialProviders)
  const counters = historyUsageCounters(usage)
  const cost = official ? costOf(model, counters, atMs) : null
  return {
    occurredAt: atMs,
    day,
    sessionId,
    provider,
    model,
    official,
    usage: counters,
    cost: official && cost !== null ? cost : null,
    priced: official && cost !== null,
    identity: identity.kind === 'generated'
      ? null
      : { kind: identity.kind, turn: identity.turn, step: identity.step, requestId: identity.requestId },
    schema: HISTORY_VERSION,
    observedAt: Date.now(),
    eventId: historyEventId(identity),
  }
```

</details>

**依据 5 · 源码核查**：[index.js:2021-2054](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/index.js#L2021-L2054)

必填与重复替换

<details>
<summary>查看原文（34行）</summary>

```text
function recordUsage(options, usage, atMs = Date.now()) {
  const request = options !== null && typeof options === 'object' ? options : {}
  const sessionId = boundedString(request.sessionId, 160)
  const provider = boundedString(request.provider, 100)
  const model = boundedString(request.model ?? request.modelName, 160)
  if (sessionId === null || provider === null || model === null) return
  if (model === '__proto__' || model === 'prototype' || model === 'constructor') return
  if (sessionId === '__proto__' || sessionId === 'prototype' || sessionId === 'constructor') return
  // Remember every non-builtin route observed by the stream tap. The settings
  // page can then promote wrapper routes into the official billing bucket.
  if (provider !== OFFICIAL_PROVIDER && !isPlanProvider(provider) && !store.knownProviders.includes(provider)) {
    store.knownProviders = normalizeProviderList([...store.knownProviders, provider])
  }
  if (!Object.hasOwn(store.sessions, sessionId)) {
    store.sessions[sessionId] = { official: emptyBucket(true), third: { models: {}, routes: {} } }
  }
  const event = createHistoryEvent(request, usage, atMs, store.officialProviders)
  const previousEvent = event !== null && store.history && store.history.events ? store.history.events[event.eventId] : undefined
  if (previousEvent !== undefined) removeSessionContribution(previousEvent)

  const session = store.sessions[sessionId]
  const official = isOfficialProvider(provider, store.officialProviders)
  const bucket = official ? session.official : session.third
  if (official) addOfficialUsage(bucket, model, usage, atMs)
  else {
    if (!Object.hasOwn(bucket.models, model)) bucket.models[model] = emptyCounters()
    addUsage(bucket.models[model], usage)
    if (bucket.routes === null || typeof bucket.routes !== 'object' || Array.isArray(bucket.routes)) bucket.routes = {}
    if (!Object.hasOwn(bucket.routes, provider)) bucket.routes[provider] = { models: {} }
    if (!Object.hasOwn(bucket.routes[provider].models, model)) bucket.routes[provider].models[model] = emptyCounters()
    addUsage(bucket.routes[provider].models[model], usage)
  }
  recordHistoryEvent(event)
}
```

</details>

**依据 6 · 源码核查**：[index.js:472-495](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/index.js#L472-L495)

未知价格和计算

<details>
<summary>查看原文（24行）</summary>

```text
export function ratesFor(model, atMs) {
  let entry
  for (const policy of activePricePolicies) {
    // Own-property check: a model named `__proto__`/`toString` would otherwise
    // resolve to an Object.prototype member and produce NaN costs.
    if (atMs >= policy.since && Object.hasOwn(policy.models, model)) entry = policy
  }
  if (entry === undefined) return null
  const rates = entry.models[model]
  if (entry.peakOffPeak === true) {
    const peak = isBeijingPeak(atMs) ? 1 : 0
    return { cacheHit: rates.cacheHit[peak], input: rates.input[peak], output: rates.output[peak] }
  }
  return rates
}

export function costOf(model, usage, atMs) {
  const rates = ratesFor(model, atMs)
  if (rates === null) return null
  usage = usage !== null && typeof usage === 'object' ? usage : {}
  const input = finiteCounter(usage.inputTokens ?? usage.input) * rates.input
  const cacheRead = finiteCounter(usage.cacheReadTokens ?? usage.cacheRead) * rates.cacheHit
  const output = finiteCounter(usage.outputTokens ?? usage.output) * rates.output
  return (input + cacheRead + output) / 1e6
```

</details>

#### 缺口

- 真实provider usage是否累计、缺失或重放未实测
  **影响**：可能漏计或重复，估价不能替代账单
  **进一步探讨**：对照可控多chunk、异常流及官方明细

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 加密账户和热切换能否被视为事务？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

账户写盘先加密到owner-only临时文件，备份旧主文件再rename；已有主备均不可读时锁定拒写，避免空数据覆盖。Windows先尝试当前用户DPAPI，失败还会退到AES-GCM文件密钥；其他平台同样使用本地32字节密钥，密钥与密文同目录意味着同用户完全可读时并非隔离。旧明文记录仍可迁移，备份和迁移后的残留需要独立检查。钱包账本也有主备恢复和双坏锁定，不应把空UI解释成没有历史。

activate先await credentials.set，失败保持activeId，成功后内存改选并500ms延迟保存。因此它处理宿主拒写但不是宿主凭据与accounts文件跨资源原子事务：保存失败或进程中止可能使重启后的选项与已写宿主key不同。首次添加账户会尝试激活，失败回滚activeId但仍保存列表。删除账户只删列表与阈值，刻意不清宿主凭据；停用插件或删除列表不等于撤销模型密钥，退出必须单独恢复/撤销宿主凭据。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1676-1691](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/index.js#L1676-L1691)

DPAPI失败回退AES

<details>
<summary>查看原文（16行）</summary>

```text
function protectApiKey(apiKey) {
  const dpapi = runWindowsDpapi('protect', apiKey)
  if (dpapi !== null) {
    accountStorageScheme = 'windows-dpapi'
    accountStorageError = null
    return { version: ACCOUNTS_CRYPTO_VERSION, scheme: 'windows-dpapi', payload: dpapi }
  }
  const key = getFallbackEncryptionKey()
  if (key === null) return null
  try {
    const encrypted = encryptApiKeyAes(apiKey, key)
    accountStorageScheme = 'aes-gcm-file-key'
    return encrypted
  } catch {
    accountStorageError = 'account-encryption-failed'
    return null
```

</details>

**依据 2 · 源码核查**：[index.js:1627-1649](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/index.js#L1627-L1649)

本地密钥文件

<details>
<summary>查看原文（23行）</summary>

```text
function getFallbackEncryptionKey(createIfMissing = true) {
  if (fallbackEncryptionKey !== null) return fallbackEncryptionKey
  try {
    mkdirSync(dirname(ACCOUNTS_KEY_PATH), { recursive: true, mode: 0o700 })
    if (existsSync(ACCOUNTS_KEY_PATH)) {
      const existing = readFileSync(ACCOUNTS_KEY_PATH)
      if (existing.length !== 32) throw new Error('account encryption key has an invalid length')
      fallbackEncryptionKey = existing
    } else {
      if (!createIfMissing) {
        accountStorageError = 'account-encryption-key-missing'
        accountStorageLocked = true
        return null
      }
      fallbackEncryptionKey = randomBytes(32)
      writeFileSync(ACCOUNTS_KEY_PATH, fallbackEncryptionKey, { mode: 0o600 })
      chmodSync(ACCOUNTS_KEY_PATH, 0o600)
    }
    return fallbackEncryptionKey
  } catch {
    accountStorageError = 'account-encryption-key-unavailable'
    accountStorageLocked = true
    return null
```

</details>

**依据 3 · 源码核查**：[index.js:1789-1807](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/index.js#L1789-L1807)

主备读取和锁定

<details>
<summary>查看原文（19行）</summary>

```text
function loadAccounts() {
  const primaryExists = existsSync(ACCOUNTS_PATH)
  const backupExists = existsSync(ACCOUNTS_BACKUP_PATH)
  try {
    return readAccountsFile(ACCOUNTS_PATH)
  } catch {
    try {
      const recovered = readAccountsFile(ACCOUNTS_BACKUP_PATH)
      accountStorageRecovered = true
      accountStorageError = 'account-store-restored-from-backup'
      accountStoreSkipBackupOnce = true
      return { accounts: recovered.accounts, migrated: true }
    } catch {
      if (primaryExists || backupExists) {
        accountStorageError = backupExists ? 'account-primary-and-backup-invalid' : 'account-store-invalid'
        accountStorageLocked = true
      }
      return { accounts: emptyAccounts(), migrated: false }
    }
```

</details>

**依据 4 · 源码核查**：[index.js:1816-1855](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/index.js#L1816-L1855)

加密临时写和持久错误

<details>
<summary>查看原文（40行）</summary>

```text
function persistAccounts(logger) {
  if (accountsSaveTimer !== null) {
    clearTimeout(accountsSaveTimer)
    accountsSaveTimer = null
  }
  try {
    if (accountStorageLocked) throw new Error('encrypted account store is locked')
    mkdirSync(dirname(ACCOUNTS_PATH), { recursive: true, mode: 0o700 })
    const tmp = ACCOUNTS_PATH + '.tmp'
    const encryptedAccounts = accounts.accounts.map((account) => {
      const apiKeyEncrypted = protectApiKey(account.apiKey)
      if (apiKeyEncrypted === null) throw new Error('account encryption unavailable')
      return {
        id: account.id,
        name: account.name,
        apiKeyEncrypted,
        createdAt: account.createdAt,
      }
    })
    writeFileSync(tmp, JSON.stringify({ version: ACCOUNTS_VERSION, accounts: encryptedAccounts, activeId: accounts.activeId }), { mode: 0o600 })
    chmodSync(tmp, 0o600)
    if (existsSync(ACCOUNTS_PATH) && !accountStoreSkipBackupOnce) {
      copyFileSync(ACCOUNTS_PATH, ACCOUNTS_BACKUP_PATH)
      chmodSync(ACCOUNTS_BACKUP_PATH, 0o600)
    }
    renameSync(tmp, ACCOUNTS_PATH)
    chmodSync(ACCOUNTS_PATH, 0o600)
    if (!existsSync(ACCOUNTS_BACKUP_PATH)) {
      copyFileSync(ACCOUNTS_PATH, ACCOUNTS_BACKUP_PATH)
      chmodSync(ACCOUNTS_BACKUP_PATH, 0o600)
    }
    accountStoreSkipBackupOnce = false
    accountsNeedsSave = false
    accountStorageRecovered = false
    accountStorageError = null
  } catch (error) {
    accountStorageError = accountStorageError || 'account-encryption-failed'
    accountStorageLocked = true
    if (logger && typeof logger.warn === 'function') {
      logger.warn('dsh-wallet: failed to persist encrypted accounts')
```

</details>

**依据 5 · 源码核查**：[index.js:1966-1987](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/index.js#L1966-L1987)

凭据先于activeId

<details>
<summary>查看原文（22行）</summary>

```text
export async function activateAccount(ctx, id) {
  const account = findAccount(id)
  if (account === null) return { ok: false, error: 'account-not-found' }
  const credentials = ctx.get('credentials')
  if (credentials === undefined) return { ok: false, error: 'credentials-unavailable' }
  try {
    await credentials.set(CREDENTIAL_REF, account.apiKey)
  } catch (error) {
    // e.g. the launching environment supplies DEEPSEEK_API_KEY read-only, so
    // the write is shadowed and refused by the credentials provider. Keep the
    // browser error bounded and do not log provider text that might contain
    // paths, environment details, or key fragments.
    if (ctx.logger && typeof ctx.logger.warn === 'function') {
      ctx.logger.warn('dsh-wallet: credential write refused')
    }
    return { ok: false, error: 'credential-write-refused' }
  }
  accounts.activeId = account.id
  scheduleAccountsSave(ctx.logger)
  invalidateBalance()
  void refreshBalance(ctx)
  return { ok: true, account: { id: account.id, name: account.name, maskedKey: maskKey(account.apiKey) } }
```

</details>

**依据 6 · 源码核查**：[index.js:1910-1928](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/index.js#L1910-L1928)

删除保留宿主key

<details>
<summary>查看原文（19行）</summary>

```text
export function removeAccount(id) {
  const index = accounts.accounts.findIndex((account) => account.id === id)
  if (index < 0) return { ok: false, error: 'account not found' }
  accounts.accounts.splice(index, 1)
  // Drop the account's own threshold line along with it. The caller persists
  // wallet.json separately from accounts.json when this flag is true.
  let thresholdRemoved = false
  if (store.accountThresholds && Object.hasOwn(store.accountThresholds, id)) {
    delete store.accountThresholds[id]
    thresholdRemoved = true
  }
  // Deliberately NOT unsetting the credentials seam: the key currently in
  // .credentials.yaml keeps working for LLM billing; the UI just reports
  // "no active account" and balance falls back to the seam key.
  if (accounts.activeId === id) {
    accounts.activeId = null
    invalidateBalance()
  }
  return { ok: true, thresholdRemoved }
```

</details>

**依据 7 · 源码核查**：[index.js:2634-2660](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/index.js#L2634-L2660)

首次激活拒绝回滚

<details>
<summary>查看原文（27行）</summary>

```text
    const disposeAccounts = ctx.webServer.register({
      kind: 'exact',
      path: '/api/wallet/accounts',
      handler: async (req, res) => {
        if (req.method === 'GET') return json(res, 200, { ok: true, ...accountListView() })
        if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'method-not-allowed' })
        if (accountStorageLocked) return json(res, 423, { ok: false, error: 'account-storage-locked' })
        const body = await readBody(req)
        if (body === null || typeof body.name !== 'string' || typeof body.apiKey !== 'string') {
          return json(res, 400, { ok: false, error: 'name and apiKey are required' })
        }
        const previousActiveId = accounts.activeId
        const needSync = previousActiveId === null
        const result = addAccount(body.name, body.apiKey)
        if (!result.ok) return json(res, 400, { ok: false, error: result.error })
        scheduleAccountsSave(ctx.logger)
        let sync = null
        if (needSync) {
          // First account: activate it so the LLM seam follows the new key.
          sync = await activateAccount(ctx, result.account.id)
          // addAccount marks the first row active optimistically. If the host
          // refuses the credential write, roll it back so UI/balance state does
          // not claim a billing account that the LLM route is not using.
          if (!sync.ok && accounts.activeId === result.account.id) {
            accounts.activeId = previousActiveId
            scheduleAccountsSave(ctx.logger)
          }
```

</details>

**依据 8 · 源码核查**：[index.js:1330-1349](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/index.js#L1330-L1349)

用量双坏锁定

<details>
<summary>查看原文（20行）</summary>

```text
function loadStore() {
  const primaryExists = existsSync(STORE_PATH)
  const backupExists = existsSync(STORE_BACKUP_PATH)
  try {
    return { ...readStoreFile(STORE_PATH), recovered: false }
  } catch {
    try {
      const recovered = readStoreFile(STORE_BACKUP_PATH)
      usageStorageStatus = 'recovered'
      usageStorageRecovered = true
      usageStoreSkipBackupOnce = true
      return { ...recovered, migrated: true, recovered: true }
    } catch {
      if (primaryExists || backupExists) {
        usageStorageStatus = 'locked'
        usageStorageError = 'usage-store-unreadable'
        usageStorageLocked = true
      }
      return { store: emptyStoreData(), migrated: false, recovered: false }
    }
```

</details>

#### 缺口

- 断电、跨进程竞争及凭据与账户文件一致性未复现
  **影响**：可能重启后显示选项和实际计费key不一致
  **进一步探讨**：用独立profile注入保存失败并读回实际凭据来源

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 接入、联网、权限和退出有哪些具体条件？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

依赖webServer与credentials以及Web slots等UI服务。余额启动即刷新、每60秒重查并有启动重试；key取active账户否则宿主引用，发往固定DeepSeek余额URL，15秒超时与generation防过时结果。订阅适配器固定两处Z.ai官方URL和各自credentialRef，默认5分钟刷新，可用planSync:false关闭；价格页默认6小时请求并使用缓存校验，可pricingSync:false关闭。价格解析失败标review-required或离线沿用旧/内置规则，不能把旧价当实时。订阅body先读完再检查大小，不是传输级限流。

钱包API用method、body及storage locked检查，所读handler没有独立用户或会话ACL；不能据此断言可被公网任意访问，也不能证明多租户隔离，认证和来源限制须由实际宿主验证。源码没有模型工具或提示词注册，这降低模型输入改写的范围，却不减少账户写凭据权限。先在独立profile备份wallet/accounts/key及原凭据，关闭自动价格和plan联网，只核一条usage、一次余额失败、一次切换拒绝；若无法确认宿主访问控制或实际计费key，暂不启用多账户。禁用后路由与定时器释放并flush待保存，但在途网络未见统一abort；恢复凭据和备份，保留必要账本后分别处理密钥与主备文件，充值跳转需另作支付决定。永久删除设置读取宿主扩展/DOM capability并在未支持时disabled，根插件不能据此宣称提供删除后端，可选集成不在根能力表计分。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:27-28](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/index.js#L27-L28)

host依赖

```text
export const name = 'wallet'
export const inject = ['webServer', 'credentials']
```

**依据 2 · 源码核查**：[index.js:2069-2124](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/index.js#L2069-L2124)

余额固定目的地和过时守卫

<details>
<summary>查看原文（56行）</summary>

```text
async function performBalanceRefresh(ctx, generation) {
  try {
    const credentials = ctx.get('credentials')
    if (credentials === undefined) {
      balance = { fetchedAt: Date.now(), available: false, balances: [], error: 'no-credentials' }
      return
    }
    const key = await resolveBalanceKey(ctx)
    if (generation !== balanceGeneration) return
    if (key === undefined || key === '') {
      balance = { fetchedAt: Date.now(), available: false, balances: [], error: 'no-api-key' }
      return
    }
    const controller = new AbortController()
    balanceController = controller
    const timer = setTimeout(() => controller.abort(), 15000)
    try {
      const response = await fetch('https://api.deepseek.com/user/balance', {
        method: 'GET',
        headers: { authorization: 'Bearer ' + key },
        signal: controller.signal,
      })
      if (!response.ok) {
        const code = response.status === 401 || response.status === 403
          ? 'unauthorized'
          : response.status === 429 ? 'rate-limited' : 'upstream-unavailable'
        const error = new Error(code)
        error.code = code
        throw error
      }
      const data = await response.json()
      if (generation !== balanceGeneration) return
      const available = data !== null && typeof data === 'object' && data.is_available === true
      balance = {
        fetchedAt: Date.now(),
        available,
        balances: available && Array.isArray(data.balance_infos) ? data.balance_infos : [],
        error: available ? null : 'balance-unavailable',
      }
    } finally {
      clearTimeout(timer)
      if (balanceController === controller) balanceController = null
    }
  } catch (error) {
    if (generation !== balanceGeneration) return
    const code = error && typeof error === 'object' && typeof error.code === 'string'
      ? error.code
      : error && typeof error === 'object' && error.name === 'AbortError'
        ? 'timeout'
        : error instanceof SyntaxError ? 'invalid-response' : 'upstream-unavailable'
    balance = {
      fetchedAt: Date.now(),
      available: false,
      balances: [],
      error: code,
    }
```

</details>

**依据 3 · 源码核查**：[lib/plans.js:23-45](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/lib/plans.js#L23-L45)

订阅固定来源

<details>
<summary>查看原文（23行）</summary>

```text
export const PLAN_ADAPTERS = Object.freeze([
  Object.freeze({
    id: 'zai-global',
    provider: 'zai',
    name: 'Z.ai Coding Plan',
    region: 'global',
    kind: 'subscription',
    credentialRef: 'ZAI_API_KEY',
    endpoint: 'https://api.z.ai/api/monitor/usage/quota/limit',
    sourceDomain: 'api.z.ai',
    limitTypes: ZAI_LIMITS,
  }),
  Object.freeze({
    id: 'zai-cn',
    provider: 'zai-coding-cn',
    name: 'Z.ai Coding Plan 中国区',
    region: 'cn',
    kind: 'subscription',
    credentialRef: 'ZAI_CODING_CN_API_KEY',
    endpoint: 'https://open.bigmodel.cn/api/monitor/usage/quota/limit',
    sourceDomain: 'open.bigmodel.cn',
    limitTypes: ZAI_LIMITS,
  }),
```

</details>

**依据 4 · 源码核查**：[index.js:1460-1506](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/index.js#L1460-L1506)

订阅请求及后验长度检查

<details>
<summary>查看原文（47行）</summary>

```text
async function performPlanRefresh(ctx, adapter, force) {
  const runtime = planRuntimeFor(adapter)
  const auth = await resolvePlanCredential(ctx, adapter)
  runtime.checkedAt = Date.now()
  runtime.configured = auth.configured
  if (auth.key === null) {
    runtime.error = auth.error
    return
  }
  if (!force && runtime.snapshot !== null && Date.now() - runtime.snapshot.fetchedAt < PLAN_REFRESH_MS) {
    runtime.error = null
    return
  }
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), PLAN_REFRESH_TIMEOUT_MS)
  try {
    const response = await fetch(adapter.endpoint, {
      method: 'GET',
      headers: {
        authorization: auth.key,
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'content-type': 'application/json',
      },
      signal: controller.signal,
    })
    if (!response.ok) {
      const error = new Error(planHttpError(response.status))
      error.code = planHttpError(response.status)
      throw error
    }
    const body = await response.text()
    if (Buffer.byteLength(body, 'utf8') > PLAN_RESPONSE_MAX_BYTES) {
      const error = new Error('invalid-response')
      error.code = 'invalid-response'
      throw error
    }
    const snapshot = normalizePlanPayload(adapter, JSON.parse(body), Date.now())
    runtime.snapshot = snapshot
    runtime.error = null
    store.plans[adapter.id] = snapshot
    scheduleSave(ctx.logger)
  } catch (error) {
    runtime.error = boundedPlanError(error)
    if (ctx.logger && typeof ctx.logger.warn === 'function') ctx.logger.warn('dsh-wallet: subscription plan refresh failed for ' + adapter.id)
  } finally {
    clearTimeout(timer)
  }
```

</details>

**依据 5 · 源码核查**：[index.js:2389-2425](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/index.js#L2389-L2425)

实际启动与周期和关闭开关

<details>
<summary>查看原文（37行）</summary>

```text
  void refreshBalance(ctx)
  // Staggered boot retries: the credentials seam or network may not be ready
  // at first mount; retry a few times so the chip shows a value without
  // waiting for the 60s cadence (or for the user to send a message).
  ctx.effect(() => {
    const retries = [2000, 6000, 15000, 30000].map((delay) => {
      const retry = setTimeout(() => {
        if (!balance.available) void refreshBalance(ctx)
      }, delay)
      if (typeof retry.unref === 'function') retry.unref()
      return retry
    })
    return () => {
      for (const retry of retries) clearTimeout(retry)
    }
  }, 'dsh-wallet: boot balance retries')
  const balanceTimer = setInterval(() => void refreshBalance(ctx), BALANCE_REFRESH_MS)
  if (typeof balanceTimer.unref === 'function') balanceTimer.unref()

  let planTimer = null
  if (config.planSync !== false) {
    void refreshPlans(ctx)
    planTimer = setInterval(() => void refreshPlans(ctx, { force: true }), PLAN_REFRESH_MS)
    if (typeof planTimer.unref === 'function') planTimer.unref()
  }

  if (config.pricingSync !== false) {
    ctx.effect(() => {
      const first = setTimeout(() => void syncOfficialPricing(ctx.logger), 1000)
      const timer = setInterval(() => void syncOfficialPricing(ctx.logger), PRICING_SYNC_INTERVAL_MS)
      if (typeof first.unref === 'function') first.unref()
      if (typeof timer.unref === 'function') timer.unref()
      return () => {
        clearTimeout(first)
        clearInterval(timer)
      }
    }, 'dsh-wallet: official pricing sync')
```

</details>

**依据 6 · 源码核查**：[index.js:338-365](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/index.js#L338-L365)

价格失败可见状态

<details>
<summary>查看原文（28行）</summary>

```text
async function syncOfficialPricing(logger) {
  if (typeof fetch !== 'function') return
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), PRICING_SYNC_TIMEOUT_MS)
  let stage = 'network'
  try {
    const headers = {}
    if (pricingSync.etag) headers['if-none-match'] = pricingSync.etag
    if (pricingSync.lastModified) headers['if-modified-since'] = pricingSync.lastModified
    const response = await fetch(PRICING_SOURCE_URL, { headers, signal: controller.signal })
    if (response.status === 304) {
      pricingSync = { ...pricingSync, status: 'synced', checkedAt: Date.now(), message: '官方价格页未变化' }
      return
    }
    if (!response.ok) throw new Error('official pricing page returned ' + response.status)
    stage = 'parse'
    const parsed = parseOfficialPricingHtml(await response.text())
    applyOfficialPricing(parsed, response)
  } catch (error) {
    const hasValidatedOfficialRule = typeof pricingSync.ruleVersion === 'string' && pricingSync.ruleVersion.startsWith('official-')
    pricingSync = {
      ...pricingSync,
      status: stage === 'parse' ? 'review-required' : 'offline',
      checkedAt: Date.now(),
      message: stage === 'parse'
        ? '官方价格页结构有变化，需要复核'
        : hasValidatedOfficialRule ? '官方价格页暂时不可用，沿用上次已验证规则' : '官方价格页暂时不可用，使用内置规则',
    }
```

</details>

**依据 7 · 源码核查**：[index.js:2675-2689](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/index.js#L2675-L2689)

账户变更handler边界

<details>
<summary>查看原文（15行）</summary>

```text
    const disposeActivate = ctx.webServer.register({
      kind: 'exact',
      path: '/api/wallet/accounts/activate',
      handler: async (req, res) => {
        if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'method-not-allowed' })
        if (accountStorageLocked) return json(res, 423, { ok: false, error: 'account-storage-locked' })
        const body = await readBody(req)
        if (body === null || typeof body.id !== 'string') return json(res, 400, { ok: false, error: 'id is required' })
        const result = await activateAccount(ctx, body.id)
        if (!result.ok) return json(res, 400, { ok: false, error: result.error })
        // Carry the account's own threshold so the input can jump instantly,
        // before the balance refresh lands.
        const currency = balanceCurrency(balance.balances) || 'CNY'
        const threshold = store.accountThresholds[result.account.id] ?? store.thresholds[currency] ?? 0
        return json(res, 200, { ok: true, account: result.account, threshold })
```

</details>

**依据 8 · 源码核查**：[index.js:2709-2729](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/index.js#L2709-L2729)

卸载路由定时器与flush

<details>
<summary>查看原文（21行）</summary>

```text
    return () => {
      disposeSnapshot()
      disposeHealth()
      disposePricingRefresh()
      disposePreferences()
      disposeThreshold()
      disposeRefresh()
      disposeClear()
      disposeHistory()
      disposeClearHistory()
      disposePlans()
      disposeAccounts()
      disposeProviders()
      disposeCustomPrices()
      disposeActivate()
      disposeRemove()
      clearInterval(balanceTimer)
      if (planTimer !== null) clearInterval(planTimer)
      if (saveTimer !== null) persistStore(ctx.logger)
      if (accountsSaveTimer !== null) persistAccounts(ctx.logger)
    }
```

</details>

**依据 9 · 源码核查**：[src/client/core.js:268-272](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/src/client/core.js#L268-L272)

宿主扩展或DOM能力标记

```text
  function hasCapability(name) {
    if (extension.capabilities && extension.capabilities[name] === true) return true
    var doc = root.document
    if (!doc || !doc.documentElement || typeof doc.documentElement.getAttribute !== 'function') return false
    return doc.documentElement.getAttribute('data-dshw-capability-' + name.replace(/[A-Z]/g, function (letter) { return '-' + letter.toLowerCase() })) === 'true'
```

**依据 10 · 源码核查**：[src/client/wallet.js:1331-1348](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/src/client/wallet.js#L1331-L1348)

永久删除设置受宿主能力门控

<details>
<summary>查看原文（18行）</summary>

```text
  var permanentDeleteControl = React.createElement('div', { className: 'dshw_setCell', style: { border: 'none', padding: '0 9px', minHeight: '30px' } },
    React.createElement('span', { className: 'dshw_muted' }, '永久删除会话'),
    React.createElement('label', { className: 'dshw_check' },
      React.createElement('input', {
        type: 'checkbox',
        checked: permanentDeleteSupported && permanentDeleteEnabled,
        disabled: !permanentDeleteSupported,
        'aria-label': '开启永久删除会话',
        title: permanentDeleteSupported ? '在会话菜单中显示永久删除' : '当前宿主未提供永久删除能力',
        onChange: function (event) {
          if (!permanentDeleteSupported) return
          var enabled = event.target.checked
          setPermanentDeleteEnabled(enabled)
          try { compatibility.storage.setItem(PERMANENT_DELETE_KEY, String(enabled)) } catch (e) { /* ignore */ }
          compatibility.dispatch(PERMANENT_DELETE_EVENT)
        }
      }),
      React.createElement('span', null, permanentDeleteSupported ? '开启' : '宿主不支持')))
```

</details>

#### 缺口

- 宿主认证、权限边界及在途请求卸载行为未运行验证
  **影响**：远程共享部署与退出完成性未知
  **进一步探讨**：独立本地profile先验访问控制并检查禁用后的网络与文件

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样证伪“本地估算足够核账”的主张？

**研究主题**：新假设与验证

#### 完整回答

当前有稳定身份替换及usage事件时点价，并非需要从零新增账本。可检验改进是假设：对无稳定身份事件明确标记“不可去重”，并展示usage来源完整性，能减少用户误把估算当账单的判断。以相同token重放、有requestId重放、usage缺失、跨峰谷结束和手动provider别名错误为反例，对比现界面与标记版的归因正确率及核账时间。若新提示不改变判断、干扰正常用户，或provider已提供稳定身份，则不引入额外提示。不能用现有源码宣称改版提高准确率或节省钱。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:624-636](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/index.js#L624-L636)

缺失稳定身份分支

<details>
<summary>查看原文（13行）</summary>

```text
function historyIdentity(options, usage, sessionId, provider, model) {
  const request = options !== null && typeof options === 'object' ? options : {}
  const report = usage !== null && typeof usage === 'object' ? usage : {}
  const meta = request.meta !== null && typeof request.meta === 'object' ? request.meta : {}
  const turn = finiteInteger(request.turn ?? meta.turn ?? report.turn)
  const step = finiteInteger(request.step ?? meta.step ?? report.step)
  const purpose = boundedString(request.purpose, 40) || ''
  if (turn !== null && step !== null) {
    return { kind: 'turn-step', turn, step, raw: 'turn-step|' + sessionId + '|' + provider + '|' + model + '|' + turn + '|' + step + '|' + purpose }
  }
  const requestId = boundedString(request.usageId ?? request.requestId ?? request.id ?? report.usageId ?? report.requestId, 160)
  if (requestId !== null) return { kind: 'request-id', requestId, raw: 'request-id|' + sessionId + '|' + provider + '|' + model + '|' + requestId }
  return { kind: 'generated', raw: 'generated|' + randomUUID() }
```

</details>

**依据 2 · 源码核查**：[index.js:698-725](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/index.js#L698-L725)

事件时刻与官方桶

<details>
<summary>查看原文（28行）</summary>

```text
function createHistoryEvent(options, usage, atMs, officialProviders) {
  const request = options !== null && typeof options === 'object' ? options : {}
  const sessionId = boundedString(request.sessionId, 160)
  const provider = boundedString(request.provider, 100)
  const model = boundedString(request.model ?? request.modelName, 160)
  const day = historyDayKey(atMs)
  if (sessionId === null || provider === null || model === null || day === null) return null
  const identity = historyIdentity(request, usage, sessionId, provider, model)
  const official = isOfficialProvider(provider, officialProviders)
  const counters = historyUsageCounters(usage)
  const cost = official ? costOf(model, counters, atMs) : null
  return {
    occurredAt: atMs,
    day,
    sessionId,
    provider,
    model,
    official,
    usage: counters,
    cost: official && cost !== null ? cost : null,
    priced: official && cost !== null,
    identity: identity.kind === 'generated'
      ? null
      : { kind: identity.kind, turn: identity.turn, step: identity.step, requestId: identity.requestId },
    schema: HISTORY_VERSION,
    observedAt: Date.now(),
    eventId: historyEventId(identity),
  }
```

</details>

**依据 3 · 源码核查**：[index.js:2366-2384](https://github.com/feibi-mochi/deepseek-harness-control-center/blob/1ec74d2a176072d7dbfdf5cb8bf1e8e9515d9657/index.js#L2366-L2384)

无usage路径

<details>
<summary>查看原文（19行）</summary>

```text
  const usageTap = (options, next) => {
    const downstream = next()
    return (async function* () {
      let usage = null
      let usageAt = 0
      try {
        for await (const chunk of downstream) {
          if (chunk !== null && chunk !== undefined && chunk.type === 'usage' && chunk.usage !== undefined) {
            usage = chunk.usage
            usageAt = Date.now()
          }
          yield chunk
        }
      } finally {
        if (usage !== null) {
          recordUsage(options, usage, usageAt)
          scheduleSave(ctx.logger)
        }
      }
```

</details>

#### 缺口

- 用户是否误解估值及提示的收益未知
  **影响**：新增噪声可能抵消解释收益
  **进一步探讨**：小样本盲核对重复和漏报任务，记录反例

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
