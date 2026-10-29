# DSH XD Pool

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[b22a3e8](https://github.com/XDTrees/dsh-xdpool/tree/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9)

<!-- BEGIN META -->
[![GitHub ★ 311](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=311&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/XDTrees/dsh-xdpool) [![npm 30d 4,679](https://img.shields.io/static/v1?label=npm+30d&message=4%2C679&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-xdpool) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-xdpool)
<!-- END META -->

> **功能**：将自有 WorkBuddy 多账号与可选渠道接入 DSH，按额度和失败分类换号，并提供路由与网关。

> **亮点**：以多账号作为默认选择面，把凭据、冷却、目录、路由和DSH provider统一接线；主增量是拒绝容错和可观测，不是厂商模型或免费额度。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：流已接受后并非透明换号续接，overrun恢复可能新增摘要并截断历史；集中JSON凭据、HTTP共享网关与积分写动作扩大维护范围。当前源码积分默认关闭，与README全自动文案分开。见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 谁需要XD Pool，比单账号连接多什么？](#detail-section-11)
  - [Q02 · 账号选择、拒绝换号与流失败如何处理？](#detail-section-12)
  - [Q03 · 链、上下文恢复、凭据和后台动作改变什么？](#detail-section-13)
  - [Q04 · 依赖和实际使用怎样闭环？](#detail-section-14)
  - [Q05 · 全周期成本与效果有什么依据？](#detail-section-15)
  - [Q06 · 谁可试用，未来怎样验证生产方向？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向多自有账号、希望减少手工换号的DSH用户，合格结果是明确路由和成本下完成同一任务。见[Q01](#research-q01)。

单账号官方/连接插件较少凭据和路由维护；池增加拒绝时自动选择与统一目录，未有实际救回或净费用对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **Host 路由**：OpenAI兼容shim及可选共享key HTTP relay。
- **后台**：账号扫描/更新、冷却、可选积分写动作。
- **界面**：作者提供账号/渠道/统计/路由等页面，本轮未全审客户端。

**流程与依赖**

自有凭据与解密、宿主/Node、上游接口/额度、聚合授权及可选网关各自构成门槛；不由渠道数或免费标签担保。详表见[Q04](#research-q04)。

先盘账号和权限、单连接基线，再主池低量试，副功能分别验收；半流未知先核工具状态。步骤和失败动作见[Q04](#research-q04)。

**效果与成本**

净收益受缓存、拒绝尝试、摘要和维护影响，需核全部物理调用与账单。分阶段成本和效果表见[Q05](#research-q05)。

可能减少手动换号，但只有任务真实完成、费用和数据去向可解释才可保留；不以统计调用或积分标签算收益。见[Q06](#research-q06)。

> **思考**：流已接受后并非透明换号续接，overrun恢复可能新增摘要并截断历史；集中JSON凭据、HTTP共享网关与积分写动作扩大维护范围。当前源码积分默认关闭，与README全自动文案分开。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：以多账号作为默认选择面，把凭据、冷却、目录、路由和DSH provider统一接线；主增量是拒绝容错和可观测，不是厂商模型或免费额度。见[Q01](#research-q01)、[Q02](#research-q02)。

拒绝类型、模型级冷却、粘性和流一次记账有具体实现；流结束、模型能力、完整计费和业务副作用仍是不同验收面。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

流已接受后并非透明换号续接，overrun恢复可能新增摘要并截断历史；集中JSON凭据、HTTP共享网关与积分写动作扩大维护范围。当前源码积分默认关闭，与README全自动文案分开。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有限试主池，使用自有账号、非敏感任务，默认关闭网关/积分/额外链路，核实际状态后再扩。见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持主池选择、拒绝分类换号、流失败记账、内层摘要截断与可选网关/积分；当前各厂商可用性、实际账单和安全/质量未运行验收。恢复账为未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、package.json、src/account-store.ts、src/accounts.ts、src/adapter.ts、src/combos.ts、src/index.ts、src/relay.ts、src/scheduler.ts、src/shim.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向审WorkBuddy主池/acquire、持久账号、adapter/shim拒绝与流处理、chain成员、overrun恢复、relay和积分开关；未全审所有厂商登录/channel pack、聚合lane、积分API、Web设置认证或全部记账。
- 下一步：未读取真实账号或运行目标；后续固定测试身份核拒绝/半流/overrun、物理调用/账单、存档权限、LAN隔离和可选动作，记录任务结果和恢复成本。见[Q04](#research-q04)至[Q06](#research-q06)。

**分析版本**

- **仓库**：[XDTrees/dsh-xdpool](https://github.com/XDTrees/dsh-xdpool)
- **版本号**：2.4.6（[固定提交 b22a3e8](https://github.com/XDTrees/dsh-xdpool/tree/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

请求级恢复账同时记录物理尝试、部分输出、摘要截断和费用来源，检验是否减少误重试/损失而不过度增加日志与核对负担。见[Q06](#research-q06)。

未读取真实账号或运行目标；后续固定测试身份核拒绝/半流/overrun、物理调用/账单、存档权限、LAN隔离和可选动作，记录任务结果和恢复成本。见[Q04](#research-q04)至[Q06](#research-q06)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1952 | — | — | 51079 |
| .js | source | 3 | 49528 | 39079 | 12113 | — |
| .ts | source | 53 | 28297 | 16804 | 10722 | — |
| .tsx | source | 15 | 8375 | 6022 | 2350 | — |
| .ts | test | 80 | 18524 | 13373 | 3842 | — |

</details>

**活跃度**

[![Issue 未关闭 53](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=53&color=737b86&logo=github)](https://github.com/XDTrees/dsh-xdpool/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多账号池能否在可解释失败/费用边界内提高任务可用性，凭据和后台副作用是否可控？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要XD Pool，比单账号连接多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

拥有多个自己可合法使用的模型账号/额度、希望在DSH少手工换号的人，是直接对象。单账号连接或手动选provider在额度/限流失败时需要人工切换；XD Pool把本机WorkBuddy凭据发现、持久账号池、冷却/配额选择和OpenAI兼容shim接入DSH provider，也扩展渠道聚合、链路、网关及用量页面。合格结果是相同任务在明确账号和成本下完成、失败不误报、凭据和输出仍可控，不是“免费渠道数”大。

固定包2.4.6原生导出host/client，adapter创建provider模型目录并声明宿主retryPolicy；模型、账号额度、厂商接口以及第三方channel pack仍是外部供给。本插件的增量在多账号默认、故障分类/选择和DSH接线，不把厂商模型质量或作者76家/13家数量算原创或实测覆盖。

只用单账号、重视稳定官方API或不愿本地持久集中凭据者，单连接更少维护。README旧包下载量是带日期快照，不代表当前活跃用户或生产成功，本轮不据此提高采用判断。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-35](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/README.md#L11-L35)

作者定位、数量与旧包下载边界。

<details>
<summary>查看原文（25行）</summary>

```text
  <sub>下载量统计沿用旧包名 <code>dsh-workbuddy-xdpool</code>（截至 2026-10-12 为 8,976 次/月，改名前的全部下载；shields 的实时徽章常被 npm 上游限流，所以这里用了快照数字）。新包 <code>dsh-xdpool</code> 的统计会随时间累积，之后徽章会换回实时数据。</sub>
</p>

[English](./README.en.md) | 中文

**把你手上所有能白嫖的模型额度，接进 DSH 的同一个模型池。**

它从一件事开始——把本机 WorkBuddy 桌面 App 里登录过的**所有账号**合成一个自动容错的池子，哪个号被限流了、积分用光了，请求自动换到下一个能用的号上去。你不用挑号，不用手动导入。

然后它长成了七页：账号池之外，还能扫码登录十三家厂商的免费模型、把 **76 家**厂商的免费额度聚合成一条通道、看用量账本、把几个模型串成链、把池子开成一个本地 OpenAI 兼容网关。

| 页面 | 干什么 |
| --- | --- |
| **账号池** | 本机 WorkBuddy 账号、池健康、实时用量、积分自动化 |
| **扫码登录** | 十三家支持网页 / 扫码登录的厂商，登一次，它们的免费模型就进选择器 |
| **聚合渠道** | 76 家厂商的免费额度接进同一个池（默认一家都不开，填了 key 才亮） |
| **数据看板** | 今天的轮次、调用、失败、换号救回、token、缓存命中、速度 |
| **billion-context** | 只读观测本机 billion-context 压缩器的运行状态 |
| **路由** | 把多个模型串成一条链，按顺序或轮换使用 |
| **网关** | 把池子开成本地 OpenAI 兼容接口，可转发给局域网其它设备 |

**另外附送一整套「积分自动化」**：签到、领任务奖励、连登兑换、开猫猫旅行……这些每天都要手动点一遍的活儿，插件在后台替你干完了。

> **和单账号连接插件的区别**：`dsh-workbuddy-connect` 那类插件是「一次一个账号」。XD Pool 把**多账号当默认情况**——不挑号、不手动导入，你在桌面 App 换登过的每个号都被池记下并跨重启保存，对外用一个 `xdpool` provider 分组，池内自动容错。

```

</details>

**依据 2 · 源码核查**：[package.json:2-6](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/package.json#L2-L6)

实际名称/版本与用途。

```text
  "name": "dsh-xdpool",
  "displayName": "DSH XD Pool",
  "description": "One DSH model pool for every free quota you have: merge all locally signed-in WorkBuddy accounts with auto-failover, sign in to 13 vendors by QR/web, aggregate 76 vendors' free tiers, plus a usage dashboard, model routing, a local OpenAI-compatible gateway and a points-automation suite.",
  "version": "2.4.6",
  "license": "MIT",
```

**依据 3 · 源码核查**：[src/adapter.ts:390-411](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/adapter.ts#L390-L411)

provider模型构造及宿主重试策略。

<details>
<summary>查看原文（22行）</summary>

```text
              : { auth: { apiKey }, source: 'XD Pool' }
          },
        },
      },
      models: buildModels(),
      api: openAICompletionsApi(),
    })
    // `getModels` is re-pointed at the live builder so a consumer that holds
    // this object and asks it directly (rather than going through the host
    // registry) still sees the current catalog.
    return { ...base, getModels: () => buildModels() }
  }
  const makeProfile = (piProvider: Provider): ResolvedPiAiProviderProfile => ({
    provider: providerId,
    displayName,
    streamIdleTimeoutMs: WORKBUDDY_STREAM_IDLE_TIMEOUT_MS,
    retryPolicy: resolveRetryPolicy(undefined, 'dsh-xdpool retryPolicy'),
    configuredMaxTokens: new Map(),
    // Required by dsh-llm-pi-ai >= 0.1.5-rc.2: the host adapter reads
    // profile.modelErrors.get(model) on every model resolution. The catalog
    // comes from the live upstream, so there are no pre-known failures — an
    // empty map means "no model is pre-rejected".
```

</details>

#### 缺口

- 没有独立账号/渠道实际可用性和同任务成本对照。
  **影响**：无法证明厂商列表或额度标签转成稳定生产收益。
  **进一步探讨**：用受控账号比较单连接/池的完成率、真实费用、失败与人工切换。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 账号选择、拒绝换号与流失败如何处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

账号扫描把本机发现与已存账号合并，保留跨重启已见身份。acquire过滤可用账号，支持priority、round-robin、balanced、sticky和expiry，默认priority；sticky按conversationKey绑定，账号冷却/凭据失效仍可换号，不是永久同账号保证。对话键来自请求而非用户身份授权，粘性也不保证上游实际KV缓存命中。

shim对每次用户请求生成turnId，使轮转尝试归在同一轮。client.chatStream拒绝时按类别处理：session_dead刷新，刷新无变化则标失效；hard_credit冷却整账号；soft_rate冷却该模型该账号；其他错误停止该请求。额度保护依赖上游余额读数与异步刷新，不能据reserve配置保证绝不花过某个实时余额。

result.ok即交serveSuccessfulStream并return，不回账号重试循环。成功流透传SSE，缺DONE或中途error记失败；error可结束输出并补DONE，避免悬挂，但不会自动重新生成接在原答案后。因此“自动容错”主要是打开流前的拒绝分类，不是任意中断无损续接，也不能保证部分工具调用和任务外部副作用没有发生。用户遇部分结果应核宿主已做工作，再决定重试。

字节转发与一次usage记录能降低编码破坏和重复计数，但调用统计仍不是最终任务验收。流结束标记只能说明传输观察，不证明内容/工具工作正确。

#### 证据与依据

**依据 1 · 源码核查**：[src/accounts.ts:1022-1022](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/accounts.ts#L1022-L1022)

加载已存账号。

```text
      const stored = await loadStoredAccounts(this.storePath)
```

**依据 2 · 源码核查**：[src/accounts.ts:1110-1117](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/accounts.ts#L1110-L1117)

扫描后持久保存。

```text
    // so the write cost is negligible next to the at-rest key spawns a scan
    // already pays.
    if (this.persistent) {
      try {
        await saveStoredAccounts(this.storePath, this.accounts)
      } catch (error: unknown) {
        this.logger?.warn?.('dsh-xdpool: could not persist the account store', error)
      }
```

**依据 3 · 源码核查**：[src/accounts.ts:1412-1447](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/accounts.ts#L1412-L1447)

pin/sticky选择、分布和凭据更新。

<details>
<summary>查看原文（36行）</summary>

```text
      // is not enough now that priority mode draws by weight: the user asked for
      // one account, so the draw should not be able to pick another.
      if (this.preferredAccountId !== undefined) {
        const preferred = pool.find(account => account.id === this.preferredAccountId)
        if (preferred !== undefined && await this.ensureFresh(preferred)) return preferred
      }

      if (this.distribution === 'sticky') {
        const bound = this.affinityAccount(pool, conversationKey)
        if (bound !== undefined && await this.ensureFresh(bound)) return bound
      }

      // `priority` keeps the original behaviour: the head of the ordered list
      // answers until it is limited, which is what a pool of your own accounts is
      // for. `round-robin` walks the cursor, and so does a NEW `sticky`
      // conversation, which is what makes consecutive new chats land on
      // consecutive accounts. `balanced` draws by weight so a quiet pool spreads
      // across accounts instead of draining the first one. `expiry` spends the
      // packs that are about to die before they do.
      const account = this.distribution === 'round-robin' || this.distribution === 'sticky'
        ? this.pickRoundRobin(pool)
        : this.distribution === 'balanced'
          ? this.pickByWeight(pool)
          : this.distribution === 'expiry'
            ? this.pickByExpiry(pool)
            : pool[0]
      // Serving is recorded by noteServed once the upstream answers 200, not
      // here: picking only says which account is being tried, and the shim may
      // still rotate before the request succeeds.
      if (account === undefined) return undefined
      const healthy = await this.ensureFresh(account)
      if (!healthy) continue
      if (this.distribution === 'sticky' && conversationKey !== undefined && conversationKey !== '') {
        this.bindAffinity(conversationKey, account.id)
      }
      return account
```

</details>

**依据 4 · 源码核查**：[src/index.ts:548-551](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/index.ts#L548-L551)

默认priority、禁用账号及reserve配置。

```text
  cooldownMs: asVolatile(z.number().step(1).min(1000).default(60000).description('Rate-limit cooldown per account, in milliseconds')),
  distribution: asVolatile(z.union(['priority', 'round-robin', 'balanced', 'sticky', 'expiry']).default('priority').description('How requests are spread: priority (drain one), round-robin (in order), balanced (idle-weighted random), sticky (one account per conversation, new conversations rotate), or expiry (spend the account whose credit packs expire soonest)')),
  disabledAccountIds: asVolatile(z.array(z.string()).default([]).description('Account ids excluded from the pool (empty = every discovered account participates)')),
  creditReserves: asVolatile(z.dict(z.number().step(1).min(0)).default({}).description('Per-account credit floor: stop using an account once its balance reaches this value')),
```

**依据 5 · 源码核查**：[src/shim.ts:1255-1267](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/shim.ts#L1255-L1267)

单turnId与有限attempt循环。

<details>
<summary>查看原文（13行）</summary>

```text
    const tried: string[] = []
    let last: { kind: UpstreamErrorKind; status: number; message: string } | undefined
    // One identity per user request, minted once, so every account the pool
    // rotates through - and the compaction retry below - file under the SAME
    // turn. Counting those separately would overstate how much the user asked
    // for, which is the one number a usage panel must never inflate.
    const turnId = randomBytes(8).toString('hex')
    const usageContext: UsageContext | undefined = usageRecorder === undefined
      ? undefined
      : { recorder: usageRecorder, region: region ?? 'cn', model: modelId ?? '(none)', turnId }
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      if (controller.signal.aborted) return
      const account = await pool.acquire(modelId, region, conversationKey)
```

</details>

**依据 6 · 源码核查**：[src/shim.ts:1342-1349](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/shim.ts#L1342-L1349)

上游接受后交stream并return。

```text
      tried.push(account.label)
      const result = await client.chatStream(account.credential, prepared, controller.signal, conversationKey)
      if (result.ok) {
        // Success is filed by the stream forwarder, the only place that knows
        // when the stream really ended and what it cost.
        await serveSuccessfulStream(res, account, result, logger, refreshBalance, pool, usageContext)
        return
      }
```

**依据 7 · 源码核查**：[src/shim.ts:1370-1418](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/shim.ts#L1370-L1418)

失效/额度/限流分类。

<details>
<summary>查看原文（49行）</summary>

```text
      if (result.kind === 'session_dead') {
        logger?.warn(`dsh-xdpool: ${account.label} session dead; refreshing token and retrying`)
        const before = account.credential.accessToken
        const recovered = await pool.refreshAccount(account.id, { force: true })
        // A 401 on a token the upstream still hands out refresh credentials for
        // is only "maybe stale". Once the refresh comes back with the SAME token
        // (or fails outright) there is nothing left to try: treat it as dead so
        // the retry budget goes to the other accounts instead of this one.
        if (!recovered || account.credential.accessToken === before) {
          pool.penalizeCredentialDead(account.id)
          logger?.warn(
            `dsh-xdpool: ${account.label} sign-in is no longer valid `
              + `(attempt ${attempt + 1}/${maxAttempts}); rotating`,
          )
        }
        continue
      }
      // Credit exhaustion is an ACCOUNT condition, not a model one: every model on
      // that account is dead until its quota resets, so cool the whole account and
      // rotate. Failing the request here would waste the other healthy accounts.
      if (result.kind === 'hard_credit') {
        pool.penalizeExhausted(account.id)
        logger?.warn(
          `dsh-xdpool: ${account.label} has no credits left `
            + `(attempt ${attempt + 1}/${maxAttempts}); rotating`,
        )
        continue
      }
      // A `client` failure (HTTP 400) names no parameter when the upstream
      // leaves `extError.param` empty, which is the usual case — the user then
      // gets "the request parameters do not meet the current model requirements"
      // and nothing else. Log the SHAPE of what we sent (keys and counts only,
      // never message content) so the next occurrence is diagnosable from the
      // log instead of requiring a reproduction.
      if (result.kind === 'client') {
        logger?.warn(
          `dsh-xdpool: ${account.label} rejected the request as invalid `
          + `(model ${modelId ?? '(none)'}) — ${requestShape(raw)}; upstream: ${result.message.slice(0, 300)}`,
        )
      }
      // Other failures are terminal for this request.
      if (result.kind !== 'soft_rate') break
      // Cool only this model on this account; the account's other models stay
      // usable (the upstream explicitly allows switching to another model).
      pool.penalize(account.id, parseRateLimitReset(result.message), modelId)
      logger?.warn(
        `dsh-xdpool: ${account.label} rate-limited on ${modelId ?? '(no model)'} ` +
          `(attempt ${attempt + 1}/${maxAttempts}); rotating`,
      )
```

</details>

**依据 8 · 源码核查**：[src/shim.ts:1563-1583](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/shim.ts#L1563-L1583)

异步余额与stream记账边界。

<details>
<summary>查看原文（21行）</summary>

```text
  pool.noteServed(account.id)
  // Refresh the balance in the background so the reserved-credit floor has a
  // fresh reading. Deliberately NOT awaited: the response is already ready and
  // a balance lookup must never delay the user's stream.
  void refreshBalance(account)
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  })
  const tracker = new StreamTracker(Date.now())
  let recorded = false
  /**
   * File this call exactly once.
   *
   * Reached from the filter's flush AND from the upstream error handler, and an
   * upstream stream that dies mid-flight can reach both, so the flag is what
   * keeps one physical call from being counted twice. A stream that broke is
   * recorded as failed: the host got a 200 and then an answer that stops
   * halfway, which is a failed turn from the user's side of the wire.
```

</details>

**依据 9 · 源码核查**：[src/shim.ts:1636-1655](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/shim.ts#L1636-L1655)

无DONE及流error记录failed，补结束标记不轮转。

<details>
<summary>查看原文（20行）</summary>

```text
    flush(done: (error?: Error | null) => void): void {
      // A trailing fragment with no blank line is still the user's text, and the
      // host reads end-of-stream as the end of the answer. Dropping it would
      // silently truncate the last words of every reply.
      if (pending.length > 0) this.push(pending)
      tracker.finish(Date.now())
      finish(sawDone)
      done()
    },
  })
  const body = Readable.fromWeb(result.response.body as Parameters<typeof Readable.fromWeb>[0])
  body.on('data', (chunk: Buffer) => {
    if (chunk.includes('[DONE]')) sawDone = true
  })
  body.on('error', (error: unknown) => {
    logger?.warn('dsh-xdpool: upstream stream failed mid-flight', error)
    finish(false)
    if (!sawDone && res.writable) res.end('data: [DONE]\n\n')
  })
  body.pipe(strip).pipe(res)
```

</details>

#### 缺口

- 真实限流、部分流和工具副作用的宿主处理未验证。
  **影响**：不能把重试接线称无损完成或不会重复操作。
  **进一步探讨**：模拟受控拒绝/半流/断连，核尝试账号、部分输出、已执行工具与最终任务结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 链、上下文恢复、凭据和后台动作改变什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

组合链把显式模型ID按策略串联，链成员不再指向combo以避免递归；pool成员在链中只尝试一个账号，避免嵌套耗尽预算。切模型改变质量/上下文/费用和数据到达方，不是同模型换号等价。目录missing会报告，不能把可选列表当全部渠道已授权可用。

除只读观察billion-context状态页外，shim自身有context-overrun内层恢复：按估计失败prompt大小与目录窗口算更小budget，调用可用账号模型摘要，随后必要时hardTruncate，再重试。摘要失败仍可截断，可能丢历史约束；这是额外模型调用及语义变化，不是无成本透明修复，也不证明估计budget真的满足上游窗口。本轮未执行该路径，不能转述注释中的旧真机问题为当前复现。

持久账号列表直接把credential对象JSON.stringify后tmp+rename，类型包括accessToken和refreshToken；写入未指定应用层加密或0600模式。这说明有额外可读取凭据副本，实际文件权限取决于目录、umask和系统，不能无依据称任何人都能读。清除上游登录不必然删除插件存档，退出需核实际文件与会话撤销。

网关默认loopback地址可选0.0.0.0，独立relay key常数时间比较，转发去掉客户端authorization/x-api-key换shim secret，限制path并有loop标记。监听由node:http.createServer实现，源码这层不是TLS；跨LAN时需另核传输和持key客户端权力，不能把一个共享key当逐用户配额/身份。

积分功能有真实签到、任务报名领取与兑换等上游写动作。README写默认全自动，但当前automationSchema enabled=false，automationOptions只接受明确true，bundle无覆盖开启；当前源码默认应按关闭理解，已有配置另看。手动startRunAll也会发起整轮，而非只读预览。

#### 证据与依据

**依据 1 · 源码核查**：[src/combos.ts:205-218](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/combos.ts#L205-L218)

禁止combo递归与成员解析。

<details>
<summary>查看原文（14行）</summary>

```text
/**
 * Classify one member id against both catalogs.
 *
 * `combo:` ids are rejected outright: a chain pointing at another chain would
 * make the router depend on its own output, and the round-robin cursor would
 * then advance twice per turn.
 */
export function resolveComboMember(modelId: string, sources: ComboSources): ComboMember | undefined {
  const id = text(modelId)
  if (id === '' || isComboId(id)) return undefined
  const aggregateRow = sources.aggregate.find(row => row.id === id)
  if (aggregateRow !== undefined) {
    const parsed = parseProviderModelId(id)
    return {
```

</details>

**依据 2 · 源码核查**：[src/shim.ts:1015-1029](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/shim.ts#L1015-L1029)

chain pool成员仅一个账号一次尝试。

<details>
<summary>查看原文（15行）</summary>

```text
        // Pool member: one account, one attempt. Account rotation inside a chain
        // member would double the attempts and could consume the whole budget on
        // one member, which defeats the chain's reason to exist.
        const account = await pool.acquire(member.modelId, region)
        if (account === undefined) {
          const why = pool.unavailableReason(member.modelId, region)
          last = {
            kind: why.reason,
            status: why.reason === 'cooling' ? 429 : 401,
            message: `member ${member.modelId} has no usable WorkBuddy account (${why.reason})`,
          }
          continue
        }
        // Region-aware normalisation: a chain member belongs to this shim's
        // region, so the two region-only rules (leading system on global, the
```

</details>

**依据 3 · 源码核查**：[src/shim.ts:1715-1726](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/shim.ts#L1715-L1726)

按失败prompt和目录算压缩预算。

<details>
<summary>查看原文（12行）</summary>

```text
  const realWindow = options.contextWindow
  const fromWindow = realWindow !== undefined && realWindow > 0
    ? Math.max(512, Math.floor(realWindow * 0.8) - 2048)
    : Number.POSITIVE_INFINITY
  // Half the failing prompt: its size is known to be too big, so halving it both
  // guarantees real shrinkage and leaves headroom for the answer.
  const fromOverrun = Math.max(512, Math.floor(overrunTokens / 2))
  const budget = Math.min(fromWindow, fromOverrun)
  logger?.warn(
    `dsh-xdpool: context overrun on ${modelId ?? '(no model)'} `
      + `(~${overrunTokens} tokens, catalog window ${realWindow ?? 'unknown'}); `
      + `compacting to ~${budget} and retrying once`,
```

</details>

**依据 4 · 源码核查**：[src/shim.ts:1731-1771](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/shim.ts#L1731-L1771)

模型摘要、硬截断与重试体。

<details>
<summary>查看原文（41行）</summary>

```text
  try {
    const summariser = await pool.acquire(modelId, region)
    if (summariser === undefined) {
      compactionDetail = 'no account available to summarise with'
    } else {
      const outcome = await compactWithSummary(
        messages,
        { budget, keepRecent: 6 },
        {
          complete: async (request, signal) => {
            const body = client.buildChatBody(
              { ...parsed, stream: true, max_tokens: Math.max(256, Math.floor(budget / 2)) },
              request,
              region ?? 'cn',
            )
            return await client.completeChat(
              summariser.credential,
              body,
              signal ?? controller.signal,
              conversationKeyOf(raw),
            )
          },
        },
        controller.signal,
      )
      compacted = outcome.messages
      summary = outcome.summary
      if (outcome.skipped !== undefined) compactionDetail = outcome.skipped
    }
  } catch (error: unknown) {
    // Summarisation is best-effort; fall through to truncation.
    compactionDetail = `summarisation failed: ${String(error)}`
  }
  // Whatever the summariser managed, make sure the prompt now fits.
  if (estimateMessagesTokens(compacted) > budget) {
    compacted = hardTruncate(compacted, budget).messages
  }
  if (summary === undefined && estimateMessagesTokens(compacted) >= overrunTokens) {
    return { ok: false, detail: compactionDetail === '' ? 'compaction could not reduce the prompt' : compactionDetail }
  }
  const retryBody = client.buildChatBody(parsed, compacted, region ?? 'cn')
```

</details>

**依据 5 · 源码核查**：[src/accounts.ts:60-64](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/accounts.ts#L60-L64)

凭据含access/refresh token。

```text
export interface WorkBuddyCredential {
  accessToken: string
  refreshToken: string
  expiresAtMs: number
  refreshExpiresAtMs?: number
```

**依据 6 · 源码核查**：[src/account-store.ts:107-119](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/account-store.ts#L107-L119)

完整credential JSON持久写入，未指定加密或mode。

<details>
<summary>查看原文（13行）</summary>

```text
export async function saveStoredAccounts(path: string, accounts: readonly WorkBuddyAccount[]): Promise<void> {
  const stored: StoredAccount[] = accounts.map(account => ({
    id: account.id,
    label: account.label,
    credential: account.credential,
    savedAtMs: Date.now(),
  }))
  const document = JSON.stringify({ version: 1, accounts: stored }, null, 2) + '\n'
  await mkdir(join(path, '..'), { recursive: true })
  const tmp = `${path}.tmp`
  await writeFile(tmp, document, 'utf8')
  await rename(tmp, path)
}
```

</details>

**依据 7 · 源码核查**：[src/relay.ts:55-64](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/relay.ts#L55-L64)

loopback默认与可选所有接口。

<details>
<summary>查看原文（10行）</summary>

```text
/** Default LAN port. Loopback by default; see {@link RELAY_HOSTS}. */
export const RELAY_DEFAULT_PORT = 8326
/**
 * Bind addresses the user may choose.
 *
 * `127.0.0.1` means "no off-box client can reach this at all", and it is the
 * default: listening on every interface is a decision to make on purpose, not a
 * side effect of a feature existing.
 */
export const RELAY_HOSTS: readonly string[] = ['127.0.0.1', '0.0.0.0']
```

</details>

**依据 8 · 源码核查**：[src/relay.ts:134-140](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/relay.ts#L134-L140)

key比较。

```text
/** Constant-time key comparison that tolerates a missing or wrong-length key. */
function keyMatches(presented: string, expected: string): boolean {
  if (expected === '') return false
  const a = Buffer.from(presented, 'utf8')
  const b = Buffer.from(expected, 'utf8')
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
```

**依据 9 · 源码核查**：[src/relay.ts:178-188](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/relay.ts#L178-L188)

独立密钥不向上游透传。

<details>
<summary>查看原文（11行）</summary>

```text
function upstreamHeaders(req: IncomingMessage, shimToken: string): IncomingHttpHeaders {
  const headers: IncomingHttpHeaders = {}
  for (const [name, value] of Object.entries(req.headers)) {
    const lower = name.toLowerCase()
    if (HOP_BY_HOP.has(lower)) continue
    if (lower === 'host' || lower === 'authorization' || lower === 'x-api-key') continue
    if (lower === RELAY_HOP_HEADER) continue
    if (value !== undefined) headers[lower] = value
  }
  headers.authorization = `Bearer ${shimToken}`
  headers[RELAY_HOP_HEADER] = '1'
```

</details>

**依据 10 · 源码核查**：[src/relay.ts:239-241](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/relay.ts#L239-L241)

HTTP server创建。

```text
  const start = (host: string, port: number): Promise<void> =>
    new Promise<void>(resolve => {
      const next = createServer(handle)
```

**依据 11 · 源码核查**：[src/index.ts:427-435](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/index.ts#L427-L435)

只有明确enabled true才启用积分。

```text
export function automationOptions(automation: AutomationConfig | undefined): AutomationOptions {
  return {
    enabled: automation?.enabled === true,
    ...automation?.checkinHours === undefined ? {} : { checkinHours: automation.checkinHours },
    ...automation?.reportHours === undefined ? {} : { reportHours: automation.reportHours },
    ...automation?.taskHours === undefined ? {} : { taskHours: automation.taskHours },
    ...automation?.streakHours === undefined ? {} : { streakHours: automation.streakHours },
    ...automation?.travelHours === undefined ? {} : { travelHours: automation.travelHours },
    ...automation?.compensationHours === undefined ? {} : { compensationHours: automation.compensationHours },
```

**依据 12 · 源码核查**：[src/index.ts:515-522](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/index.ts#L515-L522)

当前积分默认关闭及各写任务。

```text
const automationSchema = z.object({
  enabled: z.boolean().default(false).description('Run the daily points automation'),
  checkinHours: z.array(z.number().step(1).min(0).max(23)).description('Local hours for the daily check-in'),
  reportHours: z.array(z.number().step(1).min(0).max(23)).description('Local hours for the activity report (runs before tasks)'),
  taskHours: z.array(z.number().step(1).min(0).max(23)).description('Local hours for task enrolment and claiming'),
  streakHours: z.array(z.number().step(1).min(0).max(23)).description('Local hours for streak redemption'),
  travelHours: z.array(z.number().step(1).min(0).max(23)).description('Local hours for the buddy travel loop'),
  compensationHours: z.array(z.number().step(1).min(0).max(23)).description('Local hours for the outage-compensation claim'),
```

**依据 13 · 源码核查**：[cordis.patch.yml:1-6](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/cordis.patch.yml#L1-L6)

默认只插provider，无积分开启覆盖。

```text
# Register the XD Pool provider. Discovery is read-only: the plugin reuses the
# WorkBuddy desktop app's own sign-in files and never starts a separate OAuth
# flow. Requests rotate across every discovered account.
- insert:
    - id: llm-xdpool
      name: dsh-xdpool
```

**依据 14 · 源码核查**：[src/scheduler.ts:735-746](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/scheduler.ts#L735-L746)

手工runall发起整轮异步执行。

<details>
<summary>查看原文（12行）</summary>

```text
  startRunAll(): boolean {
    if (this.runInFlight) return false
    this.runInFlight = true
    void this.runAll()
      .catch((error: unknown) => {
        this.logger.warn?.('dsh-xdpool automation run failed:', error)
      })
      .finally(() => { this.runInFlight = false })
    return true
  }

  async runAll(): Promise<AutomationRunSummary> {
```

</details>

#### 缺口

- 所有登录/厂商lane、积分上游写入、存档权限、LAN与内层摘要效果未完整验证。
  **影响**：不能据多渠道/容错宣称全局授权、安全或免费可靠。
  **进一步探讨**：只用自有测试账号逐项验证，核配置与存档权限；默认不启网关/积分，独立测摘要损失和LAN。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖和实际使用怎样闭环？

**研究主题**：依赖、兼容与流程

#### 完整回答

Node要求^22.19.0或>=24、DSH>=0.1.5-rc.1<0.3.0是安装声明。可用WorkBuddy凭据、相应登录应用/解密条件、上游网络和接口才是主池实际门槛；本轮未读取本机真实凭据、登录或请求上游。聚合渠道的API key/登录授权和channel pack需各自配置，不能把主池成功迁移到每个厂商lane。

| 条件 | 用途与门槛 | 失败边界 |
|---|---|---|
| DSH provider/client与Node | 模型目录、Web设置与shim | 安装声明不证明当前宿主工具流兼容 |
| 自有登录及凭据存档 | 自动发现、更新、多账号选择 | 失效、加密不可读或误加入旧账号要可见 |
| 上游模型/额度/网络 | 实际推理服务 | 免费/折扣标签不是当前价格或可用承诺 |
| 聚合/登录/链 | 独立授权与目录 | 模型切换要核数据方、参数和费用 |
| 网关/积分可选功能 | 共享key监听、上游积分写动作 | 必须单独确认配置与结果，不随主池一起验收 |

| 步骤/执行者 | 合格结果 | 失败动作 |
|---|---|---|
| 用户盘点自有账号与文件 | 名单/禁用项/存档权限明确 | 未授权身份排除，先备份设置 |
| 用户单账号基线 | 同任务调用、费用和工具结果可核 | 先修单连接，不用池隐藏基础错误 |
| 用户启主池并低量试 | 冷却、换号和实际完成可追踪 | 半流先核副作用，勿盲重试 |
| 用户另试sticky/链 | 路由、质量与缓存/费用符合预期 | 质量下降回单模型固定账号 |
| 用户独立决定副功能 | 网关客户端和积分动作授权明确 | 默认保持关闭，不以主池成功放行 |
| 用户退出 | 停监听/调度并核存档与token | 不只删UI，要核凭据副本和上游撤销 |

bundle明确不自动挂载billion-context，作者旧问题说明只作背景；主池源码的内层上下文恢复仍存在，两者不能混为一个开关。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:25-32](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/package.json#L25-L32)

Node/DSH声明和分发入口。

```text
  "type": "module",
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.1.5-rc.1 <0.3.0"
  },
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "bin": {
```

**依据 2 · 源码核查**：[src/accounts.ts:180-195](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/accounts.ts#L180-L195)

加密凭据无法取得key时明确报依赖。

<details>
<summary>查看原文（16行）</summary>

```text
 * Marker for "the credential is encrypted and we could not obtain the key".
 *
 * Carried as a `code` rather than left to `instanceof` because the value crosses
 * the packaged-plugin boundary; the same convention the sibling error types use.
 * This is deliberately NOT "not signed in": the user IS signed in, and telling
 * them to sign in again sends them to the one action that cannot help.
 */
export const ENCRYPTED_CREDENTIAL_CODE = 'ENCRYPTED_CREDENTIAL'

export class WorkBuddyEncryptedCredentialError extends Error {
  readonly code = ENCRYPTED_CREDENTIAL_CODE
  constructor(sourcePath: string) {
    super(
      `workbuddy: ${sourcePath} holds encrypted credentials, but no WorkBuddy desktop app could be located to provide the key.`
        + ' If the app IS installed, it is simply outside the paths this plugin probes — set '
        + 'WORKBUDDY_APP_EXECUTABLE to its full .exe path (then restart DSH) and the credential will open.'
```

</details>

**依据 3 · 源码核查**：[src/index.ts:548-551](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/index.ts#L548-L551)

账号选择和排除配置。

```text
  cooldownMs: asVolatile(z.number().step(1).min(1000).default(60000).description('Rate-limit cooldown per account, in milliseconds')),
  distribution: asVolatile(z.union(['priority', 'round-robin', 'balanced', 'sticky', 'expiry']).default('priority').description('How requests are spread: priority (drain one), round-robin (in order), balanced (idle-weighted random), sticky (one account per conversation, new conversations rotate), or expiry (spend the account whose credit packs expire soonest)')),
  disabledAccountIds: asVolatile(z.array(z.string()).default([]).description('Account ids excluded from the pool (empty = every discovered account participates)')),
  creditReserves: asVolatile(z.dict(z.number().step(1).min(0)).default({}).description('Per-account credit floor: stop using an account once its balance reaches this value')),
```

**依据 4 · 源码核查**：[src/relay.ts:267-294](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/relay.ts#L267-L294)

网关关闭、key和path门禁。

<details>
<summary>查看原文（28行）</summary>

```text
  function handle(req: IncomingMessage, res: ServerResponse): void {
    const settings = settingsOf()
    // The loop marker is refused before the switch is even consulted. A relay
    // that has been pointed at its own address would otherwise answer its own
    // "you are switched off" 503 in a loop; refusing the hop unconditionally is
    // what makes a misconfiguration diagnosable instead of a request storm.
    if (req.headers[RELAY_HOP_HEADER] !== undefined) {
      writeJson(res, 508, 'relay_loop', 'this request already came through the relay')
      return
    }
    // Switch before key: a disabled relay holds no listener, so this only fires
    // for a request already in flight when the user turned it off — and there,
    // 503 says "off" where a 401 would tell the client its key is stale and
    // prompt for one that would not help.
    if (!settings.enabled) {
      writeJson(res, 503, 'relay_disabled', 'the XD Pool LAN relay is switched off')
      return
    }
    if (!keyMatches(bearerOf(req), settings.key)) {
      writeJson(res, 401, 'relay_unauthorized', 'a valid XD Pool relay key is required')
      return
    }
    const path = (req.url ?? '').split('?')[0] ?? ''
    if (!RELAY_FORWARDED_PATHS.has(path)) {
      writeJson(res, 404, 'relay_no_route', `${path} is not a path this relay forwards`)
      return
    }
    const target = new URL(`${shim.baseUrl()}${path}`)
```

</details>

**依据 5 · 作者声明**：[cordis.patch.yml:40-48](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/cordis.patch.yml#L40-L48)

作者说明不自动挂载billion-context。

```text
# as a bug. Installing billion-context remains a decision the user makes; the
# pool no longer makes it for them.
#
# `src/billion-mount.ts` no longer calls `create()` for the same reason: with
# this row disabled, a runtime create would fight the very row it sits beside.
# The function still runs — it is what lets the card distinguish
# already-installed from not-installed — it just never mounts anything.
- id: billion-context-xdpool
  disabled: true
```

#### 缺口

- 安装包对应、当前厂商额度/接口、目标宿主与本机权限未知。
  **影响**：不能用列表/元数据给兼容或费用保证。
  **进一步探讨**：固定制品和环境按表验收，记录实际路由、额度、账单和退出残留。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 全周期成本与效果有什么依据？

**研究主题**：效果与总成本

#### 完整回答

#### 成本

| 阶段 | 成本来源 | 当前边界 |
|---|---|---|
| 启用 | 账号授权、凭据读取/存档、禁用旧身份与目录核验 | 账号多不等于可用额度多 |
| 日常 | 上游推理、失败尝试、换号缓存、链路质量和网络 | 免费/折扣标签未核当前账单 |
| 恢复 | token刷新、冷却、内层摘要/截断再试、部分流人工核对 | 避免失败可能增加费用或丢约束 |
| 核对 | 真实完成、账号/数据去向、reserve与统计差异 | 调用成功不等于任务成功 |
| 维护 | 厂商认证/API漂移、目录/价格、集中凭据和插件升级 | 76家列表不是76家已持续维护成功 |
| 退出/可选功能 | 停HTTP网关/积分、撤销会话并清理存档 | 删除插件不自动证明token撤销 |

#### 效果

| 效果 | 当前支持 | 尚未确定 |
|---|---|---|
| 拒绝容错 | 明确错误类别、冷却/刷新和换账号 | 实际救回率和新增延迟 |
| 流传递 | 字节转发、失败记账与结束处理 | 部分答案/工具整体正确性 |
| 统一路由 | 账号策略、模型链、聚合目录 | 质量、缓存和净费用改善 |
| 可观测性 | 单turnId归多尝试、token/速度等记录 | 上游全部计费、摘要调用归账和业务完成率 |

以完成同一任务的总调用、实付费用、缓存、错误/返工和人工切换衡量。当前只审记账关键路径，没有完整核所有lane和摘要调用的账本覆盖，不能把看板token或“救回”数当完整账单。

#### 证据与依据

**依据 1 · 源码核查**：[src/shim.ts:1255-1267](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/shim.ts#L1255-L1267)

多尝试归一个turnId。

<details>
<summary>查看原文（13行）</summary>

```text
    const tried: string[] = []
    let last: { kind: UpstreamErrorKind; status: number; message: string } | undefined
    // One identity per user request, minted once, so every account the pool
    // rotates through - and the compaction retry below - file under the SAME
    // turn. Counting those separately would overstate how much the user asked
    // for, which is the one number a usage panel must never inflate.
    const turnId = randomBytes(8).toString('hex')
    const usageContext: UsageContext | undefined = usageRecorder === undefined
      ? undefined
      : { recorder: usageRecorder, region: region ?? 'cn', model: modelId ?? '(none)', turnId }
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      if (controller.signal.aborted) return
      const account = await pool.acquire(modelId, region, conversationKey)
```

</details>

**依据 2 · 源码核查**：[src/shim.ts:1585-1599](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/shim.ts#L1585-L1599)

stream usage字段与一次记录。

<details>
<summary>查看原文（15行）</summary>

```text
  const finish = (ok: boolean): void => {
    if (recorded) return
    recorded = true
    if (usage?.recorder === undefined) return
    usage.recorder.record({
      region: usage.region,
      model: usage.model,
      account: account.label,
      turnId: usage.turnId,
      at: Date.now(),
      ok,
      ...(tracker.ttftMs === undefined ? {} : { ttftMs: tracker.ttftMs }),
      ...(tracker.decodeMs === undefined ? {} : { decodeMs: tracker.decodeMs }),
      ...(tracker.usage === undefined ? {} : { usage: tracker.usage }),
    })
```

</details>

**依据 3 · 源码核查**：[src/shim.ts:1736-1766](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/shim.ts#L1736-L1766)

额外摘要和硬截断成本。

<details>
<summary>查看原文（31行）</summary>

```text
      const outcome = await compactWithSummary(
        messages,
        { budget, keepRecent: 6 },
        {
          complete: async (request, signal) => {
            const body = client.buildChatBody(
              { ...parsed, stream: true, max_tokens: Math.max(256, Math.floor(budget / 2)) },
              request,
              region ?? 'cn',
            )
            return await client.completeChat(
              summariser.credential,
              body,
              signal ?? controller.signal,
              conversationKeyOf(raw),
            )
          },
        },
        controller.signal,
      )
      compacted = outcome.messages
      summary = outcome.summary
      if (outcome.skipped !== undefined) compactionDetail = outcome.skipped
    }
  } catch (error: unknown) {
    // Summarisation is best-effort; fall through to truncation.
    compactionDetail = `summarisation failed: ${String(error)}`
  }
  // Whatever the summariser managed, make sure the prompt now fits.
  if (estimateMessagesTokens(compacted) > budget) {
    compacted = hardTruncate(compacted, budget).messages
```

</details>

**依据 4 · 源码核查**：[src/account-store.ts:107-119](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/account-store.ts#L107-L119)

退出时需管理的凭据副本。

<details>
<summary>查看原文（13行）</summary>

```text
export async function saveStoredAccounts(path: string, accounts: readonly WorkBuddyAccount[]): Promise<void> {
  const stored: StoredAccount[] = accounts.map(account => ({
    id: account.id,
    label: account.label,
    credential: account.credential,
    savedAtMs: Date.now(),
  }))
  const document = JSON.stringify({ version: 1, accounts: stored }, null, 2) + '\n'
  await mkdir(join(path, '..'), { recursive: true })
  const tmp = `${path}.tmp`
  await writeFile(tmp, document, 'utf8')
  await rename(tmp, path)
}
```

</details>

#### 缺口

- 无同任务净费用、缓存收益、救回率和账号维护工时对照。
  **影响**：不能证明白嫖、节费或生产可用性提升。
  **进一步探讨**：在授权测试账号上记所有物理调用含摘要、实际账单、延迟、质量和修正，再与单连接比较。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 谁可试用，未来怎样验证生产方向？

**研究主题**：采用判断、新假设与验证

#### 完整回答

有多个自有可用账号、愿意管理凭据且接受上游接口变动的人，可在非敏感小任务先试主池。先固定单账号基线，排除无权使用或陈旧身份，检查存档权限；网关、聚合链和积分保持关闭，分别验收后再决定，不把一次主池请求推为整套能力通过。

保留条件是同任务真实完成更稳定、人工换号更少、总费用和恢复负担可解释。半流/工具状态未知、路由/费用不符、存档暴露或自动动作超意图时停相关功能，回固定账号/官方连接并核已执行工具、凭据副本及上游会话。不要重复请求掩盖未确认的外部副作用。

可检验“请求级可审阅恢复账”假设：把每次账号/模型尝试、流是否已输出、是否摘要/截断及实际费用来源串成记录，对已产生可见输出或工具迹象的请求提示先核状态再重试。相对只看冷却与成功数，可减少误把部分结果当无损救回，代价是日志隐私、统计接线与用户核对负担。

最小验证覆盖429、过期token、半流含工具调用、上下文overrun和跨模型失败，比较错误重试、任务损失、实际费用漏记及恢复时间。若账更复杂却不降误重试或因日志暴露增加风险，应缩小或推翻；当前代码没有完整跨lane的业务结果恢复账。

#### 证据与依据

**依据 1 · 源码核查**：[src/shim.ts:1342-1349](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/shim.ts#L1342-L1349)

接受后直交流转发的恢复边界。

```text
      tried.push(account.label)
      const result = await client.chatStream(account.credential, prepared, controller.signal, conversationKey)
      if (result.ok) {
        // Success is filed by the stream forwarder, the only place that knows
        // when the stream really ended and what it cost.
        await serveSuccessfulStream(res, account, result, logger, refreshBalance, pool, usageContext)
        return
      }
```

**依据 2 · 源码核查**：[src/shim.ts:1636-1655](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/shim.ts#L1636-L1655)

部分流失败与补结束。

<details>
<summary>查看原文（20行）</summary>

```text
    flush(done: (error?: Error | null) => void): void {
      // A trailing fragment with no blank line is still the user's text, and the
      // host reads end-of-stream as the end of the answer. Dropping it would
      // silently truncate the last words of every reply.
      if (pending.length > 0) this.push(pending)
      tracker.finish(Date.now())
      finish(sawDone)
      done()
    },
  })
  const body = Readable.fromWeb(result.response.body as Parameters<typeof Readable.fromWeb>[0])
  body.on('data', (chunk: Buffer) => {
    if (chunk.includes('[DONE]')) sawDone = true
  })
  body.on('error', (error: unknown) => {
    logger?.warn('dsh-xdpool: upstream stream failed mid-flight', error)
    finish(false)
    if (!sawDone && res.writable) res.end('data: [DONE]\n\n')
  })
  body.pipe(strip).pipe(res)
```

</details>

**依据 3 · 源码核查**：[src/shim.ts:1731-1771](https://github.com/XDTrees/dsh-xdpool/blob/b22a3e88a7d4112dd24e25bf0f1d0b719e4e71b9/src/shim.ts#L1731-L1771)

摘要/截断对恢复语义的影响。

<details>
<summary>查看原文（41行）</summary>

```text
  try {
    const summariser = await pool.acquire(modelId, region)
    if (summariser === undefined) {
      compactionDetail = 'no account available to summarise with'
    } else {
      const outcome = await compactWithSummary(
        messages,
        { budget, keepRecent: 6 },
        {
          complete: async (request, signal) => {
            const body = client.buildChatBody(
              { ...parsed, stream: true, max_tokens: Math.max(256, Math.floor(budget / 2)) },
              request,
              region ?? 'cn',
            )
            return await client.completeChat(
              summariser.credential,
              body,
              signal ?? controller.signal,
              conversationKeyOf(raw),
            )
          },
        },
        controller.signal,
      )
      compacted = outcome.messages
      summary = outcome.summary
      if (outcome.skipped !== undefined) compactionDetail = outcome.skipped
    }
  } catch (error: unknown) {
    // Summarisation is best-effort; fall through to truncation.
    compactionDetail = `summarisation failed: ${String(error)}`
  }
  // Whatever the summariser managed, make sure the prompt now fits.
  if (estimateMessagesTokens(compacted) > budget) {
    compacted = hardTruncate(compacted, budget).messages
  }
  if (summary === undefined && estimateMessagesTokens(compacted) >= overrunTokens) {
    return { ok: false, detail: compactionDetail === '' ? 'compaction could not reduce the prompt' : compactionDetail }
  }
  const retryBody = client.buildChatBody(parsed, compacted, region ?? 'cn')
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
