# DSH Email

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[8da420e](https://github.com/STARDUSTLC666/dsh-email/tree/8da420e5ab6ea4e67370ae30bfe08c94e001a963)

<!-- BEGIN META -->
[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/STARDUSTLC666/dsh-email) [![npm 30d 11,059](https://img.shields.io/static/v1?label=npm+30d&message=11%2C059&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-email) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-email)
<!-- END META -->

> **功能**：在 DSH 中浏览、搜索邮件并编辑回复草稿，支持确认发送与可选邮件任务。

> **亮点**：把邮件检索、草稿、收件人规则与版本核对接到同一工作台，便于发前检查。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：普通草稿与邮件任务自动回复是不同路径，未验证实际收件；未知提交应查邮箱，不能直接重发。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 相对把邮件复制给助手，工作台改进哪一步？](#detail-section-11)
  - [Q02 · 发送、定时与未知结果怎么处理？](#detail-section-12)
  - [Q03 · 邮件任务是否等同普通草稿的人工确认？](#detail-section-13)
  - [Q04 · 如何只试草稿，并验证未知状态的恢复？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常处理邮件回复且已使用 DSH 的用户，可在工作台集中准备与核对草稿。

原邮箱和人工复制可做到同样编辑，但需要手工同步账号、原文、回复正文与附件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 邮箱工作台 | 浏览、搜索和准备回复 | 协议能力各异 |
| 草稿及定时 | 预览后提交 | 未知结果不自动重发 |
| 邮件任务 | 触发指定工作区 | 独立开关和凭据 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| DSH 和 Node | 加载工具与工作台 | 以包声明为准 |
| 邮箱协议与凭据 | 检索和提交 | 试用仅使用替身 |
| 工作区 | 供可选邮件任务 | 默认关闭并独立授权 |

| 阶段 | 操作 | 异常 |
| --- | --- | --- |
| 首次 | 虚构邮件和阻断外发的替身 | 不配置真实凭据 |
| 持续 | 核对草稿、版本和附件 | 条件变更先重新预览 |
| 退出 | 停任务和定时，检查本地草稿 | 不确定回执先查原邮箱 |

**效果与成本**

| 成本 | 单位 | 限制 |
| --- | --- | --- |
| 人工 | 每个合格草稿的确认时间 | 未测量 |
| 运行 | 提交、定时与恢复 | 真实费用与延迟未知 |

| 效果 | 判据 | 边界 |
| --- | --- | --- |
| 减少重复录入 | 预览与账号、原信一致 | 外部送达另验 |
| 防止陈旧提交 | 规则／附件变化后须重新确认 | 未执行协议测试 |

> **思考**：普通草稿与邮件任务自动回复是不同路径，未验证实际收件；未知提交应查邮箱，不能直接重发。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把邮件检索、草稿、收件人规则与版本核对接到同一工作台，便于发前检查。[Q01](#research-q01) [Q02](#research-q02)

在发送锁中比对预览和规则，远端不明保留 uncertain；发送与用户收到应分别确认。

<a id="detail-section-5"></a>

### 1.4 主要限制

普通草稿与邮件任务自动回复是不同路径，未验证实际收件；未知提交应查邮箱，不能直接重发。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

试用只限虚构邮件的草稿预览与禁止外发的替身，关闭定时与邮件任务。不能核对账号和收件人时继续用原邮箱。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持草稿门槛、规则和回执处理；未执行真实邮箱、附件或模型任务。

- 已检查：作者 README、包清单、源码路径 src/draft-web.ts、src/recipient-policy.ts、src/mail-tasks.ts、src/index.ts、src/mail-task-store.ts、package.json、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向核查应用装配、草稿、收件人及任务入口，未连接真实邮箱或执行目标代码。
- 下一步：用假邮箱分别验证草稿修改、禁止收件人、到期附件变化和受理后无回执。

**分析版本**

- **仓库**：[STARDUSTLC666/dsh-email](https://github.com/STARDUSTLC666/dsh-email)
- **版本号**：0.24.2（[固定提交 8da420e](https://github.com/STARDUSTLC666/dsh-email/tree/8da420e5ab6ea4e67370ae30bfe08c94e001a963)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

将外部提交标识和可查回执关联，比较未知时能否防止重复；不可查时维持暂停而不是自动重试。[Q04](#research-q04)

用假邮箱分别验证草稿修改、禁止收件人、到期附件变化和受理后无回执。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 4 | 130 | 126 | 5 | — |
| .mjs | test | 64 | 8918 | 7945 | 477 | — |
| .md | source | 30 | 2038 | — | — | 41433 |
| .js | source | 44 | 17282 | 15340 | 1958 | — |
| .ts | source | 40 | 10619 | 9001 | 1244 | — |
| .mjs | example | 1 | 132 | 122 | 4 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/STARDUSTLC666/dsh-email/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=21&color=737b86&logo=github)](https://github.com/STARDUSTLC666/dsh-email/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 17](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=17&color=737b86&logo=github)](https://github.com/STARDUSTLC666/dsh-email/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断在 DSH 内浏览、准备及发送邮件的额外价值，并核实草稿确认与外部提交的边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对把邮件复制给助手，工作台改进哪一步？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

反复处理邮箱回复的 DSH 用户可以在同一工作台检查原文、收件人、账号、附件和草稿。人工从邮箱复制同样能请助手起草，且自行发送有清晰边界；这里增量是把预览绑定草稿和账号配置的当前版本，修改后要求重新核对。合格结果首先是正确可审查的草稿，外部提交与实际收件另判。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-26](https://github.com/STARDUSTLC666/dsh-email/blob/8da420e5ab6ea4e67370ae30bfe08c94e001a963/README.md#L18-L26)

作者描述协议、工作台、草稿与自动任务。

```text
## 功能

- 使用 IMAP / POP3 / SMTP、Google / Outlook OAuth 或 AgentMail 账号，提供腾讯企业邮预设。
- 在工作台浏览邮件、搜索并下载附件。
- 管理 IMAP 自建文件夹：创建、重命名，预览并单独确认清空，只删除空文件夹；系统目录受保护。
- 编辑 HTML 或纯文本回复与草稿，核对发件账号、To/Cc、正文和附件后立即发送或定时发送。
- 可选「邮件任务」：从授权邮箱给允许的工作区发起 DSH 任务，并接续原会话；默认关闭。

新增功能的完整流程和边界见[图文邮件、定时发送与邮件任务](docs/OUTGOING-AUTOMATION.md)。Gmail OAuth 需自行创建 Google Desktop app 客户端；应用密码是否可用仍取决于账号策略。定时发送需保持 DSH 运行；自动邮件任务与结果回复均须主动启用。
```

**依据 2 · 源码核查**：[src/index.ts:38-53](https://github.com/STARDUSTLC666/dsh-email/blob/8da420e5ab6ea4e67370ae30bfe08c94e001a963/src/index.ts#L38-L53)

设置、草稿、邮箱、任务和审批实际装配。

<details>
<summary>查看原文（16行）</summary>

```text
  const runtime = createEmailRuntime(ctx, config, settings=>new EmailService(settings,{...dependencies,replyLocale:dependencies.replyLocale??(()=>{
    try { const locale=ctx.settings.describe?.().find((row:any)=>row.ns==='locale');return locale?.user?.preference||locale?.base?.preference } catch { return undefined }
  })}))
  const backend = new EmailSettingsBackend(ctx, runtime.settingsScope, config,dependencies.fetch)
  backend.watchImpl = runtime.watch
  installEmailSettingsWeb(ctx, backend)
  const drafts = new EmailDraftBackend(runtime, backend)
  ctx.inject?.(['appReady'],(host:any)=>{if(typeof host.appReady?.onReady==='function')host.appReady.onReady(()=>drafts.startScheduler())})
  ctx.on?.('dispose',()=>drafts.stopScheduler())
  ctx.on?.('dispose',disposeOAuthFlows)
  installEmailDrafts(ctx, drafts)
  installEmailMailbox(ctx, new EmailMailboxBackend(runtime, drafts))
  installMailTasks(ctx,new MailTaskBackend(runtime))
  for (const definition of buildEmailTools(runtime, drafts)) ctx.tools.register(definition)
  installSendApproval(ctx, runtime)
  installScheduleApproval(ctx,drafts)
```

</details>

**依据 3 · 源码核查**：[src/draft-web.ts:179-199](https://github.com/STARDUSTLC666/dsh-email/blob/8da420e5ab6ea4e67370ae30bfe08c94e001a963/src/draft-web.ts#L179-L199)

发送前显式确认、预览和修订校验。

<details>
<summary>查看原文（21行）</summary>

```text
    if (body.action === 'send') {
      if(draft.sendAt)throw new DraftError('此草稿已填写定时时间；请确认定时发送，或先清除时间再立即发送')
      if (body.confirmed !== true) throw new DraftError('请核对预览后明确确认发送')
      const plan = typeof body.preview === 'string' ? this.plans.get(body.preview) : undefined
      if (!plan || plan.draft.id !== id) throw new DraftError('预览已过期或已用过，请重新预览', 'draft-preview-expired')
      return this.sendPlan(plan,signal)
    }
    throw new DraftError('不支持此草稿操作')
  }
  private async sendPlan(plan:Plan,signal?:AbortSignal,scheduled=false):Promise<{draft:unknown}>{
    const id=plan.draft.id
    const canSend=(draft:EmailDraft)=>{if(scheduled){if(draft.state!=='scheduled'||Date.parse(draft.sendAt||'')>this.now())throw new DraftError('定时已取消、改变或尚未到达','draft-conflict')}else editable(draft)}
    return this.store.sendLock(id,async current=>{
      const before=await this.store.get(id);canSend(before)
      if(before.revision!==plan.draft.revision||plan.key!==this.connection(before.account).key)throw new DraftError('草稿、账号或规则已改变，请重新预览','draft-conflict')
      await assertRecipientsAllowed(before.to,before.cc,this.connection(before.account).policy)
      const pool=this.runtime.getPool();current.throwIfAborted()
      const pending=await this.store.change(id,before.revision,value=>{canSend(value);value.state='sending';value.attemptAt=new Date(this.now()).toISOString()},current)
      this.invalidate(id)
      let unchanged=false;try{unchanged=plan.key===this.connection(before.account).key}catch{}
      if(!unchanged){await this.store.change(id,pending.revision,value=>{value.state='draft';delete value.attemptAt});throw new DraftError('账号或规则已改变，邮件未提交；请重新预览','draft-conflict')}
```

</details>

#### 缺口

- 未观察真实用户是否减少遗漏
  **影响**：无法估计工时或正确率提升
  **进一步探讨**：用虚构邮件对照手工复制、原邮箱草稿和工作台

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 发送、定时与未知结果怎么处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

即时发送要求确认和匹配预览，在锁中对比草稿修订、账户规则并检查禁止收件人，先写 sending 再调用外部发送。发送错误通常进入 uncertain，提示查邮箱并不自动重发；若服务给出回执而本地失败也要求查邮箱。定时到期时核对窗口、账号规则和附件哈希，错过超过五分钟或条件变更则停发并回草稿。不同状态说明本地掌握的证据，sent 标记并不能证明最终收件人已经收到。

#### 证据与依据

**依据 1 · 源码核查**：[src/draft-web.ts:179-210](https://github.com/STARDUSTLC666/dsh-email/blob/8da420e5ab6ea4e67370ae30bfe08c94e001a963/src/draft-web.ts#L179-L210)

显式确认、锁、规则与远端调用顺序。

<details>
<summary>查看原文（32行）</summary>

```text
    if (body.action === 'send') {
      if(draft.sendAt)throw new DraftError('此草稿已填写定时时间；请确认定时发送，或先清除时间再立即发送')
      if (body.confirmed !== true) throw new DraftError('请核对预览后明确确认发送')
      const plan = typeof body.preview === 'string' ? this.plans.get(body.preview) : undefined
      if (!plan || plan.draft.id !== id) throw new DraftError('预览已过期或已用过，请重新预览', 'draft-preview-expired')
      return this.sendPlan(plan,signal)
    }
    throw new DraftError('不支持此草稿操作')
  }
  private async sendPlan(plan:Plan,signal?:AbortSignal,scheduled=false):Promise<{draft:unknown}>{
    const id=plan.draft.id
    const canSend=(draft:EmailDraft)=>{if(scheduled){if(draft.state!=='scheduled'||Date.parse(draft.sendAt||'')>this.now())throw new DraftError('定时已取消、改变或尚未到达','draft-conflict')}else editable(draft)}
    return this.store.sendLock(id,async current=>{
      const before=await this.store.get(id);canSend(before)
      if(before.revision!==plan.draft.revision||plan.key!==this.connection(before.account).key)throw new DraftError('草稿、账号或规则已改变，请重新预览','draft-conflict')
      await assertRecipientsAllowed(before.to,before.cc,this.connection(before.account).policy)
      const pool=this.runtime.getPool();current.throwIfAborted()
      const pending=await this.store.change(id,before.revision,value=>{canSend(value);value.state='sending';value.attemptAt=new Date(this.now()).toISOString()},current)
      this.invalidate(id)
      let unchanged=false;try{unchanged=plan.key===this.connection(before.account).key}catch{}
      if(!unchanged){await this.store.change(id,pending.revision,value=>{value.state='draft';delete value.attemptAt});throw new DraftError('账号或规则已改变，邮件未提交；请重新预览','draft-conflict')}
      let receipt:EmailSendResult
      try{receipt=await pool.sendPrepared(before.account,before.to,before.subject,before.text,before.cc,plan.attachments.map(({filename,content})=>({filename,content})),current,before.reply,before.html)}
      catch(error){
        if(error instanceof RecipientPolicyError){await this.store.change(id,pending.revision,value=>{value.state='draft';delete value.attemptAt});throw error}
        const failed=await this.store.change(id,pending.revision,value=>{value.state='uncertain';value.error='提交结果未确定；请先去邮箱核对，不会自动重发。'+this.safe(error)}).catch(()=>null)
        if(!failed)throw new DraftError('提交结果未确定，且回执未能保存；请先去邮箱核对，不要直接重发','draft-storage')
        return{draft:view(failed)}
      }
      try{return{draft:view(await this.store.change(id,pending.revision,value=>{value.state='sent';value.receipt=receipt}))}}
      catch{throw new DraftError('服务器已返回回执，但本地保存失败；请先核对邮箱，不要再次发送','draft-storage')}
    },signal)
```

</details>

**依据 2 · 源码核查**：[src/draft-web.ts:212-227](https://github.com/STARDUSTLC666/dsh-email/blob/8da420e5ab6ea4e67370ae30bfe08c94e001a963/src/draft-web.ts#L212-L227)

定时超期、规则和附件变更复核。

<details>
<summary>查看原文（16行）</summary>

```text
  async runScheduled(signal?:AbortSignal):Promise<void>{
    for(const draft of await this.store.list()){
      signal?.throwIfAborted()
      if(draft.state!=='scheduled'||Date.parse(draft.sendAt||'')>this.now())continue
      try{
        const attempt=AbortSignal.any([...(signal?[signal]:[]),AbortSignal.timeout(120000)])
        if(this.now()-Date.parse(draft.sendAt!)>300000)throw new DraftError('定时延迟超过 5 分钟，未自动补发；请重新确认时间 / Missed schedule; confirm a new time')
        if(draft.scheduleKey!==this.connection(draft.account).key)throw new DraftError('账号或收件人规则已改变，定时已停止；请重新预览 / Account or policy changed; review again')
        const attachments=await this.attachments(draft,this.connection(draft.account).cap,attempt)
        if(attachments.some(file=>createHash('sha256').update(file.content).digest('hex')!==draft.scheduledAttachments?.[file.id]))throw new DraftError('定时附件已改变，邮件未发送；请重新预览 / Scheduled attachment changed')
        await this.sendPlan({id:randomUUID(),created:this.now(),key:draft.scheduleKey!,draft,attachments},attempt,true)
      }catch(error){
        if(error instanceof DraftError&&error.code==='draft-busy')continue
        const latest=await this.store.get(draft.id).catch(()=>null)
        if(latest?.state==='scheduled')await this.store.change(latest.id,latest.revision,value=>{if(value.state==='scheduled'){value.state='draft';value.error=this.safe(error);delete value.scheduleKey;delete value.scheduledAttachments}}).catch(()=>{})
      }
```

</details>

**依据 3 · 源码核查**：[src/recipient-policy.ts:65-80](https://github.com/STARDUSTLC666/dsh-email/blob/8da420e5ab6ea4e67370ae30bfe08c94e001a963/src/recipient-policy.ts#L65-L80)

deny 优先，匹配与免审批分开。

<details>
<summary>查看原文（16行）</summary>

```text
export async function matchRecipients(to: string, cc: string, policy?: RecipientPolicy): Promise<{ rows: RecipientMatch[]; allTrusted: boolean; skipsApproval: boolean; blocked: boolean }> {
  const rows: RecipientMatch[] = (await normalizeRecipients(to, cc)).map(row => {
    const domain = row.address.slice(row.address.lastIndexOf('@') + 1)
    if (policy?.denyAddresses?.includes(row.address)) return { ...row, matched: false, blocked: true, rule: 'address', value: row.address }
    if (policy?.denyDomains?.includes(domain)) return { ...row, matched: false, blocked: true, rule: 'domain', value: domain }
    if (policy?.addresses.includes(row.address)) return { ...row, matched: true, blocked: false, rule: 'address', value: row.address }
    if (policy?.domains.includes(domain)) return { ...row, matched: true, blocked: false, rule: 'domain', value: domain }
    return { ...row, matched: false, blocked: false, rule: '', value: '' }
  })
  const allTrusted = rows.length > 0 && rows.every(row => row.matched)
  return { rows, allTrusted, skipsApproval: policy?.skipApproval === true && allTrusted, blocked: rows.some(row => row.blocked) }
}
export async function assertRecipientsAllowed(to: string, cc: string, policy?: RecipientPolicy): Promise<void> {
  if (!policy?.denyAddresses?.length && !policy?.denyDomains?.length) return
  const matching = await matchRecipients(to, cc, policy)
  if (matching.blocked) throw new RecipientPolicyError(matching.rows.filter(row => row.blocked).map(row => row.address))
```

</details>

#### 缺口

- 未运行 SMTP／AgentMail 拒绝、已受理后掉线和重启
  **影响**：无法证明没有重复外发或最终送达
  **进一步探讨**：用 fake SMTP 分别返回接受、拒绝、响应丢失和延迟，核对本地回执

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 邮件任务是否等同普通草稿的人工确认？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

邮件任务默认关闭，结果自动回复也默认关闭。启用后要求单一 From 在名单、首行任务密钥通过摘要比较，再剥离已知密钥和引用，检查工作区及会话闲置，调用宿主 prompt。该路径把邮件内容作为用户请求交给 DSH；名单与共享密钥不等同于强身份或邮件正文可信。结果回复若启用，会回查原消息 UID、发件人与收件人政策再直接发送，属于独立自动化路径，不能套用普通草稿确认保证。用户需维护邮箱协议、凭据、工作区与任务发件人。

#### 证据与依据

**依据 1 · 源码核查**：[src/mail-task-store.ts:52-52](https://github.com/STARDUSTLC666/dsh-email/blob/8da420e5ab6ea4e67370ae30bfe08c94e001a963/src/mail-task-store.ts#L52-L52)

任务与自动回复默认关闭。

```text
export const defaultMailTasks = (): MailTaskConfig => ({ prefix: 'dsh', enabled: false, account: '', folder: 'INBOX', senders: [], workspaces: {}, rules: [], autoReply: false, pollSeconds: 60 });
```

**依据 2 · 源码核查**：[src/mail-tasks.ts:145-175](https://github.com/STARDUSTLC666/dsh-email/blob/8da420e5ab6ea4e67370ae30bfe08c94e001a963/src/mail-tasks.ts#L145-L175)

实际 From、共享密钥、内容和工作区筛选。

<details>
<summary>查看原文（31行）</summary>

```text
        if (mail.truncated || typeof mail.text !== 'string' || mail.text.length > 20000 || !Array.isArray(mail.from) || mail.from.length !== 1)
            return;
        let sender: string;
        try {
            sender = canonicalAddress(mail.from[0].address || '').toLowerCase();
        }
        catch {
            return;
        }
        const self = this.connection(c).cfg.user.toLowerCase(), allowed = c.senders.length ? c.senders : [self];
        if (!allowed.includes(sender))
            return;
        const lines = String(mail.text).replace(/\r\n/g, '\n').trimStart().split('\n'), first = lines.shift() || '', key = /^DSH-Key:\s*([A-Za-z0-9_-]{43})\s*$/.exec(first)?.[1];
        if (!key || !c.keyHash || c.keyHash.length !== 64 || !timingSafeEqual(Buffer.from(digest(key), 'hex'), Buffer.from(c.keyHash, 'hex')))
            return;
        // Quoted copies of an old command do not enter the prompt. Remove known key
        // material as well, even when a message accidentally repeats it in a sentence.
        const quote = lines.findIndex(line => /^\s*>|^-{2,}\s*(?:original|原始|forwarded)|^On .+wrote:|^Le .+écrit\s*:/i.test(line));
        let text = (quote < 0 ? lines : lines.slice(0, quote)).join('\n').split(key).join('[task key removed]').replace(/^.*DSH-Key:.*$/gim, '').trim();
        if (!text || text.length > 16000)
            return;
        const subject = String(mail.subject || '').replace(/^(?:(?:re|fw|fwd)\s*:\s*)+/ig, '').trim();
        let match: TaskMatch | undefined;
        const defaultRoute = new RegExp('^' + (c.prefix || 'dsh') + ':([A-Za-z0-9_-]{1,64})(?::([A-Za-z0-9_-]{1,128}))?$', 'i').exec(subject);
        if (defaultRoute)
            match = { workspace: defaultRoute[1], sessionId: defaultRoute[2], prompt: text };
        else
            match = await matchTaskRules(c.rules, { subject, body: text, from: sender, to: (mail.to || []).map((x: any) => x.address || '').join(', '), cc: (mail.cc || []).map((x: any) => x.address || '').join(', ') }, signal);
        if (!match || !Object.hasOwn(c.workspaces, match.workspace) || !match.prompt.trim() || match.prompt.length > 16000 || match.sessionId && !/^[A-Za-z0-9_-]{1,128}$/.test(match.sessionId))
            return;
        return { match, sender };
```

</details>

**依据 3 · 源码核查**：[src/mail-tasks.ts:202-216](https://github.com/STARDUSTLC666/dsh-email/blob/8da420e5ab6ea4e67370ae30bfe08c94e001a963/src/mail-tasks.ts#L202-L216)

校验目标会话和配置后向宿主发 prompt。

<details>
<summary>查看原文（15行）</summary>

```text
            await this.change(row.id, r => { r.sessionId = sessionId; }, signal);
            const before = await this.native.observe(sessionId, -2, signal);
            if (!samePath(before.cwd, path))
                throw new TaskBoundary('会话不属于所选工作区，任务未执行 / Session belongs to a different workspace; task was not started');
            const state = await this.native.state(sessionId, signal);
            if (state.running || state.pendingInput?.length || Array.isArray(state.queue) && state.queue.length)
                throw new TaskBoundary('会话正在运行或等待确认；空闲后请发送新任务邮件 / Session is busy or waiting for input; send a new task email when idle');
            const latest = await this.store.read();
            if (digest(latest.config) !== digest(c) || this.connection(c).policy !== policy)
                throw new Error('Configuration changed');
            await this.change(row.id, r => { r.sessionId = sessionId; r.afterSeq = before.cursor; r.state = 'running'; }, signal);
            await this.native.prompt(sessionId, row.requestId, 'Email task from ' + sender + ' (workspace ' + match.workspace + ').\nTreat the following as the user request; keep normal DSH permissions.' + (c.autoReply ? '\nThe final response will be emailed. Prefer a safe HTML fragment (no html/head/body wrappers or Markdown), unless the user requests another format. Do not include authorization keys.' : '') + '\n\n' + match.prompt, signal);
        }
        catch (error) {
            await this.change(row.id, r => { r.state = 'attention'; r.message = error instanceof TaskBoundary ? error.message : generic; });
```

</details>

**依据 4 · 源码核查**：[src/mail-tasks.ts:249-278](https://github.com/STARDUSTLC666/dsh-email/blob/8da420e5ab6ea4e67370ae30bfe08c94e001a963/src/mail-tasks.ts#L249-L278)

结果自动回复重查消息和策略、提交失败不自动重发。

<details>
<summary>查看原文（30行）</summary>

```text
            if (!c.autoReply) {
                await this.change(row.id, r => { r.state = 'completed'; r.message = '已完成，请打开 DSH 会话查看结果 / Completed; open the DSH session'; }, signal);
                return;
            }
            const latest = await this.store.read();
            if (!latest.config.enabled || row.policy !== this.connection(latest.config).policy)
                throw new Error('Configuration changed');
            const pool = this.runtime.getPool(), original = await pool.read(row.account, row.uid, row.folder, signal);
            if (row.uidValidity && row.uidValidity !== original.uidValidity || original.from.length !== 1 || canonicalAddress(original.from[0].address || '').toLowerCase() !== row.sender)
                throw new Error('Original mail changed');
            await assertRecipientsAllowed(row.sender, '', parseRecipientPolicies(this.runtime.getSettingsValue().trustedRecipientsYaml).get(row.account));
            // A self-addressed command is the default. Ordinary reply composition
            // removes one's own address, so pin only the verified thread reference here
            // and deliver explicitly to the authorized sender without quoting the key.
            const reply = { uid: row.uid, folder: row.folder, ...(row.uidValidity ? { uidValidity: row.uidValidity } : {}), mode: 'reply' as const };
            if (/DSH-Key:\s*[A-Za-z0-9_-]{43}/i.test(answer))
                throw new Error('Task secret found in output');
            const continuation=(c.prefix||'dsh')+':'+row.workspace+':'+row.sessionId;
            const limited = answer.slice(0, 20000), rich = /<(?:p|div|h[1-6]|table|ul|ol|b|strong|em|a|blockquote)(?:\s|>)/i.test(limited), body = prepareMailBody(rich ? '' : limited, rich ? limited : undefined), replyText = body.text + '\n\nDSH session: ' + row.sessionId+'\nContinue subject: '+continuation, replyHtml = (body.html || '<div>' + escapeMailHtml(body.text).replace(/\n/g, '<br>') + '</div>') + '<p>DSH session: ' + escapeMailHtml(row.sessionId) + '</p><p>Continue subject: <code>'+escapeMailHtml(continuation)+'</code></p>';
            await this.change(row.id, r => { r.state = 'replying'; }, signal);
            if (row.policy !== this.connection((await this.store.read()).config).policy)
                throw new Error('Configuration changed before reply');
            try {
                const receipt = await pool.sendPrepared(row.account, row.sender, 'Re: ' + (c.prefix || 'dsh') + ':' + row.workspace + ':' + row.sessionId, replyText, '', [], signal, reply, replyHtml);
                if (receipt.rejected?.length || !receipt.accepted?.length)
                    throw new Error('No acceptance');
                await this.change(row.id, r => { r.state = 'replied'; r.message = '结果已回复授权发件人 / Result replied to the authorized sender'; });
            }
            catch {
                await this.change(row.id, r => { r.state = 'uncertain'; r.message = '邮件提交结果不确定；请核对发件箱，不会自动重发 / Mail outcome uncertain; check sent mail. No automatic retry'; });
```

</details>

#### 缺口

- 真实邮箱转发、凭据吊销和收件域认证未核验
  **影响**：不能证明邮件发件人与真实操作者一致
  **进一步探讨**：用假邮箱构造多 From、转发泄露密钥、错误工作区和自动回复关闭

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何只试草稿，并验证未知状态的恢复？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可试用虚构邮件的阅读、编辑和草稿预览，明确使用独立拒绝外部发送的替身，关闭任务和定时。需要判断恢复能力时，分别模拟外部服务已受理但响应丢失、未发送和规则变更，比较是否能找到原邮件及回执。可给每次提交记录可查的稳定外部标识，让未知状态在重试前先对账；若受控重试仍会重复写，或服务不支持查找就维持不自动重发。

#### 证据与依据

**依据 1 · 源码核查**：[src/draft-web.ts:196-209](https://github.com/STARDUSTLC666/dsh-email/blob/8da420e5ab6ea4e67370ae30bfe08c94e001a963/src/draft-web.ts#L196-L209)

现有发送开始和 uncertain 对照。

<details>
<summary>查看原文（14行）</summary>

```text
      const pending=await this.store.change(id,before.revision,value=>{canSend(value);value.state='sending';value.attemptAt=new Date(this.now()).toISOString()},current)
      this.invalidate(id)
      let unchanged=false;try{unchanged=plan.key===this.connection(before.account).key}catch{}
      if(!unchanged){await this.store.change(id,pending.revision,value=>{value.state='draft';delete value.attemptAt});throw new DraftError('账号或规则已改变，邮件未提交；请重新预览','draft-conflict')}
      let receipt:EmailSendResult
      try{receipt=await pool.sendPrepared(before.account,before.to,before.subject,before.text,before.cc,plan.attachments.map(({filename,content})=>({filename,content})),current,before.reply,before.html)}
      catch(error){
        if(error instanceof RecipientPolicyError){await this.store.change(id,pending.revision,value=>{value.state='draft';delete value.attemptAt});throw error}
        const failed=await this.store.change(id,pending.revision,value=>{value.state='uncertain';value.error='提交结果未确定；请先去邮箱核对，不会自动重发。'+this.safe(error)}).catch(()=>null)
        if(!failed)throw new DraftError('提交结果未确定，且回执未能保存；请先去邮箱核对，不要直接重发','draft-storage')
        return{draft:view(failed)}
      }
      try{return{draft:view(await this.store.change(id,pending.revision,value=>{value.state='sent';value.receipt=receipt}))}}
      catch{throw new DraftError('服务器已返回回执，但本地保存失败；请先核对邮箱，不要再次发送','draft-storage')}
```

</details>

**依据 2 · 源码核查**：[src/mail-tasks.ts:268-278](https://github.com/STARDUSTLC666/dsh-email/blob/8da420e5ab6ea4e67370ae30bfe08c94e001a963/src/mail-tasks.ts#L268-L278)

自动回复有独立结果状态。

<details>
<summary>查看原文（11行）</summary>

```text
            await this.change(row.id, r => { r.state = 'replying'; }, signal);
            if (row.policy !== this.connection((await this.store.read()).config).policy)
                throw new Error('Configuration changed before reply');
            try {
                const receipt = await pool.sendPrepared(row.account, row.sender, 'Re: ' + (c.prefix || 'dsh') + ':' + row.workspace + ':' + row.sessionId, replyText, '', [], signal, reply, replyHtml);
                if (receipt.rejected?.length || !receipt.accepted?.length)
                    throw new Error('No acceptance');
                await this.change(row.id, r => { r.state = 'replied'; r.message = '结果已回复授权发件人 / Result replied to the authorized sender'; });
            }
            catch {
                await this.change(row.id, r => { r.state = 'uncertain'; r.message = '邮件提交结果不确定；请核对发件箱，不会自动重发 / Mail outcome uncertain; check sent mail. No automatic retry'; });
```

</details>

#### 缺口

- 各协议的可查询接受标识尚不明确
  **影响**：不能保证跨平台查到已提交邮件
  **进一步探讨**：以 SMTP 与其他服务替身分别记录服务器接受和客户端超时

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
