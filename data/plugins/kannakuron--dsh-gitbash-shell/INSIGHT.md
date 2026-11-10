# DSH Git Bash Shell

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[91e7ed7](https://github.com/KannaKuron/dsh-gitbash-shell/tree/91e7ed7c221e9f360023ed1636567d5ec16e18dd)

<!-- BEGIN META -->
[![GitHub ★ 45](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/KannaKuron/dsh-gitbash-shell) [![npm 30d 13,622](https://img.shields.io/static/v1?label=npm+30d&message=13%2C622&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-gitbash-shell) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-gitbash-shell)
<!-- END META -->

> **功能**：为 Windows DSH 会话提供 Git Bash、MSYS 路径转换、原生程序调用及可选预设。

> **亮点**：将 Git for Windows、宿主会话工具和任务生命周期连接，并为路径方言及原生 argv 增加显式边界。[Q01](#research-q01) [Q03](#research-q03)

> **主要限制**：默认 Windows 受限调用拒绝启动。关闭实验门禁可恢复标注无约束的兼容行为，无法满足依赖强制写隔离的任务。[Q02](#research-q02)

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
  - [Q01 · Windows DSH 用户如何得到 Git Bash，原生 PowerShell 会怎样？](#detail-section-11)
  - [Q02 · 权限不足、Git Bash 缺失或关闭实验开关时会发生什么？](#detail-section-12)
  - [Q03 · 路径转换、原生 argv 与后台状态有什么区别？](#detail-section-13)
  - [Q04 · 如何选择试用条件，并确认撤销与单位任务成本？](#detail-section-14)
  - [Q05 · 如何检验统一路径能否降低切换成本，同时保留权限拒绝？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 Windows DSH 复用团队 Bash 命令的开发者需要减少解释器和路径切换。[Q01](#research-q01)

比较原生 DSH PowerShell 与独立 Git Bash 终端，另用相同工作区检验路径转换。[Q01](#research-q01) [Q05](#research-q05)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Git Bash | 运行 Bash 命令 | Git for Windows 和适用会话 |
| 原生 argv | 明确执行 Windows exe | 常设全访问及宿主契约 |
| 路径转换 | 减少跨工具盘根写法切换 | 仅适用工具，授权独立 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Windows 和 Git for Windows | Bash 试用必需 | 解析明确 bash.exe | 诊断后回原生 PowerShell |
| 兼容 DSH 与 Node | 必需 | 工具和宿主执行契约 | 停止试用 |
| 宿主 Jobs 与原生执行契约 | 相关能力所需 | 后台、直接 argv | 只核对已注册的工具 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户在独立 profile 建会话 | 对照原生工具面 |
| 核对 | 用户先测受限拒绝，再在已授权环境验证 Bash 身份 | 拒绝不留哨兵，正常命令输出一致 |
| 恢复 | 用户停用后回读配置并重启 | 回原生 PowerShell |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装及进程资源未测 | 准备 Git for Windows 与隔离配置 | 检查版本和工具可见性 |
| 持续 | 启动与转换成本未测 | 检查工具和路径 | 按合格任务记录 |
| 失败 | 回退时间未测 | 核对配置、回原生工具重做 | 检查真实副作用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 复用 Bash | 工具调用明确 Bash argv | 跨 preset 任务成功率 |
| 权限可理解 | 默认拒绝与兼容标签 | 真实宿主的系统隔离 |
| 路径兼容 | 适配参数和结果元数据 | 特殊路径覆盖 |

> **思考**：默认 Windows 受限调用拒绝启动。关闭实验门禁可恢复标注无约束的兼容行为，无法满足依赖强制写隔离的任务。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将 Git for Windows、宿主会话工具和任务生命周期连接，并为路径方言及原生 argv 增加显式边界。[Q01](#research-q01) [Q03](#research-q03)

会话工具注册、私有执行器、原生参数校验和配置恢复分别有接线。结果的进程状态与输出事实分开，回读失败后需核对 profile 或文件副作用。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

默认 Windows 受限调用拒绝启动。关闭实验门禁可恢复标注无约束的兼容行为，无法满足依赖强制写隔离的任务。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

在独立 Windows profile 保持默认实验门禁，先核对受限命令未启动。在原已授权的隔离全访问会话验证 Git Bash 身份、工作目录与空格路径。失败时停用并重启，核对配置和原生 PowerShell 工具。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持会话接线、路径转换和前置拒绝。真实 Windows 宿主、系统级隔离、进程终止和配置还原尚未独立验证。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、src/index.js、src/inline-tools.js、src/shell.js、src/bash-tool.js、src/native-executor.js、docs/experimental-native-verification.md、package.json、src/ops-adopt.js、src/path-tool.js、src/experimental-tools.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽核固定源码的默认工具、执行策略、路径和相关配置接线。未审计上游实现、全部预设或 FastCtx 和终端分支。
- 下一步：静态核查，作者旧 Core 结果单独标识。未安装、未运行目标或测试，未核对 Windows 实际权限和 npm 包字节。

**分析版本**

- **仓库**：[KannaKuron/dsh-gitbash-shell](https://github.com/KannaKuron/dsh-gitbash-shell)
- **版本号**：0.53.0（[固定提交 91e7ed7](https://github.com/KannaKuron/dsh-gitbash-shell/tree/91e7ed7c221e9f360023ed1636567d5ec16e18dd)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

检验结果旁的解释器、路径与门禁提示能否减少错误工具选择，在受限哨兵出现变更时立即推翻。[Q05](#research-q05)

静态核查，作者旧 Core 结果单独标识。未安装、未运行目标或测试，未核对 Windows 实际权限和 npm 包字节。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 4368 | — | — | 111412 |
| .js | source | 27 | 14196 | 9660 | 4011 | — |
| .mjs | test | 32 | 10623 | 8375 | 1715 | — |
| .md | test | 1 | 82 | — | — | 572 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-10），可前往 [GitHub Issues](https://github.com/KannaKuron/dsh-gitbash-shell/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 Windows DSH 会话能否复用 Bash 命令、权限如何落实，以及试用和停用的代价。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Windows DSH 用户如何得到 Git Bash，原生 PowerShell 会怎样？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适合在 Windows 的 DSH 会话重复使用 Bash 脚本及 Unix 风格工具的开发者。基线是宿主 PowerShell 及单独打开 Git Bash 终端。Cordis 安装补丁插入 gitbash-shell，入口声明依赖 agentPresets。默认模式在 agent/created 调解工具面，有 pwsh 而缺 bash 的适用会话补自有 bash。私有执行器继承宿主 Bash 执行契约，调用明确的 Git for Windows bash.exe。宿主的 PowerShell 执行器保留，插件可隐藏 agent 上的 pwsh，遇 dsh-ops 有例外。已有掩码、已有工具和可选变体影响最终工具面，不能把所有预设视为同一入口。独立 Git Bash 终端可完成同类 shell 命令，插件增量是让代理直接调用宿主工具并保留工作区及任务接口。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:16-41](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/README.md#L16-L41)

作者描述原生 PowerShell 基线、默认内联工具与可见性。

<details>
<summary>查看原文（26行）</summary>

```text
官方 Windows 组合默认把 `dsh-pwsh-sandbox` 作为 `ctx.shell`(PowerShell 执行器),
且各 preset 的 `tool-bash` 行在 win32 上被禁用——因为在 Windows 上裸 `bash`
会解析到 `C:\Windows\System32\bash.exe`(WSL 占位)。本插件**不替换这个执行器**:
它新增一个自有 `bash` 工具,执行在私有的 Git Bash 执行器实例上(继承官方
`@deepseek-ai/dsh-bash-sandbox`,`bashPath` 只认 Git for Windows)。沙箱语义在
POSIX 宿主上完整保留;
**Windows 宿主上受限模式有一处重要例外——见下方
[「安全语义:Windows 上的受限模式」](#安全语义windows-上的受限模式)**。

 安装本插件后(v0.35.0 起,**默认**):

- **官方四个模式直接获得 Git Bash**——模式列表保持官方原样,不再新增变体:
  每个会话创建时,本插件探测该模式的工具面,「有 pwsh 无 bash」(官方 Windows
  组合的形态)即在该会话内注册**自有 bash 工具**(对官方 tool-bash 逐调用镜像:
  后台任务、审批升级、渲染行为不变)。宿主官方 `pwsh` 工具是**真正的
  PowerShell**(v0.39.0 起,本插件不再替换执行器),默认被隐藏、开关显示——见下一条。
- **bash 工具说明附带路由规则**:能用 Git Bash 就用 Git Bash;只有必须用到
  Windows 原生能力(cmdlet/注册表/服务/WMI)时才用 PowerShell;bash 出错在
  bash 里修,禁止在 bash 里嵌 `pwsh -Command`(变量展开与输出编码会在那里坏掉)。
- **`pwsh` 工具(官方 PowerShell,默认隐藏,开关显示)**:宿主官方的 `pwsh` 工具
  就是真正的 PowerShell(官方解析器自动优先 PowerShell 7),可直接用于 Windows
  原生操作(cmdlet/注册表/服务/WMI)。默认关闭(`pwshTool` 开关):该工具对本插件
  会话隐藏,主机保持 bash 优先;开启后它直接可见可用——无需安装任何额外组件。
  旧 PowerShell 7 旁路工具(v0.37–v0.38.5 的独立工具)已随 v0.39.0 新架构退役;
  命令仍然首选 bash 工具。`pwshTool` 与 `experimentalNative` 的**工具面可见性**只影响新会话或重启后的
  会话:运行中的会话会保持它创建时的工具面,保存开关只在宿主日志留一行提示,不会中途重建。
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:25-29](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/cordis.patch.yml#L25-L29)

安装补丁插入真实插件。

```text
- insert:
    # Row id 'gitbash-shell': dsh >=0.2.2-rc.1 keys the plugin's live Config
    # form by the row id, so the id is also the configForms key.
    - id: gitbash-shell
      name: dsh-gitbash-shell
```

**依据 3 · 源码核查**：[src/index.js:99-103](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/index.js#L99-L103)

插件身份与预设服务依赖。

```text
/** Plugin identity for cordis.yml rows. */
export const name = 'dsh-gitbash-shell'

/** The preset roster is a hard dependency: without it there is nothing to do. */
export const inject = ['agentPresets']
```

**依据 4 · 源码核查**：[src/index.js:1990-2016](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/index.js#L1990-L2016)

会话子作用域和开关接线。

<details>
<summary>查看原文（27行）</summary>

```text
    try {
      mountInlineTools(ctx, {
        tools: (c) => { try { return c.get('tools') } catch { return undefined } },
        agents: (c) => { try { return c.get('agents') } catch { return undefined } },
        createScope: (agentCtx) => {
          let childCtx
          const fiber = agentCtx.plugin((c) => { childCtx = c })
          return {
            // cordis plugin() starts the fiber ASYNCHRONOUSLY — the apply
            // callback that captures childCtx has NOT run when plugin()
            // returns. The wrapped fiber is a thenable (`fiber.await()`):
            // awaiting it is the only way to observe childCtx being set
            // (v0.38.3, real machine: apply(undefined) crashed with
            // "Cannot read properties of undefined (reading 'shell')").
            fiber,
            get ctx() { return childCtx },
            dispose: async () => { try { await fiber?.dispose?.() } catch { /* already gone */ } },
          }
        },
        pwshEnabled: () => liveSettings.pwshTool() === true,
        experimentalEnabled: () => liveSettings.experimentalNative(),
        pathToolEnabled: () => liveSettings.pathTool(),
        nativeContract,
        routingOptions: (agent) => ({
          msys: liveSettings.posix() && dialectApplies(liveSettings.dialect(), agent),
          terminalGitBash: terminalDialect.gitBash === true,
        }),
```

</details>

**依据 5 · 源码核查**：[src/inline-tools.js:616-645](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/inline-tools.js#L616-L645)

会话工具面和 PowerShell 可见性限制。

<details>
<summary>查看原文（30行）</summary>

```text
    if (state.toolFace === undefined) state.toolFace = {
      pwshVisible: deps.pwshEnabled?.() === true,
      experimental: deps.experimentalEnabled?.() !== false,
    }
    const pwshVisible = state.toolFace.pwshVisible === true
    const needs = inlineNeeds(names, { pwshVisible })
    if (needs.opsPresent) opsSeen = true
    // The pwsh face (route B): the host tool is REAL PowerShell now, so the
    // default is a product-level HIDE, not a safety denial.
    //   dsh-ops present  -> hands off entirely (their host-pwsh story stands).
    //   switch OFF       -> hide the tool for this agent (tools.restrict).
    //   switch ON        -> leave the real tool visible, untouched.
    if (needs.hidePwsh && !needs.opsPresent) {
      if (!state.denyPwsh) {
        // Through the AGENT's scoped context (`agent.ctx.tools`, the dsh-ops
        // -proven shape): on the ROOT context the host throws "requires a
        // scoped context" and the restriction silently never exists (issue
        // #18, root cause 3).
        try {
          const deny = agent.ctx?.tools?.restrict?.({ deny: ['pwsh'] })
          if (typeof deny === 'function') state.denyPwsh = deny
        } catch (error) {
          log(`pwsh hide failed: ${error?.message ?? error}`)
        }
      }
    }
    // A face WITHOUT pwsh is not the official win32 composition: something
    // masked the host tool away, and the only such mask in the wild is a
    // preset gate (`tools.restrict({ allow })`, e.g. the pure-chat preset).
    // Our bash lives in an AGENT-OWNED scope, and scoped registrations stay
```

</details>

**依据 6 · 源码核查**：[src/inline-tools.js:714-743](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/inline-tools.js#L714-L743)

会话创建与销毁事件。

<details>
<summary>查看原文（30行）</summary>

```text
    controller.abort(new Error('inline bash plugin disposed'))
    await Promise.all([
      ...[...tracked.keys()].map(teardown),
      ...pending,
      mounting?.then(({ executorScope }) => executorScope.dispose(), () => {}),
    ])
    tracked.clear()
    bashOnce = undefined
  }, 'dsh-gitbash-shell: inline tool patching')

  try {
    // RETURN the reconcile promise. DSH announces a new agent through the
    // SERIAL `agent/created` event (`@deepseek-ai/dsh-agent` announce() awaits
    // `ctx.serial(carrier, 'agent/created', …)`), so the returned promise makes
    // `agents.create()` wait for this agent's own bash registration. Without
    // it the global PTC executor resolved its SDK on a face that did not carry
    // bash yet (step 1 missing, step 2 present).
    ctx.on('agent/created', ({ agent } = {}) => {
      try {
        const pending = reconcile(agent)
        // Wait for the registration, but never turn a registration failure
        // into a failed `agents.create()`: provideBash already logs its own
        // failures, and the host's serial emission rejects the whole
        // announcement when a listener rejects.
        return pending && typeof pending.then === 'function' ? pending.catch(() => {}) : pending
      } catch { /* never break agent creation */ }
    })
    ctx.on('agent/disposed', ({ agent } = {}) => teardown(agent).catch((error) => {
      log(`agent bash tool cleanup failed: ${error?.message ?? error}`)
    }))
```

</details>

**依据 7 · 源码核查**：[src/shell.js:254-271](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/shell.js#L254-L271)

显式 Bash argv 调用宿主执行器。

<details>
<summary>查看原文（18行）</summary>

```text
  /**
   * Execution entry point on dsh >=0.2.2-rc.1. Without this override the
   * full-access branch spawns the bare `bash` name hardcoded in
   * `LocalBashExecutor.execute`, and a Windows confined call goes back through
   * the restricted-token runner MSYS2 cannot survive.
   * @param spec resolved execution settings and caller-owned command metadata.
   * @returns the live execution handle.
   */
  async execute(spec) {
    const route = this.gitBashRoute(spec)
    const routed = this.withInitScript(this.withParityEnv(spec))
    if (route === undefined) return super.execute(routed)
    const argv = [this.requireBashPath(), '-c', routed.command]
    const sandbox = this.routeSandbox(route)
    // `executeArgv` is the shipped helper for exactly this: run an explicit
    // argv with the executor's own lifecycle, output and deadline semantics.
    return Promise.resolve(this.executeArgv(routed, argv))
      .then((ex) => GitBashSandboxExecutor.decorateExecution(ex, sandbox))
```

</details>

#### 缺口

- 未在固定版本的真实 Windows 宿主打开各预设。
  **影响**：工具可见性可能因宿主模块和 preset 改变。
  **进一步探讨**：按标准模式、受限自定义模式和变体分开检查工具面及 Bash 身份。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 权限不足、Git Bash 缺失或关闭实验开关时会发生什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

默认 experimentalNative 开启。Windows Bash 对 read-only、workspace-write 或未解析策略在显式 argv 路由前拒绝。按宿主批准接口可处理调用级申请，但没有证据允许插件自行提权。Git Bash 路径不可用时，显式路由会报错，不替换为 PowerShell 或 WSL。关闭实验开关后，已解析的受限模式可能走明确标注 unconfined 的旧路径，原受限标签无法提供写隔离。gitbash_native 独立检查会话常设策略，只有 danger-full-access 才继续，且在执行及真正 spawn 前复查。应用错误、拒绝与进程输出是不同信号。 独立 pathTool 开关只控制显式路径工具。执行时检查总开关和独立开关，注册模块监听两项变更并刷新自己的注册。固定文档同时写到工具面重启更新，实际模型可见性的刷新时点仍需宿主验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:486-501](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/index.js#L486-L501)

变体及实验开关声明默认值。

<details>
<summary>查看原文（16行）</summary>

```text
  variantPresets: Schema.boolean().default(false).volatile(),
  /**
   * Show the host `pwsh` tool to agents (v0.39.0 semantics; default OFF).
   * Route B keeps the official pwsh executor in place, so the tool is REAL
   * PowerShell (7 first per the official resolver) — showing it is a pure
   * product choice. OFF (default) hides it per agent: the host stays
   * bash-first. The retired v0.37 `pwsh7` side-channel is gone; this switch
   * now controls the real thing.
   */
  pwshTool: Schema.boolean().default(false).volatile(),
  // Maintainer PR #26 decision: one live opt-out for refusal and companions.
  experimentalNative: Schema.boolean().default(true).volatile(),
  /**
   * Issue #45: hide ONLY `gitbash_to_native_path`. The total switch above still
   * owns `gitbash_native` and the fail-closed refusal; turning this OFF keeps
   * both. Default ON preserves the v0.52.0 tool face for existing users.
```

</details>

**依据 2 · 源码核查**：[src/shell.js:161-167](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/shell.js#L161-L167)

缺 Git Bash 时抛解析错误。

```text
  requireBashPath() {
    const resolution = this.bashResolution()
    if (!resolution.ok) {
      throw new Error('dsh-gitbash-shell: no Git for Windows bash found, so this command cannot run. '
        + bashResolutionReport(resolution).split('\n').slice(1).join(' | '))
    }
    return resolution.path
```

**依据 3 · 源码核查**：[src/shell.js:186-231](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/shell.js#L186-L231)

受限默认拒绝及旧路径 unconfined。

<details>
<summary>查看原文（46行）</summary>

```text
  /** Construct the host's structured refusal when its module was resolved. */
  policyUnavailableError(mode) {
    const knownMode = mode === 'read-only' || mode === 'workspace-write' ? mode : 'unresolved'
    const detail = 'dsh-gitbash-shell does not provide verified Windows Git for Windows confinement. '
      + 'The command was not started; no unconfined fallback is permitted. '
      + 'Do not bypass this refusal with another tool or change permissions automatically.'
      + ' The user can open Settings > Plugins > dsh-gitbash-shell and turn off '
      + '"Experimental native execution / fail-closed" (experimentalNative) to restore the legacy '
      + 'explicitly UNCONFINED Bash behavior, or select danger-full-access in the session access-mode control.'
    if (typeof this.unavailableErrorType === 'function') return new this.unavailableErrorType(knownMode, detail)
    // Direct/older callers without the optional host error export still refuse.
    const error = new Error('sandbox mode "' + knownMode + '" cannot execute Git Bash on this Windows host. ' + detail)
    error.name = 'SandboxUnavailableError'
    error.code = 'SANDBOX_UNAVAILABLE'
    return error
  }

  /**
   * Full access uses explicit Git Bash argv. Windows restricted or unresolved
   * policy fails BEFORE argv resolution, job admission or spawning; disclosure
   * of an unconfined route is not permission to weaken the requested policy.
   * Non-Windows restricted calls retain the parent's actual sandbox path.
   * @returns `{ mode, unconfined: false }`, or undefined to inherit.
   */
  gitBashRoute(spec) {
    const mode = spec.sandboxPolicy?.mode
    if (mode === 'danger-full-access') return { mode, unconfined: false }
    if (process.platform === 'win32') {
      if (this.experimentalEnabled?.() !== false) throw this.policyUnavailableError(mode)
      // Exact legacy opt-out: unresolved policy still delegates to the host.
      if (mode !== undefined) return { mode, unconfined: true }
    }
    return undefined
  }

  warnConfinedUnconfined(mode) {
    if (this._warnedUnconfined) return
    this._warnedUnconfined = true
    console.log('dsh-gitbash-shell: experimentalNative is OFF. Requested mode ' + mode
      + ' uses an UNCONFINED Git Bash route: shell file-write restrictions are NOT enforced. '
      + 'Official file-tool policy is separate; never bypass its denial through shell.')
  }

  routeSandbox(route) {
    if (route.unconfined) this.warnConfinedUnconfined(route.mode)
    return { mode: route.mode, denied: false, ...(route.unconfined ? { enforcement: 'unconfined' } : {}) }
```

</details>

**依据 4 · 源码核查**：[src/bash-tool.js:501-510](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/bash-tool.js#L501-L510)

取常设策略及请求宿主审批。

<details>
<summary>查看原文（10行）</summary>

```text
        /** The execute body, identical across both definition shapes (index.ts:477). */
        const executeBody = async (args, exec) => {
          const standingPolicy = resolveSandboxPolicy(exec)
          validateBashArgs(args, standingPolicy?.mode, validateEscalationArgs)
          const approvedMode = args.sandbox_permissions !== undefined && args.justification !== undefined
            ? await approveBashEscalation(args.sandbox_permissions, args.justification, exec, standingPolicy)
            : undefined
          const policy = approvedMode === undefined
            ? standingPolicy
            : { ...standingPolicy, mode: approvedMode }
```

</details>

**依据 5 · 源码核查**：[src/native-executor.js:72-81](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/native-executor.js#L72-L81)

原生工具读取调用会话的常设策略。

<details>
<summary>查看原文（10行）</summary>

```text
/** Resolve the *call's* standing policy, never the composition default. */
export function requireNativePolicy(ctx, exec, sandboxModule) {
  const service = ctx.get('sandboxPolicy')
  const policy = service?.resolve(exec?.agent === undefined ? {} : { session: exec.agent.session })
  if (!policy || policy.mode !== 'danger-full-access') {
    const detail = 'gitbash_native has no confined backend adapter. This entry refuses read-only, workspace-write and missing policy before spawn or artifact creation; do not bypass a denied operation. The user can select danger-full-access in the session access-mode control, or turn off Experimental native execution / fail-closed (experimentalNative) in Settings > Plugins > dsh-gitbash-shell to disable native/path tools and restore explicitly UNCONFINED legacy Bash.'
    if (typeof sandboxModule?.SandboxUnavailableError === 'function') throw new sandboxModule.SandboxUnavailableError(policy?.mode ?? 'unknown', detail)
    throw Object.assign(new Error(detail), { code: 'SANDBOX_UNAVAILABLE' })
  }
  return policy
```

</details>

**依据 6 · 源码核查**：[src/native-executor.js:157-164](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/native-executor.js#L157-L164)

执行前再次检查权限。

```text
    async execute(request, exec, { signal = exec.signal, onExpiry = 'kill' } = {}) {
      requireEnabled()
      const policy = requireNativePolicy(ctx, exec, sandboxModule)
      if (!prepared.has(request)) throw new TypeError('gitbash_native: request must be prepared by this executor')
      if (!['kill', 'none'].includes(onExpiry)) throw new TypeError('invalid native expiry mode')
      signal?.throwIfAborted()
      const provider = ctx.get('subprocess')
      if (typeof provider?.spawn !== 'function') throw new Error('gitbash_native: subprocess provider unavailable')
```

**依据 7 · 源码核查**：[src/native-executor.js:230-244](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/native-executor.js#L230-L244)

原生 spawn 前再检查策略。

<details>
<summary>查看原文（15行）</summary>

```text
        const facade = { spawn(spec) {
          requireEnabled()
          requireNativePolicy(ctx, exec, sandboxModule)
          spec.signal?.throwIfAborted()
          handle = adapter.spawn(spec)
          return handle
        } }
        scope.ctx.provide('subprocess', facade)
        const mounted = scope.ctx.plugin(LocalBashExecutor)
        await whileActive(() => mounted, operation.signal)
        requireEnabled()
        operation.signal.throwIfAborted()
        const executor = scope.ctx.get('shell')
        if (typeof executor?.executeArgv !== 'function') throw new Error('gitbash_native: host executeArgv contract is unavailable')
        const budget = remaining(request)
```

</details>

**依据 8 · 作者声明**：[README.md:459-467](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/README.md#L459-L467)

作者说明两个开关及执行和可见性边界。

```text
## 显式工具

**运行时开关 `experimentalNative`（默认 true）：** 设置 → 插件 → dsh-gitbash-shell →「实验原生执行 / fail-closed」。开启时 Windows 受限/未确定模式拒绝 Bash，提供可用的两个显式工具；关闭立即禁用两个工具的执行；已有 eager native 槽位保留当前会话的 schema，下一会话应用新工具面，并恢复明确标注 `unconfined` 的兼容 Bash（不执行 shell 文件写入限制）。修改作用于现有会话后续调用，无需重启，不终止已启动的任务。拒绝时用户也可在会话访问模式控件选择 `danger-full-access`；Agent 不得自行放宽权限。与路径方言及 codePaths 开关独立。

**路径工具开关 `pathTool`（默认 true）：** 设置 → 插件 → dsh-gitbash-shell →「路径工具」。它只控制 `gitbash_to_native_path`：关闭后该工具从当前会话工具面注销并立即拒绝执行；`gitbash_native`、fail-closed 安全兜底与路径方言完全不受影响。修改作用于现有会话后续调用，无需重启；工具面对新会话或重启后的会话生效。与 `experimentalNative` 是叠加关系——总闸关闭时两者都不可用。

两个工具随 Windows 的自有 bash 工具挂入同一 agent-owned scope；不替换官方工具或 root
provider，已有同名工具不覆盖。旧 Core 缺少公开 native executor/OutputCollector 能力时不
注册 native 工具，bash/path 不受影响；minimal 的持久终端不通过此补位通道。
```

**依据 9 · 源码核查**：[src/path-tool.js:215-224](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/path-tool.js#L215-L224)

显式转换执行检查两个开关。

<details>
<summary>查看原文（10行）</summary>

```text
  const execute = (args) => {
    if (experimentalEnabled?.() === false) throw new Error('gitbash_to_native_path is disabled by experimentalNative. Enable Experimental native execution / fail-closed in Settings > Plugins > dsh-gitbash-shell.')
    if (pathToolEnabled?.() === false) throw new Error('gitbash_to_native_path is disabled by pathTool. Enable Path tool in Settings > Plugins > dsh-gitbash-shell; gitbash_native and its fail-closed gate are independent.')
    // Fresh facts per call: the same lazy discipline as every other
    // translation consumer (a settings bashPath change must be visible on
    // the next call without a re-mount).
    const env = typeof buildEnv === 'function' ? buildEnv() : undefined
    const outcome = convertMsysToNative(args?.msys_path, { translate: convertValue, env })
    if (!outcome.ok) throw new Error(outcome.message)
    return { native_path: outcome.native_path }
```

</details>

**依据 10 · 源码核查**：[src/path-tool.js:269-280](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/path-tool.js#L269-L280)

显式路径注册监听两个开关。

<details>
<summary>查看原文（12行）</summary>

```text
export function createPathToolModule(deps = {}) {
  const definition = buildPathToolDefinition(deps)
  const enabled = () => deps.experimentalEnabled?.() !== false && deps.pathToolEnabled?.() !== false
  return {
    inject: ['tools'],
    apply(ctx) {
      if (typeof ctx?.tools?.register !== 'function') {
        throw new Error('path-tool: ctx.tools.register is unavailable; cannot own the tool registration')
      }
      registerExperimentalTool(ctx, () => definition, enabled, {
        scope: deps.scope, log: deps.log, watchKeys: ['experimentalNative', 'pathTool'],
      })
```

</details>

**依据 11 · 源码核查**：[src/experimental-tools.js:7-37](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/experimental-tools.js#L7-L37)

刷新先撤注册，再依开关决定是否重新注册。

<details>
<summary>查看原文（31行）</summary>

```text
  const refresh = () => {
    if (closed) return
    unregister?.()
    unregister = undefined
    if (enabled?.() === false) return
    const candidate = definition()
    // Global and ancestor registrations remain owned even when hidden here.
    let occupied
    try {
      occupied = toolNameOccupied(ctx.tools, candidate.name, scope)
    } catch (error) {
      log(`${candidate.name} registration skipped: ${error?.message ?? error}`)
      return
    }
    if (occupied) {
      log(`${candidate.name} registration skipped: an existing tool owns this name`)
      return
    }
    try {
      unregister = ctx.tools.register(candidate)
    } catch (error) {
      // A registration conflict must not abort a volatile update or prevent
      // another companion's refresh. Other failures remain explicit in logs.
      log(`${candidate.name} registration failed: ${error?.message ?? error}`)
      return
    }
    log(`${candidate.name} registered in the agent-owned scope`)
  }
  ctx.effect(() => () => { closed = true; unregister?.(); unregister = undefined })
  ctx.on('loader/volatile-update', paths => {
    if (Array.isArray(paths) && paths.some(path => Array.isArray(path) && watched.includes(path[0]))) refresh()
```

</details>

#### 缺口

- 没有验证 Windows 上的真实访问模式或策略撤销竞态。
  **影响**：静态拒绝分支不能视为系统隔离验收。
  **进一步探讨**：在一次性工作区用无害哨兵核对受限调用没有启动及没有生成文件。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 路径转换、原生 argv 与后台状态有什么区别？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

MSYS 路径转换在工具 dispatch 中按工具和代理状态启用，对适配参数与结果元数据做转换，出错可保留原结果。路径转换是兼容层，授权仍由下游工具判定。原生工具限制 exe，参数分 literal 和 path，已知识别的解释器要求显式标注。它调用宿主 executeArgv，避免先拼成 Bash 源码，但目标 exe 仍有自己的参数解析与副作用。命令可经 Jobs 后台管理，Bash 自动转后台的注册失败分支会回到前台和到期终止路径。原生进程状态与输出解码或存储事实分开，不因解码失败重跑有副作用的命令。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:1354-1379](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/index.js#L1354-L1379)

限定适用范围，转换调用参数和返回元数据。

<details>
<summary>查看原文（26行）</summary>

```text
          // One stale read site, five symptoms.
          const dialect = liveSettings.dialect()
          // v0.27.0: a delegated agent the user excluded keeps the official
          // semantics for BOTH faces of its calls — arguments go through
          // untouched and the result metadata is not echoed back in MSYS form.
          if (dialect.posixPaths && dialectApplies(dialect, exec && exec.agent)) {
            echo = true
            const env = dialect.virtualMounts ? buildTranslateEnv(readConfiguredBashPath()) : null
            echoEnv = env
            if (exec && exec.arguments && typeof exec.arguments === 'object') {
              const translated = translateDispatch(exec, dialect, env, programLanguageFor(ctx, exec?.agent))
              if (translated !== exec.arguments) exec.arguments = translated
            }
          }
        } catch { /* never block a call on translation */ }
        if (!echo) return next()
        return next().then((result) => {
          try {
            if (!result || typeof result !== 'object' || result.isError !== false) return result
            if (!result.value || typeof result.value !== 'object') return result
            const value = rewriteResultPaths(exec && exec.name, result.value, echoEnv)
            return value === result.value ? result : { ...result, value }
          } catch { return result }
        })
      })
      console.log(TAG + ' MSYS path translation active on tool dispatch (arguments and result metadata)')
```

</details>

**依据 2 · 源码核查**：[src/native-executor.js:38-69](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/native-executor.js#L38-L69)

原生 exe、类型化 argv、大小与编码限制。

<details>
<summary>查看原文（32行）</summary>

```text
/** Strict request validation is also applied outside ToolRuntime. */
export function parseNativeRequest(args, { translateMsysPath, platform = process.platform, sessionCwd } = {}) {
  object(args, 'gitbash_native', KEYS)
  const description = string(args.description, 'description')
  const executable = nativePath(args.executable, translateMsysPath, platform, 'executable')
  if (!/\.exe$/i.test(executable)) throw new TypeError('executable: only native .exe files are supported; .cmd/.bat and script files are never wrapped')
  const entrypoint = args.entrypoint ?? 'native'
  if (!['native', 'interpreter'].includes(entrypoint)) throw new TypeError('entrypoint: expected native or interpreter')
  if (INTERPRETERS.test(path.win32.basename(executable)) && entrypoint !== 'interpreter') throw new TypeError('executable: a known interpreter requires explicit entrypoint: interpreter; its language and quoting remain your responsibility')
  if (!Array.isArray(args.argv) || args.argv.length > 4096) throw new TypeError('argv: expected an array of at most 4096 typed arguments')
  const argv = args.argv.map((arg, index) => {
    object(arg, `argv[${index}]`, new Set(['kind', 'value']))
    if (arg.kind === 'literal') return string(arg.value, `argv[${index}].value`, true)
    if (arg.kind === 'path') return nativePath(arg, translateMsysPath, platform, `argv[${index}]`)
    throw new TypeError(`argv[${index}]: kind must be literal or path`)
  })
  // Conservative bound before the provider's Windows command-line serialization.
  if ([executable, ...argv].reduce((n, arg) => n + arg.length * 2 + 3, 0) > 30000) throw new TypeError('argv: conservative Windows command-line size limit exceeded')
  const cwd = nativePath(args.cwd ?? { kind: 'path', value: sessionCwd }, translateMsysPath, platform, 'cwd')
  if (args.timeoutMs !== undefined && (!Number.isFinite(args.timeoutMs) || args.timeoutMs <= 0)) throw new TypeError('timeoutMs: expected a positive finite number')
  if (args.run_in_background !== undefined && typeof args.run_in_background !== 'boolean') throw new TypeError('run_in_background: expected boolean')
  if (args.run_in_background === true && args.timeoutMs !== undefined) throw new TypeError('timeoutMs is not supported with run_in_background; managed jobs have no tool deadline')
  const stdoutEncoding = args.stdoutEncoding ?? 'utf8'
  const stderrEncoding = args.stderrEncoding ?? 'utf8'
  const errors = args.errors ?? 'replace'
  if (!ENCODINGS.has(stdoutEncoding) || !ENCODINGS.has(stderrEncoding)) throw new TypeError('encoding: expected utf8, gbk, utf16le or raw; auto is not supported')
  if (!['replace', 'strict'].includes(errors)) throw new TypeError('errors: expected replace or strict')
  return Object.freeze({ description, executable, argv: Object.freeze(argv), cwd, entrypoint,
    timeoutMs: Math.min(args.timeoutMs ?? NATIVE_TIMEOUT_MS, NATIVE_MAX_TIMEOUT_MS),
    run_in_background: args.run_in_background === true,
    output: Object.freeze({ stdoutEncoding, stderrEncoding, errors }),
  })
```

</details>

**依据 3 · 源码核查**：[src/native-executor.js:245-276](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/native-executor.js#L245-L276)

直传 argv，执行状态、取消和输出事实分开。

<details>
<summary>查看原文（32行）</summary>

```text
        if (budget <= 0) throw preparationTimeout()
        const spec = executor.resolve({ command: request.description, workdir: request.cwd, timeoutMs: onExpiry === 'kill' ? budget : request.timeoutMs,
          signal: operation.signal, onExpiry, dshEnv: request.dshEnv, sandboxPolicy: policy })
        // Core owns runtime kill deadlines. For Jobs, onExpiry:none keeps running
        // after the bounded preparation phase and the caller's promotion deadline.
        operation.stopDeadline()
        proc = await executor.executeArgv(spec, [request.executable, ...request.argv])
        const originalResult = proc.result.bind(proc)
        const originalDone = proc.done
        // Keep the original producer exit/status even when decoding/storage fails.
        const result = () => resultPromise ??= originalResult().then(value => ({ ...value, status: proc.status, timeoutMs: request.timeoutMs,
          cwd: request.cwd, sandbox: { mode: policy.mode, denied: false },
          outputFacts: outputFacts(),
        }))
        const finished = originalDone.then(async () => {
          // Normal settlement must not be relabelled as an owner cancellation
          // merely because its now-finished execution scope is being released.
          producerSettled = true
          try { await result() } catch { /* result() preserves provider rejection */ }
          await release()
        }, async error => { producerSettled = true; await release(); throw error })
        // Ensure lifecycle cleanup is observed even before a foreground reader attaches.
        finished.catch(() => {})
        return { get status() { return proc.status }, get exitCode() { return proc.exitCode }, get signal() { return proc.signal },
          observed: proc.observed, readOutput: () => proc.readOutput(), kill: () => {
            if (proc.status !== 'running') return false
            cancel('native execution explicitly killed')
            return proc.kill()
          },
          done: finished, result: async () => { await finished; return result() },
          outputFacts,
          sandbox: { mode: policy.mode, denied: false },
```

</details>

**依据 4 · 源码核查**：[src/bash-tool.js:475-486](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/bash-tool.js#L475-L486)

前台期限与可选显式后台契约。

<details>
<summary>查看原文（12行）</summary>

```text
          },
          command: { type: 'string', required: true, description: 'The bash command to execute.' },
          timeoutMs: {
            type: 'number',
            description: promote
              ? 'Timeout in milliseconds. The executor applies its configured default and cap; on expiry the command moves to the background as a job instead of being killed.'
              : 'Timeout in milliseconds. The executor applies its configured default and cap, and kills the command on expiry.',
          },
          workdir: { type: 'string', description: 'Working directory for this command. Defaults to the session workspace; a relative path is resolved against it.' },
          ...(background ? {
            run_in_background: { type: 'boolean', description: 'Run in the background and return a job id immediately (collect with job_output, stop with job_kill). No timeout applies.' },
          } : {}),
```

</details>

**依据 5 · 源码核查**：[src/bash-tool.js:548-560](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/bash-tool.js#L548-L560)

自动转后台注册失败回到前台。

<details>
<summary>查看原文（13行）</summary>

```text
            let attached
            try {
              attached = startJob(jobs, args, exec, spec)
            } catch (error) {
              ctx.logger?.warn?.(`bash: job registration refused, running in the foreground with the timeout kill instead: ${String(error)}`)
            }
            if (attached !== undefined) return waitOnJob(jobs, attached, exec, spec)
          }
          const spec = executor.resolve({ ...request, signal: exec.signal })
          const foreground = await executor.execute(spec)
          const result = await foreground.result()
          if (result.aborted) throw toolAborted(llmModule?.HarnessError)
          return { kind: 'foreground', ...canonicalBashResult(result, spec.workdir) }
```

</details>

**依据 6 · 作者声明**：[docs/experimental-native-verification.md:5-28](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/docs/experimental-native-verification.md#L5-L28)

作者旧版验证报告，区分实际 Core、桩与未测情况。

<details>
<summary>查看原文（24行）</summary>

```text
> 验证日期：2026-10-14（保留此前轮次记录）。以下结果适用于所列运行环境，不代表所有宿主版本或生产场景均已通过。

## 1. 验证基准与结果

- 当前实验基线：[上游 v0.39.4（52da331）](https://github.com/KannaKuron/dsh-gitbash-shell/commit/52da331)。前置 PR #24 已合并；2026-10-15 第一轮设计评审后由 v0.39.3（114dcde）rebase 而来，本节末尾补记本轮验证。
- 测试环境：**DSH Core 0.2.1-alpha.2**、Node 24.13.0、Windows / Git for Windows。
- 新native功能按公开能力探测启用；既有兼容版本范围之外的实际覆盖情况见后文待验收项。
- 最终普通全仓：**232 tests / 232 pass / 0 fail / 0 skip / 0 cancel，exit0**。
- 最终实际Core完整preview：**85 tests / 85 pass / 0 fail / 0 skip / 0 cancel，exit0**。
- 语法与`git diff --check`通过；npm dry-run确认新源码包含于发布文件集合。Dry-run不是已安装/发布，也不是新增生产版本。

计数是Node test runner报告口径，包括子测试/套件；不同轮次或独立复跑有重叠，**不累加为独立覆盖数量**。232/85 是当前完整脚本结果，不意味着每项都是真生产进程场景。

## 2. 证据等级

| 等级 | 本提案实例 | 可以证明 | 不能证明 |
|---|---|---|---|
| 静态/源码与公开契约 | 配置、SDK/types、实际安装导出、匹配MSYS因果资料 | 实现依赖与约束、提出机制假设 | 新OS沙箱可用或任意版本兼容 |
| 纯单元/受控注入 | 请求parser、预算、流异常、字段schema、路由矩阵 | 确定性输入输出与拒绝/收尾规则 | 真实磁盘故障或任意producer行为 |
| 实际Core + 禁止spawn桩 | ToolRuntime/scoped装配/提示组装 | 真Core结构化拒绝、零admission、注册/卸载/隐藏 | 生产GUI或真实native程序跑通 |
| 实际Core + 受控native程序 | LocalSubprocessRuntime/executeArgv/Jobs、固定bytes/READY/LATE | 所测环境中的真实argv、编码、kill/quiet/promotion与owner行为 | 全部原生parser、网络/SSH、真受限token |
| 实际PTC + Node/fs | ToolRuntime→NodePtcRuntime→LocalSubprocessRuntime→Node fs读自有输入 | 完整值helper子分发、动态路径、route/tag保持 | 完整插件apply/生产用户policy/模型自主选择 |
| 实际Core提示/SDK生成 | SystemPrompt.assemble普通/PTC及工具visibility | Agent将收到正确的说明与可见binding | 模型每次一定选对 |
| 未执行 | 生产GUI/full apply/LLM选择、OS权限、吞吐/RSS/retention | 仅列为待验收 | 不能作为通过项 |
```

</details>

#### 缺口

- 旧验证报告标注 Core 0.2.1-alpha.2，未复现当前版本的空格、Unicode、编码和 Jobs 交接。
  **影响**：无法量化路径正确率或 Windows 子进程终止覆盖。
  **进一步探讨**：用受控参数回显和只写一次的文件验证最终 argv、结果状态及实际副作用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何选择试用条件，并确认撤销与单位任务成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

包要求 Node >=24.9.0、DSH >=0.2.2-rc.1，登记的兼容版本仅 0.2.2-rc.1。Git Bash 需要 Git for Windows，原生和后台能力另需宿主公开契约。侧栏补丁可能配置 Better Sidebar 的 shell，dsh-ops 并存还可能经配置编辑器写内置模式覆盖。运行时退出回读已记录字段，后改配置应优先；若先停宿主后卸载、恢复失败或辅助组件缺失，仍要核对 profile，不能仅以 npm 包消失判断。首轮使用独立 profile，不装可选联动，保留默认权限门禁，受限先核对拒绝；只在用户原已授权的隔离全访问会话核对无副作用 Bash 结果。失败时在宿主运行时停用并核查配置，再新建原生 PowerShell 会话。以正确选择解释器、得到预期输出且受限步骤没有副作用为合格任务。首次计 Git for Windows、安装及配置人工，持续计每任务的工具选择、转换检查和启动开销，故障计回退 PowerShell、恢复 profile 和重新验证。现金、人工分钟与资源开销均未实测。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:18-39](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/package.json#L18-L39)

Node、DSH 与已列兼容版本。

<details>
<summary>查看原文（22行）</summary>

```text
  "engines": {
    "node": ">=24.9.0",
    "dsh": ">=0.2.2-rc.1"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-settings"
      ],
      "platform": "web"
    },
    "compatibility": {
      "dsh": ">=0.2.2-rc.1",
      "dshReleases": {
        "0.2.2-rc.1": "compatible"
      }
    }
```

</details>

**依据 2 · 源码核查**：[package.json:67-83](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/package.json#L67-L83)

宿主 peer 及可选 FastCtx 依赖。

<details>
<summary>查看原文（17行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh": ">=0.2.2-rc.1",
    "@deepseek-ai/dsh-bash-sandbox": ">=0.0.1-rc.1",
    "@deepseek-ai/schemastery": "^3.19.0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh": {
      "optional": true
    },
    "@deepseek-ai/dsh-bash-sandbox": {
      "optional": true
    }
  },
  "optionalDependencies": {
    "@dsh-ops/fastctx-win32-x64": "0.2.1"
  },
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:31-50](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/cordis.patch.yml#L31-L50)

可选侧栏行的配置影响。

<details>
<summary>查看原文（20行）</summary>

```text
# Edit the dsh-better-sidebar row when it is mounted (their own bundle
# inserted it; our bundle is later in the stack, so this edit lands on the
# existing row — empty-config rows absorb it, missing rows warn and skip, so
# profiles without the sidebar are unaffected). The boot-time shell
# resolution drives BOTH the spawn chain and the client tab title
# ('shell.get' name), so pointing config.shell at Git Bash on Windows makes
# the sidebar terminal open bash AND display a 'bash' tab label; per-open
# settings overrides (which this plugin also fills) then agree with it.
#
# The path is PROBED at boot (v0.39.0, hardening the v0.15-era hardcode that
# broke on Git installs outside the default directory — issue #13): the two
# standard install roots are probed via node:fs, and when neither exists the
# value resolves to '' which the sidebar treats as "no override" (the
# per-open settings path and the terminal adoption remain the authoritative
# channels on such machines).
- id: better-sidebar
  name: dsh-better-sidebar
  config:
    shell: !!js >-
      (() => { try { if (process.platform !== 'win32') return ''; const fs = process.getBuiltinModule('node:fs'); const pf = (process.env.ProgramFiles ?? process.env.PROGRAMFILES ?? 'C:\\Program Files').replace(/[\\/]+$/, ''); const lad = (process.env.LOCALAPPDATA ?? '').replace(/[\\/]+$/, ''); const candidates = [pf + '\\Git\\bin\\bash.exe', lad === '' ? '' : lad + '\\Programs\\Git\\bin\\bash.exe']; for (const candidate of candidates) { if (candidate !== '' && fs.existsSync(candidate)) return candidate } return '' } catch { return '' } })()
```

</details>

**依据 4 · 源码核查**：[src/index.js:1788-1809](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/index.js#L1788-L1809)

配置接管和销毁恢复接线。

<details>
<summary>查看原文（22行）</summary>

```text
        // Own retries and the in-flight edit before starting either. Disposal
        // waits for adoption, then restores only journalled fields.
        opsEditorCtx.effect(() => async () => {
          closed = true
          clearTimeout(retry)
          await pending
          try { console.log(`${TAG} ${opsRestoreReport(await restoreOpsBash(opsEditorCtx.configEditor))}`) }
          catch (error) { console.log(`${TAG} dsh-ops bash restore crashed: ${error?.message ?? error}`) }
        }, 'gitbash: dsh-ops bash removal restore')
        const run = () => {
          if (closed) return
          pending = (async () => {
            attempts++
            const result = await adoptOpsBashRemoval(opsEditorCtx.configEditor)
            if (!closed && result.status === 'skip-row-absent' && attempts < 6) {
              retry = setTimeout(run, 3000)
              retry.unref?.()
            }
            console.log(`${TAG} ${opsAdoptReport(result)}`)
          })().catch(error => console.log(`${TAG} dsh-ops bash removal failed: ${error?.message ?? error}`))
        }
        run()
```

</details>

**依据 5 · 源码核查**：[src/ops-adopt.js:371-419](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/ops-adopt.js#L371-L419)

只还原有记录字段并回读验证。

<details>
<summary>查看原文（49行）</summary>

```text
export async function restoreOpsBash(editor) {
  if (!editor || typeof editor.configuration !== 'function') return { status: 'restore-failed', rows: [], detail: 'the config editor is unavailable' }
  const store = opsOwnership(editor)
  return store.run(async () => {
    const receipt = await store.read()
    const rows = opsRowsOf(editor)
    if (!rows.length) return { status: 'skip-row-absent', rows: [], detail: 'no dsh-ops row is mounted' }
    const results = []
    for (const row of rows) {
      const modes = OPS_MODES.filter(mode => Object.hasOwn(receipt.fields, mode))
      if (!modes.length) continue
      if (typeof editor.edit !== 'function') return { status: 'restore-failed', rows: results, detail: 'config editor exposes no edit()' }
      try {
        const restored = new Map(modes.filter(mode => boolOf(row, 'override', mode, 'bash') === false).map(mode => {
          const original = receipt.fields[mode]
          return [mode, original.hadOverride ? original.value : row.inherited?.[mode]?.bash]
        }))
        await editor.edit(row.entry, (current, inherited) => {
          const next = isRecord(current) ? { ...current } : {}
          for (const mode of modes) {
            // A later user choice (including removal of the override) wins.
            if (boolOf(row, 'override', mode, 'bash') !== false || next[mode]?.bash !== false) { restored.delete(mode); continue }
            const original = receipt.fields[mode]
            const section = { ...next[mode] }
            // Restore the ORIGINAL SHAPE, not merely the original effective
            // value: an absent override must become absent again, otherwise a
            // user who never chose anything is left with an explicit "true"
            // row that the settings UI reports as an override.
            if (original.hadOverride) section.bash = original.value
            else delete section.bash
            if (Object.keys(section).length) next[mode] = section
            else delete next[mode]
            restored.set(mode, original.hadOverride ? original.value : inherited?.[mode]?.bash)
          }
          return next
        })
        const after = freshRowOf(editor, rowIdOf(row))
        if (!after) throw new Error('row vanished during restore')
        for (const [mode, expected] of restored) {
          const actual = boolOf(after, 'override', mode, 'bash') ?? boolOf(after, 'inherited', mode, 'bash')
          if (actual !== expected) throw new Error(`restore did not stick for ${mode}`)
        }
        for (const mode of modes) {
          results.push({ id: rowIdOf(row), mode, action: restored.has(mode) ? 'restore' : 'unchanged' })
          delete receipt.fields[mode]
        }
        await store.write(receipt)
      } catch (error) {
        return { status: 'restore-failed', rows: results, detail: `owned override restore failed: ${error?.message ?? error}` }
```

</details>

**依据 6 · 作者声明**：[README.md:52-68](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/README.md#L52-L68)

作者描述 dsh-ops 0.5.0 与离线卸载边界。

<details>
<summary>查看原文（17行）</summary>

```text
- **与 dsh-ops 0.5.0 并存:bash 只留一份(v0.50.0;只支持 0.5.0 单行)**:宿主机制决定「可见但拒绝」到不了「看不见」——
  `tools.restrict` 只能过滤继承面,而 `ops_bash` 注册在 agent 自有层。0.5.0 把 0.4.x 的组件行/mode 行收成
  一行 `dsh-ops`,shell 发布改由四个内置模式 section 的 `bash` 开关控制。于是本插件经官方 configEditor 通道
  给 `minimal`/`standard`/`ptc`/`cordis` 各写 `bash:false`:安装本插件时这四个模式的 `ops_bash` 不再注册;
  **`global.bash`、`presets.<自定义 id>`、ops 的 pwsh7 overlay、文件/后台增强全部不动**
  ——`bash` 门只套在 `mountSessionBash` 上,pwsh 走 `mountBundledPwsh` 独立路径。
  0.5.0 已移除旧 `dsh-ops-shell`/`dsh-ops-file`/`dsh-ops-mode-*` 行,本版也删掉对应接管逻辑:
  旧 dsh-ops 的 profile 不再被本插件去重,请先升级 dsh-ops 0.5.0(或留在本插件 v0.49.0)。
  **停用或卸载本插件的瞬间自动还原**(dispose 钩子只撤回自己写的 `bash:false`,同 section 的其它设置原样保留),
  重新启用又会自动接管。接管前会在 profile 目录的 `.gitbash-ops-ownership.json` 中原子记录实际修改字段的原值，
  重启后仍可精确恢复；用户原先设置的 `bash:false` 不会被认领或删除。升级前留下且没有记录的 `false` 保持原样，
  不猜测它属于用户还是旧插件。三个边界:①关机状态下卸载的残余覆盖,可用 dsh-ops 设置卡恢复默认,或重新安装/停用本插件
  触发还原;②停用时若覆盖值已被你手动改回 `true`,视为你的选择、不动它;③**0.5.0 只对四个内置模式生效**:
  dsh-ops 不再全局接入未列出的自定义 preset,本插件的 `ptc-cordis` 与「· Git Bash」变体 id 不在四个内置模式中,
  那些会话里 dsh-ops 不会发布 `ops_bash`;dsh-ptc-cordis-preset v0.26.0 自己挂 `dsh-ops/integration` 取文件工具,
  但保持 `shell:false`,所以我们的 bash 仍是唯一命令工具。
  无设置开关——想用 `ops_bash` 就停用本插件,还原是自动的。
```

</details>

**依据 7 · 作者声明**：[README.md:311-320](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/README.md#L311-L320)

作者给出的卸载与回归原生方式。

<details>
<summary>查看原文（10行）</summary>

````text
## 卸载

```sh
dsh plugin --profile web remove dsh-gitbash-shell
```

或删除 profile`package.json` 中依赖 + `dsh.profile.bundles` 中的条目后
`dsh plugin --profile web install`。卸载并重启后,未改过的 `* -gitbash`
preset 会被插件自动清理;宿主官方 PowerShell 执行器原样保留(本插件从未替换它),
官方 `pwsh` 工具不再被隐藏。
````

</details>

#### 缺口

- 没有读回固定 npm 包、真实 profile 和停用结果。
  **影响**：版本兼容与恢复人工成本未知。
  **进一步探讨**：独立 profile 对照安装前后、宿主运行时停用和重启后的配置及工具面。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何检验统一路径能否降低切换成本，同时保留权限拒绝？

**研究主题**：新假设与验证

#### 完整回答

可试验在工具结果旁显示执行器、转换前后的工作区路径与门禁状态。将现有插件、原生 PowerShell 和候选提示对照，用含空格、中文的同一工作区，完成受限拒绝和用户已授权的只读结果对照。记录每次首次正确选择工具的耗时、错误参数数、受限哨兵变更和退出重做。候选比现有插件少做人工路径核对才有增量。若出现任何受限副作用，或者路径错误率和时间均无改善，应推翻假设。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:1359-1376](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/index.js#L1359-L1376)

现有路径包装提供对照。

<details>
<summary>查看原文（18行）</summary>

```text
          if (dialect.posixPaths && dialectApplies(dialect, exec && exec.agent)) {
            echo = true
            const env = dialect.virtualMounts ? buildTranslateEnv(readConfiguredBashPath()) : null
            echoEnv = env
            if (exec && exec.arguments && typeof exec.arguments === 'object') {
              const translated = translateDispatch(exec, dialect, env, programLanguageFor(ctx, exec?.agent))
              if (translated !== exec.arguments) exec.arguments = translated
            }
          }
        } catch { /* never block a call on translation */ }
        if (!echo) return next()
        return next().then((result) => {
          try {
            if (!result || typeof result !== 'object' || result.isError !== false) return result
            if (!result.value || typeof result.value !== 'object') return result
            const value = rewriteResultPaths(exec && exec.name, result.value, echoEnv)
            return value === result.value ? result : { ...result, value }
          } catch { return result }
```

</details>

**依据 2 · 源码核查**：[src/shell.js:210-231](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/shell.js#L210-L231)

明确的策略路线和无约束结果标签。

<details>
<summary>查看原文（22行）</summary>

```text
  gitBashRoute(spec) {
    const mode = spec.sandboxPolicy?.mode
    if (mode === 'danger-full-access') return { mode, unconfined: false }
    if (process.platform === 'win32') {
      if (this.experimentalEnabled?.() !== false) throw this.policyUnavailableError(mode)
      // Exact legacy opt-out: unresolved policy still delegates to the host.
      if (mode !== undefined) return { mode, unconfined: true }
    }
    return undefined
  }

  warnConfinedUnconfined(mode) {
    if (this._warnedUnconfined) return
    this._warnedUnconfined = true
    console.log('dsh-gitbash-shell: experimentalNative is OFF. Requested mode ' + mode
      + ' uses an UNCONFINED Git Bash route: shell file-write restrictions are NOT enforced. '
      + 'Official file-tool policy is separate; never bypass its denial through shell.')
  }

  routeSandbox(route) {
    if (route.unconfined) this.warnConfinedUnconfined(route.mode)
    return { mode: route.mode, denied: false, ...(route.unconfined ? { enforcement: 'unconfined' } : {}) }
```

</details>

**依据 3 · 源码核查**：[src/native-executor.js:251-276](https://github.com/KannaKuron/dsh-gitbash-shell/blob/91e7ed7c221e9f360023ed1636567d5ec16e18dd/src/native-executor.js#L251-L276)

执行句柄和输出事实提供观测点。

<details>
<summary>查看原文（26行）</summary>

```text
        proc = await executor.executeArgv(spec, [request.executable, ...request.argv])
        const originalResult = proc.result.bind(proc)
        const originalDone = proc.done
        // Keep the original producer exit/status even when decoding/storage fails.
        const result = () => resultPromise ??= originalResult().then(value => ({ ...value, status: proc.status, timeoutMs: request.timeoutMs,
          cwd: request.cwd, sandbox: { mode: policy.mode, denied: false },
          outputFacts: outputFacts(),
        }))
        const finished = originalDone.then(async () => {
          // Normal settlement must not be relabelled as an owner cancellation
          // merely because its now-finished execution scope is being released.
          producerSettled = true
          try { await result() } catch { /* result() preserves provider rejection */ }
          await release()
        }, async error => { producerSettled = true; await release(); throw error })
        // Ensure lifecycle cleanup is observed even before a foreground reader attaches.
        finished.catch(() => {})
        return { get status() { return proc.status }, get exitCode() { return proc.exitCode }, get signal() { return proc.signal },
          observed: proc.observed, readOutput: () => proc.readOutput(), kill: () => {
            if (proc.status !== 'running') return false
            cancel('native execution explicitly killed')
            return proc.kill()
          },
          done: finished, result: async () => { await finished; return result() },
          outputFacts,
          sandbox: { mode: policy.mode, denied: false },
```

</details>

#### 缺口

- 没有执行对照。
  **影响**：提示效果与选工具习惯均未知。
  **进一步探讨**：同一固定宿主随机交换三种视图顺序并核对哨兵。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
