# DSH Recall Unread

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[c360803](https://github.com/hg1048596-pixel/dsh-recall-unread/tree/c36080359a87e0fd16c3c28cec9a0f3afe7d5b76)

<!-- BEGIN META -->
[![GitHub ★ 126](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=126&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hg1048596-pixel/dsh-recall-unread) [![npm 30d 1,583](https://img.shields.io/static/v1?label=npm+30d&message=1%2C583&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-recall-unread) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-recall-unread)
<!-- END META -->

> **功能**：撤回模型尚未认领的插话

> **亮点**：[Q01](#research-q01) 在输入区补上未认领插话撤回入口。

> **主要限制**：[Q03](#research-q03) 撤回只在认领前有效，批量操作可部分成功。

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
  - [Q01 · 谁会用到？](#detail-section-11)
  - [Q02 · 如何避免错误撤回？](#detail-section-12)
  - [Q03 · 竞争条件如何表现？](#detail-section-13)
  - [Q04 · 如何采用并退出？](#detail-section-14)
  - [Q05 · 什么结果推翻预期？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户在模型处理任务时发错一条插话。

等待模型认领后再澄清。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 等待模型认领后再澄清。 | 可直接比较 | 保留人工步骤 |
| DSH Recall Unread | 在输入区补上未认领插话撤回入口。 | 撤回只在认领前有效，批量操作可部分成功。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | 从对应版本的 pending 视图挑选插话，调用官方队列删除，旧宿主可回退 RPC。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户在模型处理任务时发错一条插话。 | 保留原流程 |
| 试验 | 从对应版本的 pending 视图挑选插话，调用官方队列删除，旧宿主可回退 RPC。 | 观察固定版本 |
| 复核 | 对照宿主原生界面，验证认领竞争、只读与部分成功。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 阻止误发插话进入后续模型上下文 | 在未认领窗口内可避免错误输入进入后续上下文。 | 对照宿主原生界面，验证认领竞争、只读与部分成功。 |

> **思考**：[Q03](#research-q03) 撤回只在认领前有效，批量操作可部分成功。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 在输入区补上未认领插话撤回入口。

按宿主数据契约分支并优先官方 RPC。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 撤回只在认领前有效，批量操作可部分成功。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 对照宿主原生界面，验证认领竞争、只读与部分成功。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的阻止误发插话进入后续模型上下文。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/client.js、src/host.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的阻止误发插话进入后续模型上下文。未执行目标代码或实际宿主验证。
- 下一步：记录服务响应、投影和下一步模型输入。

**分析版本**

- **仓库**：[hg1048596-pixel/dsh-recall-unread](https://github.com/hg1048596-pixel/dsh-recall-unread)
- **版本号**：1.2.1（[固定提交 c360803](https://github.com/hg1048596-pixel/dsh-recall-unread/tree/c36080359a87e0fd16c3c28cec9a0f3afe7d5b76)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 在未认领窗口内可避免错误输入进入后续上下文。

记录服务响应、投影和下一步模型输入。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 316 | — | — | 4194 |
| .js | source | 4 | 442 | 337 | 79 | — |
| .mjs | source | 3 | 591 | 540 | 9 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/hg1048596-pixel/dsh-recall-unread/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：阻止误发插话进入后续模型上下文

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁会用到？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

模型运行时误发补充说明的 DSH 用户。官方队列坞已有 queued 入口，作者定位于 steering 的 UI 缺口。验收须看到 pending 插话可撤，普通排队和已认领内容不受影响。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-31](https://github.com/hg1048596-pixel/dsh-recall-unread/blob/c36080359a87e0fd16c3c28cec9a0f3afe7d5b76/README.md#L20-L31)

作者区分 queued 与 steering

<details>
<summary>查看原文（12行）</summary>

```text
## 🔍 工作原理

DSH 中“已发送但未读取”的消息 = 仍停留在 Agent **inbox**（待处理队列）中的消息：0.2.x 是 `inbox['next-turn']` / `inbox['next-step']` 里的 pending 项，0.1.x 是会话快照 `ConversationSnapshot.queue`。它有两种 placement：

| placement | 含义 | 官方界面现状 |
| --- | --- | --- |
| `queued` | 运行中排队等待下一轮 | 官方队列坞已有「删除」按钮 |
| `steering` | 运行中插话发送，显示为对话尾部待处理气泡 | **没有任何撤回入口** ← 本插件补上 |

撤回实现分两个版本：

- **静态版（推荐）**：Client 直接调用官方会话 RPC `session.updateQueue(itemId, { kind: 'remove' })`（与官方队列坞的「删除」同一实现）。
```

</details>

**依据 2 · 源码核查**：[src/client.js:53-75](https://github.com/hg1048596-pixel/dsh-recall-unread/blob/c36080359a87e0fd16c3c28cec9a0f3afe7d5b76/src/client.js#L53-L75)

两代接口只筛选相应插话

<details>
<summary>查看原文（23行）</summary>

```text
    const RecallDock = (props) => {
      // props.useProjection 只在 0.2.x 出现；对同一组件实例恒定，可安全按运行时分支调用。
      const hasProjection = typeof props.useProjection === 'function'
      const inbox = hasProjection ? props.useProjection('inbox') : undefined
      const session = typeof props.useSession === 'function' ? props.useSession((value) => value) : props.session
      const canUpdate = typeof props.useAccess === 'function' ? props.useAccess('session/updateQueue') : true
      let rows
      if (hasProjection) {
        // 投影未就绪时也不能回退到旧快照，否则会显示已被读取的陈旧消息。
        const nextStep = inbox && Array.isArray(inbox['next-step']) ? inbox['next-step'] : []
        rows = nextStep.filter((row) => row && typeof row.id === 'string' && row.source && row.source.kind === 'user')
      } else {
        const legacyQueue = session && Array.isArray(session.queue) ? session.queue : []
        rows = legacyQueue.filter((row) => row && typeof row.id === 'string' && row.placement === 'steering')
      }

      const [busy, setBusy] = React.useState(null)
      const busyRef = React.useRef(false)
      const [status, setStatus] = React.useState(null)
      const sessionId = props.sessionId
      // RC 系列的只读 subagent 会话与官方 QueueDock 一样不提供修改操作。
      const subagent = session && session.subagent
      const queueMutable = canUpdate && (!subagent || (subagent.address && subagent.address.mode === 'continuable'))
```

</details>

#### 缺口

- 新宿主是否原生提供同入口需独立比较。
  **影响**：缩短纠正误发的操作路径。
  **进一步探讨**：对照同版宿主的官方队列。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何避免错误撤回？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

新版只读 inbox 投影的用户 next-step 行，投影未就绪不回退旧快照。用官方 updateQueue 删除。旧版无 sessions 服务才用私有 RPC 直接移除 inbox 项。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:53-75](https://github.com/hg1048596-pixel/dsh-recall-unread/blob/c36080359a87e0fd16c3c28cec9a0f3afe7d5b76/src/client.js#L53-L75)

新旧来源和可修改条件

<details>
<summary>查看原文（23行）</summary>

```text
    const RecallDock = (props) => {
      // props.useProjection 只在 0.2.x 出现；对同一组件实例恒定，可安全按运行时分支调用。
      const hasProjection = typeof props.useProjection === 'function'
      const inbox = hasProjection ? props.useProjection('inbox') : undefined
      const session = typeof props.useSession === 'function' ? props.useSession((value) => value) : props.session
      const canUpdate = typeof props.useAccess === 'function' ? props.useAccess('session/updateQueue') : true
      let rows
      if (hasProjection) {
        // 投影未就绪时也不能回退到旧快照，否则会显示已被读取的陈旧消息。
        const nextStep = inbox && Array.isArray(inbox['next-step']) ? inbox['next-step'] : []
        rows = nextStep.filter((row) => row && typeof row.id === 'string' && row.source && row.source.kind === 'user')
      } else {
        const legacyQueue = session && Array.isArray(session.queue) ? session.queue : []
        rows = legacyQueue.filter((row) => row && typeof row.id === 'string' && row.placement === 'steering')
      }

      const [busy, setBusy] = React.useState(null)
      const busyRef = React.useRef(false)
      const [status, setStatus] = React.useState(null)
      const sessionId = props.sessionId
      // RC 系列的只读 subagent 会话与官方 QueueDock 一样不提供修改操作。
      const subagent = session && session.subagent
      const queueMutable = canUpdate && (!subagent || (subagent.address && subagent.address.mode === 'continuable'))
```

</details>

**依据 2 · 源码核查**：[src/client.js:84-98](https://github.com/hg1048596-pixel/dsh-recall-unread/blob/c36080359a87e0fd16c3c28cec9a0f3afe7d5b76/src/client.js#L84-L98)

优先官方会话 RPC

<details>
<summary>查看原文（15行）</summary>

```text
      // 0.1.x 的 code 是 queue-item-not-found，0.2.x 带命名空间前缀
      const alreadySending = (code) => code === 'already-claimed' || code === 'queue-item-not-found' || code === 'session/queue-item-not-found' || code === 'session/steer-unavailable'
      const accepted = (result) => result && result.ok === true && (!result.value || result.value.accepted !== false)

      const recall = async (row) => {
        const sessions = ctx.get('sessions')
        // RC 系列走官方路径，保留权限检查和附件清理；仅旧运行时回退私有 RPC。
        if (sessions === undefined) {
          if (hasProjection) throw new Error('sessions service unavailable')
          return host.call('recall', { sessionId, itemId: row.id })
        }
        const binding = sessions.binding(sessionId)
        if (binding === undefined) throw new Error('session binding unavailable')
        return binding.session.updateQueue(row.id, { kind: 'remove' })
      }
```

</details>

**依据 3 · 源码核查**：[src/host.js:13-31](https://github.com/hg1048596-pixel/dsh-recall-unread/blob/c36080359a87e0fd16c3c28cec9a0f3afe7d5b76/src/host.js#L13-L31)

旧版直达 inbox 并报告已认领

<details>
<summary>查看原文（19行）</summary>

```text
    harness.handle('recall', async (args) => {
      const sessionId = args && typeof args.sessionId === 'string' ? args.sessionId : ''
      const itemId = args && typeof args.itemId === 'string' ? args.itemId : ''
      if (sessionId === '' || itemId === '') {
        return { ok: false, code: 'bad-args', message: 'sessionId and itemId are required' }
      }
      const agents = ctx.get('agents')
      if (agents === undefined) {
        return { ok: false, code: 'unavailable', message: 'agents service unavailable' }
      }
      const agent = agents.get(sessionId)
      if (agent === undefined) {
        return { ok: false, code: 'session-not-found', message: 'session is not attached' }
      }
      const removed = agent.inbox.remove(itemId)
      if (!removed) {
        return { ok: false, code: 'already-claimed', message: 'message is no longer pending (already read)' }
      }
      return { ok: true }
```

</details>

#### 缺口

- 旧 RPC 的鉴权取决于外层宿主。
  **影响**：前端隐藏按钮无法替代服务授权。
  **进一步探讨**：按宿主分开确认拒绝结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 竞争条件如何表现？

**研究主题**：缺陷与关键质疑

#### 完整回答

批量撤回按行串行执行，失败继续并分别计数，整体不是原子操作。已认领或队列项不存在时单条反馈无法撤回。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:84-117](https://github.com/hg1048596-pixel/dsh-recall-unread/blob/c36080359a87e0fd16c3c28cec9a0f3afe7d5b76/src/client.js#L84-L117)

按错误码报告队列竞争

<details>
<summary>查看原文（34行）</summary>

```text
      // 0.1.x 的 code 是 queue-item-not-found，0.2.x 带命名空间前缀
      const alreadySending = (code) => code === 'already-claimed' || code === 'queue-item-not-found' || code === 'session/queue-item-not-found' || code === 'session/steer-unavailable'
      const accepted = (result) => result && result.ok === true && (!result.value || result.value.accepted !== false)

      const recall = async (row) => {
        const sessions = ctx.get('sessions')
        // RC 系列走官方路径，保留权限检查和附件清理；仅旧运行时回退私有 RPC。
        if (sessions === undefined) {
          if (hasProjection) throw new Error('sessions service unavailable')
          return host.call('recall', { sessionId, itemId: row.id })
        }
        const binding = sessions.binding(sessionId)
        if (binding === undefined) throw new Error('session binding unavailable')
        return binding.session.updateQueue(row.id, { kind: 'remove' })
      }

      const doRecall = async (row) => {
        if (busyRef.current || !queueMutable) return
        busyRef.current = true
        setBusy(row.id)
        try {
          const result = await recall(row)
          if (accepted(result)) {
            setStatus({ kind: 'info', text: '已撤回一条消息' })
          } else {
            const code = result && (result.code || (result.error && result.error.code))
            setStatus({ kind: 'error', text: alreadySending(code) ? '该消息已开始发送，无法撤回' : '撤回失败，请重试' })
          }
        } catch (error) {
          setStatus({ kind: 'error', text: '撤回失败，请重试' })
          console.error('[dsh-recall-unread] recall failed', error)
        } finally {
          busyRef.current = false
          setBusy((current) => (current === row.id ? null : current))
```

</details>

**依据 2 · 源码核查**：[src/client.js:121-145](https://github.com/hg1048596-pixel/dsh-recall-unread/blob/c36080359a87e0fd16c3c28cec9a0f3afe7d5b76/src/client.js#L121-L145)

逐条执行并累计成功与失败

<details>
<summary>查看原文（25行）</summary>

```text
      const doRecallAll = async () => {
        if (busyRef.current || !queueMutable) return
        busyRef.current = true
        setBusy('__all__')
        let failed = 0
        let succeeded = 0
        try {
          for (const row of rows) {
            // 某条被模型抢先读取，不影响继续撤回其余仍未读的消息。
            try {
              const result = await recall(row)
              if (accepted(result)) succeeded += 1
              else failed += 1
            } catch (error) {
              failed += 1
              console.error('[dsh-recall-unread] recall-all failed', error)
            }
          }
          setStatus(failed === 0
            ? { kind: 'info', text: '已撤回全部未读消息' }
            : { kind: 'error', text: '已撤回 ' + succeeded + ' 条，另有 ' + failed + ' 条撤回失败，可能已开始发送' })
        } finally {
          busyRef.current = false
          setBusy(null)
        }
```

</details>

#### 缺口

- 宿主真正认领和 UI 更新之间存在窗口。
  **影响**：用户需根据最终返回判断。
  **进一步探讨**：安排认领先于删除与反序各一次。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何采用并退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者说明 desktop 和 web 兼容声明，实际需覆盖新版投影及旧版快照。首次成本主要是宿主适配和并发试验，持续成本来自宿主 API 变更，退出时停用插件并对照官方队列仍可用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-18](https://github.com/hg1048596-pixel/dsh-recall-unread/blob/c36080359a87e0fd16c3c28cec9a0f3afe7d5b76/README.md#L3-L18)

作者说明适用版本和停用行为

<details>
<summary>查看原文（16行）</summary>

```text
> DeepSeek Harness (DSH) 插件：撤回「已发送但尚未被模型读取」的文字消息。

在模型运行中发送文字（插话发送）时，消息会以“待处理”气泡的形式出现在对话尾部——在模型认领（读取）之前，你可以一键撤回，避免把还没想好的话发给模型。

当前版本 **v1.2.1**，兼容 **DSH 0.2.1-rc.1 至 0.2.1-rc.5**（desktop / web profile），并保留 0.1.x / 0.2.x 数据接口兼容。验证范围见[兼容说明](docs/compatibility.md)。

---

## ✨ 功能特性

- **启用即生效**：在插件市场（dsh-market）或插件管理页启用本插件后，「未读消息」条带立即生效；停用即整体不加载。不依赖任何启动器菜单。
- **未读消息条带**：在输入框上方（`conversation.input.dock` 插槽）列出所有已发送但模型尚未读取的插话消息（0.2.x 取 `inbox['next-step']` 的用户插话，0.1.x 取 `placement === 'steering'`）。
- **单条撤回**：每条消息显示预览文本 + 「撤回」按钮，点击后消息从对话中移除，并提示“已撤回一条消息”。
- **全部撤回**：存在多条未读消息时提供「全部撤回」一键操作；某条被模型抢先读取后，仍继续处理其他消息，并显示成功与失败条数。
- **只读语义**：消息一旦被模型认领（开始读取）会自动离开条带，此时无法撤回——严格符合“仅未读取可撤回”。
- **优雅降级**：撤回失败（消息已开始发送）时给出明确提示，不会破坏会话。
```

</details>

**依据 2 · 源码核查**：[src/client.js:88-98](https://github.com/hg1048596-pixel/dsh-recall-unread/blob/c36080359a87e0fd16c3c28cec9a0f3afe7d5b76/src/client.js#L88-L98)

新版和旧版执行入口不同

<details>
<summary>查看原文（11行）</summary>

```text
      const recall = async (row) => {
        const sessions = ctx.get('sessions')
        // RC 系列走官方路径，保留权限检查和附件清理；仅旧运行时回退私有 RPC。
        if (sessions === undefined) {
          if (hasProjection) throw new Error('sessions service unavailable')
          return host.call('recall', { sessionId, itemId: row.id })
        }
        const binding = sessions.binding(sessionId)
        if (binding === undefined) throw new Error('session binding unavailable')
        return binding.session.updateQueue(row.id, { kind: 'remove' })
      }
```

</details>

#### 缺口

- 安装和回退未实测。
  **影响**：不同宿主上安全路径可能不同。
  **进一步探讨**：每个目标 profile 独立验证。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么结果推翻预期？

**研究主题**：新假设与验证

#### 完整回答

同版宿主对照默认界面与插件，安排认领先和删除先并监视模型上下文和会话投影。再测三条批量其中一条被认领和只读子会话。若删除结果与实际投影不一致，或已认领内容仍显示撤回成功，就不能依赖当前组合。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:73-86](https://github.com/hg1048596-pixel/dsh-recall-unread/blob/c36080359a87e0fd16c3c28cec9a0f3afe7d5b76/src/client.js#L73-L86)

读取权限和预期冲突码

<details>
<summary>查看原文（14行）</summary>

```text
      // RC 系列的只读 subagent 会话与官方 QueueDock 一样不提供修改操作。
      const subagent = session && session.subagent
      const queueMutable = canUpdate && (!subagent || (subagent.address && subagent.address.mode === 'continuable'))

      React.useEffect(() => {
        if (status === null) return
        return ctx.timeout(() => setStatus(null), 2500)
      }, [status])

      if ((rows.length === 0 && status === null) || sessionId === undefined) return null

      // 0.1.x 的 code 是 queue-item-not-found，0.2.x 带命名空间前缀
      const alreadySending = (code) => code === 'already-claimed' || code === 'queue-item-not-found' || code === 'session/queue-item-not-found' || code === 'session/steer-unavailable'
      const accepted = (result) => result && result.ok === true && (!result.value || result.value.accepted !== false)
```

</details>

**依据 2 · 源码核查**：[src/client.js:121-145](https://github.com/hg1048596-pixel/dsh-recall-unread/blob/c36080359a87e0fd16c3c28cec9a0f3afe7d5b76/src/client.js#L121-L145)

批量结果为逐项合计

<details>
<summary>查看原文（25行）</summary>

```text
      const doRecallAll = async () => {
        if (busyRef.current || !queueMutable) return
        busyRef.current = true
        setBusy('__all__')
        let failed = 0
        let succeeded = 0
        try {
          for (const row of rows) {
            // 某条被模型抢先读取，不影响继续撤回其余仍未读的消息。
            try {
              const result = await recall(row)
              if (accepted(result)) succeeded += 1
              else failed += 1
            } catch (error) {
              failed += 1
              console.error('[dsh-recall-unread] recall-all failed', error)
            }
          }
          setStatus(failed === 0
            ? { kind: 'info', text: '已撤回全部未读消息' }
            : { kind: 'error', text: '已撤回 ' + succeeded + ' 条，另有 ' + failed + ' 条撤回失败，可能已开始发送' })
        } finally {
          busyRef.current = false
          setBusy(null)
        }
```

</details>

#### 缺口

- 没有宿主并发实测。
  **影响**：可排除仅凭提示判断效果。
  **进一步探讨**：记录服务响应、投影和下一步模型输入。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
