# DSH Synapse

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[fa62deb](https://github.com/liangmianya/dsh-synapse/tree/fa62deb836203a3196ef61c6404b4fdb66e56d0a)

<!-- BEGIN META -->
[![GitHub ★ 636](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=636&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/liangmianya/dsh-synapse) [![npm 30d 6,154](https://img.shields.io/static/v1?label=npm+30d&message=6%2C154&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-synapse) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-synapse)
<!-- END META -->

> **功能**：把 DeepSeek Harness 的会话、追问与分支组织为可视地图。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将原生事件组织为可浏览地图，原生会话和模型仍由宿主负责。

> **主要限制**：[Q02](#research-q02) 多实例修改仅警告仍可能覆盖；[Q04](#research-q04) 所查 API 的 Host 限制不足以证明全栈鉴权。

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
  - [Q01 · 什么用户需要会话地图，相比原生会话列表有何增量？](#detail-section-11)
  - [Q02 · 地图怎样读取事件并组织会话与工作区？](#detail-section-12)
  - [Q03 · 分支和追问是否真的调用宿主，失败时保存什么？](#detail-section-13)
  - [Q04 · 删除、隐私、兼容及采用负担是什么？](#detail-section-14)
  - [Q05 · 如何使分支结论的证据更便于比较？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：同工作区有多个会话与分支的 DSH 用户需要找回结论与来源。

原生会话列表和日志也能定位会话，但分支导航需人工操作。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 事件投影 | 按工作区组织会话 | 依赖原生事件与日志 |
| 地图浏览 | 查看分支和短预览 | 布局可能有多实例冲突 |
| 原生 fork | 基于原会话创建分支 | 宿主拒绝时返回错误 |
| 追问 | 向原会话提交消息 | retain/ready 后由宿主执行 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| 兼容 DSH 与 Node | 插件需要 | 会话与客户端 API | 启动或交互失败 |
| 宿主会话日志 | 查看原文需要 | 构建投影和读取正文 | 不可读时返回 unavailable |
| 本地存储 | 布局与预览需要 | 保存地图状态 | 布局无法持久保存 |
| 模型供应商 | 发送追问需要 | 生成回复 | 调用失败或产生费用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认版本和工作区 | 多实例先停止冲突写入 |
| 浏览 | 打开会话地图 | 缺失时回原生日志核对 |
| 分支 | 选择原生 fork 点并追问 | 检查宿主是否接受及事件落盘 |
| 恢复 | 备份布局并检查日志 | 不可读时不将地图当完整事实 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 安装与本地存储未知 | 核版本和工作区 | 兼容未测 |
| 持续 | 追问模型费用未知 | 整理分支并核对来源 | 节时未知 |
| 恢复 | 布局备份资源未知 | 核对并发写入与会话日志 | 全量恢复未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话地图 | 已提交事件投影与原文读取 | 多实例或缺日志时完整性 |
| 分支追问 | 调用宿主 fork 与 prompt | 模型任务正确或完成 |
| 本地保存 | 临时文件替换与冲突警告 | 跨实例合并不丢布局 |

> **思考**：[Q02](#research-q02) 多实例修改仅警告仍可能覆盖；[Q04](#research-q04) 所查 API 的 Host 限制不足以证明全栈鉴权。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将原生事件组织为可浏览地图，原生会话和模型仍由宿主负责。

[Q02](#research-q02) 事件和布局分离，但锁不自动合并其他实例更改；[Q03](#research-q03) 显式持有会话引用并释放。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 多实例修改仅警告仍可能覆盖；[Q04](#research-q04) 所查 API 的 Host 限制不足以证明全栈鉴权。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 已有多分支的用户可先在隔离会话试地图并核对原生日志；地图缺项或多实例冲突时暂停并回原生列表。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本投影与客户端桥接已查；未运行宿主和真实任务。

- 已检查：作者 README、包清单、源码路径 README.md、client.js、index.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定提交 README、清单、事件投影、文件持久化、客户端 fork/追问与 API 代表路径；未运行目标或宿主，未审计全部浏览器鉴权、迁移及布局交互。
- 下一步：隔离宿主核对 fork 点、prompt、事件回放、日志缺失及双实例写入；按 [Q05](#research-q05) 比较分支来源找回。

**分析版本**

- **仓库**：[liangmianya/dsh-synapse](https://github.com/liangmianya/dsh-synapse)
- **版本号**：0.5.6（[固定提交 fa62deb](https://github.com/liangmianya/dsh-synapse/tree/fa62deb836203a3196ef61c6404b4fdb66e56d0a)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设用户选择的分支比较收据可改善证据回查；需排除现有等价界面并验证。

隔离宿主核对 fork 点、prompt、事件回放、日志缺失及双实例写入；按 [Q05](#research-q05) 比较分支来源找回。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 3794 | 3201 | 401 | — |
| .md | source | 5 | 781 | — | — | 6275 |
| .js | test | 10 | 2300 | 1871 | 162 | — |

</details>

**活跃度**

[![Issue 未关闭 23](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=23&color=737b86&logo=github)](https://github.com/liangmianya/dsh-synapse/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=16&color=737b86&logo=github)](https://github.com/liangmianya/dsh-synapse/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z) [![近30天关闭 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=10&color=737b86&logo=github)](https://github.com/liangmianya/dsh-synapse/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查会话地图、原生 fork、追问和数据边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么用户需要会话地图，相比原生会话列表有何增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README:19、60-68 面向在同一工作区进行多次追问和分支的用户，把会话关系安排成可缩放地图；原生会话列表和直接打开日志是简单基线。源码投影已有事件，客户端调用宿主原生 fork 和 prompt，插件的增量是可视组织及导航，不是另一个模型或对话执行器。作者称保留原生会话事实源，实际来源找回准确率、节时和用户需求频率没有对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-19](https://github.com/liangmianya/dsh-synapse/blob/fa62deb836203a3196ef61c6404b4fdb66e56d0a/README.md#L19-L19)

作者描述工作区会话地图。

```text
把同一工作区中的会话、追问和分支组织成一张可浏览、可拖拽、可缩放的地图，同时保留 DSH 原生会话作为唯一事实来源。
```

**依据 2 · 作者声明**：[README.md:60-68](https://github.com/liangmianya/dsh-synapse/blob/fa62deb836203a3196ef61c6404b4fdb66e56d0a/README.md#L60-L68)

作者列出地图、分支与归档操作。

```text
|---|---|
| 对话地图 | 把连续追问、分支和不同会话放到同一张可操作的画布上。 |
| 保留真实分支 | 按 DSH 原生 fork 关系连接卡片，不制造另一套会话历史。 |
| 追问更顺手 | 选中回答中的文字可直接带入新的追问；常用补充词可编辑。 |
| 双向同步 | 在地图或 DSH 原生对话中切换会话，当前上下文保持一致。 |
| 过程不挡路 | 工具调用与结果按 `callId` 折叠进对应回答，只显示「工具 N」。 |
| 可移动入口 | 顶部「对话 / 会话地图」开关可拖动、记忆位置、双击复位。 |
| 详情侧栏 | 点卡片在右侧展开整轮详情：完整回答、工具过程、追问 / 分支 / 打开 DSH。 |
| 归档一致 | 归档在地图与 DSH 侧栏之间共用同一份集合，不会各记一套。 |
```

**依据 3 · 源码核查**：[client.js:445-459](https://github.com/liangmianya/dsh-synapse/blob/fa62deb836203a3196ef61c6404b4fdb66e56d0a/client.js#L445-L459)

调用原生 fork 与消息桥。

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

- 没有同任务对原生会话列表和人工查日志的对照
  **影响**：不能推断来源定位准确率或节时
  **进一步探讨**：固定多分支任务比较定位、恢复和人工时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 地图怎样读取事件并组织会话与工作区？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

index.js:230-255 从 session.snapshotEvents 及后续提交事件投影到工作区和线程，并跳过隐藏会话；1082-1092 对打开会话从事件读正文，关闭会话从日志读取，不可读则返回 unavailable。README:98-103 说明本地保留布局及短预览，正文由 DSH 日志提供。index.js:336-349 在写入前检测其他实例修改并警告，之后以锁、临时文件和 rename 写入；该检查不是跨进程合并，注释明确仍可能覆盖。投影与磁盘可靠性、日志缺失及多实例最终状态未运行验证。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:230-255](https://github.com/liangmianya/dsh-synapse/blob/fa62deb836203a3196ef61c6404b4fdb66e56d0a/index.js#L230-L255)

已提交事件投影和隐藏会话。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[index.js:1082-1092](https://github.com/liangmianya/dsh-synapse/blob/fa62deb836203a3196ef61c6404b4fdb66e56d0a/index.js#L1082-L1092)

按需读在线事件或关闭会话日志。

<details>
<summary>查看原文（11行）</summary>

```text
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

**依据 3 · 源码核查**：[index.js:336-349](https://github.com/liangmianya/dsh-synapse/blob/fa62deb836203a3196ef61c6404b4fdb66e56d0a/index.js#L336-L349)

外部修改警告与文件写入。

<details>
<summary>查看原文（14行）</summary>

```text
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

**依据 4 · 作者声明**：[README.md:98-103](https://github.com/liangmianya/dsh-synapse/blob/fa62deb836203a3196ef61c6404b4fdb66e56d0a/README.md#L98-L103)

作者说明正文和本地预览边界。

```text
## 与 DSH 的边界

- DSH session log 保存真实会话内容；Synapse 只投影已提交的事件。
- Synapse 只保存画布布局和每轮对话的短预览，消息正文始终从 DSH 会话记录按需读取；`$DSH_HOME/synapse/` 删除后不会丢会话，只会丢布局。
- 插件不修改 prompt、模型请求、工具 schema、provider 路由或可复用 KV-cache 前缀。
- 内置 patch 由 profile 的 bundle 列表引入，桌面 App（`desktop`）与命令行（`web`）都适用。
```

#### 缺口

- 未测试多实例并发、日志缺失和大量会话
  **影响**：不能保证地图完整或布局写入无丢失
  **进一步探讨**：隔离宿主重放事件并模拟两实例及日志不可读。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 分支和追问是否真的调用宿主，失败时保存什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

client.js:78-96 对追问先 retain 目标会话并等待 ready，调用原生 session.prompt，finally 释放引用；445-459 创建分支调用 ctx.sessions.fork，发送消息经同一 prompt 封装并将成功或错误回给界面。一次调用成功代表宿主接受了相应操作，不证明模型回复正确或分支中的任务完成；无法打开会话或 fork 失败会进入错误分支。真实宿主、超时、取消和事件落盘未测。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:78-96](https://github.com/liangmianya/dsh-synapse/blob/fa62deb836203a3196ef61c6404b4fdb66e56d0a/client.js#L78-L96)

retain、ready、prompt 与释放。

<details>
<summary>查看原文（19行）</summary>

```text
    module.exports.inject = ['sessions', 'workspaces', 'uiWorkspace', 'uiConversation']
    module.exports.apply = ctx => {
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

**依据 2 · 源码核查**：[client.js:445-459](https://github.com/liangmianya/dsh-synapse/blob/fa62deb836203a3196ef61c6404b4fdb66e56d0a/client.js#L445-L459)

原生 fork 和消息结果。

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

**依据 3 · 源码核查**：[index.js:230-255](https://github.com/liangmianya/dsh-synapse/blob/fa62deb836203a3196ef61c6404b4fdb66e56d0a/index.js#L230-L255)

事件后续投影。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

#### 缺口

- 未测试宿主的 fork 和写入竞态
  **影响**：不能断言分支关系完整或消息已持久落盘
  **进一步探讨**：固定宿主对照 fork 点、失败、关闭及会话日志。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 删除、隐私、兼容及采用负担是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

package.json:29-30、33-45 声明 Node >=22.19 与 Web 客户端依赖，README:23-27 声明 DSH >=0.1.7-rc.2；这些是依赖声明而不是当前宿主验收。index.js:1094-1107 的 /synapse API 本地检查 Host（可配置 trustedHosts），这些行未显示 Origin 或用户认证；宿主其它层的保护和实际可访问性未审计，不能据此宣称可被攻击或完全安全。README:100-101 说明地图目录含短预览和布局，删除它不等于删除原始会话；用户仍需保护本地记录。适合已有多分支的用户先在隔离会话比较原生列表，地图缺项、提示冲突或版本不兼容时回原生日志；时间和模型费用未知。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:29-30](https://github.com/liangmianya/dsh-synapse/blob/fa62deb836203a3196ef61c6404b4fdb66e56d0a/package.json#L29-L30)

Node 声明。

```text
  "engines": {
    "node": ">=22.19.0"
```

**依据 2 · 源码核查**：[package.json:33-45](https://github.com/liangmianya/dsh-synapse/blob/fa62deb836203a3196ef61c6404b4fdb66e56d0a/package.json#L33-L45)

bundle 和宿主客户端注入。

<details>
<summary>查看原文（13行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-api-session-controller",
        "@deepseek-ai/dsh-api-workspace-controller",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-workspace"
      ],
      "immediately": false
```

</details>

**依据 3 · 作者声明**：[README.md:23-27](https://github.com/liangmianya/dsh-synapse/blob/fa62deb836203a3196ef61c6404b4fdb66e56d0a/README.md#L23-L27)

作者给出 DSH 最低版本。

```text
## 快速安装

需要 DeepSeek Harness `>= 0.1.7-rc.2`（本插件依赖该版本的 Host 会话与 Client 服务接口）和 Node.js `>= 22.19.0`。

> **兼容性提示：** 本版本包含破坏性变更，仅支持 DeepSeek Harness `>= 0.1.7-rc.2`，不再兼容更早版本。
```

**依据 4 · 源码核查**：[index.js:1094-1107](https://github.com/liangmianya/dsh-synapse/blob/fa62deb836203a3196ef61c6404b4fdb66e56d0a/index.js#L1094-L1107)

所查 API 的 Host 限制及操作入口。

<details>
<summary>查看原文（14行）</summary>

```text
  // The DSH /api browser-trust fence does not cover /synapse routes, so this
  // handler checks the Host header itself: localhost is allowed by default and
  // additional authorities opt in through config.trustedHosts (mirrors the
  // fence's DNS-rebinding defense).
  const trustedHosts = new Set(['localhost', '127.0.0.1', ...[...(config?.trustedHosts ?? [])].map(host => String(host).trim().toLowerCase()).filter(Boolean)])
  const api = async (req, res) => {
    try {
      const hostname = (typeof req.headers.host === 'string' ? req.headers.host : '').replace(/:\d+$/, '').toLowerCase()
      if (!trustedHosts.has(hostname)) return sendJson(res, 403, { error: '不被信任的 Host' })
      const path = new URL(req.url ?? '/', 'http://dsh.local').pathname
      if (path === '/synapse/api/reset' && req.method === 'POST') return sendJson(res, 200, await store.clearLegacy(ctx.sessions.list()))
      if (path === '/synapse/api/workspaces') {
        if (req.method === 'GET') return sendJson(res, 200, { workspaces: await store.list() })
        if (req.method === 'POST') return sendJson(res, 201, { workspace: await store.create((await readJson(req)).title) })
```

</details>

**依据 5 · 作者声明**：[README.md:98-103](https://github.com/liangmianya/dsh-synapse/blob/fa62deb836203a3196ef61c6404b4fdb66e56d0a/README.md#L98-L103)

作者区分本地预览与原始日志。

```text
## 与 DSH 的边界

- DSH session log 保存真实会话内容；Synapse 只投影已提交的事件。
- Synapse 只保存画布布局和每轮对话的短预览，消息正文始终从 DSH 会话记录按需读取；`$DSH_HOME/synapse/` 删除后不会丢会话，只会丢布局。
- 插件不修改 prompt、模型请求、工具 schema、provider 路由或可复用 KV-cache 前缀。
- 内置 patch 由 profile 的 bundle 列表引入，桌面 App（`desktop`）与命令行（`web`）都适用。
```

#### 缺口

- 未审计宿主其余鉴权、目录权限、版本和卸载
  **影响**：不能判断完整安全性、兼容及清理效果
  **进一步探讨**：隔离宿主核验身份、监听范围、恢复与卸载。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何使分支结论的证据更便于比较？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有地图已按会话、追问和原生 fork 关系组织节点，并能回原会话，单纯添加分支图或来源链接不是增量。未验证设想是为用户明确选择的同一问题的分支，建立可编辑比较收据：引用原生 fork 点、作者选定的结论、检验依据及未知项；证据被删或会话不可读时标 unknown，不按节点位置或模型自评宣称胜出。依赖原生日志可定位、人工选择可修订，需先核现有 UI 是否已等价支持。以相同任务的五条分支对照现有地图和原生列表，包含正确、相互矛盾、无证据和来源删除的情况，盲测来源定位和错误采纳、整理时间及泄露；若误把缺证据当通过、无净改善或人工成本过高则否定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:60-68](https://github.com/liangmianya/dsh-synapse/blob/fa62deb836203a3196ef61c6404b4fdb66e56d0a/README.md#L60-L68)

现有分支与详情界面。

```text
|---|---|
| 对话地图 | 把连续追问、分支和不同会话放到同一张可操作的画布上。 |
| 保留真实分支 | 按 DSH 原生 fork 关系连接卡片，不制造另一套会话历史。 |
| 追问更顺手 | 选中回答中的文字可直接带入新的追问；常用补充词可编辑。 |
| 双向同步 | 在地图或 DSH 原生对话中切换会话，当前上下文保持一致。 |
| 过程不挡路 | 工具调用与结果按 `callId` 折叠进对应回答，只显示「工具 N」。 |
| 可移动入口 | 顶部「对话 / 会话地图」开关可拖动、记忆位置、双击复位。 |
| 详情侧栏 | 点卡片在右侧展开整轮详情：完整回答、工具过程、追问 / 分支 / 打开 DSH。 |
| 归档一致 | 归档在地图与 DSH 侧栏之间共用同一份集合，不会各记一套。 |
```

**依据 2 · 源码核查**：[client.js:445-450](https://github.com/liangmianya/dsh-synapse/blob/fa62deb836203a3196ef61c6404b4fdb66e56d0a/client.js#L445-L450)

原生 fork 标识。

```text
        if (event.data.type === 'synapse:fork-session') {
          const atSeq = Number.isInteger(event.data.atSeq) ? event.data.atSeq : undefined
          ctx.sessions.fork({ sessionId: event.data.sessionId, atSeq, increaseTitle: true }).then(id => {
            const snapshot = ctx.sessions.list.getSnapshot()
            send('synapse:forked-session', { requestId: event.data.requestId, session: { id, title: snapshot.byId[id]?.displayTitle ?? 'DSH 分支' } })
          }).catch(() => { send('synapse:bridge-error', { message: 'DSH 分支创建失败，请确认源会话已经完成当前轮次' }) })
```

**依据 3 · 源码核查**：[index.js:1087-1092](https://github.com/liangmianya/dsh-synapse/blob/fa62deb836203a3196ef61c6404b4fdb66e56d0a/index.js#L1087-L1092)

来源不可用时返回 unavailable。

```text
    const session = ctx.sessions.list().find(candidate => candidate.id === thread.dshSessionId)
    if (session !== undefined) return { messages: bodiesFromEvents(thread, session.snapshotEvents(), seqs) }
    // Closed session: read its log from disk, which is where the body lives.
    const events = await sessionLog.events(thread.dshSessionId)
    if (events === null) return { messages: {}, unavailable: true }
    return { messages: bodiesFromEvents(thread, events, seqs) }
```

#### 缺口

- 未穷尽 UI 是否已有等价比较与真实用户需求
  **影响**：无法证明增量或节时
  **进一步探讨**：先核现有分支详情，再做固定任务盲评。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
