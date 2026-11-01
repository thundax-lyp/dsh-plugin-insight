# dsh-wsl-workspace

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[aac3f93](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/tree/aac3f93e1cdf29eabc0bfbb391caf06b2e8e4dd6)

<!-- BEGIN META -->
[![GitHub ★ 104](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=104&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace) [![npm 30d 2,542](https://img.shields.io/static/v1?label=npm+30d&message=2%2C542&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-wsl-workspace) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-wsl-workspace)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中使用本机 WSL 发行版工作区。

> **亮点**：[Q01](#research-q01) 让会话使用 WSL 工作区，[Q02](#research-q02) 连接发行版、shell 和文件路径。

> **主要限制**：[Q03](#research-q03) 自动伪终端重跑可能重复副作用；WSL 仍可访问 Windows 挂载盘。

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
  - [Q01 · Windows 用户为何需要 WSL 工作区，相对手动终端改变什么？](#detail-section-11)
  - [Q02 · 会话、shell 与文件路径如何接线？](#detail-section-12)
  - [Q03 · 输入等待、自动重试和访问边界有哪些风险？](#detail-section-13)
  - [Q04 · 依赖、版本和采用退路是什么？](#detail-section-14)
  - [Q05 · 能否让用户在重跑前判断潜在重复副作用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Windows 上的 DSH 用户希望操作 WSL 项目。

用户通过独立 WSL 终端执行命令并手动传递结果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| WSL 工作区 | 映射发行版与目录 | 需要兼容 Windows/WSL |
| shell | 调用 wsl.exe 与 bash | 自动重跑可重复副作用 |
| 文件路径 | 映射 UNC 与 Windows 盘 | 不是完全隔离 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| Windows 与 WSL | 必需 | 提供 Linux 发行版 | 无法执行 |
| Node >=24 和兼容 DSH | 必需 | 插件宿主 | 不符合时停止 |
| 可用发行版及权限 | 必需 | 访问项目与运行命令 | 核对用户及目录 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份并核宿主与发行版 | 不匹配停止 |
| 注册 | 用户选发行版与目录 | 核 cwd 与用户 |
| 验证 | 只读运行并检查样例文件 | 映射异常回人工终端 |
| 执行 | 对有副作用命令设置 tty:false 并核状态 | 不自动重跑未知结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 接入 | WSL 和存储成本未知 | 安装配置发行版 | 版本和权限未测 |
| 运行 | 计算资源未知 | 维护项目与依赖 | 差异未穷尽 |
| 恢复 | 备份和重做成本未知 | 核对副作用 | 命令可能执行两次 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 发行版路由 | 按 cwd 构造 WSL 命令 | 所有版本兼容 |
| 文件访问 | 路径转换及链接解析 | 完全隔离或权限安全 |
| 输入等待 | 有条件重跑并可禁用 | 不重复副作用 |

> **思考**：[Q03](#research-q03) 自动伪终端重跑可能重复副作用；WSL 仍可访问 Windows 挂载盘。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 让会话使用 WSL 工作区，[Q02](#research-q02) 连接发行版、shell 和文件路径。

[Q02](#research-q02) 区分发行版、Linux cwd 和 Windows cwd；[Q03](#research-q03) 检测到键盘等待时可能重跑。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 自动伪终端重跑可能重复副作用；WSL 仍可访问 Windows 挂载盘。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 在隔离 WSL 发行版试用只读操作并备份；对写操作使用 tty:false 并核状态。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已静态核查发行版选择、shell、路径及重跑代表路径；未运行 Windows 或 WSL。

- 已检查：作者 README、包清单、源码路径 README.zh.md、src/index.ts、src/fs.ts、src/shell.ts、src/host/wsl-bash-tool.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定 README、包清单、宿主接线、shell、文件与重跑路径；未运行 Windows、WSL、DSH 或目标。
- 下一步：[Q05](#research-q05) 先核现有 UI，再以受控副作用比较重跑前确认。

**分析版本**

- **仓库**：[dsh-wsl-workspace-maintainers/dsh-wsl-workspace](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace)
- **版本号**：0.7.12（[固定提交 aac3f93](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/tree/aac3f93e1cdf29eabc0bfbb391caf06b2e8e4dd6)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设重跑前的人工确认可减少重复副作用；尚未验证。

[Q05](#research-q05) 先核现有 UI，再以受控副作用比较重跑前确认。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 33 | 5627 | — | — | 195611 |
| .mjs | source | 39 | 6977 | 4751 | 1846 | — |
| .js | source | 17 | 11031 | 7276 | 3851 | — |
| .mjs | test | 44 | 13471 | 9071 | 3630 | — |
| .tsx | source | 4 | 714 | 494 | 185 | — |
| .ts | source | 34 | 13461 | 7513 | 5259 | — |
| .ts | test | 26 | 6076 | 4208 | 1386 | — |

</details>

**活跃度**

[![Issue 未关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 23](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=23&color=737b86&logo=github)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z) [![近30天关闭 19](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=19&color=737b86&logo=github)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对工作区与 WSL shell、文件路径及重跑边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Windows 用户为何需要 WSL 工作区，相对手动终端改变什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README.zh.md:9-9 描述在 DSH GUI 建 WSL 工作区，让会话命令及文件访问 Linux 路径；相对自己在 WSL 终端执行并手工复制结果，插件提供会话层面的工作区与执行接线。实际需求频率、任务收益和兼容率未独立测量。WSL 内仍可通过 /mnt 访问 Windows 文件，不可将它当与 Windows 完全隔离的沙箱。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:9-9](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/aac3f93e1cdf29eabc0bfbb391caf06b2e8e4dd6/README.zh.md#L9-L9)

作者描述 WSL 工作区和 Windows 可达性。

```text
在 DeepSeek Harness Web GUI 中「添加 WSL 工作区」：让 agent 会话的 bash 命令与文件读写都运行在本机 WSL 发行版里，路径均为 Linux 形式，WSL 内无需安装任何工具链。会话可同时访问 WSL 与 Windows 两个系统——bash 命令在 WSL 发行版内执行，Windows 文件随时可通过 `/mnt/<drive>`（如 `/mnt/c/Users/...`）访问。
```

**依据 2 · 源码核查**：[src/index.ts:1390-1424](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/aac3f93e1cdf29eabc0bfbb391caf06b2e8e4dd6/src/index.ts#L1390-L1424)

从会话 cwd 解析发行版与用户。

<details>
<summary>查看原文（35行）</summary>

```text
  const shellEnv = ctx.get('shellEnv') as unknown as ShellEnvService | undefined
  if (shellEnv !== undefined) {
    ctx.effect(() => shellEnv.register({
      name: 'wsl-workspace-distro',
      variables: {
        DSH_WSL_DISTRO: {
          description: 'The WSL distribution of the calling session workspace, when the session cwd is a WSL UNC path.',
        },
        DSH_WSL_USER: {
          description: 'The Linux user of the calling session workspace, when the workspace has one configured.',
        },
      },
      resolve(execution) {
        const cwd = execution.agent?.session.header.cwd
        const unc = cwd === undefined ? null : parseWslUnc(cwd)
        if (unc !== null) {
          const username = getWorkspaceUsername(joinUnc(unc.distro, unc.linuxPath))
          return username === undefined || username === ''
            ? { DSH_WSL_DISTRO: unc.distro }
            : { DSH_WSL_DISTRO: unc.distro, DSH_WSL_USER: username }
        }
        // A Windows-drive cwd belongs to a `/mnt/<drive>` WSL workspace (9P
        // cannot serve drvfs, so those register under their drive path): the
        // stored distro drives `wsl.exe -d` for bash.
        if (cwd !== undefined && /^[A-Za-z]:[\\/]/.test(cwd)) {
          const entry = getWindowsWorkspace(cwd)
          if (entry !== undefined && entry.distro !== undefined && entry.distro !== '') {
            return entry.username === undefined || entry.username === ''
              ? { DSH_WSL_DISTRO: entry.distro }
              : { DSH_WSL_DISTRO: entry.distro, DSH_WSL_USER: entry.username }
          }
        }
        return {}
      },
    }), 'dsh-wsl-workspace: per-session distro env fact')
```

</details>

**依据 3 · 源码核查**：[src/fs.ts:158-174](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/aac3f93e1cdf29eabc0bfbb391caf06b2e8e4dd6/src/fs.ts#L158-L174)

Windows 与 Linux 路径相互映射。

<details>
<summary>查看原文（17行）</summary>

```text
  /** Translate a model/plugin path into Windows-side coordinates. */
  private translate(path: string, cwd?: string): Translated {
    const unc = parseWslUnc(path)
    if (unc !== null) {
      return { input: joinUnc(unc.distro, unc.linuxPath), cwd: this.cwdOr(cwd) }
    }
    if (isAbsoluteLinuxPath(path)) {
      // /mnt/<drive>/… names the Windows filesystem inside the Linux world
      // (the dual-access path for migration): open the drive path directly so
      // both worlds stay coherent — the display stays the /mnt form.
      const win = mntToWindowsPath(path)
      if (win !== null) return { input: win, cwd: this.cwdOr(cwd) }
      return { input: joinUnc(this.distroFor(cwd), path), cwd: this.cwdOr(cwd) }
    }
    if (windowsToMntPath(path) !== null) {
      // Windows drive paths open directly; the Linux world reaches them via /mnt.
      return { input: path, cwd: this.cwdOr(cwd) }
```

</details>

#### 缺口

- 未运行 GUI 或真实工作负载
  **影响**：不能证明效率或隔离效果
  **进一步探讨**：在隔离机器比较人工 WSL 与会话工作流。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话、shell 与文件路径如何接线？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

index.ts:1390-1424 为 WSL UNC 会话或已登记 Windows 盘工作区提供 DSH_WSL_DISTRO/USER；shell.ts:240-269 从 UNC、Linux 或 Windows 路径构造工作目录，279-290 用 wsl.exe 指定发行版、用户、目录与 bash。fs.ts:158-178 将 Linux 路径映射至 WSL UNC，/mnt 映射 Windows 路径；226-245 对链接进行额外真实路径解析后交给本地解析。源码覆盖代表路径，尚未验证所有工作区版本、权限及 UI。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1390-1424](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/aac3f93e1cdf29eabc0bfbb391caf06b2e8e4dd6/src/index.ts#L1390-L1424)

会话到发行版的环境事实。

<details>
<summary>查看原文（35行）</summary>

```text
  const shellEnv = ctx.get('shellEnv') as unknown as ShellEnvService | undefined
  if (shellEnv !== undefined) {
    ctx.effect(() => shellEnv.register({
      name: 'wsl-workspace-distro',
      variables: {
        DSH_WSL_DISTRO: {
          description: 'The WSL distribution of the calling session workspace, when the session cwd is a WSL UNC path.',
        },
        DSH_WSL_USER: {
          description: 'The Linux user of the calling session workspace, when the workspace has one configured.',
        },
      },
      resolve(execution) {
        const cwd = execution.agent?.session.header.cwd
        const unc = cwd === undefined ? null : parseWslUnc(cwd)
        if (unc !== null) {
          const username = getWorkspaceUsername(joinUnc(unc.distro, unc.linuxPath))
          return username === undefined || username === ''
            ? { DSH_WSL_DISTRO: unc.distro }
            : { DSH_WSL_DISTRO: unc.distro, DSH_WSL_USER: username }
        }
        // A Windows-drive cwd belongs to a `/mnt/<drive>` WSL workspace (9P
        // cannot serve drvfs, so those register under their drive path): the
        // stored distro drives `wsl.exe -d` for bash.
        if (cwd !== undefined && /^[A-Za-z]:[\\/]/.test(cwd)) {
          const entry = getWindowsWorkspace(cwd)
          if (entry !== undefined && entry.distro !== undefined && entry.distro !== '') {
            return entry.username === undefined || entry.username === ''
              ? { DSH_WSL_DISTRO: entry.distro }
              : { DSH_WSL_DISTRO: entry.distro, DSH_WSL_USER: entry.username }
          }
        }
        return {}
      },
    }), 'dsh-wsl-workspace: per-session distro env fact')
```

</details>

**依据 2 · 源码核查**：[src/shell.ts:240-269](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/aac3f93e1cdf29eabc0bfbb391caf06b2e8e4dd6/src/shell.ts#L240-L269)

解析工作目录与发行版。

<details>
<summary>查看原文（30行）</summary>

```text
  private plan(spec: ShellExecSpec): WslPlan {
    const workdir = spec.workdir
    let distro: string
    let linuxCwd: string
    let windowsCwd: string
    let username: string | undefined
    const unc = parseWslUnc(workdir)
    if (unc !== null) {
      distro = unc.distro
      linuxCwd = unc.linuxPath
      // The `wsl.exe` process itself needs a plain Windows directory: its own
      // cwd is irrelevant (`--cd` sets the Linux side), and spawning with a
      // UNC cwd is a documented Node/Windows edge. SystemRoot always exists.
      windowsCwd = process.env.SystemRoot ?? process.cwd()
      username = this.resolveUser(spec, joinUnc(unc.distro, unc.linuxPath))
    } else if (workdir.startsWith('/')) {
      distro = this.resolveDistro(spec)
      linuxCwd = workdir
      windowsCwd = process.cwd()
      username = this.resolveUser(spec, undefined)
    } else {
      const mnt = windowsToMntPath(workdir)
      if (mnt === null) {
        throw new Error(`wsl-shell: workdir "${workdir}" is not in the WSL execution world`)
      }
      distro = this.resolveDistro(spec)
      linuxCwd = mnt
      windowsCwd = workdir
      username = this.resolveUser(spec, undefined)
    }
```

</details>

**依据 3 · 源码核查**：[src/shell.ts:279-290](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/aac3f93e1cdf29eabc0bfbb391caf06b2e8e4dd6/src/shell.ts#L279-L290)

构造 wsl.exe 与 bash 参数。

<details>
<summary>查看原文（12行）</summary>

```text
      ? `cd '${linuxCwd.replace(/'/g, `'\\''`)}' && ${spec.command}`
      : spec.command
    const argv = [
      this.config.wslPath,
      '-d', distro,
      ...(username !== undefined && username !== '' ? ['-u', username] : []),
      '--cd', linuxCwd,
      '-e', 'bash',
      this.config.loginShell ? '-lc' : '-c',
      command,
    ]
    return { distro, linuxCwd, windowsCwd, env, argv }
```

</details>

**依据 4 · 源码核查**：[src/fs.ts:158-178](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/aac3f93e1cdf29eabc0bfbb391caf06b2e8e4dd6/src/fs.ts#L158-L178)

路径转换。

<details>
<summary>查看原文（21行）</summary>

```text
  /** Translate a model/plugin path into Windows-side coordinates. */
  private translate(path: string, cwd?: string): Translated {
    const unc = parseWslUnc(path)
    if (unc !== null) {
      return { input: joinUnc(unc.distro, unc.linuxPath), cwd: this.cwdOr(cwd) }
    }
    if (isAbsoluteLinuxPath(path)) {
      // /mnt/<drive>/… names the Windows filesystem inside the Linux world
      // (the dual-access path for migration): open the drive path directly so
      // both worlds stay coherent — the display stays the /mnt form.
      const win = mntToWindowsPath(path)
      if (win !== null) return { input: win, cwd: this.cwdOr(cwd) }
      return { input: joinUnc(this.distroFor(cwd), path), cwd: this.cwdOr(cwd) }
    }
    if (windowsToMntPath(path) !== null) {
      // Windows drive paths open directly; the Linux world reaches them via /mnt.
      return { input: path, cwd: this.cwdOr(cwd) }
    }
    // Relative: resolve against the caller cwd (or the configured base).
    const base = this.uncCwd(cwd)
    return { input: path, cwd: base }
```

</details>

**依据 5 · 源码核查**：[src/fs.ts:226-245](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/aac3f93e1cdf29eabc0bfbb391caf06b2e8e4dd6/src/fs.ts#L226-L245)

链接感知解析。

<details>
<summary>查看原文（20行）</summary>

```text
  override async resolve(path: string, opts?: { cwd?: string; signal?: AbortSignal }): Promise<FsTarget> {
    if (opts?.signal?.aborted) throw new FsError('resolve aborted', 'FS_ABORTED')
    const { input, cwd } = this.translate(path, opts?.cwd)
    const resolved = { cwd, ...opts?.signal !== undefined ? { signal: opts.signal } : {} }
    let local: FsTarget
    try {
      local = await super.resolve(input, resolved)
    } catch (error) {
      const real = await this.linkAwarePath(input, input)
      if (real === undefined) throw error
      return this.wslTarget(await super.resolve(real, resolved))
    }
    // The share resolves a link path to a *lexical* identity: `lstat` on a
    // Linux symlink fails, so the local resolver hands back the deepest
    // existing ancestor plus the remaining segments. Ask the distribution
    // before accepting that identity, or a link would be treated as a plain
    // missing file (and a write through it would escape the policy).
    const real = await this.linkAwarePath(input, String(local.targetKey))
    if (real === undefined) return this.wslTarget(local)
    return this.wslTarget(await super.resolve(real, resolved))
```

</details>

#### 缺口

- 未运行宿主和发行版
  **影响**：不能证明所有文件和 shell 操作正确
  **进一步探讨**：隔离 WSL 实测不同路径及链接。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 输入等待、自动重试和访问边界有哪些风险？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

wsl-bash-tool.ts:502-505 声明检测等待键盘时可能停止并用伪终端重跑，tty:false 可否决自动重跑；612-641 的实现先运行，再按条件重新调用同一命令。因此第一次执行在提示前的副作用可能发生两次，不能把重跑称为无副作用恢复。fs.ts:158-174 明确 Windows 文件可达，链接解析也不等于全部系统隔离；需结合宿主权限与沙箱。未做真机故障测试时，用户应将有副作用命令拆开、核状态并使用 tty:false 防自动重跑。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/wsl-bash-tool.ts:502-505](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/aac3f93e1cdf29eabc0bfbb391caf06b2e8e4dd6/src/host/wsl-bash-tool.ts#L502-L505)

工具参数描述自动重跑与 veto。

```text
      timeoutMs: { type: 'number', description: 'Per-call deadline in milliseconds, for a long build or install. A call that is caught waiting for keyboard input is stopped and re-run on a terminal inside the same deadline, so a longer deadline never means a longer silent wait for a prompt.' },
      tty: {
        type: 'boolean',
        description: 'Run the command on a pseudo-terminal from the start. Set true when a terminal is what the command needs (a pager whose drawing matters, a program that refuses to run without a tty). Set false to keep the ordinary pipe even if the command goes quiet waiting for input — that vetoes the automatic re-run. Left out, the tool decides by watching the process instead of its name.',
```

**依据 2 · 源码核查**：[src/host/wsl-bash-tool.ts:612-641](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/aac3f93e1cdf29eabc0bfbb391caf06b2e8e4dd6/src/host/wsl-bash-tool.ts#L612-L641)

执行后重新运行路径。

<details>
<summary>查看原文（30行）</summary>

```text
      const signature = args.command.replace(/\s+/g, ' ').trim()
      let tally = attempts.get(session)
      if (tally === undefined) { tally = new Map<string, number>(); attempts.set(session, tally) }
      const tried = (tally.get(signature) ?? 0) + 1
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
```

</details>

**依据 3 · 源码核查**：[src/fs.ts:158-174](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/aac3f93e1cdf29eabc0bfbb391caf06b2e8e4dd6/src/fs.ts#L158-L174)

Windows 盘可以访问。

<details>
<summary>查看原文（17行）</summary>

```text
  /** Translate a model/plugin path into Windows-side coordinates. */
  private translate(path: string, cwd?: string): Translated {
    const unc = parseWslUnc(path)
    if (unc !== null) {
      return { input: joinUnc(unc.distro, unc.linuxPath), cwd: this.cwdOr(cwd) }
    }
    if (isAbsoluteLinuxPath(path)) {
      // /mnt/<drive>/… names the Windows filesystem inside the Linux world
      // (the dual-access path for migration): open the drive path directly so
      // both worlds stay coherent — the display stays the /mnt form.
      const win = mntToWindowsPath(path)
      if (win !== null) return { input: win, cwd: this.cwdOr(cwd) }
      return { input: joinUnc(this.distroFor(cwd), path), cwd: this.cwdOr(cwd) }
    }
    if (windowsToMntPath(path) !== null) {
      // Windows drive paths open directly; the Linux world reaches them via /mnt.
      return { input: path, cwd: this.cwdOr(cwd) }
```

</details>

**依据 4 · 源码核查**：[src/fs.ts:226-245](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/aac3f93e1cdf29eabc0bfbb391caf06b2e8e4dd6/src/fs.ts#L226-L245)

对链接采取额外解析。

<details>
<summary>查看原文（20行）</summary>

```text
  override async resolve(path: string, opts?: { cwd?: string; signal?: AbortSignal }): Promise<FsTarget> {
    if (opts?.signal?.aborted) throw new FsError('resolve aborted', 'FS_ABORTED')
    const { input, cwd } = this.translate(path, opts?.cwd)
    const resolved = { cwd, ...opts?.signal !== undefined ? { signal: opts.signal } : {} }
    let local: FsTarget
    try {
      local = await super.resolve(input, resolved)
    } catch (error) {
      const real = await this.linkAwarePath(input, input)
      if (real === undefined) throw error
      return this.wslTarget(await super.resolve(real, resolved))
    }
    // The share resolves a link path to a *lexical* identity: `lstat` on a
    // Linux symlink fails, so the local resolver hands back the deepest
    // existing ancestor plus the remaining segments. Ask the distribution
    // before accepting that identity, or a link would be treated as a plain
    // missing file (and a write through it would escape the policy).
    const real = await this.linkAwarePath(input, String(local.targetKey))
    if (real === undefined) return this.wslTarget(local)
    return this.wslTarget(await super.resolve(real, resolved))
```

</details>

#### 缺口

- 未测试键盘检测及恢复
  **影响**：不能保证恰好一次或完整隔离
  **进一步探讨**：用无副作用样例验证重试，再核权限。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、版本和采用退路是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

package.json:104-105 要求 Node >=24；README.zh.md:28-34 列作者声称实测的 DSH 版本，但本轮未复跑。需要 Windows、可用 WSL 发行版、匹配的宿主与用户权限；环境、磁盘与维护成本未知。先备份工作目录，在隔离发行版用只读命令与样例文件核对发行版、cwd、文件访问和权限；版本不符、路径映射异常或命令状态未知时停止，并回到人工终端核状态。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:104-105](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/aac3f93e1cdf29eabc0bfbb391caf06b2e8e4dd6/package.json#L104-L105)

Node 版本。

```text
  "engines": {
    "node": ">=24"
```

**依据 2 · 作者声明**：[README.zh.md:28-34](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/aac3f93e1cdf29eabc0bfbb391caf06b2e8e4dd6/README.zh.md#L28-L34)

作者声明兼容性范围与证据。

```text
## 兼容性

这份构建声明兼容下列 DSH 版本，每一条都在隔离实例上实测过（独立 `DSH_HOME`、依赖固定到该版本、跑满整套门禁）：

`0.1.0-rc.7` · `0.1.0-rc.8` · `0.1.1-rc.1` · `0.1.1-rc.2` · `0.1.2-rc.1` · `0.1.3-alpha.2` · `0.1.5-rc.1` · `0.1.5-rc.2` · `0.1.7-rc.1` · `0.1.7-rc.2` · `0.2.0-rc.2` · `0.2.1-rc.2`

这份列表与 `package.json` 里的 `dsh.compatibility.dshReleases` 一一对应，单测会在两者不一致时失败。其中 `0.2.1-rc.2` 就是 DSH Desktop `0.2.1-rc.2` 自带的 DSH 版本——判决取自该应用**自己打包的那份宿主**（`resources/app.asar` 内），不只是 npm 上那份——所以桌面版由同一份声明覆盖；应用内帮助面板（对话框右上角「?」）会显示同一组 chip 以及插件版本。插件在运行时自动识别 DSH 版本并选用对应的 API；两边都不支持时会明确报错，而不是留下一个空工作区。版本不在列表里通常仍然可用，但未经验证。
```

**依据 3 · 源码核查**：[src/index.ts:1390-1424](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/aac3f93e1cdf29eabc0bfbb391caf06b2e8e4dd6/src/index.ts#L1390-L1424)

按工作区决定发行版。

<details>
<summary>查看原文（35行）</summary>

```text
  const shellEnv = ctx.get('shellEnv') as unknown as ShellEnvService | undefined
  if (shellEnv !== undefined) {
    ctx.effect(() => shellEnv.register({
      name: 'wsl-workspace-distro',
      variables: {
        DSH_WSL_DISTRO: {
          description: 'The WSL distribution of the calling session workspace, when the session cwd is a WSL UNC path.',
        },
        DSH_WSL_USER: {
          description: 'The Linux user of the calling session workspace, when the workspace has one configured.',
        },
      },
      resolve(execution) {
        const cwd = execution.agent?.session.header.cwd
        const unc = cwd === undefined ? null : parseWslUnc(cwd)
        if (unc !== null) {
          const username = getWorkspaceUsername(joinUnc(unc.distro, unc.linuxPath))
          return username === undefined || username === ''
            ? { DSH_WSL_DISTRO: unc.distro }
            : { DSH_WSL_DISTRO: unc.distro, DSH_WSL_USER: username }
        }
        // A Windows-drive cwd belongs to a `/mnt/<drive>` WSL workspace (9P
        // cannot serve drvfs, so those register under their drive path): the
        // stored distro drives `wsl.exe -d` for bash.
        if (cwd !== undefined && /^[A-Za-z]:[\\/]/.test(cwd)) {
          const entry = getWindowsWorkspace(cwd)
          if (entry !== undefined && entry.distro !== undefined && entry.distro !== '') {
            return entry.username === undefined || entry.username === ''
              ? { DSH_WSL_DISTRO: entry.distro }
              : { DSH_WSL_DISTRO: entry.distro, DSH_WSL_USER: entry.username }
          }
        }
        return {}
      },
    }), 'dsh-wsl-workspace: per-session distro env fact')
```

</details>

**依据 4 · 源码核查**：[src/host/wsl-bash-tool.ts:612-641](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/aac3f93e1cdf29eabc0bfbb391caf06b2e8e4dd6/src/host/wsl-bash-tool.ts#L612-L641)

输入等待可能重跑。

<details>
<summary>查看原文（30行）</summary>

```text
      const signature = args.command.replace(/\s+/g, ' ').trim()
      let tally = attempts.get(session)
      if (tally === undefined) { tally = new Map<string, number>(); attempts.set(session, tally) }
      const tried = (tally.get(signature) ?? 0) + 1
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
```

</details>

#### 缺口

- 未实测宿主、Windows 或 WSL
  **影响**：兼容与恢复成本未知
  **进一步探讨**：隔离发行版测试并备份。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否让用户在重跑前判断潜在重复副作用？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有 tty:false 已允许明确禁止自动重跑，输出也可报告重新运行；只新增开关或日志不是增量。设想向调用者展示第一次执行已发生且即将重跑的确认状态，由用户选择仅返回中断结果、在终端继续或明确允许第二次执行；依赖宿主提供可恢复交互，禁止自动推断副作用安全。对照当前自动重跑和 tty:false，测命令在提示前写文件、长任务误判与无副作用输入等待，比较重复写入、任务完成时间和人工负担；若无法安全暂停或副作用仍重复、误判及操作负担过高则否定。先核现有工具和 UI 是否已有同等确认。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/wsl-bash-tool.ts:502-505](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/aac3f93e1cdf29eabc0bfbb391caf06b2e8e4dd6/src/host/wsl-bash-tool.ts#L502-L505)

已有 tty:false 禁止自动重跑。

```text
      timeoutMs: { type: 'number', description: 'Per-call deadline in milliseconds, for a long build or install. A call that is caught waiting for keyboard input is stopped and re-run on a terminal inside the same deadline, so a longer deadline never means a longer silent wait for a prompt.' },
      tty: {
        type: 'boolean',
        description: 'Run the command on a pseudo-terminal from the start. Set true when a terminal is what the command needs (a pager whose drawing matters, a program that refuses to run without a tty). Set false to keep the ordinary pipe even if the command goes quiet waiting for input — that vetoes the automatic re-run. Left out, the tool decides by watching the process instead of its name.',
```

**依据 2 · 源码核查**：[src/host/wsl-bash-tool.ts:612-641](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/aac3f93e1cdf29eabc0bfbb391caf06b2e8e4dd6/src/host/wsl-bash-tool.ts#L612-L641)

检测后重跑同一命令。

<details>
<summary>查看原文（30行）</summary>

```text
      const signature = args.command.replace(/\s+/g, ' ').trim()
      let tally = attempts.get(session)
      if (tally === undefined) { tally = new Map<string, number>(); attempts.set(session, tally) }
      const tried = (tally.get(signature) ?? 0) + 1
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
```

</details>

**依据 3 · 源码核查**：[src/fs.ts:158-174](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/aac3f93e1cdf29eabc0bfbb391caf06b2e8e4dd6/src/fs.ts#L158-L174)

命令可能接触 Windows 文件。

<details>
<summary>查看原文（17行）</summary>

```text
  /** Translate a model/plugin path into Windows-side coordinates. */
  private translate(path: string, cwd?: string): Translated {
    const unc = parseWslUnc(path)
    if (unc !== null) {
      return { input: joinUnc(unc.distro, unc.linuxPath), cwd: this.cwdOr(cwd) }
    }
    if (isAbsoluteLinuxPath(path)) {
      // /mnt/<drive>/… names the Windows filesystem inside the Linux world
      // (the dual-access path for migration): open the drive path directly so
      // both worlds stay coherent — the display stays the /mnt form.
      const win = mntToWindowsPath(path)
      if (win !== null) return { input: win, cwd: this.cwdOr(cwd) }
      return { input: joinUnc(this.distroFor(cwd), path), cwd: this.cwdOr(cwd) }
    }
    if (windowsToMntPath(path) !== null) {
      // Windows drive paths open directly; the Linux world reaches them via /mnt.
      return { input: path, cwd: this.cwdOr(cwd) }
```

</details>

#### 缺口

- 未穷尽 UI 及宿主交互能力
  **影响**：增量与可实现性未知
  **进一步探讨**：先核现有交互，再用可控副作用对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
