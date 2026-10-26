# DSH Orchestrator2

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[1c1a6c5](https://github.com/AngleZhang-ZhangJiao/dsh-orchestrator2/tree/1c1a6c5ad59d78ef5e3c5a3fe88613f6a9601377/plugins/dsh-orchestrator2)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AngleZhang-ZhangJiao/dsh-orchestrator2)
<!-- END META -->

> **实现功能**：提供自动开发调度预设，以任务包组织设计、开发、审查、预算与人工验收。

> **核心亮点**：将任务包、预算预登记、设计冻结和持久角色路由组合为可追溯协作流程，先绑定再启动减少路由竞争窗口。[Q03](#research-q03)

> **风险与缺陷**：派工成功回执要求后台参数false，但角色工具明确拒绝false；同时旧目录同步的实际副作用与移除声明冲突，需先核对。[Q04](#research-q04)

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
  - [Q01 · 什么项目值得接受六区任务包流程？](#detail-section-11)
  - [Q02 · 角色、门禁和状态如何连接？](#detail-section-12)
  - [Q03 · 相比直接多Agent派工有什么具体增量？](#detail-section-13)
  - [Q04 · 默认派工交接是否自洽？](#detail-section-14)
  - [Q05 · 加载与生效依赖如何验收？](#detail-section-15)
  - [Q06 · 任务包自动化减少的是哪类成本？](#detail-section-16)
  - [Q07 · 哪些机制可借鉴，可靠性还有什么边界？](#detail-section-17)
  - [Q08 · 如何降低流程文档与工具漂移？](#detail-section-18)
  - [Q09 · 当前适合直接试用还是先观察？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要把需求、设计、开发、审查和人工测试串成可追溯任务包的软件负责人。合格交付是有验收证据且人工测试通过的软件版本，不能把多Agent输出或状态文件完成当交付。相对普通Agent加任务清单，它要求采用v2.1六区结构、冻结设计、预算台账和角色分工；简单修改可能得不偿失。

比较基线为单Agent任务清单与直接角色派工；没有同任务真实完成率比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

|能力|主要用途|使用条件与边界|
|---|---|---|
|orchestrator2预设|组织任务包交付|需v2.1六区，提示与机器约束分开|
|角色派工|启动研究/开发/审核|后台限定，受路由与账号影响|
|dispatch系列|预算预登记、结束与悬空识别|需按协议调用，非跨进程事务|
|enter_auto_mode|检查准备后启动goal|依赖文件门禁与宿主服务|
|budget_status|聚合token|无现金口径，投影缺失降级|
|角色模型设置|临时/持久路由|主调度会话才能改|

#### 启动与依赖

|依赖或条件|是否必需|用途|缺失或不满足时|
|---|---|---|---|
|Node ^22.19.0或>=24与DSH预设/工具服务|启动必需|加载本地模块和goal|预设或工具失败|
|模型账号和角色路由|派工必需|研究/开发/审核|调用或降级失败|
|v2.1六区项目及开发准备|自动模式必需|状态与冻结核查|门禁拒绝|
|tokenUsage投影|token统计可选|预算视图|降级为次数台账|

#### 启动步骤

|步骤|执行者与动作|成功判据或失败处理|
|---|---|---|
|准备|负责人加载并dump-config核对|预设声明及模块可挂载|
|建档|调度员准备六区与任务包|开发准备和设计冻结通过|
|派工|调度员begin、角色工具、end|先纠正false参数冲突，核对台账|
|验收|用户完成真实人工测试|未通过则修复，不以状态文件代验收|

#### 成本

|阶段|现金与资源成本|人工与时间投入|已知条件与未知项|
|---|---|---|---|
|首次使用|多个模型账号，金额未知|六区迁移、路由和开发准备，耗时未知|现有流程需适配|
|持续使用|研究开发审查token，金额未知|任务包、证据和人工验收，耗时未知|次数不等于现金预算|
|失败恢复|可能重复调用，金额未知|检查锁/台账/child/goal，耗时未知|不能盲目重派|

#### 效果

|效果项|当前证据支持|尚不能确定|
|---|---|---|
|门禁|开发准备与预算校验代码存在|整流程不可绕过性|
|派工恢复|持久child路由及台账|中断重复执行率|
|业务交付|定义人工验收责任|相对单Agent合格率与成本|

> **思考**：派工成功回执要求后台参数false，但角色工具明确拒绝false；同时旧目录同步的实际副作用与移除声明冲突，需先核对。[Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将任务包、预算预登记、设计冻结和持久角色路由组合为可追溯协作流程，先绑定再启动减少路由竞争窗口。[Q03](#research-q03)

将任务包、预算预登记、设计冻结和持久角色路由组合为可追溯协作流程，先绑定再启动减少路由竞争窗口。[Q03](#research-q03)

可借鉴派工前身份和预算检查、先bindChild再启动及主子会话角色权限分离。dispatch_begin按先锁后台账并在写账失败时清锁处理局部失败，但用existsSync再普通writeFileSync，不是跨进程排他锁，不能外推强事务。固定树部分文档与实际执行矛盾，维护需要把回执、persona、生成patch和工具参数契约一起校验；作者报告的测试数没有在本轮复现。

<a id="detail-section-5"></a>

### 1.4 主要限制

派工成功回执要求后台参数false，但角色工具明确拒绝false；同时旧目录同步的实际副作用与移除声明冲突，需先核对。[Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议先观察并核对派工回执与角色参数，再做隔离任务包验收。适合愿意维护流程规范的负责人，不适合只需少量编辑或无法承担多模型与文档整理的人。先修正/规避false参数冲突，检查旧目录同步与退出，再用小任务验证人工测试硬停止、预算拒绝和中断恢复，未完成这些前不接管正式交付。 [Q09](#research-q09)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码级确认部分门禁与角色路由；默认交接存在静态参数冲突，未运行宿主或验证项目收益，未来假设未验证。

- 已检查：作者 README、包清单、源码路径 plugins/dsh-orchestrator2/lib/index.js、plugins/dsh-orchestrator2/presets/orchestrator2/role-tools.mjs、plugins/dsh-orchestrator2/presets/orchestrator2/dispatch.mjs、plugins/dsh-orchestrator2/presets/orchestrator2/phase-gate.mjs、plugins/dsh-orchestrator2/presets/orchestrator2/budget.mjs 及固定范围 inventory；组件：plugins/dsh-orchestrator2。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅plugins/dsh-orchestrator2组件，检查host、role-tools、dispatch、phase-gate和budget，不将同仓重复交付包计入研究范围；未核实作者测试数字。
- 下一步：先用最小任务包验证回执/工具参数一致性及启动目录副作用，再测预算拒绝、人工停止、中断恢复与总投入。

**分析版本**

- **仓库**：[AngleZhang-ZhangJiao/dsh-orchestrator2](https://github.com/AngleZhang-ZhangJiao/dsh-orchestrator2)
- **版本号**：2.10.3（[固定提交 1c1a6c5](https://github.com/AngleZhang-ZhangJiao/dsh-orchestrator2/tree/1c1a6c5ad59d78ef5e3c5a3fe88613f6a9601377)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把派工协议写成单一可执行状态契约，生成工具参数、成功回执及persona对应段，并在启动前做无副作用协议检查，能减少“回执要求工具拒绝参数”的交接失败。推导来自false参数冲突和旧目录同步漂移。最小验证固定最小任务包，在新旧API宿主mock和真实沙箱分别走begin→角色→end、失败与重启；比较人工修正次数、重复派工及完成率，若漂移仍需手工多处修改则否定单源收益。 [Q08](#research-q08)

先用最小任务包验证回执/工具参数一致性及启动目录副作用，再测预算拒绝、人工停止、中断恢复与总投入。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 1513 | — | — | 53340 |
| .js | source | 1 | 131 | 73 | 49 | — |
| .mjs | source | 7 | 2790 | 1923 | 678 | — |
| .md | test | 41 | 3059 | — | — | 57525 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/AngleZhang-ZhangJiao/dsh-orchestrator2/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：任务包、门禁和角色路由能否形成可恢复的软件交付流程，且其机器交接契约与实际副作用自洽？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么项目值得接受六区任务包流程？

**研究主题**：场景与需求

#### 完整回答

面向需要把需求、设计、开发、审查和人工测试串成可追溯任务包的软件负责人。合格交付是有验收证据且人工测试通过的软件版本，不能把多Agent输出或状态文件完成当交付。相对普通Agent加任务清单，它要求采用v2.1六区结构、冻结设计、预算台账和角色分工；简单修改可能得不偿失。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-orchestrator2/lib/index.js:42-43](https://github.com/AngleZhang-ZhangJiao/dsh-orchestrator2/blob/1c1a6c5ad59d78ef5e3c5a3fe88613f6a9601377/plugins/dsh-orchestrator2/lib/index.js#L42-L43)

提示宣告陈述三阶段、场景与规范依赖。

```text
/** Model-facing announcement: plugin presence, principle, requirements, limits. */
export const ORCHESTRATOR2_GUIDANCE = '本机已安装 dsh-orchestrator2 插件（自动开发调度器2.0 agent preset v2.10.3）：新建会话的预设选择器中可选「自动开发调度器2.0」。原理：三阶段——设计阶段（交互态：聊需求→并行研究员调研→设计方案→设计决策清点 grill-me 开场问档→原型→定稿）→ 开发阶段（goal 驱动、任务包串行、授权合并——设计定稿确认时选「确认即开工」即完成开发授权：任务包生成后调度器自动核查前置、激活首包并 enter_auto_mode 建立 ≤24 工作轮的推进 goal，调度引擎后台派工+看门狗轮内 tick 值班驱动 审核员计划审核→开发员执行自测→审核员审查（AC 证据核验+代码审查一次完成）→调度员构建，五态流水线推进到「待人工测试」硬停止；每次人工测试通过自动核查放行下一包，无需重复授权；异常硬停、随时可喊停；用户主动说「开始自动推进」属等效授权）→ 验收阶段（修复循环含审核员修复审查）。v2.1 新增两场景：修改已有系统（现状研究中+目标代码区）与技术调研储备（独立终态，不进开发）。任务包改动点带『消费/产出』接口契约行，计划审核含跨改动点冲突扫描（只扫确实共享的组合），派工材料分层（prompt 五要素、权威材料入库）。四角色：调度员（会话自身；默认模型走文档推荐——新建会话时自选 kimi-coding/k3 + max，预设层不声明会话模型）、研究员（subagent_researcher，钉 deepseek-official/deepseek-flash + max）、开发员（subagent_developer，钉 deepseek-official/deepseek-flash + max）、审核员（subagent_reviewer，钉 volcengine/glm-5.3，不声明 reasoningEffort，档位走 provider 默认值）；研究员/开发员另钉 reasoningEffort（均为 max）；**会话内可临时改三角色模型**（默认仅当次主会话生效，明确指定「默认/降级」槽位才持久保存；遇 429/限流或已确认可恢复的额度错误自动降级到该角色降级模型并在本会话保持，不自动回切）：设置工具 set_role_model / reset_role_model / inspect_role_models，持久路由文件 `<DSH_HOME>/orchestrator2/model-routes.json`、会话状态 `sessions/<主会话ID>.json`；预算按包分档三硬上限（小包 4/6/24、大包 8/8/48，派工即计次）+ budget_status token 用量纯统计（无费用概念）；ponytail 最小实现纪律。前提：被驱动项目须为规范 v2.1 六区结构（00-项目管理/01-设计/02-代码/03-开发协同/04-测试/05-交付 + 90-历史归档），规范与模板随预设 spec/ 目录提供，可由调度员初始化 v2.1 脚手架；v2.0 规范项目可先升级脚手架再使用，v1.1 规范项目请改用「自动开发调度器」（1.0）预设，同一项目不混用两个预设。0.1.7 起预设走声明式机制：包内 presets/agent-preset.patch.yml 在启动时把 preset-orchestrator2 声明进组合树（~/.dsh/.agent-presets 旧目录同步机制已移除，更新后重启前先用 web --dump-config 做组合树体检），升级插件时自动生效。用户提到「自动开发调度器2.0 / orchestrator2」时即指本插件，请据此协作。'
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 角色、门禁和状态如何连接？

**研究主题**：功能与机制

#### 完整回答

包同时声明host插件及preset patch；预设中角色工具在主会话校验后读取持久与会话路由，先持久bindChild再调用startActivation或兼容startContinuable。dispatch_begin单独登记预算与锁，角色返回后dispatch_end回填台账；enter_auto_mode检查规范、开发准备和设计冻结后交给goal/compaction服务。它是若干工具和persona的协作协议，不是单一自动执行引擎保证所有步骤不可绕过。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-orchestrator2/presets/orchestrator2/role-tools.mjs:143-202](https://github.com/AngleZhang-ZhangJiao/dsh-orchestrator2/blob/1c1a6c5ad59d78ef5e3c5a3fe88613f6a9601377/plugins/dsh-orchestrator2/presets/orchestrator2/role-tools.mjs#L143-L202)

先绑定再派工、双API以及主会话限制。

<details>
<summary>查看原文（60行）</summary>

```text
export function registerRoleDispatchTools(ctx, options = {}) {
  const disposers = []
  for (const [role, toolName] of Object.entries(ROLE_TOOLS)) {
    disposers.push(ctx.tools.register({
      name: toolName,
      description: `Delegate a self-contained task to a ${role} subagent（三角色派工工具，路由每次派工现读：持久默认/降级 + 本会话覆盖；自动降级由本插件 hook 承担）。It runs in the background and returns a subagent id you can continue with \`send_message\`. 首版固定 continuable 后台派工。`,
      parameters: roleToolParameters(role, toolName),
      output: {
        schema: CONTINUABLE_OUTPUT,
        render: (_args, value) => [{ type: 'text', text: `started subagent ${value.subagentId}` }],
      },
      isConcurrencySafe: () => true,
      async execute(args, exec) {
        const parent = exec.agent
        const sessionId = assertMainScheduler(parent, toolName)
        if (args?.run_in_background === false) {
          throw new Error(`${toolName}：首版仅支持后台 continuable 派工（run_in_background 缺省 true）`)
        }
        const subagents = ctx.subagents
        const startApi = resolveStartApi(subagents)
        const home = options.home ?? resolveDshHome()
        const snapshot = resolveDispatchSnapshot(role, sessionId, home)
        const childId = randomUUID()
        // 绑定先于首次 request：startActivation 之前写入快照，消除竞争窗口（AC16）。
        await bindChild(childId, {
          parentId: sessionId,
          role,
          epoch: snapshot.epoch,
          primaryRoute: snapshot.route,
          fallbackRoute: snapshot.fallbackRoute,
          appliedRoute: snapshot.route,
          degraded: false,
        }, { home, sessionId })
        const maxDepth = typeof subagents.resolveMaxDepth === 'function' ? subagents.resolveMaxDepth(undefined) : undefined
        const request = {
          prompt: [{ type: 'text', text: args.prompt }],
          parent,
          agentOptions: routeToAgentOptions(snapshot.route),
          ...maxDepth === undefined ? {} : { maxDepth },
        }
        // TP2 · D1：双 API shim——startActivation 走现行 2.10.2 调用形态（request 无 label、
        // 顶层 delivery:'parent'）；startContinuable 按宿主 0.2.0 旧契约（request 拥有 label、
        // 顶层无 delivery——v2.10.1 生产形态）。返回契约两路一致。
        const started = startApi.name === 'startContinuable'
          ? await subagents.startContinuable({
              provider: SPAWN_PROVIDER,
              label: args.description,
              childId,
              request: { label: args.description, ...request },
              signal: exec.signal,
            })
          : await subagents.startActivation({
              provider: SPAWN_PROVIDER,
              label: args.description,
              childId,
              request,
              signal: exec.signal,
              delivery: 'parent',
            })
        return { kind: 'continuable', subagentId: started.childId }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比直接多Agent派工有什么具体增量？

**研究主题**：贡献与相对优势

#### 完整回答

贡献在于任务包证据、显式预算预登记、设计冻结和角色路由快照的组合。先绑定再启动减少首次请求缺失路由归属的竞争窗口；可观测的悬空派工比口头“已启动”更利于恢复。子代理和goal来自宿主；persona大量流程约束是提示要求，不能全部算成机器强约束，未核实真实项目交付率。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-orchestrator2/presets/orchestrator2/dispatch.mjs:418-456](https://github.com/AngleZhang-ZhangJiao/dsh-orchestrator2/blob/1c1a6c5ad59d78ef5e3c5a3fe88613f6a9601377/plugins/dsh-orchestrator2/presets/orchestrator2/dispatch.mjs#L418-L456)

状态、锁、账本身份及派工前预算核查。

<details>
<summary>查看原文（39行）</summary>

```text
export function dispatchBegin(rootDir, taskDirInput, 环节, 角色, 模型 = '—') {
  const taskDir = resolveTaskDir(rootDir, taskDirInput)
  if (taskDir === undefined) return result(false, '参数 taskDir 不能为空。')
  if (typeof 环节 !== 'string' || 环节.trim().length === 0) return result(false, '参数「环节」不能为空。')
  if (typeof 角色 !== 'string' || 角色.trim().length === 0) return result(false, '参数「角色」不能为空。')

  const statusPath = join(taskDir, '状态.md')
  const header = fixedBlockOf(statusPath)
  if (header === undefined) {
    return result(false, `状态.md 固定块不可解析或文件缺失（${statusPath}）：fail-closed 拒绝派工（不写锁、不记台账）。`)
  }
  const phase = header.get('当前阶段')
  if (phase === undefined) {
    return result(false, `状态.md 固定块缺少「当前阶段」字段（${statusPath}）：fail-closed 拒绝派工。`)
  }

  const lock = lockPath(taskDir)
  if (existsSync(lock)) {
    return result(false, `已有在跑环节：${lock} 存在（内容：${readFileSync(lock, 'utf8').trim().split('\n').join('；')}）。同一任务目录不得并发派工——请等该环节返回后 dispatch_end，或按失败与中断路径清残留锁（mtime > 30 分钟或对应子代理已不活跃）。`)
  }

  const ledgerPath = join(taskDir, '预算台账.md')
  const ledger = readLedger(ledgerPath)
  if (!ledger.ok) return result(false, ledger.message)

  // D1 · 账本身份防串档：身份行存在且与任务目录不符 → 拒绝派工。
  if (ledger.identity !== undefined) {
    const rel = relTaskPath(rootDir, taskDir)
    if (ledger.identity.taskId !== basename(taskDir) || ledger.identity.repoRelativeTaskPath !== rel) {
      return result(false, `账本身份不符（防串档）：台账登记的是「${ledger.identity.taskId} | ${ledger.identity.repoRelativeTaskPath}」，本次派工任务目录是「${basename(taskDir)} | ${rel}」。拒绝派工——请人工核对 ${ledgerPath} 是否放错任务目录。`)
    }
  }

  const counter = ROLE_TO_COUNTER[角色.trim()]
  const useds = { ...ledger.useds }
  const caps = ledger.caps
  // 预算派工前拒绝：先算「本次派工后」的用量，超上限即拒绝（不写锁、不记账）
  const planned = {
    c: useds.c + (counter === 'c' ? 1 : 0),
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 默认派工交接是否自洽？

**研究主题**：缺陷与关键质疑

#### 完整回答

存在明确的静态契约冲突。dispatchBegin成功回执要求下一步run_in_background:false调用角色，而角色工具execute在该值为false时直接抛错，只支持后台派工。因此照机器回执执行不能完成正常派工。另README/提示称旧预设同步已移除，但host apply仍调用syncPreset复制并删除.dsh/.agent-presets/orchestrator2内的文件；这扩大实际更新/退出副作用。尚未真实宿主复现，不把冲突泛化成全部流程不可用。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-orchestrator2/presets/orchestrator2/dispatch.mjs:507-515](https://github.com/AngleZhang-ZhangJiao/dsh-orchestrator2/blob/1c1a6c5ad59d78ef5e3c5a3fe88613f6a9601377/plugins/dsh-orchestrator2/presets/orchestrator2/dispatch.mjs#L507-L515)

成功回执明确要求false，与role-tools的拒绝条件冲突。

```text
  try {
    writeFileSync(ledgerPath, nextText, 'utf8')
  } catch (error) {
    try { rmSync(lock, { force: true }) } catch { /* 回滚尽力而为 */ }
    return result(false, `台账预登记失败（${ledgerPath}）：${renderThrown(error)}；已回滚锁文件。`)
  }
  return result(
    true,
    `已派工并预登记：runId=${runId}｜环节=${环节.trim()}｜角色=${角色.trim()}｜派工后累计 C=${planned.c}/${caps.c} B=${planned.b}/${caps.b} 工作轮=${planned.r}/${caps.r}${upgraded ? '｜台账已惰性升级 schema v2（v1 原文已备份）' : ''}。下一步用 run_in_background:false 调 ${角色.trim()}；子代理返回后调 dispatch_end(taskDir, runId, 结论, 结果态?)。`,
```

**依据 2 · 源码核查**：[plugins/dsh-orchestrator2/presets/orchestrator2/role-tools.mjs:155-160](https://github.com/AngleZhang-ZhangJiao/dsh-orchestrator2/blob/1c1a6c5ad59d78ef5e3c5a3fe88613f6a9601377/plugins/dsh-orchestrator2/presets/orchestrator2/role-tools.mjs#L155-L160)

false参数被明确拒绝。

```text
      async execute(args, exec) {
        const parent = exec.agent
        const sessionId = assertMainScheduler(parent, toolName)
        if (args?.run_in_background === false) {
          throw new Error(`${toolName}：首版仅支持后台 continuable 派工（run_in_background 缺省 true）`)
        }
```

**依据 3 · 源码核查**：[plugins/dsh-orchestrator2/lib/index.js:114-124](https://github.com/AngleZhang-ZhangJiao/dsh-orchestrator2/blob/1c1a6c5ad59d78ef5e3c5a3fe88613f6a9601377/plugins/dsh-orchestrator2/lib/index.js#L114-L124)

运行入口仍同步旧目录，不是仅有死代码。

<details>
<summary>查看原文（11行）</summary>

```text
export function apply(ctx) {
  try {
    const targetRoot = join(dshHome(), '.agent-presets')
    mkdirSync(targetRoot, { recursive: true })
    const result = syncPreset(bundledPresetDir(), join(targetRoot, 'orchestrator2'))
    if (result.copied.length > 0 || result.removed.length > 0) {
      ctx.logger?.info?.(`dsh-orchestrator2: preset synced into ${targetRoot} (copied: ${result.copied.length}, removed: ${result.removed.length})`)
    }
  } catch (error) {
    ctx.logger?.warn?.(`dsh-orchestrator2: preset sync failed: ${error instanceof Error ? error.message : String(error)}`)
  }
```

</details>

#### 缺口

- 真实宿主中模型是否遵循冲突回执、以及旧目录同步影响未知
  **影响**：无法确认默认流水线顺畅或升级退出可靠
  **进一步探讨**：用一个最小任务包核对begin回执到角色调用，并检查启动前后旧预设目录差异

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 加载与生效依赖如何验收？

**研究主题**：依赖、兼容与流程

#### 完整回答

Node要求^22.19.0或>=24，需DSH预设声明加载、tools/subagents/goals/compaction/sessions等服务。角色模型默认与降级账号必须可用；预算token视图依赖tokenUsage投影，缺失时退化为台账次数而非虚构token。项目必须满足开发准备固定块及规范v2.1，缺文件或未通过项会拒绝自动模式。API能力探测仅证明方法存在，不证明请求语义和交付效果。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-orchestrator2/presets/orchestrator2/phase-gate.mjs:256-303](https://github.com/AngleZhang-ZhangJiao/dsh-orchestrator2/blob/1c1a6c5ad59d78ef5e3c5a3fe88613f6a9601377/plugins/dsh-orchestrator2/presets/orchestrator2/phase-gate.mjs#L256-L303)

开发准备门禁按固定字段fail closed。

<details>
<summary>查看原文（48行）</summary>

```text
 * 开发准备门禁（D2 fail-closed）：文件存在 ∧ 固定块可解析 ∧ 五字段齐备 ∧
 * `必要项` ≥1 ∧ `未通过项` = 0 ∧ `最近复查` 为日期形态 → 放行；任一不满足 →
 * 拒绝并在信息中点出缺口。纯文件检查、无新依赖、无流程类型豁免
 * （技术调研储备不进 enter_auto_mode；修复包不重新点火）。
 * `门禁结论` 字段由人填写留痕，**机器不消费其值**（判定只看上面五项）。
 * @param {string} rootDir - project root (absolute).
 * @returns {{ok: true} | {ok: false, message: string}}
 */
function checkDevPrep(rootDir) {
  const path = join(rootDir, PREP_RECORD_PATH)
  if (!isFile(path)) {
    return {
      ok: false,
      message: `开发准备门禁：缺少 ${path}。请先完成开发准备（新会话首条消息的引导，或按 spec/templates/00-项目管理/开发准备.md 模板建立记录）。`,
    }
  }
  const fields = parseFixedBlockFile(path)
  if (fields === undefined) {
    return { ok: false, message: `开发准备门禁：固定块不可解析（${path}）${PREP_FIELDS_HINT}。` }
  }
  const missing = PREP_FIELDS.filter((key) => !fields.has(key))
  if (missing.length > 0) {
    return { ok: false, message: `开发准备门禁：固定块缺少字段 ${missing.join(' / ')}（${path}）${PREP_FIELDS_HINT}。` }
  }
  const required = Number(fields.get('必要项'))
  if (!Number.isInteger(required) || required < 1) {
    return {
      ok: false,
      message: `开发准备门禁：「必要项」须为 ≥1 的整数（${path} 当前="${fields.get('必要项')}"）——请先在记录中登记本次开发的实际必要项。`,
    }
  }
  const failed = Number(fields.get('未通过项'))
  if (!Number.isInteger(failed) || failed < 0) {
    return { ok: false, message: `开发准备门禁：「未通过项」须为 ≥0 的整数（${path} 当前="${fields.get('未通过项')}"）。` }
  }
  if (failed > 0) {
    return {
      ok: false,
      message: `开发准备门禁：未通过项=${failed}，逐项见 ${path}（补齐并复查后重新启动自动推进）。`,
    }
  }
  if (!PREP_DATE_RE.test(fields.get('最近复查'))) {
    return {
      ok: false,
      message: `开发准备门禁：「最近复查」须为日期形态 YYYY-MM-DD（${path} 当前="${fields.get('最近复查')}"）——请复查必要项后更新该字段。`,
    }
  }
  return { ok: true }
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 任务包自动化减少的是哪类成本？

**研究主题**：效果与总成本

#### 完整回答

首次需要六区脚手架、任务包、模型路由和开发准备，迁移现有项目也需整理文档。持续产生研究/开发/审查多模型调用和人工验收时间；次数硬上限不是现金预算，budget_status只报token。失败恢复要检查锁、台账、child绑定和goal状态，不能无条件重派。没有同任务同预算对照，不能确认比单Agent减少返工或更便宜。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-orchestrator2/presets/orchestrator2/budget.mjs:1-20](https://github.com/AngleZhang-ZhangJiao/dsh-orchestrator2/blob/1c1a6c5ad59d78ef5e3c5a3fe88613f6a9601377/plugins/dsh-orchestrator2/presets/orchestrator2/budget.mjs#L1-L20)

工具明确只计token，次数预算与真实费用分开。

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * Orchestrator2 budget meter: registers the `budget_status` model tool - a
 * PURE TOKEN USAGE STATISTICS view over the current project's sessions.
 *
 * Data source (priority per the budget design spec, layer 3): dsh-token-meter
 * exposes the `tokenUsage` projection (uncached input / output / cache read /
 * cache write; provider-reported values preferred, heuristic estimate as
 * fallback - the meter owns that policy), read through
 * ctx.sessionProjections.stateOf(session, 'tokenUsage') for every live
 * session whose workspace cwd equals the project root (the parent session +
 * child/subagent sessions inherit the parent's cwd). The tool aggregates
 * input / output / total per session and as a whole, returning text the
 * 调度员 can present directly in conversation (and optionally copy into the
 * 预算台账 usage column - the tool itself is read-only).
 *
 * Source unavailable -> explicit degradation message
 * （「计量不可用，以预算台账次数记录为准」）; NO fabricated data.
 *
 * Cost discipline: the tool counts tokens only. It performs no conversion,
 * and its output text contains no cost/price wording at all.
```

</details>

#### 缺口

- 缺少真实任务包完成率、总token、人工投入和异常重派数据
  **影响**：不能量化流程收益或证明复杂性必要
  **进一步探讨**：用同一可验收任务比较普通Agent清单与该流程，记录全部审查、修复及人工时

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 哪些机制可借鉴，可靠性还有什么边界？

**研究主题**：工程质量与复用

#### 完整回答

可借鉴派工前身份和预算检查、先bindChild再启动及主子会话角色权限分离。dispatch_begin按先锁后台账并在写账失败时清锁处理局部失败，但用existsSync再普通writeFileSync，不是跨进程排他锁，不能外推强事务。固定树部分文档与实际执行矛盾，维护需要把回执、persona、生成patch和工具参数契约一起校验；作者报告的测试数没有在本轮复现。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-orchestrator2/presets/orchestrator2/dispatch.mjs:479-511](https://github.com/AngleZhang-ZhangJiao/dsh-orchestrator2/blob/1c1a6c5ad59d78ef5e3c5a3fe88613f6a9601377/plugins/dsh-orchestrator2/presets/orchestrator2/dispatch.mjs#L479-L511)

写锁与账本顺序及尽力回滚边界。

<details>
<summary>查看原文（33行）</summary>

```text
  const withRow = appendLedgerRow(ledgerText, ledgerRowV2(stamp, 环节.trim(), (模型 || '—').trim(), '已派工', runId, nextAttempt(rows, 环节.trim()), phase.trim(), planned, '—'))
  if (!withRow.ok) return result(false, `台账写入失败：${withRow.message}`)
  const nextText = writeUsageLine(withRow.text, planned, '—')

  // 写锁 → 落台账（预登记）。顺序：先锁后账；任何一步失败都回滚锁。
  const lockBody = [
    `任务目录：${basename(taskDir)}`,
    `环节：${环节.trim()}`,
    `角色：${角色.trim()}`,
    `runId：${runId}`,
    `派工时间：${stamp}`,
    `派工前阶段：${phase}`,
  ].join('\n')
  try {
    writeFileSync(lock, lockBody + '\n', 'utf8')
  } catch (error) {
    return result(false, `写锁失败（${lock}）：${renderThrown(error)}`)
  }
  if (upgraded) {
    // D5 口径：升级写回前备份 v1 原文（同名备份已存在则保留最早一份）
    const backupPath = join(taskDir, `预算台账-v1备份-${todayCompact()}.md`)
    try {
      if (!existsSync(backupPath)) writeFileSync(backupPath, ledger.text, 'utf8')
    } catch (error) {
      try { rmSync(lock, { force: true }) } catch { /* 回滚尽力而为 */ }
      return result(false, `台账 v1 备份失败（${backupPath}）：${renderThrown(error)}；已回滚锁文件。`)
    }
  }
  try {
    writeFileSync(ledgerPath, nextText, 'utf8')
  } catch (error) {
    try { rmSync(lock, { force: true }) } catch { /* 回滚尽力而为 */ }
    return result(false, `台账预登记失败（${ledgerPath}）：${renderThrown(error)}；已回滚锁文件。`)
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 如何降低流程文档与工具漂移？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把派工协议写成单一可执行状态契约，生成工具参数、成功回执及persona对应段，并在启动前做无副作用协议检查，能减少“回执要求工具拒绝参数”的交接失败。推导来自false参数冲突和旧目录同步漂移。最小验证固定最小任务包，在新旧API宿主mock和真实沙箱分别走begin→角色→end、失败与重启；比较人工修正次数、重复派工及完成率，若漂移仍需手工多处修改则否定单源收益。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-orchestrator2/presets/orchestrator2/role-tools.mjs:124-134](https://github.com/AngleZhang-ZhangJiao/dsh-orchestrator2/blob/1c1a6c5ad59d78ef5e3c5a3fe88613f6a9601377/plugins/dsh-orchestrator2/presets/orchestrator2/role-tools.mjs#L124-L134)

现有API探测可扩展为协议验收，但当前仅探测方法存在。

<details>
<summary>查看原文（11行）</summary>

```text
 * 宿主派工能力探测（TP2 · D1 双 API shim）：startActivation 优先（宿主 0.2.1 现行），
 * startContinuable 回退（宿主 0.2.0 旧契约）；皆无抛错且列出实际能力键清单。
 * ponytail: 纯函数两分支顺序探测，不引能力协商框架；升级触发 = 宿主再新增/更名启动 API。
 * @param {object} subagents - cordis 子代理注册表（ctx.subagents）。
 * @returns {{name: 'startActivation'|'startContinuable'}} 生效启动 API 名。
 */
export function resolveStartApi(subagents) {
  if (typeof subagents?.startActivation === 'function') return { name: 'startActivation' }
  if (typeof subagents?.startContinuable === 'function') return { name: 'startContinuable' }
  const keys = Object.keys(subagents ?? {}).filter((k) => typeof subagents[k] === 'function')
  throw new Error(`宿主派工能力缺失：已探测 startActivation / startContinuable 均不可用；ctx.subagents 实际能力键=[${keys.join(', ')}]`)
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 当前适合直接试用还是先观察？

**研究主题**：采用判断

#### 完整回答

建议先观察并核对派工回执与角色参数，再做隔离任务包验收。适合愿意维护流程规范的负责人，不适合只需少量编辑或无法承担多模型与文档整理的人。先修正/规避false参数冲突，检查旧目录同步与退出，再用小任务验证人工测试硬停止、预算拒绝和中断恢复，未完成这些前不接管正式交付。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-orchestrator2/presets/orchestrator2/role-tools.mjs:155-175](https://github.com/AngleZhang-ZhangJiao/dsh-orchestrator2/blob/1c1a6c5ad59d78ef5e3c5a3fe88613f6a9601377/plugins/dsh-orchestrator2/presets/orchestrator2/role-tools.mjs#L155-L175)

主会话、后台限定与持久绑定是采用条件。

<details>
<summary>查看原文（21行）</summary>

```text
      async execute(args, exec) {
        const parent = exec.agent
        const sessionId = assertMainScheduler(parent, toolName)
        if (args?.run_in_background === false) {
          throw new Error(`${toolName}：首版仅支持后台 continuable 派工（run_in_background 缺省 true）`)
        }
        const subagents = ctx.subagents
        const startApi = resolveStartApi(subagents)
        const home = options.home ?? resolveDshHome()
        const snapshot = resolveDispatchSnapshot(role, sessionId, home)
        const childId = randomUUID()
        // 绑定先于首次 request：startActivation 之前写入快照，消除竞争窗口（AC16）。
        await bindChild(childId, {
          parentId: sessionId,
          role,
          epoch: snapshot.epoch,
          primaryRoute: snapshot.route,
          fallbackRoute: snapshot.fallbackRoute,
          appliedRoute: snapshot.route,
          degraded: false,
        }, { home, sessionId })
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
