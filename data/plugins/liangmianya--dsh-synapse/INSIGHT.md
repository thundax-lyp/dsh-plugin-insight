# dsh-synapse

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[d9e0ff3](https://github.com/liangmianya/dsh-synapse/tree/d9e0ff3081e398569c546086046dc5a3f9d4617b)

<!-- BEGIN META -->
[![GitHub ★ 591](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=591&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/liangmianya/dsh-synapse) [![npm 30d 4,988](https://img.shields.io/static/v1?label=npm+30d&message=4%2C988&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-synapse) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-synapse)
<!-- END META -->

> **功能**：把 DSH 工作区中的会话、追问与原生分支组织为可浏览和编辑布局的地图

> **亮点**：[Q01](#research-q01)在真实事件和原生fork上投影地图，动作回原生prompt/session API；贡献是组织交互，模型和历史归DSH。

> **主要限制**：[Q02](#research-q02)布局锁不合并多进程内存状态，后写仍可覆盖；正文并非独立备份，deprecated日志API也使高版本兼容需复核。

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
  - [Q01 · 相比原生会话列表，地图如何对应真实追问和 fork？](#detail-section-11)
  - [Q02 · 缓存、并发写和宿主接口变化会丢什么？](#detail-section-12)
  - [Q03 · 什么使用条件下值得试用，成本与退出如何？](#detail-section-13)
  - [Q04 · 分支地图能否增加证据比较与回归收据？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：同工作区多分支用户希望找回思路来源并继续原会话，不需要第二聊天运行时。

原生DSH会话列表与fork；比较同一组会话的来源查找和误选，而非只比较画布外观。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 地图投影 | 查找追问与真实分支 | 坐标不决定历史关系 |
| 原生动作 | 发送、fork和返回会话 | 沿用宿主模型与权限 |
| 布局保存 | 保留组织状态 | 单共享实例，不是正文备份 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 匹配DSH/Node与profile | 必需 | Host投影与客户端桥 | 装错profile无开关，升级API需复核 |
| 原生Session日志 | 正文必需 | 按需读取问答 | 不可读显示unavailable，非完整备份 |
| 可写布局目录且单共享实例 | 布局持久化需 | 保存坐标预览 | 多实例可能后写覆盖，保留副本 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户保留原日志与布局副本 | 匹配profile并重启 |
| 核对 | 用户用现有分支比对地图 | lineage对应原生fork |
| 追问 | 地图经原生prompt继续 | 同一会话有消息，不重复发送 |
| 退出 | 用户回原生列表核对 | 正文保留，布局单独备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地投影存储，量未知 | profile与现有分支核对 | 无目标运行 |
| 持续使用 | 原模型调用与画布资源 | 整理布局与宿主适配 | 不证明节省token |
| 失败恢复 | 重建投影与读取日志 | 备份布局、纠正错源 | 多进程可能覆盖组织状态 |
| 退出 | 留存布局文件 | 回原生会话列表 | 删除布局不等于删会话 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话组织 | 原生事件和fork映射 | 真实查找速度与误选率 |
| 正文保全 | 从原日志按需取 | 不是独立会话备份 |
| 布局保存 | 临时文件rename与锁 | 不合并多写者状态 |

> **思考**：[Q02](#research-q02)布局锁不合并多进程内存状态，后写仍可覆盖；正文并非独立备份，deprecated日志API也使高版本兼容需复核。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)在真实事件和原生fork上投影地图，动作回原生prompt/session API；贡献是组织交互，模型和历史归DSH。

[Q01](#research-q01)retain/release明确会话生命周期；[Q02](#research-q02)投影与正文分离减少复制，存储锁仅覆盖写临界区，不能承诺跨实例合并。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)布局锁不合并多进程内存状态，后写仍可覆盖；正文并非独立备份，deprecated日志API也使高版本兼容需复核。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 单人多分支任务有限试用，先比对原生会话。错源、正文不可读或覆盖布局时回原生列表，避免共享profile多进程写。

最小验证用五条解决同一问题但证据强弱不同的分支，比较原地图、原生列表与收据视图的来源找回准确率和人工整理时间。若用户只是聊天浏览、没有反复做分支决策，或新增标注比检索更费时，则停止扩展；如果原生会话索引已够用，也不做平行数据库。现有投影只支持这一设想的接线基础，不证明需求。 见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

投影、原生动作与保存边界有源码依据；实际查找收益、性能和当前宿主兼容未知。分支比较收据是未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、docs/architecture.md、index.js、client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定d9e0ff3081e398569c546086046dc5a3f9d4617b，检查README/架构/包、Host投影正文保存与客户端原生动作；未检查全部画布渲染或实际视口。
- 下一步：仅源码核查，未安装、运行目标或测试、未以截图审查布局和规模性能。

**分析版本**

- **仓库**：[liangmianya/dsh-synapse](https://github.com/liangmianya/dsh-synapse)
- **版本号**：0.5.4（[固定提交 d9e0ff3](https://github.com/liangmianya/dsh-synapse/tree/d9e0ff3081e398569c546086046dc5a3f9d4617b)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可以提出未验证的分支比较收据，把原生fork点、用户选择的结论及其证据定位关联起来，展示哪条分支真正解决同一任务，而不按画布位置暗示质量。相对当前地图组织，增量是支持回到验证依据与比较边界，且正文继续归原生日志。

最小验证用五条解决同一问题但证据强弱不同的分支，比较原地图、原生列表与收据视图的来源找回准确率和人工整理时间。若用户只是聊天浏览、没有反复做分支决策，或新增标注比检索更费时，则停止扩展；如果原生会话索引已够用，也不做平行数据库。现有投影只支持这一设想的接线基础，不证明需求。 见 [Q04](#research-q04)。

仅源码核查，未安装、运行目标或测试、未以截图审查布局和规模性能。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 3578 | 3055 | 337 | — |
| .md | source | 5 | 714 | — | — | 5307 |
| .js | test | 8 | 2106 | 1733 | 127 | — |

</details>

**活跃度**

[![Issue 未关闭 24](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=24&color=737b86&logo=github)](https://github.com/liangmianya/dsh-synapse/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 13](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=13&color=737b86&logo=github)](https://github.com/liangmianya/dsh-synapse/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/liangmianya/dsh-synapse/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：会话地图是否保留DSH事实，并明确浏览、执行和布局持久化边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相比原生会话列表，地图如何对应真实追问和 fork？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

目标是同一工作区有多轮追问和多个分支、经常忘记某个结论从哪里来的用户。原生会话列表按会话找内容，Synapse将已提交事件投影到地图，以工作区组织会话、追问与fork。Host读取session.snapshotEvents并投影，客户端fork调用原生sessions.fork，发送追问先retain会话引用、等待ready，再调用原生prompt并释放引用；所以执行仍归DSH，不是另一个聊天运行时。

增量是让分支关系和局部问答可浏览，减少人工在多个会话中找位置；地图坐标并不决定分支事实。用户通过地图发送消息仍会产生真实模型轮次，地图本身不是摘要压缩或缓存复用算法，不能用界面便利推断token更少或推理更强。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:230-267](https://github.com/liangmianya/dsh-synapse/blob/d9e0ff3081e398569c546086046dc5a3f9d4617b/index.js#L230-L267)

已提交事件投影与批量处理。

<details>
<summary>查看原文（38行）</summary>

```text
  /** Replay one live DSH session into the dedicated projection workspace. */
  async projectSession(session, replayFrom = 0, workspaceTitle = 'DSH 任务') {
    return this.mutate(() => {
      if (this.state.hiddenSessionIds.includes(session.id)) return null
      const workspace = this.dshWorkspace(sessionCwd(session), workspaceTitle)
      const thread = this.dshThread(workspace, session)
      // `snapshotEvents()` replaces the removed `session.events` getter. It is
      // marked deprecated because DSH is moving complete logs out of memory, but
      // rebuilding this canvas from history needs the full sequence and the
      // reader is the only complete-log access a plugin still has.
      for (const event of session.snapshotEvents()) {
        if (event.seq >= replayFrom) this.projectEventInto(workspace, thread, event)
      }
      return structuredClone(thread)
    }, { deferred: true })
  }

  /** Project one committed DSH session event. Repeated sequence numbers are ignored. */
  async projectEvent(session, event, workspaceTitle = 'DSH 任务') {
    return this.mutate(() => {
      if (this.state.hiddenSessionIds.includes(session.id)) return null
      const workspace = this.dshWorkspace(sessionCwd(session), workspaceTitle)
      const thread = this.dshThread(workspace, session)
      this.projectEventInto(workspace, thread, event)
      return structuredClone(thread)
    }, { deferred: true })
  }

  /** Project a batch of committed events for one session in a single write. */
  async projectEvents(session, events, workspaceTitle = 'DSH 任务') {
    if (events.length === 0) return null
    return this.mutate(() => {
      if (this.state.hiddenSessionIds.includes(session.id)) return null
      const workspace = this.dshWorkspace(sessionCwd(session), workspaceTitle)
      const thread = this.dshThread(workspace, session)
      for (const event of events) this.projectEventInto(workspace, thread, event)
      return structuredClone(thread)
    }, { deferred: true })
```

</details>

**依据 2 · 源码核查**：[client.js:44-60](https://github.com/liangmianya/dsh-synapse/blob/d9e0ff3081e398569c546086046dc5a3f9d4617b/client.js#L44-L60)

发送先保留原生会话引用并调用prompt。

<details>
<summary>查看原文（17行）</summary>

```text
      const prompt = async (sessionId, text) => {
        // 0.1.7 owns Session lifetime explicitly: `scope()` only borrows an
        // already-retained generation, so sending needs a reference of our own.
        let reference
        try {
          reference = ctx.sessions.retain(sessionId, { source: SESSION_SOURCE })
          await reference.ready
        } catch {
          reference?.release()
          throw new Error(NO_SESSION)
        }
        try {
          const result = await reference.binding.session.prompt([{ type: 'text', text }], 'queue')
          if (!result.ok) throw new Error(result.error?.message ?? 'DSH 未接受这条消息')
        } finally {
          reference.release()
        }
```

</details>

**依据 3 · 源码核查**：[client.js:338-352](https://github.com/liangmianya/dsh-synapse/blob/d9e0ff3081e398569c546086046dc5a3f9d4617b/client.js#L338-L352)

fork与追问都回原生DSH接口。

<details>
<summary>查看原文（15行）</summary>

```text
        if (event.data.type === 'synapse:fork-session') {
          const atSeq = Number.isInteger(event.data.atSeq) ? event.data.atSeq : undefined
          ctx.sessions.fork({ sessionId: event.data.sessionId, atSeq, increaseTitle: true }).then(id => {
            const snapshot = ctx.sessions.list.getSnapshot()
            send('synapse:forked-session', { requestId: event.data.requestId, session: { id, title: snapshot.byId[id]?.displayTitle ?? 'DSH 分支' } })
          }).catch(() => { send('synapse:bridge-error', { message: 'DSH 分支创建失败，请确认源会话已经完成当前轮次' }) })
          return
        }
        if (event.data.type === 'synapse:send-message') {
          const text = typeof event.data.text === 'string' ? event.data.text.trim() : ''
          if (text === '') return send('synapse:bridge-error', { requestId: event.data.requestId, message: '消息不能为空' })
          prompt(event.data.sessionId, text).then(() => {
            send('synapse:message-sent', { requestId: event.data.requestId, sessionId: event.data.sessionId })
          }).catch(error => {
            send('synapse:bridge-error', { requestId: event.data.requestId, message: error instanceof Error ? error.message : 'DSH 消息发送失败' })
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 缓存、并发写和宿主接口变化会丢什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

Synapse保存布局和短预览，正文优先从活跃Session读事件，关闭后从原生日志读；拿不到则显式unavailable，不能当完整备份。删除布局文件不等于删除原会话，但本地拖拽、隐藏等组织状态会丢，旧资料只有预览时不能保证还原全文。

save先检查mtime并警告外部修改，然后获取锁、写临时文件和rename。锁保证写文件阶段互斥，却没有在锁内重读并合并其他进程的状态，所以两个进程先各自载入旧状态仍可能后写覆盖布局。架构也明确这一限制。projectSession依赖已被标deprecated的snapshotEvents，宿主移除后需要新的完整日志读取接口；最低版本声明不能证明所有更高版本兼容。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1065-1083](https://github.com/liangmianya/dsh-synapse/blob/d9e0ff3081e398569c546086046dc5a3f9d4617b/index.js#L1065-L1083)

按需读正文并显式不可用，不是第二事实源。

<details>
<summary>查看原文（19行）</summary>

```text
  const threadBodies = async (threadId, seqs) => {
    const located = await store.locateThread(threadId)
    if (located === null) throw new NotFoundError('会话不存在')
    const { thread } = located
    const wanted = seqs === null ? null : new Set(seqs)
    if (thread.dshSessionId === null) {
      const messages = {}
      for (const message of thread.messages ?? []) {
        if (wanted !== null && !wanted.has(message.sourceSeq)) continue
        messages[String(message.sourceSeq)] = { text: message.text, truncated: message.truncated === true, process: message.process ?? [], local: true }
      }
      return { messages }
    }
    const session = ctx.sessions.list().find(candidate => candidate.id === thread.dshSessionId)
    if (session !== undefined) return { messages: bodiesFromEvents(thread, session.snapshotEvents(), seqs) }
    // Closed session: read its log from disk, which is where the body lives.
    const events = await sessionLog.events(thread.dshSessionId)
    if (events === null) return { messages: {}, unavailable: true }
    return { messages: bodiesFromEvents(thread, events, seqs) }
```

</details>

**依据 2 · 源码核查**：[index.js:320-340](https://github.com/liangmianya/dsh-synapse/blob/d9e0ff3081e398569c546086046dc5a3f9d4617b/index.js#L320-L340)

外部修改只警告后继续写，锁不提供状态合并。

<details>
<summary>查看原文（21行）</summary>

```text
  async save() {
    // Two dsh web instances sharing one profile clobber each other's canvas
    // state. Warn loudly instead of silently losing work; a live lock held by
    // another process or a file mtime that moved since our last write both
    // indicate a second writer.
    const before = await this.fileMtime()
    if (this.lastKnownMtime !== null && before !== null && before !== this.lastKnownMtime) {
      this.lastKnownMtime = before
      if (!this.externalModWarned) {
        this.externalModWarned = true
        process.stderr.write('synapse: workspaces.json 已被另一个 dsh web 实例修改，本实例的写入可能覆盖其更改——请只运行一个实例\n')
      }
    }
    await this.acquireLock()
    try {
      const temporaryFile = `${this.dataFile}.${process.pid}.tmp`
      await writeFile(temporaryFile, `${JSON.stringify(this.state)}\n`, 'utf8')
      await rename(temporaryFile, this.dataFile)
      this.lastKnownMtime = (await stat(this.dataFile)).mtimeMs
    } finally {
      await this.releaseLock()
```

</details>

**依据 3 · 源码核查**：[index.js:236-241](https://github.com/liangmianya/dsh-synapse/blob/d9e0ff3081e398569c546086046dc5a3f9d4617b/index.js#L236-L241)

完整投影依赖deprecated API。

```text
      // `snapshotEvents()` replaces the removed `session.events` getter. It is
      // marked deprecated because DSH is moving complete logs out of memory, but
      // rebuilding this canvas from history needs the full sequence and the
      // reader is the only complete-log access a plugin still has.
      for (const event of session.snapshotEvents()) {
        if (event.seq >= replayFrom) this.projectEventInto(workspace, thread, event)
```

#### 缺口

- 当前用户宿主版本的完整日志接口和双进程覆盖实际影响未执行验证。
  **影响**：不能承诺跨实例布局安全或所有更高版本兼容。
  **进一步探讨**：以副本启动两个写者改不同坐标并重载核对；正常使用保持一个共享profile实例。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么使用条件下值得试用，成本与退出如何？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要作者声明的匹配DSH/Node、正确web或desktop profile、原生会话日志可读与布局目录可写。它复用已有Web服务，现金主要是本地存储与原有模型任务；地图浏览的具体资源和耗时未实测。持续成本是布局整理、宿主升级适配和定期备份布局；模型追问与fork的调用成本仍由用户承担。

建议同一工作区确有多个并行思路的单人DSH用户试用一组现有会话，核对地图分支与原生fork、发送一条无重要副作用追问、返回原生会话并重启确认布局。若对应错会话、正文不可读或多实例布局互相覆盖，就停止地图操作，保留原生日志并回原生列表。已有原生列表足够且很少分支的人不必增加画布管理。试用是有条件分析，不是宿主运行验收。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:25-47](https://github.com/liangmianya/dsh-synapse/blob/d9e0ff3081e398569c546086046dc5a3f9d4617b/README.md#L25-L47)

运行版本、profile和复用服务前提。

<details>
<summary>查看原文（23行）</summary>

````text
需要 DeepSeek Harness `>= 0.1.7-rc.2`（本插件依赖该版本的 Host 会话与 Client 服务接口）和 Node.js `>= 22.19.0`。

> **兼容性提示：** 本版本包含破坏性变更，仅支持 DeepSeek Harness `>= 0.1.7-rc.2`，不再兼容更早版本。

**先确认插件要装进哪一套 profile**。DSH 按 profile 分套安装插件，桌面 App 和命令行各用一套，互不影响：

| 你平时怎么用 DSH | 要装的 profile | 安装命令 |
|---|---|---|
| 桌面 App（DeepSeek Harness 客户端） | `desktop` | `corepack pnpm dsh plugin --profile desktop add dsh-synapse` |
| 命令行 `dsh web` / 浏览器访问 | `web` | `corepack pnpm dsh plugin --profile web add dsh-synapse` |
| 两种都用 | 两套各装一次 | 两条命令都执行 |

- 从 App 内的插件页面安装时，App 会自动装进它自己用的那套，不用管 profile。
- **自检口诀：装完顶部看不到「会话地图」开关，就是装到另一套去了**，换成另一条命令再装一次即可。
- 桌面 App 装完需要**重启 App**（Host 侧插件在启动时加载）；命令行装的，重启 `dsh web` 并刷新页面。

```powershell
# 命令行方式：装好后启动
corepack pnpm dsh plugin --profile web add dsh-synapse
corepack pnpm dsh web
```

启动后，在 DSH 顶部切换到 **会话地图**。Synapse 复用现有的 DSH Web Server，不会启动第二个应用或代理系统。
````

</details>

**依据 2 · 源码核查**：[README.md:73-78](https://github.com/liangmianya/dsh-synapse/blob/d9e0ff3081e398569c546086046dc5a3f9d4617b/README.md#L73-L78)

正文与布局所有权声明。

```text
## 与 DSH 的边界

- DSH session log 保存真实会话内容；Synapse 只投影已提交的事件。
- Synapse 只保存画布布局和每轮对话的短预览，消息正文始终从 DSH 会话记录按需读取；`$DSH_HOME/synapse/` 删除后不会丢会话，只会丢布局。
- 插件不修改 prompt、模型请求、工具 schema、provider 路由或可复用 KV-cache 前缀。
- 内置 patch 由 profile 的 bundle 列表引入，桌面 App（`desktop`）与命令行（`web`）都适用。
```

**依据 3 · 源码核查**：[client.js:338-352](https://github.com/liangmianya/dsh-synapse/blob/d9e0ff3081e398569c546086046dc5a3f9d4617b/client.js#L338-L352)

有限试用可核对原生fork与发送结果。

<details>
<summary>查看原文（15行）</summary>

```text
        if (event.data.type === 'synapse:fork-session') {
          const atSeq = Number.isInteger(event.data.atSeq) ? event.data.atSeq : undefined
          ctx.sessions.fork({ sessionId: event.data.sessionId, atSeq, increaseTitle: true }).then(id => {
            const snapshot = ctx.sessions.list.getSnapshot()
            send('synapse:forked-session', { requestId: event.data.requestId, session: { id, title: snapshot.byId[id]?.displayTitle ?? 'DSH 分支' } })
          }).catch(() => { send('synapse:bridge-error', { message: 'DSH 分支创建失败，请确认源会话已经完成当前轮次' }) })
          return
        }
        if (event.data.type === 'synapse:send-message') {
          const text = typeof event.data.text === 'string' ? event.data.text.trim() : ''
          if (text === '') return send('synapse:bridge-error', { requestId: event.data.requestId, message: '消息不能为空' })
          prompt(event.data.sessionId, text).then(() => {
            send('synapse:message-sent', { requestId: event.data.requestId, sessionId: event.data.sessionId })
          }).catch(error => {
            send('synapse:bridge-error', { requestId: event.data.requestId, message: error instanceof Error ? error.message : 'DSH 消息发送失败' })
```

</details>

#### 缺口

- 真实用户查找结论的耗时、画布规模性能和同版宿主效果未知。
  **影响**：不能将地图呈现等同检索更快或省token。
  **进一步探讨**：用同一五分支任务比较原生列表与地图，记录找回来源、误选和整理时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 分支地图能否增加证据比较与回归收据？

**研究主题**：新假设与验证

#### 完整回答

可以提出未验证的分支比较收据，把原生fork点、用户选择的结论及其证据定位关联起来，展示哪条分支真正解决同一任务，而不按画布位置暗示质量。相对当前地图组织，增量是支持回到验证依据与比较边界，且正文继续归原生日志。

最小验证用五条解决同一问题但证据强弱不同的分支，比较原地图、原生列表与收据视图的来源找回准确率和人工整理时间。若用户只是聊天浏览、没有反复做分支决策，或新增标注比检索更费时，则停止扩展；如果原生会话索引已够用，也不做平行数据库。现有投影只支持这一设想的接线基础，不证明需求。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:338-343](https://github.com/liangmianya/dsh-synapse/blob/d9e0ff3081e398569c546086046dc5a3f9d4617b/client.js#L338-L343)

原生fork锚点是比较的真实基础。

```text
        if (event.data.type === 'synapse:fork-session') {
          const atSeq = Number.isInteger(event.data.atSeq) ? event.data.atSeq : undefined
          ctx.sessions.fork({ sessionId: event.data.sessionId, atSeq, increaseTitle: true }).then(id => {
            const snapshot = ctx.sessions.list.getSnapshot()
            send('synapse:forked-session', { requestId: event.data.requestId, session: { id, title: snapshot.byId[id]?.displayTitle ?? 'DSH 分支' } })
          }).catch(() => { send('synapse:bridge-error', { message: 'DSH 分支创建失败，请确认源会话已经完成当前轮次' }) })
```

**依据 2 · 源码核查**：[index.js:1065-1083](https://github.com/liangmianya/dsh-synapse/blob/d9e0ff3081e398569c546086046dc5a3f9d4617b/index.js#L1065-L1083)

正文按需回原日志，适合保持引用而非复制内容。

<details>
<summary>查看原文（19行）</summary>

```text
  const threadBodies = async (threadId, seqs) => {
    const located = await store.locateThread(threadId)
    if (located === null) throw new NotFoundError('会话不存在')
    const { thread } = located
    const wanted = seqs === null ? null : new Set(seqs)
    if (thread.dshSessionId === null) {
      const messages = {}
      for (const message of thread.messages ?? []) {
        if (wanted !== null && !wanted.has(message.sourceSeq)) continue
        messages[String(message.sourceSeq)] = { text: message.text, truncated: message.truncated === true, process: message.process ?? [], local: true }
      }
      return { messages }
    }
    const session = ctx.sessions.list().find(candidate => candidate.id === thread.dshSessionId)
    if (session !== undefined) return { messages: bodiesFromEvents(thread, session.snapshotEvents(), seqs) }
    // Closed session: read its log from disk, which is where the body lives.
    const events = await sessionLog.events(thread.dshSessionId)
    if (events === null) return { messages: {}, unavailable: true }
    return { messages: bodiesFromEvents(thread, events, seqs) }
```

</details>

#### 缺口

- 用户是否有反复需要证据比较的分支任务。
  **影响**：地图视觉吸引不证明产品需求。
  **进一步探讨**：先收集真实分支选择案例，比较找回依据和标注成本。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
