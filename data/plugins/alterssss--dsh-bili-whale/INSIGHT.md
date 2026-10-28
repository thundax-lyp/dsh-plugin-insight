# dsh-bili-whale

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[8b0009f](https://github.com/Alterssss/dsh-bili-whale/tree/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6)

<!-- BEGIN META -->
[![GitHub ★ 616](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=616&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Alterssss/dsh-bili-whale)
<!-- END META -->

> **功能**：以作息、持续会话和日记组织 B站 内容阅读及有限分享互动的 DSH 插件

> **亮点**：将持续会话/人设、作息、内容工具与流量/未知发送保护组合；真正工程亮点是跨进程预算预留、未知不重发和账号草稿绑定，不是“真看懂”或拟人意识。[Q01](#research-q01) [Q02](#research-q02) [Q04](#research-q04)

> **主要限制**：文档/Host/tool默认与预算承诺不统一，不能按README猜新装保守状态；prompt投递不是业务完成，dry/go旗标不是可信人审，code0也不等公开送达。[Q03](#research-q03) [Q05](#research-q05)

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
  - [Q01 · 养鱼工作流的真实增量与调度完成范围？](#detail-section-11)
  - [Q02 · 流量层怎样防并发和未知发送重放？](#detail-section-12)
  - [Q03 · 默认保守和硬预算的文档能直接信吗？](#detail-section-13)
  - [Q04 · QR和手动Cookie如何保留旧态并避免草稿跨号？](#detail-section-14)
  - [Q05 · 分享、回复与公开成功如何定义？](#detail-section-15)
  - [Q06 · 全成本和当前采用建议是什么？](#detail-section-16)
  - [Q07 · 统一配置与任务回执怎样证伪？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：愿配置专用账号并审核内容/互动的个人用户，希望形成持续兴趣阅读与留档。

人工搜索收藏/日记与显式聊天提醒；没有同任务运行对照，不把随机作息当个性化准确。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 作息与持续会话 | 组织兴趣阅读和日记 | 投递不是执行，默认多处需核 |
| 内容与互动CLI | 读视频/字幕/评论并可选分享 | dry/go不等独立授权，公开另验 |
| 流量与账号保护 | 预算、防重、unknown及同号草稿 | 本地机制非平台幂等/全部通道保证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 相容DSH/sessionController与真Node | 调度必需 | 运行CLI与投递 | Electron主程序不是Node，找不到不注册timer |
| B站凭据与模型/网络 | 内容和互动必需 | 读内容/回复与分享 | 风控/配额/目的地需核 |
| 专用工作区/日记与状态存储 | 持续运行必需 | 恢复与对账 | 坏状态停止而非重建猜测 |
| ffmpeg/内容工具与通知配置 | 对应操作必需 | 抽帧和渠道推送 | 全链可用性未测，通知失败非评论未发 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户隔离账号、数据与真正Node | 先不启调度/写操作 |
| 2 | 用户核Host/CLI/scheduler有效配置 | 新装/局部旧文件一致，不能照README假定 |
| 3 | 手动只读和草稿，核内容来源与目标 | prompt回执不算报告/分享成功 |
| 4 | 分别核批准、提交/rpid和公开状态 | unknown先查不重发，错号或超预期请求即停 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Node/依赖/账号与存储资源未知 | 配置/登录/有效默认与隐私核查 | 多默认消费者需对齐 |
| 持续使用 | 模型、轮询、视频/抽帧、通知资源未知 | 看内容依据/日记/互动审核 | 字符减少不等token收益 |
| 失败恢复 | 失败预算预留、对账与备份资源未知 | 查unknown、风控/坏状态与账号草稿 | 未知不重发，需人工处理 |
| 退出 | 凭据/日记/状态保留未知 | 停scheduler/监听、核子进程和账号授权 | 停提示不自动撤回外部内容 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 持续投递 | single-flight、串行session与首投人设 | 任务执行和内容理解 |
| 防重/流量 | wx锁、预算预留、unknown不重发 | 全写通道/平台公开与exactly-once |
| 账号保护 | 验证、草稿同号、权限临时文件 | 真扫码/OS/Host验收 |
| 默认克制 | 存在配置和冷却机制 | Host/tool/raw默认漂移，README不能直接证明 |

> **思考**：文档/Host/tool默认与预算承诺不统一，不能按README猜新装保守状态；prompt投递不是业务完成，dry/go旗标不是可信人审，code0也不等公开送达。[Q03](#research-q03) [Q05](#research-q05)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将持续会话/人设、作息、内容工具与流量/未知发送保护组合；真正工程亮点是跨进程预算预留、未知不重发和账号草稿绑定，不是“真看懂”或拟人意识。[Q01](#research-q01) [Q02](#research-q02) [Q04](#research-q04)

traffic原子预算与unknown、credential串行同号草稿保护、session投递后保存失败不重试可借鉴；多份defaults、prompt/业务混淆及脚本旗标授权的长期维护不可忽略。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04) [Q05](#research-q05)

<a id="detail-section-5"></a>

### 1.4 主要限制

文档/Host/tool默认与预算承诺不统一，不能按README猜新装保守状态；prompt投递不是业务完成，dry/go旗标不是可信人审，code0也不等公开送达。[Q03](#research-q03) [Q05](#research-q05)

<a id="detail-section-6"></a>

### 1.5 使用建议

观察无人值守；隔离账号先手动只读/草稿并关闭监听分享，核有效配置/出站与账号。请求超预期、跨号、未知重发或内容无依据即停调度和写通道，回人工收藏聊天。[Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

调度/投递、流量预留unknown及凭据保护为源码支持；配置漂移为确认实现事实，最终新装行为需运行核对。内容理解/省费/持续价值未知；统一配置与收据为未来假设。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、lib/index.js、lib/scheduler.js、lib/session-delivery.js、lib/auth.js、lib/credentials.js、tools/lib/config.mjs、tools/lib/traffic.mjs、tools/commands/comment.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根118个tracked文件统计；深审Host配置/路由、scheduler/session-delivery、traffic、QR/credentials、comment及tool defaults。未全审全部视频/私信/直播/通知写通道，不执行扫码/模型/平台请求或通知。 本轮重新沿固定提交检查调度、实际工具约束、跨进程状态、外部发送和恢复边界；未调用B站服务或目标代码。
- 下一步：全新/空/局部旧/完整配置四类启动对齐有效值，再做双进程同操作、回执丢、慢prompt/保存失败、待审换号和重启矩阵；区分投递/执行/公开，比较同窗口人工收藏的全成本与内容质量。

**分析版本**

- **仓库**：[Alterssss/dsh-bili-whale](https://github.com/Alterssss/dsh-bili-whale)
- **版本号**：0.4.6（[固定提交 8b0009f](https://github.com/Alterssss/dsh-bili-whale/tree/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证统一版本化有效配置和分层任务收据，分计划/投递/执行/提交未知/公开，绑定账号目标/批准与rpid；新旧配置、慢prompt/重启/回执丢矩阵任一分叉或重复即否定，再比较人工复核收益。[Q07](#research-q07)

全新/空/局部旧/完整配置四类启动对齐有效值，再做双进程同操作、回执丢、慢prompt/保存失败、待审换号和重启矩阵；区分投递/执行/公开，比较同窗口人工收藏的全成本与内容质量。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 14 | 6298 | — | — | 39498 |
| .js | source | 9 | 2256 | 1878 | 300 | — |
| .mjs | test | 32 | 1813 | 1741 | 73 | — |
| .mjs | source | 63 | 6398 | 5136 | 1130 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-28），可前往 [GitHub Issues](https://github.com/Alterssss/dsh-bili-whale/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：持续B站 Agent如何约束配置、账号、投递与外部发送，拟人收益能否成立？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 养鱼工作流的真实增量与调度完成范围？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

面向愿意给专用B站账号配置兴趣、作息和模型会话的个人用户，目标是持续筛选内容、日记和有限分享，合格交付须内容来源可核、互动符合范围且能停止。相对临时搜索和手工收藏，它把随机作息计划、持续session、人设/日记恢复与通知组织起来；“有日子/看懂”是作者设想，不是模型理解证明。scheduler单flight保留等待操作，不因15分钟超时就再投，delivery串行选择session、注入人设并prompt；prompt成功后才记persona标志，保存失败不诱使重投。这证明消息进入宿主会话，不证明Agent真正看完、写对日记或外部分享公开，任务层还需独立回执。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:62-72](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/README.md#L62-L72)

作者作息、内容与分享目标。

<details>
<summary>查看原文（11行）</summary>

```text
## 它能做什么

- **自己醒**：在你设定的窗口里**随机一个时刻**醒来（不是整点）；**30% 概率今天不想看**（它也有权利不看）
- **真看懂**：读官方字幕 + 弹幕热区 + 热评 + **抽帧看画面**（六路互补，没字幕的视频也能看懂）
  - 没字幕轨、但画面里有**硬字幕**？用 `debrief <BV> --substrip` —— 把字幕带按时间裁下来拼成一张图，**整片台词一张图读完**
- **写日记**：给**你**的那本（"给主人的信"，有细节有情绪）+ 给**她自己**的那本（不加滤镜）
- **分享给你**：从深读过的里挑 2–3 条，发一条**带 @ 你**的评论（每天合计 ≤3）
- **听人找它**：评论区监听（全天开关 + 间隔可调）+ 直播间弹幕（**独立开关、实时回、可只回你**）
  - **回复分两侧**：你是主人 → **直接回** ✓；其他人 → **先写草稿推给你审** ✓（草稿会推到你的推送渠道）
  - **沉默会衰减**：连续 3 天没有任何表态 → 分享额度开始降 → **第 7 天归零**（不再分享），**但日记照写** ✓
- **克制**：撞到风控（验证码/限流/判刷屏）**立刻停手**并报告你
```

</details>

**依据 2 · 源码核查**：[lib/scheduler.js:247-279](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/lib/scheduler.js#L247-L279)

single-flight、timeout保留和prompt后完成计划。

<details>
<summary>查看原文（33行）</summary>

```text
  async function tick() {
    // A timeout is not proof of failed delivery. Keep single-flight ownership
    // until the existing operation settles; do not enqueue the same work again.
    if (waking) {
      if (!wakingWarned && Date.now() - wakingAt > 15 * 60_000) {
        wakingWarned = true
        log('[bili-whale] 生物钟唤醒等待超时：结果未确认，保留任务锁以避免重复投递；请检查宿主会话，勿直接重发')
      }
      return
    }
    if (stopped || waking || !ctx.sessionController || sheIsBusy()) return
    waking = true
    wakingAt = Date.now()
    wakingWarned = false
    try {
      const st = makePlan(readNightConfig(dshHome), readState() ?? {})
      writeState(st)
      if (st.action === 'done' || Date.now() < st.atMs) return
      if (stopped) return
      if (stopped) return
      const text = networkPaused() ? `${personaLine()}\n【请求保护暂停】本轮仅整理本地日记，记录暂停原因。不要浏览、评论或私信，不把未发生的浏览写成经历；等待保护恢复。` : st.action === 'skip' ? [
        personaLine(), '【今晚不看】' + st.reason,
        '照常写两本日记，说明本次跳过的理由；记录 diary log night-skip。',
        ...diaryPushLines(),
      ].join('\n') : wakePrompt(st, personaLine(), Number(readCfgNow().night?.maxVideos ?? 5) || 5, String(readCfgNow().share?.via ?? 'dm'))
      await delivery.send({ requestId: 'bili-whale-' + Date.now(), sessionId,
        mode: 'queue', content: [{ type: 'text', text }] }, lifecycle.signal)
      const completed = completePlan(st)
      writeState(resetAfterDelivery ? historyOf(completed) : completed)
      resetAfterDelivery = false
      busyUntil = Date.now() + COOLDOWN_MS
      log('[bili-whale] 已投递 ' + st.action + ' · ' + st.atText)
    } catch (e) { log('[bili-whale] 唤醒失败，下一轮重试：' + e.message) }
```

</details>

**依据 3 · 源码核查**：[lib/session-delivery.js:25-39](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/lib/session-delivery.js#L25-L39)

串行投递与pending request。

<details>
<summary>查看原文（15行）</summary>

```text
    send(request,signal,{retainUntilAck=false}={}) {
      const job=tail.then(async()=>{
        signal?.throwIfAborted()
        const cfg=config(),days=Number(cfg.sessionRotateDays??0),once=cfg.personaOncePerSession===true
        const persist=retainUntilAck||!!state.pendingRequest||once||(Number.isFinite(days)&&days>0)
        const rotating=!state.pendingRequest&&Number.isFinite(days)&&days>0&&now()-state.startedAt>=days*86400000&&now()-lastDelivered>=8*60000&&!isBusy()
        let next=rotating?{id:crypto.randomUUID(),startedAt:now(),rotatedFrom:state.id}:state
        if(retainUntilAck){
          if(!request.requestId)throw Error('可靠交付需要 requestId')
          next={...next,pendingRequest:request.requestId}
        }
        let created = null
        if(!ready||rotating) {
          try {created = await controller.create({sessionId:next.id,cwd})}
          catch(e) {if(rotating)throw e;log('沿用现有会话；若投递失败将保留重试状态')}
```

</details>

**依据 4 · 源码核查**：[lib/session-delivery.js:53-74](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/lib/session-delivery.js#L53-L74)

prompt成功才记状态、落盘失败不重试。

<details>
<summary>查看原文（22行）</summary>

```text
        if(persist)save(next)
        if(rotating)log(`会话轮换：${state.id} → ${next.id}；旧会话保留`)
        state=next;ready=true;onSession(state.id)
        signal?.throwIfAborted()
        const block=persona(),fingerprint=crypto.createHash('sha256').update(block).digest('hex')
        const include=!once||bootFirst||state.personaHash!==fingerprint
        const reminder=`人设依据：${path.join(process.env.USERPROFILE||process.env.HOME||'.','.bili-ai/persona.md')}；上下文缺失时重读。`
        const diary=`先读本地日记恢复记忆：${path.join(dshHome,'whale-diary.md')} 和 ${path.join(dshHome,'whale-diary-private.md')}；不要将旧会话未确认事项当成已完成。`
        const prefix=[include?block:reminder,...((!state.deliveredAt||bootFirst)?[diary]:[])].filter(Boolean).join('\n')
        const content=[...(request.content??[])]
        if(content[0]?.type==='text')content[0]={...content[0],text:prefix+'\n'+content[0].text}
        else content.unshift({type:'text',text:prefix})
        try {await controller.prompt({...request,sessionId:state.id,content},signal)}
        catch(e) {ready=false;throw e}
        booted=true   // 投递成功了才算
        lastDelivered=now()
        state={...state,personaHash:fingerprint,deliveredAt:lastDelivered}
        // Delivery succeeded: persistence failure must not make callers retry it.
        if(persist)try {save(state)} catch(e){log('会话已投递，但保存人设标记失败：'+e.message)}
      })
      tail=job.catch(()=>{})
      return job
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 流量层怎样防并发和未知发送重放？

**研究主题**：工程质量与复用、功能与机制

#### 完整回答

traffic guard对B站域名生效，跨CLI/Host共享目录状态，wx独占锁保护预算预留/状态更新，读坏状态或锁忙停止；临时文件rename提交。请求前按cookie摘要分账号，计算去时间/CSRF字段的操作指纹，写操作已有pending/unknown/confirmed就拒重复，并先占预算；调度间隔跨进程约束实际dispatch。发送后遇无法确认响应/异常记unknown，禁止自动重发，需先回读人工resolve；这是比“报错就重试”更诚实的副作用语义。边界是本地指纹和状态，不是平台幂等键；换正文/账号/数据目录可能成为新操作，明确业务拒绝会删记录允许另尝试。预算包含失败预留，不能拿成功评论数量还原请求总量。

#### 证据与依据

**依据 1 · 源码核查**：[tools/lib/traffic.mjs:30-64](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/tools/lib/traffic.mjs#L30-L64)

wx锁、损坏停止和原子状态写。

<details>
<summary>查看原文（35行）</summary>

```text
// One state and lock per local plugin data directory, shared by CLI children and
// the Electron host. The lock covers reservation/update only, never network I/O.
export function createTrafficGuard({ directory, transport = (...a) => globalThis.fetch(...a), settings = riskSettings, now = Date.now, sleep = delay } = {}) {
  const stateFile = path.join(directory, 'traffic-state.json'), lockFile = stateFile + '.lock'
  function read() {
    try { const s = JSON.parse(fs.readFileSync(stateFile, 'utf8')); if (!s || typeof s !== 'object') throw Error('invalid state'); return s }
    catch (e) { if (e.code === 'ENOENT') return {}; throw new TrafficError('请求保护状态损坏，请检查 traffic-state.json；已停止网络请求') }
  }
  async function locked(fn) {
    fs.mkdirSync(directory, { recursive: true })
    const deadline = Date.now() + 10000
    let fd
    while (fd === undefined) {
      try { fd = fs.openSync(lockFile, 'wx'); fs.writeFileSync(fd, JSON.stringify({ pid: process.pid })) }
      catch (e) {
        if (e.code !== 'EEXIST') throw e
        try {
          const age = Date.now() - fs.statSync(lockFile).mtimeMs
          let pid
          try { pid = JSON.parse(fs.readFileSync(lockFile, 'utf8')).pid } catch {}
          let dead = false
          if (Number.isInteger(pid) && pid > 0) { try { process.kill(pid, 0) } catch (x) { dead = x.code === 'ESRCH' } }
          if (dead || (!pid && age > 10000)) { fs.unlinkSync(lockFile); continue }
        } catch {}
        if (Date.now() >= deadline) throw new TrafficError('请求保护锁繁忙，本次停止；请稍后再试')
        await delay(25)
      }
    }
    try {
      const s = read(), result = fn(s)
      const temp = stateFile + '.' + process.pid + '.tmp'
      try { fs.writeFileSync(temp, JSON.stringify(s)); fs.renameSync(temp, stateFile) }
      finally { fs.rmSync(temp, { force: true }) }
      return result
    } finally { fs.closeSync(fd); fs.unlinkSync(lockFile) }
```

</details>

**依据 2 · 源码核查**：[tools/lib/traffic.mjs:107-127](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/tools/lib/traffic.mjs#L107-L127)

重复指纹/预算预留及请求队列。

<details>
<summary>查看原文（21行）</summary>

```text
    try { reservation = await locked(s => {
      blocked(s, account)
      s.accounts ??= {}; s.operations ??= {}
      const a = s.accounts[account] ??= {}
      const date = new Date(timestamp).toLocaleDateString('sv-SE')
      if (a.date !== date) Object.assign(a, { date, readDay: 0, writeDay: 0 })
      if (!a.hourAt || timestamp - a.hourAt >= 3600000) Object.assign(a, { hourAt: timestamp, readHour: 0, writeHour: 0 })
      for (const [key, item] of Object.entries(s.operations)) if (item.status !== 'unknown' && item.status !== 'pending' && timestamp - item.at > 86400000) delete s.operations[key]
      if (writing) {
        if (s.operations[id]) throw new TrafficError(`相同操作已提交或结果待核查，禁止重复发送；操作 ID：${id}`)
        if (Object.keys(s.operations).length >= 2000) throw new TrafficError('发送记录已满，请先核查未确认操作')
        const gap = (url.pathname.endsWith('/send_msg') ? cfg.dmGapSec : cfg.writeGapSec) * 1000
        if (a.lastWrite && timestamp - a.lastWrite < gap && !url.pathname.endsWith('/reply/del')) throw Object.assign(new TrafficError('写操作冷却中，请稍后再发送'), { cooldownMs: a.lastWrite + gap - timestamp })
        if ((a.writeHour ?? 0) >= cfg.writeHourly || (a.writeDay ?? 0) >= cfg.writeDaily) throw new TrafficError('已达到本地写操作预算，本次不发送')
      } else if ((a.readHour ?? 0) >= cfg.readHourly || (a.readDay ?? 0) >= cfg.readDaily) throw new TrafficError('已达到本地读取预算，请等待预算窗口恢复')
      const slot = Math.max(timestamp, Number(s.nextAt ?? 0))
      if (slot - timestamp > 30000) throw new TrafficError('请求队列已满，本次停止')
      s.nextAt = slot + cfg.minGapMs
      if (writing) { a.writeHour=(a.writeHour??0)+1; a.writeDay=(a.writeDay??0)+1; a.lastWrite=timestamp; s.operations[id]={at:timestamp,status:'pending',endpoint:url.pathname} }
      else { a.readHour=(a.readHour??0)+1; a.readDay=(a.readDay??0)+1 }
      return { slot }
```

</details>

**依据 3 · 源码核查**：[tools/lib/traffic.mjs:136-180](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/tools/lib/traffic.mjs#L136-L180)

dispatch互斥、超时/风控与状态。

<details>
<summary>查看原文（45行）</summary>

```text
    let dispatched = false
    try {
      await sleep(Math.max(0, reservation.slot-now()))
      options.signal?.throwIfAborted()
      for (;;) {
        const wait = await locked(s => {
          blocked(s, account)
          if (s.active && Number(s.active.until)>now()) {
            let dead=false
            try { process.kill(s.active.pid,0) } catch(e) {dead=e.code==='ESRCH'}
            if(!dead) return 100
          }
          const remaining = Math.max(0, Number(s.lastDispatch ?? 0)+cfg.minGapMs-now())
          if (!remaining) { s.lastDispatch=now();s.active={token:requestToken,pid:process.pid,until:now()+35000} }
          return remaining
        })
        if (!wait) break
        await sleep(wait)
        options.signal?.throwIfAborted()
      }
      const signal = options.signal ? AbortSignal.any([options.signal, AbortSignal.timeout(30000)]) : AbortSignal.timeout(30000)
      dispatched = true
      const response = await transport(input, { ...options, signal })
      let payload
      if ((response.headers?.get('content-type') ?? '').includes('json')) {
        try { payload = await response.clone().json() } catch {}
      }
      const code = Number(payload?.code)
      const risk = [412,429].includes(response.status) || [-412,-352,-799,-509,-10403].includes(code)
      const session = (new Headers(headers).get('cookie')?.match(/(?:^|;)\s*SESSDATA=([^;]+)/i) ?? [])[1]
      const authenticated = !!session && !['undefined','null'].includes(session)
      const manual = [12015,-105].includes(code) || (authenticated && (code === -101 || response.status === 401))
      const retry = response.headers?.get('retry-after')
      const retryMs = retry ? (/^\d+(\.\d+)?$/.test(retry) ? Number(retry)*1000 : Math.max(0, Date.parse(retry)-now())) : 0
      await locked(s => {
        if (s.active?.token===requestToken) delete s.active
        if (risk) {
          s.streak = Math.min(8, Number(s.streak ?? 0)+1)
          s.until = Math.max(Number(s.until??0),now()+Math.max(Number.isFinite(retryMs)?retryMs:0,Math.min(1800000,300000*2**(s.streak-1))))
          s.reason = `HTTP ${response.status} / code ${Number.isFinite(code)?code:'unknown'}`
          s.riskEndpoint = url.pathname
        } else if (code === 0 && s.riskEndpoint === url.pathname && now() >= Number(s.until??0)) s.streak = 0
        if (manual) { s.manual ??= {}; s.manual[account] = {at:now(),code:Number.isFinite(code)?code:response.status} }
        if (id) {
          if (response.ok && code === 0) s.operations[id].status = 'confirmed'
```

</details>

**依据 4 · 源码核查**：[tools/lib/traffic.mjs:179-205](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/tools/lib/traffic.mjs#L179-L205)

unknown保持、发送不确定禁止重发和人工resolve。

<details>
<summary>查看原文（27行）</summary>

```text
        if (id) {
          if (response.ok && code === 0) s.operations[id].status = 'confirmed'
          else if (payload && Number.isFinite(code) && code !== 0) delete s.operations[id]
          else s.operations[id].status = 'unknown'
        }
        s.last = { at: now(), endpoint: url.pathname, method, http: response.status, code: Number.isFinite(code)?code:null }
      })
      return response
    } catch (e) {
      await locked(s => { if(s.active?.token===requestToken)delete s.active; if (id) { if (!dispatched) delete s.operations[id]; else if (s.operations[id]) s.operations[id].status='unknown' } })
      if (dispatched && writing) throw new TrafficError(`发送结果不确定，已禁止自动重发。请回读核查；操作 ID：${id}`)
      throw e
    }
  }
  const inflight = new Map()
  return {
    fetch: (input, options={}) => {
      const url=new URL(typeof input==='string'||input instanceof URL ? input : input.url)
      if (!isBili(url) || String(options.method??input.method??'GET').toUpperCase()!=='GET' || options.signal) return guarded(input,options)
      const key=identity(options.headers??input.headers??{})+':'+url.href
      if(!inflight.has(key)) inflight.set(key,guarded(input,options).finally(()=>inflight.delete(key)))
      return inflight.get(key).then(r=>r.clone())
    },
    status: () => read(),
    pauseReason: headers => { try { blocked(read(),identity(headers));return null } catch(e) {return e.message} },
    resume: headers => locked(s => { if (s.manual) delete s.manual[identity(headers)] }),
    resolve: (id, outcome) => locked(s => { if (!s.operations?.[id]) throw new TrafficError('找不到操作 ID'); if (outcome === 'not-sent') delete s.operations[id]; else if (outcome === 'confirmed') s.operations[id].status='confirmed'; else throw new TrafficError('outcome 必须是 confirmed 或 not-sent') }),
```

</details>

#### 缺口

- 崩溃/锁恢复/回执丢失在多进程下未实测，平台可见状态也未核。
  **影响**：不能承诺exactly-once或所有命令都经过该guard。
  **进一步探讨**：两CLI和Host并发同操作、网络响应丢失及进程中断，核无重发/可对账，再逐写通道确认调用guard。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 默认保守和硬预算的文档能直接信吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能直接套用。README称comment监听关、dm开、oncePerPerson开；tools/config默认与其相同，但Host index.DEFAULTS相反：comment=true、dm=false、once=false，readConfig合并用户文件。scheduler又直接读raw JSON或{}，多个消费者缺字段时的默认并不统一，必须回读实际有效配置，不可按文档猜新装一定保守。另README称请求保护若干值写死不能旋钮，而riskSettings实际接受正数覆盖、minGap最低500ms、writeGap最低30s，dmGap可0；它是有下限的可配置策略，不是固定600ms/日写30的不可突破硬门。该漂移会改变轮询和账号负担，须反映采用条件，不把作者“安全默认”当证据。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:16-27](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/README.md#L16-L27)

作者保守默认表。

<details>
<summary>查看原文（12行）</summary>

```text
| 项 | 默认值 | 为什么 |
|---|---|---|
| **评论监听** | **关** ✗ | 开了就是每 60 秒一次请求，一天 1440 次 ✗ 小号扛不住 |
| **私信监听** | **开** ✓ 但 **60 秒一轮** | 私信是她唯一的"叫得应"通道，但间隔不能短 |
| **全天监听** | **关** ✗ | 只在作息窗口（默认 20:00–24:00）内听 |
| **同一个人只回一条** | **开** ✓ | 30 天内不重复骚扰同一个人 |
| **请求间隔** | **1500 ms** | 连击是最容易被判机器人的特征 |
| **读预算** | 600/时 · **3000/天** | 私信 60 秒一轮 ≈ 1440/天，留一半余量给看视频 |
| **写预算** | 12/时 · **30/天** | 评论+私信+收藏都算写 |
| **写冷却** | **120 秒** | 两次写之间至少 2 分钟 |
| **私信冷却** | **60 秒** | |
| **撞 412/429** | 暂停 5/10/20/30 分钟 | 尊重平台，别硬顶 |
```

</details>

**依据 2 · 源码核查**：[README.md:45-52](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/README.md#L45-L52)

作者硬预算与监听承诺。

```text
**① 分享前多一道「疑似 AI 评论」闸**（默认关）—— 主动 @ 分享前先采一段该视频的评论，
由当前模型逐条判；疑似比例 ≥ **30%（写死）** 就暂缓这次分享并推送到你配置的渠道。
只对「主动视频 @ 分享」生效，普通回复/动态/私信/弹幕都不走。细节见 [AI-SHARE-TRIAL.md](AI-SHARE-TRIAL.md)。

**② 请求保护层**——全局请求间隔 600ms（跨进程）、读 3000/天、写 30/天、撞 412 全局暂停、防重复发送。
这些值**写死不给旋钮**（给了也不一定按你填的走 ✗ 那不如不给）。想看真实值：`node tools/bili.mjs traffic status`。

**③ 监听与失败退避**——私信 / 评论按配置间隔轮询（默认 60 秒），无消息不降频。只有失败才翻倍退避，默认间隔下最长 15 分钟；成功读取后恢复基础间隔。平台暂停仍优先。
```

**依据 3 · 源码核查**：[lib/index.js:72-95](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/lib/index.js#L72-L95)

Host DEFAULTS实际listener不同。

<details>
<summary>查看原文（24行）</summary>

```text
const DEFAULTS = {
  sessionRotateDays: 0,
  personaOncePerSession: false,
  risk: RISK_DEFAULTS,
  owner: { mid: '', name: '' },
  night: {
    windows: [{ start: '20:00', end: '24:00', wakes: 1 }],
    skipChance: 0.3,
    minGapMin: 10, maxVideos: 5,
  },
  preferences: {
    like: ['DSH/AI 工具与插件', '鬼畜与怀旧向剪辑', '猫咪', 'Live2D/模型', 'B站生态八卦'],
    dislike: ['带货', '擦边', '标题党', '纯搬运'],
    keywords: [],
  },
  quota: { shareDaily: 3 },
  diary: { push: true, enabled: true },   // 2026-10-20：写日记不可关；只留"要不要推送"一个开关
  // ④ 2026-10-18：补上 persona / self（和 tools/lib/config.mjs 对齐 ✓ 否则设置页首次打开是空的 ✗）
  persona: { name: '', ownerTitle: '主人', selfClaim: '我' },
  self: { mid: '', name: '' },
  notify: { type: 'none', url: '', template: 'text', cmd: '' },
  listen: { comment: true, commentIntervalSec: 60, scope: 'both', oncePerPerson: false, allDay: false, dm: false, live: false, liveRoom: '', liveScope: 'owner' },
  share: { aiCommentGuard: false, aiThreshold: 30, enabled: true, via: 'comment', minScore: 13, silentAfterDays: 3, },
  toolsPath: '',
```

</details>

**依据 4 · 源码核查**：[lib/index.js:114-117](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/lib/index.js#L114-L117)

Host直接merge自己的defaults。

```text
function readConfig() {
  let user = {}
  try { user = JSON.parse(fs.readFileSync(CFG_FILE, 'utf8')) } catch { /* 没配就用默认 */ }
  return { ...merge(DEFAULTS, user), __hasUserFile: Object.keys(user).length > 0 }
```

**依据 5 · 源码核查**：[tools/lib/config.mjs:42-54](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/tools/lib/config.mjs#L42-L54)

tool defaults与README一致，形成双真相。

<details>
<summary>查看原文（13行）</summary>

```text
  // 使用者本人（分享型评论要 @ 的人）：mid 用于白名单/查询，name 用于正文里的 @昵称
  // （acc/info 查询会风控，所以 name 缓存一份；改过就用 thread 的 `@到:` 验一下）
  owner: { mid: '', name: '' },
  quota: { shareDaily: 3 },
  // 「标尺」（2026-10-18 加）：分享前必须打分，不到 share.minScore 就是"今天没有值得发的"（合法结果）
  share: { aiCommentGuard: false, aiThreshold: 30, enabled: true, via: 'comment', minScore: 13, silentAfterDays: 3 },  // 分享型（@主人）开关与评分阈值
  // 倾听（2026-10-18 补默认值，与设置页对齐）：评论区 + 直播间
  // 2026-10-24 改默认：\u8bc4\u8bba\u76d1\u542c\u9ed8\u8ba4\u5173\u3001\u79c1\u4fe1\u76d1\u542c\u9ed8\u8ba4\u5f00 \u4f46\u95f4\u9694 60 \u79d2
  //   原因：新装的号多半是刚创的小号 \u2014\u2014 \u957f\u65f6\u95f4\u76d1\u542c\u662f\u98ce\u63a7\u7684\u5934\u53f7\u98ce\u9669 \u2717
  //   \u60f3\u5f00\u5c31\u53bb\u8bbe\u7f6e\u9875\u6253\u5f00 \u2713 \u9ed8\u8ba4\u4e0d\u66ff\u4ed6\u4eec\u6253\u5f00 \u2717
  listen: { comment: false, commentIntervalSec: 60, scope: 'both', oncePerPerson: true, allDay: false, dm: true, dmIntervalSec: 60, live: false, liveRoom: '', liveScope: 'owner' },
  // 作息：windows[] = 每天允许醒来的时段（每个窗口 = 一次机会）；maxWakesPerDay 缺省 = 窗口数（硬上限 3）
  night: { windows: [{ start: '20:00', end: '24:00', wakes: 1 }], skipChance: 0.3, minGapMin: 10, maxVideos: 5 },
```

</details>

**依据 6 · 源码核查**：[tools/lib/traffic.mjs:7-25](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/tools/lib/traffic.mjs#L7-L25)

risk可覆盖和下限/0值。

<details>
<summary>查看原文（19行）</summary>

```text
export const RISK_DEFAULTS = { minGapMs: 1500, readHourly: 600, readDaily: 3000, writeHourly: 12, writeDaily: 30, writeGapSec: 120, dmGapSec: 60 }
const digest = value => crypto.createHash('sha256').update(value).digest('hex')
export function riskSettings() {
  let cfg = {}
  try { cfg = JSON.parse(fs.readFileSync(configPath, 'utf8')).risk ?? {} } catch {}
  const result = { ...RISK_DEFAULTS }
  for (const key of Object.keys(result)) {
    const n = Number(cfg[key])
    // 2026-10-23 改：dmGapSec 允许 0（主人要求「私信冷却不要」✗）
    //   其他预算类仍然是 >0 才生效 ✓（0 会被当成没填 ✓ 防手滑关掉闸门）
    if (Number.isFinite(n) && (n > 0 || key === 'dmGapSec')) result[key] = Math.max(0, Math.floor(n))
  }
  result.minGapMs = Math.max(500, result.minGapMs)
  result.writeGapSec = Math.max(30, result.writeGapSec)
  // 2026-10-23 改（主人要求）：私信冷却先不要 ✗
//   原来是 Math.max(30, ...) → 最低 30 秒，改不了 0 ✗
//   现在允许 0 = 不冷却（私信本来就一天只锁一个收信人 + 条数不限 ✓）
result.dmGapSec = Math.max(0, Number(result.dmGapSec) || 0)
  return result
```

</details>

**依据 7 · 源码核查**：[lib/scheduler.js:165-172](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/lib/scheduler.js#L165-L172)

scheduler读raw配置，非Host默认函数。

```text
  const STATE = path.join(dshHome, 'whale-night.json')
  const CFG_FILE_REF = process.env.BILI_WHALE_CONFIG || path.join(dshHome, 'bili-whale.config.json')     // 监听循环每次重读（改配置立刻生效 ✓）
  const CRED_REF = credentialsPath
  const readState = () => { try { return JSON.parse(fs.readFileSync(STATE, 'utf8')) } catch { return null } }
  // 2026-10-22：tick() 里拿不到别处闭包的 cfg ✗（实测 ReferenceError: cfg is not defined）
  //   给一个「每次现读」的小函数 —— 顺带好处：设置页一保存，下一次唤醒就用新值 ✓
  const readCfgNow = () => { try { return JSON.parse(fs.readFileSync(CFG_FILE_REF, 'utf8')) } catch { return {} } }
  const networkPaused = () => { try { const c=JSON.parse(fs.readFileSync(CRED_REF,'utf8')); return !!trafficGuard().pauseReason(makeHeaders(c)) } catch { return true } }
```

#### 缺口

- 全新/局部旧配置/设置首次保存的最终监听与预算未实际观察。
  **影响**：不能保证新用户实际行为符合默认表，可能增加请求或错过私信。
  **进一步探讨**：用不存在配置、空文件、只填owner、完整新配置四种启动，逐界面/CLI/scheduler比较有效值与实际请求；不一致先全停监听。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · QR和手动Cookie如何保留旧态并避免草稿跨号？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

QR每实例只有一个短期challenge，生成URL限制官方origin、key形状，响应有128KiB上限与超时；UI状态不回Cookie/key/refresh token。verifyAccount校验isLogin与安全MID，保存共用串行store；有待审草稿时旧账号必须可验证且MID与新号相同，否则不换号。保存前复核凭据/草稿原文未变，wx临时0600、先权限再写、fsync后rename，取消/失败保留旧态。Host route另外先isTrusted再requestRejection，服务缺失/异常strict503，并非只靠loopback。边界：具体Host合约和Windows ACL实际未验，账户凭据/日记/附件仍在本机可被有权限进程读取，不是端到端不外发。

#### 证据与依据

**依据 1 · 源码核查**：[lib/auth.js:9-47](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/lib/auth.js#L9-L47)

网络限制、响应上限和账号验证。

<details>
<summary>查看原文（39行）</summary>

```text
async function request(fetcher, url, { signal, credentials } = {}) {
  try {
    const response = await fetcher(url, {
      redirect: 'error',
      signal: AbortSignal.any([AbortSignal.timeout(15000), ...(signal ? [signal] : [])]),
      headers: {
        'user-agent': 'Mozilla/5.0', referer: PASSPORT + '/login',
        ...(credentials ? { cookie: `SESSDATA=${credentials.sessdata}; bili_jct=${credentials.bili_jct}${credentials.buvid3 ? '; buvid3=' + credentials.buvid3 : ''}` } : {}),
      },
    })
    if (!response.ok) throw Error()
    const reader = response.body.getReader()
    const chunks = []; let size = 0
    try {
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        size += value.length
        if (size > 128 * 1024) throw Error()
        chunks.push(Buffer.from(value))
      }
    } finally { await reader.cancel().catch(() => {}) }
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    if (body.code !== 0) throw Error()
    return { data: body.data, response }
  } catch {
    throw new AuthError(signal?.aborted ? '登录已取消。' : 'B 站登录请求失败，请稍后重试。')
  }
}

export async function verifyAccount(input, { fetch: fetcher = globalThis.fetch, signal } = {}) {
  const credentials = parseManualCookie(input)
  const { data } = await request(fetcher, 'https://api.bilibili.com/x/web-interface/nav', { credentials, signal })
  if (data?.isLogin !== true || !/^[1-9]\d{0,19}$/.test(String(data?.mid ?? ''))
    || (typeof data.mid === 'number' && !Number.isSafeInteger(data.mid)))
    throw new AuthError('登录验证失败，旧登录态未替换。')
  let name = typeof data.uname === 'string' ? data.uname.slice(0, 200) : ''
  for (const secret of Object.values(credentials)) if (secret) name = name.split(secret).join('[redacted]')
  return { mid: String(data.mid), name }
```

</details>

**依据 2 · 源码核查**：[lib/auth.js:50-85](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/lib/auth.js#L50-L85)

challenge/URL与UI状态边界。

<details>
<summary>查看原文（36行）</summary>

```text
/** One short-lived challenge per plugin instance. No Cookie, key or refresh token reaches the UI. */
export class QrAuth {
  constructor({ save, fetch = globalThis.fetch, now = Date.now, render = url => QRCode.toDataURL(url, { width: 220, margin: 2 }) }) {
    this.save = save; this.fetch = fetch; this.now = now; this.render = render
    this.current = null; this.nextStart = 0; this.disposed = false
  }
  state(session) {
    return { id: session.id, status: session.status, expiresAt: session.expiresAt,
      ...(session.status === 'waiting' || session.status === 'scanned' ? { image: session.image } : {}),
      ...(session.account ? { account: session.account } : {}),
      ...(session.error ? { error: session.error } : {}) }
  }
  check(session) {
    if (this.disposed || this.current !== session || session.controller.signal.aborted)
      throw new AuthError('登录流程已失效，请重新扫码。')
    if (this.now() >= session.expiresAt) { session.status = 'expired'; throw new AuthError('二维码已过期，请重新生成。') }
  }
  async start() {
    if (this.disposed) throw new AuthError('登录服务已关闭。')
    if (this.now() < this.nextStart) throw new AuthError('请稍等两秒后再生成二维码。')
    this.nextStart = this.now() + INTERVAL
    this.cancel()
    const session = { id: randomUUID(), status: 'waiting', controller: new AbortController(), expiresAt: this.now() + TTL, nextPoll: this.now() + INTERVAL }
    this.current = session
    try {
      const { data } = await request(this.fetch, PASSPORT + '/x/passport-login/web/qrcode/generate', { signal: session.controller.signal })
      this.check(session)
      let url
      try { url = new URL(data?.url) } catch { throw new AuthError('二维码响应无效，请稍后重试。') }
      if (![PASSPORT, 'https://account.bilibili.com'].includes(url.origin) || url.username || url.password
        || typeof data?.qrcode_key !== 'string' || !/^[A-Za-z0-9_-]{1,256}$/.test(data.qrcode_key))
        throw new AuthError('二维码响应无效，请稍后重试。')
      session.key = data.qrcode_key
      session.image = await this.render(url.href)
      this.check(session)
      return this.state(session)
```

</details>

**依据 3 · 源码核查**：[lib/credentials.js:43-69](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/lib/credentials.js#L43-L69)

串行、待审草稿账号和并发原文检查。

<details>
<summary>查看原文（27行）</summary>

```text
/** One writer for both QR and manual import; old credentials survive every pre-commit failure. */
export function createCredentialStore({ file, pending, verify, protect = protectCredentials }) {
  let tail = Promise.resolve()
  const save = (input, { signal, check = () => {} } = {}) => {
    const task = tail.then(async () => {
      check()
      const credentials = parseManualCookie(input)
      const oldText = read(file)
      const account = await verify(credentials, { signal })
      check()
      let items, pendingText
      try {
        pendingText = read(pending)
        items = pendingText === null ? [] : JSON.parse(pendingText).items
        if (!Array.isArray(items)) throw Error()
      } catch { throw new AuthError('无法读取待审草稿，未替换登录态；请先检查待审队列。') }
      if (items.length) {
        let oldAccount
        try { if (oldText) oldAccount = await verify(parseManualCookie(JSON.parse(oldText)), { signal }) }
        catch { /* An unverified identity is not permission to transfer old drafts. */ }
        if (!oldAccount || oldAccount.mid !== account.mid)
          throw new AuthError('仍有待审草稿，不能切换账号；请先用原账号处理或拒绝草稿，再重新登录。')
      }
      check()
      if (signal?.aborted) throw new AuthError('登录已取消，未保存。')
      if (read(file) !== oldText) throw new AuthError('登录态已在别处变化，请重新扫码。')
      if (read(pending) !== pendingText) throw new AuthError('待审草稿已变化，未替换登录态；请处理后重试。')
```

</details>

**依据 4 · 源码核查**：[lib/credentials.js:70-94](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/lib/credentials.js#L70-L94)

权限、独占临时文件与旧态保留。

<details>
<summary>查看原文（25行）</summary>

```text
      const temp = `${file}.${randomUUID()}.tmp`
      try {
        if (fs.existsSync(file) && fs.lstatSync(file).isSymbolicLink()) throw Error()
        fs.mkdirSync(path.dirname(file), { recursive: true })
        const fd = fs.openSync(temp, 'wx', 0o600)
        try {
          // Restrict the empty file before it ever contains credentials.
          protect(temp)
          check()
          fs.writeFileSync(fd, JSON.stringify(credentials, null, 2) + '\n')
          fs.fsyncSync(fd)
        } finally { fs.closeSync(fd) }
        fs.renameSync(temp, file)
      } catch (error) {
        if (error instanceof AuthError) throw error
        throw new AuthError('凭据保存失败，旧登录态未替换；请检查文件权限。')
      } finally {
        if (fs.existsSync(temp)) fs.unlinkSync(temp)
      }
      return account
    })
    tail = task.catch(() => {})
    return task
  }
  return { save }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:181-205](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/lib/index.js#L181-L205)

Host信任与失败关闭。

<details>
<summary>查看原文（25行）</summary>

```text
    // P1-1（Kimi 评审 #8）：这条路以前是 fail-open —— connection 缺失/抛错就**放行** ✗
    // 安全组件的默认值必须是"关"：栅栏不可用 → 拒绝（写操作尤其），只对静态页面留一条活路。
    function rejected(req, res, { strict = true } = {}) {
      if (isTrustedReq(req) === false) {
        json(res, 403, { ok: false, error: '不受信任的访问来源' })
        return true
      }
      try {
        const conn = ctx.get('connection') || ctx.connection
        if (!conn || typeof conn.requestRejection !== 'function') {
          if (!rejected.warned) {
            rejected.warned = true
            console.warn('[bili-whale] 信任栅栏不可用：connection 服务缺失 → 按 fail-closed 处理')
          }
          if (strict) { json(res, 503, { ok: false, error: '信任栅栏不可用，拒绝访问（fail-closed）' }); return true }
          return false
        }
        const code = conn.requestRejection(req)
        if (code === undefined || code === null || code === false) return false
        res.statusCode = typeof code === 'number' ? code : 403
        res.end()
        return true
      } catch (e) {
        if (strict) { json(res, 503, { ok: false, error: '信任栅栏异常，拒绝访问（fail-closed）' }); return true }
        return false
```

</details>

#### 缺口

- 真实扫码/账号切换、精确Host认证及OS权限未验收。
  **影响**：不能install或声称所有部署凭据保护已过。
  **进一步探讨**：隔离账号核取消/过期/坏凭据/待审换号/并发修改及未登录API，任何旧态丢失或跨号发送即停。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 分享、回复与公开成功如何定义？

**研究主题**：缺陷与关键质疑、采用判断

#### 完整回答

comment命令要求显式dry或go，dry也核目标和额度，go再发；share还需auto及配置owner，陌生人once检查查不到MID拒绝。成功后优先rpid_str保精确ID，记录判重/额度并通知；接口code0只证明提交成功，不证明公开可见或@通知送达，报备失败也不能重发评论。--auto/--go是CLI旗标，不是可信人类批准凭据：scheduler提示陌生人先草稿审、主人直接回是行为协议，不能据此声称所有发送都被宿主强制人审。AI评论占比guard默认关且只约束主动视频分享，模型推断“疑似AI”不证明作者身份，不可泛化为平台内容安全或全部互动闸。

#### 证据与依据

**依据 1 · 源码核查**：[tools/commands/comment.mjs:132-153](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/tools/commands/comment.mjs#L132-L153)

显式dry/go和share/auto条件。

<details>
<summary>查看原文（22行）</summary>

```text
if (!oid || (!bvid && !refererArg) || !message) {
  console.error('usage: --oid <aid|comment_id_str> [--bvid <BV...> | --referer <url>] --message "<text>" [--type 1|11|17] [--root <rpid> --parent <rpid>] [--dry | --go] [--check]')
  process.exit(2)
}
if (dry && go) { console.error('pick either --dry or --go, not both'); process.exit(2) }
if (!dry && !go) { console.error('refusing to run without an explicit --dry or --go'); process.exit(2) }

// --share（分享型）：正文里必须 @ 主人 —— 没写 @ 就自动补上。
// 昵称取配置的 owner.name（space/wbi/acc/info 可能被风控，不实时查）；
// 昵称改过的话，发完用 `thread` 看 `@到:` 就能发现（没解析出来就说明名字旧了）。
// --share（分享型）—— 2026-10-17 严格化（Kimi 评审指出两个洞）：
//   ① 必须与 --auto 同传：不然它就是"第三条自我声明车道"，绕开了自主发言那套判据
//   ② 正文**必须以 @<配置里的主人昵称> 开头**：以前"含个 @"就算数 → 一条 "@任何人 快来买" 也能过闸 ✗
if (SHARE) {
  // 2026-10-18 接线：设置页「分享评论」的总开关（关掉 = 只看不说 ✓）
  if (config().share?.enabled === false) {
    console.error('分享已在设置里关闭（share.enabled = false）→ 这次不发（筛/深读/日记照常 ✓）')
    process.exit(3)
  }
  if (!AUTO) { console.error('--share 必须与 --auto 同传（分享型也是"她自己决定说的"）'); process.exit(2) }
  const ow = config().owner ?? {}
  if (!ow.name) { console.error('--share 需要先配置 owner.name（要 @ 谁）'); process.exit(2) }
```

</details>

**依据 2 · 源码核查**：[tools/commands/comment.mjs:190-197](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/tools/commands/comment.mjs#L190-L197)

未知回复者身份停止。

```text
    // 2026-10-22 补回（这条在 v0.4.x 某次重写时丢了 ✗）：
    //   这个开关是给【陌生人】防拉锯的 ✗ 对主人生效会把主人锁 30 天 ✗
    const ownerMid = String(config().owner?.mid ?? '')
    if (who?.mid && ownerMid && String(who.mid) === ownerMid) {
      console.log(`  [once] 被回复的是主人（${who.name || who.mid}）→ 不适用「一个人只回一条」✓ 直接回`)
    } else if (!who?.mid) {
      // fail-closed（2026-10-17，Kimi 评审指出）：判重系统状态未知时，默认动作是**这次不回**
      console.error('  [once] 没查到被回复者的 uid → 判重状态未知，**这次不回**（fail-closed）')
```

**依据 3 · 源码核查**：[tools/commands/comment.mjs:336-378](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/tools/commands/comment.mjs#L336-L378)

rpid精确回执、后记账与通知失败不等发送失败。

<details>
<summary>查看原文（43行）</summary>

```text
const out = await exactJson(res).catch(() => ({ message: '评论响应不是有效 JSON，请回读核查，不要直接重发' }))
console.log(`  HTTP ${res.status}`)
console.log(`  code=${out.code} message=${out.message ?? ''}`)
if (out.code === 0) {
  const rpid = out.data?.rpid_str ?? out.data?.rpid
  console.log(`  ✅ 已发布，评论 rpid=${rpid}`)
  // once-per-person：记一笔"回过谁"，下次判重用
  // 2026-10-22：主人不进 replied.json —— 否则回他一条就把他锁 30 天 ✗
  const __ownerMid = String(config().owner?.mid ?? '')
  if (ONCE && parent && root) {
    try {
      const who = await parentAuthor(oid, root, parent, type)
      // 2026-10-22：主人不进 replied.json（回他一条就把他锁 30 天 ✗）
      const isOwnerRec = who?.mid && __ownerMid && String(who.mid) === __ownerMid
      if (isOwnerRec) console.log('  [once] 被回复的是主人 → 不记账（下次还能回）✓')
      if (who?.mid && !isOwnerRec) {
        const led = loadReplied()
        led.byUid ??= {}
        led.byUid[who.mid] ??= []
        led.byUid[who.mid].push({ at: new Date().toISOString(), target: bvid ? `BV:${bvid}` : `oid:${oid}`, rpid, name: who.name })
        // 只留 30 天内的记录，别把文件养大
        for (const k of Object.keys(led.byUid)) {
          led.byUid[k] = led.byUid[k].filter((x) => Date.now() - new Date(x.at).getTime() < ONCE_DAYS * 86_400_000)
          if (!led.byUid[k].length) delete led.byUid[k]
        }
        saveReplied(led)
        console.log(`  [once] 已记账：${who.name || who.mid}（30 天内不再回他）`)
      }
    } catch (e) { console.log(`  [once] 记账失败（不影响已发出的评论）：${String(e.message).slice(0, 80)}`) }
  }
  // 记账（发出去才算数）
  const rec = quota(['record', '--type', 'comment', '--target', bvid ? `BV:${bvid}` : `oid:${oid}`,
    '--note', message.replace(/\s+/g, ' ').slice(0, 40), ...(SHARE ? ['--share'] : AUTO ? ['--auto'] : [])])
  console.log(`  [限额闸] ${rec.out}`)
  // 自主 / 分享型 → **自动报备**（把 AGENTS 里的"约定"落到代码里；后端由 config.notify 决定）
  if (AUTO || SHARE) {
    try {
      const msg = `[${SHARE ? '分享型·@主人' : '自主发言'}] 评论已发出 rpid=${rpid}\n目标：${bvid ? 'BV:' + bvid : 'oid:' + oid}\n内容：${message.slice(0, 80)}`
      execFileSync(NODE_EXE,
        [path.join(path.dirname(fileURLToPath(import.meta.url)), 'notify.mjs'), msg, '--title', SHARE ? '分享评论报备' : '自主发言报备'],
        { stdio: 'inherit', timeout: 330000 })
    } catch (e) {
      console.log(`  [通知] 发出去了但报备失败：${String(e.message).slice(0, 120)}——请手动告诉使用者`)
```

</details>

**依据 4 · 源码核查**：[README.md:45-47](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/README.md#L45-L47)

疑似AI guard的严格范围。

```text
**① 分享前多一道「疑似 AI 评论」闸**（默认关）—— 主动 @ 分享前先采一段该视频的评论，
由当前模型逐条判；疑似比例 ≥ **30%（写死）** 就暂缓这次分享并推送到你配置的渠道。
只对「主动视频 @ 分享」生效，普通回复/动态/私信/弹幕都不走。细节见 [AI-SHARE-TRIAL.md](AI-SHARE-TRIAL.md)。
```

#### 缺口

- 陌生人草稿到人审的全链、各写通道和公开回读未全审/运行。
  **影响**：不能把dry/go当独立授权或code0当公众送达。
  **进一步探讨**：先只读/草稿；逐外部写操作对账号/目标/批准记录/真实rpid及公开状态，结果未知先查不重放。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 全成本和当前采用建议是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

首次要兼容DSH/sessionController、真正Node（Electron主程序不能替代）、专用工作目录、B站账号、模型与可选ffmpeg/视频来源/通知渠道。运行时content/日记进入模型，会话持续增长、人设重复、轮询和视频抽帧都需资源；字符提示缩短不等token或费用节省。日记与拟人偏好不是合格任务证明，需原内容事实/有效分享和用户感受对照。当前observe：默认/预算漂移和人审全链未知阻碍直接无人值守采用；想研究者先隔离账号、关监听/分享，仅手动读取/草稿，核配置与出站。实际请求超预期、出现跨号/未知重发或内容无证据就停调度/写通道，回手工收藏与聊天。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:49-68](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/lib/index.js#L49-L68)

真正Node与专用工作目录。

<details>
<summary>查看原文（20行）</summary>

```text
const NODE_EXE = (() => {
  const dshHome = process.env.DSH_HOME || path.join(os.homedir(), '.dsh')
  try {
    return resolveNodeRuntime(dshHome)
  } catch (e) {
    // 不静默回退：process.execPath 在桌面端是 Electron 主程序，跑不了脚本。
    // 这里只记录，具体失败由各调用点按自身语义报出（设置页体检会显示原因）。
    globalThis.__biliWhaleNodeError = String(e?.message ?? e)
    return null
  }
})()

const HERE = path.dirname(fileURLToPath(import.meta.url))
const CFG_FILE = configPath
const CRED_FILE = credentialsPath
// 2026-10-21 修 Issue #6：她的会话工作目录必须是**专用小目录**，不能用用户主目录 ✗
//   原因：DSH 的 Windows 沙箱会把会话 cwd 当"工作区"，主目录当工作区会让权限/完整性标签
//   影响到主目录下的其它程序（实测有人 DSH / VS Code 起不来）✗
//   放在 ~/.dsh/whale-work 里，范围最小，也不会碰任何别的东西 ✓
const WORK_DIR = path.join(DSH_HOME, 'whale-work')
```

</details>

**依据 2 · 源码核查**：[lib/scheduler.js:180-185](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/lib/scheduler.js#L180-L185)

Node失败先于注册定时器。

```text
  // ⚠️ 2026-10-18 大坑：插件跑在 DSH 的 **Electron** 里，`process.execPath` = DeepSeek Harness.exe ✗
  //   用主程序跑脚本时，B站 的 `gethistory` 返回**空数组**（nav 之类却正常 ✗）→ 直播间永远"听不见" ✗
  //   实测对照：真 node.exe 5 秒命中；主程序 25 秒 0 行 ✗
  //   → 必须找到 **真正的 node.exe**（DSH 自带的运行时）✓
  const NODE_EXE = resolveNodeRuntime(dshHome) // Fail before registering timers.
  const NODE_ENV = nodeEnv(dshHome)   // 真 node 不需要 ELECTRON_RUN_AS_NODE ✓
```

**依据 3 · 源码核查**：[lib/session-delivery.js:52-71](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/lib/session-delivery.js#L52-L71)

首投人设、持续会话与状态保存。

<details>
<summary>查看原文（20行）</summary>

```text
        const bootFirst = !booted
        if(persist)save(next)
        if(rotating)log(`会话轮换：${state.id} → ${next.id}；旧会话保留`)
        state=next;ready=true;onSession(state.id)
        signal?.throwIfAborted()
        const block=persona(),fingerprint=crypto.createHash('sha256').update(block).digest('hex')
        const include=!once||bootFirst||state.personaHash!==fingerprint
        const reminder=`人设依据：${path.join(process.env.USERPROFILE||process.env.HOME||'.','.bili-ai/persona.md')}；上下文缺失时重读。`
        const diary=`先读本地日记恢复记忆：${path.join(dshHome,'whale-diary.md')} 和 ${path.join(dshHome,'whale-diary-private.md')}；不要将旧会话未确认事项当成已完成。`
        const prefix=[include?block:reminder,...((!state.deliveredAt||bootFirst)?[diary]:[])].filter(Boolean).join('\n')
        const content=[...(request.content??[])]
        if(content[0]?.type==='text')content[0]={...content[0],text:prefix+'\n'+content[0].text}
        else content.unshift({type:'text',text:prefix})
        try {await controller.prompt({...request,sessionId:state.id,content},signal)}
        catch(e) {ready=false;throw e}
        booted=true   // 投递成功了才算
        lastDelivered=now()
        state={...state,personaHash:fingerprint,deliveredAt:lastDelivered}
        // Delivery succeeded: persistence failure must not make callers retry it.
        if(persist)try {save(state)} catch(e){log('会话已投递，但保存人设标记失败：'+e.message)}
```

</details>

**依据 4 · 源码核查**：[README.md:54-58](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/README.md#L54-L58)

作者省token说法仅字符长度与开关。

```text
**④ 两个省 token 的开关**（默认都关，设置页「会话成本」）——
`会话轮换天数`（默认 0 = 不轮换）· `每会话减少重复人设`（默认关；开了之后**每次重启后第一次投递**会重新注入一次）。

另外：抽帧九宫格每格默认 **720** 像素（原来 360，界面文字糊）、`--tile` 可调；
唤醒提示压短 26%（1459 → 1086 字），判据一条没丢。
```

#### 缺口

- 视频理解准确、用户持续需求、模型/轮询/通知/抽帧总费用与人工分钟未知。
  **影响**：不能宣称真正看懂、省token或自主长期稳定。
  **进一步探讨**：同关键词同窗口与人工收藏比较有效内容/遗漏、所有请求/尝试、费用与审核分钟，先小样本验证。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 统一配置与任务回执怎样证伪？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是所有消费者只读一个版本化有效配置解析器，输出可回读的默认/覆盖来源；任务状态将已计划、已投递、Agent已执行、外部已提交/未知、公开可见分开，绑定账号/目标/内容摘要/批准依据与rpid。它复用traffic未知不重发和credential旧态保留，不以更多状态字段证明语义质量。最小验证全新/旧局部配置、首次保存、重启、慢prompt/保存失败、账号切换和外部回执丢失矩阵；任何消费者有效值分叉、投递被误记业务完成或重复发布即否定，再看人工复核是否下降。没有真实愿用用户，不升级为新插件机会。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:93-117](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/lib/index.js#L93-L117)

Host默认与merge为统一解析需求。

<details>
<summary>查看原文（25行）</summary>

```text
  listen: { comment: true, commentIntervalSec: 60, scope: 'both', oncePerPerson: false, allDay: false, dm: false, live: false, liveRoom: '', liveScope: 'owner' },
  share: { aiCommentGuard: false, aiThreshold: 30, enabled: true, via: 'comment', minScore: 13, silentAfterDays: 3, },
  toolsPath: '',
}

const clone = (o) => JSON.parse(JSON.stringify(o))
const merge = (base, over) => {
  const out = { ...base }
  for (const [k, v] of Object.entries(over || {})) {
    out[k] = v && typeof v === 'object' && !Array.isArray(v) ? merge(base[k] ?? {}, v) : v
  }
  return out
}

/** 工具链里 bili.mjs 的位置：① 设置里的 toolsPath ② 插件自带的 tools/ ③ 开发目录 */
function resolveBiliMjs() {
  const cfg = readConfig()
  // 2026-10-18：去掉"作者机器"回退 ✗（换机器就是静默失效）→ 只有两个候选：设置里的 toolsPath / 插件自带 tools/ ✓
  return cfg.toolsPath || path.join(HERE, '..', 'tools', 'bili.mjs')
}

function readConfig() {
  let user = {}
  try { user = JSON.parse(fs.readFileSync(CFG_FILE, 'utf8')) } catch { /* 没配就用默认 */ }
  return { ...merge(DEFAULTS, user), __hasUserFile: Object.keys(user).length > 0 }
```

</details>

**依据 2 · 源码核查**：[tools/lib/config.mjs:47-54](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/tools/lib/config.mjs#L47-L54)

tool默认分叉。

```text
  share: { aiCommentGuard: false, aiThreshold: 30, enabled: true, via: 'comment', minScore: 13, silentAfterDays: 3 },  // 分享型（@主人）开关与评分阈值
  // 倾听（2026-10-18 补默认值，与设置页对齐）：评论区 + 直播间
  // 2026-10-24 改默认：\u8bc4\u8bba\u76d1\u542c\u9ed8\u8ba4\u5173\u3001\u79c1\u4fe1\u76d1\u542c\u9ed8\u8ba4\u5f00 \u4f46\u95f4\u9694 60 \u79d2
  //   原因：新装的号多半是刚创的小号 \u2014\u2014 \u957f\u65f6\u95f4\u76d1\u542c\u662f\u98ce\u63a7\u7684\u5934\u53f7\u98ce\u9669 \u2717
  //   \u60f3\u5f00\u5c31\u53bb\u8bbe\u7f6e\u9875\u6253\u5f00 \u2713 \u9ed8\u8ba4\u4e0d\u66ff\u4ed6\u4eec\u6253\u5f00 \u2717
  listen: { comment: false, commentIntervalSec: 60, scope: 'both', oncePerPerson: true, allDay: false, dm: true, dmIntervalSec: 60, live: false, liveRoom: '', liveScope: 'owner' },
  // 作息：windows[] = 每天允许醒来的时段（每个窗口 = 一次机会）；maxWakesPerDay 缺省 = 窗口数（硬上限 3）
  night: { windows: [{ start: '20:00', end: '24:00', wakes: 1 }], skipChance: 0.3, minGapMin: 10, maxVideos: 5 },
```

**依据 3 · 源码核查**：[lib/session-delivery.js:65-71](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/lib/session-delivery.js#L65-L71)

投递成功与持久失败应独立。

```text
        try {await controller.prompt({...request,sessionId:state.id,content},signal)}
        catch(e) {ready=false;throw e}
        booted=true   // 投递成功了才算
        lastDelivered=now()
        state={...state,personaHash:fingerprint,deliveredAt:lastDelivered}
        // Delivery succeeded: persistence failure must not make callers retry it.
        if(persist)try {save(state)} catch(e){log('会话已投递，但保存人设标记失败：'+e.message)}
```

**依据 4 · 源码核查**：[tools/lib/traffic.mjs:179-205](https://github.com/Alterssss/dsh-bili-whale/blob/8b0009f8ce2ebdc421afcb2e727b19ac18912ec6/tools/lib/traffic.mjs#L179-L205)

现有unknown/resolve可复用。

<details>
<summary>查看原文（27行）</summary>

```text
        if (id) {
          if (response.ok && code === 0) s.operations[id].status = 'confirmed'
          else if (payload && Number.isFinite(code) && code !== 0) delete s.operations[id]
          else s.operations[id].status = 'unknown'
        }
        s.last = { at: now(), endpoint: url.pathname, method, http: response.status, code: Number.isFinite(code)?code:null }
      })
      return response
    } catch (e) {
      await locked(s => { if(s.active?.token===requestToken)delete s.active; if (id) { if (!dispatched) delete s.operations[id]; else if (s.operations[id]) s.operations[id].status='unknown' } })
      if (dispatched && writing) throw new TrafficError(`发送结果不确定，已禁止自动重发。请回读核查；操作 ID：${id}`)
      throw e
    }
  }
  const inflight = new Map()
  return {
    fetch: (input, options={}) => {
      const url=new URL(typeof input==='string'||input instanceof URL ? input : input.url)
      if (!isBili(url) || String(options.method??input.method??'GET').toUpperCase()!=='GET' || options.signal) return guarded(input,options)
      const key=identity(options.headers??input.headers??{})+':'+url.href
      if(!inflight.has(key)) inflight.set(key,guarded(input,options).finally(()=>inflight.delete(key)))
      return inflight.get(key).then(r=>r.clone())
    },
    status: () => read(),
    pauseReason: headers => { try { blocked(read(),identity(headers));return null } catch(e) {return e.message} },
    resume: headers => locked(s => { if (s.manual) delete s.manual[identity(headers)] }),
    resolve: (id, outcome) => locked(s => { if (!s.operations?.[id]) throw new TrafficError('找不到操作 ID'); if (outcome === 'not-sent') delete s.operations[id]; else if (outcome === 'confirmed') s.operations[id].status='confirmed'; else throw new TrafficError('outcome 必须是 confirmed 或 not-sent') }),
```

</details>

#### 缺口

- 迁移旧配置与更细任务收据的净维护成本未知。
  **影响**：设计假设未实现，不能计入贡献评分。
  **进一步探讨**：故障矩阵先零分叉/零误完结，再与人工清单比时间；成本不降就不扩大。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
