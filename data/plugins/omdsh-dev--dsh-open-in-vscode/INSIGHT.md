# dsh-open-in-vscode

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[8aed144](https://github.com/omdsh-dev/dsh-open-in-vscode/tree/8aed144abdc158a332aa73bce42fc217d962f751)

<!-- BEGIN META -->
[![GitHub ★ 53](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=53&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-open-in-vscode)
<!-- END META -->

> **功能**：在 DSH Web 工作区菜单添加入口，由 Host 启动配置的编辑器 CLI 打开目录。

> **亮点**：目录菜单、Windows默认发现与新旧菜单适配；编辑器/OS与Host Remote继承现成能力。见 [Q03](#research-q03)。

> **主要限制**：Host只验绝对path不验Workspace，strict非授权；执行位置在Host且opened非窗口可见，UI错误仅控制台。见 [Q02](#research-q02)。

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
  - [Q01 · 侧栏入口怎样真正启动编辑器，成功回执代表什么？](#detail-section-11)
  - [Q02 · strict协议是否限制只能打开真实工作区，失败和远程边界如何？](#detail-section-12)
  - [Q03 · 相对手动code多提供什么，兼容与维护负担在哪里？](#detail-section-13)
  - [Q04 · 谁适合试用，什么小方向值得先证伪？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：本机Web用户把当前工作区切到本机VS Code，手动终端code是基线。见 [Q01](#research-q01)。

复制目录到终端执行code；远程IDE连接另需已有工具。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 工作区菜单 | 传目录到Host | cwd缺失不显示 |
| Remote执行 | 配置编辑器启动 | 只验absolute |
| Windows发现 | 找默认Code.exe | exists非可信验证 |
| legacy适配 | rc.6菜单插行 | 同名/DOM依赖 |
| 错误处理 | ENOENT/abort拒绝 | UI仅控制台 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node ^22.19或>=24 | 必需 | Host进程启动 | 不在声明环境 |
| Host typert/protocol/registry | 必需 | Remote注册调用 | 无执行入口 |
| Client slots/remote/locale/workspaces | 必需 | 菜单与当前目录 | 局部UI不可用 |
| 编辑器CLI与可信PATH | 必需 | 启动本机编辑器 | ENOENT提示/配置 |
| Host桌面环境 | 可见GUI所需 | 打开窗口 | SSH/容器不可推定 |
| rc.6旧DOM或原生菜单槽 | 界面合同 | 挂菜单行 | 翻译/同名/结构失配可不显示 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核Host机器/CLI/测试目录 | 手动code能正常用 |
| 点击 | 关菜单→Remote传cwd | 单组件重复保护 |
| 执行 | Host检查absolute并spawn | opened只启动接受 |
| 核验 | 用户看正确窗口/目录 | 无窗口查日志回手动 |
| 退出 | 卸菜单/Remote | 已开编辑器自行关闭 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 编辑器许可/资源按环境未知 | PATH/Host位置核验 | 无新增模型调用 |
| 持续使用 | 进程CPU/内存未知 | 跟菜单/Remote/OS兼容 | 非零总成本 |
| 失败恢复 | 重复进程资源未知 | 看日志/手动CLI | 不反复点击 |
| 退出 | 编辑器仍运行 | 用户关窗口 | 不回滚编辑器文件 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 菜单入口 | 原生/旧版适配 | 全Host版本显示 |
| CLI发现 | Windows标准候选 | 正确可信可执行性 |
| 进程启动 | 无shell参数spawn | 目录加载/窗口可见 |
| 路径边界 | 拒相对路径 | 不等Workspace授权 |
| 总收益 | 减手工目录搬运 | 实际切换效率/维护 |

> **思考**：Host只验绝对path不验Workspace，strict非授权；执行位置在Host且opened非窗口可见，UI错误仅控制台。见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：目录菜单、Windows默认发现与新旧菜单适配；编辑器/OS与Host Remote继承现成能力。见 [Q03](#research-q03)。

共享wire合同与原生槽优先可借鉴；形状校验不替代Workspace身份，spawn不等可见。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

Host只验绝对path不验Workspace，strict非授权；执行位置在Host且opened非窗口可见，UI错误仅控制台。见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅本机Host/编辑器先试一个目录，核窗口与错误；远程或无窗口回手动CLI。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码与发行关键spawn链已核；未启动编辑器/Host或验证跨平台。

- 已检查：作者 README、包清单、源码路径 lib/index.js、package.json、src/client/index.ts、src/client/legacy-menu.tsx、src/client/row.tsx、src/contract.ts、src/index.ts、src/resolve.ts、src/runtime.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核Host配置/manifest/Remote/spawn/Windows解析、Client原生与legacy菜单/错误/清理、发行spawn关键链；未全审bundled依赖、Host授权或编辑器扩展，未运行目标。
- 下一步：五条件与手动code对照错目录/无窗口误判/恢复；未执行。

**分析版本**

- **仓库**：[omdsh-dev/dsh-open-in-vscode](https://github.com/omdsh-dev/dsh-open-in-vscode)
- **版本号**：0.1.6（[固定提交 8aed144](https://github.com/omdsh-dev/dsh-open-in-vscode/tree/8aed144abdc158a332aa73bce42fc217d962f751)）
- **版本日期**：2026-08-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

复用工作区注册表解析workspaceId，并区分启动与可见/远程限制；五条件对照，已有Host服务足够则组合。见 [Q04](#research-q04)。

五条件与手动code对照错目录/无窗口误判/恢复；未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 187 | — | — | 1401 |
| .mjs | source | 1 | 62 | 46 | 10 | — |
| .js | source | 4 | 30417 | 29714 | 1057 | — |
| .ts | source | 12 | 620 | 394 | 183 | — |
| .tsx | source | 2 | 238 | 175 | 41 | — |
| .ts | test | 4 | 240 | 201 | 22 | — |
| .tsx | test | 2 | 224 | 194 | 11 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/omdsh-dev/dsh-open-in-vscode/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：工作区用户手势到Host进程启动之间怎样约束目录、命令与失败？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 侧栏入口怎样真正启动编辑器，成功回执代表什么？

**研究主题**：场景与需求、功能与机制

#### 完整回答

它面向在DSH Web对话与VS Code间切换的开发者，把当前工作区目录直接交给Host机器的编辑器CLI。基线是手工复制目录再执行code，合格结果是正确机器上的正确目录被打开；不是模型自动编辑能力，也不是浏览器本机的通用远程IDE。

Client挂载openInVscode Remote并经反射service store取得调用面，向sidebar.workspaces.row-menu注入菜单；点击先关闭菜单再open(cwd)，本次组件用activated防重复。Host注册共享strict Typert manifest，runtime先拒相对路径，再resolve编辑器命令并spawn([...args,path])，未启shell，detached/stdio ignore；spawn事件到来就unref并返回opened:true。这个回执仅证明进程启动被接受，不等窗口可见、目录已加载或编辑器后续无错。

默认code在Windows优先查PATH导出的Code.exe候选，再查标准用户/系统安装位置；自定义命令和其他平台原样交spawn解析。原生菜单槽不存在时有rc.6兼容DOM adapter：按工作区按钮aria与唯一标题匹配，再识别含重命名/删除项的菜单，用嵌套React root插行；槽声明出现即拆该adapter。发行lib/index.js也核到相同spawn/absolute/manifest路径。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:44-74](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/src/client/index.ts#L44-L74)

Remote挂载到原生菜单。

<details>
<summary>查看原文（31行）</summary>

```text
  let openInVscode: OpenInVscodeNamespaceFace | undefined
  ctx.effect(async () => {
    const dispose = await ctx.remote.$mount(OPEN_IN_VSCODE_REMOTE)
    openInVscode = (ctx.reflect as unknown as { get(name: string): unknown })
      .get('remote.openInVscode') as OpenInVscodeNamespaceFace | undefined
    if (openInVscode === undefined) {
      throw new Error('dsh-open-in-vscode: the openInVscode Remote namespace did not mount')
    }
    return () => {
      openInVscode = undefined
      void dispose()
    }
  }, 'dsh-open-in-vscode: remote')

  const open = async (path: string): Promise<void> => {
    if (openInVscode === undefined) {
      throw new Error('dsh-open-in-vscode: the openInVscode Remote is not mounted')
    }
    const result = await openInVscode.open(path)
    if (!result.ok) {
      throw new Error(`open-in-vscode: ${result.error.code}: ${result.error.message}`)
    }
  }

  ctx.slots.inject('sidebar.workspaces.row-menu', () => ctx.slots.register({
    name: 'sidebar.workspaces.row-menu',
    locale: NS,
    inject: (): OpenInVscodeInjected => ({ open }),
  }, OpenInVscodeRow))

  // The latest public npm build (0.1.0-rc.6) predates the Workspace row-menu
```

</details>

**依据 2 · 源码核查**：[src/client/row.tsx:64-90](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/src/client/row.tsx#L64-L90)

关闭菜单与组件重复保护。

<details>
<summary>查看原文（27行）</summary>

```text
  const activated = useRef(false)
  if (cwd === undefined) return null
  const launch = (): void => {
    if (activated.current) return
    activated.current = true
    // The menu interaction completes with the click; the launch settles async.
    onClose()
    open(cwd).catch((error: unknown) => {
      console.error('[dsh-open-in-vscode] open failed:', error)
    })
  }
  return (
    <button
      type="button"
      role="menuitem"
      className="dsh-open-in-vscode-row"
      aria-label={fmt(t('menu.openInVscode.aria'), { name: label })}
      onClick={launch}
      onPointerDown={(event) => {
        if (eagerPointerActivation && event.button === 0) launch()
      }}
    >
      <span className="dsh-open-in-vscode-icon"><IconCodeOutline16 /></span>
      <span className="dsh-open-in-vscode-label">{t('menu.openInVscode')}</span>
    </button>
  )
}
```

</details>

**依据 3 · 源码核查**：[src/index.ts:46-56](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/src/index.ts#L46-L56)

Host服务与严格manifest。

<details>
<summary>查看原文（11行）</summary>

```text
 */
export function apply(ctx: Context, config?: Config): void {
  const resolved: ResolvedConfig = Config(config ?? {})
  new OpenInVscodeRuntime(ctx, resolved)
  // Strict endpoint registration: the gateway resolves openInVscode/open
  // from this manifest, independent of decorator marker state.
  ctx.effect(() => {
    const dispose = ctx.typert.register(TYPERT_MANIFEST)
    return () => { void dispose() }
  }, 'dsh-open-in-vscode: typert manifest')
}
```

</details>

**依据 4 · 源码核查**：[src/runtime.ts:25-59](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/src/runtime.ts#L25-L59)

真实spawn和spawn回执。

<details>
<summary>查看原文（35行）</summary>

```text
export function launchEditor(
  command: string,
  args: readonly string[],
  path: string,
  signal?: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted === true) {
      reject(new Error('open-in-vscode: the open request was aborted'))
      return
    }
    const executable = resolveEditorCommand(command)
    const child = spawn(executable, [...args, path], {
      detached: true,
      stdio: 'ignore',
      // `code` resolves to the Electron GUI on Windows. Hiding the spawned
      // process also hides its first window, leaving a live VS Code process
      // with no visible window.
      windowsHide: false,
    })
    const abort = (): void => { child.kill() }
    signal?.addEventListener('abort', abort, { once: true })
    child.once('error', (error: NodeJS.ErrnoException) => {
      signal?.removeEventListener('abort', abort)
      const hint = error.code === 'ENOENT'
        ? process.platform === 'win32' && command.toLowerCase() === 'code'
          ? '; dsh-open-in-vscode@0.1.5 could not find VS Code on PATH or in its standard per-user/system install locations'
          : `; the "${command}" executable is not on PATH — install the editor CLI or configure the plugin "command"`
        : ''
      reject(new Error(`open-in-vscode: failed to launch "${command}": ${error.message}${hint}`))
    })
    child.once('spawn', () => {
      signal?.removeEventListener('abort', abort)
      child.unref()
      resolve()
```

</details>

**依据 5 · 源码核查**：[src/runtime.ts:84-92](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/src/runtime.ts#L84-L92)

absolute与opened。

```text
  @Remote
  async open(path: string, signal?: AbortSignal): Promise<{ opened: true }> {
    if (!isAbsolute(path)) {
      throw new Error(`open-in-vscode: refusing a relative path "${path}"`)
    }
    await launchEditor(this.config.command, this.config.args, path, signal)
    return { opened: true }
  }
}
```

**依据 6 · 源码核查**：[src/resolve.ts:12-54](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/src/resolve.ts#L12-L54)

Windows查找和显式命令。

<details>
<summary>查看原文（43行）</summary>

```text
export function candidateWindowsVsCodePaths(env: NodeJS.ProcessEnv = process.env): string[] {
  const candidates: string[] = []
  for (const raw of pathValue(env).split(';')) {
    const entry = raw.trim().replace(/^"|"$/g, '')
    if (entry === '') continue
    candidates.push(win32.join(entry, 'Code.exe'))
    if (win32.basename(entry).toLowerCase() === 'bin') {
      candidates.push(win32.resolve(entry, '..', 'Code.exe'))
    }
  }

  const roots = [
    env.LOCALAPPDATA === undefined ? undefined : win32.join(env.LOCALAPPDATA, 'Programs'),
    env.ProgramFiles ?? 'C:\\Program Files',
    env['ProgramFiles(x86)'],
  ]
  for (const root of roots) {
    if (root !== undefined && root !== '') {
      candidates.push(win32.join(root, 'Microsoft VS Code', 'Code.exe'))
    }
  }

  const seen = new Set<string>()
  return candidates.filter((candidate) => {
    const key = candidate.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/**
 * Resolve only the default `code` command on Windows. Explicit editor
 * commands remain untouched so deployment configuration stays authoritative.
 */
export function resolveEditorCommand(
  command: string,
  platform: NodeJS.Platform = process.platform,
  env: NodeJS.ProcessEnv = process.env,
  exists: Exists = existsSync,
): string {
  if (platform !== 'win32' || command.toLowerCase() !== 'code') return command
  return candidateWindowsVsCodePaths(env).find(exists) ?? command
```

</details>

**依据 7 · 源码核查**：[src/client/legacy-menu.tsx:48-65](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/src/client/legacy-menu.tsx#L48-L65)

唯一工作区和菜单识别。

<details>
<summary>查看原文（18行）</summary>

```text
  button: HTMLButtonElement,
  workspaces: WorkspaceListSource,
  t: WorkspaceTranslate,
): WorkspaceItem | undefined {
  const aria = button.getAttribute('aria-label')
  if (aria === null) return undefined
  const matches = workspaces.getSnapshot().items.filter(item => (
    t('actions.workspace.aria', { name: item.title }) === aria
  ))
  return matches.length === 1 ? matches[0] : undefined
}

function isWorkspaceMenu(menu: HTMLElement, t: WorkspaceTranslate): boolean {
  const labels = [...menu.querySelectorAll<HTMLElement>('[role="menuitem"]')]
    .map(item => item.textContent?.trim())
  return labels.includes(t('rename')) && labels.includes(t('delete.workspace'))
}

```

</details>

**依据 8 · 源码核查**：[src/client/index.ts:79-100](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/src/client/index.ts#L79-L100)

原生槽/兼容适配互斥。

<details>
<summary>查看原文（22行）</summary>

```text
    const reconcile = (): void => {
      const native = ctx.slots.spec('sidebar.workspaces.row-menu') !== undefined
      if (native) {
        disposeLegacy?.()
        disposeLegacy = undefined
      } else if (disposeLegacy === undefined) {
        disposeLegacy = installLegacyWorkspaceMenu({
          workspaces: ctx.workspaces.list,
          workspaceT: ctx.locale.bind('workspace'),
          rowT: ctx.locale.bind(NS),
          open,
        })
      }
    }
    const unsubscribe = ctx.slots.subscribe('sidebar.workspaces.row-menu', reconcile)
    reconcile()
    return () => {
      unsubscribe()
      disposeLegacy?.()
    }
  }, 'dsh-open-in-vscode: rc.6 workspace-menu compatibility')
}
```

</details>

**依据 9 · 源码核查**：[lib/index.js:911-960](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/lib/index.js#L911-L960)

实际发行入口执行。

<details>
<summary>查看原文（50行）</summary>

```text
function launchEditor(command, args, path, signal) {
  return new Promise((resolve2, reject) => {
    if (signal?.aborted === true) {
      reject(new Error("open-in-vscode: the open request was aborted"));
      return;
    }
    const executable = resolveEditorCommand(command);
    const child = spawn(executable, [...args, path], {
      detached: true,
      stdio: "ignore",
      // `code` resolves to the Electron GUI on Windows. Hiding the spawned
      // process also hides its first window, leaving a live VS Code process
      // with no visible window.
      windowsHide: false
    });
    const abort = () => {
      child.kill();
    };
    signal?.addEventListener("abort", abort, { once: true });
    child.once("error", (error51) => {
      signal?.removeEventListener("abort", abort);
      const hint = error51.code === "ENOENT" ? process.platform === "win32" && command.toLowerCase() === "code" ? "; dsh-open-in-vscode@0.1.5 could not find VS Code on PATH or in its standard per-user/system install locations" : `; the "${command}" executable is not on PATH \u2014 install the editor CLI or configure the plugin "command"` : "";
      reject(new Error(`open-in-vscode: failed to launch "${command}": ${error51.message}${hint}`));
    });
    child.once("spawn", () => {
      signal?.removeEventListener("abort", abort);
      child.unref();
      resolve2();
    });
  });
}
var _open_dec, _a, _init;
var OpenInVscodeRuntime = class extends (_a = TypertRemoteService, _open_dec = [Remote], _a) {
  /**
   * Register the service under the `openInVscode` key (the wire namespace).
   * @param ctx - owning cordis context.
   * @param config - resolved plugin configuration.
   */
  constructor(ctx, config2) {
    super(ctx, "openInVscode");
    this.config = config2;
    __runInitializers(_init, 5, this);
  }
  async open(path, signal) {
    if (!isAbsolute(path)) {
      throw new Error(`open-in-vscode: refusing a relative path "${path}"`);
    }
    await launchEditor(this.config.command, this.config.args, path, signal);
    return { opened: true };
  }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · strict协议是否限制只能打开真实工作区，失败和远程边界如何？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

strict只保证path非空字符串和返回对象形状，不等授权。正常UI从工作区传cwd，但Host open只检查isAbsolute，不核目录存在、是不是目录或是否属于用户已打开的Workspace；Remote可达者能提交其他绝对路径。访问者身份、Origin和调用授权由Host gateway承担，未固定运行核验，不能把“点击用户手势”当服务端已证明手势或workspace白名单。部署command/args可以配置任意可执行程序，属于受信部署配置，不能让不可信客户端改它。参数数组加不启shell减少shell拼接注入，但不保证编辑器打开目录没有自己的扩展/信任行为。

执行发生在Host，SSH/容器/无桌面Host可能启动错机器或不可见GUI；它不会建立VS Code Remote连接，也不把Host路径翻译成本机路径。子进程spawn后即解除abort监听并unref，停Host/卸插件不关闭已打开编辑器。只在启动前abort拒绝或启动途中kill，启动后不会等退出码，后续CLI失败也不能反馈为该RPC失败。

缺可执行文件返回ENOENT安装/配置提示；UI捕获open失败只console.error，菜单已关闭，用户可能只感知没反应。Windows默认选择只检查候选exists，未验证文件类型/可执行或可信来源；PATH与部署环境需可信。旧菜单adapter依赖翻译和DOM，同名标题不唯一时不加入口而不猜工作区；文案/菜单结构改变也可能失效。正常卸载移除legacy observer/listener/root和Remote贡献，但已启动进程留存是明确设计，不称完整动作回滚。

#### 证据与依据

**依据 1 · 源码核查**：[src/contract.ts:12-38](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/src/contract.ts#L12-L38)

path仅非空与strict字段。

<details>
<summary>查看原文（27行）</summary>

```text
export const pathSchema = z.string().min(1)

/** Wire codec: the open result — the editor launch was accepted. */
export const openResultSchema = z.object({ opened: z.literal(true) }).readonly()

/** The openInVscode Remote namespace's strict invocation descriptors. */
export const OPEN_IN_VSCODE_INVOCATIONS: readonly InvocationDescriptor[] = [
  {
    id: 'dsh-open-in-vscode#openInVscode/open',
    service: 'openInVscode',
    namespace: 'openInVscode',
    method: 'open',
    invocation: { kind: 'direct' },
    parameters: [
      {
        name: 'path',
        wire: 'path',
        source: 'json',
        codec: { mode: 'strict', typeSymbol: 'dsh-open-in-vscode#Path', schema: pathSchema },
      },
    ],
    cancellation: { parameter: 'signal' },
    result: {
      mode: 'strict',
      typeSymbol: 'dsh-open-in-vscode#OpenResult',
      schema: openResultSchema,
    },
```

</details>

**依据 2 · 源码核查**：[src/runtime.ts:25-59](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/src/runtime.ts#L25-L59)

detached、abort、仅等spawn。

<details>
<summary>查看原文（35行）</summary>

```text
export function launchEditor(
  command: string,
  args: readonly string[],
  path: string,
  signal?: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted === true) {
      reject(new Error('open-in-vscode: the open request was aborted'))
      return
    }
    const executable = resolveEditorCommand(command)
    const child = spawn(executable, [...args, path], {
      detached: true,
      stdio: 'ignore',
      // `code` resolves to the Electron GUI on Windows. Hiding the spawned
      // process also hides its first window, leaving a live VS Code process
      // with no visible window.
      windowsHide: false,
    })
    const abort = (): void => { child.kill() }
    signal?.addEventListener('abort', abort, { once: true })
    child.once('error', (error: NodeJS.ErrnoException) => {
      signal?.removeEventListener('abort', abort)
      const hint = error.code === 'ENOENT'
        ? process.platform === 'win32' && command.toLowerCase() === 'code'
          ? '; dsh-open-in-vscode@0.1.5 could not find VS Code on PATH or in its standard per-user/system install locations'
          : `; the "${command}" executable is not on PATH — install the editor CLI or configure the plugin "command"`
        : ''
      reject(new Error(`open-in-vscode: failed to launch "${command}": ${error.message}${hint}`))
    })
    child.once('spawn', () => {
      signal?.removeEventListener('abort', abort)
      child.unref()
      resolve()
```

</details>

**依据 3 · 源码核查**：[src/runtime.ts:84-92](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/src/runtime.ts#L84-L92)

Host仅absolute检查。

```text
  @Remote
  async open(path: string, signal?: AbortSignal): Promise<{ opened: true }> {
    if (!isAbsolute(path)) {
      throw new Error(`open-in-vscode: refusing a relative path "${path}"`)
    }
    await launchEditor(this.config.command, this.config.args, path, signal)
    return { opened: true }
  }
}
```

**依据 4 · 源码核查**：[src/client/row.tsx:66-74](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/src/client/row.tsx#L66-L74)

失败仅控制台。

```text
  const launch = (): void => {
    if (activated.current) return
    activated.current = true
    // The menu interaction completes with the click; the launch settles async.
    onClose()
    open(cwd).catch((error: unknown) => {
      console.error('[dsh-open-in-vscode] open failed:', error)
    })
  }
```

**依据 5 · 源码核查**：[src/resolve.ts:45-54](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/src/resolve.ts#L45-L54)

候选只exists判断。

<details>
<summary>查看原文（10行）</summary>

```text
 * commands remain untouched so deployment configuration stays authoritative.
 */
export function resolveEditorCommand(
  command: string,
  platform: NodeJS.Platform = process.platform,
  env: NodeJS.ProcessEnv = process.env,
  exists: Exists = existsSync,
): string {
  if (platform !== 'win32' || command.toLowerCase() !== 'code') return command
  return candidateWindowsVsCodePaths(env).find(exists) ?? command
```

</details>

**依据 6 · 源码核查**：[src/client/legacy-menu.tsx:48-65](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/src/client/legacy-menu.tsx#L48-L65)

同名不猜。

<details>
<summary>查看原文（18行）</summary>

```text
  button: HTMLButtonElement,
  workspaces: WorkspaceListSource,
  t: WorkspaceTranslate,
): WorkspaceItem | undefined {
  const aria = button.getAttribute('aria-label')
  if (aria === null) return undefined
  const matches = workspaces.getSnapshot().items.filter(item => (
    t('actions.workspace.aria', { name: item.title }) === aria
  ))
  return matches.length === 1 ? matches[0] : undefined
}

function isWorkspaceMenu(menu: HTMLElement, t: WorkspaceTranslate): boolean {
  const labels = [...menu.querySelectorAll<HTMLElement>('[role="menuitem"]')]
    .map(item => item.textContent?.trim())
  return labels.includes(t('rename')) && labels.includes(t('delete.workspace'))
}

```

</details>

**依据 7 · 源码核查**：[src/client/legacy-menu.tsx:115-143](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/src/client/legacy-menu.tsx#L115-L143)

observer/捕获点击与清理。

<details>
<summary>查看原文（29行）</summary>

```text
      />,
    )
  }

  const observer = new MutationObserver(() => {
    if (active?.menu !== undefined && !active.menu.isConnected) unmount()
    mountIntoOpenMenu()
  })
  observer.observe(document.body, { childList: true, subtree: true })

  const onClick = (event: MouseEvent): void => {
    if (!(event.target instanceof Element)) return
    const button = event.target.closest<HTMLButtonElement>('button[aria-label]')
    if (button === null) return
    const workspace = workspaceForButton(button, options.workspaces, options.workspaceT)
    if (workspace === undefined) return
    unmount()
    active = { workspace, anchor: button.parentElement ?? button }
    queueMicrotask(mountIntoOpenMenu)
  }
  document.addEventListener('click', onClick, true)

  return () => {
    document.removeEventListener('click', onClick, true)
    observer.disconnect()
    unmount()
    active = undefined
  }
}
```

</details>

**依据 8 · 源码核查**：[src/client/index.ts:44-58](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/src/client/index.ts#L44-L58)

Remote清理。

<details>
<summary>查看原文（15行）</summary>

```text
  let openInVscode: OpenInVscodeNamespaceFace | undefined
  ctx.effect(async () => {
    const dispose = await ctx.remote.$mount(OPEN_IN_VSCODE_REMOTE)
    openInVscode = (ctx.reflect as unknown as { get(name: string): unknown })
      .get('remote.openInVscode') as OpenInVscodeNamespaceFace | undefined
    if (openInVscode === undefined) {
      throw new Error('dsh-open-in-vscode: the openInVscode Remote namespace did not mount')
    }
    return () => {
      openInVscode = undefined
      void dispose()
    }
  }, 'dsh-open-in-vscode: remote')

  const open = async (path: string): Promise<void> => {
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对手动code多提供什么，兼容与维护负担在哪里？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

增量是把工作区目录搬运接成菜单行，复用Host Remote和原生槽，提供Windows默认CLI发现与旧版适配；不增加文件读写工具、模型调用或项目分析。操作本身仍由code/编辑器与OS完成，手工终端命令是直接低依赖替代。经济上没有改变计算供给、资源池化、计价或服务责任，只是既有本机操作入口缩短，不计潜在节时为经济创新。

0.1.6 MIT，Node ^22.19或>=24；Host typert与协议/注册表必需，Client slots/remote/locale/workspaces和React面需要Host提供。peer大多星号且安装层标optional，不代表运行可无这些服务；README声称rc.6或更新，具体新版本合同仍需实测，开发link依赖本地DSH目录不等每用户必须装源码树。编辑器CLI/PATH/桌面是实际前提。

首次要用可丢弃工作区核正确目录、Host位置与错误提示，必要时配置command/args；持续维护Host槽/Remote与旧DOM兼容，重复点击可能开多个编辑器进程。现金无额外模型服务，但编辑器/扩展许可、CPU/内存和人工排障仍按用户环境，费用未知不填零。失败可回终端手动code核PATH；停插件去掉菜单/Remote，已开窗口需用户自行关，配置与编辑器自行修改的文件不由插件回滚。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-7](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/package.json#L1-L7)

版本/许可/发行入口。

```text
{
  "name": "dsh-open-in-vscode",
  "description": "Open a workspace directory in VS Code from the web GUI: an Open in VSCode row in every workspace's overflow menu",
  "version": "0.1.6",
  "license": "MIT",
  "type": "module",
  "main": "lib/index.js",
```

**依据 2 · 源码核查**：[package.json:54-78](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/package.json#L54-L78)

Node、peer与optional。

<details>
<summary>查看原文（25行）</summary>

```text
  "engines": {
    "node": "^22.19 || >=24"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1-rc.1",
    "@deepseek-ai/dsh-typert-protocol": "*",
    "@deepseek-ai/dsh-typert-registry": "*",
    "@deepseek-ai/dsh-client-runtime": "*",
    "@deepseek-ai/dsh-client-ui-slots": "*",
    "@deepseek-ai/dsh-client-ui-workspace": "*",
    "@deepseek-ai/dsh-client-locale": "*",
    "@deepseek-ai/dsh-client-ui-primitives": "*",
    "react": "^18.2.0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/cordis": { "optional": true },
    "@deepseek-ai/dsh-typert-protocol": { "optional": true },
    "@deepseek-ai/dsh-typert-registry": { "optional": true },
    "@deepseek-ai/dsh-client-runtime": { "optional": true },
    "@deepseek-ai/dsh-client-ui-slots": { "optional": true },
    "@deepseek-ai/dsh-client-ui-workspace": { "optional": true },
    "@deepseek-ai/dsh-client-locale": { "optional": true },
    "@deepseek-ai/dsh-client-ui-primitives": { "optional": true },
    "react": { "optional": true }
  },
```

</details>

**依据 3 · 源码核查**：[src/index.ts:20-39](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/src/index.ts#L20-L39)

Host依赖与命令默认。

<details>
<summary>查看原文（20行）</summary>

```text
/** Services required before load: the Typert registry. */
export const inject = ['typert']

/** Deployment configuration: which editor CLI opens the directory. */
export interface Config {
  /** Executable that opens a directory, resolved through PATH. */
  command: string
  /** Extra arguments passed before the directory path. */
  args: string[]
}

/**
 * Configuration schema: deployment-varying choices stay tunable from
 * cordis.yml. The inferred schema type keeps the callable form accepting
 * partial input, so `Config({})` yields the defaults (what the Loader does
 * for cordis.yml compositions).
 */
export const Config = z.object({
  command: z.string().default('code'),
  args: z.array(z.string()).default([]),
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:20-21](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/src/client/index.ts#L20-L21)

Client真实服务。

```text
/** Required services: slots, the gateway Remote face, and locale. */
export const inject = ['slots', 'remote', 'locale', 'workspaces']
```

**依据 5 · 源码核查**：[src/client/index.ts:79-100](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/src/client/index.ts#L79-L100)

旧版维护范围。

<details>
<summary>查看原文（22行）</summary>

```text
    const reconcile = (): void => {
      const native = ctx.slots.spec('sidebar.workspaces.row-menu') !== undefined
      if (native) {
        disposeLegacy?.()
        disposeLegacy = undefined
      } else if (disposeLegacy === undefined) {
        disposeLegacy = installLegacyWorkspaceMenu({
          workspaces: ctx.workspaces.list,
          workspaceT: ctx.locale.bind('workspace'),
          rowT: ctx.locale.bind(NS),
          open,
        })
      }
    }
    const unsubscribe = ctx.slots.subscribe('sidebar.workspaces.row-menu', reconcile)
    reconcile()
    return () => {
      unsubscribe()
      disposeLegacy?.()
    }
  }, 'dsh-open-in-vscode: rc.6 workspace-menu compatibility')
}
```

</details>

#### 缺口

- 菜单省步骤是否提高真实工作效率、跨Host平台兼容及资源净成本未测。
  **影响**：不能承诺普遍比手动命令更好或免费无维护。
  **进一步探讨**：同项目比较目录错误/切换时间/失败恢复与手动code，固定Host/编辑器版本。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁适合试用，什么小方向值得先证伪？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可条件试用：本机DSH Web与本机VS Code的开发者先用可丢弃工作区点击一次，确认机器/目录、窗口可见和CLI报错，再加入日常流程。不要在远程容器Host上期待自动打开浏览器所在电脑；失败先看Host和浏览器日志，回终端手工code，不连续点击来试运气。

可验证方向是把参数从任意绝对path改成Host解析的workspaceId，并把“启动已接受”与“可见/远程不可用”提示分开；复用Host工作区注册表而不是新造进程管理器。依据是当前菜单身份在Client、Host只检查绝对路径。最小对照测真实/已删除工作区、非工作区绝对路径、远程Host、缺CLI和子进程立即退出，比较错开目录、无响应误判和人工定位时间。若Host已有用户手势/工作区约束的打开编辑器服务则直接组合；若用户本来固定终端且不需要入口，保留手动命令更简单。

#### 证据与依据

**依据 1 · 源码核查**：[src/runtime.ts:84-92](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/src/runtime.ts#L84-L92)

path到workspaceId方向依据。

```text
  @Remote
  async open(path: string, signal?: AbortSignal): Promise<{ opened: true }> {
    if (!isAbsolute(path)) {
      throw new Error(`open-in-vscode: refusing a relative path "${path}"`)
    }
    await launchEditor(this.config.command, this.config.args, path, signal)
    return { opened: true }
  }
}
```

**依据 2 · 源码核查**：[src/runtime.ts:25-59](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/src/runtime.ts#L25-L59)

接受启动与最终可见区分。

<details>
<summary>查看原文（35行）</summary>

```text
export function launchEditor(
  command: string,
  args: readonly string[],
  path: string,
  signal?: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted === true) {
      reject(new Error('open-in-vscode: the open request was aborted'))
      return
    }
    const executable = resolveEditorCommand(command)
    const child = spawn(executable, [...args, path], {
      detached: true,
      stdio: 'ignore',
      // `code` resolves to the Electron GUI on Windows. Hiding the spawned
      // process also hides its first window, leaving a live VS Code process
      // with no visible window.
      windowsHide: false,
    })
    const abort = (): void => { child.kill() }
    signal?.addEventListener('abort', abort, { once: true })
    child.once('error', (error: NodeJS.ErrnoException) => {
      signal?.removeEventListener('abort', abort)
      const hint = error.code === 'ENOENT'
        ? process.platform === 'win32' && command.toLowerCase() === 'code'
          ? '; dsh-open-in-vscode@0.1.5 could not find VS Code on PATH or in its standard per-user/system install locations'
          : `; the "${command}" executable is not on PATH — install the editor CLI or configure the plugin "command"`
        : ''
      reject(new Error(`open-in-vscode: failed to launch "${command}": ${error.message}${hint}`))
    })
    child.once('spawn', () => {
      signal?.removeEventListener('abort', abort)
      child.unref()
      resolve()
```

</details>

**依据 3 · 源码核查**：[src/client/row.tsx:66-74](https://github.com/omdsh-dev/dsh-open-in-vscode/blob/8aed144abdc158a332aa73bce42fc217d962f751/src/client/row.tsx#L66-L74)

错误呈现缺口。

```text
  const launch = (): void => {
    if (activated.current) return
    activated.current = true
    // The menu interaction completes with the click; the launch settles async.
    onClose()
    open(cwd).catch((error: unknown) => {
      console.error('[dsh-open-in-vscode] open failed:', error)
    })
  }
```

#### 缺口

- workspaceId与状态提示原型未实现/运行，Host现成编辑器服务未核。
  **影响**：属于候选改进，不能当当前权限或可见性保证。
  **进一步探讨**：先查固定Host已有能力，再做五条件与原菜单/手动终端对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
