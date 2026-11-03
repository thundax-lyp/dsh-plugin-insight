# Everything Kiro

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[1a6fd15](https://github.com/iamaanahmad/everything-kiro/tree/1a6fd156c6308875a5bf9756fdbe4e0730e1fb19)

<!-- BEGIN META -->
[![GitHub ★ 31](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=31&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/iamaanahmad/everything-kiro)
<!-- END META -->

> **功能**：面向 Kiro IDE 的 Agent、Hook、Steering、Power、MCP 示例和开发工作流配置集合。

> **亮点**：[Q01](#research-q01) 将角色、分阶段Spec、事件检查和外部工具示例整理为可按项审阅的配置起点，减少重复收集文档的责任，未证明运行收益。

> **主要限制**：[Q02](#research-q02) 保存hook可自动写回且依赖npx/pwsh；敏感规则有限，postgres query默认autoApprove与Power指南冲突，广泛allow示例不能当安全边界。

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
  - [Q01 · 这个集合如何生效，哪些是配置资源而不是已经运行的Agent能力？](#detail-section-11)
  - [Q02 · 自动Hook、权限与MCP示例是否提供可直接照搬的可靠保护？](#detail-section-12)
  - [Q03 · 怎样把配置集作为可回退参考试用，成本与配置验收假设是什么？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 熟悉Kiro的开发者选择复用工作流与配置，合格结果是目标工程正确加载且每条副作用可解释。

[Q01](#research-q01) 对照逐项目从零整理指令与检查清单，Kiro宿主功能是继承能力，文件数量不等于运行能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Steering/Spec工作流 | 复用规范和分阶段需求设计 | 作者兼容声明未运行确认 |
| 角色Agent模板 | 选择评审、测试等角色提示 | 文件需加载，角色不证明专业效果 |
| 自动Hook配置 | 在保存/任务/工具时运行命令或提醒 | 可能写回文件，项目工具和pwsh需核 |
| MCP示例 | 参考外部工具接入 | 默认5项启用，placeholder/包名不证明可用 |
| Power与权限参考 | 整理指导和能力规则 | query默认批准与指南冲突，不当作完整隔离 |

**流程与依赖**

[Q03](#research-q03) 依赖表区分宿主schema、项目工具、pwsh、外部MCP与副作用控制。

[Q03](#research-q03) 先单份手动参考，再逐项验证，退出移除新增项并核两个scope。

**效果与成本**

[Q03](#research-q03) 成本表包含配置审核、重复触发、模型上下文与恢复，不编造节省。

[Q03](#research-q03) 效果表区分整理起点、触发声明与真实保护/结果。

> **思考**：[Q02](#research-q02) 保存hook可自动写回且依赖npx/pwsh；敏感规则有限，postgres query默认autoApprove与Power指南冲突，广泛allow示例不能当安全边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将角色、分阶段Spec、事件检查和外部工具示例整理为可按项审阅的配置起点，减少重复收集文档的责任，未证明运行收益。

[Q02](#research-q02) 模块化文件和明确触发可审阅，角色文案不是执行保证；Power只读建议与query自动批准不一致，缺环境验证和CI增加维护责任。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 保存hook可自动写回且依赖npx/pwsh；敏感规则有限，postgres query默认autoApprove与Power指南冲突，广泛allow示例不能当安全边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先一次性工程只取手动steering/Spec，禁用MCP和自动修复；核实际IDE加载与差异，再审每条命令和权限。无法解释目标/改写/来源就恢复原配置并重载，不全局复制。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定配置和文档source核查，类型为资源集合；仅按项参考试用，不建议整包自动启用。当前Kiro兼容、外部MCP与hook运行均未验证。

- 已检查：作者 README、包清单、源码路径 README.md、INSTALL.md、STATUS.md、.kiro/hooks/lint-and-format.json、.kiro/hooks/block-sensitive-file-writes.json、.kiro/settings/mcp.json、examples/permissions.yaml、agents/security-auditor.md、powers/database-power/POWER.md、skills/development-workflows/spec-driven-development.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根资源完整inventory；人工读取隐藏Hook/MCP、README/INSTALL/STATUS、权限示例、代表security Agent、数据库Power与Spec工作流。未运行Kiro或外部服务，不验证当前schema。
- 下一步：未执行hook、npx、uvx、MCP或Kiro；后续对实际IDE版本核schema，在一次性工程逐项记录加载、触发、diff和缺依赖失败。

**分析版本**

- **仓库**：[iamaanahmad/everything-kiro](https://github.com/iamaanahmad/everything-kiro)
- **版本号**：未声明（[固定提交 1a6fd15](https://github.com/iamaanahmad/everything-kiro/tree/1a6fd156c6308875a5bf9756fdbe4e0730e1fb19)）
- **版本日期**：2026-09-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 未验证项目配置验收清单绑定依赖、触发、写回和权限，默认关闭未验项；以错误启用/意外写入/耗时对照，无改善或维护更贵即否定。

未执行hook、npx、uvx、MCP或Kiro；后续对实际IDE版本核schema，在一次性工程逐项记录加载、触发、diff和缺依赖失败。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 38 | 13344 | — | — | 42357 |
| .md | example | 6 | 733 | — | — | 2762 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/iamaanahmad/everything-kiro/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/iamaanahmad/everything-kiro/issues?q=is%3Aissue+created%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/iamaanahmad/everything-kiro/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z)



统计日期：2026-11-03。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Kiro配置集合能否提供可审阅的开发工作流，自动hook与外部MCP有哪些实际边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这个集合如何生效，哪些是配置资源而不是已经运行的Agent能力？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

Everything Kiro是面向Kiro IDE的配置和工作流资源集合，不是DSH原生插件，也不是自带执行引擎。实际材料包含隐藏.kiro目录中的steering、v1 JSON hooks与MCP示例，以及顶层agents、powers和普通Markdown工作流。安装文档要求手工将agents复制到.kiro/agents、powers复制到.kiro/powers，单独读到顶层文档不表示宿主已注册它们。

目标用户是已有Kiro工程、希望复用代码规范、评审角色和事件检查的开发者。相对从零整理每项目指令，贡献是把常见开发流程和配置形态放在可审阅的起点，例如Spec文档把requirements/design/tasks与批准顺序明确表达；这复用了Kiro已有特性，不是仓库发明新的Agent调度器或审批执行器。顶层skills是可读工作流，不应据目录名认定它们都是DSH/Codex的SKILL.md注册入口。

README与STATUS宣称按Kiro IDE1.0+到2026年9月schema整理；本轮未访问当前官方schema或运行Kiro，因此只能把它作为作者兼容声明。实际文件可以确认配置写了什么，不能确认当前IDE接受或按预期触发。已有8个Agent文件、12个Hook文件和3个Power目录是静态资产范围，不代表并行Agent数、运行次数或可用外部工具数量。

安装还提供用户级路径，作者说明会影响所有工作区。对单项目需求，全局复制会把维护与触发范围扩大，用户必须先逐项选择；不能把“一次复制全部”当免配置价值。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-39](https://github.com/iamaanahmad/everything-kiro/blob/1a6fd156c6308875a5bf9756fdbe4e0730e1fb19/README.md#L9-L39)

资源类别与预期目录结构。

<details>
<summary>查看原文（31行）</summary>

````text
```
everything-kiro/
├── .kiro/                        # Drop this whole folder into a workspace to use everything at once
│   ├── settings/
│   │   └── mcp.json              # MCP server configs (workspace-level)
│   ├── steering/                 # Always-active + conditional + manual context
│   │   ├── coding-standards.md   # inclusion: always
│   │   ├── security-rules.md     # inclusion: always
│   │   ├── project-patterns.md   # inclusion: always
│   │   ├── api-conventions.md    # inclusion: fileMatch (loads only for routes/controllers/api files)
│   │   └── release-checklist.md  # inclusion: manual (loads via /release-checklist)
│   └── hooks/                    # v1 JSON hooks, PascalCase triggers
│       └── *.json                # 12 hooks — see hooks/README.md for the list
│
├── agents/                       # 8 specialized agents (IDE 1.0 Markdown format)
│   ├── architect.md              # tools: read, web
│   ├── code-reviewer.md          # tools: read, web
│   ├── debug-detective.md        # tools: read, shell, web
│   ├── devops-specialist.md      # tools: read, write, shell, web
│   ├── documentation-writer.md   # tools: read, write, web
│   ├── performance-optimizer.md  # tools: read, shell, web
│   ├── security-auditor.md       # tools: read, web (shell: ask)
│   └── test-engineer.md          # tools: read, write, shell
│
├── powers/                       # Kiro Powers (POWER.md + optional mcp.json + optional steering/)
│   ├── README.md                 # Real Powers schema reference
│   ├── development-power/        # Knowledge Base Power: code review, TDD, debugging, QA
│   ├── devops-power/             # Knowledge Base Power: deploy checklist, Docker, CI/CD
│   └── database-power/           # Guided MCP Power: Postgres inspection via MCP
│
├── skills/                       # Workflow documentation, invoked by agents or read directly
````

</details>

**依据 2 · 作者声明**：[INSTALL.md:9-25](https://github.com/iamaanahmad/everything-kiro/blob/1a6fd156c6308875a5bf9756fdbe4e0730e1fb19/INSTALL.md#L9-L25)

真实复制位置和按需选择。

<details>
<summary>查看原文（17行）</summary>

````text
# Steering, hooks, and MCP config
cp -r ../everything-kiro/.kiro/steering .kiro/steering
cp -r ../everything-kiro/.kiro/hooks .kiro/hooks
cp ../everything-kiro/.kiro/settings/mcp.json .kiro/settings/mcp.json

# Agents (Kiro reads these from .kiro/agents, not a top-level agents/ folder)
mkdir -p .kiro/agents
cp ../everything-kiro/agents/*.md .kiro/agents/

# Powers
mkdir -p .kiro/powers
cp -r ../everything-kiro/powers/development-power .kiro/powers/
cp -r ../everything-kiro/powers/devops-power .kiro/powers/
cp -r ../everything-kiro/powers/database-power .kiro/powers/
```

Pick and choose — you don't need all 12 hooks or all 3 powers. Delete what doesn't fit your project before committing.
````

</details>

**依据 3 · 作者声明**：[INSTALL.md:27-36](https://github.com/iamaanahmad/everything-kiro/blob/1a6fd156c6308875a5bf9756fdbe4e0730e1fb19/INSTALL.md#L27-L36)

用户级配置影响范围。

<details>
<summary>查看原文（10行）</summary>

````text
## Option 2: User-level install (applies to every workspace)

```bash
cp -r everything-kiro/.kiro/steering ~/.kiro/steering
cp -r everything-kiro/.kiro/hooks ~/.kiro/hooks
cp -r everything-kiro/agents ~/.kiro/agents
cp -r everything-kiro/powers/* ~/.kiro/powers/
```

User-level hooks and steering apply across all workspaces automatically — useful for things like lint-on-save or security rules you want everywhere, less useful for project-specific things like `api-conventions.md`'s `fileMatchPattern`.
````

</details>

**依据 4 · 源码核查**：[skills/development-workflows/spec-driven-development.md:1-21](https://github.com/iamaanahmad/everything-kiro/blob/1a6fd156c6308875a5bf9756fdbe4e0730e1fb19/skills/development-workflows/spec-driven-development.md#L1-L21)

三阶段流程属于指导，不是执行器。

<details>
<summary>查看原文（21行）</summary>

````text
# Spec-Driven Development with Kiro

How Kiro's actual spec system works: three files, one per phase, each requiring explicit approval before the next begins.

## What a spec is

A spec formalizes a feature or fix into three markdown files under `.kiro/specs/{feature_name}/`:

- **requirements.md** — what needs to be built, in EARS format
- **design.md** — how it will be built, with interfaces and data models
- **tasks.md** — a numbered, checkbox-based implementation plan

Each phase must be explicitly approved by the user before Kiro moves to the next one. This is not optional pacing — it's the point of the workflow: catch misunderstandings in requirements before they become a wrong design, and catch design gaps before they become wrong code.

## The workflow

```
requirements.md → (approval) → design.md → (approval) → tasks.md → (approval) → task execution
```

Kiro also offers **Quick Spec**, a mode that generates all three phases in one pass after a short round of clarifying questions, for when the full gated workflow is more ceremony than the feature needs. Use the full workflow for anything touching more than a few files or with real ambiguity in scope; use Quick Spec for small, well-understood features.
````

</details>

**依据 5 · 作者声明**：[STATUS.md:1-15](https://github.com/iamaanahmad/everything-kiro/blob/1a6fd156c6308875a5bf9756fdbe4e0730e1fb19/STATUS.md#L1-L15)

作者兼容与静态资产说明。

<details>
<summary>查看原文（15行）</summary>

```text
# Everything Kiro — Status

## Current status: updated for Kiro IDE 1.0+ through September 2026

Schemas verified against kiro.dev docs and the official changelog. This pass adds IDE 1.0 features: permissions, AGENTS.md, updated agent format with `tools` tags, Agent Focus Mode, Cloud Sessions, Cloud Configuration Sync, and Agent Plugin support for Powers.

## What's included

| Component | Count | Notes |
|---|---|---|
| Agents (`agents/*.md`) | 8 | IDE 1.0 Markdown format — frontmatter includes `tools`, `welcomeMessage`, and inline `permissions` where appropriate |
| Steering (`.kiro/steering/*.md`) | 5 | 3 `always`, 1 `fileMatch` example, 1 `manual` example |
| Hooks (`.kiro/hooks/*.json`) | 12 | v1 JSON schema, PascalCase triggers — see `hooks/README.md` |
| Powers (`powers/*`) | 3 | development-power, devops-power (Knowledge Base), database-power (Guided MCP) |
| Skills (`skills/**/*.md`) | 8 | development-workflows, language-patterns, infrastructure |
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 自动Hook、权限与MCP示例是否提供可直接照搬的可靠保护？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

不能整包照搬为安全基线。lint-and-format在PostFileSave运行npx prettier --write和eslint --fix，会写回文件；type-check调用npx tsc，related-test和post-task调用npm test，style-lint也带--fix。它们是声明式触发，不提供项目依赖或脚本；没有package.json的本仓并不能证明拷到任意项目可运行。npx调用也未固定工具版本，目标项目缺依赖时的下载/失败行为必须核实，不能称为无外部执行。

敏感文件hook在PreToolUse调用pwsh，读取tool_input.path，只匹配指定工具名和以.env、credentials.json、id_rsa、.pem结尾的路径。它没有覆盖所有秘密文件命名，例如.env.local不匹配这个.env$规则；同文件的shell命令写入也不是这段matcher能保证拦住。pwsh不可用、stdin形状不同、IDE失败处理未知，都会影响实际保护。这里是对配置字面模式的判断，未做绕过实验，不能宣称已验证权限逃逸。

MCP示例17个server中5个disabled=false，其中postgres把query列autoApprove。database-power的指南却说除可丢弃本地环境外应让query显式审批，这是同仓直接不一致。examples/permissions又允许所有配置MCP和广泛git/npm/npx/shell族命令；deny中的若干字符串模式不是完整命令语义约束。数据权限应来自数据库角色、宿主强制权限及人工确认，不能只靠“优先只读”提示或工具名称。

security-auditor的frontmatter设置tools=[read,web]并要求shell ask，是可审阅的正向配置，但模型角色自称专家不证明审计覆盖。Power与steering提供检查清单可复用，实际保护依赖宿主解析和后端权限。仓库STATUS也承认没有hook语法/死链CI，本轮仅阅读实际JSON/YAML，不执行任何hook或MCP。

#### 证据与依据

**依据 1 · 源码核查**：[.kiro/hooks/lint-and-format.json:5-13](https://github.com/iamaanahmad/everything-kiro/blob/1a6fd156c6308875a5bf9756fdbe4e0730e1fb19/.kiro/hooks/lint-and-format.json#L5-L13)

保存后npx自动改文件且启用。

```text
      "name": "lint-and-format",
      "trigger": "PostFileSave",
      "matcher": "\\.(ts|tsx|js|jsx|json)$",
      "action": {
        "type": "command",
        "command": "npx prettier --write \"$FILE_PATH\" && npx eslint \"$FILE_PATH\" --fix"
      },
      "timeout": 30,
      "enabled": true
```

**依据 2 · 源码核查**：[.kiro/hooks/block-sensitive-file-writes.json:5-13](https://github.com/iamaanahmad/everything-kiro/blob/1a6fd156c6308875a5bf9756fdbe4e0730e1fb19/.kiro/hooks/block-sensitive-file-writes.json#L5-L13)

pwsh依赖、工具matcher与结尾路径规则。

```text
      "name": "block-sensitive-file-writes",
      "trigger": "PreToolUse",
      "matcher": "fs_write|str_replace|fs_append",
      "action": {
        "type": "command",
        "command": "pwsh -NoProfile -Command \"$json = [Console]::In.ReadToEnd() | ConvertFrom-Json; $path = $json.tool_input.path; if ($path -match '\\.env$|credentials\\.json$|id_rsa$|\\.pem$') { Write-Error 'Blocked: writing to a secrets-bearing file is not allowed via automated hooks.'; exit 2 } else { exit 0 }\""
      },
      "timeout": 10,
      "enabled": true
```

**依据 3 · 源码核查**：[.kiro/settings/mcp.json:3-37](https://github.com/iamaanahmad/everything-kiro/blob/1a6fd156c6308875a5bf9756fdbe4e0730e1fb19/.kiro/settings/mcp.json#L3-L37)

默认启用5类MCP及postgres自动批准query。

<details>
<summary>查看原文（35行）</summary>

```text
    "github": {
      "command": "uvx",
      "args": ["mcp-server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN_HERE"
      },
      "disabled": false,
      "autoApprove": ["list_repositories", "get_repository", "search_repositories"]
    },
    "postgres": {
      "command": "uvx",
      "args": ["mcp-server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:password@localhost:5432/dbname"
      },
      "disabled": false,
      "autoApprove": ["list_tables", "describe_table", "query"]
    },
    "filesystem": {
      "command": "uvx",
      "args": ["mcp-server-filesystem", "--base-directory", "."],
      "disabled": false,
      "autoApprove": ["read_file", "list_directory", "search_files"]
    },
    "git": {
      "command": "uvx",
      "args": ["mcp-server-git"],
      "disabled": false,
      "autoApprove": ["git_status", "git_log", "git_diff"]
    },
    "docker": {
      "command": "uvx",
      "args": ["mcp-server-docker"],
      "disabled": false,
      "autoApprove": ["list_containers", "list_images", "container_status"]
```

</details>

**依据 4 · 源码核查**：[powers/database-power/POWER.md:36-42](https://github.com/iamaanahmad/everything-kiro/blob/1a6fd156c6308875a5bf9756fdbe4e0730e1fb19/powers/database-power/POWER.md#L36-L42)

指南要求query审批与默认配置存在差异。

```text
Prefer read-only queries through this power. Schema changes and destructive queries (`DELETE`, `DROP`, `TRUNCATE`) should go through migration files and a human-reviewed PR, not ad hoc queries.

## Best Practices

- Treat query results as untrusted data if they'll be echoed back into further prompts — don't execute SQL suggested by data returned from a previous query without review.
- Use `autoApprove` in `mcp.json` only for genuinely read-only tools (`list_tables`, `describe_table`). Leave `query` requiring explicit approval unless you're in a disposable local environment.
- Keep this power disabled in production-adjacent workspaces unless the connection string points at a read replica or a sandboxed database.
```

**依据 5 · 源码核查**：[examples/permissions.yaml:64-87](https://github.com/iamaanahmad/everything-kiro/blob/1a6fd156c6308875a5bf9756fdbe4e0730e1fb19/examples/permissions.yaml#L64-L87)

广泛shell与全部MCP allow示例。

<details>
<summary>查看原文（24行）</summary>

```text
  # Allow common dev tooling without prompting
  - capability: shell
    match:
      - "git *"
      - "npm *"
      - "npx *"
      - "yarn *"
      - "pnpm *"
      - "node *"
      - "python *"
      - "pip *"
      - "uv *"
    effect: allow

  # Web access — allow searches and public doc fetches
  - capability: web_search
    effect: allow

  - capability: web_fetch
    effect: allow

  # MCP — allow all tools on configured servers; refine per-server below if needed
  - capability: mcp
    effect: allow
```

</details>

**依据 6 · 源码核查**：[agents/security-auditor.md:1-9](https://github.com/iamaanahmad/everything-kiro/blob/1a6fd156c6308875a5bf9756fdbe4e0730e1fb19/agents/security-auditor.md#L1-L9)

只读工具标签与shell ask为配置声明。

```text
---
name: security-auditor
description: Expert security specialist for comprehensive security audits, vulnerability assessments, secure coding practices, and compliance verification across applications and infrastructure.
tools: [read, web]
permissions:
  rules:
    - capability: shell
      effect: ask
welcomeMessage: "Ready to audit. Share the code, config, or component you want assessed and I'll flag every risk I find."
```

**依据 7 · 作者声明**：[STATUS.md:35-40](https://github.com/iamaanahmad/everything-kiro/blob/1a6fd156c6308875a5bf9756fdbe4e0730e1fb19/STATUS.md#L35-L40)

作者承认CI与云配置缺口。

```text
## Known gaps / not attempted

- Language-specific skills beyond TypeScript/Python/React (Go, Rust, Java) — not added.
- No CI workflow validating hook JSON syntax or dead markdown links — worth adding if this grows.
- `permissions.yaml` placed at `examples/` rather than `.kiro/settings/` because Kiro's hardcoded scope blocks agent writes to `.kiro/settings/`. Copy it manually.
- Cloud Configuration Sync and Cloud Sessions are documented but no cloud-specific config is included — those are account-level features managed in Kiro Web.
```

#### 缺口

- 未核外部MCP包的真实工具语义、权限与可用性
  **影响**：不支持默认server或query只读/安全结论
  **进一步探讨**：逐个核官方包/版本与最小凭据，数据库采用真正只读角色并去除query自动批准。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样把配置集作为可回退参考试用，成本与配置验收假设是什么？

**研究主题**：效果与总成本、采用判断、新假设与验证、依赖、兼容与流程

#### 完整回答

建议仅把它当可选择的工作流/配置参考试用，不建议首次就复制所有hook、全局权限和MCP。熟悉Kiro且能审阅配置的开发者先取一份manual steering或Spec流程，在独立工程确认加载；自动修复、外部服务和全局规则另行逐项批准。若用户不能解释一条命令或权限，不启用该项。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 支持对应schema的Kiro IDE | 配置生效必需 | Agent/Power/Hook解析 | 作者声明未代替当前版本核查 |
| 工程npm脚本、格式器/类型检查/测试工具 | 相关hook必需 | 自动检查或写回 | 缺失会失败或可能请求下载，先禁用 |
| pwsh与正确hook stdin/工具名 | 敏感文件示例必需 | 规则检查 | 不满足时不能声称拦截有效 |
| uvx与逐个MCP包/账号 | MCP特定操作必需 | 启动外部工具 | 示例名和placeholder不证明服务可用 |
| 项目备份、最小权限及差异检查 | 采用必需 | 控制自动改文件和恢复 | 不全局复制，不放真实凭据进仓库 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 选择 | 用户只选一份手动steering/工作流，保存原配置 | 没有扩大到用户全局 |
| 加载 | 用户按实际IDE路径放置并重载 | 面板明确显示加载，不能只问模型自报 |
| 自动化准备 | 用户审命令、固定项目依赖，禁用MCP和自动修复 | 可解释将读写什么和何时运行 |
| 分项验证 | 一次性文件触发一个hook，核日志/diff | 错触发或依赖不符即关该项 |
| 退出 | 用户恢复备份并移除新增规则/服务 | 重载后不再触发，核未停止子进程 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 工具下载、账号与模型成本未知 | 审schema、命令、scope与凭据 | 无项目迁移计时 |
| 持续使用 | 保存时重复lint/测试/Agent上下文 | 处理重叠触发、规范冲突与误报 | 不能由hook数推节省 |
| 失败恢复 | 自动写回与外部调用结果需保留 | 回滚文件、关hook、查服务 | 不提供原子安装/回滚器 |
| 升级/退出 | 原配置与备份存储 | 逐版本兼容核对并清全局/项目副本 | 删除一处未必删除另一scope |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 整理起点 | 角色、工作流、触发器有具体文件 | 目标项目少多少配置工时 |
| 检查提醒 | hook声明命令/agent提示 | 实际被执行、误触发和任务质量 |
| 权限保护 | 有deny/ask和敏感路径示例 | 完整权限边界及当前IDE实现 |

可检验的新方向是生成项目专属配置验收清单，逐条列真实依赖、触发频率、写回范围和最小权限，并默认关掉未验项。现有INSTALL已经要求选择和验证，新增价值应是把文案建议变成有证据的配置清单，优先发现query自动批准与指南矛盾、pwsh缺失和自动修复。对照手工挑选与清单，在无npm脚本、无pwsh、只读DB和重叠保存四类一次性工程测错误启用、意外写入与配置/恢复时间。若当前手工审阅同样有效或清单维护更贵，则否定。该方案未验证，不计入仓库已有贡献。

#### 证据与依据

**依据 1 · 作者声明**：[INSTALL.md:25-44](https://github.com/iamaanahmad/everything-kiro/blob/1a6fd156c6308875a5bf9756fdbe4e0730e1fb19/INSTALL.md#L25-L44)

已有选择、凭据与MCP范围提醒。

<details>
<summary>查看原文（20行）</summary>

````text
Pick and choose — you don't need all 12 hooks or all 3 powers. Delete what doesn't fit your project before committing.

## Option 2: User-level install (applies to every workspace)

```bash
cp -r everything-kiro/.kiro/steering ~/.kiro/steering
cp -r everything-kiro/.kiro/hooks ~/.kiro/hooks
cp -r everything-kiro/agents ~/.kiro/agents
cp -r everything-kiro/powers/* ~/.kiro/powers/
```

User-level hooks and steering apply across all workspaces automatically — useful for things like lint-on-save or security rules you want everywhere, less useful for project-specific things like `api-conventions.md`'s `fileMatchPattern`.

## Configure MCP servers

Edit `.kiro/settings/mcp.json` and replace every `*_ENV_VAR` / `YOUR_*_HERE` placeholder with a real environment variable reference or your actual credential — via your shell environment, not hardcoded into the JSON file.

**Never commit a config file with a real API key, token, or connection string.** If you accidentally commit one, rotate the credential immediately — removing it from a later commit does not remove it from git history.

Only enable the MCP servers you actually need for the current project. Every enabled server's tools count against your context budget; the repo ships 17 example server entries in `mcp.json` but only 5 are enabled by default (github, postgres, filesystem, git, docker).
````

</details>

**依据 2 · 作者声明**：[INSTALL.md:50-56](https://github.com/iamaanahmad/everything-kiro/blob/1a6fd156c6308875a5bf9756fdbe4e0730e1fb19/INSTALL.md#L50-L56)

已有加载验收是新假设基线。

```text
## Verify

After copying files:
1. Restart Kiro or reload the workspace so it picks up the new `.kiro/` contents.
2. Open the Agent Hooks panel and confirm the hooks you copied appear and are enabled.
3. Ask Kiro "what steering files are active?" to confirm the always-on steering files loaded.
4. If you copied a power, run `activate <power-name>` to confirm it loads without errors.
```

**依据 3 · 源码核查**：[.kiro/hooks/lint-and-format.json:5-13](https://github.com/iamaanahmad/everything-kiro/blob/1a6fd156c6308875a5bf9756fdbe4e0730e1fb19/.kiro/hooks/lint-and-format.json#L5-L13)

自动写回需要差异验收。

```text
      "name": "lint-and-format",
      "trigger": "PostFileSave",
      "matcher": "\\.(ts|tsx|js|jsx|json)$",
      "action": {
        "type": "command",
        "command": "npx prettier --write \"$FILE_PATH\" && npx eslint \"$FILE_PATH\" --fix"
      },
      "timeout": 30,
      "enabled": true
```

**依据 4 · 源码核查**：[.kiro/settings/mcp.json:12-19](https://github.com/iamaanahmad/everything-kiro/blob/1a6fd156c6308875a5bf9756fdbe4e0730e1fb19/.kiro/settings/mcp.json#L12-L19)

postgres默认自动批准需单独审核。

```text
    "postgres": {
      "command": "uvx",
      "args": ["mcp-server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:password@localhost:5432/dbname"
      },
      "disabled": false,
      "autoApprove": ["list_tables", "describe_table", "query"]
```

#### 缺口

- 无项目适配、触发误报或恢复时间对照
  **影响**：不能证明净收益或验收清单值得维护
  **进一步探讨**：按本题一次性工程对照，记录错误启用、写入与人工耗时。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
