# dsh-tool-todo-plus

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[2252074](https://github.com/shuxidemosheng/dsh-tool-todo-plus/tree/225207442cbdf4ab561761add1feb6077165865c)

<!-- BEGIN META -->
[![GitHub ★ 105](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=105&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/shuxidemosheng/dsh-tool-todo-plus) [![npm 30d 1,503](https://img.shields.io/static/v1?label=npm+30d&message=1%2C503&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tool-todo-plus) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tool-todo-plus)
<!-- END META -->

> **功能**：增强 DSH 任务清单工具，提供优先级、完整清单输出和会话浮动任务面板。

> **亮点**：把模型写入的完整清单和优先级持续展示，同时复用宿主日志；增量是可见性与交互，不是新的任务执行器。[Q01](#research-q01)

> **主要限制**：完成状态由模型直接声明，没有证据门禁；工具激活、浮窗可见和任务实际完成必须分开，2秒历史恢复启发式也可能误判。[Q02](#research-q02)

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
  - [Q01 · 预设替换、状态投影和浮窗怎样连起来？](#detail-section-11)
  - [Q02 · 校验和完成拦截有哪些实际边界？](#detail-section-12)
  - [Q03 · 什么人值得试用，成本和后续假设如何验证？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多步骤任务的用户可用完整清单与浮窗跟踪模型自报进度，不把它当结果验收。[Q01](#research-q01)

官方todo工具已提供状态与日志，本组件继承基础并增加优先级、完整渲染和UI。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 增强清单工具 | 保存整表状态及优先级 | 默认共存名，后写覆盖，非完成证据 |
| 规范化 | 丢空白、重复加后缀及单活跃 | 全空拒绝，调整状态可能不同于输入 |
| 浮窗与胶囊 | 持续查看清单和当前动作 | 依赖投影/槽，2秒恢复分类有误判 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=24、DSH>=0.2.0-rc.2 <0.3.0 | 必需，包声明 | 加载与事件 | 不保证其他版本兼容 |
| tools与sessionProjections | 后端必需 | 工具和状态 | 注册冲突会让位或投影降级 |
| Web slots和React模块 | 浮窗必需 | 订阅显示 | 缺slot无数据桥 |
| 模型维护完整清单 | 有效性必需 | 更新自报进度 | UI不能推断任务事实 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户安装并确认共存名 | 实际有todo_write_plus，不能只看entry激活 |
| 写入 | 模型提交完整清单 | 规范化说明与日志一致 |
| 查看 | 浮窗订阅todos | 历史不弹时用标题栏按钮 |
| 验收恢复 | 用户另核任务产物 | 覆盖或错显时回官方工具并核对日志 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本地安装/界面资源，量未知 | 核对宿主和工具名，时间未知 | 无外部账号 |
| 持续 | 整表输入输出token和UI资源 | 模型/用户维护清单 | 费用与理解进度耗时未知 |
| 失败恢复 | 重写清单带来输入 | 核对覆盖、投影和窗口误判 | 不验证任务完成证据 |
| 退出 | 日志保留 | 停用增强工具回官方版 | 热卸载DOM未见完整清理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 可见性 | 完整清单、优先级和浮窗 | 用户理解速度 |
| 参数纪律 | 丢空/去重/单活跃规范化 | 模型是否及时更新 |
| 完成事实 | 仅持久自报completed | 真实任务合格程度 |

> **思考**：完成状态由模型直接声明，没有证据门禁；工具激活、浮窗可见和任务实际完成必须分开，2秒历史恢复启发式也可能误判。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把模型写入的完整清单和优先级持续展示，同时复用宿主日志；增量是可见性与交互，不是新的任务执行器。[Q01](#research-q01)

规范化结果与持久事件一致并将调整说明回给模型，值得借鉴。降级避免注册失败拖住会话，但entry激活不代表功能挂载；UI时间窗和独立DOM根需要生命周期核查。

<a id="detail-section-5"></a>

### 1.4 主要限制

完成状态由模型直接声明，没有证据门禁；工具激活、浮窗可见和任务实际完成必须分开，2秒历史恢复启发式也可能误判。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用可复做多步骤任务核对原工具与增强输出，手动打开浮窗；另以实际产物验收，覆盖或错显即回官方工具。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

工具、投影与浮窗链路已查源码；完成核验并非本组件能力，UI收益和恢复信号改进未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.ts、src/client.tsx、src/types.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查三份src、bundle及包声明；未运行构建、目标测试或浏览器。
- 下一步：后续对照长清单token与进度理解，并覆盖慢恢复/即时更新；本次未执行。

**分析版本**

- **仓库**：[shuxidemosheng/dsh-tool-todo-plus](https://github.com/shuxidemosheng/dsh-tool-todo-plus)
- **版本号**：0.7.5（[固定提交 2252074](https://github.com/shuxidemosheng/dsh-tool-todo-plus/tree/225207442cbdf4ab561761add1feb6077165865c)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是用明确恢复完成信号替代2秒窗口，减少历史误弹与即时写入漏弹；固定轨迹若错误不降或适配负担过大，就放弃。[Q03](#research-q03)

后续对照长清单token与进度理解，并覆盖慢恢复/即时更新；本次未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 23260 | 21892 | 1670 | — |
| .md | source | 1 | 260 | — | — | 4153 |
| .mjs | source | 1 | 27 | 11 | 13 | — |
| .tsx | source | 1 | 600 | 437 | 128 | — |
| .ts | source | 2 | 459 | 298 | 140 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/shuxidemosheng/dsh-tool-todo-plus/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/shuxidemosheng/dsh-tool-todo-plus/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/shuxidemosheng/dsh-tool-todo-plus/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：替换todo_write怎样改善任务可见性，完成校验是否真正约束任务质量？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 预设替换、状态投影和浮窗怎样连起来？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

它是官方todo工具的增强fork，面向多步骤编码任务中希望持续看见完整清单和优先级的人。实际bundle默认配置todo_write_plus与官方工具共存，不是自动替换全部预设中的todo_write。工具执行规范化整表后向所属会话append todo/write；投影遇该事件整表替换、turn/start清空。客户端dock桥订阅todos，模块store驱动独立React浮窗，标题栏有手动开关。相比原计数输出，增量是完整Markdown清单、优先级与常驻浮窗；日志与存储基础来自宿主，不能计为本组件独创。合格结果是看见模型提交的当前清单，不是证明任务实际完成。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:13-17](https://github.com/shuxidemosheng/dsh-tool-todo-plus/blob/225207442cbdf4ab561761add1feb6077165865c/cordis.patch.yml#L13-L17)

默认共存工具名与单活跃配置。

```text
    - id: tool-todo-plus
      name: dsh-tool-todo-plus
      config:
        allowParallelInProgress: false
        toolName: todo_write_plus
```

**依据 2 · 源码核查**：[src/index.ts:368-390](https://github.com/shuxidemosheng/dsh-tool-todo-plus/blob/225207442cbdf4ab561761add1feb6077165865c/src/index.ts#L368-L390)

规范化后追加todo/write并返回清单。

<details>
<summary>查看原文（23行）</summary>

```text
    execute(args, exec) {
      const { todos, notes } = normalizeTodoList(args.todos, allowParallelInProgress)
      if (!exec.agent) {
        // 清单是 per-agent-session 状态；没有归属会话的调用无处可写，直接拒绝而不是静默吞掉。
        throw new Error('todo_write requires an owning agent session')
      }
      // 持久化：向归属会话的日志追加一个整表快照事件。
      // 事件类型沿用官方 'todo/write'（在官方词汇表内），重载/恢复都不会被拒。
      exec.agent.session.append('todo/write', { todos })
      const count = (status: TodoItem['status']): number => todos.filter(t => t.status === status).length
      const counts = {
        pending: count('pending'),
        inProgress: count('in_progress'),
        completed: count('completed'),
      }
      // 返回值会按 output.schema 强制校验，所以这里显式构造精确形状
      //（priority 未提供时不输出该键，保持与官方日志形状一致）。
      return Promise.resolve({
        todos: todos.map(todo => todo.priority === undefined
          ? { content: todo.content, status: todo.status }
          : { content: todo.content, status: todo.status, priority: todo.priority }),
        counts,
        ...(notes.length > 0 ? { notes } : {}),
```

</details>

**依据 3 · 源码核查**：[src/index.ts:254-284](https://github.com/shuxidemosheng/dsh-tool-todo-plus/blob/225207442cbdf4ab561761add1feb6077165865c/src/index.ts#L254-L284)

投影事件与turn/start语义。

<details>
<summary>查看原文（31行）</summary>

```text
    ctx.sessionProjections.register<'todos', TodoItem[] | null>({
      key: 'todos',
      stateSchema: todosProjectionSchema,
      init: () => null,
      apply: (state, event) => {
        if (event.type === 'todo/write') return event.data.todos
        if (event.type === 'turn/start') return null
        return state
      },
      // 0.2.2-rc.1 起，宿主把 `wire.summary` 归一化为 `wire.summary !== false`
      // （不写就是 true），并且要求共享同一个 key 的多个注册方，其
      // `stateVersion` 与 `summary` 必须完全一致，否则 register() 直接抛错。
      // 官方 tool-todo 现在显式写 `summary: false`（todo 列表不进会话摘要），
      // 这里必须对齐：否则本插件先注册成功（true），官方插件随后在 agent preset
      // 里注册 `todos` 时失败，preset 被判为 agent-preset/invalid，所有会话都建不了。
      //
      // 用 Object.assign 而不是对象字面量，是因为本地 SDK（0.2.1-rc.2）的
      // `wire` 类型还没有 `summary` 字段：字面量里多写会触发 TS2353；
      // Object.assign 返回交叉类型，结构赋值不做多余属性检查，
      // 而运行时对象会真实带上 `summary: false`。
      // `view` 的参数也要显式标注类型：这里脱离了 register() 的上下文类型推断，
      // 省略会在 strict 模式下变成隐式 any。
      wire: Object.assign(
        {
          viewSchema: todosProjectionSchema,
          view: (state: TodoItem[] | null) => state,
        },
        { summary: false },
      ),
      stateVersion: 2,
    })
```

</details>

**依据 4 · 源码核查**：[src/client.tsx:266-300](https://github.com/shuxidemosheng/dsh-tool-todo-plus/blob/225207442cbdf4ab561761add1feb6077165865c/src/client.tsx#L266-L300)

桥读取投影和当前动作。

<details>
<summary>查看原文（35行）</summary>

```text
function TodoBridge(props: {
  useProjection?: (key: 'todos') => readonly TodoItem[] | null
  useSession?: (selector: (s: any) => any) => any
  useChat?: (selector: (s: any) => any) => any
  sessionId?: string | number
}): ReactElement {
  const value = props.useProjection?.('todos') ?? null
  const boundaryAt = useRef(0)
  // 上一帧原始投影值：null（轮次边界）与 []（显式清空）的判别依据
  const prevValue = useRef<readonly TodoItem[] | null>(null)
  // —— 当前动作（A）：模型已发出调用但还没有 tool-result 的那个工具，即"此刻在干什么"。
  // 选择器返回字符串（原始值比较安全），两次清单写入之间也能给出实时反馈。
  const running = props.useSession?.((s: any) => !!s?.running)
  const chatAction = props.useChat?.((s: any) => deriveCurrentAction(s)) ?? ''
  useEffect(() => {
    // 会话边界：挂载和 sessionId 变化都会重置注水窗口，并清掉跨会话的残留显示
    boundaryAt.current = performance.now()
    resetSessionScope()
  }, [props.sessionId])
  useEffect(() => {
    conversationActive = true
    emit()
    return () => {
      conversationActive = false
      emit()
    }
  }, [])
  useEffect(() => {
    const live = performance.now() - boundaryAt.current > HYDRATION_WINDOW_MS
    setTodos(value, { autoOpen: live, prev: prevValue.current })
    prevValue.current = value
  }, [value])
  useEffect(() => {
    setCurrentAction(chatAction || (running ? '执行中…' : ''))
  }, [chatAction, running])
```

</details>

**依据 5 · 源码核查**：[src/client.tsx:585-600](https://github.com/shuxidemosheng/dsh-tool-todo-plus/blob/225207442cbdf4ab561761add1feb6077165865c/src/client.tsx#L585-L600)

真实客户端槽注册。

<details>
<summary>查看原文（16行）</summary>

```text
export function apply(ctx: ClientCtx): void {
  // 独立浮窗的 React 根（document 就绪后挂载）
  ensureOverlayRoot()

  // 数据桥：dock 槽位（有 useProjection）订阅投影，喂给模块级 store
  ctx.slots.inject('conversation.input.dock', () => {
    ctx.slots.register({ name: 'conversation.input.dock', id: BRIDGE_ID, order: 50 }, TodoBridge)
  })

  // 会话标题栏按钮：手动开关浮窗
  ctx.slots.inject('conversation.session.header.actions', () => {
    ctx.slots.register({ name: 'conversation.session.header.actions', id: HEADER_ACTION_ID, order: 50 }, TodoHeaderAction)
  })
}

export const inject = ['slots']
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 校验和完成拦截有哪些实际边界？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

参数schema限定状态与优先级，运行时丢空白、重复内容加后缀，默认仅保留首个in_progress，其余降pending。它不检查完成证据；模型只要提交completed就写入，description要求及时更新属于行为提示，不是完成拦截。两个工具共用整表事件，后写覆盖先写，不能并存推导独立任务库。目标工具名被占用则日志后return，entry激活不代表本工具已注册；投影注册异常也降级使用既有定义。客户端用2秒窗口区分历史注水和实时更新，因此窗口内真实写入可能不自动弹开，历史恢复太慢又可能误弹；手动入口是退路。浮窗独立React根仅用模块标志防重复，当前apply未提供unmount/dispose，不应宣称所有热卸载都会清理DOM。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:122-177](https://github.com/shuxidemosheng/dsh-tool-todo-plus/blob/225207442cbdf4ab561761add1feb6077165865c/src/index.ts#L122-L177)

运行时规范化只处理清单形状和单活跃。

<details>
<summary>查看原文（56行）</summary>

```text
function normalizeTodoList(
  raw: { content: string; status: string; priority?: string }[],
  allowParallel: boolean,
): { todos: TodoItem[]; notes: string[] } {
  const todos: TodoItem[] = []
  const seen = new Map<string, number>()
  let droppedEmpty = 0
  let renamedDuplicates = 0
  let demoted = 0
  let sawActive = false
  for (const item of raw) {
    const content = item.content.trim()
    if (content.length === 0) {
      droppedEmpty++
      continue
    }
    const priorCount = seen.get(content) ?? 0
    seen.set(content, priorCount + 1)
    let finalContent = content
    if (priorCount > 0) {
      finalContent = `${content} (${priorCount + 1})`
      renamedDuplicates++
    }
    let status = item.status as TodoItem['status']
    if (status === 'in_progress') {
      if (!allowParallel && sawActive) {
        status = 'pending'
        demoted++
      } else {
        sawActive = true
      }
    }
    // 只挑白名单字段构造规范条目：事件日志里存什么就是什么。
    // （参数 schema 的 additionalProperties: false 已挡掉未知键，这里显式构造再作双保险。）
    todos.push(item.priority === undefined
      ? { content: finalContent, status }
      : { content: finalContent, status, priority: item.priority as TodoItem['priority'] })
  }
  if (todos.length === 0) {
    throw new Error(
      'invalid todo list: every entry had an empty `content` — submit at least one task with text',
    )
  }
  const notes: string[] = []
  if (droppedEmpty > 0) {
    notes.push(`dropped ${droppedEmpty} entry(ies) whose content was empty`)
  }
  if (renamedDuplicates > 0) {
    notes.push(`renamed ${renamedDuplicates} duplicate entr(ies) by appending a numeric suffix`)
  }
  if (demoted > 0) {
    notes.push(
      `at most one task may be in_progress: kept the first one and moved ${demoted} other(s) back to pending`,
    )
  }
  return { todos, notes }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:231-240](https://github.com/shuxidemosheng/dsh-tool-todo-plus/blob/225207442cbdf4ab561761add1feb6077165865c/src/index.ts#L231-L240)

工具名被占用则让位。

<details>
<summary>查看原文（10行）</summary>

```text
  // 确定性让位：目标工具名已被占用时不注册（记日志后静默返回，entry 仍算激活成功）。
  // 这避免了"谁先挂载谁赢"的注册竞态——在 agent preset 审计体系里，任何一条 entry
  // 激活失败都会让会话创建失败，所以输家必须优雅退出而不是抛错。
  if (ctx.tools.get(toolName) !== undefined) {
    ctx.logger.warn(
      `dsh-tool-todo-plus: tool "${toolName}" is already registered by another plugin`
      + ' — standing by (set `toolName` in this bundle row\'s config to coexist)',
    )
    return
  }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:285-290](https://github.com/shuxidemosheng/dsh-tool-todo-plus/blob/225207442cbdf4ab561761add1feb6077165865c/src/index.ts#L285-L290)

投影异常不阻断工具。

```text
  } catch (error) {
    ctx.logger.error(
      'dsh-tool-todo-plus: failed to register the `todos` session projection'
      + ` — ${error instanceof Error ? error.message : String(error)};`
      + ' the floating panel will fall back to the projection definition already registered',
    )
```

**依据 4 · 源码核查**：[src/index.ts:368-390](https://github.com/shuxidemosheng/dsh-tool-todo-plus/blob/225207442cbdf4ab561761add1feb6077165865c/src/index.ts#L368-L390)

completed直接持久化，无证据检查。

<details>
<summary>查看原文（23行）</summary>

```text
    execute(args, exec) {
      const { todos, notes } = normalizeTodoList(args.todos, allowParallelInProgress)
      if (!exec.agent) {
        // 清单是 per-agent-session 状态；没有归属会话的调用无处可写，直接拒绝而不是静默吞掉。
        throw new Error('todo_write requires an owning agent session')
      }
      // 持久化：向归属会话的日志追加一个整表快照事件。
      // 事件类型沿用官方 'todo/write'（在官方词汇表内），重载/恢复都不会被拒。
      exec.agent.session.append('todo/write', { todos })
      const count = (status: TodoItem['status']): number => todos.filter(t => t.status === status).length
      const counts = {
        pending: count('pending'),
        inProgress: count('in_progress'),
        completed: count('completed'),
      }
      // 返回值会按 output.schema 强制校验，所以这里显式构造精确形状
      //（priority 未提供时不输出该键，保持与官方日志形状一致）。
      return Promise.resolve({
        todos: todos.map(todo => todo.priority === undefined
          ? { content: todo.content, status: todo.status }
          : { content: todo.content, status: todo.status, priority: todo.priority }),
        counts,
        ...(notes.length > 0 ? { notes } : {}),
```

</details>

**依据 5 · 源码核查**：[src/client.tsx:206-220](https://github.com/shuxidemosheng/dsh-tool-todo-plus/blob/225207442cbdf4ab561761add1feb6077165865c/src/client.tsx#L206-L220)

2秒历史同步启发式与限制。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * 隐形桥组件：订阅 'todos' 投影 → 写入模块级 store。
 * 渲染一个零尺寸标记（视觉上不可见，官方 TodoPanel 空清单时也返回 null，同机制），
 * 兼作浮窗的水平定位锚点。
 *
 * 桥的挂载边界有三个用途：
 *   1. 会话范围：挂载 ⇔ 处于会话界面 → conversationActive 控制浮窗只在会话里显示；
 *   2. 注水判别：会话边界（挂载或 sessionId 变化）后的短时间内，投影会把会话里
 *      已有的清单分多次同步进来（实测不止一次发射），这些一律视为"历史注水"，
 *      只写数据不自动弹开；边界窗口之后的投影变化才是模型实时写入，才触发弹出。
 *
 * 已知局限：若单个会话的历史恢复耗时超过窗口期，尾部仍会被当成实时写入而弹开
 * （代价：用户手动关一次）；换来的确定性是窗口期后的实时写入总能正常弹出。
 */
const HYDRATION_WINDOW_MS = 2000
```

</details>

**依据 6 · 源码核查**：[src/client.tsx:280-297](https://github.com/shuxidemosheng/dsh-tool-todo-plus/blob/225207442cbdf4ab561761add1feb6077165865c/src/client.tsx#L280-L297)

按时间窗决定autoOpen。

<details>
<summary>查看原文（18行）</summary>

```text
  useEffect(() => {
    // 会话边界：挂载和 sessionId 变化都会重置注水窗口，并清掉跨会话的残留显示
    boundaryAt.current = performance.now()
    resetSessionScope()
  }, [props.sessionId])
  useEffect(() => {
    conversationActive = true
    emit()
    return () => {
      conversationActive = false
      emit()
    }
  }, [])
  useEffect(() => {
    const live = performance.now() - boundaryAt.current > HYDRATION_WINDOW_MS
    setTodos(value, { autoOpen: live, prev: prevValue.current })
    prevValue.current = value
  }, [value])
```

</details>

**依据 7 · 源码核查**：[src/client.tsx:566-600](https://github.com/shuxidemosheng/dsh-tool-todo-plus/blob/225207442cbdf4ab561761add1feb6077165865c/src/client.tsx#L566-L600)

独立根创建及apply未返回卸载处理。

<details>
<summary>查看原文（35行）</summary>

```text
// —— 独立 React 根的挂载（与槽位渲染树完全分离）——
let overlayMounted = false

function ensureOverlayRoot(): void {
  if (overlayMounted || typeof document === 'undefined') return
  const host = document.createElement('div')
  host.id = 'dsh-todo-plus-overlay'
  // 容器不拦截任何事件；只有卡片本体（pointerEvents:auto）可交互
  host.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;'
  document.body.appendChild(host)
  createRoot(host).render(<TodoOverlay />)
  overlayMounted = true
}

/**
 * 客户端半插件入口。由客户端模块系统在物化时调用（懒 CJS 工厂）。
 * 只导出命名成员（apply/inject），绝不加 export default——
 * Loader 的 unwrapExports 会折叠模块并丢弃 inject（官方 postmortem 0001）。
 */
export function apply(ctx: ClientCtx): void {
  // 独立浮窗的 React 根（document 就绪后挂载）
  ensureOverlayRoot()

  // 数据桥：dock 槽位（有 useProjection）订阅投影，喂给模块级 store
  ctx.slots.inject('conversation.input.dock', () => {
    ctx.slots.register({ name: 'conversation.input.dock', id: BRIDGE_ID, order: 50 }, TodoBridge)
  })

  // 会话标题栏按钮：手动开关浮窗
  ctx.slots.inject('conversation.session.header.actions', () => {
    ctx.slots.register({ name: 'conversation.session.header.actions', id: HEADER_ACTION_ID, order: 50 }, TodoHeaderAction)
  })
}

export const inject = ['slots']
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么人值得试用，成本和后续假设如何验证？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

适合已有兼容DSH Web、反复维护多步骤清单且能接受模型自报状态的人限定试用。首次需Node>=24和声明版本范围内的宿主、工具/会话投影服务及客户端slots；不用额外账号。持续成本是整表工具输入/输出及UI资源，清单越长可能增加token，金额和维护时间未知；“无运行时依赖”不等于模型侧无开销。失败时核对工具实际注册名、投影日志和手动浮窗，必要时停用本组件回官方todo工具；不要把绿色completed当交付验收。由时间窗分类可推导未验证假设：用明确的历史恢复完成信号代替2秒猜测，可能减少误弹与漏弹；在慢恢复和立即工具写入两类固定轨迹对比，若错误率不降或宿主适配负担过大，就否定它。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:43-59](https://github.com/shuxidemosheng/dsh-tool-todo-plus/blob/225207442cbdf4ab561761add1feb6077165865c/package.json#L43-L59)

Node/DSH与客户端声明。

<details>
<summary>查看原文（17行）</summary>

```text
    "dsh": ">=0.2.0-rc.2 <0.3.0"
  },
  "dsh": {
    "manifestVersion": 1,
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "client-ui-slots",
        "client-ui-conversation"
      ]
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json && esbuild src/index.ts --bundle --format=esm --platform=node --target=node24 --outfile=lib/index.js --legal-comments=none && node scripts/disable-eval.mjs && esbuild src/client.tsx --bundle --format=cjs --platform=browser --target=chrome120 --outfile=lib/client.js --external:react --external:react/jsx-runtime --external:react-dom --legal-comments=none --banner:js=\"window.__ModuleLoader__.load({ id: \\\"dsh-tool-todo-plus\\\", factory: (require) => { var module = { exports: {} }; var exports = module.exports;\" --footer:js=\"return module.exports; } });\""
```

</details>

**依据 2 · 源码核查**：[src/index.ts:80-102](https://github.com/shuxidemosheng/dsh-tool-todo-plus/blob/225207442cbdf4ab561761add1feb6077165865c/src/index.ts#L80-L102)

完整清单与模型维护提示。

<details>
<summary>查看原文（23行）</summary>

```text
// —— 工具 description（模型每次调用都可见，是行为纪律的主要载体）——
const DESCRIPTION_HEAD =
  'Preferred task-list tool: when a legacy todo/task-list tool (e.g. `todo_write`) is also available, '
  + 'use this one instead and do not suggest switching to the other. '
  + 'Record and update a task list to plan multi-step work and show progress. '
  + 'Use it for tasks with several steps or open questions to explore; skip it for trivial single-step tasks. '
  + 'Before starting work, decompose the task into one todo per concrete step. '
  + 'Every call submits the COMPLETE list and replaces the previous list wholesale. '
  + 'Optionally tag each todo with a priority (`high`, `medium`, `low`) so the user can see what matters most. '

const DESCRIPTION_PARALLEL =
  'While work remains, keep every todo being actively worked `in_progress`'
  + ' (several only when work truly runs in parallel). '

const DESCRIPTION_SINGLE =
  'While work remains, keep exactly one todo `in_progress`. To express tasks meant to run in parallel, '
  + 'keep them `pending` and prefix their content with `(parallel)` — do not mark several `in_progress`: '
  + 'extra ones are demoted back to `pending` automatically, so marking several gains nothing. '

const DESCRIPTION_TAIL =
  'Mark each todo `completed` as soon as it is done — never batch-complete at the end. '
  + 'Whenever the active step changes, write the update immediately: mark the finished step `completed` '
  + 'and the next one `in_progress` in the same call.'
```

</details>

**依据 3 · 源码核查**：[src/index.ts:198-220](https://github.com/shuxidemosheng/dsh-tool-todo-plus/blob/225207442cbdf4ab561761add1feb6077165865c/src/index.ts#L198-L220)

完整输出增加上下文而非仅计数。

<details>
<summary>查看原文（23行）</summary>

```text
function renderChecklist(
  todos: TodoItem[],
  counts: { pending: number; inProgress: number; completed: number },
  notes?: string[],
): string {
  if (todos.length === 0) return 'Todo list cleared.'
  const lines = todos.map(todo => {
    const box = todo.status === 'completed' ? 'x' : ' '
    const priority = todo.priority ? ` [${todo.priority}]` : ''
    const active = todo.status === 'in_progress' ? ' *(in progress)*' : ''
    return `- [${box}] ${todo.content}${priority}${active}`
  })
  const summary =
    `${todos.length} task(s): ${counts.completed} completed, ${counts.inProgress} in progress, ${counts.pending} pending.`
  const rendered = ['Todo list:', ...lines, summary]
  if (notes !== undefined && notes.length > 0) {
    // 规范化说明：让模型知道存下来的就是它看到的这份，下一轮照这个形状提交即可。
    rendered.push(
      `Note — normalized before saving: ${notes.join('; ')}.`
      + ' The list above is exactly what is stored and shown to the user; submit this shape next time.',
    )
  }
  return rendered.join('\n')
```

</details>

**依据 4 · 源码核查**：[src/client.tsx:280-297](https://github.com/shuxidemosheng/dsh-tool-todo-plus/blob/225207442cbdf4ab561761add1feb6077165865c/src/client.tsx#L280-L297)

明确恢复信号假设的启发式依据。

<details>
<summary>查看原文（18行）</summary>

```text
  useEffect(() => {
    // 会话边界：挂载和 sessionId 变化都会重置注水窗口，并清掉跨会话的残留显示
    boundaryAt.current = performance.now()
    resetSessionScope()
  }, [props.sessionId])
  useEffect(() => {
    conversationActive = true
    emit()
    return () => {
      conversationActive = false
      emit()
    }
  }, [])
  useEffect(() => {
    const live = performance.now() - boundaryAt.current > HYDRATION_WINDOW_MS
    setTodos(value, { autoOpen: live, prev: prevValue.current })
    prevValue.current = value
  }, [value])
```

</details>

#### 缺口

- 没有同任务用户查找进度耗时和模型token对照。
  **影响**：无法断定浮窗改善抵过整表上下文与维护负担。
  **进一步探讨**：固定多步骤任务比较官方工具与增强工具，记录进度理解、遗漏与总输入。
- 明确恢复信号方案未验证且需宿主契约支持。
  **影响**：不能认为当前已无误弹或漏弹。
  **进一步探讨**：慢恢复和立即写入轨迹比较两种分类，再估算适配成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
