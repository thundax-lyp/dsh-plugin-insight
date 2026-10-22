# dsh-custom-plugin

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[901a665](https://github.com/AlexPeng07/dsh-custom-plugin/tree/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f)

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/AlexPeng07/dsh-custom-plugin) [![npm 30d 2,207](https://img.shields.io/static/v1?label=npm+30d&message=2%2C207&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@alexpeng/dsh-custom-plugin) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@alexpeng/dsh-custom-plugin)
<!-- END META -->

> **实现功能**：DSH Web 多功能便利套件，集外观、会话/提示词、用量预算、Mermaid 和备份于一体。

> **核心亮点**：多项 Web 效率功能共用一套设置、状态、备份与宿主路由。详见[Q01](#research-q01)。

> **风险与缺陷**：Web/Desktop 共享状态虽有三方合并，但跨进程读合并写无共同锁，极端交错仍可能覆盖；需故障注入。详见[Q02](#research-q02)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 套件的组合价值和宿主形态是什么？](#detail-section-11)
  - [Q02 · 共享状态在 Web 与 Desktop 同时写入时怎样处理？](#detail-section-12)
  - [Q03 · 敏感访问、备份和外部依赖如何限制？](#detail-section-13)
  - [Q04 · 应怎样选择和验证此套件？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在一个插件中集中管理 Web 外观、会话操作和本地用量的用户。

DSH 默认 Web GUI 与多单功能插件；此套件提供一个共享面板和状态文件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 多功能面板 | 集中操作 | 广权限/复杂性 |
| 共享状态 | Web/Desktop 一致 | 并发需测 |
| 预算/余额 | 成本感知 | 估算非账单 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| 声明 DSH 版本 | slots/Host API | 整包跳过或降级 |
| 本地 Mermaid 包 | 离线图表 | CDN 回退 |
| DeepSeek Key | 官方余额 | 只用本地估算 |

#### 试用

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 备份 | 导出状态 | 可恢复 |
| 核功能 | 会话/图表/用量 | 数据正确 |
| 并发 | Web/Desktop 同写 | 无丢失 |
| 对账 | 本地估算对官方 | 差异可接受 |

**效果与成本**

#### 成本

| 阶段 | 资源/人工 | 边界 |
| --- | --- | --- |
| 装入 | 版本匹配、profile | 宿主兼容严格 |
| 使用 | 多功能设置、凭据可选 | 计价仅估算 |
| 维护 | 状态备份/冲突处理 | 跨进程风险需测 |

#### 效果

| 项 | 代码支持 | 未知 |
| --- | --- | --- |
| 工作台功能 | slots/Host API | 实际效率 |
| 状态备份 | 投影/预览/恢复 | 多进程压力 |
| 用量预算 | 本地折叠 | 与账单差异 |

> **思考**：Web/Desktop 共享状态虽有三方合并，但跨进程读合并写无共同锁，极端交错仍可能覆盖；需故障注入。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：多项 Web 效率功能共用一套设置、状态、备份与宿主路由。详见[Q01](#research-q01)。

多项 Web 效率功能共用一套设置、状态、备份与宿主路由。详见[Q01](#research-q01)。

Web/Host 双半区通过同源路由联动；共享状态文件采用队列、PID 临时文件、三方合并。

<a id="detail-section-5"></a>

### 1.4 主要限制

Web/Desktop 共享状态虽有三方合并，但跨进程读合并写无共同锁，极端交错仍可能覆盖；需故障注入。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离 profile、备份状态，先测最需要的 2-3 项，再验来源围栏、并发保存与账单对照。详见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

组合能力与保护机制可从源码核查；跨进程读合并写无共同锁、目标版本体验和外部价目仍待验证。

- 已检查：作者 README、包清单、源码路径 README.zh.md、package.json、src/index.ts、src/routes.ts、src/loopback.ts、src/state.ts、src/backup.ts、src/host-service.ts、src/credentials.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅 README.zh、Host 路由、状态、备份、凭据与 Mermaid 路径；不运行目标插件。
- 下一步：在目标声明版本验证 slots 与路由；双进程交错写、备份脱敏、Mermaid 本地/后备与账单对照。

**分析版本**

- **仓库**：[AlexPeng07/dsh-custom-plugin](https://github.com/AlexPeng07/dsh-custom-plugin)
- **版本号**：0.8.0（[固定提交 901a665](https://github.com/AlexPeng07/dsh-custom-plugin/tree/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

加入跨进程版本/CAS 协议并持续核价，可降低同步与费用误导；现版未验证。详见[Q04](#research-q04)。

在目标声明版本验证 slots 与路由；双进程交错写、备份脱敏、Mermaid 本地/后备与账单对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 1628 | — | — | 25466 |
| .mjs | source | 5 | 825 | 591 | 174 | — |
| .ts | source | 24 | 4714 | 3652 | 785 | — |
| .tsx | source | 1 | 3038 | 2689 | 298 | — |
| .ts | test | 26 | 3397 | 2809 | 318 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/AlexPeng07/dsh-custom-plugin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AlexPeng07/dsh-custom-plugin/issues?q=is%3Aissue+created%3A2026-09-22T06%3A06%3A15.492Z..2026-10-22T06%3A06%3A15.492Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AlexPeng07/dsh-custom-plugin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A06%3A15.492Z..2026-10-22T06%3A06%3A15.492Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核实多功能套件的真实模块、持久状态并发边界、敏感路由与采用成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 套件的组合价值和宿主形态是什么？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

作者把外观、文件夹、提示词库、会话搜索/导出、Mermaid、批量归档、用量/预算及快捷面板集中到 DSH Web。Host 注册状态、时间线、搜索、备份、余额、Mermaid 等路由和 custom_plugin_status 工具；客户端通过 slots 挂载。这降低多插件拼装成本，但也让一个包同时拥有会话读取、本地状态、凭据和外部余额查询能力。README 所列宿主活体验证为作者报告，本轮仅静态检查源码，不视为独立复现。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:15-35](https://github.com/AlexPeng07/dsh-custom-plugin/blob/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f/README.zh.md#L15-L35)

作者描述多功能和双半区架构。

<details>
<summary>查看原文（21行）</summary>

```text

DeepSeek Harness（DSH）Web GUI 的 Custom 便利套件：个性化外观、天气特效、玻璃效果、项目文件夹、增强提示词库、会话导出与会话搜索、Mermaid 渲染、引用回复、7/30/90 天用量分析、预算与无密钥本地备份，以及 Ctrl/Cmd+K 快捷面板。

插件为双半区架构：宿主半区（`src/`）持有状态文档、注册 `/api/custom-plugin` 路由与 `custom_plugin_status` 智能体工具；浏览器半区（`src/client/`）通过 7 个官方 slot 的 8 处注入挂载 UI，以同源 fetch 与宿主通信。经官方 profile 机制挂载，不改 DSH 源码。

<p align="center">
  <img src="https://github.com/AlexPeng07/dsh-custom-plugin/raw/main/docs/overview.png" alt="dsh-custom-plugin 总览" width="100%">
</p>

## 部分界面展示

<table>
<tr>
<td width="50%" valign="top"><b>「设置 → 个性化」整页外观配置</b><br><img src="https://github.com/AlexPeng07/dsh-custom-plugin/raw/main/docs/settings-appearance.png" alt="设置 → 个性化 整页外观配置" width="100%"></td>
<td width="50%" valign="top"><b>会话头部弹出的同一套面板（浅色主题）</b><br><img src="https://github.com/AlexPeng07/dsh-custom-plugin/raw/main/docs/personalization-panel.png" alt="个性化弹窗面板" width="100%"></td>
</tr>
<tr>
<td width="50%" valign="top"><b>液态玻璃（Custom 面板位移折射）</b><br><img src="https://github.com/AlexPeng07/dsh-custom-plugin/raw/main/docs/liquid-glass.png" alt="液态玻璃" width="100%"></td>
<td width="50%" valign="top"><b>多级项目文件夹</b><br><img src="https://github.com/AlexPeng07/dsh-custom-plugin/raw/main/docs/project-folders.png" alt="项目文件夹" width="100%"></td>
</tr>
<tr>
```

</details>

**依据 2 · 源码核查**：[src/index.ts:23-63](https://github.com/AlexPeng07/dsh-custom-plugin/blob/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f/src/index.ts#L23-L63)

Host 注入 webServer/tools/sessionQuery 并初始化服务。

<details>
<summary>查看原文（41行）</summary>

```text
export const inject = ['webServer', 'tools', 'sessionQuery']

export const apply = mountOnce('@alexpeng/dsh-custom-plugin', applyImpl)

function applyImpl(ctx: Context): void {
  const state = defaultState()
  // Keep diagnostics truthful even before the asynchronous load resolves.
  // `dshHome()` is a directory; the state path is its sibling file.
  let statePath = join(dshHome(), STATE_FILE)
  let stateLoaded = false
  // Flipped only when the state file could be neither read nor quarantined
  // aside: every save path funnels through `saveNow`/`saveSoon`, so gating
  // here keeps the host from persisting never-loaded defaults over a
  // document that may still be intact on disk.
  let stateWritable = true
  const sessionModels = new Map<string, string | null>()
  const pendingUsage: Array<{ sessionId: string; usage: NonNullable<Extract<SessionEvent, { type: 'assistant/message' }>['data']['usage']>; time: number; model: string | null }> = []

  const diagReports: string[] = []
  const reportDiag = (message: string): void => {
    diagReports.push(String(message ?? '').slice(0, 400))
    if (diagReports.length > 20) diagReports.splice(0, diagReports.length - 20)
  }

  const saveSoon = (() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    return (): void => {
      if (!stateWritable) return
      if (timer !== undefined) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = undefined
        void host.persistWhenIdle().catch((error) => {
          reportDiag(`state save failed: ${String((error as Error)?.message ?? error)}`)
        })
      }, 500)
    }
  })()

  const host = new CustomPluginHost({
    sessionQuery: ctx.sessionQuery,
    state,
```

</details>

**依据 3 · 源码核查**：[src/routes.ts:66-75](https://github.com/AlexPeng07/dsh-custom-plugin/blob/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f/src/routes.ts#L66-L75)

集中构造各类 Host route。

<details>
<summary>查看原文（10行）</summary>

```text
export function makeCustomPluginRoutes(host: CustomPluginHost, ready: Promise<void> = Promise.resolve()): WebRoute[] {
  const stateRoute: WebRoute = {
    kind: 'exact',
    path: `${CUSTOM_PLUGIN_API_PREFIX}/state`,
    handler: async (req, res): Promise<void> => {
      if (!guard(req, res)) return
      await ready
      if (req.method === 'GET') {
        json(res, 200, { ok: true, data: await host.stateView() })
        return
```

</details>

**依据 4 · 源码核查**：[src/routes.ts:320-329](https://github.com/AlexPeng07/dsh-custom-plugin/blob/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f/src/routes.ts#L320-L329)

返回状态、搜索、导出、余额、Mermaid 等路由。

<details>
<summary>查看原文（10行）</summary>

```text
    path: `${CUSTOM_PLUGIN_API_PREFIX}/debug`,
    handler: (req, res): void => {
      if (!guard(req, res)) return
      if (!isMethod(req, 'GET', res)) return
      void ready.then(() => host.debugInfo()).then((info) => { json(res, 200, { ok: true, ...info }) }).catch(() => { json(res, 200, { ok: false, error: '调试信息不可用' }) })
    },
  }

  return [stateRoute, timelineRoute, backupRoute, searchRoute, exportRoute, balanceRoute, usageScanRoute, mermaidFetchRoute, mermaidScriptRoute, diagRoute, debugRoute]
}
```

</details>

#### 缺口

- 未在目标 DSH 运行完整套件。
  **影响：**UI、槽位冲突和实际节省时间未知。
  **进一步探讨：**在作者声明的三个宿主版本逐项试用核心流程，记录冲突和功能使用率。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 共享状态在 Web 与 Desktop 同时写入时怎样处理？

**研究主题：**功能与机制、工程质量与复用

#### 完整回答

状态放在共享 DSH_HOME/custom-plugin-state.json，采用 per-process PID 临时文件、同进程每路径写队列和 rename 原子替换。保存前根据 mtimeMs 与 size 发现外部变化，再做三方合并；不同 section 按本地/远端变更处理，用量计数通过 theirs+ours-base 折叠。此机制比直接覆盖完善，但跨进程的“读取外部变化→合并→写入”没有共同锁；两宿主恰好交错写时仍可能丢更新。mtime/size 相同的快速改写、外部文件不可读也按源码注释回退覆盖。需竞争复现，不能宣称实际发生丢失。

#### 证据与依据

**依据 1 · 源码核查**：[src/state.ts:292-345](https://github.com/AlexPeng07/dsh-custom-plugin/blob/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f/src/state.ts#L292-L345)

写队列、PID 临时文件、rename 和保存基线。

<details>
<summary>查看原文（54行）</summary>

```text
/** In-flight save per state path: concurrent saves queue instead of racing on
 * the rename order. Two writers renaming one temp file is the Windows
 * EPERM/EBUSY source; queuing also coalesces naturally, because each turn
 * serializes the live document when it runs, not when it was requested. */
const saveQueues = new Map<string, Promise<void>>()

/**
 * Temp name for an atomic replace, qualified by the writing process.
 *
 * The queue above is per-process, but `$DSH_HOME` is not: dsh Web and dsh
 * Desktop both run hosts against one home (separate profiles, one `$DSH_HOME`),
 * so a fixed temp name would let the two hosts write and rename the same file
 * and hand each other a partially written document.
 */
export function tempPathFor(target: string, pid: number = process.pid): string {
  return `${target}.${pid}.tmp`
}

/** Atomically persist the state document. Saves to the same path are
 * serialized: a caller awaits its own turn's completion, a failed turn never
 * poisons the queue behind it. Before writing, another host's changes since
 * this process last loaded or saved the file are merged back in (see
 * `mergeExternalChanges`). */
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
  })
}

/** Per-path view of the on-disk document this process last saw: its stat
 * identity and its serialized bytes. `$DSH_HOME` is shared by every dsh host
 * under it (Web + Desktop), so a save must first notice whether another host
```

</details>

**依据 2 · 源码核查**：[src/state.ts:349-386](https://github.com/AlexPeng07/dsh-custom-plugin/blob/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f/src/state.ts#L349-L386)

通过 stat 比较和三方合并，源码注明漏检及不可读回退。

<details>
<summary>查看原文（38行）</summary>

```text
const syncBaselines = new Map<string, { mtimeMs: number; size: number; doc: string } | null>()

/**
 * Fold another host's writes back in before this process saves over them.
 *
 * Each host holds the whole document in memory, so an unchecked save is
 * last-writer-wins and silently discards the other host's usage folds and
 * config edits. When the file's stat identity no longer matches what this
 * process last wrote or loaded, the current bytes are re-read and three-way
 * merged against the last-saved snapshot: sections this process has not
 * touched adopt the external version, the usage ledger unions arithmetically
 * (`theirs + ours − base` per counter — exact for two hosts that both
 * started from `base`), and locally-dirty sections keep the local version.
 *
 * The stat fast path misses only a same-instant, same-length rewrite by
 * another host. An unreadable or undecodable external document falls back to
 * the plain overwrite — the boot-time quarantine remains the backstop for
 * the destructive case.
 */
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
}

function safeParse(text: string): CustomPluginState | null {
```

</details>

**依据 3 · 作者声明**：[README.zh.md:171-179](https://github.com/AlexPeng07/dsh-custom-plugin/blob/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f/README.zh.md#L171-L179)

作者说明 Web/Desktop 共用状态文件。

```text
   安装和更新，不想开终端就用它。

外观、提示词库、项目文件夹、星标和用量都存在
`$DSH_HOME/custom-plugin-state.json`，这个文件按设计由桌面版和 Web 共享——两
边各自持有自己的 `profiles/<名字>`，那里面只放代码不放这个文件——所以在两者
之间切换看到的是同一份数据。两个宿主因此可能同时写它，这就是状态替换把临时文
件按写入进程的 pid 命名的原因。

### 从 GitHub 安装（源码安装）
```

#### 缺口

- 未做跨进程交错写/故障注入。
  **影响：**并发风险为代码推断而非实测故障率。
  **进一步探讨：**用两个宿主进程屏障控制同一基线并发保存，比较文件夹/提示词/用量结果和恢复副本。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 敏感访问、备份和外部依赖如何限制？

**研究主题：**缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

Host 路由设回环 socket 与 Host 校验、拒 cross-site，Origin 有值时需匹配 Host；桌面转发去掉来源标记时无标记被接受，这是特定宿主信任假设。状态/备份请求分别设尺寸上限；备份显式投影排除 API Key，导入前可预览并写恢复副本。余额查询需要 Key，Mermaid 本地包优先、缺失回退多个 CDN，因此“离线可用”以本地依赖确实随安装到位为条件。外部 DeepSeek 价目/时间规则可能变化，本轮不核实时价格。

#### 证据与依据

**依据 1 · 源码核查**：[src/loopback.ts:43-65](https://github.com/AlexPeng07/dsh-custom-plugin/blob/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f/src/loopback.ts#L43-L65)

本地请求、Host、cross-site/Origin 信任逻辑。

<details>
<summary>查看原文（23行）</summary>

```text
 * loopback socket address AND a loopback Host header, non-`cross-site` fetch
 * marker, and an Origin that is absent (trusted — the dsh Desktop forward
 * shape) or matches the Host authority. The socket address is authoritative;
 * X-Forwarded-For is never trusted.
 */
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

**依据 2 · 源码核查**：[src/routes.ts:18-55](https://github.com/AlexPeng07/dsh-custom-plugin/blob/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f/src/routes.ts#L18-L55)

状态/备份 body 限制与路由 guard。

<details>
<summary>查看原文（38行）</summary>

```text
export const STATE_BODY_LIMIT = 1024 * 1024
const TIMELINE_LIMIT = 64 * 1024
// The request envelope contains JSON keys around the document. Keep a small
// reserve so a document at the documented 5 MiB limit is not rejected solely
// because of that envelope; the document itself is checked below as well.
const BACKUP_REQUEST_LIMIT = BACKUP_BODY_LIMIT + 64 * 1024

function json(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  res.end(JSON.stringify(body))
}

/**
 * The request fence. Trust is decided by `isLoopbackRequest` alone: a loopback
 * socket with a loopback Host, a non-`cross-site` fetch marker, and an Origin
 * that is absent or matches the Host authority. Absent markers are *accepted*
 * — that is the exact header shape dsh Desktop's shell produces when it
 * forwards renderer requests to its own Host (it deletes `host`, `origin`,
 * `sec-fetch-site` and `cookie` first), and the same shape the platform fence
 * treats as trusted. A foreign origin, a cross-site marker, or a non-loopback
 * peer is rejected.
 */
function guard(req: IncomingMessage, res: ServerResponse): boolean {
  if (isLoopbackRequest(req)) return true
  json(res, 403, { ok: false, error: 'forbidden' })
  return false
}

async function readBody(req: IncomingMessage, limit: number): Promise<unknown> {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of req) {
    const buffer = chunk as Buffer
    size += buffer.length
    if (size > limit) throw new Error('body-too-large')
    chunks.push(buffer)
  }
  if (chunks.length === 0) return {}
```

</details>

**依据 3 · 源码核查**：[src/backup.ts:83-111](https://github.com/AlexPeng07/dsh-custom-plugin/blob/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f/src/backup.ts#L83-L111)

备份字段显式投影。

<details>
<summary>查看原文（29行）</summary>

```text
export function createBackup(state: CustomPluginState): CustomPluginBackupV1 {
  const seen = new Set<string>()
  const folders = (Array.isArray(state.folders) ? state.folders : []).map((item) => folder(item, seen)).filter((item): item is FolderNode => item !== null)
  const prompts = (Array.isArray(state.prompts) ? state.prompts : []).map(normalizePrompt).filter((item): item is PromptItem => item !== null)
  const stars: StarsMap = {}
  if (state.stars !== null && typeof state.stars === 'object') {
    for (const [sessionId, entries] of Object.entries(state.stars)) {
      if (!safeKey(sessionId) || entries === null || typeof entries !== 'object' || Array.isArray(entries)) continue
      const clean: Record<string, boolean> = {}
      for (const [seq, value] of Object.entries(entries)) if (value === true && /^\d+$/.test(seq)) clean[seq] = true
      if (Object.keys(clean).length > 0) stars[sessionId] = clean
    }
  }
  const usage: UsageMap = {}
  if (state.usage !== null && typeof state.usage === 'object') {
    for (const [day, models] of Object.entries(state.usage)) {
      if (!validDayKey(day) || models === null || typeof models !== 'object' || Array.isArray(models)) continue
      const clean: Record<string, UsageRow> = {}
      for (const [model, rawRow] of Object.entries(models)) {
        if (!safeKey(model)) continue
        const row = usageRow(rawRow)
        if (model !== '' && row !== null) clean[model] = row
      }
      if (Object.keys(clean).length > 0) usage[day] = clean
    }
  }
  return clone({ format: BACKUP_FORMAT, version: BACKUP_VERSION, exportedAt: new Date().toISOString(), data: { cfg: normalizeCfg(state.cfg), folders, prompts, stars, usage } })
}

```

</details>

**依据 4 · 源码核查**：[src/host-service.ts:828-843](https://github.com/AlexPeng07/dsh-custom-plugin/blob/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f/src/host-service.ts#L828-L843)

Mermaid 本地加载与 CDN 后备。

<details>
<summary>查看原文（16行）</summary>

```text
function looksLikeMermaidBundle(text: string): boolean {
  const head = text.slice(0, 64).replace(/^\uFEFF/, '').trimStart()
  return text.length >= 1000 && !head.startsWith('<')
}

/** Resolve `mermaid/dist/mermaid.min.js` from the package's own dependency
 * tree (works for `link:` checkouts and registry installs alike); null when
 * the dependency is absent, which falls mermaidFetch back to the CDN. */
export function defaultLocalMermaidPath(): string | null {
  try {
    const require = createRequire(import.meta.url)
    return require.resolve('mermaid/dist/mermaid.min.js')
  } catch {
    return null
  }
}
```

</details>

#### 缺口

- 未验证实际桌面转发、凭据存储和第三方网络结果。
  **影响：**无法确认目标环境安全/离线/余额表现。
  **进一步探讨：**隔离宿主验证同源围栏、脱敏备份和本地包缺失场景；查当前官方价目。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 应怎样选择和验证此套件？

**研究主题：**效果与总成本、采用判断、新假设与验证

#### 完整回答

适合同时需要多项个性化、会话管理和本地用量视图的 DSH 用户；先在隔离 profile 的声明版本装入，导出状态备份，逐项验会话搜索/导出、Mermaid、本地用量和来源围栏，视觉与性能需人工验收。预算为本地估算而非账单真值，余额查询依赖有效 Key。若只需单一功能，广权限与状态迁移成本可能不划算。可优先增强跨进程写入的版本/CAS 或锁协议、持续校验当前价目，并把各能力的开关/权限呈现得更清楚。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:109-135](https://github.com/AlexPeng07/dsh-custom-plugin/blob/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f/README.zh.md#L109-L135)

作者描述本地估算、余额和 Key 来源。

<details>
<summary>查看原文（27行）</summary>

```text

`custom_plugin_status` 工具报告：外观配置、今日按模型用量、余额、时间线样本、Mermaid 引擎加载情况、状态文件路径与客户端诊断。插件不注入任何系统提示。

## 版本对应

| 插件版本 | 构建并实测过的 dsh | 状态 |
| --- | --- | --- |
| 0.8.x | dsh 0.1.7-rc.2、dsh 0.2.0-rc.2 与 dsh 0.2.1-rc.2（两道门都写了这三个版本，见「安装」） | 本版本 |
| 0.7.x | dsh 0.1.7-rc.2 与 dsh 0.2.0-rc.2 | 上一版；在 dsh 0.2.1-rc.2 上会被拒绝 |
| 0.6.x | dsh 0.1.7-rc.2 与 dsh 0.2.0-rc.2 | 上一版；在 dsh 0.2.1-rc.2 上会被拒绝 |
| 0.5.x | dsh 0.1.7-rc.2（peer 范围 `>=0.1.7-rc.2 <0.2.0-0`） | 在 0.1.x 上没问题；任何 0.2.x 宿主都会拒绝它，dsh 桌面版也算 |
| 0.4.2 | dsh 0.1.1-rc.1 … 0.1.6 时代 | 已被取代，在 0.1.7+ 上不要指望可用 |

0.1.7 改掉了本套件依赖的插件侧契约（会话导航归 `ctx.uiWorkspace`、会话列表不再提供
当前查看的会话、消息模型移除 `tool-result` 内容块），两个版本互不替代。dsh
0.2.1-alpha.4 又改掉了兼容门本身：优先读 `engines.dsh`，只有它缺省时才回退到
`@deepseek-ai/dsh-*` peer 范围。本包两处声明同一条范围；旧宿主读 peer，新宿主读
`engines.dsh`，`pnpm smoke` 会在两者判定不一致时判红。范围不匹配的 bundle 会在
安装与启动时被整包跳过。没有这道闸的更早宿主仍会加载插件，但表现为功能退化：实测
0.1.1-rc.2 上 8 个槽位注册成 7 个，turnTail 条目被拒（该槽位自 0.1.6-alpha.2 起由
chain 改为 list），打开会话、创建分支、跨会话搜索会提示对应服务缺失，而不是抛错。

## 安装

前置：Node 22+、pnpm，以及 `dsh` CLI（官方 npm 包 `@deepseek-ai/dsh`；未全局安装时，可用 `npx @deepseek-ai/dsh` 代替 `dsh`）。本版本面向 **dsh 0.1.7-rc.2 及其后的 0.1.x，外加 0.2.0-rc.2 与 0.2.1-rc.2**：dsh 0.2.1-alpha.4 及更新版本优先读 `engines.dsh`，仅在它缺省时回退到 `@deepseek-ai/dsh-*` peer 范围；旧宿主仍读 peer。本包两处声明同一条范围，不为没构建过的版本开口子。0.8.0 把构建与测试队列整体切到 0.2.1-rc.2。产物用桌面版自带 CLI 装进隔离的 0.2.1-rc.2 profile，**没有使用任何兼容豁免**，随后真实冷启动：boot 图 70 行、五个 `dsh.client.inject` 目标齐全、客户端 bundle 服务约 200 KB、Mermaid 本地引擎 3.57 MB、state / 用量 / 备份路由、UTF-8 往返与桌面转发信任形状全部通过（16 项通过、1 项跳过；跳过的只是无会话 profile 上的时间线/导出/搜索，该路径由单测覆盖，且 0.2.1 只新增可选 `formatStatus` 字段）。0.6.0 的产物在 0.2.0-rc.2（66 行）与 0.1.7-rc.2（65 行）上各跑过活体探针，19 项里 18 项通过；0.7.0 的产物额外在**真实桌面安装**上过了桌面形态活体探针（见下文「在 dsh 桌面版上」）。验不到的部分和以往一样：回合内的 chips（Mermaid 渲染、LaTeX）需要一次真实的模型回复，无凭据的临时家目录跑不出来，槽位渲染也仍要在浏览器里过一遍。范围刻意不收 0.2.0-rc.1、0.2.0-rc.3 及之后、0.2.0 正式版；同理也不收 0.2.1-alpha.x、0.2.1-rc.3 及之后与 0.2.1 正式版。范围的写法在这里有讲究：`^0.1.7-rc.2` 展开成 `>=0.1.7-rc.2 <0.2.0-0`，而每一个 `0.2.0-rc.N` 都排在 `0.2.0-0` **之上**，所以实测过的预发布版本必须单独写成一段——`pnpm smoke` 会检查构建目标确实落在声明范围里，并且 `engines.dsh` 与 peer 范围放行完全相同的版本。仍在旧版 dsh 的用户请安装对应的旧版插件（0.5.0 面向 0.1.7-rc.2），而不是授予兼容性豁免。

### 从 npm 安装
```

</details>

**依据 2 · 作者声明**：[README.zh.md:149-187](https://github.com/AlexPeng07/dsh-custom-plugin/blob/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f/README.zh.md#L149-L187)

作者给出版本兼容及冷启动测试报告。

<details>
<summary>查看原文（39行）</summary>

````text
这个版本，因此在桌面版上安装不需要任何兼容性豁免；0.7.1 及更早版本会被 0.2.1 的
兼容门拒绝，给出的信息和 0.2.x 的 Web profile 完全一样。

对 0.2.1-rc.2 的实测：boot 图里 70 行、我们那一行与五个 inject 目标都在、客户端
bundle 以约 200 KB 服务、Mermaid 引擎本地加载，活体宿主探针 16 项通过、1 项跳过
（跳过的是需要真实会话的会话路径）。访问围栏与官方 API 围栏同一套信任语义：回环
套接字 + 回环 Host、非 `cross-site`、`origin` 缺省或与 Host 一致即放行。壳在把
渲染进程的请求转发给它自己的 Host 之前会删掉 `host`、`origin`、`sec-fetch-site`、
`cookie`，再挂上它自己的凭证——这种无标记形状因此被直接接受（0.6.0 及之前的围栏
还额外要求同源标记，曾把这套形状全部误拒为 forbidden，0.7.0 起修复并补了围栏级
单测）。异源与跨站请求仍然 403。**0.7.0 的产物已在真实桌面安装上按桌面转发形状
逐路由实测过**（state / debug / backup / 用量扫描 / Mermaid 引擎预加载与脚本路由
全部 200，异源与跨站仍 403）；0.8.0 在冷启动的 0.2.1-rc.2 宿主上复跑了同一套形状。
桌面窗口内的视觉验收（液态玻璃观感、面板布局、点阵清除）归装它的人过目。

管桌面 profile 要用桌面版自带的 `dsh` 命令，不是 npm 装的那个——公开 CLI 拒绝
保留的 `desktop` profile：

1. 先启动一次桌面版让 profile 建立，然后完全退出（关窗口只是隐藏；Windows 上
   从托盘退出）。
2. `dsh plugin --profile desktop add @alexpeng/dsh-custom-plugin`
3. 重新打开桌面版。应用内的插件管理器也用桌面版自带的 pnpm 在同一个 profile 上
   安装和更新，不想开终端就用它。

外观、提示词库、项目文件夹、星标和用量都存在
`$DSH_HOME/custom-plugin-state.json`，这个文件按设计由桌面版和 Web 共享——两
边各自持有自己的 `profiles/<名字>`，那里面只放代码不放这个文件——所以在两者
之间切换看到的是同一份数据。两个宿主因此可能同时写它，这就是状态替换把临时文
件按写入进程的 pid 命名的原因。

### 从 GitHub 安装（源码安装）

```sh
dsh plugin --profile web add github:AlexPeng07/dsh-custom-plugin
# 重启 dsh web
```

git 安装拉取的是源码，`prepare` 脚本会在安装端构建 `lib/`。pnpm ≥10 需要一次性授权该构建——把 pnpm 提示的确切包键复制进 profile 的 `pnpm-workspace.yaml` 的 `allowBuilds` 下，再重新执行 add。走上方 npm 路线可免去构建授权。

````

</details>

**依据 3 · 源码核查**：[src/backup.ts:155-233](https://github.com/AlexPeng07/dsh-custom-plugin/blob/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f/src/backup.ts#L155-L233)

导入预览/合并及恢复副本实现。

<details>
<summary>查看原文（79行）</summary>

```text
export function backupPreview(current: CustomPluginState, backup: CustomPluginBackupV1): BackupImportPreview {
  const currentFolders = folderIds(current.folders)
  const incomingFolders = folderIds(backup.data.folders)
  const currentPrompts = new Set(current.prompts.map((item) => item.id))
  return {
    folders: incomingFolders.size,
    prompts: backup.data.prompts.length,
    starredSessions: Object.keys(backup.data.stars).length,
    usageDays: Object.keys(backup.data.usage).length,
    conflicts: {
      folders: [...incomingFolders].filter((id) => currentFolders.has(id)).length,
      prompts: backup.data.prompts.filter((item) => currentPrompts.has(item.id)).length,
      usageDays: Object.keys(backup.data.usage).filter((day) => current.usage[day] !== undefined).length,
    },
  }
}

function mergeById<T extends { id: string }>(current: readonly T[], incoming: readonly T[]): T[] {
  const replacements = new Map(incoming.map((item) => [item.id, clone(item)]))
  const out = current.map((item) => replacements.get(item.id) ?? item)
  for (const item of incoming) if (!current.some((old) => old.id === item.id)) out.push(clone(item))
  return out
}

/** Merge a folder tree by stable node id. Imported parents and sibling order
 * win for nodes present in the document; current nodes absent from it remain
 * in their existing order. This also moves a duplicate node when its parent
 * changed in the imported tree, instead of leaving a stale root copy behind. */
function mergeFolders(current: readonly FolderNode[], incoming: readonly FolderNode[]): FolderNode[] {
  const incomingIds = folderIds(incoming)
  const index = new Map<string, FolderNode>()
  const indexTree = (nodes: readonly FolderNode[]): void => {
    for (const node of nodes) { index.set(node.id, node); indexTree(node.children) }
  }
  indexTree(current)

  const retain = (node: FolderNode): FolderNode | null => {
    if (incomingIds.has(node.id)) return null
    const children = node.children.map(retain).filter((item): item is FolderNode => item !== null)
    return { id: node.id, name: node.name, children, sessionIds: clone(node.sessionIds), workspaceIds: clone(node.workspaceIds), prompts: clone(node.prompts) }
  }

  const imported = (source: FolderNode): FolderNode => {
    const currentNode = index.get(source.id)
    // Unrelated current children stay before the imported sequence; all
    // imported siblings then follow the exact order from the backup.
    const children = (currentNode?.children ?? []).map(retain).filter((item): item is FolderNode => item !== null)
      .concat(source.children.map(imported))
    return { id: source.id, name: source.name, children, sessionIds: clone(source.sessionIds), workspaceIds: clone(source.workspaceIds), prompts: clone(source.prompts) }
  }

  // The imported tree owns the ordering of imported roots. Current roots that
  // are absent from the document are appended in their existing order.
  const out = incoming.map(imported)
  for (const node of current) if (!incomingIds.has(node.id)) {
    const kept = retain(node)
    if (kept !== null) out.push(kept)
  }
  return out
}

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
  return target
}
```

</details>

**依据 4 · 源码核查**：[src/state.ts:315-386](https://github.com/AlexPeng07/dsh-custom-plugin/blob/901a665fd0ed6c50e9ed873bcc1b55cc6d16cb8f/src/state.ts#L315-L386)

跨进程状态写与合并路径。

<details>
<summary>查看原文（72行）</summary>

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
  })
}

/** Per-path view of the on-disk document this process last saw: its stat
 * identity and its serialized bytes. `$DSH_HOME` is shared by every dsh host
 * under it (Web + Desktop), so a save must first notice whether another host
 * wrote the file since. `null` marks "believed absent"; no entry at all marks
 * "never loaded through this module", where a direct save keeps the plain
 * last-writer-wins behavior. */
const syncBaselines = new Map<string, { mtimeMs: number; size: number; doc: string } | null>()

/**
 * Fold another host's writes back in before this process saves over them.
 *
 * Each host holds the whole document in memory, so an unchecked save is
 * last-writer-wins and silently discards the other host's usage folds and
 * config edits. When the file's stat identity no longer matches what this
 * process last wrote or loaded, the current bytes are re-read and three-way
 * merged against the last-saved snapshot: sections this process has not
 * touched adopt the external version, the usage ledger unions arithmetically
 * (`theirs + ours − base` per counter — exact for two hosts that both
 * started from `base`), and locally-dirty sections keep the local version.
 *
 * The stat fast path misses only a same-instant, same-length rewrite by
 * another host. An unreadable or undecodable external document falls back to
 * the plain overwrite — the boot-time quarantine remains the backstop for
 * the destructive case.
 */
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
}

function safeParse(text: string): CustomPluginState | null {
```

</details>

#### 缺口

- 未独立验证实际时间收益、宿主版本矩阵和价格正确性。
  **影响：**推荐只限隔离试用，不能推广为生产稳定。
  **进一步探讨：**真实工作流记录任务耗时、功能冲突、状态并发结果和账单对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
