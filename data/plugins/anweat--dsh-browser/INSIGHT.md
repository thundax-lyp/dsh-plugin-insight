# DSH Browser

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[4ac0883](https://github.com/anweat/dsh-browser/tree/4ac0883bc4bb64dfe6bccd0792daf016627b1cb6)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/anweat/dsh-browser) [![npm 30d 5,874](https://img.shields.io/static/v1?label=npm+30d&message=5%2C874&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anweat/dsh-browser) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anweat/dsh-browser)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供浏览器运行时、网页观察和交互工具。

> **亮点**：[Q01](#research-q01) 把观察和交互放到同一调试对话。[Q02](#research-q02) 将 generation 和 outcome_unknown 用于降低对过期页面或未知提交的误判。

> **主要限制**：[Q03](#research-q03) 的登录域只约束所查路径，持久化状态、全局后备和模式仍需管理；[Q02](#research-q02) 的超时可能发生在副作用之后。

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
  - [Q01 · 会话型浏览器相对手动检查和写 Playwright 脚本，给开发者什么？](#detail-section-11)
  - [Q02 · 从 schema 到页面动作，怎样区分页面已变、超时和成功？](#detail-section-12)
  - [Q03 · 给会话一个允许域名的登录 profile，就形成网络和数据隔离吗？](#detail-section-13)
  - [Q04 · 何时值得试用，怎样降低提交结果未知后的重复动作？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已装合适浏览器的 DSH 前端开发者可在同一会话核对控件和错误状态。[Q01](#research-q01)

现成回归脚本适合固定流程，DevTools 也可读取相同页面；插件增加了会话内边观察边操作。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 页面观察 | 取文本、控件和表格 | 检查覆盖和截断 |
| 会话操作 | 在测试页复现动作 | 审批、页面版本与业务状态都需核对 |
| 登录状态 | 在明确域使用状态文件 | 排除全局后备和沿用权限假设 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 支持的 CLI、宿主服务和 Node | 是 | 注册工具及审批 | 保留原浏览器流程 |
| 系统浏览器或 Playwright Chromium | 真网页交互需要 | 打开页面和执行操作 | 查 runtime.status |
| 允许域及独立登录状态 | 仅需登录的页面 | 持有站点访问状态 | 先用隔离匿名页面 |
| OpenCLI | 仅相应动作 | 调用独立站点适配器 | 使用核心浏览器工具 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者核对 CLI、浏览器与权限 | runtime 可定位可用浏览器 |
| 观察 | 模型打开测试页并取控件和版本 | 回执目标对应正确页面 |
| 执行与退出 | 确认当前状态再做一条允许动作 | 结果未知则先读回，关闭会话后按需处理状态文件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 内核、存储与包资源未知 | 核对版本、审批和测试页 | 可使用已有浏览器 |
| 持续 | 浏览器、模型和截图资源未测 | 判断目标、确认操作、复核结果 | 按合格调试任务计 |
| 恢复 | 重试用量未知 | 核对登录范围与实际成功状态 | 非幂等操作先查页面 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 观察和操作可接续 | 动作的 target 和版本可检查 | 真实站点的识别正确率 |
| 失败区分 | 未知完成状态和回执 | 操作者重复提交率 |
| 登录块作用域 | 命名配置与过滤分支 | 跨域与浏览器实测 |

> **思考**：[Q03](#research-q03) 的登录域只约束所查路径，持久化状态、全局后备和模式仍需管理；[Q02](#research-q02) 的超时可能发生在副作用之后。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把观察和交互放到同一调试对话。[Q02](#research-q02) 将 generation 和 outcome_unknown 用于降低对过期页面或未知提交的误判。

[Q02](#research-q02) 的单一注册表在模式校验、参数校验和完成状态之间保留独立责任，可移植到同样会重建页面的工具。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的登录域只约束所查路径，持久化状态、全局后备和模式仍需管理；[Q02](#research-q02) 的超时可能发生在副作用之后。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先检查无敏感数据的隔离页面。出现跨域状态异常或不知道提交是否成功时停手，读回明确的状态后决定继续或退出。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

系统浏览器依赖、动作调度与登录状态路径已核查。真实页面执行、兼容和效果仍待验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/tools.ts、src/index.ts、src/actions/run.ts、src/actions/observe.ts、src/browser-service.ts、src/auth-profiles.ts、src/approval-policy.ts、src/actions/target.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 Git 源码级核查宿主入口、浏览器动作、登录与回执。未运行目标代码、浏览器、宿主或测试。
- 下一步：[Q04](#research-q04) 对已知状态的表单模拟过期与迟响应，比较重复动作、误取消和人工核对时间。

**分析版本**

- **仓库**：[anweat/dsh-browser](https://github.com/anweat/dsh-browser)
- **版本号**：0.2.3（[固定提交 4ac0883](https://github.com/anweat/dsh-browser/tree/4ac0883bc4bb64dfe6bccd0792daf016627b1cb6)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 用可验证操作指纹区分偶发超时和需要重新提交的请求，是否减少重复应由对照决定。

[Q04](#research-q04) 对已知状态的表单模拟过期与迟响应，比较重复动作、误取消和人工核对时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 36 | 2868 | — | — | 58361 |
| .js | source | 89 | 22520 | 20098 | 2897 | — |
| .mjs | source | 7 | 437 | 332 | 70 | — |
| .ts | source | 76 | 16224 | 12812 | 2230 | — |
| .tsx | source | 13 | 1373 | 1098 | 183 | — |
| .ts | test | 75 | 14466 | 12579 | 1045 | — |
| .js | test | 1 | 327 | 254 | 70 | — |
| .tsx | test | 2 | 132 | 110 | 19 | — |
| .mjs | test | 1 | 13 | 8 | 5 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-14），可前往 [GitHub Issues](https://github.com/anweat/dsh-browser/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用户怎样用会话浏览器查证页面和完成受控操作，状态、权限及超时何时会改变结果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 会话型浏览器相对手动检查和写 Playwright 脚本，给开发者什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

调试本地站点的开发者通常先切浏览器窗口，定位页面控件，再从 DevTools 或脚本拿局部结果。这个插件在 DSH 会话内提供目标页、结构化控件、表格和操作。其中 indexed 模式先查目录／参数，再执行具体动作；flat 把同一注册条目各自变为原生工具。它减少用户自己接工具和复制截图的步骤，底层打开和交互仍由 Playwright 或 Patchright 及浏览器执行。一次合格调试是从已知 URL 打开页面，以观察时间和目标标识确认表格或控件，复现一个步骤并记录真实页面结果。已经有稳定回归脚本的团队更容易复跑原脚本，插件增量主要是探索、看页面和找下一步。作者举例的本地环境及默认内核不能推成任意站点都能可靠访问。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:57-89](https://github.com/anweat/dsh-browser/blob/4ac0883bc4bb64dfe6bccd0792daf016627b1cb6/README.md#L57-L89)

本地应用和运行时先决条件

<details>
<summary>查看原文（33行）</summary>

````text
## 第一次使用

1. **重启后找到设置卡片**：设置页的“插件”里，`@anweat/dsh-browser` 的配置卡片标题是“浏览器自动化”。顶部**状态摘要**直接说明运行环境：
   - 红色徽章“没有可用浏览器”：点“查看详情”有可照做的步骤；
   - “浏览器：系统 Chrome / Edge”：正常状态，什么都不用做；
   - “OpenCLI 未安装”：只是提示，不是警告。
2. **确认浏览器**：让模型调用 `browser_call({action:"runtime.status"})`（或看状态摘要），`browser.ready` 为 `true` 即可。
   - 有 Chrome / Edge：自动使用，不下载任何东西。Playwright 的 Chromium 一旦下载过就改用它；填了 `executablePath`，或把 `channel` 设为 `chrome` / `msedge`，则固定用你指定的那个，找不到就报错。
   - 都没有：装 Chrome 或 Edge；或让模型调用 `runtime.install`（下载约 190 MB，会询问审批）；或在设置里填 `executablePath`。完整选项见 [内核与依赖](https://github.com/anweat/dsh-browser/blob/master/docs/guide/runtime-and-dependencies.md)。
3. **可选依赖**：
   - **OpenCLI**：只有 `opencli.*` 动作和 Web Search Pro 的 `browser-opencli` 后端用到。`npm i -g @jackwener/opencli`，重启后调用 `opencli.status`。不装不影响其他功能，也不会让 `dsh plugin add` 失败。查找顺序与排障见 [登录态复用与 OpenCLI](https://github.com/anweat/dsh-browser/blob/master/docs/guide/login-and-opencli.md)。
   - **dsh-web-search-pro**：它在运行时读取本插件提供的 `browser` 服务来做页面快照、`playwright` 抓取和搜索页类平台，两者可独立安装；这些浏览器类能力需要本插件在场。

## 快速示例

**本地开发服务器**（例如 `http://127.0.0.1:5173` 的 Vite 应用）：先在设置卡片（或配置文件）里设置：

```yaml
- insert:
    - id: browser
      name: '@anweat/dsh-browser'
      config:
        channel: chrome            # 固定用本机 Chrome；省略则自动选择
        headless: true             # 默认值，不弹窗口
        automationMode: autonomous # 会话的审批策略为 never 时需要，见下
```

保存后重启 profile，然后模型依次调用 `browser_call`：

```text
# 以下每行是一次 browser_call 的参数
{"action":"target.open","args":{"url":"http://127.0.0.1:5173"}}
{"action":"observe.read","args":{"sections":["controls","tables"]}}
````

</details>

**依据 2 · 作者声明**：[README.md:104-116](https://github.com/anweat/dsh-browser/blob/4ac0883bc4bb64dfe6bccd0792daf016627b1cb6/README.md#L104-L116)

目录、调用、控制类能力

<details>
<summary>查看原文（13行）</summary>

```text
## 工具与动作概览

模型先用 `browser_index` 看目录（无参数列出分组和环境状态；`{group}` 列动作；`{action}` 给完整参数 schema；`{query}` 关键词检索），再用 `browser_call({action, args})` 执行。所有动作返回同一种信封 `{ok, action, executionStatus, result | error{code,message,hint}}`。把 `toolSurface` 设为 `flat` 可以改成每个动作一个工具（常驻约 17.4k token，仅用于对照与调试）。

| 组 | 用途 |
|---|---|
| `runtime` | 运行时状态、Chromium 安装、登录 profile 与限流的策略覆盖层 |
| `target` | 打开 / 关闭 / 列出 / 切换页面，下载文件 |
| `observe` | 读页面文本、结构化观察（controls / links / tables）、截图 |
| `act` | 点击、填写、输入、清空、按键、选择、勾选、悬停、滚动、上传、等待 |
| `inspect` | console 与失败请求、下载记录、生效的策略 |
| `script` | 页面 JavaScript、内置只读脚本、UserScript |
| `automation` | 检索 / 运行可复用资产、开发草稿、内联 recipe |
```

</details>

**依据 3 · 源码核查**：[src/tools.ts:97-120](https://github.com/anweat/dsh-browser/blob/4ac0883bc4bb64dfe6bccd0792daf016627b1cb6/src/tools.ts#L97-L120)

按配置投影同一动作表

<details>
<summary>查看原文（24行）</summary>

```text
export function registerTools(ctx: Context, config: ResolvedConfig, service: BrowserService, assets?: AutomationAssetStore, runtime: ToolRuntime = {}): void {
  if (!config.enabled) return
  const development = assets ? new AutomationDevelopmentService(assets, config.automationAssets) : undefined
  const runEnv: RunEnvironment = { mode: config.automationMode, options: config.automationAssets, enabled: config.enabled }
  const register = (tool: any): void => { ctx.tools.register(tool) }
  // Read at call time wherever the surface allows it, so a config edit applies to the next call.
  // Tool descriptions are the exception: the host fixes them when the tool is registered.
  const promptsNow = (): ResolvedPrompts | undefined => config.prompts?.current()

  const actionContext = (exec: any): ActionContext => ({
    service, config, ...assets ? { assets } : {}, ...development ? { development } : {},
    session: sessionKeyFor(exec?.agent),
    sessionId: sessionId(exec),
    agent: exec?.agent,
    signal: exec?.signal ?? new AbortController().signal,
  })

  if (config.toolSurface === 'flat') {
    const exposed = new Set(configuredBrowserActions(config.automationMode, config.automationAssets, config.enabled))
    for (const action of ACTIONS.filter(entry => exposed.has(entry.name))) register(flatTool(action, actionContext, runEnv, promptsNow()))
    return
  }

  register(defineTool({
```

</details>

**依据 4 · 源码核查**：[src/tools.ts:155-182](https://github.com/anweat/dsh-browser/blob/4ac0883bc4bb64dfe6bccd0792daf016627b1cb6/src/tools.ts#L155-L182)

两种入口共享执行器

<details>
<summary>查看原文（28行）</summary>

```text
  register(defineTool({
    name: CALL_TOOL,
    description: callDescription(promptsNow()?.tools.browser_call),
    parameters: { ...CALL_PARAMETERS },
    output: { schema: ENVELOPE_SCHEMA, render: renderEnvelope as never },
    timeoutMs: 600_000,
    // Calls are serialized per agent step: interactions share one page, and the Host classifier cannot read the action.
    isConcurrencySafe: () => false,
    async execute(args: { action: string; args?: Record<string, unknown> }, exec: unknown) {
      runtime.refreshSkill?.()
      return runAction(args.action, args.args, actionContext(exec), runEnv) as Promise<ActionEnvelope> as never
    },
  }))
}

/** One flat tool for one action: the same registry entry, projected as a native tool. */
function flatTool(action: ActionDef, actionContext: (exec: any) => ActionContext, runEnv: RunEnvironment, prompts?: ResolvedPrompts): unknown {
  const summary = prompts?.actions[action.name]?.summary ?? action.summary
  const notes = prompts?.actions[action.name]?.notes ?? action.notes
  return defineTool({
    name: flatToolName(action),
    description: summary + (notes ? ' ' + notes : '') + (action.group === 'runtime' || action.group === 'inspect' ? '' : ' ' + COMPLIANCE_NOTICE),
    parameters: expandParams(action.params) as never,
    output: { schema: ENVELOPE_SCHEMA, render: renderEnvelope as never },
    timeoutMs: action.timeoutMs + 5_000,
    isConcurrencySafe: (args: unknown) => traitsFor(action, args).concurrencySafe,
    async execute(args: Record<string, unknown>, exec: unknown) {
      return runAction(action.name, args, actionContext(exec), runEnv) as never
```

</details>

#### 缺口

- 缺稳定站点同条件耗时评估
  **影响**：不能量化查证效率
  **进一步探讨**：两种手段对同一故障给控件证据和结果，比较人工介入和步骤

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从 schema 到页面动作，怎样区分页面已变、超时和成功？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply 依赖 tools，先安装工具 pre-execute，把调用解码到具体 action 与 args，再根据模式、目标资产和策略变更预览选择允许、询问或拒绝。拒绝分支不会执行已解码动作，未知动作在执行器返回 UNKNOWN_ACTION。执行器另校验开放能力及参数，ctx.signal 已终止时取消，给动作单独 deadline；观察获得 targetId 与 generation，下次 click 将 generation 用于拒绝过期页面，再定位实时控件并执行。页面在会话中保持，弹窗进入列表但不会自动接管。执行器给副作用动作的超时状态 outcome_unknown，表示操作可能已经完成；因此应再次读取页面或业务系统状态，再决定是否重做提交。普通读操作超时作为失败。成功的结构化返回便于区分动作、结果和截断，但不代表外部业务已经确认。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:73-120](https://github.com/anweat/dsh-browser/blob/4ac0883bc4bb64dfe6bccd0792daf016627b1cb6/src/index.ts#L73-L120)

真实应用、审批和 service 注册

<details>
<summary>查看原文（48行）</summary>

```text
  const service = new BrowserService(resolved)
  const assets = new AutomationAssetStore(resolved.automationAssets)

  // Apply the configured exposure/approval mode before every browser call.
  // Approval is decided per ACTION: browser_call (and each flat tool) is
  // resolved to its action and arguments first, so the user is asked about
  // `act.click #submit`, not about a generic dispatcher. browser_index only
  // reads the catalog and is let through. Validation remains active even when
  // unrestricted mode skips approvals. A call whose arguments `runAction` would
  // refuse (INVALID_ARGS) is let through unasked, see `browserCallDecision`: the
  // executor validates it again and runs nothing, so there is nothing to approve.
  ctx.on('tools/pre-execute', async (exec, next) => {
    const downstream = await next()
    if (downstream.kind !== 'allow') return downstream
    const call = resolveBrowserCall(exec.name, exec.arguments)
    // `unresolved` is a browser_call naming no known action: it runs no
    // action and returns a structured UNKNOWN_ACTION error, so nothing to approve.
    if (call?.kind === 'index' || call?.kind === 'unresolved') return downstream
    if (call?.kind === 'action') {
      // automation.run and automation.develop test act on a stored asset: the policy needs to know what kind it is,
      // and for a recipe draft which steps it would replay.
      const callArgs = (call.args ?? {}) as { id?: unknown; action?: unknown }
      const replaysAsset = call.action === 'automation.run' || (call.action === 'automation.develop' && callArgs.action === 'test')
      const target = replaysAsset && typeof callArgs.id === 'string' ? assets.get(callArgs.id) : undefined
      const policyChange = policyChangeFor(call.action, call.args)
      const preview = policyChange ? service.previewPolicyChange(policyChange) : undefined
      return browserCallDecision(call.action, call.args, resolved.automationMode, target?.kind, call.action === 'automation.develop' ? target?.recipe : undefined, target ? { id: target.id, name: target.name, revision: target.revision } : undefined, preview)
    }
    return browserPolicyDecision(exec.name, exec.arguments, resolved.automationMode)
  })

  // Provide the `browser` service so consumers (web-search-pro) can inject it.
  // ctx.provide is scoped to this plugin's fiber; the browser instance itself
  // is closed via the effect disposer below.
  ctx.provide('browser', service)
  ctx.effect(() => () => void service.close())

  // Optional: the `dsh-browser` skill is registered only when the Host has a
  // skill registry. It must not be a declared `inject` (Cordis 4.0.4 would
  // hang the plugin without it); this opens a scoped, optional dependency.
  // `prompts.skill` is read live: the skill is registered, withdrawn or invalidated when it changes.
  const skill = registerSkillWhenAvailable(ctx, undefined, resolved.prompts)

  // `prompts.errorHints` replace the by-code hints wherever an error is built; read per call.
  ctx.effect(() => installErrorHints(() => resolved.prompts.current().errorHints))

  registerTools(ctx, resolved, service, assets, { skillAvailable: skill.isAvailable, refreshSkill: skill.refresh })
  registerAutomationAssetRpc(ctx, assets, service, () => describePrompts({ prompts: resolved.prompts, mode: resolved.automationMode, options: resolved.automationAssets, enabled: resolved.enabled }))
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:155-167](https://github.com/anweat/dsh-browser/blob/4ac0883bc4bb64dfe6bccd0792daf016627b1cb6/src/tools.ts#L155-L167)

browser_call 将实参交给同一执行器

<details>
<summary>查看原文（13行）</summary>

```text
  register(defineTool({
    name: CALL_TOOL,
    description: callDescription(promptsNow()?.tools.browser_call),
    parameters: { ...CALL_PARAMETERS },
    output: { schema: ENVELOPE_SCHEMA, render: renderEnvelope as never },
    timeoutMs: 600_000,
    // Calls are serialized per agent step: interactions share one page, and the Host classifier cannot read the action.
    isConcurrencySafe: () => false,
    async execute(args: { action: string; args?: Record<string, unknown> }, exec: unknown) {
      runtime.refreshSkill?.()
      return runAction(args.action, args.args, actionContext(exec), runEnv) as Promise<ActionEnvelope> as never
    },
  }))
```

</details>

**依据 3 · 源码核查**：[src/actions/run.ts:158-211](https://github.com/anweat/dsh-browser/blob/4ac0883bc4bb64dfe6bccd0792daf016627b1cb6/src/actions/run.ts#L158-L211)

严格分派、参数与 deadline 路径

<details>
<summary>查看原文（54行）</summary>

```text
export async function runAction(name: unknown, rawArgs: unknown, ctx: ActionContext, env: RunEnvironment): Promise<ActionEnvelope> {
  const label = typeof name === 'string' ? name : String(name)
  const action = findAction(name)
  if (!action) {
    const close = typeof name === 'string' ? ACTIONS.filter(candidate => candidate.name.includes(name.split('.').pop() ?? name) || name.includes(candidate.group)).slice(0, 5).map(candidate => candidate.name) : []
    return failure(label, 'failed', {
      code: 'UNKNOWN_ACTION',
      message: `Unknown action: ${label}`,
      hint: `Actions are named group.action. Call browser_index() to list groups${close.length ? `; similar: ${close.join(', ')}` : ''}.`,
    })
  }
  const unavailable = actionUnavailableReason(action, env.mode, env.options, env.enabled)
  if (unavailable) {
    return failure(action.name, 'failed', { code: 'POLICY_DENIED', message: `Action ${action.name} is ${unavailable}`, hint: hintFor('POLICY_DENIED')! })
  }
  const validation = validateActionArgs(action, rawArgs)
  if (!validation.ok) {
    return failure(action.name, 'failed', {
      code: 'INVALID_ARGS',
      message: validation.errors.join('; '),
      hint: 'Fix the arguments to match the schema below and call again.',
      schema: compactSchema(action.name, action.params),
    })
  }
  // The mode may allow some operations of an action and not others (automation.develop: get yes, test no).
  const operationUnavailable = actionUnavailableReason(action, env.mode, env.options, env.enabled, validation.value)
  if (operationUnavailable) {
    return failure(action.name, 'failed', { code: 'POLICY_DENIED', message: `Action ${action.name} is ${operationUnavailable}`, hint: hintFor('POLICY_DENIED')! })
  }
  const traits = traitsFor(action, validation.value)
  if (ctx.signal.aborted) return failure(action.name, 'cancelled', { code: 'CANCELLED', message: 'cancelled before start', hint: hintFor('CANCELLED')! })

  const execute = async (): Promise<ActionEnvelope> => {
    let workSignal: AbortSignal = ctx.signal
    try {
      const outcome = await withDeadline(signal => { workSignal = signal; return action.execute(validation.value, { ...ctx, signal }) }, action.timeoutMs, ctx.signal, action.settleMs)
      if (outcome.timedOut) {
        // The work may still finish after the deadline, so a side-effecting action has an unknown outcome.
        const status: ExecutionStatus = traits.mutating ? 'outcome_unknown' : 'failed'
        return failure(action.name, status, {
          code: 'DEADLINE',
          message: `${action.name} did not finish within ${action.timeoutMs} ms`,
          hint: traits.mutating ? 'Outcome unknown: verify the page state with observe.read before retrying; do not blindly repeat a submit.' : hintFor('DEADLINE')!,
        })
      }
      // A result may carry its own outcome (a recipe that ran and failed still returns its whole report).
      const own = outcomeOf(outcome.value)
      const { result, truncation } = truncateResult(asResult(outcome.value))
      return { ok: own?.ok ?? true, action: action.name, executionStatus: own?.executionStatus ?? 'completed', result, ...own?.error ? { error: own.error } : {}, ...truncation ? { truncation } : {} }
    } catch (error) {
      const body = mapError(error, action.name, { signal: workSignal })
      // The deadline stopped work that had not returned: for a side-effecting action the outcome is unknown.
      if (abortedByDeadline(workSignal) && traits.mutating) return failure(action.name, 'outcome_unknown', { ...body, code: 'DEADLINE', hint: 'Outcome unknown: verify the page state with observe.read before retrying; do not blindly repeat a submit.' })
      return failure(action.name, body.code === 'CANCELLED' ? 'cancelled' : 'failed', body)
```

</details>

**依据 4 · 源码核查**：[src/actions/observe.ts:45-60](https://github.com/anweat/dsh-browser/blob/4ac0883bc4bb64dfe6bccd0792daf016627b1cb6/src/actions/observe.ts#L45-L60)

观察返回 generation 和局限

<details>
<summary>查看原文（16行）</summary>

```text
      'maxItems caps each section and each table\'s rows; maxBytes caps the whole result (2000-90000). The result is always valid JSON: whole items or rows are dropped from the end, text is cut at a character.',
      'truncation:{omittedBySection, reason} appears when anything is missing: content counts characters, tableRows counts rows, controls/links/tables count items. counts has how many the page had. No truncation key means nothing was cut.',
      'To get the rest: raise maxItems/maxBytes, ask for one section, or scope with locator (a form, a table) or region.',
      'limits (if present) lists what was not covered, such as cross-origin iframes. generation is the page generation at the start of the scan: pass it as expectGeneration to the next act.*.',
    ].join('\n'),
  },
}

export const OBSERVE_ACTIONS: ActionDef[] = [
  {
    name: 'observe.read',
    group: 'observe',
    summary: 'Read the current page: URL, title, readable text; with sections also its controls, links, and tables.',
    notes: 'Always returns url, title, targetId, generation. Default sections [content] adds text. controls/links/tables give records whose locator you can pass to act.*; a locator is checked unique on the live page. Results are cut at item boundaries to fit maxBytes (truncation lists what is missing).',
    topics: OBSERVE_TOPICS,
    params: {
```

</details>

**依据 5 · 源码核查**：[src/browser-service.ts:1336-1349](https://github.com/anweat/dsh-browser/blob/4ac0883bc4bb64dfe6bccd0792daf016627b1cb6/src/browser-service.ts#L1336-L1349)

弹窗登记与计数

<details>
<summary>查看原文（14行）</summary>

```text
    // A popup (window.open, target=_blank) joins this session's page list; it never takes over the active page by itself.
    state.context.on('page', (opened: any) => { if (state.context) this.trackPage(state, opened) })
    state.page = await state.context.newPage()
    this.trackPage(state, state.page)
    return { page: state.page, ...rebuilt ? { rebuilt } : {} }
  }

  /**
   * Add a page to the session's list and wire its capture and close handling.
   * Idempotent: the context 'page' event and the explicit call both land here.
   */
  private trackPage(state: SessionState, page: any): void {
    if (state.pages.some(entry => entry.page === page)) return
    const entry: SessionPage = { id: 't' + state.nextTarget++, page, generation: ++state.generationClock }
```

</details>

**依据 6 · 源码核查**：[src/browser-service.ts:1531-1543](https://github.com/anweat/dsh-browser/blob/4ac0883bc4bb64dfe6bccd0792daf016627b1cb6/src/browser-service.ts#L1531-L1543)

点击前校验 generation

<details>
<summary>查看原文（13行）</summary>

```text
  async click(target: BrowserTarget, opts: { expectGeneration?: number; timeoutMs?: number; waitMs?: number; session?: string } = {}): Promise<InteractiveState> {
    const page = await this.ensureActivePage(undefined, { session: opts.session })
    this.assertGeneration(page, opts.expectGeneration)
    await this.onTarget(page, target, locator => locator.click({ timeout: boundedTimeout(opts.timeoutMs, 'act.click timeoutMs') }))
    // The click may have closed the page it hit (a popup's own close button). That is a success, not TARGET_CLOSED.
    await page.waitForTimeout(opts.waitMs ?? 500).catch((error: unknown) => { if (!page.isClosed()) throw error })
    if (page.isClosed()) {
      const fallback = this.peek(opts.session)?.page
      if (!fallback || fallback.isClosed()) return { url: '', title: '', text: '', closedPage: true }
      return { ...await this.readState(fallback, true), closedPage: true }
    }
    return this.readState(page, true)
  }
```

</details>

#### 缺口

- 未模拟提交已发生但连接断开
  **影响**：outcome_unknown 的恢复仍依赖用户能观察业务状态
  **进一步探讨**：在隔离表单让提交响应晚到，核对重复动作前后的业务计数

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 给会话一个允许域名的登录 profile，就形成网络和数据隔离吗？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

命名 profile 在目标 URL 解析时要求命中 hostname 或其子域，读入时过滤 cookies 与 origins。切换 profile 参数、作用域或部分 context options 可关旧页重建。配置全局 storageStatePath 时存在非命名 profile 的后备分支，因此不能将命名列表视作所有流量唯一入口，也不能从首次目标校验推断所有第三方子资源都被网络层阻挡。浏览器脚本可以使用该页面源的能力，标准模式对交互、上传、下载、evaluate 等关键动作发确认，有些模式会允许更多；代理变更也明确按配置和模式判定。关闭会话时仅为配置 persistState 的命名 profile 原子重命名写出状态 JSON，崩溃已关闭的上下文可能拿不到状态。文件里仍含浏览器状态，应独立管理。隔离测试需按初始 URL、重定向、跨域资源和关停后残留逐一核对，不用普通账号做测试。

#### 证据与依据

**依据 1 · 源码核查**：[src/auth-profiles.ts:13-41](https://github.com/anweat/dsh-browser/blob/4ac0883bc4bb64dfe6bccd0792daf016627b1cb6/src/auth-profiles.ts#L13-L41)

域名匹配及状态文件检查

<details>
<summary>查看原文（29行）</summary>

```text
export function hostAllowed(hostname: string, domains: readonly string[]): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, '')
  return domains.some(value => {
    const domain = value.toLowerCase().trim().replace(/^\*\./, '').replace(/\.$/, '')
    return domain.length > 0 && (host === domain || host.endsWith('.' + domain))
  })
}

export class AuthProfileStore {
  constructor(private profiles: Record<string, AuthProfileConfig> = {}) {}

  /** Swap in the effective profiles (baseline plus policy overlay); sessions resolve against them from the next call on. */
  replace(profiles: Record<string, AuthProfileConfig>): void { this.profiles = profiles }

  get(id: string): AuthProfileConfig | undefined { return this.profiles[id] }

  resolve(id: string, targetUrl: string): ResolvedAuthProfile {
    const profile = this.profiles[id]
    if (!profile) throw new Error('unknown auth profile: ' + id)
    const url = new URL(targetUrl)
    if (!hostAllowed(url.hostname, profile.allowedDomains ?? [])) throw new Error('auth profile ' + id + ' is not allowed for ' + url.hostname)
    if (!profile.storageStatePath?.trim()) throw new Error('auth profile ' + id + ' has no storageStatePath')
    const persistState = profile.persistState ?? false
    if (!fs.existsSync(profile.storageStatePath)) {
      if (!persistState) throw new Error('auth profile ' + id + ' storageState file does not exist: ' + profile.storageStatePath)
    } else if (!fs.statSync(profile.storageStatePath).isFile()) {
      throw new Error('auth profile ' + id + ' storageState path is not a file: ' + profile.storageStatePath)
    }
    return { id, ...profile, persistState }
```

</details>

**依据 2 · 源码核查**：[src/browser-service.ts:902-940](https://github.com/anweat/dsh-browser/blob/4ac0883bc4bb64dfe6bccd0792daf016627b1cb6/src/browser-service.ts#L902-L940)

进入浏览器上下文时过滤与全局后备

<details>
<summary>查看原文（39行）</summary>

```text
  private async transientContext(url: string, opts: { authProfile?: string; rulePack?: string; anonymous?: boolean; context?: ContextOptions; interactive?: boolean } = {}): Promise<{ context: any; profile?: ResolvedAuthProfile; rulePack?: ResolvedRulePack; contextOptions: ContextOptions }> {
    if (!['http:', 'https:'].includes(new URL(url).protocol)) throw new Error('browser navigation requires an HTTP(S) URL')
    this.refreshPolicy()
    const profileId = opts.anonymous ? undefined : (opts.authProfile ?? this.config.defaultAuthProfile)
    const profile = profileId ? this.authProfiles.resolve(profileId, url) : undefined
    const rulePack = resolveRulePack(this.config.rulePacks, opts.rulePack, url)
    const stateOptions = profile
      ? storageStateOptions(profile.storageStatePath, `auth profile ${profile.id}`, profile.persistState)
      : (!opts.anonymous ? storageStateOptions(this.config.storageStatePath, 'global') : {})
    let scopedState: unknown
    if (profile && stateOptions.storageState) {
      const state = JSON.parse(fs.readFileSync(stateOptions.storageState, 'utf8'))
      scopedState = {
        cookies: (state.cookies ?? []).filter((cookie: { domain: string }) => hostAllowed(cookie.domain.replace(/^\./, ''), profile.allowedDomains)),
        origins: (state.origins ?? []).filter((origin: { origin: string }) => hostAllowed(new URL(origin.origin).hostname, profile.allowedDomains)),
      }
    }
    const applied = opts.context ?? this.config.contextDefaults
    const contextOptions = { ...stateOptions, ...(scopedState ? { storageState: scopedState } : {}), ...this.contextCreationOptions(applied, opts.interactive === true) }
    let context: any
    for (let attempt = 0; attempt < 2; attempt++) {
      const browser = await this.ensure()
      try {
        context = await browser.newContext(contextOptions)
        break
      } catch (error) {
        if (attempt > 0 || this.browserConnected(browser)) throw error
        this.handleBrowserDisconnected(browser)
      }
    }
    if (!context) throw new Error('dsh-browser: browser context could not be created after reconnecting')
    try {
      if (rulePack?.initScriptPath) await context.addInitScript({ path: rulePack.initScriptPath })
    } catch (error) {
      await context.close().catch(() => {})
      throw error
    }
    return { context, contextOptions: applied, ...profile ? { profile } : {}, ...rulePack ? { rulePack } : {} }
  }
```

</details>

**依据 3 · 源码核查**：[src/browser-service.ts:942-961](https://github.com/anweat/dsh-browser/blob/4ac0883bc4bb64dfe6bccd0792daf016627b1cb6/src/browser-service.ts#L942-L961)

状态写盘与关闭

<details>
<summary>查看原文（20行）</summary>

```text
  private async persistAndClose(session: { context: any; profile?: ResolvedAuthProfile }): Promise<void> {
    try {
      if (session.profile?.persistState) {
        let state: unknown
        try {
          state = await session.context.storageState()
        } catch (error) {
          // A crashed browser cannot provide state. Filesystem failures below
          // still propagate so failed persistence is never reported as success.
          if (/target page, context or browser has been closed|browser has been closed|browser disconnected/i.test(String(error))) return
          throw error
        }
        fs.mkdirSync(path.dirname(session.profile.storageStatePath), { recursive: true })
        const temporary = session.profile.storageStatePath + '.tmp-' + uid().slice(0, 8)
        fs.writeFileSync(temporary, JSON.stringify(state, null, 2), { encoding: 'utf8', mode: 0o600 })
        fs.renameSync(temporary, session.profile.storageStatePath)
      }
    } finally {
      await session.context.close().catch(() => {})
    }
```

</details>

**依据 4 · 源码核查**：[src/browser-service.ts:1303-1327](https://github.com/anweat/dsh-browser/blob/4ac0883bc4bb64dfe6bccd0792daf016627b1cb6/src/browser-service.ts#L1303-L1327)

按登录状态或配置重建 context

<details>
<summary>查看原文（25行）</summary>

```text
      const liveProfile = state.profile ? this.authProfiles.get(state.profile.id) : undefined
      const scopeChanged = !!state.profile && !!liveProfile
        && (liveProfile.storageStatePath !== state.profile.storageStatePath
          || [...liveProfile.allowedDomains ?? []].sort().join('\n') !== [...state.profile.allowedDomains ?? []].sort().join('\n'))
      const sameLogin = (opts.authProfile ?? this.config.defaultAuthProfile) === state.profile?.id && opts.rulePack === state.rulePack?.id
      const changedOptions = differingContextOptions(applied, wanted)
      if (sameLogin && !scopeChanged && changedOptions.length === 0) {
        if (state.profile) this.authProfiles.resolve(state.profile.id, targetUrl)
        if (state.rulePack) resolveRulePack(this.config.rulePacks, state.rulePack.id, targetUrl)
        return { page: state.page }
      }
      rebuilt = [
        ...changedOptions,
        ...(opts.authProfile ?? this.config.defaultAuthProfile) === state.profile?.id ? [] : ['authProfile'],
        ...scopeChanged && (opts.authProfile ?? this.config.defaultAuthProfile) === state.profile?.id ? ['authProfileScope'] : [],
        ...opts.rulePack === state.rulePack?.id ? [] : ['rulePack'],
      ]
      await this.closePage(state)
    }
    if (targetUrl) {
      const session = await this.transientContext(targetUrl, { ...opts, context: wanted, interactive: true })
      state.context = session.context
      state.profile = session.profile
      state.rulePack = session.rulePack
      state.contextOptions = session.contextOptions
```

</details>

**依据 5 · 源码核查**：[src/approval-policy.ts:97-156](https://github.com/anweat/dsh-browser/blob/4ac0883bc4bb64dfe6bccd0792daf016627b1cb6/src/approval-policy.ts#L97-L156)

根据模式对动作、代理与脚本判定

<details>
<summary>查看原文（60行）</summary>

```text
  if (action) {
    if (!isBrowserActionExposed(name, mode, args ?? {})) return { kind: 'deny', reason: `Browser action ${name} is disabled by automationMode=${mode}` }
    switch (action.approval) {
      case 'interaction': {
        if (mode === 'read-only') return { kind: 'deny', reason: `Page interaction is disabled by automationMode=${mode}` }
        if (mode === 'standard') return { kind: 'ask', reason: 'Run a direct Playwright page interaction: ' + interactionLabel(name, args) }
        return { kind: 'allow' }
      }
      case 'install': {
        if (mode === 'read-only') return { kind: 'deny', reason: `Browser installation is disabled by automationMode=${mode}` }
        if (mode === 'unrestricted') return { kind: 'allow' }
        return { kind: 'ask', reason: `${name}: Install Playwright Chromium into the shared browser cache` }
      }
      case 'upload': {
        const files = Array.isArray((args as { files?: unknown })?.files)
          ? (args as { files: unknown[] }).files.filter(value => typeof value === 'string') as string[]
          : []
        if (files.length === 0) return { kind: 'deny', reason: `${name} requires one or more absolute file paths` }
        if (mode === 'read-only') return { kind: 'deny', reason: `Local file upload is disabled by automationMode=${mode}` }
        if (mode === 'unrestricted') return { kind: 'allow' }
        return { kind: 'ask', reason: `${name} ${targetLabel(args)}: Read local files and expose them to the current website upload control: ` + files.slice(0, 5).join(', ') }
      }
      case 'policy': {
        // Judged by direction, not by action: tightening and no-ops are free in every mode. A change the preview
        // could not plan is let through: the executor refuses it with the reason and changes nothing.
        if (policyPreview && !policyPreview.ok) return { kind: 'allow' }
        if (policyPreview && policyPreview.direction !== 'loosen') return { kind: 'allow' }
        const diff = policyPreview?.ok ? policyPreview.lines.join('; ') : 'a change that may widen what the browser can do'
        if (mode === 'read-only') return { kind: 'deny', reason: `Loosening a restriction is disabled by automationMode=${mode}: ${clip(diff, 300)}` }
        if (mode === 'unrestricted') return { kind: 'allow' }
        return { kind: 'ask', reason: `${name}: Loosen a browser restriction: ${clip(diff, 500)}` }
      }
      case 'download': {
        const url = (args as { url?: unknown })?.url
        if (typeof url !== 'string' || !url.trim()) return { kind: 'deny', reason: `${name} requires a URL` }
        if (mode === 'read-only') return { kind: 'deny', reason: `File download is disabled by automationMode=${mode}` }
        if (mode === 'unrestricted') return { kind: 'allow' }
        const filename = (args as { filename?: unknown })?.filename
        return { kind: 'ask', reason: `${name} ${clip(url, 160)}: Fetch this URL with the session's login state and save it to the local download directory` + (typeof filename === 'string' ? ` as ${clip(filename, 80)}` : '') }
      }
      case 'context-options': {
        // Viewport, locale and time zone only change what the page sees of the window; a proxy changes where the traffic
        // goes and a user agent changes how the browser presents itself, so only those two are approved.
        const input = (args ?? {}) as { url?: unknown; proxyServer?: unknown; userAgent?: unknown }
        const changed = [
          ...typeof input.proxyServer === 'string' ? [`proxyServer=${clip(input.proxyServer, 80)} (all traffic of the new context goes through this proxy)`] : [],
          ...typeof input.userAgent === 'string' ? [`userAgent=${JSON.stringify(clip(input.userAgent, 80))} (the browser presents itself differently)`] : [],
        ]
        if (changed.length === 0) return { kind: 'allow' }
        if (mode === 'read-only') return { kind: 'deny', reason: `Changing the network egress or browser fingerprint is disabled by automationMode=${mode}: ${changed.join('; ')}` }
        if (mode === 'unrestricted') return { kind: 'allow' }
        return { kind: 'ask', reason: `${name} ${typeof input.url === 'string' ? clip(input.url, 120) : ''}: Open a new browser context with changed ` + changed.join('; ') }
      }
      case 'evaluate': {
        const expression = (args as { expression?: unknown })?.expression
        if (typeof expression !== 'string' || !expression.trim()) return { kind: 'deny', reason: `${name} requires a JavaScript expression` }
        if (expression.length > 20_000) return { kind: 'deny', reason: `${name} expression exceeds 20,000 characters` }
        if (mode === 'read-only') return { kind: 'deny', reason: `Page JavaScript execution is disabled by automationMode=${mode}` }
        if (mode === 'unrestricted') return { kind: 'allow' }
        return { kind: 'ask', reason: `${name} \`${clip(expression.replace(/\s+/g, ' '), 100)}\`: Run JavaScript with the current page origin and login state; it may access page storage, non-HttpOnly cookies, and browser-permitted network APIs` }
```

</details>

#### 缺口

- 未复现重定向与存储的实际可见范围
  **影响**：无法将 Profile 当成浏览器网络沙箱
  **进一步探讨**：用两个测试源检查 cookies、存储和请求记录

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时值得试用，怎样降低提交结果未知后的重复动作？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

面向已有支持版 DSH 与 Chrome、Edge 或可用 Chromium 的前端开发者，先开一页隔离测试应用完成只读检查。首次核对宿主、浏览器、Profile 和权限；持续成本是浏览器资源、模型调用、截图与状态文件，人工核对页面与环境。失败要从结构化错误判断是参数、过期 target、浏览器启动、权限或提交结果不明。走不了可靠路径时关闭会话，撤下临时登录状态，改用 DevTools 或原来的回归脚本。扩展可探索在高风险动作中保存本地操作指纹与服务端能复核的结果标记，复用已有 generation 和回执语义；在有测试幂等键的表单对照当前与新协议，记录重复提交和错误放弃的次数。若站点不提供可验证标记，或清楚的现行提示已能阻止重复提交，保留人工复查。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-25](https://github.com/anweat/dsh-browser/blob/4ac0883bc4bb64dfe6bccd0792daf016627b1cb6/README.md#L18-L25)

作者版本兼容范围

```text
## 兼容性

| 插件 | DSH | peer 范围 |
|---|---|---|
| `0.2.3`（当前） | `0.2.0-rc.2`、`0.2.1-rc.2` ~ `rc.5`、`0.2.2-rc.1` 起的 0.2.2 线（实测 0.2.0-rc.2、0.2.1-rc.3、0.2.1-rc.4、0.2.1-rc.5、0.2.2-rc.1；0.2.2 与 0.2.3 正式版靠 rc.1 的验证放行，尚未实测） | DSH 包 `>=0.2.0-rc.2 <0.2.1-0 \|\| >=0.2.1-rc.2 <0.2.2-0 \|\| >=0.2.2-rc.1 <0.2.3-0`；`@deepseek-ai/cordis` `~4.0.4 \|\| ~4.1.0` |
| `0.1.17`（0.1.7 线宿主固定用这一版） | `dsh-v0.1.7-rc.2` | 旧的 `browser_*` 工具体系 |

范围之外的宿主版本未经验证。历史版本、升级说明见 [CHANGELOG](https://github.com/anweat/dsh-browser/blob/master/CHANGELOG.md)；peer 范围为什么写成两段见 [docs/dev/host-compat.md](https://github.com/anweat/dsh-browser/blob/master/docs/dev/host-compat.md)。
```

**依据 2 · 作者声明**：[README.md:57-68](https://github.com/anweat/dsh-browser/blob/4ac0883bc4bb64dfe6bccd0792daf016627b1cb6/README.md#L57-L68)

浏览器与可选 OpenCLI 条件

<details>
<summary>查看原文（12行）</summary>

```text
## 第一次使用

1. **重启后找到设置卡片**：设置页的“插件”里，`@anweat/dsh-browser` 的配置卡片标题是“浏览器自动化”。顶部**状态摘要**直接说明运行环境：
   - 红色徽章“没有可用浏览器”：点“查看详情”有可照做的步骤；
   - “浏览器：系统 Chrome / Edge”：正常状态，什么都不用做；
   - “OpenCLI 未安装”：只是提示，不是警告。
2. **确认浏览器**：让模型调用 `browser_call({action:"runtime.status"})`（或看状态摘要），`browser.ready` 为 `true` 即可。
   - 有 Chrome / Edge：自动使用，不下载任何东西。Playwright 的 Chromium 一旦下载过就改用它；填了 `executablePath`，或把 `channel` 设为 `chrome` / `msedge`，则固定用你指定的那个，找不到就报错。
   - 都没有：装 Chrome 或 Edge；或让模型调用 `runtime.install`（下载约 190 MB，会询问审批）；或在设置里填 `executablePath`。完整选项见 [内核与依赖](https://github.com/anweat/dsh-browser/blob/master/docs/guide/runtime-and-dependencies.md)。
3. **可选依赖**：
   - **OpenCLI**：只有 `opencli.*` 动作和 Web Search Pro 的 `browser-opencli` 后端用到。`npm i -g @jackwener/opencli`，重启后调用 `opencli.status`。不装不影响其他功能，也不会让 `dsh plugin add` 失败。查找顺序与排障见 [登录态复用与 OpenCLI](https://github.com/anweat/dsh-browser/blob/master/docs/guide/login-and-opencli.md)。
   - **dsh-web-search-pro**：它在运行时读取本插件提供的 `browser` 服务来做页面快照、`playwright` 抓取和搜索页类平台，两者可独立安装；这些浏览器类能力需要本插件在场。
```

</details>

**依据 3 · 源码核查**：[src/actions/run.ts:188-211](https://github.com/anweat/dsh-browser/blob/4ac0883bc4bb64dfe6bccd0792daf016627b1cb6/src/actions/run.ts#L188-L211)

超时及取消状态

<details>
<summary>查看原文（24行）</summary>

```text
  if (ctx.signal.aborted) return failure(action.name, 'cancelled', { code: 'CANCELLED', message: 'cancelled before start', hint: hintFor('CANCELLED')! })

  const execute = async (): Promise<ActionEnvelope> => {
    let workSignal: AbortSignal = ctx.signal
    try {
      const outcome = await withDeadline(signal => { workSignal = signal; return action.execute(validation.value, { ...ctx, signal }) }, action.timeoutMs, ctx.signal, action.settleMs)
      if (outcome.timedOut) {
        // The work may still finish after the deadline, so a side-effecting action has an unknown outcome.
        const status: ExecutionStatus = traits.mutating ? 'outcome_unknown' : 'failed'
        return failure(action.name, status, {
          code: 'DEADLINE',
          message: `${action.name} did not finish within ${action.timeoutMs} ms`,
          hint: traits.mutating ? 'Outcome unknown: verify the page state with observe.read before retrying; do not blindly repeat a submit.' : hintFor('DEADLINE')!,
        })
      }
      // A result may carry its own outcome (a recipe that ran and failed still returns its whole report).
      const own = outcomeOf(outcome.value)
      const { result, truncation } = truncateResult(asResult(outcome.value))
      return { ok: own?.ok ?? true, action: action.name, executionStatus: own?.executionStatus ?? 'completed', result, ...own?.error ? { error: own.error } : {}, ...truncation ? { truncation } : {} }
    } catch (error) {
      const body = mapError(error, action.name, { signal: workSignal })
      // The deadline stopped work that had not returned: for a side-effecting action the outcome is unknown.
      if (abortedByDeadline(workSignal) && traits.mutating) return failure(action.name, 'outcome_unknown', { ...body, code: 'DEADLINE', hint: 'Outcome unknown: verify the page state with observe.read before retrying; do not blindly repeat a submit.' })
      return failure(action.name, body.code === 'CANCELLED' ? 'cancelled' : 'failed', body)
```

</details>

**依据 4 · 源码核查**：[src/actions/target.ts:62-65](https://github.com/anweat/dsh-browser/blob/4ac0883bc4bb64dfe6bccd0792daf016627b1cb6/src/actions/target.ts#L62-L65)

关闭会话页的入口

```text
  {
    name: 'target.close',
    group: 'target',
    summary: 'Close this session\'s pages and context (popups included); the next target.open starts fresh. Other sessions are untouched.',
```

#### 缺口

- 模型、浏览器资源与排障时间无同任务测量
  **影响**：不确定采用净收益
  **进一步探讨**：以完成同一页面取证及一条安全操作计量资源、人工和副作用

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
