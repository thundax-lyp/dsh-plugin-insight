# dsh-win32

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[7275779](https://github.com/sjh9714/dsh-win32/tree/7275779b8bb9346e1879742e4ad9da8bff09c8df)

<!-- BEGIN META -->
[![GitHub ★ 156](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=156&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sjh9714/dsh-win32) [![npm 30d 5,009](https://img.shields.io/static/v1?label=npm+30d&message=5%2C009&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-win32) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-win32)
<!-- END META -->

> **功能**：诊断原生 Windows 的 DSH 组件，提供快捷方式、组件验证和旧 bundle 停用。

> **亮点**：[Q01](#research-q01) 将发布检查、已装组件验证和旧 bundle 修复分到明确入口。

> **主要限制**：[Q02](#research-q02) verify 验收组件链，不能证明真实 Desktop 会话；未知清理状态会保留临时快照。

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
  - [Q01 · 当前原生 Windows 用户应使用哪个入口？](#detail-section-11)
  - [Q02 · 组件级 verify 和旧插件 disable 如何收尾？](#detail-section-12)
  - [Q03 · 怎样先低风险判断，并减少安装健康误判？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：原生 Windows 用户排查 DSH 启动或旧预设冲突。

按官方安装方式手工检查 PowerShell、权限和 profile。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 组件诊断与验证 | 定位 Windows 运行链问题 | 不覆盖完整用户会话 |
| 旧 bundle 停用 | 恢复当前官方入口 | 默认预览，应用需先停 Host |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 原生 Windows 与受支持 Node | 当前 CLI 必需 | 运行 setup/verify | 非 Windows 或版本不符不支持 |
| 已安装的官方 DSH | verify 必需 | 解析并验收组件 | 缺组件时失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户固定测试 profile 和已装 DSH | 区分旧 bundle |
| 验证 | 用户运行独立组件检查 | 按报告核对成功和失败 |
| 恢复 | 用户保留备份并回原生启动 | 避免未核验配置改写 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 确认 Node、DSH 与 profile | 快捷方式按需 |
| 持续 | 运行资源未知 | 区分组件验证和真实会话 | 随宿主更新需复核 |
| 失败 | 恢复耗时未知 | 核对临时快照和备份 | 清理不明时保留证据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| Windows 排障 | 检查安装、PowerShell 组件与旧配置 | 实际首次启动率与节时 |

> **思考**：[Q02](#research-q02) verify 验收组件链，不能证明真实 Desktop 会话；未知清理状态会保留临时快照。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将发布检查、已装组件验证和旧 bundle 修复分到明确入口。

[Q02](#research-q02) 旧 bundle 停用先备份并核对并发变化，组件验证将不确定清理标为失败。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) verify 验收组件链，不能证明真实 Desktop 会话；未知清理状态会保留临时快照。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先检查测试 profile，组件验证成功后再独立验收真实会话。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认 CLI 路由及组件验证边界，真实 Windows 结果未复验。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、bin/cli.mjs、src/verify.ts、src/profile-disable.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 CLI、组件验证和旧 bundle 停用源码。未运行 Windows、DSH、目标命令或测试。
- 下一步：覆盖原生 Windows、旧/新 profile、组件拒绝、清理及真实会话。

**分析版本**

- **仓库**：[sjh9714/dsh-win32](https://github.com/sjh9714/dsh-win32)
- **版本号**：0.18.0（[固定提交 7275779](https://github.com/sjh9714/dsh-win32/tree/7275779b8bb9346e1879742e4ad9da8bff09c8df)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 分层显示三类证据，比较安装排障的误判与时间。

覆盖原生 Windows、旧/新 profile、组件拒绝、清理及真实会话。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 1250 | — | — | 20609 |
| .mjs | source | 17 | 2429 | 1837 | 409 | — |
| .ts | test | 23 | 3652 | 3151 | 162 | — |
| .ts | source | 13 | 2979 | 2209 | 560 | — |
| .mjs | example | 1 | 42 | 38 | 2 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/sjh9714/dsh-win32/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：原生 Windows 用户能否定位 DSH 首次启动问题，并区分发布声明、已装组件与实际会话？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 当前原生 Windows 用户应使用哪个入口？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对已经安装官方 DSH 的用户，独立 setup 可检查发布包是否声明官方 PowerShell 与 ACL 组件，按条件创建快捷方式，并给出 Minimal 和 Workspace Write 的后续步骤。固定包同时保留 legacy bundle，但作者明确当前路径使用 CLI，不应把旧插件替代当前配置。相对手工诊断，增量在区分发布元数据、安装链路和本地验证，成功不等同建立真实 Desktop 会话。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-23](https://github.com/sjh9714/dsh-win32/blob/7275779b8bb9346e1879742e4ad9da8bff09c8df/README.md#L3-L23)

当前和 legacy 路径。

<details>
<summary>查看原文（21行）</summary>

````text
## Fix DSH on Windows. No WSL.

**Official PowerShell. Workspace Write. One command.**

```powershell
npx dsh-win32 setup
```

Current DeepSeek Harness already includes persistent PowerShell and a Windows ACL sandbox. dsh-win32 checks that official stack, finds known Windows failures, applies the repairs it can prove safe, and creates a desktop shortcut.

It does not install Git, PowerShell, busybox, WSL, or another DSH bundle on the current path.

Use the standalone CLI above on current DSH. Do **not** run `dsh plugin --profile web add dsh-win32` for this workflow: that installs the legacy bundle, not the current Windows setup path.

[中文](./docs/README.zh.md) · [Windows evidence and legacy details](./docs/windows-details.md)

Using a coding agent? [Copy the setup and verification request](https://github.com/sjh9714/dsh-win32/blob/master/docs/agent-setup.md). For a guided walkthrough, see [Windows troubleshooting in Chinese](https://github.com/sjh9714/dsh-win32/blob/master/docs/windows-first-run.zh.md).

Start with the [Windows first-run walkthrough](./docs/windows-first-run.md) if DSH will not launch or a check fails. It follows one problem from diagnosis through the next verification step. [Share your first-run result](https://github.com/sjh9714/dsh-win32/issues/new?template=first-run.md), including attempts that are still blocked.

**Need to disable or uninstall the old plugin, even when DSH cannot start?** See [disable / uninstall / remove](./docs/uninstall.md). From 0.17.14, `npx dsh-win32@0.17.14 disable --profile web` previews offline deactivation; after stopping DSH, add `--apply` to back up the manifest and disconnect only the old bundle.
````

</details>

**依据 2 · 源码核查**：[package.json:31-45](https://github.com/sjh9714/dsh-win32/blob/7275779b8bb9346e1879742e4ad9da8bff09c8df/package.json#L31-L45)

CLI 与库导出并存。

<details>
<summary>查看原文（15行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "bin": {
    "dsh-win32": "bin/cli.mjs"
  },
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./package.json": "./package.json",
    "./fs": {
```

</details>

**依据 3 · 源码核查**：[bin/cli.mjs:623-672](https://github.com/sjh9714/dsh-win32/blob/7275779b8bb9346e1879742e4ad9da8bff09c8df/bin/cli.mjs#L623-L672)

实际 setup 分支及可选验证。

<details>
<summary>查看原文（50行）</summary>

```text
async function setupCurrent(args) {
  const profile = profileFrom(args)
  if (!WIN) {
    console.error('setup: current DSH Windows setup is Windows-only')
    process.exit(1)
  }
  const health = doctor({ profile })
  console.log('')
  if (!health.official) {
    console.error('setup: the published DSH release does not expose the complete official Windows stack')
    console.error('update DSH or run npx dsh-win32 setup --legacy for an rc.6-era installation')
    process.exit(1)
  }
  console.log('current DSH already includes persistent PowerShell and the Windows Workspace Write sandbox')
  console.log('dsh-win32 did not install a bundle, custom preset, Git Bash, busybox, or another program')
  if (args.includes('--sandboxed')) {
    console.log('--sandboxed is no longer needed; the official preset uses Workspace Write directly')
  }

  if (profile === 'web' && !args.includes('--no-shortcut')) {
    try {
      createShortcut()
      console.log('created desktop shortcut "DeepSeek Harness"')
    } catch {
      warn('could not create the desktop shortcut. Start with: npx @deepseek-ai/dsh web')
    }
  }

  console.log('')
  console.log('next, in order:')
  if (profile === 'web' && !args.includes('--no-shortcut')) {
    console.log('  1. double-click "DeepSeek Harness" on your desktop')
  } else {
    console.log(profile === 'web'
      ? '  1. npx @deepseek-ai/dsh web'
      : `  1. start or restart the DSH host that uses profile "${profile}"`)
  }
  console.log('  2. add a workspace from the sidebar')
  console.log('  3. choose the stock Minimal preset and keep Workspace Write enabled')
  offerSetupStar()
  console.log('')
  console.log(`${REPO}  (Windows fixes, doctor output, and legacy rc.6 support)`)

  if (args.includes('--verify')) {
    console.log('')
    console.log('setup finished; running the optional installed-stack check')
    // Reuse the standalone verifier, including installed identity, isolation,
    // cleanup and nonzero failure/unsupported exit semantics. Setup metadata
    // and a shortcut are not evidence that this component check passed.
    await verify({ profile })
```

</details>

#### 缺口

- 没有目标 Windows 机的首次使用对照
  **影响**：不能量化安装修复与启动节时
  **进一步探讨**：在测试机对比 metadata、已装组件与第一次会话

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 组件级 verify 和旧插件 disable 如何收尾？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

verify 先判平台和 Node，解析已装 DSH 后建立临时 home 与 workspace，执行组件测试，再汇总 checks。不能确认后代进程或目录边界时会保留临时快照并报失败，而非贸然清理。作者将其限定为组件链路，不代表真实用户 profile 或完整 GUI。disable 默认预览，apply 加锁后两次核对原始 manifest、保存原始字节，最后 rename 替换；只处理 legacy bundle 激活项，CLI 提示先停止 DSH。并发外部修改仍需按文件核对。

#### 证据与依据

**依据 1 · 源码核查**：[src/verify.ts:629-679](https://github.com/sjh9714/dsh-win32/blob/7275779b8bb9346e1879742e4ad9da8bff09c8df/src/verify.ts#L629-L679)

verify 隔离、报告与清理。

<details>
<summary>查看原文（51行）</summary>

```text
export async function verifyInstalledStack(
  { profile = 'web' }: { profile?: string } = {},
  dependencies: VerifyDependencies = DEFAULT_DEPENDENCIES,
): Promise<VerifyReport> {
  if (dependencies.platform !== 'win32') return unsupported('native Windows only')
  if (!supportsDshNode(dependencies.nodeVersion)) return unsupported('requires Node 22.19+ (except Node 23) or Node 24+')

  const installed = dependencies.findInstalledDsh(profile)
  if (installed === undefined) {
    return failed('installed_dsh', 'no installed @deepseek-ai/dsh dependency tree was found; run verify from an existing DSH installation')
  }

  let directories: VerifyDirectories
  try {
    directories = dependencies.makeDirectories()
  } catch {
    return failed('isolation', 'could not create the isolated temporary home and workspace', installed.version)
  }

  let report: VerifyReport
  let preserveSnapshot = false
  try {
    report = await dependencies.runWorker({ ...directories, packageJson: installed.packageJson })
  } catch (error) {
    if (error instanceof WorkerTerminationError) {
      preserveSnapshot = error.containmentUnconfirmed
      report = failed(error.check, error.safeDetail, installed.version)
    } else {
      report = failed('official_component_chain', 'the isolated verification worker failed without a usable report', installed.version)
    }
  }

  if (preserveSnapshot) {
    report.checks.push({
      name: 'temporary_snapshot_preserved',
      status: 'fail',
      detail: 'isolated snapshot preserved because temporary-root and descendant containment could not be confirmed',
    })
  } else {
    try {
      dependencies.cleanup(directories.root)
      if (existsSync(directories.root)) throw new Error('temporary root remains')
      report.checks.push({ name: 'temporary_cleanup', status: 'pass', detail: 'isolated home and workspace removed' })
    } catch {
      report.checks.push({ name: 'temporary_cleanup', status: 'fail', detail: 'isolated home or workspace could not be fully removed' })
    }
  }
  report.installedDshVersion ??= installed.version
  report.installedDshSource ??= installed.source
  report.ok = report.checks.length > 0 && report.checks.every(check => check.status === 'pass')
  report.status = report.ok ? 'pass' : 'fail'
```

</details>

**依据 2 · 源码核查**：[bin/cli.mjs:762-785](https://github.com/sjh9714/dsh-win32/blob/7275779b8bb9346e1879742e4ad9da8bff09c8df/bin/cli.mjs#L762-L785)

预览和 apply 入口。

<details>
<summary>查看原文（24行）</summary>

```text
function disable(args) {
  try {
    const options = { home: DSH_HOME }
    for (let index = 0; index < args.length; index += 1) {
      const arg = args[index]
      if (arg === '--apply' && options.apply === undefined) options.apply = true
      else if ((arg === '--profile' || arg === '--profile-dir') && args[index + 1] && !args[index + 1].startsWith('--')) {
        const key = arg === '--profile' ? 'profile' : 'profileDir'
        if (options[key] !== undefined) throw new Error(`duplicate ${arg}`)
        options[key] = args[++index]
      } else throw new Error('usage: dsh-win32 disable [--profile <name> | --profile-dir <directory>] [--apply]')
    }
    const result = disableProfile(options)
    console.log(`Profile manifest: ${result.manifestPath}`)
    if (result.status === 'preview') {
      console.log('Preview: remove dsh-win32 from dsh.profile.bundles only; no files changed.')
      console.log('Stop DSH and its sessions, then repeat this command with --apply to create a backup and disable the bundle.')
    } else if (result.status === 'disabled') {
      console.log('Disabled the dsh-win32 bundle in this profile without starting DSH.')
      console.log(`Original backup: ${result.backupPath}`)
    } else console.log('dsh-win32 is already absent from this profile bundle list; no files changed.')
    for (const note of result.notes) console.log(note)
  } catch (error) {
    console.error(`disable: ${error.message}`)
```

</details>

**依据 3 · 源码核查**：[src/profile-disable.ts:103-135](https://github.com/sjh9714/dsh-win32/blob/7275779b8bb9346e1879742e4ad9da8bff09c8df/src/profile-disable.ts#L103-L135)

锁、备份、并发检测与替换。

<details>
<summary>查看原文（33行）</summary>

```text
 * atomic replacement. The original bytes remain in a unique private backup.
 */
export function disableProfile(options: DisableOptions): DisableResult {
  let backupPath: string | undefined
  try {
    const dir = profileDirectory(options)
    const manifestPath = join(dir, 'package.json')
    const original = readManifest(manifestPath)
    const next = deactivate(original)
    const notes = manualNotes(dir)
    if (next === undefined) return { status: 'already-disabled', manifestPath, notes }
    if (!options.apply) return { status: 'preview', manifestPath, notes }

    // Never steal an existing lock, even if its owner appears to have stopped.
    const lockPath = `${manifestPath}.lock`
    let lock: number
    try { lock = openSync(lockPath, 'wx', 0o600) } catch {
      throw new Error('could not acquire package.json.lock; stop the host/package operation and inspect the lock locally')
    }
    try {
      writeFileSync(lock, `${process.pid}\n`)
      if (!readManifest(manifestPath).equals(original)) throw new Error('package.json changed during preview; run the command again')
      const backupDir = mkdtempSync(join(dir, '.dsh-win32-backup-'))
      const originalPath = join(backupDir, 'package.json')
      const saved = openSync(originalPath, 'wx', 0o600)
      try { writeFileSync(saved, original); fsyncSync(saved) } finally { closeSync(saved) }
      backupPath = originalPath
      const replacement = join(backupDir, 'next-package.json')
      const pending = openSync(replacement, 'wx', 0o600)
      try { writeFileSync(pending, next); fsyncSync(pending) } finally { closeSync(pending) }
      if (!readManifest(manifestPath).equals(original)) throw new Error('package.json changed during backup; replacement was stopped')
      renameSync(replacement, manifestPath)
      return { status: 'disabled', manifestPath, backupPath, notes }
```

</details>

**依据 4 · 作者声明**：[README.md:59-70](https://github.com/sjh9714/dsh-win32/blob/7275779b8bb9346e1879742e4ad9da8bff09c8df/README.md#L59-L70)

作者的验收边界。

<details>
<summary>查看原文（12行）</summary>

````text
## Live verification of an installed stack

From **0.17.12**, opt in to setup followed by one installed-stack check:

```powershell
npx dsh-win32 setup --verify
```

Use `--profile NAME --no-shortcut` when appropriate. Ordinary `setup` is unchanged; `--legacy --verify` is rejected. Setup and component acceptance are reported separately, and a failed or unsupported verification makes the command exit nonzero. This does not install DSH or prove a complete Desktop/Minimal session. For a check without setup or JSON output, use the standalone command:

```powershell
npx dsh-win32 verify
````

</details>

#### 缺口

- 本轮未跑原生 Windows 与宿主验证
  **影响**：无法证明在该机器的 ACL、PowerShell 或清理效果
  **进一步探讨**：隔离 Windows 对照成功、失败、unsupported、退出和恢复备份

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样先低风险判断，并减少安装健康误判？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

在已安装 DSH 的原生 Windows 机器确认 Node 版本和目标 profile。先做只读诊断或明确 verify；需要快捷方式再 setup，旧 bundle 停用先预览、停止 Host 并核对备份。若 verify 异常，区分无法启动、检查失败和保留临时目录，回官方启动方式。可验证将发布元数据、已装组件结果与用户真实 profile 验收分别标记，比较缺一层证据时的误判和排查时间。若不降低错误归因或增加不必要步骤则放弃。

#### 证据与依据

**依据 1 · 源码核查**：[bin/cli.mjs:623-673](https://github.com/sjh9714/dsh-win32/blob/7275779b8bb9346e1879742e4ad9da8bff09c8df/bin/cli.mjs#L623-L673)

setup 和 verify 分离。

<details>
<summary>查看原文（51行）</summary>

```text
async function setupCurrent(args) {
  const profile = profileFrom(args)
  if (!WIN) {
    console.error('setup: current DSH Windows setup is Windows-only')
    process.exit(1)
  }
  const health = doctor({ profile })
  console.log('')
  if (!health.official) {
    console.error('setup: the published DSH release does not expose the complete official Windows stack')
    console.error('update DSH or run npx dsh-win32 setup --legacy for an rc.6-era installation')
    process.exit(1)
  }
  console.log('current DSH already includes persistent PowerShell and the Windows Workspace Write sandbox')
  console.log('dsh-win32 did not install a bundle, custom preset, Git Bash, busybox, or another program')
  if (args.includes('--sandboxed')) {
    console.log('--sandboxed is no longer needed; the official preset uses Workspace Write directly')
  }

  if (profile === 'web' && !args.includes('--no-shortcut')) {
    try {
      createShortcut()
      console.log('created desktop shortcut "DeepSeek Harness"')
    } catch {
      warn('could not create the desktop shortcut. Start with: npx @deepseek-ai/dsh web')
    }
  }

  console.log('')
  console.log('next, in order:')
  if (profile === 'web' && !args.includes('--no-shortcut')) {
    console.log('  1. double-click "DeepSeek Harness" on your desktop')
  } else {
    console.log(profile === 'web'
      ? '  1. npx @deepseek-ai/dsh web'
      : `  1. start or restart the DSH host that uses profile "${profile}"`)
  }
  console.log('  2. add a workspace from the sidebar')
  console.log('  3. choose the stock Minimal preset and keep Workspace Write enabled')
  offerSetupStar()
  console.log('')
  console.log(`${REPO}  (Windows fixes, doctor output, and legacy rc.6 support)`)

  if (args.includes('--verify')) {
    console.log('')
    console.log('setup finished; running the optional installed-stack check')
    // Reuse the standalone verifier, including installed identity, isolation,
    // cleanup and nonzero failure/unsupported exit semantics. Setup metadata
    // and a shortcut are not evidence that this component check passed.
    await verify({ profile })
  }
```

</details>

**依据 2 · 源码核查**：[src/verify.ts:629-679](https://github.com/sjh9714/dsh-win32/blob/7275779b8bb9346e1879742e4ad9da8bff09c8df/src/verify.ts#L629-L679)

verify 状态。

<details>
<summary>查看原文（51行）</summary>

```text
export async function verifyInstalledStack(
  { profile = 'web' }: { profile?: string } = {},
  dependencies: VerifyDependencies = DEFAULT_DEPENDENCIES,
): Promise<VerifyReport> {
  if (dependencies.platform !== 'win32') return unsupported('native Windows only')
  if (!supportsDshNode(dependencies.nodeVersion)) return unsupported('requires Node 22.19+ (except Node 23) or Node 24+')

  const installed = dependencies.findInstalledDsh(profile)
  if (installed === undefined) {
    return failed('installed_dsh', 'no installed @deepseek-ai/dsh dependency tree was found; run verify from an existing DSH installation')
  }

  let directories: VerifyDirectories
  try {
    directories = dependencies.makeDirectories()
  } catch {
    return failed('isolation', 'could not create the isolated temporary home and workspace', installed.version)
  }

  let report: VerifyReport
  let preserveSnapshot = false
  try {
    report = await dependencies.runWorker({ ...directories, packageJson: installed.packageJson })
  } catch (error) {
    if (error instanceof WorkerTerminationError) {
      preserveSnapshot = error.containmentUnconfirmed
      report = failed(error.check, error.safeDetail, installed.version)
    } else {
      report = failed('official_component_chain', 'the isolated verification worker failed without a usable report', installed.version)
    }
  }

  if (preserveSnapshot) {
    report.checks.push({
      name: 'temporary_snapshot_preserved',
      status: 'fail',
      detail: 'isolated snapshot preserved because temporary-root and descendant containment could not be confirmed',
    })
  } else {
    try {
      dependencies.cleanup(directories.root)
      if (existsSync(directories.root)) throw new Error('temporary root remains')
      report.checks.push({ name: 'temporary_cleanup', status: 'pass', detail: 'isolated home and workspace removed' })
    } catch {
      report.checks.push({ name: 'temporary_cleanup', status: 'fail', detail: 'isolated home or workspace could not be fully removed' })
    }
  }
  report.installedDshVersion ??= installed.version
  report.installedDshSource ??= installed.source
  report.ok = report.checks.length > 0 && report.checks.every(check => check.status === 'pass')
  report.status = report.ok ? 'pass' : 'fail'
```

</details>

**依据 3 · 源码核查**：[src/profile-disable.ts:105-135](https://github.com/sjh9714/dsh-win32/blob/7275779b8bb9346e1879742e4ad9da8bff09c8df/src/profile-disable.ts#L105-L135)

旧 bundle 停用成本。

<details>
<summary>查看原文（31行）</summary>

```text
export function disableProfile(options: DisableOptions): DisableResult {
  let backupPath: string | undefined
  try {
    const dir = profileDirectory(options)
    const manifestPath = join(dir, 'package.json')
    const original = readManifest(manifestPath)
    const next = deactivate(original)
    const notes = manualNotes(dir)
    if (next === undefined) return { status: 'already-disabled', manifestPath, notes }
    if (!options.apply) return { status: 'preview', manifestPath, notes }

    // Never steal an existing lock, even if its owner appears to have stopped.
    const lockPath = `${manifestPath}.lock`
    let lock: number
    try { lock = openSync(lockPath, 'wx', 0o600) } catch {
      throw new Error('could not acquire package.json.lock; stop the host/package operation and inspect the lock locally')
    }
    try {
      writeFileSync(lock, `${process.pid}\n`)
      if (!readManifest(manifestPath).equals(original)) throw new Error('package.json changed during preview; run the command again')
      const backupDir = mkdtempSync(join(dir, '.dsh-win32-backup-'))
      const originalPath = join(backupDir, 'package.json')
      const saved = openSync(originalPath, 'wx', 0o600)
      try { writeFileSync(saved, original); fsyncSync(saved) } finally { closeSync(saved) }
      backupPath = originalPath
      const replacement = join(backupDir, 'next-package.json')
      const pending = openSync(replacement, 'wx', 0o600)
      try { writeFileSync(pending, next); fsyncSync(pending) } finally { closeSync(pending) }
      if (!readManifest(manifestPath).equals(original)) throw new Error('package.json changed during backup; replacement was stopped')
      renameSync(replacement, manifestPath)
      return { status: 'disabled', manifestPath, backupPath, notes }
```

</details>

#### 缺口

- 无实际 Windows 运行和用户排障记录
  **影响**：收益与恢复工时未知
  **进一步探讨**：在不同 DSH 安装状态及旧 profile 进行对照

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
