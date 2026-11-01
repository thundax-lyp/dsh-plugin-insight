# Déjà Vu

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[232ff95](https://github.com/vshulcz/deja-vu/tree/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518)

<!-- BEGIN META -->
[![GitHub ★ 1,343](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C343&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vshulcz/deja-vu)
<!-- END META -->

> **功能**：为编码助手索引本机会话历史，并提供跨会话检索与召回。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将分散历史索引并以统一入口检索；历史质量和节时仍需对照。

> **主要限制**：[Q03](#research-q03) 正则去敏可关闭且不能证明全覆盖；旧索引和跨项目历史必须核时效与授权。

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
  - [Q01 · 多助手开发者为何需要跨会话历史，和手工查原始日志有什么区别？](#detail-section-11)
  - [Q02 · 本机记录如何进入索引并按项目检索？](#detail-section-12)
  - [Q03 · 去敏和跨项目过滤是否能保证召回内容安全可信？](#detail-section-13)
  - [Q04 · 安装、索引与可选外发成本和退出条件是什么？](#detail-section-14)
  - [Q05 · 能否让读者核对历史决策的新鲜度与项目归属？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用多个编码助手的开发者需要找回旧错误、命令和决定。

用户可按文件与项目手工搜索原始会话日志。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 历史索引 | 收集本机会话供查询 | 覆盖取决于本机来源和权限 |
| 搜索与召回 | 查找历史并分页 | 不可写时可能使用旧索引 |
| 项目范围 | 限定或派生项目匹配 | 仅特定条件可从较宽结果复用 |
| 文本去敏 | 对匹配规则作处理 | 可关闭且不能证明全覆盖 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| deja 可执行程序 | 本机检索需要 | 索引与查询 | 无法运行 |
| 本机历史及权限 | 有效召回需要 | 提供会话来源 | 可能无可读记录 |
| 本机存储 | 索引与记忆需要 | 保存索引和决策 | 不可写可能使用旧索引 |
| embedding 服务 | 可选 | 语义检索 | 普通词法查询可继续 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认本机历史权限与模型目的地 | 敏感内容不允许外发时停用远程服务 |
| 建索引 | 选择隔离历史并建立索引 | 检查不可读或旧索引警告 |
| 查询 | 用具体错误或文件查询 | 核对来源、项目和时效 |
| 恢复 | 检查索引、记忆和配置路径 | 出错时退回原始日志 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 索引存储和计算资源未知 | 选择历史和权限 | 覆盖率未测 |
| 持续 | 索引刷新及可选 embedding 费用未知 | 核查来源和变化 | 效果与节时未对照 |
| 恢复 | 重建或清理资源未知 | 检查数据目录与原始日志 | 退出效果未演练 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一检索 | CLI 搜索、召回和索引检查 | 召回率及任务节时 |
| 项目范围 | 条件性过滤与派生 | 严格跨项目保密 |
| 去敏 | 可配置规则处理 | 所有秘密均被删除 |

> **思考**：[Q03](#research-q03) 正则去敏可关闭且不能证明全覆盖；旧索引和跨项目历史必须核时效与授权。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将分散历史索引并以统一入口检索；历史质量和节时仍需对照。

[Q02](#research-q02) 区分索引构建、不可写时旧索引和范围派生前提；[Q03](#research-q03) 去敏规则不能替代信息流验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 正则去敏可关闭且不能证明全覆盖；旧索引和跨项目历史必须核时效与授权。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 使用隔离历史先查一条已知错误并核原文；若权限、数据去向或索引状态不清，停止自动使用并回查日志。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定提交根项目代表性 Go 源码已查；未运行目标、宿主、模型或网络。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cmd/deja/recall_cli.go、cmd/deja/main.go、internal/index/scoped.go、internal/redact/redact.go 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读根 README、清单和固定提交 Go CLI、项目范围与去敏代表源码；未引用另列 DSH 子组件源码，不核所有历史解析器、embedding、平台或脱敏规则，不运行目标。
- 下一步：以固定历史比较搜索与人工结果，模拟索引不可写和不同项目，并按 [Q05](#research-q05) 检验冲突决策与来源缺失。

**分析版本**

- **仓库**：[vshulcz/deja-vu](https://github.com/vshulcz/deja-vu)
- **版本号**：0.23.3（[固定提交 232ff95](https://github.com/vshulcz/deja-vu/tree/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设对相互矛盾历史提供来源和版本核对视图，可减少错误采纳；须先核现有能力且未验证。

以固定历史比较搜索与人工结果，模拟索引不可写和不同项目，并按 [Q05](#research-q05) 检验冲突决策与来源缺失。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 118 | 18084 | — | — | 232690 |
| .js | source | 7 | 2457 | 1720 | 579 | — |
| .js | test | 8 | 1860 | 1476 | 246 | — |
| .mjs | source | 15 | 2190 | 1560 | 477 | — |
| .mjs | test | 7 | 1023 | 841 | 90 | — |
| .ts | source | 1 | 302 | 212 | 73 | — |
| .md | example | 2 | 8 | — | — | 30 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/vshulcz/deja-vu/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对本机历史索引、范围和隐私，区别同仓 DSH 扩展。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 多助手开发者为何需要跨会话历史，和手工查原始日志有什么区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README:48-51 将根项目描述为本地历史工具：索引多个编码助手已写出的会话，经 MCP 和 hooks 返回历史。相对人工逐文件检索，核心增量是统一索引、带项目上下文的查询和可分页结果；模型与实际历史仍来自其他系统。根 package.json:1-10 声明 DSH 可安装清单重导向同仓子扩展，根仓也包含独立 Go 程序；本题只分析根引擎，不引用另列 DSH 子组件实现。作者的受支持助手数和索引质量未独立核验，实际节时需对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:48-51](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/README.md#L48-L51)

作者描述本机历史与集成。

```text

<p align="center"><sub>Found it useful? <a href="https://github.com/vshulcz/deja-vu">Star deja-vu on GitHub</a>.</sub></p>

deja-vu (vshulcz/deja-vu) is a local memory tool for coding agents: it indexes the session transcripts Claude Code, Codex, Cursor and 40 other agents already wrote to disk and hands relevant history back over MCP and hooks. No LLM, one Go binary.
```

**依据 2 · 源码核查**：[package.json:1-10](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/package.json#L1-L10)

根清单的 DSH 重导向与 Go 仓身份。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "dsh-deja",
  "version": "0.23.3",
  "private": true,
  "description": "Repository-root manifest for the DeepSeek Harness plugin that lives in extensions/dsh — the same package published to npm as dsh-deja. It re-exports the subdirectory so the plugin installs from a bare git URL or from github:vshulcz/deja-vu#path:extensions/dsh; the npm package is the shorter path. The repository itself is the Go project behind the deja binary.",
  "type": "module",
  "main": "./extensions/dsh/index.js",
  "exports": {
    ".": "./extensions/dsh/index.js",
    "./client": "./extensions/dsh/client.js",
```

</details>

**依据 3 · 源码核查**：[cmd/deja/recall_cli.go:18-25](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/cmd/deja/recall_cli.go#L18-L25)

CLI 召回分页入口。

```text
var recallFlags = []string{"--project", "--harness", "--limit", "--offset"}

// runRecall prints what the MCP recall tool answers: the framed page, budgeted
// the same way, this project first. `deja search --json` was the only answer
// an agent could ask for on the command line, and it ran to 1-2 MB, which a
// harness truncates to nothing; a skill that drives deja through the shell had
// nothing it could read (#4781).
func runRecall(dir string, args []string, stdout io.Writer) error {
```

#### 缺口

- 未核全部历史解析器、覆盖率和真实任务效果
  **影响**：不能把作者数量或程序存在当收益
  **进一步探讨**：固定历史、查询与时间预算，对照手工搜索。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本机记录如何进入索引并按项目检索？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

cmd/deja/main.go:579-605 提供显式 index 路径并允许按环境控制自动构建；1747-1793 的搜索解析参数后先确保索引，若存储不可写但已有可读索引则提示使用旧索引。recall_cli.go:18-25、93-109 接受项目、来源、limit 和 offset，查询后封装并记录返回；scoped.go:8-33 只有精确检索、范围完整且命中数满足条件时才从较宽结果安全派生更窄项目结果，否则返回 false 让调用方另处理。静态实现表明条件性复用与旧索引退路，不等于始终及时、完整或跨项目完全隔离。

#### 证据与依据

**依据 1 · 源码核查**：[cmd/deja/main.go:579-605](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/cmd/deja/main.go#L579-L605)

索引命令和自动构建开关。

<details>
<summary>查看原文（27行）</summary>

```text
func cmdIndex(dir string, rest []string) error {
	force := false
	quiet := false
	for _, a := range rest {
		switch a {
		case "--rebuild", "-rebuild":
			force = true
		case "--quiet", "-quiet":
			quiet = true
		default:
			return unknownFlag("index", a, indexFlags)
		}
	}
	// The detached warmup runs this command too. With automatic indexing off
	// it is not the user asking, so it writes nothing; anything else here is
	// the explicit build the switch leaves on (#5385).
	if os.Getenv("DEJA_WARMUP_SENTINEL") != "" && index.Manual() {
		clearWarmupSentinel()
		return nil
	}
	// Before the freshness walk and the index lock, either of which can take
	// minutes on a contended disk: from here on the claim names a live owner.
	adoptWarmupClaim()
	defer index.AllowBuild()()
	// Run by hand, it is also what turns search-only on or off (#5395).
	if os.Getenv("DEJA_WARMUP_SENTINEL") == "" {
		defer index.ApplySearchOnly()()
```

</details>

**依据 2 · 源码核查**：[cmd/deja/main.go:1747-1793](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/cmd/deja/main.go#L1747-L1793)

搜索前确保索引及旧索引回退。

<details>
<summary>查看原文（47行）</summary>

```text
func runSearch(dir string, args []string, sourceInstance string) error {
	return searchWithOptions(dir, args, sourceInstance, false)
}

func searchWithOptions(dir string, args []string, sourceInstance string, bare bool) error {
	force := false
	var filtered []string
	for _, a := range args {
		if a == "--rebuild" || a == "-rebuild" {
			force = true
			continue
		}
		filtered = append(filtered, a)
	}
	o, err := parseSearch(filtered)
	if err != nil {
		return err
	}
	harnessRaw := o.Harness
	if herr := checkHarness(&o.Harness); herr != nil {
		return herr
	}
	if rerr := checkRole(o.Role); rerr != nil {
		return rerr
	}
	sinceRaw := sinceRawArg(filtered)
	// Before the index build, so the reader who meant a command sees it first,
	// and then the search runs as typed. On stderr like every other command
	// hint, and never for --json, where a script reads the results (#4628).
	hinted := false
	if bare && !o.JSON && len(args) > 0 {
		if near := oneEditCommand(args[0]); near != "" {
			fmt.Fprintf(os.Stderr, "deja: %q is not a command — did you mean `deja %s`?\n", args[0], near)
			hinted = true
		}
	}
	o.SourceInstance = sourceInstance
	o.RecallWorn = usage.WornSessions(dir)
	prepareFirstIndexGreeting(dir)
	if err = withBuildProgress(func() error { return ensureForCLISearch(dir, o, force, os.Stderr) }); err != nil {
		// A store that cannot be written still has an index that can be read:
		// answering from it beats answering nothing (#904).
		if !staleUnwritableIndex(dir, err) {
			return ensureError(dir, err)
		}
		fmt.Fprintf(os.Stderr, "deja: answering from the index as it was — %v\n", ensureError(dir, err))
	}
```

</details>

**依据 3 · 源码核查**：[cmd/deja/recall_cli.go:18-25](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/cmd/deja/recall_cli.go#L18-L25)

召回分页入口。

```text
var recallFlags = []string{"--project", "--harness", "--limit", "--offset"}

// runRecall prints what the MCP recall tool answers: the framed page, budgeted
// the same way, this project first. `deja search --json` was the only answer
// an agent could ask for on the command line, and it ran to 1-2 MB, which a
// harness truncates to nothing; a skill that drives deja through the shell had
// nothing it could read (#4781).
func runRecall(dir string, args []string, stdout io.Writer) error {
```

**依据 4 · 源码核查**：[cmd/deja/recall_cli.go:93-109](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/cmd/deja/recall_cli.go#L93-L109)

参数检验与调用召回结果。

<details>
<summary>查看原文（17行）</summary>

```text
	q := strings.TrimSpace(strings.Join(terms, " "))
	if q == "" {
		return errors.New("recall: what to recall? deja recall <words>")
	}
	if err := checkHarness(&harness); err != nil {
		return err
	}
	if line := buildingNowForAgent(dir); line != "" {
		_, err := fmt.Fprintln(stdout, frameRecall(line))
		return err
	}
	text, sessions, raw, ids, projects, err := recallTextResultIn(dir, q, harness, project, limit, offset, recallMCPBudget-recallFrameOverhead)
	if err != nil {
		return err
	}
	text = frameRecall(text)
	usage.RecordServedFromInto(dir, usage.KindRecall, text, "", sessions, raw, ids, projects, policy.Load().Describe(policy.ActivationMCP))
```

</details>

**依据 5 · 源码核查**：[internal/index/scoped.go:8-33](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/internal/index/scoped.go#L8-L33)

范围派生的严格前提。

<details>
<summary>查看原文（26行）</summary>

```text
// ScopedFrom is the answer a search of the same query narrowed to scope
// would give, cut from whole, the wider search run with Options.PoolScope
// set to scope. ok is false when the narrower search would have read
// something whole did not, or answered from another tier: no session of the
// scope matched exactly, too few did and it would add a tail of the nearest
// wording, or whole read only part of the scope's matches.
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

- 未核所有采集格式、索引持久性和实际命中效果
  **影响**：无法保证完整性、准确率或刷新延迟
  **进一步探讨**：隔离不同项目和缺失索引做固定查询对照。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 去敏和跨项目过滤是否能保证召回内容安全可信？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

internal/redact/redact.go:387-388 可用 DEJA_NO_REDACT=1 禁用去敏；504-518 展示基于规则的文本处理。README:185-190 说明索引时对部分凭据脱敏，但原始会话仍保留，清理另有动作；scoped.go:14-33 的项目派生只有特定条件可用，不是完整信息流安全证明。规则覆盖、路径和会话权限、错误来源与历史中的恶意指令均不能仅据正则和范围结果认定已解决；如宿主把检索文本送到云模型，仍要另核对授权。

#### 证据与依据

**依据 1 · 源码核查**：[internal/redact/redact.go:387-388](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/internal/redact/redact.go#L387-L388)

环境开关可禁用去敏。

```text
// Disabled reports whether DEJA_NO_REDACT=1 turned redaction off.
func Disabled() bool { return os.Getenv("DEJA_NO_REDACT") == "1" }
```

**依据 2 · 源码核查**：[internal/redact/redact.go:504-518](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/internal/redact/redact.go#L504-L518)

规则处理入口。

<details>
<summary>查看原文（15行）</summary>

```text
// Text applies every rule.
//
// Colored output splits a secret with terminal escapes
// (`TOKEN\x1b[0m=\x1b[33m<value>`): no rule matched it, and the display pass,
// which strips them, printed the value whole. So text holding an escape is
// read again without them, and that reading wins when it finds more. Text
// with nothing behind its escapes keeps them, as the index keeps a transcript
// as it found it.
func Text(s string) (string, Counts) { return text(s, true) }

// text is Text with the finders on or off; off is the plain regexes, which a
// test holds the finders against.
func text(s string, fast bool) (string, Counts) {
	out, counts := textPass(s, nil, fast)
	if strings.IndexByte(out, 0x1b) < 0 {
```

</details>

**依据 3 · 作者声明**：[README.md:185-190](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/README.md#L185-L190)

作者说明索引与原始会话不同。

```text
Credentials are stripped as the index is built: cloud and provider keys, tokens and JWTs,
PEM blocks, passwords in URLs or stated in prose. Each becomes `[redacted:<kind>]` and the
text around it stays searchable. The source transcripts still hold them
([one machine had 84 in 42 sessions](https://vshulcz.github.io/deja-vu/guide/credentials-in-transcripts.html)):
`deja secrets` names those sessions without printing a value, and `deja secrets --scrub`
rewrites the ones it can, keeping the original beside the file.
```

**依据 4 · 源码核查**：[internal/index/scoped.go:14-33](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/internal/index/scoped.go#L14-L33)

有限条件下派生项目范围。

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

**依据 5 · 源码核查**：[internal/redact/redact.go:546-555](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/internal/redact/redact.go#L546-L555)

文本处理检查禁用开关并返回原文。

<details>
<summary>查看原文（10行）</summary>

```text
func TextKinds(s string, allow map[string]bool) (string, Counts) { return textPass(s, allow, true) }

func textPass(s string, allow map[string]bool, fast bool) (string, Counts) {
	counts := Counts{}
	if Disabled() || s == "" {
		return s, counts
	}
	p := kindPass{counts: counts, allow: allow}
	if fast {
		p.v = &view{}
```

</details>

#### 缺口

- 未测试所有秘密格式、文件权限和调用方发往模型路径
  **影响**：不能保证秘密全被移除或历史内容可信
  **进一步探讨**：在隔离样本插入合成秘密和跨项目提示并核查。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、索引与可选外发成本和退出条件是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

README:176-183 说明默认索引/查询本地，但更新、SSH 同步、doctor 和可配置 embedding 等可联网；400-405 的可选 embedding 可指向本地或远程服务，普通词法检索可以在无向量服务时继续。675-684 指出索引、记忆和配置分别存本机路径，退出需检查保留哪些数据；README 的删除命令只是作者说明，本轮不执行。开发者需有本机历史与读取权限、评估首次索引/持续维护与恢复工作，模型外发成本和人工回查时间未知。数据敏感或项目不清时先关闭外部 embedding 并手动回查；不能据本地索引宣称全链离线。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:176-190](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/README.md#L176-L190)

作者说明联网操作与凭据边界。

<details>
<summary>查看原文（15行）</summary>

```text
## Privacy

Indexing and search are local. The network is used only by `deja update`, `deja sync ssh`,
the version check in `deja doctor`, `deja embed` against an endpoint you configure (and,
once it has built the semantic sidecar, each search, which sends the query to that
endpoint), and a once-a-day look at the latest release from an interactive command. That look sends no
session data; `DEJA_OFFLINE=1` turns it off, and so does `DEJA_NO_UPDATE_NOTICE` set to any
value, which also hides the note a new version prints on its first run.

Credentials are stripped as the index is built: cloud and provider keys, tokens and JWTs,
PEM blocks, passwords in URLs or stated in prose. Each becomes `[redacted:<kind>]` and the
text around it stays searchable. The source transcripts still hold them
([one machine had 84 in 42 sessions](https://vshulcz.github.io/deja-vu/guide/credentials-in-transcripts.html)):
`deja secrets` names those sessions without printing a value, and `deja secrets --scrub`
rewrites the ones it can, keeping the original beside the file.
```

</details>

**依据 2 · 作者声明**：[README.md:400-405](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/README.md#L400-L405)

可选 embedding 与词法回退。

```text
## Semantic recall (optional)

Point `deja embed` at a local Ollama, LM Studio or OpenAI-compatible endpoint with
`DEJA_EMBED_URL` and rephrased queries still hit. Without a reachable runtime, lexical
search and MCP recall continue unchanged. OpenAI Platform works with its standard key:

```

**依据 3 · 作者声明**：[README.md:675-684](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/README.md#L675-L684)

作者说明卸载及数据位置。

<details>
<summary>查看原文（10行）</summary>

````text

```sh
deja uninstall --all
rm -rf ~/.cache/deja ~/.local/share/deja ~/.config/deja
```

The index is under `~/.cache/deja`, your `remember` and `promote` notes in
`~/.local/share/deja`, and the rules, exclude list, project aliases and hook launcher in
`~/.config/deja` (or under `XDG_DATA_HOME` and `XDG_CONFIG_HOME` when set; on
Windows the notes are in `%AppData%\deja`).
````

</details>

**依据 4 · 源码核查**：[cmd/deja/main.go:1783-1793](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/cmd/deja/main.go#L1783-L1793)

索引不可写时回退旧索引。

<details>
<summary>查看原文（11行）</summary>

```text
	o.SourceInstance = sourceInstance
	o.RecallWorn = usage.WornSessions(dir)
	prepareFirstIndexGreeting(dir)
	if err = withBuildProgress(func() error { return ensureForCLISearch(dir, o, force, os.Stderr) }); err != nil {
		// A store that cannot be written still has an index that can be read:
		// answering from it beats answering nothing (#904).
		if !staleUnwritableIndex(dir, err) {
			return ensureError(dir, err)
		}
		fmt.Fprintf(os.Stderr, "deja: answering from the index as it was — %v\n", ensureError(dir, err))
	}
```

</details>

#### 缺口

- 未运行安装、索引、同步或 embedding
  **影响**：不能量化资源、费用与退出清理效果
  **进一步探讨**：以隔离历史运行单次查询和清理演练，检查目的地。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否让读者核对历史决策的新鲜度与项目归属？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

README:75-81 已声称对决定可标 accepted/rejected，并在能够判断时提示相关文件变化；scoped.go 已支持条件性项目范围，因此仅添加时间、项目或“文件已变”提示不构成增量。未验证设想是对当前任务所引用的多个历史决策，建立可核对的冲突视图：聚合同一来源引用、接受/拒绝状态、可读的当前文件版本和来源缺失状态，展示互相矛盾的证据，由用户明确采用其中一个或保留 unknown；不自动把历史写成当前事实。依赖稳定来源和文件版本，尚未核尽所有界面及核心已有冲突视图。用固定历史对照现有召回与人工查原日志，构造相反决策、跨项目同名、文件已改、来源失踪和无冲突样本，测错误采纳、误拦截、核查时间与隐私泄露；若缺源被当成已验证、错误采纳不降、误拦或额外成本过高则否定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:75-81](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/README.md#L75-L81)

作者描述决定状态和文件变化提示。

```text
- **One memory, every agent.** A fix found in Codex comes back in Claude Code, Cursor or opencode; all [forty-three agents](#supported-harnesses) read the same index.
- **Nobody has to ask.** Recall arrives at session start, before a file is edited or a command runs, and after a command fails.
- **Survives compaction.** Over 43 measured compactions the summary kept 77% of the decisions and 0.2% of the commands; deja hands back the rest ([how](docs/compaction.md)).
- **Indexes the work, not just the talk.** The files each turn opened, the commands with their exit status, the exact spans an edit replaced.
- **Knows what held.** `deja promote <id> --state rejected` marks a reverted decision, and every later hit says it was tried and why it was dropped; `--state accepted` takes the mark back.
- **Says when the ground moved.** A hit reports *4 files this session touched have changed since*, and stays quiet when it cannot tell.
- **Local and private.** No model and no server; embeddings only if you turn on [semantic recall](#semantic-recall-optional). Keys and tokens are stripped as the index is built ([privacy](#privacy)).
```

**依据 2 · 源码核查**：[internal/index/scoped.go:8-33](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/internal/index/scoped.go#L8-L33)

已有项目范围筛选条件。

<details>
<summary>查看原文（26行）</summary>

```text
// ScopedFrom is the answer a search of the same query narrowed to scope
// would give, cut from whole, the wider search run with Options.PoolScope
// set to scope. ok is false when the narrower search would have read
// something whole did not, or answered from another tier: no session of the
// scope matched exactly, too few did and it would add a tail of the nearest
// wording, or whole read only part of the scope's matches.
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

**依据 3 · 源码核查**：[cmd/deja/recall_cli.go:93-109](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/cmd/deja/recall_cli.go#L93-L109)

现有召回与使用记录。

<details>
<summary>查看原文（17行）</summary>

```text
	q := strings.TrimSpace(strings.Join(terms, " "))
	if q == "" {
		return errors.New("recall: what to recall? deja recall <words>")
	}
	if err := checkHarness(&harness); err != nil {
		return err
	}
	if line := buildingNowForAgent(dir); line != "" {
		_, err := fmt.Fprintln(stdout, frameRecall(line))
		return err
	}
	text, sessions, raw, ids, projects, err := recallTextResultIn(dir, q, harness, project, limit, offset, recallMCPBudget-recallFrameOverhead)
	if err != nil {
		return err
	}
	text = frameRecall(text)
	usage.RecordServedFromInto(dir, usage.KindRecall, text, "", sessions, raw, ids, projects, policy.Load().Describe(policy.ActivationMCP))
```

</details>

**依据 4 · 作者声明**：[README.md:185-190](https://github.com/vshulcz/deja-vu/blob/232ff95b01962f17d933a1ebc0a4bc2a5a8c0518/README.md#L185-L190)

原始历史和敏感数据边界。

```text
Credentials are stripped as the index is built: cloud and provider keys, tokens and JWTs,
PEM blocks, passwords in URLs or stated in prose. Each becomes `[redacted:<kind>]` and the
text around it stays searchable. The source transcripts still hold them
([one machine had 84 in 42 sessions](https://vshulcz.github.io/deja-vu/guide/credentials-in-transcripts.html)):
`deja secrets` names those sessions without printing a value, and `deja secrets --scrub`
rewrites the ones it can, keeping the original beside the file.
```

#### 缺口

- 未穷尽现有界面是否已有等价冲突视图，也无标注任务
  **影响**：无法证明新增价值或准确性
  **进一步探讨**：先核现有界面，再用带真值的冲突历史做盲评。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
