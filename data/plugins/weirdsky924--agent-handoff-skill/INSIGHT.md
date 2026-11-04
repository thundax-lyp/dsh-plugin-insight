# Agent Handoff Skill

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[ef01fa9](https://github.com/WeirdSky924/agent-handoff-skill/tree/ef01fa9db0ea0aab19141954644a1049da4da795)

<!-- BEGIN META -->
[![GitHub ★ 31](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=31&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/WeirdSky924/agent-handoff-skill)
<!-- END META -->

> **功能**：为多种编码 Agent 建立仓库级交接文件，并辅助初始化、维护和归档。

> **亮点**：用仓库可查的入口和分文件记录承接会话，容量治理按字节执行，减少对模型随意决定截断的依赖。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：脚本理解文件形状和大小，事实正确性仍要回读仓库，权限和钩子还有独立开关。见 [Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 新会话如何从仓库恢复待办，初始化又怎样保留旧内容？](#detail-section-11)
  - [Q02 · 容量治理能否自动保证交接事实准确？](#detail-section-12)
  - [Q03 · 怎样把仓库变更限定在可审查范围？](#detail-section-13)
  - [Q04 · 拆分接力入口能否降低恢复成本？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：同一项目由不同会话接力时，维护者可以保存目标、验证和下一步供新会话查阅。

对照手工一页交接和从聊天复制摘要。任务短或只有一次交接时不必维护整套布局。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 交接入口 | 恢复项目状态 | 由 Agent 核事实 |
| 初始化 | 创建缺失材料 | 先检查项目规则 |
| 归档 | 限制默认读取体积 | 非语义审核 |

**流程与依赖**

| 依赖 | 用途 | 条件 |
| --- | --- | --- |
| Agent Skill 宿主 | 读取规则 | 核对项目级发现 |
| Python 3.10+ | 运行脚本 | Markdown 可手工替代 |
| 项目读写权限 | 创建与维护文件 | 先预览变更 |

| 步骤 | 操作 | 退出 |
| --- | --- | --- |
| 预览 | 核对现有文件和 dry run | 保留原布局 |
| 试验 | 在测试仓库打开新会话 | 核对目标和验证来源 |
| 退出 | 按差异撤销引导 | 保留必要记录 |

**效果与成本**

| 阶段 | 负担 | 计量 |
| --- | --- | --- |
| 首次 | 选择布局和审查规则 | 配置人时 |
| 持续 | 更新事实和归档 | 每次交接人时 |
| 失败 | 退回原规则或手工摘要 | 核对遗留文件 |

| 结果 | 判据 | 边界 |
| --- | --- | --- |
| 可恢复状态 | 新会话能定位验证和下一步 | 真实宿主未测 |
| 限制体积 | 归档仍可追溯 | 脚本不核事实 |

> **思考**：脚本理解文件形状和大小，事实正确性仍要回读仓库，权限和钩子还有独立开关。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：用仓库可查的入口和分文件记录承接会话，容量治理按字节执行，减少对模型随意决定截断的依赖。见 [Q01](#research-q01)、[Q02](#research-q02)。

marker 边界把模板更新和用户规则分离，维护按字节处理归档。

<a id="detail-section-5"></a>

### 1.4 主要限制

脚本理解文件形状和大小，事实正确性仍要回读仓库，权限和钩子还有独立开关。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先用测试仓库预览，核对规则差异后再试一次新会话。证据或范围不明就退回原入口。见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核对 bootstrap、容量和选项接线。不同宿主发现、并发维护与恢复收益尚未运行验证。

- 已检查：作者 README、包清单、源码路径 SKILL.md、scripts/bootstrap_handoff.py、scripts/maintain_handoff.py、README.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 Skill、市场清单、bootstrap 与维护关键分支，未执行脚本或实际加载宿主。
- 下一步：用一次性副本对照预览、实写、归档和新会话恢复。

**分析版本**

- **仓库**：[WeirdSky924/agent-handoff-skill](https://github.com/WeirdSky924/agent-handoff-skill)
- **版本号**：未声明（[固定提交 ef01fa9](https://github.com/WeirdSky924/agent-handoff-skill/tree/ef01fa9db0ea0aab19141954644a1049da4da795)）
- **版本日期**：2026-08-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在交接次数和事实清单一致时，比较多布局与人工单页的错误恢复和总人时。见 [Q04](#research-q04)。

用一次性副本对照预览、实写、归档和新会话恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 2114 | — | — | 16476 |
| .mjs | source | 1 | 414 | 363 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/WeirdSky924/agent-handoff-skill/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/WeirdSky924/agent-handoff-skill/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/WeirdSky924/agent-handoff-skill/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：仓库级交接材料能否让新会话可靠地恢复任务，以及初始化与压缩会改变哪些本地文件？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 新会话如何从仓库恢复待办，初始化又怎样保留旧内容？

**研究主题**：场景与需求、功能与机制、工程质量与复用

#### 完整回答

同一项目跨会话交接的维护者需要新 Agent 能定位目标、验证结果和下一步。根 SKILL 指定默认多文件，把入口索引与 snapshot、工作区、决策、验证等分开，也保留单文档模式。脚本对缺失的交接文件做创建，对已有文件保留，规则区域用 marker 更新，dry run 只记录预期变更。相较从旧聊天复制整段摘要，新会话能先读短入口再按需展开，且已有规则可留在 marker 之外。初始化不能校验用户刚刚切换的分支或上次测试是否仍有效，新会话仍须回读真实仓库。

#### 证据与依据

**依据 1 · 源码核查**：[SKILL.md:31-45](https://github.com/WeirdSky924/agent-handoff-skill/blob/ef01fa9db0ea0aab19141954644a1049da4da795/SKILL.md#L31-L45)

布局、事实未知标记和重新读取

<details>
<summary>查看原文（15行）</summary>

```text
## Layout Choice

- `multi` layout is the default for real projects. It creates `AGENT_HANDOFF.md` as a short index and `.agent-handoff/*.md` for state files.
- `single` layout is the legacy compact mode for small projects. It keeps all recovery state in `AGENT_HANDOFF.md`.
- Do not force-migrate an existing `AGENT_HANDOFF.md`. If it exists, preserve it and repair or migrate manually from repository facts.

## Workflow

1. Inspect the repository before writing files.
2. Identify existing agent guidance files: `AGENTS.md`, `CLAUDE.md`, `.claude/CLAUDE.md`, `.claude/rules/`, `.claude/settings.json`, README files, docs, source roots, test configuration, and obvious subprojects.
3. If bootstrapping a new mechanism, prefer running `scripts/bootstrap_handoff.py` from this skill to create safe scaffolding and idempotent project handoff rule blocks.
4. If repairing or reviewing an existing mechanism, read `references/quality.md`, inspect the current files, then edit the repository files directly with factual updates.
5. Always keep the handoff content evidence-based. Use `UNKNOWN` for facts that cannot be verified from the repository or user request.
6. For multi layout, run `scripts/maintain_handoff.py --repo <repo-root> --compact-if-needed` after meaningful handoff updates and before closeout.
7. Re-read files you created or changed before reporting completion.
```

</details>

**依据 2 · 源码核查**：[scripts/bootstrap_handoff.py:643-679](https://github.com/WeirdSky924/agent-handoff-skill/blob/ef01fa9db0ea0aab19141954644a1049da4da795/scripts/bootstrap_handoff.py#L643-L679)

dry-run 写入路径、保留已有文件、marker 更新

<details>
<summary>查看原文（37行）</summary>

```text
def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.exists() else ""


def write_text(path: Path, content: str, dry_run: bool, changed: list[str]) -> None:
    old = read_text(path)
    if old == content:
        return
    if not dry_run:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8", newline="\n")
    item = str(path)
    if item not in changed:
        changed.append(item)


def create_if_missing(path: Path, content: str, dry_run: bool, changed: list[str], notes: list[str]) -> None:
    if path.exists():
        notes.append(f"Preserved existing {path}; inspect and repair manually if needed.")
        return
    write_text(path, content, dry_run, changed)


def replace_marked_block(original: str, block: str) -> str:
    start = original.find(START)
    end = original.find(END)
    if start != -1 and end != -1 and end > start:
        end += len(END)
        prefix = original[:start].rstrip()
        suffix = original[end:].lstrip()
        parts = [part for part in [prefix, block.strip(), suffix] if part]
        return "\n\n".join(parts) + "\n"
    if not original.strip():
        return block.strip() + "\n"
    return original.rstrip() + "\n\n" + block.strip() + "\n"


```

</details>

**依据 3 · 源码核查**：[scripts/bootstrap_handoff.py:804-818](https://github.com/WeirdSky924/agent-handoff-skill/blob/ef01fa9db0ea0aab19141954644a1049da4da795/scripts/bootstrap_handoff.py#L804-L818)

两布局与文件创建

<details>
<summary>查看原文（15行）</summary>

```text
def create_single_layout(repo: Path, dry_run: bool, changed: list[str], notes: list[str]) -> None:
    create_if_missing(repo / "AGENT_HANDOFF.md", single_handoff_template(repo), dry_run, changed, notes)


def create_multi_layout(repo: Path, dry_run: bool, changed: list[str], notes: list[str]) -> None:
    handoff_dir = repo / ".agent-handoff"
    create_if_missing(repo / "AGENT_HANDOFF.md", multi_index_template(repo), dry_run, changed, notes)
    create_if_missing(handoff_dir / "snapshot.md", multi_snapshot_template(repo), dry_run, changed, notes)
    create_if_missing(handoff_dir / "workspace.md", multi_workspace_template(), dry_run, changed, notes)
    create_if_missing(handoff_dir / "decisions.md", multi_decisions_template(), dry_run, changed, notes)
    create_if_missing(handoff_dir / "work-log.md", multi_work_log_template(), dry_run, changed, notes)
    create_if_missing(handoff_dir / "validation.md", multi_validation_template(), dry_run, changed, notes)
    create_if_missing(handoff_dir / "backlog.md", multi_backlog_template(), dry_run, changed, notes)
    create_if_missing(handoff_dir / "risks.md", multi_risks_template(), dry_run, changed, notes)
    create_if_missing(handoff_dir / "archive.md", multi_archive_template(), dry_run, changed, notes)
```

</details>

**依据 4 · 源码核查**：[scripts/bootstrap_handoff.py:858-875](https://github.com/WeirdSky924/agent-handoff-skill/blob/ef01fa9db0ea0aab19141954644a1049da4da795/scripts/bootstrap_handoff.py#L858-L875)

规则路径与布局的实际接线

<details>
<summary>查看原文（18行）</summary>

```text

    if args.layout == "multi":
        create_multi_layout(repo, args.dry_run, changed, notes)
    else:
        create_single_layout(repo, args.dry_run, changed, notes)

    write_agents = args.platform in ("codex", "dsh", "both") and not args.skip_codex_rules
    write_claude = args.platform in ("claude", "both") and not args.skip_claude_rules

    if write_agents:
        agents_path = repo / "AGENTS.md"
        updated = replace_marked_block(read_text(agents_path), rule_block(args.layout))
        write_text(agents_path, updated, args.dry_run, changed)

    if write_claude:
        claude_path = repo / ".claude" / "CLAUDE.md"
        updated = replace_marked_block(read_text(claude_path), rule_block(args.layout))
        write_text(claude_path, updated, args.dry_run, changed)
```

</details>

#### 缺口

- 未用新 DSH 会话验证自动发现和规则优先级
  **影响**：不能证明宿主每次会正确读取入口
  **进一步探讨**：在测试仓库开启新会话并对照恢复清单

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 容量治理能否自动保证交接事实准确？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

维护脚本按预定义字节和表格结构检查 snapshot、日志与验证记录，归档按 UTF-8 字节切分并更新索引。价值在于不用模型猜何时文件过大，能将旧细节从默认恢复路径移出，仍可追溯原材料。它根据形状和大小而非项目语义处理，缺失的事实、过期的测试结论和不标准的表格不会凭压缩变正确。对很小的项目，手工一页交接也能达成同样目标且维护负担更低。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/maintain_handoff.py:102-128](https://github.com/WeirdSky924/agent-handoff-skill/blob/ef01fa9db0ea0aab19141954644a1049da4da795/scripts/maintain_handoff.py#L102-L128)

按 UTF-8 片段计算体积

<details>
<summary>查看原文（27行）</summary>

```text
def split_utf8(text: str, max_bytes: int) -> list[str]:
    if byte_count(text) <= max_bytes:
        return [text]

    chunks: list[str] = []
    current: list[str] = []
    current_bytes = 0
    for line in text.splitlines(keepends=True):
        encoded = line.encode("utf-8")
        if len(encoded) > max_bytes:
            if current:
                chunks.append("".join(current))
                current = []
                current_bytes = 0
            segment = ""
            for char in line:
                candidate = segment + char
                if byte_count(candidate) > max_bytes:
                    chunks.append(segment)
                    segment = char
                else:
                    segment = candidate
            if segment:
                current = [segment]
                current_bytes = byte_count(segment)
            continue
        if current and current_bytes + len(encoded) > max_bytes:
```

</details>

**依据 2 · 源码核查**：[scripts/maintain_handoff.py:139-175](https://github.com/WeirdSky924/agent-handoff-skill/blob/ef01fa9db0ea0aab19141954644a1049da4da795/scripts/maintain_handoff.py#L139-L175)

归档内容与索引

<details>
<summary>查看原文（37行）</summary>

```text
def append_archive_index(handoff_dir: Path, entries: list[tuple[Path, str]]) -> None:
    index_path = handoff_dir / "archive.md"
    content = read_text(index_path).rstrip()
    if not content:
        content = "# Handoff Archive\n\nThis file indexes compressed history outside normal recovery."
    if "## Rotated Records" not in content:
        content += "\n\n## Rotated Records"
    for path, reason in entries:
        relative = path.relative_to(handoff_dir).as_posix()
        link = f"- [{path.name}]({relative}): {reason}"
        if link not in content:
            content += f"\n{link}"
    atomic_write(index_path, content.rstrip() + "\n")


def archive_content(handoff_dir: Path, kind: str, content: str, reason: str) -> list[Path]:
    archive_dir = handoff_dir / "archive"
    archive_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    payload_limit = ARCHIVE_CHUNK_BYTES - 2048
    payloads = split_utf8(content, payload_limit)
    created: list[Path] = []
    for index, payload in enumerate(payloads, start=1):
        suffix = f"-part{index}" if len(payloads) > 1 else ""
        path = archive_dir / f"{kind}-{timestamp}{suffix}.md"
        archived = (
            f"# Archived {kind.replace('-', ' ').title()}\n\n"
            f"- Archived at: {datetime.now(timezone.utc).isoformat()}\n"
            f"- Reason: {reason}\n\n"
            "## Original Content\n\n"
            f"{payload.rstrip()}\n"
        )
        atomic_write(path, archived)
        created.append(path)
    append_archive_index(handoff_dir, [(path, reason) for path in created])
    return created

```

</details>

**依据 3 · 源码核查**：[scripts/maintain_handoff.py:416-450](https://github.com/WeirdSky924/agent-handoff-skill/blob/ef01fa9db0ea0aab19141954644a1049da4da795/scripts/maintain_handoff.py#L416-L450)

验证表按阈值和解析结果处理

<details>
<summary>查看原文（35行）</summary>

```text
def maintain_validation(handoff_dir: Path) -> MaintenanceResult:
    result = MaintenanceResult()
    path = handoff_dir / "validation.md"
    if not path.exists():
        result.unresolved.append(".agent-handoff/validation.md is missing.")
        return result

    original = read_text(path)
    parsed = validation_table(original)
    row_count = len(parsed[3]) if parsed else 0
    if byte_count(original) <= VALIDATION_MAX_BYTES and row_count <= VALIDATION_MAX_ROWS:
        return result
    if parsed is None or row_count < 2:
        result.unresolved.append(
            "validation.md exceeds its limit but has no safely rotatable Markdown table rows."
        )
        return result

    lines, data_start, data_end, rows = parsed
    remove_count = max(0, len(rows) - VALIDATION_MAX_ROWS)
    while remove_count < len(rows) - 1:
        candidate = "".join(lines[:data_start] + rows[remove_count:] + lines[data_end:])
        if byte_count(candidate) <= VALIDATION_MAX_BYTES:
            break
        remove_count += 1
    if remove_count == 0:
        remove_count = 1

    compacted = "".join(lines[:data_start] + rows[remove_count:] + lines[data_end:])
    if byte_count(compacted) > VALIDATION_MAX_BYTES:
        result.unresolved.append(
            "validation.md still exceeds 64 KiB after preserving its newest complete table row."
        )
        return result

```

</details>

**依据 4 · 源码核查**：[SKILL.md:39-45](https://github.com/WeirdSky924/agent-handoff-skill/blob/ef01fa9db0ea0aab19141954644a1049da4da795/SKILL.md#L39-L45)

事实与未知由实际审阅处理

```text
1. Inspect the repository before writing files.
2. Identify existing agent guidance files: `AGENTS.md`, `CLAUDE.md`, `.claude/CLAUDE.md`, `.claude/rules/`, `.claude/settings.json`, README files, docs, source roots, test configuration, and obvious subprojects.
3. If bootstrapping a new mechanism, prefer running `scripts/bootstrap_handoff.py` from this skill to create safe scaffolding and idempotent project handoff rule blocks.
4. If repairing or reviewing an existing mechanism, read `references/quality.md`, inspect the current files, then edit the repository files directly with factual updates.
5. Always keep the handoff content evidence-based. Use `UNKNOWN` for facts that cannot be verified from the repository or user request.
6. For multi layout, run `scripts/maintain_handoff.py --repo <repo-root> --compact-if-needed` after meaningful handoff updates and before closeout.
7. Re-read files you created or changed before reporting completion.
```

#### 缺口

- 未执行乱序日志与多写者冲突用例
  **影响**：不能确认非规范表格和同时维护的恢复结果
  **进一步探讨**：先在一次性副本对比维护前后条目、归档和冲突

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样把仓库变更限定在可审查范围？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

可在一个已频繁交接的测试仓库仅预览默认布局。Markdown 可人工维护，Python 3.10 以上才运行脚本，Claude 可选钩子和权限合并走独立参数。首次成本是选布局、审查现有指令和决定是否提交文档；持续成本是维护事实、验证结果和历史；失败后按 diff 回退引导改动，同时保留原交接资料。避免把带敏感数据的交接记录随项目提交。已有单文档机制时先评估修补，不强制迁移。计量单位是一次可重新定位任务的交接，人时不以文件数代替。

#### 证据与依据

**依据 1 · 源码核查**：[SKILL.md:25-35](https://github.com/WeirdSky924/agent-handoff-skill/blob/ef01fa9db0ea0aab19141954644a1049da4da795/SKILL.md#L25-L35)

运行时依赖与现有布局保护

<details>
<summary>查看原文（11行）</summary>

```text
## Runtime Prerequisites

- Reading and applying the Markdown instructions requires no extra runtime beyond the host agent.
- Running `scripts/bootstrap_handoff.py` or `scripts/maintain_handoff.py` requires Python 3.10 or newer.
- DSH itself requires Node.js but does not guarantee Python. When Python is unavailable, create or repair files manually from `references/templates.md` and perform capacity review from `references/quality.md`.

## Layout Choice

- `multi` layout is the default for real projects. It creates `AGENT_HANDOFF.md` as a short index and `.agent-handoff/*.md` for state files.
- `single` layout is the legacy compact mode for small projects. It keeps all recovery state in `AGENT_HANDOFF.md`.
- Do not force-migrate an existing `AGENT_HANDOFF.md`. If it exists, preserve it and repair or migrate manually from repository facts.
```

</details>

**依据 2 · 源码核查**：[scripts/bootstrap_handoff.py:879-891](https://github.com/WeirdSky924/agent-handoff-skill/blob/ef01fa9db0ea0aab19141954644a1049da4da795/scripts/bootstrap_handoff.py#L879-L891)

独立可选 gitignore、权限和 hooks

<details>
<summary>查看原文（13行）</summary>

```text
        create_if_missing(prompts, session_prompts(args.layout), args.dry_run, changed, notes)

    if args.gitignore:
        entries = ["AGENT_HANDOFF.md", "AGENT_SESSION_PROMPTS.md"]
        if args.layout == "multi":
            entries.append(".agent-handoff/")
        add_gitignore_entries(repo, entries, args.dry_run, changed)

    if args.allow_readonly:
        merge_readonly_permissions(repo, args.dry_run, changed)

    if args.install_hooks:
        install_hooks(repo, args.dry_run, changed, notes)
```

</details>

**依据 3 · 作者声明**：[README.md:75-80](https://github.com/WeirdSky924/agent-handoff-skill/blob/ef01fa9db0ea0aab19141954644a1049da4da795/README.md#L75-L80)

作者列出可选配置

```text
| `AGENTS.md` | Codex 与 DSH 共用的项目级 instructions 文件，写入平台中性的接力维护规则。 |
| `.claude/CLAUDE.md` | 项目级 Claude Code 规则，要求未来 Agent 启动时读取接力文档，并在收尾前更新。 |
| `AGENT_SESSION_PROMPTS.md` | 可选文件，保存新窗口启动、继续任务、收尾、接力质量审查等常用提示词。 |
| `.claude/settings.json` | 可选文件，仅在用户要求时合并安全的只读查询权限或 Claude Code 软提醒 hook 条目。 |
| `.claude/hooks/handoff-watch.mjs` | 可选 Claude Code hook 脚本，仅在显式使用 `--install-hooks` 时创建。 |
| `.gitignore` | 可选更新，把本地接力文档设为不提交，除非项目决定把它纳入版本控制。 |
```

**依据 4 · 源码核查**：[package.json:1-9](https://github.com/WeirdSky924/agent-handoff-skill/blob/ef01fa9db0ea0aab19141954644a1049da4da795/package.json#L1-L9)

private 市场清单

```text
{
  "name": "agent-handoff-skill",
  "private": true,
  "description": "Cross-platform durable repository handoff skill for Codex, Claude Code, and DeepSeek Harness.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/WeirdSky924/agent-handoff-skill.git"
  },
```

#### 缺口

- 未实测执行脚本后的回退和主机权限规则
  **影响**：不承诺所有组合能无副作用恢复
  **进一步探讨**：比较 dry run 与实写 diff，测试仅保留所需文件的退出过程

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 拆分接力入口能否降低恢复成本？

**研究主题**：新假设与验证

#### 完整回答

待验证假设是多文件入口能在交接频繁且历史积累时减少新 Agent 寻找验证和阻塞点的成本。对同一分支、同一任务和一份人工摘要做配对比较，限定读取量和时间，要求输出目标、当前验证、未知和下一步并指出证据。统计错误恢复、重复工作和维护人时。若读得更少却丢失关键验证，或维护人时抵消恢复收益，就回到单页交接。现有维护脚本可约束文件体积，不能作为已测恢复速度。

#### 证据与依据

**依据 1 · 源码核查**：[SKILL.md:31-45](https://github.com/WeirdSky924/agent-handoff-skill/blob/ef01fa9db0ea0aab19141954644a1049da4da795/SKILL.md#L31-L45)

单与多布局提供明确基线

<details>
<summary>查看原文（15行）</summary>

```text
## Layout Choice

- `multi` layout is the default for real projects. It creates `AGENT_HANDOFF.md` as a short index and `.agent-handoff/*.md` for state files.
- `single` layout is the legacy compact mode for small projects. It keeps all recovery state in `AGENT_HANDOFF.md`.
- Do not force-migrate an existing `AGENT_HANDOFF.md`. If it exists, preserve it and repair or migrate manually from repository facts.

## Workflow

1. Inspect the repository before writing files.
2. Identify existing agent guidance files: `AGENTS.md`, `CLAUDE.md`, `.claude/CLAUDE.md`, `.claude/rules/`, `.claude/settings.json`, README files, docs, source roots, test configuration, and obvious subprojects.
3. If bootstrapping a new mechanism, prefer running `scripts/bootstrap_handoff.py` from this skill to create safe scaffolding and idempotent project handoff rule blocks.
4. If repairing or reviewing an existing mechanism, read `references/quality.md`, inspect the current files, then edit the repository files directly with factual updates.
5. Always keep the handoff content evidence-based. Use `UNKNOWN` for facts that cannot be verified from the repository or user request.
6. For multi layout, run `scripts/maintain_handoff.py --repo <repo-root> --compact-if-needed` after meaningful handoff updates and before closeout.
7. Re-read files you created or changed before reporting completion.
```

</details>

**依据 2 · 源码核查**：[scripts/maintain_handoff.py:139-175](https://github.com/WeirdSky924/agent-handoff-skill/blob/ef01fa9db0ea0aab19141954644a1049da4da795/scripts/maintain_handoff.py#L139-L175)

索引与归档是实验中的保留路径

<details>
<summary>查看原文（37行）</summary>

```text
def append_archive_index(handoff_dir: Path, entries: list[tuple[Path, str]]) -> None:
    index_path = handoff_dir / "archive.md"
    content = read_text(index_path).rstrip()
    if not content:
        content = "# Handoff Archive\n\nThis file indexes compressed history outside normal recovery."
    if "## Rotated Records" not in content:
        content += "\n\n## Rotated Records"
    for path, reason in entries:
        relative = path.relative_to(handoff_dir).as_posix()
        link = f"- [{path.name}]({relative}): {reason}"
        if link not in content:
            content += f"\n{link}"
    atomic_write(index_path, content.rstrip() + "\n")


def archive_content(handoff_dir: Path, kind: str, content: str, reason: str) -> list[Path]:
    archive_dir = handoff_dir / "archive"
    archive_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    payload_limit = ARCHIVE_CHUNK_BYTES - 2048
    payloads = split_utf8(content, payload_limit)
    created: list[Path] = []
    for index, payload in enumerate(payloads, start=1):
        suffix = f"-part{index}" if len(payloads) > 1 else ""
        path = archive_dir / f"{kind}-{timestamp}{suffix}.md"
        archived = (
            f"# Archived {kind.replace('-', ' ').title()}\n\n"
            f"- Archived at: {datetime.now(timezone.utc).isoformat()}\n"
            f"- Reason: {reason}\n\n"
            "## Original Content\n\n"
            f"{payload.rstrip()}\n"
        )
        atomic_write(path, archived)
        created.append(path)
    append_archive_index(handoff_dir, [(path, reason) for path in created])
    return created

```

</details>

#### 缺口

- 无独立配对数据
  **影响**：恢复收益和最适项目规模未知
  **进一步探讨**：用多轮盲交接和同一事实清单评价

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
