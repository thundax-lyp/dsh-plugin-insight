# Almost Full Access

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[269ab86](https://github.com/Alnita-M/dsh-Almost_Full_Access/tree/269ab865fd02a4dded171eaecc40b1255f5df227)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Alnita-M/dsh-Almost_Full_Access) [![npm 30d 1,006](https://img.shields.io/static/v1?label=npm+30d&message=1%2C006&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-almost-full-access) [![最新发布 2026-10-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-almost-full-access)
<!-- END META -->

> **功能**：在DSH完全访问预设上，为部分命名shell工具加入确定性/子代理审查、人工审批面板和命令记忆。

> **亮点**：确定性风险优先、无工具审查与可见审批/错误构成低中断的权限交互原型；但只对已覆盖路径成立，不能替代宿主统一授权。已有增量与归因见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：完全访问前提下，缺会话/预设、未命名工具等条件可绕过门控；短哈希复用未绑定会话/cwd/脚本版本，审批端点也不独立绑定操作者。局部超时拒绝与随机ID不足以证明整体安全，见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · “介于工作区写入和完全访问之间”由什么机制实现，实际保护范围多大？](#detail-section-11)
  - [Q02 · 从一次工具调用到批准或拒绝，失败时是否统一拒绝？](#detail-section-12)
  - [Q03 · 记忆真的按会话和完整命令绑定吗，审批者能看到并授权什么？](#detail-section-13)
  - [Q04 · 安装、持续审阅、失败恢复和退出分别承担什么？](#detail-section-14)
  - [Q05 · 怎样的改动才可能形成可信的权限模式，而非增加一个审查提示？](#detail-section-15)
  - [Q06 · 此固定版本适合作为日常安全权限档吗，研究原型如何退出？](#detail-section-16)
  - [Q07 · 跨插件上下文契约还能成立吗，当前ZCode实现如何改变判断？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望减少工作区外可逆操作审批、仍确认危险命令的用户；作为安全权限用途，必须验证全部真实执行入口。它是原生DSH插件，但底层仍是完全访问预设。见[Q01](#research-q01)。

相对直接Full Access增加部分命令审阅；相对原生workspace-write减少底层隔离。主贡献是规则、审查和审批交互组合，不能把宿主沙箱/工具/子代理归为本插件新保护机制。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 权限档与门控 | 完全访问上检查部分shell命令 | 非新OS沙箱，未知预设/工具可能不进入门控 |
| 规则与子代理 | 直接风险锁定、模糊命令结构化审查 | 子代理无工具；判safe不证明实际无副作用 |
| 人工审批 | 面板/文本回退、拒绝/记忆及超时 | 身份边界依宿主，显示和复用有上下文限制 |
| 诊断/日志 | 看队列、计数与审计线索 | best-effort，非完整执行/恢复证明 |

**流程与依赖**

底层完全访问使服务/身份条件本身成为保护前提；先保留profile/包原件，隔离研究不能被当作普通插件试装。依赖与退出表见[Q04](#research-q04)。

把进入门控、获得批准、实际执行和撤销底层权限分别核对；退出先切回原生档位，再停门控并恢复原件。操作步骤见[Q04](#research-q04)。

**效果与成本**

成本不止子代理调用和少量日志，还含安全覆盖验证、逐条核实与可能不可逆副作用恢复；缓存省下的审批不能直接计为净省时。四阶段表见[Q04](#research-q04)。

可确认局部命令分流/交互，不能确认全入口保护或安全净收益；日志计数与判safe都不是副作用收据。效果表见[Q04](#research-q04)，按领域拆开的比较见[Q07](#research-q07)。

> **思考**：完全访问前提下，缺会话/预设、未命名工具等条件可绕过门控；短哈希复用未绑定会话/cwd/脚本版本，审批端点也不独立绑定操作者。局部超时拒绝与随机ID不足以证明整体安全，见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：确定性风险优先、无工具审查与可见审批/错误构成低中断的权限交互原型；但只对已覆盖路径成立，不能替代宿主统一授权。已有增量与归因见[Q01](#research-q01)、[Q02](#research-q02)。

确定性优先、空工具审查、等待超时拒绝和界面错误可借鉴；必须同时保留缺身份直通、实例短键与宿主入口依赖。跨比较已按当前ZCode的profile缓存/schema/partial及认证围栏重建，见[Q02](#research-q02)、[Q03](#research-q03)、[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

完全访问前提下，缺会话/预设、未命名工具等条件可绕过门控；短哈希复用未绑定会话/cwd/脚本版本，审批端点也不独立绑定操作者。局部超时拒绝与随机ID不足以证明整体安全，见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

日常安全权限用途不推荐；只保留无敏感权限的隔离研究边界。没有真实执行未获批准即为零的验收前，不因几次通过升级使用，详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持有限审查/审批接线及明确的保护边界缺口；未复现攻击或进行宿主验收。日常安全权限用途不推荐，底层授权与跨组件契约仅为未验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、SECURITY.md、cordis.patch.yml、lib/analyze.js、lib/client.js、lib/index.js、package.json、scripts/install.mjs、scripts/patch-lib.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整固定inventory；定向核manifest、权限补丁、SECURITY/README、Host会话/预设解析、命名工具/分析/子代理/缓存、HTTP与文本审批、Client决策/截断提示、安装器及整块替换。跨项定向核当前固定余额侧栏实际probe接线、ZCode缓存/根/围栏与plugin-balance自定义凭据目的地，原件另保存。未全审全部正则/安装器/platform、宿主或外部网络实现，未执行目标/安全实验。
- 下一步：没有运行目标、安装器、真实命令、模型、账户或攻防。后续先用隔离系统验证工具覆盖/身份故障/同文本异脚本/截断与退出，再分别验账户、历史范围及凭据目的地；不把潜在问题写成已复现故障。见[Q05](#research-q05)、[Q07](#research-q07)。

**分析版本**

- **仓库**：[Alnita-M/dsh-Almost_Full_Access](https://github.com/Alnita-M/dsh-Almost_Full_Access)
- **版本号**：1.2.0（[固定提交 269ab86](https://github.com/Alnita-M/dsh-Almost_Full_Access/tree/269ab865fd02a4dded171eaecc40b1255f5df227)）
- **版本日期**：2026-10-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

先将真实执行边界、缺身份默认值与精确授权复用做成可否定的安全验收，再评是否需要跨组件上下文描述；账户、历史范围与凭据目的地必须分别约束。方案未实现/未执行，最小验证见[Q05](#research-q05)、[Q07](#research-q07)。

没有运行目标、安装器、真实命令、模型、账户或攻防。后续先用隔离系统验证工具覆盖/身份故障/同文本异脚本/截断与退出，再分别验账户、历史范围及凭据目的地；不把潜在问题写成已复现故障。见[Q05](#research-q05)、[Q07](#research-q07)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 390 | — | — | 4770 |
| .js | source | 3 | 1255 | 1052 | 154 | — |
| .mjs | source | 3 | 1098 | 881 | 137 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/Alnita-M/dsh-Almost_Full_Access/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查完全访问前提下的命令门控、审批身份与上下文复用，重做跨组件依赖假设，并判断日常安全权限用途是否成立。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · “介于工作区写入和完全访问之间”由什么机制实现，实际保护范围多大？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是包版本1.2.0、带Host/Client和permission补丁的原生DSH插件，主要为希望减少工作区外可逆操作审批、又保留危险命令确认的用户提供操作便利。作者同时在SECURITY中声明命令审批层不代替操作系统沙箱，且只覆盖命名shell工具。真实需求是减少中断；若把它用于保护重要机器，合格交付还必须保证所有实际副作用入口遵守授权和故障默认值。

补丁里的almost-full-access实际设置sandbox: danger-full-access、approval: never。它没有建立介于两种原生沙箱之间的新OS隔离层，而是先给完全访问，再靠本插件的工具拦截、确定性文本规则、无工具子代理、审批界面/文本回退和日志约束部分命令。原生权限/沙箱、工具事件、子代理和Web服务都来自宿主，不归为本插件原创。

相对直接Full Access，这增加若干命令的审查和人工介入；相对workspace-write，它减少了底层隔离，因此便利不能自动当安全增益。其他命名工具、无可识别command、未能识别预设等分支都需单独看，不能把“确定性风险不可被模型改判”扩写成完整执行安全保证。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-5](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/package.json#L1-L5)

包身份、版本和作者用途。

```text
{
  "name": "dsh-almost-full-access",
  "version": "1.2.0",
  "description": "dsh-Almost Full Access - 介于 workspace-write 与 Full access 之间的权限模式：每条命令先经确定性规则 + 子代理审查，危险命令弹出风格A简约审批面板（允许/拒绝/记住本次会话），支持会话记忆自动放行与审计日志。静态插件包，支持桌面版（Electron）与 Web 版 profile，重启后自动加载。",
  "private": false,
```

**依据 2 · 源码核查**：[cordis.patch.yml:8-26](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/cordis.patch.yml#L8-L26)

底层权限与完全访问预设。

<details>
<summary>查看原文（19行）</summary>

```text
- id: permission
  config:
    presets:
      read-only:
        sandbox: read-only
        approval: ask
      workspace-write:
        sandbox: workspace-write
        approval: ask
      almost-full-access:
        sandbox: danger-full-access
        approval: never
        name: 🛡️ Almost Full Access
        description: Full file access with lightweight checks — only irreversible actions (deletes, uninstalls, formatting) and changes that affect normal boot or system/drivers require approval; dynamic/indirect commands are reviewed by a subagent before execution.
      danger-full-access:
        sandbox: danger-full-access
        approval: never

# 2) 插件本体挂载（Host 半区；Client 半区由 dsh.client 声明自动发现）
```

</details>

**依据 3 · 作者声明**：[SECURITY.md:5-6](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/SECURITY.md#L5-L6)

作者明确不替代OS沙箱。

```text
本插件是命令审查/审批层，不替代操作系统沙箱。发现安全问题请通过 GitHub Issues
（标记 `security`）或直接联系维护者报告，请勿公开披露可利用的 0day。
```

**依据 4 · 作者声明**：[SECURITY.md:19-27](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/SECURITY.md#L19-L27)

作者安全声明及命名工具范围。

````text
- 会话记忆仅存在于 Host 进程内存，键为命令哈希（同命令免重复审批），高风险
  （引导类）命令不可记忆；
- 确定性规则命中的命令锁定为必审批，LLM 子代理无法将其改判为 safe 放行；
- 审查提示词声明命令文本不可信（防提示注入），代码围栏对 ``` 做了转义；
- 命令在执行前被中断（abort）一律按拒绝处理（fail-closed）；
- 超时/降级一律按拒绝处理（fail-closed）；
- 审计日志写入 `$DSH_HOME/afaccess/afaccess.log`，常见密钥模式已脱敏；
- 门控覆盖 pwsh/bash/powershell/cmd 等 shell 执行工具；其他命令执行类工具
  （若宿主注册）不在审查范围，请在文档声明的边界内使用该预设。
````

**依据 5 · 源码核查**：[lib/index.js:109-130](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L109-L130)

所需服务、工具/预设名单和实例内缓存。

<details>
<summary>查看原文（22行）</summary>

```text
  const subagents = ctx.get('subagents')
  const userQuestions = ctx.get('userQuestions')
  const permissionPresets = ctx.get('permissionPresets')
  const sandboxPolicy = ctx.get('sandboxPolicy')
  const webServer = ctx.get('webServer')
  const sessions = ctx.get('sessions')
  if (subagents === undefined || userQuestions === undefined || webServer === undefined) {
    ctx.logger.warn('afaccess: inactive — required services unavailable')
    return
  }

  // A3：门控覆盖的 shell 执行工具名（可扩展；描述与文档按此边界声明）
  const GATED_TOOLS = new Set(['pwsh', 'bash', 'powershell', 'cmd', 'sh', 'zsh', 'fish', 'shell'])
  // v1.2.0：Almost Full Access 单一审查模式 —— 确定性规则只拦不可逆/系统级；
  // 动态/间接命令由 LLM 子代理审查兜底（同命令 5 分钟结果缓存，避免繁琐）
  const GATED_PRESETS = new Set(['almost-full-access'])
  const llmVerdictCache = new Map() // commandHash -> { verdict, impacts, ts }
  const LLM_CACHE_TTL = 300000
  const LLM_CACHE_MAX = 200
  const pending = new Map()
  const decidedCache = new Map()
  const remembered = new Map()
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从一次工具调用到批准或拒绝，失败时是否统一拒绝？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

Host的tools/pre-execute只处理GATED_TOOLS，跳过无Agent和审查子代理；currentPreset解析不到目标预设、command为空等情况直接next。sessionOf可从agent.session或sessions.get(agent.id)取会话，currentPreset异常则返回空串，因此身份/预设服务故障不是统一拒绝；缺少关键注入服务时apply还会直接返回，不挂门控。

进入审查后，analyzeCommand用当前workspace/workdir的文本规则评估。确定性impacts非空锁定为risky，不能被LLM改判safe；仅ambiguous时启动带结构化输出且toolFilter为空的子代理，提示含命令和目录。子代理异常/未完成降为risky并交人工，确定性或模型safe才next。模型判安全只是模型判断，不能证明脚本实际无副作用。

risky记录进入pending；浏览器轮询queue并POST决策。20秒后若最近30秒没有面板轮询，尝试userQuestions文本卡；10分钟未决、回退异常、abort都拒绝。批准才调用下游next，后续宿主仍可作其他决定。这里对已进入的审查/等待路径有明确拒绝分支，不能覆盖前述未进入门控的直通分支。审计异步best-effort，日志成功与否都不是命令已执行/未执行的独立收据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:163-172](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L163-L172)

会话解析失败返回undefined。

<details>
<summary>查看原文（10行）</summary>

```text
  function sessionOf(agent) {
    try {
      if (agent === undefined || agent === null) return undefined
      if (agent.session !== undefined && agent.session !== null) return agent.session
      if (sessions !== undefined && agent.id !== undefined && typeof agent.id === 'string') {
        return sessions.get(agent.id)
      }
    } catch (err) { }
    return undefined
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:190-198](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L190-L198)

预设解析异常返回空串。

```text
  // v1.1.1（dsh 0.1.1-rc.2 适配）：permissionPresets.current 签名由 (events) 变为 (session)
  function currentPreset(agent) {
    try {
      if (permissionPresets !== undefined) {
        const session = sessionOf(agent)
        if (session !== undefined) return permissionPresets.current(session) || ''
      }
    } catch (err) { }
    return ''
```

**依据 3 · 源码核查**：[lib/index.js:450-473](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L450-L473)

真实事件、工具/Agent/预设/command直通条件。

<details>
<summary>查看原文（24行）</summary>

```text
  // 否则 profile 补丁热重载（dsh-hmr）后重挂本插件会因同名工具重复注册而失败。
  ctx.effect(() => ctx.tools.register(diagTool), 'afaccess: diagnostic tool')

  // ============ 门控 ============
  ctx.on('tools/pre-execute', async (exec, next) => {
    if (!GATED_TOOLS.has(exec.name)) return next()
    const agent = exec.agent
    if (agent === undefined || reviewChildren.has(agent.id)) return next()

    const preset = currentPreset(agent)
    if (preset !== '') state.lastPreset = preset
    if (!GATED_PRESETS.has(preset)) return next()

    const args = exec.arguments
    const command = (args !== null && typeof args === 'object' && typeof args.command === 'string')
      ? args.command
      : (typeof args === 'string' ? args : '')
    if (command.trim() === '') return next()
    const workdir = (args !== null && typeof args === 'object' && typeof args.workdir === 'string')
      ? args.workdir : ''
    const workspace = sessionWorkspace(agent)
    if (workspace !== '' && workspace !== state.workspace) state.workspace = workspace
    audit('GATE ' + exec.name + ' preset=' + preset + ' cmd=' + command.slice(0, 200).replace(/\n/g, ' '))

```

</details>

**依据 4 · 源码核查**：[lib/index.js:475-514](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L475-L514)

确定性优先、模型缓存与异常/abort分支。

<details>
<summary>查看原文（40行）</summary>

```text
    audit('ANALYZE ambiguous=' + String(analysis.ambiguous) + ' impacts=' + JSON.stringify(analysis.impacts))

    // A4：确定性命中优先且锁定为必审批——LLM 只能裁决「仅模糊」的命令，不能把
    // 确定性风险改判为 safe 免审批（防止命令文本注入审查员改口）。
    let review
    if (analysis.impacts.length > 0) {
      state.counters.detRisky += 1
      review = { verdict: 'risky', impacts: analysis.impacts, source: 'deterministic' }
    } else if (analysis.ambiguous) {
      state.counters.llmReviewed += 1
      // v1.1.1：同命令 LLM 审查结果 5 分钟内复用（Safe 模式去繁琐；命令文本不变则结论不变）
      const cmdHash = hashCommand(command)
      const cached = llmVerdictCache.get(cmdHash)
      if (cached !== undefined && Date.now() - cached.ts < LLM_CACHE_TTL) {
        review = { verdict: cached.verdict, impacts: cached.impacts, source: 'llm' }
        audit('LLM-CACHE hit ' + cmdHash + ' -> ' + cached.verdict)
      } else {
        try {
          review = await runReview(command, exec.name, workdir, agent, exec.signal, workspace, analysis)
        } catch (err) {
          // A7：abort 不再 fail-open
          if (exec.signal.aborted) return abortDeny()
          review = { verdict: 'risky', impacts: ['命令审查子代理启动失败（' + String(err?.message ?? err) + '），无法自动判定安全性，需人工审批。'], source: 'degraded' }
        }
        if (review.source === 'llm') {
          if (llmVerdictCache.size >= LLM_CACHE_MAX) {
            const oldest = llmVerdictCache.keys().next().value
            if (oldest !== undefined) llmVerdictCache.delete(oldest)
          }
          llmVerdictCache.set(cmdHash, { verdict: review.verdict, impacts: review.impacts, ts: Date.now() })
        }
      }
    } else {
      state.counters.detSafe += 1
      review = { verdict: 'safe', impacts: [], source: 'deterministic' }
    }
    // A7：abort 一律拒绝，不进入下游执行链
    if (exec.signal.aborted) return abortDeny()
    if (review.verdict === 'safe') return next()

```

</details>

**依据 5 · 源码核查**：[lib/index.js:305-338](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L305-L338)

子代理prompt、结构化输出、空工具过滤和dispose。

<details>
<summary>查看原文（34行）</summary>

````text
    lines.push('```')
    // A4：代码围栏转义，防止命令内含 ``` 逃逸围栏注入伪系统指令
    lines.push(String(command).replace(/```/g, "'''"))
    lines.push('```')
    if (workdir) lines.push('工作目录：' + workdir)
    lines.push('')
    lines.push('输出要求：你的最终结论必须通过 structured_output 工具以 JSON 返回：')
    lines.push('- verdict："safe" 表示不存在上述三类风险；"risky" 表示存在至少一类风险')
    lines.push('- impacts：字符串数组，逐条用中文说明可能造成的具体影响；verdict 为 "safe" 时为空数组')
    const prompt = [{ type: 'text', text: lines.join('\n') }]
    const run = await subagents.start(providerName(), {
      label: 'almost-full-access-review',
      prompt,
      parent,
      signal,
      outputSchema: REVIEW_SCHEMA,
      toolFilter: { allow: [] }
    })
    reviewChildren.add(run.id)
    if (run.localAgent !== undefined) reviewChildren.add(run.localAgent.id)
    try {
      const result = await run.result
      if (result.stopReason !== 'completed' || result.structured === undefined) {
        return { verdict: 'risky', impacts: ['审查子代理未能正常完成（' + result.stopReason + '），无法确认命令安全性，需人工审批。'], source: 'degraded' }
      }
      const value = result.structured
      return {
        verdict: value.verdict === 'safe' ? 'safe' : 'risky',
        impacts: Array.isArray(value.impacts) ? value.impacts.map(String) : [],
        source: 'llm'
      }
    } finally {
      reviewChildren.delete(run.id)
      if (run.localAgent !== undefined) reviewChildren.delete(run.localAgent.id)
````

</details>

**依据 6 · 源码核查**：[lib/index.js:238-271](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L238-L271)

超时、abort与文本回退。

<details>
<summary>查看原文（34行）</summary>

````text
      }
      rec.settle = settle
      pending.set(rec.approvalId, rec)
      rec.timeoutTimer = setTimeout(() => {
        audit('TIMEOUT ' + rec.approvalId + ' auto-denied after 10min')
        settle('timeout-denied')
      }, 600000)
      rec.abortHandler = () => { settle('aborted') }
      try { rec.signal.addEventListener('abort', rec.abortHandler, { once: true }) } catch (err) { }
      // A9：仅当面板最近 30s 内未轮询（面板关闭/浏览器不可达）才降级文本审批卡
      rec.fallbackTimer = setTimeout(async () => {
        if (settled) return
        if (lastPollAt !== 0 && Date.now() - lastPollAt < 30000) return
        audit('FALLBACK ' + rec.approvalId + ' no client panel; falling back to text card')
        try {
          const answer = await userQuestions.ask({
            agent: rec.agent,
            signal: rec.signal,
            questions: [{
              id: 'afaccess-approve',
              header: '🛡️ Almost Full Access · 命令审批',
              question: '审查认为该命令可能影响系统，是否允许执行？',
              detail: ['命令：', '```', rec.command.slice(0, 3000), '```', '', '审查发现的具体影响：', rec.impacts.map((x, i) => (i + 1) + '. ' + x).join('\n'), '', '工作区目录：' + (rec.workspaceRoot || '（未知）')].join('\n'),
              options: [
                { label: '拒绝执行', description: '阻止该命令运行。' },
                { label: '允许执行', description: '放行该命令，由你承担影响。' }
              ]
            }]
          })
          const chosen = answer.answers.find((item) => item.id === 'afaccess-approve')
          settle(chosen !== undefined && chosen.selected.includes('允许执行') ? 'approved' : 'denied')
        } catch (err) {
          settle('denied')
        }
````

</details>

**依据 7 · 源码核查**：[lib/client.js:130-159](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/client.js#L130-L159)

真实POST与成功/错误显示。

<details>
<summary>查看原文（30行）</summary>

```text
		async function decide(approvalId, decision, remember) {
			if (store.deciding) return false;
			store.deciding = true;
			store.decideError = "";
			emit();
			try {
				const payload = { approvalId: approvalId, decision: decision };
				if (remember === true) payload.remember = true; // A5/A6：键由服务端绑定（回忆命令哈希），客户端只声明意图
				const res = await fetch("/api/afaccess/decide", {
					method: "POST",
					headers: { "content-type": "application/json", accept: "application/json", "x-afaccess-client": "1" }, // A5：CSRF 防护头
					body: JSON.stringify(payload)
				});
				const data = await res.json();
				if (data !== null && typeof data === "object" && data.ok === true) {
					store.decidedLocal[approvalId] = decision;
					setTimeout(() => {
						store.hideUntil[approvalId] = true;
						const left = store.items.filter((it) => it.approvalId !== approvalId && it.decision === null);
						if (left.length === 0) {
							store.clearedAt = Date.now();
							setTimeout(() => { store.clearedAt = 0; emit(); }, 1600);
						}
						emit();
					}, 1400);
					emit();
					store.deciding = false;
					return true;
				}
				store.decideError = "决策未生效: " + (data !== null && typeof data === "object" && data.reason ? data.reason : "unknown");
```

</details>

**依据 8 · 源码核查**：[lib/index.js:542-558](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L542-L558)

批准后才next，其他决定返回deny。

<details>
<summary>查看原文（17行）</summary>

```text
      state.counters.approved += 1
      audit('DECISION ' + record.approvalId + ' approved' + (record.auto ? ' (remembered)' : ''))
      return next()
    }
    state.counters.denied += 1
    audit('DECISION ' + record.approvalId + ' ' + decision + (record.auto ? ' (remembered)' : ''))
    const impactText = (record.impacts || []).map((line, i) => (i + 1) + '. ' + line).join('\n')
    return { kind: 'deny', reason: 'Almost Full Access：用户拒绝执行该命令。' + impactText.slice(0, 400) }
  })

  function abortDeny() {
    return { kind: 'deny', reason: 'Almost Full Access：命令审查/审批已被中止，命令未执行。' }
  }

  ctx.logger.info('afaccess: active (static)')
}

```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 记忆真的按会话和完整命令绑定吗，审批者能看到并授权什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

hashCommand是32位字符串哈希。remembered和LLM verdict cache都在插件实例闭包中，以commandHash为键，没有会话、工具、cwd、脚本内容版本等分区，也没有二次核对完整命令。LLM结果有5分钟TTL，人工记忆在取用时排除high/boot，但不是按会话存储的键。因此同文本在不同目录执行不同脚本不需要哈希碰撞就可能复用旧判断；不同命令短哈希碰撞另是潜在风险。命中需满足相应模糊/可记忆分支，本轮未构造可利用样例。

审批记录保留目录和预设等显示信息，记忆写入使用服务端rec.commandHash，避免客户端自由提供记忆键；但显示字段并未进入复用键。长命令记录只保留前8000字符并标truncated，面板显示截断提示；文本回退只展示前3000字符，实际command仍可更长。批准记录并不证明用户看到了完整执行文本。

queue路由自身没有身份检查，会返回当前待审批记录；decide检查POST、自定义头，以及存在时Origin/Referer的回环hostname，Origin缺省可通过，也不检查完整同源端口/协议或会话操作者。它不绑定独立的认证审批身份。真实可达性和匿名访问是否被宿主其他层挡住，必须另验，不能从本插件代码断言公网已可利用。随机approvalId降低猜测价值，也不能替代认证或精确上下文绑定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/analyze.js:325-329](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/analyze.js#L325-L329)

实际32位哈希。

```text
export function hashCommand(cmd) {
  let h = 5381
  for (let i = 0; i < cmd.length; i++) h = ((h << 5) + h + cmd.charCodeAt(i)) | 0
  return 'h' + (h >>> 0).toString(16)
}
```

**依据 2 · 源码核查**：[lib/index.js:124-130](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L124-L130)

缓存实例作用域，无会话分区。

```text
  const GATED_PRESETS = new Set(['almost-full-access'])
  const llmVerdictCache = new Map() // commandHash -> { verdict, impacts, ts }
  const LLM_CACHE_TTL = 300000
  const LLM_CACHE_MAX = 200
  const pending = new Map()
  const decidedCache = new Map()
  const remembered = new Map()
```

**依据 3 · 源码核查**：[lib/index.js:275-290](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L275-L290)

人工记忆按短哈希复用，排除部分高危分支。

<details>
<summary>查看原文（16行）</summary>

```text

  function requestApproval(rec) {
    // A5：随机 approvalId，避免顺序 ID 可枚举
    rec.approvalId = 'afacc-apr-' + randomUUID().replace(/-/g, '').slice(0, 12)
    // A6：记忆键 = 命令哈希（同命令免重复审批）；高风险（引导类）不可记忆
    if (rec.severity !== 'high' && (rec.category || '').indexOf('boot:') !== 0) {
      const mem = remembered.get(rec.commandHash)
      if (mem !== undefined) {
        rec.decision = mem
        rec.auto = true
        state.counters.autoDecided += 1
        audit('AUTO ' + rec.approvalId + ' key=' + rec.commandHash + ' category=' + rec.category + ' -> ' + mem)
        return Promise.resolve(mem)
      }
    }
    audit('APPROVAL ' + rec.approvalId + ' source=' + rec.source + ' severity=' + rec.severity + ' category=' + rec.category + ' cmd=' + rec.command.slice(0, 120).replace(/\n/g, ' '))
```

</details>

**依据 4 · 源码核查**：[lib/index.js:486-505](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L486-L505)

模型判断TTL与键。

<details>
<summary>查看原文（20行）</summary>

```text
      const cmdHash = hashCommand(command)
      const cached = llmVerdictCache.get(cmdHash)
      if (cached !== undefined && Date.now() - cached.ts < LLM_CACHE_TTL) {
        review = { verdict: cached.verdict, impacts: cached.impacts, source: 'llm' }
        audit('LLM-CACHE hit ' + cmdHash + ' -> ' + cached.verdict)
      } else {
        try {
          review = await runReview(command, exec.name, workdir, agent, exec.signal, workspace, analysis)
        } catch (err) {
          // A7：abort 不再 fail-open
          if (exec.signal.aborted) return abortDeny()
          review = { verdict: 'risky', impacts: ['命令审查子代理启动失败（' + String(err?.message ?? err) + '），无法自动判定安全性，需人工审批。'], source: 'degraded' }
        }
        if (review.source === 'llm') {
          if (llmVerdictCache.size >= LLM_CACHE_MAX) {
            const oldest = llmVerdictCache.keys().next().value
            if (oldest !== undefined) llmVerdictCache.delete(oldest)
          }
          llmVerdictCache.set(cmdHash, { verdict: review.verdict, impacts: review.impacts, ts: Date.now() })
        }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:519-536](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L519-L536)

显示记录截断，但commandHash来自完整命令。

<details>
<summary>查看原文（18行）</summary>

```text
    const record = {
      toolName: exec.name,
      command: command.length > 8000 ? command.slice(0, 8000) : command,
      truncated: command.length > 8000,
      commandHash: hashCommand(command),
      workdir,
      workspaceRoot: workspace,
      preset,
      source,
      severity,
      ruleIds,
      impacts: Array.isArray(review.impacts) && review.impacts.length > 0 ? review.impacts : ['（审查未给出具体影响描述）'],
      category,
      rememberable: severity !== 'high' && (category || '').indexOf('boot:') !== 0,
      ts: new Date().toISOString(),
      decision: null,
      auto: false,
      signal: exec.signal,
```

</details>

**依据 6 · 源码核查**：[lib/client.js:214-221](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/client.js#L214-L221)

面板显式截断提示。

```text
					onClick: () => setExpanded(!expanded),
					title: expanded ? "点击收起" : "点击展开全文"
				},
					React.createElement("code", null, props.record.command),
					React.createElement("button", { type: "button", className: "afacc-copy" + (copied ? " afacc-copied" : ""), "aria-label": "复制命令", onClick: doCopy }, copied ? "✓" : "⧉")
				),
				props.record.truncated === true ? React.createElement("div", { className: "afacc-truncated" }, "…(已截断)") : null
			);
```

**依据 7 · 源码核查**：[lib/index.js:253-262](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L253-L262)

文本回退只展示3000字符。

<details>
<summary>查看原文（10行）</summary>

````text
          const answer = await userQuestions.ask({
            agent: rec.agent,
            signal: rec.signal,
            questions: [{
              id: 'afaccess-approve',
              header: '🛡️ Almost Full Access · 命令审批',
              question: '审查认为该命令可能影响系统，是否允许执行？',
              detail: ['命令：', '```', rec.command.slice(0, 3000), '```', '', '审查发现的具体影响：', rec.impacts.map((x, i) => (i + 1) + '. ' + x).join('\n'), '', '工作区目录：' + (rec.workspaceRoot || '（未知）')].join('\n'),
              options: [
                { label: '拒绝执行', description: '阻止该命令运行。' },
````

</details>

**依据 8 · 源码核查**：[lib/index.js:350-397](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L350-L397)

queue与decide自身检查、记忆写入和决策。

<details>
<summary>查看原文（48行）</summary>

```text
  // ============ HTTP 端点（浏览器审批面板数据通道） ============
  ctx.effect(() => webServer.register({
    kind: 'exact',
    path: '/api/afaccess/queue',
    handler: (req, res) => {
      lastPollAt = Date.now()
      const now = Date.now()
      const items = []
      for (const rec of pending.values()) items.push(recordToWire(rec))
      for (const rec of decidedCache.values()) {
        if (rec.expiresAt > now) items.push(recordToWire(rec))
        else decidedCache.delete(rec.approvalId)
      }
      json(res, 200, { ok: true, items })
    }
  }), 'afaccess: queue route')

  ctx.effect(() => webServer.register({
    kind: 'exact',
    path: '/api/afaccess/decide',
    handler: async (req, res) => {
      if (req.method !== 'POST') return json(res, 405, { ok: false, reason: 'method' })
      // A5：CSRF 防护——要求同源面板携带的自定义请求头；若有 Origin/Referer 则必须是回环地址
      if (req.headers['x-afaccess-client'] !== '1') return json(res, 403, { ok: false, reason: 'origin' })
      const origin = req.headers['origin'] || req.headers['referer'] || ''
      if (origin !== '') {
        try {
          const hostname = new URL(origin).hostname
          if (!['127.0.0.1', 'localhost', '::1'].includes(hostname)) return json(res, 403, { ok: false, reason: 'origin' })
        } catch (err) {
          return json(res, 403, { ok: false, reason: 'origin' })
        }
      }
      const args = await readBody(req)
      if (args === null || typeof args !== 'object') return json(res, 400, { ok: false, reason: 'body' })
      const id = typeof args.approvalId === 'string' ? args.approvalId : ''
      const rec = pending.get(id)
      if (rec === undefined) return json(res, 200, { ok: false, reason: 'unknown' })
      if (rec.decision !== null) return json(res, 200, { ok: false, reason: 'already-decided' })
      const decision = args.decision === 'approved' ? 'approved' : 'denied'
      // A5/A6：记忆写入强制绑定服务端 rec.commandHash（忽略客户端提供的任意键）；
      // 高风险（引导类/高严重度）命令一律不可记忆
      if (args.remember === true && rec.severity !== 'high' && (rec.category || '').indexOf('boot:') !== 0) {
        remembered.set(rec.commandHash, decision)
        audit('REMEMBER key=' + rec.commandHash + ' category=' + rec.category + ' -> ' + decision)
      }
      rec.settle(decision)
      json(res, 200, { ok: true })
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、持续审阅、失败恢复和退出分别承担什么？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

安装器复制包并对所选profile写permission及插件insert块；replacePermissionBlock定位整个顶层permission条目并替换，因此可能覆盖用户其他自定义权限预设。写入所选profile逐项进行，并不是全体profile共同事务。本轮不运行安装器；操作前需要用户自行保留原包和原patch副本，不能把作者测试命令存在当安装/恢复已通过。

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 声明Node>=16及兼容DSH Host/Web | 必需 | 模块/工具事件和面板 | 声明不等当前宿主接口已验 |
| tools、预设、会话/沙箱服务 | 保护语义必需 | 定位门控范围与工作区 | 预设/会话解析失败可直通 |
| subagents、userQuestions、webServer | 当前apply必需 | 动态审查、审批和回退 | 缺服务则不挂门控 |
| 可用审查provider与允许外发的命令 | 模糊分支必需 | 结构化裁决 | 失败交人工，命令/目录可发模型 |
| 可写profile与原patch/包备份 | 安装/恢复必需 | 整块权限变更和回退 | 不可只保留新增permission条目 |
| 隔离测试机、无真实敏感权限 | 本研究原型边界 | 检查失败与副作用 | 不用于保护重要数据或生产机器 |

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 研究者在隔离环境备份包和profile原件，审阅差异 | 原权限预设可还原；不要自动跨profile覆盖 |
| 2 | 核实际工具/会话/预设服务，再选择该档 | 确认底层是Full Access且门控真的挂载 |
| 3 | 测确定性、模糊、审批和故障分支 | 看实际副作用和拒绝，不能只看计数/日志 |
| 4 | 模型/面板失败时核请求与等待状态 | 未获明确批准不执行；缺预设/工具另测直通边界 |
| 5 | 退出前先切回原生read-only/workspace-write并核底层权限 | 再停插件、恢复原patch/包并重启核对；只卸插件不保证撤销Full Access档 |

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 隔离环境/备份和运行资源；金额未知 | 审patch整体覆盖、工具/接口兼容和故障验证；工时未知 | 安全验收负担高于普通界面插件 |
| 持续使用 | 模糊命令模型调用、缓存和日志；数值未知 | 危险命令逐条核实、维护规则和入口名单 | 少弹窗不等总成本更低 |
| 失败恢复 | 重试审查、重建状态及可能不可逆损失；未知 | 核真实副作用/恢复权限、审计与系统状态 | 日志best-effort，误操作不一定可还原 |
| 退出 | 备份/日志留存与系统恢复资源；未知 | 切回原生权限、恢复profile与包、复核真实策略 | 停用门控本身不收回底层完全访问 |

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 命令分流 | 命名工具的确定性/子代理/审批链 | 全部执行入口和真实误判率 |
| 减少审批 | 命令哈希记忆与5分钟模型复用 | 是否按正确身份/目录复用及净省时 |
| 故障处理 | 审查/等待中的超时与abort拒绝 | 缺会话/预设的直通和宿主隔离效果 |
| 审计与恢复 | 异步日志、缓存及诊断状态 | 完整执行收据、系统恢复和不可逆损失 |

现金、调用量、审批时间和误判均未测；未执行目标测试、权限变更或真实命令。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:37-45](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/package.json#L37-L45)

运行环境和Host入口声明。

```text
  "engines": {
    "node": ">=16"
  },
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
```

**依据 2 · 源码核查**：[lib/index.js:109-130](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L109-L130)

真实服务条件及缓存。

<details>
<summary>查看原文（22行）</summary>

```text
  const subagents = ctx.get('subagents')
  const userQuestions = ctx.get('userQuestions')
  const permissionPresets = ctx.get('permissionPresets')
  const sandboxPolicy = ctx.get('sandboxPolicy')
  const webServer = ctx.get('webServer')
  const sessions = ctx.get('sessions')
  if (subagents === undefined || userQuestions === undefined || webServer === undefined) {
    ctx.logger.warn('afaccess: inactive — required services unavailable')
    return
  }

  // A3：门控覆盖的 shell 执行工具名（可扩展；描述与文档按此边界声明）
  const GATED_TOOLS = new Set(['pwsh', 'bash', 'powershell', 'cmd', 'sh', 'zsh', 'fish', 'shell'])
  // v1.2.0：Almost Full Access 单一审查模式 —— 确定性规则只拦不可逆/系统级；
  // 动态/间接命令由 LLM 子代理审查兜底（同命令 5 分钟结果缓存，避免繁琐）
  const GATED_PRESETS = new Set(['almost-full-access'])
  const llmVerdictCache = new Map() // commandHash -> { verdict, impacts, ts }
  const LLM_CACHE_TTL = 300000
  const LLM_CACHE_MAX = 200
  const pending = new Map()
  const decidedCache = new Map()
  const remembered = new Map()
```

</details>

**依据 3 · 源码核查**：[scripts/install.mjs:192-207](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/scripts/install.mjs#L192-L207)

逐profile更改permission及insert并写回。

<details>
<summary>查看原文（16行）</summary>

```text
if (enable) {
	for (const name of profiles) {
		const patchPath = patchPathOf(name);
		const existed = existsSync(patchPath);
		if (!existed && !existsSync(join(dshHome, "profiles", name))) {
			console.warn(`⚠️  profile "${name}" 不存在，跳过：` + patchPath);
			continue;
		}
		await mkdir(dirname(patchPath), { recursive: true });
		const current = await readOptional(patchPath) ?? "";
		let next = replacePermissionBlock(current).text;
		next = ensurePermissionBlock(next); // 无顶层 permission 块的干净 patch：追加预设（否则模式缺失）
		next = ensureInsertBlock(next);
		if (next !== current) await writeFile(patchPath, next, "utf8");
		console.log(`Patched ${name}: ${patchPath}`);
	}
```

</details>

**依据 4 · 源码核查**：[scripts/patch-lib.mjs:116-136](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/scripts/patch-lib.mjs#L116-L136)

整个顶层permission条目替换。

<details>
<summary>查看原文（21行）</summary>

```text
	}
	if (sawOwnComment && from > 0) headEnd = from;
	// 右边界：下一个顶层条目（缩进 0 且以 "- " 开头，且不是该块自身的延续）
	let end = lines.length;
	for (let i = start.index + 1; i < lines.length; i++) {
		const line = lines[i];
		if (/^[ \t]*$/.test(line) || /^\s*#/.test(line)) continue;
		const indent = line.match(/^[ \t]*/)[0].length;
		if (indent === 0 && line.trim().startsWith("- ")) {
			end = i;
			break;
		}
	}
	// 右边界回退：保留下一个顶层条目自己的注释行
	while (end - 1 > start.index && /^[ \t]*#/.test(lines[end - 1])) end -= 1;
	const head = lines.slice(0, headEnd).join("\n").trimEnd();
	const tail = lines.slice(end).join("\n").trimStart();
	let out = head;
	if (head !== "") out += "\n\n";
	out += PERMISSION_BLOCK.trimEnd();
	if (tail !== "") out += "\n\n" + tail;
```

</details>

**依据 5 · 源码核查**：[cordis.patch.yml:15-24](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/cordis.patch.yml#L15-L24)

退出前须改变的底层权限含义。

<details>
<summary>查看原文（10行）</summary>

```text
        sandbox: workspace-write
        approval: ask
      almost-full-access:
        sandbox: danger-full-access
        approval: never
        name: 🛡️ Almost Full Access
        description: Full file access with lightweight checks — only irreversible actions (deletes, uninstalls, formatting) and changes that affect normal boot or system/drivers require approval; dynamic/indirect commands are reviewed by a subagent before execution.
      danger-full-access:
        sandbox: danger-full-access
        approval: never
```

</details>

**依据 6 · 源码核查**：[lib/index.js:153-158](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L153-L158)

日志异步best-effort。

```text

  // A8/A10：异步追加 + 脱敏
  function audit(line) {
    try {
      appendFile(join(auditDir, 'afaccess.log'), '[' + new Date().toISOString() + '] ' + redact(line) + '\n', 'utf8').catch(() => { })
    } catch (err) { /* audit is best-effort */ }
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样的改动才可能形成可信的权限模式，而非增加一个审查提示？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可复用的是确定性风险优先、审查子代理空工具集、审批超时/abort拒绝、前端明确错误，以及高危分支不允许记忆。这些只在已覆盖路径上成立，不能用随机ID、提示词“不可信”或更多日志补上底层执行门禁。

未验证方向是由宿主真实执行入口统一强制授权：无身份/未知工具/缺参数默认拒绝或退回原生沙箱；每次审批及模型结果复用绑定完整命令摘要并复核原文、工具、规范cwd、会话和脚本/依赖版本，变更即失效；认证审批身份与目标执行对象要关联，保留用户原permission配置。可先修本插件实际缺口，不必为统一术语重写全部生态。

最小验证在隔离系统覆盖同文本异目录脚本、脚本内容变更、短哈希碰撞、跨会话、未知执行工具、空参数、服务故障、面板/模型中断和长命令截断。记录未经允许的副作用、误拒与修复时间；只要有未授权副作用或恢复条件不明就否定安全权限用途。若原生sandbox/approval已足够且额外模型审阅负担更高，则维持原生方案。这是改进假设和拒绝条件，不是已完成的新保护机制。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:475-483](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L475-L483)

确定性风险优先。

```text
    audit('ANALYZE ambiguous=' + String(analysis.ambiguous) + ' impacts=' + JSON.stringify(analysis.impacts))

    // A4：确定性命中优先且锁定为必审批——LLM 只能裁决「仅模糊」的命令，不能把
    // 确定性风险改判为 safe 免审批（防止命令文本注入审查员改口）。
    let review
    if (analysis.impacts.length > 0) {
      state.counters.detRisky += 1
      review = { verdict: 'risky', impacts: analysis.impacts, source: 'deterministic' }
    } else if (analysis.ambiguous) {
```

**依据 2 · 源码核查**：[lib/index.js:315-322](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L315-L322)

子代理不能使用执行工具。

```text
    const run = await subagents.start(providerName(), {
      label: 'almost-full-access-review',
      prompt,
      parent,
      signal,
      outputSchema: REVIEW_SCHEMA,
      toolFilter: { allow: [] }
    })
```

**依据 3 · 源码核查**：[lib/index.js:238-271](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L238-L271)

等待路径的超时和abort。

<details>
<summary>查看原文（34行）</summary>

````text
      }
      rec.settle = settle
      pending.set(rec.approvalId, rec)
      rec.timeoutTimer = setTimeout(() => {
        audit('TIMEOUT ' + rec.approvalId + ' auto-denied after 10min')
        settle('timeout-denied')
      }, 600000)
      rec.abortHandler = () => { settle('aborted') }
      try { rec.signal.addEventListener('abort', rec.abortHandler, { once: true }) } catch (err) { }
      // A9：仅当面板最近 30s 内未轮询（面板关闭/浏览器不可达）才降级文本审批卡
      rec.fallbackTimer = setTimeout(async () => {
        if (settled) return
        if (lastPollAt !== 0 && Date.now() - lastPollAt < 30000) return
        audit('FALLBACK ' + rec.approvalId + ' no client panel; falling back to text card')
        try {
          const answer = await userQuestions.ask({
            agent: rec.agent,
            signal: rec.signal,
            questions: [{
              id: 'afaccess-approve',
              header: '🛡️ Almost Full Access · 命令审批',
              question: '审查认为该命令可能影响系统，是否允许执行？',
              detail: ['命令：', '```', rec.command.slice(0, 3000), '```', '', '审查发现的具体影响：', rec.impacts.map((x, i) => (i + 1) + '. ' + x).join('\n'), '', '工作区目录：' + (rec.workspaceRoot || '（未知）')].join('\n'),
              options: [
                { label: '拒绝执行', description: '阻止该命令运行。' },
                { label: '允许执行', description: '放行该命令，由你承担影响。' }
              ]
            }]
          })
          const chosen = answer.answers.find((item) => item.id === 'afaccess-approve')
          settle(chosen !== undefined && chosen.selected.includes('允许执行') ? 'approved' : 'denied')
        } catch (err) {
          settle('denied')
        }
````

</details>

**依据 4 · 源码核查**：[lib/index.js:450-466](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L450-L466)

未进入门控路径支撑最强反例。

<details>
<summary>查看原文（17行）</summary>

```text
  // 否则 profile 补丁热重载（dsh-hmr）后重挂本插件会因同名工具重复注册而失败。
  ctx.effect(() => ctx.tools.register(diagTool), 'afaccess: diagnostic tool')

  // ============ 门控 ============
  ctx.on('tools/pre-execute', async (exec, next) => {
    if (!GATED_TOOLS.has(exec.name)) return next()
    const agent = exec.agent
    if (agent === undefined || reviewChildren.has(agent.id)) return next()

    const preset = currentPreset(agent)
    if (preset !== '') state.lastPreset = preset
    if (!GATED_PRESETS.has(preset)) return next()

    const args = exec.arguments
    const command = (args !== null && typeof args === 'object' && typeof args.command === 'string')
      ? args.command
      : (typeof args === 'string' ? args : '')
```

</details>

**依据 5 · 源码核查**：[lib/analyze.js:325-329](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/analyze.js#L325-L329)

短键不足精确绑定，支持改进推导。

```text
export function hashCommand(cmd) {
  let h = 5381
  for (let i = 0; i < cmd.length; i++) h = ((h << 5) + h + cmd.charCodeAt(i)) | 0
  return 'h' + (h >>> 0).toString(16)
}
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 此固定版本适合作为日常安全权限档吗，研究原型如何退出？

**研究主题**：采用判断

#### 完整回答

不推荐将其作为保护重要机器、敏感文件或多用户环境的日常安全权限档。原因是底层Full Access/approval never、有限工具覆盖、缺会话/预设的直通，以及不精确的复用键和审批者身份边界，共同削弱“危险行为必经确认”的可依赖性；这不是因未运行就给负面结论，而是当前主链的明确条件。

若目的是研究命令审查交互，只能放在无重要数据、无敏感凭据的隔离环境，从未获批准副作用是否为零开始，不能用几次安全命令通过升级为正常安装。需要完整强制授权的人应保持原生沙箱/approval，先完成Q05所列边界修补和独立验收再重评。

退出应先切回原生read-only/workspace-write并核对实际权限，再停插件、恢复原profile/包和重启检查；审批状态不明、工具漏拦、原预设被覆盖或出现误执行即停止该模式。仅关闭审批面板或卸载门控，不足以证明底层完全访问已撤销。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:15-24](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/cordis.patch.yml#L15-L24)

保护依赖应用层门控的权限前提。

<details>
<summary>查看原文（10行）</summary>

```text
        sandbox: workspace-write
        approval: ask
      almost-full-access:
        sandbox: danger-full-access
        approval: never
        name: 🛡️ Almost Full Access
        description: Full file access with lightweight checks — only irreversible actions (deletes, uninstalls, formatting) and changes that affect normal boot or system/drivers require approval; dynamic/indirect commands are reviewed by a subagent before execution.
      danger-full-access:
        sandbox: danger-full-access
        approval: never
```

</details>

**依据 2 · 源码核查**：[lib/index.js:450-466](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L450-L466)

有限覆盖和预设缺失直通。

<details>
<summary>查看原文（17行）</summary>

```text
  // 否则 profile 补丁热重载（dsh-hmr）后重挂本插件会因同名工具重复注册而失败。
  ctx.effect(() => ctx.tools.register(diagTool), 'afaccess: diagnostic tool')

  // ============ 门控 ============
  ctx.on('tools/pre-execute', async (exec, next) => {
    if (!GATED_TOOLS.has(exec.name)) return next()
    const agent = exec.agent
    if (agent === undefined || reviewChildren.has(agent.id)) return next()

    const preset = currentPreset(agent)
    if (preset !== '') state.lastPreset = preset
    if (!GATED_PRESETS.has(preset)) return next()

    const args = exec.arguments
    const command = (args !== null && typeof args === 'object' && typeof args.command === 'string')
      ? args.command
      : (typeof args === 'string' ? args : '')
```

</details>

**依据 3 · 源码核查**：[lib/index.js:275-290](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L275-L290)

记忆复用边界。

<details>
<summary>查看原文（16行）</summary>

```text

  function requestApproval(rec) {
    // A5：随机 approvalId，避免顺序 ID 可枚举
    rec.approvalId = 'afacc-apr-' + randomUUID().replace(/-/g, '').slice(0, 12)
    // A6：记忆键 = 命令哈希（同命令免重复审批）；高风险（引导类）不可记忆
    if (rec.severity !== 'high' && (rec.category || '').indexOf('boot:') !== 0) {
      const mem = remembered.get(rec.commandHash)
      if (mem !== undefined) {
        rec.decision = mem
        rec.auto = true
        state.counters.autoDecided += 1
        audit('AUTO ' + rec.approvalId + ' key=' + rec.commandHash + ' category=' + rec.category + ' -> ' + mem)
        return Promise.resolve(mem)
      }
    }
    audit('APPROVAL ' + rec.approvalId + ' source=' + rec.source + ' severity=' + rec.severity + ' category=' + rec.category + ' cmd=' + rec.command.slice(0, 120).replace(/\n/g, ' '))
```

</details>

**依据 4 · 源码核查**：[lib/index.js:369-395](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L369-L395)

审批端点自身检查范围。

<details>
<summary>查看原文（27行）</summary>

```text
    path: '/api/afaccess/decide',
    handler: async (req, res) => {
      if (req.method !== 'POST') return json(res, 405, { ok: false, reason: 'method' })
      // A5：CSRF 防护——要求同源面板携带的自定义请求头；若有 Origin/Referer 则必须是回环地址
      if (req.headers['x-afaccess-client'] !== '1') return json(res, 403, { ok: false, reason: 'origin' })
      const origin = req.headers['origin'] || req.headers['referer'] || ''
      if (origin !== '') {
        try {
          const hostname = new URL(origin).hostname
          if (!['127.0.0.1', 'localhost', '::1'].includes(hostname)) return json(res, 403, { ok: false, reason: 'origin' })
        } catch (err) {
          return json(res, 403, { ok: false, reason: 'origin' })
        }
      }
      const args = await readBody(req)
      if (args === null || typeof args !== 'object') return json(res, 400, { ok: false, reason: 'body' })
      const id = typeof args.approvalId === 'string' ? args.approvalId : ''
      const rec = pending.get(id)
      if (rec === undefined) return json(res, 200, { ok: false, reason: 'unknown' })
      if (rec.decision !== null) return json(res, 200, { ok: false, reason: 'already-decided' })
      const decision = args.decision === 'approved' ? 'approved' : 'denied'
      // A5/A6：记忆写入强制绑定服务端 rec.commandHash（忽略客户端提供的任意键）；
      // 高风险（引导类/高严重度）命令一律不可记忆
      if (args.remember === true && rec.severity !== 'high' && (rec.category || '').indexOf('boot:') !== 0) {
        remembered.set(rec.commandHash, decision)
        audit('REMEMBER key=' + rec.commandHash + ' category=' + rec.category + ' -> ' + decision)
      }
```

</details>

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 跨插件上下文契约还能成立吗，当前ZCode实现如何改变判断？

**研究主题**：新假设与验证、缺陷与关键质疑、贡献与相对优势

#### 完整回答

跨组件比较可保留为未验证的上下文契约假设，但四种问题必须分开。本插件是“授权决定是否仍适用于这次命令”，余额侧栏是“这张余额属于哪个账户”，ZCode是“聚合历史来自哪个范围/版本”，plugin-balance还涉及“哪个目标被允许接收凭据”。改一个缓存key不能代替四种执行与信任边界，也没有运行过这些插件的组合。

本插件的短哈希与实例缓存已由Q03核明；无碰撞也有同文本异cwd/脚本版本的复用条件。余额侧栏当前b35aa1e8501051ab3541cea2f43f0609b214f9a1按probe.id取cache，hostFor选首个匹配route并提供该route的apiKeyEnv；DeepSeek probe实际按该引用resolveSecret后请求余额。卡片同时列所有匹配provider，因此不同route若不是同账户，不能假定这张卡分别验证了每个账户；这不是已复现混数。
[AlienGene/dsh-llm-balance-siderbar src/state.ts:125-145](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/state.ts#L125-L145)

```
  function hostFor(probe: Probe, routes: readonly string[]): ProbeHost {
    const override = input.config.sourceOverrides[probe.id]
    // The first registered route this source answers for: the credential the
    // routed adapter would use belongs to that route, not to the plugin.
    const route = routes.find((candidate) => probe.match(candidate))
    const routeApiKeyEnv = route === undefined ? undefined : input.piAiApiKeyEnv?.(route)
    return {
      config: input.config,
      timeoutMs: input.config.timeoutMs,
      fetchImpl,
      ...(route === undefined ? {} : { routeId: route }),
      ...(routeApiKeyEnv === undefined ? {} : { routeApiKeyEnv }),
      ...(input.llmDeepseek === undefined ? {} : { llmDeepseek: input.llmDeepseek() }),
      now,
      resolveSecret: input.resolveSecret,
      warn,
    }
  }

  async function refresh(probe: Probe, routes: readonly string[], signal: AbortSignal | undefined): Promise<void> {
    const cache = cacheFor(probe.id)
```

[AlienGene/dsh-llm-balance-siderbar src/providers/deepseek.ts:69-90](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/providers/deepseek.ts#L69-L90)

```

/** DeepSeek balance probe. */
export const deepseekProbe: Probe = {
  id: DEEPSEEK_SOURCE_ID,
  label: 'DeepSeek',
  match: (routeId) => /^deepseek/i.test(routeId),
  async probe(host, signal) {
    const envName = deepseekApiKeyEnv(host)
    const secret = await host.resolveSecret(envName)
    if (secret === null) throw new SkipSource('NO_CREDENTIAL', `${envName} is not configured`)

    const payload = await fetchJson({
      url: `${deepseekBaseURL(host)}/user/balance`,
      headers: { authorization: `Bearer ${secret}` },
      timeoutMs: host.timeoutMs,
      signal,
      fetchImpl: host.fetchImpl,
    })

    const { rows, isAvailable } = parseDeepseekBalance(payload)
    if (rows.length === 0) throw new HttpFailure('BAD_RESPONSE', 'no balance_infos in the response')

```

当前ZCode7045cfd29cea53f139d3eed873c5ecf38202f55f直接扫描配置的sessions root；磁盘缓存按profileContext.dir或USAGE_STATS_CACHE_DIR选择，解析不到才回退web，且schema3使旧语义缓存失效，输出有partial/scan信息。模块级cache/cacheDir/inflight仍没有按每次上下文建表，磁盘加载还含旧路径迁移；聚合cache载入检查schema而没有在该处比对当前扫描root。应验证共享模块、多profile/根切换和旧缓存迁移的范围一致性，不能把它说成已经混入其他用户数据。API主动调用connection.requestRejection，缺服务返回503，取数范围问题不能扩成匿名可访问。
[Amer-CN/zcode-usage-stats lib/index.mjs:672-680](https://github.com/Amer-CN/zcode-usage-stats/blob/7045cfd29cea53f139d3eed873c5ecf38202f55f/lib/index.mjs#L672-L680)

```
async function loadDiskCache() {
  // 新路径优先；没有则读旧路径做一次性迁移（冷启动不丢数）
  for (const p of [cacheFilePath(), legacyCacheFilePath()]) {
    if (!p) continue;
    const j = await readJson(p);
    if (j && typeof j === "object" && (j.ok || j.error)) {
      // 旧口径缓存不再使用：字段语义已变（模型归因/统计范围），避免显示错数
      if (j.ok && j.schemaVersion !== CACHE_SCHEMA) continue;
      return j;
```

[Amer-CN/zcode-usage-stats lib/index.mjs:711-722](https://github.com/Amer-CN/zcode-usage-stats/blob/7045cfd29cea53f139d3eed873c5ecf38202f55f/lib/index.mjs#L711-L722)

```
export function apply(ctx) {
  const { webServer, connection } = ctx;
  if (!webServer) return;

  // 缓存跟随当前 profile（此前硬编码 profiles/web 是历史遗留）。
  // 解析不到时回退旧路径，保证不断；读缓存时新旧路径都试（一次性迁移）。
  try {
    const profile = typeof ctx.get === "function" ? ctx.get("profileContext") : null;
    if (profile && typeof profile.dir === "string" && profile.dir) cacheDir = profile.dir;
  } catch { /* 保持旧路径 */ }
  const envCacheDir = process.env.USAGE_STATS_CACHE_DIR;
  if (typeof envCacheDir === "string" && envCacheDir.trim()) cacheDir = envCacheDir.trim();
```

[Amer-CN/zcode-usage-stats lib/index.mjs:802-810](https://github.com/Amer-CN/zcode-usage-stats/blob/7045cfd29cea53f139d3eed873c5ecf38202f55f/lib/index.mjs#L802-L810)

```
      // 本路由是 /api 下的 exact 路由,优先级高于 dsh-client-connection 挂在 /api prefix 上的
      // 信任栅栏(Host/Origin + 浏览器认证 cookie),必须自己过栅栏(官方 dsh-host-open-in-app 同一做法)。
      const rejection = connection && typeof connection.requestRejection === "function"
        ? connection.requestRejection(req)
        : 503; // 拿不到栅栏服务时拒绝服务,而不是放行
      if (rejection !== undefined) {
        res.statusCode = rejection;
        res.end(rejection === 401 ? "unauthorized" : rejection === 403 ? "forbidden" : "service unavailable");
        return;
```

plugin-balance当前96bb1592c949456aa37ccc3a296085f59df2ee9c的自定义分支接受请求的baseUrl/path，取客户端header或服务端vendor凭据，再交queryUpstream以Bearer发送。目的地不是由给cache多加账户字段就能授权；须独立确认允许接收秘密的origin及重定向策略。能否被不可信调用者触达仍依宿主入口，未运行泄露/SSRF用例。
[Andrew111888/dsh-plugin-balance lib/index.js:807-825](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/lib/index.js#L807-L825)

```
  if (!provider) {
    const baseUrl = url.searchParams.get("baseUrl");
    const kind = url.searchParams.get("kind") === "usage" ? "usage" : "balance";
    if (typeof baseUrl !== "string" || !/^https?:\/\//.test(baseUrl)) {
      sendJson(res, 400, { error: { code: "BAD_CUSTOM_CONFIG", message: "自定义厂商需要 http(s) 的 baseUrl" } });
      return;
    }
    const headerKey = req.headers["x-dsh-balance-key"] && typeof req.headers["x-dsh-balance-key"] === "string"
      ? req.headers["x-dsh-balance-key"].trim()
      : "";
    let credential;
    if (headerKey) {
      credential = { ref: "client-header", value: headerKey };
    } else {
      const settings = providerSettings(ctx, providerId) || {};
      const refs = typeof settings.apiKeyEnv === "string" && settings.apiKeyEnv
        ? [settings.apiKeyEnv]
        : [providerId.toUpperCase().replace(/-/g, "_") + "_API_KEY"];
      credential = await resolveCredential(ctx, refs);
```

[Andrew111888/dsh-plugin-balance lib/index.js:749-756](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/lib/index.js#L749-L756)

```
      const response = await fetch(provider.url, {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${credential.value}`,
        },
        signal: controller.signal,
```

待验证方向是为各类操作声明最低必要上下文：命令授权绑定会话/工具/规范cwd/完整命令与脚本版本，账户数据绑定route与非秘密账户指纹，聚合绑定实际root/profile/schema/采样范围和时间，凭据外发独立约束目的地。缺关键身份时拒绝复用，变化后使旧结果失效；这是一组按领域分开的约束，不是已存在的跨插件互操作协议。

最小对照分别用同文本异脚本、双route不同测试账户、双profile同HOME及扫描root切换、伪造custom目标，检查误批准、错归属、错范围和秘密误发，同时记录误拒、维护与恢复工时。ZCode需把当前profile缓存/schema/partial机制当基线，不能把已有修正当待实现创新。若宿主现有上下文和逐项修补已足够，或统一描述未降低错误却提高维护成本，则否定独立跨插件方案；四组对照本轮均未执行。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:124-130](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L124-L130)

本项实例缓存作用域，跨比较的授权部分。

```text
  const GATED_PRESETS = new Set(['almost-full-access'])
  const llmVerdictCache = new Map() // commandHash -> { verdict, impacts, ts }
  const LLM_CACHE_TTL = 300000
  const LLM_CACHE_MAX = 200
  const pending = new Map()
  const decidedCache = new Map()
  const remembered = new Map()
```

**依据 2 · 源码核查**：[lib/index.js:486-505](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L486-L505)

命令短哈希复用；外部原文在回答中按各自固定仓库提交保存。

<details>
<summary>查看原文（20行）</summary>

```text
      const cmdHash = hashCommand(command)
      const cached = llmVerdictCache.get(cmdHash)
      if (cached !== undefined && Date.now() - cached.ts < LLM_CACHE_TTL) {
        review = { verdict: cached.verdict, impacts: cached.impacts, source: 'llm' }
        audit('LLM-CACHE hit ' + cmdHash + ' -> ' + cached.verdict)
      } else {
        try {
          review = await runReview(command, exec.name, workdir, agent, exec.signal, workspace, analysis)
        } catch (err) {
          // A7：abort 不再 fail-open
          if (exec.signal.aborted) return abortDeny()
          review = { verdict: 'risky', impacts: ['命令审查子代理启动失败（' + String(err?.message ?? err) + '），无法自动判定安全性，需人工审批。'], source: 'degraded' }
        }
        if (review.source === 'llm') {
          if (llmVerdictCache.size >= LLM_CACHE_MAX) {
            const oldest = llmVerdictCache.keys().next().value
            if (oldest !== undefined) llmVerdictCache.delete(oldest)
          }
          llmVerdictCache.set(cmdHash, { verdict: review.verdict, impacts: review.impacts, ts: Date.now() })
        }
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
