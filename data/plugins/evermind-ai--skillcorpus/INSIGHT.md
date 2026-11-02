# SkillCorpus

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[17d0e19](https://github.com/EverMind-AI/SkillCorpus/tree/17d0e19e3ce495c0929d30c34b2c0f39714661f0)

<!-- BEGIN META -->
[![GitHub ★ 694](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=694&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EverMind-AI/SkillCorpus)
<!-- END META -->

> **功能**：聚合、筛选和评估技能语料，并按任务从本地与远端来源检索技能，供不同 Agent 宿主使用。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 把按任务检索、环境线索和正文/文件送达接到宿主入口，并保留技能ID，用户无需先知道名字。尚无本轮证据证明DSH任务办结率更高。

> **主要限制**：[Q03](#research-q03) gate失败会退回排名前K，没有模型配置时不构建gate；它不是远端内容安全阻断。文件准备失败仍可送正文，第三方指令可读不等于所需文件可执行。

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
  - [Q01 · 谁需要按任务检索，比较基线与归属是什么？](#detail-section-11)
  - [Q02 · 工具/注入入口如何执行多源融合、门控和文件送达？](#detail-section-12)
  - [Q03 · 来源失效、第三方正文和资源负担如何限制采用？](#detail-section-13)
  - [Q04 · 怎样把技能命中与实际合格任务关联？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护大量技能的 Agent 团队可以按任务搜索可用操作指引，减少先知道技能名的要求。

[Q01](#research-q01) 以固定技能目录和按名称加载为基线；多源排名与送达是组合增量，不把RRF或作者其他宿主基准当独立DSH收益。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| skill_search | 按任务查找技能正文 | 需适配工具服务；命中不等于执行成功 |
| auto注入 | 每轮检索并提供指引 | 与按需互斥，增加每轮检索负担 |
| 多源融合与文件准备 | 合并本地/远端技能并解析引用 | 门控与文件下载可降级，不能视为安全授权 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配的DSH/cordis源码工作区 | DSH适配必需 | 构建workspace依赖和注册入口 | 私有子包不能据此当公开安装已成立 |
| 审核后的本地技能 | 本地试用必需 | 提供可控候选 | 无来源则无技能命中 |
| 远端目录与网络 | 远端检索可选 | 候选、正文和bundle下载 | 单源失败可丢该源；正文文件仍可能不完整 |
| provider/model | 重写与模型gate必需 | 整理查询和筛选候选 | 只填一个报错；两者无则无gate |
| 工具清单与共享文件系统 | 环境过滤/引用适用时必需 | 判断技能是否能执行 | 不能保证适用；非共享文件系统应关闭引用解析 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 团队固定工作区、白名单及原技能目录 | 先关闭远端/共享；本轮未实际加载 |
| 调用 | Agent按需skill_search或auto步骤检索 | 两模式互斥，不重复送达 |
| 选择与送达 | 引擎融合、补正文、gate、准备文件 | 检查工具/文件是否可用，不以命中当任务成功 |
| 验收 | 人工按外部任务判据复核 | 记录全部调用与纠错成本 |
| 退出 | 禁用适配并核对已下载共享目录 | 恢复固定技能目录；残留文件单独处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 工作区构建、本地技能和缓存 | 宿主接线、白名单审核 | 费用与工时未知 |
| 持续使用 | 主模型正文token、可选重写/gate和网络 | 复核命中、技能变更和文件依赖 | 按需与每轮auto负担不同，未量化 |
| 失败恢复 | 失败下载/调用与缓存 | 辨认门控回退、未解析文件 | 未测排障时间 |
| 退出 | 保留固定目录与必要缓存副本 | 禁用并核对共享库残留 | 禁用不等于自动删除下载技能 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 发现与送达 | 任务检索到技能正文与可选文件 | 命中适用性和DSH任务收益 |
| 失败降级 | 单源隔离、gate回退排名 | 回退是否增误注入，真实延迟 |
| 路径准备 | 暂存解压、包含检查与大小过滤 | 第三方语义安全及所有文件依赖 |

> **思考**：[Q03](#research-q03) gate失败会退回排名前K，没有模型配置时不构建gate；它不是远端内容安全阻断。文件准备失败仍可送正文，第三方指令可读不等于所需文件可执行。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 把按任务检索、环境线索和正文/文件送达接到宿主入口，并保留技能ID，用户无需先知道名字。尚无本轮证据证明DSH任务办结率更高。

[Q02](#research-q02) 引擎/宿主分离、独立源失败诊断、正文记录复用和暂存解压值得借鉴；[Q03](#research-q03) fail-open筛选保住可用性，却把审核责任留给使用者，不能移植为安全放行机制。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) gate失败会退回排名前K，没有模型配置时不构建gate；它不是远端内容安全阻断。文件准备失败仍可送正文，第三方指令可读不等于所需文件可执行。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先限定本地审核目录，关闭远端与共享，用少量可独立验收任务比较固定目录。无效命中、文件不可达或负担增加便禁用适配；不要把模型gate当授权或隔离边界。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查DSH TypeScript送达链、失败回退和解压边界；未运行宿主、服务、模型或任务对照。作者研究结果、已有机制和未来实验分开。

- 已检查：作者 README、包清单、源码路径 README.md、skillcorpus_plugin/engine-typescript/package.json、skillcorpus_plugin/engine-typescript/src/bundle.ts、skillcorpus_plugin/engine-typescript/src/engine.ts、skillcorpus_plugin/engine-typescript/src/gate.ts、skillcorpus_plugin/engine-typescript/src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根仓库，重点DSH TypeScript引擎/适配和解压；未完整审计全部语料、其他宿主、在线服务、模型研究或所有安装退出路径。
- 下一步：按[Q04](#research-q04)比较固定目录、按需、auto三组并注入门控/下载故障，计合格率、误注入、全部token与复核投入；若状态记录不改变决策或成本抵消收益则否定。本轮未执行。

**分析版本**

- **仓库**：[EverMind-AI/SkillCorpus](https://github.com/EverMind-AI/SkillCorpus)
- **版本号**：未声明（[固定提交 17d0e19](https://github.com/EverMind-AI/SkillCorpus/tree/17d0e19e3ce495c0929d30c34b2c0f39714661f0)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 联合记录门控/送达状态与独立合格任务结果，比较本地目录、按需和自动检索的全部成本。已有诊断与技能ID可复用，此方法增量及收益尚未验证。

按[Q04](#research-q04)比较固定目录、按需、auto三组并注入门控/下载故障，计合格率、误注入、全部token与复核投入；若状态记录不改变决策或成本抵消收益则否定。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 37 | 5653 | — | — | 49918 |
| .ts | source | 41 | 7406 | 4284 | 2672 | — |
| .ts | test | 18 | 4435 | 3306 | 648 | — |
| .mjs | source | 1 | 41 | 36 | 0 | — |
| .md | test | 6 | 1441 | — | — | 12399 |
| .md | example | 1 | 19 | — | — | 88 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/EverMind-AI/SkillCorpus/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/EverMind-AI/SkillCorpus/issues?q=is%3Aissue+created%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/EverMind-AI/SkillCorpus/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：按任务技能检索如何实际送达宿主，何种失败与成本会使价值不成立？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要按任务检索，比较基线与归属是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

SkillCorpus 根项目提供聚合、筛选、评估和按任务匹配技能的基础设施，目标是维护大量技能且用户不预先知道名称的 Agent 团队。合格结果是选到适合当前任务、实际工具与文件都可用的技能，并最终完成任务；不是命中更多技能。简单参照是由人维护技能目录或模型按名称加载固定Skill。按任务检索把“先知道名字”改成“先描述任务”，但也把相关性判断、来源更新和正文审核引入使用流程。

DSH TypeScript适配的可核查贡献是把本地与远端候选融合、可选模型筛选和正文送达接到宿主工具/步骤前入口。排名采用既有RRF方法，不宣称新检索算法首创。作者给出的多宿主基准属于特定模型与harness的作者结果，不能当本轮DSH复现，也不能把托管语料数量当所有内容可用或本地已获同样覆盖。根应标infrastructure，子目录才包含DSH插件代码。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-42](https://github.com/EverMind-AI/SkillCorpus/blob/17d0e19e3ce495c0929d30c34b2c0f39714661f0/README.md#L24-L42)

作者说明根项目定位、部署与语料/许可边界。

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

**依据 2 · 源码核查**：[skillcorpus_plugin/engine-typescript/src/index.ts:1-14](https://github.com/EverMind-AI/SkillCorpus/blob/17d0e19e3ce495c0929d30c34b2c0f39714661f0/skillcorpus_plugin/engine-typescript/src/index.ts#L1-L14)

与按名称加载的比较是适配作者的设计参照。

<details>
<summary>查看原文（14行）</summary>

```text
/**
 * Per-turn skill retrieval: search on what the user just asked, inject what
 * fits.
 *
 * `dsh-tool-skill` publishes a catalog of every skill and lets the model load
 * one by name. This does the opposite: it searches local and remote sources
 * against the current message and puts the matching skill bodies straight in
 * front of the model, which needs no tool call and no name it has to already
 * know. The two are alternatives — running both publishes the same skills
 * twice — so a deployment picking this one disables `dsh-tool-skill`.
 *
 * Retrieval runs on `agent/pre-step`, before the model is called, and never
 * throws: a failed source or a slow catalog costs the turn its skills and
 * nothing else.
```

</details>

**依据 3 · 作者声明**：[README.md:111-125](https://github.com/EverMind-AI/SkillCorpus/blob/17d0e19e3ce495c0929d30c34b2c0f39714661f0/README.md#L111-L125)

作者结果限定不同harness/backbone，不作为DSH实测。

<details>
<summary>查看原文（15行）</summary>

```text
## Results

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

#### 缺口

- 没有本轮DSH固定任务、固定预算下的合格率与人工目录对照。
  **影响**：不能断言按任务检索改善DSH任务结果。
  **进一步探讨**：用同一任务集比较本地目录和检索，计全部辅助调用与纠错。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具/注入入口如何执行多源融合、门控和文件送达？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

适配在默认on_demand模式注册skill_search工具，auto模式则在agent/pre-step获取最近用户文本。两种模式互斥；auto先尊重前置拒绝结果，再调用engine.hits，只有命中且渲染有正文时才追加带skillIds元数据的指令消息。引擎并行查询各源、隔离单源错误，用加权RRF合并，补正文并精确内容去重，先解析已有本地引用，再可选调用模型gate，最后将选择限制到topK并准备远端文件。

该送达链不只返回标题，适配为远端安装提供materialise函数，并复用已取得的记录减少重复请求。共享目录被监测变化，下一轮检索可刷新缓存，这种引擎与宿主接线分离可借鉴。限制也在实际失败路径里：materialise失败会保留当前正文，不会保证正文中脚本文件可读；渲染并不运行这些脚本。解压用暂存目录后rename，做路径包含检查、后缀与大小过滤，降低半写入缓存和路径逃逸风险，但允许脚本扩展名不等于它们已获执行授权或语义安全。

#### 证据与依据

**依据 1 · 源码核查**：[skillcorpus_plugin/engine-typescript/src/index.ts:255-310](https://github.com/EverMind-AI/SkillCorpus/blob/17d0e19e3ce495c0929d30c34b2c0f39714661f0/skillcorpus_plugin/engine-typescript/src/index.ts#L255-L310)

默认工具模式的注册与engine.retrieve调用。

<details>
<summary>查看原文（56行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[skillcorpus_plugin/engine-typescript/src/index.ts:317-342](https://github.com/EverMind-AI/SkillCorpus/blob/17d0e19e3ce495c0929d30c34b2c0f39714661f0/skillcorpus_plugin/engine-typescript/src/index.ts#L317-L342)

auto步骤入口和带skillIds的指令消息。

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

**依据 3 · 源码核查**：[skillcorpus_plugin/engine-typescript/src/engine.ts:278-300](https://github.com/EverMind-AI/SkillCorpus/blob/17d0e19e3ce495c0929d30c34b2c0f39714661f0/skillcorpus_plugin/engine-typescript/src/engine.ts#L278-L300)

融合、补正文、去重、门控和topK链路。

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

**依据 4 · 源码核查**：[skillcorpus_plugin/engine-typescript/src/engine.ts:329-361](https://github.com/EverMind-AI/SkillCorpus/blob/17d0e19e3ce495c0929d30c34b2c0f39714661f0/skillcorpus_plugin/engine-typescript/src/engine.ts#L329-L361)

materialise失败保留正文的实际路径。

<details>
<summary>查看原文（33行）</summary>

```text
  private async resolveHitRefs(hits: RouterHit[], signal?: AbortSignal): Promise<RouterHit[]> {
    if (!this.refs) return hits
    return Promise.all(hits.map(async (hit) => {
      let current = hit
      if (typeof current.meta.skillDir !== 'string' && this.materialise) {
        const startedAt = Date.now()
        const source = sourceName(current)
        try {
          const installed = await this.materialise(current, signal)
          this.diagnose({
            source, stage: 'materialise', elapsedMs: Date.now() - startedAt,
            succeeded: Boolean(installed),
          })
          if (installed) {
            current = {
              ...current,
              content: installed.body || current.content,
              meta: { ...current.meta, skillDir: installed.dir },
            }
          }
        } catch (error) {
          // Unresolved paths, not a lost skill. The body still instructs.
          this.diagnose({
            source, stage: 'materialise', elapsedMs: Date.now() - startedAt,
            succeeded: false, error: errorMessage(error),
          })
          return current
        }
      }
      const skillDir = current.meta.skillDir
      if (typeof skillDir !== 'string' || !skillDir || !current.content) return current
      const { body } = resolveRefs(current.content, skillDir)
      return body === current.content ? current : { ...current, content: body }
```

</details>

**依据 5 · 源码核查**：[skillcorpus_plugin/engine-typescript/src/index.ts:448-480](https://github.com/EverMind-AI/SkillCorpus/blob/17d0e19e3ce495c0929d30c34b2c0f39714661f0/skillcorpus_plugin/engine-typescript/src/index.ts#L448-L480)

适配提供远端fetchBody/materialise接线。

<details>
<summary>查看原文（33行）</summary>

```text
      ...((client || marketplaceClients.size > 0)
        ? {
          // The engine calls both for any hit without a skill directory,
          // which is every hit a third-party source contributes too. Without
          // this guard those arrive here with `hit.meta.id` undefined and
          // fetch `/skills/undefined` from the catalog, so an extra source
          // costs a 404 per hit.
          fetchBody: async (hit, signal) => {
            const marketplace = marketplaceClients.get(String(hit.meta.source))
            if (marketplace) {
              const installed = await marketplace.install(hit, signal)
              return { body: installed.body, record: { _installed: installed } }
            }
            if (hit.meta.source !== 'hub' || !client) return undefined
            const record = await client.get(String(hit.meta.id), signal)
            // The record rides along so `materialise` can skip re-fetching
            // the same detail — one request per selected skill otherwise.
            return {
              ...(typeof record.skill_md === 'string' ? { body: record.skill_md } : {}),
              record,
            }
          },
          materialise: async (hit, signal) => {
            const marketplace = marketplaceClients.get(String(hit.meta.source))
            if (marketplace) {
              const fetched = hit.meta._fetched as { _installed?: { dir: string; body: string } } | undefined
              const installed = fetched?._installed ?? await marketplace.install(hit, signal)
              return { dir: installed.dir, body: installed.body }
            }
            if (hit.meta.source !== 'hub' || !client) return undefined
            const fetched = hit.meta._fetched as Record<string, unknown> | undefined
            const installed = await client.install(String(hit.meta.id), fetched, signal)
            return { dir: installed.dir, body: installed.skillMd }
```

</details>

**依据 6 · 源码核查**：[skillcorpus_plugin/engine-typescript/src/bundle.ts:66-101](https://github.com/EverMind-AI/SkillCorpus/blob/17d0e19e3ce495c0929d30c34b2c0f39714661f0/skillcorpus_plugin/engine-typescript/src/bundle.ts#L66-L101)

暂存解压、包含检查、预算和原子目录发布。

<details>
<summary>查看原文（36行）</summary>

```text
export async function extractBundle(archive: Buffer, destination: string): Promise<void> {
  const staging = `${destination}.incoming-${process.pid}-${Math.random().toString(16).slice(2, 10)}`
  const root = resolve(staging)
  let total = 0
  try {
    await mkdir(staging, { recursive: true })
    for (const entry of readZipEntries(archive)) {
      const target = resolve(root, entry.name)
      // Containment by path, not by string prefix: `..` inside the name is
      // what this rejects, and resolve() is what makes it visible.
      const inside = relative(root, target)
      if (inside.startsWith('..') || isAbsolute(inside)) {
        throw new Error(`unsafe zip path: ${entry.name}`)
      }
      if (!ALLOWED_SUFFIXES.has(suffixOf(entry.name))) continue
      if (entry.declaredSize > MAX_ENTRY_BYTES) continue
      if (total + entry.declaredSize > MAX_TOTAL_BYTES) {
        throw new Error('zip uncompressed total too large')
      }
      const data = entry.read()
      total += data.length
      await mkdir(join(target, '..'), { recursive: true })
      await writeFile(target, data)
    }
    try {
      await rename(staging, destination)
    } catch (error) {
      // A concurrent installer that won the rename extracted the same
      // version, so either copy is correct; anything else is a real failure.
      const { access } = await import('node:fs/promises')
      await access(destination).catch(() => { throw error })
      await rm(staging, { recursive: true, force: true })
    }
  } catch (error) {
    await rm(staging, { recursive: true, force: true })
    throw error
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 来源失效、第三方正文和资源负担如何限制采用？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

最影响采用的限制是模型gate属于相关性筛选而非安全阻断。gate超时、传输失败或回答不可解析时，会返回排名前fallbackTopK；没有完整provider/model配置时不构造gate，配置只填其一则加载报错。即使配置了gate，缺availableTools时也不能依据工具环境完整拒绝不适配候选。故不能把gate称为所有远端内容必经的安全审核，也不能把来源safety字段当执行隔离。

适配默认配置多个远端源、共享技能目录和引用解析；远端技能可能持久留在共享库，停止注入不必然删除已存文件。试用应由具备源码构建能力的团队先关闭远端和共享，只允许审核过的本地技能；需要辅助模型时同时固定provider/model并统计调用预算。private的DSH子包仍依赖workspace宿主包，不把文档安装命令当公开包已安装成功。自动每轮检索与按需检索的费用结构不同，命中正文也增加主模型token；本次没有费用、延迟或节时实测。

保留原目录和任务输入，先比较少量能独立判定结果的任务。若命中要求不存在的工具、正文文件不可达或纠错/token负担增加而无合格率收益，就禁用检索适配并回到固定目录。已下载共享技能需由使用者核对本机目录后单独处理，不能以禁用插件替代数据清理。

#### 证据与依据

**依据 1 · 源码核查**：[skillcorpus_plugin/engine-typescript/src/gate.ts:54-94](https://github.com/EverMind-AI/SkillCorpus/blob/17d0e19e3ce495c0929d30c34b2c0f39714661f0/skillcorpus_plugin/engine-typescript/src/gate.ts#L54-L94)

门控失败回退原排名，不是fail-closed。

<details>
<summary>查看原文（41行）</summary>

```text
  /**
   * Narrow `candidates` to the skills worth injecting for `task`.
   *
   * `availableTools` enables the environment check; without it the gate still
   * judges relevance. Returns the top `fallbackTopK` candidates on timeout,
   * transport failure, or an unparseable reply — a broken gate degrades to
   * unfiltered retrieval rather than to silence.
   *
   * @param task - the user's words, unrewritten: the gate judges the real ask.
   * @param candidates - the fused pool, best first.
   * @param availableTools - tools this agent can call, enabling the hard rule.
   * @param signal - aborts the call when the turn is cancelled.
   * @returns the kept candidates, at most `maxSelect`, possibly empty.
   */
  async filter(
    task: string,
    candidates: readonly RouterHit[],
    availableTools?: readonly string[],
    signal?: AbortSignal,
  ): Promise<RouterHit[]> {
    if (candidates.length === 0) return []
    const { catalog, byId } = buildCatalog(candidates)
    const prompt = this.buildPrompt(task, catalog, availableTools)

    let content: string
    try {
      content = await bounded(
        s => this.model.complete(prompt, { signal: s }),
        this.timeoutMs,
        signal,
      )
    } catch {
      return candidates.slice(0, this.fallbackTopK)
    }

    let selectedIds: string[]
    try {
      selectedIds = parseResponse(content)
    } catch {
      return candidates.slice(0, this.fallbackTopK)
    }
```

</details>

**依据 2 · 源码核查**：[skillcorpus_plugin/engine-typescript/src/index.ts:161-192](https://github.com/EverMind-AI/SkillCorpus/blob/17d0e19e3ce495c0929d30c34b2c0f39714661f0/skillcorpus_plugin/engine-typescript/src/index.ts#L161-L192)

默认远端源、共享、引用和模式配置。

<details>
<summary>查看原文（32行）</summary>

```text
export const Config: z<Config> = z.object({
  skillsDirs: z.array(z.string()).default(['.dsh/skills']),
  // Join the cross-host shared library. Off stops this host reading the
  // others; to stop the others reading this one, set `enabled: false` on
  // its line in the shared registry.json.
  shareSkills: z.boolean().default(true),
  hubEndpoint: z.string().default('https://skillhub.evermind.ai'),
  hubApiKey: z.string().default(''),
  clawhubEndpoint: z.string().default('https://clawhub.ai'),
  skillhubCnEndpoint: z.string().default('https://api.skillhub.cn'),
  bundleCacheDir: z.string().default(''),
  indexBody: z.boolean().default(false),
  rewrite: z.boolean().default(true),
  gate: z.boolean(),
  hubTimeoutMs: z.number().default(5000),
  hubMinSafety: z.number().default(0.7),
  weightLocal: z.number().default(1.0),
  weightHub: z.number().default(0.85),
  topK: z.number().default(2),
  gatePool: z.number().default(10),
  maxSelect: z.number().default(2),
  provider: z.string().default(''),
  model: z.string().default(''),
  rewriteTimeoutMs: z.number().default(5_000),
  gateTimeoutMs: z.number().default(20_000),
  resolveRefs: z.boolean().default(true),
  resolvePlaceholders: z.boolean().default(false),
  // A union, not `z.string()`: the branch below reads `!== 'auto'`, so a
  // plain string schema turns `mode: "atuo"` into a silent downgrade to
  // on-demand — the deployment asks for auto and never learns it did not get
  // it. Narrowed, the loader rejects the typo instead.
  mode: z.union([z.const('on_demand'), z.const('auto')]).default('on_demand'),
```

</details>

**依据 3 · 源码核查**：[skillcorpus_plugin/engine-typescript/src/index.ts:416-447](https://github.com/EverMind-AI/SkillCorpus/blob/17d0e19e3ce495c0929d30c34b2c0f39714661f0/skillcorpus_plugin/engine-typescript/src/index.ts#L416-L447)

只有有model且开关允许才构建gate/rewriter。

<details>
<summary>查看原文（32行）</summary>

```text
  const route = resolveRoute(cfg)
  const model = route ? modelBridge(ctx, route) : undefined
  // Two independent switches over one model, matching the Python config.
  // Configuring a model used to turn both on together, which left no way
  // to keep the query cleaning and drop the gate.
  const wantsRewrite = cfg.rewrite ?? true
  // `undefined` means "on when a catalog is configured": the gate rejects
  // when unsure, which a curated local directory does not need and an
  // unvetted catalog does.
  const wantsGate = cfg.gate ?? (Boolean(cfg.hubEndpoint) || marketplaceClients.size > 0)
  return new SkillSearchEngine(
    {
      sources,
      // Re-fingerprinted before every retrieval so a skill installed by
      // another agent, or dragged in by hand, shows up next turn instead of
      // after a restart. Only the shared directory — see `watch.ts`.
      watchDirs: roots.filter(root => root.name === 'shared').map(root => root.path),
      ...(model && wantsRewrite
        ? {
          rewriter: new QueryRewriter(model, {
            ...(cfg.rewriteTimeoutMs === undefined ? {} : { timeoutMs: cfg.rewriteTimeoutMs }),
          }),
        }
        : {}),
      ...(model && wantsGate
        ? {
          gate: new LLMGateFilter(model, {
            maxSelect: cfg.maxSelect ?? 2,
            ...(cfg.gateTimeoutMs === undefined ? {} : { timeoutMs: cfg.gateTimeoutMs }),
          }),
        }
        : {}),
```

</details>

**依据 4 · 源码核查**：[skillcorpus_plugin/engine-typescript/src/index.ts:502-509](https://github.com/EverMind-AI/SkillCorpus/blob/17d0e19e3ce495c0929d30c34b2c0f39714661f0/skillcorpus_plugin/engine-typescript/src/index.ts#L502-L509)

provider和model必须成对。

```text
function resolveRoute(cfg: Config): { provider: string; model: string } | undefined {
  const provider = cfg.provider ?? ''
  const model = cfg.model ?? ''
  if (!provider && !model) return undefined
  if (!provider || !model) {
    throw new Error('skill-search: configure `provider` and `model` together, or neither')
  }
  return { provider, model }
```

**依据 5 · 源码核查**：[skillcorpus_plugin/engine-typescript/package.json:30-53](https://github.com/EverMind-AI/SkillCorpus/blob/17d0e19e3ce495c0929d30c34b2c0f39714661f0/skillcorpus_plugin/engine-typescript/package.json#L30-L53)

private workspace依赖约束。

<details>
<summary>查看原文（24行）</summary>

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
}
```

</details>

**依据 6 · 源码核查**：[skillcorpus_plugin/engine-typescript/src/index.ts:354-379](https://github.com/EverMind-AI/SkillCorpus/blob/17d0e19e3ce495c0929d30c34b2c0f39714661f0/skillcorpus_plugin/engine-typescript/src/index.ts#L354-L379)

共享目录创建与跨宿主扫描。

<details>
<summary>查看原文（26行）</summary>

```text
function installRootFor(share: boolean): string | undefined {
  if (!share) return undefined
  try {
    const root = sharedSkillsDir()
    mkdirSync(root, { recursive: true })
    return root
  } catch {
    // Sharing is never worth a failed turn.
    return undefined
  }
}

function buildEngine(ctx: Context, cfg: Config): SkillSearchEngine {
  const sources: SkillSource[] = []

  const dirs = cfg.skillsDirs ?? []
  // Registers this harness's skills directory so the other four hosts can
  // scan it, and appends the shared directory plus whatever they registered.
  // `?? true` because this reaches `buildEngine` through the exported
  // `Config` type, where the field is optional — the zod default only applies
  // to config the harness parsed. Without it the harness's own type-check
  // fails, which is how this was found: the repository suites never compile
  // this file against that interface.
  const share = cfg.shareSkills ?? true
  const installRoot = installRootFor(share)
  const roots = scanDirs('deepseek-harness', dirs, share)
```

</details>

#### 缺口

- 真实宿主构建兼容、远端可用性、共享技能退出清理和任务成本未完整验证。
  **影响**：仅支持本地白名单受控试用，不支持远端广泛安装保证。
  **进一步探讨**：固定工作区版本，在副本目录检查加载、命中和退出残留，记录全部调用与合格结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样把技能命中与实际合格任务关联？

**研究主题**：新假设与验证

#### 完整回答

从Q01的任务收益缺口与Q02/Q03的排名、门控回退和文件送达差异，可以提出一个限定假设：把“来源/门控状态、实际送达技能ID、所需文件可读性”和由任务外部判据得到的合格结果联合记录，可能帮助决定何时只保留本地目录、何时启用远端检索。已有SourceDiagnostic和skillIds元数据可提供部分输入，因此不能声称项目没有诊断或可追溯ID；根项目也已有生命周期研究，本次不把一般“按收益淘汰技能”说成新发明。增量是针对本DSH送达链把失败回退和不可执行文件从单纯命中中分开，避免把检索成功误作任务收益。

最小实验固定模型、任务、技能版本和预算，对比本地目录、按需检索及自动检索三组，加入门控超时、无工具和下载失败情形。记录任务合格率、误注入、不可执行引用、全部token、人工纠错与维护时间。若这些状态不能解释采用选择，或记录负担超过减少的误用，则否定当前范围的假设；若改进只是来自更多模型预算，也不归因于检索方法。

#### 证据与依据

**依据 1 · 源码核查**：[skillcorpus_plugin/engine-typescript/src/engine.ts:82-100](https://github.com/EverMind-AI/SkillCorpus/blob/17d0e19e3ce495c0929d30c34b2c0f39714661f0/skillcorpus_plugin/engine-typescript/src/engine.ts#L82-L100)

已有逐源诊断，不虚构诊断缺失。

<details>
<summary>查看原文（19行）</summary>

```text
export type SourceDiagnosticStage = 'search' | 'hydrate' | 'materialise'

/** One fail-open source operation, exposed for host diagnostics. */
export interface SourceDiagnostic {
  readonly source: string
  readonly stage: SourceDiagnosticStage
  readonly elapsedMs: number
  /** Number of candidates returned by a search operation. */
  readonly hitCount?: number
  /** Whether one hydrate/materialise operation produced its expected output. */
  readonly succeeded?: boolean
  readonly error?: string
}

/** The pieces the pipeline runs on. Only `sources` is required. */
export interface EngineParts {
  readonly sources: readonly SkillSource[]
  /** Receives best-effort source timings and failures; callback errors are ignored. */
  readonly onDiagnostic?: (diagnostic: SourceDiagnostic) => void
```

</details>

**依据 2 · 源码核查**：[skillcorpus_plugin/engine-typescript/src/index.ts:333-342](https://github.com/EverMind-AI/SkillCorpus/blob/17d0e19e3ce495c0929d30c34b2c0f39714661f0/skillcorpus_plugin/engine-typescript/src/index.ts#L333-L342)

已有实际注入skillIds。

<details>
<summary>查看原文（10行）</summary>

```text
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

**依据 3 · 源码核查**：[skillcorpus_plugin/engine-typescript/src/gate.ts:78-94](https://github.com/EverMind-AI/SkillCorpus/blob/17d0e19e3ce495c0929d30c34b2c0f39714661f0/skillcorpus_plugin/engine-typescript/src/gate.ts#L78-L94)

失败回退为实验中特别区分的状态。

<details>
<summary>查看原文（17行）</summary>

```text
    let content: string
    try {
      content = await bounded(
        s => this.model.complete(prompt, { signal: s }),
        this.timeoutMs,
        signal,
      )
    } catch {
      return candidates.slice(0, this.fallbackTopK)
    }

    let selectedIds: string[]
    try {
      selectedIds = parseResponse(content)
    } catch {
      return candidates.slice(0, this.fallbackTopK)
    }
```

</details>

#### 缺口

- 联合状态记录对实际任务决策的增量尚未测量。
  **影响**：不能声称已减少错误注入或确定远端更值得。
  **进一步探讨**：运行上述固定任务三组对照，控制所有预算并纳入失败成本。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
