# dsh-wsl-vecmem

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[54c1f04](https://github.com/173787247/dsh-wsl-vecmem/tree/54c1f04ce3621bb6b436d25841ec1547776da2b3)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-vecmem)
<!-- END META -->

> **功能**：通过 Ollama 嵌入向量保存和检索 DSH 中的项目短记。

> **亮点**：[Q01](#research-q01) 将项目短记的写入和相似度查询接进 DSH 工具调用。[Q03](#research-q03) 把向量从 JSON 索引移到 Float32 文件，避免把向量解析成 JSON 数字。

> **主要限制**：[Q03](#research-q03) 文件长度异常只进入状态提示，查询仍可能返回列表。[Q02](#research-q02) 常规文本投影缺少检索阶段和信心字段，非空命中不足以判断是否找对事实。

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
  - [Q01 · 哪类项目短记适合放进这个库？](#detail-section-11)
  - [Q02 · 搜索结果及可信度从哪来？](#detail-section-12)
  - [Q03 · 双文件如何写入，发生故障能否阻止错误结果？](#detail-section-13)
  - [Q04 · 试用需要哪些条件和退出准备？](#detail-section-14)
  - [Q05 · 显式反馈检索阶段和健康状态能否减少错引？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：项目成员已经保留笔记原件，需要从 DSH 会话用自然语言找回小段项目事实。

原笔记的全文搜索保留可查的来源。语义工具的潜在增量是换一种措辞也能找到候选片段。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 状态 | 查看计数、路径和文件尺寸告警 | Ollama tags 可达不能证明模型可嵌入 |
| 写入短记 | 将项目片段与向量存到独立文件 | 内容发送到配置的嵌入地址，两文件写入需备份 |
| 语义检索 | 以余弦及可选重排返回候选 | 命名空间是过滤，检索文本不包含阶段和信心 |
| 清理 | 按 workspace 或全库删除 | 空范围表示全库，需先确认备份 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 声明的 Node 18+ 和 DSH 工具服务 | 启动必需 | 装载 Host 工具 | 需核对具体宿主配置 |
| 可达的 Ollama 和已配置模型 | 写入及搜索必需 | 生成向量 | 嵌入失败会使工具报错 |
| 可写的隔离路径和原件 | 安全验收所需 | 存储及恢复 | 无恢复材料不宜录入唯一副本 |
| 重排服务 | 可选 | 重排前 50 个候选 | 请求失败时通常退回向量排序，宿主超时需实测 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户准备独立测试路径和非敏感短记 | 两个服务地址、模型及原件均已核对 |
| 加载 | 用户按 DSH profile 接入并查状态 | 确认路径、计数和服务，实际写一条确认模型 |
| 核对 | 用户提交等义查询和无答案查询 | 与原件对照，并核对降级、工作区过滤和文件健康 |
| 退出 | 用户停用并返回笔记原件 | 保留两文件用于检查，需要清理时另行核对范围 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 模型磁盘及内存用量未知 | 核对模型、端点和测试 profile | Windows 与 WSL 路由需自查 |
| 持续使用 | 全表读取、向量化和候选重排实际资源未知 | 选材与核对答案时间未知 | 查询规模与模型共同影响耗时 |
| 失败恢复 | 重建所需计算及磁盘未知 | 从原件恢复及查错时间未知 | 需同时核对 JSON 与向量文件 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 语义回访 | 用向量余弦排序，按需调用重排 | 相对笔记全文搜索的召回与错引 |
| 本地保存 | 索引与固定宽度向量分开，默认指向回环地址 | 不同端点配置的实际网络范围和资源 |
| 诊断 | 状态有长度告警，内部搜索有阶段和分数 | 宿主和模型在收到诊断时是否改变处理 |

> **思考**：[Q03](#research-q03) 文件长度异常只进入状态提示，查询仍可能返回列表。[Q02](#research-q02) 常规文本投影缺少检索阶段和信心字段，非空命中不足以判断是否找对事实。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将项目短记的写入和相似度查询接进 DSH 工具调用。[Q03](#research-q03) 把向量从 JSON 索引移到 Float32 文件，避免把向量解析成 JSON 数字。

[Q03](#research-q03) Float32 固定宽度方便按行定位，但尺寸一致不能证明行和文本对应，更无法证明向量来自同一模型。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 文件长度异常只进入状态提示，查询仍可能返回列表。[Q02](#research-q02) 常规文本投影缺少检索阶段和信心字段，非空命中不足以判断是否找对事实。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先隔离存储路径并保留原件。用项目中已知正确答案的查询核对工具结果，再用不存在答案的查询检查错引。状态告警、配置不明或结果无法回查时回原件。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持工具、文件布局与候选重排的机制判断。检索质量、宿主行为与恢复成本待验证，诊断反馈是未验证设计。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/store.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本中检查 DSH 包、Host 注册、JSON 和 Float32 文件路径、HTTP 请求、查询及清理分支。未运行 WSL、Ollama、重排、插件测试或真实宿主。
- 下一步：以固定模型和人工标注的短记比较 Recall@K 与错引率，注入端点故障、双文件截断及同维模型变化，再检查恢复。

**分析版本**

- **仓库**：[173787247/dsh-wsl-vecmem](https://github.com/173787247/dsh-wsl-vecmem)
- **版本号**：0.2.0（[固定提交 54c1f04](https://github.com/173787247/dsh-wsl-vecmem/tree/54c1f04ce3621bb6b436d25841ec1547776da2b3)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 向调用者显示检索阶段，已知索引不一致时拒绝返回命中。用相同有答案和无答案查询比较错引率及有效召回，观察是否值得引入。

以固定模型和人工标注的短记比较 Recall@K 与错引率，注入端点故障、双文件截断及同维模型变化，再检查恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 124 | — | — | 568 |
| .js | source | 2 | 464 | 371 | 70 | — |
| .js | test | 1 | 56 | 50 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-vecmem/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-vecmem/issues?q=is%3Aissue+created%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-vecmem/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用户能否在 WSL 环境用可重建的项目短记做语义回访，并可靠分辨缺失、降级和无关结果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类项目短记适合放进这个库？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要反复找回已知项目事实的 DSH 用户，例如用不同措辞查询已确认的部署约定。相比在笔记原件里找关键字，插件让模型用工具显式存入短文本，再用 Ollama 向量找相关片段。合格结果是找对原有事实并能回到原件，语义得分本身不足以证明事实。Host apply 注册工具和提示，没有自动将会话或笔记库接入索引。workspace 是可选的调用参数，写入时落在元数据，查询时按字符串等值过滤，省略或空白时查询全库。调用方可以指定任意命名空间，所以它适用于个人项目分类，不能作为多用户访问控制。已知标题或精确标识符时直接查原件更容易校验。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-13](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/README.md#L5-L13)

作者的短文本定位和使用入口。

````text
本地向量小记：用 **Ollama embedding** + `~/.dsh/vecmem/store.json` 存短文本，供语义检索。

补 Obsidian / 笔记库，**不是** vault 替代品。依赖本机 Ollama（可与 [dsh-wsl-ollama](https://github.com/173787247/dsh-wsl-ollama) 同机）。

## 最短上手

```sh
ollama pull nomic-embed-text
dsh plugin --profile web add github:173787247/dsh-wsl-vecmem
````

**依据 2 · 源码核查**：[index.js:20-24](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/index.js#L20-L24)

注册工具用途提示。

```text
  ctx.systemPrompt.section({
    name: "tool:vecmem",
    order: 131,
    text: "dsh-wsl-vecmem stores short text snippets with Ollama embeddings in ~/.dsh/vecmem. Pass workspace to namespace crumbs (e.g. im:feishu). Use for project crumbs — not a replacement for Obsidian. Needs an embedding model (default nomic-embed-text).",
  });
```

**依据 3 · 源码核查**：[index.js:42-63](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/index.js#L42-L63)

写入由工具调用触发，工作区可选。

<details>
<summary>查看原文（22行）</summary>

```text
  ctx.tools.register({
    name: "vecmem_add",
    description: "Embed and store a text snippet locally. Optional workspace namespaces into meta.workspace.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["text"],
      properties: {
        text: { type: "string" },
        workspace: { type: "string", description: "Optional namespace stored as meta.workspace (e.g. im:feishu)." },
        meta: { type: "object", additionalProperties: true },
      },
    },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v) }] },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await vm.add(args || {});
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
```

</details>

**依据 4 · 源码核查**：[lib/store.js:218-234](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/lib/store.js#L218-L234)

文本和元数据写入路径。

<details>
<summary>查看原文（17行）</summary>

```text
    async add({ text, meta, workspace } = {}) {
      const body = String(text || "").trim();
      if (!body) throw new Error("text required");
      if (store.list().length >= maxItems) throw new Error(`store full (maxItems=${maxItems})`);
      const embedding = await embed(body);
      const m = meta && typeof meta === "object" ? { ...meta } : {};
      const ws = normalizeWorkspace(workspace);
      if (ws) m.workspace = ws;
      const item = {
        id: randomUUID(),
        text: body.slice(0, 8000),
        meta: m,
        embedding,
        createdAt: new Date().toISOString(),
      };
      store.add(item);
      return { ok: true, id: item.id, dims: embedding.length, workspace: m.workspace || null };
```

</details>

**依据 5 · 源码核查**：[lib/store.js:253-264](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/lib/store.js#L253-L264)

省略 workspace 则不做过滤。

<details>
<summary>查看原文（12行）</summary>

```text
    async search({ query, topK = 5, workspace } = {}) {
      const q = String(query || "").trim();
      if (!q) throw new Error("query required");
      const qe = await embed(q);
      const ws = normalizeWorkspace(workspace);
      let items = store.all();
      if (ws) items = items.filter((it) => it.meta?.workspace === ws);

      const scored = items.map((it) => ({
        id: it.id, text: it.text, meta: it.meta,
        score: cosine(qe, it.embedding),
      }));
```

</details>

#### 缺口

- 未对照语义搜索、关键词搜索和直接查笔记
  **影响**：语义改写场景的召回增量与查错代价未知
  **进一步探讨**：用已有项目短记和人工标注的等义查询做盲测，另计无答案时误用结果

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 搜索结果及可信度从哪来？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

搜索先对查询做 Ollama embedding，对读取的向量逐条算余弦并排序，默认截取 50 条候选后可向独立 reranker 发送查询和候选原文。候选在调用重排前已截断，所以 topK 超过池大小也取不回池外项。重排请求失败、响应非成功或无 results 时保留原来的向量顺序。成功时按 results 返回的索引重组候选，采用重排 score，且未显式校验索引和分数的范围与类型。

store 返回 stage、confidence 和 poolSize，confidence 对向量余弦与重排分数共用 0.15、0.45 阈值，源码没有校准到同一量纲。confidence 为 none 或 weak 时也会返回命中。DSH 工具的文本渲染只拼接得分和正文，未带 stage、confidence 或 poolSize。仅看这段文本无法判断是否退回向量排序，也不能把非空结果读作有可信答案。宿主是否有另一个界面会展示结构化字段仍需验收。

#### 证据与依据

**依据 1 · 源码核查**：[lib/store.js:159-167](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/lib/store.js#L159-L167)

候选池和重排地址默认值。

```text
export function createVecmem({
  storePath,
  ollamaBase = "http://127.0.0.1:11434",
  embedModel = "nomic-embed-text",
  timeoutMs = 60_000,
  maxItems = 500_000,
  rerankerUrl = process.env.DSH_RERANKER_URL || "http://127.0.0.1:8790/rerank",
  rerankPool = 50,
  fetchImpl = fetch,
```

**依据 2 · 源码核查**：[lib/store.js:253-273](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/lib/store.js#L253-L273)

全表比较、排序和候选截断。

<details>
<summary>查看原文（21行）</summary>

```text
    async search({ query, topK = 5, workspace } = {}) {
      const q = String(query || "").trim();
      if (!q) throw new Error("query required");
      const qe = await embed(q);
      const ws = normalizeWorkspace(workspace);
      let items = store.all();
      if (ws) items = items.filter((it) => it.meta?.workspace === ws);

      const scored = items.map((it) => ({
        id: it.id, text: it.text, meta: it.meta,
        score: cosine(qe, it.embedding),
      }));
      scored.sort((a, b) => b.score - a.score);
      // ★ 这里原来写死 Math.min(20, ...)。后果不是"最多给 20 条"，而是
      //   调用方【无法区分】"只有 20 条相关"和"池子里就这么多"。我复查一次
      //   检索缺陷时就被它误导：topK=50 拿到 20 条，我据此说"前 50 名里没有"，
      //   而实际只看了前 20。静默的上限会让诊断结论出错。
      const want = Math.max(1, Math.min(topK, scored.length));

      let pool = scored.slice(0, Math.min(rerankPool, scored.length));
      let reranked = false;
```

</details>

**依据 3 · 源码核查**：[lib/store.js:274-293](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/lib/store.js#L274-L293)

重排发送原文，失败保留初始池。

<details>
<summary>查看原文（20行）</summary>

```text
      if (rerankerUrl && pool.length > 1) {
        try {
          const res = await fetchImpl(rerankerUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: q, documents: pool.map((h) => h.text), top_k: pool.length }),
            signal: AbortSignal.timeout?.(120_000),
          });
          if (res.ok) {
            const body = await res.json();
            if (Array.isArray(body.results) && body.results.length) {
              pool = body.results.map((r) => ({ ...pool[r.index], score: r.score }));
              reranked = true;
            }
          }
        } catch {
          // Service down, still loading, or the port is not reachable from here.
          // Fall through with the embedding order.
        }
      }
```

</details>

**依据 4 · 源码核查**：[lib/store.js:295-318](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/lib/store.js#L295-L318)

结构化诊断与统一阈值，低信心也保留 hits。

<details>
<summary>查看原文（24行）</summary>

```text
      const hits = pool.slice(0, want);
      // ★ 一个裸列表说不出"找到了"还是"没有"。实测：问「报名了什么考试」
      //   时全部分数落在 0.0274..0.0028，而库里其实有那条数据 —— 换个贴切的
      //   问法能拿 0.99。低分不是排序错，是向量空间里没有匹配。
      //   把这件事报出来，调用方才分得清"有结果"和"没结果"。
      const top = hits.length ? hits[0].score : 0;
      const confidence =
        !hits.length ? "none"
        : top < 0.15 ? "none"        // 全库最高分都不到 0.15：没有可信匹配
        : top < 0.45 ? "weak"
        : "strong";
      return {
        ok: true,
        workspace: ws || null,
        reranked,
        // Say which stage produced the order. Without this a silently
        // unavailable reranker looks exactly like a reranker that agreed.
        stage: reranked ? "rerank" : "embedding",
        // ★ 调用方应按这个字段决定"要不要信这批结果"，而不是看列表非空
        confidence,
        topScore: Number(top.toFixed(4)),
        poolSize: pool.length,
        hits,
      };
```

</details>

**依据 5 · 源码核查**：[index.js:82-103](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/index.js#L82-L103)

工具文本渲染没有传出诊断字段。

<details>
<summary>查看原文（22行）</summary>

```text
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text:
            v.ok === false
              ? v.error
              : (v.hits || []).map((h) => `[${h.score.toFixed(3)}] ${h.text}`).join("\n\n") || "(no hits)",
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await vm.search(args || {});
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "Vecmem search" }),
```

</details>

#### 缺口

- 无固定语料和两种排序分数的校准结果
  **影响**：不能从阈值推导置信概率或业务准确率
  **进一步探讨**：按有答案、无答案、重排可用及不可用分组测 Recall@K 和错误引用

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 双文件如何写入，发生故障能否阻止错误结果？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

JSON 存正文、元数据和维数，原始 Float32 sidecar 按行存向量。相较把每个数字编码成 JSON 文本，这种布局避免解析十进制向量，追加时仍重写 JSON 索引，搜索仍整文件读取并展开向量。顺序是先追加向量、再写 JSON，中途终止会留下不匹配的两文件。load 按字节数填 __mismatch，status 会回传 warning，但 all 和 add 没有因此停止。搜索继续用 all 取向量，短行以空向量代替，余弦遇空或维数不符返回 0，搜索可能返回看似正常的列表。JSON 无法解析时 load 视为空库，后续追加可能让剩余向量与索引错配。字节数检查也识别不了同维度模型切换导致的语义错配。

同一进程中同步文件操作能缩小交错窗口，但多个进程共用文件缺少锁或事务，不能据此保证并发一致性。容量检查在等待 embedding 之前，多个并发调用可能同时通过上限检查。clear 在工作区参数缺失或为空白时清空两文件，指定工作区则重写两文件，无回滚路径。应保留独立原始笔记和两文件快照，避免把这里作为唯一事实来源。

#### 证据与依据

**依据 1 · 源码核查**：[lib/store.js:30-41](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/lib/store.js#L30-L41)

空向量及不同维度返回零分。

<details>
<summary>查看原文（12行）</summary>

```text
export function cosine(a, b) {
  if (!a?.length || a.length !== b?.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const d = Math.sqrt(na) * Math.sqrt(nb);
  return d ? dot / d : 0;
```

</details>

**依据 2 · 源码核查**：[lib/store.js:51-74](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/lib/store.js#L51-L74)

默认文件名和读取异常、尺寸检查。

<details>
<summary>查看原文（24行）</summary>

```text
export function createStore(storePath) {
  const path = storePath || join(homedir(), ".dsh", "vecmem", "store.json");
  const vecPath = path.replace(/\.json$/, "") + ".vectors.f32";
  mkdirSync(dirname(path), { recursive: true });

  function load() {
    if (!existsSync(path)) return { ...EMPTY, items: [] };
    let db;
    try {
      db = JSON.parse(readFileSync(path, "utf8"));
    } catch {
      return { ...EMPTY, items: [] };
    }
    // Refuse to hand back a store whose two halves disagree. Reporting it is
    // the only safe option: the alternative is scores that look plausible.
    if (db.version === 2 && db.dims) {
      const bytes = existsSync(vecPath) ? statSync(vecPath).size : 0;
      const expected = db.items.length * db.dims * 4;
      if (bytes !== expected) {
        db.__mismatch = `vectors.f32 is ${bytes} bytes, expected ${expected} for ${db.items.length} items x ${db.dims} dims`;
      }
    }
    return db;
  }
```

</details>

**依据 3 · 源码核查**：[lib/store.js:89-111](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/lib/store.js#L89-L111)

all 未消费 mismatch 并对短行回退为空向量。

<details>
<summary>查看原文（23行）</summary>

```text
  return {
    path,
    vectorPath: vecPath,
    dims() { return load().dims ?? 0; },
    mismatch() { return load().__mismatch ?? null; },

    list() {
      return load().items.map(({ id, text, meta, createdAt }) => ({ id, text, meta, createdAt }));
    },

    all() {
      const db = load();
      if (!db.dims || !db.items.length) return [];
      // One read for the whole matrix beats one syscall per row.
      let buf = null;
      try { buf = readFileSync(vecPath); } catch { /* missing sidecar */ }
      return db.items.map((it, i) => ({
        ...it,
        embedding: buf && buf.length >= (i + 1) * db.dims * 4
          ? Array.from(new Float32Array(buf.buffer, buf.byteOffset + i * db.dims * 4, db.dims))
          : [],
      }));
    },
```

</details>

**依据 4 · 源码核查**：[lib/store.js:113-154](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/lib/store.js#L113-L154)

追加与清理按两次文件写入进行，没有锁和回滚。

<details>
<summary>查看原文（42行）</summary>

```text
    add(item) {
      const db = load();
      const dims = item.embedding?.length ?? 0;
      if (!dims) throw new Error("embedding required");
      if (db.dims && db.dims !== dims) {
        throw new Error(`dimension mismatch: store holds ${db.dims}-dim vectors, this one is ${dims}. Re-index before mixing models.`);
      }
      const { embedding, ...rest } = item;
      db.items.push(rest);
      db.dims = dims;
      db.version = 2;
      // Vector first, then the index. A crash between them leaves an extra
      // trailing vector, which the byte-count check reports as a mismatch
      // rather than as a wrong answer.
      appendFileSync(vecPath, Buffer.from(new Float32Array(embedding).buffer));
      writeFileSync(path, JSON.stringify({ version: 2, dims: db.dims, items: db.items }));
      return rest;
    },

    clear(workspace) {
      const ws = normalizeWorkspace(workspace);
      const db = load();
      const before = db.items.length;
      if (!ws) {
        writeFileSync(path, JSON.stringify({ version: 2, dims: 0, items: [] }));
        writeFileSync(vecPath, Buffer.alloc(0));
        return { removed: before, remaining: 0 };
      }
      // Keep the rows that survive, in order, so the sidecar stays aligned.
      const keep = [];
      const keepVec = [];
      const buf = existsSync(vecPath) ? readFileSync(vecPath) : Buffer.alloc(0);
      for (const [i, it] of db.items.entries()) {
        if (it.meta?.workspace === ws) continue;
        keep.push(it);
        if (db.dims && buf.length >= (i + 1) * db.dims * 4) {
          keepVec.push(buf.subarray(i * db.dims * 4, (i + 1) * db.dims * 4));
        }
      }
      writeFileSync(vecPath, keepVec.length ? Buffer.concat(keepVec) : Buffer.alloc(0));
      writeFileSync(path, JSON.stringify({ version: 2, dims: keep.length ? db.dims : 0, items: keep }));
      return { removed: before - keep.length, remaining: keep.length };
```

</details>

**依据 5 · 源码核查**：[lib/store.js:204-222](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/lib/store.js#L204-L222)

status 报告 warning，容量判断早于 embedding。

<details>
<summary>查看原文（19行）</summary>

```text
    async status() {
      const count = store.list().length;
      const mismatch = store.mismatch();
      try {
        const res = await fetchImpl(`${root}/api/tags`, { signal: AbortSignal.timeout?.(5000) });
        return { ok: true, storePath: store.path, vectorPath: store.vectorPath,
          embedModel, dims: store.dims(), ollama: res.ok, count, rerankerUrl,
          ...(mismatch ? { warning: mismatch } : {}) };
      } catch (e) {
        return { ok: true, storePath: store.path, vectorPath: store.vectorPath, embedModel,
          ollama: false, error: e instanceof Error ? e.message : String(e), count,
          ...(mismatch ? { warning: mismatch } : {}) };
      }
    },
    async add({ text, meta, workspace } = {}) {
      const body = String(text || "").trim();
      if (!body) throw new Error("text required");
      if (store.list().length >= maxItems) throw new Error(`store full (maxItems=${maxItems})`);
      const embedding = await embed(body);
```

</details>

**依据 6 · 源码核查**：[lib/store.js:253-264](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/lib/store.js#L253-L264)

搜索接到 all，没有预检健康状态。

<details>
<summary>查看原文（12行）</summary>

```text
    async search({ query, topK = 5, workspace } = {}) {
      const q = String(query || "").trim();
      if (!q) throw new Error("query required");
      const qe = await embed(q);
      const ws = normalizeWorkspace(workspace);
      let items = store.all();
      if (ws) items = items.filter((it) => it.meta?.workspace === ws);

      const scored = items.map((it) => ({
        id: it.id, text: it.text, meta: it.meta,
        score: cosine(qe, it.embedding),
      }));
```

</details>

**依据 7 · 源码核查**：[index.js:107-125](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/index.js#L107-L125)

模型工具允许省略清理范围。

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.tools.register({
    name: "vecmem_clear",
    description: "Clear local vector memory. With workspace, removes only that meta.workspace; otherwise clears all.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        workspace: { type: "string", description: "If set, only remove items with matching meta.workspace." },
      },
    },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v) }] },
    timeoutMs: 10_000,
    isConcurrencySafe: () => false,
    async execute(args) {
      try {
        return vm.clear(args || {});
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
```

</details>

#### 缺口

- 没有断电、写失败、跨进程并发和实际资源曲线的结果
  **影响**：源码可推导出故障路径，不能给出故障发生率或最大可靠容量
  **进一步探讨**：在临时库注入写入中断和同维度模型变更，再检查 status、搜索、重建和真实命中

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 试用需要哪些条件和退出准备？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

包以 DSH bundle patch 装入 tools 和 systemPrompt，作者面向 WSL 的 Web profile。Node 版本声明为 18+，Ollama embedding 模型需从 Host 可访问，Windows 部署要检查 WSL 到端点的实际路由。status 对 /api/tags 的探测只判断响应，需用一条非敏感片段跑 add 和 search 才能确认 embedding。embedding 请求会向指定端点发送截断后的文本，重排默认尝试本机另一个端点，也可由环境变量改指其他地址并发送候选原文。先核对两个地址与保留策略。外层工具默认超时 60 秒，重排请求内部设置 120 秒且未接收外层取消信号，不能把内部降级当作宿主总能在期限内返回的保证。

适合先观察，有条件在单进程、隔离路径、可重建的非敏感短记上验收。检查 JSON 与向量文件一致、不同 workspace 的过滤、关掉重排后的返回状态、显式清理边界和从原件重建。禁用插件后回原笔记搜索，源码的禁用分支没有主动删除已存文件。不要用 clear 当退出步骤。性能、排障时间与模型资源量未测。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:9-13](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/package.json#L9-L13)

Node 版本与 bundle 配置声明。

```text
  "engines": { "node": ">=18" },
  "scripts": { "test": "node --test test/*.test.js" },
  "files": ["index.js", "lib", "cordis.patch.yml", "README.md", "README.en.md", "README.zh.md", "LICENSE", "CHANGELOG.md"],
  "keywords": ["dsh-plugin", "wsl", "embeddings", "memory"],
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
```

**依据 2 · 作者声明**：[README.md:11-14](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/README.md#L11-L14)

作者给出的模型与 Web profile 安装步骤。

````text
```sh
ollama pull nomic-embed-text
dsh plugin --profile web add github:173787247/dsh-wsl-vecmem
```
````

**依据 3 · 作者声明**：[README.md:28-36](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/README.md#L28-L36)

作者说明 Windows 上的 Ollama 需从 WSL 可达。

````text
  enabled: true
  storePath: ""            # 空 = ~/.dsh/vecmem/store.json
  ollamaBase: "http://127.0.0.1:11434"
  embedModel: "nomic-embed-text"
  timeoutMs: 60000
  maxItems: 5000
```

Ollama 在 Windows 时，把 `ollamaBase` 改成可从 WSL 访问的地址（见 ollama 插件说明）。
````

**依据 4 · 源码核查**：[index.js:3-18](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/index.js#L3-L18)

Host 依赖、配置和禁用路径。

<details>
<summary>查看原文（16行）</summary>

```text
export const name = "dsh-wsl-vecmem";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-vecmem] disabled");
    return;
  }
  const vm = createVecmem({
    storePath: config.storePath || process.env.DSH_VECMEM_PATH || "",
    ollamaBase: config.ollamaBase || process.env.DSH_OLLAMA_BASE || "http://127.0.0.1:11434",
    embedModel: config.embedModel || process.env.DSH_VECMEM_MODEL || "nomic-embed-text",
    timeoutMs: positive(config.timeoutMs, 60_000),
    maxItems: positive(config.maxItems, 5000),
  });
  console.log(`[dsh-wsl-vecmem] store=${vm.storePath} embedModel=${vm.embedModel}`);
```

</details>

**依据 5 · 源码核查**：[index.js:94-101](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/index.js#L94-L101)

工具层超时和调用。

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await vm.search(args || {});
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
```

**依据 6 · 源码核查**：[lib/store.js:159-194](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/lib/store.js#L159-L194)

可配置服务地址、文本截断和 embedding 请求。

<details>
<summary>查看原文（36行）</summary>

```text
export function createVecmem({
  storePath,
  ollamaBase = "http://127.0.0.1:11434",
  embedModel = "nomic-embed-text",
  timeoutMs = 60_000,
  maxItems = 500_000,
  rerankerUrl = process.env.DSH_RERANKER_URL || "http://127.0.0.1:8790/rerank",
  rerankPool = 50,
  fetchImpl = fetch,
} = {}) {
  const store = createStore(storePath);
  const root = String(ollamaBase).replace(/\/$/, "");

  async function embed(text) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      // nomic rejected input past its 512-token window with a plain 500. Budget
      // by script, not by character count: CJK runs 1-2 tokens per character
      // against roughly 0.25 for Latin.
      const cjk = (text.match(/[\u4e00-\u9fff]/g) ?? []).length;
      const ratio = text.length ? cjk / text.length : 0;
      const cap = ratio > 0.3 ? 2500 : ratio > 0.1 ? 4000 : 6000;
      const prompt = text.length > cap ? text.slice(0, cap) : text;

      const res = await fetchImpl(`${root}/api/embeddings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: embedModel, prompt }),
        signal: ctrl.signal,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || `embed HTTP ${res.status}`);
      const emb = json.embedding || json.embeddings?.[0];
      if (!emb?.length) throw new Error("empty embedding");
      return emb;
```

</details>

**依据 7 · 源码核查**：[lib/store.js:204-215](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/lib/store.js#L204-L215)

状态只探测 tags，而非模型推理。

<details>
<summary>查看原文（12行）</summary>

```text
    async status() {
      const count = store.list().length;
      const mismatch = store.mismatch();
      try {
        const res = await fetchImpl(`${root}/api/tags`, { signal: AbortSignal.timeout?.(5000) });
        return { ok: true, storePath: store.path, vectorPath: store.vectorPath,
          embedModel, dims: store.dims(), ollama: res.ok, count, rerankerUrl,
          ...(mismatch ? { warning: mismatch } : {}) };
      } catch (e) {
        return { ok: true, storePath: store.path, vectorPath: store.vectorPath, embedModel,
          ollama: false, error: e instanceof Error ? e.message : String(e), count,
          ...(mismatch ? { warning: mismatch } : {}) };
```

</details>

**依据 8 · 源码核查**：[lib/store.js:274-292](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/lib/store.js#L274-L292)

候选文本请求以及内部重排超时。

<details>
<summary>查看原文（19行）</summary>

```text
      if (rerankerUrl && pool.length > 1) {
        try {
          const res = await fetchImpl(rerankerUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: q, documents: pool.map((h) => h.text), top_k: pool.length }),
            signal: AbortSignal.timeout?.(120_000),
          });
          if (res.ok) {
            const body = await res.json();
            if (Array.isArray(body.results) && body.results.length) {
              pool = body.results.map((r) => ({ ...pool[r.index], score: r.score }));
              reranked = true;
            }
          }
        } catch {
          // Service down, still loading, or the port is not reachable from here.
          // Fall through with the embedding order.
        }
```

</details>

#### 缺口

- 未验证 WSL 宿主从超时到取消的传播及 CPU、磁盘成本
  **影响**：无法保证延迟和可恢复性达到日常采用门槛
  **进一步探讨**：在隔离 profile 先以少量短记测最慢响应和恢复，再扩大到目标库大小

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 显式反馈检索阶段和健康状态能否减少错引？

**研究主题**：新假设与验证

#### 完整回答

可以验证在模型可见的工具文本中展示阶段和降级，并在已知索引不一致时拒绝给出命中，能否减少模型将相似片段当事实引用。依据是现有 store 已输出 stage 和 confidence，status 另有字节长度警告，search 的文本渲染没有带上这两类信息。先区分 embedding 与 rerank 的分值，不将现有统一阈值直接升级为可采信门槛。用相同模型和有答案、无答案的短记查询，加入重排不可用、维数变化及 sidecar 截断，比较现有文本和带诊断版本的错误引用率、正确回答率、恢复时间。若错引未减少，或有效结果被过度拒绝，则否定这项改法。该方向尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/store.js:204-215](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/lib/store.js#L204-L215)

文件尺寸警告已有独立状态接口。

<details>
<summary>查看原文（12行）</summary>

```text
    async status() {
      const count = store.list().length;
      const mismatch = store.mismatch();
      try {
        const res = await fetchImpl(`${root}/api/tags`, { signal: AbortSignal.timeout?.(5000) });
        return { ok: true, storePath: store.path, vectorPath: store.vectorPath,
          embedModel, dims: store.dims(), ollama: res.ok, count, rerankerUrl,
          ...(mismatch ? { warning: mismatch } : {}) };
      } catch (e) {
        return { ok: true, storePath: store.path, vectorPath: store.vectorPath, embedModel,
          ollama: false, error: e instanceof Error ? e.message : String(e), count,
          ...(mismatch ? { warning: mismatch } : {}) };
```

</details>

**依据 2 · 源码核查**：[lib/store.js:300-318](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/lib/store.js#L300-L318)

已有 stage 和统一阈值，尚不代表可校准。

<details>
<summary>查看原文（19行）</summary>

```text
      const top = hits.length ? hits[0].score : 0;
      const confidence =
        !hits.length ? "none"
        : top < 0.15 ? "none"        // 全库最高分都不到 0.15：没有可信匹配
        : top < 0.45 ? "weak"
        : "strong";
      return {
        ok: true,
        workspace: ws || null,
        reranked,
        // Say which stage produced the order. Without this a silently
        // unavailable reranker looks exactly like a reranker that agreed.
        stage: reranked ? "rerank" : "embedding",
        // ★ 调用方应按这个字段决定"要不要信这批结果"，而不是看列表非空
        confidence,
        topScore: Number(top.toFixed(4)),
        poolSize: pool.length,
        hits,
      };
```

</details>

**依据 3 · 源码核查**：[index.js:82-92](https://github.com/173787247/dsh-wsl-vecmem/blob/54c1f04ce3621bb6b436d25841ec1547776da2b3/index.js#L82-L92)

工具默认文本投影省略阶段和诊断。

<details>
<summary>查看原文（11行）</summary>

```text
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text:
            v.ok === false
              ? v.error
              : (v.hits || []).map((h) => `[${h.score.toFixed(3)}] ${h.text}`).join("\n\n") || "(no hits)",
        },
      ],
```

</details>

#### 缺口

- 缺少模型对诊断字段的实际响应
  **影响**：无法判断提示是否能促成拒答或恢复
  **进一步探讨**：在同题集和固定模型下记录错引、拒答和有效命中

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
