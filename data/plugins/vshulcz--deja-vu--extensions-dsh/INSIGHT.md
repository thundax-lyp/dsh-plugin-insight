# dsh-deja

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[c0239d4](https://github.com/vshulcz/deja-vu/tree/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh)

<!-- BEGIN META -->
[![GitHub ★ 1,310](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C310&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vshulcz/deja-vu) [![npm 30d 5,274](https://img.shields.io/static/v1?label=npm+30d&message=5%2C274&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deja) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deja)
<!-- END META -->

> **实现功能**：在 DSH 中搜索同机其他编码 Agent 的历史，并通过工具、命令和可选自动召回提供上下文。

> **核心亮点**：把DSH原生历史范围之外的同机Agent日志接成统一检索与上下文入口；核心索引机制归deja CLI，不重复当适配器原创。见[Q01](#research-q01)。

> **风险与缺陷**：本地无LLM索引不等于召回不发模型，旧结论可污染当前任务；同步CLI失败转空串也会混淆无匹配。见[Q03](#research-q03)。

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
  - [Q01 · 跨Agent历史为谁提供什么增量？](#detail-section-11)
  - [Q02 · 二进制、工具和自动上下文怎样连接？](#detail-section-12)
  - [Q03 · 本地索引、自动注入与静默失败有什么代价？](#detail-section-13)
  - [Q04 · 怎样受控试用，如何验证去污染方向？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有同机旧Agent历史的开发者可找回过去决策、错误修法与命令。

DSH原生session-query负责自身会话，跨Agent用原日志grep为简单对照；两种范围不混。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 历史检索工具 | 找旧会话/文件讨论/修法 | 实际CLI版本与历史权限 |
| remember | 保存已定决策 | 写入，不是全只读插件 |
| 自动召回 | 当前模型获取旧上下文 | 可关；本地索引不等于内容不出机 |
| 用户notes | 浏览器显示召回出处提示 | 用户提示与模型上下文分离 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=18和DSH服务 | 必需 | 工具/命令/上下文注册 | 对应能力不可用 |
| 可执行deja CLI | 必需 | 索引和检索 | 需辨未安装，不当作无历史 |
| 同机旧历史与读取权限 | 效果必需 | 跨Agent材料 | 无源不产生迁移价值 |
| 数据可向当前模型披露 | 自动上下文必需 | 防旧秘密越界 | 先关autoRecall并审输出 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核CLI路径/version与历史范围 | 固定实际检索器身份 |
| 查询 | 关autoRecall，查非敏感精确串 | 原会话出处和当前适用可核 |
| 扩展 | 用户再选自动召回 | 不把历史正文当新指令 |
| 退出 | 停自动/移除adapter | 回原日志和grep，保留本地数据决定权 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地索引CPU/磁盘；金额未知 | 核历史范围、二进制版本和非敏感输出 | 解析覆盖未全验 |
| 持续使用 | 每轮CLI检索和模型上下文 | 核出处/当前适用 | 无净节时或token对照 |
| 失败恢复 | 索引/CLI排障和重查 | 区分未安装、旧版、异常与空结果 | 关闭autoRecall回原始日志 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 统一历史入口 | 六工具与命令到CLI | 全来源解析与检索准确性 |
| 自动上下文 | 按prompt/cwd/session装配 | 当前任务质量与污染率 |
| 内容边界 | 模板惰化与framed调用 | 任意秘密脱敏 |

> **思考**：本地无LLM索引不等于召回不发模型，旧结论可污染当前任务；同步CLI失败转空串也会混淆无匹配。见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把DSH原生历史范围之外的同机Agent日志接成统一检索与上下文入口；核心索引机制归deja CLI，不重复当适配器原创。见[Q01](#research-q01)。

把DSH原生历史范围之外的同机Agent日志接成统一检索与上下文入口；核心索引机制归deja CLI，不重复当适配器原创。见[Q01](#research-q01)。

参数数组、明确子命令和前导--、分页及模板惰化值得借鉴；同步20秒与广泛吞异常牺牲可诊断性，应区分可选服务失败和确无历史，见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

本地无LLM索引不等于召回不发模型，旧结论可污染当前任务；同步CLI失败转空串也会混淆无匹配。见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先手动精确查询，核实际CLI版本与内容，再决定是否开启自动上下文。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

适配调用链有源码支持，核心所有解析/脱敏及任务收益未验；历史适用标注为未验证假设。

- 已检查：作者 README、包清单、源码路径 extensions/dsh/README.md、extensions/dsh/package.json、extensions/dsh/index.js、extensions/dsh/lib.js 及固定范围 inventory；组件：extensions/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读DSH组件及调用接口，不核四十二种核心解析器或所有索引脱敏，不运行CLI/安装/模型。
- 下一步：固定过期依赖、相似项目和敏感样本，比较召回正确、错误复用、token及人工时间；不把作者毫秒主张当本轮结果。

**分析版本**

- **仓库**：[vshulcz/deja-vu](https://github.com/vshulcz/deja-vu)
- **版本号**：0.23.1（[固定提交 c0239d4](https://github.com/vshulcz/deja-vu/tree/c0239d42f2f4017f1f78c24ada76884d8de7c316)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是先核核心现有出处，再比较项目/时间/失效条件标注能否减少过期记忆误用；无净改善则保留手动查询。见[Q04](#research-q04)。

固定过期依赖、相似项目和敏感样本，比较召回正确、错误复用、token及人工时间；不把作者毫秒主张当本轮结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 1189 | 843 | 270 | — |
| .md | source | 2 | 172 | — | — | 1957 |
| .js | test | 4 | 825 | 629 | 133 | — |

</details>

**活跃度**

[![Issue 未关闭 29](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=29&color=737b86&logo=github)](https://github.com/vshulcz/deja-vu/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 935](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=935&color=737b86&logo=github)](https://github.com/vshulcz/deja-vu/issues?q=is%3Aissue+created%3A2026-09-27T02%3A11%3A15.718Z..2026-10-27T02%3A11%3A15.718Z) [![近30天关闭 917](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=917&color=737b86&logo=github)](https://github.com/vshulcz/deja-vu/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T02%3A11%3A15.718Z..2026-10-27T02%3A11%3A15.718Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查跨Agent历史的DSH适配、自动上下文与当前任务适用边界

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨Agent历史为谁提供什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

从其他编码Agent迁移到DSH、但需要找回同机旧决策/错误修法/实际命令的开发者是明确人群。DSH原生session-query已查自己的会话，这个插件的增量是把原本分散在其他Agent日志里的历史通过deja二进制接进DSH，而非重复原生历史搜索。相对grep，结构索引与召回/会话摘要、文件讨论、修法和命令入口降低跨格式定位负担；合格结果仍是可回查原会话并验证在当前工程适用，旧会话的“成功”不自动等于当前正确。作者四十二种来源和本地BM25属于核心CLI主张，本次组件核查未逐一审读解析器，不把来源数当覆盖验收。

#### 证据与依据

**依据 1 · 作者声明**：[extensions/dsh/README.md:7-15](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/README.md#L7-L15)

作者明确原生DSH与其他Agent历史边界

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

**依据 2 · 作者声明**：[extensions/dsh/README.md:42-63](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/README.md#L42-L63)

六工具及自动召回的目标

<details>
<summary>查看原文（22行）</summary>

```text
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
something to say.

The same recall also wires what `deja install dsh-auto` wires: after a read,
edit or write the model gets what past sessions said about that file, after a
command that failed it gets what this machine ran after the same error before,
```

</details>

**依据 3 · 源码核查**：[extensions/dsh/index.js:114-137](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/index.js#L114-L137)

实际deja_recall按当前会话cwd调用

<details>
<summary>查看原文（24行）</summary>

```text
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

#### 缺口

- 跨格式召回在真实迁移任务的准确性和纠错成本未知
  **影响**：不能确认较grep或原生历史提高任务结果
  **进一步探讨**：固定旧错误/决策案例，对照grep与插件，核来源正确、当前适用和人工时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 二进制、工具和自动上下文怎样连接？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

resolveDeja依次试DEJA_BIN、PATH及npm平台二进制，version可执行才选；因此插件版本固定不等于实际核心版本固定，试用须另记deja version。工具用execFileSync与参数数组，不拼shell；recallArgv明确子命令、分页limit上限和前导横线终结符，避免用户查询被当命令/flag。自动回忆通过systemPrompt.context在装配时回读最后human text、cwd与sessionId，同查询同会话复用，压缩后重新取；inert打散双大括号并声明interpolate:false，避免旧日志触发宿主模板。CLI已有command.js/auto.js时只补缺席注册，guarded吞重名拒绝；这可保可选记忆不拖垮启动，但吞掉所有注册异常也可能隐藏真正不兼容。工具结果和additionalContext会进入模型，浏览器notes则单独走宿主connection认证路由。

#### 证据与依据

**依据 1 · 源码核查**：[extensions/dsh/index.js:35-55](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/index.js#L35-L55)

二进制优先级与version探测

<details>
<summary>查看原文（21行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[extensions/dsh/lib.js:18-39](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/lib.js#L18-L39)

固定子命令、--和有界分页

<details>
<summary>查看原文（22行）</summary>

```text
// know the terminator on this subcommand still answers every ordinary query.
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
```

</details>

**依据 3 · 源码核查**：[extensions/dsh/index.js:344-383](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/index.js#L344-L383)

按prompt/cwd/session与压缩状态召回

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

**依据 4 · 源码核查**：[extensions/dsh/lib.js:96-123](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/lib.js#L96-L123)

模板惰化与补缺席贡献逻辑

<details>
<summary>查看原文（28行）</summary>

```text
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
// the command file standing there means the model can already reach deja —
// registering these tools would list every answer twice. auto.js is separate:
// only `deja install dsh-auto` writes it, so a profile can take the command
// from the installer and still want recall from here.
export function contributions(wiring, config) {
  const wired = wiring || {};
  const settings = config || {};
  return {
    tools: !wired.command,
    command: !wired.command,
    recall: settings.autoRecall !== false && !wired.auto,
  };
}
```

</details>

#### 缺口

- PATH核心版本与包内版本兼容关系未固定
  **影响**：相同插件在不同机器可能有不同检索/脱敏行为
  **进一步探讨**：记录实际二进制路径/version并以固定测试集核返回结构与上下文

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地索引、自动注入与静默失败有什么代价？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

“无LLM”指索引/查询机制不调用LLM，不代表召回内容永不出机；自动additionalContext随当前DSH模型请求发送，旧敏感会话可能越过用户原先边界。作者称索引脱敏，本次未审完整Go索引器，不能确认任意秘密过滤；先用非敏感项目、关闭autoRecall做手动查询更可控。run同步执行最长20秒、8MiB缓冲并把异常转空串，慢CLI可阻塞宿主eventloop，查询失败也可能被表示成没有匹配；分页回退仅部分识别旧版offset不支持。首次建索引需磁盘/CPU与历史源访问，持续增加每轮检索和模型上下文，remember还会写决策；失败需区分未安装、空结果、旧版本和实际CLI异常，不能直接依赖沉默。金额、索引规模、延迟和净节时无本轮测量。

#### 证据与依据

**依据 1 · 源码核查**：[extensions/dsh/index.js:61-77](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/index.js#L61-L77)

同步20秒调用与异常空串

<details>
<summary>查看原文（17行）</summary>

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

**依据 2 · 源码核查**：[extensions/dsh/index.js:368-383](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/index.js#L368-L383)

召回文本进入模型上下文

<details>
<summary>查看原文（16行）</summary>

```text
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

**依据 3 · 作者声明**：[extensions/dsh/README.md:103-105](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/README.md#L103-L105)

BM25与索引脱敏为作者声明

```text
No LLM, no embeddings. The index is a local BM25 store over files
that already exist, so a query answers in about a millisecond, with no network
path unless you ask for one. Secrets are redacted at index time.
```

**依据 4 · 源码核查**：[extensions/dsh/lib.js:43-51](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/lib.js#L43-L51)

分页沉默只对offset旧版明确提示

```text
// recallSilence is the answer when `deja recall` printed nothing. Past the
// first page that is a deja older than --offset refusing the flag, not an
// empty history: recall always prints a line, "No more matches" included.
export function recallSilence(call) {
  if (call.includes("--offset")) {
    return "This deja cannot page recall. Run deja update, then ask again with the same offset.";
  }
  return "Nothing in this machine's history matches that.";
}
```

#### 缺口

- 旧敏感内容脱敏完整性及跨项目污染未知
  **影响**：自动注入可能披露或引入不适用旧结论
  **进一步探讨**：非敏感历史样本先审实际输出，按项目隔离并对当前任务逐条核来源与适用

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样受控试用，如何验证去污染方向？

**研究主题**：采用判断、新假设与验证

#### 完整回答

有大量同机旧Agent历史的开发者可先关autoRecall，手动用一个精确错误串查询，回原会话核修法和当前版本。相对人工搜各日志，工具入口提供统一索引和上下文，但不把旧决策当当前指令；若来源跨项目不相关、CLI异常呈空结果或召回出现敏感信息，应停自动召回并退回原始日志/grep。由历史可达而当前适用未保证可推导未验证方向：返回每条旧决策时提示项目、版本/时间与失效条件，只在用户确认适用后写当前项目记忆。最小验证固定含过期依赖和相似项目的案例，对比现有召回与适用性标注的错误采用率、token和人工核对时间；若提示增加负担却不减少错误复用，就保留手动查询。该设想应先核核心CLI已有出处/过滤能力，不把适配器缺字段当全系统缺口。

#### 证据与依据

**依据 1 · 作者声明**：[extensions/dsh/README.md:77-83](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/README.md#L77-L83)

autoRecall可关闭保留工具/命令

````text
```yaml
- insert:
    - id: deja
      name: dsh-deja
      config:
        autoRecall: false   # tools and /deja only
```
````

**依据 2 · 源码核查**：[extensions/dsh/index.js:344-383](https://github.com/vshulcz/deja-vu/blob/c0239d42f2f4017f1f78c24ada76884d8de7c316/extensions/dsh/index.js#L344-L383)

当前cwd/session参与召回但不证明旧结论适用

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

#### 缺口

- 核心CLI现有出处/失效表示及适用性标注价值未知
  **影响**：只能作为待核假设，不确定需要新插件
  **进一步探讨**：先对实际返回页面查现有字段，再用过期/跨项目样本比较

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
