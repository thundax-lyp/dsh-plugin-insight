# dsh-ouroboros 配置桥

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[05d2718](https://github.com/Q00/ouroboros/tree/05d2718de3edf7ba25de920c78652f646b7a9704/integrations/dsh-plugin)

<!-- BEGIN META -->
[![GitHub ★ 6,272](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C272&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Q00/ouroboros)
<!-- END META -->

> **实现功能**：通过DSH的MCP客户端挂载Ouroboros访谈、规格、执行与评估工具。

> **核心亮点**：[Q03](#research-q03)说明这是可安装的MCP配置桥，增量是合理默认值与显式凭据边界，核心规格/执行算法归上游。相对手写等效配置便利有限，不能把整套引擎能力当此组件原创。

> **风险与缺陷**：[Q04](#research-q04)揭示工具列出不等于访谈可用，且uvx不固定引擎版本，使本轮固定配置证据无法完整约束实际执行。应先解决版本锁与后端可调用性，再讨论长任务采用。

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
  - [Q01 · 已有DSH用户为什么需要这层配置桥，怎样验收？](#detail-section-11)
  - [Q02 · bundle怎样启动引擎，默认执行端究竟是什么？](#detail-section-12)
  - [Q03 · 相对手写MCP配置，桥本身有什么价值？](#detail-section-13)
  - [Q04 · 工具能列出为何还不能证明工作流可用？](#detail-section-14)
  - [Q05 · 默认host与dsh访谈后端的依赖怎样区分？](#detail-section-15)
  - [Q06 · 没有自定义代码是否等于采用负担低？](#detail-section-16)
  - [Q07 · 配置层哪些设计可复用，哪些不能归桥所有？](#detail-section-17)
  - [Q08 · 能否把动态引擎解析升级为可审阅的桥接契约？](#detail-section-18)
  - [Q09 · 桥当前适合怎样试，何时直接用CLI？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已决定使用Ouroboros规格先行流程、希望从DSH对话调用而非切到独立CLI的开发者。合格结果不是工具列表出现，而是访谈生成Seed并能交给执行/评估流程。简单替代是在profile手写MCP stdio配置，或直接用Ouroboros CLI。这个组件只是配置bundle，不把上游引擎贡献算作桥接原创。

增量是提供可安装的profile层、默认host执行、较长超时、显式凭据清单及非致命启动失败设置。相比手写配置，省去整理这些字段；相比独立CLI，保持DSH模型调用路径。没有新Agent算法、私有工具或状态引擎，36工具能力属于Ouroboros和宿主MCP客户端；熟悉MCP配置的用户可低成本复制等效方案。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| MCP桥 | 在DSH中调用上游工作流 | 需uv、后端与实际引擎版本核对 |
| 显式凭据转发 | 只转发列明凭据 | 其它后端需覆盖完整配置 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH MCP client | 必需 | stdio工具桥 | 不加载工具 |
| uv/Python3.12与网络 | 首启必需 | 解析引擎 | soft-fail但功能不可用 |
| 模型后端与凭据 | 访谈必需 | Seed/QA | 工具可列但调用失败 |
| ACP bin与可信composition | dsh后端必需 | 新子进程模型 | invalid_config |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 固定引擎和配置profile | 确认实际解析版本 |
| 2 | 宿主启动MCP | 连通不等于访谈完成 |
| 3 | 用户做短访谈 | Seed完成，失败查后端并reload |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Python包和模型接入 | 配置/可选ACP构建 | 时间未知 |
| 持续 | 多阶段模型调用 | 版本/凭据维护 | 无预算实测 |
| 失败恢复 | 重启和保留状态 | 区分连接与后端失败 | 自动重连无保证 |
| 退出 | 引擎状态仍在外部 | 移除配置层并核对文件 | 不回滚工作流副作用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| DSH入口 | stdio配置和env存在 | 实际解析引擎与工具可用 |
| 配置便利 | 提供默认超时/host | 相比手写净节时 |

> **思考**：[Q04](#research-q04)揭示工具列出不等于访谈可用，且uvx不固定引擎版本，使本轮固定配置证据无法完整约束实际执行。应先解决版本锁与后端可调用性，再讨论长任务采用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q03](#research-q03)说明这是可安装的MCP配置桥，增量是合理默认值与显式凭据边界，核心规格/执行算法归上游。相对手写等效配置便利有限，不能把整套引擎能力当此组件原创。

[Q03](#research-q03)说明这是可安装的MCP配置桥，增量是合理默认值与显式凭据边界，核心规格/执行算法归上游。相对手写等效配置便利有限，不能把整套引擎能力当此组件原创。

可复用的部分是显式短凭据清单、对长任务放宽超时和soft-fail隔离。默认host避免误设不可用CLI，README诚实记录注册/执行分离与重连限制。长期维护仍要跟踪宿主MCP版本、工具签名和上游引擎包；这些由外部服务实现，不把注释中的承诺当桥自己的恢复机制。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q04](#research-q04)揭示工具列出不等于访谈可用，且uvx不固定引擎版本，使本轮固定配置证据无法完整约束实际执行。应先解决版本锁与后端可调用性，再讨论长任务采用。

<a id="detail-section-6"></a>

### 1.5 使用建议

已会配置Ouroboros且需要DSH入口的用户，可在副本profile先固定已审阅引擎版本，只试短访谈和Seed生成，确认实际后端及env。当前动态下载未绑定本轮引擎源码，不建议直接进入日常项目长任务；缺composition、版本漂移或重连失败应移除该配置层，保留引擎记录并退回显式CLI。此处建议观察桥，不把上游引擎工具数当当前试用闭环证据。 依据 [Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

当前贡献由固定源码支持并含解释判断；效果未实测，未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 integrations/dsh-plugin/README.md、integrations/dsh-plugin/cordis.patch.yml 及固定范围 inventory；组件：integrations/dsh-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定提交源码、README、配置与相关测试定义；未安装或执行目标代码，未进行真实宿主验收。
- 下一步：未验证假设是安装时生成配置锁，固定引擎包版本、MCP版本和访谈后端能力，并区分已连接、可访谈、可执行三个状态。由uvx未pin与注册后首调用失败推得，目标是更早暴露能力缺口。最小验证在缺uv、缺composition、可访谈但无执行权限三个环境对照当前桥与契约预检，测错误定位时间及错误放行率；若预检与实际漂移严重或增加的维护超过排障收益则否定。

**分析版本**

- **仓库**：[Q00/ouroboros](https://github.com/Q00/ouroboros)
- **版本号**：0.1.0（[固定提交 05d2718](https://github.com/Q00/ouroboros/tree/05d2718de3edf7ba25de920c78652f646b7a9704)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q08](#research-q08)提出未验证的配置锁与分段能力预检，在缺uv、缺后端和部分可用三类环境测错误定位和放行率，反证是预检漂移或维护负担超出收益。

未验证假设是安装时生成配置锁，固定引擎包版本、MCP版本和访谈后端能力，并区分已连接、可访谈、可执行三个状态。由uvx未pin与注册后首调用失败推得，目标是更早暴露能力缺口。最小验证在缺uv、缺composition、可访谈但无执行权限三个环境对照当前桥与契约预检，测错误定位时间及错误放行率；若预检与实际漂移严重或增加的维护超过排障收益则否定。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 128 | — | — | 954 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/Q00/ouroboros/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定版本判断dsh-ouroboros 配置桥的贡献、关键质疑与可控采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 已有DSH用户为什么需要这层配置桥，怎样验收？

**研究主题**：场景与需求

#### 完整回答

面向已决定使用Ouroboros规格先行流程、希望从DSH对话调用而非切到独立CLI的开发者。合格结果不是工具列表出现，而是访谈生成Seed并能交给执行/评估流程。简单替代是在profile手写MCP stdio配置，或直接用Ouroboros CLI。这个组件只是配置bundle，不把上游引擎贡献算作桥接原创。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/dsh-plugin/README.md:3-24](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/integrations/dsh-plugin/README.md#L3-L24)

作者明确config-only及运行时默认

<details>
<summary>查看原文（22行）</summary>

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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · bundle怎样启动引擎，默认执行端究竟是什么？

**研究主题**：功能与机制

#### 完整回答

cordis.patch只插入mcp-client，command uvx加载ouroboros-ai[mcp]并固定mcp2.2.0，stdio接入。env仅显式转发Anthropic/DeepSeek凭据和选择器，Agent runtime默认host，不等于自动安装执行CLI。工具超时设置30分钟且failOnStartupError=false，连接失败不会阻止其它插件。包版本未固定意味着本轮固定的是桥配置，首次运行下载的引擎可能与当前仓库提交不同。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:43-57](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/integrations/dsh-plugin/cordis.patch.yml#L43-L57)

实际启动命令与未固定引擎包

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
          - 'mcp==2.2.0'
          - ouroboros
          - mcp
          - serve
```

</details>

**依据 2 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:80-97](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/integrations/dsh-plugin/cordis.patch.yml#L80-L97)

显式环境、超时和soft fail

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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对手写MCP配置，桥本身有什么价值？

**研究主题**：贡献与相对优势

#### 完整回答

增量是提供可安装的profile层、默认host执行、较长超时、显式凭据清单及非致命启动失败设置。相比手写配置，省去整理这些字段；相比独立CLI，保持DSH模型调用路径。没有新Agent算法、私有工具或状态引擎，36工具能力属于Ouroboros和宿主MCP客户端；熟悉MCP配置的用户可低成本复制等效方案。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/dsh-plugin/README.md:10-24](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/integrations/dsh-plugin/README.md#L10-L24)

明确无自定义代码

<details>
<summary>查看原文（15行）</summary>

```text
This is a **config-only bundle**: it contains no custom plugin code, just one
row that mounts dsh's existing `@deepseek-ai/dsh-mcp-client` against
`ouroboros mcp serve`.

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

**依据 2 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:80-97](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/integrations/dsh-plugin/cordis.patch.yml#L80-L97)

具体配置取舍

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

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工具能列出为何还不能证明工作流可用？

**研究主题**：缺陷与关键质疑

#### 完整回答

dsh LLM backend会额外启动dsh-acp-demo，必须有绝对可信composition及可用bin，缺少时工具仍可注册但首次访谈失败。引擎包无版本pin，首次运行还存在网络/版本漂移；当前Git证据不能证明下载版本行为。failOnStartupError让宿主继续运行，也使用户可能误以为桥已就绪；应以一次受控访谈完成验证，不能仅看启动绿灯。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/dsh-plugin/README.md:59-82](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/integrations/dsh-plugin/README.md#L59-L82)

注册成功与首次调用失败区分

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

**依据 2 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:49-57](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/integrations/dsh-plugin/cordis.patch.yml#L49-L57)

引擎动态解析

```text
        command: uvx
        args:
          - --from
          - 'ouroboros-ai[mcp]'
          - --with
          - 'mcp==2.2.0'
          - ouroboros
          - mcp
          - serve
```

#### 缺口

- uvx解析到的引擎版本与本固定提交关系未知
  **影响**：固定配置不等于实际执行引擎已审阅
  **进一步探讨**：使用profile覆盖固定已核对引擎版本并记录解析包及hash

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 默认host与dsh访谈后端的依赖怎样区分？

**研究主题**：依赖、兼容与流程

#### 完整回答

基础桥依赖DSH MCP client、PATH上的uv和Python3.12、网络及已配置模型后端。默认host承接执行，不免除访谈/Seed/QA后端。dsh后端另需源码构建ACP bin、绝对composition和凭据；其他后端需对应显式env。覆盖配置是整块替换而非深合并，手工加一个密钥字段时漏掉其它配置可破坏启动。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/dsh-plugin/README.md:14-24](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/integrations/dsh-plugin/README.md#L14-L24)

基础要求

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

**依据 2 · 作者声明**：[integrations/dsh-plugin/README.md:59-103](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/integrations/dsh-plugin/README.md#L59-L103)

后端配置和整块替换

<details>
<summary>查看原文（45行）</summary>

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

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 没有自定义代码是否等于采用负担低？

**研究主题**：效果与总成本

#### 完整回答

首次要安装uv/Python、profile配置与后端凭据，若选dsh访谈还需构建宿主ACP。持续会产生访谈、执行、评估模型调用和状态存储，桥本身不提供成本上限。连接恢复依赖宿主版本，修复原因后应reload/restart；卸掉桥会移除入口，但引擎外部状态和文件修改需独立保留和核对。金额和合格任务耗时未知，不能把一行配置称零成本。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/dsh-plugin/README.md:59-82](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/integrations/dsh-plugin/README.md#L59-L82)

ACP构建额外负担

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

**依据 2 · 作者声明**：[integrations/dsh-plugin/README.md:105-116](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/integrations/dsh-plugin/README.md#L105-L116)

重连不保证及恢复要求

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

#### 缺口

- 跨后端一次合格任务的调用量、时间和恢复成本未知
  **影响**：不支持自动流程比直接CLI更省的结论
  **进一步探讨**：固定同一Seed和预算，对照CLI与DSH桥的成功率及人工步骤

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 配置层哪些设计可复用，哪些不能归桥所有？

**研究主题**：工程质量与复用

#### 完整回答

可复用的部分是显式短凭据清单、对长任务放宽超时和soft-fail隔离。默认host避免误设不可用CLI，README诚实记录注册/执行分离与重连限制。长期维护仍要跟踪宿主MCP版本、工具签名和上游引擎包；这些由外部服务实现，不把注释中的承诺当桥自己的恢复机制。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:58-86](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/integrations/dsh-plugin/cordis.patch.yml#L58-L86)

显式环境接缝

<details>
<summary>查看原文（29行）</summary>

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
        # visible in one place.
        #
        # `?? ''` keeps every value a string (the row's schema is a string
        # dict). Ouroboros treats a blank credential as unset, so an unset host
        # variable stays effectively unset in the child. OUROBOROS_AGENT_RUNTIME
        # is the one exception: it falls back to the literal `'host'` rather
        # than `''`, because dsh has no installable execution CLI to fall back
        # to on its own — see the comment above.
        env:
          OUROBOROS_LLM_BACKEND: !!js process.env.OUROBOROS_LLM_BACKEND ?? ''
          OUROBOROS_AGENT_RUNTIME: !!js process.env.OUROBOROS_AGENT_RUNTIME || 'host'
          OUROBOROS_DSH_CONFIG_PATH: !!js process.env.OUROBOROS_DSH_CONFIG_PATH ?? ''
          OUROBOROS_DSH_CLI_PATH: !!js process.env.OUROBOROS_DSH_CLI_PATH ?? ''
          ANTHROPIC_API_KEY: !!js process.env.ANTHROPIC_API_KEY ?? ''
          DEEPSEEK_API_KEY: !!js process.env.DEEPSEEK_API_KEY ?? ''
```

</details>

**依据 2 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:87-97](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/integrations/dsh-plugin/cordis.patch.yml#L87-L97)

非致命启动失败与恢复局限

<details>
<summary>查看原文（11行）</summary>

```text
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

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 能否把动态引擎解析升级为可审阅的桥接契约？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是安装时生成配置锁，固定引擎包版本、MCP版本和访谈后端能力，并区分已连接、可访谈、可执行三个状态。由uvx未pin与注册后首调用失败推得，目标是更早暴露能力缺口。最小验证在缺uv、缺composition、可访谈但无执行权限三个环境对照当前桥与契约预检，测错误定位时间及错误放行率；若预检与实际漂移严重或增加的维护超过排障收益则否定。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:49-57](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/integrations/dsh-plugin/cordis.patch.yml#L49-L57)

动态包版本

```text
        command: uvx
        args:
          - --from
          - 'ouroboros-ai[mcp]'
          - --with
          - 'mcp==2.2.0'
          - ouroboros
          - mcp
          - serve
```

**依据 2 · 作者声明**：[integrations/dsh-plugin/README.md:80-82](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/integrations/dsh-plugin/README.md#L80-L82)

工具注册不等于调用能力

```text
Without steps 1–2 the Ouroboros tools still register and list fine; the first
interview/Seed/QA call is what fails. Everything except the `dsh` backend works
without them.
```

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 桥当前适合怎样试，何时直接用CLI？

**研究主题**：采用判断

#### 完整回答

已会配置Ouroboros且需要DSH入口的用户，可在副本profile先固定已审阅引擎版本，只试短访谈和Seed生成，确认实际后端及env。当前动态下载未绑定本轮引擎源码，不建议直接进入日常项目长任务；缺composition、版本漂移或重连失败应移除该配置层，保留引擎记录并退回显式CLI。此处建议观察桥，不把上游引擎工具数当当前试用闭环证据。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:49-57](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/integrations/dsh-plugin/cordis.patch.yml#L49-L57)

需固定引擎的直接依据

```text
        command: uvx
        args:
          - --from
          - 'ouroboros-ai[mcp]'
          - --with
          - 'mcp==2.2.0'
          - ouroboros
          - mcp
          - serve
```

**依据 2 · 作者声明**：[integrations/dsh-plugin/README.md:105-116](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/integrations/dsh-plugin/README.md#L105-L116)

reload恢复说明

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

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
