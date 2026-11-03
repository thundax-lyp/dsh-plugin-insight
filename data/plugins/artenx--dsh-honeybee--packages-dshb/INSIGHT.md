# DSH HoneyBee / DSHB

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[9ae1ae2](https://github.com/Artenx/dsh-honeybee/tree/9ae1ae2f99a44da82a3312be612c3f12a42f8805/packages/dshb)

<!-- BEGIN META -->
[![npm 30d 1,500](https://img.shields.io/static/v1?label=npm+30d&message=1%2C500&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@artenx/dshb) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@artenx/dshb)
<!-- END META -->

> **功能**：在 DSH 中管理 SSH/Docker 节点并路由文件、命令与终端，提供工作区指令和多实例会话同步。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将工作区绑定统一用于文件/命令/终端，配合摘要和事件前缀校验的会话导入，属于可核查的组合设计，不证明远端隔离与恢复完成。

> **主要限制**：[Q01](#research-q01) 绑定读取异常变空并可回本机；[Q02](#research-q02) 普通SSH kill无终止动作、执行连接未接hostVerifier，上游认证被替代，透明便利必须先满足目标与中断可信。

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
  - [Q01 · bundle、绑定和装饰器如何把工作区操作送到节点，绑定异常是否能保证拒绝执行？](#detail-section-11)
  - [Q02 · SSH取消、主机身份、认证替换和会话同步分别提供什么保证？](#detail-section-12)
  - [Q03 · 什么采用条件支持当前观察结论，如何检验显式执行凭据的设计方向？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 已有多节点开发环境的维护者希望统一操作入口，合格结果须明确目标并能解释中断后的远端状态。

[Q03](#research-q03) 对照显式SSH与独立管理会话文件，减少入口选择责任的潜力未有同条件节时验证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 节点与工作区绑定 | 选择SSH/Docker目标 | 绑定读失败可回本机，须核落点 |
| 统一文件操作 | 将宿主读取/写入送往provider | 需对应节点provider，缺失时拒绝 |
| SSH命令/子进程 | 在远端执行任务 | 普通kill无终止动作，不能以UI取消证明停止 |
| SSH终端 | 提供PTY交互 | 与普通命令控制不同，实际中断未测 |
| 会话同步 | 导入事件、工作区及指令相关状态 | 摘要/前缀校验存在，不承诺整批回滚 |
| 认证门 | 以DSHB gate管理Web访问 | 替代上游认证，完整路由覆盖未审完 |

**流程与依赖**

[Q03](#research-q03) 依赖表区分宿主、bundle、SSH/Docker、同步和认证覆盖；不能只装UI根导出。

[Q03](#research-q03) 步骤表要求哨兵验证目标与取消、同步冲突检查，再以手动SSH接管。

**效果与成本**

[Q03](#research-q03) 分阶段成本包含未停止作业、部分同步与装饰还原检查，金额和人工时间未知。

[Q03](#research-q03) 效果表区分统一路由、内容完整性和普通命令可控性，不能推导实际节时。

> **思考**：[Q01](#research-q01) 绑定读取异常变空并可回本机；[Q02](#research-q02) 普通SSH kill无终止动作、执行连接未接hostVerifier，上游认证被替代，透明便利必须先满足目标与中断可信。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将工作区绑定统一用于文件/命令/终端，配合摘要和事件前缀校验的会话导入，属于可核查的组合设计，不证明远端隔离与恢复完成。

[Q02](#research-q02) 摘要和事件前缀检查可借鉴，但需要适配宿主持久化与附件；[Q01](#research-q01) 读取异常与无绑定混同削弱目标可信，router直接装饰宿主服务的还原必须另核生命周期。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q01](#research-q01) 绑定读取异常变空并可回本机；[Q02](#research-q02) 普通SSH kill无终止动作、执行连接未接hostVerifier，上游认证被替代，透明便利必须先满足目标与中断可信。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 保持观察。先用独立profile和一次性节点核哨兵落点、长任务取消及主机key变化；不接重要数据。异常时停止同步，手动SSH查进程和双方状态，备份后重启干净profile接管。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定packages/dshb组件源码定向复核；目标、取消与执行SSH主机身份缺口仍使采用保持观察，未运行目标或安全/恢复实验，新假设未验证。

- 已检查：作者 README、包清单、源码路径 packages/dshb/README.md、packages/dshb/package.json、packages/dshb/cordis.patch.yml、packages/dshb/src/index.ts、packages/dshb/src/core/index.ts、packages/dshb/src/core/workspace-bindings.ts、packages/dshb/src/router/index.ts、packages/dshb/src/router/resolve.ts、packages/dshb/src/router/decorate-fs.ts、packages/dshb/src/exec-ssh/process-provider.ts、packages/dshb/src/exec-ssh/connection.ts、packages/dshb/src/auth/index.ts、packages/dshb/src/core/sync/session-sync.ts 及固定范围 inventory；组件：packages/dshb。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅packages/dshb完整inventory，人工抽读入口、绑定、resolver、文件装饰、普通SSH/PTY、认证替换与会话摘要/前缀；未全审Docker、全部路由和归档附件。
- 下一步：未执行目标、SSH、Docker或同步；用两端哨兵核绑定损坏、节点缺失、主机key变更、普通任务取消与同步中断，检查远端而非只看UI。

**分析版本**

- **仓库**：[Artenx/dsh-honeybee](https://github.com/Artenx/dsh-honeybee)
- **版本号**：0.1.39（[固定提交 9ae1ae2](https://github.com/Artenx/dsh-honeybee/tree/9ae1ae2f99a44da82a3312be612c3f12a42f8805)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 未验证的显式执行凭据记录节点、绑定版本、路径与取消能力，将损坏绑定变拒绝态；用两端哨兵与中断矩阵对照，错误目标未减少或负担过高即否定。

未执行目标、SSH、Docker或同步；用两端哨兵核绑定损坏、节点缺失、主机key变更、普通任务取消与同步中断，检查远端而非只看UI。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 22 | — | — | 133 |
| .ts | source | 79 | 16596 | 15065 | 299 | — |
| .tsx | source | 8 | 3628 | 3247 | 176 | — |
| .ts | test | 38 | 7261 | 6557 | 28 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Artenx/dsh-honeybee/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Artenx/dsh-honeybee/issues?q=is%3Aissue+created%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Artenx/dsh-honeybee/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z)



统计日期：2026-11-03。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：透明工作区路由、远端执行与同步能否在目标、权限和中断明确的条件下代替手工SSH工作？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · bundle、绑定和装饰器如何把工作区操作送到节点，绑定异常是否能保证拒绝执行？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

本项只研究 packages/dshb，是原生DSH组合插件，不把仓库其他包混作组件规模。根导出只转发UI，实际bundle patch另外插入auth、core、router、exec-ssh、exec-docker。只加载根导出不能证明远端执行已接线。目标用户是已有SSH/Docker开发环境、希望在同一DSH会话中操作远端目录的人；相对每次显式手工SSH，绑定让文件、命令、子进程和终端复用工作区选择，减少逐次选择入口的责任，不是新增操作系统隔离。

core构建节点注册表、工作区绑定和同步服务。绑定按mirrorPath最长前缀匹配，把相对后缀拼到remotePath；resolver区分local、remote与unrouted。装饰后的文件读取等操作在remote分支交给provider，节点已有绑定但provider不可用时明确抛错，不会一概降级成本机。这是正向可靠性机制。

但绑定存储load会捕获所有读取/JSON异常并把bindings置空；resolver没有命中时则local。于是“从未绑定”和“绑定文件损坏/不可读”在这条链中合并，同一路径可能回到本机。这是静态控制流推出的目标选择风险，本轮没有制造损坏文件复现，不声称已经发生误写。该风险恰好触及透明路由的核心前提：用户越不显式指定执行节点，越需要可信的绑定状态与拒绝策略。

绑定存盘用0700目录、0600临时文件和rename，有助减少半写与无关用户读取，但不能改变读取异常的语义。只有明确区分未配置与损坏，并在每次操作能解释目标，才能把便利转成可信交付。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dshb/src/index.ts:1-1](https://github.com/Artenx/dsh-honeybee/blob/9ae1ae2f99a44da82a3312be612c3f12a42f8805/packages/dshb/src/index.ts#L1-L1)

根导出仅UI。

```text
export { name, apply, inject } from './ui/index.js'
```

**依据 2 · 源码核查**：[packages/dshb/cordis.patch.yml:9-21](https://github.com/Artenx/dsh-honeybee/blob/9ae1ae2f99a44da82a3312be612c3f12a42f8805/packages/dshb/cordis.patch.yml#L9-L21)

完整bundle分别加载各能力。

<details>
<summary>查看原文（13行）</summary>

```text
- insert:
    - id: dshb-auth
      name: "@artenx/dshb/auth"
    - id: dshb-core
      name: "@artenx/dshb/core"
    - id: dshb-router
      name: "@artenx/dshb/router"
    - id: dshb-exec-ssh
      name: "@artenx/dshb/exec-ssh"
    - id: dshb-exec-docker
      name: "@artenx/dshb/exec-docker"
    - id: dshb-ui
      name: "@artenx/dshb"
```

</details>

**依据 3 · 源码核查**：[packages/dshb/src/core/workspace-bindings.ts:33-53](https://github.com/Artenx/dsh-honeybee/blob/9ae1ae2f99a44da82a3312be612c3f12a42f8805/packages/dshb/src/core/workspace-bindings.ts#L33-L53)

读取异常置空，与持久化权限分开。

<details>
<summary>查看原文（21行）</summary>

```text
  private load(): void {
    if (this.loaded) return
    this.loaded = true
    try {
      this.bindings = (JSON.parse(readFileSync(this.file(), 'utf8')) as WorkspaceBinding[]).map((b) => ({
        ...b,
        mirrorPath: normalize(b.mirrorPath),
        remotePath: normalize(b.remotePath),
      }))
    } catch {
      this.bindings = []
    }
  }

  private save(): void {
    const file = this.file()
    mkdirSync(join(file, '..'), { recursive: true, mode: 0o700 })
    const tmp = `${file}.${process.pid}.tmp`
    writeFileSync(tmp, JSON.stringify(this.bindings, null, 2), { mode: 0o600 })
    renameSync(tmp, file)
    chmodSync(file, 0o600)
```

</details>

**依据 4 · 源码核查**：[packages/dshb/src/core/workspace-bindings.ts:76-90](https://github.com/Artenx/dsh-honeybee/blob/9ae1ae2f99a44da82a3312be612c3f12a42f8805/packages/dshb/src/core/workspace-bindings.ts#L76-L90)

最长前缀与远端后缀映射。

<details>
<summary>查看原文（15行）</summary>

```text
  resolve(path: string): BindingHit | undefined {
    this.load()
    const target = normalize(path)
    let best: WorkspaceBinding | undefined
    for (const b of this.bindings) {
      const root = normalize(b.mirrorPath)
      if (target === root || target.startsWith(`${root}/`)) {
        if (!best || root.length > normalize(best.mirrorPath).length) best = b
      }
    }
    if (!best) return undefined
    const root = normalize(best.mirrorPath)
    const remoteRoot = normalize(best.remotePath)
    const suffix = target === root ? '' : target.slice(root.length)
    return { nodeId: best.nodeId, remotePath: normalize(`${remoteRoot}${suffix}`) }
```

</details>

**依据 5 · 源码核查**：[packages/dshb/src/router/resolve.ts:8-34](https://github.com/Artenx/dsh-honeybee/blob/9ae1ae2f99a44da82a3312be612c3f12a42f8805/packages/dshb/src/router/resolve.ts#L8-L34)

无绑定本地，已绑定无provider为unrouted。

<details>
<summary>查看原文（27行）</summary>

```text
export function resolveWorld(absPath: string, bindings?: WorkspaceBindings): { kind: 'local' } | ({ kind: 'remote' } & BindingHit) {
  if (!bindings) return { kind: 'local' }
  const hit = bindings.resolve(absPath)
  if (!hit) return { kind: 'local' }
  return { kind: 'remote', ...hit }
}

export class WorldResolver {
  private bindings?: WorkspaceBindings
  private registries: WorldRegistry[] = []

  setBindings(bindings: WorkspaceBindings): void {
    this.bindings = bindings
  }

  setRegistry(registry: WorldRegistry): void {
    this.registries.push(registry)
  }

  resolve(absPath: string): WorldRef {
    const r = resolveWorld(absPath, this.bindings)
    if (r.kind === 'local') return { kind: 'local' }
    for (const reg of this.registries) {
      const provider = reg.get(r.nodeId)
      if (provider) return { kind: 'remote', provider, remotePath: r.remotePath }
    }
    return { kind: 'unrouted', nodeId: r.nodeId }
```

</details>

**依据 6 · 源码核查**：[packages/dshb/src/router/decorate-fs.ts:25-44](https://github.com/Artenx/dsh-honeybee/blob/9ae1ae2f99a44da82a3312be612c3f12a42f8805/packages/dshb/src/router/decorate-fs.ts#L25-L44)

真实文件API分派及unrouted拒绝。

<details>
<summary>查看原文（20行）</summary>

```text
  fs.stat = async (target: FsTarget, signal?: AbortSignal): Promise<FsInfo | undefined> => {
    const ref = resolver.resolve(targetPath(target))
    if (ref.kind === 'local') return origStat(target, signal)
    if (ref.kind === 'unrouted') throw new Error(`node ${ref.nodeId} world not available`)
    return ref.provider.fs.stat(ref.remotePath, signal) as Promise<FsInfo | undefined>
  }

  fs.lstat = async (path: string, opts?: { cwd?: string }, signal?: AbortSignal): Promise<FsPathInfo | undefined> => {
    const resolved = await fs.resolve(path, { cwd: opts?.cwd, signal })
    const ref = resolver.resolve(fs.processPath(resolved))
    if (ref.kind === 'local') return origLstat(path, opts, signal)
    if (ref.kind === 'unrouted') throw new Error(`node ${ref.nodeId} world not available`)
    return ref.provider.fs.lstat(ref.remotePath, opts, signal) as Promise<FsPathInfo | undefined>
  }

  fs.readText = async (target: FsTarget, signal?: AbortSignal): Promise<string> => {
    const ref = resolver.resolve(targetPath(target))
    if (ref.kind === 'local') return origReadText(target, signal)
    if (ref.kind === 'unrouted') throw new Error(`node ${ref.nodeId} world not available`)
    return ref.provider.fs.readText(ref.remotePath, signal)
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · SSH取消、主机身份、认证替换和会话同步分别提供什么保证？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

普通SSH shell与subprocess取消是当前最影响采用的缺口。resolve保留signal与timeoutMs等请求字段，但run调用executor.exec时并未传递这些控制字段，返回timedOut=false、aborted=false；start与spawn的kill只执行void promise。不能把调用kill理解为远端命令已经终止，不能把false结果字段当成真实超时观察。PTY有独立terminate路径，不能将其能力推广到普通命令。

SSH连接配置含host/port/username和认证材料，没有给ssh2连接设置hostVerifier或把已存主机指纹送入该配置；错误分类函数识别hostkey文字不等于实际验证主机身份。core中存在KnownHostsStore，不足以证明执行连接使用了它。对于重要数据或未知网络节点，应先解决执行链主机身份与取消，不把“SSH加密”当目标正确的充分条件。

认证模块通过自己的gate装饰WebServer，并把上游browserAuth.isAuthenticated替换为返回true，目的是让DSHB成为唯一认证门。这个设计是替换而非再增加一层上游认证，需要逐路验证DSHB gate覆盖及生命周期还原；只看登录页不能证明公网安全。根README还声明桌面loopback自动允许，其前提是对本机访问边界的信任，不能推成多租户隔离。

会话同步有值得借鉴的完整性机制。对象写入核expectedBytes与sha256后sync/rename；已有session先比header与继承数，再核事件前缀，只有一致才追加后缀。这减少把不同会话覆盖成同一结果的风险，不能自动保证整批事务全回滚。applyPrepared还会恢复指令、更新workspace/session状态，失败后仍需检查journal和双方已完成部分。本次只定向审这些关键机制，未逐层覆盖Docker后端、离线归档、全部附件与认证路由，不作全面安全结论。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dshb/src/exec-ssh/process-provider.ts:21-44](https://github.com/Artenx/dsh-honeybee/blob/9ae1ae2f99a44da82a3312be612c3f12a42f8805/packages/dshb/src/exec-ssh/process-provider.ts#L21-L44)

普通shell未传控制参数，kill无远端终止动作。

<details>
<summary>查看原文（24行）</summary>

```text
  async run(spec: ShellExecSpec): Promise<ShellRunResult> {
    const result = await this.executor.exec(['sh', '-c', spec.command], spec.workdir, (spec.env ?? {}) as Record<string, string>, spec.stdin !== undefined ? Buffer.from(spec.stdin) : undefined)
    const collect = (text: string): CollectedOutput => ({ text, truncated: false })
    return {
      exitCode: result.code,
      signal: (result.signal ?? null) as NodeJS.Signals | null,
      timedOut: false,
      aborted: false,
      timeoutMs: spec.timeoutMs,
      stdout: collect(result.stdout),
      stderr: collect(result.stderr),
    } as unknown as ShellRunResult
  }

  start(spec: ShellExecSpec): ShellProcess {
    const promise = this.run(spec)
    const proc: ShellProcess = {
      pid: -1,
      done: promise,
      kill: () => {
        void promise
      },
    } as unknown as ShellProcess
    return proc
```

</details>

**依据 2 · 源码核查**：[packages/dshb/src/exec-ssh/process-provider.ts:69-78](https://github.com/Artenx/dsh-honeybee/blob/9ae1ae2f99a44da82a3312be612c3f12a42f8805/packages/dshb/src/exec-ssh/process-provider.ts#L69-L78)

subprocess kill同样只保留promise。

<details>
<summary>查看原文（10行）</summary>

```text
  spawn(spec: SubprocessSpawnSpec): SubprocessHandle {
    const promise = this.executor.exec(spec.argv as string[], spec.cwd, (spec.env ?? {}) as Record<string, string>)
    const handle: SubprocessHandle = {
      pid: -1,
      done: promise.then((r) => ({ exitCode: r.code, signal: (r.signal ?? null) as NodeJS.Signals | null })),
      kill: () => {
        void promise
      },
    } as unknown as SubprocessHandle
    return handle
```

</details>

**依据 3 · 源码核查**：[packages/dshb/src/exec-ssh/connection.ts:58-81](https://github.com/Artenx/dsh-honeybee/blob/9ae1ae2f99a44da82a3312be612c3f12a42f8805/packages/dshb/src/exec-ssh/connection.ts#L58-L81)

执行连接配置不包含hostVerifier。

<details>
<summary>查看原文（24行）</summary>

```text
function buildConnectConfig(target: SshTarget, secrets: SshSecrets): ConnectConfig {
  const cfg: ConnectConfig = {
    host: target.host,
    port: target.port,
    username: target.username,
    readyTimeout: HANDSHAKE_TIMEOUT_MS,
    keepaliveInterval: 0,
    keepaliveCountMax: 3,
  }
  switch (target.auth.kind) {
    case 'password':
      if (secrets.password) cfg.password = secrets.password
      break
    case 'key':
      if (secrets.privateKey) {
        cfg.privateKey = secrets.privateKey
        if (secrets.passphrase) cfg.passphrase = secrets.passphrase
      }
      break
    case 'agent':
      cfg.agent = process.env.SSH_AUTH_SOCK ?? undefined
      break
  }
  return cfg
```

</details>

**依据 4 · 源码核查**：[packages/dshb/src/core/index.ts:32-39](https://github.com/Artenx/dsh-honeybee/blob/9ae1ae2f99a44da82a3312be612c3f12a42f8805/packages/dshb/src/core/index.ts#L32-L39)

KnownHostsStore存在不等于执行连接使用。

```text
export function apply(ctx: Context): void {
  const knownHosts = new KnownHostsStore()
  const registry = new NodeRegistry(ctx)
  const bindings = new WorkspaceBindingsStore()
  const syncPeers = new SyncPeerStore()
  const syncState = new SyncStateStore()
  const syncPeerManager = new SyncPeerManager(syncPeers, syncState, ctx.credentials as never)
  const syncSshTransport = new SyncSshTransport(syncPeerManager)
```

**依据 5 · 源码核查**：[packages/dshb/src/auth/index.ts:74-105](https://github.com/Artenx/dsh-honeybee/blob/9ae1ae2f99a44da82a3312be612c3f12a42f8805/packages/dshb/src/auth/index.ts#L74-L105)

DSHB gate接线和上游认证替换。

<details>
<summary>查看原文（32行）</summary>

```text
export function apply(ctx: Context): void {
  const store = sharedCredentialStore()
  const gate = new AuthGate(store)
  ctx.effect(() => decorateWebServer(ctx.webServer, store, gate))
  registerFrontendBootRaceWorkaround(ctx)
  ctx.effect(() => ctx.webServer.tapIndex(installLoopbackCompat))
  registerAuthRoutes(ctx, store, new LoginRateLimiter())

  // DSH 0.1.5 introduced a browser-auth fence on the connection package: the SPA
  // fallback calls connection.authorizeIndex() on "/" (mints/checks DSH's own
  // launch-token cookie), and /api routes run requestRejection() which 401s when
  // that DSH cookie is absent. DSHB uses its own session cookie and must stay the
  // sole auth gate (DSH 0.1.1 had no such connection fence, so DSHB worked there).
  // Neutralize the connection's browserAuth.isAuthenticated check so DSH's fence
  // never rejects a DSHB-authenticated (or loopback) request; DSHB's gate still
  // rejects unauthenticated access to gated routes. Property is read at request
  // time, so installing it once after connection is ready suffices.
  ctx.inject(['connection'], (connCtx: Context) => {
    connCtx.effect(() => {
      const conn = (connCtx as unknown as {
        connection?: {
          browserAuth?: { isAuthenticated?: (...a: unknown[]) => unknown; __dshbNeutralized?: true }
          requestRejection?: (request: IncomingMessage) => number | undefined
        }
      }).connection
      const auth = conn?.browserAuth
      const originalIsAuthenticated = auth?.isAuthenticated
      const neutralizedIsAuthenticated = () => true
      let installedNeutralizer = false
      if (auth && typeof originalIsAuthenticated === 'function' && !auth.__dshbNeutralized) {
        auth.isAuthenticated = neutralizedIsAuthenticated
        auth.__dshbNeutralized = true
```

</details>

**依据 6 · 源码核查**：[packages/dshb/src/core/sync/session-sync.ts:275-285](https://github.com/Artenx/dsh-honeybee/blob/9ae1ae2f99a44da82a3312be612c3f12a42f8805/packages/dshb/src/core/sync/session-sync.ts#L275-L285)

对象字节/摘要校验后提交。

<details>
<summary>查看原文（11行）</summary>

```text
      async commit(): Promise<void> {
        if (written !== expectedBytes || `sha256:${hash.digest('hex')}` !== digest) {
          await closeHandle()
          try {
            await unlink(temporary)
          } catch {}
          throw new SyncSessionError('object-integrity', 'session object stream digest mismatch')
        }
        await handle.sync()
        await closeHandle()
        await rename(temporary, file)
```

</details>

**依据 7 · 源码核查**：[packages/dshb/src/core/sync/session-sync.ts:3326-3355](https://github.com/Artenx/dsh-honeybee/blob/9ae1ae2f99a44da82a3312be612c3f12a42f8805/packages/dshb/src/core/sync/session-sync.ts#L3326-L3355)

session header与事件前缀校验再追加。

<details>
<summary>查看原文（30行）</summary>

```text
  private async writeSession(prepared: PreparedSyncSession): Promise<boolean> {
    const persistence = this.requirePersistence()
    const existed = await persistence.stat(prepared.localSessionId)
    const handle = existed
      ? await persistence.open(prepared.localSessionId, 'write')
      : await persistence.create(prepared.header, prepared.header.isSeeded ? { inheritedEventCount: prepared.inheritedEventCount } : undefined)
    try {
      if (canonicalJson(handle.header) !== canonicalJson(prepared.header) || handle.inheritedEventCount !== prepared.inheritedEventCount) {
        throw new SyncSessionError('session-id-conflict', '目标 session ID 已被其他 header 占用')
      }
      const existing: SessionEvent[] = []
      for (let offset = 0; ; ) {
        const page = await handle.read(offset, SESSION_READ_PAGE_SIZE)
        if (page.events.length === 0) break
        existing.push(...page.events)
        offset += page.events.length
        if (page.events.length < SESSION_READ_PAGE_SIZE) break
      }
      if (existing.length > prepared.events.length) throw new SyncSessionError('session-prefix-conflict', `目标 session ${prepared.localSessionId} 前缀比导入记录更长（本地 ${existing.length}，导入 ${prepared.events.length}）`)
      for (let index = 0; index < existing.length; index += 1) {
        if (canonicalJson(existing[index]) !== canonicalJson(prepared.events[index])) {
          throw new SyncSessionError('session-prefix-conflict', `目标 session ${prepared.localSessionId} 的已提交事件与导入前缀不同（首个差异位置 seq=${existing[index]?.seq}，本地 ${existing.length} 事件，导入 ${prepared.events.length} 事件）`)
        }
      }
      for (let offset = existing.length; offset < prepared.events.length; offset += SESSION_READ_PAGE_SIZE) {
        await handle.append(prepared.events.slice(offset, Math.min(offset + SESSION_READ_PAGE_SIZE, prepared.events.length)))
      }
      await handle.flush()
    } finally {
      await handle.close()
```

</details>

#### 缺口

- 未穷尽全部gate路由、Docker后端、离线归档与附件
  **影响**：不能支持公网持续使用、容器隔离或所有同步成功的结论
  **进一步探讨**：按具体部署补查认证覆盖、Docker权限与归档路径，再做拒绝/中断实验。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么采用条件支持当前观察结论，如何检验显式执行凭据的设计方向？

**研究主题**：效果与总成本、采用判断、新假设与验证、贡献与相对优势、依赖、兼容与流程

#### 完整回答

当前建议观察，先不把重要数据交给透明路由。多节点维护者可用独立profile和一次性节点做评估，但在绑定读失败回本机、普通命令取消无效及主机验证接线未明确前，不把这种评估称为可持续采用的试用。原方法是明确SSH目标、通过系统SSH核key并由操作者负责进程和文件状态；它步骤多，却让目标和权限显式可见。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22.13及DSH宿主服务 | 启动必需 | 加载组合及API装饰 | 包内compatibility与peer范围须核实际profile，不能只看一处 |
| bundle各子入口与工作区绑定 | 远端能力必需 | 统一选择节点 | 根UI不等于执行，绑定异常可能走本机 |
| SSH账号/凭据/远端工具 | SSH操作必需 | 文件与命令访问 | 连接失败由用户处理，普通取消不能确认终止 |
| Docker daemon、镜像与权限 | Docker操作必需 | 容器执行 | 本次未完整审，不能假定隔离已成立 |
| persistence、附件和peer服务 | 同步特定操作必需 | 会话及指令恢复 | 冲突或部分失败需查两端及journal |
| DSHB gate覆盖与可信本机环境 | 认证部署必需 | 替代宿主认证 | 公网/多用户使用尚无充分验收 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者备份profile、绑定和节点数据 | 两端哨兵及可手动SSH接管 |
| 加载 | 按README加载bundle后重启 | auth/core/router/执行子入口同时就绪 |
| 路由核对 | 维护者只读两端不同哨兵 | 目标不可解释时停止，不做重要写入 |
| 中断评估 | 一次性长任务、取消与主机key替换 | 远端进程/拒绝结果可证；不以UI结束为终止 |
| 同步评估与退出 | 只同步小样、检查前缀冲突后停用 | 查journal与两端状态，干净profile或手动SSH接管 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 节点、网络和模型费用未知 | 凭据、binding、版本和路由验证 | 无安装计时与真实需求频率 |
| 持续使用 | 远端计算、存储和同步流量 | 维护主机key、指令与节点状态 | 无合格任务成本比较 |
| 失败恢复 | 未终止作业与部分同步可能继续消耗 | 核进程、journal和双方内容 | 不保证整批回滚或自动取消 |
| 升级与退出 | 备份和保留副本资源 | 核API装饰还原并重启干净profile | 仅停用UI不证明原服务已还原 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 工作区统一路由 | 绑定复用到宿主操作 | 错目标率、实际节时 |
| 会话完整性 | 摘要与前缀校验 | 全部失败恢复与冲突处理结果 |
| 任务控制 | PTY和普通命令有不同取消实现 | 普通远端作业可控终止不成立 |

可探索每次操作携带可核对的执行凭据，包含节点身份、绑定版本、远端路径与取消能力；绑定损坏作为拒绝态，不能与无绑定混同。现有resolver已有remote/unrouted区分、UI节点信息是基础，新增应聚焦“读失败仍不误落本地”和取消结果可解释，不重复已有列表。最小实验固定两端哨兵，对照当前路由与显式凭据方案，注入绑定损坏、provider缺失、key变化和长任务中断，观察错误目标、未停止进程、恢复时间及确认负担。如果仍有错误目标，或没有减少残留/恢复负担，否定该设计。它是未验证方向，不能计入当前贡献。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dshb/README.md:5-20](https://github.com/Artenx/dsh-honeybee/blob/9ae1ae2f99a44da82a3312be612c3f12a42f8805/packages/dshb/README.md#L5-L20)

安装重启与声明环境。

<details>
<summary>查看原文（16行）</summary>

````text
## Install

```sh
dsh plugin --profile web add @artenx/dshb
```

Restart the corresponding DSH Web profile after installation.

Desktop app: install from **Settings → Plugins → More** in the DSH desktop app; the plugin takes effect on next startup.

The Authentication settings entry appears in the browser-based Web app. The DSH desktop shell uses the `dsh-app://` protocol and omits this entry; its loopback requests are admitted automatically.

## Requirements

- Node.js 22.13 or newer
- DeepSeek Harness 0.1.7-rc.1 or 0.2.1-rc.2 (Web or Desktop)
````

</details>

**依据 2 · 源码核查**：[packages/dshb/src/router/resolve.ts:8-34](https://github.com/Artenx/dsh-honeybee/blob/9ae1ae2f99a44da82a3312be612c3f12a42f8805/packages/dshb/src/router/resolve.ts#L8-L34)

已有目标状态也是假设基线。

<details>
<summary>查看原文（27行）</summary>

```text
export function resolveWorld(absPath: string, bindings?: WorkspaceBindings): { kind: 'local' } | ({ kind: 'remote' } & BindingHit) {
  if (!bindings) return { kind: 'local' }
  const hit = bindings.resolve(absPath)
  if (!hit) return { kind: 'local' }
  return { kind: 'remote', ...hit }
}

export class WorldResolver {
  private bindings?: WorkspaceBindings
  private registries: WorldRegistry[] = []

  setBindings(bindings: WorkspaceBindings): void {
    this.bindings = bindings
  }

  setRegistry(registry: WorldRegistry): void {
    this.registries.push(registry)
  }

  resolve(absPath: string): WorldRef {
    const r = resolveWorld(absPath, this.bindings)
    if (r.kind === 'local') return { kind: 'local' }
    for (const reg of this.registries) {
      const provider = reg.get(r.nodeId)
      if (provider) return { kind: 'remote', provider, remotePath: r.remotePath }
    }
    return { kind: 'unrouted', nodeId: r.nodeId }
```

</details>

**依据 3 · 源码核查**：[packages/dshb/src/core/workspace-bindings.ts:33-44](https://github.com/Artenx/dsh-honeybee/blob/9ae1ae2f99a44da82a3312be612c3f12a42f8805/packages/dshb/src/core/workspace-bindings.ts#L33-L44)

绑定损坏与未绑定混同的依据。

<details>
<summary>查看原文（12行）</summary>

```text
  private load(): void {
    if (this.loaded) return
    this.loaded = true
    try {
      this.bindings = (JSON.parse(readFileSync(this.file(), 'utf8')) as WorkspaceBinding[]).map((b) => ({
        ...b,
        mirrorPath: normalize(b.mirrorPath),
        remotePath: normalize(b.remotePath),
      }))
    } catch {
      this.bindings = []
    }
```

</details>

**依据 4 · 源码核查**：[packages/dshb/src/exec-ssh/process-provider.ts:21-44](https://github.com/Artenx/dsh-honeybee/blob/9ae1ae2f99a44da82a3312be612c3f12a42f8805/packages/dshb/src/exec-ssh/process-provider.ts#L21-L44)

普通取消关键限制影响采用。

<details>
<summary>查看原文（24行）</summary>

```text
  async run(spec: ShellExecSpec): Promise<ShellRunResult> {
    const result = await this.executor.exec(['sh', '-c', spec.command], spec.workdir, (spec.env ?? {}) as Record<string, string>, spec.stdin !== undefined ? Buffer.from(spec.stdin) : undefined)
    const collect = (text: string): CollectedOutput => ({ text, truncated: false })
    return {
      exitCode: result.code,
      signal: (result.signal ?? null) as NodeJS.Signals | null,
      timedOut: false,
      aborted: false,
      timeoutMs: spec.timeoutMs,
      stdout: collect(result.stdout),
      stderr: collect(result.stderr),
    } as unknown as ShellRunResult
  }

  start(spec: ShellExecSpec): ShellProcess {
    const promise = this.run(spec)
    const proc: ShellProcess = {
      pid: -1,
      done: promise,
      kill: () => {
        void promise
      },
    } as unknown as ShellProcess
    return proc
```

</details>

**依据 5 · 源码核查**：[packages/dshb/src/core/sync/session-sync.ts:3344-3355](https://github.com/Artenx/dsh-honeybee/blob/9ae1ae2f99a44da82a3312be612c3f12a42f8805/packages/dshb/src/core/sync/session-sync.ts#L3344-L3355)

同步前缀冲突需解释而非盲重试。

<details>
<summary>查看原文（12行）</summary>

```text
      if (existing.length > prepared.events.length) throw new SyncSessionError('session-prefix-conflict', `目标 session ${prepared.localSessionId} 前缀比导入记录更长（本地 ${existing.length}，导入 ${prepared.events.length}）`)
      for (let index = 0; index < existing.length; index += 1) {
        if (canonicalJson(existing[index]) !== canonicalJson(prepared.events[index])) {
          throw new SyncSessionError('session-prefix-conflict', `目标 session ${prepared.localSessionId} 的已提交事件与导入前缀不同（首个差异位置 seq=${existing[index]?.seq}，本地 ${existing.length} 事件，导入 ${prepared.events.length} 事件）`)
        }
      }
      for (let offset = existing.length; offset < prepared.events.length; offset += SESSION_READ_PAGE_SIZE) {
        await handle.append(prepared.events.slice(offset, Math.min(offset + SESSION_READ_PAGE_SIZE, prepared.events.length)))
      }
      await handle.flush()
    } finally {
      await handle.close()
```

</details>

#### 缺口

- 显式执行凭据方案及同任务人工负担未验证
  **影响**：不能将新设计宣传为已有可靠性或节时
  **进一步探讨**：按本题隔离故障矩阵与手工SSH对照，记录落点、远端进程和恢复投入。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
