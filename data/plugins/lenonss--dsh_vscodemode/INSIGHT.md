# DSH VSCode Mode

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[47b2129](https://github.com/Lenonss/DSH_VsCodeMode/tree/47b2129beec12c0b6240435c40d796deada4b50a)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Lenonss/DSH_VsCodeMode) [![npm 30d 13,190](https://img.shields.io/static/v1?label=npm+30d&message=13%2C190&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-vscode-mode) [![最新发布 2026-11-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-vscode-mode)
<!-- END META -->

> **功能**：在 DSH 内集成 Monaco 编辑、Agent 差异审查、工作区工具及语言服务。

> **亮点**：[Q02](#research-q02) 将官方会话差异与能对应的原始字节接在一起。[Q03](#research-q03) 将审查状态更新与带守卫的文件写回分开，允许拒绝目标已经变化的撤销。

> **主要限制**：[Q03](#research-q03) 缺活跃会话、原件或 provider 版本守卫时会限制 Undo，不能从界面按钮推断任意历史或外部变更可回滚。

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
  - [Q01 · 谁能从同屏审查得到什么？](#detail-section-11)
  - [Q02 · 审查来源、宿主能力与原始证据怎样接起来？](#detail-section-12)
  - [Q03 · Keep 和 Undo 分别改动什么？](#detail-section-13)
  - [Q04 · 怎样试用并控制失败恢复成本？](#detail-section-14)
  - [Q05 · 冲突解释能否减少误覆盖？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合在 DSH 对话里修改一个已版本控制的文本文件后，需要逐块检查并撤回一项变更的开发者。

[Q01](#research-q01) 独立编辑器与 Git 可以回看工作树变化。插件提供同屏定位、当前会话证据及审查决定。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 同屏编辑 | 从对话打开工作区文本和侧栏 | 依赖真实宿主与客户端注入 |
| 差异与 Keep | 对应记录、选择块并保存审查决定 | 真实文件结果由独立 diff 辅助查证 |
| Undo | 对仍然匹配证据的活动文件做受控写回 | 需要活跃会话、原字节或匹配版本等条件 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 包支持的 DSH、Node 和宿主／Web 导出 | 必需 | 启动两半 | 看实际包与宿主接口 |
| Host connection 及文件、会话服务 | 审查必需 | 路由认证与工作区解析 | 缺认证或服务时路线无法进入 |
| 活跃会话、匹配字节与 provider 版本守卫 | 官方 Undo 必需 | 以受控方式撤回一块变化 | 条件不足时查证据或回原工具 |
| 可回滚文本样本和独立对照 | 本次试用必需 | 验收真实文件 | 使用 Git 或原编辑器核对 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 在临时 Git 工作区记录一个文本文件的基线 | 确定会话真实定位和源文件 |
| 编辑 | 通过受支持工具改两块可识别文字 | 独立 diff 与界面能对应 |
| 审查 | Keep 一块，Undo 另一块，再查真实文件 | 缺字节或守卫时保留文件并回原工具 |
| 复核 | 制造一次外部编辑冲突并核对结果 | 不重复覆盖，记录原操作与落盘范围 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 包、工作区和浏览器资源未量化 | 固定宿主、权限及可控文件 | 接入相关版本待验 |
| 持续使用 | SQLite 及原件占用未测 | 核对来源、批次和空证据 | 无相对原工具的节时数据 |
| 失败恢复 | 外部恢复及重复操作成本未知 | 对照字节、操作日志和 Git | 拒绝的撤销须非破坏性回查 |
| 退出 | 本地产物留存未知 | 关闭挂载并核对持久化原件 | 未验证完整卸载 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 同屏工作 | 文件打开、侧栏和审查 RPC 接线 | 真实宿主跨版本表现 |
| 审查追溯 | 轮次、文件和审查决定分层保存 | 用户复核时间和实际覆盖率 |
| 受控写回 | 相符字节、版本与回读参与判断 | 并发、异常后的实机行为 |

> **思考**：[Q03](#research-q03) 缺活跃会话、原件或 provider 版本守卫时会限制 Undo，不能从界面按钮推断任意历史或外部变更可回滚。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将官方会话差异与能对应的原始字节接在一起。[Q03](#research-q03) 将审查状态更新与带守卫的文件写回分开，允许拒绝目标已经变化的撤销。

[Q02](#research-q02) 采集失败留为空并让原工具继续。[Q03](#research-q03) 当前字节、文件版本和操作日志各约束一类问题，结果不确定时可用原操作核对。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 缺活跃会话、原件或 provider 版本守卫时会限制 Undo，不能从界面按钮推断任意历史或外部变更可回滚。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 仅在可独立回退的临时工作区试一个文本修改。先用原编辑器对照差异，再分别核对 Keep 的状态和 Undo 的真实文件。证据缺失、发生冲突或读回不一致时结束插件写回并用 Git 恢复。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持同屏编辑、官方审查证据与受控撤销路径。包、宿主和并发运行待验证，面向用户的失败解释方案待对照。

- 已检查：作者 README、包清单、源码路径 README.md、src/client/index.ts、src/reviewRpc.ts、package.json、cordis.patch.yml、src/index.ts、src/routes.ts、src/httpGuard.ts、src/reviewCapture.ts、src/capture.ts、src/reviewUndo.ts、src/pending/store.ts、src/store.ts、src/reviewDb.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码核查双入口、认证 RPC、代表性的官方审查及累计待审写回。未安装执行，未核查实际 LSP、SVN、工作区 MCP 或文档处理链。
- 下一步：[Q05](#research-q05) 从两个简单修改验证证据、决定和真实字节，再故意改变目标文件或丢弃回执对照。

**分析版本**

- **仓库**：[Lenonss/DSH_VsCodeMode](https://github.com/Lenonss/DSH_VsCodeMode)
- **版本号**：0.30.0（[固定提交 47b2129](https://github.com/Lenonss/DSH_VsCodeMode/tree/47b2129beec12c0b6240435c40d796deada4b50a)）
- **版本日期**：2026-11-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 以清楚的冲突、证据和原操作提示辅助选择独立回查，可能减少用户因不明失败而重复撤销。须以实际文件状态对照验证。

[Q05](#research-q05) 从两个简单修改验证证据、决定和真实字节，再故意改变目标文件或丢弃回执对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 74 | 5958 | — | — | 134136 |
| .mjs | source | 5 | 1083 | 815 | 196 | — |
| .ts | source | 391 | 83049 | 54777 | 23479 | — |
| .tsx | source | 7 | 2465 | 1797 | 539 | — |
| .ts | test | 318 | 47338 | 40430 | 3246 | — |
| .mts | test | 1 | 167 | 144 | 8 | — |
| .ts | example | 1 | 31 | 14 | 15 | — |
| .mjs | test | 3 | 180 | 148 | 21 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/Lenonss/DSH_VsCodeMode/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用同屏编辑与审查处理一次 Agent 改动时，如何核实原件、决策和失败后的真实文件？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁能从同屏审查得到什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在 DSH 对话里请 Agent 改一个已版本控制的文件后，开发者要逐块核对修改，并只撤回一处不希望保留的变化。外部编辑器或终端的 Git 差异可以给出工作树变化，并可独立复查真实文件；它们并不总在当前会话内说明哪轮修改处于何种审查状态。本包的浏览器 apply 注册文件打开与侧栏，并在官方侧栏条件满足时接入官方打开器和会话资源地址。审查流程的实质差别是把编辑、轮次证据与决定放在原对话旁；如果文件不存在于捕获范围，仍须回到独立 diff 或原生工具。合格任务是定位选定变更，保留需要的一块，核对退出后的文件字节。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:8-16](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/README.md#L8-L16)

作者说明编辑与审查同屏及会话范围。

```text
> DSH 上的**类 VSCode 编码体验**：Monaco 文件编辑器 + Agent 差异审查 + LSP 智能。
> 由 `@dsh-external/dsh-edit-review` 重构而来。

![同屏工作台：中央 AI 对话、右侧 Monaco 编辑器与底部差异操作条](docs/screenshots/workbench.png)

- 📝 **同屏编辑**：DSH 0.1.5+ 官方右侧 Sidebar，AI 对话与文件编辑同屏
- 🔍 **差异审查**：Keep / Undo / 回滚 / 归档，状态持久化重启不丢。同工作区内所有对话共享待审列表、统计与决定，来源对话仅用于追溯；不同工作区隔离。当前页操作后刷新，其他已打开页面通过约 5 秒轮询同步（后台页面恢复可见后刷新）。写操作仍要求本端活跃会话和原有权限。
- 🧠 **LSP 智能**：转到定义 / 查找引用 / Peek 多结果选择 / 智能补全（注释索引）/ 签名帮助
- 🐞 **断点调试**：DAP 桥通用化，行内断点、`.dsh/launch.json`、四段调试面板
```

**依据 2 · 源码核查**：[src/client/index.ts:487-501](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/src/client/index.ts#L487-L501)

实际注册文件与功能面板。

<details>
<summary>查看原文（15行）</summary>

```text
  ctx.provide('fileOpeners', registry)
  ctx.effect(() => registry.register(vscodeOpener()), 'vscode-mode: file opener')

  // 侧边栏面板注册表（对外 provide，供本插件/第三方注册面板；文件管理为面板 #1）
  const sidebarPanels = createSidebarPanelRegistry()
  ctx.provide('edrvSidebarPanels', sidebarPanels)
  ctx.effect(() => sidebarPanels.register(createFilePanel()), 'vscode-mode: sidebar panel')
  // 搜索面板：活动栏「搜索」页签（Ctrl+Shift+F 唤起，VSCode 搜索视图形态）
  ctx.effect(() => sidebarPanels.register(createSearchPanel()), 'vscode-mode: sidebar panel search')
  // 规则面板：活动栏「规则」页签（Codebuddy 规则管理形态：用户/项目规则 + 启用开关，host 注入生效）
  ctx.effect(() => sidebarPanels.register(createRulesPanel()), 'vscode-mode: sidebar panel rules')
  // SVN 变更面板：活动栏「SVN 变更」页签（工作副本状态列表；visible 守卫使非 SVN 工作区不出现）
  ctx.effect(() => sidebarPanels.register(createSvnPanel()), 'vscode-mode: sidebar panel svn')
  // 调试面板：活动栏「调试」页签（VS Code 调试视图四段布局 + REPL；DAP 桥接）
  ctx.effect(() => sidebarPanels.register(createDebugPanel()), 'vscode-mode: sidebar panel debug')
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:751-781](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/src/client/index.ts#L751-L781)

官方侧栏编辑区、恢复及条件打开器。

<details>
<summary>查看原文（31行）</summary>

```text
    officialDisposer = ctx.effect(() => outcome, 'vscode-mode: official sidebar editor tab')
    // 编辑 Tab 展开/激活态按工作区落 localStorage（镜像层写穿 host，重启/换端口后仍在）：
    // 冷启动据此自动回到上次的编辑 Tab；官方 openTab 幂等，已激活时不重复调用。
    setEditorTabScope(() => {
      const scope = readSessionScope(ctx)
      return workspaceScopeOf(scope.cwd, scope.sessionId)
    })
    const restoreActiveTab = (): void => {
      const saved = readSavedTab()
      const active = isEditorTabActive()
      reportUiStateEvent('编辑 Tab 恢复：本地存档=' + String(saved) + '、当前激活=' + String(active))
      if (!active && saved) markEditorActive(true)
      restoreEditorTab(official.service, schedule)
    }
    restoreActiveTab()
    // 换 origin 时本地 localStorage 为空：镜像回填完成后重判一次，迟到的回填同样能恢复编辑 Tab
    ctx.effect(() => onUiStateReady(restoreActiveTab), 'vscode-mode: editor tab state hydration')
    // 官方打开器（下拉「官方侧边栏」选项，动态出现；openResource 能力缺失时跳过）+ 按当前设置同步 file 地址认领
    if (typeof official.service.openResource === 'function') {
      ctx.effect(() => registry.register(officialSidebarOpener(official.service)), 'vscode-mode: official sidebar opener')
      // 原生打开 handler：文件树 openFile 命中 nativeOpenExts 时经 openResource 落官方渲染器
      //（claim 的 canOpen 同步让位该范围，否则地址又被认领转发回本插件）；形态撤下时解绑
      ctx.effect(() => {
        setNativeOpenHandler((path) => {
          const scope = readSessionScope(ctx)
          if (!scope.sessionId) return false
          official.service.openResource?.(buildFileAddress(path, scope.sessionId))
          return typeof official.service.openResource === 'function'
        })
        return () => setNativeOpenHandler(null)
      }, 'vscode-mode: native open handler')
```

</details>

**依据 4 · 源码核查**：[src/reviewRpc.ts:300-334](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/src/reviewRpc.ts#L300-L334)

实际分发审查决定。

<details>
<summary>查看原文（35行）</summary>

```text
    'edrv.review.decide': async (args) => {
      // Keep 只写共享审查库（CAS + operationId 幂等 + WAL），冷端也放行；
      // Undo 与待审判定依赖本端会话内容或本地待审库，冷端返回可读原因而不是 500。
      try {
        const scope = await scopeOf(args.sessionId)
        if (args.id.startsWith(PENDING_PREFIX)) {
          if (!scope.live) return { ok: false, error: PENDING_NEEDS_LIVE }
          // 待审条目走累计基线：Keep 零写盘，Revert 写回并读回校验
          const result = await applyDecide(ctx.get('fs'), scope.cwd, {
            sessionId: args.sessionId,
            id: args.id.slice(PENDING_PREFIX.length),
            revision: args.revision,
            operationId: args.operationId,
            decision: args.decision,
            scope: args.scope === 'hunk' ? 'block' : 'file',
            ...(args.blockId === undefined ? {} : { blockId: args.blockId }),
          }, undefined, policyOf(ctx, sessionOf(ctx, args.sessionId)))
          if (!result.ok) return { ok: false, error: result.reason }
          return { ok: true, revision: result.flags.revision }
        }

        if (args.decision === 'rejected') {
          if (!scope.live) return { ok: false, error: UNDO_NEEDS_LIVE }
          const result = await undoReview(ctx, sessionOf(ctx, args.sessionId), scope.cwd, args)
          return { ok: true, ...result }
        }

        const result = decideReview(scope.cwd, args)
        if (!scope.live) log.info(`[review] 冷端 Keep 官方记录 ${args.id}`)
        return { ok: true, ...result }
      } catch (error) {
        // Guard failures are review results, not transport failures: preserve their reason.
        const message = error instanceof Error ? error.message : String(error)
        log.warn(`[review] decide 失败 id=${args.id} decision=${args.decision}: ${message}`)
        return { ok: false, error: message }
```

</details>

#### 缺口

- 缺开发者或同任务用时对照。
  **影响**：工作区及会话上下文收拢的价值可解释，节时距离待实测。
  **进一步探讨**：在同一项目文件对照外部 Git 与同屏审查。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 审查来源、宿主能力与原始证据怎样接起来？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

根包经 Cordis 加载宿主和 Web 产物。宿主装配模型、文件和会话服务，注册 RPC 及审查采集。RPC 入口依赖宿主 connection.requestRejection，缺少或抛错时拒绝请求，未放行的请求到不了业务处理器。客户端功能存在也不能保证目标宿主具备该接口。官方审查路径在工具周围尝试读前后文件；同一路径出现重入、前后链不连贯或总大小超预算时使证据失效，且采集异常不会阻断原工具。收到 workspace/changes 事件才按会话与序号冻结，随后与官方 diff 一致的字节链才入库。兼容逐工具采集另外由 tools/result 触发，仅认特定工具和结果，远程写关联镜像又有自己的限制。任意 shell、外部编辑和旧历史的变更不能假定被该条源码捕获。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:96-109](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/package.json#L96-L109)

包导出和 profile 挂载。

<details>
<summary>查看原文（14行）</summary>

```text
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./locale/*.json": "./locale/*.json",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  }
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:35-37](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/cordis.patch.yml#L35-L37)

真实插入插件。

```text
- insert:
    - id: dsh-vscode-mode
      name: 'dsh-vscode-mode'
```

**依据 3 · 源码核查**：[src/index.ts:74-108](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/src/index.ts#L74-L108)

装配证据和逐工具结果监听，清理资源。

<details>
<summary>查看原文（35行）</summary>

```text
function attachRuntime(ctx: Ctx, runtime: Runtime): void {
  const evidence = installEvidence(ctx)
  const stopCapture = installCapture(ctx, (cwd, snapshot) => { evidence.persist(cwd, snapshot); return true })
  // 待审累计基线：只有写后内容确实变化才落库，异常一律不打断用户工具调用
  const pending = installPending(ctx, (write) => {
    try { trackPendingCover(write.cwd, write.path, true, write.sessionId) } catch { /* 内存登记失败不阻断采集 */ }
    try { recordWrite(write) } catch (error) { log.warn('待审差异落库失败：' + String(error)) }
  })
  /** @author ddj 2026年09月28号 @param exec Tool execution. @param result Tool result. */
  function onResult(exec: unknown, result: unknown): void {
    void captureToolResult(ctx, runtime.registry, exec, result)
  }
  /** @author ddj 2026年09月28号 @param session Disposed session. */
  function onDisposed(session: { id?: unknown }): void {
    const cwd = cwdOf(session)
    if (cwd) {
      runtime.registry.delete(cwd)
      runtime.searcher.dispose(cwd)
      runtime.contentSearcher.dispose(cwd)
      disposeIndex(cwd)
    }
    if (typeof session.id === 'string') runtime.lspRpc.disposeSession(session.id)
  }
  /** @author ddj 2026年09月28号 Release every manager even if another cleanup rejects. */
  async function cleanup(): Promise<void> {
    await stopCapture()
    evidence.dispose()
    pending.dispose()
    runtime.fileVersions.dispose()
    closeArchiveDbs()
    disposeAllServers()
    const tasks = [() => runtime.lspManager.disposeAll(), () => runtime.svnRpc.dispose(), () => runtime.dapRpc.dispose()]
    await Promise.allSettled(tasks.map((run) => Promise.resolve().then(run)))
  }
  ctx.on('tools/result', onResult)
```

</details>

**依据 4 · 源码核查**：[src/index.ts:132-159](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/src/index.ts#L132-L159)

Host apply 真实注册模块与 RPC。

<details>
<summary>查看原文（28行）</summary>

```text
export async function apply(ctx: Ctx, config?: unknown): Promise<void> {
  bindHostLog(ctx)
  const runtime = createRuntime(ctx, config)
  const warnings: string[] = []
  attachRuntime(ctx, runtime)
  installContent(ctx)
  /** @author ddj 2026年09月28号 @param method RPC name. @param args Typed request. @returns RPC result. */
  function dispatch<M extends RpcMethod>(method: M, args: RpcRequestMap[M]) {
    const { registry, searcher, contentSearcher, lspRpc, aiRpc, fileVersions, svnRpc, dapRpc } = runtime
    return handleRpc(ctx, registry, method, args, searcher, contentSearcher, lspRpc.handlers,
      aiRpc.handlers, fileVersions, svnRpc.handlers as Partial<RpcHandlerMap>, dapRpc.handlers)
  }
  /** @author ddj 2026年09月28号 @param warning Startup compatibility diagnostic. */
  function noteWarning(warning: string): void { warnings.push(warning) }
  /** @author ddj 2026年09月28号 @returns Private inbox disposer, or a reported disabled capability. */
  async function mountInbox(): Promise<() => void> {
    try { return await startOpenInbox(ctx) } catch (error) {
      noteWarning('外部打开通道未启用：' + String(error))
      return () => {}
    }
  }
  registerRoutes(ctx, config, dispatch, noteWarning)
  installIsolation(ctx)
  await installMcpRuntime(ctx)
  /** @author ddj 2026年09月28号 @param args Session-bound plan. @returns Validated inbox result. */
  function submitPlan(args: RpcRequestMap['svn.aiPlanSubmit']) { return dispatch('svn.aiPlanSubmit', args) }
  await installPlanTool(ctx, submitPlan)
  ctx.effect(mountInbox, 'vscode-mode:open-inbox')
```

</details>

**依据 5 · 源码核查**：[src/routes.ts:142-162](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/src/routes.ts#L142-L162)

先鉴权再把请求交给业务。

<details>
<summary>查看原文（21行）</summary>

```text
function mountRoute(ctx: Ctx, route: PluginRoute, warning?: (text: string) => void): void {
  /** @author ddj 2026年09月28号 @param req Original HTTP request. @param res HTTP response. */
  async function guarded(req: IncomingMessage, res: ServerResponse): Promise<void> {
    if (!admitRoute(ctx, req, res, route.methods)) return
    try { await route.handler(req, res) } catch {
      if (!res.headersSent) replyJson(res, 500, { ok: false, error: 'Plugin request failed' })
      else res.end()
    }
  }
  /** @author ddj 2026年09月28号 @returns Route disposer, or undefined on a registration conflict. */
  function install(): (() => void) | undefined {
    try {
      const dispose = ctx.get('webServer').register({ kind: route.kind, path: route.path, handler: guarded })
      noteOwnRoute(route.kind, route.path)
      return dispose
    } catch (error) {
      warning?.('兼容性：' + route.path + ' 注册失败（' + String(error) + '）')
      return undefined
    }
  }
  ctx.effect(install, 'edrv: ' + route.path)
```

</details>

**依据 6 · 源码核查**：[src/httpGuard.ts:34-51](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/src/httpGuard.ts#L34-L51)

宿主认证拒绝、缺服务及方法边界。

<details>
<summary>查看原文（18行）</summary>

```text
export function admitRoute(ctx: Ctx, req: IncomingMessage, res: ServerResponse, methods: string[]): boolean {
  let rejection: number | undefined = 503
  try {
    const connection = ctx.get('connection')
    if (typeof connection?.requestRejection === 'function') rejection = connection.requestRejection(req)
  } catch { /* A missing or failed authentication service must not admit the request. */ }
  if (rejection !== undefined) {
    const status = rejection === 401 || rejection === 403 ? rejection : 503
    replyJson(res, status, { ok: false, error: status === 503 ? 'Host authentication service unavailable' : 'Host authentication rejected this request' })
    return false
  }
  if (!methods.includes(req.method ?? '')) {
    res.setHeader('allow', methods.join(', '))
    replyJson(res, 405, { ok: false, error: 'Method not allowed' })
    return false
  }
  return true
}
```

</details>

**依据 7 · 源码核查**：[src/reviewCapture.ts:48-79](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/src/reviewCapture.ts#L48-L79)

进入工具前取证，完成后采样。

<details>
<summary>查看原文（32行）</summary>

```text
  async function aroundTool(exec: any, next: () => Promise<any>): Promise<any> {
    const session = exec.agent?.session
    if (stopped || !session?.id) return next()
    const captures: Array<{ fs: any; target: any; chain: ByteChain }> = []
    try {
      const cwd = cwdOfSession(ctx, session)
      const fs = ctx.get('fs')
      const paths = await toolTargets(exec)
      for (const path of paths) {
        try {
          const capture = await prepareRaw(fs, session.id, cwd ?? undefined, path, exec.signal)
          if (capture) captures.push(capture)
        } catch { /* A failed target never prevents independent targets. */ }
      }
    } catch { /* Optional parser absence must not fail the original tool. */ }
    try { return await next() }
    finally {
      for (const capture of captures) {
        try {
          const after = await readRaw(capture.fs, capture.target, exec.signal)
          if (!stopped && !disposed.has(session.id)) {
            capture.chain.after = after
            if (footprint() > 32 * 1024 * 1024) {
              capture.chain.invalid = true
              capture.chain.before = rawReviewFile(null); capture.chain.after = rawReviewFile(null)
            }
          }
        } catch { capture.chain.invalid = true }
        capture.chain.busy = false
      }
    }
  }
```

</details>

**依据 8 · 源码核查**：[src/reviewCapture.ts:91-137](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/src/reviewCapture.ts#L91-L137)

链冲突、预算、事件冻结及原件保存。

<details>
<summary>查看原文（47行）</summary>

```text
    if (chain?.busy) { chain.invalid = true; return null }
    const empty = rawReviewFile(null)
    if (!chain) {
      chain = { before: empty, after: empty, busy: true, invalid: false }
      files.set(identity, chain)
      try { chain.before = await readRaw(fs, target, signal); chain.after = chain.before }
      catch (error) { chain.invalid = true; chain.busy = false; throw error }
    } else {
      chain.busy = true
      try {
        const before = await readRaw(fs, target, signal)
        if (chain.after.hash !== before.hash) chain.invalid = true
      } catch (error) { chain.invalid = true; chain.busy = false; throw error }
    }
    if (stopped || disposed.has(sessionId) || footprint() > 32 * 1024 * 1024) {
      chain.invalid = true; chain.busy = false; files.delete(identity); return null
    }
    return { fs, target, chain }
  }

  /** @private @author ddj 2026年10月27号 @param session Source session. @param event Published official turn. Freezes the chain before the next turn can mutate it. */
  function onEvent(session: any, event: any): void {
    if (stopped || event.type !== 'workspace/changes') return
    const files = chains.get(session.id)
    chains.delete(session.id)
    if (!files || staged.size >= 128) return
    staged.set(JSON.stringify([session.id, event.seq]), structuredClone(files))
  }

  /** @public @author ddj 2026年10月27号 @param cwd Official workspace. @param snapshot Committed official facts. Persists only independently validated, exact-correspondence byte chains. */
  function persist(cwd: string, snapshot: ReviewSnapshot): void {
    const key = JSON.stringify([snapshot.sessionId, snapshot.seq])
    const files = staged.get(key)
    staged.delete(key)
    if (!files || stopped) return
    const db = reviewDb(cwd)
    for (const file of snapshot.files) {
      const chain = files.get(file.identity)
      if (!chain || chain.invalid || chain.busy) continue
      try {
        const evidence = { before: chain.before, after: chain.after }
        evidenceBlocks(file.diff, evidence)
        db.prepare(`INSERT OR IGNORE INTO review_evidence(file_id,payload)
          SELECT id,? FROM review_files WHERE session_id=? AND turn=? AND seq=? AND identity=?`)
          .run(JSON.stringify(evidence), snapshot.sessionId, snapshot.turn, snapshot.seq, file.identity)
      } catch (error) { log.warn('官方回滚证据不可用：' + String(error)) }
    }
```

</details>

**依据 9 · 源码核查**：[src/capture.ts:271-289](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/src/capture.ts#L271-L289)

兼容工具结果过滤与记录。

<details>
<summary>查看原文（19行）</summary>

```text
export async function captureToolResult(ctx: Ctx, registry: Registry, exec: any, result: any): Promise<void> {
  const session: Session | undefined = exec?.agent?.session
  if (!session || !isCapturable(exec?.name)) return
  if (result?.isError) return
  // remote_ssh_write 只依赖参数与 isError（其 result.value 形状不受本插件约束）
  if (exec.name !== 'remote_ssh_write' && !result?.value) return
  try {
    const cwd = cwdOfSession(ctx, session)
    if (!cwd) return
    const args = ((exec.arguments || {}) as Record<string, unknown>)
    const record = exec.name === 'remote_ssh_write'
      ? await buildRemoteRecord(cwd, exec as CaptureExec, args)
      : buildLocalRecord(exec as CaptureExec, args, result as CaptureResult)
    if (!record) return
    await persistRecord(ctx, registry, session, cwd, record)
    // agent 写盘后目录树可能变化（新建/删除文件/目录）：父目录+祖先进失效，后台自愈。
    invalidateIndex(ctx, cwd, record.path)
  } catch (error) {
    log.error('capture failed: ' + String(error))
```

</details>

#### 缺口

- 未测固定宿主的接口、字节数与事件兼容。
  **影响**：不能把包启动或作者曾运行当成当前活动覆盖。
  **进一步探讨**：在精确宿主检查一个支持工具和一个故意不支持的写入。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Keep 和 Undo 分别改动什么？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

官方 Keep 只提交审查数据库决定；冷端符合工作区与记录约束也可走这条路径。官方 Undo 则要求本端活跃会话，并对目标文件与审查条目做多重检查。它按工作区与路径串行，用 operationId 阻止同标识换请求，要求当前审查序号、修订与 pending 条件匹配。当前内容需匹配原字节证据反推的预期哈希，后续编辑会被拒绝。写入之前把期望前后哈希记为 prepared，再走 provider 的 replaceIfVersion 和会话沙箱策略，写后读回。重试若磁盘已是写后值即可结案，既不是写前也不是写后时拒绝再次回写。缺原始证据、缺版本或不具原子新建删除条件时，官方 Undo 不强行执行。兼容累计基线走独立路径，仍要活跃会话，按 stableRead 和版本执行替换或受控删除，再重读。两种路径和批量操作均不能被当作通用 Git 回滚。

#### 证据与依据

**依据 1 · 源码核查**：[src/reviewRpc.ts:300-329](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/src/reviewRpc.ts#L300-L329)

确定官方与累计两条路由，冷端写源文件被拒。

<details>
<summary>查看原文（30行）</summary>

```text
    'edrv.review.decide': async (args) => {
      // Keep 只写共享审查库（CAS + operationId 幂等 + WAL），冷端也放行；
      // Undo 与待审判定依赖本端会话内容或本地待审库，冷端返回可读原因而不是 500。
      try {
        const scope = await scopeOf(args.sessionId)
        if (args.id.startsWith(PENDING_PREFIX)) {
          if (!scope.live) return { ok: false, error: PENDING_NEEDS_LIVE }
          // 待审条目走累计基线：Keep 零写盘，Revert 写回并读回校验
          const result = await applyDecide(ctx.get('fs'), scope.cwd, {
            sessionId: args.sessionId,
            id: args.id.slice(PENDING_PREFIX.length),
            revision: args.revision,
            operationId: args.operationId,
            decision: args.decision,
            scope: args.scope === 'hunk' ? 'block' : 'file',
            ...(args.blockId === undefined ? {} : { blockId: args.blockId }),
          }, undefined, policyOf(ctx, sessionOf(ctx, args.sessionId)))
          if (!result.ok) return { ok: false, error: result.reason }
          return { ok: true, revision: result.flags.revision }
        }

        if (args.decision === 'rejected') {
          if (!scope.live) return { ok: false, error: UNDO_NEEDS_LIVE }
          const result = await undoReview(ctx, sessionOf(ctx, args.sessionId), scope.cwd, args)
          return { ok: true, ...result }
        }

        const result = decideReview(scope.cwd, args)
        if (!scope.live) log.info(`[review] 冷端 Keep 官方记录 ${args.id}`)
        return { ok: true, ...result }
```

</details>

**依据 2 · 源码核查**：[src/reviewUndo.ts:13-51](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/src/reviewUndo.ts#L13-L51)

序列化、操作 ID、版本与重试检查。

<details>
<summary>查看原文（39行）</summary>

```text
/** @public @author ddj 2026年10月27号 @param ctx Host capability. @param session Authenticated caller. @param cwd Workspace. @param request Frozen file/block version. @returns Durable decision; retries reconcile disk hashes and never blindly repeat a write. @throws Missing evidence, stale state, policy or uncertain write failure. */
export async function undoReview(ctx: Ctx, session: Session, cwd: string, request: DecideReview): Promise<{ revision: number }> {
  const detail = reviewDetail(cwd, request.id)
  const key = JSON.stringify([cwd, detail?.item.currentPath ?? request.id])
  const prior = writes.get(key) ?? Promise.resolve()
  const operation = prior.catch(() => undefined).then(() => runUndo(ctx, session, cwd, request))
  writes.set(key, operation)
  try { return await operation }
  finally { if (writes.get(key) === operation) writes.delete(key) }
}

/** @private @author ddj 2026年10月27号 @param ctx Host. @param session Caller. @param cwd Workspace. @param request Frozen decision. @returns Serialized guarded mutation and journal reconciliation. @throws Conflicting bytes or decisions. */
async function runUndo(ctx: Ctx, session: Session, cwd: string, request: DecideReview): Promise<{ revision: number }> {
  const db = reviewDb(cwd)
  const encoded = JSON.stringify(request)
  if (!request.operationId || request.operationId.length > 128) throw new Error('operationId 无效')
  const prior = db.prepare('SELECT * FROM review_ops WHERE operation_id=?').get(request.operationId) as OperationRow | undefined
  if (prior && prior.request !== encoded) throw new Error('operationId 已用于其他请求')
  if (prior?.state === 'committed') return JSON.parse(prior.result!)
  const detail = reviewDetail(cwd, request.id)
  if (!detail || !detail.item.current || detail.item.seq !== request.seq || detail.item.revision !== request.revision
    || detail.item.decision !== 'pending') throw new Error('审查版本冲突，请刷新后重试')
  const fs = ctx.get('fs')
  if (!fs?.readBytes || !fs?.writeText || !fs?.stat) throw new Error('后端缺少受控回滚能力')
  const target = await resolveTarget(ctx, session, detail.item.currentPath)
  const info = await fs.stat(target)
  if (!info || info.type !== 'file' || !info.version) throw new Error('文件不存在或缺少版本守卫，不能安全 Undo')
  const bytes = await fs.readBytes(target, undefined, 8 * 1024 * 1024)
  const current = rawReviewFile(bytes)
  const observed = await fs.stat(target)
  if (observed?.version !== info.version) throw new Error('文件在回滚读取期间变化，未修改文件')
  if (prior) {
    const journal = JSON.parse(prior.evidence) as UndoJournal
    if (current.hash === journal.after) return finishUndo(cwd, request)
    if (current.hash !== journal.before) throw new Error('上次 Undo 状态不确定：磁盘既非写前也非写后，禁止重复执行')
  }
  const unresolved = db.prepare("SELECT operation_id FROM review_ops WHERE state='prepared' AND json_extract(request,'$.id')=? AND operation_id<>?")
    .get(request.id, request.operationId)
  if (unresolved) throw new Error('存在未核对的 Undo，请使用原操作重试，不能创建另一项写入')
```

</details>

**依据 3 · 源码核查**：[src/reviewUndo.ts:52-77](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/src/reviewUndo.ts#L52-L77)

证据、哈希、写入意图和写后回读。

<details>
<summary>查看原文（26行）</summary>

```text
  const row = db.prepare('SELECT payload FROM review_evidence WHERE file_id=?').get(request.id) as { payload: string } | undefined
  if (!row) throw new Error('该历史记录缺少可信原始字节证据，不能 Undo；差异仍可展示和 Keep')
  const evidence = JSON.parse(row.payload) as ReviewEvidence
  const segments = evidenceBlocks(detail.diff, evidence)
  const texts = evidenceText(evidence)
  if (!evidence.before.present || !evidence.after.present) throw new Error('当前后端未提供受控原子删除/重建能力')
  const selected = detail.blocks.filter((block) => block.decision === 'pending' && (request.scope !== 'hunk' || block.id === request.blockId))
  if (!selected.length) throw new Error('差异块不存在或已处理')
  // Build the expected disk version by removing only previously rejected blocks.
  const rejected = new Set(detail.blocks.filter((block) => block.decision === 'rejected').map((block) => block.id))
  const expected = reverseBlocks(texts.after, segments, rejected)
  if (rawReviewFile(Buffer.from(expected)).hash !== current.hash) throw new Error('当前文件已被后续编辑，版本与回滚证据冲突，未修改文件')
  const undo = new Set([...rejected, ...selected.map((block) => block.id)])
  const next = reverseBlocks(texts.after, segments, undo)
  const journal = { before: current.hash, after: rawReviewFile(Buffer.from(next)).hash }
  const latest = reviewDetail(cwd, request.id)
  if (!latest?.item.current || latest.item.revision !== request.revision || latest.item.decision !== 'pending') {
    throw new Error('审查版本在回滚校验期间变化，未修改文件')
  }
  db.prepare("INSERT INTO review_ops VALUES(?,?,'prepared',NULL,?) ON CONFLICT(operation_id) DO NOTHING")
    .run(request.operationId, encoded, JSON.stringify(journal))
  // Provider checks the exact observation inside its atomic mutation critical section.
  await fs.writeText(target, next, { kind: 'replaceIfVersion', version: info.version }, undefined, policyOf(ctx, session))
  const written = rawReviewFile(await fs.readBytes(target, undefined, 8 * 1024 * 1024))
  if (written.hash !== journal.after) throw new Error('Undo 写后内容不确定，请保留原操作重试核对')
  return finishUndo(cwd, request)
```

</details>

**依据 4 · 源码核查**：[src/pending/store.ts:249-274](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/src/pending/store.ts#L249-L274)

累计基线受控替换和回读。

<details>
<summary>查看原文（26行）</summary>

```text
): (content: string | null) => Promise<WriteResult> {
  return async (content) => {
    let target: any
    try {
      target = await fs.resolve(identity, { cwd, signal })
    } catch {
      return { ok: false, reason: 'resolve-failed' }
    }
    const snapshot = await stableRead(fs, target, signal)
    if (!snapshot.ok) return snapshot
    // 缺失仅允许撤销/重做重建；原子 createIfAbsent 防止检查后被其他写入抢占。
    const recreate = allowCreate && snapshot.content === null
    if (!recreate && snapshot.content !== expected) return { ok: false, reason: 'diverged' }
    if (snapshot.content === null && !recreate) return { ok: false, reason: 'missing' }
    const intent = recreate
      ? { kind: 'createIfAbsent' }
      : { kind: 'replaceIfVersion', version: snapshot.version }
    try {
      const written = await fs.writeText(target, content ?? '', intent, signal, policy)
      const readBack = await readText(fs, target)
      if (content !== readBack) return { ok: false, reason: 'read-back-mismatch' }
      if (content === null && readBack !== null) return { ok: false, reason: 'delete-failed' }
      void written
      return { ok: true, content }
    } catch (error) {
      return { ok: false, reason: reasonOf(error) }
```

</details>

**依据 5 · 源码核查**：[src/pending/store.ts:546-561](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/src/pending/store.ts#L546-L561)

新增文件回退在支持的 provider 上受控删除。

<details>
<summary>查看原文（16行）</summary>

```text
async function deleteTarget(
  fs: any, cwd: string, identity: string, expected: string, signal?: AbortSignal, policy?: unknown,
): Promise<WriteResult> {
  if (typeof fs.deleteFile !== 'function') return { ok: false, reason: 'delete-unavailable' }
  try {
    const target = await fs.resolve(identity, { cwd, signal })
    const snapshot = await stableRead(fs, target, signal)
    if (!snapshot.ok) return snapshot
    if (snapshot.content === null) return { ok: true, content: null }
    if (snapshot.content !== expected) return { ok: false, reason: 'diverged' }

    await fs.deleteFile(target, { version: snapshot.version }, signal, policy)
    const after = await fs.stat(target, signal)
    return after ? { ok: false, reason: 'delete-failed' } : { ok: true, content: null }
  } catch (error) {
    return { ok: false, reason: reasonOf(error) }
```

</details>

**依据 6 · 源码核查**：[src/store.ts:32-36](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/src/store.ts#L32-L36)

存在时附加会话沙箱策略。

```text
export function policyOf(ctx: Ctx, session: Session | undefined): any {
  const svc = ctx.get('sandboxPolicy')
  if (!svc) return undefined
  return session ? svc.resolve({ session }) : svc.resolve()
}
```

#### 缺口

- 未模拟进程退出、并发与 provider 原子性。
  **影响**：只能解释代码拒绝条件，真实中断恢复待验证。
  **进一步探讨**：在独立工作区引入外部编辑、对相同操作标识重连并核对文件。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用并控制失败恢复成本？

**研究主题**：采用判断、效果与总成本、依赖、兼容与流程

#### 完整回答

给临时 Git 工作区准备一个含两处已知修改的文本文件，通过一个低权限本地会话生成编辑。先确认宿主插件和画面、实际外部差异、会话来源。Keep 一块后独立查看文件，Undo 第二块后重新比较磁盘和审查回执。再用外部编辑制造冲突，若出现缺证据、后端不提供守卫、读回不一致或实际内容无法按预期验证，停止使用 Undo，转回提交、备份与编辑器。初次要核对 DSH 与 Node 版本、权限和工作区；持续有审查原件／SQLite 的存储开销，以及切换、核对与修复时间，当前均未量化。清理与卸载不必然删除工作区产生的持久化证据，需对照用途和路径确认是否保留。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:31-44](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/package.json#L31-L44)

宿主范围和发布目录声明。

<details>
<summary>查看原文（14行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.1.0-rc.1 <0.3.0-0"
  },
  "packageManager": "pnpm@11.3.0",
  "main": "./lib/index.js",
  "files": [
    "lib",
    "assets",
    "locale",
    "skills",
    "src",
    "unity",
    "cordis.patch.yml"
```

</details>

**依据 2 · 源码核查**：[src/reviewCapture.ts:120-137](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/src/reviewCapture.ts#L120-L137)

符合约束的原始字节入库。

<details>
<summary>查看原文（18行）</summary>

```text
  /** @public @author ddj 2026年10月27号 @param cwd Official workspace. @param snapshot Committed official facts. Persists only independently validated, exact-correspondence byte chains. */
  function persist(cwd: string, snapshot: ReviewSnapshot): void {
    const key = JSON.stringify([snapshot.sessionId, snapshot.seq])
    const files = staged.get(key)
    staged.delete(key)
    if (!files || stopped) return
    const db = reviewDb(cwd)
    for (const file of snapshot.files) {
      const chain = files.get(file.identity)
      if (!chain || chain.invalid || chain.busy) continue
      try {
        const evidence = { before: chain.before, after: chain.after }
        evidenceBlocks(file.diff, evidence)
        db.prepare(`INSERT OR IGNORE INTO review_evidence(file_id,payload)
          SELECT id,? FROM review_files WHERE session_id=? AND turn=? AND seq=? AND identity=?`)
          .run(JSON.stringify(evidence), snapshot.sessionId, snapshot.turn, snapshot.seq, file.identity)
      } catch (error) { log.warn('官方回滚证据不可用：' + String(error)) }
    }
```

</details>

**依据 3 · 源码核查**：[src/reviewDb.ts:48-62](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/src/reviewDb.ts#L48-L62)

持久的审查证据表并包含迁移备份。

<details>
<summary>查看原文（15行）</summary>

```text
/** @private @author ddj 2026年10月27号 @param cwd Workspace backup identity. @param db Open schema4 database. Extends the official-review sub-schema without changing legacy archive schema. @throws Migration failure, leaving prior decisions intact. */
function migrateBlocks(cwd: string, db: DatabaseSync): void {
  if (db.prepare("SELECT value FROM metadata WHERE name='review_schema'").get()) return
  const backup = archiveDbFile(cwd) + '.before-review-blocks.bak'
  if (!existsSync(backup)) db.exec(`VACUUM INTO '${backup.replace(/'/g, "''")}'`)

  db.exec('BEGIN IMMEDIATE')
  try {
    db.exec(`CREATE TABLE review_blocks (file_id TEXT NOT NULL, block_id TEXT NOT NULL,
      decision TEXT NOT NULL, PRIMARY KEY(file_id,block_id));
      CREATE TABLE review_evidence (file_id TEXT PRIMARY KEY, payload TEXT NOT NULL);
      INSERT INTO metadata(name,value) VALUES('review_schema','2');`)
    const files = db.prepare('SELECT id,diff,decision FROM review_files').all() as Row[]
    for (const file of files) seedBlocks(db, String(file.id), JSON.parse(String(file.diff)), String(file.decision))
    db.exec('COMMIT')
```

</details>

**依据 4 · 源码核查**：[src/reviewUndo.ts:52-77](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/src/reviewUndo.ts#L52-L77)

当信息不足或读回不确定时拒绝。

<details>
<summary>查看原文（26行）</summary>

```text
  const row = db.prepare('SELECT payload FROM review_evidence WHERE file_id=?').get(request.id) as { payload: string } | undefined
  if (!row) throw new Error('该历史记录缺少可信原始字节证据，不能 Undo；差异仍可展示和 Keep')
  const evidence = JSON.parse(row.payload) as ReviewEvidence
  const segments = evidenceBlocks(detail.diff, evidence)
  const texts = evidenceText(evidence)
  if (!evidence.before.present || !evidence.after.present) throw new Error('当前后端未提供受控原子删除/重建能力')
  const selected = detail.blocks.filter((block) => block.decision === 'pending' && (request.scope !== 'hunk' || block.id === request.blockId))
  if (!selected.length) throw new Error('差异块不存在或已处理')
  // Build the expected disk version by removing only previously rejected blocks.
  const rejected = new Set(detail.blocks.filter((block) => block.decision === 'rejected').map((block) => block.id))
  const expected = reverseBlocks(texts.after, segments, rejected)
  if (rawReviewFile(Buffer.from(expected)).hash !== current.hash) throw new Error('当前文件已被后续编辑，版本与回滚证据冲突，未修改文件')
  const undo = new Set([...rejected, ...selected.map((block) => block.id)])
  const next = reverseBlocks(texts.after, segments, undo)
  const journal = { before: current.hash, after: rawReviewFile(Buffer.from(next)).hash }
  const latest = reviewDetail(cwd, request.id)
  if (!latest?.item.current || latest.item.revision !== request.revision || latest.item.decision !== 'pending') {
    throw new Error('审查版本在回滚校验期间变化，未修改文件')
  }
  db.prepare("INSERT INTO review_ops VALUES(?,?,'prepared',NULL,?) ON CONFLICT(operation_id) DO NOTHING")
    .run(request.operationId, encoded, JSON.stringify(journal))
  // Provider checks the exact observation inside its atomic mutation critical section.
  await fs.writeText(target, next, { kind: 'replaceIfVersion', version: info.version }, undefined, policyOf(ctx, session))
  const written = rawReviewFile(await fs.readBytes(target, undefined, 8 * 1024 * 1024))
  if (written.hash !== journal.after) throw new Error('Undo 写后内容不确定，请保留原操作重试核对')
  return finishUndo(cwd, request)
```

</details>

**依据 5 · 源码核查**：[src/index.ts:97-106](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/src/index.ts#L97-L106)

关闭数据库及释放后台资源。

<details>
<summary>查看原文（10行）</summary>

```text
  /** @author ddj 2026年09月28号 Release every manager even if another cleanup rejects. */
  async function cleanup(): Promise<void> {
    await stopCapture()
    evidence.dispose()
    pending.dispose()
    runtime.fileVersions.dispose()
    closeArchiveDbs()
    disposeAllServers()
    const tasks = [() => runtime.lspManager.disposeAll(), () => runtime.svnRpc.dispose(), () => runtime.dapRpc.dispose()]
    await Promise.allSettled(tasks.map((run) => Promise.resolve().then(run)))
```

</details>

#### 缺口

- 真实宿主恢复、存储及人工耗用未知。
  **影响**：只支持在可独立撤回的文本样本上有条件试用。
  **进一步探讨**：记录对照修改、异常消息、文件哈希和退出保留状态。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 冲突解释能否减少误覆盖？

**研究主题**：新假设与验证

#### 完整回答

假设在审查界面同时显示操作状态、收集的版本证据与当前字节冲突，并建议保留原操作标识单独核对，会减少用户为求界面结案而重复撤销或覆写。对照同批两个文本文件，分别安排证据缺失、后续外部修改、写入后回执丢失三类样例。两组用现有提示和新增解释，最终都以独立文件哈希、审查库状态和实际覆盖次数对照。只有错误写入下降且失败恢复时间可接受才保留方案；不据现有源码声称已通过。

#### 证据与依据

**依据 1 · 源码核查**：[src/reviewUndo.ts:25-51](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/src/reviewUndo.ts#L25-L51)

当前已有状态分类和操作重试依据。

<details>
<summary>查看原文（27行）</summary>

```text
async function runUndo(ctx: Ctx, session: Session, cwd: string, request: DecideReview): Promise<{ revision: number }> {
  const db = reviewDb(cwd)
  const encoded = JSON.stringify(request)
  if (!request.operationId || request.operationId.length > 128) throw new Error('operationId 无效')
  const prior = db.prepare('SELECT * FROM review_ops WHERE operation_id=?').get(request.operationId) as OperationRow | undefined
  if (prior && prior.request !== encoded) throw new Error('operationId 已用于其他请求')
  if (prior?.state === 'committed') return JSON.parse(prior.result!)
  const detail = reviewDetail(cwd, request.id)
  if (!detail || !detail.item.current || detail.item.seq !== request.seq || detail.item.revision !== request.revision
    || detail.item.decision !== 'pending') throw new Error('审查版本冲突，请刷新后重试')
  const fs = ctx.get('fs')
  if (!fs?.readBytes || !fs?.writeText || !fs?.stat) throw new Error('后端缺少受控回滚能力')
  const target = await resolveTarget(ctx, session, detail.item.currentPath)
  const info = await fs.stat(target)
  if (!info || info.type !== 'file' || !info.version) throw new Error('文件不存在或缺少版本守卫，不能安全 Undo')
  const bytes = await fs.readBytes(target, undefined, 8 * 1024 * 1024)
  const current = rawReviewFile(bytes)
  const observed = await fs.stat(target)
  if (observed?.version !== info.version) throw new Error('文件在回滚读取期间变化，未修改文件')
  if (prior) {
    const journal = JSON.parse(prior.evidence) as UndoJournal
    if (current.hash === journal.after) return finishUndo(cwd, request)
    if (current.hash !== journal.before) throw new Error('上次 Undo 状态不确定：磁盘既非写前也非写后，禁止重复执行')
  }
  const unresolved = db.prepare("SELECT operation_id FROM review_ops WHERE state='prepared' AND json_extract(request,'$.id')=? AND operation_id<>?")
    .get(request.id, request.operationId)
  if (unresolved) throw new Error('存在未核对的 Undo，请使用原操作重试，不能创建另一项写入')
```

</details>

**依据 2 · 源码核查**：[src/reviewUndo.ts:52-77](https://github.com/Lenonss/DSH_VsCodeMode/blob/47b2129beec12c0b6240435c40d796deada4b50a/src/reviewUndo.ts#L52-L77)

区分缺证据、并发冲突与读回不明。

<details>
<summary>查看原文（26行）</summary>

```text
  const row = db.prepare('SELECT payload FROM review_evidence WHERE file_id=?').get(request.id) as { payload: string } | undefined
  if (!row) throw new Error('该历史记录缺少可信原始字节证据，不能 Undo；差异仍可展示和 Keep')
  const evidence = JSON.parse(row.payload) as ReviewEvidence
  const segments = evidenceBlocks(detail.diff, evidence)
  const texts = evidenceText(evidence)
  if (!evidence.before.present || !evidence.after.present) throw new Error('当前后端未提供受控原子删除/重建能力')
  const selected = detail.blocks.filter((block) => block.decision === 'pending' && (request.scope !== 'hunk' || block.id === request.blockId))
  if (!selected.length) throw new Error('差异块不存在或已处理')
  // Build the expected disk version by removing only previously rejected blocks.
  const rejected = new Set(detail.blocks.filter((block) => block.decision === 'rejected').map((block) => block.id))
  const expected = reverseBlocks(texts.after, segments, rejected)
  if (rawReviewFile(Buffer.from(expected)).hash !== current.hash) throw new Error('当前文件已被后续编辑，版本与回滚证据冲突，未修改文件')
  const undo = new Set([...rejected, ...selected.map((block) => block.id)])
  const next = reverseBlocks(texts.after, segments, undo)
  const journal = { before: current.hash, after: rawReviewFile(Buffer.from(next)).hash }
  const latest = reviewDetail(cwd, request.id)
  if (!latest?.item.current || latest.item.revision !== request.revision || latest.item.decision !== 'pending') {
    throw new Error('审查版本在回滚校验期间变化，未修改文件')
  }
  db.prepare("INSERT INTO review_ops VALUES(?,?,'prepared',NULL,?) ON CONFLICT(operation_id) DO NOTHING")
    .run(request.operationId, encoded, JSON.stringify(journal))
  // Provider checks the exact observation inside its atomic mutation critical section.
  await fs.writeText(target, next, { kind: 'replaceIfVersion', version: info.version }, undefined, policyOf(ctx, session))
  const written = rawReviewFile(await fs.readBytes(target, undefined, 8 * 1024 * 1024))
  if (written.hash !== journal.after) throw new Error('Undo 写后内容不确定，请保留原操作重试核对')
  return finishUndo(cwd, request)
```

</details>

#### 缺口

- 无用户对照数据。
  **影响**：是否有额外收益仍是设计假设。
  **进一步探讨**：以三类故障随机交替，记错误覆盖和修正时间。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
