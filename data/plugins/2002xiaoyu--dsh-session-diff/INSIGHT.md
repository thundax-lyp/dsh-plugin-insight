# dsh-session-diff

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[f5b20d0](https://github.com/2002XiaoYu/dsh-session-diff/tree/f5b20d0001bb9955c4eebe0f2037507769e55197)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2002XiaoYu/dsh-session-diff)
<!-- END META -->

> **实现功能**：在 DSH 右侧栏显示当前会话修改文件的行级差异和变更列表。

> **核心亮点**：把会话工具hunk、逆序还原与侧栏路由组合为会话级审查视图，并仅接管存在会话改动的文件。相对Git提供不同归因入口，Myers与宿主格式不属原创贡献；没有同条件审查收益对照。详见[Q03](#research-q03)。

> **风险与缺陷**：可信会话归因仍依赖启发式基线。后缀路径、重复片段和未校验跨页版本可能造成歧义，已发现的降级提示也不覆盖所有错配条件；均为源码推断，未复现。不能据此证明修改完整性。详见[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 谁需要会话级而非工作区级差异，什么结果才算合格？](#detail-section-11)
  - [Q02 · 工具事件如何成为双行号差异，遇到无法还原时显示什么？](#detail-section-12)
  - [Q03 · 相对 git diff 与原生文件查看器，固定版本具体增加什么？](#detail-section-13)
  - [Q04 · 事件不全、路径歧义与分页读取是否削弱可信归因？](#detail-section-14)
  - [Q05 · 安装、持续刷新与退出分别依赖什么？](#detail-section-15)
  - [Q06 · 首次、持续使用与失败恢复成本及效果能判断到哪里？](#detail-section-16)
  - [Q07 · 哪些工程设计值得复用，代价与可靠性边界是什么？](#detail-section-17)
  - [Q08 · 如何改进可信归因，并以最小对照支持或推翻该方向？](#detail-section-18)
  - [Q09 · 谁适合受控试用，什么结果应让读者停止依赖它？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：给同时处理多个会话的开发者一个会话级审查入口，以保留的write/edit事件和当前文件形成差异视图；不代替全仓库验收。

Git用于工作区相对基线的完整变更核查；原生查看器提供当前文件显示。本插件为保留会话工具事件提供辅助归因入口，外部编辑仍须独立核对。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 会话文件差异 | 展示双行号与增删行 | 仅保留的工具事件，基线为推定 |
| 会话变更清单 | 集中打开本会话文件 | 路径匹配与事件窗口影响覆盖 |
| 变化区折叠与重读 | 缩小浏览区域并刷新当前文本 | 显示行数、读取和算法均有上限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH web与对应客户端服务 | 启动必需 | Loader、React、会话状态及侧栏挂载 | 版本不匹配可能无法挂载，兼容需另行核对 |
| workspaceFiles Remote | 查看文件必需 | 按会话和路径分页读取当前文本 | 界面显示读取失败 |
| 保留的工具meta.diffs | 归因必需 | 生成会话文件集合与还原基线 | 无事件不能显示相应修改 |
| npm安装包或仓库产物 | 启动必需 | 提供预构建lib与patch | 本轮npm查询404，不能承诺npm路径可用 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户固定包版本并确认web profile | 检查bundle与手工patch没有重复 |
| 加载 | 用户安装后重启web并刷新浏览器 | 新视图只接管有事件的文件 |
| 审查 | 用户从工具结果或清单打开文件 | 核对路径、截断和未定位提示 |
| 退出 | 用户按原安装途径移除并重启 | 原生查看器恢复；手工patch须保留合法数组 |

失败时首选重读和回到Git核查，不能靠刷新弥补已丢失的会话历史。上述步骤描述作者方案及源码可见处理，不记录为已执行。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 获取包和宿主环境，金额未知 | 固定版本、配置profile、重启刷新 | 作者提供路径，部署耗时未计量 |
| 持续使用 | 分页传输与浏览器差异计算，单位资源未知 | 打开变更、核对归因及必要Git检查 | 每次hunk变化触发延迟读取，工作负载影响成本 |
| 失败恢复 | 重读或回退Git，重复传输未知 | 识别截断、错归因及重建真实基线 | 丢失历史无法仅靠重读恢复 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 缩小审查集合 | 事件按会话聚合而非直接使用Git全工作区 | 漏项率及歧义路径准确率 |
| 降低来回切换 | 在侧栏显示差异、变更列表可打开文件 | 同任务耗时与认知负担变化 |
| 大文件可控 | 分页上限和差异预算限制计算范围 | 真实峰值内存、卡顿及误读成本 |

250ms延迟合并短时间读取变化，但不能据此估算节省百分比。只有把失败样本、人工复核和退出负担纳入同批任务，才可计算合格审查的单位成本。

> **思考**：可信会话归因仍依赖启发式基线。后缀路径、重复片段和未校验跨页版本可能造成歧义，已发现的降级提示也不覆盖所有错配条件；均为源码推断，未复现。不能据此证明修改完整性。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把会话工具hunk、逆序还原与侧栏路由组合为会话级审查视图，并仅接管存在会话改动的文件。相对Git提供不同归因入口，Myers与宿主格式不属原创贡献；没有同条件审查收益对照。详见[Q03](#research-q03)。

把会话工具hunk、逆序还原与侧栏路由组合为会话级审查视图，并仅接管存在会话改动的文件。相对Git提供不同归因入口，Myers与宿主格式不属原创贡献；没有同条件审查收益对照。详见[Q03](#research-q03)。

可借鉴的是选择性路由、显式依赖声明、读请求取消与有界算法，分别处理插件共存、严格宿主上下文、过期异步回写与浏览器资源边界。store通过兼容多种snapshot访问方式降低接口形态差异的影响，但也增加了静默失败路径；以节点数和最后seq作memo键，在节点原地修订而长度和尾seq不变时存在失效遗漏的条件风险，未复现。

构建器按src文件名排序拼接为宿主lazy-CJS，并核对包名、patch和关键导出标记，这是约束单文件客户端产物的轻量方法。它检查字符串契约不等于检查实际挂载。测试文件包含真实hunk构造、地址往返及基线还原断言，可作为设计证据；本轮未执行它们，不能声称通过。模块片段依赖拼接作用域，inventory对片段的解析报错也不能直接当语法失效。复用时需移植宿主事件格式、Remote和插槽契约，并补对应版本的一致性测试。

<a id="detail-section-5"></a>

### 1.4 主要限制

可信会话归因仍依赖启发式基线。后缀路径、重复片段和未校验跨页版本可能造成歧义，已发现的降级提示也不覆盖所有错配条件；均为源码推断，未复现。不能据此证明修改完整性。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合用Git兜底的开发者在独立web profile试用，先核对已知改动与显示路径；出现未提示错归因或接管异常就停用，不能当完整审计。详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献是源码支持的会话级视图集成；效果优势仍属解释。版本绑定差异是研究者提出且未验证的新假设。

- 已检查：作者 README、包清单、源码路径 src/80-apply.js、src/50-store.js、src/40-reader.js、src/30-diff.js、src/10-util.js、src/60-ui-file.js、scripts/build.mjs、test/logic.test.mjs、lib/index.js、README.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定提交源码、作者材料、测试与构建定义；不执行目标代码或宿主冒烟，不将静态机制等同运行效果。
- 下一步：进一步探讨可从同后缀且重复片段的文件、跨页并发编辑和节点裁剪样本入手，以已知版本核对归因、完整性与审查耗时。

**分析版本**

- **仓库**：[2002XiaoYu/dsh-session-diff](https://github.com/2002XiaoYu/dsh-session-diff)
- **版本号**：0.1.0（[固定提交 f5b20d0](https://github.com/2002XiaoYu/dsh-session-diff/tree/f5b20d0001bb9955c4eebe0f2037507769e55197)）
- **版本日期**：2026-09-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可进一步探讨版本绑定会话差异，用规范路径、事件前后版本与一致分页取代部分启发式还原；新增宿主接口和存储负担，须与当前实现及Git对照错归因与资源成本，未验证。详见[Q08](#research-q08)。

进一步探讨可从同后缀且重复片段的文件、跨页并发编辑和节点裁剪样本入手，以已知版本核对归因、完整性与审查耗时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 12 | 3441 | 2803 | 406 | — |
| .md | source | 2 | 315 | — | — | 3498 |
| .mjs | source | 1 | 67 | 36 | 21 | — |
| .mjs | test | 2 | 645 | 523 | 83 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2002XiaoYu/dsh-session-diff/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/2002XiaoYu/dsh-session-diff/issues?q=is%3Aissue+created%3A2026-09-22T04%3A37%3A21.029Z..2026-10-22T04%3A37%3A21.029Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2002XiaoYu/dsh-session-diff/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T04%3A37%3A21.029Z..2026-10-22T04%3A37%3A21.029Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确定固定版本dsh-session-diff的会话差异机制、相对增量、可信边界和适合的采用方式。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要会话级而非工作区级差异，什么结果才算合格？

**研究主题**：场景与需求

#### 完整回答

直接受益者是同时保留多个工作会话、需要判断本次对话具体改动的开发者。输入是当前会话保留的 write/edit 结果和对应文件当前文本，交付物是可定位的增删行视图及会话文件列表。Git diff 以版本库基线组织工作区差异，会将其他会话或人工操作一起反映；本插件按工具事件切出当前会话的归因范围，补充另一种审查入口。

合格结果应同时满足路径属于本会话、事件未丢失、还原旧文本可靠、显示明确披露截断或未定位。它不替代提交前的全仓库检查，也不适合证明 shell、外部编辑器或已移出会话保留窗口的修改。作者关于“every file”的说法必须在这种事件覆盖范围内解释，而不能读作完整文件审计。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-28](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/README.md#L7-L28)

作者给出会话文件视图、变更列表及实时刷新目标。

<details>
<summary>查看原文（22行）</summary>

```text
When you open a file that the **current conversation** changed, the sidebar renders it with
git-style added/removed line highlighting plus syntax colouring, and a companion page lists
every file this conversation touched.

![The decorated file view: session-scoped diff in the right sidebar](assets/screenshot-1.png)

## What it does

- **Decorated file view.** `write` / `edit` tool rows already open the changed file in the right
  sidebar. This plugin's tab type claims exactly those addresses (extension priority, and only
  when the session really has changes for that path), so the same click now opens a view with:
  - green/red line backgrounds and `+` / `-` gutter markers,
  - dual line-number gutters (old / new) like `git diff`,
  - syntax colouring for the whole file,
  - a header with `+added −removed`, a "changes only / whole file" toggle, a changes-only view
    that collapses long unchanged runs, and a re-read button.
- **Session changes page.** A companion tab type lists the files this conversation changed with
  per-file `+/−` counts and the containing directory; clicking an entry opens the decorated view.
  Reachable from the file view's header button and from the right sidebar's guide page.
- **Live.** Decorations follow the conversation: each new applied edit re-reads the file and
  recomputes the diff.

```

</details>

**依据 2 · 作者声明**：[README.md:99-113](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/README.md#L99-L113)

作者明确排除会话外改动及过长会话早期节点，支持收窄合格范围。

<details>
<summary>查看原文（15行）</summary>

```text
## Scope and limits

- **Current conversation only.** The data is `write` / `edit` results in the session you are
  looking at. Changes made by another conversation, by hand, or before this conversation are not
  shown — use git for that.
- **Very long conversations lose their earliest entries.** The change list is derived from the
  client's retained conversation window; hunks whose nodes have scrolled out of that window are
  no longer listed.
- Files are read up to 20 000 lines in 600-line pages.
- Hunk paths are matched against address paths by suffix (an absolute hunk path against a
  workspace-relative address, and vice versa). A wrong match cannot lie: the hunks' own text must
  still be found in the file, otherwise the view degrades and says so.
- A hunk whose text is no longer present in the file (rewritten outside this conversation) is
  reported as unlocated; the rest still renders.
- Deleted files report a read failure instead of crashing.
```

</details>

**依据 3 · 源码核查**：[src/50-store.js:163-186](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/50-store.js#L163-L186)

文件清单由当前节点收集和聚合，没有独立持久变更日志。

<details>
<summary>查看原文（24行）</summary>

```text
/** Every file this conversation changed, from nodes the caller already holds. */
function filesFromNodes(nodes) {
	const collected = [];
	if (nodes) collectHunks(nodes, collected, 0);
	return groupHunks(collected);
}

/** Selector for the standard `useChat` prop: the legacy node slice carrying tool results. */
function selectLegacyNodes(snapshot) {
	return snapshot && snapshot.legacy ? snapshot.legacy.nodes : null;
}

function computeFiles(sessionId) {
	const nodes = nodesFor(sessionId);
	const key = nodes ? nodes.length + "@" + lastSeq(nodes) : "none@" + revision;
	const cached = memo.get(sessionId);
	if (cached && cached.key === key) return cached;

	const collected = [];
	if (nodes) collectHunks(nodes, collected, 0);
	const list = groupHunks(collected);
	const next = { key: key, list: list, resolved: !!nodes };
	memo.set(sessionId, next);
	return next;
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具事件如何成为双行号差异，遇到无法还原时显示什么？

**研究主题**：功能与机制

#### 完整回答

机制由三段组成。收集器深度优先走会话节点，只接受非错误 tool-result 中结构合法的 meta.diffs，把 path、oldText、newText 和序号保留下来。按文件聚合后，读取器经 workspaceFiles Remote 每页读取600行；界面把当前文本与会话 hunks 交给模型。逆序还原从最新hunk往前，用 newText 查找并替换为 oldText，得到推定的会话前基线，再运行有界 Myers 算法，生成旧/新行号及增删行。

定位依据是字符串出现位置和上一次位置提示，并非不可变文件快照。找不到 newText 时该hunk计入 unresolved，最终模型标记 degraded；算法超过预算时采用整段替换，界面还将显示行数截到8000。读取失败进入error状态，重读可重新取得当前文件；这属于可见降级，不说明所有错误归因都能检测。

#### 证据与依据

**依据 1 · 源码核查**：[src/30-diff.js:35-48](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/30-diff.js#L35-L48)

过滤事件及递归层数边界，确定实际输入覆盖。

<details>
<summary>查看原文（14行）</summary>

```text
/** Depth-first walk of conversation nodes, collecting applied file hunks in order. */
function collectHunks(nodes, into, depth) {
	if (!Array.isArray(nodes) || (depth || 0) > 6) return;
	for (const node of nodes) {
		if (!node || typeof node !== "object") continue;
		if (node.subCalls) collectHunks(node.subCalls, into, (depth || 0) + 1);
		if (node.kind !== "tool-result") continue;
		if (node.isError) continue;
		const hunks = narrowHunks(node.meta);
		if (!hunks) continue;
		for (const hunk of hunks) {
			into.push({ path: hunk.path, oldText: hunk.oldText, newText: hunk.newText, seq: typeof node.seq === "number" ? node.seq : into.length });
		}
	}
```

</details>

**依据 2 · 源码核查**：[src/30-diff.js:76-96](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/30-diff.js#L76-L96)

逆序替换产生推定基线，未匹配hunk保留为unresolved。

<details>
<summary>查看原文（21行）</summary>

```text
/**
 * Walk the hunks newest-first, replacing each hunk's `newText` with its
 * `oldText`, which yields the pre-conversation text.
 */
function reverseApply(currentText, hunks) {
	let text = currentText;
	let hint = currentText.length;
	const unresolved = [];
	let applied = 0;
	for (let i = hunks.length - 1; i >= 0; i -= 1) {
		const hunk = hunks[i];
		const position = locate(text, hunk.newText, hint);
		if (position === -1) {
			unresolved.push(hunk);
			continue;
		}
		text = text.slice(0, position) + (hunk.oldText === null ? "" : hunk.oldText) + text.slice(position + hunk.newText.length);
		hint = position;
		applied += 1;
	}
	return { baseline: text, unresolved: unresolved, applied: applied };
```

</details>

**依据 3 · 源码核查**：[src/30-diff.js:190-220](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/30-diff.js#L190-L220)

模型生成增删行和degraded标志，Myers失败回退整段替换。

<details>
<summary>查看原文（31行）</summary>

```text
function buildFileModel(currentText, hunks, lang) {
	// Blank-only text counts as zero lines: a file created by this conversation
	// must read as pure additions, a file emptied by it as pure deletions, and
	// neither should report a stray empty line as changed.
	const currentLines = currentText.trim() === "" ? [] : splitLines(currentText);
	const reconstruction = reverseApply(currentText, hunks || []);
	const baselineLines = reconstruction.baseline.trim() === "" ? [] : splitLines(reconstruction.baseline);
	const ops = (hunks || []).length === 0 ? [] : myersOps(baselineLines, currentLines);
	const rows = (hunks || []).length === 0 ? currentLines.map((line, index) => ({ kind: "ctx", oldNo: index + 1, newNo: index + 1, oldIndex: index, newIndex: index })) : ops ? rowsFromOps(ops, baselineLines, currentLines) : wholeReplacementRows(baselineLines, currentLines);

	let added = 0;
	let removed = 0;
	for (const row of rows) {
		if (row.kind === "add") added += 1;
		else if (row.kind === "del") removed += 1;
	}

	const currentSegments = lineSegments(currentText, lang);
	const baselineSegments = reconstruction.unresolved.length > 0 ? lineSegments(reconstruction.baseline, lang) : null;

	return {
		rows: rows,
		added: added,
		removed: removed,
		changed: added + removed,
		currentLines: currentLines,
		baselineLines: baselineLines,
		currentSegments: currentSegments,
		baselineSegments: baselineSegments,
		degraded: reconstruction.unresolved.length > 0,
		unresolved: reconstruction.unresolved.length
```

</details>

**依据 4 · 源码核查**：[src/60-ui-file.js:112-125](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/60-ui-file.js#L112-L125)

模型接线、只看改动及8000显示行上限。

<details>
<summary>查看原文（14行）</summary>

```text
	const model = useMemo(() => {
		if (read.status !== "ready" || !path) return null;
		return buildFileModel(read.text, hunks, languageOf(path));
	}, [read.status, read.text, hunks, path]);

	const mode = preferredMode || (model && model.changed > 0 ? "changes" : "whole");

	const displayRows = useMemo(() => {
		if (!model) return [];
		const rows = mode === "changes" ? collapseRows(model.rows, 3, 6, openGaps) : model.rows;
		return rows.length > 8000 ? rows.slice(0, 8000) : rows;
	}, [model, mode, openGaps]);

	const modelKey = address && read.status === "ready" ? address + "@" + (read.version || "") + "@" + hunksKey : null;
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对 git diff 与原生文件查看器，固定版本具体增加什么？

**研究主题**：贡献与相对优势

#### 完整回答

已有贡献是把会话工具的文本hunk转换成可浏览的会话级差异视图。相对原生打开文件，它加入旧/新行号、增删染色、折叠未改动区和文件清单；相对直接执行 git diff，它利用会话身份划分审查集合，不需先建立单独分支或提交来隔开各会话。canOpen 只在本会话存在路径匹配hunk时接管地址，避免所有文件都被新查看器覆盖。

技术参照仍是成熟的文本逆补丁与Myers行差异。源码注释承认元数据收窄逻辑借自宿主查看器，不能将上游格式或Myers当作作者原创。研究者识别的增量是这些机制与DSH会话服务、Remote和侧栏路由的组合。业务交付仍是审查辅助视图，没有证据表明它替代提交验收或提升代码正确率。

#### 证据与依据

**依据 1 · 源码核查**：[src/80-apply.js:14-29](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/80-apply.js#L14-L29)

只有路径确有会话变更才接管，构成集成边界。

<details>
<summary>查看原文（16行）</summary>

```text
function fileTabDefinition() {
	return {
		id: FILE_TAB_ID,
		kind: FILE_TAB_KIND,
		patterns: ["dsh-resource://file/**"],
		priority: "extension",
		/** Claim only files this conversation actually changed; everything else keeps the shipped viewer. */
		canOpen: function (address) {
			try {
				const parsed = parseSessionFileAddress(address);
				if (!parsed) return false;
				return SessionDiffStore.hasChanges(parsed.sessionId, parsed.path);
			} catch (error) {
				return false;
			}
		},
```

</details>

**依据 2 · 源码核查**：[src/80-apply.js:60-81](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/80-apply.js#L60-L81)

文件视图与清单视图分别注册，并绑定宿主插槽。

<details>
<summary>查看原文（22行）</summary>

```text
function apply(ctx) {
	captureRemote(ctx);
	bindCopy(ctx);
	tryBind(ctx);
	ctx.effect(() => ctx.locale.register(NS, { zh: COPY.zh, en: COPY.en }), "dsh-session-diff: dictionaries");
	ctx.effect(() => ctx.sidebarRightTabs.register(fileTabDefinition()), "dsh-session-diff: file tab type");
	ctx.effect(() => ctx.sidebarRightTabs.register(changesTabDefinition()), "dsh-session-diff: changes tab type");
	ctx.effect(
		() => ctx.slots.inject("sidebar.right.pane.tab", () => ctx.slots.register({ name: "sidebar.right.pane.tab", key: FILE_TAB_ID, locale: NS }, SessionDiffFileBody)),
		"dsh-session-diff: file body"
	);
	ctx.effect(
		() => ctx.slots.inject("sidebar.right.pane.tab", () => ctx.slots.register({ name: "sidebar.right.pane.tab", key: CHANGES_TAB_ID, locale: NS }, SessionChangesBody)),
		"dsh-session-diff: changes body"
	);
	ctx.effect(
		() => ctx.slots.inject("sidebar.right.pane.tab.title", () => ctx.slots.register({ name: "sidebar.right.pane.tab.title", key: FILE_TAB_ID }, SessionDiffFileTitle)),
		"dsh-session-diff: file title"
	);
	ctx.effect(
		() => ctx.slots.inject("sidebar.right.pane.tab.title", () => ctx.slots.register({ name: "sidebar.right.pane.tab.title", key: CHANGES_TAB_ID }, SessionChangesTitle)),
		"dsh-session-diff: changes title"
```

</details>

**依据 3 · 源码核查**：[src/30-diff.js:13-33](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/30-diff.js#L13-L33)

有界Myers参数及注释所述宿主元数据收窄归属。

<details>
<summary>查看原文（21行）</summary>

```text
const MYERS_MAX_D = 600;
const MYERS_MAX_CELLS = 4000000;

/** Copy of the shipped viewer's metadata narrowing (host module is not importable here). */
function narrowHunks(meta) {
	if (typeof meta !== "object" || meta === null || Array.isArray(meta)) return null;
	const diffs = meta.diffs;
	if (!Array.isArray(diffs) || diffs.length === 0) return null;
	const out = [];
	for (const hunk of diffs) {
		if (typeof hunk !== "object" || hunk === null) return null;
		const path = hunk.path;
		const oldText = hunk.oldText;
		const newText = hunk.newText;
		if (typeof path !== "string") return null;
		if (oldText !== null && typeof oldText !== "string") return null;
		if (typeof newText !== "string") return null;
		out.push({ path: path, oldText: oldText, newText: newText });
	}
	return out;
}
```

</details>

#### 缺口

- 缺少在同一工作区、同一审查任务中与git及原生查看器的结果对照。
  **影响**：只能判断实现增量，不能判断审查质量或节时优势。
  **进一步探讨**：可选取两会话交替编辑的共同任务，比较归因正确率与人工核对时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 事件不全、路径歧义与分页读取是否削弱可信归因？

**研究主题**：缺陷与关键质疑

#### 完整回答

最影响价值成立的限制是“推定基线”可能被读者当成可靠的会话前快照。路径匹配允许一方以另一方为后缀，因此两个目录的同名相对路径可能进入同一匹配集合。后续要求hunk文本存在只排除了找不到文本的情况；若重复文本也在错误文件中出现，不能据此保证归因正确。reverseApply 的出现位置提示是启发式，在重复片段中存在多个可接受位置，不含来源版本证明。以上为源码反例推断，未作运行复现。

另一个独立问题是文件分多次Remote调用读取，却只不断覆盖返回的version，没有比较各页版本是否一致；正在被其他会话写入的大文件可能形成跨版本拼接。读取上限检查在每页之前，600行页可能使总行数跨过20000，故它是近似边界而非严格20000行裁剪。Myers超过预算采用整段替换，模型degraded标记只依据未定位hunk，并未同时标明差异算法退化。综合起来，界面可作线索，不能作完整性和精确归因证明。

#### 证据与依据

**依据 1 · 源码核查**：[src/10-util.js:169-184](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/10-util.js#L169-L184)

后缀匹配未绑定工作区规范路径。

<details>
<summary>查看原文（16行）</summary>

```text
function normPath(value) {
	return String(value == null ? "" : value)
		.replace(/\\/g, "/")
		.replace(/\.\//g, "")
		.replace(/\/{2,}/g, "/");
}

/** Hunk paths may be absolute while an address path may be workspace-relative. */
function pathMatches(hunkPath, addressPath) {
	const a = normPath(hunkPath);
	const b = normPath(addressPath);
	if (!a || !b) return false;
	if (a === b) return true;
	if (a.endsWith("/" + b)) return true;
	if (b.endsWith("/" + a)) return true;
	return false;
```

</details>

**依据 2 · 源码核查**：[src/30-diff.js:57-96](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/30-diff.js#L57-L96)

最近出现位置与逆序替换不携带原始文件版本。

<details>
<summary>查看原文（40行）</summary>

```text
/** Locate `needle` nearest to `hint`, so repeated snippets resolve in place. */
function locate(text, needle, hint) {
	if (!needle) return -1;
	let best = -1;
	let bestDistance = Infinity;
	let from = 0;
	for (;;) {
		const found = text.indexOf(needle, from);
		if (found === -1) break;
		const distance = Math.abs(found - hint);
		if (distance < bestDistance) {
			bestDistance = distance;
			best = found;
		}
		from = found + 1;
	}
	return best;
}

/**
 * Walk the hunks newest-first, replacing each hunk's `newText` with its
 * `oldText`, which yields the pre-conversation text.
 */
function reverseApply(currentText, hunks) {
	let text = currentText;
	let hint = currentText.length;
	const unresolved = [];
	let applied = 0;
	for (let i = hunks.length - 1; i >= 0; i -= 1) {
		const hunk = hunks[i];
		const position = locate(text, hunk.newText, hint);
		if (position === -1) {
			unresolved.push(hunk);
			continue;
		}
		text = text.slice(0, position) + (hunk.oldText === null ? "" : hunk.oldText) + text.slice(position + hunk.newText.length);
		hint = position;
		applied += 1;
	}
	return { baseline: text, unresolved: unresolved, applied: applied };
```

</details>

**依据 3 · 源码核查**：[src/40-reader.js:56-88](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/40-reader.js#L56-L88)

逐页更新version但不比较，且页前检查行数上限。

<details>
<summary>查看原文（33行）</summary>

```text
async function readWholeFile(files, sessionId, path, signal) {
	const parts = [];
	let offset = 1;
	let eof = false;
	let lines = 0;
	let version;
	let absolutePath;
	let pages = 0;
	while (!eof && lines < MAX_LINES && pages < MAX_PAGES) {
		const response = unwrapRemote(await files.read(sessionId, path, { offset: offset, limit: PAGE_LINES }, signal));
		if (!response.ok) throw new Error(failureText(response.error));
		const value = response.value || {};
		const text = typeof value.text === "string" ? value.text : "";
		if (parts.length > 0) {
			const previous = parts[parts.length - 1];
			if (previous.length > 0 && !previous.endsWith("\n") && text.length > 0) parts.push("\n");
		}
		parts.push(text);
		if (typeof value.version === "string") version = value.version;
		if (typeof value.absolutePath === "string") absolutePath = value.absolutePath;
		const pageLines = typeof value.lines === "number" ? value.lines : splitLines(text).length;
		lines += pageLines;
		pages += 1;
		if (value.eof === true || pageLines === 0) eof = true;
		else offset += pageLines;
	}
	return {
		text: parts.join(""),
		lines: lines,
		eof: eof,
		version: version,
		absolutePath: absolutePath,
		truncated: !eof
```

</details>

**依据 4 · 源码核查**：[src/30-diff.js:197-220](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/30-diff.js#L197-L220)

整段回退与degraded判据不同，限制可见性。

<details>
<summary>查看原文（24行）</summary>

```text
	const ops = (hunks || []).length === 0 ? [] : myersOps(baselineLines, currentLines);
	const rows = (hunks || []).length === 0 ? currentLines.map((line, index) => ({ kind: "ctx", oldNo: index + 1, newNo: index + 1, oldIndex: index, newIndex: index })) : ops ? rowsFromOps(ops, baselineLines, currentLines) : wholeReplacementRows(baselineLines, currentLines);

	let added = 0;
	let removed = 0;
	for (const row of rows) {
		if (row.kind === "add") added += 1;
		else if (row.kind === "del") removed += 1;
	}

	const currentSegments = lineSegments(currentText, lang);
	const baselineSegments = reconstruction.unresolved.length > 0 ? lineSegments(reconstruction.baseline, lang) : null;

	return {
		rows: rows,
		added: added,
		removed: removed,
		changed: added + removed,
		currentLines: currentLines,
		baselineLines: baselineLines,
		currentSegments: currentSegments,
		baselineSegments: baselineSegments,
		degraded: reconstruction.unresolved.length > 0,
		unresolved: reconstruction.unresolved.length
```

</details>

#### 缺口

- 重复片段与同后缀文件的错误归因发生范围未量化。
  **影响**：不能宣称当前文本匹配足以避免错误归因。
  **进一步探讨**：可从具有相同newText的两目录样本入手，用已知基线检查是否选错文件或出现位置。
- 宿主Remote是否保证跨页同版本读取未在本组件中定义。
  **影响**：源码中的分页一致性缺口可能由宿主保证缓解，现有材料不能判定。
  **进一步探讨**：可进一步读取绑定版本的workspaceFiles协议和实现，核对版本条件读取是否可用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 安装、持续刷新与退出分别依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

启动是web profile的包和client bundle加载链，主入口lib/index.js的apply为空，目的是给宿主Loader留出服务客户端bundle的条目。package.json声明web客户端模块和侧栏、会话、Remote等注入，运行时还要从宿主得到React。没有运行依赖声明不表示不依赖宿主服务。作者只声称在DSH 0.1.5-rc.1试过，其他版本不能据此推定兼容。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH web与对应客户端服务 | 启动必需 | Loader、React、会话状态及侧栏挂载 | 版本不匹配可能无法挂载，兼容需另行核对 |
| workspaceFiles Remote | 查看文件必需 | 按会话和路径分页读取当前文本 | 界面显示读取失败 |
| 保留的工具meta.diffs | 归因必需 | 生成会话文件集合与还原基线 | 无事件不能显示相应修改 |
| npm安装包或仓库产物 | 启动必需 | 提供预构建lib与patch | 本轮npm查询404，不能承诺npm路径可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户固定包版本并确认web profile | 检查bundle与手工patch没有重复 |
| 加载 | 用户安装后重启web并刷新浏览器 | 新视图只接管有事件的文件 |
| 审查 | 用户从工具结果或清单打开文件 | 核对路径、截断和未定位提示 |
| 退出 | 用户按原安装途径移除并重启 | 原生查看器恢复；手工patch须保留合法数组 |

失败时首选重读和回到Git核查，不能靠刷新弥补已丢失的会话历史。上述步骤描述作者方案及源码可见处理，不记录为已执行。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-24](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/package.json#L1-L24)

包入口和导出明确指向预构建lib。

<details>
<summary>查看原文（24行）</summary>

```text
{
  "name": "dsh-session-diff",
  "version": "0.1.0",
  "description": "Session-scoped diff view for the DSH Web right sidebar: open a file the current conversation changed and it renders in place with git-style added/removed line backgrounds, +/− markers and dual old/new line numbers under syntax colouring, a Changes only / Whole file toggle, a Re-read button, and a companion tab listing every file the session changed.",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": {
      "default": "./lib/index.js"
    },
    "./client": {
      "default": "./lib/client.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "src",
    "scripts",
    "cordis.patch.yml",
    "README.md",
    "LICENSE"
  ],
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1-9](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/lib/index.js#L1-L9)

宿主半部不执行实际业务。

```text
/**
 * Host half of dsh-session-diff.
 *
 * This package contributes browser presentation only. The export exists so the
 * cordis Loader has a host-side row to resolve: the client module registry
 * discovers client bundles by walking live Loader entries, so without this row
 * the package's `./client` bundle would never be served.
 */
export function apply() {}
```

**依据 3 · 源码核查**：[src/80-apply.js:5-12](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/80-apply.js#L5-L12)

服务注入是浏览器加载前提。

```text
/**
 * Browser services this bundle needs before `apply` runs.
 *
 * `uiConversation` and `sessions` are declared because the client context refuses
 * undeclared service reads outright, and `canOpen` — which runs during tab
 * routing, outside any body — needs the conversation's hunks synchronously.
 */
const inject = ["slots", "locale", "sidebarRightTabs", "remote", "remote.workspaceFiles", "uiConversation", "sessions"];
```

**依据 4 · 源码核查**：[src/60-ui-file.js:82-109](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/60-ui-file.js#L82-L109)

Remote缺失和读取失败的状态处理。

<details>
<summary>查看原文（28行）</summary>

```text
	useEffect(() => {
		if (!sessionId || !path) {
			setRead({ status: "error", message: L(t, "noSession", "No session context available.") });
			return undefined;
		}
		if (!filesRemote) {
			setRead({ status: "error", message: L(t, "readFailed", "Failed to read the file") + ": workspaceFiles remote is not available." });
			return undefined;
		}
		let cancelled = false;
		const controller = typeof AbortController === "function" ? new AbortController() : null;
		const timer = setTimeout(function () {
			setRead(function (previous) {
				return previous && previous.status === "ready" ? Object.assign({}, previous, { stale: true }) : { status: "loading" };
			});
			readWholeFile(filesRemote, sessionId, path, controller ? controller.signal : undefined)
				.then(function (result) {
					if (!cancelled) setRead(Object.assign({ status: "ready" }, result, { stale: false }));
				})
				.catch(function (error) {
					if (!cancelled) setRead({ status: "error", message: failureText(error) });
				});
		}, 250);
		return function () {
			cancelled = true;
			clearTimeout(timer);
			if (controller) controller.abort();
		};
```

</details>

**依据 5 · 作者声明**：[README.md:33-84](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/README.md#L33-L84)

作者安装、移除与重复patch约束。

<details>
<summary>查看原文（52行）</summary>

````text
## Install

### For users (recommended — one command)

```bash
dsh plugin --profile web add github:2002XiaoYu/dsh-session-diff   # or file:/path/to.tgz
# restart `dsh web`   (dsh.profile.bundles is read once at boot)
# hard-refresh the browser (Cmd+Shift+R)
```

There is no npm release yet, so install from the repository: `lib/` is committed next to `src/`,
which means a source install runs no build step. The same prebuilt artifact is attached to the
release, if you would rather not clone:

```bash
dsh plugin --profile web add https://github.com/2002XiaoYu/dsh-session-diff/releases/download/v0.1.0/dsh-session-diff-0.1.0.tgz
```

Once the package is published to npm, `dsh plugin --profile web add dsh-session-diff` works in the
same place.

`dsh plugin` adds the package to the profile and, because the package declares
`dsh.bundle.patch`, registers it in `dsh.profile.bundles` as a profile layer. Uninstall is the
same one command, with no configuration editing:

```bash
dsh plugin --profile web remove dsh-session-diff
```

There is no GUI entry point for installing plugins — the Settings → Plugins page lists and
removes installed plugins, it does not add new ones.

### From source (development only)

```bash
npm run build                     # src/*.js -> lib/client.js (node, cross-platform)
bash install.sh                   # copy to ~/.dsh/plugins, symlink, add one patch-layer row
```

This path uses the profile's `cordis.patch.yml` instead of the bundle list, so `patchReload: live`
applies it without restarting `dsh web` — handy while iterating. Two rules come with it:

1. **Never mix the two paths.** If the package is already in `dsh.profile.bundles`, the manual
   patch row would insert the same loader row twice; `install.sh` refuses to run in that case.
2. **`cordis.patch.yml` must always be a top-level YAML array.** When removing the row, leave the
   file as `[]`. A comments-only file parses to `null` and `dsh web` refuses to boot with
   *"must be a top-level YAML array of loader patches"*.

Verify a profile is clean with:

```bash
dsh --profile web --dump-config | grep -c dsh-session-diff    # 0 for an uninstalled profile
````

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 首次、持续使用与失败恢复成本及效果能判断到哪里？

**研究主题**：效果与总成本

#### 完整回答

计量单位应是一轮会话中已知修改集合被正确审查，而非打开一次视图。代码在浏览器本地计算差异，读取通过宿主Remote，没有发现本组件新增付费模型调用。它仍消耗文件传输、浏览器CPU、会话状态和人工核对；无额外付费API不能等价为总成本为零。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 获取包和宿主环境，金额未知 | 固定版本、配置profile、重启刷新 | 作者提供路径，部署耗时未计量 |
| 持续使用 | 分页传输与浏览器差异计算，单位资源未知 | 打开变更、核对归因及必要Git检查 | 每次hunk变化触发延迟读取，工作负载影响成本 |
| 失败恢复 | 重读或回退Git，重复传输未知 | 识别截断、错归因及重建真实基线 | 丢失历史无法仅靠重读恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 缩小审查集合 | 事件按会话聚合而非直接使用Git全工作区 | 漏项率及歧义路径准确率 |
| 降低来回切换 | 在侧栏显示差异、变更列表可打开文件 | 同任务耗时与认知负担变化 |
| 大文件可控 | 分页上限和差异预算限制计算范围 | 真实峰值内存、卡顿及误读成本 |

250ms延迟合并短时间读取变化，但不能据此估算节省百分比。只有把失败样本、人工复核和退出负担纳入同批任务，才可计算合格审查的单位成本。

#### 证据与依据

**依据 1 · 源码核查**：[src/40-reader.js:9-11](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/40-reader.js#L9-L11)

分页与上限约束本地资源取舍。

```text
const PAGE_LINES = 600;
const MAX_LINES = 20000;
const MAX_PAGES = 80;
```

**依据 2 · 源码核查**：[src/60-ui-file.js:91-110](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/60-ui-file.js#L91-L110)

读取采用250ms延迟和取消，决定持续刷新负担。

<details>
<summary>查看原文（20行）</summary>

```text
		let cancelled = false;
		const controller = typeof AbortController === "function" ? new AbortController() : null;
		const timer = setTimeout(function () {
			setRead(function (previous) {
				return previous && previous.status === "ready" ? Object.assign({}, previous, { stale: true }) : { status: "loading" };
			});
			readWholeFile(filesRemote, sessionId, path, controller ? controller.signal : undefined)
				.then(function (result) {
					if (!cancelled) setRead(Object.assign({ status: "ready" }, result, { stale: false }));
				})
				.catch(function (error) {
					if (!cancelled) setRead({ status: "error", message: failureText(error) });
				});
		}, 250);
		return function () {
			cancelled = true;
			clearTimeout(timer);
			if (controller) controller.abort();
		};
	}, [sessionId, path, nonce, hunksKey]);
```

</details>

**依据 3 · 源码核查**：[src/30-diff.js:103-113](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/30-diff.js#L103-L113)

差异计算有预算，不能推断无限规模可用。

<details>
<summary>查看原文（11行）</summary>

```text
function myersOps(a, b) {
	const n = a.length;
	const m = b.length;
	if (n === 0 && m === 0) return [];
	if (n * m > MYERS_MAX_CELLS && Math.max(n, m) > 4000) return null;
	const max = n + m;
	const offset = max;
	const v = new Int32Array(2 * max + 2);
	const trace = [];
	const limit = Math.min(max, MYERS_MAX_D);
	let found = -1;
```

</details>

#### 缺口

- 没有同批任务的耗时、CPU/内存、合格率与人工复核记录。
  **影响**：无法给出单位合格任务成本、节时或ROI。
  **进一步探讨**：可用固定小文件与大文件任务记录端到端审查时间、错漏项和重读次数，并与Git流程对照。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 哪些工程设计值得复用，代价与可靠性边界是什么？

**研究主题**：工程质量与复用

#### 完整回答

可借鉴的是选择性路由、显式依赖声明、读请求取消与有界算法，分别处理插件共存、严格宿主上下文、过期异步回写与浏览器资源边界。store通过兼容多种snapshot访问方式降低接口形态差异的影响，但也增加了静默失败路径；以节点数和最后seq作memo键，在节点原地修订而长度和尾seq不变时存在失效遗漏的条件风险，未复现。

构建器按src文件名排序拼接为宿主lazy-CJS，并核对包名、patch和关键导出标记，这是约束单文件客户端产物的轻量方法。它检查字符串契约不等于检查实际挂载。测试文件包含真实hunk构造、地址往返及基线还原断言，可作为设计证据；本轮未执行它们，不能声称通过。模块片段依赖拼接作用域，inventory对片段的解析报错也不能直接当语法失效。复用时需移植宿主事件格式、Remote和插槽契约，并补对应版本的一致性测试。

#### 证据与依据

**依据 1 · 源码核查**：[src/50-store.js:175-186](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/50-store.js#L175-L186)

memo键以节点数和lastSeq构成，解释潜在失效边界。

<details>
<summary>查看原文（12行）</summary>

```text
function computeFiles(sessionId) {
	const nodes = nodesFor(sessionId);
	const key = nodes ? nodes.length + "@" + lastSeq(nodes) : "none@" + revision;
	const cached = memo.get(sessionId);
	if (cached && cached.key === key) return cached;

	const collected = [];
	if (nodes) collectHunks(nodes, collected, 0);
	const list = groupHunks(collected);
	const next = { key: key, list: list, resolved: !!nodes };
	memo.set(sessionId, next);
	return next;
```

</details>

**依据 2 · 源码核查**：[src/50-store.js:30-48](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/50-store.js#L30-L48)

多种snapshot读取形态与静默回退。

<details>
<summary>查看原文（19行）</summary>

```text
function snapshotValue(source) {
	if (!source) return undefined;
	if (typeof source.get === "function") {
		try {
			return source.get();
		} catch (error) {
			return undefined;
		}
	}
	if (typeof source.getSnapshot === "function") {
		try {
			return source.getSnapshot();
		} catch (error) {
			return undefined;
		}
	}
	if (source && typeof source === "object" && "value" in source) return source.value;
	if (source && typeof source === "object" && "current" in source) return source.current;
	return source;
```

</details>

**依据 3 · 源码核查**：[scripts/build.mjs:24-62](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/scripts/build.mjs#L24-L62)

包名和拼接产物的轻量构建契约。

<details>
<summary>查看原文（39行）</summary>

```text
if (typeof pkg.name !== 'string' || pkg.name.length === 0) throw new Error('package.json has no name');

// The bundle's loader id must be the package name, and the bundle patch must
// resolve that same name from the profile directory. Both are checked here so a
// rename cannot ship a bundle the shell is unable to materialize.
const patchText = readFileSync(join(root, 'cordis.patch.yml'), 'utf8');
if (!patchText.includes(`name: '${pkg.name}'`) && !patchText.includes(`name: "${pkg.name}"`)) {
	throw new Error(`cordis.patch.yml does not register name: '${pkg.name}' — package.json and the patch have drifted apart`);
}

const sources = readdirSync(srcDir)
	.filter((name) => name.endsWith('.js'))
	.sort();

if (sources.length === 0) throw new Error(`no sources found in ${srcDir}`);

const parts = sources.map(
	(name) => `\n\t\t/* ==================== src/${name} ==================== */\n${readFileSync(join(srcDir, name), 'utf8')}`
);
const bundle = parts.join('').replaceAll('__PACKAGE_NAME__', pkg.name);

if (bundle.includes('__PACKAGE_NAME__')) throw new Error('a source still carries the __PACKAGE_NAME__ placeholder');
if (!bundle.includes(`id: "${pkg.name}"`)) throw new Error(`bundle loader id is not the package name (${pkg.name})`);

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, bundle);

// Compile-only check: the bundle touches `window` at run time, never at parse
// time, so constructing the function catches syntax errors without executing it.
try {
	new Function(bundle);
} catch (error) {
	throw new Error(`lib/client.js failed to compile: ${error && error.message}`);
}

// The wrapper contract the loader depends on, verified without a browser.
for (const marker of ['window.__ModuleLoader__.load(', 'exports.apply = apply', 'exports.inject = inject']) {
	if (!bundle.includes(marker) && !bundle.includes(marker.replace('exports.', 'module.exports.'))) {
		throw new Error(`lib/client.js is missing the loader contract marker: ${marker}`);
```

</details>

**依据 4 · 源码核查**：[test/logic.test.mjs:131-145](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/test/logic.test.mjs#L131-L145)

已阅读基线还原、行数和行号断言，不冒充运行通过。

<details>
<summary>查看原文（15行）</summary>

```text
const BASE = ["import 'a';", "", "class SwapPage {", "  int count = 0;", "", "  void init() {", "    count = 1;", "  }", "", "  void dispose() {", "    count = 0;", "  }", "}", ""].join("\n");

console.log("\nreplacement");
{
	const after = BASE.replace("count = 1;", "count = 42;");
	const hunks = computeHunkDiffs(FILE, BASE, after);
	check("single hunk", hunks.length === 1, hunks.length);
	check("oldText carries context", hunks[0].oldText.split("\n").length === 7, hunks[0].oldText.split("\n").length);
	const model = api.buildFileModel(after, hunks, "dart");
	check("baseline reconstructed", model.baselineLines.join("\n") === BASE.replace(/\n$/, ""), model.baselineLines.slice(0, 3));
	check("counts 1/1", model.added === 1 && model.removed === 1, [model.added, model.removed]);
	check("not degraded", model.degraded === false && model.unresolved === 0);
	const changed = model.rows.filter((row) => row.kind !== "ctx");
	check("changed rows carry the right text", changed.length === 2 && changed[0].kind === "del" && model.baselineLines[changed[0].oldIndex] === "    count = 1;" && model.currentLines[changed[1].newIndex] === "    count = 42;", changed);
	check("gutter numbers agree with git", model.rows.find((row) => row.kind === "add").newNo === 7, model.rows.find((row) => row.kind === "add"));
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 如何改进可信归因，并以最小对照支持或推翻该方向？

**研究主题**：新假设与验证

#### 完整回答

提出未验证的“版本绑定会话差异”假设。由Q04的路径后缀与文本位置歧义出发，若宿主在每个工具变更事件里保留规范工作区路径、修改前后版本标识或内容哈希，并允许Remote按同一版本取各页，查看器可把启发式还原升级为可核查的版本链。相对当前实现，新增的是可验证来源一致性，而非换一种染色。

依赖在宿主拥有事件与文件版本接口，插件不能单方面补造旧快照；保留快照会引入存储、权限和删除策略负担。最小研究可使用两个目录同名且含相同片段的文件，以及两会话并发修改的大文件，准备已知旧/新版本。比较当前启发式、版本绑定原型和直接Git基线，记录错归因、未定位、传输与存储开销。若版本绑定仍不能减少歧义，或读取/存储负担超过审查收益，则该设计假设被削弱。没有这样的对照前，不把它计入插件创新或承诺市场需求。

#### 证据与依据

**依据 1 · 源码核查**：[src/40-reader.js:64-88](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/40-reader.js#L64-L88)

当前读取只保留最后version，提供版本链假设的直接起点。

<details>
<summary>查看原文（25行）</summary>

```text
	while (!eof && lines < MAX_LINES && pages < MAX_PAGES) {
		const response = unwrapRemote(await files.read(sessionId, path, { offset: offset, limit: PAGE_LINES }, signal));
		if (!response.ok) throw new Error(failureText(response.error));
		const value = response.value || {};
		const text = typeof value.text === "string" ? value.text : "";
		if (parts.length > 0) {
			const previous = parts[parts.length - 1];
			if (previous.length > 0 && !previous.endsWith("\n") && text.length > 0) parts.push("\n");
		}
		parts.push(text);
		if (typeof value.version === "string") version = value.version;
		if (typeof value.absolutePath === "string") absolutePath = value.absolutePath;
		const pageLines = typeof value.lines === "number" ? value.lines : splitLines(text).length;
		lines += pageLines;
		pages += 1;
		if (value.eof === true || pageLines === 0) eof = true;
		else offset += pageLines;
	}
	return {
		text: parts.join(""),
		lines: lines,
		eof: eof,
		version: version,
		absolutePath: absolutePath,
		truncated: !eof
```

</details>

**依据 2 · 源码核查**：[src/10-util.js:176-184](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/10-util.js#L176-L184)

后缀匹配提示规范路径需求。

```text
/** Hunk paths may be absolute while an address path may be workspace-relative. */
function pathMatches(hunkPath, addressPath) {
	const a = normPath(hunkPath);
	const b = normPath(addressPath);
	if (!a || !b) return false;
	if (a === b) return true;
	if (a.endsWith("/" + b)) return true;
	if (b.endsWith("/" + a)) return true;
	return false;
```

**依据 3 · 源码核查**：[src/30-diff.js:80-96](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/30-diff.js#L80-L96)

当前逆序还原缺少不可变来源证明。

<details>
<summary>查看原文（17行）</summary>

```text
function reverseApply(currentText, hunks) {
	let text = currentText;
	let hint = currentText.length;
	const unresolved = [];
	let applied = 0;
	for (let i = hunks.length - 1; i >= 0; i -= 1) {
		const hunk = hunks[i];
		const position = locate(text, hunk.newText, hint);
		if (position === -1) {
			unresolved.push(hunk);
			continue;
		}
		text = text.slice(0, position) + (hunk.oldText === null ? "" : hunk.oldText) + text.slice(position + hunk.newText.length);
		hint = position;
		applied += 1;
	}
	return { baseline: text, unresolved: unresolved, applied: applied };
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 谁适合受控试用，什么结果应让读者停止依赖它？

**研究主题**：采用判断

#### 完整回答

建议具备Git核查能力、经常审查单个DSH会话修改的开发者，在独立web profile中小范围试用。价值是把已保留的工具变更集中成侧栏入口，条件是仍以Git和真实文件作为最终提交依据。它不适合把会话差异当合规审计、变更完整性证明或自动放行门槛。

试用可从一组已知write/edit修改开始，再加入人工编辑、同后缀路径、重复片段、历史窗口裁剪及大文件。读者可据已知基线判断是否漏项或误归因；发生不带提示的错归因、界面阻塞、原生查看器接管异常或移除后无法恢复时，应停止依赖并回退。此处给出可控试用路径，不安排本轮宿主执行，也不声称已达到长期安装验收。相对优势依据Q03，主要限制依据Q04，成本缺口依据Q06。

#### 证据与依据

**依据 1 · 源码核查**：[src/80-apply.js:20-28](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/80-apply.js#L20-L28)

选择性接管让退出与回退有明确比较路径。

```text
		/** Claim only files this conversation actually changed; everything else keeps the shipped viewer. */
		canOpen: function (address) {
			try {
				const parsed = parseSessionFileAddress(address);
				if (!parsed) return false;
				return SessionDiffStore.hasChanges(parsed.sessionId, parsed.path);
			} catch (error) {
				return false;
			}
```

**依据 2 · 作者声明**：[README.md:99-113](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/README.md#L99-L113)

范围限制直接影响适用人群。

<details>
<summary>查看原文（15行）</summary>

```text
## Scope and limits

- **Current conversation only.** The data is `write` / `edit` results in the session you are
  looking at. Changes made by another conversation, by hand, or before this conversation are not
  shown — use git for that.
- **Very long conversations lose their earliest entries.** The change list is derived from the
  client's retained conversation window; hunks whose nodes have scrolled out of that window are
  no longer listed.
- Files are read up to 20 000 lines in 600-line pages.
- Hunk paths are matched against address paths by suffix (an absolute hunk path against a
  workspace-relative address, and vice versa). A wrong match cannot lie: the hunks' own text must
  still be found in the file, otherwise the view degrades and says so.
- A hunk whose text is no longer present in the file (rewritten outside this conversation) is
  reported as unlocated; the rest still renders.
- Deleted files report a read failure instead of crashing.
```

</details>

**依据 3 · 源码核查**：[src/60-ui-file.js:97-108](https://github.com/2002XiaoYu/dsh-session-diff/blob/f5b20d0001bb9955c4eebe0f2037507769e55197/src/60-ui-file.js#L97-L108)

失败回到error并可取消旧请求，支持受控试用的静态依据。

<details>
<summary>查看原文（12行）</summary>

```text
			readWholeFile(filesRemote, sessionId, path, controller ? controller.signal : undefined)
				.then(function (result) {
					if (!cancelled) setRead(Object.assign({ status: "ready" }, result, { stale: false }));
				})
				.catch(function (error) {
					if (!cancelled) setRead({ status: "error", message: failureText(error) });
				});
		}, 250);
		return function () {
			cancelled = true;
			clearTimeout(timer);
			if (controller) controller.abort();
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
