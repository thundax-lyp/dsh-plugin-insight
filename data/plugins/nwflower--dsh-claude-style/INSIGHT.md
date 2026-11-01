# dsh-claude-style

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[b3cdb1d](https://github.com/Nwflower/dsh-claude-style/tree/b3cdb1d803660a8ca46ad4c7b348e867aedaddbd)

<!-- BEGIN META -->
[![GitHub ★ 419](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=419&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Nwflower/dsh-claude-style) [![npm 30d 29,327](https://img.shields.io/static/v1?label=npm+30d&message=29%2C327&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-claude-style) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-claude-style)
<!-- END META -->

> **功能**：为 DeepSeek Harness 网页界面提供 Claude Code Desktop 风格主题及交互。

> **亮点**：以主题和交互组合调整桌面体验；实际效率和无障碍收益未对照。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：权限预设直接调用宿主命令且省略原确认对话，删除功能触及会话数据；主题并非纯视觉。[Q03](#research-q03)

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
  - [Q01 · 谁需要该皮肤，相比原生界面有什么变化？](#detail-section-11)
  - [Q02 · 接管和退让如何工作？](#detail-section-12)
  - [Q03 · 主题内权限和删除是否只是视觉？](#detail-section-13)
  - [Q04 · 采用前如何验收并控制退路？](#detail-section-14)
  - [Q05 · 什么改进能帮助判断接管和风险？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：偏好 Claude 或 DeepSeek 风格的 DSH 用户；基线是原生 GUI。[Q01](#research-q01)

使用原生 DSH GUI 及其权限确认控件。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 主题 | 改变页面外观 | 需兼容宿主 DOM |
| 权限选择 | 调用宿主预设 | 真实修改权限 |
| 删除归档 | 清理会话 | 需核对数据及活跃状态 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 兼容 DSH Web 客户端 | 必需 | 主题接管 | 回原生 UI |
| webServer | 宿主路由需要 | 真实操作 | 功能不可用 |
| 测试会话 | 验收需要 | 核对操作 | 不测真实删除 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 启用 | 测试 profile 安装 | 核对页面 |
| 操作 | 测试权限控件 | 对照宿主结果 |
| 退出 | 禁用并检查 | 残留则回原生 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 客户端资源 | 兼容配置 | 真实宿主未测 |
| 持续 | 浏览器资源 | 适应与核对操作 | 效率未比较 |
| 恢复 | 数据风险 | 检查权限和残留 | 删除可能不可逆 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 外观 | 主题与交互接线 | 用户效率 |
| 退让 | teardown 释放资源 | 所有页面无残留 |

> **思考**：权限预设直接调用宿主命令且省略原确认对话，删除功能触及会话数据；主题并非纯视觉。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：以主题和交互组合调整桌面体验；实际效率和无障碍收益未对照。[Q01](#research-q01) [Q02](#research-q02)

注入服务并在调度器失败时 teardown；真实权限及归档删除需独立核对。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

权限预设直接调用宿主命令且省略原确认对话，删除功能触及会话数据；主题并非纯视觉。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

在测试会话核对权限操作和禁用恢复，异常时回原生界面。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持客户端生命周期、权限命令和删除路由；未运行浏览器或宿主。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/host/src/index.ts、packages/host/src/routes.ts、packages/client/src/entry.ts、packages/client/src/features/sodium/sodium.ts、packages/client/src/features/permissions/permissions.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 627 个指定扩展名文件、排除 2、解析错误 0；静态核查代表 UI、权限与删除路径，未运行 DSH。
- 下一步：固定宿主，在测试会话核对主题、权限命令、删除保护和停用恢复。

**分析版本**

- **仓库**：[Nwflower/dsh-claude-style](https://github.com/Nwflower/dsh-claude-style)
- **版本号**：0.19.6（[固定提交 b3cdb1d](https://github.com/Nwflower/dsh-claude-style/tree/b3cdb1d803660a8ca46ad4c7b348e867aedaddbd)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：展示权限/删除影响及退出残留，可降低误操作；须比较原生 UI 和现有防护。[Q05](#research-q05)

固定宿主，在测试会话核对主题、权限命令、删除保护和停用恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 34 | 5696 | — | — | 128884 |
| .mjs | source | 104 | 21696 | 14993 | 5857 | — |
| .ts | source | 321 | 53354 | 31851 | 18261 | — |
| .js | source | 55 | 7365 | 5642 | 1656 | — |
| .mjs | test | 42 | 4015 | 2907 | 849 | — |
| .mjs | example | 6 | 361 | 217 | 121 | — |
| .ts | example | 7 | 233 | 136 | 77 | — |
| .ts | test | 58 | 6011 | 4519 | 904 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/Nwflower/dsh-claude-style/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 136](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=136&color=737b86&logo=github)](https://github.com/Nwflower/dsh-claude-style/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z) [![近30天关闭 131](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=131&color=737b86&logo=github)](https://github.com/Nwflower/dsh-claude-style/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：主题如何改变 DSH 界面及真实操作，接管和退出的限制是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要该皮肤，相比原生界面有什么变化？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

偏好 Claude Code Desktop 或 DeepSeek 风格的 DSH 用户可切换主题并使用重组后的界面；相比原生 GUI，增量是呈现与操作方式，而不是新模型。它不只是 CSS：涉及权限选择和会话删除等实际操作，因此合格结果需核对操作而非截图相似；适应性和效率未经用户对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-9](https://github.com/Nwflower/dsh-claude-style/blob/b3cdb1d803660a8ca46ad4c7b348e867aedaddbd/README.md#L1-L9)

作者说明主题定位。

```text
<div align="center">

# DSH Claude Style

**为 DeepSeek Harness 复刻 Claude Code Desktop 风格与交互体验的主题插件。**

> **你的下一个 Claude Code Desktop ，何必是Claude Code。**

[![简体中文](https://img.shields.io/badge/lang-%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-red.svg)](README.md) [![English](https://img.shields.io/badge/lang-English-blue.svg)](README.en.md)
```

**依据 2 · 源码核查**：[package.json:1-8](https://github.com/Nwflower/dsh-claude-style/blob/b3cdb1d803660a8ca46ad4c7b348e867aedaddbd/package.json#L1-L8)

包名、版本与宿主入口。

```text
{
  "name": "dsh-claude-style",
  "description": "Claude Code Desktop theme for DeepSeek Harness (dsh) web GUI — visual & interaction overhaul",
  "version": "0.19.6",
  "type": "module",
  "main": "lib/host/index.js",
  "icon": "lib/claude-mark.svg",
  "workspaces": [
```

**依据 3 · 源码核查**：[packages/host/src/index.ts:49-66](https://github.com/Nwflower/dsh-claude-style/blob/b3cdb1d803660a8ca46ad4c7b348e867aedaddbd/packages/host/src/index.ts#L49-L66)

宿主注册 routes 与设置。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * Register the plugin's host surfaces.
 * @param ctx - host plugin context.
 */
export function apply(ctx: DshContext) {
  // Always register through inject, never on the bare ctx. `ctx.get()` reads a
  // service leniently (no inject declaration needed), but the PROPERTY access
  // inside registerRoutes (`scope.webServer`) is gated by the fiber's inject
  // declaration, and a host half re-applies while the web server is already
  // running (a generation relink after a client-bundle rebuild). inject()
  // waits for the service and hands registerRoutes a scope that HAS the
  // declaration, so both a boot-time apply and a hot relink register. A host
  // without a web server simply waits here, and the skin still activates.
  if (typeof ctx.inject === 'function') ctx.inject(['webServer'], (scope: DshScope) => { registerRoutes(ctx, scope) })
  else registerRoutes(ctx, ctx as DshScope)

  registerSettings(ctx)
  registerWidgetUsage(ctx)
```

</details>

#### 缺口

- 本轮未运行 DSH 或浏览器
  **影响**：不能证明 UI 兼容、权限结果或退出完全恢复
  **进一步探讨**：固定宿主并在测试会话核对真实操作与禁用

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 接管和退让如何工作？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主通过注入 webServer 注册路由与设置；客户端安装样式和功能，scheduler 安装失败会 teardown，退出时释放监听与宿主上下文。Sodium 在配置未决时探测并可开启，停止时取消订阅并停引擎。代码体现局部生命周期处理，不能证明所有宿主版本、页面和其他主题并存时都无残留。

#### 证据与依据

**依据 1 · 源码核查**：[packages/host/src/index.ts:49-66](https://github.com/Nwflower/dsh-claude-style/blob/b3cdb1d803660a8ca46ad4c7b348e867aedaddbd/packages/host/src/index.ts#L49-L66)

注册宿主服务。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * Register the plugin's host surfaces.
 * @param ctx - host plugin context.
 */
export function apply(ctx: DshContext) {
  // Always register through inject, never on the bare ctx. `ctx.get()` reads a
  // service leniently (no inject declaration needed), but the PROPERTY access
  // inside registerRoutes (`scope.webServer`) is gated by the fiber's inject
  // declaration, and a host half re-applies while the web server is already
  // running (a generation relink after a client-bundle rebuild). inject()
  // waits for the service and hands registerRoutes a scope that HAS the
  // declaration, so both a boot-time apply and a hot relink register. A host
  // without a web server simply waits here, and the skin still activates.
  if (typeof ctx.inject === 'function') ctx.inject(['webServer'], (scope: DshScope) => { registerRoutes(ctx, scope) })
  else registerRoutes(ctx, ctx as DshScope)

  registerSettings(ctx)
  registerWidgetUsage(ctx)
```

</details>

**依据 2 · 源码核查**：[packages/client/src/entry.ts:151-169](https://github.com/Nwflower/dsh-claude-style/blob/b3cdb1d803660a8ca46ad4c7b348e867aedaddbd/packages/client/src/entry.ts#L151-L169)

退出时释放资源。

<details>
<summary>查看原文（19行）</summary>

```text
  /**
   * Undo everything this generation installed. Idempotent: the host runs it
   * on dispose (the effect below), and own() runs it itself when the
   * scheduler cannot be installed.
   */
  function teardown() {
    if (disposed) return
    disposed = true
    if (offOwnerWatch !== null) {
      offOwnerWatch()
      offOwnerWatch = null
    }
    release()
    if (offPeerWatch !== null) {
      offPeerWatch()
      offPeerWatch = null
    }
    setHostContext(null)
    disposePrefsBinding()
```

</details>

**依据 3 · 源码核查**：[packages/client/src/entry.ts:380-389](https://github.com/Nwflower/dsh-claude-style/blob/b3cdb1d803660a8ca46ad4c7b348e867aedaddbd/packages/client/src/entry.ts#L380-L389)

调度器失败触发 teardown。

<details>
<summary>查看原文（10行）</summary>

```text
      offSwitches = subscribePrefs(() => {
        for (const feature of live) applySwitch(feature)
        if (typeof ui.schedule === 'function') ui.schedule()
      })
    }
    // Last: its passes read the `ui` handles lazily. Without it nothing syncs,
    // and a live stylesheet over overrides that never run is worse than no
    // skin at all — so if it cannot install, the whole skin rolls back.
    if (installed.some(entry => entry.id === 'scheduler')) return
    if (!install('scheduler', null, () => installScheduler(ctx, ui, handleNames))) teardown()
```

</details>

**依据 4 · 源码核查**：[packages/client/src/features/sodium/sodium.ts:25-53](https://github.com/Nwflower/dsh-claude-style/blob/b3cdb1d803660a8ca46ad4c7b348e867aedaddbd/packages/client/src/features/sodium/sodium.ts#L25-L53)

探测、开关与停止。

<details>
<summary>查看原文（29行）</summary>

```text

  function probe() {
    if (probing || !prefsFromForm() || readPrefs().sodium !== SODIUM_UNDECIDED) return
    probing = true
    engine.survey().then((count) => {
      if (disposed || count === 0 || readPrefs().sodium !== SODIUM_UNDECIDED) return null
      return savePrefs({ sodium: SODIUM_ON })
    }).finally(() => { probing = false })
  }

  function follow() {
    if (readPrefs().sodium === SODIUM_ON) engine.start()
    else engine.stop()
    probe()
  }

  const stopPrefs = subscribePrefs(follow)
  const stopHead = subscribeMutations(document.head, { childList: true, subtree: true }, () => {
    engine.refresh()
    probe()
  })
  follow()

  return () => {
    disposed = true
    stopPrefs()
    stopHead()
    engine.stop()
  }
```

</details>

#### 缺口

- 本轮未运行 DSH 或浏览器
  **影响**：不能证明 UI 兼容、权限结果或退出完全恢复
  **进一步探讨**：固定宿主并在测试会话核对真实操作与禁用

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 主题内权限和删除是否只是视觉？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

权限控件直接通过当前 session 执行 /permission 预设命令，注释明确省去原控件确认对话；结果不符合 ok/matched 或拒绝会显示错误。归档会话删除路由会认证并限制路径，活会话集合不可读取时按活跃拒绝，但 sessions 服务完全缺失时函数视为不活跃；目录不存在可成功清理归档幽灵记录。它们涉及实际设置与数据，不能把换肤当成纯视觉或认为每种宿主都可靠阻止误删。

#### 证据与依据

**依据 1 · 源码核查**：[packages/client/src/features/permissions/permissions.ts:73-109](https://github.com/Nwflower/dsh-claude-style/blob/b3cdb1d803660a8ca46ad4c7b348e867aedaddbd/packages/client/src/features/permissions/permissions.ts#L73-L109)

直接调用权限命令及拒绝处理。

<details>
<summary>查看原文（37行）</summary>

```text
  /**
   * Request the preset switch through the host's `/permission` command —
   * the same write the shipped picker's confirmation dialog ends in, minus
   * the dialog. The command validates the preset against the host's own
   * catalog, writes the sandbox mode and the approval policy, and appends
   * the preset event, so the next sync re-renders the control from the
   * projection alone.
   */
  function submitPreset(preset: string) {
    const session = currentSession(ctx)
    if (session === null) return
    const settled = session.command(`/permission ${preset}`)
    if (settled === undefined || settled === null) return
    settled.then((result) => {
      if (result === null || typeof result !== 'object' || result.ok !== true) {
        submitError = new Error(`permission: the /permission ${preset} command was refused`)
      } else if (result.value === null || typeof result.value !== 'object' || result.value.matched !== true) {
        submitError = new Error('permission: the host offers no /permission command')
      } else {
        submitError = null
      }
      ui.schedule!()
    }, () => {
      submitError = new Error(`permission: the /permission ${preset} command failed`)
      ui.schedule!()
    })
  }

  /**
   * Request the switch for every row, gated presets included. A same-value
   * pick writes nothing.
   */
  function pick(preset: string | null) {
    const session = currentSession(ctx)
    if (session === null || preset === null) return
    if (preset === currentPreset(session)) return
    submitPreset(preset)
```

</details>

**依据 2 · 源码核查**：[packages/host/src/routes.ts:95-119](https://github.com/Nwflower/dsh-claude-style/blob/b3cdb1d803660a8ca46ad4c7b348e867aedaddbd/packages/host/src/routes.ts#L95-L119)

活会话判定和服务缺失分支。

<details>
<summary>查看原文（25行）</summary>

```text

/**
 * Whether the host holds this session open right now.
 *
 * A live session's log is open and being appended to, so its directory must not
 * be removed under the writer. A sessions service that offers no way to read
 * its live set answers "live": an unreadable set cannot authorize the
 * deletion. A read that throws fails the request (500), which refuses the
 * deletion as well.
 */
function sessionIsLive(ctx: DshContext, sessionId: string): boolean {
  const sessions = ctx.get('sessions')
  // A host with no sessions service holds nothing open.
  if (sessions === null || sessions === undefined) return false
  if (typeof sessions.get === 'function') {
    const found = sessions.get(sessionId)
    return found !== undefined && found !== null
  }
  if (typeof sessions.list === 'function') {
    const listed = sessions.list()
    if (Array.isArray(listed)) {
      return listed.some((item) => (typeof item === 'string' ? item : item?.id ?? item?.sessionId) === sessionId)
    }
  }
  return true
```

</details>

**依据 3 · 源码核查**：[packages/host/src/routes.ts:138-160](https://github.com/Nwflower/dsh-claude-style/blob/b3cdb1d803660a8ca46ad4c7b348e867aedaddbd/packages/host/src/routes.ts#L138-L160)

删除语义与请求拒绝。

<details>
<summary>查看原文（23行）</summary>

```text
 * Delete one stored session: the directory named by the id under one of the
 * sessions root's working-directory directories, and the id's entry in the
 * workspace registry's archive set.
 *
 * The id reaches the filesystem as the name the harness stores it under, never
 * as its own spelling, and only after the id check: the lookup is by exact name
 * and the resolved directory must stay inside the sessions root.
 *
 * The archive set can name a session whose stored directory is already gone —
 * an earlier removal took the directory while the registry entry stayed, and
 * the stale session summary keeps its row on the archived list. The miss
 * answers success too: the registry's unarchive runs no existence check and
 * resolves without writing for an id that is not archived, so the entry leaves
 * the set either way and the row is gone for good instead of coming back on
 * the next reload.
 */
async function deleteSession(ctx: DshContext, req: DshRequest, res: DshResponse) {
  const refused = refusalOf(ctx, req)
  if (refused !== undefined) {
    sendJson(res, refused, { ok: false, error: refused === 401 ? 'unauthorized' : 'forbidden' })
    return
  }
  const raw = await readRequestBody(req, DELETE_BODY_MAX)
```

</details>

**依据 4 · 源码核查**：[packages/host/src/routes.ts:190-205](https://github.com/Nwflower/dsh-claude-style/blob/b3cdb1d803660a8ca46ad4c7b348e867aedaddbd/packages/host/src/routes.ts#L190-L205)

缺目录与路径解析。

<details>
<summary>查看原文（16行）</summary>

```text
  for (const entry of readdirSync(root)) {
    const candidate = join(root, entry, storedName)
    if (statSync(candidate, { throwIfNoEntry: false })?.isDirectory() === true) {
      dir = candidate
      break
    }
  }
  if (dir === null) {
    await unarchiveSession(ctx, sessionId)
    sendJson(res, 200, { ok: true, ghost: true })
    return
  }
  // The comparison has to be between resolved paths: an entry inside the root
  // that is itself a symlink carries a recursive removal out of it, and
  // `resolve` only normalizes the spelling (D75).
  const realRoot = realpathSync(root)
```

</details>

#### 缺口

- 本轮未运行 DSH 或浏览器
  **影响**：不能证明 UI 兼容、权限结果或退出完全恢复
  **进一步探讨**：固定宿主并在测试会话核对真实操作与禁用

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用前如何验收并控制退路？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH 宿主、webServer 与已构建客户端；皮肤在服务不可用时可能仍激活，但相应宿主功能需单独核验。先用测试会话验证布局、权限选择及禁用后的恢复，不用真实历史测试删除；确认功能异常或其他主题冲突时禁用并回原生界面。样式偏好、时间成本与辅助功能体验均未作对照，不能用截图证明。

#### 证据与依据

**依据 1 · 源码核查**：[packages/host/src/index.ts:53-66](https://github.com/Nwflower/dsh-claude-style/blob/b3cdb1d803660a8ca46ad4c7b348e867aedaddbd/packages/host/src/index.ts#L53-L66)

服务注入和设置注册。

<details>
<summary>查看原文（14行）</summary>

```text
export function apply(ctx: DshContext) {
  // Always register through inject, never on the bare ctx. `ctx.get()` reads a
  // service leniently (no inject declaration needed), but the PROPERTY access
  // inside registerRoutes (`scope.webServer`) is gated by the fiber's inject
  // declaration, and a host half re-applies while the web server is already
  // running (a generation relink after a client-bundle rebuild). inject()
  // waits for the service and hands registerRoutes a scope that HAS the
  // declaration, so both a boot-time apply and a hot relink register. A host
  // without a web server simply waits here, and the skin still activates.
  if (typeof ctx.inject === 'function') ctx.inject(['webServer'], (scope: DshScope) => { registerRoutes(ctx, scope) })
  else registerRoutes(ctx, ctx as DshScope)

  registerSettings(ctx)
  registerWidgetUsage(ctx)
```

</details>

**依据 2 · 源码核查**：[packages/client/src/entry.ts:151-169](https://github.com/Nwflower/dsh-claude-style/blob/b3cdb1d803660a8ca46ad4c7b348e867aedaddbd/packages/client/src/entry.ts#L151-L169)

释放路径。

<details>
<summary>查看原文（19行）</summary>

```text
  /**
   * Undo everything this generation installed. Idempotent: the host runs it
   * on dispose (the effect below), and own() runs it itself when the
   * scheduler cannot be installed.
   */
  function teardown() {
    if (disposed) return
    disposed = true
    if (offOwnerWatch !== null) {
      offOwnerWatch()
      offOwnerWatch = null
    }
    release()
    if (offPeerWatch !== null) {
      offPeerWatch()
      offPeerWatch = null
    }
    setHostContext(null)
    disposePrefsBinding()
```

</details>

**依据 3 · 源码核查**：[packages/client/src/features/permissions/permissions.ts:73-109](https://github.com/Nwflower/dsh-claude-style/blob/b3cdb1d803660a8ca46ad4c7b348e867aedaddbd/packages/client/src/features/permissions/permissions.ts#L73-L109)

权限动作及错误。

<details>
<summary>查看原文（37行）</summary>

```text
  /**
   * Request the preset switch through the host's `/permission` command —
   * the same write the shipped picker's confirmation dialog ends in, minus
   * the dialog. The command validates the preset against the host's own
   * catalog, writes the sandbox mode and the approval policy, and appends
   * the preset event, so the next sync re-renders the control from the
   * projection alone.
   */
  function submitPreset(preset: string) {
    const session = currentSession(ctx)
    if (session === null) return
    const settled = session.command(`/permission ${preset}`)
    if (settled === undefined || settled === null) return
    settled.then((result) => {
      if (result === null || typeof result !== 'object' || result.ok !== true) {
        submitError = new Error(`permission: the /permission ${preset} command was refused`)
      } else if (result.value === null || typeof result.value !== 'object' || result.value.matched !== true) {
        submitError = new Error('permission: the host offers no /permission command')
      } else {
        submitError = null
      }
      ui.schedule!()
    }, () => {
      submitError = new Error(`permission: the /permission ${preset} command failed`)
      ui.schedule!()
    })
  }

  /**
   * Request the switch for every row, gated presets included. A same-value
   * pick writes nothing.
   */
  function pick(preset: string | null) {
    const session = currentSession(ctx)
    if (session === null || preset === null) return
    if (preset === currentPreset(session)) return
    submitPreset(preset)
```

</details>

#### 缺口

- 本轮未运行 DSH 或浏览器
  **影响**：不能证明 UI 兼容、权限结果或退出完全恢复
  **进一步探讨**：固定宿主并在测试会话核对真实操作与禁用

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么改进能帮助判断接管和风险？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：在接管前展示真实权限预设变化和可能删除的数据，并在禁用后报告未恢复的页面区域，可减少视觉主题被误认为无副作用。现有命令拒绝处理、活会话判定和 teardown 是反证；状态报告不能代替宿主真实权限检查。对照原生 GUI，用测试会话测误操作、取消率、残留、完成时间与无障碍表现；若误导或负担上升则否定。

#### 证据与依据

**依据 1 · 源码核查**：[packages/client/src/features/permissions/permissions.ts:73-98](https://github.com/Nwflower/dsh-claude-style/blob/b3cdb1d803660a8ca46ad4c7b348e867aedaddbd/packages/client/src/features/permissions/permissions.ts#L73-L98)

已有命令失败处理。

<details>
<summary>查看原文（26行）</summary>

```text
  /**
   * Request the preset switch through the host's `/permission` command —
   * the same write the shipped picker's confirmation dialog ends in, minus
   * the dialog. The command validates the preset against the host's own
   * catalog, writes the sandbox mode and the approval policy, and appends
   * the preset event, so the next sync re-renders the control from the
   * projection alone.
   */
  function submitPreset(preset: string) {
    const session = currentSession(ctx)
    if (session === null) return
    const settled = session.command(`/permission ${preset}`)
    if (settled === undefined || settled === null) return
    settled.then((result) => {
      if (result === null || typeof result !== 'object' || result.ok !== true) {
        submitError = new Error(`permission: the /permission ${preset} command was refused`)
      } else if (result.value === null || typeof result.value !== 'object' || result.value.matched !== true) {
        submitError = new Error('permission: the host offers no /permission command')
      } else {
        submitError = null
      }
      ui.schedule!()
    }, () => {
      submitError = new Error(`permission: the /permission ${preset} command failed`)
      ui.schedule!()
    })
```

</details>

**依据 2 · 源码核查**：[packages/host/src/routes.ts:95-119](https://github.com/Nwflower/dsh-claude-style/blob/b3cdb1d803660a8ca46ad4c7b348e867aedaddbd/packages/host/src/routes.ts#L95-L119)

已有活会话判断。

<details>
<summary>查看原文（25行）</summary>

```text

/**
 * Whether the host holds this session open right now.
 *
 * A live session's log is open and being appended to, so its directory must not
 * be removed under the writer. A sessions service that offers no way to read
 * its live set answers "live": an unreadable set cannot authorize the
 * deletion. A read that throws fails the request (500), which refuses the
 * deletion as well.
 */
function sessionIsLive(ctx: DshContext, sessionId: string): boolean {
  const sessions = ctx.get('sessions')
  // A host with no sessions service holds nothing open.
  if (sessions === null || sessions === undefined) return false
  if (typeof sessions.get === 'function') {
    const found = sessions.get(sessionId)
    return found !== undefined && found !== null
  }
  if (typeof sessions.list === 'function') {
    const listed = sessions.list()
    if (Array.isArray(listed)) {
      return listed.some((item) => (typeof item === 'string' ? item : item?.id ?? item?.sessionId) === sessionId)
    }
  }
  return true
```

</details>

**依据 3 · 源码核查**：[packages/client/src/entry.ts:151-169](https://github.com/Nwflower/dsh-claude-style/blob/b3cdb1d803660a8ca46ad4c7b348e867aedaddbd/packages/client/src/entry.ts#L151-L169)

已有释放。

<details>
<summary>查看原文（19行）</summary>

```text
  /**
   * Undo everything this generation installed. Idempotent: the host runs it
   * on dispose (the effect below), and own() runs it itself when the
   * scheduler cannot be installed.
   */
  function teardown() {
    if (disposed) return
    disposed = true
    if (offOwnerWatch !== null) {
      offOwnerWatch()
      offOwnerWatch = null
    }
    release()
    if (offPeerWatch !== null) {
      offPeerWatch()
      offPeerWatch = null
    }
    setHostContext(null)
    disposePrefsBinding()
```

</details>

#### 缺口

- 本轮未运行 DSH 或浏览器
  **影响**：不能证明 UI 兼容、权限结果或退出完全恢复
  **进一步探讨**：固定宿主并在测试会话核对真实操作与禁用

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
