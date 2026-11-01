# dsh-deja

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[232ff95](https://github.com/vshulcz/deja-vu/tree/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh)

<!-- BEGIN META -->
[![GitHub ★ 1,343](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C343&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vshulcz/deja-vu) [![npm 30d 5,751](https://img.shields.io/static/v1?label=npm+30d&message=5%2C751&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deja) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deja)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中搜索并召回本机其他编码助手的会话历史。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 展示 DSH 工具与历史 CLI 的接线；上游索引机制和实际效果不归因于扩展。

> **主要限制**：[Q03](#research-q03) 某些错误可变为空结果，[Q04](#research-q04) 本地查询不保证召回内容不会进入云模型。

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
  - [Q01 · 迁移开发者用它寻找什么，和宿主本机历史查询如何分工？](#detail-section-11)
  - [Q02 · 查询怎样变为 CLI 调用及宿主可见结果？](#detail-section-12)
  - [Q03 · 自动召回什么时候注入、失败和停用怎样处理？](#detail-section-13)
  - [Q04 · 本地索引意味着无数据出站吗，注入内容如何约束？](#detail-section-14)
  - [Q05 · 安装与使用依赖、恢复成本和适用人群是什么？](#detail-section-15)
  - [Q06 · 能否让使用历史决策的开发者识别跨项目和过时信息？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有同机编码助手旧历史的开发者，希望在 DSH 查找旧错误、文件讨论和决定。

用户可直接搜索原始日志或使用 DSH 自有会话查询；核心索引由独立 CLI 提供。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| deja_recall | 查询过往会话 | 依赖 CLI；分页 1–20 项 |
| deja_session / deja_blame | 查会话和文件历史 | 需已有历史，输出未独立核验 |
| deja_fix / deja_how | 查过去修复及命令 | 历史命令不保证当前适用 |
| deja_remember | 记录已确定决策 | 依赖 CLI 实际写入 |
| /deja | 人工查询旧记录 | 空结果可能掩盖 CLI 故障 |
| 自动上下文 | 召回项目和用户问题历史 | 可能进入远端模型请求 |

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
|---|---|---|---|
| DSH 与 systemPrompt | 自动召回需要 | 向宿主注册上下文 | 不能注入或兼容未知 |
| deja 可执行程序 | 查询需要 | 搜索与召回本机历史 | 显示缺失或结果为空 |
| dsh-tools | 模型工具需要 | 注册工具 | 跳过模型工具 |
| 旧日志与访问权限 | 有效召回需要 | 提供历史来源 | 可能没有匹配 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认历史权限和模型目的地 | 数据不可外发时关闭自动召回 |
| 查询 | 手动输入 /deja 及具体标识 | 无结果时检查 CLI 是否出错 |
| 使用 | 开发者回查来源和当前项目 | 过时或项目不符时不作为约束 |
| 恢复 | 检查二进制、版本与宿主 | 不能区分错误时直接查原始日志 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本机存储及模型费用未知 | 确认 CLI 和历史访问权 | 索引质量未知 |
| 持续 | 召回、模型上下文和运行资源未知 | 查验来源及历史时效 | 同步超时最长 20 秒 |
| 恢复 | 故障排查资源未知 | 判断空结果和错误 | 失败可被吞并为无结果 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 检索 | CLI 工具及分页参数接线 | 历史覆盖率与准确率 |
| 自动召回 | 会话和工作目录触发上下文 | 实际宿主送模与效果 |
| 格式处理 | 模板占位符惰化 | 敏感信息清除和语义安全 |

> **思考**：[Q03](#research-q03) 某些错误可变为空结果，[Q04](#research-q04) 本地查询不保证召回内容不会进入云模型。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 展示 DSH 工具与历史 CLI 的接线；上游索引机制和实际效果不归因于扩展。

[Q02](#research-q02) 命名参数和分页减少输入歧义，[Q03](#research-q03) 同步子进程及空结果降级仍影响可诊断性。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 某些错误可变为空结果，[Q04](#research-q04) 本地查询不保证召回内容不会进入云模型。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 先以手动 /deja 检索一个已知历史并回查原文；不能允许内容外发或项目来源无法核实时关闭自动召回。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定扩展源码和 README 已查；未运行宿主、CLI 或网络。

- 已检查：作者 README、包清单、源码路径 extensions/dsh/README.md、extensions/dsh/index.js、extensions/dsh/lib.js、extensions/dsh/package.json 及固定范围 inventory；组件：extensions/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定版本 extensions/dsh 的清单、README、工具、命令、自动上下文与帮助函数；不研究独立核心的索引、解析、脱敏或所有协议，不运行目标代码。
- 下一步：固定宿主和假 CLI，比较命中、空值、错误、超时与会话切换；按 [Q06](#research-q06) 用带来源真值的任务评估过时引用。

**分析版本**

- **仓库**：[vshulcz/deja-vu](https://github.com/vshulcz/deja-vu)
- **版本号**：0.23.3（[固定提交 232ff95](https://github.com/vshulcz/deja-vu/tree/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 假设逐条展示来源、版本关系并让作者确认可减少过期历史误用；须先核对核心已有能力且未验证。

固定宿主和假 CLI，比较命中、空值、错误、超时与会话切换；按 [Q06](#research-q06) 用带来源真值的任务评估过时引用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 1189 | 843 | 270 | — |
| .md | source | 2 | 172 | — | — | 1957 |
| .js | test | 4 | 825 | 629 | 133 | — |

</details>

**活跃度**

[![Issue 未关闭 18](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=18&color=737b86&logo=github)](https://github.com/vshulcz/deja-vu/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 648](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=648&color=737b86&logo=github)](https://github.com/vshulcz/deja-vu/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z) [![近30天关闭 690](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=690&color=737b86&logo=github)](https://github.com/vshulcz/deja-vu/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 扩展调用本机历史、自动注入与数据边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 迁移开发者用它寻找什么，和宿主本机历史查询如何分工？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README:7-15 将场景描述为从其他本机编码助手的旧会话寻找先前错误修复、文件讨论与决定，区别于 DSH 自己的会话搜索。index.js:111-137 把历史检索注册为模型工具，也可通过 /deja 手动搜。适配层负责 DSH 接线、上下文和结果传递，索引、解析与历史内容属于独立 deja 可执行程序；不能把作者列出的 42 种助手、索引质量或脱敏效果当成本组件已核实能力。手动搜索原始日志也是基线，任务收益和需求频率未经同条件比较。

#### 证据与依据

**依据 1 · 作者声明**：[extensions/dsh/README.md:7-15](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/README.md#L7-L15)

作者描述原生会话与其他助手历史。

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

**依据 2 · 作者声明**：[extensions/dsh/README.md:40-58](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/README.md#L40-L58)

作者描述工具、命令和自动召回。

<details>
<summary>查看原文（19行）</summary>

```text
## What it adds

Six tools the model can call:

| Tool | Answers |
|---|---|
| `deja_recall` | Sessions matching an error string, function name, file path or flag. |
| `deja_session` | The full digest of one past session, when the reasoning behind it matters. |
| `deja_blame` | The sessions that discussed a file, before you edit or delete it. |
| `deja_fix` | What this machine ran after that same error before. |
| `deja_how` | The real invocation for a build, test or deploy, from what ran here. |
| `deja_remember` | Stores one settled decision for later recall. |

One command: `/deja <what to look for>`.

And, unless you turn it off, automatic recall: once per session the plugin adds
what past sessions settled in this project, and before each step it asks deja
whether this machine's history answers the prompt and adds the answer to the
runtime context. Silence is the common case — it speaks only when there is
```

</details>

**依据 3 · 源码核查**：[extensions/dsh/index.js:111-137](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/index.js#L111-L137)

模型工具注册与检索调用。

<details>
<summary>查看原文（27行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[extensions/dsh/index.js:229-251](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/index.js#L229-L251)

用户命令与查询返回。

<details>
<summary>查看原文（23行）</summary>

```text
function command(ctx, board) {
  guarded(() => ctx.commands.register({
    name: "deja",
    description: "Search this machine's past AI coding sessions",
    input: { hint: "what to look for" },
    async handler(invocation) {
      const query = String((invocation && invocation.rawInput) || "").trim();
      if (!query) {
        return { kind: "error", text: "Say what to look for: /deja <error, file, or decision>" };
      }
      // Named, not handed over as deja's first word: the bare-query path
      // dispatches a word that happens to be a command, so `/deja version`
      // printed a version number and `/deja index` rebuilt the index, and one
      // of the words people most want history about is `install`.
      const out = run(argv("search", [], query));
      if (!INSTALLED) return { kind: "error", text: MISSING };
      // Outside dsh web a person sees nothing the hooks print — the digest
      // goes to the model — so the reply to /deja is where deja's own notes
      // reach them. In dsh web the session's lines may still be waiting on the
      // board for a page that has not asked; they go here, once, instead.
      const waiting = board ? board.take(sessionId(invocation && invocation.agent)) : [];
      const notes = [...waiting, run(["hook-context", "--notes"])].filter(Boolean).join("\n");
      return { kind: "success", text: notes ? answer(out) + "\n\n" + notes : answer(out) };
```

</details>

#### 缺口

- 未核实实际历史覆盖、同机查询质量及用户节时
  **影响**：不能以作者数量声称或接线推定效果
  **进一步探讨**：固定已有历史和查询集，对照手动查找与 DSH 内搜索。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 查询怎样变为 CLI 调用及宿主可见结果？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

index.js:31-57 依次尝试 DEJA_BIN、PATH、随包二进制并执行 version 探测；64-76 通过 execFileSync 执行，20 秒超时、8 MiB 输出上限，异常返回空字符串。index.js:111-137 注册 deja_recall 并使用会话工作目录；lib.js:19-21、31-50 以参数数组和必要的 -- 保护前导横线，限制每页 1–20 项并支持 offset，首屏空结果与异常仍难区分。会话、文件、修复、命令和记忆等工具分别转成 CLI 命令；模型真正收到何种结果仍取决于宿主和外部可执行程序，未运行。

#### 证据与依据

**依据 1 · 源码核查**：[extensions/dsh/index.js:31-57](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/index.js#L31-L57)

命令路径顺序与版本探测。

<details>
<summary>查看原文（27行）</summary>

```text
// resolveDeja picks the binary in the order a user would expect: what they
// pointed at, then the deja they installed themselves and keep current with
// `deja update` or a package manager, and only then the copy npm brought along
// with this plugin. Each candidate is asked for its version rather than
// trusted, because a name on PATH that does not run is worse than no name.
function resolveDeja() {
  const exe = PLATFORM === "windows" ? "deja.exe" : "deja";
  const candidates = [process.env.DEJA_BIN, exe];
  try {
    candidates.push(require.resolve(`@vshulcz/deja-vu-${PLATFORM}-${ARCH}/bin/${exe}`));
  } catch {}

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      execFileSync(candidate, ["version"], {
        windowsHide: true,
        encoding: "utf8",
        timeout: 5000,
        stdio: ["ignore", "pipe", "ignore"],
      });
      return candidate;
    } catch {}
  }
  // Nothing answered. Keep the plain name so the failure a user sees names the
  // thing that is missing.
  return exe;
```

</details>

**依据 2 · 源码核查**：[extensions/dsh/index.js:62-76](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/index.js#L62-L76)

同步 CLI 超时和错误降级。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[extensions/dsh/index.js:111-137](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/index.js#L111-L137)

工具注册、工作目录与结果。

<details>
<summary>查看原文（27行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[extensions/dsh/lib.js:19-21](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/lib.js#L19-L21)

前导横线转参数终止符。

```text
export function argv(cmd, flags, text) {
  const arg = String(text);
  return arg.startsWith("-") ? [cmd, ...flags, "--", arg] : [cmd, ...flags, arg];
```

**依据 5 · 源码核查**：[extensions/dsh/lib.js:31-50](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/lib.js#L31-L50)

分页限制及空输出解释。

<details>
<summary>查看原文（20行）</summary>

```text
export function recallArgv(args) {
  const count = (v, fallback) => {
    const n = Math.trunc(Number(v));
    return v == null || v === "" || !Number.isFinite(n) ? fallback : n;
  };
  const limit = Math.min(20, Math.max(1, count(args && args.limit, 5)));
  const offset = Math.min(1e9, Math.max(0, count(args && args.offset, 0)));
  const flags = ["--limit", String(limit)];
  if (offset > 0) flags.push("--offset", String(offset));
  return argv("recall", flags, args && args.query);
}

// recallSilence is the answer when `deja recall` printed nothing. Past the
// first page that is a deja older than --offset refusing the flag, not an
// empty history: recall always prints a line, "No more matches" included.
export function recallSilence(call) {
  if (call.includes("--offset")) {
    return "This deja cannot page recall. Run deja update, then ask again with the same offset.";
  }
  return "Nothing in this machine's history matches that.";
```

</details>

**依据 6 · 源码核查**：[extensions/dsh/index.js:175-205](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/index.js#L175-L205)

修复和命令工具调用。

<details>
<summary>查看原文（31行）</summary>

```text
  guarded(() => ctx.tools.register(defineTool({
    name: "deja_fix",
    description:
      "What this machine ran after that same error before, in the sessions where the error did not come back. Paste the failing output verbatim rather than a paraphrase — the match is on the error's own words.",
    parameters: {
      error: {
        type: "string",
        required: true,
        description: "The failing output, copied as it was printed.",
      },
    },
    output: TEXT_OUTPUT,
    execute(args) {
      return Promise.resolve(answer(run(["--framed", ...argv("fix", [], args.error)])));
    },
  })));

  guarded(() => ctx.tools.register(defineTool({
    name: "deja_how",
    description:
      "The real invocation this machine uses for a build, test, deploy or script, with the flags it actually ran, ordered by how many sessions ran it. A guessed command is plausible and fails on this setup.",
    parameters: {
      what: {
        type: "string",
        required: true,
        description: "The thing to run: a tool, a task, a script name.",
      },
    },
    output: TEXT_OUTPUT,
    execute(args) {
      return Promise.resolve(answer(run(["--framed", ...argv("how", [], args.what)])));
```

</details>

#### 缺口

- 未运行不同 CLI 版本、宿主和分页错误
  **影响**：不能证明工具输出、兼容与实际搜索质量
  **进一步探讨**：隔离工作区调用真实或假 CLI 复现成功、空值、超时和分页。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自动召回什么时候注入、失败和停用怎样处理？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

apply 在 index.js:636-651 依据 config 和 CLI 已安装文件决定是否注册工具、命令和自动上下文；286-307 的项目摘要以 session ID 在进程内去重，344-383 的 prompt 上下文以最近用户文本、工作目录、会话和压缩状态刷新，调用 hook-prompt 并将结果返回给宿主。lib.js:62-68 捕获所有注册异常，run 将 CLI 失败归为空，因而正常无命中、调用失败和某些注册失败可能缺少显式区分；同步执行也可阻塞直到超时。配置与注册是源码路径，不证明宿主确实将其送给模型。

#### 证据与依据

**依据 1 · 源码核查**：[extensions/dsh/index.js:636-651](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/index.js#L636-L651)

按配置和已存在插件决定接线。

<details>
<summary>查看原文（16行）</summary>

```text
function apply(ctx, config) {
  const adds = contributions(
    { command: installedByCLI("command.js"), auto: installedByCLI("auto.js") },
    config,
  );
  const board = noteBoard();
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
```

</details>

**依据 2 · 源码核查**：[extensions/dsh/index.js:286-307](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/index.js#L286-L307)

项目摘要与会话去重。

<details>
<summary>查看原文（22行）</summary>

```text
function autoDigest(ctx, board) {
  const seen = new Set();

  guarded(() =>
    ctx.systemPrompt.context({
      name: "deja:project",
      order: 110,
      interpolate: false,
      text: (assembly) => {
        const agent = assembly && assembly.agent;
        if (!agent) return "";
        const sid = sessionId(agent);
        if (sid && seen.has(sid)) return "";
        if (sid) seen.add(sid);
        return inert(askHook(
          ["hook-context", "--plain"],
          ["hook-context"],
          JSON.stringify({ session_id: sid, cwd: sessionCwd(agent), source: "startup", deja_once: true }),
          sid,
          board,
        ));
      },
```

</details>

**依据 3 · 源码核查**：[extensions/dsh/index.js:344-383](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/index.js#L344-L383)

自动召回、键和压缩后的重新请求。

<details>
<summary>查看原文（40行）</summary>

```text
function autoRecall(ctx, board) {
  let asked = "";
  let askedIn = "";
  let askedBy = "";
  let recalled = "";
  const compacted = new Set();
  watchCompaction(ctx, compacted);

  guarded(() =>
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

**依据 4 · 源码核查**：[extensions/dsh/lib.js:62-68](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/lib.js#L62-L68)

注册异常被捕获。

```text
export function guarded(register) {
  try {
    register();
    return true;
  } catch {
    return false;
  }
```

**依据 5 · 源码核查**：[extensions/dsh/index.js:62-76](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/index.js#L62-L76)

调用失败返回空串及同步超时。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

#### 缺口

- 未测宿主重组 prompt、实际时延和失败可见性
  **影响**：不能确认模型收到历史或用户可区分所有失败
  **进一步探讨**：固定宿主和假 CLI 验证重试、压缩和失败展示。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 本地索引意味着无数据出站吗，注入内容如何约束？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

README:101-105 的本地索引、无 LLM 和索引脱敏是作者对上游的声明，本研究未审计其实现。扩展 index.js:344-383 把 hook 的历史回复作为 prompt 上下文交给宿主；宿主若使用云模型，该内容可能随请求外发，本地检索本身不能证明全链离线。lib.js:94-110 将大括号模板惰化，注册 interpolate=false，限制模板解释而不是验证事实或消除提示注入；项目、时效与授权仍需作者核实。浏览器备注与模型上下文分开（lib.js:164-184），不代表返回内容都被脱敏。

#### 证据与依据

**依据 1 · 作者声明**：[extensions/dsh/README.md:101-105](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/README.md#L101-L105)

作者关于本地检索和脱敏的声明。

```text
## What it does not do

No LLM, no embeddings. The index is a local BM25 store over files
that already exist, so a query answers in about a millisecond, with no network
path unless you ask for one. Secrets are redacted at index time.
```

**依据 2 · 源码核查**：[extensions/dsh/index.js:344-383](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/index.js#L344-L383)

历史回复进入 prompt 上下文。

<details>
<summary>查看原文（40行）</summary>

```text
function autoRecall(ctx, board) {
  let asked = "";
  let askedIn = "";
  let askedBy = "";
  let recalled = "";
  const compacted = new Set();
  watchCompaction(ctx, compacted);

  guarded(() =>
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

**依据 3 · 源码核查**：[extensions/dsh/lib.js:94-110](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/lib.js#L94-L110)

模板惰化的边界。

<details>
<summary>查看原文（17行）</summary>

```text
// inert keeps recalled text out of dsh's prompt templating. dsh reads every
// {{name}} in a context as a prompt variable and throws on one it does not
// know, which ends the turn before the model is called. Past sessions quote
// templates, and that very error, so one recall carrying {{cwd}} broke every
// turn after it (#5421). `interpolate: false` tells dsh 0.2.1-alpha.2 and later
// to leave the text alone; older hosts ignore it, and a listener on
// system-prompt/assemble may drop it, so the braces are split as well:
// { {cwd} } still reads as braces and holds no {{ to resolve.
export function inert(text) {
  return String(text || "").replace(/\{(?=\{)/g, "{ ").replace(/\}(?=\})/g, "} ");
}

// contributions says what this package adds, given what `deja install` already
// wrote into DSH_HOME and what the profile turned off. The rule is the same
// everywhere: fill the gaps, never repeat the installer.
//
// command.js and the mcp-deja profile row are written by the same install, so
```

</details>

**依据 4 · 源码核查**：[extensions/dsh/lib.js:164-184](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/lib.js#L164-L184)

模型上下文与人类备注拆分。

<details>
<summary>查看原文（21行）</summary>

```text
export function splitHookReply(stdout) {
  const text = String(stdout || "").trim();
  if (!text) return { context: "", notes: "" };
  const lines = text.split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (!line.startsWith("{")) continue;
    let reply;
    try {
      reply = JSON.parse(line);
    } catch {
      continue;
    }
    if (!reply || typeof reply !== "object" || Array.isArray(reply)) continue;
    if (!("hookSpecificOutput" in reply) && !("systemMessage" in reply)) continue;
    const out = reply.hookSpecificOutput;
    const context = out && typeof out.additionalContext === "string" ? out.additionalContext.trim() : "";
    const notes = typeof reply.systemMessage === "string" ? reply.systemMessage.trim() : "";
    return { context, notes };
  }
  return { context: text, notes: "" };
```

</details>

**依据 5 · 源码核查**：[extensions/dsh/index.js:337-341](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/index.js#L337-L341)

按 reader 分发两类输出。

```text
function askHook(plain, json, payload, sid, board) {
  if (!board.hasReader()) return run(plain, payload);
  const reply = splitHookReply(run(json, payload));
  board.push(sid, reply.notes);
  return reply.context;
```

#### 缺口

- 未核查外部索引脱敏、云模型传输和访问权限
  **影响**：不能证明秘密不泄漏或历史不影响模型
  **进一步探讨**：用合成敏感标记核对 CLI、宿主请求与云出站，审计外部核心。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 安装与使用依赖、恢复成本和适用人群是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

package.json:51-71 声明 Node >=18、DSH 0.1.1-rc.2 和 0.2.0-rc.2 兼容清单，并依赖 @vshulcz/deja-vu ^0.23.3；实际二进制优先级允许本机覆盖随包版本。缺少 dsh-tools 时 index.js:19-26、97-98 跳过模型工具，其余路径可能继续；CLI 调用超时和错误可呈空结果。对已有可信本机旧日志且需要跨工具查错的开发者，可先手动 /deja 查一次并核原始文件；没有历史、项目隔离无法保证或内容不可发送模型时不要启用自动召回。现金、索引维护、阻塞和人工回查时间未知，声明兼容不代表实测。

#### 证据与依据

**依据 1 · 源码核查**：[extensions/dsh/package.json:51-71](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/package.json#L51-L71)

运行及版本声明。

<details>
<summary>查看原文（21行）</summary>

```text
  ],
  "engines": {
    "node": ">=18"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    },
    "compatibility": {
      "dsh": "0.2.0-rc.2",
      "dshReleases": {
        "0.1.1-rc.2": "compatible",
        "0.2.0-rc.2": "compatible"
      }
    }
  },
  "dependencies": {
    "@vshulcz/deja-vu": "^0.23.3"
```

</details>

**依据 2 · 源码核查**：[extensions/dsh/index.js:19-26](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/index.js#L19-L26)

缺少宿主工具依赖时降级。

```text
// The tool registry lives in the host. A plugin that throws on a missing peer
// takes the whole profile down with it, so this degrades: without dsh-tools the
// command and automatic recall still work, only the model-facing tools are
// skipped.
let defineTool = null;
try {
  ({ defineTool } = await import("@deepseek-ai/dsh-tools"));
} catch {}
```

**依据 3 · 源码核查**：[extensions/dsh/index.js:31-57](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/index.js#L31-L57)

二进制优先顺序。

<details>
<summary>查看原文（27行）</summary>

```text
// resolveDeja picks the binary in the order a user would expect: what they
// pointed at, then the deja they installed themselves and keep current with
// `deja update` or a package manager, and only then the copy npm brought along
// with this plugin. Each candidate is asked for its version rather than
// trusted, because a name on PATH that does not run is worse than no name.
function resolveDeja() {
  const exe = PLATFORM === "windows" ? "deja.exe" : "deja";
  const candidates = [process.env.DEJA_BIN, exe];
  try {
    candidates.push(require.resolve(`@vshulcz/deja-vu-${PLATFORM}-${ARCH}/bin/${exe}`));
  } catch {}

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      execFileSync(candidate, ["version"], {
        windowsHide: true,
        encoding: "utf8",
        timeout: 5000,
        stdio: ["ignore", "pipe", "ignore"],
      });
      return candidate;
    } catch {}
  }
  // Nothing answered. Keep the plain name so the failure a user sees names the
  // thing that is missing.
  return exe;
```

</details>

**依据 4 · 源码核查**：[extensions/dsh/index.js:97-98](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/index.js#L97-L98)

无工具依赖跳过工具。

```text
function tools(ctx) {
  if (!defineTool) return;
```

**依据 5 · 源码核查**：[extensions/dsh/index.js:229-251](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/index.js#L229-L251)

手动搜索入口。

<details>
<summary>查看原文（23行）</summary>

```text
function command(ctx, board) {
  guarded(() => ctx.commands.register({
    name: "deja",
    description: "Search this machine's past AI coding sessions",
    input: { hint: "what to look for" },
    async handler(invocation) {
      const query = String((invocation && invocation.rawInput) || "").trim();
      if (!query) {
        return { kind: "error", text: "Say what to look for: /deja <error, file, or decision>" };
      }
      // Named, not handed over as deja's first word: the bare-query path
      // dispatches a word that happens to be a command, so `/deja version`
      // printed a version number and `/deja index` rebuilt the index, and one
      // of the words people most want history about is `install`.
      const out = run(argv("search", [], query));
      if (!INSTALLED) return { kind: "error", text: MISSING };
      // Outside dsh web a person sees nothing the hooks print — the digest
      // goes to the model — so the reply to /deja is where deja's own notes
      // reach them. In dsh web the session's lines may still be waiting on the
      // board for a page that has not asked; they go here, once, instead.
      const waiting = board ? board.take(sessionId(invocation && invocation.agent)) : [];
      const notes = [...waiting, run(["hook-context", "--notes"])].filter(Boolean).join("\n");
      return { kind: "success", text: notes ? answer(out) + "\n\n" + notes : answer(out) };
```

</details>

**依据 6 · 作者声明**：[extensions/dsh/README.md:77-83](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/README.md#L77-L83)

作者说明可关闭自动召回。

````text
```yaml
- insert:
    - id: deja
      name: dsh-deja
      config:
        autoRecall: false   # tools and /deja only
```
````

#### 缺口

- 未测试宿主版本、CLI 解析和不同机器历史
  **影响**：不能量化查询成本及兼容率
  **进一步探讨**：隔离目录试用单次手动检索并核查返回源。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否让使用历史决策的开发者识别跨项目和过时信息？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

本扩展已经按 cwd、session 请求召回，并可能把 CLI 输出的原有上下文直接交给模型；仅加项目过滤或重复来源文字未必构成增量，CLI 是否已有更多来源标注未核实。未验证设想是读取结构化命中（若上游能提供），在 DSH 界面按每条展示来源会话、项目、时间、当前文件版本关系和未知项，要求用户对可能过时的历史确认后才将其作为约束；缺字段或不可验证时标 unknown，默认只作参考，不隐式阻断全部任务。依赖核心提供稳定来源及可读原文，不能凭路径相似自动认定一致。固定任务对照现有自动召回和手动 /deja，构造跨项目同名、旧决策已被推翻、来源丢失、正常当前决策四组，比较带盲标的错误引用率、有效召回、核查时间与敏感内容暴露；若错误引用不降、缺源被写成已验证、损失有价值上下文或成本过高则否定。尚未实现。

#### 证据与依据

**依据 1 · 源码核查**：[extensions/dsh/index.js:344-383](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/index.js#L344-L383)

当前按 prompt、cwd、session 召回。

<details>
<summary>查看原文（40行）</summary>

```text
function autoRecall(ctx, board) {
  let asked = "";
  let askedIn = "";
  let askedBy = "";
  let recalled = "";
  const compacted = new Set();
  watchCompaction(ctx, compacted);

  guarded(() =>
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

**依据 2 · 源码核查**：[extensions/dsh/index.js:229-251](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/index.js#L229-L251)

手动 /deja 基线。

<details>
<summary>查看原文（23行）</summary>

```text
function command(ctx, board) {
  guarded(() => ctx.commands.register({
    name: "deja",
    description: "Search this machine's past AI coding sessions",
    input: { hint: "what to look for" },
    async handler(invocation) {
      const query = String((invocation && invocation.rawInput) || "").trim();
      if (!query) {
        return { kind: "error", text: "Say what to look for: /deja <error, file, or decision>" };
      }
      // Named, not handed over as deja's first word: the bare-query path
      // dispatches a word that happens to be a command, so `/deja version`
      // printed a version number and `/deja index` rebuilt the index, and one
      // of the words people most want history about is `install`.
      const out = run(argv("search", [], query));
      if (!INSTALLED) return { kind: "error", text: MISSING };
      // Outside dsh web a person sees nothing the hooks print — the digest
      // goes to the model — so the reply to /deja is where deja's own notes
      // reach them. In dsh web the session's lines may still be waiting on the
      // board for a page that has not asked; they go here, once, instead.
      const waiting = board ? board.take(sessionId(invocation && invocation.agent)) : [];
      const notes = [...waiting, run(["hook-context", "--notes"])].filter(Boolean).join("\n");
      return { kind: "success", text: notes ? answer(out) + "\n\n" + notes : answer(out) };
```

</details>

**依据 3 · 源码核查**：[extensions/dsh/lib.js:164-184](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/lib.js#L164-L184)

现有用户备注和模型上下文拆分。

<details>
<summary>查看原文（21行）</summary>

```text
export function splitHookReply(stdout) {
  const text = String(stdout || "").trim();
  if (!text) return { context: "", notes: "" };
  const lines = text.split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (!line.startsWith("{")) continue;
    let reply;
    try {
      reply = JSON.parse(line);
    } catch {
      continue;
    }
    if (!reply || typeof reply !== "object" || Array.isArray(reply)) continue;
    if (!("hookSpecificOutput" in reply) && !("systemMessage" in reply)) continue;
    const out = reply.hookSpecificOutput;
    const context = out && typeof out.additionalContext === "string" ? out.additionalContext.trim() : "";
    const notes = typeof reply.systemMessage === "string" ? reply.systemMessage.trim() : "";
    return { context, notes };
  }
  return { context: text, notes: "" };
```

</details>

**依据 4 · 作者声明**：[extensions/dsh/README.md:67-75](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/extensions/dsh/README.md#L67-L75)

作者已有来源提示与通知说明。

```text
In `dsh web` you also see the lines deja prints for the person in Claude Code:
the receipt naming the agent a prompt's answer came from, and
at session start what was recalled, the first-build note and the weekly note.
They sit in a small panel above the input until the next prompt, or until you
close it. The model gets exactly what it got before; these lines never reach
it. tui, headless and sdk profiles have no page, so nothing changes there:
the notes still come with the reply to `/deja`. A line that waits more than
ten minutes for the page is dropped. `deja install dsh-auto` writes the same
panel from these files; with both installed you get one panel.
```

#### 缺口

- 未检查核心所有输出，也无结构化原型或标注任务
  **影响**：无法判断方案是否新于核心及是否减少误用
  **进一步探讨**：先核固定核心接口，再在有来源真值的隔离任务对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
