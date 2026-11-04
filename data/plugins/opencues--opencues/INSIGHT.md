# OpenCues

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[2ba4135](https://github.com/opencues/opencues/tree/2ba4135524ac41bca3ac38871099db3f8e1ef7c5)

<!-- BEGIN META -->
[![GitHub ★ 70](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=70&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/opencues/opencues)
<!-- END META -->

> **功能**：为多种宿主提供输入位置的模型提示、填充及可配置动作。

> **亮点**：[Q01](#research-q01) 展示跨宿主的输入位置交互，[Q02](#research-q02) 有路由与缓存源码依据；效果尚未对照。

> **主要限制**：[Q03](#research-q03) 草稿可能发送模型端点，本地脚本及设备动作具有独立权限边界。

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
  - [Q01 · 面向谁，相比手工改写和聊天有什么增量？](#detail-section-11)
  - [Q02 · 下划线与词级提示如何路由？](#detail-section-12)
  - [Q03 · 草稿、执行和沙箱有哪些边界？](#detail-section-13)
  - [Q04 · 运行成本和试用退出条件是什么？](#detail-section-14)
  - [Q05 · 如何检验降低误触及泄露的改进？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户在编辑或编码输入中寻求提示、改写和按需填充。

普通编辑器、手工改写与独立聊天也可完成类似工作；项目把这些功能带到输入位置。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| Cues | 输入时给出提示 | 模型质量与发送边界待验证 |
| Blanks | 按关键词和下划线填充 | 具体路由按配置 |
| 动作 | 可调用设备或本地脚本 | 脚本以用户权限运行 |
| 多宿主 | 在输入位置交互 | 部分 Beta，未运行 |

**流程与依赖**

| 依赖 | 条件 | 用途 | 缺失影响 |
|---|---|---|---|
| Node >=22 | 工作区需要 | 运行工具 | 无法按声明运行 |
| 模型端点和凭据 | 模型功能需要 | 提示与生成 | 模型能力不可用 |
| 兼容宿主 | 集成需要 | 输入与展示 | 无该宿主功能 |
| 可信脚本配置 | 本地动作需要 | 执行 blank | 不可信代码不应执行 |

| 步骤 | 动作 | 判据 |
|---|---|---|
| 准备 | 检查端点、宿主和脚本 | 非敏感输入、可信环境 |
| 输入 | 触发提示或下划线 | 核对路由和数据发送 |
| 审阅 | 查看生成或设备动作 | 错误时撤销或停止 |
| 评估 | 记录成本和错误 | 不满足隐私或准确率则停用 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | 宿主、模型及凭据 | 配置及审查脚本 | 兼容未知 |
| 持续 | 模型调用和时延 | 审核输出及误触 | 实际费用未知 |
| 恢复 | 卸载和配置备份 | 排查集成 | 各宿主恢复未测 |

| 效果 | 支持证据 | 未知 |
|---|---|---|
| 输入位置交互 | 作者描述及路由源码 | 真实效率和准确率 |
| 路由缓存 | 静态代码 | 命中率及时延 |
| 安全边界 | 文档列出信任与缺口 | 实际隔离能力 |

> **思考**：[Q03](#research-q03) 草稿可能发送模型端点，本地脚本及设备动作具有独立权限边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 展示跨宿主的输入位置交互，[Q02](#research-q02) 有路由与缓存源码依据；效果尚未对照。

[Q02](#research-q02) 行内关键词匹配和缓存可供核查；[Q03](#research-q03) 的脚本和模型输出需分别评估。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 草稿可能发送模型端点，本地脚本及设备动作具有独立权限边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在隔离环境用非敏感输入核对端点和脚本；不接受数据或权限边界则停用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

定向核查固定版本根仓库源码和安全文档；未运行目标、宿主或模型。

- 已检查：作者 README、包清单、源码路径 README.md、SECURITY.md、package.json、packages/opencues-core/src/sources/blank-source.ts、packages/opencues-core/src/sources/routed-word-source-group.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查根仓库入口、关键词路由、词级缓存及安全文档；未全面审计全部宿主、脚本与网络路径，DSH 子组件另行研究。
- 下一步：在固定宿主与模型测试触发、误触、外发、设备动作、时延及卸载恢复。

**分析版本**

- **仓库**：[opencues/opencues](https://github.com/opencues/opencues)
- **版本号**：0.1.0（[固定提交 2ba4135](https://github.com/opencues/opencues/tree/2ba4135524ac41bca3ac38871099db3f8e1ef7c5)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出敏感输入发送前确认，需验证误发和负担。

在固定宿主与模型测试触发、误触、外发、设备动作、时延及卸载恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 242 | 51424 | — | — | 447068 |
| .md | example | 2 | 147 | — | — | 849 |
| .js | source | 8 | 7036 | 5688 | 732 | — |
| .cjs | source | 72 | 22210 | 15378 | 5486 | — |
| .mjs | source | 3 | 354 | 227 | 106 | — |
| .cjs | test | 61 | 11514 | 8640 | 1649 | — |
| .ts | source | 232 | 78843 | 45090 | 29727 | — |
| .ts | test | 455 | 109061 | 83665 | 17101 | — |
| .md | test | 94 | 12985 | — | — | 85028 |
| .mjs | test | 16 | 3087 | 2232 | 708 | — |
| .tsx | source | 1 | 519 | 326 | 192 | — |
| .js | test | 1 | 210 | 157 | 20 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/opencues/opencues/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根仓库的输入路由、跨宿主范围和信任边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向谁，相比手工改写和聊天有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在终端、浏览器或编码宿主中写作的用户，作者描述 Cues 在输入时提示修改，Blanks 在行末下划线触发生成或动作。普通编辑器和独立聊天也能改写，本项目把建议、按需填充和多个宿主接在输入位置；没有独立证据证明编辑效率或准确率提升。DSH 适配另为独立组件，本项研究根仓库。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-41](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/README.md#L39-L41)

场景和双向概念。

```text
**Turn any text field into a two-way LLM channel.** It reads what you write and fills what you ask: catching a slip as you type, or answering the moment you end a line with `_`. A drop-in for Claude Code, OpenCode, Gemini CLI, your shell, and Chrome. Model-agnostic, output you review before it sends, an open standard with no chat window.

The model comes to your cursor, both ways. **Cues** react to what you've already written and surface a fix or a sharper line inline, unprompted. **Blanks** act on demand: end a line with `_` and the model fills in the rest. No chat window, no copy-paste, no context switch.
```

**依据 2 · 作者声明**：[README.md:90-99](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/README.md#L90-L99)

入口和依赖。

<details>
<summary>查看原文（10行）</summary>

````text
# Quickstart

```bash
npm install -g opencues              # needs Node 22+ and git
opencues set-key cerebras csk-...    # cerebras.ai — free tier, lowest latency
opencues install claude-code         # or: opencode | gemini-cli | chrome | shell | dsh
claude-cues                          # launch — native `claude` is untouched
```

Full walkthrough, prerequisites, and per-host detail: [`docs/install.md`](docs/install.md). `opencues doctor` diagnoses anything that looks wrong.
````

</details>

**依据 3 · 作者声明**：[README.md:111-125](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/README.md#L111-L125)

多宿主及 DSH 边界。

<details>
<summary>查看原文（15行）</summary>

```text
# Integrations

| Host | Status | Install |
|---|---|---|
| Claude Code | Available | `opencues install claude-code` |
| OpenCode | Available | `opencues install opencode` |
| Gemini CLI | Beta | `opencues install gemini-cli` |
| Chrome | Beta | `opencues install chrome` |
| Shell | Beta | `opencues install shell` |
| DeepSeek Harness | Beta | `dsh plugin --profile web add @opencues/dsh` |

Each pins its own upstream fork and never touches your native host install.
DeepSeek Harness is the exception: it has a real plugin system, so there is no
fork to pin and no OpenCues CLI step — see
[`integrations/dsh/README.md`](integrations/dsh/README.md).
```

</details>

#### 缺口

- 没有同任务对照和用户效果数据
  **影响**：无法量化效率或正确率
  **进一步探讨**：固定输入任务对比普通编辑和聊天的时间与错误率。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 下划线与词级提示如何路由？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

BlankSource 在 context words 包含下划线时支持请求，查找第一个下划线，在同一行匹配配置关键词并以距离选取；具体匹配还取决于 keywordInWindow。词级组具有按来源的有界缓存，并在宿主不支持循环时跳过该组。匹配和缓存是定向源码观察，不代表全部入口或所有宿主均相同。

#### 证据与依据

**依据 1 · 源码核查**：[packages/opencues-core/src/sources/blank-source.ts:50-85](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/packages/opencues-core/src/sources/blank-source.ts#L50-L85)

下划线支持和首个位置。

<details>
<summary>查看原文（36行）</summary>

```text
export class BlankSource implements CueSource {
  readonly id = 'blank';
  readonly priority = 95;
  /** BlankSource dispatches to potentially-many BlankConfig entries.
   *  Cycleability is per-config, not per-source — `buildSourcesFromConfig`
   *  prunes cycleable entries from the blanks map BEFORE constructing
   *  BlankSource when the host advertises `supportsCycling: false`. At
   *  this level the source is treated as not-cycleable; the pruning
   *  upstream is what enforces compatibility. */
  readonly isCycleable = false;

  private blanks: Record<string, BlankConfig>;
  private readState: (blankName: string, matchedKeyword?: string, contextWords?: string[]) => string | null | Promise<string | null>;

  constructor(config: BlankSourceConfig) {
    this.blanks = config.blanks;
    this.readState = config.readState;
  }

  supports(context: CueContext): boolean {
    return context.words.some(w => w === '_');
  }

  async getCues(context: CueContext): Promise<CueSourceResult> {
    const results: CueResult[] = [];

    // Find the blank position(s) — bind the first one
    const blankIndex = context.words.indexOf('_');
    if (blankIndex === -1) {
      return { results };
    }

    // Find which blank matches by scanning context words against blankKeywords
    // Keywords can be multi-word phrases (e.g. "opencues settings") — matched as consecutive words
    const contextLower = context.words.map(w => w.toLowerCase());
    let matched: BlankConfig | undefined;
```

</details>

**依据 2 · 源码核查**：[packages/opencues-core/src/sources/blank-source.ts:104-125](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/packages/opencues-core/src/sources/blank-source.ts#L104-L125)

同行窗口及最近匹配。

<details>
<summary>查看原文（22行）</summary>

```text
    // Window: line-scoped — a keyword claims when it's on the same line as
    // the `_`. Shared with the FluidBlank/Transform/ConfigIntent cede checks
    // + BlankFill (see keyword-window.ts). `gap` still drives the
    // closest-match tie-break (bestGap).
    const lineOf = lineOfWords(context.text);
    let bestGap = Infinity;
    for (const [, blk] of Object.entries(this.blanks)) {
      if (!blk.blankKeywords?.length) continue;

      for (const kw of blk.blankKeywords) {
        const kwParts = kw.split(/\s+/);
        const kwLen = kwParts.length;
        let idx = findPhrase(kw, 0);
        while (idx !== -1) {
          // For multi-word keywords, the window is measured from the last word of the phrase to the blank
          const endIdx = idx + kwLen - 1;
          const gap = Math.abs(endIdx - blankIndex) - 1;
          if (keywordInWindow(endIdx, blankIndex, { lineOf }) && gap < bestGap) {
            matched = blk;
            matchedKeyword = kw;
            matchedKeywordIndex = idx;
            bestGap = gap;
```

</details>

**依据 3 · 源码核查**：[packages/opencues-core/src/sources/routed-word-source-group.ts:114-156](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/packages/opencues-core/src/sources/routed-word-source-group.ts#L114-L156)

宿主循环能力及缓存。

<details>
<summary>查看原文（43行）</summary>

```text
export class RoutedWordSourceGroup implements CueSource {
  readonly id: string;
  readonly priority: number;
  /** RoutedWordSourceGroup wraps word-cue ConfigSources — always
   *  cycleable since cues by definition surface alternatives the
   *  user picks between. Hosts without a cycling surface skip the
   *  whole group at registration. */
  readonly isCycleable = true;

  /** Sources with `match:` or `keywords:` — checked priority desc. */
  private readonly entries: readonly RouteEntry[];

  /**
   * Per-child-source LRU cache of dispatch results, keyed on the EXACT
   * sub-context text the child source receives (`0=cat 1=sat 2=the`).
   * Hits when the LLM input is unchanged from a recent dispatch —
   * common during typing (every space the user types reproduces the
   * prior word set), edit-revisit loops, and after cursor moves that
   * re-fire the debounce on identical text.
   *
   * Caches BOTH zero-result responses and positive results. The
   * dominant case in production is the spelling source (match: .*)
   * firing ~280ms LLM round-trips on neutral prose to find zero
   * misspellings — caching that empty result is the biggest single win.
   *
   * Cache lifetime is tied to this group instance. When the resolver
   * rebuilds sources (OPENCUES.md flags change, CUES.md edits, focus
   * moves between cycling / non-cycling hosts), the group is
   * reconstructed and this cache is GC'd with the old instance — no
   * explicit invalidation needed.
   *
   * Cached values are SUB-CONTEXT-INDEXED (wordIndex 0..k matching the
   * bucket order at dispatch time). On hit we remap to the CURRENT
   * bucket's original indices, so the same sub-context text in a
   * different surrounding buffer (same word set, different positions)
   * is still correctly mapped.
   *
   * Bounded LRU; insertion order = recency since Map preserves
   * insertion order and we delete+reinsert on hit. Mirrors the
   * AgentRewrite._rewriteCache shape (see agent-rewrite.ts:209).
   */
  private readonly _resultCache = new Map<ConfigSource, Map<string, ReadonlyArray<CueResult>>>();
  private static readonly CACHE_SIZE_PER_SOURCE = 64;
```

</details>

#### 缺口

- 未运行按键、路由及多宿主入口
  **影响**：无法确认输入体验、时延或竞态
  **进一步探讨**：固定输入和多个宿主验证触发、覆盖和取消。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 草稿、执行和沙箱有哪些边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

安全文档称草稿作为提示发往对应模型端点，本地 blank 脚本以用户权限运行；OS 级沙箱默认并非强制，文档还指出循环 set 路径未应用沙箱。README 的无 LLM 输出工具处理声明与有设备动作和本地脚本应分别理解：不能由此推断所有功能没有副作用。具体版本的隔离、网络和所有动作未实测。

#### 证据与依据

**依据 1 · 作者声明**：[SECURITY.md:31-51](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/SECURITY.md#L31-L51)

信任模型与脚本。

<details>
<summary>查看原文（21行）</summary>

```text
## Trust model

OpenCues runs locally on your machine. The fundamental trust
assumption: **anything you put in `~/.cues/` is trusted code, just
like `.bashrc` or `~/.config/<tool>/`**. The runtime executes scripts
under `blanks/<name>/<name>.sh` with your user permissions; it sends
your current draft as prompt context to whichever LLM endpoint each
cue/blank/auditor specifies. Both are user-authorised behaviours.

The standard formalises this in `spec/blank-spec.md § Trust model`:

- `stepValues:` blanks (static lists) and `impl:` blanks (in-process
  classes that must exist in the runtime ahead of time) are
  **registry-safe** — no code execution from a `BLANK.md` alone.
- `blankScript:` blanks invoke shell scripts. v1.0 carves these out
  of any future registry distribution: a conformant runtime MUST
  source them only from local directories (`<root>/blanks/<name>/`)
  or shipped defaults (`defaults/blanks/<name>/`), MUST NOT
  auto-install from a network source, MUST NOT trust frontmatter
  flags (`trusted: true`, `signed: ...`) as a substitute for user
  inspection, and SHOULD log script invocations.
```

</details>

**依据 2 · 作者声明**：[SECURITY.md:122-139](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/SECURITY.md#L122-L139)

文档列出的沙箱缺口。

<details>
<summary>查看原文（18行）</summary>

```text
## Known gaps (deferred to post-v1.0)

The spec's "future revision" commitment captures these:

- **Default-on sandbox.** The OS-level sandbox shipped as opt-in:
  blanks declare `sandbox: strict` to receive it. Existing shipped
  blanks (volume, brightness) need `/mnt/c/` filesystem access for
  Windows-side binaries (`VolCtl.exe`) and won't run inside the
  sandbox until they declare those permissions explicitly. Migration
  plan: audit each default blank, attach `sandbox: strict` or
  `sandbox: off` with rationale, then flip the runtime default.
- **Syscall-level confinement.** The bwrap sandbox is filesystem-
  and namespace-shaped, not syscall-shaped. A future revision could
  layer `--seccomp <fd>` to block `ptrace`, `chroot`, `mount`, etc.
- **Sandbox cycling (`set` calls).** Today only the blank-fill
  `get` path applies the sandbox. Cycling Up/Down on a sandboxed
  blank fires `set <value>` unsandboxed. Plumbing the sandbox config
  through `cycling.ts`'s `invokeOrSpawn` helper closes this; tracked
```

</details>

**依据 3 · 作者声明**：[README.md:137-146](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/README.md#L137-L146)

设备动作与可选上下文。

<details>
<summary>查看原文（10行）</summary>

```text
| Feature | What it does |
|---|---|
| **Blanks** | Type `_` for free-form generation, translation, formatting, full rewrites, or keyword-bound system actions (`volume _`, `weather _`). |
| **Sentence rewrites** | Cycle a whole sentence to a different register (formal, concise, ...) seamlessly, no `_` needed. |
| **Word cues** | Navigate to a single word and cycle a smaller LLM-suggested alternative. |
| **Live actuators** | `volume _` reads the real level and leaves a knob you can turn: `Ctrl+Alt+↑/↓` or a bare `_` moves it, and the device follows. |
| **Dismissing a cue** | A cue that only tells you something can be silenced from its own note: `_` once quiets it for a while, `_` again forgets it for good. `opencues dismissals` lists what you forgot and turns any of it back on. |
| **Session-contradiction cues** (opt-in) | Flags a draft that goes against a decision made earlier in the same coding session, on any host with a transcript. |
| **Ask-cues** (opt-in) | Turns a vague sentence into an inline question with cyclable answers, using the assistant's own clarifying prompt. |
| **Personal + ambient context** (opt-in) | `my email _` substitutes your real address; fluid lookups can read the page you're on. |
```

</details>

**依据 4 · 作者声明**：[README.md:183-194](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/README.md#L183-L194)

针对模型输出的安全声明。

<details>
<summary>查看原文（12行）</summary>

```text
# Security

OpenCues has no tool handlers or exec layer for LLM output — no MCP-tool execution, no agentic actions, no side-effect channel. Worst-case, an LLM response lands as user-visible text in the buffer you review before submitting. That single invariant is what keeps prompt injection a UX failure instead of a data-exfiltration channel, across every surface below.

23 of 27 tracked attack classes closed, 3 closed-with-caveat, 1 tracked for the future pack registry ([full audit table](docs/architecture/security-audit.md)).

| Defense | What it covers |
|---|---|
| Sandbox isolation | Third-party blank JS runs in a real V8 isolate (`isolated-vm`) — its own realm, own intrinsics, no sandbox-escape via constructor-chain pivots |
| Capability gates | A blank only gets `network`/`llm`/`storage`/`secrets` access if declared; secrets without a matching host binding are refused at load time |
| Resource quotas | Sliding-window caps on fetches, LLM calls, and storage writes — no polling hammer, no runaway LLM burn |
| Output sanitization | Blank output is stripped of HTML/script tags, zero-width chars, and bidi overrides before it reaches the buffer |
```

</details>

#### 缺口

- 未全面审计或实测执行与网络路径
  **影响**：不能保证无泄露或沙箱完整
  **进一步探讨**：在隔离环境验证草稿外发、设备动作及 get/set 限制。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 运行成本和试用退出条件是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

仓库声明 Node 22 及 macOS/Linux，快速开始还需要 git、模型端点及凭据；不同宿主有各自集成，部分为 Beta。需检查可信配置和脚本、审查草稿及生成内容，并承担模型调用、时延和维护成本，实际数字未知。应先在隔离环境用非敏感文本测试；数据外发或脚本权限不可接受则停用对应功能。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-13](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/package.json#L1-L13)

私有根工作区及运行平台。

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "opencues",
  "version": "0.1.0",
  "license": "Apache-2.0",
  "private": true,
  "packageManager": "pnpm@10.33.0",
  "engines": {
    "node": ">=22"
  },
  "os": [
    "darwin",
    "linux"
  ],
```

</details>

**依据 2 · 作者声明**：[README.md:90-99](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/README.md#L90-L99)

安装与密钥示例。

<details>
<summary>查看原文（10行）</summary>

````text
# Quickstart

```bash
npm install -g opencues              # needs Node 22+ and git
opencues set-key cerebras csk-...    # cerebras.ai — free tier, lowest latency
opencues install claude-code         # or: opencode | gemini-cli | chrome | shell | dsh
claude-cues                          # launch — native `claude` is untouched
```

Full walkthrough, prerequisites, and per-host detail: [`docs/install.md`](docs/install.md). `opencues doctor` diagnoses anything that looks wrong.
````

</details>

**依据 3 · 作者声明**：[README.md:113-127](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/README.md#L113-L127)

宿主状态。

<details>
<summary>查看原文（15行）</summary>

```text
| Host | Status | Install |
|---|---|---|
| Claude Code | Available | `opencues install claude-code` |
| OpenCode | Available | `opencues install opencode` |
| Gemini CLI | Beta | `opencues install gemini-cli` |
| Chrome | Beta | `opencues install chrome` |
| Shell | Beta | `opencues install shell` |
| DeepSeek Harness | Beta | `dsh plugin --profile web add @opencues/dsh` |

Each pins its own upstream fork and never touches your native host install.
DeepSeek Harness is the exception: it has a real plugin system, so there is no
fork to pin and no OpenCues CLI step — see
[`integrations/dsh/README.md`](integrations/dsh/README.md).

> ⚠️ **Windows**: not supported natively, run inside WSL2 (see [`docs/install.md`](docs/install.md)).
```

</details>

**依据 4 · 作者声明**：[SECURITY.md:31-38](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/SECURITY.md#L31-L38)

草稿和脚本权限。

```text
## Trust model

OpenCues runs locally on your machine. The fundamental trust
assumption: **anything you put in `~/.cues/` is trusted code, just
like `.bashrc` or `~/.config/<tool>/`**. The runtime executes scripts
under `blanks/<name>/<name>.sh` with your user permissions; it sends
your current draft as prompt context to whichever LLM endpoint each
cue/blank/auditor specifies. Both are user-authorised behaviours.
```

#### 缺口

- 未测费用、宿主兼容和恢复
  **影响**：不能评估总成本
  **进一步探讨**：记录请求量、延迟、误触和卸载恢复结果。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何检验降低误触及泄露的改进？

**研究主题**：新假设与验证

#### 完整回答

可以探索在敏感输入场景为每次触发展示拟发送内容和目标，并要求明确确认；与现有文档的输出审阅不同，这个提议发生在发送前。以真实或合成敏感片段比较自动触发与确认方案的误发率、延迟及编辑负担，若识别不可靠或负担过大则否定。尚未实现或测试。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-41](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/README.md#L39-L41)

作者描述输出审阅及自动提示。

```text
**Turn any text field into a two-way LLM channel.** It reads what you write and fills what you ask: catching a slip as you type, or answering the moment you end a line with `_`. A drop-in for Claude Code, OpenCode, Gemini CLI, your shell, and Chrome. Model-agnostic, output you review before it sends, an open standard with no chat window.

The model comes to your cursor, both ways. **Cues** react to what you've already written and surface a fix or a sharper line inline, unprompted. **Blanks** act on demand: end a line with `_` and the model fills in the rest. No chat window, no copy-paste, no context switch.
```

**依据 2 · 作者声明**：[SECURITY.md:31-38](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/SECURITY.md#L31-L38)

草稿发送模型端点。

```text
## Trust model

OpenCues runs locally on your machine. The fundamental trust
assumption: **anything you put in `~/.cues/` is trusted code, just
like `.bashrc` or `~/.config/<tool>/`**. The runtime executes scripts
under `blanks/<name>/<name>.sh` with your user permissions; it sends
your current draft as prompt context to whichever LLM endpoint each
cue/blank/auditor specifies. Both are user-authorised behaviours.
```

#### 缺口

- 发送前确认方案及敏感场景识别未验证
  **影响**：不能声称已防止泄露
  **进一步探讨**：在隔离宿主设计可复现的误发对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
