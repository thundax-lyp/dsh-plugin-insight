# dsh-ouroboros 配置桥

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[722172e](https://github.com/Q00/ouroboros/tree/722172ef096767583679d04aef5e847458fee6b2/integrations/dsh-plugin)

<!-- BEGIN META -->
[![GitHub ★ 6,299](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C299&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Q00/ouroboros)
<!-- END META -->

> **功能**：通过 DSH MCP client 挂载 Ouroboros 工作流工具。

> **亮点**：可安装的默认配置减少手工接线；上游访谈和执行能力不属于桥自身。[Q01](#research-q01)

> **主要限制**：工具可见不等于后端可调用；动态解析使固定配置不能固定实际执行的引擎版本。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 谁需要此配置桥，其价值与上游边界是什么？](#detail-section-11)
  - [Q02 · 插件如何启动服务并转发配置？](#detail-section-12)
  - [Q03 · 工具可列出是否代表访谈与执行可用？](#detail-section-13)
  - [Q04 · 启动、使用和退出需要哪些资源与核查？](#detail-section-14)
  - [Q05 · 怎样检验版本与后端预检是否改善采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已使用 Ouroboros、希望在 DSH 对话调用的开发者；替代为手写 MCP 配置或直接 CLI。[Q01](#research-q01)

手工编写 MCP stdio 配置或使用独立 CLI。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| MCP 桥 | 同会话调用上游工具 | 宿主与引擎须可用 |
| 环境配置 | 显式选择后端与凭据 | 宿主行为未实测 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| DSH MCP client | 必需 | 挂载工具 | 无桥接 |
| uv、Python 3.12 | 启动必需 | 拉取运行引擎 | 服务不可启动 |
| 对应后端和凭据 | 工作流必需 | 访谈和执行 | 调用失败 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定引擎与宿主 | 核对配置及预算 |
| 访谈 | 非敏感测试任务 | 检查 Seed 与后端 |
| 执行 | 分步执行与评估 | 失败停止并检查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 下载和环境成本 | 版本与后端配置 | 动态引擎未锁 |
| 持续 | 模型和执行费用未知 | 审核产物 | 节约未经验证 |
| 恢复 | 重试可能耗费模型 | 修复后重载 | 自动重连依宿主 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| MCP 接线 | patch 声明启动参数 | 实际工具注册 |
| 规格流程 | 作者描述上游能力 | 访谈与执行成功 |

> **思考**：工具可见不等于后端可调用；动态解析使固定配置不能固定实际执行的引擎版本。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：可安装的默认配置减少手工接线；上游访谈和执行能力不属于桥自身。[Q01](#research-q01)

较长工具超时、显式凭据及启动软失败提供配置默认值，具体宿主清洗和重连行为未核验。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

工具可见不等于后端可调用；动态解析使固定配置不能固定实际执行的引擎版本。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

固定引擎版本、确认凭据与预算，先验证访谈及产物；故障时重载或回退 CLI。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定配置显示命令和显式参数；宿主行为、动态引擎、后端和模型调用本轮未运行。

- 已检查：作者 README、包清单、源码路径 integrations/dsh-plugin/README.md、integrations/dsh-plugin/package.json、integrations/dsh-plugin/cordis.patch.yml 及固定范围 inventory；组件：integrations/dsh-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：子组件 inventory 1 个指定扩展名文件、无排除和解析错误；静态检查 patch、包声明和 README，未运行宿主或上游引擎。
- 下一步：固定宿主与引擎，在隔离项目核验工具注册、访谈后端、执行及故障恢复。

**分析版本**

- **仓库**：[Q00/ouroboros](https://github.com/Q00/ouroboros)
- **版本号**：0.1.0（[固定提交 722172e](https://github.com/Q00/ouroboros/tree/722172ef096767583679d04aef5e847458fee6b2)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：显示实际引擎版本及后端预检可减少首个访谈失败，须对照现有文档测误报和泄露。[Q05](#research-q05)

固定宿主与引擎，在隔离项目核验工具注册、访谈后端、执行及故障恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 128 | — | — | 954 |

</details>

**活跃度**

[![Issue 未关闭 69](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=69&color=737b86&logo=github)](https://github.com/Q00/ouroboros/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定 DSH 配置桥如何挂载 Ouroboros，引擎版本和后端就绪有何边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要此配置桥，其价值与上游边界是什么？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

面向已决定使用 Ouroboros 规格驱动流程、想在 DSH 对话发起而非切换 CLI 的用户。手工等效 MCP 配置或直接 CLI 是基线；本包只声明一个 DSH MCP client 配置，提供超时、环境和启动容错默认值，访谈、Seed、执行与评估引擎属于上游。作者列出的工具数和模型自动选择仅为声明，不能证明宿主和工作流已可用。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-plugin/README.md:3-12](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/integrations/dsh-plugin/README.md#L3-L12)

作者说明配置桥及工作流归属。

<details>
<summary>查看原文（10行）</summary>

```text
Mount [Ouroboros](https://github.com/Q00/ouroboros) — a spec-first AI dev
workflow engine (Socratic interview → Seed spec → execute → evaluate → evolve)
— into [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) as
native tools. Once installed, type `ooo interview <goal>` or `ooo auto <goal>`
directly in the dsh chat — the model finds and calls the matching
`mcp__ouroboros__*` tool on its own.

This is a **config-only bundle**: it contains no custom plugin code, just one
row that mounts dsh's existing `@deepseek-ai/dsh-mcp-client` against
`ouroboros mcp serve`.
```

</details>

**依据 2 · 源码核查**：[integrations/dsh-plugin/package.json:19-26](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/integrations/dsh-plugin/package.json#L19-L26)

发行文件与 patch 入口。

```text
  "files": [
    "cordis.patch.yml",
    "README.md"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
```

**依据 3 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:43-57](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/integrations/dsh-plugin/cordis.patch.yml#L43-L57)

配置一条 MCP stdio 行。

<details>
<summary>查看原文（15行）</summary>

```text
- insert:
    - id: mcp-ouroboros
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: ouroboros
        transport: stdio
        command: uvx
        args:
          - --from
          - 'ouroboros-ai[mcp]'
          - --with
          - 'mcp==2.3.0'
          - ouroboros
          - mcp
          - serve
```

</details>

#### 缺口

- 本轮未运行 DSH、MCP、uvx 或模型
  **影响**：无法证明工具注册、后端可用与真实任务成功
  **进一步探讨**：锁定引擎和宿主版本后用隔离项目核验

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 插件如何启动服务并转发配置？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

patch 插入 DSH MCP client，使用 uvx --from ouroboros-ai[mcp] --with mcp==2.3.0 ouroboros mcp serve；MCP 依赖版本固定而 Ouroboros 包本身未锁，固定本仓提交不固定实际拉取引擎。显式配置两个 API 密钥及选择器，runtime 未设时选 host，超时 1800000 ms，启动错误不致命。环境清洗和配置覆盖是文件注释对宿主的描述，未经本轮宿主实测，凭据仍可能被明确发送至子进程。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:43-57](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/integrations/dsh-plugin/cordis.patch.yml#L43-L57)

命令参数及版本选择。

<details>
<summary>查看原文（15行）</summary>

```text
- insert:
    - id: mcp-ouroboros
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: ouroboros
        transport: stdio
        command: uvx
        args:
          - --from
          - 'ouroboros-ai[mcp]'
          - --with
          - 'mcp==2.3.0'
          - ouroboros
          - mcp
          - serve
```

</details>

**依据 2 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:58-71](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/integrations/dsh-plugin/cordis.patch.yml#L58-L71)

作者描述宿主环境清洗及覆盖。

<details>
<summary>查看原文（14行）</summary>

```text
        # The child does NOT inherit the harness environment wholesale:
        # @deepseek-ai/dsh-subprocess hands mcp-client a scrubbed parent env
        # with every credential-shaped name (/KEY|PASSWORD|SECRET|TOKEN/i) and
        # every DSH_* name removed, precisely so harness credentials never leak
        # into a spawned process implicitly. This explicit layer merges *after*
        # that scrub, so any credential Ouroboros genuinely needs has to be
        # named here. It is deliberately a short allowlist covering the two
        # documented backends — not a wildcard passthrough. To forward another
        # (OPENAI_API_KEY, OPENROUTER_API_KEY, GOOGLE_API_KEY, ...), override
        # this row in your own profile's cordis.patch.yml with that one extra
        # name — restating the whole `config`, since a later layer replaces a
        # row's config rather than deep-merging it. Non-credential names
        # (PATH, HOME, the OUROBOROS_* selectors) survive the scrub on their
        # own; the OUROBOROS_* rows below are here to keep the contract
```

</details>

**依据 3 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:80-97](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/integrations/dsh-plugin/cordis.patch.yml#L80-L97)

环境值、超时和软失败。

<details>
<summary>查看原文（18行）</summary>

```text
        env:
          OUROBOROS_LLM_BACKEND: !!js process.env.OUROBOROS_LLM_BACKEND ?? ''
          OUROBOROS_AGENT_RUNTIME: !!js process.env.OUROBOROS_AGENT_RUNTIME || 'host'
          OUROBOROS_DSH_CONFIG_PATH: !!js process.env.OUROBOROS_DSH_CONFIG_PATH ?? ''
          OUROBOROS_DSH_CLI_PATH: !!js process.env.OUROBOROS_DSH_CLI_PATH ?? ''
          ANTHROPIC_API_KEY: !!js process.env.ANTHROPIC_API_KEY ?? ''
          DEEPSEEK_API_KEY: !!js process.env.DEEPSEEK_API_KEY ?? ''
        # ouroboros_auto runs a full interview -> Seed -> execute -> grade
        # pipeline synchronously when called without polling; give it real
        # headroom instead of dsh's 60s mcp-client default.
        toolCallTimeoutMs: 1800000
        # Soft-fail: a machine without `uv`/Ouroboros configured yet should
        # still boot dsh with every other plugin working, not crash outright.
        # Recovery is not guaranteed to be automatic — whether mcp-client
        # retries at all depends on the dsh build (the published rc has no
        # reconnect loop), and where it exists the attempt budget is bounded.
        # After fixing the cause, reload the plugin or restart dsh.
        failOnStartupError: false
```

</details>

#### 缺口

- 本轮未运行 DSH、MCP、uvx 或模型
  **影响**：无法证明工具注册、后端可用与真实任务成功
  **进一步探讨**：锁定引擎和宿主版本后用隔离项目核验

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 工具可列出是否代表访谈与执行可用？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

否。README 称 OUROBOROS_LLM_BACKEND=dsh 会另启 dsh-acp-demo，要求绝对可信 composition 和可执行入口；缺失仍可能列出工具而调用访谈、Seed 或 QA 才失败。默认 host 是执行 runtime，不能据此推断访谈后端已配置或认证有效。启动错误软失败，自动重连依宿主版本，作者建议修复后重载或重启；不应把 DSH 启动成功当成工作流成功。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-plugin/README.md:47-52](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/integrations/dsh-plugin/README.md#L47-L52)

执行 runtime 与 LLM backend 为不同配置。

```text
| Variable | Purpose |
|---|---|
| `OUROBOROS_AGENT_RUNTIME` | Agent runtime for `ooo run`/`ooo auto`'s execution step. Defaults to `host` (dsh's own model does the work — see below); set to `claude-cli`, `codex`, `opencode`, ... to use that CLI instead. |
| `OUROBOROS_LLM_BACKEND` | LLM backend for interview/Seed/QA. Leave unset to keep your `ouroboros setup` default. `dsh` routes those calls through DeepSeek Harness — read the next section first, it needs two more variables. |
| `OUROBOROS_DSH_CONFIG_PATH` | Absolute path to the trusted Cordis composition the `dsh` LLM backend loads. Required whenever `OUROBOROS_LLM_BACKEND=dsh`. |
| `OUROBOROS_DSH_CLI_PATH` | Path to the `dsh-acp-demo` bin, when it isn't on `PATH`. |
```

**依据 2 · 源码核查**：[integrations/dsh-plugin/README.md:59-82](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/integrations/dsh-plugin/README.md#L59-L82)

dsh 后端独立子进程及实际调用失败边界。

<details>
<summary>查看原文（24行）</summary>

```text
### Routing interview/Seed/QA back through DeepSeek Harness

`OUROBOROS_LLM_BACKEND=dsh` is not a one-variable switch, and it does not reuse
the dsh process you're already running. Ouroboros spawns **its own**
`dsh-acp-demo` ACP child, and that child fails closed with `invalid_config`
unless it is given a composition to load. To use it:

1. Build DeepSeek Harness from source (`pnpm install && pnpm run build`,
   Node.js >= 22) and make its `dsh-acp-demo` bin reachable — on `PATH`, or
   named by `OUROBOROS_DSH_CLI_PATH`. A source build is the working path today:
   installing the published `@deepseek-ai/dsh-acp-demo` still fails on a
   peer-dependency conflict inside its own `dsh-tool-bash` chain.
2. Point `OUROBOROS_DSH_CONFIG_PATH` at an **absolute** composition file.
   Relative paths are rejected on purpose (they would resolve against the
   untrusted project cwd). The file must sit where dsh's `node_modules` (or
   workspace) is reachable: plugin package names in a composition resolve
   relative to the composition file's own directory.
3. Provide whatever credential that composition names — `DEEPSEEK_API_KEY` for
   DeepSeek's own models. See the credentials note below: it must be present in
   the dsh host environment, and this bundle forwards it explicitly.

Without steps 1–2 the Ouroboros tools still register and list fine; the first
interview/Seed/QA call is what fails. Everything except the `dsh` backend works
without them.
```

</details>

**依据 3 · 源码核查**：[integrations/dsh-plugin/README.md:105-116](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/integrations/dsh-plugin/README.md#L105-L116)

软失败和恢复行为为作者描述。

<details>
<summary>查看原文（12行）</summary>

```text
## Startup failures and recovery

Connection failures are non-fatal (`failOnStartupError: false`): a machine
without `uv` on `PATH` yet still boots dsh normally, just without the Ouroboros
tools, and every other plugin keeps working.

Recovery is not automatic in general. Whether `mcp-client` retries at all
depends on your dsh build — the published `0.0.1-rc.1` has no reconnect loop,
current `main` has one with bounded exponential backoff that gives up after a
capped number of consecutive failures. Either way, after fixing the cause
(installing `uv`, setting a runtime), reload the plugin or restart dsh rather
than waiting for a reconnect.
```

</details>

**依据 4 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:90-97](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/integrations/dsh-plugin/cordis.patch.yml#L90-L97)

软失败配置和重连说明。

```text
        toolCallTimeoutMs: 1800000
        # Soft-fail: a machine without `uv`/Ouroboros configured yet should
        # still boot dsh with every other plugin working, not crash outright.
        # Recovery is not guaranteed to be automatic — whether mcp-client
        # retries at all depends on the dsh build (the published rc has no
        # reconnect loop), and where it exists the attempt budget is bounded.
        # After fixing the cause, reload the plugin or restart dsh.
        failOnStartupError: false
```

#### 缺口

- 本轮未运行 DSH、MCP、uvx 或模型
  **影响**：无法证明工具注册、后端可用与真实任务成功
  **进一步探讨**：锁定引擎和宿主版本后用隔离项目核验

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、使用和退出需要哪些资源与核查？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

需要 uv、Python 3.12 及可用模型后端；uvx 动态解析可能引入下载、版本漂移，模型、工具执行和人工检查产生不确定成本。profile 若添加其他密钥，作者说明整个 config 应重新声明以免覆盖掉已有设置；具体宿主行为需另行核验。先固定包版本、预算和非敏感测试仓库，按访谈生成 Seed、执行和评估逐段验证；工具缺失、后端不可用或费用失控时停止并回退 CLI 或手写已锁配置。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-plugin/README.md:14-24](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/integrations/dsh-plugin/README.md#L14-L24)

uv、Python 与执行选择。

<details>
<summary>查看原文（11行）</summary>

```text
## Requirements

- [`uv`](https://astral.sh/uv) on `PATH`. Nothing else — `uvx` fetches and
  runs Ouroboros in an isolated environment on first launch, no `pip install`
  step.
- Python >= 3.12 (whatever `uv` resolves).
- Nothing else for execution: this bundle defaults `OUROBOROS_AGENT_RUNTIME`
  to `host`, so dsh's own model does `ooo run`/`ooo auto`'s execution step —
  no CLI to install. Set `OUROBOROS_AGENT_RUNTIME` (see below) to an
  executable runtime (`claude-cli`, `codex`, `opencode`, ...) if you'd rather
  have that CLI do the work instead.
```

</details>

**依据 2 · 源码核查**：[integrations/dsh-plugin/README.md:84-103](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/integrations/dsh-plugin/README.md#L84-L103)

凭据与配置覆盖的作者说明。

<details>
<summary>查看原文（20行）</summary>

```text
### Credentials

dsh does not hand child processes the harness environment wholesale. Its
subprocess seam scrubs every credential-shaped name — anything matching
`/KEY|PASSWORD|SECRET|TOKEN/i` — plus every `DSH_*` name, so harness
credentials never leak into a spawned process implicitly. A plugin's explicit
`env` layer merges after that scrub.

So this bundle names a short allowlist rather than passing everything through:

- `ANTHROPIC_API_KEY` — Ouroboros' default LLM backend.
- `DEEPSEEK_API_KEY` — the `dsh` backend loopback above.

To forward another (`OPENAI_API_KEY`, `OPENROUTER_API_KEY`, `GOOGLE_API_KEY`,
...), override the `mcp-ouroboros` row in your own profile's
`cordis.patch.yml` with that one extra name in `env`. A later layer replaces a
row's entire `config` rather than deep-merging it, so copy this bundle's
`config` block and add your line to it. Everything non-credential-shaped —
`PATH`, `HOME`, the `OUROBOROS_*` selectors — passes through untouched and
needs no row at all.
```

</details>

**依据 3 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:49-57](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/integrations/dsh-plugin/cordis.patch.yml#L49-L57)

uvx 使用不带版本的 Ouroboros 包。

```text
        command: uvx
        args:
          - --from
          - 'ouroboros-ai[mcp]'
          - --with
          - 'mcp==2.3.0'
          - ouroboros
          - mcp
          - serve
```

#### 缺口

- 本轮未运行 DSH、MCP、uvx 或模型
  **影响**：无法证明工具注册、后端可用与真实任务成功
  **进一步探讨**：锁定引擎和宿主版本后用隔离项目核验

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样检验版本与后端预检是否改善采用？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

未验证假设：把实际解析的引擎版本、后端选择和访谈就绪检查作为可审阅诊断，可能减少工具出现但首个访谈失败造成的误判。现有 README 已提供版本 pin 指导及后端准备，作者也指出运行前缺失配置；诊断不是新引擎，且只查配置不等于真实推理成功。对照现有文档，在未安装 uv、引擎版本变化、缺可信 composition、缺密钥及后端故障等样例测误报、发现时间、成本和泄露；无改善或误报过高则否定。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-plugin/README.md:54-57](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/integrations/dsh-plugin/README.md#L54-L57)

已有 profile pin 指导。

```text
Override any field — timeout, args, a pinned Ouroboros version — from your own
profile's `cordis.patch.yml` by targeting the `mcp-ouroboros` row id; see
["Package and install a plugin"](https://github.com/deepseek-ai/deepseek-harness/blob/main/docs/user/develop/basic/publish.md)
for the override mechanics.
```

**依据 2 · 源码核查**：[integrations/dsh-plugin/README.md:59-82](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/integrations/dsh-plugin/README.md#L59-L82)

已有后端就绪说明。

<details>
<summary>查看原文（24行）</summary>

```text
### Routing interview/Seed/QA back through DeepSeek Harness

`OUROBOROS_LLM_BACKEND=dsh` is not a one-variable switch, and it does not reuse
the dsh process you're already running. Ouroboros spawns **its own**
`dsh-acp-demo` ACP child, and that child fails closed with `invalid_config`
unless it is given a composition to load. To use it:

1. Build DeepSeek Harness from source (`pnpm install && pnpm run build`,
   Node.js >= 22) and make its `dsh-acp-demo` bin reachable — on `PATH`, or
   named by `OUROBOROS_DSH_CLI_PATH`. A source build is the working path today:
   installing the published `@deepseek-ai/dsh-acp-demo` still fails on a
   peer-dependency conflict inside its own `dsh-tool-bash` chain.
2. Point `OUROBOROS_DSH_CONFIG_PATH` at an **absolute** composition file.
   Relative paths are rejected on purpose (they would resolve against the
   untrusted project cwd). The file must sit where dsh's `node_modules` (or
   workspace) is reachable: plugin package names in a composition resolve
   relative to the composition file's own directory.
3. Provide whatever credential that composition names — `DEEPSEEK_API_KEY` for
   DeepSeek's own models. See the credentials note below: it must be present in
   the dsh host environment, and this bundle forwards it explicitly.

Without steps 1–2 the Ouroboros tools still register and list fine; the first
interview/Seed/QA call is what fails. Everything except the `dsh` backend works
without them.
```

</details>

**依据 3 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:90-97](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/integrations/dsh-plugin/cordis.patch.yml#L90-L97)

已有软失败与重载提示。

```text
        toolCallTimeoutMs: 1800000
        # Soft-fail: a machine without `uv`/Ouroboros configured yet should
        # still boot dsh with every other plugin working, not crash outright.
        # Recovery is not guaranteed to be automatic — whether mcp-client
        # retries at all depends on the dsh build (the published rc has no
        # reconnect loop), and where it exists the attempt budget is bounded.
        # After fixing the cause, reload the plugin or restart dsh.
        failOnStartupError: false
```

#### 缺口

- 本轮未运行 DSH、MCP、uvx 或模型
  **影响**：无法证明工具注册、后端可用与真实任务成功
  **进一步探讨**：锁定引擎和宿主版本后用隔离项目核验

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
