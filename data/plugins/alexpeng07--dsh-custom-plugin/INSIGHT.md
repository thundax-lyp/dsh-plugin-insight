# Custom Plugin

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[9fc50a5](https://github.com/AlexPeng07/dsh-custom-plugin/tree/9fc50a5de87da550acb70d6957bebec2ff75e1d6)

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AlexPeng07/dsh-custom-plugin) [![npm 30d 3,280](https://img.shields.io/static/v1?label=npm+30d&message=3%2C280&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@alexpeng/dsh-custom-plugin) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@alexpeng/dsh-custom-plugin)
<!-- END META -->

> **功能**：在 DSH Web 集中提供外观、会话管理、提示词、Mermaid、本地用量预算及不含 API Key 字段的备份。

> **亮点**：多项便利共用Host/Client与便携投影，并对初始坏状态不可保护时只读，减少接线分散，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

> **主要限制**：进程内原子保存不是跨Host事务，系统凭据失败可回JSON；本地估价含未知模型回退、非账单真值，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 便利套件为谁集中什么，真实能力在哪里？](#detail-section-11)
  - [Q02 · 共享JSON保存和备份是否防止跨进程丢更新？](#detail-section-12)
  - [Q03 · 来源围栏、凭据及预算的准确边界是什么？](#detail-section-13)
  - [Q04 · 如何试用，跨Host状态及费用提示值得改进什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：同时需要外观、会话检索导出和本地用量视图的用户可集中操作，见 [Q01](#research-q01)。

原生操作或多个专用插件；增量是统一状态、设置、备份和查询入口，Client注册仍受真实slot/remote可得性限制，底层会话/模型能力继承宿主。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 便利面板 | 设置/侧栏/会话slots接线 | 注册请求非实际视觉验收 |
| 检索/导出 | remote.search结果与同源导出下载 | 缺服务不可用，实际文件和片段需人工核 |
| 共享状态/备份 | 便携投影与恢复 | 无跨进程CAS；不扫prompt秘密 |
| 凭据/余额 | Key可选查询 | OS失败可回JSON |
| 用量预算 | 本地趋势估算 | 非真实账单，未知模型回退 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH Host/Client与Node | 必需 | 路由/slots/session | 开放范围非未来兼容保证 |
| 可写DSH_HOME共享状态 | 保存必需 | 外观/管理/usage | 初始不可保护可只读；并发另核 |
| OS凭据/Key | 余额可选 | Key存储/查询 | set失败可回JSON，不是无Key落盘 |
| Mermaid本地包/网络 | 图表必需/回退 | 渲染引擎 | 缺本地可走CDN，不保证离线 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份、选少数功能、合成Key | 核profile与存储状态 |
| 加载 | 读状态、迁移、路由/Client | 读失败保护和诊断明确 |
| 操作 | 用户查会话/改设置 | 比对实际结果及JSON |
| 恢复 | 查副本与并发差异 | 不盲覆盖，分核凭据残留 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 运行时/状态金额未知 | 版本、备份、权限和功能选择 | 兼容/OS凭据需核 |
| 持续使用 | 查询I/O、可选余额/CDN未知 | 对账、设置和多Host复核 | 净节时未知 |
| 失败恢复 | 恢复/重查资源未知 | 对照JSON、副本、Key fallback | rename非跨进程事务 |
| 退出 | 数据/凭据保留未知 | 导出必要状态并分核残留 | 禁用不撤外部导出 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 多入口集中 | Host与Client接线 | 实际任务/视觉效率 |
| 状态保护 | 队列/merge/初始只读 | 跨Host无丢更新 |
| 预算 | 本地usage与内置估算 | 真账单/当前价差 |

> **思考**：进程内原子保存不是跨Host事务，系统凭据失败可回JSON；本地估价含未知模型回退、非账单真值，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：多项便利共用Host/Client与便携投影，并对初始坏状态不可保护时只读，减少接线分散，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

[Q02](#research-q02) 初始坏状态只读和备份投影有价值；[Q03](#research-q03) 系统凭据fallback必须让用户知道，回环围栏不能充任通用远端身份层。

<a id="detail-section-5"></a>

### 1.4 主要限制

进程内原子保存不是跨Host事务，系统凭据失败可回JSON；本地估价含未知模型回退、非账单真值，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离profile备份后先测所需两三项，合成Key查存储fallback，单功能可回原生/专用插件，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

代表Host/状态/围栏/备份/凭据链已核，试用少数功能；未运行目标或查现行外部价。

- 已检查：作者 README、包清单、源码路径 package.json、src/backup.ts、src/client/api.ts、src/client/custom.tsx、src/client/index.ts、src/host-service.ts、src/index.ts、src/loopback.ts、src/pricing.ts、src/state.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：旧四题/11 findings/自code依赖复核；完整inventory，读Host入口、状态/合并、backup、loopback、凭据和Mermaid/价目代表链；补核Client入口、slot注册、跨会话search与当前导出到下载；未全审UI/所有操作，未跑canary。
- 下一步：隔离双Host并发与坏读测试，合成Key审状态/备份与围栏，匿名usage核价；用真实检索/导出任务比较替代。本轮无目标运行。

**分析版本**

- **仓库**：[AlexPeng07/dsh-custom-plugin](https://github.com/AlexPeng07/dsh-custom-plugin)
- **版本号**：0.9.3（[固定提交 9fc50a5](https://github.com/AlexPeng07/dsh-custom-plugin/tree/9fc50a5de87da550acb70d6957bebec2ff75e1d6)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

加入CAS/冲突拒绝与价格日期/回退对账标记，验证能否减少丢更新和费用误判，未实现，见 [Q04](#research-q04)。

隔离双Host并发与坏读测试，合成Key审状态/备份与围栏，匿名usage核价；用真实检索/导出任务比较替代。本轮无目标运行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 1775 | — | — | 27158 |
| .mjs | source | 7 | 1410 | 1092 | 227 | — |
| .ts | source | 26 | 4962 | 3830 | 839 | — |
| .tsx | source | 1 | 3068 | 2740 | 283 | — |
| .ts | test | 27 | 3518 | 2907 | 321 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/AlexPeng07/dsh-custom-plugin/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：统一便利套件的状态/权限/凭据与预算边界能否支撑可控试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 便利套件为谁集中什么，真实能力在哪里？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

@alexpeng/dsh-custom-plugin 0.9.3是Host/Client双半区原生插件，集中外观、文件夹、提示词、会话检索/导出、Mermaid和本地用量预算。适合同时需要多项界面和会话操作的DSH用户；相较多个单功能插件，统一状态、备份和面板是接入便利，不是新增模型能力或证明更高工作效率。只需一个功能时，广权限及状态迁移成本可能超过便利。

Host启动读共享状态、迁移旧Key并尝试保存，监听session/event折叠用量，注册路由及custom_plugin_status，客户端入口迟后注入slots后调用installCustomPlugin，注册设置/侧栏/叠层/会话操作等组件；这些只是注册接线，不等视觉已验收。快捷面板的跨会话检索走session remote.search，服务缺失明确不可用，成功项进入remote状态；当前会话导出调同源/export，ok后downloadText并提示文件名。注册诊断自身也明确injection requests不代表宿主已经materialize全部surface；会话读取、状态写入、凭据与外部网络因此集中在同一包。兼容范围/作者canary只表示声明与脚本，不把探针存在或旧报告转为当前真实宿主通过。实际检索、视觉、模型回复和用户任务均需分别验收。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-17](https://github.com/AlexPeng07/dsh-custom-plugin/blob/9fc50a5de87da550acb70d6957bebec2ff75e1d6/package.json#L2-L17)

版本和Host/Client出口。

<details>
<summary>查看原文（16行）</summary>

```text
  "name": "@alexpeng/dsh-custom-plugin",
  "description": "Custom convenience suite for the dsh web GUI: appearance, folders, prompts, session export/search, Mermaid, quote reply, usage analytics, local budget, key-free backups, and a Ctrl/Cmd+K command palette; dual-face plugin mounted without dsh source changes.",
  "version": "0.9.3",
  "type": "module",
  "icon": "./icon.svg",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
```

</details>

**依据 2 · 源码核查**：[src/index.ts:71-107](https://github.com/AlexPeng07/dsh-custom-plugin/blob/9fc50a5de87da550acb70d6957bebec2ff75e1d6/src/index.ts#L71-L107)

加载/迁移/用量真实接线。

<details>
<summary>查看原文（37行）</summary>

```text
  const stateReady = loadStateFile(state).then(async (path) => {
    statePath = path
    if (await host.migrateLegacyApiKey()) reportDiag('legacy API key migrated to system credentials')
    stateLoaded = true
    for (const item of pendingUsage.splice(0)) host.foldUsage(item.sessionId, item.usage, item.time, item.model ?? undefined)
    try {
      await saveStateFile(state)
    } catch (error) {
      // The load itself succeeded; a failed normalization save (full disk,
      // read-only home) must not flip the host read-only — later saves retry.
      reportDiag(`state save failed: ${String((error as Error)?.message ?? error)}`)
    }
  }).catch((error) => {
    // The document could be neither read nor preserved aside. Keep the host
    // usable but read-only: events still fold in memory, while saves are
    // suppressed — persisting the never-loaded defaults would destroy the
    // very file the plugin could not read.
    reportDiag(`state file unreadable, running read-only: ${String((error as Error)?.message ?? error)}`)
    stateWritable = false
    stateLoaded = true
    for (const item of pendingUsage.splice(0)) host.foldUsage(item.sessionId, item.usage, item.time, item.model ?? undefined)
  })

  // Daily token usage: fold request/context (model) + assistant/message (usage).
  ctx.on('session/event', (session: Session, event: SessionEvent) => {
    try {
      if (event === undefined || event === null) return
      const sessionId = String(session.id)
      if (event.type === 'request/context') {
        const model = event.data.model ?? null
        sessionModels.set(sessionId, model)
        host.rememberModel(sessionId, model)
      } else if (event.type === 'assistant/message' && event.data.usage !== undefined) {
        if (!stateLoaded) pendingUsage.push({ sessionId, usage: event.data.usage, time: event.time, model: sessionModels.get(sessionId) ?? null })
        else {
          host.foldUsage(sessionId, event.data.usage, event.time)
          saveSoon()
```

</details>

**依据 3 · 源码核查**：[src/index.ts:120-137](https://github.com/AlexPeng07/dsh-custom-plugin/blob/9fc50a5de87da550acb70d6957bebec2ff75e1d6/src/index.ts#L120-L137)

路由、Mermaid预热和status工具。

<details>
<summary>查看原文（18行）</summary>

```text
  // Routes: state document, timeline, export, backup, search, balance, usage scan, Mermaid.
  const routeDisposers: Array<() => void> = []
  for (const route of makeCustomPluginRoutes(host, stateReady)) {
    routeDisposers.push(ctx.webServer.register(route))
  }

  // Preheat the Mermaid engine (local dependency first, CDN fallback) so the
  // first diagram render in the browser does not pay the load latency.
  void host.mermaidFetch().then((result) => {
    reportDiag(result.ok ? `mermaid engine ready (${result.bytes} bytes, ${host.mermaidLoadedSource()})` : `mermaid engine failed: ${result.error}`)
  }).catch((error) => {
    reportDiag(`mermaid preheat failed: ${String((error as Error)?.message ?? error)}`)
  })

  // The status tool: appearance config, today's usage, balance, timeline sample.
  const disposeTool = ctx.tools.register(defineTool({
    name: 'custom_plugin_status',
    description: '查看 Custom 便利套件（dsh-custom-plugin）运行状态：外观配置、今日 token 用量（按模型）、DeepSeek 余额（如已配置 API Key）、当前会话时间线样本、Mermaid 引擎加载情况、客户端注入诊断。',
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:31-47](https://github.com/AlexPeng07/dsh-custom-plugin/blob/9fc50a5de87da550acb70d6957bebec2ff75e1d6/src/client/index.ts#L31-L47)

真实client入口等待slots并fail-soft安装。

<details>
<summary>查看原文（17行）</summary>

```text
export function apply(ctx: ClientContext): void {
  ctx.effect(() => {
    // The slots provider (client-ui-layout) may activate after this entry on
    // newer dsh builds — a synchronous `ctx.get('slots')` here would lose
    // that race and silently skip every surface. `ctx.inject` re-runs the
    // mount whenever the service (re)appears, while staying fail-soft: if the
    // service never shows up, the GUI boots without this plugin's surfaces.
    ctx.inject(['slots'], (slotCtx) => {
      try {
        return installCustomPlugin(slotCtx, apiDiagReport)
      } catch (error) {
        // Fail soft: a broken plugin must degrade to a diagnostic line, never
        // fail its fiber (which would take the entire GUI boot down with it).
        const message = `install failed: ${String((error as Error)?.message ?? error)}`
        console.error(`[custom-plugin] ${message}`)
        apiDiagReport(message)
        return () => {}
```

</details>

**依据 5 · 源码核查**：[src/client/custom.tsx:2989-3025](https://github.com/AlexPeng07/dsh-custom-plugin/blob/9fc50a5de87da550acb70d6957bebec2ff75e1d6/src/client/custom.tsx#L2989-L3025)

具体slot注册及请求非实际呈现保证。

<details>
<summary>查看原文（37行）</summary>

```text
  const injectOne = (key: string, id: string, options: Record<string, unknown>, comp: unknown): void => {
    try {
      slots.inject(key, () => {
        try {
          const unregister = slots.register({ name: key, ...options }, comp)
          unregisterAll.push(unregister)
          return unregister
        } catch (error) {
          // `register` runs later, when the host materializes the slot, so it is
          // outside the try below: without this guard a rejected registration
          // (wrong slot kind, bad options) would take the surface down silently
          // while the ring still read green.
          reportDiag('register ' + key + ' (' + id + '): ' + String((error as Error)?.message ?? error))
          return () => {}
        }
      })
      reportDiag('ok ' + key + ' (' + id + ')')
      injectedCount++
      injectedKeys.add(key)
    } catch (error) {
      const message = 'inject ' + key + ' (' + id + '): ' + String((error as Error)?.message ?? error)
      console.error('[custom-plugin] ' + message)
      reportDiag(message)
    }
  }
  injectOne('sidebar.footer.action', 'custom-plugin-folders', { id: 'custom-plugin-folders', order: -100, label: '项目' }, FolderSidebarButton)
  injectOne('shell.overlay', 'custom-plugin-overlay', { id: 'custom-plugin-overlay', order: 10, label: 'Custom 便利套件' }, OverlayRoot)
  injectOne('conversation.input.dock', 'custom-plugin-quote', { id: 'custom-plugin-quote', order: 30, label: '引用回复' }, QuoteDock)
  injectOne('conversation.chat.turnTail', 'custom-plugin-turn-tail', { id: 'custom-plugin-turn-tail', order: 10 }, TurnTailEntry)
  injectOne('settings.section', 'custom-plugin-appearance', { id: 'custom-plugin-appearance', order: 30, label: '个性化' }, SettingsPage)
  injectOne('conversation.session.header.actions', 'custom-plugin-panel-open', { id: 'custom-plugin-panel-open', order: 5, label: '个性化' }, HeaderPanelButton)
  injectOne('conversation.session.header.actions', 'custom-plugin-prompts', { id: 'custom-plugin-prompts', order: 6, label: '提示词' }, PromptQuickButton)
  injectOne('conversation.session.header.utilities', 'custom-plugin-balance', { id: 'custom-plugin-balance', order: -5, label: '额度' }, HeaderBalance)
  // Requests submitted, not surfaces proven: dsh defers the callback above until
  // the slot is declared, so nothing here knows yet whether the host accepted
  // any of them. Materialization reports itself, per slot, through the `ok` /
  // `register` lines this one follows.
```

</details>

**依据 6 · 源码核查**：[src/client/custom.tsx:2567-2589](https://github.com/AlexPeng07/dsh-custom-plugin/blob/9fc50a5de87da550acb70d6957bebec2ff75e1d6/src/client/custom.tsx#L2567-L2589)

命令面板搜索真实remote与失败状态、导出入口。

<details>
<summary>查看原文（23行）</summary>

```text
      if (!s.commandOpen || query.trim().length < 2) { setRemote([]); setRemoteStatus(''); return }
      const controller = new AbortController()
      const timer = setTimeout(() => {
        const sessionSearch = sessionRemote()
        if (sessionSearch === undefined) { setRemoteStatus(CROSS_SEARCH_UNAVAILABLE); return }
        setRemoteStatus('跨会话搜索中…')
        try {
          void sessionSearch.search({ query: query.trim() }, controller.signal).then((result) => {
            if (controller.signal.aborted) return
            if (result.ok) { setRemote(result.value.items); setRemoteStatus('') }
            else {
              setRemote([]); setRemoteStatus(remoteErrorMessage(result.error, CROSS_SEARCH_UNAVAILABLE))
            }
          }).catch(() => { if (!controller.signal.aborted) { setRemote([]); setRemoteStatus(CROSS_SEARCH_UNAVAILABLE) } })
        } catch { if (!controller.signal.aborted) { setRemote([]); setRemoteStatus(CROSS_SEARCH_UNAVAILABLE) } }
      }, 250)
      return () => { clearTimeout(timer); controller.abort() }
    }, [query, s.commandOpen])
    if (!s.commandOpen) return null
    interface Command { key: string; label: string; detail: string; run: () => void; disabled?: boolean }
    const commands: Command[] = [
      { key: 'balance', label: '打开额度与用量', detail: '功能', run: () => setS({ commandOpen: false, panelOpen: true, panelTab: 'balance' }) },
      { key: 'export', label: '导出当前会话', detail: S.sessionId === null ? '当前没有打开的会话' : 'Markdown', disabled: S.sessionId === null, run: () => { setS({ commandOpen: false }); runExport('markdown') } },
```

</details>

**依据 7 · 源码核查**：[src/client/custom.tsx:1335-1349](https://github.com/AlexPeng07/dsh-custom-plugin/blob/9fc50a5de87da550acb70d6957bebec2ff75e1d6/src/client/custom.tsx#L1335-L1349)

导出结果到下载及错误提示。

<details>
<summary>查看原文（15行）</summary>

```text
  function runExport(format: string): void {
    if (S.sessionId === null) { toast('当前没有打开的会话', 'error'); return }
    setS({ exporting: true })
    void apiExportRun(S.sessionId, format).then((result) => {
      if (result.ok !== true) {
        toast(result.error ?? '导出失败', 'error')
        return
      }
      try {
        downloadText(result.content, result.fileName, result.mime)
        toast('已导出 ' + result.fileName, 'info')
      } catch (error) {
        toast('导出失败: ' + String((error as Error)?.message ?? error), 'error')
      }
    }).catch((error) => toast('导出失败: ' + String((error as Error)?.message ?? error), 'error')).finally(() => setS({ exporting: false }))
```

</details>

**依据 8 · 源码核查**：[src/client/api.ts:100-102](https://github.com/AlexPeng07/dsh-custom-plugin/blob/9fc50a5de87da550acb70d6957bebec2ff75e1d6/src/client/api.ts#L100-L102)

导出请求实际post/export。

```text
export async function apiExportRun(sessionId: string, format: string): Promise<{ ok: true; content: string; fileName: string; mime: string } | { ok: false; error?: string }> {
  return await postJson('/export', { sessionId, format })
}
```

#### 缺口

- 当前客户端视觉、多个Host版本和同任务效率未实测。
  **影响**：不能由多入口或本地状态机制推导实际效率、安全及账单准确。
  **进一步探讨**：固定目标profile，先选实际需要的两三项，以检索/导出和视觉检查核结果，再比较原生/单功能替代。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 共享JSON保存和备份是否防止跨进程丢更新？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

不能保证。state按路径在同进程排队，先mergeExternalChanges，再写PID临时文件并rename，成功后记mtime/size/doc基线。外部变更以mtime/size探测后做三方合并，各section与usage有特定合并策略，但“读外部→合并→写”没有共同跨进程锁/CAS，两Host可同时读同基线后相继覆盖；这是未验证竞争风险，不宣称已经实际丢失。同mtime/size跳过读取，读失败或不可解码外部文档在合并阶段直接返回，随后仍可保存本地状态。

启动加载坏文档先隔离，若既不能读也不能保存旁路副本，Host设read-only，避免默认值覆盖；这是启动保护，不能泛化成并发阶段同样拒写。可移植backup投影只含cfg/folders/prompts/stars/usage、不含apiKey；导入保留当前Key，写recovery副本有rename，但不是全系统快照或跨进程事务。副本也不保证用户自己写入prompt中的秘密被扫描清除。恢复要比较共享文件、recovery和实际UI，不能仅看保存成功。

#### 证据与依据

**依据 1 · 源码核查**：[src/state.ts:315-339](https://github.com/AlexPeng07/dsh-custom-plugin/blob/9fc50a5de87da550acb70d6957bebec2ff75e1d6/src/state.ts#L315-L339)

进程内队列/临时文件/rename。

<details>
<summary>查看原文（25行）</summary>

```text
export function saveStateFile(state: CustomPluginState, home: string = dshHome()): Promise<void> {
  const statePath = join(home, STATE_FILE)
  const turn = (saveQueues.get(statePath) ?? Promise.resolve())
    .catch(() => {})
    .then(async () => {
      await mergeExternalChanges(state, statePath)
      await mkdir(dirname(statePath), { recursive: true })
      const doc = JSON.stringify(state)
      const tmpPath = tempPathFor(statePath)
      try {
        await writeFile(tmpPath, doc, 'utf8')
        await rename(tmpPath, statePath)
      } catch (error) {
        // A pid-qualified temp would otherwise survive a failed turn and accumulate.
        await rm(tmpPath, { force: true }).catch(() => { /* the rename may have landed; nothing left to clean */ })
        throw error
      }
      // Record what this process just made the file look like, so the next
      // turn can tell its own writes from another host's.
      const st = await stat(statePath).catch(() => null)
      syncBaselines.set(statePath, st !== null ? { mtimeMs: st.mtimeMs, size: st.size, doc } : null)
    })
  saveQueues.set(statePath, turn)
  return turn.finally(() => {
    if (saveQueues.get(statePath) === turn) saveQueues.delete(statePath)
```

</details>

**依据 2 · 源码核查**：[src/state.ts:368-383](https://github.com/AlexPeng07/dsh-custom-plugin/blob/9fc50a5de87da550acb70d6957bebec2ff75e1d6/src/state.ts#L368-L383)

外变探测及失败直接返回。

<details>
<summary>查看原文（16行）</summary>

```text
async function mergeExternalChanges(state: CustomPluginState, statePath: string): Promise<void> {
  const baseline = syncBaselines.get(statePath)
  if (baseline === undefined) return
  const st = await stat(statePath).catch(() => null)
  if (st === null) return // absent (or vanishing mid-check): nothing to merge
  if (baseline !== null && st.mtimeMs === baseline.mtimeMs && st.size === baseline.size) return
  const text = await readFile(statePath, 'utf8').catch(() => null)
  if (text === null) return
  let theirs: unknown
  try {
    theirs = JSON.parse(text)
  } catch {
    return // an undecodable external document has nothing mergeable
  }
  if (theirs === null || typeof theirs !== 'object') return
  mergeThreeWay(state, baseline !== null ? safeParse(baseline.doc) : null, theirs as Record<string, unknown>)
```

</details>

**依据 3 · 源码核查**：[src/index.ts:83-91](https://github.com/AlexPeng07/dsh-custom-plugin/blob/9fc50a5de87da550acb70d6957bebec2ff75e1d6/src/index.ts#L83-L91)

初始加载不可保护时read-only。

```text
  }).catch((error) => {
    // The document could be neither read nor preserved aside. Keep the host
    // usable but read-only: events still fold in memory, while saves are
    // suppressed — persisting the never-loaded defaults would destroy the
    // very file the plugin could not read.
    reportDiag(`state file unreadable, running read-only: ${String((error as Error)?.message ?? error)}`)
    stateWritable = false
    stateLoaded = true
    for (const item of pendingUsage.splice(0)) host.foldUsage(item.sessionId, item.usage, item.time, item.model ?? undefined)
```

**依据 4 · 源码核查**：[src/backup.ts:101-109](https://github.com/AlexPeng07/dsh-custom-plugin/blob/9fc50a5de87da550acb70d6957bebec2ff75e1d6/src/backup.ts#L101-L109)

投影不含apiKey。

```text
      for (const [model, rawRow] of Object.entries(models)) {
        if (!safeKey(model)) continue
        const row = usageRow(rawRow)
        if (model !== '' && row !== null) clean[model] = row
      }
      if (Object.keys(clean).length > 0) usage[day] = clean
    }
  }
  return clone({ format: BACKUP_FORMAT, version: BACKUP_VERSION, exportedAt: new Date().toISOString(), data: { cfg: normalizeCfg(state.cfg), folders, prompts, stars, usage } })
```

**依据 5 · 源码核查**：[src/backup.ts:216-231](https://github.com/AlexPeng07/dsh-custom-plugin/blob/9fc50a5de87da550acb70d6957bebec2ff75e1d6/src/backup.ts#L216-L231)

导入Key保留与恢复副本。

<details>
<summary>查看原文（16行）</summary>

```text
export function importedState(current: CustomPluginState, backup: CustomPluginBackupV1, mode: BackupImportMode): CustomPluginState {
  const data = backup.data
  if (mode === 'replace') return { cfg: clone(data.cfg), folders: clone(data.folders), prompts: clone(data.prompts), stars: clone(data.stars), usage: clone(data.usage), apiKey: current.apiKey }
  const stars = clone(current.stars)
  for (const [sessionId, values] of Object.entries(data.stars)) stars[sessionId] = { ...(stars[sessionId] ?? {}), ...clone(values) }
  const usage = clone(current.usage)
  for (const [day, models] of Object.entries(data.usage)) usage[day] = { ...(usage[day] ?? {}), ...clone(models) }
  pruneUsage(usage)
  return { cfg: normalizeCfg({ ...current.cfg, ...clone(data.cfg) }), folders: mergeFolders(current.folders, data.folders), prompts: mergeById(current.prompts, data.prompts), stars, usage, apiKey: current.apiKey }
}

export async function writeRecoveryBackup(path: string, state: CustomPluginState): Promise<string> {
  const target = path + '.backup.json'
  const temporary = tempPathFor(target)
  await writeFile(temporary, JSON.stringify(createBackup(state), null, 2), 'utf8')
  await rename(temporary, target)
```

</details>

#### 缺口

- 多Host竞争、同mtime/size、外部坏文档和恢复副本未做故障验证。
  **影响**：不能由多入口或本地状态机制推导实际效率、安全及账单准确。
  **进一步探讨**：两个隔离Host并发改不同section/usage，注入读失败和同尺寸快速改写，核最后状态、诊断和恢复，不以rename当事务。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 来源围栏、凭据及预算的准确边界是什么？

**研究主题**：功能与机制、缺陷与关键质疑、效果与总成本、工程质量与复用

#### 完整回答

路由用回环socket、回环Host、cross-site拒绝及Origin相同authority校验；缺Origin接受，这是Desktop转发兼容的本机信任假设，不是互联网多用户认证/授权层。应在实际代理/桌面转发下测拒绝，不建议把本地接口无条件暴露远端。

Key优先系统凭据存储，但applyEdit中set失败就把原Key留state.apiKey，migrateLegacy在不可用或读取失败时保留旧值；因此不能承诺所有平台Key永不落共享JSON。便携备份无apiKey和本地状态可含Key是两件事。Mermaid先本地依赖，缺失回退CDN并在启动预热，所谓离线需要依赖真到位；外部余额需要有效Key。预算按本地事件和内置价目估算，priceOf对未知模型可回退Flash；真实价格、缓存/时段与合同未本轮查新，不把估价当账单。状态、凭据、CDN和会话范围都要在采用前明确。

#### 证据与依据

**依据 1 · 源码核查**：[src/loopback.ts:48-65](https://github.com/AlexPeng07/dsh-custom-plugin/blob/9fc50a5de87da550acb70d6957bebec2ff75e1d6/src/loopback.ts#L48-L65)

来源围栏与Origin缺省信任。

<details>
<summary>查看原文（18行）</summary>

```text
export function isLoopbackRequest(request: IncomingMessage): boolean {
  if (!isLoopbackAddress(request.socket.remoteAddress)) return false
  const host = request.headers.host
  if (typeof host !== 'string') return false
  let hostUrl: URL
  try {
    hostUrl = new URL('http://' + host)
  } catch {
    return false
  }
  if (!isLoopbackHostname(hostUrl.hostname)) return false
  if (request.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = request.headers.origin
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
```

</details>

**依据 2 · 源码核查**：[src/host-service.ts:299-307](https://github.com/AlexPeng07/dsh-custom-plugin/blob/9fc50a5de87da550acb70d6957bebec2ff75e1d6/src/host-service.ts#L299-L307)

系统凭据失败回stateKey。

```text
    if (typeof edit.apiKey === 'string') {
      const key = edit.apiKey.trim()
      if (key === '') {
        const cleared = await this.credentialStore.clear()
        if (this.credentialStore.available && !cleared) throw new Error('系统凭据清除失败，请重试')
        this.state.apiKey = ''
      } else {
        if (!/^sk-/.test(key)) throw new Error('DeepSeek API Key 必须以 sk- 开头')
        this.state.apiKey = await this.credentialStore.set(key) ? '' : key
```

**依据 3 · 源码核查**：[src/host-service.ts:354-372](https://github.com/AlexPeng07/dsh-custom-plugin/blob/9fc50a5de87da550acb70d6957bebec2ff75e1d6/src/host-service.ts#L354-L372)

迁移读取失败不覆盖凭据。

<details>
<summary>查看原文（19行）</summary>

```text
  async migrateLegacyApiKey(): Promise<boolean> {
    this.credentialCache = null
    const key = (this.state.apiKey ?? '').trim()
    if (!/^sk-/.test(key) || !this.credentialStore.available) return false
    let existing = ''
    try {
      existing = (await this.credentialStore.get()).trim()
    } catch {
      // Do not overwrite a credential that could not be read safely.
      return false
    }
    if (existing !== '') {
      if (/^sk-/.test(existing)) {
        this.state.apiKey = ''
        return true
      }
      // Keep the legacy value as a compatibility fallback rather than
      // overwriting an unexpected non-empty OS-store entry.
      return false
```

</details>

**依据 4 · 源码核查**：[src/host-service.ts:680-701](https://github.com/AlexPeng07/dsh-custom-plugin/blob/9fc50a5de87da550acb70d6957bebec2ff75e1d6/src/host-service.ts#L680-L701)

Mermaid本地与CDN回退。

<details>
<summary>查看原文（22行）</summary>

```text
  private async mermaidFetchImpl(): Promise<MermaidFetchResult> {
    const localPath = this.localMermaidPath()
    if (localPath !== null && localPath !== '') {
      try {
        // Async read: the bundled engine is ~3.5 MB, and a synchronous read
        // here stalls every Host request behind it during boot.
        const text = await readFile(localPath, 'utf8')
        if (text.length > 0) {
          this.cacheMermaid(text, 'local')
          return { ok: true, bytes: this.mermaidBytesValue }
        }
      } catch {
        // unreadable local bundle: fall through to the CDN mirrors
      }
    }
    const urls = [
      `https://cdn.jsdelivr.net/npm/mermaid@${MERMAID_CDN_VERSION}/dist/mermaid.min.js`,
      `https://fastly.jsdelivr.net/npm/mermaid@${MERMAID_CDN_VERSION}/dist/mermaid.min.js`,
      `https://unpkg.com/mermaid@${MERMAID_CDN_VERSION}/dist/mermaid.min.js`,
    ]
    let text = ''
    let lastError = ''
```

</details>

**依据 5 · 源码核查**：[src/pricing.ts:35-53](https://github.com/AlexPeng07/dsh-custom-plugin/blob/9fc50a5de87da550acb70d6957bebec2ff75e1d6/src/pricing.ts#L35-L53)

内置价与未知模型回退。

<details>
<summary>查看原文（19行）</summary>

```text
const FLASH_PRICE: DeepSeekUnitPrice = { input: 2, cacheHit: 0.04, output: 8 }

/** Current official peak prices, in CNY per 1M tokens. Off-peak is exactly
 * half of peak per the official page (weekday 9-12 / 14-18 Beijing time). */
const PEAK_PRICES: Readonly<Record<string, DeepSeekUnitPrice>> = {
  'deepseek-flash': FLASH_PRICE,
  'deepseek-v4-flash': FLASH_PRICE,
  'deepseek-v4-flash-vision-exp': FLASH_PRICE,
  'deepseek-v4-pro': { input: 9, cacheHit: 0.3, output: 27 },
  // Retired names remain readable for older session logs; they no longer
  // appear on the official page and are approximated at Flash pricing.
  'deepseek-chat': FLASH_PRICE,
  'deepseek-reasoner': FLASH_PRICE,
}

/** Resolve a model's peak price, falling back to Flash for unknown/legacy rows. */
export function priceOf(model: string): DeepSeekUnitPrice {
  return PEAK_PRICES[model] ?? FLASH_PRICE
}
```

</details>

#### 缺口

- 不同OS凭据fallback、代理环境围栏和真实账单差异未验证。
  **影响**：不能由多入口或本地状态机制推导实际效率、安全及账单准确。
  **进一步探讨**：合成Key测试存储成功/失败及备份输出，验证跨源/代理请求；用已知匿名账单核本地估算，不复用旧价目当现价。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何试用，跨Host状态及费用提示值得改进什么？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

建议隔离profile、备份共享状态，仅测试最需要的两三项；先用无秘密提示词和合成Key，检查实际凭据存储状态。首次承担版本/权限/功能选择与恢复副本准备，持续有session读写、状态I/O、模型/网络和估价复核，故障要核并发保存、Key回退和恢复结果；现金/时间未知。退出前保留状态和必要数据，禁用不撤已进历史/导出数据，系统凭据与JSON残留要分别核。单功能需求可回原生或专用插件。

可证伪假设是跨进程保存加入版本/CAS与明确冲突拒绝，并在费用行标明价格来源/日期、未知模型回退与未对账。相对现有merge+本地估价，这可能减少丢更新和将预算当账单的误判；新增锁/版本处理及提示成本不能忽略。两个Host故障交错对比当前/CAS，另用新匿名usage样本核价对账，比较丢字段、误合计、人工恢复和误解；若无减少或配置负担超过收益则停止。该方案未实现、不算既有可靠同步或经济收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/state.ts:315-335](https://github.com/AlexPeng07/dsh-custom-plugin/blob/9fc50a5de87da550acb70d6957bebec2ff75e1d6/src/state.ts#L315-L335)

CAS可落在当前保存边界。

<details>
<summary>查看原文（21行）</summary>

```text
export function saveStateFile(state: CustomPluginState, home: string = dshHome()): Promise<void> {
  const statePath = join(home, STATE_FILE)
  const turn = (saveQueues.get(statePath) ?? Promise.resolve())
    .catch(() => {})
    .then(async () => {
      await mergeExternalChanges(state, statePath)
      await mkdir(dirname(statePath), { recursive: true })
      const doc = JSON.stringify(state)
      const tmpPath = tempPathFor(statePath)
      try {
        await writeFile(tmpPath, doc, 'utf8')
        await rename(tmpPath, statePath)
      } catch (error) {
        // A pid-qualified temp would otherwise survive a failed turn and accumulate.
        await rm(tmpPath, { force: true }).catch(() => { /* the rename may have landed; nothing left to clean */ })
        throw error
      }
      // Record what this process just made the file look like, so the next
      // turn can tell its own writes from another host's.
      const st = await stat(statePath).catch(() => null)
      syncBaselines.set(statePath, st !== null ? { mtimeMs: st.mtimeMs, size: st.size, doc } : null)
```

</details>

**依据 2 · 源码核查**：[src/state.ts:368-383](https://github.com/AlexPeng07/dsh-custom-plugin/blob/9fc50a5de87da550acb70d6957bebec2ff75e1d6/src/state.ts#L368-L383)

当前探测窗口。

<details>
<summary>查看原文（16行）</summary>

```text
async function mergeExternalChanges(state: CustomPluginState, statePath: string): Promise<void> {
  const baseline = syncBaselines.get(statePath)
  if (baseline === undefined) return
  const st = await stat(statePath).catch(() => null)
  if (st === null) return // absent (or vanishing mid-check): nothing to merge
  if (baseline !== null && st.mtimeMs === baseline.mtimeMs && st.size === baseline.size) return
  const text = await readFile(statePath, 'utf8').catch(() => null)
  if (text === null) return
  let theirs: unknown
  try {
    theirs = JSON.parse(text)
  } catch {
    return // an undecodable external document has nothing mergeable
  }
  if (theirs === null || typeof theirs !== 'object') return
  mergeThreeWay(state, baseline !== null ? safeParse(baseline.doc) : null, theirs as Record<string, unknown>)
```

</details>

**依据 3 · 源码核查**：[src/pricing.ts:35-53](https://github.com/AlexPeng07/dsh-custom-plugin/blob/9fc50a5de87da550acb70d6957bebec2ff75e1d6/src/pricing.ts#L35-L53)

估价/回退需要清楚标注。

<details>
<summary>查看原文（19行）</summary>

```text
const FLASH_PRICE: DeepSeekUnitPrice = { input: 2, cacheHit: 0.04, output: 8 }

/** Current official peak prices, in CNY per 1M tokens. Off-peak is exactly
 * half of peak per the official page (weekday 9-12 / 14-18 Beijing time). */
const PEAK_PRICES: Readonly<Record<string, DeepSeekUnitPrice>> = {
  'deepseek-flash': FLASH_PRICE,
  'deepseek-v4-flash': FLASH_PRICE,
  'deepseek-v4-flash-vision-exp': FLASH_PRICE,
  'deepseek-v4-pro': { input: 9, cacheHit: 0.3, output: 27 },
  // Retired names remain readable for older session logs; they no longer
  // appear on the official page and are approximated at Flash pricing.
  'deepseek-chat': FLASH_PRICE,
  'deepseek-reasoner': FLASH_PRICE,
}

/** Resolve a model's peak price, falling back to Flash for unknown/legacy rows. */
export function priceOf(model: string): DeepSeekUnitPrice {
  return PEAK_PRICES[model] ?? FLASH_PRICE
}
```

</details>

**依据 4 · 源码核查**：[src/index.ts:83-91](https://github.com/AlexPeng07/dsh-custom-plugin/blob/9fc50a5de87da550acb70d6957bebec2ff75e1d6/src/index.ts#L83-L91)

只读退路但非全部故障恢复。

```text
  }).catch((error) => {
    // The document could be neither read nor preserved aside. Keep the host
    // usable but read-only: events still fold in memory, while saves are
    // suppressed — persisting the never-loaded defaults would destroy the
    // very file the plugin could not read.
    reportDiag(`state file unreadable, running read-only: ${String((error as Error)?.message ?? error)}`)
    stateWritable = false
    stateLoaded = true
    for (const item of pendingUsage.splice(0)) host.foldUsage(item.sessionId, item.usage, item.time, item.model ?? undefined)
```

#### 缺口

- 没有CAS对照、真实采用负担与预算理解数据。
  **影响**：不能由多入口或本地状态机制推导实际效率、安全及账单准确。
  **进一步探讨**：新并发/账单样本比较误差和恢复时间后决定，避免仅重放旧样本宣称新效果。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
