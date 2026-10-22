# dsh-folderwatch

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[c11125d](https://github.com/11111353535/dsh-folderwatch/tree/c11125d12738945d291b6067fb5fa03ea48c1c08)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：监控目录元数据快照变化，经批处理与路径回声过滤后唤醒或排队通知DSH Agent，提供挂载、检查、触发和移除工具。

> **核心亮点**：以快照差分为主、fs.watch提示为辅，结合quiet/上限/冷却与Agent消息入口减少主动查目录。详见[Q02](#research-q02)。

> **风险与缺陷**：stat递归会跟随目录链接，partial/不可读仍作差分；共享echo不区分成功写或会话，目标失效可fallback别Agent；批次先drain且送达Promise未await。详见[Q03](#research-q03)至[Q05](#research-q05)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 适合什么外部变化任务，交付目标是什么？](#detail-section-11)
  - [Q02 · 快照、批处理和通知如何连接？](#detail-section-12)
  - [Q03 · 范围和扫描完整性有哪些缺口？](#detail-section-13)
  - [Q04 · 自身写入抑制和接收人是否真按会话隔离？](#detail-section-14)
  - [Q05 · 启动步骤与首次、持续、恢复成本是什么？](#detail-section-15)
  - [Q06 · 推荐与继续探讨入口是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向开发会话等待构建报告、下载或共享目录交接的用户。插件提供五个folderwatch工具与/watch命令，按目录元数据变化生成消息，可wake新回合或queue到后续步骤。它不直接理解报告内容，不保证构建/测试业务成功，也不是文件内容备份或可靠事件日志。

合格交付应是许可范围内变化送给正确Agent、抑制自身写入不漏真正外部变化，明确扫描/消息截断，失败仍可恢复。基线是手动list/stat或定时任务反复查目录，增量是文件变化驱动与批量通知/回声抑制。README的Windows四场景/110单测是作者报告，本轮仅检查实现和测试设计。

人工list/stat或定时查目录；文件驱动减少主动检查，通知质量和总模型成本需对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| add/list/remove | 管理目录watch | profile共享，需owner约束 |
| check/fire | 主动扫描/发待处理批 | fire计数不等于受理 |
| 快照差分 | 分类元数据变化 | 短命/同size与mtime可漏 |
| echo | 短窗降回声 | 不证明成功写或自身会话 |
| wake/queue | Agent消息入口 | fallback/异步确认需核 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node ^22.19或>=24与DSH tools/commands | 注册工具/命令 | 依宿主解析tools/llm/schemastery，无peer锁定 |
| 可读目录和watch/poll权限 | 只读取名/元数据 | 绝对目录不限workspace，链接需额外核 |
| 明确存活Agent/目标会话 | followup或inject | sessionId失败会fallback最后Agent |
| 窄pattern/ignore与小规模 | 控扫描/消息 | pattern只过滤事件，不避免全树快照 |



#### 启动步骤

| 步骤 | 动作 | 成功判据 |
| --- | --- | --- |
| 配置 | 可信单profile，小目录先queue | 核收件Agent/物理root/权限 |
| 挂载 | folderwatch_add指定path/pattern | arm回执核partial/unreadable |
| 看变化 | check或等待批量 | 知check推进快照而不发新消息 |
| 提醒 | 必要时fire | 不把返回delivered当受理确认 |
| 收尾 | remove/卸载 | 核正在运行扫描/送达边界 |

**效果与成本**

| 阶段 | 现金与资源 | 人工与时间 | 已知与未知 |
| --- | --- | --- | --- |
| 首次 | 复用宿主与文件系统，无独立服务 | 配目录/目标、过滤与回声 | 配置工时未知，宿主使用费用依环境 |
| 持续使用 | 默认每watch默认1.5秒扫描、快照最多收录2万条，最多16watch；跟进产生模型用量 | queue/wake与噪声维护 | 已知规模默认值，不知总token/金额，不内置总预算 |
| 失败恢复 | 重扫/重建内存批，模型重复处理可能消耗 | 查partial/lastError/目标、补丢失变化 | 无持久事件历史，未知完整恢复时间 |



#### 效果

| 目标 | 实现增量 | 限制 |
| --- | --- | --- |
| 少手动查询 | 事件提示+轮询批通知 | 非瞬时/完整事件日志 |
| 降重复唤醒 | echo/quiet/cooldown | 误抑制/共享来源待修 |
| 稳定交付 | 降poll与错误status | drain先于确认，无durable ack |

最关键的恢复缺口是deliver先drain，再await onBatch，异常只记录不回队；index deliver调用followup/inject没有await返回Promise，异步拒绝未必在当前try捕获。工具fire随后返回ok/delivered原pending，不能据此当宿主受理甚至任务完成。once只在onBatch返回后stop，但“返回”也未必等异步投递成功。

> **思考**：stat递归会跟随目录链接，partial/不可读仍作差分；共享echo不区分成功写或会话，目标失效可fallback别Agent；批次先drain且送达Promise未await。详见[Q03](#research-q03)至[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：以快照差分为主、fs.watch提示为辅，结合quiet/上限/冷却与Agent消息入口减少主动查目录。详见[Q02](#research-q02)。

以快照差分为主、fs.watch提示为辅，结合quiet/上限/冷却与Agent消息入口减少主动查目录。详见[Q02](#research-q02)。

snapshot注释声称不跟随symlink，实际statEntry调用stat而非lstat，然后只按info.kind=directory递归，未检查dirent.isSymbolicLink或物理路径。链接到根外目录时可能继续采集外部文件名/元数据；深度12限制防无限走，但不等于不跟随链接。这里只检查元数据，不称读取了外部文件内容或已复现越界。

maxEntries置truncated可报告，但深度达到maxDepth停止未置truncated。readdir失败记录unreadable后返回空子树，stat失败直接略过；tick仍将partial作为新快照并对旧完整快照差分，可能把不可读/容量边界移动误当删除或新增。status保截断/不可读，通知正文只带batch.truncated，不绑定本轮扫描质量，因此不能把收到的删除清单当完整可靠事实。

路径支持绝对路径和workspace相对路径，未限定必须在工作区。它是有意可选目录能力，不能叫工作区围栏。check没有tick的busy互斥，可与tick同时扫描/推进snapshot；stop不等待正在scan/deliver，已有tick可在stop后继续stage/通知，需时序检查。

不是严格按会话。registry只有一个echo ledger和lastAgent；tools/result任何带file_path/path等参数的工具都记账，未限定write/edit或检查工具成功，连读文件工具也可被认为certain。shell参数提取标certain=false，但isEcho并不读certain标记，仍抑制；来源不是因果证明，短窗内真正外部写同路径也可能被吞。

observer把相对路径用undefined workspace解析到进程cwd，可能与watch按调用会话workspace解析不同；共享ledger也让A会话记录影响B会话watch。纯echo注释称“this session”不能当隔离证明。

接收人优先boundAgent，仅看session.id存在不确认活跃/一致；显式sessionId查失败后fallback lastAgent，可将原定接收失败降级到另会话。工具list/check/fire/remove共享整个registry且不检查调用者所有权。可信个人单profile与多用户/多项目共享场景应分开，不能据源码直接断言真实已跨租户暴露。文件名/label/prompt进入user message，模型后续行动仍须当外部变化数据而非任意命令授权。

<a id="detail-section-5"></a>

### 1.4 主要限制

stat递归会跟随目录链接，partial/不可读仍作差分；共享echo不区分成功写或会话，目标失效可fallback别Agent；批次先drain且送达Promise未await。详见[Q03](#research-q03)至[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，先可信单profile窄目录queue核扫描/接收/恢复，不作为可靠生产触发或多用户隔离。详见[Q06](#research-q06)。

合格交付应是许可范围内变化送给正确Agent、抑制自身写入不漏真正外部变化，明确扫描/消息截断，失败仍可恢复。基线是手动list/stat或定时任务反复查目录，增量是文件变化驱动与批量通知/回声抑制。README的Windows四场景/110单测是作者报告，本轮仅检查实现和测试设计。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。采样/批处理链明确，但物理范围、partial差分、会话回声/接收人和送达确认缺口需收紧。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/watch.js、lib/snapshot.js、lib/diff.js、lib/batch.js、lib/echo.js、lib/match.js、lib/format.js、test/plugin.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：八lib关键扫描/差分/批/echo/注册与格式路径，test seam仅作为作者验证设计；不运行watch/目标测试或发送Agent消息。
- 下一步：可继续用临时目录/mock覆盖链接/partial/读写来源/A-B身份/异步拒绝与stop时序，核误报漏报与恢复。

**分析版本**

- **仓库**：[11111353535/dsh-folderwatch](https://github.com/11111353535/dsh-folderwatch)
- **版本号**：0.1.0（[固定提交 c11125d](https://github.com/11111353535/dsh-folderwatch/tree/c11125d12738945d291b6067fb5fa03ea48c1c08)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索扫描质量/物理root与owner绑定、成功写echo和批次受理ack，比较误报/漏报/错收件和恢复成本；未实现。详见[Q06](#research-q06)。

可继续用临时目录/mock覆盖链接/partial/读写来源/A-B身份/异步拒绝与stop时序，核误报漏报与恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 8 | 2246 | 1048 | 1073 | — |
| .md | source | 2 | 414 | — | — | 3707 |
| .mjs | source | 1 | 155 | 88 | 51 | — |
| .mjs | test | 4 | 1228 | 488 | 689 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/11111353535/dsh-folderwatch/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/11111353535/dsh-folderwatch/issues?q=is%3Aissue+created%3A2026-09-22T07%3A45%3A50.365Z..2026-10-22T07%3A45%3A50.365Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/11111353535/dsh-folderwatch/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A45%3A50.365Z..2026-10-22T07%3A45%3A50.365Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核文件变化采样/物理范围、回声因果与会话身份、批次送达/失败恢复、资源成本及推荐边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 适合什么外部变化任务，交付目标是什么？

**研究主题**：场景与需求

#### 完整回答

面向开发会话等待构建报告、下载或共享目录交接的用户。插件提供五个folderwatch工具与/watch命令，按目录元数据变化生成消息，可wake新回合或queue到后续步骤。它不直接理解报告内容，不保证构建/测试业务成功，也不是文件内容备份或可靠事件日志。

合格交付应是许可范围内变化送给正确Agent、抑制自身写入不漏真正外部变化，明确扫描/消息截断，失败仍可恢复。基线是手动list/stat或定时任务反复查目录，增量是文件变化驱动与批量通知/回声抑制。README的Windows四场景/110单测是作者报告，本轮仅检查实现和测试设计。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-9](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/README.md#L3-L9)

文件变化驱动定位。

````text
**Wake the agent when the filesystem changes — not when you remember to look.**

An agent can already be woken on a clock (scheduled tasks) and on an HTTP request (webhooks). Neither covers the case that actually matters mid-session: something *outside* the conversation touches a file. A build finishes. A formatter rewrites the tree. A test runner drops a report. A download lands. A colleague pushes into a shared folder. Today the agent finds out only if it happens to look.

`dsh-folderwatch` arms a directory against the agent that armed it. When the tree changes, the agent receives an exact account of what changed — and can either be woken to act on it or simply find it waiting at its next step.

```
````

**依据 2 · 源码核查**：[lib/index.js:423-445](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/index.js#L423-L445)

目录/模式/session工具参数。

<details>
<summary>查看原文（23行）</summary>

```text
  ctx.tools.register(
    defineTool({
      name: 'folderwatch_add',
      description:
        'Watch a directory and wake this agent when its contents change. Use it when work depends on something outside the conversation that you cannot poll: a build output directory, a test report location, a shared hand-off folder, a download target. Changes are batched after the tree goes quiet, and this session\'s own writes are filtered out so the watch never reports the agent back to itself. Delivery defaults to waking the agent with a new turn; pass mode: "queue" to have the report wait until the agent\'s next step instead.',
      parameters: {
        path: { type: 'string', required: true, description: 'Directory to watch. Absolute, or relative to the workspace.' },
        label: { type: 'string', description: 'Short name for this watch, shown in listings and notifications.' },
        prompt: { type: 'string', description: 'Instruction appended to each notification, e.g. "re-run the failing test".' },
        pattern: { type: 'string', description: 'Glob selecting which paths are reported, e.g. "**/*.log" or "src/**".' },
        ignore: {
          type: 'array',
          description: 'Extra ignore patterns for this watch. A bare name like "tmp" matches that name at any depth.',
          items: { type: 'string' },
        },
        recursive: { type: 'boolean', description: 'Descend into subdirectories. Defaults to true.' },
        once: { type: 'boolean', description: 'Disarm after the first delivery. Defaults to false.' },
        mode: {
          type: 'string',
          description: 'Delivery mode: "wake" (default) starts a turn; "queue" waits for the next step.',
          enum: ['wake', 'queue'],
        },
        sessionId: { type: 'string', description: 'Session to notify, when it is not the calling one.' },
```

</details>

**依据 3 · 源码核查**：[lib/index.js:571-606](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/index.js#L571-L606)

slash入口。

<details>
<summary>查看原文（36行）</summary>

```text
  ctx.commands.register({
    name: 'watch',
    description: 'Arm a directory watch, list the armed ones, or check and disarm them.',
    input: { hint: '[add <path> [--pattern GLOB] [--queue] [--once]] [rm <id>] [check <id>] [fire <id>]' },
    async handler(invocation) {
      const agent = invocation.agent
      registry.rememberAgent(agent)
      const raw = typeof invocation.rawInput === 'string' ? invocation.rawInput.trim() : ''
      const tokens = raw === '' ? [] : raw.split(/\s+/u)
      const subcommand = tokens[0] ?? 'list'
      const flags = new Set(tokens.filter((token) => token.startsWith('--')))
      const positional = tokens.slice(1).filter((token) => !token.startsWith('--'))
      const valueOf = (name) => {
        const index = tokens.indexOf(`--${name}`)
        return index === -1 ? undefined : tokens[index + 1]
      }

      try {
        if (subcommand === 'list') {
          return { kind: 'success', text: renderList(registry.statuses(), { now: Date.now() }) }
        }
        if (subcommand === 'add') {
          if (positional.length === 0) return { kind: 'error', text: 'usage: /watch add <path> [--pattern GLOB] [--queue] [--once]' }
          const workspace = workspaceRootFor(ctx, { agent })
          const outcome = await registry.arm(
            {
              path: positional.join(' '),
              workspace,
              pattern: valueOf('pattern'),
              label: valueOf('label'),
              prompt: valueOf('prompt'),
              mode: flags.has('--queue') ? 'queue' : 'wake',
              once: flags.has('--once'),
              sessionId: agent?.session?.id,
            },
            { agent, signal: invocation.signal },
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 快照、批处理和通知如何连接？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

每个watch初始递归快照，fs.watch仅提示120ms后提前tick；另每1.5秒轮询，busy跳过重叠tick。快照按相对路径记录kind/size/mtime，差分产生created/changed/deleted，再应用glob与echo，批处理按quiet/maxWait/cooldown发一条消息。watch句柄失败可降poll，timer unref及卸载清理是合理资源设计。

纯差分/批处理与宿主送达分离，有利测试。合并同路径按最后观察类别覆盖，重命名表现删除+新增，不能识别同一文件身份；相同size/mtime内容改变可能漏掉，两扫描间创建又删除也不可见。README“exact account/every platform”应收窄为采样元数据变化，不是完整文件事件审计。

贡献是把有界扫描、降级轮询、批处理和Agent跟进接在一起，减少人查目录。全部为成熟机制组合，不能从存在单测推导所有OS目录通知/宿主送达已验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/watch.js:161-174](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/watch.js#L161-L174)

初始快照。

<details>
<summary>查看原文（14行）</summary>

```text
  async start(signal) {
    if (this.state !== 'idle') return
    this.state = 'armed'
    const initial = await this.scan()
    this.snapshot = initial.entries
    this.truncatedSnapshot = initial.truncated
    this.unreadable = initial.unreadable
    if (signal?.aborted === true) {
      this.state = 'stopped'
      return
    }
    this.armFastPath()
    this.armTimer()
  }
```

</details>

**依据 2 · 源码核查**：[lib/watch.js:185-246](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/watch.js#L185-L246)

fs提示/poll/busy降级。

<details>
<summary>查看原文（62行）</summary>

```text
  armFastPath() {
    try {
      this.handle = this.watchFactory(this.root, { recursive: this.recursive, persistent: false }, () => {
        this.dirty = true
        if (this.hintTimer !== undefined) return
        this.hintTimer = setTimeout(() => {
          this.hintTimer = undefined
          void this.tick()
        }, HINT_DEBOUNCE_MS)
        this.hintTimer.unref?.()
      })
      this.handle.on?.('error', (error) => {
        this.lastError = error instanceof Error ? error.message : String(error)
        this.handle?.close?.()
        this.handle = undefined
        this.watchKind = 'poll'
      })
      this.watchKind = 'watch+poll'
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : String(error)
      this.handle = undefined
      this.watchKind = 'poll'
    }
  }

  /**
   * Start the periodic rescan.
   *
   * The timer is unref'd so a watch never keeps the harness process alive, and
   * overlapping ticks are skipped: a slow walk must not queue up behind itself.
   *
   * @returns {void}
   */
  armTimer() {
    this.timer = setInterval(() => {
      void this.tick()
    }, this.pollIntervalMs)
    this.timer.unref?.()
  }

  /**
   * One rescan cycle: snapshot, diff, feed the batcher, deliver when due.
   *
   * @returns {Promise<void>} resolves when the cycle finishes.
   */
  async tick() {
    if (this.state !== 'armed' || this.busy) return
    this.busy = true
    try {
      const next = await this.scan()
      const diff = diffSnapshots(this.snapshot, next.entries)
      this.snapshot = next.entries
      this.truncatedSnapshot = next.truncated
      this.unreadable = next.unreadable
      this.dirty = false
      if (!isEmptyDiff(diff)) this.stage(diff)
      if (this.batcher.due()) await this.deliver()
    } catch (error) {
      this.report(error)
    } finally {
      this.busy = false
    }
```

</details>

**依据 3 · 源码核查**：[lib/diff.js:49-84](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/diff.js#L49-L84)

size/mtime采样差分。

<details>
<summary>查看原文（36行）</summary>

```text
  const created = []
  const changed = []
  const deleted = []

  for (const [path, entry] of next) {
    const before = previous.get(path)
    if (before === undefined) {
      created.push({ path, kind: entry.kind, size: entry.size, mtimeMs: entry.mtimeMs })
      continue
    }
    if (entry.kind === 'directory' || before.kind === 'directory') continue
    if (before.size !== entry.size || before.mtimeMs !== entry.mtimeMs) {
      changed.push({
        path,
        kind: entry.kind,
        size: entry.size,
        mtimeMs: entry.mtimeMs,
        previous: { size: before.size, mtimeMs: before.mtimeMs },
      })
    }
  }

  for (const [path, entry] of previous) {
    if (next.has(path)) continue
    deleted.push({ path, kind: entry.kind, size: entry.size, mtimeMs: entry.mtimeMs })
  }

  created.sort(byPath)
  changed.sort(byPath)
  deleted.sort(byPath)
  return { created, changed, deleted }
}

/**
 * Whether a change set contains nothing at all.
 *
```

</details>

**依据 4 · 源码核查**：[lib/batch.js:71-104](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/batch.js#L71-L104)

路径最后状态与批上限。

<details>
<summary>查看原文（34行）</summary>

```text
    /** @type {Map<string, object>} */
    const byPath = new Map()
    for (const event of created) byPath.set(event.path, { action: 'created', event })
    for (const event of changed) byPath.set(event.path, { action: 'changed', event })
    for (const event of deleted) byPath.set(event.path, { action: 'deleted', event })
    for (const event of diff.created) byPath.set(event.path, { action: 'created', event })
    for (const event of diff.changed) byPath.set(event.path, { action: 'changed', event })
    for (const event of diff.deleted) byPath.set(event.path, { action: 'deleted', event })

    created = []
    changed = []
    deleted = []
    for (const row of byPath.values()) {
      if (row.action === 'created') created.push(row.event)
      else if (row.action === 'changed') changed.push(row.event)
      else deleted.push(row.event)
    }

    if (countEvents({ created, changed, deleted }) > maxEvents) {
      truncated = true
      created = created.slice(0, maxEvents)
      changed = changed.slice(0, maxEvents)
      deleted = deleted.slice(0, maxEvents)
    }
  }

  /**
   * Record that some events were dropped as echoes.
   *
   * @param {number} count - how many were dropped.
   * @returns {void}
   */
  function noteSuppressed(count) {
    if (Number.isFinite(count) && count > 0) suppressedCount += count
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 范围和扫描完整性有哪些缺口？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

snapshot注释声称不跟随symlink，实际statEntry调用stat而非lstat，然后只按info.kind=directory递归，未检查dirent.isSymbolicLink或物理路径。链接到根外目录时可能继续采集外部文件名/元数据；深度12限制防无限走，但不等于不跟随链接。这里只检查元数据，不称读取了外部文件内容或已复现越界。

maxEntries置truncated可报告，但深度达到maxDepth停止未置truncated。readdir失败记录unreadable后返回空子树，stat失败直接略过；tick仍将partial作为新快照并对旧完整快照差分，可能把不可读/容量边界移动误当删除或新增。status保截断/不可读，通知正文只带batch.truncated，不绑定本轮扫描质量，因此不能把收到的删除清单当完整可靠事实。

路径支持绝对路径和workspace相对路径，未限定必须在工作区。它是有意可选目录能力，不能叫工作区围栏。check没有tick的busy互斥，可与tick同时扫描/推进snapshot；stop不等待正在scan/deliver，已有tick可在stop后继续stage/通知，需时序检查。

#### 证据与依据

**依据 1 · 源码核查**：[lib/snapshot.js:32-43](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/snapshot.js#L32-L43)

stat跟随链接。

<details>
<summary>查看原文（12行）</summary>

```text
 * @returns {Promise<{ size: number, mtimeMs: number, kind: 'file' | 'directory' } | undefined>} metadata, or undefined.
 */
async function statEntry(absolute) {
  try {
    const info = await stat(absolute)
    if (info.isDirectory()) return { size: 0, mtimeMs: info.mtimeMs, kind: 'directory' }
    if (info.isFile()) return { size: info.size, mtimeMs: info.mtimeMs, kind: 'file' }
    /* Sockets, FIFOs, device nodes: present but not something to report. */
    return { size: 0, mtimeMs: info.mtimeMs, kind: 'file' }
  } catch {
    return undefined
  }
```

</details>

**依据 2 · 源码核查**：[lib/snapshot.js:75-113](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/snapshot.js#L75-L113)

忽略/上限/递归与不可读。

<details>
<summary>查看原文（39行）</summary>

```text
  async function walk(absolute, relative, depth) {
    if (truncated || signal?.aborted === true) return
    let dirents
    try {
      dirents = await readdir(absolute, { withFileTypes: true })
    } catch {
      unreadable.push(relative === '' ? '.' : relative)
      return
    }
    /* Deterministic order keeps snapshots comparable and reports stable. */
    dirents.sort((left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0))

    for (const dirent of dirents) {
      if (truncated || signal?.aborted === true) return
      const child = relative === '' ? dirent.name : `${relative}/${dirent.name}`
      if (isIgnored(child, ignore)) continue
      if (entries.size >= maxEntries) {
        truncated = true
        return
      }
      const childAbsolute = join(absolute, dirent.name)
      const info = await statEntry(childAbsolute)
      if (info === undefined) continue
      entries.set(child, info)
      if (info.kind === 'directory' && recursive && depth < maxDepth) {
        await walk(childAbsolute, child, depth + 1)
      }
    }
  }

  await walk(root, '', 0)
  return { entries, truncated, unreadable }
}

/**
 * Whether two snapshots describe the same tree state.
 *
 * @param {{ entries: Map<string, unknown> }} left - first snapshot.
 * @param {{ entries: Map<string, unknown> }} right - second snapshot.
```

</details>

**依据 3 · 源码核查**：[lib/watch.js:230-241](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/watch.js#L230-L241)

partial推进并差分。

<details>
<summary>查看原文（12行）</summary>

```text
  async tick() {
    if (this.state !== 'armed' || this.busy) return
    this.busy = true
    try {
      const next = await this.scan()
      const diff = diffSnapshots(this.snapshot, next.entries)
      this.snapshot = next.entries
      this.truncatedSnapshot = next.truncated
      this.unreadable = next.unreadable
      this.dirty = false
      if (!isEmptyDiff(diff)) this.stage(diff)
      if (this.batcher.due()) await this.deliver()
```

</details>

**依据 4 · 源码核查**：[lib/watch.js:277-285](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/watch.js#L277-L285)

手动check无busy互斥。

```text
  async check() {
    const next = await this.scan()
    const diff = diffSnapshots(this.snapshot, next.entries)
    const selected = applyWatchRules(diff, this)
    const { diff: filtered, suppressed } = this.suppressEchoes(selected)
    this.snapshot = next.entries
    this.truncatedSnapshot = next.truncated
    this.unreadable = next.unreadable
    return { diff: filtered, events: countEvents(filtered), suppressed }
```

**依据 5 · 源码核查**：[lib/watch.js:343-360](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/watch.js#L343-L360)

stop仅清timer/批。

<details>
<summary>查看原文（18行）</summary>

```text
  async stop() {
    if (this.state === 'stopped') return
    this.state = 'stopped'
    if (this.timer !== undefined) {
      clearInterval(this.timer)
      this.timer = undefined
    }
    if (this.hintTimer !== undefined) {
      clearTimeout(this.hintTimer)
      this.hintTimer = undefined
    }
    try {
      this.handle?.close?.()
    } catch {
      /* Already closed. */
    }
    this.handle = undefined
    this.batcher.reset()
```

</details>

**依据 6 · 源码核查**：[lib/match.js:225-230](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/match.js#L225-L230)

路径解析非范围限制。

```text
export function resolveWatchPath(value, root, resolve) {
  const raw = typeof value === 'string' ? value.trim() : ''
  if (raw === '') throw new Error('a watch needs a path')
  const isAbsolute = /^([a-zA-Z]:[\\/]|[\\/]{1,2})/u.test(raw)
  const base = isAbsolute || typeof root !== 'string' || root === '' ? undefined : root
  return normalizePath(base === undefined ? resolve(raw) : resolve(base, raw))
```

#### 缺口

- 链接/深度/不可读/容量波动及stop与scan并发的实际通知序列未受控复现。
  **影响**：不能给全量无误报或卸载后绝无通知保证。
  **进一步探讨**：用可丢弃目录与mock stat/readdir/延迟，核扫描质量和消息绑定，避免真实私密目录。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 自身写入抑制和接收人是否真按会话隔离？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不是严格按会话。registry只有一个echo ledger和lastAgent；tools/result任何带file_path/path等参数的工具都记账，未限定write/edit或检查工具成功，连读文件工具也可被认为certain。shell参数提取标certain=false，但isEcho并不读certain标记，仍抑制；来源不是因果证明，短窗内真正外部写同路径也可能被吞。

observer把相对路径用undefined workspace解析到进程cwd，可能与watch按调用会话workspace解析不同；共享ledger也让A会话记录影响B会话watch。纯echo注释称“this session”不能当隔离证明。

接收人优先boundAgent，仅看session.id存在不确认活跃/一致；显式sessionId查失败后fallback lastAgent，可将原定接收失败降级到另会话。工具list/check/fire/remove共享整个registry且不检查调用者所有权。可信个人单profile与多用户/多项目共享场景应分开，不能据源码直接断言真实已跨租户暴露。文件名/label/prompt进入user message，模型后续行动仍须当外部变化数据而非任意命令授权。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:205-223](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/index.js#L205-L223)

共享ledger与lastAgent。

<details>
<summary>查看原文（19行）</summary>

```text
function createRegistry(ctx, config) {
  /** @type {Map<string, FolderWatch>} */
  const watches = new Map()
  const echo = createEchoLedger({
    windowMs: config.echoWindowMs,
    caseInsensitive: caseInsensitive(),
  })
  let lastAgent

  /**
   * Remember the most recent agent seen, so a watch declared in configuration
   * (with no arming tool call) still has somewhere to deliver.
   *
   * @param {unknown} agent - candidate agent.
   * @returns {void}
   */
  function rememberAgent(agent) {
    if (agent !== undefined && agent !== null) lastAgent = agent
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:235-288](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/index.js#L235-L288)

接收人fallback/消息来源/方法。

<details>
<summary>查看原文（54行）</summary>

```text
  async function resolveAgent(watch) {
    if (watch.boundAgent !== undefined) {
      try {
        if (watch.boundAgent.session?.id !== undefined) return watch.boundAgent
      } catch {
        /* Disposed agents can throw on property access; fall through. */
      }
    }
    if (watch.sessionId !== undefined) {
      try {
        const controller = typeof ctx.get === 'function' ? ctx.get('sessionController') : undefined
        if (controller !== undefined && typeof controller.resolveAgent === 'function') {
          const found = await controller.resolveAgent(watch.sessionId)
          if (found?.agent !== undefined) return found.agent
        }
      } catch {
        /* Fall through to the session registry. */
      }
      try {
        const sessions = typeof ctx.get === 'function' ? ctx.get('sessions') : undefined
        const session = sessions?.get?.(watch.sessionId)
        if (session?.agent !== undefined) return session.agent
      } catch {
        /* Fall through to the last-seen agent. */
      }
    }
    return lastAgent
  }

  /**
   * Deliver one batch to the agent behind a watch.
   *
   * @param {{ diff: object, suppressed: number, truncated: boolean }} batch - the batch to deliver.
   * @param {FolderWatch} watch - the watch that fired.
   * @returns {Promise<void>} resolves after the message is handed over.
   */
  async function deliver(batch, watch) {
    const agent = await resolveAgent(watch)
    if (agent === undefined) {
      throw new Error('no live agent to notify; arm the watch from a session or set sessionId')
    }
    const text = renderNotification(
      { id: watch.id, root: watch.root, label: watch.label, prompt: watch.prompt },
      batch,
      { limit: config.maxEventsPerMessage, at: new Date().toISOString() },
    )
    const message = createUserMessage({
      content: [{ type: 'text', text }],
      source: { kind: 'folderwatch' },
    })
    if (watch.mode === 'queue' && typeof agent.inject === 'function') agent.inject(message)
    else if (typeof agent.followup === 'function') agent.followup(message)
    else if (typeof agent.inject === 'function') agent.inject(message)
    else throw new Error('the resolved agent exposes neither followup nor inject')
```

</details>

**依据 3 · 源码核查**：[lib/index.js:414-420](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/index.js#L414-L420)

任意工具参数记账/未用workspace。

```text
  ctx.on('tools/result', (exec) => {
    registry.rememberAgent(exec?.agent)
    if (typeof exec?.name !== 'string') return
    const { paths, certain } = pathsFromToolCall(exec.name, exec.arguments)
    if (paths.length === 0) return
    const absolute = paths.map((path) => resolveWatchPath(path, undefined, resolve))
    registry.echo.record(absolute, { certain })
```

**依据 4 · 源码核查**：[lib/echo.js:91-102](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/echo.js#L91-L102)

不分写读与certain。

<details>
<summary>查看原文（12行）</summary>

```text
export function pathsFromToolCall(toolName, args) {
  if (typeof toolName !== 'string' || args === null || typeof args !== 'object') {
    return { paths: [], certain: false }
  }
  for (const key of PATH_ARGUMENTS) {
    const value = args[key]
    if (typeof value === 'string' && value !== '') return { paths: [value], certain: true }
  }
  if (SHELL_TOOLS.has(toolName) && typeof args.command === 'string') {
    return { paths: pathsFromCommand(args.command), certain: false }
  }
  return { paths: [], certain: false }
```

</details>

**依据 5 · 源码核查**：[lib/echo.js:155-185](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/echo.js#L155-L185)

certain不参与抑制。

<details>
<summary>查看原文（31行）</summary>

```text
  function record(paths, flags = {}) {
    const at = now()
    prune(at)
    for (const path of Array.isArray(paths) ? paths : []) {
      if (typeof path !== 'string' || path === '') continue
      ledger.set(keyOf(path), { at, certain: flags.certain !== false })
    }
    /* Bound the map so a long session cannot grow it without limit. */
    while (ledger.size > limit) {
      const oldest = ledger.keys().next()
      if (oldest.done === true) break
      ledger.delete(oldest.value)
    }
    return ledger.size
  }

  /**
   * Whether a path was recently written by the agent.
   *
   * @param {string} path - path to test.
   * @returns {boolean} true when the change is an echo.
   */
  function isEcho(path) {
    const at = now()
    const entry = ledger.get(keyOf(path))
    if (entry === undefined) return false
    if (at - entry.at > windowMs) {
      ledger.delete(keyOf(path))
      return false
    }
    return true
```

</details>

**依据 6 · 源码核查**：[lib/index.js:475-501](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/index.js#L475-L501)

共享list/check。

<details>
<summary>查看原文（27行）</summary>

```text
      async execute() {
        return { watches: registry.statuses() }
      },
    }),
  )

  ctx.tools.register(
    defineTool({
      name: 'folderwatch_check',
      description:
        'Rescan a watched directory right now and report what changed since the last scan, without delivering a message. Use it to answer "has anything happened yet" during a turn, instead of waiting for the watch to wake you.',
      parameters: {
        id: { type: 'string', required: true, description: 'Watch id, as returned by folderwatch_add or folderwatch_list.' },
      },
      output: {
        schema: { type: 'json' },
        render: (_args, value) =>
          value.ok === true
            ? [{ type: 'text', text: renderCheck(value.watch, { diff: value.diff, events: value.events, suppressed: value.suppressed }) }]
            : [{ type: 'text', text: renderProblem(value.id, value.error) }],
      },
      timeoutMs: 60_000,
      async execute(args) {
        const watch = registry.get(args.id)
        if (watch === undefined) return { ok: false, id: args.id, error: 'no such watch' }
        const result = await watch.check()
        return { ok: true, watch: watch.status(), diff: result.diff, events: result.events, suppressed: result.suppressed }
```

</details>

#### 缺口

- 宿主多会话权限与接收人失效时实际路由未核。
  **影响**：不能宣称按调用者隔离或部署越权。
  **进一步探讨**：mock A/B agent与resolve失败，核目标不可fallback、工具owner检查和echo分桶。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动步骤与首次、持续、恢复成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node ^22.19或>=24与DSH tools/commands | 注册工具/命令 | 依宿主解析tools/llm/schemastery，无peer锁定 |
| 可读目录和watch/poll权限 | 只读取名/元数据 | 绝对目录不限workspace，链接需额外核 |
| 明确存活Agent/目标会话 | followup或inject | sessionId失败会fallback最后Agent |
| 窄pattern/ignore与小规模 | 控扫描/消息 | pattern只过滤事件，不避免全树快照 |

#### 启动步骤

| 步骤 | 动作 | 成功判据 |
| --- | --- | --- |
| 配置 | 可信单profile，小目录先queue | 核收件Agent/物理root/权限 |
| 挂载 | folderwatch_add指定path/pattern | arm回执核partial/unreadable |
| 看变化 | check或等待批量 | 知check推进快照而不发新消息 |
| 提醒 | 必要时fire | 不把返回delivered当受理确认 |
| 收尾 | remove/卸载 | 核正在运行扫描/送达边界 |

#### 成本

| 阶段 | 现金与资源 | 人工与时间 | 已知与未知 |
| --- | --- | --- | --- |
| 首次 | 复用宿主与文件系统，无独立服务 | 配目录/目标、过滤与回声 | 配置工时未知，宿主使用费用依环境 |
| 持续使用 | 默认每watch默认1.5秒扫描、快照最多收录2万条，最多16watch；跟进产生模型用量 | queue/wake与噪声维护 | 已知规模默认值，不知总token/金额，不内置总预算 |
| 失败恢复 | 重扫/重建内存批，模型重复处理可能消耗 | 查partial/lastError/目标、补丢失变化 | 无持久事件历史，未知完整恢复时间 |

#### 效果

| 目标 | 实现增量 | 限制 |
| --- | --- | --- |
| 少手动查询 | 事件提示+轮询批通知 | 非瞬时/完整事件日志 |
| 降重复唤醒 | echo/quiet/cooldown | 误抑制/共享来源待修 |
| 稳定交付 | 降poll与错误status | drain先于确认，无durable ack |

最关键的恢复缺口是deliver先drain，再await onBatch，异常只记录不回队；index deliver调用followup/inject没有await返回Promise，异步拒绝未必在当前try捕获。工具fire随后返回ok/delivered原pending，不能据此当宿主受理甚至任务完成。once只在onBatch返回后stop，但“返回”也未必等异步投递成功。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:57-60](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/package.json#L57-L60)

Node版本。

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "license": "MIT"
```

**依据 2 · 源码核查**：[lib/index.js:40-42](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/index.js#L40-L42)

宿主依赖导入。

```text
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import { defineTool } from '@deepseek-ai/dsh-tools'
import Schema from '@deepseek-ai/schemastery'
```

**依据 3 · 源码核查**：[lib/index.js:119-126](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/index.js#L119-L126)

扫描/唤醒默认规模。

```text
  quietMs: Schema.number().description('Quiet period before a batch is delivered.').default(400),
  maxWaitMs: Schema.number().description('Ceiling on how long changes may wait for quiet.').default(5000),
  cooldownMs: Schema.number().description('Minimum gap between deliveries for one watch.').default(5000),
  pollIntervalMs: Schema.number().description('How often the tree is rescanned.').default(1500),
  maxWatches: Schema.number().description('Maximum number of simultaneously armed watches.').default(16),
  maxEntries: Schema.number().description('Snapshot entry cap, guarding against a runaway tree.').default(20000),
  echoWindowMs: Schema.number().description('How long a path stays suppressed after this session writes it.').default(2500),
  maxEventsPerMessage: Schema.number().description('Events listed in one notification before truncation.').default(60),
```

**依据 4 · 源码核查**：[lib/watch.js:293-307](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/watch.js#L293-L307)

先drain失败不回队。

<details>
<summary>查看原文（15行）</summary>

```text
  async deliver() {
    const batch = this.batcher.drain()
    if (batch === undefined) return
    const events = countEvents(batch.diff)
    if (events === 0 && batch.suppressed === 0) return
    this.suppressedEvents += batch.suppressed
    try {
      await this.onBatch(batch, this)
      this.deliveries += 1
      this.deliveredEvents += events
      this.lastDeliveryAt = this.now()
      if (this.once) await this.stop()
    } catch (error) {
      this.report(error)
    }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:281-288](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/index.js#L281-L288)

异步调用未await。

```text
    const message = createUserMessage({
      content: [{ type: 'text', text }],
      source: { kind: 'folderwatch' },
    })
    if (watch.mode === 'queue' && typeof agent.inject === 'function') agent.inject(message)
    else if (typeof agent.followup === 'function') agent.followup(message)
    else if (typeof agent.inject === 'function') agent.inject(message)
    else throw new Error('the resolved agent exposes neither followup nor inject')
```

**依据 6 · 源码核查**：[lib/index.js:527-537](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/index.js#L527-L537)

fire的返回。

<details>
<summary>查看原文（11行）</summary>

```text
      async execute(args) {
        const watch = registry.get(args.id)
        if (watch === undefined) return { ok: false, id: args.id, error: 'no such watch' }
        const observed = await watch.check()
        if (observed.events > 0) watch.batcher.push(observed.diff)
        const pending = watch.batcher.pending()
        if (pending === 0) return { ok: true, id: args.id, delivered: 0, diff: { created: [], changed: [], deleted: [] } }
        const before = watch.deliveries
        await watch.deliver()
        return {
          ok: true,
```

</details>

#### 缺口

- followup/inject宿主实际同步/异步契约和失败恢复成本未确认。
  **影响**：无法把本地返回当可靠受理。
  **进一步探讨**：mock同步throw/异步reject/未知结果，分离受理/完成收据并避免无依据自动重发。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 推荐与继续探讨入口是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

观察。外部报告/构建完成后少轮询的场景明确，快照差分、批处理和quiet模式值得保留，但链接范围与partial差分、共享echo/接收人fallback、无确认先drain直接影响可信通知。先可信单profile窄目录queue研究，不能把它当生产可靠事件触发器或多用户隔离能力。

可探讨“有扫描质量和收件人身份的批次收据”。对扫描保存完整/截断/不可读/深度边界，只比较可确定区域；lstat与物理root拒绝链接越界，owner+session固定不fallback，echo只记录已知成功写并按owner桶分。batch先持有稳定ID，宿主受理明确后ack，未知结果留待核对而不是盲重发。

未实现。最小对照包括同size/mtime写、短命文件、链接环/根外、容量/权限突变、A读后B外部写、失效session、异步拒绝、stop中scan。核误报/漏报/错误收件、重复投递和资源/磁盘成本。反例是短命文件在两轮间消失，即使增加ack也不能补采样盲区；若新方案仍误投另一Agent、将不完整扫描当删除，或重试未知结果造成双投，核心假设被证伪。若收益不超过新增扫描/人工成本也不支持推广。不能为增强可靠性反而保存文件内容或秘密。

#### 证据与依据

**依据 1 · 源码核查**：[lib/snapshot.js:75-113](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/snapshot.js#L75-L113)

扫描质量/物理范围基线。

<details>
<summary>查看原文（39行）</summary>

```text
  async function walk(absolute, relative, depth) {
    if (truncated || signal?.aborted === true) return
    let dirents
    try {
      dirents = await readdir(absolute, { withFileTypes: true })
    } catch {
      unreadable.push(relative === '' ? '.' : relative)
      return
    }
    /* Deterministic order keeps snapshots comparable and reports stable. */
    dirents.sort((left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0))

    for (const dirent of dirents) {
      if (truncated || signal?.aborted === true) return
      const child = relative === '' ? dirent.name : `${relative}/${dirent.name}`
      if (isIgnored(child, ignore)) continue
      if (entries.size >= maxEntries) {
        truncated = true
        return
      }
      const childAbsolute = join(absolute, dirent.name)
      const info = await statEntry(childAbsolute)
      if (info === undefined) continue
      entries.set(child, info)
      if (info.kind === 'directory' && recursive && depth < maxDepth) {
        await walk(childAbsolute, child, depth + 1)
      }
    }
  }

  await walk(root, '', 0)
  return { entries, truncated, unreadable }
}

/**
 * Whether two snapshots describe the same tree state.
 *
 * @param {{ entries: Map<string, unknown> }} left - first snapshot.
 * @param {{ entries: Map<string, unknown> }} right - second snapshot.
```

</details>

**依据 2 · 源码核查**：[lib/index.js:235-288](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/index.js#L235-L288)

收件与受理基线。

<details>
<summary>查看原文（54行）</summary>

```text
  async function resolveAgent(watch) {
    if (watch.boundAgent !== undefined) {
      try {
        if (watch.boundAgent.session?.id !== undefined) return watch.boundAgent
      } catch {
        /* Disposed agents can throw on property access; fall through. */
      }
    }
    if (watch.sessionId !== undefined) {
      try {
        const controller = typeof ctx.get === 'function' ? ctx.get('sessionController') : undefined
        if (controller !== undefined && typeof controller.resolveAgent === 'function') {
          const found = await controller.resolveAgent(watch.sessionId)
          if (found?.agent !== undefined) return found.agent
        }
      } catch {
        /* Fall through to the session registry. */
      }
      try {
        const sessions = typeof ctx.get === 'function' ? ctx.get('sessions') : undefined
        const session = sessions?.get?.(watch.sessionId)
        if (session?.agent !== undefined) return session.agent
      } catch {
        /* Fall through to the last-seen agent. */
      }
    }
    return lastAgent
  }

  /**
   * Deliver one batch to the agent behind a watch.
   *
   * @param {{ diff: object, suppressed: number, truncated: boolean }} batch - the batch to deliver.
   * @param {FolderWatch} watch - the watch that fired.
   * @returns {Promise<void>} resolves after the message is handed over.
   */
  async function deliver(batch, watch) {
    const agent = await resolveAgent(watch)
    if (agent === undefined) {
      throw new Error('no live agent to notify; arm the watch from a session or set sessionId')
    }
    const text = renderNotification(
      { id: watch.id, root: watch.root, label: watch.label, prompt: watch.prompt },
      batch,
      { limit: config.maxEventsPerMessage, at: new Date().toISOString() },
    )
    const message = createUserMessage({
      content: [{ type: 'text', text }],
      source: { kind: 'folderwatch' },
    })
    if (watch.mode === 'queue' && typeof agent.inject === 'function') agent.inject(message)
    else if (typeof agent.followup === 'function') agent.followup(message)
    else if (typeof agent.inject === 'function') agent.inject(message)
    else throw new Error('the resolved agent exposes neither followup nor inject')
```

</details>

**依据 3 · 源码核查**：[lib/watch.js:293-307](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/watch.js#L293-L307)

批次ack基线。

<details>
<summary>查看原文（15行）</summary>

```text
  async deliver() {
    const batch = this.batcher.drain()
    if (batch === undefined) return
    const events = countEvents(batch.diff)
    if (events === 0 && batch.suppressed === 0) return
    this.suppressedEvents += batch.suppressed
    try {
      await this.onBatch(batch, this)
      this.deliveries += 1
      this.deliveredEvents += events
      this.lastDeliveryAt = this.now()
      if (this.once) await this.stop()
    } catch (error) {
      this.report(error)
    }
```

</details>

**依据 4 · 源码核查**：[lib/echo.js:155-185](https://github.com/11111353535/dsh-folderwatch/blob/c11125d12738945d291b6067fb5fa03ea48c1c08/lib/echo.js#L155-L185)

echo因果基线。

<details>
<summary>查看原文（31行）</summary>

```text
  function record(paths, flags = {}) {
    const at = now()
    prune(at)
    for (const path of Array.isArray(paths) ? paths : []) {
      if (typeof path !== 'string' || path === '') continue
      ledger.set(keyOf(path), { at, certain: flags.certain !== false })
    }
    /* Bound the map so a long session cannot grow it without limit. */
    while (ledger.size > limit) {
      const oldest = ledger.keys().next()
      if (oldest.done === true) break
      ledger.delete(oldest.value)
    }
    return ledger.size
  }

  /**
   * Whether a path was recently written by the agent.
   *
   * @param {string} path - path to test.
   * @returns {boolean} true when the change is an echo.
   */
  function isEcho(path) {
    const at = now()
    const entry = ledger.get(keyOf(path))
    if (entry === undefined) return false
    if (at - entry.at > windowMs) {
      ledger.delete(keyOf(path))
      return false
    }
    return true
```

</details>

#### 缺口

- 扫描质量/owner/ack新方案未实现。
  **影响**：不计当前可靠性或创新优势。
  **进一步探讨**：mock故障序列并对照完整任务通知身份/重复与恢复成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
