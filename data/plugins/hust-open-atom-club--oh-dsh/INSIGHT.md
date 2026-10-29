# Oh-DSH

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[9a428a8](https://github.com/hust-open-atom-club/oh-dsh/tree/9a428a8ccfa327afed6fe83142f5e65c8367f5fa)

<!-- BEGIN META -->
[![GitHub ★ 323](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=323&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hust-open-atom-club/oh-dsh)
<!-- END META -->

> **功能**：围绕同一 DSH runtime 提供 Desktop、Web、TUI 发行表面及带预览/恢复的插件市场。

> **亮点**：发行/表面契约整合与候选Profile预览/恢复减少接线；不证明真实任务效率。见[Q01](#research-q01)。

> **主要限制**：共享不是三端同时可写；apply工具202/accepted只是排队，重启后需读snapshot与功能，Undo仅回退Profile不撤外部副作用。见[Q02](#research-q02)。

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
  - [Q01 · 实际分发类型、任务和基线贡献？](#detail-section-11)
  - [Q02 · 三端共享如何成立，市场交易怎样恢复？](#detail-section-12)
  - [Q03 · 什么依赖、写入和升级退出边界？](#detail-section-13)
  - [Q04 · 总成本、验收和采用建议？](#detail-section-14)
  - [Q05 · 可迁移机制与可证伪产品方向？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：跨桌面、Web及SSH终端开发的DSH用户需要组织同一会话/插件状态；单端用户可先保留原入口。见[Q01](#research-q01)。

原生DSH与分别组合TUI、侧栏、皮肤和市场；终端/Git等上游能力不算本项目原创。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 价值 | 条件或边界 |
|---|---|---|
| 多surface发行 | 按场景选择桌面/Web/终端 | 复用DSH和上游插件，不是新Agent引擎 |
| 共享根与锁 | 组织历史/凭据并限制竞争 | 后开表面可只读，非所有写全局保证 |
| 市场候选预览 | 固定来源并分开当前Profile | 进程隔离按平台能力 |
| apply/Undo | 保留旧Profile与重启恢复 | accepted非完成，不撤外部副作用 |

**流程与依赖**

需相应平台发行runtime、Profile与任务环境，隔离能力按平台核对；表见[Q04](#research-q04)。

独立根试单端任务、再试切换/只读，市场应用重连回读，Undo与外部副作用分验；表见[Q04](#research-q04)。

**效果与成本**

迁移、构建/升级兼容、重启与恢复复核成本未知，不据功能数量推算节时；表见[Q04](#research-q04)。

统一入口和恢复代码有依据，真实跨平台可用性与总效率未验证；效果见[Q04](#research-q04)。

> **思考**：共享不是三端同时可写；apply工具202/accepted只是排队，重启后需读snapshot与功能，Undo仅回退Profile不撤外部副作用。见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：发行/表面契约整合与候选Profile预览/恢复减少接线；不证明真实任务效率。见[Q01](#research-q01)。

单owner、多入口、候选/当前/历史与表面适用性可迁移；多步切换不等于全局原子，维护依赖固定上游契约。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

共享不是三端同时可写；apply工具202/accepted只是排队，重启后需读snapshot与功能，Undo仅回退Profile不撤外部副作用。见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

保持观察；熟悉DSH且有跨端需要者可主动用独立根做临时工程验证。重连未知、预期外写或Undo无效时停止迁移，保留日志并退回原入口。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

bundle/数据根/锁及市场事务有源码依据；平台发行与真实工具任务未运行。本轮观察，假设不计现有效果。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、docs/design.zh.md、src/plugin.ts、src/data-root.ts、src/runtime-lock.ts、src/runtime-paths.ts、src/web.ts、src/tui.ts、src/main.ts、src/marketplace-tools.ts、plugins/shared/read-only.ts、plugins/plugin-marketplace/src/host/transaction-manager.ts、plugins/plugin-marketplace/src/host/agent-gateway.ts、scripts/stage-dsh.mjs、install.sh 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：阅读根包/Host入口、设计边界，重点检查数据根、运行锁、Web启动和市场prepare/preview/apply/Undo及Agent网关；只定向看POSIX安装器，未覆盖所有UI、平台分支或上游全部源码，不运行目标。
- 下一步：后续用固定发行包和可丢弃数据根测试切换、第二surface只读、202断线、startLive失败及Undo，再验同任务结果。

**分析版本**

- **仓库**：[hust-open-atom-club/oh-dsh](https://github.com/hust-open-atom-club/oh-dsh)
- **版本号**：0.2.0（[固定提交 9a428a8](https://github.com/hust-open-atom-club/oh-dsh/tree/9a428a8ccfa327afed6fe83142f5e65c8367f5fa)）
- **版本日期**：2026-09-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是用transactionId串联受理、重启ready和目标surface功能探针的最终变更回执；以202断连/启动失败比较误报与恢复时间，简单snapshot足够则止于轻量提示。见[Q05](#research-q05)。

后续用固定发行包和可丢弃数据根测试切换、第二surface只读、202断线、startLive失败及Undo，再验同任务结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1544 | 88199 | — | — | 2063900 |
| .ts | source | 121 | 21321 | 18487 | 1332 | — |
| .tsx | source | 12 | 6883 | 6349 | 167 | — |
| .mjs | source | 26 | 5503 | 4749 | 387 | — |
| .cjs | source | 4 | 572 | 519 | 33 | — |
| .ts | test | 56 | 11997 | 10929 | 252 | — |
| .js | source | 1 | 626 | 559 | 18 | — |

</details>

**活跃度**

[![Issue 未关闭 33](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=33&color=737b86&logo=github)](https://github.com/hust-open-atom-club/oh-dsh/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/hust-open-atom-club/oh-dsh/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/hust-open-atom-club/oh-dsh/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多surface发行的真实统一与恢复边界，是否值得迁移？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 实际分发类型、任务和基线贡献？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根包同时是Oh-DSH发行工作台与可加载DSH bundle：package main是Electron dist/main.js，exports指向dist/plugin.js，有dsh.bundle和客户端注入；src/plugin.ts确实声明apply，提供desktop/surface服务、systemPrompt和市场工具。因此此固定根组件真实entry_type仍是plugin，不能因为桌面发行形态就改为只有说明文档，也不能把整个发行当一个轻量换肤插件。

针对经常在桌面、本地Web和SSH终端做开发的DSH用户，任务是组织workspace、会话和插件组合，同时减少各入口各自装runtime/配置。基线是原生DSH加分别安装终端、侧栏、皮肤和市场，或选一个界面。贡献在统一启动、独立Profile配共享数据目录，以及有来源锁/预览/撤销的市场适配。

设计明确终端渲染来自dsh-TUI，PTY/Git/文件Host来自Better Sidebar，AI工具和会话来自DSH。不能把这些上游能力的全部价值或原生多模态归为Oh-DSH创新。本轮检视的是根表面契约、共享运行锁与市场恢复链；没有逐一验收所有内置UI、Git推送或模型真实任务。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-58](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/package.json#L1-L58)

发行main及bundle/client分发。

<details>
<summary>查看原文（58行）</summary>

```text
{
  "name": "@oh-dsh/desktop",
  "productName": "Oh-DSH Desktop",
  "version": "0.2.0",
  "description": "Oh-DSH: installable Desktop, Web, and TUI surfaces over DeepSeek Harness",
  "author": "dsh-external",
  "desktopName": "oh-dsh-desktop.desktop",
  "private": true,
  "ohDshRuntimeContract": 1,
  "type": "module",
  "main": "dist/main.js",
  "bin": {
    "ohdsh": "bin/ohdsh"
  },
  "exports": {
    ".": {
      "default": "./dist/plugin.js"
    },
    "./client": "./dist/client.js",
    "./cordis.patch.yml": "./dist/cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "dist/plugin.js",
    "dist/client.js",
    "dist/client.js.map",
    "dist/cordis.patch.yml",
    "dist/ohdsh.js",
    "bin/ohdsh",
    "bin/ohdsh.cmd"
  ],
  "dsh": {
    "bundle": {
      "patch": "./dist/cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@oh-dsh/desktop-frame",
        "@oh-dsh/panel-controls",
        "@oh-dsh/pinned-summary",
        "@oh-dsh/sidebar",
        "@oh-dsh/plugin-marketplace"
      ],
      "platform": "web",
      "immediately": true
    }
  },
  "scripts": {
    "build": "node scripts/build.mjs",
    "build:pages": "node scripts/build-pages.mjs",
    "build:dsh": "node scripts/build-dsh.mjs",
    "stage:dsh": "node scripts/stage-dsh.mjs",
    "check:plugins": "node scripts/smoke-runtime.mjs",
    "smoke:runtime": "node scripts/smoke-runtime.mjs",
    "smoke:app": "node scripts/smoke-runtime.mjs \"release/mac-arm64/Oh-DSH Desktop.app/Contents/Resources\"",
    "smoke:app:linux": "node scripts/smoke-runtime.mjs \"release/linux-unpacked/resources\"",
    "smoke:web": "node scripts/smoke-web.mjs",
    "smoke:web:package": "node scripts/smoke-web.mjs release",
```

</details>

**依据 2 · 源码核查**：[src/plugin.ts:41-104](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/src/plugin.ts#L41-L104)

真实Host apply与服务注入。

<details>
<summary>查看原文（64行）</summary>

```text
/** Stable Cordis plugin name. */
export const name = 'oh-dsh-desktop'

/** Desktop facts and guarded marketplace tools are the only Host concerns. */
export const inject = ['tools']

/** Immutable Host-side desktop capability published to other DSH plugins. */
export interface DesktopHostCapability {
  appDataPath: string
  kind: 'electron'
  platform: NodeJS.Platform
  profile: string
  version: string
}

function environmentCapability(): DesktopHostCapability {
  return Object.freeze({
    appDataPath: process.env.DSH_DESKTOP_APP_DATA ?? '',
    kind: 'electron',
    platform: process.platform,
    profile: process.env.DSH_DESKTOP_PROFILE ?? 'desktop',
    version: process.env.DSH_DESKTOP_VERSION ?? '0.0.0',
  })
}

function desktopPrompt(capability: DesktopHostCapability): string {
  return `You are interacting with the user through Oh-DSH Desktop ${capability.version} on ${capability.platform}. `
    + 'Oh-DSH Desktop is an Electron distribution backed by DeepSeek Harness. '
    + 'Native window actions, workspaces, panels, files, tools, skills, subagents, and other agent capabilities are composed through DSH plugins. '
    + 'Manage desktop plugins only with desktop_plugin_* tools: prepare every change, inspect risk, use the isolated preview, and apply only after approval. '
    + 'When the user says “this app” without naming another target, they mean Oh-DSH Desktop. '
    + 'Identify this surface as Oh-DSH Desktop backed by DeepSeek Harness.'
}

/** Mount the native desktop capability in the DSH graph. */
export function apply(ctx: HostContext): void {
  mountReadOnlyGuard(ctx)
  const capability = environmentCapability()
  ctx.provide('desktop', capability)
  // The unified three-surface contract: desktop shell (see
  // plugins/shared/surface.ts). The `desktop` service above stays for
  // third-party plugins written against the desktop distribution.
  ctx.provide(OH_DSH_SURFACE_SERVICE, Object.freeze({
    dataRoot: capability.appDataPath,
    kind: 'desktop',
    platform: capability.platform,
    profile: capability.profile,
    version: capability.version,
  } satisfies OhDshSurface))
  mountMarketplaceAgentTools(ctx)

  ctx.inject(['systemPrompt'], (promptCtx) => {
    promptCtx.systemPrompt.section({
      name: 'app:oh-dsh-desktop-surface',
      order: -98,
      text: () => desktopPrompt(capability),
    })
    promptCtx.systemPrompt.section({
      name: 'app:oh-dsh-human-approval',
      order: -90,
      text: () => humanApprovalGuidance(),
    })
  })

```

</details>

**依据 3 · 源码核查**：[docs/design.zh.md:50-70](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/docs/design.zh.md#L50-L70)

上游与下游适配边界。

<details>
<summary>查看原文（21行）</summary>

```text

| Plugin | 来源关系 | Oh-DSH 边界 |
| --- | --- | --- |
| `@oh-dsh/desktop` | 自研 | 统一入口、窗口、菜单、bridge 和内置插件注册 |
| `@oh-dsh/better-sidebar-runtime` | 固定跟踪 [`DSH-better-sidebar`](https://github.com/omdsh-dev/DSH-better-sidebar) | 编译上游 Host；提供 PTY、Files、Git、历史和 commit diff |
| `@oh-dsh/sidebar` | Better Sidebar 的下游 UI 适配 | 复用 Host，保留 Oh-DSH 布局、图标、主题、Review 与评论交互 |
| `@oh-dsh/panel-controls` | 对 `dsh-web-panel` 交互模型的下游实现 | 提供统一 Terminal dock，不要求单独安装 Web Terminal |
| `@oh-dsh/pinned-summary` | 自研 | 会话摘要、半高卡片和正文 gutter 管理 |
| `@oh-dsh/plugin-marketplace` | 吸收 `plugin-registry` 与 `dsh-hub` 的生命周期设计 | 单一 Loader、隔离预览、风险确认、TOFU 来源锁与恢复 |
| `@oh-dsh/skins` | 对 `dsh-skins` ThemeService 扩展模型的下游实现 | 一套皮肤 ID、Host 持久化，以及 Web/Desktop CSS 与 TUI 调色板适配器 |
| `@deepseek-harness-tui/dsh-tui` | 固定跟踪 [`dsh-TUI`](https://github.com/ccch1mneyyy/dsh-TUI) | 上游拥有终端渲染、会话交互、命令、扩展接口与终端兼容性 |
| `@oh-dsh/tui` | `dsh-TUI` 的下游 Profile 适配 | 统一 `ohdsh tui`、Oh-DSH TUI 标题、默认值、发行打包和 DSH 数据边界 |

下游插件会定期检查上游 feature，并在当前 DSH 契约上重新适配。上游代码、
Oh-DSH UI 和最终权限边界不会混为一层。

`@oh-dsh/skins` 是三个交互面的唯一皮肤定义模块。Web 与 Desktop 把定义
适配为 DSH CSS token；TUI 把同一组 ID 适配为上游原生 `/theme` 调色板。
TUI 仍使用上游的热切换与选择器，选择会在下一次启动时回写统一的
`skins.json`，没有第二套主题 Loader。

```

</details>

#### 缺口

- 未完成三端真实开发任务对比
  **影响**：不能称工作效率或跨平台成功已验证
  **进一步探讨**：同一非敏感工程分别用原DSH和Oh-DSH验证切换与恢复时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 三端共享如何成立，市场交易怎样恢复？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

默认数据根.ohdsh，可用OH_DSH_HOME统一覆盖；各surface有独立Profile但数据在同根。共享不意味着三端同时自由写同会话：跨surface runtime-lock采用独占wx文件和进程身份，活跃Owner存在时tryAcquire返回readOnly，Web/TUI等传OH_DSH_READ_ONLY；mountReadOnlyGuard阻断sessionPersistence.create/append。这个guard只显示会话写保护，不足以证明任意第三方插件、凭据文件或外部workspace所有写入都被全局沙箱拦住。市场manager也独立拒绝readOnly下变更，不能泛称“全应用只读无任何副作用”。

市场先固定来源commit/manifest哈希并做风险要求，再复制当前Profile到candidateHome，执行安装和预览；确认项不足直接拒绝，Agent不能确认无沙箱构建。preview的isolated来自platform.scriptSandboxAvailable，源码允许无进程隔离的显式路径，因此隔离是平台/条件属性，不是所有安装恒定保证。

apply停止preview/live，把当前Profile移去backup、candidate移入当前，复制repository缓存并重建node_modules连接，startLive失败走旧Profile回滚；成功后写rollback-state并清理preview，提供Undo。它解决的是Profile组合回退，不能撤销插件在preview/live已产生的外部网络或workspace写入。整个切换包含多次rename、缓存复制、安装与重启，不能把方法描述中的atomically理解为跨所有文件、进程和副作用的单一原子事务。

Agent工具pre-execute对apply/recover返回ask；工具通过loopback随机Bearer网关调用同manager。由于apply会重启发起工具的runtime，网关先202 accepted/deferred，再延迟执行；工具只检查deferred、concludeTurn并返回accepted。这明确是“已受理”，不是“插件已应用成功”。必须重连读取snapshot、实际Profile与功能，才能确定是否成功或回滚。apply代码中的store重建失败先警告而不直接失败，后续startLive可触发回滚，不能仅凭没有重建异常就承诺模块链接正常。

#### 证据与依据

**依据 1 · 源码核查**：[src/data-root.ts:68-90](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/src/data-root.ts#L68-L90)

共享根和覆盖。

<details>
<summary>查看原文（23行）</summary>

```text
  return join(userHome, DEFAULT_OH_DSH_HOME_DIRECTORY)
}

/** Resolve the shared state root, honoring the cross-surface override. */
export function resolveOhDshHome(
  env: NodeJS.ProcessEnv = process.env,
  userHome: string = homedir(),
): string {
  const configured = env[OH_DSH_HOME_ENV]
  return resolve(configured === undefined || configured === ''
    ? defaultOhDshHome(userHome)
    : configured)
}

/** Whether a caller explicitly selected a shared state root. */
export function hasOhDshHomeOverride(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  const configured = env[OH_DSH_HOME_ENV]
  return configured !== undefined && configured !== ''
}

/** Keep Electron's Chromium data contained below the shared state root. */
```

</details>

**依据 2 · 源码核查**：[src/runtime-lock.ts:188-221](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/src/runtime-lock.ts#L188-L221)

独占运行锁。

<details>
<summary>查看原文（34行）</summary>

```text
 * Acquire an exclusive lock for one Oh-DSH surface on a shared data root.
 *
 * The lock is a small JSON file created with `wx`, so concurrent acquisitions
 * cannot clobber each other. A lock whose owning PID and tracked runtime child
 * PIDs are no longer alive is considered stale and is replaced. Stale
 * reclamation is serialized by a separate reclaim lock so concurrent
 * reclaimers cannot delete a freshly created live lock.
 */
export function acquireRuntimeLock(dataRoot: string, surface: string): RuntimeLock {
  mkdirSync(dataRoot, { recursive: true, mode: 0o700 })
  const path = join(dataRoot, LOCK_FILE_NAME)
  const reclaimPath = `${path}.reclaim`

  for (let attempt = 0; attempt < MAX_RECLAIM_WAIT_ATTEMPTS; attempt += 1) {
    let handle: number | undefined
    try {
      handle = openSync(path, 'wx', 0o600)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
      const info = readLockInfo(path)
      if (info !== undefined && hasLiveOwner(info)) {
        throw new RuntimeLockContendedError(lockOwnerMessage(info, dataRoot))
      }
      if (info === undefined && isStaleLockFile(path) === false) {
        throw new UsageError(
          `runtime lock at ${path} is being acquired or unreadable; `
          + 'remove it manually if no other Oh-DSH surface is running',
        )
      }
      // The lock is absent, left by a dead process and dead children, or old
      // enough to be a stale unparsable file. Serialize recovery with a
      // separate reclaim lock: only one reclaimer can hold it, and it re-reads
      // the main lock after acquiring it so a fresh live lock is never moved.
      let reclaimHandle: number | undefined
```

</details>

**依据 3 · 源码核查**：[src/runtime-lock.ts:341-357](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/src/runtime-lock.ts#L341-L357)

冲突只读结果。

<details>
<summary>查看原文（17行）</summary>

```text
 * Try to acquire the data-root lock. If another surface already owns it,
 * return a read-only result instead of throwing, so the caller can start a
 * viewer that may read shared history but must not write to active sessions.
 */
export function tryAcquireRuntimeLock(
  dataRoot: string,
  surface: string,
): { lock: RuntimeLock | undefined; readOnly: boolean } {
  try {
    return { lock: acquireRuntimeLock(dataRoot, surface), readOnly: false }
  } catch (error) {
    if (error instanceof RuntimeLockContendedError) {
      return { lock: undefined, readOnly: true }
    }
    throw error
  }
}
```

</details>

**依据 4 · 源码核查**：[plugins/shared/read-only.ts:33-43](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/plugins/shared/read-only.ts#L33-L43)

只阻会话create/append。

<details>
<summary>查看原文（11行）</summary>

```text

/** Install write blocking when the runtime was launched as a viewer. */
export function mountReadOnlyGuard(ctx: ReadOnlyHostContext): void {
  if (process.env.OH_DSH_READ_ONLY !== '1') return
  ctx.inject(['sessionPersistence'], persistenceCtx => {
    const persistence = persistenceCtx.get('sessionPersistence') as
      ReadOnlyPersistence | undefined
    if (persistence === undefined) return
    persistence.create = async () => { throw readOnlyError() }
    persistence.append = async () => { throw readOnlyError() }
  })
```

</details>

**依据 5 · 源码核查**：[plugins/plugin-marketplace/src/host/transaction-manager.ts:748-788](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/plugins/plugin-marketplace/src/host/transaction-manager.ts#L748-L788)

只读市场阻写及Agent不能批准无沙箱。

<details>
<summary>查看原文（41行）</summary>

```text
  async dispatch(
    command: MarketplaceCommand,
    principal: MarketplaceDispatchPrincipal = 'human-ui',
  ): Promise<MarketplaceSnapshot> {
    if (this.#busy) return this.getSnapshot()
    if (this.#options.readOnly === true
      && command.type !== 'refresh'
      && command.type !== 'load-repository-stats') {
      this.#lastAction = command.type
      this.#error = 'The marketplace is read-only while another Oh-DSH surface holds the runtime lock.'
      return this.getSnapshot()
    }
    this.#busy = true
    this.#error = null
    try {
      switch (command.type) {
        case 'refresh':
          await this.refresh(command.force === true)
          break
        case 'load-repository-stats':
          await this.loadRepositoryStats(command.pluginId)
          break
        case 'inspect':
          await this.inspect(command.action, command.pluginId)
          break
        case 'prepare':
          await this.prepare(command.action, command.pluginId)
          break
        case 'preview':
          if (principal === 'agent' && command.confirmations?.includes('accept-unsandboxed-build')) {
            throw new Error('unsandboxed marketplace builds require direct human approval')
          }
          await this.preview(command.confirmations ?? [])
          break
        case 'discard':
          await this.discard()
          break
        case 'apply':
          await this.applyPreview()
          break
        case 'undo':
```

</details>

**依据 6 · 源码核查**：[plugins/plugin-marketplace/src/host/transaction-manager.ts:1009-1024](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/plugins/plugin-marketplace/src/host/transaction-manager.ts#L1009-L1024)

确认与candidate复制。

<details>
<summary>查看原文（16行）</summary>

```text
  private async preview(confirmations: readonly MarketplaceConfirmation[]): Promise<void> {
    const plan = this.#plan
    if (plan === null) throw new Error('Inspect a plugin before starting its preview.')
    if (this.#active !== null) throw new Error('A plugin preview is already active.')
    const missing = plan.requirements.filter(requirement => !confirmations.includes(requirement))
    if (missing.length > 0) {
      throw new Error(`Preview requires explicit confirmation: ${missing.join(', ')}`)
    }
    const sandboxAvailable = this.#options.platform.scriptSandboxAvailable !== false
    const confineBuild = sandboxAvailable || !confirmations.includes('accept-unsandboxed-build')
    const transactionId = randomUUID()
    const root = join(this.#previewsRoot, transactionId)
    const candidateHome = join(root, 'dsh')
    const candidateProfile = join(candidateHome, 'profiles', this.#options.profile)
    copyDirectory(this.#profileDir, candidateProfile)
    try {
```

</details>

**依据 7 · 源码核查**：[plugins/plugin-marketplace/src/host/transaction-manager.ts:1159-1186](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/plugins/plugin-marketplace/src/host/transaction-manager.ts#L1159-L1186)

隔离标识取平台能力。

<details>
<summary>查看原文（28行）</summary>

```text
      const preview: MarketplacePreview = {
        action: plan.action,
        isolated: sandboxAvailable,
        pluginId: plan.pluginId,
        previewUrl: null,
        resolvedCommit: plan.resolvedCommit,
        startedAt: new Date().toISOString(),
        transactionId,
      }
      this.#active = { candidateHome, candidateProfile, preview, root }
      const started = await this.#options.runtime.startPreview({
        dshHome: candidateHome,
        pluginId: plan.pluginId,
        sandboxRoot: root,
        sandboxed: sandboxAvailable,
        transactionId,
      })
      if (started.url !== undefined) {
        this.#active = {
          ...this.#active,
          preview: { ...preview, previewUrl: started.url },
        }
      }
      this.#lastAction = sandboxAvailable
        ? `Isolated ${plan.action} preview is ready for ${plan.pluginId}.`
        : `${plan.action} preview is ready for ${plan.pluginId} without process isolation.`
    } catch (error) {
      this.#active = null
```

</details>

**依据 8 · 源码核查**：[plugins/plugin-marketplace/src/host/transaction-manager.ts:1227-1286](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/plugins/plugin-marketplace/src/host/transaction-manager.ts#L1227-L1286)

实际应用多步与回滚。

<details>
<summary>查看原文（60行）</summary>

```text
  private async applyPreview(): Promise<void> {
    const active = this.#active
    if (active === null) throw new Error('There is no prepared preview to apply.')
    await this.#options.runtime.stopPreview()
    await this.#options.runtime.stopLive()
    const rollbackRoot = join(this.#rollbacksRoot, active.preview.transactionId)
    const backupProfile = join(rollbackRoot, this.#options.profile)
    mkdirSync(rollbackRoot, { recursive: true, mode: 0o700 })
    let candidateInstalled = false
    try {
      renameSync(this.#profileDir, backupProfile)
      renameSync(active.candidateProfile, this.#profileDir)
      candidateInstalled = true
      const candidateCache = join(active.candidateHome, 'cache', 'repository-plugins')
      if (existsSync(candidateCache)) {
        const liveCache = join(this.#options.dshHome, 'cache', 'repository-plugins')
        mkdirSync(dirname(liveCache), { recursive: true, mode: 0o700 })
        cpSync(candidateCache, liveCache, { recursive: true, preserveTimestamps: true })
      }
      // The applied profile's node_modules was linked from the preview's
      // store, which is deleted with the preview root below. Re-home it
      // against the persistent home store (unsandboxed) so the live profile
      // never references a vanished store. Best effort: the hard links keep
      // the tree usable even if this fails, and the dsh CLI self-heals the
      // store reference on the next pnpm command.
      try {
        removeWithin(this.#profileDir, join(this.#profileDir, 'node_modules'), this.#warn)
        rmSync(join(this.#profileDir, 'pnpm-lock.yaml'), { force: true })
        await this.#options.platform.runDsh({
          args: ['plugin', '--profile', this.#options.profile, 'install', '--ignore-scripts'],
          dshHome: this.#options.dshHome,
          sandboxRoot: this.#options.appDataPath,
          sandboxed: false,
        })
      } catch (error) {
        this.#options.onWarn?.(`applied profile store could not be re-homed: ${message(error)}`)
      }
      await this.#options.runtime.startLive()
    } catch (error) {
      await this.#options.runtime.stopLive().catch(() => {})
      if (candidateInstalled && existsSync(this.#profileDir)) {
        const failed = join(rollbackRoot, 'failed-candidate')
        renameSync(this.#profileDir, failed)
      }
      if (existsSync(backupProfile)) renameSync(backupProfile, this.#profileDir)
      await this.#options.runtime.startLive().catch(() => {})
      throw new Error(`plugin preview failed to apply and was rolled back: ${message(error)}`)
    }
    this.#rollback = {
      appliedAt: new Date().toISOString(),
      backupProfile,
      pluginId: active.preview.pluginId,
      transactionId: active.preview.transactionId,
    }
    writeJsonAtomic(this.#rollbackStatePath, this.#rollback)
    removeWithin(this.#previewsRoot, active.root, this.#warn)
    this.#active = null
    this.#plan = null
    this.#lastAction = `Applied ${active.preview.pluginId}; the previous profile remains available for Undo.`
    this.remapCatalogInstalled()
```

</details>

**依据 9 · 源码核查**：[src/marketplace-tools.ts:200-213](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/src/marketplace-tools.ts#L200-L213)

Host审批hook。

<details>
<summary>查看原文（14行）</summary>

```text
  ctx.on('tools/pre-execute', async (exec, next) => {
    if (exec.name === 'desktop_plugin_apply') {
      return {
        kind: 'ask',
        reason: 'Apply the tested plugin preview to Oh-DSH Desktop?',
      }
    }
    if (exec.name === 'desktop_plugin_recover') {
      return {
        kind: 'ask',
        reason: 'Restore the previous Oh-DSH Desktop plugin profile?',
      }
    }
    return await next()
```

</details>

**依据 10 · 源码核查**：[src/marketplace-tools.ts:331-357](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/src/marketplace-tools.ts#L331-L357)

工具返回accepted。

<details>
<summary>查看原文（27行）</summary>

```text
  ctx.tools.register(marketplaceTool({
    name: 'desktop_plugin_apply',
    description: 'After human approval, atomically apply the active isolated preview and keep the previous profile recoverable. This restarts the live DSH runtime.',
    parameters: {},
    async execute(_args, exec) {
      const response = await gateway(credentials, {
        type: 'dispatch',
        command: { type: 'apply' },
      })
      if (response.deferred !== true) throw new Error('desktop apply was not scheduled')
      exec.concludeTurn()
      return result('Plugin apply accepted. The desktop runtime will restart now.')
    },
  }))

  ctx.tools.register(marketplaceTool({
    name: 'desktop_plugin_recover',
    description: 'After human approval, restore the previous plugin profile and restart the live DSH runtime.',
    parameters: {},
    async execute(_args, exec) {
      const response = await gateway(credentials, {
        type: 'dispatch',
        command: { type: 'undo' },
      })
      if (response.deferred !== true) throw new Error('desktop recovery was not scheduled')
      exec.concludeTurn()
      return result('Plugin recovery accepted. The desktop runtime will restart now.')
```

</details>

**依据 11 · 源码核查**：[plugins/plugin-marketplace/src/host/agent-gateway.ts:101-122](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/plugins/plugin-marketplace/src/host/agent-gateway.ts#L101-L122)

202之后延迟执行而非完成。

<details>
<summary>查看原文（22行）</summary>

```text
        const snapshot = await manager.dispatch(command, 'agent')
        json(response, 200, { accepted: true, deferred: false, snapshot })
        return
      }
      if (deferredPending) throw new Error('a marketplace restart action is already pending')
      const snapshot = manager.getSnapshot()
      if (command.type === 'apply' && snapshot.preview === null) {
        throw new Error('there is no isolated preview to apply')
      }
      if (command.type === 'undo' && !snapshot.undoAvailable) {
        throw new Error('there is no previous profile to recover')
      }
      deferredPending = true
      json(response, 202, { accepted: true, deferred: true, snapshot })
      setTimeout(() => {
        void manager.dispatch(command, 'agent')
          .then(result => {
            if (result.error !== null) options.onError?.(new Error(result.error))
          })
          .catch(options.onError ?? (() => {}))
          .finally(() => { deferredPending = false })
      }, options.deferMs ?? DEFAULT_DEFER_MS)
```

</details>

#### 缺口

- 锁竞争、审批、重启断线与多步切换没有故障注入
  **影响**：不能保证每个平台恢复一致或已证明所有写受控
  **进一步探讨**：用临时根制造第二surface、提交后断线和startLive失败，重连查snapshot与磁盘。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么依赖、写入和升级退出边界？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

发行将Node与DSH runtime分目录带入，runtime-paths解析node-runtime和dsh-runtime入口；Web启动先检查两入口存在再建数据根、锁与Profile，用DSH_HOME/OH_DSH_HOME指向同根。源码开发仍需Node/pnpm及相应平台构建环境和上游源/锁定依赖准备，不能把下载发行包“不必另装Node”套给源码checkout。

安装器在下载校验后才进入替换，staged payload与previous目录分开；目标非空且没有匹配surface安装标记则拒绝覆盖。移动失败可恢复previous，launcher与marker写好后才删除旧payload。这个设计减少明显误覆盖，不等于签名独立信任链或升级途中任意时刻断电都已演练。检查的是POSIX install.sh主要路径，不泛化Windows/macOS所有分支。

应用数据包括共享会话、凭据、缓存、skin/sidebar和市场状态，Electron另在根下desktop保存浏览器数据；首次旧目录迁移采用已有目的文件优先而非盲覆盖。卸载surface/替换程序与删除这些数据不是同一件事。试用优先独立OH_DSH_HOME，保留原DSH目录和原启动入口，不导入真实凭据；退出时要按需处理共享凭据、会话和外部工程变更，而非只删应用包。

工程价值在表面服务、平台runtime路径、单一市场owner、候选/当前/历史分开；风险在固定上游契约与多下游适配的维护面。启用一个Web-only插件不意味着TUI有UI入口，安装状态应和当前surface实际可用性分开验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/runtime-paths.ts:33-65](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/src/runtime-paths.ts#L33-L65)

打包runtime路径。

<details>
<summary>查看原文（33行）</summary>

```text
  resourcesRoot: string,
  platform: NodeJS.Platform = process.platform,
  dshRuntimeRootOverride?: string,
): BundledRuntimePaths {
  const paths = pathApi(platform)
  const runtimeRoot = dshRuntimeRootOverride ?? paths.join(resourcesRoot, 'dsh-runtime')
  const nodeRoot = paths.join(resourcesRoot, 'node-runtime')
  const nodeBinDirectory = platform === 'win32'
    ? nodeRoot
    : paths.join(nodeRoot, 'bin')
  return {
    cliEntry: paths.join(runtimeRoot, 'lib', 'bin.js'),
    desktopBootEntry: paths.join(runtimeRoot, 'lib', 'ohdsh-desktop.mjs'),
    nodeBinary: paths.join(nodeBinDirectory, platform === 'win32' ? 'node.exe' : 'node'),
    nodeBinDirectory,
    pnpmBinary: paths.join(nodeBinDirectory, platform === 'win32' ? 'pnpm.cmd' : 'pnpm'),
    pnpmEntry: paths.join(
      nodeRoot,
      ...(platform === 'win32' ? ['node_modules'] : ['lib', 'node_modules']),
      'pnpm',
      'bin',
      'pnpm.mjs',
    ),
    runtimeRoot,
  }
}

/** Put bundled commands first without applying POSIX PATH rules on Windows. */
export function runtimeSearchPath(
  paths: BundledRuntimePaths,
  environment: NodeJS.ProcessEnv = process.env,
  platform: NodeJS.Platform = process.platform,
): string {
```

</details>

**依据 2 · 源码核查**：[src/web.ts:220-291](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/src/web.ts#L220-L291)

检查、启动Profile和数据根。

<details>
<summary>查看原文（72行）</summary>

```text
  const stagedNode = process.platform === 'win32'
    ? join(root, '.stage', 'node-runtime', 'node.exe')
    : join(root, '.stage', 'node-runtime', 'bin', 'node')
  const resourcesRoot = env.DSH_OH_WEB_ROOT !== undefined
    ? root
    : existsSync(stagedNode)
      ? join(root, '.stage')
      : root
  const paths: BundledRuntimePaths = bundledRuntimePaths(resourcesRoot)
  if (!existsSync(paths.nodeBinary)) {
    throw new Error(`packaged Node runtime is missing: ${paths.nodeBinary}`)
  }
  if (!existsSync(paths.cliEntry)) {
    throw new Error(`packaged DSH CLI is missing: ${paths.cliEntry}`)
  }

  mkdirSync(dataRoot, { recursive: true, mode: 0o700 })
  const { lock: runtimeLock, readOnly } = tryAcquireRuntimeLock(dataRoot, 'web')
  if (runtimeLock !== undefined) {
    process.once('exit', () => { runtimeLock.release() })
  }
  if (readOnly === false) {
    const migration = migrateLegacyWebState({
      dataRoot,
      ...(!hasOhDshHomeOverride(env) && dataRoot === defaultDataRoot
        ? { legacyDefaultDataRoot: legacyWebDataRoot() }
        : {}),
    })
    if (!migration.complete) {
      throw new Error(
        `legacy Web state migration under ${dataRoot} is incomplete; `
        + 'restore unavailable link targets and retry',
      )
    }
  }
  if (readOnly === false || !existsSync(join(dataRoot, 'profiles', WEB_PROFILE))) {
    ensureWebProfile(dataRoot)
  }

  const logTail: string[] = []
  const runtime = runtimeFactory({
    args: [
      '--profile', WEB_PROFILE,
      '--host', options.host,
      '--port', String(options.port),
      ...options.trustedHosts.flatMap(host => ['--trusted-host', host]),
      // The launcher owns the browser handoff (--open/--no-open, interactive
      // default, DSH_OH_WEB_OPEN below); without this flag dsh-web-app's
      // webStartup default would open a second tab on top of it.
      '--no-open',
    ],
    cliEntry: paths.cliEntry,
    cwd: dataRoot,
    env: {
      ...env,
      DSH_HOME: dataRoot,
      DSH_OH_WEB: '1',
      DSH_OH_WEB_DATA: dataRoot,
      DSH_OH_WEB_PROFILE: WEB_PROFILE,
      DSH_OH_WEB_VERSION: version,
      NODE_USE_ENV_PROXY: '1',
      OH_DSH_HOME: dataRoot,
      OH_DSH_READ_ONLY: readOnly ? '1' : '0',
      OH_DSH_MARKETPLACE_CLI_ENTRY: paths.cliEntry,
      OH_DSH_MARKETPLACE_NODE_BINARY: paths.nodeBinary,
      OH_DSH_MARKETPLACE_PNPM_ENTRY: paths.pnpmEntry,
      OH_DSH_MARKETPLACE_SANDBOX_LAUNCHER: resolveLandlockLauncher(paths.runtimeRoot) ?? '',
      PATH: runtimeSearchPath(paths, env),
    },
    nodeBinary: paths.nodeBinary,
    onLog: (stream, line) => { printLine(logTail, `${stream === 'stderr' ? '[runtime]' : ''}${line}`) },
    readyTimeoutMs: 60_000,
```

</details>

**依据 3 · 源码核查**：[src/data-root.ts:90-93](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/src/data-root.ts#L90-L93)

Electron目录。

```text
/** Keep Electron's Chromium data contained below the shared state root. */
export function desktopElectronDataRoot(ohDshHome: string): string {
  return join(ohDshHome, 'desktop')
}
```

**依据 4 · 源码核查**：[src/data-root.ts:186-196](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/src/data-root.ts#L186-L196)

目的文件优先与copy excl。

<details>
<summary>查看原文（11行）</summary>

```text

  if (sourceStat.isFile()) {
    if (destinationStat !== undefined && !destinationStat.isFile()) return true
    if (destinationStat !== undefined) return true
    mkdirSync(dirname(destination), { recursive: true, mode: 0o700 })
    try {
      copyFileSync(source, destination, fsConstants.COPYFILE_EXCL)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
    }
    return true
```

</details>

**依据 5 · 源码核查**：[install.sh:1000-1044](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/install.sh#L1000-L1044)

带标记替换与恢复。

<details>
<summary>查看原文（45行）</summary>

```text
  # The launcher collision check runs before any payload or record is
  # touched, so a refusal cannot strand a half-migrated installation.
  ensure_dispatcher_target_available "$bin_dir/ohdsh"

  parent=$(dirname -- "$dest")
  mkdir -p "$parent"
  staged="$dest.install-pending.$$"
  rm -rf "$staged"
  if ! mv -- "$payload" "$staged"; then
    rm -rf "$staged"
    die "failed to stage the new $surface payload; the previous installation was left untouched"
  fi

  previous="$dest.previous-$(timestamp)"
  had_previous=0
  if [ -e "$dest" ]; then
    # A pre-existing destination is only replaceable when it is an
    # installer-owned payload or an empty directory; unrelated data is never
    # recursively deleted because of a mistyped --dest.
    if [ "$(marker_field "$dest/.oh-dsh-install.env" OH_DSH_INSTALL_SURFACE)" != "$surface" ] \
      && [ -n "$(ls -A "$dest" 2>/dev/null)" ]; then
      die "refusing to replace $dest: it is not an Oh-DSH $surface payload (no matching install marker) and is not empty"
    fi
    mv -- "$dest" "$previous"
    had_previous=1
  fi
  if ! mv -- "$staged" "$dest"; then
    if [ "$had_previous" = 1 ]; then
      mv -- "$previous" "$dest"
    fi
    die "failed to move the staged $surface payload into place; the previous installation was left untouched"
  fi

  mkdir -p "$bin_dir"
  write_launcher_env
  install_dispatcher "$bin_dir/ohdsh"
  # The marker turns the install "current" only after the launcher exists,
  # so a rerun repairs a launcher that failed to materialize.
  write_marker "$dest/.oh-dsh-install.env"
  # Deletions happen only once the records are committed: a failure above
  # leaves the previous payload recoverable beside the new one.
  rm -rf "$previous"
  # Purge staged leftovers from interrupted upgrades — only entries that
  # still look like our own payloads; unrelated siblings sharing the prefix
  # are left alone.
```

</details>

**依据 6 · 源码核查**：[docs/design.zh.md:98-111](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/docs/design.zh.md#L98-L111)

作者说明surface和权限边界。

<details>
<summary>查看原文（14行）</summary>

```text
（原 `@oh-dsh/vision` 桥接插件已移除）。
- Marketplace 的 candidate、current、previous 分离，失败可以恢复。
- 来源首次使用采用 TOFU 锁，后续 commit 变化需要重新确认。
- Electron bridge 只存在于 Desktop；Web 不模拟桌面权限。
- TUI 只在真实 TTY 中启动，并继续使用 DSH Profile 的 sandbox 与 approval。

## 名称与数据目录

面向用户的名称是 **Oh-DSH Desktop**、**Oh-DSH Web** 和
**Oh-DSH TUI**。内部 package id 与 bundle id 保持稳定。三个界面共同使用
`~/.ohdsh`，通过独立 Profile 隔离组合，并共享会话、凭据、皮肤与插件缓存。
`OH_DSH_HOME` 是统一覆盖入口；Web 与 TUI 的 `--data` 只覆盖当前进程。

相关操作见[安装、操作与排错](./usage.md)。
```

</details>

#### 缺口

- 发行资产校验、平台构建与升级中断恢复没有独立执行
  **影响**：不能把安装脚本分支当实际发行验收
  **进一步探讨**：以可丢弃目录固定发行包hash，安装/升级/卸载并比较共享数据。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 总成本、验收和采用建议？

**研究主题**：效果与总成本、采用判断

#### 完整回答

当前更适合观察，或由熟悉DSH的维护者主动做隔离目录实验。已有明确跨端需要的用户可评估它，单界面用户未必值得为整个发行迁移；源码构件与恢复链丰富不等于稳定安装和净节时已验收。

#### 启动与依赖

| 条件 | 是否必需 | 用途 | 缺失后果 |
|---|---|---|---|
| 对应平台发行runtime | 启动必需 | Node/DSH/表面入口 | Web检查缺入口即拒绝 |
| 独立数据根与可用Profile | 安全试验前提 | 避免混入已有会话凭据 | 共享默认根带迁移/锁影响 |
| 模型/工具环境 | 真实开发任务必需 | Agent与本地工具 | UI启动不证明能做任务 |
| 市场源网络与平台隔离支持 | 安装插件条件 | 固定来源、构建/预览 | 无沙箱路径需额外确认，非恒定隔离 |

#### 验收步骤

| 步骤 | 动作 | 判据 |
|---|---|---|
| 准备 | 固定包版本并选独立根 | 保留原入口、无真实凭据 |
| 单端 | 启动后做一项临时工程任务 | 会话/工具结果实际可读 |
| 切换 | 依次启动另一surface及同时打开 | Profile边界与只读提示符合预期 |
| 市场 | 预览可丢弃插件、应用后重连查状态 | accepted不当完成；UI能力适用当前surface |
| 恢复 | Undo并重启、比较目录与功能 | 旧组合恢复且外部副作用另核对 |

#### 成本

| 阶段 | 现金/资源 | 人工/时间 | 当前边界 |
|---|---|---|---|
| 首次 | 下载/磁盘/模型费用未知 | 发行选择、根目录及凭据设置 | 源码开发额外构建依赖 |
| 日常 | 多surface/runtime及工具资源未知 | 会话切换与真实结果复核 | 共享锁限制并发写 |
| 升级 | 上游/下游兼容与重建资源未知 | 检查包、插件和重启状态 | 不能只看安装成功 |
| 恢复退出 | 备份/缓存/副本空间未知 | Undo、回读并清理凭据 | Profile回退不撤外部写 |

#### 效果

| 项目 | 有依据 | 未验证 |
|---|---|---|
| 统一入口 | 多surface共数据根与独立Profile | 平台实际安装运行 |
| 冲突限制 | 锁和会话/市场只读guard | 任意插件全部写无副作用 |
| 市场恢复 | 候选、backup与Undo代码 | 故障/断电后实际可恢复 |
| 总效率 | 减少部分分开接线 | 与原生DSH总耗时/纠错对比 |

若重连后状态不明、只读端仍发生预期外写、候选插件UI不适用或Undo后功能未恢复，停止迁移真实工程，保留状态目录和日志查明，再用原启动入口。

#### 证据与依据

**依据 1 · 源码核查**：[src/web.ts:228-255](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/src/web.ts#L228-L255)

启动必需与独立根。

<details>
<summary>查看原文（28行）</summary>

```text
  const paths: BundledRuntimePaths = bundledRuntimePaths(resourcesRoot)
  if (!existsSync(paths.nodeBinary)) {
    throw new Error(`packaged Node runtime is missing: ${paths.nodeBinary}`)
  }
  if (!existsSync(paths.cliEntry)) {
    throw new Error(`packaged DSH CLI is missing: ${paths.cliEntry}`)
  }

  mkdirSync(dataRoot, { recursive: true, mode: 0o700 })
  const { lock: runtimeLock, readOnly } = tryAcquireRuntimeLock(dataRoot, 'web')
  if (runtimeLock !== undefined) {
    process.once('exit', () => { runtimeLock.release() })
  }
  if (readOnly === false) {
    const migration = migrateLegacyWebState({
      dataRoot,
      ...(!hasOhDshHomeOverride(env) && dataRoot === defaultDataRoot
        ? { legacyDefaultDataRoot: legacyWebDataRoot() }
        : {}),
    })
    if (!migration.complete) {
      throw new Error(
        `legacy Web state migration under ${dataRoot} is incomplete; `
        + 'restore unavailable link targets and retry',
      )
    }
  }
  if (readOnly === false || !existsSync(join(dataRoot, 'profiles', WEB_PROFILE))) {
```

</details>

**依据 2 · 源码核查**：[src/runtime-lock.ts:341-357](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/src/runtime-lock.ts#L341-L357)

并发只读。

<details>
<summary>查看原文（17行）</summary>

```text
 * Try to acquire the data-root lock. If another surface already owns it,
 * return a read-only result instead of throwing, so the caller can start a
 * viewer that may read shared history but must not write to active sessions.
 */
export function tryAcquireRuntimeLock(
  dataRoot: string,
  surface: string,
): { lock: RuntimeLock | undefined; readOnly: boolean } {
  try {
    return { lock: acquireRuntimeLock(dataRoot, surface), readOnly: false }
  } catch (error) {
    if (error instanceof RuntimeLockContendedError) {
      return { lock: undefined, readOnly: true }
    }
    throw error
  }
}
```

</details>

**依据 3 · 源码核查**：[plugins/plugin-marketplace/src/host/transaction-manager.ts:1227-1286](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/plugins/plugin-marketplace/src/host/transaction-manager.ts#L1227-L1286)

切换与恢复并非结果验收。

<details>
<summary>查看原文（60行）</summary>

```text
  private async applyPreview(): Promise<void> {
    const active = this.#active
    if (active === null) throw new Error('There is no prepared preview to apply.')
    await this.#options.runtime.stopPreview()
    await this.#options.runtime.stopLive()
    const rollbackRoot = join(this.#rollbacksRoot, active.preview.transactionId)
    const backupProfile = join(rollbackRoot, this.#options.profile)
    mkdirSync(rollbackRoot, { recursive: true, mode: 0o700 })
    let candidateInstalled = false
    try {
      renameSync(this.#profileDir, backupProfile)
      renameSync(active.candidateProfile, this.#profileDir)
      candidateInstalled = true
      const candidateCache = join(active.candidateHome, 'cache', 'repository-plugins')
      if (existsSync(candidateCache)) {
        const liveCache = join(this.#options.dshHome, 'cache', 'repository-plugins')
        mkdirSync(dirname(liveCache), { recursive: true, mode: 0o700 })
        cpSync(candidateCache, liveCache, { recursive: true, preserveTimestamps: true })
      }
      // The applied profile's node_modules was linked from the preview's
      // store, which is deleted with the preview root below. Re-home it
      // against the persistent home store (unsandboxed) so the live profile
      // never references a vanished store. Best effort: the hard links keep
      // the tree usable even if this fails, and the dsh CLI self-heals the
      // store reference on the next pnpm command.
      try {
        removeWithin(this.#profileDir, join(this.#profileDir, 'node_modules'), this.#warn)
        rmSync(join(this.#profileDir, 'pnpm-lock.yaml'), { force: true })
        await this.#options.platform.runDsh({
          args: ['plugin', '--profile', this.#options.profile, 'install', '--ignore-scripts'],
          dshHome: this.#options.dshHome,
          sandboxRoot: this.#options.appDataPath,
          sandboxed: false,
        })
      } catch (error) {
        this.#options.onWarn?.(`applied profile store could not be re-homed: ${message(error)}`)
      }
      await this.#options.runtime.startLive()
    } catch (error) {
      await this.#options.runtime.stopLive().catch(() => {})
      if (candidateInstalled && existsSync(this.#profileDir)) {
        const failed = join(rollbackRoot, 'failed-candidate')
        renameSync(this.#profileDir, failed)
      }
      if (existsSync(backupProfile)) renameSync(backupProfile, this.#profileDir)
      await this.#options.runtime.startLive().catch(() => {})
      throw new Error(`plugin preview failed to apply and was rolled back: ${message(error)}`)
    }
    this.#rollback = {
      appliedAt: new Date().toISOString(),
      backupProfile,
      pluginId: active.preview.pluginId,
      transactionId: active.preview.transactionId,
    }
    writeJsonAtomic(this.#rollbackStatePath, this.#rollback)
    removeWithin(this.#previewsRoot, active.root, this.#warn)
    this.#active = null
    this.#plan = null
    this.#lastAction = `Applied ${active.preview.pluginId}; the previous profile remains available for Undo.`
    this.remapCatalogInstalled()
```

</details>

**依据 4 · 源码核查**：[src/marketplace-tools.ts:331-357](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/src/marketplace-tools.ts#L331-L357)

只返回受理。

<details>
<summary>查看原文（27行）</summary>

```text
  ctx.tools.register(marketplaceTool({
    name: 'desktop_plugin_apply',
    description: 'After human approval, atomically apply the active isolated preview and keep the previous profile recoverable. This restarts the live DSH runtime.',
    parameters: {},
    async execute(_args, exec) {
      const response = await gateway(credentials, {
        type: 'dispatch',
        command: { type: 'apply' },
      })
      if (response.deferred !== true) throw new Error('desktop apply was not scheduled')
      exec.concludeTurn()
      return result('Plugin apply accepted. The desktop runtime will restart now.')
    },
  }))

  ctx.tools.register(marketplaceTool({
    name: 'desktop_plugin_recover',
    description: 'After human approval, restore the previous plugin profile and restart the live DSH runtime.',
    parameters: {},
    async execute(_args, exec) {
      const response = await gateway(credentials, {
        type: 'dispatch',
        command: { type: 'undo' },
      })
      if (response.deferred !== true) throw new Error('desktop recovery was not scheduled')
      exec.concludeTurn()
      return result('Plugin recovery accepted. The desktop runtime will restart now.')
```

</details>

#### 缺口

- 无安装运行和同任务净成本测量
  **影响**：保持观察，不依据功能列表建议持续安装
  **进一步探讨**：固定平台与隔离根验收启动、同任务、断线重连和Undo。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可迁移机制与可证伪产品方向？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

值得迁移的是一个事务owner服务两类入口、明确candidate/current/previous，以及把安装与当前surface生效分开。它适用于会重启宿主的插件市场，前提是恢复目录、版本锁和重连可读状态可持续维护；不必复制整套桌面发行才能用这些想法。

具体未验证方向是“重启后变更回执”：以transactionId串联受理、Profile切换、live ready、目标surface功能探针和Undo可用性，重连后向用户返回最终结果或明确未知，而非把工具accepted当最终成功。源码已有transactionId、snapshot及backup，增量是故障后一致回执和最小功能验收，不是再做一个市场目录。

可用正常应用、startLive失败、202后断连、进程在Profile切换中止四组样本，比当前UI/工具路径与新增回执的误报完成次数、未知状态、恢复时间和额外维护成本。若简单重连snapshot足以让用户准确恢复，停止独立插件化，采用轻量提示和探针即可；没有收益证据时不把这一假设计入当前价值。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/plugin-marketplace/src/host/agent-gateway.ts:101-122](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/plugins/plugin-marketplace/src/host/agent-gateway.ts#L101-L122)

受理与延后完成的断点。

<details>
<summary>查看原文（22行）</summary>

```text
        const snapshot = await manager.dispatch(command, 'agent')
        json(response, 200, { accepted: true, deferred: false, snapshot })
        return
      }
      if (deferredPending) throw new Error('a marketplace restart action is already pending')
      const snapshot = manager.getSnapshot()
      if (command.type === 'apply' && snapshot.preview === null) {
        throw new Error('there is no isolated preview to apply')
      }
      if (command.type === 'undo' && !snapshot.undoAvailable) {
        throw new Error('there is no previous profile to recover')
      }
      deferredPending = true
      json(response, 202, { accepted: true, deferred: true, snapshot })
      setTimeout(() => {
        void manager.dispatch(command, 'agent')
          .then(result => {
            if (result.error !== null) options.onError?.(new Error(result.error))
          })
          .catch(options.onError ?? (() => {}))
          .finally(() => { deferredPending = false })
      }, options.deferMs ?? DEFAULT_DEFER_MS)
```

</details>

**依据 2 · 源码核查**：[plugins/plugin-marketplace/src/host/transaction-manager.ts:1227-1286](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/plugins/plugin-marketplace/src/host/transaction-manager.ts#L1227-L1286)

事务ID与profile状态。

<details>
<summary>查看原文（60行）</summary>

```text
  private async applyPreview(): Promise<void> {
    const active = this.#active
    if (active === null) throw new Error('There is no prepared preview to apply.')
    await this.#options.runtime.stopPreview()
    await this.#options.runtime.stopLive()
    const rollbackRoot = join(this.#rollbacksRoot, active.preview.transactionId)
    const backupProfile = join(rollbackRoot, this.#options.profile)
    mkdirSync(rollbackRoot, { recursive: true, mode: 0o700 })
    let candidateInstalled = false
    try {
      renameSync(this.#profileDir, backupProfile)
      renameSync(active.candidateProfile, this.#profileDir)
      candidateInstalled = true
      const candidateCache = join(active.candidateHome, 'cache', 'repository-plugins')
      if (existsSync(candidateCache)) {
        const liveCache = join(this.#options.dshHome, 'cache', 'repository-plugins')
        mkdirSync(dirname(liveCache), { recursive: true, mode: 0o700 })
        cpSync(candidateCache, liveCache, { recursive: true, preserveTimestamps: true })
      }
      // The applied profile's node_modules was linked from the preview's
      // store, which is deleted with the preview root below. Re-home it
      // against the persistent home store (unsandboxed) so the live profile
      // never references a vanished store. Best effort: the hard links keep
      // the tree usable even if this fails, and the dsh CLI self-heals the
      // store reference on the next pnpm command.
      try {
        removeWithin(this.#profileDir, join(this.#profileDir, 'node_modules'), this.#warn)
        rmSync(join(this.#profileDir, 'pnpm-lock.yaml'), { force: true })
        await this.#options.platform.runDsh({
          args: ['plugin', '--profile', this.#options.profile, 'install', '--ignore-scripts'],
          dshHome: this.#options.dshHome,
          sandboxRoot: this.#options.appDataPath,
          sandboxed: false,
        })
      } catch (error) {
        this.#options.onWarn?.(`applied profile store could not be re-homed: ${message(error)}`)
      }
      await this.#options.runtime.startLive()
    } catch (error) {
      await this.#options.runtime.stopLive().catch(() => {})
      if (candidateInstalled && existsSync(this.#profileDir)) {
        const failed = join(rollbackRoot, 'failed-candidate')
        renameSync(this.#profileDir, failed)
      }
      if (existsSync(backupProfile)) renameSync(backupProfile, this.#profileDir)
      await this.#options.runtime.startLive().catch(() => {})
      throw new Error(`plugin preview failed to apply and was rolled back: ${message(error)}`)
    }
    this.#rollback = {
      appliedAt: new Date().toISOString(),
      backupProfile,
      pluginId: active.preview.pluginId,
      transactionId: active.preview.transactionId,
    }
    writeJsonAtomic(this.#rollbackStatePath, this.#rollback)
    removeWithin(this.#previewsRoot, active.root, this.#warn)
    this.#active = null
    this.#plan = null
    this.#lastAction = `Applied ${active.preview.pluginId}; the previous profile remains available for Undo.`
    this.remapCatalogInstalled()
```

</details>

**依据 3 · 源码核查**：[src/marketplace-tools.ts:331-357](https://github.com/hust-open-atom-club/oh-dsh/blob/9a428a8ccfa327afed6fe83142f5e65c8367f5fa/src/marketplace-tools.ts#L331-L357)

工具退出回合。

<details>
<summary>查看原文（27行）</summary>

```text
  ctx.tools.register(marketplaceTool({
    name: 'desktop_plugin_apply',
    description: 'After human approval, atomically apply the active isolated preview and keep the previous profile recoverable. This restarts the live DSH runtime.',
    parameters: {},
    async execute(_args, exec) {
      const response = await gateway(credentials, {
        type: 'dispatch',
        command: { type: 'apply' },
      })
      if (response.deferred !== true) throw new Error('desktop apply was not scheduled')
      exec.concludeTurn()
      return result('Plugin apply accepted. The desktop runtime will restart now.')
    },
  }))

  ctx.tools.register(marketplaceTool({
    name: 'desktop_plugin_recover',
    description: 'After human approval, restore the previous plugin profile and restart the live DSH runtime.',
    parameters: {},
    async execute(_args, exec) {
      const response = await gateway(credentials, {
        type: 'dispatch',
        command: { type: 'undo' },
      })
      if (response.deferred !== true) throw new Error('desktop recovery was not scheduled')
      exec.concludeTurn()
      return result('Plugin recovery accepted. The desktop runtime will restart now.')
```

</details>

#### 缺口

- 变更回执/功能探针未实现
  **影响**：不能宣称已降低误报与恢复时间
  **进一步探讨**：先用可丢弃Profile比较故障后用户判定准确率。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
