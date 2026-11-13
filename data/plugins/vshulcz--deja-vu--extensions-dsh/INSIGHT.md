# dsh-deja

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[31f7328](https://github.com/vshulcz/deja-vu/tree/31f7328bba06c2cb30b5163be859a4530ffb5d3e/extensions/dsh)

<!-- BEGIN META -->
[![GitHub ★ 1,525](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C525&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vshulcz/deja-vu) [![npm 30d 8,755](https://img.shields.io/static/v1?label=npm+30d&message=8%2C755&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deja) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deja)
<!-- END META -->

> **功能**：在 DSH 中搜索本机编码助手历史，并可为当前会话召回相关上下文。

> **亮点**：[Q01](#research-q01) 将跨助手检索接入模型工具，并提供限定 DSH 会话的 Web 全文路径。索引和命中质量由 deja 提供。

> **主要限制**：[Q02](#research-q02) 自动路径的 CLI 失败会退为空，成功返回的上下文可进入模型。人工 Web 端点依赖宿主路由的访问控制。

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
  - [Q01 · 模型跨助手检索与 Web 侧栏全文检索为什么给出不同范围？](#detail-section-11)
  - [Q02 · 旧历史如何进入模型上下文，手动端点和自动调用如何降级？](#detail-section-12)
  - [Q03 · 只做人工全文检索时怎样确定是否值得启用？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：曾使用多个编码助手的开发者想复用本机旧会话，也需要按正文找到 DSH 自身的历史讨论。

DSH 自带标题或会话检索，跨助手可到终端运行 deja 并人工打开或粘贴记录。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 跨助手历史 | 按具体标识找旧讨论 | 取决于 deja 索引 |
| Web 全文 | 从 DSH 会话正文定位记录 | 过滤非 DSH 命中 |
| 自动召回 | 为模型提供旧上下文 | 需审查实际送模范围 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 可运行 deja CLI 与本机历史 | 是 | 索引查询 | 检查缺失或退回原生搜索 |
| 兼容 DSH connection 和 webServer | Web 需要 | 注册人工端点 | 用 CLI 或宿主标题 |
| systemPrompt | 自动召回需要 | 组装模型上下文 | 保持自动召回关闭 |

| 步骤 | 谁操作 | 操作与结果 | 失败处理 |
| --- | --- | --- | --- |
| 准备 | 开发者 | 选择非敏感测试会话，关闭自动召回 | 无法隔离则停止 |
| 核对 | 开发者 | 搜索唯一标识并打开原文 | 核对 CLI 状态、索引范围 |
| 退出 | 开发者 | 保留或切回原生搜索 | 按需移除测试索引 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 二进制及磁盘空间 | 准备并对照索引 | 索引规模未测 |
| 持续 | 查询进程与潜在模型上下文 | 核实原文及时效 | 自动同步最长设置 20 秒 |
| 恢复 | 重试与日志资源 | 区别无命中和 CLI 失败 | 自动路径吞错 |
| 退出 | 本地索引残留未知 | 关闭自动召回并核对历史 | 回宿主标题与手动日志 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 网页正文搜索 | DSH 范围过滤、错误回执 | 真实索引覆盖和打开成功率 |
| 自动召回 | prompt 上下文接入 | 正确召回及实际送模内容 |

> **思考**：[Q02](#research-q02) 自动路径的 CLI 失败会退为空，成功返回的上下文可进入模型。人工 Web 端点依赖宿主路由的访问控制。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将跨助手检索接入模型工具，并提供限定 DSH 会话的 Web 全文路径。索引和命中质量由 deja 提供。

[Q02](#research-q02) 手动端点用异步无 shell 且可取消，自动调用保留同步执行和统一空串降级，两者需分别测错误分类。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 自动路径的 CLI 失败会退为空，成功返回的上下文可进入模型。人工 Web 端点依赖宿主路由的访问控制。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 用非敏感历史先核人工 Web 路径，比较原生搜索及命中打开结果。会话权限和索引范围不明时保留原有流程。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认两条检索路径的范围和错误处理。索引覆盖、路由权限和合格任务收益仍需验证。版本提示是待验证假设。

- 已检查：作者 README、包清单、源码路径 extensions/dsh/README.md、extensions/dsh/client.js、extensions/dsh/index.js、extensions/dsh/search.js 及固定范围 inventory；组件：extensions/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读 extensions/dsh 的包、挂载、CLI 参数、自动上下文和网页路由。独立 deja 索引、核心 hook 新实现及真实宿主鉴权未核查。
- 下一步：隔离样本混合 DSH 和其他助手会话，模拟 CLI 缺失、超时与越权请求，分别查看网页和模型上下文。

**分析版本**

- **仓库**：[vshulcz/deja-vu](https://github.com/vshulcz/deja-vu)
- **版本号**：0.24.2（[固定提交 31f7328](https://github.com/vshulcz/deja-vu/tree/31f7328bba06c2cb30b5163be859a4530ffb5d3e)）
- **版本日期**：2026-11-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 在已有项目和更新时间的基础上加源版本确认，试验是否能减少把过期历史当作当前事实。

隔离样本混合 DSH 和其他助手会话，模拟 CLI 缺失、超时与越权请求，分别查看网页和模型上下文。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 2126 | 1640 | 377 | — |
| .md | source | 2 | 374 | — | — | 4633 |
| .js | test | 8 | 1766 | 1451 | 204 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/vshulcz/deja-vu/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 531](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=531&color=737b86&logo=github)](https://github.com/vshulcz/deja-vu/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 546](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=546&color=737b86&logo=github)](https://github.com/vshulcz/deja-vu/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用户能如何找回其他编码助手或本身旧会话，主动搜索和自动召回的权限及故障边界各在哪里？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 模型跨助手检索与 Web 侧栏全文检索为什么给出不同范围？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

模型工具 deja_recall 从调用会话的工作目录发起命名参数检索，目标是找旧错误、文件讨论或决策。Web 则走独立 /api/deja-search，参数明确传 --harness deepseek，解析后再次过滤非 deepseek 的记录并规范化 session ID，只留最多 20 条命中及每条最多 3 段。网页查询走单独快捷键并保留宿主标题搜索，真正增量是从旧全文索引找到可打开的 DSH 会话，并在另一入口沿原工具查跨助手历史。扩展没有实现底层索引，README 的历史覆盖和基准是作者声明。

#### 证据与依据

**依据 1 · 作者声明**：[extensions/dsh/README.md:9-17](https://github.com/vshulcz/deja-vu/blob/31f7328bba06c2cb30b5163be859a4530ffb5d3e/extensions/dsh/README.md#L9-L17)

项目描述 DSH 原生与跨助手历史的不同任务。

```text
DeepSeek Harness can already search its own sessions — that is what the built-in
`session-query` subsystem does. This plugin answers the other question: what you
did in the *other* agents on this machine.

deja indexes the session files that forty-two other coding agents — Claude Code,
Codex, Cursor, opencode, Antigravity, Grok Build, Kimi, Cline and Zed among
them — already write to disk. Nothing has to have been recorded ahead of time: the history is already
there, including the months before deja was installed. If you moved to dsh last
week, everything you did before last week is still reachable from inside it.
```

**依据 2 · 源码核查**：[extensions/dsh/index.js:112-139](https://github.com/vshulcz/deja-vu/blob/31f7328bba06c2cb30b5163be859a4530ffb5d3e/extensions/dsh/index.js#L112-L139)

工具参数、分页与工作目录。

<details>
<summary>查看原文（28行）</summary>

```text
  guarded(() => ctx.tools.register(defineTool({
    name: "deja_recall",
    description:
      "Search this machine's own past AI coding sessions — every agent used on it, including months before deja was installed. Use before debugging an error or re-implementing anything that may already exist, and before the first edit in a task and before calling a change done or ready to merge. Match on the most specific token available: an exact error string, function name, file path or flag.",
    parameters: {
      query: {
        type: "string",
        required: true,
        description: "1-3 exact terms: a file path, an error string, a flag or identifier.",
      },
      limit: {
        type: "number",
        description: "How many sessions to return. Default 5.",
      },
      offset: {
        type: "number",
        description: "Sessions to skip, from the offset the previous page named. Default 0.",
      },
    },
    output: TEXT_OUTPUT,
    execute(args, exec) {
      // The page the MCP recall tool serves, framed and budgeted by deja. It
      // puts the project of its working directory first, so it runs in the
      // calling session's workspace rather than wherever dsh was launched.
      const call = recallArgv(args);
      const out = run(call, undefined, sessionCwd(exec && exec.agent));
      return Promise.resolve(answer(out || (INSTALLED ? recallSilence(call) : "")));
    },
```

</details>

**依据 3 · 源码核查**：[extensions/dsh/search.js:11-19](https://github.com/vshulcz/deja-vu/blob/31f7328bba06c2cb30b5163be859a4530ffb5d3e/extensions/dsh/search.js#L11-L19)

网页调用 CLI 时限制 deepseek 与命中上限。

```text
export const SEARCH_PATH = "/api/deja-search";
export const SEARCH_LIMIT = 20;
export const SEARCH_TIMEOUT = 20000;
export const SEARCH_MAX_BUFFER = 2 * 1024 * 1024;

// Keep the entire query one argv entry, including command names and flags.
export function searchArgv(query) {
  return ["search", "--harness", "deepseek", "--json", "--limit", String(SEARCH_LIMIT), "--", query];
}
```

**依据 4 · 源码核查**：[extensions/dsh/search.js:46-74](https://github.com/vshulcz/deja-vu/blob/31f7328bba06c2cb30b5163be859a4530ffb5d3e/extensions/dsh/search.js#L46-L74)

二次过滤、规范化会话标识及截取。

<details>
<summary>查看原文（29行）</summary>

```text
export function normalizeSearchResult(payload) {
  // Older deja releases emitted a bare array for exact matches.
  const rows = Array.isArray(payload) ? payload : payload?.hits;
  // Go encodes a nil hit slice as null when there are no matches.
  if (!Array.isArray(rows) && !(rows === null && payload && !Array.isArray(payload))) {
    throw new Error("invalid search envelope");
  }
  const hits = [];
  for (const row of rows || []) {
    const session = row?.session;
    if (session?.harness !== "deepseek" || !text(session.id)) continue;
    const bare = session.id.replace(/^session-/, "");
    if (!bare) continue;
    hits.push({
      sessionId: `session-${bare}`,
      title: text(session.title),
      project: text(session.project),
      updated: text(session.updated),
      snippets: Array.isArray(row.snippets) ? row.snippets.filter((s) => typeof s === "string").slice(0, 3) : [],
      count: number(row.count),
      score: number(row.score),
    });
  }
  const total = Array.isArray(payload) ? rows.length : Math.max(0, number(payload.total));
  return {
    hits: hits.slice(0, SEARCH_LIMIT),
    hasMore: payload.capped === true || total > (rows || []).length || hits.length > SEARCH_LIMIT,
    total,
    tier: text(payload.tier),
```

</details>

**依据 5 · 源码核查**：[extensions/dsh/client.js:967-982](https://github.com/vshulcz/deja-vu/blob/31f7328bba06c2cb30b5163be859a4530ffb5d3e/extensions/dsh/client.js#L967-L982)

路由未证实时保留原快捷键，Deja 使用独立入口。

<details>
<summary>查看原文（16行）</summary>

```text
      // are on, and claims the sidebar search it opens. An unproven route is
      // a pass: the key stays DSH's until the probe confirms the search this
      // shortcut opens can actually answer.
      const takeoverEnabled = () => route.getSnapshot() === "present"
        && prefs.getSnapshot().sidebar && prefs.getSnapshot().opensDeja;
      ctx.inject(["shortcuts"], (c) => {
        // Same loud-failure rule as the installFind registration above: a
        // rejected default must surface, not leave the chord silently dead.
        c.effect(() => c.shortcuts.register({
            id: "deja.search-sessions",
            label: () => "Deja: search DSH conversations",
            aliases: ["deja search", "search conversations"],
            // DSH's native session.search owns primary+K, so Deja uses the
            // primary+shift+K chord. The native Mod+K title search is left
            // alone.
            defaults: Object.fromEntries([
```

</details>

#### 缺口

- 当前部署中索引覆盖与会话打开兼容未知
  **影响**：侧栏出现命中仍可能无法回到真实原文
  **进一步探讨**：用同项目的已知 DSH 会话和其他助手会话逐个对照

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 旧历史如何进入模型上下文，手动端点和自动调用如何降级？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

宿主 apply 分别装配用户检索和召回，手动搜索路由在关闭自动召回时仍注册。自动召回绑定最近用户文本、工作目录、会话和压缩触发，生成的上下文经 inert 后返回 systemPrompt，因此本地执行检索不能推断其内容始终留在本机。自动调用的同步 execFileSync 设置 20 秒及缓冲上限，异常统一变成空串。手动搜索异步、无 shell，将整条查询放单一参数并传 signal，能区分 CLI 缺失、超时、异常输出及无命中。端点挂在宿主连接服务，插件 handler 本身无按工作区过滤参数，宿主登录和 Origin 约束仍须按环境验证。

#### 证据与依据

**依据 1 · 源码核查**：[extensions/dsh/index.js:63-78](https://github.com/vshulcz/deja-vu/blob/31f7328bba06c2cb30b5163be859a4530ffb5d3e/extensions/dsh/index.js#L63-L78)

同步 CLI 的超时与异常退为空。

<details>
<summary>查看原文（16行）</summary>

```text
// run returns stdout, or "" when deja is missing or says nothing. Memory is
// optional everywhere: a throw here would end the turn.
function run(args, input, cwd) {
  try {
    return execFileSync(DEJA, args, {
      windowsHide: true,
      cwd,
      encoding: "utf8",
      timeout: 20000,
      maxBuffer: 8 * 1024 * 1024,
      input,
      stdio: [input === undefined ? "ignore" : "pipe", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
```

</details>

**依据 2 · 源码核查**：[extensions/dsh/index.js:404-434](https://github.com/vshulcz/deja-vu/blob/31f7328bba06c2cb30b5163be859a4530ffb5d3e/extensions/dsh/index.js#L404-L434)

按会话和目录缓存并将结果接到模型上下文。

<details>
<summary>查看原文（31行）</summary>

```text
    ctx.systemPrompt.context({
      name: "deja:recall",
      order: 120,
      interpolate: false,
      text: (assembly) => {
        const agent = assembly && assembly.agent;
        if (!agent) return "";
        const prompt = lastHumanText(agent);
        if (!prompt) return "";
        const cwd = sessionCwd(agent);
        const sid = sessionId(agent);
        const afterCompaction = compacted.delete(sid);
        // The same question asked in another workspace is a different question,
        // and so is one asked again after its session compacted: deja then
        // answers with the recovery packet, which only a prompt naming the
        // session gets back.
        if (prompt !== asked || cwd !== askedIn || sid !== askedBy || afterCompaction) {
          asked = prompt;
          askedIn = cwd;
          askedBy = sid;
          recalled = inert(askHook(
            ["hook-prompt", "--plain"],
            ["hook-prompt"],
            JSON.stringify({ prompt, cwd, session_id: sid }),
            sid,
            board,
          ));
        }
        // Silence is the common case: this speaks only when the history answers.
        return recalled;
      },
```

</details>

**依据 3 · 源码核查**：[extensions/dsh/index.js:695-709](https://github.com/vshulcz/deja-vu/blob/31f7328bba06c2cb30b5163be859a4530ffb5d3e/extensions/dsh/index.js#L695-L709)

独立控制人工搜索、工具和自动注入。

<details>
<summary>查看原文（15行）</summary>

```text
  const board = noteBoard();
  // User-initiated search remains available when automatic recall is disabled.
  installSearchRoute(ctx, DEJA);
  if (adds.tools) tools(ctx);
  if (adds.command) command(ctx, board);
  if (adds.recall) {
    autoDigest(ctx, board);
    autoRecall(ctx, board);
    notesRoute(ctx, board);
    toolNotes(ctx);
    sessionEnds(ctx);
  }
}

apply.inject = ["tools", "commands", "systemPrompt"];
```

</details>

**依据 4 · 源码核查**：[extensions/dsh/search.js:21-39](https://github.com/vshulcz/deja-vu/blob/31f7328bba06c2cb30b5163be859a4530ffb5d3e/extensions/dsh/search.js#L21-L39)

命令执行无 shell、超时和 signal。

<details>
<summary>查看原文（19行）</summary>

```text
// A callback seam lets tests exercise the actual process options without
// starting a shell, touching an index, or reading anybody's session history.
export function createSearchExecutor(execute = execFile) {
  return (binary, args, signal) => new Promise((resolve, reject) => {
    try {
      execute(binary, args, {
        shell: false,
        windowsHide: true,
        encoding: "utf8",
        timeout: SEARCH_TIMEOUT,
        maxBuffer: SEARCH_MAX_BUFFER,
        ...(signal ? { signal } : {}),
      }, (error, stdout) => {
        if (error) reject(error);
        else resolve(String(stdout || ""));
      });
    } catch (error) {
      reject(error);
    }
```

</details>

**依据 5 · 源码核查**：[extensions/dsh/search.js:82-125](https://github.com/vshulcz/deja-vu/blob/31f7328bba06c2cb30b5163be859a4530ffb5d3e/extensions/dsh/search.js#L82-L125)

错误、查询上限、取消和返回结构。

<details>
<summary>查看原文（44行）</summary>

```text
function failure(status, code, message) {
  return json({ hits: [], hasMore: false, error: { code, message } }, status);
}

function executionFailure(error) {
  if (error?.code === "ENOENT") return failure(503, "unavailable", "Deja is not installed or could not be found.");
  if (error?.code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER") return failure(502, "output_limit", "Deja search exceeded the output limit.");
  if (error?.killed || error?.code === "ETIMEDOUT") return failure(504, "timeout", "Deja search timed out.");
  return failure(502, "search_failed", "Deja search failed. Check the local Deja installation and index.");
}

export function createSearchHandler(binary, { run = createSearchExecutor() } = {}) {
  return async (request) => {
    if (request.method !== "GET") return failure(405, "method_not_allowed", "Use GET for search.");
    let query;
    let url;
    try {
      url = new URL(request.url);
      query = (url.searchParams.get("q") || "").trim();
    } catch {
      return failure(400, "invalid_request", "Invalid search URL.");
    }
    // The probe answers before any deja work: the browser only needs to know
    // whether this route exists and which plugin serves it.
    if (url.searchParams.has("probe")) {
      return json({ ok: true, plugin: "dsh-deja", version: VERSION });
    }
    if (!query) return json({ hits: [], hasMore: false, total: 0, tier: "" });
    if (query.length > 500) return failure(400, "query_too_long", "Search queries must be at most 500 characters.");
    const cancelled = () => failure(499, "cancelled", "Deja search was cancelled.");
    if (request.signal?.aborted) return cancelled();
    if (!binary) return failure(503, "unavailable", "Deja is not installed or could not be found.");
    let stdout;
    try {
      stdout = await run(binary, searchArgv(query), request.signal);
    } catch (error) {
      return request.signal?.aborted ? cancelled() : executionFailure(error);
    }
    if (request.signal?.aborted) return cancelled();
    try {
      return json(normalizeSearchResult(JSON.parse(stdout)));
    } catch {
      return failure(502, "invalid_output", "Deja returned invalid search data. Update Deja and try again.");
    }
```

</details>

**依据 6 · 源码核查**：[extensions/dsh/search.js:129-143](https://github.com/vshulcz/deja-vu/blob/31f7328bba06c2cb30b5163be859a4530ffb5d3e/extensions/dsh/search.js#L129-L143)

由宿主注入连接路由，注册失败可静默。

<details>
<summary>查看原文（15行）</summary>

```text
// Match notesRoute: DSH's API mount supplies its Host/Origin and login fence.
// Cordis owns route disposal; duplicate/older/headless hosts may stand down.
export function installSearchRoute(ctx, binary, options) {
  if (typeof ctx?.inject !== "function") return;
  try {
    ctx.inject(["connection", "webServer"], (c) => {
      try {
        c.connection.fetch.register({
          path: SEARCH_PATH,
          methods: ["GET"],
          requestBody: "buffered",
          fetch: createSearchHandler(binary, options),
        });
      } catch {}
    });
```

</details>

#### 缺口

- 未核实目标宿主的实际路由权限和模型请求内容
  **影响**：决定可否索引有保密要求的历史
  **进一步探讨**：用非敏感样本检查未授权路由、切工作区及模型请求体

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 只做人工全文检索时怎样确定是否值得启用？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

先选一条只在会话正文出现的标识，比较宿主标题搜索与 Web Deja 能否找到并打开正确原文。在脱敏本地历史和兼容宿主上，手动查找能保留人工确认，减少切终端与复制命中，但安装二进制、索引和验证结果仍有负担。查询错误应单列，勿把无匹配当作索引完整。可试在命中旁明确标识工作区与记录时间，并引导核对对应源版本；对照现有标题、project、updated 字段及人工确认，如果误用过期记录比例不降，就不增加提示。

#### 证据与依据

**依据 1 · 源码核查**：[extensions/dsh/search.js:53-75](https://github.com/vshulcz/deja-vu/blob/31f7328bba06c2cb30b5163be859a4530ffb5d3e/extensions/dsh/search.js#L53-L75)

结果已有 project 和 updated，可以作为提示试验的现有基线。

<details>
<summary>查看原文（23行）</summary>

```text
  const hits = [];
  for (const row of rows || []) {
    const session = row?.session;
    if (session?.harness !== "deepseek" || !text(session.id)) continue;
    const bare = session.id.replace(/^session-/, "");
    if (!bare) continue;
    hits.push({
      sessionId: `session-${bare}`,
      title: text(session.title),
      project: text(session.project),
      updated: text(session.updated),
      snippets: Array.isArray(row.snippets) ? row.snippets.filter((s) => typeof s === "string").slice(0, 3) : [],
      count: number(row.count),
      score: number(row.score),
    });
  }
  const total = Array.isArray(payload) ? rows.length : Math.max(0, number(payload.total));
  return {
    hits: hits.slice(0, SEARCH_LIMIT),
    hasMore: payload.capped === true || total > (rows || []).length || hits.length > SEARCH_LIMIT,
    total,
    tier: text(payload.tier),
  };
```

</details>

**依据 2 · 源码核查**：[extensions/dsh/search.js:104-124](https://github.com/vshulcz/deja-vu/blob/31f7328bba06c2cb30b5163be859a4530ffb5d3e/extensions/dsh/search.js#L104-L124)

探测、失败和取消可分别观测。

<details>
<summary>查看原文（21行）</summary>

```text
    // The probe answers before any deja work: the browser only needs to know
    // whether this route exists and which plugin serves it.
    if (url.searchParams.has("probe")) {
      return json({ ok: true, plugin: "dsh-deja", version: VERSION });
    }
    if (!query) return json({ hits: [], hasMore: false, total: 0, tier: "" });
    if (query.length > 500) return failure(400, "query_too_long", "Search queries must be at most 500 characters.");
    const cancelled = () => failure(499, "cancelled", "Deja search was cancelled.");
    if (request.signal?.aborted) return cancelled();
    if (!binary) return failure(503, "unavailable", "Deja is not installed or could not be found.");
    let stdout;
    try {
      stdout = await run(binary, searchArgv(query), request.signal);
    } catch (error) {
      return request.signal?.aborted ? cancelled() : executionFailure(error);
    }
    if (request.signal?.aborted) return cancelled();
    try {
      return json(normalizeSearchResult(JSON.parse(stdout)));
    } catch {
      return failure(502, "invalid_output", "Deja returned invalid search data. Update Deja and try again.");
```

</details>

**依据 3 · 源码核查**：[extensions/dsh/client.js:861-869](https://github.com/vshulcz/deja-vu/blob/31f7328bba06c2cb30b5163be859a4530ffb5d3e/extensions/dsh/client.js#L861-L869)

客户端显式显示 API 失败。

```text
    async function searchHistory(query, signal) {
      const response = await fetch("api/deja-search?q=" + encodeURIComponent(query), {
        credentials: "same-origin", cache: "no-store", headers: { accept: "application/json" }, signal,
      });
      let body;
      try { body = await response.json(); } catch { throw new Error("Deja search is unavailable. Update the dsh-deja host plugin."); }
      if (!response.ok || body.error) throw new Error(body.error?.message || "Deja search is unavailable.");
      if (!Array.isArray(body.hits)) throw new Error("Deja returned invalid search data.");
      return body;
```

**依据 4 · 源码核查**：[extensions/dsh/index.js:695-706](https://github.com/vshulcz/deja-vu/blob/31f7328bba06c2cb30b5163be859a4530ffb5d3e/extensions/dsh/index.js#L695-L706)

关闭自动注入仍可测试人工路径。

<details>
<summary>查看原文（12行）</summary>

```text
  const board = noteBoard();
  // User-initiated search remains available when automatic recall is disabled.
  installSearchRoute(ctx, DEJA);
  if (adds.tools) tools(ctx);
  if (adds.command) command(ctx, board);
  if (adds.recall) {
    autoDigest(ctx, board);
    autoRecall(ctx, board);
    notesRoute(ctx, board);
    toolNotes(ctx);
    sessionEnds(ctx);
  }
```

</details>

#### 缺口

- 同任务耗时、索引维护与打开成功率未测
  **影响**：无法判断持续使用的净收益
  **进一步探讨**：用同批带期望答案的旧会话分别比较原生、CLI 和 Web 搜索

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
