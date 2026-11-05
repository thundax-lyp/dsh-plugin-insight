# dsh-im-connect

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[ae50c6a](https://github.com/MichengAI/dsh-im-connect/tree/ae50c6a12cc89ba83eb1688df82a4bea1d10bb86)

<!-- BEGIN META -->
[![GitHub ★ 122](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=122&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-im-connect) [![npm 30d 61,624](https://img.shields.io/static/v1?label=npm+30d&message=61%2C624&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-im-connect) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-im-connect)
<!-- END META -->

> **功能**：把多账号 IM 聊天接入 DSH，支持会话绑定、审批和断线后交付。

> **亮点**：[Q01](#research-q01) 将宿主会话映射到已用聊天并保留历史。

> **主要限制**：[Q02](#research-q02) 未知送达有独立状态，平台 ACK 和身份隔离待验。

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
  - [Q01 · 移动用户如何在现有聊天里延续 DSH 任务？](#detail-section-11)
  - [Q02 · 审批和重启补发怎样处理未知结果？](#detail-section-12)
  - [Q03 · 怎样验证单渠道接入值得扩展？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：团队离开 DSH 网页后仍希望在一个聊天里提交和跟进任务。

回 DSH 网页查看结果并处理审批。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 聊天绑定 | 从 IM 续接宿主任务 | 按账号及聊天识别 |
| 审批 | 在原聊天确认 | 身份和超时需验收 |
| 补发 | 恢复已知未送达的文本 | 未知默认不重发 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH Host | 必需 | 挂载会话和审批 | 宿主差异需核对 |
| 渠道账号及凭据 | 每渠道必需 | 收发消息 | 平台权限及能力不同 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 选择隔离工作区和私聊渠道 | 核对权限与诊断 |
| 提交 | 在目标聊天发任务 | 核对绑定、结果及审批 |
| 恢复 | 识别未知或明确失败 | 核对后再显式补发 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 平台与资源成本未知 | 开通账号并核对权限 | 建议先单渠道 |
| 持续 | 配额和人工未知 | 维护凭据并检查断线 | 渠道状态不同 |
| 失败 | 工时未知 | 查交付记录和宿主日志 | 未知结果人工确认 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 异地任务跟进 | 从聊天提交并跟进 DSH 任务 | 实际节时、重复率及权限边界 |

> **思考**：[Q02](#research-q02) 未知送达有独立状态，平台 ACK 和身份隔离待验。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将宿主会话映射到已用聊天并保留历史。

[Q02](#research-q02) 重启后在途记录进入未知，显式补发需要判断风险。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 未知送达有独立状态，平台 ACK 和身份隔离待验。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 从隔离私聊开始验收，随后扩展至群聊。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持绑定、审批等候和补发状态；未运行真实渠道。

- 已检查：作者 README、包清单、源码路径 src/engine/router.ts、README.md、src/engine/approval.ts、src/engine/deferred-delivery.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定路由、审批等候器和交付状态源码，未连接真实渠道或 Host。
- 下一步：用隔离账号演练错绑、超时、部分送达和 ACK 丢失。

**分析版本**

- **仓库**：[MichengAI/dsh-im-connect](https://github.com/MichengAI/dsh-im-connect)
- **版本号**：1.0.27（[固定提交 ae50c6a](https://github.com/MichengAI/dsh-im-connect/tree/ae50c6a12cc89ba83eb1688df82a4bea1d10bb86)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 比较单渠道接入与网页流程的跟进时间和重复交付。

用隔离账号演练错绑、超时、部分送达和 ACK 丢失。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 32 | 4641 | — | — | 104644 |
| .js | source | 77 | 26458 | 24994 | 1179 | — |
| .mjs | source | 4 | 245 | 221 | 3 | — |
| .ts | source | 74 | 16302 | 14432 | 960 | — |
| .mjs | test | 121 | 20780 | 19021 | 493 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/MichengAI/dsh-im-connect/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 25](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=25&color=737b86&logo=github)](https://github.com/MichengAI/dsh-im-connect/issues?q=is%3Aissue+created%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z) [![近30天关闭 23](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=23&color=737b86&logo=github)](https://github.com/MichengAI/dsh-im-connect/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：如何在已有 IM 里安全跟进 DSH 会话，并处理断线后的交付？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 移动用户如何在现有聊天里延续 DSH 任务？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

插件按渠道账号和聊天建立绑定，创建时使用账号配置和工作区；显式换绑时拦截已经在别处占用的会话，保留历史绑定。相对切回网页，用户能在现有 IM 提交任务和读回复。作者说明准确 @ 的群聊可接受任何参与者的任务，这一开放边界需要按工作区配置考虑。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine/router.ts:285-307](https://github.com/MichengAI/dsh-im-connect/blob/ae50c6a12cc89ba83eb1688df82a4bea1d10bb86/src/engine/router.ts#L285-L307)

绑定键、占用校验与历史。

<details>
<summary>查看原文（23行）</summary>

```text
  /** 只返回是否占用，不向列表暴露其他聊天身份。 */
  isBoundElsewhere(sessionId: string, channelId: string, kind: ChatKind, chatId: string): boolean {
    const key = sessionKeyOf(channelId, kind, chatId)
    return this.store.list().some(item => !item.detached && item.sessionId === sessionId && sessionKeyOf(item.channel, item.kind, item.chatId) !== key)
  }

  /** 显式换绑保留旧历史与运行句柄，不改变 Host 会话的归属或默认配置。 */
  async bind(channelId: string, kind: ChatKind, chatId: string, sessionId: string, title: string, agent: unknown, cwd?: string, signal?: AbortSignal): Promise<void> {
    await this.channelOperations.run(channelId, async () => {
      const key = sessionKeyOf(channelId, kind, chatId)
      signal?.throwIfAborted()
      const other = this.isBoundElsewhere(sessionId, channelId, kind, chatId)
      if (other) throw Object.assign(new Error(replyText('该会话已关联其他聊天，不能重复绑定。')), { code: 'im/session-in-use' })
      const old = this.live.get(key)
      const previous = this.store.list().find(item => item.sessionId === sessionId)
      this.store.upsert(key, { ...previous, channel: channelId, kind, chatId, sessionId, title: previous?.titleSource === 'user' ? previous.title : title, ...(cwd ? { cwd } : {}), adopted: true, detached: false, muted: false, updatedAt: new Date().toISOString() })
      if (old && old.sessionId !== sessionId) this.historical.set(old.sessionId, old)
      const binding = this.historical.get(sessionId) ?? { key, channelId, kind, chatId, sessionId, handle: { agent, dispose: async () => {} } }
      Object.assign(binding, { key, channelId, kind, chatId })
      this.historical.delete(sessionId)
      this.live.set(key, binding)
      this.unbindOthersForChat(channelId, kind, chatId, sessionId)
    })
```

</details>

**依据 2 · 源码核查**：[src/engine/router.ts:513-535](https://github.com/MichengAI/dsh-im-connect/blob/ae50c6a12cc89ba83eb1688df82a4bea1d10bb86/src/engine/router.ts#L513-L535)

按账号创建和附加工作区。

<details>
<summary>查看原文（23行）</summary>

```text
  private async create(channelId: ChannelInstanceId, kind: ChatKind, chatId: string, title: string, cwd?: string, signal?: AbortSignal): Promise<ChatBinding> {
    const key = sessionKeyOf(channelId, kind, chatId)
    const sessionId = createImSessionId()
    const config = { ...this.resolveConfig(channelId), ...(cwd ? { cwd } : {}) }
    const handle = await this.createHandle(sessionId, channelId, config)
    try {
      signal?.throwIfAborted()
      await this.attachWorkspace(sessionId, channelId, config.cwd, true)
      signal?.throwIfAborted()
    } catch (error) {
      await this.disposeHandle({ key, channelId, kind, chatId, sessionId, handle })
      throw error
    }
    const record: SessionRecord = {
      sessionId,
      channel: channelId,
      kind,
      chatId,
      title,
      titleSource: 'pending',
      agentPreset: config.agentPreset || 'standard',
      cwd: config.cwd || process.cwd(),
      updatedAt: new Date().toISOString(),
```

</details>

**依据 3 · 作者声明**：[README.md:28-52](https://github.com/MichengAI/dsh-im-connect/blob/ae50c6a12cc89ba83eb1688df82a4bea1d10bb86/README.md#L28-L52)

账号配置与群聊准入。

<details>
<summary>查看原文（25行）</summary>

```text
- **多个账号分别配置**：同一平台可添加多个账号，各自选择工作区、模型、推理强度、权限、私聊准入和发送方式。
- **手机上完成任务交互**：下任务、读回复、回答单选或多选问题；已批准用户可在私聊中批准或拒绝工具执行。
- **聊天记录互不混淆**：每个 IM 聊天对应独立会话，在网页工作区「频道」中回看。
- **按平台扫码或填写凭据**：## 界面预览

在「设置 → IM助理」连接账号，管理消息接收开关。
- **控制谁能使用**：群聊通过 @ 触发，私聊按账号的准入设置处理，详见下表。

## 谁可以驱动助手

入站消息先看发送者，再处理命令、工具审批和注入。

| 场景 | 行为 |
| --- | --- |
| 群聊未 @ 当前机器人 | 忽略，不回复、不进待批准；只 @ 其他成员也不触发 |
| 群聊已准确 @ 当前机器人 | 不用绑定，任何人都可以下任务 |
| 私聊 · 扫码用户 | 微信 / 飞书 / Lark / QQ 扫码者自动进白名单，可直接对话 |
| 私聊 · 其他人 | 进入设置页待批准；不批准就不能驱动助手 |
| 私聊 · 扫码不返回身份 | 钉钉 / 企微的快捷绑定只返回机器人凭据，扫码者仍需在设置页批准 |
| 私聊 · 手动凭据 | Telegram、Discord、Slack，以及手动填写凭据的钉钉 / 企微 / QQ，所有私聊都要先批准 |
| 私聊缺少 userId | 拒绝 |
| 工具审批 | 在绑定该会话的聊天里回复「批准 / 拒绝」；群聊和私聊都可以，不用去网页。5 分钟内未回复按取消结束，期间其他文字不会进入下一轮 |
| 交互选择 | 在原 IM 会话回复选项序号或文字；多选用逗号分隔，也可补充自定义答案；群聊只接受任务发起者回答 |

微信是扫码渠道且只支持私聊，所以连上后用**同一个微信号**即可直接用。换一个微信号私聊，会出现在设置页待批准。
```

</details>

#### 缺口

- 未实测两聊天竞争同一绑定
  **影响**：真实隔离效果和用户体验未知
  **进一步探讨**：在隔离账号模拟交叉绑定与群聊消息

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 审批和重启补发怎样处理未知结果？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

审批等候器有超时和允许/拒绝结果，作者描述审批留在原聊天，群聊仅发起者可批准。补发加载时把发送中记录转成未知，未知不会自动按失败重发，只有明确拒绝或可判定未投递等路径进入可补发。显式补发需核对记录，渠道平台的实际 ACK 和部分送达语义仍需验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine/approval.ts:21-38](https://github.com/MichengAI/dsh-im-connect/blob/ae50c6a12cc89ba83eb1688df82a4bea1d10bb86/src/engine/approval.ts#L21-L38)

等候和超时。

<details>
<summary>查看原文（18行）</summary>

```text
  wait(key: string, timeoutMs?: number, signal?: AbortSignal): Promise<ApprovalVerdict> | undefined {
    if (this.pending.has(key)) return undefined
    if (signal?.aborted) return Promise.resolve(undefined)
    return new Promise((resolve) => {
      const settle = (value: ApprovalVerdict) => {
        const entry = this.pending.get(key)
        if (!entry) return
        if (entry.timer) clearTimeout(entry.timer)
        if (entry.signal && entry.onAbort) entry.signal.removeEventListener('abort', entry.onAbort)
        this.pending.delete(key)
        resolve(value)
      }
      const entry: Pending = { resolve: settle, accepting: false }
      if (timeoutMs !== undefined && timeoutMs > 0) {
        entry.timer = setTimeout(() => settle('timeout'), timeoutMs)
        entry.timer.unref?.()
      }
      if (signal) {
```

</details>

**依据 2 · 源码核查**：[src/engine/deferred-delivery.ts:48-65](https://github.com/MichengAI/dsh-im-connect/blob/ae50c6a12cc89ba83eb1688df82a4bea1d10bb86/src/engine/deferred-delivery.ts#L48-L65)

重启时恢复未知。

<details>
<summary>查看原文（18行）</summary>

```text
    if (!file) return
    try {
      const parsed = JSON.parse(readFileSync(file, 'utf8'))
      if (parsed.version !== 1 || !Array.isArray(parsed.entries)) throw new Error('Invalid delivery journal')
      for (const entry of parsed.entries) {
        if (typeof entry.id !== 'string' || typeof entry.sessionId !== 'string' || typeof entry.channelId !== 'string'
          || typeof entry.message?.chatId !== 'string' || !['dm', 'group'].includes(entry.message.kind)
          || !Number.isFinite(entry.createdAt) || !Number.isSafeInteger(entry.offset) || entry.offset < 0
          || !['waiting', 'ready', 'sending', 'sent', 'unknown', 'blocked', 'expired', 'rejected'].includes(entry.status)
          || (entry.message.userId !== undefined && typeof entry.message.userId !== 'string')
          || (entry.turn !== undefined && !Number.isSafeInteger(entry.turn))
          || this.entries.some(e => e.id === entry.id)
          || (entry.parts !== undefined && (!Array.isArray(entry.parts) || !entry.parts.every((p: unknown) => typeof p === 'string') || entry.offset > entry.parts.length))
          || (entry.text !== undefined && typeof entry.text !== 'string')) throw new Error('Invalid delivery record')
        if (entry.status === 'sending') entry.status = 'unknown'
        this.entries.push(entry)
      }
      this.flush()
```

</details>

**依据 3 · 源码核查**：[src/engine/deferred-delivery.ts:114-122](https://github.com/MichengAI/dsh-im-connect/blob/ae50c6a12cc89ba83eb1688df82a4bea1d10bb86/src/engine/deferred-delivery.ts#L114-L122)

根据可确认的结果调整。

```text
   * 的歧义，直接置为 `ready`，交回 30s 巡检自动补发。
   * 其余失败保持 `unknown`，不猜测、不自动重发。
   */
  complete(sessionId: string, turn: number, ok: boolean, rejected = false): void {
    for (const e of this.entries) if (e.sessionId === sessionId && e.turn === turn && this.active.has(e.id)) {
      // waiting 表示实时路径根本未发送，留给冷读取；unknown 不猜测为失败。
      if (e.status === 'unknown' && ok) this.patch(e.id, { status: 'sent' })
      else if (e.status === 'unknown' && rejected) this.patch(e.id, { status: 'ready' })
      this.active.delete(e.id)
```

**依据 4 · 源码核查**：[src/engine/deferred-delivery.ts:137-171](https://github.com/MichengAI/dsh-im-connect/blob/ae50c6a12cc89ba83eb1688df82a4bea1d10bb86/src/engine/deferred-delivery.ts#L137-L171)

显式重试、重复检测和错误状态。

<details>
<summary>查看原文（35行）</summary>

```text
    send: (entry: DeferredEntry, text: string) => Promise<void>, chunks: (text: string) => string[], explicit = false): Promise<'missing' | 'unavailable' | undefined> {
    const sessionId = this.entries.find(e => e.id === id)?.sessionId ?? id
    return this.queue.run(sessionId, async () => {
      const entry = this.entries.find(e => e.id === id)
      if (!entry || this.active.has(id) || this.quarantined.has(id)) return
      const originalStatus = entry.status
      const pausedRetry = explicit && ['unknown', 'blocked'].includes(originalStatus)
      if (!pausedRetry && !['waiting', 'ready'].includes(entry.status)) return
      if (Date.now() - entry.createdAt > 7 * 86400_000) { this.patch(id, { status: 'expired' }); return }
      if (!valid(entry)) { this.patch(id, { status: 'blocked' }); return }
      if (!entry.text) {
        let result: { text: string; turn?: number } | undefined
        try { result = await read({ ...entry }) }
        catch (error) { if (explicit) return 'unavailable'; throw error }
        if (!result) return explicit ? 'missing' : undefined
        if (entry.status !== originalStatus) return
        this.patch(id, { text: result.text, turn: result.turn ?? entry.turn, status: 'ready' })
      }
      if (!valid(entry)) { this.patch(id, { status: 'blocked' }); return }
      const duplicate = this.entries.find(e => e.id !== id && e.sessionId === entry.sessionId && e.turn !== undefined && e.turn === entry.turn && ['sent', 'unknown', 'sending'].includes(e.status))
      if (duplicate && !explicit) { this.patch(id, { status: duplicate.status === 'sent' ? 'sent' : 'unknown' }); return }
      if (!entry.parts) this.patch(id, { parts: chunks(entry.text!) })
      const parts = entry.parts!
      if (!parts.length) { this.patch(id, { status: 'sent' }); return }
      for (let index = entry.offset; index < parts.length; index++) {
        if (!valid(entry)) { this.patch(id, { status: 'blocked' }); return }
        this.patch(id, { status: 'sending' })
        try { await send(entry, parts[index]!) }
        catch (error) {
          // 只有适配器明确确认请求未提交时才保留自动恢复资格。
          this.patch(id, { status: error instanceof DeliveryUnavailable ? 'ready' : 'unknown' })
          return
        }
        const blocked = (entry.status as string) === 'blocked'
        this.patch(id, { offset: index + 1, status: blocked ? 'blocked' : index + 1 === parts.length ? 'sent' : 'ready' })
```

</details>

**依据 5 · 作者声明**：[README.md:125-129](https://github.com/MichengAI/dsh-im-connect/blob/ae50c6a12cc89ba83eb1688df82a4bea1d10bb86/README.md#L125-L129)

作者描述群聊审批行为。

```text

钉钉、Telegram、Discord、Slack、飞书/Lark 使用原生按钮；企业微信在按钮数量和正文符合平台限制时使用卡片，其他情况及 QQ、微信使用文字序号。平台明确拒绝或超出卡片容量时退回完整文字；网络异常导致发送结果未知时仅提示确认，避免重复发送。菜单按账号、聊天、操作者和会话隔离，15 分钟或重启后失效；执行时重新检查权限，旧按钮不能重复执行。

审批与问答复用上述原生按钮渠道：审批提供批准一次/拒绝，单选题直接点选，多选题勾选后提交；开放问题保留文字回答。审批始终留在发起任务的聊天里，不会回退到网页端；提示发送失败时按拒绝处理。5 分钟内没有批准或拒绝就按取消结束，并说明这次未执行；这段时间里的其他文字只提示先完成审批，不会送进下一轮。图片和文件仍按原消息提交，不当成审批答复。群聊里只接受任务发起者批准，私聊没有额外限制，关闭命令不影响已有审批及问答。问题不设这个超时，下一句文字仍作为答案。

```

#### 缺口

- 渠道 ACK 和身份边界未复跑
  **影响**：不能证明平台端无重复或越权
  **进一步探讨**：模拟 ACK 丢失、重启、第二用户和分片失败

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样验证单渠道接入值得扩展？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

先在独立账号和测试工作区接入一个私聊渠道，完成正常消息、审批超时和断线恢复，再对照网页流程记录响应和重复率。作者所述连接诊断仅探测渠道接口能力，仍要另做双向消息验收。出现回错聊天、未确认发送自动重发或失去撤回控制就停止扩展。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:151-159](https://github.com/MichengAI/dsh-im-connect/blob/ae50c6a12cc89ba83eb1688df82a4bea1d10bb86/README.md#L151-L159)

诊断范围和设置。

```text
“已完成”表示该回合正常结束且正文、文件均已投递；停止、失败和下一条排队消息不会误标完成。状态接口受渠道权限与网络影响，更新失败不阻塞聊天；文字标签跟随网页语言设置。

## 连接诊断

账号设置中的“诊断连接”会实际调用渠道接口：微信查询配置，企微检测现有连接的 ping 回执，钉钉验证应用凭据，飞书/Lark 查询鉴权与机器人身份，QQ 查询鉴权与网关，Telegram 查询机器人身份及 Webhook 冲突，Discord 查询机器人身份及 Gateway 地址，Slack 查询机器人身份，并在已建立 Socket Mode 连接时回报连接状态（不新建连接）。

每项显示通过、失败或未验证、耗时和处理建议。诊断不发送测试消息、不额外拉取聊天消息；单项通过不代表完整收发权限已验证。旧后端不支持诊断时会提示重启 DSH 并刷新页面。接口、各渠道能力边界与验证记录见[账号连接诊断](docs/01-当前工作/I015-命令权限与Chat命令/06-账号状态检查.md)。

在「设置 → IM助理」按渠道添加账号。展开渠道后，点击账号名称可填写备注，用来区分是谁在使用；留空则恢复自动名称。设置按钮配置工作区、模型、权限、私聊准入和发送方式，那里也可以改备注；接收消息开关位于账号行：
```

**依据 2 · 源码核查**：[src/engine/router.ts:285-307](https://github.com/MichengAI/dsh-im-connect/blob/ae50c6a12cc89ba83eb1688df82a4bea1d10bb86/src/engine/router.ts#L285-L307)

隔离绑定依据。

<details>
<summary>查看原文（23行）</summary>

```text
  /** 只返回是否占用，不向列表暴露其他聊天身份。 */
  isBoundElsewhere(sessionId: string, channelId: string, kind: ChatKind, chatId: string): boolean {
    const key = sessionKeyOf(channelId, kind, chatId)
    return this.store.list().some(item => !item.detached && item.sessionId === sessionId && sessionKeyOf(item.channel, item.kind, item.chatId) !== key)
  }

  /** 显式换绑保留旧历史与运行句柄，不改变 Host 会话的归属或默认配置。 */
  async bind(channelId: string, kind: ChatKind, chatId: string, sessionId: string, title: string, agent: unknown, cwd?: string, signal?: AbortSignal): Promise<void> {
    await this.channelOperations.run(channelId, async () => {
      const key = sessionKeyOf(channelId, kind, chatId)
      signal?.throwIfAborted()
      const other = this.isBoundElsewhere(sessionId, channelId, kind, chatId)
      if (other) throw Object.assign(new Error(replyText('该会话已关联其他聊天，不能重复绑定。')), { code: 'im/session-in-use' })
      const old = this.live.get(key)
      const previous = this.store.list().find(item => item.sessionId === sessionId)
      this.store.upsert(key, { ...previous, channel: channelId, kind, chatId, sessionId, title: previous?.titleSource === 'user' ? previous.title : title, ...(cwd ? { cwd } : {}), adopted: true, detached: false, muted: false, updatedAt: new Date().toISOString() })
      if (old && old.sessionId !== sessionId) this.historical.set(old.sessionId, old)
      const binding = this.historical.get(sessionId) ?? { key, channelId, kind, chatId, sessionId, handle: { agent, dispose: async () => {} } }
      Object.assign(binding, { key, channelId, kind, chatId })
      this.historical.delete(sessionId)
      this.live.set(key, binding)
      this.unbindOthersForChat(channelId, kind, chatId, sessionId)
    })
```

</details>

**依据 3 · 源码核查**：[src/engine/deferred-delivery.ts:137-171](https://github.com/MichengAI/dsh-im-connect/blob/ae50c6a12cc89ba83eb1688df82a4bea1d10bb86/src/engine/deferred-delivery.ts#L137-L171)

恢复和重复控制。

<details>
<summary>查看原文（35行）</summary>

```text
    send: (entry: DeferredEntry, text: string) => Promise<void>, chunks: (text: string) => string[], explicit = false): Promise<'missing' | 'unavailable' | undefined> {
    const sessionId = this.entries.find(e => e.id === id)?.sessionId ?? id
    return this.queue.run(sessionId, async () => {
      const entry = this.entries.find(e => e.id === id)
      if (!entry || this.active.has(id) || this.quarantined.has(id)) return
      const originalStatus = entry.status
      const pausedRetry = explicit && ['unknown', 'blocked'].includes(originalStatus)
      if (!pausedRetry && !['waiting', 'ready'].includes(entry.status)) return
      if (Date.now() - entry.createdAt > 7 * 86400_000) { this.patch(id, { status: 'expired' }); return }
      if (!valid(entry)) { this.patch(id, { status: 'blocked' }); return }
      if (!entry.text) {
        let result: { text: string; turn?: number } | undefined
        try { result = await read({ ...entry }) }
        catch (error) { if (explicit) return 'unavailable'; throw error }
        if (!result) return explicit ? 'missing' : undefined
        if (entry.status !== originalStatus) return
        this.patch(id, { text: result.text, turn: result.turn ?? entry.turn, status: 'ready' })
      }
      if (!valid(entry)) { this.patch(id, { status: 'blocked' }); return }
      const duplicate = this.entries.find(e => e.id !== id && e.sessionId === entry.sessionId && e.turn !== undefined && e.turn === entry.turn && ['sent', 'unknown', 'sending'].includes(e.status))
      if (duplicate && !explicit) { this.patch(id, { status: duplicate.status === 'sent' ? 'sent' : 'unknown' }); return }
      if (!entry.parts) this.patch(id, { parts: chunks(entry.text!) })
      const parts = entry.parts!
      if (!parts.length) { this.patch(id, { status: 'sent' }); return }
      for (let index = entry.offset; index < parts.length; index++) {
        if (!valid(entry)) { this.patch(id, { status: 'blocked' }); return }
        this.patch(id, { status: 'sending' })
        try { await send(entry, parts[index]!) }
        catch (error) {
          // 只有适配器明确确认请求未提交时才保留自动恢复资格。
          this.patch(id, { status: error instanceof DeliveryUnavailable ? 'ready' : 'unknown' })
          return
        }
        const blocked = (entry.status as string) === 'blocked'
        this.patch(id, { offset: index + 1, status: blocked ? 'blocked' : index + 1 === parts.length ? 'sent' : 'ready' })
```

</details>

#### 缺口

- 未核对真实平台凭据、配额或审批
  **影响**：实际运维成本未知
  **进一步探讨**：先单渠道做对照再测试跨渠道差异

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
