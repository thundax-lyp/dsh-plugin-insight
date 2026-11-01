# Mirage

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[a94290f](https://github.com/strukto-ai/mirage/tree/a94290f5f3cd8086e9a945bbfe6c56e6db231fcb)

<!-- BEGIN META -->
[![GitHub ★ 3,759](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C759&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/strukto-ai/mirage)
<!-- END META -->

> **功能**：用虚拟文件系统、命令及运行时为 Agent 组合统一终端。

> **亮点**：组合多源虚拟路径、命令、session 和权限，DSH 是可选接入入口，本项不研究其实现。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：VFS 写入复查依赖 effect 声明；外部授权、runtime 隔离和跨源部分失败不能由统一路径自动保证。[Q03](#research-q03)

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
  - [Q01 · 谁需要统一虚拟终端，根项目与 DSH 适配是什么关系？](#detail-section-11)
  - [Q02 · 统一工作区如何组织命令和权限？](#detail-section-12)
  - [Q03 · 权限和统一路径在哪些情况下不足以保证隔离？](#detail-section-13)
  - [Q04 · 实际接入的成本和停止条件是什么？](#detail-section-14)
  - [Q05 · 如何检验统一终端是否值得采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要跨数据源管道的 Agent 平台开发者；单源任务可比较专用 API。[Q01](#research-q01)

分别接入 SDK/MCP 或维护本地同步脚本。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 多源 mount | 在统一路径访问服务 | 需授权和正确 effect |
| session shell | 跨源命令与管道 | backend 语义可能不同 |
| runtime 路由 | 选择执行环境 | 隔离取决于具体实现 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| Mirage SDK | 必需 | 工作区与 shell | 无统一接口 |
| 数据源凭据与授权 | 对应源必需 | 访问服务 | 调用失败 |
| 可信 runtime 与正确 effect | 写入和隔离必需 | 控制副作用 | 不接真实写账户 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 配置 | 用假源和只读 profile | 核对可见性 |
| 调用 | 运行同任务查询 | 比较 SDK 正确性 |
| 放开写入 | 逐项核验 effect 和恢复 | 不确定则停止 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 服务与 runtime 成本未知 | 集成凭据和挂载 | 内存数字是作者主张 |
| 持续 | 外部服务与执行费用 | 权限及后端维护 | token 节省未测 |
| 恢复 | 部分写入可能有成本 | 逐源对账 | 不保证跨源事务 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 统一入口 | mount 与 session shell 组合 | 所有服务语义一致 |
| 写权限 | 对声明 effect 复查 | 外部和未声明副作用安全 |

> **思考**：VFS 写入复查依赖 effect 声明；外部授权、runtime 隔离和跨源部分失败不能由统一路径自动保证。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：组合多源虚拟路径、命令、session 和权限，DSH 是可选接入入口，本项不研究其实现。[Q01](#research-q01) [Q02](#research-q02)

写入前重查路径和子树，用户 handler 另有隐藏及只读限制；未声明 effect 的函数不走该写入检查。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

VFS 写入复查依赖 effect 声明；外部授权、runtime 隔离和跨源部分失败不能由统一路径自动保证。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用低权限假源验证权限、输出及失败恢复；无法核实 effect 时停止真实写接入。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定 TypeScript 代码支持写入复查和用户 handler 拒绝；未运行 runtime、数据源或宿主。

- 已检查：作者 README、包清单、源码路径 README.md、typescript/packages/core/src/workspace/mount/mount.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根 inventory 4343 个指定扩展名文件、排除 35、解析错误 0；静态核查 TypeScript 代表路径和作者示例，不运行外部服务。
- 下一步：固定 SDK/runtime，以只读假源和隔离账户比较授权、写入、跨源错误与成本。

**分析版本**

- **仓库**：[strukto-ai/mirage](https://github.com/strukto-ai/mirage)
- **版本号**：未声明（[固定提交 a94290f](https://github.com/strukto-ai/mirage/tree/a94290f5f3cd8086e9a945bbfe6c56e6db231fcb)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：显示后端、声明 effect 和部分失败恢复信息可减少误判；对照 SDK 测正确率与成本。[Q05](#research-q05)

固定 SDK/runtime，以只读假源和隔离账户比较授权、写入、跨源错误与成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 62 | 8825 | — | — | 102083 |
| .jsx | source | 1 | 45 | 45 | 0 | — |
| .md | example | 24 | 1109 | — | — | 6338 |
| .ts | example | 256 | 33559 | 25081 | 4674 | — |
| .mjs | example | 8 | 646 | 519 | 84 | — |
| .ts | source | 2404 | 408033 | 287172 | 98389 | — |
| .js | source | 3 | 489 | 279 | 200 | — |
| .js | example | 4 | 46 | 43 | 0 | — |
| .mjs | source | 10 | 317 | 220 | 84 | — |
| .ts | test | 1571 | 342778 | 276531 | 42035 | — |

</details>

**活跃度**

[![Issue 未关闭 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=21&color=737b86&logo=github)](https://github.com/strukto-ai/mirage/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 53](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=53&color=737b86&logo=github)](https://github.com/strukto-ai/mirage/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 88](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=88&color=737b86&logo=github)](https://github.com/strukto-ai/mirage/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Mirage 统一虚拟终端如何组合多源与权限，成本和隔离边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要统一虚拟终端，根项目与 DSH 适配是什么关系？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

Mirage 面向要让 Agent 跨数据源用统一命令和管道处理材料的平台开发者；替代为分别接 SDK/MCP 或本地同步脚本，单源任务直接 API 更简单。根项目是 Python/TypeScript 虚拟终端平台，DSH 是可选接入入口，本项不归因其实现，也不把根目录当可直接加载的 DSH 插件。README 的内存和成本数字是作者主张，未独立验证。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:55-55](https://github.com/strukto-ai/mirage/blob/a94290f5f3cd8086e9a945bbfe6c56e6db231fcb/README.md#L55-L55)

作者描述虚拟终端及资源主张。

```text
Mirage is **a Virtual Terminal for AI Agents**: one shell over data, CLIs and runtimes. Unix tools reach every service, and `grep` runs on each service's own search, such as Gmail's or Slack's. Mirage routes each command to the runtime that fits it, so most lines run in-process and only heavy work reaches a sandbox, which cuts infrastructure cost and tokens. The terminal itself is light: a workspace takes **about 100 KB** of memory and each new session **about 10 KB**, so one process serves many agents at once. Profiles decide what an agent can run and even what it can see, and scriptable policies refuse anything those rules cannot express.
```

**依据 2 · 源码核查**：[README.md:64-80](https://github.com/strukto-ai/mirage/blob/a94290f5f3cd8086e9a945bbfe6c56e6db231fcb/README.md#L64-L80)

作者示例多源和 profile。

<details>
<summary>查看原文（17行）</summary>

````text
Here is an example of launching Mirage inside an application:

```python
ws = Workspace(
    {
        "/s3":    (S3VFS(S3Config(bucket="my-bucket")), MountMode.WRITE),
        "/slack": (SlackVFS(SlackConfig(token=slack_bot_token)), MountMode.EXEC),
        "/gmail": (GmailVFS(GmailConfig(**google_credentials)), MountMode.READ),
    },
    # Install the Slack CLI, run by name and listed by `man` and `which` like any program
    clis={"slack": (SLACK, {"token": slack_bot_token})},
    # the analyst profile hides /s3/secrets and denies posting to Slack and curl
    profiles={
        "analyst": {
            "paths": {"hide": ["/s3/secrets"]},
            "commands": {"deny": ["slack send-message", "curl"]},
        },
````

</details>

#### 缺口

- 未运行运行时、外部数据源或 DSH 宿主
  **影响**：无法证明隔离、跨源语义和成本收益
  **进一步探讨**：固定版本并用只读模拟源比较接口与权限

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 统一工作区如何组织命令和权限？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

作者示例配置不同 mount 模式、profile 的隐藏路径和命令拒绝，再按命令选择运行时；同一 session 运行 shell。TypeScript mount 在执行写入时再次读取有效权限，处理子树及复制目标；对用户 handler 的隐藏 mount 或只读写命令有前置拒绝。源码支持具体协议，不保证任何外部数据源一致性或每个 runtime 都是沙箱。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:64-100](https://github.com/strukto-ai/mirage/blob/a94290f5f3cd8086e9a945bbfe6c56e6db231fcb/README.md#L64-L100)

多 mount、profile、runtime 路由和 session。

<details>
<summary>查看原文（37行）</summary>

````text
Here is an example of launching Mirage inside an application:

```python
ws = Workspace(
    {
        "/s3":    (S3VFS(S3Config(bucket="my-bucket")), MountMode.WRITE),
        "/slack": (SlackVFS(SlackConfig(token=slack_bot_token)), MountMode.EXEC),
        "/gmail": (GmailVFS(GmailConfig(**google_credentials)), MountMode.READ),
    },
    # Install the Slack CLI, run by name and listed by `man` and `which` like any program
    clis={"slack": (SLACK, {"token": slack_bot_token})},
    # the analyst profile hides /s3/secrets and denies posting to Slack and curl
    profiles={
        "analyst": {
            "paths": {"hide": ["/s3/secrets"]},
            "commands": {"deny": ["slack send-message", "curl"]},
        },
    },
    runtimes=[
        MontyRuntime(captures=["python", "python3"]),
        E2BRuntime(
            captures=["python", "python3"],
            config={"sandbox_id": sandbox_id, "mount_type": "ssh"},
        ),
    ],
    # route the underlying computation: numpy lines run in the e2b sandbox, the rest on monty
    route_policy=lambda ctx: "e2b" if "numpy" in ctx.line else None,
)

# Add an agent using the analyst profile
alice = await ws.session("alice", profile="analyst")

# one grep sweeps S3, Slack and Gmail, on each service's own search where it has one
await alice.shell("grep -rlw invoice /s3 /slack /gmail")

# run a script that lives in Slack on monty, file the report into S3
await alice.shell("python3 /slack/channels/general__C0123/2026-10-21/files/report__F0456.py > /s3/report.txt")
````

</details>

**依据 2 · 源码核查**：[typescript/packages/core/src/workspace/mount/mount.ts:745-770](https://github.com/strukto-ai/mirage/blob/a94290f5f3cd8086e9a945bbfe6c56e6db231fcb/typescript/packages/core/src/workspace/mount/mount.ts#L745-L770)

执行写入前再次检查目标权限。

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

**依据 3 · 源码核查**：[typescript/packages/core/src/workspace/mount/mount.ts:2043-2057](https://github.com/strukto-ai/mirage/blob/a94290f5f3cd8086e9a945bbfe6c56e6db231fcb/typescript/packages/core/src/workspace/mount/mount.ts#L2043-L2057)

用户 handler 与内建命令的不同限制点。

<details>
<summary>查看原文（15行）</summary>

```text
   * Refuse a user handler on a hidden mount, or a writer on a read-only one.
   *
   * A user handler can reach its accessor directly, so a hidden mount's
   * handler must never run, even when an explicit operand or cwd selected it.
   * It answers an unknown command without revealing the hidden mount's name.
   *
   * Mirage's own commands write through the dispatcher, which refuses each
   * write in the command's own GNU voice, because only the write knows
   * whether a line writes: `gzip -c`, `tar -t` and `split -n 1/2` read a
   * read-only mount like any reader, and `gzip f` is refused at the write of
   * `f.gz`. A user command (`isUserCommand`) may reach its service some other
   * way, which no gate would see, so one that writes is refused here, before
   * it runs. strongestModeUnder, not effectiveMode: a mount whose only
   * writable region is a show entry still runs it. Only wrapper-owned
   * responses (an injected help or version) bypass it: a handler that
```

</details>

#### 缺口

- 未运行运行时、外部数据源或 DSH 宿主
  **影响**：无法证明隔离、跨源语义和成本收益
  **进一步探讨**：固定版本并用只读模拟源比较接口与权限

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 权限和统一路径在哪些情况下不足以保证隔离？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

requireWritable 只检查 VFS 已声明的 write effect：声明为空或非写效应时直接返回，因此自定义 VFS 漏报副作用可能绕过此项检查；不能将其外推为全部策略失效，因为用户命令还有单独前置限制。不同后端的授权、排序、搜索、写入副作用及 runtime 隔离仍需逐项验证；跨源管道不是通用跨系统事务，部分写入后的恢复也需设计。

#### 证据与依据

**依据 1 · 源码核查**：[typescript/packages/core/src/workspace/mount/mount.ts:755-770](https://github.com/strukto-ai/mirage/blob/a94290f5f3cd8086e9a945bbfe6c56e6db231fcb/typescript/packages/core/src/workspace/mount/mount.ts#L755-L770)

未声明或非写 effect 时该检查直接返回。

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

**依据 2 · 源码核查**：[typescript/packages/core/src/workspace/mount/mount.ts:2043-2057](https://github.com/strukto-ai/mirage/blob/a94290f5f3cd8086e9a945bbfe6c56e6db231fcb/typescript/packages/core/src/workspace/mount/mount.ts#L2043-L2057)

用户 handler 另有前置拒绝。

<details>
<summary>查看原文（15行）</summary>

```text
   * Refuse a user handler on a hidden mount, or a writer on a read-only one.
   *
   * A user handler can reach its accessor directly, so a hidden mount's
   * handler must never run, even when an explicit operand or cwd selected it.
   * It answers an unknown command without revealing the hidden mount's name.
   *
   * Mirage's own commands write through the dispatcher, which refuses each
   * write in the command's own GNU voice, because only the write knows
   * whether a line writes: `gzip -c`, `tar -t` and `split -n 1/2` read a
   * read-only mount like any reader, and `gzip f` is refused at the write of
   * `f.gz`. A user command (`isUserCommand`) may reach its service some other
   * way, which no gate would see, so one that writes is refused here, before
   * it runs. strongestModeUnder, not effectiveMode: a mount whose only
   * writable region is a show entry still runs it. Only wrapper-owned
   * responses (an injected help or version) bypass it: a handler that
```

</details>

**依据 3 · 源码核查**：[README.md:82-100](https://github.com/strukto-ai/mirage/blob/a94290f5f3cd8086e9a945bbfe6c56e6db231fcb/README.md#L82-L100)

示例使用不同运行时和跨源读写。

<details>
<summary>查看原文（19行）</summary>

```text
    runtimes=[
        MontyRuntime(captures=["python", "python3"]),
        E2BRuntime(
            captures=["python", "python3"],
            config={"sandbox_id": sandbox_id, "mount_type": "ssh"},
        ),
    ],
    # route the underlying computation: numpy lines run in the e2b sandbox, the rest on monty
    route_policy=lambda ctx: "e2b" if "numpy" in ctx.line else None,
)

# Add an agent using the analyst profile
alice = await ws.session("alice", profile="analyst")

# one grep sweeps S3, Slack and Gmail, on each service's own search where it has one
await alice.shell("grep -rlw invoice /s3 /slack /gmail")

# run a script that lives in Slack on monty, file the report into S3
await alice.shell("python3 /slack/channels/general__C0123/2026-10-21/files/report__F0456.py > /s3/report.txt")
```

</details>

#### 缺口

- 未运行运行时、外部数据源或 DSH 宿主
  **影响**：无法证明隔离、跨源语义和成本收益
  **进一步探讨**：固定版本并用只读模拟源比较接口与权限

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 实际接入的成本和停止条件是什么？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

跨源采用需要配置各服务认证、挂载、权限、命令和适合的执行 runtime，并维护后端行为变化；统一接口不会消除供应商费用、凭据管理、网络以及审计成本。先用内存或只读假源、低权限服务账户验证搜索、隐藏、写拒绝与恢复；不能核实 effect 或隔离、或产生未预期写入就停止真实凭据接入并回退专用 SDK。尚无同任务成本或 token 对照。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:64-90](https://github.com/strukto-ai/mirage/blob/a94290f5f3cd8086e9a945bbfe6c56e6db231fcb/README.md#L64-L90)

多源凭据、profile 与 runtime 配置。

<details>
<summary>查看原文（27行）</summary>

````text
Here is an example of launching Mirage inside an application:

```python
ws = Workspace(
    {
        "/s3":    (S3VFS(S3Config(bucket="my-bucket")), MountMode.WRITE),
        "/slack": (SlackVFS(SlackConfig(token=slack_bot_token)), MountMode.EXEC),
        "/gmail": (GmailVFS(GmailConfig(**google_credentials)), MountMode.READ),
    },
    # Install the Slack CLI, run by name and listed by `man` and `which` like any program
    clis={"slack": (SLACK, {"token": slack_bot_token})},
    # the analyst profile hides /s3/secrets and denies posting to Slack and curl
    profiles={
        "analyst": {
            "paths": {"hide": ["/s3/secrets"]},
            "commands": {"deny": ["slack send-message", "curl"]},
        },
    },
    runtimes=[
        MontyRuntime(captures=["python", "python3"]),
        E2BRuntime(
            captures=["python", "python3"],
            config={"sandbox_id": sandbox_id, "mount_type": "ssh"},
        ),
    ],
    # route the underlying computation: numpy lines run in the e2b sandbox, the rest on monty
    route_policy=lambda ctx: "e2b" if "numpy" in ctx.line else None,
````

</details>

**依据 2 · 源码核查**：[typescript/packages/core/src/workspace/mount/mount.ts:755-770](https://github.com/strukto-ai/mirage/blob/a94290f5f3cd8086e9a945bbfe6c56e6db231fcb/typescript/packages/core/src/workspace/mount/mount.ts#L755-L770)

写入权限取决于 effect。

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

**依据 3 · 源码核查**：[README.md:55-55](https://github.com/strukto-ai/mirage/blob/a94290f5f3cd8086e9a945bbfe6c56e6db231fcb/README.md#L55-L55)

作者资源和成本主张。

```text
Mirage is **a Virtual Terminal for AI Agents**: one shell over data, CLIs and runtimes. Unix tools reach every service, and `grep` runs on each service's own search, such as Gmail's or Slack's. Mirage routes each command to the runtime that fits it, so most lines run in-process and only heavy work reaches a sandbox, which cuts infrastructure cost and tokens. The terminal itself is light: a workspace takes **about 100 KB** of memory and each new session **about 10 KB**, so one process serves many agents at once. Profiles decide what an agent can run and even what it can see, and scriptable policies refuse anything those rules cannot express.
```

#### 缺口

- 未运行运行时、外部数据源或 DSH 宿主
  **影响**：无法证明隔离、跨源语义和成本收益
  **进一步探讨**：固定版本并用只读模拟源比较接口与权限

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何检验统一终端是否值得采用？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

未验证假设：对每次跨源执行展示实际后端、声明 effect 和部分失败恢复线索，可能减少来源误判与非预期写入；现有写权限重查和用户 handler 拒绝是反证，不是现有系统没有控制。对照 SDK/MCP 执行相同只读和受控写任务，测结果正确率、授权误拒漏拒、部分失败恢复时间、成本与 token；外部授权、真实隔离或收益无法测清时不推广。

#### 证据与依据

**依据 1 · 源码核查**：[typescript/packages/core/src/workspace/mount/mount.ts:745-770](https://github.com/strukto-ai/mirage/blob/a94290f5f3cd8086e9a945bbfe6c56e6db231fcb/typescript/packages/core/src/workspace/mount/mount.ts#L745-L770)

现有后端写入前复查。

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

**依据 2 · 源码核查**：[typescript/packages/core/src/workspace/mount/mount.ts:2043-2057](https://github.com/strukto-ai/mirage/blob/a94290f5f3cd8086e9a945bbfe6c56e6db231fcb/typescript/packages/core/src/workspace/mount/mount.ts#L2043-L2057)

现有用户 handler 前置控制。

<details>
<summary>查看原文（15行）</summary>

```text
   * Refuse a user handler on a hidden mount, or a writer on a read-only one.
   *
   * A user handler can reach its accessor directly, so a hidden mount's
   * handler must never run, even when an explicit operand or cwd selected it.
   * It answers an unknown command without revealing the hidden mount's name.
   *
   * Mirage's own commands write through the dispatcher, which refuses each
   * write in the command's own GNU voice, because only the write knows
   * whether a line writes: `gzip -c`, `tar -t` and `split -n 1/2` read a
   * read-only mount like any reader, and `gzip f` is refused at the write of
   * `f.gz`. A user command (`isUserCommand`) may reach its service some other
   * way, which no gate would see, so one that writes is refused here, before
   * it runs. strongestModeUnder, not effectiveMode: a mount whose only
   * writable region is a show entry still runs it. Only wrapper-owned
   * responses (an injected help or version) bypass it: a handler that
```

</details>

**依据 3 · 源码核查**：[README.md:93-103](https://github.com/strukto-ai/mirage/blob/a94290f5f3cd8086e9a945bbfe6c56e6db231fcb/README.md#L93-L103)

作者跨源管道例子。

<details>
<summary>查看原文（11行）</summary>

```text
# Add an agent using the analyst profile
alice = await ws.session("alice", profile="analyst")

# one grep sweeps S3, Slack and Gmail, on each service's own search where it has one
await alice.shell("grep -rlw invoice /s3 /slack /gmail")

# run a script that lives in Slack on monty, file the report into S3
await alice.shell("python3 /slack/channels/general__C0123/2026-10-21/files/report__F0456.py > /s3/report.txt")

# numpy is not in monty, so the route policy sends this line to e2b
await alice.shell("python3 -c 'import numpy; print(numpy.arange(10).sum())'")
```

</details>

#### 缺口

- 未运行运行时、外部数据源或 DSH 宿主
  **影响**：无法证明隔离、跨源语义和成本收益
  **进一步探讨**：固定版本并用只读模拟源比较接口与权限

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
