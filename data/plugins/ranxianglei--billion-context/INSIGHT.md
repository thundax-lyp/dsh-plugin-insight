# Billion Context

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[301e1a5](https://github.com/ranxianglei/billion-context/tree/301e1a5459a77d5578206927c8062a58381af642)

<!-- BEGIN META -->
[![GitHub ★ 7,589](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7%2C589&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ranxianglei/billion-context) [![npm 30d 3,582,530](https://img.shields.io/static/v1?label=npm+30d&message=3%2C582%2C530&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context) [![最新发布 2026-11-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context)
<!-- END META -->

> **功能**：面向长会话的上下文压缩工具，可按范围生成摘要、检索并回读内容。

> **亮点**：把宿主会话归属、代理按块折叠及回读接到同一个编码任务中。显式请求用途使部分辅助调用可按主机侧声明分流，工具注册随激活恢复，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：回读的内容来自原文缓存、现有历史还是摘要？当前标题不标来源，且宿主归档可以让整块不可恢复。文件写出和状态保存各有失败边界，见 [Q03](#research-q03) 与 [Q04](#research-q04)。

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
  - [Q01 · 按块折叠和回读解决哪类长任务？](#detail-section-11)
  - [Q02 · 如何把工具和模型请求绑到正确会话，旁路请求会改账吗？](#detail-section-12)
  - [Q03 · 回读能返回哪些材料，文件写出何时失效？](#detail-section-13)
  - [Q04 · 怎样加载、停用与恢复原生压缩？](#detail-section-14)
  - [Q05 · 如何判断一次试用值得继续？](#detail-section-15)
  - [Q06 · 显式标注回读来源是否会减少误引？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合用 DSH 推进长编码任务、经常回看早期接口约束或失败记录的开发者。可以用一段已结束的迁移来比较块级回读和人工记录，见 [Q01](#research-q01)。

以 DSH 原生压缩加人工决策记录为对照。只有少数约束时，短交接文件容易复核。频繁跨轮追溯不同已折叠片段时，块级查询才有明显操作增量，见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 范围折叠 | 按块缩减长任务可见历史 | 代理必须取得可用会话与有效范围 |
| 回读和搜索 | 定位早期约束及失败片段 | 归档可能不可恢复，摘要来源须核对 |
| /acp 和 /acp-cache | 查看压缩状态与缓存账目 | 应对应当前会话，费用核对以账单为准 |
| Web 会话上下文 | 查看折叠树与账本 | 需 Web slots、locale 和可用代理状态 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node 20+ 与含 dist 的包 | 必需 | 解析宿主、gate 和客户端导出 | 固定源码无法按发布导出直接加载 |
| DSH 的工具、命令与代理服务 | 主入口必需 | 注册工具和定位会话 | 工具注册或请求归属无法正常接通 |
| 内部配置钩子与反射提供服务 | 预设门控所需 | 等待 gate 后处理嵌套压缩 | 可能保留原生压缩，检查告警 |
| 代理、模型供应方及可写目录 | 执行所需 | 转发、压缩和保存回读材料 | 出现转发、回读或保存失败 |
| Web slots 与 locale | Web 界面所需 | 注册配置、上下文界面和本地化 | 宿主命令和 Web 面板需分别检查 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者复制脱敏 profile 和原验收 | 原生对照可重做相同任务 |
| 挂载 | 在副本装载 bundle，检查 /acp、门控和工具 | 会话归属准确并能注册工具 |
| 比较 | 折叠一个已完成阶段并回读两条原约束 | 原文匹配且旧验收仍过 |
| 退出 | 保存原始记录，移除整个 bundle 并重启 | 原生压缩与原测试可重新运行 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 代理、包和状态目录 | 复制配置，核对宿主与原任务 | 固定版本安装时间未知 |
| 持续 | 模型与摘要用量，缓存读写及磁盘 | 监控归属与原文保真 | 缓存变化与净费用未知 |
| 失败 | 重发请求及临时文件 | 排查代理、锁内状态和检查点 | 退出时状态是否已写需回查 |
| 退出 | 保留日志和导出文件 | 移除 bundle 重启并重新验收 | 旧历史与磁盘清理需另核 |

#### 效果

| 项目 | 源码支持 | 仍需验证 |
| --- | --- | --- |
| 折叠后回看 | 代理提供块级搜索及回读 | 原文覆盖及对验收迁移的影响 |
| 分流 | 工具归属和用途标记进入两条处理链 | 目标宿主兼容，旧轨迹连续性 |
| 计量 | 工具回执、账本及缓存入口可用于观察 | 同模型费用与人工是否下降 |

> **思考**：回读的内容来自原文缓存、现有历史还是摘要？当前标题不标来源，且宿主归档可以让整块不可恢复。文件写出和状态保存各有失败边界，见 [Q03](#research-q03) 与 [Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把宿主会话归属、代理按块折叠及回读接到同一个编码任务中。显式请求用途使部分辅助调用可按主机侧声明分流，工具注册随激活恢复，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

工具注册随宿主激活管理，迟到的清单不能落到已退出的激活。独立 gate 在主入口关闭时还可提供预设依赖。代理地址变化与宿主工具处置是不同事件，回读文件独占创建是另一条输出保障，见 [Q02](#research-q02) 至 [Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

回读的内容来自原文缓存、现有历史还是摘要？当前标题不标来源，且宿主归档可以让整块不可恢复。文件写出和状态保存各有失败边界，见 [Q03](#research-q03) 与 [Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

在独立脱敏 profile 用一项有原验收的任务试两个已知约束，先确认 /acp 对应会话，再折叠、回读并重跑测试。出现错归属、摘要回退或压缩冲突时，保存原记录并移除整套 bundle，见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 DSH 挂载、含用途标记的请求分流、按块压缩及回读。目标宿主的工具重载、原文保真、长期费用和回读标注收益仍待验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/agent/dsh-native.ts、src/plugin.ts、src/server/handle.ts、src/server/side-request.ts、src/decompress-shared.ts、src/session.ts、package.json、tsup.config.ts、dsh.bundle.patch.yml、src/agent/dsh-compaction-disable.ts、src/agent/dsh-native-client.ts、src/server/relay.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查 DSH 宿主、Web 客户端、代表性模型与工具转发、代理压缩门控和回读分支。其他宿主、所有协议、新发布包同源、后台升级器与跨进程恢复未逐一复核。
- 下一步：同一模型对照原生压缩与代理折叠，边运行两会话边触发重载和标题侧路，并在原文缺失与文件不可写条件下验证回执。另用三种材料条件评估来源标签，见 [Q05](#research-q05) 与 [Q06](#research-q06)。

**分析版本**

- **仓库**：[ranxianglei/billion-context](https://github.com/ranxianglei/billion-context)
- **版本号**：0.1.215（[固定提交 301e1a5](https://github.com/ranxianglei/billion-context/tree/301e1a5459a77d5578206927c8062a58381af642)）
- **版本日期**：2026-11-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

试验显式标注回读来源与覆盖状态能否减少错误引用。缓存完整、部分历史与仅有摘要各做一组盲测，并比较准确率、回读次数和合格任务总成本，见 [Q06](#research-q06)。

同一模型对照原生压缩与代理折叠，边运行两会话边触发重载和标题侧路，并在原文缺失与文件不可写条件下验证回执。另用三种材料条件评估来源标签，见 [Q05](#research-q05) 与 [Q06](#research-q06)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 213 | 28256 | — | — | 596848 |
| .ts | source | 457 | 210451 | 141039 | 60349 | — |
| .mjs | source | 42 | 8537 | 6038 | 2047 | — |
| .ts | test | 1521 | 413990 | 344847 | 47150 | — |
| .mjs | test | 5 | 863 | 644 | 205 | — |
| .md | test | 1 | 359 | — | — | 2707 |
| .mts | example | 2 | 85 | 71 | 16 | — |
| .mjs | example | 1 | 21 | 16 | 4 | — |
| .ts | example | 1 | 67 | 48 | 16 | — |
| .md | example | 1 | 34 | — | — | 545 |
| .js | source | 1 | 616 | 600 | 26 | — |

</details>

**活跃度**

[![Issue 未关闭 709](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=709&color=737b86&logo=github)](https://github.com/ranxianglei/billion-context/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1,740](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1%2C740&color=737b86&logo=github)](https://github.com/ranxianglei/billion-context/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z) [![近30天关闭 1,193](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1%2C193&color=737b86&logo=github)](https://github.com/ranxianglei/billion-context/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)



统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：对有长编码会话的 DSH 用户，代理压缩能否在保留验收材料的前提下持续运行，遇到错路由、宿主压缩或读取缺口时如何发现并退出？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 按块折叠和回读解决哪类长任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Billion Context 适用于会反复翻回早期接口约束、失败记录或测试输入的 DSH 长编码会话。以迁移一条 API 为例，先把已完成的兼容性检查折成摘要，遇到回归时按块定位早期错误，再用确切输入重跑原有验收。合格结果包括两个部分：任务仍通过原验收，回读约束与原记录逐字相符。

DSH 原生压缩配合人工决策文件也能延续工作。早期事实只有少数几条且容易维护时，短交接文件足够。这里额外提供了由会话中的模型申请范围折叠和按块回读的路径，可把查询已折叠内容留在同一任务中。DSH 层提供会话归属与工具接线，范围折叠和重组属代理和 acp-kernel。作者将可逆和缓存友好作为卖点。块已被宿主归档或只能回传摘要时，恢复原文的前提就不成立，见 Q03。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:73-92](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/README.md#L73-L92)

作者描述分层压缩、回读工具与缓存主张。

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

**依据 2 · 源码核查**：[src/agent/dsh-native.ts:911-935](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/agent/dsh-native.ts#L911-L935)

宿主工具取调用所属会话，并转发给代理执行。

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

**依据 3 · 源码核查**：[src/plugin.ts:2501-2526](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/plugin.ts#L2501-L2526)

代理用锁内快照和内核执行压缩工具。

<details>
<summary>查看原文（26行）</summary>

```text
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

#### 缺口

- 缺少同任务的人工作法比较。
  **影响**：高频回看对采用更有利，但实际省下的重查和人工仍未知。
  **进一步探讨**：回放同一已验收的迁移任务，对照决策文件和代理工具。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何把工具和模型请求绑到正确会话，旁路请求会改账吗？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具侧执行闭包每次取当前代理地址，并从 exec.agent.session.id 取归属。缺地址或所属会话时抛错，代理返回业务失败也抛错。激活会创建工具注册所有者，处置时清除该所有者就绪状态，恢复事件仅在当前且活动的所有者上运行。有 tools.get 时逐名检查注册，缺少该方法的宿主保留内部就绪依据。清单飞行结束时再核对激活所有者和代理地址，避免旧应答复活已退出的注册。名字已存在时可采纳，检查的是可见性，证据不足以证明同名定义等价。

模型侧在 llm/stream 的作用域采集会话标识和声明用途，只有工具已就绪且 attribution 成功时才加会话头。带有效 purpose 的辅助调用在代理端优先于内容启发式分流，代理的显式 main 代理标记也优先于其中的内容识别。普通 DSH dispatch 会写 conversation 哨兵；对启用声明版 persona 的请求，代理跳过旧 persona 分叉阶梯，历史分叉不会因新请求自动迁回。缺身份头或旧宿主缺声明时，不能以新分流规则推定旧客户端行为。辅助请求进入透传分支，跳过内核压缩并仍受体积检查，超限返回 413；这解释了它不应推进主会话的压缩状态。实际重载恢复和辅助任务过大后的宿主处理须验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/agent/dsh-native.ts:911-935](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/agent/dsh-native.ts#L911-L935)

执行始终读取当前代理地址，依赖工具调用的所属会话。

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

**依据 2 · 源码核查**：[src/agent/dsh-native.ts:975-1074](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/agent/dsh-native.ts#L975-L1074)

工具所有者管理激活、处置、可见性检查和迟到清单。

<details>
<summary>查看原文（100行）</summary>

```text

type ToolsOwner = {
    ctx: PluginContext;
    closed: boolean;
    restoring: boolean;
    definitions: Map<string, ToolDefinition>;
};
let toolsOwner: ToolsOwner | undefined;

function toolsAreReady(): boolean {
    const owner = toolsOwner;
    if (owner === undefined) return register.toolsReady;
    register.toolsReady = !owner.closed && owner.definitions.size > 0
        && (owner.ctx.tools.get === undefined ? register.toolsReady
            : [...owner.definitions.keys()].every((name) => owner.ctx.tools.get?.(name) !== undefined));
    return register.toolsReady;
}

function restoreTools(owner: ToolsOwner): void {
    if (owner !== toolsOwner || owner.closed || owner.restoring) return;
    owner.restoring = true;
    register.toolsReady = false;
    try {
        let adopted = 0;
        for (const [name, definition] of owner.definitions) {
            if (owner.ctx.tools.get?.(name) !== undefined) {
                adopted++;
                continue;
            }
            try {
                // The HOST owns the registration's lifetime: DSH's ToolsService
                // attaches it to the calling fiber via layers.effect(ctx, …), so
                // a restart or dispose removes it and tools/change lets the next
                // activation restore (#6702). Proxy death runs no effect — the
                // registration survives it (#3380).
                owner.ctx.tools.register(definition);
            } catch (err) {
                if (!errMessage(err).includes("already registered")) throw err;
                adopted++;
            }
        }
        if (adopted > 0 && !regAdoptLogged) {
            regAdoptLogged = true;
            persistClientEvent(`tool registration adopted ${adopted} pre-existing registration(s) from this process — continuing`);
        }
        register.toolsReady = owner.definitions.size > 0;
        if (!toolsAreReady()) throw new Error("bili: tool registrations did not become visible");
    } finally {
        owner.restoring = false;
    }
}

function beginToolsOwner(ctx: PluginContext): ToolsOwner {
    if (ctx.effect === undefined && toolsOwner?.ctx === ctx && !toolsOwner.closed) return toolsOwner;
    if (toolsOwner !== undefined) toolsOwner.closed = true;
    const owner: ToolsOwner = { ctx, closed: false, restoring: false, definitions: new Map() };
    toolsOwner = owner;
    register.toolsReady = false;
    register.pending = undefined;
    register.retryAt = 0;
    ctx.effect?.(() => () => {
        owner.closed = true;
        if (toolsOwner === owner) {
            register.toolsReady = false;
            register.pending = undefined;
        }
    }, "bili: tool registration lifetime");
    ctx.on?.("tools/change", () => {
        if (owner !== toolsOwner || owner.closed || owner.restoring || owner.definitions.size === 0) return;
        // A real Cordis teardown fires tools/change from the tool disposers
        // BEFORE the fiber's own disposers run: restoring while the fiber is
        // past its active window (states beyond LOADING=1/ACTIVE=2 — FAILED,
        // DISPOSED, UNLOADING) would resurrect registrations that teardown is
        // releasing. Hosts without a fiber expose no state and keep restoring.
        const fiberState = (owner.ctx as { fiber?: { state?: number } }).fiber?.state;
        if (fiberState !== undefined && fiberState !== 1 && fiberState !== 2) return;
        try {
            restoreTools(owner);
        } catch (err) {
            register.toolsReady = false;
            register.lastRegistrationError = errMessage(err);
            armRecoveryTimer();
        }
    });
    return owner;
}

async function registerTools(ctx: PluginContext): Promise<void> {
    const owner = toolsOwner;
    if (owner === undefined || owner.closed || owner.ctx !== ctx) return;
    if (register.pending !== undefined) return register.pending;
    const base = register.base;
    if (toolsAreReady() || base === undefined) return;
    const pending = (async () => {
        const tools = await fetchManifest(base, "anthropic");
        if (owner !== toolsOwner || owner.closed || register.base !== base) return;
        owner.definitions = new Map(tools.map((tool) => [tool.name, toolDefinition(tool)]));
        restoreTools(owner);
        register.failStreak = 0;
        register.lastRegistrationError = undefined;
```

</details>

**依据 3 · 源码核查**：[src/agent/dsh-native.ts:2086-2099](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/agent/dsh-native.ts#L2086-L2099)

llm/stream 捕获会话及受字符约束的用途。

<details>
<summary>查看原文（14行）</summary>

```text
        ctx.inject(["llm"], () => {
            onEvent("llm/stream", (options: { sessionId?: unknown; messages?: unknown; purpose?: unknown }, next: () => AsyncIterable<unknown>) => {
                const sid = typeof options?.sessionId === "string" && options.sessionId.length > 0 ? options.sessionId : undefined;
                if (sid === undefined) return next();
                // #4491: capture the host message ids riding the same options
                // — undefined (all-or-nothing) when any message lacks a usable
                // id, so sidecar shapes degrade to id-less turns.
                // #6880: capture the dispatch's declared purpose the same way
                // (dsh sets it on every auxiliary call; conversation leaves it
                // unset). Absent/odd values simply stay off the turn.
                const purpose = typeof options?.purpose === "string" && options.purpose.length > 0 && options.purpose.length <= 64 && /^[\x21-\x7e]+$/.test(options.purpose) ? options.purpose : undefined;
                const scope: LlmDispatchScope = { sid, msgIds: hostMsgIdsOf(options?.messages), purpose };
                // #5403/#5418 v3: feed the per-slot id sequence into the
                // watermark channel (the fetch chokepoint emits count +
```

</details>

**依据 4 · 源码核查**：[src/agent/dsh-native.ts:2600-2623](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/agent/dsh-native.ts#L2600-L2623)

就绪和归属通过才写头，普通会话使用哨兵。

<details>
<summary>查看原文（24行）</summary>

```text
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
        // #6880: the declared purpose rides its own header (ASCII-gated like
        // the model header below — an odd value degrades to no header, and
        // the server falls back to its content heuristics). Post-#6883 this is
        // stamped on EVERY dispatch: the real dsh purpose for auxiliary
        // calls, or the "conversation" sentinel for main turns (dsh leaves
        // GenerateOptions.purpose unset for ordinary conversation). PRESENCE
        // is therefore the v2 declaration — the server routes declared aux by
        // the header alone and keys declared main traffic on the raw session
        // id (no persona-order ladder); the sentinel itself is not a side.
        const declaredPurpose = attr.purpose ?? "conversation";
        const purposeHeader = asciiHeaderValue(declaredPurpose);
        if (purposeHeader !== undefined) headers["x-bili-plugin-purpose"] = purposeHeader;
```

</details>

**依据 5 · 源码核查**：[src/server/handle.ts:1307-1315](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/server/handle.ts#L1307-L1315)

声明版 DSH persona 跳过旧分叉，既有子轨迹未自动迁移。

```text
        // UUID per session and never recycles an id (SESSION_ALREADY_EXISTS
        // in its store), so the raw session id IS the complete identity and
        // the main turn must key it verbatim. All auxiliary traffic from
        // such a plugin is declared side above and never reaches the
        // persona branches below. Pre-#6883 plugins stamp no header at all,
        // so they keep the ladder byte-for-byte (rollout safety). The
        // already-persisted |sub:<fp> lanes of old traffic become orphan
        // history: new declared traffic simply never resolves onto them.
        const dshDeclaredPersona = dshPersona && rawDeclaredPurpose !== undefined;
```

**依据 6 · 源码核查**：[src/server/handle.ts:1394-1407](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/server/handle.ts#L1394-L1407)

代表性协议分支在声明模式下不跑旧 persona 分叉。

<details>
<summary>查看原文（14行）</summary>

```text
            // empty systemInstruction is non-anchoring (kernel anchor
            // semantics): ride the verbatim id — never route empty-tag
            // traffic through the order resolver.
            ? (!dshDeclaredPersona && dshPersona && !sideRequestLike
                ? (personaSystemText === ""
                      ? (googleIdentity?.value ?? googleSignal)
                      : personaConversationOrder(
                          googleIdentity?.value ?? googleSignal,
                          (parsed as GoogleRequestBody).contents,
                          personaSystemText,
                          pluginReportedModel(req.headers),
                          undefined,
                          undefined,
                          onSessionResolveEvent,
```

</details>

**依据 7 · 源码核查**：[src/server/side-request.ts:204-221](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/server/side-request.ts#L204-L221)

显式代理意图与声明用途优先于内容匹配。

<details>
<summary>查看原文（18行）</summary>

```text
export function isSideRequest(parsed: unknown, requestAgent?: string, purpose?: string): boolean {
    if (!parsed || typeof parsed !== "object") return false;
    if (requestAgent !== undefined && SIDE_REQUEST_AGENTS.has(requestAgent)) return true;
    if (requestAgent === "main") return false;
    // #6880: the DECLARED purpose outranks every body heuristic. It arrives
    // pre-gated (plugin.ts only surfaces it behind the x-bili-plugin marker),
    // so a non-empty value is the plugin telling us — from the dispatch
    // options it itself controls — that this call is auxiliary: route it
    // through the #388 verbatim passthrough without content matching.
    if (purpose !== undefined && purpose.length > 0) return true;
    const p = parsed as Record<string, unknown>;
    // #2500: BEFORE the #546 rule — a server-tool-only utility call carries
    // non-empty tools but is not an agent turn. Routed through the #388 side
    // passthrough so its usage (often far above its own tiny context) can
    // never re-anchor the main session's nudge baseline (#1595) and nothing
    // gets injected into it. Explicit host intent above still outranks this.
    if (isServerToolUtilityCall(p)) return true;
    if (Array.isArray(p.tools) && p.tools.length > 0) return false;
```

</details>

**依据 8 · 源码核查**：[src/server/handle.ts:2698-2734](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/server/handle.ts#L2698-L2734)

辅助请求过大先拒绝，否则透传且不运行压缩内核。

<details>
<summary>查看原文（37行）</summary>

```text
        const sideLane = resolveSideLane({ countTokens, responsesCompact, protocol, stripApplied: demotedSide, sideIntent, requestAgent, sideLabel: declaredPurpose !== undefined ? `declared purpose=${declaredPurpose} (#6880)` : serverToolUtility ? "server-tool utility call (#2500)" : structuredOutputUtility ? "structured-output utility call (#5073)" : audioOutputUtility ? "audio-output utility call (#6636)" : dshTitleSidecar ? "dsh title-gen sidecar (#2503)" : dshReviewSidecar ? "dsh auto-review sidecar (#4438)" : dshSingleShotSidecar ? "dsh single-shot sidecar (#5656)" : ccTitleSidecar ? "claude-code title-gen sidecar (#5135)" : undefined });
        if (sideLane.lane === "side") {
            // #554: the passthrough below skips EVERY input-side guard by design
            // (#388) — a full-history side request over the window is a
            // guaranteed upstream 400 (and title-gen/probe clients re-issue it,
            // hammering the upstream). Gate on the raw body estimate and fail
            // fast locally instead of forwarding (#301 precedent).
            const reqModel = requestModel;
            // #1110: only a genuine overflow arm bounds the guard — never the
            // nudge baseline (lastInputTokens). A healthy compressed host turn
            // keeps that baseline low, which permanently 413'd an unrelated
            // in-process caller's fixed-size request even though it fit the
            // model's real window. overflowArmTokens is set ONLY by an upstream
            // context-overflow 400 and cleared by the next real usage report.
            const armedForGuard = typeof session.stats.overflowArmTokens === "number" && session.stats.overflowArmTokens > 0 ? session.stats.overflowArmTokens : 0;
            const guard = sideRequestGuard(parsed, protocol, reqConfig.modelContextLimit, imageBillingFor(opts, route?.rewrittenUrl ?? upstreamOrigin), imageTokenCapFor(opts, route?.rewrittenUrl ?? upstreamOrigin), headroomCap, armedForGuard, imageReserveFor(session, protocol, parsed, opts, route?.rewrittenUrl ?? upstreamOrigin), shouldReserveOutputHeadroom(protocol, normalizeUpstreamOrigin(route?.rewrittenUrl ?? upstreamOrigin), requestModel));
            if (guard.blocked) {
                log("warn", `[${session.id}] side request (~${guard.estimate} tokens) ≥ effective window ${guard.limit} (model=${reqModel ?? "?"}) — NOT forwarded: guaranteed upstream 400 (side requests bypass preflight by design, #388)`);
                if (!res.headersSent && !res.writableEnded && !res.destroyed) {
                    res.writeHead(413, { "content-type": "application/json" });
                    res.end(JSON.stringify({
                        error: {
                            type: "server_error",
                            code: "side_request_payload_too_large",
                            message: `side request payload ~${guard.estimate} tokens reaches the effective context window ${guard.limit} (model=${reqModel ?? "unknown"}); NOT forwarded — side requests bypass compression by design (#388). Shrink the conversation or raise the model's context window.`,
                            retryable: false,
                        },
                    }));
                }
                logRequestCost(log, session.id, inboundMsgs, inboundBytes, reqT0);
                return;
            }
            const sideReason = sideLane.reason;
            log("info", `[${session.id}] side request (${sideReason}) → passthrough + tag strip only, kernel state untouched`);
            // #1897: a demoted request was mutated (tools stripped) — re-serialize
            // the parsed body so the leak is actually gone from the wire.
            let sideBody = scrubAnthropicPck(protocol, demotedSide ? Buffer.from(JSON.stringify(parsed)) : bodyBuffer, log);
```

</details>

#### 缺口

- 未在目标宿主触发热重载、同名工具和并发会话。
  **影响**：真实工具恢复与旧轨迹连续性待核实。
  **进一步探讨**：在隔离 profile 中交错运行两会话和标题请求，重载后查工具归属和状态，再刻意发送超大的辅助请求。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 回读能返回哪些材料，文件写出何时失效？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

decompress 先认块和归档状态。前宿主压缩归档判定命中时明确失败。有效块优先走缓存，可取含子摘要的一层内容或请求完整原始消息。无缓存则按当前原始历史收集，连可收集的文本都没有时退回块摘要。三者经过同一种块标题，full 只表达选择，并未为摘要回退声明来源。搜索可补扫可取得的折叠原文但异常降级，搜索为空也无法证明旧讨论没有该事实。

长文本超过 10000 字符的自动写出使用随机文件名及 wx 独占创建，权限为 0600，降低了同名覆盖风险。写入失败走专门回执，返回文件指针后还需要读取工具能访问代理所在文件系统。搜索标记计算按原字符位置还原，避免小写展开导致高亮切错。两处变化改善表示和输出的可靠性，回读能否取得任务所需原文依然取决于材料落点。

代理在会话锁内读取消息快照并调用工具。这个边界能避免本进程中工具和请求看到不一致的快照。返回路径调用 markDirty，实际桥接到 scheduleSave；因此不能从工具回执推断异常退出后恢复了同一状态。

#### 证据与依据

**依据 1 · 源码核查**：[src/decompress-shared.ts:193-236](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/decompress-shared.ts#L193-L236)

归档失效与缓存、现有原文、摘要的回退关系。

<details>
<summary>查看原文（44行）</summary>

```text
    if (typeof rawBlockId !== "string" || rawBlockId.length === 0) {
        return toolFail("[decompress FAILED: blockId is required]");
    }
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
```

</details>

**依据 2 · 源码核查**：[src/decompress-shared.ts:247-261](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/decompress-shared.ts#L247-L261)

共用回读标题，长文本随机命名独占写出。

<details>
<summary>查看原文（15行）</summary>

```text
    const header = `[Block ${blockId} content — ${count} item(s)${full ? ", full" : ""}]`;
    const toFileOut = toFilePointer(args, ctx, header, body);
    if (toFileOut !== null) return toFileOut;
    const safeBlockId = blockId.replace(/[^a-zA-Z0-9_-]/g, "-");
    const outPath = body.length > 10000 ? join(tmpdir(), `acp-decompress-${safeBlockId}-${randomUUID()}.txt`) : null;
    if (outPath) {
        try {
            mkdirSync(dirname(outPath), { recursive: true });
            writeFileSync(outPath, body, { encoding: "utf8", mode: 0o600, flag: "wx" });
            trackedTempFiles.push({ path: outPath, mtimeMs: Date.now() });
            reapTempFiles();
            return toolOk(`${header}\nContent (${body.length} chars) written to: ${outPath}\nUse the read tool to access it.`);
        } catch (e) {
            return exportFailureReceipt(outPath, e, body);
        }
```

</details>

**依据 3 · 源码核查**：[src/decompress-shared.ts:737-777](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/decompress-shared.ts#L737-L777)

小写字符可能扩展，映回原位置后做高亮。

<details>
<summary>查看原文（41行）</summary>

```text
// Search uses the whole-string lowercase form (including contextual final
// sigma), but its offsets cannot slice the original: e.g. İ becomes i + ◌̇.
// Walk code point widths to map a matched span back without splitting either
// an expanded lowercase character or an original surrogate pair.
function originalLowercaseSpan(text: string, lowerStart: number, lowerEnd: number): { start: number; end: number } {
    let lowerOffset = 0;
    let start = 0;
    let end = 0;
    for (const char of text) {
        const nextLower = lowerOffset + char.toLowerCase().length;
        if (nextLower <= lowerStart) start += char.length;
        end += char.length;
        if (nextLower >= lowerEnd) break;
        lowerOffset = nextLower;
    }
    return { start, end };
}

// Most distinctive query term present in this block's summary = fewest
// containing blocks, tie → earliest occurrence. Null when no term is in the
// summary body (hit then lives in the topic, already shown in the header line).
function pickAnchorTerm(summary: string, terms: string[], freq: Map<string, number>): { term: string; index: number } | null {
    const lower = summary.toLowerCase();
    let best: { term: string; index: number; freq: number } | null = null;
    for (const t of terms) {
        const tl = t.toLowerCase();
        if (!tl) continue;
        const i = lower.indexOf(tl);
        if (i === -1) continue;
        const f = freq.get(tl) ?? 0;
        if (!best || f < best.freq || (f === best.freq && i < best.index)) best = { term: tl, index: i, freq: f };
    }
    if (!best) return null;
    const span = originalLowercaseSpan(summary, best.index, best.index + best.term.length);
    return { term: best.term, index: span.start };
}

function markFirstMatch(text: string, needle: string): string {
    const idx = text.toLowerCase().indexOf(needle);
    if (idx === -1) return text;
    const { start, end } = originalLowercaseSpan(text, idx, idx + needle.length);
```

</details>

**依据 4 · 源码核查**：[src/decompress-shared.ts:888-923](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/decompress-shared.ts#L888-L923)

可用时追加原文命中，扫描异常不致使搜索失败。

<details>
<summary>查看原文（36行）</summary>

```text
    // via their summary are not repeated. Exceptions degrade to nothing:
    // original-text hits are strictly additive.
    const origHits: Array<{ r: SearchResult; spanText: string | null; count: number }> = [];
    if (originals) {
        try {
            const entries = originals().filter((e) => blockById.has(e.blockId) && e.text.length > 0);
            if (entries.length > 0) {
                const docs = entries.map((e): SearchDoc => ({
                    kind: "block",
                    ref: `${e.blockId}!orig`,
                    text: e.text,
                    title: `original content of ${e.blockId}`,
                    blockId: e.blockId,
                    tier: blockById.get(e.blockId)?.tier ?? 1,
                }));
                // #4154: skip blocks whose summary already earned a line above —
                // the original-text corpus only ADDS hits, never repeats them.
                const already = new Set(blocks.map((b) => b.blockId));
                for (const r of searchBlocks(docs, query, { limit: entries.length, algorithm: "substring", minScore: 1e-9 })) {
                    if (!r.blockId || already.has(r.blockId)) continue;
                    const block = blockById.get(r.blockId);
                    if (!block) continue;
                    const span = coveredRefSpan(state, block);
                    origHits.push({ r, spanText: span?.text ?? null, count: span?.count ?? 0 });
                    if (origHits.length >= limit) break;
                }
            }
        } catch {
            // originals are best-effort; never fail the search
        }
    }
    if (blocks.length === 0 && origHits.length === 0) {
        // #1875: an empty result is a valid answer to a query, not a failure.
        if (state.blocks.length === 0) return toolOk(`[No compressed blocks exist yet${scope} — nothing to search.]`);
        const origNote = originals ? " + the folded original text" : "";
        return toolOk(`[No blocks matched "${query}" among ${state.blocks.length} block(s)${scope}. Scope = compressed topics/summaries (active + folded-away)${origNote} — NOT visible messages or other sessions; absence here ≠ never-discussed.]`);
```

</details>

**依据 5 · 源码核查**：[src/plugin.ts:2485-2526](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/plugin.ts#L2485-L2526)

会话锁内读取快照并执行，修订号冲突返回 409。

<details>
<summary>查看原文（42行）</summary>

```text
    acquireInFlight(session);
    let result: ProxyToolResult | undefined;
    let retrievalExport: RetrievalExport | undefined;
    try {
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

**依据 6 · 源码核查**：[src/plugin.ts:2558-2578](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/plugin.ts#L2558-L2578)

将状态标为待写并构造返回。

<details>
<summary>查看原文（21行）</summary>

```text
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
```

</details>

**依据 7 · 源码核查**：[src/session.ts:1753-1759](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/session.ts#L1753-L1759)

markDirty 交给存储器调度保存。

```text
/** Mark a session's state as changed so it is persisted on the next debounce.
 *  Call this after any mutation (processTurn, compress, decompress, orphan GC). */
export function markDirty(session: Session): void {
    session.revisionEpoch = (session.revisionEpoch ?? 0) + 1;
    getStore().scheduleSave(session);
}

```

#### 缺口

- 未知代理与宿主是否共享可读文件系统，以及异常退出的落盘窗口。
  **影响**：长块取回和失败恢复不能承诺成功。
  **进一步探讨**：设置长块和不可写目录对照，然后在拿到工具回执后立即重启隔离代理检查状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样加载、停用与恢复原生压缩？

**研究主题**：依赖、兼容与流程、工程质量与复用、缺陷与关键质疑

#### 完整回答

profile 的包声明经 bundle 补丁挂载主入口和独立 gate。包声明 Node 20 及以上并将 dist 和补丁纳入发布。tsup 分别构建主入口、gate 和 Web 客户端。宿主侧对 tools、commands 和 agents 注入有依赖，Web 界面另需 slots 和 locale。主入口在可用代理地址存在时连接它，否则自启代理。禁用开关或已设置提供者重写时提前退出。

主入口激活后声明自己接管压缩。独立 gate 先装 internal/config 中间件再提供预设等待的服务，并只在接管已声明且发现嵌套压缩行时改写。补丁仍有一条顶层 compaction-basic auto:false。缺少内部钩子或服务提供能力会触发门控缺口。代理拒绝某些线上原生压缩请求，也无法撤销宿主已写的本地检查点。仅关主入口时，独立 gate 仍有单独职责，整套恢复应移除 bundle 并重启后检查 profile 的压缩配置。补丁还为 DeepSeek 两条 LLM 行写入含 MALFORMED_RESPONSE 的重试规则，替换型规则需要与宿主原配置核对，避免误认为保留了本地的所有设置。

隔离 profile 先检查 /acp 的当前会话归属和门控日志。遇到压缩冲突、预设停滞或读回原文缺失后保留原始任务记录，移除 bundle 并用原 profile 的基线重做验收。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:95-105](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/package.json#L95-L105)

宿主运行版本和包内发布文件。

<details>
<summary>查看原文（11行）</summary>

```text
  },
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
```

</details>

**依据 2 · 源码核查**：[package.json:7-15](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/package.json#L7-L15)

宿主、gate、Web 的分立导出。

```text
  "exports": {
    ".": "./dist/agent/dsh-native.js",
    "./server": "./dist/agent/opencode-native.js",
    "./dsh": "./dist/agent/dsh-native.js",
    "./dsh-compaction-gate": "./dist/agent/dsh-compaction-gate.js",
    "./package.json": "./package.json",
    "./dsh/package.json": "./package.json",
    "./client": "./dist/agent/dsh-native-client.js"
  },
```

**依据 3 · 源码核查**：[tsup.config.ts:7-7](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/tsup.config.ts#L7-L7)

主入口与 gate 的构建目标。

```text
    entry: ["src/index.ts", "src/mcp.ts", "src/claude-mcp-entry.ts", "src/claude-native-bootstrap.ts", "src/claude-subagent-hook.ts", "src/agent/pi.ts", "src/agent/pi-native.ts", "src/agent/omp.ts", "src/agent/omp-native.ts", "src/agent/opencode.ts", "src/agent/opencode-native.ts", "src/agent/dsh-acp.ts", "src/agent/dsh-native.ts", "src/agent/dsh-compaction-gate.ts", "src/kimi/native-mcp.ts", "src/kimi/bootstrap-hook.ts", "src/zcode/mcp-entry.ts", "src/zcode/bootstrap-hook.ts"],
```

**依据 4 · 源码核查**：[tsup.config.ts:77-89](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/tsup.config.ts#L77-L89)

Web 客户端独立打包。

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[dsh.bundle.patch.yml:14-55](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/dsh.bundle.patch.yml#L14-L55)

分立 gate、预设注入、顶层压缩与提供者重试规则。

<details>
<summary>查看原文（42行）</summary>

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
# #2605: DSH's default retry whitelist omits MALFORMED_RESPONSE, so one
# sampling flake that breaks a tool-call argument JSON kills the whole turn
# unretried. A patch replaces the targeted row's WHOLE config (no deep
# merge), so each row restates every default code plus MALFORMED_RESPONSE —
# dropping any default code silently removes its retries. Rows absent on a
# given DSH version are skipped with a warning, never a boot failure.
- id: llm-deepseek
  config:
    retryPolicy:
      mode: normal
      retryableCodes: [EMPTY_RESPONSE, RATE_LIMIT, SERVER, TIMEOUT, TRANSPORT, MALFORMED_RESPONSE]
- id: llm-deepseek-account
  config:
    retryPolicy:
      mode: normal
      retryableCodes: [EMPTY_RESPONSE, RATE_LIMIT, SERVER, TIMEOUT, TRANSPORT, MALFORMED_RESPONSE]
```

</details>

**依据 6 · 源码核查**：[src/agent/dsh-native.ts:209-215](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/agent/dsh-native.ts#L209-L215)

关闭、附着及自启分支。

```text
export function planNativeDsh(env: NodeJS.ProcessEnv): { mode: "off" | "attach" | "spawn"; attachOrigin?: string } {
    if (env.BILLION_CONTEXT_PLUGIN === "0" || env.BILI_NATIVE_DSH === "0") return { mode: "off" };
    if (env.BILI_PROVIDER_REWRITES !== undefined) return { mode: "off" };
    const attachOrigin = nativeAttachOrigin(env) ?? proxyEnvOrigin(env);
    if (attachOrigin !== undefined) return { mode: "attach", attachOrigin };
    return { mode: "spawn" };
}
```

**依据 7 · 源码核查**：[src/agent/dsh-native.ts:1958-1976](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/agent/dsh-native.ts#L1958-L1976)

关闭分支先返回，激活主入口后才声明压缩接管。

<details>
<summary>查看原文（19行）</summary>

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

    const owner = beginToolsOwner(ctx);
```

</details>

**依据 8 · 源码核查**：[src/agent/dsh-compaction-disable.ts:183-217](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/agent/dsh-compaction-disable.ts#L183-L217)

按结构安装覆盖层并提供 gate，含能力缺口判定。

<details>
<summary>查看原文（35行）</summary>

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
}

type CompactionOverlayGap = "no-config-hook" | "no-service-provide";

/** Why the #3354 load-time overlay cannot latch on this host (null = latched).
 *  Mirrors registerCompactionDisable's own capability checks: without `on` the
 *  internal/config transform never installs, and without reflect.provide the
 *  preset inject latch never opens — either way dsh native basic compaction
 *  stays ARMED. Exposed so the caller can turn the SILENT fail-safe degradation
 *  into a loud boot-time alarm (#3806) instead of letting the user discover an
```

</details>

**依据 9 · 源码核查**：[src/agent/dsh-native.ts:2907-2921](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/agent/dsh-native.ts#L2907-L2921)

门控告警说明本地检查点和宿主兼容限制。

<details>
<summary>查看原文（15行）</summary>

```text
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

**依据 10 · 源码核查**：[src/agent/dsh-native-client.ts:1145-1168](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/agent/dsh-native-client.ts#L1145-L1168)

客户端注册设置槽、配置槽和会话视图。

<details>
<summary>查看原文（24行）</summary>

```text
        "settings.section",
        () => ctx.slots.register({ name: "settings.section", id: "bili", order: 100, label: () => t("nav"), locale: NS }, panel(true)),
    );
    ctx.slots.inject(
        "plugins.bundle.config",
        () => ctx.slots.register({ name: "plugins.bundle.config", key: "billion-context", locale: NS }, panel(false)),
    );
    // #3862: session Context tab. order 30 sits right of the built-in chat (0)
    // and trajectory (10) tabs and right of dsh-context's Context tab (20)
    // when both are installed. Deferred injection is fail-open on hosts whose
    // build lacks the slot. #4237: dsh.contextTab=false (web settings / config
    // file / BILI_DSH_CONTEXT_TAB=0) skips this slot entirely — hiding removes
    // only the top-bar entry; the ledger stays reachable through the settings
    // section, the plugin bundle config face, the Web UI and /acp. A custom
    // label (dsh.contextTabLabel) replaces the built-in name where another
    // plugin occupies it.
    const ctxGate = readCtxTabFace();
    if (!ctxGate.hidden) {
        ctx.slots.inject(
            "conversation.view",
            () => ctx.slots.register({ name: "conversation.view", id: "bili-context", order: 30, label: () => ctxGate.label ?? t("tab_ctx"), locale: NS }, contextPanel()),
        );
    }
    // #4254 defect ②: frame-level upstream-unavailable pill. Deferred injection
```

</details>

#### 缺口

- 固定提交与注册表下载包未核实逐字对应，宿主内部钩子与用户补丁联动未运行。
  **影响**：源码支持挂载意图和实现，尚不足以建议直接进入日常 profile。
  **进一步探讨**：固定实际包散列和宿主版本，分别试新装、旧 profile 和整套卸载。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何判断一次试用值得继续？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适合先在脱敏的副本中回放一个早期约束确需回读且已有测试标准的任务。用相同模型、预先记录的两条原文约束与相同验收结果对照原生压缩加人工记录。记录初次配置与周边权限、各轮 token、缓存读写、摘要调用、代理存储、回读及人工恢复时间。必须让计量覆盖失败重做。输入 token 变少也可能伴随缓存重建或额外回读。

代理界面和 /acp、/acp-cache 能提供运行观测入口，代理账本对回读导致的上下文估计有补记，估计值不能当账单。上游 4xx 拒绝带提示的请求时，代理有回滚提示节奏并暂缓重新提示的路径。该路径有助于避免把未送达提示当作投递成功，重新发送、成功清除及费用效应仍须结合具体路由验证。

作者 README 所列 1,500 项对照绑定 v0.1.202 与 Pi Agent，作者的长会话研究与第三方基准条目可用于提出验证方向，无法给本研究提交的 DSH 安装、切换或净成本提供现场证据。如果观察到无归属、跨会话、回读原文不符、或者相同验收的总投入明显增加，恢复原生流程。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:59-73](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/README.md#L59-L73)

作者报告长会话与三基准对照，比较版本和宿主另有边界。

<details>
<summary>查看原文（15行）</summary>

```text
## 📄 Paper / Preprint

- **[Model-Driven Incremental Hierarchical Compression: Training-Free Multi-Generational Context Management for Long-Lived Coding Agents](./paper/model-driven-incremental-hierarchical-compression-training-free-multi-generational-context-management-for-long-lived-coding-agents.md)** (English, v0.2)

> 📝 **The paper itself is open-sourced under the MIT License as part of the codebase (`paper/`). It is a living document — anyone may edit it; improvements are welcome via pull request.**

A production-scale longitudinal study: 4.5 months, three hosts, 174,327 model calls, 18.76B cumulative input tokens (~24.7B across all hosts), zero window violations on 204,800-token models, marathon sessions of 8,584–12,049 calls.

### 📊 Independent Third-Party Benchmarks

- **[1,500-Item Cross-Benchmark Evaluation (`LongMemEval-S` · `ContextBench` · `MemoryAgentBench`)](./benchmarks/third-party-1500/README.md)** ([中文版](./benchmarks/third-party-1500/README.zh-CN.md)) — head-to-head comparison of `billion-context` (`v0.1.202`) against `full` context and 3 RAG arms (`bm25`, `embedding`, `embedding-rerank`) with `DeepSeek V4.1 Flash`, `Qwen3-Embedding-8B`, `Qwen3-Reranker-4B`, and `Pi Agent`: **#1 on ContextBench** (`0.3097` Utilized F1, `-58.3%` cost vs `full`), **+16.6% over best RAG on LongMemEval-S** (`79.20%` vs `62.60%`, `-71.1%` independent-session cost vs `full`), and **100% survival on 1.48M-token MemoryAgentBench TTL** (`30×` steady-state compression where `full` fails `199/199`).

---

`billion-context` sits between **any** agent and its model API, rewriting Anthropic/OpenAI streams with [acp-kernel](https://github.com/ranxianglei/acp-kernel) compression. The model decides **when** and **what** to compress into high-fidelity summaries — not a hard truncation limit.
```

</details>

**依据 2 · 源码核查**：[src/agent/dsh-native.ts:2924-2934](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/agent/dsh-native.ts#L2924-L2934)

注册会话状态和缓存报告入口。

<details>
<summary>查看原文（11行）</summary>

```text
    // #1677: forward the host-passed invocation — it carries the invoking agent's
    // session id, which the command path cannot recover from currentInitiator().
    ctx.commands.register({
        name: "acp",
        description: "Show bili context-compression status",
        handler: (invocation) => statusOutcome(ctx, invocation),
    });
    ctx.commands.register({
        name: "acp-cache",
        description: "Prompt-cache reconciliation (same report as the acp_cache tool)",
        handler: (invocation) => cacheOutcome(ctx, invocation),
```

</details>

**依据 3 · 源码核查**：[src/plugin.ts:2532-2539](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/plugin.ts#L2532-L2539)

工具回读及压缩估计影响计量。

```text
            const creditDelta = (session.stats.compressCreditTokens ?? 0) - creditBefore;
            const restoredInjections = session.pendingRetrievals.filter((p) => !pendingBefore.has(p.ref));
            // The string tool protocol has distinct success headers for whole/derived and range restores.
            const restored = tool === "decompress" && (/^\[Block [^\n]+ content /.test(toolResult.text) || /^\[decompress [^\n]+: restored \d+ item\(s\)/.test(toolResult.text));
            if (before && (creditDelta !== 0 || session.lastCompress !== compressBefore || restored)) {
                // Credit was already applied to lastInputTokens by the tool; do not net it twice.
                const restoredTokens = restored ? countMessageTokens({ text: toolResult.text }) + restoredInjections.reduce((sum, p) => sum + countMessageTokens(p.injection), 0) : 0;
                recordContextObservation(session, Math.max(0, before.tokens - creditDelta) + restoredTokens, "estimate");
```

**依据 4 · 源码核查**：[src/server/relay.ts:2158-2165](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/server/relay.ts#L2158-L2165)

在有已准备提示时间戳且上游 4xx 时回滚。

```text
        // this line byte-identical to before). Read-only: no recovery decision
        // here depends on it.
        const terminalCause = rejectionDiagnosticSuffix(bodyText);
        loggerLog("warn", `[${errSid}] ← upstream ${upstream.status}${reqIdText}: ${snippet}${terminalCause}`);
        if (prepared?.session && prepared.nudgeStampsBefore && upstream.status >= 400 && upstream.status < 500) rejectNudge(prepared.session, prepared.nudgeStampsBefore, upstream.status);
        // #4204: feed this send's FINAL verdict. A model-scoped KeyRing 429 is
        // selected only by its structured code plus exact request-model match;
        // keyring_all_limited and every ambiguous response remain account-wide.
```

**依据 5 · 源码核查**：[src/session.ts:1143-1176](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/session.ts#L1143-L1176)

提示节奏回滚、暂缓与成功释放逻辑。

<details>
<summary>查看原文（34行）</summary>

```text
export type NudgeStamps = { shown: number; byTier: Session["state"]["nudge"]["lastShownByTier"] };

export function nudgeStampsOf(session: Session): NudgeStamps {
    return { shown: session.state.nudge.lastNudgeShownTokens, byTier: session.state.nudge.lastShownByTier };
}

export function restoreNudgeStamps(session: Session, stamps: NudgeStamps): void {
    session.state.nudge.lastNudgeShownTokens = stamps.shown;
    session.state.nudge.lastShownByTier = stamps.byTier;
}

/** The kernel stamps a nudge as shown when it decides to inject it. When the
 *  upstream rejects that request the model never saw the nudge, so the stamp
 *  would hold the cadence against a nudge nobody received (a Claude Code session,
 *  2026-11-11: the session's only nudge drew a 400 and it never nudged again).
 *  Roll the stamps back and hold nudges until the next success. */
export function rejectNudge(session: Session, before: NudgeStamps, status: number): void {
    restoreNudgeStamps(session, before);
    (session.transient ??= {}).nudgeHeldAfterReject = true;
    markDirty(session);
    loggerLog("info", `[${session.id}] nudge rejected with its request (upstream ${status}): stamps rolled back to shown=${before.shown}; nudges held until a request succeeds`);
}

/** The hold set by rejectNudge must end on ANY success — including ones that
 *  never report usage. settleUsageReport only clears it for s.total > 0
 *  samples, so on routes where the upstream never reports usage the flag
 *  would latch forever (a single 4xx would kill nudging for the rest of the
 *  process lifetime — the exact failure #6531 fixes, relocated to the #1595
 *  route class). Called at every no-usage success site. */
export function releaseNudgeHold(session: Session): void {
    if (session.transient?.nudgeHeldAfterReject) delete session.transient.nudgeHeldAfterReject;
}

// #1820: post-rebuild meter anchor. Right after a big preflight rebuild the
```

</details>

#### 缺口

- 未执行同版本真实宿主对照。
  **影响**：稳定性、延迟、现金及完整验收通过率仍未知。
  **进一步探讨**：两个隔离 profile 使用同版本模型和原测试，分别记录成功、异常请求、缓存和人工投入。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 显式标注回读来源是否会减少误引？

**研究主题**：新假设与验证

#### 完整回答

可把回读协议的来源与覆盖率显式化，将缓存原文、从实时历史部分回收、摘要回退分别标明。当前的成功标题含块 ID、条数和 full 标识，来源路径会被压成同一形状。即使用户能读到摘要，这仍不足以让模型逐字引用原始接口约束。搜索结果可区分某些原文命中，但不能替代对回读结果本身的标注。

小规模盲测可在三组样例分别保留完整缓存、部分现有历史和仅有摘要。对照现有回执，只改变来源标签并给相同近期任务，计数原文精确匹配、误把摘要当原文的引用和回读轮数。如果标签未减少误引，或尾部重查令合格任务成本明显上升，则推翻这一试验的收益假设。该设计尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/decompress-shared.ts:220-247](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/decompress-shared.ts#L220-L247)

缓存和摘要可通过同一标题返回。

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

**依据 2 · 源码核查**：[src/decompress-shared.ts:926-952](https://github.com/ranxianglei/billion-context/blob/301e1a5459a77d5578206927c8062a58381af642/src/decompress-shared.ts#L926-L952)

搜索预览对原文命中有单独输出，无法代替回读来源字段。

<details>
<summary>查看原文（27行）</summary>

```text
        const topic = b.topic ?? "(no topic)";
        const preview = evidenceSnippet(b.summary, terms, freq);
        // #1179 CCR v2: covered message-ref span(s) — connect block space to
        // store space so the model can target acp_retrieve / range decompress
        // at individual messages instead of whole blocks.
        const span = coveredRefSpan(state, b);
        const spanNote = span ? ` [${span.text} · ${span.count} msgs]` : "";
        // #4154: inactive = folded away by a later fold; still findable, and
        // decompress is the documented way back to its full summary.
        const inactiveNote = b.active ? "" : ` [inactive — folded away; decompress ${b.blockId} restores it]`;
        return `${b.blockId} (T${b.tier}) "${topic}"${spanNote}${inactiveNote}\n  ${preview}`;
    });
    const origLines = origHits.map(({ r, spanText, count }) =>
        `${r.blockId} (original text, not in any summary)${spanText ? ` [${spanText}${count ? ` · ${count} msgs` : ""}]` : ""}\n  ${r.preview}`
    );
    let steering = "";
    if (scored && plan && !foreignSessionId && blocks.length > 0) {
        const returned = new Set(blocks);
        steering = buildSteering(scored.filter((s) => returned.has(s.block)), state, plan.session);
    }
    const truncNote = ranked.length > blocks.length
        ? `\n\n[truncated: showing ${blocks.length} of ${ranked.length} candidates by relevance — pass limit:${ranked.length} to see the rest]`
        : "";
    const tip = narrowingHint(terms, blocks, ranked);
    const tipNote = tip ? `\n\n${tip}` : "";
    const origSection = origLines.length > 0
        ? `\n\nOriginal-text hit(s) — verbatim folded content that no summary mentions; decompress the block for the full record:\n${origLines.join("\n")}`
```

</details>

#### 缺口

- 缺少模型对标签的行为测试。
  **影响**：来源标注与减少误引的因果关系未知。
  **进一步探讨**：随机安排两种回执并对同一约束做盲评。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
