# Mnemon

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[fb3f186](https://github.com/mnemon-dev/mnemon/tree/fb3f186be865a0797ab390839cb7af6b02064708)

<!-- BEGIN META -->
[![GitHub ★ 661](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=661&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/mnemon-dev/mnemon)
<!-- END META -->

> **功能**：为 Agent 提供由宿主模型监督的本地持久记忆、图关联、意图检索与生命周期管理 CLI。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 把语义监督与确定性存储分开，精确重复跳过但语义候选仅提示，避免相似度直接吞掉不同事实。

> **主要限制**：[Q03](#research-q03) 根DSH转接依赖latest外部插件，固定提交不能锁住完整运行链；监督、冲突与裁剪仍需有效判断和备份。

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
  - [Q01 · 谁判断记忆，和文件记忆基线有什么差别？](#detail-section-11)
  - [Q02 · remember与recall真正写入和检索什么？](#detail-section-12)
  - [Q03 · DSH重定向、模型与自动裁剪带来哪些边界？](#detail-section-13)
  - [Q04 · 哪些用户可试，怎样检验分工有价值？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Agent用户跨会话保存项目事实与决策，需可检索和可纠错的长期记忆。

手工Markdown项目笔记及带内嵌LLM的记忆服务；本工具不额外设模型不等于不花宿主token。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| remember | 事务保存事实与图边 | 语义正确由宿主判断 |
| recall | 按意图与可选向量检索 | 会更新访问状态 |
| 显式纠错 | 确认新事实后遗忘旧项 | 容量裁剪需备份与核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 匹配平台Mnemon二进制 | 必需 | 确定性CLI | 无法调用 |
| 宿主模型与可写本地库 | 记忆任务必需 | 语义判断与存储 | 无法保证正确写入 |
| dsh-mnemon外部插件 | DSH必需 | 宿主空间与工具接入 | 本轮未固定完整实现 |
| embedding | 可选 | 向量信号 | 失败可无向量继续 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户复制记忆库并确认CLI | 副本可用且可恢复 |
| 判断 | 宿主选择事实和关联 | 有原始依据，不机械采纳相似度 |
| 记忆 | CLI事务写入并返回候选 | 检查added/skipped与裁剪 |
| 纠错 | 先确认新事实再forget旧项 | 召回核验，不佳回笔记 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 二进制和本地库 | 安装、备份、宿主配置 | 耗时未知 |
| 持续使用 | 宿主判断token、可选embedding | 复核冲突与关联 | 总费用未知 |
| 失败恢复 | 副本与重试资源 | 检查裁剪和错误记忆 | 完整DSH版本需另固定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 记忆确定性 | 精确去重和事务存储 | 事实和因果正确性 |
| 意图召回 | 可选向量与词法回退 | 相对手工笔记任务收益 |

> **思考**：[Q03](#research-q03) 根DSH转接依赖latest外部插件，固定提交不能锁住完整运行链；监督、冲突与裁剪仍需有效判断和备份。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 把语义监督与确定性存储分开，精确重复跳过但语义候选仅提示，避免相似度直接吞掉不同事实。

[Q02](#research-q02) 相似建议不直接覆盖、写入事务与明确意图覆盖值得复用；迁移需保留语义监督、备份和检索副作用边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 根DSH转接依赖latest外部插件，固定提交不能锁住完整运行链；监督、冲突与裁剪仍需有效判断和备份。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 限定CLI副本库试用，不以本仓库提交当完整DSH兼容证明；错误关联或裁剪损失便回笔记。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

CLI写入事务与召回有固定源码支持；完整DSH转接依赖未固定，任务效果与总token未知。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cmd/memory/remember.go、cmd/memory/recall.go、internal/memory/search/recall.go、internal/memory/setup/assets/claude/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：Memory CLI的remember/recall与监督Skill；Agency预览和外部DSH插件未核，不计入能力。
- 下一步：冲突决策集对比Markdown，检查召回、纠错、因果候选和裁剪，固定DSH外部版本后另验；未执行。

**分析版本**

- **仓库**：[mnemon-dev/mnemon](https://github.com/mnemon-dev/mnemon)
- **版本号**：0.1.0（[固定提交 fb3f186](https://github.com/mnemon-dev/mnemon/tree/fb3f186be865a0797ab390839cb7af6b02064708)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出为语义变更决定保存来源回执，未来方向未验证；若无法降低错误记忆和纠错投入则否定。

冲突决策集对比Markdown，检查召回、纠错、因果候选和裁剪，固定DSH外部版本后另验；未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 78 | 10357 | — | — | 76696 |
| .ts | source | 8 | 873 | 802 | 11 | — |
| .js | source | 8 | 616 | 527 | 31 | — |
| .mjs | test | 18 | 2272 | 2094 | 18 | — |
| .mjs | source | 3 | 406 | 372 | 2 | — |
| .md | test | 4 | 409 | — | — | 3082 |
| .ts | test | 2 | 173 | 156 | 5 | — |
| .md | example | 1 | 26 | — | — | 115 |
| .tsx | test | 6 | 1083 | 1050 | 3 | — |
| .tsx | source | 8 | 2413 | 2387 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/mnemon-dev/mnemon/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=8&color=737b86&logo=github)](https://github.com/mnemon-dev/mnemon/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/mnemon-dev/mnemon/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：监督判断与确定性记忆CLI分工能否保留纠错且控制全部成本？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁判断记忆，和文件记忆基线有什么差别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Mnemon 面向跨会话需要保留决策和事实的Agent用户，把记忆选择、关联和遗忘交宿主模型判断，CLI负责确定性存储与检索。相对固定文件注入，它支持按查询取回和图关系；相对嵌入独立LLM的记忆服务，它不必再设一个专用推理模型，但宿主判断仍花token，不能把无独立API key写成无推理成本。Agency是独立Pi预览能力，本轮不将责任准入计入已核实Memory贡献。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-46](https://github.com/mnemon-dev/mnemon/blob/fb3f186be865a0797ab390839cb7af6b02064708/README.md#L24-L46)

作者定义监督分工与参照。

<details>
<summary>查看原文（23行）</summary>

```text
LLM agents forget everything between sessions. Context compaction drops critical decisions, cross-session knowledge vanishes, and long conversations push early information out of the window.

Mnemon gives your agent persistent, cross-session memory — a four-graph knowledge store with intent-aware recall, importance decay, and automatic deduplication. The `mnemon` memory path remains one local binary with zero API keys and one setup command.

Mnemon ships one executable with two separate surfaces. Memory stays at the
`mnemon` root; [Agency Preview](docs/AGENCY.md) lives at `mnemon agency ...` and adds
durable, project-local responsibility and effect admission to an existing Pi
agent. Agency does not replace Memory or the Agent Runtime.

> **Claude Max / Pro subscriber?** Mnemon works entirely through your existing subscription — no separate API key required. Your LLM subscription *is* the intelligence layer. Two commands and you're done.

### Why Mnemon?

Most memory tools embed their own LLM inside the pipeline. Mnemon takes a different approach: **your host LLM is the supervisor.** The binary handles deterministic computation (storage, graph indexing, search, decay); the LLM makes judgment calls (what to remember, how to link, when to forget). No middleman, no extra inference cost.

| Pattern | LLM Role | Representative |
|---|---|---|
| **LLM-Embedded** | Executor inside the pipeline | Mem0, Letta |
| **File Injection** | None — reads file at session start | Claude Code Memory |
| **MCP Server** | Tool provider via MCP protocol | claude-mem |
| **LLM-Supervised** | External supervisor of a standalone binary | **Mnemon** |

Mnemon also addresses a gap in the protocol stack. MCP standardizes how LLMs discover and invoke tools. ODBC/JDBC standardizes how applications access databases. But how LLMs interact with databases using memory semantics — this layer has no protocol. Mnemon's three primitives — `remember`, `link`, `recall` — form an intent-native protocol: command names map to the LLM's cognitive vocabulary (`remember` not INSERT, `recall` not SELECT), and output is structured JSON with signal transparency rather than raw database rows.
```

</details>

**依据 2 · 作者声明**：[README.md:28-31](https://github.com/mnemon-dev/mnemon/blob/fb3f186be865a0797ab390839cb7af6b02064708/README.md#L28-L31)

Memory和Agency分开。

```text
Mnemon ships one executable with two separate surfaces. Memory stays at the
`mnemon` root; [Agency Preview](docs/AGENCY.md) lives at `mnemon agency ...` and adds
durable, project-local responsibility and effect admission to an existing Pi
agent. Agency does not replace Memory or the Agent Runtime.
```

**依据 3 · 源码核查**：[internal/memory/setup/assets/claude/SKILL.md:10-18](https://github.com/mnemon-dev/mnemon/blob/fb3f186be865a0797ab390839cb7af6b02064708/internal/memory/setup/assets/claude/SKILL.md#L10-L18)

记忆和关联要求宿主判断。

```text
1. **Remember**: `mnemon remember "<fact>" --cat <cat> --imp <1-5> --entities "e1,e2" --source agent`
   - Only exact content repeats are skipped; distinct content is stored and diff suggestions are advisory.
   - To retire a superseded memory, store and verify the new fact, then explicitly run `mnemon forget <old-id>`.
   - Output includes `action` (added/skipped), `semantic_candidates`, `causal_candidates`.
2. **Link** (evaluate candidates from step 1 — use judgment, not mechanical rules):
   - Review `causal_candidates`: does a genuine cause-effect relationship exist? `causal_signal` is regex-based and prone to false positives — only link if the memories are truly causally related.
   - Review `semantic_candidates`: are these memories meaningfully related? High `similarity` alone is not sufficient — skip candidates that share keywords but discuss unrelated topics.
   - Syntax: `mnemon link <id> <candidate> --type <causal|semantic> --weight <0-1> [--meta '<json>']`
3. **Recall**: `mnemon recall "<query>" --limit 10`
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · remember与recall真正写入和检索什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

remember读取相似候选只作建议，只有完全相同内容才跳过写入；新记忆、embedding、图边、重要性更新和容量裁剪安排在事务内。相似度不替代“同一事实”的语义判断，是可复用的边界。recall可尝试embedding，失败警告后无向量继续，加载活跃条目后交IntentAwareRecallFrom；结果会增加访问计数并记录查询，因此召回不是无状态读取。Skill说明自动意图只是词法启发式，可用--intent显式覆盖，旧事实退役要先确认新事实再forget；图与排序不证明关联或因果真实。

#### 证据与依据

**依据 1 · 源码核查**：[cmd/memory/remember.go:155-192](https://github.com/mnemon-dev/mnemon/blob/fb3f186be865a0797ab390839cb7af6b02064708/cmd/memory/remember.go#L155-L192)

完全重复跳过与事务开始。

<details>
<summary>查看原文（38行）</summary>

```text

			result := search.Diff(allInsights, content, opts)
			diffSuggestion = result.Suggestion

			// Similarity cannot establish whether two facts have the same
			// subject, value, or relationship. Keep diff suggestions advisory;
			// only byte-identical content permits skipping a write.
			duplicateID = search.FindExactDuplicateID(allInsights, content)
			if duplicateID != "" {
				diffAction = "skipped"
				diffSuggestion = search.DiffDuplicate
			}
		}

		// If duplicate, skip insert entirely
		if diffAction == "skipped" {
			db.LogOp("diff-skip", insight.ID, fmt.Sprintf("duplicate of %s", duplicateID))
			output := map[string]interface{}{
				"id":              insight.ID,
				"content":         content,
				"action":          "skipped",
				"diff_suggestion": string(diffSuggestion),
				"replaced_id":     duplicateID,
			}
			enc := json.NewEncoder(os.Stdout)
			enc.SetIndent("", "  ")
			return enc.Encode(output)
		}

		// 3. All DB writes in a single atomic transaction
		var (
			edgeStats graph.EdgeStats
			ei        float64
			prunedIDs []string
			embedded  bool
		)
		err = db.InTransaction(func() error {
			if err := db.InsertInsight(insight); err != nil {
```

</details>

**依据 2 · 源码核查**：[cmd/memory/remember.go:196-233](https://github.com/mnemon-dev/mnemon/blob/fb3f186be865a0797ab390839cb7af6b02064708/cmd/memory/remember.go#L196-L233)

向量、边、重要性和裁剪处于写事务。

<details>
<summary>查看原文（38行）</summary>

```text
			if embeddingBlob != nil {
				if err := db.UpdateEmbedding(insight.ID, embeddingBlob); err != nil {
					return fmt.Errorf("update embedding: %w", err)
				}
				embedded = true
				// Add the new insight's embedding to the cache so the engine sees it.
				if embedCache != nil {
					embedCache[insight.ID] = embeddingVec
				}
			}

			// Run graph edge engine (includes auto semantic edges when embedded)
			engine := graph.NewEngineWithEntityMode(db, embedCache, entityMode)
			edgeStats = engine.OnInsightCreated(insight)

			// Update entities extracted by the engine
			if len(insight.Entities) > 0 {
				if err := db.UpdateEntities(insight.ID, insight.Entities); err != nil {
					fmt.Fprintf(os.Stderr, "warning: update entities: %v\n", err)
				}
			}

			// Compute and store effective_importance (after edges are created)
			var eiErr error
			ei, eiErr = db.RefreshEffectiveImportance(insight.ID)
			if eiErr != nil {
				fmt.Fprintf(os.Stderr, "warning: refresh EI: %v\n", eiErr)
			}

			// Auto-prune if over capacity (excludeID protects the just-created insight)
			var pruneErr error
			prunedIDs, pruneErr = db.AutoPruneWithResult(store.MaxInsightsLimit(), []string{insight.ID}, insight.ID)
			if pruneErr != nil {
				return fmt.Errorf("auto-prune: %w", pruneErr)
			}

			db.LogOp("remember", insight.ID, insight.Content)
			return nil
```

</details>

**依据 3 · 源码核查**：[cmd/memory/recall.go:183-211](https://github.com/mnemon-dev/mnemon/blob/fb3f186be865a0797ab390839cb7af6b02064708/cmd/memory/recall.go#L183-L211)

可选embedding、检索调用及访问副作用。

<details>
<summary>查看原文（29行）</summary>

```text
		// Try to get query embedding for hybrid search
		var queryVec []float64
		ec := embed.NewClientWithModel(resolveEmbedModel())
		if ec.Available() {
			queryVec, err = ec.Embed(keyword)
			if err != nil {
				fmt.Fprintf(cmd.ErrOrStderr(), "warning: query embedding failed for model %q; continuing without vector similarity (check --embed-model or MNEMON_EMBED_MODEL and run 'mnemon embed --status')\n", ec.Model())
			}
		}

		// Extract query entities at cmd layer (avoid graph->search circular dep).
		// Load the known-entity set so the indexed extractor's fourth path can
		// admit user vocabulary (single-segment CamelCase, lowercase project
		// names) that techDictionary does not cover. The set is derived from the
		// same insight snapshot recall ranks, so the table is scanned once.
		all, err := db.GetAllActiveInsights()
		if err != nil {
			return fmt.Errorf("recall: %w", err)
		}
		queryEntities := graph.ExtractEntitiesIndexed(keyword, store.KnownEntities(all))

		resp, err := search.IntentAwareRecallFrom(db, all, keyword, queryVec, queryEntities, recLimit, intentOverride)
		if err != nil {
			return fmt.Errorf("recall: %w", err)
		}
		for _, r := range resp.Results {
			_ = db.IncrementAccessCount(r.Insight.ID)
		}
		db.LogOp("recall", "", fmt.Sprintf("q=%s hits=%d", keyword, len(resp.Results)))
```

</details>

**依据 4 · 源码核查**：[internal/memory/setup/assets/claude/SKILL.md:10-35](https://github.com/mnemon-dev/mnemon/blob/fb3f186be865a0797ab390839cb7af6b02064708/internal/memory/setup/assets/claude/SKILL.md#L10-L35)

因果候选与意图均需判断。

<details>
<summary>查看原文（26行）</summary>

```text
1. **Remember**: `mnemon remember "<fact>" --cat <cat> --imp <1-5> --entities "e1,e2" --source agent`
   - Only exact content repeats are skipped; distinct content is stored and diff suggestions are advisory.
   - To retire a superseded memory, store and verify the new fact, then explicitly run `mnemon forget <old-id>`.
   - Output includes `action` (added/skipped), `semantic_candidates`, `causal_candidates`.
2. **Link** (evaluate candidates from step 1 — use judgment, not mechanical rules):
   - Review `causal_candidates`: does a genuine cause-effect relationship exist? `causal_signal` is regex-based and prone to false positives — only link if the memories are truly causally related.
   - Review `semantic_candidates`: are these memories meaningfully related? High `similarity` alone is not sufficient — skip candidates that share keywords but discuss unrelated topics.
   - Syntax: `mnemon link <id> <candidate> --type <causal|semantic> --weight <0-1> [--meta '<json>']`
3. **Recall**: `mnemon recall "<query>" --limit 10`

## Recall Intent

Keep focused queries and memories in their original language. When the user's
meaning is clear, choose `--intent WHY` (reasons), `--intent WHEN` (timing),
`--intent ENTITY` (what/who), or `--intent GENERAL` (neutral retrieval).
For example: `mnemon recall "<query>" --intent WHY`. The override works in any
language; `--verbose` reports
`meta.intent` and `meta.intent_source` (`auto` or `override`).

Automatic cues cover some forms in English, Mandarin Chinese (simplified and
traditional), Hindi (Devanagari), Spanish, Modern Standard Arabic, French,
Bengali (Bengali script), Portuguese, Indonesian (Latin script), Russian
(Cyrillic), and German. Unrecognized forms use GENERAL; conflicting cues involving
additional languages also use GENERAL. English/Chinese-only scoring is preserved.
This is a lexical heuristic, not full language understanding. See
[the supported forms, script variants, and limits](https://github.com/mnemon-dev/mnemon/blob/master/docs/USAGE.md#recall-intent-detection).
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · DSH重定向、模型与自动裁剪带来哪些边界？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

根仓库主要是本地Go工具并提供DSH安装转接：package依赖dsh-mnemon:latest，所以固定本仓库提交不会固定完整DSH运行实现。README要求外部插件管理活动记忆空间，不能据本轮CLI源码宣称DSH三层记忆或子Agent写入已验证。CLI安装可用对应平台二进制，npm启动器需Node；记忆监督用现有模型但token照常计入，embedding与本地存储另计。容量裁剪会淘汰条目，自动去重只跳完全相同内容，冲突新事实仍需用户/模型处理。首次用副本库，定期导出和核查忘记结果；没有账单及合格记忆任务对照，不能声称节省比例。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-19](https://github.com/mnemon-dev/mnemon/blob/fb3f186be865a0797ab390839cb7af6b02064708/package.json#L1-L19)

DSH bundle依赖latest外部插件。

<details>
<summary>查看原文（19行）</summary>

```text
{
  "name": "@mnemon-dev/dsh-mnemon",
  "version": "0.1.0",
  "description": "Install the full dsh-mnemon integration from the Mnemon repository.",
  "files": [
    "cordis.patch.yml",
    "README.md",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "dependencies": {
    "dsh-mnemon": "latest"
  },
  "engines": {
    "node": ">=20"
```

</details>

**依据 2 · 作者声明**：[README.md:304-330](https://github.com/mnemon-dev/mnemon/blob/fb3f186be865a0797ab390839cb7af6b02064708/README.md#L304-L330)

外部DSH插件与空间归属。

<details>
<summary>查看原文（27行）</summary>

````text
### [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)

DeepSeek Harness (DSH) integrates through the [dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon) plugin, which layers DSH's runtime memory, managed project documents, and Mnemon's long-term memory spaces into one supervised three-tier memory system.

With `mnemon` installed on the host (see [Install](#install)), add the plugin and restart your DSH Web profile:

```bash
dsh plugin --profile web add dsh-mnemon
dsh --profile web
```

The Mnemon repository is also a direct GitHub installation source. Unreleased
plugin builds can still be installed from the dedicated repository, and local
development checkouts use an absolute path:

```bash
dsh plugin --profile web add github:mnemon-dev/mnemon
dsh plugin --profile web add "github:omdsh-dev/dsh-mnemon"
dsh plugin --profile web add "link:/absolute/path/to/dsh-mnemon"
```

New installations from the Mnemon repository resolve the `latest` npm release
of `dsh-mnemon`, so publishing a new plugin release does not require a matching
change in this repository. Existing installations remain on their resolved
version until the plugin is reinstalled or updated.

Then open DSH's Settings → Plugin Config → Mnemon to pick a storage scope, and use the Memory System tab in a session to create or activate memory spaces. Recall reads only from active memory spaces; durable writes go through supervised sub-agents.
````

</details>

**依据 3 · 源码核查**：[cmd/memory/remember.go:225-233](https://github.com/mnemon-dev/mnemon/blob/fb3f186be865a0797ab390839cb7af6b02064708/cmd/memory/remember.go#L225-L233)

容量裁剪会改变存储状态。

```text
			// Auto-prune if over capacity (excludeID protects the just-created insight)
			var pruneErr error
			prunedIDs, pruneErr = db.AutoPruneWithResult(store.MaxInsightsLimit(), []string{insight.ID}, insight.ID)
			if pruneErr != nil {
				return fmt.Errorf("auto-prune: %w", pruneErr)
			}

			db.LogOp("remember", insight.ID, insight.Content)
			return nil
```

**依据 4 · 源码核查**：[internal/memory/setup/assets/claude/SKILL.md:10-16](https://github.com/mnemon-dev/mnemon/blob/fb3f186be865a0797ab390839cb7af6b02064708/internal/memory/setup/assets/claude/SKILL.md#L10-L16)

去重和旧事实退役的判断边界。

```text
1. **Remember**: `mnemon remember "<fact>" --cat <cat> --imp <1-5> --entities "e1,e2" --source agent`
   - Only exact content repeats are skipped; distinct content is stored and diff suggestions are advisory.
   - To retire a superseded memory, store and verify the new fact, then explicitly run `mnemon forget <old-id>`.
   - Output includes `action` (added/skipped), `semantic_candidates`, `causal_candidates`.
2. **Link** (evaluate candidates from step 1 — use judgment, not mechanical rules):
   - Review `causal_candidates`: does a genuine cause-effect relationship exist? `causal_signal` is regex-based and prone to false positives — only link if the memories are truly causally related.
   - Review `semantic_candidates`: are these memories meaningfully related? High `similarity` alone is not sufficient — skip candidates that share keywords but discuss unrelated topics.
```

#### 缺口

- 外部dsh-mnemon实际解析版本和运行链未固定
  **影响**：不能给本提交完整DSH兼容结论
  **进一步探讨**：另固定实际安装依赖版本并追空间路由与写入授权
- 全部监督与检索费用未知
  **影响**：无独立推理服务不代表总token少
  **进一步探讨**：计算含宿主判断、重复召回与纠错的合格记忆成本

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些用户可试，怎样检验分工有价值？

**研究主题**：新假设与验证、采用判断

#### 完整回答

能管理本地CLI和备份的Agent用户可先在非敏感副本库试用remember/recall，不直接迁移唯一项目决策；需要即装即用DSH能力者应先固定外部插件。待验证方向是把记忆变更的语义决定及其原始依据保存成可核查回执，让确定性事务只执行已审定变更；本工具已有确定性事务，却不能保证宿主判断正确。用同一组决策与相互冲突更新，对比手工Markdown和CLI记忆，检查新旧事实纠正、错误因果边、召回有效性、裁剪损失、全token和人工时间。若检索噪声或纠错负担增加，停止自动记忆并回手工项目笔记。

#### 证据与依据

**依据 1 · 源码核查**：[cmd/memory/remember.go:184-233](https://github.com/mnemon-dev/mnemon/blob/fb3f186be865a0797ab390839cb7af6b02064708/cmd/memory/remember.go#L184-L233)

确定性事务是语义决定回执的起点。

<details>
<summary>查看原文（50行）</summary>

```text
		// 3. All DB writes in a single atomic transaction
		var (
			edgeStats graph.EdgeStats
			ei        float64
			prunedIDs []string
			embedded  bool
		)
		err = db.InTransaction(func() error {
			if err := db.InsertInsight(insight); err != nil {
				return fmt.Errorf("insert insight: %w", err)
			}

			if embeddingBlob != nil {
				if err := db.UpdateEmbedding(insight.ID, embeddingBlob); err != nil {
					return fmt.Errorf("update embedding: %w", err)
				}
				embedded = true
				// Add the new insight's embedding to the cache so the engine sees it.
				if embedCache != nil {
					embedCache[insight.ID] = embeddingVec
				}
			}

			// Run graph edge engine (includes auto semantic edges when embedded)
			engine := graph.NewEngineWithEntityMode(db, embedCache, entityMode)
			edgeStats = engine.OnInsightCreated(insight)

			// Update entities extracted by the engine
			if len(insight.Entities) > 0 {
				if err := db.UpdateEntities(insight.ID, insight.Entities); err != nil {
					fmt.Fprintf(os.Stderr, "warning: update entities: %v\n", err)
				}
			}

			// Compute and store effective_importance (after edges are created)
			var eiErr error
			ei, eiErr = db.RefreshEffectiveImportance(insight.ID)
			if eiErr != nil {
				fmt.Fprintf(os.Stderr, "warning: refresh EI: %v\n", eiErr)
			}

			// Auto-prune if over capacity (excludeID protects the just-created insight)
			var pruneErr error
			prunedIDs, pruneErr = db.AutoPruneWithResult(store.MaxInsightsLimit(), []string{insight.ID}, insight.ID)
			if pruneErr != nil {
				return fmt.Errorf("auto-prune: %w", pruneErr)
			}

			db.LogOp("remember", insight.ID, insight.Content)
			return nil
```

</details>

**依据 2 · 源码核查**：[internal/memory/setup/assets/claude/SKILL.md:10-17](https://github.com/mnemon-dev/mnemon/blob/fb3f186be865a0797ab390839cb7af6b02064708/internal/memory/setup/assets/claude/SKILL.md#L10-L17)

当前监督判断和退役流程。

```text
1. **Remember**: `mnemon remember "<fact>" --cat <cat> --imp <1-5> --entities "e1,e2" --source agent`
   - Only exact content repeats are skipped; distinct content is stored and diff suggestions are advisory.
   - To retire a superseded memory, store and verify the new fact, then explicitly run `mnemon forget <old-id>`.
   - Output includes `action` (added/skipped), `semantic_candidates`, `causal_candidates`.
2. **Link** (evaluate candidates from step 1 — use judgment, not mechanical rules):
   - Review `causal_candidates`: does a genuine cause-effect relationship exist? `causal_signal` is regex-based and prone to false positives — only link if the memories are truly causally related.
   - Review `semantic_candidates`: are these memories meaningfully related? High `similarity` alone is not sufficient — skip candidates that share keywords but discuss unrelated topics.
   - Syntax: `mnemon link <id> <candidate> --type <causal|semantic> --weight <0-1> [--meta '<json>']`
```

#### 缺口

- 决定回执能否降低错误记忆未知
  **影响**：未来方向不算既有贡献
  **进一步探讨**：用冲突事实及错误因果候选测可追溯纠错

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
