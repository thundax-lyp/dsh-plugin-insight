# WeKnora 会话归档

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[c62fa4b](https://github.com/AAAlenwow/dsh-weknora-archive/tree/c62fa4b19539f740ae64da009810b1df5c252988)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：将 DSH 会话摘要增量写入 WeKnora，并观察文档解析状态。

> **亮点**：[Q01](#research-q01) 把会话摘要和解析观察串联。

> **主要限制**：[Q03](#research-q03) 未匹配库时 dry run 仍可创建知识库。

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
  - [Q01 · 写入侧能补什么？](#detail-section-11)
  - [Q02 · 怎样区分上传与可检索？](#detail-section-12)
  - [Q03 · dry_run 保证不改远端吗？](#detail-section-13)
  - [Q04 · 如何受控验证归档？](#detail-section-14)
  - [Q05 · 给预览增加零写入判据有帮助吗？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望把历史 DSH 会话用于内部检索的团队可评估归档。

手工写摘要能逐篇查阅，但需要重复搬运。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 归档 | 增量写入摘要 | 依赖写入权限 |
| 解析观察 | 区分成功与未确认 | 超时保持 parsing |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| WeKnora 与限定密钥 | 必需 | 接受摘要 | 不上传 |
| 可读取会话 | 必需 | 提取对话 | 无输入 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 指定已存在的测试库 | 核对范围 |
| 观察 | 预览、上传及回查 | 区分解析 |
| 退出 | 停用工具 | 按远端记录处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 存储资源未知 | 配置耗时未知 | 写权限 |
| 持续 | 解析与可选模型费用未知 | 复核耗时未知 | 观察时间累加 |
| 恢复 | 重试开销未知 | 排查耗时未知 | 需查远端状态 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 摘要归档 | 上传与解析不同 | 检索与质量未验 |

> **思考**：[Q03](#research-q03) 未匹配库时 dry run 仍可创建知识库。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把会话摘要和解析观察串联。

解析结论保留未知 ID 和超时。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 未匹配库时 dry run 仍可创建知识库。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 测试先给已有库 ID 并关闭精炼。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的会话归档、预览副作用和上传后的解析确认。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/archive.js、lib/ingestion.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的会话归档、预览副作用和上传后的解析确认。未执行目标代码或实际宿主验证。
- 下一步：模拟后端逐项核对写调用数

**分析版本**

- **仓库**：[AAAlenwow/dsh-weknora-archive](https://github.com/AAAlenwow/dsh-weknora-archive)
- **版本号**：0.4.0（[固定提交 c62fa4b](https://github.com/AAAlenwow/dsh-weknora-archive/tree/c62fa4b19539f740ae64da009810b1df5c252988)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 验证预览的零写入条件。

模拟后端逐项核对写调用数

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 14 | 2102 | 1613 | 369 | — |
| .md | source | 1 | 199 | — | — | 2817 |
| .mjs | test | 1 | 416 | 385 | 38 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AAAlenwow/dsh-weknora-archive/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AAAlenwow/dsh-weknora-archive/issues?q=is%3Aissue+created%3A2026-10-06T03%3A25%3A48.280Z..2026-11-05T03%3A25%3A48.280Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AAAlenwow/dsh-weknora-archive/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T03%3A25%3A48.280Z..2026-11-05T03%3A25%3A48.280Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：会话归档、预览副作用和上传后的解析确认

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 写入侧能补什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要在知识库复用历史决策的团队，可为项目从会话抽取并总结文本，按标题去重后上传。相对手工复制，批量整理方便；标题只证明同名或同后缀，不能证明内容未变或旧文档解析成功。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-22](https://github.com/AAAlenwow/dsh-weknora-archive/blob/c62fa4b19539f740ae64da009810b1df5c252988/README.md#L13-L22)

归档用途

<details>
<summary>查看原文（10行）</summary>

```text
## 功能

| 工具 | 说明 |
|---|---|
| `weknora_archive_auto` | **全量自动归档**：扫描本机所有 DSH 项目，把每个项目的会话增量归档进各自的知识库（按项目名自动匹配/新建），已归档自动跳过，可重复执行；单个项目失败不影响其余项目。设计为被定时任务调用，实现无人值守归档；`project_keyword` 可选过滤，`dry_run` 预览 |
| `weknora_archive_visualize` | 只读：把最近一次（或指定）归档清单渲染成自包含的本地 three.js「知识入库星图」HTML 报告，含真实解析状态。不上传、不改归档状态 |
| `weknora_archive_session` | 归档某个项目的 DSH 会话：定位会话目录 → 解压会话存储 → 提取对话 → 总结 → 按标题去重后上传；知识库不存在时按项目名自动新建；首次归档附 `00_项目总览.md`；支持 `dry_run` 预览 |
| `weknora_archive_status` | 只读：列出本机会话项目目录与会话数，查看目标知识库内已归档文档与解析状态 |
| `weknora_archive_list_knowledge_bases` | 只读：列出该凭据可见的知识库 |
| `weknora_archive_create_knowledge_base` | 新建知识库（注意：新建库可能需在 WeKnora 端配置 embedding 模型，否则文档解析失败） |
```

</details>

**依据 2 · 源码核查**：[lib/archive.js:87-114](https://github.com/AAAlenwow/dsh-weknora-archive/blob/c62fa4b19539f740ae64da009810b1df5c252988/lib/archive.js#L87-L114)

标题去重和读会话

<details>
<summary>查看原文（28行）</summary>

```text
  const existing = await client.listKnowledge(knowledgeBaseId);
  const existingTitles = new Set(existing.map((doc) => doc?.title ?? doc?.knowledge_title ?? ''));
  // WeKnora titles a document after the uploaded FILE, so the library shows
  // `data_xxx.md` while the intended title is `会话总结: data_xxx`. Compare on
  // the session key so both spellings deduplicate.
  const isArchived = (title) => {
    if (existingTitles.has(title)) return true;
    const key = title.replace(/^会话总结: /, '').replace(/\.md$/i, '');
    return [...existingTitles].some((existingTitle) =>
      existingTitle.replace(/\.md$/i, '').endsWith(key));
  };

  const uploaded = [];
  const skipped = [];
  const isFirstRun = existingTitles.size === 0;
  for (const session of sessions) {
    const title = sessionDocTitle(projectName, session.sessionId);
    if (isArchived(title)) {
      skipped.push(session.sessionId);
      continue;
    }
    const text = readSessionText(session.filePath);
    if (text.messages.length === 0) {
      skipped.push(session.sessionId);
      continue;
    }
    const summary = summarizeSession(text, { projectName, maxChars: config.maxSummaryChars });
    let markdown = summary.markdown;
```

</details>

**依据 3 · 源码核查**：[lib/archive.js:130-143](https://github.com/AAAlenwow/dsh-weknora-archive/blob/c62fa4b19539f740ae64da009810b1df5c252988/lib/archive.js#L130-L143)

上传和冲突处理

<details>
<summary>查看原文（14行）</summary>

```text
    const filename = `${sessionDocTitle(projectName, session.sessionId).replace(/^会话总结: /, '')}.md`;
    try {
      const body = await client.uploadKnowledge({ knowledgeBaseId, title, content: markdown, filename, refined });
      uploaded.push({ sessionId: session.sessionId, title, filename, chars: markdown.length, refined, knowledgeId: knowledgeIdOf(body) });
    } catch (err) {
      // WeKnora answers 409 duplicate_file when a same-named document already
      // exists. The pre-upload title check misses it whenever a previous run
      // uploaded before its document became listable, so treat it as a skip
      // rather than aborting the whole pass.
      if (err?.status === 409) {
        skipped.push(session.sessionId);
        continue;
      }
      throw err;
```

</details>

#### 缺口

- 未验证真实会话质量
  **影响**：不能断言摘要有用
  **进一步探讨**：比较合成会话的检索与摘要

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 怎样区分上传与可检索？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

上传取得文档 ID 后，逐篇轮询。明确 completed 才记成功，失败状态保留错误，缺 ID 或超时均为 parsing。每篇观察窗口分别计算，因此多文档总时长可能累加。

#### 证据与依据

**依据 1 · 源码核查**：[lib/archive.js:168-190](https://github.com/AAAlenwow/dsh-weknora-archive/blob/c62fa4b19539f740ae64da009810b1df5c252988/lib/archive.js#L168-L190)

上传后观察并生成清单

<details>
<summary>查看原文（23行）</summary>

```text
  // Observe real parse outcomes for everything uploaded this run. "uploaded"
  // alone is NOT "ingested": until WeKnora reports parse_status=completed the
  // document may still fail. Unknown ids / timeouts stay non-success (parsing).
  if (!options.dryRun && (uploaded.length > 0 || overviewDoc)) {
    const uploadCount = uploaded.length;
    const reconciled = await reconcileDocuments(client, overviewDoc ? [...uploaded, overviewDoc] : uploaded, {
      timeoutMs: config.parseObservationMs,
      intervalMs: config.parsePollMs,
    });
    uploaded.length = 0;
    uploaded.push(...reconciled.slice(0, uploadCount));
    if (overviewDoc) overviewDoc = reconciled[uploadCount];
  }

  log?.info(`dsh-weknora-archive: ${projectName} → kb ${knowledgeBaseId}: ${uploaded.length} uploaded, ${skipped.length} skipped`);
  const manifest = createManifest({ dryRun: Boolean(options.dryRun) });
  addManifestProject(manifest, {
    project: projectName,
    knowledgeBaseId,
    uploaded,
    extraDocuments: overviewDoc ? [overviewDoc] : [],
    skippedCount: skipped.length,
  });
```

</details>

**依据 2 · 源码核查**：[lib/ingestion.js:13-50](https://github.com/AAAlenwow/dsh-weknora-archive/blob/c62fa4b19539f740ae64da009810b1df5c252988/lib/ingestion.js#L13-L50)

状态、超时及串行等待

<details>
<summary>查看原文（38行）</summary>

```text
export async function waitForKnowledge(client, knowledgeId, {
  timeoutMs = 60_000,
  intervalMs = 1_000,
  sleep,
  now = () => Date.now(),
} = {}) {
  if (!knowledgeId || typeof client.getKnowledge !== 'function') {
    return { status: 'parsing', error: 'Upload returned no document id; refresh to reconcile parse status.' };
  }
  const deadline = now() + timeoutMs;
  let lastError = null;
  while (now() < deadline) {
    try {
      const doc = unwrapKnowledge(await client.getKnowledge(knowledgeId));
      const status = String(doc.parse_status ?? doc.status ?? 'parsing').toLowerCase();
      if (status === 'completed') return { status, error: null };
      if (['failed', 'error'].includes(status)) {
        return { status: 'failed', error: String(doc.parse_error ?? doc.error_message ?? 'WeKnora parsing failed').slice(0, 300) };
      }
    } catch (error) {
      lastError = String(error?.message ?? error).split('X-API-Key')[0].slice(0, 300);
    }
    await delay(intervalMs, sleep);
  }
  return { status: 'parsing', error: lastError ?? 'Parsing has not completed before the observation timeout.' };
}

export async function reconcileDocuments(client, documents, options = {}) {
  const reconciled = [];
  for (const document of documents) {
    if (document.dryRun) {
      reconciled.push(document);
      continue;
    }
    const result = await waitForKnowledge(client, document.knowledgeId, options);
    reconciled.push({ ...document, parseStatus: result.status, parseError: result.error });
  }
  return reconciled;
```

</details>

#### 缺口

- 未运行后端解析
  **影响**：完成与实际检索未核
  **进一步探讨**：检查可检索与解析分别记录

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · dry_run 保证不改远端吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

它跳过上传和精炼，但此前仍先按项目找知识库，没匹配时直接 createKnowledgeBase，未检查 dryRun。因此预览在未指定库且无同名库时可能新建远端库。正常上传还会外发摘要，启用独立模型精炼会先送到配置端点。

#### 证据与依据

**依据 1 · 源码核查**：[lib/archive.js:71-85](https://github.com/AAAlenwow/dsh-weknora-archive/blob/c62fa4b19539f740ae64da009810b1df5c252988/lib/archive.js#L71-L85)

解析目标时无 dryRun 判断

<details>
<summary>查看原文（15行）</summary>

```text
  // Resolve target knowledge base (explicit id → config default → match by name → create).
  let knowledgeBaseId = options.knowledgeBaseId || config.knowledgeBaseId;
  let created = false;
  if (!knowledgeBaseId) {
    const bases = await client.listKnowledgeBases();
    const matched = bases.find((kb) => kb?.name === projectName);
    if (matched) {
      knowledgeBaseId = matched.id;
    } else {
      const result = await client.createKnowledgeBase(projectName, `DSH session archive for ${projectDir} (by dsh-weknora-archive)`, config.embeddingModelId);
      knowledgeBaseId = result?.id ?? result?.data?.id ?? '';
      created = true;
    }
  }
  if (!knowledgeBaseId) return { ok: false, error: 'could not resolve or create a target knowledge base' };
```

</details>

**依据 2 · 源码核查**：[lib/archive.js:113-133](https://github.com/AAAlenwow/dsh-weknora-archive/blob/c62fa4b19539f740ae64da009810b1df5c252988/lib/archive.js#L113-L133)

预览只绕过精炼与上传

<details>
<summary>查看原文（21行）</summary>

```text
    const summary = summarizeSession(text, { projectName, maxChars: config.maxSummaryChars });
    let markdown = summary.markdown;
    let refined = false;
    if (config.llmBaseUrl && config.llmApiKey && config.llmModel && !options.dryRun) {
      try {
        markdown = await refineSummaryWithLlm(config, markdown);
        refined = markdown !== summary.markdown;
      } catch (err) {
        // Refinement is best-effort: never fail (or leak secrets over) an
        // archive because the optional model call did. One redacted line.
        log?.warn?.(`dsh-weknora-archive: LLM refine failed for ${session.sessionId}, keeping heuristic summary (${String(err?.message ?? err).split('X-API-Key')[0]})`);
      }
    }
    if (options.dryRun) {
      uploaded.push({ sessionId: session.sessionId, title, dryRun: true, chars: summary.markdown.length });
      continue;
    }
    const filename = `${sessionDocTitle(projectName, session.sessionId).replace(/^会话总结: /, '')}.md`;
    try {
      const body = await client.uploadKnowledge({ knowledgeBaseId, title, content: markdown, filename, refined });
      uploaded.push({ sessionId: session.sessionId, title, filename, chars: markdown.length, refined, knowledgeId: knowledgeIdOf(body) });
```

</details>

**依据 3 · 作者声明**：[README.md:53-55](https://github.com/AAAlenwow/dsh-weknora-archive/blob/c62fa4b19539f740ae64da009810b1df5c252988/README.md#L53-L55)

模型精炼外发说明

```text
| `parsePollMs` | `WEKNORA_ARCHIVE_PARSE_POLL_MS` | 解析状态轮询间隔（默认 1000） |

> **LLM 精炼默认关闭**：三个 `llm*` 字段必须同时提供才开启。开启后，归档时把**启发式总结文本**（非会话原文）发给该端点做一次精炼；任何失败都自动回退启发式总结，绝不影响归档本身。注意这意味着总结文本会发往你配置的模型服务商。
```

#### 缺口

- 未做远端调用实测
  **影响**：不能判断后端会怎样响应
  **进一步探讨**：用模拟客户端计数创建及上传

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何受控验证归档？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先选隔离会话和已存在的测试库，指定明确 ID，关闭精炼，检查 dry run 数目及真实归档状态。不要用无目标库的预览验证只读性。发生失败先查远端文档及解析，不盲目重发。访问 key、库权限和计算开销未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-55](https://github.com/AAAlenwow/dsh-weknora-archive/blob/c62fa4b19539f740ae64da009810b1df5c252988/README.md#L35-L55)

服务、写入密钥与参数

<details>
<summary>查看原文（21行）</summary>

```text
走 DSH 官方插件配置机制：插件 bundle 自带 `cordis.patch.yml`，默认从环境变量读取（**key 不落地、不入库**）：

| 字段 | 环境变量 | 说明 |
|---|---|---|
| `baseUrl` | `WEKNORA_ARCHIVE_BASE_URL` | WeKnora 部署地址（裸域名或 `/api/v1` 结尾均可），如 `http://weknora.example.com` |
| `apiKey` | `WEKNORA_ARCHIVE_API_KEY` | 具备写入/摄取能力的 scoped API key |
| `knowledgeBaseId` | `WEKNORA_ARCHIVE_KB_ID` | 可选：固定目标库；缺省按项目名自动匹配/新建 |
| `sessionsDir` | `WEKNORA_ARCHIVE_SESSIONS_DIR` | 可选：会话存储根目录；缺省自动探测 `<harness>/sessions` |
| `maxSummaryChars` | `WEKNORA_ARCHIVE_MAX_SUMMARY_CHARS` | 单篇总结上限（默认 8000） |
| `llmBaseUrl` | `WEKNORA_ARCHIVE_LLM_BASE_URL` | 可选：OpenAI 兼容端点（如 `https://api.minimax.chat/v1`），用于总结精炼 |
| `llmApiKey` | `WEKNORA_ARCHIVE_LLM_API_KEY` | 可选：该端点的 API key |
| `llmModel` | `WEKNORA_ARCHIVE_LLM_MODEL` | 可选：模型名，如 `MiniMax-M2` |
| `llmTimeoutMs` | `WEKNORA_ARCHIVE_LLM_TIMEOUT_MS` | 可选：精炼调用超时（默认 60000） |
| `embeddingModelId` | `WEKNORA_ARCHIVE_EMBEDDING_MODEL_ID` | **强烈建议**：自动新建知识库时携带的 embedding 模型 id——不设则新库所有文档解析失败（parse_status=failed） |
| `reportDir` | `WEKNORA_ARCHIVE_REPORT_DIR` | 可选：归档清单与报告目录（默认 `~/.dsh/plugin-data/dsh-weknora-archive/reports`） |
| `visualization` | `WEKNORA_ARCHIVE_VISUALIZATION` | 设 `false` 完全跳过清单/报告生成（归档本身不受影响） |
| `motion` | `WEKNORA_ARCHIVE_MOTION` | 设 `false` 生成静态星图（系统 reduced-motion 也会自动转静态） |
| `parseObservationMs` | `WEKNORA_ARCHIVE_PARSE_OBSERVATION_MS` | 上传后观察解析状态的时间窗（默认 60000；未完成记 `parsing`，绝不高报） |
| `parsePollMs` | `WEKNORA_ARCHIVE_PARSE_POLL_MS` | 解析状态轮询间隔（默认 1000） |

> **LLM 精炼默认关闭**：三个 `llm*` 字段必须同时提供才开启。开启后，归档时把**启发式总结文本**（非会话原文）发给该端点做一次精炼；任何失败都自动回退启发式总结，绝不影响归档本身。注意这意味着总结文本会发往你配置的模型服务商。
```

</details>

**依据 2 · 源码核查**：[lib/archive.js:71-87](https://github.com/AAAlenwow/dsh-weknora-archive/blob/c62fa4b19539f740ae64da009810b1df5c252988/lib/archive.js#L71-L87)

固定目标可跳过创建

<details>
<summary>查看原文（17行）</summary>

```text
  // Resolve target knowledge base (explicit id → config default → match by name → create).
  let knowledgeBaseId = options.knowledgeBaseId || config.knowledgeBaseId;
  let created = false;
  if (!knowledgeBaseId) {
    const bases = await client.listKnowledgeBases();
    const matched = bases.find((kb) => kb?.name === projectName);
    if (matched) {
      knowledgeBaseId = matched.id;
    } else {
      const result = await client.createKnowledgeBase(projectName, `DSH session archive for ${projectDir} (by dsh-weknora-archive)`, config.embeddingModelId);
      knowledgeBaseId = result?.id ?? result?.data?.id ?? '';
      created = true;
    }
  }
  if (!knowledgeBaseId) return { ok: false, error: 'could not resolve or create a target knowledge base' };

  const existing = await client.listKnowledge(knowledgeBaseId);
```

</details>

**依据 3 · 源码核查**：[lib/archive.js:168-179](https://github.com/AAAlenwow/dsh-weknora-archive/blob/c62fa4b19539f740ae64da009810b1df5c252988/lib/archive.js#L168-L179)

解析结果

<details>
<summary>查看原文（12行）</summary>

```text
  // Observe real parse outcomes for everything uploaded this run. "uploaded"
  // alone is NOT "ingested": until WeKnora reports parse_status=completed the
  // document may still fail. Unknown ids / timeouts stay non-success (parsing).
  if (!options.dryRun && (uploaded.length > 0 || overviewDoc)) {
    const uploadCount = uploaded.length;
    const reconciled = await reconcileDocuments(client, overviewDoc ? [...uploaded, overviewDoc] : uploaded, {
      timeoutMs: config.parseObservationMs,
      intervalMs: config.parsePollMs,
    });
    uploaded.length = 0;
    uploaded.push(...reconciled.slice(0, uploadCount));
    if (overviewDoc) overviewDoc = reconciled[uploadCount];
```

</details>

#### 缺口

- 未运行真实 DSH 和 WeKnora
  **影响**：稳定性未验
  **进一步探讨**：用测试库核对预览与退出

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 给预览增加零写入判据有帮助吗？

**研究主题**：新假设与验证

#### 完整回答

对有库、无库、目标不明确三组，用记录调用的后端比较现状和只列预期目标的预览。如果仍有写请求，或无法让用户判断将建立哪个库，就不通过验收。

#### 证据与依据

**依据 1 · 源码核查**：[lib/archive.js:71-85](https://github.com/AAAlenwow/dsh-weknora-archive/blob/c62fa4b19539f740ae64da009810b1df5c252988/lib/archive.js#L71-L85)

创建先于预览分支

<details>
<summary>查看原文（15行）</summary>

```text
  // Resolve target knowledge base (explicit id → config default → match by name → create).
  let knowledgeBaseId = options.knowledgeBaseId || config.knowledgeBaseId;
  let created = false;
  if (!knowledgeBaseId) {
    const bases = await client.listKnowledgeBases();
    const matched = bases.find((kb) => kb?.name === projectName);
    if (matched) {
      knowledgeBaseId = matched.id;
    } else {
      const result = await client.createKnowledgeBase(projectName, `DSH session archive for ${projectDir} (by dsh-weknora-archive)`, config.embeddingModelId);
      knowledgeBaseId = result?.id ?? result?.data?.id ?? '';
      created = true;
    }
  }
  if (!knowledgeBaseId) return { ok: false, error: 'could not resolve or create a target knowledge base' };
```

</details>

**依据 2 · 源码核查**：[lib/archive.js:126-133](https://github.com/AAAlenwow/dsh-weknora-archive/blob/c62fa4b19539f740ae64da009810b1df5c252988/lib/archive.js#L126-L133)

上传分支区分

```text
    if (options.dryRun) {
      uploaded.push({ sessionId: session.sessionId, title, dryRun: true, chars: summary.markdown.length });
      continue;
    }
    const filename = `${sessionDocTitle(projectName, session.sessionId).replace(/^会话总结: /, '')}.md`;
    try {
      const body = await client.uploadKnowledge({ knowledgeBaseId, title, content: markdown, filename, refined });
      uploaded.push({ sessionId: session.sessionId, title, filename, chars: markdown.length, refined, knowledgeId: knowledgeIdOf(body) });
```

#### 缺口

- 未实现修正
  **影响**：仍为验证设想
  **进一步探讨**：模拟后端逐项核对写调用数

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
