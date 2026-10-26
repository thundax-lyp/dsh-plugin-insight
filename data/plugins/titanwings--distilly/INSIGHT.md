# Distilly

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[0afc45c](https://github.com/titanwings/distilly/tree/0afc45c29c360ba7bc8260f1bb0bf34e9155f4fa)

<!-- BEGIN META -->
[![GitHub ★ 26,004](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=26%2C004&color=yellow&logo=github&style=flat)](https://github.com/titanwings/distilly)
<!-- END META -->

> **实现功能**：从消息、文档、访谈等材料提炼人物工作方法与表达偏好，并生成可复用的 Agent Skill。

> **核心亮点**：相对手写“扮演某人”的提示，Distilly 将来源采集、Work 与 Persona 双轨分析、用户预览、统一 writer、版本备份及宿主安装拆成可复用流程。它改变知识交接的组织方式，而非训练出人的模型；主要执行仍依赖承载 Skill 的 Agent 判断。[Q02](#research-q02)

> **风险与缺陷**：source-grounded 是目标，不是 writer 或质量脚本自动证明的语义属性。流程允许无文件时仅凭访谈生成；quality_check 的 URL 形状、来源标记和 PASS 文本检查不能证明判断忠实于本人或适合新问题。工作技能内明确不足就说明缺口，但提示规则能否被宿主稳定遵守仍未知。[Q03](#research-q03)

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
  - [Q01 · Person Profile 服务什么交接，是否真的复制人物？](#detail-section-11)
  - [Q02 · 材料如何转为可安装规则，贡献在哪一层？](#detail-section-12)
  - [Q03 · 语义忠实性由谁保证，质量脚本能证明多少？](#detail-section-13)
  - [Q04 · 生成、安装和纠错的前提与成本是什么？](#detail-section-14)
  - [Q05 · 规则证据与反例会改善任务忠实性吗，先给谁用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为需要保留同事工作方法、整理个人偏好或研究公众表达的人，把消息、文档和访谈材料提炼为可复用 Person Profile，并打包成 Agent Skill。合格产物是能回指材料、区分事实和推断且可纠正的行为规则，不是本人复制品。

手写persona提示和普通知识库是简单基线；应以相同模型、资料与留出问题比较任务正确性，不按生成文件数或模仿口吻评分。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 人物资料双轨整理 | 提炼 Work 与 Persona | 依赖模型和合法材料，不是本人复制 |
| 统一档案生成 | 输出组合及独立 Skill | 用户预览确认后调用 writer；语义需复核 |
| 更新与宿主安装 | 保存版本并分发自包含产物 | 各宿主真实兼容未测，私密正文仍需审查 |
| 研究质量检查 | 检查来源形状和审核标记 | 启发式不证明人物判断正确 |

<a id="dependencies-and-flow"></a>

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 支持本地 Agent Skill 的宿主与模型 | 生成必需 | 执行流程、分析来源并调用工具 | 静态文件不会自行提炼人物 |
| Python 3.9+ 与来源对应依赖 | writer/采集必需 | 写入、版本和可选来源处理 | 对应步骤不可用 |
| 合法可用的人物材料或访谈 | 效果必需 | 支撑具体行为规则 | 只能得到输入描述的有限整理 |
| 平台授权与账号 | 自动采集可选 | 获取消息、文档或公开材料 | 可改为人工提供文件；范围与权限须核查 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户安装 creator Skill 并指定人物类型 | 宿主发现实际 SKILL 路径，避免错用安装副本 |
| 2 | 用户提供授权材料，Agent 双轨分析 | 规则能追溯证据并保留未知 |
| 3 | 用户预览并确认，writer 生成档案 | 输出 Work、Persona 与自包含组合 Skill |
| 4 | 用户选择宿主安装并以留出问题复核 | 纠错、更新、回滚后仍保持材料与行为一致 |

<a id="cost-and-value"></a>

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主模型调用、解析与可选采集服务 | 整理资料、授权、访谈及规则确认 | Token、采集价格与时长未测 |
| 持续使用 | 新材料分析和生成调用 | 审查事实、规则适用性和纠错 | 人物变化与材料偏差需持续处理 |
| 失败恢复 | 版本副本和重新分析资源 | 回滚、清除误推断及撤回已安装副本 | 多宿主传播后的修正成本未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 结构化交接 | 双轨流程和统一生成器 | 新任务是否比手写提示更忠实 |
| 可移植档案 | 自包含 Skill 与宿主安装辅助 | 各宿主行为一致性和实际兼容 |
| 质量约束 | 缺口提示、具体来源形状及审核标记检查 | 来源真实性、人物判断正确性和独立用户收益 |

> **思考**：source-grounded 是目标，不是 writer 或质量脚本自动证明的语义属性。流程允许无文件时仅凭访谈生成；quality_check 的 URL 形状、来源标记和 PASS 文本检查不能证明判断忠实于本人或适合新问题。工作技能内明确不足就说明缺口，但提示规则能否被宿主稳定遵守仍未知。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手写“扮演某人”的提示，Distilly 将来源采集、Work 与 Persona 双轨分析、用户预览、统一 writer、版本备份及宿主安装拆成可复用流程。它改变知识交接的组织方式，而非训练出人的模型；主要执行仍依赖承载 Skill 的 Agent 判断。[Q02](#research-q02)

相对手写“扮演某人”的提示，Distilly 将来源采集、Work 与 Persona 双轨分析、用户预览、统一 writer、版本备份及宿主安装拆成可复用流程。它改变知识交接的组织方式，而非训练出人的模型；主要执行仍依赖承载 Skill 的 Agent 判断。[Q02](#research-q02)

统一writer和自包含安装降低产物漂移；work-only不足信息提示及版本备份可借鉴。路径约束不等于来源授权或语义可信，质量脚本的启发式应与真实人物审核分开。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

source-grounded 是目标，不是 writer 或质量脚本自动证明的语义属性。流程允许无文件时仅凭访谈生成；quality_check 的 URL 形状、来源标记和 PASS 文本检查不能证明判断忠实于本人或适合新问题。工作技能内明确不足就说明缺口，但提示规则能否被宿主稳定遵守仍未知。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

有合法材料并愿意逐条复核的用户，可用自己的非敏感工作资料试做一个小档案，再用未参与生成的问题检验；先关注工作事实与建议是否准确，而不是说话像不像。若无法获得授权材料、不能复核或期望替代本人决策，应先观察。发布或跨宿主复制前检查私密来源与安装副本的撤回路径。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码与提示流程支持结构化人物档案生成和管理；人物忠实性、各宿主兼容与任务收益未运行验证；规则证据为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、SKILL.md、prompts/flows/create.md、tools/skill_writer.py、tools/install_generated_skill_common.py、tools/research/quality_check.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查Creator路由、创建流程、writer、安装辅助与质量启发式；未执行采集、人物模拟、模型生成或宿主安装，不审计所有平台采集器。
- 下一步：使用自己的授权非敏感材料，固定留出问题与同模型预算，审核事实、情境适用、拒答和纠错成本，再测试更新与回滚。

**分析版本**

- **仓库**：[titanwings/distilly](https://github.com/titanwings/distilly)
- **版本号**：1.0.0（[固定提交 0afc45c](https://github.com/titanwings/distilly/tree/0afc45c29c360ba7bc8260f1bb0bf34e9155f4fa)）
- **版本日期**：2026-10-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把每条行为规则绑定到具体材料片段、适用情境、反例及本人或授权审核者修正记录，让纠错有可定位的最小单元。由当前文档级质量标记与行为规则语义之间的距离推导；在20个留出工作问题上对比普通 persona 提示与规则证据版，观察事实错误、风格过拟合、拒答与修正时间。若只提高风格相似度而不改善任务忠实性，或复核负担过高，应否定。[Q05](#research-q05)

使用自己的授权非敏感材料，固定留出问题与同模型预算，审核事实、情境适用、拒答和纠错成本，再测试更新与回滚。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 50 | 6366 | — | — | 35062 |
| .mjs | source | 1 | 199 | 167 | 2 | — |
| .md | test | 1 | 24 | — | — | 223 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/titanwings/distilly/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查人物资料到可复用Skill的工作流、语义忠实边界和可控采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Person Profile 服务什么交接，是否真的复制人物？

**研究主题**：场景与需求

#### 完整回答

作者明确将项目称为 person-modeling layer，输入为消息、文档、访谈和公开材料，输出是 Person Profile，再包装为 Agent Skill；同时明确不声称克隆本人。它适用于整理自己或有权使用的他人资料以辅助工作交接，也有关系与公众人物场景。基线是手写角色提示和普通知识库检索。合格结果应在留出任务上忠实使用材料且承认超出范围，而非仅口吻相似。不能把 README 所列宿主等同本次逐个安装通过。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:38-44](https://github.com/titanwings/distilly/blob/0afc45c29c360ba7bc8260f1bb0bf34e9155f4fa/README.md#L38-L44)

作者对模型化与复制边界的定位

```text
Distilly is the person-modeling layer for agents. It turns the materials you provide into a portable, source-grounded Person Profile built from observable experience, decision patterns, expression, and ways of working; it does not claim to clone the person behind them.

Colleagues · partners · family · old friends · idols · public figures · fictional characters — even yourself

**Source material + your description → a source-grounded Person Profile → your Agent or compatible Bot**

> A Person Profile is the reusable output. The current release packages each profile as an Agent Skill so supported hosts can install and invoke it. The canonical creator Skill is named `distilly`; install it in a `distilly` directory. The former name above remains for search continuity and project history.
```

**依据 2 · 源码核查**：[SKILL.md:20-39](https://github.com/titanwings/distilly/blob/0afc45c29c360ba7bc8260f1bb0bf34e9155f4fa/SKILL.md#L20-L39)

create、evolve、manage 路由及存储、凭据界限

<details>
<summary>查看原文（20行）</summary>

```text
## Route the request

Read only the flow file the request needs, then follow it.

| The user says | Flow |
|---------------|------|
| "Set up my profile" / "Get to know me" / "Who am I to you", "distill myself", or a host's first run with no owner profile yet | `prompts/flows/owner.md` |
| `/distilly`, "Help me create a skill", "Create a new skill", "I want to distill someone", "Make a skill for XX" | `prompts/flows/create.md` (its Step 0 sends `owner` back to the owner flow) |
| "I have new files" / "append", "That's wrong" / "He wouldn't do that" / "He should be", `/update-skill {character} {slug}`, or the alias `/update-colleague {slug}` | `prompts/flows/evolve.md` |
| "Show my skills", roll back or delete a generated skill | `prompts/flows/manage.md` |

The create flow pulls in `prompts/flows/sources.md` for importing material and, for `celebrity`, `prompts/flows/celebrity_research.md`. Each flow names the prompts it needs; read those when the flow gets there, not up front.

## Rules for every flow

- **Storage**: generated skills live under `./skills/colleague/{slug}/`, `./skills/relationship/{slug}/` or `./skills/celebrity/{slug}/` in the user's workspace. For a global path, pass `--base-dir` with that family's storage root.
- **Writes**: create and update generated skills only through `tools/skill_writer.py`; never hand-build or hand-edit their files.
- **Credentials**: App Secrets, access or refresh tokens, Bot Tokens and OAuth codes never enter the conversation. Never ask for them; the user runs a collector's `--setup` / `--login` in their own terminal. `prompts/flows/sources.md` has the details.

## Compatible hosts
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 材料如何转为可安装规则，贡献在哪一层？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

create 流程选择人物家族，再读取对应 intake、Work analyzer 和 Persona analyzer；Work 提取职责、技术规范和流程，Persona 提取表达与行为模式，用户预览后才调用统一 skill_writer。writer 渲染 Work/Persona 组合及分别的 Skill，建立知识目录与 versions，并有当前产物备份函数。安装辅助读取元数据、改 frontmatter，并阻止来源与目标路径重叠。原创性边界是工作流与产物组织，模型理解、Skill 执行及平台数据由宿主和外部来源提供，不能归为新训练算法。

#### 证据与依据

**依据 1 · 源码核查**：[prompts/flows/create.md:50-79](https://github.com/titanwings/distilly/blob/0afc45c29c360ba7bc8260f1bb0bf34e9155f4fa/prompts/flows/create.md#L50-L79)

双轨分析与预览

<details>
<summary>查看原文（30行）</summary>

```text
## Step 3: Analyze Source Material

If the family is `celebrity`, first run `prompts/flows/celebrity_research.md` for the chosen research profile.

Then analyze along two tracks:

**Track A (Work Skill)**:
- Refer to `prompts/shared/work_analyzer.md`
- Extract: responsible systems, technical standards, workflow, output preferences, experience
- For `celebrity`, interpret `work` as methods, judgment frameworks, and decision patterns rather than literal job scope

**Track B (Persona)**:
- Use the family-specific persona analyzer
- If `celebrity` with `research_profile=budget-unfriendly`, use:
  - `prompts/celebrity/budget_unfriendly/persona_analyzer.md`
- Translate user-provided tags into concrete behavior rules
- Extract from materials: communication style, decision patterns, interpersonal behavior
- For `celebrity`, retain:
  - mental models
  - decision heuristics
  - expression DNA
  - contradictions
  - honest boundaries

## Step 4: Generate and Preview

Use `prompts/shared/work_builder.md` to generate Work content.
Use the family's persona builder from the matrix to generate Persona content; `celebrity` + `budget-unfriendly` uses `prompts/celebrity/budget_unfriendly/persona_builder.md`.

Show the user a summary (5-8 lines each), ask:
```

</details>

**依据 2 · 源码核查**：[prompts/flows/create.md:96-157](https://github.com/titanwings/distilly/blob/0afc45c29c360ba7bc8260f1bb0bf34e9155f4fa/prompts/flows/create.md#L96-L157)

统一 writer、安装范围与来源检查

<details>
<summary>查看原文（62行）</summary>

````text
## Step 5: Write Files

After user confirmation, do not hand-build a `skills/colleague/{slug}`-style tree. Always go through the writer:

1. Resolve the current storage root:
   - `colleague` → `./skills/colleague`
   - `relationship` → `./skills/relationship`
   - `celebrity` → `./skills/celebrity`
2. Use the `Write` tool to create three temporary files:
   - `/tmp/distilly_{slug}_meta.json`
   - `/tmp/distilly_{slug}_work.md`
   - `/tmp/distilly_{slug}_persona.md`
3. The temporary meta file must include at least:
   - `name`
   - `display_name`
   - `character`
   - `research_profile` (required when `character=celebrity`)
   - `classification.language` (must match the user's language, for example `zh-CN` or `en`)
   - `profile`
   - `tags`
   - `knowledge_sources`
4. Then call:
   ```bash
   python3 "{distilly_skill_root}/tools/skill_writer.py" \
     --action create \
     --character {character} \
     --research-profile {research_profile} \
     --slug {slug} \
     --name "{name}" \
     --meta /tmp/distilly_{slug}_meta.json \
     --work /tmp/distilly_{slug}_work.md \
     --persona /tmp/distilly_{slug}_persona.md \
     --base-dir {resolved_base_dir}
   ```
5. This command will generate:
   - `SKILL.md`
   - `work.md`
   - `persona.md`
   - `work_skill.md`
   - `persona_skill.md`
   - `manifest.json`
   - `meta.json`
   - To install the generated role skill into a host, append the relevant flag:
     - Claude Code: `--install-claude-skill`
     - OpenClaw: `--install-openclaw-skill`
     - Codex: `--install-codex-skill`
     - Hermes: run `python3 "{distilly_skill_root}/tools/install_generated_skill.py" --skill-dir "{resolved_base_dir}/{slug}" --host hermes --force`; for a trusted project, append `--skills-dir .hermes/skills`, run `hermes skills trust`, then start a new session or run `/reload-skills`. Use `~/.agents/skills` only when it is explicitly configured in Hermes `skills.external_dirs`
     - DeepSeek Harness: run `python3 "{distilly_skill_root}/tools/install_generated_skill.py" --skill-dir "{resolved_base_dir}/{slug}" --host deepseek-harness --force`; append `--skills-dir .dsh/skills` for a project install
     - Pi: run `python3 "{distilly_skill_root}/tools/install_generated_skill.py" --skill-dir "{resolved_base_dir}/{slug}" --host pi --force`; append `--skills-dir .pi/skills` for a project install, then invoke it with `/skill:{character}-{slug}`
     - Grok Build: run `python3 "{distilly_skill_root}/tools/install_generated_skill.py" --skill-dir "{resolved_base_dir}/{slug}" --host grok-build --force`; append `--skills-dir .grok/skills` for a project install
     - OpenCode: run `python3 "{distilly_skill_root}/tools/install_generated_skill.py" --skill-dir "{resolved_base_dir}/{slug}" --host opencode --force`; append `--skills-dir .opencode/skills` for a project install
     - The shared installer writes only the self-contained `SKILL.md` and install metadata and normalizes legacy frontmatter in the installed copy. Do not manually copy the whole generated directory; it may contain private source material
     - Claude Code on Windows: optionally add `--install-claude-command-shim`
6. If the current family is `celebrity`, run a quality check after creation:
   ```bash
   python3 "{distilly_skill_root}/tools/research/quality_check.py" "{resolved_base_dir}/{slug}/SKILL.md" --profile {research_profile}
   ```
7. If `source_grounding` still fails for a `celebrity` skill:
   - you may add honest limitation notes and a grounded source summary
   - only add URLs when they are real, specific, and traceable sources
   - **never** use site roots, topic pages, search pages, or other generic links as fake grounding
   - if no verified external sources exist, keep the FAIL state and explain what source material is still missing
````

</details>

**依据 3 · 源码核查**：[tools/skill_writer.py:271-312](https://github.com/titanwings/distilly/blob/0afc45c29c360ba7bc8260f1bb0bf34e9155f4fa/tools/skill_writer.py#L271-L312)

产物生成与版本备份

<details>
<summary>查看原文（42行）</summary>

```text
def create_skill(
    base_dir: Path,
    slug: str,
    meta: dict,
    work_content: str,
    persona_content: str,
) -> Path:
    """Create a new skill directory with normalized metadata."""
    slug = validate_slug(slug)
    normalized_meta = enrich_skill_meta(meta, slug, meta.get("character"))
    preset = get_character_preset(normalized_meta["character"])
    skill_dir = base_dir / slug
    skill_dir.mkdir(parents=True, exist_ok=True)

    (skill_dir / "versions").mkdir(exist_ok=True)
    for relative_path in preset.get("knowledge_dirs", ("docs", "messages", "emails")):
        (skill_dir / "knowledge" / relative_path).mkdir(parents=True, exist_ok=True)

    normalized_meta["lifecycle"]["created_at"] = normalized_meta.get("created_at", now_iso())
    normalized_meta["lifecycle"]["updated_at"] = normalized_meta["lifecycle"]["created_at"]
    normalized_meta["lifecycle"]["version"] = "v1"
    normalized_meta["generation"]["corrections_count"] = normalized_meta.get("corrections_count", 0)
    sync_legacy_fields(normalized_meta)

    write_artifacts(skill_dir, normalized_meta, work_content, persona_content)
    return skill_dir


def backup_current_artifacts(skill_dir: Path, version_name: str) -> None:
    """Copy the current artifact set into versions/<version_name>/."""
    versions_dir = resolve_contained_child(skill_dir, "versions", "versions directory")
    version_dir = resolve_contained_child(
        versions_dir,
        validate_path_segment(str(version_name), "version"),
        "version",
    )
    version_dir.mkdir(parents=True, exist_ok=True)

    for filename in PRIMARY_ARTIFACTS:
        src = skill_dir / filename
        if src.exists():
            shutil.copy2(src, version_dir / filename)
```

</details>

**依据 4 · 源码核查**：[tools/install_generated_skill_common.py:79-101](https://github.com/titanwings/distilly/blob/0afc45c29c360ba7bc8260f1bb0bf34e9155f4fa/tools/install_generated_skill_common.py#L79-L101)

安装读取与路径重叠约束

<details>
<summary>查看原文（23行）</summary>

```text
    """Install a generated combined skill into a host skill directory."""
    meta = load_generated_meta(skill_dir)
    artifacts = meta["artifacts"]
    command_name = artifacts["combined_command"]
    installed_markdown = render_installed_markdown(
        skill_dir,
        artifacts["combined_skill"],
        command_name,
    )

    install_dir = skills_dir / command_name
    install_file = install_dir / "SKILL.md"

    source_root = skill_dir.resolve()
    install_root = install_dir.resolve()
    if (
        source_root == install_root
        or source_root in install_root.parents
        or install_root in source_root.parents
    ):
        raise ValueError(
            "generated skill source and install destination must not overlap: "
            f"{skill_dir} -> {install_dir}"
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 语义忠实性由谁保证，质量脚本能证明多少？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

最强支持是 source-grounded 定位、禁止伪造具体来源，以及 work-only 提示要求对超范围或材料不足说明缺口。反例是 create 允许用户跳过文件，仅凭 Step1 回答生成；这时没有原始行为材料可用于检验。quality_check 把具体 URL 的路径形状、摘要计数和审核文件 PASS 作为启发式信号，它们支持结构检查，不证明 URL 内容与行为规则之间的语义蕴含。故一次质量脚本通过不能证明“本人会这样做”，也不排除选择性资料和情境迁移导致的错误。

#### 证据与依据

**依据 1 · 源码核查**：[prompts/flows/create.md:44-48](https://github.com/titanwings/distilly/blob/0afc45c29c360ba7bc8260f1bb0bf34e9155f4fa/prompts/flows/create.md#L44-L48)

允许无文件生成的边界

```text
## Step 2: Source Material Import

Follow `prompts/flows/sources.md` to offer the import options and read what the user provides.

If the user says "no files" or "skip", generate the Skill from the Step 1 answers only.
```

**依据 2 · 源码核查**：[tools/skill_writer.py:187-206](https://github.com/titanwings/distilly/blob/0afc45c29c360ba7bc8260f1bb0bf34e9155f4fa/tools/skill_writer.py#L187-L206)

缺口与不臆造提示

<details>
<summary>查看原文（20行）</summary>

```text
WORK_ONLY_FALLBACK_ZH = (
    "如果问题超出已记录的职责范围，或原材料不足以回答，请直接说明缺口。"
    "不要臆造缺失信息，也不要引用 Persona。"
)
WORK_ONLY_FALLBACK_EN = (
    "If the question is outside the recorded responsibilities or the source "
    "material is insufficient, state the gap. Do not fabricate missing information "
    "or refer to Persona."
)


def work_only_content(work_content: str, *, chinese: bool) -> str:
    """Copy Work text for the Work-only skill, without a Persona handoff."""
    text = work_content
    for pattern in _PERSONA_HANDOFF_PATTERNS:
        text = pattern.sub("", text)
    text = text.rstrip()
    fallback = WORK_ONLY_FALLBACK_ZH if chinese else WORK_ONLY_FALLBACK_EN
    if fallback not in text:
        text = f"{text}\n\n{fallback}" if text else fallback
```

</details>

**依据 3 · 源码核查**：[tools/research/quality_check.py:69-101](https://github.com/titanwings/distilly/blob/0afc45c29c360ba7bc8260f1bb0bf34e9155f4fa/tools/research/quality_check.py#L69-L101)

PASS 文本及 URL 形状判断

<details>
<summary>查看原文（33行）</summary>

```text
def review_status_is_pass(text: str) -> bool:
    """Return True when a review file explicitly passes."""
    return bool(
        re.search(r"Status:\s*PASS\b", text, re.IGNORECASE)
        or re.search(r"Release readiness:\s*ready\b", text, re.IGNORECASE)
        or re.search(r"Verdict:?\s*PASS\b", text, re.IGNORECASE)
    )


def is_source_like_url(url: str) -> bool:
    """Return True when a URL looks like a concrete source rather than a homepage."""
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        return False

    path = (parsed.path or "").rstrip("/")
    normalized_path = path or "/"
    if normalized_path in GENERIC_URL_PATHS:
        return False

    segments = [segment for segment in path.split("/") if segment]
    if len(segments) >= 2:
        return True

    slug = segments[0] if segments else ""
    if len(slug) >= 8:
        return True

    query = parsed.query.lower()
    if any(marker in query for marker in ("id=", "vid=", "aid=", "bvid=", "p=", "article")):
        return True

    return False
```

</details>

**依据 4 · 源码核查**：[tools/research/quality_check.py:104-130](https://github.com/titanwings/distilly/blob/0afc45c29c360ba7bc8260f1bb0bf34e9155f4fa/tools/research/quality_check.py#L104-L130)

来源与审核指标从文件解析

<details>
<summary>查看原文（27行）</summary>

```text
def load_research_metrics(path: Path) -> dict:
    """Load merged research metrics adjacent to a skill directory when available."""
    skill_root = path if path.is_dir() else path.parent
    summary_path = skill_root / "knowledge" / "research" / "merged" / "summary.md"
    reviews_dir = skill_root / "knowledge" / "research" / "reviews"
    audit_path = reviews_dir / "research_audit.md"
    synthesis_path = reviews_dir / "synthesis.md"
    validation_path = reviews_dir / "validation.md"
    if not summary_path.exists():
        return {
            **DEFAULT_RESEARCH_METRICS,
            "research_audit_present": audit_path.exists(),
            "synthesis_review_present": synthesis_path.exists(),
            "validation_review_present": validation_path.exists(),
            "research_audit_pass": review_status_is_pass(audit_path.read_text(encoding="utf-8")) if audit_path.exists() else False,
            "validation_review_pass": review_status_is_pass(validation_path.read_text(encoding="utf-8")) if validation_path.exists() else False,
        }

    summary_text = summary_path.read_text(encoding="utf-8")
    audit_text = audit_path.read_text(encoding="utf-8") if audit_path.exists() else ""
    validation_text = validation_path.read_text(encoding="utf-8") if validation_path.exists() else ""
    return {
        "files_scanned": extract_summary_metric(summary_text, "Files scanned"),
        "unique_urls": extract_summary_metric(summary_text, "Unique URLs"),
        "primary_source_markers": extract_summary_metric(summary_text, "Primary-source markers"),
        "source_metadata_blocks": extract_summary_metric(summary_text, "Source metadata blocks"),
        "contradiction_bullets": extract_summary_metric(summary_text, "Contradiction bullets"),
```

</details>

#### 缺口

- 缺少规则级语义对照与留出任务测试
  **影响**：不能确认人物判断忠实性或较普通提示的优势
  **进一步探讨**：保留授权原始片段，设计未用于生成的问题，由本人或授权审核者盲评准确性与缺口处理

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 生成、安装和纠错的前提与成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

这是可被宿主调用的 Skill 加 Python 工具链，不是独立执行 Agent。SKILL 明确通过实际加载路径解析资源，避免工作目录与安装目录混淆。资料可以手工输入或通过平台采集；后者增加授权、API 和隐私整理工作。生成成本应以一个经留出问题审核合格的档案为单位，计入整理、核对和后续修正，不能将一次生成调用视为完成。安装只复制自包含内容旨在减少原始私密材料传播，但生成正文是否含私密信息仍需人审。

首次投入主要是材料授权、整理与模型提炼，持续投入是审核和新材料纠错，失败还需回滚及处理已分发副本。金额、Token和复核时间未知，不能用生成一次的成本代替合格档案成本。具体阶段与效果见[成本与效果](#cost-and-value)，宿主与资料条件见[依赖与流程](#dependencies-and-flow)。

#### 证据与依据

**依据 1 · 源码核查**：[SKILL.md:12-14](https://github.com/titanwings/distilly/blob/0afc45c29c360ba7bc8260f1bb0bf34e9155f4fa/SKILL.md#L12-L14)

实际路径与工作区输出边界

```text
> **Skill Root**: Before reading a bundled prompt or running a bundled script, resolve the absolute directory of the `SKILL.md` that the host actually loaded. In the instructions below, `{distilly_skill_root}` means that exact directory. Claude Code exposes it as `${CLAUDE_SKILL_DIR}`; on every other host, use the loaded-skill path supplied by that host's discovery context. Do not assume the shell's current working directory is the Skill root, and do not guess or hard-code an install path. If the host does not expose the loaded path or more than one Distilly installation is ambiguous, ask the user to identify the active installation before running code.
>
> Keep the shell in the user's current workspace so relative output paths such as `./skills/...` remain project-local. Resolve every `tools/...` and `prompts/...` resource against `{distilly_skill_root}`. For example, run `tools/owner_profile.py` as `python3 "{distilly_skill_root}/tools/owner_profile.py"`; replace the placeholder with the resolved absolute path in the actual tool call.
```

**依据 2 · 源码核查**：[prompts/flows/create.md:138-147](https://github.com/titanwings/distilly/blob/0afc45c29c360ba7bc8260f1bb0bf34e9155f4fa/prompts/flows/create.md#L138-L147)

宿主安装与不复制私密来源目录

<details>
<summary>查看原文（10行）</summary>

```text
   - To install the generated role skill into a host, append the relevant flag:
     - Claude Code: `--install-claude-skill`
     - OpenClaw: `--install-openclaw-skill`
     - Codex: `--install-codex-skill`
     - Hermes: run `python3 "{distilly_skill_root}/tools/install_generated_skill.py" --skill-dir "{resolved_base_dir}/{slug}" --host hermes --force`; for a trusted project, append `--skills-dir .hermes/skills`, run `hermes skills trust`, then start a new session or run `/reload-skills`. Use `~/.agents/skills` only when it is explicitly configured in Hermes `skills.external_dirs`
     - DeepSeek Harness: run `python3 "{distilly_skill_root}/tools/install_generated_skill.py" --skill-dir "{resolved_base_dir}/{slug}" --host deepseek-harness --force`; append `--skills-dir .dsh/skills` for a project install
     - Pi: run `python3 "{distilly_skill_root}/tools/install_generated_skill.py" --skill-dir "{resolved_base_dir}/{slug}" --host pi --force`; append `--skills-dir .pi/skills` for a project install, then invoke it with `/skill:{character}-{slug}`
     - Grok Build: run `python3 "{distilly_skill_root}/tools/install_generated_skill.py" --skill-dir "{resolved_base_dir}/{slug}" --host grok-build --force`; append `--skills-dir .grok/skills` for a project install
     - OpenCode: run `python3 "{distilly_skill_root}/tools/install_generated_skill.py" --skill-dir "{resolved_base_dir}/{slug}" --host opencode --force`; append `--skills-dir .opencode/skills` for a project install
     - The shared installer writes only the self-contained `SKILL.md` and install metadata and normalizes legacy frontmatter in the installed copy. Do not manually copy the whole generated directory; it may contain private source material
```

</details>

**依据 3 · 作者声明**：[README.md:153-165](https://github.com/titanwings/distilly/blob/0afc45c29c360ba7bc8260f1bb0bf34e9155f4fa/README.md#L153-L165)

作者来源采集与平台条件

<details>
<summary>查看原文（13行）</summary>

```text
## 📦 Supported Data Sources

| Logo | Source | Messages | Docs / Wiki | Notes |
|:----:|--------|:--------:|:-----------:|-------|
| <img src="docs/assets/sources/lark-mark.png" alt="Lark" width="32" height="32"> | Lark (auto) | ✅ API | ✅ | Just enter a name, fully automatic |
| <img src="docs/assets/sources/dingtalk-mark.jpg" alt="DingTalk" width="32" height="32"> | DingTalk (auto) | ⚠️ Browser | ✅ | DingTalk API doesn't support message history |
| <img src="docs/assets/sources/slack-mark.png" alt="Slack" width="32" height="32"> | Slack (auto) | ✅ API | — | Requires admin to install Bot; free plan limited to 90 days |
| <picture><source media="(prefers-color-scheme: dark)" srcset="docs/assets/sources/x-mark-dark.svg"><img src="docs/assets/sources/x-mark-light.svg" alt="X" width="32" height="32"></picture> | Public X posts | ✅ API | — | Optional, bounded celebrity research candidates through metered third-party service Xquik |
| <img src="docs/assets/sources/wechat-mark.jpg" alt="WeChat" width="32" height="32"> | WeChat chat history | ✅ SQLite | — | Export first with WeChatMsg or PyWxDump |
| 📄 | PDF / Images / Screenshots | — | ✅ | Manual upload |
| <img src="docs/assets/sources/lark-mark.png" alt="Lark" width="32" height="32"> | Lark JSON export | ✅ | ✅ | Manual upload |
| ✉️ | Email `.eml` / `.mbox` | ✅ | — | Manual upload |
| 📝 | Markdown / direct paste | ✅ | ✅ | Manual input |
```

</details>

#### 缺口

- 没有模型调用量、授权耗时与纠错样本
  **影响**：无法计算合格档案成本或跨宿主维护负担
  **进一步探讨**：小规模记录资料准备、模型生成、人工核对、留出测试及更新回滚的完整投入

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 规则证据与反例会改善任务忠实性吗，先给谁用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

从文档级来源标记的局限推导规则级证据单元，含原片段、情境、反例和审核修正。它可能减少对孤立表达的过拟合，但也增加标注成本，不能预先认定为更好。实验固定20个留出工作问题，比较普通 persona、当前双轨产物与规则证据版，同一模型和预算下由授权审核者判断事实、适用性、拒答和修正时间。自己资料的非敏感小档案是可控试用；无法授权或无法判断忠实性的人群不宜把其输出作为替代本人决策的依据。

#### 证据与依据

**依据 1 · 源码核查**：[tools/research/quality_check.py:78-101](https://github.com/titanwings/distilly/blob/0afc45c29c360ba7bc8260f1bb0bf34e9155f4fa/tools/research/quality_check.py#L78-L101)

现有结构性检查支持改进方向

<details>
<summary>查看原文（24行）</summary>

```text
def is_source_like_url(url: str) -> bool:
    """Return True when a URL looks like a concrete source rather than a homepage."""
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        return False

    path = (parsed.path or "").rstrip("/")
    normalized_path = path or "/"
    if normalized_path in GENERIC_URL_PATHS:
        return False

    segments = [segment for segment in path.split("/") if segment]
    if len(segments) >= 2:
        return True

    slug = segments[0] if segments else ""
    if len(slug) >= 8:
        return True

    query = parsed.query.lower()
    if any(marker in query for marker in ("id=", "vid=", "aid=", "bvid=", "p=", "article")):
        return True

    return False
```

</details>

**依据 2 · 源码核查**：[tools/skill_writer.py:187-206](https://github.com/titanwings/distilly/blob/0afc45c29c360ba7bc8260f1bb0bf34e9155f4fa/tools/skill_writer.py#L187-L206)

已有缺口规则提供可检验的行为目标

<details>
<summary>查看原文（20行）</summary>

```text
WORK_ONLY_FALLBACK_ZH = (
    "如果问题超出已记录的职责范围，或原材料不足以回答，请直接说明缺口。"
    "不要臆造缺失信息，也不要引用 Persona。"
)
WORK_ONLY_FALLBACK_EN = (
    "If the question is outside the recorded responsibilities or the source "
    "material is insufficient, state the gap. Do not fabricate missing information "
    "or refer to Persona."
)


def work_only_content(work_content: str, *, chinese: bool) -> str:
    """Copy Work text for the Work-only skill, without a Persona handoff."""
    text = work_content
    for pattern in _PERSONA_HANDOFF_PATTERNS:
        text = pattern.sub("", text)
    text = text.rstrip()
    fallback = WORK_ONLY_FALLBACK_ZH if chinese else WORK_ONLY_FALLBACK_EN
    if fallback not in text:
        text = f"{text}\n\n{fallback}" if text else fallback
```

</details>

#### 缺口

- 规则证据是否降低错误、用户是否愿意承担复核未知
  **影响**：创新方向仍是未验证假设，不计入当前贡献
  **进一步探讨**：先收集授权工作案例和盲评结果，若只提高模仿感却不提高正确性则停止

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
