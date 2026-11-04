# Supergraph

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[cb88ce2](https://github.com/datit309/supergraph/tree/cb88ce23a68df1fb5434b8beee45df9cdcb996ba)

<!-- BEGIN META -->
[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/datit309/supergraph) [![npm 30d 69](https://img.shields.io/static/v1?label=npm+30d&message=69&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/supergraph) [![最新发布 2017-11-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2017-11-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/supergraph)
<!-- END META -->

> **功能**：为编码 Agent 集成工程工作流、代码图上下文和协作工具，包含 DSH Host 与客户端接入。

> **亮点**：把图状态检查接入工程工作流，并要求缓存仍可复查。图和 LSP 能力继承各自上游。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：HEAD 一致不能单独覆盖未提交文件，索引可用也不等于影响面完整。外部 MCP 和宿主权限应单独核查。见 [Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 固定版本如何进入 DSH 的日常改动流程？](#detail-section-11)
  - [Q02 · 图上下文如何避免盲用缓存？](#detail-section-12)
  - [Q03 · 怎样限制首次试用和常驻服务？](#detail-section-13)
  - [Q04 · 图辅助何时值得用于影响分析？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要核对跨模块改动的开发者可用图索引辅助定位，再回到源码和测试核实。

对照 Git 搜索、手工影响面列表和测试。局部改动的索引成本可能高于收益。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 工作流 Skill | 组织变更步骤 | 依赖 Agent 执行 |
| 图上下文检查 | 复用前核对状态 | 不能替代真实 diff |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| DSH Profile | 加载包与 Skill | 固定版本待实机 |
| 图 MCP | 提供仓库状态 | 回读服务与缓存 |

| 步骤 | 操作 | 失败处理 |
| --- | --- | --- |
| 准备 | 选隔离仓库并核对 MCP | 拒绝未知网络范围 |
| 扫描 | 复查图状态和 Git diff | 无法复核即回到人工 |

**效果与成本**

| 阶段 | 负担 | 计量 |
| --- | --- | --- |
| 首次 | 配环境及索引 | 记录配置时间 |
| 持续 | 重索引和验证 | 记录调用与人时 |
| 恢复 | 移除并回读 Profile | 独立检查缓存 |

| 结果 | 判据 | 边界 |
| --- | --- | --- |
| 影响面 | 关键依赖能回查 | 未测召回 |

> **思考**：HEAD 一致不能单独覆盖未提交文件，索引可用也不等于影响面完整。外部 MCP 和宿主权限应单独核查。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把图状态检查接入工程工作流，并要求缓存仍可复查。图和 LSP 能力继承各自上游。见 [Q01](#research-q01)、[Q02](#research-q02)。

清单引用包内 patch，Host 注册 Skill，图 freshness 由流程显式核对。

<a id="detail-section-5"></a>

### 1.4 主要限制

HEAD 一致不能单独覆盖未提交文件，索引可用也不等于影响面完整。外部 MCP 和宿主权限应单独核查。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

在隔离 Profile 只试一个项目的扫描，核对图结论与实际改动；失败即回到 Git diff 与测试。见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核对 DSH 接线和 Scan 指令。实际触发、索引召回和宿主兼容待验证。

- 已检查：作者 README、包清单、源码路径 package.json、plugins/supergraph/cordis.patch.yml、plugins/supergraph/index.js、README.md、plugins/supergraph/skills/scan/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查实际 DSH 包、Host 入口和 Scan；未验证上游图算法、全部技能、浏览器或调度器。
- 下一步：先核对进程、工具与卸载，再对比干净 HEAD 和未提交变更。

**分析版本**

- **仓库**：[datit309/supergraph](https://github.com/datit309/supergraph)
- **版本号**：2.4.0（[固定提交 cb88ce2](https://github.com/datit309/supergraph/tree/cb88ce23a68df1fb5434b8beee45df9cdcb996ba)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

将图辅助和 Git 搜索在同一跨模块任务上配对比较，记录关键依赖漏项和总人时。见 [Q04](#research-q04)。

先核对进程、工具与卸载，再对比干净 HEAD 和未提交变更。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 422 | 43533 | — | — | 484841 |
| .ts | source | 47 | 7123 | 4775 | 1763 | — |
| .js | source | 26 | 11917 | 10751 | 384 | — |
| .mjs | source | 15 | 2603 | 2004 | 423 | — |
| .tsx | source | 269 | 56658 | 47576 | 8624 | — |
| .ts | test | 1 | 181 | 146 | 16 | — |
| .cjs | source | 2 | 88 | 85 | 4 | — |
| .mjs | test | 16 | 2084 | 1679 | 146 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/datit309/supergraph/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/datit309/supergraph/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/datit309/supergraph/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：依赖图与宿主编排能否帮助维护者核对跨模块改动，图数据或宿主条件失败时如何退回？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 固定版本如何进入 DSH 的日常改动流程？

**研究主题**：场景与需求、功能与机制、工程质量与复用

#### 完整回答

需要处理跨模块变更的维护者，可在 DSH 内从仓库扫描进入规划与验证，而不必手工逐次查找所有工作流文件。根包 2.4.0 分别导出 Host 与 Client，DSH manifest 明确指向包内 patch。该 patch 装 Supergraph 本体、Codebase Memory 和 Serena 等 MCP；Host 以 skills provider 扫描子目录入口。README 的 scan、analyze、plan、TDD、execute、fix、verify、review 是工作流设计，不能由接线推出宿主强制每一步。手工脚本和 Git 搜索仍可作为对照。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-18](https://github.com/datit309/supergraph/blob/cb88ce23a68df1fb5434b8beee45df9cdcb996ba/package.json#L2-L18)

固定入口和可执行文件

<details>
<summary>查看原文（17行）</summary>

```text
  "name": "supergraph",
  "version": "2.4.0",
  "description": "Evidence-gated engineering workflows, 7 specialized subagents, and native Rust CDP browser/API automation for AI coding agents",
  "type": "module",
  "main": "./plugins/supergraph/index.js",
  "exports": {
    ".": "./plugins/supergraph/index.js",
    "./client": "./plugins/supergraph/client.js",
    "./package.json": "./package.json"
  },
  "bin": {
    "sg-team-mcp": "./plugins/supergraph/bin/sg-team-mcp.js",
    "sg-team-ui": "./plugins/supergraph/bin/sg-team-ui.js",
    "sg-team-status": "./plugins/supergraph/bin/sg-team-status.js",
    "sg-browser-mcp": "./plugins/supergraph/bin/sg-browser-mcp.js",
    "sg-wda-mcp": "./plugins/supergraph/bin/sg-wda-mcp.js",
    "sg-uiautomator2-mcp": "./plugins/supergraph/bin/sg-uiautomator2-mcp.js",
```

</details>

**依据 2 · 源码核查**：[package.json:29-42](https://github.com/datit309/supergraph/blob/cb88ce23a68df1fb5434b8beee45df9cdcb996ba/package.json#L29-L42)

实际使用的 DSH manifest

<details>
<summary>查看原文（14行）</summary>

```text
  "dsh": {
    "manifestVersion": 1,
    "bundle": {
      "patch": "./plugins/supergraph/cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": [
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-sidebar-right",
        "@deepseek-ai/dsh-client-ui-session"
      ]
```

</details>

**依据 3 · 源码核查**：[plugins/supergraph/cordis.patch.yml:2-27](https://github.com/datit309/supergraph/blob/cb88ce23a68df1fb5434b8beee45df9cdcb996ba/plugins/supergraph/cordis.patch.yml#L2-L27)

本体与两个 MCP 进程配置

<details>
<summary>查看原文（26行）</summary>

```text
- insert:
    - id: supergraph
      name: supergraph
    - id: mcp-codebase-memory
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: codebase-memory
        transport: stdio
        command: codebase-memory-mcp
        args: []
        reconnect:
          enabled: true
          maxAttempts: 20
          initialDelayMs: 1000
          maxDelayMs: 30000
    - id: mcp-serena
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: serena
        transport: stdio
        command: serena
        args: ['start-mcp-server', '--context=codex', '--project-from-cwd']
        reconnect:
          enabled: true
          maxAttempts: 20
          initialDelayMs: 1000
```

</details>

**依据 4 · 源码核查**：[plugins/supergraph/index.js:31-55](https://github.com/datit309/supergraph/blob/cb88ce23a68df1fb5434b8beee45df9cdcb996ba/plugins/supergraph/index.js#L31-L55)

Host 注册 Skill provider

<details>
<summary>查看原文（25行）</summary>

```text
export function apply(ctx) {
  const root = fileURLToPath(new URL('.', import.meta.url))
  const skillsDir = path.join(root, 'skills')

  const skillsService = ctx.get('skills') ?? ctx.skills
  if (skillsService && fs.existsSync(skillsDir)) {
    skillsService.registerProvider(() => ({
      name: 'supergraph',
      async list() {
        const entries = fs.readdirSync(skillsDir, { withFileTypes: true })
        const candidates = []
        for (const ent of entries) {
          if (!ent.isDirectory()) continue
          const skillFile = path.join(skillsDir, ent.name, 'SKILL.md')
          if (!fs.existsSync(skillFile)) continue
          try {
            const raw = fs.readFileSync(skillFile, 'utf8')
            const { description, name: parsedName } = parseSkill(raw)
            candidates.push({
              name: parsedName || ent.name,
              description: description || `Supergraph ${ent.name} skill`,
              invocation: { modelInvocable: true, userInvocable: true },
              provider: 'supergraph',
              source: 'bundled',
              rank: 350,
```

</details>

**依据 5 · 作者声明**：[README.md:11-21](https://github.com/datit309/supergraph/blob/cb88ce23a68df1fb5434b8beee45df9cdcb996ba/README.md#L11-L21)

工作流与归属说明

<details>
<summary>查看原文（11行）</summary>

```text
## What Supergraph Does

Every non-trivial change follows the strict engineering lifecycle:

`scan → analyze → plan → TDD → execute → fix → verify → review`

- **Knowledge Graph & Code Intelligence**: Powered by [Codebase Memory MCP](https://github.com/DeusData/codebase-memory-mcp) (`>= 0.10.8,<0.11.0`). Indexes repository state locally into `.codebase-memory/graph.db.zst` (cache in `~/.cache/codebase-memory-mcp`) via `index_repository`, providing mathematical blast radius, call hierarchy, dependency cycles, and test gaps. [Serena](https://github.com/oraios/serena) provides LSP-level symbol navigation and diagnostics.
- **7-Subagent Specialized Architecture**: Autonomous separation of concerns — `plan-writer` (planning), `plan-reviewer` (spec checks), `executor` (TDD execution), `qa-tester` (E2E browser/API testing), `security-auditor` (OWASP/Vibesec AppSec), `diagnostician` (root-cause debugging), and `code-reviewer` (independent merge verdict).
- **Autonomous Human Browser Agent & QA (`browser-agent`)**: Native Rust CDP (`agent-browser`, zero Playwright). Uses compact accessibility tree snapshots (`@ref`), bypasses anti-bot walls via real user profiles, generates 5-dimension ISTQB test matrices (UI + API + DB fault injection), and exports structured bug reports.
- **Unified Mobile Automation & Real Device QA (`mobile-agent`)**: Direct native REST control for iOS (via Appium `WebDriverAgent` / port 8100) and Android (via Appium `UiAutomator2 Server` / port 6790) without heavy Appium middleware. Generates compact token-efficient accessibility trees (`@ref`), handles hardware keys/back button, soft keyboards, permission dialogs, delta snapshots, and real device screenshots.
- **Multi-Agent Orchestration (`supergraph-team`)**: Wave DAG task scheduling with isolated Git worktrees and live dashboard (`:3333`).
```

</details>

#### 缺口

- 未在同版 DSH 验证 provider 或 Client
  **影响**：不能确认各 Profile 可见性或流程触发率
  **进一步探讨**：用隔离 Profile 核对加载、发现 Skill 和开启一次扫描

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 图上下文如何避免盲用缓存？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

Scan 指令以仓库绝对路径和分支为上下文，复用要求状态 ready、分支和 HEAD 一致、索引时刻在十分钟内，命中仍复查服务。缺失、退化或更换分支要求重新索引，必需 provider/schema 失败则停止且不写新鲜状态。其可迁移增量是按可核条件复用分析上下文，相比只拿上次缓存多一组验证；实现图索引和 LSP 的是上游服务。指令仍依赖 Agent 正确执行，也不能由 HEAD 不变推断工作树未改，未提交文件是否进图必须另查。小改动直接读文件可绕开索引成本。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/supergraph/skills/scan/SKILL.md:14-29](https://github.com/datit309/supergraph/blob/cb88ce23a68df1fb5434b8beee45df9cdcb996ba/plugins/supergraph/skills/scan/SKILL.md#L14-L29)

项目和分支上下文

<details>
<summary>查看原文（16行）</summary>

```text
## 1. Detect project and branch

Use `git branch --show-current`, resolve the repository to an **absolute** path,
and run `bin/detect-project.sh` when present. Otherwise detect commands from:

| File | Type | Test | Lint | Format | Build |
|---|---|---|---|---|---|
| `package.json` | node | `npm test --` | `npx eslint .` | `npx prettier --write .` | `npm run build` |
| `Cargo.toml` | rust | `cargo test` | `cargo clippy` | `cargo fmt` | `cargo build` |
| `pyproject.toml` | python | `pytest` | `ruff check .` | `ruff format .` | `python -m build` |
| `go.mod` | go | `go test ./...` | `golangci-lint run` | `gofmt -w .` | `go build ./...` |
| `pubspec.yaml` | flutter | `flutter test` | `flutter analyze` | `dart format .` | `flutter build` |

Ask when none match; never guess commands. Derive one stable `CBM_PROJECT` from
the repository root name and retain it across branches. Default
`CBM_INDEX_MODE=moderate`.
```

</details>

**依据 2 · 源码核查**：[plugins/supergraph/skills/scan/SKILL.md:31-46](https://github.com/datit309/supergraph/blob/cb88ce23a68df1fb5434b8beee45df9cdcb996ba/plugins/supergraph/skills/scan/SKILL.md#L31-L46)

新鲜判据与失败退出

<details>
<summary>查看原文（16行）</summary>

```text
## 2. Verify provider and freshness

1. Call `list_projects` and find `CBM_PROJECT`.
2. If found, call `index_status(project=CBM_PROJECT)`.
3. Treat missing project, changed branch, stale state, tool error, failed state,
   or `status: "degraded"` as requiring a new index.
4. **TTL reuse (10m):** If `index_status` returns `status: "ready"` and `BRANCH` matches `.supergraph-env:BRANCH` and `now - CBM_INDEXED_AT < 600s` and `head_sha` unchanged, reuse index — skip `index_repository`. Otherwise proceed to step 5. TTL check requires healthy `index_status`; never cache degraded/stale/error. On cache hit, still re-run `index_status` once to confirm liveness before `get_graph_schema`.
5. Call `index_repository(repo_path=<absolute repo path>, name=CBM_PROJECT,
   mode=CBM_INDEX_MODE)` when required (cache miss or stale/degraded). Require `status: "indexed"`.
6. Re-run `index_status`; never claim reuse without a healthy response.
7. Call `get_graph_schema(project=CBM_PROJECT)` and `get_architecture(project=CBM_PROJECT, aspects=["overview","layers","boundaries","clusters","hotspots"])` **in parallel** after verified `index_status`.
8. On cache hit, `get_graph_schema` and `get_architecture` may run in parallel immediately after TTL-passed `index_status`.

On any mandatory provider/index/schema error: STOP, show the exact error and the
recovery command (`codebase-memory-mcp cli index_repository --repo-path
<absolute> --name <project> --mode moderate`). Do not write freshness state.
```

</details>

**依据 3 · 作者声明**：[README.md:13-18](https://github.com/datit309/supergraph/blob/cb88ce23a68df1fb5434b8beee45df9cdcb996ba/README.md#L13-L18)

外部索引和 LSP 归属

```text
Every non-trivial change follows the strict engineering lifecycle:

`scan → analyze → plan → TDD → execute → fix → verify → review`

- **Knowledge Graph & Code Intelligence**: Powered by [Codebase Memory MCP](https://github.com/DeusData/codebase-memory-mcp) (`>= 0.10.8,<0.11.0`). Indexes repository state locally into `.codebase-memory/graph.db.zst` (cache in `~/.cache/codebase-memory-mcp`) via `index_repository`, providing mathematical blast radius, call hierarchy, dependency cycles, and test gaps. [Serena](https://github.com/oraios/serena) provides LSP-level symbol navigation and diagnostics.
- **7-Subagent Specialized Architecture**: Autonomous separation of concerns — `plan-writer` (planning), `plan-reviewer` (spec checks), `executor` (TDD execution), `qa-tester` (E2E browser/API testing), `security-auditor` (OWASP/Vibesec AppSec), `diagnostician` (root-cause debugging), and `code-reviewer` (independent merge verdict).
```

#### 缺口

- 未验证上游索引是否覆盖未提交变更
  **影响**：可能误判待审文件不在影响面
  **进一步探讨**：同 HEAD 修改工作树后比较图与 Git diff

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样限制首次试用和常驻服务？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

选一个测试仓库和隔离 DSH Profile，只验证扫描与证据回查。manifest 还拉起浏览器与团队服务，并有 streamable HTTP 外部 MCP，因此先核对启用的传输、主机和权限；不要将 README 的跨宿主安装脚本视为无状态。首次需要匹配 Node、DSH 和 Codebase Memory，Serena 虽在 README 标可选但默认 patch 含该条目，运行影响待回读。持续会消耗索引时间、模型和日志维护，失败时停下并回到 Git diff 与测试，不以图无记录作为无影响。卸载要检查实际 Profile 的子进程和缓存，费用与人工时间分开记录。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:40-57](https://github.com/datit309/supergraph/blob/cb88ce23a68df1fb5434b8beee45df9cdcb996ba/README.md#L40-L57)

作者安装方式与审查提示

<details>
<summary>查看原文（18行）</summary>

````text
## Quick Install (One-Command)

macOS, Linux, or WSL (defaults to all platforms):
```bash
curl -fsSL https://raw.githubusercontent.com/datit309/supergraph/master/install.sh | sh
```

Windows PowerShell 5.1+:
```powershell
irm https://raw.githubusercontent.com/datit309/supergraph/master/install.ps1 | iex
```

*Security: Inspect installer scripts before piping remote code into a shell.*

Install for a specific platform:
```bash
curl -fsSL https://raw.githubusercontent.com/datit309/supergraph/master/install.sh | sh -s -- --platform [claude|codex|antigravity|opencode|dsh|all]
```
````

</details>

**依据 2 · 作者声明**：[README.md:74-85](https://github.com/datit309/supergraph/blob/cb88ce23a68df1fb5434b8beee45df9cdcb996ba/README.md#L74-L85)

图、Serena 与附带服务前提

<details>
<summary>查看原文（12行）</summary>

````text
## MCP Setup

```bash
# 1. Codebase Memory MCP (Required)
pip install 'codebase-memory-mcp>=0.10.8,<0.11.0'
codebase-memory-mcp cli index_repository --repo-path "$(pwd)" --name supergraph --mode moderate

# 2. Serena MCP (Optional, LSP symbol navigation)
uv tool install -p 3.13 serena-agent

# 3. Supergraph Team MCP & Browser Agent (Built-in)
# Automatically bundled across all platforms with live dashboard (:3333).
````

</details>

**依据 3 · 源码核查**：[plugins/supergraph/cordis.patch.yml:29-49](https://github.com/datit309/supergraph/blob/cb88ce23a68df1fb5434b8beee45df9cdcb996ba/plugins/supergraph/cordis.patch.yml#L29-L49)

团队 MCP 子进程

<details>
<summary>查看原文（21行）</summary>

```text
    - id: mcp-supergraph-team
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: supergraph-team
        transport: stdio
        command: node
        args:
          - !!js >-
            (() => {
              const path = process.getBuiltinModule('node:path');
              const req = process.getBuiltinModule('node:module').createRequire(baseUrl);
              try {
                return path.join(path.dirname(req.resolve('supergraph/package.json')), 'plugins/supergraph/bin/sg-team-mcp.js');
              } catch {
                return path.join(path.dirname(req.resolve('./package.json')), 'bin/sg-team-mcp.js');
              }
            })()
        reconnect:
          enabled: true
          maxAttempts: 20
          initialDelayMs: 1000
```

</details>

**依据 4 · 源码核查**：[plugins/supergraph/cordis.patch.yml:51-82](https://github.com/datit309/supergraph/blob/cb88ce23a68df1fb5434b8beee45df9cdcb996ba/plugins/supergraph/cordis.patch.yml#L51-L82)

浏览器和外部传输配置

<details>
<summary>查看原文（32行）</summary>

```text
    - id: mcp-supergraph-browser
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: supergraph-browser
        transport: stdio
        command: node
        args:
          - !!js >-
            (() => {
              const path = process.getBuiltinModule('node:path');
              const req = process.getBuiltinModule('node:module').createRequire(baseUrl);
              try {
                return path.join(path.dirname(req.resolve('supergraph/package.json')), 'plugins/supergraph/bin/sg-browser-mcp.js');
              } catch {
                return path.join(path.dirname(req.resolve('./package.json')), 'bin/sg-browser-mcp.js');
              }
            })()
        reconnect:
          enabled: true
          maxAttempts: 20
          initialDelayMs: 1000
          maxDelayMs: 30000
    - id: mcp-ui-skills
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: ui-skills
        transport: streamable-http
        url: https://www.ui-skills.com/mcp
        reconnect:
          enabled: true
          maxAttempts: 20
          initialDelayMs: 1000
```

</details>

#### 缺口

- 未在 Profile 实测卸载与服务回收
  **影响**：不能保证全部进程、缓存和访问面恢复
  **进一步探讨**：记录安装前后服务、端口、网络配置和数据目录

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 图辅助何时值得用于影响分析？

**研究主题**：新假设与验证

#### 完整回答

待验证假设是图上下文可缩小跨模块查找时间并保持关键依赖召回。以同一固定仓库的多模块故障任务比较图辅助与 Git 搜索，隐藏答案并让独立审阅者核查受影响路径，记录漏项、索引时长和人工核对人时。分别覆盖干净 HEAD 和未提交变更。若图组漏掉更重要的依赖，或索引维护抵消时间收益，就保留人工查找。流程文档不等同于对照数据。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/supergraph/skills/scan/SKILL.md:31-46](https://github.com/datit309/supergraph/blob/cb88ce23a68df1fb5434b8beee45df9cdcb996ba/plugins/supergraph/skills/scan/SKILL.md#L31-L46)

可复查的状态与索引分支

<details>
<summary>查看原文（16行）</summary>

```text
## 2. Verify provider and freshness

1. Call `list_projects` and find `CBM_PROJECT`.
2. If found, call `index_status(project=CBM_PROJECT)`.
3. Treat missing project, changed branch, stale state, tool error, failed state,
   or `status: "degraded"` as requiring a new index.
4. **TTL reuse (10m):** If `index_status` returns `status: "ready"` and `BRANCH` matches `.supergraph-env:BRANCH` and `now - CBM_INDEXED_AT < 600s` and `head_sha` unchanged, reuse index — skip `index_repository`. Otherwise proceed to step 5. TTL check requires healthy `index_status`; never cache degraded/stale/error. On cache hit, still re-run `index_status` once to confirm liveness before `get_graph_schema`.
5. Call `index_repository(repo_path=<absolute repo path>, name=CBM_PROJECT,
   mode=CBM_INDEX_MODE)` when required (cache miss or stale/degraded). Require `status: "indexed"`.
6. Re-run `index_status`; never claim reuse without a healthy response.
7. Call `get_graph_schema(project=CBM_PROJECT)` and `get_architecture(project=CBM_PROJECT, aspects=["overview","layers","boundaries","clusters","hotspots"])` **in parallel** after verified `index_status`.
8. On cache hit, `get_graph_schema` and `get_architecture` may run in parallel immediately after TTL-passed `index_status`.

On any mandatory provider/index/schema error: STOP, show the exact error and the
recovery command (`codebase-memory-mcp cli index_repository --repo-path
<absolute> --name <project> --mode moderate`). Do not write freshness state.
```

</details>

#### 缺口

- 未做影响面盲审
  **影响**：无法量化召回和净收益
  **进一步探讨**：先定真值依赖，再做配对比较

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
