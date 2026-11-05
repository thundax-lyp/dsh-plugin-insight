# DeepSeek Flow

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[87a4e8d](https://github.com/kanghelyu/dsh-deepseek-flow/tree/87a4e8d43102c22f0e1f2b0cbd9af120de611310)

<!-- BEGIN META -->
[![GitHub ★ 83](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=83&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kanghelyu/dsh-deepseek-flow) [![npm 30d 723](https://img.shields.io/static/v1?label=npm+30d&message=723&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepseek-flow) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepseek-flow)
<!-- END META -->

> **功能**：以Markdown文档和可审阅画布共同编辑工作流

> **亮点**：[Q01](#research-q01) 把结构检视与可迁移步骤文档连到同一会话。

> **主要限制**：[Q03](#research-q03) JSON原子不涵盖多文档，直接工具路径也非统一审核。

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
  - [Q01 · 对哪些任务有增量？](#detail-section-11)
  - [Q02 · 人工画布修改怎样审核并提交？](#detail-section-12)
  - [Q03 · 原子与隔离到什么范围？](#detail-section-13)
  - [Q04 · 怎么采用并退出？](#detail-section-14)
  - [Q05 · 怎样检验编辑收益？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户维护有分支的可复用步骤。

纯Markdown或独立图形编辑器。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 图文编辑 | 同时维护结构与步骤文档 | 多文件同步需验证 |
| 拓扑审核 | 画布改动交会话复核 | 直接工具写入不经过同样审核 |
| revision保护 | 检测旧图覆盖 | force可显式绕过 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web及当前会话 | 必需 | 画布与审核运行 | 其他载体未验 |
| 可写文档根和存储 | 必需 | 保存JSON及Markdown | 多文件失败可留部分状态 |
| 模型 | 审核/辅助可选 | 复核拓扑和优化 | 输出需确定性复检 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 备份小流程与存储 | 记录图文摘要 |
| 编辑 | 测试图改、文改与过期revision | 核对节点连接和正文 |
| 退出 | 取消背景任务再停用 | 普通编辑器检查Markdown |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 文档与图形资源未知 | 整理步骤及首次基准耗时未知 | 不包含流程实际执行 |
| 持续 | 审核模型与存储资源未知 | 维护图文和版本耗时未知 | 模型审核耗时未知 |
| 恢复 | 恢复资源未知 | 备份回放与部分写入核对耗时未知 | 单JSON原子不代表全事务 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 结构保护 | 审核前后检拓扑和revision | 模型判断质量未知 |
| 文档同步 | 代码按序写WORKFLOW及STEP | 中断一致性未知 |
| 编辑收益 | 有双视图和可读文档机制 | 发现错误与用时无对照 |

> **思考**：[Q03](#research-q03) JSON原子不涵盖多文档，直接工具路径也非统一审核。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把结构检视与可迁移步骤文档连到同一会话。

拓扑基线重检、revision及进程内锁可见。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) JSON原子不涵盖多文档，直接工具路径也非统一审核。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 隔离小流程并备份，检验双向同步和中断恢复。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的让流程图修改可追查并保持可迁移文档。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/document-workflow.js、lib/dflow-store.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的让流程图修改可追查并保持可迁移文档。未执行目标代码或实际宿主验证。
- 下一步：保留每轮图、文档摘要、revision和失败日志。

**分析版本**

- **仓库**：[kanghelyu/dsh-deepseek-flow](https://github.com/kanghelyu/dsh-deepseek-flow)
- **版本号**：0.4.2（[固定提交 87a4e8d](https://github.com/kanghelyu/dsh-deepseek-flow/tree/87a4e8d43102c22f0e1f2b0cbd9af120de611310)）
- **版本日期**：2026-08-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可更快发现连接错误并保持文档可独立阅读。

保留每轮图、文档摘要、revision和失败日志。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 1204 | — | — | 14973 |
| .md | example | 7 | 39 | — | — | 450 |
| .js | source | 21 | 12117 | 11445 | 321 | — |
| .mjs | source | 9 | 721 | 670 | 30 | — |
| .mjs | test | 16 | 2263 | 2048 | 24 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/kanghelyu/dsh-deepseek-flow/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：让流程图修改可追查并保持可迁移文档

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 对哪些任务有增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

维护重复工作步骤的用户可把WORKFLOW.md及STEP.md投影为可改的图，在会话中继续修改文档。相对只写Markdown，图方便检查连接关系；相对纯图形工具，文档可独立阅读迁移。它是编辑器，执行仍由当前会话承担。合格结果是图和文档的节点、连接、内容一致，导出后不依赖UI仍可读。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-20](https://github.com/kanghelyu/dsh-deepseek-flow/blob/87a4e8d43102c22f0e1f2b0cbd9af120de611310/README.md#L18-L20)

作者说明编辑器和执行边界

```text
DeepSeek Flow turns a `WORKFLOW.md` and its step-level `STEP.md` files into an editable diagram inside DeepSeek Harness. The bundled Skill lets the current Session create and maintain workflows through tools, while the diagram and Markdown remain synchronized and portable.

It is intentionally an editor—not a workflow runtime. DeepSeek Flow helps you design, inspect, and improve a workflow; execution remains in the current Session.
```

**依据 2 · 源码核查**：[lib/index.js:139-157](https://github.com/kanghelyu/dsh-deepseek-flow/blob/87a4e8d43102c22f0e1f2b0cbd9af120de611310/lib/index.js#L139-L157)

实际归一与文档同步调用

<details>
<summary>查看原文（19行）</summary>

```text
async function prepareFlowWrite(host, flow, scope, previous, options = {}) {
  validateFlow(flow);
  const revision = nextFlowRevision(flow, previous, options);
  const normalized = normalizeDocumentFlow(withReadableRevision(flow), {
    storageRoot: host.root,
    scope,
    previousFlow: previous
  });
  const merged = await loadFlowDocuments(normalized, {
    policy: options.documentPolicy === "prefer-disk" ? "prefer-disk" : "prefer-flow",
    fallbackFlow: previous
  });
  const documented = await writeFlowDocuments(merged);
  const now = new Date().toISOString();
  return {
    ...documented,
    revision,
    updatedAt: now,
    createdAt: flow.createdAt ?? previous?.createdAt ?? now
```

</details>

**依据 3 · 源码核查**：[lib/document-workflow.js:386-411](https://github.com/kanghelyu/dsh-deepseek-flow/blob/87a4e8d43102c22f0e1f2b0cbd9af120de611310/lib/document-workflow.js#L386-L411)

写主文档与步骤文件

<details>
<summary>查看原文（26行）</summary>

```text
export async function writeFlowDocuments(flow) {
  if (!flow?.docRoot || !flow?.docs) return flow;
  const root = resolve(flow.docRoot);
  await mkdir(root, { recursive: true });

  // WORKFLOW.md 是整个工作流的入口，因此必须先于分步文件落盘。
  const structureSignature = workflowStructureSignature(flow);
  const currentContent = String(flow.workflowContent ?? "").trimEnd();
  const workflowContent = (currentContent
    ? flow.workflowStructureSignature === structureSignature
      ? currentContent
      : refreshWorkflowStructure(currentContent, flow)
    : renderWorkflowDocument(flow)).trimEnd();
  const workflowPath = resolveInside(root, flow.workflowDoc ?? "WORKFLOW.md");
  await mkdir(dirname(workflowPath), { recursive: true });
  await writeIfChanged(workflowPath, `${workflowContent}\n`);

  const order = orderedNodeIds(flow);
  const nodeById = new Map(flow.nodes.map((node) => [node.id, node]));
  for (const [index, nodeId] of order.entries()) {
    const node = nodeById.get(nodeId);
    const path = resolveInside(root, flow.docs[nodeId]);
    await mkdir(dirname(path), { recursive: true });
    await writeIfChanged(path, `${nodeContent(node, index).trimEnd()}\n`);
  }
  return { ...flow, workflowContent, workflowStructureSignature: structureSignature };
```

</details>

#### 缺口

- 流程图是否更易理解和迁移质量未测。
  **影响**：若图文漂移，视觉便利反会掩盖步骤错误。
  **进一步探讨**：用包含分支和回路的小流程双向核对。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 人工画布修改怎样审核并提交？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

topologyApply要求session、request和baseTopology，若图未变化则直接采用已保存版本，基线变化时拒绝。异步调用当前会话审核后重新读取最新拓扑，变化再次拒绝，否则重建、确定性验证并按expectedRevision保存。直接Agent flow_put是另一条路径，声明可直接持久化，不应把画布审核当作所有写入门禁。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:443-477](https://github.com/kanghelyu/dsh-deepseek-flow/blob/87a4e8d43102c22f0e1f2b0cbd9af120de611310/lib/index.js#L443-L477)

基线和无变化处理

<details>
<summary>查看原文（35行）</summary>

```text
  async topologyApply(request) {
    const { sessionId, requestId, draftFlow, baseTopology } = request ?? {};
    if (!sessionId || !requestId) throw new Error("dflow/topologyApply requires sessionId and requestId");
    if (!draftFlow || typeof draftFlow !== "object" || !Array.isArray(draftFlow.nodes) || !Array.isArray(draftFlow.edges)) {
      throw new Error("dflow/topologyApply requires a draftFlow with nodes and edges");
    }
    if (!baseTopology || typeof baseTopology !== "object") throw new Error("dflow/topologyApply requires the persisted baseTopology");
    const key = `${sessionId}:${requestId}`;
    if (this.host.assistResults.get(key)?.status === "running") throw new Error("This topology request is already running");
    const stored = await this.host.store.listFlow(sessionId, draftFlow.id);
    const emptyBase = {
      ...draftFlow,
      nodes: [],
      edges: [],
      inputs: [],
      outputs: [],
      docs: {}
    };
    const reviewBase = stored ?? emptyBase;
    const requestedDiff = topologyDiff(reviewBase, draftFlow);
    // flow_create/flow_put called by the main Session already persist topology.
    // If Studio submits that exact graph from an older baseline, adopt the saved
    // flow directly instead of bouncing it through the main Session for review.
    if (!requestedDiff.changed) {
      return {
        accepted: false,
        requestId,
        mode: "topology-apply",
        unchanged: true,
        alreadyPersisted: topologySignature(reviewBase) !== topologySignature(baseTopology),
        flow: reviewBase
      };
    }
    if (topologySignature(reviewBase) !== topologySignature(baseTopology)) {
      throw new Error("The saved topology changed after this draft was opened. Reload Studio, merge the latest topology, then apply again.");
```

</details>

**依据 2 · 源码核查**：[lib/index.js:496-512](https://github.com/kanghelyu/dsh-deepseek-flow/blob/87a4e8d43102c22f0e1f2b0cbd9af120de611310/lib/index.js#L496-L512)

审核后重检及保存

<details>
<summary>查看原文（17行）</summary>

```text
          const review = await runMainSessionTopologyReview(this.host, {
            ...request,
            baseFlow: reviewBase,
            staticIssues
          });
          // Agent 运行期间允许 Markdown 独立保存，但不允许另一个拓扑提交悄悄覆盖本草稿。
          const latest = await this.host.store.listFlow(sessionId, draftFlow.id);
          const latestBase = latest ?? emptyBase;
          if (topologySignature(latestBase) !== topologySignature(baseTopology)) {
            throw new Error("The saved topology changed while this review was running. The reviewed draft was not written; reload and apply again.");
          }
          const rebuilt = applyReviewedTopology(latestBase, draftFlow, review.topology);
          validateFlow(rebuilt);
          const result = await saveSessionFlow(this.host, rebuilt, sessionId, {
            ...(latest ? { expectedRevision: flowRevision(latest) } : {}),
            documentPolicy: "prefer-flow"
          });
```

</details>

**依据 3 · 源码核查**：[lib/index.js:856-863](https://github.com/kanghelyu/dsh-deepseek-flow/blob/87a4e8d43102c22f0e1f2b0cbd9af120de611310/lib/index.js#L856-L863)

直接工具持久化及force选项

```text
    name: "flow_put",
    description: "导入/更新一个 flow 定义并直接持久化；成功后 Studio 无需再交回主 Session 审核。condition.data.gateType 只能是 ifElse/and/or/not/nand/nor/xor/xnor，predicate/inputPredicates 的值只能是 truthy/falsy/nonEmpty；自然语言条件必须先由上游 Agent 输出 Boolean。默认以传入 JSON/Studio 内容为准，磁盘 Markdown 仅补齐缺失字段；更新已有 flow 必须携带当前 revision 或 expected_revision。",
    parameters: {
      flow: { type: "json", description: "完整 flow：id/name/nodes/edges/inputs/outputs。IF/ELSE 示例节点 data={gateType:\"ifElse\",predicate:\"truthy\"}，其两条出边 sourceHandle/branch 分别为 true 和 false。" },
      file: { type: "string", description: "flow 定义 JSON 文件的绝对路径（与 flow 二选一）。" },
      shared: { type: "boolean", description: "true = 存为共享模板（无主），默认 false = 当前 session 专属。" },
      expected_revision: { type: "number", description: "更新时预期的当前 revision；先用 flow_read 获取。" },
      force: { type: "boolean", description: "明确忽略 revision 冲突并强制覆盖；默认 false。" },
```

#### 缺口

- 审核Agent输出质量与双窗口竞争未验。
  **影响**：同一会话审核不等于独立安全审批。
  **进一步探讨**：测试过期基线、审核中改图和直接工具写。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 原子与隔离到什么范围？

**研究主题**：缺陷与关键质疑

#### 完整回答

JSON状态使用临时文件rename，进程内Map锁串行同一路径。Markdown却先写WORKFLOW再逐步写STEP，writeIfChanged直接writeFile。prepareFlowWrite在返回JSON元数据前先写文档，因此多文件写入中断可能留部分新文档。不能把单个JSON原子替换推成整套图文事务，也不能由session文件名断言跨进程隔离。

#### 证据与依据

**依据 1 · 源码核查**：[lib/dflow-store.js:62-82](https://github.com/kanghelyu/dsh-deepseek-flow/blob/87a4e8d43102c22f0e1f2b0cbd9af120de611310/lib/dflow-store.js#L62-L82)

JSON替换及进程内锁

<details>
<summary>查看原文（21行）</summary>

```text
  async writeState(path, state) {
    await mkdir(dirname(path), { recursive: true });
    const temporary = `${path}.${process.pid}.tmp`;
    await writeFile(temporary, JSON.stringify(state, null, 2), { encoding: "utf8", mode: 0o600 });
    await rename(temporary, path);
  }

  async withLock(path, task) {
    const previous = this.locks.get(path) ?? Promise.resolve();
    let release;
    const gate = new Promise((resolve) => {
      release = resolve;
    });
    const tail = previous.then(() => gate);
    this.locks.set(path, tail);
    await previous;
    try {
      return await task();
    } finally {
      release();
      if (this.locks.get(path) === tail) this.locks.delete(path);
```

</details>

**依据 2 · 源码核查**：[lib/document-workflow.js:380-409](https://github.com/kanghelyu/dsh-deepseek-flow/blob/87a4e8d43102c22f0e1f2b0cbd9af120de611310/lib/document-workflow.js#L380-L409)

文档逐个直接写入

<details>
<summary>查看原文（30行）</summary>

```text
async function writeIfChanged(path, content) {
  if ((await readIfPresent(path)) === content) return false;
  await writeFile(path, content, "utf8");
  return true;
}

export async function writeFlowDocuments(flow) {
  if (!flow?.docRoot || !flow?.docs) return flow;
  const root = resolve(flow.docRoot);
  await mkdir(root, { recursive: true });

  // WORKFLOW.md 是整个工作流的入口，因此必须先于分步文件落盘。
  const structureSignature = workflowStructureSignature(flow);
  const currentContent = String(flow.workflowContent ?? "").trimEnd();
  const workflowContent = (currentContent
    ? flow.workflowStructureSignature === structureSignature
      ? currentContent
      : refreshWorkflowStructure(currentContent, flow)
    : renderWorkflowDocument(flow)).trimEnd();
  const workflowPath = resolveInside(root, flow.workflowDoc ?? "WORKFLOW.md");
  await mkdir(dirname(workflowPath), { recursive: true });
  await writeIfChanged(workflowPath, `${workflowContent}\n`);

  const order = orderedNodeIds(flow);
  const nodeById = new Map(flow.nodes.map((node) => [node.id, node]));
  for (const [index, nodeId] of order.entries()) {
    const node = nodeById.get(nodeId);
    const path = resolveInside(root, flow.docs[nodeId]);
    await mkdir(dirname(path), { recursive: true });
    await writeIfChanged(path, `${nodeContent(node, index).trimEnd()}\n`);
```

</details>

**依据 3 · 源码核查**：[lib/index.js:139-157](https://github.com/kanghelyu/dsh-deepseek-flow/blob/87a4e8d43102c22f0e1f2b0cbd9af120de611310/lib/index.js#L139-L157)

先写文档再生成保存状态

<details>
<summary>查看原文（19行）</summary>

```text
async function prepareFlowWrite(host, flow, scope, previous, options = {}) {
  validateFlow(flow);
  const revision = nextFlowRevision(flow, previous, options);
  const normalized = normalizeDocumentFlow(withReadableRevision(flow), {
    storageRoot: host.root,
    scope,
    previousFlow: previous
  });
  const merged = await loadFlowDocuments(normalized, {
    policy: options.documentPolicy === "prefer-disk" ? "prefer-disk" : "prefer-flow",
    fallbackFlow: previous
  });
  const documented = await writeFlowDocuments(merged);
  const now = new Date().toISOString();
  return {
    ...documented,
    revision,
    updatedAt: now,
    createdAt: flow.createdAt ?? previous?.createdAt ?? now
```

</details>

#### 缺口

- 中途失败恢复、跨进程锁和符号链接路径未测试。
  **影响**：可能出现磁盘文档和已保存图版本不一致，需备份及重读。
  **进一步探讨**：在第二个STEP写入失败和双进程写时检查状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎么采用并退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先在隔离Web profile装固定包并备份文档根，创建小流程后记录JSON、文档和revision。首次需整理步骤及规范，持续含画布、会话审核与文档维护。退出停用插件前保存Markdown及会话流程存储，确认用普通编辑器可读，不把背景AI任务仍在运行当作已取消。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:43-66](https://github.com/kanghelyu/dsh-deepseek-flow/blob/87a4e8d43102c22f0e1f2b0cbd9af120de611310/README.md#L43-L66)

作者安装与首流程步骤

<details>
<summary>查看原文（24行）</summary>

````text
## Quick start

Install from GitHub into the Web profile:

```bash
dsh plugin --profile web add "github:kanghelyu/dsh-deepseek-flow#main"
```

Restart `dsh web`, open a session, and select the **DeepSeek Flow** tab.

To confirm that the plugin is mounted:

```bash
dsh web --dump-config | grep deepseek-flow
```

## Your first workflow

1. In a Session, ask the Agent to **build a workflow** or **import a workflow**. The bundled `deepseek-flow` Skill guides it to `flow_create` or `flow_put`.
2. Open **DeepSeek Flow**. The plugin scaffolds a master document, step documents, and their visual layout.
3. Ask the Session Agent to change the workflow files, or select a document and edit its Markdown directly.
4. Direct Session/file-driven topology updates are finalized without another main-Session review. The Agent should call `flow_finalize_canvas`; if it forgets, Studio falls back to detecting that no canvas edit event occurred and presses the same invisible finalize action automatically.
5. When **you** add, remove, rename, or connect boxes on the canvas, click **Apply changes**. DeepSeek Flow validates the graph, asks the current Session Agent to review it, validates again, and atomically saves a new revision.
6. Return to the Session when you want the Agent to execute the workflow.
````

</details>

**依据 2 · 源码核查**：[lib/index.js:1-12](https://github.com/kanghelyu/dsh-deepseek-flow/blob/87a4e8d43102c22f0e1f2b0cbd9af120de611310/lib/index.js#L1-L12)

session和共享存储结构

<details>
<summary>查看原文（12行）</summary>

```text
// DeepSeekFlow Host — 每个 session 独立的可视化工作流插件
//
// 存储模型（与 sessionQuery.traceSession 的「session 一一对应」一致）：
//   ~/.dsh/deepseek-flow/shared.json           共享模板（无主，任何 session 可见）
//   ~/.dsh/deepseek-flow/sessions/<id>.json    每个 session 独立的 flows +
//                                               activeFlowId（Studio 下拉选中项）
//
// 能力：
//   - Studio 流程图编辑（client 端原生 SVG/HTML 画布）
//   - 编辑、文档同步与确定性布尔门求值；Agent 步骤由当前 Session 执行
//   - 一句话导入：动态工具 flow_list/flow_read/flow_evaluate/flow_put/flow_delete，
//     自动绑定调用者当前 session（exec.agent.id / exec.agent.session.id）
```

</details>

**依据 3 · 源码核查**：[lib/index.js:44-46](https://github.com/kanghelyu/dsh-deepseek-flow/blob/87a4e8d43102c22f0e1f2b0cbd9af120de611310/lib/index.js#L44-L46)

背景assist超时默认值

```text
const AGENT_FINALIZE_TTL_MS = 30 * 60_000;
// 未配置 assistantTimeoutMs 时的兜底：挂死的子代理最多占用 10 分钟，之后可取消/超时释放。
const DEFAULT_ASSIST_TIMEOUT_MS = 10 * 60_000;
```

#### 缺口

- 后台取消、卸载及草稿恢复未在本次执行。
  **影响**：可能残留会话任务或未提交草稿。
  **进一步探讨**：先取消背景任务，导出文档并重开检查。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样检验编辑收益？

**研究主题**：新假设与验证

#### 完整回答

用同一分支流程比较纯Markdown与图文编辑，记录发现错误的准确率、变更耗时、图文差异和恢复。故障包括过期revision、审核时另写、文档中途失败和进程重启。若需要人工修复图文一致性、关键连接误审或额外审核超出收益，则退回Markdown和版本控制。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:496-512](https://github.com/kanghelyu/dsh-deepseek-flow/blob/87a4e8d43102c22f0e1f2b0cbd9af120de611310/lib/index.js#L496-L512)

审核竞争可构造

<details>
<summary>查看原文（17行）</summary>

```text
          const review = await runMainSessionTopologyReview(this.host, {
            ...request,
            baseFlow: reviewBase,
            staticIssues
          });
          // Agent 运行期间允许 Markdown 独立保存，但不允许另一个拓扑提交悄悄覆盖本草稿。
          const latest = await this.host.store.listFlow(sessionId, draftFlow.id);
          const latestBase = latest ?? emptyBase;
          if (topologySignature(latestBase) !== topologySignature(baseTopology)) {
            throw new Error("The saved topology changed while this review was running. The reviewed draft was not written; reload and apply again.");
          }
          const rebuilt = applyReviewedTopology(latestBase, draftFlow, review.topology);
          validateFlow(rebuilt);
          const result = await saveSessionFlow(this.host, rebuilt, sessionId, {
            ...(latest ? { expectedRevision: flowRevision(latest) } : {}),
            documentPolicy: "prefer-flow"
          });
```

</details>

**依据 2 · 源码核查**：[lib/dflow-store.js:25-35](https://github.com/kanghelyu/dsh-deepseek-flow/blob/87a4e8d43102c22f0e1f2b0cbd9af120de611310/lib/dflow-store.js#L25-L35)

revision冲突守卫

<details>
<summary>查看原文（11行）</summary>

```text
export function nextFlowRevision(incoming, current, options = {}) {
  if (!current) return 1;
  const actual = flowRevision(current);
  const rawExpected = options.expectedRevision ?? incoming?.revision;
  const expected = rawExpected === undefined || rawExpected === null || rawExpected === ""
    ? undefined
    : Number(rawExpected);
  if (options.force !== true && (!Number.isInteger(expected) || expected !== actual)) {
    throw new FlowRevisionConflictError(incoming?.id ?? current.id, expected, actual);
  }
  return actual + 1;
```

</details>

**依据 3 · 源码核查**：[lib/document-workflow.js:391-409](https://github.com/kanghelyu/dsh-deepseek-flow/blob/87a4e8d43102c22f0e1f2b0cbd9af120de611310/lib/document-workflow.js#L391-L409)

多文件中断点

<details>
<summary>查看原文（19行）</summary>

```text
  // WORKFLOW.md 是整个工作流的入口，因此必须先于分步文件落盘。
  const structureSignature = workflowStructureSignature(flow);
  const currentContent = String(flow.workflowContent ?? "").trimEnd();
  const workflowContent = (currentContent
    ? flow.workflowStructureSignature === structureSignature
      ? currentContent
      : refreshWorkflowStructure(currentContent, flow)
    : renderWorkflowDocument(flow)).trimEnd();
  const workflowPath = resolveInside(root, flow.workflowDoc ?? "WORKFLOW.md");
  await mkdir(dirname(workflowPath), { recursive: true });
  await writeIfChanged(workflowPath, `${workflowContent}\n`);

  const order = orderedNodeIds(flow);
  const nodeById = new Map(flow.nodes.map((node) => [node.id, node]));
  for (const [index, nodeId] of order.entries()) {
    const node = nodeById.get(nodeId);
    const path = resolveInside(root, flow.docs[nodeId]);
    await mkdir(dirname(path), { recursive: true });
    await writeIfChanged(path, `${nodeContent(node, index).trimEnd()}\n`);
```

</details>

#### 缺口

- 没有图文编辑任务对照。
  **影响**：无法确认效率和长期同步可靠性。
  **进一步探讨**：保留每轮图、文档摘要、revision和失败日志。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
