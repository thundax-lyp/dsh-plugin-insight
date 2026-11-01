# Coding Tools MCP

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[9f37c83](https://github.com/xyTom/coding-tools-mcp/tree/9f37c8313344d7a3e4486dacbd36bb0c3a59b48d)

<!-- BEGIN META -->
[![GitHub ★ 1,218](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C218&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xyTom/coding-tools-mcp)
<!-- END META -->

> **功能**：通过 MCP 提供工作区文件、补丁、命令和 Git 编码工具。

> **亮点**：把文件、补丁和命令组织成可由多客户端调用的 MCP 工作区接口。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：safe 不是完整跨平台 OS 沙箱；多路径回滚不是单个原子事务。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 已有聊天客户端为什么需要该 MCP 运行时？](#detail-section-11)
  - [Q02 · 多文件补丁如何处理冲突和失败？](#detail-section-12)
  - [Q03 · safe 模式是否在所有平台隔离任意代码？](#detail-section-13)
  - [Q04 · 怎样低范围试用并解释统计异常？](#detail-section-14)
  - [Q05 · 怎样证明多文件恢复比普通脚本更可信？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需让 MCP 聊天客户端处理代码仓库的开发者；基线是现有编码 Agent 或手工 shell。[Q01](#research-q01)

使用客户端原生编码工具或人工 shell 与 Git。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 工作区工具 | 文件和命令 | 权限模式需配置 |
| 多文件补丁 | 核基线并替换 | 回滚非跨文件原子 |
| Landlock | Linux 文件约束 | 非完整 OS 沙箱 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| Python 与 MCP 客户端 | 必需 | 运行工具 | 回原生方式 |
| 独立工作区 | 必需 | 限定操作 | 不执行 |
| 额外沙箱 | 不可信代码需要 | 系统隔离 | 不执行 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 准备 | 可丢弃仓库和隔离环境 | 核对模式 |
| 修改 | 预览并应用样本 | 核对结果 |
| 恢复 | 模拟冲突 | 回滚失败停止 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Python 与隔离资源 | 配置客户端 | 环境未测 |
| 持续 | 命令和模型资源 | 审核修改 | 节时未测 |
| 恢复 | 备份与磁盘 | 复核逐文件状态 | 不是跨文件原子事务 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 补丁 | 预备、核基线与回滚 | 系统崩溃全恢复 |
| 权限 | safe 模式选择 Landlock | 各平台完整隔离 |

> **思考**：safe 不是完整跨平台 OS 沙箱；多路径回滚不是单个原子事务。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把文件、补丁和命令组织成可由多客户端调用的 MCP 工作区接口。[Q01](#research-q01) [Q02](#research-q02)

逐文件 rename 和尝试回滚不是跨路径原子事务；Landlock 仅适用支持的 Linux。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

safe 不是完整跨平台 OS 沙箱；多路径回滚不是单个原子事务。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

在隔离环境用可丢弃仓库验证补丁和权限；不可信工作缺额外沙箱时停止。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持权限配置及补丁预备/回滚；未运行系统隔离与目标。

- 已检查：作者 README、包清单、源码路径 README.md、coding_tools_mcp/server.py、coding_tools_mcp/patching.py、coding_tools_mcp/landlock_exec.py、apps/desktop-client/mcp_desktop_client/locales/app_zh_CN.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 72 个指定扩展名文件、无排除；1649 条解析诊断均因 Qt XML 翻译文件以 .ts 命名，未运行目标。
- 下一步：用可丢弃仓库及隔离环境核验并发写入、回滚及平台约束。

**分析版本**

- **仓库**：[xyTom/coding-tools-mcp](https://github.com/xyTom/coding-tools-mcp)
- **版本号**：未声明（[固定提交 9f37c83](https://github.com/xyTom/coding-tools-mcp/tree/9f37c8313344d7a3e4486dacbd36bb0c3a59b48d)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：逐目标展示基线、提交与回滚状态可减少恢复时间；须对照现有事务流程。[Q05](#research-q05)

用可丢弃仓库及隔离环境核验并发写入、回滚及平台约束。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 61 | 7179 | — | — | 51619 |
| .ts | source | 3 | 768 | 766 | 4 | — |
| .mjs | source | 1 | 561 | 489 | 10 | — |
| .tsx | source | 2 | 483 | 460 | 6 | — |
| .js | source | 1 | 56 | 47 | 6 | — |
| .js | test | 1 | 87 | 73 | 0 | — |
| .js | example | 2 | 19 | 15 | 0 | — |
| .md | example | 1 | 3 | — | — | 11 |

</details>

**活跃度**

[![Issue 未关闭 15](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=15&color=737b86&logo=github)](https://github.com/xyTom/coding-tools-mcp/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/xyTom/coding-tools-mcp/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/xyTom/coding-tools-mcp/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：通用 MCP 编码工具如何限制命令并恢复多文件修改，安全模式的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 已有聊天客户端为什么需要该 MCP 运行时？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要让支持 MCP 的聊天客户端读取、搜索、补丁和运行命令的开发者可用该通用服务器；替代为已有编码 Agent、手工 shell 或客户端原生工具。它集中提供工作区和权限模式，不保证所有客户端或模型能正确使用。README 中工具数量和 token 节省是作者声明，本轮没有效果对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-21](https://github.com/xyTom/coding-tools-mcp/blob/9f37c8313344d7a3e4486dacbd36bb0c3a59b48d/README.md#L14-L21)

作者描述 MCP 工作区及工具。

```text
Coding Tools MCP is a **model-neutral coding runtime** served over the
[Model Context Protocol](https://modelcontextprotocol.io): file reading and
search, structured multi-file patches, command execution, interactive
sessions, and git — one server that any MCP client can drive. Claude Desktop,
Claude Code, Codex, Cursor, Cline, VS Code, Windsurf, Gemini CLI, or an agent
you build yourself gets the default catalog of 18 battle-tested tools, confined
to one workspace and gated by permission modes.

```

**依据 2 · 作者声明**：[README.md:26-38](https://github.com/xyTom/coding-tools-mcp/blob/9f37c8313344d7a3e4486dacbd36bb0c3a59b48d/README.md#L26-L38)

作者描述安全和成本主张。

<details>
<summary>查看原文（13行）</summary>

```text
- **It turns a chat app into a coding agent.** Claude Desktop — or any MCP
  chat client — gets real repo access with the subscription you already have.
  No extra product required.
- **Safety is the product, not an afterthought.** One workspace root per
  server. Absolute paths, `..` traversal, and symlink escapes are rejected.
  Permission modes gate network access, shell expansion, inline scripts, and
  destructive commands. On Linux, [Landlock](docs/security-boundary.md) adds
  kernel-level filesystem confinement.
- **It is model- and vendor-neutral.** A truthfully annotated, mode-aware
  catalog — no profile switching, no annotation games. Swap models or clients
  freely; the runtime contract stays put.
- **It is engineered for context windows.** Results are summarized, paginated,
  and capped by design; serialized tool-result bytes dropped 37%
```

</details>

#### 缺口

- 未运行 MCP、命令或真实操作系统隔离
  **影响**：无法证明跨平台安全性和补丁恢复
  **进一步探讨**：用可丢弃仓库和隔离沙箱验证权限、冲突及恢复

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 多文件补丁如何处理冲突和失败？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

提交先验证唯一目标并为写入准备临时文件，再检查各目标基线；移动原文件前再次检查，随后逐个原子替换。异常会尝试对已修改路径回滚并收集回滚错误；每次 rename 原子不等于跨所有路径的系统事务，崩溃或回滚失败仍需人工恢复。

#### 证据与依据

**依据 1 · 源码核查**：[coding_tools_mcp/patching.py:185-190](https://github.com/xyTom/coding-tools-mcp/blob/9f37c8313344d7a3e4486dacbd36bb0c3a59b48d/coding_tools_mcp/patching.py#L185-L190)

作者说明单路径原子与无跨路径事务。

```text

class AtomicPatchCommitter:
    """Commit staged paths with atomic renames and full-set rollback.

    Filesystems do not provide a portable transaction spanning unrelated paths.
    Every replacement here is atomic; originals are retained as same-directory
```

**依据 2 · 源码核查**：[coding_tools_mcp/patching.py:198-240](https://github.com/xyTom/coding-tools-mcp/blob/9f37c8313344d7a3e4486dacbd36bb0c3a59b48d/coding_tools_mcp/patching.py#L198-L240)

准备、基线复核、替换和回滚。

<details>
<summary>查看原文（43行）</summary>

```text
    def commit(self, changes: list[StagedFile]) -> None:
        if not changes:
            return
        self._assert_unique_paths(changes)
        mutations = [change for change in changes if change.action != "verify"]
        created_dirs: list[Path] = []
        prepared: dict[Path, Path] = {}
        backups: dict[Path, Path] = {}
        installed: set[Path] = set()
        preserve_backups = False
        try:
            for change in mutations:
                created_dirs.extend(_ensure_parent(change.path.parent))
                if change.action == "write":
                    prepared[change.path] = _prepare_file(change)

            for change in changes:
                self._assert_baseline(change)

            for change in mutations:
                # Recheck immediately before moving each original. If a later
                # path conflicts, earlier backups are restored as a set.
                self._assert_baseline(change)
                if change.path.exists():
                    backup = _reserve_backup_path(change.path.parent)
                    os.replace(change.path, backup)
                    backups[change.path] = backup
                    _fsync_directory(change.path.parent)

            for change in mutations:
                prepared_path = prepared.get(change.path)
                if prepared_path is not None:
                    # A newly-created target has no backup. Do not silently
                    # overwrite a file created after patch staging.
                    if change.path not in backups:
                        self._assert_baseline(change)
                    os.replace(prepared_path, change.path)
                    installed.add(change.path)
                    _fsync_directory(change.path.parent)

        except Exception as exc:
            rollback_errors = self._rollback(mutations, prepared, backups, installed, created_dirs)
            if rollback_errors:
```

</details>

#### 缺口

- 未运行 MCP、命令或真实操作系统隔离
  **影响**：无法证明跨平台安全性和补丁恢复
  **进一步探讨**：用可丢弃仓库和隔离沙箱验证权限、冲突及恢复

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · safe 模式是否在所有平台隔离任意代码？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

safe 配置启用 Landlock 能力，但内核隔离取决于 Linux 实际支持；助手执行前设置 no_new_privs 和 restrict_self 失败会拒绝该启动路径。作者同时说明其他平台仅有警告，整体不是完整 OS 沙箱；网络、进程及非文件资源不能因为标签 safe 自动视为隔离。

#### 证据与依据

**依据 1 · 源码核查**：[coding_tools_mcp/server.py:158-194](https://github.com/xyTom/coding-tools-mcp/blob/9f37c8313344d7a3e4486dacbd36bb0c3a59b48d/coding_tools_mcp/server.py#L158-L194)

三类模式的能力设置。

<details>
<summary>查看原文（37行）</summary>

```text

    network: bool
    shell_expansion: bool
    inline_script: bool
    landlock: bool
    secret_env_filter: bool
    global_tmp_write: str  # "blocked" | "tmp-prefix" | "allowed"
    skip_all_permissions: bool


PERMISSION_MODE_CAPABILITIES: dict[str, ModeCapabilities] = {
    "safe": ModeCapabilities(
        network=False,
        shell_expansion=False,
        inline_script=False,
        landlock=True,
        secret_env_filter=True,
        global_tmp_write="blocked",
        skip_all_permissions=False,
    ),
    "trusted": ModeCapabilities(
        network=True,
        shell_expansion=True,
        inline_script=True,
        landlock=True,
        secret_env_filter=True,
        global_tmp_write="tmp-prefix",
        skip_all_permissions=False,
    ),
    "dangerous": ModeCapabilities(
        network=True,
        shell_expansion=True,
        inline_script=True,
        landlock=False,
        secret_env_filter=False,
        global_tmp_write="allowed",
        skip_all_permissions=True,
```

</details>

**依据 2 · 源码核查**：[coding_tools_mcp/landlock_exec.py:33-59](https://github.com/xyTom/coding-tools-mcp/blob/9f37c8313344d7a3e4486dacbd36bb0c3a59b48d/coding_tools_mcp/landlock_exec.py#L33-L59)

内核约束失败及执行。

<details>
<summary>查看原文（27行）</summary>

```text
def main(argv: list[str] | None = None) -> int:
    if sys.platform != "linux":
        return fail("landlock_exec is only supported on Linux")
    args = list(sys.argv[1:] if argv is None else argv)
    if len(args) != 2:
        return fail("landlock_exec requires: <ruleset-fd> <command>")
    try:
        ruleset_fd = int(args[0])
    except ValueError:
        return fail("landlock_exec received an invalid ruleset fd")
    cmd = args[1]

    rc = int(landlock_libc().prctl(PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0))
    if rc != 0:
        err = ctypes.get_errno()
        return fail(f"failed to set no_new_privs before Landlock restrict: {os.strerror(err)}")
    rc = libc_syscall(SYS_LANDLOCK_RESTRICT_SELF, ruleset_fd, 0)
    if rc != 0:
        err = ctypes.get_errno()
        return fail(f"failed to apply Landlock restrict_self: {os.strerror(err)}")
    try:
        os.close(ruleset_fd)
    except OSError:
        pass

    shell = os.environ.get("SHELL") or shutil.which("sh") or "/bin/sh"
    os.execvpe(shell, [shell, "-c", cmd], os.environ)
```

</details>

**依据 3 · 作者声明**：[README.md:164-169](https://github.com/xyTom/coding-tools-mcp/blob/9f37c8313344d7a3e4486dacbd36bb0c3a59b48d/README.md#L164-L169)

作者说明平台与完整沙箱边界。

```text
Recursive listing and search exclude `.git`, `node_modules`, build outputs,
virtualenvs, and caches. Commands run with workspace-bound cwd, scrubbed
environment, timeouts, and output caps. Linux hosts with Landlock get
kernel-enforced filesystem confinement; other platforms get an explicit
warning — this is still not a complete OS sandbox, so use the Docker image or
a VM for genuinely untrusted work. Details:
```

#### 缺口

- 未运行 MCP、命令或真实操作系统隔离
  **影响**：无法证明跨平台安全性和补丁恢复
  **进一步探讨**：用可丢弃仓库和隔离沙箱验证权限、冲突及恢复

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样低范围试用并解释统计异常？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要 Python 3.11+、兼容 MCP 客户端和独立工作区；不可信代码应使用额外隔离环境。先在可丢弃仓库检查权限模式、预览、冲突和恢复，不符预期则停止并回退原生工具。inventory 报 1649 条解析诊断均针对 Qt 翻译 XML app_zh_CN.ts：该文件首行为 XML、DOCTYPE TS，因扩展名被 TypeScript 解析，不是 1649 个目标代码缺陷；统计仍原样保留。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-44](https://github.com/xyTom/coding-tools-mcp/blob/9f37c8313344d7a3e4486dacbd36bb0c3a59b48d/README.md#L39-L44)

作者说明 Python 与启动方式。

```text
  release-over-release on the deterministic dogfood workload with unchanged
  task completion.

## Quickstart

Run it with whichever toolchain you already have (the server is Python ≥ 3.11
```

**依据 2 · 作者声明**：[README.md:164-169](https://github.com/xyTom/coding-tools-mcp/blob/9f37c8313344d7a3e4486dacbd36bb0c3a59b48d/README.md#L164-L169)

额外隔离建议。

```text
Recursive listing and search exclude `.git`, `node_modules`, build outputs,
virtualenvs, and caches. Commands run with workspace-bound cwd, scrubbed
environment, timeouts, and output caps. Linux hosts with Landlock get
kernel-enforced filesystem confinement; other platforms get an explicit
warning — this is still not a complete OS sandbox, so use the Docker image or
a VM for genuinely untrusted work. Details:
```

**依据 3 · 源码核查**：[apps/desktop-client/mcp_desktop_client/locales/app_zh_CN.ts:1-6](https://github.com/xyTom/coding-tools-mcp/blob/9f37c8313344d7a3e4486dacbd36bb0c3a59b48d/apps/desktop-client/mcp_desktop_client/locales/app_zh_CN.ts#L1-L6)

该 .ts 文件实际为 Qt 翻译 XML。

```text
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE TS>
<TS version="2.1" language="zh_CN" sourcelanguage="en_US">
<context>
    <name>LanguageManager</name>
    <message>
```

#### 缺口

- 未运行 MCP、命令或真实操作系统隔离
  **影响**：无法证明跨平台安全性和补丁恢复
  **进一步探讨**：用可丢弃仓库和隔离沙箱验证权限、冲突及恢复

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样证明多文件恢复比普通脚本更可信？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：提供每个目标基线、已提交及回滚结果的可核对清单，可能减少部分失败后的恢复时间。现有预备、二次基线检查和回滚错误是反证，并非没有事务防护；额外清单也不能保证机器突然断电后的系统原子性。对照普通脚本，以竞争写入、权限失败、进程中断及回滚失败测数据损失、识别率和恢复成本；无改善则否定。

#### 证据与依据

**依据 1 · 源码核查**：[coding_tools_mcp/patching.py:198-240](https://github.com/xyTom/coding-tools-mcp/blob/9f37c8313344d7a3e4486dacbd36bb0c3a59b48d/coding_tools_mcp/patching.py#L198-L240)

已有准备、复核与回滚。

<details>
<summary>查看原文（43行）</summary>

```text
    def commit(self, changes: list[StagedFile]) -> None:
        if not changes:
            return
        self._assert_unique_paths(changes)
        mutations = [change for change in changes if change.action != "verify"]
        created_dirs: list[Path] = []
        prepared: dict[Path, Path] = {}
        backups: dict[Path, Path] = {}
        installed: set[Path] = set()
        preserve_backups = False
        try:
            for change in mutations:
                created_dirs.extend(_ensure_parent(change.path.parent))
                if change.action == "write":
                    prepared[change.path] = _prepare_file(change)

            for change in changes:
                self._assert_baseline(change)

            for change in mutations:
                # Recheck immediately before moving each original. If a later
                # path conflicts, earlier backups are restored as a set.
                self._assert_baseline(change)
                if change.path.exists():
                    backup = _reserve_backup_path(change.path.parent)
                    os.replace(change.path, backup)
                    backups[change.path] = backup
                    _fsync_directory(change.path.parent)

            for change in mutations:
                prepared_path = prepared.get(change.path)
                if prepared_path is not None:
                    # A newly-created target has no backup. Do not silently
                    # overwrite a file created after patch staging.
                    if change.path not in backups:
                        self._assert_baseline(change)
                    os.replace(prepared_path, change.path)
                    installed.add(change.path)
                    _fsync_directory(change.path.parent)

        except Exception as exc:
            rollback_errors = self._rollback(mutations, prepared, backups, installed, created_dirs)
            if rollback_errors:
```

</details>

**依据 2 · 源码核查**：[coding_tools_mcp/patching.py:298-318](https://github.com/xyTom/coding-tools-mcp/blob/9f37c8313344d7a3e4486dacbd36bb0c3a59b48d/coding_tools_mcp/patching.py#L298-L318)

回滚错误记录。

<details>
<summary>查看原文（21行）</summary>

```text
    def _rollback(
        changes: list[StagedFile],
        prepared: dict[Path, Path],
        backups: dict[Path, Path],
        installed: set[Path],
        created_dirs: list[Path],
    ) -> list[str]:
        errors: list[str] = []
        for path in reversed([change.path for change in changes]):
            try:
                if path in installed and path.exists() and not path.is_dir():
                    path.unlink()
                backup = backups.get(path)
                if backup is not None:
                    if not backup.exists():
                        errors.append(f"{path}: recovery backup is missing")
                        continue
                    os.replace(backup, path)
                    _fsync_directory(path.parent)
            except OSError as rollback_error:
                errors.append(f"{path}: {rollback_error}")
```

</details>

#### 缺口

- 未运行 MCP、命令或真实操作系统隔离
  **影响**：无法证明跨平台安全性和补丁恢复
  **进一步探讨**：用可丢弃仓库和隔离沙箱验证权限、冲突及恢复

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
