# Mirage

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[7761a83](https://github.com/strukto-ai/mirage/tree/7761a83ebe084e03139f29438d2aa6e833282a5f)

<!-- BEGIN META -->
[![GitHub ★ 3,776](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C776&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/strukto-ai/mirage)
<!-- END META -->

> **功能**：为 Agent 组合多数据源虚拟文件系统、命令行工具与可路由运行时。

> **亮点**：让同一会话复用路径、命令和管道处理多个数据源，并保留每个挂载的读写模式和后端能力判断。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：挂载、命令和 runtime 的共同入口不保证所有后端写入语义一致。跨挂载移动出错可能留下部分目标内容，真实状态必须逐源核对。[Q03](#research-q03)

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
  - [Q01 · 谁需要 Mirage 的统一终端，根项目和 DSH 适配是什么关系？](#detail-section-11)
  - [Q02 · 同一条命令怎样组合虚拟路径、已安装 CLI 和运行时，熟悉的命令行行为有哪些边界？](#detail-section-12)
  - [Q03 · 只读与条件写在何处生效，跨挂载错误能否判定没有任何写入？](#detail-section-13)
  - [Q04 · 接入的成本与可逆试用边界是什么？](#detail-section-14)
  - [Q05 · 能否让跨源失败的结果更容易被操作者核对？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Agent 平台开发者需要一次跨源检索、过滤和报告，且希望保留各源权限。[Q01](#research-q01)

分别调用各源 SDK 或 MCP，使用显式同步脚本组合输出。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| VFS 工作区 | 在同一会话下读取多个数据源 | 模式、能力与凭据按各源约束 |
| 虚拟命令和 runtime 路由 | 把终端命令放到相应后端 | 命令与外部 runtime 须分别验收 |
| 跨挂载复制及移动 | 在挂载之间处理文件 | 部分失败可能留下目标，需逐源回读 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 SDK 和运行时 | 工作区需要 | 加载挂载及命令 | 回独立 API |
| 已配置的挂载与 profile | 对应数据访问需要 | 约束路径和模式 | 拒绝或缩小试用范围 |
| 后端条件写支持与读缓存 | 条件写需要 | 保留版本前置条件 | 配置拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者准备两处只读假源及固定预期结果 | 不使用生产凭据 |
| 比较 | 同一会话检索并把实际输出与独立 API 对照 | 数量、来源、退出码均符合预期 |
| 退出 | 关闭测试会话并卸载挂载 | 有疑点时按来源回读，不直接重试写入 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | SDK 及宿主资源未测 | 准备后端、权限和挂载 | 支持范围取决于 SDK 和部署 |
| 持续使用 | 外部请求、缓存与计算开销未测 | 比对各源结果 | 作者内存估计不能代入业务成本 |
| 失败恢复 | 部分写入、重复请求可能增加资源 | 核对源与目标实际状态 | 无统一事务回滚承诺 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多源检索 | VFS、CLI 与 runtime 有共同入口 | 合格任务能否少用时间和请求 |
| 访问约束 | 会话权限与写能力检查 | 真实后端授权及 runtime 隔离 |
| 恢复 | 失败诊断与缓存失效 | 逐源副作用和对账成本 |

> **思考**：挂载、命令和 runtime 的共同入口不保证所有后端写入语义一致。跨挂载移动出错可能留下部分目标内容，真实状态必须逐源核对。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：让同一会话复用路径、命令和管道处理多个数据源，并保留每个挂载的读写模式和后端能力判断。[Q01](#research-q01) [Q02](#research-q02)

挂载归一化、命令分流和后端准入分层。条件写拒绝能力不足的挂载，部分失败后缓存驱逐有清楚边界，自定义 handler 仍取决于声明与实现。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

挂载、命令和 runtime 的共同入口不保证所有后端写入语义一致。跨挂载移动出错可能留下部分目标内容，真实状态必须逐源核对。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用本地只读假源，比较一份已知预期的报告与两个独立接口。若后端范围或结果不符，停用并回独立 API。写访问必须另验条件与部分失败，不由试用结果自动开放。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定 TypeScript 代码支持挂载、命令分流和写权限复查。真实宿主、数据源隔离和任务收益未验收。

- 已检查：作者 README、包清单、源码路径 README.md、typescript/packages/core/src/workspace/workspace/mounts.ts、typescript/packages/core/src/workspace/workspace/workspace.ts、typescript/packages/dsh/package.json、typescript/packages/dsh/cordis.patch.yml、typescript/packages/core/src/workspace/workspace/routing.ts、typescript/packages/core/src/workspace/executor/command/command.ts、typescript/packages/core/src/workspace/executor/fanout.ts、typescript/packages/core/src/commands/builtin/generic/truncate.ts、typescript/packages/core/src/workspace/dispatcher/dispatcher.ts、typescript/packages/core/src/workspace/mount/mount.ts、typescript/packages/core/src/workspace/mount/write_policy.ts、typescript/packages/core/src/commands/builtin/generic/mv.ts、typescript/packages/node/package.json、python/pyproject.toml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对固定 TypeScript 运行时、跨源移动、挂载权限及包身份。只定位 DSH 子包，不研究其全部宿主行为。未逐一核实所有服务适配器或跨语言一致性。
- 下一步：固定源码静态检查，未运行插件、SDK、真实挂载、外部服务或 DSH。对照与故障注入计划见 [Q05](#research-q05)。

**分析版本**

- **仓库**：[strukto-ai/mirage](https://github.com/strukto-ai/mirage)
- **版本号**：未声明（[固定提交 7761a83](https://github.com/strukto-ai/mirage/tree/7761a83ebe084e03139f29438d2aa6e833282a5f)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证方向是在退出码旁记录逐源阶段与结果未知的边界，检验能否减少重复写入和故障后的核对时间。[Q05](#research-q05)

固定源码静态检查，未运行插件、SDK、真实挂载、外部服务或 DSH。对照与故障注入计划见 [Q05](#research-q05)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 62 | 8925 | — | — | 104418 |
| .jsx | source | 2 | 140 | 135 | 0 | — |
| .md | example | 24 | 1111 | — | — | 6349 |
| .ts | example | 261 | 34087 | 25464 | 4796 | — |
| .mjs | example | 8 | 650 | 523 | 84 | — |
| .ts | source | 2563 | 440472 | 312681 | 103796 | — |
| .js | source | 5 | 2996 | 2643 | 327 | — |
| .js | example | 4 | 46 | 43 | 0 | — |
| .mjs | source | 13 | 463 | 333 | 109 | — |
| .ts | test | 1642 | 361346 | 293105 | 43066 | — |

</details>

**活跃度**

[![Issue 未关闭 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=21&color=737b86&logo=github)](https://github.com/strukto-ai/mirage/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 35](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=35&color=737b86&logo=github)](https://github.com/strukto-ai/mirage/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 59](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=59&color=737b86&logo=github)](https://github.com/strukto-ai/mirage/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)



统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Mirage 如何把多源文件、命令与运行时接成 Agent 终端，组合后哪些权限和失败语义仍须逐源验收？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要 Mirage 的统一终端，根项目和 DSH 适配是什么关系？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合为 Agent 平台组织跨数据源查询、汇总与产物归档的开发者。例如从多个只读测试源取匹配记录，再在临时位置生成可人工复核的报告。分别使用 SDK、MCP 或同步脚本也能做同样工作。Mirage 增量在于用一个工作区描述挂载、会话与常用命令，让查找和管道复用同一虚拟路径语法。挂载规范归一化后分别核验每个后端读写能力。创建会话则把工作区的基础 profile、会话内联约束和挂载视图合成，再校验命令约束。单数据源或强依赖服务专有动作的工作，统一路径可能没有显著价值。根仓是 TypeScript、Python 等多包的终端基础设施。DSH 的 ctx.fs、ctx.shell 等由单独的 mirage-dsh 子包提供，其 Cordis patch 插入特定服务行。根仓有该包不代表所有宿主或所有挂载已经兼容。本轮研究 TypeScript 根能力，DSH 包只核身份与接线分工。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:120-129](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/README.md#L120-L129)

作者定位为统一终端、挂载、CLI 和运行时。

<details>
<summary>查看原文（10行）</summary>

```text
## About

- **Unified virtual terminal interface, not N SDKs and M MCPs.** Every backend speaks the same filesystem semantics, so pipelines compose across services.
- **A virtual filesystem over every source.** S3, Google Drive, Slack, Gmail, Redis and the rest mount side by side under one root, so an agent reaches all of them through a unified interface with the unix tools it already knows, like `ls`, `grep`, `find` and `jq`.
- **Virtual command line tools (CLIs).** `git`, `slack` and `ntn` are answered by Mirage itself, so an agent drives the service with nothing installed, across different runtimes and machines, and one tool can be virtualized into two or more, each under its own name with its own credentials.
- **Routed, dynamic runtimes.** Python, JavaScript and any other command can be sent to a configured runtime, in process, sandboxed or remote, which decouples computation from storage and lets either change without touching the other.
- **The virtualized Mirage shell.** It binds the filesystem, the CLIs and the runtimes into one command line, so pipes, redirection, variables, jobs and history work across all three.
- **Lightweight by design.** A workspace, the virtual terminal itself, takes about 100 KB of memory and each new session about 10 KB, so one process serves many agents without a container or VM per agent.
- **Profiles designed for agents.** `allow`, `ask` and `deny` govern commands and CLIs, while `hide` and `show` govern files and folders, so a hidden path is not merely unreadable but absent from the filesystem the agent sees.
- **A scriptable policy engine.** A policy script can prohibit any dangerous action before it runs, and the same stack gates every VFS op and session write, so neither a file nor an environment variable leaks.
```

</details>

**依据 2 · 源码核查**：[typescript/packages/core/src/workspace/workspace/mounts.ts:65-107](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/core/src/workspace/workspace/mounts.ts#L65-L107)

多种挂载格式归一化后检查读写能力。

<details>
<summary>查看原文（43行）</summary>

```text
  for (const [prefix, spec] of Object.entries(mounts)) {
    if (spec instanceof Mount) {
      bare[prefix] = spec.vfs
      if (spec.options.mode !== undefined) modes[prefix] = spec.options.mode
      if (spec.options.commandLimits !== undefined)
        commandLimits[prefix] = spec.options.commandLimits
      if (spec.options.vfsRef !== undefined && spec.options.vfsRef !== null) {
        refs[prefix] = spec.options.vfsRef
      }
      if (spec.options.index !== undefined)
        indexes[prefix] = normalizeIndexConfig(spec.options.index)
      if (spec.options.read !== undefined) read[prefix] = spec.options.read
      if (spec.options.write !== undefined) write[prefix] = coerceWritePolicy(spec.options.write)
    } else if (Array.isArray(spec)) {
      const [vfs, mode, mountCommandLimits] = spec as readonly [
        BaseVFS,
        MountMode,
        Record<string, Limit>?,
      ]
      bare[prefix] = vfs
      modes[prefix] = mode
      if (mountCommandLimits !== undefined) commandLimits[prefix] = mountCommandLimits
    } else {
      bare[prefix] = spec as BaseVFS
    }
  }
  for (const [prefix, table] of Object.entries(commandLimits)) {
    checkCommandLimits(table, `mount ${prefix}`, false)
  }
  // Every mount spelling converges here, which is why this is where a
  // read policy is checked against what its backend can honour: one
  // verdict per mount, whatever entry point declared it.
  for (const [prefix, vfs] of Object.entries(bare)) {
    checkReadCapability(prefix, vfs, read[prefix] ?? defaultRead, indexes[prefix] ?? index)
    checkWriteCapability(
      prefix,
      vfs,
      write[prefix] ?? defaults.write,
      modes[prefix] ?? defaults.mode,
      defaults.caching && vfs.cachesReads,
    )
  }
  return { bare, modes, commandLimits, refs, indexes, read, write }
```

</details>

**依据 3 · 源码核查**：[typescript/packages/core/src/workspace/workspace/workspace.ts:1262-1280](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/core/src/workspace/workspace/workspace.ts#L1262-L1280)

合成会话挂载与 profile，再创建会话。

<details>
<summary>查看原文（19行）</summary>

```text
  createSession(
    sessionId: string,
    options: {
      mounts?: ReadonlyMap<string, unknown> | Record<string, unknown> | null
      profile?: string | SessionProfile | null
      permissions?: SessionProfile | null
    } = {},
  ): SessionState {
    const base = this.baseProfile(options.profile ?? null)
    let inline: SessionProfile | null = options.permissions ?? null
    if (options.mounts != null) {
      inline = withInline(inline, { mounts: parseProfileMounts(options.mounts) })
    }
    const compiled = this.compile(
      withInline(base, inline, this.workspaceProcesses),
      options.profile ?? null,
    )
    checkCliVerbs(compiled.policies.commands, this.cliVerbs())
    return this.sessionManager.create(sessionId, { profile: compiled })
```

</details>

**依据 4 · 源码核查**：[typescript/packages/dsh/package.json:1-13](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/dsh/package.json#L1-L13)

DSH provider 属独立子包。

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "@struktoai/mirage-dsh",
  "version": "0.0.9-alpha.1",
  "description": "DeepSeek Harness (dsh) providers backed by a mirage workspace: ctx.fs and ctx.shell over mounts",
  "homepage": "https://github.com/strukto-ai/mirage#readme",
  "bugs": {
    "url": "https://github.com/strukto-ai/mirage/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/strukto-ai/mirage.git",
    "directory": "typescript/packages/dsh"
  },
```

</details>

**依据 5 · 源码核查**：[typescript/packages/dsh/cordis.patch.yml:118-135](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/dsh/cordis.patch.yml#L118-L135)

DSH patch 插入服务、文件、子进程、shell 与 spill 等行。

<details>
<summary>查看原文（18行）</summary>

```text
- insert:
    - id: mirage
      name: '@struktoai/mirage-dsh/service'
      config:
        mounts:
          /tmp: { vfs: ram, mode: exec }

    - id: mirage-fs
      name: '@struktoai/mirage-dsh/fs'

    - id: mirage-subprocess
      name: '@struktoai/mirage-dsh/subprocess'

    - id: mirage-shell
      name: '@struktoai/mirage-dsh/shell'

    - id: mirage-spill
      name: '@struktoai/mirage-dsh/spill-store'
```

</details>

#### 缺口

- 缺少同一跨源任务的 SDK 对照和固定 DSH 宿主试装。
  **影响**：不能由接口统一推断用户节省或 DSH 全部能力通过。
  **进一步探讨**：用两份只读假源在隔离会话比较同一查询和可核对的报告结果，再独立验收 DSH 适配。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 同一条命令怎样组合虚拟路径、已安装 CLI 和运行时，熟悉的命令行行为有哪些边界？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

命令行和命令节点都有路由。工作区先收集 preExecute 策略答案，可以返回拒绝、待决定、指定 runtime 或默认配置，明确指定的机器和 runtime 无法解析时出错。已经整行交给 runtime 时使用该放置结果，否则单命令可以依 preCommand 另行放置。已安装的虚拟 CLI 按命令名找 handler，优先于按路径进入挂载分支。文件型 CLI 可读取经当前会话包装的 VFS，直接访问服务的 handler 具有不同边界。跨挂载读取可扇出，隐藏后端不参与结果生产者的边界统计。后端错误会进入命令的退出码和诊断，管道或一行后续命令的结果需要分开看。固定版本的兼容实现还包含 truncate 的参考尺寸、块单位及多操作数错误处理。参考路径读失败时提前返回，处理多个目标则允许某些文件出错后继续尝试其他项。模拟 GNU 的指定分支不保证命令与每个后端都具有完全一致的功能或事务行为。合格的自动化需要对照预期数据、退出码、命令所用的后端和实际输出。

#### 证据与依据

**依据 1 · 源码核查**：[typescript/packages/core/src/workspace/workspace/routing.ts:146-186](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/core/src/workspace/workspace/routing.ts#L146-L186)

整行路由的策略结果和命名 runtime 解析。

<details>
<summary>查看原文（41行）</summary>

```text
    command: string,
    session: SessionState,
    judged: () => Promise<readonly [Walked, Judged[]][]>,
  ): Promise<[readonly (Deny | Ask | Route)[], RouteDecision<Runtime> | Deny | Pending]> {
    const policies = this.registry.policies
    const placing = await policies.wantsFor('preExecute', session.sessionId)
    if (!placing) return [[], this.unplaced()]
    const ctx = this.context(command, session, await judged())
    const answers = await policies.answers('preExecute', ctx)
    let winner = settled(answers)
    if (winner?.kind === 'ask') {
      const standing = await this.registry.decisions.held(...opQuestion(ctx, winner))
      if (standing !== null) return [answers, standing]
      winner = agreed(answers.filter((a): a is Route => a.kind === 'route'))
    }
    if (winner?.kind === 'deny') return [answers, winner]
    if (winner?.kind === 'route') return [answers, this.routed(winner)]
    return [answers, this.unplaced()]
  }

  /**
   * The decision a policy's route places a line on (`routed`). Mirrors
   * Python's `Router._routed`.
   *
   * Throws:
   *   RouteError: no entry or machine has the name.
   */
  private routed(route: Route): RouteDecision<Runtime> {
    this.knownMachine(route.machine)
    try {
      return routed(
        this.runtimes.entries,
        this.registry.runtimeBindings,
        route.runtime,
        route.machine,
      )
    } catch (caught) {
      throw new RouteError(caught instanceof Error ? caught.message : String(caught), {
        cause: caught,
      })
    }
```

</details>

**依据 2 · 源码核查**：[typescript/packages/core/src/workspace/workspace/routing.ts:221-238](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/core/src/workspace/workspace/routing.ts#L221-L238)

整行 runtime 与命令放置的关系。

<details>
<summary>查看原文（18行）</summary>

```text
  /**
   * The runtime entry that serves a command under a decision, as its run
   * places it, and the machine it runs there on: the `@external` runtime
   * for a program no name binds (a path runs through the workspace's exec
   * path first); both empty when the workspace runs it itself. A
   * `preCommand` route of the command places it over the line's decision,
   * as its run does. Mirrors Python's `Router.placement_for`.
   */
  placementFor(one: Judged, line: RouteDecision<Runtime>): [string, string] {
    const whole = wholeLineRuntime(line.bindings)
    if (whole !== null) return [whole.name, machineOf(whole, line)]
    const route = commandRoute(one.judgment.answers)
    const placed =
      route === null
        ? line
        : routed(this.runtimes.entries, line.bindings, route.runtime, route.machine ?? line.machine)
    return this.serving(one, placed)
  }
```

</details>

**依据 3 · 源码核查**：[typescript/packages/core/src/workspace/executor/command/command.ts:835-865](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/core/src/workspace/executor/command/command.ts#L835-L865)

会话 VFS 包装与虚拟 CLI 命令名匹配。

<details>
<summary>查看原文（31行）</summary>

```text
  dispatch = madeByCommand(dispatch, admission)
  // The command's own files keep no ledger: the dispatcher accounts for the line.
  const commandFiles = (follow: FollowOperands | null): Files =>
    new Files(
      dispatch,
      namespace === undefined ? null : namespace.readers(() => session.visibility),
      null,
      { follow, ledger: false },
    )
  const cliContext = (vfs: Files): CLIContext => {
    const cliSignal = mergeSignals(signal, context.frame.abortSignal)
    return {
      ...(executeFn !== undefined ? { shell: nestedShell(executeFn, session, cliSignal) } : {}),
      ...(cliSignal !== undefined ? { signal: cliSignal } : {}),
      commandLimits: registry.commandLimits,
      ids: registry.ids,
      vfs,
      session: view,
      ...(registry.sessionProcesses === undefined
        ? {}
        : { processes: registry.sessionProcesses(session) }),
    }
  }

  // Installed CLIs: dispatch by name, never by operand path. Sits
  // below functions (a user can wrap an installed CLI, bash-style)
  // and above every mount branch (a CLI consults no mount).
  // A CLI that works on files rather than an API (`git`) reaches them
  // through `ctx.vfs`, the session's files made by the command; the
  // rest never look.
  const cliInstall = registry.clis.get(cmdName)
```

</details>

**依据 4 · 源码核查**：[typescript/packages/core/src/workspace/executor/command/command.ts:865-884](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/core/src/workspace/executor/command/command.ts#L865-L884)

已安装 CLI 到具体 handler 的执行和缓存维护。

<details>
<summary>查看原文（20行）</summary>

```text
  const cliInstall = registry.clis.get(cmdName)
  if (cliInstall !== null) {
    // A leaf that waits on its service keeps running; the caller's abort
    // releases the invocation, as it does for `wait`.
    return abortable(
      handleCli(
        cliInstall,
        parts,
        session,
        stdin,
        {
          ...cliContext(commandFiles(null)),
          entries: registry.runtimeEntries,
          ...(context.frame.routing === undefined ? {} : { routing: context.frame.routing }),
          settle: (runtime) => registry.settle(runtime),
        },
        reachesService(cliInstall.cli) ? () => registry.dropCaches(cliInstall.accessor) : null,
      ),
      mergeSignals(signal, context.frame.abortSignal),
    )
```

</details>

**依据 5 · 源码核查**：[typescript/packages/core/src/workspace/executor/fanout.ts:199-236](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/core/src/workspace/executor/fanout.ts#L199-L236)

后端失败诊断、流式失败包装及可见挂载范围。

<details>
<summary>查看原文（38行）</summary>

```text
  } catch (err) {
    if (err instanceof CommandTimeoutError || (err instanceof Error && err.name === 'AbortError'))
      throw err
    stdout = null
    if (err instanceof UsageError) {
      io = new IOResult({
        exitCode: err.exitCode,
        stderr: encodeText(`${err.message}\n`),
      })
    } else {
      // A backend failure anywhere in the walk (a 5xx from a nested mount)
      // is this command's result, in its voice, as the single-mount entry point
      // reports it; the rest of the line still runs.
      io = new IOResult({
        exitCode: readFailExitCode(cmdName, err),
        stderr: formatFsError(cmdName, err, paths),
      })
    }
  }
  if (stdout !== null && !(stdout instanceof Uint8Array)) {
    // A walk that streams meets a failing mount as it is read; that failure
    // is this command's result too.
    stdout = framed(stdout, io, mountVoice(cmdName, paths))
  }
  // Only the mounts the walk can reach bound its output: a hidden one never
  // contributes a row, so its stricter limit must not apply.
  const prefixes = new Set([primaryMount.prefix])
  const reader = vfs === undefined ? null : readerOf(vfs)
  for (const path of paths) {
    if (path.walkError !== null) continue
    for (const mount of registry.descendantMounts(path.virtual))
      if (reader === null || reader.visible('/' + stripSlash(mount.prefix)))
        prefixes.add(mount.prefix)
  }
  io.producer = {
    command: cmdName,
    prefixes: [...prefixes].sort(compareCodePoints),
    declared: null,
```

</details>

**依据 6 · 源码核查**：[typescript/packages/core/src/commands/builtin/generic/truncate.ts:84-122](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/core/src/commands/builtin/generic/truncate.ts#L84-L122)

解析参考文件、单位和尺寸溢出。

<details>
<summary>查看原文（39行）</summary>

```text
export function parseFlags(bag: Record<string, FlagValue>): TruncateFlags | IOResult {
  const fl = new FlagView(bag, specOf('truncate'))
  const reference = fl.asPath('reference') ?? null
  const typed = fl.texts('size')
  const sized = typed.length > 0
  if (reference !== null) typed.push(['reference', ''])
  let values
  try {
    values = scan('truncate', typed)
  } catch (err) {
    if (!(err instanceof StreamRefusal)) throw err
    return refused(err)
  }
  const ioBlocks = fl.asBool('io_blocks')
  if (ioBlocks && !sized) {
    throw new UsageError(
      `truncate: '--io-blocks' was specified but '--size' was not\n${usageHint('truncate')}`,
      1,
    )
  }
  const size = values.size
  if (
    size === null ||
    typeof size !== 'object' ||
    Array.isArray(size) ||
    typeof size.mode !== 'string' ||
    !MODES.has(size.mode) ||
    typeof size.size !== 'string'
  ) {
    throw new Error(`truncate: mirage-rs read -s as ${JSON.stringify(size)}`)
  }
  const count = BigInt(size.size)
  const scale = ioBlocks ? IO_BLOCK : 1n
  const past = count * scale > (size.mode === 'reduce' ? 2n ** 63n : 2n ** 63n - 1n)
  return {
    size: { mode: size.mode as SizeMode, number: count * scale },
    noCreate: fl.asBool('no_create'),
    reference,
    overflow: past ? `${size.mode === 'reduce' ? '-' : ''}${count.toString()}` : null,
```

</details>

**依据 7 · 源码核查**：[typescript/packages/core/src/commands/builtin/generic/truncate.ts:137-163](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/core/src/commands/builtin/generic/truncate.ts#L137-L163)

参考失败与多目标继续处理是不同分支。

<details>
<summary>查看原文（27行）</summary>

```text
  if (paths.length === 0)
    throw new UsageError(`truncate: missing file operand\n${usageHint('truncate')}`, 1)
  let base: bigint | null = null
  const reference = flags.reference ?? null
  if (reference !== null) {
    try {
      base = BigInt((await referenceStat(reference)).size ?? 0)
    } catch (e) {
      if (!isFsError(e)) throw e
      const line = `truncate: cannot stat ${shellQuoteAlways(reference.rawPath)}: ${fsStrerror(e) ?? ''}\n`
      return [null, new IOResult({ exitCode: 1, stderr: encodeText(line) })]
    }
  }
  const errors: string[] = []
  for (const path of paths) {
    try {
      const line = await truncateOne(path, flags, stat, truncate, base)
      if (line !== null) errors.push(line)
    } catch (e) {
      if (!isFsError(e)) throw e
      errors.push(fsErrorLine('truncate', path, e))
    }
  }
  const err = errors.join('')
  return [
    null,
    new IOResult({ exitCode: err === '' ? 0 : 1, stderr: err === '' ? null : encodeText(err) }),
```

</details>

#### 缺口

- 未运行跨源管道、完整 GNU 选项矩阵或外部 runtime。
  **影响**：不能判断命令兼容性、资源边界和平台差异。
  **进一步探讨**：对相同数据在测试挂载跑固定成功、隐藏路径和故障脚本，核对字节、退出码和运行位置。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 只读与条件写在何处生效，跨挂载错误能否判定没有任何写入？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

不能由错误判定未写入。已声明操作的 effect 参与 dispatcher 准入判断，copy 的源按读取、目标按创建授权。调用进入挂载后会在具体后端操作前再检查写权限，避免排队期间挂载改为只读仍继续。自定义 VFS 和用户命令依赖可信 effect 或 write 声明。用户 handler 有隐藏路径与只读挂载的提前拒绝，但擅自用其他 API 写服务的实现超出这层可见范围。条件写挂载在配置阶段要求可写、读缓存和后端条件能力，拒绝不能携带条件的预签名 S3，并明确不实现 staged 策略。即便各源能做条件写，跨挂载 mv 仍是先复制再尝试删除。部分复制失败会保留来源以及已经落下的目标项，删除失败则留目标并报告未删除来源。失败缓存驱逐可把后续读转回重新获取，并保留旧条件基线，不能撤销已执行副作用。外部凭据、租户权限和真实 runtime 仍需要逐源约束。

#### 证据与依据

**依据 1 · 源码核查**：[typescript/packages/core/src/workspace/dispatcher/dispatcher.ts:2073-2106](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/core/src/workspace/dispatcher/dispatcher.ts#L2073-L2106)

按声明 effect 区分操作，并检查目标边界。

<details>
<summary>查看原文（34行）</summary>

```text
   * cache becomes a policy bypass. This dispatcher is the one dispatcher in
   * TypeScript: shell internals, programmatic access, `ws.vfs`, and
   * FUSE all end up here. A rename's or a copy's destination is a create
   * there: it passes the same gate as the source, so a path rule holds
   * against moving or copying into a protected scope (or onto the directory
   * that holds one) the way it holds against writing there, under the mode
   * of the mount that owns it. A copy only reads its source. Mirrors
   * Python's Dispatcher._admit.
   */
  private async admit(call: Call, boundary: Boundary, mark: VfsCall): Promise<void> {
    // A function the VFS declares a write is judged as one, whatever its
    // name: the POSIX names are known here, a custom one only to the VFS
    // that defines it.
    call.write = call.write || WRITE_EFFECTS.includes(mark.effect)
    const gate = call.ruleGate === null ? {} : { gate: call.ruleGate }
    // A file copy reads its source, whatever the backend does with it, so the
    // source is admitted as the read a policy judges reads by.
    const owner = call.name === 'copy' ? this.namespace.tryMountFor(call.path.virtual) : null
    const source =
      owner === null ? mark : (declared(owner.vfs.constructor, 'read') ?? CALLS.get('read') ?? mark)
    await boundary.admit(
      source,
      call.path,
      call.write && !COPY_OPS.has(call.name),
      { final: call.dst === null, ...gate },
      call.issuer,
    )
    if (call.dst !== null) {
      await this.boundary(this.namespace.tryMountFor(call.dst.virtual)).admit(
        { ...mark, creates: true },
        call.dst,
        true,
        gate,
        call.issuer,
```

</details>

**依据 2 · 源码核查**：[typescript/packages/core/src/workspace/mount/mount.ts:748-773](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/core/src/workspace/mount/mount.ts#L748-L773)

等待后的后端写权限复查和 copy 目标范围。

<details>
<summary>查看原文（26行）</summary>

```text
  /** Whether the VFS declares the function `name` a write. */
  /**
   * Refuse a write the mount's mode no longer grants at any path. Admission
   * judged the mode before the call waited for the mount and for its write
   * lock; `setMountMode` can make the mount read-only in between, so the mode
   * is read again as the backend call starts. A call that reaches a subtree
   * (a rename, a tree removal or copy) is refused by a read-only region
   * anywhere below its paths, and a copy only reads its source. Mirrors
   * Python's `require_writable`.
   */
  requireWritable(
    name: string,
    path: PathSpec,
    values: readonly unknown[],
    access?: SessionAccess,
  ): void {
    const mark = declared(this.vfs.constructor, name)
    if (mark === null || !WRITE_EFFECTS.includes(mark.effect)) return
    const others = values.filter((value): value is PathSpec => value instanceof PathSpec)
    requirePathsWritable(
      mark.effect === Effect.COPY ? others : [path, ...others],
      this.prefix,
      this.mode,
      mark.subtree,
      access,
    )
```

</details>

**依据 3 · 源码核查**：[typescript/packages/core/src/workspace/mount/mount.ts:1649-1663](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/core/src/workspace/mount/mount.ts#L1649-L1663)

真实 mount callKeyed 接线。

<details>
<summary>查看原文（15行）</summary>

```text
    const named = kwargs.filetype === undefined ? getExtension(scope.virtual) : kwargs.filetype
    const filetype =
      named === null && !this.vfs.supports('read') ? getExtension(scope.virtual) : named
    const vfs = this.viewFor(access)
    const levels = this.callers(name, filetype, vfs)
    if (levels.length === 0) {
      // A copy only reads its source, so the path it is refused at is the
      // destination it would have made.
      const dst = args[0]
      const copies = declared(this.vfs.constructor, name)?.effect === Effect.COPY
      throw enotsup(this.vfs.name, name, copies && dst instanceof PathSpec ? dst : scope)
    }
    taken(name, kwargs)
    this.requireWritable(name, scope, [...args, ...Object.values(kwargs)], access)
    const index = kwargs.index ?? this.index
```

</details>

**依据 4 · 源码核查**：[typescript/packages/core/src/workspace/mount/mount.ts:2059-2102](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/core/src/workspace/mount/mount.ts#L2059-L2102)

自定义 handler 和内建命令的不同拒绝点。

<details>
<summary>查看原文（44行）</summary>

```text
   * Mirage's own commands write through the dispatcher, which refuses each
   * write in the command's own GNU voice, because only the write knows
   * whether a line writes: `gzip -c`, `tar -t` and `split -n 1/2` read a
   * read-only mount like any reader, and `gzip f` is refused at the write of
   * `f.gz`. A user command (`isUserCommand`) may reach its service some other
   * way, which no gate would see, so one that writes is refused here, before
   * it runs. strongestModeUnder, not effectiveMode: a mount whose only
   * writable region is a show entry still runs it. Only wrapper-owned
   * responses (an injected help or version) bypass it: a handler that
   * declares `--help` itself is handed the flag and runs. The trailing
   * newline is load-bearing: stderr accumulates across a line. `served` is
   * the command this mount serves `cmd` under, which says whether it is a
   * user command: a tree's root for one of its leaves, which is built for its
   * one run and never registered. Mirrors Python's
   * MountEntry._command_refusal.
   */
  private commandRefusal(
    cmdName: string,
    cmd: Command,
    flags: Record<string, FlagValue>,
    access?: SessionAccess,
    served?: Command,
  ): IOResult | null {
    if (this.isUserCommand(served ?? cmd) && !pathVisible(sessionVisibility(access), this.prefix)) {
      return new IOResult({
        exitCode: NOT_FOUND_STATUS,
        stderr: encodeText(`${shellVoice()}${cmdName}: command not found\n`),
      })
    }
    const infoOnly =
      (flags.help === true && hasInjectedHelp(cmd.spec)) ||
      (flags.version === true && hasInjectedVersion(cmd.spec))
    if (
      cmd.write &&
      this.isUserCommand(served ?? cmd) &&
      !infoOnly &&
      strongestModeUnder(this.prefix, this.mode, access) === MountMode.READ
    ) {
      return new IOResult({
        exitCode: 1,
        stderr: encodeText(`${cmdName}: read-only mount at ${this.prefix}\n`),
      })
    }
    return null
```

</details>

**依据 5 · 源码核查**：[typescript/packages/core/src/workspace/mount/write_policy.ts:69-105](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/core/src/workspace/mount/write_policy.ts#L69-L105)

条件写必需的挂载能力与明确拒绝。

<details>
<summary>查看原文（37行）</summary>

```text
export function checkWriteCapability(
  prefix: string,
  vfs: BaseVFS,
  policy: WritePolicy,
  mode: MountMode,
  caches: boolean,
): void {
  if (policy === WritePolicy.STAGED) {
    throw new WritePolicyError(
      `mount '${prefix}': write: staged needs a staging layer, and mirage has none; ` +
        'use conditional or unconditional',
    )
  }
  if (policy !== WritePolicy.CONDITIONAL) return
  if (mode === MountMode.READ) {
    throw new WritePolicyError(
      `mount '${prefix}': write: conditional needs a writable mount; this one is read`,
    )
  }
  if (vfs instanceof S3VFS && vfs.presigned) {
    throw new WritePolicyError(
      `mount '${prefix}': write: conditional cannot be sent through a presigned-URL client, ` +
        'which carries no condition',
    )
  }
  if (writeConditions(vfs).length === 0) {
    throw new WritePolicyError(
      `mount '${prefix}': write: conditional needs a backend that refuses a stale write; ` +
        `${vfs.name} does not`,
    )
  }
  if (!caches) {
    throw new WritePolicyError(
      `mount '${prefix}': write: conditional needs a mount that caches reads; ` +
        'the version a write sends is the one its cached copy holds',
    )
  }
```

</details>

**依据 6 · 源码核查**：[typescript/packages/core/src/commands/builtin/generic/mv.ts:639-662](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/core/src/commands/builtin/generic/mv.ts#L639-L662)

跨挂载部分写入与删除失败后的保留语义。

<details>
<summary>查看原文（24行）</summary>

```text
      // Across mounts GNU copies and then removes, and -v says so entry by
      // entry instead of `renamed` (coreutils 9.7).
      const verbose = flags.verbose ? lines : undefined
      const entries = await walk(strategy.readdir, stat, src)
      const copiedAll = await copyEntries('mv', strategy, stat, src, target, entries, errors, {
        copies,
        lines: verbose,
        rootBackup: made.backup,
      })
      // GNU keeps the whole source tree when any copy failed; the
      // destination keeps the entries that landed.
      if (!copiedAll) continue
      const removedAll = await removeEntries(
        strategy,
        stat,
        src,
        entries,
        errors,
        verbose,
        mountRoot,
      )
      // GNU leaves the copied destination in place and reports the source
      // entries it could not remove.
      if (!removedAll) continue
```

</details>

**依据 7 · 源码核查**：[typescript/packages/core/src/workspace/dispatcher/dispatcher.ts:3178-3219](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/core/src/workspace/dispatcher/dispatcher.ts#L3178-L3219)

失败后缓存失效和旧版本基线保留。

<details>
<summary>查看原文（42行）</summary>

```text
   *
   * A write that fails partway may already have changed the store (a
   * paginated delete, a copy that merged some children), so the caches at
   * and below every name it reaches go either way; the node table moves only
   * with a write that landed. The version the line held for each name is
   * kept, so the next write there stays conditioned on what the agent read,
   * and so is each version `lost` marks under them, which a refused
   * conditional write kept: a retry without a read is refused again.
   * Over-dropping costs a refetch. An eviction error is logged, not thrown,
   * so the caller still learns why the write failed. `owners`, for a call
   * that landed after its timeout, holds the mount each name was on when the
   * call started: a name another mount has taken since is that mount's now,
   * so nothing at or under it is touched. Mirrors Python's
   * Dispatcher._evict_failed_write, whose timed-out call is cancelled and
   * never lands late.
   */
  private async evictFailedWrite(
    name: string,
    p: PathSpec,
    dst: PathSpec | null,
    others: readonly [number | string, PathSpec][],
    lost: LostPaths | null,
    owners: ReadonlyMap<string, MountEntry | null> | null = null,
  ): Promise<void> {
    const names = [
      ...(COPY_OPS.has(name) ? [] : [p]),
      ...(dst !== null && DESTINATION_OPS.has(name) ? [dst] : []),
      ...others.map(([, other]) => other),
    ]
    const taken = (target: PathSpec, mount: MountEntry): boolean =>
      owners !== null && owners.get(target.virtual) !== mount
    for (const target of names) {
      try {
        const path = rstripSlash(target.virtual) || '/'
        const mount = this.namespace.tryMountFor(path)
        if (mount === null || taken(target, mount)) continue
        const manager = mount.cacheManager
        const spec = PathSpec.fromStrPath(path)
        const version = manager === null ? null : await manager.readVersion(spec)
        await this.changed(path, FileChangeKind.UNKNOWN, null, { times: false })
        if (manager !== null && version !== null && version !== '') {
          await manager.keepVersion(spec, version)
```

</details>

#### 缺口

- 未验证真实后端版本条件、防绕过和中断后状态。
  **影响**：不能把声明检查推广成跨源事务、运行时隔离或没有副作用。
  **进一步探讨**：对低权限假源注入过期版本、取消及源删除失败，并逐源回读；真实写前另验所有者与凭据范围。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 接入的成本与可逆试用边界是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

适合已有 TypeScript Agent 应用且需要反复跨源查询的团队用两处本地假源做只读实验。Node 子包清单明确列出三个支持的 Node 分支，Python 作者入口另有 3.12 以上要求。真实部署还需配置后端与最小凭据、可信 runtime 和宿主权限；配置能力并不等于授权正确。首次成本是理解挂载、会话 profile 和选用后端。持续成本包括 API 调用、缓存新鲜度、runtime 执行与对账。作者给出每 workspace 和 session 的内存估计，当前没有固定测试证明该数字覆盖 Node 数据源、远端 runtime、索引和连接。以一次完成并验收的跨源检索和报告为单位，分开记录外部请求、延时、错误和人工核对时间。退出时可停用测试会话和卸载挂载，源码显示卸载会标记 retiring、清缓存、确认挂载未变化并关闭拥有的 VFS，根和系统视图受保护。关闭挂载不会逆转此前外部写入，异常时应回各源专用只读 API 检查数据。

#### 证据与依据

**依据 1 · 源码核查**：[typescript/packages/node/package.json:33-42](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/node/package.json#L33-L42)

Node 子包声明运行时要求和入口。

<details>
<summary>查看原文（10行）</summary>

```text
  "type": "module",
  "engines": {
    "node": "^22.20 || ^24.12 || >=25"
  },
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
```

</details>

**依据 2 · 源码核查**：[python/pyproject.toml:1-8](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/python/pyproject.toml#L1-L8)

Python 子包身份及运行时要求。

```text
[project]
name = "mirage-ai"
version = "0.0.9a1"
description = "A unified virtual filesystem for AI agents. Mount S3, Google Drive, Slack, Gmail, GitHub, Linear, Notion, Postgres, MongoDB, SSH, and more behind one filesystem so agents read, write, and pipe across services with familiar shell commands."
readme = "README.md"
license = "Apache-2.0"
license-files = ["LICENSE", "THIRD_PARTY_NOTICES"]
requires-python = ">=3.12"
```

**依据 3 · 作者声明**：[README.md:120-130](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/README.md#L120-L130)

作者提出多源终端与内存数字。

<details>
<summary>查看原文（11行）</summary>

```text
## About

- **Unified virtual terminal interface, not N SDKs and M MCPs.** Every backend speaks the same filesystem semantics, so pipelines compose across services.
- **A virtual filesystem over every source.** S3, Google Drive, Slack, Gmail, Redis and the rest mount side by side under one root, so an agent reaches all of them through a unified interface with the unix tools it already knows, like `ls`, `grep`, `find` and `jq`.
- **Virtual command line tools (CLIs).** `git`, `slack` and `ntn` are answered by Mirage itself, so an agent drives the service with nothing installed, across different runtimes and machines, and one tool can be virtualized into two or more, each under its own name with its own credentials.
- **Routed, dynamic runtimes.** Python, JavaScript and any other command can be sent to a configured runtime, in process, sandboxed or remote, which decouples computation from storage and lets either change without touching the other.
- **The virtualized Mirage shell.** It binds the filesystem, the CLIs and the runtimes into one command line, so pipes, redirection, variables, jobs and history work across all three.
- **Lightweight by design.** A workspace, the virtual terminal itself, takes about 100 KB of memory and each new session about 10 KB, so one process serves many agents without a container or VM per agent.
- **Profiles designed for agents.** `allow`, `ask` and `deny` govern commands and CLIs, while `hide` and `show` govern files and folders, so a hidden path is not merely unreadable but absent from the filesystem the agent sees.
- **A scriptable policy engine.** A policy script can prohibit any dangerous action before it runs, and the same stack gates every VFS op and session write, so neither a file nor an environment variable leaks.
- **Notifications wired into the VFS and agents.** External changes become an event stream on the mount, so a new Slack reply surfaces as a change to the chat file in the virtual filesystem, and the agent reacts to it instead of rescanning the tree.
```

</details>

**依据 4 · 源码核查**：[typescript/packages/core/src/workspace/workspace/workspace.ts:1262-1280](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/core/src/workspace/workspace/workspace.ts#L1262-L1280)

会话权限支持隔离测试的配置位置。

<details>
<summary>查看原文（19行）</summary>

```text
  createSession(
    sessionId: string,
    options: {
      mounts?: ReadonlyMap<string, unknown> | Record<string, unknown> | null
      profile?: string | SessionProfile | null
      permissions?: SessionProfile | null
    } = {},
  ): SessionState {
    const base = this.baseProfile(options.profile ?? null)
    let inline: SessionProfile | null = options.permissions ?? null
    if (options.mounts != null) {
      inline = withInline(inline, { mounts: parseProfileMounts(options.mounts) })
    }
    const compiled = this.compile(
      withInline(base, inline, this.workspaceProcesses),
      options.profile ?? null,
    )
    checkCliVerbs(compiled.policies.commands, this.cliVerbs())
    return this.sessionManager.create(sessionId, { profile: compiled })
```

</details>

**依据 5 · 源码核查**：[typescript/packages/core/src/workspace/workspace/mounts.ts:150-178](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/core/src/workspace/workspace/mounts.ts#L150-L178)

卸载前标记、清缓存与再次确认。

<details>
<summary>查看原文（29行）</summary>

```text
export async function unmountPrefix(deps: UnmountDeps, prefix: string): Promise<void> {
  const norm = normDir(prefix)
  if (norm === '/') {
    throw new Error(`cannot unmount root: ${prefix}`)
  }
  if (norm === '/dev/') {
    throw new Error(`cannot unmount reserved prefix: /dev/`)
  }
  if (norm === HISTORY_PREFIX + '/') {
    throw new Error(`cannot unmount history view: ${HISTORY_PREFIX}`)
  }
  if (norm === BIN_PREFIX + '/') {
    throw new Error(`cannot unmount program view: ${BIN_PREFIX}`)
  }
  const entry = deps.registry.tryMountForPrefix(prefix, true)
  if (entry === null) throw new Error(`no mount at prefix: ${norm}`)
  if (entry.retiring) throw new Error(`mount is being unmounted: ${norm}`)
  entry.retiring = true
  try {
    await clearMountCache(deps.registry.fileCache, norm, [entry.indexStore])
    if (deps.isShuttingDown()) throw new Error('Workspace is closed')
    if (deps.registry.tryMountForPrefix(prefix, true) !== entry) {
      throw new Error(`mount changed while unmounting: ${prefix}`)
    }
    deps.registry.unmount(prefix)
  } catch (error) {
    entry.retiring = false
    throw error
  }
```

</details>

**依据 6 · 源码核查**：[typescript/packages/core/src/workspace/workspace/mounts.ts:179-186](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/core/src/workspace/workspace/mounts.ts#L179-L186)

卸载后关闭拥有的 VFS。

```text
  const vfs = entry.vfs
  const closing = closeVfs(deps, entry)
  deps.registry.retiringMounts.set(vfs, closing)
  try {
    await closing
  } finally {
    deps.registry.retiringMounts.delete(vfs)
  }
```

#### 缺口

- 没有同条件资源测量、并发压测或真实连接退出验收。
  **影响**：不能估计单位任务的现金支出、节时和生产可恢复性。
  **进一步探讨**：比较统一终端与两个专用客户端在相同测试数据和请求上限下的合格任务总耗时和源端调用数。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否让跨源失败的结果更容易被操作者核对？

**研究主题**：新假设与验证

#### 完整回答

可检验的设计方向是在命令退出码之外给出后端层面的阶段记录。当前跨挂载移动出错时可留下目标文件，故障缓存会驱逐但不会生成远端写入承诺。对照专用 SDK、当前 Mirage 和带逐源记录的 Mirage 原型，使用同一批假源注入目标写成功后源删除失败、目标部分写入及客户端超时但后端落地。原型分别标记已确认的目标写入、未证实的副作用和需要回读的源路径，并提供补偿依据而不擅自重试。以操作者是否正确识别重复和半成品、误重复次数和人工核对耗时衡量。如果记录无法降低误重试，或者因为额外日志暴露了未经许可的数据，假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[typescript/packages/core/src/commands/builtin/generic/mv.ts:639-662](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/core/src/commands/builtin/generic/mv.ts#L639-L662)

存在实际需要解释的跨源部分结果。

<details>
<summary>查看原文（24行）</summary>

```text
      // Across mounts GNU copies and then removes, and -v says so entry by
      // entry instead of `renamed` (coreutils 9.7).
      const verbose = flags.verbose ? lines : undefined
      const entries = await walk(strategy.readdir, stat, src)
      const copiedAll = await copyEntries('mv', strategy, stat, src, target, entries, errors, {
        copies,
        lines: verbose,
        rootBackup: made.backup,
      })
      // GNU keeps the whole source tree when any copy failed; the
      // destination keeps the entries that landed.
      if (!copiedAll) continue
      const removedAll = await removeEntries(
        strategy,
        stat,
        src,
        entries,
        errors,
        verbose,
        mountRoot,
      )
      // GNU leaves the copied destination in place and reports the source
      // entries it could not remove.
      if (!removedAll) continue
```

</details>

**依据 2 · 源码核查**：[typescript/packages/core/src/workspace/dispatcher/dispatcher.ts:3178-3192](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/core/src/workspace/dispatcher/dispatcher.ts#L3178-L3192)

失败缓存路径明确处理可能已改变的数据。

<details>
<summary>查看原文（15行）</summary>

```text
   *
   * A write that fails partway may already have changed the store (a
   * paginated delete, a copy that merged some children), so the caches at
   * and below every name it reaches go either way; the node table moves only
   * with a write that landed. The version the line held for each name is
   * kept, so the next write there stays conditioned on what the agent read,
   * and so is each version `lost` marks under them, which a refused
   * conditional write kept: a retry without a read is refused again.
   * Over-dropping costs a refetch. An eviction error is logged, not thrown,
   * so the caller still learns why the write failed. `owners`, for a call
   * that landed after its timeout, holds the mount each name was on when the
   * call started: a name another mount has taken since is that mount's now,
   * so nothing at or under it is touched. Mirrors Python's
   * Dispatcher._evict_failed_write, whose timed-out call is cancelled and
   * never lands late.
```

</details>

**依据 3 · 源码核查**：[typescript/packages/core/src/workspace/executor/fanout.ts:209-236](https://github.com/strukto-ai/mirage/blob/7761a83ebe084e03139f29438d2aa6e833282a5f/typescript/packages/core/src/workspace/executor/fanout.ts#L209-L236)

已有命令退出与来源范围可作对照。

<details>
<summary>查看原文（28行）</summary>

```text
      // A backend failure anywhere in the walk (a 5xx from a nested mount)
      // is this command's result, in its voice, as the single-mount entry point
      // reports it; the rest of the line still runs.
      io = new IOResult({
        exitCode: readFailExitCode(cmdName, err),
        stderr: formatFsError(cmdName, err, paths),
      })
    }
  }
  if (stdout !== null && !(stdout instanceof Uint8Array)) {
    // A walk that streams meets a failing mount as it is read; that failure
    // is this command's result too.
    stdout = framed(stdout, io, mountVoice(cmdName, paths))
  }
  // Only the mounts the walk can reach bound its output: a hidden one never
  // contributes a row, so its stricter limit must not apply.
  const prefixes = new Set([primaryMount.prefix])
  const reader = vfs === undefined ? null : readerOf(vfs)
  for (const path of paths) {
    if (path.walkError !== null) continue
    for (const mount of registry.descendantMounts(path.virtual))
      if (reader === null || reader.visible('/' + stripSlash(mount.prefix)))
        prefixes.add(mount.prefix)
  }
  io.producer = {
    command: cmdName,
    prefixes: [...prefixes].sort(compareCodePoints),
    declared: null,
```

</details>

#### 缺口

- 没有逐源记录原型及复现数据。
  **影响**：不能证明能减少恢复时间或重复写入。
  **进一步探讨**：构造受控故障任务，盲测操作者对后端状态和后续动作的判断。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
