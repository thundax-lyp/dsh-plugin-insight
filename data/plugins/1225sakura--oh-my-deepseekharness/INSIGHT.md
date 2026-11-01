# oh-my-deepseekharness

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[572612b](https://github.com/1225Sakura/oh-my-deepseekharness/tree/572612b29117ce9a0c45a34e3ccffafb29c42536)

<!-- BEGIN META -->
[![GitHub ★ 14](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=14&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1225Sakura/oh-my-deepseekharness) [![npm 30d 3,136](https://img.shields.io/static/v1?label=npm+30d&message=3%2C136&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供多代理编排与工具接入。

> **亮点**：[Q01](#research-q01) 整合资产与路由，[Q02](#research-q02) 将决策接入宿主子代理。

> **主要限制**：[Q03](#research-q03) 路由日志发生在启动前且可能缺失，不能当成功执行证明。

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
  - [Q01 · 谁需要编排层，相对原生子代理与手工拆任务的增量？](#detail-section-11)
  - [Q02 · 代表性 delegate 如何从注册走到执行和返回？](#detail-section-12)
  - [Q03 · 路由审计、故障和降级能证明什么？](#detail-section-13)
  - [Q04 · 依赖、成本与试用停止条件是什么？](#detail-section-14)
  - [Q05 · 如何让用户区分派发决策与子任务完成？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH 用户希望把复杂任务拆分并委派给子代理。

手工拆任务并使用宿主原生子代理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 角色资产 | 提供任务指引 | 实际遵循未测 |
| 硬路由委派 | 调用宿主子代理 | 依赖服务与可用模型 |
| 路由事件 | 记录派发前决策 | 可缺失且不证明完成 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| Node >=22.19 与 DSH 服务 | 必需 | 运行插件 | 核心服务缺失报错 |
| 宿主 subagents | 硬路由需要 | 启动子代理 | 工具不可用 |
| 模型及 provider | 任务需要 | 生成子任务结果 | 无法解析则报错 |
| MCP 和存储 | 相应功能需要 | 状态和工具 | 挂载失败降级 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核版本、权限和预算 | 核心服务缺失停止 |
| 配置 | 限定工作区和模型 | 核硬路由可用 |
| 委派 | 用只读任务试运行 | 核子代理最终结果 |
| 复核 | 检查日志、输出与成本 | 失败或缺证据回原生流程 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 接入 | 模型与环境费用未知 | 核宿主版本和服务 | 兼容未测 |
| 执行 | 子代理 token 成本未知 | 拆解和复核 | 结果质量未测 |
| 失败 | 重试费用未知 | 清理状态与排查 | 日志可缺失 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 委派 | 校验后调用宿主子代理 | 真正节时和质量 |
| 路由事件 | 尝试记录路由决策 | 派发成功与完整审计 |
| 降级 | 服务缺席或失败时记录 | 恢复和兼容 |

> **思考**：[Q03](#research-q03) 路由日志发生在启动前且可能缺失，不能当成功执行证明。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 整合资产与路由，[Q02](#research-q02) 将决策接入宿主子代理。

[Q02](#research-q02) 结果非 completed 抛错；[Q03](#research-q03) 路由事件先于派发并可缺失。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 路由日志发生在启动前且可能缺失，不能当成功执行证明。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 用受限预算在隔离项目试只读委派，核结果与成本；服务降级时回原生流程。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已静态检查 delegate 的注册、路由、启动与失败代表链；未执行模型或其他完整功能。

- 已检查：作者 README、包清单、源码路径 package.json、lib/index.js、lib/delegate.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定清单、入口和 delegate 代表路径；未运行 DSH、MCP、子代理、模型，未审全 DAG 与 HUD。
- 下一步：[Q05](#research-q05) 先查现有 HUD，再注入日志与 provider 失败。

**分析版本**

- **仓库**：[1225Sakura/oh-my-deepseekharness](https://github.com/1225Sakura/oh-my-deepseekharness)
- **版本号**：0.7.0（[固定提交 572612b](https://github.com/1225Sakura/oh-my-deepseekharness/tree/572612b29117ce9a0c45a34e3ccffafb29c42536)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设关联派发到终态的脱敏记录有助区分失败；尚未验证。

[Q05](#research-q05) 先查现有 HUD，再注入日志与 provider 失败。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 194 | 23668 | — | — | 301285 |
| .mjs | source | 19 | 2946 | 2402 | 393 | — |
| .js | source | 31 | 6953 | 5058 | 1571 | — |
| .js | test | 51 | 11409 | 9772 | 1066 | — |
| .mjs | example | 1 | 83 | 74 | 5 | — |
| .mjs | test | 1 | 66 | 42 | 17 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1225Sakura/oh-my-deepseekharness/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对编排代表路径、依赖、审计和降级边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要编排层，相对原生子代理与手工拆任务的增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

package.json:1-4 将项目描述为 DSH 多代理编排层，包含 skills、MCP 和 DAG 等；index.js:51-60 实际加载资产并注册。代表性 delegate 工具把角色、模型路由和子代理调用整合，但子代理执行由宿主提供，不能把模型能力或全部 DAG 功能归为自身创新；未测任务成功率、节时和产出质量。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-4](https://github.com/1225Sakura/oh-my-deepseekharness/blob/572612b29117ce9a0c45a34e3ccffafb29c42536/package.json#L1-L4)

作者描述功能范围。

```text
{
  "name": "@sakura12/oh-my-deepseekharness",
  "version": "0.7.0",
  "description": "Multi-agent orchestration layer for DeepSeek Harness — 49 skills, 58 MCP tools, graph DAG runtime, team pipeline & HUD (OMC/OMX adaptation)",
```

**依据 2 · 源码核查**：[lib/index.js:51-60](https://github.com/1225Sakura/oh-my-deepseekharness/blob/572612b29117ce9a0c45a34e3ccffafb29c42536/lib/index.js#L51-L60)

检查核心服务并加载注册资产。

<details>
<summary>查看原文（10行）</summary>

```text
export async function setup(ctx, config, opts = {}) {
  // M3：cordis 配置重放 = dispose + 重跑 apply，probe 模块级缓存必须随之重置，否则陈旧
  _resetCache()
  // 核心服务缺失 → 启动即报错（规格 §6.1 例外条款）；storage 不在此列（缺失走降级）
  for (const svc of CORE_SERVICES)
    if (!ctx[svc]) throw new Error(`oh-my-dsh: 核心服务 ${svc} 缺失，插件无法工作（请升级 dsh 宿主）`)

  const probeReport = await probeCapabilities(ctx)
  const assets = await loadAssets({ assetsRoot: opts.assetsRoot ?? DEFAULT_ASSETS, language: config.language })
  registerAssets(ctx, assets)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:176-190](https://github.com/1225Sakura/oh-my-deepseekharness/blob/572612b29117ce9a0c45a34e3ccffafb29c42536/lib/index.js#L176-L190)

宿主子代理存在才注册硬路由工具。

<details>
<summary>查看原文（15行）</summary>

```text
  // M3 c1：omd_delegate 硬路由工具——ctx.subagents spawn 缝在場才注册（缺席降级记 probe，
  // 不阻断插件；注册失败同样降级，软路由照常）
  let subagents
  try { subagents = ctx.subagents } catch { /* cordis：未 inject 的服务属性访问抛错=缺席 */ }
  if (subagents) {
    try {
      const defineTool = opts.defineTool ?? (await import('@deepseek-ai/dsh-tools')).defineTool
      await registerDelegateTool(ctx, defineTool, { config, roles: assets.roles })
      probeReport.delegate = { status: 'ok' }
    } catch (e) {
      probeReport.delegate = { status: 'failure', detail: String(e?.message ?? e) }
      ctx.logger?.warn?.(`oh-my-dsh: omd_delegate 注册失败（硬路由不可用，软路由照常）: ${e?.message ?? e}`)
    }
  } else {
    probeReport.delegate = { status: 'unavailable', detail: '宿主未挂载 subagent 缝（ctx.subagents 缺席）' }
```

</details>

#### 缺口

- 未比较实际任务结果
  **影响**：不能证明提高成功率或节时
  **进一步探讨**：固定任务、预算对照原生子代理。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 代表性 delegate 如何从注册走到执行和返回？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

index.js:176-190 仅当宿主 subagents 可用时注册 omd_delegate，否则记 unavailable；delegate.js:145-150 要求调用代理并计算派发决策，195-208 对显式模型校验 provider 与服务。207-235 构造任务、向宿主启动子代理、等待结果并尽力 dispose，非 completed 抛错；角色是提示子代理加载资产，不能仅凭构造 prompt 证明实际遵循。图执行、MCP 和 HUD 的全部路径未审计。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:176-190](https://github.com/1225Sakura/oh-my-deepseekharness/blob/572612b29117ce9a0c45a34e3ccffafb29c42536/lib/index.js#L176-L190)

按宿主服务注册或降级。

<details>
<summary>查看原文（15行）</summary>

```text
  // M3 c1：omd_delegate 硬路由工具——ctx.subagents spawn 缝在場才注册（缺席降级记 probe，
  // 不阻断插件；注册失败同样降级，软路由照常）
  let subagents
  try { subagents = ctx.subagents } catch { /* cordis：未 inject 的服务属性访问抛错=缺席 */ }
  if (subagents) {
    try {
      const defineTool = opts.defineTool ?? (await import('@deepseek-ai/dsh-tools')).defineTool
      await registerDelegateTool(ctx, defineTool, { config, roles: assets.roles })
      probeReport.delegate = { status: 'ok' }
    } catch (e) {
      probeReport.delegate = { status: 'failure', detail: String(e?.message ?? e) }
      ctx.logger?.warn?.(`oh-my-dsh: omd_delegate 注册失败（硬路由不可用，软路由照常）: ${e?.message ?? e}`)
    }
  } else {
    probeReport.delegate = { status: 'unavailable', detail: '宿主未挂载 subagent 缝（ctx.subagents 缺席）' }
```

</details>

**依据 2 · 源码核查**：[lib/delegate.js:145-150](https://github.com/1225Sakura/oh-my-deepseekharness/blob/572612b29117ce9a0c45a34e3ccffafb29c42536/lib/delegate.js#L145-L150)

父代理及路由决策。

```text
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      const parent = exec?.agent
      if (!parent) throw new Error('omd_delegate: 宿主未提供调用代理（exec.agent 缺席），无法派发')
      const dispatchId = `omdd-${Date.now().toString(36)}-${(++seq).toString(36)}`
      const decision = resolveDispatch({ config, table, args, dispatchId })
```

**依据 3 · 源码核查**：[lib/delegate.js:195-235](https://github.com/1225Sakura/oh-my-deepseekharness/blob/572612b29117ce9a0c45a34e3ccffafb29c42536/lib/delegate.js#L195-L235)

模型校验、子代理启动和结果处理。

<details>
<summary>查看原文（41行）</summary>

```text
      // C1：派发前路由校验——不可用 id 在此显式报错（不静默继承/不静默降级）
      let agentOptions
      if (effectiveModelId !== undefined) {
        const llm = opts.llm ?? tryGet(ctx, 'llm')
        if (!llm || typeof llm.resolveCallConfig !== 'function')
          throw new Error(`omd_delegate: llm 服务缺席——模型 id "${effectiveModelId}" 无法校验（不静默派发）`)
        providerId = args.provider ?? providerId ?? parentRouteForDelegation(parent).provider
        if (providerId === undefined)
          throw new Error(`omd_delegate: 无法确定 LLM provider（调用代理无路由且未显式提供）——model=${effectiveModelId}`)
        await llm.resolveCallConfig({ provider: providerId, model: effectiveModelId }, exec?.signal)
        agentOptions = { provider: providerId, model: effectiveModelId }
      }
      if (subagents.getProvider(DELEGATE_PROVIDER) === undefined)
        throw new Error(`omd_delegate: subagent provider "${DELEGATE_PROVIDER}" 未注册（已注册: ${subagents.list().join(', ') || '无'}）`)
      const finalPrompt = decision.role
        ? `[omd_delegate] 本次派发角色=${decision.role}（先经 skill 工具加载该角色卡，再按角色卡约束执行任务）。\n\n${args.prompt}`
        : args.prompt
      const request = {
        label: args.description,
        prompt: [{ type: 'text', text: finalPrompt }],
        parent,
        ...(agentOptions ? { agentOptions } : {}),
      }
      const run = await subagents.start(DELEGATE_PROVIDER, { ...request, signal: exec?.signal })
      let result
      try {
        result = await run.result
      } finally {
        try { await run.dispose?.() } catch { /* dispose 失败不吞子代理结果 */ }
      }
      if (result.stopReason !== 'completed') {
        const diag = result.diagnostic ? `；diagnostic=${result.diagnostic}` : ''
        throw new Error(`omd_delegate: 子代理异常结束 stopReason=${result.stopReason}${diag}`)
      }
      const text = (result.output ?? [])
        .filter(b => b?.type === 'text' && typeof b.text === 'string')
        .map(b => b.text).join('')
      ctx.logger?.info?.(decision.logLine)
      const out = { ok: true, dispatchId, clamped: decision.clamped, fallback: decision.fallback, text, logLine: decision.logLine }
      if (decision.role) out.role = decision.role
      if (decision.tier) out.tier = decision.tier
```

</details>

#### 缺口

- 未运行宿主和模型，其他功能未全查
  **影响**：无法断言角色遵循与多代理效果
  **进一步探讨**：在隔离宿主验证模型、权限及输出。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 路由审计、故障和降级能证明什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

delegate.js:154-169 在模型校验和启动前尝试写 route/fallback；锚在用户主目录时跳过，写入失败仅告警且不阻断。该事件表示路由决策，不证明子任务完成，也不能保证每次都有审计记录。195-208 在缺模型服务、provider 或子代理 provider 时明确失败；218-227 等待结果、释放句柄，未正常完成抛错。index.js:108-128 的 MCP 挂载失败走降级，不能将插件已加载等同全部能力可用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/delegate.js:154-169](https://github.com/1225Sakura/oh-my-deepseekharness/blob/572612b29117ce9a0c45a34e3ccffafb29c42536/lib/delegate.js#L154-L169)

派发前路由记录及可跳过/失败处理。

<details>
<summary>查看原文（16行）</summary>

```text
      // U8 S1（AC-1/2/3）：route/fallback 事件落盘——每次派发恰一条 route 事件；fallback 派发
      // 同点追加 kind='fallback'（route/fallback 天然 1:1：其后 model 校验/spawn 失败两事件同在同失）。
      // 单一 try/catch → 写失败 warn 恰一次、不阻断派发、不改变任何返回/错误语义（recordFallback 同款口径）；
      // 落盘不依赖 model 校验结果（事件=路由判定，含后续失败车次）。
      const eventsAnchor = anchorCwd(args)
      const eventsRoot = resolve(eventsAnchor, sd)
      try {
        if (isHomeAnchor(eventsAnchor)) {
          ctx.logger?.warn?.(`omd_delegate: 落盘锚在用户主目录（${eventsRoot}），跳过事件落盘——请传 cwd=工作区绝对路径（IC-12）`)
        } else {
          await recordRouteEventImpl({ cwd: eventsAnchor, stateDir: sd, decision, kind: 'route' })
          if (decision.fallback)
            await recordRouteEventImpl({ cwd: eventsAnchor, stateDir: sd, decision, kind: 'fallback' })
        }
      } catch (e) {
        ctx.logger?.warn?.(`omd_delegate: events 落盘失败（不阻断派发）: ${e?.message ?? e}`)
```

</details>

**依据 2 · 源码核查**：[lib/delegate.js:195-208](https://github.com/1225Sakura/oh-my-deepseekharness/blob/572612b29117ce9a0c45a34e3ccffafb29c42536/lib/delegate.js#L195-L208)

模型和 provider 校验。

<details>
<summary>查看原文（14行）</summary>

```text
      // C1：派发前路由校验——不可用 id 在此显式报错（不静默继承/不静默降级）
      let agentOptions
      if (effectiveModelId !== undefined) {
        const llm = opts.llm ?? tryGet(ctx, 'llm')
        if (!llm || typeof llm.resolveCallConfig !== 'function')
          throw new Error(`omd_delegate: llm 服务缺席——模型 id "${effectiveModelId}" 无法校验（不静默派发）`)
        providerId = args.provider ?? providerId ?? parentRouteForDelegation(parent).provider
        if (providerId === undefined)
          throw new Error(`omd_delegate: 无法确定 LLM provider（调用代理无路由且未显式提供）——model=${effectiveModelId}`)
        await llm.resolveCallConfig({ provider: providerId, model: effectiveModelId }, exec?.signal)
        agentOptions = { provider: providerId, model: effectiveModelId }
      }
      if (subagents.getProvider(DELEGATE_PROVIDER) === undefined)
        throw new Error(`omd_delegate: subagent provider "${DELEGATE_PROVIDER}" 未注册（已注册: ${subagents.list().join(', ') || '无'}）`)
```

</details>

**依据 3 · 源码核查**：[lib/delegate.js:218-227](https://github.com/1225Sakura/oh-my-deepseekharness/blob/572612b29117ce9a0c45a34e3ccffafb29c42536/lib/delegate.js#L218-L227)

结果及清理失败边界。

<details>
<summary>查看原文（10行）</summary>

```text
      const run = await subagents.start(DELEGATE_PROVIDER, { ...request, signal: exec?.signal })
      let result
      try {
        result = await run.result
      } finally {
        try { await run.dispose?.() } catch { /* dispose 失败不吞子代理结果 */ }
      }
      if (result.stopReason !== 'completed') {
        const diag = result.diagnostic ? `；diagnostic=${result.diagnostic}` : ''
        throw new Error(`omd_delegate: 子代理异常结束 stopReason=${result.stopReason}${diag}`)
```

</details>

**依据 4 · 源码核查**：[lib/index.js:108-128](https://github.com/1225Sakura/oh-my-deepseekharness/blob/572612b29117ce9a0c45a34e3ccffafb29c42536/lib/index.js#L108-L128)

MCP 失败记录与降级。

<details>
<summary>查看原文（21行）</summary>

```text
  // 改为运行时动态挂载——cordis ctx.plugin({name,inject,Config,apply}, config) 已源码实证，
  // fiber 生命周期随 omd 重放/卸载自动回收。mcp-client 失败不阻断插件（降级路径见协议能力矩阵）。
  let mcpStatus = 'unavailable'
  try {
    const mcp = await import('@deepseek-ai/dsh-mcp-client')
    await ctx.plugin(
      { name: mcp.name, inject: mcp.inject, Config: mcp.Config, apply: mcp.apply },
      {
        transport: 'stdio',
        serverName: 'omd-state',
        command: process.execPath,
        args: [join(dirname(fileURLToPath(import.meta.url)), '..', 'mcp-server', 'index.mjs')],
        env: { OMD_STATE_DIR: config.stateDir, OMD_CODE_INTEL: JSON.stringify(config.codeIntel ?? {}), OMD_TEAM_STALE_MS: String(config.team?.staleAfterMs ?? 300_000) },
        failOnStartupError: false,
        reconnect: { enabled: true, initialDelayMs: 1000, maxDelayMs: 30000, maxAttempts: 5 },
      },
    )
    mcpStatus = 'ok'
  } catch (e) {
    mcpStatus = 'failure'
    ctx.logger?.warn?.(`oh-my-dsh: MCP server 挂载失败，全部 mcp__omd-state__* 工具不可用（state/notepad/prd/handoff/team/trace/hud/events/graph/代码智能；协议层降级为文件直读兜底）: ${e?.message ?? e}`)
```

</details>

#### 缺口

- 未实测取消、进程故障及日志恢复
  **影响**：不能保证完整审计或成功完成
  **进一步探讨**：用假宿主注入缺服务、日志失败和取消。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、成本与试用停止条件是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

package.json:33-35 要求 Node >=22.19，65-74 声明宿主 peer 区间；index.js:51-56 缺核心服务直接报错，176-190 缺子代理则硬路由不可用。子代理和模型调用增加 token、时延和工作区改动风险，MCP 与状态存储也需维护，实际成本未知。先在隔离项目按固定模型和小预算做只读任务，确认工具注册、实际结果与调用开销；能力降级、模型不可解析或事件缺失时停止并核宿主日志，回原生单代理。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:33-35](https://github.com/1225Sakura/oh-my-deepseekharness/blob/572612b29117ce9a0c45a34e3ccffafb29c42536/package.json#L33-L35)

Node 下限。

```text
  "engines": {
    "node": ">=22.19.0"
  },
```

**依据 2 · 源码核查**：[package.json:65-74](https://github.com/1225Sakura/oh-my-deepseekharness/blob/572612b29117ce9a0c45a34e3ccffafb29c42536/package.json#L65-L74)

宿主 peer 范围。

<details>
<summary>查看原文（10行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/dsh-commands": ">=0.1.2-rc.1 <0.1.3 || >=0.1.5-rc.1 <0.1.6 || >=0.1.7-rc.1 <0.2.0 || >=0.2.0-rc.1 <0.3.0",
    "@deepseek-ai/dsh-llm": ">=0.1.2-rc.1 <0.1.3 || >=0.1.5-rc.1 <0.1.6 || >=0.1.7-rc.1 <0.2.0 || >=0.2.0-rc.1 <0.3.0",
    "@deepseek-ai/dsh-mcp-client": ">=0.1.2-rc.1 <0.1.3 || >=0.1.5-rc.1 <0.1.6 || >=0.1.7-rc.1 <0.2.0 || >=0.2.0-rc.1 <0.3.0",
    "@deepseek-ai/dsh-skill": ">=0.1.2-rc.1 <0.1.3 || >=0.1.5-rc.1 <0.1.6 || >=0.1.7-rc.1 <0.2.0 || >=0.2.0-rc.1 <0.3.0",
    "@deepseek-ai/dsh-storage": ">=0.1.2-rc.1 <0.1.3 || >=0.1.5-rc.1 <0.1.6 || >=0.1.7-rc.1 <0.2.0 || >=0.2.0-rc.1 <0.3.0",
    "@deepseek-ai/dsh-storage-domain": ">=0.1.2-rc.1 <0.1.3 || >=0.1.5-rc.1 <0.1.6 || >=0.1.7-rc.1 <0.2.0 || >=0.2.0-rc.1 <0.3.0",
    "@deepseek-ai/dsh-system-prompt": ">=0.1.2-rc.1 <0.1.3 || >=0.1.5-rc.1 <0.1.6 || >=0.1.7-rc.1 <0.2.0 || >=0.2.0-rc.1 <0.3.0",
    "@deepseek-ai/dsh-tools": ">=0.1.2-rc.1 <0.1.3 || >=0.1.5-rc.1 <0.1.6 || >=0.1.7-rc.1 <0.2.0 || >=0.2.0-rc.1 <0.3.0",
    "@deepseek-ai/schemastery": "^3.18.2"
```

</details>

**依据 3 · 源码核查**：[lib/index.js:51-56](https://github.com/1225Sakura/oh-my-deepseekharness/blob/572612b29117ce9a0c45a34e3ccffafb29c42536/lib/index.js#L51-L56)

核心服务缺失报错。

```text
export async function setup(ctx, config, opts = {}) {
  // M3：cordis 配置重放 = dispose + 重跑 apply，probe 模块级缓存必须随之重置，否则陈旧
  _resetCache()
  // 核心服务缺失 → 启动即报错（规格 §6.1 例外条款）；storage 不在此列（缺失走降级）
  for (const svc of CORE_SERVICES)
    if (!ctx[svc]) throw new Error(`oh-my-dsh: 核心服务 ${svc} 缺失，插件无法工作（请升级 dsh 宿主）`)
```

**依据 4 · 源码核查**：[lib/index.js:176-190](https://github.com/1225Sakura/oh-my-deepseekharness/blob/572612b29117ce9a0c45a34e3ccffafb29c42536/lib/index.js#L176-L190)

子代理不可用时降级。

<details>
<summary>查看原文（15行）</summary>

```text
  // M3 c1：omd_delegate 硬路由工具——ctx.subagents spawn 缝在場才注册（缺席降级记 probe，
  // 不阻断插件；注册失败同样降级，软路由照常）
  let subagents
  try { subagents = ctx.subagents } catch { /* cordis：未 inject 的服务属性访问抛错=缺席 */ }
  if (subagents) {
    try {
      const defineTool = opts.defineTool ?? (await import('@deepseek-ai/dsh-tools')).defineTool
      await registerDelegateTool(ctx, defineTool, { config, roles: assets.roles })
      probeReport.delegate = { status: 'ok' }
    } catch (e) {
      probeReport.delegate = { status: 'failure', detail: String(e?.message ?? e) }
      ctx.logger?.warn?.(`oh-my-dsh: omd_delegate 注册失败（硬路由不可用，软路由照常）: ${e?.message ?? e}`)
    }
  } else {
    probeReport.delegate = { status: 'unavailable', detail: '宿主未挂载 subagent 缝（ctx.subagents 缺席）' }
```

</details>

**依据 5 · 源码核查**：[lib/delegate.js:154-169](https://github.com/1225Sakura/oh-my-deepseekharness/blob/572612b29117ce9a0c45a34e3ccffafb29c42536/lib/delegate.js#L154-L169)

日志非必然落盘。

<details>
<summary>查看原文（16行）</summary>

```text
      // U8 S1（AC-1/2/3）：route/fallback 事件落盘——每次派发恰一条 route 事件；fallback 派发
      // 同点追加 kind='fallback'（route/fallback 天然 1:1：其后 model 校验/spawn 失败两事件同在同失）。
      // 单一 try/catch → 写失败 warn 恰一次、不阻断派发、不改变任何返回/错误语义（recordFallback 同款口径）；
      // 落盘不依赖 model 校验结果（事件=路由判定，含后续失败车次）。
      const eventsAnchor = anchorCwd(args)
      const eventsRoot = resolve(eventsAnchor, sd)
      try {
        if (isHomeAnchor(eventsAnchor)) {
          ctx.logger?.warn?.(`omd_delegate: 落盘锚在用户主目录（${eventsRoot}），跳过事件落盘——请传 cwd=工作区绝对路径（IC-12）`)
        } else {
          await recordRouteEventImpl({ cwd: eventsAnchor, stateDir: sd, decision, kind: 'route' })
          if (decision.fallback)
            await recordRouteEventImpl({ cwd: eventsAnchor, stateDir: sd, decision, kind: 'fallback' })
        }
      } catch (e) {
        ctx.logger?.warn?.(`omd_delegate: events 落盘失败（不阻断派发）: ${e?.message ?? e}`)
```

</details>

#### 缺口

- 未测模型费用、权限和兼容
  **影响**：无法估计收益或恢复成本
  **进一步探讨**：限定预算、工作区与权限后试用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何让用户区分派发决策与子任务完成？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有 route/fallback 事件及工具最终输出；仅再写路由事件不构成增量。未验证设想是按 dispatchId 关联路由判定、模型校验、启动、终态与实际结果可得性，为缺失日志或中断显示 unknown，帮助用户决定继续、检查还是人工重试；避免保存任务正文及密钥。对照现有事件与工具输出，以日志写失败、provider 拒绝、模型校验失败、取消和完成后输出缺失进行测试，比较错误归因和重复派发；若无法稳定关联、unknown 被当成功、隐私泄露或核查负担过高则否定。先核现有 HUD/事件是否已有等价结果。

#### 证据与依据

**依据 1 · 源码核查**：[lib/delegate.js:145-169](https://github.com/1225Sakura/oh-my-deepseekharness/blob/572612b29117ce9a0c45a34e3ccffafb29c42536/lib/delegate.js#L145-L169)

派发标识和已存在的路由事件。

<details>
<summary>查看原文（25行）</summary>

```text
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      const parent = exec?.agent
      if (!parent) throw new Error('omd_delegate: 宿主未提供调用代理（exec.agent 缺席），无法派发')
      const dispatchId = `omdd-${Date.now().toString(36)}-${(++seq).toString(36)}`
      const decision = resolveDispatch({ config, table, args, dispatchId })
      // R3 深审 open question 收口（语义裁决）：tier 维持表档位口径（fallback/clamped 语义
      // 不变），roleOverrides 的模型覆盖以 roleOverride=true 标记留痕——审计 tier 与实际模型
      // 不同源的问题以「显式标记」而非语义混同收口，事件消费方据此区分模型来源。
      // U8 S1（AC-1/2/3）：route/fallback 事件落盘——每次派发恰一条 route 事件；fallback 派发
      // 同点追加 kind='fallback'（route/fallback 天然 1:1：其后 model 校验/spawn 失败两事件同在同失）。
      // 单一 try/catch → 写失败 warn 恰一次、不阻断派发、不改变任何返回/错误语义（recordFallback 同款口径）；
      // 落盘不依赖 model 校验结果（事件=路由判定，含后续失败车次）。
      const eventsAnchor = anchorCwd(args)
      const eventsRoot = resolve(eventsAnchor, sd)
      try {
        if (isHomeAnchor(eventsAnchor)) {
          ctx.logger?.warn?.(`omd_delegate: 落盘锚在用户主目录（${eventsRoot}），跳过事件落盘——请传 cwd=工作区绝对路径（IC-12）`)
        } else {
          await recordRouteEventImpl({ cwd: eventsAnchor, stateDir: sd, decision, kind: 'route' })
          if (decision.fallback)
            await recordRouteEventImpl({ cwd: eventsAnchor, stateDir: sd, decision, kind: 'fallback' })
        }
      } catch (e) {
        ctx.logger?.warn?.(`omd_delegate: events 落盘失败（不阻断派发）: ${e?.message ?? e}`)
```

</details>

**依据 2 · 源码核查**：[lib/delegate.js:195-227](https://github.com/1225Sakura/oh-my-deepseekharness/blob/572612b29117ce9a0c45a34e3ccffafb29c42536/lib/delegate.js#L195-L227)

模型校验、运行与终态。

<details>
<summary>查看原文（33行）</summary>

```text
      // C1：派发前路由校验——不可用 id 在此显式报错（不静默继承/不静默降级）
      let agentOptions
      if (effectiveModelId !== undefined) {
        const llm = opts.llm ?? tryGet(ctx, 'llm')
        if (!llm || typeof llm.resolveCallConfig !== 'function')
          throw new Error(`omd_delegate: llm 服务缺席——模型 id "${effectiveModelId}" 无法校验（不静默派发）`)
        providerId = args.provider ?? providerId ?? parentRouteForDelegation(parent).provider
        if (providerId === undefined)
          throw new Error(`omd_delegate: 无法确定 LLM provider（调用代理无路由且未显式提供）——model=${effectiveModelId}`)
        await llm.resolveCallConfig({ provider: providerId, model: effectiveModelId }, exec?.signal)
        agentOptions = { provider: providerId, model: effectiveModelId }
      }
      if (subagents.getProvider(DELEGATE_PROVIDER) === undefined)
        throw new Error(`omd_delegate: subagent provider "${DELEGATE_PROVIDER}" 未注册（已注册: ${subagents.list().join(', ') || '无'}）`)
      const finalPrompt = decision.role
        ? `[omd_delegate] 本次派发角色=${decision.role}（先经 skill 工具加载该角色卡，再按角色卡约束执行任务）。\n\n${args.prompt}`
        : args.prompt
      const request = {
        label: args.description,
        prompt: [{ type: 'text', text: finalPrompt }],
        parent,
        ...(agentOptions ? { agentOptions } : {}),
      }
      const run = await subagents.start(DELEGATE_PROVIDER, { ...request, signal: exec?.signal })
      let result
      try {
        result = await run.result
      } finally {
        try { await run.dispose?.() } catch { /* dispose 失败不吞子代理结果 */ }
      }
      if (result.stopReason !== 'completed') {
        const diag = result.diagnostic ? `；diagnostic=${result.diagnostic}` : ''
        throw new Error(`omd_delegate: 子代理异常结束 stopReason=${result.stopReason}${diag}`)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:108-128](https://github.com/1225Sakura/oh-my-deepseekharness/blob/572612b29117ce9a0c45a34e3ccffafb29c42536/lib/index.js#L108-L128)

MCP 可能降级。

<details>
<summary>查看原文（21行）</summary>

```text
  // 改为运行时动态挂载——cordis ctx.plugin({name,inject,Config,apply}, config) 已源码实证，
  // fiber 生命周期随 omd 重放/卸载自动回收。mcp-client 失败不阻断插件（降级路径见协议能力矩阵）。
  let mcpStatus = 'unavailable'
  try {
    const mcp = await import('@deepseek-ai/dsh-mcp-client')
    await ctx.plugin(
      { name: mcp.name, inject: mcp.inject, Config: mcp.Config, apply: mcp.apply },
      {
        transport: 'stdio',
        serverName: 'omd-state',
        command: process.execPath,
        args: [join(dirname(fileURLToPath(import.meta.url)), '..', 'mcp-server', 'index.mjs')],
        env: { OMD_STATE_DIR: config.stateDir, OMD_CODE_INTEL: JSON.stringify(config.codeIntel ?? {}), OMD_TEAM_STALE_MS: String(config.team?.staleAfterMs ?? 300_000) },
        failOnStartupError: false,
        reconnect: { enabled: true, initialDelayMs: 1000, maxDelayMs: 30000, maxAttempts: 5 },
      },
    )
    mcpStatus = 'ok'
  } catch (e) {
    mcpStatus = 'failure'
    ctx.logger?.warn?.(`oh-my-dsh: MCP server 挂载失败，全部 mcp__omd-state__* 工具不可用（state/notepad/prd/handoff/team/trace/hud/events/graph/代码智能；协议层降级为文件直读兜底）: ${e?.message ?? e}`)
```

</details>

#### 缺口

- 未穷尽 HUD 和事件协议
  **影响**：新增性及收益未知
  **进一步探讨**：先核现有展示，再做故障对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
