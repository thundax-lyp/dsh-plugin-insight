# deja-vu

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c0239d4](https://github.com/vshulcz/deja-vu/tree/c0239d42f2f4017f1f78c24ada76884d8de7c316)

<!-- BEGIN META -->
[![GitHub ★ 1,310](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C310&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vshulcz/deja-vu)
<!-- END META -->

> **功能**：本地索引多个编码 Agent 的历史会话，并向 DSH 提供检索工具和自动上下文。

> **亮点**：把分散Agent历史接到统一召回与当前会话上下文，减少主动查找与工具切换；重复排障减少仍需任务对照，不能由R@5直接推出。[Q01](#research-q01)

> **主要限制**：同步CLI异常变空串后可能显示无匹配，且模板转义与模式去敏不保证历史无敏感或指令；跨项目和过期决定需用户复核。[Q03](#research-q03)

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
  - [Q01 · 跨Agent历史相对原生会话查询增加什么？](#detail-section-11)
  - [Q02 · 召回如何进入当前项目提示上下文？](#detail-section-12)
  - [Q03 · 错误隐藏、秘密与过期历史会否削弱价值？](#detail-section-13)
  - [Q04 · 索引与持续维护成本是否清楚？](#detail-section-14)
  - [Q05 · 哪个新设计值得如何验证？](#detail-section-15)
  - [Q06 · 当前适合个人工作机在什么范围试用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多Agent轮换的个人开发者找回旧错误、命令和决定；原生查询足够时不必另建索引。[Q01](#research-q01)

基线是逐Agent日志搜索、grep或宿主原生会话查询；统一索引适合跨工具历史，并非对每个任务更好。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 历史工具 | 查错误、命令、会话与决定 | 本地二进制和索引可用 |
| 自动召回 | 当前项目上下文提示 | 需复核隐私、过期与错误状态 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 平台deja二进制 | 必需 | 索引和召回 | 不等于历史为空 |
| 可读历史与可写索引 | 必需 | 构建本地语料 | 先明确范围 |
| DSH工具/上下文API | DSH接入必需 | 检索和注入 | 单项可能降级 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 审核 | 用户备份配置、限定非敏感项目 | 记录数据与改写范围 |
| 索引 | 用户准备固定二进制和索引 | 核对实际记录 |
| 检索 | Agent用已知查询召回 | 能回原会话，故障不当无记录 |
| 复核 | 用户对照当前代码 | 旧结论失效即停自动注入 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 二进制和索引磁盘，金额未知 | 审核数据和配置改写；耗时未知 | 不能套用作者索引秒数 |
| 持续使用 | 本地CPU/磁盘；语义模式另算 | 复核当前适用性 | 任务收益未测 |
| 失败恢复 | 重建索引及备份空间 | 区分引擎故障和无匹配、撤除注入 | 多Agent配置退出清单未验收 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 跨Agent召回 | 独立索引工具及DSH接线 | 本人历史相关性 |
| 自动上下文 | session/cwd注入 | 最终修复正确率与干扰 |
| 去敏 | 格式化凭证规则 | 非标准秘密漏检 |

> **思考**：同步CLI异常变空串后可能显示无匹配，且模板转义与模式去敏不保证历史无敏感或指令；跨项目和过期决定需用户复核。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把分散Agent历史接到统一召回与当前会话上下文，减少主动查找与工具切换；重复排障减少仍需任务对照，不能由R@5直接推出。[Q01](#research-q01)

按session cwd、参数终止符、上下文模板转义值得复用；吞异常与同步调用需要独立健康状态。移植需适配各Agent记录和宿主上下文API。[Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

同步CLI异常变空串后可能显示无匹配，且模板转义与模式去敏不保证历史无敏感或指令；跨项目和过期决定需用户复核。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议个人工作机限定非敏感项目试用，召回仅当线索、原会话与当前代码共同核对；隐私跨项目或错误无匹配出现时关闭自动注入并回原日志。[Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

跨Agent索引的DSH接线有源码支持；作者基准未独立复现，去敏不等全面隐私保证。三态检索与新鲜度复核是未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、extensions/dsh/index.js、extensions/dsh/lib.js、internal/index/scoped.go、internal/index/secrets.go、internal/redact/redact.go 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本只读根说明、DSH适配器及Go范围/去敏模块；未覆盖所有Agent解析器、执行索引、测试或宿主。Go不计入JS/TS LOC。
- 下一步：固定非敏感历史与四类查询，核对引用、错误状态、过期决定、配置撤除及最终任务质量；本轮未执行。[Q05](#research-q05)

**分析版本**

- **仓库**：[vshulcz/deja-vu](https://github.com/vshulcz/deja-vu)
- **版本号**：0.23.1（[固定提交 c0239d4](https://github.com/vshulcz/deja-vu/tree/c0239d42f2f4017f1f78c24ada76884d8de7c316)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证设计是在召回结果保留引擎/索引/无匹配三态及当前文件变化，比较错误确信、误用旧决定和复核时间。[Q05](#research-q05)

固定非敏感历史与四类查询，核对引用、错误状态、过期决定、配置撤除及最终任务质量；本轮未执行。[Q05](#research-q05)

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 120 | 18215 | — | — | 233422 |
| .js | source | 7 | 2457 | 1720 | 579 | — |
| .js | test | 8 | 1860 | 1476 | 246 | — |
| .mjs | source | 15 | 2190 | 1560 | 477 | — |
| .mjs | test | 7 | 1023 | 841 | 90 | — |
| .ts | source | 1 | 302 | 212 | 73 | — |
| .md | example | 2 | 8 | — | — | 30 |

</details>

**活跃度**

[![Issue 未关闭 29](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=29&color=737b86&logo=github)](https://github.com/vshulcz/deja-vu/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 935](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=935&color=737b86&logo=github)](https://github.com/vshulcz/deja-vu/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 917](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=917&color=737b86&logo=github)](https://github.com/vshulcz/deja-vu/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：跨Agent历史检索能否减少重复排障，DSH接线、跨项目召回与隐私处理的条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨Agent历史相对原生会话查询增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

多种编码Agent轮换的个人开发者需要找回此前错误处理、决策和命令。deja将多工具落盘会话聚合为本地可检索历史，DSH适配器明确区分宿主自有session-query与跨Agent检索；合格结果是找回相关原始会话并检查它仍适用于当前代码，而非仅返回一段似是而非的记忆。相对手动在各工具日志查找或grep，统一召回与会话启动注入减少切换和主动提问，但原生查询已足够的单工具用户不一定需要另建索引。README召回率和节省token是维护者报告，未独立复现，也不能直接推成减少重复排障的因果效果。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:8-12](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/README.md#L8-L12)

作者声明聚合编码Agent落盘会话。

```text
<p align="center"><b>Your coding agents stop re-debugging what you already fixed.</b></p>

<p align="center">Claude Code, Codex, Cursor and 40 more agents already save every session to disk.
deja indexes all of it, months back, and hands the part that matters
to whichever agent is working now.</p>
```

**依据 2 · 作者声明**：[README.md:33-46](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/README.md#L33-L46)

基准与维护者身份明确，仅作者报告。

<details>
<summary>查看原文（14行）</summary>

```text
</tr>
</table>

<p align="center"><sub>I maintain deja-vu, so every driver, the corpus and the scoring rule are in this repository &middot;
<a href="https://vshulcz.github.io/deja-vu/guide/day-zero.html">the head-to-head, and how to re-run a row you doubt</a> &middot;
<a href="https://vshulcz.github.io/deja-vu/guide/benchmarks.html">every run</a></sub></p>

<p align="center">
  <a href="https://github.com/vshulcz/deja-vu/actions/workflows/ci.yml"><img src="https://github.com/vshulcz/deja-vu/actions/workflows/ci.yml/badge.svg?branch=main&event=push" alt="CI"></a>
  <a href="https://github.com/vshulcz/deja-vu/releases"><img src="https://img.shields.io/github/v/release/vshulcz/deja-vu" alt="Release"></a>
  <a href="https://mcptoplist.com/server/io.github.vshulcz%2Fdeja-vu"><img src="https://mcptoplist.com/badge/io.github.vshulcz%2Fdeja-vu.svg" alt="MCP Toplist"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
</p>

```

</details>

**依据 3 · 源码核查**：[extensions/dsh/index.js:1-6](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/index.js#L1-L6)

适配器把跨Agent历史作为相对原生查询的区别。

```text
// dsh-deja — the history you already have, inside DeepSeek Harness.
//
// dsh answers questions about its own sessions through the built-in
// session-query subsystem. This plugin answers the other question: what you did
// in Claude Code, Codex, Cursor, opencode and thirty-nine more agents, on this
// machine, before dsh existed. The index is deja's; this file is the seam.
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 召回如何进入当前项目提示上下文？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

根manifest重导出extensions/dsh且依赖独立Go二进制包。适配器依次试DEJA_BIN、PATH与随包平台二进制，工具调用execFileSync并传当前会话workspace而非宿主进程cwd；recallArgv固定调用recall、限制数量并为短横线查询加参数终止符。自动上下文在systemPrompt.context注册，并以session id防重复注入，inert拆开模板双花括号，避免历史文本被宿主当变量解析。这是可追踪的集成链，但底层索引召回依赖可运行二进制和有效历史，不能把工具注册等同已索引。当前目录优先也不是用户权限隔离，多人共享工作机必须另行建立数据范围。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-26](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/package.json#L1-L26)

根manifest重导出DSH适配器且private。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-deja",
  "version": "0.23.1",
  "private": true,
  "description": "Repository-root manifest for the DeepSeek Harness plugin that lives in extensions/dsh — the same package published to npm as dsh-deja. It re-exports the subdirectory so the plugin installs from a bare git URL or from github:vshulcz/deja-vu#path:extensions/dsh; the npm package is the shorter path. The repository itself is the Go project behind the deja binary.",
  "type": "module",
  "main": "./extensions/dsh/index.js",
  "exports": {
    ".": "./extensions/dsh/index.js",
    "./client": "./extensions/dsh/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "extensions/dsh",
    "README.md",
    "LICENSE"
  ],
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/vshulcz/deja-vu.git",
    "directory": "extensions/dsh"
  },
  "homepage": "https://vshulcz.github.io/deja-vu/guide/memory-for-dsh.html",
  "bugs": {
    "url": "https://github.com/vshulcz/deja-vu/issues"
```

</details>

**依据 2 · 源码核查**：[extensions/dsh/index.js:31-77](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/index.js#L31-L77)

二进制定位和同步CLI调用。

<details>
<summary>查看原文（47行）</summary>

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
}

const DEJA = resolveDeja();

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

**依据 3 · 源码核查**：[extensions/dsh/index.js:286-328](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/index.js#L286-L328)

按session和cwd注入上下文。

<details>
<summary>查看原文（43行）</summary>

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
    }),
  );
}

// dsh names a session "session-<uuid>" and its log's folder the same; deja
// indexes it by the uuid, so that is the id every hook is given.
function bareSessionId(id) {
  return String(id || "").replace(/^session-/, "");
}

function sessionId(agent) {
  return bareSessionId((agent && (agent.sessionId || (agent.session && agent.session.id))) || "");
}

// The workspace a session belongs to. One web or tui process serves sessions
// from every workspace and never changes directory, so process.cwd() is only
// where dsh was launched; the session header carries the directory the session
// was opened in.
function sessionCwd(agent) {
  const header = agent && agent.session && agent.session.header;
  return (header && header.cwd) || process.cwd();
```

</details>

**依据 4 · 源码核查**：[extensions/dsh/lib.js:19-40](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/lib.js#L19-L40)

显式recall子命令、分页与参数终止符。

<details>
<summary>查看原文（22行）</summary>

```text
export function argv(cmd, flags, text) {
  const arg = String(text);
  return arg.startsWith("-") ? [cmd, ...flags, "--", arg] : [cmd, ...flags, arg];
}

// recallArgv is the call behind the deja_recall tool: `deja recall`, the page
// the MCP recall tool serves, framed and held to its 4 KB budget by deja
// itself. The tool used to run `search --json`, which carries every hit's
// matched messages whole and handed a model 661,528 characters for five hits
// (#5568). The page ends with "call recall again with offset=N"; offset is
// how the tool asks for that, and it is sent only past the first page, so a
// deja too old to know --offset still answers the first one.
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
```

</details>

**依据 5 · 源码核查**：[extensions/dsh/lib.js:94-103](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/lib.js#L94-L103)

防止历史文本触发宿主模板解释。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 错误隐藏、秘密与过期历史会否削弱价值？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

会。run把执行失败、超时等异常都化为空串，再由answer返回无匹配信息，安装状态只在加载时探一次，因此“没找到”不总能证明历史不存在。同步调用最长20秒还可能拖慢宿主。Go侧有按项目范围裁剪结果的逻辑，redact包含可辨认凭证模式，证明有主动隐私处理；但模式识别有长度和格式条件，不能保证所有秘密、业务数据与提示注入被消除。inert只解决模板插值而非模型相信历史指令。历史决策也可能已失效，用户仍需回到原会话与当前文件核对。可复用的是显式参数终止、按会话cwd调用和上下文预算；复用时要保留失败类型与数据范围，不能只沿用吞异常。

#### 证据与依据

**依据 1 · 源码核查**：[extensions/dsh/index.js:64-93](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/index.js#L64-L93)

异常化空与无匹配输出存在语义混淆。

<details>
<summary>查看原文（30行）</summary>

```text
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
}

const NOTHING = "Nothing in this machine's history matches that.";
const MISSING =
  "deja is not installed on this machine, so there is no history to search. " +
  "Install it with: curl -fsSL https://raw.githubusercontent.com/vshulcz/deja-vu/main/install.sh | sh";

// installed answers whether the binary picked at load actually runs. Without
// this every tool would report an empty history to a user who simply never
// installed deja, which reads as "you have no past" rather than "nothing is
// here to read it".
const INSTALLED = run(["version"]) !== "";

function answer(text) {
  if (INSTALLED) return text || NOTHING;
  return MISSING;
```

</details>

**依据 2 · 源码核查**：[internal/index/scoped.go:14-33](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/internal/index/scoped.go#L14-L33)

项目范围裁剪有明确成立条件。

<details>
<summary>查看原文（20行）</summary>

```text
func ScopedFrom(whole SearchResult, scope []string) (SearchResult, bool) {
	if len(scope) == 0 || whole.Tier != query.TierExact || whole.Fuzzy || whole.Stemmed || whole.Neighbour ||
		whole.Strict > 0 || whole.Directory != "" || len(whole.StrictIDs) > 0 {
		return SearchResult{}, false
	}
	if whole.Unread != nil && !whole.Unread.ScopeWhole {
		return SearchResult{}, false
	}
	var ss []model.Session
	for _, s := range whole.Sessions {
		if query.ProjectAnyMatches(s.Project, s.From, scope) {
			ss = append(ss, s)
		}
	}
	// A thin answer is given a relevance tail, which only the narrower search
	// itself can draw.
	if len(ss) < thinAND {
		return SearchResult{}, false
	}
	return SearchResult{Sessions: ss, Tier: whole.Tier, Variants: whole.Variants}, true
```

</details>

**依据 3 · 源码核查**：[internal/redact/redact.go:35-68](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/internal/redact/redact.go#L35-L68)

凭证规则与格式条件支持有限去敏而非保证。

<details>
<summary>查看原文（34行）</summary>

```text
// kvValue is the value the key-value rules mask. A password often ends in
// punctuation the base class stops at, and `--password=Sup3rS3cretValue!!xyz`
// came back as `[redacted:credential]!!xyz`: the tail sat in the index in the
// clear. Runs of those characters and what follows them are taken in too. '&',
// '?', ',' and ')' stay out, so a query string or a sentence keeps its rest.
const kvValue = `[A-Za-z0-9/+=._-]{16,}(?:[!#$%^*~@]+[A-Za-z0-9/+=._-]*)*`

var (
	awsAccessKeyRE = regexp.MustCompile(`A(?:KIA|SIA)[0-9A-Z]{16}`)
	awsSecretRE    = regexp.MustCompile(`(?i)\b(aws[_-]?secret[_-]?access[_-]?key)(\\*['"]?\s*[:=]\s*)(\\*['"]?)([A-Za-z0-9/+=_-]{32,})(\\*['"]?)`)
	// The key may be embedded in a larger identifier (ANTHROPIC_API_KEY,
	// x-api-key) and, in JSON, a closing quote can sit between the key and the
	// delimiter ("api_key": "..."). Tolerate both so env-var and JSON forms are
	// caught, not just a bare `api_key=`.
	// The key words are matched in the languages people actually type in, not
	// only English: a Russian speaker writes "пароль: …" or "токен: …" and the
	// secret sat in the clear because every pattern here was English-only. The
	// value class and length floor are the same, so the looseness is unchanged.
	genericKVRE = regexp.MustCompile(`(?i)\b([\w.-]{0,64}?(?:api[_-]?key|secret|token|passwd|password|authorization))(\\*['"]?\s*[:=]\s*)(\\*['"]?)(` + kvValue + `)(\\*['"]?)`)
	// An environment variable holding a credential does not have to say "api" or
	// "token" in its name: DEJA_EMBED_KEY, GROQ_KEY, VOYAGE_KEY all end in plain
	// _KEY, which genericKVRE never matched, so an opaque value — one with no
	// provider prefix and not enough entropy for the last-resort pass — was
	// indexed in the clear. Measured on `export DEJA_EMBED_KEY=9f2b…f83`.
	//
	// Case-sensitive on purpose: this is the shell shape, and matching `_key`
	// as well would take `cache_key: <16 chars>` out of every YAML file people
	// paste, which costs recall for no secret.
	envKeyRE = regexp.MustCompile(`\b([A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*_KEY)(\\*['"]?\s*[:=]\s*)(\\*['"]?)(` + kvValue + `)(\\*['"]?)`)
	// The same shape in the languages people actually type in. \b is ASCII-only
	// in RE2, so a Cyrillic or CJK key word can never sit behind it — these get
	// their own pattern. A Russian speaker writing "пароль: …" had the secret
	// stored in the clear because every pattern here was English-only.
	genericKVIntlRE = regexp.MustCompile(`(?i)(^|[^\p{L}\p{N}_])(парол[ьяею]|токен[ауы]?|секрет[ауы]?|ключ[аеиуом]?|contraseña|senha|passwort|密码|密碼|パスワード|비밀번호)(\\*['"]?\s*[:=]\s*)(\\*['"]?)(` + kvValue + `)(\\*['"]?)`)
```

</details>

**依据 4 · 源码核查**：[extensions/dsh/lib.js:94-103](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/lib.js#L94-L103)

模板转义只覆盖模板解释。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

#### 缺口

- 未验证非标准秘密、跨项目召回及历史指令对任务决策的影响。
  **影响**：不能宣称全面隐私或隔离；错误记忆可能误导当前修改。
  **进一步探讨**：用不含真实秘密的自建样例和过期决策，核对索引、召回与模型响应。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 索引与持续维护成本是否清楚？

**研究主题**：效果与总成本

#### 完整回答

首次需要平台二进制、可读历史目录、索引磁盘并审核自动安装对多个Agent配置/指导文件的修改；源码与作者文档足以识别这些成本，不能采用README十秒作为本机耗时。持续检索主要本地CPU与磁盘，若启用语义检索还需额外模型/服务条件，不能笼统称免费。失败恢复包括重新索引、区分二进制不可用与无匹配、检查自动注入是否重复；退出还需清理各Agent接线而不误删原历史。基准索引时间和token结果只用于提出验证问题，缺本轮真实工作负载与合格任务数，单位成本未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:129-157](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/README.md#L129-L157)

安装与首次索引是作者步骤。

<details>
<summary>查看原文（29行）</summary>

````text
and Cursor has one in [`cursor-plugin/`](cursor-plugin/)).
Copilot CLI installs it too but takes only the skill, so use `deja install copilot-auto` there:

```sh
claude plugin marketplace add vshulcz/deja-vu && claude plugin install deja-vu@deja-vu
```

On Windows the install script exits with `unsupported OS` — it is a shell script. Use
Scoop, from the main bucket every Scoop install already has, or winget, which ships with Windows:

```powershell
scoop install deja-vu
winget install vshulcz.deja-vu
```

Or take `deja-vu_<version>_windows_amd64.zip` from the
[latest release](https://github.com/vshulcz/deja-vu/releases/latest) and put `deja.exe` on
your `PATH`, e.g. in `%USERPROFILE%\.local\bin`.

The binary alone is a complete install for searching: index, search, `show`, `ctx`, `blame`,
`--json` and redaction need nothing else. `deja install` is what wires MCP into your agents
and turns on session-start recall — worth having, and optional. On a binary-only setup
`deja doctor` reports every MCP target as `config missing`, or `not-wired` where the agent
is installed, which is that setup working as intended. `deja warmup` also leaves a skill at `~/.agents/skills/deja-search/SKILL.md`
that teaches an agent the CLI contract — `deja recall`, `ctx`, `blame`, how to read the
recall page and ask for the next one — so it knows history is searchable without MCP. The copy in the repo is
[`skills/deja-search/SKILL.md`](skills/deja-search/SKILL.md).

`deja install --all` is `--auto` without the session-start recall: agents answer from memory
````

</details>

**依据 2 · 作者声明**：[README.md:239-256](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/README.md#L239-L256)

作者说明安装可写指导文件及opt-out路径。

<details>
<summary>查看原文（18行）</summary>

```text
| --- | --- |
| `deja sync export/import/ssh` | Move memory between machines. Watermarked, append-only, idempotent. |
| `deja view` | Your whole memory as one local HTML file. No server, and the file never leaves the machine. |
| `deja stats` | Your agent work, wrapped. `--card` draws it in the terminal, `--card <file>.svg` writes one for a profile, `--html` a browsable timeline. |
| `deja secrets [--scrub]` | Which sessions' source transcripts carry credentials, and what kind. Never prints a value. `--scrub` rewrites the ones it can, original kept beside the file. |
| `deja rules [sync]` | Keep your standing rules in `~/.config/deja/rules.md`; `sync` copies them as a marked block into every installed agent's global rules file. |
| `deja rules candidates [--json] [--limit n] [--since 90d]` | The turns where you corrected an agent, across every tool, numbered with their session. Ask your agent to suggest rules and it groups them; nothing is written until you pick. |
| `deja doctor [--deep]` | Self-diagnosis, and with `--deep`, proof of the index against the sources. |
| `deja mcp` | The stdio MCP server, which is what `deja install` wires in. |

</details>

Full reference: [commands](https://vshulcz.github.io/deja-vu/guide/commands.html) and
[JSON output](docs/json-output.md).

### MCP tools

The server exposes one tool, `deja`, with a `mode`; `deja install` wires it in. One tool
```

</details>

**依据 3 · 源码核查**：[extensions/dsh/index.js:64-77](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/index.js#L64-L77)

失败与超时路径影响排障成本。

<details>
<summary>查看原文（14行）</summary>

```text
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

#### 缺口

- 缺少当前机器索引规模、文件变更与退出清单。
  **影响**：无法确定首次投入及长期维护负担。
  **进一步探讨**：在隔离用户目录记录配置diff、索引大小、耗时和撤除结果。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪个新设计值得如何验证？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是为召回增加“检索成功/引擎错误/索引陈旧”三态结果，并把历史结论与当前文件变化一同呈现，让模型先复核再采用。由Q03的空串混淆和过期风险推导，价值可能是减少错误确信而不是更多召回。最小实验固定同一历史语料，放入有效决定、已撤销决定、无匹配查询与二进制超时，比较现实现与三态原型的错误无匹配率、误用旧决定率、人工复核时间和最终修复正确性。若错误仍被当无历史或复核成本抵消收益，则不支持该方案。版本绑定与索引健康检测会增加维护，尚未验证实际用户需求。

#### 证据与依据

**依据 1 · 源码核查**：[extensions/dsh/index.js:64-93](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/index.js#L64-L93)

错误和空结果同化是三态设计动因。

<details>
<summary>查看原文（30行）</summary>

```text
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
}

const NOTHING = "Nothing in this machine's history matches that.";
const MISSING =
  "deja is not installed on this machine, so there is no history to search. " +
  "Install it with: curl -fsSL https://raw.githubusercontent.com/vshulcz/deja-vu/main/install.sh | sh";

// installed answers whether the binary picked at load actually runs. Without
// this every tool would report an empty history to a user who simply never
// installed deja, which reads as "you have no past" rather than "nothing is
// here to read it".
const INSTALLED = run(["version"]) !== "";

function answer(text) {
  if (INSTALLED) return text || NOTHING;
  return MISSING;
```

</details>

**依据 2 · 源码核查**：[internal/index/scoped.go:14-33](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/internal/index/scoped.go#L14-L33)

范围条件应跟随结果保留。

<details>
<summary>查看原文（20行）</summary>

```text
func ScopedFrom(whole SearchResult, scope []string) (SearchResult, bool) {
	if len(scope) == 0 || whole.Tier != query.TierExact || whole.Fuzzy || whole.Stemmed || whole.Neighbour ||
		whole.Strict > 0 || whole.Directory != "" || len(whole.StrictIDs) > 0 {
		return SearchResult{}, false
	}
	if whole.Unread != nil && !whole.Unread.ScopeWhole {
		return SearchResult{}, false
	}
	var ss []model.Session
	for _, s := range whole.Sessions {
		if query.ProjectAnyMatches(s.Project, s.From, scope) {
			ss = append(ss, s)
		}
	}
	// A thin answer is given a relevance tail, which only the narrower search
	// itself can draw.
	if len(ss) < thinAND {
		return SearchResult{}, false
	}
	return SearchResult{Sessions: ss, Tier: whole.Tier, Variants: whole.Variants}, true
```

</details>

#### 缺口

- 三态与新鲜度提示能否改善最终任务尚无实验。
  **影响**：只是待验证方向。
  **进一步探讨**：按四类查询固定对照，测错误采用与复核成本。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前适合个人工作机在什么范围试用？

**研究主题**：采用判断

#### 完整回答

已有多Agent历史且能审阅本地数据的个人开发者，可限定非敏感项目试用跨Agent召回。先备份配置并核对索引范围，使用已知旧错误与已知无结果两类查询检查引用，再让Agent只据召回提供线索，当前代码仍为判断依据。相比逐工具搜日志，统一入口和自动上下文有具体可解释增量，但检索分数不是修复成功率。若返回别项目隐私、索引错误被当无记录或旧决定直接覆盖当前约束，应停止自动注入并退回原Agent日志与手工检索。无运行验收，不建议持续安装或共享多用户部署。

#### 证据与依据

**依据 1 · 源码核查**：[extensions/dsh/index.js:111-137](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/index.js#L111-L137)

召回工具面向具体历史查询并使用当前session工作目录。

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

**依据 2 · 源码核查**：[extensions/dsh/index.js:286-309](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/index.js#L286-L309)

自动上下文需要明确核对和退出范围。

<details>
<summary>查看原文（24行）</summary>

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
    }),
  );
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
