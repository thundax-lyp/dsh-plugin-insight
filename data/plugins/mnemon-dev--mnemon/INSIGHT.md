# Mnemon

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[bbc9151](https://github.com/mnemon-dev/mnemon/tree/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec)

<!-- BEGIN META -->
[![GitHub ★ 680](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=680&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/mnemon-dev/mnemon)
<!-- END META -->

> **功能**：为 Agent 提供由宿主模型监督的本地持久记忆、图关联、意图检索与生命周期管理 CLI。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将模型的关系判断与本地确定性存储分开，相似候选只作提示，字节相同才跳过写入。图检索有明确既有方法参照，贡献是 CLI、监督流程与事务边界的组合，不宣称算法首创。

> **主要限制**：[Q03](#research-q03) 持久保存不保证事实正确，关系仍需模型复核；容量策略虽有保护期、关闭选项和裁剪回执，完整关系恢复尚未核实。根 DSH bundle 另依赖外部 latest 包，不能把本提交当完整 DSH 验证。

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
  - [Q01 · 谁需要这个记忆层，它相对普通笔记增加什么？](#detail-section-11)
  - [Q02 · 写入、去重、召回和访问副作用如何实际接线？](#detail-section-12)
  - [Q03 · 语义正确性与裁剪是否会使持久记忆承诺失效？](#detail-section-13)
  - [Q04 · 如何接入、持续操作和退出，成本效果支持到哪一步？](#detail-section-14)
  - [Q05 · 从确定性检索与模型监督的分工能提出什么可证伪改进？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Agent 使用者可跨会话保存项目事实、偏好与决策，并用图关系和意图召回找回相关上下文。

[Q01](#research-q01) 以普通笔记配合关键词检索为简单参照。图关系与显式意图增加了检索组织方式，也引入语义监督和生命周期管理，不能据此推断端到端节时。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| remember | 持久保存事实与重要性 | 精确重复跳过；可触发容量裁剪，语义不自动保证 |
| link监督流程 | 由模型核查关系候选 | 相似或正则信号不能代替真实关系判断；本次未穷尽link实现 |
| recall | 按问题和意图找回相关记忆 | 可选向量失败会降级；通常更新访问次数，分数非事实概率 |
| 只读库打开 | 在SQLite只读模式浏览固定库 | 写入命令被拒；本次未执行只读回放 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 对应平台的原生二进制 | Memory 必需 | 执行存储与检索 | CLI 无法工作 |
| Node.js 22+ | npm 安装路径必需，作者声明 | 启动器与包管理 | 应另选受支持安装途径；本次未安装 |
| 可写本地库与明确 --store | 写入必需 | 保存项目事实 | 可写入口报错；误选库可能混入数据 |
| 宿主模型或人工监督 | 语义质量必需 | 核查事实、关联和纠错 | 确定性存储不能补足语义判断 |
| 向量服务 | 混合检索可选 | 语义相似度 | 向量失败可继续词法和图路径，质量变化未知 |
| dsh-mnemon 外部包 | DSH bundle 必需，非 CLI 前提 | 提供实际 DSH 实现 | 根提交无法单独确认完整兼容，需另固定版本 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 使用者固定CLI版本与副本库，保留原始笔记 | 确认实际版本及选中库；本轮未执行 |
| 保存 | 宿主选择事实并调用 remember | 读 action、ID和裁剪回执；异常先回读，不盲目重试 |
| 关系 | 模型逐条核查语义/因果候选 | 无真实关系不建立链接 |
| 检索 | 宿主用明确问题和意图调用 recall | 校对更正标记和原文，不能把confidence当事实概率 |
| 验收与退出 | 使用者对照原始事实并观察裁剪 | 错误关联或无法恢复则停止写入，回到备份和笔记 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 二进制、本地库和备份空间 | 版本固定、库选择、宿主配置 | 金额与耗时未知 |
| 持续使用 | 宿主模型token、可选向量、存储 | 检查事实和候选关系，处理更正 | 未测合格任务成本 |
| 失败恢复 | 副本及回读重试资源 | 核对已提交状态和裁剪回执 | 完整关系恢复未核，须独立备份 |
| 退出与迁移 | 保存原始材料及备份 | 停止该库写入、回到笔记 | 跨版本迁移工时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 持久写入 | 事务保存、精确重复跳过 | 语义真伪和并发全场景 |
| 找回上下文 | 多信号检索、意图覆盖、更正提示 | 相对笔记的任务正确率与节时 |
| 容量管理 | 保护条件、软删除、触发审计和裁剪ID | 长期关键事实损失与完整关系恢复 |

> **思考**：[Q03](#research-q03) 持久保存不保证事实正确，关系仍需模型复核；容量策略虽有保护期、关闭选项和裁剪回执，完整关系恢复尚未核实。根 DSH bundle 另依赖外部 latest 包，不能把本提交当完整 DSH 验证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将模型的关系判断与本地确定性存储分开，相似候选只作提示，字节相同才跳过写入。图检索有明确既有方法参照，贡献是 CLI、监督流程与事务边界的组合，不宣称算法首创。

[Q02](#research-q02) 事务把内容和容量副作用集中，语义候选保持建议性质，紧凑输出保留更正提示，适合借鉴。普通召回会改变访问计数，部分辅助错误仅告警或忽略；迁移不能假定纯读取、全步骤原子成功或自动语义纠错。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 持久保存不保证事实正确，关系仍需模型复核；容量策略虽有保护期、关闭选项和裁剪回执，完整关系恢复尚未核实。根 DSH bundle 另依赖外部 latest 包，不能把本提交当完整 DSH 验证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在非敏感副本库试用 Memory CLI，明确指定库并保留笔记备份。用已更正事实和低频关键事实检查后续回答，错误关联或无法还原时停止写入；完整 DSH 适配须另固定外部包。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持 Memory CLI 的持久化、检索和监督分工；语义正确性、长期任务收益、完整恢复与外部 DSH 适配仍有边界。回放评估是未来研究假设，未计入已有贡献。

- 已检查：作者 README、包清单、源码路径 README.md、cmd/memory/recall.go、cmd/memory/remember.go、cmd/memory/root.go、cordis.patch.yml、internal/memory/search/recall.go、internal/memory/setup/assets/claude/SKILL.md、internal/memory/store/db.go、internal/memory/store/node.go、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定提交 Memory CLI 的代表链路、Claude监督Skill与根bundle；未穷尽其他宿主、Agency Preview、图算法全部分支或外部 dsh-mnemon 实现。Go文件从固定Git blob读取，现有统计仅覆盖规定的Markdown与JS/TS扩展，不是Go代码量。
- 下一步：按[Q05](#research-q05)用固定副本对照普通召回与只读回放，再与笔记比较正确率、保留变化和全部监督/恢复成本；若不改变决策或维护成本抵消收益则否定方法假设。本轮未执行该实验。

**分析版本**

- **仓库**：[mnemon-dev/mnemon](https://github.com/mnemon-dev/mnemon)
- **版本号**：0.1.0（[固定提交 bbc9151](https://github.com/mnemon-dev/mnemon/tree/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出固定副本的只读回放评估假设，区分检索质量与访问计数对保留策略的反馈。现有只读和裁剪回执已存在，增量是组合为评估协议，尚未验证能否减少采用误判。

按[Q05](#research-q05)用固定副本对照普通召回与只读回放，再与笔记比较正确率、保留变化和全部监督/恢复成本；若不改变决策或维护成本抵消收益则否定方法假设。本轮未执行该实验。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 87 | 14333 | — | — | 119720 |
| .ts | source | 8 | 873 | 802 | 11 | — |
| .js | source | 8 | 616 | 527 | 31 | — |
| .mjs | test | 18 | 2283 | 2105 | 18 | — |
| .mjs | source | 3 | 418 | 383 | 2 | — |
| .md | test | 4 | 409 | — | — | 3082 |
| .ts | test | 2 | 173 | 156 | 5 | — |
| .md | example | 1 | 26 | — | — | 115 |
| .tsx | test | 6 | 1083 | 1050 | 3 | — |
| .tsx | source | 8 | 2413 | 2387 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/mnemon-dev/mnemon/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/mnemon-dev/mnemon/issues?q=is%3Aissue+created%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z) [![近30天关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/mnemon-dev/mnemon/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：本地记忆 CLI 如何结合语义监督与确定性存储，何种范围值得采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要这个记忆层，它相对普通笔记增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Mnemon 的 Memory 面向反复跨会话处理项目事实、偏好和决策的 Agent 使用者。合格结果是后续任务找到仍适用的事实、辨认已更正内容，并能追溯和修正记忆；仅写入成功或召回更多条目不算任务成功。普通 Markdown 笔记配合关键词搜索是这里的简单参照，无需另查竞品即可说明它的取舍。

本实现增加结构化的 remember、link、recall 操作，把内容、实体、重要性和关系交给确定性存储与检索；宿主模型仍判断该记什么、关系是否真实以及何时忘记。相对笔记，这提供跨记录关系与明确检索意图入口，但不自动带来更可靠的事实。作者将它称为 LLM-supervised，并列举其他模式；这只是作者的分类，不足以证明本项目原创了图检索或全面优于其他方案。源码明确标注 MAGMA 参照与成熟的 RRF 排名方法，贡献应归于本地 CLI 和监督分工的组合。对偶尔记录少量事实的人，笔记可能更省维护；实际重复痛点的强度和节时尚无独立同条件数据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-46](https://github.com/mnemon-dev/mnemon/blob/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec/README.md#L24-L46)

作者说明跨会话场景和宿主监督分工，比较表是作者自述而非独立评测。

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

**依据 2 · 源码核查**：[internal/memory/setup/assets/claude/SKILL.md:8-18](https://github.com/mnemon-dev/mnemon/blob/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec/internal/memory/setup/assets/claude/SKILL.md#L8-L18)

Skill 将保存、关系判断和召回分成明确步骤，要求模型判断候选关系。

<details>
<summary>查看原文（11行）</summary>

```text
## Workflow

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

</details>

**依据 3 · 源码核查**：[internal/memory/search/recall.go:14-19](https://github.com/mnemon-dev/mnemon/blob/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec/internal/memory/search/recall.go#L14-L19)

检索参数注明 MAGMA 参照，不能将继承算法归为首次创新。

```text
// Beam search parameters (MAGMA-aligned).
const (
	anchorTopK = 20  // per-signal anchor limit (MAGMA: 15-30)
	lambda1    = 1.0 // structural weight (MAGMA paper: 1.0)
	lambda2    = 0.4 // semantic weight (MAGMA paper: 0.3-0.7)
)
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 写入、去重、召回和访问副作用如何实际接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

remember 在命令入口校验类别、重要性和长度，通过 openWritableDB 选择可写库。向量调用发生在事务前，失败时可不带向量继续。重复检查只对字节相同内容跳过写入，相似建议不会自动替换事实。随后一个事务保存内容、可用向量、图关系和容量裁剪；数据库包装器在返回错误或 panic 时回滚，并在正常路径提交。实体和有效重要性刷新中的部分失败只输出 warning，因此这里的事务不能解释为每个辅助计算都强制成功。提交之后生成语义和因果候选并编码输出，所以应把退出码与已经提交的状态分开理解，输出故障后需先查询状态再决定重试。

recall 默认加载活动记录，提取实体并调用 IntentAwareRecallFrom，融合词法、可选向量、时间与图信号。向量失败有警告并继续，--basic 提供简单 SQL LIKE 路径，--intent 允许覆盖词法意图。返回结果前会尝试增加访问次数并记录操作，增加计数错误被忽略；普通召回因此并非纯读取。紧凑输出保留 superseded 提示，并把排序分数分档为 confidence，但注释明确它不是校准概率。可借鉴的是把语义建议留给监督者、把关键写入集中到事务，以及显式保留被更正状态；移植时必须一起处理回读、重复请求、辅助 warning 和检索副作用，不能只复制命令名称。

#### 证据与依据

**依据 1 · 源码核查**：[cmd/memory/remember.go:103-118](https://github.com/mnemon-dev/mnemon/blob/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec/cmd/memory/remember.go#L103-L118)

可写库打开和事务前可选向量调用。

<details>
<summary>查看原文（16行）</summary>

```text
		db, err := openWritableDB("remember")
		if err != nil {
			return fmt.Errorf("open database: %w", err)
		}
		defer db.Close()

		// 1. Compute embedding BEFORE the transaction (HTTP call should not hold a DB lock)
		var embeddingBlob []byte
		var embeddingVec []float64
		ec := embed.NewClientWithModel(resolveEmbedModel())
		if ec.Available() {
			if vec, err := ec.Embed(content); err == nil {
				embeddingVec = vec
				embeddingBlob = embed.SerializeVector(vec)
			}
		}
```

</details>

**依据 2 · 源码核查**：[cmd/memory/remember.go:156-181](https://github.com/mnemon-dev/mnemon/blob/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec/cmd/memory/remember.go#L156-L181)

只有精确内容重复才跳过；相似建议仅作提示。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[cmd/memory/remember.go:191-240](https://github.com/mnemon-dev/mnemon/blob/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec/cmd/memory/remember.go#L191-L240)

事务内写入与裁剪，部分辅助失败仅 warning，失败时丢弃缓存。

<details>
<summary>查看原文（50行）</summary>

```text
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
		})
		if err != nil {
			// Cache was mutated inside the transaction closure (added entries).
			// On rollback those mutations don't match DB state, so discard the cache
			// to prevent any future code from accidentally using stale data.
			embedCache = nil
			return err
```

</details>

**依据 4 · 源码核查**：[internal/memory/store/db.go:77-100](https://github.com/mnemon-dev/mnemon/blob/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec/internal/memory/store/db.go#L77-L100)

实际事务包装器提供回滚和提交路径。

<details>
<summary>查看原文（24行）</summary>

```text
// InTransaction runs fn inside a single SQL transaction.
// All store methods called within fn will use the transaction automatically.
func (db *DB) InTransaction(fn func() error) error {
	if db.tx != nil {
		return fmt.Errorf("nested transactions not supported")
	}
	tx, err := db.conn.Begin()
	if err != nil {
		return fmt.Errorf("begin tx: %w", err)
	}
	db.tx = tx
	defer func() {
		// Also release the connection and prepared statements if fn panics.
		// After a successful Commit this is a harmless ErrTxDone.
		_ = tx.Rollback()
		db.tx = nil
		db.txInsertInsight = nil
		db.txInsertEdge = nil
	}()
	if err := fn(); err != nil {
		return err
	}
	return tx.Commit()
}
```

</details>

**依据 5 · 源码核查**：[cmd/memory/recall.go:183-215](https://github.com/mnemon-dev/mnemon/blob/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec/cmd/memory/recall.go#L183-L215)

召回加载活动记录、调用检索并增加访问计数。

<details>
<summary>查看原文（33行）</summary>

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

		if recVerbose {
			return enc.Encode(resp)
		}
```

</details>

**依据 6 · 源码核查**：[cmd/memory/recall.go:32-63](https://github.com/mnemon-dev/mnemon/blob/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec/cmd/memory/recall.go#L32-L63)

紧凑输出保留 superseded，confidence 不是校准概率。

<details>
<summary>查看原文（32行）</summary>

```text
type compactResult struct {
	ID         string  `json:"id"`
	Content    string  `json:"content"`
	Category   string  `json:"category,omitempty"`
	Importance int     `json:"importance,omitempty"`
	Intent     string  `json:"intent"`
	MatchedVia string  `json:"matched_via,omitempty"`
	Confidence string  `json:"confidence"`
	Score      float64 `json:"score"`
	// Superseded warns that another insight claims to replace this one.
	// It must survive the compact projection: an agent reading only this
	// shape would otherwise be handed corrected content with no signal.
	Superseded bool `json:"superseded,omitempty"`
}

// compactResponse wraps compact results with an optional hint.
type compactResponse struct {
	Results []compactResult `json:"results"`
	Hint    string          `json:"hint,omitempty"`
}

// confidenceLowMax / confidenceMediumMax bucket the recall score into
// low / medium / high labels for agent consumption. The score is the
// weighted sum of normalized signals (keyword + entity + similarity +
// graph), so it is not a calibrated probability. The current cutoffs
// are chosen empirically and may need tuning once we have a larger
// sample of real recall traces; until then the raw score is also
// exposed for callers that need finer control.
const (
	confidenceLowMax    = 0.25
	confidenceMediumMax = 0.6
)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 语义正确性与裁剪是否会使持久记忆承诺失效？

**研究主题**：缺陷与关键质疑

#### 完整回答

持久化保证不能替代事实正确性，核心成立条件是宿主模型能持续监督语义关系与纠错。Skill 已明确警告因果候选来自易误报的正则信号，相似度高也不意味着应建立关系；这同时是反证，不能把本项目描述为完全无监督的自动知识构建。检索的 confidence 由相关性加权分数分档，不是事实可信度或关系因果性的证明。

容量策略默认在活动记录超过 1000 时尝试软删除，单批最多 10 条；默认保护存入未满 24 小时的新记录，并只选 importance<4 且 access_count<3 的候选。MNEMON_MAX_INSIGHTS<=0 可关闭自动容量裁剪，故不能宣称所有配置都会自动丢记忆。软删除同时删除关系并记录带触发写入 ID 的持久审计，remember 输出 auto_pruned_ids，已具有定位副作用的支持，不能声称裁剪完全不可见。另一方面，记录仍在库中并不证明用户能无损恢复整套关系，本次没有完成恢复链的机制审查；因此试用须保留独立备份，不能把它直接当唯一知识档案。更正标记、保留期和保护条件降低了部分风险，但无法证明长期任务正确率。

#### 证据与依据

**依据 1 · 源码核查**：[internal/memory/setup/assets/claude/SKILL.md:10-17](https://github.com/mnemon-dev/mnemon/blob/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec/internal/memory/setup/assets/claude/SKILL.md#L10-L17)

监督者必须核查关系，正则因果候选存在误报。

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

**依据 2 · 源码核查**：[cmd/memory/recall.go:53-63](https://github.com/mnemon-dev/mnemon/blob/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec/cmd/memory/recall.go#L53-L63)

confidence 只是相关性信号分档。

<details>
<summary>查看原文（11行）</summary>

```text
// confidenceLowMax / confidenceMediumMax bucket the recall score into
// low / medium / high labels for agent consumption. The score is the
// weighted sum of normalized signals (keyword + entity + similarity +
// graph), so it is not a calibrated probability. The current cutoffs
// are chosen empirically and may need tuning once we have a larger
// sample of real recall traces; until then the raw score is also
// exposed for callers that need finer control.
const (
	confidenceLowMax    = 0.25
	confidenceMediumMax = 0.6
)
```

</details>

**依据 3 · 源码核查**：[internal/memory/store/node.go:22-60](https://github.com/mnemon-dev/mnemon/blob/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec/internal/memory/store/node.go#L22-L60)

默认容量、单批数、保留期和可关闭容量裁剪的配置。

<details>
<summary>查看原文（39行）</summary>

```text
	// MaxInsights is the default cap before auto-pruning kicks in.
	MaxInsights = 1000

	// PruneBatchSize is how many excess insights to prune at once.
	PruneBatchSize = 10

	// DefaultAutoPruneMinAge protects newborn insights from write-burst
	// retention decisions before they have had a chance to be recalled.
	DefaultAutoPruneMinAge = 24 * time.Hour

	// MaxInsightsUnlimited is the ceiling MaxInsightsLimit returns when
	// auto-pruning is switched off. No store reaches it, so AutoPrune's
	// capacity check never trips and no other code path needs a special case.
	MaxInsightsUnlimited = math.MaxInt
)

// MaxInsightsLimit returns the active auto-prune capacity ceiling.
//
// Resolution: MNEMON_MAX_INSIGHTS > MaxInsights. A value of 0 or below
// switches auto-pruning off and resolves to MaxInsightsUnlimited; an
// unparseable value is reported on stderr and ignored, so a typo cannot
// silently shrink the store.
//
// Resolved at call time rather than at package init, so a caller or test that
// sets the variable after start-up sees the value it set.
func MaxInsightsLimit() int {
	raw := strings.TrimSpace(os.Getenv("MNEMON_MAX_INSIGHTS"))
	if raw == "" {
		return MaxInsights
	}
	n, err := strconv.Atoi(raw)
	if err != nil {
		fmt.Fprintf(os.Stderr, "warning: invalid MNEMON_MAX_INSIGHTS %q: %v (ignored)\n", raw, err)
		return MaxInsights
	}
	if n <= 0 {
		return MaxInsightsUnlimited
	}
	return n
```

</details>

**依据 4 · 源码核查**：[internal/memory/store/node.go:579-627](https://github.com/mnemon-dev/mnemon/blob/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec/internal/memory/store/node.go#L579-L627)

实际裁剪候选、软删除、关系删除及带 trigger 的审计记录。

<details>
<summary>查看原文（49行）</summary>

```text
	cutoff := time.Now().UTC().Add(-minAge).Format(time.RFC3339)
	args = append(args, cutoff, excess)

	// Collect candidate IDs first (close cursor before writing to avoid single-conn deadlock)
	rows, err := ex.Query(
		fmt.Sprintf(`SELECT id FROM insights
		 WHERE deleted_at IS NULL AND importance < 4 AND access_count < 3 %s
		   AND julianday(COALESCE(stored_at, created_at)) <= julianday(?)
		 ORDER BY effective_importance ASC, created_at ASC, id ASC LIMIT ?`, excludeClause), args...)
	if err != nil {
		return nil, fmt.Errorf("query prune candidates: %w", err)
	}
	ids := make([]string, 0, excess)
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			rows.Close()
			return nil, fmt.Errorf("scan prune candidate: %w", err)
		}
		ids = append(ids, id)
	}
	if err := rows.Err(); err != nil {
		rows.Close()
		return nil, fmt.Errorf("iterate prune candidates: %w", err)
	}
	rows.Close()

	now := time.Now().UTC().Format(time.RFC3339)
	prunedIDs := make([]string, 0, len(ids))
	for _, id := range ids {
		res, err := ex.Exec(
			`UPDATE insights SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL`,
			now, now, id)
		if err != nil {
			return nil, fmt.Errorf("prune %s: %w", id, err)
		}
		if n, _ := res.RowsAffected(); n > 0 {
			if err := db.DeleteEdgesByNode(id); err != nil {
				return nil, fmt.Errorf("delete edges for pruned %s: %w", id, err)
			}
			detail := fmt.Sprintf("auto-prune: over capacity (active=%d, max=%d, min_age=%s)", total, maxInsights, minAge)
			if triggerInsightID != "" {
				detail += fmt.Sprintf(" trigger=%s", triggerInsightID)
			}
			if err := db.RecordOp("prune", id, detail); err != nil {
				return nil, fmt.Errorf("record auto-prune for %s: %w", id, err)
			}
			prunedIDs = append(prunedIDs, id)
		}
```

</details>

**依据 5 · 源码核查**：[cmd/memory/remember.go:256-276](https://github.com/mnemon-dev/mnemon/blob/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec/cmd/memory/remember.go#L256-L276)

输出裁剪数量及每个被裁剪 ID。

<details>
<summary>查看原文（21行）</summary>

```text
		output := map[string]interface{}{
			"id":                   insight.ID,
			"content":              insight.Content,
			"category":             insight.Category,
			"importance":           insight.Importance,
			"tags":                 insight.Tags,
			"entities":             insight.Entities,
			"action":               diffAction,
			"diff_suggestion":      string(diffSuggestion),
			"created_at":           insight.CreatedAt.Format(time.RFC3339),
			"edges_created":        edgeStats,
			"semantic_candidates":  semanticCandidates,
			"causal_candidates":    causalCandidates,
			"embedded":             embedded,
			"effective_importance": ei,
			"auto_pruned":          len(prunedIDs),
			"auto_pruned_ids":      prunedIDs,
		}
		enc := json.NewEncoder(os.Stdout)
		enc.SetIndent("", "  ")
		return enc.Encode(output)
```

</details>

#### 缺口

- 未核实软删除后关系的完整恢复路径与长期错误关联积累。
  **影响**：不能建议将记忆库作为唯一档案，也不能认定长期语义质量可靠。
  **进一步探讨**：使用可丢弃副本模拟纠错、容量裁剪和恢复，核对事实与关系是否都能还原。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何接入、持续操作和退出，成本效果支持到哪一步？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

本研究对象是本地 Go 工具而非已验证的完整 DSH 插件。根 package.json 是 @mnemon-dev/dsh-mnemon bundle，依赖 dsh-mnemon 的 latest 标签并由 cordis.patch.yml 挂载；本仓库固定提交不能锁住该外部包。Memory CLI 的 npm 安装路径则是 @mnemon-dev/mnemon，作者说明 npm 启动器需 Node.js 22+，原生二进制承担引擎。Agency 是独立 Preview 表面，本次不把其持久任务和安全边界计作 Memory 采用依据。

适合试用的是能维护本地数据、愿意逐条检查写入和召回结果的开发者，先使用非敏感的副本库并显式指定 --store，避免误用活动库。库选择优先级为命令参数、环境变量、active 文件，再到 default；这是本地数据组织，不是多租户授权。首次安装、模型判断、候选复核和备份都有负担，零额外 API key 的作者描述不能推成零模型 token、零人工或零资源成本。合格试用以同一批历史事实完成后续问答，核对更正事实优先、错误关系不被当成依据、裁剪能被发现。出现事实串库、错误更正或无法恢复时停止该库的写入，保留备份并回到原始笔记；CLI 能独立使用，DSH 适配应另固定其外部版本后研究。

现金费用、人工耗时与相对笔记的成功率均未知，不能据源码输出节时或 ROI。已识别具体机制及可控的副本试用范围，足以支持 trial；由于有持续复核和恢复缺口，不支持持续安装保证。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-20](https://github.com/mnemon-dev/mnemon/blob/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec/package.json#L1-L20)

根包依赖 dsh-mnemon latest，身份与原生 Memory CLI 不同。

<details>
<summary>查看原文（20行）</summary>

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
  },
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-16](https://github.com/mnemon-dev/mnemon/blob/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec/cordis.patch.yml#L1-L16)

外部包实际挂载且 writeEnabled 打开，不能据根提交验证外部实现。

<details>
<summary>查看原文（16行）</summary>

```text
# Mount the full dsh-mnemon package selected by its npm latest tag in
# package.json. Keeping the original package as the mounted row preserves its
# host and browser plugin identities.
- insert:
    - id: mnemon
      name: dsh-mnemon
      config:
        routingGuidance: true
        lifecycleEnabled: true
        recallMode: guided
        writebackMode: guided
        idleReviewMs: 30000
        tabEnabled: true
        writeEnabled: true
        timeoutMs: 10000
        defaultRecallLimit: 10
```

</details>

**依据 3 · 作者声明**：[README.md:85-119](https://github.com/mnemon-dev/mnemon/blob/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec/README.md#L85-L119)

作者给出 npm 安装依赖和原生二进制分工，Agency 的 Windows 边界独立。

<details>
<summary>查看原文（35行）</summary>

````text
## Quick Start

### Install

**npm** (recommended; macOS / Linux / Windows, Node.js 22+):

```bash
npm install --global @mnemon-dev/mnemon
```

Upgrade the npm-managed CLI at any time:

```bash
mnemon update
```

The npm package installs the matching native Go executable for the host OS and
CPU. Mnemon's engine remains a single native binary; Node.js is used only by
the npm launcher and package manager.

**Alternative installers**:

```bash
brew install --cask mnemon-dev/tap/mnemon
go install github.com/mnemon-dev/mnemon@latest
```

Homebrew, `go install`, source builds, and other Node package managers must
continue to use their original installation method. To migrate one of these
installations, run the npm install command once and ensure the npm global bin
directory precedes the old executable on `PATH`; subsequent `mnemon update`
calls are npm-managed.

Windows supports the core Memory commands. Agency remains unavailable on
Windows until its local authority boundary has native Windows security.
````

</details>

**依据 4 · 源码核查**：[cmd/memory/root.go:64-99](https://github.com/mnemon-dev/mnemon/blob/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec/cmd/memory/root.go#L64-L99)

--store 优先级与本地库打开链路。

<details>
<summary>查看原文（36行）</summary>

```text
// resolveStoreName returns the effective store name.
// Priority: --store flag > MNEMON_STORE env > active file > "default".
func resolveStoreName() string {
	if storeName != "" {
		return storeName
	}
	if env := os.Getenv("MNEMON_STORE"); env != "" {
		return env
	}
	return store.ReadActive(dataDir)
}

// truncID safely truncates an ID to 8 characters for display.
func truncID(id string) string {
	if len(id) > 8 {
		return id[:8]
	}
	return id
}

// openDB is a helper used by subcommands.
func openDB() (*store.DB, error) {
	name := resolveStoreName()
	if !store.ValidStoreName(name) {
		return nil, fmt.Errorf("invalid store name %q", name)
	}
	dir := store.StoreDir(dataDir, name)

	if readOnly {
		return store.OpenReadOnly(dir)
	}

	if err := store.MigrateIfNeeded(dataDir); err != nil {
		return nil, fmt.Errorf("migrate: %w", err)
	}
	return store.Open(dir)
```

</details>

**依据 5 · 源码核查**：[internal/memory/setup/assets/claude/SKILL.md:10-18](https://github.com/mnemon-dev/mnemon/blob/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec/internal/memory/setup/assets/claude/SKILL.md#L10-L18)

持续操作需要监督者核查关系。

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

#### 缺口

- 没有同任务笔记对照下的合格率、总耗时、模型费用和人工纠错数据。
  **影响**：无法判断图记忆额外复杂性是否在目标人的工作中值得。
  **进一步探讨**：固定模型与事实集，对比笔记和副本库，记录所有失败、纠错、召回与恢复成本。
- 外部 dsh-mnemon latest 包的确切版本与接线不由当前提交确定。
  **影响**：不能将本研究视为 DSH 完整兼容或安装验收。
  **进一步探讨**：另固定外部包版本并核查其宿主入口与禁用退出过程。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 从确定性检索与模型监督的分工能提出什么可证伪改进？

**研究主题**：新假设与验证

#### 完整回答

由 Q02 的访问计数更新与 Q03 的 access_count<3 裁剪条件，可推导一个评估方法假设：用固定副本、显式只读库和单独记录监督决策的回放方式，可能比直接重复召回更可靠地辨认长期记忆的真实收益。普通 recall 会改变后续保留资格，频繁评测本身可能让记录更不易被裁剪；这只是机制上可能的混杂，不是已实测的评测偏差。现有 --readonly 已支持只读打开，裁剪审计也已保存触发 ID，故这里不声称系统缺少只读或回执，不将建议算成项目已有创新。增量是把这些现有机制组合成评估协议，单独区分事实质量、召回排序与保留策略的贡献。

最小实验从同一非敏感库快照创建两组，一组允许正常访问计数，另一组只读回放；使用包含已更正事实、低频关键事实和无关高频查询的固定序列，记录最终问答正确率、关键事实保留、错误关联采用次数、监督 token 与人工纠错时间。再用普通笔记作独立任务基线。若两组的结论一致且额外记录没有改变采用决策，或回放维护负担超过所减少的误判，则削弱这个方法假设。若只读运行与正常业务路径有实质差异，也必须分别报告，不能靠关闭副作用得出生产收益结论。

#### 证据与依据

**依据 1 · 源码核查**：[cmd/memory/recall.go:204-211](https://github.com/mnemon-dev/mnemon/blob/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec/cmd/memory/recall.go#L204-L211)

正常召回尝试增加访问计数。

```text
		resp, err := search.IntentAwareRecallFrom(db, all, keyword, queryVec, queryEntities, recLimit, intentOverride)
		if err != nil {
			return fmt.Errorf("recall: %w", err)
		}
		for _, r := range resp.Results {
			_ = db.IncrementAccessCount(r.Insight.ID)
		}
		db.LogOp("recall", "", fmt.Sprintf("q=%s hits=%d", keyword, len(resp.Results)))
```

**依据 2 · 源码核查**：[internal/memory/store/node.go:582-587](https://github.com/mnemon-dev/mnemon/blob/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec/internal/memory/store/node.go#L582-L587)

裁剪候选用访问次数阈值，评测可能改变后续资格。

```text
	// Collect candidate IDs first (close cursor before writing to avoid single-conn deadlock)
	rows, err := ex.Query(
		fmt.Sprintf(`SELECT id FROM insights
		 WHERE deleted_at IS NULL AND importance < 4 AND access_count < 3 %s
		   AND julianday(COALESCE(stored_at, created_at)) <= julianday(?)
		 ORDER BY effective_importance ASC, created_at ASC, id ASC LIMIT ?`, excludeClause), args...)
```

**依据 3 · 源码核查**：[cmd/memory/root.go:84-99](https://github.com/mnemon-dev/mnemon/blob/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec/cmd/memory/root.go#L84-L99)

已有只读打开路径是反证，不把它当未来新增功能。

<details>
<summary>查看原文（16行）</summary>

```text
// openDB is a helper used by subcommands.
func openDB() (*store.DB, error) {
	name := resolveStoreName()
	if !store.ValidStoreName(name) {
		return nil, fmt.Errorf("invalid store name %q", name)
	}
	dir := store.StoreDir(dataDir, name)

	if readOnly {
		return store.OpenReadOnly(dir)
	}

	if err := store.MigrateIfNeeded(dataDir); err != nil {
		return nil, fmt.Errorf("migrate: %w", err)
	}
	return store.Open(dir)
```

</details>

**依据 4 · 源码核查**：[internal/memory/store/node.go:619-626](https://github.com/mnemon-dev/mnemon/blob/bbc9151234e0c4f563a0d581e4bc2d5a2d4f83ec/internal/memory/store/node.go#L619-L626)

已有裁剪回执把触发写入与副作用关联。

```text
			detail := fmt.Sprintf("auto-prune: over capacity (active=%d, max=%d, min_age=%s)", total, maxInsights, minAge)
			if triggerInsightID != "" {
				detail += fmt.Sprintf(" trigger=%s", triggerInsightID)
			}
			if err := db.RecordOp("prune", id, detail); err != nil {
				return nil, fmt.Errorf("record auto-prune for %s: %w", id, err)
			}
			prunedIDs = append(prunedIDs, id)
```

#### 缺口

- 访问反馈是否足以改变实际长期任务评估结论尚未测量。
  **影响**：不能声称此评估协议已经改善正确率或降低成本。
  **进一步探讨**：按固定快照双组回放，记录差异、维护成本和决策变化。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
