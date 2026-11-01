# billion-context

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[7578e81](https://github.com/ranxianglei/billion-context/tree/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0)

<!-- BEGIN META -->
[![GitHub ★ 3,521](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C521&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ranxianglei/billion-context) [![npm 30d 2,315,214](https://img.shields.io/static/v1?label=npm+30d&message=2%2C315%2C214&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context)
<!-- END META -->

> **功能**：为长会话提供分层上下文压缩、按需恢复和搜索，并通过代理或原生集成接入多个客户端。

> **亮点**：[Q02](#research-q02) 显示 DSH 代理工具与范围块、按需恢复相结合，提供相对整段压缩更细的操作；方法包含 kernel 既有贡献，不能据此断言原创或效果提升。

> **主要限制**：[Q03](#research-q03) 显示启动失败可直连且作者报告部分传输可能绕开代理；[Q02](#research-q02) 的恢复路径在缓存和原消息缺失时可能退回摘要，不能视为无条件原文恢复。

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
  - [Q01 · 谁在什么场景使用，如何接入 DSH？](#detail-section-11)
  - [Q02 · 压缩与恢复实际怎样实现，对比原生压缩的贡献是什么？](#detail-section-12)
  - [Q03 · 失败、兼容和工程边界是什么？](#detail-section-13)
  - [Q04 · 费用、效果与可验证的改进假设是什么？](#detail-section-14)
  - [Q05 · 什么情况下值得试用，如何退出？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护长期编码任务的人需要在窗口限制下继续使用关键决策和原始细节；合格结果是正确完成任务而不是累计 token 数。[Q01](#research-q01)

原有办法是宿主整段压缩、保存任务摘要后新开会话或人工查原日志；本次未测同任务质量与成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 动态工具注册 | 将代理清单提供的上下文工具挂入 DSH | 依赖代理清单和有效会话；未做宿主运行验证 |
| 块内容恢复 | 在需要时取回折叠内容 | 须有可用块状态及缓存或当前消息；默认仅展开一层，原文不可用时可能退回摘要 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH profile 与含 dist 的包 | profile 安装时必需 | 挂载 bundle | 作者说明源码地址可能缺构建产物 |
| 代理与模型服务 | 压缩必需 | 路由请求和执行工具 | 代理启动失败可退回直连未压缩 |
| 块状态与可用原文来源 | 文本块恢复时需要对应块状态及缓存或当前消息 | 优先读取块缓存；缓存缺失时从消息收集 | 已归档的块不可恢复；缓存和消息均不可用时可能只返回摘要 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份历史和配置，建立独立 profile | 能回退原配置 |
| 加载 | 用户通过 DSH 安装含构建产物的 bundle | 查看代理和工具是否可用 |
| 任务 | 模型请求压缩和恢复 | 对照关键事实与原文 |
| 退出 | 用户按安装通道移除整个 bundle | 检查原生压缩与历史 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 安装、代理和存储资源 | 备份、配置和检查 | 费用与时间未知 |
| 持续使用 | 模型输入输出、代理和状态存储 | 核对摘要与恢复 | 单次任务费用未知 |
| 失败恢复 | 重试模型及重建状态资源 | 排障、回退和重做 | 成功率和时间未知 |
| 退出 | 可能产生迁移资源开销 | 恢复宿主配置 | 原日志可用性须确认 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 范围压缩与取回 | 固定源码具备块与读取机制 | 任务保真、模型是否主动恢复 |
| 跨任务费用 | 作者报告旧版指定环境比较 | 当前 DSH 端到端单位成本 |

> **思考**：[Q03](#research-q03) 显示启动失败可直连且作者报告部分传输可能绕开代理；[Q02](#research-q02) 的恢复路径在缓存和原消息缺失时可能退回摘要，不能视为无条件原文恢复。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 显示 DSH 代理工具与范围块、按需恢复相结合，提供相对整段压缩更细的操作；方法包含 kernel 既有贡献，不能据此断言原创或效果提升。

工具动态注册、会话归属检查和错误转发可见于 [Q02](#research-q02)；[Q03](#research-q03) 中 gate 独立与失败路径提供设计线索，但与宿主配置及拦截耦合，未证明可在所有版本运行。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示启动失败可直连且作者报告部分传输可能绕开代理；[Q02](#research-q02) 的恢复路径在缓存和原消息缺失时可能退回摘要，不能视为无条件原文恢复。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议保留原日志并在独立 profile 试用，先检查代理流量和关键事实；出现持续直连、双压缩或无法恢复时移除整个 bundle，核对原生压缩。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为源码支持的有条件机制组合；效果、兼容和新的引用确认方案均未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、CLIENTS.md、src/agent/dsh-native.ts、dsh.bundle.patch.yml、kernel/src/compress.ts、kernel/src/decompress.ts、benchmarks/third-party-1500/README.md、src/agent/shared.ts、src/server/admin.ts、src/plugin.ts、src/loop/core.ts、src/external-summary-compress.ts、src/stream.ts、src/decompress-shared.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只定向检查 DSH 入口、bundle、kernel 压缩与恢复及作者基准；不涵盖全部协议、其他宿主、安装产物一致性或安全审计。
- 下一步：以相同宿主、模型、预算和任务比较原生压缩与本组件，记录完整调用费用、关键事实、恢复与人工时间；隔离环境检查故障和完整退出。

**分析版本**

- **仓库**：[ranxianglei/billion-context](https://github.com/ranxianglei/billion-context)
- **版本号**：0.1.210（[固定提交 7578e81](https://github.com/ranxianglei/billion-context/tree/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出在关键事实输出前展示对应原文引用供确认，可能减少摘要误用；同任务对照、全成本与否定条件尚待验证，不是现有能力。

以相同宿主、模型、预算和任务比较原生压缩与本组件，记录完整调用费用、关键事实、恢复与人工时间；隔离环境检查故障和完整退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 142 | 20296 | — | — | 386448 |
| .ts | source | 399 | 184931 | 124934 | 51810 | — |
| .mjs | source | 30 | 6351 | 4420 | 1558 | — |
| .ts | test | 1247 | 354113 | 295201 | 40294 | — |
| .mjs | test | 5 | 835 | 636 | 186 | — |
| .md | test | 1 | 359 | — | — | 2707 |
| .mts | example | 2 | 85 | 71 | 16 | — |
| .mjs | example | 1 | 21 | 16 | 4 | — |
| .ts | example | 1 | 67 | 48 | 16 | — |
| .md | example | 1 | 34 | — | — | 545 |
| .js | source | 1 | 596 | 580 | 26 | — |

</details>

**活跃度**

[![Issue 未关闭 386](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=386&color=737b86&logo=github)](https://github.com/ranxianglei/billion-context/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1,742](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1%2C742&color=737b86&logo=github)](https://github.com/ranxianglei/billion-context/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 1,406](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1%2C406&color=737b86&logo=github)](https://github.com/ranxianglei/billion-context/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本中 DSH 用户如何接入长会话压缩、能恢复什么，以及哪些可靠性、成本和兼容边界会影响是否使用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在什么场景使用，如何接入 DSH？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

目标人群是长时间维护编码会话的 DSH 用户：任务需要跨多轮保留决定、错误和代码细节，窗口不足时可用宿主自带压缩、整理任务后新开会话或人工查原日志。合格结果是任务仍正确利用关键事实并能定位原文，而不是累计处理了多少 token。包清单将根导出指向 DSH 原生入口；作者说明既可用 bili dsh 启动并注入 patch，也可向已有 profile 安装 bundle。后者需要事先创建 profile 与含构建产物的发行包。配置会影响宿主自动压缩与重试行为，用户需备份配置并确认模型请求真正进入代理；说明中报告部分传输不经过代理，启动器是作者建议的替代路径。这里没有运行任一接入方式，也未证明实际用户规模。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-18](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/package.json#L1-L18)

包导出 DSH 原生入口与命令行入口。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "billion-context",
  "version": "0.1.210",
  "description": "A context-compression plugin \u2014 small context windows (a 100K context is enough), 5x fewer tokens, month-long single sessions (billions of tokens), and compression quality \u2014 for all agents: pi, OpenCode, Codex, Claude Code, and more. billion-context is all you need.",
  "type": "module",
  "main": "dist/index.js",
  "exports": {
    ".": "./dist/agent/dsh-native.js",
    "./server": "./dist/agent/opencode-native.js",
    "./dsh": "./dist/agent/dsh-native.js",
    "./dsh-compaction-gate": "./dist/agent/dsh-compaction-gate.js",
    "./package.json": "./package.json",
    "./dsh/package.json": "./package.json",
    "./client": "./dist/agent/dsh-native-client.js"
  },
  "bin": {
    "bili": "./dist/index.js",
    "bili-proxy": "./dist/index.js"
```

</details>

**依据 2 · 作者声明**：[CLIENTS.md:12-51](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/CLIENTS.md#L12-L51)

作者描述两条接入、代理、配置和卸载条件。

<details>
<summary>查看原文（40行）</summary>

```text
## dsh (deepseek-harness)

Two lanes, same plugin (#941):

- **Launcher:** `bili dsh` injects the full native plugin through a
  `--patch` overlay (`~/.dsh-bili/.bili-acp.patch.yml`) — every profile
  boots with the bili tools registered natively, model requests carry
  `x-bili-plugin` + the dsh session id (plugin mode), and `/acp` is
   session-bound. dsh's native auto-compaction is disabled in the same patch
   (host-plane `compaction-basic` → `auto: false`; web-profile preset
   instances are disabled at load time by the #3354 overlay); manual
   `/compact` stays available in non-web profiles. The
  same patch also adds `MALFORMED_RESPONSE` to the built-in DeepSeek routes'
  retry whitelist, so one sampling flake that breaks a tool-call argument JSON
  retries instead of killing the turn (#2605).
- **Profile install (no launcher) — one lane (#966):** `bili plugin install
  dsh` runs `dsh plugin --profile <name> add billion-context` for every
  existing profile — pnpm installs the package into each profile's own
  `node_modules`, and dsh mounts the bundled patch layer
  (`dsh.bundle.patch.yml`) automatically — besides mounting `bili-native` and
  disabling dsh's auto-compaction, it adds `MALFORMED_RESPONSE` to the built-in
  DeepSeek routes' retry whitelist (#2605); the profile's own
  `cordis.patch.yml` applies later, so a full `retryPolicy` written there
  overrides it. The spec follows how bili itself
  was installed (#925): an npm-form install passes the registry name, a
  checkout/dev build passes its absolute path (a `link:` dependency, so
  local work stays live). Legacy managed blocks (`# bili begin` /
  `# bili end`, written by pre-#966 installs) are stripped on install and
  remove — user entries and comments survive, an emptied file gets its
  placeholder `[]` back. Run dsh once in each profile first so the profile
  dirs exist. The plugin spawns its own proxy at load (attaches to a healthy
  one instead of doubling; parent-pid watchdog), rewrites model-API traffic
  to `<proxy>/bili/<upstream-url>` via a global fetch patch, registers the
  manifest tools verbatim, and gates plugin-mode headers on tool readiness
  (round 1 rides wire mode). Opt-out: `BILI_NATIVE_DSH=0`. Remove with
  `bili plugin remove dsh` or `dsh plugin --profile <name> remove
  billion-context` — both go through the same channel. Registry installs
  require a published release that carries `dsh.bundle.patch.yml`; use the
  npm form — a GitHub source address installs source without `dist/` (the
  entry points dangle and dsh silently skips the bundle; the install-time
```

</details>

**依据 3 · 作者声明**：[CLIENTS.md:80-94](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/CLIENTS.md#L80-L94)

作者记录部分传输可能不经过代理及启动器替代方案。

<details>
<summary>查看原文（15行）</summary>

```text
 - **Reported: zero proxy traffic for some transports under profile install
   (#1158, under investigation):** sessions served by some of dsh's
   `llm-pi-ai`-layer transports show NO model request ever reaching the proxy
   (no `processTurn` logged; bili tools 404 with "no model request has
   arrived") while other providers in the same host work normally. The root
   cause is still being pinned down with runtime evidence — candidates: the
   transport-level fetch shape (SDK-injected fetch / non-global dispatcher) or
   a host-side attribution gap leaving the traffic unclaimed by the takeover
   gate. Detection: the proxy logs a one-time `[plugin] NO MODEL REQUESTS seen
   for conversation …` warning, and the dsh plugin logs each distinct endpoint
   the attribution gate lets through unproxied (once per process). Reliable
   workaround meanwhile: launch through `bili dsh` instead — the launcher's
   settings overlay rewrites those providers' `baseURL`s to `/bili/` URLs, so
   the traffic reaches the proxy regardless of which fetch the transport uses
   or what the attribution state is.
```

</details>

#### 缺口

- 当前 DSH 版本和具体 provider 是否能稳定接入
  **影响**：影响该用户能否获得压缩而非直连
  **进一步探讨**：固定宿主、provider 与版本，比较代理日志和模型请求并检查退出后配置

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 压缩与恢复实际怎样实现，对比原生压缩的贡献是什么？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

DSH 原生入口从代理取得清单并注册工具；执行时检查代理与宿主会话，再由 forwardTool 向代理 /__bili/plugin/tool 发送会话、工具名和参数。服务端路由交给 handlePluginTool，它解析会话并在会话锁内读取快照，调用 executeProxyToolAsync；压缩走配置分支，常规路径解析范围并进入 applyRanges，后者调用 kernel 的 applyCompression 并为新块缓存一层和完整内容。恢复走 resolveDecompress，先找块并检查归档，再优先取缓存；缓存缺失时从当前消息收集，若无内容则退回摘要而非保证原文。压缩可因取消、配置错误、会话变化、摘要候选失败或受保护范围而拒绝；HTTP 失败和工具结果中的 failure/refused 被转成宿主错误，partial 则附加提示。相对整段压缩或新开会话，这一组合提供范围级摘要及有条件的按需取回，不能证明语义无损或宿主不能提供类似能力；项目使用 kernel 机制，不能把它笼统归为原创。此链为固定源码核查，未执行实际宿主请求。

#### 证据与依据

**依据 1 · 源码核查**：[src/agent/dsh-native.ts:916-940](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/src/agent/dsh-native.ts#L916-L940)

工具执行绑定会话并转发，代理缺失或业务失败抛错。

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

**依据 2 · 源码核查**：[src/agent/dsh-native.ts:981-1010](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/src/agent/dsh-native.ts#L981-L1010)

工具来自代理清单并注册到宿主。

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

**依据 3 · 源码核查**：[kernel/src/compress.ts:301-343](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/kernel/src/compress.ts#L301-L343)

复制状态，处理摘要并计算保护消息。

<details>
<summary>查看原文（43行）</summary>

```text
export function createCore(ports: Ports = {}): CompressionCore {
  const countTokens = ports.countTokens ?? defaultCountTokens;
  // #4313 toggle: single gate for both pipeline nodes (stamp + render);
  // captured once per core so every lane built from this core agrees.
  const timestampsOn = ports.timestamps === true;

  function applyCompression(
    input: ApplyCompressionInput,
  ): ApplyCompressionResult {
    const state: CompressionState = cloneState(input.state);
    // #816 family: a model-authored summary can carry an unpaired surrogate
    // half — e.g. the model copies a literal \uXXXX escape out of tool output
    // into the tool-call argument, and JSON.parse of that argument yields a
    // real lone code unit. Stored verbatim, it poisons every later request
    // body that re-serializes the state (strict upstreams reject the whole
    // body, non-retryable). Scrub at ingest so state never carries one. The
    // wire layer (loop fetchUpstream / relay forward) scrubs again as the
    // belt-and-braces for already-poisoned persisted state.
    for (const spec of input.ranges) {
      if (spec.summary) spec.summary = scrubLoneSurrogates(spec.summary);
    }
    // Lazy run-id allocation (#2370): never advance nextRunId on a no-op
    // failure — the host forkSnapshot fingerprint hashes full state, so a bump
    // here would churn contextGeneration on every failed manual tool.
    let allocatedRunId: string | null = null;
    const runIdOf = (): string => (allocatedRunId ??= allocateRunId(state));
    let blocksCreated = 0;
    let tokensCompressed = 0;
    const errors: string[] = [];
    const warnings: string[] = [];
    const notes: string[] = [];

    // Default to the soft-protected zone (recent-N + last user message) when the
    // caller doesn't pass an explicit set. This makes applyCompression safe by
    // default; applySingleRange enforces it as a hard backstop.
    const protectedMessageIds =
      input.protectedMessageIds ??
      computeProtectedRefs(
        input.messages,
        input.state,
        input.config,
        countTokens,
      );
```

</details>

**依据 4 · 源码核查**：[kernel/src/decompress.ts:153-188](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/kernel/src/decompress.ts#L153-L188)

块内容可按层级读取，完全展开依赖消息输入。

<details>
<summary>查看原文（36行）</summary>

```text
export interface CollectContentOptions {
  /** When true, recurse through all nested tiers to original messages. Default: false (one tier up — nested active children stay folded, their summaries shown). */
  full?: boolean;
}

/**
 * Collect a block's content as a readable string WITHOUT modifying state.
 *
 * This is the cache-safe decompress primitive: the block stays compressed
 * (folded), its summary stays in place, and the full content is returned as
 * text for the caller to surface (e.g. as a tool result appended to the
 * conversation). Unlike deactivateBlock + prune, this does not mutate the
 * message-array prefix, so prompt cache is preserved.
 *
 * full=false (default): one tier up. Nested ACTIVE children of this block
 *   stay folded; their summaries are rendered in place of their messages.
 *   The block's own direct messages (not covered by any active child) are
 *   rendered in full.
 * full=true: recurse through all nested tiers; every effective message is
 *   rendered in full.
 *
 * Returns { text: "", count: 0 } when the block covers no messages.
 */
export function collectBlockContent(
  state: CompressionState,
  block: CompressionBlock,
  messages: CoreMessage[],
  options: CollectContentOptions = {},
): CollectedContentResult {
  const full = options.full ?? false;
  const targetIds = new Set(block.effectiveMessageIds);

  if (full) {
    const msgs = messages.filter((m) => targetIds.has(m.id));
    if (msgs.length === 0) return { text: "", count: 0 };
    return { text: msgs.map(formatMessage).join("\n\n"), count: msgs.length };
```

</details>

**依据 5 · 作者声明**：[README.md:72-105](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/README.md#L72-L105)

作者描述代理、范围压缩及恢复的设计目标。

<details>
<summary>查看原文（34行）</summary>

````text
`billion-context` sits between **any** agent and its model API, rewriting Anthropic/OpenAI streams with [acp-kernel](https://github.com/ranxianglei/acp-kernel) compression. The model decides **when** and **what** to compress into high-fidelity summaries — not a hard truncation limit.

## Why

Long coding sessions blow up context. Each provider charges per token, and once you pass the context window the session degrades or dies. `billion-context` compresses consumed conversation into layered summaries so you can run a single session for days — billions of tokens through one context window.

Unlike a host's built-in summarizer, compression here is **incremental, reversible, and prefix-cache friendly**: summaries are written in small ranges, can be decompressed on demand, and the cache prefix stays intact.

## How it works

```
Agent (Claude Code / Codex / Cursor / Aider ...)
        │  you point the agent's base URL at the proxy
        ▼
┌─────────────────┐
│  billion-context│   1. parse the request (Anthropic or OpenAI shape)
│     proxy       │   2. run acp-kernel compression on the conversation
│                 │   3. inject a `compress` tool + compression philosophy
│                 │   4. forward to the real model API
│                 │   5. rewrite the streaming response
└─────────────────┘
        │
        ▼
   real model API (Anthropic / OpenAI / compatible)
```

### Context-management tools

The proxy injects four context-management tools into the conversation; the model calls them itself as context grows, and the proxy executes `compress` server-side so folded ranges stay summarized in history until restored:

- **`compress`** — fold a message range into a detailed summary.
- **`decompress`** — restore a compressed range when exact details are needed again.
- **`search_context`** — keyword search over compressed summaries and visible messages.
- **`acp_status`** — context-usage overview plus which ranges are still compressible.
````

</details>

**依据 6 · 源码核查**：[src/agent/shared.ts:379-405](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/src/agent/shared.ts#L379-L405)

向代理工具端点转发会话和参数，并区分错误与部分结果。

<details>
<summary>查看原文（27行）</summary>

```text
export async function forwardTool(proxyBase: string, conversationId: string, tool: string, args: unknown, signal?: AbortSignal, nativeCaller: boolean = false, toolCallId?: string): Promise<ForwardedToolResult> {
    const body: { conversationId: string; tool: string; args: unknown; nativeCaller?: boolean; toolCallId?: string } = { conversationId, tool, args: args ?? {} };
    if (toolCallId !== undefined) body.toolCallId = toolCallId;
    // #2072: host-native agents (pi / dsh / opencode) stamp a per-call id minted
    // by the host's own session manager — declare it so a stale sibling witness
    // can neither redirect nor fail-closed the call (ladder rung 0, #2024/#2016).
    // Truthiness guard (not .length): a host passing a non-string id degrades to
    // the legacy id-less wire instead of throwing (same shape as src/mcp.ts).
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
```

</details>

**依据 7 · 源码核查**：[src/server/admin.ts:789-796](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/src/server/admin.ts#L789-L796)

服务端 POST 路由调用 handlePluginTool。

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

**依据 8 · 源码核查**：[src/plugin.ts:2215-2253](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/src/plugin.ts#L2215-L2253)

会话锁内取记忆快照并执行代理工具。

<details>
<summary>查看原文（39行）</summary>

```text
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

**依据 9 · 源码核查**：[src/loop/core.ts:378-406](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/src/loop/core.ts#L378-L406)

异步压缩进入配置路径，解压走共享恢复。

<details>
<summary>查看原文（29行）</summary>

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
```

</details>

**依据 10 · 源码核查**：[src/external-summary-compress.ts:37-50](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/src/external-summary-compress.ts#L37-L50)

未配置外部摘要时调用范围折叠，取消和配置错误拒绝。

<details>
<summary>查看原文（14行）</summary>

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
    normalizeRangeOrder(parsed.ranges);
    recoverEvictedView(ctx);
    const noView = noVisibleContextRefusal(ctx, parsed.ranges);
    if (noView) return noView;
```

</details>

**依据 11 · 源码核查**：[src/external-summary-compress.ts:98-111](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/src/external-summary-compress.ts#L98-L111)

外部摘要失败、会话变化与部分成功处理。

<details>
<summary>查看原文（14行）</summary>

```text
    if (work.length === 0) return compressResult("[Compression FAILED: no selected range passed the existing kernel protection checks. Nothing compressed.]", "refused", 0);
    const batch = await plan.summarize(work, signal);
    if (signal?.aborted || ctx.session.state !== state || ctx.session.revisionEpoch !== revision) return compressResult("[Compression FAILED: cancelled or session changed while generating external summaries. Nothing compressed.]", "refused", 0);
    const successful: ParsedRange[] = [];
    for (const [index, result] of batch.results.entries()) {
        if (result.status === "success") successful.push({ ...valid[index], summary: result.summary, compressCallId: newExternalCallId() });
    }
    // #3635: full failure description (parity with the preflight log line) so
    // an over-cap rejection is visible with its length reason, not bare "batch=finished".
    ctx.log(`[external-summary] completed ${successful.length}/${parsed.ranges.length} range(s); ${describeExternalSummaryFailure(batch)}`);
    // #4833: the bounded attempt diagnostics (source + budgets + outcomes) ride
    // the tool result too — enums and numbers only, never payload bytes.
    if (successful.length === 0) return compressResult(`[Compression FAILED: all configured external summary candidates failed or exceeded their budget. Nothing compressed; do not retry unchanged configuration — summaries longer than the configured cap are rejected whole, so raise compress.maxSummaryLength or request less via per-range summaryMaxChars.] [${describeExternalSummaryFailure(batch)}]`, "refused", 0);
    const applied = applyRanges({ ...parsed, ranges: successful }, ctx);
```

</details>

**依据 12 · 源码核查**：[src/stream.ts:1048-1070](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/src/stream.ts#L1048-L1070)

拒绝无上下文或摘要片段后调用 kernel。

<details>
<summary>查看原文（23行）</summary>

```text
    recoverEvictedView(ctx);
    const noView = noVisibleContextRefusal(ctx, ranges, { loopTracking: trackLoop });
    if (noView) return noView;
    // #2749: reject summaries that are byte-identical to a display stub the
    // model can currently see (the fragments it can "recall" after the
    // full-text anchor was stripped in plugin mode). Log carries refs only —
    // never the fragment itself (business content, #1454 pattern).
    const stubHits = findVisibleStubResubmissions(ctx, ranges);
    if (stubHits.length > 0) {
        const detail = stubHits.map((h) => `${h.startRef}–${h.endRef}`).join(", ");
        ctx.log(`[acp-proxy: compress rejected — ${stubHits.length} submitted summary fragment(s) byte-identical to a currently-visible display stub (#2749): ${detail}]`);
        const specKey = `stub:${detail}`;
        const guard = recordCompressFailure(ctx.session, specKey, "Restore the content first — decompress the block(s) whose stub you copied, or search_context — then re-issue with a fresh, complete summary.");
        const loopGuard = trackLoop ? noteCompressLoopFailure(ctx, specKey) : "";
        return compressResult(`[Compression FAILED: the summary for ${detail} is byte-identical to a display stub currently visible in your history — a ~200-char truncated preview of an already-stored summary, NOT a complete summary. Accepting it would fold those ranges under a fragment and lose everything after the cut (when re-folding the same block, silently shrink its stored summary). Nothing was compressed. Do NOT re-issue the fragment: first restore what you need to summarize (decompress the source block(s), or search_context), then re-issue the compress call with a fresh, complete summary covering the range's key information.${guard}${loopGuard}]`, "refused", 0, "stub-resubmission");
    }
    try {
        const res = ctx.core.applyCompression({
            ranges,
            messages: ctx.compressMessages ?? ctx.messages,
            state: ctx.session.state,
            config: ctx.config,
        });
```

</details>

**依据 13 · 源码核查**：[src/stream.ts:1179-1201](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/src/stream.ts#L1179-L1201)

为新块缓存一层和完整内容。

<details>
<summary>查看原文（23行）</summary>

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
```

</details>

**依据 14 · 源码核查**：[src/decompress-shared.ts:191-210](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/src/decompress-shared.ts#L191-L210)

检查块标识和已归档不可恢复的分支。

<details>
<summary>查看原文（20行）</summary>

```text
    const rawBlockId = args.blockId;
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
```

</details>

**依据 15 · 源码核查**：[src/decompress-shared.ts:219-235](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/src/decompress-shared.ts#L219-L235)

优先缓存，缺失时收集当前消息并可能退回摘要。

<details>
<summary>查看原文（17行）</summary>

```text
    const full = args.full === true;
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

#### 缺口

- 模型是否在需要时调用恢复及摘要是否保留关键事实
  **影响**：决定范围压缩能否完成真实任务
  **进一步探讨**：使用同一任务和模型比较原生压缩，逐项核对关键事实及原文恢复

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 失败、兼容和工程边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

最重要的限制是存在工具与代理路径却不保证每次请求都走该路径。源码中代理启动失败会记录直连未压缩，并安排恢复；工具调用没有代理地址或会话 ID 时直接报错。包的 patch 安装两个条目并关闭宿主平面自动压缩，Web preset 还依赖额外 gate；因此停用时需通过完整 bundle 通道退出并确认原生压缩状态，不能只移除 gate。kernel 对近期消息有保护，对完全落在保护区的请求返回未折叠结果，而不是声称创建了块。以上是源码分支，未复现生产故障或证明恢复一定成功；全局 fetch 拦截、其他 provider 与数据权限仍需要按具体环境核查。

#### 证据与依据

**依据 1 · 源码核查**：[src/agent/dsh-native.ts:711-734](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/src/agent/dsh-native.ts#L711-L734)

启动代理失败记录直连和恢复路径。

<details>
<summary>查看原文（24行）</summary>

```text
async function bootstrap(): Promise<string | undefined> {
    // #3616: superseded flights must not bind the newer world's origin plane.
    const gen = originGen;
    try {
        const handle = await ensureProxyRunning(
            { host: LAUNCHER_DEFAULT_HOST, port: 0, passthrough: false, debug: false, lane: "dsh" },
            { scriptPath: nativeProxyScriptPath() },
        );
        if (gen !== originGen) return handle.origin;
        state.origin = handle.origin;
        register.base = handle.origin;
        // #983: do NOT write BILLION_CONTEXT_PROXY — dsh has no reader for it
        // here (tools use register.base, /acp uses it too), and a frozen env
        // turns a later same-process re-apply (cordis deactivate/reactivate)
        // into an unverified attach to a possibly-dead origin. Reuse across
        // lifecycles goes through ensureProxyRunning's instance discovery.
        return handle.origin;
    } catch (err) {
        const msg = `proxy bootstrap failed — model traffic goes direct (uncompressed): ${errMessage(err)}`;
        persistClientEvent(msg);
        // #4811: a one-shot bootstrap failure must not become permanent. Plan-time
        // arming normally covers this, but this is where the failure IS KNOWN —
        // arm the recovery driver here so a base-less register always has a
        // re-spawn loop behind it. Idempotent; the timer clears itself once
```

</details>

**依据 2 · 源码核查**：[src/agent/dsh-native.ts:916-940](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/src/agent/dsh-native.ts#L916-L940)

无代理或会话时的报错路径。

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

**依据 3 · 源码核查**：[dsh.bundle.patch.yml:1-28](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/dsh.bundle.patch.yml#L1-L28)

bundle 和压缩门控的配置及退出约束。

<details>
<summary>查看原文（28行）</summary>

```text
# billion-context dsh bundle layer (#949).
# Mounted automatically when the profile's package.json lists billion-context
# in dsh.profile.bundles (`dsh plugin --profile <name> add billion-context`);
# the loader resolves `name` from the profile's node_modules.
# #1772/#2474/#3354: the `auto: false` below targets the HOST-PLANE
# compaction-basic row. In profiles bundling @deepseek-ai/dsh-web-app that row
# is disabled and the running instance lives inside the agent presets, whose
# nested rows no patch layer can address by id — the preset gate rows below
# make each Web preset wait for the load-time overlay the bili-compaction-gate
# entry registers (vendored from deshark42/dsh-compaction-basic-disable, MIT,
# #3354; see src/agent/dsh-compaction-disable.ts). A profile-level full-snapshot
# override of preset-standard (#2474) remains the fallback for dsh builds
# whose internal 'internal/config' hook moved.
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
```

</details>

**依据 4 · 源码核查**：[kernel/src/compress.ts:1643-1663](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/kernel/src/compress.ts#L1643-L1663)

完全位于保护区时返回未折叠结果。

<details>
<summary>查看原文（21行）</summary>

```text
    warnings,
  });
  if (projection.fatal) {
    // #4521: a range that lies ENTIRELY inside the protected zone is a legal
    // no-op, not a failure — the model aimed at the newest tail (exactly the
    // messages it just produced) and there is nothing it may fold there.
    // Rejecting it sent retry loops back into the same zone (live incident:
    // four consecutive zone refusals in session 01a18a4d, 20:09). The
    // recommendation side still demotes zone fatals to gaps, so advertised
    // ranges never point here (#3236 unchanged).
    if (projection.fatal.kind === "zone") {
      const highest = highestUsedIndex(input.state.messageRefs);
      return {
        tokens: 0,
        warnings: [
          `Range ${input.spec.startRef}..${input.spec.endRef} folded nothing — it lies entirely inside the protected zone (the last ${input.config.preserveRecentMessages} messages and/or the most recent user message), which always stays visible. Nothing failed; do not resend this range. Session highest allocated ref is ${highest > 0 ? indexToRef(highest) : "none"} — target older ranges only.`,
        ],
        noop: true,
      };
    }
    throw projection.fatal.error;
```

</details>

#### 缺口

- 实际故障、恢复、配置覆盖与并发会话隔离表现
  **影响**：会改变停用与状态损失风险判断
  **进一步探讨**：在隔离 profile 验证代理中断、恢复和卸载后宿主配置

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 费用、效果与可验证的改进假设是什么？

**研究主题**：效果与总成本、新假设与验证

#### 完整回答

项目内基准报告自称对 0.1.202、指定模型和 Pi CLI 比较，记录代码场景 Utilized F1 0.3097、完整上下文 0.2928，并报告成本；它同时报告逐字检索任务表现下降。该报告是作者仓库中的材料，本次未审计数据和执行，版本也不是当前 0.1.210，不能外推 DSH 或断言节费。首次使用需要安装、配置、备份；持续成本包含模型调用、代理、存储与人工核查；故障恢复要排查与重跑。数值和时间未知。由默认一层展开和逐字任务反例提出未验证假设：在输出关键事实前显示对应原文引用并要求用户确认，可能降低误用摘要的风险，但会增加操作和输入成本。对相同任务、模型、预算随机比较普通恢复与引用确认，测关键事实正确率、恢复次数、现金与人工时间；质量无改善或额外成本超过收益即否定。

#### 证据与依据

**依据 1 · 作者声明**：[benchmarks/third-party-1500/README.md:10-18](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/benchmarks/third-party-1500/README.md#L10-L18)

作者仓库报告旧版本比较及逐字查找反例。

```text
## 1. Executive Summary

We conducted an independent, strictly controlled third-party evaluation of **Billion Context (`v0.1.202`)** across **3 orthogonal long-context and agent memory benchmarks (1,500 evaluation instances in total, 500 per benchmark)**:

| Benchmark | Core Scenario | Context Scale | Best Arm | Billion Context (`bc`) Performance | Key Takeaway |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **LongMemEval-S (LME)** | Multi-session companion chat & temporal memory | ~110k tokens | `full` (83.20%) | **79.20% (2nd Overall)**<br/>**+16.60%** over best RAG (`62.60%`) | Preserves chronological & cross-session reasoning chains where chunked RAG collapses (`79.7%` vs `45.1%` on Multi-Session Reasoning). **-71.1% lower cost** than independent-session `full` (`$2.30` vs `$7.97`). |
| **ContextBench (CB)** | Multi-turn SWE coding agent (`Pi CLI v0.73.1`) over 58 real repos | Multi-turn repo exploration | **`bc` (0.3097 F1)** | **0.3097 Utilized F1 (1st Overall)**<br/>Beats `full` (`0.2928`) & all RAG arms | Pruning intermediate tool search noise boosts end-to-end Evidence Precision (`0.3358`, #1) and Utilized F1 (`0.3097`, #1) while cutting cost by **-58.3%** vs `full` (`$4.61` vs `$11.05`). |
| **MemoryAgentBench (MAB)** | Extreme static stress test: needle QA, book summarization & 1.48M-token recommendation | 6k → **1.48M tokens** | `embedding-rerank` (55.21%) | **43.54% Macro Avg**<br/>**18.58% Recall@10** on 1.48M TTL (`full` = **0.00%**, crashed) | Survives the 1.48M-token barrier where `full` fails 100% (`199/199` context overflow), compressing 1.48M tokens down to a **49.5k mean (~16k steady-state, 30× compression)**. Trade-off: lossy semantic compression drops verbatim needle QA (`AR`) from `69.0%` to `27.0%`. |
```

**依据 2 · 作者声明**：[benchmarks/third-party-1500/README.md:24-36](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/benchmarks/third-party-1500/README.md#L24-L36)

实验版本、模型、宿主和计价条件。

<details>
<summary>查看原文（13行）</summary>

```text
## 2. Experimental Setup & Full Cost Attribution Protocol

To ensure fair, end-to-end black-box comparison, all 5 arms share the exact same upstream LLM, prompt templates, evaluation judges, and token accounting rules (following the Full Cost Attribution methodology of `arXiv:2609.22114`):

- **Evaluated System**: `Billion Context (BC) v0.1.202` (transparent HTTP context-compression proxy)
- **Base LLM**: `DeepSeek V4.1 Flash 1017` (`deepseek-v4.1-flash-opendesign`)
- **Embedding Model**: `Qwen3-Embedding-8B`
- **Reranker Model**: `Qwen3-Reranker-4B`
- **Coding Agent Harness (ContextBench)**: `Pi CLI v0.73.1`
- **Unified Pricing Schedule**:
  - **LLM**: Input `$0.15 / 1M tokens` | Output `$0.60 / 1M tokens` | Prefix Cache Hit `$0.003 / 1M tokens` (with sensitivity verified at `$0.006 / 1M`)
  - **Embedding (`Qwen3-Embedding-8B`)**: `$0.01 / 1M tokens`
  - **Reranker (`Qwen3-Reranker-4B`)**: `$0.02 / 1M tokens`
```

</details>

**依据 3 · 源码核查**：[kernel/src/decompress.ts:153-188](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/kernel/src/decompress.ts#L153-L188)

默认一层展开与完整展开的机制为假设提供出发点。

<details>
<summary>查看原文（36行）</summary>

```text
export interface CollectContentOptions {
  /** When true, recurse through all nested tiers to original messages. Default: false (one tier up — nested active children stay folded, their summaries shown). */
  full?: boolean;
}

/**
 * Collect a block's content as a readable string WITHOUT modifying state.
 *
 * This is the cache-safe decompress primitive: the block stays compressed
 * (folded), its summary stays in place, and the full content is returned as
 * text for the caller to surface (e.g. as a tool result appended to the
 * conversation). Unlike deactivateBlock + prune, this does not mutate the
 * message-array prefix, so prompt cache is preserved.
 *
 * full=false (default): one tier up. Nested ACTIVE children of this block
 *   stay folded; their summaries are rendered in place of their messages.
 *   The block's own direct messages (not covered by any active child) are
 *   rendered in full.
 * full=true: recurse through all nested tiers; every effective message is
 *   rendered in full.
 *
 * Returns { text: "", count: 0 } when the block covers no messages.
 */
export function collectBlockContent(
  state: CompressionState,
  block: CompressionBlock,
  messages: CoreMessage[],
  options: CollectContentOptions = {},
): CollectedContentResult {
  const full = options.full ?? false;
  const targetIds = new Set(block.effectiveMessageIds);

  if (full) {
    const msgs = messages.filter((m) => targetIds.has(m.id));
    if (msgs.length === 0) return { text: "", count: 0 };
    return { text: msgs.map(formatMessage).join("\n\n"), count: msgs.length };
```

</details>

**依据 4 · 源码核查**：[package.json:1-4](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/package.json#L1-L4)

本次固定版本为 0.1.210。

```text
{
  "name": "billion-context",
  "version": "0.1.210",
  "description": "A context-compression plugin \u2014 small context windows (a 100K context is enough), 5x fewer tokens, month-long single sessions (billions of tokens), and compression quality \u2014 for all agents: pi, OpenCode, Codex, Claude Code, and more. billion-context is all you need.",
```

#### 缺口

- 本版本 DSH 同任务合格率、完整费用与人工时间
  **影响**：不能判断单位合格任务成本
  **进一步探讨**：按相同任务和资源记录成功与失败的全成本并保留原始记录

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么情况下值得试用，如何退出？

**研究主题**：采用判断

#### 完整回答

维护长编码任务、能隔离 profile 并保留原始历史的用户可小范围试用。先验证代理收到模型请求、工具绑定当前会话，再用已知事实检查摘要和恢复，记录失败及全部模型费用。相比原生整段压缩或人工换会话，范围级折叠与按需取回是可检查的增量，但不能保证自动恢复或优于基线。出现持续无代理流量、双重压缩、关键事实丢失或原文无法恢复时应停止，按包提供的卸载方式移除整个 bundle，检查宿主原生压缩恢复后使用原日志和原流程。不能接受额外模型调用、代理数据处理或人工复核的人应先观察。

#### 证据与依据

**依据 1 · 作者声明**：[CLIENTS.md:27-51](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/CLIENTS.md#L27-L51)

安装、退出和发行包条件。

<details>
<summary>查看原文（25行）</summary>

```text
- **Profile install (no launcher) — one lane (#966):** `bili plugin install
  dsh` runs `dsh plugin --profile <name> add billion-context` for every
  existing profile — pnpm installs the package into each profile's own
  `node_modules`, and dsh mounts the bundled patch layer
  (`dsh.bundle.patch.yml`) automatically — besides mounting `bili-native` and
  disabling dsh's auto-compaction, it adds `MALFORMED_RESPONSE` to the built-in
  DeepSeek routes' retry whitelist (#2605); the profile's own
  `cordis.patch.yml` applies later, so a full `retryPolicy` written there
  overrides it. The spec follows how bili itself
  was installed (#925): an npm-form install passes the registry name, a
  checkout/dev build passes its absolute path (a `link:` dependency, so
  local work stays live). Legacy managed blocks (`# bili begin` /
  `# bili end`, written by pre-#966 installs) are stripped on install and
  remove — user entries and comments survive, an emptied file gets its
  placeholder `[]` back. Run dsh once in each profile first so the profile
  dirs exist. The plugin spawns its own proxy at load (attaches to a healthy
  one instead of doubling; parent-pid watchdog), rewrites model-API traffic
  to `<proxy>/bili/<upstream-url>` via a global fetch patch, registers the
  manifest tools verbatim, and gates plugin-mode headers on tool readiness
  (round 1 rides wire mode). Opt-out: `BILI_NATIVE_DSH=0`. Remove with
  `bili plugin remove dsh` or `dsh plugin --profile <name> remove
  billion-context` — both go through the same channel. Registry installs
  require a published release that carries `dsh.bundle.patch.yml`; use the
  npm form — a GitHub source address installs source without `dist/` (the
  entry points dangle and dsh silently skips the bundle; the install-time
```

</details>

**依据 2 · 作者声明**：[CLIENTS.md:80-94](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/CLIENTS.md#L80-L94)

作者记录传输未进入代理的情况。

<details>
<summary>查看原文（15行）</summary>

```text
 - **Reported: zero proxy traffic for some transports under profile install
   (#1158, under investigation):** sessions served by some of dsh's
   `llm-pi-ai`-layer transports show NO model request ever reaching the proxy
   (no `processTurn` logged; bili tools 404 with "no model request has
   arrived") while other providers in the same host work normally. The root
   cause is still being pinned down with runtime evidence — candidates: the
   transport-level fetch shape (SDK-injected fetch / non-global dispatcher) or
   a host-side attribution gap leaving the traffic unclaimed by the takeover
   gate. Detection: the proxy logs a one-time `[plugin] NO MODEL REQUESTS seen
   for conversation …` warning, and the dsh plugin logs each distinct endpoint
   the attribution gate lets through unproxied (once per process). Reliable
   workaround meanwhile: launch through `bili dsh` instead — the launcher's
   settings overlay rewrites those providers' `baseURL`s to `/bili/` URLs, so
   the traffic reaches the proxy regardless of which fetch the transport uses
   or what the attribution state is.
```

</details>

**依据 3 · 源码核查**：[dsh.bundle.patch.yml:14-28](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/dsh.bundle.patch.yml#L14-L28)

退出不能只移除 gate。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[kernel/src/decompress.ts:176-188](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/kernel/src/decompress.ts#L176-L188)

缓存缺失时从当前消息收集内容的原语；缓存路径另见代理恢复实现。

<details>
<summary>查看原文（13行）</summary>

```text
export function collectBlockContent(
  state: CompressionState,
  block: CompressionBlock,
  messages: CoreMessage[],
  options: CollectContentOptions = {},
): CollectedContentResult {
  const full = options.full ?? false;
  const targetIds = new Set(block.effectiveMessageIds);

  if (full) {
    const msgs = messages.filter((m) => targetIds.has(m.id));
    if (msgs.length === 0) return { text: "", count: 0 };
    return { text: msgs.map(formatMessage).join("\n\n"), count: msgs.length };
```

</details>

**依据 5 · 源码核查**：[src/decompress-shared.ts:191-210](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/src/decompress-shared.ts#L191-L210)

归档块返回不可恢复的错误。

<details>
<summary>查看原文（20行）</summary>

```text
    const rawBlockId = args.blockId;
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
```

</details>

**依据 6 · 源码核查**：[src/decompress-shared.ts:219-235](https://github.com/ranxianglei/billion-context/blob/7578e8184f91ec7e1f397f1b34d2b4ff1838b0f0/src/decompress-shared.ts#L219-L235)

优先读取块缓存，缓存缺失时收集消息，失败退回摘要。

<details>
<summary>查看原文（17行）</summary>

```text
    const full = args.full === true;
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

#### 缺口

- 同版本真实宿主的安装、恢复和退出是否成功
  **影响**：目前只能推荐隔离试用
  **进一步探讨**：在实际宿主完成所述流程后记录条件与结果

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
