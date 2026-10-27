# dsh-wsl-workspace

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[3f3338d](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/tree/3f3338d9e1a82578815074f87574ca2005977082)

<!-- BEGIN META -->
[![GitHub ★ 100](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=100&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace) [![npm 30d 2,765](https://img.shields.io/static/v1?label=npm+30d&message=2%2C765&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-wsl-workspace) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-wsl-workspace)
<!-- END META -->

> **实现功能**：在DSH界面添加WSL工作区，并接入Linux命令、文件、搜索和终端工具。

> **核心亮点**：相对手动wsl.exe包装，贡献在会话级工作区、工具提供者和预设的组合；宿主执行器与fs机制的继承须保留归属。见 [Q01](#research-q01)。

> **风险与缺陷**：完整工作区不能被理解成统一用户身份、统一沙箱或恰好一次执行；自动伪终端重跑尤其需要副作用核对。见 [Q03](#research-q03)。

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
  - [Q01 · Windows开发者为什么需要完整WSL执行世界？](#detail-section-11)
  - [Q02 · 会话、执行器与文件系统如何对齐？](#detail-section-12)
  - [Q03 · 完整会话是否意味着统一安全边界和恰好一次执行？](#detail-section-13)
  - [Q04 · 启动、日常开发和故障恢复的代价是什么？](#detail-section-14)
  - [Q05 · 哪些设计可借鉴，当前如何决定试用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Windows界面与WSL工程长期并用的人群有明确集成需求；是否优于直接Linux宿主取决于界面与工作流约束。见 [Q01](#research-q01)。

人工wsl.exe包装和将DSH直接运行于Linux；宿主机制按README的上游归属处理，未作竞品实测排序。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| WSL工作区入口 | 选择发行版与项目路径 | 本机Windows/WSL场景 |
| 预设变体 | 保留任务模式并切换执行世界 | 依赖宿主预设接口 |
| WSL bash/terminal | 命令与交互执行 | 自动重跑可能重复副作用 |
| 文件工具 | Linux项目读写 | Windows共享平面，身份不等同shell |
| run_code guard | 解释特定沙箱不可用 | 不提供WSL内新隔离 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Windows、WSL发行版与9P共享 | 目标场景必需 | 命令与文件桥接 | 工作区不可用 |
| Node>=24与兼容DSH | 必需 | 加载提供者与预设 | 超出声明范围需复核 |
| Linux项目工具与权限 | 项目操作必需 | 构建、测试和执行 | 插件不替代项目依赖 |
| 回环访问 | 管理接口必需 | 工作区配置 | 非回环请求被拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户安装后重启宿主 | WSL入口出现 |
| 2 | 选择发行版、路径与可选用户并检查 | 指向正确项目 |
| 3 | 创建会话，分别检查命令与文件身份 | 不假设两个平面同权 |
| 4 | 运行无外部副作用任务并检查恢复/禁用 | 重跑及部分状态可解释再扩大范围 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Windows/WSL与本地磁盘 | 配置发行版、目录、用户及宿主 | 配置时间和设备负担未知 |
| 持续使用 | 模型、Linux工具链和跨平面进程 | 维护项目依赖与版本兼容 | 同任务性能/成本未测 |
| 失败恢复 | 重启shell、作业和重试资源 | 核对部分副作用与身份差异 | 重跑不能视为事务回滚 |
| 升级退出 | 工作区记录与项目文件保留 | 核对预设、禁用及回退 | 未实际验收恢复耗时 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| WSL会话接入 | 预设和专用工具装配 | 全版本实际兼容 |
| Linux路径与文件操作 | shell参数和9P fs接缝 | 权限等价与所有符号链接情况 |
| 等待/恢复诊断 | 伪终端重跑与guard提示 | 副作用安全和总恢复时间 |

> **思考**：完整工作区不能被理解成统一用户身份、统一沙箱或恰好一次执行；自动伪终端重跑尤其需要副作用核对。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手动wsl.exe包装，贡献在会话级工作区、工具提供者和预设的组合；宿主执行器与fs机制的继承须保留归属。见 [Q01](#research-q01)。

相对手动wsl.exe包装，贡献在会话级工作区、工具提供者和预设的组合；宿主执行器与fs机制的继承须保留归属。见 [Q01](#research-q01)。

可组合执行世界和显式不支持提示比隐藏降级更可检查；移植成本主要来自宿主接口、9P语义与多平面状态同步。参见 [Q02](#research-q02) 与 [Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

完整工作区不能被理解成统一用户身份、统一沙箱或恰好一次执行；自动伪终端重跑尤其需要副作用核对。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议在临时发行版与非生产工程先试用，验收shell/fs身份、写入与恢复，不将作者兼容列表等同本轮通过。成功和停止判断见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

跨平面适配有源码支持；兼容矩阵为作者报告，统一隔离和端到端收益未独立验证；执行阶段账本是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/fs.ts、src/host/wsl-bash-tool.ts、src/host/wsl-run-code-guard.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交检查宿主入口、WSL shell规格、9P文件系统接缝、重跑路径和run_code guard；未逐项覆盖全部PTY/搜索/作业协议和真实Windows运行。
- 下一步：已检查源码；未执行目标代码、作者测试、Windows/WSL环境或真实宿主验收。

**分析版本**

- **仓库**：[dsh-wsl-workspace-maintainers/dsh-wsl-workspace](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace)
- **版本号**：0.7.11（[固定提交 3f3338d](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/tree/3f3338d9e1a82578815074f87574ca2005977082)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设为对潜在重跑建立执行阶段账本，减少含副作用命令的重复执行误判。临时标记命令的对照和否定条件见 [Q05](#research-q05)。

已检查源码；未执行目标代码、作者测试、Windows/WSL环境或真实宿主验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 31 | 5016 | — | — | 183811 |
| .mjs | source | 37 | 6634 | 4492 | 1782 | — |
| .js | source | 17 | 10216 | 6753 | 3554 | — |
| .mjs | test | 44 | 12814 | 8600 | 3480 | — |
| .tsx | source | 3 | 602 | 439 | 138 | — |
| .ts | source | 32 | 12602 | 7061 | 4895 | — |
| .ts | test | 26 | 6053 | 4194 | 1378 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 23](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=23&color=737b86&logo=github)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/issues?q=is%3Aissue+created%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z) [![近30天关闭 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=21&color=737b86&logo=github)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对WSL工作区的跨平面接线、贡献与身份/隔离/恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Windows开发者为什么需要完整WSL执行世界？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是项目与工具链在 WSL，而 DSH 界面运行于 Windows 的开发者。合格交付是同一会话的命令、读写与搜索都指向所选 Linux 项目，用户身份和文件权限边界可解释。相对手动在每条命令前包 wsl.exe，插件组合工作区选择、WSL模式变体、shell/fs/搜索适配；贡献在跨平面的系统接线。它大量继承宿主执行器、文件系统和预设机制，README 的 NOTICE 归属不能被当作全新实现。启动WSL终端或将宿主直接运行在Linux仍是更简单的替代，是否值得取决于是否需要Windows界面和原生工作区入口。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-7](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/3f3338d9e1a82578815074f87574ca2005977082/README.md#L7-L7)

作者定义整体WSL工作区目标。

```text
Add a WSL workspace from the DeepSeek Harness web GUI and run the whole agent session — bash commands and file reads/writes — inside a local WSL distribution with Linux paths. Nothing needs to be installed inside WSL. The session can reach both WSL and Windows at the same time: bash commands run inside the WSL distribution, while Windows files stay accessible via `/mnt/<drive>` (for example `/mnt/c/Users/...`).
```

**依据 2 · 作者声明**：[README.md:34-38](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/3f3338d9e1a82578815074f87574ca2005977082/README.md#L34-L38)

选择发行版、目录、用户与创建会话流程。

```text
## Usage

Click that W button — or pick “Add WSL workspace”, directly under “Add workspace…” in the same control’s menu — to open the "Add WSL workspace" dialog. Pick a distribution from the list, then browse the directory tree or type an absolute Linux path (for example `/home/me/proj`) — use the Check button to verify the path exists before creating the workspace. The dialog follows the DeepSeek Harness UI language. The username field is optional: leave it empty to run commands as the distribution's default user, or name a Linux user of that distribution to run the session as that user instead (equivalent to `wsl.exe -u <username>`). The username only changes the bash tool's run identity — the file tools go through the Windows-side WSL share and are unaffected. Each workspace's username is kept in `<dshHome>/wsl-workspaces.json`; delete the entry (or recreate the workspace from the dialog) to return to the default user.

Click "Create & open" to start a new session in the workspace. In the new session the bash tool executes commands inside the chosen distribution and `read`/`write`/`edit` operate on WSL files, so every path the model sees is a Linux path. The mode picker keeps working as usual: Standard, PTC, Minimal and Creative each land on their WSL variant automatically (the WSL variant entries in the picker are bilingual, e.g. `WSL · Standard mode（标准模式）`), and Windows files stay reachable from inside the session under `/mnt/<drive>` (for example `/mnt/c/Users/...`). The dialog's "?" button opens a panel with the DSH releases this build declares, how the plugin is used, and the limitations it cannot fix.
```

**依据 3 · 作者声明**：[README.md:60-65](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/3f3338d9e1a82578815074f87574ca2005977082/README.md#L60-L65)

明确上游继承与设计参照。

```text
## License & attribution

MIT — see [LICENSE](LICENSE) and [NOTICE](NOTICE). The NOTICE precisely lists:

- **Adapted/inherited source code**: DeepSeek Harness (MIT) — `dsh-bash-local` (executor mechanics), `dsh-fs-local` (`WslFileSystem` subclasses it), and the shipped agent presets (read and transformed by the variant generator);
- **Design references (no source copied)**: [dsh-bash-terminal](https://github.com/MAXeaglet/dsh-bash-terminal) (MIT, wsl argv / WSLENV approach), [dsh-side-panel](https://github.com/ccq1/dsh-side-panel) (BSD-3-Clause, host-route pattern), [vpshub](https://github.com/Sdongmaker/vpshub) (MIT, roadmap reference).
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话、执行器与文件系统如何对齐？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主入口生成每种预设的WSL变体，接入专用shell、文件系统、搜索、后台作业、图片和终端工具，并通过会话环境事实定位发行版。shell规格将wsl.exe、发行版和可选用户组成参数，而不是把全部Linux路径交给Windows命令解释；文件系统继承LocalFileSystem，经Windows侧WSL共享实现读写并替换不适合9P的原子发布/DACL操作。因此“运行于WSL”需要分开看命令平面和文件平面，不能推断所有操作具有同一Linux用户语义。源代码显示接线结构，未在本轮Windows/WSL环境执行。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1065-1098](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/3f3338d9e1a82578815074f87574ca2005977082/src/index.ts#L1065-L1098)

专用提供者路径与guard入口。

<details>
<summary>查看原文（34行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  const resolved = config as ResolvedConfig
  const dshHome = process.env.DSH_HOME ?? join(homedir(), '.dsh')
  const packageRoot = fileURLToPath(new URL('..', import.meta.url))
  const shellPath = join(packageRoot, 'lib', 'shell.js').replace(/\\/g, '/')
  const fsPath = join(packageRoot, 'lib', 'fs.js').replace(/\\/g, '/')
  // The persistent shell runs the host PTY backend on the relay, which starts
  // `wsl.exe … bash` under that PTY: two paths the generated preset must carry.
  const relayPath = join(packageRoot, 'lib', 'wsl-relay.js').replace(/\\/g, '/')
  // The pipe-driven persistent shell tool that replaces the host's PTY-backed one by default.
  const bashToolPath = join(packageRoot, 'lib', 'wsl-bash-tool.js').replace(/\\/g, '/')
  // The keyboard door the session tier mounts beside it: the model-facing shape over the
  // host's PTY registry, so a password prompt or a REPL has an answer that is not "a person
  // must do it". It is the only row in this world that needs the relay's interpreter.
  const terminalToolPath = join(packageRoot, 'lib', 'wsl-terminal-tool.js').replace(/\\/g, '/')
  const sandboxPath = join(packageRoot, 'lib', 'wsl-sandbox.js').replace(/\\/g, '/')
  // The in-distribution `grep`/`glob` twin that replaces the host search suite.
  const searchPath = join(packageRoot, 'lib', 'wsl-search.js').replace(/\\/g, '/')
  // The persistent shell has no `run_in_background` of its own; this is the
  // producer that gives the world's `job_*` tools something to track.
  const jobsPath = join(packageRoot, 'lib', 'wsl-jobs.js').replace(/\\/g, '/')
  // The world's answer for `read_image`. The host's registration of that name is made inside
  // `ctx.inject(['attachments'], …)` and its injected-proxy lookup cannot cross the realm this
  // world cuts, so it answers `cannot get property "fs" without inject` here (issue #54); this row
  // resolves `fs` by realm key instead. See `src/host/wsl-image-tool.ts`.
  const imagePath = join(packageRoot, 'lib', 'wsl-image-tool.js').replace(/\\/g, '/')

  // Issue #78: `run_code` is the host's, and on a `\\wsl.localhost\…` root with `workspace-write` the
  // Windows sandbox cannot start at all. Refuse that one shape in words instead of letting the worker
  // die with a Win32 code. See `src/host/wsl-run-code-guard.ts` for the measurements behind it.
  applyRunCodeGuard(ctx)

  const agentPresets = ctx.get('agentPresets') as unknown as AgentPresetsService | undefined
  if (agentPresets !== undefined) {
```

</details>

**依据 2 · 源码核查**：[src/host/wsl-bash-tool.ts:411-434](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/3f3338d9e1a82578815074f87574ca2005977082/src/host/wsl-bash-tool.ts#L411-L434)

发行版和用户的执行规格。

<details>
<summary>查看原文（24行）</summary>

```text
export function buildSessionSpec(config: ResolvedConfig, headerCwd: string | undefined, sessionId?: string): WslBashSessionSpec | undefined {
  const distro = resolveDistro(config, headerCwd)
  if (distro === '') return undefined
  const user = resolveUser(config, headerCwd)
  const linuxCwd = linuxOf(headerCwd)
  // One token per session, carried by every process the shell starts. It is what lets a rebuild stop
  // the children that detached themselves from the shell without touching a process the user owns.
  const sessionToken = randomUUID()
  const prefix = ['wsl.exe', '-d', distro, ...(user === undefined ? [] : ['-u', user])]
  return {
    argv: [...prefix, ...(linuxCwd === undefined ? [] : ['--cd', linuxCwd]), '-e', 'bash', ...SESSION_ARGV],
    // The reaper runs a script of its own, so it gets the same distribution and user without the
    // session's working directory: it is not running the user's command.
    reaperArgv: [...prefix, '-e', 'bash', '-c'],
    // The witness: the same probe, run as the distribution's root, for a process that hides its own
    // `/proc` entries (`sudo` clears its dumpable flag). It is what turns an unconfirmable wait into a
    // reading, so the tool never has to wait out a long silence to be sure — and when root is not
    // available here the probe simply does not answer, which the session records.
    witnessArgv: ['wsl.exe', '-d', distro, '-u', 'root', '-e', 'bash', '-c'],
    // The child never starts inside the UNC share: spawning with a UNC cwd is a documented
    // Node/Windows edge, and `wsl.exe --cd` already decides the Linux side.
    cwd: process.env.SystemRoot ?? 'C:\\Windows',
    env: bridgeEnv(
      {
```

</details>

**依据 3 · 源码核查**：[src/fs.ts:90-115](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/3f3338d9e1a82578815074f87574ca2005977082/src/fs.ts#L90-L115)

继承本地fs并替换9P不支持的边界。

<details>
<summary>查看原文（26行）</summary>

```text
 */
export class WslFileSystem extends LocalFileSystem {
  static override Config: z<Config> = z.object({
    cwd: z.string(),
    distro: z.string(),
    diffBasisMaxBytes: z.number().default(10 * 1024 * 1024),
  })

  private readonly distro: string | undefined
  private readonly executionCwd = new AsyncLocalStorage<string | undefined>()

  constructor(ctx: Context, config: Config) {
    // schemastery fills the defaults before construction; the parent validates
    // `diffBasisMaxBytes` and stores the resolved shape.
    super(ctx, config)
    this.distro = config.distro
    ctx.on('tools/execute', (exec: ToolDispatchExecution, next: () => Promise<ToolExecutionResult>) => (
      this.executionCwd.run(exec.agent?.session.header.cwd, next)
    ))
    // The 9P/drvfs substrate has no hard links and no Win32 security semantics:
    // replace the atomic-publication boundaries the parent's fsio defaults to.
    this.internals = {
      linkFile: WslFileSystem.publishNoReplace,
      replaceFile: WslFileSystem.replaceOverWrite,
      copyFileDacl: WslFileSystem.skipDaclCopy,
    }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 完整会话是否意味着统一安全边界和恰好一次执行？

**研究主题**：缺陷与关键质疑

#### 完整回答

关键质疑是否会把多执行平面误认为一个统一隔离环境。README明确用户只改变bash身份，文件工具通过Windows共享不受该字段影响；run_code在workspace-write与WSL 9P根的特定组合被guard拒绝，因为Windows ACL沙箱不能启动，guard并未构建WSL内部隔离。另一个重要边界是等待键盘的命令可能在伪终端自动重跑：源码把原命令重新传入session.run，前半段已有副作用不能因此撤销，调用者可用tty:false否决。故不能将会话恢复或诊断重跑当作事务性恰好一次执行；带副作用命令应明确交互方式并核对已完成动作。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:34-36](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/3f3338d9e1a82578815074f87574ca2005977082/README.md#L34-L36)

用户身份和文件平面的作者说明。

```text
## Usage

Click that W button — or pick “Add WSL workspace”, directly under “Add workspace…” in the same control’s menu — to open the "Add WSL workspace" dialog. Pick a distribution from the list, then browse the directory tree or type an absolute Linux path (for example `/home/me/proj`) — use the Check button to verify the path exists before creating the workspace. The dialog follows the DeepSeek Harness UI language. The username field is optional: leave it empty to run commands as the distribution's default user, or name a Linux user of that distribution to run the session as that user instead (equivalent to `wsl.exe -u <username>`). The username only changes the bash tool's run identity — the file tools go through the Windows-side WSL share and are unaffected. Each workspace's username is kept in `<dshHome>/wsl-workspaces.json`; delete the entry (or recreate the workspace from the dialog) to return to the default user.
```

**依据 2 · 源码核查**：[src/host/wsl-run-code-guard.ts:49-56](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/3f3338d9e1a82578815074f87574ca2005977082/src/host/wsl-run-code-guard.ts#L49-L56)

guard解释特定沙箱缺口而非承诺隔离。

```text
export function refusalForRoot (root: string): string {
  return 'run_code cannot start in this session: the Windows file sandbox grants write access by reading '
    + `the workspace root's security descriptor, and the root here is a WSL 9P share (${root}), which has `
    + 'none — the host reports `GetNamedSecurityInfoW failed (Win32 1)` before any program runs, so this is '
    + 'not a problem with the code asked for. Three settings do run: switch this session to read-only (the '
    + 'host reports enforcement as partial), switch it to danger-full-access, or use the world\'s own tools '
    + '(`bash`, `wsl_terminal`, `read`, `write`, `edit`, `grep`, `glob`), which run inside the distribution. '
    + 'A sandbox enforced inside the distribution itself is the open work tracked as issue #78.'
```

**依据 3 · 源码核查**：[src/host/wsl-run-code-guard.ts:77-84](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/3f3338d9e1a82578815074f87574ca2005977082/src/host/wsl-run-code-guard.ts#L77-L84)

只匹配特定工具、策略和9P根。

```text
export function denyRunCodeOn9p (exec: ExecFace, policy: { mode?: string; workspaceRoot?: string } | undefined): string | undefined {
  if (exec.name !== RUN_CODE_NAME || policy === undefined) return undefined
  // An escalated call carries the mode the user approved; only the plain session setting is ours to read.
  if (typeof exec.arguments?.sandbox_permissions === 'string') return undefined
  if (policy.mode !== WRITE_MODE) return undefined
  const root = policy.workspaceRoot
  if (typeof root !== 'string' || !isWsl9pRoot(root)) return undefined
  return refusalForRoot(root)
```

**依据 4 · 源码核查**：[src/host/wsl-bash-tool.ts:616-644](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/3f3338d9e1a82578815074f87574ca2005977082/src/host/wsl-bash-tool.ts#L616-L644)

自动伪终端重跑和状态合并。

<details>
<summary>查看原文（29行）</summary>

```text
      tally.set(signature, tried)
      let run = await session.run(command, timeoutMs, exec.signal, escalated, args.stdin)
      // What the session did that the body cannot show, in the order the model has to read it.
      const before: string[] = []
      // The command was caught waiting for a keyboard, so give it what a person at a terminal would: a
      // terminal of its own, in this same call. Its stdin is still `script`'s end-of-file, so what comes
      // back is the program's own complaint instead of a deadline — measured with `sudo`, which answered
      // with its own three lines in 9.4 s of a 25 s call (2026-10-05) after having sat on the pipe for
      // the whole deadline before. `tty: false` vetoes this, because a caller that only wanted the plain
      // pipe must be able to insist on it.
      // `run.restarted` is deliberately not part of this: a starved call whose shell had to be restarted
      // (a builtin that read the terminal blocked the shell itself) still wants the pseudo-terminal
      // retry — the command never did anything but wait.
      if (!escalated && !vetoTty && run.starved !== undefined && !run.aborted) {
        const first = { kind: run.starved, atMs: run.starvedAtMs ?? 0, viaRoot: run.starvedViaRoot === true, shellInterrupted: run.starvedShellInterrupt === true }
        logging?.debug?.(`wsl-bash: stopped a command waiting for input (${first.kind}${first.viaRoot ? ' via the root plane' : ''} at ${first.atMs}ms) and re-running it on a pseudo-terminal`)
        escalated = true
        before.push(retryNote(first.kind, first.atMs, first.viaRoot, first.shellInterrupted))
        command = wrap(wrapForTty(args.command))
        // What the first attempt did to the shell is a fact about this call, not about the attempt it
        // was found in: a builtin that read the terminal blocks the shell itself, so the shell is
        // restarted here, and what that restart could not restore has to reach the note. Measured
        // 2026-10-06: dropped with the first run, the loss went unreported on exactly the path that
        // loses the most.
        const firstRun = run
        const retry = await session.run(command, timeoutMs, exec.signal, true, args.stdin)
        run = { ...retry,
          restarted: retry.restarted || firstRun.restarted,
          skipped: retry.skipped ?? firstRun.skipped }
```

</details>

#### 缺口

- 同版本文件权限与跨工具隔离尚无本轮执行证据
  **影响**：不能将所选WSL用户当统一权限边界
  **进一步探讨**：在临时发行版使用不同属主文件，分别检查shell/fs/run_code行为与拒绝路径

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、日常开发和故障恢复的代价是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要Windows上的DSH与可用WSL发行版、可访问9P共享及所需Linux工具链。作者的“WSL内无需安装”针对插件支撑组件，不表示项目构建器、包依赖或任务工具自动存在。插件依赖宿主预设、PTY/子进程和文件API，并按宿主能力选择执行路径；版本兼容矩阵属于作者报告，本轮未复现。数据路由校验请求socket与Host为loopback，说明设计限于本机而不是远程WSL管理。持续成本包括Windows/WSL双平面排查与宿主升级适配；恢复须检查持久shell状态、后台作业和可能重跑的副作用。没有任务量、模型调用、CPU或人工耗时记录，不能推导单位任务成本下降。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:26-32](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/3f3338d9e1a82578815074f87574ca2005977082/README.md#L26-L32)

作者声明兼容范围，不能当本轮独立验证。

```text
## Compatibility

This build declares these DSH releases, each verified on an isolated instance (its own `DSH_HOME`, dependencies pinned to that release, the full check suite):

`0.1.0-rc.7` · `0.1.0-rc.8` · `0.1.1-rc.1` · `0.1.1-rc.2` · `0.1.2-rc.1` · `0.1.3-alpha.2` · `0.1.5-rc.1` · `0.1.5-rc.2` · `0.1.7-rc.1` · `0.1.7-rc.2` · `0.2.0-rc.2` · `0.2.1-rc.2`

The list mirrors `dsh.compatibility.dshReleases` in `package.json`, and a unit test fails if the two drift apart. `0.2.1-rc.2` is the DSH release DSH Desktop `0.2.1-rc.2` ships — verified against the host inside that application's own bundle, not only against the npm release — so the Desktop is covered by the same declaration; the app's help panel (the dialog's "?" button) shows the same chips next to the plugin version. The plugin detects the DSH generation at runtime and picks the matching API, and a release exposing neither fails loudly instead of leaving an empty workspace. A release outside the list usually still works, but is unverified.
```

**依据 2 · 源码核查**：[src/index.ts:1290-1322](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/3f3338d9e1a82578815074f87574ca2005977082/src/index.ts#L1290-L1322)

本机路由的loopback检查和请求处理。

<details>
<summary>查看原文（33行）</summary>

```text
  const webServer = ctx.get('webServer') as unknown as WebServerService
  ctx.effect(() => webServer.register({
    kind: 'exact',
    path: resolved.route,
    handler: async (req, res) => {
      if (!isLoopback(req.socket.remoteAddress) || !isLoopbackHost(req.headers.host)) {
        json(res, 403, { ok: false, error: 'loopback-only' })
        return
      }
      if (req.method !== 'POST') {
        json(res, 405, { ok: false, error: 'method not allowed' })
        return
      }
      let body: Record<string, unknown>
      try {
        body = await readBody(req)
      } catch (error) {
        json(res, 400, { ok: false, error: messageOf(error) })
        return
      }
      const method = typeof body.method === 'string' ? body.method : ''
      const params = body.params === undefined ? {} : body.params
      if (params === null || typeof params !== 'object' || Array.isArray(params)) {
        json(res, 400, { ok: false, error: 'params must be an object' })
        return
      }
      try {
        const value = await dispatch(method, params as Record<string, unknown>)
        json(res, 200, { ok: true, value })
      } catch (error) {
        json(res, 200, { ok: false, error: messageOf(error) })
      }
    },
```

</details>

**依据 3 · 源码核查**：[src/host/wsl-bash-tool.ts:616-644](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/3f3338d9e1a82578815074f87574ca2005977082/src/host/wsl-bash-tool.ts#L616-L644)

恢复和重跑负担来源。

<details>
<summary>查看原文（29行）</summary>

```text
      tally.set(signature, tried)
      let run = await session.run(command, timeoutMs, exec.signal, escalated, args.stdin)
      // What the session did that the body cannot show, in the order the model has to read it.
      const before: string[] = []
      // The command was caught waiting for a keyboard, so give it what a person at a terminal would: a
      // terminal of its own, in this same call. Its stdin is still `script`'s end-of-file, so what comes
      // back is the program's own complaint instead of a deadline — measured with `sudo`, which answered
      // with its own three lines in 9.4 s of a 25 s call (2026-10-05) after having sat on the pipe for
      // the whole deadline before. `tty: false` vetoes this, because a caller that only wanted the plain
      // pipe must be able to insist on it.
      // `run.restarted` is deliberately not part of this: a starved call whose shell had to be restarted
      // (a builtin that read the terminal blocked the shell itself) still wants the pseudo-terminal
      // retry — the command never did anything but wait.
      if (!escalated && !vetoTty && run.starved !== undefined && !run.aborted) {
        const first = { kind: run.starved, atMs: run.starvedAtMs ?? 0, viaRoot: run.starvedViaRoot === true, shellInterrupted: run.starvedShellInterrupt === true }
        logging?.debug?.(`wsl-bash: stopped a command waiting for input (${first.kind}${first.viaRoot ? ' via the root plane' : ''} at ${first.atMs}ms) and re-running it on a pseudo-terminal`)
        escalated = true
        before.push(retryNote(first.kind, first.atMs, first.viaRoot, first.shellInterrupted))
        command = wrap(wrapForTty(args.command))
        // What the first attempt did to the shell is a fact about this call, not about the attempt it
        // was found in: a builtin that read the terminal blocks the shell itself, so the shell is
        // restarted here, and what that restart could not restore has to reach the note. Measured
        // 2026-10-06: dropped with the first run, the loss went unreported on exactly the path that
        // loses the most.
        const firstRun = run
        const retry = await session.run(command, timeoutMs, exec.signal, true, args.stdin)
        run = { ...retry,
          restarted: retry.restarted || firstRun.restarted,
          skipped: retry.skipped ?? firstRun.skipped }
```

</details>

#### 缺口

- Windows/WSL双平面长期维护和恢复耗时未知
  **影响**：不能证明比直接在Linux运行宿主总负担更低
  **进一步探讨**：固定项目与宿主版本比较两种运行方式的任务成功率、恢复时间和人工步骤

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些设计可借鉴，当前如何决定试用？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

把执行世界作为可组合预设变体，而不是另造一种任务模式，有利于保留原有工作习惯；对9P原子发布和run_code拒绝的显式边界也值得复用。但它依赖宿主内部接口与Windows文件语义，维护者兼容投入不能视作零迁移。未验证假设是为潜在重跑增加执行阶段账本，将“尚未执行”“可能部分完成”“已完成”与纯交互诊断区分，可减少自动恢复导致的重复副作用。最小验证用会在写标记后等待输入的临时命令，比较当前自动重跑、tty:false和账本提示，检查重复写次数、恢复时间与人工判断；若账本无法可靠判定或负担超过收益则否定。当前建议trial，仅在临时发行版/非生产项目核对文件身份、shell状态和禁用恢复，不能以作者矩阵直接给持续安装结论。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:4-15](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/3f3338d9e1a82578815074f87574ca2005977082/src/index.ts#L4-L15)

作者代码注释解释执行世界与预设组合。

<details>
<summary>查看原文（12行）</summary>

```text
 * 1. Publish a `wsl-<mode>` variant for every healthy roster preset, so the
 *    WSL execution world — `shell-wsl` + `fs-wsl` behind one entry-local
 *    realm, with `tool-bash`/`tool-fs` consumers — composes with ANY mode
 *    instead of being a mode itself. The channel follows the release:
 *    `0.1.7-alpha.1+` stopped scanning any user preset root and builds its roster
 *    from declarative `@deepseek-ai/dsh-agent-preset` rows, so there a variant
 *    is a *declaration registered through `ctx.agentPresets`* — and only that
 *    path rewrites the absolute provider specifiers below into `file:` URLs,
 *    because a registered preset's entry tree does not translate them the way
 *    the boot-time Include does; earlier releases still get a variant directory
 *    under `<dshHome>/.agent-presets/`, whose legacy standalone `wsl` directory
 *    and stale variants are removed on boot.
```

</details>

**依据 2 · 源码核查**：[src/fs.ts:104-115](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/3f3338d9e1a82578815074f87574ca2005977082/src/fs.ts#L104-L115)

9P适配的明确接缝。

<details>
<summary>查看原文（12行）</summary>

```text
    super(ctx, config)
    this.distro = config.distro
    ctx.on('tools/execute', (exec: ToolDispatchExecution, next: () => Promise<ToolExecutionResult>) => (
      this.executionCwd.run(exec.agent?.session.header.cwd, next)
    ))
    // The 9P/drvfs substrate has no hard links and no Win32 security semantics:
    // replace the atomic-publication boundaries the parent's fsio defaults to.
    this.internals = {
      linkFile: WslFileSystem.publishNoReplace,
      replaceFile: WslFileSystem.replaceOverWrite,
      copyFileDacl: WslFileSystem.skipDaclCopy,
    }
```

</details>

**依据 3 · 源码核查**：[src/host/wsl-bash-tool.ts:616-644](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/3f3338d9e1a82578815074f87574ca2005977082/src/host/wsl-bash-tool.ts#L616-L644)

重跑阶段账本的推导依据。

<details>
<summary>查看原文（29行）</summary>

```text
      tally.set(signature, tried)
      let run = await session.run(command, timeoutMs, exec.signal, escalated, args.stdin)
      // What the session did that the body cannot show, in the order the model has to read it.
      const before: string[] = []
      // The command was caught waiting for a keyboard, so give it what a person at a terminal would: a
      // terminal of its own, in this same call. Its stdin is still `script`'s end-of-file, so what comes
      // back is the program's own complaint instead of a deadline — measured with `sudo`, which answered
      // with its own three lines in 9.4 s of a 25 s call (2026-10-05) after having sat on the pipe for
      // the whole deadline before. `tty: false` vetoes this, because a caller that only wanted the plain
      // pipe must be able to insist on it.
      // `run.restarted` is deliberately not part of this: a starved call whose shell had to be restarted
      // (a builtin that read the terminal blocked the shell itself) still wants the pseudo-terminal
      // retry — the command never did anything but wait.
      if (!escalated && !vetoTty && run.starved !== undefined && !run.aborted) {
        const first = { kind: run.starved, atMs: run.starvedAtMs ?? 0, viaRoot: run.starvedViaRoot === true, shellInterrupted: run.starvedShellInterrupt === true }
        logging?.debug?.(`wsl-bash: stopped a command waiting for input (${first.kind}${first.viaRoot ? ' via the root plane' : ''} at ${first.atMs}ms) and re-running it on a pseudo-terminal`)
        escalated = true
        before.push(retryNote(first.kind, first.atMs, first.viaRoot, first.shellInterrupted))
        command = wrap(wrapForTty(args.command))
        // What the first attempt did to the shell is a fact about this call, not about the attempt it
        // was found in: a builtin that read the terminal blocks the shell itself, so the shell is
        // restarted here, and what that restart could not restore has to reach the note. Measured
        // 2026-10-06: dropped with the first run, the loss went unreported on exactly the path that
        // loses the most.
        const firstRun = run
        const retry = await session.run(command, timeoutMs, exec.signal, true, args.stdin)
        run = { ...retry,
          restarted: retry.restarted || firstRun.restarted,
          skipped: retry.skipped ?? firstRun.skipped }
```

</details>

#### 缺口

- 跨平面恰好一次语义及账本收益未验证
  **影响**：新假设不能算当前能力
  **进一步探讨**：先以无外部副作用的标记文件命令做隔离对照，记录重复动作和恢复判断

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
