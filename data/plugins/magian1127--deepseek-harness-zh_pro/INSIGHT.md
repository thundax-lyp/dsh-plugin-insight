# DeepSeek Harness 中文增强 Pro

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[54ef99c](https://github.com/magian1127/deepseek-harness-zh_pro/tree/54ef99c8a5bc0a220e75c4a846d658eec20fa9c3)

<!-- BEGIN META -->
[![GitHub ★ 36](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/magian1127/deepseek-harness-zh_pro) [![npm 30d 5,336](https://img.shields.io/static/v1?label=npm+30d&message=5%2C336&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepseek-harness-zh_pro) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepseek-harness-zh_pro)
<!-- END META -->

> **功能**：集中提供中文界面与请求设置、搜索回退、插件同步和会话清理。

> **亮点**：集中配置界面与模型语言，结合搜索回退和工作区管理。对照手工处理，减少在多个入口重复操作。见 [Q01](#research-q01)、[Q02](#research-q02)、[Q03](#research-q03)。

> **主要限制**：搜索可尝试多个后端。同步先删除再安装，会话删除与还原分别更新文件和宿主记录，需要核部分失败。见 [Q02](#research-q02)、[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 中文增强在哪些层生效？](#detail-section-11)
  - [Q02 · 搜索回退如何影响可靠性和数据去向？](#detail-section-12)
  - [Q03 · 插件同步可以覆盖哪些变化，怎样回滚？](#detail-section-13)
  - [Q04 · 会话移除、还原及监控有哪些边界？](#detail-section-14)
  - [Q05 · 怎样决定是否启用中文增强？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：偏好中文、需要经常调整 DSH 设置和管理本地会话的个人。见 [Q01](#research-q01)。

使用宿主原界面、手写中文指令、配置单个搜索后端，并用原生插件管理逐项处理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 界面和语言 | 设置中文与请求语言 | 注入需显式启用 |
| 搜索回退 | 按结果切换可用后端 | 相同查询可触达多个后端 |
| 插件同步 | 比较两个 profile 的安装清单 | 恢复受旧规格和失败形式限制 |
| 会话回收 | 移除或还原会话 | 文件与宿主引用可部分成功 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 和 Node | 是 | 加载宿主与客户端 | 核版本和发布产物 |
| 搜索后端和相应网络 | 搜索需要 | 请求与回退 | 无后端时无法搜索 |
| profile 和原生插件管理器 | 同步需要 | 读清单并应用 | 保留清单和旧规格 |
| 可支持的会话文件后端 | 会话清理需要 | 定位文件及还原 | 先核后端与路径 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 隔离 profile 比对宿主及插件版本 | 增强设置可见 |
| 中文对照 | 完成同一设置任务并核单条非敏感请求 | 界面和注入效果符合预期 |
| 单项验收 | 按需验证搜索、同步或回收 | 请求去向及失败状态可核 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 隔离 profile 与一条测试请求 | 核版本和影响范围 | 时间未测 |
| 持续 | 搜索请求与本机配置 | 宿主更新后的界面和接口检查 | 搜索费用未测 |
| 恢复 | 旧规格与会话副本 | 复核文件、记录及清单 | 恢复耗时未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 中文设置 | 客户端设置及独立提示词修改 | 中文覆盖及时间收益 |
| 多后端搜索 | 可用性、摘要条件和回退分支 | 质量、出网和费用 |
| 工作区管理 | 同步、回收、还原路径 | 部分失败后的一致性 |

同任务比较完成时间、错误数和恢复时间。

> **思考**：搜索可尝试多个后端。同步先删除再安装，会话删除与还原分别更新文件和宿主记录，需要核部分失败。见 [Q02](#research-q02)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：集中配置界面与模型语言，结合搜索回退和工作区管理。对照手工处理，减少在多个入口重复操作。见 [Q01](#research-q01)、[Q02](#research-q02)、[Q03](#research-q03)。

会话清理和还原分步改变文件与宿主记录。同步逐项执行，安装抛出异常时需要检查旧包是否仍在。

<a id="detail-section-5"></a>

### 1.4 主要限制

搜索可尝试多个后端。同步先删除再安装，会话删除与还原分别更新文件和宿主记录，需要核部分失败。见 [Q02](#research-q02)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察隔离 profile 的中文设置任务。搜索、同步或回收各自验证通过后再启用相应能力。见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持宿主与 UI 接入和所述分支。未验证运行、搜索质量、恢复或使用效率。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/lib/index.ts、src/lib/client/logic/register.ts、src/lib/chinese-prompt.ts、src/lib/web-search.ts、src/lib/plugin-sync.ts、src/lib/session-delete.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：查固定源码的宿主与客户端接入、提示词、搜索回退、插件同步和会话删除及还原。未执行代码、未访问真实搜索后端。
- 下一步：隔离 profile 先核仅界面设置，再核显式注入、搜索去向、同步失败和一次性会话还原。

**分析版本**

- **仓库**：[magian1127/deepseek-harness-zh_pro](https://github.com/magian1127/deepseek-harness-zh_pro)
- **版本号**：0.11.1（[固定提交 54ef99c](https://github.com/magian1127/deepseek-harness-zh_pro/tree/54ef99c8a5bc0a220e75c4a846d658eec20fa9c3)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在各执行点显示设置影响的界面、模型输入、第三方请求或文件，检验误启用和恢复时间是否下降。见 [Q05](#research-q05)。

隔离 profile 先核仅界面设置，再核显式注入、搜索去向、同步失败和一次性会话还原。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 3767 | — | — | 68892 |
| .mts | source | 13 | 3716 | 3087 | 500 | — |
| .ts | source | 47 | 21366 | 16004 | 4706 | — |
| .cts | source | 2 | 3868 | 3180 | 590 | — |
| .cjs | source | 1 | 1368 | 1188 | 224 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/magian1127/deepseek-harness-zh_pro/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/magian1127/deepseek-harness-zh_pro/issues?q=is%3Aissue+created%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/magian1127/deepseek-harness-zh_pro/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：中文增强如何改变 DSH 的界面、模型输入和工作区操作，哪些能力适合隔离试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 中文增强在哪些层生效？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

偏好中文界面的个人可在 DSH 设置中调整，减少读默认界面和反复写中文要求的工作。宿主挂载模型与上下文语言设置和提示词重写，客户端注册增强设置。提示词规则每次组装重读，先移除旧段，再按启用和插入位置决定写入系统段。未解析的插值会关闭插值标记。首条用户消息注入有独立判断，遇拒绝、取消或已经处理会跳过，空内容可延后。对照宿主默认界面和手写指令，贡献是集中配置两处入口。开启模型提示词能力会改变请求内容。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/index.ts:229-273](https://github.com/magian1127/deepseek-harness-zh_pro/blob/54ef99c8a5bc0a220e75c4a846d658eec20fa9c3/src/lib/index.ts#L229-L273)

宿主安装与搜索、会话等增强。

<details>
<summary>查看原文（45行）</summary>

```text
  void migrateFromHotRow(ctx)
  // 「智能搜索」会话开关（输入框下方按钮，默认开）：必须先于工具壳装配，
  // 壳的装壳判定要读它；关闭的会话由它在 agent.ctx 上 restrict 掉
  // web_search / web_fetch，官方 tool:web_* 说明段随之求值为空、不再注入。
  if (ownsPromptRegistration(ctx)) {
    searchToggleHandle = installSessionSearchToggle(ctx, {
      onChange: () => agentSearchToolHandle?.refresh(),
    })
  }
  // 「web_search 工具壳」：agent 作用域补壳（探测让位），与中文优先提示
  // 装配同门槛避免双实例重复注册；须先于 installChinesePrompt 装配（其
  // volatile 变更经 onModelStateChanged 回调收敛壳状态）。
  if (ownsPromptRegistration(ctx)) {
    agentSearchToolHandle = installAgentSearchTool(ctx, {
      isEnabled: () => getModelState().zhWebSearch,
      useZh: () => getModelState().zhPrompt,
      perQuery: () => getModelState().zhSearchPerQuery,
      isAgentEnabled: (agentLike) =>
        searchToggleHandle === undefined || searchToggleHandle.isAgentEnabled(agentLike),
    }) ?? undefined
  }
  if (ownsPromptRegistration(ctx)) installChinesePrompt(ctx, config, {
    onModelStateChanged: () => agentSearchToolHandle?.refresh(),
  })
  if (ownsPromptRegistration(ctx)) installModelLocale(ctx)
  if (ownsPromptRegistration(ctx)) installContextLocale(ctx)
  installSelfHotReload(ctx)
  // 挂载前逐出（主通道）：Loader 在 `new Entry()` 里同步 emit
  // 'loader/entry-init'，之后才 await import 入口。监听它并在此刻清掉本包
  // 模块缓存，行重建（set_plugin 往返 / patch reload）就能真正换血。
  // 这是「不重启即生效」的关键；首次引入本能力仍需重启一次让这段代码进进程。
  installPreMountCacheEviction(ctx)
  // 兜底通道：Fiber dispose 时也逐出一次（覆盖非行重建的退出路径）。
  installUnloadCacheEviction(ctx)
  // 「删除会话（回收站）」：与 settings 注册同门槛，避免热迁移窗口双实例
  // 重复注册路由；服务未就绪时由内部重试等待（见 session-delete.js）。
  if (ownsPromptRegistration(ctx)) installSessionDeleteRoute(ctx, () => resolveSessionDeleteDeps(ctx))
  // 「网络搜索」：注册 dsh-zh-web 组合 provider（按 zhSearchOrder 优先级依次尝试）。
  // 与 settings 注册同门槛避免双实例重复注册；web 服务晚于本插件就绪时由
  // internal/service 事件重试（与 session-delete 同款模式）。开关状态与优先级
  // 都经 getModelState() 读取（dsh-zh 命名空间，volatile 实时生效）。
  if (ownsPromptRegistration(ctx)) installWebSearchRetry(ctx)
  // 「网页读取」：注册 dsh-zh-web-fetch 组合 provider（按 zhFetchOrder 优先级
  // 依次尝试，内置免 Key 环为其中一项）。与搜索装配同门槛、同重试模式。
  if (ownsPromptRegistration(ctx)) installWebFetchRetry(ctx)
```

</details>

**依据 2 · 源码核查**：[src/lib/client/logic/register.ts:12-22](https://github.com/magian1127/deepseek-harness-zh_pro/blob/54ef99c8a5bc0a220e75c4a846d658eec20fa9c3/src/lib/client/logic/register.ts#L12-L22)

客户端设置注册。

<details>
<summary>查看原文（11行）</summary>

```text
    ctx.slots.inject('settings.section', function () {
      return ctx.slots.register({
        name: 'settings.section',
        id: 'dsh-zh-enhance',
        order: 50,
        label: function () { return t('nav') },
        locale: SETTINGS_NS,
      }, function () {
        return React.createElement(ZhSettingsSection, { t: t })
      })
    })
```

</details>

**依据 3 · 源码核查**：[src/lib/chinese-prompt.ts:455-484](https://github.com/magian1127/deepseek-harness-zh_pro/blob/54ef99c8a5bc0a220e75c4a846d658eec20fa9c3/src/lib/chinese-prompt.ts#L455-L484)

读配置和改写系统段。

<details>
<summary>查看原文（30行）</summary>

```text
    const syncAssemblySection = function (assembly) {
      if (assembly === null || typeof assembly !== 'object' || !Array.isArray(assembly.sections)) return
      // 每次组装前先按**当前**配置重同步一次。不能只靠 loader/volatile-update：
      // 实测该事件在设置页保存后并不会送达本插件（诊断 volatileCount 恒为 0），
      // 只依赖它就会让 state 永远停在 apply 时的值——用户改的设置要等下次
      // 重启/重载才生效，表现就是「新会话注入的总是上一版」。
      refreshFromLiveConfig()
      // 每次同步都先摘掉旧段、再按当前排序位置重新插入：用户改了位置、或
      // 其它改写器调整过段落顺序时，原地替换索引会留下错位。
      const existing = assembly.sections.findIndex(function (section) { return section?.name === ZH_PROMPT_SECTION_NAME })
      if (existing >= 0) assembly.sections.splice(existing, 1)
      if (state.enabled !== true || state.text === '' || state.target !== ZH_PROMPT_TARGET_SYSTEM) return
      const unsafe = wouldFailInterpolation(state.text, assembly?.variables)
      const section: { name: string; text: string; interpolate?: boolean } = { name: ZH_PROMPT_SECTION_NAME, text: state.text }
      if (unsafe) section.interpolate = false
      assembly.sections.splice(resolveInsertIndex(assembly.sections, state.order, systemPrompt), 0, section)
    }
    // 官方 complete persona 会在 SystemPrompt.assemble 返回前把其它 section
    // 全部丢弃。这里在共享 assemble 管线上注册改写器：在官方组装返回之后、
    // agent-loop 使用之前，把提示同步进最终 assembly —— 首次模型调用就会带上，
    // 且任何 preset 都无法在后续 waterfall 中把它移除。
    let assemblyWarningShown = false
    ctx.effect(function () {
      return registerAssembleRewriter(function (assembly) {
        try {
          syncAssemblySection(assembly)
        } catch (error) {
          if (!assemblyWarningShown) {
            assemblyWarningShown = true
            warn(`同步初始系统提示失败，本次请求将沿用原 system prompt: ${error instanceof Error ? error.message : String(error)}`)
```

</details>

**依据 4 · 源码核查**：[src/lib/chinese-prompt.ts:497-523](https://github.com/magian1127/deepseek-harness-zh_pro/blob/54ef99c8a5bc0a220e75c4a846d658eec20fa9c3/src/lib/chinese-prompt.ts#L497-L523)

用户消息注入与条件。

<details>
<summary>查看原文（27行）</summary>

```text
    ctx.on('agent/pre-step', async function ({ agent, messages, step, signal }, next) {
      const decision = await next()
      if (signal !== undefined && typeof signal.throwIfAborted === 'function') signal.throwIfAborted()
      const desired = makePromptMessage()
      if (desired === null || decision.kind === 'reject') return decision
      // 已出现在本步消息或会话可见表面中时不重复插入。
      if (decision.messages.some(function (message) { return isOwnMessage(message) && samePrompt(message, desired) })) return decision
      const surface = agent?.session?.surface
      if (Array.isArray(surface?.nodes) && Array.isArray(agent.session.events)) {
        if (surface.nodes.some(function (seq) {
          const event = agent.session.events[seq]
          return event?.type === 'user/message' && isOwnMessage(event.data) && samePrompt(event.data, desired)
        })) return decision
      }
      if (step === 1 && decision.messages.length === 0) {
        // 首步没有可插入的模型输入（例如被其它监听器拒绝）：放进 next-step
        // inbox，下一步 claim 时自然带上；API 形状与 agent-instructions 一致。
        try {
          if (typeof agent?.inbox?.prepend === 'function') agent.inbox.prepend('next-step', desired)
        } catch {}
        return decision
      }
      const lastClaimedIndex = decision.messages.findLastIndex(function (message) { return messages.includes(message) })
      return {
        kind: 'enter',
        messages: decision.messages.toSpliced(lastClaimedIndex + 1, 0, desired),
      }
```

</details>

**依据 5 · 作者声明**：[README.md:191-194](https://github.com/magian1127/deepseek-harness-zh_pro/blob/54ef99c8a5bc0a220e75c4a846d658eec20fa9c3/README.md#L191-L194)

作者区分界面与请求设置、搜索出网。

```text
| Tavily 官方 API 密钥（可选，启用后搜索优先走 Tavily） | DSH 凭据：`${DSH_HOME:-~/.dsh}/.credentials.yaml` 的 `refs:` 段键 `TAVILY_API_KEY`，或同名环境变量（插件每次调用现查，不缓存）；也可直接在设置页「网络搜索」卡片里填写/清除（写同一位置，界面只回脱敏提示） |

插件不上传数据；模型工具注册仅限网络搜索的 `web_search` 工具壳（随开关装卸，见功能表）。除网络搜索与用户显式开启的提示词注入、代理角色提示中文化、工具说明中文化与上下文注入中文化外，其余功能不会修改模型请求；上下文注入中文化替换注入会话历史的官方英文文本，关闭后新注入恢复英文，已写入会话的部分按官方行为保留。
网络搜索开启时，搜索查询会发送到所选后端；接管后端选择时本插件还会把 `web` 行的 `searchProvider` 写成 `dsh-zh-web`（经官方 settings 通道，持久化在 profile patch 里），关闭开关或卸载时还原接管前的值。查询按优先级列表逐个尝试：未安装或不可用的后端直接跳过，失败的后端记降级诊断后继续下一个，因此一次查询最多触达列表里靠前的若干个后端。智谱插件在场且可用时发往智谱（由智谱插件处理），配了凭据 `TAVILY_API_KEY` 时发往 Tavily 官方 API（密钥只进 `Authorization` 请求头），否则发往公开的 DuckDuckGo/Yandex/Bing/Wikipedia 端点；本插件不存储查询与结果，也不把密钥写入配置、日志或诊断快照。
```

#### 缺口

- 未对照真实会话的界面覆盖和模型上下文。
  **影响**：不能确认所有界面译文和不同模型响应。
  **进一步探讨**：用固定非敏感对话比较仅开界面与显式开启注入两种设置。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 搜索回退如何影响可靠性和数据去向？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

宿主设置会话搜索开关及工具 gate。Web 搜索实际注册到宿主搜索服务，按启用状态和后端顺序判断能否工作，先尝试免费组合，再跳过缺失或不可用的配置项，按结果和摘要质量判定是否继续。请求中止、全空、无摘要和错误有不同结果。相对单一搜索入口，可能用多个实现返回摘要，但相同查询可能触达多个配置后端，需要按实际日志核去向。摘要质量门槛不能证明事实正确。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/index.ts:230-247](https://github.com/magian1127/deepseek-harness-zh_pro/blob/54ef99c8a5bc0a220e75c4a846d658eec20fa9c3/src/lib/index.ts#L230-L247)

会话级开关及工具包装。

<details>
<summary>查看原文（18行）</summary>

```text
  // 「智能搜索」会话开关（输入框下方按钮，默认开）：必须先于工具壳装配，
  // 壳的装壳判定要读它；关闭的会话由它在 agent.ctx 上 restrict 掉
  // web_search / web_fetch，官方 tool:web_* 说明段随之求值为空、不再注入。
  if (ownsPromptRegistration(ctx)) {
    searchToggleHandle = installSessionSearchToggle(ctx, {
      onChange: () => agentSearchToolHandle?.refresh(),
    })
  }
  // 「web_search 工具壳」：agent 作用域补壳（探测让位），与中文优先提示
  // 装配同门槛避免双实例重复注册；须先于 installChinesePrompt 装配（其
  // volatile 变更经 onModelStateChanged 回调收敛壳状态）。
  if (ownsPromptRegistration(ctx)) {
    agentSearchToolHandle = installAgentSearchTool(ctx, {
      isEnabled: () => getModelState().zhWebSearch,
      useZh: () => getModelState().zhPrompt,
      perQuery: () => getModelState().zhSearchPerQuery,
      isAgentEnabled: (agentLike) =>
        searchToggleHandle === undefined || searchToggleHandle.isAgentEnabled(agentLike),
```

</details>

**依据 2 · 源码核查**：[src/lib/web-search.ts:1680-1735](https://github.com/magian1127/deepseek-harness-zh_pro/blob/54ef99c8a5bc0a220e75c4a846d658eec20fa9c3/src/lib/web-search.ts#L1680-L1735)

可用判定与免费组合。

<details>
<summary>查看原文（56行）</summary>

```text
export function installWebSearchProvider(ctx: HostContext, deps: WebSearchInstallDeps): (() => void) | undefined {
  const web = ctx.get('web') as WebServiceLike | undefined | null
  if (web === undefined || web === null || typeof web.registerSearchProvider !== 'function') {
    const webKind = web === undefined ? 'undefined' : web === null ? 'null' : typeof web
    const hasRegister = typeof (web as { registerSearchProvider?: unknown } | null)?.registerSearchProvider
    writeSelectionState({
      at: new Date().toISOString(), target: ZH_WEB_SEARCH_PROVIDER_ID, before: null,
      channel: 'none', outcome: 'error',
      error: `web 服务不可用（web=${webKind}，registerSearchProvider=${hasRegister}）`.slice(0, 300),
    })
    return undefined
  }

  /** 等待 provider 出现在注册表期间挂起的重试定时器（卸载时一并清理）。 */
  const pendingTimers = new Set<ReturnType<typeof setTimeout>>()

  let fallbackNotified = false
  const provider: WebSearchProviderLike = {
    id: ZH_WEB_SEARCH_PROVIDER_ID,
    available(): boolean {
      return deps.isEnabled() && deps.searchOrder().length > 0
    },
    async search(request: WebSearchRequestLike, signal?: AbortSignal): Promise<WebSearchResultLike> {
      const query = String(request.query ?? '').trim()
      if (query.length === 0) throw new ZhWebError('[WEB_PROVIDER_UNUSABLE] query must be a non-empty string')

      const cap = typeof request.maxResults === 'number' && request.maxResults > 0 ? request.maxResults : undefined
      const capResult = (result: WebSearchResultLike): WebSearchResultLike => {
        if (cap === undefined || result.sources.length <= cap) return result
        return { ...result, sources: result.sources.slice(0, cap), truncated: false }
      }

      // 结果带简介但不达标时的回落候选：保证闸门绝不比不加闸门更差
      //（宁可给回无简介结果，也不给空结果或报错）。
      let snippetPoorFallback: WebSearchResultLike | undefined
      const order = deps.searchOrder()
      let lastError: unknown

      for (const backendId of order) {
        if (wasAborted(signal)) throw signal?.reason ?? new ZhWebError('[WEB_ABORTED] aborted')

        // 1) 本插件内置的免 Key 多引擎后端（占位 id，不是真实注册的 provider）。
        if (backendId === ZH_FREE_MULTI_BACKEND_ID) {
          try {
            const sources = await freeSearch(ctx, query, cap, signal)
            if (sources.length > 0) {
              const capped = cap !== undefined && sources.length > cap ? sources.slice(0, cap) : sources
              return { sources: capped, truncated: false }
            }
            // 免费后端无结果：若有更前面的无简介结果，继续尝试后续后端。
          } catch (error: unknown) {
            if (wasAborted(signal) || !isDowngradable(error)) throw error
            lastError = error
          }
          continue
        }
```

</details>

**依据 3 · 源码核查**：[src/lib/web-search.ts:1737-1772](https://github.com/magian1127/deepseek-harness-zh_pro/blob/54ef99c8a5bc0a220e75c4a846d658eec20fa9c3/src/lib/web-search.ts#L1737-L1772)

顺序回退、空结果和宿主注册。

<details>
<summary>查看原文（36行）</summary>

```text
        // 2) 已注册的官方/第三方 provider。
        const backend = providerById(web, backendId)
        if (backend === undefined) continue          // 未注册：静默跳过
        if (!backend.available()) continue           // 不可用：跳过，不发无用请求

        try {
          const result = await backend.search(request, signal)
          if (hasUsableSnippets(result.sources)) return result
          // 成功但整批缺简介（典型：DeepSeek Messages 搜索的正文加密）→
          // 记为回落候选，继续尝试后面的后端。
          snippetPoorFallback = result
          recordWebSearchSnippetFallback(query, result.sources.length)
          log(`后端 ${backendId} 的 ${String(result.sources.length)} 条结果均无简介，继续按优先级尝试下一个`)
        } catch (error: unknown) {
          if (wasAborted(signal) || !isDowngradable(error)) throw error
          recordWebSearchFallback(error, query)
          lastError = error
          if (!fallbackNotified) {
            fallbackNotified = true
            log(`后端 ${backendId} 搜索失败（${(error as { code?: unknown })?.code ?? 'error'}），已按优先级继续下一个`)
          }
        }
      }

      // 全部后端都失败/无摘要：有回落候选就给它，否则抛最后一个错误。
      if (snippetPoorFallback !== undefined) {
        log(`全部后端均无可用结果，回落到无简介结果（${String(snippetPoorFallback.sources.length)} 条）`)
        return capResult(snippetPoorFallback)
      }
      if (lastError !== undefined) throw lastError
      return { sources: [], truncated: false }
    },
  }

  try {
    const dispose = web.registerSearchProvider(provider)
```

</details>

#### 缺口

- 未观察真实调用后端、限流、费用或搜索质量。
  **影响**：无法判断可靠性改善和实际出网范围。
  **进一步探讨**：用无敏感词的同一查询比单后端和回退模式的请求数、去向及结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 插件同步可以覆盖哪些变化，怎样回滚？

**研究主题**：工程质量与复用、缺陷与关键质疑、贡献与相对优势

#### 完整回答

插件同步读取两份 profile 清单，计算安装、启用和升级。已识别为较旧的语义版本会跳过。不可比较且不同的规格仍可触发升级，作者所述的版本保护应限定于可比较的情形。GET 取计划，POST 重新计算后逐项调用原生管理器。升级先移除当前插件再安装，只有安装返回失败且保存了可用旧规格时才尝试恢复。安装抛出异常的路径由外层逐项捕获，已观察到的路径不会自动恢复旧包。状态会汇总失败和重启需要。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:122-126](https://github.com/magian1127/deepseek-harness-zh_pro/blob/54ef99c8a5bc0a220e75c4a846d658eec20fa9c3/README.md#L122-L126)

作者说明同步和回滚。

```text
**在桌面版与 Web 之间同步插件**：两个 profile 各自装过的插件不必逐个重装——在**要补齐的那一侧**
打开 **设置 → 增强设置 → 插件同步**，点「检查差异」看清单、再点「一键同步」即可。方向随当前环境
自动确定：在网页端运行就是「桌面版 → 网页端」，在桌面版运行就是「网页端 → 桌面版」；同名包只取
版本号更高的一侧，当前版本已经不低于参考时保持不动（绝不降级），只增不减。该功能复用 DSH 官方插件
管理器，因此与在桌面应用侧栏「插件」页手动安装等效，并且自带 peer 兼容检查与失败回滚。
```

**依据 2 · 源码核查**：[src/lib/plugin-sync.ts:264-301](https://github.com/magian1127/deepseek-harness-zh_pro/blob/54ef99c8a5bc0a220e75c4a846d658eec20fa9c3/src/lib/plugin-sync.ts#L264-L301)

计划计算与版本比较。

<details>
<summary>查看原文（38行）</summary>

```text
  const from = readProfileManifest(resolved)
  const to = readProfileManifest(target)
  if (from === null) return empty(`读不到 ${resolved} 的 package.json`, resolved)
  if (to === null) return empty(`读不到 ${target} 的 package.json`, resolved)

  const fromDeps = from.dependencies ?? {}
  const toDeps = to.dependencies ?? {}
  const fromBundles = new Set(from.dsh?.profile?.bundles ?? [])
  const toBundles = new Set(to.dsh?.profile?.bundles ?? [])

  const entries: SyncEntry[] = []
  const current: string[] = []
  const skipped: SyncSkippedEntry[] = []
  for (const name of Object.keys(fromDeps).sort()) {
    const recorded = fromDeps[name] ?? ''
    const existing = toDeps[name]
    const bundle = fromBundles.has(name)
    if (existing === undefined) {
      entries.push({ name, spec: specFor(name, recorded), requested: recorded, current: null, action: 'install', bundle })
      continue
    }
    // 同号等价（含 `^4.0.0` 与 `4.0.0` 这类写法差异）→ 不比版本高低，只看 bundle 选择。
    const order = compareRecorded(recorded, existing)
    if (order !== null && order < 0) {
      skipped.push({ name, requested: recorded, current: existing })
      continue
    }
    if (order !== 0 && existing !== recorded) {
      entries.push({ name, spec: specFor(name, recorded), requested: recorded, current: existing, action: 'upgrade', bundle })
      continue
    }
    if (bundle && !toBundles.has(name)) {
      entries.push({ name, spec: '', requested: recorded, current: existing, action: 'enable', bundle })
      continue
    }
    current.push(name)
  }
  return { source: resolved, target, available: true, reason: null, entries, current, skipped }
```

</details>

**依据 3 · 源码核查**：[src/lib/plugin-sync.ts:389-428](https://github.com/magian1127/deepseek-harness-zh_pro/blob/54ef99c8a5bc0a220e75c4a846d658eec20fa9c3/src/lib/plugin-sync.ts#L389-L428)

先移除再安装及条件回滚。

<details>
<summary>查看原文（40行）</summary>

```text
  manager: { removeBundle(name: string): Promise<unknown>; installBundle(spec: string, options?: unknown): Promise<unknown> },
  entry: SyncEntry,
  approvals: string[],
): Promise<{ record: Record<string, unknown>; note: string | null }> {
  const installOptions = approvals.length === 0 ? {} : { approvedBuilds: approvals }
  // 能力探测：removeBundle 是官方 pluginManager 的服务面方法，但更老的运行时没有它。
  // 此时直接说明「无法升级」比抛 "is not a function" 更诚实，也绝不退化成单步
  // installBundle——那必然再次撞上 already-installed。
  if (typeof manager.removeBundle !== 'function') {
    return {
      record: { application: 'failed', error: { code: 'unsupported', diagnostic: '当前运行时的 pluginManager 不提供 removeBundle，无法先卸载旧版本再升级' } },
      note: null,
    }
  }
  const removed = (await manager.removeBundle(entry.name) ?? {}) as Record<string, unknown>
  // 卸载失败时旧版本还在，原样上报：本次没有任何东西被丢弃。
  if (removed.error !== undefined && removed.error !== null) {
    return { record: removed, note: '卸载旧版本失败，当前版本未被改动' }
  }
  const installed = (await manager.installBundle(entry.spec, installOptions) ?? {}) as Record<string, unknown>
  // 成功，或失败但未抛错却不该回滚（例如 cancelled）：交给调用方按落点判断。
  if (isApplied(installed) || installed.application === 'restart-required') {
    return { record: installed, note: null }
  }
  const previous = entry.current === null || entry.current === '' ? null : specFor(entry.name, entry.current)
  if (previous === null) {
    return { record: installed, note: `新版本未生效，且没有可回滚的旧版本记录，请手动重装 ${entry.name}` }
  }
  let restored: Record<string, unknown> | null = null
  try {
    restored = (await manager.installBundle(previous, {}) ?? {}) as Record<string, unknown>
  } catch {
    restored = null
  }
  return {
    record: installed,
    note: restored !== null && isApplied(restored)
      ? `新版本未生效，已回滚到 ${entry.current}`
      : `新版本未生效且回滚失败，请手动重装 ${previous}`,
  }
```

</details>

**依据 4 · 源码核查**：[src/lib/plugin-sync.ts:442-501](https://github.com/magian1127/deepseek-harness-zh_pro/blob/54ef99c8a5bc0a220e75c4a846d658eec20fa9c3/src/lib/plugin-sync.ts#L442-L501)

逐项执行和异常处理。

<details>
<summary>查看原文（60行）</summary>

```text
  plan: SyncPlan,
  options: { only?: unknown; approvedBuilds?: unknown } = {},
): Promise<SyncRunResult> {
  const base: SyncRunResult = {
    ok: false, reason: null, source: plan.source, target: plan.target, results: [], complete: false,
  }
  if (!plan.available) return { ...base, reason: plan.reason }
  const manager = ctx.get('pluginManager')
  if (manager === undefined || manager === null) {
    return { ...base, reason: '当前运行时没有 pluginManager 服务，无法同步' }
  }
  const only = typeof options.only === 'string' && options.only !== '' ? options.only : null
  const approvals = Array.isArray(options.approvedBuilds)
    ? options.approvedBuilds.filter((item): item is string => typeof item === 'string' && item !== '')
    : []
  const entries = only === null ? plan.entries : plan.entries.filter((entry) => entry.name === only)
  if (entries.length === 0) {
    return { ...base, ok: true, reason: only === null ? '没有待同步的插件' : `没有待同步的条目：${only}`, complete: true }
  }

  const results: SyncItemResult[] = []
  for (const entry of entries) {
    const row: SyncItemResult = {
      name: entry.name, action: entry.action, ok: false,
      application: null, code: null, message: null, pendingBuilds: [],
    }
    try {
      // upgrade 必须「先卸载再安装」：官方 installBundle 遇到已存在的同名依赖会在
      // pnpm 启动前就拒绝（already-installed）。enable 只调整 bundle 选择，install
      // 是全新包名，两者仍是一次调用。
      const upgrade = entry.action === 'upgrade' ? await upgradeInstalled(manager, entry, approvals) : null
      const record = upgrade !== null
        ? upgrade.record
        : entry.action === 'enable'
          ? ((await manager.setBundleEnabled(entry.name, true) ?? {}) as Record<string, unknown>)
          : ((await manager.installBundle(
            entry.spec,
            approvals.length === 0 ? {} : { approvedBuilds: approvals },
          ) ?? {}) as Record<string, unknown>)
      row.application = typeof record.application === 'string' ? record.application : null
      row.ok = isApplied(record)
      const error = record.error
      if (error !== undefined && error !== null) {
        const described = describeError(error)
        row.code = described.code
        row.message = described.message
      }
      // 回滚说明优先：它才是用户最需要知道的结果（旧版本是否还在）。
      if (upgrade !== null && upgrade.note !== null) row.message = upgrade.note
      if (Array.isArray(record.pendingBuilds)) {
        row.pendingBuilds = record.pendingBuilds.filter((item): item is string => typeof item === 'string')
      }
      log(`插件同步：${entry.name} → ${String(row.application)}`)
    } catch (error) {
      const described = describeError(error)
      row.code = described.code
      row.message = described.message ?? (error instanceof Error ? error.message : String(error))
      warn(`插件同步失败：${entry.name} — ${row.message}`)
    }
    results.push(row)
```

</details>

**依据 5 · 源码核查**：[src/lib/plugin-sync.ts:512-533](https://github.com/magian1127/deepseek-harness-zh_pro/blob/54ef99c8a5bc0a220e75c4a846d658eec20fa9c3/src/lib/plugin-sync.ts#L512-L533)

计划和执行入口。

<details>
<summary>查看原文（22行）</summary>

```text
export async function handlePluginSyncRoute(
  req: RouteRequest,
  res: RouteResponse,
  pathname: string,
  payload: Record<string, unknown> | null,
  ctx: HostContext,
): Promise<boolean> {
  if (pathname !== PLUGIN_SYNC_PATH) return false

  if (req.method === 'GET') {
    writeJson(res, 200, { ok: true, value: planPluginSync(payload?.source) })
    return true
  }

  const body = payload ?? {}
  const plan = planPluginSync(body.source)
  if (!plan.available) {
    writeJson(res, 200, { ok: true, value: { ...plan, results: [], complete: true } })
    return true
  }
  const run = await runPluginSync(ctx, plan, { only: body.only, approvedBuilds: body.approvedBuilds })
  writeJson(res, 200, { ok: true, value: { ...plan, ...run } })
```

</details>

#### 缺口

- 未在隔离 profile 复现安装失败、抛出或并发修改。
  **影响**：不能据源码保证工作配置恢复。
  **进一步探讨**：固定清单和旧规格，分别制造返回失败与抛出，核插件与清单的最终状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 会话移除、还原及监控有哪些边界？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

会话清理拒绝正在运行的会话，等待闲置状态时可超时或异常继续。路径解析区分可支持的后端并专门处理活动会话元数据。删除路径先移至回收目录或直接移除，再尝试解除宿主引用，解除引用可失败而不阻止结果返回。可还原记录来自回收分支。还原先移回目录，再恢复工作区和归档状态，部分成功时保留记录。服务监控快照由页面驱动，入口注释和实现保留清单监听，不能按页面功能推出常驻采集。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/session-delete.ts:504-569](https://github.com/magian1127/deepseek-harness-zh_pro/blob/54ef99c8a5bc0a220e75c4a846d658eec20fa9c3/src/lib/session-delete.ts#L504-L569)

运行检查、等待和位置解析。

<details>
<summary>查看原文（66行）</summary>

```text
export async function deleteSession(
  deps: DeleteDeps,
  sessionId: string,
  options: { trash: boolean; title?: string; currentSessionId?: string },
): Promise<{ ok: true; trashed: boolean; hint?: string } | { ok: false; code: string; message: string }> {
  // 0) 活跃会话检查：只有「正在运行」才拒绝——运行中的 agent 一边写日志
  //    一边移动文件不安全。已打开但空闲（idle）的会话允许删除（包括
  //    当前正在查看的会话：客户端删除成功后会自动跳转到新会话页面）：
  //    先取消待处理消息并等待收敛（日志写盘完全由 session/event 驱动，
  //    空闲会话不会落盘，移走文件不会复活）。删除后内存中该 agent 仍
  //    驻留（上游没有按 id 卸载 live agent 的公开 API），删除流程会把它
  //    归档隐藏，保证从列表消失。
  const agent = deps.agents?.get(sessionId) as
    | { status?: string; cancel?: (cause: unknown, options?: unknown) => void; whenIdle?: () => Promise<unknown> }
    | undefined
  if (agent !== undefined && agent !== null && agent.status === 'running') {
    return { ok: false, code: 'session-busy', message: '该会话正在运行，请先停止或等待其结束。' }
  }
  // 已打开但空闲：取消待处理消息并等待归位，防止删除瞬间有写入在途。
  if (agent !== undefined && agent !== null) {
    try {
      if (typeof agent.cancel === 'function') {
        agent.cancel({ kind: 'hook', reason: 'dsh-zh 删除会话（移入回收站）' })
      }
      if (typeof agent.whenIdle === 'function') {
        await Promise.race([
          agent.whenIdle(),
          new Promise(resolve => setTimeout(resolve, IDLE_CONVERGE_TIMEOUT_MS)),
        ])
      }
    } catch {
      // 收敛失败不阻塞删除：日志写盘只在有事件时发生，空闲会话无写入。
    }
  }

  // 1) 定位物理目录。定位失败（服务面拿不到 header / 目录扫描无结果）时
  //    直接中止：绝不退化为「假删除」——先 detach 账本会把已删除的会话
  //    丢进官方「未分组」桶而日志仍在原地（2026-09-07 DSH 0.1.3-alpha.1
  //    实测定界：sessionPersistence 公开面句柄化后 locate/readRaw 消失）。
  const target = await resolveSessionTarget(deps, sessionId)
  if (target === null || target.dir === null || target.kind === null
    || !CONFIRMED_JSONL_KINDS.has(target.kind)) {
    // 幂等完成：会话仍驻留内存而日志目录已不在磁盘 = 此前删除已把日志
    // 移入回收站（或日志从未落盘），本次属重复删除。重新确保官方归档集合
    // 隐藏（可能被「取消归档」解除过）并记入已删除集合，返回成功——中止
    // 会留下「查看得到却删不掉」的僵尸行（2026-09-25 hihi1 实测）。
    const liveStill = deps.sessions?.get(sessionId)
    if (liveStill !== undefined && liveStill !== null) {
      const registryForHide = deps.workspaceRegistry
      if (registryForHide !== undefined && typeof registryForHide.archiveSession === 'function') {
        try {
          await registryForHide.archiveSession(sessionId)
        } catch (error) {
          warnRouteFailure(`重新归档已删除的驻留会话 ${sessionId} 失败`, error)
        }
      }
      deletedSessionIds.add(sessionId)
      return { ok: true, trashed: false, hint: '会话日志已在此前删除，已将其从会话列表隐藏。' }
    }
    if (target === null) {
      warnRouteFailure(`删除会话 ${sessionId} 中止：无法定位会话日志目录`, new Error('not-located'))
      return {
        ok: false,
        code: 'locate-failed',
        message: '无法定位会话日志目录，已中止删除（未改动任何数据）。',
      }
```

</details>

**依据 2 · 源码核查**：[src/lib/session-delete.ts:578-627](https://github.com/magian1127/deepseek-harness-zh_pro/blob/54ef99c8a5bc0a220e75c4a846d658eec20fa9c3/src/lib/session-delete.ts#L578-L627)

回收或删除及引用清理。

<details>
<summary>查看原文（50行）</summary>

```text
  const cwd = target.header.cwd ?? ''
  const title = options.title !== undefined && options.title !== '' ? options.title : sessionId

  let trashLocation = ''
  let dirRemoved = false
  try {
    if (options.trash) {
      const result = await trashItem(target.dir)
      trashLocation = result.location
    } else {
      await rm(target.dir, { recursive: true, force: true })
      trashLocation = target.dir
    }
    dirRemoved = true
  } catch (error) {
    warnRouteFailure(`删除会话 ${sessionId} 的物理目录失败`, error)
    return {
      ok: false,
      code: 'trash-failed',
      message: '移入回收站失败，请稍后重试。',
    }
  }

  // 3) 工作区账本：移除该会话的槽位（「不保留恢复位」）。
  const registry = deps.workspaceRegistry
  if (registry !== undefined) {
    try {
      const workspaces = registry.list()
      for (const workspace of workspaces) {
        if (workspace.sessionIds.includes(sessionId)) {
          await workspace.detachSession(sessionId)
        }
      }
    } catch (error) {
      warnRouteFailure(`移除会话 ${sessionId} 的工作区账本槽位失败`, error)
      // 不视为致命：日志已移走，账本残项在列表渲染时被过滤（byId 缺失）。
    }
  }

  // 4) 清单登记（仅回收站路径需要；彻底删除不登记）。
  if (dirRemoved && options.trash && target !== null && target.dir !== null) {
    sessionTrash.remember({
      sessionId,
      title,
      cwd,
      originalPath: target.dir,
      trashLocation,
      trashedAt: Date.now(),
    })
  }
```

</details>

**依据 3 · 源码核查**：[src/lib/session-delete.ts:660-703](https://github.com/magian1127/deepseek-harness-zh_pro/blob/54ef99c8a5bc0a220e75c4a846d658eec20fa9c3/src/lib/session-delete.ts#L660-L703)

文件优先的还原与部分结果。

<details>
<summary>查看原文（44行）</summary>

```text
export async function restoreSession(
  deps: DeleteDeps,
  entry: TrashEntry,
  restoreItemImpl: (location: string, originalPath: string) => Promise<void> = restoreItem,
): Promise<{ ok: true } | { ok: false; code: string; message: string }> {
  try {
    await restoreItemImpl(entry.trashLocation, entry.originalPath)
  } catch (error) {
      warnRouteFailure(`恢复会话 ${entry.sessionId} 失败`, error)
      return { ok: false, code: 'restore-failed', message: `恢复失败：${error instanceof Error ? error.message : String(error)}` }
  }
  // 重新挂回工作区：找到 cwd 匹配的 workspace（恢复后日志已回原位）。
  const registry = deps.workspaceRegistry
  let reattachFailed = registry === undefined
  if (registry !== undefined) {
    try {
      const workspaces = registry.list()
      const workspace = workspaces.find(candidate => candidate.path === entry.cwd)
      if (workspace === undefined) {
        reattachFailed = true
      } else if (!workspace.sessionIds.includes(entry.sessionId)) {
        await workspace.attachSession(entry.sessionId)
      }
    } catch (error) {
      reattachFailed = true
        warnRouteFailure(`恢复会话 ${entry.sessionId} 后重新挂载工作区失败`, error)
    }
  }
    // 删除驻留内存会话时会把它加入归档集合（隐藏）；恢复后取消归档。
    // attach 已失败时跳过：失败路径不动账本（归档集合保留、条目可重试），
    // 避免"目录已恢复+归档集合被顺手清理"的部分副作用泄漏。
    const unarchive = reattachFailed
      ? { ok: false as const, changed: false }
      : await unarchiveSession(deps, entry.sessionId)
  if (reattachFailed || !unarchive.ok) {
    return {
      ok: false,
      code: 'reattach-failed',
      message: '目录已恢复到原位置，但重新挂载工作区/取消归档未完成；请重试恢复或在列表刷新后检查',
    }
  }
  sessionTrash.forget(entry.sessionId)
  deletedSessionIds.delete(entry.sessionId)
  return { ok: true }
```

</details>

**依据 4 · 源码核查**：[src/lib/index.ts:275-298](https://github.com/magian1127/deepseek-harness-zh_pro/blob/54ef99c8a5bc0a220e75c4a846d658eec20fa9c3/src/lib/index.ts#L275-L298)

监控按页取快照并监听清单。

<details>
<summary>查看原文（24行）</summary>

```text
  // 「服务监控」无独立后台任务：主机只在网页拉取快照时即时扫描一次
  // （netstat），节奏完全由面板刷新间隔（serviceMonitorIntervalSec）驱动。
  ctx.effect(() => {
    const profileDir = localProfileDir()
    cleanHotDir(profileDir)
    const file = manifestPath()

    const listener = () => {
      if (debounceTimer !== null) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        debounceTimer = null
        void reconcile(ctx)
      }, 500)
    }

    try {
      if (existsSync(file)) watchFile(file, { interval: 1000 }, listener)
    } catch (error) {
      warn(`profile manifest 监听失败: ${error instanceof Error ? error.message : String(error)}`)
    }

    // 基线快照：启动时已挂载的内容不触发动作。
    lastSnapshot = readSnapshot()
    log(`热装卸监督器已启动（profile: ${argvProfile()}）`)
```

</details>

#### 缺口

- 未验证真实文件后端和宿主状态的部分失败恢复。
  **影响**：无法保证还原后会话可访问。
  **进一步探讨**：只对一次性会话检查回收、还原、重新打开及引用失败。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样决定是否启用中文增强？

**研究主题**：新假设与验证、采用判断、效果与总成本

#### 完整回答

建议先观察。对经常使用中文的 DSH 个人，可在独立 profile 核对同一设置任务完成时间和误操作数。仅启用界面相关设置，再做一次显式提示词配置对照。首次要核 DSH 和 Node 兼容与设置，持续维护受宿主更新和页面结构影响。搜索额外承担第三方请求，插件同步与会话操作需预留恢复时间。可检验把界面、模型输入、外部请求和文件变更的作用范围显示在各自执行点，是否减少误启用和恢复时间。如果无法复现易用收益或确认写入范围，停止试用并回独立 profile 的原配置。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:52-74](https://github.com/magian1127/deepseek-harness-zh_pro/blob/54ef99c8a5bc0a220e75c4a846d658eec20fa9c3/package.json#L52-L74)

Node、宿主与构建入口条件。

<details>
<summary>查看原文（23行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.2.0-rc.2 <0.3.0-0"
  },
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./locale/*.json": "./locale/*.json",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": [
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-locale"
      ]
    }
```

</details>

**依据 2 · 源码核查**：[src/lib/client/logic/register.ts:12-22](https://github.com/magian1127/deepseek-harness-zh_pro/blob/54ef99c8a5bc0a220e75c4a846d658eec20fa9c3/src/lib/client/logic/register.ts#L12-L22)

客户端设置入口。

<details>
<summary>查看原文（11行）</summary>

```text
    ctx.slots.inject('settings.section', function () {
      return ctx.slots.register({
        name: 'settings.section',
        id: 'dsh-zh-enhance',
        order: 50,
        label: function () { return t('nav') },
        locale: SETTINGS_NS,
      }, function () {
        return React.createElement(ZhSettingsSection, { t: t })
      })
    })
```

</details>

**依据 3 · 源码核查**：[src/lib/plugin-sync.ts:389-428](https://github.com/magian1127/deepseek-harness-zh_pro/blob/54ef99c8a5bc0a220e75c4a846d658eec20fa9c3/src/lib/plugin-sync.ts#L389-L428)

同步的恢复成本来自先移除后安装。

<details>
<summary>查看原文（40行）</summary>

```text
  manager: { removeBundle(name: string): Promise<unknown>; installBundle(spec: string, options?: unknown): Promise<unknown> },
  entry: SyncEntry,
  approvals: string[],
): Promise<{ record: Record<string, unknown>; note: string | null }> {
  const installOptions = approvals.length === 0 ? {} : { approvedBuilds: approvals }
  // 能力探测：removeBundle 是官方 pluginManager 的服务面方法，但更老的运行时没有它。
  // 此时直接说明「无法升级」比抛 "is not a function" 更诚实，也绝不退化成单步
  // installBundle——那必然再次撞上 already-installed。
  if (typeof manager.removeBundle !== 'function') {
    return {
      record: { application: 'failed', error: { code: 'unsupported', diagnostic: '当前运行时的 pluginManager 不提供 removeBundle，无法先卸载旧版本再升级' } },
      note: null,
    }
  }
  const removed = (await manager.removeBundle(entry.name) ?? {}) as Record<string, unknown>
  // 卸载失败时旧版本还在，原样上报：本次没有任何东西被丢弃。
  if (removed.error !== undefined && removed.error !== null) {
    return { record: removed, note: '卸载旧版本失败，当前版本未被改动' }
  }
  const installed = (await manager.installBundle(entry.spec, installOptions) ?? {}) as Record<string, unknown>
  // 成功，或失败但未抛错却不该回滚（例如 cancelled）：交给调用方按落点判断。
  if (isApplied(installed) || installed.application === 'restart-required') {
    return { record: installed, note: null }
  }
  const previous = entry.current === null || entry.current === '' ? null : specFor(entry.name, entry.current)
  if (previous === null) {
    return { record: installed, note: `新版本未生效，且没有可回滚的旧版本记录，请手动重装 ${entry.name}` }
  }
  let restored: Record<string, unknown> | null = null
  try {
    restored = (await manager.installBundle(previous, {}) ?? {}) as Record<string, unknown>
  } catch {
    restored = null
  }
  return {
    record: installed,
    note: restored !== null && isApplied(restored)
      ? `新版本未生效，已回滚到 ${entry.current}`
      : `新版本未生效且回滚失败，请手动重装 ${previous}`,
  }
```

</details>

**依据 4 · 源码核查**：[src/lib/session-delete.ts:660-703](https://github.com/magian1127/deepseek-harness-zh_pro/blob/54ef99c8a5bc0a220e75c4a846d658eec20fa9c3/src/lib/session-delete.ts#L660-L703)

会话还原存在部分状态。

<details>
<summary>查看原文（44行）</summary>

```text
export async function restoreSession(
  deps: DeleteDeps,
  entry: TrashEntry,
  restoreItemImpl: (location: string, originalPath: string) => Promise<void> = restoreItem,
): Promise<{ ok: true } | { ok: false; code: string; message: string }> {
  try {
    await restoreItemImpl(entry.trashLocation, entry.originalPath)
  } catch (error) {
      warnRouteFailure(`恢复会话 ${entry.sessionId} 失败`, error)
      return { ok: false, code: 'restore-failed', message: `恢复失败：${error instanceof Error ? error.message : String(error)}` }
  }
  // 重新挂回工作区：找到 cwd 匹配的 workspace（恢复后日志已回原位）。
  const registry = deps.workspaceRegistry
  let reattachFailed = registry === undefined
  if (registry !== undefined) {
    try {
      const workspaces = registry.list()
      const workspace = workspaces.find(candidate => candidate.path === entry.cwd)
      if (workspace === undefined) {
        reattachFailed = true
      } else if (!workspace.sessionIds.includes(entry.sessionId)) {
        await workspace.attachSession(entry.sessionId)
      }
    } catch (error) {
      reattachFailed = true
        warnRouteFailure(`恢复会话 ${entry.sessionId} 后重新挂载工作区失败`, error)
    }
  }
    // 删除驻留内存会话时会把它加入归档集合（隐藏）；恢复后取消归档。
    // attach 已失败时跳过：失败路径不动账本（归档集合保留、条目可重试），
    // 避免"目录已恢复+归档集合被顺手清理"的部分副作用泄漏。
    const unarchive = reattachFailed
      ? { ok: false as const, changed: false }
      : await unarchiveSession(deps, entry.sessionId)
  if (reattachFailed || !unarchive.ok) {
    return {
      ok: false,
      code: 'reattach-failed',
      message: '目录已恢复到原位置，但重新挂载工作区/取消归档未完成；请重试恢复或在列表刷新后检查',
    }
  }
  sessionTrash.forget(entry.sessionId)
  deletedSessionIds.delete(entry.sessionId)
  return { ok: true }
```

</details>

#### 缺口

- 未测首次时间、使用收益、搜索费用或恢复耗时。
  **影响**：没有足够证据支持对真实工作区全面启用。
  **进一步探讨**：先核隔离设置流程，再按独立验收测试对应能力。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
