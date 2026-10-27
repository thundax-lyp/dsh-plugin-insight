# Mirage

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[62c160c](https://github.com/strukto-ai/mirage/tree/62c160c6f47d455cf1bb604ed55c419f8ed254c2)

<!-- BEGIN META -->
[![GitHub ★ 3,724](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C724&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/strukto-ai/mirage)
<!-- END META -->

> **功能**：通过虚拟文件系统、命令和可配置运行时，为Agent提供统一终端接口。

> **亮点**：[Q02](#research-q02)将命令生命周期、挂载权限和session上下文统一，适合跨数据源管道；相对多SDK有实质组合增量，但不宣称文件语义消除外部系统差异。

> **主要限制**：[Q03](#research-q03)权限依赖VFS正确声明effect，跨源写入和runtime隔离也需分别核对；统一接口不能当通用事务或沙箱保证。

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
  - [Q01 · 虚拟终端对跨数据源Agent的具体任务价值是什么？](#detail-section-11)
  - [Q02 · 统一工作区如何把命令、运行时与存储权限连起来？](#detail-section-12)
  - [Q03 · 统一语义和权限边界在哪些情况下不能保证？](#detail-section-13)
  - [Q04 · 统一接口是否降低总接入成本？](#detail-section-14)
  - [Q05 · 如何检验统一终端是不是更好的接口？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：目标是Agent平台开发者将多个数据源挂成一个受控工作区，让Agent用ls/grep等熟悉操作读取材料并写出结果。合格结果是在正确权限下找到来源、产生可核对交付物，不能把统一路径当所有服务语义等价。原办法是各服务SDK/MCP或本地同步脚本；跨源管道较多时统一接口有价值，单源任务则直接API更简单。根项目是Python/TypeScript SDK与虚拟终端平台，DSH可加载适配另在typescript/packages/dsh，不能将根目录直接当宿主插件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 虚拟工作区 | 组合多个数据源 | SDK平台而非根目录DSH插件 |
| 统一shell | 用管道执行读写 | 依赖所选runtime和命令支持 |
| 挂载权限 | session收窄访问 | VFS需正确声明effect |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python或TypeScript SDK | 必需 | 工作区 | 无统一终端 |
| mount与runtime配置 | 必需 | 存储和执行 | 任务无法运行 |
| 数据源凭据 | 外部源必需 | 授权访问 | 对应挂载失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 平台方创建RAM/只读挂载 | 路径可读 |
| 2 | 配置session权限执行同任务 | 结果来源正确 |
| 3 | 验证拒绝越界与关闭 | 失败退直接SDK |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | SDK及runtime | 连接器和权限配置 | 人时未知 |
| 持续 | API、执行与缓存 | 语义映射维护 | token收益未测 |
| 失败恢复 | 重试与状态核对 | 跨源补偿 | 无统一业务事务保证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 接口组合 | shell与mount核心 | 对不同源的正确性 |
| 权限收窄 | session与effect检查 | 每个VFS声明完整性 |

> **思考**：[Q03](#research-q03)权限依赖VFS正确声明effect，跨源写入和runtime隔离也需分别核对；统一接口不能当通用事务或沙箱保证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)将命令生命周期、挂载权限和session上下文统一，适合跨数据源管道；相对多SDK有实质组合增量，但不宣称文件语义消除外部系统差异。

可借鉴配置上限与session收窄权限的分层；复用需保留effect声明和外部源语义。根仓全量统计不等于本轮已全审计；Python核心与连接器不纳入JS/TS代码总量。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)权限依赖VFS正确声明effect，跨源写入和runtime隔离也需分别核对；统一接口不能当通用事务或沙箱保证。

<a id="detail-section-6"></a>

### 1.5 使用建议

构建跨数据源Agent的平台开发者可先用RAM和只读测试源试验Mirage。相比分别维护多种工具接口，它把读取和管道组织到同一工作区，但节省token与维护成本尚未独立验证。若数据源语义或权限effect不能核清，就停止接入真实写账户并退回专用SDK。 依据 [Q01](#research-q01)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有实现为固定源码检查支持；用户收益未实测；未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、typescript/packages/core/src/workspace/workspace/workspace.ts、typescript/packages/core/src/workspace/mount/mount.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本轮只读固定提交，未执行目标代码或宿主验收；效果、人工耗时及持续采用情况未知。
- 下一步：以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

**分析版本**

- **仓库**：[strukto-ai/mirage](https://github.com/strukto-ai/mirage)
- **版本号**：未声明（[固定提交 62c160c](https://github.com/strukto-ai/mirage/tree/62c160c6f47d455cf1bb604ed55c419f8ed254c2)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出先只读、保留来源版本再逐步放行effect的未验证方向，与独立SDK对照合格交付和维护成本。

以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 62 | 7394 | — | — | 93316 |
| .jsx | source | 1 | 45 | 45 | 0 | — |
| .md | example | 22 | 1026 | — | — | 5911 |
| .ts | example | 246 | 32631 | 24405 | 4505 | — |
| .mjs | example | 7 | 513 | 434 | 47 | — |
| .ts | source | 2390 | 402416 | 282921 | 97193 | — |
| .js | source | 3 | 489 | 279 | 200 | — |
| .js | example | 4 | 46 | 43 | 0 | — |
| .mjs | source | 11 | 330 | 228 | 88 | — |
| .ts | test | 1551 | 325032 | 261052 | 40455 | — |

</details>

**活跃度**

[![Issue 未关闭 24](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=24&color=737b86&logo=github)](https://github.com/strukto-ai/mirage/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 73](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=73&color=737b86&logo=github)](https://github.com/strukto-ai/mirage/issues?q=is%3Aissue+created%3A2026-09-26T09%3A07%3A10.506Z..2026-10-26T09%3A07%3A10.506Z) [![近30天关闭 109](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=109&color=737b86&logo=github)](https://github.com/strukto-ai/mirage/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T09%3A07%3A10.506Z..2026-10-26T09%3A07%3A10.506Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查Mirage的具体任务增量、关键失败条件与可控采用路径。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 虚拟终端对跨数据源Agent的具体任务价值是什么？

**研究主题**：场景与需求、采用判断

#### 完整回答

目标是Agent平台开发者将多个数据源挂成一个受控工作区，让Agent用ls/grep等熟悉操作读取材料并写出结果。合格结果是在正确权限下找到来源、产生可核对交付物，不能把统一路径当所有服务语义等价。原办法是各服务SDK/MCP或本地同步脚本；跨源管道较多时统一接口有价值，单源任务则直接API更简单。根项目是Python/TypeScript SDK与虚拟终端平台，DSH可加载适配另在typescript/packages/dsh，不能将根目录直接当宿主插件。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:55-86](https://github.com/strukto-ai/mirage/blob/62c160c6f47d455cf1bb604ed55c419f8ed254c2/README.md#L55-L86)

作者场景、挂载和虚拟CLI示例

<details>
<summary>查看原文（32行）</summary>

````text
Mirage is **a Virtual Terminal for AI Agents**. The virtual filesystem delivers broad data context, virtualized CLIs give an agent more flexibility on tool use, dynamic runtimes save underlying infrastructure cost and are more token efficient, and fine-grained control over an agent's actions and even over what it can see gives the best security. Together these parts form one virtualized terminal, giving the best agent performance, cost efficiency and security.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/mirage-arch-dark.svg">
    <img src="assets/mirage-arch-light.svg" alt="Mirage architecture: agents and harness reach profiles and the Mirage shell, which resolve Unix-like commands, virtual CLIs and programming languages onto runtimes and the virtual filesystem, with authentication, the policy engine and notifications alongside" width="100%">
  </picture>
</p>

Here is an example of launching Mirage inside an application:

```python
ws = Workspace(
    {
        "/tmp":   (RAMVFS(), MountMode.EXEC),
        "/redis": (RedisVFS(url=redis_url), MountMode.WRITE),
        "/slack": (SlackVFS(SlackConfig(token=slack_bot_token)), MountMode.EXEC),
    },
    # monty captures python, so scripts run sandboxed inside the workspace
    runtimes=[MontyRuntime(captures=["python", "python3"]), "workspace"],
)

# one grep sweeps every source
await ws.shell("grep -rln session /redis /tmp")

# run a script that lives in Slack, file the report into Redis
await ws.shell("python3 /slack/channels/general_.../files/example__F....py > /redis/report.txt")

# install a typed CLI under a head word: dispatched by name, not by path,
# and discoverable through `man`, `type` and `which` like any other program
ws.register_cli("slack", SLACK, {"token": slack_bot_token})
await ws.shell('slack send-message --channel general --text "report is up"')
````

</details>

#### 缺口

- 真实跨源任务的频率和端到端收益没有独立对照。
  **影响**：缺少跨源真实任务的重复需求，平台价值可能只适合少数部署。
  **进一步探讨**：收集同一批跨源查询与报告任务，对照独立SDK工具核对来源遗漏、配置量及合格交付。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 统一工作区如何把命令、运行时与存储权限连起来？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

Workspace.shell建立ShellExecution，处理stream与sink互斥、shutdown拒绝，并把runShell结果收集或流式返回。Mount.effectiveMode使用配置模式为上限再由session收窄；requireWritable按被声明的操作effect、路径和subtree检查写权限。由此可见统一终端不只是给SDK换命令名，而是把调用上下文、挂载权限和流式生命周期放在同一层。相对为每服务写一套工具，接口组合有实质增量，但本轮只抽读TypeScript核心片段，不推断每个VFS实现都正确。

#### 证据与依据

**依据 1 · 源码核查**：[typescript/packages/core/src/workspace/workspace/workspace.ts:1717-1754](https://github.com/strukto-ai/mirage/blob/62c160c6f47d455cf1bb604ed55c419f8ed254c2/typescript/packages/core/src/workspace/workspace/workspace.ts#L1717-L1754)

shell生命周期和流式执行

<details>
<summary>查看原文（38行）</summary>

```text
  shell(command: string, options: ExecuteOptions & { stream: true }): Promise<ShellExecution>
  shell(command: string, options?: ExecuteOptions & { stream?: false }): Promise<ExecuteResult>
  shell(command: string, options: ExecuteOptions): Promise<ExecuteResult | ShellExecution>
  async shell(
    command: string,
    options: ExecuteOptions = {},
  ): Promise<ExecuteResult | ShellExecution> {
    if (options.stream && options.sink !== undefined)
      throw new Error('stream and sink are mutually exclusive')
    if (
      !options.stream &&
      (options.sink !== undefined ||
        options.evaluation !== undefined ||
        options.executionScope !== undefined)
    )
      return this.runShell(command, options)
    if (this.isShuttingDown()) throw new Error('Workspace is closed')
    const execution = new ShellExecution(
      (sink, signal, executionScope) =>
        this.runShell(command, {
          ...options,
          stream: false,
          sink,
          signal,
          executionScope,
        }),
      options.executionScope ?? new ExecutionScope(undefined, newExecutionId(this.ids)),
      options.signal,
      this.io.bufferBytes,
    )
    if (options.stream) {
      this.shellExecutions.add(execution)
      execution.onSettled(() => {
        this.shellExecutions.delete(execution)
      })
      return execution
    }
    return execution.collect()
```

</details>

**依据 2 · 源码核查**：[typescript/packages/core/src/workspace/mount/mount.ts:569-575](https://github.com/strukto-ai/mirage/blob/62c160c6f47d455cf1bb604ed55c419f8ed254c2/typescript/packages/core/src/workspace/mount/mount.ts#L569-L575)

会话权限只能收窄

```text
  /**
   * This mount's mode narrowed by the owner's cap, or the live sessions'
   * when no owner is supplied. The configured mode is the ceiling; a
   * session's mode can only weaken it.
   */
  effectiveMode(access?: SessionAccess): MountMode {
    return effectiveMountMode(this.prefix, this.mode, access)
```

**依据 3 · 源码核查**：[typescript/packages/core/src/workspace/mount/mount.ts:718-733](https://github.com/strukto-ai/mirage/blob/62c160c6f47d455cf1bb604ed55c419f8ed254c2/typescript/packages/core/src/workspace/mount/mount.ts#L718-L733)

基于effect和路径的写权限检查

<details>
<summary>查看原文（16行）</summary>

```text
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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 统一语义和权限边界在哪些情况下不能保证？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

requireWritable依赖VFS方法正确声明write effect；mark为null或非写effect会返回，因此扩展VFS需正确标记副作用。跨服务写入不自动构成事务，Slack发送和数据库写入的失败恢复仍是业务问题。runtime可配置为不同执行环境，不能把“虚拟终端”直接称操作系统隔离。数据源凭据、限流、分页和一致性会决定合格结果，挂载同一根目录不能抹平这些差异。

#### 证据与依据

**依据 1 · 源码核查**：[typescript/packages/core/src/workspace/mount/mount.ts:718-733](https://github.com/strukto-ai/mirage/blob/62c160c6f47d455cf1bb604ed55c419f8ed254c2/typescript/packages/core/src/workspace/mount/mount.ts#L718-L733)

权限校验依赖effect元数据

<details>
<summary>查看原文（16行）</summary>

```text
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

**依据 2 · 作者声明**：[README.md:89-95](https://github.com/strukto-ai/mirage/blob/62c160c6f47d455cf1bb604ed55c419f8ed254c2/README.md#L89-L95)

作者统一接口与动态runtime边界

```text
## About

- **Unified virtual terminal interface, not N SDKs and M MCPs.** Every backend speaks the same filesystem semantics, so pipelines compose across services.
- **A virtual filesystem over every source.** S3, Google Drive, Slack, Gmail, Redis and the rest mount side by side under one root, so an agent reaches all of them through a unified interface with the unix tools it already knows, like `ls`, `grep`, `find` and `jq`.
- **Virtual command line tools (CLIs).** `git`, `slack` and `ntn` are answered by Mirage itself, so an agent drives the service with nothing installed, across different runtimes and machines, and one tool can be virtualized into two or more, each under its own name with its own credentials.
- **Routed, dynamic runtimes.** Python, JavaScript and any other command can be sent to a configured runtime, in process, sandboxed or remote, which decouples computation from storage and lets either change without touching the other.
- **The virtualized Mirage shell.** It binds the filesystem, the CLIs and the runtimes into one command line, so pipes, redirection, variables, jobs and history work across all three.
```

#### 缺口

- 各VFS副作用声明、分页/一致性和具体runtime隔离范围尚未逐一审计。
  **影响**：effect漏标或后端语义不一可能使权限与结果外推失效。
  **进一步探讨**：按目标VFS逐方法核对effect声明和写权限，检查分页、一致性、失败补偿以及runtime的native/remote边界。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 统一接口是否降低总接入成本？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次平台方需安装SDK、配置mount/runtime和各数据源权限，持续仍需维护连接器及API费用。统一命令可减少Agent学习多个接口的成本，但平台方承担映射、缓存和服务故障处理；并未测token、合格率和维护人时。可以从RAM或只读测试数据源验证跨源读取，失败时回到直接SDK，不应先接真实可写账户。替换整个生产工具层的迁移和回滚成本尚高。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:64-86](https://github.com/strukto-ai/mirage/blob/62c160c6f47d455cf1bb604ed55c419f8ed254c2/README.md#L64-L86)

挂载与runtime需显式配置

<details>
<summary>查看原文（23行）</summary>

````text
Here is an example of launching Mirage inside an application:

```python
ws = Workspace(
    {
        "/tmp":   (RAMVFS(), MountMode.EXEC),
        "/redis": (RedisVFS(url=redis_url), MountMode.WRITE),
        "/slack": (SlackVFS(SlackConfig(token=slack_bot_token)), MountMode.EXEC),
    },
    # monty captures python, so scripts run sandboxed inside the workspace
    runtimes=[MontyRuntime(captures=["python", "python3"]), "workspace"],
)

# one grep sweeps every source
await ws.shell("grep -rln session /redis /tmp")

# run a script that lives in Slack, file the report into Redis
await ws.shell("python3 /slack/channels/general_.../files/example__F....py > /redis/report.txt")

# install a typed CLI under a head word: dispatched by name, not by path,
# and discoverable through `man`, `type` and `which` like any other program
ws.register_cli("slack", SLACK, {"token": slack_bot_token})
await ws.shell('slack send-message --channel general --text "report is up"')
````

</details>

**依据 2 · 源码核查**：[typescript/packages/core/src/workspace/workspace/workspace.ts:1724-1754](https://github.com/strukto-ai/mirage/blob/62c160c6f47d455cf1bb604ed55c419f8ed254c2/typescript/packages/core/src/workspace/workspace/workspace.ts#L1724-L1754)

执行选项与生命周期

<details>
<summary>查看原文（31行）</summary>

```text
    if (options.stream && options.sink !== undefined)
      throw new Error('stream and sink are mutually exclusive')
    if (
      !options.stream &&
      (options.sink !== undefined ||
        options.evaluation !== undefined ||
        options.executionScope !== undefined)
    )
      return this.runShell(command, options)
    if (this.isShuttingDown()) throw new Error('Workspace is closed')
    const execution = new ShellExecution(
      (sink, signal, executionScope) =>
        this.runShell(command, {
          ...options,
          stream: false,
          sink,
          signal,
          executionScope,
        }),
      options.executionScope ?? new ExecutionScope(undefined, newExecutionId(this.ids)),
      options.signal,
      this.io.bufferBytes,
    )
    if (options.stream) {
      this.shellExecutions.add(execution)
      execution.onSettled(() => {
        this.shellExecutions.delete(execution)
      })
      return execution
    }
    return execution.collect()
```

</details>

#### 缺口

- 跨源任务预算和连接器长期维护成本未量化。
  **影响**：平台方维护与迁移成本可能抵消接口统一收益。
  **进一步探讨**：记录每个connector配置/升级人时、API费用及一次合格跨源任务的失败重试与补偿。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何检验统一终端是不是更好的接口？

**研究主题**：新假设与验证

#### 完整回答

由统一权限与effect声明推导未验证假设：先提供只读多源视图，并为每个输出保留服务来源和版本，再逐步开放少量明确effect操作，可能在减少接口数的同时保留可追溯性。对照同数据的独立SDK工具与虚拟终端，观察来源遗漏、权限拒绝、合格结果和维护配置量；若统一路径增加语义误读或不能减少任务总成本，则限制为特定数据域。该假设不把所有外部系统都假装为本地强一致文件系统。

#### 证据与依据

**依据 1 · 源码核查**：[typescript/packages/core/src/workspace/mount/mount.ts:718-733](https://github.com/strukto-ai/mirage/blob/62c160c6f47d455cf1bb604ed55c419f8ed254c2/typescript/packages/core/src/workspace/mount/mount.ts#L718-L733)

effect和路径校验提供逐步开放边界

<details>
<summary>查看原文（16行）</summary>

```text
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

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
