# Engramory

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[f346ee2](https://github.com/tinqiao-oss/engramory/tree/f346ee2facd39720289101a594ec77ffdce9b366)

<!-- BEGIN META -->
[![GitHub ★ 198](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=198&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tinqiao-oss/engramory)
<!-- END META -->

> **功能**：以精选 Markdown 笔记和常驻索引组织 Agent 长期记忆，提供跨宿主安装、尺寸检查和记忆库诊断工具。

> **亮点**：[Q01](#research-q01)与[Q02](#research-q02) 将原子笔记、单条项目续接、常驻索引和可追踪安装/检查组合，帮助个人跨host维护可读库。底层方法有auto-memory先例；DSH专用guard/UI另评，根不冒领运行保障。

> **主要限制**：[Q02](#research-q02)尺寸/格式校验不证真假，安装失败不整套回滚且不能盲重跑；[Q03](#research-q03)明文、无强制来源/过期/项目ID和规则只读限制多host共享。必须单writer、备份和回源，不能把“通用”当隔离或自动整理。

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
  - [Q01 · 根协议给个人跨宿主记忆什么增量，什么归子包？](#detail-section-11)
  - [Q02 · 安装、检查和doctor实际修改什么，失败是否事务回滚？](#detail-section-12)
  - [Q03 · 跨宿主、明文和恢复负担支持什么采用？](#detail-section-13)
  - [Q04 · 格式健康与记忆正确之间如何验证，新方向是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人Agent维护者跨会话保存精选纠正/偏好和未完项目状态；原生auto-memory或手读索引为基线。合格结果是正确相关回忆与续接，不是格式OK或笔记数量。

成熟auto-memory/Markdown知识库/常驻规则已有索引+详情；根增量在统一精选和续接纪律、跨host安装/诊断，不归DSH runtime guard。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 记忆Skill | 精选/回忆/续接纪律 | 模型遵守，非自动事实判真 |
| host安装器 | 写规则/Skill/可选hook | 多目标非事务，需核真实加载 |
| check/doctor | 尺寸/格式/指针诊断 | 显式检查非全host写前阻断 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 文件工具与常驻规则宿主 | 核心需 | 加载Skill/索引与笔记 | 文件写入不证host加载 |
| Python3.9+ | 根工具需 | init/check/doctor | DSH插件另包不继承根工具 |
| 独立可控小库/备份 | 采用前提 | 单writer与恢复 | 避免与宿主管理memory双writer |
| 对应host信任hook | 自动化选配 | 生命周期提醒 | 本轮未执行，各host差异 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 一个host、复制小库和备份 | 不保存秘密值 |
| 接入 | 固定init host/root与规则路径 | 安装无dry-run，先读计划/代码范围 |
| 使用 | 显式回忆/写前查重/完成续接 | check尺寸、doctor结构，事实另核 |
| 失败 | 按partial清单查索引和Skill | 不盲重跑/force覆盖 |
| 退出 | 同参数uninstall先dry-run | 保留库，转原生/手读 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Python/host和库空间 | 路径/规则/Skill/hook核对 | 工时金额未知 |
| 持续 | 索引/细节模型token与备份 | 精选、查重、压缩、回源 | 未测净回忆收益 |
| 失败恢复 | 备份/重试 | 查partial安装和半拷状态 | 多目标非事务 |
| 退出 | 明文库/副本留存 | 拆managed接线与私密管理 | 不删库/模型历史 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 记忆纪律 | 一事实/索引/项目续接规则 | 实际回忆正确率 |
| 安装诊断 | 路径前置与partial清单 | 所有host真实加载 |
| 库健康 | 尺寸/格式/链接问题可报告 | 事实真假/相关/过期 |
| 共享 | reader安装器不触库 | 模型/OS只读强制 |

> **思考**：[Q02](#research-q02)尺寸/格式校验不证真假，安装失败不整套回滚且不能盲重跑；[Q03](#research-q03)明文、无强制来源/过期/项目ID和规则只读限制多host共享。必须单writer、备份和回源，不能把“通用”当隔离或自动整理。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)与[Q02](#research-q02) 将原子笔记、单条项目续接、常驻索引和可追踪安装/检查组合，帮助个人跨host维护可读库。底层方法有auto-memory先例；DSH专用guard/UI另评，根不冒领运行保障。

[Q02](#research-q02)原子单文件、重叠拒绝、reader范围和退出码保留未知值得借鉴；整体非事务，symlink竞态best-effort，格式健康不能替事实验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)尺寸/格式校验不证真假，安装失败不整套回滚且不能盲重跑；[Q03](#research-q03)明文、无强制来源/过期/项目ID和规则只读限制多host共享。必须单writer、备份和回源，不能把“通用”当隔离或自动整理。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03)一个host小库单writer试用，显式检查与备份；不自动扩到私密共享或复杂hooks。误用/整理/恢复超过收益回原生或手读。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源支持自包含Skill与安装/诊断机制；无宿主效果执行，格式不证事实正确、整套安装非事务、单writer纪律仍需人工。回源提示为未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、SKILL.md、package.json、tools/engramory_check.py、tools/engramory_doctor.py、tools/engramory_init.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根Skill/规则和Pythoninit/check/doctor定向source；未全审sync/trace和各hosthooks，不继承DSH子包运行贡献，未执行目标。
- 下一步：[Q04](#research-q04)固定小库三类事实对照回源/误用与投入；先验host加载、部分失败和卸载，不把脚本存在作通过。

**分析版本**

- **仓库**：[tinqiao-oss/engramory](https://github.com/tinqiao-oss/engramory)
- **版本号**：1.2.0（[固定提交 f346ee2](https://github.com/tinqiao-oss/engramory/tree/f346ee2facd39720289101a594ec77ffdce9b366)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)可选来源指针/复核日期提示可能减少陈旧误用；真实变更/有效偏好/错误植入三组比较回源、误用及总时间，无改善或噪声过高即否定，未实现不计贡献。

[Q04](#research-q04)固定小库三类事实对照回源/误用与投入；先验host加载、部分失败和卸载，不把脚本存在作通过。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 24 | 5348 | — | — | 54792 |
| .js | source | 2 | 4353 | 3172 | 1016 | — |
| .js | test | 2 | 4368 | 3678 | 503 | — |
| .md | test | 1 | 122 | — | — | 1166 |

</details>

**活跃度**

[![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/tinqiao-oss/engramory/issues?q=is%3Aissue+created%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/tinqiao-oss/engramory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核根记忆Skill/协议与Python工具，不继承DSH子包贡献，限定个人单writer采用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根协议给个人跨宿主记忆什么增量，什么归子包？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根Engramory是自包含Markdown记忆Skill与Python安装/校验工具，真实类型skill。用户是能读写本地文件的个人Agent维护者，要跨会话保留精选纠正、偏好、项目续接；基线为宿主原生auto-memory或自己写常驻索引规则，海量资料另需检索系统。合格成果是相关指针和细节被正确回忆、续接状态可复核，而非笔记数量或索引检查OK。

SKILL定义一事实一文件、常驻MEMORY索引、未完任务只用一条project就地更新、完成后退休临时状态；根增加统一整理纪律和跨宿主接入工具。格式和规则是已有社区方法的组合，不能算新向量记忆算法。根package明确private发现清单，真实DSH运行包在adapters/dsh/plugin；其guard/runtime/UI独立评，不继承给根作为已执行能力。一个writer多reader是纪律，reader规则不能阻同OS身份写入；跨模型读记忆仍将内容送各自模型服务商。

#### 证据与依据

**依据 1 · 作者声明**：[SKILL.md:1-29](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/SKILL.md#L1-L29)

自包含精选文件记忆Skill及责任。

<details>
<summary>查看原文（29行）</summary>

```text
---
name: engramory
description: >-
  Curated, file-based long-term memory for an AI agent. Use this skill (1) at the
  start of a task or when resuming unfinished work to recall via the memory index,
  (2) during a task to save durable user, feedback, project, or reference facts,
  (3) when a task finishes, to run the completion checkpoint — promote what is
  durable, retire what was only transient, and write nothing when nothing qualifies
  (an empty checkpoint still has to be decided) — and (4) before compacting,
  clearing context, or opening a fresh thread to sync the current goal, state,
  decisions, constraints, blockers, and next step.
  A turn that starts no work — a greeting, an acknowledgement — is not a task and
  needs none of this, but never judge that by length: a one-word reply continuing
  work underway inherits that task.
  Each memory is one small markdown file; a single always-loaded index (MEMORY.md)
  lists them. Works on any agent host that can read and write local files.
---

# Engramory — curated file-based long-term memory

Engramory is a *discipline*, not a database. Memory is a directory of small,
human-readable markdown files plus one index. There is no vector store, no
embeddings, no server. You (the agent) read the index, open the files that
matter, and keep the store clean over time.

This file is self-contained: it defines the full storage layout, the recall
protocol, the write protocol, and the curation rules. A host that loads this file
as standing instructions and can read/write files can use Engramory even if it has
no built-in memory feature.
```

</details>

**依据 2 · 作者声明**：[SKILL.md:35-60](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/SKILL.md#L35-L60)

单一库和管理型宿主另库避免双writer。

<details>
<summary>查看原文（26行）</summary>

```text
Memory lives under a single root directory, `<MEMORY_ROOT>`, that the **user can
see, open, and audit**. Human-readability is the whole point — never hide the
store somewhere the user will not look.

This directory is the **one canonical Engramory store** for both durable memory
and resumable project state. Do not create a second "handoff" memory type or a
parallel handoff store: unfinished-task continuity belongs in a `project` note
and follows the same index, dedup, correction, and retirement rules.

- Default: `.engramory-memory/` at the root of the active project — what
  `tools/engramory_init.py` creates (a host may default elsewhere: on dsh it is one
  global store under `$DSH_HOME`; see the host's adapter README) — or a folder the
  user configures (e.g. inside their notes folder).
- It MUST be configurable; never hard-code an absolute path in the skill.
- If `<MEMORY_ROOT>` lives inside a git repository, it MUST be git-ignored —
  memories routinely contain machine-local, sensitive but non-credential detail
  (server IPs, ssh paths, serial numbers). Confirm `.gitignore` covers it before
  writing there. (Credential *values* never belong in memory at all — see §5.)
- On a host whose native memory is a **plain directory of files you control**
  (e.g. Claude Code), `<MEMORY_ROOT>` may be that directory, and Engramory layers
  its conventions on top. But if the host **manages** its own memory — writing,
  rewriting, or freezing files through its own manager (Codex's native Memories,
  OpenClaw's auto-written memory, Hermes's managed files) — point Engramory at a
  **separate folder you control**. Two writers with different house styles will
  fight over the same files. Check `PORTING.md` and the adapter README for the
  host before reusing its directory.
```

</details>

**依据 3 · 作者声明**：[SKILL.md:74-100](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/SKILL.md#L74-L100)

一事实一文件和未完project续接规则。

<details>
<summary>查看原文（27行）</summary>

````text
## 1. The unit: one file = one fact

Every memory is its own markdown file. Normally one file holds exactly **one**
durable fact or agreement. If you are tempted to combine unrelated facts, make
separate files.

The narrow exception is **at most one** live `project` note for one unfinished
task: its
goal, current status, decisions, constraints, blockers, and next step form one
cohesive continuity unit and are useful together. Update that note in place;
never create a series of snapshot files, and retire its transient state when the
task completes.

File frontmatter (a restricted `key: value` subset — not full YAML; no multi-line
values or lists, parsed by a zero-dependency reader). A value is either bare, or
wrapped in ONE matching quote pair; a quote inside that pair must be
backslash-escaped, and a bare value is never de-quoted (so a trailing `"` in
prose survives intact):

```markdown
---
name: <kebab-case-slug>          # matches the filename, used as the [[link]] target
description: <one line>          # used to judge relevance during recall — write it well
type: user | feedback | project | reference
scope: global | repo             # optional — does this still hold in another repo? (§2.1)
created: YYYY-MM-DD
updated: YYYY-MM-DD
````

</details>

**依据 4 · 作者声明**：[README.md:86-101](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/README.md#L86-L101)

单writer多reader和规则只读边界。

<details>
<summary>查看原文（16行）</summary>

````text
### 让另一个 AI 只读同一个库

一个库只有一个 AI 负责写，别的 AI 只读（[单写者、多读者](adapters/reader/README.md)）。比如 dsh 插件写它的全局库，Claude Code 和 Codex 来读：

```sh
# Claude Code：写进用户级的 ~/.claude/CLAUDE.md，每个项目都读得到
python tools/engramory_init.py claude-reader --project-root ~/.claude \
  --memory-root ~/.dsh/.engramory-memory
# Codex：写进 ~/.codex/AGENTS.md
python tools/engramory_init.py codex-reader --project-root ~/.codex \
  --memory-root ~/.dsh/.engramory-memory
```

反过来让 dsh 读 Claude Code 的库，换成 `dsh-reader`，`--memory-root` 指向 `~/.claude/projects/<project>/memory`。

读者不建库，`--memory-root` 里必须已有 `MEMORY.md`。读者自己的记忆照旧：Claude Code 读着 dsh 的库，你跟它说「记住……」，它记进自己的库，dsh 看不到。想让两边都知道，就各写各的库、互相只读对方的。"只读"靠规则约束，不是强制的；回忆到的内容会发给那个宿主的模型服务商。详见[读取器指南](adapters/reader/README.md)。
````

</details>

**依据 5 · 源码核查**：[package.json:1-8](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/package.json#L1-L8)

根发现清单非真实发布包。

```text
{
  "//": [
    "DISCOVERY MANIFEST ONLY — never published from the repo root (private: true).",
    "The installable npm package is adapters/dsh/plugin/ (same name, published from there).",
    "Registry crawlers (e.g. plugin.dshdesk.com) verify a dsh.bundle object in the ROOT",
    "package.json and that its patch file exists, so this file declares the same bundle",
    "patch the plugin ships. tests/test_dsh_plugin.py pins name/version/patch in sync",
    "with the plugin's own package.json — bump both together."
```

#### 缺口

- 跨宿主真实回忆正确率、续接质量和维护投入未对照。
  **影响**：不能宣称通用长期记忆收益或替代全部原生记忆。
  **进一步探讨**：用复制非敏感小库固定任务，比原生auto-memory/手动索引的正确回忆与总投入。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 安装、检查和doctor实际修改什么，失败是否事务回滚？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

init_host先校支持的host/flag、源文件与project/memory根，拒memory与Skill/hook目录重叠；reader不装Skill、不建库，须已有MEMORY且索引resolve在库内，规则输出不能落库内。安装顺序为memory→gitignore→可选Skill→Codex hooks→规则块，不能把--dry-run当安装预览：main对非卸载dry-run明确拒绝。

规则/.gitignore等单文件用mkstemp+fsync+os.replace，写前重查symlink containment但注释承认check到打开间仍有竞态，非内核安全隔离。整套多目标安装没有事务回滚：失败打印已完成项，说明失败步骤可半写，下一次会保留已有索引/无force的半拷Skill，不能无条件重跑。reader的“不改库”是安装器路径保护，不替模型文件工具形成OS只读。

check按索引大小先判超字节再有界读计行，误传目录/缺参64，读不到66，over2、warn1、OK0；OK只表示尺寸，不是内容可信或格式全对。doctor默认校frontmatter/日期/why-how、索引指针/孤儿并拒索引symlink越界和巨大文件解析，仍不能判断事实真假、任务相关或过期。两者均是显式检查，不是所有宿主写前强制；DSH/Claude guard各属单独适配。

#### 证据与依据

**依据 1 · 源码核查**：[tools/engramory_init.py:1554-1602](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/tools/engramory_init.py#L1554-L1602)

host/flag、根和重叠前置。

<details>
<summary>查看原文（49行）</summary>

```text
def init_host(args, host):
    cfg = HOST_CONFIG[host]
    source_root = _repo_root()
    if args.install_hooks and host != "codex":
        raise SystemExit(
            "--install-hooks is supported only for the Codex write host")
    if args.mode != "explicit" and host != "codex":
        raise SystemExit(
            "--mode assisted is supported only for the Codex write host")
    _require_sources(
        source_root,
        args.install_skill,
        cfg.get("snippet", "rules-snippet.md"),
        install_hooks=args.install_hooks,
    )
    root_arg = args.project_root
    if root_arg is None:
        # No explicit root: the host's own relocation env var (e.g. $DSH_HOME) wins
        # over the baked-in default — otherwise the config lands where the host
        # never reads it.
        root_arg = str(_host_home(cfg))
    project_root = Path(root_arg).expanduser().resolve()
    memory_root = Path(args.memory_root).expanduser()
    if not memory_root.is_absolute():
        memory_root = project_root / memory_root
    memory_root = memory_root.resolve()

    if memory_root == project_root:
        raise SystemExit("memory root must be a directory inside or outside the project, not the project root itself")

    # --install-skill (re)creates .agents/skills/engramory — with --force by rmtree'ing
    # it first. If the memory store overlaps that directory, installing the skill would
    # DELETE the store (--force), or mistake a store-only dir for an installed skill
    # (without it). Refuse the overlap up front, before any side effect.
    if args.install_skill:
        skill_root = _skill_root(project_root, cfg)
        if _same_or_inside(memory_root, skill_root) or _same_or_inside(skill_root, memory_root):
            raise SystemExit(
                f"--memory-root ({memory_root}) overlaps the skill install dir "
                f"({skill_root}); --install-skill (re)creates that directory and with "
                f"--force would delete the memory store inside it. Put the store "
                f"somewhere else (default: .engramory-memory).")
    if args.install_hooks:
        hook_root = project_root / ".codex" / "engramory"
        if (_same_or_inside(memory_root, hook_root)
                or _same_or_inside(hook_root, memory_root)):
            raise SystemExit(
                f"--memory-root ({memory_root}) overlaps the managed Codex hook dir "
                f"({hook_root}); keep executable hook code separate from memory data.")
```

</details>

**依据 2 · 源码核查**：[tools/engramory_init.py:1610-1644](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/tools/engramory_init.py#L1610-L1644)

reader不装Skill且已有索引范围检查。

<details>
<summary>查看原文（35行）</summary>

```text
    if not creates_store:
        # It installs no skill and no write tools — only a recall block. Passing
        # --install-skill would copy engramory_check/doctor etc., contradicting that.
        if args.install_skill:
            raise SystemExit(
                f"read-only host '{host}': --install-skill is not supported — a reader installs "
                f"no skill and no write tools, it only adds a recall block to the host's rules "
                f"file. Re-run without --install-skill.")
        # The reader writes its rules file (project_root / rules_file) and mkdir's the dirs to
        # it. If EITHER that file or --project-root resolves inside the store, the write would
        # modify the very store the reader must not touch — refuse. Checking the resolved TARGET
        # (not just project_root) also catches a nested rules file (e.g. Cursor
        # .cursor/rules/*.mdc) landing inside a store like <root>/.cursor.
        if _same_or_inside(project_root, memory_root) or _same_or_inside(target, memory_root):
            raise SystemExit(
                f"read-only host '{host}': its rules file ({target}) or --project-root "
                f"({project_root}) resolves inside the memory store ({memory_root}) — writing "
                f"there would modify the read-only store. Point --project-root outside the store "
                f"(e.g. ~/.codex).")
        # The store must already exist; this host never creates one.
        if not (memory_root / "MEMORY.md").is_file():
            raise SystemExit(
                f"read-only host '{host}': no MEMORY.md at {memory_root} — pass --memory-root "
                f"pointing at an EXISTING memory store (e.g. Claude Code's memory directory, "
                f"~/.claude/projects/<project>/memory). This host never creates a store.")
        # …and its index must actually RESOLVE inside the store. `is_file()` follows
        # symlinks, so a planted MEMORY.md -> /outside/file passed, and the generated
        # read-only rules then directed every session to read an arbitrary external
        # file — the exact read primitive root confinement exists to stop (the doctor
        # and the writer paths already enforce this same boundary).
        if not _same_or_inside(memory_root / "MEMORY.md", memory_root):
            raise SystemExit(
                f"read-only host '{host}': MEMORY.md at {memory_root} resolves outside "
                f"the memory store (symlink escape) — refusing to wire recall to it. "
                f"Point --memory-root at a store whose index is a regular file inside it.")
```

</details>

**依据 3 · 源码核查**：[tools/engramory_init.py:1738-1793](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/tools/engramory_init.py#L1738-L1793)

实际安装步骤与规则块写入。

<details>
<summary>查看原文（56行）</summary>

```text
def _run_install_steps(args, cfg, source_root, project_root, memory_root,
                       creates_store, rules_file, target, existing_hooks, results):
    """Perform the writes, appending each completed step to `results` as it lands."""
    if creates_store:
        results.append(("memory", _ensure_memory_store(source_root, memory_root)))
        results.append(("gitignore", _ensure_gitignore(project_root, memory_root)))
    else:
        results.append(("memory", f"read-only — using existing store at {memory_root} (not created/modified)"))
        results.append(("gitignore", "skipped (read-only host does not manage the store)"))

    skill_result = "not requested"
    if args.install_skill:
        skill_result = _copy_skill(source_root, project_root, args.force,
                                   _skill_dir(cfg, project_root))
    results.append(("skill", skill_result))

    hook_result = "not requested"
    if args.install_hooks:
        hook_result = _install_codex_hooks(
            source_root,
            project_root,
            memory_root,
            args.mode,
            args.force,
            existing_hooks,
            hook_python=args.hook_python,
        )
    results.append(("hooks", hook_result))

    block = _render_block(
        cfg,
        source_root,
        project_root,
        memory_root,
        args.install_skill,
        mode=args.mode,
        install_hooks=args.install_hooks,
    )
    if cfg.get("frontmatter"):
        # A dedicated rule file (Cursor/Kiro): written whole, but over another file at that
        # path only with --force — it may be the user's own.
        # a link whose target is missing is something there too, and not ours to replace
        if ((target.exists() or target.is_symlink()) and not args.force
                and not (target.exists() and _generated_rule_file(_read_text(target), cfg))):
            results.append((rules_file, "kept existing %s (it does not carry the mark of this "
                            "installer - versions before 1.0.3 wrote none; use --force to "
                            "replace)" % _display_path(target, project_root)))
        else:
            _write_text(target, block, guard_root=project_root)
            results.append((rules_file, f"wrote Engramory {cfg['label']} rule file"))
    else:
        old = _read_text(target) if target.exists() else ""
        _write_text(target, _replace_block(old, block, cfg["begin"], cfg["end"],
                                           heading=Path(rules_file).name),
                    guard_root=project_root)
        results.append((rules_file, f"created/updated Engramory {cfg['label']} block"))
```

</details>

**依据 4 · 源码核查**：[tools/engramory_init.py:1854-1871](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/tools/engramory_init.py#L1854-L1871)

dry-run只允许卸载。

<details>
<summary>查看原文（18行）</summary>

```text
def main(argv):
    # Keep stdout from crashing on a strict OEM/ascii console (Windows cp437/cp850 or a POSIX
    # C/ascii locale): --help and the result lines use an em-dash / other non-ASCII, which those
    # codepages can't encode and would otherwise raise UnicodeEncodeError. Matches engramory_doctor
    # / engramory_check. Run before parse_args so --help output is guarded too.
    try:
        sys.stdout.reconfigure(errors="backslashreplace")
    except (AttributeError, ValueError, OSError):
        pass
    args = build_parser().parse_args(argv[1:])
    if args.uninstall:
        return uninstall_host(args, args.host)
    # --dry-run describes an uninstall plan; there is no install equivalent, and silently
    # ignoring it on an install would let a cautious "let me preview this" run write to
    # the user's rules file for real.
    if args.dry_run:
        raise SystemExit("--dry-run is only meaningful with --uninstall")
    return init_host(args, args.host)
```

</details>

**依据 5 · 源码核查**：[tools/engramory_init.py:73-103](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/tools/engramory_init.py#L73-L103)

原子单文件及best-effort竞态。

<details>
<summary>查看原文（31行）</summary>

```text
def _write_text_atomic(path, text, guard_root=None):
    """Atomically replace a managed file without following a final symlink/hardlink.

    `guard_root` re-checks containment HERE, immediately before the write, rather
    than trusting the run's preflight: a parent directory swapped for a symlink in
    between would otherwise redirect this write outside the tree. This narrows the
    window to the gap between the check and the `mkstemp` below — it does not close
    it. Closing it needs fd-relative, reparse-point-refusing directory handles that
    the stdlib does not offer portably, so this stays best-effort (SECURITY.md).
    """
    if guard_root is not None:
        _refuse_symlink_escape(path, guard_root, path.name)
    path.parent.mkdir(parents=True, exist_ok=True)
    temp_name = None
    try:
        fd, temp_name = tempfile.mkstemp(
            prefix=".engramory-install-", suffix=".tmp", dir=str(path.parent))
        with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as handle:
            handle.write(text)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temp_name, path)
        temp_name = None
    except OSError as exc:
        raise SystemExit(f"cannot atomically write managed file {path}: {exc}")
    finally:
        if temp_name is not None:
            try:
                os.unlink(temp_name)
            except OSError:
                pass
```

</details>

**依据 6 · 源码核查**：[tools/engramory_init.py:1681-1735](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/tools/engramory_init.py#L1681-L1735)

失败不回滚和不能盲重跑。

<details>
<summary>查看原文（55行）</summary>

```text
    project_root.mkdir(parents=True, exist_ok=True)

    results = []
    try:
        _run_install_steps(args, cfg, source_root, project_root, memory_root,
                           creates_store, rules_file, target, existing_hooks, results)
    # UnicodeError too: _read_text is strict UTF-8, so an existing .gitignore or rules
    # file in another encoding raises UnicodeDecodeError (a ValueError, not an OSError)
    # AFTER earlier steps have already written — exactly when the report is needed.
    except (SystemExit, KeyboardInterrupt, OSError, UnicodeError, shutil.Error):
        # Nothing is rolled back: several targets are user-owned files that this
        # installer must not delete on the way out. Say exactly what did land, so the
        # user is never left guessing which half of an install they have.
        _report_partial(results, args, _skill_dir(cfg, project_root))
        raise

    print(f"Engramory {cfg['label']} init complete")
    print(f"project root: {_display_path(project_root, Path.cwd())}")
    print(f"memory root: {_display_path(memory_root, project_root)}")
    for label, message in results:
        print(f"- {label}: {message}")
    # A reader host whose wiring hasn't been dogfooded here: write it per the documented
    # rules-file format, but tell the user plainly it's unverified (honesty rule).
    if "tested" in cfg and not cfg["tested"]:
        print(f"NOTE: this reader wiring for {cfg['label']} is written from {rules_file}'s "
              f"documented format but has NOT been verified on a real host here — confirm your "
              f"host actually loads {rules_file} as an always-on rule.")
    return 0


def _report_partial(results, args, skill_dir=DEFAULT_SKILL_DIR):
    """Report a half-finished install honestly. Re-running is NOT unconditionally safe.

    Each step is individually recoverable, but two of them keep whatever a failed
    earlier run left behind — a truncated `MEMORY.md` is adopted as "kept existing",
    and a half-copied skill dir is kept without `--force`. Naming those two beats a
    blanket "just re-run it".
    """
    out = sys.stderr
    print("Engramory init FAILED partway. Nothing was rolled back.", file=out)
    if results:
        print("completed before the failure:", file=out)
        for label, message in results:
            print(f"- {label}: {message}", file=out)
    else:
        print("- (no step completed)", file=out)
    print("the step that failed may have written PART of its output; every later step "
          "did not run at all.", file=out)
    print("re-running is safe for .gitignore and the rules block, but check by hand "
          "first:", file=out)
    print("  - MEMORY.md: a truncated index is KEPT ('kept existing MEMORY.md') on the "
          "next run — open it, and delete it if it is incomplete", file=out)
    if args.install_skill:
        print(f"  - {skill_dir}/engramory: a half-copied dir is KEPT without --force "
              "— re-run with --force to replace it", file=out)
```

</details>

**依据 7 · 源码核查**：[tools/engramory_check.py:83-139](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/tools/engramory_check.py#L83-L139)

明确尺寸口径与退出码。

<details>
<summary>查看原文（57行）</summary>

```text
    if len(argv) < 2:
        print("usage: engramory_check.py <path-to-index (MEMORY.md)>")
        return 64  # EX_USAGE — a misuse must not read as OK (exit 0) to a caller
    path = argv[1]
    # A directory answers getsize() with its own entry size (48 KB for a big one on
    # NTFS), which sails past the byte cap and prints a confident OVER about an index
    # that was never read. Caught in the field: the caller passed the memory/ dir
    # instead of memory/MEMORY.md and acted on a fabricated 48 KB verdict. Misuse must
    # look like misuse, so this is EX_USAGE, not a size answer.
    if os.path.isdir(path):
        print(f"usage: {path} is a directory; pass the index file itself "
              f"(e.g. {os.path.join(path, 'MEMORY.md')})")
        return 64
    hard = _envint("ENGRAMORY_HARD", 200)
    warn = _envint("ENGRAMORY_WARN", 150)
    hard_b = _envint("ENGRAMORY_HARD_BYTES", 25600)
    warn_b = _envint("ENGRAMORY_WARN_BYTES", 20480)
    # Size first, WITHOUT reading: a planted or runaway index (a sync client can
    # drop a multi-gigabyte file here) would otherwise be slurped into memory and
    # the checker would hang or die with MemoryError instead of answering OVER —
    # the one thing it exists to say. Past the byte cap the verdict is already
    # decided, so the content is never needed.
    try:
        nbytes = os.path.getsize(path)
    except OSError as e:
        print(f"engramory: cannot read {path}: {e}")
        return 66  # EX_NOINPUT — "could not check" must be distinct from OK
    if nbytes > hard_b:
        print(f"OVER: index is {_kb(nbytes)} — over {_kb(nbytes)} > {_kb(hard_b)} "
              f"(cap {hard} lines / {_kb(hard_b)}), past the load window. Compact now: "
              f"{_first_step(True)} — before adding more, or the tail stops being recalled.")
        return 2
    # Under the byte cap, so the file is small (<= 25 KB by default) and reading
    # it to count lines is bounded by that cap.
    try:
        with open(path, "rb") as fh:
            raw = fh.read()
    except OSError as e:
        print(f"engramory: cannot read {path}: {e}")
        return 66
    text = raw.decode("utf-8", "replace")
    lines, nbytes = _lines(text), len(raw)
    size = f"{lines} lines / {_kb(nbytes)}"
    # _kb, not integer //1024: a custom cap like ENGRAMORY_HARD_BYTES=1000 rendered
    # as a contradictory "cap ... / 0 KB" while the comparison itself was right.
    caps = f"{hard} lines / {_kb(hard_b)}"
    if lines > hard or nbytes > hard_b:
        print(f"OVER: index is {size} — over {_over(lines, nbytes, hard, hard_b)} "
              f"(cap {caps}), past the load window. Compact now: {_first_step(nbytes > hard_b)} "
              f"— before adding more, or the tail stops being recalled.")
        return 2
    if lines > warn or nbytes > warn_b:
        print(f"WARN: index is {size} — over {_over(lines, nbytes, warn, warn_b)} (cap {caps}). "
              f"Getting long; plan a compaction pass soon ({_first_step(nbytes > warn_b)}).")
        return 1
    print(f"OK: index is {size} (cap {caps}).")
    return 0
```

</details>

**依据 8 · 源码核查**：[tools/engramory_doctor.py:410-453](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/tools/engramory_doctor.py#L410-L453)

默认schema、索引realpath及大文件限制。

<details>
<summary>查看原文（44行）</summary>

```text
    schema = "--no-schema" not in args  # default: validate frontmatter too
    positional = [a for a in args if not a.startswith("-")]
    root = positional[0] if positional else "."
    # realpath (not abspath) so a symlinked pointer/note/index can't resolve outside the
    # store while still passing the escape check; the root is resolved the same way so a
    # store reached via a symlink/junction stays consistent.
    root_abs = os.path.realpath(root)
    idx_path = os.path.join(root, "MEMORY.md")
    if not os.path.isfile(idx_path):
        print(f"engramory-doctor: no index at {idx_path}")
        return 1
    # The index is read first and unconditionally, and its pointer targets are echoed in
    # the report — so a MEMORY.md that is itself a symlink escaping the store root must be
    # refused, not read (else an arbitrary file is parsed as the index and fragments of it
    # leak out). Same boundary as the note/pointer escape checks (SECURITY.md).
    if not _within(idx_path, root_abs):
        print(f"engramory-doctor: index at {idx_path} resolves outside the store root "
              f"(symlink escape) — refusing to read")
        return 1

    hard = _envint("ENGRAMORY_HARD", 200)
    hard_b = _envint("ENGRAMORY_HARD_BYTES", 25600)
    # Refuse to slurp a runaway index. A sync client or a broken writer can leave
    # a multi-gigabyte MEMORY.md here; reading it would hang or raise MemoryError
    # instead of reporting the over-cap state this tool exists to report. Well
    # past the cap the verdict needs no content, so say it and stop.
    parse_cap = max(hard_b * 8, 1 << 20)
    try:
        isize = os.path.getsize(idx_path)
    except OSError:
        isize = None
    if isize is not None and isize > parse_cap:
        print(f"ISSUE: index is {_kb(isize)} — far past the cap "
              f"({hard} lines / {_kb(hard_b)}) and too large to parse. Compact or "
              f"restore it before running further checks.")
        print(f"engramory-doctor: 1 issue(s) — 1 over-cap")
        print(f"  fix over-cap: compact MEMORY.md — pointer-ify long lines, merge, "
              f"archive cold notes")
        return 1
    iraw = _read_bytes(idx_path)
    if iraw is None:
        print(f"engramory-doctor: cannot read index at {idx_path}")
        return 1
    itext = iraw.decode("utf-8-sig", "replace")  # strip a leading BOM if present
```

</details>

**依据 9 · 源码核查**：[tools/engramory_doctor.py:705-758](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/tools/engramory_doctor.py#L705-L758)

格式、日期、why/how和孤儿检查。

<details>
<summary>查看原文（54行）</summary>

```text
            for dk in ("created", "updated"):
                dv = fm.get(dk, "")
                if not dv:
                    issues.append(f"{base}: frontmatter missing required '{dk}'")
                elif not _valid_date(dv):
                    issues.append(f"{base}: '{dk}' is not a valid YYYY-MM-DD date "
                                  f"({_short(dv)})")
            if t in ("feedback", "project"):
                # scan the BODY only — a Why:/How to apply: line in the frontmatter
                # doesn't count as the required reflection.
                zh = _CJK_RE.search(body) is not None
                if not _WHY_RE.search(body):
                    msg = f"{base}: type {t} must carry a 'Why:' line"
                    if zh:
                        msg += " (or '为什么：')"
                    if _WHY_NEAR.search(body):
                        msg += " (found a 'Why' label without the 'Why:' form — add a colon, e.g. **Why:**)"
                    elif _WHY_NEAR_ZH.search(body):
                        msg += " (found a '为什么' label without its colon — e.g. **为什么：**)"
                    issues.append(msg)
                if not _HOW_RE.search(body):
                    msg = f"{base}: type {t} must carry a 'How to apply:' line"
                    if zh:
                        msg += " (or '怎么用：')"
                    if _HOW_NEAR.search(body):
                        msg += " (found 'How' but not the full 'How to apply:' label, e.g. **How to apply:**)"
                    elif _HOW_NEAR_ZH.search(body):
                        msg += " (found a '怎么用' label without its colon — e.g. **怎么用：**)"
                    issues.append(msg)

    if bloated:
        bloated.sort(reverse=True)
        shown = ", ".join(f"{b} {_kb(s)}" for s, b in bloated[:3])
        more = f", +{len(bloated) - 3} more" if len(bloated) > 3 else ""
        info.append(f"{len(bloated)} note(s) over {_kb(note_warn)} ({shown}{more}) — a "
                    f"note is one fact and costs its full size on every recall; keep the "
                    f"conclusion in place and move the timeline to archive/<slug>_history.md "
                    f"(SKILL.md §6 step 4)")

    if scopeless:
        shown = ", ".join(scopeless[:3])
        more = f", +{len(scopeless) - 3} more" if len(scopeless) > 3 else ""
        info.append(f"{len(scopeless)} feedback/project note(s) carry no 'scope' "
                    f"({shown}{more}) — label the ones whose reach you KNOW (global "
                    f"or repo); an unlabelled reach beats a guessed one (SKILL.md §2.1)")

    # orphans (ISSUE) and in-graph-but-not-in-index notes (INFO: won't load at start)
    for base in sorted(notes):
        if base == "MEMORY.md":
            continue
        if base not in referenced:
            issues.append(f"orphan note (not in index, nothing links to it): {base}")
        elif base not in indexed:
            info.append(f"{base}: linked from another note but not in MEMORY.md "
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 跨宿主、明文和恢复负担支持什么采用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

根工具需Python3.9+与宿主常驻指令/文件工具；不是独立模型或记忆服务器。支持的安装选项和host实际加载需分开，installer对未dogfood reader自己打印NOT verified，不能把规则文件生成当宿主生效。建议一个可信writer、复制小库先试显式任务检查，不自动装hooks或共享私密资料。宿主管理原生Memories时用独立库，避免两个管理者改同文件。

所有记忆是明文，gitignore不阻云同步/备份/模型上传，凭据值禁止保存也仅纪律，未自动扫描。没有来源、可信度、过期、项目ID的强制字段；多项目同名和串用仍需人核实。格式doctor只能提示结构问题，人工要精选、查重、压缩、退休和备份。首次配置路径/规则/Skill/hook、持续索引token与整理时间、失败后人工检查部分安装和备份恢复，现金与工时未测。

卸载先以同host/root参数--uninstall --dry-run看计划，实际只拆managed规则/Skill/hook且预先拒与memory重叠，记忆保留；不能理解成清除模型历史或全部私人副本。回原生记忆或普通Markdown手读是退路。跨宿主复杂hooks/trace/sync未本轮全量审，不以可选脚本数量扩大推荐。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:49-50](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/README.md#L49-L50)

Python3.9+与DSH另包声明。

```text

> dsh 插件从 npm 装，别的都不需要。其他工具需要 Python 3.9+，在本仓库目录里运行；macOS / Linux 没有 `python` 就用 `python3`。
```

**依据 2 · 源码核查**：[tools/engramory_init.py:1702-1707](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/tools/engramory_init.py#L1702-L1707)

未验证reader明确提示。

```text
    # A reader host whose wiring hasn't been dogfooded here: write it per the documented
    # rules-file format, but tell the user plainly it's unverified (honesty rule).
    if "tested" in cfg and not cfg["tested"]:
        print(f"NOTE: this reader wiring for {cfg['label']} is written from {rules_file}'s "
              f"documented format but has NOT been verified on a real host here — confirm your "
              f"host actually loads {rules_file} as an always-on rule.")
```

**依据 3 · 作者声明**：[SKILL.md:49-60](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/SKILL.md#L49-L60)

gitignore和独立库纪律。

<details>
<summary>查看原文（12行）</summary>

```text
- If `<MEMORY_ROOT>` lives inside a git repository, it MUST be git-ignored —
  memories routinely contain machine-local, sensitive but non-credential detail
  (server IPs, ssh paths, serial numbers). Confirm `.gitignore` covers it before
  writing there. (Credential *values* never belong in memory at all — see §5.)
- On a host whose native memory is a **plain directory of files you control**
  (e.g. Claude Code), `<MEMORY_ROOT>` may be that directory, and Engramory layers
  its conventions on top. But if the host **manages** its own memory — writing,
  rewriting, or freezing files through its own manager (Codex's native Memories,
  OpenClaw's auto-written memory, Hermes's managed files) — point Engramory at a
  **separate folder you control**. Two writers with different house styles will
  fight over the same files. Check `PORTING.md` and the adapter README for the
  host before reusing its directory.
```

</details>

**依据 4 · 作者声明**：[README.md:116-133](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/README.md#L116-L133)

卸载与明文/同步/秘密纪律。

<details>
<summary>查看原文（18行）</summary>

````text
## 卸载

dsh 插件：`dsh plugin --profile <名字> remove dsh-engramory`。用安装脚本装的，用安装时的宿主和路径再跑一次，加 `--uninstall`（先加 `--dry-run` 看计划）：

```sh
python tools/engramory_init.py codex --uninstall
```

只删安装器自己的东西：规则块、skill 副本、Codex hook。**记忆库永远不删**，真想清空请自己删。

## 安全与隐私

记忆库是**未加密的明文**，本机进程都能读；`.gitignore` 只管 git，云同步、备份照样会复制它。

- **永远不存密码、key、token、cookie 的值**，只记它们在哪（密码管理器、环境变量名）。
- 手机号、邮箱、地址这类个人信息少存，尽量只记指针。

没有自动扫描，全靠纪律。见 [SKILL.md](SKILL.md) §5/§8 和 [SECURITY.md](SECURITY.md)。
````

</details>

**依据 5 · 作者声明**：[README.md:149-155](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/README.md#L149-L155)

无来源过期项目ID和个人规模限制。

```text
## 已知局限

- **只有 dsh 和 Claude Code 有写前拒绝**，而且 shell、MCP 文件工具、外部编辑器都能绕过。其他宿主只靠规则，尽力而为；各宿主的情况以 [PORTING.md](PORTING.md) 为准。
- **整理靠模型自觉遵守规则**，不是强制的。
- **没有来源、可信度、过期字段。** 回忆到的内容只供参考，可能被人为影响（[SKILL.md](SKILL.md) §4）。
- **没有项目 ID。** 多个项目共用一个库时，笔记名可能撞、内容可能串。
- **一个库只能有一个写入者**，见[单写者、多读者](adapters/reader/README.md)。
```

**依据 6 · 源码核查**：[tools/engramory_init.py:1425-1458](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/tools/engramory_init.py#L1425-L1458)

卸载不触库与重叠前置。

<details>
<summary>查看原文（34行）</summary>

```text
def uninstall_host(args, host):
    """Remove the wiring `init_host` installed for `host`. Never touches the store."""
    cfg = HOST_CONFIG[host]
    if args.install_skill or args.install_hooks:
        raise SystemExit(
            "--uninstall removes whatever this host installed; do not combine it "
            "with --install-skill / --install-hooks")
    root_arg = args.project_root
    if root_arg is None:
        root_arg = str(_host_home(cfg))
    project_root = Path(root_arg).expanduser().resolve()
    rules_file = cfg.get("rules_file", "AGENTS.md")
    target = project_root / rules_file
    dry = args.dry_run
    # Resolved up front: every deletion below is checked against it, so it cannot be
    # computed after the fact.
    memory_root = Path(args.memory_root).expanduser()
    if not memory_root.is_absolute():
        memory_root = project_root / memory_root
    memory_root = memory_root.resolve()

    # Preflight, before ANY side effect - the same order init_host uses. Every path this
    # run could delete is checked against the store first, so an overlap refuses the whole
    # uninstall instead of taking the rules block with it and then stopping. The
    # install-time guards only fire for the flags that create the artefact, so a plain
    # `init --memory-root .codex/engramory` is accepted and only shows up here.
    doomed = [(target, "the host rule file")]
    if cfg.get("creates_store", True):
        doomed.append((_skill_root(project_root, cfg), "the skill install dir"))
    if host == "codex":
        doomed.append((project_root / ".codex" / "engramory", "the managed hook dir"))
        doomed.append((project_root / ".codex" / "hooks.json", "the Codex hooks file"))
    for path, what in doomed:
        _refuse_store_overlap(path, memory_root, what)
```

</details>

#### 缺口

- 目标宿主常驻规则/Skill/hook真实加载与效果未运行。
  **影响**：不能从文件落地宣称记忆可用。
  **进一步探讨**：固定一个host做可识别非敏感纠正、重开会话、指针核验和卸载恢复。
- 全量sync/trace/各宿主hooks与并发写故障未审。
  **影响**：不推荐多writer或复杂自动化接管。
  **进一步探讨**：在扩大前独立核这些入口、保留单writer与外部备份，验部分失败与覆盖恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 格式健康与记忆正确之间如何验证，新方向是什么？

**研究主题**：新假设与验证

#### 完整回答

根纪律和checker能减少结构混乱，但MEMORY尺寸/日期/why-how齐全不证明事实正确或仍适用。用户可人为植入错误，Agent也可能将过期背景当指令；没有来源/过期字段和跨项目ID是作者公开边界，本轮没有真实回忆对照，不把整洁库当业务成果。

据Q02格式检查与Q03来源缺口，可推导未实现假设：新增可选evidence pointer与复核日期的“需要回源”提示，可能比仅检查created/updated更能阻止跨仓陈旧事实被直接采用。增量是提示复核责任而非自动判真或改变现有格式强制版本。最小实验把真实已变更配置、仍有效偏好、错误植入三类记忆混入小库，对照现行格式和提示版本，让Agent完成任务并计误用、正确回源和人工时间；误用不降或额外提醒淹没有效事实则否定。尚未实现/验证，不计当前贡献。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:149-155](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/README.md#L149-L155)

作者无来源/过期与多项目限制。

```text
## 已知局限

- **只有 dsh 和 Claude Code 有写前拒绝**，而且 shell、MCP 文件工具、外部编辑器都能绕过。其他宿主只靠规则，尽力而为；各宿主的情况以 [PORTING.md](PORTING.md) 为准。
- **整理靠模型自觉遵守规则**，不是强制的。
- **没有来源、可信度、过期字段。** 回忆到的内容只供参考，可能被人为影响（[SKILL.md](SKILL.md) §4）。
- **没有项目 ID。** 多个项目共用一个库时，笔记名可能撞、内容可能串。
- **一个库只能有一个写入者**，见[单写者、多读者](adapters/reader/README.md)。
```

**依据 2 · 源码核查**：[tools/engramory_doctor.py:705-749](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/tools/engramory_doctor.py#L705-L749)

当前结构/日期/范围提示非事实复核。

<details>
<summary>查看原文（45行）</summary>

```text
            for dk in ("created", "updated"):
                dv = fm.get(dk, "")
                if not dv:
                    issues.append(f"{base}: frontmatter missing required '{dk}'")
                elif not _valid_date(dv):
                    issues.append(f"{base}: '{dk}' is not a valid YYYY-MM-DD date "
                                  f"({_short(dv)})")
            if t in ("feedback", "project"):
                # scan the BODY only — a Why:/How to apply: line in the frontmatter
                # doesn't count as the required reflection.
                zh = _CJK_RE.search(body) is not None
                if not _WHY_RE.search(body):
                    msg = f"{base}: type {t} must carry a 'Why:' line"
                    if zh:
                        msg += " (or '为什么：')"
                    if _WHY_NEAR.search(body):
                        msg += " (found a 'Why' label without the 'Why:' form — add a colon, e.g. **Why:**)"
                    elif _WHY_NEAR_ZH.search(body):
                        msg += " (found a '为什么' label without its colon — e.g. **为什么：**)"
                    issues.append(msg)
                if not _HOW_RE.search(body):
                    msg = f"{base}: type {t} must carry a 'How to apply:' line"
                    if zh:
                        msg += " (or '怎么用：')"
                    if _HOW_NEAR.search(body):
                        msg += " (found 'How' but not the full 'How to apply:' label, e.g. **How to apply:**)"
                    elif _HOW_NEAR_ZH.search(body):
                        msg += " (found a '怎么用' label without its colon — e.g. **怎么用：**)"
                    issues.append(msg)

    if bloated:
        bloated.sort(reverse=True)
        shown = ", ".join(f"{b} {_kb(s)}" for s, b in bloated[:3])
        more = f", +{len(bloated) - 3} more" if len(bloated) > 3 else ""
        info.append(f"{len(bloated)} note(s) over {_kb(note_warn)} ({shown}{more}) — a "
                    f"note is one fact and costs its full size on every recall; keep the "
                    f"conclusion in place and move the timeline to archive/<slug>_history.md "
                    f"(SKILL.md §6 step 4)")

    if scopeless:
        shown = ", ".join(scopeless[:3])
        more = f", +{len(scopeless) - 3} more" if len(scopeless) > 3 else ""
        info.append(f"{len(scopeless)} feedback/project note(s) carry no 'scope' "
                    f"({shown}{more}) — label the ones whose reach you KNOW (global "
                    f"or repo); an unlabelled reach beats a guessed one (SKILL.md §2.1)")
```

</details>

**依据 3 · 作者声明**：[SKILL.md:21-29](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/SKILL.md#L21-L29)

纪律而非数据库的责任边界。

```text
Engramory is a *discipline*, not a database. Memory is a directory of small,
human-readable markdown files plus one index. There is no vector store, no
embeddings, no server. You (the agent) read the index, open the files that
matter, and keep the store clean over time.

This file is self-contained: it defines the full storage layout, the recall
protocol, the write protocol, and the curation rules. A host that loads this file
as standing instructions and can read/write files can use Engramory even if it has
no built-in memory feature.
```

#### 缺口

- 可选回源提示能否减少陈旧误用未试验。
  **影响**：只能未来假设，不提高当前效果档。
  **进一步探讨**：三类小库任务对照误用和总投入，无改善/提醒噪声过高就放弃。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
