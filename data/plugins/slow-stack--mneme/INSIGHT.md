# Mneme

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[35a79c1](https://github.com/slow-stack/mneme/tree/35a79c1108cc59b01c86410a85a40e09164d6efd)

<!-- BEGIN META -->
[![GitHub ★ 204](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=204&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/slow-stack/mneme)
<!-- END META -->

> **功能**：跨会话记忆仓库，包含 DSH 插件与复用同一记忆库的独立 MCP 服务。

> **亮点**：[Q01](#research-q01) 根是私有仓库壳，独立MCP包扩展共享记忆入口，减少跨宿主复制，持久化与去重归因原service。

> **主要限制**：[Q02](#research-q02) MCP搜索不传scope，工具描述冒认每轮注入，取消无id通知被忽略；token可读写整库，不应当工作区授权。

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
  - [Q01 · 根仓库交付什么，跨宿主共享改变什么？](#detail-section-11)
  - [Q02 · 工具能否保留DSH会话归属和取消语义？](#detail-section-12)
  - [Q03 · 从部署到退出需要维护什么？](#detail-section-13)
  - [Q04 · 什么范围值得试，额外方向怎样推翻？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：单人交替使用DSH与其他MCP客户端，希望避免维护两份偏好和项目笔记。

手工Markdown笔记与直接DSH记忆工具；MCP适配复用存储/检索而非另建算法或自动注入。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| MCP六工具 | 跨宿主显式读写记忆 | token全库权限，无自动注入 |
| 共库HTTP数据面 | DSH/daemon二选一供库 | 单数据面、正确库与端口 |
| 显式scope保存 | 标注记忆归属 | 不自动推导，搜索不透传scope |
| 限时错误反馈 | 防无期限等待/假成功 | 不证明写回滚或取消停止 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20 | MCP必需 | fetch/stdio适配 | 不等数据面Node要求 |
| 原插件数据面及其SQLite运行条件 | 必需 | 共用库/API | 只有MCP列工具而不能工作 |
| 正确URL/token、回环或安全通道 | 必需 | 全库读写鉴权 | 401或连错库，明文非回环仅告警 |
| 单人可信调用者/显式scope | 试用前提 | 避免误归属 | 不提供多租户授权 |
| 嵌入runtime/模型 | 语义检索可选 | 向量召回 | off或失败可降关键词 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份脱敏库并选单数据面 | 核目录/Node/端口 |
| 连接 | 用户配置MCP URL/token | 双端样例id/内容一致 |
| 使用 | Agent显式检索，写入需批准/scope | 不假设已注入或已隔离 |
| 异常 | 用户核超时/取消后的库 | 未核前不盲重试写 |
| 退出 | 移除挂载/令牌后停服务 | 等在途，保库备份不批量删除 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 适配器与数据面；可选模型下载 | 备份/配置/双端互认 | 安装耗时未知 |
| 持续使用 | 常驻库、检索和可选推理/API费 | 纠正记忆/核归属 | 未测资源及服务价格 |
| 失败恢复 | 备份与查状态资源 | 取消后对账防重复 | 客户端abort非回滚 |
| 退出 | 保留库与备份 | 移挂载/凭证，等在途 | 强退恢复未实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 共享库入口 | MCP HTTP复用service | 各宿主兼容/真实节时 |
| 显式记忆读写 | 六工具映射路由 | 自动注入并未接入 |
| scope | save显式传参 | search未传，不等授权 |
| 恢复 | 服务等在途，HTTP限时 | 取消最终提交/跨进程安全 |

> **思考**：[Q02](#research-q02) MCP搜索不传scope，工具描述冒认每轮注入，取消无id通知被忽略；token可读写整库，不应当工作区授权。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 根是私有仓库壳，独立MCP包扩展共享记忆入口，减少跨宿主复制，持久化与去重归因原service。

[Q03](#research-q03) strictPort和等待在途关库减少错误目的库/关库竞态；[Q02](#research-q02) MCP取消不传播，需保留UNKNOWN写结果。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) MCP搜索不传scope，工具描述冒认每轮注入，取消无id通知被忽略；token可读写整库，不应当工作区授权。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 单人副本/单数据面/回环或SSH、显式写批准下试用；先核样例互认，写结果不明即停写查库，移除挂载回手工笔记。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已静态核独立MCP完整入口和lib数据面关键接线，未运行目标。限定单人脱敏/单数据面试用，上下文契约仍未验证。

- 已检查：作者 README、包清单、源码路径 package.json、mcp/package.json、mcp/README.md、mcp/bin/mneme-mcp.mjs、mcp/Dockerfile、mcp/server.json、dsh-mneme/bin/dsh-mneme-serve.mjs、dsh-mneme/lib/serve.js、dsh-mneme/lib/api-standalone.js、dsh-mneme/src/serve.js、dsh-mneme/src/api-standalone.js、dsh-mneme/src/store.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根条目重点研究独立MCP包完整516行及实际lib服务装配/API关键路由；src/lib对应文件diff无差异。未审全库所有记忆算法/DSH注入（另有子组件研究）、未安装运行、未核发布物。
- 下一步：用脱敏库核双宿主显式读写、scope丢失/注入提示、延迟提交取消的最终结果、单数据面退出与网络模型资源。

**分析版本**

- **仓库**：[slow-stack/mneme](https://github.com/slow-stack/mneme)
- **版本号**：0.0.0（[固定提交 35a79c1](https://github.com/slow-stack/mneme/tree/35a79c1108cc59b01c86410a85a40e09164d6efd)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 在已有HTTP scope/超时上补跨宿主上下文和写结果查询；若手工scope/文档说明等效或造成隔离幻觉即否定，仍需服务端授权。

用脱敏库核双宿主显式读写、scope丢失/注入提示、延迟提交取消的最终结果、单数据面退出与网络模型资源。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 27 | 12456 | — | — | 259342 |
| .mjs | source | 13 | 3563 | 2649 | 662 | — |
| .js | source | 172 | 82232 | 53425 | 25512 | — |
| .js | test | 203 | 57708 | 45717 | 7462 | — |
| .mjs | test | 1 | 25 | 15 | 7 | — |

</details>

**活跃度**

[![Issue 未关闭 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=16&color=737b86&logo=github)](https://github.com/slow-stack/mneme/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 45](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=45&color=737b86&logo=github)](https://github.com/slow-stack/mneme/issues?q=is%3Aissue+created%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z) [![近30天关闭 43](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=43&color=737b86&logo=github)](https://github.com/slow-stack/mneme/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根仓库的实际交付类型、MCP跨宿主记忆边界和部署/恢复代价。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根仓库交付什么，跨宿主共享改变什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根package是private的0.0.0仓库壳，明确插件本体在dsh-mneme，mcp/mneme-memory则独立发布；根不是第二份原生插件。本项以基础设施集合定位，重点核独立MCP适配与共享数据面，原生DSH会话注入、梦境整理等由子组件研究，不重复计为MCP已有能力。

对在DSH和另一MCP客户端间切换的个人用户，六个工具让双方读写同一记忆库，比手工复制偏好/项目笔记减少双份维护；合格结果是另一端按预期归属读取正确版本，而非仅列出六个名字。mcp包无需另建SQLite，stdio工具经HTTP到原插件服务；持久化、去重和检索是复用service的能力，不是MCP层新算法。只使用一个宿主、已有Markdown笔记足够时额外服务未必值得。作者说任意MCP客户端，是协议意图，未测试各宿主兼容或任务改善。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-10](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/package.json#L1-L10)

根显式私有仓库壳。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "mneme",
  "version": "0.0.0",
  "private": true,
  "description": "Mneme — cross-session memory for DeepSeek Harness. 本清单只是仓库壳：插件本体在 dsh-mneme/（@modusensus/dsh-mneme）；mcp/（mneme-memory）是同仓另一个可独立发布的 npm 包，不随本仓 workspace 管理。",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/slow-stack/mneme.git"
  },
  "license": "MIT"
```

</details>

**依据 2 · 源码核查**：[mcp/package.json:1-18](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/mcp/package.json#L1-L18)

独立stdio包0.1.2。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "mneme-memory",
  "mcpName": "io.github.modusensus/mneme-memory",
  "version": "0.1.2",
  "description": "Mneme memory tools as a stdio MCP server — cross-session memory for any MCP client (Claude Code / Cursor / Codex / Hermes / OpenCode / OpenClaw), backed by the dsh-mneme plugin's standalone API.",
  "license": "MIT",
  "type": "module",
  "engines": {
    "node": ">=20"
  },
  "bin": {
    "mneme-mcp": "bin/mneme-mcp.mjs"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/slow-stack/mneme.git",
    "directory": "mcp"
  },
```

</details>

**依据 3 · 作者声明**：[mcp/README.md:3-23](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/mcp/README.md#L3-L23)

作者声明共用库与六工具。

<details>
<summary>查看原文（21行）</summary>

```text
Cross-session memory for any MCP client — a stdio MCP server that exposes the
six memory tools of the [dsh-mneme](https://www.npmjs.com/package/@modusensus/dsh-mneme)
plugin to Claude Code, Cursor, Codex, Hermes, OpenCode and any other host that
speaks [Model Context Protocol](https://modelcontextprotocol.io).

It is **not** a second memory store. The server talks to dsh-mneme's standalone
HTTP API, so memories written from your editor show up in DSH and vice versa.

## What you get

| Tool | Purpose |
|---|---|
| `memory_save` | Persist one entry (preference / project / decision / summary / history) for future sessions |
| `memory_search` | Search past context by keyword and, when the library has embeddings, by meaning |
| `memory_list` | List entries by type, importance first, paginated (`include_archived` to see archived ones) |
| `memory_get` | Fetch one entry's full content by id |
| `memory_update` | Modify title / content / type / tags / importance of an existing entry |
| `memory_delete` | Permanently delete an entry |

Tool names, parameters and output rendering are kept verbatim-aligned with the
plugin's in-DSH tools (a cross-package parity test locks this in CI).
```

</details>

**依据 4 · 源码核查**：[mcp/bin/mneme-mcp.mjs:386-425](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/mcp/bin/mneme-mcp.mjs#L386-L425)

真实工具分派。

<details>
<summary>查看原文（40行）</summary>

```text
const TOOL_RUNNERS = new Map([
  ["memory_save", runSave],
  ["memory_search", runSearch],
  ["memory_list", runList],
  ["memory_get", runGet],
  ["memory_update", runUpdate],
  ["memory_delete", runDelete]
]);

// --- JSON-RPC over stdio（MCP：每行一条消息）---------------------------------

const rpcError = (code, message) => ({ code, message });

async function dispatch(config, msg) {
  switch (msg.method) {
    case "initialize": {
      const requested = typeof msg.params?.protocolVersion === "string" ? msg.params.protocolVersion : LATEST_PROTOCOL_VERSION;
      return {
        protocolVersion: SUPPORTED_PROTOCOL_VERSIONS.includes(requested) ? requested : LATEST_PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: SERVER_NAME, version: PKG_VERSION },
        instructions:
          "dsh-mneme cross-session memory (six tools mirroring the in-DSH memory tools). " +
          "Data plane: the plugin's standalone API. Configure DSH_MNEME_URL / DSH_MNEME_TOKEN or ~/.dsh-mneme/cli.json."
      };
    }
    case "ping":
      return {};
    case "tools/list":
      return { tools: MCP_TOOLS };
    case "tools/call": {
      const name = msg.params?.name;
      const runner = TOOL_RUNNERS.get(name);
      if (!runner) throw rpcError(-32602, `Unknown tool: ${name === undefined ? "(missing)" : String(name)}`);
      try {
        const text = await runner(config, msg.params?.arguments ?? {});
        return { content: [{ type: "text", text }] };
      } catch (error) {
        return { content: [{ type: "text", text: String(error?.message ?? error) }], isError: true };
      }
```

</details>

#### 缺口

- 缺少跨宿主同一任务与手工笔记对照。
  **影响**：不能声称避免遗忘或提升任务准确率。
  **进一步探讨**：用脱敏库在两个宿主记录版本/归属和人工维护时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具能否保留DSH会话归属和取消语义？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

stdio按行JSON-RPC接initialize/list/call，runner把save/search/list/get/update/delete映射为HTTP。服务除health都校验Bearer，token不是只读或每workspace凭证；同一token可调用按id读取/删除。save只传显式agent_scope/workspace_scope，服务无会话身份；默认不能借DSH的自动标注想当然归属。搜索schema及runSearch没有scope参数，虽HTTP搜索本身已支持scope，MCP无法从此工具表达调用者workspace；list也是全库筛选而非会话鉴权。scope标签和敏感级别不是多租户访问控制。

工具描述仍说相关记忆已每轮注入，但该MCP仅声明tools，未调用/context、没有宿主提示注入接线；其他MCP客户端若没额外集成，不能照此假设已有记忆上下文。它提供显式检索，不自动继承DSH每轮注入。

HTTP十秒AbortController覆盖响应正文，401和其他失败回工具isError，避免假成功。但notifications/cancelled和其他无id通知全部静默，不取消runner；并发请求异步分派。取消或超时只代表客户端等待结束，不证明服务器未提交，写失败需核库状态后再决定是否重试。没有请求幂等键/提交回执机制，标题去重也不是所有更新/删除的操作幂等证明。

#### 证据与依据

**依据 1 · 源码核查**：[mcp/bin/mneme-mcp.mjs:88-120](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/mcp/bin/mneme-mcp.mjs#L88-L120)

HTTP超时和错误路径。

<details>
<summary>查看原文（33行）</summary>

```text
async function apiRequest(config, pathname, { method = "GET", body, query } = {}) {
  const search = query ? `?${new URLSearchParams(query)}` : "";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res;
  let text;
  try {
    // res.text() 必须留在本块内：超时信号要覆盖到响应正文读完——只拿到响应头
    // 不算完成，正文停摆同样要被 abort（CodeRabbit 评审项）。
    res = await fetch(`${config.url}${pathname}${search}`, {
      method,
      headers: {
        ...(config.token ? { authorization: `Bearer ${config.token}` } : {}),
        ...(body !== undefined ? { "content-type": "application/json" } : {})
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      signal: controller.signal
    });
    text = await res.text();
  } catch (error) {
    const reason = error?.cause?.code ?? error?.name ?? String(error);
    throw new Error(`dsh-mneme API unreachable at ${config.url}: ${reason}`);
  } finally {
    clearTimeout(timer);
  }
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  if (res.status === 401) throw new Error(UNAUTHORIZED_HINT);
  return { status: res.status, json };
```

</details>

**依据 2 · 源码核查**：[mcp/bin/mneme-mcp.mjs:163-177](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/mcp/bin/mneme-mcp.mjs#L163-L177)

注入描述沿用而scope仅显式。

<details>
<summary>查看原文（15行）</summary>

```text
const TOOL_SEARCH_DESCRIPTION =
  "Search the cross-session memory store for past context (solved problems, user preferences, project decisions). IMPORTANT: relevant cross-session memories are already injected into your context every turn — only call this when the injected memory block does NOT contain what you need, or you need to look something specific up. Substring-matches title/content/tags, and augments results with semantic (vector) recall + optional rerank when an embeddings provider is configured. Returns matching entries with source and timestamps.";
const TOOL_LIST_DESCRIPTION =
  "List memory entries by type, high-importance first, then newest, paginated. Set include_archived=true to also list archived (hidden) entries so they can be located and restored.";
const TOOL_GET_DESCRIPTION =
  "Fetch one memory entry by ID and return its full content as text. Use after memory_list to read a specific entry.";
const TOOL_UPDATE_DESCRIPTION =
  "Modify an existing memory entry (title, content, type, tags, importance).";
const TOOL_DELETE_DESCRIPTION =
  "Permanently delete a memory entry.";

const SCOPE_SAVE_NOTE_AGENT =
  "Optional explicit agent-scope declaration (issue #170): 'global' or '*' makes this memory visible to every agent; any other value narrows it to that label. Overrides the automatic carrier label for this write; honored even when automatic scope labeling is disabled.";
const SCOPE_SAVE_NOTE_WORKSPACE =
  "Optional explicit workspace-scope declaration: 'global' or '*' makes this memory visible in every workspace; any other value narrows it to that label. Overrides the automatic carrier label for this write; honored even when automatic scope labeling is disabled.";
```

</details>

**依据 3 · 源码核查**：[mcp/bin/mneme-mcp.mjs:187-215](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/mcp/bin/mneme-mcp.mjs#L187-L215)

保存scope但搜索不携scope。

<details>
<summary>查看原文（29行）</summary>

```text
async function runSave(config, args) {
  const body = {
    type: args.type,
    title: args.title,
    content: args.content,
    ...(args.tags !== undefined ? { tags: args.tags } : {}),
    ...(args.importance !== undefined ? { importance: args.importance } : {}),
    ...(args.source !== undefined ? { source: args.source } : {}),
    ...(args.sensitivity !== undefined ? { sensitivity: args.sensitivity } : {}),
    ...(args.occurred_at !== undefined ? { occurred_at: args.occurred_at } : {}),
    ...(args.agent_scope !== undefined ? { agent_scope: args.agent_scope } : {}),
    ...(args.workspace_scope !== undefined ? { workspace_scope: args.workspace_scope } : {})
  };
  const res = await apiRequest(config, "/memories", { method: "POST", body });
  assertOk(res, [200, 201]);
  return `memory ${res.json?.action ?? "created"}: ${res.json?.id}`;
}

async function runSearch(config, args) {
  const mode = args.semantic === true && !args.mode ? "vector" : args.mode;
  const query = {
    q: String(args.query ?? ""),
    ...(args.limit !== undefined ? { topK: String(args.limit) } : {}),
    ...(mode !== undefined ? { mode: String(mode) } : {}),
    ...(args.rerank !== undefined ? { rerank: String(args.rerank) } : {}),
    ...(args.occurred_from !== undefined ? { occurred_from: String(args.occurred_from) } : {}),
    ...(args.occurred_to !== undefined ? { occurred_to: String(args.occurred_to) } : {})
  };
  const res = await apiRequest(config, "/search", { query });
```

</details>

**依据 4 · 源码核查**：[mcp/bin/mneme-mcp.mjs:315-328](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/mcp/bin/mneme-mcp.mjs#L315-L328)

搜索工具schema无scope。

<details>
<summary>查看原文（14行）</summary>

```text
    name: "memory_search",
    description: TOOL_SEARCH_DESCRIPTION,
    inputSchema: {
      type: "object",
      properties: {
        query: stringSchema("Search text; substring match over title/content/tags"),
        limit: intSchema("Max results (default 20)"),
        mode: { type: "string", enum: ["auto", "keyword", "vector", "hybrid"], description: "auto (default) = keyword hits first + vector fill when enabled; keyword = text only; vector = semantic recall first (falls back to keyword); hybrid = vector leads, keyword fills remaining slots" },
        semantic: boolSchema("Shorthand: enable semantic (vector) recall (same as mode=vector when true)"),
        rerank: boolSchema("Run cross-encoder rerank over candidates when a local reranker is configured (default true)"),
        occurred_from: stringSchema(OCCURRED_FROM_NOTE),
        occurred_to: stringSchema(OCCURRED_TO_NOTE)
      },
      required: ["query"]
```

</details>

**依据 5 · 源码核查**：[mcp/bin/mneme-mcp.mjs:399-425](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/mcp/bin/mneme-mcp.mjs#L399-L425)

只注册tools能力。

<details>
<summary>查看原文（27行）</summary>

```text
async function dispatch(config, msg) {
  switch (msg.method) {
    case "initialize": {
      const requested = typeof msg.params?.protocolVersion === "string" ? msg.params.protocolVersion : LATEST_PROTOCOL_VERSION;
      return {
        protocolVersion: SUPPORTED_PROTOCOL_VERSIONS.includes(requested) ? requested : LATEST_PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: SERVER_NAME, version: PKG_VERSION },
        instructions:
          "dsh-mneme cross-session memory (six tools mirroring the in-DSH memory tools). " +
          "Data plane: the plugin's standalone API. Configure DSH_MNEME_URL / DSH_MNEME_TOKEN or ~/.dsh-mneme/cli.json."
      };
    }
    case "ping":
      return {};
    case "tools/list":
      return { tools: MCP_TOOLS };
    case "tools/call": {
      const name = msg.params?.name;
      const runner = TOOL_RUNNERS.get(name);
      if (!runner) throw rpcError(-32602, `Unknown tool: ${name === undefined ? "(missing)" : String(name)}`);
      try {
        const text = await runner(config, msg.params?.arguments ?? {});
        return { content: [{ type: "text", text }] };
      } catch (error) {
        return { content: [{ type: "text", text: String(error?.message ?? error) }], isError: true };
      }
```

</details>

**依据 6 · 源码核查**：[mcp/bin/mneme-mcp.mjs:457-462](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/mcp/bin/mneme-mcp.mjs#L457-L462)

取消通知被忽略。

```text
    // 通知（无 id）：不回复。initialized/cancelled 等一律静默。
    if (msg.id === undefined) return;
    dispatch(config, msg).then(
      (result) => write({ jsonrpc: "2.0", id: msg.id, result }),
      (error) => write({ jsonrpc: "2.0", id: msg.id, error: error?.code !== undefined && error?.message !== undefined ? error : rpcError(-32603, `internal error: ${String(error?.message ?? error)}`) })
    );
```

**依据 7 · 源码核查**：[dsh-mneme/lib/api-standalone.js:386-395](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/lib/api-standalone.js#L386-L395)

除health强制token。

<details>
<summary>查看原文（10行）</summary>

```text
      // Health is the single unauthenticated probe (monitor checks).
      if (req.method === "GET" && pathname === "/health") {
        sendJson(res, 200, { ok: true });
        return;
      }

      // Everything else requires the Bearer token.
      if (!isAuthorized(req, token)) {
        sendJson(res, 401, { error: "unauthorized" });
        return;
```

</details>

**依据 8 · 源码核查**：[dsh-mneme/lib/api-standalone.js:510-531](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/lib/api-standalone.js#L510-L531)

按id读删不带会话授权。

<details>
<summary>查看原文（22行）</summary>

```text
      // --- GET/PUT/DELETE /memories/:id --------------------------------------
      const idMatch = pathname.match(/^\/memories\/([^/]+)$/);
      if (idMatch) {
        let id = idMatch[1];
        try { id = decodeURIComponent(id); } catch { /* keep raw */ }
        if (req.method === "GET") {
          const row = service.getById(id);
          if (!row) {
            sendJson(res, 404, { error: "not-found" });
            return;
          }
          sendJson(res, 200, service.toApiList([row])[0]);
          return;
        }
        if (req.method === "DELETE") {
          // store.remove deletes silently — precheck for a distinguishable 404.
          if (!service.getById(id)) {
            sendJson(res, 404, { error: "not-found" });
            return;
          }
          service.remove(id);
          sendJson(res, 200, { ok: true });
```

</details>

**依据 9 · 源码核查**：[dsh-mneme/lib/api-standalone.js:595-621](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/lib/api-standalone.js#L595-L621)

无会话的显式scope写入。

<details>
<summary>查看原文（27行）</summary>

```text
          // memory_save 工具的其余可选字段（#181）：sensitivity / occurred_at /
          // 显式 scope。scope 仅收显式声明（standalone API 无会话上下文，自动
          // 标注无从解析，语义与工具的显式参数一致）；形状不对宁 400 不静默丢。
          for (const key of ["sensitivity", "occurred_at", "agent_scope", "workspace_scope"]) {
            if (body[key] !== undefined && (typeof body[key] !== "string" || !body[key].trim())) {
              sendJson(res, 400, { error: `invalid-${key.replace(/_/g, "-")}` });
              return;
            }
          }
          try {
            const result = service.saveWithDedupe({
              type: body.type,
              title: body.title,
              content: body.content,
              importance: body.importance,
              tags: body.tags,
              source: body.source,
              ...(body.sensitivity !== undefined ? { sensitivity: body.sensitivity } : {}),
              ...(body.occurred_at !== undefined ? { occurred_at: body.occurred_at } : {}),
              ...(body.agent_scope !== undefined ? { agent_scope: body.agent_scope, agent_scope_source: "explicit" } : {}),
              ...(body.workspace_scope !== undefined ? { workspace_scope: body.workspace_scope, workspace_scope_source: "explicit" } : {})
            });
            const { action } = result;
            // #254 写入准入：这条 HTTP 路径今天不带会话身份，evaluate 在无 sessionKey
            // 时直接早退，所以拦不到；仍然显式分支——将来真接上会话身份时，落到
            // `toApiList([null])` 上会变成 500，把「被拒」伪装成「服务器出错」，而
            // 这两件事对调用方的处置完全不同（改内容 vs 重试）。
```

</details>

**依据 10 · 源码核查**：[dsh-mneme/lib/api-standalone.js:790-815](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/lib/api-standalone.js#L790-L815)

HTTP支持scope但MCP没有透传。

<details>
<summary>查看原文（26行）</summary>

```text
      // --- GET /search: unified recall pipeline (keyword + vector + BM25) ----
      if (req.method === "GET" && pathname === "/search") {
        const q = url.searchParams.get("q") ?? "";
        // 上界是防御：topK 直接进召回（见 MAX_SEARCH_TOP_K 注释）。
        const limit = Math.min(Number(url.searchParams.get("topK") ?? url.searchParams.get("limit") ?? 20), MAX_SEARCH_TOP_K);
        const mode = url.searchParams.get("mode") ?? "auto";
        const rerank = url.searchParams.get("rerank") !== "false";
        const occurredFrom = url.searchParams.get("occurred_from") ?? null;
        const occurredTo = url.searchParams.get("occurred_to") ?? null;
        // scope 透传（issue #370）：searchMemories 本就收 scope，此前 8790 没有
        // 入口——第三方（daemon 桥接侧）声明身份后，A2 软加权与 strictScope 硬
        // 过滤才在检索面同样成立；与 /context 同口径（scopeFromSearchParams）。
        const scope = scopeFromSearchParams(url);
        const query = q.trim();
        if (!query) {
          sendJson(res, 200, { items: [], mode: "keyword" });
          return;
        }
        // Any vector/rerank failure degrades to keyword inside searchMemories.
        void Promise.resolve(
          service.searchMemories(query, {
            mode,
            topK: limit,
            useRerank: rerank,
            ...(scope ? { scope } : {}),
            ...(occurredFrom !== null || occurredTo !== null ? { occurredFrom, occurredTo } : {})
```

</details>

#### 缺口

- 各MCP宿主是否另有注入、批准写入和取消机制未验。
  **影响**：不能把六工具当全套DSH体验或取消安全。
  **进一步探讨**：两宿主核提示内容、显式scope、取消后的最终库状态，不用生产记忆做破坏性测试。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 从部署到退出需要维护什么？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

MCP适配本身零npm依赖、Node>=20并使用fetch，但数据面不是零依赖：要开DSH外部API，或另装原插件包启动serve。serve入口实际import lib/serve.js，本轮核lib实现并比较src对应文件无差异；它装配SQLite/settings/mirror/service，再建standalone API，不是只看文档。数据面使用node:sqlite，不能由适配器Node20要求推成整个服务可用Node20。

启动选目录与显式端口，serve默认strictPort冲突就失败以避免桥接静默连错服务；配置URL/token按旧环境变量、新别名、cli.json依次覆盖，切宿主时需要核实际目的库。token缺失仍可列工具但调用会401；非回环明文HTTP只告警不阻止，不应在远程明文链路传私有库token。默认本地嵌入可能下载runtime/模型，失败可降关键词；--embed off避免这条下载/推理路径。远程模型服务的现金和隐私代价依选择另算，未核价格，不能称本地库等于内容永不出网。

首次需脱敏备份、配置、权限与双宿主互认；持续有常驻数据面、检索/嵌入和人工更正成本，未测资源/节时。服务dispose先停新请求并等在途再关库，第二次信号强退出；MCP退出则直接进程退出，不能借服务的优雅收尾宣称请求停止。删除是永久删除，不是停用；退出先移除MCP挂载/令牌，再核在途结果，保留原库备份而非用memory_delete清理。运行恢复与并发双数据面安全没有实测，文档“单写者”不代表同时启动两个进程共享库已验。

#### 证据与依据

**依据 1 · 源码核查**：[mcp/package.json:7-12](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/mcp/package.json#L7-L12)

适配器运行要求。

```text
  "type": "module",
  "engines": {
    "node": ">=20"
  },
  "bin": {
    "mneme-mcp": "bin/mneme-mcp.mjs"
```

**依据 2 · 源码核查**：[mcp/bin/mneme-mcp.mjs:77-83](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/mcp/bin/mneme-mcp.mjs#L77-L83)

配置优先级。

```text
export function resolveMcpConfig(env = process.env, configPath = CONFIG_PATH) {
  const file = readConfigFile(configPath);
  // env 别名（#300 双包）：新包名 mneme-memory 后用 MNEME_URL/MNEME_TOKEN；
  // DSH_MNEME_* 保持优先（老用户挂载配置零迁移）。config 文件不收新键。
  const url = firstNonEmpty(env.DSH_MNEME_URL, env.MNEME_URL, file.url) ?? DEFAULT_URL;
  const token = firstNonEmpty(env.DSH_MNEME_TOKEN, env.MNEME_TOKEN, file.token) ?? "";
  return { url: url.replace(/\/+$/, ""), token };
```

**依据 3 · 源码核查**：[mcp/bin/mneme-mcp.mjs:477-484](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/mcp/bin/mneme-mcp.mjs#L477-L484)

进程退出与缺token仅告警。

```text
      process.stdin.on("end", () => process.exit(0));
      process.stdin.on("error", () => process.exit(1));
      const shutdown = () => process.exit(0);
      process.on("SIGINT", shutdown);
      process.on("SIGTERM", shutdown);
      // token 缺失只 warn 不退出——health/open 路由仍可用，且提示比静默 401 友好。
      if (!config.token) {
        process.stderr.write("[mneme-mcp] warning: no token configured (DSH_MNEME_TOKEN / MNEME_TOKEN / ~/.dsh-mneme/cli.json); authenticated calls will fail.\n");
```

**依据 4 · 源码核查**：[mcp/bin/mneme-mcp.mjs:501-513](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/mcp/bin/mneme-mcp.mjs#L501-L513)

明文远端只告警。

<details>
<summary>查看原文（13行）</summary>

```text
export function main() {
  const config = resolveMcpConfig();
  // 非回环 HTTP 明文传输会把 Bearer token 暴露给链路——与 CLI 同款取舍，但
  // 至少要喊一声，不让操作者无感地越过「默认仅本机」的安全模型。
  try {
    const url = new URL(config.url);
    const host = url.hostname;
    const loopback = host === "127.0.0.1" || host === "localhost" || host === "::1" || host === "[::1]";
    if (url.protocol === "http:" && !loopback) {
      process.stderr.write(`[dsh-mneme-mcp] warning: ${config.url} is plain HTTP on a non-loopback host — the Bearer token travels unencrypted. Prefer SSH tunneling or a loopback address.\n`);
    }
  } catch { /* 非法 URL 交给请求路径报错 */ }
  createMcpServer(config).start();
```

</details>

**依据 5 · 源码核查**：[dsh-mneme/bin/dsh-mneme-serve.mjs:14-18](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/bin/dsh-mneme-serve.mjs#L14-L18)

真实lib入口。

```text
// 重定向进监控管道。
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { createServeRuntime } from "../lib/serve.js";
```

**依据 6 · 源码核查**：[dsh-mneme/bin/dsh-mneme-serve.mjs:105-145](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/bin/dsh-mneme-serve.mjs#L105-L145)

provider、启动及退出分支。

<details>
<summary>查看原文（41行）</summary>

```text
  let embed = "local";
  if (args.embed !== undefined) {
    if (typeof args.embed !== "string" || !["off", "local", "ollama", "openai"].includes(args.embed)) {
      fail(`--embed 需要 off|local|ollama|openai,收到: ${String(args.embed)}`);
    }
    embed = args.embed;
  }

  let rt;
  try {
    // 装配是异步的:embed=local 时可能要先取件 runtime(download 档,失败内部降级)
    rt = await createServeRuntime({ memoryDir, port, host, logger, embed });
  } catch (err) {
    fail(`启动失败: ${err?.message ?? err}`);
  }
  try {
    await rt.api.ready;
  } catch (err) {
    fail(`数据面启动失败: ${err?.message ?? err}\n` +
      `  端口 ${rt.api.port} 被占通常意味着另一个 mneme 数据面正在运行` +
      `(DSH 的「外部访问」或另一份 ${BIN_NAME})——二选一,或用 --port 换端口。`);
  }
  const addr = rt.api.server.address();
  // stdout 唯一一行:机器可读就绪行(测试/脚本解析端口用)。
  console.log(`${BIN_NAME} listening on http://${addr?.address ?? rt.api.host}:${addr?.port ?? rt.api.port} (pid ${process.pid})`);
  if (!rt.tokenExisted) {
    console.error(`[dsh-mneme] 首次启动已生成 Bearer token(已持久化,与 DSH 面板/CLI 共用):\n` +
      `  ${rt.api.token}`);
  }

  let closing = false;
  const shutdown = async (signal) => {
    // 第二次信号 = 强制退出（dispose 里 server.close 等 in-flight 收尾，极端情况下会挂）
    if (closing) process.exit(0);
    closing = true;
    console.error(`[dsh-mneme] ${signal} received, closing...`);
    try { await rt.dispose(); } catch { /* dispose 各步自吞 */ }
    process.exit(0);
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
```

</details>

**依据 7 · 源码核查**：[dsh-mneme/lib/serve.js:46-81](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/lib/serve.js#L46-L81)

SQLite与镜像service装配。

<details>
<summary>查看原文（36行）</summary>

```text
export async function createServeRuntime({
  memoryDir, port, host, logger = null, strictPort = true, embed = "local", embedder = null, reranker = null
} = {}) {
  if (!EMBED_PROVIDERS.has(embed)) {
    throw new Error(`invalid embed provider: ${String(embed)}(允许 off/local/ollama/openai)`);
  }
  // index.js:192-195:~ 展开只认前导;目录不存在时 node:sqlite 直接抛,先 mkdir。
  const dir = String(memoryDir || join(homedir(), ".dsh", "memory")).replace(/^~(?=$|[\\/])/, homedir());
  mkdirSync(dir, { recursive: true });

  // 装配顺序照 index.js:197-292:store → settings → mirror → service → recoverMirror。
  const store = createStore(join(dir, "memory.db"));
  const settings = createSettings(store.db);
  // 第一期不吃宿主 config schema(schemastery 是宿主 peer 依赖,独立进程装不装随缘),
  // 配最小集,与第三方 embedded 挂载实测同形:language 参与镜像渲染与去重标题;
  // documentMemoryEnabled 关掉 document 子系统(daemon 不建 documentIndex,service
  // 内部 if-guard 安全,index.js:261 的 documentIndex 仅宿主装配)。
  const cfg = { language: "zh", documentMemoryEnabled: false };
  // #509 评审整改补的一格:GET /memory/provenance 的读门读 cfg.distillRecords.enabled
  // (判据在 src/provenance-http.js,与写侧 src/summarize.js:988 同源)。daemon 与宿主
  // 共用同一个 memory.db、同一份 feature_flags kv,所以这里把用户显式开关展开进 cfg
  // ——index.js:217-233 同款展开,只取蒸馏这一组(daemon 其余键仍刻意不吃宿主 config
  // schema)。不展开的后果:daemon 对这一面恒定回「功能关了」,哪怕用户在面板里开着、
  // 库里明明有原文——对这个端点那是一句谎话,而「两种空必须分开读数」正是本仓纪律。
  // 残留不对称(写进 docs/DAEMON.md 与 PR):只靠 bundle 配置打开、从没在面板点过的
  // 用户,宿主认、daemon 不认——daemon 结构上看不到宿主的 bundle config,这是它看不见
  // 的那一半,不是本处能补的。
  const persistedFlags = settings.getFeatureFlags?.() ?? {};
  if (typeof persistedFlags["distillRecords.enabled"] === "boolean") {
    cfg.distillRecords = { ...(cfg.distillRecords ?? {}), enabled: persistedFlags["distillRecords.enabled"] };
  }
  const mirror = createMirror(dir, langOf(cfg));
  const service = createService({ store, mirror, config: cfg, logger });

  // index.js:292:上次镜像同步失败留下的 dirty 状态,启动时安全重渲一次(内部自吞)。
  service.recoverMirror();
```

</details>

**依据 8 · 源码核查**：[dsh-mneme/src/store.js:1-4](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/src/store.js#L1-L4)

真实node:sqlite依赖。

```text
import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { statSync } from "node:fs";
import { contentHashOf } from "./content-hash.js";
```

**依据 9 · 源码核查**：[dsh-mneme/lib/serve.js:107-125](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/lib/serve.js#L107-L125)

runtime失败降级。

<details>
<summary>查看原文（19行）</summary>

```text
  } else if (embed === "off") {
    // 纯关键词 + BM25:对齐宿主 lightMode 分支——不建 embedder,人改合并立即。
    applyHumanEdits();
  } else {
    let semanticReady = true;
    if (embed === "local") {
      // 自管 runtime 缺失时取件:只走 download 档(宿主 adopt 推导对独立进程无意义
      // ——没有宿主 node_modules 可推)。失败不阻断 daemon:降级关键词 + 可操作提示。
      semanticReady = await ensureRuntimePayload(logger);
    }
    if (semanticReady) {
      semantic = createSemantic({
        store, service, settings,
        cfg: daemonSemanticCfg(embed),
        logger, vectorIndex, applyHumanEdits, lightMode: false
      });
    } else {
      applyHumanEdits();
    }
```

</details>

**依据 10 · 源码核查**：[dsh-mneme/lib/serve.js:145-179](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/lib/serve.js#L145-L179)

strictPort与关库顺序。

<details>
<summary>查看原文（35行）</summary>

```text
  const maintenance = createMaintenance({ store, config: cfg, logger });

  // index.js:643-649 同一工厂;差别只有 strictPort 默认开(daemon 语义,见上)。
  // token 与宿主共用同一 kv 键 external_api:首次启动自动生成并持久化
  // (api-standalone.js:203-212),DSH 面板 / CLI / daemon 三方零配置共享凭证。
  const tokenExisted = Boolean(settings.getExternalApi?.()?.token);
  // embedder 注入 /context 的查询嵌入（issue #370）：三路取当前生效的同一句柄——
  // 注入覆盖用注入值，semantic 路用它的产物，off/lightMode 为 null（路由侧降级
  // 规则档）。与 service.setEmbedder 的是同一个实例，不存在第二真相源。
  const api = createStandaloneApi({ service, store, config: cfg, logger, settings, port, host, maintenance, strictPort, embedder: embedder ?? semantic?.embedder ?? null });

  return {
    api,
    store,
    service,
    settings,
    maintenance,
    semantic,
    tokenExisted,
    /**
     * 收尾：先停收新请求、等在途请求跑完，再关库——直接同步关库会让在途的
     * PUT/POST 撞上已关的 store（500 或丢写）。closeIdleConnections 排干
     * keep-alive 空闲连接（node ≥18.2，旧版无此 API 则跳过），否则 server.close
     * 的回调要等 keep-alive 超时才触发。node:sqlite 对未 finalize 语句可能抛，
     * 吞掉——WAL 会在下次打开时回放，已提交事务不丢。
     */
    async dispose() {
      await new Promise((resolve) => {
        try {
          api.server.close(() => resolve());
          api.server.closeIdleConnections?.();
        } catch { resolve(); }
      });
      try { semantic?.dispose(); } catch { /* 同上 */ }
      try { store.close(); } catch { /* 同上 */ }
```

</details>

#### 缺口

- 服务实际Node兼容、双进程库访问和模型资源/网络未测。
  **影响**：不能承诺零维护、并发安全或完全离线。
  **进一步探讨**：单数据面副本先用embed off，核实际Node与端口；再分别测试本地/远端模型网络、失败和资源。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么范围值得试，额外方向怎样推翻？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可在单人脱敏库、单一数据面、回环或SSH通道且客户端显式批准写操作的条件下试用跨宿主显式检索。先手工创建带明确scope的样例，另一宿主核id/内容/归属，禁止把MCP当多租户边界或每轮自动注入；删除/更新前留备份。出现跨工作区不应出现的内容、目的库不符或取消后状态不明，停止写入、查最终状态，移除挂载回手工笔记。

有依据的新方向是跨宿主调用上下文契约：使客户端明确提交workspace身份、明确显示当前是否有自动注入，并对写入绑定operation id/最终结果查询。已有HTTP scope、显式save scope和十秒超时是基线，增量是适配端不再丢scope/冒认注入，及UNKNOWN写结果可对账；这仍不是靠客户端自报身份完成授权。最小验证是两个不同workspace的同名笔记、没有注入的宿主、延迟提交/取消三类，比较错误归属、重复修改、恢复人工时间和误信提示。若只是文档说明/手工scope已同样可靠，或凭证仍全库开放却给出隔离幻觉，否定该设计或先要求服务端授权。没有实现与用户验证，不计既有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[mcp/bin/mneme-mcp.mjs:187-215](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/mcp/bin/mneme-mcp.mjs#L187-L215)

save与search scope不对称是推导基础。

<details>
<summary>查看原文（29行）</summary>

```text
async function runSave(config, args) {
  const body = {
    type: args.type,
    title: args.title,
    content: args.content,
    ...(args.tags !== undefined ? { tags: args.tags } : {}),
    ...(args.importance !== undefined ? { importance: args.importance } : {}),
    ...(args.source !== undefined ? { source: args.source } : {}),
    ...(args.sensitivity !== undefined ? { sensitivity: args.sensitivity } : {}),
    ...(args.occurred_at !== undefined ? { occurred_at: args.occurred_at } : {}),
    ...(args.agent_scope !== undefined ? { agent_scope: args.agent_scope } : {}),
    ...(args.workspace_scope !== undefined ? { workspace_scope: args.workspace_scope } : {})
  };
  const res = await apiRequest(config, "/memories", { method: "POST", body });
  assertOk(res, [200, 201]);
  return `memory ${res.json?.action ?? "created"}: ${res.json?.id}`;
}

async function runSearch(config, args) {
  const mode = args.semantic === true && !args.mode ? "vector" : args.mode;
  const query = {
    q: String(args.query ?? ""),
    ...(args.limit !== undefined ? { topK: String(args.limit) } : {}),
    ...(mode !== undefined ? { mode: String(mode) } : {}),
    ...(args.rerank !== undefined ? { rerank: String(args.rerank) } : {}),
    ...(args.occurred_from !== undefined ? { occurred_from: String(args.occurred_from) } : {}),
    ...(args.occurred_to !== undefined ? { occurred_to: String(args.occurred_to) } : {})
  };
  const res = await apiRequest(config, "/search", { query });
```

</details>

**依据 2 · 源码核查**：[mcp/bin/mneme-mcp.mjs:399-409](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/mcp/bin/mneme-mcp.mjs#L399-L409)

只宣告工具。

<details>
<summary>查看原文（11行）</summary>

```text
async function dispatch(config, msg) {
  switch (msg.method) {
    case "initialize": {
      const requested = typeof msg.params?.protocolVersion === "string" ? msg.params.protocolVersion : LATEST_PROTOCOL_VERSION;
      return {
        protocolVersion: SUPPORTED_PROTOCOL_VERSIONS.includes(requested) ? requested : LATEST_PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: SERVER_NAME, version: PKG_VERSION },
        instructions:
          "dsh-mneme cross-session memory (six tools mirroring the in-DSH memory tools). " +
          "Data plane: the plugin's standalone API. Configure DSH_MNEME_URL / DSH_MNEME_TOKEN or ~/.dsh-mneme/cli.json."
```

</details>

**依据 3 · 源码核查**：[mcp/bin/mneme-mcp.mjs:457-462](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/mcp/bin/mneme-mcp.mjs#L457-L462)

取消没有状态收据。

```text
    // 通知（无 id）：不回复。initialized/cancelled 等一律静默。
    if (msg.id === undefined) return;
    dispatch(config, msg).then(
      (result) => write({ jsonrpc: "2.0", id: msg.id, result }),
      (error) => write({ jsonrpc: "2.0", id: msg.id, error: error?.code !== undefined && error?.message !== undefined ? error : rpcError(-32603, `internal error: ${String(error?.message ?? error)}`) })
    );
```

**依据 4 · 源码核查**：[dsh-mneme/lib/api-standalone.js:790-815](https://github.com/slow-stack/mneme/blob/35a79c1108cc59b01c86410a85a40e09164d6efd/dsh-mneme/lib/api-standalone.js#L790-L815)

已有HTTP scope必须作为基线。

<details>
<summary>查看原文（26行）</summary>

```text
      // --- GET /search: unified recall pipeline (keyword + vector + BM25) ----
      if (req.method === "GET" && pathname === "/search") {
        const q = url.searchParams.get("q") ?? "";
        // 上界是防御：topK 直接进召回（见 MAX_SEARCH_TOP_K 注释）。
        const limit = Math.min(Number(url.searchParams.get("topK") ?? url.searchParams.get("limit") ?? 20), MAX_SEARCH_TOP_K);
        const mode = url.searchParams.get("mode") ?? "auto";
        const rerank = url.searchParams.get("rerank") !== "false";
        const occurredFrom = url.searchParams.get("occurred_from") ?? null;
        const occurredTo = url.searchParams.get("occurred_to") ?? null;
        // scope 透传（issue #370）：searchMemories 本就收 scope，此前 8790 没有
        // 入口——第三方（daemon 桥接侧）声明身份后，A2 软加权与 strictScope 硬
        // 过滤才在检索面同样成立；与 /context 同口径（scopeFromSearchParams）。
        const scope = scopeFromSearchParams(url);
        const query = q.trim();
        if (!query) {
          sendJson(res, 200, { items: [], mode: "keyword" });
          return;
        }
        // Any vector/rerank failure degrades to keyword inside searchMemories.
        void Promise.resolve(
          service.searchMemories(query, {
            mode,
            topK: limit,
            useRerank: rerank,
            ...(scope ? { scope } : {}),
            ...(occurredFrom !== null || occurredTo !== null ? { occurredFrom, occurredTo } : {})
```

</details>

#### 缺口

- 上下文契约和操作结果查询尚无实现/对照。
  **影响**：无法保证误归属或恢复成本改善。
  **进一步探讨**：先比较文档修正/手工参数替代，再决定是否需要新协议。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
