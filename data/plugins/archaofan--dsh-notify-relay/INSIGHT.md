# dsh-notify-relay

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[1e45964](https://github.com/Archaofan/dsh-notify-relay/tree/1e459641202a54f4b2203bfe554ad412bbed8777)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：把 DSH 生命周期事件经过去重、免打扰、摘要和重试规则转发到多种通知服务或 webhook。

> **亮点**：相对单个通知转发器，插件在通道适配器上方增加是否发送、何时聚合与为何抑制的规则和日志，并持久保存失败队列，改变离线关注任务的交接方式。通道投递与客户端呈现仍由外部服务承担，不把发送请求当用户已收到。[Q01](#research-q01)

> **主要限制**：成功回执及重试粒度决定规则是否减少打扰。deliverTo 仅用response.ok判断，未读取服务业务错误；outbox保存整条通知却不保存失败通道集合，drain调用默认channelsFor重发所有匹配通道，部分成功时可能重复推送。网络超时但远端已接受也无幂等回执，不能承诺一次送达。[Q02](#research-q02)

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
  - [Q01 · 什么事件如何经过规则进入外部通道？](#detail-section-11)
  - [Q02 · 持久重试能否避免误报成功和重复通知？](#detail-section-12)
  - [Q03 · 按通道保存回执能否改善通知办结？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向离开 DSH 窗口仍需关注完成、失败和审批的用户，集中管理哪些事件进入个人或团队通知通道。

替代为单通道webhook脚本或直接关注DSH窗口。插件增加统一规则和可诊断性，仍要承担跨服务权限、噪声和隐私管理，没有同任务响应时间对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 事件规则中枢 | 去重、静音、安静时段、摘要 | 审批穿透部分规则，静音优先 |
| 多通道投递 | 接入Bark等服务及webhook | HTTP成功不等于业务接受 |
| 持久重试 | 重启后继续失败通知 | 部分失败会重试全部匹配通道 |
| /notify命令 | 状态、测试、静音与手动恢复 | test会真实外发，需授权环境 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 声明0.1.6/0.1.7宿主接口 | 启动必需 | 事件、命令、存储 | 不据源码存在推断0.2兼容 |
| 外部服务及凭据 | 实际通知必需 | 通道投递 | 无匹配通道只记日志 |
| 可写storages | 持久恢复必需 | 保存配置和队列 | 写失败可能影响重启恢复 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选通道、界定外发内容 | 密钥及接收对象核实 |
| 配置 | 安装、设事件与规则、测试 | 接收端真实收到正确内容 |
| 执行 | 宿主发事件、规则决定发送 | 日志说明发送或抑制原因 |
| 恢复 | 用户模拟失败和重启 | 仅未确认目标重试，无法保证时人工对账 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 通知服务账号与宿主，费用未知 | 配密钥、路由和隐私范围 | 不同通道限额与价格未核实 |
| 持续使用 | 网络请求、摘要和本地队列 | 调整噪声、检查审批提醒 | 业务接受与实际阅读未知 |
| 失败恢复 | 退避重试及重复推送资源未知 | 对账失败通道和人工处理漏报 | 全通道重试可能放大打扰 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 减少噪声 | 去重、安静时段与摘要分流 | 真实漏报与打扰改善 |
| 失败恢复 | outbox本地持久与退避 | 严格不丢、无重复及通道业务接受 |
| 审批提醒 | 审批可穿透安静时段和摘要 | 用户是否及时看到；静音仍可压制 |

> **思考**：成功回执及重试粒度决定规则是否减少打扰。deliverTo 仅用response.ok判断，未读取服务业务错误；outbox保存整条通知却不保存失败通道集合，drain调用默认channelsFor重发所有匹配通道，部分成功时可能重复推送。网络超时但远端已接受也无幂等回执，不能承诺一次送达。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对单个通知转发器，插件在通道适配器上方增加是否发送、何时聚合与为何抑制的规则和日志，并持久保存失败队列，改变离线关注任务的交接方式。通道投递与客户端呈现仍由外部服务承担，不把发送请求当用户已收到。[Q01](#research-q01)

把策略与适配器分离、记录抑制原因、转发session/event全部参数值得借鉴。通道HTTP与业务回执应分层，持久重试需按目标保存状态；配置写队列捕获错误不应默认为可靠落盘。复用规则结构可行，外发内容和回执必须逐通道重审。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

成功回执及重试粒度决定规则是否减少打扰。deliverTo 仅用response.ok判断，未读取服务业务错误；outbox保存整条通知却不保存失败通道集合，drain调用默认channelsFor重发所有匹配通道，部分成功时可能重复推送。网络超时但远端已接受也无幂等回执，不能承诺一次送达。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，在隔离接收器验证每类事件和部分通道失败，确认哪些内容会外发。修正回执及重试粒度后，可从不含秘密且容忍重复的完成提醒试用；审批通知不能替代宿主审批界面，静音会优先压制所有事件。[Q02](#research-q02)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

事件路由和规则中枢有源码支持；HTTP成功不能证明通道业务接受，重试会再次发送已成功通道，重启不丢与端到端送达仍需故障验证。新假设未实现。

- 已检查：作者 README、包清单、源码路径 index.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读host事件接线、intake、规则判定、投递、持久重试与命令注册；未全面审计所有通道payload、web路由和客户端，未执行真实发送。
- 下一步：用本地接收器模拟部分成功、200业务失败、超时已接受及重启，核对目标级送达、重复和丢失；再在授权服务验证真实字段及通知阅读。本轮未执行。

**分析版本**

- **仓库**：[Archaofan/dsh-notify-relay](https://github.com/Archaofan/dsh-notify-relay)
- **版本号**：0.4.3（[固定提交 1e45964](https://github.com/Archaofan/dsh-notify-relay/tree/1e459641202a54f4b2203bfe554ad412bbed8777)）
- **版本日期**：2026-09-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是每通知每通道保存独立投递状态和幂等键，适配器解析服务业务回执，重试只针对未确认通道。用A成功B失败、HTTP200业务失败和响应丢失矩阵比较现版，要求确认失败不被记成功且A不重复；若服务不支持幂等导致仍无法界定重复，应明确至少一次边界而不宣称严格一次。[Q03](#research-q03)

用本地接收器模拟部分成功、200业务失败、超时已接受及重启，核对目标级送达、重复和丢失；再在授权服务验证真实字段及通知阅读。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .cjs | source | 20 | 5618 | 3891 | 1272 | — |
| .mjs | source | 3 | 631 | 432 | 152 | — |
| .md | source | 10 | 1622 | — | — | 16743 |
| .js | source | 2 | 3525 | 2368 | 939 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-24），可前往 [GitHub Issues](https://github.com/Archaofan/dsh-notify-relay/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：规则与持久重试如何改变通知交接，多通道成功语义能否可信？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么事件如何经过规则进入外部通道？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

host监听agent错误，并从session/event分派turn/end、approval/asked/decided和工具错误；intake构造通知，再按静音、主开关、事件开关、去重、安静时段和摘要判定。审批请求穿透安静时段和摘要，但静音及开关仍先执行。相对只转发消息，增量是解释为何没发与统一规则交接，外部服务才负责真正推送。它适合离开窗口仍需关注任务的人，不证明任务办结或通知已经被人阅读。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1008-1031](https://github.com/Archaofan/dsh-notify-relay/blob/1e459641202a54f4b2203bfe554ad412bbed8777/index.js#L1008-L1031)

规则顺序和审批例外可直接核对，静音并未被审批穿透。

<details>
<summary>查看原文（24行）</summary>

```text
export function classify(notification) {
  const now = Date.now()
  if (mutedUntil > now) return { verdict: 'muted', reason: 'mute active' }
  if (!config.enabled) return { verdict: 'off', reason: 'relay disabled' }
  if (!config.events[notification.kind]) return { verdict: 'off', reason: `event ${notification.kind} disabled` }

  sweepRecent(now)
  const fp = fingerprint(notification.kind, notification.sessionId, notification.title, notification.body)
  if (recentDeliveries.has(fp)) return { verdict: 'dedup', reason: 'same fingerprint inside the dedup window' }

  /* A piercing event ignores quiet hours entirely. `pierce` is set on the kind,
     not in the config: it encodes "this event blocks work", which is a property
     of the event, not a user preference. */
  const spec = EVENT_KIND_BY_ID.get(notification.kind)
  const piercing = !!spec?.pierce
  if (!piercing && config.quiet.enabled && isWithinQuietHours(new Date(now), config.quiet)) {
    return { verdict: config.quiet.mode === 'drop' ? 'quiet-drop' : 'quiet-hold', reason: 'quiet hours' }
  }

  /* Digest holds too, but a piercing event still goes out now — batching an
     approval request has the same cost as delaying it. */
  if (!piercing && config.digest.enabled) return { verdict: 'digest', reason: 'digest batching on' }
  return { verdict: 'send', reason: piercing ? 'pierces quiet hours and digest' : 'immediate' }
}
```

</details>

**依据 2 · 源码核查**：[index.js:1996-2036](https://github.com/Archaofan/dsh-notify-relay/blob/1e459641202a54f4b2203bfe554ad412bbed8777/index.js#L1996-L2036)

事件通过正确总线分派而非仅有静态名称。

<details>
<summary>查看原文（41行）</summary>

```text
       `task.done` and `approval.asked` were silently dead. */
    const listeners = [
      ['agent/error', (payload) => intake('task.failed', payload)],
      ['agent/request-error', (payload) => intake('request.failed', payload)],
      [
        'session/event',
        (session, event) => {
          const type = isPlainObject(event) ? String(event.type || '') : ''
          const data = isPlainObject(event) && isPlainObject(event.data) ? event.data : {}
          if (type === 'turn/end') {
            /* The reason decides the kind: a completed turn is "done", an
               aborted one is not. */
            const kind = TURN_END_KINDS[data.reason?.kind] || 'task.done'
            return intake(kind, { sessionId: session?.id, reason: data.reason, ...data })
          }
          if (type === 'approval/asked') {
            return intake('approval.asked', { sessionId: session?.id, title: data.toolName, body: data.reason, ...data })
          }
          if (type === 'approval/decided') {
            return intake('approval.decided', { sessionId: session?.id, title: data.id, body: data.outcome, ...data })
          }
          if (type === 'tool/result' && isPlainObject(data.error)) {
            return intake('tool.failed', {
              sessionId: session?.id,
              title: data.error.name || 'tool failed',
              body: data.error.reason || data.error.code || '',
              ...data,
            })
          }
        },
      ],
    ]
    /* Every argument must be forwarded, not just the first. `session/event`
       is dispatched as `(session, event)`; a wrapper written as
       `(payload) => handler(payload)` silently drops `event`, so `event.type`
       reads as undefined and every branch below no-ops. The plugin then looks
       perfectly healthy — it registers, it logs, it answers its routes — and
       notifies on nothing at all, which is the single most-reported failure
       mode in this whole ecosystem. */
    for (const [event, handler] of listeners) {
      ctx.on(event, (...args) => {
```

</details>

#### 缺口

- 当前宿主事件覆盖和实际用户响应改善未知。
  **影响**：不能把注册成功当作全事件送达。
  **进一步探讨**：在明确支持版本逐一触发并对照接收端日志。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 持久重试能否避免误报成功和重复通知？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

投递只检查response.ok，没有解析通道JSON业务码，200业务失败可能记成功。失败队列存整条通知和总尝试次数，不存失败目标集合；drain再次调用默认deliver，会对所有当前匹配通道发送，所以A成功B失败时A可能重复。超时但远端接受也不能靠本地状态判定一次性。持久outbox和退避比内存丢弃更完整，但不能承诺无丢无重复。采用还需外部账号、窄宿主版本、可写目录及外发隐私范围，首次配置、持续噪声管理和失败对账的金额与时间均未知，应先观察目标级回执。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1114-1131](https://github.com/Archaofan/dsh-notify-relay/blob/1e459641202a54f4b2203bfe554ad412bbed8777/index.js#L1114-L1131)

HTTP ok即投递成功，没有业务响应确认。

<details>
<summary>查看原文（18行）</summary>

```text
  try {
    const response = await fetch(built.url, { ...built.init, signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS) })
    const entry = {
      ...meta,
      channelId: channel.id,
      kind: channel.kind,
      ok: response.ok,
      status: response.status,
      ms: Date.now() - started,
      ...(response.ok ? {} : { error: `http ${response.status}` }),
    }
    noteOutcome(channel.id, response.ok)
    await recordDelivery(entry)
    return entry
  } catch (error) {
    const entry = {
      ...meta,
      channelId: channel.id,
```

</details>

**依据 2 · 源码核查**：[index.js:1189-1208](https://github.com/Archaofan/dsh-notify-relay/blob/1e459641202a54f4b2203bfe554ad412bbed8777/index.js#L1189-L1208)

outbox保存通知整体，没有失败通道列表。

<details>
<summary>查看原文（20行）</summary>

```text
async function enqueueRetry(notification, failedResults) {
  const existing = outbox.find((item) => item.notification.kind === notification.kind && item.notification.title === notification.title && item.notification.body === notification.body)
  if (existing) {
    existing.attempts += 1
    existing.lastError = failedResults.map((f) => `${f.channelId}: ${f.error ?? f.status}`).join('; ').slice(0, 300)
    existing.nextAttemptAt = Date.now() + backoffMs(existing.attempts)
  } else {
    outbox.unshift({
      notification,
      attempts: 1,
      /* When this first entered the queue, not when it last failed. The
         self-monitor needs the age of the *wait*, and re-stamping it on every
         retry would make a permanently stuck notification look brand new. */
      firstSeenAt: Date.now(),
      nextAttemptAt: Date.now() + backoffMs(1),
      lastError: failedResults.map((f) => `${f.channelId}: ${f.error ?? f.status}`).join('; ').slice(0, 300),
    })
  }
  outbox = outbox.slice(0, MAX_OUTBOX_ENTRIES)
  await persistOutbox()
```

</details>

**依据 3 · 源码核查**：[index.js:1271-1286](https://github.com/Archaofan/dsh-notify-relay/blob/1e459641202a54f4b2203bfe554ad412bbed8777/index.js#L1271-L1286)

重试调用默认deliver，部分成功目标会再收到。

<details>
<summary>查看原文（16行）</summary>

```text
      continue
    }
    const results = await deliver(item.notification, { retry: false })
    if (results.length > 0 && results.every((result) => result.ok)) {
      sent += 1
      continue
    }
    item.attempts += 1
    item.lastError = results.map((f) => `${f.channelId}: ${f.error ?? f.status}`).join('; ').slice(0, 300) || item.lastError
    item.nextAttemptAt = Date.now() + backoffMs(item.attempts)
    keep.push(item)
  }
  outbox = keep.slice(0, MAX_OUTBOX_ENTRIES)
  await persistOutbox()
  return { retried: due.length, sent, dropped }
}
```

</details>

#### 缺口

- 各服务业务码、幂等性和崩溃窗口未经验证。
  **影响**：可能误报送达或产生重复，不能承担唯一关键通知。
  **进一步探讨**：模拟部分失败和响应丢失，逐通道核对接收记录再试用。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 按通道保存回执能否改善通知办结？

**研究主题**：新假设与验证

#### 完整回答

现版队列粒度比外部副作用粒度粗，因而可以推导未验证的目标级状态方案。每通知每通道保存待发、已确认或未知，适配器读取业务回执，能支持幂等键的服务复用同键；只重试未确认目标。它增加持久状态、配置变更和退出清理复杂度，不能假定所有服务支持严格一次。最小对照A成功B失败、HTTP200错误和超时已接受，要求A不重复且业务失败不记成功；无法解决未知回执时应明确至少一次边界。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1189-1208](https://github.com/Archaofan/dsh-notify-relay/blob/1e459641202a54f4b2203bfe554ad412bbed8777/index.js#L1189-L1208)

整体队列是细化投递状态假设的来源，不代表该设计已实现。

<details>
<summary>查看原文（20行）</summary>

```text
async function enqueueRetry(notification, failedResults) {
  const existing = outbox.find((item) => item.notification.kind === notification.kind && item.notification.title === notification.title && item.notification.body === notification.body)
  if (existing) {
    existing.attempts += 1
    existing.lastError = failedResults.map((f) => `${f.channelId}: ${f.error ?? f.status}`).join('; ').slice(0, 300)
    existing.nextAttemptAt = Date.now() + backoffMs(existing.attempts)
  } else {
    outbox.unshift({
      notification,
      attempts: 1,
      /* When this first entered the queue, not when it last failed. The
         self-monitor needs the age of the *wait*, and re-stamping it on every
         retry would make a permanently stuck notification look brand new. */
      firstSeenAt: Date.now(),
      nextAttemptAt: Date.now() + backoffMs(1),
      lastError: failedResults.map((f) => `${f.channelId}: ${f.error ?? f.status}`).join('; ').slice(0, 300),
    })
  }
  outbox = outbox.slice(0, MAX_OUTBOX_ENTRIES)
  await persistOutbox()
```

</details>

#### 缺口

- 各服务是否支持幂等键与查询回执未知。
  **影响**：目标级状态也未必消除所有重复。
  **进一步探讨**：先选择支持回执的一类服务做原型，再明确其余通道边界。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
