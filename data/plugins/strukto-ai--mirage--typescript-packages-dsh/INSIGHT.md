# Mirage DSH Providers

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[de31179](https://github.com/strukto-ai/mirage/tree/de311792e60fe6f7edb6e18cb5411a843b4849db/typescript/packages/dsh)

<!-- BEGIN META -->
[![GitHub ★ 3,759](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C759&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/strukto-ai/mirage) [![npm 30d 1,152](https://img.shields.io/static/v1?label=npm+30d&message=1%2C152&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@struktoai/mirage-dsh) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@struktoai/mirage-dsh)
<!-- END META -->

> **功能**：为 DSH 的文件和 shell provider 接入 Mirage 工作区。

> **亮点**：把两个 DSH provider 接到同一虚拟路径空间；Mirage 平台功能不归子组件。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：单次 VFS 操作不能在内部取消，spill 可能失败；无 approver 保持待决而不是自动通过。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · DSH 适配器相比原生文件和 shell 提供什么？](#detail-section-11)
  - [Q02 · 文件、shell 和大输出如何保持同一世界？](#detail-section-12)
  - [Q03 · 权限和审批是否与原生行为完全相同？](#detail-section-13)
  - [Q04 · 怎样安全试用和退出？](#detail-section-14)
  - [Q05 · 如何验证虚拟世界一致性？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望 DSH 操作 Mirage 挂载工作区的平台开发者；基线为原生文件和 shell。[Q01](#research-q01)

使用 DSH 原生文件系统、shell 和宿主审批。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 虚拟文件 | 接入工作区 | 单次 VFS 取消有限 |
| 虚拟 shell | 同一路径执行命令 | 默认临时 session |
| 审批与 spill | 对接授权与长输出 | 缺 approver 待决 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 兼容 DSH 和 Node | 必需 | provider 宿主 | 不加载 |
| Mirage workspace | 必需 | 虚拟文件与 shell | 停止配置 |
| 正确挂载及审批 | 真实数据需要 | 权限与操作 | 不接真实数据 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 准备 | 独立 profile 配置假源 | 确认路径 |
| 核查 | 用 fs 与 shell 操作同样本 | 一致后继续 |
| 退出 | 移除 provider | 恢复原生行为 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | workspace 与 runtime 资源 | 挂载配置 | 宿主未测 |
| 持续 | 后端调用费用未知 | 审查权限与路径 | 效率未测 |
| 恢复 | spill 和远端资源 | 处理取消与不一致 | 单次 VFS 可能继续 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 同一路径 | fs 与 shell 接 workspace | 所有后端一致 |
| 审批 | 未提供 approver 保持待决 | 实际宿主交互 |

> **思考**：单次 VFS 操作不能在内部取消，spill 可能失败；无 approver 保持待决而不是自动通过。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把两个 DSH provider 接到同一虚拟路径空间；Mirage 平台功能不归子组件。[Q01](#research-q01) [Q02](#research-q02)

单次 VFS 操作的取消仅边界检查；缺 approver 保持待决，spill 写入失败可能不可恢复。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

单次 VFS 操作不能在内部取消，spill 可能失败；无 approver 保持待决而不是自动通过。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在独立 profile 验证只读挂载、长输出和审批；不一致则回原生 provider。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子组件源码支持共享 workspace 与审批映射；未运行宿主或根平台。

- 已检查：作者 README、包清单、源码路径 typescript/packages/dsh/package.json、typescript/packages/dsh/src/fs.ts、typescript/packages/dsh/src/shell.ts、typescript/packages/dsh/src/spill.ts、typescript/packages/dsh/src/approval.ts 及固定范围 inventory；组件：typescript/packages/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定子组件 inventory 27 个指定扩展名文件、无排除或解析错误；仅核查子组件源码，未运行或引用根实现。
- 下一步：固定宿主与平台，以只读样本核验路径、spill、取消和审批。

**分析版本**

- **仓库**：[strukto-ai/mirage](https://github.com/strukto-ai/mirage)
- **版本号**：0.0.8-alpha.2（[固定提交 de31179](https://github.com/strukto-ai/mirage/tree/de311792e60fe6f7edb6e18cb5411a843b4849db)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：非破坏性检查 fs、shell、spill 和审批的一致性可减少错配；须对照现有共享分发验证。[Q05](#research-q05)

固定宿主与平台，以只读样本核验路径、spill、取消和审批。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 338 | — | — | 4484 |
| .ts | test | 10 | 3618 | 3051 | 260 | — |
| .ts | source | 16 | 3262 | 1934 | 1145 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/strukto-ai/mirage/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Mirage DSH provider 如何连接文件、shell 和审批，其隔离与取消边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH 适配器相比原生文件和 shell 提供什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

希望 DSH 使用 Mirage 挂载工作区的开发者可通过该子包替换 ctx.fs 与 ctx.shell；相对原生文件系统和 shell，增量是让两者走同一虚拟路径空间。Mirage 工作区和后端能力来自独立平台，不能归为适配器新增算法；单一普通本地项目可能无需替换。

#### 证据与依据

**依据 1 · 源码核查**：[typescript/packages/dsh/package.json:1-5](https://github.com/strukto-ai/mirage/blob/de311792e60fe6f7edb6e18cb5411a843b4849db/typescript/packages/dsh/package.json#L1-L5)

子包身份与 provider 描述。

```text
{
  "name": "@struktoai/mirage-dsh",
  "version": "0.0.8-alpha.2",
  "description": "DeepSeek Harness (dsh) providers backed by a mirage workspace: ctx.fs and ctx.shell over mounts",
  "homepage": "https://github.com/strukto-ai/mirage#readme",
```

**依据 2 · 源码核查**：[typescript/packages/dsh/src/fs.ts:165-171](https://github.com/strukto-ai/mirage/blob/de311792e60fe6f7edb6e18cb5411a843b4849db/typescript/packages/dsh/src/fs.ts#L165-L171)

文件系统与 shell 共用虚拟工作区。

```text
/**
 * Mirage-backed implementation of `ctx.fs`. Targets are canonical virtual
 * paths (namespace symlinks followed), every operation walks the workspace
 * dispatcher — session grants, admission policies, cache read-through and
 * post-write invalidation all fire exactly as they do for a shell command —
 * and `processPath` answers in the same virtual path space the mirage shell
 * executes in, so the two providers share one execution world.
```

#### 缺口

- 未运行 DSH、Mirage 或外部数据源
  **影响**：无法证明路径一致、审批和运行时隔离
  **进一步探讨**：隔离 profile 验证 fs、shell、spill 和审批

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件、shell 和大输出如何保持同一世界？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

文件 provider 将操作交给 workspace dispatcher 并解析虚拟路径；shell 默认每个命令使用临时 fork，配置具名 session 才保持 cwd 和环境。大输出可写到同一 workspace 的 spill 文件，但配置目录不可写时可能无法恢复完整输出；取消信号只在适配边界检查，单次远端 VFS 操作内部不能中断。该源码体现适配，不证明每个后端语义一致。

#### 证据与依据

**依据 1 · 源码核查**：[typescript/packages/dsh/src/fs.ts:165-177](https://github.com/strukto-ai/mirage/blob/de311792e60fe6f7edb6e18cb5411a843b4849db/typescript/packages/dsh/src/fs.ts#L165-L177)

共享路径及单次操作取消边界。

<details>
<summary>查看原文（13行）</summary>

```text
/**
 * Mirage-backed implementation of `ctx.fs`. Targets are canonical virtual
 * paths (namespace symlinks followed), every operation walks the workspace
 * dispatcher — session grants, admission policies, cache read-through and
 * post-write invalidation all fire exactly as they do for a shell command —
 * and `processPath` answers in the same virtual path space the mirage shell
 * executes in, so the two providers share one execution world.
 *
 * One limit worth stating: mirage's `ws.vfs` takes no `AbortSignal`, so
 * cancellation is honored at this adapter's own boundaries (before a
 * dispatch, between listing entries) and not inside a single op. A long
 * read from a remote backend therefore runs to completion after the
 * signal fires, and the caller learns of the abort when it returns.
```

</details>

**依据 2 · 源码核查**：[typescript/packages/dsh/src/shell.ts:484-493](https://github.com/strukto-ai/mirage/blob/de311792e60fe6f7edb6e18cb5411a843b4849db/typescript/packages/dsh/src/shell.ts#L484-L493)

默认 fork 与具名 session。

<details>
<summary>查看原文（10行）</summary>

```text
 * CLIs, the policy layer) against the shared `ctx.mirage` workspace, so a
 * path from `ctx.fs` means the same file here. There is no OS process
 * behind a command: `signal` in results is a compatibility value for kills,
 * and abort/timeout act cooperatively at the executor's own boundaries.
 *
 * Every command runs in an ephemeral fork of the workspace's default
 * session, so no shell state survives from one call to the next, matching
 * the one-shot contract of dsh's bash tool. Configuring a `sessionId`
 * binds all commands to one named session instead, whose cwd, exports,
 * and functions persist across calls.
```

</details>

**依据 3 · 源码核查**：[typescript/packages/dsh/src/shell.ts:550-574](https://github.com/strukto-ai/mirage/blob/de311792e60fe6f7edb6e18cb5411a843b4849db/typescript/packages/dsh/src/shell.ts#L550-L574)

spill 使用 workspace 与失败日志。

<details>
<summary>查看原文（25行）</summary>

```text

  // A spill sink for one background command, or null when no spill
  // directory is configured. The target reaches the live workspace so
  // the full stream lands on a mount the agent can read back.
  private newSpill(): SpillSink | null {
    const dir = this.spillDir
    if (dir === undefined) return null
    const target: SpillTarget = {
      ensureDir: async (d) => {
        const ws = await this.workspace()
        await ensureDirPath({ exists: (p) => ws.vfs.exists(p), mkdir: (p) => ws.vfs.mkdir(p) }, d)
      },
      write: async (p, bytes) => {
        const ws = await this.workspace()
        await ws.vfs.write(p, bytes)
      },
      append: async (p, bytes) => {
        const ws = await this.workspace()
        await ws.vfs.append(p, bytes)
      },
    }
    spillCounter += 1
    const log = this.ctx.logger('mirage-dsh')
    return new SpillSink(target, dir, `mirage-shell-${spillCounter.toString()}`, (err: unknown) => {
      log.debug('spill to %s failed, output will not be recoverable: %o', dir, err)
```

</details>

**依据 4 · 源码核查**：[typescript/packages/dsh/src/spill.ts:63-74](https://github.com/strukto-ai/mirage/blob/de311792e60fe6f7edb6e18cb5411a843b4849db/typescript/packages/dsh/src/spill.ts#L63-L74)

大输出落盘意图和写入失败。

<details>
<summary>查看原文（12行）</summary>

```text
/**
 * Keeps the full, uncapped stdout and stderr of one command in workspace
 * files so a reader can recover output the delta budget dropped.
 *
 * Memory stays bounded: each channel buffers in memory only until the
 * delivered delta first overruns its budget, at which point `begin()`
 * flushes both buffers to their files and every later chunk appends
 * straight to the file. A write failure (no writable mount at the
 * configured path) disables the sink and leaves the paths undefined, the
 * honest "no safe path available" answer, so the process still streams,
 * just without a spill to point at.
 */
```

</details>

#### 缺口

- 未运行 DSH、Mirage 或外部数据源
  **影响**：无法证明路径一致、审批和运行时隔离
  **进一步探讨**：隔离 profile 验证 fs、shell、spill 和审批

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 权限和审批是否与原生行为完全相同？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

只有 vfsOnly 时文件 provider 声明 workspace-write，否则不宣称该约束；目录无效时可能回退配置的虚拟 cwd。审批桥区分拒绝、取消、不可用与没有 approver：前几种拒绝，没有 approver 返回 null 保持待决，而非自动批准。虚拟挂载和 runtime 本身仍需正确配置；统一 provider 不证明外部源隔离或取消即时生效。

#### 证据与依据

**依据 1 · 源码核查**：[typescript/packages/dsh/src/fs.ts:232-243](https://github.com/strukto-ai/mirage/blob/de311792e60fe6f7edb6e18cb5411a843b4849db/typescript/packages/dsh/src/fs.ts#L232-L243)

vfsOnly 约束声明。

<details>
<summary>查看原文（12行）</summary>

```text

  /**
   * The same confinement claim `MirageShellExecutor` makes, off the same
   * fact and for the same reason: with every runtime reaching only the
   * vfs, a mutation cannot land anywhere but a mount, under its mode.
   *
   * The two seams sit over one world, so answering differently here
   * would let dsh fence a bash write and wave an identical `ctx.fs`
   * write straight through.
   */
  override get sandboxMode(): FileSystem['sandboxMode'] {
    return this.ctx.mirage.vfsOnly ? 'workspace-write' : undefined
```

</details>

**依据 2 · 源码核查**：[typescript/packages/dsh/src/fs.ts:270-285](https://github.com/strukto-ai/mirage/blob/de311792e60fe6f7edb6e18cb5411a843b4849db/typescript/packages/dsh/src/fs.ts#L270-L285)

不在虚拟世界的 cwd 回退。

<details>
<summary>查看原文（16行）</summary>

```text
   * dsh hands `ctx.fs` either the calling session's cwd or the sandbox
   * policy's workspace root, and both are directories on the harness's
   * own machine that name nothing here. Resolving `notes.txt` against
   * one yields `/Users/.../notes.txt`, which every read then reports as
   * absent. So a base that is not a directory in this world falls back
   * to the configured one, the same rule the shell executor applies to
   * a workdir.
   *
   * An absolute path ignores its base, so it never pays for the probe.
   *
   * @param path the path being resolved.
   * @param cwd the caller's base, if any.
   * @returns the base to resolve against.
   */
  private async resolveBase(path: string, cwd: string | undefined): Promise<string> {
    if (cwd === undefined || posix.isAbsolute(path)) return this.cwd
```

</details>

**依据 3 · 源码核查**：[typescript/packages/dsh/src/approval.ts:124-151](https://github.com/strukto-ai/mirage/blob/de311792e60fe6f7edb6e18cb5411a843b4849db/typescript/packages/dsh/src/approval.ts#L124-L151)

审批拒绝与缺 approver 的待决区别。

<details>
<summary>查看原文（28行）</summary>

```text
 *     nod into a standing grant is the one thing the human did not
 *     consent to; a host that wants SESSION answers writes them to the
 *     ledger itself (`ws.decisions.answer`), the surface built for it.
 *   * `rejected` is an explicit refusal.
 *   * `cancelled` is a refusal too: the human was shown the prompt and
 *     dismissed it, which is an answer rather than the absence of one.
 *     Leaving it pending would re-prompt them, since a retry reuses the
 *     waiting record and would call `request` again.
 *   * `unavailable` is a permission check that could not run, so it
 *     fails closed. Pending here would be fail-open-into-retry.
 *
 * The three refusals match what dsh does with the same vocabulary for
 * its own escalations, where `approveEscalation` throws on a rejection,
 * a cancellation and an unanswerable ask alike.
 *
 * The run's own signal rides along, so a prompt raised for a line whose
 * run is then killed or times out is dismissed with it rather than left
 * on somebody's screen for a command that no longer exists. The ledger
 * stops waiting either way — it bounds the wait by the same signal — but
 * only the channel can take its prompt down.
 *
 * With no approver on the context the handler answers null, which is
 * mirage's "nobody has answered yet": the ask stays pending in the
 * ledger. That is deliberate, and it is why the service installs this
 * unconditionally rather than only under a composed approver — the two
 * are the same answer to mirage (`onAsk` unset and a null return both
 * render pending), and installing always is what lets an approver
 * composed after this plugin still be found.
```

</details>

#### 缺口

- 未运行 DSH、Mirage 或外部数据源
  **影响**：无法证明路径一致、审批和运行时隔离
  **进一步探讨**：隔离 profile 验证 fs、shell、spill 和审批

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样安全试用和退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH、Node 和已配置的 Mirage workspace、挂载与 runtime；切换 provider 会改变路径、审批和取消语义。先在独立 profile 用内存/只读挂载验证同一文件的 fs 与 shell 读写、长输出与审批，再逐项接入真实后端；路径不一致或权限不清时停止并回原生 provider。部署和数据源费用、兼容性与效果未测。

#### 证据与依据

**依据 1 · 源码核查**：[typescript/packages/dsh/package.json:19-21](https://github.com/strukto-ai/mirage/blob/de311792e60fe6f7edb6e18cb5411a843b4849db/typescript/packages/dsh/package.json#L19-L21)

Node 版本范围。

```text
  "type": "module",
  "engines": {
    "node": "^22.20 || ^24.12 || >=25"
```

**依据 2 · 源码核查**：[typescript/packages/dsh/src/fs.ts:165-177](https://github.com/strukto-ai/mirage/blob/de311792e60fe6f7edb6e18cb5411a843b4849db/typescript/packages/dsh/src/fs.ts#L165-L177)

共享工作区和取消限制。

<details>
<summary>查看原文（13行）</summary>

```text
/**
 * Mirage-backed implementation of `ctx.fs`. Targets are canonical virtual
 * paths (namespace symlinks followed), every operation walks the workspace
 * dispatcher — session grants, admission policies, cache read-through and
 * post-write invalidation all fire exactly as they do for a shell command —
 * and `processPath` answers in the same virtual path space the mirage shell
 * executes in, so the two providers share one execution world.
 *
 * One limit worth stating: mirage's `ws.vfs` takes no `AbortSignal`, so
 * cancellation is honored at this adapter's own boundaries (before a
 * dispatch, between listing entries) and not inside a single op. A long
 * read from a remote backend therefore runs to completion after the
 * signal fires, and the caller learns of the abort when it returns.
```

</details>

**依据 3 · 源码核查**：[typescript/packages/dsh/src/approval.ts:132-151](https://github.com/strukto-ai/mirage/blob/de311792e60fe6f7edb6e18cb5411a843b4849db/typescript/packages/dsh/src/approval.ts#L132-L151)

审批缺失时的状态。

<details>
<summary>查看原文（20行）</summary>

```text
 *   * `unavailable` is a permission check that could not run, so it
 *     fails closed. Pending here would be fail-open-into-retry.
 *
 * The three refusals match what dsh does with the same vocabulary for
 * its own escalations, where `approveEscalation` throws on a rejection,
 * a cancellation and an unanswerable ask alike.
 *
 * The run's own signal rides along, so a prompt raised for a line whose
 * run is then killed or times out is dismissed with it rather than left
 * on somebody's screen for a command that no longer exists. The ledger
 * stops waiting either way — it bounds the wait by the same signal — but
 * only the channel can take its prompt down.
 *
 * With no approver on the context the handler answers null, which is
 * mirage's "nobody has answered yet": the ask stays pending in the
 * ledger. That is deliberate, and it is why the service installs this
 * unconditionally rather than only under a composed approver — the two
 * are the same answer to mirage (`onAsk` unset and a null return both
 * render pending), and installing always is what lets an approver
 * composed after this plugin still be found.
```

</details>

#### 缺口

- 未运行 DSH、Mirage 或外部数据源
  **影响**：无法证明路径一致、审批和运行时隔离
  **进一步探讨**：隔离 profile 验证 fs、shell、spill 和审批

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何验证虚拟世界一致性？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：加载时用非破坏性探针对同一路径验证 fs、shell、spill 和授权路径，并暴露不一致状态，可能减少配置错位。现有共享 dispatcher、cwd 回退和审批待决是反证，不是没有控制；一次探针不能覆盖所有后端或未来权限变化。对照手工配置，用挂载缺失、不可写 spill、缺 approver 和远端取消样本测发现率、误报和成本；不能改善则否定。

#### 证据与依据

**依据 1 · 源码核查**：[typescript/packages/dsh/src/fs.ts:165-177](https://github.com/strukto-ai/mirage/blob/de311792e60fe6f7edb6e18cb5411a843b4849db/typescript/packages/dsh/src/fs.ts#L165-L177)

已有共享 dispatcher。

<details>
<summary>查看原文（13行）</summary>

```text
/**
 * Mirage-backed implementation of `ctx.fs`. Targets are canonical virtual
 * paths (namespace symlinks followed), every operation walks the workspace
 * dispatcher — session grants, admission policies, cache read-through and
 * post-write invalidation all fire exactly as they do for a shell command —
 * and `processPath` answers in the same virtual path space the mirage shell
 * executes in, so the two providers share one execution world.
 *
 * One limit worth stating: mirage's `ws.vfs` takes no `AbortSignal`, so
 * cancellation is honored at this adapter's own boundaries (before a
 * dispatch, between listing entries) and not inside a single op. A long
 * read from a remote backend therefore runs to completion after the
 * signal fires, and the caller learns of the abort when it returns.
```

</details>

**依据 2 · 源码核查**：[typescript/packages/dsh/src/shell.ts:550-574](https://github.com/strukto-ai/mirage/blob/de311792e60fe6f7edb6e18cb5411a843b4849db/typescript/packages/dsh/src/shell.ts#L550-L574)

已有 spill 路径与失败处理。

<details>
<summary>查看原文（25行）</summary>

```text

  // A spill sink for one background command, or null when no spill
  // directory is configured. The target reaches the live workspace so
  // the full stream lands on a mount the agent can read back.
  private newSpill(): SpillSink | null {
    const dir = this.spillDir
    if (dir === undefined) return null
    const target: SpillTarget = {
      ensureDir: async (d) => {
        const ws = await this.workspace()
        await ensureDirPath({ exists: (p) => ws.vfs.exists(p), mkdir: (p) => ws.vfs.mkdir(p) }, d)
      },
      write: async (p, bytes) => {
        const ws = await this.workspace()
        await ws.vfs.write(p, bytes)
      },
      append: async (p, bytes) => {
        const ws = await this.workspace()
        await ws.vfs.append(p, bytes)
      },
    }
    spillCounter += 1
    const log = this.ctx.logger('mirage-dsh')
    return new SpillSink(target, dir, `mirage-shell-${spillCounter.toString()}`, (err: unknown) => {
      log.debug('spill to %s failed, output will not be recoverable: %o', dir, err)
```

</details>

**依据 3 · 源码核查**：[typescript/packages/dsh/src/approval.ts:132-151](https://github.com/strukto-ai/mirage/blob/de311792e60fe6f7edb6e18cb5411a843b4849db/typescript/packages/dsh/src/approval.ts#L132-L151)

已有审批结果语义。

<details>
<summary>查看原文（20行）</summary>

```text
 *   * `unavailable` is a permission check that could not run, so it
 *     fails closed. Pending here would be fail-open-into-retry.
 *
 * The three refusals match what dsh does with the same vocabulary for
 * its own escalations, where `approveEscalation` throws on a rejection,
 * a cancellation and an unanswerable ask alike.
 *
 * The run's own signal rides along, so a prompt raised for a line whose
 * run is then killed or times out is dismissed with it rather than left
 * on somebody's screen for a command that no longer exists. The ledger
 * stops waiting either way — it bounds the wait by the same signal — but
 * only the channel can take its prompt down.
 *
 * With no approver on the context the handler answers null, which is
 * mirage's "nobody has answered yet": the ask stays pending in the
 * ledger. That is deliberate, and it is why the service installs this
 * unconditionally rather than only under a composed approver — the two
 * are the same answer to mirage (`onAsk` unset and a null return both
 * render pending), and installing always is what lets an approver
 * composed after this plugin still be found.
```

</details>

#### 缺口

- 未运行 DSH、Mirage 或外部数据源
  **影响**：无法证明路径一致、审批和运行时隔离
  **进一步探讨**：隔离 profile 验证 fs、shell、spill 和审批

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
