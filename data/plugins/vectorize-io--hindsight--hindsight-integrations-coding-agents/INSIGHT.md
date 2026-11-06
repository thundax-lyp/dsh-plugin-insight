# Hindsight 编码 Agent 记忆集成

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[30d547b](https://github.com/vectorize-io/hindsight/tree/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents)

<!-- BEGIN META -->
[![GitHub ★ 59,104](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=59%2C104&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vectorize-io/hindsight) [![npm 30d 87,948](https://img.shields.io/static/v1?label=npm+30d&message=87%2C948&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents)
<!-- END META -->

> **功能**：为编码 Agent 自动注入项目历史，并将会话交给 Hindsight 记忆服务。

> **亮点**：[Q02](#research-q02) 到 [Q03](#research-q03) 形成DSH多工作区的自动记忆通路：真实用户输入筛选、带来源注入/去重、fork增量及模型工具bank重绑定。共享host-client将optInOnly和同URL凭据重读集中处理，比每宿主重复连接少一处配置分歧；不证明召回正确、bank具备权限隔离或服务已持久化。

> **主要限制**：[Q03](#research-q03) 异步retain_ok不等于提取成功，req容忍404且retain弱回执可resolve，DSH的cursor只在内存且退出没接flush；[Q02](#research-q02)默认bank命名也非授权边界。若用户不能核实际bank、来源和远端读回，自动搬运可能同时带来漏记和旧决策误用；[Q04](#research-q04)默认云写回与后台处理增加采用责任。

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
  - [Q01 · 这个子包为 DSH 提供什么，与手工项目摘要怎样比较？](#detail-section-11)
  - [Q02 · 工作区、自动注入和模型工具实际怎样接线？](#detail-section-12)
  - [Q03 · 停止回合到 retain，确认、失败与数据外发有哪些实际边界？](#detail-section-13)
  - [Q04 · 自动后台行为、配置与退出的全周期代价是什么？](#detail-section-14)
  - [Q05 · 可复用贡献与最值得验证的增量方向是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 长期维护同项目的DSH编码使用者，希望新会话能引用仍有效且属于本项目的历史决策；合格结果须核来源、版本和服务读回。

[Q01](#research-q01) 手工项目摘要/规则文件、git与对话检索，或模型按需调用MCP；此条继承Hindsight记忆引擎，实际新增自动生命周期和调用者工作区适配，未全验其他宿主或服务端。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| DSH自动注入 | 首轮带入历史综合、后续刷新知识名录 | 依赖服务和缓存策略；不是每回合全量检索 |
| 工作区工具 | 模型按需查页/反射、记录initiative/文档 | 调用者bank绑定；含远端写而非全只读 |
| 会话写回 | 过滤转录后异步交给记忆服务 | 内存cursor；接受/提取/读回不同 |
| 后台接入 | 可选本地daemon与seed | 默认配置及版本条件须核，退出不自动清数据 |

**流程与依赖**

| 依赖 | 作用 | 版本或条件 |
|---|---|---|
| coding-agents | 本子包 | 0.8.5；未声明独立engines/license字段 |
| DSH agents事件 | 注入与停止回合触发 | agents必需，tools可选；无锁步DSH运行包依赖不等于所有Host兼容 |
| Hindsight服务 | reflect/页面/异步retain | 默认cloud URL；也可self-hosted/daemon，须核API/token/bank |
| Node/安装工具 | 运行子包与后台starter | 实际最低Node未声明；不能按types/node推断 |
| uv与提取模型 | daemon冷启动及提取 | 用户选择daemon时另需，未运行/测费 |
| 全局及bank配置 | 路由与optIn权限选择 | 独立虚构bank；命名不替代服务ACL |

| 步骤 | 操作 | 核对与失败处理 |
|---|---|---|
| 先配置 | 测试服务/虚构repo/独立bank，关不需后台 | 核URL、token、实际cwd和默认开关 |
| 首轮 | 新用户输入触发初始记忆/名录 | 看来源与内容，不当系统权威 |
| 停止回合 | 过滤转录后后台retain | 日志只表示客户端链，需服务提取/读回 |
| 新会话 | 检查正确决策是否可召回 | 比较人工摘要，核过期与串项目 |
| 异常退出 | 停自动依赖并保留排查信息 | 核后台、远端存储/删除和凭据，卸载不等于抹除 |

**效果与成本**

| 阶段 | 现金与资源 | 人工与数据责任 |
|---|---|---|
| 首次 | 服务/本地模型与下载费未知 | 配bank/授权/optIn及后台开关，耗时未知 |
| 持续 | reflect/提取/token/网络存储未知 | 审阅过期事实与来源；默认云写回需批准资料范围 |
| 失败恢复 | 重试/后台重复资源未知 | 核operation/读回和内存pending丢失 |
| 退出 | 服务保留/删除费用未核 | 停daemon/seed/updater、核远端资料与本地日志 |

| 效果项 | 当前源码支持 | 未验证 |
|---|---|---|
| 历史注入 | 真用户输入、首轮缓存、去重来源 | 相关性、正确版本和减少修正 |
| 项目绑定 | session cwd与调用者bank | 命名冲突、服务ACL与真实隔离 |
| 增量写回 | 转录筛选、operation/cursor计划 | 强回执、提取完成和退出完整性 |
| 采用结果 | 可安排虚构数据受控试用 | 净成本、真实长期维护收益 |

> **思考**：[Q03](#research-q03) 异步retain_ok不等于提取成功，req容忍404且retain弱回执可resolve，DSH的cursor只在内存且退出没接flush；[Q02](#research-q02)默认bank命名也非授权边界。若用户不能核实际bank、来源和远端读回，自动搬运可能同时带来漏记和旧决策误用；[Q04](#research-q04)默认云写回与后台处理增加采用责任。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 到 [Q03](#research-q03) 形成DSH多工作区的自动记忆通路：真实用户输入筛选、带来源注入/去重、fork增量及模型工具bank重绑定。共享host-client将optInOnly和同URL凭据重读集中处理，比每宿主重复连接少一处配置分歧；不证明召回正确、bank具备权限隔离或服务已持久化。

[Q02](#research-q02)同一host-client集中bank/optIn与原URL凭据管线，DSH区分用户/插件/子Agent、fork和工具caller；[Q03](#research-q03)异步接受、404容忍与进程内cursor限制端到端保证；[Q04](#research-q04)默认外发/后台进程需运维，不以跨宿主名单或测试数代替验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 异步retain_ok不等于提取成功，req容忍404且retain弱回执可resolve，DSH的cursor只在内存且退出没接flush；[Q02](#research-q02)默认bank命名也非授权边界。若用户不能核实际bank、来源和远端读回，自动搬运可能同时带来漏记和旧决策误用；[Q04](#research-q04)默认云写回与后台处理增加采用责任。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先配置独立bank/测试服务，关闭不需seed/survey及自动更新，核实际workspace再试虚构历史；每次写入看服务提取和读回，不只看retain_ok。发现错bank或旧决策立即回人工摘要，单独核后台和远端删除；[Q05](#research-q05)的证据状态方案先做对照。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持DSH自动注入与异步写回机制；只建议关闭不需要的后台行为后用虚构仓库/独立bank做有试用，真实效果、隔离、费用及读回未验；候选证据状态方向未验证。

- 已检查：作者 README、包清单、源码路径 hindsight-integrations/coding-agents/README.md、hindsight-integrations/coding-agents/cordis.patch.yml、hindsight-integrations/coding-agents/package.json、hindsight-integrations/coding-agents/src/core/auto-update.ts、hindsight-integrations/coding-agents/src/core/bank.ts、hindsight-integrations/coding-agents/src/core/chat.ts、hindsight-integrations/coding-agents/src/core/config.ts、hindsight-integrations/coding-agents/src/core/daemon.ts、hindsight-integrations/coding-agents/src/core/hindsight.ts、hindsight-integrations/coding-agents/src/core/hook.ts、hindsight-integrations/coding-agents/src/core/host-client.ts、hindsight-integrations/coding-agents/src/core/knowledge-tools.ts、hindsight-integrations/coding-agents/src/core/retain-cursor.ts、hindsight-integrations/coding-agents/src/core/runtime.ts、hindsight-integrations/coding-agents/src/core/seed.ts、hindsight-integrations/coding-agents/src/core/session-start.ts、hindsight-integrations/coding-agents/src/core/transcript-dsh.ts、hindsight-integrations/coding-agents/src/core/transcript-util.ts、hindsight-integrations/coding-agents/src/daemon-start.ts、hindsight-integrations/coding-agents/src/dsh.ts 及固定范围 inventory；组件：hindsight-integrations/coding-agents。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定子组件DSH入口及必要共享bank/config、hook/runtime、转录、client/cursor和后台启动/更新代表链。未全审其他宿主、安装/历史回填、deepen/survey完整提取或上游服务端，未运行目标和真实资料。正式前稿五题/报告/findings已完整重核。
- 下一步：源码级；没有安装/测试/Host/模型/服务/浏览器或真实账号执行。下一步用伪服务+虚构双项目核首轮缓存、错bank、404/缺operation、提取失败/退出和后台残留，再比较错误引用与总成本。

**分析版本**

- **仓库**：[vectorize-io/hindsight](https://github.com/vectorize-io/hindsight)
- **版本号**：0.8.5（[固定提交 30d547b](https://github.com/vectorize-io/hindsight/tree/30d547ba00989297057a9679f2d59f30a554b240)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 候选是将每条决策的bank/来源版本与提交、提取、读回状态分开，并提供逐条暂停，在同名repo、过时决策和丢回执/退出故障中对照人工摘要与现有纠正文档；若错误引用/漏记不降或成本更高就推翻。候选未实现验收。

源码级；没有安装/测试/Host/模型/服务/浏览器或真实账号执行。下一步用伪服务+虚构双项目核首轮缓存、错bank、404/缺operation、提取失败/退出和后台残留，再比较错误引用与总成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 13 | 1 | 12 | — |
| .md | source | 3 | 2043 | — | — | 19981 |
| .mjs | source | 1 | 112 | 74 | 32 | — |
| .ts | source | 136 | 21800 | 13731 | 7077 | — |
| .ts | test | 85 | 24659 | 20554 | 2222 | — |

</details>

**活跃度**

[![Issue 未关闭 204](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=204&color=737b86&logo=github)](https://github.com/vectorize-io/hindsight/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 485](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=485&color=737b86&logo=github)](https://github.com/vectorize-io/hindsight/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z) [![近30天关闭 408](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=408&color=737b86&logo=github)](https://github.com/vectorize-io/hindsight/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH多工作区跨会话记忆能否把正确项目历史召回并写回，数据、授权和退出边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这个子包为 DSH 提供什么，与手工项目摘要怎样比较？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

当前研究对象是 hindsight-integrations/coding-agents 0.8.5 子包，非整个 Hindsight 服务端。它面向多个编码宿主提供共享记忆核心；DSH 路径导出 dist/dsh.js，bundle patch 实际插入 hindsight 行，apply 监听原生 Agent 生命周期并可选注册 tools，因此本条真实类型为 plugin。包没有声明独立 engines 或 license 字段，不能从 devDependency 的 @types/node 版本推最低 Node，也不能把上游仓库或其他包的许可不加核查套给此条。

目标用户是长期维护同项目、经常跨会话重述历史决策的编码使用者，合格结果是取回正确项目、仍有效且可核来源的决策，并能在服务中确认新增记忆。基线是项目内维护明确摘要/规则文件，或手动找旧对话和 git 决策后粘贴；这些方法有手工维护成本，却更容易由人选择哪些资料外发。这里的增量是自动工作区绑定、首轮记忆注入和会话后台写回通路，不是模型推理或上游记忆引擎原创。

作者列出的 Claude Code/Codex/opencode benchmark 不含本轮 DSH/服务组合，未作独立复现，不计此条效果或节省。正式前稿五题、报告及全部 findings 已读，本轮按当前 DSH 适配、必要共享核心和真实数据调用重核；不把所有宿主接口、完整安装器/backfill/deepen/survey实现或服务端隔离一并验收。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/package.json:1-13](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/package.json#L1-L13)

子包身份、版本和description。

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "@vectorize-io/hindsight-coding-agents",
  "version": "0.8.5",
  "repository": {
    "type": "git",
    "url": "https://github.com/vectorize-io/hindsight.git",
    "directory": "hindsight-integrations/coding-agents"
  },
  "description": "Reflect-only Hindsight long-term memory for coding agents (harness-pluggable: opencode, …), with automatic background ingestion (no setup CLI).",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "bin": {
```

</details>

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/package.json:53-80](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/package.json#L53-L80)

真实DSH导出和bundle字段。

<details>
<summary>查看原文（28行）</summary>

```text
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./server": "./index.js",
    "./dsh": "./dist/dsh.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json",
    "./dist/*": "./dist/*"
  },
  "files": [
    "skill",
    "dist",
    "index.js",
    "cordis.patch.yml",
    "plugin.json",
    "hooks"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "cline": {
    "plugins": [
      {
```

</details>

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/cordis.patch.yml:16-18](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/cordis.patch.yml#L16-L18)

实际插入DSH插件行。

```text
- insert:
    - id: hindsight
      name: "@vectorize-io/hindsight-coding-agents/dsh"
```

**依据 4 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:439-458](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/dsh.ts#L439-L458)

实际生命周期与可选tools注册。

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * Bind the memory lifecycle for the lifetime of `ctx`. Every listener is fail-open: RuntimeCore
 * never throws, and a workspace we cannot resolve simply leaves that session unmemoried.
 */
export function apply(ctx: DshContext): void {
  const hooks = createDshHooks(workspaceForAgent);
  ctx.on("agent/session-start", hooks.sessionStart);
  // `prepend: true` puts this listener outermost, so the injection is appended AFTER every other
  // contributor's messages — the memory block reads last, closest to the model's turn.
  ctx.on("agent/pre-step", hooks.preStep, { prepend: true });
  ctx.on("agent/turn-stopping", hooks.turnStopping);
  ctx.on("agent/disposed", hooks.disposed);
  // The tools registry is optional: a composition without it (a bare headless assembly) still gets
  // recall, injection and write-back.
  ctx.inject(["tools"], (toolCtx) => {
    registerTools(toolCtx, process.cwd());
  });
}

export default { name, inject, apply };
```

</details>

**依据 5 · 作者声明**：[hindsight-integrations/coding-agents/README.md:1-13](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/README.md#L1-L13)

作者说明跨会话项目决策任务。

<details>
<summary>查看原文（13行）</summary>

```text
# hindsight-coding-agents

Long-term project memory for **coding agents**, backed by [Hindsight](https://vectorize.io/hindsight).
One package, several agents: a shared reflect-and-inject core with a thin entry point per agent
(**Claude Code**, **Codex CLI**, **DeepAgents Dcode**, **opencode**, **opencode 2**, **Kilo CLI**, **Cursor CLI**, **GitHub Copilot CLI**, **Grok Build**, **Qwen Code**, **Kimi Code**, **Factory Droid**, **ZCode**, **TraeCode**, **Antigravity CLI**, **Devin CLI**, **Cline CLI**, **pi**, **Prime Agent**, **DeepSeek Harness**, **WorkBuddy**, **CodeBuddy**). Ingestion is fully
automatic — there is no setup command: a repo's git history and conversations flow into its memory
bank in the background as you work.

The premise: most of a real fix is derivable from the code, but the _last mile_ often hinges on a
project-specific decision that isn't in the code at all — a rounding rule, a retry allowlist, a
tie-break policy. Those decisions live in git history and past conversations. This package puts them
in front of the agent at the moment it starts working, and keeps a curated set of **knowledge pages**
(architecture, conventions, in-flight initiatives) that future sessions start from.
```

</details>

**依据 6 · 作者声明**：[hindsight-integrations/coding-agents/README.md:19-36](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/README.md#L19-L36)

作者benchmark对象不是DSH，不能转为本条效果。

<details>
<summary>查看原文（18行）</summary>

```text
## Does it work?

[AMB's sdebench](https://agentmemorybenchmark.ai/dataset/sdebench) is the measurement: a coding
agent over 61 real repository tasks, three runs each, with and without memory.

Accuracy is not what moves — every run solves 60–61 of the 61 either way. These are tasks a good
agent can already do. What memory changes is how much it costs you to get there: how often you have
to stop and correct the agent, and what the tokens cost.

<!-- figure: coding-agents-benchmark -->

| Agent       | Corrections / task | Cost / task         |
| ----------- | ------------------ | ------------------- |
| Claude Code | 0.85 → **0.36**    | $0.445 → **$0.338** |
| Codex CLI   | 1.34 → **0.47**    | $0.577 → **$0.276** |
| opencode    | 1.20 → **0.80**    | $0.634 → **$0.553** |

No memory → with Hindsight, mean of 3 runs. Corrections reproduce the labels AMB prints on its own
```

</details>

#### 缺口

- 没有 DSH 目标用户同任务对照、来源准确性和需求频次记录。
  **影响**：不能证明自动记忆比项目摘要更值得维护，场景和收益仍为有条件判断。
  **进一步探讨**：用同一批虚构项目决策比较手工摘要与此集成的错误引用、修正次数、时间和token。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工作区、自动注入和模型工具实际怎样接线？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

DSH 工作区取 session.header.cwd，缺失时回退 process.cwd；workspaceFor 以根目录缓存 RuntimeCore（禁用者缓存 null），resolveHostMemory 统一解析全局/harness/bank/path配置，做optInOnly检查后把 bank/client/project 绑定进去。子Agent origin=subagent 不参与。bank 默认采用 coding-agent::{gitProject}，显式bank或路径映射可覆盖；这是命名路由而非权限隔离，不同repo同名或人为共bank仍可能共享。配置/服务ACL需另外核，不因按工作区创建runtime就承诺多租户安全。

pre-step 先 await next，只有 enter、未已abort且存在真正 source.kind=user 的新文本才 onPrompt；工具续步和其他插件消息不重复触发。共享 buildHookOutput 并非每个人类回合都重新综合历史：默认autoInject=reflect，首次尚无缓存时调reflect，结果按会话缓存，失败可重试/部分回退；后续主要按cadence刷新知识页名录，内容由模型工具按需取。runtime把首轮preamble/当前context拼成消息，DSH用 plugin:hindsight/recall 来源追加，历史最后一条注入文本相同则跳过；fork继承历史也能用于去重。

工具在启动目录的workspace模板上注册名称/schema，执行时优先按调用Agent工作区重绑定；启动目录禁用则其他工作区也不会有工具，调用无Agent则退模板。runSpec 将isError转抛错给Host，不把工具失败当成功。工具并非全只读：capture_initiative实际调用client写知识页，ingest_document实际retain；描述中的“计划已获用户批准”是给模型的说明，不是这层独立人类确认门。调用者权限由Host/服务承担，试用须将其视为远端写权限。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:160-195](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/dsh.ts#L160-L195)

cwd回退、workspace缓存和绑定共享client/runtime。

<details>
<summary>查看原文（36行）</summary>

```text
/** Where a session is working. dsh records it on the session header; a session without one is rare. */
function workspaceRoot(agent: DshAgent): string {
  return agent.session.header.cwd || process.cwd();
}

/**
 * The memory runtime for one workspace root, built on first use.
 *
 * Bank derivation and the per-bank opt-out live here rather than in `apply`, because the plugin
 * loads before any session exists and the process may end up serving several unrelated
 * repositories. Building one has NO side effect: the seed is started by `ensureSeeded` when a
 * session actually opens, so merely registering the tools never seeds the launch directory.
 */
function workspaceFor(root: string): Workspace | undefined {
  const cached = workspaces.get(root);
  if (cached !== undefined) return cached ?? undefined;

  // One shared builder for every long-lived host (core/host-client.ts): the global switch, the
  // per-bank opt-out and `optInOnly` all land in `cfg.disabled`.
  const { cfg, bankId, client } = resolveHostMemory(HARNESS, root);
  if (cfg.disabled) {
    workspaces.set(root, null); // inert: same agent, no memory (baseline parity)
    return undefined;
  }
  // The 5th argument is this host's whole reason for existing here: RuntimeCore binds the
  // knowledge tools (and retain stamps) to the workspace it is given, and dsh's process cwd is the
  // launch directory, routinely a different repository from the session's.
  const core = new RuntimeCore(client, bankId, cfg, HARNESS, root);
  // The write-back path reads the log back off the live agent — dsh keeps the whole session in
  // memory, so unlike opencode there is nothing to refetch over HTTP.
  core.setTranscriptSource(async (sessionId) => {
    const agent = liveAgents.get(sessionId);
    return agent ? readDshEvents(ownEvents(agent.session)) : [];
  });
  const workspace: Workspace = { core, root };
  workspaces.set(root, workspace);
```

</details>

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:199-215](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/dsh.ts#L199-L215)

seed一次与子Agent跳过。

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * Start this repo's cold-check + background seed once.
 *
 * Fire-and-forget by design: `agent/session-start` is an emit that no extension point awaits, and
 * the Web UI must not wait on a network round-trip to open a session. Nothing the first prompt
 * needs comes from here — it builds its own knowledge preamble from that session's page list.
 */
function ensureSeeded(workspace: Workspace): void {
  workspace.seeded ??= workspace.core.seedIfCold(workspace.root);
}

function workspaceForAgent(agent: DshAgent): Workspace | undefined {
  // A subagent session is a child of a conversation we already track: injecting into it would pay
  // for a second recall per delegation, and retaining it would file a fragment of a session that
  // the parent already stores in full.
  if (agent.session.header.origin === "subagent") return undefined;
  return workspaceFor(workspaceRoot(agent));
```

</details>

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/core/host-client.ts:35-54](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/host-client.ts#L35-L54)

全局disabled、bank不可识别及optInOnly统一解析。

<details>
<summary>查看原文（20行）</summary>

```text
  const cfg0 = loadConfig({ harness });
  // A globally disabled plugin stops HERE, before bank derivation: `disabled` exists to be a
  // zero-overhead baseline — the same agent with no memory — not merely a silent one. Callers
  // return early on `cfg.disabled`, so the empty bank id never reaches a request.
  if (cfg0.disabled) return { cfg: cfg0, bankId: "" };
  const bankId = deriveBankIdOrSkip(cfg0, directory, harness);
  // An unidentifiable repository takes the same exit: no bank id is safer than a guessed one, and
  // `disabled` is the signal every caller already handles (#3950).
  if (bankId === null) return { cfg: { ...cfg0, disabled: true }, bankId: "" };
  const resolved = applyBankConfig(cfg0, bankId, directory);
  // The repository the bank is ABOUT, for page scoping — the same rule as deepen.ts: only a bank
  // that is this repo's, not one a `banks.<id>.bank` rename points several repos at (#4490).
  const project = resolved.bankId === bankId ? bankProjectName(resolved.cfg, directory) : undefined;
  return { ...resolved, project };
}

/**
 * Resolve config for `directory` and build the client for it.
 *
 * Callers still decide what a disabled config means for them (skip registration, cache a null
```

</details>

**依据 4 · 源码核查**：[hindsight-integrations/coding-agents/src/core/host-client.ts:58-86](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/host-client.ts#L58-L86)

client绑定bank，token重读仅原URL匹配时使用。

<details>
<summary>查看原文（29行）</summary>

```text
 */
export function resolveHostMemory(harness: string, directory: string): HostMemory {
  const { cfg, bankId, project } = resolveHostConfig(harness, directory);
  return {
    cfg,
    bankId,
    client: new HindsightClient({
      apiUrl: cfg.apiUrl,
      apiToken: cfg.apiToken,
      bank: bankId,
      // Names the repo in the initiative pages this host captures, as the seeded pages do.
      project,
      maxParallelRetains: cfg.maxParallelRetains,
      observationScopes: cfg.observationScopes,
      pageSearchLimit: cfg.pageSearchLimit,
      recallOptions: cfg.recallOptions,
      // The credential a host STARTED with is not the one it must keep using: enable auth or
      // rotate the key mid-session and the snapshot 401s every call until restart (#3600). Read
      // through the same pipeline the constructor used, so a per-bank `banks.<id>.apiToken` is
      // honoured on re-resolution exactly as it was on the first one.
      // The URL stays the one this client was built with, so a token re-read after the config
      // moved this directory to ANOTHER server is that server's credential: never send it here.
      tokenProvider: () => {
        const live = resolveHostConfig(harness, directory).cfg;
        return live.apiUrl === cfg.apiUrl ? live.apiToken : cfg.apiToken;
      },
    }),
  };
}
```

</details>

**依据 5 · 源码核查**：[hindsight-integrations/coding-agents/src/core/bank.ts:300-325](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/bank.ts#L300-L325)

路径map/static/template真正优先级与默认命名。

<details>
<summary>查看原文（26行）</summary>

```text
export function deriveBankId(
  config: BankConfig,
  directory: string,
  harness = "coding",
  /** Where the SESSION started, when the caller knows it (hook runtimes do — see
   *  `sessionRootDir`). A rescue for a live directory git cannot name: it resolves both the
   *  project the bank is named after (gitProjectName) and the checkout whose `mapPathToBank`
   *  entry this directory inherits (lookupDirectories). */
  sessionRoot?: string
): string {
  const mapped = mappedBank(config, directory, sessionRoot);
  if (mapped) return mapped;

  // dynamic by default — but an explicit bankId (without dynamicBankId: true) means "static".
  const dynamic = config.dynamicBankId ?? !config.bankId;
  if (!dynamic) return config.bankId || DEFAULT_BANK_NAME;

  const resolvers: Record<string, () => string> = {
    harness: () => harness,
    project: () => dirName(directory),
    gitProject: () => gitProjectName(directory, config.resolveWorktrees ?? true, sessionRoot),
    channel: () => process.env.HINDSIGHT_CHANNEL_ID || "default",
    user: () => process.env.HINDSIGHT_USER_ID || "anonymous",
  };
  return applyTemplate(config.bankIdTemplate || DEFAULT_TEMPLATE, resolvers, "bankIdTemplate");
}
```

</details>

**依据 6 · 源码核查**：[hindsight-integrations/coding-agents/src/core/config.ts:898-909](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/config.ts#L898-L909)

optInOnly不满足实际设disabled。

<details>
<summary>查看原文（12行）</summary>

```text
  cfg: Config,
  resolvedId: string,
  /** The directory the bank was resolved FROM. Supplying it enforces `optInOnly`; every entry
   *  point already has it to hand, having just passed it to bank resolution. */
  directory?: string
): { cfg: Config; bankId: string } {
  // Rides the `disabled` gate every entry point already checks after bank resolution, rather than
  // adding a second thing eight call sites must remember — and that gate is known to stop the run
  // before anything creates a bank.
  if (directory !== undefined && !isOptedIn(cfg, directory))
    return { cfg: { ...cfg, disabled: true }, bankId: resolvedId };
  const byPath = directory === undefined ? undefined : pathSection(cfg, cfg.paths, directory);
```

</details>

**依据 7 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:225-251](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/dsh.ts#L225-L251)

真正用户文本筛选与plugin来源注入。

<details>
<summary>查看原文（27行）</summary>

```text
 * `kind: 'plugin'`, V4 hosts use a producer-owned kind such as `time-context`). Only a
 * `kind: 'user'` message is a prompt worth recalling on.
 */
function promptOf(messages: readonly DshUserMessage[]): string {
  return (messages || [])
    .filter((message) => message?.source?.kind === "user")
    .flatMap((message) => message.content || [])
    .filter((block) => block?.type === "text" && block.text)
    .map((block) => block.text!)
    .join("\n")
    .trim();
}

/**
 * Build the injected memory message.
 *
 * `form: 'recall'` is dsh's own vocabulary for retrieved context, so its UI renders the block as
 * recalled material rather than as something the user typed. Session format V4 requires injected
 * messages to use a producer-owned source kind; `plugin:hindsight` is the canonical fallback name
 * for an unregistered plugin. The non-user source also keeps the block out of a write-back.
 */
function injectionMessage(text: string): DshUserMessage {
  return {
    id: randomUUID(),
    role: "user",
    content: [{ type: "text", text }],
    source: { kind: `plugin:${HINDSIGHT_PLUGIN}`, form: "recall" },
```

</details>

**依据 8 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:290-320](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/dsh.ts#L290-L320)

实际onPrompt和历史相同内容去重。

<details>
<summary>查看原文（31行）</summary>

```text
    async preStep(
      { agent, signal }: PreStepPayload,
      next: () => Promise<PreStepDecision>
    ): Promise<PreStepDecision> {
      const decision = await next();
      if (decision.kind !== "enter" || signal.aborted) return decision;
      const workspace = resolve(agent);
      if (!workspace) return decision;
      const sessionId = agent.session.header.id;
      liveAgents.set(sessionId, agent);
      // A resumed session gets no `agent/session-start` in some compositions; seeding here too
      // keeps the cold-check exactly-once without depending on which events a host fired.
      ensureSeeded(workspace);
      // No new human input means a tool continuation: recall already ran for this turn, and its
      // block is already in the history the model is about to be sent.
      const prompt = promptOf(decision.messages);
      if (!prompt) return decision;
      await workspace.core.onPrompt(sessionId, prompt);
      const injection = workspace.core.getInjection(sessionId);
      if (!injection) {
        diag(HARNESS, "inject_empty", { session: sessionId });
        return decision;
      }
      if (injection === lastInjectedText(dshSessionEvents(agent.session))) {
        diag(HARNESS, "inject_unchanged", { session: sessionId });
        return decision;
      }
      diag(HARNESS, "inject_ok", { session: sessionId, chars: injection.length });
      return { kind: "enter", messages: [...decision.messages, injectionMessage(injection)] };
    },

```

</details>

**依据 9 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:167-222](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/runtime.ts#L167-L222)

首回合preamble和buildHookOutput实际拼装。

<details>
<summary>查看原文（56行）</summary>

```text
  async onPrompt(sessionId: string | undefined, prompt: string): Promise<void> {
    if (process.env.HINDSIGHT_DISABLE_HOOKS) return; // anti-recursion (see seedIfCold)
    if (!sessionId) return;
    // No prompt text means no recall, so no block for this turn either: the previous turn's block
    // must not be handed out again, since every host now persists it into the user message.
    if (!prompt.trim()) {
      this.injection.delete(sessionId);
      return;
    }
    const turns = (this.turnCount.get(sessionId) ?? 0) + 1;
    this.turnCount.set(sessionId, turns);

    const cacheFile = sessionCacheFile(this.harness, sessionId);
    if (this.deferInitialReflect) {
      // `seedIfCold` has no session id. Transfer its SessionStart decision to the first concrete
      // session here; `buildHookOutput` consumes it exactly once, like hook harnesses do.
      this.deferInitialReflect = false;
      writeSessionCache(cacheFile, { deferInitialReflect: true });
    }
    const output = await buildHookOutput({
      harness: this.harness,
      prompt,
      cfg: this.cfg,
      client: this.client,
      cacheFile,
    });

    const blocks: string[] = [];
    // The SessionStart-equivalent preamble, injected once on the first turn (later turns get the
    // periodic refresh below). Built HERE, from this session's own roster, rather than reused from
    // plugin load: that one is a process-lifetime snapshot, so a host started before the pages
    // existed told every later session "No knowledge pages yet" while the same turn's memory block
    // listed pages by id (#4607).
    if (turns === 1) {
      blocks.push(
        buildKnowledgePreamble(output.pages, {
          reflectOnNewGoals: this.cfg.autoInject !== "reflect",
          extra: this.cfg.toolGuideExtra,
        })
      );
    }
    if (output.context) blocks.push(output.context);
    // OpenCode has no user-message hook channel; use its native toast instead of stderr, which
    // renders inside the TUI input line. The shared output owns when a notice exists.
    if (output.notice) {
      // The notice is painted for a terminal; a toast shows the escapes as text (#6257).
      const preview = output.notice
        .replace(/\x1b\[[0-9;]*m/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 140);
      log.info(this.harness, "reflect goal", { preview });
      this.notify?.("Hindsight · recalled past decisions", preview);
    }
    const block = blocks.filter(Boolean).join("\n\n");
    this.injection.set(sessionId, block);
```

</details>

**依据 10 · 源码核查**：[hindsight-integrations/coding-agents/src/core/hook.ts:240-310](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/hook.ts#L240-L310)

首轮未缓存才自动reflect/recall/pages，非每回合全量回忆。

<details>
<summary>查看原文（71行）</summary>

```text

  const cached = readSessionCache(cacheFile);
  const turns = (cached.turns ?? 0) + 1;

  // ── auto-inject: once per session, on the first prompt ────────────────────────
  // cfg.autoInject picks the source: a reflect synthesis, a knowledge-page search, or a recall of
  // observations. "none" = tool-only mode: the roster's tool guide instead sends new goals through
  // knowledge pages first and reserves reflection for gaps. Whatever the source, its body is
  // cached as `reflectAnswer` (the field name predates the other sources).
  let reflectAnswer = cached.reflectAnswer;
  let reflectAttempts = cached.reflectAttempts ?? 0;
  let reflectRanThisTurn = false;
  // Set by whichever source actually FAILED — reflect's catch, or a pages/recall helper returning
  // undefined. An empty answer is not a failure: a source can legitimately have nothing to say on a
  // sparse bank (diag records reflect_empty), and reporting that would tell the user the plugin
  // broke on exactly the sessions where it did not.
  let reflectFailed = false;
  // Set when reflect timed out / 5xx'd and a retrieval-only fallback supplied the memory instead.
  let fallback: string | null | undefined;
  const deferInitialReflect = cached.deferInitialReflect === true;
  if (deferInitialReflect) {
    // A new bank has no useful history yet. Do not burn the once-per-session synthesis on prompt
    // one; this marker is deliberately consumed below so prompt two remains eligible to reflect.
    diag(harness, "reflect_deferred_new_bank", { query: prompt.slice(0, 80) });
  } else if (cfg.autoInject === "pages" && reflectAnswer === undefined) {
    reflectRanThisTurn = true;
    reflectAttempts++;
    const got = await injectPages(
      harness,
      prompt,
      client,
      cfg.injectTimeoutMs,
      "inject_pages",
      PAGE_INJECT_LEAD
    );
    // `undefined` is the search FAILING, distinct from `null` (it ran, nothing matched). These
    // modes stayed silent on a failure while reflect announced one — the same turn looked healthy
    // whether memory was unavailable or simply had nothing to say.
    if (got === undefined) reflectFailed = true;
    reflectAnswer = resolveInjection(got, reflectAttempts);
  } else if (cfg.autoInject === "recall" && reflectAnswer === undefined) {
    reflectRanThisTurn = true;
    reflectAttempts++;
    const got = await injectRecall(
      harness,
      prompt,
      client,
      cfg.injectTimeoutMs,
      "inject_recall",
      RECALL_INJECT_LEAD
    );
    if (got === undefined) reflectFailed = true; // see the pages branch above
    reflectAnswer = resolveInjection(got, reflectAttempts);
  } else if (cfg.autoInject === "reflect" && reflectAnswer === undefined) {
    reflectRanThisTurn = true;
    reflectAttempts++;
    const t0 = Date.now();
    // Previously clamped to a hardcoded 20s, which made a raised reflectTimeoutMs dead config on
    // this path (#4398); the 20s now lives in the default instead. Not clamped: a user who raises reflectTimeoutMs past the host's prompt-hook timeout (30s on
    // the hook harnesses) must raise that too — see the README's reflectTimeoutMs row.
    const timeoutMs = cfg.reflectTimeoutMs;
    try {
      reflectAnswer = await client.reflect(buildReflectQuery(prompt), {
        // Automatic reflection runs inside the host's hook window. Hindsight's low budget is the
        // supported default for bounded reflect calls; callers that explicitly invoke the MCP
        // tool still get the deeper high-budget path.
        budget: "low",
        timeoutMs,
      });
      diag(harness, reflectAnswer ? "reflect_ok" : "reflect_empty", {
        ms: Date.now() - t0,
```

</details>

**依据 11 · 源码核查**：[hindsight-integrations/coding-agents/src/core/hook.ts:348-394](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/hook.ts#L348-L394)

页面名录cadence、缓存和只在检索发生时注入。

<details>
<summary>查看原文（47行）</summary>

```text
  // ── knowledge-page roster (ids + titles only): refreshed on the cadence ────────
  const cadence = cfg.pageRefreshEveryTurns;
  const stale = !cached.pages || (cadence > 0 && turns - cached.pages.atTurn >= cadence);
  let pages = cached.pages?.list ?? [];
  if (stale) {
    const t0 = Date.now();
    try {
      pages = parsePageList(await client.listPages());
      diag(harness, "pages_ok", { ms: Date.now() - t0, count: pages.length });
    } catch (e) {
      diag(
        harness,
        client.knowledgePagesSupported === false ? "knowledge_pages_unavailable" : "pages_failed",
        {
          ms: Date.now() - t0,
          error: describeError(e),
        }
      );
    }
  }

  writeSessionCache(cacheFile, {
    turns,
    reflectAnswer,
    reflectAttempts,
    pages: { atTurn: stale ? turns : (cached.pages?.atTurn ?? turns), list: pages },
  } satisfies SessionCache);

  const blocks: string[] = [];
  // Hook-injected context lands in the USER MESSAGE and persists in the transcript — unlike a
  // system prompt, it accumulates. The reflect block is injected exactly ONCE, the turn reflect
  // ran. No cadence re-injection: replaying the turn-1 synthesis at arbitrary later turns reads
  // as random noise once the session drifts, and the agent holds hindsight_reflect for a FRESH
  // pass if compaction or drift makes it need memory again.
  if (reflectAnswer && reflectRanThisTurn) blocks.push(buildSystemInjection(reflectAnswer));
  // Knowledge pages are NOT auto-injected: the agent pulls them through
  // hindsight_search_knowledge_pages when a question warrants it — an unprompted injection on
  // every turn (even a plain "yes") read as phantom research. The roster below keeps the tool
  // and the page names in front of the agent.
  if (cadence > 0 && turns % cadence === 0) {
    blocks.push(
      buildRosterRefresh(pages, {
        reflectOnNewGoals: cfg.autoInject !== "reflect",
        extra: cfg.toolGuideExtra,
      })
    );
  }
```

</details>

**依据 12 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:375-417](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/dsh.ts#L375-L417)

工具错误转换、模板注册与调用者workspace重绑定。

<details>
<summary>查看原文（43行）</summary>

```text
  return { type: "object", properties, ...(required.length ? { required } : {}) };
}

/** The tool bodies return MCP-shaped results and never throw; dsh wants a value or a throw. */
async function runSpec(spec: ToolSpec, args: Record<string, unknown>): Promise<string> {
  const result = await spec.handler(args);
  const text = (result.content || []).map((block) => block.text).join("\n");
  // dsh normalizes a thrown tool body into an isError result with this message, which is exactly
  // what our isError:true means — mapping it any other way would report a failure as a success.
  if (result.isError) throw new Error(text || "hindsight tool failed");
  return text;
}

/**
 * Register the hindsight_* suite on `ctx.tools`.
 *
 * The dsh tools registry is host+per-scope layered, so a host-plane registration is visible to
 * every agent — including the Web surface's per-session agent presets. Each call resolves the bank
 * from the CALLING agent's workspace, because one process serves many repositories.
 */
function registerTools(toolCtx: DshToolContext, fallbackRoot: string): void {
  // The registry is populated at plugin load, before any session exists, so the NAMES and schemas
  // come from the launch directory's workspace and each call rebinds to its own caller's bank. The
  // one consequence: if memory is off for the launch directory specifically (a `banks.<id>`
  // opt-out) the tools are absent even for other repositories this process later serves.
  const template = workspaceFor(fallbackRoot);
  if (!template) return; // memory disabled where this process was launched
  for (const spec of specsOf(template)) {
    toolCtx.tools.register({
      name: spec.name,
      description: spec.description,
      parameters: toDshParameters(spec),
      output: {
        schema: { type: "string" },
        render: (_args: unknown, value: string) => [{ type: "text", text: value }],
      },
      async execute(args: Record<string, unknown>, exec: DshToolRunContext): Promise<string> {
        // Bind to the caller's repository, not to whichever workspace happened to load first.
        const workspace = exec?.agent ? workspaceForAgent(exec.agent) : template;
        if (!workspace) return "Hindsight memory is disabled for this workspace.";
        const bound = specsOf(workspace).find((candidate) => candidate.name === spec.name);
        if (!bound) return `Hindsight tool ${spec.name} is unavailable.`;
        return runSpec(bound, args);
```

</details>

**依据 13 · 源码核查**：[hindsight-integrations/coding-agents/src/core/knowledge-tools.ts:313-332](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/knowledge-tools.ts#L313-L332)

capture工具直接调用client，描述不是独立批准门。

<details>
<summary>查看原文（20行）</summary>

```text
        "id — from hindsight_list_knowledge_pages, or the id this tool returned earlier — to record a " +
        "plan change or an enhancement to it.\n\n" +
        "Returns the page id. The page is generated for you — you never format one yourself.",
      inputSchema: {
        title: z.string(),
        summary: z.string(),
        relates_to_page_id: z.string().optional(),
      },
      annotations: NON_DESTRUCTIVE_WRITE_ANNOTATIONS,
      handler: guarded(async ({ title, summary, relates_to_page_id }) =>
        client.captureInitiative({
          title,
          summary,
          relatesToPageId: relates_to_page_id,
          ...(opts.stampFor ? { stamp: opts.stampFor() } : {}),
          ...(opts.pageTrigger ? { pageTrigger: opts.pageTrigger } : {}),
        })
      ),
    },
    {
```

</details>

**依据 14 · 源码核查**：[hindsight-integrations/coding-agents/src/core/knowledge-tools.ts:333-373](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/knowledge-tools.ts#L333-L373)

ingest工具真实retain远端写入。

<details>
<summary>查看原文（41行）</summary>

```text
      name: "hindsight_ingest_document",
      description:
        "Save an external document or a block of durable notes/findings into this repository's " +
        "memory so it informs future recall and pages. Use for design notes, research, or " +
        "reference material you want remembered — not for the conversation you're already in " +
        "(that's captured automatically at session end). This is ALSO the correction mechanism: " +
        "when you verify that a retrieved memory is wrong or outdated, ingest a document titled " +
        "'Correction: <topic>' stating what memory claimed, what is actually true, and the " +
        "evidence — the newer fact supersedes the stale one in future retrieval.",
      inputSchema: { title: z.string(), content: z.string() },
      annotations: NON_DESTRUCTIVE_WRITE_ANNOTATIONS,
      handler: guarded(async ({ title, content }) => {
        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        // ASCII-only slugs erased non-Latin titles (or shared the "doc" fallback),
        // overwriting unrelated documents. Hash the original title, not its content,
        // so re-ingestion still updates it; "--" cannot occur in a legacy slug.
        const docId =
          /[^\x00-\x7f]/.test(title) || !slug
            ? `${slug || "doc"}--${createHash("sha256").update(title).digest("hex")}`
            : slug;
        const stamp = opts.stampFor?.();
        const metadata = {
          ...stamp?.metadata,
          ...(opts.harness ? { harness: opts.harness } : {}),
        };
        await client.retain(
          content,
          "ingested document",
          docId,
          [
            ...new Set([
              ...(stamp?.tags ?? []),
              "source:upload",
              ...(opts.harness ? [`harness:${opts.harness}`] : []),
            ]),
          ],
          "document",
          Object.keys(metadata).length ? { metadata } : {}
```

</details>

**依据 15 · 源码核查**：[hindsight-integrations/coding-agents/src/core/config.ts:575-587](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/config.ts#L575-L587)

autoInject实际默认reflect，非每轮无条件重新综合。

<details>
<summary>查看原文（13行）</summary>

```text
/** Apply defaults to a raw (file) config. Pure — the single place the defaults live. */
export type AutoInject = "reflect" | "pages" | "recall" | "none";
const AUTO_INJECT_MODES: readonly AutoInject[] = ["reflect", "pages", "recall", "none"];

/** `autoInject` wins; otherwise the deprecated `autoReflect: false` means "none". */
function resolveAutoInject(raw: RawConfig): AutoInject {
  if (raw.autoReflect !== undefined) {
    const replacement = raw.autoReflect === false ? "none" : "reflect";
    log.warn("config", `autoReflect is deprecated — use autoInject: "${replacement}" instead`);
  }
  if (AUTO_INJECT_MODES.includes(raw.autoInject as AutoInject)) return raw.autoInject as AutoInject;
  return raw.autoReflect === false ? "none" : "reflect";
}
```

</details>

**依据 16 · 源码核查**：[hindsight-integrations/coding-agents/src/core/bank.ts:176-186](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/bank.ts#L176-L186)

gitProject实际取主工作树basename；命名不能当唯一项目身份。

<details>
<summary>查看原文（11行）</summary>

```text
function gitProjectName(directory: string, resolveWorktrees: boolean, sessionRoot = ""): string {
  if (resolveWorktrees) {
    const projectRoot = mainWorktreeRoot(directory, sessionRoot);
    if (projectRoot.status === "resolved") return basename(projectRoot.root);
    // The fallback below is right for a directory outside any repository and WRONG for a failed
    // probe inside one — for a linked worktree it names the worktree instead of the repo, forking
    // it into a bank of its own, forever and silently (#3950). Refuse to guess instead.
    if (projectRoot.status === "failed") {
      throw new BankResolutionError(
        `git probe failed for ${directory} (${projectRoot.reason}) — refusing to guess a bank id`
      );
```

</details>

#### 缺口

- 没有实际 Host/服务 ACL、两个同名repo和配置变更后的bank读写验证。
  **影响**：bank命名不等于数据隔离；工具是否暴露、返回内容与默认兼容均需确认。
  **进一步探讨**：用虚构双项目/同名目录核实际bank和工具调用，分别验证启动目录禁用、无调用Agent与权限拒绝。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 停止回合到 retain，确认、失败与数据外发有哪些实际边界？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

turn-stopping 真正 await core.onSessionIdle；但它只是读取转录、记录本地usage、在retainSessions开启且转录变长时更新retainedTurns并启动后台retain，不等待远端提取完成。转录从snapshotEvents优先、旧events回退，fork切掉inheritedEventCount；只收人类source=user与助手文本及紧凑tool/call，不收tool/result或插件注入。actionLine只取第一目标/命令/URL首行并截100字符，减少噪声但不是敏感信息脱敏，人类/助手文本和命令目标仍可能含秘密。

后台链先ensureDaemon，再retainLiveSession，按每session串行计划replace/append，用bank/document/内容构造operationId，cursor带dirty或pending再提交，成功后推进；本DSH RuntimeCore使用memoryCursorStore，pending只在进程内，不是磁盘持久outbox。onSessionIdle在后台请求前已设置retainedTurns，失败而转录不增长时同一内容不会由该门立即再发；后续新转录可能重放或replace。DSH disposed只删liveAgent，没有调用core.flush的退出接线，不能把共享核心存在flush函数当已等待DSH退出保存。

更窄且重要的回执问题：HindsightClient.retain 用async:true提交，不等待提取；响应JSON里的operation_id缺失或解析失败会被忽略。共享req又将404排除在非ok抛错之外，retain未另验r.ok，所以在服务对该写入返回404的条件下仍可能resolve，进而写cursor/retain_ok诊断。这是当前客户端可达接受边界，未访问服务或复现真实丢数据；正常网络/其他非容忍HTTP失败有抛错、重试/retain_failed，不是所有异常都吞掉。即使有operation_id也只证明入队，后续settleOps另行检查且下次才可能触发，不能把turn-stopping或retain_ok当持久、提取成功和可召回。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:141-157](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/dsh.ts#L141-L157)

新旧事件读取和fork继承前缀切除。

<details>
<summary>查看原文（17行）</summary>

```text
export function dshSessionEvents(
  session: Pick<DshSession, "snapshotEvents" | "events">
): readonly DshSessionEvent[] {
  return session.snapshotEvents?.() ?? session.events ?? [];
}

/**
 * The events this session produced itself — what its write-back saves. A fork saves only its new
 * turns (#5940): the prefix it inherited is the parent's conversation, which the parent already
 * stores, and the child's first write-back used to send all of it again under its own document,
 * re-extracting history the bank already held. The full log is still what the model sees, so
 * everything else (the injection dedupe below) reads `dshSessionEvents`.
 */
export function ownEvents(
  session: Pick<DshSession, "snapshotEvents" | "events" | "inheritedEventCount">
): readonly DshSessionEvent[] {
  return dshSessionEvents(session).slice(session.inheritedEventCount ?? 0);
```

</details>

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:321-338](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/dsh.ts#L321-L338)

stop await onSessionIdle及disposed仅删除liveAgents。

<details>
<summary>查看原文（18行）</summary>

```text
    async turnStopping({ agent }: { agent: DshAgent }): Promise<void> {
      const workspace = resolve(agent);
      if (!workspace) return;
      const sessionId = agent.session.header.id;
      liveAgents.set(sessionId, agent);
      // The stop boundary is the only moment the completed exchange is readable, so this bypasses
      // the turn cadence exactly like the opencode idle path it shares (`onSessionIdle`).
      await workspace.core.onSessionIdle(sessionId);
    },

    disposed({ agent }: { agent: DshAgent }): void {
      liveAgents.delete(agent.session.header.id);
    },
  };
}

// ── native tools ────────────────────────────────────────────────────────────────

```

</details>

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/core/transcript-dsh.ts:78-107](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/transcript-dsh.ts#L78-L107)

实际人类/助手/action筛选，原始tool结果不进入此转录。

<details>
<summary>查看原文（30行）</summary>

```text
    if (event.type === "user/message") {
      const message = event.data as DshMessage | undefined;
      if (!message || message.source?.kind !== "user") continue;
      const text = stripInjectedMemory(textOf(message)).trim();
      if (text) turns.push({ role: "user", content: text, ...stamp });
    } else if (event.type === "assistant/message") {
      const message = (event.data as { message?: DshMessage } | undefined)?.message;
      if (!message) continue;
      const text = stripInjectedMemory(textOf(message)).trim();
      if (text) turns.push({ role: "assistant", content: text, ...stamp });
    } else if (event.type === "tool/call") {
      const call = event.data as { name?: string; arguments?: string } | undefined;
      if (!call?.name) continue;
      turns.push({
        role: "action",
        content: actionLine(call.name, parseArgs(call.arguments)),
        ...stamp,
      });
    }
  }
  return turns;
}

/** `tool/call.arguments` is the model's RAW JSON string, unparsed by design. */
function parseArgs(raw: string | undefined): unknown {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return raw; // a malformed argument string still names what the model was reaching for
```

</details>

**依据 4 · 源码核查**：[hindsight-integrations/coding-agents/src/core/transcript-util.ts:34-68](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/transcript-util.ts#L34-L68)

动作目标键、100字符截断与首行；不是普遍脱敏。

<details>
<summary>查看原文（35行）</summary>

```text
  "path",
  "notebook_path",
  "command",
  "pattern",
  "query",
  "url",
  "name",
  "id",
] as const;

const ACTION_TARGET_CAP = 100;

/**
 * Compact one tool call into an action line: the tool name plus its primary target — a file path,
 * command, pattern, … — with NO full arguments and NO output (e.g. `Edit boltons/strutils.py`).
 * Retaining raw args/outputs buries the session's decisions in mechanical noise; the extractor only
 * needs WHAT was touched.
 */
export function actionLine(tool: string, input: unknown): string {
  let target = "";
  if (input && typeof input === "object") {
    const rec = input as Record<string, unknown>;
    for (const k of TARGET_KEYS) {
      const v = rec[k];
      if (typeof v === "string" && v.trim()) {
        target = v.trim().split("\n")[0];
        break;
      }
    }
  } else if (typeof input === "string") {
    target = input.trim().split("\n")[0];
  }
  if (target.length > ACTION_TARGET_CAP) target = `${target.slice(0, ACTION_TARGET_CAP)}…`;
  return target ? `${tool} ${target}` : tool;
}
```

</details>

**依据 5 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:282-304](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/runtime.ts#L282-L304)

变长门及提交前推进retainedTurns。

<details>
<summary>查看原文（23行）</summary>

```text
  async onSessionIdle(sessionId: string): Promise<void> {
    if (process.env.HINDSIGHT_DISABLE_HOOKS) return; // anti-recursion (see seedIfCold)
    if (!sessionId || !this.fetchTranscript) return;
    let turns: TransportTurn[];
    try {
      turns = await this.fetchTranscript(sessionId);
    } catch (e) {
      diag(this.harness, "idle_fetch_failed", {
        error: describeError(e),
        session: sessionId,
      });
      return;
    }
    if (!turns.length) return;
    this.recordUsage(sessionId, turns, true); // idle: the reply is in
    if (!this.writeBackEnabled) return; // usage above is local and recorded regardless (#5391)
    const st = this.stateFor(sessionId);
    // idle can fire more than once for one exchange (and again on a session with no new activity);
    // only retain when this transcript actually grew past what we last wrote.
    if (turns.length <= st.retainedTurns) return;
    st.retainedTurns = turns.length;
    this.retain(sessionId, turns, st.startTs, "idle");
  }
```

</details>

**依据 6 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:352-395](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/runtime.ts#L352-L395)

真实异步retain、成功/失败日志及inFlight。

<details>
<summary>查看原文（44行）</summary>

```text
  private retain(
    sessionId: string,
    turns: TransportTurn[],
    startTs: string,
    trigger = "turn"
  ): void {
    const t0 = Date.now();
    // Daemon mode: the write path is the last chance to get a daemon up — the Stop-hook role, for
    // hosts that have no Stop hook. A daemon that died mid-session would otherwise take the whole
    // exchange with it. The wait sits INSIDE the fire-and-forget chain, so
    // unlike the Stop hook it costs the host nothing: this call already returns before the retain
    // does. Deliberately not gated on the result — retain proceeds either way, so an unreachable
    // daemon produces the same `retain_failed` diagnostic as an unreachable Cloud server.
    const write = ensureDaemon(this.cfg, this.harness, { waitMs: DAEMON_WAIT_RETAIN_MS })
      .then(() =>
        retainLiveSession(this.client, sessionId, turns, startTs, this.harness, {
          cursors: this.cursors,
          stamp: buildRetainStamp(this.cfg, {
            directory: this.projectDir,
            harness: this.harness,
            bankId: this.bankId,
            sessionId,
          }),
        })
      )
      .then(() =>
        diag(this.harness, "retain_ok", {
          ms: Date.now() - t0,
          turns: turns.length,
          session: sessionId,
          trigger,
        })
      )
      .catch((e) =>
        diag(this.harness, "retain_failed", {
          ms: Date.now() - t0,
          error: describeError(e),
          session: sessionId,
          trigger,
        })
      );
    this.inFlight.add(write);
    void write.finally(() => this.inFlight.delete(write));
  }
```

</details>

**依据 7 · 源码核查**：[hindsight-integrations/coding-agents/src/core/retain-cursor.ts:237-243](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/retain-cursor.ts#L237-L243)

DSH共享runtime选择的cursor仅Map。

```text
export function memoryCursorStore(): RetainCursorStore {
  const cursors = new Map<string, RetainCursor>();
  return {
    read: (sessionId) => cursors.get(sessionId),
    write: (sessionId, cursor) => void cursors.set(sessionId, cursor),
  };
}
```

**依据 8 · 源码核查**：[hindsight-integrations/coding-agents/src/core/chat.ts:300-315](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/chat.ts#L300-L315)

按cursor/session串行writeSession。

<details>
<summary>查看原文（16行）</summary>

```text
  // Serialised so the plan is made against the previous write-back's CONFIRMED cursor (see above).
  return serialize(cursors, sessionId, () =>
    writeSession(
      client,
      sessionId,
      turns,
      startTs,
      harness,
      opts.stamp,
      cursors,
      opts.retryUntil,
      opts.transcriptPath
    )
  );
}

```

</details>

**依据 9 · 源码核查**：[hindsight-integrations/coding-agents/src/core/chat.ts:346-375](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/chat.ts#L346-L375)

append能力/未完成操作检查与pending选择。

<details>
<summary>查看原文（30行）</summary>

```text
    });
  const segments = advanceSegments(cursor, client.bank);
  // Only an append can build on a lost write; a replace already re-sends everything. The ops of a
  // bank the session just left would be looked up in this one, so they are not checked.
  let ops: string[] = [];
  if (appendSupported && cursor?.ops?.length && !cursor.dirty && !moved)
    ({ cursor, ops } = await settleOps(client, cursor));
  const plan = planRetain(turns, cursor, {
    appendSupported,
    bank: client.bank,
    path: transcriptPath,
  });
  // Recorded whenever the probe ran, so a deployment where append never activates shows up in the
  // diag trail instead of only as oversized retains (#5286). A cached "yes" is not re-logged.
  if (probed) diag(harness ?? "", "retain_mode", { mode: plan.mode, appendSupported });
  // Which files the document holds after this write-back. A replace rebuilds it from THIS file
  // alone, so it forgets the others — which is what lets the file it dropped be appended back as a
  // segment on its next hook, rather than replacing again.
  const paths =
    plan.mode === "replace"
      ? transcriptPath
        ? [transcriptPath]
        : undefined
      : advancePaths(cursor?.paths, transcriptPath);
  // Appends built but never confirmed. A replace rewrites the whole document from the same
  // transcript, so it SUBSUMES them; on every other path they go out first, oldest first, before
  // anything new — the document only ever grows in transcript order. Buffered appends of the bank
  // the session just left belong to THAT document, so they are never replayed into this one.
  const outbox = plan.mode === "replace" || moved ? [] : (cursor?.pending ?? []);
  if (plan.mode === "skip" && !outbox.length) return;
```

</details>

**依据 10 · 源码核查**：[hindsight-integrations/coding-agents/src/core/chat.ts:437-453](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/chat.ts#L437-L453)

replace先dirty、submit后cursor accepted。

<details>
<summary>查看原文（17行）</summary>

```text
    // were written to (#5812). A move with nothing new since has no share to start a document with.
    const share = bankTurns(turns, segments, client.bank);
    if (!share.length) return;
    const content = renderSessionJsonl(refId, share, startTs);
    // Nothing to buffer: replace is idempotent by construction, so a later one re-establishes the
    // same truth from the same transcript. Claim the position unconfirmed so an outcome we never
    // learn resolves to another replace rather than an append onto an unknown state.
    // The id also names what the document held before, from the cursor: content alone repeats
    // when a session returns to an earlier branch (A → B → A), and the server acknowledges a
    // completed id without applying it, leaving B stored (#5845). A retry still has the same base.
    const base = cursor ? `${cursor.turns}\n${cursor.fingerprint}` : "";
    cursors?.write(sessionId, { ...next, dirty: true });
    const operationId = opId("replace", `${base}\n${content}`);
    await submitWithRetry(() => submit(content, operationId, false), stillOurs, retryUntil);
    ops = []; // the replace re-sends every turn, so nothing older can still lose any
    cursors?.write(sessionId, accepted(operationId));
    return;
```

</details>

**依据 11 · 源码核查**：[hindsight-integrations/coding-agents/src/core/chat.ts:464-489](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/chat.ts#L464-L489)

append先存pending，成功后推进；存储耐久性由cursor实现决定。

<details>
<summary>查看原文（26行）</summary>

```text

  // Claim the position BEFORE the request, WITH the bytes: a rejected retain — or a process the
  // host kills mid-write — leaves a replayable buffer rather than a cursor that can only be
  // recovered by re-sending (and re-extracting) the entire transcript, forever, for the rest of the
  // session (#3989). Replay is safe precisely because the bytes and the operation id are unchanged:
  // a write the server DID commit collapses into that same operation instead of appending twice,
  // which is the one thing appending onto an unknown state could otherwise get wrong.
  cursors?.write(sessionId, { ...accepted(), pending: queue });
  for (let i = 0; i < queue.length; i++) {
    // One request per entry, each able to burn the full 15s abort — where this used to send exactly
    // once. Never START one that cannot finish inside the caller's budget: a hook harness is killed
    // by its host at `retryUntil` (retain-hook's hostDeadline), and a flush that overruns it buys
    // nothing. The first entry always goes out, so a chronically short budget still makes progress;
    // whatever is left is already durable, so the next write-back sends it.
    if (i > 0 && Date.now() + REQUEST_BUDGET_MS > retryUntil) return;
    const entry = queue[i];
    await submitWithRetry(
      () => submit(entry.content, entry.operationId, true),
      stillOurs,
      retryUntil
    );
    // Confirmed: drop it immediately, so a failure on a LATER entry cannot resubmit it as part of
    // the next flush. Whatever is still queued when this throws is what the next flush replays.
    const remaining = queue.slice(i + 1);
    const done = accepted(entry.operationId);
    cursors?.write(sessionId, remaining.length ? { ...done, pending: remaining } : done);
```

</details>

**依据 12 · 源码核查**：[hindsight-integrations/coding-agents/src/core/hindsight.ts:468-497](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/hindsight.ts#L468-L497)

req只对非ok且非404/非tolerate抛错。

<details>
<summary>查看原文（30行）</summary>

```text
    method: string,
    url: string,
    body?: unknown,
    tolerate: number[] = [],
    timeoutMs = 15_000
  ): Promise<Response> {
    // Hard cap on EVERY request: a stalled server (pool deadlock, network) must degrade to a
    // memoryless turn — never hang a host that awaits us (opencode blocks its BOOT on plugin init).
    const payload = body ? JSON.stringify(body) : undefined;
    let r: Response;
    for (let attempt = 0, waited = 0; ; attempt++) {
      r = await this.fetchWithAuth(url, {
        method,
        body: payload,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (r.status !== 429 || tolerate.includes(429)) break;
      const asked = retryAfterMs(r.headers.get("retry-after"));
      const backoff = Math.min(RETRY_AFTER_CEILING_MS, RATE_LIMIT_BACKOFF_MS * 2 ** attempt);
      const wait =
        Math.min(RETRY_AFTER_CEILING_MS, Math.max(asked, backoff)) * (1 + Math.random() / 2);
      if (waited + wait > this.rateLimitPatienceMs) throw new RateLimitedError(asked);
      await sleep(wait);
      waited += wait;
    }
    if (!r.ok && r.status !== 404 && !tolerate.includes(r.status))
      throw new Error(
        `${method} ${url} -> ${r.status} ${await r.text()}${this.authHint(r.status)}`
      );
    return r;
```

</details>

**依据 13 · 源码核查**：[hindsight-integrations/coding-agents/src/core/hindsight.ts:500-533](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/hindsight.ts#L500-L533)

写请求async:true；operation_id缺失/坏JSON未拒绝。

<details>
<summary>查看原文（34行）</summary>

```text
  /** Retain one memory. ALWAYS async: enqueue extraction server-side and collect its op-id for
   *  drain(). Nothing in this plugin can afford to block a coding agent's hook on extraction. */
  async retain(
    content: string,
    context: string,
    documentId: string,
    tags: string[],
    strategy: string,
    opts: RetainOpts = {}
  ): Promise<void> {
    const item: Record<string, unknown> = {
      content,
      context,
      document_id: documentId,
      tags,
      strategy,
      // Sent on EVERY retain, including the server default `combined`, so the scoping a bank's
      // observations were built under is a property of the write rather than of whichever server
      // version happened to process it. Servers older than 0.4.15 ignore the field.
      observation_scopes: resolveRetainScopes(tags, this.observationScopes),
    };
    if (opts.timestamp) item.timestamp = opts.timestamp;
    if (opts.metadata) item.metadata = opts.metadata;
    if (opts.updateMode) item.update_mode = opts.updateMode;
    const body: Record<string, unknown> = { items: [item], async: true };
    if (opts.operationId) body.operation_id = opts.operationId;
    const r = await this.req("POST", this.bankUrl("/memories"), body);
    try {
      const j = (await r.json()) as { operation_id?: string };
      if (j.operation_id) this.opIds.push(j.operation_id);
    } catch {
      /* ignore */
    }
  }
```

</details>

#### 缺口

- 远端对retain的404/operation_id契约、提取终态和读回完整率未核实。
  **影响**：不能凭retain_ok承诺保存；进程结束、缺回执或服务协议不匹配可能留下未确认状态。
  **进一步探讨**：用伪服务分别返回404、空/坏JSON、缺opid及延迟/失败提取，核cursor、日志、重启和实际读回。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 自动后台行为、配置与退出的全周期代价是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、工程质量与复用

#### 完整回答

默认配置是cloud URL、disabled=false、optInOnly=false、retainSessions=true，并开启autoSeed/codebaseSurvey/autoUpdate；不能把“本地编码插件”理解为资料默认留本地。启动会sync companion skill，ensureDaemon仅daemon模式生效，冷检查在服务可读时启动detached deepen进程，冷bank还可启动代码survey；这些是独立后台工作，不只是聊天中的一次检索。默认gitIngest=message和surveyBudgetUsd=2是配置值，不是每次实际账单或全局硬成本保证。本轮未全审deepen/survey提取内容，试用应先关闭自动seed/survey并用虚构内容。

daemon模式使用127.0.0.1的配置端口，ensure健康/前提后spawn node daemon-start.js，后者实际交给HindsightServer.start。它可下载/启动额外服务，单会话停止不会清理共享daemon；无需Cloud账号也仍可能需要本地提取模型资源/凭据。autoUpdate默认true但实际只对可证明npx管理的staged runtime、满足间隔/版本/工具条件才spawn npx … update，普通DSH profile包不能被一概说成会自更新。为固定复现实验需显式关autoUpdate。

首次要核正确workspace、独立bank、server URL、凭据与写权限，配置全局/harness/path/bank继承，并确认插件工具远端写。持续有反射/提取/页面/网络、模型token/本地CPU存储与人工审查过时事实，现金及分钟未知。停用插件或retainSessions=false不能删除服务中已有资料，后者只关会话写回，不等于关闭所有工具/seed。workspace配置缓存还意味着改disabled/bank后不应假定已活跃runtime立即重建，需重启并核实际生效。

建议有Hindsight维护经验者在虚构仓库和独立测试bank先验证召回/写入读回；明确关闭不需要的自动后台路径/自动更新并停进程核日志。出现跨项目或弱回执、未确认提取、意外后台处理就暂停并用人工摘要；退出须单独查远端删除/保留政策、停止共享daemon/后台进程和保管本地日志，不假定卸载即抹除。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/src/core/config.ts:590-623](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/config.ts#L590-L623)

默认cloud URL、disabled/optInOnly/retainSessions真实对象。

<details>
<summary>查看原文（34行）</summary>

```text
  const serverMode = ["cloud", "self-hosted", "daemon"].includes(raw.serverMode as string)
    ? (raw.serverMode as "cloud" | "self-hosted" | "daemon")
    : "cloud";
  const apiPort = raw.apiPort || DEFAULT_DAEMON_PORT;
  const pageTrigger = resolvePageTrigger(raw);
  return {
    serverMode,
    // Daemon mode resolves the URL HERE rather than at each call site: every entry point already
    // builds its client from cfg.apiUrl, so collapsing the mode into that one field means the
    // daemon needs no plumbing through eight separate constructors.
    apiUrl:
      serverMode === "daemon"
        ? `http://127.0.0.1:${apiPort}`
        : (raw.apiUrl ?? "https://api.hindsight.vectorize.io"),
    apiToken: raw.apiToken || undefined,
    apiPort,
    daemonIdleTimeout: raw.daemonIdleTimeout,
    daemonProfile: raw.daemonProfile || DEFAULT_DAEMON_PROFILE,
    embedVersion: raw.embedVersion || undefined,
    embedPackagePath: raw.embedPackagePath || undefined,
    bankId: raw.bankId,
    dynamicBankId: raw.dynamicBankId,
    bankIdTemplate: raw.bankIdTemplate,
    mapPathToBank: raw.mapPathToBank,
    resolveWorktrees: raw.resolveWorktrees,
    optInOnly: raw.optInOnly ?? false,
    // Same shape as retainTags: a config typo must not become a path that silently approves nothing.
    optInPaths: Array.isArray(raw.optInPaths)
      ? raw.optInPaths.filter((p): p is string => typeof p === "string" && p.trim() !== "")
      : [],
    harness: raw.harness ?? "opencode",
    disabled: raw.disabled ?? false,
    retainSessions: raw.retainSessions ?? true, // write sessions back by default, every harness
    manageBankConfig: raw.manageBankConfig ?? true,
```

</details>

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/core/config.ts:655-671](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/config.ts#L655-L671)

autoSeed/survey/gitIngest的真实默认值。

<details>
<summary>查看原文（17行）</summary>

```text
    // with no wording change at all. The cost is the guide's ~2KB re-sent per turn, which caches.
    pageRefreshEveryTurns: raw.pageRefreshEveryTurns || 1,
    pageTriggerType: pageTrigger.type,
    pageTriggerCron: pageTrigger.cron,
    pages: resolvePages(raw.pages),
    customPages: resolveCustomPages(raw.customPages),
    autoSeed: raw.autoSeed ?? true,
    seedLimit: raw.seedLimit || DEFAULT_SEED_LIMIT,
    codebaseSurvey: raw.codebaseSurvey ?? true,
    surveyModel: raw.surveyModel || "haiku",
    surveyBudgetUsd: raw.surveyBudgetUsd || 2,
    surveyRefreshCommits: raw.surveyRefreshCommits ?? 20,
    gitIngest: ["message", "full", "none"].includes(raw.gitIngest as string)
      ? (raw.gitIngest as "message" | "full" | "none")
      : "message",
    // Hostile input is a config typo, not an attack: keep only string entries so a stray number or
    // nested object cannot reach the API as a tag and fail the whole retain.
```

</details>

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/core/config.ts:687-694](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/config.ts#L687-L694)

autoUpdate真实默认true。

```text
    observationScopes: resolveObservationScopes(raw.observationScopes),
    banks: raw.banks && typeof raw.banks === "object" ? raw.banks : {},
    paths: raw.paths && typeof raw.paths === "object" ? raw.paths : {},
    logLevel: ["debug", "info", "warn", "error"].includes(raw.logLevel as string)
      ? (raw.logLevel as "debug" | "info" | "warn" | "error")
      : "info",
    autoUpdate: raw.autoUpdate ?? true,
  };
```

**依据 4 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:118-151](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/runtime.ts#L118-L151)

启动实际skill同步、daemon与自动更新、seed上下文调用。

<details>
<summary>查看原文（34行）</summary>

```text
  async seedIfCold(repoPath: string | undefined): Promise<void> {
    // Anti-recursion: a headless survey session runs the agent (which loads this plugin) with
    // HINDSIGHT_DISABLE_HOOKS=1 — the tools stay registered (toolSpecs, so the survey can ingest),
    // but seeding/recall/write-back must no-op or the survey would re-seed itself (see core/survey.ts).
    if (process.env.HINDSIGHT_DISABLE_HOOKS) return;
    // Companion skill, the same housekeeping `runSessionStartHook` does for hook harnesses — but
    // with `install`, because a persistent-plugin host can be wired by its OWN plugin manager
    // (`dsh plugin add …`, `cline plugin install`), a route our installer never sees, leaving the
    // plugin loaded with its tools registered and no skill on disk at all (#4406). No-op for a host
    // with no skills directory (opencode; opencode2 registers it in memory instead).
    syncCompanionSkill(this.harness, { install: true });
    // Daemon mode: this is the SessionStart of a persistent-plugin host, so it owns the same
    // warm-up the hook harnesses do in `runSessionStartHook` — start it before the user has typed
    // anything, wait only briefly, and let a cold one keep coming up in the background. Without it
    // these hosts never started a daemon at all and every request failed with ECONNREFUSED (#3524);
    // `runSessionStartHook` is a hook-only wrapper, so calling `buildSessionStartContext` directly
    // (as every plugin harness does) skipped the ensure entirely.
    await ensureDaemon(this.cfg, this.harness, { waitMs: DAEMON_WAIT_SESSION_START_MS });
    // Same session-start housekeeping the hook harnesses do in `runSessionStartHook`: a persistent
    // plugin host is a session start too, and leaving it out would mean opencode/Kilo/Cline users
    // never got an update — the parity gap `ensureDaemon` above already had to be fixed for.
    void maybeAutoUpdate(this.cfg);
    try {
      const out = await buildSessionStartContext({
        cwd: repoPath || process.cwd(),
        bankId: this.bankId,
        cfg: this.cfg,
        client: this.client,
        harness: this.harness,
      });
      // The seed note is user-facing; opencode has no visible-system channel at load, so surface it
      // on stderr (shows in the plugin log / console) rather than dropping it.
      // Banner: via the host's toast API when available (stderr corrupts the TUI); always logged.
      if (out.systemMessage) {
```

</details>

**依据 5 · 源码核查**：[hindsight-integrations/coding-agents/src/core/session-start.ts:258-285](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/session-start.ts#L258-L285)

服务可读才启动seed，冷bank有条件启动survey。

<details>
<summary>查看原文（28行）</summary>

```text
        // bank that already holds memories (a shared bank, imported conversations), and a failed
        // or missing probe proves nothing (#5209). Probed before the seed and the survey baseline
        // below write their first documents.
        if (cold === true && client.hasDocuments) {
          bankEmpty = await client.hasDocuments().then(
            (has) => !has,
            () => false
          );
        }
        if (docIds !== undefined) {
          // ALWAYS fire the background deepen engine when the server is reachable — it is
          // idempotent (per-bank lock, dedup by document id) and each run does only the missing
          // work: cold seed, newly appeared conversations, the next per-commit diff batch. The
          // one-time extras stay cold-gated below.
          // Pass the ASKING harness through: without it deepen.js falls back to the config
          // loader's harness default and misfiles this session's survey + git history into the
          // wrong bank (e.g. `opencode::<project>` for a claude-code session). See #3247.
          startSeed(cwd, { limit: cfg.seedLimit, harness });
          // Cold iff the bank has zero source:git docs and no survey baseline (an undefined result
          // — server error — is NOT treated as cold; we never surveyed/noted on an unconfirmed-empty
          // bank).
          if (cold) {
            if (cfg.codebaseSurvey !== false) {
              // Run the survey under the current harness's own CLI (falls back to any available agent).
              const sha = resolveHeadSha(cwd);
              const started = await startSurvey(cwd, {
                harness: harness as SurveyHarness,
                model: cfg.surveyModel,
```

</details>

**依据 6 · 源码核查**：[hindsight-integrations/coding-agents/src/core/seed.ts:21-54](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/seed.ts#L21-L54)

真正spawn node deepen并detached，不是只打印计划。

<details>
<summary>查看原文（34行）</summary>

```text
export function startBackgroundSeed(
  repoDir: string,
  opts: { limit?: number; harness?: string; enginePath?: string; spawn?: typeof realSpawn } = {}
): void {
  try {
    const spawnFn = opts.spawn ?? realSpawn;
    const enginePath =
      opts.enginePath ?? join(dirname(fileURLToPath(import.meta.url)), "deepen.js");
    const limit = opts.limit ?? DEFAULT_SEED_LIMIT;
    // The engine writes the leveled plugin.log itself (core/log.ts), so the child's stdio can be
    // fully detached — no fd redirect to manage.
    const child = spawnFn(
      "node",
      [
        enginePath,
        "--repo",
        repoDir,
        "--gitlog-limit",
        String(limit),
        ...(opts.harness ? ["--harness", opts.harness] : []),
      ],
      {
        detached: true,
        stdio: "ignore",
        windowsHide: true,
      }
    );
    // spawn() failures (ENOENT/EACCES/fd exhaustion/sandboxed environments) often arrive
    // ASYNCHRONOUSLY as an 'error' event on the child, not as a synchronous throw — an
    // unhandled 'error' event would crash the caller. Swallow it: fire-and-forget best-effort.
    child.on("error", () => {});
    child.unref();
  } catch {
    /* best-effort: a failed spawn must not break the caller */
```

</details>

**依据 7 · 源码核查**：[hindsight-integrations/coding-agents/src/core/daemon.ts:278-310](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/daemon.ts#L278-L310)

daemon模式/健康/前提门后启动和等待。

<details>
<summary>查看原文（33行）</summary>

```text
export async function ensureDaemon(
  cfg: Config,
  harness: string,
  opts: { waitMs?: number; spawnFn?: typeof realSpawn } = {}
): Promise<void> {
  if (cfg.serverMode !== "daemon") return;
  if (await isServerHealthy(cfg.apiUrl)) return;
  if (!preflightDaemon(cfg, harness)) return;

  const waitMs = opts.waitMs ?? 0;
  const running = coldStarts.get(cfg.apiUrl);
  if (running) {
    // Join the start already underway instead of spawning a competitor, so a burst costs one
    // starter rather than one per caller. Never for longer than this caller's own budget — a Stop
    // hook waiting 40 s must not push a SessionStart hook past its 30 s timeout — and whatever is
    // left of that budget once the shared attempt settles goes on waiting for the daemon the
    // attempt set in motion, so joining never leaves a caller with less patience than it would
    // have had on its own.
    const startedAt = Date.now();
    // Awaited for its side effect only: a follower does not inherit the attempt's failure.
    await waitBounded(
      running.catch(() => undefined),
      waitMs
    );
    const remaining = waitMs - (Date.now() - startedAt);
    if (remaining > 0) await waitForHealth(cfg.apiUrl, remaining);
    return;
  }

  const attempt = (async () => {
    startDaemonDetached(cfg, harness, opts.spawnFn);
    await waitForHealth(cfg.apiUrl, waitMs);
  })();
```

</details>

**依据 8 · 源码核查**：[hindsight-integrations/coding-agents/src/core/daemon.ts:205-225](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/daemon.ts#L205-L225)

真实detached starter进程。

<details>
<summary>查看原文（21行）</summary>

```text
 * winner started alone — but racing starters are not free: they queue on the profile's file lock.
 */
export function startDaemonDetached(
  cfg: Config,
  harness: string,
  spawnFn: typeof realSpawn = realSpawn
): void {
  try {
    const starter = join(dirname(fileURLToPath(import.meta.url)), "daemon-start.js");
    const child = spawnFn("node", [starter, "--harness", harness], {
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    });
    // spawn() failures often surface ASYNCHRONOUSLY as an 'error' event; unhandled, that would
    // crash the hook.
    child.on("error", () => {});
    child.unref();
    diag(harness, "daemon_start_spawned", { apiUrl: cfg.apiUrl });
  } catch {
    /* best-effort: a failed spawn must not break the caller */
```

</details>

**依据 9 · 源码核查**：[hindsight-integrations/coding-agents/src/daemon-start.ts:21-48](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/daemon-start.ts#L21-L48)

starter实际new HindsightServer并start。

<details>
<summary>查看原文（28行）</summary>

```text
  const cfg = loadConfig({ harness });
  setLogLevel(cfg.logLevel);

  if (cfg.serverMode !== "daemon") return;
  // Several sessions can race to start one daemon; whoever loses simply finds it healthy.
  if (await isServerHealthy(cfg.apiUrl)) return;
  if (!preflightDaemon(cfg, harness)) return;

  const { HindsightServer } = await import("@vectorize-io/hindsight-all");
  const server = new HindsightServer({
    profile: cfg.daemonProfile,
    port: cfg.apiPort,
    env: daemonEnv(cfg),
    embedVersion: cfg.embedVersion,
    embedPackagePath: cfg.embedPackagePath,
    logger: {
      debug: (m) => log.debug(harness, m),
      info: (m) => log.info(harness, m),
      warn: (m) => log.warn(harness, m),
      error: (m) => log.error(harness, m),
    },
  });
  await server.start();
  diag(harness, "daemon_started", { apiUrl: cfg.apiUrl, profile: cfg.daemonProfile });
}

main().catch((error) => {
  diag(arg("harness") ?? "coding-agent", "daemon_start_failed", { error: String(error) });
```

</details>

**依据 10 · 源码核查**：[hindsight-integrations/coding-agents/src/core/auto-update.ts:378-405](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/auto-update.ts#L378-L405)

仅staged且可证明自行更新来源才继续。

<details>
<summary>查看原文（28行）</summary>

```text
export async function maybeAutoUpdate(
  cfg: Pick<Config, "autoUpdate">,
  opts: AutoUpdateOptions = {}
): Promise<string> {
  try {
    if (!cfg.autoUpdate) return "";
    // The survey's own headless session must not race the runtime out from under its parent.
    if (process.env.HINDSIGHT_DISABLE_HOOKS) return "";

    const pkgRoot = opts.pkgRoot ?? packageRoot();
    const runtime = opts.runtimeDir ?? stagedRuntimeDir();
    if (!existsSync(runtime)) return "";
    // Only the staged copy updates itself — see the module doc.
    if (!sameDir(pkgRoot, runtime)) return "";

    const now = opts.now ?? Date.now();
    const file = stateFile(runtime);
    if (!dueForCheck(file, now)) return "";

    const current = stagedVersion(pkgRoot);
    if (!current) return ""; // cannot tell what is installed — never guess and overwrite it
    // Both guards sit after the interval gate and stamp like any other "checked, nothing to do"
    // outcome, so each states its reason at most once a day instead of on every session start.
    if (!(opts.selfUpdatable ?? selfUpdatable)(runtime)) {
      log.info("auto-update", "runtime is managed outside npx — leaving its version alone");
      stampCheck(file, now, "");
      return "";
    }
```

</details>

**依据 11 · 源码核查**：[hindsight-integrations/coding-agents/src/core/auto-update.ts:417-444](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/auto-update.ts#L417-L444)

实际版本检查/锁/新版本npx update detached。

<details>
<summary>查看原文（28行）</summary>

```text
    // request and can only ever produce one updater.
    const lock = opts.lockFile ?? lockFile();
    if (!acquireUpdateLock(lock, now)) return "";
    try {
      const latest = await (opts.npmView ?? npmViewVersion)(PACKAGE_NAME);
      stampCheck(file, now, latest);
      if (!latest || !isNewer(latest, current)) {
        releaseUpdateLock(lock);
        return "";
      }

      log.info("auto-update", `updating the Hindsight runtime ${current} -> ${latest}`);
      const child = spawnNpm(
        opts.spawn ?? realSpawn,
        "npx",
        ["-y", `${PACKAGE_NAME}@${latest}`, "update"],
        {
          detached: true,
          stdio: "ignore",
          windowsHide: true,
        }
      );
      // A spawn failure (no npx on PATH, EACCES) arrives asynchronously as an 'error' event; an
      // unhandled one would take the session start down with it.
      child.on("error", (e) => {
        log.warn("auto-update", `update spawn failed: ${e.message}`);
        releaseUpdateLock(lock);
      });
```

</details>

**依据 12 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:172-195](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/dsh.ts#L172-L195)

工作区缓存意味着现有runtime不会每回合重建全部配置。

<details>
<summary>查看原文（24行）</summary>

```text
 */
function workspaceFor(root: string): Workspace | undefined {
  const cached = workspaces.get(root);
  if (cached !== undefined) return cached ?? undefined;

  // One shared builder for every long-lived host (core/host-client.ts): the global switch, the
  // per-bank opt-out and `optInOnly` all land in `cfg.disabled`.
  const { cfg, bankId, client } = resolveHostMemory(HARNESS, root);
  if (cfg.disabled) {
    workspaces.set(root, null); // inert: same agent, no memory (baseline parity)
    return undefined;
  }
  // The 5th argument is this host's whole reason for existing here: RuntimeCore binds the
  // knowledge tools (and retain stamps) to the workspace it is given, and dsh's process cwd is the
  // launch directory, routinely a different repository from the session's.
  const core = new RuntimeCore(client, bankId, cfg, HARNESS, root);
  // The write-back path reads the log back off the live agent — dsh keeps the whole session in
  // memory, so unlike opencode there is nothing to refetch over HTTP.
  core.setTranscriptSource(async (sessionId) => {
    const agent = liveAgents.get(sessionId);
    return agent ? readDshEvents(ownEvents(agent.session)) : [];
  });
  const workspace: Workspace = { core, root };
  workspaces.set(root, workspace);
```

</details>

#### 缺口

- 真实服务/本地模型费用、首持续与恢复时间、服务删除及后台退出行为均未实测。
  **影响**：不能保证总成本或停用后无残留，采用需独立bank与预算、人工核对。
  **进一步探讨**：记录虚构同任务的推理/提取/存储用量和人工分钟，停止后核后台进程、远端数据与日志。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可复用贡献与最值得验证的增量方向是什么？

**研究主题**：贡献与相对优势、新假设与验证

#### 完整回答

已有贡献是把共享记忆引擎接入DSH多工作区生命周期：工作区/调用者bank路由、非人类消息排除、fork前缀切除、首轮自动注入和增量异步写回，减少手工搬摘要的接线。与直接MCP手动检索或项目规则文件相比，它提前安排何时读写；但相关性、命名冲突、提取真实性和全周期成本仍未证明，不将上游记忆研究或其他宿主benchmark归入本DSH适配的效果。

候选方向是让每条被使用的决策带可检查bank/来源时间/原文与“已提交、提取完成、可读回”分离状态，并允许暂停旧决策而非只追加纠正。当前工具有纠正文档入口、sync状态和诊断，候选应与这些已有方法及人工摘要比较，不能把它们换名当新实现；本轮未确认逐条暂停/删除或强写回收据已经接入DSH。

最小实验用两个同名虚构repo、一个过时决策、一次写入失败与一次进程退出，在相同任务对照手工摘要/现有工具纠正。只看是否将正确版本证据带入决策、错误引用与漏记、人工复核分钟、token和额外后台成本。若严格状态仍不能避免错bank/过时引用，或额外复核不比人工摘要省且更易误导，应放弃；不把未经验证候选计为当前技术或经济创新。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:290-338](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/dsh.ts#L290-L338)

现有首轮注入/stop机制是比较基线。

<details>
<summary>查看原文（49行）</summary>

```text
    async preStep(
      { agent, signal }: PreStepPayload,
      next: () => Promise<PreStepDecision>
    ): Promise<PreStepDecision> {
      const decision = await next();
      if (decision.kind !== "enter" || signal.aborted) return decision;
      const workspace = resolve(agent);
      if (!workspace) return decision;
      const sessionId = agent.session.header.id;
      liveAgents.set(sessionId, agent);
      // A resumed session gets no `agent/session-start` in some compositions; seeding here too
      // keeps the cold-check exactly-once without depending on which events a host fired.
      ensureSeeded(workspace);
      // No new human input means a tool continuation: recall already ran for this turn, and its
      // block is already in the history the model is about to be sent.
      const prompt = promptOf(decision.messages);
      if (!prompt) return decision;
      await workspace.core.onPrompt(sessionId, prompt);
      const injection = workspace.core.getInjection(sessionId);
      if (!injection) {
        diag(HARNESS, "inject_empty", { session: sessionId });
        return decision;
      }
      if (injection === lastInjectedText(dshSessionEvents(agent.session))) {
        diag(HARNESS, "inject_unchanged", { session: sessionId });
        return decision;
      }
      diag(HARNESS, "inject_ok", { session: sessionId, chars: injection.length });
      return { kind: "enter", messages: [...decision.messages, injectionMessage(injection)] };
    },

    async turnStopping({ agent }: { agent: DshAgent }): Promise<void> {
      const workspace = resolve(agent);
      if (!workspace) return;
      const sessionId = agent.session.header.id;
      liveAgents.set(sessionId, agent);
      // The stop boundary is the only moment the completed exchange is readable, so this bypasses
      // the turn cadence exactly like the opencode idle path it shares (`onSessionIdle`).
      await workspace.core.onSessionIdle(sessionId);
    },

    disposed({ agent }: { agent: DshAgent }): void {
      liveAgents.delete(agent.session.header.id);
    },
  };
}

// ── native tools ────────────────────────────────────────────────────────────────

```

</details>

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/core/hindsight.ts:500-533](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/hindsight.ts#L500-L533)

异步接受与提取/读回分离是候选推导依据。

<details>
<summary>查看原文（34行）</summary>

```text
  /** Retain one memory. ALWAYS async: enqueue extraction server-side and collect its op-id for
   *  drain(). Nothing in this plugin can afford to block a coding agent's hook on extraction. */
  async retain(
    content: string,
    context: string,
    documentId: string,
    tags: string[],
    strategy: string,
    opts: RetainOpts = {}
  ): Promise<void> {
    const item: Record<string, unknown> = {
      content,
      context,
      document_id: documentId,
      tags,
      strategy,
      // Sent on EVERY retain, including the server default `combined`, so the scoping a bank's
      // observations were built under is a property of the write rather than of whichever server
      // version happened to process it. Servers older than 0.4.15 ignore the field.
      observation_scopes: resolveRetainScopes(tags, this.observationScopes),
    };
    if (opts.timestamp) item.timestamp = opts.timestamp;
    if (opts.metadata) item.metadata = opts.metadata;
    if (opts.updateMode) item.update_mode = opts.updateMode;
    const body: Record<string, unknown> = { items: [item], async: true };
    if (opts.operationId) body.operation_id = opts.operationId;
    const r = await this.req("POST", this.bankUrl("/memories"), body);
    try {
      const j = (await r.json()) as { operation_id?: string };
      if (j.operation_id) this.opIds.push(j.operation_id);
    } catch {
      /* ignore */
    }
  }
```

</details>

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/core/knowledge-tools.ts:333-346](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/knowledge-tools.ts#L333-L346)

已有纠正文档说明，候选不能冒充其首次实现。

<details>
<summary>查看原文（14行）</summary>

```text
      name: "hindsight_ingest_document",
      description:
        "Save an external document or a block of durable notes/findings into this repository's " +
        "memory so it informs future recall and pages. Use for design notes, research, or " +
        "reference material you want remembered — not for the conversation you're already in " +
        "(that's captured automatically at session end). This is ALSO the correction mechanism: " +
        "when you verify that a retrieved memory is wrong or outdated, ingest a document titled " +
        "'Correction: <topic>' stating what memory claimed, what is actually true, and the " +
        "evidence — the newer fact supersedes the stale one in future retrieval.",
      inputSchema: { title: z.string(), content: z.string() },
      annotations: NON_DESTRUCTIVE_WRITE_ANNOTATIONS,
      handler: guarded(async ({ title, content }) => {
        const slug = title
          .toLowerCase()
```

</details>

**依据 4 · 源码核查**：[hindsight-integrations/coding-agents/src/core/bank.ts:300-325](https://github.com/vectorize-io/hindsight/blob/30d547ba00989297057a9679f2d59f30a554b240/hindsight-integrations/coding-agents/src/core/bank.ts#L300-L325)

命名路由及同名/映射对照依据。

<details>
<summary>查看原文（26行）</summary>

```text
export function deriveBankId(
  config: BankConfig,
  directory: string,
  harness = "coding",
  /** Where the SESSION started, when the caller knows it (hook runtimes do — see
   *  `sessionRootDir`). A rescue for a live directory git cannot name: it resolves both the
   *  project the bank is named after (gitProjectName) and the checkout whose `mapPathToBank`
   *  entry this directory inherits (lookupDirectories). */
  sessionRoot?: string
): string {
  const mapped = mappedBank(config, directory, sessionRoot);
  if (mapped) return mapped;

  // dynamic by default — but an explicit bankId (without dynamicBankId: true) means "static".
  const dynamic = config.dynamicBankId ?? !config.bankId;
  if (!dynamic) return config.bankId || DEFAULT_BANK_NAME;

  const resolvers: Record<string, () => string> = {
    harness: () => harness,
    project: () => dirName(directory),
    gitProject: () => gitProjectName(directory, config.resolveWorktrees ?? true, sessionRoot),
    channel: () => process.env.HINDSIGHT_CHANNEL_ID || "default",
    user: () => process.env.HINDSIGHT_USER_ID || "anonymous",
  };
  return applyTemplate(config.bankIdTemplate || DEFAULT_TEMPLATE, resolvers, "bankIdTemplate");
}
```

</details>

#### 缺口

- 逐条证据状态/停用方案没有实现及对照，真实来源是否足以识别决策版本未知。
  **影响**：只形成可证伪方向，不进入已实现收益评分。
  **进一步探讨**：先用上述虚构故障样本比较错引用、漏记、人工和token，再决定是否实现。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
