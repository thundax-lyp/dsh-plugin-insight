# @hyzyn/dsh-codegraph

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[44554d7](https://github.com/hyzyn/dsh-plugin-kit/tree/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/codegraph)

<!-- BEGIN META -->
[![GitHub ★ 62](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=62&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hyzyn/dsh-plugin-kit) [![npm 30d 4,860](https://img.shields.io/static/v1?label=npm+30d&message=4%2C860&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-codegraph) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-codegraph)
<!-- END META -->

> **功能**：在 DSH 中查看 Codegraph 索引、搜索符号与调用关系，并按会话项目挂载 MCP 工具。

> **亮点**：主要增量是将项目归属纳入MCP挂载生命周期：有索引的Agent使用自己的索引根，异步挂载通过在途集合与世代号处理重复和撤销。GUI降低逐次组织CLI参数的操作分散，但未证明更快更准；作用域实际效果仍依赖宿主，见 [Q01](#research-q01)和[Q02](#research-q02)。

> **主要限制**：用户想要的per-agent模式可能因缺少事件面或手工全局行而退回managed；因此不能把默认开关当成跨项目隔离保证。配置写入也只是有限重读，冲突达到上限继续覆盖，非严格CAS，见 [Q03](#research-q03)。

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
  - [Q01 · 相对手动CLI与一份全局MCP，插件提供什么增量？](#detail-section-11)
  - [Q02 · 按Agent挂载是否真正跟随会话并处理异步撤销？](#detail-section-12)
  - [Q03 · 哪些条件会退回全局模式，配置写入是否严格并发安全？](#detail-section-13)
  - [Q04 · GUI操作如何执行CLI，用户如何处理依赖与失败？](#detail-section-14)
  - [Q05 · 对谁值得试，何时停用，哪些效果仍未知？](#detail-section-15)
  - [Q06 · 可从当前取舍推导什么更可靠的项目绑定方法？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已使用 Codegraph 的开发者可在 DSH 内查符号和调用关系，尤其关注多项目同时工作时的工具归属。合格结果是结果来自当前索引根、无索引会话不借用别项目工具，见 [Q01](#research-q01)。

参照是显式传项目路径的Codegraph CLI和一份全局cwd的MCP服务。索引与调用图能力归上游Codegraph，本组件组织宿主入口、目录绑定和生命周期。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 符号与调用关系查询 | 在卡片中查Codegraph结果 | 能力归上游CLI，需有效索引 |
| 索引管理 | init、sync、index与uninit | 会改变索引状态，取消不证明回滚 |
| 按Agent MCP挂载 | 把会话目录绑定到工具进程 | 前提缺失退回managed，需核对生效模式 |
| 托管配置同步 | 维护或挂起全局Codegraph行 | 有限重读非严格CAS，操作前备份 |
| 诊断与取消 | 展示失败并终止CLI进程 | 需另核对遗留锁与索引状态 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node >=22.19.0、兼容DSH、@hyzyn/dsh-kit | 启动必需 | Host运行与共享工具 | 以package声明为准，本轮未验运行兼容 |
| Codegraph命令及项目索引 | 查询必需 | 索引和关系计算 | 探测失败显示错误，未索引不应借别项目上下文 |
| 宿主MCP客户端与Agent事件/context | 按Agent挂载必需 | 进程与工具作用域绑定 | 缺少前提会失败或退回managed，须看实际状态 |
| React与Web slots | 卡片必需 | 在设置中操作与查看 | 不保证纯Host有界面 |
| 可写profile配置及预先备份 | 托管必需 | 维护全局MCP行与模式切换 | 有限冲突重读不提供跨进程事务 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户备份profile和索引，确认CLI可显式路径查询 | 记录两个项目可区别的符号 |
| 加载 | 插件挂卡片、路由、探测及Agent事件 | 卡片显示实际模式和目录，错误时不继续索引写操作 |
| 查询 | 用户在不同会话做只读符号查询 | 每项结果可回查本项目源文件 |
| 检查失败 | 用户取消运行并再读索引状态 | 核查进程和锁，不把取消当回滚 |
| 退出 | 停用自动托管并恢复备份，改用显式路径CLI | 核对配置仅恢复目标部分与进程释放 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | CLI、索引与依赖存储，金额未知 | 配置命令、备份和验证项目归属，耗时未知 | 作者内存测量非本轮实测 |
| 持续使用 | 已索引Agent各一MCP进程与查询、索引资源 | 维护索引新鲜度与宿主接口 | 资源量和任务节时未知 |
| 失败恢复 | 重建索引、遗留进程与锁检查 | 读诊断、恢复配置及对照CLI | 上游取消后索引状态需再验 |
| 退出 | 保留索引和备份的存储 | 撤销挂载并检查托管行恢复 | 实际退出工时未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 项目归属 | 按Agent传索引根，未索引不挂 | 外部宿主作用域实际隔离 |
| 查询便利 | 卡片路由执行CLI并展示 | 相对终端的净节时和定位质量 |
| 失败处理 | 世代撤销、进程取消及诊断 | 上游数据库完整性和长期资源负担 |

> **思考**：用户想要的per-agent模式可能因缺少事件面或手工全局行而退回managed；因此不能把默认开关当成跨项目隔离保证。配置写入也只是有限重读，冲突达到上限继续覆盖，非严格CAS，见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：主要增量是将项目归属纳入MCP挂载生命周期：有索引的Agent使用自己的索引根，异步挂载通过在途集合与世代号处理重复和撤销。GUI降低逐次组织CLI参数的操作分散，但未证明更快更准；作用域实际效果仍依赖宿主，见 [Q01](#research-q01)和[Q02](#research-q02)。

可借鉴的是异步资源挂载的pending去重与世代撤销，以及把可选能力失败与Agent创建隔离。有限重读的原子文件替换可降低交叠，但不能冒充严格并发控制；CLI进程终止与索引恢复是不同责任，见 [Q02](#research-q02)、[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

用户想要的per-agent模式可能因缺少事件面或手工全局行而退回managed；因此不能把默认开关当成跨项目隔离保证。配置写入也只是有限重读，冲突达到上限继续覆盖，非严格CAS，见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有Codegraph CLI的开发者可先用两个可重建测试项目做只读查询，核对实际挂载模式、项目根和无索引会话的工具暴露，再决定是否扩大使用。需要多项目隔离却退回managed时，先回到显式路径CLI；配置无关行变化、串项目或进程不退出均应停止自动托管并从备份恢复。具体判据见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

按Agent目录挂载、世代撤销与GUI接线是源码可见机制；隔离效果和资源节省未实测。连接池是研究者未验证设计，不属于现有插件贡献。

- 已检查：作者 README、包清单、源码路径 packages/codegraph/README.md、packages/codegraph/package.json、packages/codegraph/cordis.patch.yml、packages/codegraph/src/index.ts、packages/codegraph/src/scope.ts、packages/codegraph/src/env-gate.ts、packages/codegraph/lib/scope.js、packages/codegraph/client-src/index.js 及固定范围 inventory；组件：packages/codegraph。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整INVENTORY覆盖该子包；定向读取作者说明、package与补丁、Host的路由/CLI/模式/Agent接线、scope与env门禁、客户端卡片注册。未逐行审计全部图表和测试，也未核对Codegraph内部算法或宿主scope源码。
- 下一步：- 已检查固定版本源码及作者说明。
- 未运行CLI、目标测试、安装或真实宿主验收。
- 作者兼容、性能和资源测量不视为本轮实测。
- 宿主作用域、上游索引正确性和原子写工具为外部依赖，不据注释推定已经验证。

**分析版本**

- **仓库**：[hyzyn/dsh-plugin-kit](https://github.com/hyzyn/dsh-plugin-kit)
- **版本号**：0.6.20（[固定提交 44554d7](https://github.com/hyzyn/dsh-plugin-kit/tree/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是按索引根复用MCP连接，同时把项目身份绑定在工具视图与每次查询上；它试图减少每Agent进程负担，又不能牺牲隔离。所有权、释放、失效及可推翻对照见 [Q06](#research-q06)。

- 已检查固定版本源码及作者说明。
- 未运行CLI、目标测试、安装或真实宿主验收。
- 作者兼容、性能和资源测量不视为本轮实测。
- 宿主作用域、上游索引正确性和原子写工具为外部依赖，不据注释推定已经验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 6 | 10139 | 6974 | 2981 | — |
| .md | source | 6 | 1792 | — | — | 56758 |
| .mjs | source | 2 | 546 | 345 | 178 | — |
| .ts | source | 3 | 5261 | 3092 | 1934 | — |
| .ts | test | 19 | 6980 | 5067 | 1305 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/hyzyn/dsh-plugin-kit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=9&color=737b86&logo=github)](https://github.com/hyzyn/dsh-plugin-kit/issues?q=is%3Aissue+created%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z) [![近30天关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/hyzyn/dsh-plugin-kit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：插件如何把代码索引接入 DSH 多会话工作，哪些作用域与配置写入条件会限制项目隔离？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对手动CLI与一份全局MCP，插件提供什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向已经使用 Codegraph 索引、希望在 DSH 中搜索符号与查看调用关系的开发者，尤其是同时处理多个项目的人。简单办法是在终端逐次传路径调用 Codegraph，或只配置一份全局 MCP 服务。该组件把 CLI 状态、查询和索引动作接入卡片，并将 MCP 工作目录绑定到会话索引根；Codegraph 自身负责索引和关系推导，不能把图谱算法归到本插件。

真正的候选贡献是把同名工具在不同项目中的语义分开，而非再增加一张图表。默认按 Agent 挂载可避免所有会话共用全局 cwd 的设计取舍，但其成立取决于宿主上下文和外部 MCP 客户端。对只用一个项目且熟悉 CLI 的人，维护这层适配可能没有额外收益。合格结果应是两个项目同时查询时各自得到本项目结果，无索引会话拿不到别的项目的工具，并能解释失败。缺少同任务对照，不能宣称节时或索引质量提高。

#### 证据与依据

**依据 1 · 作者声明**：[packages/codegraph/README.md:5-18](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/codegraph/README.md#L5-L18)

作者声明GUI与按Agent模式目标，兼容和实测仍为作者报告。

<details>
<summary>查看原文（14行）</summary>

```text
> DSH 的「Codegraph」卡片：把代码图谱的状态、符号搜索、调用链搬进 GUI，并替你把 codegraph MCP 服务器的项目目录对齐好。

## 特性

- **`status --json` 字段分区呈现**：`initialized` / `version` / `projectPath` / `fileCount` / `nodeCount` / `edgeCount` / `lastIndexed` / `pendingChanges` / `languages` / `dbSizeBytes` 分区铺开，原始 JSON 收进 `<details>`；符号下钻输出带行号的 verbatim 源码 + `callers` / `callees` / `impact` 三段关系。CLI 的过期信号（`reindexRecommended` / `builtWithVersion` / 提取器版本差 / `worktreeMismatch`）会在面板上给出一行警告并把「重建索引」标成建议动作。
- **索引两条路径、超时分两档**：`sync -- <path>` 增量、`index [--force] -- <path>` 全量重建走 `indexTimeoutMs`（默认 600s，`0` = 不限时）；`status` / `query` / `callers` / `callees` / `impact` / `node` 走 `cliTimeoutMs`（默认 60s，`0` = 不限时）。超时与取消都走「SIGTERM → 3s 清理窗口 → SIGKILL」的进程组升级链，POSIX 与 Windows 同一套语义；索引类操作进行中卡片有「取消」按钮，关闭页面也会中止 CLI。
- **托管 MCP 服务器行**：dsh-mcp-client 不声明 MCP roots，`codegraph serve --mcp` 只从 `process.cwd()` 向上解析 `.codegraph/`；插件在 `~/.dsh/cordis.patch.yml` 维护 `@deepseek-ai/dsh-mcp-client` 行并写 `config.cwd`，改写经 watchUserPatches 热加载重建 MCP 连接。同一台服务器同一时刻只挂一个项目，其余项目用 `projectPath` 查询。
- **索引判定取 `.codegraph/*.db` 且与 CLI 同口径向上解析**：从目标目录向上（到 git 根为止）找第一个带索引库的 `.codegraph/`，命中根即项目根——monorepo 子目录里的会话不再被误判「未索引」。只看目录存在会把 codegraph CLI 自身的安装目录 `~/.codegraph` 判成项目索引，托管行随之落在未索引 cwd 上——实测该状态下 `codegraph_explore` 的 required 由 `["query"]` 变为 `["query","projectPath"]`。非真索引时不改写现有 cwd，卡片给出 `indexState` 与原因。
- **写入纪律**：对 `~/.dsh/cordis.patch.yml` 的每次写都带 mtime+size 盖章复核（dsh-mcp 同款 CAS，≤3 次重读）；复用 dsh-mcp 区块时只定点改 codegraph 行自己的 `cwd:` 一行，区块里的注释、其它服务器行、loader 合法的 override 条目逐字节保留；区块损坏时拒绝追加第二个区块（serverName 撞名会让 codegraph MCP 整体加载失败），把原因报给卡片。
- **托管行 cwd 跟随活动会话**：`followSession`（默认开）在会话切到有效索引项目时对齐托管行，否则回落到绑定路径；绑定路径由「设为默认项目」写入 settings 命名空间 `codegraph` 并把 `followSession` 置 false（显式指定优先于会话跟随）。会话上报失败会退避重试，不再一次抖动就永久失效。
- **默认 per-agent MCP 隔离**（`mcpScope` 默认 `'per-agent'`；显式写 `'managed'` 即回滚到旧行为）：每个 agent 在自己的 Cordis scope 里挂一份独立的 `dsh-mcp-client`，`cwd` 固定为它会话目录解析出的索引根——多项目并行不再共享一个全局 cwd，也不再需要「写盘 → 热加载 → 重建连接」那条链；全局托管行会被**挂起**（`disabled: true`，切回 managed 自动恢复）。代价是每个已索引会话一个子进程（实测空 Node 基线约 40MB）。**会话目录没有可用索引时该 agent 不挂**（不回落默认项目）：家目录 / 无索引仓库里开的会话拿不到 `mcp__codegraph__*`，而不是拿到「某个别的项目」的上下文。
  前提不成立时（宿主没有 agent 事件面 / 区块外有手工 codegraph 行 / MCP 总开关关闭）仍**退回 managed 并在卡片上说明原因**，退回后行为与旧版一致。**per-agent 挂载会等 env 的就绪服务**（`dshEnvReady`）：子进程继承宿主的 `scrubbedParentEnv()`，所以要等 env 的同步预注入完成；宿主没装 env 时不等（见 `src/env-gate.ts`）。挂载模式以**持续生效**为准：`agents` 服务迟到时插件会在服务到货时重新裁决并补挂（codegraph CG69）。机制实测与取舍见 [docs/p0-plan.md](./docs/p0-plan.md)。
- **一键初始化**：未初始化的目录在卡片上直接点「初始化索引」跑 `codegraph init`（两步确认）——`index` / `sync` 都要求项目先 init 过。
- **systemPrompt 分两段，门禁刻意不对等**：`plugin:dsh-codegraph`（order 150，≤70 字符：只说「本机有这个插件、提到就引导用户去开卡片」）与 `plugin:dsh-codegraph:usage`（order 151，≤600 字符：何时用 / 两个入口 / 失败怎么办）。公告段**只看** `announceToAgent` 开关——它讲的是卡片，而卡片路由无条件注册，所以 CLI 探测没落地或失败时它照常注入；usage 段要 `CLI 探测可用 && usageGuidance && 生效路径已索引` 三道全过。两个开关写 settings 命名空间后即时增删 section。
```

</details>

**依据 2 · 源码核查**：[packages/codegraph/src/scope.ts:172-192](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/codegraph/src/scope.ts#L172-L192)

挂载判定要求该会话有有效索引，拒绝回落默认项目。

<details>
<summary>查看原文（21行）</summary>

```text
  reason: string
}

/**
 * 纯函数：一个 agent 该不该挂 MCP，以及挂在哪个目录。
 *
 * **没有有效索引就不挂**（不是回落到默认项目）：一个在别处（比如家目录）开的会话，
 * 拿到「某个别的项目」的探索工具只会给出误导性答案；没有工具时模型会按指引退回
 * grep/read，那才是正确的降级。
 *
 * cwd 取 **locateIndex 找到的根**（与 `effectiveProjectPath` 同口径，CG02）：会话目录在
 * monorepo 子目录时索引在仓库根。
 */
export function agentMountDecision(input: AgentMountInput): AgentMountDecision {
  if (input.cliAvailable === false) {
    return { mount: false, reason: 'codegraph CLI 不可用（探测失败），未挂载' }
  }
  const cwd = typeof input.sessionCwd === 'string' ? input.sessionCwd.trim() : ''
  if (cwd === '') {
    return { mount: false, reason: '会话没有工作目录，未挂载' }
  }
```

</details>

**依据 3 · 源码核查**：[packages/codegraph/client-src/index.js:2507-2548](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/codegraph/client-src/index.js#L2507-L2548)

卡片实际注册到多种宿主设置槽。

<details>
<summary>查看原文（42行）</summary>

```text
        ctx.slots.inject('plugins.bundle.config', () => {
          bundleConfigLive = true
          while (disposeOwnRowConfigs.length > 0) {
            const disposeRow = disposeOwnRowConfigs.pop()
            if (typeof disposeRow === 'function') disposeRow()
          }
          return ctx.slots.register({
            name: 'plugins.bundle.config',
            key: OWN_BUNDLE,
          }, CodegraphSettingsCard)
        })
      }
      for (const key of ROW_CONFIG_KEYS) {
        ctx.slots.inject('plugins.row.config', () => {
          const own = key.split('#')[0] === OWN_BUNDLE
          if (own && bundleConfigLive) return undefined
          const disposeRow = ctx.slots.register({
            name: 'plugins.row.config',
            key,
          }, CodegraphSettingsCard)
          if (own) disposeOwnRowConfigs.push(disposeRow)
          return disposeRow
        })
      }
      // DSH ≥0.1.6：设置里与「通用设置」平级的「插件配置」页（子 slot 由
      // @hyzyn/dsh-kit-settings 声明）。不传 view，卡片走各自原有的可折叠形态。
      ctx.slots.inject('settings.kit.item', () => ctx.slots.register({
        name: 'settings.kit.item',
        id: 'codegraph',
        order: 60,
        label: () => "Codegraph",
      }, CodegraphSettingsCard))
      // DSH ≤0.1.5：设置 → 插件 的「插件配置」标签页，keyed 插槽按 settings 命名空间派发。
      ctx.slots.inject('settings.plugin.item', () => ctx.slots.register({
        name: 'settings.plugin.item',
        // settings.plugin.item 是 keyed 插槽：key 必须是该卡片所编辑的 settings 命名空间
        key: 'codegraph',
        order: 104,
      }, CodegraphSettingsCard))
    }

    return exports
```

</details>

#### 缺口

- 缺少同任务终端基线与用户使用频率。
  **影响**：无法确认适配成本是否被查询便利抵消。
  **进一步探讨**：用同一项目集合比较终端和卡片完成符号定位、影响面查找的耗时与错误。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 按Agent挂载是否真正跟随会话并处理异步撤销？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

源码中的接线是实际调用而非只写配置。Host 创建挂载器，订阅 agent/created，将该 Agent 交给挂载器，并在 agent/disposed 时撤销。挂载器从会话 cwd 解析索引根，再调用 agent.ctx.plugin 加载宿主 MCP 客户端，传入固定 serverName、serve --mcp 和该根目录。它不是自己实现 MCP 协议或代码索引。

并发创建有 pending 集合避免同一cwd重复挂载，换目录会先撤销旧fiber；世代号使迟到的异步模块加载不会挂到已被撤销的Agent上。启动失败被记录而不抛给Agent创建，既避免可选搜索能力阻断会话，也意味着“会话能启动”不证明MCP已连接。env就绪门禁只在检测到环境插件已挂载而尚未就绪时等待，否则立即继续。此处直接核实了本组件传参、事件和回收调用，但宿主scope隔离与子进程最终销毁仍依赖外部实现，本轮没有执行证明。

#### 证据与依据

**依据 1 · 源码核查**：[packages/codegraph/src/index.ts:4097-4160](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/codegraph/src/index.ts#L4097-L4160)

真实创建挂载器、载入MCP客户端及Agent事件接线。

<details>
<summary>查看原文（64行）</summary>

```text
      // 可选依赖：宿主没装 dsh-mcp-client 时 undefined（走 managed 的宿主本来也就没有它）。
      // 用变量式 specifier 而不是字面量 import()，让打包器别把它内联进产物——
      // 这个包在本包的 peerDependenciesMeta 里是 optional。
      //
      // **必须是宿主那一份**（不是「随便一份」）：`dsh-mcp-client` 的 serverName 占用、
      // 工具注册、scope 判定都经 `dsh-scope` 的 `kScope`，而那是**模块内局部 Symbol**
      // （`dsh-scope/lib/index.js:229`）。解析到第二份 dsh-scope 副本时，所有 `scopeOf()`
      // 都返回 undefined，per-agent 隔离会**静默退化成「都算根 scope」**——两个 agent
      // 抢同一个 serverName，第二个必失败。实测本仓库的链接（plugins → 运行时 store）
      // 两侧解析到同一个文件；`scripts/link-dsh-runtime.mjs` 负责维持这件事，所以
      // 加依赖后必须重跑它（它按目录里已存在的包名遍历）。
      loadClient: async () => {
        try {
          const specifier = '@deepseek-ai/dsh-mcp-client'
          return await import(specifier)
        } catch (error) {
          console.warn('[dsh-codegraph] 载入 @deepseek-ai/dsh-mcp-client 失败（per-agent 不可用，可切回 managed）：'
            + (error instanceof Error ? error.message : String(error)))
          return undefined
        }
      },
      serverName: MCP_SERVER_NAME,
      command,
      cliAvailable: () => cliProbeState.available,
      resolveRoot: resolveIndexedRoot,
      isIndexed: (cwd) => indexState(cwd) === 'indexed',
      logger: { log: (message) => console.log(message), warn: (message) => console.warn(message) },
    })

    /**
     * agent 事件接线。刻意**不 await**挂载：agent/created 是 serial 派发
     * （`dsh-agent:545` 走 `ctx.serial`），在这里等一次 spawn+握手会拖慢会话创建，而
     * codegraph 是可选能力。挂载失败只记日志（见 createAgentMounter 的注释）。
     */
    try {
      const on = (ctx as unknown as { on(name: string, listener: (...args: unknown[]) => unknown): unknown }).on
      on.call(ctx, 'agent/created', (...args: unknown[]) => {
        const agent = (args[0] as { agent?: AgentLike } | undefined)?.agent
        if (agent === undefined) return
        // CG50：挂载模式必须用**生效**的裁决（scopeDecision.mode），不是用户想要的
        // （current.mcpScope）。两者不等时 resolveScopeMode 已经明确退回 managed 并给出
        // 原因，此时再按 wanted 挂载，等于把「已退回」那句话当没说：
        //   - mcpIntegration:false → 裁决是「两种模式都不挂」，实际却照挂；
        //   - 区块外手工行 → 裁决是「插件无权顶掉用户的显式配置」，实际与手工行并存，
        //     没有索引的 agent 照样会继承到全局那行的项目上下文（正是 P0 要消除的漂移）。
        // 裁决未落地时回落 managed（保守：不挂载）。apply 里的兜底 effect 是同步跑的，
        // 所以实际路径上裁决总是先于 agent/created 存在。
        const mounter = getMounter()
        if (mounter === undefined) return
        // env 的同步预注入必须先于 per-agent 子进程 spawn（射程与实测边界见 env-gate.ts）。
        whenEnvReady(ctx as unknown as EnvGateContext, () => {
          mounter.attach(agent, runtimeRef?.scopeDecision?.mode ?? DEFAULT_MCP_SCOPE)
        })
      })
      on.call(ctx, 'agent/disposed', (...args: unknown[]) => {
        const agent = (args[0] as { agent?: AgentLike } | undefined)?.agent
        if (agent === undefined) return
        getMounter()?.detach(agent)
      })
    } catch (error) {
      agentEventsAvailable = false
      console.warn('[dsh-codegraph] agent 事件订阅失败（per-agent 模式不可用，保持 managed）：'
        + (error instanceof Error ? error.message : String(error)))
    }
```

</details>

**依据 2 · 源码核查**：[packages/codegraph/src/scope.ts:304-327](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/codegraph/src/scope.ts#L304-L327)

同cwd复用在途和已挂载项，cwd变化先撤销。

<details>
<summary>查看原文（24行）</summary>

```text
    // 的第二个实例会被 dsh-mcp-client 直接拒绝，白跑一次连接）。
    //
    // 但**会话目录变了**要重挂（实测：同一 scope 里再挂一个同名实例会被拒
    // 「serverName "codegraph" is already in use」，唯一的换项目路径是「释放旧 scope +
    // 建新 scope」，等价于 detach 后重新 attach）。不加这一条的话，resume / clear /
    // compaction 把 cwd 换掉之后，这个 agent 会一直用**上一个项目**的 MCP 服务器——
    // 正是本方案要消除的那种静默串台。
    const existing = mounted.get(id)
    if (existing?.mounted === true) {
      if (existing.cwd === cwd) return existing
      detachById(id)
    }
    // CG57：in-flight 幂等。上面的判据只看 `mounted === true`，而挂载在途时记录是
    // `mounted: false`——重复的 attach 以前会再开一份（见 `pending` 的注释）。
    // cwd 变了则不复用：那种情况本来就该重挂（同上面那条注释）。
    if (existing !== undefined && pending.has(id) && existing.cwd === cwd) return existing
    // 未挂载的记录**不**复用：`codegraph init` 之后再开同一会话时，判定结果会变，而
    // 判定本身很便宜（locateIndex 只是几次 stat）。缓存它会把这个 agent 永久钉在
    // 「不挂」上，且没有任何重试入口（agent/created 只在会话开始/恢复/清理时触发）。

    if (mode !== 'per-agent') {
      const record: AgentMountRecord = { id, cwd, mounted: false, reason: '当前模式是 managed，不走 per-agent 挂载', at: Date.now() }
      mounted.set(id, record)
      return record
```

</details>

**依据 3 · 源码核查**：[packages/codegraph/src/scope.ts:354-400](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/codegraph/src/scope.ts#L354-L400)

世代核对后通过agent.ctx.plugin挂载，并记录启动错误。

<details>
<summary>查看原文（47行）</summary>

```text
    pending.add(id)

    void deps.loadClient()
      .then((client) => {
        // CG57：世代不符 = 期间又 attach（换 cwd）或 detach 过 → 这次挂载作废
        if (generations.get(id) !== generation) return undefined
        if (client === undefined) {
          record.reason = '宿主没有 @deepseek-ai/dsh-mcp-client（可选依赖未安装），未挂载'
          deps.logger.warn(`[dsh-codegraph] ${record.reason}`)
          return undefined
        }
        // 整包 namespace 对象直接可用：cordis 的 Context.resolve 认「有 apply 的对象」
        // （`cordis/lib/index.js:1532-1537` isApplicable），所以不必挑 .apply 传。
        const config = {
          serverName: deps.serverName,
          transport: 'stdio',
          command: deps.command,
          args: ['serve', '--mcp'],
          cwd: decision.root,
          // 起不来时报错交给下面的 catch（而不是静默变成「这个 agent 没工具」）
          failOnStartupError: true,
        }
        const fiber = mountPlugin(client, config) as PluginFiberLike
        fibers.set(id, fiber)
        record.mounted = true
        record.reason = '已挂载'
        record.at = Date.now()
        deps.logger.log(`[dsh-codegraph] per-agent MCP 已挂载：agent=${id} cwd=${decision.root}`)
        // 不 await：agent/created 是 serial 派发，等一次 spawn+握手（实测 ~75ms）会拖慢
        // 会话创建，而连接失败也没必要让会话起不来。启动失败经 catch 记进记录。
        return Promise.resolve(fiber as PromiseLike<unknown>).catch((error: unknown) => {
          record.mounted = false
          record.error = error instanceof Error ? error.message : String(error)
          record.reason = '启动失败：' + record.error
          deps.logger.warn(`[dsh-codegraph] per-agent MCP 启动失败：agent=${id} — ${record.error}`)
        })
      })
      .catch((error: unknown) => {
        // CG57：已被取代的挂载失败不该记进记录、也不该刷日志（它不是「这个 agent 的
        // 挂载失败」，只是一次作废的尝试）
        if (generations.get(id) !== generation) return
        record.mounted = false
        record.error = error instanceof Error ? error.message : String(error)
        record.reason = '挂载失败：' + record.error
        deps.logger.warn(`[dsh-codegraph] per-agent MCP 挂载失败：agent=${id} — ${record.error}`)
      })
      .finally(() => {
```

</details>

**依据 4 · 源码核查**：[packages/codegraph/src/scope.ts:414-448](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/codegraph/src/scope.ts#L414-L448)

撤销世代、pending及fiber.dispose调用。

<details>
<summary>查看原文（35行）</summary>

```text
    const fiber = fibers.get(id)
    fibers.delete(id)
    mounted.delete(id)
    // CG57：让在途的挂载作废（并清掉 in-flight 标记）——否则它会在这个 agent 已经被
    // 撤销之后把 MCP 进程挂上去
    pending.delete(id)
    bumpGeneration(id)
    if (fiber === undefined) return
    try {
      // 正常路径下 agent 销毁时 scope 会连子 fiber 一起释放（dsh-agent-loop:1659），
      // 所以这里是**幂等的显式兑现**：切回 managed / 插件卸载时需要立刻回收，
      // 不依赖 agent 自己的销毁时机。
      fiber.dispose?.()
    } catch (error) {
      deps.logger.warn(`[dsh-codegraph] per-agent MCP 释放失败：agent=${id} — ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const detach = (agent: AgentLike): void => {
    const id = agentIdOf(agent)
    if (id === undefined) return
    detachById(id)
  }

  return {
    attach,
    detach,
    detachAll() {
      // CG57：在途的挂载还没有 fiber，但同样要作废（detachById 会 bump 世代号），
      // 所以两边的 id 都要收——否则「切回 managed」之后，一个迟到的续体还会把
      // per-agent 进程挂出来
      for (const id of new Set([...fibers.keys(), ...pending])) detachById(id)
      // detachById 只在有 fiber 时才删记录；这里补上「没挂成的记录」也一并清掉。
      mounted.clear()
    },
```

</details>

**依据 5 · 源码核查**：[packages/codegraph/src/env-gate.ts:83-120](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/codegraph/src/env-gate.ts#L83-L120)

env就绪门禁分支。

<details>
<summary>查看原文（38行）</summary>

```text
    return false
  }
}

/**
 * 在 env 的同步预注入就绪后执行 `run`（**恰好一次**）。
 *
 * 见文件头：已就绪 / 没装 env / 没 loader 都立即执行；装了但未就绪才等 inject。
 */
export function whenEnvReady(ctx: EnvGateContext, run: () => void): void {
  let fired = false
  const fire = (): void => {
    if (fired) return
    fired = true
    run()
  }

  try {
    if (ctx.get?.(ENV_READY_SERVICE) !== undefined) {
      fire()
      return
    }
  } catch {
    // 读服务失败按未就绪处理，继续走下面的「装没装」判断
  }

  if (!envPluginMounted(ctx) || typeof ctx.inject !== 'function') {
    fire()
    return
  }

  try {
    ctx.inject([ENV_READY_SERVICE], fire)
  } catch {
    // inject 失败（宿主形状不符 / fiber 已释放）：退化为立即执行，不把功能挂死
    fire()
  }
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些条件会退回全局模式，配置写入是否严格并发安全？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

默认按Agent隔离不是无条件保证。模式裁决在MCP总开关关闭时不挂载，缺少Agent事件面或存在区块外手工codegraph行时退回managed，并保留原因。全局managed模式只对应一份工作目录，故“无索引会话不拿别项目工具”的承诺只适用于真正生效的per-agent模式。用户应读实际模式而不是只看自己选择的开关。

托管配置写入采用读文件、计算变化、复核mtime和size、同目录原子替换。它能降低普通交叠覆盖，并保留文件权限，但不能描述为严格CAS事务：shouldRecheckPatchWrite在attempt达到3后即便stamp仍变化也返回false，调用方继续写。最后一次复核与rename之间也没有跨进程锁，因此两个配置写者仍可能互相覆盖。对已经有手工MCP配置或会频繁修改profile的人，这一风险应进入操作成本，而不应被“原子写入”掩盖。此处是固定代码的并发边界判断，未复现数据丢失。

#### 证据与依据

**依据 1 · 源码核查**：[packages/codegraph/src/scope.ts:113-146](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/codegraph/src/scope.ts#L113-L146)

按实际前提裁决回退managed并给原因。

<details>
<summary>查看原文（34行）</summary>

```text
 */
export function resolveScopeMode(input: ScopeModeInput): ScopeModeDecision {
  const wanted = normalizeMcpScope(input.stored ?? input.config, DEFAULT_MCP_SCOPE)
  if (!input.manageEnabled) {
    return { mode: 'managed', reason: 'MCP 集成总开关已关闭，两种模式都不挂载' }
  }
  if (wanted === 'managed') {
    // 默认值翻成 per-agent 之后，这条分支只会因为**显式写了 managed** 而进入（normalize
    // 的 fallback 不再产出 managed，见 DEFAULT_MCP_SCOPE）；下面那个「没显式写过」的
    // 分支因此事实上走不到，保留它只是为了让 fallback 语义若再变时不撒谎。
    return {
      mode: 'managed',
      reason: input.stored ?? input.config
        ? 'managed（托管行 + 按会话热切换）'
        : 'managed（回退：托管行 + 按会话热切换）',
    }
  }
  if (!input.agentEvents) {
    // CG69：这条分支的输入必须是**已确认**的事实，而不是 apply 期的一次抽样。
    // 宿主 loader 并发创建 entry，`ctx.get('agents')` 有真实的 LOADING 窗口；把它当成
    // 「宿主没有 agent 事件面」会让 per-agent 永久退回 managed（而 managed 的托管行在
    // 没有已索引默认项目时是空的，两条路一起断）。让这个值可复用是调用方的责任：
    // 服务迟到时要重跑裁决，见 index.ts 的 `ctx.inject(['agents'])`。
    return {
      mode: 'managed',
      reason: '要 per-agent 但宿主没有 agent 事件面（拿不到 agent/created），已退回 managed',
    }
  }
  if (input.externalRow) {
    return {
      mode: 'managed',
      reason: '要 per-agent 但检测到区块外手工配置的 codegraph MCP 行；插件无权顶掉用户的显式配置，已退回 managed',
    }
  }
```

</details>

**依据 2 · 源码核查**：[packages/codegraph/src/index.ts:1827-1852](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/codegraph/src/index.ts#L1827-L1852)

冲突重读有次数上限，到达上限继续writeFileAtomic。

<details>
<summary>查看原文（26行）</summary>

```text
export function shouldRecheckPatchWrite(beforeStamp: string, afterStamp: string, attempt: number): boolean {
  return beforeStamp !== afterStamp && attempt < PATCH_RECHECK_LIMIT
}

/** 读 home 补丁 → 纯函数同步 → 有变化才原子写回（同目录 tmp + rename，走 kit）。 */
function syncMcpRowOnDisk(decision: McpSyncDecision, patchFile: string): { changed: boolean; status: McpSyncStatus } {
  try {
    for (let attempt = 0; ; attempt++) {
      const existed = existsSync(patchFile)
      const before = existed ? statSync(patchFile) : undefined
      const mode = before ? (before.mode & 0o777) : 0o600
      const text = before ? readFileSync(patchFile, 'utf8') : ''
      const outcome = syncManagedMcpRow(text.split('\n'), decision)
      if (!outcome.changed) return { changed: false, status: outcome.status }
      // CG04 + CG47：写前复核（盖章 mtime+size → 读 → 算 → 复核）。dsh-mcp 对这个文件做了
      // 同样的保护——它写前复核的是我们，我们却是裸 read→splice→rename，双方交叠时
      // 我们会整块覆盖它刚写的行（表现是 MCP 服务器莫名消失）。被写过就重读重做，
      // 判定见 shouldRecheckPatchWrite（含「不存在 → 被创建」那一向）。
      const after = existsSync(patchFile) ? statSync(patchFile) : undefined
      if (shouldRecheckPatchWrite(patchStamp(before), patchStamp(after), attempt)) continue
      // 沿用原文件权限（新文件 0600）。writeFileAtomic 内部的 writeFileSync 只会在
      // 创建临时文件时用这个 mode，umask 只会进一步收紧、不会放宽，所以写回后的
      // 权限不会比写之前更松。
      writeFileAtomic(patchFile, outcome.lines.join('\n'), mode)
      return { changed: true, status: outcome.status }
    }
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · GUI操作如何执行CLI，用户如何处理依赖与失败？

**研究主题**：功能与机制、依赖、兼容与流程、效果与总成本

#### 完整回答

浏览器卡片请求本地API，Host路由检查loopback与HTTP方法后以参数数组调用Codegraph；索引路由构建AbortController，断连和取消可以终止进程。运行器对子进程组先SIGTERM，再延时升级SIGKILL，输出按字节限额；这些都是失败处理机制，不证明上游索引中断后一定不留下锁或部分数据库。运行器还覆盖子进程Git的fsmonitor和hooksPath配置，但这不是完整沙箱，仍继承宿主环境，也不能把检查不可信仓库视为无风险只读行为。

安装不仅需要本包，还需要可执行Codegraph、有效索引、宿主Web和Agent服务，以及解析到宿主那一份MCP客户端；README中的内存和跨平台实测没有在本轮重做。首次应核对命令路径与索引根，再用只读查询验证；init、index、sync与uninit会管理索引状态，managed还会写托管配置。持续成本包括每个已索引Agent的MCP进程、CLI查询与索引时间、维护索引和宿主兼容。取消后应重新读状态并检查锁，而不是从取消提示推断已回滚。

#### 证据与依据

**依据 1 · 源码核查**：[packages/codegraph/src/index.ts:2628-2639](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/codegraph/src/index.ts#L2628-L2639)

路由围栏检查loopback和HTTP方法。

<details>
<summary>查看原文（12行）</summary>

```text
): Array<{ kind: 'exact'; path: string; handler: RouteHandler }> {
  const guard = (req: ReqLike, res: ResLike, method: string): boolean => {
    if (!isLoopbackRequest(req)) {
      writeJson(res, 403, { error: 'forbidden: loopback-only' })
      return false
    }
    if (req.method !== method) {
      writeJson(res, 405, { error: 'method not allowed: ' + String(req.method) })
      return false
    }
    return true
  }
```

</details>

**依据 2 · 源码核查**：[packages/codegraph/src/index.ts:2733-2747](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/codegraph/src/index.ts#L2733-L2747)

路由调用CLI并解析输出。

<details>
<summary>查看原文（15行）</summary>

```text
  const run = async (
    args: string[],
    cwd: string,
    timeoutMs: number = cli.cliTimeoutMs,
    cancel?: AbortSignal,
  ): Promise<{ ok: true; output: string; data?: unknown }> => {
    const output = await runCodegraph(cli.command, args, cwd, timeoutMs, cancel)
    return { ok: true, output, data: tryParseJson(output) }
  }

  const runJson = async (args: string[], cwd: string): Promise<{ ok: true; output: string; data: unknown }> => {
    const output = await runCodegraph(cli.command, args, cwd, cli.cliTimeoutMs)
    const data = tryParseJson(output)
    if (data === undefined) {
      return { ok: true, output, data: { raw: output } }
```

</details>

**依据 3 · 源码核查**：[packages/codegraph/src/index.ts:2999-3020](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/codegraph/src/index.ts#L2999-L3020)

index路由传入取消信号并在结束注销。

<details>
<summary>查看原文（22行）</summary>

```text
      kind: 'exact',
      path: '/api/dsh-codegraph/index',
      handler: async (req, res) => {
        if (!guard(req, res, 'POST')) return
        const body = await readPostBody(req, res)
        if (body === undefined) return
        const cwd = (typeof body.path === 'string' && body.path.trim()) || currentDefaultPath()
        const controller = new AbortController()
        const untrack = trackRun(cwd, controller)
        abortOnDisconnect(res, controller)
        try {
          const { output } = await run(indexArgs(cwd, cli.indexForce), cwd, cli.indexTimeoutMs, controller.signal)
          writeJson(res, 200, { ok: true, path: cwd, output })
        } catch (error) {
          failIndex(res, cwd, error)
        } finally {
          untrack()
        }
      },
    },
    {
      kind: 'exact',
```

</details>

**依据 4 · 源码核查**：[packages/codegraph/src/index.ts:2140-2174](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/codegraph/src/index.ts#L2140-L2174)

CLI进程继承环境并覆盖两项Git命令配置。

<details>
<summary>查看原文（35行）</summary>

```text
function runViaSpawn(command: string, args: string[], cwd: string, timeoutMs: number, cancel?: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    /*
     * 中和被测仓库 `.git/config` 里的「命令执行」配置（2026-10-19 外部测评 issue #13 第 5 条）。
     *
     * 直接执行者是上游 CLI 里的 `git ls-files` / `git diff`；而 `.git/config` 是**仓库内容**
     * 的一部分（压缩包、共享目录、别人给的目录都能带），它有两处能在 `git status` 这类
     * 「看起来只读」的操作里执行命令：
     *
     *   - `core.fsmonitor`：git 会把它当**程序**调用；
     *   - `core.hooksPath`：指向别处的 hooks 目录，`post-index-change` 之类照跑。
     *
     * 本插件连「查看状态」这种只读按钮都会起 CLI，所以用户点一下就可能触发。用
     * `GIT_CONFIG_COUNT` 把这两项在**子进程环境**里覆盖成空值（git ≥ 2.31 支持该机制；
     * 更老的 git 忽略这些变量，行为与改动前一致，不会更糟）。
     *
     * 为什么只覆盖这两项、不覆盖 `filter.<driver>.clean`：那个键的名字由 `.gitattributes`
     * 决定，事先不知道要覆盖哪个；要收它得让上游 CLI 配合（或用不触发过滤器的读法）。
     * 这一层的射程到此为止，边界写进 README 的安全段。
     */
    const gitNeutralizers = {
      GIT_CONFIG_COUNT: '2',
      GIT_CONFIG_KEY_0: 'core.fsmonitor',
      GIT_CONFIG_VALUE_0: '',
      GIT_CONFIG_KEY_1: 'core.hooksPath',
      GIT_CONFIG_VALUE_1: '/dev/null',
    }
    const child = spawnPortable(command, args, {
      cwd,
      windowsHide: true,
      detached: true,
      // 用户环境照旧继承（CLI 需要 PATH / HOME / 代理等），只在上面的两项 git 配置上覆盖
      env: { ...process.env, ...gitNeutralizers },
    })
    let stdout = ''
```

</details>

**依据 5 · 源码核查**：[packages/codegraph/src/index.ts:2198-2239](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/codegraph/src/index.ts#L2198-L2239)

进程组取消与升级终止。

<details>
<summary>查看原文（42行）</summary>

```text
    /** SIGTERM 后留一个清理窗口，仍不走就整组 SIGKILL（不加宽限的 SIGKILL 会留下 codegraph.lock）。 */
    const terminate = (): void => {
      // 本运行器经 spawnPortable({ detached: true }) 启动、子进程是组长——group: true
      // 才能连子孙一起收；非 detached 的消费者（如 dsh-mcp 的连接测试）保持默认单杀（CG36）
      void killProcessTree(child.pid, 'SIGTERM', { group: true }).finally(() => {
        const escalation = setTimeout(() => {
          void killProcessTree(child.pid, 'SIGKILL', { group: true })
        }, KILL_GRACE_MS)
        // 补刀计时器不为结束中的调用拖住宿主退出
        escalation.unref?.()
      })
    }
    const finish = (outcome: CliRunOutcome) => {
      if (settled) return
      settled = true
      if (timer !== undefined) clearTimeout(timer)
      cancel?.removeEventListener('abort', onAbort)
      if (outcome.ok) resolve(outcome.stdout)
      else reject(outcome.error)
    }
    const settle = (code: number | null) => {
      drainDecoders()
      return settleCliRun({ command, args, timeoutMs, timedOut, code, stdout, stderr })
    }
    const onAbort = (): void => {
      if (settled) return
      terminate()
      const error = new Error('codegraph 命令已取消') as Error & { cancelled?: boolean }
      error.cancelled = true
      finish({ ok: false, error })
    }
    cancel?.addEventListener('abort', onAbort, { once: true })
    // timeoutMs 为 0 表示不限时（CG23）：不设计时器
    const timer = timeoutMs > 0
      ? setTimeout(() => {
          // 先置标志、再连进程树一起收：被杀的子进程会先触发 close，标志不到位就会被
          // close 分支抢先结案，超时形状丢失
          timedOut = true
          terminate()
          finish(settle(null))
        }, timeoutMs)
      : undefined
```

</details>

**依据 6 · 源码核查**：[packages/codegraph/package.json:7-37](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/codegraph/package.json#L7-L37)

Node、宿主、客户端及依赖声明。

<details>
<summary>查看原文（31行）</summary>

```text
    "node": ">=22.19.0"
  },
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": "./client.js",
    "./package.json": "./package.json"
  },
  "dsh": {
    "manifestVersion": 1,
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "engines": {
      "dsh": ">=0.1.7-rc.2"
    },
    "client": {
      "platform": "web",
      "inject": []
    }
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.18.4",
    "@hyzyn/dsh-kit": "0.8.0",
    "js-yaml": "^4.1.0"
  },
  "peerDependencies": {
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 对谁值得试，何时停用，哪些效果仍未知？

**研究主题**：采用判断、效果与总成本

#### 完整回答

当前可作为有条件试用候选，限定为已经能用Codegraph CLI、持有可重建索引且可备份profile配置的开发者。先用两个内容可区分的测试仓库做只读符号查询，核对各Agent的实际模式和索引根；再打开一个无索引会话检查工具暴露。这样试的价值是验证“项目归属是否明确”，不是证明图谱比文本搜索更准。

如果实际模式退回managed，而任务需要多项目严格分离，就停止该并行用法，回到显式传路径的CLI或单项目配置。若设置文件出现非目标行变化、取消后子进程不退出或查询混入另一项目结果，停止自动托管，保留诊断并恢复预先备份的配置。首次配置、持续索引和失败排障耗时及资源量没有本轮测量，不输出节时或金额收益。源码给出了模式诊断、进程回收和原命令退路，允许小范围只读试用；它不足以支持持续安装推荐或把统计里的工具调用占比当任务效果。

#### 证据与依据

**依据 1 · 源码核查**：[packages/codegraph/src/scope.ts:172-192](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/codegraph/src/scope.ts#L172-L192)

有索引才挂载，为无索引会话的验收提供可观察判据。

<details>
<summary>查看原文（21行）</summary>

```text
  reason: string
}

/**
 * 纯函数：一个 agent 该不该挂 MCP，以及挂在哪个目录。
 *
 * **没有有效索引就不挂**（不是回落到默认项目）：一个在别处（比如家目录）开的会话，
 * 拿到「某个别的项目」的探索工具只会给出误导性答案；没有工具时模型会按指引退回
 * grep/read，那才是正确的降级。
 *
 * cwd 取 **locateIndex 找到的根**（与 `effectiveProjectPath` 同口径，CG02）：会话目录在
 * monorepo 子目录时索引在仓库根。
 */
export function agentMountDecision(input: AgentMountInput): AgentMountDecision {
  if (input.cliAvailable === false) {
    return { mount: false, reason: 'codegraph CLI 不可用（探测失败），未挂载' }
  }
  const cwd = typeof input.sessionCwd === 'string' ? input.sessionCwd.trim() : ''
  if (cwd === '') {
    return { mount: false, reason: '会话没有工作目录，未挂载' }
  }
```

</details>

**依据 2 · 源码核查**：[packages/codegraph/src/scope.ts:414-448](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/codegraph/src/scope.ts#L414-L448)

撤销流程提供显式退出路径。

<details>
<summary>查看原文（35行）</summary>

```text
    const fiber = fibers.get(id)
    fibers.delete(id)
    mounted.delete(id)
    // CG57：让在途的挂载作废（并清掉 in-flight 标记）——否则它会在这个 agent 已经被
    // 撤销之后把 MCP 进程挂上去
    pending.delete(id)
    bumpGeneration(id)
    if (fiber === undefined) return
    try {
      // 正常路径下 agent 销毁时 scope 会连子 fiber 一起释放（dsh-agent-loop:1659），
      // 所以这里是**幂等的显式兑现**：切回 managed / 插件卸载时需要立刻回收，
      // 不依赖 agent 自己的销毁时机。
      fiber.dispose?.()
    } catch (error) {
      deps.logger.warn(`[dsh-codegraph] per-agent MCP 释放失败：agent=${id} — ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const detach = (agent: AgentLike): void => {
    const id = agentIdOf(agent)
    if (id === undefined) return
    detachById(id)
  }

  return {
    attach,
    detach,
    detachAll() {
      // CG57：在途的挂载还没有 fiber，但同样要作废（detachById 会 bump 世代号），
      // 所以两边的 id 都要收——否则「切回 managed」之后，一个迟到的续体还会把
      // per-agent 进程挂出来
      for (const id of new Set([...fibers.keys(), ...pending])) detachById(id)
      // detachById 只在有 fiber 时才删记录；这里补上「没挂成的记录」也一并清掉。
      mounted.clear()
    },
```

</details>

**依据 3 · 源码核查**：[packages/codegraph/src/index.ts:1827-1852](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/codegraph/src/index.ts#L1827-L1852)

托管写冲突边界要求备份和停止条件。

<details>
<summary>查看原文（26行）</summary>

```text
export function shouldRecheckPatchWrite(beforeStamp: string, afterStamp: string, attempt: number): boolean {
  return beforeStamp !== afterStamp && attempt < PATCH_RECHECK_LIMIT
}

/** 读 home 补丁 → 纯函数同步 → 有变化才原子写回（同目录 tmp + rename，走 kit）。 */
function syncMcpRowOnDisk(decision: McpSyncDecision, patchFile: string): { changed: boolean; status: McpSyncStatus } {
  try {
    for (let attempt = 0; ; attempt++) {
      const existed = existsSync(patchFile)
      const before = existed ? statSync(patchFile) : undefined
      const mode = before ? (before.mode & 0o777) : 0o600
      const text = before ? readFileSync(patchFile, 'utf8') : ''
      const outcome = syncManagedMcpRow(text.split('\n'), decision)
      if (!outcome.changed) return { changed: false, status: outcome.status }
      // CG04 + CG47：写前复核（盖章 mtime+size → 读 → 算 → 复核）。dsh-mcp 对这个文件做了
      // 同样的保护——它写前复核的是我们，我们却是裸 read→splice→rename，双方交叠时
      // 我们会整块覆盖它刚写的行（表现是 MCP 服务器莫名消失）。被写过就重读重做，
      // 判定见 shouldRecheckPatchWrite（含「不存在 → 被创建」那一向）。
      const after = existsSync(patchFile) ? statSync(patchFile) : undefined
      if (shouldRecheckPatchWrite(patchStamp(before), patchStamp(after), attempt)) continue
      // 沿用原文件权限（新文件 0600）。writeFileAtomic 内部的 writeFileSync 只会在
      // 创建临时文件时用这个 mode，umask 只会进一步收紧、不会放宽，所以写回后的
      // 权限不会比写之前更松。
      writeFileAtomic(patchFile, outcome.lines.join('\n'), mode)
      return { changed: true, status: outcome.status }
    }
```

</details>

**依据 4 · 源码核查**：[packages/codegraph/src/index.ts:2198-2239](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/codegraph/src/index.ts#L2198-L2239)

取消终止机制可作进程退出验收对象。

<details>
<summary>查看原文（42行）</summary>

```text
    /** SIGTERM 后留一个清理窗口，仍不走就整组 SIGKILL（不加宽限的 SIGKILL 会留下 codegraph.lock）。 */
    const terminate = (): void => {
      // 本运行器经 spawnPortable({ detached: true }) 启动、子进程是组长——group: true
      // 才能连子孙一起收；非 detached 的消费者（如 dsh-mcp 的连接测试）保持默认单杀（CG36）
      void killProcessTree(child.pid, 'SIGTERM', { group: true }).finally(() => {
        const escalation = setTimeout(() => {
          void killProcessTree(child.pid, 'SIGKILL', { group: true })
        }, KILL_GRACE_MS)
        // 补刀计时器不为结束中的调用拖住宿主退出
        escalation.unref?.()
      })
    }
    const finish = (outcome: CliRunOutcome) => {
      if (settled) return
      settled = true
      if (timer !== undefined) clearTimeout(timer)
      cancel?.removeEventListener('abort', onAbort)
      if (outcome.ok) resolve(outcome.stdout)
      else reject(outcome.error)
    }
    const settle = (code: number | null) => {
      drainDecoders()
      return settleCliRun({ command, args, timeoutMs, timedOut, code, stdout, stderr })
    }
    const onAbort = (): void => {
      if (settled) return
      terminate()
      const error = new Error('codegraph 命令已取消') as Error & { cancelled?: boolean }
      error.cancelled = true
      finish({ ok: false, error })
    }
    cancel?.addEventListener('abort', onAbort, { once: true })
    // timeoutMs 为 0 表示不限时（CG23）：不设计时器
    const timer = timeoutMs > 0
      ? setTimeout(() => {
          // 先置标志、再连进程树一起收：被杀的子进程会先触发 close，标志不到位就会被
          // close 分支抢先结案，超时形状丢失
          timedOut = true
          terminate()
          finish(settle(null))
        }, timeoutMs)
      : undefined
```

</details>

#### 缺口

- 未测多项目同名符号结果、取消后的进程和用户净收益。
  **影响**：只能推荐验证项目绑定的有限试用，不能保证隔离效果或长期资源负担。
  **进一步探讨**：同条件比较CLI与卡片，记录串项目次数、查询正确率、存活进程和总耗时。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 可从当前取舍推导什么更可靠的项目绑定方法？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把“每个Agent单独进程”扩展为按索引根复用连接池，同时保持工具视图与项目身份显式绑定。它来自当前每Agent单进程的资源取舍及managed全局cwd的语义漂移：共享一份连接能够减少重复进程，但如果只按工具名复用，又会重新引入跨项目串台。

候选设计需要以索引根与CLI版本作连接键、引用计数处理Agent释放、每次查询核对绑定根，并在索引失效时使对应连接失效。它并非本插件现有能力，也未核实宿主MCP层是否允许安全共享。最小对照是在两个项目各开多个Agent，以现有per-agent为基线，比较进程数、峰值资源、同名符号串项目率和释放后的残留进程。若资源减少伴随任何跨项目结果、取消影响其他Agent或排障负担超过节省，该方向就应否定。

#### 证据与依据

**依据 1 · 源码核查**：[packages/codegraph/src/scope.ts:354-389](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/codegraph/src/scope.ts#L354-L389)

当前每个Agent调用plugin创建独立客户端，cwd固定索引根。

<details>
<summary>查看原文（36行）</summary>

```text
    pending.add(id)

    void deps.loadClient()
      .then((client) => {
        // CG57：世代不符 = 期间又 attach（换 cwd）或 detach 过 → 这次挂载作废
        if (generations.get(id) !== generation) return undefined
        if (client === undefined) {
          record.reason = '宿主没有 @deepseek-ai/dsh-mcp-client（可选依赖未安装），未挂载'
          deps.logger.warn(`[dsh-codegraph] ${record.reason}`)
          return undefined
        }
        // 整包 namespace 对象直接可用：cordis 的 Context.resolve 认「有 apply 的对象」
        // （`cordis/lib/index.js:1532-1537` isApplicable），所以不必挑 .apply 传。
        const config = {
          serverName: deps.serverName,
          transport: 'stdio',
          command: deps.command,
          args: ['serve', '--mcp'],
          cwd: decision.root,
          // 起不来时报错交给下面的 catch（而不是静默变成「这个 agent 没工具」）
          failOnStartupError: true,
        }
        const fiber = mountPlugin(client, config) as PluginFiberLike
        fibers.set(id, fiber)
        record.mounted = true
        record.reason = '已挂载'
        record.at = Date.now()
        deps.logger.log(`[dsh-codegraph] per-agent MCP 已挂载：agent=${id} cwd=${decision.root}`)
        // 不 await：agent/created 是 serial 派发，等一次 spawn+握手（实测 ~75ms）会拖慢
        // 会话创建，而连接失败也没必要让会话起不来。启动失败经 catch 记进记录。
        return Promise.resolve(fiber as PromiseLike<unknown>).catch((error: unknown) => {
          record.mounted = false
          record.error = error instanceof Error ? error.message : String(error)
          record.reason = '启动失败：' + record.error
          deps.logger.warn(`[dsh-codegraph] per-agent MCP 启动失败：agent=${id} — ${record.error}`)
        })
```

</details>

**依据 2 · 源码核查**：[packages/codegraph/src/scope.ts:414-448](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/codegraph/src/scope.ts#L414-L448)

当前按Agent回收，连接池需重新设计所有权。

<details>
<summary>查看原文（35行）</summary>

```text
    const fiber = fibers.get(id)
    fibers.delete(id)
    mounted.delete(id)
    // CG57：让在途的挂载作废（并清掉 in-flight 标记）——否则它会在这个 agent 已经被
    // 撤销之后把 MCP 进程挂上去
    pending.delete(id)
    bumpGeneration(id)
    if (fiber === undefined) return
    try {
      // 正常路径下 agent 销毁时 scope 会连子 fiber 一起释放（dsh-agent-loop:1659），
      // 所以这里是**幂等的显式兑现**：切回 managed / 插件卸载时需要立刻回收，
      // 不依赖 agent 自己的销毁时机。
      fiber.dispose?.()
    } catch (error) {
      deps.logger.warn(`[dsh-codegraph] per-agent MCP 释放失败：agent=${id} — ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const detach = (agent: AgentLike): void => {
    const id = agentIdOf(agent)
    if (id === undefined) return
    detachById(id)
  }

  return {
    attach,
    detach,
    detachAll() {
      // CG57：在途的挂载还没有 fiber，但同样要作废（detachById 会 bump 世代号），
      // 所以两边的 id 都要收——否则「切回 managed」之后，一个迟到的续体还会把
      // per-agent 进程挂出来
      for (const id of new Set([...fibers.keys(), ...pending])) detachById(id)
      // detachById 只在有 fiber 时才删记录；这里补上「没挂成的记录」也一并清掉。
      mounted.clear()
    },
```

</details>

#### 缺口

- 尚未核实宿主MCP连接是否能在保留作用域隔离下复用。
  **影响**：不能把进程减少设想当成可实现改进或性能收益。
  **进一步探讨**：先核对宿主工具注册和连接生命周期，再用两个项目的受控Agent集合做对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
