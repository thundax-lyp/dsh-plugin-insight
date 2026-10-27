# Coding Tools MCP

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[47dbccf](https://github.com/xyTom/coding-tools-mcp/tree/47dbccf2c3d6fa27eacf8970c8cd44d3dbcd3377)

<!-- BEGIN META -->
[![GitHub ★ 1,214](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C214&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xyTom/coding-tools-mcp)
<!-- END META -->

> **功能**：通过 MCP 为编码客户端提供工作区文件、结构化修改、命令会话和 Git 工具。

> **亮点**：把编码执行和可审修改统一为MCP运行时，并用权限模式、基线与恢复减少自建工具负担；不代表所有客户端或任意代码安全。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：非Linux命令仍有用户完整权限，dangerous会关关键限制；多文件备份替换不等瞬时跨文件原子可见或崩溃恢复通过。[Q03](#research-q03)

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
  - [Q01 · 已有聊天客户端为什么要加此MCP运行时？](#detail-section-11)
  - [Q02 · 权限模式和多文件修改怎样工作？](#detail-section-12)
  - [Q03 · safe是否可在所有平台隔离任意代码？](#detail-section-13)
  - [Q04 · 什么人可低范围试用，成本与退路是什么？](#detail-section-14)
  - [Q05 · 如何验证修改事务比普通脚本更可恢复？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：MCP聊天客户端缺少本地仓库能力时接入；已有原生等价工具的用户需比较重复负担。[Q01](#research-q01)

自建文件/exec MCP或客户端原生仓库工具；本项目增加统一约束，但不必然替代已有完整运行时。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 文件和修改 | 读搜与基线保护patch | 单workspace，需审diff |
| 命令会话 | PTY执行与输出 | 平台隔离不同，不可信代码需容器 |
| Git/运行时 | 查看仓库和环境 | 不替代真实任务验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Python>=3.11及uv/pipx | 启动必需 | 运行服务 | npm不能替代 |
| MCP客户端和workspace | 必需 | 工具调用和路径范围 | 固定可丢弃repo |
| Landlock Linux能力 | 内核约束需要 | 限命令文件系统 | 非Linux不能当隔离 |
| 容器/VM | 不可信代码需 | 外部执行隔离 | 不在真实用户环境执行 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户配stdio/safe和备份repo | 核环境警告 |
| 读取 | 客户端读与搜 | 范围符合预期 |
| 修改 | Agent单次结构化patch | 审diff与目标检查 |
| 故障 | 用户查备份和最终摘要 | 未知结果先核不盲重发 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Python与客户端/工具链；金额未知 | 配MCP和单workspace，核环境 | npm仍需Python |
| 持续使用 | 模型、命令和缓存 | 权限批准与diff审阅 | 任务单位成本未知 |
| 失败恢复 | 备份与可丢弃repo | 查进程、文件及rollback | 强杀恢复未验收 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 中立工具接入 | MCP/单workspace设计 | 客户端兼容与修复率 |
| 修改保护 | 基线、备份与异常rollback | 强杀/断电恢复 |
| 命令约束 | Linux Landlock接线 | 所有平台隔离 |

> **思考**：非Linux命令仍有用户完整权限，dangerous会关关键限制；多文件备份替换不等瞬时跨文件原子可见或崩溃恢复通过。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把编码执行和可审修改统一为MCP运行时，并用权限模式、基线与恢复减少自建工具负担；不代表所有客户端或任意代码安全。[Q01](#research-q01) [Q02](#research-q02)

基线revision、分级匹配、恢复失败保留备份及明确环境警告值得借鉴；移植需文件系统语义、内核与权限交互验收。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

非Linux命令仍有用户完整权限，dangerous会关关键限制；多文件备份替换不等瞬时跨文件原子可见或崩溃恢复通过。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议缺原生工具的MCP用户在可丢弃repo以safe/stdio试用，先读再做可审单改；不可信命令需外部容器，状态不明则停并回原工具。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

权限矩阵、修改事务和Landlock接线有源码支持；跨平台隔离与强杀恢复未执行。可查询事务为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、coding_tools_mcp/server.py、coding_tools_mcp/patching.py、coding_tools_mcp/landlock_exec.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定README、Python server权限/环境检查、patching与Landlock helper；未全审命令解析/OAuth/全部工具，未运行目标测试、MCP或内核实验。Python不计JS/TS LOC。
- 下一步：可丢弃repo在四阶段强杀并核最终摘要、重复应用、备份及进程，另验平台隔离；本轮未执行。[Q05](#research-q05)

**分析版本**

- **仓库**：[xyTom/coding-tools-mcp](https://github.com/xyTom/coding-tools-mcp)
- **版本号**：未声明（[固定提交 47dbccf](https://github.com/xyTom/coding-tools-mcp/tree/47dbccf2c3d6fa27eacf8970c8cd44d3dbcd3377)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是跨请求可查询修改事务，响应丢失先核状态再重发，在固定强杀点比较重复、损失和恢复时间。[Q05](#research-q05)

可丢弃repo在四阶段强杀并核最终摘要、重复应用、备份及进程，另验平台隔离；本轮未执行。[Q05](#research-q05)

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

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

[![Issue 未关闭 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=14&color=737b86&logo=github)](https://github.com/xyTom/coding-tools-mcp/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：模型中立MCP编码运行时的权限与修改恢复带来什么增量，跨平台隔离边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 已有聊天客户端为什么要加此MCP运行时？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是已有MCP聊天客户端却没有可用本地编码执行能力的开发者。服务把文件搜索、结构化多文件修改、命令/PTY和Git接入一个workspace，合格结果是审阅真实diff、命令退出与目标测试，而非模型说已改。相比自己写文件/exec工具，它提供权限模式、统一输出和修改冲突检查；若客户端已有同等仓库工具，再叠一层MCP可能增加配置而非收益。README工具数量和37%字节下降属于作者特定工作负载报告，未独立复现，不等更好修复率。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-21](https://github.com/xyTom/coding-tools-mcp/blob/47dbccf2c3d6fa27eacf8970c8cd44d3dbcd3377/README.md#L14-L21)

作者给出模型中立工具范围。

```text
Coding Tools MCP is a **model-neutral coding runtime** served over the
[Model Context Protocol](https://modelcontextprotocol.io): file reading and
search, structured multi-file patches, command execution, interactive
sessions, and git — one server that any MCP client can drive. Claude Desktop,
Claude Code, Codex, Cursor, Cline, VS Code, Windsurf, Gemini CLI, or an agent
you build yourself gets the default catalog of 18 battle-tested tools, confined
to one workspace and gated by permission modes.

```

**依据 2 · 作者声明**：[README.md:26-43](https://github.com/xyTom/coding-tools-mcp/blob/47dbccf2c3d6fa27eacf8970c8cd44d3dbcd3377/README.md#L26-L43)

相对自建工具的权限与结果压缩主张。

<details>
<summary>查看原文（18行）</summary>

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
  release-over-release on the deterministic dogfood workload with unchanged
  task completion.

## Quickstart

```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 权限模式和多文件修改怎样工作？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Python server以单workspace作为路径根，safe/trusted/dangerous配置分别改变网络、shell expansion、inline scripts、环境过滤和Landlock。文件修改在patching中先准备临时内容，检查所有baseline，再逐个备份/替换；异常时尝试整组rollback，恢复失败保留备份。这能检测并发基线冲突并避免普通异常留下未说明的半改，但“atomic across files”不能理解为所有文件对并发读者瞬间原子可见；崩溃/断电仍需验证。Landlock helper先no_new_privs再restrict_self后exec shell，显示有内核接线而非纯文档，实际内核能力仍需环境探测。可借鉴是统一修改revision与分级匹配、失败恢复证据。

#### 证据与依据

**依据 1 · 源码核查**：[coding_tools_mcp/server.py:168-195](https://github.com/xyTom/coding-tools-mcp/blob/47dbccf2c3d6fa27eacf8970c8cd44d3dbcd3377/coding_tools_mcp/server.py#L168-L195)

模式实际能力矩阵。

<details>
<summary>查看原文（28行）</summary>

```text
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
    ),
```

</details>

**依据 2 · 源码核查**：[coding_tools_mcp/patching.py:198-244](https://github.com/xyTom/coding-tools-mcp/blob/47dbccf2c3d6fa27eacf8970c8cd44d3dbcd3377/coding_tools_mcp/patching.py#L198-L244)

准备、基线重查、逐文件替换及rollback。

<details>
<summary>查看原文（47行）</summary>

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
                preserve_backups = True
                display_by_path = {change.path: change.display for change in changes}
                recovery_backups = {
                    display_by_path.get(path, str(path)): str(backup)
```

</details>

**依据 3 · 源码核查**：[coding_tools_mcp/landlock_exec.py:33-59](https://github.com/xyTom/coding-tools-mcp/blob/47dbccf2c3d6fa27eacf8970c8cd44d3dbcd3377/coding_tools_mcp/landlock_exec.py#L33-L59)

Linux专有内核限制调用。

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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · safe是否可在所有平台隔离任意代码？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

不能。check_exec_environment明确说明非Linux命令具用户完整权限，Landlock不可用也会警告；dangerous还关闭Landlock及秘密环境过滤。workspace文件路径检查不等任意命令的操作系统隔离，因此不可信PR应放可丢弃容器/VM，不能仅因模式叫safe便信任。远程隧道又增加认证、令牌和端口管理，未在本轮审计OAuth全链，不把作者支持声明等同安全验收。多文件rollback降低常规失败影响，但并发读者、进程被杀与恢复失败的边界仍需具体实验。

#### 证据与依据

**依据 1 · 源码核查**：[coding_tools_mcp/server.py:2391-2419](https://github.com/xyTom/coding-tools-mcp/blob/47dbccf2c3d6fa27eacf8970c8cd44d3dbcd3377/coding_tools_mcp/server.py#L2391-L2419)

真实平台与dangerous警告。

<details>
<summary>查看原文（29行）</summary>

```text
    def check_exec_environment(self, args: dict[str, Any]) -> dict[str, Any]:
        landlock = landlock_status_payload()
        warnings: list[str] = []
        # Landlock is the only filesystem confinement this server has, and it is
        # Linux-only. Elsewhere a command runs with the whole user account's
        # reach, which callers must be told rather than left to infer.
        if sys.platform != "linux":
            warnings.append(
                f"platform {sys.platform} has no filesystem confinement for exec_command; "
                "commands run with full user privileges outside the workspace"
            )
        if not landlock.get("available"):
            warnings.append("Linux Landlock filesystem confinement is unavailable")
        mutation = self.workspace_mutation_payload()
        warnings.extend(str(item) for item in mutation.get("warnings", []))
        if self.capabilities.skip_all_permissions:
            warnings.append("permission_mode=dangerous disables MCP safety gates")
        if self.fake_readonly_annotations:
            warnings.append(
                "tools/list annotations are faked as read-only; apply_patch and exec_command still mutate and execute"
            )
        return {
            "ok": True,
            **self._exec_environment_summary(),
            "landlock_enabled": self._landlock_enforced(landlock),
            "landlock_abi": landlock.get("abi_version"),
            "global_tmp_write": self.global_tmp_write_policy(),
            "workspace_mutation_policy": mutation,
            "warnings": warnings,
```

</details>

**依据 2 · 源码核查**：[coding_tools_mcp/patching.py:227-244](https://github.com/xyTom/coding-tools-mcp/blob/47dbccf2c3d6fa27eacf8970c8cd44d3dbcd3377/coding_tools_mcp/patching.py#L227-L244)

替换及失败恢复显示非单一跨文件原子操作。

<details>
<summary>查看原文（18行）</summary>

```text
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
                preserve_backups = True
                display_by_path = {change.path: change.display for change in changes}
                recovery_backups = {
                    display_by_path.get(path, str(path)): str(backup)
```

</details>

**依据 3 · 作者声明**：[README.md:177-194](https://github.com/xyTom/coding-tools-mcp/blob/47dbccf2c3d6fa27eacf8970c8cd44d3dbcd3377/README.md#L177-L194)

模式与非完整OS沙箱说明。

<details>
<summary>查看原文（18行）</summary>

```text
contents) to help prioritize fixes. Disable it with
`CODING_TOOLS_MCP_TELEMETRY=off` or `DO_NOT_TRACK=1`; it is automatically off
in CI. `CODING_TOOLS_MCP_TELEMETRY=debug` prints every event to stderr instead
of sending. The full event list and guarantees are in
[docs/telemetry.md](docs/telemetry.md).

## Evidence, Dogfood and SWE-bench

Every release ships through a tag-triggered pipeline in which the compliance
suite, real-workload benchmark, and SWE-bench harness run from the same commit
that publishes to PyPI and npm — both via trusted publishing, npm with
provenance. Dogfood efficiency metrics are reproducible (`make dogfood-smoke`)
and checked in under `reports/`. This repository does not claim a
model-generated SWE-bench leaderboard result — see
[docs/swe-bench.md](docs/swe-bench.md) for exactly what is and is not
measured. More: [COMPLIANCE.md](COMPLIANCE.md) · [BENCHMARK.md](BENCHMARK.md) ·
[docs/dogfood.md](docs/dogfood.md)

```

</details>

#### 缺口

- 内核能力、跨平台命令越界、远程认证与中途崩溃恢复未执行验证。
  **影响**：不能给任意代码隔离或远程生产安全结论。
  **进一步探讨**：在隔离容器固定平台，模拟外部读写、强杀与认证失效，检查实际状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么人可低范围试用，成本与退路是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

缺少原生仓库工具的MCP客户端用户，可先在可丢弃repo保持safe、stdio，只读后做一个可审结构化修改。首次需要Python>=3.11与uv/pipx；npm只是启动器，不应当成纯Node服务。持续投入包括客户端模型费用、命令工具链、权限批准和diff审阅，服务本身不证明免费或自动完成。失败恢复要核对备份/真实文件与命令进程；把原repo备份与Git diff作为外部核对，不能只信工具回执。若环境无隔离又要执行不可信代码、备份恢复不清或客户端已有更合适工具，应停并回原生工具/容器方案。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:45-55](https://github.com/xyTom/coding-tools-mcp/blob/47dbccf2c3d6fa27eacf8970c8cd44d3dbcd3377/README.md#L45-L55)

Python服务和npm启动器区别。

<details>
<summary>查看原文（11行）</summary>

````text
from PyPI; the npm package is a thin launcher that starts it via `uv` or
`pipx`):

```bash
uvx coding-tools-mcp --stdio --workspace /path/to/repo   # Python toolchain
npx coding-tools-mcp --stdio --workspace /path/to/repo   # Node toolchain
```

Wire it into Claude Desktop, Claude Code, Codex, Cursor, VS Code, Windsurf,
Gemini CLI, or Cline — the JSON is the same everywhere (swap `uvx` for `npx`
if you prefer Node):
````

</details>

**依据 2 · 源码核查**：[coding_tools_mcp/patching.py:238-244](https://github.com/xyTom/coding-tools-mcp/blob/47dbccf2c3d6fa27eacf8970c8cd44d3dbcd3377/coding_tools_mcp/patching.py#L238-L244)

恢复失败保留备份提供排障依据。

```text
        except Exception as exc:
            rollback_errors = self._rollback(mutations, prepared, backups, installed, created_dirs)
            if rollback_errors:
                preserve_backups = True
                display_by_path = {change.path: change.display for change in changes}
                recovery_backups = {
                    display_by_path.get(path, str(path)): str(backup)
```

**依据 3 · 源码核查**：[coding_tools_mcp/server.py:2391-2419](https://github.com/xyTom/coding-tools-mcp/blob/47dbccf2c3d6fa27eacf8970c8cd44d3dbcd3377/coding_tools_mcp/server.py#L2391-L2419)

环境检查作为试用条件。

<details>
<summary>查看原文（29行）</summary>

```text
    def check_exec_environment(self, args: dict[str, Any]) -> dict[str, Any]:
        landlock = landlock_status_payload()
        warnings: list[str] = []
        # Landlock is the only filesystem confinement this server has, and it is
        # Linux-only. Elsewhere a command runs with the whole user account's
        # reach, which callers must be told rather than left to infer.
        if sys.platform != "linux":
            warnings.append(
                f"platform {sys.platform} has no filesystem confinement for exec_command; "
                "commands run with full user privileges outside the workspace"
            )
        if not landlock.get("available"):
            warnings.append("Linux Landlock filesystem confinement is unavailable")
        mutation = self.workspace_mutation_payload()
        warnings.extend(str(item) for item in mutation.get("warnings", []))
        if self.capabilities.skip_all_permissions:
            warnings.append("permission_mode=dangerous disables MCP safety gates")
        if self.fake_readonly_annotations:
            warnings.append(
                "tools/list annotations are faked as read-only; apply_patch and exec_command still mutate and execute"
            )
        return {
            "ok": True,
            **self._exec_environment_summary(),
            "landlock_enabled": self._landlock_enforced(landlock),
            "landlock_abi": landlock.get("abi_version"),
            "global_tmp_write": self.global_tmp_write_policy(),
            "workspace_mutation_policy": mutation,
            "warnings": warnings,
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何验证修改事务比普通脚本更可恢复？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是在多文件修改输出中绑定基线、每文件替换状态、恢复备份与最后校验，让断线客户端可以先查状态再重发。由Q02的分阶段替换与Q03恢复边界推导，增量是处理未知结果而非多做一次patch。最小实验固定三文件repo，在prepare、备份、第二个替换和响应发送四位置强杀，对比普通脚本、当前实现与可查询事务原型。观察丢失修改、重复应用、能否准确判定状态和恢复耗时；若状态仍不确定或查回显著增加维护而不减错，就否定。不能把普通异常rollback已经存在说成跨进程崩溃恢复已实现。

#### 证据与依据

**依据 1 · 源码核查**：[coding_tools_mcp/patching.py:198-244](https://github.com/xyTom/coding-tools-mcp/blob/47dbccf2c3d6fa27eacf8970c8cd44d3dbcd3377/coding_tools_mcp/patching.py#L198-L244)

多个提交阶段与失败备份是假设基础。

<details>
<summary>查看原文（47行）</summary>

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
                preserve_backups = True
                display_by_path = {change.path: change.display for change in changes}
                recovery_backups = {
                    display_by_path.get(path, str(path)): str(backup)
```

</details>

#### 缺口

- 强杀后的事务查询和恢复收益未建立。
  **影响**：设计方向未验证。
  **进一步探讨**：固定注入点和最终文件摘要做可重复对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
