# dsh-claude-move

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[1ff7d30](https://github.com/PerryLink/dsh-claude-move/tree/1ff7d3031279b7f2d3fc243eda77f93ae745ab69)

<!-- BEGIN META -->
[![GitHub ★ 32](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=32&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-claude-move) [![npm 30d 3,446](https://img.shields.io/static/v1?label=npm+30d&message=3%2C446&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-claude-move) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-claude-move)
<!-- END META -->

> **功能**：将 Claude Code、Codex、OpenCode 和 Hermes 的会话及个人上下文迁入 DSH，并提供导出与迁移向导。

> **亮点**：四来源上下文迁移、幂等跟踪和双向会话导出，写入前有审批门。[Q01](#research-q01) [Q03](#research-q03)

> **主要限制**：向导预检审批只覆盖 new/changed，明确指定解法的冲突项仍可写入。旧 import_claude 直接导入，目标副本和台账也分开提交。先核实宿主外层控制，再评估真实项目迁移。[Q03](#research-q03)

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
  - [Q01 · 哪些用户需要跨工具迁移，插件相比手工搬运增加什么？](#detail-section-11)
  - [Q02 · 单个会话导入如何从发现、解析、去重走到 DSH 持久化？](#detail-section-12)
  - [Q03 · 审批、幂等及数据保护机制能否阻止意外写入？](#detail-section-13)
  - [Q04 · 部署需要哪些环境与人工投入，哪些成本或兼容风险可能阻断迁移？](#detail-section-14)
  - [Q05 · 实现结构和发布方式提供了哪些可复用设计，证据边界是什么？](#detail-section-15)
  - [Q06 · 什么假设值得下一步验证，推荐怎样逐步采用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：从 Claude Code/Codex 等切换到 DSH 且需保留上下文的用户。[Q01](#research-q01)

人工复制/摘要历史，或让旧工具保持可用并手工查阅。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 主要用途 | 条件 |
| --- | --- | --- |
| Claude 会话迁移 | 解析对话与工具记录，写入可续聊 DSH 日志 | 源和目标格式需核验，缺失结果会标为合成错误 |
| 四来源向导 | 预览会话及项目资料的变更 | 核对非普通审批路径和冲突处理 |
| 增量同步 | 按源路径和已有轮数续写 | 目标或台账部分写入需回读复核 |

**流程与依赖**

| 依赖或条件 | 用途与边界 |
| --- | --- |
| 兼容 Node 与 DSH | 装配源读取、迁移工具和宿主持久化 |
| 脱敏源副本和独立 DSH profile | 核查目标格式和源未改；目标历史会持久保留 |
| 宿主审批服务 | 限定条件的向导审批，不覆盖旧工具和冲突解法 |

| 阶段 | 操作与核查点 |
| --- | --- |
| 预览 | 选择一个模拟短会话并核对来源、可映射字段和目标 |
| 权限核查 | 在隔离配置分别走旧工具和向导冲突分支，确认每个动作的写入权限 |
| 恢复 | 核对源、目标、imports.json 与 move.json；保留所需记录后切回原项目笔记 |

**效果与成本**

| 阶段 | 资源与人工投入 |
| --- | --- |
| 首次 | 整理源副本并选择范围，须检查兼容接口及实际权限 |
| 持续 | 读取、转换和重复副本消耗磁盘及人工复核 |
| 恢复 | 台账和目标不同步需人工核对，停用后目标会话仍在 |

| 效果 | 固定源码依据 | 未验证 |
| --- | --- | --- |
| 会话续接 | 固定转换器按调用 ID 修复并输出 DSH 事件 | 同一任务实际续聊正确率 |
| 安全迁移 | 可预览并核对来源／目标，审批覆盖有触发条件 | 两个非覆盖路径的宿主级控制 |

> **思考**：向导预检审批只覆盖 new/changed，明确指定解法的冲突项仍可写入。旧 import_claude 直接导入，目标副本和台账也分开提交。先核实宿主外层控制，再评估真实项目迁移。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：四来源上下文迁移、幂等跟踪和双向会话导出，写入前有审批门。[Q01](#research-q01) [Q03](#research-q03)

同一状态机覆盖分块和内存转换，结果按工具调用 ID 配对。落盘适配两种宿主接口；台账和实际写入无法视为同一提交。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

向导预检审批只覆盖 new/changed，明确指定解法的冲突项仍可写入。旧 import_claude 直接导入，目标副本和台账也分开提交。先核实宿主外层控制，再评估真实项目迁移。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察。用两个独立的临时目录准备同名技能与单个模拟会话，分别核对拒绝审批、显式冲突写入及旧接口权限。若无法说明每一条写入由谁批准，就沿用手工整理项目笔记。[Q03](#research-q03) [Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码和作者说明支持多来源扫描、增量导入、审批门及导出设计。没有执行导入/续聊或权限恢复实验，故数据安全与保真仍待验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.mjs、types.d.ts、client/client.js、lib/convert.mjs、lib/wizard.mjs、lib/imports-store.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件源码与发布配置；检查 index.mjs、client 面板及 package manifest。未读取个人数据、未运行插件或导入会话。
- 下一步：用模拟 JSONL、同名技能及临时 profile 核对转换后续聊、重复导入、拒绝审批和目标残留。

**分析版本**

- **仓库**：[PerryLink/dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)
- **版本号**：0.4.19（[固定提交 1ff7d30](https://github.com/PerryLink/dsh-claude-move/tree/1ff7d3031279b7f2d3fc243eda77f93ae745ab69)）
- **版本日期**：2026-11-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

用脱敏项目做预览、单会话导入并实际续聊，验证保真度及相对人工搬运成本。[Q06](#research-q06)

用模拟 JSONL、同名技能及临时 profile 核对转换后续聊、重复导入、拒绝审批和目标残留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 18 | 3705 | — | — | 50647 |
| .js | source | 1 | 467 | 407 | 30 | — |
| .mjs | source | 31 | 8917 | 6517 | 1925 | — |
| .mjs | test | 38 | 6926 | 5994 | 305 | — |
| .mjs | example | 1 | 17 | 13 | 3 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-16），可前往 [GitHub Issues](https://github.com/PerryLink/dsh-claude-move/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用户能否安全地把多个 Agent 工具的历史和上下文转为可续聊 DSH 会话，同时避免源数据损坏、重复导入和未经批准的写入？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些用户需要跨工具迁移，插件相比手工搬运增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

从 Claude Code 等工具转用 DSH、但需要保留历史和项目上下文的用户，可将源会话转成 DSH 可续聊会话，并导入记忆、技能与指令。插件还支持 Codex/OpenCode/Hermes 向导和 DSH 会话导出。手工复制只适合少量文件，且难以保留 tool-use/result 结构和继续会话所需的状态。贡献是转换与续聊工作流，不代表跨模型语义完全等价；摘要映射或工具协议差异仍可能改变历史含义。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:37-43](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/README.md#L37-L43)

作者描述只读源与 DSH create/append 写入边界及四来源导览。

```text
## 它是什么

Claude Code 用久了，历史都沉在 `~/.claude` 里：会话 transcript、memory、技能、`CLAUDE.md` 和 `settings.json`。`dsh-claude-move` 把这些读出来，转换成 DeepSeek Harness 里能打开、能续聊的会话与上下文——源目录全程只读，DSH 这边只 `create` + `append`，两侧都不会被移动、改写或删除。除 Claude Code 之外，Codex、OpenCode、Hermes 也能通过同一个 `/move` 向导迁移。

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-claude-move-flow-v5-dark.svg">
  <img src="docs/assets/dsh-claude-move-flow-v5-light.svg" width="100%" alt="dsh-claude-move 结构：四源只读 → move_detect / plan / move_preview → 审批门（allowed-once，其余零写入）→ DSH 写入面；move.json 台账回流保证幂等">
```

**依据 2 · 作者声明**：[README.md:90-99](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/README.md#L90-L99)

能力主张包括会话、上下文、技能、命令和双向导出。

<details>
<summary>查看原文（10行）</summary>

```text
`dsh-claude-move` 把「换工具」变成「搬上下文」——旧项目的会话、记忆、技能、指令与斜杠命令一起过来，且迁移过程可重入、可回退：

- **自动发现** —— `claude_scan` 定位 Claude 数据根（`$CLAUDE_CONFIG_DIR`，回退 `~/.claude`）并索引每个项目/会话、记忆、技能、全局 `CLAUDE.md` 和 `settings.json`，带增量缓存与并行扫描（`scanConcurrency`）。
- **全保真导入** —— `import_claude` 把 transcript 转成均衡、可续聊的 DSH 会话（`turn/start → step/start → user/message → assistant/message → tool/call → tool/result → step/end → turn/end`），修复被中断的工具调用，并对超过 `maxTranscriptBytes` 的 transcript 分块流式导入。
- **一个 `claudecode` 工作区** —— 每个导入会话都落进专用工作区（默认 `$DSH_HOME/claudecode`）；`workspaceMode: 'per-project'` 恢复「每个项目一个工作区」的分组方式。
- **只复制且增量** —— 两侧都不移动、不改写、不删除；重跑只追加新的轮次（`force: true` 以新 id 另存一份完整副本，旧副本保留）。
- **个人上下文始终新鲜** —— 记忆作为实时提示词段落注入，Claude 技能注册为真正的 DSH 技能（全局 + 项目级），全局与项目 `CLAUDE.md` 提前注入。
- **四来源迁移向导** —— `/move` 加 `move_detect` / `move_preview` / `move_run` 迁移 Claude Code、Codex、OpenCode 和 Hermes，审批门控且幂等（`move.json`）。
- **Web 面板与命令** —— `/claude-import-all`、`/resume-claude`、`/claude-move-reset`、`/claude-export`，以及一个浮动迁移面板。
- **双向导出** —— `claude_export`（或 `/claude-export <sessionId>`）把 DSH 会话回写成可 resume 的 Claude Code JSONL transcript（`user`/`assistant`/`tool` 轮次、`thinking` + `tool_use`/`tool_result` 配对、尽力映射 `cwd`），历史可以再次离开 DSH。
```

</details>

**依据 3 · 作者声明**：[README.md:111-118](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/README.md#L111-L118)

列出 Claude 字段到 DSH 的映射范围。

```text
| 在 Claude Code 中 | 在 DSH 中变为 |
|---|---|
| 会话 transcript（`projects/*/*.jsonl`） | 均衡、可续聊的 DSH 会话——`user`/`assistant`/`tool`/`thinking` 全保真映射并修复被中断的工具调用——分组到一个 **`claudecode`** 工作区，或每个项目一个 |
| 记忆文件（`projects/*/memory/*.md`） | 一个实时 system-prompt 上下文段落，每次请求重新读取（`feedback > project > reference > user`） |
| 技能（`~/.claude/skills/**`） | 真正的 DSH 技能（kebab-case 命名、冲突后缀、默认最多 30 个；`README.md`/`MEMORY.md` 及无描述的文件被跳过） |
| `CLAUDE.md`（全局 + 每个项目） | 一个早期提示词段落；项目文件优先 |
| `settings.json` | DSH 配置建议，附带明确的无法映射键列表 |
| 项目状态（目录、git 分支与脏计数） | 显示在扫描索引、Web 面板徽章和 `/resume-claude` 交接中 |
```

#### 缺口

- 没有用户迁移前后续聊成功率或内容完整性对照。
  **影响**：无法判断转化损失是否低于人工整理成本。
  **进一步探讨**：抽样迁移非敏感会话，核对消息、工具调用和工作区后由用户实际续聊并标注差异。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 单个会话导入如何从发现、解析、去重走到 DSH 持久化？

**研究主题**：功能与机制

#### 完整回答

Claude JSONL 单文件导入先检查大小。过大且可用 streamText 时进入分块路径，缺流接口就拒绝；普通文件与流式共用解析状态机。转换器按轮和步组装 DSH 事件。工具结果按调用 ID 对齐，重复取第一条、孤儿丢弃、没有结果时补合成错误结果，所以目标日志可续聊，但修复后的记录不等同原历史。非流式持久化先校验事件不变式。目标宿主若提供新版 handle，create 或 open 后按格式调整事件，append、flush，并在 finally close；旧宿主走服务级 create 和 append。源文件路径分锁并关联 imports.json，目标存在且源轮次有增长时从已记录序号续写，无法确定序号则跳过。force 新建完整副本并保留旧副本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:92-99](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/README.md#L92-L99)

扫描、分块导入、增量重跑和导出能力声明。

```text
- **自动发现** —— `claude_scan` 定位 Claude 数据根（`$CLAUDE_CONFIG_DIR`，回退 `~/.claude`）并索引每个项目/会话、记忆、技能、全局 `CLAUDE.md` 和 `settings.json`，带增量缓存与并行扫描（`scanConcurrency`）。
- **全保真导入** —— `import_claude` 把 transcript 转成均衡、可续聊的 DSH 会话（`turn/start → step/start → user/message → assistant/message → tool/call → tool/result → step/end → turn/end`），修复被中断的工具调用，并对超过 `maxTranscriptBytes` 的 transcript 分块流式导入。
- **一个 `claudecode` 工作区** —— 每个导入会话都落进专用工作区（默认 `$DSH_HOME/claudecode`）；`workspaceMode: 'per-project'` 恢复「每个项目一个工作区」的分组方式。
- **只复制且增量** —— 两侧都不移动、不改写、不删除；重跑只追加新的轮次（`force: true` 以新 id 另存一份完整副本，旧副本保留）。
- **个人上下文始终新鲜** —— 记忆作为实时提示词段落注入，Claude 技能注册为真正的 DSH 技能（全局 + 项目级），全局与项目 `CLAUDE.md` 提前注入。
- **四来源迁移向导** —— `/move` 加 `move_detect` / `move_preview` / `move_run` 迁移 Claude Code、Codex、OpenCode 和 Hermes，审批门控且幂等（`move.json`）。
- **Web 面板与命令** —— `/claude-import-all`、`/resume-claude`、`/claude-move-reset`、`/claude-export`，以及一个浮动迁移面板。
- **双向导出** —— `claude_export`（或 `/claude-export <sessionId>`）把 DSH 会话回写成可 resume 的 Claude Code JSONL transcript（`user`/`assistant`/`tool` 轮次、`thinking` + `tool_use`/`tool_result` 配对、尽力映射 `cwd`），历史可以再次离开 DSH。
```

**依据 2 · 作者声明**：[README.md:140-150](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/README.md#L140-L150)

工具参数支持全量、部分扫描、force 与分块导入。

<details>
<summary>查看原文（11行）</summary>

```text
claude_scan                          # 完整扫描（增量缓存）
claude_scan { path: "~/.claude/projects/<slug>" }   # 部分扫描
claude_scan { refresh: true }        # 跳过缓存，重新扫描全部
claude_scan { projectsLimit: 10, sessionsLimit: 5, fields: "brief" }  # 精简输出

import_claude { path: "~/.claude/projects/<slug>/<sessionId>.jsonl" }  # 单个会话
import_claude { path: "~/.claude/projects" }        # 目录（递归）
import_claude { path: "all" }                       # 全部
# 随时重跑：未变更的文件被跳过，增长的 transcript 只追加新的轮次。
# 超过 maxTranscriptBytes 的文件以分块流式导入（无内存上限）。
import_claude { path: "...", force: true }          # 全新的完整副本（保留之前的副本）
```

</details>

**依据 3 · 源码核查**：[index.mjs:64-67](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/index.mjs#L64-L67)

插件入口注册名及配置/宿主职责起点。

```text
export const name = 'claude-move'

// Consumer — 只消费 host 公开服务：tools（inject 硬依赖）；sessionPersistence /
// workspaceRegistry / commands / systemPrompt / skills / webServer / approval / fs 经 ctx.get 可选读取。
```

**依据 4 · 源码核查**：[index.mjs:697-700](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/index.mjs#L697-L700)

claude_scan 工具描述数据根、索引范围和裁剪参数。

```text
    name: 'claude_scan',
    description:
      'Scan the local Claude Code data: locate the data root ($CLAUDE_CONFIG_DIR or ~/.claude), index every project/session (title, timestamps, message & tool-call counts), directory & git state, memories, skills, global CLAUDE.md and settings.json. Returns a structured JSON index. path narrows to the projects directory, one project, one .jsonl or any directory containing .jsonl files; refresh=true bypasses the incremental cache; projectsLimit/sessionsLimit/fields trim the output. Use import_claude for imports. ' +
      '（扫描本机 Claude Code 数据：自动定位数据根目录，索引全部项目/会话、目录与 git 状态、记忆/技能/CLAUDE.md/settings.json；path 收窄范围，refresh 全量重扫，projectsLimit/sessionsLimit/fields 裁剪输出。导入请用 import_claude。）',
```

**依据 5 · 作者声明**：[README.md:113-118](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/README.md#L113-L118)

会话事件、记忆、技能和 CLAUDE.md 映射。

```text
| 会话 transcript（`projects/*/*.jsonl`） | 均衡、可续聊的 DSH 会话——`user`/`assistant`/`tool`/`thinking` 全保真映射并修复被中断的工具调用——分组到一个 **`claudecode`** 工作区，或每个项目一个 |
| 记忆文件（`projects/*/memory/*.md`） | 一个实时 system-prompt 上下文段落，每次请求重新读取（`feedback > project > reference > user`） |
| 技能（`~/.claude/skills/**`） | 真正的 DSH 技能（kebab-case 命名、冲突后缀、默认最多 30 个；`README.md`/`MEMORY.md` 及无描述的文件被跳过） |
| `CLAUDE.md`（全局 + 每个项目） | 一个早期提示词段落；项目文件优先 |
| `settings.json` | DSH 配置建议，附带明确的无法映射键列表 |
| 项目状态（目录、git 分支与脏计数） | 显示在扫描索引、Web 面板徽章和 `/resume-claude` 交接中 |
```

**依据 6 · 源码核查**：[index.mjs:1283-1303](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/index.mjs#L1283-L1303)

大小、流接口、读取、转换及持久化实际入口。

<details>
<summary>查看原文（21行）</summary>

```text
export async function importTranscript(ctx, target, args, maxBytes, persisted, rawOverride, signal, config = {}) {
  const fs = requireFs(ctx)
  signal?.throwIfAborted()
  const sourcePath = target.displayPath || fs.processPath(target)
  const info = await fs.stat(target)
  if (info && typeof info.size === 'number' && info.size > maxBytes) {
    if (rawOverride === undefined && typeof fs.streamText === 'function') {
      return importsStore.exclusive(sourcePath, () =>
        importTranscriptStreamed(ctx, fs, target, args, persisted, sourcePath, info, signal, config))
    }
    throw new Error(`transcript 过大（${info.size} 字节 > maxTranscriptBytes ${maxBytes}）：` +
      '请调高 maxTranscriptBytes，或改由 /claude-import-all 与面板批量导入（该路径支持流式分块导入超大文件）')
  }
  signal?.throwIfAborted()
  const raw = rawOverride ?? await fs.readText(target)
  signal?.throwIfAborted()
  const converted = convertClaudeJsonl(raw, args.sessionId ? { sessionId: args.sessionId } : {})
  const result = await persistConverted(ctx, converted, args, persisted, sourcePath, {
    sizeBytes: info && typeof info.size === 'number' ? info.size : undefined,
    mtimeMs: info && typeof info.mtimeMs === 'number' ? info.mtimeMs : undefined,
  }, config)
```

</details>

**依据 7 · 源码核查**：[lib/convert.mjs:194-229](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/lib/convert.mjs#L194-L229)

按调用 ID 去重、丢弃孤儿及补合成错误结果。

<details>
<summary>查看原文（36行）</summary>

```text
          turn,
          step: stepNum,
          callId: tc.id,
          name: tc.name,
          arguments: tc.arguments,
        })
        callSeqByCallId[tc.id] = ev.seq
        declaredIds.add(tc.id)
      }
      // 每个声明的调用恰好一条结果：真实结果去重取首条，缺失补合成错误结果。
      const firstResultByCallId = new Map()
      for (const tr of step.toolResults) {
        if (!declaredIds.has(tr.toolCallId)) {
          bump('orphanResults')
          continue
        }
        if (firstResultByCallId.has(tr.toolCallId)) {
          bump('duplicateResults')
          continue
        }
        firstResultByCallId.set(tr.toolCallId, tr)
      }
      for (const tc of step.toolCalls) {
        const callSeq = callSeqByCallId[tc.id]
        const real = firstResultByCallId.get(tc.id)
        if (!real) bump('synthesized')
        push('tool/result', {
          turn,
          step: stepNum,
          // 构造即当前规范形状：V4 一等 tool 角色消息。目标后端自报格式 < 4 时
          // 由写盘边界 conformToolResultForm 折回 v3 包裹（旧线产物逐字段不变）。
          message: nativeToolResultMessage({
            id: 'import:' + meta.id + ':t' + turn + ':' + stepNum + ':' + tc.id,
            toolCallId: tc.id,
            content: real ? real.content : [{ type: 'text', text: SYNTHETIC_TOOL_RESULT_TEXT }],
            isError: real ? real.isError === true : true,
```

</details>

**依据 8 · 源码核查**：[lib/convert.mjs:285-311](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/lib/convert.mjs#L285-L311)

非流式也通过同一转换器。

<details>
<summary>查看原文（27行）</summary>

```text
//
// 实现走 createClaudeStreamConverter（C3）：与流式导入共用同一状态机，保证
// 两条路径事件纪律一致；全量模式 keepTurns 保留完整回合结构供 handoff/tail 使用。
export function convertClaudeJsonl(raw, args = {}) {
  const batches = []
  const converter = createClaudeStreamConverter({
    sessionId: args.sessionId,
    keepTurns: true,
    onBatch: (events) => { batches.push(events) },
  })
  converter.feed(raw)
  const result = converter.end()
  return {
    meta: result.meta,
    events: batches.flat(),
    // 本函数固定 keepTurns: true，故 turns 恒为回合数组（工厂的另一形态是回合数）。
    turns: /** @type {any[]} */ (result.turns),
    title: result.title,
    messages: result.messages,
    toolCalls: result.toolCalls,
    skipped: result.skipped,
    records: result.records,
    skippedLines: result.skippedLines,
    typeCounts: result.typeCounts,
    repaired: result.repaired,
    sourceId: result.sourceId,
  }
```

</details>

**依据 9 · 源码核查**：[index.mjs:1019-1047](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/index.mjs#L1019-L1047)

单源互斥与落盘前不变式。

<details>
<summary>查看原文（29行）</summary>

```text
export async function persistConverted(ctx, converted, args, persisted, sourcePath, source = {}, config = {}) {
  // 同一源文件并发导入互斥：后到者等先行者落盘后重跑，按幂等路径复用结果
  // （否则 create duplicate 会被记为 failed，且 imports.json 会被并发覆盖）。
  return importsStore.exclusive(sourcePath, () =>
    persistConvertedInner(ctx, converted, args, persisted, sourcePath, source, config))
}

/** 探测同名持久化会话是否为空日志（上次 create 成功、append 失败残留）；无法确定返回 false。 */
async function isEmptyStoredSession(ctx, dshId) {
  const sp = ctx.get('sessionPersistence')
  if (!sp || detectPersistenceShape(sp) === null) return false
  try {
    const read = await readStoredEvents(sp, dshId)
    return Array.isArray(read?.events) && read.events.length === 0
  } catch {
    // 读不到/读失败：按「非空」处理，走保守路径。
    return false
  }
}

async function persistConvertedInner(ctx, converted, args, persisted, sourcePath, source = {}, config = {}) {
  const { meta, events, turns, messages, toolCalls, skipped, skippedLines, typeCounts, repaired, sourceId } = converted

  // 落盘前自校验（issue#1）：不平衡的日志会让会话在续聊时永久 400，宁可
  // 大声失败也不把非法消息流写进持久层（转换器按构造保证通过）。
  const issues = validateSessionEvents(events)
  if (issues.length > 0) {
    throw new Error('claude-move 拒绝落盘：转换结果不满足续聊协议不变式 —— ' + issues.slice(0, 3).join('；'))
  }
```

</details>

**依据 10 · 源码核查**：[index.mjs:1071-1114](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/index.mjs#L1071-L1114)

按源路径记录目标，轮数增长追加，强制创建副本。

<details>
<summary>查看原文（44行）</summary>

```text
  const cacheDir = resolveCacheDir()
  const imports = await loadImports(cacheDir)
  const known = unwrapImport(imports[sourcePath])
  const knownId = known?.dshId

  // ── 已导入过：增量续写 / force 新副本 / 幂等跳过 ─────────────────────────
  if (knownId && persisted.has(knownId)) {
    if (args.force === true) {
      // 复制式 force：旧副本原样保留，新建一份完整副本。
      const nextId = mintForceSessionId(persisted, knownId)
      const nextMeta = { ...meta, id: nextId }
      await spPersist(ctx, nextMeta, events)
      persisted.add(nextId)
      const attached = await attachImportedSession(ctx, config, nextMeta)
      await rememberImport(ctx, sourcePath, {
        dshId: nextId, turns: turns.length, events: events.length,
        sizeBytes: source.sizeBytes, mtimeMs: source.mtimeMs,
        ...(typeof sourceCwd === 'string' ? { sourceCwd } : {}),
      })
      return {
        ...base,
        sessionId: nextId,
        status: 'imported',
        workspace: { ...attached, ...(meta.cwd ? { path: meta.cwd } : {}) },
        forceImported: { previous: knownId, current: nextId, archived: false },
      }
    }

    if (typeof known.turns === 'number' && turns.length > known.turns) {
      // 增量：把源文件新增轮次续写到同一 DSH 会话。
      let fromSeq = typeof known.events === 'number' ? known.events : await storedEventCount(ctx, knownId)
      if (typeof fromSeq !== 'number') {
        // 无法确定存储日志长度：保守跳过，绝不冒险 append 错误 seq。
        return { ...base, sessionId: knownId, status: 'already-imported', appendedSkipped: 'stored-length-unknown' }
      }
      const tail = tailSessionEvents(converted, { fromTurn: known.turns + 1, fromSeq })
      if (tail.events.length > 0) {
        await spAppend(ctx, knownId, tail.events)
      }
      await rememberImport(ctx, sourcePath, {
        dshId: knownId, turns: turns.length, events: fromSeq + tail.events.length,
        sizeBytes: source.sizeBytes, mtimeMs: source.mtimeMs,
        ...(typeof sourceCwd === 'string' ? { sourceCwd } : {}),
      })
```

</details>

**依据 11 · 源码核查**：[index.mjs:1191-1251](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/index.mjs#L1191-L1251)

新旧宿主持久化及新版关闭顺序。

<details>
<summary>查看原文（61行）</summary>

```text
  if (!sp) {
    throw new Error('会话持久化服务（sessionPersistence）不可用：claude-move 导入需要该服务')
  }
  if (detectPersistenceShape(sp) === 'handle') {
    if (typeof sp.open !== 'function') {
      throw new Error('会话持久化服务（sessionPersistence）不可用：claude-move 增量续写需要该服务')
    }
    const handle = await sp.open(id, 'write')
    try {
      const version = await currentHandleFormatVersion(sp)
      await handle.append(normalizeHandleEvents(conformToolResultForm(events, version), version))
      await handle.flush()
    } finally {
      await handle.close()
    }
    return
  }
  if (typeof sp.append !== 'function') {
    throw new Error('会话持久化服务（sessionPersistence）不可用：claude-move 导入需要该服务')
  }
  // 旧路径（服务级 append，header 版本不动）保持与 0.3.x 逐字段一致：其目标
  // 后端是格式 v3 及更早，tool/result 必须是 v3 包裹形状。
  await sp.append(id, conformToolResultForm(events, 0))
}

/**
 * create + append 一份完整会话日志（双基线）；服务缺失/落盘失败响亮抛出。
 * handle 路径：按服务形状先探测（有 open 即 handle），create 前经
 * normalizeHandleHeader 盖当前格式版本与 isSeeded（checkout 后端要求），
 * create 返回值实测判定（isSessionHandle），事件批经 normalizeHandleEvents /
 * conformToolResultForm 按后端当前格式版本规范化（>= 2 时补
 * assistant/message.stream；>= 4 时保持 V4 一等 tool 角色结果消息），append 后
 * flush() 并在 finally 成对 close()——任何失败路径都释放单写所有权；空事件
 * 批次（流式导入的首个 create）只 flush 物化空会话。旧路径 create+append 调用
 * 序列与 0.3.x 逐字节一致（header 不动，tool/result 折回 v3 包裹形状）。
 */
async function spPersist(ctx, meta, events) {
  const sp = ctx.get('sessionPersistence')
  if (!sp || typeof sp.create !== 'function') {
    throw new Error('会话持久化服务（sessionPersistence）不可用：claude-move 导入需要该服务')
  }
  const header = detectPersistenceShape(sp) === 'handle' ? await normalizeHandleHeader(sp, meta) : meta
  const created = await sp.create(header)
  if (isSessionHandle(created)) {
    notePersistenceShape(sp, 'handle')
    try {
      if (events.length > 0) {
        const version = await currentHandleFormatVersion(sp)
        await created.append(normalizeHandleEvents(conformToolResultForm(events, version), version))
      }
      await created.flush()
    } finally {
      await created.close()
    }
    return
  }
  notePersistenceShape(sp, 'legacy')
  if (typeof sp.append !== 'function') {
    throw new Error('会话持久化服务（sessionPersistence）不可用：claude-move 导入需要该服务')
  }
  await sp.append(meta.id, conformToolResultForm(events, 0))
```

</details>

#### 缺口

- 没有对不同来源版本的实际 JSONL 进行导入与续聊。
  **影响**：未知字段、编码和消息附件的映射损失不能界定。
  **进一步探讨**：使用脱敏的代表性 transcript 覆盖普通轮次、工具调用中断、大文件和附件，再核对导入事件与续聊。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 审批、幂等及数据保护机制能否阻止意外写入？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

四来源 move_run 的审批作用只覆盖它计算出的 new/changed 项。缺审批服务、缺模型回合或请求抛错会返回 unavailable，现有待写集合需要得到 allowed-once 才继续。存在两条超出这个保护的情况。第一，冲突项不进入待审批集合，但调用方显式选择覆盖、改名或合并时，后续按对应分支写入；只有冲突项时走得到写入分支而没有触发审批。默认 skip 会跳过冲突。第二，旧 import_claude 直接进入单文件或批量导入，不调用这个向导审批端口；宿主外层是否有自身权限控制没有证据。暂不把默认审批视为全插件防线。

技能与托管指令的 move.json 同时核对源和目标摘要，普通会话导入则由 imports.json 按源文件与轮数处理。写目标和更新记录是连续但独立的动作，失败期间可能留有目标副本或未更新索引。卸载或重置索引不会删除目标历史。所核查的导入使用读源和写目标，但插件具文件读写能力，宿主权限范围及真实源文件状态待验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-43](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/README.md#L39-L43)

只读源、审批门和 DSH 写入面声明。

```text
Claude Code 用久了，历史都沉在 `~/.claude` 里：会话 transcript、memory、技能、`CLAUDE.md` 和 `settings.json`。`dsh-claude-move` 把这些读出来，转换成 DeepSeek Harness 里能打开、能续聊的会话与上下文——源目录全程只读，DSH 这边只 `create` + `append`，两侧都不会被移动、改写或删除。除 Claude Code 之外，Codex、OpenCode、Hermes 也能通过同一个 `/move` 向导迁移。

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-claude-move-flow-v5-dark.svg">
  <img src="docs/assets/dsh-claude-move-flow-v5-light.svg" width="100%" alt="dsh-claude-move 结构：四源只读 → move_detect / plan / move_preview → 审批门（allowed-once，其余零写入）→ DSH 写入面；move.json 台账回流保证幂等">
```

**依据 2 · 作者声明**：[README.md:86-86](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/README.md#L86-L86)

卸载后导入会话仍保留，插件有缓存/工作区写入。

```text
**卸载**：`dsh plugin --profile web remove dsh-claude-move`（或从 profile 的 bundles 中删掉 `claude-move` 行）。导入的会话保留在 DSH 数据目录；插件只写自己的缓存（`$DSH_HOME/claude-move/`）和 `claudecode` 工作区文件夹，绝不触碰 Claude 源数据。
```

**依据 3 · 作者声明**：[README.md:125-133](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/README.md#L125-L133)

逐项冲突状态、默认 skip、台账幂等与审批门。

````text
move_preview       # 逐项计划：new | unchanged | changed | conflict（含 diff）| unsupported
move_run           # 在审批门控之后执行；冲突解决：
                   #   skip | overwrite | rename | merge  （默认 skip——绝不猜测）
```

- **来源** —— Claude Code（`~/.claude`）、Codex（`~/.codex`）、OpenCode（数据 + 配置根）、Hermes（技能/记忆根）；每个来源都有自己的 parser + mapper。
- **映射** —— 记忆/指令 → 追加到 DSH 全局 `AGENTS.md` 的仅追加受管段落（每项一个标记段落）；技能 → 真正的 DSH 技能（`SKILL.md` 包原样复制，其他格式转换）；斜杠命令 → 已注册的 DSH 命令（重启后从 `move.json` 重建）；会话 → 可续聊的 DSH 会话（与阶段 1 相同的导入器）。
- **幂等** —— 每个已应用的计划都记录在 `$DSH_HOME/claude-move/move.json`（`digest` / `targetDigest` / `appliedAt`）；重跑跳过未变更项，`force` 重新应用它们。
- **审批门控** —— 任何会写入内容的运行都先询问 `ctx.approval`；除 `allowed-once` 之外的任何结果都意味着零写入。
````

**依据 4 · 源码核查**：[index.mjs:301-304](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/index.mjs#L301-L304)

配置文档注明审批默认启用且 fail-closed。

```text
 * @property {'claudecode'|'per-project'} [workspaceMode] 工作区归组方式：'claudecode'（默认）把全部导入会话挂到独立的 claudecode 工作区（claudecodeDir 目录）；'per-project' 按源项目 cwd 各建一个工作区。
 * @property {string} [claudecodeDir] claudecode 工作区目录；缺省 `$DSH_HOME/claudecode`（DSH_HOME 缺失时 `~/.dsh/claudecode`）。插件只会在此目录下创建文件夹（迁移唯一的有意写入），绝不触碰其它路径。
 * @property {boolean} [enableMove] 注册四合一迁移向导（move_detect/move_preview/move_run 工具与 /move 命令，默认 true）。
 * @property {boolean} [requireApproval] 迁移执行前经 ctx.approval 审批（默认 true；fail-closed，非 allowed-once 零写入；无审批 seam 的平台显式设 false 才可执行）。
```

**依据 5 · 源码核查**：[package.json:48-68](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/package.json#L48-L68)

声明迁移插件配置与 filesystem read/write 权限。

<details>
<summary>查看原文（21行）</summary>

```text
  "dshWorkshop": {
    "schema": "omdsh-workshop-package/v1",
    "type": "plugin",
    "integration": {
      "protocol": "harness-profile",
      "artifact": "cordis.patch.yml"
    },
    "install": {
      "mode": "transactional",
      "adapter": "profile-bundle",
      "failurePolicy": "generation-rollback",
      "touchesCurrentBeforeActivation": false
    },
    "lifecycle": {
      "activation": "hot-reload",
      "dispose": "supported"
    },
    "permissions": [
      "filesystem:read",
      "filesystem:write"
    ],
```

</details>

**依据 6 · 源码核查**：[index.mjs:1794-1812](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/index.mjs#L1794-L1812)

独立 import_claude 路径直接读并导入。

<details>
<summary>查看原文（19行）</summary>

```text
    async execute(args, exec) {
      const fs = requireFs(ctx)
      const claudeHome = config.claudeHome ? path.resolve(config.claudeHome) : locateClaudeHome()
      const targetPath = resolveImportTarget(args.path, claudeHome)
      const target = await fs.resolve(targetPath)
      exec?.signal?.throwIfAborted()
      const info = await fs.stat(target)
      if (info && info.type === 'directory') {
        const batch = await importDirectory(
          ctx, target, args, maxBytes, undefined,
          config.importConcurrency ?? DEFAULT_IMPORT_CONCURRENCY,
          exec?.signal, config,
        )
        return { mode: 'batch', ...batch }
      }
      exec?.signal?.throwIfAborted()
      const persisted = await listPersistedIds(ctx)
      const single = await importTranscript(ctx, target, args, maxBytes, persisted, undefined, exec?.signal, config)
      return { mode: 'single', ...single }
```

</details>

**依据 7 · 源码核查**：[index.mjs:2954-2981](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/index.mjs#L2954-L2981)

审批服务不存在或请求异常返回 unavailable；台账单独更新。

<details>
<summary>查看原文（28行）</summary>

```text
     * 审批端口（fail-closed）：ctx.approval 特性探测；无服务/无 agent/无开放
     * 回合一律 'unavailable'（不写任何内容）。
     */
    async approval(args = {}) {
      const service = ctx.get('approval')
      if (!service || typeof service.request !== 'function' || !args.agent) return 'unavailable'
      try {
        return await service.request({
          agent: args.agent,
          toolName: args.toolName ?? 'move_run',
          ...(args.callId ? { callId: args.callId } : {}),
          reason: args.reason,
          ...(args.signal ? { signal: args.signal } : {}),
        })
      } catch {
        // 无开放回合等：审批不可用，fail-closed。
        return 'unavailable'
      }
    },
    /** move.json 清单。 */
    async loadManifest() {
      return manifestStore.load()
    },
    /** 记录一条已执行计划（串行 + 原子写）。 */
    async record(key, rec) {
      return manifestStore.update((manifest) => {
        manifest[key] = { appliedAt: new Date().toISOString(), ...rec }
      })
```

</details>

**依据 8 · 源码核查**：[lib/wizard.mjs:135-183](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/lib/wizard.mjs#L135-L183)

预览后仅对 new 或 changed 计入审批，执行阶段继续按 resolution 分发其余项。

<details>
<summary>查看原文（49行）</summary>

```text
export async function runExecute(runtime, opts = {}) {
  const { resolve = {}, force = false, requireApproval = true, approval } = opts
  const selection = new Set(opts.selection ?? [])
  const manifest = opts.manifest
  const results = []
  const tally = { applied: 0, skipped: 0, conflictSkipped: 0, unsupported: 0, failed: 0, newSessions: [] }

  // 审批门（fail-closed）：只审批会真正产生写入的计划。
  const actionable = opts.plans.filter((p) =>
    p.action !== 'unsupported' && (selection.size === 0 || selection.has(p.key)))
  const previews = new Map()
  for (const plan of actionable) {
    previews.set(plan.key, await previewPlan(runtime, plan, manifest, force))
  }
  const writes = [...previews.values()].filter((e) => e.status === 'new' || e.status === 'changed')
  if (writes.length > 0 && requireApproval) {
    const outcome = await approval({
      ...(opts.approvalContext ?? {}),
      reason: `四合一迁移将写入 ${writes.length} 项（会话 ${writes.filter((e) => e.plan.action === 'import-session').length} 个、技能 ${writes.filter((e) => e.plan.kind === 'skill').length} 个、AGENTS.md 段 ${writes.filter((e) => e.plan.action === 'append-section').length} 个、命令 ${writes.filter((e) => e.plan.action === 'register-command').length} 个）`,
    })
    if (outcome !== 'allowed-once') {
      return {
        approved: false,
        outcome,
        results: writes.map((e) => ({ key: e.plan.key, status: 'not-approved', detail: `审批未通过（${outcome}）` })),
        ...tally,
      }
    }
  }

  for (const plan of opts.plans) {
    if (selection.size > 0 && !selection.has(plan.key)) {
      results.push({ key: plan.key, status: 'skipped', detail: '未选中' })
      tally.skipped++
      continue
    }
    const entry = previews.get(plan.key) ?? await previewPlan(runtime, plan, manifest, force)
    const exec = await executePlan(runtime, plan, entry, resolve[plan.key] ?? 'skip', force)
    results.push(exec)
    if (exec.status === 'applied') tally.applied++
    else if (exec.status === 'skipped') tally.skipped++
    else if (exec.status === 'conflict-skipped') tally.conflictSkipped++
    else if (exec.status === 'unsupported') tally.unsupported++
    else if (exec.status === 'failed') tally.failed++
    if (exec.status === 'applied' && plan.action === 'import-session' && exec.detail?.sessionId) {
      tally.newSessions.push({ key: plan.key, sessionId: exec.detail.sessionId, title: plan.title })
    }
  }
  return { approved: true, outcome: 'allowed-once', results, ...tally }
```

</details>

**依据 9 · 源码核查**：[lib/wizard.mjs:186-261](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/lib/wizard.mjs#L186-L261)

冲突默认跳过，显式解法可改名、合并或覆盖；写和台账各自提交。

<details>
<summary>查看原文（76行）</summary>

```text
/** 执行单个计划（含冲突解法与 manifest 记录）。 */
async function executePlan(runtime, plan, entry, resolution, force) {
  const fail = (err) => ({ key: plan.key, status: 'failed', detail: String((err && err.message) || err) })

  if (plan.action === 'unsupported') {
    return { key: plan.key, status: 'unsupported', detail: plan.reason ?? '不支持' }
  }
  if (entry.status === 'unsupported') {
    return { key: plan.key, status: 'unsupported', detail: plan.reason ?? entry.reason ?? '不支持' }
  }
  if (entry.status === 'unchanged' && !force) {
    return { key: plan.key, status: 'skipped', detail: '已迁移（幂等跳过）' }
  }
  if (entry.status === 'conflict') {
    // merge 只对 append-section 有意义；技能类 merge 按 skip 处理（不猜测）。
    const unusable = plan.action !== 'append-section' && resolution === 'merge'
    if (resolution === 'skip' || !resolution || unusable) {
      return { key: plan.key, status: 'conflict-skipped', detail: '目标冲突且未选择解法（默认跳过）' }
    }
  }

  try {
    if (plan.action === 'import-session') {
      const result = await runtime.importSession(plan, { force })
      return { key: plan.key, status: 'applied', detail: result }
    }
    if (plan.action === 'register-command') {
      const result = await runtime.registerCommand(plan.target.commandName, plan.content)
      if (result.registered === false) {
        return { key: plan.key, status: 'failed', detail: result.reason ?? '命令注册失败' }
      }
      // 记录含提示词：插件重启后 apply 时按 manifest 重建命令注册。
      await runtime.record(plan.key, { digest: plan.digest, action: 'register-command', target: plan.target.commandName, prompt: plan.content })
      return { key: plan.key, status: 'applied', detail: { commandName: plan.target.commandName } }
    }
    if (plan.action === 'append-section') {
      const target = await runtime.readTarget(plan.target.path)
      const { planSection, mergedSection } = await import('./agmd-section.mjs')
      let step
      if (resolution === 'merge') {
        step = mergedSection(target, plan.key, plan.content, plan.source.file)
      } else {
        step = planSection(target, plan.key, plan.content, plan.source.file)
      }
      if (step.status === 'unchanged') {
        return { key: plan.key, status: 'skipped', detail: '段内容未变（幂等跳过）' }
      }
      const { sectionInner } = await import('./agmd-section.mjs')
      await runtime.writeTarget(plan.target.path, step.text)
      await runtime.record(plan.key, {
        digest: plan.digest,
        action: 'append-section',
        target: plan.target.path,
        sectionDigest: digestText(sectionInner(step.status === 'new' ? plan.content : step.newContent, plan.source.file)),
      })
      return { key: plan.key, status: 'applied', detail: { target: plan.target.path, section: step.status } }
    }
    // 技能类：copy / convert-copy
    let targetPath = plan.target.path
    if (resolution === 'rename') {
      targetPath = await runtime.renameTarget(plan.target.path)
    }
    const sourceText = await runtime.readSource(plan.source.file)
    if (sourceText === null) throw new Error('源技能文件不可读：' + plan.source.file)
    const { renderSkill } = await import('./skill-migrate.mjs')
    const rendered = plan.action === 'convert-copy'
      ? renderSkill(sourceText, plan.source.name).content
      : sourceText
    await runtime.writeTarget(targetPath, rendered)
    await runtime.record(plan.key, {
      digest: plan.digest,
      targetDigest: digestText(rendered),
      action: plan.action,
      target: targetPath,
    })
    return { key: plan.key, status: 'applied', detail: { target: targetPath, converted: plan.action === 'convert-copy' } }
```

</details>

**依据 10 · 源码核查**：[lib/wizard.mjs:73-97](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/lib/wizard.mjs#L73-L97)

已有技能通过源和目标内容摘要判断。

<details>
<summary>查看原文（25行）</summary>

```text
  // 技能类：copy / convert-copy
  const targetText = await runtime.readTarget(plan.target.path)
  const targetExists = targetText !== null
  if (!targetExists) {
    if (rec && rec.digest === plan.digest) {
      return { plan, status: 'changed', reason: '目标缺失（可能被删除），重新应用' }
    }
    return { plan, status: 'new' }
  }
  if (!rec) {
    return {
      plan,
      status: 'conflict',
      reason: '目标已存在且无迁移记录，diff 供选择',
      existing: targetText.length > 800 ? targetText.slice(0, 800) + '\n…（截断）' : targetText,
    }
  }
  if (rec.digest === plan.digest && rec.targetDigest === digestText(targetText)) {
    return force ? { plan, status: 'changed', reason: 'force：重新应用' } : { plan, status: 'unchanged' }
  }
  if (rec.targetDigest === digestText(targetText)) {
    return { plan, status: 'changed', reason: '源技能内容更新' }
  }
  return {
    plan,
```

</details>

**依据 11 · 源码核查**：[lib/imports-store.mjs:27-59](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/lib/imports-store.mjs#L27-L59)

台账写串行和进程内同源任务互斥。

<details>
<summary>查看原文（33行）</summary>

```text
    update(mutator) {
      const next = writeChain.then(async () => {
        const imports = await loadImports(resolveCacheDir())
        const result = await mutator(imports)
        await saveImports(resolveCacheDir(), imports)
        return result
      })
      // 队列吞掉失败：单次失败不阻塞/毒化后续写入（错误已随 next 抛给本次调用方）。
      writeChain = next.catch(() => {})
      return next
    },

    /**
     * 同一源文件互斥：并发调用同一 key 时按到达顺序排队，后到者等待先行者
     * （含失败）完成后重新执行 fn——此时 imports.json 已含先行者记录，fn
     * 内部按幂等路径处理。排队期间的新到达者挂在最新任务后，绝不并行。
     * @param key - 互斥键（源 transcript 绝对路径）。
     * @param fn - 独占执行的任务。
     * @returns fn 的结果。
     */
    async exclusive(key, fn) {
      const prev = sourceLocks.get(key)
      const task = (async () => {
        if (prev !== undefined) await prev.catch(() => {})
        return fn()
      })()
      sourceLocks.set(key, task)
      try {
        return await task
      } finally {
        if (sourceLocks.get(key) === task) sourceLocks.delete(key)
      }
    },
```

</details>

#### 缺口

- 没有实际审批拒绝、崩溃恢复及源目录只读权限验证。
  **影响**：无法将作者安全保证提升为部署环境已验证结论。
  **进一步探讨**：在临时副本和独立 DSH profile 验证审批拒绝为零写入、重复运行幂等及源文件哈希不变。
- 没有核查目标 DSH 宿主对旧工具及显式冲突写入的外层权限
  **影响**：不能断言在真实宿主中写入一定被允许，也不能依赖向导审批自动阻止
  **进一步探讨**：只用临时副本分别验证拒绝审批、单个冲突项、旧 import_claude 与台账更新失败

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署需要哪些环境与人工投入，哪些成本或兼容风险可能阻断迁移？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要受支持的 Node/DSH、源工具数据目录、对 DSH 会话/工作区和文件系统的访问权限；包声明 Node ^22.19 或 >=24.9，DSH peer 范围小于 0.3。迁移全量数据会消耗磁盘与扫描/导入时间，异常条目仍需人工检查；工作区模式可将会话放入单独 claudecode 或每项目目录。插件只写缓存和目标工作区，不能据此推断无敏感数据风险。旧格式兼容、隐私保留期限及导入失败后人工恢复成本未实测。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:115-118](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/package.json#L115-L118)

Node 与 DSH 引擎支持范围。

```text
  "engines": {
    "node": "^22.19.0 || >=24.9.0",
    "dsh": ">=0.1.6-0 <0.2.0 || >=0.2.0-0 <0.3.0 || >=0.2.2-0 <0.3.0"
  },
```

**依据 2 · 源码核查**：[index.mjs:301-304](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/index.mjs#L301-L304)

workspaceMode 与审批配置说明。

```text
 * @property {'claudecode'|'per-project'} [workspaceMode] 工作区归组方式：'claudecode'（默认）把全部导入会话挂到独立的 claudecode 工作区（claudecodeDir 目录）；'per-project' 按源项目 cwd 各建一个工作区。
 * @property {string} [claudecodeDir] claudecode 工作区目录；缺省 `$DSH_HOME/claudecode`（DSH_HOME 缺失时 `~/.dsh/claudecode`）。插件只会在此目录下创建文件夹（迁移唯一的有意写入），绝不触碰其它路径。
 * @property {boolean} [enableMove] 注册四合一迁移向导（move_detect/move_preview/move_run 工具与 /move 命令，默认 true）。
 * @property {boolean} [requireApproval] 迁移执行前经 ctx.approval 审批（默认 true；fail-closed，非 allowed-once 零写入；无审批 seam 的平台显式设 false 才可执行）。
```

**依据 3 · 作者声明**：[README.md:84-86](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/README.md#L84-L86)

导入后刷新、卸载和目标目录说明。

```text
   导入后无需重启 DSH——刷新一次已打开的 Web 页面，点任意导入会话即可继续。

**卸载**：`dsh plugin --profile web remove dsh-claude-move`（或从 profile 的 bundles 中删掉 `claude-move` 行）。导入的会话保留在 DSH 数据目录；插件只写自己的缓存（`$DSH_HOME/claude-move/`）和 `claudecode` 工作区文件夹，绝不触碰 Claude 源数据。
```

**依据 4 · 作者声明**：[README.md:148-150](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/README.md#L148-L150)

重复导入及 force 全副本行为。

```text
# 随时重跑：未变更的文件被跳过，增长的 transcript 只追加新的轮次。
# 超过 maxTranscriptBytes 的文件以分块流式导入（无内存上限）。
import_claude { path: "...", force: true }          # 全新的完整副本（保留之前的副本）
```

#### 缺口

- 没有大数据集耗时/磁盘用量测量和跨平台权限测试。
  **影响**：无法预测大规模搬迁的工期及目标数据目录容量。
  **进一步探讨**：用代表性数据测量扫描/导入耗时、输出体积与中断恢复，并明确数据保留与备份策略。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 实现结构和发布方式提供了哪些可复用设计，证据边界是什么？

**研究主题**：工程质量与复用

#### 完整回答

包以纯 ESM 入口 index.mjs 和 lib 发布，不要求构建准备步骤；客户端面板为无依赖 vanilla 脚本，经 ModuleLoader 注入并访问插件自己的 API。README 展示四来源 parser/mapper、统一审批和 move.json 台账，支持将来源适配与目标写入分离的复用思路。与此同时，数千行聚合入口和对宿主服务的可选探测增加维护面；描述中的测试脚本存在不等于本轮通过。包 manifest 中 install/failureIsolation/hotReload/remove 证据字段为空，不能声称安装事务/卸载行为经过独立验收。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-11](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/package.json#L1-L11)

纯 ESM 包入口与 client 导出。

<details>
<summary>查看原文（11行）</summary>

```text
{
  "name": "dsh-claude-move",
  "description": "Four-source migration wizard: copy Claude Code, Codex, OpenCode and Hermes sessions, memories, skills, instructions and slash commands into DeepSeek Harness as resumable sessions — copy-only, approval-gated, idempotent",
  "version": "0.4.19",
  "type": "module",
  "main": "./index.mjs",
  "exports": {
    ".": "./index.mjs",
    "./client": "./client/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
```

</details>

**依据 2 · 源码核查**：[package.json:48-89](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/package.json#L48-L89)

声明安装协议、权限及 lifecycle evidence 空值。

<details>
<summary>查看原文（42行）</summary>

```text
  "dshWorkshop": {
    "schema": "omdsh-workshop-package/v1",
    "type": "plugin",
    "integration": {
      "protocol": "harness-profile",
      "artifact": "cordis.patch.yml"
    },
    "install": {
      "mode": "transactional",
      "adapter": "profile-bundle",
      "failurePolicy": "generation-rollback",
      "touchesCurrentBeforeActivation": false
    },
    "lifecycle": {
      "activation": "hot-reload",
      "dispose": "supported"
    },
    "permissions": [
      "filesystem:read",
      "filesystem:write"
    ],
    "compatibility": {
      "dshVersions": [
        "0.1.7-alpha.1",
        "0.1.7-alpha.2",
        "0.1.7-rc.1",
        "0.1.7-rc.2",
        "0.2.1-alpha.1"
      ]
    },
    "capability": {
      "id": "move-wizard",
      "kind": "command",
      "invocation": "/move",
      "expected": "detects the four sources, renders the migration preview, and with approval applies the plans and records them in move.json (re-runs skip unchanged items)"
    },
    "evidence": {
      "install": null,
      "failureIsolation": null,
      "hotReload": null,
      "remove": null
    }
```

</details>

**依据 3 · 源码核查**：[client/client.js:1-24](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/client/client.js#L1-L24)

客户端通过 ModuleLoader 注册面板，主要依赖 DOM 和本插件 API。

<details>
<summary>查看原文（24行）</summary>

```text
// SPDX-License-Identifier: Apache-2.0
// client/client.js — dsh-claude-move 浏览器迁移面板（F16）。
//
// 零依赖 vanilla 面板：host 端 dsh.client 扫描把本文件作为 classic script
// 注入 __DSH_BOOT__ 图，执行时经 window.__ModuleLoader__.load 注册工厂；
// 工厂闭包在首次 materialize 时运行，apply 挂载浮层面板（无注入服务，
// 只依赖 DOM + 本插件自注册的 /api/claude-move/* JSON 路由）。
// 面板自身不产生任何模型可见内容。文案按浏览器语言 zh/en 双语（D3）。

(function () {
  'use strict'
  if (typeof window === 'undefined' || !window.__ModuleLoader__ || !window.__ModuleLoader__.load) return
  window.__ModuleLoader__.load({
    id: 'dsh-claude-move',
    factory: function () {
      return {
        name: 'claude-move-panel',
        inject: [],
        apply: function (ctx) { installPanel(ctx) },
        // 纯函数测试面（U3）：面板仅此三个无 I/O/时钟/随机的纯函数。
        helpers: { panelText, esc, safeService, strings: PANEL_STRINGS },
      }
    },
  })
```

</details>

**依据 4 · 作者声明**：[README.md:130-133](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/README.md#L130-L133)

来源 parser/mapper、幂等台账及审批设计说明。

```text
- **来源** —— Claude Code（`~/.claude`）、Codex（`~/.codex`）、OpenCode（数据 + 配置根）、Hermes（技能/记忆根）；每个来源都有自己的 parser + mapper。
- **映射** —— 记忆/指令 → 追加到 DSH 全局 `AGENTS.md` 的仅追加受管段落（每项一个标记段落）；技能 → 真正的 DSH 技能（`SKILL.md` 包原样复制，其他格式转换）；斜杠命令 → 已注册的 DSH 命令（重启后从 `move.json` 重建）；会话 → 可续聊的 DSH 会话（与阶段 1 相同的导入器）。
- **幂等** —— 每个已应用的计划都记录在 `$DSH_HOME/claude-move/move.json`（`digest` / `targetDigest` / `appliedAt`）；重跑跳过未变更项，`force` 重新应用它们。
- **审批门控** —— 任何会写入内容的运行都先询问 `ctx.approval`；除 `allowed-once` 之外的任何结果都意味着零写入。
```

#### 缺口

- 本轮未执行项目 tests 或实际安装/卸载生命周期。
  **影响**：不能独立确认发布 artifact 与源码声明一致或失败隔离有效。
  **进一步探讨**：对固定提交运行声明的测试/类型检查，并用打包产物做安装、热重载和卸载验收。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 什么假设值得下一步验证，推荐怎样逐步采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

假设：先对单个脱敏 Claude 项目做预览式扫描并导入，再在 DSH 中续聊，若消息/工具结构保真且未改变源文件，可以比人工复制更低成本地恢复工作上下文。推论来自只读源、增量导入与可续聊会话设计，但未有真实任务证据。目前建议观察。需先用模拟资料核对显式冲突项、旧工具和宿主外层隔离，才能判断是否开始限定试用；任何审批异常、源文件哈希变化或会话内容/工具结果错配都应停止导入。四来源迁移和写入能力不应未经审查直接对生产数据全量启用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-43](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/README.md#L39-L43)

源只读、目标可续聊和审批门工作流。

```text
Claude Code 用久了，历史都沉在 `~/.claude` 里：会话 transcript、memory、技能、`CLAUDE.md` 和 `settings.json`。`dsh-claude-move` 把这些读出来，转换成 DeepSeek Harness 里能打开、能续聊的会话与上下文——源目录全程只读，DSH 这边只 `create` + `append`，两侧都不会被移动、改写或删除。除 Claude Code 之外，Codex、OpenCode、Hermes 也能通过同一个 `/move` 向导迁移。

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-claude-move-flow-v5-dark.svg">
  <img src="docs/assets/dsh-claude-move-flow-v5-light.svg" width="100%" alt="dsh-claude-move 结构：四源只读 → move_detect / plan / move_preview → 审批门（allowed-once，其余零写入）→ DSH 写入面；move.json 台账回流保证幂等">
```

**依据 2 · 作者声明**：[README.md:78-86](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/README.md#L78-L86)

安装挂载、单命令导入和卸载边界。

````text
   然后在任意 DSH 会话里跑一条命令：

   ```sh
   /claude-import-all      # 扫描 → 复制每个 Claude 会话 → 报告
   ```

   导入后无需重启 DSH——刷新一次已打开的 Web 页面，点任意导入会话即可继续。

**卸载**：`dsh plugin --profile web remove dsh-claude-move`（或从 profile 的 bundles 中删掉 `claude-move` 行）。导入的会话保留在 DSH 数据目录；插件只写自己的缓存（`$DSH_HOME/claude-move/`）和 `claudecode` 工作区文件夹，绝不触碰 Claude 源数据。
````

**依据 3 · 作者声明**：[README.md:123-133](https://github.com/PerryLink/dsh-claude-move/blob/1ff7d3031279b7f2d3fc243eda77f93ae745ab69/README.md#L123-L133)

四来源预览、冲突策略与写入审批步骤。

<details>
<summary>查看原文（11行）</summary>

````text
/move              # 一次性向导：检测 → 预览 → 执行 → 报告（全部四个来源）
move_detect        # 扫描 Claude Code / Codex / OpenCode / Hermes
move_preview       # 逐项计划：new | unchanged | changed | conflict（含 diff）| unsupported
move_run           # 在审批门控之后执行；冲突解决：
                   #   skip | overwrite | rename | merge  （默认 skip——绝不猜测）
```

- **来源** —— Claude Code（`~/.claude`）、Codex（`~/.codex`）、OpenCode（数据 + 配置根）、Hermes（技能/记忆根）；每个来源都有自己的 parser + mapper。
- **映射** —— 记忆/指令 → 追加到 DSH 全局 `AGENTS.md` 的仅追加受管段落（每项一个标记段落）；技能 → 真正的 DSH 技能（`SKILL.md` 包原样复制，其他格式转换）；斜杠命令 → 已注册的 DSH 命令（重启后从 `move.json` 重建）；会话 → 可续聊的 DSH 会话（与阶段 1 相同的导入器）。
- **幂等** —— 每个已应用的计划都记录在 `$DSH_HOME/claude-move/move.json`（`digest` / `targetDigest` / `appliedAt`）；重跑跳过未变更项，`force` 重新应用它们。
- **审批门控** —— 任何会写入内容的运行都先询问 `ctx.approval`；除 `allowed-once` 之外的任何结果都意味着零写入。
````

</details>

#### 缺口

- 没有真实工作任务或用户反馈验证迁移价值。
  **影响**：持续采用应取决于内容保真、权限边界和人力成本的实证。
  **进一步探讨**：先完成单会话沙盒试验，再根据校验记录批准单项目迁移；扩到其他来源前分别验证其解析器。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
