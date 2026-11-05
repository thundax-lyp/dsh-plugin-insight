# DSH-Portable

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[1df27c2](https://github.com/WSL043/DSH-Portable/tree/1df27c2261bbf7802f44871d9cb4f3d1fa8364bc)

<!-- BEGIN META -->
[![GitHub ★ 91](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=91&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/WSL043/DSH-Portable)
<!-- END META -->

> **功能**：提供便携DSH桌面运行环境、分离更新及数据维护工具。

> **亮点**：[Q01](#research-q01) 把运行准备和数据维护集中到便携目录。

> **主要限制**：[Q02](#research-q02) 稳定线与1.x不同，health回滚及制品安全仍需验收。

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
  - [Q01 · 便携部署实际带走什么？](#detail-section-11)
  - [Q02 · 更新失败怎样回到可用环境？](#detail-section-12)
  - [Q03 · 怎样判断比普通安装更值得携带？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望同平台搬移会话与环境并控制更新的用户。

系统安装及手工导出或重建配置。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 运行准备 | capsule校验准备及租约 | 同平台运行时 |
| 状态控制 | runtime损坏时仍可查stop/status | 进程身份实际验收 |
| 更新 | stage元数据、health及journal回滚 | app与capsule路径分验 |
| 携带 | 集中目录及维护入口 | 完整退出后复制，外部路径另查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 匹配平台运行包及系统WebView | 必需 | 准备桌面与runtime | 离线包种类不同 |
| 可写目录与完整data备份 | 搬移/更新需要 | 保留恢复点 | 运行中不复制 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 选线 | 只以稳定0.x做副本 | 不视1.x为升级路径 |
| 复制 | 完整停止后同平台迁移 | 核对会话与路径 |
| 更新 | 演练health失败并恢复journal | 保持data一致 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 包体与准备工时未知 | 选架构、WebView和离线包 | 系统组件另核对 |
| 持续 | 下载及空间未知 | 维护Host、launcher和插件兼容 | 多版本备份占空间 |
| 失败 | 恢复工时未知 | 保留原目录/data并回旧app | pending需恢复后才新更新 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 便携机制 | 源码集中runtime准备和状态根 | 真机路径及凭据迁移 |
| 恢复 | 源码journal和health失败回滚 | 真实制品及中断恢复 |

> **思考**：[Q02](#research-q02) 稳定线与1.x不同，health回滚及制品安全仍需验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把运行准备和数据维护集中到便携目录。

[Q02](#research-q02) app更新按journal阶段提交，未覆盖所有capsule制品。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 稳定线与1.x不同，health回滚及制品安全仍需验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 稳定线同平台副本演练后再搬日常数据。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核对共用启动和app更新，未测制品与设备。

- 已检查：作者 README、包清单、源码路径 README.md、launcher/runtime-entry.mjs、launcher/update-core.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定共用启动和app更新源码、作者版本界限，未运行制品。
- 下一步：同平台迁移、盘符、离线、health失败和pending恢复。

**分析版本**

- **仓库**：[WSL043/DSH-Portable](https://github.com/WSL043/DSH-Portable)
- **版本号**：0.9.9（[固定提交 1df27c2](https://github.com/WSL043/DSH-Portable/tree/1df27c2261bbf7802f44871d9cb4f3d1fa8364bc)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 同平台复制对照搬移和恢复成本。

同平台迁移、盘符、离线、health失败和pending恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 134 | 8598 | — | — | 205020 |
| .js | source | 9 | 3880 | 3703 | 66 | — |
| .mjs | source | 178 | 28644 | 26166 | 1208 | — |
| .mjs | test | 200 | 33201 | 30888 | 452 | — |
| .js | example | 1 | 11 | 11 | 0 | — |
| .cjs | source | 1 | 19 | 17 | 2 | — |
| .mjs | example | 2 | 128 | 119 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/WSL043/DSH-Portable/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：便携目录能否让同平台多设备用户迁移并维护DSH？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 便携部署实际带走什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

目标是同平台多设备使用者把运行环境和数据随文件夹携带。README区分稳定0.x与仅Windows的1.x预览，不能混为升级路径。runtime-entry先解析环境状态根，stop/status可绕过损坏runtime直接读取进程状态；启动要准备capsule，再设DSH_PORTABLE_RUNTIME_ROOT并拿运行租约，结束释放。相对系统安装，这集中运行与维护位置，但不证明所有工作区文件、凭据或绝对路径都能跨机器。作者也要求完全退出后复制到相同平台。仓库包含多平台launcher与维护工具，本轮以共用runtime入口与app更新主链核对，没把单平台脚本当全平台验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:43-55](https://github.com/WSL043/DSH-Portable/blob/1df27c2261bbf7802f44871d9cb4f3d1fa8364bc/README.md#L43-L55)

稳定线与预览线。

<details>
<summary>查看原文（13行）</summary>

```text
| | 官方桌面端 | DSH-Portable |
| --- | --- | --- |
| 安装与平台 | 安装式；Windows、macOS | 绿色便携；Windows、macOS、Linux，不安装、不改系统 PATH |
| 更新节奏 | 跟随官方发布节奏 | Portable 与内核分开更新，可选内核版本 |
| 携带与维护 | 常规桌面安装 | 完全退出后可把整个文件夹复制到 U 盘或另一台相同平台的电脑；提供保留数据的回滚与恢复工具 |
| 插件 | 官方插件管理 | 同样的官方插件管理；“更多”仅兼容恢复旧插件配置，社区插件按需安装 |
| 适合你，如果… | 想装进系统、主要使用一台电脑 | 想带走、多设备使用，或需要可控更新 |

## 下载

日常使用请选择稳定版 0.x（Native）。1.0 线有一个仅 Windows 的 [alpha 预览版](https://github.com/WSL043/DSH-Portable/releases/tag/v1.0.0-alpha.5)，供想尝鲜的用户试用，不是 0.x 的升级路径。

1.x 正在维护验收，当前官方桌面底包的已知 MCP 安全债阻断新发布；旧 alpha 也不作安全晋级承诺。[当前进度、验收与限制](docs/one-x-maintenance-2026-10-23.md)。
```

</details>

**依据 2 · 源码核查**：[launcher/runtime-entry.mjs:24-42](https://github.com/WSL043/DSH-Portable/blob/1df27c2261bbf7802f44871d9cb4f3d1fa8364bc/launcher/runtime-entry.mjs#L24-L42)

独立控制路径。

<details>
<summary>查看原文（19行）</summary>

```text
// Existing-process control must work even when the runtime cache is unwritable or damaged.
// It needs shipped launcher modules only, not a prepared app or a new runtime lease.
if (cliOptions?.command === 'stop' || cliOptions?.command === 'status') {
  const controlEnvironment = cliOptions.environment || process.env.DSH_PORTABLE_ENVIRONMENT || 'default'
  const controlStateRoot = environmentStateRoot(stateRoot || root, controlEnvironment, process.platform)
  const controlLayout = layoutForRoot(root, process.platform, controlStateRoot, root, controlEnvironment)
  let state
  try {
    const stateFile = await safeDataTarget(controlStateRoot, path.relative(controlStateRoot, controlLayout.processState), { createParents: false })
    if (stateFile) state = JSON.parse(await readFile(stateFile, 'utf8'))
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  let alive = false
  if (Number.isSafeInteger(state?.pid) && state.pid > 0) {
    try { process.kill(state.pid, 0); alive = true } catch (error) {
      if (error.code !== 'ESRCH') alive = true
    }
  }
```

</details>

**依据 3 · 源码核查**：[launcher/runtime-entry.mjs:104-127](https://github.com/WSL043/DSH-Portable/blob/1df27c2261bbf7802f44871d9cb4f3d1fa8364bc/launcher/runtime-entry.mjs#L104-L127)

准备与错误退路。

<details>
<summary>查看原文（24行）</summary>

```text
reportStartupProgress('runtime-preparing')
const preparationStarted = performance.now()
const preparationPool = process.env.UV_THREADPOOL_SIZE || 'default'
const prepared = await ensureRuntimeCapsule(root, {
  onProgress: (phase, fields) => {
    appendStartupTrace(startupTrace, 'runtime-capsule', phase, fields)
    if (phase === 'extract-directories-progress') reportStartupProgress('runtime-directories', fields)
    else if (phase === 'extract-files-progress') reportStartupProgress('runtime-files', fields)
    else if (phase === 'cache-commit') reportStartupProgress('runtime-finalizing')
  },
  onRetry: fields => appendStartupTrace(startupTrace, 'runtime-entry', 'runtime-commit-retry', fields),
}).catch(error => {
  if (cliOptions?.command === 'repair' || cliOptions?.command === 'doctor') {
    throw new Error('运行组件尚未就绪，未继续修复。请保留原目录和 data/workspace，完全退出后重试；若运行包缺失或损坏，将完整离线包解压到新目录再迁移数据。\nRuntime preparation failed; repair did not continue. Keep the original folder and data/workspace. Quit Portable and retry; for missing or damaged runtime files, extract a full offline package to a new folder before migrating data.', { cause: error })
  }
  throw error
}).finally(() => {
  if (process.env.DSH_PORTABLE_PREPARATION_POOL === '16') {
    delete process.env.DSH_PORTABLE_PREPARATION_POOL
    if (process.env.UV_THREADPOOL_SIZE === '16') delete process.env.UV_THREADPOOL_SIZE
  }
})
const preparationElapsed = performance.now() - preparationStarted
reportStartupProgress('runtime-ready', { reused: prepared.reused === true })
```

</details>

**依据 4 · 源码核查**：[launcher/runtime-entry.mjs:142-150](https://github.com/WSL043/DSH-Portable/blob/1df27c2261bbf7802f44871d9cb4f3d1fa8364bc/launcher/runtime-entry.mjs#L142-L150)

运行根及租约。

```text
process.env.DSH_PORTABLE_RUNTIME_ROOT = prepared.runtimeRoot
process.env.DSH_PORTABLE_RUNTIME_FRESH = prepared.mode === 'capsule' && !prepared.reused ? '1' : '0'
process.argv = [process.execPath, path.join(root, 'launcher', entryName), ...forwarded]
const release = prepared.mode === 'capsule' ? await acquireRuntimeLease(prepared.runtimeRoot) : async () => {}

try {
  await import(pathToFileURL(process.argv[1]).href)
} finally {
  await release()
```

#### 缺口

- 未真机复制或盘符变化测试
  **影响**：不能保证插件、外部工作区和凭据迁移
  **进一步探讨**：同平台两测试机核对路径、会话和Key状态

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 更新失败怎样回到可用环境？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

applyStagedAppUpdate拒绝未恢复旧journal、校验component与license版本和bin存在，再preflight。它先写prepared journal、把旧app rename到备份，换staged app和license，重置managed fallback，然后healthCheck通过才写committed。异常会beforeRollback再rollback，leavePending则保留待恢复状态；最后清理也可能失败。这个journal可解释故障位置，仍需独立确认health覆盖真实会话和插件。源码存在capsule另一条更新路径，不能用app路径的证明覆盖所有制品。README明确1.x当前底包MCP安全债阻断新发布，旧alpha未晋级，采用建议须限定稳定线并核对实际制品。

#### 证据与依据

**依据 1 · 源码核查**：[launcher/update-core.mjs:1152-1175](https://github.com/WSL043/DSH-Portable/blob/1df27c2261bbf7802f44871d9cb4f3d1fa8364bc/launcher/update-core.mjs#L1152-L1175)

输入检查和preflight。

<details>
<summary>查看原文（24行）</summary>

```text
export async function applyStagedAppUpdate({ layout, stagedRoot, healthCheck, preflight, beforeRollback = async () => {}, onProgress = () => {} }) {
  if (await readJson(layout.updateJournal, null)) throw new Error('A prior update must be recovered before another update can start.')
  const metadata = await readJson(path.join(stagedRoot, 'component.json'), null)
  if (metadata?.schemaVersion !== UPDATE_SCHEMA_VERSION || metadata.kind !== 'dsh-app') throw new Error('Staged update metadata is invalid.')
  const stagedApp = path.join(stagedRoot, 'app')
  const stagedDsh = path.join(stagedApp, 'node_modules', '@deepseek-ai', 'dsh', 'lib', 'bin.js')
  const stagedLicenses = path.join(stagedRoot, 'licenses')
  const stagedComponents = await readJson(path.join(stagedLicenses, 'COMPONENTS.json'), null)
  if (!stagedComponents
    || stagedComponents.portableVersion !== metadata.portableVersion
    || stagedComponents.dshVersion !== metadata.dshVersion
    || (metadata.dshCommit && stagedComponents.dshCommit !== metadata.dshCommit)) {
    throw new Error('Staged component metadata does not agree with its application payload.')
  }
  if (!existsSync(stagedDsh) || UPDATE_LICENSE_FILES.some((name) => !existsSync(path.join(stagedLicenses, name)))) {
    throw new Error('Staged update is incomplete.')
  }
  if (!existsSync(layout.appDir)) throw new Error('The current DSH application is missing.')

  let preflightWarnings = []
  if (typeof preflight === 'function') {
    onProgress({ phase: 'preflighting' })
    const result = await preflight({ layout, stagedRoot, metadata })
    if (Array.isArray(result?.warnings)) preflightWarnings = result.warnings
```

</details>

**依据 2 · 源码核查**：[launcher/update-core.mjs:1179-1215](https://github.com/WSL043/DSH-Portable/blob/1df27c2261bbf7802f44871d9cb4f3d1fa8364bc/launcher/update-core.mjs#L1179-L1215)

journal、换包、health和回滚。

<details>
<summary>查看原文（37行）</summary>

```text
  const { operationId, operationRoot } = operationFromStage(layout, stagedRoot)
  const paths = transactionPaths(layout, operationId)
  const hadLicenses = UPDATE_LICENSE_FILES.filter((name) => existsSync(path.join(paths.rootLicenses, name)))
  await mkdir(path.dirname(paths.backupApp), { recursive: true })
  await mkdir(paths.backupLicenses, { recursive: true })
  await writeJournal(layout, { operationId, phase: 'prepared', hadLicenses })

  try {
    await rename(layout.appDir, paths.backupApp)
    await writeJournal(layout, { operationId, phase: 'app-backed-up', hadLicenses })
    await rename(stagedApp, layout.appDir)
    await mkdir(paths.rootLicenses, { recursive: true })
    for (const name of UPDATE_LICENSE_FILES) {
      const rootFile = path.join(paths.rootLicenses, name)
      if (existsSync(rootFile)) await rename(rootFile, path.join(paths.backupLicenses, name))
      await rename(path.join(stagedLicenses, name), rootFile)
    }
    await resetManagedProfileModuleFallback(layout)
    await writeJournal(layout, { operationId, phase: 'testing', hadLicenses })

    onProgress({ phase: 'validating' })
    const healthy = await healthCheck(metadata)
    if (!healthy) throw new Error('The updated DSH runtime did not pass its health check.')
    await writeJournal(layout, { operationId, phase: 'committed', hadLicenses })
  } catch (error) {
    if (error?.leavePending) throw error
    onProgress({ phase: 'rolling-back' })
    await beforeRollback(error)
    await rollbackPendingAppUpdate(layout)
    onProgress({ phase: 'rollback-complete' })
    throw new Error(`Update failed and was rolled back: ${error?.message ?? error}`, { cause: error })
  }
  let cleanupPending = false
  try {
    await rm(operationRoot, { recursive: true, force: true })
    await rm(layout.updateJournal, { force: true })
  } catch {
```

</details>

**依据 3 · 作者声明**：[README.md:53-65](https://github.com/WSL043/DSH-Portable/blob/1df27c2261bbf7802f44871d9cb4f3d1fa8364bc/README.md#L53-L65)

安全债及离线前置。

<details>
<summary>查看原文（13行）</summary>

```text
日常使用请选择稳定版 0.x（Native）。1.0 线有一个仅 Windows 的 [alpha 预览版](https://github.com/WSL043/DSH-Portable/releases/tag/v1.0.0-alpha.5)，供想尝鲜的用户试用，不是 0.x 的升级路径。

1.x 正在维护验收，当前官方桌面底包的已知 MCP 安全债阻断新发布；旧 alpha 也不作安全晋级承诺。[当前进度、验收与限制](docs/one-x-maintenance-2026-10-23.md)。

### Windows

| 需要 | 下载 |
| --- | --- |
| 联网自动准备文件夹 | [在线便携启动器](https://github.com/WSL043/DSH-Portable/releases/latest/download/DSH-Portable-windows-x64.exe)（推荐） |
| 自行下载并解压 | [标准 ZIP](https://github.com/WSL043/DSH-Portable/releases/latest/download/DSH-Portable-windows-x64-offline.zip) |
| 目标电脑缺少 WebView2 且无法联网补装 | [完整离线 ZIP](https://github.com/WSL043/DSH-Portable/releases/latest/download/DSH-Portable-windows-x64-complete-offline.zip) |

不知道怎么选？能联网用在线启动器；想自行解压用标准 ZIP。Windows 11 预装 WebView2，多数 Windows 10 电脑也已有；完整离线 ZIP 自带它。更多[离线部署要求](docs/user-guide.zh-CN.md#离线部署)。
```

</details>

#### 缺口

- 真实制品校验、rollback与安全修复未运行
  **影响**：不能保证现有发布包满足当前源声明
  **进一步探讨**：副本注入缺license、health失败和进程中断，核对旧app及data

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样判断比普通安装更值得携带？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

先选稳定0.x同平台测试包，完全退出后复制整目录到另一位置，保留原件。合格结果是测试会话、设置和插件可读，外部workspace明确提示或重定位，路径和凭据没有悄悄落到系统旧home；网络受限时离线制品可准备runtime，缺WebView2能被识别。再在副本演练app健康检查失败和pending journal恢复，比对更新前后数据哈希。与常规安装加导出比较搬移工时、下载体积和维护次数；若绝对路径或缺运行时使搬移更难，就推翻便利假设。退出时完整停止进程，保留data和原目录；不把删runtime当数据修复，也不跨平台共用同一运行二进制。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:43-65](https://github.com/WSL043/DSH-Portable/blob/1df27c2261bbf7802f44871d9cb4f3d1fa8364bc/README.md#L43-L65)

复制条件和包形式。

<details>
<summary>查看原文（23行）</summary>

```text
| | 官方桌面端 | DSH-Portable |
| --- | --- | --- |
| 安装与平台 | 安装式；Windows、macOS | 绿色便携；Windows、macOS、Linux，不安装、不改系统 PATH |
| 更新节奏 | 跟随官方发布节奏 | Portable 与内核分开更新，可选内核版本 |
| 携带与维护 | 常规桌面安装 | 完全退出后可把整个文件夹复制到 U 盘或另一台相同平台的电脑；提供保留数据的回滚与恢复工具 |
| 插件 | 官方插件管理 | 同样的官方插件管理；“更多”仅兼容恢复旧插件配置，社区插件按需安装 |
| 适合你，如果… | 想装进系统、主要使用一台电脑 | 想带走、多设备使用，或需要可控更新 |

## 下载

日常使用请选择稳定版 0.x（Native）。1.0 线有一个仅 Windows 的 [alpha 预览版](https://github.com/WSL043/DSH-Portable/releases/tag/v1.0.0-alpha.5)，供想尝鲜的用户试用，不是 0.x 的升级路径。

1.x 正在维护验收，当前官方桌面底包的已知 MCP 安全债阻断新发布；旧 alpha 也不作安全晋级承诺。[当前进度、验收与限制](docs/one-x-maintenance-2026-10-23.md)。

### Windows

| 需要 | 下载 |
| --- | --- |
| 联网自动准备文件夹 | [在线便携启动器](https://github.com/WSL043/DSH-Portable/releases/latest/download/DSH-Portable-windows-x64.exe)（推荐） |
| 自行下载并解压 | [标准 ZIP](https://github.com/WSL043/DSH-Portable/releases/latest/download/DSH-Portable-windows-x64-offline.zip) |
| 目标电脑缺少 WebView2 且无法联网补装 | [完整离线 ZIP](https://github.com/WSL043/DSH-Portable/releases/latest/download/DSH-Portable-windows-x64-complete-offline.zip) |

不知道怎么选？能联网用在线启动器；想自行解压用标准 ZIP。Windows 11 预装 WebView2，多数 Windows 10 电脑也已有；完整离线 ZIP 自带它。更多[离线部署要求](docs/user-guide.zh-CN.md#离线部署)。
```

</details>

**依据 2 · 源码核查**：[launcher/runtime-entry.mjs:117-127](https://github.com/WSL043/DSH-Portable/blob/1df27c2261bbf7802f44871d9cb4f3d1fa8364bc/launcher/runtime-entry.mjs#L117-L127)

运行准备失败说明。

<details>
<summary>查看原文（11行）</summary>

```text
    throw new Error('运行组件尚未就绪，未继续修复。请保留原目录和 data/workspace，完全退出后重试；若运行包缺失或损坏，将完整离线包解压到新目录再迁移数据。\nRuntime preparation failed; repair did not continue. Keep the original folder and data/workspace. Quit Portable and retry; for missing or damaged runtime files, extract a full offline package to a new folder before migrating data.', { cause: error })
  }
  throw error
}).finally(() => {
  if (process.env.DSH_PORTABLE_PREPARATION_POOL === '16') {
    delete process.env.DSH_PORTABLE_PREPARATION_POOL
    if (process.env.UV_THREADPOOL_SIZE === '16') delete process.env.UV_THREADPOOL_SIZE
  }
})
const preparationElapsed = performance.now() - preparationStarted
reportStartupProgress('runtime-ready', { reused: prepared.reused === true })
```

</details>

**依据 3 · 源码核查**：[launcher/update-core.mjs:1200-1215](https://github.com/WSL043/DSH-Portable/blob/1df27c2261bbf7802f44871d9cb4f3d1fa8364bc/launcher/update-core.mjs#L1200-L1215)

故障回退及清理。

<details>
<summary>查看原文（16行）</summary>

```text
    const healthy = await healthCheck(metadata)
    if (!healthy) throw new Error('The updated DSH runtime did not pass its health check.')
    await writeJournal(layout, { operationId, phase: 'committed', hadLicenses })
  } catch (error) {
    if (error?.leavePending) throw error
    onProgress({ phase: 'rolling-back' })
    await beforeRollback(error)
    await rollbackPendingAppUpdate(layout)
    onProgress({ phase: 'rollback-complete' })
    throw new Error(`Update failed and was rolled back: ${error?.message ?? error}`, { cause: error })
  }
  let cleanupPending = false
  try {
    await rm(operationRoot, { recursive: true, force: true })
    await rm(layout.updateJournal, { force: true })
  } catch {
```

</details>

#### 缺口

- 没有跨机器结果和维护成本
  **影响**：只能副本试用，不能承诺无系统痕迹
  **进一步探讨**：两位置同平台复制和断网/更新恢复对照

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
