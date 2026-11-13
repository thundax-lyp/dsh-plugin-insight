# DSH CLIWorker Now

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[debf4f1](https://github.com/SuperWheel/dsh-cliworker-now/tree/debf4f1dfa6e9a027c9a3c3eddbe88b71b1606de)

<!-- BEGIN META -->
[![GitHub ★ 43](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=43&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SuperWheel/dsh-cliworker-now)
<!-- END META -->

> **功能**：在 DSH 中派遣外部 AI CLI，查看 Worker 会话、状态和结果。

> **亮点**：把外部 CLI 进程、父会话和权限回执接入同一派遣流程，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：挂载会替换原生会话界面。不同 CLI 的真实权限和启动后结果需独立核查，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 为什么把外部 CLI 派遣放进 DSH，而非另开终端？](#detail-section-11)
  - [Q02 · 派遣工具怎样从父会话走到真实 CLI 进程？](#detail-section-12)
  - [Q03 · 替换原生界面和各 CLI 权限有哪些前提？](#detail-section-13)
  - [Q04 · 哪种小任务能检验派遣价值及退出？](#detail-section-14)
  - [Q05 · 把进程接收与任务完成分开提示能否减少误重试？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合已有外部 CLI 且想从 DSH 交给它一个可独立复核的代码分析任务的人，见 [Q01](#research-q01)。

用宿主原生子 Agent，或手工开同一个外部 CLI 并贴回脱敏结论。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 启动 Worker | 选型后交外部 CLI | 受主会话与 CLI 条件约束 |
| Worker 面板 | 检查过程和状态 | 依赖原生界面替换 |
| 权限回执 | 查看此轮实际档位 | 不同 CLI 的原生策略不同 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 匹配的 DSH profile 与运行时文件 | 必需 | 通过预检并加载替换界面 | 不发布就绪 |
| 受支持的外部 CLI 与账号 | 执行所需 | 真正派遣任务 | 无法选型、授权或启动 |
| 目标工作区及可核权限 | 执行所需 | 限制任务和进程 | 改变后重新选择 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 复制 profile 及脱敏工作区 | 保留原配置和草稿 |
| 派遣 | 选择一个只读任务 | 核权限及运行结果 |
| 退出 | 权限不明或无法收尾时停下 | 查进程、文件并回原流程 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主、CLI 与模型环境 | 核兼容和账号 | 安装工时未知 |
| 持续 | 供应商调用与进程资源 | 核对权限、输出和进度 | 合格任务费用未量化 |
| 失败恢复 | 可能重跑任务 | 检查进程及工作区后再决定 | 交付回执不是结果 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 派遣 | 真实进程和父会话关联 | 任务正确率 |
| 预检 | 摘要、资源和依赖校验 | 所有宿主组合可用性 |

> **思考**：挂载会替换原生会话界面。不同 CLI 的真实权限和启动后结果需独立核查，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把外部 CLI 进程、父会话和权限回执接入同一派遣流程，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

预检与挂载有明确依赖，队列在原生启动后结算交付。不要把此边界当 CLI 最终结果，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

挂载会替换原生会话界面。不同 CLI 的真实权限和启动后结果需独立核查，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只在复制的 profile 用一个确定只读的外部 CLI 观察任务，按权限回执、实际进程及文件验证，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认预检、替换挂载及实际派遣；未验证宿主版本和外部 CLI 的运行结果。

- 已检查：作者 README、包清单、源码路径 README.md、src/client/index.tsx、src/host/index.ts、src/host/runtime.ts、cordis.patch.yml、scripts/host-runtime.mjs、scripts/host-extension-guard.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对主模块与替换挂载、代表派遣和进程准入。未核所有 CLI 适配器、远端账号、宿主或发布包。
- 下一步：固定一个版本组合，在空白仓库执行无写入任务并模拟取消与启动失败。

**分析版本**

- **仓库**：[SuperWheel/dsh-cliworker-now](https://github.com/SuperWheel/dsh-cliworker-now)
- **版本号**：0.8.9（[固定提交 debf4f1](https://github.com/SuperWheel/dsh-cliworker-now/tree/debf4f1dfa6e9a027c9a3c3eddbe88b71b1606de)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

区分进程启动、消息交付与业务验收，比较是否减少异常后的重复派遣，见 [Q05](#research-q05)。

固定一个版本组合，在空白仓库执行无写入任务并模拟取消与启动失败。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 666 | 37068 | — | — | 1032305 |
| .mjs | source | 100 | 19379 | 17994 | 1081 | — |
| .js | source | 8 | 42886 | 38371 | 5533 | — |
| .ts | source | 182 | 47122 | 43177 | 2904 | — |
| .tsx | source | 39 | 10244 | 9843 | 253 | — |
| .cjs | source | 1 | 122 | 114 | 4 | — |
| .ts | test | 259 | 69527 | 66474 | 1389 | — |
| .tsx | test | 25 | 13372 | 12875 | 118 | — |
| .ts | example | 11 | 458 | 421 | 26 | — |
| .mjs | example | 3 | 218 | 210 | 7 | — |
| .js | example | 1 | 33 | 30 | 0 | — |
| .tsx | example | 1 | 40 | 38 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-12），可前往 [GitHub Issues](https://github.com/SuperWheel/dsh-cliworker-now/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对 DSH 如何挂载与派遣 CLI Worker，辨别执行器、权限和交付状态。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 为什么把外部 CLI 派遣放进 DSH，而非另开终端？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

使用 DSH 做协调、已经有独立 CLI 账号的开发者，可以把只读代码分析交给外部 Worker 并在父会话观察进度。对照手工开终端再贴结果，增量是后台派遣、父会话归属和侧栏界面。DSH 原生子 Agent 已能分工，同一宿主模型足够时无需加外部 CLI。扩展的实际额外价值在接已有外部执行器和账号。合格结果须是指定工作区的分析可核对且能对应实际 Worker，启动回执本身不是任务结果。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-41](https://github.com/SuperWheel/dsh-cliworker-now/blob/debf4f1dfa6e9a027c9a3c3eddbe88b71b1606de/README.md#L21-L41)

作者定位与工具协作方式。

<details>
<summary>查看原文（21行）</summary>

```text
## 这是什么

dsh-cliworker-now 是 DeepSeek Harness 的**多 CLI 智能体插件**。它把终端里的 AI CLI 接进 Harness：主对话负责派遣和接收结果，右侧栏用 Harness 原生的完整对话视图展示每个智能体的过程、用量和状态。

你仍然使用各 CLI 自己的账号、模型和原生会话；插件负责把它们组织起来。插件不附带模型服务、订阅或 API 额度。

- **开发协作**：让 Codex 审查代码，再按同一个名字继续追问。
- **写作与审校**：为逻辑、文风、商业审稿和正文修订配置不同角色。
- **长任务跟进**：独立对话和执行记录都保留，任务结束后可以接着做。

安装后在 Harness 中显示为 **CLI Worker / CLI Worker Now**。

## 特点

- **一个入口，多种 CLI**：在主对话点名 CLI，侧栏按 CLI 分组查看全部任务。
- **原生对话体验**：子会话直接使用 Harness 的对话视图、输入框、模型与权限控件、“+”菜单和用量统计，支持排队、停止和结束后续聊；切换 CLI 账号后旧任务自动以当前账号续接，原会话无法恢复时在新会话中附上此前记录继续（此前对话会发给当前账号的服务商）。
- **保留原生能力**：每个 CLI 使用自己的协议、登录和会话；模型与思考强度按 CLI 实际目录和当前账号读取，不照搬其他 CLI 的规则。
- **原生工具优先，DSH 工具作为备选**：CLI 先用自己的读写、搜索、命令、网页工具和 skill。与之重叠的 DSH 工具不再交给 CLI，同名 MCP 只保留 CLI 自己配置的那份；CLI 没有的能力（如 Pi 的命令执行）以及 DSH 独有的 MCP 和技能，经 `dsh_worker_tools` 作为备选提供，描述标明「备选」，每次执行仍经 Harness 权限与审批。Codex、Claude Code、Pi、OpenCode、MiMo 与 Grok 会收到一段简短的原生优先说明，列出实际提供的备选工具（追加到 CLI 自身提示，不改动你的任务和指令文件；Codex 已配置 `developer_instructions` 时不发送）。ZCode 的工具桥执行尚未核验，暂不提供；OMP、Hermes 及隔离副本任务不接工具桥。
- **有名字、有角色的智能体**：唯一名称、角色预设和自定义提示词，可按名字反复调用。
- **可控调度**：首次使用前必须明确选型（可关闭后续询问，直接用已保存的默认设定）；同一会话互斥，同一目录的写任务默认串行；CLI 失败时不会悄悄换用另一个。
- **权限三档**：每个 Worker 可选询问 / 自动审批 / 完全权限（按 CLI 实际能力命名），以 CLI 自己的原生模式运行；没选过的 Worker 跟随主对话的权限预设，你选过的档位按所选运行；额外授权交给 DSH 决定：主 Agent 派出的任务在主对话页弹出授权问题，你在子会话里发起的轮次在该子会话中审批；规划模式一律拒绝写入。授权被拒绝（包括 DSH 备选工具的授权）后 CLI 自行结束本轮时，任务记为「已完成」，不另加提示；拒绝记录保留在时间线中。
```

</details>

**依据 2 · 源码核查**：[src/client/index.tsx:240-263](https://github.com/SuperWheel/dsh-cliworker-now/blob/debf4f1dfa6e9a027c9a3c3eddbe88b71b1606de/src/client/index.tsx#L240-L263)

注册侧栏和会话 UI。

<details>
<summary>查看原文（24行）</summary>

```text
    scope.effect(() => installNativeJobOverlay(document))
    scope.effect(() =>
      scope.sidebarRightTabs.register({
        id: ID,
        kind: 'cliworker',
        title: () => 'CLI Worker',
        guide: [
          {
            id: 'cliworker',
            order: 25,
            title: () => 'CLI Worker',
            description: () => t('查看各 CLI 子 Agent 的实时工作'),
            icon: () => <BrandIcon />,
          },
        ],
      }),
    )
    scope.effect(() =>
      scope.slots.inject('sidebar.right.pane.tab', () =>
        scope.slots.register(
          {
            name: 'sidebar.right.pane.tab',
            key: ID,
            children: { 'cliworker.native.sidebar': { kind: 'single', scope: 'session' } },
```

</details>

**依据 3 · 源码核查**：[src/host/index.ts:1661-1685](https://github.com/SuperWheel/dsh-cliworker-now/blob/debf4f1dfa6e9a027c9a3c3eddbe88b71b1606de/src/host/index.ts#L1661-L1685)

宿主派遣工具注册和输入。

<details>
<summary>查看原文（25行）</summary>

```text
    this.ctx.effect(
      () =>
        this.ctx.tools.register(
          defineTool({
            name: 'cliworker_start',
            description: `用户明确要求“调用 agy cli”或“用 glm cli 完成任务”时，调用本工具打开 CLI Worker 的选型流程。只需提供 CLI、任务标题和任务内容；模型、思考强度与角色由插件收集，完成选型前不会启动任务，不要把它们当作调用本工具的前置输入。${CLI_NAME_GUIDANCE}。泛称 qoder / WorkBuddy 在双版本均安装时先通过原生询问选择版本。Host 在首次选择模型、思考强度与角色，或同项目新对话确认是否沿用时提问；同对话后续不重复。不要提前自行提问或增加确认，不代答。返回后台 job、worker ID、agentName 与 permission（本轮实际权限档位；未选过档位的 Worker 跟随主对话权限预设），向用户说明权限时以 permission 为准，不要自行推断。主对话的直接子 Agent（包括 CLI Worker）可同级派遣，新 Worker 归属主对话并与发起者同级；发起者不提供模型、强度、角色或会话 ID，每个主对话最多 6 个未结束的子 Agent 派遣。主对话的已有智能体续聊用 cliworker_followup；除泛称 qoder / WorkBuddy 的双版本选择外，其他歧义返回简短候选错误，不启动、不额外发问题卡。`,
            parameters: {
              cli: {
                type: 'string',
                required: true,
                description: `本次用户明确指定的 CLI 规范 ID 或别名：${CLI_NAME_GUIDANCE}。每次调用必填，Antigravity 也不可省略；不得照搬历史调用中省略 cli 的写法。较长名称仅接受唯一轻微误差；短名须精确，不猜模型。`,
              },
              title: { type: 'string', required: true },
              prompt: { type: 'string', required: true },
              agent_name: {
                type: 'string',
                description:
                  'Optional user-requested unique worker name within this parent conversation. Otherwise assigned from the CLI short name and an ordinal. Use followup by worker_name to reuse an existing named worker.',
              },
              read_only: {
                type: 'boolean',
                description:
                  'Use native read-only/plan mode; unsupported by Kimi print mode. Omit or false for coding.',
              },
            },
```

</details>

#### 缺口

- 没有同一任务与原生子 Agent 或手工终端的效果对照
  **影响**：无法确定协调成本净变化
  **进一步探讨**：在脱敏仓库用同一分析题核准确性、复核和等待

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 派遣工具怎样从父会话走到真实 CLI 进程？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具要求 Agent 上下文；直接子 Agent 可以发起同级派遣，先解析父会话，第三层和找不到父会话则拒绝。完成选型并检查取消才调用 launch，launch 再核权限、CLI 启用状态、账号终端占用和项目是否改变。运行时为队列项检查当前所有权后才启动进程，传入计算后的 argv、环境、目录及取消信号。启动后登记用户消息并移除队列项，这是已交给进程的边界，不能当成 CLI 已成功执行或任务副作用已提交。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.ts:780-807](https://github.com/SuperWheel/dsh-cliworker-now/blob/debf4f1dfa6e9a027c9a3c3eddbe88b71b1606de/src/host/index.ts#L780-L807)

调用者归属及拒绝条件。

<details>
<summary>查看原文（28行）</summary>

```text
  private async dispatchSubject(caller: Agent): Promise<Agent> {
    if (caller.session.header.origin !== 'subagent') return caller
    const parentId = caller.session.header.parentSession
    // A background Worker can outlive its parent's resident Agent; load it the
    // same way native Remote Agent parameters do before deciding it is gone.
    if (parentId) try { await this.ctx.typert.lookups.get('agent')?.resolve(parentId) } catch { /* reported below */ }
    const parent = parentId && this.ctx.agents.get(parentId)
    if (!parent) throw new Error('无法解析子 Agent 所属主对话；任务尚未创建')
    if (parent.id === caller.id || parent.session.header.origin === 'subagent' || parent.session.header.parentSession)
      throw new Error('只允许主对话的直接子 Agent 同级派遣；第三层调用被拒绝')
    return parent
  }
  private async siblingDispatch(caller: Agent, parent: Agent, signal: AbortSignal) {
    if (caller === parent) return { questionAgent: parent }
    this.runtime.assertSiblingCapacity(parent.id)
    const worker = [...this.runtime.storage.workers.values()].find(
      row => row.parentSessionId === parent.id && row.harnessConversation?.sessionId === caller.id,
    )
    const surface = worker && (this.runQuestionSessions?.get(worker.runId)
      ?? (this.runOrigins?.get(worker.runId) === 'agent' ? parent.id : caller.id))
    const questionAgent = surface ? this.ctx.agents.get(surface as Agent['id']) : parent
    if (!questionAgent) throw new Error('发起者当前轮的询问会话不可用；任务尚未创建')
    const label = worker ? workerName(worker)
      : (await this.ctx.get('subagents')?.listChildren(parent.id, signal))?.find(row => row.id === caller.id)?.label
    return {
      questionAgent,
      initiator: { kind: worker ? 'worker' as const : 'subagent' as const, id: worker?.id ?? caller.id, name: label || caller.id },
    }
```

</details>

**依据 2 · 源码核查**：[src/host/index.ts:1689-1725](https://github.com/SuperWheel/dsh-cliworker-now/blob/debf4f1dfa6e9a027c9a3c3eddbe88b71b1606de/src/host/index.ts#L1689-L1725)

选型结束后触发 launch。

<details>
<summary>查看原文（37行）</summary>

```text
            execute: async (args, exec) => {
              if (!exec.agent) throw new Error('A parent Agent is required')
              const parent = await this.dispatchSubject(exec.agent)
              this.assertExecution(parent, true)
              const { questionAgent, initiator } = await this.siblingDispatch(exec.agent, parent, exec.signal)
              let cli = requireCliName(args.cli)
              if (isGenericWorkBuddyName(args.cli))
                cli = await this.chooseWorkBuddyVariant(parent, exec.signal, args.cli, questionAgent)
              if (isGenericQoderName(args.cli))
                cli = await this.chooseQoderVariant(parent, exec.signal, args.cli, questionAgent)
              const agentName =
                args.agent_name === undefined ? undefined : agentNameSchema.parse(args.agent_name)
              if (cli === 'kimi' && args.read_only) throw new Error('Kimi 非交互模式不支持只读派遣')
              const setup = await this.chooseDispatch(
                parent,
                AbortSignal.any([exec.signal, this.disposed.signal]),
                cli,
                questionAgent,
              )
              exec.signal.throwIfAborted()
              return this.launch(
                parent,
                args.title,
                args.prompt,
                setup.preference,
                args.read_only ? 'plan' : 'accept-edits',
                undefined,
                { agentName, role: setup.role ?? undefined, ...(initiator ? { initiator } : {}) },
                AbortSignal.any([exec.signal, this.disposed.signal]),
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                'agent',
                initiator ? questionAgent.id : undefined,
              )
```

</details>

**依据 3 · 源码核查**：[src/host/index.ts:1397-1412](https://github.com/SuperWheel/dsh-cliworker-now/blob/debf4f1dfa6e9a027c9a3c3eddbe88b71b1606de/src/host/index.ts#L1397-L1412)

项目、账号和权限校验。

<details>
<summary>查看原文（16行）</summary>

```text
    this.assertExecution(agent, true)
    this.assertAccessSupported(agent, cliOf(preference), workerId ? this.runtime.get(agent.id, workerId).level : undefined)
    this.runtime.assertCliEnabled(cliOf(preference))
    if (this.accounts.isBusy(cliOf(preference)))
      throw new Error('此 CLI 正在管理账号，请先关闭账号终端再启动任务')
    const project = this.project(agent)
    const selectedProject = this.selectionProjects?.get(preference)
    if (!workerId && selectedProject && selectedProject !== project) throw new Error('项目已变更，请重新选择')
    // An existing task continues under the own account signed in now; a new task's
    // choice is authorized again under it when the account changed after the choice.
    const expected = workerId ? undefined : this.selectionBindings?.get(preference)
    const { binding, preference: authorizedPreference } = await this.authorizeChoice(
      preference,
      this.backend,
      this.options,
      project,
```

</details>

**依据 4 · 源码核查**：[src/host/runtime.ts:2729-2773](https://github.com/SuperWheel/dsh-cliworker-now/blob/debf4f1dfa6e9a027c9a3c3eddbe88b71b1606de/src/host/runtime.ts#L2729-L2773)

当前队列所有权、启动与交付记录。

<details>
<summary>查看原文（45行）</summary>

```text
      this.storage.bindAccount(worker.id, binding)
      if (task.queuedFollowupId && !task.priority && !task.delivered) {
        if (
          this.tasks.get(worker.id) !== task ||
          this.followups.list(worker.id).find((item) => item.id === task.queuedFollowupId)?.state !==
            'sending'
        )
          throw new UserStoppedError()
      }
      if (task.priority && !task.delivered) {
        const message = this.latestPriority.get(worker.id)
        if (!message || message.id !== task.queuedFollowupId || message.controller.signal.aborted)
          throw new UserStoppedError()
        // No await separates this ownership check from the native spawn attempt.
        message.spawnAttempted = true
      }
      task.spawnAttempted = true
      spawned = true
      handle = await spawnManagedAgent(this.backend, {
        argv: execution.argv,
        env: 'env' in execution ? execution.env : undefined,
        cwd: directory,
        stdio: { stdin: 'ignore', stdout: 'pipe', stderr: 'pipe' },
        graceMs: this.config.graceMs,
        signal: controller.signal,
      })
      if (task.queuedFollowupId && !task.priority && !task.delivered) {
        this.storage.append(worker, {
          kind: 'user',
          text: task.userPrompt,
          queuedFollowupId: task.queuedFollowupId,
          admittedRunId: worker.runId,
        })
        this.followups.remove(worker.id, task.queuedFollowupId)
        this.changed()
      }
      if (task.priority && !task.delivered) {
        const message = this.priorityHistory.get(worker.id)!.get(task.queuedFollowupId!)!
        this.updatePriority(worker, message, 'running')
      }
      task.delivered = true
      // Observe spawn rejection immediately even while draining protocol streams.
      void handle.done.catch(() => undefined)
      touchIdle?.()
      controller.signal.throwIfAborted()
```

</details>

#### 缺口

- 进程启动后失去宿主或外部 CLI 已写文件时的回执未实测
  **影响**：不能用队列删除推断最终任务结果
  **进一步探讨**：用空白目录制造终止并核对进程、事件和文件

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 替换原生界面和各 CLI 权限有哪些前提？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

补丁停用四个原生界面行并插入包内替代项，多个条目等待预检服务。预检核对资源清单、摘要、路径、宿主行和配置，成功才提供就绪，失败抛错。扩展影响会话界面，不只加一个面板。执行侧拒绝主线规划模式；未显式选择 Worker 权限时，对只读主会话的若干 CLI 也会拒绝，已有单独选档时会经过不同路径。作者说明部分 Worker 选档可高于主会话。不能把所有外部 CLI 进程笼统视为受同一个 DSH 沙箱策略约束，账号和服务商的数据路径也需独立核对。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-26](https://github.com/SuperWheel/dsh-cliworker-now/blob/debf4f1dfa6e9a027c9a3c3eddbe88b71b1606de/cordis.patch.yml#L1-L26)

预检依赖和四项界面替换。

<details>
<summary>查看原文（26行）</summary>

```text
- insert:
    - id: cliworker-native-preflight
      name: ./lib/native-runtime-guard/index.mjs
    - id: cliworker-ui-session
      name: ./runtime-host/dsh-client-ui-session/lib/index.js
      inject: [cliworkerNativeReady]
    - id: cliworker-ui-conversation
      name: ./runtime-host/dsh-client-ui-conversation/lib/index.js
      inject: [cliworkerNativeReady]
    - id: cliworker-ui-subagent
      name: ./runtime-host/dsh-client-ui-subagent/lib/index.js
      inject: [cliworkerNativeReady]
    - id: cliworker-ui-chat
      name: ./runtime-host/dsh-client-ui-chat/lib/index.js
      inject: [cliworkerNativeReady]
    - id: cliworker-now
      name: dsh-cliworker-now
      inject: [cliworkerNativeReady]
- id: ui-session
  disabled: true
- id: ui-conversation
  disabled: true
- id: ui-subagent
  disabled: true
- id: ui-chat
  disabled: true
```

</details>

**依据 2 · 源码核查**：[scripts/host-runtime.mjs:24-55](https://github.com/SuperWheel/dsh-cliworker-now/blob/debf4f1dfa6e9a027c9a3c3eddbe88b71b1606de/scripts/host-runtime.mjs#L24-L55)

资源清单、路径及摘要验证。

<details>
<summary>查看原文（32行）</summary>

```text
export function verifyHostRuntime(root, { sourcePatch = true, directory = join(root, hostRuntimeDirectory) } = {}) {
  const manifest = JSON.parse(readFileSync(join(directory, 'manifest.json'), 'utf8'))
  if (manifest.schema !== 1 || manifest.packages?.length !== 4 || manifest.patch?.path !== 'source.patch' || !Array.isArray(manifest.files) || manifest.files.length > 500)
    throw new Error('CLI Worker native interface: invalid-runtime-manifest')
  const files = runtimeFiles(directory).filter(path => path !== 'manifest.json')
  if (JSON.stringify(files) !== JSON.stringify(manifest.files.map(file => file.path)))
    throw new Error('CLI Worker native interface: runtime-inventory-mismatch')
  const actualRoot = realpathSync(directory)
  for (const file of manifest.files) {
    if (typeof file.path !== 'string' || isAbsolute(file.path) || file.path.split(/[\\/]/).some(part => part === '..'))
      throw new Error('CLI Worker native interface: invalid-runtime-path')
    const path = join(directory, file.path)
    const rel = relative(actualRoot, realpathSync(path))
    if (rel === '..' || rel.startsWith(`..${sep}`) || !lstatSync(path).isFile())
      throw new Error('CLI Worker native interface: escaping-runtime-resource')
    const bytes = readFileSync(path)
    if (bytes.length !== file.bytes || digest(bytes) !== file.sha256)
      throw new Error('CLI Worker native interface: runtime-content-mismatch')
    if (/\.(?:js|json|map|md|patch|ts)$/u.test(file.path) && /(?:\/Users\/|\/home\/|[A-Z]:\\Users\\)/iu.test(bytes.toString('utf8')))
      throw new Error('CLI Worker native interface: private-runtime-path')
  }
  for (const id of hostRuntimePackages) {
    const pkg = manifest.packages.find(pkg => pkg.id === id)
    if (!pkg || pkg.name !== `@deepseek-ai/dsh-client-${id}` || pkg.directory !== `dsh-client-${id}`)
      throw new Error('CLI Worker native interface: invalid-runtime-package')
    const json = JSON.parse(readFileSync(join(directory, pkg.directory, 'package.json'), 'utf8'))
    if (json.name !== pkg.name || json.version !== pkg.version || json.dsh?.client?.platform !== 'web' ||
        json.exports?.['./client']?.default !== './lib/client.js' || json.scripts || json.devDependencies)
      throw new Error(`CLI Worker native interface: invalid-package-contract (${id})`)
  }
  if (digest(readFileSync(join(directory, manifest.patch.path))) !== manifest.patch.sha256)
    throw new Error('CLI Worker native interface: source-patch-mismatch')
```

</details>

**依据 3 · 源码核查**：[scripts/host-extension-guard.mjs:143-168](https://github.com/SuperWheel/dsh-cliworker-now/blob/debf4f1dfa6e9a027c9a3c3eddbe88b71b1606de/scripts/host-extension-guard.mjs#L143-L168)

预检通过才发布服务。

<details>
<summary>查看原文（26行）</summary>

```text
export async function apply(ctx) {
  const directory = dirname(fileURLToPath(import.meta.url))
  const root = resolve(directory, basename(directory) === 'native-runtime-guard' ? '../..' : '..')
  try {
    verifyHostRuntime(root, { sourcePatch: false })
    const profile = ctx.profileContext
    let patches = []
    if (profile) {
      const require = createRequire(profile.installAnchor)
      const { loadOptionalPatches } = require(require.resolve('@deepseek-ai/dsh-app-boot'))
      if (typeof loadOptionalPatches !== 'function') fail('missing-profile-patch-interface')
      patches = [profile.patchPath, join(profile.home, 'cordis.patch.yml')]
        .flatMap(path => loadOptionalPatches('CLI Worker', path) ?? [])
        .concat(profile.overlays ?? [])
    }
    inspectHostRuntimeEntries(ctx.loader.entries(), ctx.loader.root.data, patches, root)
    const require = createRequire(profile.installAnchor)
    const [{ resolveConfig }, { interpolate }] = await Promise.all([
      import(pathToFileURL(require.resolve('@deepseek-ai/cordis')).href),
      import(pathToFileURL(require.resolve('@deepseek-ai/cordis-plugin-loader')).href),
    ])
    ctx.effect(() => installHostSettingsAliases(ctx, { resolveConfig, interpolate }, root))
    ctx.provide(readyService, Object.freeze({ verified: true }))
  } catch (error) {
    if (error instanceof Error && error.message.startsWith(prefix)) throw error
    fail('runtime-verification-failed')
```

</details>

**依据 4 · 源码核查**：[src/host/index.ts:814-847](https://github.com/SuperWheel/dsh-cliworker-now/blob/debf4f1dfa6e9a027c9a3c3eddbe88b71b1606de/src/host/index.ts#L814-L847)

规划、默认权限及 CLI 特例。

<details>
<summary>查看原文（34行）</summary>

```text
  private assertExecution(agent: Agent, dispatch = false): void {
    if (agent.session.header.origin === 'subagent') throw new Error('MVP 只支持主对话下的直接 CLI 子 Agent')
    if (agent.ctx.get('planMode')?.get(agent).active)
      throw new Error('请先退出 Harness 规划模式，再运行外部 CLI；本插件不会绕过规划边界')
    if (!dispatch && agent.ctx.get('sandboxPolicy')!.resolve({ session: agent.session }).mode === 'read-only')
      throw new Error('Harness 当前为只读权限；此操作会写入项目或账号状态，请先明确切换项目权限')
  }
  /**
   * Under 仅可查看 a Worker without its own level runs at its first item: the
   * CLI's native ask mode, or Pi's tool_call gate. A CLI whose first item
   * cannot ask before a change is refused rather than silently weakened: agy's
   * plan launch keeps its terminal sandbox state writable, Kimi's default
   * auto-approves Git workspace edits, and Hermes offers no first item. A level
   * the user picked in the Worker menu runs as picked.
   */
  private assertAccessSupported(agent: Agent, cli: CliId, level: WorkerLevel | undefined): void {
    if (level !== undefined || this.permissionState(agent).sandbox !== 'read-only') return
    if (cli === 'antigravity')
      throw new Error('Harness 当前为仅可查看；Antigravity 无法把授权请求转给你，请切换权限预设或改用其他 CLI')
    if (cli === 'hermes')
      throw new Error('Harness 当前为仅可查看；Hermes 没有可询问的档位，请切换权限预设或改用其他 CLI')
    if (!runsUnderViewOnly(cli))
      throw new Error('Harness 当前为仅可查看；Kimi 的第一项会自动批准 Git 仓库内的编辑，请切换权限预设或改用其他 CLI')
  }
  /** The child session's DSH sandbox and approval policy for a Worker's plan switch and level. */
  private childPermission(parent: Agent, worker: Pick<Worker, 'mode' | 'level'>): Pick<PermissionState, 'sandbox' | 'approval'> {
    const state = this.permissionState(parent)
    const sandbox = runAccess(worker.mode, worker.level, state)
    return { sandbox, approval: workerApproval(sandbox, state) }
  }
  /** The tier this turn actually runs with, for the main Agent's dispatch/follow-up receipt. */
  private permissionReceipt(parent: Agent, worker: Pick<Worker, 'preference' | 'mode' | 'level'>) {
    const receipt = workerPermissionReceipt(cliOf(worker.preference), worker.mode, worker.level, this.permissionState(parent))
    return { permission: { level: receipt.level, name: receipt.name, source: receipt.source }, permissionSummary: receipt.summary }
```

</details>

**依据 5 · 作者声明**：[README.md:184-196](https://github.com/SuperWheel/dsh-cliworker-now/blob/debf4f1dfa6e9a027c9a3c3eddbe88b71b1606de/README.md#L184-L196)

作者区分原生权限与用户选档。

<details>
<summary>查看原文（13行）</summary>

```text
## 权限与数据

- **按明确选择执行**：CLI 缺失或失败不会换用其他 CLI；不接管插件外启动的 CLI。
- **Worker 权限三档**：子会话的权限菜单（`/permission`）列出该 CLI 的三档，每轮以 CLI 自己的原生模式运行，不附加系统沙箱：
  - **第一项（多数 CLI 叫「询问」）**：读取和只读命令直接执行，改文件和有副作用的命令先问你，拒绝就不改；OpenCode/MiMo 无法区分只读命令，所有命令都先问。做不到「改动先问」的 CLI 按实际行为命名：Kimi 叫「仅工作区编辑」（工作目录是 Git 仓库时，仓库内的编辑由 Kimi 自动批准，其余先问）；Antigravity 叫「仅规划」（ACP 未确认规划模式，保留 stream 原生规划）；Hermes 没有这一档；TRAE CN 用原生只读沙箱加按需审批（`approvals_reviewer="user"`）实现「询问」，改动需审批；Windows 上只读命令也会询问。Pi 没有原生审批，插件每轮给 Pi 加载一个私有扩展，用 Pi 官方的工具拦截和确认接口先问你，读文件不问。
  - **中档「自动审批」**：使用 CLI 原生的自动审批（Codex `auto_review`、Claude Code `auto`、Kimi `yolo`、Qoder `auto`、Grok 自动审核、Hermes `smart`、Antigravity ACP 在终端沙箱内跳过确认，主机没有终端沙箱时逐条确认（旧版 `--mode auto`）、MiMo `skip-all`），由 CLI 自行判断放行，可能放行工作区外的操作；它仍要确认的请求会问你。没有原生自动审批的 CLI 用原生编辑模式：ZCode（`edit`）和 OpenCode 叫「仅工作区编辑」，OMP（`write`）和 Pi 叫「自动批准编辑」，编辑自动批准、命令仍先问你，二者都不限制编辑目录。TRAE CN 的中档「仅工作区编辑」使用 `default`，工作区内改动和命令自动批准，工作区外请求转 DSH，不使用原生 `auto`。
  - **完全权限**：使用 CLI 原生的免确认/完全访问模式（Codex `danger-full-access`、Claude Code `bypassPermissions`、Kimi ACP `auto`、Qoder `bypass_permissions`/`yolo`、ZCode `yolo`、Grok `--always-approve`、Hermes 关闭审批、Antigravity 跳过确认并关闭终端沙箱、OMP `yolo`、OpenCode/MiMo 全部工具允许、Pi 开放原生命令、TRAE CN `bypass_permissions`），不再询问。**此档下 CLI 可以不经确认执行命令、修改工作区外的文件和访问网络，请只在信任该任务时使用。**
  - **你选的档位优先**：菜单一直列出该 CLI 的全部档位。没选过的 Worker 跟随主对话（仅可查看 → 第一项；工作区内修改 → 中档；完全权限 → 完全权限）；你选过档位后，该 Worker 的每一轮——包括主 Agent 派遣和续聊——都按你选的档位运行，可以高于主对话，主 Agent 不再另外询问。选择完全权限仍会弹出 DSH 的确认。主对话为「仅可查看」时，没选过档位的 Antigravity、Hermes 和 Kimi 拒绝派遣。运行中改动主对话权限，对跟随主对话的 Worker 从下一轮生效，本轮的授权请求按当时的主对话权限判定。
  - **规划模式与档位分开**：`/plan` 或规划标记只开关原生规划模式，退出规划后档位不变；Hermes、Qoder、Qoder CN 没有规划模式。
  - **原生模式不可用时降级**：安装的 CLI 版本没有目标模式，或设置后回读不一致时，按更严一档运行并在时间线说明（如「本轮按询问运行」）；第一项也无法确认时拒绝启动，绝不改用更宽的模式。Antigravity 需要 **agy 1.4.11 及以上且实际帮助确认 `acp --stdio`** 才使用 ACP；探测失败、旧版或仅规划使用 stream。ACP 进程和会话目录均为项目，工具桥经 `mcpServers` 注入，不添加私有工作区；用户项目额外工作区仍可能影响原生命令默认目录。ACP 不报告沙箱状态，自动档每轮先以 stream 入口零输入启动一次，读取 agy 自己在输入前报告的原因（与 stream 降级同一依据）：确认主机有终端沙箱时以 `--sandbox --dangerously-skip-permissions` 运行，与原先 Mac 自动审批一致；报告没有终端沙箱（如 Windows 11 23H2）或无法确认时不跳过确认，实际权限请求逐条经 DSH「允许一次／拒绝」，无会话授权。工作区编辑是否请求确认由 agy 决定：Windows 实测中，项目内写文件没有请求确认，只有命令请求了确认。完全权限关闭终端沙箱并跳过确认。模型及强度以原生目录设置并回读；旧会话先尝试 ACP load，不兼容时保留同一 ID 走 stream，绝不静默新建。stream 无沙箱后备没有可用的命令审批通道，提示命令可能被拒；`denied_actions` 为待核实，`finished_reason` 为部分结束失败。ACP 取消、超时仍须确认进程范围退出；usage 记为本轮。真实 MCP 加载与调用、续聊及停止验收见 `openspec/changes/migrate-agy-acp/tasks.md`。
  - **授权请求交给 DSH**：Harness 处于规划模式时一律拒绝；Worker 为完全权限时自动放行（主对话也是完全权限时按它的审批策略）；中档且主对话「从不询问」时拒绝；其余情况询问你。
  - **Codex Computer Use 应用授权**：已核实的 `cua_repl` 空表单应用授权（如「Allow Codex to use DeepSeek Harness?」）也按上述档位转交 DSH，规划模式拒绝，完全权限按现有规则自动放行。仅原生请求明确支持时提供「本会话始终允许」，不发送永久授权、不由插件缓存；拒绝后 Codex 正常结束仍为「已完成」，时间线保留拒绝记录。需要填写内容的表单、URL 登录及未知 elicitation 仍不支持并判失败。当前已覆盖模拟回归，Windows 真实请求帧及 DSH 审批往返尚未验证。
  - 主 Agent 派出的任务（`cliworker_start` / `cliworker_followup`）在主对话页弹出授权问题；你在子会话中续聊、排队或重新运行的轮次在该子会话中审批，任务卡显示「等待审批」。CLI 原生提供会话级授权（Codex、Claude Code、Kimi、Qoder、Hermes）时，主对话页另有「本会话始终允许」，由 CLI 自己记住；子会话审批面板只有允许一次 / 拒绝。Worker 经 DSH 备选工具（例如备选命令工具申请更宽的沙箱）请求审批时按同样规则询问，只有允许一次 / 拒绝。无人应答或任务停止时按拒绝处理。
```

</details>

**依据 6 · 作者声明**：[README.md:207-209](https://github.com/SuperWheel/dsh-cliworker-now/blob/debf4f1dfa6e9a027c9a3c3eddbe88b71b1606de/README.md#L207-L209)

作者说明本机记录与供应商请求。

```text
- **任务时限**：「CLI Worker 设置 → 任务时限」可设总时限（默认 30 分钟，可选 1–8 小时或不限制，最长 24 小时）与空闲时限（默认不启用，可选 5/10/30 分钟：CLI 连续这么久没有任何回复、工具或思考事件才停止；等待你回答授权期间不计，包括 DSH 备选工具的授权）。每个任务开始时确定截止时间，运行中修改只影响之后的任务；超时后等 CLI 进程全部退出才标记为中断，并说明是总时限还是空闲时限。此前在插件配置文件里设置的 `timeoutMs` 作为总时限的默认值。
- **界面语言**：「CLI Worker 设置 → 语言」可选跟随 DSH（默认）、中文或 English，保存后所有已打开的 CLI Worker 面板立即切换，不需要重载。CLI 输出、模型名、用户内容和未收录的 Host 错误保持原文；给主 Agent 的工具说明不随界面语言变化。
- **数据在本机**：记录保存在 `~/.dsh/cliworker-now`（目录 `0700`、文件 `0600`）。CLI 仍会按自己的配置向服务商发送模型请求。
```

#### 缺口

- 真实宿主兼容和不同 CLI 的权限执行未覆盖
  **影响**：一套权限设置不能代表每个执行器
  **进一步探讨**：逐个固定 CLI 与宿主版本，试拒绝和项目外写入

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪种小任务能检验派遣价值及退出？

**研究主题**：效果与总成本、采用判断

#### 完整回答

仅已有一个可核权限的 CLI、能复制 DSH profile 的开发者适合先观察一个无写入分析任务。保存未发送草稿，使用脱敏仓库，核对 Worker 的实际权限回执、工作目录和结果。对照手工启动同 CLI，计供应商请求、人工切换、登录管理和结果复核。若预检不通过、权限高于预期或无法证明子进程结束，停下并在操作系统查看进程与文件，再从 profile 移除扩展或恢复原配置。缺少实机证据不宜部署为日常默认。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:84-98](https://github.com/SuperWheel/dsh-cliworker-now/blob/debf4f1dfa6e9a027c9a3c3eddbe88b71b1606de/README.md#L84-L98)

作者给出重启、卸载与热切换边界。

<details>
<summary>查看原文（15行）</summary>

````text
## 安装与更新

先结束活动任务并完全退出 Harness，再执行：

```sh
dsh plugin --profile desktop add dsh-cliworker-now@latest
```

完成后重新打开 Harness。`dsh` 命令可在 Desktop 菜单“管理 dsh 命令…”中启用。Web profile 把 `desktop` 换成 `web`；也可以在插件页“添加插件”中输入 `dsh-cliworker-now@latest`。

- 启动 Harness 不会自动更新插件。pnpm 11 默认等待新版本发布满 24 小时，期间可能仍装到旧版，可用 `dsh plugin --profile desktop ls dsh-cliworker-now --depth=0` 核对。
- 备用安装包：`dsh plugin --profile desktop add https://github.com/SuperWheel/dsh-cliworker-now/releases/download/v0.8.9/dsh-cliworker-now-0.8.9.tgz`，每个 Release 附 `SHA256SUMS.txt`。
- 安装包自带原生子对话所需的界面扩展，无需手工构建宿主；卸载插件即恢复官方界面。与已有界面覆盖冲突时启动预检会明确拒绝，不改动你的配置，详见 [runtime-host](runtime-host/README.md)。
- 页面打开时启用或停用此插件，DSH 会热替换原生会话界面，页面可能空白约 1 秒，插件随后让 DSH 重新挂载界面原地恢复（输入框中未发送的内容可能丢失）。无法原地恢复时，网页会刷新一次；DSH Desktop 会提示完全退出后重新打开。旧版 dshmarket（如 1.70.1）热切换失败可能留下不一致的配置，这种情况仍需完全重启，详见 [白屏调查及验证边界](doc/blank-toggle-investigation.md) 与 [dsh-market/dsh-market#1010](https://github.com/dsh-market/dsh-market/issues/1010)。聊天展示和忙时 Enter 等原生偏好仍保存在原设置项中。
- 卸载：`dsh plugin --profile desktop remove dsh-cliworker-now`，保留本机账号、历史会话和偏好。
````

</details>

**依据 2 · 源码核查**：[src/host/index.ts:838-847](https://github.com/SuperWheel/dsh-cliworker-now/blob/debf4f1dfa6e9a027c9a3c3eddbe88b71b1606de/src/host/index.ts#L838-L847)

实际权限回执来源。

<details>
<summary>查看原文（10行）</summary>

```text
  /** The child session's DSH sandbox and approval policy for a Worker's plan switch and level. */
  private childPermission(parent: Agent, worker: Pick<Worker, 'mode' | 'level'>): Pick<PermissionState, 'sandbox' | 'approval'> {
    const state = this.permissionState(parent)
    const sandbox = runAccess(worker.mode, worker.level, state)
    return { sandbox, approval: workerApproval(sandbox, state) }
  }
  /** The tier this turn actually runs with, for the main Agent's dispatch/follow-up receipt. */
  private permissionReceipt(parent: Agent, worker: Pick<Worker, 'preference' | 'mode' | 'level'>) {
    const receipt = workerPermissionReceipt(cliOf(worker.preference), worker.mode, worker.level, this.permissionState(parent))
    return { permission: { level: receipt.level, name: receipt.name, source: receipt.source }, permissionSummary: receipt.summary }
```

</details>

**依据 3 · 源码核查**：[src/host/runtime.ts:2747-2773](https://github.com/SuperWheel/dsh-cliworker-now/blob/debf4f1dfa6e9a027c9a3c3eddbe88b71b1606de/src/host/runtime.ts#L2747-L2773)

外部进程与交付状态。

<details>
<summary>查看原文（27行）</summary>

```text
      handle = await spawnManagedAgent(this.backend, {
        argv: execution.argv,
        env: 'env' in execution ? execution.env : undefined,
        cwd: directory,
        stdio: { stdin: 'ignore', stdout: 'pipe', stderr: 'pipe' },
        graceMs: this.config.graceMs,
        signal: controller.signal,
      })
      if (task.queuedFollowupId && !task.priority && !task.delivered) {
        this.storage.append(worker, {
          kind: 'user',
          text: task.userPrompt,
          queuedFollowupId: task.queuedFollowupId,
          admittedRunId: worker.runId,
        })
        this.followups.remove(worker.id, task.queuedFollowupId)
        this.changed()
      }
      if (task.priority && !task.delivered) {
        const message = this.priorityHistory.get(worker.id)!.get(task.queuedFollowupId!)!
        this.updatePriority(worker, message, 'running')
      }
      task.delivered = true
      // Observe spawn rejection immediately even while draining protocol streams.
      void handle.done.catch(() => undefined)
      touchIdle?.()
      controller.signal.throwIfAborted()
```

</details>

#### 缺口

- 固定宿主和单个 CLI 的净耗时与停止回收未测
  **影响**：无法给出日常替代建议
  **进一步探讨**：对同题记录 CLI 进程、权限、结果与人工介入

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 把进程接收与任务完成分开提示能否减少误重试？

**研究主题**：新假设与验证

#### 完整回答

可把启动、输入交给进程、远端运行结束和产物已验收分别显示，异常时显示需要回查的结果。与现有移除队列项和状态显示对照，在启动失败、进程已接收但退出和任务成功三个条件测误重试及恢复时间。若当前时间线已足够，或新状态无法对应真实 CLI 结果，便保留当前行为。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/runtime.ts:2745-2773](https://github.com/SuperWheel/dsh-cliworker-now/blob/debf4f1dfa6e9a027c9a3c3eddbe88b71b1606de/src/host/runtime.ts#L2745-L2773)

启动与队列消息消耗的边界。

<details>
<summary>查看原文（29行）</summary>

```text
      task.spawnAttempted = true
      spawned = true
      handle = await spawnManagedAgent(this.backend, {
        argv: execution.argv,
        env: 'env' in execution ? execution.env : undefined,
        cwd: directory,
        stdio: { stdin: 'ignore', stdout: 'pipe', stderr: 'pipe' },
        graceMs: this.config.graceMs,
        signal: controller.signal,
      })
      if (task.queuedFollowupId && !task.priority && !task.delivered) {
        this.storage.append(worker, {
          kind: 'user',
          text: task.userPrompt,
          queuedFollowupId: task.queuedFollowupId,
          admittedRunId: worker.runId,
        })
        this.followups.remove(worker.id, task.queuedFollowupId)
        this.changed()
      }
      if (task.priority && !task.delivered) {
        const message = this.priorityHistory.get(worker.id)!.get(task.queuedFollowupId!)!
        this.updatePriority(worker, message, 'running')
      }
      task.delivered = true
      // Observe spawn rejection immediately even while draining protocol streams.
      void handle.done.catch(() => undefined)
      touchIdle?.()
      controller.signal.throwIfAborted()
```

</details>

**依据 2 · 源码核查**：[src/host/index.ts:1664-1667](https://github.com/SuperWheel/dsh-cliworker-now/blob/debf4f1dfa6e9a027c9a3c3eddbe88b71b1606de/src/host/index.ts#L1664-L1667)

派遣回执有 worker 与权限。

```text
          defineTool({
            name: 'cliworker_start',
            description: `用户明确要求“调用 agy cli”或“用 glm cli 完成任务”时，调用本工具打开 CLI Worker 的选型流程。只需提供 CLI、任务标题和任务内容；模型、思考强度与角色由插件收集，完成选型前不会启动任务，不要把它们当作调用本工具的前置输入。${CLI_NAME_GUIDANCE}。泛称 qoder / WorkBuddy 在双版本均安装时先通过原生询问选择版本。Host 在首次选择模型、思考强度与角色，或同项目新对话确认是否沿用时提问；同对话后续不重复。不要提前自行提问或增加确认，不代答。返回后台 job、worker ID、agentName 与 permission（本轮实际权限档位；未选过档位的 Worker 跟随主对话权限预设），向用户说明权限时以 permission 为准，不要自行推断。主对话的直接子 Agent（包括 CLI Worker）可同级派遣，新 Worker 归属主对话并与发起者同级；发起者不提供模型、强度、角色或会话 ID，每个主对话最多 6 个未结束的子 Agent 派遣。主对话的已有智能体续聊用 cliworker_followup；除泛称 qoder / WorkBuddy 的双版本选择外，其他歧义返回简短候选错误，不启动、不额外发问题卡。`,
            parameters: {
```

#### 缺口

- 各 CLI 是否暴露相同输入接受与任务结果信号未知
  **影响**：状态可能只能对部分适配器成立
  **进一步探讨**：先用一个已核协议做可重复对照

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
