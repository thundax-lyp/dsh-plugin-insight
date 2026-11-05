# DSH Codex Desktop

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[7d027e2](https://github.com/MichengAI/dsh-codex-desktop/tree/7d027e2779e50bd15ef98b99819201d2419da285)

<!-- BEGIN META -->
[![GitHub ★ 127](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=127&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-codex-desktop)
<!-- END META -->

> **功能**：以 Electron 启动本地 DSH，在独立桌面窗口接入工作台和预置插件。

> **亮点**：[Q01](#research-q01) 将本地宿主、桌面视图和首启插件准备接到同一入口。

> **主要限制**：[Q02](#research-q02) 渲染层设置与插件运行权限需分别验证，重启条件也需要按实际包状态检查。

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
  - [Q01 · 桌面客户端怎样承载 DSH？](#detail-section-11)
  - [Q02 · 桌面隔离和插件应用有什么边界？](#detail-section-12)
  - [Q03 · 现有 CLI 用户如何试用？](#detail-section-13)
  - [Q04 · 如何降低初启迁移后的配置误判？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在桌面工作台使用 DSH 会话与插件的开发者。

通过 CLI 启动 DSH Web 并分别安装或管理所需插件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 桌面窗口 | 展示本地宿主工作台 | 依赖制品与兼容平台 |
| 宿主进程 | 本地启动和重载 | 需检查数据及包状态 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配平台的制品 | 必需 | 提供 Electron、Node 和 DSH | 沿用原 CLI |
| 测试用户与备份 | 独立验证需要 | 核对首启写入 | 暂缓使用真实数据 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核对制品和备份 | 记录原 profile |
| 验证 | 首启、重载与惰性插件试验 | 读回状态 |
| 退出 | 退出进程和检查原数据 | 必要时恢复备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本机进程资源未知 | 准备备份与制品 | 按平台核查 |
| 持续 | 插件与更新成本未知 | 监测宿主与桌面版本 | 需实测 |
| 恢复 | 重装成本未知 | 核对 profile 与备份 | 迁移演练 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 桌面入口 | 进程和视图接线 | 制品兼容 |
| 插件操作 | 重启判断条件 | 异常恢复 |

> **思考**：[Q02](#research-q02) 渲染层设置与插件运行权限需分别验证，重启条件也需要按实际包状态检查。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将本地宿主、桌面视图和首启插件准备接到同一入口。

[Q02](#research-q02) 分开验证窗口 IPC 与宿主插件。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 渲染层设置与插件运行权限需分别验证，重启条件也需要按实际包状态检查。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 隔离测试首次启动和迁移。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码及作者文档，未运行制品。

- 已检查：作者 README、包清单、源码路径 README.md、src/desktop-bridge-migration.ts、src/desktop-host.ts、src/dsh-process.ts、src/main.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：独立桌面客户端代表源码和固定文档。
- 下一步：验证首启、退出、配置迁移和包失败。

**分析版本**

- **仓库**：[MichengAI/dsh-codex-desktop](https://github.com/MichengAI/dsh-codex-desktop)
- **版本号**：1.0.92（[固定提交 7d027e2](https://github.com/MichengAI/dsh-codex-desktop/tree/7d027e2779e50bd15ef98b99819201d2419da285)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 迁移结果与复原入口可改善部分失败后的辨识。

验证首启、退出、配置迁移和包失败。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 665 | — | — | 11633 |
| .mts | source | 13 | 1273 | 1126 | 53 | — |
| .ts | source | 50 | 8700 | 7803 | 286 | — |
| .mjs | source | 2 | 130 | 116 | 2 | — |
| .cjs | source | 2 | 42 | 41 | 2 | — |
| .cts | source | 4 | 318 | 287 | 6 | — |
| .ts | test | 66 | 8113 | 7529 | 80 | — |
| .mjs | example | 2 | 80 | 71 | 4 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/MichengAI/dsh-codex-desktop/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：独立桌面启动和插件管理有哪些边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌面客户端怎样承载 DSH？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

希望在一个图形工作台访问会话和插件的用户，由 Electron 启动打包的本地 DSH，再在 WebContentsView 展示宿主页。其新增价值是本地进程与桌面窗口的管理，以及预置若干独立社区插件，具体会话能力仍由宿主与对应插件提供。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh-process.ts:45-60](https://github.com/MichengAI/dsh-codex-desktop/blob/7d027e2779e50bd15ef98b99819201d2419da285/src/dsh-process.ts#L45-L60)

经内置 Node 启动引导脚本及宿主入口

<details>
<summary>查看原文（16行）</summary>

```text
}

/** 启动 DSH Web，并在收到本机就绪地址后返回。 */
export function startDsh(options: StartDshOptions): Promise<DshServer> {
  const launchArgs = options.desktopBridgePatch === undefined
    ? [...DSH_WEB_LAUNCH_ARGS]
    : ['web', '--patch', options.desktopBridgePatch, ...DSH_WEB_LAUNCH_ARGS.slice(1)]
  const child = spawn(options.nodeExecutable, [options.bootstrapPath, options.runtime.entry, ...launchArgs], {
    cwd: options.workingDirectory ?? options.runtime.workingDirectory ?? options.runtime.root,
    env: {
      ...process.env,
      ...options.environment,
      DSH_DESKTOP_HOST: options.desktopBridgePatch === undefined ? undefined : '1',
      ...(options.pathPrefix === undefined ? {} : {
        PATH: prependPath(options.environment?.PATH ?? process.env.PATH, options.pathPrefix),
      }),
```

</details>

**依据 2 · 源码核查**：[src/main.ts:924-947](https://github.com/MichengAI/dsh-codex-desktop/blob/7d027e2779e50bd15ef98b99819201d2419da285/src/main.ts#L924-L947)

窗口壳和 DSH 视图分设

<details>
<summary>查看原文（24行）</summary>

```text
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: resolvePreload('shell-preload.cjs'),
      sandbox: true,
    },
  })
  const view = new WebContentsView({ webPreferences: {
    contextIsolation: true,
    nodeIntegration: false,
    preload: resolvePreload('dsh-view-preload.cjs'),
    additionalArguments: nativeBackdropEnabled ? ['--dsh-native-backdrop'] : [],
    sandbox: true,
  } })
  if (nativeBackdropEnabled) view.setBackgroundColor('#00000000')
  const recovery = new WebContentsView({ webPreferences: {
    contextIsolation: true,
    nodeIntegration: false,
    preload: resolvePreload('recovery-preload.cjs'),
    sandbox: true,
  } })
  dshView = view
  recoveryView = recovery
  window.contentView.addChildView(view)
```

</details>

**依据 3 · 作者声明**：[README.md:127-149](https://github.com/MichengAI/dsh-codex-desktop/blob/7d027e2779e50bd15ef98b99819201d2419da285/README.md#L127-L149)

作者列出首启预置和 bridge 注入

<details>
<summary>查看原文（23行）</summary>

```text
## Included on first launch

The installer ships with the local runtime required to start DSH. On first launch, it prepares the desktop-facing community plugins in the Web profile:

| Included capability | Package |
| --- | --- |
| Codex-style workspace UI | [`@michengai/dsh-codex-ui`](https://github.com/MichengAI/dsh-codex-ui) |
| Native desktop pet and conversation notifications | [`@michengai/dsh-codex-pet`](https://github.com/MichengAI/dsh-codex-pet) |
| Expert preset management | [`@michengai/dsh-agency-agents`](https://github.com/MichengAI/dsh-agency-agents) |
| Skill management | [`@michengai/dsh-skills-manager`](https://github.com/MichengAI/dsh-skills-manager) |
| Archive management | [`@michengai/dsh-archive-manager`](https://github.com/MichengAI/dsh-archive-manager) |
| IM assistant | [`@michengai/dsh-im-connect`](https://github.com/MichengAI/dsh-im-connect) |
| Scheduled automation | [`@michengai/dsh-automation`](https://github.com/MichengAI/dsh-automation) |
| Extensible workspace sidebar | [`dsh-better-sidebar`](https://github.com/omdsh-dev/DSH-better-sidebar) |
| One-off read-only side questions | [`@michengai/dsh-btw`](https://github.com/MichengAI/dsh-btw) |
| Code simplification scoped to Git changes | [`@michengai/dsh-simplify`](https://github.com/MichengAI/dsh-simplify) |
| Retry, diagnose, and verify after failures | [`@michengai/dsh-pua`](https://github.com/MichengAI/dsh-pua) |
| Independent Agent code review | [`@michengai/dsh-code-review`](https://github.com/MichengAI/dsh-code-review) |
| Plugin market | [`dshmarket`](https://www.npmjs.com/package/dshmarket) |

You can later manage additional plugins from the plugin market. The desktop application keeps its own runtime separate from profile-installed community plugins so plugin changes do not overwrite the application runtime.

The desktop bridge ships with the app and is injected only when Desktop starts DSH; it does not need to be installed in the shared Web profile. Running `dsh web` manually uses Web's own plugin management path. Desktop migrates and backs up bridge configuration left by older versions on startup.
```

</details>

#### 缺口

- 没有启动固定制品
  **影响**：实际插件装载和桌面适配未知
  **进一步探讨**：在独立数据副本检查首次启动及就绪

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 桌面隔离和插件应用有什么边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

宿主视图使用 sandbox、contextIsolation 与独立 preload。进程代码校验同源回环 URL，但这些边界没有证明社区插件权限被桌面窗口限制。插件包增删改会比较安装可解析性和命令前后状态后再决定重启，出现包写入但宿主加载失败时仍要读回实际运行版本。

#### 证据与依据

**依据 1 · 源码核查**：[src/main.ts:924-944](https://github.com/MichengAI/dsh-codex-desktop/blob/7d027e2779e50bd15ef98b99819201d2419da285/src/main.ts#L924-L944)

窗口隔离配置

<details>
<summary>查看原文（21行）</summary>

```text
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: resolvePreload('shell-preload.cjs'),
      sandbox: true,
    },
  })
  const view = new WebContentsView({ webPreferences: {
    contextIsolation: true,
    nodeIntegration: false,
    preload: resolvePreload('dsh-view-preload.cjs'),
    additionalArguments: nativeBackdropEnabled ? ['--dsh-native-backdrop'] : [],
    sandbox: true,
  } })
  if (nativeBackdropEnabled) view.setBackgroundColor('#00000000')
  const recovery = new WebContentsView({ webPreferences: {
    contextIsolation: true,
    nodeIntegration: false,
    preload: resolvePreload('recovery-preload.cjs'),
    sandbox: true,
  } })
```

</details>

**依据 2 · 源码核查**：[src/dsh-process.ts:198-206](https://github.com/MichengAI/dsh-codex-desktop/blob/7d027e2779e50bd15ef98b99819201d2419da285/src/dsh-process.ts#L198-L206)

回环同源检查

```text
export function isAuthenticatedBootstrapRedirect(url: string, response: Response): boolean {
  if (response.status < 300 || response.status > 399 || !response.headers.has('set-cookie')) return false
  const source = new URL(url)
  if (!source.searchParams.has('token')) return false
  const location = response.headers.get('location')
  if (location === null) return false
  const target = new URL(location, source)
  return target.origin === source.origin && target.protocol === 'http:' && target.hostname === '127.0.0.1'
}
```

**依据 3 · 源码核查**：[src/desktop-host.ts:70-84](https://github.com/MichengAI/dsh-codex-desktop/blob/7d027e2779e50bd15ef98b99819201d2419da285/src/desktop-host.ts#L70-L84)

插件变化与重启条件

<details>
<summary>查看原文（15行）</summary>

```text
/** add/update 必须能在 profile 里解析到包，才算安装成功并允许热重启。 */
export function shouldRecycleAfterPluginResult(
  args: readonly string[],
  isInstalled: (packageName: string) => boolean,
  beforeProfileState?: string,
  afterProfileState?: string,
): boolean {
  const action = pluginCommandAction(args)
  if (action === 'other') return false
  const names = pluginCommandPackageNames(args)
  if (action !== 'remove' && names.length > 0 && !names.every((name) => isInstalled(name))) return false
  if (beforeProfileState !== undefined && afterProfileState !== undefined) return beforeProfileState !== afterProfileState
  if (action === 'remove') return true
  if (names.length === 0) return true
  return true
```

</details>

#### 缺口

- 未验证 IPC 实际调用或失败后的插件状态
  **影响**：宿主权限与恢复一致性待测
  **进一步探讨**：用惰性包对照未变版本、安装失败及运行错误

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 现有 CLI 用户如何试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

选匹配架构的固定制品。作者称默认沿用用户的 DSH 数据，首启还可能迁移旧 bridge 配置，应先保留原 profile 的独立备份，再用测试用户核查首启、宿主重启和卸载后的会话及插件配置。资源费用和升级排障人时待验证，卸载应用后需单独处理保留的数据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:34-41](https://github.com/MichengAI/dsh-codex-desktop/blob/7d027e2779e50bd15ef98b99819201d2419da285/README.md#L34-L41)

默认用户数据说明

```text
| Linux x64 / ARM64 | `.AppImage` or Debian / Ubuntu `.deb` | Run the package matching your CPU architecture, or install the deb package, then launch the app. |

1. Download the package for your platform.
2. Install and open **DSH Codex Desktop**.
3. Wait for the built-in local DSH service to finish starting.
4. Create a task, select a model and permission mode, then work in your project.

The application keeps DSH data in your existing user profile (`%USERPROFILE%\.dsh` on Windows), so sessions and settings remain available after application upgrades.
```

**依据 2 · 作者声明**：[README.md:171-193](https://github.com/MichengAI/dsh-codex-desktop/blob/7d027e2779e50bd15ef98b99819201d2419da285/README.md#L171-L193)

更新机制、平台和卸载保留数据

<details>
<summary>查看原文（23行）</summary>

```text
## Updates and recovery

- **Desktop updates** for the installer are checked after startup by default and notify you when a new release is available. Settings → Updates can instead download releases automatically or switch to manual-only checks. Installation and restart always require an explicit action. A zip build only checks for a new version and does not download the installer; download the new zip from Releases, quit, and replace the current folder.
- **DSH reload** is available from the tray menu after changing plugins or profile configuration; it restarts the local DSH service without reinstalling the desktop application.
- **Plugin updates** remain in the DSH settings and plugin market. A failed plugin installation is not activated as a running bundle.
- **Startup recovery** removes stale community-plugin registrations that no longer have an installed package, then retries the local DSH startup.

## System requirements

| Item | Requirement |
| --- | --- |
| Operating system | Windows 10/11, macOS, or Linux |
| Architecture | Windows x64, macOS arm64/x64, or Linux x64/arm64 |
| Node.js | Not required for end users; bundled with the application |
| Network | Required only for the model providers, plugin downloads, and tools you choose to use |

## Privacy and security

- DSH configuration, sessions, and credentials remain in the current user's DSH directory. Uninstalling the desktop app does not delete them.
- The launcher accepts only validated `127.0.0.1` local HTTP addresses for its embedded window.
- External HTTP(S) links open in the system browser. File, JavaScript, and data URLs are blocked.
- Electron uses context isolation and sandboxing, with Node.js integration disabled for the DSH page.
- Your configured model providers and DSH tools may make their own network requests. Review their settings and privacy policies before use.
```

</details>

**依据 3 · 源码核查**：[src/desktop-bridge-migration.ts:36-46](https://github.com/MichengAI/dsh-codex-desktop/blob/7d027e2779e50bd15ef98b99819201d2419da285/src/desktop-bridge-migration.ts#L36-L46)

迁移前创建备份

<details>
<summary>查看原文（11行）</summary>

```text
  const backupDir = join(profileDir, '.desktop-bridge-backup')
  if (changes.length > 0) mkdirSync(backupDir, { recursive: true })
  for (const { file } of changes) {
    try {
      copyFileSync(join(profileDir, file), join(backupDir, file), constants.COPYFILE_EXCL)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
    }
  }
  for (const { file, content } of changes) writeTextFileAtomicSync(join(profileDir, file), content)
  // 旧版已迁移配置的用户仍可能留有文件，因此清理不能依赖 changes 是否为空。
```

</details>

#### 缺口

- 未运行安装、更新或卸载
  **影响**：不能确认各平台 profile 保留及恢复
  **进一步探讨**：以隔离测试用户比对目录和记录

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何降低初启迁移后的配置误判？

**研究主题**：新假设与验证

#### 完整回答

在现有旧 bridge 配置备份外，可试验向用户提供变更文件、写入结果及复原入口。对照当前备份模式注入第二个文件写入失败和重复启动，测状态误判及恢复耗时，若没有改善则撤回。

#### 证据与依据

**依据 1 · 源码核查**：[src/desktop-bridge-migration.ts:32-49](https://github.com/MichengAI/dsh-codex-desktop/blob/7d027e2779e50bd15ef98b99819201d2419da285/src/desktop-bridge-migration.ts#L32-L49)

按文件备份后写入

<details>
<summary>查看原文（18行）</summary>

```text
    const current = readFileSync(patchPath, 'utf8')
    const next = removeDesktopBridgePatch(current)
    if (next !== current) changes.push({ file: 'cordis.patch.yml', content: next })
  }
  const backupDir = join(profileDir, '.desktop-bridge-backup')
  if (changes.length > 0) mkdirSync(backupDir, { recursive: true })
  for (const { file } of changes) {
    try {
      copyFileSync(join(profileDir, file), join(backupDir, file), constants.COPYFILE_EXCL)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
    }
  }
  for (const { file, content } of changes) writeTextFileAtomicSync(join(profileDir, file), content)
  // 旧版已迁移配置的用户仍可能留有文件，因此清理不能依赖 changes 是否为空。
  const modulesDir = join(profileDir, 'node_modules')
  try {
    // 不进入用户链接到其他目录的整个 node_modules；包自身的链接由 rm 删除而不跟随。
```

</details>

**依据 2 · 作者声明**：[README.md:147-149](https://github.com/MichengAI/dsh-codex-desktop/blob/7d027e2779e50bd15ef98b99819201d2419da285/README.md#L147-L149)

作者说明旧配置迁移

```text
You can later manage additional plugins from the plugin market. The desktop application keeps its own runtime separate from profile-installed community plugins so plugin changes do not overwrite the application runtime.

The desktop bridge ships with the app and is injected only when Desktop starts DSH; it does not need to be installed in the shared Web profile. Running `dsh web` manually uses Web's own plugin management path. Desktop migrates and backs up bridge configuration left by older versions on startup.
```

#### 缺口

- 现有诊断覆盖程度未知
  **影响**：新增提示收益待测
  **进一步探讨**：核对现有恢复界面并做文件故障演练

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
