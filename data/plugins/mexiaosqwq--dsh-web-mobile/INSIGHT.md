# dsh-web-mobile

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[ad8b8e9](https://github.com/mexiaosqwq/dsh-web-mobile/tree/ad8b8e98f827c282c4394537d8b93aaa326031d4)

<!-- BEGIN META -->
[![GitHub ★ 179](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=179&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/mexiaosqwq/dsh-web-mobile) [![npm 30d 8,079](https://img.shields.io/static/v1?label=npm+30d&message=8%2C079&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-web-mobile) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-web-mobile)
<!-- END META -->

> **功能**：为 DSH Web 提供触屏布局与交互适配，增加会话删除入口和宿主 JSON 压缩。

> **亮点**：[Q01](#research-q01) 针对输入、面板与滚动生命周期整理触屏动作。

> **主要限制**：[Q02](#research-q02) 删除作用于持久化会话，上游授权和部分失败决定可用边界。[Q03](#research-q03) 服务端压缩独立于触屏布局。

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
  - [Q01 · 触屏布局改了什么？](#detail-section-11)
  - [Q02 · 删除的授权与恢复边界是什么？](#detail-section-12)
  - [Q03 · 压缩和兼容如何验收？](#detail-section-13)
  - [Q04 · 怎样减少删除失败后的误操作？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在手机竖屏使用 DSH 会话、切换面板及输入的用户。

直接访问宿主 Web 布局，通过浏览器缩放或切换桌面处理窄屏任务。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 触屏 UI | 在移动设备中操作会话 | 依赖宿主页面结构 |
| JSON 压缩 | 减少部分响应字节 | 客户端需声明支持编码 |
| 删除 | 清理会话及日志 | 需要持久化及明确调用授权 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH Web | 宿主挂载需要 | 客户端与服务端入口 | 保留原 Web |
| 触屏设备 | 移动场景需要 | 验证窄屏和键盘 | 无法检验体验 |
| 持久化服务 | 会话删除需要 | 定位和移动日志 | 返回错误 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选择无重要会话的 profile | 确认入口只对授权客户端开放 |
| 验证 | 用户在手机切换并输入 | 对照原界面和宿主日志 |
| 退出 | 用户禁用测试包 | 检查样式及宿主服务恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 设备及宿主资源未知 | 准备隔离配置 | 未实测 |
| 持续 | 压缩 CPU 与流量取舍 | 维护宿主兼容 | 未测净收益 |
| 失败恢复 | 恢复日志成本未知 | 核对注销与残留 | 按失败阶段处理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 触屏布局 | 注入及热换清理 | 真实设备表现 |
| 压缩 | 按 JSON 和编码条件处理 | 端到端延迟 |
| 删除 | 持久化状态分阶段 | 实际授权隔离 |

> **思考**：[Q02](#research-q02) 删除作用于持久化会话，上游授权和部分失败决定可用边界。[Q03](#research-q03) 服务端压缩独立于触屏布局。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 针对输入、面板与滚动生命周期整理触屏动作。

[Q01](#research-q01) 样式和观察器随效果清理。[Q02](#research-q02) 删除阶段分别报告已发生的副作用。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 删除作用于持久化会话，上游授权和部分失败决定可用边界。[Q03](#research-q03) 服务端压缩独立于触屏布局。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先对照手机输入和切换，按 [Q02](#research-q02) 核对入口保护后再决定是否在可丢弃会话上验证删除。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持代表性客户端与宿主路径，设备、网络和宿主授权仍待验收。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/client/index.tsx、src/compress.ts、src/delete-session.ts、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本代表性客户端、响应和删除源码，未运行宿主、设备或网络。
- 下一步：用隔离 profile 验证手机、平板和鼠标端，核对路由认证、JSON 协商与失败恢复。

**分析版本**

- **仓库**：[mexiaosqwq/dsh-web-mobile](https://github.com/mexiaosqwq/dsh-web-mobile)
- **版本号**：3.2.3（[固定提交 ad8b8e9](https://github.com/mexiaosqwq/dsh-web-mobile/tree/ad8b8e98f827c282c4394537d8b93aaa326031d4)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 将后端失败阶段映射到正确的用户恢复动作。

用隔离 profile 验证手机、平板和鼠标端，核对路由认证、JSON 协商与失败恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 26 | 4413 | — | — | 123631 |
| .js | source | 5 | 15829 | 11247 | 4587 | — |
| .mjs | source | 37 | 9941 | 7509 | 1986 | — |
| .tsx | source | 4 | 813 | 493 | 252 | — |
| .ts | source | 69 | 19254 | 10071 | 8361 | — |
| .ts | test | 69 | 13255 | 9843 | 2386 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/mexiaosqwq/dsh-web-mobile/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 47](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=47&color=737b86&logo=github)](https://github.com/mexiaosqwq/dsh-web-mobile/issues?q=is%3Aissue+created%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z) [![近30天关闭 45](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=45&color=737b86&logo=github)](https://github.com/mexiaosqwq/dsh-web-mobile/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：移动界面改造带来的任务增量和宿主副作用分别是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 触屏布局改了什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

用手机竖屏访问 DSH Web 的用户需要在键盘弹出时仍能完成会话切换和发送。作者以底部面板、窄屏输入布局和安全区处理替代桌面布局。客户端实际挂载自己的样式，移除同名旧表，并在卸载前记录滚动位置、重挂后回填。面板退出复用同一动作，结构观察器及任务注册随插件清理。这比调浏览器缩放覆盖更多界面动作，但依赖宿主 DOM 和槽位，没有实际设备数据可支持流畅性或所有桌面无副作用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-23](https://github.com/mexiaosqwq/dsh-web-mobile/blob/ad8b8e98f827c282c4394537d8b93aaa326031d4/README.md#L17-L23)

作者说明窄屏目标和桌面定位

```text
**dsh-web-mobile** 是 DeepSeek Harness Web UI 的移动端适配插件——让 DSH 在手机竖屏下也能好好用：

- **弹窗变浮层**：设置、文件树、预览改成底部 sheet，触屏好点
- **状态栏避让**：刘海安全区、深/浅主题、双击缩放都处理
- **输入区不打架**：权限胶囊、模型名、切换菜单在窄屏下不重叠
- **长会话不卡流量**：宿主返回的大 JSON（会话历史等）自动 gzip/brotli 压缩，手机端加载明显提速
- **平板也管**：768–1023px 触屏设备限宽居中，≥1024px 触屏大平板的会话行 ⋯ 菜单仍带「删除会话」；桌面端（鼠标指针）任何宽度都是完全 no-op，窄窗口/系统缩放也不会误启移动 UI
```

**依据 2 · 源码核查**：[src/client/index.tsx:137-169](https://github.com/mexiaosqwq/dsh-web-mobile/blob/ad8b8e98f827c282c4394537d8b93aaa326031d4/src/client/index.tsx#L137-L169)

样式注入及热换清理

<details>
<summary>查看原文（33行）</summary>

```text
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-web-mobile: dictionaries')

  ctx.effect(() => {
    // 先清掉可能残留的同 id 样式表。
    // 2026-09-23：app 的 P8 自愈会把 client.js 换回上游版、页面里也随之挂着
    // **上游那份 CSS**；我们重新部署产物后，只 append 不清旧的话，页面里那份旧表
    // 仍然压在上面（实测：开关/权限图标/头部留白改完"看着没生效"）。
    // 本插件是原地热重载（不整页刷新），所以这一步必须自己保证"页面里的样式表
    // 就是当前产物里的这一份"。
    for (const stale of document.querySelectorAll('style[data-plugin-css="dsh-web-mobile/mobile.css"]')) {
      stale.remove()
    }
    const tag = document.createElement('style')
    tag.dataset.plugin = 'dsh-web-mobile'
    tag.dataset.pluginCss = 'dsh-web-mobile/mobile.css'
    tag.textContent = MOBILE_CSS
    document.head.appendChild(tag)
    // Keep this stylesheet last in <head> so its overrides win over the
    // host UI's own styles (some host rules also use !important).
    setTimeout(() => {
      if (tag.isConnected) document.head.appendChild(tag)
    }, 0)
    // 热换后的滚动回位（2026-10-07 店主：「聊到一半突然闪到最上面」）。
    // 宿主热换插件走 client-modules.replace()：tearDown → import → refresh，
    // 我们这张表在窗口里会**整个消失**，长会话的 content-visibility 估算与布局
    // 翻转会让 Chromium 把会话滚动区重锚到顶部。卸载前记下位置、重挂后回填。
    restoreConversationScroll()
    return () => {
      rememberConversationScroll()
      tag.remove()
    }
  }, 'dsh-web-mobile: styles')
```

</details>

**依据 3 · 源码核查**：[src/client/index.tsx:174-197](https://github.com/mexiaosqwq/dsh-web-mobile/blob/ad8b8e98f827c282c4394537d8b93aaa326031d4/src/client/index.tsx#L174-L197)

平板入口和观察器的生命周期

<details>
<summary>查看原文（24行）</summary>

```text
  // 宽屏触屏（平板 ≥1024）：只补一颗一键设置齿轮，布局仍交给宿主原生。
  installTabletQuickSettings(ctx)


  // Leaving a sidebar panel. The host's panels replace the main area and ship
  // no way back, so every exit route (system back, re-tapping the selected
  // panel row, the FAB) shares this one action.
  const panelExit = createPanelExit(ctx.layout)

  // Shared mobile infrastructure: frame marker ownership and the single
  // full-tree reconciler. Installed inside one effect so a plugin reload in
  // the same JS environment tears the whole reconciler down and rebuilds it.
  ctx.effect(() => {
    const stops = [
      installFrameController(),
      installReconciler(ctx),
      registerReconcileTasks(ctx, panelExit),
      // Last: stop the tasks before releasing the exit instance they drive.
      () => panelExit.dispose(),
    ]
    return () => {
      for (const stop of stops) stop()
    }
  }, 'dsh-web-mobile: reconciler infrastructure')
```

</details>

#### 缺口

- 未运行触屏或桌面测试
  **影响**：不能判断键盘、滚动和布局实际表现
  **进一步探讨**：在真实手机和平板对照原界面完成同任务

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 删除的授权与恢复边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

宿主挂载会话删除 POST 路由，带 Origin 时比较其 host，缺失或空值可通过该层。客户端确认属于交互控制，不能替代宿主鉴权，仍需检查服务暴露范围与调用权限。删除核心先核对会话路径与活动状态，必要时取消 Agent 并等空闲，旧宿主缺处置接口则返回冲突。注销与磁盘移动是分阶段行为，文件移动失败可能已停止和注销会话，部分改名的残留会报告给调用方。工作区脱离是尽力操作。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:87-99](https://github.com/mexiaosqwq/dsh-web-mobile/blob/ad8b8e98f827c282c4394537d8b93aaa326031d4/src/index.ts#L87-L99)

Origin 守卫的明确边界

<details>
<summary>查看原文（13行）</summary>

```text
/** Same-origin gate: a browser-supplied Origin header must name the same host
 * as the request itself. Missing/empty Origin = non-browser client = allowed.
 * No allowlist: localhost / 127.0.0.1 / LAN entries all work via host
 * equality, so same-origin browser POSTs (which always carry Origin) pass. */
function sameOrigin(req: IncomingMessage): boolean {
  const origin = req.headers.origin
  if (origin === undefined || origin === '') return true
  try {
    return new URL(origin).host === req.headers.host
  } catch {
    return false
  }
}
```

</details>

**依据 2 · 源码核查**：[src/index.ts:129-160](https://github.com/mexiaosqwq/dsh-web-mobile/blob/ad8b8e98f827c282c4394537d8b93aaa326031d4/src/index.ts#L129-L160)

宿主入口与请求检查

<details>
<summary>查看原文（32行）</summary>

```text
  ctx.inject(['webServer'], (webCtx) => {
    webCtx.effect(() => webCtx.webServer.register({
      kind: 'exact',
      path: '/api/mobile-nav.session.delete',
      handler: async (req, res) => {
        if (req.method !== 'POST') {
          respond(res, 405, { error: { code: 'method-not-allowed', message: 'POST required' } })
          return
        }
        if (!sameOrigin(req)) {
          respond(res, 403, { error: { code: 'cross-origin', message: 'cross-origin request rejected: Origin host does not match the request host' } })
          return
        }
        let body: DeleteSessionBody
        try {
          body = JSON.parse(await readBody(req)) as DeleteSessionBody
        } catch (error) {
          if (error instanceof PayloadTooLargeError) {
            respond(res, 413, { error: { code: 'payload-too-large', message: `request body exceeds the ${MAX_BODY_BYTES}-byte limit` } })
            return
          }
          respond(res, 400, {
            error: { code: 'invalid-body', message: 'expected a JSON body of the form { "sessionId": string }' },
          })
          return
        }
        const { sessionId } = body
        if (typeof sessionId !== 'string' || sessionId === '') {
          respond(res, 400, {
            error: { code: 'invalid-session-id', message: 'sessionId must be a non-empty string' },
          })
          return
```

</details>

**依据 3 · 源码核查**：[src/delete-session.ts:387-401](https://github.com/mexiaosqwq/dsh-web-mobile/blob/ad8b8e98f827c282c4394537d8b93aaa326031d4/src/delete-session.ts#L387-L401)

破坏性操作前核对路径

<details>
<summary>查看原文（15行）</summary>

```text
  // C10（fail closed）：目标目录解析/合法性校验必须在**任何破坏性操作之前**。
  // cwd 非法（如空字符串）时直接返回结构化 500，**不停会话、不注销**，状态与回执一致。
  try {
    // cwd 缺失（undefined）是合法的宿主形态（解析为 _no-cwd）；只有**非法值**（如空字符串）
    // 才 fail closed。
    if (snapshot.cwd !== undefined) projectKey(snapshot.cwd)
  } catch (error) {
    return {
      status: 500,
      ok: false,
      error: {
        code: 'delete-failed',
        message: `cannot resolve the session log directory: ${errorMessage(error)} (the session was not stopped or unregistered)`,
      },
    }
```

</details>

**依据 4 · 源码核查**：[src/delete-session.ts:409-451](https://github.com/mexiaosqwq/dsh-web-mobile/blob/ad8b8e98f827c282c4394537d8b93aaa326031d4/src/delete-session.ts#L409-L451)

活动会话停止、刷新及注销

<details>
<summary>查看原文（43行）</summary>

```text
  const live = deps.sessions?.get(sessionId)
  if (live !== undefined && deps.sessions !== undefined) {
    const agent = deps.agents?.get(sessionId) as
      | { cancel?: (cause: { kind: 'disposed' }) => void; whenIdle?: () => Promise<void> }
      | undefined
    const handle = agent !== undefined
      && typeof agent.cancel === 'function'
      && typeof agent.whenIdle === 'function'
      ? agent as { cancel(cause: { kind: 'disposed' }): void; whenIdle(): Promise<void> }
      : undefined
    if (agent !== undefined && handle === undefined) {
      return {
        status: 409,
        ok: false,
        error: {
          code: 'session-busy',
          message: `session '${sessionId}' is live on a host generation that exposes no agent disposal face; stop it first, then retry`,
        },
      }
    }
    try {
      if (handle !== undefined) {
        handle.cancel({ kind: 'disposed' })
        await withTimeout(
          handle.whenIdle(),
          IDLE_TIMEOUT_MS,
          `agent for session '${sessionId}' did not converge to idle within ${IDLE_TIMEOUT_MS}ms`,
        )
      }
      await deps.sessions.flush(live)
      detachLiveAgent(deps.agents, sessionId)
      detachLiveSession(deps.sessions, sessionId)
    } catch (error) {
      return {
        status: 409,
        ok: false,
        error: {
          code: 'session-busy',
          message: `cannot delete session '${sessionId}': it is running and could not be stopped: ` +
            `${errorMessage(error)}`,
        },
      }
    }
```

</details>

**依据 5 · 源码核查**：[src/delete-session.ts:485-520](https://github.com/mexiaosqwq/dsh-web-mobile/blob/ad8b8e98f827c282c4394537d8b93aaa326031d4/src/delete-session.ts#L485-L520)

分阶段失败与部分残留

<details>
<summary>查看原文（36行）</summary>

```text
      return {
        status: 500,
        ok: false,
        deletedLiveSession: true,
        error: {
          code: 'cleanup-failed',
          stage: trash.stage,
          failedTarget: trash.failedTarget,
          renamed: trash.renamed,
          recovery: trash.recovery,
          residual: trash.residual,
          message: stage === 'rename-payloads'
            ? (trash.recovery !== 'partial'
              ? `session '${sessionId}' was stopped and unregistered, but its log directory could not be moved to the trash and remains untouched in place: ${errorMessage(error)} (stage=rename-payloads target=${trash.failedTarget ?? 'unknown'}; renamed=${describeRenamed(trash.renamed)}${trash.recovery === 'rolled-back' ? ' (all previously renamed payloads were rolled back, so the directory is exactly as before)' : ''}); the session will not resume — retry the delete to clean up the leftover files`
              : `session '${sessionId}' was stopped and unregistered, and its log directory is now PARTIALLY renamed: ${errorMessage(error)} (stage=rename-payloads target=${trash.failedTarget ?? 'unknown'}; renamed=${describeRenamed(trash.renamed)}; residual still staged: ${describeRenamed(trash.residual)}) — the session is hidden from the list; restore the residual names (strip the suffix ".trash") and delete again, or remove the directory manually`)
            : `session '${sessionId}' was stopped and unregistered, but its log directory could only be partially stashed (directory still in place): ${errorMessage(error)} (stage=stash target=${trash.failedTarget ?? 'unknown'}; renamed=${describeRenamed(trash.renamed)}) — the session will not resume; it is hidden from the list: restore the original file names (strip the suffix ".trash") and delete again to finish the move, or remove the directory manually`,
        },
      }
    }
    return {
      status: 500,
      ok: false,
      error: {
        code: 'delete-failed',
          stage: trash.stage,
          failedTarget: trash.failedTarget,
          renamed: trash.renamed,
          recovery: trash.recovery,
          residual: trash.residual,
        message: stage === 'rename-payloads'
          ? (trash.recovery !== 'partial'
            ? `failed to move the session log to the trash: ${errorMessage(error)} (the directory is untouched; stage=rename-payloads target=${trash.failedTarget ?? 'unknown'}; renamed=${describeRenamed(trash.renamed)}${trash.recovery === 'rolled-back' ? ' — all previously renamed payloads were rolled back' : ''})`
            : `failed to move the session log to the trash, and the directory is now PARTIALLY renamed: ${errorMessage(error)} (stage=rename-payloads target=${trash.failedTarget ?? 'unknown'}; renamed=${describeRenamed(trash.renamed)}; residual still staged: ${describeRenamed(trash.residual)})`)
          : `failed to stash the session log directory: ${errorMessage(error)} (stage=stash target=${trash.failedTarget ?? 'unknown'}; renamed=${describeRenamed(trash.renamed)} — the session is hidden from the list: restore those names (strip the suffix ".trash") to unhide it)`,
      },
    }
```

</details>

**依据 6 · 源码核查**：[src/delete-session.ts:523-536](https://github.com/mexiaosqwq/dsh-web-mobile/blob/ad8b8e98f827c282c4394537d8b93aaa326031d4/src/delete-session.ts#L523-L536)

工作区清理尽力进行

<details>
<summary>查看原文（14行）</summary>

```text
  // Workspace accounting: remove the deleted session from every workspace
  // account (idempotent; unknown ids resolve without writing). Optional per
  // workspace: 0.1.1-rc.2 Workspace carries no detachSession, in which case
  // the stale id stays in that workspace record until the host reconciles it
  // (accepted phase-1 gap). The session directory is already in the trash, so
  // a failing store must never fail an already-finished deletion — the caller
  // reports success and the host reconciles the stale id (same isolation as
  // the cleanup-failed branch above).
  try {
    await detachFromWorkspaces(deps, sessionId)
  } catch {
    // Best effort: the deletion itself already succeeded.
  }
  return { status: 200, ok: true, deleted: sessionId }
```

</details>

#### 缺口

- 未检查目标宿主的上游鉴权或角色隔离
  **影响**：无法确定哪些客户端能删除会话
  **进一步探讨**：仅在独立 profile 用可丢弃会话测试认证、失败和恢复

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 压缩和兼容如何验收？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

包导出宿主和客户端，作者声明 3.2.3 对应 0.2.1 及以后，并说明安卓启动器内置的是独立打包快照。宿主挂载压缩时修改 ServerResponse 原型，所以即使桌面页面未启用触屏布局，宿主服务端仍可能影响符合条件的 JSON。压缩检查内容类型与现有编码，协商合适编码后更新长度。需同时对照 JSON 体积、首响应、CPU、流式会话和插件停用恢复。初次先用不含重要会话且访问受限的环境做移动 UI 观察，删除入口授权不明确即停。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:22-43](https://github.com/mexiaosqwq/dsh-web-mobile/blob/ad8b8e98f827c282c4394537d8b93aaa326031d4/package.json#L22-L43)

客户端与宿主构建入口

<details>
<summary>查看原文（22行）</summary>

```text
  "type": "module",
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
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "src",
    "assets",
    "cordis.patch.yml",
    "README.md",
    "LICENSE"
```

</details>

**依据 2 · 作者声明**：[README.md:35-42](https://github.com/mexiaosqwq/dsh-web-mobile/blob/ad8b8e98f827c282c4394537d8b93aaa326031d4/README.md#L35-L42)

作者兼容和尺寸声明

```text
### v3.2.3 (兼容 0.2.1 及以后)

- 输入框下的统计行：上下文环只留圆环、贴在行尾，环更好点；各组间距统一，「缓存命中」不再被截断
- 提问卡：问题和选项整张卡一起滚动，长问题不再被单独压缩；去掉问题与选项之间的分隔线
- 提问卡全屏：键盘收起后卡片回到原来的高度
- 标题行更贴近状态栏，侧边栏按钮与标题的间距收窄
- 性能：流式输出时少唤醒一个全页监听，提问卡查找只在输入区进行；发布包从约 980 KB 降到约 700 KB
- 兼容：只改手机档（<1024 触屏），桌面不变
```

**依据 3 · 作者声明**：[README.md:166-176](https://github.com/mexiaosqwq/dsh-web-mobile/blob/ad8b8e98f827c282c4394537d8b93aaa326031d4/README.md#L166-L176)

启动器快照及安装方式

<details>
<summary>查看原文（11行）</summary>

````text
## 安装

> [DSHA](https://github.com/qiannianhuanxiang/DSHA) 用户无需单独安装：DSHA 内置本插件，但内置的是它打包时的源码快照——本仓库之后的新版本要等上游重新拉取并发布 App 更新才会带上，想立刻用上本版仍按下文单独安装。

从 npm 一行装（仓库自带构建产物，无需构建配置），装完重启 `dsh web`：

```sh
dsh plugin --profile web add dsh-web-mobile
```

GitHub 直装：`dsh plugin --profile web add github:mexiaosqwq/dsh-web-mobile`
````

</details>

**依据 4 · 源码核查**：[src/index.ts:119-132](https://github.com/mexiaosqwq/dsh-web-mobile/blob/ad8b8e98f827c282c4394537d8b93aaa326031d4/src/index.ts#L119-L132)

宿主压缩与删除的挂载

<details>
<summary>查看原文（14行）</summary>

```text
export function apply(ctx: HostContext): void {
  // Transparent gzip/brotli for large JSON responses (long-session history
  // is megabytes on a phone). Patches http.ServerResponse.prototype; the
  // disposer restores it on plugin unload/reload.
  ctx.effect(() => installResponseCompression(), 'dsh-web-mobile: response compression')

  // Session-delete route (port of fork wzxmt-zhc v2.7.0). Registers once the
  // web route registry exists; the persistence / session / agent / workspace
  // services are read per request so host shapes without them degrade to a
  // structured 503 instead of a crash.
  ctx.inject(['webServer'], (webCtx) => {
    webCtx.effect(() => webCtx.webServer.register({
      kind: 'exact',
      path: '/api/mobile-nav.session.delete',
```

</details>

**依据 5 · 源码核查**：[src/compress.ts:121-147](https://github.com/mexiaosqwq/dsh-web-mobile/blob/ad8b8e98f827c282c4394537d8b93aaa326031d4/src/compress.ts#L121-L147)

JSON 与编码判据

<details>
<summary>查看原文（27行）</summary>

```text
}

/** Whether a response warrants deferred (potentially compressed) handling. */
export function isDeferrable(headers: Record<string, string | number | string[]>): boolean {
  if (headerValue(headers, 'content-encoding') !== undefined) return false
  const contentType = headerValue(headers, 'content-type') ?? ''
  return contentType.includes('json')
}

/**
 * Append the Accept-Encoding Vary token without clobbering an existing Vary
 * and without duplicating the token: re-running the patch (or a caller that
 * already varied on it, in any casing) must stay idempotent, and `*` already
 * covers Accept-Encoding.
 */
export function varyWithAcceptEncoding(headers: Record<string, string | number | string[]>): void {
  const existingKey = Object.keys(headers).find((key) => key.toLowerCase() === 'vary')
  if (existingKey === undefined) {
    headers['vary'] = 'Accept-Encoding'
    return
  }
  const tokens = String(headers[existingKey])
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token !== '')
  if (tokens.some((token) => token.toLowerCase() === 'accept-encoding' || token === '*')) return
  headers[existingKey] = [...tokens, 'Accept-Encoding'].join(', ')
```

</details>

**依据 6 · 源码核查**：[src/compress.ts:205-215](https://github.com/mexiaosqwq/dsh-web-mobile/blob/ad8b8e98f827c282c4394537d8b93aaa326031d4/src/compress.ts#L205-L215)

编码和响应长度变化

<details>
<summary>查看原文（11行）</summary>

```text
        return
      }
      const headers = { ...pending.headers }
      for (const key of Object.keys(headers)) {
        if (key.toLowerCase() === 'content-length') delete headers[key]
      }
      headers['content-encoding'] = pending.encoding
      headers['content-length'] = compressed.byteLength
      varyWithAcceptEncoding(headers)
      writeHeadWith(res, origWriteHead, pending, headers)
      origWrite.call(res, compressed)
```

</details>

#### 缺口

- 未测弱网、设备与宿主资源
  **影响**：不能量化压缩收益或宿主回归
  **进一步探讨**：在隔离环境切换插件，对照移动操作、大小及流式行为

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样减少删除失败后的误操作？

**研究主题**：新假设与验证

#### 完整回答

后端已有失败阶段、改名残留和已注销信息。可以把这些信息映射到三个互斥的用户状态，即尚未停止、已停止但仍有文件、已完成，只有确认安全的下一步才展示重试动作。用模拟路径校验失败、空闲超时、磁盘改名部分失败对照现有提示，测错误重复删除和找到正确恢复步骤的时间。若误操作不降或真实恢复更慢，撤回。

#### 证据与依据

**依据 1 · 源码核查**：[src/delete-session.ts:419-449](https://github.com/mexiaosqwq/dsh-web-mobile/blob/ad8b8e98f827c282c4394537d8b93aaa326031d4/src/delete-session.ts#L419-L449)

繁忙与停止失败分支

<details>
<summary>查看原文（31行）</summary>

```text
    if (agent !== undefined && handle === undefined) {
      return {
        status: 409,
        ok: false,
        error: {
          code: 'session-busy',
          message: `session '${sessionId}' is live on a host generation that exposes no agent disposal face; stop it first, then retry`,
        },
      }
    }
    try {
      if (handle !== undefined) {
        handle.cancel({ kind: 'disposed' })
        await withTimeout(
          handle.whenIdle(),
          IDLE_TIMEOUT_MS,
          `agent for session '${sessionId}' did not converge to idle within ${IDLE_TIMEOUT_MS}ms`,
        )
      }
      await deps.sessions.flush(live)
      detachLiveAgent(deps.agents, sessionId)
      detachLiveSession(deps.sessions, sessionId)
    } catch (error) {
      return {
        status: 409,
        ok: false,
        error: {
          code: 'session-busy',
          message: `cannot delete session '${sessionId}': it is running and could not be stopped: ` +
            `${errorMessage(error)}`,
        },
```

</details>

**依据 2 · 源码核查**：[src/delete-session.ts:485-519](https://github.com/mexiaosqwq/dsh-web-mobile/blob/ad8b8e98f827c282c4394537d8b93aaa326031d4/src/delete-session.ts#L485-L519)

失败阶段和残留为提示提供依据

<details>
<summary>查看原文（35行）</summary>

```text
      return {
        status: 500,
        ok: false,
        deletedLiveSession: true,
        error: {
          code: 'cleanup-failed',
          stage: trash.stage,
          failedTarget: trash.failedTarget,
          renamed: trash.renamed,
          recovery: trash.recovery,
          residual: trash.residual,
          message: stage === 'rename-payloads'
            ? (trash.recovery !== 'partial'
              ? `session '${sessionId}' was stopped and unregistered, but its log directory could not be moved to the trash and remains untouched in place: ${errorMessage(error)} (stage=rename-payloads target=${trash.failedTarget ?? 'unknown'}; renamed=${describeRenamed(trash.renamed)}${trash.recovery === 'rolled-back' ? ' (all previously renamed payloads were rolled back, so the directory is exactly as before)' : ''}); the session will not resume — retry the delete to clean up the leftover files`
              : `session '${sessionId}' was stopped and unregistered, and its log directory is now PARTIALLY renamed: ${errorMessage(error)} (stage=rename-payloads target=${trash.failedTarget ?? 'unknown'}; renamed=${describeRenamed(trash.renamed)}; residual still staged: ${describeRenamed(trash.residual)}) — the session is hidden from the list; restore the residual names (strip the suffix ".trash") and delete again, or remove the directory manually`)
            : `session '${sessionId}' was stopped and unregistered, but its log directory could only be partially stashed (directory still in place): ${errorMessage(error)} (stage=stash target=${trash.failedTarget ?? 'unknown'}; renamed=${describeRenamed(trash.renamed)}) — the session will not resume; it is hidden from the list: restore the original file names (strip the suffix ".trash") and delete again to finish the move, or remove the directory manually`,
        },
      }
    }
    return {
      status: 500,
      ok: false,
      error: {
        code: 'delete-failed',
          stage: trash.stage,
          failedTarget: trash.failedTarget,
          renamed: trash.renamed,
          recovery: trash.recovery,
          residual: trash.residual,
        message: stage === 'rename-payloads'
          ? (trash.recovery !== 'partial'
            ? `failed to move the session log to the trash: ${errorMessage(error)} (the directory is untouched; stage=rename-payloads target=${trash.failedTarget ?? 'unknown'}; renamed=${describeRenamed(trash.renamed)}${trash.recovery === 'rolled-back' ? ' — all previously renamed payloads were rolled back' : ''})`
            : `failed to move the session log to the trash, and the directory is now PARTIALLY renamed: ${errorMessage(error)} (stage=rename-payloads target=${trash.failedTarget ?? 'unknown'}; renamed=${describeRenamed(trash.renamed)}; residual still staged: ${describeRenamed(trash.residual)})`)
          : `failed to stash the session log directory: ${errorMessage(error)} (stage=stash target=${trash.failedTarget ?? 'unknown'}; renamed=${describeRenamed(trash.renamed)} — the session is hidden from the list: restore those names (strip the suffix ".trash") to unhide it)`,
      },
```

</details>

#### 缺口

- 未穷尽现有客户端提示
  **影响**：可能已经展示部分失败状态
  **进一步探讨**：先检查界面再用故障矩阵对照

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
