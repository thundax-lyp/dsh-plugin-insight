# Comi Pet

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[27677f0](https://github.com/IvenKooLab/desktop-pet/tree/27677f0ce6956495e02c8d88037133791ec7578f)

<!-- BEGIN META -->
[![GitHub ★ 239](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=239&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/IvenKooLab/desktop-pet)
<!-- END META -->

> **功能**：独立桌宠可跟随编码助手的工作和审批状态，并在桌面与 DSH 界面内切换显示。

> **亮点**：[Q01](#research-q01) 的本地事件桥让桌面可提示审批等待。[Q02](#research-q02) 的两阶段显示租约允许同一角色在窗口间交接，并在页面失联后恢复原生显示。

> **主要限制**：[Q01](#research-q01) 中的任务动画源自事件映射，不能用来验收目标结果。[Q03](#research-q03) 的聊天会将输入和历史交给 DSH 模型，需要独立核对 provider 与本机文件边界。

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
  - [Q01 · 离开 DSH 页面处理其他工作时，桌宠能提醒什么？](#detail-section-11)
  - [Q02 · 桌面与 DSH 界面如何交接，页面消失后如何恢复？](#detail-section-12)
  - [Q03 · 摘要、Web 路由与聊天分别跨过哪些数据边界？](#detail-section-13)
  - [Q04 · 谁值得先试，遇到界面不显示或目录不匹配时如何退出？](#detail-section-14)
  - [Q05 · 现有租约解决了交接，增加什么反馈可能改善失败处理？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常离开 DSH 界面的本地开发者可以用桌宠关注工具活动和审批等待。

直接看 DSH 可处理审批并读完整上下文；桌宠将需要回看的时机呈现在其他窗口旁。事件归约参考 dsh-pet，显示交接是本仓库接线的增量。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 状态跟随 | 显示工具活动和审批等待 | 两端共用收件箱，审批在宿主处理 |
| 显示交接 | 桌面和 DSH 界面切换 | Web 客户端须能载入素材和续约 |
| 聊天 | 以气泡展示宿主模型回复 | 单独可关闭，输入及历史传至模型 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 桌宠应用 | 独立显示必需 | 消费本机事件 | 无原生显示 |
| DSH profile 与本地适配器 | 状态联动必需 | 订阅会话与工具事件 | 桌宠只提供独立动作 |
| Web 服务、客户端和素材 | 内嵌必需 | 加载插槽和角色帧 | 保留桌面显示 |
| LLM 服务和模型 | 聊天才需要 | 生成回复 | 状态提醒仍可独立使用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 接入 | 开发者对齐事件目录并安装到单独 profile | 重启宿主与桌宠后能看到等待状态 |
| 核对 | 开发者触发普通轮次和审批 | 回宿主完成审批，区分轮次结束与目标完成 |
| 切换 | 开发者打开 Web 界面并请求内嵌 | 等页面接手，未接手则保留桌面 |
| 退出 | 开发者切回桌面并移除插件配置 | 独立桌宠继续运行 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 设备、构建资源开销未知 | 安装、对齐目录和刷新耗时未知 | 本地 profile 与平台约束 |
| 持续使用 | 渲染开销未知，聊天可能产生模型费用 | 核对状态与选择跟踪来源所需时间未知 | 状态投射本身不需要模型 |
| 失败恢复 | 重启及资源加载消耗未知 | 回退和排查时间未知 | 租约恢复是设计路径，耗时未实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 等待提醒 | 审批事件映射到等待动作和气泡 | 是否比只看宿主少漏审批 |
| 显示交接 | 认领后隐藏，租约失效后桌面回退 | 失联、并发与浏览器节流下的时间和可见性 |

> **思考**：[Q01](#research-q01) 中的任务动画源自事件映射，不能用来验收目标结果。[Q03](#research-q03) 的聊天会将输入和历史交给 DSH 模型，需要独立核对 provider 与本机文件边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的本地事件桥让桌面可提示审批等待。[Q02](#research-q02) 的两阶段显示租约允许同一角色在窗口间交接，并在页面失联后恢复原生显示。

事件文件使用临时写入后改名，界面租约也整体替换。文件完整性有助读端解析，状态时序、浏览器节流与本机访问权限仍须分别判断。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q01](#research-q01) 中的任务动画源自事件映射，不能用来验收目标结果。[Q03](#research-q03) 的聊天会将输入和历史交给 DSH 模型，需要独立核对 provider 与本机文件边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在可退出的本机 profile 试三种状态。排查时保持聊天及标签关闭，确认两端目录一致，再单独验证界面接手。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 DSH 事件桥、界面租约和聊天调用路径。审批提醒效果、实际宿主兼容与故障恢复未做运行验证。

- 已检查：作者 README、包清单、源码路径 adapters/dsh/comi-bridge/index.js、native/macos/ComiPet.swift、adapters/dsh/comi-bridge/web.js、adapters/dsh/comi-bridge/package.json、adapters/dsh/comi-bridge/client.js、adapters/dsh/comi-bridge/trust-fence.js、adapters/dsh/comi-bridge/chat-host.js、README.md、adapters/dsh/README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根仓下的 DSH 子插件、Web 与 macOS 代表消费路径。其他助手适配器、实际模型调用、安装和跨平台行为未运行。
- 下一步：用临时 profile 核查工作、审批、普通结束及断线回桌面，并记录显示与审批时序。

**分析版本**

- **仓库**：[IvenKooLab/desktop-pet](https://github.com/IvenKooLab/desktop-pet)
- **版本号**：未声明（[固定提交 27677f0](https://github.com/IvenKooLab/desktop-pet/tree/27677f0ce6956495e02c8d88037133791ec7578f)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可对照现有失败提示，验证分原因反馈能否减少无效切换。若恢复时间没有改善或误导增加，即否定增量。

用临时 profile 核查工作、审批、普通结束及断线回桌面，并记录显示与审批时序。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 30 | 2919 | — | — | 40852 |
| .mjs | source | 3 | 525 | 467 | 36 | — |
| .js | source | 7 | 1177 | 1034 | 113 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/IvenKooLab/desktop-pet/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/IvenKooLab/desktop-pet/issues?q=is%3Aissue+created%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/IvenKooLab/desktop-pet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Comi Pet 如何把 DSH 状态投射到桌面，在什么条件下值得试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 离开 DSH 页面处理其他工作时，桌宠能提醒什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要留意本地 DSH 工具审批的人，可以让桌宠接收审批等待信号，作为回到宿主的提示。适配器订阅会话事件，将审批询问转换为等待通知，并把收敛后的事件分别写入本地收件箱和界面状态。macOS 的原生消费者读入文件，校验版本、事件类别、时间及去重键，等待事件可触发等待动作和状态气泡。直接查看宿主可读取完整审批上下文，桌宠的贡献是把需要回看的状态投射到桌面。普通轮次结束只记为轮次结束。显式 complete 或 blocked 在工具调用时被记入标志，轮次结束时据此映射，代码没有用工具结果核验目标状态，所以动画也不能证明目标状态已持久化成功。界面状态只选择一条会话，优先等待项；它不是待审批列表。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/comi-bridge/index.js:96-127](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/comi-bridge/index.js#L96-L127)

普通轮次、审批及显式目标状态的映射。

<details>
<summary>查看原文（32行）</summary>

```text
export function mapEvent(flags, event) {
  const type = event?.type
  const data = event?.data ?? {}
  switch (type) {
    case 'turn/start':
      Object.assign(flags, newTurnFlags())
      return [{ kind: 'turn.started' }]
    case 'user/message':
      if (data.source?.kind === 'goal') flags.goalRound = true
      return []
    case 'tool/call': {
      const toolName = clean(data.name, 48)
      if (toolName === 'update_goal') {
        const action = data.arguments?.action ?? data.arguments
        if (action === 'complete' || action === 'blocked') flags.closing = action
      }
      return [{ kind: 'tool.started', toolName }]
    }
    case 'tool/result':
      return [{ kind: 'tool.finished' }]
    case 'approval/asked':
      return [{ kind: 'permission.required' }]
    case 'todo/write':
      flags.label = currentTaskFromTodo(data.todos)
      return [{ kind: 'task.updated' }]
    case 'turn/end':
      if (flags.closing === 'complete') return [{ kind: 'task.completed' }]
      if (flags.closing === 'blocked') return [{ kind: 'turn.failed' }]
      return [{ kind: 'turn.ended' }]
    default:
      return []
  }
```

</details>

**依据 2 · 源码核查**：[adapters/dsh/comi-bridge/index.js:130-150](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/comi-bridge/index.js#L130-L150)

收件箱中的数据字段与临时文件改名。

<details>
<summary>查看原文（21行）</summary>

```text
function writeInbox(dir, kind, extra) {
  mkdirSync(dir, { recursive: true })
  const id = `dsh-${process.pid}-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 10)}`
  const stamp = new Date().toISOString().replace('+00:00', 'Z')
  const payload = {
    version: 1,
    event_id: id,
    source: 'dsh',
    session_id: extra.sessionId,
    turn_id: null,
    timestamp: stamp,
    kind,
    task_label: extra.label ?? null,
    summary: null,
    tool_name: extra.toolName ?? null,
    severity: 'info',
  }
  const final = join(dir, `${String(Date.now()).padStart(19, '0')}-${id}.json`)
  const tmp = `${final}.tmp-${process.pid}`
  writeFileSync(tmp, JSON.stringify(payload))
  renameSync(tmp, final)
```

</details>

**依据 3 · 源码核查**：[adapters/dsh/comi-bridge/index.js:167-189](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/comi-bridge/index.js#L167-L189)

宿主订阅把映射送到界面和收件箱。

<details>
<summary>查看原文（23行）</summary>

```text
  ctx.effect(() => {
    const dispose = ctx.on('session/event', (session, event) => {
      try {
        const sessionId = sessionIdOf(session)
        let flags = flagsBySession.get(sessionId)
        if (!flags) {
          flags = newTurnFlags()
          flagsBySession.set(sessionId, flags)
          writeInbox(eventsDir, 'session.started', { sessionId })
        }
        for (const mapped of mapEvent(flags, event)) {
          web.record(sessionId, mapped, summary() ? flags.label : undefined)
          writeInbox(eventsDir, mapped.kind, {
            sessionId,
            toolName: mapped.toolName,
            label: summary() ? flags.label : undefined,
          })
        }
      } catch (error) {
        ctx.logger?.warn?.(`[comi-bridge] ${error instanceof Error ? error.message : String(error)}`)
      }
    })
    return () => { dispose?.(); flagsBySession.clear() }
```

</details>

**依据 4 · 源码核查**：[native/macos/ComiPet.swift:491-516](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/native/macos/ComiPet.swift#L491-L516)

原生消费者读取并筛选文件事件。

<details>
<summary>查看原文（26行）</summary>

```text
    func poll() -> [BridgeNotice] {
        var notices: [BridgeNotice] = []
        let now = clock()
        guard let names0 = try? FileManager.default.contentsOfDirectory(atPath: dir.path) else { return [] }
        var names = names0.filter { $0.hasSuffix(".json") }.sorted()
        if names.count > HostBridge.maxBacklog {
            names.removeFirst(names.count - HostBridge.maxBacklog)
        }
        var consumed: [(URL, [String: Any], TimeInterval)] = []
        for name in names.prefix(HostBridge.maxPerPoll) {
            let url = dir.appendingPathComponent(name)
            guard let data = try? Data(contentsOf: url),
                  let obj = (try? JSONSerialization.jsonObject(with: data)) as? [String: Any],
                  obj["version"] as? Int == 1,
                  let kind = obj["kind"] as? String, HostBridge.kinds.contains(kind),
                  let eid = obj["event_id"] as? String,
                  let ts = HostBridge.parseTimestamp(obj["timestamp"]),
                  abs(now - ts) < HostBridge.eventMaxAge else { try? FileManager.default.removeItem(at: url); continue }
            if seen[eid] != nil { try? FileManager.default.removeItem(at: url); continue }
            seen[eid] = ts
            consumed.append((url, obj, ts))
        }
        for (url, obj, ts) in consumed {
            var eventNotices: [BridgeNotice] = []
            apply(obj, ts: ts, notices: &eventNotices)
            if selectedSource == nil || obj["source"] as? String == selectedSource { notices += eventNotices }
```

</details>

**依据 5 · 源码核查**：[native/macos/ComiPet.swift:827-839](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/native/macos/ComiPet.swift#L827-L839)

审批提醒触发等待动作和气泡。

<details>
<summary>查看原文（13行）</summary>

```text
    private func handleNotice(_ n: BridgeNotice) {
        maybeNotify(n)
        if mode == "SLEEP" {
            if ["permission.required","turn.failed","task.completed"].contains(n.kind),
               sleepQueue.count < 3 { sleepQueue.append(n) }
            return
        }
        guard !hostSuppressed() else { return }
        switch n.kind {
        case "permission.required":
            if clips["WAITING"] != nil {
                play("WAITING", mode: "HOST", seconds: 0)
                updateHostBubble()
```

</details>

**依据 6 · 源码核查**：[adapters/dsh/comi-bridge/web.js:77-87](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/comi-bridge/web.js#L77-L87)

状态端点仅选择优先会话。

<details>
<summary>查看原文（11行）</summary>

```text
export function currentSession(sessions, now = Date.now()) {
  const all = [...sessions.values()].filter(s => now - s.updated <= 900_000)
  all.sort((a, b) => Number(b.phase === 'waiting') - Number(a.phase === 'waiting') || b.updated - a.updated)
  const active = all.find(s => ['working', 'waiting'].includes(s.phase))
  const selected = active ?? all[0]
  if (!selected) return { phase: 'idle', label: '', tool: '' }
  if (['success', 'failed'].includes(selected.phase) && now - selected.updated > 7_000) {
    return { phase: 'idle', label: '', tool: '' }
  }
  return { phase: selected.phase, label: selected.label, tool: selected.tool,
    session_id: selected.id, phase_since: selected.phaseSince }
```

</details>

#### 缺口

- 等待提醒的命中率和实际注意力收益未测
  **影响**：不能判断比直接看 DSH 更少遗漏
  **进一步探讨**：固定一批审批流程，对照使用原生桌宠与只看 DSH 的漏看和响应延迟

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 桌面与 DSH 界面如何交接，页面消失后如何恢复？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

子目录插件包导出宿主入口和 Web 客户端，客户端注册 shell.overlay。宿主与桌面各从收件箱父目录定位 display.json。以 macOS 为例，桌面发起内嵌时先写约 6 秒的请求租约，未认领时保持桌面可见。有素材清单的可见页可以通过心跳补写 client_id，桌面读到已认领的有效租约才隐藏。已认领的客户端每 5 秒尝试续约，宿主写入约 60 秒期限；别的客户端不能靠心跳抢占，显式选择可以转移。没有认领时桌面提示失败；有认领但停止续约时，桌面轮询在租约失效后恢复。租约确认的是某个客户端在续约，不能确认每一张素材帧都成功绘制。若两端自定义收件箱的父目录不同，双方读取的是不同显示文件。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/comi-bridge/package.json:5-24](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/comi-bridge/package.json#L5-L24)

宿主导出、客户端导出与 Web 平台声明。

<details>
<summary>查看原文（20行）</summary>

```text
  "description": "Comi pet for DSH: session status, in-app overlay and standalone desktop handoff",
  "type": "module",
  "main": "index.js",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json"
  },
  "engines": {
    "node": ">=20"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": ["@deepseek-ai/dsh-client-ui-slots"]
    }
  }
```

</details>

**依据 2 · 源码核查**：[adapters/dsh/comi-bridge/client.js:415-423](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/comi-bridge/client.js#L415-L423)

客户端注册 DSH 的 shell.overlay。

```text
    return {
      name: 'comi-pet', inject: ['slots'],
      __physics: { estimateVelocity, stepPhysics, PHYS },
      apply(ctx) {
        ctx.slots.inject('shell.overlay', function* () {
          yield ctx.slots.register({ name: 'shell.overlay', id: 'comi-pet', order: 1000 }, () => h(Overlay))
        })
      },
    }
```

**依据 3 · 源码核查**：[adapters/dsh/comi-bridge/client.js:131-165](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/comi-bridge/client.js#L131-L165)

加载素材、可见页认领、错误提示与心跳。

<details>
<summary>查看原文（35行）</summary>

```text
        let disposed = false
        Promise.all([request('manifest'), request('behaviors')]).then(([data, rules]) => {
          if (!disposed) { manifestRef.current = data; behavior.current = rules; setManifest(data) }
        }).catch(() => { if (!disposed) setError(text('未能读取 Comi 动画素材', 'Could not load Comi’s animations')) })
        const poll = async () => {
          try {
            const data = await request('state')
            if (disposed) return
            setHost(data.state)
            setDisplay(data.display)
            if (data.language) setLang(data.language)
            if (data.version) setVersion(data.version)
            setError('')
            // A native-menu request has no client id. The first visible DSH tab
            // claims it atomically; other tabs cannot prolong that lease.
            if (!document.hidden && manifestRef.current && data.display.mode === 'embedded' && !data.display.client_id) {
              try { const claimed = await request('heartbeat', { client_id: clientId }); if (!disposed) setDisplay(claimed.display) }
              catch { /* another DSH tab won the claim */ }
            }
          } catch { if (!disposed) setError(text('DSH 连接已断开；桌面模式将在租约到期后恢复（约 60 秒）', 'DSH disconnected; desktop mode returns when the lease expires (about 60 seconds)')) }
        }
        poll()
        const pollTimer = setInterval(poll, 1500)
        const expiryTimer = setInterval(() => setNow(Date.now()), 1000)
        const leaseTimer = setInterval(async () => {
          // 续租不看 document.hidden：DSH 窗口被遮挡/最小化时页面会进入 hidden，
          // 若停跳，30 秒后租约到期、桌宠自己弹回桌面（用户实测的两分钟回归就是这个）。
          const current = leaseRef.current
          if (current.mode !== 'embedded' || current.client_id !== clientId) return
          try { const data = await request('heartbeat', { client_id: clientId }); if (!disposed) setDisplay(data.display) }
          catch (failure) { if (!disposed && failure.data?.display) setDisplay(failure.data.display) }
        }, 5000)
        const visibility = () => { if (!document.hidden) poll() }
        document.addEventListener('visibilitychange', visibility)
        return () => { disposed = true; clearInterval(pollTimer); clearInterval(leaseTimer); clearInterval(expiryTimer); document.removeEventListener('visibilitychange', visibility) }
```

</details>

**依据 4 · 源码核查**：[adapters/dsh/comi-bridge/web.js:18-32](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/comi-bridge/web.js#L18-L32)

租约有效性以及缺失或过期时的桌面状态。

<details>
<summary>查看原文（15行）</summary>

```text
export const LEASE_MS = 60_000
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const clean = (value, limit = 80) => typeof value === 'string'
  ? value.replace(/[\x00-\x1f\x7f]/g, ' ').trim().slice(0, limit) : ''

export function readDisplay(path, now = Date.now()) {
  try {
    const value = JSON.parse(readFileSync(path, 'utf8'))
    if (value?.version === 1 && value.owner === 'dsh' && value.mode === 'embedded'
      && Number.isFinite(value.lease_until) && value.lease_until > now && value.lease_until <= now + 90_000) {
      return { version: 1, owner: 'dsh', mode: 'embedded', lease_until: value.lease_until,
        client_id: clean(value.client_id, 96) || null }
    }
  } catch { /* absent/corrupt/expired means standalone stays visible */ }
  return { version: 1, owner: 'dsh', mode: 'desktop', lease_until: 0, client_id: null }
```

</details>

**依据 5 · 源码核查**：[adapters/dsh/comi-bridge/web.js:111-125](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/comi-bridge/web.js#L111-L125)

宿主按事件目录确定显示文件。

<details>
<summary>查看原文（15行）</summary>

```text
export function createRouteHandler({ eventsDir, root = ROOT, sessions = new Map(), trustedHosts = () => [], clock = Date.now }) {
  const displayPath = resolve(dirname(eventsDir), 'display.json')
  const languagePath = resolve(dirname(eventsDir), 'language')
  const manifestPath = resolve(root, 'frames3d/animation.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  let version = null
  try { version = readFileSync(resolve(root, 'VERSION'), 'utf8').trim() } catch { /* 打包目录外跳过 */ }
  // 桌面端运行时合成的 FALL/LAND 帧也在服务白名单里（与 client.js 的合成剪辑一致）
  const frames = new Set([...Object.values(manifest.clips).flatMap(clip => clip.frames), 'fall_0', 'land_0'])
  return async function handler(req, res) {
    if (!isTrustedApiRequest(req, trustedHosts())) return json(res, 403, { ok: false, error: 'forbidden' })
    const path = new URL(req.url ?? '/', 'http://dsh.internal').pathname
    if (req.method === 'GET' && path === `${PREFIX}/api/state`) {
      return json(res, 200, { ok: true, display: readDisplay(displayPath, clock()), state: currentSession(sessions, clock()),
        language: readLanguage(languagePath), version })
```

</details>

**依据 6 · 源码核查**：[adapters/dsh/comi-bridge/web.js:140-164](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/comi-bridge/web.js#L140-L164)

帧资源可独立失败，显式切换与心跳采用不同的所有权规则。

<details>
<summary>查看原文（25行）</summary>

```text
    if (req.method === 'GET' && path.startsWith(`${PREFIX}/frames/`)) {
      const file = path.slice(`${PREFIX}/frames/`.length)
      const name = file.endsWith('.png') ? file.slice(0, -4) : ''
      if (!name || basename(file) !== file || !frames.has(name)) return json(res, 404, { ok: false, error: 'unknown frame' })
      try {
        const data = readFileSync(resolve(root, 'frames3d', file))
        res.writeHead(200, { 'content-type': 'image/png', 'cache-control': 'public, max-age=3600' })
        return res.end(data)
      } catch { return json(res, 404, { ok: false, error: 'missing frame' }) }
    }
    if (req.method === 'POST' && [`${PREFIX}/api/display`, `${PREFIX}/api/heartbeat`].includes(path)) {
      let body
      try { body = await readBody(req) } catch { return json(res, 400, { ok: false, error: 'invalid body' }) }
      const clientId = clean(body?.client_id, 96)
      if (!/^[a-zA-Z0-9_-]{8,96}$/.test(clientId)) return json(res, 400, { ok: false, error: 'invalid client id' })
      const current = readDisplay(displayPath, clock())
      const heartbeat = path.endsWith('/heartbeat')
      if (heartbeat && (current.mode !== 'embedded' || (current.client_id && current.client_id !== clientId))) {
        return json(res, 409, { ok: false, display: current, error: 'lease not owned' })
      }
      if (!heartbeat && !['embedded', 'desktop'].includes(body.mode)) return json(res, 400, { ok: false, error: 'invalid mode' })
      // Explicit mode selection can take over; an ordinary heartbeat cannot.
      const display = writeDisplay(displayPath, heartbeat ? 'embedded' : body.mode, clientId, clock())
      return json(res, 200, { ok: true, display })
    }
```

</details>

**依据 7 · 源码核查**：[native/macos/ComiPet.swift:630-673](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/native/macos/ComiPet.swift#L630-L673)

macOS 端路径、短请求、隐藏和超时恢复。

<details>
<summary>查看原文（44行）</summary>

```text
    private var chatDir: URL { bridge.dir.deletingLastPathComponent().appendingPathComponent("chat") }
    private var displayHidden = false
    private var displayPollAt: TimeInterval = 0
    private var embeddedRequestedAt: TimeInterval?
    private var displayFile: URL { bridge.dir.deletingLastPathComponent().appendingPathComponent("display.json") }
    private func refreshDisplay(now: TimeInterval) {
        guard now >= displayPollAt else { return }
        displayPollAt = now+0.25
        let lease = embeddedDisplayLease(displayFile,now:Date().timeIntervalSince1970*1000)
        // 两段式租约：只有 DSH 网页 claim（client_id 已写）才真的隐藏
        var hidden = lease?.isClaimed ?? false
        if embeddedRequestedAt != nil {
            if hidden {
                embeddedRequestedAt = nil               // DSH 网页已接手
            } else if lease == nil || now-embeddedRequestedAt! > 6.5 {
                // 确认窗口内没人接手（dsh 没开/页面没开）：回桌面并提示，不白藏
                embeddedRequestedAt = nil
                requestDisplay("desktop")
                showBubble(bridgeZh ? "未连上 DSH：启动 dsh 并打开网页后再试内嵌"
                                    : "DSH not reachable: start dsh and open its web page first",seconds:4)
                displayPollAt = now+0.25
                hidden = false
            }
        }
        if hidden != displayHidden {
            displayHidden = hidden
            print("[display-mode] \(hidden ? "embedded" : "desktop")"); fflush(stdout)
            if !hidden { panel.orderFrontRegardless(); play("IDLE",mode:"IDLE",seconds:3) }
        }
        if hidden { panel.orderOut(nil); followPanel?.orderOut(nil); bubblePanel?.orderOut(nil) }
    }
    private func requestDisplay(_ mode: String) {
        // 内嵌请求只给 6 秒确认窗口；网页客户端 claim 后会写 client_id 并续满租期
        let lease = DisplayLease(version:1,mode:mode,owner:"dsh",
                                 lease_until:mode == "embedded" ? Date().timeIntervalSince1970*1000+6000 : 0,
                                 client_id:nil)
        do {
            try FileManager.default.createDirectory(at:displayFile.deletingLastPathComponent(),withIntermediateDirectories:true)
            try JSONEncoder().encode(lease).write(to:displayFile,options:.atomic)
            embeddedRequestedAt = mode == "embedded" ? ProcessInfo.processInfo.systemUptime : nil
            displayPollAt = 0
        } catch {
            showBubble(bridgeZh ? "显示模式未能切换，请重试" : "Could not change display mode. Please retry.",seconds:4)
        }
```

</details>

#### 缺口

- 多标签并发、浏览器节流和两端时钟差对可见性的实际影响未知
  **影响**：无法保证接手过程始终只有一个可见角色或固定恢复时间
  **进一步探讨**：用两个页面切换，分别模拟挂起、图像失败、断开和错配路径，并记录两端可见时间线

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 摘要、Web 路由与聊天分别跨过哪些数据边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

事件收件箱默认有会话 ID、状态和工具名，默认不附任务标签。标签来自 todo，截断到 80 字；除配置外，环境变量和数据根目录的 summary 标记也能开启它，所以显式 false 不会覆盖另外两种开关。Web 路由先检查 Host、Origin 和 Fetch Metadata，帮助挡住跨站浏览器访问，但无 Origin 的请求可以通过主机检查，因此不能视为账号鉴权。聊天路径单独启用，默认 chat 为 true，在注入 llm 服务后扫描本机请求文件。请求 ID 做了长度截断，处理路径未见与文件名绑定或提交者鉴权，应由操作系统隔离谁能写聊天目录。聊天文本和近期记忆会作为消息传给选定的 DSH 模型，若模型使用远端服务，这部分会越过本机。成功后对话明文写回记忆与回复文件。状态观察不需要模型，关注数据边界时应独立关闭聊天及确认摘要开关。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/comi-bridge/index.js:22-37](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/comi-bridge/index.js#L22-L37)

摘要、聊天和保留轮数的默认配置。

<details>
<summary>查看原文（16行）</summary>

```text
export const DEFAULT_CONFIG = {
  /** 收件箱目录；空 = COMI_BRIDGE_DIR 环境变量或 ~/.comi-pet/events */
  eventsDir: '',
  /** 摘要开关：默认只传状态；开启后附带 todo 提炼的任务标签 */
  summary: false,
  /** 对话功能：桌宠"和 Comi 说话"经本插件用宿主 LLM 生成回复 */
  chat: true,
  /** 对话目录；空 = COMI_CHAT_DIR 环境变量或 ~/.comi-pet/chat */
  chatDir: '',
  /** 对话记忆保留轮数（一问一答为一轮） */
  chatMemoryRounds: 8,
  /** 单次生成超时（毫秒） */
  chatTimeoutMs: 60000,
  /** 可选：固定对话模型（默认跟随当前会话的 agent 默认模型） */
  chatProvider: '',
  chatModel: '',
```

</details>

**依据 2 · 源码核查**：[adapters/dsh/comi-bridge/index.js:79-90](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/comi-bridge/index.js#L79-L90)

任务标签截断。

<details>
<summary>查看原文（12行）</summary>

```text
function clean(value, limit) {
  if (typeof value !== 'string') return null
  const cleaned = value.replace(/[\x00-\x1f\x7f]/g, ' ').trim().slice(0, limit)
  return cleaned || null
}

/** 从 todo/write 提炼当前任务文本：第一个未完成项（与 dsh-pet 口径一致）。 */
export function currentTaskFromTodo(todos) {
  if (!Array.isArray(todos)) return null
  const current = todos.find(t => t?.status === 'in_progress') ?? todos[0]
  return clean(current?.content, 80)
}
```

</details>

**依据 3 · 源码核查**：[adapters/dsh/comi-bridge/index.js:134-160](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/comi-bridge/index.js#L134-L160)

事件字段与摘要启用条件。

<details>
<summary>查看原文（27行）</summary>

```text
  const payload = {
    version: 1,
    event_id: id,
    source: 'dsh',
    session_id: extra.sessionId,
    turn_id: null,
    timestamp: stamp,
    kind,
    task_label: extra.label ?? null,
    summary: null,
    tool_name: extra.toolName ?? null,
    severity: 'info',
  }
  const final = join(dir, `${String(Date.now()).padStart(19, '0')}-${id}.json`)
  const tmp = `${final}.tmp-${process.pid}`
  writeFileSync(tmp, JSON.stringify(payload))
  renameSync(tmp, final)
}


export function apply(ctx, config) {
  const cfg = { ...DEFAULT_CONFIG, ...(config ?? {}) }
  const eventsDir = cfg.eventsDir
    || process.env.COMI_BRIDGE_DIR
    || process.env.IVEN_BRIDGE_DIR
    || join(dataRoot(), 'events')
  const summary = () => cfg.summary || !['', '0', 'false'].includes(process.env.COMI_BRIDGE_SUMMARY ?? process.env.IVEN_BRIDGE_SUMMARY ?? '') || existsSync(join(dataRoot(), 'summary'))
```

</details>

**依据 4 · 源码核查**：[adapters/dsh/comi-bridge/index.js:192-209](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/comi-bridge/index.js#L192-L209)

聊天监听由宿主 LLM 注入启动。

<details>
<summary>查看原文（18行）</summary>

```text
  // 对话：动态注入 llm 服务；headless/未配置模型时自然跳过，插件其余功能不受影响
  if (cfg.chat) {
    ctx.inject(['llm', 'agentDefaultModel'], (chatCtx) => {
      const chat = createChatIntegration({
        services: { llm: chatCtx.llm, agentDefaultModel: chatCtx.agentDefaultModel },
        dir: resolveChatDir(cfg.chatDir),
        config: {
          memoryRounds: cfg.chatMemoryRounds,
          timeoutMs: cfg.chatTimeoutMs,
          chatProvider: cfg.chatProvider,
          chatModel: cfg.chatModel,
        },
        logger: ctx.logger,
      })
      ctx.effect(() => {
        chat.start()
        return () => chat.stop()
      }, 'comi-bridge: chat host')
```

</details>

**依据 5 · 源码核查**：[adapters/dsh/comi-bridge/trust-fence.js:4-28](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/comi-bridge/trust-fence.js#L4-L28)

检查浏览器来源属性并允许无 Origin 情况。

<details>
<summary>查看原文（25行）</summary>

```text
export function isTrustedApiRequest(request, trustedHosts = []) {
  const headers = request.headers ?? {}
  const host = typeof headers.host === 'string' ? headers.host : ''
  let hostUrl
  try { hostUrl = new URL(`http://${host}`) } catch { return false }
  if (!host || hostUrl.username || hostUrl.password || hostUrl.pathname !== '/') return false
  const hostname = hostUrl.hostname
  const parts = hostname.split('.')
  const loopback = hostname === 'localhost' || hostname === '[::1]'
    || (parts.length === 4 && parts[0] === '127' && parts.every(part => /^\d{1,3}$/.test(part) && +part <= 255))
  const trusted = trustedHosts.some(entry => {
    try {
      const url = new URL(`http://${entry}`)
      // URL strips the default HTTP port; use HTTPS to distinguish an explicit :80.
      const hasPort = url.port !== '' || new URL(`https://${entry}`).port !== ''
      return hasPort ? url.host === hostUrl.host : url.hostname === hostname
    } catch { return false }
  })
  if (!loopback && !trusted) return false
  if (headers['sec-fetch-site'] === 'cross-site') return false
  if (headers.origin === undefined) return true
  try {
    const origin = new URL(headers.origin)
    return ['http:', 'https:'].includes(origin.protocol) && origin.host === hostUrl.host
  } catch { return false }
```

</details>

**依据 6 · 源码核查**：[adapters/dsh/comi-bridge/chat-host.js:71-96](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/comi-bridge/chat-host.js#L71-L96)

将输入和历史发送给候选 DSH 模型。

<details>
<summary>查看原文（26行）</summary>

```text
  async function generate(system, history, text) {
    if (!services?.llm || typeof services.llm.stream !== 'function') {
      return { ok: false, reason: 'provider-missing', message: 'LLM 服务不可用' }
    }
    const candidates = modelCandidates()
    if (!candidates.length) {
      return { ok: false, reason: 'provider-missing', message: '未配置可用模型' }
    }
    const messages = buildMessages(history, buildUserText(text, MOODS))
    let last = null
    for (const candidate of candidates) {
      try {
        const chunks = []
        const stream = services.llm.stream({
          provider: candidate.provider,
          model: candidate.model,
          sessionId: 'comi-pet-chat',
          system,
          messages,
          temperature: 1,
          signal: AbortSignal.timeout(cfg.timeoutMs),
        })
        for await (const chunk of stream) chunks.push(chunk)
        const { text: reply, finish } = collectText(chunks)
        if (reply) {
          return { ok: true, reply, provider: candidate.provider, model: candidate.model }
```

</details>

**依据 7 · 源码核查**：[adapters/dsh/comi-bridge/chat-host.js:109-135](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/comi-bridge/chat-host.js#L109-L135)

请求处理、记忆更新与回复文件。

<details>
<summary>查看原文（27行）</summary>

```text
  function handleRequest(request) {
    const id = typeof request?.id === 'string' ? request.id.slice(0, 64) : null
    const finish = reply => {
      if (id) atomicWrite(join(dir, `reply-${id}.json`), { version: 1, id, ...reply })
    }
    if (request?.version !== 1 || !id) return Promise.resolve()
    const text = cleanText(request.text, MAX_TEXT)
    if (!text) {
      finish({ ok: false, reason: 'bad-request', message: '消息为空' })
      return Promise.resolve()
    }
    return generate(systemPrompt(), readMemory().slice(-(cfg.memoryRounds * 2)), text)
      .then(result => {
        if (!result?.ok) {
          log('warn', `回复失败：${result?.reason} ${result?.message ?? ''}`)
          finish({ ok: false, reason: result?.reason ?? 'generate-error',
                   message: result?.message ?? null })
          return
        }
        const { text: replyText, mood } = extractMood(result.reply, MOODS)
        appendMemory([
          { role: 'user', text, ts: Date.now() },
          { role: 'assistant', text: replyText, provider: result.provider,
            model: result.model, ts: Date.now() },
        ], cfg.memoryRounds)
        finish({ ok: true, text: replyText, mood })
      })
```

</details>

**依据 8 · 源码核查**：[adapters/dsh/comi-bridge/chat-host.js:138-162](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/comi-bridge/chat-host.js#L138-L162)

从本机聊天目录扫描和读取请求。

<details>
<summary>查看原文（25行）</summary>

```text
  function scan() {
    mkdirSync(dir, { recursive: true })
    let names = []
    try {
      names = readdirSync(dir)
    } catch {
      return
    }
    for (const name of names) {
      const path = join(dir, name)
      try {
        if (name.startsWith('request-') && name.endsWith('.json')) {
          if (inFlight.has(path)) continue
          if (Date.now() - statSync(path).mtimeMs > cfg.staleRequestMs) {
            rmSync(path)
            continue
          }
          const request = JSON.parse(readFileSync(path, 'utf8'))
          inFlight.add(path)
          chain = chain
            .then(() => handleRequest(request))
            .catch(error => log('warn', `请求处理异常：${error?.message ?? error}`))
            .finally(() => {
              try { unlinkSync(path) } catch { /* 已被清理 */ }
              inFlight.delete(path)
```

</details>

#### 缺口

- 具体部署的文件权限、代理绑定和模型提供方未知
  **影响**：不能给出数据留存位置和访问范围的统一保证
  **进一步探讨**：按所选 profile 核查目录属主、代理边界和 provider 的请求去向

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁值得先试，遇到界面不显示或目录不匹配时如何退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

经常在编辑器或其他窗口间切换、又希望及时看见 DSH 审批的开发者，可以在本机单独 profile 中先试状态提醒。保留同一份仓库布局，确认宿主插件与桌宠共用收件箱，初次启用后重启宿主并刷新页面。若只要桌面提醒，可先只核对审批、工具活动、普通结束这三个状态，不开聊天或文本标签。内嵌额外依赖 Web profile 和素材路径。页面接手失败时保留桌面模式；状态未到时优先检查两端收件箱，确认浏览器能读到素材后再重试内嵌。退出先移回桌面，再移除 profile 的配置条目和符号链接，原生程序可以单独运行。源码构建、安装、每次重新配置的人工时间以及桌面持续渲染资源均无量化，聊天如果启用另计模型请求成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:41-56](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/README.md#L41-L56)

作者说明打包运行与源码构建前提。

<details>
<summary>查看原文（16行）</summary>

````text
## 快速开始

**下载打包版（推荐）**：从[发布页](https://github.com/IvenKooLab/desktop-pet/releases/latest)下载对应平台的 zip，解压即用——

- **macOS 13+**：打开 `ComiPet.app`。Mac 包为临时签名、未做公证，若提示"无法验证开发者"，右键 App 选"打开"，或执行 `xattr -d com.apple.quarantine ComiPet.app` 后再打开。
- **Windows**：运行 `ComiPet.exe`，无需安装 Python。

**从源码运行**（体验最新动作）：

```bash
# macOS：双击 start-mac.command，或
zsh tools/build_macos.sh   # 首次构建需要 Apple 命令行工具（xcode-select --install）
open build/ComiPet.app

# Windows：Python 3.8+（自带 tkinter）
python pet.py
````

</details>

**依据 2 · 作者声明**：[adapters/dsh/README.md:13-31](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/README.md#L13-L31)

profile 接入方式及本地路径约束。

<details>
<summary>查看原文（19行）</summary>

````text
## 安装

方式 A（推荐，与 loci-dsh 同做法）：

```bash
# 1. 把插件符号链接进你的 profile（示例为 web）
ln -s <本仓库绝对路径>/adapters/dsh/comi-bridge \
      $DSH_HOME/profiles/web/node_modules/comi-bridge
# 2. 在该 profile 的 cordis.patch.yml 里加一行条目（参考 comi-bridge/cordis.patch.yml）：
#    - id: comi-bridge
#      name: comi-bridge
#      config: { eventsDir: "", summary: false }
```

方式 B：`dsh plugin --profile <name> add <本目录绝对路径>`。

一次性试验也可以 `dsh --profile <name> --patch <补丁文件>`：把
`comi-bridge/cordis.patch.yml` 复制到别处、`name` 改成相对补丁文件的
`./comi-bridge/` 路径（相对路径按补丁文件位置锚定）。
````

</details>

**依据 3 · 作者声明**：[adapters/dsh/README.md:43-55](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/README.md#L43-L55)

刷新、桌面程序前置和租约退回。

<details>
<summary>查看原文（13行）</summary>

```text
首次安装或更新本适配器后，重启 DSH 再刷新页面，使宿主和浏览器入口同时更新。
界面右上角会出现 **Comi · 移入界面**：点击后，宠物只在当前 DSH 页面内活动；
可拖动位置，右键点播动作。工作中或等待确认时，角色上方持续显示 DSH 状态，
开启摘要后还会显示任务标签。再次点击入口或宠物右键菜单中的 **移到独立桌面**
可切回独立模式。

独立应用须先运行（Mac：`start-mac.command`；Windows：`python pet.py`）。
适配器切换显示位置，不另行启动或终止应用。独立应用菜单也可请求进入 DSH 界面；
DSH 页面收到请求后认领显示权（写入 client_id 并续满租期），桌宠确认被接手后才隐藏——插件尚未加载或页面没开时，请求租约只有约 6 秒确认窗口，超时自动回桌面并提示，不会再白藏 30 秒；已接手后页面断开则租约到期（约 60 秒）恢复桌宠。

这是 **DSH 专用的界面内模式**。其他 Harness 的状态适配器不因此拥有界面注入能力。
浏览器刷新后，界面入口仍可用；多开 DSH 页面时，仅最后显式选中的页面显示宠物。

```

</details>

**依据 4 · 作者声明**：[adapters/dsh/README.md:91-95](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/README.md#L91-L95)

退出可保留共享目录。

```text
## 卸载

从 profile 的 `cordis.patch.yml` 删除 `comi-bridge` 条目并移除符号链接；
删除前可先切回独立桌面；即使直接关闭页面，有效期结束后独立应用也会恢复。
`~/.comi-pet` 同时包含其他适配器的设置与事件，卸载 DSH 插件无需删除整个目录。
```

**依据 5 · 源码核查**：[adapters/dsh/comi-bridge/web.js:140-148](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/comi-bridge/web.js#L140-L148)

素材缺失有明确响应。

```text
    if (req.method === 'GET' && path.startsWith(`${PREFIX}/frames/`)) {
      const file = path.slice(`${PREFIX}/frames/`.length)
      const name = file.endsWith('.png') ? file.slice(0, -4) : ''
      if (!name || basename(file) !== file || !frames.has(name)) return json(res, 404, { ok: false, error: 'unknown frame' })
      try {
        const data = readFileSync(resolve(root, 'frames3d', file))
        res.writeHead(200, { 'content-type': 'image/png', 'cache-control': 'public, max-age=3600' })
        return res.end(data)
      } catch { return json(res, 404, { ok: false, error: 'missing frame' }) }
```

**依据 6 · 源码核查**：[native/macos/ComiPet.swift:641-659](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/native/macos/ComiPet.swift#L641-L659)

未接手时原生端恢复及提示。

<details>
<summary>查看原文（19行）</summary>

```text
        if embeddedRequestedAt != nil {
            if hidden {
                embeddedRequestedAt = nil               // DSH 网页已接手
            } else if lease == nil || now-embeddedRequestedAt! > 6.5 {
                // 确认窗口内没人接手（dsh 没开/页面没开）：回桌面并提示，不白藏
                embeddedRequestedAt = nil
                requestDisplay("desktop")
                showBubble(bridgeZh ? "未连上 DSH：启动 dsh 并打开网页后再试内嵌"
                                    : "DSH not reachable: start dsh and open its web page first",seconds:4)
                displayPollAt = now+0.25
                hidden = false
            }
        }
        if hidden != displayHidden {
            displayHidden = hidden
            print("[display-mode] \(hidden ? "embedded" : "desktop")"); fflush(stdout)
            if !hidden { panel.orderFrontRegardless(); play("IDLE",mode:"IDLE",seconds:3) }
        }
        if hidden { panel.orderOut(nil); followPanel?.orderOut(nil); bubblePanel?.orderOut(nil) }
```

</details>

#### 缺口

- 无同版本安装和注销实测
  **影响**：不能把试用判断上升为稳定部署结论
  **进一步探讨**：用临时 profile 依次验证订阅、切换、关闭及清除插件配置

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 现有租约解决了交接，增加什么反馈可能改善失败处理？

**研究主题**：新假设与验证

#### 完整回答

桌面已经能在无人接手时提示启动 DSH，浏览器也会提示失联，不能把新设计的增量归为首次加入错误提示。可以验证在现有提示上区分未看到接手页、素材加载失败、租约过期三个原因，并显示当前剩余时间，是否减少用户重复点击切换。目录不匹配在没有共享通道时无法由这条协议可靠诊断，可保留为未知而不猜原因。用同一版本的原提示与试验提示，预置正常交接、缺素材、关闭接手页三种情况，记录正确退回桌面所需时间、无效点击次数和误导率。没有缩短处理时间或误导增加即否定。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/comi-bridge/client.js:131-165](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/comi-bridge/client.js#L131-L165)

当前素材和连接错误提示以及定时续约。

<details>
<summary>查看原文（35行）</summary>

```text
        let disposed = false
        Promise.all([request('manifest'), request('behaviors')]).then(([data, rules]) => {
          if (!disposed) { manifestRef.current = data; behavior.current = rules; setManifest(data) }
        }).catch(() => { if (!disposed) setError(text('未能读取 Comi 动画素材', 'Could not load Comi’s animations')) })
        const poll = async () => {
          try {
            const data = await request('state')
            if (disposed) return
            setHost(data.state)
            setDisplay(data.display)
            if (data.language) setLang(data.language)
            if (data.version) setVersion(data.version)
            setError('')
            // A native-menu request has no client id. The first visible DSH tab
            // claims it atomically; other tabs cannot prolong that lease.
            if (!document.hidden && manifestRef.current && data.display.mode === 'embedded' && !data.display.client_id) {
              try { const claimed = await request('heartbeat', { client_id: clientId }); if (!disposed) setDisplay(claimed.display) }
              catch { /* another DSH tab won the claim */ }
            }
          } catch { if (!disposed) setError(text('DSH 连接已断开；桌面模式将在租约到期后恢复（约 60 秒）', 'DSH disconnected; desktop mode returns when the lease expires (about 60 seconds)')) }
        }
        poll()
        const pollTimer = setInterval(poll, 1500)
        const expiryTimer = setInterval(() => setNow(Date.now()), 1000)
        const leaseTimer = setInterval(async () => {
          // 续租不看 document.hidden：DSH 窗口被遮挡/最小化时页面会进入 hidden，
          // 若停跳，30 秒后租约到期、桌宠自己弹回桌面（用户实测的两分钟回归就是这个）。
          const current = leaseRef.current
          if (current.mode !== 'embedded' || current.client_id !== clientId) return
          try { const data = await request('heartbeat', { client_id: clientId }); if (!disposed) setDisplay(data.display) }
          catch (failure) { if (!disposed && failure.data?.display) setDisplay(failure.data.display) }
        }, 5000)
        const visibility = () => { if (!document.hidden) poll() }
        document.addEventListener('visibilitychange', visibility)
        return () => { disposed = true; clearInterval(pollTimer); clearInterval(leaseTimer); clearInterval(expiryTimer); document.removeEventListener('visibilitychange', visibility) }
```

</details>

**依据 2 · 源码核查**：[adapters/dsh/comi-bridge/web.js:23-32](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/adapters/dsh/comi-bridge/web.js#L23-L32)

过期和缺失租约都返回桌面状态。

<details>
<summary>查看原文（10行）</summary>

```text
export function readDisplay(path, now = Date.now()) {
  try {
    const value = JSON.parse(readFileSync(path, 'utf8'))
    if (value?.version === 1 && value.owner === 'dsh' && value.mode === 'embedded'
      && Number.isFinite(value.lease_until) && value.lease_until > now && value.lease_until <= now + 90_000) {
      return { version: 1, owner: 'dsh', mode: 'embedded', lease_until: value.lease_until,
        client_id: clean(value.client_id, 96) || null }
    }
  } catch { /* absent/corrupt/expired means standalone stays visible */ }
  return { version: 1, owner: 'dsh', mode: 'desktop', lease_until: 0, client_id: null }
```

</details>

**依据 3 · 源码核查**：[native/macos/ComiPet.swift:635-659](https://github.com/IvenKooLab/desktop-pet/blob/27677f0ce6956495e02c8d88037133791ec7578f/native/macos/ComiPet.swift#L635-L659)

无人接手的桌面恢复提示。

<details>
<summary>查看原文（25行）</summary>

```text
    private func refreshDisplay(now: TimeInterval) {
        guard now >= displayPollAt else { return }
        displayPollAt = now+0.25
        let lease = embeddedDisplayLease(displayFile,now:Date().timeIntervalSince1970*1000)
        // 两段式租约：只有 DSH 网页 claim（client_id 已写）才真的隐藏
        var hidden = lease?.isClaimed ?? false
        if embeddedRequestedAt != nil {
            if hidden {
                embeddedRequestedAt = nil               // DSH 网页已接手
            } else if lease == nil || now-embeddedRequestedAt! > 6.5 {
                // 确认窗口内没人接手（dsh 没开/页面没开）：回桌面并提示，不白藏
                embeddedRequestedAt = nil
                requestDisplay("desktop")
                showBubble(bridgeZh ? "未连上 DSH：启动 dsh 并打开网页后再试内嵌"
                                    : "DSH not reachable: start dsh and open its web page first",seconds:4)
                displayPollAt = now+0.25
                hidden = false
            }
        }
        if hidden != displayHidden {
            displayHidden = hidden
            print("[display-mode] \(hidden ? "embedded" : "desktop")"); fflush(stdout)
            if !hidden { panel.orderFrontRegardless(); play("IDLE",mode:"IDLE",seconds:3) }
        }
        if hidden { panel.orderOut(nil); followPanel?.orderOut(nil); bubblePanel?.orderOut(nil) }
```

</details>

#### 缺口

- 未收集用户处理模式切换故障的记录
  **影响**：不能预判增加反馈会改善体验
  **进一步探讨**：在匹配环境比较有无详细反馈的重复点击和正确恢复时间

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
