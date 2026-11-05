# NextTavern

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[713aaf9](https://github.com/a86582751/dsh-nexttavern/tree/713aaf92490eae8fd07d7939f4ea5fe97eb136b6)

<!-- BEGIN META -->
[![GitHub ★ 224](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=224&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/a86582751/dsh-nexttavern) [![npm 30d 1,937](https://img.shields.io/static/v1?label=npm+30d&message=1%2C937&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-nexttavern) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-nexttavern)
<!-- END META -->

> **功能**：为 DSH 提供角色扮演工作区，支持角色卡、世界线、记忆和小说导出。

> **亮点**：[Q01](#research-q01) 让分支故事可进入原文或模型整理的导出任务，避免逐段搬运。

> **主要限制**：[Q03](#research-q03) 固定树版本与 README 发行线不同，稿件不能替代会话备份。

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
  - [Q01 · 玩家怎样从会话取得可携带的稿件？](#detail-section-11)
  - [Q02 · 来源变化如何影响正在生成的稿件？](#detail-section-12)
  - [Q03 · 固定提交能代表 README 的正式发行吗？](#detail-section-13)
  - [Q04 · 如何评估故事工作流和退出成本？](#detail-section-14)
  - [Q05 · 按情节来源标记稿件能否降低校对负担？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要把角色扮演会话整理成可读稿件的玩家可以评估分支导出。

手工复制可由作者逐段核查，但缺少自动来源和进度管理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 原文导出 | 固定故事文本 | 不保留完整会话 |
| 整理导出 | 组织为稿件 | 需要模型并核查改写 |
| 分支记忆 | 恢复可见压缩档案 | 未实测分支恢复 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 对应 DSH profile | 必需 | 装载产品子树 | 源码存在无法保证装载 |
| 独立工作区 | 试用和迁移 | 隔离会话及故事 | 旧环境应保留 |
| 模型连接 | 整理导出需要 | 重组文本 | 先用原文模式 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定发布线并备份 | 用新工作区 |
| 核验 | 测试原文及整理稿 | 检查来源和遗漏 |
| 退出 | 保留旧工作区 | 稿件仅用作文本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 运行与安装资源未知 | 迁移耗时未知 | 区分发行与开发 |
| 持续 | 模型调用费用未知 | 稿件校对未知 | 原文与整理开销不同 |
| 恢复 | 重做稿件开销未知 | 核对旧会话时间未知 | 保留原环境 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 分支稿件 | 可固定历史生成任务 | 稿件质量与完整性 |
| 记忆隔离 | 只恢复可见检查点 | 复杂分支恢复 |

> **思考**：[Q03](#research-q03) 固定树版本与 README 发行线不同，稿件不能替代会话备份。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 让分支故事可进入原文或模型整理的导出任务，避免逐段搬运。

导出校验来源覆盖，压缩档案恢复以当前分支可见性为准。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 固定树版本与 README 发行线不同，稿件不能替代会话备份。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先独立工作区核对原文出稿，再决定是否启用整理。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

核查固定开发树的导出和记忆恢复代表路径，未安装正式包或运行模型。

- 已检查：作者 README、包清单、源码路径 README.md、lib/core/roleplay-job-routes.js、lib/core/novel-export.js、lib/memory/memory-compaction.js、package.json、lib/operations/nexttavern-entry.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定开发树和源码路径，未运行发布包、宿主或模型。
- 下一步：测试旧环境隔离、来源失效和整理输出对照。

**分析版本**

- **仓库**：[a86582751/dsh-nexttavern](https://github.com/a86582751/dsh-nexttavern)
- **版本号**：0.3.0-rc.1（[固定提交 713aaf9](https://github.com/a86582751/dsh-nexttavern/tree/713aaf92490eae8fd07d7939f4ea5fe97eb136b6)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 给整理稿增加来源定位，验证作者能否更快核对事实。

测试旧环境隔离、来源失效和整理输出对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 56 | 8785 | — | — | 177928 |
| .js | source | 1157 | 318133 | 291138 | 25295 | — |
| .ts | source | 931 | 275135 | 239636 | 26037 | — |
| .mts | source | 224 | 46700 | 42803 | 3226 | — |
| .mjs | source | 246 | 51559 | 48508 | 3122 | — |
| .tsx | source | 36 | 6835 | 5584 | 1000 | — |
| .mjs | test | 53 | 14645 | 13863 | 488 | — |
| .mts | test | 25 | 5419 | 5074 | 198 | — |

</details>

**活跃度**

[![近30天新建 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=8&color=737b86&logo=github)](https://github.com/a86582751/dsh-nexttavern/issues?q=is%3Aissue+created%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z) [![近30天关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/a86582751/dsh-nexttavern/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查固定开发提交的小说导出及分支隔离，区分公开发行和开发线。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 玩家怎样从会话取得可携带的稿件？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

长期写作玩家可以从当前世界线导出稿件，少一次逐段复制。任务路由将原文和整理导出分开，原文模式不需要模型选择，整理模式需要选择模型。导出固定当时的历史和截止位置，稿件只代表选定历史，不能恢复完整会话和插件状态。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-17](https://github.com/a86582751/dsh-nexttavern/blob/713aaf92490eae8fd07d7939f4ea5fe97eb136b6/README.md#L11-L17)

迁移与长篇角色扮演定位

```text
> **从 0.2.5 等旧宿主版本迁移，请使用新目录。** 先在旧环境导出角色卡或小说，再安装 0.2.9；旧会话不兼容，小说稿不保存完整会话状态。0.2.8 → 0.2.9 延续同一宿主与会话线，更新步骤见[更新、卸载与回滚](#更新卸载与回滚)。

抱歉让大家久等了。0.3 希望兼容更广泛的 SillyTavern 社区卡，包括 MVU 变量、EJS、RUBY 与前端美化；要让它们接入自有状态、结构化事件和恢复机制，难度比预期更大，我们正在加速推进。0.2.9-rc.4 在延续发行、安装与第三方依赖修复的同时，定点修复了 Issue #17；更广泛的社区卡兼容仍在开发。感谢大家继续反馈、陪我们把它打磨好。

**让角色独立推演，让世界随你的选择展开。**

一张角色卡，一个突然冒出的念头，一次不愿妥协的选择，都可以成为故事的起点。dsh-NextTavern 把原生 Agent Loop 带进长篇角色扮演：AI 主动查阅世界、整理记忆、推演人物，你掌握方向，一起把故事写下去。
```

**依据 2 · 源码核查**：[lib/core/roleplay-job-routes.js:35-50](https://github.com/a86582751/dsh-nexttavern/blob/713aaf92490eae8fd07d7939f4ea5fe97eb136b6/lib/core/roleplay-job-routes.js#L35-L50)

任务路由调用导出

<details>
<summary>查看原文（16行）</summary>

```text
            failedAt: job.failedAt ?? (job.status === 'failed' ? job.updatedAt ?? null : null) };
    };
    async function startExportJob(session, kind, agent, sourceFile, requestId, mode = 'original') {
        assertWorkspaceSession(session);
        assertSteeringAgent(agent);
        const job = kind === 'novel-export' ? await novelExports.begin(session, mode === 'organized' ? await modelPolicy.resolve(session, kind, agent) : undefined, { mode })
            : await beginCardWorkflow(session, kind, sourceFile, agent, requestId, undefined, mode);
        if (job.status === 'completed')
            return job;
        if (job.execution === 'deterministic') {
            if (kind === 'novel-export')
                return novelExports.drive(session, job.id, agent);
            if (['queued', 'running', 'waiting-main'].includes(job.status))
                await resumeCardWorkflows(session, agent);
            return T.branch.get(cardWorkflowKey(job.id)) ?? job;
        }
```

</details>

**依据 3 · 源码核查**：[lib/core/novel-export.js:78-99](https://github.com/a86582751/dsh-nexttavern/blob/713aaf92490eae8fd07d7939f4ea5fe97eb136b6/lib/core/novel-export.js#L78-L99)

分支快照、模式及重复任务处理

<details>
<summary>查看原文（22行）</summary>

```text
    async function begin(session, selection, options = {}) {
        const mode = options.mode ?? 'original';
        if (mode === 'organized' && !selection)
            fail('整理导出需要模型选择');
        const entries = clone([...history(session)]);
        if (!entries.some(entry => (entry.role ?? entry.kind) === 'assistant'))
            fail('当前分支没有可导出的完整剧情');
        const source = { entries, cutoff: entries.at(-1)?.seq ?? -1 };
        const units = mode === 'organized' ? novelUnits(entries) : [];
        const sourceHash = taskHash(source);
        const existing = list(session).find(job => ['queued', 'running', 'waiting-main'].includes(job.status) && (job.mode ?? 'organized') === mode && job.sourceHash === sourceHash);
        if (existing)
            return existing;
        const id = randomUUID(), job = {
            schemaVersion: 1, id, kind: 'novel-export', sessionId: session.id, branchId: session.id, source, sourceHash, mode,
            ...(mode === 'organized' ? { selection: clone(selection), actualRoute: selection.actualRoute } : {}),
            execution: mode === 'original' ? 'deterministic' : selection.execution,
            chunks: chunksOf(units), results: {}, ...(mode === 'original' ? { plan: { title: '当前世界线原文', chapters: [] } } : {}),
            status: 'queued', generation: randomUUID(), attempt: 0, progress: { done: 0, total: mode === 'original' ? entries.length : units.length }, createdAt: Date.now(),
        };
        await table.put(key(id), job);
        return clone(job);
```

</details>

#### 缺口

- 没有读者完整性对照
  **影响**：无法确认是否省时或保留所有想要的段落
  **进一步探讨**：比较手工稿与导出稿

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 来源变化如何影响正在生成的稿件？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

导出保存来源快照和哈希，同一会话同一模式及活跃同源任务可复用。继续执行时重新检查序号对应正文是否仍存在；覆盖校验要求片段顺序与输入一致。逐项文本存在校验可以拒绝部分变更，但不能证明模型整理内容未改写事实。分支记忆另外以当前可见压缩检查点为准，避免仅按历史日志复活兄弟分支摘要。

#### 证据与依据

**依据 1 · 源码核查**：[lib/core/novel-export.js:37-55](https://github.com/a86582751/dsh-nexttavern/blob/713aaf92490eae8fd07d7939f4ea5fe97eb136b6/lib/core/novel-export.js#L37-L55)

整理片段要求完全覆盖

<details>
<summary>查看原文（19行）</summary>

```text
function exactCoverage(actual, expected) {
    if (!Array.isArray(actual) || actual.length !== expected.length || actual.some((id, i) => id !== expected[i]))
        fail('来源覆盖有遗漏、重复或顺序变化');
}
function chunksOf(units) {
    const chunks = [];
    let current = [], size = 0;
    for (const unit of units) {
        if (current.length && size + unit.text.length > 12000) {
            chunks.push({ id: `chunk-${chunks.length}`, units: current });
            current = [];
            size = 0;
        }
        current.push(unit);
        size += unit.text.length;
    }
    if (current.length)
        chunks.push({ id: `chunk-${chunks.length}`, units: current });
    return chunks;
```

</details>

**依据 2 · 源码核查**：[lib/core/novel-export.js:69-99](https://github.com/a86582751/dsh-nexttavern/blob/713aaf92490eae8fd07d7939f4ea5fe97eb136b6/lib/core/novel-export.js#L69-L99)

固定来源与复用

<details>
<summary>查看原文（31行）</summary>

```text
    const current = (session, job) => {
        const snapshot = history(session);
        let live = historyIndices.get(snapshot);
        if (!live) {
            live = new Map(snapshot.map(entry => [entry.seq, entry.text]));
            historyIndices.set(snapshot, live);
        }
        return job.source.entries.every(entry => live.has(entry.seq) && live.get(entry.seq) === entry.text);
    };
    async function begin(session, selection, options = {}) {
        const mode = options.mode ?? 'original';
        if (mode === 'organized' && !selection)
            fail('整理导出需要模型选择');
        const entries = clone([...history(session)]);
        if (!entries.some(entry => (entry.role ?? entry.kind) === 'assistant'))
            fail('当前分支没有可导出的完整剧情');
        const source = { entries, cutoff: entries.at(-1)?.seq ?? -1 };
        const units = mode === 'organized' ? novelUnits(entries) : [];
        const sourceHash = taskHash(source);
        const existing = list(session).find(job => ['queued', 'running', 'waiting-main'].includes(job.status) && (job.mode ?? 'organized') === mode && job.sourceHash === sourceHash);
        if (existing)
            return existing;
        const id = randomUUID(), job = {
            schemaVersion: 1, id, kind: 'novel-export', sessionId: session.id, branchId: session.id, source, sourceHash, mode,
            ...(mode === 'organized' ? { selection: clone(selection), actualRoute: selection.actualRoute } : {}),
            execution: mode === 'original' ? 'deterministic' : selection.execution,
            chunks: chunksOf(units), results: {}, ...(mode === 'original' ? { plan: { title: '当前世界线原文', chapters: [] } } : {}),
            status: 'queued', generation: randomUUID(), attempt: 0, progress: { done: 0, total: mode === 'original' ? entries.length : units.length }, createdAt: Date.now(),
        };
        await table.put(key(id), job);
        return clone(job);
```

</details>

**依据 3 · 源码核查**：[lib/core/novel-export.js:104-124](https://github.com/a86582751/dsh-nexttavern/blob/713aaf92490eae8fd07d7939f4ea5fe97eb136b6/lib/core/novel-export.js#L104-L124)

执行前的来源与进度检查

<details>
<summary>查看原文（21行）</summary>

```text
            return inFlight.promise;
        const work = (async () => {
            const check = () => {
                signal?.throwIfAborted();
                const job = get(session, id);
                if (job.generation !== generation || job.status === 'cancelled')
                    fail('小说任务已取消或替换');
                if (!current(session, job))
                    throw Object.assign(new Error('小说来源已编辑或删除，需要新快照'), { code: 'NOVEL_STALE' });
                return job;
            };
            // Callers supply the job checked in this synchronous segment, avoiding
            // another full source read while composing the same persistence patch.
            const save = async (job, patch) => {
                await table.put(key(id), { ...job, ...patch, updatedAt: Date.now() });
            };
            try {
                let job = check();
                if (job.status === 'completed')
                    return job;
                await save(job, { status: 'running' });
```

</details>

**依据 4 · 源码核查**：[lib/memory/memory-compaction.js:34-63](https://github.com/a86582751/dsh-nexttavern/blob/713aaf92490eae8fd07d7939f4ea5fe97eb136b6/lib/memory/memory-compaction.js#L34-L63)

检查点在当前 surface 可见才恢复

<details>
<summary>查看原文（30行）</summary>

```text
export function durableCompactionArchives(session) {
    const events = eventsOf(session);
    // The append-only log contains compactions from discarded branches too.
    // A summary/checkpoint pair is durable only when its replacement checkpoint
    // is currently visible on this session surface.  Looking at the log alone
    // would re-introduce a sibling's future archive when a child is lazy-loaded.
    const visible = new Set(surfaceSeqsOf(session));
    const ended = new Set(events
        .filter((event) => event?.type === 'compaction/end' && !event.data?.error)
        .map((event) => String(event.data?.compactionId ?? '')));
    const archives = [];
    for (const summaryEvent of events) {
        if (summaryEvent?.type !== 'compaction/summary')
            continue;
        const compactionId = String(summaryEvent.data?.compactionId ?? '');
        if (!compactionId || !ended.has(compactionId))
            continue;
        const summarySeq = durableSeq(summaryEvent.seq);
        if (summarySeq === null)
            continue;
        const checkpoint = events[summarySeq + 1];
        const checkpointSeq = durableSeq(checkpoint?.seq);
        if (checkpoint?.type !== 'user/message' ||
            checkpoint.data?.source?.kind !== 'compact-checkpoint' ||
            String(checkpoint.data?.source?.compactionId ?? '') !== compactionId ||
            typeof checkpoint.surfaceOp !== 'object' || checkpoint.surfaceOp.op !== 'replace' ||
            checkpointSeq === null ||
            !visible.has(checkpointSeq))
            continue;
        archives.push({
```

</details>

#### 缺口

- 未测试竞争和跨分支回放
  **影响**：无法给出异常恢复的完整保证
  **进一步探讨**：并发导出时切换或编辑故事，核对输出和状态

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 固定提交能代表 README 的正式发行吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

包清单版本为 0.3.0-rc.1，而 README 将 0.2.9-rc.4 作为发行线，并区分尚未正式发布的 0.3 参考卡。当前研究只证明固定开发树包含相应代码。作者也明确较老会话不能直接迁移，小说稿不是完整会话备份。因而不能用此处功能判断正式包可安装、兼容哪版宿主或可原样迁移。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-4](https://github.com/a86582751/dsh-nexttavern/blob/713aaf92490eae8fd07d7939f4ea5fe97eb136b6/package.json#L1-L4)

开发树版本

```text
{
  "name": "dsh-nexttavern",
  "version": "0.3.0-rc.1",
  "description": "一个面向 DeepSeek Harness 的长篇角色扮演插件，支持角色卡、世界线、长期记忆、混合检索和 SillyTavern 兼容。",
```

**依据 2 · 源码核查**：[package.json:22-38](https://github.com/a86582751/dsh-nexttavern/blob/713aaf92490eae8fd07d7939f4ea5fe97eb136b6/package.json#L22-L38)

实际导出入口

<details>
<summary>查看原文（17行）</summary>

```text
  "engines": {
    "node": ">=24"
  },
  "main": "lib/operations/nexttavern-entry.mjs",
  "exports": {
    ".": {
      "default": "./lib/operations/nexttavern-entry.mjs"
    },
    "./entry-policy": {
      "default": "./lib/operations/nexttavern-entry-policy.mjs"
    },
    "./host": {
      "default": "./lib/core/host-index.js"
    },
    "./client": {
      "default": "./lib/client.js"
    },
```

</details>

**依据 3 · 作者声明**：[README.md:7-13](https://github.com/a86582751/dsh-nexttavern/blob/713aaf92490eae8fd07d7939f4ea5fe97eb136b6/README.md#L7-L13)

作者所述发行线和迁移边界

```text
> **最新版本：0.2.9-rc.4。** 修复 [Issue #17](https://github.com/a86582751/dsh-nexttavern/issues/17)：长会话请求超限后的压缩恢复，以及持续推理被误判超时。保留 rc.3 的安装改进和慢模型首响应等待设置。GitHub 与 [npm latest](https://www.npmjs.com/package/dsh-nexttavern/v/0.2.9-rc.4) 均为 0.2.9-rc.4。

> **安装与宿主范围。** 0.2.9 发行线已预置第三方 SDK 依赖，修复首次安装和私有组件重新链接的问题。正式来源为 [npm dsh-nexttavern](https://www.npmjs.com/package/dsh-nexttavern/v/0.2.9-rc.4) 和 [v0.2.9-rc.4 Release](https://github.com/a86582751/dsh-nexttavern/releases/tag/v0.2.9-rc.4)，支持 Harness 0.1.7-rc.2／web／Session V4。开发请读[重建指南](CONTRIBUTING.md)。

> **从 0.2.5 等旧宿主版本迁移，请使用新目录。** 先在旧环境导出角色卡或小说，再安装 0.2.9；旧会话不兼容，小说稿不保存完整会话状态。0.2.8 → 0.2.9 延续同一宿主与会话线，更新步骤见[更新、卸载与回滚](#更新卸载与回滚)。

抱歉让大家久等了。0.3 希望兼容更广泛的 SillyTavern 社区卡，包括 MVU 变量、EJS、RUBY 与前端美化；要让它们接入自有状态、结构化事件和恢复机制，难度比预期更大，我们正在加速推进。0.2.9-rc.4 在延续发行、安装与第三方依赖修复的同时，定点修复了 Issue #17；更广泛的社区卡兼容仍在开发。感谢大家继续反馈、陪我们把它打磨好。
```

**依据 4 · 作者声明**：[README.md:23-32](https://github.com/a86582751/dsh-nexttavern/blob/713aaf92490eae8fd07d7939f4ea5fe97eb136b6/README.md#L23-L32)

0.3 参考卡的测试和发行范围

<details>
<summary>查看原文（10行）</summary>

```text
**角色卡作者与社区开发者：** 下面四篇介绍运行机制、格式字段和创作示例。内容对应 **0.3 开发线，尚未随正式 0.3 发布**；Native 1.0／1.1 是卡文件格式版本。随包 Native 参考卡也属于 0.3 开发线，当前正式版 **0.2.9-rc.4 不含本批卡片**。

| 从哪里开始 | 能学到什么 |
| --- | --- |
| [社区卡兼容与转换](COMMUNITY-CARDS.md) | 理解世界书触发、递归、预算与插入，以及导入、剧情生成、转换和导出的完整过程 |
| [原生卡格式与创作教程](NATIVE-CARD-FORMAT.md) | 从完整 JSON 示例创作，编写 EJS 动态模板，理解人物、规则、开场和 1.0／1.1 的区别 |
| [原生状态系统、MVU 与 Ruby](NATIVE-STATE.md) | 理解原生数值与分析任务机制，为作品加入初值、回合更新及社区兼容能力 |
| [社区预设与正则](COMMUNITY-PRESETS.md) | 编写预设、组织提示词，区分请求变换与阅读显示 |

完整 Native 1.0 参考卡：[索引与字段导览](preset/reference/README.md)；[龙女皇：查看 JSON](preset/reference/dragon-empress.native.json) · [下载 JSON](https://raw.githubusercontent.com/a86582751/dsh-nexttavern/main/preset/reference/dragon-empress.native.json)；[Steam Tide：查看 JSON](preset/reference/steam-tide.native.json) · [下载 JSON](https://raw.githubusercontent.com/a86582751/dsh-nexttavern/main/preset/reference/steam-tide.native.json)。Steam Tide 索引也指向值班简报 Prompt hook、市场闲谈互斥、临时告示持续／冷却及累计 `author.log` 的作者路径。该卡的整卡 Core 路径已通过受控 fixture 测试；测试未使用真实模型，也未在 Harness／正式产品宿主或完整浏览器 DOM 中运行，不代表 0.3 整体验收或发行完成。
```

</details>

#### 缺口

- 未核查发行归档与当前提交构建对应
  **影响**：不能外推固定源码效果到 npm
  **进一步探讨**：独立固定发布归档和源码版本再对照

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何评估故事工作流和退出成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先在独立工作区放入合成角色卡和短故事，以可读取的原文稿验收，再考虑整理导出。启动实际入口拥有独立 Loader 子树并准备产品组件，故不能仅用 UI 可见判断依赖正确。按作者给出的发行版本边界核对宿主和组件，已有故事先备份；旧环境继续保留，导出只用于携带文本而不覆盖旧会话。整理模型、记忆和安装维护费用未测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:42-60](https://github.com/a86582751/dsh-nexttavern/blob/713aaf92490eae8fd07d7939f4ea5fe97eb136b6/README.md#L42-L60)

发行线接入与隔离步骤

<details>
<summary>查看原文（19行）</summary>

````text
## 一键安装

**已经装好 Harness 的玩家，只需这一条命令：**

```powershell
dsh plugin --profile web add dsh-nexttavern
```

这里的 `dsh-nexttavern` 是正式 npm 包名。部分第三方 Hub／市场目录未识别 npm 来源时会回退到 Git 源码安装；目录来源仍待第三方同步。请直接使用上面的官方命令，或下载已校验的 Release 归档。本版未承诺 Git 源码直装，也未扩展到 DSH 0.2／desktop。

第一次使用 DSH，请先安装 Node.js 24+ 和宿主：

```powershell
npm install -g @deepseek-ai/dsh@0.1.7-rc.2
```

安装后运行 `dsh web --host 127.0.0.1`，按终端地址打开浏览器，配置自己的模型与 Key，再选择“角色扮演模式”。所需兼容组件、文档读取组件和自有皮肤由统一插件准备；皮肤随包安装、默认关闭。首次准备需要时间与网络，准备完成后的启动会复用已校验的组件。

**从 0.2.5 迁移：先导出，再用新目录。** 0.2.5 的旧会话无法直接延续，目录隔离步骤见[安装](#安装)。不要对旧 home 或工作区执行这条命令来尝试迁移会话。
````

</details>

**依据 2 · 作者声明**：[README.md:83-94](https://github.com/a86582751/dsh-nexttavern/blob/713aaf92490eae8fd07d7939f4ea5fe97eb136b6/README.md#L83-L94)

模型费用和使用流程

<details>
<summary>查看原文（12行）</summary>

```text
### 安装与模型费用

安装、字节校验、恢复和卸载由程序完成，不调用故事模型。模型 API Key 由玩家输入，安装包不携带密钥；本机服务绑定 `127.0.0.1`。故事生成及既有后台记忆、状态等任务仍按所配置模型计费，打开已有会话也可能恢复后台维护。

## 开始体验

完成[一键安装](#一键安装)（或[手动安装](#安装)）并配置好自己的模型后：

1. **新建一个独立工作区。** 给这次角色扮演一个专用文件夹，角色卡、故事资源和导出文件都放在一起。
2. **在预设里选“角色扮演模式”。** 新建会话时从预设菜单切过去，就进入了你的故事工作台。
3. **上传角色卡，或者直接聊出一张新的。** 支持 SillyTavern / TauriTavern 的 PNG、JSON 人物卡；也可以只描述题材、人物、关系和氛围，让 AI 通过对话和你一起把这张卡做出来。
4. **开始体验。Enjoy it!** 跟着开场推进故事，输入你的行动，切换世界线，或随时打开“酒馆管理”调整设定。
```

</details>

**依据 3 · 源码核查**：[lib/operations/nexttavern-entry.mjs:10-23](https://github.com/a86582751/dsh-nexttavern/blob/713aaf92490eae8fd07d7939f4ea5fe97eb136b6/lib/operations/nexttavern-entry.mjs#L10-L23)

产品入口与加载职责

<details>
<summary>查看原文（14行）</summary>

```text
/** Product-owned Loader subtree. Native and replacement providers never overlap. */
import { Service } from '@deepseek-ai/cordis';
import { EntryTree } from '@deepseek-ai/cordis-plugin-loader';
import { createRequire } from 'node:module';
import { readFileSync, realpathSync } from 'node:fs';
import { isAbsolute, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { capture, composition, loaderEntry, productWanted, providerDisabledExpression } from './nexttavern-entry-policy.mjs';
import { inspectBundledPackages } from './bundled-package-bootstrap.mjs';
import { bindPackagePreparation, createOwnedPackagePreparation } from './nexttavern-package-preparation.mjs';
import { createOwnedMarketInstallation } from './nexttavern-market.mjs';
import { mountSettingsBridge } from './nexttavern-settings-bridge.mjs';
const productRoot = fileURLToPath(new URL('../../', import.meta.url));
```

</details>

**依据 4 · 源码核查**：[lib/core/novel-export.js:78-85](https://github.com/a86582751/dsh-nexttavern/blob/713aaf92490eae8fd07d7939f4ea5fe97eb136b6/lib/core/novel-export.js#L78-L85)

整理模型是条件

```text
    async function begin(session, selection, options = {}) {
        const mode = options.mode ?? 'original';
        if (mode === 'organized' && !selection)
            fail('整理导出需要模型选择');
        const entries = clone([...history(session)]);
        if (!entries.some(entry => (entry.role ?? entry.kind) === 'assistant'))
            fail('当前分支没有可导出的完整剧情');
        const source = { entries, cutoff: entries.at(-1)?.seq ?? -1 };
```

#### 缺口

- 未执行宿主或发布包
  **影响**：不知道当前构建可用性与安装退路
  **进一步探讨**：用隔离工作区核查启动、出稿和备份恢复

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 按情节来源标记稿件能否降低校对负担？

**研究主题**：新假设与验证

#### 完整回答

现有整理工作已对片段覆盖及顺序做验证。可以测试给稿件附来源段落定位，让作者针对改写快速追溯。固定同一分支和稿件，用带和不带定位的两版比较事实错误发现、遗漏定位耗时和阅读干扰；如果定位无助或使稿件更难阅读，就不采用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/core/novel-export.js:16-39](https://github.com/a86582751/dsh-nexttavern/blob/713aaf92490eae8fd07d7939f4ea5fe97eb136b6/lib/core/novel-export.js#L16-L39)

已有来源覆盖与结果结构

<details>
<summary>查看原文（24行）</summary>

```text
function decodeJob(value) {
    // Table reads are untrusted persisted data; do not rewrite a malformed record.
    if (!record(value) || value.schemaVersion !== 1 || value.kind !== 'novel-export' ||
        !['id', 'sessionId', 'branchId', 'sourceHash', 'generation', 'execution'].every(field => typeof value[field] === 'string') ||
        !record(value.source) || !Array.isArray(value.source.entries) || !value.source.entries.every(entry) || !finite(value.source.cutoff) ||
        (value.mode !== undefined && value.mode !== 'original' && value.mode !== 'organized') ||
        (value.mode !== 'original' && (!record(value.selection) || typeof value.selection.execution !== 'string')) ||
        !Array.isArray(value.chunks) || !value.chunks.every(chunk => record(chunk) && typeof chunk.id === 'string' && Array.isArray(chunk.units) && chunk.units.length > 0 && chunk.units.every(unit)) ||
        !record(value.results) || !Object.values(value.results).every(result => record(result) && typeof result.verified === 'boolean' && 'draft' in result && (!result.verified || materialized(result.draft))) ||
        (value.plan !== undefined && !planShape(value.plan)) ||
        typeof value.status !== 'string' || !['queued', 'running', 'waiting-main', 'completed', 'cancelled', 'stale', 'failed'].includes(value.status) ||
        !finite(value.attempt) || !finite(value.createdAt) || !record(value.progress) || !finite(value.progress.done) || !finite(value.progress.total))
        fail('小说任务记录损坏，原记录未改写');
    const job = value;
    const chunkIds = job.chunks.map(chunk => chunk.id), known = new Set(chunkIds);
    if (known.size !== chunkIds.length || Object.keys(job.results).some(id => !known.has(id)))
        fail('小说任务记录损坏，原记录未改写');
    if (job.plan)
        exactCoverage(job.plan.chapters.flatMap(chapter => chapter.chunk_ids), chunkIds);
    return job;
}
function exactCoverage(actual, expected) {
    if (!Array.isArray(actual) || actual.length !== expected.length || actual.some((id, i) => id !== expected[i]))
        fail('来源覆盖有遗漏、重复或顺序变化');
```

</details>

**依据 2 · 源码核查**：[lib/core/novel-export.js:78-96](https://github.com/a86582751/dsh-nexttavern/blob/713aaf92490eae8fd07d7939f4ea5fe97eb136b6/lib/core/novel-export.js#L78-L96)

导出固定来源及模式

<details>
<summary>查看原文（19行）</summary>

```text
    async function begin(session, selection, options = {}) {
        const mode = options.mode ?? 'original';
        if (mode === 'organized' && !selection)
            fail('整理导出需要模型选择');
        const entries = clone([...history(session)]);
        if (!entries.some(entry => (entry.role ?? entry.kind) === 'assistant'))
            fail('当前分支没有可导出的完整剧情');
        const source = { entries, cutoff: entries.at(-1)?.seq ?? -1 };
        const units = mode === 'organized' ? novelUnits(entries) : [];
        const sourceHash = taskHash(source);
        const existing = list(session).find(job => ['queued', 'running', 'waiting-main'].includes(job.status) && (job.mode ?? 'organized') === mode && job.sourceHash === sourceHash);
        if (existing)
            return existing;
        const id = randomUUID(), job = {
            schemaVersion: 1, id, kind: 'novel-export', sessionId: session.id, branchId: session.id, source, sourceHash, mode,
            ...(mode === 'organized' ? { selection: clone(selection), actualRoute: selection.actualRoute } : {}),
            execution: mode === 'original' ? 'deterministic' : selection.execution,
            chunks: chunksOf(units), results: {}, ...(mode === 'original' ? { plan: { title: '当前世界线原文', chapters: [] } } : {}),
            status: 'queued', generation: randomUUID(), attempt: 0, progress: { done: 0, total: mode === 'original' ? entries.length : units.length }, createdAt: Date.now(),
```

</details>

#### 缺口

- 没有作者校对对照
  **影响**：不能确定定位带来的收益
  **进一步探讨**：为已知遗漏和矛盾制作配对稿件

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
