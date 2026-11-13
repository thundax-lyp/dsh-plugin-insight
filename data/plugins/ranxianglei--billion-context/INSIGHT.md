# Billion Context

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c26c31a](https://github.com/ranxianglei/billion-context/tree/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99)

<!-- BEGIN META -->
[![GitHub ★ 6,779](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C779&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ranxianglei/billion-context) [![npm 30d 3,310,468](https://img.shields.io/static/v1?label=npm+30d&message=3%2C310%2C468&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context)
<!-- END META -->

> **功能**：面向长会话的上下文压缩工具，可按范围生成摘要、检索并回读内容。

> **亮点**：把 DSH 工具、代理会话、范围折叠及按块取回接入同一长任务，使模型能查询旧片段并继续用摘要组织当前上下文。范围与回读由代理内核提供，宿主接入负责归属和协调双重压缩，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：用户能否分辨恢复的是原文还是摘要？两类内容可走同一输出形式。宿主写入本地压缩检查点后，归档块可能无法取回。工具返回和保存调度也有时间差，见 [Q03](#research-q03) 与 [Q04](#research-q04)。

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
  - [Q01 · 一个反复跨轮核对早期决策的编码任务，需要什么样的压缩与回读？](#detail-section-11)
  - [Q02 · DSH 发出的模型请求和压缩工具怎样归属于同一会话？](#detail-section-12)
  - [Q03 · 范围压缩成功后，回读可恢复哪些材料，失败怎样传给使用者？](#detail-section-13)
  - [Q04 · 切换代理与宿主压缩各依赖什么，部署和退出怎样避免卡住预设？](#detail-section-14)
  - [Q05 · 怎样判断这条链是否值得进入日常工作？](#detail-section-15)
  - [Q06 · 能否用可辨识的恢复来源减少代理压缩造成的错误引用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合用 DSH 维护长编码任务、经常要翻回早期接口决定或失败记录的开发者。可先试一段已结束的工作，确认回读的原文足以继续完成原验收，见 [Q01](#research-q01)。

对照 DSH 原生压缩加人工维护决策记录。早期事实少且已有可靠文档时，新会话与短交接足以保留约束。工作反复回到不同历史细节时，按块回读才有明确增量，见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| compress | 按范围折叠上下文 | 需要可归属的会话及有效范围，业务可拒绝或部分应用 |
| decompress | 按块查看旧材料 | 原文取决于缓存和现有历史，归档块可能无法恢复 |
| search_context | 查找上下文中的匹配项 | 代理按当前会话和状态检索 |
| /acp | 查看会话与折叠状态 | 最近会话回退需读提示并检查归属 |
| /acp-cache | 查看提示词缓存报告 | 依赖可访问的代理与会话数据 |
| Web 设置面板 | 查看和配置 bundle | 依赖 DSH Web 槽及模块加载器 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node 20 及以上和含 dist 的包 | 启动必需 | 提供宿主及浏览器构建 | 无 dist 的源码无法按声明加载 |
| DSH 工具、命令和 Agent 服务 | 主入口必需 | 注册及绑定会话 | 工具与会话归属无法按接线完成 |
| internal/config 与反射服务 | 嵌套压缩门控所需 | 调整预设并提供就绪信号 | 可能保留宿主压缩，按启动日志核查 |
| 可达代理、模型供应方及可写目录 | 执行及回读所需 | 转发、记录块与写输出文件 | 可能直发、工具错误或导出失败 |
| 独立摘要模型与授权 | 可选 | 由独立模型产出摘要 | 未配置走默认范围折叠 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者复制脱敏 profile，保留原始记录与验收 | 原生流程可重做相同任务 |
| 加载 | 按包方式加载并检查工具和门控 | 状态对应当前会话，启动日志无门控缺口 |
| 执行 | 折叠已完成的范围，按块回读并执行原验收 | 原文匹配指定约束与失败输出 |
| 退出 | 有压缩冲突、匿名转发或摘要回退时移除整个 bundle | 重启后核对原配置与任务记录 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 包、代理及状态目录 | 复制配置和核对门控 | 部署用时未知 |
| 持续使用 | 模型输入输出、缓存读写、可选摘要与存储 | 检查归属、回读和纠正误引 | 合格任务的净费用未知 |
| 失败恢复 | 请求重做、磁盘和临时导出 | 排查会话、原文与检查点并重新验收 | 请求取消后服务器状态需回查 |
| 退出 | 保留或清理状态和导出文件 | 移除 bundle 并复查原生流程 | 宿主历史仍随任务增长 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 按范围控制上下文 | 代理可折叠历史并记录块 | 任务关键事实保留程度 |
| 需要时定位原文 | 有缓存、当前消息和摘要的逐层回退 | 任意旧块是否仍有原文 |
| 跨轮继续推进 | DSH 会话归属与独立门控有实现 | 所选宿主的长期运行稳定性 |
| 单位合格任务净成本 | 可查看会话与缓存状态 | 同模型对照的现金、延迟和人工净变化 |

> **思考**：用户能否分辨恢复的是原文还是摘要？两类内容可走同一输出形式。宿主写入本地压缩检查点后，归档块可能无法取回。工具返回和保存调度也有时间差，见 [Q03](#research-q03) 与 [Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 DSH 工具、代理会话、范围折叠及按块取回接入同一长任务，使模型能查询旧片段并继续用摘要组织当前上下文。范围与回读由代理内核提供，宿主接入负责归属和协调双重压缩，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

把独立门控注册与主模块的压缩声明分开，可降低停止主入口时预设等不到服务的风险。实际兼容仍受内部配置钩子和补丁替换规则约束。代理将传输与业务状态分开。会话锁限于单进程，工具响应后仍需考虑保存延迟，见 [Q03](#research-q03) 和 [Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

用户能否分辨恢复的是原文还是摘要？两类内容可走同一输出形式。宿主写入本地压缩检查点后，归档块可能无法取回。工具返回和保存调度也有时间差，见 [Q03](#research-q03) 与 [Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只在脱敏的独立 profile 试一个已有验收标准的范围。记下两条必须回读的约束，确认 /acp 对应当前会话，再折叠、取回并按原测试验收。遇到匿名转发、仅摘要或压缩冲突时，从同一 profile 移除整套 bundle，保留原日志并回到原生流程，见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 DSH 挂载、模型请求与工具分流、范围折叠和按块回读。回读受原始材料可得性约束，宿主版本、净费用及恢复保真留待验证。来源标记是待验证设计。

- 已检查：作者 README、包清单、源码路径 README.md、dsh.bundle.patch.yml、src/decompress-shared.ts、src/agent/dsh-native.ts、src/agent/native-intercept.ts、src/plugin.ts、src/session.ts、src/loop/core.ts、src/stream.ts、src/agent/shared.ts、src/server/admin.ts、package.json、tsup.config.ts、src/agent/dsh-compaction-disable.ts、src/external-summary-compress.ts、src/agent/dsh-native-client.ts、src/agent/dsh-compaction-gate.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只核查固定提交的 DSH 宿主与 Web 挂载、代表性 fetch 归属、工具转发、压缩门控、回读与结果边界。其他宿主、协议、安装升级器与所有检索变体未逐一审计。npm 构建产物与当前提交未核实同源。
- 下一步：在独立脱敏 DSH profile 对照原生压缩和代理折叠，记录相同验收标准下的原文保真、会话归属、故障恢复、缓存、费用及人工。对来源提示做三种材料条件的盲评，见 [Q05](#research-q05) 与 [Q06](#research-q06)。

**分析版本**

- **仓库**：[ranxianglei/billion-context](https://github.com/ranxianglei/billion-context)
- **版本号**：0.1.213（[固定提交 c26c31a](https://github.com/ranxianglei/billion-context/tree/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可为回读标明来源和覆盖状态，验证模型是否更少把摘要当作原文。分别回放缓存完整、仅当前消息可用及两者都缺失的会话。若误引未下降或合格任务成本上升，停止推进，见 [Q06](#research-q06)。

在独立脱敏 DSH profile 对照原生压缩和代理折叠，记录相同验收标准下的原文保真、会话归属、故障恢复、缓存、费用及人工。对来源提示做三种材料条件的盲评，见 [Q05](#research-q05) 与 [Q06](#research-q06)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 191 | 23451 | — | — | 471031 |
| .ts | source | 438 | 205017 | 137270 | 58836 | — |
| .mjs | source | 33 | 7112 | 4960 | 1739 | — |
| .ts | test | 1387 | 390862 | 324849 | 45401 | — |
| .mjs | test | 5 | 863 | 644 | 205 | — |
| .md | test | 1 | 359 | — | — | 2707 |
| .mts | example | 2 | 85 | 71 | 16 | — |
| .mjs | example | 1 | 21 | 16 | 4 | — |
| .ts | example | 1 | 67 | 48 | 16 | — |
| .md | example | 1 | 34 | — | — | 545 |
| .js | source | 1 | 616 | 600 | 26 | — |

</details>

**活跃度**

[![Issue 未关闭 626](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=626&color=737b86&logo=github)](https://github.com/ranxianglei/billion-context/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1,717](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1%2C717&color=737b86&logo=github)](https://github.com/ranxianglei/billion-context/issues?q=is%3Aissue+created%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z) [![近30天关闭 1,173](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1%2C173&color=737b86&logo=github)](https://github.com/ranxianglei/billion-context/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z)



统计日期：2026-11-12。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确定 DSH 用户能否把长任务早期细节压缩成可回读的上下文，以及怎样检验相对原生压缩的保真、恢复和净成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 一个反复跨轮核对早期决策的编码任务，需要什么样的压缩与回读？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适用对象是用 DSH 维护长任务、后续仍需核对早期接口约束或测试失败原文的开发者。合格结果是后续补丁满足早期约束并通过同一组验收，且能够指出用过的原始记录。常规做法是使用宿主压缩或新建会话并手工维护决策文档，足以应对重要约束少且交接频率低的任务。固定实现额外提供按范围折叠、在摘要保留期间按块回读，以及通过 /acp 查看会话状态。宿主压缩入口由 bundle 配置和独立门控协调，折叠和回读来自代理内核。该 DSH 接入层的贡献是组合与会话归属。作者称长会话及前缀缓存友好，这仍需把恢复、缓存和任务验收一起测量。作者也明确说明发给模型的上下文变小后，宿主历史文件仍继续增长，换新会话依然是重要替代。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:72-91](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/README.md#L72-L91)

作者对照宿主摘要介绍范围压缩及按需恢复。

<details>
<summary>查看原文（20行）</summary>

```text
`billion-context` sits between **any** agent and its model API, rewriting Anthropic/OpenAI streams with [acp-kernel](https://github.com/ranxianglei/acp-kernel) compression. The model decides **when** and **what** to compress into high-fidelity summaries — not a hard truncation limit.

## Why

Long coding sessions blow up context. Each provider charges per token, and once you pass the context window the session degrades or dies. `billion-context` compresses consumed conversation into layered summaries so you can run a single session for days — billions of tokens through one context window.

Unlike a host's built-in summarizer, compression here is **incremental, reversible, and prefix-cache friendly**: summaries are written in small ranges, can be decompressed on demand, and the cache prefix stays intact.

## How it works

![How it works](docs/how-it-works.en.svg)

### Context-management tools

The proxy injects four context-management tools into the conversation; the model calls them itself as context grows, and the proxy executes `compress` server-side so folded ranges stay summarized in history until restored:

- **`compress`** — fold a message range into a detailed summary.
- **`decompress`** — restore a compressed range when exact details are needed again.
- **`search_context`** — keyword search over compressed summaries and visible messages.
- **`acp_status`** — context-usage overview plus which ranges are still compressible.
```

</details>

**依据 2 · 作者声明**：[README.md:404-413](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/README.md#L404-L413)

宿主历史文件仍增长是作者说明。

<details>
<summary>查看原文（10行）</summary>

```text
**Does compression shrink my client's own conversation file?** No — the most
common surprise in very long sessions (#5796). Compression shrinks **what is
sent to the model**: every outgoing request is rebuilt from live blocks plus
summaries, so the wire stays small however long the conversation runs. The
client's stored history is user data — bili never rewrites it. On dsh the
host's auto-compaction is additionally disabled while bili is active (two
compressors must not fight over one history, #1772/#2474/#3354), so the
host-side file grows with every turn: each turn takes longer as it grows
(measured: tens of seconds per turn at ~30K messages, #5796), and the
practical convergence path is to **start a new session** when it gets heavy.
```

</details>

**依据 3 · 源码核查**：[dsh.bundle.patch.yml:21-39](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/dsh.bundle.patch.yml#L21-L39)

固定包插入两个宿主模块并改变压缩配置。

<details>
<summary>查看原文（19行）</summary>

```text
- insert:
    - id: bili-native
      name: billion-context
    - id: bili-compaction-gate
      name: billion-context/dsh-compaction-gate
- id: compaction-basic
  config:
    auto: false
# #3354: keep in sync with writeDshAcpPatch in src/launcher.ts — entry inject
# lists are REPLACED by patches, not concatenated; if a future dsh ships its
# own inject list on these entries, merge manually in BOTH layers.
- id: preset-standard
  inject: [biliBasicCompactionPolicy]
- id: preset-ptc
  inject: [biliBasicCompactionPolicy]
- id: preset-minimal
  inject: [biliBasicCompactionPolicy]
- id: preset-cordis
  inject: [biliBasicCompactionPolicy]
```

</details>

**依据 4 · 源码核查**：[src/decompress-shared.ts:219-246](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/decompress-shared.ts#L219-L246)

回读按块号与 full 参数选择内容，可能退回摘要。

<details>
<summary>查看原文（28行）</summary>

```text
    const full = args.full === true || args.full === "true";
    const cached = ctx.session.blockContents.get(blockId);
    let body: string;
    let count: number;
    if (cached) {
        // Honor the full flag: `one` = direct msgs + nested child summaries,
        // `full` = all original messages. Returning the cached full text
        // unconditionally would break the default one-level semantics.
        // `one === null` means the two views were byte-identical at cache
        // time and deduped to one copy (#401).
        const view = full ? cached.full : (cached.one ?? cached.full);
        body = view.text;
        count = view.count;
    } else {
        const collected = collectBlockContent(ctx.session.state, block, ctx.compressMessages ?? ctx.messages, { full });
        body = collected.text || block.summary;
        count = collected.count;
    }
    // #1336: retrieve-quality proxy — a whole-block restore where a precise
    // path existed (per-message coverage recorded AND CCR armed ⇒ range-restore
    // or targeted acp_retrieve would have sufficed) is the failure shape plan-
    // aware search steering exists to prevent.
    ctx.session.stats.wholeBlockRestores = (ctx.session.stats.wholeBlockRestores ?? 0) + 1;
    if (coveredRefSpan(ctx.session.state, block) !== null && ccrEnabled(ctx.session)) {
        ctx.session.stats.wholeBlockRestoresPreciseAvailable = (ctx.session.stats.wholeBlockRestoresPreciseAvailable ?? 0) + 1;
    }

    const header = `[Block ${blockId} content — ${count} item(s)${full ? ", full" : ""}]`;
```

</details>

#### 缺口

- 当前 DSH 固定版本没有与手工决策文档的同任务对照
  **影响**：无法量化保真或节省是否覆盖切换成本
  **进一步探讨**：用相同早期约束和验收脚本比较两种做法的合格交付

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 发出的模型请求和压缩工具怎样归属于同一会话？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

主模块向代理取工具描述并注册到宿主。执行时取当前代理地址和调用 Agent 的会话 ID，缺任一项就报错，再把业务拒绝转成宿主工具错误。模型请求另走 fetch 与 WebSocket 拦截。工具就绪且常规宿主归属有效时，身份回调把会话 ID 写进代理头。无归属时会尝试从已知会话的续传内容认领，显式声明的模型端点也能先通过接管门槛。原始模型 URL 在普通未接管条件下可直发，识别为超窗的请求可能本地拒绝，可辨识的宿主压缩请求还会尝试分流给代理。代理可达也可能只有匿名转发，此时 /acp 会提示工具未注册。需同时检查工具、会话归属和代理，才可识别会话仍可对话但压缩已失效的情况。

#### 证据与依据

**依据 1 · 源码核查**：[src/agent/dsh-native.ts:985-1014](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/agent/dsh-native.ts#L985-L1014)

读取代理清单并注册工具。

<details>
<summary>查看原文（30行）</summary>

```text
async function registerTools(ctx: PluginContext): Promise<void> {
    if (register.pending !== undefined) return register.pending;
    const base = register.base;
    if (register.toolsReady || base === undefined) return;
    register.pending = (async () => {
        const tools = await fetchManifest(base, "anthropic");
        // #2082: land on the CURRENT context, not the one that started this
        // flight — a re-activation mid-fetch must not register into (or die
        // on) the deactivated context captured at call time.
        const target = activeCtx ?? ctx;
        let adopted = 0;
        for (const tool of tools) {
            try {
                target.tools.register(toolDefinition(tool));
            } catch (err) {
                // #3380: idempotent adoption — a name this process ALREADY
                // holds in the host tool layer throws "already registered";
                // that registration is exactly what we want, so skip it and
                // register the rest (also converges a partial registration
                // left by an earlier interrupted flight).
                if (!errMessage(err).includes("already registered")) throw err;
                adopted += 1;
            }
        }
        if (adopted > 0 && !regAdoptLogged) {
            regAdoptLogged = true;
            persistClientEvent(`tool registration adopted ${adopted} pre-existing registration(s) from this process — continuing`);
        }
        register.toolsReady = true;
        register.failStreak = 0;
```

</details>

**依据 2 · 源码核查**：[src/agent/dsh-native.ts:929-945](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/agent/dsh-native.ts#L929-L945)

工具读取实时代理地址、宿主会话 ID 和取消信号。

<details>
<summary>查看原文（17行）</summary>

```text
        execute: async (args, exec) => {
            // #983: read the LIVE base — a respawn after a proxy death moves
            // the origin, and a captured base would keep firing at a dead port.
            const base = register.base;
            if (base === undefined) {
                throw new Error("bili: proxy is down — recovery in progress, retry shortly");
            }
            const sid = exec.agent?.session?.id;
            if (typeof sid !== "string" || sid.length === 0) {
                throw new Error(`bili tool ${tool.name} requires an owning agent session`);
            }
            const out = await forwardTool(base, sid, tool.name, args, exec.signal, true);
            // #2204: dsh tool results are plain strings — a business failure
            // throws so the host renders an error, not success text.
            if (out.failed) throw new Error(out.text);
            return out.text;
        },
```

</details>

**依据 3 · 源码核查**：[src/agent/dsh-native.ts:2366-2408](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/agent/dsh-native.ts#L2366-L2408)

门控有端点声明、常规归属、续传认领与拒绝。

<details>
<summary>查看原文（43行）</summary>

```text
    state.takeoverGate = (url, body, init) => {
        // #1295: an operator-declared endpoint is explicitly "this URL IS my
        // model API" — declaration outranks heuristic attribution (a provider
        // plugin's LLM call may run outside dsh's ALS initiator scope). The
        // proxy-side body disambiguation still guards against same-path
        // non-conversation payloads being misrouted.
        if (matchModelEndpoint(getDeclaredModelEndpoints(), url) !== undefined) return true;
        const attr = attributionOf(ctx);
        if (attr.state === "ok") {
            threwStreak = 0;
            threwGiveUpNoticed = false;
            noteAttrRecovery();
            return true;
        }
        // #4082: before refusing an unattributed dispatch, try the negotiated
        // recall — the body itself may prove it is a known session's
        // continuation (retry / model switch shape). A claim here routes the
        // request onto the plugin lane with the negotiated sid; refusal below
        // stays byte-identical when there is no evidence. #4829: the claim may
        // now decode content-encoded bodies, so this arm settles async — the
        // gate contract already tolerates Promise verdicts (threw arm).
        if (attr.state === "none") {
            // #4829 review: without init there is no body to decode and the
            // claim can never succeed — settle synchronously. Both gate
            // consumers await the verdict today (fetch lane since #4829, WS
            // lane inside its deferred window since #5838), so this is a fast
            // path, not a verdict-class contract.
            if (init === undefined) {
                threwStreak = 0;
                threwGiveUpNoticed = false;
                return refuseUnattributed(url, attr, body, init);
            }
            return maybeNegotiatedClaim(url, init).then((claimed) => {
                if (claimed !== undefined) {
                    // Deliberately NOT noteAttrRecovery(): the host attribution
                    // is still broken — the health signal stays honest; the
                    // REQUEST is what got rescued, not the initiator scope (#4082).
                    return true;
                }
                threwStreak = 0;
                threwGiveUpNoticed = false;
                return refuseUnattributed(url, attr, body, init);
            });
```

</details>

**依据 4 · 源码核查**：[src/agent/dsh-native.ts:2551-2565](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/agent/dsh-native.ts#L2551-L2565)

工具就绪且归属有效才写 DSH 会话头。

<details>
<summary>查看原文（15行）</summary>

```text
    state.headersFor = (_url) => {
        maybeRetry(ctx);
        if (!register.toolsReady) return undefined;
        const attr = attributionOf(ctx);
        if (attr.state !== "ok") return undefined;
        const sid = attr.sid;
        ensureDshTitleReported(sid);
        // #2381: size this request against the model IT routes to — session
        // header first, global default only as fallback. Stamping reads ONLY
        // that key's own entry, so a mismatched model's numbers can never be
        // sent (the proxy-side exact-match gate stays as defense in depth).
        const target = sessionModelTargetOf(ctx) ?? globalModelTarget(modelInfo.services);
        refreshModelInfo(register.base, target);
        const headers: Record<string, string> = { "x-bili-plugin": "dsh", "x-bili-plugin-conversation": sid };
        // #3370: the incremental-turn marker (and, since #3329, the turn id)
```

</details>

**依据 5 · 源码核查**：[src/agent/dsh-native.ts:2905-2908](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/agent/dsh-native.ts#L2905-L2908)

安装 fetch 与 WebSocket 拦截。

```text
export function installDshIntercepts(state: NativeInterceptState): void {
    installNativeFetchIntercept(state);
    installNativeWebSocketIntercept(state);
}
```

**依据 6 · 源码核查**：[src/agent/native-intercept.ts:2074-2093](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/agent/native-intercept.ts#L2074-L2093)

原始 URL 分支区分宿主压缩、超窗和直发。

<details>
<summary>查看原文（20行）</summary>

```text
                if (fetchMethodOf(input, init) === "POST" && await dshCompactionMarkerInBody(input, init)) {
                    const compactionOrigin = await readyOrigin(state);
                    if (compactionOrigin !== undefined) {
                        const diverted = `${compactionOrigin}/bili/${url}`;
                        const stamped = withHeaders(makeTarget(diverted), hoplessForLoopback(diverted, init), { [BILI_PASSTHROUGH_HEADER]: "1" });
                        state.onDispatch?.(diverted, "rewrite");
                        return send(stamped.input, stamped.init);
                    }
                }
                // #2924 direction 1: a provably-oversized body that the gate
                // could not claim fails LOCALLY (422, host-visible) instead of
                // riding #1117's direct send into a guaranteed upstream 400 —
                // on a >window local history that 400 kills the whole session,
                // because every later request carries the same history.
                if (verdict === "refuse-oversized" || verdict === "refuse-oversized-unattributed") {
                    state.onDispatch?.(url, "refused");
                    return verdict === "refuse-oversized" ? oversizeRefusal(url) : unattributedOversizeRefusal(url);
                }
                return directSendOrRefuse(url, input, init);
            }
```

</details>

**依据 7 · 源码核查**：[src/agent/dsh-native.ts:1636-1659](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/agent/dsh-native.ts#L1636-L1659)

状态区分工具未就绪及读到其他会话的回退。

<details>
<summary>查看原文（24行）</summary>

```text
    // #3380 P3: wire-mode exposure — the proxy answers but the local tools are
    // down, so every model request rides bili WITHOUT identity headers
    // (anonymous zero-fold sessions, no compression). Say so in the panel the
    // user already looks at instead of letting it stay silent.
    const wireNote = !register.toolsReady && !register.dead
        ? `⚠️ bili tools NOT registered — model requests ride bili WITHOUT identity headers (wire mode: no compression, anonymous sessions). Last error: ${register.lastRegistrationError ?? "unknown"}. Restart dsh to restore; retries continue in the background.\n\n`
        : "";
    // #1677: the command executor hands us the invoking session via the invocation —
    // DSH never establishes the AsyncLocalStorage boundary on the command path, so
    // currentInitiator() is always empty here and relying on it made /acp silently
    // show ANOTHER (most-recently-active) session's panel. Prefer the invocation's
    // agent session id; fall back to ALS attribution, then the latest-session fallback.
    const sid = invocationSidOf(invocation) ?? sessionIdOf(ctx);
    let fellBackToLatest = false;
    let status: Record<string, unknown> | undefined = sid !== undefined ? await fetchStatus(base, sid) : undefined;
    if (status === undefined) {
        fellBackToLatest = true;
        status = await fetchStatusLatest(base);
    }
    const panel = status?.panel;
    if (status && typeof panel === "string" && panel.length > 0) {
        // A panel reached through the latest-fallback belongs to some OTHER session —
        // say so instead of presenting foreign data as the caller's own (#1677).
        return { kind: "success", text: `${wireNote}${fellBackToLatest ? `${latestSessionNote(status, sid)}\n\n` : ""}${panel}` };
```

</details>

#### 缺口

- 同模型端点的并发会话、归属缺失和重连在目标宿主上的效果未知
  **影响**：单次看到代理请求无法支持长期归属稳定
  **进一步探讨**：用两个标记不同的会话交错发送并对照会话 ID、工具结果和代理路径

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 范围压缩成功后，回读可恢复哪些材料，失败怎样传给使用者？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

原生工具在代理中持有会话内存锁，读取消息快照并按有效配置分派压缩或回读。普通范围折叠为新块尝试缓存单层及完整两个视图。回读优先用缓存，单层允许保留嵌套子摘要，完整视图尝试读原文。缺缓存时从仍可访问的消息重建，无可用文本才退回块摘要。宿主压缩前的归档块会明确失败。长文本可返回本地文件位置，写入异常另有回执。成功头的 full 只反映请求参数，拿到标题或文件仍要核对正文和条数。工具传输、业务状态和保存是三个不同条件。代理把业务状态放入响应，标脏只排队持久化。客户端把取消信号传给 HTTP fetch，而对应服务端 admin 调用未向处理器传入请求断开信号。客户端取消后需要回查服务端是否已经开始或应用压缩。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.ts:2410-2447](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/plugin.ts#L2410-L2447)

会话锁内取快照及有效配置。

<details>
<summary>查看原文（38行）</summary>

```text
        result = await withSessionLock(session, async () => {
            if (parsed.expectedRevision !== undefined) {
                try {
                    if (sessionRevisionOf(session) !== parsed.expectedRevision) {
                        forkReply(res, 409, { ok: false, code: "PARENT_REVISION_CONFLICT", error: "session revision changed" });
                        return undefined;
                    }
                } catch (err) {
                    forkReply(res, 409, { ok: false, status: "unavailable", code: "SNAPSHOT_UNAVAILABLE", error: String(err) });
                    return undefined;
                }
            }
            // Read the remembered snapshot UNDER the session lock: the model
            // request rewrites remembered atomically under this same lock
            // (rememberPluginMessages), so a racing tool call sees a consistent
            // state instead of a stale/empty window.
            const mem = session.transient?.pluginMessages;
            const messages = mem ? (mem.processed.length > 0 ? mem.processed : mem.original) : (session.pluginSnapshot ?? []);
            const before = currentContextObservation(session);
            const creditBefore = session.stats.compressCreditTokens ?? 0;
            const compressBefore = session.lastCompress;
            const pendingBefore = new Set(session.pendingRetrievals.map((p) => p.ref));
            const toolResult = await executeProxyToolAsync(tool, args, {
                core: deps.core,
                // #833: run proxy tools under the session's last resolved Config
                // (same values the wire path used), not the base kernelConfig.
                config: effectiveConfig(session, deps.config),
                messages,
                // #2627: compress against the RAW history, not the processed
                // outbound view — on the Responses wire that view carries the
                // synthetic acp_turn_sep_* ordering separators, which would be
                // registered into new blocks' coverage and read back as
                // permanent drift against the client's unchanged history
                // (same split as the relay loop ctx).
                compressMessages: mem && mem.original.length > 0 ? mem.original : undefined,
                session,
                log: (m) => deps.log("info", `[${session.id}] [plugin] ${m}`),
            }, callId, undefined, deps.signal);
```

</details>

**依据 2 · 源码核查**：[src/session.ts:1565-1576](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/session.ts#L1565-L1576)

锁是会话对象的进程内 Promise 链。

<details>
<summary>查看原文（12行）</summary>

```text
export async function withSessionLock<T>(session: Session, fn: () => T | Promise<T>): Promise<T> {
    const prev = session.lockChain ?? Promise.resolve();
    let release!: () => void;
    const done = new Promise<void>((resolve) => { release = resolve; });
    session.lockChain = prev.then(() => done);
    await prev;
    try {
        return await fn();
    } finally {
        release();
    }
}
```

</details>

**依据 3 · 源码核查**：[src/loop/core.ts:431-460](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/loop/core.ts#L431-L460)

按配置分派压缩和回读。

<details>
<summary>查看原文（30行）</summary>

```text
export async function executeProxyToolAsync(
    toolName: string, args: Record<string, unknown>, ctx: LoopCtx,
    callId?: string, rawArguments?: string, signal?: AbortSignal,
): Promise<ProxyToolResult> {
    // #3400: async because it reads the spilled original from disk. The result
    // carries the image bytes; the loop attaches them as an ephemeral carrier
    // message (see proxyResults below).
    if (toolName === READ_ORIGINAL_IMAGE_TOOL_NAME) return executeReadOriginalImage(args, ctx.session, (lvl, msg) => ctx.log(`[${lvl}] ${msg}`));
    if (toolName !== "compress") return executeProxyTool(toolName, args, ctx, callId, rawArguments);
    const input = typeof rawArguments === "string" && rawArguments.length > 0 ? rawArguments : args;
    return applyConfiguredCompression(input, ctx, callId, signal);
}

export function executeProxyTool(
    toolName: string,
    args: Record<string, unknown>,
    ctx: LoopCtx,
    callId?: string,
    rawArguments?: string,
): ProxyToolResult {
    if (toolName === "compress") {
        // #1502: on strict-JSON.parse failure the caller passes the raw argument
        // string here — the kernel's lenient parser salvages fence/trailing-
        // comma/single-quote/truncated inputs that the degraded {} would drop.
        const input = typeof rawArguments === "string" && rawArguments.length > 0 ? rawArguments : args;
        return applyRanges(parseCompressInput(input, callId), ctx);
    }
    if (toolName === "decompress") {
        return resolveDecompress(args, ctx);
    }
```

</details>

**依据 4 · 源码核查**：[src/stream.ts:1365-1389](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/stream.ts#L1365-L1389)

折叠时尝试缓存两个视图。

<details>
<summary>查看原文（25行）</summary>

```text
        // Cache original content for newly-created blocks. At compress time the
        // source messages are still in ctx.messages (this round's view, before
        // the next processTurn folds them) — or in ctx.compressMessages when an
        // EMPTY-view fold recovered its source from the unified store (#3982);
        // collecting against [] would leave those blocks uncached for later
        // decompress/range-restore. Storing the text here lets decompress work
        // in later rounds where neither carries the originals.
        // Two views are cached so decompress can honor the `full` flag: `one`
        // (direct messages + nested child summaries) and `full` (all originals).
        // Leaf blocks have no active nested children, so both kernel paths
        // emit byte-identical text — persist a single copy in that case
        // (#401: the duplicate was 50% of blockContents bytes on disk).
        const contentSource = ctx.messages.length > 0 ? ctx.messages : (ctx.compressMessages ?? ctx.messages);
        for (const b of res.state.blocks) {
            if (beforeIds.has(b.blockId)) continue;
            const full = collectBlockContent(res.state, b, contentSource, { full: true });
            const one = collectBlockContent(res.state, b, contentSource, { full: false });
            if (full.count > 0 || one.count > 0) {
                const sameView = one.text === full.text && one.count === full.count;
                cacheBlockContent(ctx.session, b.blockId, {
                    one: sameView ? null : { text: one.text, count: one.count },
                    full: { text: full.text, count: full.count },
                });
            }
        }
```

</details>

**依据 5 · 源码核查**：[src/decompress-shared.ts:195-236](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/decompress-shared.ts#L195-L236)

归档失败，正常块尝试缓存、当前来源和摘要。

<details>
<summary>查看原文（42行）</summary>

```text
    const blockId = rawBlockId.trim();
    const block = ctx.core.decompress(blockId, ctx.session.state);
    if (!block) {
        // Removed-from-state blocks (the #2695 reap path, or a future archive
        // that drops blocks) still carry their preCompactionArchive entry: fail
        // with the real reason instead of the misleading "not found" — the
        // model got here by citing a ref from a summary it legitimately saw.
        const selfArchived = preCompactionArchiveOf(ctx.session)[blockId];
        if (selfArchived !== undefined) {
            return toolFail(`[decompress FAILED: block ${blockId} is an archived block (${selfArchived.reason}) — it was removed from live state along with its covered substrate and cannot be restored.]`);
        }
        return resolveDerivedDecompress(args, ctx, blockId);
    }
    const archived = preCompactionArchiveOf(ctx.session);
    if (archived[blockId] !== undefined) {
        return toolFail(`[decompress FAILED: block ${blockId} is a pre-compaction archive — its content was in the history BEFORE the client's native compaction and is no longer reachable (replaced by the client's compaction summary). decompress is unavailable for archived blocks.]`);
    }
    // #1712: blank/whitespace range fields mean "unspecified" — hosts and models
    // emit "" for optional fields, and treating that as a range request produced
    // an unsatisfiable retry loop (fill in a real range → refused in plugin mode).
    if (hasRangeArgs(args)) {
        return resolveDecompressRange(args, ctx, block);
    }

    const full = args.full === true || args.full === "true";
    const cached = ctx.session.blockContents.get(blockId);
    let body: string;
    let count: number;
    if (cached) {
        // Honor the full flag: `one` = direct msgs + nested child summaries,
        // `full` = all original messages. Returning the cached full text
        // unconditionally would break the default one-level semantics.
        // `one === null` means the two views were byte-identical at cache
        // time and deduped to one copy (#401).
        const view = full ? cached.full : (cached.one ?? cached.full);
        body = view.text;
        count = view.count;
    } else {
        const collected = collectBlockContent(ctx.session.state, block, ctx.compressMessages ?? ctx.messages, { full });
        body = collected.text || block.summary;
        count = collected.count;
    }
```

</details>

**依据 6 · 源码核查**：[src/decompress-shared.ts:246-259](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/decompress-shared.ts#L246-L259)

full 标记取入参，长输出可走文件。

<details>
<summary>查看原文（14行）</summary>

```text
    const header = `[Block ${blockId} content — ${count} item(s)${full ? ", full" : ""}]`;
    const toFileOut = toFilePointer(args, ctx, header, body);
    if (toFileOut !== null) return toFileOut;
    const safeBlockId = blockId.replace(/[^a-zA-Z0-9_-]/g, "-");
    const outPath = body.length > 10000 ? join(tmpdir(), `acp-decompress-${safeBlockId}-${Date.now()}.txt`) : null;
    if (outPath) {
        try {
            mkdirSync(dirname(outPath), { recursive: true });
            writeFileSync(outPath, body, { encoding: "utf8", mode: 0o600 });
            trackedTempFiles.push({ path: outPath, mtimeMs: Date.now() });
            reapTempFiles();
            return toolOk(`${header}\nContent (${body.length} chars) written to: ${outPath}\nUse the read tool to access it.`);
        } catch (e) {
            return exportFailureReceipt(outPath, e, body);
```

</details>

**依据 7 · 源码核查**：[src/plugin.ts:2471-2501](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/plugin.ts#L2471-L2501)

代理调度保存并区分 HTTP 和业务状态。

<details>
<summary>查看原文（31行）</summary>

```text
    releaseInFlight(session);
    if (result === undefined) return;
    // #760b: evidence-based plugin-mode flip. A successful MCP tool execution proves
    // this session's host owns the bili compression tools, so bind it to plugin mode
    // (sticky) — the next model request stops injecting the duplicate ephemeral wire
    // tools. Guarded: only flips a session with NO existing agent binding, never
    // overriding a pi/omp/opencode plugin or a launcher-registered agent.
    if (typeof session.metadata.pluginAgent !== "string" && tool !== retrieveToolName(session)) {
        session.metadata.pluginAgent = "mcp";
    }
    markDirty(session);
    deps.log("info", `[${session.id}] [plugin] tool ${tool} executed via plugin (routed by ${routedBy}, #1685) (${result.text.length} chars, outcome=${result.outcome ?? "n/a"}${result.reason ? `, reason=${result.reason}` : ""})`);
    // Same deep link on the /acp-cache display surfaces: clients wrap this text in
    // [acp-cache]/[/acp-cache] markers and strip it from model context by marker
    // (src/acp-panel.ts). The MCP acp_cache path shares this endpoint — one extra line
    // is harmless context and lets the model tell the user the link, too.
    let sentResult = result.text;
    if (tool === "acp_cache") {
        const wu = webSessionUrl(deps.webOrigin, session.id);
        if (wu !== undefined) sentResult = `Web UI: ${wu}\n\n${result.text}`;
    }
    // #1875: ok stays the transport/execution signal (200 = the tool ran); the
    // business effect rides additive fields so clients can distinguish an
    // accepted fold from a kernel refusal without parsing the receipt text.
    const body: Record<string, unknown> = { ok: true, tool, conversationId };
    if (result.outcome !== undefined) body.outcome = result.outcome;
    if (result.blocksCreated !== undefined) body.blocksCreated = result.blocksCreated;
    body.result = sentResult;
    if (retrievalExport !== undefined) body.retrievalExport = retrievalExport;
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(body));
```

</details>

**依据 8 · 源码核查**：[src/session.ts:1716-1725](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/session.ts#L1716-L1725)

调度保存及缓存的实际赋值。

<details>
<summary>查看原文（10行）</summary>

```text
/** Mark a session's state as changed so it is persisted on the next debounce.
 *  Call this after any mutation (processTurn, compress, decompress, orphan GC). */
export function markDirty(session: Session): void {
    session.revisionEpoch = (session.revisionEpoch ?? 0) + 1;
    getStore().scheduleSave(session);
}

/** Record original block content at compress time. */
export function cacheBlockContent(session: Session, blockId: string, content: BlockContent): void {
    session.blockContents.set(blockId, content);
```

</details>

**依据 9 · 源码核查**：[src/agent/shared.ts:387-406](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/agent/shared.ts#L387-L406)

HTTP 客户端收到取消信号并识别部分应用。

<details>
<summary>查看原文（20行）</summary>

```text
    if (nativeCaller && conversationId) body.nativeCaller = true;
    const { ok, status, json } = await fetchJson(`${proxyBase}/__bili/plugin/tool`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    }, effectiveToolTimeoutMs(proxyBase, tool), signal);
    const data = json as { ok?: boolean; result?: string; error?: string; outcome?: unknown; blocksCreated?: unknown } | undefined;
    if (!ok || !data?.ok) {
        throw new Error(`bili proxy tool ${tool} failed (${status}): ${data?.error ?? "unknown error"}`);
    }
    const outcome = parseToolOutcome(data.outcome);
    const blocksCreated = parseBlocksCreated(data.blocksCreated);
    let text = data.result ?? "";
    // #2752: a partial fold must stay distinguishable on lanes whose host shape
    // carries no structured state — the note rides the text. Applied/refused/
    // failure envelopes keep their exact historical bytes (no note).
    if (outcome === "partial") text += `\n${partialOutcomeNote(blocksCreated)}`;
    const out: ForwardedToolResult = { text, failed: outcome === "failure" || outcome === "refused" };
    if (outcome !== undefined) out.outcome = outcome;
    if (blocksCreated !== undefined) out.blocksCreated = blocksCreated;
```

</details>

**依据 10 · 源码核查**：[src/server/admin.ts:802-809](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/server/admin.ts#L802-L809)

admin 调用没有传入请求级 signal。

```text
    if (req.method === "POST" && req.url === "/__bili/plugin/tool") {
        try {
            const body = await readBody(req);
            const webOrigin = `http://${opts.host === "0.0.0.0" ? "localhost" : opts.host}:${req.socket?.localPort ?? opts.port}`;
            return await handlePluginTool(body.toString("utf8"), res, { core, config, log, webOrigin, inlineLane: opts.inlineLane === true });
        } catch (err) {
            res.writeHead(err instanceof BodyTooLargeError ? 413 : 400, { "content-type": "application/json" });
            res.end(JSON.stringify({ ok: false, error: String(err) }));
```

#### 缺口

- 代理突然退出或请求取消后的实际持久化状态未测
  **影响**：响应或客户端报错不足以确认恢复后的块状态
  **进一步探讨**：在工具响应前后分别断开或重启，再检查块号和原文

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 切换代理与宿主压缩各依赖什么，部署和退出怎样避免卡住预设？

**研究主题**：依赖、兼容与流程、工程质量与复用、缺陷与关键质疑

#### 完整回答

包清单要求 Node 20 及以上，导出指向 dist 文件，tsup 映射宿主和浏览器入口。作者要求安装 npm 产物，直接安装源 checkout 缺 dist。启动可附着既有代理或启动本机代理，关闭条件可令主入口提前返回。独立门控仍通过反射注册预设等待的服务，有助于避免停主入口时丢失服务。门控用内部配置钩子找嵌套压缩行并按主入口状态决定是否改写。主入口检查接口形状并给出警告，仍需核对实际配置是否经过钩子。代理可以拒绝识别出的压缩请求，但管不到宿主本地写下的检查点。只停主模块时，补丁里的顶层压缩配置和预设注入仍在。退出走同一 profile 渠道移除整个 bundle 并重启核对，避免单停独立服务而留下预设注入。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:95-105](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/package.json#L95-L105)

声明 Node 下限，包文件包含 dist 和补丁。

<details>
<summary>查看原文（11行）</summary>

```text
  "engines": {
    "node": ">=20"
  },
  "files": [
    "LICENSE",
    "README.md",
    "docs/configuration.md",
    "docs/configuration.zh-CN.md",
    "dist",
    "dsh.bundle.patch.yml",
    "hermes-plugin",
```

</details>

**依据 2 · 源码核查**：[tsup.config.ts:5-10](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/tsup.config.ts#L5-L10)

宿主入口和门控的构建映射。

```text
export default [
defineConfig({
    entry: ["src/index.ts", "src/mcp.ts", "src/claude-mcp-entry.ts", "src/claude-native-bootstrap.ts", "src/claude-subagent-hook.ts", "src/agent/pi.ts", "src/agent/pi-native.ts", "src/agent/omp.ts", "src/agent/omp-native.ts", "src/agent/opencode.ts", "src/agent/opencode-native.ts", "src/agent/dsh-acp.ts", "src/agent/dsh-native.ts", "src/agent/dsh-compaction-gate.ts", "src/kimi/native-mcp.ts", "src/kimi/bootstrap-hook.ts", "src/zcode/mcp-entry.ts", "src/zcode/bootstrap-hook.ts"],
    format: ["esm"],
    target: "node20",
    platform: "node",
```

**依据 3 · 源码核查**：[tsup.config.ts:77-96](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/tsup.config.ts#L77-L96)

浏览器构建使用宿主模块加载器与 React。

<details>
<summary>查看原文（20行）</summary>

```text
defineConfig({
    entry: { "agent/dsh-native-client": "src/agent/dsh-native-client.ts" },
    format: ["cjs"],
    target: "es2020",
    platform: "browser",
    external: ["react"],
    outDir: "dist",
    clean: false,
    splitting: false,
    shims: false,
    // Keep the .js name (not tsup's default .cjs): this is a browser classic
    // script, not a node CJS artifact, and package.json points at it as-is.
    outExtension: () => ({ js: ".js" }),
    banner: {
        // Trailing balance: `load({ id, factory: (require) => {` opens call +
        // object + arrow-body, so the footer closes all three.
        js: "window.__ModuleLoader__.load({ id: \"billion-context\", factory: (require) => {\nvar module = { exports: {} };\nvar exports = module.exports;\n",
    },
    footer: {
        js: "\nreturn module.exports;\n}});",
```

</details>

**依据 4 · 作者声明**：[README.md:198-203](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/README.md#L198-L203)

安装及退出渠道和 dist 限制。

```text
- **dsh:** `dsh plugin --profile <name> add billion-context` is the very
  command `bili plugin install dsh` drives per profile (npm form only; a git
  checkout has no published entry — pasting a GitHub address installs source
  without `dist/` and the bundle never loads) — same end state either way
  (pnpm into the profile, bundled patch layer mounted by dsh itself); remove
  through the same channel. See the dsh section below.
```

**依据 5 · 源码核查**：[src/agent/dsh-native.ts:209-215](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/agent/dsh-native.ts#L209-L215)

启动依次检查关闭、附着与启动。

```text
export function planNativeDsh(env: NodeJS.ProcessEnv): { mode: "off" | "attach" | "spawn"; attachOrigin?: string } {
    if (env.BILLION_CONTEXT_PLUGIN === "0" || env.BILI_NATIVE_DSH === "0") return { mode: "off" };
    if (env.BILI_PROVIDER_REWRITES !== undefined) return { mode: "off" };
    const attachOrigin = nativeAttachOrigin(env) ?? proxyEnvOrigin(env);
    if (attachOrigin !== undefined) return { mode: "attach", attachOrigin };
    return { mode: "spawn" };
}
```

**依据 6 · 源码核查**：[src/agent/dsh-native.ts:1894-1910](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/agent/dsh-native.ts#L1894-L1910)

关闭提前返回，其余才声明代理负责压缩。

<details>
<summary>查看原文（17行）</summary>

```text
export async function apply(ctx: PluginContext): Promise<void> {
    const plan = planNativeDsh(process.env);
    if (plan.mode === "off") return;
    // #3616: a fresh activation is a fresh origin world — in-flight recoveries
    // from the previous world are superseded here (their late landings must not
    // write this world's register/state). Off-mode arms nothing and bumps
    // nothing: invalidating recoveries on a kill-switch could strand the lane.
    originGen += 1;

    // #3354/#3662: declare that THIS process owns compression so the always-on
    // gate entry's load-time overlay (#3354) actually disables the web-profile
    // preset instances no patch layer can address by id (#1772/#2360). The
    // declaration — not the registration — is what's gated on plan.mode: a
    // kill-switched or disabled bili-native never declares, and the gate then
    // leaves every row stock while its service still lets the presets boot
    // (disabling the plugin must not brick session creation, #3662).
    declareDshCompactionActive();
```

</details>

**依据 7 · 源码核查**：[src/agent/dsh-compaction-disable.ts:183-207](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/agent/dsh-compaction-disable.ts#L183-L207)

挂钩处理嵌套配置并提供服务。

<details>
<summary>查看原文（25行）</summary>

```text
export function registerCompactionDisable(ctx: CompactionDisableHost): void {
    if (typeof ctx.on === "function") {
        // Preset entries must carry the gate: sibling imports may finish out of order.
        ctx.on("internal/config", function (this: MiddlewareSelf, _raw: unknown, next: () => unknown): unknown {
            const resolved = next();
            // #3662: honor the process verdict — without an active declaration
            // from bili-native every row passes through stock.
            if (!isDshCompactionActive()) return resolved;
            // #4147: match STRUCTURALLY, not by entry name — custom presets run
            // their compaction inside nested rows under their own entry, and a
            // name filter leaves exactly those armed. Rewrite only when the
            // tree actually nests a compaction row, so unrelated entries keep
            // their resolved config object identity.
            const config = (resolved ?? {}) as { plugins?: unknown };
            if (!Array.isArray(config.plugins)) return resolved;
            const compactionRows = countCompactionRows(config.plugins);
            if (compactionRows === 0) return resolved;
            const rawName = this?.entry?.options?.name;
            const entryName = typeof rawName === "string" ? rawName : "unnamed-entry";
            noteGateCoverage(entryName.slice(0, 120), compactionRows, entryName === DSH_AGENT_PRESET_PACKAGE);
            return { ...config, plugins: disableBasicCompaction(config.plugins) };
        }, { global: true });
    }
    // Publish only after the middleware is registered; the host owns both lifetimes.
    ctx.reflect?.provide?.(BILI_COMPACTION_DISABLE_SERVICE, Object.freeze({ owner: "billion-context", issue: "#3354" }));
```

</details>

**依据 8 · 源码核查**：[src/agent/dsh-native.ts:2845-2862](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/agent/dsh-native.ts#L2845-L2862)

接口探测缺口及本地检查点边界。

<details>
<summary>查看原文（18行）</summary>

```text
        const isWeb = bundles !== undefined && bundles.includes("@deepseek-ai/dsh-web-app");
        const gap = detectCompactionOverlayGap(ctx);
        webProfileWarned = true;
        if (gap !== null) {
            // #3806/#5686: overlay failed to latch -> boot-time alarm on ANY profile shape.
            persistClientEvent(`profile${isWeb ? " bundles include @deepseek-ai/dsh-web-app and" : bundles === undefined ? " shape could not be introspected (older dsh build) and" : " (non-web-app bundle list) and"} the load-time compaction-disable overlay (#3354) could not latch on this dsh build (${gap}) — dsh native auto-compaction is likely ARMED here. bili's wire-level refusal (#1729) refuses routed compaction calls but CANNOT stop dsh writing its checkpoint locally, so a landed checkpoint will destroy the compression substrate and surface later as a 'compression conflict' banner. Apply the #2474 full-snapshot override of preset-standard in your profile's cordis.patch.yml now (a partial snippet silently drops everything not restated; see docs/configuration.md)`);
        } else if (isWeb) {
            persistClientEvent("profile bundles include @deepseek-ai/dsh-web-app — its agent presets run their own compaction-basic in nested rows no patch layer can address by id (#1772/#2360); bili disables those preset rows at load time via a vendored overlay (deshark42/dsh-compaction-basic-disable, MIT, #3354; since #4147 the match is structural, covering custom presets too), so dsh native auto-compaction stays OFF in this profile (ACP compression unaffected). If you still see a dsh compaction checkpoint land on a newer/older dsh build — the overlay rides cordis' INTERNAL 'internal/config' hook and is version-sensitive — fall back to the #2474 full-snapshot override of preset-standard in your profile's cordis.patch.yml (a partial snippet silently drops everything not restated; see docs/configuration.md)." + gateCoverageSuffix());
        } else if (bundles !== undefined && !nonWebTraceLogged) {
            // #3651: the web-profile note above is the ONLY confirmation that
            // the #3354 overlay took effect, and it is scoped to dsh-web-app
            // bundles — every other profile boots silently even though
            // registerCompactionDisable ran unconditionally. Leave one durable
            // trace so a field log can tell "overlay registered" from "profile
            // shape unconfirmed".
            nonWebTraceLogged = true;
            persistClientEvent("profile bundles do not include @deepseek-ai/dsh-web-app — the #3354 load-time compaction-disable middleware is registered anyway (it rewrites any entry's nested compaction-basic/command-compact rows through cordis' version-sensitive internal 'internal/config' hook, covering custom presets as of #4147), but no web-profile disable note applies here; if dsh native auto-compaction still lands in this profile, apply the #2474 full-snapshot override of preset-standard (docs/configuration.md) — and note the #1729 wire guard now refuses such native compaction calls unconditionally (the #2028 allowDshCompaction opt-in was removed in #3651)." + gateCoverageSuffix());
        }
```

</details>

**依据 9 · 源码核查**：[dsh.bundle.patch.yml:14-39](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/dsh.bundle.patch.yml#L14-L39)

独立门控和顶层配置、预设注入共存。

<details>
<summary>查看原文（26行）</summary>

```text
# #3662: the gate lives in its OWN always-on entry, not in bili-native —
# disabling or kill-switching bili-native must leave the gate service alive so
# the presets fall back to STOCK dsh compaction instead of pending forever
# (the old wiring bricked session creation on exactly that path). Do NOT
# disable the bili-compaction-gate entry itself: it carries the service the
# presets wait on; to uninstall, remove billion-context from
# dsh.profile.bundles instead.
- insert:
    - id: bili-native
      name: billion-context
    - id: bili-compaction-gate
      name: billion-context/dsh-compaction-gate
- id: compaction-basic
  config:
    auto: false
# #3354: keep in sync with writeDshAcpPatch in src/launcher.ts — entry inject
# lists are REPLACED by patches, not concatenated; if a future dsh ships its
# own inject list on these entries, merge manually in BOTH layers.
- id: preset-standard
  inject: [biliBasicCompactionPolicy]
- id: preset-ptc
  inject: [biliBasicCompactionPolicy]
- id: preset-minimal
  inject: [biliBasicCompactionPolicy]
- id: preset-cordis
  inject: [biliBasicCompactionPolicy]
```

</details>

#### 缺口

- 目标宿主构建的内部钩子和预设解析时序未验证
  **影响**：接口存在仍不足以确定实际配置
  **进一步探讨**：同一脱敏 profile 对照加载、停主入口及卸载后的预设行为

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样判断这条链是否值得进入日常工作？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适合小范围试用的是反复追溯接口约束、有可隔离 DSH profile 和原始记录的开发者。先在副本里选一个已完成任务范围，标出两条必须回读的约束和一段失败输出，核对 /acp 的会话与块，再折叠与完整回读，最后用恢复事实通过原验收。用同模型、同仓库及输入对照原生压缩加人工记录。现金按每次通过验收的模型费用记录，分别记输入、输出、缓存读写和可能的独立摘要费用。人工单记安装、核对、取回、纠错和退出，另记磁盘增长和每轮延迟。作者的 1,500 题结果使用 v0.1.202 和 Pi Agent，不能代入本次 DSH。若看到最近会话回退、匿名转发、只剩摘要、宿主写入压缩检查点或原验收失败，停止扩大范围，保存记录并回到原 profile。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:65-68](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/README.md#L65-L68)

作者标出基准用较早版本和 Pi Agent。

```text

### 📊 Independent Third-Party Benchmarks

- **[1,500-Item Cross-Benchmark Evaluation (`LongMemEval-S` · `ContextBench` · `MemoryAgentBench`)](./benchmarks/third-party-1500/README.md)** ([中文版](./benchmarks/third-party-1500/README.zh-CN.md)) — head-to-head comparison of `billion-context` (`v0.1.202`) against `full` context and 3 RAG arms (`bm25`, `embedding`, `embedding-rerank`) with `DeepSeek V4.1 Flash`, `Qwen3-Embedding-8B`, `Qwen3-Reranker-4B`, and `Pi Agent`: **#1 on ContextBench** (`0.3097` Utilized F1, `-58.3%` cost vs `full`), **+16.6% over best RAG on LongMemEval-S** (`79.20%` vs `62.60%`, `-71.1%` independent-session cost vs `full`), and **100% survival on 1.48M-token MemoryAgentBench TTL** (`30×` steady-state compression where `full` fails `199/199`).
```

**依据 2 · 作者声明**：[README.md:382-387](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/README.md#L382-L387)

作者说明状态与缓存命令。

```text
**What does `/acp` show?** In clients with the native plugin (opencode, dsh,
hermes), `/acp` renders the ACP status panel of the current conversation
straight from
the proxy (session, blocks, compressible ranges, usage); before the first model
request it shows an idle notice instead. `/acp-cache [full]` prints the cache
report above.
```

**依据 3 · 源码核查**：[src/agent/dsh-native.ts:1636-1659](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/agent/dsh-native.ts#L1636-L1659)

命令暴露匿名转发和最近会话回退。

<details>
<summary>查看原文（24行）</summary>

```text
    // #3380 P3: wire-mode exposure — the proxy answers but the local tools are
    // down, so every model request rides bili WITHOUT identity headers
    // (anonymous zero-fold sessions, no compression). Say so in the panel the
    // user already looks at instead of letting it stay silent.
    const wireNote = !register.toolsReady && !register.dead
        ? `⚠️ bili tools NOT registered — model requests ride bili WITHOUT identity headers (wire mode: no compression, anonymous sessions). Last error: ${register.lastRegistrationError ?? "unknown"}. Restart dsh to restore; retries continue in the background.\n\n`
        : "";
    // #1677: the command executor hands us the invoking session via the invocation —
    // DSH never establishes the AsyncLocalStorage boundary on the command path, so
    // currentInitiator() is always empty here and relying on it made /acp silently
    // show ANOTHER (most-recently-active) session's panel. Prefer the invocation's
    // agent session id; fall back to ALS attribution, then the latest-session fallback.
    const sid = invocationSidOf(invocation) ?? sessionIdOf(ctx);
    let fellBackToLatest = false;
    let status: Record<string, unknown> | undefined = sid !== undefined ? await fetchStatus(base, sid) : undefined;
    if (status === undefined) {
        fellBackToLatest = true;
        status = await fetchStatusLatest(base);
    }
    const panel = status?.panel;
    if (status && typeof panel === "string" && panel.length > 0) {
        // A panel reached through the latest-fallback belongs to some OTHER session —
        // say so instead of presenting foreign data as the caller's own (#1677).
        return { kind: "success", text: `${wireNote}${fellBackToLatest ? `${latestSessionNote(status, sid)}\n\n` : ""}${panel}` };
```

</details>

**依据 4 · 源码核查**：[src/decompress-shared.ts:223-247](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/decompress-shared.ts#L223-L247)

回读结果同一标题可含摘要。

<details>
<summary>查看原文（25行）</summary>

```text
    if (cached) {
        // Honor the full flag: `one` = direct msgs + nested child summaries,
        // `full` = all original messages. Returning the cached full text
        // unconditionally would break the default one-level semantics.
        // `one === null` means the two views were byte-identical at cache
        // time and deduped to one copy (#401).
        const view = full ? cached.full : (cached.one ?? cached.full);
        body = view.text;
        count = view.count;
    } else {
        const collected = collectBlockContent(ctx.session.state, block, ctx.compressMessages ?? ctx.messages, { full });
        body = collected.text || block.summary;
        count = collected.count;
    }
    // #1336: retrieve-quality proxy — a whole-block restore where a precise
    // path existed (per-message coverage recorded AND CCR armed ⇒ range-restore
    // or targeted acp_retrieve would have sufficed) is the failure shape plan-
    // aware search steering exists to prevent.
    ctx.session.stats.wholeBlockRestores = (ctx.session.stats.wholeBlockRestores ?? 0) + 1;
    if (coveredRefSpan(ctx.session.state, block) !== null && ccrEnabled(ctx.session)) {
        ctx.session.stats.wholeBlockRestoresPreciseAvailable = (ctx.session.stats.wholeBlockRestoresPreciseAvailable ?? 0) + 1;
    }

    const header = `[Block ${blockId} content — ${count} item(s)${full ? ", full" : ""}]`;
    const toFileOut = toFilePointer(args, ctx, header, body);
```

</details>

**依据 5 · 源码核查**：[src/external-summary-compress.ts:37-46](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/external-summary-compress.ts#L37-L46)

独立摘要是可选路径。

<details>
<summary>查看原文（10行）</summary>

```text
export async function applyConfiguredCompression(input: unknown, ctx: RewriteCtx, callId?: string, signal?: AbortSignal): Promise<ProxyToolResult> {
    if (signal?.aborted) return compressResult("[Compression FAILED: cancelled. Nothing compressed.]", "refused", 0);
    // The plan rides the request Config rail (#833: ctx.config is the
    // session's effective Config — same cascade that produced the wire).
    let plan;
    try { plan = configuredSummaryPlan((ctx.config as ResolvedKernelConfig).externalSummary, ctx.session.id); }
    catch { return compressResult("[Compression FAILED: external summary configuration is invalid. Nothing compressed.]", "refused", 0); }
    if (!plan) return applyRanges(parseCompressInput(input, callId), ctx);
    const parsed = parseCompressInput(withOptionalSummaries(input), callId);
    if (parsed.ranges.length === 0) return applyRanges(parsed, ctx);
```

</details>

**依据 6 · 源码核查**：[src/agent/dsh-native.ts:2845-2851](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/agent/dsh-native.ts#L2845-L2851)

宿主检查点冲突是具体停止信号。

```text
        const isWeb = bundles !== undefined && bundles.includes("@deepseek-ai/dsh-web-app");
        const gap = detectCompactionOverlayGap(ctx);
        webProfileWarned = true;
        if (gap !== null) {
            // #3806/#5686: overlay failed to latch -> boot-time alarm on ANY profile shape.
            persistClientEvent(`profile${isWeb ? " bundles include @deepseek-ai/dsh-web-app and" : bundles === undefined ? " shape could not be introspected (older dsh build) and" : " (non-web-app bundle list) and"} the load-time compaction-disable overlay (#3354) could not latch on this dsh build (${gap}) — dsh native auto-compaction is likely ARMED here. bili's wire-level refusal (#1729) refuses routed compaction calls but CANNOT stop dsh writing its checkpoint locally, so a landed checkpoint will destroy the compression substrate and surface later as a 'compression conflict' banner. Apply the #2474 full-snapshot override of preset-standard in your profile's cordis.patch.yml now (a partial snippet silently drops everything not restated; see docs/configuration.md)`);
        } else if (isWeb) {
```

#### 缺口

- 当前固定版本尚无同任务的净费用、延迟和人工对照
  **影响**：无法判断长期采用是否划算
  **进一步探讨**：分别记录账单字段、合格任务数、人工时间和出错处理

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否用可辨识的恢复来源减少代理压缩造成的错误引用？

**研究主题**：新假设与验证

#### 完整回答

待验证假设是给回读增加机器可读的来源和覆盖状态，并在 DSH 工具结果中说明缓存原文、可见消息重建或仅摘要。三个分支目前可产生相同形式的标题，full 随请求参数显示。保留正文和条数，新增来源及可用消息覆盖信息。仅摘要时提示查询原始记录，避免把转述当作原文。用三个脱敏回放条件测试缓存完整、缓存缺失但消息可得、两者都缺失。对照现行输出和加标记的输出，保持正文、模型、任务和 token 预算一致，盲评把转述误引为原文的次数、正确恢复率和附加成本。如果误引未减少，或原文充分时正确率下降及新增人工超出节省，则停止推进。

#### 证据与依据

**依据 1 · 源码核查**：[src/decompress-shared.ts:219-247](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/decompress-shared.ts#L219-L247)

三种来源共用标题与导出入口。

<details>
<summary>查看原文（29行）</summary>

```text
    const full = args.full === true || args.full === "true";
    const cached = ctx.session.blockContents.get(blockId);
    let body: string;
    let count: number;
    if (cached) {
        // Honor the full flag: `one` = direct msgs + nested child summaries,
        // `full` = all original messages. Returning the cached full text
        // unconditionally would break the default one-level semantics.
        // `one === null` means the two views were byte-identical at cache
        // time and deduped to one copy (#401).
        const view = full ? cached.full : (cached.one ?? cached.full);
        body = view.text;
        count = view.count;
    } else {
        const collected = collectBlockContent(ctx.session.state, block, ctx.compressMessages ?? ctx.messages, { full });
        body = collected.text || block.summary;
        count = collected.count;
    }
    // #1336: retrieve-quality proxy — a whole-block restore where a precise
    // path existed (per-message coverage recorded AND CCR armed ⇒ range-restore
    // or targeted acp_retrieve would have sufficed) is the failure shape plan-
    // aware search steering exists to prevent.
    ctx.session.stats.wholeBlockRestores = (ctx.session.stats.wholeBlockRestores ?? 0) + 1;
    if (coveredRefSpan(ctx.session.state, block) !== null && ccrEnabled(ctx.session)) {
        ctx.session.stats.wholeBlockRestoresPreciseAvailable = (ctx.session.stats.wholeBlockRestoresPreciseAvailable ?? 0) + 1;
    }

    const header = `[Block ${blockId} content — ${count} item(s)${full ? ", full" : ""}]`;
    const toFileOut = toFilePointer(args, ctx, header, body);
```

</details>

**依据 2 · 源码核查**：[src/agent/dsh-native.ts:920-944](https://github.com/ranxianglei/billion-context/blob/c26c31ace45a88f42a2ed0ba23df2217d9c1ce99/src/agent/dsh-native.ts#L920-L944)

宿主工具结果以文本渲染，可以增加来源提示。

<details>
<summary>查看原文（25行）</summary>

```text
function toolDefinition(tool: ManifestTool): ToolDefinition {
    return {
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema,
        output: {
            schema: { type: "string" },
            render: (_args, value) => [{ type: "text", text: typeof value === "string" ? value : String(value ?? "") }],
        },
        execute: async (args, exec) => {
            // #983: read the LIVE base — a respawn after a proxy death moves
            // the origin, and a captured base would keep firing at a dead port.
            const base = register.base;
            if (base === undefined) {
                throw new Error("bili: proxy is down — recovery in progress, retry shortly");
            }
            const sid = exec.agent?.session?.id;
            if (typeof sid !== "string" || sid.length === 0) {
                throw new Error(`bili tool ${tool.name} requires an owning agent session`);
            }
            const out = await forwardTool(base, sid, tool.name, args, exec.signal, true);
            // #2204: dsh tool results are plain strings — a business failure
            // throws so the host renders an error, not success text.
            if (out.failed) throw new Error(out.text);
            return out.text;
```

</details>

#### 缺口

- 来源标记的效果未知
  **影响**：目前只能评价机制与试验设计
  **进一步探讨**：在三种材料条件做盲评并事先规定误引及成本阈值

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
