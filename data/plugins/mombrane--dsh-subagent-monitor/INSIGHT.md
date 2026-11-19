# 子 Agent 监控面板

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[f8beee4](https://github.com/Mombrane/dsh-subagent-monitor/tree/f8beee47f4dea63096070c141a97f889181a590a)

<!-- BEGIN META -->
[![GitHub ★ 30](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=30&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Mombrane/dsh-subagent-monitor) [![npm 30d 1,049](https://img.shields.io/static/v1?label=npm+30d&message=1%2C049&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@leetoners/dsh-ui-subagent-monitor) [![最新发布 2026-09-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@leetoners/dsh-ui-subagent-monitor)
<!-- END META -->

> **功能**：在 DSH Web 侧栏和浮动看板展示当前会话直接子 Agent 的状态、用量与上下文估计。

> **亮点**：真实增量是把全局生命周期按直接父ID过滤，并用持久子目录补齐卡片、用量及导航；同step用量替换和压缩影子价格避免部分重复计数与占用只增不减。见 [Q02](#research-q02)、[Q03](#research-q03)。

> **主要限制**：集中展示会不会让旧或估计数据看起来像当前事实？历史回填结局未知、同child多run可能取旧条、切会话失败仍保留旧行；用量按会话累计而非单run精确账单。见 [Q02](#research-q02)至[Q04](#research-q04)。

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
  - [Q01 · 面板改变哪一步查看流程，相比直接开子会话增加什么？](#detail-section-11)
  - [Q02 · 生命周期、直接父子目录和重启回填如何合并？](#detail-section-12)
  - [Q03 · 用量、缓存与当前上下文如何计算，能否当账单或run成本？](#detail-section-13)
  - [Q04 · 切会话、断网、后台标签与导航/清空会怎样？](#detail-section-14)
  - [Q05 · 必需/可选服务与首次、持续、恢复、退出成本是什么？](#detail-section-15)
  - [Q06 · 谁适合试，如何验证增加可见性没有增加错误决策？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向同时委派多个子 Agent 的 DSH Web 用户，集中查看当前会话直接孩子的状态与用量，再打开具体对话核查结果。

直接逐个打开子会话可核对结果；本插件集中可见性并保留按层导航，不替代业务验收或执行控制。见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 直接子Agent卡片 | 集中查看一层状态 | 重启回填结局可能unknown |
| 上下文/缓存看板 | 观察用量和窗口估计 | 字符启发式，不是精确账单 |
| 子会话导航 | 打开具体结果继续核查 | 需要mode和sessions服务 |
| 可见性轮询控制 | 关闭/后台时停表 | 已发请求与服务端缓存不等于全部释放 |
| 本地布局设置 | 调整位置、高度和宽度 | 不影响原会话任务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| sessions/subagents/webServer | 宿主必需 | 生命周期、目录与快照路由 | 核心观察链不能建立 |
| slots/sessions/react与Web runtime | 客户端必需 | 看板及子会话导航 | 无插槽或导航不可用 |
| sessionPersistence | 冷日志可选 | 重启后的用量回填 | 省略usage，不补零 |
| locale | 可选 | 跟随宿主语言 | 回默认中文 |
| provider用量/压缩日志字段 | 特定统计必需 | 桶和窗口占用 | 仅部分估计，不能精确计费 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选固定版本和独立profile | 核对host/client依赖 |
| 加载 | 安装并重启Web，核对路由/面板 | 历史兼容声明不能代替本环境验证 |
| 使用 | 用户委派子任务，按层查看并打开对话 | 孙任务不混入当前层，unknown不当成功 |
| 异常/退出 | 对照原日志，移除包重启 | 旧快照或估计不符就停止据此放行 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包构建/存储，金额未知 | profile/版本/面板核对 | 时长未测 |
| 持续使用 | 可见时1秒快照、日志折叠/缓存 | 回原会话确认异常和未知 | 不新增模型执行，但任务模型成本仍在 |
| 失败恢复 | 额外请求/冷日志读取 | 检查依赖、路由、状态新鲜度 | CPU/内存与人工投入未知 |
| 退出 | 停止插件加载 | 移除重启，保留原会话日志 | 浏览器本地布局设置另存 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 集中看状态 | 按直接父层合并事件与目录 | 实际漏看/误判是否减少 |
| 用量与占用 | provider桶、同step替换与表层估计 | 精确账单和单run成本 |
| 空闲资源控制 | 关闭/后台停定时器 | 大规模缓存与日志成本 |

> **思考**：集中展示会不会让旧或估计数据看起来像当前事实？历史回填结局未知、同child多run可能取旧条、切会话失败仍保留旧行；用量按会话累计而非单run精确账单。见 [Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：真实增量是把全局生命周期按直接父ID过滤，并用持久子目录补齐卡片、用量及导航；同step用量替换和压缩影子价格避免部分重复计数与占用只增不减。见 [Q02](#research-q02)、[Q03](#research-q03)。

值得借鉴的是按直接父ID过滤与目录补齐、同step样本替换、可见性控制轮询；移植依赖宿主事件/压缩语义，并要另补请求新鲜度和run/session口径，见 [Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

集中展示会不会让旧或估计数据看起来像当前事实？历史回填结局未知、同child多run可能取旧条、切会话失败仍保留旧行；用量按会话累计而非单run精确账单。见 [Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在隔离profile用两个直接子任务、一个孙任务和一次失败/重启检查层级及unknown，再回具体会话核对结果。用量只作观察，不拿累计会话桶结算单run费用；出现旧卡片或状态不符就回原日志，具体判据见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

直接层级、事件/目录合并与用量折叠有源码支持；显示陈旧和多run条件是静态路径推导，未运行复现；效率及新设计未验证。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、README.md、tsdown.config.ts、src/index.ts、src/client/index.ts、src/client/panel.tsx、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取固定host源码543行、client入口注册/可选locale、panel状态/轮询/导航/清空与用量呈现链、构建映射和lib对应接线。未逐项审计所有CSS、翻译或整个宿主；不把作者旧版本验收当本轮运行。
- 下一步：- 已检查固定源码及预构建输出的关键接线。
- 未运行目标插件、浏览器、宿主或模型。
- 显示与用量的边界是源码路径判断，真实任务效果及兼容未测。

**分析版本**

- **仓库**：[Mombrane/dsh-subagent-monitor](https://github.com/Mombrane/dsh-subagent-monitor)
- **版本号**：0.5.0（[固定提交 f8beee4](https://github.com/Mombrane/dsh-subagent-monitor/tree/f8beee47f4dea63096070c141a97f889181a590a)）
- **版本日期**：2026-09-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证方向是显式分开run/session口径，并带请求序号、新鲜度和切会话清行；用继续运行、交错响应与断网反例核对错误归属和人工查证，若不减少误判则只定位导航。见 [Q06](#research-q06)。

- 已检查固定源码及预构建输出的关键接线。
- 未运行目标插件、浏览器、宿主或模型。
- 显示与用量的边界是源码路径判断，真实任务效果及兼容未测。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 1562 | — | — | 17123 |
| .js | source | 2 | 1893 | 1742 | 249 | — |
| .mjs | source | 1 | 100 | 78 | 16 | — |
| .ts | source | 4 | 1147 | 870 | 225 | — |
| .tsx | source | 1 | 1156 | 938 | 146 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Mombrane/dsh-subagent-monitor/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Mombrane/dsh-subagent-monitor/issues?q=is%3Aissue+created%3A2026-10-20T03%3A16%3A38.300Z..2026-11-19T03%3A16%3A38.300Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Mombrane/dsh-subagent-monitor/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-20T03%3A16%3A38.300Z..2026-11-19T03%3A16%3A38.300Z)



统计日期：2026-11-19。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对直接子Agent状态、历史回填和用量估计是否足以辅助查证。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面板改变哪一步查看流程，相比直接开子会话增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是正在DSH Web里同时委派多个子Agent、需要判断接下来打开哪项对话的用户。合格任务是看清当前父会话直接派生的运行、结束和未知项，并进入具体子会话核查结果。插件在侧栏放入口，在shell浮层集中显示卡片、状态与用量，减少逐个切换会话搜寻状态；它不创建委派、不控制任务完成，也没有代替业务验收。

直接打开各子会话仍是具体结果的核对途径。插件选择每层只列直接孩子，避免孙辈混进当前父层；用户要进入孩子后继续查看下一层，而不是得到全树总览。集中展示对多子任务有实际流程增量，对几乎不委派或只有一项短任务的用户未必值得占用屏幕和依赖。README展示看板功能属于作者说明，运行节时和错误减少没有本轮实测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-38](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/README.md#L15-L38)

作者定位集中查看、直接派生与用量卡片。

<details>
<summary>查看原文（24行）</summary>

````text
## ✨ 是什么

在 DSH Web 界面侧栏底部加一个「子代理」入口，并在屏幕**右上角**常驻一块卡片式面板，实时展示当前会话**直接派生**的子代理的运行状态。进入某个子代理会话后，面板随之显示该会话直接派生的下一层子代理。

面板顶部是一块**总体监控看板**：左侧三枚环形图展示主会话的上下文窗口**当前占用**、主会话与子代理聚合的**缓存命中率**；右侧一根状态柱状图展示当前层子代理的运行 / 完成 / 异常计数（按最大值等比缩放）。每张卡片下方另附一行用量明细（该 run 的输入 / 输出、缓存命中、上下文大小）。

面板支持**两个方向**的收起，互不干扰：

- **纵向（两段式）**：标题栏「收起」第一次只收下方子代理卡片（顶部总览看板保留，按钮变「全部收起」）；再点一次才收到只剩标题栏；「展开」一步恢复。
- **横向（向左折叠为窄栏）**：标题栏 `◂` 把面板折成 **120px** 窄栏 —— **右边缘钉住不动，所以是朝左折**；保留**上下文与主会话两枚环（原大小 48px）**，由左右一排改为**从上到下一列**，去掉子代理环，下部继续保留子代理运行框（紧凑卡片）。`▸` 向右展开回 340px。

```
┌─ ⤢ 子代理看板 ──────────── [◂] [收起 ▴] [✕] ┐
│  ◔ 上下文 ◔ 主会话 ◔ 子代理    █ 运行 1 · █ 完成 1 · █ 异常 0 │
│ ┌─────────────────────────────────────┐ │
│ │ 🔵 统计 ui 目录 TS 文件数   [打开对话] │ │
│ │    one-shot · 1a2b3c4d   运行中 · 00:42 │ │
│ │    ↑12.3k ↓4.5k · 缓存 78% · 上下文 45.6k │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ 🟢 演示子代理：统计文件类型  [打开对话] │ │
│ │    spawn · 2b3c4d5e    完成 · 03:12  │ │
│ └─────────────────────────────────────┘ │
│  运行 1 · 完成 1 · 异常 0    [清空已完成] │
````

</details>

**依据 2 · 源码核查**：[src/client/index.ts:359-372](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/src/client/index.ts#L359-L372)

真实侧栏触发和shell浮层接线。

<details>
<summary>查看原文（14行）</summary>

```text
  ctx.slots.inject(
    'sidebar.footer.action',
    () => ctx.slots.register(
      { name: 'sidebar.footer.action', id: 'subagent-monitor', order: 50 },
      Trigger,
    ),
  )
  ctx.slots.inject(
    'shell.overlay',
    () => ctx.slots.register(
      { name: 'shell.overlay', id: 'subagent-monitor-panel', order: 100 },
      Panel,
    ),
  )
```

</details>

**依据 3 · 源码核查**：[src/client/panel.tsx:838-849](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/src/client/panel.tsx#L838-L849)

打开子会话仍使用宿主导航能力。

<details>
<summary>查看原文（12行）</summary>

```text
  const openChild = (row: MonitorRow): void => {
    if (sessionsSvc === undefined || monitor.sessionId === undefined || row.mode === undefined) return
    // The direct parent is the authority the address needs. Every row is a
    // direct child of the viewed session, but reading parentId keeps that an
    // explicit fact rather than an assumption a future tree view would break.
    const address: SubagentAddress = {
      parentSessionId: (row.parentId ?? monitor.sessionId) as SessionId,
      childSessionId: row.id as SessionId,
      mode: row.mode as 'one-shot' | 'continuable',
    }
    sessionsSvc.openSubagent(address)
  }
```

</details>

#### 缺口

- 缺少多子任务的同条件查看耗时和漏看对照。
  **影响**：只能判断集中可见性的机制增量，不证明效率收益。
  **进一步探讨**：固定一批委派任务对照原会话列表，记录找对异常子项耗时、漏看和人工核验次数。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 生命周期、直接父子目录和重启回填如何合并？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

服务端注入sessions、subagents、webServer，onStart根据活跃子会话header.parentSession取得直接父ID，把事件按runId存Map；onEnd用同runId写stopReason和结束时间。snapshot按查询sessionId过滤事件，再用subagents.listChildren补齐持久目录标签和mode。因此只看一层，父会话不会自动抬升孙辈事件；找不到活跃子会话父ID的start被忽略。

进程重启后事件Map为空，目录回填的running可由activity保留，其余结局写unknown，不能据此假定历史成功。超过每父200条时只删最老的非running事件，运行中项不删，故不是全体内存绝对上限。若同一childId在本进程被继续执行多次，eventRows先按startedAt升序，再find首个同id事件合并到目录行，可能显示旧run；目录行已seen的id又不追加其余事件。这个条件分支由源码推导，未运行构造重现，不能把行标签当精确的最新run证据。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:85-87](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/src/index.ts#L85-L87)

必要服务。

```text
const MAX_PER_PARENT = 200

export const inject = ['sessions', 'subagents', 'webServer']
```

**依据 2 · 源码核查**：[src/index.ts:360-411](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/src/index.ts#L360-L411)

直接父归属、200条已结束裁剪和run事件存储。

<details>
<summary>查看原文（52行）</summary>

```text
  // One hop up the durable lineage: the delegating session. The panel shows a
  // single layer, so a run belongs to its direct parent and is never lifted to
  // the root of the tree (that lifting is what made grandchildren surface in a
  // parent's panel).
  const parentOf = (childId: string): string | undefined => {
    const child = ctx.sessions.get(childId as SessionId)
    const parent = child?.header.parentSession
    return parent === undefined ? undefined : str(parent)
  }

  const prune = (): void => {
    const counts = new Map<string, number>()
    for (const row of runs.values()) counts.set(row.parentId, (counts.get(row.parentId) ?? 0) + 1)
    for (const [parentId, count] of counts) {
      if (count <= MAX_PER_PARENT) continue
      let excess = count - MAX_PER_PARENT
      const rows = [...runs.values()]
        .filter(row => row.parentId === parentId && row.status !== 'running')
        .sort((a, b) => a.startedAt - b.startedAt)
      for (const row of rows) {
        if (excess <= 0) break
        runs.delete(row.runId)
        excess -= 1
      }
    }
  }

  const onStart = (info: SubagentRunInfo): void => {
    const childId = str(info.id)
    const parentId = parentOf(childId)
    if (parentId === undefined) return
    runs.set(str(info.runId), {
      runId: str(info.runId),
      id: childId,
      provider: info.provider,
      local: info.local,
      parentId,
      startedAt: Date.now(),
      status: 'running',
    })
    prune()
  }

  const onEnd = (info: SubagentRunEndInfo): void => {
    const row = runs.get(str(info.runId))
    if (row === undefined) return
    row.status = info.stopReason
    row.endedAt = Date.now()
  }

  ctx.on('subagent/start', onStart, { global: true })
  ctx.on('subagent/end', onEnd, { global: true })
```

</details>

**依据 3 · 源码核查**：[src/index.ts:467-520](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/src/index.ts#L467-L520)

目录合并、unknown、升序find首条及seen排除。

<details>
<summary>查看原文（54行）</summary>

```text
  const enrich = async (sessionId: string): Promise<PanelRow[]> => {
    let desc: Awaited<ReturnType<typeof ctx.subagents.listChildren>> = []
    try {
      desc = await ctx.subagents.listChildren(sessionId as SessionId)
    } catch {
      desc = []
    }
    const eventRows: RunRow[] = []
    for (const row of runs.values()) {
      if (row.parentId === sessionId) eventRows.push({ ...row })
    }
    eventRows.sort((a, b) => a.startedAt - b.startedAt)
    const merged: PanelRow[] = []
    const seen = new Set<string>()
    // Catalog entries arrive oldest-first; the descending recency key lets
    // unobserved rows rank newest-first below any observed run.
    for (let index = 0; index < desc.length; index++) {
      const entry = desc[index]
      if (entry === undefined) continue
      const id = str(entry.id)
      seen.add(id)
      // Every catalog entry here is a direct child of the queried session by
      // construction, so the parent is the query itself (listChildren entries
      // carry no parentId of their own).
      const base = {
        id,
        ...(entry.kind === 'child' && entry.label !== undefined ? { label: entry.label } : {}),
        ...(entry.kind === 'child' ? { mode: entry.mode } : {}),
        parentId: sessionId,
      }
      const ev = eventRows.find(row => row.id === id)
      if (ev !== undefined) {
        merged.push({ ...base, ...ev })
      } else {
        merged.push({
          ...base,
          local: true,
          sortKey: -(desc.length - index),
          status: entry.kind === 'child' && entry.activity === 'running' ? 'running' : 'unknown',
        })
      }
    }
    for (const ev of eventRows) {
      if (!seen.has(ev.id)) merged.push({ ...ev })
    }
    // Newest first: observed runs sort by start time; catalog-only rows fall
    // back to their recency key (always below observed runs).
    merged.sort((a, b) => {
      const ka = a.startedAt ?? a.sortKey ?? Number.NEGATIVE_INFINITY
      const kb = b.startedAt ?? b.sortKey ?? Number.NEGATIVE_INFINITY
      return kb - ka
    })
    await applyUsage(merged)
    return merged
```

</details>

**依据 4 · 源码核查**：[src/index.ts:523-542](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/src/index.ts#L523-L542)

快照路由按sessionId请求。

<details>
<summary>查看原文（20行）</summary>

```text
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/api/subagent-monitor/snapshot',
    handler: async (req, res) => {
      const url = new URL(req.url ?? '/', 'http://localhost')
      const sessionId = url.searchParams.get('sessionId')
      const payload = sessionId === null
        ? { now: Date.now(), rows: [] }
        : {
            sessionId,
            now: Date.now(),
            rows: await enrich(sessionId),
            // The viewed session's own usage/context (window, pressure,
            // tool outputs) — the "main session" side of the dashboard.
            main: await childUsage(sessionId),
          }
      res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' })
      res.end(JSON.stringify(payload))
    },
  }), 'ui-subagent-monitor: snapshot route')
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 用量、缓存与当前上下文如何计算，能否当账单或run成本？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

它从每个子会话自己的事件折叠provider报告的input/output/cache read/cache write桶。assistant usage chunk和最终message若属于同turn/step，后者替换前样本而不是重复加总。累计contextTokens是prompt侧桶累积，不是当前窗口占用；pressureTokens取最新请求样本，projectedTokens再用之后的表层消息增减估算当前占用。压缩事件先登记shadowedTokenCount，紧随且范围匹配的surface replacement才扣减，无法匹配的替换按零增量处理。工具结果用字符数/4加结构开销估算，不能作为精确token账单。

活跃会话按事件水位增量读取，冷会话可选用sessionPersistence.inspect一次并缓存；服务缺失或读取失败就省略usage，而不是补零。聚合最多8路并发读日志，控制首载并发但不限制整个缓存会话数量。所有usage为零时toUsageData也返回undefined，显示缺失不能直接推断真正消费为零。用量按child session ID缓存，生命周期卡片却按runId描述，不能把累计会话桶直接称为单次run消费。没有价格/模型计费条件，也不能从缓存比例计算节约现金。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:144-178](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/src/index.ts#L144-L178)

provider桶与usage来源。

<details>
<summary>查看原文（35行）</summary>

```text
const bucketsOf = (usage: TokenUsageLike): UsageBuckets => ({
  uncachedInputTokens: usage.inputTokens,
  outputTokens: usage.outputTokens,
  cacheReadTokens: usage.cacheReadTokens ?? 0,
  cacheWriteTokens: usage.cacheWriteTokens ?? 0,
})

const bucketsEqual = (left: UsageBuckets, right: UsageBuckets): boolean =>
  left.uncachedInputTokens === right.uncachedInputTokens
  && left.outputTokens === right.outputTokens
  && left.cacheReadTokens === right.cacheReadTokens
  && left.cacheWriteTokens === right.cacheWriteTokens

/** Replace one step's earlier sample instead of double counting it. */
const addReplacing = (
  totals: UsageBuckets,
  previous: UsageBuckets | undefined,
  next: UsageBuckets,
): UsageBuckets => ({
  uncachedInputTokens: totals.uncachedInputTokens - (previous?.uncachedInputTokens ?? 0) + next.uncachedInputTokens,
  outputTokens: totals.outputTokens - (previous?.outputTokens ?? 0) + next.outputTokens,
  cacheReadTokens: totals.cacheReadTokens - (previous?.cacheReadTokens ?? 0) + next.cacheReadTokens,
  cacheWriteTokens: totals.cacheWriteTokens - (previous?.cacheWriteTokens ?? 0) + next.cacheWriteTokens,
})

/** The usage a step reports, from a final message or an early usage chunk. */
const usageOf = (event: SessionEvent): TokenUsageLike | undefined => {
  if (event.type === 'assistant/message') {
    return (event.data as { usage?: TokenUsageLike }).usage
  }
  if (event.type === 'assistant/chunk') {
    const chunk = event.data.chunk as { type: string, usage?: TokenUsageLike }
    return chunk.type === 'usage' ? chunk.usage : undefined
  }
  return undefined
```

</details>

**依据 2 · 源码核查**：[src/index.ts:184-211](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/src/index.ts#L184-L211)

工具内容字符密度启发式。

<details>
<summary>查看原文（28行）</summary>

```text
/** Fixed-density heuristic matching @deepseek-ai/dsh-token-meter's estimate. */
const CHARS_PER_TOKEN = 4
const BLOCK_OVERHEAD = 4
const ROLE_OVERHEAD = 4

/**
 * Price a content-block list under the meter's fixed density (chars / 4 plus
 * per-block structural overhead). Tool outputs are not reported by providers,
 * so the context ring's "tool output" slice is this heuristic over
 * 'tool/result' message content — the same estimate the harness itself uses.
 */
function estimateContentTokens(blocks: readonly unknown[]): number {
  let tokens = 0
  for (const block of blocks) {
    const b = block as { type?: string; text?: string; content?: unknown[]; name?: string; arguments?: string }
    switch (b.type) {
      case 'text':
      case 'reasoning':
        tokens += Math.ceil((b.text ?? '').length / CHARS_PER_TOKEN) + BLOCK_OVERHEAD
        break
      case 'tool-result':
        tokens += estimateContentTokens(b.content ?? []) + BLOCK_OVERHEAD
        break
      default:
        tokens += BLOCK_OVERHEAD + Math.ceil(JSON.stringify(block).length / CHARS_PER_TOKEN)
    }
  }
  return tokens
```

</details>

**依据 3 · 源码核查**：[src/index.ts:250-281](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/src/index.ts#L250-L281)

压缩影子价格与匹配replacement。

<details>
<summary>查看原文（32行）</summary>

```text
const foldSurface = (
  claim: ShadowPriceClaim | undefined,
  event: SessionEvent,
): { deltaTokens: number, claim: ShadowPriceClaim | undefined } => {
  // 'compaction/summary'/'compaction/prune' live in the dsh-compaction event
  // merge, absent from this plugin's static SessionEvent union — widen the
  // type so the branch survives without a runtime narrowing to `never`.
  const type = (event as { type?: string }).type
  if (type === 'compaction/summary' || type === 'compaction/prune') {
    const data = (event as { data?: {
      shadowedRange?: { start?: number, end?: number }
      shadowedTokenCount?: number
    } }).data
    const range = data?.shadowedRange
    if (range !== undefined
      && typeof range.start === 'number' && typeof range.end === 'number'
      && typeof data?.shadowedTokenCount === 'number') {
      return { deltaTokens: 0, claim: { start: range.start, end: range.end, tokens: data.shadowedTokenCount } }
    }
    return { deltaTokens: 0, claim: undefined }
  }
  const raw = event as SessionEvent & { surfaceOp?: unknown }
  // Non-surface events move nothing and expire any armed claim.
  if (raw.surfaceOp === undefined) return { deltaTokens: 0, claim: undefined }
  const message = surfaceMessageOf(event)
  const tokens = message === null ? 0 : estimateContentTokens(message.content) + ROLE_OVERHEAD
  if (raw.surfaceOp === 'append') return { deltaTokens: tokens, claim: undefined }
  const op = raw.surfaceOp as { op: string, start?: number, end?: number }
  if (claim === undefined || op.start !== claim.start || op.end !== claim.end) {
    return { deltaTokens: 0, claim: undefined }
  }
  return { deltaTokens: tokens - claim.tokens, claim: undefined }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:296-329](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/src/index.ts#L296-L329)

水位、同step替换与累计。

<details>
<summary>查看原文（34行）</summary>

```text
function foldUsage(state: UsageFoldState, events: readonly SessionEvent[]): void {
  let index = state.consumedEvents
  for (; index < events.length; index++) {
    const event = events[index]
    if (event === undefined) continue
    if (event.type === 'request/context') {
      const contextWindow = (event.data as { contextWindow?: number }).contextWindow
      if (contextWindow !== undefined) state.contextWindow = contextWindow
      continue
    }
    if (event.type === 'tool/result') {
      const message = (event.data as { message?: { content?: readonly unknown[] } }).message
      if (message?.content !== undefined) state.toolOutputTokens += estimateContentTokens(message.content)
    }
    const usage = usageOf(event)
    const fold = foldSurface(state.claim, event)
    state.claim = fold.claim
    if (usage !== undefined) {
      const buckets = bucketsOf(usage)
      const { turn, step } = stepOf(event)
      const previous = state.last !== null && state.last.turn === turn && state.last.step === step
        ? state.last.buckets
        : undefined
      if (previous === undefined || !bucketsEqual(previous, buckets)) {
        state.totals = addReplacing(state.totals, previous, buckets)
        state.last = { turn, step, buckets }
        state.pressureTokens = buckets.uncachedInputTokens + buckets.cacheReadTokens + buckets.cacheWriteTokens
        // Stamp the surface total before this event joins it.
        state.sampledSurfaceTokens = state.surfaceTokens
      }
    }
    if (fold.deltaTokens !== 0) state.surfaceTokens += fold.deltaTokens
  }
  state.consumedEvents = index
```

</details>

**依据 5 · 源码核查**：[src/index.ts:338-357](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/src/index.ts#L338-L357)

零样本省略及projectedTokens。

<details>
<summary>查看原文（20行）</summary>

```text
  const toUsageData = (state: UsageFoldState): UsageData | undefined => {
    const { totals } = state
    if (totals.uncachedInputTokens === 0 && totals.outputTokens === 0
      && totals.cacheReadTokens === 0 && totals.cacheWriteTokens === 0) {
      return undefined
    }
    const projectedTokens = state.pressureTokens !== undefined && state.sampledSurfaceTokens !== undefined
      ? Math.max(0, state.pressureTokens + state.surfaceTokens - state.sampledSurfaceTokens)
      : undefined
    return {
      inputTokens: totals.uncachedInputTokens,
      outputTokens: totals.outputTokens,
      cacheReadTokens: totals.cacheReadTokens,
      cacheWriteTokens: totals.cacheWriteTokens,
      contextTokens: totals.uncachedInputTokens + totals.cacheReadTokens + totals.cacheWriteTokens,
      toolOutputTokens: state.toolOutputTokens,
      ...(state.contextWindow !== undefined ? { contextWindow: state.contextWindow } : {}),
      ...(state.pressureTokens !== undefined ? { pressureTokens: state.pressureTokens } : {}),
      ...(projectedTokens !== undefined ? { projectedTokens } : {}),
    }
```

</details>

**依据 6 · 源码核查**：[src/index.ts:419-460](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/src/index.ts#L419-L460)

活跃增量、冷日志一次缓存和8路并发。

<details>
<summary>查看原文（42行）</summary>

```text
  const childUsage = async (childId: string): Promise<UsageData | undefined> => {
    const live = ctx.sessions.get(childId as SessionId)
    if (live !== undefined) {
      let state = usageCache.get(childId)
      if (state === undefined) {
        state = { consumedEvents: 0, totals: zeroBuckets(), toolOutputTokens: 0, last: null, surfaceTokens: 0, claim: undefined }
        usageCache.set(childId, state)
      }
      foldUsage(state, live.events)
      return toUsageData(state)
    }
    const cached = usageCache.get(childId)
    if (cached !== undefined) return toUsageData(cached)
    const persistence = (ctx as unknown as { get(name: string): unknown }).get('sessionPersistence') as
      SessionPersistenceLike | undefined
    if (persistence === undefined) return undefined
    try {
      const inspected = await persistence.inspect(childId as SessionId)
      const state: UsageFoldState = { consumedEvents: 0, totals: zeroBuckets(), toolOutputTokens: 0, last: null, surfaceTokens: 0, claim: undefined }
      foldUsage(state, inspected.events)
      usageCache.set(childId, state)
      return toUsageData(state)
    } catch {
      return undefined
    }
  }

  /** Attach usage to every row with a bounded concurrency (first load). */
  const applyUsage = async (rows: PanelRow[]): Promise<void> => {
    const limit = 8
    let index = 0
    const worker = async (): Promise<void> => {
      while (index < rows.length) {
        const i = index
        index += 1
        const row = rows[i]
        if (row === undefined) continue
        const usage = await childUsage(row.id)
        if (usage !== undefined) row.usage = usage
      }
    }
    await Promise.all(Array.from({ length: Math.min(limit, rows.length) }, worker))
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 切会话、断网、后台标签与导航/清空会怎样？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

面板打开且标签页可见才每秒轮询，关闭/隐藏停止定时器，恢复时先请求一次；切到不同session会触发即时刷新，响应sessionId和当前state不符就丢弃，避免旧会话请求覆盖新会话。请求失败catch不更新错误状态也不清空行，保留最后一次内容。切会话时先只更换sessionId、保留原rows；若新会话请求失败，旧卡片可能暂留在新会话视图。即使同一session，重叠请求也没有请求序号/时戳拒旧判断，慢的旧响应有机会覆盖较新快照。

打开子会话需要sessions服务、当前session和目录mode，构造含直接父ID的SubagentAddress交给宿主；缺少mode的纯事件行不能保证可点开。清空已完成只往前端hidden数组加子ID，不取消运行、删除持久日志或回滚工具副作用；隐藏按child ID而非run，也应在继续任务时核对是否仍可见。以上都是显示和导航边界，没有证据证明业务任务已完成。遇到快照不刷新、切会话旧卡片或用量异常，应回原会话检查，而非按看板决定放行。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/panel.tsx:103-111](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/src/client/panel.tsx#L103-L111)

只检查sessionId，失败不更新状态。

```text
async function refresh(sessionId: string): Promise<void> {
  try {
    const res = await fetch(`/api/subagent-monitor/snapshot?sessionId=${encodeURIComponent(sessionId)}`)
    const data = await res.json() as SnapshotPayload
    if (data.sessionId !== state.sessionId) return
    commit({ rows: data.rows ?? [], main: data.main, now: data.now ?? Date.now() })
  } catch {
    // Transient network failure: the next tick retries.
  }
```

**依据 2 · 源码核查**：[src/client/panel.tsx:594-607](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/src/client/panel.tsx#L594-L607)

切会话只改sessionId后刷新。

<details>
<summary>查看原文（14行）</summary>

```text
export function Trigger(props: TriggerProps): ReactElement {
  const monitor = useMonitor()
  const current = props.useSessions(select => select.current)

  useEffect(() => {
    if (current === undefined) {
      if (state.sessionId !== undefined) commit({ sessionId: undefined, rows: [] })
      return
    }
    if (current !== state.sessionId) {
      commit({ sessionId: current })
      void refresh(current)
    }
  }, [current])
```

</details>

**依据 3 · 源码核查**：[src/client/panel.tsx:609-643](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/src/client/panel.tsx#L609-L643)

可见性与开关控制轮询。

<details>
<summary>查看原文（35行）</summary>

```text
  // The timer only runs while the panel is actually being looked at: a closed
  // panel or a hidden tab stops it outright, instead of spending 1 req/s on a
  // snapshot nobody is rendering. Every (re)start polls once up front, so
  // reopening the panel / refocusing the tab shows fresh rows immediately
  // rather than the previous snapshot until the first tick lands.
  useEffect(() => {
    if (!monitor.open) return
    if (polling) return
    polling = true
    let timer: number | undefined
    const tick = (): void => {
      const sid = state.sessionId
      if (sid !== undefined) void refresh(sid)
    }
    const start = (): void => {
      if (timer !== undefined) return
      tick()
      timer = window.setInterval(tick, 1000)
    }
    const stop = (): void => {
      if (timer !== undefined) window.clearInterval(timer)
      timer = undefined
    }
    const onVisibility = (): void => {
      if (document.hidden) stop()
      else start()
    }
    if (!document.hidden) start()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
      polling = false
    }
  }, [monitor.open])
```

</details>

**依据 4 · 源码核查**：[src/client/panel.tsx:838-849](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/src/client/panel.tsx#L838-L849)

导航地址的前提和父ID。

<details>
<summary>查看原文（12行）</summary>

```text
  const openChild = (row: MonitorRow): void => {
    if (sessionsSvc === undefined || monitor.sessionId === undefined || row.mode === undefined) return
    // The direct parent is the authority the address needs. Every row is a
    // direct child of the viewed session, but reading parentId keeps that an
    // explicit fact rather than an assumption a future tree view would break.
    const address: SubagentAddress = {
      parentSessionId: (row.parentId ?? monitor.sessionId) as SessionId,
      childSessionId: row.id as SessionId,
      mode: row.mode as 'one-shot' | 'continuable',
    }
    sessionsSvc.openSubagent(address)
  }
```

</details>

**依据 5 · 源码核查**：[src/client/panel.tsx:1070-1076](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/src/client/panel.tsx#L1070-L1076)

清空只是hidden数组。

```text
  const clearFinished = (): void => {
    const hidden = [...state.hidden]
    for (const row of state.rows) {
      if (row.status !== 'running' && !hidden.includes(row.id)) hidden.push(row.id)
    }
    commit({ hidden })
  }
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 必需/可选服务与首次、持续、恢复、退出成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

宿主侧sessions/subagents/webServer和客户端slots/sessions是必需接线；locale是可选嵌套注入，失败回默认中文，不阻塞面板；sessionPersistence也是可选，缺失只影响冷会话用量。根包清单分别导出host与client，tsdown将src/index.ts构建为ESM、client入口构建为带ModuleLoader注册的浏览器闭包，固定Git树已有lib/index.js和lib/client.js。Git安装仍有prepare build流程，不能将仓内预构建文件存在等同于所有依赖组合运行通过。

首次成本是固定包版本、profile挂载、重启及确认面板/路由/直接子项显示，作者历史兼容说明不能替代本版本本环境验收。持续成本包括可见时每秒快照、日志扫描/冷读与缓存、浏览器图表以及用户对未知/估计值的核查。没有独立模型调用，但被监控任务照常花模型资源；provider token与字符估计不能混算为现金。异常恢复由用户检查加载、路由、日志服务和新鲜度，退出可移除包重启，位置/高度等浏览器本地设置与原会话日志不因此删除。实际资源、人工时间和单位正确识别异常的成本未测。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:22-46](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/package.json#L22-L46)

双端导出和bundle/client声明。

<details>
<summary>查看原文（25行）</summary>

```text
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./src/*": "./src/*",
    "./package.json": "./package.json"
  },
  "dsh": {
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime"
      ],
      "platform": "web"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "compatibility": {
      "dsh": ">=0.1.0-rc.0",
      "dshReleases": {
        "0.1.5-alpha.2": "compatible",
        "0.1.5-rc.1": "compatible",
```

</details>

**依据 2 · 源码核查**：[tsdown.config.ts:28-42](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/tsdown.config.ts#L28-L42)

host/client构建输出映射。

<details>
<summary>查看原文（15行）</summary>

```text
  outDir: 'lib',
  format: ['esm'],
  platform: 'node',
  target: 'es2024',
  clean: false,
  dts: false,
  fixedExtension: false,
}

const clientHalf: UserConfig = {
  name: `${ID}/client`,
  entry: { client: 'src/client/index.ts' },
  outDir: 'lib',
  format: ['cjs'],
  platform: 'browser',
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:21-49](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/src/client/index.ts#L21-L49)

locale可选和失败回中文。

<details>
<summary>查看原文（29行）</summary>

```text
export function apply(ctx: ClientContext): void {
  // The host-side dsh-session augmentation shadows the client sessions
  // contract inside this dual-face package's program, so resolve the runtime
  // service loosely and keep only the two methods the panel calls.
  setSessionsService(ctx.get('sessions') as unknown as MonitorSessionsService | undefined)

  // Follow the host UI language. 'locale' stays OUT of `inject` on purpose:
  // a cordis inject is a hard requirement, and a composition without the
  // locale plugin must still get the panel — it keeps the Chinese copy that
  // has always shipped (see ./locales.ts). The nested inject fiber activates
  // only while the service is there, and its unload restores the default.
  ctx.inject(['locale'], (localeCtx: ClientContext) => {
    localeCtx.effect(() => {
      const locale = localeCtx.get('locale') as unknown as MonitorLocaleService | undefined
      if (locale === undefined) return () => {}
      const adopt = (): void => { setLocale(locale.getLocale().active) }
      try {
        adopt()
        const unsubscribe = locale.subscribe(adopt)
        return () => {
          unsubscribe()
          setLocale(undefined)
        }
      } catch {
        // A locale service that does not answer these two reads leaves the
        // panel on its default copy rather than taking the plugin down.
        setLocale(undefined)
        return () => {}
      }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:419-443](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/src/index.ts#L419-L443)

冷日志可选依赖及缺失处理。

<details>
<summary>查看原文（25行）</summary>

```text
  const childUsage = async (childId: string): Promise<UsageData | undefined> => {
    const live = ctx.sessions.get(childId as SessionId)
    if (live !== undefined) {
      let state = usageCache.get(childId)
      if (state === undefined) {
        state = { consumedEvents: 0, totals: zeroBuckets(), toolOutputTokens: 0, last: null, surfaceTokens: 0, claim: undefined }
        usageCache.set(childId, state)
      }
      foldUsage(state, live.events)
      return toUsageData(state)
    }
    const cached = usageCache.get(childId)
    if (cached !== undefined) return toUsageData(cached)
    const persistence = (ctx as unknown as { get(name: string): unknown }).get('sessionPersistence') as
      SessionPersistenceLike | undefined
    if (persistence === undefined) return undefined
    try {
      const inspected = await persistence.inspect(childId as SessionId)
      const state: UsageFoldState = { consumedEvents: 0, totals: zeroBuckets(), toolOutputTokens: 0, last: null, surfaceTokens: 0, claim: undefined }
      foldUsage(state, inspected.events)
      usageCache.set(childId, state)
      return toUsageData(state)
    } catch {
      return undefined
    }
```

</details>

**依据 5 · 源码核查**：[src/client/panel.tsx:609-643](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/src/client/panel.tsx#L609-L643)

可见时每秒轮询成本。

<details>
<summary>查看原文（35行）</summary>

```text
  // The timer only runs while the panel is actually being looked at: a closed
  // panel or a hidden tab stops it outright, instead of spending 1 req/s on a
  // snapshot nobody is rendering. Every (re)start polls once up front, so
  // reopening the panel / refocusing the tab shows fresh rows immediately
  // rather than the previous snapshot until the first tick lands.
  useEffect(() => {
    if (!monitor.open) return
    if (polling) return
    polling = true
    let timer: number | undefined
    const tick = (): void => {
      const sid = state.sessionId
      if (sid !== undefined) void refresh(sid)
    }
    const start = (): void => {
      if (timer !== undefined) return
      tick()
      timer = window.setInterval(tick, 1000)
    }
    const stop = (): void => {
      if (timer !== undefined) window.clearInterval(timer)
      timer = undefined
    }
    const onVisibility = (): void => {
      if (document.hidden) stop()
      else start()
    }
    if (!document.hidden) start()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
      polling = false
    }
  }, [monitor.open])
```

</details>

**依据 6 · 作者声明**：[README.md:134-144](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/README.md#L134-L144)

兼容结果为作者历史说明，不是本轮验证。

<details>
<summary>查看原文（11行）</summary>

```text
## 🧩 兼容性

DSH STORE 的自动复查只认 `package.json` 中**完整 SemVer 的逐版本记录**，宽泛范围不算可安装证据。本插件声明：

| 项 | 声明 |
| --- | --- |
| DSH 版本范围 | `>=0.1.0-rc.0` |
| Node.js | `^22.19.0` 或 `>=24.0.0`（与 DSH 自身一致） |
| `0.1.5-alpha.2` · `0.1.5-rc.1` · `0.1.5-rc.2` | `compatible` |

上表的 `compatible` 不是推断，是 2026-09-14 在**一次性 Profile** 上逐版本实测的结果：每个版本建独立 `DSH_HOME` → `dsh plugin --profile web add`（bundle 层成功合成）→ `dsh web` 启动后浏览器内面板正常渲染、`GET /api/subagent-monitor/snapshot` 返回 `200` → `dsh plugin --profile web remove` 后该路由回到 `404`、bundle 层归零。未列出的 DSH 版本即 `unknown`。
```

</details>

#### 缺口

- 没有并发规模、日志长度与用量准确率/资源测量。
  **影响**：不能量化性能收益或长期监控成本。
  **进一步探讨**：用固定事件日志比较provider原始桶和显示值，并记录首载/轮询CPU、内存、请求与人工核查投入。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 谁适合试，如何验证增加可见性没有增加错误决策？

**研究主题**：新假设与验证、采用判断

#### 完整回答

适合已有DSH Web多子Agent工作流、愿意把面板当查看入口而非任务验收器的开发者，在隔离profile做受控试用。先用两个直接子任务及一个孙任务核对层级，打开具体对话确认状态，再加入一项失败/取消和宿主重启回填。只在能识别unknown和估计用量时继续，不应把历史未知当成功、累计会话token当单run账单。

可推导的待验证改进是让快照带采样新鲜度与请求序号，切会话立即清行并按run与session分别显示，避免旧快照/旧run误导。以同child多次继续、交错响应、断网切会话与冷日志回填作为固定反例，比对当前实现和带新鲜度版本的错误归属、漏看与人工查证次数。若错误未减少或新标签令用户更难判断，则收窄为只读会话导航，不宣称精确监控。该改进未实现，也不能把假设作为当前采用高分依据。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:483-511](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/src/index.ts#L483-L511)

同child事件的选择是run区分假设来源。

<details>
<summary>查看原文（29行）</summary>

```text
    for (let index = 0; index < desc.length; index++) {
      const entry = desc[index]
      if (entry === undefined) continue
      const id = str(entry.id)
      seen.add(id)
      // Every catalog entry here is a direct child of the queried session by
      // construction, so the parent is the query itself (listChildren entries
      // carry no parentId of their own).
      const base = {
        id,
        ...(entry.kind === 'child' && entry.label !== undefined ? { label: entry.label } : {}),
        ...(entry.kind === 'child' ? { mode: entry.mode } : {}),
        parentId: sessionId,
      }
      const ev = eventRows.find(row => row.id === id)
      if (ev !== undefined) {
        merged.push({ ...base, ...ev })
      } else {
        merged.push({
          ...base,
          local: true,
          sortKey: -(desc.length - index),
          status: entry.kind === 'child' && entry.activity === 'running' ? 'running' : 'unknown',
        })
      }
    }
    for (const ev of eventRows) {
      if (!seen.has(ev.id)) merged.push({ ...ev })
    }
```

</details>

**依据 2 · 源码核查**：[src/client/panel.tsx:103-111](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/src/client/panel.tsx#L103-L111)

缺少响应新鲜度处理的具体分支。

```text
async function refresh(sessionId: string): Promise<void> {
  try {
    const res = await fetch(`/api/subagent-monitor/snapshot?sessionId=${encodeURIComponent(sessionId)}`)
    const data = await res.json() as SnapshotPayload
    if (data.sessionId !== state.sessionId) return
    commit({ rows: data.rows ?? [], main: data.main, now: data.now ?? Date.now() })
  } catch {
    // Transient network failure: the next tick retries.
  }
```

**依据 3 · 源码核查**：[src/client/panel.tsx:594-607](https://github.com/Mombrane/dsh-subagent-monitor/blob/f8beee47f4dea63096070c141a97f889181a590a/src/client/panel.tsx#L594-L607)

切会话保留行是可执行反例。

<details>
<summary>查看原文（14行）</summary>

```text
export function Trigger(props: TriggerProps): ReactElement {
  const monitor = useMonitor()
  const current = props.useSessions(select => select.current)

  useEffect(() => {
    if (current === undefined) {
      if (state.sessionId !== undefined) commit({ sessionId: undefined, rows: [] })
      return
    }
    if (current !== state.sessionId) {
      commit({ sessionId: current })
      void refresh(current)
    }
  }, [current])
```

</details>

#### 缺口

- 面板在真实多子任务中是否减少漏看/误判未知。
  **影响**：源码支持有条件试用，不支持效率排名或持续安装推荐。
  **进一步探讨**：同模型任务对照原界面，记录异常识别准确率、错误放行与总人工查证时间。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
