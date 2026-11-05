# DeepSeek Harness for VS Code

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[9a82e26](https://github.com/skymecode/deepseek-harness-for-vscode/tree/9a82e266cb8c857e906e629bd36e5531a3909cf1)

<!-- BEGIN META -->
[![GitHub ★ 163](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=163&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/skymecode/deepseek-harness-for-vscode)
<!-- END META -->

> **功能**：在 VS Code 提供基于内置 Harness 运行时的原生工作台与会话入口。

> **亮点**：[Q01](#research-q01) 把运行时与编辑器服务组合。

> **主要限制**：[Q03](#research-q03) 源码和 VSIX 运行时版本有差异，数据升级要留备份。

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
  - [Q01 · 编辑器中的增量是什么？](#detail-section-11)
  - [Q02 · 宿主怎样启动？](#detail-section-12)
  - [Q03 · 升级与回退的关键限制是什么？](#detail-section-13)
  - [Q04 · 怎样安排有限试用？](#detail-section-14)
  - [Q05 · 版本提示能否减少错误降级？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在 VS Code 里使用 Harness 的开发者可以评估原生工作台。

独立 Web 页面可用，但要切换窗口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 工作台 | 从编辑器进入会话 | 需要 VS Code 与运行时 |
| 运行时 | 本地启动网关 | 历史版本需匹配 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 平台 VSIX | 必需 | 安装扩展 | 回独立 DSH |
| 运行时与配置 | 必需 | 连接模型和会话 | 无法完整使用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 核对平台包 | 备份历史 |
| 核查 | 打开测试工作区 | 检查运行时和会话 |
| 退出 | 停用扩展 | 保留历史 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源费用未知 | 准备耗时未知 | 版本差异 |
| 持续 | 推理费用未知 | 维护耗时未知 | 依赖宿主 |
| 恢复 | 恢复资源未知 | 备份验证耗时未知 | 历史未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 编辑器内入口 | 激活和网关接线明确 | 真实安装效果 |

> **思考**：[Q03](#research-q03) 源码和 VSIX 运行时版本有差异，数据升级要留备份。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把运行时与编辑器服务组合。

识别旧模块冲突后备份处理。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 源码和 VSIX 运行时版本有差异，数据升级要留备份。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先验证对应平台包并保留旧历史。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的VS Code 激活、回环宿主和版本迁移。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/extension.ts、src/runtime/web-runtime.ts、src/runtime/module-fallback-recovery.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的VS Code 激活、回环宿主和版本迁移。未执行目标代码或实际宿主验证。
- 下一步：用合成 V4 历史做隔离实验

**分析版本**

- **仓库**：[skymecode/deepseek-harness-for-vscode](https://github.com/skymecode/deepseek-harness-for-vscode)
- **版本号**：0.6.1（[固定提交 9a82e26](https://github.com/skymecode/deepseek-harness-for-vscode/tree/9a82e266cb8c857e906e629bd36e5531a3909cf1)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 验证恢复时的版本提示。

用合成 V4 历史做隔离实验

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1346 | — | — | 33504 |
| .mjs | source | 4 | 190 | 161 | 19 | — |
| .ts | source | 175 | 22836 | 18725 | 2464 | — |
| .ts | test | 118 | 12438 | 11000 | 351 | — |
| .mjs | example | 1 | 25 | 23 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/skymecode/deepseek-harness-for-vscode/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/skymecode/deepseek-harness-for-vscode/issues?q=is%3Aissue+created%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/skymecode/deepseek-harness-for-vscode/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：VS Code 激活、回环宿主和版本迁移

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 编辑器中的增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

扩展注册原生侧栏与命令，并构造编辑器选择、文件和网关服务。相对切去 DSH Web，用户可在 IDE 内进入会话；其宿主能力仍由打包 Harness 提供。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-13](https://github.com/skymecode/deepseek-harness-for-vscode/blob/9a82e266cb8c857e906e629bd36e5531a3909cf1/README.md#L5-L13)

作者定位与发行差异

```text
A native VS Code coding-agent extension powered by [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness). Install the platform-specific VSIX and start working—there is no upstream repository to clone, no Node/npm setup, and no local Harness deployment to manage.

> This is the community-maintained **0.6.1 codebase with unreleased fixes**. Current source pins the official `@deepseek-ai/dsh@0.2.1-rc.3` package (Typert Remote protocol). The published 0.6.1 assets still contain `0.2.1-alpha.1`; DeepSeek Harness remains a Developer Preview.

Pending updates fix duplicate user prompts appearing after their answers when editor context is attached, preserve message order during streaming and rapid submissions, and support the new external-task entries in the native subagent catalog. See the [changelog](CHANGELOG.md).

> **Runtime upgrade:** Harness now uses session format V4. Supported older logs are migrated on resume into a new generation while their original files are preserved. Old runtimes cannot read the new V4 generation; back up the shared history home (default `~/.dsh`) and the private `~/.dsh/vscode/harness-home` before upgrading, and do not downgrade an active profile. Third-party plugins using the removed `ctx.agent` or runtime `Inbox` APIs need their own compatibility updates. The extension keeps its native VS Code interface rather than embedding the official Web UI.

Startup uses the official runtime package resolver. Only a recognized legacy module conflict triggers one bounded backup-and-repair attempt; ordinary profile packages are no longer moved on every startup or installation.
```

**依据 2 · 源码核查**：[src/extension.ts:36-51](https://github.com/skymecode/deepseek-harness-for-vscode/blob/9a82e266cb8c857e906e629bd36e5531a3909cf1/src/extension.ts#L36-L51)

工作台服务

<details>
<summary>查看原文（16行）</summary>

```text
  const output = vscode.window.createOutputChannel('DeepSeek Harness', { log: true })
  const configuration = new ConfigurationService()
  const credentials = new CredentialStore(context.secrets)
  const resolver = new BundledRuntimeResolver(context, (message, ...args) => vscode.l10n.t(message, ...args))
  const connectionSettings = new ConnectionSettingsService(configuration, credentials)
  const runtime = new HarnessHostRuntime(context, configuration, resolver, output)
  const worktrees = new WorktreeService(context.globalState)
  const gateway = new HarnessGatewayService(runtime, configuration, connectionSettings, output, context.globalState, worktrees)
  const notifications = new CompletionNotifications(output)
  const connectionTest = new ConnectionTestService(() => gateway.providerControlClient())
  const pluginManager = new DshPluginManager(context, resolver, output, () => gateway.providerControlClient())
  const pluginCatalog = new DshPluginCatalogService()
  const pluginCenter = new DshPluginCenterController(pluginManager, pluginCatalog, gateway)
  const sessionImport = new SessionImportService(pluginManager, gateway)
  const editorSelection = new EditorSelectionService()
  const workspaceFiles = new WorkspaceFileService()
```

</details>

**依据 3 · 源码核查**：[src/extension.ts:110-136](https://github.com/skymecode/deepseek-harness-for-vscode/blob/9a82e266cb8c857e906e629bd36e5531a3909cf1/src/extension.ts#L110-L136)

VS Code 命令注册

<details>
<summary>查看原文（27行）</summary>

```text
    gateway.onDidCompleteTurn((notice) => notifications.complete(notice)),
    worktrees,
    pluginCenter,
    editorSelection,
    workspaceFiles,
    provider,
    vscode.window.registerWebviewViewProvider(WorkbenchViewProvider.viewType, provider, {
      webviewOptions: { retainContextWhenHidden: true },
    }),
    vscode.commands.registerCommand('deepseekHarness.openChat', focusWorkbench),
    vscode.commands.registerCommand('deepseekHarness.openChatWindow', () => provider.openPanel()),
    vscode.commands.registerCommand('deepseekHarness.reloadRuntime', () => provider.refresh()),
    vscode.commands.registerCommand('deepseekHarness.setApiKey', setApiKey),
    vscode.commands.registerCommand('deepseekHarness.clearApiKey', async () => {
      const clear = vscode.l10n.t('Clear')
      const answer = await vscode.window.showWarningMessage(
        vscode.l10n.t('Clear the DeepSeek API Key from the local Harness credential store?'),
        { modal: true },
        clear,
      )
      if (answer !== clear) return
      if (connectionSettings.connected) await connectionSettings.clearOfficialApiKey()
      await credentials.clearApiKey()
    }),
    vscode.commands.registerCommand('deepseekHarness.showLogs', () => output.show(true)),
    vscode.commands.registerCommand('deepseekHarness.testSystemNotification', () => notifications.test()),
    vscode.commands.registerCommand('deepseekHarness.importSession', () => sessionImport.runInteractive()),
```

</details>

#### 缺口

- 未运行编辑器
  **影响**：无法判断实际操作效率
  **进一步探讨**：对照打开同一项目和会话

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主怎样启动？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

激活时给 NO_PROXY 加入 loopback，使用运行时解析器构造网关。宿主使用回环及随机端口启动，并带 overlay。独立进程能被工作台控制，回环不是多用户隔离。

#### 证据与依据

**依据 1 · 源码核查**：[src/extension.ts:24-43](https://github.com/skymecode/deepseek-harness-for-vscode/blob/9a82e266cb8c857e906e629bd36e5531a3909cf1/src/extension.ts#L24-L43)

回环代理和激活

<details>
<summary>查看原文（20行）</summary>

```text
export async function activate(context: vscode.ExtensionContext): Promise<void> {
  // The bundled Gateway always listens on 127.0.0.1, and undici (the fetch
  // used by the Gateway client) honors system proxy env vars. A global proxy
  // (Clash/Surge/company VPN) would otherwise route loopback requests through
  // the proxy and fail with `fetch failed`, leaving the workbench stuck on
  // "Starting Harness". Loopback must never go through a proxy.
  const noProxy = new Set((process.env.NO_PROXY ?? process.env.no_proxy ?? '').split(',').map((item) => item.trim()).filter((item) => item !== ''))
  noProxy.add('127.0.0.1')
  noProxy.add('localhost')
  process.env.NO_PROXY = [...noProxy].join(',')
  process.env.no_proxy = [...noProxy].join(',')

  const output = vscode.window.createOutputChannel('DeepSeek Harness', { log: true })
  const configuration = new ConfigurationService()
  const credentials = new CredentialStore(context.secrets)
  const resolver = new BundledRuntimeResolver(context, (message, ...args) => vscode.l10n.t(message, ...args))
  const connectionSettings = new ConnectionSettingsService(configuration, credentials)
  const runtime = new HarnessHostRuntime(context, configuration, resolver, output)
  const worktrees = new WorktreeService(context.globalState)
  const gateway = new HarnessGatewayService(runtime, configuration, connectionSettings, output, context.globalState, worktrees)
```

</details>

**依据 2 · 源码核查**：[src/runtime/web-runtime.ts:174-180](https://github.com/skymecode/deepseek-harness-for-vscode/blob/9a82e266cb8c857e906e629bd36e5531a3909cf1/src/runtime/web-runtime.ts#L174-L180)

绑定与 patch 参数

```text
    // DSH owns runtime profile resolution. Legacy repair runs only after a
    // recognized old-link failure, preserving unrelated installed packages.

    const args = [...launch.args, 'web', '--patch', overlay, '--host', '127.0.0.1', '--port', '0']
    const env: NodeJS.ProcessEnv = {
      ...launch.environment,
      DSH_HOME: home,
```

**依据 3 · 源码核查**：[src/runtime/web-runtime.ts:238-250](https://github.com/skymecode/deepseek-harness-for-vscode/blob/9a82e266cb8c857e906e629bd36e5531a3909cf1/src/runtime/web-runtime.ts#L238-L250)

启动子进程

<details>
<summary>查看原文（13行）</summary>

```text
    // made the Gateway refuse to boot. The harness still operates in the
    // workspace through DSH_CWD (agent cwd) — process cwd only drives .env
    // and profile/config discovery, both of which live under DSH_HOME.
    const child = spawn(launch.command, args, { cwd: home, env, windowsHide: true })
    this.child = child
    let diagnostics = ''
    child.stderr.on('data', (chunk: Buffer | string) => {
      const text = String(chunk)
      this.output.append(text)
      diagnostics = (diagnostics + text).slice(-16_384)
    })

    return await new Promise<GatewayBoot>((resolve) => {
```

</details>

#### 缺口

- 未测试代理和跨平台启动
  **影响**：无法确认系统兼容
  **进一步探讨**：隔离测试代理和启动日志

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 升级与回退的关键限制是什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

README 指明源代码和已发 VSIX 内的 DSH 版本不同，V4 会话不能由旧运行时读取。模块回退只在识别特定旧模块冲突时处理，把受影响模块改名备份。这个备份行为不能当成会话降级保障。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-13](https://github.com/skymecode/deepseek-harness-for-vscode/blob/9a82e266cb8c857e906e629bd36e5531a3909cf1/README.md#L5-L13)

版本和数据兼容

```text
A native VS Code coding-agent extension powered by [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness). Install the platform-specific VSIX and start working—there is no upstream repository to clone, no Node/npm setup, and no local Harness deployment to manage.

> This is the community-maintained **0.6.1 codebase with unreleased fixes**. Current source pins the official `@deepseek-ai/dsh@0.2.1-rc.3` package (Typert Remote protocol). The published 0.6.1 assets still contain `0.2.1-alpha.1`; DeepSeek Harness remains a Developer Preview.

Pending updates fix duplicate user prompts appearing after their answers when editor context is attached, preserve message order during streaming and rapid submissions, and support the new external-task entries in the native subagent catalog. See the [changelog](CHANGELOG.md).

> **Runtime upgrade:** Harness now uses session format V4. Supported older logs are migrated on resume into a new generation while their original files are preserved. Old runtimes cannot read the new V4 generation; back up the shared history home (default `~/.dsh`) and the private `~/.dsh/vscode/harness-home` before upgrading, and do not downgrade an active profile. Third-party plugins using the removed `ctx.agent` or runtime `Inbox` APIs need their own compatibility updates. The extension keeps its native VS Code interface rather than embedding the official Web UI.

Startup uses the official runtime package resolver. Only a recognized legacy module conflict triggers one bounded backup-and-repair attempt; ordinary profile packages are no longer moved on every startup or installation.
```

**依据 2 · 源码核查**：[src/runtime/module-fallback-recovery.ts:38-62](https://github.com/skymecode/deepseek-harness-for-vscode/blob/9a82e266cb8c857e906e629bd36e5531a3909cf1/src/runtime/module-fallback-recovery.ts#L38-L62)

模块备份条件及改名

<details>
<summary>查看原文（25行）</summary>

```text
  // Healthy launches do not create a lock or a backup directory.
  if ((await conflicts(modules, names)).length === 0) return []

  // This is exactly app-boot's <profiles/node_modules>.lock, not a parallel
  // extension-only lock. Never steal a lock based on its age.
  return await withFileLock(modules, async () => {
    if (!await ordinaryDirectory(profiles) || !await ordinaryDirectory(modules)) return []
    const candidates = await conflicts(modules, names)
    const moved: ModuleFallbackBackup[] = []
    let backupRoot: string | undefined
    for (const packageName of candidates) {
      const original = join(modules, packageName)
      // Recheck ownership/type while holding the official lock: another window
      // may already have healed the directory since the initial inspection.
      if (!await conflictEntry(modules, packageName)) continue
      backupRoot ??= await mkdtemp(join(canonicalHome, 'module-fallback-backup-'))
      const backup = join(backupRoot, packageName)
      await mkdir(dirname(backup), { recursive: true, mode: 0o700 })
      try { await rename(original, backup) }
      catch (error) {
        // A failed rename never authorizes deleting the source. Earlier moves
        // remain in their logged backups and a later launch can resume safely.
        throw new Error(`Cannot back up Harness module ${packageName} (${errorCode(error) ?? 'unknown error'}); existing files were preserved.`, { cause: error })
      }
      const entry = { packageName, original, backup }
```

</details>

#### 缺口

- 未核对真实发行包和迁移
  **影响**：不能确认原历史可读
  **进一步探讨**：备份合成历史并对照旧、新版本

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样安排有限试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先核对对应平台 VSIX 与内置宿主版本，用独立工作区与合成历史核对会话显示、运行时重载和撤除扩展。已有历史先备份，发生不兼容则保留旧数据环境。安装、模型和迁移耗时未测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-26](https://github.com/skymecode/deepseek-harness-for-vscode/blob/9a82e266cb8c857e906e629bd36e5531a3909cf1/README.md#L7-L26)

发行和历史注意

<details>
<summary>查看原文（20行）</summary>

```text
> This is the community-maintained **0.6.1 codebase with unreleased fixes**. Current source pins the official `@deepseek-ai/dsh@0.2.1-rc.3` package (Typert Remote protocol). The published 0.6.1 assets still contain `0.2.1-alpha.1`; DeepSeek Harness remains a Developer Preview.

Pending updates fix duplicate user prompts appearing after their answers when editor context is attached, preserve message order during streaming and rapid submissions, and support the new external-task entries in the native subagent catalog. See the [changelog](CHANGELOG.md).

> **Runtime upgrade:** Harness now uses session format V4. Supported older logs are migrated on resume into a new generation while their original files are preserved. Old runtimes cannot read the new V4 generation; back up the shared history home (default `~/.dsh`) and the private `~/.dsh/vscode/harness-home` before upgrading, and do not downgrade an active profile. Third-party plugins using the removed `ctx.agent` or runtime `Inbox` APIs need their own compatibility updates. The extension keeps its native VS Code interface rather than embedding the official Web UI.

Startup uses the official runtime package resolver. Only a recognized legacy module conflict triggers one bounded backup-and-repair attempt; ordinary profile packages are no longer moved on every startup or installation.

## 0.6.1 release update

This update connects the DSH 0.2.1 services and trims unused runtime resources:

- **Background jobs:** view progress, expand live output, and confirm cancellation from Context → Jobs. Output resumes after reconnects; collapsing cancels observation while live updates retain focus and scroll position.
- **Session management:** native pins, workspace ordering, archive/restore, and activity details before “Stop and archive.” Search includes both active and archived conversations.
- **Schedules:** reminder cards appear in Context → Schedules when the current Profile enables Schedule; delete tasks and browse delivery history from the workbench, while creation remains a native DSH tool.
- **Marketplace recovery:** source failures are visible, successful results stay cached for the current extension session, and reopening retries failed loads. Three built-in recipes are no longer reported as the entire GitHub catalog.
- **Display and compatibility fixes:** completed reasoning shows at least `1s`, cross-platform file links are more reliable, and a native declaration keeps legacy `code` sessions usable.
- **Smaller packages:** unused LibreOfficeKit, official Web document preview and experimental voice payloads are excluded. The local macOS arm64 VSIX is about **94 MiB (98.58 MB)**, down from about 196 MiB before trimming; other platform sizes vary.

Download the VSIX from the [v0.6.1 release](https://github.com/skymecode/deepseek-harness-for-vscode/releases/tag/v0.6.1) and reload VS Code after installation. This release is not automatically published to Marketplace. Release notes for 0.6.1 and 0.6.0 are available in Chinese in the [changelog](CHANGELOG.md).
```

</details>

**依据 2 · 源码核查**：[src/extension.ts:119-136](https://github.com/skymecode/deepseek-harness-for-vscode/blob/9a82e266cb8c857e906e629bd36e5531a3909cf1/src/extension.ts#L119-L136)

重载和导入命令

<details>
<summary>查看原文（18行）</summary>

```text
    vscode.commands.registerCommand('deepseekHarness.openChat', focusWorkbench),
    vscode.commands.registerCommand('deepseekHarness.openChatWindow', () => provider.openPanel()),
    vscode.commands.registerCommand('deepseekHarness.reloadRuntime', () => provider.refresh()),
    vscode.commands.registerCommand('deepseekHarness.setApiKey', setApiKey),
    vscode.commands.registerCommand('deepseekHarness.clearApiKey', async () => {
      const clear = vscode.l10n.t('Clear')
      const answer = await vscode.window.showWarningMessage(
        vscode.l10n.t('Clear the DeepSeek API Key from the local Harness credential store?'),
        { modal: true },
        clear,
      )
      if (answer !== clear) return
      if (connectionSettings.connected) await connectionSettings.clearOfficialApiKey()
      await credentials.clearApiKey()
    }),
    vscode.commands.registerCommand('deepseekHarness.showLogs', () => output.show(true)),
    vscode.commands.registerCommand('deepseekHarness.testSystemNotification', () => notifications.test()),
    vscode.commands.registerCommand('deepseekHarness.importSession', () => sessionImport.runInteractive()),
```

</details>

#### 缺口

- 未运行迁移
  **影响**：恢复成本未知
  **进一步探讨**：按数据版本做备份及还原练习

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 版本提示能否减少错误降级？

**研究主题**：新假设与验证

#### 完整回答

对照当前说明与在恢复旧会话时显示已发 VSIX、运行时和数据版本的组合，观察用户错误降级与恢复耗时。若提示不能减少错误或妨碍正常恢复，则否定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-13](https://github.com/skymecode/deepseek-harness-for-vscode/blob/9a82e266cb8c857e906e629bd36e5531a3909cf1/README.md#L7-L13)

存在源码、包与数据版本差异

```text
> This is the community-maintained **0.6.1 codebase with unreleased fixes**. Current source pins the official `@deepseek-ai/dsh@0.2.1-rc.3` package (Typert Remote protocol). The published 0.6.1 assets still contain `0.2.1-alpha.1`; DeepSeek Harness remains a Developer Preview.

Pending updates fix duplicate user prompts appearing after their answers when editor context is attached, preserve message order during streaming and rapid submissions, and support the new external-task entries in the native subagent catalog. See the [changelog](CHANGELOG.md).

> **Runtime upgrade:** Harness now uses session format V4. Supported older logs are migrated on resume into a new generation while their original files are preserved. Old runtimes cannot read the new V4 generation; back up the shared history home (default `~/.dsh`) and the private `~/.dsh/vscode/harness-home` before upgrading, and do not downgrade an active profile. Third-party plugins using the removed `ctx.agent` or runtime `Inbox` APIs need their own compatibility updates. The extension keeps its native VS Code interface rather than embedding the official Web UI.

Startup uses the official runtime package resolver. Only a recognized legacy module conflict triggers one bounded backup-and-repair attempt; ordinary profile packages are no longer moved on every startup or installation.
```

**依据 2 · 源码核查**：[src/extension.ts:119-136](https://github.com/skymecode/deepseek-harness-for-vscode/blob/9a82e266cb8c857e906e629bd36e5531a3909cf1/src/extension.ts#L119-L136)

恢复入口

<details>
<summary>查看原文（18行）</summary>

```text
    vscode.commands.registerCommand('deepseekHarness.openChat', focusWorkbench),
    vscode.commands.registerCommand('deepseekHarness.openChatWindow', () => provider.openPanel()),
    vscode.commands.registerCommand('deepseekHarness.reloadRuntime', () => provider.refresh()),
    vscode.commands.registerCommand('deepseekHarness.setApiKey', setApiKey),
    vscode.commands.registerCommand('deepseekHarness.clearApiKey', async () => {
      const clear = vscode.l10n.t('Clear')
      const answer = await vscode.window.showWarningMessage(
        vscode.l10n.t('Clear the DeepSeek API Key from the local Harness credential store?'),
        { modal: true },
        clear,
      )
      if (answer !== clear) return
      if (connectionSettings.connected) await connectionSettings.clearOfficialApiKey()
      await credentials.clearApiKey()
    }),
    vscode.commands.registerCommand('deepseekHarness.showLogs', () => output.show(true)),
    vscode.commands.registerCommand('deepseekHarness.testSystemNotification', () => notifications.test()),
    vscode.commands.registerCommand('deepseekHarness.importSession', () => sessionImport.runInteractive()),
```

</details>

#### 缺口

- 未做对照
  **影响**：设计价值未知
  **进一步探讨**：用合成 V4 历史做隔离实验

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
