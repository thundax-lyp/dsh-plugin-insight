# dsh-wsl-vecmem

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[c092a92](https://github.com/173787247/dsh-wsl-vecmem/tree/c092a92892fa63aab5e4a18f0cd2cd4b1eb81d29)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-vecmem)
<!-- END META -->

> **实现功能**：用本地 Ollama embedding 保存短文本，并按工作区进行语义检索。

> **核心亮点**：相对把向量直接写 JSON，它把元数据与 Float32 矩阵分离并检测双文件漂移，改善数千条规模的空间和解析负担；业务上仍是轻量碎片库。 [Q03](#research-q03)

> **风险与缺陷**：双文件写入不是原子事务，崩溃只会被检测而不会自动修复；检索质量依赖本地模型、文本切分和可选 reranker，且缺少任务结果对照。 [Q04](#research-q04)

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
  - [Q01 · 谁在何种任务中使用，原有办法和合格结果是什么？](#detail-section-11)
  - [Q02 · 能力如何从入口、注册、调用到状态变化实现？](#detail-section-12)
  - [Q03 · 相对原生能力或简单替代，固定版本增加了什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使核心价值不成立？](#detail-section-14)
  - [Q05 · 启动、持续生效和失败恢复分别依赖什么？](#detail-section-15)
  - [Q06 · 首次、持续与失败恢复成本及效果证据如何？](#detail-section-16)
  - [Q07 · 实现有哪些可靠性取舍和可复用设计？](#detail-section-17)
  - [Q08 · 由贡献和限制能推导什么未验证方向？](#detail-section-18)
  - [Q09 · 对什么人值得观察或试用，成功与停止条件是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要保存项目碎片而不想上云的 DSH 用户，把短文本写入本地向量库并按 workspace 检索。 [Q01](#research-q01)

基线是普通文本/JSON 检索或成熟向量库；插件更轻且本地，但缺少事务、索引和复杂过滤能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 短文本写入 | 生成 embedding 并保存文本、元数据与向量。 | 仅由固定版本源码确认；运行效果未验证 |
| 语义检索 | 按余弦相似度和 workspace 返回命中。 | 仅由固定版本源码确认；运行效果未验证 |
| 状态与清理 | 报告存储状态并按范围清除。 | 仅由固定版本源码确认；运行效果未验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Ollama 与 embedding 模型 | 必需 | add/search 生成向量 | 网络/模型错误，不能写入或查询 |
| store.json 与 vectors.f32 写权限 | 必需 | 保存元数据和 Float32 行 | 写失败或双文件 mismatch |
| 稳定 embedding 维度/模型指纹 | 必需 | 保持余弦可比 | 维度变化被拒绝，模型语义变化尚未标记 |
| workspace 规范与可重建源文本 | 安全采用必需 | 过滤范围和故障重建 | 空 workspace 可能混搜，损坏后难恢复 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|---|
| 状态检查 | Agent 调 status 核对模型、路径、条数和 mismatch | 模型可达且两文件尺寸一致 |
| 写入 | add 生成向量，先 append sidecar 后写索引 | 维度一致，返回 id；失败不继续检索 |
| 检索 | search 生成查询向量并按 workspace/topK 排序 | 命中来源可识别且不跨空间 |
| 清理/恢复 | 按 workspace clear 或从源文本重建 | 两文件行数保持一致，不手工拼接损坏数据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Ollama 模型下载、CPU/GPU、磁盘 | 选模型、store、workspace 与重建源 | 初始索引时间未知 |
| 持续使用 | 每次 embedding、O(n) 扫描、Float32 字节 | 标注片段、检查命中与清理 | p50/p95 和字节/条未知 |
| 失败恢复 | 重新 embedding 全量语料 | 识别 mismatch、恢复源文本、重建 | 崩溃/并发恢复率未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 空间结构 | 向量从 JSON 分离为 Float32 sidecar | 真实磁盘节省与 mmap/扫描上限 |
| 一致性检测 | 字节数与 items×dims 比较 | 检测后能否自动恢复 |
| 语义检索 | Ollama embedding、cosine、workspace 过滤存在 | Recall@K、模型迁移与隔离正确性 |

> **思考**：双文件写入不是原子事务，崩溃只会被检测而不会自动修复；检索质量依赖本地模型、文本切分和可选 reranker，且缺少任务结果对照。 [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对把向量直接写 JSON，它把元数据与 Float32 矩阵分离并检测双文件漂移，改善数千条规模的空间和解析负担；业务上仍是轻量碎片库。 [Q03](#research-q03)

相对把向量直接写 JSON，它把元数据与 Float32 矩阵分离并检测双文件漂移，改善数千条规模的空间和解析负担；业务上仍是轻量碎片库。 [Q03](#research-q03)

Float32 sidecar 和尺寸一致性检查直接回应大 JSON 的扩展瓶颈，设计可借鉴；写入顺序只能暴露不一致，尚缺恢复、锁与并发事务。

<a id="detail-section-5"></a>

### 1.4 主要限制

双文件写入不是原子事务，崩溃只会被检测而不会自动修复；检索质量依赖本地模型、文本切分和可选 reranker，且缺少任务结果对照。 [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

适合少量、非敏感、可重建的项目碎片先观察；需要事务、并发写、强隔离或不可丢数据的团队应使用成熟存储。若 5k 条内检索延迟与 Recall 达标、workspace 零串漏、模型变更被拒绝且崩溃后可从源文本重建，再考虑试用；出现 sidecar mismatch 无可控恢复或并发丢写即停止。 [Q09](#research-q09)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为固定版本源码支持的实现与集成增量；效果和真实宿主可用性未验证。未来设计假设保持未验证，不计入插件现有能力。

- 已检查：作者 README、包清单、源码路径 README.md、lib/store.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定提交的作者材料、入口和关键实现；未运行插件、测试、外部服务或真实宿主，也未核验独立用户反馈。
- 下一步：用 1k/5k 条带相关性金标和两个 workspace 的可重建语料，测索引秒数、磁盘/条、search p50/p95 与 Recall@K；在 append vector 后杀进程并并发执行 add，确认 mismatch 被发现且可从源重建。串漏、丢写或 5k 条延迟超门槛即转成熟向量库。

**分析版本**

- **仓库**：[173787247/dsh-wsl-vecmem](https://github.com/173787247/dsh-wsl-vecmem)
- **版本号**：0.2.0（[固定提交 c092a92](https://github.com/173787247/dsh-wsl-vecmem/tree/c092a92892fa63aab5e4a18f0cd2cd4b1eb81d29)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可加入写前 journal 与原子索引切换，并记录 embedding 模型指纹；模型变更时显式进入重建队列而不是混写或静默失配。 [Q08](#research-q08)

用 1k/5k 条带相关性金标和两个 workspace 的可重建语料，测索引秒数、磁盘/条、search p50/p95 与 Recall@K；在 append vector 后杀进程并并发执行 add，确认 mismatch 被发现且可从源重建。串漏、丢写或 5k 条延迟超门槛即转成熟向量库。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 124 | — | — | 568 |
| .js | source | 2 | 464 | 371 | 70 | — |
| .js | test | 1 | 56 | 50 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-vecmem/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：研究 dsh-wsl-vecmem 在固定版本中的实现贡献、成立条件、关键限制、采用价值与可证伪的新设计方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种任务中使用，原有办法和合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

面向需要保存项目碎片而不想上云的 DSH 用户，把短文本写入本地向量库并按 workspace 检索。 合格结果不是“工具被调用”，而是用户能在既定边界内得到可复核产物。基线是普通文本/JSON 检索或成熟向量库；插件更轻且本地，但缺少事务、索引和复杂过滤能力。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-20](https://github.com/173787247/dsh-wsl-vecmem/blob/c092a92892fa63aab5e4a18f0cd2cd4b1eb81d29/README.md#L1-L20)

作者材料说明目标用户、安装方式、主要能力和已知边界。

<details>
<summary>查看原文（20行）</summary>

````text
# dsh-wsl-vecmem

> **语言：** **中文**（本页） · [English](./README.en.md)

本地向量小记：用 **Ollama embedding** + `~/.dsh/vecmem/store.json` 存短文本，供语义检索。

补 Obsidian / 笔记库，**不是** vault 替代品。依赖本机 Ollama（可与 [dsh-wsl-ollama](https://github.com/173787247/dsh-wsl-ollama) 同机）。

## 最短上手

```sh
ollama pull nomic-embed-text
dsh plugin --profile web add github:173787247/dsh-wsl-vecmem
```

## 工具

| 工具 | 作用 |
|------|------|
| `vecmem_status` | store 路径、embed 模型、条数 |
````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 能力如何从入口、注册、调用到状态变化实现？

**研究主题**：功能与机制

#### 完整回答

工具调用 Ollama 生成 embedding，元数据写 JSON、Float32 向量写 sidecar；加载时校验维度与字节数，检索计算余弦并可按工作区过滤。 源码可以确认注册和数据流存在，但不能据此推断宿主加载、外部服务或最终效果已经通过。

#### 证据与依据

**依据 1 · 源码核查**：[lib/store.js:1-40](https://github.com/173787247/dsh-wsl-vecmem/blob/c092a92892fa63aab5e4a18f0cd2cd4b1eb81d29/lib/store.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * vecmem storage: metadata in JSON, vectors in a raw Float32 sidecar.
 *
 * The first version kept embeddings inside store.json as decimal numbers. That
 * is 5.5x larger than the same data as Float32, and it is all cost with no
 * benefit -- nobody reads a vector by eye. Measured on a real store:
 *
 *     4610 items, 4096 dims, JSON      400 MB   (96% of it vector text)
 *     4610 items, 4096 dims, Float32    76 MB
 *
 * Worse than the size: load() ran JSON.parse over the whole file on every call
 * and save() rewrote all of it. At 20,000 items each add() would parse ~1.7 GB.
 * The store could not have grown past a few thousand entries no matter what
 * maxItems said.
 *
 * Layout:
 *   store.json    { version, dims, items: [{id, text, meta, createdAt}] }
 *   vectors.f32   items.length x dims float32, row i belongs to items[i]
 *
 * Two files can drift apart if a write is interrupted. dims and the item count
 * are both checked on load, and a mismatch is reported rather than silently
 * producing garbage similarity scores -- a dimension mismatch returns NaN from
 * cosine(), and sorting NaN gives an arbitrary order with no error at all.
 */
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync, openSync, readSync, closeSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { randomUUID } from "node:crypto";

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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对原生能力或简单替代，固定版本增加了什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对把向量直接写 JSON，它把元数据与 Float32 矩阵分离并检测双文件漂移，改善数千条规模的空间和解析负担；业务上仍是轻量碎片库。 参照是宿主原生工具、直接脚本或手工流程，现有证据支持实现增量，不支持全球首创或收益排名。

#### 证据与依据

**依据 1 · 源码核查**：[lib/store.js:1-40](https://github.com/173787247/dsh-wsl-vecmem/blob/c092a92892fa63aab5e4a18f0cd2cd4b1eb81d29/lib/store.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * vecmem storage: metadata in JSON, vectors in a raw Float32 sidecar.
 *
 * The first version kept embeddings inside store.json as decimal numbers. That
 * is 5.5x larger than the same data as Float32, and it is all cost with no
 * benefit -- nobody reads a vector by eye. Measured on a real store:
 *
 *     4610 items, 4096 dims, JSON      400 MB   (96% of it vector text)
 *     4610 items, 4096 dims, Float32    76 MB
 *
 * Worse than the size: load() ran JSON.parse over the whole file on every call
 * and save() rewrote all of it. At 20,000 items each add() would parse ~1.7 GB.
 * The store could not have grown past a few thousand entries no matter what
 * maxItems said.
 *
 * Layout:
 *   store.json    { version, dims, items: [{id, text, meta, createdAt}] }
 *   vectors.f32   items.length x dims float32, row i belongs to items[i]
 *
 * Two files can drift apart if a write is interrupted. dims and the item count
 * are both checked on load, and a mismatch is reported rather than silently
 * producing garbage similarity scores -- a dimension mismatch returns NaN from
 * cosine(), and sorting NaN gives an arbitrary order with no error at all.
 */
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync, openSync, readSync, closeSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { randomUUID } from "node:crypto";

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
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

最强支持是固定版本实现确有完整入口和防御分支。最关键限制是：双文件写入不是原子事务，崩溃只会被检测而不会自动修复；检索质量依赖本地模型、文本切分和可选 reranker，且缺少任务结果对照。 这会直接收窄采用范围，而不是否定所有能力。

#### 证据与依据

**依据 1 · 源码核查**：[lib/store.js:1-40](https://github.com/173787247/dsh-wsl-vecmem/blob/c092a92892fa63aab5e4a18f0cd2cd4b1eb81d29/lib/store.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * vecmem storage: metadata in JSON, vectors in a raw Float32 sidecar.
 *
 * The first version kept embeddings inside store.json as decimal numbers. That
 * is 5.5x larger than the same data as Float32, and it is all cost with no
 * benefit -- nobody reads a vector by eye. Measured on a real store:
 *
 *     4610 items, 4096 dims, JSON      400 MB   (96% of it vector text)
 *     4610 items, 4096 dims, Float32    76 MB
 *
 * Worse than the size: load() ran JSON.parse over the whole file on every call
 * and save() rewrote all of it. At 20,000 items each add() would parse ~1.7 GB.
 * The store could not have grown past a few thousand entries no matter what
 * maxItems said.
 *
 * Layout:
 *   store.json    { version, dims, items: [{id, text, meta, createdAt}] }
 *   vectors.f32   items.length x dims float32, row i belongs to items[i]
 *
 * Two files can drift apart if a write is interrupted. dims and the item count
 * are both checked on load, and a mismatch is reported rather than silently
 * producing garbage similarity scores -- a dimension mismatch returns NaN from
 * cosine(), and sorting NaN gives an arbitrary order with no error at all.
 */
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync, openSync, readSync, closeSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { randomUUID } from "node:crypto";

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
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复分别依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要可访问的 Ollama embedding 服务、模型文件、本地磁盘与写权限；workspace 只是元数据过滤，容量、隐私备份和模型迁移需用户管理。 启动成功、持续有用和失败恢复是三类不同条件；缺少依赖时不能把“已注册”当作任务已办结。

#### 证据与依据

**依据 1 · 源码核查**：[lib/store.js:1-40](https://github.com/173787247/dsh-wsl-vecmem/blob/c092a92892fa63aab5e4a18f0cd2cd4b1eb81d29/lib/store.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * vecmem storage: metadata in JSON, vectors in a raw Float32 sidecar.
 *
 * The first version kept embeddings inside store.json as decimal numbers. That
 * is 5.5x larger than the same data as Float32, and it is all cost with no
 * benefit -- nobody reads a vector by eye. Measured on a real store:
 *
 *     4610 items, 4096 dims, JSON      400 MB   (96% of it vector text)
 *     4610 items, 4096 dims, Float32    76 MB
 *
 * Worse than the size: load() ran JSON.parse over the whole file on every call
 * and save() rewrote all of it. At 20,000 items each add() would parse ~1.7 GB.
 * The store could not have grown past a few thousand entries no matter what
 * maxItems said.
 *
 * Layout:
 *   store.json    { version, dims, items: [{id, text, meta, createdAt}] }
 *   vectors.f32   items.length x dims float32, row i belongs to items[i]
 *
 * Two files can drift apart if a write is interrupted. dims and the item count
 * are both checked on load, and a mismatch is reported rather than silently
 * producing garbage similarity scores -- a dimension mismatch returns NaN from
 * cosine(), and sorting NaN gives an arbitrary order with no error at all.
 */
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync, openSync, readSync, closeSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { randomUUID } from "node:crypto";

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
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 首次、持续与失败恢复成本及效果证据如何？

**研究主题**：效果与总成本

#### 完整回答

首次成本是安装 Ollama、下载 embedding 模型、选择 store 路径和规划 workspace；持续成本是每次 add/search 的本地推理时间、Float32 矩阵磁盘和 O(n) 余弦扫描/可选 reranker；失败恢复包括 JSON 与 vectors.f32 尺寸不一致、模型维度变化和手工重建。合格单位是一次检索返回与查询语义相关、来源可识别且不跨 workspace 泄漏的片段。当前缺每千条写入/检索延迟、每条字节、Recall@K、跨 workspace 泄漏和崩溃恢复率。

#### 证据与依据

**依据 1 · 源码核查**：[lib/store.js:1-40](https://github.com/173787247/dsh-wsl-vecmem/blob/c092a92892fa63aab5e4a18f0cd2cd4b1eb81d29/lib/store.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * vecmem storage: metadata in JSON, vectors in a raw Float32 sidecar.
 *
 * The first version kept embeddings inside store.json as decimal numbers. That
 * is 5.5x larger than the same data as Float32, and it is all cost with no
 * benefit -- nobody reads a vector by eye. Measured on a real store:
 *
 *     4610 items, 4096 dims, JSON      400 MB   (96% of it vector text)
 *     4610 items, 4096 dims, Float32    76 MB
 *
 * Worse than the size: load() ran JSON.parse over the whole file on every call
 * and save() rewrote all of it. At 20,000 items each add() would parse ~1.7 GB.
 * The store could not have grown past a few thousand entries no matter what
 * maxItems said.
 *
 * Layout:
 *   store.json    { version, dims, items: [{id, text, meta, createdAt}] }
 *   vectors.f32   items.length x dims float32, row i belongs to items[i]
 *
 * Two files can drift apart if a write is interrupted. dims and the item count
 * are both checked on load, and a mismatch is reported rather than silently
 * producing garbage similarity scores -- a dimension mismatch returns NaN from
 * cosine(), and sorting NaN gives an arbitrary order with no error at all.
 */
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync, openSync, readSync, closeSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { randomUUID } from "node:crypto";

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
```

</details>

#### 缺口

- 缺少目标硬件与语料上的 embedding 秒数、索引字节/条、搜索延迟、Recall@K、workspace 隔离和崩溃恢复数据。
  **影响**：无法判断轻量 sidecar 在实际规模是否优于关键词搜索或成熟向量库。
  **进一步探讨**：构造带相关性金标和多个 workspace 的 1k/5k 条语料，测 add/search p50/p95、磁盘/条、Recall@K，并在向量写后索引写前杀进程测试恢复。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现有哪些可靠性取舍和可复用设计？

**研究主题**：工程质量与复用

#### 完整回答

Float32 sidecar 和尺寸一致性检查直接回应大 JSON 的扩展瓶颈，设计可借鉴；写入顺序只能暴露不一致，尚缺恢复、锁与并发事务。 这些判断来自结构与错误路径抽读，不等于完整安全审计或生产可靠性证明。

#### 证据与依据

**依据 1 · 源码核查**：[lib/store.js:1-40](https://github.com/173787247/dsh-wsl-vecmem/blob/c092a92892fa63aab5e4a18f0cd2cd4b1eb81d29/lib/store.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * vecmem storage: metadata in JSON, vectors in a raw Float32 sidecar.
 *
 * The first version kept embeddings inside store.json as decimal numbers. That
 * is 5.5x larger than the same data as Float32, and it is all cost with no
 * benefit -- nobody reads a vector by eye. Measured on a real store:
 *
 *     4610 items, 4096 dims, JSON      400 MB   (96% of it vector text)
 *     4610 items, 4096 dims, Float32    76 MB
 *
 * Worse than the size: load() ran JSON.parse over the whole file on every call
 * and save() rewrote all of it. At 20,000 items each add() would parse ~1.7 GB.
 * The store could not have grown past a few thousand entries no matter what
 * maxItems said.
 *
 * Layout:
 *   store.json    { version, dims, items: [{id, text, meta, createdAt}] }
 *   vectors.f32   items.length x dims float32, row i belongs to items[i]
 *
 * Two files can drift apart if a write is interrupted. dims and the item count
 * are both checked on load, and a mismatch is reported rather than silently
 * producing garbage similarity scores -- a dimension mismatch returns NaN from
 * cosine(), and sorting NaN gives an arbitrary order with no error at all.
 */
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync, openSync, readSync, closeSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { randomUUID } from "node:crypto";

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
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献和限制能推导什么未验证方向？

**研究主题**：新假设与验证

#### 完整回答

从已确认机制与关键限制可推导：可加入写前 journal 与原子索引切换，并记录 embedding 模型指纹；模型变更时显式进入重建队列而不是混写或静默失配。 最小验证应与现有简单流程在相同任务、模型、预算和验收标准下比较，并在人工投入或失败率上升时否定该方向。

#### 证据与依据

**依据 1 · 源码核查**：[lib/store.js:1-40](https://github.com/173787247/dsh-wsl-vecmem/blob/c092a92892fa63aab5e4a18f0cd2cd4b1eb81d29/lib/store.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * vecmem storage: metadata in JSON, vectors in a raw Float32 sidecar.
 *
 * The first version kept embeddings inside store.json as decimal numbers. That
 * is 5.5x larger than the same data as Float32, and it is all cost with no
 * benefit -- nobody reads a vector by eye. Measured on a real store:
 *
 *     4610 items, 4096 dims, JSON      400 MB   (96% of it vector text)
 *     4610 items, 4096 dims, Float32    76 MB
 *
 * Worse than the size: load() ran JSON.parse over the whole file on every call
 * and save() rewrote all of it. At 20,000 items each add() would parse ~1.7 GB.
 * The store could not have grown past a few thousand entries no matter what
 * maxItems said.
 *
 * Layout:
 *   store.json    { version, dims, items: [{id, text, meta, createdAt}] }
 *   vectors.f32   items.length x dims float32, row i belongs to items[i]
 *
 * Two files can drift apart if a write is interrupted. dims and the item count
 * are both checked on load, and a mismatch is reported rather than silently
 * producing garbage similarity scores -- a dimension mismatch returns NaN from
 * cosine(), and sorting NaN gives an arbitrary order with no error at all.
 */
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync, openSync, readSync, closeSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { randomUUID } from "node:crypto";

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
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对什么人值得观察或试用，成功与停止条件是什么？

**研究主题**：采用判断

#### 完整回答

适合少量、非敏感、可重建的项目碎片先观察；需要事务、并发写、强隔离或不可丢数据的团队应使用成熟存储。若 5k 条内检索延迟与 Recall 达标、workspace 零串漏、模型变更被拒绝且崩溃后可从源文本重建，再考虑试用；出现 sidecar mismatch 无可控恢复或并发丢写即停止。

#### 证据与依据

**依据 1 · 源码核查**：[lib/store.js:1-40](https://github.com/173787247/dsh-wsl-vecmem/blob/c092a92892fa63aab5e4a18f0cd2cd4b1eb81d29/lib/store.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * vecmem storage: metadata in JSON, vectors in a raw Float32 sidecar.
 *
 * The first version kept embeddings inside store.json as decimal numbers. That
 * is 5.5x larger than the same data as Float32, and it is all cost with no
 * benefit -- nobody reads a vector by eye. Measured on a real store:
 *
 *     4610 items, 4096 dims, JSON      400 MB   (96% of it vector text)
 *     4610 items, 4096 dims, Float32    76 MB
 *
 * Worse than the size: load() ran JSON.parse over the whole file on every call
 * and save() rewrote all of it. At 20,000 items each add() would parse ~1.7 GB.
 * The store could not have grown past a few thousand entries no matter what
 * maxItems said.
 *
 * Layout:
 *   store.json    { version, dims, items: [{id, text, meta, createdAt}] }
 *   vectors.f32   items.length x dims float32, row i belongs to items[i]
 *
 * Two files can drift apart if a write is interrupted. dims and the item count
 * are both checked on load, and a mismatch is reported rather than silently
 * producing garbage similarity scores -- a dimension mismatch returns NaN from
 * cosine(), and sorting NaN gives an arbitrary order with no error at all.
 */
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync, openSync, readSync, closeSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { randomUUID } from "node:crypto";

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
```

</details>

#### 缺口

- 未验证 O(n) 搜索规模、检索质量、并发写和双文件崩溃恢复。
  **影响**：本地不等于可靠，错误相似度或跨 workspace 命中会污染代理上下文。
  **进一步探讨**：对多 workspace 金标语料做规模与故障注入实验，核对 Recall@K、延迟、隔离和重建结果。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
