# dsh-plugin-gating-hub

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[018c68d](https://github.com/Noob-stupid/dsh-plugin-gating-hub/tree/018c68d44b45c309ee02b65ad93bad2479c2bc80)

<!-- BEGIN META -->
[![GitHub ★ 120](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=120&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Noob-stupid/dsh-plugin-gating-hub) [![npm 30d 15,946](https://img.shields.io/static/v1?label=npm+30d&message=15%2C946&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@noob-stupid/dsh-plugin-console) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@noob-stupid/dsh-plugin-console)
<!-- END META -->

> **功能**：在 DSH 内检查框架变更和插件兼容，提供升级备份、回滚与证据禁用。

> **亮点**：[Q01](#research-q01) 将升级与恢复点纳入同一控制台。

> **主要限制**：[Q02](#research-q02) 启动前失效时兼容路由无法接手，且自动禁用会改写配置。

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
  - [Q01 · 控制台升级失败会恢复哪些文件？](#detail-section-11)
  - [Q02 · 外部渠道变更后怎样进入自动禁用？](#detail-section-12)
  - [Q03 · 怎样验收采用价值与恢复成本？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护多个插件的管理员担心框架升级造成服务失效。

终端更新后人工核对版本、恢复和停用插件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 升级恢复 | 备份与回滚 | 全树失败可能降级 |
| 外部变更预检 | 提示兼容阻断项 | 依赖服务路由与明确证据 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 受支持的 DSH 及安装布局 | 必需 | 定位框架与配置 | 不同布局需测试 |
| 可写备份目录 | 升级必需 | 写恢复点 | CLI 备份不完整则取消 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 核对 | 在副本比对版本与配置 | 保存独立备份 |
| 升级 | 用控制台写恢复点并更新 | 观察全树或 CLI 降级 |
| 恢复 | 模拟启动或依赖失败 | 检查配置和版本一致 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 磁盘和运行开销未知 | 确认安装布局和备份 | 准备副本 |
| 持续 | 备份空间未知 | 跟踪插件兼容 | 核对自动禁用 |
| 失败 | 停机未知 | 按实际恢复点或独立备份恢复 | 复核文件完整性 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 框架升级 | 将备份与恢复集中 | 实际停机和恢复覆盖 |

> **思考**：[Q02](#research-q02) 启动前失效时兼容路由无法接手，且自动禁用会改写配置。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将升级与恢复点纳入同一控制台。

[Q02](#research-q02) 外部指纹触发的预检和确证禁用为分开的操作。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 启动前失效时兼容路由无法接手，且自动禁用会改写配置。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先在可弃用副本演练并保存独立恢复点。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认两类恢复点和自动禁用入口，未执行升级。

- 已检查：作者 README、包清单、源码路径 README.md、lib/server/routes/framework-upgrade.js、lib/server/domain/auto-preflight.js、lib/server/routes/compat.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定升级路由、兼容路由、预检及 README；未启动 Host、安装或执行回滚。
- 下一步：对照全树和 CLI 备份，演练两种启动边界及外部升级。

**分析版本**

- **仓库**：[Noob-stupid/dsh-plugin-gating-hub](https://github.com/Noob-stupid/dsh-plugin-gating-hub)
- **版本号**：0.5.108（[固定提交 018c68d](https://github.com/Noob-stupid/dsh-plugin-gating-hub/tree/018c68d44b45c309ee02b65ad93bad2479c2bc80)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 对照手工恢复，测回滚时间和文件完整度。

对照全树和 CLI 备份，演练两种启动边界及外部升级。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 29 | 7152 | — | — | 124956 |
| .js | source | 149 | 46213 | 34385 | 10418 | — |
| .mjs | source | 6 | 846 | 617 | 181 | — |
| .cjs | source | 3 | 360 | 276 | 62 | — |
| .cjs | test | 1 | 153 | 116 | 26 | — |
| .mjs | test | 146 | 36288 | 28876 | 5644 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/Noob-stupid/dsh-plugin-gating-hub/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：维护者能否通过升级门禁缩短框架变更导致的停机？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 控制台升级失败会恢复哪些文件？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

维护者从控制台升级时先准备框架恢复点。最小 CLI 备份无效会取消升级，全树 checkpoint 创建失败则记录降级并仍可走 CLI 备份。相较手工升级，这把备份、验证及恢复入口连成流程。全树恢复能力有条件，不能直接采信 README 的无条件保证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:37-55](https://github.com/Noob-stupid/dsh-plugin-gating-hub/blob/018c68d44b45c309ee02b65ad93bad2479c2bc80/README.md#L37-L55)

作者描述的升级和插件门禁。

<details>
<summary>查看原文（19行）</summary>

```text
**Three hard guarantees**

- 🛡️ **Contract pre-check → rollback point → auto-rollback.** A data-driven **contract pre-check**
  runs first (message contract / dependency API / config schema / removed API / loader contract);
  then config backup + a full-tree **rollback point**. A failed install or relaunch **auto-rolls
  the tree back**, a 「roll back to previous」 button restores the last version, and plugins the
  new framework cannot load are **auto-disabled** — version check catches fake success, 15-min
  timeout + stall detection.
- 👁️ **Even when another update channel changes the framework.** An **environment fingerprint**
  catches changes made by the official desktop updater or a manual `pnpm`: it auto-runs a
  **read-only pre-flight**, and disables a row **only with hard evidence** (package unresolvable /
  `file://` target gone / named in a boot-failure log). `@deepseek-ai/*` and **protected / core
  rows are never auto-disabled**; each auto-disable writes a one-command recovery record.
- 🔒 **Plugin install & upgrade gating.** Version/declaration gate (`dsh.engines.framework` /
  `engines.dsh` / `@deepseek-ai/*` ranges, built-in zero-dependency semver), a **repo-size gate**
  on source channels, and explicit handling of **non-registry sources** — a bare version is
  written back only once the registry really resolves it, otherwise the package is materialized
  as `link:`. Install scripts are never auto-authorized, and pnpm's supply-chain gate is never
  bypassed.
```

</details>

**依据 2 · 源码核查**：[lib/server/routes/framework-upgrade.js:171-209](https://github.com/Noob-stupid/dsh-plugin-gating-hub/blob/018c68d44b45c309ee02b65ad93bad2479c2bc80/lib/server/routes/framework-upgrade.js#L171-L209)

备份、取消和降级条件。

<details>
<summary>查看原文（39行）</summary>

```text
      const rollbackDir = backupDir !== null ? join(backupDir, 'dsh-package-backup') : null
      // 官方配套包参数（Start-Process ArgumentList 需要逐包独立元素；包名无空格，单引号安全）
      const pkgArgs = officialList !== '' ? officialList.split(' ').map((p) => `'${p}'`) : []
      const taskName = `DSH-FW-Upgrade-${process.pid}`
      // 备份 dsh 目录（回滚点）
      try {
        if (rollbackDir !== null) {
          mkdirSync(rollbackDir, { recursive: true })
          copyTree(dshDir, rollbackDir)
        }
      } catch {}
      // 安全护栏（事故教训）：回滚点必须真实有效（含 lib/bin.js），否则升级失败时无副本可恢复
      // ——曾因备份缺失导致回滚后框架目录为空、服务无法重启。备份无效直接取消升级。
      if (rollbackDir === null || !existsSync(join(rollbackDir, 'lib', 'bin.js'))) {
        sendError(res, 500, `框架备份失败（回滚点${rollbackDir !== null ? `：${rollbackDir}` : '（无）'}缺失或无效），已取消升级——请检查磁盘空间/权限后重试`)
        return
      }
      // 框架安装根识别（事故教训 2026-09-04）：require.resolve 返回 .pnpm 内部 realpath，
      // 旧逻辑 dirname(dirname(dshDir)) 指向 .pnpm/<entry>/node_modules——「重链跳过：.pnpm 目录不存在」、
      // 依赖修复 0 个，pnpm 还在错误 cwd 里把新 CLI 原位覆盖进旧 .pnpm 目录，旧树就此被毁。
      const fwRoot = resolveFrameworkRootNodeModules(dshDir)
      if (fwRoot === null || !existsSync(join(fwRoot, '.pnpm')) || !existsSync(join(fwRoot, '@deepseek-ai', 'dsh', 'lib', 'bin.js'))) {
        sendError(res, 500, `无法定位框架安装根（期望含 .pnpm 与 @deepseek-ai/dsh 的顶层 node_modules，实际：${fwRoot ?? '未找到'}）——已取消升级，请修复框架安装后重试`)
        return
      }
    steps.push(...repairStaleRenameResidue({ fwRoot }).steps) // 修上次失败的 .stale-* 改名残留（只 rename / 跳过已存在 / 幂等）
      // 框架全树 checkpoint（可靠回滚点）：升级前镜像全部 @deepseek-ai 版本包（自包内容）+ 顶层 scope + lock
      let fwCheckpoint = null
      try {
        const cpRoot = backupDir !== null ? backupDir : join(FRAMEWORK_BACKUP_ROOT(), current ?? 'unknown')
        fwCheckpoint = checkpointFrameworkTree(fwRoot, cpRoot)
        steps.push(`框架全树 checkpoint 完成：${fwCheckpoint.dest}（镜像 ${fwCheckpoint.mirrored} 个 @deepseek-ai 版本包；升级失败/拉起失败会自动全树回滚，也可用框架卡片的「回滚到上一版」一键回滚）`)
      } catch (error) {
        steps.push(`框架全树 checkpoint 失败：${error instanceof Error ? error.message : String(error)}（回滚点降级为 CLI 备份）`)
      }
      // 一键回滚记录：框架卡片「回滚到上一版」按钮读取
      try {
        writeFileSync(join(dshHome(), 'plugin-console', 'framework-rollback.json'), JSON.stringify({ from: current, to: target, checkpointDir: fwCheckpoint?.dest ?? null, cliBackupDir: rollbackDir, fwRoot, at: Date.now() }, null, 2), 'utf8')
      } catch {}
```

</details>

**依据 3 · 源码核查**：[lib/server/routes/framework-upgrade.js:363-397](https://github.com/Noob-stupid/dsh-plugin-gating-hub/blob/018c68d44b45c309ee02b65ad93bad2479c2bc80/lib/server/routes/framework-upgrade.js#L363-L397)

Windows 回滚脚本的全树和 CLI 分支。

<details>
<summary>查看原文（35行）</summary>

```text
        // （进程 cwd 会锁住框架目录）。checkpoint 存在 → 恢复全部 @deepseek-ai 版本包 + 顶层 scope；
        // checkpoint 缺失 → CLI 兜底。
        `function Invoke-Rollback {`,
        `  SetState 'rollback' '升级失败，回滚框架（全树/CLI 备份）…'`,
        `  Log '升级失败，回滚框架…'`,
        // 事故教训（2026-09-10）：整个回滚体包 try/catch —— 脚本崩在回滚里（曾报
        // 「无法将参数绑定到参数 Path」，回滚没跑完、旧树半新半旧），必须记录出错位置而不是
        // 只留一句 trap 消息；回滚失败也要明确写状态，别让人以为已回滚。
        `  try {`,
        `    try { $svc = Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue; if ($svc) { $svc | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }; Start-Sleep -Seconds 3 } } catch {}`,
        `    $cp = ${ps(fwCheckpoint?.dest ?? '')}`,
        `    if ($cp -and (Test-Path (Join-Path $cp '.pnpm'))) {`,
        `      $restored = 0`,
        `      $entries = Get-ChildItem -Path (Join-Path $cp '.pnpm') -Directory -ErrorAction SilentlyContinue`,
        `      foreach ($e in $entries) {`,
        `        if ($e.Name -notlike '*+*') { continue }`,
        `        $name = @($e.Name -split '\\+')[1] -replace '@.*$', ''`,
        `        if (-not $name) { continue }`,
        `        $src = Join-Path $e.FullName ('node_modules\\@deepseek-ai\\' + $name)`,
        `        $dst = Join-Path (Join-Path ${ps(fwRoot)} ('.pnpm\\' + $e.Name)) ('node_modules\\@deepseek-ai\\' + $name)`,
        `        if (Test-Path (Join-Path $src 'package.json')) { New-Item -ItemType Directory -Path (Split-Path $dst -Parent) -Force | Out-Null; robocopy $src $dst /E /NFL /NDL /NJH /NJS /R:1 /W:1 | Out-Null; $restored++ }`,
        `      }`,
        `      $topSrc = Join-Path $cp 'top-@deepseek-ai'`,
        `      if (Test-Path $topSrc) { Remove-Item ${ps(join(fwRoot, '@deepseek-ai'))} -Recurse -Force -ErrorAction SilentlyContinue; robocopy $topSrc ${ps(join(fwRoot, '@deepseek-ai'))} /E /NFL /NDL /NJH /NJS /R:1 /W:1 | Out-Null }`,
        `      try { Copy-Item (Join-Path $cp 'lock.yaml') ${ps(join(fwRoot, '.pnpm', 'lock.yaml'))} -Force -ErrorAction SilentlyContinue } catch {}`,
        `      Log ('全树回滚完成：恢复 ' + $restored + ' 个版本包 + 顶层 scope')`,
        `      $script:rolledBack = $true`,
        `      return`,
        `    }`,
        `    # CLI 兜底（checkpoint 缺失或损坏）`,
        `    if (-not (Test-Path ${ps(join(rollbackDir, 'lib', 'bin.js'))})) { Log ('回滚失败：CLI 备份也缺失（' + ${ps(rollbackDir)} + '）'); return }`,
        `    Remove-Item ${ps(dshDir)} -Recurse -Force -ErrorAction SilentlyContinue`,
        `    robocopy ${ps(rollbackDir)} ${ps(dshDir)} /E /NFL /NDL /NJH /NJS /R:1 /W:1 | Out-Null`,
        `    if (Test-Path ${ps(join(dshDir, 'lib', 'bin.js'))}) { Log '回滚完成（CLI 恢复）'; $script:rolledBack = $true } else { Log '回滚失败：复制失败，请手动修复框架安装' }`,
        `  } catch {`,
```

</details>

#### 缺口

- 未运行升级脚本
  **影响**：当前路径在各平台的完整恢复未知
  **进一步探讨**：逐个破坏 checkpoint 和 CLI 备份，记录是否续跑及恢复覆盖

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 外部渠道变更后怎样进入自动禁用？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

预检的候选整理仅保留有明确 ID、可切换的非核心阻断行。兼容路由在预检成功后另行调用 evidence disable，autoDisableOnEvidence 关掉时只记候选。它与控制台自己的升级开关分开。该路径依赖环境指纹和已安装布局，外部升级造成服务无法起到兼容路由时，不能靠该路由自行恢复。

#### 证据与依据

**依据 1 · 源码核查**：[lib/server/domain/auto-preflight.js:163-180](https://github.com/Noob-stupid/dsh-plugin-gating-hub/blob/018c68d44b45c309ee02b65ad93bad2479c2bc80/lib/server/domain/auto-preflight.js#L163-L180)

建议列表的筛选边界。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * 隔离计划：**建议**禁用哪些行 + 为什么（绝不自动写盘；真正落盘只走用户显式触发的
 * `POST /plugin-console/safe-boot {action:'disable-suspects'}` 或离线脚本）。
 * 只收「点名 + 可开关 + 非核心」的行：核心行禁掉只会让服务更起不来（正确动作是回滚框架）。
 */
function planSuspectRows(affected, { coreRowIds = new Set(), toggleableById = new Map(), limit = 20 } = {}) {
  const suspects = []
  const skipped = []
  for (const item of (Array.isArray(affected) ? affected : [])) {
    if (item.severity !== 'blocker' || typeof item.rowId !== 'string' || item.rowId === '') continue
    if (coreRowIds.has(item.rowId)) { skipped.push({ rowId: item.rowId, reason: 'core-row' }); continue }
    if (item.rowId === 'plugin-console') { skipped.push({ rowId: item.rowId, reason: 'self' }); continue }
    if (toggleableById.has(item.rowId) && toggleableById.get(item.rowId) === false) { skipped.push({ rowId: item.rowId, reason: 'not-toggleable' }); continue }
    if (suspects.some((s) => s.rowId === item.rowId)) continue
    if (suspects.length >= limit) break
    suspects.push({ rowId: item.rowId, moduleName: item.moduleName ?? null, reason: item.code, detail: item.detail ?? null, line: item.line ?? null })
  }
  return { suspects, skipped }
```

</details>

**依据 2 · 源码核查**：[lib/server/routes/compat.js:132-184](https://github.com/Noob-stupid/dsh-plugin-gating-hub/blob/018c68d44b45c309ee02b65ad93bad2479c2bc80/lib/server/routes/compat.js#L132-L184)

异步预检与证据改写接线。

<details>
<summary>查看原文（53行）</summary>

```text
 * 节流闸门在 `runAutoPreflight` 内部**同步**写下的 pending 占位 —— 同指纹的第二次查询会看到
 * pending/done，因此「同一指纹只自动跑一次」与「绝不阻塞」两件事同时成立。
 */
function scheduleAutoPreflight(rc, { current, previous, reasons, profileDir, patchPath }) {
  const scan = rc?.deps?.autoPreflightScan ?? runAutoPreflightScan
  let roots = []
  const entries = (() => { try { return listEntries(rc.ctx) } catch { return [] } })()
  try { roots = preflightRoots(rc.ctx, profileDir, { listEntries: () => entries, resolvePackageJson, pluginRoot }) } catch { roots = [] }
  const timeoutMs = preflightTimeoutMs()
  void runAutoPreflight({
    current,
    previous,
    timeoutMs,
    scan: ({ current: cur, previous: prev }) => scan({
      profileDir,
      patchPath,
      current: cur,
      previous: prev,
      presetRoots: [join(dshHome(), '.agent-presets')],
      roots,
      reasons,
      previousPackages: [],
      networkAllowed: false,
    }),
  }).then((result) => {
    // D5：预检**出结论之后**再看要不要自动禁用（有确证证据 + 开关开着 → 禁前快照 → 写盘 → 留记录）
    if (result?.ok === true && result.record !== null && result.record !== undefined) maybeAutoDisable({ rc, current, previous, reasons, patchPath, record: result.record })
  }).catch(() => {})
  return { scheduled: true, timeoutMs, roots: roots.length }
}

/**
 * D5 的接线：把 D1 预检结论里的**确证证据**交给自动禁用入口（`domain/auto-disable.js`）。
 * 开关（`compat-gate.json#autoDisableOnEvidence`，默认启用）关闭时只记录候选、不写盘。
 * 结果**只留在内存里给下一次状态查询用**（一次性提示；不新增任何常驻 UI/文件）。
 */
let lastAutoDisable = null
function maybeAutoDisable({ rc, current, previous, reasons, patchPath, record }) {
  try {
    const evidence = record.evidence ?? null
    const hasEvidence = Array.isArray(evidence?.rows) && evidence.rows.some((r) => r.code === 'package-unresolvable' || r.code === 'file-target-missing')
    const hasBoot = Array.isArray(evidence?.bootRows) && evidence.bootRows.length > 0
    if (!hasEvidence && !hasBoot) return null
    if (typeof patchPath !== 'string' || patchPath === '' || !existsSync(patchPath)) return null
    const gate = readCompatGate()
    const plan = rc?.deps?.autoDisableApply ?? applyEvidenceDisable
    const result = plan({
      patchPath,
      affected: Array.isArray(evidence?.rows) ? evidence.rows : [],
      bootRows: Array.isArray(evidence?.bootRows) ? evidence.bootRows : [],
      enabled: gate.autoDisableOnEvidence === true,
      uncertainty: evidence?.uncertainty ?? null,
      fingerprint: current,
```

</details>

**依据 3 · 源码核查**：[lib/server/routes/compat.js:423-434](https://github.com/Noob-stupid/dsh-plugin-gating-hub/blob/018c68d44b45c309ee02b65ad93bad2479c2bc80/lib/server/routes/compat.js#L423-L434)

两个禁用开关分别管理。

<details>
<summary>查看原文（12行）</summary>

```text
  const body = rc.body ?? {}
  // D5 加法：自动禁用（有确证证据时）的开关——同一把锁（compat-gate.json）里再记一个布尔。
  // 它与既有的 `autoDisable`（我们升级时）是两个独立开关；这里只动 `autoDisableOnEvidence`，
  // **不碰** 既有字段（一个字都不改旧语义）。
  if (typeof body.autoDisableOnEvidence === 'boolean') {
    const gate = writeCompatGate({ autoDisableOnEvidence: body.autoDisableOnEvidence })
    sendJson(res, 200, {
      ok: true,
      autoDisableOnEvidence: gate.autoDisableOnEvidence,
      autoDisable: gate.autoDisable,
      note: gate.autoDisableOnEvidence === true
        ? '指纹变化 / 启动失败记录给出确证证据时，会自动禁用被点名的行（禁前先存快照，可一条命令回滚）'
```

</details>

#### 缺口

- 没有外部升级后服务彻底无法启动的实测
  **影响**：无法证明所有更新入口都受保护
  **进一步探讨**：分别模拟服务仍能加载和启动前失败

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样验收采用价值与恢复成本？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

先在可弃用的副本演练，记录框架版本、锁文件和 profile 变更，观察全树备份耗时及体积。对照手工回滚，分别测正常升级、启动失败、全树备份失败和第三方行禁用后恢复。若关键文件无法复原或控制台无法启动，应走独立恢复，维持原部署。

#### 证据与依据

**依据 1 · 源码核查**：[lib/server/routes/framework-upgrade.js:184-209](https://github.com/Noob-stupid/dsh-plugin-gating-hub/blob/018c68d44b45c309ee02b65ad93bad2479c2bc80/lib/server/routes/framework-upgrade.js#L184-L209)

恢复点有最小门槛及降级条件。

<details>
<summary>查看原文（26行）</summary>

```text
      if (rollbackDir === null || !existsSync(join(rollbackDir, 'lib', 'bin.js'))) {
        sendError(res, 500, `框架备份失败（回滚点${rollbackDir !== null ? `：${rollbackDir}` : '（无）'}缺失或无效），已取消升级——请检查磁盘空间/权限后重试`)
        return
      }
      // 框架安装根识别（事故教训 2026-09-04）：require.resolve 返回 .pnpm 内部 realpath，
      // 旧逻辑 dirname(dirname(dshDir)) 指向 .pnpm/<entry>/node_modules——「重链跳过：.pnpm 目录不存在」、
      // 依赖修复 0 个，pnpm 还在错误 cwd 里把新 CLI 原位覆盖进旧 .pnpm 目录，旧树就此被毁。
      const fwRoot = resolveFrameworkRootNodeModules(dshDir)
      if (fwRoot === null || !existsSync(join(fwRoot, '.pnpm')) || !existsSync(join(fwRoot, '@deepseek-ai', 'dsh', 'lib', 'bin.js'))) {
        sendError(res, 500, `无法定位框架安装根（期望含 .pnpm 与 @deepseek-ai/dsh 的顶层 node_modules，实际：${fwRoot ?? '未找到'}）——已取消升级，请修复框架安装后重试`)
        return
      }
    steps.push(...repairStaleRenameResidue({ fwRoot }).steps) // 修上次失败的 .stale-* 改名残留（只 rename / 跳过已存在 / 幂等）
      // 框架全树 checkpoint（可靠回滚点）：升级前镜像全部 @deepseek-ai 版本包（自包内容）+ 顶层 scope + lock
      let fwCheckpoint = null
      try {
        const cpRoot = backupDir !== null ? backupDir : join(FRAMEWORK_BACKUP_ROOT(), current ?? 'unknown')
        fwCheckpoint = checkpointFrameworkTree(fwRoot, cpRoot)
        steps.push(`框架全树 checkpoint 完成：${fwCheckpoint.dest}（镜像 ${fwCheckpoint.mirrored} 个 @deepseek-ai 版本包；升级失败/拉起失败会自动全树回滚，也可用框架卡片的「回滚到上一版」一键回滚）`)
      } catch (error) {
        steps.push(`框架全树 checkpoint 失败：${error instanceof Error ? error.message : String(error)}（回滚点降级为 CLI 备份）`)
      }
      // 一键回滚记录：框架卡片「回滚到上一版」按钮读取
      try {
        writeFileSync(join(dshHome(), 'plugin-console', 'framework-rollback.json'), JSON.stringify({ from: current, to: target, checkpointDir: fwCheckpoint?.dest ?? null, cliBackupDir: rollbackDir, fwRoot, at: Date.now() }, null, 2), 'utf8')
      } catch {}
```

</details>

**依据 2 · 源码核查**：[lib/server/routes/compat.js:232-251](https://github.com/Noob-stupid/dsh-plugin-gating-hub/blob/018c68d44b45c309ee02b65ad93bad2479c2bc80/lib/server/routes/compat.js#L232-L251)

禁用状态提供恢复提示。

<details>
<summary>查看原文（20行）</summary>

```text
function autoDisableNotice(entry = lastAutoDisable, { enabled = null } = {}) {
  const on = enabled === null ? readCompatGate().autoDisableOnEvidence === true : enabled === true
  if (entry === null || entry === undefined) return null
  if (on !== true && entry.code === 'auto-disabled') return null
  const added = Array.isArray(entry.disabled) ? entry.disabled : []
  const restore = safeBootCommand(['--restore-last-good'])
  if (added.length > 0) {
    return {
      at: entry.at ?? null,
      zh: `已自动禁用 ${added.length} 行（确证解析不到 / 上次把服务搞挂）：${added.join('、')}；如需恢复：${restore}`,
      en: `Auto-disabled ${added.length} row(s) (confirmed unresolvable / crashed the service last time): ${added.join(', ')}; to restore: ${restore}`,
      disabled: added, snapshotId: entry.snapshotId ?? null, restoreCommand: restore, kind: 'auto-disabled',
    }
  }
  if (entry.code === 'switch-off') {
    return {
      at: entry.at ?? null,
      zh: `检测到需禁用的行，但自动禁用开关已关闭：${(entry.candidates ?? []).join('、')}（保持原样，等你手动处理）`,
      en: `Rows need disabling, but the auto-disable switch is off: ${(entry.candidates ?? []).join(', ')} (left untouched)`,
      disabled: [], candidates: entry.candidates ?? [], restoreCommand: restore, kind: 'switch-off',
```

</details>

#### 缺口

- 无恢复演练或数据完整性证据
  **影响**：不能估计停机和备份空间
  **进一步探讨**：在副本对照恢复前后版本、配置及关键功能

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
