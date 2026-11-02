# dsh-mneme

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[35a79c1](https://github.com/slow-stack/mneme/tree/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme)

<!-- BEGIN META -->
[![GitHub ★ 204](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=204&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/slow-stack/mneme) [![npm 30d 9,770](https://img.shields.io/static/v1?label=npm+30d&message=9%2C770&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@modusensus/dsh-mneme) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@modusensus/dsh-mneme)
<!-- END META -->

> **功能**：在DSH中以SQLite与Markdown维护跨会话记忆，提供检索、自动注入和摘要整理，隔离与内容门控有明确限制。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 子包将持久库、可读镜像、工具和宿主上下文接线，并保留同步债务与部分失败状态，便于跨会话复用知识；不将根合集和作者实验算本包实测收益。

> **主要限制**：[Q03](#research-q03) 自动scope不是硬隔离，门控默认关闭且可降级放行；可选actionRun在truthy命令disposer路径提前访问const disposers，源码推导存在启动错误。[Q02](#research-q02) DB与镜像非共同原子提交。

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
  - [Q01 · 谁需要跨会话记忆，相对日志和手工文档增加什么？](#detail-section-11)
  - [Q02 · 保存、镜像与注入实际怎样接线？](#detail-section-12)
  - [Q03 · 默认作用域、内容门控与可选执行有什么限制？](#detail-section-13)
  - [Q04 · 怎样限定首次、持续、恢复成本与试用退出？](#detail-section-14)
  - [Q05 · 怎样验证长期记忆改善任务而非仅改善召回？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：持续使用DSH并愿意管理持久知识的个人用户，减少重复解释项目与偏好；敏感或跨租户资料不适合直接混入默认全局库。

会话日志与手工项目文档；本包增加自动维护和按任务检索注入，也增加误记、过时及模型调用负担。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 持久记忆工具 | 跨会话保存与检索 | 独立库，删会话不删记忆 |
| 自动注入/摘要 | 减少重复解释 | 误记/过时/无关意见需核对 |
| 镜像与同步债务 | 可读编辑和故障追踪 | DB/文件非同一原子事务 |
| scope/内容门控 | 降低误用和污染 | 默认关闭项、软标签与降级不作授权边界 |
| 可选mo-run | 显式工作流执行记账 | truthy disposer路径有初始化顺序问题 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH工具/提示/模型/命令/Web服务 | 入口声明必需 | 接入工具、注入、摘要和界面 | 需核实际版本，不能凭optional判断保证启动 |
| 可写持久目录/SQLite | 必需 | 跨会话知识与同步债务 | 备份和检查权限 |
| 模型服务 | 自动语义工作必需 | 摘要/整理/可选门控 | 费用与数据流按所选服务确认 |
| 向量服务或本地runtime/模型 | 可选 | 语义检索/重排 | 可退关键词，磁盘/网络并非零成本 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份持久目录并核宿主/模型配置 | 非敏感单项目，actionRun关闭 |
| 种子 | 保存少量可核知识，检查库与镜像状态 | 回读正确，failed先修复 |
| 对照 | 同任务有/无记忆与手工文档 | 测正确性和纠错/token，不只召回 |
| 收缩 | 关自动注入/摘要/整理并检查数据 | 串用/过时或超预算退手工 |
| 退出 | 明确备份/清理持久目录 | 删会话/卸载不是清除记忆 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主与模型配置；可选runtime/模型磁盘 | 备份、种子、后端核验 | 作者数百MB非本次测量 |
| 持续 | 摘要/整理/嵌入和上下文token | 纠错、过时与scope复核 | 真实金额/CPU/总耗时未知 |
| 故障恢复 | 重建镜像/索引与可能重复模型工作 | 查债务状态、恢复DB/文件 | 非跨库文件原子提交 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 跨会话知识 | 独立DB/镜像与工具装配 | 是否准确记住用户意图 |
| 上下文复用 | 自动候选和注入链路 | 下游正确率与节时 |
| 恢复可见性 | generation与逐type状态 | 故障/并发下实测收敛 |
| 内容与项目边界 | 有显式scope及可选门控 | 无多租户隔离/零泄漏保证 |

> **思考**：[Q03](#research-q03) 自动scope不是硬隔离，门控默认关闭且可降级放行；可选actionRun在truthy命令disposer路径提前访问const disposers，源码推导存在启动错误。[Q02](#research-q02) DB与镜像非共同原子提交。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 子包将持久库、可读镜像、工具和宿主上下文接线，并保留同步债务与部分失败状态，便于跨会话复用知识；不将根合集和作者实验算本包实测收益。

[Q02](#research-q02)、[Q03](#research-q03) 事务提交后任务、持久同步债务与逐类型结果值得借鉴；默认可用性降级不适合安全阻断。opt-in命令初始化顺序须在真实宿主验证修复，不能把命令注册回执当可用。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 自动scope不是硬隔离，门控默认关闭且可降级放行；可选actionRun在truthy命令disposer路径提前访问const disposers，源码推导存在启动错误。[Q02](#research-q02) DB与镜像非共同原子提交。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 非敏感单项目备份后试核心记忆，保持actionRun关闭并明确自动工作开关；验证任务结果和持久状态，串用/误记/超预算则关闭自动工作退手工文档，退出单独处理持久库。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子包源码和发布lib静态检查；未启动宿主、模型或本地runtime，条件性启动错误是源码推导，下游收益未验证。

- 已检查：作者 README、包清单、源码路径 dsh-mneme/README.md、dsh-mneme/lib/index.js、dsh-mneme/package.json、dsh-mneme/src/config.js、dsh-mneme/src/index.js、dsh-mneme/src/inject.js、dsh-mneme/src/pipeline-command.js、dsh-mneme/src/service.js、dsh-mneme/src/store.js 及固定范围 inventory；组件：dsh-mneme。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只研究dsh-mneme插件、直接存储/服务/注入/门控与发布lib；未完整审运行时安装、所有API/客户端、自动整理判决和根研究资源。
- 下一步：[Q05](#research-q05) 隔离材料对照有/无记忆、显式/自动scope与冷/热缓存，测任务错误、串用、纠错和总成本；另需宿主验证opt-in初始化问题。

**分析版本**

- **仓库**：[slow-stack/mneme](https://github.com/slow-stack/mneme)
- **版本号**：0.9.5（[固定提交 35a79c1](https://github.com/slow-stack/mneme/tree/35a79c1108cc59b01c86410a85a40e09164d6efd)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 未验证假设是把召回与下游正确完成分开归因，以过时纠正和跨项目误用对照验证净价值；已有召回评估和门控不能重复算创新。

[Q05](#research-q05) 隔离材料对照有/无记忆、显式/自动scope与冷/热缓存，测任务错误、串用、纠错和总成本；另需宿主验证opt-in初始化问题。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 11 | 2893 | 2112 | 571 | — |
| .md | source | 15 | 5050 | — | — | 170483 |
| .js | source | 172 | 82232 | 53425 | 25512 | — |
| .js | test | 202 | 57615 | 45656 | 7434 | — |
| .mjs | test | 1 | 25 | 15 | 7 | — |

</details>

**活跃度**

[![Issue 未关闭 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=16&color=737b86&logo=github)](https://github.com/slow-stack/mneme/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 45](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=45&color=737b86&logo=github)](https://github.com/slow-stack/mneme/issues?q=is%3Aissue+created%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z) [![近30天关闭 43](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=43&color=737b86&logo=github)](https://github.com/slow-stack/mneme/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：跨会话记忆的持久化、注入和作用域边界如何支持真实任务？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要跨会话记忆，相对日志和手工文档增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

子包面向在DSH多会话持续工作的个人用户，将经验、偏好、事件等保存到独立SQLite及可读Markdown，而非依赖每次重贴历史。相对会话日志，增量是结构化保存、检索候选与自动上下文注入；相对手工项目文档，自动摘要与整理减少部分维护动作，但也引入误记、过时与注入无关意见的负担。删除会话不等于删除独立记忆。

本研究只归属dsh-mneme的宿主插件、工具与存储链路，不把根mneme资源合集、其他平台适配或论文实验直接算本包效果。合格结果应是后续任务使用正确且适时的知识，能纠正过时内容，并避免跨项目误用；仅搜到旧文字或有更多记忆不是业务收益。没有本地真实任务对照。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-mneme/README.md:26-50](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/README.md#L26-L50)

作者定义独立持久记忆与SQLite/镜像。

<details>
<summary>查看原文（25行）</summary>

````text
```bash
# 30 秒上手
dsh plugin --profile web add @modusensus/dsh-mneme
dsh web
```

**它不是什么**（边界声明）：

- 不是向量数据库——语义搜索是可选增强，默认零额外依赖
- 不替代会话日志——它存的是「值得跨会话记住的」精炼知识
- 不改变模型本身——进化的是记忆库与每次注入的上下文
- 删对话 ≠ 删记忆——记忆是跨会话的全局知识（v0.7.11 起不再与会话绑定），删除会话不影响已存入的记忆

## ✨ 功能

### 记忆存储（SQLite + Markdown 镜像）

- **SQLite 主存储**：`~/.dsh/memory/memory.db`，`node:sqlite` 内置，零原生依赖
- **Markdown 镜像**：按类型分文件（`preferences.md` / `projects.md` / `decisions.md` / `history.md` / `summary.md` / `patterns.md` / `pitfalls.md` / `constraints.md` / `rejected-solutions.md`，外加只读视图 `documents.md`），文件头是 YAML frontmatter（`type` / `generated.by` / `generated.at` / `covered` / `coverage` / `tags`）。人类可读，条目标题与正文可手工编辑（**人工修改优先**合并回库）；`documents.md` 例外：它只有 document 指针行（id、标题、摘要首句、文件路径），不含正文也不参与人工回填。文件头与条目元数据行由机器维护
- **10 种记忆类型**：`preference` 偏好 / `project` 项目 / `decision` 决策 / `history` 历史 / `summary` 会话总览 / `pattern` 模式 + 编码记忆三型 `rejected_solution` 被否方案 / `pitfall` 踩坑 / `constraint` 约束（v0.7.13 起，`codingRetrospect` 默认关；v0.7.11 近重写已收窄删除 user/fact 两型）+ `document` 文档指针（#230，只存摘要与 `doc_path`，正文留在磁盘由 agent 自管）
- **镜像同步状态机（v0.3.6+）**：mirror 与主库强一致，用 `generation`（期望轮次）/ `applied_generation`（已应用轮次）建模同步债务
  - 业务写操作在**自身事务内原子递增** desired generation——崩溃在 COMMIT 后、渲染前，重启也能凭 durable 债务恢复，绝不静默跳过（v0.3.8）
  - `generation` 用 SQLite 原子语句递增，多进程并发零丢失；带 `CHECK` 上界，负数/溢出拒绝
  - 逐 type 记录 `committed / failed / pending` 回执，健康端点区分 `ok / degraded / unknown`
  - 状态写失败不静默：同步失败落日志并留债务，重启自动收敛
````

</details>

**依据 2 · 源码核查**：[dsh-mneme/src/index.js:563-579](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/src/index.js#L563-L579)

注入、工具与摘要实际装配。

<details>
<summary>查看原文（17行）</summary>

```text
  ctx.inject(["systemPrompt"], (promptCtx) => {
    if (cfg.autoInject) disposers.push(createInjector(promptCtx, service, settings, cfg, preInjectGate, sessionGate));
  });

  // #249 N3：压缩边缘双落点。触发靠宿主自己落的压缩事件（订阅 + pre-step 追加），
  // 不需要 systemPrompt / tools 的任何能力，所以不塞进上面的 inject 回调；父／子
  // 闸门在挂载点判一次，与 inject.js 共用同一个 injectChildEnabled 判据。
  if (cfg.autoInject && injectChildEnabled(cfg, "continuityRescueEnabled")) {
    disposers.push(createContinuityRescue(ctx, store, sessionGate));
  }

  ctx.inject(["tools"], (toolsCtx) => {
    disposers.push(createTools(toolsCtx, service, cfg, embedder, sessionGate));
  });

  const summarizer = createSummarizer(ctx, service, cfg, {}, sessionGate);
  disposers.push(summarizer.dispose);
```

</details>

**依据 3 · 源码核查**：[dsh-mneme/package.json:1-25](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/package.json#L1-L25)

本包发布单元与客户端出口。

<details>
<summary>查看原文（25行）</summary>

```text
{
  "name": "@modusensus/dsh-mneme",
  "description": "Cross-session memory plugin for DeepSeek Harness with autoDream consolidation: SQLite store, Markdown mirrors, 10 model tools, automatic injection, session summarization, user profile/rules, custom slash commands, vector (semantic) search, and a Web GUI panel",
  "version": "0.9.5",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/slow-stack/mneme.git"
  },
  "homepage": "https://github.com/slow-stack/mneme#readme",
  "bugs": {
    "url": "https://github.com/slow-stack/mneme/issues"
  },
  "type": "module",
  "main": "lib/index.js",
  "icon": "assets/icon.svg",
  "bin": {
    "dsh-mneme": "bin/cli.mjs",
    "dsh-mneme-mcp": "bin/dsh-mneme-mcp.mjs",
    "dsh-mneme-serve": "bin/dsh-mneme-serve.mjs"
  },
  "exports": {
    ".": {
      "default": "./lib/index.js"
    },
```

</details>

#### 缺口

- 没有同任务正确率与人工纠错负担对照
  **影响**：不能承诺跨会话收益或节省时间
  **进一步探讨**：在不敏感的重复任务比较无记忆、手工文档和本包。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 保存、镜像与注入实际怎样接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

入口创建memory.db、服务及可选向量层；工具保存经过服务去重/准入后写store。事务使用BEGIN/COMMIT，失败回滚并截断待处理异步队列，提交后才排实体/嵌入任务。Markdown同步在事务结束后进行，故数据库提交不等于所有镜像文件同时提交。

服务按活跃全集渲染镜像，各类型分别记录committed/failed，全部成功才尝试按本轮generation清理债务；store保留desired/applied与dirty，使失败可见并能后续恢复。此处不是数据库与文件系统共同原子事务；状态写失败会warn，且本次未复现断电/并发故障，不能将注释中的强一致扩成任何故障都不失效。

systemPrompt同步回调取最新人类查询、当前scope与候选，向量和注入前判定走异步预取/缓存。冷缓存首帧可以降级原样注入，后续同key才消费判定；这种可用性策略不同于严格阻断。可借鉴的是持久同步债务、分类型物理结果与异步任务提交后排队，同时应监控实际镜像状态而非只看保存回执。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-mneme/src/index.js:190-205](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/src/index.js#L190-L205)

持久目录与DB创建。

<details>
<summary>查看原文（16行）</summary>

```text
  const profileScope = findProfileScopeSegment(memoryDir);
  if (profileScope) {
    ctx.logger?.warn?.(
      `[dsh-mneme] memoryDir is inside a profile scope ("${profileScope}"): ${memoryDir} — the library may be lost when the host cleans or migrates profiles. Prefer a location outside profiles/ (default: ~/.dsh/memory; config key: memoryDir).`
    );
  }

  const store = createStore(join(memoryDir, "memory.db"));

  // User-configurable settings (profile, rules, panel mode, standalone API
  // token) share the same SQLite file in dedicated tables, isolated from
  // memories. Created before the config is finalized: the persisted
  // panel_mode participates in light-mode resolution below.
  const settings = createSettings(store.db);

  // Light mode (v0.7.12): the bundle config flag OR a persisted panel_mode of
```

</details>

**依据 2 · 源码核查**：[dsh-mneme/src/service.js:1189-1236](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/src/service.js#L1189-L1236)

事务回滚和提交后任务/镜像。

<details>
<summary>查看原文（48行）</summary>

```text
   * body rolls the whole batch back — no partial writes, no diverged mirror.
   * Errors propagate to the caller. NOTE: the commit path re-renders the mirror
   * and notifies subscribers, but re-embedding is left to the caller (the dream
   * flow re-embeds through maintainIndexAfterDream).
   */
  function transaction(fn) {
    store.db.exec("BEGIN");
    txDepth++;
    // #372: 记住本层事务开始时的队列深度——回滚时截断回这里。本层（及更深的
    // 嵌套层）入队的抽取随回滚一并丢弃，外层已提交未 drain 的条目不受牵连。
    const baseline = pendingEntity.length;
    // distill-tx-embed-gap: 嵌入队列用同一套基线机制，与实体抽取保持一致。
    const embedBaseline = pendingEmbed.length;
    let committed = false;
    try {
      const result = fn();
      store.db.exec("COMMIT");
      committed = true;
      return result;
    } catch (error) {
      try { store.db.exec("ROLLBACK"); } catch { /* store may be closed */ }
      // 回滚：丢弃本层入队的抽取请求，绝不对已回滚的行抽实体（CodeRabbit
      // 复审抓出：仅靠 committed 门挡 drain 时，回滚条目会滞留队列、被下一个
      // 成功事务误抽）。外层未提交的条目在 baseline 之前，原样保留。
      pendingEntity.length = baseline;
      // distill-tx-embed-gap: 同理，绝不给已回滚的行嵌向量。
      pendingEmbed.length = embedBaseline;
      throw error;
    } finally {
      txDepth--;
      // Sync failures are surfaced, not swallowed (peer blocker 2): the mirror
      // debt was already recorded by markMirrorDirty inside syncMirror, so a
      // restart recovers — but the operator must see it now, not after restart.
      const syncResult = syncMirror();
      if (!syncResult?.success && !syncResult?.deferred) {
        logger?.warn?.("mirror sync failed after transaction:", syncResult?.error);
      }
      notifyWrite();
      // #372: 补跑事务内排队的实体抽取——只在 COMMIT 成功后（此时 txDepth 已归零，
      // scheduleEntityExtraction 走正常触发路径）。嵌套事务的内层提交不 drain
      // （txDepth 仍 >0 时 schedule 会重新入队，与 drain 形成自旋）——条目等最外层
      // COMMIT 后统一补跑。
      if (committed && txDepth === 0) drainPendingEntityExtraction();
      // distill-tx-embed-gap: 补跑事务内排队的嵌入——同一套嵌套规则：内层提交
      // 不 drain（txDepth 仍 >0 时 scheduleEmbed 会重新入队），等最外层 COMMIT
      // 后统一补跑。放在 drainPendingEntityExtraction 之后无依赖，仅保持顺序。
      if (committed && txDepth === 0) drainPendingEmbeds();
    }
```

</details>

**依据 3 · 源码核查**：[dsh-mneme/src/service.js:2231-2334](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/src/service.js#L2231-L2334)

活跃全集、逐类型状态和代际清理。

<details>
<summary>查看原文（104行）</summary>

```text
  // syncMirror: 同步 mirror，并在失败/成功时持久记录 dirty 状态；保证自身不抛出。
  // v0.3.6（audit peer 4 阻断）：
  //   - 开始时 incrementGeneration 绑定本次期望轮次 gen；成功用
  //     markMirrorCleanForGeneration(gen, now) CAS/fence 清 dirty——旧 worker
  //     （gen 已过期）不会误清另一 worker 未恢复的故障债务；
  //   - 失败写 markMirrorDirty（递增 desired 绑定新债务），下次 recover 恢复；
  //   - 逐 type 用 setTypeStatus 记录部分成功/失败（type_status JSON）；
  //   - 所有 store 状态写入各自 try/catch，失败只 warn，绝不向外抛（F-NEW-03）。
  function syncMirror() {
    if (txDepth > 0) return { success: true, deferred: true }; // deferred to the transaction's commit
    // #296 第二批：documentDir/index.md 走同一条写后语——它与镜像一样是「从库渲染
    // 的机器产物」，同样只在内容变化时落盘、同样自己吞掉失败。放在 !mirror 短路
    // 之前：索引在不在，不该取决于镜像是否装配（无镜像的宿主与测试同样要有它）。
    syncDocumentIndex();
    if (!mirror) return { success: true, deferred: true };
    const now = new Date().toISOString();
    let gen;
    try {
      // desired generation 已在业务写事务中原子递增（peer blocker 1）；这里
      // 直接读当前值作为本次同步的目标轮次，不再自行 incrementGeneration。
      const state = store.getMirrorState();
      gen = state?.generation ?? 0;
    } catch (stateError) {
      logger?.warn?.("syncMirror: getMirrorState failed:", stateError);
      return { success: false, error: stateError?.message ?? String(stateError) };
    }
    // coveredTypes 提到 try 外初始化：即使 store.list 先抛错，catch 分支也有
    // 合法的空 Set 可迭代，保证 syncMirror 自身绝不抛（fail-safe）。
    const coveredTypes = new Set();
    try {
      // 预先取本次要覆盖的全部活跃行（只读一次）。这里曾经是
      // store.list({ limit: 500 })——活跃集超过 500 时镜像会静默少掉尾部记忆，
      // 而文件本身没有任何提示（#278 第一批）。在这里退回任何截断都不行——
      // 「宣称覆盖活跃集」与静默截断不能共存（这一条不变）。
      // #430：改成 list 的无界档（limit: null）+ SQL 侧过滤，替掉 all() + 逐行
      // filter——list 的默认 includeForgotten:false / includeArchived:false 与旧
      // filter 的 !forgotten && !archived 完全同口径（store.js 里就是这两条
      // clause），document 闸改由 excludeTypes 在 LIMIT 之前排除。旧写法先物化
      // 整库（embedding 列 + 逐行 27 字段 toRow）再逐行丢弃：被丢掉的行连带它们
      // 的物化一起省下了。要再压一层得换按 type 分页取，属另一批的事。
      const list = store.list({
        limit: null,
        order: "chrono",
        // #296 第二批：镜像里的 documents.md 与 index.md 共用 documentMemoryEnabled
        // 闸。关掉时把 document 行也从渲染集里去掉——sync 对「空 type」的既有处理
        // 会把陈旧的 documents.md 删掉，不留一个「看着还在、其实已关」的视图。
        excludeTypes: config?.documentMemoryEnabled === true ? null : ["document"]
      });
      for (const memory of list) {
        if (memory?.type && TYPE_FILE[memory.type]) {
          coveredTypes.add(memory.type);
        }
      }

      // Per-type physical outcome (audit peer D): mirror.sync writes each type
      // file independently and reports per-type success/failure. A type whose
      // file was physically committed must be marked committed even when a
      // sibling type errors — the old code batch-failed every type on any error,
      // leaving committed files mislabeled as failed and masking partial state.
      // Absent entries (a type with no memories) count as success: sync prunes
      // the stale file, which is itself a completed physical state.
      let allOk = true;
      const results = mirror.sync(reconcileHumanEdits(list)) ?? {};
      for (const type of Object.keys(TYPE_FILE)) {
        const r = results[type];
        const ok = !r || r.ok === true;
        if (!ok) allOk = false;
        try {
          if (ok) {
            store.setTypeStatus(type, { status: "committed", applied_gen: gen, last_error: null });
          } else {
            store.setTypeStatus(type, { status: "failed", last_error: r.error ?? "mirror sync failed" });
          }
        } catch (stateError) {
          logger?.warn?.(`syncMirror: setTypeStatus(${type}) failed:`, stateError);
        }
      }

      // 全部 type 物理收敛：CAS/fence 绑定到本地 gen，旧 worker（gen 已过期）会被
      // 拦截。此步失败说明核心 clean 状态没写成功，向上层报失败（不再静默）。
      if (allOk) {
        try {
          store.markMirrorCleanForGeneration(gen, now);
        } catch (stateError) {
          logger?.warn?.("syncMirror: markMirrorCleanForGeneration failed:", stateError);
          return { success: false, error: stateError?.message ?? String(stateError) };
        }
        return { success: true };
      }

      // 部分 type 失败：持久 dirty（债务绑定到新轮次），下次 recover 只补未收敛
      // 的 type。committed 的 type 已应用本轮 gen，不因兄弟失败被回滚。
      const failedTypes = Object.entries(results)
        .filter(([, r]) => r && r.ok === false)
        .map(([t]) => t);
      try {
        store.markMirrorDirty(`mirror sync failed for: ${failedTypes.join(", ")}`, now);
      } catch (stateError) {
        logger?.warn?.("syncMirror: markMirrorDirty failed:", stateError);
      }
      return { success: false, error: `mirror sync failed for: ${failedTypes.join(", ")}` };
    } catch (error) {
      const errMsg = error?.message ?? String(error);
      logger?.warn?.("syncMirror failed:", error);
```

</details>

**依据 4 · 源码核查**：[dsh-mneme/src/store.js:3627-3664](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/src/store.js#L3627-L3664)

dirty与按generation清理，非跨文件事务。

<details>
<summary>查看原文（38行）</summary>

```text
  function markMirrorDirty(error, now) {
    // Bump the desired generation atomically first — the new debt must be bound
    // to a fresh round so a stale worker cannot fence-clean it. Even if this
    // write fails (peer blocker 2), generation still advanced, so recoverMirror
    // sees generation > applied_generation and retries rather than false-clean.
    incrementGeneration();
    return setMirrorState({
      dirty: 1,
      last_error: error,
      last_attempt: now ?? nowIso()
    });
  }

  /**
   * Fenced clean (CAS): mark the mirror clean for a specific generation.
   * First records that generation `gen` has been applied
   * (applied_generation = MAX(applied_generation, gen)), then clears dirty only
   * when the current desired generation has not advanced past gen — a stale
   * worker cleaning an older round must not wipe a newer failure's debt.
   * Returns the resulting state (dirty stays set when the fence holds).
   */
  function markMirrorCleanForGeneration(gen, now) {
    const current = getMirrorState();
    const applied = Math.max(current.applied_generation || 0, gen);
    const patch = { applied_generation: applied };
    if (applied >= gen && (current.generation || 0) <= gen) {
      patch.dirty = 0;
      patch.last_error = null;
      patch.success_at = now ?? nowIso();
    }
    return setMirrorState(patch);
  }

  /** Convenience: mark the mirror clean for the current desired generation (backward-compatible with pre-v0.3.6 callers). */
  function markMirrorClean(now) {
    const current = getMirrorState();
    return markMirrorCleanForGeneration(current.generation || 0, now);
  }
```

</details>

**依据 5 · 源码核查**：[dsh-mneme/src/inject.js:355-393](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/src/inject.js#L355-L393)

同步render与异步prefetch降级。

<details>
<summary>查看原文（39行）</summary>

```text
    ctx.systemPrompt.context({
      name: "memory",
      order: 90,
      text: (ctx) => {
        if (sessionGate?.isOff(sessionOf(ctx))) return "";
        // Bug4: pass the latest user query so injection prefers semantically
        // relevant memories; lastUserQuery is best-effort (empty → legacy).
        // The query vector is prefetched asynchronously (cached) because the
        // render itself must stay synchronous.
        const query = lastUserQuery(ctx);
        if (query) prefetchQueryVector(query);
        const queryVector = queryVectorCache.get(query);
        // v0.8.0 A3：scope 随请求解析（解析器恒返回对象，身份取不到时两维为
        // null）；硬过滤与软加权的门控都在 injectCandidates 内——strict 看
        // strictScope，软加权看 scopeEnabled 且至少一维可解析（issue #339）。
        const scope = resolveSessionScope(ctx);
        // Issue #205：跨轮轮换——最近 N 个查询轮次注入过的 id 本轮不再优先。
        const sessionId = ctx?.agent?.session?.id ?? "_";
        const rotate = recentInjectedIds(sessionId, query);
        // rotateWindow 随集合一起传入：候选池按 maxItems×(N+1) 扩容——窗口要的
        // 牌比既有 maxItems×2 池多时，轮换才有新鲜牌可换（#205 补测）。
        // Issue #239（第 5 项）：注入条数的查询自适应（默认关）。确定性强的话题收缩
        // 条数、模糊话题维持上限——单向收缩，绝不越过 maxInjectedItems；判据只看查询
        // 本身，不做额外检索（先探针检索等于白付一次 fuseRecall）。
        const maxItems = config.injectUncertaintyAdaptive === true
          ? adaptiveInjectBudget(query, baseMaxItems)
          : baseMaxItems;
        // #249 第一批：pin 池统计走可选出参，不动 injectCandidates 的数组契约。
        const pinnedStats = {};
        // Issue #380：注入前判定（preInjectGate）由 injectCandidates **内部**消费——
        // 判定与滤除必须发生在它的 touchRecalled / recall 记账之前（#380 评审：与
        // strictScope 同纪律，见 service.js 的「闸门还必须在 touchRecalled 之前」）。
        // pin 池（#249 逐字保真）与 graphHint 线索行豁免由 service 侧按同口径切出。
        // 渲染同步约束 → 闸门是 async prefetch + cache、同步消费：缓存命中当帧生效
        // （enforce 滤除 / observe 记账），冷缓存首帧降级为原样注入、下一轮同 key
        // 渲染生效——防线故障永不阻塞注入。帧状态经 gateStats 出参带回（同 pinnedStats
        // 的出参口径），这里只读它做面板快照。
        const gateStats = {};
        const candidates = service.injectCandidates({ query, queryVector, maxItems, threshold, scope, rotate, rotateWindow: rotationTurns, pinnedStats, gate, gateStats });
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 默认作用域、内容门控与可选执行有什么限制？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

默认autoInject、autoSummarize及autoDream开启，而scopeEnabled和strictScope默认关闭。即使启用严格可见性，实际谓词只对source=explicit且非空的agent/workspace标签硬过滤；自动标签只软加权，未标注和显式全局仍可见，sensitivity本身不构成隔离。因此不是多租户授权或秘密防泄漏边界。

写入准入enabled/enforce和敏感扫描默认关闭，开启后也只覆盖有限判据；evaluate异常按未判定继续写。注入前门控同样默认关闭，冷缓存、失败/超时可原样注入。自动整理和默认关闭的冲突冻结不能证明错误记忆已被可靠裁决，需人检查实际内容和scope。

还发现条件性初始化缺陷：actionRunEnabled=true且宿主commands.register返回truthy disposer时，index在424行调用disposers.push，但const disposers到538行才声明，处于词法暂时死区，源码推导会ReferenceError。src和作为发布入口的lib均同样排列；registerMoRunCommand直接返回宿主注册结果。默认关闭该开关不经过这条路径，不据此否定默认保存功能；未运行宿主复现，若宿主返回falsy则不会触发此处但会撤销recorder。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-mneme/src/config.js:9-11](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/src/config.js#L9-L11)

默认注入/摘要。

```text
  memoryDir: z.string().default("~/.dsh/memory"),
  autoInject: z.boolean().default(true),
  autoSummarize: z.boolean().default(true),
```

**依据 2 · 源码核查**：[dsh-mneme/src/config.js:903-915](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/src/config.js#L903-L915)

scope默认关闭。

<details>
<summary>查看原文（13行）</summary>

```text
  scopeEnabled: z.boolean().default(false),
  // strictScope（A3）：硬过滤模式。关闭=A2 软隔离（他 scope 降权保留可见，
  // 检索与注入排序同权重，issue #339 补齐注入通道）；
  // 开启后检索/注入/list/get 按 issue #17 四象限可见性公式硬过滤——带他 scope
  // 的记忆完全不可见，未标注（NULL）恒可见；当前会话某维度解析不到时该维度
  // 带标注的记忆一律不可见（fail-closed：身份不明只见全局）。依赖 scopeEnabled
  // 打开才有意义（没有写入标注就无可过滤维度），但独立成键：可先开标注积累
  // 数据、观察 A2 加权质量后再切硬过滤。
  strictScope: z.boolean().default(false),

  // scopeState（issue #471）：政策轴——作用域级可逆闸门。与上面两个键是**两条不同
  // 的轴**：scopeEnabled/strictScope 管「这条记忆属于谁」（事实轴：持久、跟着记忆
  // 行走、改的是归属数据），本键管「这个作用域现在通不通」（政策轴：暂时、由人单
```

</details>

**依据 3 · 源码核查**：[dsh-mneme/src/service.js:123-144](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/src/service.js#L123-L144)

explicit硬过滤、auto软标签。

<details>
<summary>查看原文（22行）</summary>

```text
 * v0.8.0 A3（issue #17）strictScope 可见性谓词：issue 的四象限可见性公式
 * （agent 不对称可见性）——记忆对当前会话可见 ⇔ (agent 维：未标注 或 命中当前
 * agent) AND (workspace 维：未标注 或 命中当前 workspace)。NULL=未标注=全局；
 * 当前会话某维度解析不到时，该维度带标注的记忆一律不可见（fail-closed：身份
 * 不明的会话只见全局，不冒认）。sensitivity 是标签不参与可见性判定（其语义
 * 留给后续批次）。store.list 的 SQL 过滤与此谓词同口径（见 store.js visibility）。
 */
function isVisibleInScope(m, current) {
  // v0.8.1 第 3 步（issue #170 4.3，作者已确认）：硬过滤只认显式声明。某维
  // 仅当「该维有标注且来源为 explicit」才构成硬墙；auto（含 v0.8.0 存量的
  // NULL 来源行）只吃 A2 软加权（foreign ×0.5 保留可见），不进硬过滤。
  // 显式全局（值 NULL + source explicit）与未标注同形，天然恒可见。
  if (m.agent_scope_source === "explicit") {
    const agent = scopeKeyOf(m.agent_scope);
    if (agent !== null && (current.agent_scope === null || agent !== current.agent_scope)) return false;
  }
  if (m.workspace_scope_source === "explicit") {
    const ws = scopeKeyOf(m.workspace_scope);
    if (ws !== null && (current.workspace_scope === null || ws !== current.workspace_scope)) return false;
  }
  return true;
}
```

</details>

**依据 4 · 源码核查**：[dsh-mneme/src/config.js:750-815](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/src/config.js#L750-L815)

准入/注入门控及敏感扫描默认和降级。

<details>
<summary>查看原文（66行）</summary>

```text
  // 两个开关都默认关（验收第 1 条「默认关零行为变化」）：
  //   enabled — 跑第 1 级确定性判据。关时 evaluate 的返回与只计量那一阶段逐字段
  //     一致，写入路径完全不碰。
  //   enforce — 命中时真的拒绝。关时判据照跑、审计照留，决策回落 allow（仅告警）。
  //     读审计时「metadata.deny 非空且 metadata.decision=allow」就是这一档的指纹。
  // 分层是为了能把「先观察」和「开始拦」分成两次上线：enforce 打开前先在真实流量
  // 里看误杀面，而不是靠回滚开关当保险。
  //
  // 第 1 级的判据面刻意收窄到两类：密钥/PII（#164 A2 是判据来源，经
  // createWriteAdmission 的 sensitiveScan 注入；本批只定义它怎么被消费）与空白/
  // 纯噪声文本。去重键命中**不**进第 1 级——按维护者 09-22 的判定归 write-update
  // 放行（2606.24535 的失效模式：同步近重复门跑在异步矛盾检测之前，把本该被裁决
  // 的矛盾直接拒掉）；G1/G2 的阈值继续只计量，等遥测有分布再单独提。
  writeAdmission: z.object({
    enabled: z.boolean().default(false),
    enforce: z.boolean().default(false)
  }).default({}),

  // --- issue #380: pre-inject gate (opinion/stance judgment before injection) -
  // 注入前判定：每帧注入候选出池后、进入 system prompt 前，一次池级 LLM 调用判出
  // 「会向本次请求注入意见/立场」的记忆（E12 D1 口径，判定协议同源实验
  // protocol-preinject.txt）。两级语义复用 writeAdmission：
  //   enabled — 跑判定。判定 async prefetch + cache、同步消费（宿主 systemPrompt
  //     渲染是同步回调，冷缓存首帧降级为不判定原样注入，下一轮同 key 生效）；
  //     判定完成落 llm_audit_logs（trigger_source=preInjectGate，真实 token 用量，
  //     related_memory_ids=被标记记忆）——先在真实负载看意见占比分布。
  //   enforce — 缓存命中帧真的滤除被标记候选。E12 实测只有过滤过判据（D1 −24.4pp，
  //     判定+标记 D2 比它差 +17.6pp——给模型看标记的线已被 E2/E3 关闭，本闸判定
  //     结果绝不进模型上下文）。enforce 无 enabled 时无效果。
  // 降级路径：判定失败/超时/不可解析 → 本帧原样注入 + 审计行 degraded=true 且不
  // 缓存——防线故障永不阻塞注入。判定 LLM 走 agentDefaultModel 当前选择（entity
  // adapter 同款装配），不设独立 provider/model 键；llmAudit.enabled=false 时本闸
  // 不运行（无账目的判定不可见也不该花钱）。lightMode 强制关（LLM-per-turn 附加
  // 路径与低资源档互斥）。
  preInjectGate: z.object({
    enabled: z.boolean().default(false),
    enforce: z.boolean().default(false)
  }).default({}),

  // --- #164 A2: secret / PII scan at the write boundary ----------------------
  // 写入边界的密钥 / PII 判据（src/sensitive-scan.js）自身的闸。与 writeAdmission
  // 的 enabled 分开是有意的：那一个管 #254 第 1 级的空白 / 噪声判据，本键管 A2 这
  // 一类判据，两批的误杀面差一个量级（空白 / 噪声没有解释空间，邮箱 / 手机号有），
  // 绑在同一个开关上就没法单独观察 A2 的命中分布。
  //
  // 分层必须写清：判据的唯一调用点在 #254 第 1 级的闸门里（write-admission.js 的
  // firstLevelHit），闸门不走第 1 级就没人来调这个扫描器。所以本键是「闸门内这一批
  // 判据参不参与」，不是一条能独立跑的链路——单开本键就是零行为变化：
  //   writeAdmission.enabled 关                  → 第 1 级整个不跑，本键开也没用
  //   enabled 开 + 本键关                        → 只跑空白 / 噪声那一批
  //   enabled 开 + 本键开 + enforce 关           → 命中留审计，写入照常（观察档）
  //   enabled 开 + 本键开 + enforce 开           → 命中即拒绝
  // 默认关 = 只计量那一阶段的行为逐字节保留（#332 合并时 sensitiveScan 就是 null）。
  // #164 的「默认仅告警、拦截 opt-in」落在 enforce 上：命中落一条审计
  // （metadata.deny.kind）但照常写入，真要拦得 enabled 与 enforce 同时开。
  // 也走 feature_flags（FEATURE_FLAG_BOOLEANS 白名单），面板可启停=线上回滚开关。
  sensitiveScanEnabled: z.boolean().default(false),

  // --- recall evaluation: test-result storage (v0.4.6, 方案 B) --------------
  // Separate retrieval evaluation snapshots from the production recall audit.
  // When false (default) evaluateRetrieval still computes precision/recall/mrr
  // and returns them to the caller, but writes nothing to recall_evals — the
  // eval table only grows when the operator opts in. Production searchMemories
  // audits to recall_runs and NEVER touches recall_evals, regardless of this
  // flag (production isolation is unconditional).
  evalPersistTestResults: z.boolean().default(false),
```

</details>

**依据 5 · 源码核查**：[dsh-mneme/src/service.js:1500-1530](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/src/service.js#L1500-L1530)

判定错误不阻止保存。

<details>
<summary>查看原文（31行）</summary>

```text
    // 分支），这里只做两件事——先问决策，再在 enforce 命中时**在 store.save 之前**
    // 返回。放在 store.save 之前是这条闸门的意义所在：写进去再删等于没拦，而且中间
    // 那一瞬的注入/检索面已经暴露了。
    // 计量是旁路，拒绝不是：evaluate 抛异常按「不判定」处理（宁可漏拦也不能让判据
    // 故障把写入变成不可用），record 抛异常同样只 warn（审计失败不能反噬写入）。
    let admission = null;
    if (writeAdmission) {
      try {
        admission = writeAdmission.evaluate({ memory, sessionKey: memory._sessionKey });
      } catch (e) {
        try { logger?.warn?.(`[dsh-mneme] write admission evaluate failed: ${String(e)}`); } catch { /* 不反噬 */ }
      }
    }
    // 第 1 级硬拒（enforce 打开且判据命中）：这次写入不落库、不通知、不排嵌入、
    // 不抽实体。审计行仍然要落——拒绝面是这条闸门唯一可解释性的来源（验收第 2 条
    // 「被拒写入有审计与明确原因、可解释不静默丢弃」）。memoryId 传 null：这次写入
    // 没有产生任何行，related_memory_ids 必须空着，挂一个不存在的 id 就是造虚账。
    // reason 随返回值透出，工具层据此给模型一句可行动的拒绝理由。
    if (admission?.decision === "deny") {
      try {
        writeAdmission.record({
          sessionKey: memory._sessionKey,
          verdict: admission,
          memoryId: null
        });
      } catch (e) {
        try { logger?.warn?.(`[dsh-mneme] write admission record failed: ${String(e)}`); } catch { /* 不反噬 */ }
      }
      return { action: "denied", reason: admission.deny?.reason ?? "denied", deny: admission.deny ?? null, memory: null };
    }
    const created = store.save({
```

</details>

**依据 6 · 源码核查**：[dsh-mneme/lib/index.js:414-431](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/lib/index.js#L414-L431)

opt-in路径提前引用disposers。

<details>
<summary>查看原文（18行）</summary>

```text
  // 门控：默认关（actionRunEnabled），并且它挂热路径，轻量档也关。
  if (cfg.actionRunEnabled === true) {
    recorder = createExecutionRecorder({ ctx, logger: ctx.logger, sessionGate });
    const disposeMoRun = registerMoRunCommand({
      ctx,
      recorder,
      enabled: true,
      language: () => langOf(cfg)
    });
    if (disposeMoRun) {
      disposers.push(disposeMoRun);
    } else {
      // 注册不上（宿主没有命令注册表）时别留一个只开着窗口却没人能操作的记录器。
      recorder.dispose();
      recorder = null;
      ctx.logger?.warn?.("[dsh-mneme] actionRunEnabled=true 但宿主没有命令注册表，M.O. 记账未启用");
    }
  }
```

</details>

**依据 7 · 源码核查**：[dsh-mneme/lib/index.js:538-545](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/lib/index.js#L538-L545)

声明实际在后。

```text
  const disposers = [];

  try {
    const disposeSessionGate = ctx.on?.("session/event", (session) => sessionGate.observe(session));
    if (typeof disposeSessionGate === "function") disposers.push(disposeSessionGate);
  } catch {
    // 宿主没有该事件钩子时，注入、工具与蒸馏消费点仍直接检查当前 Session。
  }
```

**依据 8 · 源码核查**：[dsh-mneme/src/pipeline-command.js:270-279](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/src/pipeline-command.js#L270-L279)

注册函数返回宿主结果。

<details>
<summary>查看原文（10行）</summary>

```text
export function registerMoRunCommand({ ctx, recorder, enabled, language = () => "zh" }) {
  if (enabled !== true) return null;
  if (typeof ctx?.commands?.register !== "function") return null;
  return ctx.commands.register({
    name: MO_RUN_COMMAND,
    description: STR.moRunDescription[language()],
    input: { hint: STR.moRunInputHint[language()] },
    handler: createMoRunHandler({ recorder, language })
  });
}
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样限定首次、持续、恢复成本与试用退出？

**研究主题**：效果与总成本、采用判断

#### 完整回答

建议只在可备份、非敏感的单项目小范围试默认记忆链路，保持actionRun关闭；先确认宿主服务、模型选择、实际持久目录和注入/摘要/整理开关，不以安装成功当有效记忆验收。入口inject声明tools/systemPrompt/llm/agentDefaultModel/commands/webServer，源码中部分可选判断不能替代宿主版本兼容验证。

首次有DSH/Node和存储准备、种子知识核验及可选向量后端配置；持续有摘要/整理/嵌入及注入token、检索CPU/磁盘和人工纠错。关键词路径不强制本地推理运行时；选本地语义仍需模型与transformers/runtime，作者给出的数百MB不是本次测量，也不代表零成本。远程embedding会向所配置服务发送待嵌入内容，README的密钥存本机不能等同所有数据不出机。

备份DB与镜像、记录设置和模型条件，再对同任务比较正确引用/过时误用、总token与人工纠错。出现串项目、误记无法纠正、镜像持续failed或调用负担超预算时关闭自动注入/摘要/整理，退回手工文档并检查持久库；卸载和删会话不应当数据清除，需要单独清理/恢复持久目录。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-mneme/src/index.js:44-50](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/src/index.js#L44-L50)

宿主inject声明。

```text
// webServer 在 inject 声明中：cordis 会等宿主 webServer 服务激活后才 apply 本
// 插件，保证 apply 时路由注册不落时序（v0.7.23 曾移出 inject 想支持 headless，
// 结果 cordis 不再等待，apply 时宿主 webServer 未就绪 → 桌面端 "cannot get
// property without inject" 崩溃）。守卫用 ctx.reflect.get（免 inject 读取，
// 未提供返回 undefined）而非 if (ctx.webServer)：直接访问未注入属性在 cordis
// Proxy 下会抛错而非返回 undefined。
export const inject = ["tools", "systemPrompt", "llm", "agentDefaultModel", "commands", "webServer"];
```

**依据 2 · 作者声明**：[dsh-mneme/README.md:150-179](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/README.md#L150-L179)

可选远端/本地向量和runtime作者说明。

<details>
<summary>查看原文（30行）</summary>

```text
### 向量搜索（语义搜索）🔎

可选能力：接入 OpenAI 兼容的 embeddings API，让搜索能命中**字面不同但语义相近**的记忆。

**配置**：官方设置 → 「记忆库设置」→ 滚动到底部「向量搜索」区块：

| 字段 | 说明 |
|------|------|
| `启用向量搜索` | 总开关；开启后记忆面板出现「语义」切换 |
| `API 地址 (Base URL)` | OpenAI 兼容端点，如 `https://api.openai.com/v1`；也支持 SiliconFlow、智谱、本地 Ollama 等 |
| `API Key` | 对应服务的密钥 |
| `模型名` | embedding 模型，如 `text-embedding-3-small`、`text-embedding-v3`、`bge-m3` 等 |

保存配置后点「重建索引」，为已有记忆批量补建向量（新写入的记忆会自动嵌入）。之后在记忆面板输入查询并点「语义」，即可用向量召回语义相关结果；向量服务不可用时自动回退全文搜索。

> ⚠️ 密钥仅保存在本机 `~/.dsh/memory/memory.db` 的 `user_settings` 表，不会上传，也不会写入代码仓库。
> 需要 embedding 而非 rerank 模型：如阿里云 `text-embedding-v3` 可用，`qwen3-vl-rerank` 是 rerank 模型（不走 `/embeddings`）。

### 语义增强（Semantic）🧠

v0.2 起新增**可以完全离线运行的语义记忆引擎**（本地模型 + 精排 + 聚类）：

- **本地 Embedding**：三后端可选——ONNX（`Xenova/bge-small-zh-v1.5`，离线）/ Ollama / OpenAI 兼容，失败自动逐级降级，最差回退关键词搜索
- **Rerank 精排**：`Xenova/bge-reranker-base` 对召回候选交叉编码精排，提升 Top-K 准确率
- **autoDream 语义增强**：对记忆向量聚类（`clusterMemories`），自动发现主题相近 / 疑似矛盾的记忆，巩固更精准
- **搜索流水线**：混合召回（关键词 + 向量）→ Rerank → Top-K
- **自管运行时**：本地推理的依赖闭包（`@huggingface/transformers` + `onnxruntime-node` + `sharp`，从宿主收编时本机实测 49 个包 / 约 393MB）可收编到 `~/.dsh/mneme/runtime/`，与 profile 的依赖图解耦——由于 profile 是所有插件共用的依赖图，这份闭包留在此前的位置会让「安装任何插件」都替它重走一遍整条依赖链；收编优先硬链接，同盘时几乎不额外占盘。`@huggingface/transformers` 已从 `dependencies` 降为**可选 peer**，因此安装插件不再携带它；正在使用本地嵌入的用户请先按文档收编，否则升级后本地嵌入不可用（读写信道不受影响）
- **取回运行时的三条来源**：① 收编本机已有（零网络、同盘硬链接）→ ② 本地 `.tgz` 目录（`runtimeTarballDir`，某个包网络下不到时用）→ ③ npm registry（`runtimeMirror` 可换镜像），按随包发布的 `runtime-manifest.json` 逐个取并**先校验 sha512 再落盘**（win32-x64 实测约 33 个包 / 2142 个文件 / 数百 MB；清单平台无关，一份覆盖 win32/darwin/linux × x64/arm64；剔除 `onnxruntime-web`——Node 构建从不 import 它）。面板「向量索引」卡片在不就绪时会给出这段代价说明并提供一个按钮；不想开面板也可以让 agent 用 `memory_runtime` 工具（`status` / `provision` / `verify`）代做

配置只需在 `cordis.patch.yml` 里设置 `embedProvider`（默认 `openai`，保持 v0.1 行为；改为 `local` 即离线）。升级无需迁移数据。
```

</details>

**依据 3 · 源码核查**：[dsh-mneme/src/index.js:637-649](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/src/index.js#L637-L649)

卸载dispose关闭服务而非删除库。

<details>
<summary>查看原文（13行）</summary>

```text
  // Async disposer: cordis awaits the returned promise on unload (runDisposable),
  // so an in-flight dream run is allowed to finish before the SQLite store is
  // closed — dream.dispose() resolves only after its current run settles.
  return async () => {
    for (const dispose of disposers) {
      if (typeof dispose === "function") dispose();
    }
    commands?.dispose();
    recorder?.dispose();
    if (dream) await dream.dispose();
    if (sleep) sleep.dispose();
    store.close();
  };
```

</details>

**依据 4 · 作者声明**：[dsh-mneme/README.md:32-44](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/README.md#L32-L44)

独立记忆和存储目录。

<details>
<summary>查看原文（13行）</summary>

```text
**它不是什么**（边界声明）：

- 不是向量数据库——语义搜索是可选增强，默认零额外依赖
- 不替代会话日志——它存的是「值得跨会话记住的」精炼知识
- 不改变模型本身——进化的是记忆库与每次注入的上下文
- 删对话 ≠ 删记忆——记忆是跨会话的全局知识（v0.7.11 起不再与会话绑定），删除会话不影响已存入的记忆

## ✨ 功能

### 记忆存储（SQLite + Markdown 镜像）

- **SQLite 主存储**：`~/.dsh/memory/memory.db`，`node:sqlite` 内置，零原生依赖
- **Markdown 镜像**：按类型分文件（`preferences.md` / `projects.md` / `decisions.md` / `history.md` / `summary.md` / `patterns.md` / `pitfalls.md` / `constraints.md` / `rejected-solutions.md`，外加只读视图 `documents.md`），文件头是 YAML frontmatter（`type` / `generated.by` / `generated.at` / `covered` / `coverage` / `tags`）。人类可读，条目标题与正文可手工编辑（**人工修改优先**合并回库）；`documents.md` 例外：它只有 document 指针行（id、标题、摘要首句、文件路径），不含正文也不参与人工回填。文件头与条目元数据行由机器维护
```

</details>

#### 缺口

- 真实模型调用、runtime占用及任务总成本未知
  **影响**：不能给省钱、省时或离线收益保证
  **进一步探讨**：记录实际token/磁盘/纠错耗时，并确认所选后端数据流与预算。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证长期记忆改善任务而非仅改善召回？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是将记忆候选是否命中与下游任务是否因它正确完成分别记录，在固定项目加入过时偏好、纠正事实和同名异项目材料，对照关闭记忆、手工文档与当前插件。已有scope、准入、注入前门控和召回评估不是空白，新增价值应是业务结果归因与纠错/串用成本，不是重复造检索评分字段。

按相同模型/预算测事实正确、过时误用、跨项目误用、人工修复和token；分别比较冷缓存首帧与缓存后帧以及显式/自动scope。若召回改善而任务无净收益、纠错负担更大，或已有流程达到同样结果，则否定该假设。合成错误只用于隔离实验，不导入正式个人记忆，不把此设计写成已证收益。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-mneme/src/config.js:780-800](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/src/config.js#L780-L800)

已有注入前判定及冷缓存可用性选择。

<details>
<summary>查看原文（21行）</summary>

```text
  // 缓存——防线故障永不阻塞注入。判定 LLM 走 agentDefaultModel 当前选择（entity
  // adapter 同款装配），不设独立 provider/model 键；llmAudit.enabled=false 时本闸
  // 不运行（无账目的判定不可见也不该花钱）。lightMode 强制关（LLM-per-turn 附加
  // 路径与低资源档互斥）。
  preInjectGate: z.object({
    enabled: z.boolean().default(false),
    enforce: z.boolean().default(false)
  }).default({}),

  // --- #164 A2: secret / PII scan at the write boundary ----------------------
  // 写入边界的密钥 / PII 判据（src/sensitive-scan.js）自身的闸。与 writeAdmission
  // 的 enabled 分开是有意的：那一个管 #254 第 1 级的空白 / 噪声判据，本键管 A2 这
  // 一类判据，两批的误杀面差一个量级（空白 / 噪声没有解释空间，邮箱 / 手机号有），
  // 绑在同一个开关上就没法单独观察 A2 的命中分布。
  //
  // 分层必须写清：判据的唯一调用点在 #254 第 1 级的闸门里（write-admission.js 的
  // firstLevelHit），闸门不走第 1 级就没人来调这个扫描器。所以本键是「闸门内这一批
  // 判据参不参与」，不是一条能独立跑的链路——单开本键就是零行为变化：
  //   writeAdmission.enabled 关                  → 第 1 级整个不跑，本键开也没用
  //   enabled 开 + 本键关                        → 只跑空白 / 噪声那一批
  //   enabled 开 + 本键开 + enforce 关           → 命中留审计，写入照常（观察档）
```

</details>

**依据 2 · 源码核查**：[dsh-mneme/src/config.js:815-825](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/src/config.js#L815-L825)

已有检索评估存储与生产召回区分。

<details>
<summary>查看原文（11行）</summary>

```text
  evalPersistTestResults: z.boolean().default(false),

  // --- standalone external API (v0.7.12) ------------------------------------
  // A plain node:http server for ecosystem integrations that cannot reach the
  // DSH-internal webServer. Disabled by default; when enabled the Bearer token
  // is persisted in the settings kv ("external_api"), auto-generated on first
  // boot. Bind host: keep the loopback default — moving it to a non-loopback
  // address exposes the whole memory store to the network and is the
  // operator's responsibility.
  externalApiEnabled: z.boolean().default(false),
  externalApiPort: z.natural().default(8790),
```

</details>

**依据 3 · 源码核查**：[dsh-mneme/src/service.js:130-144](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/src/service.js#L130-L144)

显式/自动作用域是可检验分组。

<details>
<summary>查看原文（15行）</summary>

```text
function isVisibleInScope(m, current) {
  // v0.8.1 第 3 步（issue #170 4.3，作者已确认）：硬过滤只认显式声明。某维
  // 仅当「该维有标注且来源为 explicit」才构成硬墙；auto（含 v0.8.0 存量的
  // NULL 来源行）只吃 A2 软加权（foreign ×0.5 保留可见），不进硬过滤。
  // 显式全局（值 NULL + source explicit）与未标注同形，天然恒可见。
  if (m.agent_scope_source === "explicit") {
    const agent = scopeKeyOf(m.agent_scope);
    if (agent !== null && (current.agent_scope === null || agent !== current.agent_scope)) return false;
  }
  if (m.workspace_scope_source === "explicit") {
    const ws = scopeKeyOf(m.workspace_scope);
    if (ws !== null && (current.workspace_scope === null || ws !== current.workspace_scope)) return false;
  }
  return true;
}
```

</details>

#### 缺口

- 未实施下游结果对照
  **影响**：不能认定拟议归因机制改善记忆价值
  **进一步探讨**：固定材料与模型，测净错误/人工/成本，缺少净收益则不采用。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
