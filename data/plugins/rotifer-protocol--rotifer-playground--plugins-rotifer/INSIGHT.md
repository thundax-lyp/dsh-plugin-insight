# Rotifer Protocol

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[e6b42fd](https://github.com/rotifer-protocol/rotifer-playground/tree/e6b42fdc9f2affb1c3136912376604e397f12d40/plugins/rotifer)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/rotifer-protocol/rotifer-playground) [![npm 30d 285](https://img.shields.io/static/v1?label=npm+30d&message=285&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rotifer) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rotifer)
<!-- END META -->

> **功能**：为 DSH 提供 Rotifer 技能及 MCP 接入，辅助发现、比较和管理 Gene。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把技能与 MCP 配置接入 DSH；不将外部 Gene 引擎归因于此 bundle。

> **主要限制**：[Q03](#research-q03) 审批、工具限制与沙箱是作者说明，配置只能证明传参，其他工具入口也需独立约束。

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
  - [Q01 · 谁需要这一插件，相比直接使用 Rotifer CLI 增加什么？](#detail-section-11)
  - [Q02 · DSH bundle 实际挂载了什么？](#detail-section-12)
  - [Q03 · 升级、回滚及安全边界是否由插件保证？](#detail-section-13)
  - [Q04 · 数据、费用和恢复需要考虑什么？](#detail-section-14)
  - [Q05 · 怎样评估，何时停止升级？](#detail-section-15)
  - [Q06 · 能否提高排名驱动替换的可审阅性？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在 DSH 中发现和评估 Rotifer Gene 的开发者。

直接使用 Rotifer CLI 及人工比较 Gene，未比较效果和成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| Skills | 指导发现与选择 | 指导不等于强制执行 |
| MCP 桥 | 配置外部服务 | 工具限制未独立实测 |

**流程与依赖**

| 依赖 | 作用 | 限制 |
|---|---|---|
| DSH skill provider 与 MCP bridge | 加载指导及桥接 | 宿主可用性未测 |
| Node、npx 与固定 MCP 包 | 启动服务 | 外部代码和网络依赖 |
| Rotifer API 或 Gene | 查询与执行 | 效果、隐私和成本待核 |

| 步骤 | 动作 | 条件 |
|---|---|---|
| 准备 | 在隔离仓库固定依赖 | 核权限与网络 |
| 发现 | 通过技能查看候选 | 核工具与排名来源 |
| 评估 | 对比 Gene 与备份 | 人工审批 |
| 恢复 | 失败时回退备份 | 快照机制未实测 |

**效果与成本**

| 阶段 | 现金和资源 | 人工时间 |
|---|---|---|
| 首次 | 网络和模型费用未知 | 配置及审核外部代码 |
| 持续 | 工具 schema 和查询成本未测 | 比较候选及数据集 |
| 恢复 | 存储成本未测 | 验证备份与恢复 |

| 效果 | 固定配置支持 | 未确定 |
|---|---|---|
| DSH 接入 | 技能 provider 与 MCP 参数 | 宿主实际加载 |
| Gene 选择 | 技能说明比较和批准流程 | 排名有效性和节省时间 |

> **思考**：[Q03](#research-q03) 审批、工具限制与沙箱是作者说明，配置只能证明传参，其他工具入口也需独立约束。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把技能与 MCP 配置接入 DSH；不将外部 Gene 引擎归因于此 bundle。

[Q02](#research-q02) bundle 没有内置 Gene 运行器，server 与宿主的实际安全边界需分别验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 审批、工具限制与沙箱是作者说明，配置只能证明传参，其他工具入口也需独立约束。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 先在隔离仓库只读核查并独立备份；未经授权或来源不可审时停止。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定配置支持静态接线结论，外部 server、宿主、网络与回滚未实测。

- 已检查：作者 README、包清单、源码路径 plugins/rotifer/README.md、plugins/rotifer/package.json、plugins/rotifer/cordis.patch.yml、plugins/rotifer/index.js、plugins/rotifer/skills/evolve/SKILL.md、plugins/rotifer/skills/rotifer-overview.md、package.json 及固定范围 inventory；组件：plugins/rotifer。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态核查 DSH bundle、技能与 OpenClaw 枚举；未执行组件或外部服务。
- 下一步：在隔离 DSH 配置中核实工具列表、外部服务拒绝、网络行为和备份恢复。

**分析版本**

- **仓库**：[rotifer-protocol/rotifer-playground](https://github.com/rotifer-protocol/rotifer-playground)
- **版本号**：0.9.11（[固定提交 e6b42fd](https://github.com/rotifer-protocol/rotifer-playground/tree/e6b42fdc9f2affb1c3136912376604e397f12d40)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出集中呈现候选及排名依据供人工审批，需要用户实验。

在隔离 DSH 配置中核实工具列表、外部服务拒绝、网络行为和备份恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 82 | 56 | 16 | — |
| .md | source | 5 | 587 | — | — | 3128 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/rotifer-protocol/rotifer-playground/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 组件实际配置、外部依赖与升级采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要这一插件，相比直接使用 Rotifer CLI 增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

使用 DSH 并管理 Rotifer Gene 的开发者可通过此 bundle 获得面向选型、比较、升级和回滚的技能指导及 MCP 接入。相对直接使用 Rotifer CLI，它提供宿主内技能和预配置入口；排行榜、执行和安装由外部工具承担，不能把协议或 Gene 运行时归因于本插件，也不能据此声称收益优于手工比较。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/rotifer/README.md:14-23](https://github.com/rotifer-protocol/rotifer-playground/blob/e6b42fdc9f2affb1c3136912376604e397f12d40/plugins/rotifer/README.md#L14-L23)

作者解释目标。

<details>
<summary>查看原文（10行）</summary>

```text
## What this is

Most agent capabilities are written once and never measured again. Rotifer treats a
capability as a **Gene** — a versioned, testable unit with a declared input/output
schema, compiled to WASM, and scored by a fitness function `F(g)` in a public Arena.

Because Genes are portable and comparable, an agent can do something ordinary code
cannot: **find out that a better implementation of its own capability exists, and adopt it.**

This plugin brings that loop into your agent.
```

</details>

**依据 2 · 源码核查**：[plugins/rotifer/cordis.patch.yml:17-32](https://github.com/rotifer-protocol/rotifer-playground/blob/e6b42fdc9f2affb1c3136912376604e397f12d40/plugins/rotifer/cordis.patch.yml#L17-L32)

技能提供者配置。

<details>
<summary>查看原文（16行）</summary>

```text
- insert:
    # The four Rotifer skills, from this package's own skills/ directory: the
    # three skill folders plus the single-file rotifer-overview card, which this
    # provider reads as a skill too (the other hosts read only the folders).
    # includeDefaultRoots: false keeps this provider to that directory alone —
    # it never rescans your project or user skill roots, so it cannot shadow a
    # skill you wrote. The skills are read-only package files; nothing watches
    # them for edits.
    - id: rotifer-skills
      name: '@deepseek-ai/dsh-skill-filesystem'
      config:
        providerName: rotifer
        includeDefaultRoots: false
        watch: false
        customSkillDirs:
          - !!js "process.getBuiltinModule('node:path').join(process.getBuiltinModule('node:module').createRequire(baseUrl).resolve('rotifer/package.json'), '..', 'skills')"
```

</details>

**依据 3 · 源码核查**：[plugins/rotifer/cordis.patch.yml:53-63](https://github.com/rotifer-protocol/rotifer-playground/blob/e6b42fdc9f2affb1c3136912376604e397f12d40/plugins/rotifer/cordis.patch.yml#L53-L63)

MCP 桥接配置。

<details>
<summary>查看原文（11行）</summary>

```text
    - id: rotifer-mcp
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: rotifer
        transport: stdio
        command: npx
        args:
          - '-y'
          - '@rotifer/mcp-server@0.19.7'
          - '--tools=evolve'
        failOnStartupError: false
```

</details>

**依据 4 · 作者声明**：[plugins/rotifer/skills/rotifer-overview.md:10-28](https://github.com/rotifer-protocol/rotifer-playground/blob/e6b42fdc9f2affb1c3136912376604e397f12d40/plugins/rotifer/skills/rotifer-overview.md#L10-L28)

独立 CLI 基线。

<details>
<summary>查看原文（19行）</summary>

````text
## Quick Start

```bash
npm install -g @rotifer/playground
rotifer init my-agent && cd my-agent
rotifer hello --template quality-advisor
```

`rotifer init` boots the local Arena. `rotifer hello --template quality-advisor` is the fastest way to create and run a preset agent from curated templates.

## From Preset Agent to Your Own Gene

```bash
rotifer hello --template quality-advisor # Run the recommended preset agent
rotifer scan genes/              # Find candidate functions
rotifer wrap my-function         # Wrap as a Gene
rotifer test my-function         # Validate in WASM sandbox
rotifer arena submit my-function # Submit to Arena
rotifer arena list               # Watch the rankings
````

</details>

#### 缺口

- 未验证真实用户或与 CLI 的任务对照
  **影响**：不能量化效率与正确性
  **进一步探讨**：同任务比较宿主内技能和直接 CLI。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH bundle 实际挂载了什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

package.json 将 DSH bundle 指向 cordis.patch.yml；patch 插入 filesystem provider，仅指向包内 skills、关闭默认根和 watch，另插入 stdio MCP 客户端，以 npx -y 启动固定的 @rotifer/mcp-server@0.19.7 并传 --tools=evolve，failOnStartupError 为 false。这些是声明式配置；外部 server 的服务端拒绝策略、host 的启动与加载结果均未在本次验证。index.js 属于 OpenClaw 入口，枚举本地 skills，不能当作 DSH Gene 执行器。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/rotifer/package.json:37-40](https://github.com/rotifer-protocol/rotifer-playground/blob/e6b42fdc9f2affb1c3136912376604e397f12d40/plugins/rotifer/package.json#L37-L40)

bundle 入口。

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
```

**依据 2 · 源码核查**：[plugins/rotifer/cordis.patch.yml:17-32](https://github.com/rotifer-protocol/rotifer-playground/blob/e6b42fdc9f2affb1c3136912376604e397f12d40/plugins/rotifer/cordis.patch.yml#L17-L32)

skills provider 的配置。

<details>
<summary>查看原文（16行）</summary>

```text
- insert:
    # The four Rotifer skills, from this package's own skills/ directory: the
    # three skill folders plus the single-file rotifer-overview card, which this
    # provider reads as a skill too (the other hosts read only the folders).
    # includeDefaultRoots: false keeps this provider to that directory alone —
    # it never rescans your project or user skill roots, so it cannot shadow a
    # skill you wrote. The skills are read-only package files; nothing watches
    # them for edits.
    - id: rotifer-skills
      name: '@deepseek-ai/dsh-skill-filesystem'
      config:
        providerName: rotifer
        includeDefaultRoots: false
        watch: false
        customSkillDirs:
          - !!js "process.getBuiltinModule('node:path').join(process.getBuiltinModule('node:module').createRequire(baseUrl).resolve('rotifer/package.json'), '..', 'skills')"
```

</details>

**依据 3 · 源码核查**：[plugins/rotifer/cordis.patch.yml:53-63](https://github.com/rotifer-protocol/rotifer-playground/blob/e6b42fdc9f2affb1c3136912376604e397f12d40/plugins/rotifer/cordis.patch.yml#L53-L63)

server 命令及启动错误配置。

<details>
<summary>查看原文（11行）</summary>

```text
    - id: rotifer-mcp
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: rotifer
        transport: stdio
        command: npx
        args:
          - '-y'
          - '@rotifer/mcp-server@0.19.7'
          - '--tools=evolve'
        failOnStartupError: false
```

</details>

**依据 4 · 源码核查**：[plugins/rotifer/index.js:59-82](https://github.com/rotifer-protocol/rotifer-playground/blob/e6b42fdc9f2affb1c3136912376604e397f12d40/plugins/rotifer/index.js#L59-L82)

OpenClaw 枚举代码。

<details>
<summary>查看原文（24行）</summary>

```text
/**
 * Every Skill this plugin ships.
 *
 * Two shapes live side by side under skills/: a folder with a SKILL.md, and a
 * bare .md file. Both are real — skills/rotifer.md is one of the latter — so
 * missing either would under-report what the plugin provides.
 */
export function getSkills() {
  if (!existsSync(skillsDir)) return [];

  const skills = [];
  for (const entry of readdirSync(skillsDir)) {
    const full = join(skillsDir, entry);
    if (statSync(full).isDirectory()) {
      const file = join(full, "SKILL.md");
      if (existsSync(file)) skills.push(readSkill(file, entry));
    } else if (extname(entry) === ".md") {
      skills.push(readSkill(full, basename(entry, ".md")));
    }
  }
  return skills.filter(Boolean);
}

export default { getSkills };
```

</details>

#### 缺口

- 未运行 DSH 或外部 MCP server
  **影响**：无法证明启动、加载和服务端权限实际生效
  **进一步探讨**：隔离环境查看 provider、工具列表和启动失败行为。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 升级、回滚及安全边界是否由插件保证？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

evolve skill 指示升级需用户批准，并描述项目 genes 目录及单份快照：下一次覆盖替换旧快照，回滚会消耗该快照。README 声称 evolve 工具集只暴露 10 工具与 4 资源、不含发布和登录，并拒绝逃逸选项；patch 只能证明传入参数，无法单凭技能文本证明远程 MCP 的服务端强制、审批或沙箱安全。技能还包含 CLI 例子，其中部分操作超出 MCP 工具集；若 agent 可调用其他 shell 或工具，MCP 参数不能约束那些入口。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/rotifer/skills/evolve/SKILL.md:47-59](https://github.com/rotifer-protocol/rotifer-playground/blob/e6b42fdc9f2affb1c3136912376604e397f12d40/plugins/rotifer/skills/evolve/SKILL.md#L47-L59)

审批和快照规则为技能指令。

<details>
<summary>查看原文（13行）</summary>

````text
### Upgrade a Capability
```bash
/evolve upgrade <name>
```
Finds the top-ranked alternative in the same domain, shows you the swap, and installs it **only after you approve**. This is the one command that changes what is installed: it replaces a Gene in the project's `genes/` directory with third-party code from the marketplace, which changes what your Agent does at runtime.

Genes are project files, not global ones. Install into the project the user is in, and say which directory the Gene is going into when you propose the swap.

> **An overwrite is undoable.** Replacing a Gene moves the old copy into
> `<genes>/.snapshots/` first. Tell the user the two ways back: `rollback_gene`
> here, or `rotifer rollback <name>` in a terminal. One snapshot per Gene — the
> next overwrite supersedes it and a rollback consumes it, so this undoes the
> last upgrade rather than a history.
````

</details>

**依据 2 · 作者声明**：[plugins/rotifer/skills/evolve/SKILL.md:14-30](https://github.com/rotifer-protocol/rotifer-playground/blob/e6b42fdc9f2affb1c3136912376604e397f12d40/plugins/rotifer/skills/evolve/SKILL.md#L14-L30)

工具限制为作者声明。

<details>
<summary>查看原文（17行）</summary>

````text
This plugin declares the Rotifer MCP server for you:

```bash
npx -y @rotifer/mcp-server@0.19.7 --tools=evolve
```

`--tools=evolve` is not decoration. Left undeclared, the server offers 31 tools
and 7 resources, `publish_gene`, `login` and `arena_submit` among them. Declared,
it offers **10 tools and 4 resources**. The rest are not listed and are refused
if called, so nothing here can publish on your behalf or log you in.

Resources travel with the tools they duplicate — `rotifer://developers/{name}`
returns what `get_developer_profile` returns, so it goes when that tool goes. A
restriction with an unlisted way around it is not a restriction.

The launch line also omits `--allow`, so the sandbox escapes (`no_sandbox`,
`trust_unsigned`) are refused.
````

</details>

**依据 3 · 源码核查**：[plugins/rotifer/cordis.patch.yml:53-63](https://github.com/rotifer-protocol/rotifer-playground/blob/e6b42fdc9f2affb1c3136912376604e397f12d40/plugins/rotifer/cordis.patch.yml#L53-L63)

仅声明启动参数。

<details>
<summary>查看原文（11行）</summary>

```text
    - id: rotifer-mcp
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: rotifer
        transport: stdio
        command: npx
        args:
          - '-y'
          - '@rotifer/mcp-server@0.19.7'
          - '--tools=evolve'
        failOnStartupError: false
```

</details>

**依据 4 · 作者声明**：[plugins/rotifer/skills/rotifer-overview.md:20-28](https://github.com/rotifer-protocol/rotifer-playground/blob/e6b42fdc9f2affb1c3136912376604e397f12d40/plugins/rotifer/skills/rotifer-overview.md#L20-L28)

CLI 示例包含提交。

````text
## From Preset Agent to Your Own Gene

```bash
rotifer hello --template quality-advisor # Run the recommended preset agent
rotifer scan genes/              # Find candidate functions
rotifer wrap my-function         # Wrap as a Gene
rotifer test my-function         # Validate in WASM sandbox
rotifer arena submit my-function # Submit to Arena
rotifer arena list               # Watch the rankings
````

#### 缺口

- 外部服务实现和宿主授权未验证
  **影响**：无法把文档中的限制视为强制安全保证
  **进一步探讨**：核固定 server 源码与拒绝路径，并独立限制 shell 权限。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 数据、费用和恢复需要考虑什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

固定 MCP 包通过 npx 获取并执行，依赖 Node、npm、网络及外部服务；作者称查询访问公共 API、登录时产生工具调用遥测，安装会增加公开计数，ROTIFER_TELEMETRY=0 可关闭所述三类报告，但未检查实际网络实现。作者说明 schema 会持续进入请求上下文，其具体计费和 token 代价未测；Gene 可能写入项目，文档描述的一份快照不能替代备份。父仓库 CLI 的 package.json 要求 Node >=22.18，而组件 README 写 >=20，两者属于不同包，实际所选 CLI/server 的要求应分别确认。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/rotifer/skills/evolve/SKILL.md:93-125](https://github.com/rotifer-protocol/rotifer-playground/blob/e6b42fdc9f2affb1c3136912376604e397f12d40/plugins/rotifer/skills/evolve/SKILL.md#L93-L125)

外部代码、遥测与磁盘声明。

<details>
<summary>查看原文（33行）</summary>

```text
## Security & Transparency

### Runtime dependency
The MCP server is fetched from npm on first use and cached. That is a standard
pattern, but it means you are trusting remote code — review the source, or check
`npm view @rotifer/mcp-server@0.19.7 dist.integrity`, before use.

- **Source**: [github.com/rotifer-protocol/rotifer-mcp-server](https://github.com/rotifer-protocol/rotifer-mcp-server)

### What leaves your machine
Gene and Arena queries go to the public Rotifer API. Beyond that the server
makes one npm version check per day.

**Usage reporting.** When you are **signed in**, each tool call is reported to
Rotifer Cloud: the tool's name, the Gene id it acted on, whether it succeeded,
its latency, and your user id. Running a Gene while signed in records that too.

**Signed out, no usage record is sent** — but installing a Gene bumps that
Gene's public install counter either way, one request carrying the Gene id and
no identity. `ROTIFER_TELEMETRY=0` (or `false`/`off`) stops all three.

Not sent: the arguments you pass, file contents, your environment variables, or
your local configuration.

### What changes on disk
- **Genes** into the project's `genes/`, and the copy an overwrite replaces into `genes/.snapshots/`
- **Agent definitions** into `.rotifer/agents/` in the current project, plus a fitness file when you run one
- **A run log** at `~/.rotifer/run-logs/<gene>.jsonl` when an Agent runs — local, never transmitted
- **An update-check cache** at `~/.config/rotifer/update-check.json`

Nothing else on disk is modified, and no Gene is installed, replaced or removed
without explicit confirmation. Removing this plugin does not uninstall Genes it
installed; `rotifer uninstall <name>` removes one, and that is undoable through
```

</details>

**依据 2 · 作者声明**：[plugins/rotifer/README.md:60-64](https://github.com/rotifer-protocol/rotifer-playground/blob/e6b42fdc9f2affb1c3136912376604e397f12d40/plugins/rotifer/README.md#L60-L64)

作者测量和工具 schema 成本。

```text
- `rotifer-mcp` — the `dsh-mcp-client` bridge on the pinned, narrowed launch line
  below. Its 10 tool schemas are paid on every request while mounted (6,736 bytes
  of JSON, measured on dsh `0.1.0-rc.7`). Drop this row from your profile's own
  `cordis.patch.yml` and the four skills still work; they cost only their catalog
  rows.
```

**依据 3 · 作者声明**：[plugins/rotifer/README.md:137-141](https://github.com/rotifer-protocol/rotifer-playground/blob/e6b42fdc9f2affb1c3136912376604e397f12d40/plugins/rotifer/README.md#L137-L141)

组件文档的 Node 要求。

```text
## Requirements

- **Node.js ≥ 20**
- No account needed to scan, wrap, test, or run Genes locally
- An account is only required to publish or to submit to the Cloud Arena
```

**依据 4 · 源码核查**：[package.json:99-105](https://github.com/rotifer-protocol/rotifer-playground/blob/e6b42fdc9f2affb1c3136912376604e397f12d40/package.json#L99-L105)

父仓库 CLI 的 Node 要求。

```text
    "@rotifer/playground-darwin-arm64": "0.34.0",
    "@rotifer/playground-darwin-x64": "0.34.0",
    "@rotifer/playground-linux-x64-gnu": "0.34.0",
    "@rotifer/playground-win32-x64-msvc": "0.34.0"
  },
  "engines": {
    "node": ">=22.18.0"
```

#### 缺口

- 未核 npm 分发、网络行为与模型计费
  **影响**：不能确认依赖、隐私或费用
  **进一步探讨**：核包完整性和进程网络，并测实际 schema token 与账单。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样评估，何时停止升级？

**研究主题**：采用判断、效果与总成本

#### 完整回答

先在可弃置仓库固定依赖并只做只读发现，核工具清单、版本、外发和权限；再由用户审阅 Gene 的来源、许可证、测试数据和覆盖目标，保留独立备份后才在获授权时试装。若排名缺可比较样本、外部来源不可审、权限超范围、快照不可恢复或用户未批准，应停止并继续使用现有 Gene 与手工评估。文档说明回滚路径，但尚未实际执行，不能承诺恢复成功。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/rotifer/skills/evolve/SKILL.md:47-59](https://github.com/rotifer-protocol/rotifer-playground/blob/e6b42fdc9f2affb1c3136912376604e397f12d40/plugins/rotifer/skills/evolve/SKILL.md#L47-L59)

升级与回滚作者说明。

<details>
<summary>查看原文（13行）</summary>

````text
### Upgrade a Capability
```bash
/evolve upgrade <name>
```
Finds the top-ranked alternative in the same domain, shows you the swap, and installs it **only after you approve**. This is the one command that changes what is installed: it replaces a Gene in the project's `genes/` directory with third-party code from the marketplace, which changes what your Agent does at runtime.

Genes are project files, not global ones. Install into the project the user is in, and say which directory the Gene is going into when you propose the swap.

> **An overwrite is undoable.** Replacing a Gene moves the old copy into
> `<genes>/.snapshots/` first. Tell the user the two ways back: `rollback_gene`
> here, or `rotifer rollback <name>` in a terminal. One snapshot per Gene — the
> next overwrite supersedes it and a rollback consumes it, so this undoes the
> last upgrade rather than a history.
````

</details>

**依据 2 · 作者声明**：[plugins/rotifer/skills/evolve/SKILL.md:95-112](https://github.com/rotifer-protocol/rotifer-playground/blob/e6b42fdc9f2affb1c3136912376604e397f12d40/plugins/rotifer/skills/evolve/SKILL.md#L95-L112)

依赖和数据作者说明。

<details>
<summary>查看原文（18行）</summary>

```text
### Runtime dependency
The MCP server is fetched from npm on first use and cached. That is a standard
pattern, but it means you are trusting remote code — review the source, or check
`npm view @rotifer/mcp-server@0.19.7 dist.integrity`, before use.

- **Source**: [github.com/rotifer-protocol/rotifer-mcp-server](https://github.com/rotifer-protocol/rotifer-mcp-server)

### What leaves your machine
Gene and Arena queries go to the public Rotifer API. Beyond that the server
makes one npm version check per day.

**Usage reporting.** When you are **signed in**, each tool call is reported to
Rotifer Cloud: the tool's name, the Gene id it acted on, whether it succeeded,
its latency, and your user id. Running a Gene while signed in records that too.

**Signed out, no usage record is sent** — but installing a Gene bumps that
Gene's public install counter either way, one request carrying the Gene id and
no identity. `ROTIFER_TELEMETRY=0` (or `false`/`off`) stops all three.
```

</details>

**依据 3 · 源码核查**：[plugins/rotifer/cordis.patch.yml:53-63](https://github.com/rotifer-protocol/rotifer-playground/blob/e6b42fdc9f2affb1c3136912376604e397f12d40/plugins/rotifer/cordis.patch.yml#L53-L63)

实际启动参数。

<details>
<summary>查看原文（11行）</summary>

```text
    - id: rotifer-mcp
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: rotifer
        transport: stdio
        command: npx
        args:
          - '-y'
          - '@rotifer/mcp-server@0.19.7'
          - '--tools=evolve'
        failOnStartupError: false
```

</details>

#### 缺口

- 未在沙箱中安装或回滚
  **影响**：不能确认恢复与收益
  **进一步探讨**：用独立备份及无敏感数据的仓库逐步测试。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否提高排名驱动替换的可审阅性？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

可提出候选方案：批准前展示当前与候选 Gene 的来源、版本、数据集、指标、外部依赖和回滚备份位置，并要求人工确认。相对现有技能所述的展示与批准，增量是把排名适用范围和操作依据集中呈现；但可能增加审核负担，若数据集不可比仍会误导。用相同候选对比现有流程与原型，测用户识别不适用排名和所需时间；未做原型或实验。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/rotifer/skills/evolve/SKILL.md:47-59](https://github.com/rotifer-protocol/rotifer-playground/blob/e6b42fdc9f2affb1c3136912376604e397f12d40/plugins/rotifer/skills/evolve/SKILL.md#L47-L59)

现有指导要求展示、批准和回滚。

<details>
<summary>查看原文（13行）</summary>

````text
### Upgrade a Capability
```bash
/evolve upgrade <name>
```
Finds the top-ranked alternative in the same domain, shows you the swap, and installs it **only after you approve**. This is the one command that changes what is installed: it replaces a Gene in the project's `genes/` directory with third-party code from the marketplace, which changes what your Agent does at runtime.

Genes are project files, not global ones. Install into the project the user is in, and say which directory the Gene is going into when you propose the swap.

> **An overwrite is undoable.** Replacing a Gene moves the old copy into
> `<genes>/.snapshots/` first. Tell the user the two ways back: `rollback_gene`
> here, or `rotifer rollback <name>` in a terminal. One snapshot per Gene — the
> next overwrite supersedes it and a rollback consumes it, so this undoes the
> last upgrade rather than a history.
````

</details>

**依据 2 · 作者声明**：[plugins/rotifer/skills/evolve/SKILL.md:81-91](https://github.com/rotifer-protocol/rotifer-playground/blob/e6b42fdc9f2affb1c3136912376604e397f12d40/plugins/rotifer/skills/evolve/SKILL.md#L81-L91)

作者描述排名指标。

<details>
<summary>查看原文（11行）</summary>

````text
## How it Works

Under the hood, Rotifer uses **Genes** — atomic, transferable AI capabilities that compete in an **Arena**. The fittest Genes (measured by the fitness function **F(g)**) rise to the top of the rankings automatically. Ranking is the automatic part; putting a Gene on your machine is not.

```text
F(g) = S_r · log₂(1 + C_util) · (1 + R_rob)/2 · L_score · Cost_score
```

Each of the five factors lies in [0, 1], so F(g) does too: a perfect score is 1.

No voting, no human preference — pure runtime performance metrics determine which capabilities win.
````

</details>

#### 缺口

- 缺用户实验及排名数据来源审计
  **影响**：无法判断展示方案是否降低误判
  **进一步探讨**：用同样候选与盲审比较现有和候选展示。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
