# dsh-minimal-turbo

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[cdbf96a](https://github.com/ChangedenCZD/dsh-minimal-turbo/tree/cdbf96a0f2e4c886c9f9e8d0cb21a45f5122355a)

<!-- BEGIN META -->
[![GitHub ★ 40](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ChangedenCZD/dsh-minimal-turbo)
<!-- END META -->

> **功能**：为 DSH 提供极简模式覆盖配置和新增的许愿模式预设。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将较窄本地编辑配置和首轮探索提示整理为两份可选预设。

> **主要限制**：[Q03](#research-q03) 的直接覆盖会改变宿主目录，且本地文件服务的实际权限需要核查。提示词约束无法直接保证思考或质量。

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
  - [Q01 · 两种预设对日常工作提出什么不同的取舍？](#detail-section-11)
  - [Q02 · 预设实际组合了什么，哪些能力仍属于宿主？](#detail-section-12)
  - [Q03 · 覆盖宿主目录和本地文件访问有什么代价？](#detail-section-13)
  - [Q04 · 怎样证明提示词改动改善最终任务？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向希望调整 DSH Agent 工具范围与首轮探索方式的使用者。

以当前宿主内置 minimal 和标准预设为参照，评估工具清单与最终通过的任务。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| minimal | 缩小会话工具及上下文组合 | 覆盖宿主内置文件，依赖本地服务 |
| wish | 选用定制提示及完整工具组合 | 宿主版本和模块需匹配 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 含对应模块的 DSH | 必需 | 解析 YAML 和工具 | 保持原预设 |
| 可丢弃宿主副本 | 试用条件 | 隔离安装写入 | 先只核配置 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 检查目标安装与备份 | 确认是独占副本 |
| 验证 | 重新启动并查看预设 | 工具清单符合预期 |
| 退出 | 恢复原件或弃用副本 | 回原模式 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 环境成本未知 | 定位路径、备份与核依赖 | 会改变宿主目录 |
| 持续 | 模型费用未知 | 验升级后预设和工具 | 版本兼容未验证 |
| 恢复 | 重跑成本未知 | 核逐文件状态并回退 | 备份需读回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 模式组合 | 宿主工具和 persona 声明 | 安装和执行 |
| 任务表现 | 作者案例与提示设计 | 对照用时和质量 |

> **思考**：[Q03](#research-q03) 的直接覆盖会改变宿主目录，且本地文件服务的实际权限需要核查。提示词约束无法直接保证思考或质量。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将较窄本地编辑配置和首轮探索提示整理为两份可选预设。

[Q02](#research-q02) 用 realm 分配服务，实际模块由宿主解析。[Q03](#research-q03) 的文件写入和备份需分别读回。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的直接覆盖会改变宿主目录，且本地文件服务的实际权限需要核查。提示词约束无法直接保证思考或质量。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先只读比较配置。试用应在独占宿主副本核实际模块、访问范围和备份，缺项即退原模式。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认预设组合与真实写入位置，宿主加载、平台及任务收益待验证。

- 已检查：作者 README、包清单、源码路径 README.md、minimal/agent.cordis.yml、wish/agent.cordis.yml、wish/preset.yml、scripts/install-minimal.sh、scripts/install-wish.sh 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定预设和 shell 安装路径。未执行配置、模型、脚本或宿主。
- 下一步：按 [Q04](#research-q04) 固定模型、权限和结果测试，比较原模式与 wish。

**分析版本**

- **仓库**：[ChangedenCZD/dsh-minimal-turbo](https://github.com/ChangedenCZD/dsh-minimal-turbo)
- **版本号**：未声明（[固定提交 cdbf96a](https://github.com/ChangedenCZD/dsh-minimal-turbo/tree/cdbf96a0f2e4c886c9f9e8d0cb21a45f5122355a)）
- **版本日期**：2026-08-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 用固定任务对比标准与 wish，若测试通过、时间及人工补救无改善则保留原配置。

按 [Q04](#research-q04) 固定模型、权限和结果测试，比较原模式与 wish。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 100 | — | — | 846 |

</details>

**活跃度**

[![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/ChangedenCZD/dsh-minimal-turbo/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z)

暂未获取：Issue 未关闭、近30天新建。

统计日期：2026-11-12。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定配置怎样改变 DSH Agent 预设，安装范围和收益应如何判断？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 两种预设对日常工作提出什么不同的取舍？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

想试验更窄的本地编辑环境，或希望对复杂任务改变首轮探索方式的 DSH 使用者，可以检查这两份预设。minimal 选用固定 persona、关闭运行上下文并声明较少的工具；wish 保留较多标准工具，对模型首轮提出先查看工作区、少做长推演的要求。基线是宿主现有 minimal 或标准模式。作者示例可作为测试任务线索；其报告的速度和质量没有等条件对照。合格的任务需要实际可用文件或测试结果，模型话语风格不作为完成指标。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-23](https://github.com/ChangedenCZD/dsh-minimal-turbo/blob/cdbf96a0f2e4c886c9f9e8d0cb21a45f5122355a/README.md#L15-L23)

作者声明两种模式与适用任务。

```text
## 模式对比

| 特性 | minimal（极简模式） | wish（许愿模式） |
| --- | --- | --- |
| 基于 | 官方极简模式配置，兼容 Windows | 官方标准模式工具链，新增独立模式 |
| 核心思路 | 最少开销、最快响应 | 打断首次思考，防止直接雷霆思考 |
| 思考链 | 无上下文压缩，思考轮次少 | 系统提示词约束首轮快速跳过，`Let me` 起手不影响效果 |
| 适用场景 | 纯文件编辑 / 命令行操作的简单任务 | 复杂、多步骤任务，追求高质量输出 |
| 安装方式 | 覆盖官方预设 | 新增目录，不影响官方预设 |
```

**依据 2 · 源码核查**：[minimal/agent.cordis.yml:8-35](https://github.com/ChangedenCZD/dsh-minimal-turbo/blob/cdbf96a0f2e4c886c9f9e8d0cb21a45f5122355a/minimal/agent.cordis.yml#L8-L35)

固定 persona 与持久 shell。

<details>
<summary>查看原文（28行）</summary>

```text
- id: persona
  name: '@deepseek-ai/dsh-persona'
  config:
    text: You are a helpful software engineer assistant.
    complete: true
    includeRuntimeContext: false

# The PTY registry is an agent-owned service, so it lives in an entry-local
# realm. The backend still consumes the host sandbox policy and subprocess
# implementation, while the tool registers into this agent's scoped catalog.
- id: persistent-shell
  name: cordis:group
  group: true
  isolate:
    terminals: true
  config:
    - id: pty
      name: '@deepseek-ai/dsh-terminal'

    - id: terminal-bash
      name: '@deepseek-ai/dsh-terminal-bash'
      config:
        timeoutMs: 300000

    - id: persistent-bash
      name: '@deepseek-ai/dsh-tool-bash-persistent'
      config:
        timeoutMs: 300000
```

</details>

**依据 3 · 源码核查**：[wish/agent.cordis.yml:24-45](https://github.com/ChangedenCZD/dsh-minimal-turbo/blob/cdbf96a0f2e4c886c9f9e8d0cb21a45f5122355a/wish/agent.cordis.yml#L24-L45)

完整 persona 与首轮提示。

<details>
<summary>查看原文（22行）</summary>

```text
- id: persona
  name: '@deepseek-ai/dsh-persona'
  config:
    text: |-
      **You are a helpful software engineer assistant.**

      ## Attention
      1. **In the first round, You must use the tool I provided to understand the overall situation of the current workspace and user's requirements  rather than engaging in deep thinking directly. After that, implement the next plan.** 
      2. **Use short reasoning instead of long reasoning. First, through multiple reasoning processes and combined with multiple tool invocations, we aim to gain a comprehensive understanding of the project and user requirements, in order to better achieve the user's goals.**
      3. **When you successfully create or modify files, mention the primary outputs in your final response. To make those and any other changed-file references clickable in Web, format them as Markdown inline code using the exact file-tool path, or a basename when unique among the files changed in that turn.**
      4. **谨记章北海父亲的话：你要多想，在达成用户目标之前，我只能告诉你，要多想**

      ## Hot to use tools
      - Use the read tool, not shell(bash, pwsh) commands like cat — to inspect text files. 
      - Use the glob tool, not shell(bash, pwsh) find — to discover files by path pattern.
      - Use the grep tool, not shell(bash, pwsh) grep or rg — to search file contents.
      - Non-zero exits are reported as [exit code: N] markers; investigate failures before moving on. On Windows a killed process settles as [exit code: 1] without a signal marker; treat a bare exit 1 after an interruption as a termination, not a command failure.

      Your working directory is '{{cwd}}'.

    complete: true
    includeRuntimeContext: false
```

</details>

#### 缺口

- 没有同一宿主内置预设的运行差异和收益。
  **影响**：不能将作者示例归因给改动。
  **进一步探讨**：固定模型、任务和工具权限对照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 预设实际组合了什么，哪些能力仍属于宿主？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

这是可被宿主 agent preset 目录发现的 YAML 组合，未附新的 npm 宿主模块。minimal 在隔离 terminal realm 声明 PTY、terminal-bash 与持久 Bash，在另一个 fs realm 声明本地文件服务与字符串替换编辑器，并按平台决定 PowerShell。wish 声明 persona、Windows 和非 Windows 分别启用的 Shell、宿主已有文件与搜索工具，另有独立 planMode 作用域。工具实现、依赖可解析性和执行权限仍由宿主决定。提示词要求减少首轮推演只能改变模型收到的文本，不能强制其推理预算和工具行为。

#### 证据与依据

**依据 1 · 源码核查**：[minimal/agent.cordis.yml:18-35](https://github.com/ChangedenCZD/dsh-minimal-turbo/blob/cdbf96a0f2e4c886c9f9e8d0cb21a45f5122355a/minimal/agent.cordis.yml#L18-L35)

PTY 作用域及实际工具模块。

<details>
<summary>查看原文（18行）</summary>

```text
- id: persistent-shell
  name: cordis:group
  group: true
  isolate:
    terminals: true
  config:
    - id: pty
      name: '@deepseek-ai/dsh-terminal'

    - id: terminal-bash
      name: '@deepseek-ai/dsh-terminal-bash'
      config:
        timeoutMs: 300000

    - id: persistent-bash
      name: '@deepseek-ai/dsh-tool-bash-persistent'
      config:
        timeoutMs: 300000
```

</details>

**依据 2 · 源码核查**：[minimal/agent.cordis.yml:46-67](https://github.com/ChangedenCZD/dsh-minimal-turbo/blob/cdbf96a0f2e4c886c9f9e8d0cb21a45f5122355a/minimal/agent.cordis.yml#L46-L67)

文件服务与平台条件。

<details>
<summary>查看原文（22行）</summary>

```text
# The bare local filesystem shadows the host's sandboxed provider only for this
# preset. The editor shares that realm and requires absolute paths.
- id: filesystem
  name: cordis:group
  group: true
  isolate:
    fs: true
  config:
    - id: fs-local
      name: '@deepseek-ai/dsh-fs-local'
      config:
        cwd: !!js process.env.DSH_CWD ?? process.cwd()

    - id: str-replace-editor
      name: '@deepseek-ai/dsh-tool-str-replace-editor'
      config:
        maxOutputChars: 16000


- id: tool-pwsh
  name: '@deepseek-ai/dsh-tool-pwsh'
  disabled: !!js process.platform !== 'win32'
```

</details>

**依据 3 · 源码核查**：[wish/agent.cordis.yml:61-79](https://github.com/ChangedenCZD/dsh-minimal-turbo/blob/cdbf96a0f2e4c886c9f9e8d0cb21a45f5122355a/wish/agent.cordis.yml#L61-L79)

按平台启用 Shell 与文件搜索。

<details>
<summary>查看原文（19行）</summary>

```text
- id: tool-bash
  name: '@deepseek-ai/dsh-tool-bash'
  disabled: !!js process.platform === 'win32'

- id: tool-pwsh
  name: '@deepseek-ai/dsh-tool-pwsh'
  disabled: !!js process.platform !== 'win32'

# ── filesystem ──────────────────────────────────────────────────────────────

# Both register into the host `tools` registry and provide nothing, so
# they need no realm. The `fs` service and its policy stay in the host.
- id: tool-fs
  name: '@deepseek-ai/dsh-tool-fs'

- id: tool-fs-search
  name: '@deepseek-ai/dsh-tool-fs-search'
  config:
    sampleOverCapGlobResults: false
```

</details>

**依据 4 · 源码核查**：[wish/agent.cordis.yml:119-141](https://github.com/ChangedenCZD/dsh-minimal-turbo/blob/cdbf96a0f2e4c886c9f9e8d0cb21a45f5122355a/wish/agent.cordis.yml#L119-L141)

挂载计划模式及说明。

<details>
<summary>查看原文（23行）</summary>

```text
# Plan state is per-agent by nature, so an entry-local realm is not a
# workaround here — it is the correct lifetime.
- id: planning
  name: cordis:group
  group: true
  isolate:
    planMode: true
  config:
    - id: plan-mode
      name: '@deepseek-ai/dsh-plan-mode'
      config:
        section: |
              You are in plan mode. Stay in plan mode until exit_plan_mode succeeds or the user switches the session mode. Imperative language to implement changes means plan the implementation, not execute it. A user's conversational agreement — including an answer confirming something you asked — approves nothing and does not end plan mode; fold the confirmed decision into the plan and submit it through exit_plan_mode.

              Explore first. Use non-mutating reads, searches, static analysis, and checks to ground the plan in the actual repository. Do not edit or write files, change configuration, run formatters or code generation that rewrites tracked files, commit, or otherwise carry out the plan. Prefer existing functions and patterns over new machinery.

              The tool catalog stays the same across modes for request-cache stability. These plan-mode rules override any later tool description or guidance that suggests using mutation tools; those tools remain listed to keep the tool catalog unchanged. Do not use todo_write to track this planning phase: it tracks implementation after an approved plan, while the plan itself belongs in exit_plan_mode.

              Resolve discoverable facts by inspection. Use ask_user_question only for user-owned choices or material ambiguity that inspection cannot answer. Do not ask the user where code lives or how current behavior works when you can find out.

              Make the plan decision-complete: state the goal and success criteria; group implementation changes by subsystem; identify public API, schema, and data-flow changes; cover edge cases, failure modes, tests, acceptance criteria, and explicit assumptions. Keep it concise enough to review but detailed enough that another engineer can implement it without making design decisions.

              When ready, call exit_plan_mode with the complete plan markdown, starting with a # title. Make exit_plan_mode the only and final tool call in that assistant response: it presents the plan for approval, and implementation begins only in a later step after approval. Do not paste the final plan as a plain reply or ask "should I proceed?" through prose or ask_user_question. If review rejects it, incorporate the feedback and present again. If the review channel is unavailable or aborted, stay in plan mode and ask the user to switch modes manually; do not proceed with implementation.
```

</details>

**依据 5 · 源码核查**：[wish/preset.yml:1-3](https://github.com/ChangedenCZD/dsh-minimal-turbo/blob/cdbf96a0f2e4c886c9f9e8d0cb21a45f5122355a/wish/preset.yml#L1-L3)

宿主发现所需的模式元数据。

```text
name: 许愿模式
description: 为您提供一键许愿能力 Agent。
order: 14
```

#### 缺口

- 目标宿主是否包含各模块与服务未验。
  **影响**：静态配置可解析不代表工具成功挂载。
  **进一步探讨**：启动固定独立宿主并检查模式和工具列表。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 覆盖宿主目录和本地文件访问有什么代价？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

安装脚本使用 DSH_PATH 或查找 npm 安装，将 minimal 写到宿主内置预设目录，有原文件时先复制备份。wish 安装将目标目录原有文件逐个移走再复制两份配置，过程没有事务恢复。中途失败时需要检查实际已搬移的文件，更新宿主也可能改写安装目录。minimal 明确选择本地文件服务并为其设置 cwd，工具的可达范围和权限需在独立环境验收，不能靠“极简”名称推定。

建议先观察有无需要，只在可丢弃的宿主副本试，避免覆盖共用安装。若预设未出现、重要工具缺失或权限超出预期，恢复原目录或弃用该副本。人力成本包括路径确认、备份和宿主升级后重做，资源与任务收益未测。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/install-minimal.sh:12-41](https://github.com/ChangedenCZD/dsh-minimal-turbo/blob/cdbf96a0f2e4c886c9f9e8d0cb21a45f5122355a/scripts/install-minimal.sh#L12-L41)

定位 npm 安装、备份并直接覆盖。

<details>
<summary>查看原文（30行）</summary>

```text
dsh_dir="${DSH_PATH:-}"
if [ -z "$dsh_dir" ]; then
    prefix="$(npm prefix -g 2>/dev/null || true)"
    if [ -n "$prefix" ] && [ -d "$prefix/node_modules/@deepseek-ai/dsh" ]; then
        dsh_dir="$prefix/node_modules/@deepseek-ai/dsh"
    fi
fi
if [ -z "$dsh_dir" ] && [ -d "$(pwd)/node_modules/@deepseek-ai/dsh" ]; then
    dsh_dir="$(pwd)/node_modules/@deepseek-ai/dsh"
fi
if [ -z "$dsh_dir" ]; then
    echo "错误: 未找到 dsh 安装目录，可通过 DSH_PATH 环境变量指定" >&2
    exit 1
fi

target_dir="$dsh_dir/config/agent-presets/minimal"
target_file="$target_dir/agent.cordis.yml"

if [ ! -d "$target_dir" ]; then
    echo "错误: 目标目录不存在: $target_dir" >&2
    exit 1
fi

if [ -f "$target_file" ]; then
    backup="$target_dir/agent.cordis.yml.bak-$(date +%Y%m%d-%H%M%S)"
    cp "$target_file" "$backup"
    echo "已备份原配置 -> $backup"
fi

cp "$src_file" "$target_file"
```

</details>

**依据 2 · 源码核查**：[scripts/install-wish.sh:27-42](https://github.com/ChangedenCZD/dsh-minimal-turbo/blob/cdbf96a0f2e4c886c9f9e8d0cb21a45f5122355a/scripts/install-wish.sh#L27-L42)

对文件逐项移动并复制新配置。

<details>
<summary>查看原文（16行）</summary>

```text
target_dir="$dsh_dir/config/agent-presets/wish"

if [ -d "$target_dir" ]; then
    ts="$(date +%Y%m%d-%H%M%S)"
    for f in "$target_dir"/*; do
        [ -f "$f" ] || continue
        mv "$f" "$f.bak-$ts"
        echo "已备份原文件 -> $f.bak-$ts"
    done
else
    mkdir -p "$target_dir"
fi

cp "$src_dir/agent.cordis.yml" "$src_dir/preset.yml" "$target_dir/"
echo "已复制 -> $target_dir"
echo "完成！重启 dsh 后选择许愿模式。"
```

</details>

**依据 3 · 源码核查**：[minimal/agent.cordis.yml:46-62](https://github.com/ChangedenCZD/dsh-minimal-turbo/blob/cdbf96a0f2e4c886c9f9e8d0cb21a45f5122355a/minimal/agent.cordis.yml#L46-L62)

选择本地文件服务和编辑器。

<details>
<summary>查看原文（17行）</summary>

```text
# The bare local filesystem shadows the host's sandboxed provider only for this
# preset. The editor shares that realm and requires absolute paths.
- id: filesystem
  name: cordis:group
  group: true
  isolate:
    fs: true
  config:
    - id: fs-local
      name: '@deepseek-ai/dsh-fs-local'
      config:
        cwd: !!js process.env.DSH_CWD ?? process.cwd()

    - id: str-replace-editor
      name: '@deepseek-ai/dsh-tool-str-replace-editor'
      config:
        maxOutputChars: 16000
```

</details>

#### 缺口

- 升级覆盖、跨平台解析与局部失败未实测。
  **影响**：无法保证现有安装可低成本恢复。
  **进一步探讨**：用测试副本模拟复制中断并逐份读回。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样证明提示词改动改善最终任务？

**研究主题**：新假设与验证

#### 完整回答

可检验的假设是先查看工作区再展开推演的提示，能在部分编码任务里减少返工。固定宿主、模型、工具权限和题目，让标准预设和 wish 各做一组等价修改，分别记录首次工具步骤、通过测试的交付比例、总耗时、模型用量和人工补救。对最小任务与复杂任务分开观察，控制提示词与工具列表变动。若仅模型措辞改变或先动手带来更多返工，则保留标准预设。

#### 证据与依据

**依据 1 · 源码核查**：[wish/agent.cordis.yml:24-45](https://github.com/ChangedenCZD/dsh-minimal-turbo/blob/cdbf96a0f2e4c886c9f9e8d0cb21a45f5122355a/wish/agent.cordis.yml#L24-L45)

真实待检验提示内容。

<details>
<summary>查看原文（22行）</summary>

```text
- id: persona
  name: '@deepseek-ai/dsh-persona'
  config:
    text: |-
      **You are a helpful software engineer assistant.**

      ## Attention
      1. **In the first round, You must use the tool I provided to understand the overall situation of the current workspace and user's requirements  rather than engaging in deep thinking directly. After that, implement the next plan.** 
      2. **Use short reasoning instead of long reasoning. First, through multiple reasoning processes and combined with multiple tool invocations, we aim to gain a comprehensive understanding of the project and user requirements, in order to better achieve the user's goals.**
      3. **When you successfully create or modify files, mention the primary outputs in your final response. To make those and any other changed-file references clickable in Web, format them as Markdown inline code using the exact file-tool path, or a basename when unique among the files changed in that turn.**
      4. **谨记章北海父亲的话：你要多想，在达成用户目标之前，我只能告诉你，要多想**

      ## Hot to use tools
      - Use the read tool, not shell(bash, pwsh) commands like cat — to inspect text files. 
      - Use the glob tool, not shell(bash, pwsh) find — to discover files by path pattern.
      - Use the grep tool, not shell(bash, pwsh) grep or rg — to search file contents.
      - Non-zero exits are reported as [exit code: N] markers; investigate failures before moving on. On Windows a killed process settles as [exit code: 1] without a signal marker; treat a bare exit 1 after an interruption as a termination, not a command failure.

      Your working directory is '{{cwd}}'.

    complete: true
    includeRuntimeContext: false
```

</details>

**依据 2 · 作者声明**：[README.md:75-82](https://github.com/ChangedenCZD/dsh-minimal-turbo/blob/cdbf96a0f2e4c886c9f9e8d0cb21a45f5122355a/README.md#L75-L82)

作者提供案例入口，未提供对照。

```text
## 效果展示

许愿模式下完成的真实案例（见 [`wish-demo`](wish-demo) 目录，含单文件 HTML 成品与原始 prompt）：

| 案例 | Flash Max | Pro Max |
| --- | --- | --- |
| Kerr-Newman 黑洞 WebGL 渲染（raymarching + 体积吸积盘 + 后处理） | [查看](wish-demo/kerr-newman-with-flash-max/kerr_newman.html) | [查看](wish-demo/kerr-newman-with-pro-max/kerr_newman.html) |
| 我的世界风格 3D 游戏 | [查看](wish-demo/minecraft-with-flash-max/minecraft.html) | [查看](wish-demo/minecraft-with-pro-max/minecraft.html) |
```

#### 缺口

- 尚未执行等条件对照。
  **影响**：无法判断是否更快或更完整。
  **进一步探讨**：保留测试、请求计数和人工复核依据。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
