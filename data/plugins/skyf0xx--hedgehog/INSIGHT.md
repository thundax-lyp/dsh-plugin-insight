# Hedgehog

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[f713f2d](https://github.com/skyf0xx/hedgehog/tree/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83)

<!-- BEGIN META -->
[![GitHub ★ 47](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=47&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/skyf0xx/hedgehog) [![npm 30d 1,076](https://img.shields.io/static/v1?label=npm+30d&message=1%2C076&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@skyf0xx/hedgehog) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@skyf0xx/hedgehog)
<!-- END META -->

> **功能**：为编码 Agent 安装角色与 Skill，并用 SQLite 构建图协调任务依赖、租约、范围验证和 Git 提交。

> **亮点**：把intent/依赖/范围/租约/验证和commit记录接成可查询交接，协调者有真实程序入口而非只信done，见 [Q03](#research-q03)-[Q04](#research-q04)。

> **主要限制**：verify会执行shell并自动commit，noop可不跑测试、reconcile有人判断路径，Git与DB非共同事务；index/lease/外部writer和业务验收不能靠complete证明，见 [Q04](#research-q04)-[Q05](#research-q05)。

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
  - [Q01 · 收录在DSH目录里，这个根项目实际是什么？](#detail-section-11)
  - [Q02 · init究竟写什么，外部core和覆盖边界是什么？](#detail-section-12)
  - [Q03 · 计划如何变成可并行任务，谁真执行代码？](#detail-section-13)
  - [Q04 · verify是否等于测试通过和安全提交？](#detail-section-14)
  - [Q05 · 过期、跨branch、持久失败与退出还有哪些边界？](#detail-section-15)
  - [Q06 · 如何最小采用，成本和退出是什么？](#detail-section-16)
  - [Q07 · 可迁移机制和未验证的新方向是什么？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：愿意声明intent/scope/verify并审Git的仓库维护者，在可弃置新仓单任务试纪律，见 [Q01](#research-q01)/[Q06](#research-q06)。

手工需求清单/TDD与测试脚本+人工Git提交。图协调减少纯对话状态依赖，但目标正确/授权和恢复仍需用户。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| init | 安装/生成角色Skill文档 | 写文件/可能git init，非原子全包 |
| graph/claim | 依赖任务与lease | owner字符串/非OS隔离 |
| verify | scope/exec/自动Git提交 | noop免跑/业务另验 |
| reconcile | 人工承认完成 | 不等测试通过 |
| 历史/DB | 可查询恢复线索 | subject非当前代码证明 |
| DSH core条目 | 开发DSH插件的外部模板 | 非根原生插件/未审外部包 |

**流程与依赖**

#### 依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node>=22.5/node:sqlite/Git | CLI/图/提交 | 成品兼容未跑 |
| 编码Agent宿主/模型 | 真实执行角色 | CLI无自治模型loop |
| 审过的core/intent/scope/verify | 图编译/命令依据 | shell文本可执行，外部包另审 |
| npm/tar/registry或本地core | 获取模板 | range解析版本非来源安全保证 |
| 可写仓与空index/备份 | 文件/DB/Git | 非跨资源事务 |
| 人工需求/差异/目标验收 | 最后INTENT CHECK | 测试green非任务全成 |

#### 步骤

| 阶段 | 动作 | 判据/退路 |
| --- | --- | --- |
| 准备 | 可弃置小仓/审生成文件与core | 明确写文件/exec/commit授权 |
| 单任务 | 一intent/一层/单owner | 空index/无其他修改 |
| 核查 | claim→Agent→verify | 核真实测试/完整diff/index/commit |
| 异常 | 先查进程/HEAD/DB | 未知勿retry/重建盖事实 |
| 退出 | 停Agent/命令/保存记录 | 只按diff移除生成片段 |

**效果与成本**

#### 成本

| 阶段 | 现金/资源 | 人工与未知 |
| --- | --- | --- |
| 首次 | 依赖/可选core/模型 | 学习图/声明scope/授权/备份 |
| 持续 | 模型Token/测试/磁盘 | 需求/任务粒度/图和回归 |
| 失败 | 重跑/进程/提交分离 | lease/index/DB恢复，工时未知 |
| 退出 | 记录/模板保留 | 停执行者/逐文件diff恢复 |

#### 效果

| 项目 | 当前支持 | 未验证 |
| --- | --- | --- |
| 协调 | 依赖/lease/冲突程序筛选 | 声明真实/多Agent效果 |
| 验证 | scope与真实shell退出码 | 用户目标/命令充分 |
| 完成 | Git/DB/部分noop/reconcile来源 | 所有complete同强度不成立 |
| 持久 | SQLite事务/历史恢复线索 | Git+DB共同原子/掉电 |
| 收益 | 可查小任务交接 | Token/速度/质量净收益 |

> **思考**：verify会执行shell并自动commit，noop可不跑测试、reconcile有人判断路径，Git与DB非共同事务；index/lease/外部writer和业务验收不能靠complete证明，见 [Q04](#research-q04)-[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把intent/依赖/范围/租约/验证和commit记录接成可查询交接，协调者有真实程序入口而非只信done，见 [Q03](#research-q03)-[Q04](#research-q04)。

SQLite事务/租约与命令/Git链可审，scope指纹和冲突是合作协调；noop/手工完成、跨branch subject与Git/DB分离应保真，见 [Q03](#research-q03)-[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

verify会执行shell并自动commit，noop可不跑测试、reconcile有人判断路径，Git与DB非共同事务；index/lease/外部writer和业务验收不能靠complete证明，见 [Q04](#research-q04)-[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可弃置新仓一层任务，审verify命令与自动commit并保空index；不跑并发/外部core/目标worktree，状态或index不明先停执行者退手工清单与测试，见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定6.7.0/source，真实CLI/模板/SQLite协调基础设施，根非DSH原生运行插件，DSH core为外部registry包。258文件定向init/外部core获取、plan/claim/verify/Git与DB失败/代表跨branch/手工路径；未运行/全审所有core/Host/CLI/重建/worktree/merge/所有hooks与供应链。

- 已检查：作者 README、包清单、源码路径 README.zh-CN.md、bin/cli.mjs、package.json、src/db/claim.mjs、src/db/commitLock.mjs、src/db/crossBranch.mjs、src/db/gate.mjs、src/db/init.mjs、src/db/plan.mjs、src/db/reconcile.mjs、src/db/verify.mjs、src/hosts/index.mjs、src/registry/cores.json、src/registry/fetch.mjs、src/skills/hedgehog-orchestrating/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根package/Host registry/外部DSH core条目、CLI init文件与db/Git写入；core npm pack/tar；plan/claim/snapshot/lease；verify真实exec/scope/noop/Git与DB；commit lock/gate诊断/代表跨branch subject与reconcile。未执行或全258文件、外部core、宿主权限/模型loop、全部计划/override/重建/worktree merge/发行安全。
- 下一步：- 下一步副本单层可信无害命令，核真实目标/测试/index/commit与DB。
- 异scope暂存/测试越界、Git已成DB失败和过期lease只副本做条件样本，不在生产试。
- 未运行目标/安装/测试/提交/模型，速度/Token/并行和恢复效果未知。

**分析版本**

- **仓库**：[skyf0xx/hedgehog](https://github.com/skyf0xx/hedgehog)
- **版本号**：6.7.0（[固定提交 f713f2d](https://github.com/skyf0xx/hedgehog/tree/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

提交前只读核完整index归属，拒绝未许可异task暂存而不自动reset，和现范围门/人工cached diff对照，误归属不降或误拒更重即否定，见 [Q07](#research-q07)。

- 下一步副本单层可信无害命令，核真实目标/测试/index/commit与DB。
- 异scope暂存/测试越界、Git已成DB失败和过期lease只副本做条件样本，不在生产试。
- 未运行目标/安装/测试/提交/模型，速度/Token/并行和恢复效果未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 99 | 8861 | — | — | 81430 |
| .mjs | source | 157 | 29657 | 19675 | 7251 | — |
| .md | example | 2 | 827 | — | — | 7505 |

</details>

**活跃度**

[![Issue 未关闭 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=14&color=737b86&logo=github)](https://github.com/skyf0xx/hedgehog/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/skyf0xx/hedgehog/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)

暂未获取：近30天关闭。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判根CLI基础设施身份，核init/graph/claim/verify实际命令和提交到完成/失败，区分角色文本与自治执行。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 收录在DSH目录里，这个根项目实际是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

固定@skyf0xx/hedgehog 6.7.0是开发纪律CLI与SQLite构建图/模板基础设施，包含供Claude/Cursor等宿主使用的角色/Skills，根清单没有DSH bundle或tools入口。不是原生DSH运行插件，也不是独立常驻Agent执行器。registry的deepseek-harness条目指向外部hedgehog-core包，用于开发DSH插件；该外部包的六层构建/执行能力本项不验收，目录收录不改变根身份。

面向接受显式依赖、任务范围和Git提交纪律的仓库维护者，将需求intent编译成层任务，由协调会话claim、把packet交宿主Agent、调用verify；角色分工和具体代码生成依赖宿主与选定core。相对手写任务清单/TDD脚本，增量是可查询任务图、租约/冲突筛选、范围与命令验证、完成记录，不是模型自动正确或新软件架构理论。README省Token/更快更干净仅作者主张，无本轮对照。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-16](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/package.json#L1-L16)

根CLI身份/版本/description/bin。

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "@skyf0xx/hedgehog",
  "version": "6.7.0",
  "description": "Install the Hedgehog build discipline (agents + skills) into a repo, for Claude Code, Cursor, or Gemini CLI.",
  "type": "module",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/skyf0xx/hedgehog.git"
  },
  "publishConfig": {
    "access": "public"
  },
  "bin": {
    "hedgehog": "bin/cli.mjs"
  },
  "scripts": {
```

</details>

**依据 2 · 源码核查**：[src/hosts/index.mjs:56-85](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/hosts/index.mjs#L56-L85)

宿主注册为Claude/Cursor模板路径。

<details>
<summary>查看原文（30行）</summary>

```text
  // authored — frontmatter and all — so it has no emitter. This is the
  // canonical format every other host is adapted from.
  claude: {
    agentsDir: '.claude/agents',
    skillsDir: '.claude/skills',
    bootstrapFile: 'CLAUDE.md',
    label: 'Claude Code',
    get extraEntries() {
      return [routingDoc('claude')];
    },
  },

  // Cursor loads `.cursor/rules/*.mdc` on every request and reads
  // AGENTS.md at the repo root. The rule points at both, the project's
  // own context lives in HEDGEHOG.md, and the agent files carry their
  // tool grant as a line of the prompt.
  cursor: {
    agentsDir: '.cursor/agents',
    skillsDir: '.cursor/skills',
    bootstrapFile: 'HEDGEHOG.md',
    label: 'Cursor',
    emitAgent: emitPromptAgent,
    get extraEntries() {
      return [
        routingDoc('cursor'),
        {
          type: 'file',
          from: 'src/hosts/cursor/hedgehog.mdc',
          to: '.cursor/rules/hedgehog.mdc',
        },
```

</details>

**依据 3 · 源码核查**：[src/registry/cores.json:30-38](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/registry/cores.json#L30-L38)

DSH是外部core registry条目。

```text
    {
      "name": "deepseek-harness",
      "flag": "--deepseek-harness",
      "package": "@skyf0xx/hedgehog-core-deepseek-harness",
      "version": ">=0.2.3 <1.0.0",
      "language": "typescript",
      "repository": "https://github.com/skyf0xx/hedgehog-core-deepseek-harness",
      "selects_when": "The description names building a plugin, tool, hook, or extension for DeepSeek Harness (DSH) — a Cordis-based agent framework — or otherwise extending an existing DSH installation with new capabilities via its plugin/bundle system. Concrete signals: DSH, DeepSeek Harness, Cordis, `defineTool`, `ctx.tools.register`, a `cordis.patch.yml` manifest, or a request to add a tool that a DSH agent can call. This is the core most often confused with authored: authored fits when no shipped core matches and the planner must design a system shape from scratch, but a DSH plugin already has a fixed, battle-tested shape (the six-layer scaffold → logic → wiring → smoke → bundle → join sequence, one plugin per intent) that authored's from-scratch design would only reinvent worse. Route here whenever the target of the work is a DSH plugin, not a general \"no other core fits\" fallback."
    },
```

**依据 4 · 源码核查**：[src/skills/hedgehog-orchestrating/SKILL.md:8-43](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/skills/hedgehog-orchestrating/SKILL.md#L8-L43)

协调会话claim/委派/verify协议及测试非业务覆盖的说明。

<details>
<summary>查看原文（36行）</summary>

```text
`.hedgehog/hedgehog.db` is the source of truth for what's next — never
re-derive build state from prose. To work from it:

1. Run `hedgehog claim --count N --owner <owner>`. It's atomic and
   lease-based, and returns up to N tasks (each with its own full
   STATUS/INTENT/RELEVANT RULES/INHERITED DEBT/INHERITED DECISIONS/WHY
   NOW/BLOCKED DOWNSTREAM/ALLOWED SCOPE/VERIFICATION packet) that the
   scheduler has already verified are safe to run together right now —
   scope and verify-radius disjoint. `--count` is a maximum, not a
   promise: a call may return fewer than N, or zero. `hedgehog ready` is
   a read-only preview of the claimable/held-back split (and why a task
   is held back — conflict with another claimable task, or exclusivity)
   before you claim.
2. Delegate each claimed packet to this core's loop skill (named in the
   project's core section), one dispatch per packet, running concurrently.
3. As each agent reports its packet done, run `hedgehog verify
   <task-id> --owner <owner>` **serially** — one at a time, even though
   the building happened concurrently, because verify writes git commits
   and those must land one at a time. It checks the touched files
   against the packet's ALLOWED SCOPE, runs the verification command,
   and on a pass writes the commit and unlocks whatever the task was
   blocking. An agent reporting success never moves the task — only a
   passing `hedgehog verify` exit code does.

`hedgehog claim` hands out only tasks safe to run together. Never run
two tasks it didn't hand you together.

The packet's **INTENT** block names the goal and outcome of the *whole*
intent, not just this layer. A layer's own verify command runs the tests
that layer wrote, so it measures internal consistency and never coverage
of what was asked — a layer that builds half the intent and tests that
half exhaustively is green. Build the layer's share of the goal, and say
so when the packet doesn't account for something the goal asks for.
When `hedgehog verify` closes the **last** layer of an intent it prints
that goal and outcome back as an **INTENT CHECK**: read the built work
against it there, because nothing else in the build does.
```

</details>

**依据 5 · 作者声明**：[README.zh-CN.md:27-27](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/README.zh-CN.md#L27-L27)

作者更少token/更快标题，未作为运行证明。

```text
## HEDGEHOG 用更少的 Token，写出更干净的代码，更快地构建 ⭐⭐⭐⭐
```

#### 缺口

- 未运行/安装宿主/Agent/core或独立效果对照，258文件定向非全部体系审计。
  **影响**：可评基础设施机制，不能归为原生DSH能力或自动生产成效。
  **进一步探讨**：在可弃置小仓手写一intent/一层任务，对照现有清单+测试流程，先不启外部core。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · init究竟写什么，外部core和覆盖边界是什么？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

CLI init先ensureGitRepo，若无Git会git init，不是只复制prompt。按host/core构造文件计划，冲突在写前集中拒绝，--force允许覆盖；generated routing文件不算冲突，root merge在coreless已有手写文件另有保留/追加规则。writePlannedFile实际mkdir/read/merge/write、emitter改格式或cp文件，记录hosts/version/core在payload写入前，再逐文件写、dbInit与gitignore；不是跨文件原子事务，半途失败可能记录存在而部分payload未齐。首次只可在空可弃置仓/完整备份试。

Host registry映射角色/skill/根指令路径，并不等宿主实际支持独立subagent/工具权限；角色prompt里的tool grant也不能当OS强制权限。core不是全随根版本固定，fetchCore实际npm pack registry所给版本range、tar提取、读manifest校engine，然后按解析到的精确版本缓存。清单匹配不保证来源可信/代码安全/成品接口可运行，外部registry/network/npm/tar均需；本项不下载也不审外部core字节。模板和core最终含verify shell命令，安装前按可执行配置审，不把Markdown当无副作用内容。

#### 证据与依据

**依据 1 · 源码核查**：[bin/cli.mjs:862-874](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/bin/cli.mjs#L862-L874)

实际无Git会init。

<details>
<summary>查看原文（13行）</summary>

```text
function ensureGitRepo() {
  try {
    execFileSync('git', ['rev-parse', '--is-inside-work-tree'], {
      stdio: 'ignore',
      timeout: 5_000,
    });
    return;
  } catch {
    // Not inside a work tree — fall through to init one.
  }
  execFileSync('git', ['init'], { stdio: 'ignore', timeout: 5_000 });
  console.log(dim('  (no git repository found here — ran `git init`, since every later step commits)'));
}
```

</details>

**依据 2 · 源码核查**：[bin/cli.mjs:914-969](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/bin/cli.mjs#L914-L969)

真实计划/冲突拒绝/记录先写。

<details>
<summary>查看原文（56行）</summary>

```text
async function init({ force, core, host = DEFAULT_HOST, hostOnly = false, globalInstall = null }) {
  ensureGitRepo();

  // Resolve the full list of writes up front so we can detect conflicts
  // before touching anything. A deferred install plans against `null` —
  // the shared agents/skills/build-graph payload only.
  const groups = [];
  for (const entry of plan(core, host, { hostOnly })) {
    const files = await plannedFiles(entry);
    groups.push({ entry, files });
  }

  // A generated file is derived from the payload rather than authored in
  // the project, so rewriting it loses nothing and never counts as a
  // conflict — that's what lets a second host be added to a project the
  // first one already set up.
  //
  // A deferred (coreless) install's root-instructions merge is exempted
  // too, but only when the existing file is a brownfield one: hand-written
  // content with no {{PROJECT_NAME}} shell marker. That file was never a
  // Hedgehog shell to overwrite — writePlannedFile leaves it untouched,
  // for hedgehog-adopt's own merge step to append its delimited core
  // section into later (src/hosts/claude-md-merge.mjs), once a core is
  // actually known. A file still carrying {{PROJECT_NAME}} (a previous
  // deferred init's untouched shell) is not brownfield content and keeps
  // hitting the ordinary conflict/--force path below.
  const conflicts = [];
  for (const { entry, files } of groups) {
    if (entry.type === 'generated') continue;
    for (const f of files) {
      if (!(await exists(f.dest))) continue;
      if (core === null && f.merge) {
        const existing = await readFile(f.dest, 'utf8');
        if (!existing.includes('{{PROJECT_NAME}}')) continue;
      }
      conflicts.push(f.dest);
    }
  }

  if (conflicts.length && !force) {
    console.error(`\n${red(bold('Refusing to overwrite existing files.'))}\n`);
    for (const c of conflicts) {
      console.error(`  ${yellow('exists')}  ${relative(DEST_ROOT, c) || c}`);
    }
    console.error(
      `\nRe-run with ${bold('--force')} to overwrite, or move these aside first.\n`,
    );
    process.exitCode = 1;
    return;
  }

  // Recorded before anything is written: the routing doc is generated
  // from this list, so it has to already name the host being installed.
  await recordHosts(DEST_ROOT, [host]);
  await recordVersion(DEST_ROOT, PKG_VERSION);
  if (core) await recordCore(DEST_ROOT, { name: core.manifest.name, version: core.version });
```

</details>

**依据 3 · 源码核查**：[bin/cli.mjs:970-1004](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/bin/cli.mjs#L970-L1004)

逐文件写/dbInit/gitignore。

<details>
<summary>查看原文（35行）</summary>

```text

  let written = 0;
  let overwritten = 0;
  for (const { files } of groups) {
    for (const f of files) {
      const already = await exists(f.dest);
      // Brownfield CLAUDE.md on the coreless path: writePlannedFile
      // leaves it untouched (see its own comment) rather than overwriting
      // it, so this write must not be logged or counted as one.
      const before = already && f.merge ? await readFile(f.dest, 'utf8') : null;
      await writePlannedFile(f);
      if (before !== null && (await readFile(f.dest, 'utf8')) === before) {
        console.log(`  ${dim('keep')}  ${relative(DEST_ROOT, f.dest)}`);
        continue;
      }
      if (already) overwritten++;
      else written++;
      const label = already ? yellow('overwrite') : green('create');
      console.log(`  ${label}  ${relative(DEST_ROOT, f.dest)}`);
    }
  }

  const { created: dbCreated, path: dbPath } = await dbInit(DB_PATH);
  console.log(`  ${dbCreated ? green('create') : dim('exists')}  ${dbPath}`);
  if (dbCreated) written++;

  const gitignore = await ensureGitignore();
  if (gitignore.added.length) {
    console.log(`  ${green('update')}  ${relative(DEST_ROOT, gitignore.path)} ${dim(`(${gitignore.added.length} entries)`)}`);
  }

  console.log(
    `\n${green(bold('Hedgehog installed.'))} ${dim(
      `${written} created${overwritten ? `, ${overwritten} overwritten` : ''}`,
    )}\n`,
```

</details>

**依据 4 · 源码核查**：[bin/cli.mjs:596-614](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/bin/cli.mjs#L596-L614)

merge保留分支起点。

<details>
<summary>查看原文（19行）</summary>

```text
async function writePlannedFile(f) {
  await mkdir(dirname(f.dest), { recursive: true });
  if (f.merge) {
    // A re-run (e.g. `init --core <name> --force`, installing a core
    // after a deferred coreless init) must not clobber a destination
    // `planner` already filled in: {{PROJECT_NAME}}/{{PROJECT_SUMMARY}}
    // are filled once, by hand or by `planner`, and never touched again.
    // Starting from the existing file instead of the pristine shell
    // whenever those are filled preserves that — whether the core section
    // is still the {{CORE_SECTION}} placeholder or an already-filled,
    // marked section that the new core's content replaces in place. The
    // shell is the base only for a destination that doesn't exist yet, or
    // one still holding the raw, unfilled template.
    let out = null;
    if (await exists(f.dest)) {
      const existing = await readFile(f.dest, 'utf8');
      if (!existing.includes('{{PROJECT_NAME}}') && hasCoreSection(existing)) {
        out = existing;
      } else if (!existing.includes('{{PROJECT_NAME}}') && !f.merge.include) {
```

</details>

**依据 5 · 源码核查**：[bin/cli.mjs:638-674](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/bin/cli.mjs#L638-L674)

真实模板替换/emit/cp落盘。

<details>
<summary>查看原文（37行）</summary>

```text
      // substitute into — see src/hosts/claude-md-merge.mjs. Keeping
      // both paths' output mutually recognizable is what lets
      // hasCoreSection/appendCoreSection treat a template-filled file
      // and an appended one the same way on a later re-run.
      out = out.includes('{{CORE_SECTION}}')
        ? out.replaceAll('{{CORE_SECTION}}', wrapSection(section))
        : appendCoreSection(out, section);
    }
    const dispatch = await readFile(join(PKG_ROOT, f.merge.dispatch), 'utf8');
    out = out.replaceAll('{{HOST_DISPATCH}}', dispatch.trimEnd());
    // Self-heal: a project past bootstrap that re-runs `init --force`
    // leaves this write with no bootstrap-only content, whether or not
    // `hedgehog shed` ever ran.
    if (await canShed(out)) out = stripPhaseBlocks(out, PHASE_NAME);
    await writeFile(f.dest, out);
    return;
  }
  // Rendered from the payload rather than copied from it — the routing
  // doc's tables are built from the agents' and skills' own frontmatter.
  if (f.generate) {
    await writeFile(f.dest, await f.generate({ pkgRoot: PKG_ROOT, projectRoot: DEST_ROOT }));
    return;
  }
  // A host whose format differs from the canonical one rewrites the file
  // on the way in. Hosts that read the canonical format have no emitter,
  // so their payload is copied verbatim.
  if (f.emit) {
    await writeFile(f.dest, f.emit(await readFile(f.src, 'utf8'), { src: f.src }));
    return;
  }
  await cp(f.src, f.dest);
}

// Every destination file this plan would write, resolved absolute.
async function plannedFiles(entry) {
  if (entry.type === 'merge') {
    return [{ dest: join(DEST_ROOT, entry.to), merge: entry }];
```

</details>

**依据 6 · 源码核查**：[src/registry/fetch.mjs:56-91](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/registry/fetch.mjs#L56-L91)

实际range来源/packAndExtract及manifest读取。

<details>
<summary>查看原文（36行）</summary>

```text
// What `npm pack` is asked to resolve for this core: a registry spec, or
// a local path under HEDGEHOG_CORE_SOURCE named for the package's last
// path segment (`@skyf0xx/hedgehog-core-landing-page` →
// `hedgehog-core-landing-page`).
function packSpec(entry) {
  const source = process.env[SOURCE_ENV];
  if (!source) return `${entry.package}@${entry.version}`;
  return join(source, entry.package.split('/').pop());
}

/**
 * Resolve, extract, and read one core package.
 *
 * @param {object} entry - a cores.json entry (`name`, `package`, `version`)
 * @returns {Promise<{manifest: object, root: string, version: string,
 *   engineAdvisory: string|null}>} the parsed hedgehog-core.yaml, the
 *   directory the package extracted to, the exact version resolved, and a
 *   line to print when the CLI is ahead of the core's engine line.
 */
export async function fetchCore(entry) {
  const staged = await packAndExtract(entry);
  const version = await packageVersion(staged.root);
  const cached = join(CORE_CACHE_ROOT, entry.name, version);

  // Read the manifest off the staged copy first. The cache is what
  // `cores list` reports as reusable and what an offline `update` reads
  // back, so only a core this engine can actually install belongs in it —
  // a manifest that fails here throws before anything is cached.
  let read;
  try {
    read = await readManifest(staged.root, entry);
  } catch (err) {
    await rm(staged.tmp, { recursive: true, force: true });
    throw err;
  }

```

</details>

**依据 7 · 源码核查**：[src/registry/fetch.mjs:124-154](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/registry/fetch.mjs#L124-L154)

真实npm pack和tar执行。

<details>
<summary>查看原文（31行）</summary>

```text
async function packAndExtract(entry) {
  const spec = packSpec(entry);
  const tmp = await mkdtemp(join(tmpdir(), `hedgehog-core-${entry.name}-`));

  let tarball;
  try {
    const { stdout } = await execFileAsync(
      'npm',
      ['pack', spec, '--pack-destination', tmp, '--json', '--loglevel', 'error'],
      { cwd: tmp, maxBuffer: 64 * 1024 * 1024 },
    );
    tarball = join(tmp, JSON.parse(stdout)[0].filename);
  } catch (err) {
    await rm(tmp, { recursive: true, force: true });
    throw new Error(unresolvableMessage(entry, spec, err), { cause: err });
  }

  try {
    await execFileAsync('tar', ['-xzf', tarball, '-C', tmp]);
  } catch (err) {
    await rm(tmp, { recursive: true, force: true });
    throw new Error(`Could not extract ${entry.package} from ${tarball}: ${err.message}`, { cause: err });
  }

  const root = join(tmp, TARBALL_ROOT);
  if (!(await exists(join(root, MANIFEST_NAME)))) {
    await rm(tmp, { recursive: true, force: true });
    throw new Error(
      `${entry.package} carries no ${MANIFEST_NAME}, so there is nothing to install from it.\n` +
        `Every Hedgehog core package ships that manifest at its root; a package without one\n` +
        `is not a core. Check the package name in the registry entry for "${entry.name}".`,
```

</details>

**依据 8 · 源码核查**：[src/hosts/index.mjs:101-148](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/hosts/index.mjs#L101-L148)

Gemini/OpenCode/Windsurf宿主包装不是执行验证。

<details>
<summary>查看原文（48行）</summary>

```text
      return [
        routingDoc('gemini'),
        {
          type: 'file',
          from: 'src/hosts/gemini/gemini-extension.json',
          to: 'gemini-extension.json',
        },
      ];
    },
  },

  // OpenCode auto-loads AGENTS.md from the repo root — the same file
  // every host ships as an index. The bootstrap merge carries the
  // discipline shell and the dispatch into it directly, so no separate
  // routing doc is generated and the file has one writer per install
  // flag. Subagents register from `.opencode/agents/` (the file name is
  // the agent name; Claude Code's `model:`/`tools:` subagent schema
  // comes off on install), and skills load on demand from
  // `.opencode/skills/`.
  opencode: {
    agentsDir: '.opencode/agents',
    skillsDir: '.opencode/skills',
    bootstrapFile: 'AGENTS.md',
    label: 'OpenCode',
    emitAgent: emitOpencodeAgent,
  },

  // Windsurf (Devin Desktop) auto-loads AGENTS.md from the repo root as
  // an always-on instruction file. The bootstrap merge carries the
  // discipline shell and dispatch into it directly. Subagents register
  // from `.devin/agents/` with their tool grant in the prompt, and
  // skills load from `.devin/skills/`.
  windsurf: {
    agentsDir: '.devin/agents',
    skillsDir: '.devin/skills',
    bootstrapFile: 'AGENTS.md',
    label: 'Windsurf',
    emitAgent: emitPromptAgent,
  },

  // GitHub Copilot loads `.github/copilot-instructions.md` as its
  // repo-wide instructions, so the discipline shell and dispatch land
  // there, and the generated AGENTS.md indexes the roles. Custom agents
  // register from `.github/agents/` (the file name is the agent name)
  // with their tool grant in the prompt, and skills load from
  // `.github/skills/`.
  copilot: {
    agentsDir: '.github/agents',
```

</details>

#### 缺口

- 未全审init/update/uninstall所有合并分支、tar路径安全/registry校验和外部core/宿主能力。
  **影响**：不能承诺无覆盖/完整回滚/来源可信和全宿主同等强制。
  **进一步探讨**：副本记录planned files及生成例外、模拟一写失败看记录/字节；固定并核外部core字节后才考虑实际验证命令。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 计划如何变成可并行任务，谁真执行代码？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

layerTaskFields从core生成objective/scope_globs/verify_command/commit_message/exclusive/radius，compileIntentTasks连层依赖；planTasks把intent按依赖排序，在BEGIN IMMEDIATE插任务/边。命令是core文本，不是本CLI自己证明的测试。claim先读工作树指纹与跨branch索引，再事务内reap过期lease；批量只要已有blocked任务可停整批，候选按scope/radius/exclusive冲突不重叠选，并原子UPDATE status building/owner/45分钟等lease，RETURNING证明当前call胜出。

owner是调用者提供字符串，不是认证过的Agent身份；租约是协调状态，不是OS文件锁/进程权限，外部编辑仍能碰文件。snapshot记录已脏文件字节/类型/执行位用于归因，原先不变的脏文件不被算本任务越界，但范围内原脏内容最终仍可能纳入该层commit。

真正改代码的是宿主Agent按orchestrating Skill委派packet，而CLI没有自己发模型请求/启动自治Agent执行循环；人工也能操作命令。完成消息本身不更新DB，要协调者调用verify或其他明确完成路径。并行安全依赖scope/radius声明真实与所有参与者配合，不承诺自动阻止任意并行写。

#### 证据与依据

**依据 1 · 源码核查**：[src/db/plan.mjs:178-218](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/plan.mjs#L178-L218)

core真实字段编译和依赖。

<details>
<summary>查看原文（41行）</summary>

```text
export function layerTaskFields(layer, module, overrides = new Map()) {
  const fields = {
    objective: `${layer.id} for ${module}`,
    scope_globs: JSON.stringify(layer.scope.map((g) => fillModule(g, module))),
    verify_command: fillModule(layer.verify, module),
    commit_message: fillModule(layer.commit, module),
    exclusive: layer.exclusive ? 1 : 0,
    verify_radius:
      layer.verify_radius === null
        ? null
        : JSON.stringify(layer.verify_radius.map((g) => fillModule(g, module))),
  };
  return composeScope(fields, taskId(module, layer.id), overrides);
}

// Compiles one intent's tasks + intra-intent dependencies (mirroring the
// core definition's layer order) without touching the database.
function compileIntentTasks(intent, core, overrides) {
  const module = intent.id;
  const byId = layerById(core);
  const perIntentLayers = core.layers.filter((layer) => !layer.once);

  const tasks = perIntentLayers.map((layer) => ({
    id: taskId(intent.id, layer.id),
    intent_id: intent.id,
    module,
    layer: layer.id,
    priority: intent.priority,
    ...layerTaskFields(layer, module, overrides),
  }));

  const dependencies = [];
  for (const layer of core.layers) {
    if (!layer.depends_on) continue;
    const parent = byId.get(layer.depends_on);
    if (layer.once && parent.once) continue; // compileOnceTasks owns this edge
    dependencies.push({
      task_id: layer.once ? onceTaskId(layer.id) : taskId(intent.id, layer.id),
      depends_on_task_id: parent.once
        ? onceTaskId(parent.id)
        : taskId(intent.id, parent.id),
```

</details>

**依据 2 · 源码核查**：[src/db/plan.mjs:504-565](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/plan.mjs#L504-L565)

plan读取/排序并事务写入。

<details>
<summary>查看原文（62行）</summary>

```text
export function planTasks(db, core, overrides = new Map(), { excludeIntentIds = new Set() } = {}) {
  const intentDependencies = loadIntentDependencies(db);
  const effectiveExcludeIntentIds = expandExcludedIntentIds(excludeIntentIds, intentDependencies);
  const intents = loadPendingIntents(db).filter(
    (intent) => !effectiveExcludeIntentIds.has(intent.id),
  );
  const ordered = orderIntents(intents, intentDependencies);

  const dependsOnByIntent = new Map();
  for (const { intent_id, depends_on_intent_id } of intentDependencies) {
    if (!dependsOnByIntent.has(intent_id)) dependsOnByIntent.set(intent_id, []);
    dependsOnByIntent.get(intent_id).push(depends_on_intent_id);
  }

  const perIntentLayers = core.layers.filter((layer) => !layer.once);
  // validateCore guarantees at least one per-intent layer. The skip check
  // has to key on the first *per-intent* layer, not core.layers[0]: with a
  // once-layer at the head, core.layers[0]'s task id is the same for every
  // intent, so every intent after the first would look already-compiled
  // and silently compile nothing.
  const firstLayerId = perIntentLayers[0].id;
  const onceTaskIds = new Set(
    core.layers.filter((layer) => layer.once).map((layer) => onceTaskId(layer.id)),
  );

  const runInsert = insertTask(db);
  const runInsertDep = insertDependency(db);
  const runInsertTaskReq = insertTaskRequirement(db);

  const compiledIntentIds = [];
  const skippedIntentIds = [];
  const compiledOnceTaskIds = [];
  // Once-tasks that a newly compiled intent hangs a prerequisite on.
  const onceTasksGainingPrereqs = [];
  let reopenedOnceTaskIds;

  db.exec('BEGIN IMMEDIATE');
  try {
    if (onceTaskIds.size > 0 && countRealIntents(db) > 0) {
      ensureCoreIntent(db, core);
      const { tasks, dependencies } = compileOnceTasks(core, overrides);
      for (const t of tasks) {
        if (taskExists(db, t.id)) continue;
        runInsert.run(
          t.id,
          t.intent_id,
          t.module,
          t.layer,
          t.objective,
          t.scope_globs,
          t.verify_command,
          t.commit_message,
          t.priority,
          t.exclusive,
          t.verify_radius,
        );
        compiledOnceTaskIds.push(t.id);
      }
      for (const d of dependencies) {
        runInsertDep.run(d.task_id, d.depends_on_task_id);
      }
    }
```

</details>

**依据 3 · 源码核查**：[src/db/claim.mjs:78-101](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/claim.mjs#L78-L101)

真实类型/内容/执行位指纹。

<details>
<summary>查看原文（24行）</summary>

```text
//
// Cost is one lstat plus one read per dirty path, no subprocess, so this
// stays cheap over a large working tree.
//
// Exported so verify.mjs fingerprints paths the exact same way they were
// fingerprinted here — two implementations that drifted would silently
// mis-attribute.
export function pathFingerprint(path) {
  let stats;
  try {
    stats = lstatSync(path);
  } catch {
    return ABSENT;
  }
  try {
    if (stats.isSymbolicLink()) return `l:${sha1(readlinkSync(path))}`;
    if (stats.isFile()) return `f${stats.mode & 0o100 ? '755' : '644'}:${sha1(readFileSync(path))}`;
    // Anything else (fifo, socket, device, directory) is not something
    // git can hold, but it is something a path can be turned into —
    // record the type so that turning it into one is still a change.
    return `o:${(stats.mode & 0o170000).toString(8)}`;
  } catch {
    return ABSENT;
  }
```

</details>

**依据 4 · 源码核查**：[src/db/claim.mjs:300-307](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/claim.mjs#L300-L307)

原子claim状态和lease。

```text
const claimOne = (db) =>
  db.prepare(`
    UPDATE tasks SET status = 'building', lease_owner = ?, leased_at = datetime('now'),
      lease_expires_at = datetime('now', '+' || ? || ' minutes'),
      claim_snapshot = ?
    WHERE id = ? AND status IN ('planned','ready') AND lease_owner IS NULL
    RETURNING id
  `);
```

**依据 5 · 源码核查**：[src/db/claim.mjs:354-391](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/claim.mjs#L354-L391)

真实批量事务/blocked/冲突选择。

<details>
<summary>查看原文（38行）</summary>

```text
export function claimTasks(db, { owner, count = 1, leaseMinutes = 45 }) {
  ensureTaskColumns(db);
  // Read the working tree *before* BEGIN — this file keeps verify.mjs's
  // rule that no subprocess runs with a sqlite transaction open. One
  // snapshot serves the whole batch: they all start from the same tree.
  // Taking it a moment early can only miss a path dirtied in between,
  // which leaves that path attributed — the strict direction.
  const claimSnapshot = snapshotWorkingTree();
  // Same rule, same reason, for the cross-branch index: buildCrossBranchIndex
  // shells out to `git log --all` (twice — see crossBranch.mjs), so it is
  // built here, before BEGIN, and threaded into findClaimableTasks rather
  // than left to build itself once inside the transaction below.
  const crossBranchIndex = buildCrossBranchIndex(db);

  return inTransaction(db, () => {
    const justReaped = reapExpiredLeases(db);

    const blocked = findBlockedTasks(db).filter((task) => !justReaped.has(task.id));
    if (blocked.length > 0) {
      return { claimed: [], blocked };
    }

    const candidates = findClaimableTasks(db, crossBranchIndex);
    const inFlight = findInFlightTasks(db);
    const runClaim = claimOne(db);
    const claimed = [];

    for (const candidate of candidates) {
      if (claimed.length >= count) break;
      const against = [...inFlight, ...claimed];
      if (against.some((accepted) => conflicts(candidate, accepted) !== null)) continue;
      const result = runClaim.get(owner, leaseMinutes, claimSnapshot, candidate.id);
      if (result === undefined) continue; // lost the race, skip
      claimed.push(loadTask(db, candidate.id));
    }

    return { claimed, blocked: [] };
  });
```

</details>

**依据 6 · 源码核查**：[src/db/claim.mjs:415-471](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/claim.mjs#L415-L471)

单claim同样校状态/依赖/冲突。

<details>
<summary>查看原文（57行）</summary>

```text
export function claimTask(db, taskId, { owner, leaseMinutes = 45 }) {
  ensureTaskColumns(db);
  // Same rule as claimTasks: read before BEGIN, no subprocess inside a
  // transaction. buildCrossBranchIndex shells out to `git log --all`, so
  // it is built here unconditionally (cheap relative to a `git` process
  // spawn either way) rather than only on the branch that turns out to
  // need it, which would otherwise tempt building it lazily from inside
  // the transaction below.
  const claimSnapshot = snapshotWorkingTree();
  const crossBranchIndex = buildCrossBranchIndex(db);

  return inTransaction(db, () => {
    reapExpiredLeases(db);

    const task = loadTask(db, taskId);
    if (task === undefined) return { claimed: false, reason: 'no_such_task' };

    if (!['planned', 'ready'].includes(task.status) || task.lease_owner !== null) {
      return { claimed: false, reason: 'not_claimable', task };
    }

    // Same cross-branch widening findClaimableTasks's fan-out applies: a
    // dependency this DB still shows incomplete may already be complete on
    // trunk or a sibling worktree's branch. Checked here too so a targeted
    // `hedgehog claim <task-id>` doesn't refuse a task the fan-out would
    // have happily claimed.
    const stillIncomplete = incompleteDependencies(db, taskId);
    const incomplete = stillIncomplete.filter(
      (dep) => !commitMessageExistsAnywhere(dep, crossBranchIndex),
    );
    if (incomplete.length > 0) {
      return { claimed: false, reason: 'incomplete_dependencies', task, incomplete };
    }

    // Conflicting with something already building/verifying is the one
    // refusal a targeted claim must keep: the whole point of the
    // conflict predicate is that two overlapping tasks in one working
    // tree corrupt each other's scope check and commit. Waiting for the
    // neighbor to finish (or releasing it) is the fix, not overriding
    // this.
    const conflicting = [];
    for (const other of findInFlightTasks(db)) {
      if (other.id === task.id) continue;
      const kind = conflicts(task, other);
      if (kind !== null) conflicting.push({ task: other, kind });
    }
    if (conflicting.length > 0) {
      return { claimed: false, reason: 'conflict', task, conflicting };
    }

    const result = claimOne(db).get(owner, leaseMinutes, claimSnapshot, task.id);
    if (result === undefined) return { claimed: false, reason: 'race_lost', task };

    return { claimed: true, task: loadTask(db, task.id) };
  });
}

```

</details>

**依据 7 · 源码核查**：[src/skills/hedgehog-orchestrating/SKILL.md:8-36](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/skills/hedgehog-orchestrating/SKILL.md#L8-L36)

真实角色委派协议非CLI自动模型loop。

<details>
<summary>查看原文（29行）</summary>

```text
`.hedgehog/hedgehog.db` is the source of truth for what's next — never
re-derive build state from prose. To work from it:

1. Run `hedgehog claim --count N --owner <owner>`. It's atomic and
   lease-based, and returns up to N tasks (each with its own full
   STATUS/INTENT/RELEVANT RULES/INHERITED DEBT/INHERITED DECISIONS/WHY
   NOW/BLOCKED DOWNSTREAM/ALLOWED SCOPE/VERIFICATION packet) that the
   scheduler has already verified are safe to run together right now —
   scope and verify-radius disjoint. `--count` is a maximum, not a
   promise: a call may return fewer than N, or zero. `hedgehog ready` is
   a read-only preview of the claimable/held-back split (and why a task
   is held back — conflict with another claimable task, or exclusivity)
   before you claim.
2. Delegate each claimed packet to this core's loop skill (named in the
   project's core section), one dispatch per packet, running concurrently.
3. As each agent reports its packet done, run `hedgehog verify
   <task-id> --owner <owner>` **serially** — one at a time, even though
   the building happened concurrently, because verify writes git commits
   and those must land one at a time. It checks the touched files
   against the packet's ALLOWED SCOPE, runs the verification command,
   and on a pass writes the commit and unlocks whatever the task was
   blocking. An agent reporting success never moves the task — only a
   passing `hedgehog verify` exit code does.

`hedgehog claim` hands out only tasks safe to run together. Never run
two tasks it didn't hand you together.

The packet's **INTENT** block names the goal and outcome of the *whole*
intent, not just this layer. A layer's own verify command runs the tests
```

</details>

**依据 8 · 源码核查**：[bin/cli.mjs:2540-2577](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/bin/cli.mjs#L2540-L2577)

CLI owner参数→真实claimTasks调用。

<details>
<summary>查看原文（38行）</summary>

```text
  const taskId = args[0] && !args[0].startsWith('--') ? args[0] : undefined;
  const ownerIdx = args.indexOf('--owner');
  const owner = ownerIdx !== -1 ? args[ownerIdx + 1] : undefined;
  const countIdx = args.indexOf('--count');
  const count = countIdx !== -1 ? Number(args[countIdx + 1]) : 1;
  if (!owner) {
    console.error(
      `${red('Usage:')} hedgehog claim --owner <owner> [--count <n>]\n   or: hedgehog claim <task-id> --owner <owner>\n`,
    );
    process.exitCode = 1;
    return;
  }
  if (taskId && countIdx !== -1) {
    console.error(`${red('--count cannot be combined with a task id')} — a targeted claim takes exactly one task.\n`);
    process.exitCode = 1;
    return;
  }

  if (!(await exists(DB_PATH))) {
    console.error(`${red('No build graph found.')} Run ${bold('hedgehog db init')} first.\n`);
    process.exitCode = 1;
    return;
  }

  printDbTarget();

  if (taskId) {
    await claimOneCommand(taskId, owner);
    return;
  }

  const db = openDb();
  let claimed, blocked;
  try {
    ({ claimed, blocked } = claimTasks(db, { owner, count }));
  } finally {
    db.close();
  }
```

</details>

#### 缺口

- 未跑多进程/Host Agent/所有conflicts路径与全core，工具声明正确性未验。
  **影响**：图/租约有机制但不是执行隔离和自动完成任务。
  **进一步探讨**：副本两互不交scope任务与一冲突任务只核claim/packet，检查实际改文件者和owner来源，不让未claim工作并行。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · verify是否等于测试通过和安全提交？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

CLI verify要求taskId/owner，查所需二进制再调用verifyTask。claimForVerify先事务reap过期，必须building且owner匹配，改verifying后提交DB事务；范围门用claim snapshot归因并扣除其他在飞任务scope，越界则blocked。无scope改动时直接写noop文件、complete/unlock且不跑verify_command，返回exitCode/commitSha=null/noop=true；complete并不统一等于跑过测试。

有改动时真实execSync(core verify_command) shell执行，无这里的timeout/caller signal；失败存verifications/blocked，不撤其副作用。成功后重新diff范围、classify、git add --paths再git commit -m，最后DB记录passed/artifacts/complete/unlock。它会自动提交，不是只检验；测试green只代表配置命令退出0，源码Skill也承认不保证intent覆盖，最后INTENT CHECK仍由人/Agent核目标。Git hook/签名失败退building保留lease，不能照错误文案“nothing recorded”推成没有任何index或hook外部影响。

commit lock只协调本工具遵守它的进程，git commit没有pathspec且没有清空既存index；若其他已暂存范围外文件在claim前已脏且门归因排除/属于邻居scope，现有index内容可随本次commit进入。静态条件风险，未复现，不声称每次会夹带。verify命令后也只重读in-scope集，不做一次新的全树越界门；测试自写范围外文件可能留下，必须人工查完整diff/index。因此首试必须空index、单任务、无别人修改。

#### 证据与依据

**依据 1 · 源码核查**：[bin/cli.mjs:2381-2421](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/bin/cli.mjs#L2381-L2421)

实际verify参数/二进制检查到verifyTask。

<details>
<summary>查看原文（41行）</summary>

```text
async function verifyCommand(args) {
  await ensureDb();

  const taskId = args[0];
  const ownerIdx = args.indexOf('--owner');
  const owner = ownerIdx !== -1 ? args[ownerIdx + 1] : undefined;
  if (!taskId || !owner) {
    console.error(`${red('Usage:')} hedgehog verify <task-id> --owner <owner>\n`);
    process.exitCode = 1;
    return;
  }

  if (!(await exists(DB_PATH))) {
    console.error(`${red('No build graph found.')} Run ${bold('hedgehog db init')} first.\n`);
    process.exitCode = 1;
    return;
  }

  printDbTarget();
  const db = openDb();
  let result;
  try {
    const blockers = await missingBinariesForTask(db, taskId, owner);
    if (blockers) {
      const list = blockers.missing.map((b) => bold(b)).join(', ');
      console.error(
        `${red(bold('Missing required binaries.'))} Task ${bold(taskId)} (layer ${bold(blockers.layer)}) was not verified.\n`,
      );
      console.error(`Not found on PATH: ${list}`);
      console.error(
        `${dim(`Declared by layer "${blockers.layer}" in core.yaml (requires:). The verify command was not run.`)}`,
      );
      console.error(
        `${dim('Install them, or put them on the PATH of the shell running hedgehog — an interactive login shell may see binaries a non-interactive one does not — then re-run this command.')}\n`,
      );
      process.exitCode = 1;
      return;
    }
    const overrides = await loadOverrides();
    result = await verifyTask(db, taskId, owner, overrides);
  } catch (err) {
```

</details>

**依据 2 · 源码核查**：[src/db/verify.mjs:405-439](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/verify.mjs#L405-L439)

真实owner/过期检查和verifying。

<details>
<summary>查看原文（35行）</summary>

```text
function claimForVerify(db, taskId, owner) {
  let task;
  // Before BEGIN, and before any statement below names claim_snapshot: a
  // DB created by an earlier version has no such column, and both the
  // status writes here and the gate's snapshot read depend on it.
  ensureTaskColumns(db);
  db.exec('BEGIN IMMEDIATE');
  try {
    // Reaps this (and any other) task's lease if lease_expires_at has
    // passed, before the ownership check below reads status/lease_owner
    // — otherwise a build that outlived its lease with no concurrent
    // `claim` call in the interim reaches the check below still looking
    // legitimately leased, and verify would honor a lease that's already
    // expired.
    reapExpiredLeases(db);
    task = loadTask(db, taskId);
    if (!task) throw new Error(`no such task: ${taskId}`);
    if (task.status !== 'building' || task.lease_owner !== owner) {
      throw new Error(
        `Task ${taskId} is not leased to ${owner} (currently: ${task.status}${
          task.lease_owner ? ', leased to ' + task.lease_owner : ''
        })`,
      );
    }
    setTaskStatus(db, task.id, 'verifying');
    db.exec('COMMIT');
  } catch (err) {
    try {
      db.exec('ROLLBACK');
    } catch {
      // Rollback failing must not mask the original error.
    }
    throw err;
  }
  return { ...task, status: 'verifying' };
```

</details>

**依据 3 · 源码核查**：[src/db/verify.mjs:464-505](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/verify.mjs#L464-L505)

范围门/越界blocked。

<details>
<summary>查看原文（42行）</summary>

```text
export async function verifyTask(db, taskId, owner, overrides = new Map()) {
  const task = claimForVerify(db, taskId, owner);

  const scopeGlobs = JSON.parse(composeScope({ scope_globs: task.scope_globs }, taskId, overrides).scope_globs);
  // Gate 1 runs inside the commit lock: the diff has to see a working
  // tree no other task's commit is landing into mid-read, and the
  // neighbor-scope split has to be computed against a snapshot, not a
  // set that another verify's commit could shrink out from under it
  // between the several changedPaths() calls inside it. Only `offending`
  // is used here — `inScope` is discarded and recomputed fresh just
  // before the commit below, since verify_command (which runs, unlocked,
  // in between) can itself touch files inside this task's own scope
  // (generated lockfiles, formatted output), and committing a stale
  // pre-verify_command snapshot would silently drop those.
  const { offending, inScope: inScopeBeforeVerify } = withCommitLock(() => {
    // Only what changed during this task's lease is this task's to answer
    // for; everything else in the shared working tree was already there
    // when the task was handed out. The commit set below is deliberately
    // *not* filtered this way — it is scope-restricted already, and a
    // pre-existing dirty file inside the task's own scope is still swept
    // into the layer's commit exactly as before.
    const touchedNow = attributedToTask(changedPaths(), task.claim_snapshot);
    return splitByScope(db, taskId, touchedNow, scopeGlobs);
  });

  if (offending.length > 0) {
    db.exec('BEGIN IMMEDIATE');
    try {
      setTaskStatus(db, task.id, 'blocked', { blockedReason: 'scope_violation' });
      db.exec('COMMIT');
    } catch (err) {
      try {
        db.exec('ROLLBACK');
      } catch {
        // Rollback failing must not mask the original error.
      }
      throw err;
    }
    return { outcome: 'scope_violation', offending };
  }

  // Genuine no-op: nothing this task's scope claims has changed even
```

</details>

**依据 4 · 源码核查**：[src/db/verify.mjs:507-559](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/verify.mjs#L507-L559)

无改动noop不运行命令直接complete。

<details>
<summary>查看原文（53行）</summary>

```text
  // by an earlier layer, or this intent never touches this module at all.
  // verify_command has nothing to check here, so it never runs, and no
  // commit is made. The completion still needs to survive `hedgehog db
  // rebuild`, which recovers completion from a matching commit subject;
  // with no commit to match, the committed record under NOOP_DIR is what
  // rebuild replays instead (see noop.mjs, rebuild.mjs#replayNoopRecords).
  if (inScopeBeforeVerify.length === 0) {
    const verifiedAt = new Date().toISOString();
    await writeNoopFile({ task: task.id, commit_message: task.commit_message, verified_at: verifiedAt });

    let unlocked;
    let completedIntent;
    db.exec('BEGIN IMMEDIATE');
    try {
      setTaskStatus(db, task.id, 'complete');
      unlocked = unlockReadyDependents(db, task.id);
      completedIntent = completeIntentIfDone(db, task.intent_id);
      db.exec('COMMIT');
    } catch (err) {
      try {
        db.exec('ROLLBACK');
      } catch {
        // Rollback failing must not mask the original error.
      }
      throw err;
    }

    return {
      outcome: 'complete',
      exitCode: null,
      output: null,
      commitSha: null,
      noop: true,
      unlocked,
      intentComplete: completedIntent !== null,
      completedIntent: completedIntent ?? null,
    };
  }

  const { exitCode, output } = runVerifyCommand(task.verify_command);

  if (exitCode !== 0) {
    db.exec('BEGIN IMMEDIATE');
    try {
      insertVerification(db).run(task.id, task.verify_command, exitCode, output, 'failed');
      setTaskStatus(db, task.id, 'blocked', { blockedReason: 'verification_failed' });
      db.exec('COMMIT');
    } catch (err) {
      try {
        db.exec('ROLLBACK');
      } catch {
        // Rollback failing must not mask the original error.
      }
```

</details>

**依据 5 · 源码核查**：[src/db/verify.mjs:304-312](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/verify.mjs#L304-L312)

实际execSync无此处超时。

```text
function runVerifyCommand(command) {
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    return { exitCode: 0, output };
  } catch (err) {
    const output = `${err.stdout ?? ''}${err.stderr ?? ''}` || err.message;
    return { exitCode: err.status ?? 1, output };
  }
}
```

**依据 6 · 源码核查**：[src/db/verify.mjs:543-565](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/verify.mjs#L543-L565)

验证失败记录/blocked。

<details>
<summary>查看原文（23行）</summary>

```text
    };
  }

  const { exitCode, output } = runVerifyCommand(task.verify_command);

  if (exitCode !== 0) {
    db.exec('BEGIN IMMEDIATE');
    try {
      insertVerification(db).run(task.id, task.verify_command, exitCode, output, 'failed');
      setTaskStatus(db, task.id, 'blocked', { blockedReason: 'verification_failed' });
      db.exec('COMMIT');
    } catch (err) {
      try {
        db.exec('ROLLBACK');
      } catch {
        // Rollback failing must not mask the original error.
      }
      throw err;
    }
    return { outcome: 'failed', exitCode, output };
  }

  // Re-diffs against `scopeGlobs` directly (not the gate's `offending`
```

</details>

**依据 7 · 源码核查**：[src/db/verify.mjs:582-642](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/verify.mjs#L582-L642)

重读范围/Git提交后DB完成。

<details>
<summary>查看原文（61行）</summary>

```text
  // a state transition this one deliberately doesn't make.
  let touched, kindByPath, commitSha;
  try {
    ({ touched, kindByPath, commitSha } = withCommitLock(() => {
      const inScope = changedPaths(scopeGlobs.map((glob) => `:(glob)${glob}`));
      return {
        touched: inScope,
        kindByPath: classifyArtifacts(inScope),
        commitSha:
          inScope.length > 0
            ? commitTouchedPaths(inScope, task.commit_message)
            : commitNoOpLayer(task.commit_message),
      };
    }));
  } catch (err) {
    rollbackToBuilding(db, task.id);
    throw new Error(
      `Task ${task.id} passed verification but its commit failed, so nothing was ` +
        `recorded. The task is back to \`building\`, still leased to ${owner} — fix ` +
        `the cause (a rejecting git hook, commit signing, or git identity), then ` +
        `re-run \`hedgehog verify ${task.id} --owner ${owner}\`, or hand it back ` +
        `with \`hedgehog release ${task.id} --owner ${owner}\`.\n\n${err.message}`,
      { cause: err },
    );
  }

  let unlocked;
  let completedIntent;
  db.exec('BEGIN IMMEDIATE');
  try {
    insertVerification(db).run(task.id, task.verify_command, exitCode, output, 'passed');

    const runInsertArtifact = insertArtifact(db);
    for (const path of touched) {
      runInsertArtifact.run(task.id, path, kindByPath.get(path), commitSha);
    }

    setTaskStatus(db, task.id, 'complete');
    unlocked = unlockReadyDependents(db, task.id);
    completedIntent = completeIntentIfDone(db, task.intent_id);

    db.exec('COMMIT');
  } catch (err) {
    try {
      db.exec('ROLLBACK');
    } catch {
      // Rollback failing must not mask the original error.
    }
    throw err;
  }

  return {
    outcome: 'complete',
    exitCode,
    output,
    commitSha,
    unlocked,
    intentComplete: completedIntent !== null,
    completedIntent: completedIntent ?? null,
  };
}
```

</details>

**依据 8 · 源码核查**：[src/db/verify.mjs:335-339](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/verify.mjs#L335-L339)

git add指定paths但commit无pathspec。

```text
function commitTouchedPaths(paths, commitMessage) {
  git(['add', '--', ...paths], { stdio: 'pipe' });
  git(['commit', '-m', commitMessage], { stdio: 'pipe' });
  return git(['rev-parse', 'HEAD']).trim();
}
```

**依据 9 · 源码核查**：[src/db/verify.mjs:156-183](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/verify.mjs#L156-L183)

范围门排除其他在飞scope。

<details>
<summary>查看原文（28行）</summary>

```text
  const rows = db
    .prepare(`SELECT scope_globs FROM tasks WHERE id <> ? AND status IN ('building', 'verifying')`)
    .all(taskId);
  return rows.flatMap((row) => JSON.parse(row.scope_globs));
}

// Splits the working tree's touched paths into `inScope` (this task's own
// scope_globs — the only set that gets classified, recorded as artifacts,
// and committed) and `offending` (touched outside scope AND outside every
// other in-flight task's own declared scope — a real violation, not a
// concurrent neighbor's legitimate uncommitted work). `touched` (the
// full, unrestricted diff) is used only to compute `offending`; it is
// never itself the commit set, or a neighbor's uncommitted file sitting
// in the shared working tree would ride along into this task's commit.
function splitByScope(db, taskId, touched, scopeGlobs) {
  const pathspecs = scopeGlobs.map((glob) => `:(glob)${glob}`);
  const inScope = changedPaths(pathspecs);
  const inScopeSet = new Set(inScope);

  const neighborGlobs = loadOtherInFlightScopes(db, taskId);
  const neighborPathspecs = neighborGlobs.map((glob) => `:(glob)${glob}`);
  const neighborOwned = new Set(
    neighborPathspecs.length > 0 ? changedPaths(neighborPathspecs) : [],
  );

  const offending = touched.filter((path) => !inScopeSet.has(path) && !neighborOwned.has(path));
  return { inScope, offending };
}
```

</details>

**依据 10 · 源码核查**：[src/skills/hedgehog-orchestrating/SKILL.md:38-43](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/skills/hedgehog-orchestrating/SKILL.md#L38-L43)

验证只测内部一致，目标须独立检查。

```text
of what was asked — a layer that builds half the intent and tests that
half exhaustively is green. Build the layer's share of the goal, and say
so when the packet doesn't account for something the goal asks for.
When `hedgehog verify` closes the **last** layer of an intent it prints
that goal and outcome back as an **INTENT CHECK**: read the built work
against it there, because nothing else in the build does.
```

#### 缺口

- 未复现index夹带/测试越界/长命令、hook/签名、全部noop/其他手工路径。
  **影响**：测试/提交/状态不是业务完成或无误提交保证。
  **进一步探讨**：副本空index单任务跑可信无害命令；再人工造已暂存异scope样本和测试写异scope样本核最终commit，不改生产仓。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 过期、跨branch、持久失败与退出还有哪些边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

SQLite writable连接启foreign_keys/busy_timeout/WAL但synchronous=NORMAL，任务写用事务；这不和Git文件/commit形成共同事务。verify先Git commit再DB完成事务，若后者失败可有commit已成而任务未闭合，须核实际HEAD/artifacts后reconcile/rebuild，不盲verify重复提交。init记录/payload与noop/reconcile文件和DB也分阶段，本轮不承诺掉电无损。

lease过期由后续命令reap改blocked/清owner，不是杀Agent/子进程；释放/renew同样是台账操作。verify开头只校一次owner/lease，长命令后最终状态写入未在所读路径再次校同一代lease；跨进程reap/retry与旧verify交错的恢复行为未实测，不能把45分钟当强取消。commit.lock wx互斥、超过5分钟按mtime可偷取，持锁callback运行多久不受该等待deadline约束，长Git hook/外部writer仍需核，非系统全局安全锁。

跨branch索引看本地git log --all commit subject并排除本图重名/已reopen本branch情况；不把别branch代码checkout/merge进当前树。依赖可因此被视满足，但标题匹配不是当前产物/语义可用证明，需另核真实依赖内容。另reconcile允许带reason/evidence记录人工完成，不跑scope gate/verify；不能承诺只有verify可complete或门不可绕。commitGateStatus检查lefthook marker/二进制等并给active，也明确可no-verify；它是诊断，非不能绕过的强认证。

退出停止新claim、核Agent/测试/Git进程后再释放/保留DB和committed intents/core/noop/reconcile，不能删DB等同停任务；根没有常驻执行器可统一取消。本轮不操作目标worktree/merge或Git，相关路径未全审。

#### 证据与依据

**依据 1 · 源码核查**：[src/db/init.mjs:36-45](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/init.mjs#L36-L45)

真实SQLite pragmas。

<details>
<summary>查看原文（10行）</summary>

```text
// journal_mode is: it requires write access, and a readOnly caller is
// only ever reached after a writable open earlier in the same command.
export function openDb({ readOnly = false } = {}) {
  const db = new DatabaseSync(dbAbsPath(), { readOnly });
  db.exec('PRAGMA foreign_keys = ON');
  db.exec('PRAGMA busy_timeout = 10000');
  if (!readOnly) db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA synchronous = NORMAL');
  if (!readOnly) applySchema(db);
  return db;
```

</details>

**依据 2 · 源码核查**：[src/db/init.mjs:77-95](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/init.mjs#L77-L95)

真实事务commit/rollback。

<details>
<summary>查看原文（19行）</summary>

```text
export function inTransaction(db, fn) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    try {
      db.exec('ROLLBACK');
    } catch {
      // Rollback failing must not mask the original error.
    }
    throw err;
  }
}

// Returns { created: boolean, path } — created is false when the DB file
// already existed (no-op per the spec).
export async function dbInit(dbPath = DB_PATH) {
```

</details>

**依据 3 · 源码核查**：[src/db/verify.mjs:582-642](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/verify.mjs#L582-L642)

Git先于DB最终记录。

<details>
<summary>查看原文（61行）</summary>

```text
  // a state transition this one deliberately doesn't make.
  let touched, kindByPath, commitSha;
  try {
    ({ touched, kindByPath, commitSha } = withCommitLock(() => {
      const inScope = changedPaths(scopeGlobs.map((glob) => `:(glob)${glob}`));
      return {
        touched: inScope,
        kindByPath: classifyArtifacts(inScope),
        commitSha:
          inScope.length > 0
            ? commitTouchedPaths(inScope, task.commit_message)
            : commitNoOpLayer(task.commit_message),
      };
    }));
  } catch (err) {
    rollbackToBuilding(db, task.id);
    throw new Error(
      `Task ${task.id} passed verification but its commit failed, so nothing was ` +
        `recorded. The task is back to \`building\`, still leased to ${owner} — fix ` +
        `the cause (a rejecting git hook, commit signing, or git identity), then ` +
        `re-run \`hedgehog verify ${task.id} --owner ${owner}\`, or hand it back ` +
        `with \`hedgehog release ${task.id} --owner ${owner}\`.\n\n${err.message}`,
      { cause: err },
    );
  }

  let unlocked;
  let completedIntent;
  db.exec('BEGIN IMMEDIATE');
  try {
    insertVerification(db).run(task.id, task.verify_command, exitCode, output, 'passed');

    const runInsertArtifact = insertArtifact(db);
    for (const path of touched) {
      runInsertArtifact.run(task.id, path, kindByPath.get(path), commitSha);
    }

    setTaskStatus(db, task.id, 'complete');
    unlocked = unlockReadyDependents(db, task.id);
    completedIntent = completeIntentIfDone(db, task.intent_id);

    db.exec('COMMIT');
  } catch (err) {
    try {
      db.exec('ROLLBACK');
    } catch {
      // Rollback failing must not mask the original error.
    }
    throw err;
  }

  return {
    outcome: 'complete',
    exitCode,
    output,
    commitSha,
    unlocked,
    intentComplete: completedIntent !== null,
    completedIntent: completedIntent ?? null,
  };
}
```

</details>

**依据 4 · 源码核查**：[src/db/claim.mjs:281-296](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/claim.mjs#L281-L296)

reap只改台账。

<details>
<summary>查看原文（16行）</summary>

```text
export function reapExpiredLeases(db) {
  const rows = db
    .prepare(
      `
    UPDATE tasks
    SET status = 'blocked', blocked_reason = 'lease_expired',
        lease_owner = NULL, lease_expires_at = NULL, leased_at = NULL,
        claim_snapshot = NULL
    WHERE status IN ('building', 'verifying') AND lease_expires_at < datetime('now')
    RETURNING id
  `,
    )
    .all();
  return new Set(rows.map((r) => r.id));
}

```

</details>

**依据 5 · 源码核查**：[src/db/commitLock.mjs:19-21](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/commitLock.mjs#L19-L21)

mtime stale阈值。

```text
// crashed before releasing it (no host-level lock survives a kill -9) —
// stealing it is safer than a build that hangs forever on a dead holder.
const STALE_MS = 5 * 60 * 1000;
```

**依据 6 · 源码核查**：[src/db/commitLock.mjs:39-77](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/commitLock.mjs#L39-L77)

偷锁/等待deadline与callback/finally。

<details>
<summary>查看原文（39行）</summary>

```text
function stealIfStale() {
  try {
    const { mtimeMs } = statSync(LOCK_PATH);
    if (Date.now() - mtimeMs > STALE_MS) unlinkSync(LOCK_PATH);
  } catch {
    // Gone already (released between the stat and here) — nothing to do.
  }
}

// Blocks (synchronously spinning the event loop via a busy wait — this
// file has no async caller; verifyTask and everything in it is sync by
// design, see verify.mjs) until the lock is held, then runs `fn` and
// always releases. A crashed holder's lock is stolen after STALE_MS
// rather than wedging every future verify permanently.
export function withCommitLock(fn) {
  const deadline = Date.now() + STALE_MS * 2;
  while (!tryAcquire()) {
    stealIfStale();
    if (Date.now() > deadline) {
      throw new Error(
        `commit lock (${LOCK_PATH}) held past ${STALE_MS * 2}ms — a stuck verify or a bug in lock release`,
      );
    }
    // Synchronous sleep: Atomics.wait blocks the thread without a promise,
    // matching this module's fully-synchronous call chain.
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, POLL_MS);
  }
  try {
    return fn();
  } finally {
    try {
      unlinkSync(LOCK_PATH);
    } catch {
      // Already gone (stolen as stale while we held it past STALE_MS,
      // which the deadline check above should prevent, but releasing a
      // lock that's already gone must not throw over the real result).
    }
  }
}
```

</details>

**依据 7 · 源码核查**：[src/db/crossBranch.mjs:72-95](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/crossBranch.mjs#L72-L95)

实际本地git log --all仅subject。

<details>
<summary>查看原文（24行）</summary>

```text
function subjectCountsFrom(gitArgs) {
  let output;
  try {
    output = execSync(`git log ${gitArgs} --topo-order --format=%H%x00%s`, { encoding: 'utf8' });
  } catch {
    // No commits reachable from the requested ref set yet (a brand-new
    // repo, or — for the current-branch-only call — a worktree whose
    // branch predates its very first commit). Every subject is absent,
    // which is the correct, honest answer.
    return new Map();
  }
  const counts = new Map();
  for (const line of output.split('\n')) {
    if (!line) continue;
    const [, subject] = line.split('\0');
    if (subject === undefined) continue;
    counts.set(subject, (counts.get(subject) ?? 0) + 1);
  }
  return counts;
}

function loadAllBranchesSubjectCounts() {
  return subjectCountsFrom('--all');
}
```

</details>

**依据 8 · 源码核查**：[src/db/crossBranch.mjs:128-166](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/crossBranch.mjs#L128-L166)

排重和reopen规则索引。

<details>
<summary>查看原文（39行）</summary>

```text
// `db` is read only for `tasks.commit_message` grouping — never written.
export function buildCrossBranchIndex(db) {
  const tasks = db.prepare('SELECT id, commit_message, status FROM tasks').all();
  const messageCounts = new Map();
  const statusByMessage = new Map();
  for (const task of tasks) {
    messageCounts.set(task.commit_message, (messageCounts.get(task.commit_message) ?? 0) + 1);
    statusByMessage.set(task.commit_message, task.status);
  }

  const subjectCounts = loadAllBranchesSubjectCounts();
  const currentBranchCounts = loadCurrentBranchSubjectCounts();
  const resolvableMessages = new Set();
  for (const [message, taskCount] of messageCounts) {
    if (taskCount !== 1) continue; // ambiguous in THIS graph — see header comment
    const total = subjectCounts.get(message) ?? 0;
    if (total === 0) continue; // not seen on any branch
    const onThisBranch = currentBranchCounts.get(message) ?? 0;
    // Reopen guard (see loadCurrentBranchSubjectCounts): if every
    // occurrence of this subject anywhere (`total`) is already accounted
    // for on THIS branch (`onThisBranch >= total`) and the task is still
    // not `complete` here, there is no occurrence anywhere else to credit
    // — the one this branch already has is exactly the completion a
    // Correction Protocol reopen (claim.mjs#reopenTask) superseded, and
    // `--all` has nothing further to offer. Strictly fewer occurrences on
    // this branch than `total` means at least one occurrence exists on
    // SOME other branch this worktree cannot otherwise see, which is
    // exactly the genuine cross-branch completion this module exists to
    // surface — trusted even when this branch also independently carries
    // its own earlier, now-superseded copy of the same subject.
    if (onThisBranch >= total && statusByMessage.get(message) !== 'complete') {
      continue;
    }
    resolvableMessages.add(message);
  }

  return { resolvableMessages };
}

```

</details>

**依据 9 · 源码核查**：[src/db/reconcile.mjs:418-439](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/reconcile.mjs#L418-L439)

真实人工reconcile非leased任务直接complete。

<details>
<summary>查看原文（22行）</summary>

```text
export function applyReconciliation(db, record) {
  applySchema(db);

  const task = db.prepare('SELECT id, status FROM tasks WHERE id = ?').get(record.task);
  if (!task) throw new Error(`no such task: ${record.task}`);
  if (task.status === 'complete') return { taskId: record.task, unlocked: [], alreadyComplete: true };
  if (task.status === 'building' || task.status === 'verifying') {
    throw new Error(
      `Task ${record.task} is leased (${task.status}) — release it with \`hedgehog release ${record.task} --owner <owner>\` before reconciling it.`,
    );
  }

  let unlocked;
  db.exec('BEGIN IMMEDIATE');
  try {
    db.prepare(
      "UPDATE tasks SET status = 'complete', blocked_reason = NULL WHERE id = ?",
    ).run(record.task);
    db.prepare('INSERT INTO decisions (task_id, note) VALUES (?, ?)').run(
      record.task,
      reconciledNote(record),
    );
```

</details>

**依据 10 · 源码核查**：[src/db/reconcile.mjs:508-538](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/reconcile.mjs#L508-L538)

实际reason/evidence文件→apply人工完成。

<details>
<summary>查看原文（31行）</summary>

```text
export async function confirmReconciliation(
  db,
  { taskId, reason, evidence },
  reconciledDir = RECONCILED_DIR,
) {
  if (!taskId) throw new Error('reconcile requires a task id');
  if (!reason) throw new Error('reconcile requires a --reason');

  const id = taskId.toUpperCase();
  const task = db.prepare('SELECT id, status FROM tasks WHERE id = ?').get(id);
  if (!task) throw new Error(`no such task: ${id}`);
  if (task.status === 'complete') {
    throw new Error(`Task ${id} is already complete — there is nothing to reconcile.`);
  }

  const record = validateReconciled(
    {
      task: id,
      reason,
      confirmed_at: new Date().toISOString(),
      evidence: {
        commits: evidence?.commits ?? [],
        paths: evidence?.paths ?? [],
      },
    },
    '(new reconciliation)',
  );

  await writeReconciledFile(record, reconciledDir);
  const applied = applyReconciliation(db, record);
  return { record, ...applied };
```

</details>

**依据 11 · 源码核查**：[src/db/gate.mjs:114-149](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/gate.mjs#L114-L149)

gate诊断/active及明确no-verify退路。

<details>
<summary>查看原文（36行）</summary>

```text
  if (!script.includes(ASSERT_MARKER)) {
    return {
      applicable: true,
      state: 'fails-open',
      detail:
        'The installed hook predates assert_lefthook_installed — it exits 0 ' +
        'when lefthook is missing, so commits land ungated.',
      repair: 'pnpm dlx lefthook install   (regenerates the hook fail-closed)',
    };
  }

  if (!(await lefthookBinaryPresent(projectRoot))) {
    return {
      applicable: true,
      state: 'binary-missing',
      detail:
        'The hook is fail-closed, so it will refuse commits until lefthook ' +
        'is back — nothing is landing ungated, but nothing can land at all.',
      repair: 'pnpm install',
    };
  }

  return { applicable: true, state: 'active' };
}

// Plain text, colouring left to the caller — same split as formatStatus.
// Returns null when there's nothing worth printing.
export function formatCommitGate(gate) {
  if (!gate || !gate.applicable) return null;
  if (gate.state === 'active') return 'COMMIT GATE  active';

  const lines = ['COMMIT GATE  NOT ENFORCING', '', `  ${gate.detail}`, ''];
  lines.push(`  Restore it with: ${gate.repair}`);
  lines.push('  To commit anyway, deliberately: git commit --no-verify');
  return lines.join('\n');
}
```

</details>

#### 缺口

- 未审所有rebuild/reconcile/worktree/merge与长lease竞态/断电/Git hooks，未运行失败恢复。
  **影响**：持久/历史可帮助重建，不是原子外部事务/取消或不可绕门。
  **进一步探讨**：副本测试commit已成DB失败、lease超时与异branch同subject，分别核真实树/进程和台账；未知停新claim，人工决定恢复。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何最小采用，成本和退出是什么？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

有重复开发任务、愿意明确intent/scope/verify与审Git的维护者，可在可弃置新仓固定6.7.0，先不装外部core，审一自写无害core/一intent/一层、空index/无别人修改、单owner单任务；确认init会写文件/可能git init，verify会执行shell并commit，事先授权才做未来试验。本轮只读没有执行这些动作。Host Agent权限/模型账号自行控制，不因角色prompt有只读词就信任。

首次需Node>=22.5 node:sqlite、Git、相应宿主、core与npm/tar/构建工具；持续模型Token/上下文清理、测试/生成/磁盘/日志、外部core下载和人工需求/图/失败/差异审查均有成本，金额/时间未知。README省Token/快建未验证，依赖图/模板节步骤不自动改服务供给成本结构。并发增加模型/资源与恢复面，首试不并行/worktree/issue发布。

合格是任务完成真实用户目标、测试命令足够、commit只含预期文件和DB/文件一致；noop/手工reconcile要单独注明。遇scope/verify失败、长命令/过期/外部改动先查真实进程与index/HEAD再处理，勿只retry清状态。退出停Agent/命令、释放任务/保存需要的intent/core/记录，再按生成文件清单移除本工具内容，不能一删AGENTS/CLAUDE盖掉原项目文档；需要人工diff恢复。相对原清单+测试+手工Git没有质量/维护净收益就不用。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:13-16](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/package.json#L13-L16)

实际CLI命令。

```text
  "bin": {
    "hedgehog": "bin/cli.mjs"
  },
  "scripts": {
```

**依据 2 · 源码核查**：[package.json:31-34](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/package.json#L31-L34)

Node最低声明。

```text
  ],
  "engines": {
    "node": ">=22.5.0"
  },
```

**依据 3 · 源码核查**：[bin/cli.mjs:914-1004](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/bin/cli.mjs#L914-L1004)

init真实写入顺序与冲突例外。

<details>
<summary>查看原文（91行）</summary>

```text
async function init({ force, core, host = DEFAULT_HOST, hostOnly = false, globalInstall = null }) {
  ensureGitRepo();

  // Resolve the full list of writes up front so we can detect conflicts
  // before touching anything. A deferred install plans against `null` —
  // the shared agents/skills/build-graph payload only.
  const groups = [];
  for (const entry of plan(core, host, { hostOnly })) {
    const files = await plannedFiles(entry);
    groups.push({ entry, files });
  }

  // A generated file is derived from the payload rather than authored in
  // the project, so rewriting it loses nothing and never counts as a
  // conflict — that's what lets a second host be added to a project the
  // first one already set up.
  //
  // A deferred (coreless) install's root-instructions merge is exempted
  // too, but only when the existing file is a brownfield one: hand-written
  // content with no {{PROJECT_NAME}} shell marker. That file was never a
  // Hedgehog shell to overwrite — writePlannedFile leaves it untouched,
  // for hedgehog-adopt's own merge step to append its delimited core
  // section into later (src/hosts/claude-md-merge.mjs), once a core is
  // actually known. A file still carrying {{PROJECT_NAME}} (a previous
  // deferred init's untouched shell) is not brownfield content and keeps
  // hitting the ordinary conflict/--force path below.
  const conflicts = [];
  for (const { entry, files } of groups) {
    if (entry.type === 'generated') continue;
    for (const f of files) {
      if (!(await exists(f.dest))) continue;
      if (core === null && f.merge) {
        const existing = await readFile(f.dest, 'utf8');
        if (!existing.includes('{{PROJECT_NAME}}')) continue;
      }
      conflicts.push(f.dest);
    }
  }

  if (conflicts.length && !force) {
    console.error(`\n${red(bold('Refusing to overwrite existing files.'))}\n`);
    for (const c of conflicts) {
      console.error(`  ${yellow('exists')}  ${relative(DEST_ROOT, c) || c}`);
    }
    console.error(
      `\nRe-run with ${bold('--force')} to overwrite, or move these aside first.\n`,
    );
    process.exitCode = 1;
    return;
  }

  // Recorded before anything is written: the routing doc is generated
  // from this list, so it has to already name the host being installed.
  await recordHosts(DEST_ROOT, [host]);
  await recordVersion(DEST_ROOT, PKG_VERSION);
  if (core) await recordCore(DEST_ROOT, { name: core.manifest.name, version: core.version });

  let written = 0;
  let overwritten = 0;
  for (const { files } of groups) {
    for (const f of files) {
      const already = await exists(f.dest);
      // Brownfield CLAUDE.md on the coreless path: writePlannedFile
      // leaves it untouched (see its own comment) rather than overwriting
      // it, so this write must not be logged or counted as one.
      const before = already && f.merge ? await readFile(f.dest, 'utf8') : null;
      await writePlannedFile(f);
      if (before !== null && (await readFile(f.dest, 'utf8')) === before) {
        console.log(`  ${dim('keep')}  ${relative(DEST_ROOT, f.dest)}`);
        continue;
      }
      if (already) overwritten++;
      else written++;
      const label = already ? yellow('overwrite') : green('create');
      console.log(`  ${label}  ${relative(DEST_ROOT, f.dest)}`);
    }
  }

  const { created: dbCreated, path: dbPath } = await dbInit(DB_PATH);
  console.log(`  ${dbCreated ? green('create') : dim('exists')}  ${dbPath}`);
  if (dbCreated) written++;

  const gitignore = await ensureGitignore();
  if (gitignore.added.length) {
    console.log(`  ${green('update')}  ${relative(DEST_ROOT, gitignore.path)} ${dim(`(${gitignore.added.length} entries)`)}`);
  }

  console.log(
    `\n${green(bold('Hedgehog installed.'))} ${dim(
      `${written} created${overwritten ? `, ${overwritten} overwritten` : ''}`,
    )}\n`,
```

</details>

**依据 4 · 源码核查**：[src/db/verify.mjs:304-312](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/verify.mjs#L304-L312)

配置验证命令是实际shell执行。

```text
function runVerifyCommand(command) {
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    return { exitCode: 0, output };
  } catch (err) {
    const output = `${err.stdout ?? ''}${err.stderr ?? ''}` || err.message;
    return { exitCode: err.status ?? 1, output };
  }
}
```

**依据 5 · 源码核查**：[src/db/verify.mjs:335-339](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/verify.mjs#L335-L339)

会自动提交。

```text
function commitTouchedPaths(paths, commitMessage) {
  git(['add', '--', ...paths], { stdio: 'pipe' });
  git(['commit', '-m', commitMessage], { stdio: 'pipe' });
  return git(['rev-parse', 'HEAD']).trim();
}
```

**依据 6 · 源码核查**：[src/skills/hedgehog-orchestrating/SKILL.md:38-43](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/skills/hedgehog-orchestrating/SKILL.md#L38-L43)

测试非用户目标覆盖。

```text
of what was asked — a layer that builds half the intent and tests that
half exhaustively is green. Build the layer's share of the goal, and say
so when the packet doesn't account for something the goal asks for.
When `hedgehog verify` closes the **last** layer of an intent it prints
that goal and outcome back as an **INTENT CHECK**: read the built work
against it there, because nothing else in the build does.
```

**依据 7 · 源码核查**：[src/db/claim.mjs:281-296](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/claim.mjs#L281-L296)

台账过期不终止执行者。

<details>
<summary>查看原文（16行）</summary>

```text
export function reapExpiredLeases(db) {
  const rows = db
    .prepare(
      `
    UPDATE tasks
    SET status = 'blocked', blocked_reason = 'lease_expired',
        lease_owner = NULL, lease_expires_at = NULL, leased_at = NULL,
        claim_snapshot = NULL
    WHERE status IN ('building', 'verifying') AND lease_expires_at < datetime('now')
    RETURNING id
  `,
    )
    .all();
  return new Set(rows.map((r) => r.id));
}

```

</details>

#### 缺口

- 未安装/运行模型/构建或测维护收益、core/宿主兼容和完整清理。
  **影响**：只给可控单任务试用，不给生产TDD质量/省token保证。
  **进一步探讨**：先人工批准副本一层命令/commit范围，记录总Token/返工/误提交/恢复工时，对照手工基线再考虑扩大。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 可迁移机制和未验证的新方向是什么？

**研究主题**：贡献与相对优势、新假设与验证

#### 完整回答

可迁移贡献是需求/依赖/范围/租约/验证/commit记录组成一个可查询交接单元，协调者不靠Agent报done；正常流程确实改变任务分派与检验职责。但noop、reconcile和跨branch满足也存在，不能把所有complete当同一强度证据。已有commit gate诊断、noop标志和intent check，泛泛“加完成收据”没有增量。

候选收窄为验证提交前的index归属核对：列本次将commit的完整index，若有非本task或非本次明确许可的staged内容则拒绝，不替用户自动reset/丢别人的暂存。与现在范围diff+合作锁/人工git diff --cached对照：干净单任务、claim前已暂存异scope、测试写出异scope三副本，测误归属commit、正常任务误拒、人工恢复时间。若现有Host/hook已经可靠拒绝或完整index提示只制造噪声，而手工审更简单，则推翻。该方向尚未实现/复现，不计现版技术/业务得分；目标业务验收仍另做。

#### 证据与依据

**依据 1 · 源码核查**：[src/db/verify.mjs:335-339](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/verify.mjs#L335-L339)

指定add后无pathspec commit。

```text
function commitTouchedPaths(paths, commitMessage) {
  git(['add', '--', ...paths], { stdio: 'pipe' });
  git(['commit', '-m', commitMessage], { stdio: 'pipe' });
  return git(['rev-parse', 'HEAD']).trim();
}
```

**依据 2 · 源码核查**：[src/db/verify.mjs:479-487](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/verify.mjs#L479-L487)

pre-existing dirty归因排除。

```text
    // Only what changed during this task's lease is this task's to answer
    // for; everything else in the shared working tree was already there
    // when the task was handed out. The commit set below is deliberately
    // *not* filtered this way — it is scope-restricted already, and a
    // pre-existing dirty file inside the task's own scope is still swept
    // into the layer's commit exactly as before.
    const touchedNow = attributedToTask(changedPaths(), task.claim_snapshot);
    return splitByScope(db, taskId, touchedNow, scopeGlobs);
  });
```

**依据 3 · 源码核查**：[src/db/verify.mjs:582-594](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/verify.mjs#L582-L594)

commit前仅重读in-scope，非完整index归属核对。

<details>
<summary>查看原文（13行）</summary>

```text
  // a state transition this one deliberately doesn't make.
  let touched, kindByPath, commitSha;
  try {
    ({ touched, kindByPath, commitSha } = withCommitLock(() => {
      const inScope = changedPaths(scopeGlobs.map((glob) => `:(glob)${glob}`));
      return {
        touched: inScope,
        kindByPath: classifyArtifacts(inScope),
        commitSha:
          inScope.length > 0
            ? commitTouchedPaths(inScope, task.commit_message)
            : commitNoOpLayer(task.commit_message),
      };
```

</details>

**依据 4 · 源码核查**：[src/db/commitLock.mjs:56-77](https://github.com/skyf0xx/hedgehog/blob/f713f2df9bb15e2dd1bde5ae2725ee2a6b00ca83/src/db/commitLock.mjs#L56-L77)

合作锁只包callback而非外部写。

<details>
<summary>查看原文（22行）</summary>

```text
    stealIfStale();
    if (Date.now() > deadline) {
      throw new Error(
        `commit lock (${LOCK_PATH}) held past ${STALE_MS * 2}ms — a stuck verify or a bug in lock release`,
      );
    }
    // Synchronous sleep: Atomics.wait blocks the thread without a promise,
    // matching this module's fully-synchronous call chain.
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, POLL_MS);
  }
  try {
    return fn();
  } finally {
    try {
      unlinkSync(LOCK_PATH);
    } catch {
      // Already gone (stolen as stale while we held it past STALE_MS,
      // which the deadline check above should prevent, but releasing a
      // lock that's already gone must not throw over the real result).
    }
  }
}
```

</details>

#### 缺口

- 未复现实际夹带及核所有外层CLI/hook是否拦，用户误提交流程未知。
  **影响**：只能提条件风险与小验证，不能宣称每次夹带或必需新锁系统。
  **进一步探讨**：先三副本人工检查现有index拒绝情况，只有误归属下降且不破坏别人暂存才做只读检查原型。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
