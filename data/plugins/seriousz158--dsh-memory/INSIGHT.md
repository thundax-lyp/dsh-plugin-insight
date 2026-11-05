# dsh-git-memory

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[f7b0375](https://github.com/seriousz158/dsh-memory/tree/f7b03757f8bf546d3c007f8e9a074a847b681d3d)

<!-- BEGIN META -->
[![GitHub ★ 169](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=169&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/seriousz158/dsh-memory) [![npm 30d 1,002](https://img.shields.io/static/v1?label=npm+30d&message=1%2C002&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-git-memory) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-git-memory)
<!-- END META -->

> **功能**：为 DSH 提供本地 Git 长期记忆、有限检索与可恢复的记忆管理。

> **亮点**：[Q01](#research-q01) 将 Git 文档的摘要、检索与开关连接到宿主。

> **主要限制**：[Q02](#research-q02) 清理保留 Git 恢复历史，异常恢复仍需验收。

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
  - [Q01 · 如何读取和挂载记忆？](#detail-section-11)
  - [Q02 · 清理和同步能恢复什么？](#detail-section-12)
  - [Q03 · 怎样在独立仓库试用？](#detail-section-13)
  - [Q04 · 怎样避免把重置理解成擦除？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在 DSH 复用版本化项目知识的开发者。

手工维护 Markdown 和 Git，并主动选择文件放入会话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 本地记忆 | 查询和注入历史知识 | 受开关、数据和范围限制 |
| Git 恢复 | 保存重置前记忆 | 不能用于隐私擦除 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH 和本地 Git | 必需 | 加载工具及记忆 | 用手工文档 |
| Python 与现有 dsh | 可选同步必需 | 运行同步辅助 | 保留只读模式 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户创建临时仓库 | 只放合成资料 |
| 核对 | 操作者查命中、开关及历史 | 区分已清空和可恢复 |
| 退出 | 禁用测试插件 | 核对仓库与备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 磁盘与宿主资源未知 | 配置仓库 | 未实测 |
| 持续 | 索引和同步资源 | 复核记忆及版本 | 费用未知 |
| 恢复 | 备份占用未知 | 核对提交及残留 | 需要演练 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 检索 | 宿主调用与有限结果 | 真实召回 |
| 恢复 | Git 检查点与条件写入 | 故障可恢复程度 |

> **思考**：[Q02](#research-q02) 清理保留 Git 恢复历史，异常恢复仍需验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将 Git 文档的摘要、检索与开关连接到宿主。

[Q02](#research-q02) Git 引用比较与索引补偿分开。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 清理保留 Git 恢复历史，异常恢复仍需验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在可丢弃仓库先试只读。[Q02](#research-q02) 需要重置时验证恢复点。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定分发、接线和 Git 管理路径已静态核查，未运行。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/dsh-git-memory/lib/index.js、packages/dsh-git-memory/lib/sync-transaction.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根分发和代表性宿主逻辑，未运行插件。
- 下一步：验证查询、停用、预览、清理及回滚。

**分析版本**

- **仓库**：[seriousz158/dsh-memory](https://github.com/seriousz158/dsh-memory)
- **版本号**：0.10.0（[固定提交 f7b0375](https://github.com/seriousz158/dsh-memory/tree/f7b03757f8bf546d3c007f8e9a074a847b681d3d)）
- **版本日期**：2026-10-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 将重置、恢复点与潜在备份分开提示。

验证查询、停用、预览、清理及回滚。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 11 | 1906 | — | — | 11829 |
| .js | source | 19 | 7028 | 6007 | 707 | — |
| .mjs | test | 18 | 2702 | 2340 | 180 | — |
| .mjs | source | 4 | 723 | 676 | 8 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/seriousz158/dsh-memory/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Git 记忆如何读写和恢复，边界在哪里？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 如何读取和挂载记忆？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

反复维护项目历史的用户可将文档放入独立 Git 记忆库。根包直接导出对应 bundle 实现。宿主注册搜索与上下文工具，执行前检查开关并限制结果数；无可读设置时不提供内容。systemPrompt 刷新以代际校验防止较早结果覆盖新设置或恢复已禁用段落。相对手工读取 README 或历史记录，插件把有限摘要和检索接入模型。作者把摘要标作不可信，仍需要核实引用是否相关。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:35-47](https://github.com/seriousz158/dsh-memory/blob/f7b03757f8bf546d3c007f8e9a074a847b681d3d/package.json#L35-L47)

根分发导出实际实现

<details>
<summary>查看原文（13行）</summary>

```text
  "main": "./packages/dsh-git-memory/lib/index.js",
  "exports": {
    ".": "./packages/dsh-git-memory/lib/index.js",
    "./client": "./packages/dsh-git-memory/client/client.js",
    "./cordis.patch.yml": "./packages/dsh-git-memory/cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "LICENSE",
    "README.md",
    "packages/dsh-git-memory/lib",
    "packages/dsh-git-memory/client",
    "packages/dsh-git-memory/cordis.patch.yml"
```

</details>

**依据 2 · 源码核查**：[packages/dsh-git-memory/lib/index.js:1604-1636](https://github.com/seriousz158/dsh-memory/blob/f7b03757f8bf546d3c007f8e9a074a847b681d3d/packages/dsh-git-memory/lib/index.js#L1604-L1636)

开关与搜索工具

<details>
<summary>查看原文（33行）</summary>

```text
export function apply(ctx, config) {
  const settings = new MemorySettingsBridge();
  const source = createSettingsSource(ctx, config);
  settings.bind(source);
  // Fail closed: an unreadable setting never injects memory or serves tools.
  const isEnabled = () => {
    try { return source.get().enabled === true; } catch { return false; }
  };
  const promptRefreshers = new Set();
  const refreshPrompts = () => { for (const refresh of [...promptRefreshers]) refresh(); };
  const stopWatching = source.watch(refreshPrompts);
  ctx.effect(() => () => {
    stopWatching();
    source.dispose();
    settings.unbind(source);
  }, "dsh-memory: settings cleanup");
  new MemoryService(ctx, { settings });
  const toolRepository = new MemoryRepository();
  ctx.tools.register(defineTool({
    name: "memory_search",
    description: "Search the DPSK long-term memory repository (read-only). Returns ranked records with path, id, type, snippet and citation. Use task keywords as the query before exploring unfamiliar project history.",
    parameters: {
      query: { type: "string", required: true, description: "Search keywords." },
      limit: { type: "integer", description: `Max results, 1-${TOOL_LIMIT_MAX}, default 10.` },
      scope: { type: "string", enum: [...TOOL_SCOPES], description: "active (default), all, or archive." },
    },
    output: { schema: { type: "string" }, render: (_args, value) => [{ type: "text", text: value }] },
    execute: async (args) => {
      if (!isEnabled()) return JSON.stringify({ error: "memory-disabled" });
      const result = await toolRepository.search({ query: String(args.query ?? ""), limit: clampToolLimit(args.limit, 10), scope: args.scope });
      return JSON.stringify(result.ok ? toolSearchView(result.value) : { error: result.error?.code ?? "search-failed" });
    },
    timeoutMs: 10000,
```

</details>

**依据 3 · 源码核查**：[packages/dsh-git-memory/lib/index.js:1638-1676](https://github.com/seriousz158/dsh-memory/blob/f7b03757f8bf546d3c007f8e9a074a847b681d3d/packages/dsh-git-memory/lib/index.js#L1638-L1676)

上下文与摘要刷新

<details>
<summary>查看原文（39行）</summary>

```text
  ctx.tools.register(defineTool({
    name: "memory_context",
    description: "Read bounded DPSK long-term memory records (read-only); records host-side usage metadata. Pass a query to focus selection.",
    parameters: {
      query: { type: "string", description: "Optional focus keywords." },
      limit: { type: "integer", description: `1-${TOOL_LIMIT_MAX} records, default 10.` },
      scope: { type: "string", enum: [...TOOL_SCOPES], description: "active (default), all, or archive." },
    },
    output: { schema: { type: "string" }, render: (_args, value) => [{ type: "text", text: value }] },
    execute: async (args) => {
      // Disabled memory is invisible: no reads and no usage bookkeeping.
      if (!isEnabled()) return JSON.stringify({ error: "memory-disabled" });
      const request = { limit: clampToolLimit(args.limit, 10) };
      if (typeof args.query === "string" && args.query.trim().length > 0) request.query = args.query;
      if (args.scope !== undefined) request.scope = args.scope;
      const result = await toolRepository.context(request);
      return JSON.stringify(result.ok ? toolContextView(result.value) : { error: result.error?.code ?? "context-failed" });
    },
    timeoutMs: 10000,
  }));
  ctx.inject(["systemPrompt"], (promptCtx) => {
    const summaryState = { last: null };
    let disposeSection = null;
    let generation = 0;
    let closed = false;
    const removeSection = () => { const dispose = disposeSection; disposeSection = null; dispose?.(); };
    // Every refresh takes a new generation; only the newest build may swap
    // its section in, and the swap happens in one step so overlapping
    // rebuilds can neither register a duplicate nor resurrect a disabled one.
    const refresh = () => {
      const current = ++generation;
      if (closed || !isEnabled() || typeof promptCtx.systemPrompt?.section !== "function") {
        removeSection();
        return;
      }
      void buildMemorySectionText(summaryState).then((text) => {
        if (closed || current !== generation || !isEnabled()) return;
        removeSection();
        disposeSection = promptCtx.systemPrompt.section({ name: "memory", order: 50, text, interpolate: false });
```

</details>

**依据 4 · 作者声明**：[README.md:44-55](https://github.com/seriousz158/dsh-memory/blob/f7b03757f8bf546d3c007f8e9a074a847b681d3d/README.md#L44-L55)

作者限定检索和摘要

<details>
<summary>查看原文（12行）</summary>

```text
### Read path

- When enabled, a bounded and explicitly untrusted `summary.md` snapshot is
  available to the model (12 KiB maximum).
- `memory.search()` and `memory.context()` provide local, bounded retrieval
  with source citations and usage-aware deterministic ordering. Retrieval is
  hybrid: a derived SQLite index (FTS5 trigram + CJK-bigram/word terms, stored
  at `.sync/search-index.sqlite` with restrictive permissions) is fused with
  lexical scoring and exact-substring precedence, and transparently falls back
  to a pure scan when the index is missing, stale, or corrupt.
- Read usage is stored as private metadata in `.sync/usage.json`; transcripts,
  prompts, credentials, and memory content are not written to journals.
```

</details>

#### 缺口

- 未实际运行索引、提示或多会话
  **影响**：无法判断索引召回与真实任务效益
  **进一步探讨**：在临时仓库用合成资料验证命中、开关和慢刷新

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 清理和同步能恢复什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

清理要求确认字串并取得操作锁，先为目标路径准备恢复提交或复用现有 HEAD，再核对暂存内容，替换索引并以旧 HEAD 为条件更新引用。异常尝试恢复索引和暂存。保留历史意味着清理当前状态不等于隐私擦除。预览应用另按 run id 调用宿主同步工具，移除预览为尽力操作。可恢复性仍取决于实际故障、Git 引用和备份。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-git-memory/lib/index.js:1287-1307](https://github.com/seriousz158/dsh-memory/blob/f7b03757f8bf546d3c007f8e9a074a847b681d3d/packages/dsh-git-memory/lib/index.js#L1287-L1307)

预览应用与锁

<details>
<summary>查看原文（21行）</summary>

```text
  async applyPreview(request) {
    if (request?.previewId === undefined || typeof request.previewId !== "string" || request.previewId.length === 0) {
      return failure("preview-invalid-request");
    }
    let root;
    try { root = await this.inspect(); } catch (error) { return failure(error?.memoryCode ?? "repo-unavailable"); }
    const operationId = operationRunId("preview-apply");
    let lockAcquired = false;
    try {
      await acquireOperationLock(root, { operation: "preview-apply", runId: operationId });
      lockAcquired = true;
      const startedAt = new Date().toISOString();
      const value = await invokeSyncApply("apply-preview", {
        root,
        "run-id": request.previewId,
        "operation-name": "preview",
        "started-at": startedAt,
      });
      // Consume the preview and journal the apply under the preview id so the
      // run is auditable and rollbackable like any other sync.
      await invokeSyncApply("remove-preview", { root, "run-id": request.previewId }).catch(() => null);
```

</details>

**依据 2 · 源码核查**：[packages/dsh-git-memory/lib/index.js:1373-1408](https://github.com/seriousz158/dsh-memory/blob/f7b03757f8bf546d3c007f8e9a074a847b681d3d/packages/dsh-git-memory/lib/index.js#L1373-L1408)

确认、锁与恢复点

<details>
<summary>查看原文（36行）</summary>

```text
  async clear(request) {
    if (request?.confirmation !== "DELETE_MEMORY") return failure("clear-failed");
    let root;
    try { root = await this.inspect(); } catch (error) { return failure(error?.memoryCode ?? "repo-unavailable"); }
    const operationId = operationRunId("clear");
    let lockAcquired = false;
    try {
      await acquireOperationLock(root, { operation: "clear", runId: operationId });
      lockAcquired = true;
      const active = {
        schema_version: 1,
        run_id: operationId,
        operation: "clear",
        status: "running",
        phase: "staging",
        pid: process.pid,
        started_at: new Date().toISOString(),
      };
      await writeActiveRun(root, active);
      const before = await this.status();
      if (!before.ok) return before;
      if (before.value.empty) return success({ alreadyEmpty: true, clearedFileCount: 0, recoveryCommit: null, clearCommit: null });
      let recoveryCommit = null;
      let clearCommit = null;
      let head = null;
      let stage;
      let indexSnapshot;
      let recoveryEntries;
      try {
        recoveryEntries = (await safeClear(root, "snapshot-live")).entries;
        head = (await this.git(["rev-parse", "HEAD"])).stdout.trim();
        recoveryCommit = await this.buildTargetCommit(head, recoveryEntries, "DPSK memory recovery checkpoint");
        if (recoveryCommit === null) recoveryCommit = head;
      } catch (error) {
        return failure(error?.memoryCode ?? "checkpoint-failed");
      }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-git-memory/lib/index.js:1409-1428](https://github.com/seriousz158/dsh-memory/blob/f7b03757f8bf546d3c007f8e9a074a847b681d3d/packages/dsh-git-memory/lib/index.js#L1409-L1428)

校验和替换引用、补偿

<details>
<summary>查看原文（20行）</summary>

```text
      active.phase = "validating";
      await writeActiveRun(root, active);
      try {
        root = await this.inspect();
        stage = await safeClear(root, "stage");
        const stagedEntries = (await safeClear(root, "snapshot", stage.token)).entries;
        if (!sameEntries(recoveryEntries, stagedEntries)) throw clearError();
        await safeClear(root, "verify");
        const emptyObject = (await this.git(["hash-object", "-w", "/dev/null"])).stdout.trim();
        clearCommit = await this.buildTargetCommit(recoveryCommit, [{ path: "summary.md", mode: "100644", object: emptyObject }], "DPSK memory cleared");
        if (clearCommit === null) throw clearError();
        indexSnapshot = await this.snapshotIndex();
        active.phase = "applying";
        await writeActiveRun(root, active);
        await this.replaceCurrentIndex([{ path: "summary.md", mode: "100644", object: emptyObject }]);
        await this.git(["update-ref", "HEAD", clearCommit, head]);
      } catch (error) {
        try { await indexSnapshot?.restore(); } catch {}
        await this.restoreStage(root, stage?.token);
        return failure(error?.memoryCode ?? "commit-failed");
```

</details>

**依据 4 · 作者声明**：[README.md:200-209](https://github.com/seriousz158/dsh-memory/blob/f7b03757f8bf546d3c007f8e9a074a847b681d3d/README.md#L200-L209)

作者说明恢复与保留

<details>
<summary>查看原文（10行）</summary>

```text
## Clear memory safely

The settings UI intentionally requires two acknowledgements:

1. Click **删除记忆**, read the affected paths, then click **继续**.
2. Enter exactly `删除记忆`, then click the final confirmation.

The clear operation is designed for recoverable day-to-day resets, not guaranteed privacy erasure. Before it changes any target memory path, it preserves a recovery point: for a clean repository this is the existing pre-clear HEAD, while dirty target paths are captured in a dedicated checkpoint commit. The clear commit is then created directly on that recovery point. The operation leaves `.git`, `README.md`, helper scripts, directory structure, and `.last-sync` intact so future sessions can learn again without reprocessing historical logs.

Use Git history inside the local memory repository to recover a checkpoint. For privacy-sensitive deletion requirements, remove relevant local backups and follow your organization's retention policy; Git history alone is not a secure-erasure mechanism.
```

</details>

#### 缺口

- 未做断电、并发外部 Git 操作或回滚
  **影响**：无法确认所有失败都能无损恢复
  **进一步探讨**：在一次性仓库模拟竞争 HEAD、部分写入和恢复

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样在独立仓库试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

根包以 Git-backed bundle 供 DSH 使用。先用可丢弃仓库测试读取、禁用和恢复。作者将可选 idle sync 与界面分开，需要已有 dsh，默认 workspace-write；发布的同步事务还调用 Python 辅助程序。模型运行、索引、检查点与重复仓库存储成本未知。删除当前记忆前应确认要保留的 Git 历史，不能把生产资料作为首次测试。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-13](https://github.com/seriousz158/dsh-memory/blob/f7b03757f8bf546d3c007f8e9a074a847b681d3d/package.json#L1-L13)

包和 Node 声明

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "dsh-git-memory",
  "version": "0.10.0",
  "private": false,
  "description": "A local Git-backed long-term memory bundle for DeepSeek Harness",
  "type": "module",
  "workspaces": [
    "packages/dsh-memory",
    "packages/dsh-memory-ui"
  ],
  "engines": {
    "node": ">=22"
  },
```

</details>

**依据 2 · 源码核查**：[package.json:65-69](https://github.com/seriousz158/dsh-memory/blob/f7b03757f8bf546d3c007f8e9a074a847b681d3d/package.json#L65-L69)

根 bundle

```text
  "dsh": {
    "bundle": {
      "patch": "./packages/dsh-git-memory/cordis.patch.yml"
    },
    "client": {
```

**依据 3 · 作者声明**：[README.md:211-219](https://github.com/seriousz158/dsh-memory/blob/f7b03757f8bf546d3c007f8e9a074a847b681d3d/README.md#L211-L219)

同步运行条件

````text
## Optional idle-session sync

The optional synchronizer is separate from the settings UI:

```zsh
./integrations/dsh/dsh-memory-sync
```

It skips work when `memory.enabled` is `false`, and it skips active sessions. It needs a user-installed `dsh` executable (or an explicitly selected `DSH_BIN`), rather than invoking `npx --yes`. It defaults to `workspace-write`; wider privileges are never a repository default. The LaunchAgent template explicitly sets the default DSH and memory paths; edit both assignments before loading it when your installation is custom.
````

**依据 4 · 源码核查**：[packages/dsh-git-memory/lib/sync-transaction.js:36-70](https://github.com/seriousz158/dsh-memory/blob/f7b03757f8bf546d3c007f8e9a074a847b681d3d/packages/dsh-git-memory/lib/sync-transaction.js#L36-L70)

Python 命令与不可用分支

<details>
<summary>查看原文（35行）</summary>

```text
async function invokePython(operation, args = {}) {
  const argv = [SYNC_APPLY_SCRIPT, operation];
  for (const [key, value] of Object.entries(args)) {
    if (value === undefined || value === null) continue;
    argv.push(`--${key}`, String(value));
  }
  let unavailable;
  for (const python of PYTHON_CANDIDATES) {
    try {
      const output = await execFile(python, argv, { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
      const result = JSON.parse(output.stdout);
      if (result?.ok === true) return result.value;
      if (typeof result?.error?.code === "string") throw syncError(result.error.code);
      throw syncError("sync-failed");
    } catch (error) {
      if (error?.code === "ENOENT") {
        unavailable = error;
        continue;
      }
      // The helper exits non-zero on SyncError but still writes the error
      // envelope to stdout; recover the machine code instead of collapsing to
      // a generic sync-failed.
      if (typeof error?.stdout === "string") {
        try {
          const failed = JSON.parse(error.stdout);
          if (typeof failed?.error?.code === "string") throw syncError(failed.error.code);
        } catch (parseError) {
          if (parseError?.memoryCode) throw parseError;
        }
      }
      if (error?.memoryCode) throw error;
      throw syncError("sync-failed");
    }
  }
  throw Object.assign(new Error("Python 3 is unavailable for the memory sync helper"), { memoryCode: "sync-unavailable", cause: unavailable });
```

</details>

#### 缺口

- 未验证发布包、Python、宿主或成本
  **影响**：无法评价部署时间和资源
  **进一步探讨**：用临时仓库比较只读与预览应用，并检查恢复点

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样避免把重置理解成擦除？

**研究主题**：新假设与验证

#### 完整回答

界面已有双确认，可在确认与回执中分别显示当前分支清空、Git 恢复点和独立备份可能仍在。用合成资料让操作者分别完成重置、恢复和判断是否适合保留策略，比较正确选择与耗时。若错误擦除预期没有下降或恢复被误解，则撤回。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:200-209](https://github.com/seriousz158/dsh-memory/blob/f7b03757f8bf546d3c007f8e9a074a847b681d3d/README.md#L200-L209)

已有确认及清理语义

<details>
<summary>查看原文（10行）</summary>

```text
## Clear memory safely

The settings UI intentionally requires two acknowledgements:

1. Click **删除记忆**, read the affected paths, then click **继续**.
2. Enter exactly `删除记忆`, then click the final confirmation.

The clear operation is designed for recoverable day-to-day resets, not guaranteed privacy erasure. Before it changes any target memory path, it preserves a recovery point: for a clean repository this is the existing pre-clear HEAD, while dirty target paths are captured in a dedicated checkpoint commit. The clear commit is then created directly on that recovery point. The operation leaves `.git`, `README.md`, helper scripts, directory structure, and `.last-sync` intact so future sessions can learn again without reprocessing historical logs.

Use Git history inside the local memory repository to recover a checkpoint. For privacy-sensitive deletion requirements, remove relevant local backups and follow your organization's retention policy; Git history alone is not a secure-erasure mechanism.
```

</details>

**依据 2 · 源码核查**：[packages/dsh-git-memory/lib/index.js:1402-1424](https://github.com/seriousz158/dsh-memory/blob/f7b03757f8bf546d3c007f8e9a074a847b681d3d/packages/dsh-git-memory/lib/index.js#L1402-L1424)

可读回的恢复点和清理提交

<details>
<summary>查看原文（23行）</summary>

```text
        recoveryEntries = (await safeClear(root, "snapshot-live")).entries;
        head = (await this.git(["rev-parse", "HEAD"])).stdout.trim();
        recoveryCommit = await this.buildTargetCommit(head, recoveryEntries, "DPSK memory recovery checkpoint");
        if (recoveryCommit === null) recoveryCommit = head;
      } catch (error) {
        return failure(error?.memoryCode ?? "checkpoint-failed");
      }
      active.phase = "validating";
      await writeActiveRun(root, active);
      try {
        root = await this.inspect();
        stage = await safeClear(root, "stage");
        const stagedEntries = (await safeClear(root, "snapshot", stage.token)).entries;
        if (!sameEntries(recoveryEntries, stagedEntries)) throw clearError();
        await safeClear(root, "verify");
        const emptyObject = (await this.git(["hash-object", "-w", "/dev/null"])).stdout.trim();
        clearCommit = await this.buildTargetCommit(recoveryCommit, [{ path: "summary.md", mode: "100644", object: emptyObject }], "DPSK memory cleared");
        if (clearCommit === null) throw clearError();
        indexSnapshot = await this.snapshotIndex();
        active.phase = "applying";
        await writeActiveRun(root, active);
        await this.replaceCurrentIndex([{ path: "summary.md", mode: "100644", object: emptyObject }]);
        await this.git(["update-ref", "HEAD", clearCommit, head]);
```

</details>

#### 缺口

- 未走查实际界面或操作者
  **影响**：不知道提示是否有增量
  **进一步探讨**：先读取现有界面，再测试理解和恢复

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
