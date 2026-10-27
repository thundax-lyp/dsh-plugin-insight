# SkillCorpus

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[1403878](https://github.com/EverMind-AI/SkillCorpus/tree/14038789c86b4840159c662033092286039b8213)

<!-- BEGIN META -->
[![GitHub ★ 692](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=692&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EverMind-AI/SkillCorpus)
<!-- END META -->

> **功能**：汇集、筛选和检索 Agent 技能，并提供多宿主接入与语料评估工具。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 表明，贡献在于把多源检索、环境过滤和技能送达连到宿主入口；这使用户不必先知道技能名，尚不能证明 DSH 任务成功率提升。

> **主要限制**：[Q03](#research-q03) 的关键限制是依赖源码工作区接入，且没有门控时排名命中不等于适用；远端第三方正文与辅助模型开销会改变收益。

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
  - [Q01 · 检索层相对完整技能目录具体改变了谁的任务？](#detail-section-11)
  - [Q02 · 按需和自动模式怎样把检索结果真正送给 DSH？](#detail-section-12)
  - [Q03 · 能否直接 npm 安装，代价和关键失效边界在哪里？](#detail-section-13)
  - [Q04 · 怎样验证按需检索值得替代目录，适合谁试用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护大量技能的 Agent 团队可按任务查询技能，合格结果应是任务办结而非仅找到文档。

参照完整技能目录加按名称读取，以及人工明确选择少量技能；检索增量和总体效果分开判断。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 按需检索 | 查询并返回技能正文 | 需要 DSH 工作区适配及候选源 |
| 自动送达 | 步骤前检索后注入 | 与按需模式互斥，存在额外调用 |
| 多源融合 | 组合本地和远端技能排名 | 外部服务与技能内容需独立信任判断 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Harness 源码工作区及 workspace 包 | DSH 接入必需 | 构建与宿主服务 | 不能按普通 npm 包接入 |
| 本地技能或远端目录 | 必需至少一个 | 提供候选 | 无来源不注册检索 |
| provider/model | 门控与改写必需 | 判断相关性和环境 | 无模型时按排名选择，需人工收窄 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 维护者构建适配并配置白名单目录 | 工作区依赖可解析 |
| 加载 | 维护者停用重复目录，选择按需模式 | skill_search 注册 |
| 查询 | Agent 发起具体任务查询 | 取得相关正文或明确未命中 |
| 验收 | 用户检查任务结果和额外调用 | 无收益则恢复目录插件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 源码构建与本地存储 | 工作区接线和技能审核 | 实际耗时未知 |
| 持续使用 | 正文 token、可选辅助模型与网络 | 审核命中和更新 | 总 token 与服务费用未知 |
| 失败恢复 | 失败请求和重复任务 | 判断技能失配并切回目录 | 未测恢复时间 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 发现与送达 | 多源融合后按需返回正文 | 命中质量和任务收益 |
| 失败降级 | 单源失败隔离、未命中提示 | 真实宿主兼容和延迟 |

> **思考**：[Q03](#research-q03) 的关键限制是依赖源码工作区接入，且没有门控时排名命中不等于适用；远端第三方正文与辅助模型开销会改变收益。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 表明，贡献在于把多源检索、环境过滤和技能送达连到宿主入口；这使用户不必先知道技能名，尚不能证明 DSH 任务成功率提升。

[Q02](#research-q02) 将检索引擎和宿主注册分离，单源异常隔离可复用；移植仍需适配工具上下文、文件引用与宿主生命周期。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的关键限制是依赖源码工作区接入，且没有门控时排名命中不等于适用；远端第三方正文与辅助模型开销会改变收益。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议源码构建团队先限制本地白名单和任务集，比较合格率、纠错和全部 token；不改善结果便恢复目录。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

检索接线和失败隔离有固定源码支持；任务收益是未测判断，反馈驱动选择是未验证设计。

- 已检查：作者 README、包清单、源码路径 README.md、skillcorpus_plugin/engine-typescript/README.md、skillcorpus_plugin/engine-typescript/package.json、skillcorpus_plugin/engine-typescript/src/index.ts、skillcorpus_plugin/engine-typescript/src/engine.ts、skillcorpus_plugin/engine-typescript/src/zip.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根仓库，重点读取 DSH TypeScript 适配；未将其他宿主结果或托管全库视作本轮验证。
- 下一步：用同模型同任务比较目录、按需检索和无技能，记录合格率、人工纠错、辅助调用与总 token；未执行。

**分析版本**

- **仓库**：[EverMind-AI/SkillCorpus](https://github.com/EverMind-AI/SkillCorpus)
- **版本号**：未声明（[固定提交 1403878](https://github.com/EverMind-AI/SkillCorpus/tree/14038789c86b4840159c662033092286039b8213)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

由 [Q04](#research-q04) 推导，可把是否检索和技能选择绑定到合格任务反馈；这是未验证方向，若同条件下仅增加 token 与纠错而未改善办结率则否定。

用同模型同任务比较目录、按需检索和无技能，记录合格率、人工纠错、辅助调用与总 token；未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 37 | 5619 | — | — | 49141 |
| .ts | source | 41 | 7406 | 4284 | 2672 | — |
| .ts | test | 18 | 4435 | 3306 | 648 | — |
| .mjs | source | 1 | 41 | 36 | 0 | — |
| .md | test | 6 | 1441 | — | — | 12399 |
| .md | example | 1 | 19 | — | — | 88 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/EverMind-AI/SkillCorpus/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/EverMind-AI/SkillCorpus/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/EverMind-AI/SkillCorpus/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 团队能否按需获得可执行技能并控制检索负担？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 检索层相对完整技能目录具体改变了谁的任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标用户是维护大量本地或远端技能的 Agent 团队，任务是在回答前找到适合当前操作的程序性知识。原办法是把完整技能目录交给模型再按名称加载；本组件以查询检索和过滤减少需要预知技能名称的负担。仓库既含语料生产工具，也含多宿主适配，不能把整体等同于一个可安装 DSH 插件。开源范围包含代码、千条示例及模型；完整托管 SkillHub 服务闭源，README 的 OpenClaw/Raven 成绩是作者报告，不能外推为 DSH 同版本收益。可核查贡献是检索和送达机制的组合，原创检索算法和真实需求强度尚无本轮独立材料。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-42](https://github.com/EverMind-AI/SkillCorpus/blob/14038789c86b4840159c662033092286039b8213/README.md#L24-L42)

作者将项目定义为语料与检索管线。

<details>
<summary>查看原文（19行）</summary>

```text
## What SkillCorpus gives you

SkillCorpus is EverMind's open-source pipeline for turning scattered `SKILL.md` files from public
repositories into reliable agent context. It aggregates sources, applies safety and license gates,
evaluates quality, and matches task-specific skills before the agent answers.

You can use the live [SkillHub](https://evermind.ai/skillhub) without cloning this repository. Clone
SkillCorpus when you want the open-source machinery behind that experience:

- **Build your own skill layer** — point the pipeline at your own source registry, apply the
  curation, safety, and license gates, and export a corpus for your agents.
- **Change the behavior** — modify the taxonomy, quality and dedup rules, retrieval recipe, export
  schema, evaluation suites, or host plugins.
- **Keep control of deployment** — self-host the released retrieval models and connect your own
  agent host instead of using the hosted SkillHub API.

The core code is Apache-2.0 licensed (`match/`, `evaluate/` and `lifecycle/` are MIT); each skill retains its
upstream license. The public 1,000-skill demo, three agent benchmarks, and live SkillHub show the
result.
```

</details>

**依据 2 · 作者声明**：[README.md:93-105](https://github.com/EverMind-AI/SkillCorpus/blob/14038789c86b4840159c662033092286039b8213/README.md#L93-L105)

成绩来自其他宿主，限制 DSH 效果归因。

<details>
<summary>查看原文（13行）</summary>

```text
Pass rate with no skills → with SkillCorpus, same harness, same backbone
([paper, Table 1](https://arxiv.org/abs/2607.15557)):

| Harness × backbone | SkillsBench | GDPVal | QwenClawBench |
|---|---|---|---|
| OpenClaw × Qwen3.5-27B | 8.8 → **13.0** | 81.2 → **83.1** | 65.2 → **66.7** |
| OpenClaw × Qwen3.5-397B | 11.1 → **16.9** | 82.2 → **84.0** | 65.7 → **67.0** |
| Raven × Qwen3.5-27B | 10.0 → **16.5** | 82.6 → **83.8** | 66.9 → **70.8** |
| Raven × Qwen3.5-397B | 9.2 → **22.6** | 84.0 → **85.2** | 68.8 → **73.2** |
| **Pooled ∆** | **+7.5**±2.3 (z=3.2) | **+1.51**±0.49 (z=3.1) | **+2.79**±0.70 (z=4.0) |

The gain is largest where the task needs procedural knowledge the model does not already have
(SkillsBench), and smallest on open-ended economic tasks it can already do (GDPVal).
```

</details>

**依据 3 · 作者声明**：[README.md:148-159](https://github.com/EverMind-AI/SkillCorpus/blob/14038789c86b4840159c662033092286039b8213/README.md#L148-L159)

开源样本和闭源托管服务的边界。

<details>
<summary>查看原文（12行）</summary>

```text
| | Artifact | What | Link |
|---|---|---|---|
| 🌐 | **SkillHub** | the current 114,190-skill catalog + the two models, hosted as an API — no install | [evermind.ai/skillhub](https://evermind.ai/skillhub) |
| 📚 | **Corpus** *(demo)* | the downloadable 1,000-skill sample — `skills.parquet` + `attachments.tar.zst` + dataset card; the full catalog is served by SkillHub | [🤗 demo-1k](https://huggingface.co/datasets/EverMind-AI/skillcorpus-demo-1k) |
| 🗂️ | **Full corpus** *(coming soon)* | the complete 114,190-skill dataset, same schema and layout as the demo — `skills.parquet` + `attachments.tar.zst` + dataset card | 🤗 *coming soon* |
| 🔡 | **Retrieval models** | a bi-encoder and a reranker, fine-tuned from `Qwen3-Embedding-0.6B` and `Qwen3-Reranker-0.6B` | [🤗 bi-encoder](https://huggingface.co/EverMind-AI/skillcorpus-embedding-0.6b) · [reranker](https://huggingface.co/EverMind-AI/skillcorpus-reranker-0.6b) |
| 🛠️ | **Code** | this repo — the pipeline that builds the corpus and trains the two models (`aggregate` · `curate` · `match` · `evaluate` · `export`) | [GitHub](https://github.com/EverMind-AI/SkillCorpus) |
| 🔌 | **Plugins** | packaged host adapters for OpenClaw · Hermes · WorkBuddy · Raven, plus DeepSeek Harness and an HTTP adapter | [`skillcorpus_plugin/`](skillcorpus_plugin) |

*Open source today: the code, the 1,000-skill demo corpus, and the retrieval models. The full
114,190-skill corpus is being prepared for release on HuggingFace. The hosted
SkillHub service itself stays closed.*
```

</details>

**依据 4 · 作者声明**：[skillcorpus_plugin/engine-typescript/README.md:5-17](https://github.com/EverMind-AI/SkillCorpus/blob/14038789c86b4840159c662033092286039b8213/skillcorpus_plugin/engine-typescript/README.md#L5-L17)

目录基线与 DSH 接入条件。

<details>
<summary>查看原文（13行）</summary>

```text
Per-turn skill retrieval. Every turn, this searches local directories and the configured remote sources — EverMind SkillHub, ClawHub, and skillhub.cn are enabled by default — against what the user just wrote, and puts the matching skill bodies in front of the model before it is called.

`dsh-tool-skill` solves the same problem the other way: it publishes a catalog of every skill and lets the model load one by name. The two are alternatives — running both publishes the same skills twice, once as a tool schema and once as injected text. A deployment mounting this plugin disables `dsh-tool-skill` (and any other plugin that publishes the same skill catalog).

## Where this goes

This is a DeepSeek Harness package, not a standalone npm package: its dependencies are `workspace:^` and its `tsconfig.json` references resolve from one exact location. In a harness checkout:

1. Copy this directory to `packages/skill/skill-search/`, leaving `docs/` and `tests/parity.test.ts` behind — the first documents the decision, the second pins cross-language equality and belongs to this repository.
2. Add `{ "path": "./packages/skill/skill-search" }` to `tsconfig.host.json`.
3. Copy `docs/harness-design-note.md` and its `.zh.md` counterpart into `.agents/notes/implemented/architecture/`; the harness requires an Agent Note for a change of this size.
4. `pnpm install`, then `pnpm run verify-translation-pairing --write packages/skill/skill-search/README.md` — the bilingual gate records a hash pair per document, and `doc-sync` fails without it.
5. Mount it, and disable `dsh-tool-skill`: see [Mounting it in place of the catalog](#mounting-it-in-place-of-the-catalog).
```

</details>

#### 缺口

- 缺少 DSH 同条件任务结果
  **影响**：不能断言检索提高交付率或节省总 token
  **进一步探讨**：用同一模型和任务集比较目录、按需检索和无技能三组

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 按需和自动模式怎样把检索结果真正送给 DSH？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply 默认仅注册 skill_search 工具，execute 把查询和 Agent 工具能力传给 engine.retrieve，未命中和异常返回明确降级文字。auto 分支则在 agent/pre-step 得到下游允许后，用最后用户文本检索，命中才追加包含技能正文的临时消息；两种模式互斥。引擎先可选改写，再并发检索各源，单源异常变空结果，按排名融合、补正文、去重、解析本地引用，可选模型过滤后才处理远端附件。这个顺序把昂贵附件获取放在筛选之后，源码支持失败隔离和按需送达，但不保证被模型采纳或执行正确。不能仅凭“retrieval never throws”的说明推断取消、全部宿主 API 及外部服务兼容。

#### 证据与依据

**依据 1 · 源码核查**：[skillcorpus_plugin/engine-typescript/src/index.ts:247-313](https://github.com/EverMind-AI/SkillCorpus/blob/14038789c86b4840159c662033092286039b8213/skillcorpus_plugin/engine-typescript/src/index.ts#L247-L313)

默认模式的注册和异常退路。

<details>
<summary>查看原文（67行）</summary>

```text
export function apply(ctx: Context, config: Config = {}): void {
  const cfg = Config(config)
  const engine = buildEngine(ctx, cfg)
  if (!engine.enabled) {
    ctx.logger('skill-search').info('no sources configured; retrieval is off')
    return
  }

  if ((cfg.mode ?? 'on_demand') !== 'auto') {
    // On demand. No `agent/pre-step` hook: injecting on every turn is the
    // other mode, and running both would search twice for one turn.
    //
    // `ctx.inject` rather than adding `'tools'` to the module's `inject`
    // array: entries in that array are *required* services, so listing it
    // there would stop the plugin loading at all — auto mode included — on a
    // composition that mounts no tool service. Here the dependency is scoped
    // to the mode that actually needs it.
    ctx.inject(['tools'], (toolCtx: Context) => {
      toolCtx.tools.register(defineTool({
        name: 'skill_search',
        description: SKILL_SEARCH_DESCRIPTION,
        parameters: {
          query: {
            type: 'string',
            required: true,
            description:
              'What you need to do, in the task\'s own words — e.g. "extract tables from a scanned PDF invoice".',
          },
        },
        output: {
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              skills: { type: 'string', required: true, description: 'The matching skills, rendered.' },
              matched: { type: 'boolean', required: true, description: 'Whether anything matched.' },
            },
          },
          render: (_args, value) => [{ type: 'text', text: value.skills }],
        },
        async execute(args, exec) {
          const query = String((args as { query?: unknown }).query ?? '').trim()
          if (!query) return { skills: 'skill_search needs a query describing the task.', matched: false }
          // `exec.agent` is optional on the host's contract — a non-agent
          // caller has none — and `toolNames` was called twice, walking the
          // tool registry once per branch of its own ternary.
          const availableTools = toolNames(ctx, exec.agent)
          try {
            const skills = await engine.retrieve(query, {
              signal: exec.signal,
              ...(availableTools ? { availableTools } : {}),
            })
            // A miss is an answer. An empty string would read to a model as a
            // broken tool rather than as "the library has no fit".
            return skills
              ? { skills, matched: true }
              : { skills: `No skill in the library matches "${query}". Proceed without one.`, matched: false }
          } catch {
            // Same rule as the injection path: a failed search costs the turn a
            // skill, not the turn.
            return { skills: 'Skill search is unavailable right now. Proceed without a skill.', matched: false }
          }
        },
      }))
    })
    ctx.logger('skill-search').info('on-demand mode: the agent calls skill_search')
    return
```

</details>

**依据 2 · 源码核查**：[skillcorpus_plugin/engine-typescript/src/index.ts:317-342](https://github.com/EverMind-AI/SkillCorpus/blob/14038789c86b4840159c662033092286039b8213/skillcorpus_plugin/engine-typescript/src/index.ts#L317-L342)

自动模式实际追加消息。

<details>
<summary>查看原文（26行）</summary>

```text
  ctx.on('agent/pre-step', async (
    { agent, messages, signal },
    next,
  ): Promise<PreStepDecision> => {
    const decision = await next()
    if (decision.kind === 'reject') return decision
    const query = latestUserText(messages)
    if (!query) return decision
    signal.throwIfAborted()

    const hits = await engine.hits(query, { signal, availableTools: toolNames(ctx, agent) })
    if (hits.length === 0) return decision
    const text = engine.render(hits)
    if (!text) return decision
    signal.throwIfAborted()

    const source: SkillSearchSource = {
      kind: 'skill-search',
      form: 'instructions',
      skillIds: hits.map(h => h.qualifiedId),
    }
    const injection: UserMessage = createUserMessage({
      content: [{ type: 'text', text }],
      source,
    })
    return { kind: 'enter', messages: [...decision.messages, injection] }
```

</details>

**依据 3 · 源码核查**：[skillcorpus_plugin/engine-typescript/src/engine.ts:234-300](https://github.com/EverMind-AI/SkillCorpus/blob/14038789c86b4840159c662033092286039b8213/skillcorpus_plugin/engine-typescript/src/engine.ts#L234-L300)

检索、融合、过滤与远端材料处理顺序。

<details>
<summary>查看原文（67行）</summary>

```text
  async hits(query: string, options: RetrieveOptions = {}): Promise<RouterHit[]> {
    this.revalidate()
    if (!this.enabled || !query.trim()) return []
    try {
      return await this.run(query, options)
    } catch {
      return []
    }
  }

  private async run(query: string, options: RetrieveOptions): Promise<RouterHit[]> {
    const signal = options.signal
    let searchQuery = query
    if (this.rewriter) {
      // Only a cleaner query comes back. Deciding that a turn wants no
      // skills belongs to the gate, which sees the shortlist and the
      // agent's tools; the rewriter sees neither.
      const { rewrittenQuery } = await this.rewriter.analyze(query, signal)
      if (rewrittenQuery) searchQuery = rewrittenQuery
    }

    const poolSize = this.gate ? this.gatePool : this.topK
    const perSource = Math.min(this.perSourceMax, poolSize * this.overFetch)
    const results = await Promise.all(
      this.sources.map(async (source): Promise<SourceResult> => {
        const startedAt = Date.now()
        try {
          const hits = await source.search(searchQuery, signal ? { signal } : {}, perSource)
          this.diagnose({
            source: source.name, stage: 'search', elapsedMs: Date.now() - startedAt,
            hitCount: hits.length,
          })
          return { name: source.name, weight: source.weight, hits }
        } catch (error) {
          // One source being down leaves the others usable.
          this.diagnose({
            source: source.name, stage: 'search', elapsedMs: Date.now() - startedAt,
            hitCount: 0, error: errorMessage(error),
          })
          return { name: source.name, weight: source.weight, hits: [] }
        }
      }),
    )

    let hits = this.rrfK === undefined
      ? rrfMergeWeighted(results, poolSize, this.dedupBy)
      : rrfMergeWeighted(results, poolSize, this.dedupBy, this.rrfK)
    if (hits.length === 0) return []

    hits = await this.hydrateBodies(hits, signal)
    hits = hits.filter(hit => !['clawhub', 'skillhub_cn'].includes(String(hit.meta.source)) || Boolean(hit.content))
    hits = dedupExactBodies(hits)
    if (hits.length === 0) return []

    // Before the gate, and only for skills already on disk. The gate is
    // told to reject a skill whose files it cannot see, and an unresolved
    // `{baseDir}/scripts/x.py` reads exactly like one — so a local skill
    // that ships its own files was rejected for shipping them. A few stats
    // and no network.
    hits = this.resolveLocalRefs(hits)

    if (this.gate) {
      hits = await this.gate.filter(query, hits, options.availableTools, signal)
    }
    // The remote half stays here: extracting a bundle is a download, so it
    // waits until the gate has decided what is actually going in.
    return this.resolvePlaceholders(await this.resolveHitRefs(hits.slice(0, this.topK), signal))
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 能否直接 npm 安装，代价和关键失效边界在哪里？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

不能按普通 npm 插件安装理解：本组件 package 私有且依赖 workspace:^，README 要求复制进 Harness 工作区、加入构建并替换目录插件；根仓库身份应记 infrastructure。门控及查询改写需 provider/model 成对配置，不配置时按排名直接返回 topK，相关性条件会变弱。远端目录和下载可带来网络等待、外部查询披露及第三方指令；模型过滤不是指令安全保证。默认按需可避免每轮固定查询，但一次真正检索仍有正文及可选辅助模型开销，不能从 maxSelect=2 推出节省比例。安装、持续服务与错误排查成本没有实测；失败时可回到目录插件或人工选技能。

#### 证据与依据

**依据 1 · 源码核查**：[skillcorpus_plugin/engine-typescript/package.json:30-52](https://github.com/EverMind-AI/SkillCorpus/blob/14038789c86b4840159c662033092286039b8213/skillcorpus_plugin/engine-typescript/package.json#L30-L52)

workspace 依赖和 private 明确限制安装方式。

<details>
<summary>查看原文（23行）</summary>

```text
  "license": "Apache-2.0",
  "peerDependencies": {
    "@deepseek-ai/cordis": "workspace:^",
    "@deepseek-ai/dsh-agent": "workspace:^",
    "@deepseek-ai/dsh-invariants": "workspace:^",
    "@deepseek-ai/dsh-llm": "workspace:^",
    "@deepseek-ai/dsh-session": "workspace:^",
    "@deepseek-ai/dsh-skill": "workspace:^",
    "@deepseek-ai/dsh-tools": "workspace:^"
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "workspace:^"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "workspace:^",
    "@deepseek-ai/dsh-agent": "workspace:^",
    "@deepseek-ai/dsh-invariants": "workspace:^",
    "@deepseek-ai/dsh-llm": "workspace:^",
    "@deepseek-ai/dsh-session": "workspace:^",
    "@deepseek-ai/dsh-skill": "workspace:^",
    "@deepseek-ai/dsh-tools": "workspace:^"
  },
  "private": true
```

</details>

**依据 2 · 作者声明**：[skillcorpus_plugin/engine-typescript/README.md:19-52](https://github.com/EverMind-AI/SkillCorpus/blob/14038789c86b4840159c662033092286039b8213/skillcorpus_plugin/engine-typescript/README.md#L19-L52)

门控、远端和超时配置的用途及条件。

<details>
<summary>查看原文（34行）</summary>

```text
## Pipeline

1. **Rewrite** — one model call cleans the message into a retrieval query, dropping paths, ids and boilerplate. It cannot decide that a turn wants no skills: that verdict was measured at a coin flip and was reached without sight of a single candidate, so it belongs to the gate, which sees the shortlist and the agent's tools.
2. **Fan out** — every source ranks the rewritten query on its own scale. A source that throws or times out contributes nothing; the others still answer.
3. **Fuse** — weighted Reciprocal Rank Fusion (K = 60) merges the lists *by position*, because a local BM25 score and a catalog quality score are not comparable numbers. Hits colliding on name collapse to the better-ranked copy.
4. **Hydrate** — a candidate that arrived as catalog metadata gets its body fetched, one request per candidate that survived fusion.
5. **Gate** — one model call selects at most `maxSelect` skills, and is instructed to return none rather than something irrelevant.
6. **Resolve** — `{baseDir}` placeholders and links to bundled files (`references/`, `scripts/`, …) in each on-disk survivor become absolute paths under the skill's directory, each substitution existence-checked. Without this a body saying `scripts/x.sh` reads as relative to the agent's cwd — the wrong place.
7. **Inject** — the selection is rendered and appended to the step's messages.

The gate is not an optimization. Fusion ranks by position, so each source's best hit reaches the shortlist however weakly it matched: without the gate, "what's the weather" injects whatever the local directory ranked first. The gate is also the only step that can reject a skill the agent *cannot run* — one whose body assumes a vendor API, a `{baseDir}` placeholder, or a slash-command dispatcher — which no ranking function can see. Configured without `provider`/`model`, retrieval runs unfiltered and injects the top `topK` by rank.

Retrieval never throws. A failed source, an unparseable gate reply, or a slow catalog costs the turn its skills and nothing else; the model still answers.

## Configuration

| Key | Default | Meaning |
| --- | --- | --- |
| `skillsDirs` | `['.dsh/skills']` | Directories scanned for `SKILL.md`, up to 5 levels deep. Relative paths resolve against cwd. |
| `hubEndpoint` | `https://skillhub.evermind.ai` | EverMind SkillHub; empty disables this source only. |
| `clawhubEndpoint` | `https://clawhub.ai` | ClawHub API; empty disables it. |
| `skillhubCnEndpoint` | `https://api.skillhub.cn` | skillhub.cn API; empty disables it. |
| `hubApiKey` | `''` | Bearer token for the catalog. |
| `hubTimeoutMs` | `5000` | Per-request deadline for the catalog. |
| `hubMinSafety` | `0.7` | Drop catalog entries whose safety score falls below this; only bites on catalogs that put per-skill safety in the search payload. |
| `weightLocal` | `1.0` | Fusion weight for local skills. |
| `weightHub` | `0.85` | Fusion weight for catalog skills — local skills are curated, so they outrank. |
| `topK` | `2` | Upper bound on skills injected per turn. |
| `gatePool` | `10` | Candidates the gate judges. Larger gives it more to reject. |
| `maxSelect` | `2` | Upper bound on what the gate keeps. |
| `provider` / `model` | `''` | Route for the rewriter and the gate. Configure both or neither; one alone fails at load. |
| `rewriteTimeoutMs` | `5000` | Deadline for the rewrite, the turn's first model call. Tight because it precedes everything else; on timeout the raw query is searched. |
| `gateTimeoutMs` | `20000` | Deadline for the gate, which runs before the user sees a reply. |
| `resolveRefs` | `true` | Rewrite `{baseDir}` and bundled-file links in selected bodies to absolute paths. Turn off when the agent does not share a filesystem with the skills it retrieves. |
```

</details>

**依据 3 · 作者声明**：[skillcorpus_plugin/engine-typescript/README.md:94-100](https://github.com/EverMind-AI/SkillCorpus/blob/14038789c86b4840159c662033092286039b8213/skillcorpus_plugin/engine-typescript/README.md#L94-L100)

作者说明正文注入及辅助模型 token，非本轮测量。

```text
#### Token effect

Conditional and unretained. A turn injects between zero and `maxSelect` skill bodies, in full, and nothing at all when the rewriter says the turn wants no skills or the gate selects none. The injection is built per step and is not appended to durable history, so it does not accumulate across turns. Two auxiliary model calls per retrieving turn — the rewriter, then the gate over `gatePool` candidates with a 300-character body excerpt each — spend tokens outside the conversation.

#### KV Cache effect

Replacing. The injection is appended after the derived history, and its text changes whenever the selection changes, so the suffix from that message onward is not reusable between steps; the prefix before it is untouched. A turn that injects nothing leaves the request identical to one without this plugin.
```

#### 缺口

- 总 token 与端到端延迟未测
  **影响**：无法判断检索开销是否被更少上下文抵消
  **进一步探讨**：记录所有辅助调用与最终任务 token、合格率和时间

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样验证按需检索值得替代目录，适合谁试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

适合已有 Harness 源码构建能力、技能库较大且能审核第三方技能的团队做隔离试用；只需几个固定技能的人继续用目录或显式调用更直接。一个尚未验证的方向是按任务必要性和历史命中结果决定是否检索，同时把最终交付是否合格反馈到技能选择，避免把命中数量当价值。先用本地白名单技能比较目录与按需模式，固定模型、权限与预算，记录找错技能、无关任务附加调用、人工纠错和合格任务总 token。若合格率不升而总 token 或纠错增加，停止替换，恢复原目录；本轮只支持有条件试用，不支持持续安装结论。

#### 证据与依据

**依据 1 · 源码核查**：[skillcorpus_plugin/engine-typescript/src/index.ts:255-313](https://github.com/EverMind-AI/SkillCorpus/blob/14038789c86b4840159c662033092286039b8213/skillcorpus_plugin/engine-typescript/src/index.ts#L255-L313)

按需调用提供可控对照入口。

<details>
<summary>查看原文（59行）</summary>

```text
  if ((cfg.mode ?? 'on_demand') !== 'auto') {
    // On demand. No `agent/pre-step` hook: injecting on every turn is the
    // other mode, and running both would search twice for one turn.
    //
    // `ctx.inject` rather than adding `'tools'` to the module's `inject`
    // array: entries in that array are *required* services, so listing it
    // there would stop the plugin loading at all — auto mode included — on a
    // composition that mounts no tool service. Here the dependency is scoped
    // to the mode that actually needs it.
    ctx.inject(['tools'], (toolCtx: Context) => {
      toolCtx.tools.register(defineTool({
        name: 'skill_search',
        description: SKILL_SEARCH_DESCRIPTION,
        parameters: {
          query: {
            type: 'string',
            required: true,
            description:
              'What you need to do, in the task\'s own words — e.g. "extract tables from a scanned PDF invoice".',
          },
        },
        output: {
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              skills: { type: 'string', required: true, description: 'The matching skills, rendered.' },
              matched: { type: 'boolean', required: true, description: 'Whether anything matched.' },
            },
          },
          render: (_args, value) => [{ type: 'text', text: value.skills }],
        },
        async execute(args, exec) {
          const query = String((args as { query?: unknown }).query ?? '').trim()
          if (!query) return { skills: 'skill_search needs a query describing the task.', matched: false }
          // `exec.agent` is optional on the host's contract — a non-agent
          // caller has none — and `toolNames` was called twice, walking the
          // tool registry once per branch of its own ternary.
          const availableTools = toolNames(ctx, exec.agent)
          try {
            const skills = await engine.retrieve(query, {
              signal: exec.signal,
              ...(availableTools ? { availableTools } : {}),
            })
            // A miss is an answer. An empty string would read to a model as a
            // broken tool rather than as "the library has no fit".
            return skills
              ? { skills, matched: true }
              : { skills: `No skill in the library matches "${query}". Proceed without one.`, matched: false }
          } catch {
            // Same rule as the injection path: a failed search costs the turn a
            // skill, not the turn.
            return { skills: 'Skill search is unavailable right now. Proceed without a skill.', matched: false }
          }
        },
      }))
    })
    ctx.logger('skill-search').info('on-demand mode: the agent calls skill_search')
    return
```

</details>

**依据 2 · 源码核查**：[skillcorpus_plugin/engine-typescript/src/engine.ts:278-300](https://github.com/EverMind-AI/SkillCorpus/blob/14038789c86b4840159c662033092286039b8213/skillcorpus_plugin/engine-typescript/src/engine.ts#L278-L300)

排名后过滤是效果假设的机制起点。

<details>
<summary>查看原文（23行）</summary>

```text
    let hits = this.rrfK === undefined
      ? rrfMergeWeighted(results, poolSize, this.dedupBy)
      : rrfMergeWeighted(results, poolSize, this.dedupBy, this.rrfK)
    if (hits.length === 0) return []

    hits = await this.hydrateBodies(hits, signal)
    hits = hits.filter(hit => !['clawhub', 'skillhub_cn'].includes(String(hit.meta.source)) || Boolean(hit.content))
    hits = dedupExactBodies(hits)
    if (hits.length === 0) return []

    // Before the gate, and only for skills already on disk. The gate is
    // told to reject a skill whose files it cannot see, and an unresolved
    // `{baseDir}/scripts/x.py` reads exactly like one — so a local skill
    // that ships its own files was rejected for shipping them. A few stats
    // and no network.
    hits = this.resolveLocalRefs(hits)

    if (this.gate) {
      hits = await this.gate.filter(query, hits, options.availableTools, signal)
    }
    // The remote half stays here: extracting a bundle is a download, so it
    // waits until the gate has decided what is actually going in.
    return this.resolvePlaceholders(await this.resolveHitRefs(hits.slice(0, this.topK), signal))
```

</details>

#### 缺口

- 技能匹配到任务办结的收益归因未知
  **影响**：机会仍是待验证设计
  **进一步探讨**：以人工选技能为基线并保留失败案例

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
