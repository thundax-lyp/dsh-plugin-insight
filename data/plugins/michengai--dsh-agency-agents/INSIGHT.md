# DSH Agency Agents

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[cd852c5](https://github.com/MichengAI/dsh-agency-agents/tree/cd852c5d16c30e96f3bb56d16052b34c0fa40e66)

<!-- BEGIN META -->
[![GitHub ★ 200](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=200&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-agency-agents) [![npm 30d 48,981](https://img.shields.io/static/v1?label=npm+30d&message=48%2C981&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-agency-agents) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-agency-agents)
<!-- END META -->

> **功能**：在 DSH 中选择领域角色与专家团，委派任务并由主会话核验汇总结果。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)目录/角色职责与有界团队执行合同，主会话统一核证据。

> **主要限制**：[Q03](#research-q03)角色不是资质或不同模型，有限递归守卫非只读沙箱；[Q02](#research-q02)native started非结论。

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
  - [Q01 · 专家目录如何改变任务组织？](#detail-section-11)
  - [Q02 · 委派如何产生结果，失败怎样呈现？](#detail-section-12)
  - [Q03 · 专业身份和防递归能保证什么？](#detail-section-13)
  - [Q04 · 怎样小范围验证，原生收据有何增量？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH用户需要明确分工的代码/产品/研究评审。

手写persona、原生子Agent手动分工与单模型评审。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 领域角色目录 | 选择评审视角 | 作者331，非逐项能力验收 |
| 普通专家团 | 4路有界并发/partial | 同模型/宿主权限 |
| 原生Team | task/队友复用协作 | started非结果 |
| 团队合同 | 冻结职责/验收清单 | 主会话仍需证据核查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 相容DSH/Node/peer | 必需 | 工具/Remote/界面 | 实装兼容重验 |
| subagent provider/模型 | 必需 | persona任务执行 | 能力缺失报错 |
| Agent Team服务/当前工具 | native需要 | 任务/消息/队友 | 未就绪普通模式，失败不自动重复 |
| 可访问资料/人工核证 | 必需 | 有效评审 | coverage不等质量 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 副本/2人职责/权限 | 先核团规则和启用 |
| 委派 | 主会话给目标/路径 | 冻结配置/核engine |
| 结果 | 普通partial或native等待 | 按本次taskId核真实结论 |
| 异常退出 | 停扩团/对账运行者 | 回单Agent/人工，不自动重跑 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | profile/资料副本 | 选角色/职责/权限 | 兼容耗时未验 |
| 持续 | 多成员模型token | 证据/分歧/重复意见核查 | 净质量和节时未知 |
| 失败恢复 | 保留成功输出/任务板 | partial/取消/迟到结果对账 | 外部取消未验 |
| 退出 | 设置/历史仍保留 | 停成员/停包/回单Agent | 已发生副作用不撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 分工组织 | 冻结职责/角色目录 | 专业资质不成立 |
| 有界执行 | 4路/partial/取消传递 | 真实宿主兼容 |
| 原生协作 | taskId/队友/started | 实际完成须等待 |
| 评审增量 | 主会话验收指令 | 比单Agent质量/成本 |

> **思考**：[Q03](#research-q03)角色不是资质或不同模型，有限递归守卫非只读沙箱；[Q02](#research-q02)native started非结论。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)目录/角色职责与有界团队执行合同，主会话统一核证据。

[Q02](#research-q02)配置冻结/revision、4路并发/partial、双宿主adapter与原生任务清理；不把接受当完成。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)角色不是资质或不同模型，有限递归守卫非只读沙箱；[Q02](#research-q02)native started非结论。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04)副本2人小团对照单Agent，核partial/native真实消息，异常停扩团回人工核证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

src与actual lib专家/团队执行关键链静态核查，未运行宿主/模型/原生队友。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.ts、src/team-runtime.ts、src/team-engine.ts、src/team-contract.ts、src/team-library.ts、lib/index.js、lib/src-C-tLCf9B.js、assets/agency-agents-zh/engineering/engineering-code-reviewer.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核心专家persona读取/普通与原生团队执行及lib接线，抽查代码审查角色；未全面审331素材、更新/创建/全部UI与HTTP权限，不执行目标。
- 下一步：同模型单Agent与2人团比较，provider缺失/partial/取消/复用队友/迟到消息/原生任务回传矩阵。

**分析版本**

- **仓库**：[MichengAI/dsh-agency-agents](https://github.com/MichengAI/dsh-agency-agents)
- **版本号**：1.2.21（[固定提交 cd852c5](https://github.com/MichengAI/dsh-agency-agents/tree/cd852c5d16c30e96f3bb56d16052b34c0fa40e66)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)按本次taskId形成启动到完成的结果收据可探索，宿主已同效或负担抵消则否定。

同模型单Agent与2人团比较，provider缺失/partial/取消/复用队友/迟到消息/原生任务回传矩阵。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 667 | 159235 | — | — | 1412706 |
| .js | source | 4 | 5525 | 5255 | 262 | — |
| .ts | source | 56 | 13123 | 12045 | 491 | — |
| .mjs | source | 4 | 285 | 241 | 9 | — |
| .ts | test | 39 | 7546 | 6826 | 141 | — |
| .tsx | source | 9 | 1719 | 1633 | 34 | — |
| .tsx | test | 4 | 438 | 429 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/MichengAI/dsh-agency-agents/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 25](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=25&color=737b86&logo=github)](https://github.com/MichengAI/dsh-agency-agents/issues?q=is%3Aissue+created%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z) [![近30天关闭 24](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=24&color=737b86&logo=github)](https://github.com/MichengAI/dsh-agency-agents/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核专家/团队实际委派、启动结果验收边界与采用成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 专家目录如何改变任务组织？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向DSH内需要多角度代码/产品/研究评审的用户，以可选persona和团队目标/职责/交付合同替代每次手写角色与手动拼接子Agent任务。作者提供331专家、5内置团及自定义团队；本轮核召唤与团队执行，不把角色数量、领域名称或模板里的经验身份当独立能力/资质证明。较原生subagent，实际增量是有界成员配置、目录/启用状态、冻结职责与结果缺口包装；模型和执行工具仍由宿主提供。成功应是不同证据视角带来可核问题，非多段相似意见。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:23-35](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/README.md#L23-L35)

作者功能/数量声明。

<details>
<summary>查看原文（13行）</summary>

```text
## Features

Choose a specialist in DSH for code review, design, operations, or research. All 331 experts are bundled and ready to use after installation.

- **Dual-surface access & wide layout**: Access management from **Settings → Experts** or enable the persistent primary sidebar entry to open in a dedicated 960px centered workspace view.
- **Conversational creation with AI**: Dual-mode creation via \"Create with AI\" jumps to main chat with auto-prefilled prompts. Agents render structured Markdown previews in chat with multi-turn revisions, followed by a native host Ask interaction confirmation before pre-filling into editor modals/drawers for human-in-the-loop review.
- **Smart bulk batch actions**: Compact native dropdown menu in the filter bar with dynamic filter linkage for \"Enable filtered (N) / Disable filtered (M)\" and \"Enable all (331) / Disable all\", protected by confirmation dialogs and atomic scheduling.
- **Complete roster of 331 domain experts**: Covers 22 standard divisions from engineering, product, and design to marketing, sales, and legal, with instant prefix matching.
- **Multi-agent team collaboration**: 5 high-impact built-in review teams and support for up to 100 custom teams with automated handoffs, parallel execution, or debate modes.
- **Fast invocation in composer**: Summon specialists or teams via the `@` trigger or composer picker button, instantly inserting task examples without accidental sends.
- **Enterprise control & security**: Toggle online updates or declare `updater: false` for strict platform lock; endpoints are guarded by token headers and content-type validation.
- **Reverse proxy compatibility**: Automatic URL base resolution (`document.baseURI`) ensures seamless operation behind prefix-stripping reverse proxies.

```

</details>

**依据 2 · 源码核查**：[README.md:40-68](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/README.md#L40-L68)

团队流程/普通与原生区别。

<details>
<summary>查看原文（29行）</summary>

```text
| Built-in team | Focus | Delivery |
| --- | --- | --- |
| Product Review Team | User value, experience, technical feasibility | Priorities and actions |
| Technical Review Team | Architecture, security, acceptance boundaries | Risks and acceptance checks |
| Content Planning Team | Angles, distribution strategy, fact checking | Topic options and content structure |
| Data Analysis Team | Metrics, data quality, business interpretation | Findings and validation steps |
| Research Team | Research scope, evidence, synthesis | Source-backed conclusions |

### Configure and use

1. Use a built-in team, copy it to customize, or create a team of 2–8 distinct experts. Up to 100 custom teams can be saved.
2. Set the name, description, tags, member duties, shared goal, constraints, delivery requirements, and 1–3 examples. Add member starts with enabled experts; disabled experts can still join if you switch status to All or Disabled. Use, customize, or restore the coordinator template.
3. Confirm enabling required experts when enabling a team. Switch to Expert teams in the composer picker or select through `@`, then write the task. Selecting or adding an example never sends the message.
4. The current main conversation delegates, verifies evidence, handles disagreements, and delivers one result; no additional leader subagent is created. Ordinary mode runs up to four experts concurrently and preserves completed results if others fail.

### Automatic collaboration mode

| Host state | Behavior |
| --- | --- |
| Agent Team unsupported | Use ordinary subagents without recommending an unavailable feature. |
| Supported but disabled, or current-session tools unavailable | Recommend enabling Team while continuing to allow ordinary execution. |
| Services and current-session tools available | Use native Agent Team, shared tasks, and teammate messages; wait for actual results before summarizing. |

Explicit `maxDepth` uses ordinary mode to preserve depth limits. Native dispatch acceptance is not expert completion; partial startup failures do not automatically switch modes and duplicate work. Members inherit the main conversation's model selection; there is no per-expert model setting. Native model labels are provided by DSH and may display creation-time values.

### Tool interfaces

Retain `list_experts`, `summon_expert`, and `summon_experts`. Add `list_expert_teams`, `get_expert_team`, and `summon_expert_team`. The main conversation reads the enabled team's rules and duties before delegating the complete task, then verifies and summarizes actual member results.

```

</details>

**依据 3 · 源码核查**：[src/team-contract.ts:35-66](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/src/team-contract.ts#L35-L66)

2..8不同成员/职责schema。

<details>
<summary>查看原文（32行）</summary>

```text
  .strict()
export const teamInputSchema = z
  .object({
    id: z
      .string()
      .regex(/^team-(?:[a-z]+|custom-[0-9a-f-]+)$/u)
      .optional(),
    builtin: z.boolean().optional(),
    name: text(40).refine((value) => !/[@\r\n\u0000-\u001f]/u.test(value)),
    description: text(160),
    tags: z.array(text(16)).max(3),
    goal: text(2000),
    constraints: z.string().trim().max(2000),
    deliveryRequirements: text(2000),
    members: z
      .array(teamMemberSchema)
      .min(2)
      .max(8)
      .refine(
        (items) =>
          new Set(items.map((item) => item.expertSlug)).size === items.length,
      ),
    examples: z.array(text(1000)).min(1).max(3),
    coordinatorMode: z.enum(COORDINATOR_MODES) as z.ZodType<CoordinatorMode>,
    coordinatorTemplateId: z.enum(COORDINATOR_TEMPLATE_IDS) as z.ZodType<CoordinatorTemplateId>,
    coordinatorTemplateVersion: z.literal(1),
    coordinatorPrompt: z
      .string()
      .refine((value) => Array.from(value).length <= 12000),
  })
  .strict()
  .refine(
```

</details>

**依据 4 · 源码核查**：[assets/agency-agents-zh/engineering/engineering-code-reviewer.md:9-37](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/assets/agency-agents-zh/engineering/engineering-code-reviewer.md#L9-L37)

角色经验为提示词，非实绩。

<details>
<summary>查看原文（29行）</summary>

```text

你是**代码审查员**，一位提供深入、建设性代码审查的专家。你关注的是真正重要的东西——正确性、安全性、可维护性和性能，而不是 Tab 和空格之争。

## 🧠 身份与记忆
- **角色**：代码审查与质量保障专家
- **性格**：建设性、深入、有教育意义、尊重他人
- **记忆**：你熟记常见反模式、安全陷阱和提升代码质量的审查技巧
- **经验**：你审查过上千个 PR，深知最好的审查是教学，而非批判

## 🎯 核心使命

提供既能提升代码质量又能提升开发者能力的代码审查：

1. **正确性** — 代码是否实现了预期功能？
2. **安全性** — 是否存在漏洞？输入校验？权限检查？
3. **可维护性** — 六个月后还能看懂吗？
4. **性能** — 是否有明显的瓶颈或 N+1 查询？
5. **测试** — 关键路径是否有测试覆盖？

## 🔧 关键规则

1. **具体明确** — 说"第 42 行可能存在 SQL 注入"，而不是"有安全问题"
2. **解释原因** — 不要只说要改什么，要解释为什么
3. **建议而非命令** — 说"可以考虑用 X，因为 Y"，而不是"改成 X"
4. **分级标注** — 用 🔴 阻塞项、🟡 建议项、💭 小改进来标记问题
5. **表扬好代码** — 发现巧妙的解决方案和优雅的模式要主动肯定
6. **一次到位** — 不要分多轮逐步反馈，一次审查给出完整意见
7. **区分意见和事实** — "这里有内存泄漏"是事实，"我觉得用策略模式更好"是意见，标注清楚

```

</details>

#### 缺口

- 完整331素材、五团逐项质量/实际专业能力和用户任务未验。
  **影响**：数量不等任务覆盖或专家资质。
  **进一步探讨**：选择2名明确职责专家对照单Agent做同一评审，人工核有效证据。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 委派如何产生结果，失败怎样呈现？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

readExpertPrompt只允许分区和安全slug，读persona正文；runExpert核启用/冲突/provider能力后将persona与任务送subagent。旧宿主start支持启动persona/toolFilter，新startActivation按childId在agent/created注入section并restrict，最后移除临时监听。普通await结果或取消并dispose，stopReason非completed报错，不把部分文本冒成完成。

团队先取同revision名册/配置、解析冻结team/experts，再核全部成员已启用；最多4个worker并行，单成员失败保留其他成功结果，coverage是returned complete/partial/failed，要求主会话核证据/分歧。原生检测真实service形状与当前会话工具，显式maxDepth走普通路径；原生复用持久命名idle队友、先创建task再发送/创建fresh队友，未接受失败清task，已接受返回started，不自动降级重跑。取消尝试interrupt已启动者但错误要报告。启动确认不能替实际成员结论，原生汇总仍依赖主会话wait/task板。actual lib入口委托chunk，关键冻结/双路径与src一致。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:361-389](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/src/index.ts#L361-L389)

persona读取约束。

<details>
<summary>查看原文（29行）</summary>

```text
const EXPERT_PATH_SEGMENT_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** 读取一个受允许分区约束的 persona 正文，拒绝路径穿越和无效文档。 */
export async function readExpertPrompt(
  root: string,
  slug: string,
  division: string,
  divisions: readonly string[] = DEFAULT_DIVISIONS,
  locale: LocaleId = 'zh',
): Promise<{ prompt: string }> {
  if (!divisions.includes(division) || !EXPERT_PATH_SEGMENT_PATTERN.test(slug)) {
    throw new Error(teamText(locale, '无效的专家提示词请求。'))
  }
  return readPersonaFile(join(root, division, `${slug}.md`), locale);
}

async function readPersonaFile(filePath: string, locale: LocaleId = 'zh'): Promise<{ prompt: string }> {
  let raw: string
  try {
    raw = stripBom(await readFile(filePath, 'utf8'))
  } catch (cause) {
    const missing = (cause as NodeJS.ErrnoException)?.code === 'ENOENT'
    throw new PersonaError(missing ? 'PERSONA_NOT_FOUND' : 'PERSONA_READ_FAILED', locale, cause)
  }
  const parsed = parseFrontmatter(raw)
  if (parsed === undefined || parsed.name === undefined || parsed.description === undefined || parsed.body === '') {
    throw new Error(teamText(locale, '专家提示词格式无效。'))
  }
  return { prompt: parsed.body }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:918-955](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/src/index.ts#L918-L955)

结果/取消/dispose。

<details>
<summary>查看原文（38行）</summary>

```text
  async function awaitSubagentRun(run: SubagentRunHandle, signal?: AbortSignal): Promise<SubagentRunResult> {
    let disposal: Promise<void> | undefined
    const dispose = (): Promise<void> => {
      if (disposal === undefined) {
        try {
          disposal = run.dispose()
        } catch (error) {
          disposal = Promise.reject(error)
        }
      }
      return disposal
    }
    if (signal === undefined) {
      try {
        return await run.result
      } finally {
        await dispose()
      }
    }
    let rejectAborted!: (reason: unknown) => void
    const aborted = new Promise<never>((_resolve, reject) => { rejectAborted = reject })
    const onAbort = (): void => {
      void dispose().catch(() => undefined)
      rejectAborted(signal.reason ?? new Error())
    }
    signal.addEventListener('abort', onAbort, { once: true })
    try {
      if (signal.aborted) {
        onAbort()
        await dispose()
        throw signal.reason ?? new Error()
      }
      return await Promise.race([run.result, aborted])
    } finally {
      signal.removeEventListener('abort', onAbort)
      await dispose()
    }
  }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:967-1025](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/src/index.ts#L967-L1025)

双版宿主adapter。

<details>
<summary>查看原文（59行）</summary>

```text
  async function startSubagentRun(providerName: string, options: ExpertSubagentStart): Promise<SubagentRunHandle> {
    const { persona, toolFilter, label, signal, prompt, parent, maxDepth } = options
    const service = ctx.subagents as unknown as {
      start?: (name: string, request: SubagentStartRequest & { persona?: string; toolFilter?: { deny: string[] } }) => Promise<SubagentRun>
      startActivation?: (spec: {
        provider: string
        label: string
        childId?: ReturnType<typeof SessionId>
        request: Omit<SubagentStartRequest, 'label' | 'signal'>
        signal: AbortSignal
        delivery: 'parent' | 'caller'
      }) => Promise<SubagentRunHandle>
      on?: Context['on']
    }
    // DSH 0.2.0-rc.1 / 0.2.0-rc.2: start-time persona / toolFilter.
    const runSignal = signal ?? new AbortController().signal
    if (typeof service.start === 'function') {
      return service.start(providerName, {
        label,
        prompt,
        parent,
        signal: runSignal,
        ...(maxDepth === undefined ? {} : { maxDepth }),
        persona,
        toolFilter,
      })
    }
    // DSH 0.2.1-rc.1: startActivation + scoped persona / tools.restrict on agent/created.
    if (typeof service.startActivation === 'function') {
      const childId = SessionId(randomUUID())
      const stopCreated = ctx.on('agent/created', (event: { agent: { id: string; ctx: Context } }) => {
        if (event.agent.id !== childId) return undefined
        const childCtx = event.agent.ctx
        if (childCtx.systemPrompt) {
          childCtx.systemPrompt.section({
            name: PERSONA_PREFIX_SECTION,
            order: childCtx.systemPrompt.getSectionOrder('DEPLOYMENT_PERSONA_PREFIX'),
            text: persona,
          })
        }
        if (childCtx.tools) childCtx.tools.restrict(toolFilter)
        return undefined
      })
      try {
        return await service.startActivation({
          provider: providerName,
          label: label ?? providerName,
          childId,
          request: {
            parent,
            prompt,
            ...(maxDepth === undefined ? {} : { maxDepth }),
          },
          signal: runSignal,
          delivery: 'caller',
        })
      } finally {
        stopCreated()
      }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:1030-1063](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/src/index.ts#L1030-L1063)

runExpert完整执行链。

<details>
<summary>查看原文（34行）</summary>

```text
  async function runExpert(query: unknown, task: unknown, exec: ToolRunContext): Promise<{ expert: string; answer: string }> {
    const locale = activeLocale()
    // 单条与批量召唤共用同一套任务校验，避免单条路径绕过码点上限
    const taskText = normalizeTask(task, locale)
    if (exec.agent === undefined) throw new Error(formatHost(locale, 'error.summonRequiresAgent'))
    const provider = ctx.subagents.getProvider(config.provider)
    if (provider === undefined) throw new Error(formatHost(locale, 'error.providerMissing', { provider: config.provider }))
    const caps = provider.capabilities as { persona?: boolean; toolFilter?: boolean; depthLimit?: boolean }
    // 0.2.0-rc.1 / 0.2.0-rc.2 still advertise persona/toolFilter; 0.2.1-rc.1 drops them.
    if (caps.persona !== undefined || caps.toolFilter !== undefined) {
      if (!caps.persona) throw new Error(formatHost(locale, 'error.providerNoPersona', { provider: config.provider }))
      if (!caps.toolFilter) throw new Error(formatHost(locale, 'error.providerNoToolFilter', { provider: config.provider }))
    }
    if (maxDepth !== undefined && !caps.depthLimit) throw new Error(formatHost(locale, 'error.providerNoMaxDepth', { provider: config.provider }))
    const expert = resolveExpert((await library.catalog()).experts.filter(expert => !expert.conflict), query, locale)
    if (!enabledSet().has(expert.slug)) throw new Error(formatHost(locale, 'error.expertDisabled', { name: localizedExpertName(expert, locale) }))
    const { prompt: persona } = await personaSource.getPrompt(expert.slug, expert.division, locale)
    const run = await startSubagentRun(config.provider, {
      label: localizedExpertName(expert, locale),
      prompt: [{ type: 'text', text: taskText }],
      parent: exec.agent,
      persona: sanitize(persona),
      toolFilter: { deny: ['summon_expert', 'summon_experts', 'list_experts', 'list_expert_teams', 'get_expert_team', 'summon_expert_team'] },
      ...(maxDepth === undefined ? {} : { maxDepth }),
      signal: exec.signal,
    })
    const result = await awaitSubagentRun(run, exec.signal)
    const text = textBlocks(result.output)
    if (result.stopReason !== 'completed') {
      const detail = text.length > 0 ? formatHost(locale, 'error.partialOutput', { text }) : ''
      throw new Error(formatHost(locale, 'error.expertRun', { reason: result.stopReason, detail }))
    }
    return { expert: localizedExpertName(expert, locale), answer: text }
  }
```

</details>

**依据 5 · 源码核查**：[src/index.ts:1160-1201](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/src/index.ts#L1160-L1201)

工具入口到两引擎。

<details>
<summary>查看原文（42行）</summary>

```text
ctx.tools.register(localizeTeamTool(defineTool({ name: 'summon_expert_team', description: teamTx("按专家团配置并行委派。先读取 get_expert_team 的主理人规则；提供完整任务及资料。返回成员结果和冻结的汇总规则，由当前主会话完成最终交付，不额外启动团长。"),
    parameters: { team: { type: 'string', required: true, description: teamTx("专家团稳定标识或完整名称。") }, task: { type: 'string', required: true, description: teamTx("目标、约束和文件路径。不要粘贴源码、CSS、HTML 或带引号的代码，否则工具参数会变成非法 JSON。最多{0}字。") } }, output: teamOutput,
    async execute(args, exec) {
        requireParent(exec);
        const [snapshot, catalog] = await Promise.all([teamLibrary.snapshot(), library.catalog()]);
        if (snapshot.revision !== catalog.revision)
            throw new Error(teamTx("名册已更新，请重新读取专家团。"));
        const team = snapshot.teams.map(t => localizeTeam(t, activeLocale())).find(t => t.id === args.team || t.name === args.team || snapshot.teams.find(original => original.id === t.id)?.name === args.team);
        if (!team || !snapshot.enabledTeams.includes(team.id))
            throw new Error(teamTx("专家团未启用或不存在。"));
        const engine = resolveTeamEngine(ctx, exec.agent, maxDepth);
        const locale = activeLocale();
        if (engine.status.mode === 'native' && engine.service) {
            const result = await dispatchNativeTeam({ team, locale, experts: catalog.experts, enabled: catalog.enabled, task: String(args.task ?? ''), revision: snapshot.revision,
                signal: exec.signal, agent: exec.agent!, service: engine.service, provider: config.provider,
                readPersona: async (expert) => (await personaSource.getPrompt(expert.slug, expert.division, locale)).prompt });
            return { report: JSON.stringify({ ...result, engine: engine.status }) };
        }
        const provider = ctx.subagents.getProvider(config.provider);
        const teamCaps = provider?.capabilities as { persona?: boolean; toolFilter?: boolean; depthLimit?: boolean } | undefined
        // 0.2.0-rc.1 / 0.2.0-rc.2 仍声明 persona/toolFilter；0.2.1-rc.1 不再声明，身份改在 agent/created 写入。
        const legacyTeamCaps = teamCaps !== undefined && (teamCaps.persona !== undefined || teamCaps.toolFilter !== undefined)
        if (!provider || (legacyTeamCaps && (!teamCaps?.persona || !teamCaps.toolFilter)) || (maxDepth !== undefined && !teamCaps?.depthLimit))
            throw new Error(teamTx("当前子代理服务不支持专家团所需的身份、工具过滤或深度限制。"));
        const result = await executeTeam({ team, locale, experts: catalog.experts, enabled: catalog.enabled, task: String(args.task ?? ''), revision: snapshot.revision, signal: exec.signal,
            readPersona: async (expert) => (await personaSource.getPrompt(expert.slug, expert.division, locale)).prompt,
            run: async (member: TeamMemberRun) => {
                exec.signal?.throwIfAborted();
                const run = await startSubagentRun(config.provider, { label: member.name, parent: exec.agent!,
                    prompt: [{ type: 'text', text: member.prompt }], persona: sanitize(member.persona),
                    toolFilter: { deny: ['summon_expert', 'summon_experts', 'list_experts', 'list_expert_teams', 'get_expert_team', 'summon_expert_team'] },
                    ...(maxDepth === undefined ? {} : { maxDepth }), signal: exec.signal });
                const value = await awaitSubagentRun(run, exec.signal);
                if (value.stopReason !== 'completed')
                    throw new Error(teamTx("成员未完成：{0}。{1}", [value.stopReason, textBlocks(value.output)]));
                return textBlocks(value.output);
            },
        });
        return { report: JSON.stringify({ ...result, engine: engine.status }) };
    },
}), activeLocale, [TEAM_TASK_MAX_CHARS]));

```

</details>

**依据 6 · 源码核查**：[src/team-runtime.ts:28-84](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/src/team-runtime.ts#L28-L84)

冻结/成员/提示/准备失败。

<details>
<summary>查看原文（57行）</summary>

```text

    const team = structuredClone(teamSchema.parse(localizeTeam(args.team, args.locale ?? 'zh')));
    const experts = structuredClone(args.experts).map(expert => ({ ...expert, name: localizedExpertName(expert, args.locale ?? 'zh') }));
    const task = args.task.trim();
    if (!task || Array.from(task).length > TEAM_TASK_MAX_CHARS)
        throw new Error(tx("团队任务必须为 1～{0} 字。请压缩为摘要（目标、约束和文件路径）后重试，不要粘贴源码。", [TEAM_TASK_MAX_CHARS]));
    args.signal?.throwIfAborted();
    const selected = team.members.map((member) => {
        const expert = experts.find((e) => e.slug === member.expertSlug && !e.conflict);
        if (!expert || !args.enabled.includes(expert.slug))
            throw new Error(tx("团队成员不存在、冲突或已停用，请修复后重新召唤。"));
        return { member, expert };
    });
    const collaboration = teamCollaboration(team, args.locale);
    const results: {
        expert: string;
        slug: string;
        ok: boolean;
        answer: string;
        error?: string;
    }[] = Array(selected.length);
    const prepared = await Promise.all(selected.map(async ({ member, expert }, current) => {
        try {
            const persona = await args.readPersona(expert);
            args.signal?.throwIfAborted();
            return {
                slug: expert.slug,
                name: expert.name,
                persona,
                prompt: [
                    tx("专家团：{0}\n共同目标：{1}\n共同约束：{2}", [team.name, team.goal, team.constraints]),
                    tx("任务简报：\n{0}", [task]),
                    tx("共同交付要求：{0}", [team.deliveryRequirements]),
                    tx("职责边界：\n{0}", [selected.map((peer) => `${peer.expert.name}（${peer.expert.slug}）：${peer.member.duty}`).join('\n')]),
                    tx("你的分工：{0}\n{1}", [member.duty, member.instructions]),
                    tx("本次为独立并行分析，不得假设已经收到其他成员的结果。需要交叉核验的事项交给主理人，不自行召唤其他专家或启动新一轮。"),
                    tx("回传格式：\n{0}", [collaboration.memberOutput.join('\n')]),
                    tx("验收重点：\n{0}", [collaboration.reviewChecklist.join('\n')]),
                ].join('\n\n'),
            };
        }
        catch (cause) {
            args.signal?.throwIfAborted();
            results[current] = {
                expert: expert.name,
                slug: expert.slug,
                ok: false,
                answer: '',
                error: cause instanceof Error ? cause.message : tx("身份读取失败"),
            };
            return undefined;
        }
    }));
    args.signal?.throwIfAborted();
    let index = 0;
    await Promise.allSettled(Array.from({ length: Math.min(4, prepared.length) }, async () => {
        while (index < prepared.length) {
```

</details>

**依据 7 · 源码核查**：[src/team-runtime.ts:85-142](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/src/team-runtime.ts#L85-L142)

并发/partial与coverage非验收。

<details>
<summary>查看原文（58行）</summary>

```text
            args.signal?.throwIfAborted();
            const current = index++;
            const member = prepared[current];
            if (!member)
                continue;
            try {
                const answer = await args.run(member);
                if (!answer.trim())
                    throw new Error(tx("成员未返回有效分析内容"));
                results[current] = {
                    expert: member.name,
                    slug: member.slug,
                    ok: true,
                    answer,
                };
            }
            catch (cause) {
                args.signal?.throwIfAborted();
                results[current] = {
                    expert: member.name,
                    slug: member.slug,
                    ok: false,
                    answer: '',
                    error: cause instanceof Error ? cause.message : tx("成员执行失败"),
                };
            }
        }
    }));
    args.signal?.throwIfAborted();
    const completed = results.filter((result) => result.ok).length;
    const coverage = {
        status: completed === results.length
            ? 'complete'
            : completed
                ? 'partial'
                : 'failed',
        completed,
        total: results.length,
        missing: results.flatMap((result, current) => result.ok
            ? []
            : [
                {
                    slug: result.slug,
                    duty: selected[current].member.duty,
                    error: result.error,
                },
            ]),
    };
    return {
        team,
        revision: args.revision,
        coordinator: effectiveCoordinator(team, args.locale),
        results,
        collaboration,
        coverage,
        instruction: tx("{0}由当前主会话按本次主理人规则、协作验收清单和交付要求综合结果：{1}。逐项核对证据、口径、交接问题及分歧；无法核实的内容标为待验证。标明失败成员及职责覆盖缺口；不自动重试或新增轮次，不编造意见。", [completed ? tx("成员返回成功不代表结论已通过验证。") : tx("没有可用的成员结果，不得据此编造实质性汇总结论。"), team.deliveryRequirements]),
    };
}
```

</details>

**依据 8 · 源码核查**：[src/team-engine.ts:95-113](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/src/team-engine.ts#L95-L113)

引擎/工具/maxDepth检测。

<details>
<summary>查看原文（19行）</summary>

```text
        return { state: 'disabled', mode: 'subagent', reason: tx("Agent Team 服务或当前会话工具尚未就绪。"), recommendation: tx("建议在插件页开启 Agent Team 的 Host 与 Web 层，并重新加载会话；未开启也可继续使用普通专家团。") };
    if (maxDepth !== undefined)
        return { state: 'enabled', mode: 'subagent', reason: tx("原生 Agent Team 暂不支持本插件配置的深度限制，本次使用普通子代理以保留该限制。"), recommendation: '' };
    return { state: 'enabled', mode: 'native', reason: tx("Agent Team 已启用，使用原生团队协作。"), recommendation: '' };
}
export function resolveTeamEngine(ctx: Context, agent?: Agent, maxDepth?: number) {
    const service: unknown = ctx.get('agentTeams');
    const toolsReady = !isNativeTeamService(service) || !agent || ['spawn_teammate', 'send_message', 'wait_agent', 'team_task_create', 'team_task_update', 'team_task_list'].every(name => agent.ctx?.tools?.get?.(name, agent) !== undefined);
    return { service: isNativeTeamService(service) ? service : undefined, status: detectTeamEngine(service, isNativeTeamService(service) || hostHasAgentTeam(), toolsReady, maxDepth, readHostLocale(ctx)) };
}
const activeLeads = new WeakSet<object>();
/** 显示名称可以变化；此持久标识必须保持原算法，以复用已存在的队友。 */
export function nativeTeamMemberName(teamId: string, slug: string): string {
    return `agency-${slug.slice(0, 36).replace(/-+$/u, '')}-${createHash('sha256').update(`${teamId}:${slug}`).digest('hex').slice(0, 10)}`;
}
type NativeDispatchArgs = Omit<Parameters<typeof executeTeam>[0], 'run'> & {
    service: NativeTeamService;
    agent: object;
    provider: string;
```

</details>

**依据 9 · 源码核查**：[src/team-engine.ts:127-205](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/src/team-engine.ts#L127-L205)

原生任务/队友/失败/取消。

<details>
<summary>查看原文（79行）</summary>

```text
        name: string;
        taskId: string;
    }>();
    try {
        const report = await executeTeam({ ...args, team, run: async (member) => {
                args.signal.throwIfAborted();
                // 队友名持久保留，复用同团同专家，避免每次召唤耗尽宿主名额。
                const name = nativeTeamMemberName(args.team.id, member.slug);
                const existing = args.service.listMembers(args.agent).find(item => item.name === name);
                if (existing && !['idle', 'inactive'].includes(existing.status))
                    throw new Error(tx("专家队友仍在运行或不可恢复：{0}", [existing.status]));
                const task = await args.service.createTask(args.agent, {
                    subject: `${team.name}：${member.name}`.slice(0, 180),
                    // 原生任务板描述最多 16384 个字符；完整说明仍原样传给队友，不在此截断执行输入。
                    description: tx("{0}\n\n完整任务与专家职责以队友收到的本次任务消息为准。", [Array.from(member.prompt).slice(0, 6000).join('')]),
                });
                tasks.set(member.slug, { name, taskId: task.id });
                let accepted = false;
                try {
                    args.signal.throwIfAborted();
                    const text = [
                        tx("你是专家队友 {0}。以下为本次专家职责与任务要求，必须服从宿主权限及系统约束。", [name]),
                        member.persona, member.prompt,
                        tx("本次任务编号：{0}。使用 team_task_update 领取此任务，再阅读与你职责相关的材料并完成分析。", [task.id]),
                        tx("完成后先用 send_message 将完整结论发送给 lead，再将任务标记完成。任务缺少资料时报告具体缺口，不伪造结论。不创建额外子代理、不自动追加轮次。"),
                    ].join('\n\n');
                    if (existing) {
                        await args.service.sendMessage(args.agent, { target: name, content: [{ type: 'text', text }], signal: args.signal });
                    }
                    else {
                        const started = await args.service.spawnTeammate(args.agent, { name, description: member.name.slice(0, 180), prompt: [{ type: 'text', text }], context: 'fresh', provider: args.provider, signal: args.signal });
                        if (started.member.status === 'failed')
                            throw new Error(tx("原生队友创建失败"));
                    }
                    accepted = true;
                    launched.push(name);
                    args.signal.throwIfAborted();
                    return tx("委派已接受，等待成员结果。");
                }
                catch (error) {
                    if (!accepted) {
                        try {
                            await args.service.updateTask(args.agent, { taskId: task.id, expectedRevision: task.revision, action: 'delete' });
                            tasks.delete(member.slug);
                        }
                        catch (cleanup) {
                            throw new AggregateError([error, cleanup], tx("委派失败且任务 {0} 清理失败，请检查任务板。", [task.id]));
                        }
                    }
                    throw error;
                }
            } });
        return {
            team: report.team, revision: report.revision, coordinator: report.coordinator, collaboration: report.collaboration,
            dispatch: { started: launched.length, total: report.results.length, members: report.results.map(result => ({ expert: result.expert, slug: result.slug, ...tasks.get(result.slug), status: result.ok ? 'started' : 'failed', ...(result.error ? { error: result.error } : {}) })) },
            instruction: launched.length
                ? tx("以上仅是启动确认，不是评审结论。使用 team_task_list 查看本次任务，使用 wait_agent 等待成员消息；没有结果时不要结束为最终答复。收到实际成员结论后，按 coordinator 和 collaboration.reviewChecklist 核验并汇总。只处理本次 taskId；失败成员明确标注，不自动重试或追加普通子代理。") : tx("本次没有成功启动成员。请报告失败原因，不得编造专家意见；不要自动改用普通模式重复执行。"),
        };
    }
    catch (error) {
        if (args.signal.aborted) {
            const errors: unknown[] = [];
            for (const name of launched) {
                try {
                    await args.service.interrupt(args.agent, name);
                }
                catch (cause) {
                    errors.push(cause);
                }
            }
            if (errors.length)
                throw new AggregateError([error, ...errors], tx("已取消委派，但部分队友中断失败，请检查团队状态。"));
        }
        throw error;
    }
    finally {
        activeLeads.delete(args.agent);
    }
}
```

</details>

**依据 10 · 源码核查**：[lib/index.js:1-2](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/lib/index.js#L1-L2)

发布main实际chunk。

```text
import { C as unquote, I as ZH_NAME, S as truncate, _ as resolveCatalogRoot, a as SUMMON_EXPERTS_MAX, b as stripBom, c as createAgencyPersonaSource, d as loadCatalog, f as mapPool, g as readLocalizedExpertPrompt, h as readExpertPrompt, i as SUMMON_EXPERTS_CONCURRENCY, l as inject, m as parseFrontmatter, n as Config, o as SUMMON_TASK_MAX_CHARS, p as name, r as DEFAULT_DIVISIONS, s as apply, t as AGENCY_PERSONA_SERVICE, u as liveSchemaField, v as resolveExpert, w as validateSummonSpecs, x as toSummonItemResult, y as sanitize } from "./src-C-tLCf9B.js";
export { AGENCY_PERSONA_SERVICE, Config, DEFAULT_DIVISIONS, SUMMON_EXPERTS_CONCURRENCY, SUMMON_EXPERTS_MAX, SUMMON_TASK_MAX_CHARS, ZH_NAME, apply, createAgencyPersonaSource, inject, liveSchemaField, loadCatalog, mapPool, name, parseFrontmatter, readExpertPrompt, readLocalizedExpertPrompt, resolveCatalogRoot, resolveExpert, sanitize, stripBom, toSummonItemResult, truncate, unquote, validateSummonSpecs };
```

**依据 11 · 源码核查**：[lib/src-C-tLCf9B.js:2094-2112](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/lib/src-C-tLCf9B.js#L2094-L2112)

发布路径冻结成员。

<details>
<summary>查看原文（19行）</summary>

```text
async function executeTeam(args) {
	const tx = (key, values) => teamText(args.locale ?? "zh", key, values);
	const team = structuredClone(teamSchema.parse(localizeTeam(args.team, args.locale ?? "zh")));
	const experts = structuredClone(args.experts).map((expert) => ({
		...expert,
		name: localizedExpertName(expert, args.locale ?? "zh")
	}));
	const task = args.task.trim();
	if (!task || Array.from(task).length > 2e4) throw new Error(tx("团队任务必须为 1～{0} 字。请压缩为摘要（目标、约束和文件路径）后重试，不要粘贴源码。", [TEAM_TASK_MAX_CHARS]));
	args.signal?.throwIfAborted();
	const selected = team.members.map((member) => {
		const expert = experts.find((e) => e.slug === member.expertSlug && !e.conflict);
		if (!expert || !args.enabled.includes(expert.slug)) throw new Error(tx("团队成员不存在、冲突或已停用，请修复后重新召唤。"));
		return {
			member,
			expert
		};
	});
	const collaboration = teamCollaboration(team, args.locale);
```

</details>

**依据 12 · 源码核查**：[lib/src-C-tLCf9B.js:4180-4239](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/lib/src-C-tLCf9B.js#L4180-L4239)

发布路径双引擎。

<details>
<summary>查看原文（60行）</summary>

```text
				const result = await dispatchNativeTeam({
					team,
					locale,
					experts: catalog.experts,
					enabled: catalog.enabled,
					task: String(args.task ?? ""),
					revision: snapshot.revision,
					signal: exec.signal,
					agent: exec.agent,
					service: engine.service,
					provider: config.provider,
					readPersona: async (expert) => (await personaSource.getPrompt(expert.slug, expert.division, locale)).prompt
				});
				return { report: JSON.stringify({
					...result,
					engine: engine.status
				}) };
			}
			const provider = ctx.subagents.getProvider(config.provider);
			const teamCaps = provider?.capabilities;
			const legacyTeamCaps = teamCaps !== void 0 && (teamCaps.persona !== void 0 || teamCaps.toolFilter !== void 0);
			if (!provider || legacyTeamCaps && (!teamCaps?.persona || !teamCaps.toolFilter) || maxDepth !== void 0 && !teamCaps?.depthLimit) throw new Error(teamTx("当前子代理服务不支持专家团所需的身份、工具过滤或深度限制。"));
			const result = await executeTeam({
				team,
				locale,
				experts: catalog.experts,
				enabled: catalog.enabled,
				task: String(args.task ?? ""),
				revision: snapshot.revision,
				signal: exec.signal,
				readPersona: async (expert) => (await personaSource.getPrompt(expert.slug, expert.division, locale)).prompt,
				run: async (member) => {
					exec.signal?.throwIfAborted();
					const value = await awaitSubagentRun(await startSubagentRun(config.provider, {
						label: member.name,
						parent: exec.agent,
						prompt: [{
							type: "text",
							text: member.prompt
						}],
						persona: sanitize(member.persona),
						toolFilter: { deny: [
							"summon_expert",
							"summon_experts",
							"list_experts",
							"list_expert_teams",
							"get_expert_team",
							"summon_expert_team"
						] },
						...maxDepth === void 0 ? {} : { maxDepth },
						signal: exec.signal
					}), exec.signal);
					if (value.stopReason !== "completed") throw new Error(teamTx("成员未完成：{0}。{1}", [value.stopReason, textBlocks(value.output)]));
					return textBlocks(value.output);
				}
			});
			return { report: JSON.stringify({
				...result,
				engine: engine.status
			}) };
```

</details>

#### 缺口

- 当前宿主版本/真实子Agent取消和原生任务回传未运行。
  **影响**：不能保证已接受成员都完成或外部副作用取消。
  **进一步探讨**：本机副本做provider缺失/一成员失败/取消/原生部分启动矩阵，核任务与真实输出。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 专业身份和防递归能保证什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

专家是同一宿主模型加persona，不是各领域训练模型或真实职业审查员。代码审查提示里的上千PR经验属于角色设定，不是数据；法律/心理等素材更不能当专业验收。多成员可能共享同模型错误，主会话仍要检查原证据，覆盖返回仅数量维度。

普通路径deny插件六个召唤/目录工具，原生pre-execute对agency命名teammate再拦指定委派工具，requireParent也阻子会话召团；这些是真实有限递归保护，非只读或全面安全沙箱。成员仍可使用宿主允许的其他文件/命令/网络工具，不能以角色评审名默认授权写入。任务/名册快照保护配置一致性，不证明所有外部资料在运行期间不变。

依赖DSH0.2.x peer、可用subagent provider及persona/限制适配、模型与文件访问；native额外要兼容服务与当前工具，用户显式maxDepth保留普通路径。首次选择/启用专家和小团、持续多成员模型token与主会话核证、失败处理partial/task清理、退出保留设置/历史和已发生外部动作都有成本。在线更新/AI创建与全UI路由未审，企业安全宣传不据此采信；未在线核价/安装兼容，Apache声明不等零成本。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1050-1055](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/src/index.ts#L1050-L1055)

普通deny只列插件工具。

```text
      parent: exec.agent,
      persona: sanitize(persona),
      toolFilter: { deny: ['summon_expert', 'summon_experts', 'list_experts', 'list_expert_teams', 'get_expert_team', 'summon_expert_team'] },
      ...(maxDepth === undefined ? {} : { maxDepth }),
      signal: exec.signal,
    })
```

**依据 2 · 源码核查**：[src/index.ts:1129-1143](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/src/index.ts#L1129-L1143)

父会话守卫。

<details>
<summary>查看原文（15行）</summary>

```text

const requireParent = (exec: ToolRunContext): void => {
    if (!exec.agent)
        throw new Error(teamTx("专家团只能在主会话中召唤。"));
    const parent = (exec.agent as unknown as {
        session?: {
            header?: {
                parentSession?: unknown;
            };
        };
    }).session?.header?.parentSession;
    if (parent !== undefined)
        throw new Error(teamTx("专家成员不能继续召唤专家团。"));
};
const teamOutput = { schema: { type: 'object' as const, additionalProperties: false, properties: { report: { type: 'string' as const, required: true as const } } }, render: (_args: unknown, value: {
```

</details>

**依据 3 · 源码核查**：[src/index.ts:667-671](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/src/index.ts#L667-L671)

原生执行守卫接线。

```text
  ctx.on?.('tools/pre-execute', async (exec, next) => {
    if (blocksNativeDelegation(ctx.get('agentTeams'), exec.agent, exec.name)) return { kind: 'deny', reason: teamTx('专家团成员不能继续创建子代理或扩展专家团，请将缺口交给主理人。') }
    return next()
  })
  const retryCleanup = (): void => {
```

**依据 4 · 源码核查**：[src/team-engine.ts:67-78](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/src/team-engine.ts#L67-L78)

原生具体工具集合/命名条件。

<details>
<summary>查看原文（12行）</summary>

```text
}
export function isNativeTeamService(value: unknown): value is NativeTeamService {
    return value !== null && typeof value === 'object' && methods.every(key => typeof (value as Record<string, unknown>)[key] === 'function');
}
let agentTeamInstalled: boolean | undefined
/** 安装探测从宿主启动入口解析，避免插件自身依赖版本冒充宿主能力。同一进程只探测一次。 */
export function hostHasAgentTeam(): boolean {
    if (agentTeamInstalled !== undefined)
        return agentTeamInstalled;
    if (!process.argv[1])
        return agentTeamInstalled = false;
    try {
```

</details>

**依据 5 · 源码核查**：[package.json:1-11](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/package.json#L1-L11)

版本/Node/DSH。

<details>
<summary>查看原文（11行）</summary>

```text
{
  "name": "@michengai/dsh-agency-agents",
  "description": "DSH Agency Agents — 为 DeepSeek Harness 提供 331 名可召唤的专业智能体 · 331 summonable domain experts for DeepSeek Harness",
  "version": "1.2.21",
  "type": "module",
  "packageManager": "pnpm@11.22.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.2.0-rc.1 <0.3.0-0"
  },
  "main": "lib/index.js",
```

</details>

**依据 6 · 源码核查**：[README.md:64-81](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/README.md#L64-L81)

同模型/任务/设置边界。

<details>
<summary>查看原文（18行）</summary>

```text

### Tool interfaces

Retain `list_experts`, `summon_expert`, and `summon_experts`. Add `list_expert_teams`, `get_expert_team`, and `summon_expert_team`. The main conversation reads the enabled team's rules and duties before delegating the complete task, then verifies and summarizes actual member results.

### Drafts, language, and data

- System presets, member names, coordinator templates, UI, and runtime feedback support Chinese and English. Custom content remains unchanged, and language switches preserve unsaved drafts.
- Confirm team replacement or example insertion. If the draft changes during confirmation, stop insertion and retain the new text, attachments, and references.
- Team configuration lives in the host `agency-agents` settings namespace. Keep drafts on edit conflicts and review the latest configuration. Disabling or deleting teams does not disable experts or delete historical conversations.
- Experts cannot summon further experts or automatically add analysis rounds. Cancellation prevents queued starts; completed results and failures are reported separately.

### Conversational Creation with AI

Create custom experts and teams directly through natural language in chat via the **Create with AI** entry:

1. **Auto-jump with Prompt Prefixes**: Clicking \"Create with AI\" from the creation menu automatically closes the settings drawer and navigates to the main chat, injecting a natural prompt prefix (e.g. `I want to create an expert specializing in ` or `Assemble an expert team for this mission: `) with cursor auto-focused at the end;
2. **In-Chat Structured Preview**: Specialized tools (`propose_custom_expert` / `propose_expert_team`) generate Markdown preview cards containing division categories, collapsed prompt blocks, and localized roster members with emojis, physically preventing disruptive popups during drafting;
```

</details>

**依据 7 · 源码核查**：[assets/agency-agents-zh/engineering/engineering-code-reviewer.md:12-16](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/assets/agency-agents-zh/engineering/engineering-code-reviewer.md#L12-L16)

身份经验仅persona。

```text
## 🧠 身份与记忆
- **角色**：代码审查与质量保障专家
- **性格**：建设性、深入、有教育意义、尊重他人
- **记忆**：你熟记常见反模式、安全陷阱和提升代码质量的审查技巧
- **经验**：你审查过上千个 PR，深知最好的审查是教学，而非批判
```

#### 缺口

- 全部HTTP/更新/创建/设置写接口和宿主权限链未全面审。
  **影响**：不为企业安全/全功能无递归或只读背书。
  **进一步探讨**：先锁定宿主权限与只读任务，独立审需要开启的额外路径。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样小范围验证，原生收据有何增量？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议有重复评审任务的DSH用户先在副本工作区启用2人小团，以明确文件路径/职责分工做只读评审，先get团规则再委派；普通路径核partial与原文，native路径必须等本次taskId实际消息，不拿started交付。比较同模型单Agent与2人团的有效发现/重复错误、token与核证工时。若意见高度重复、证据无法核、成员仍运行或出现越权写，停止扩团，报告已知/未知结果并回单Agent人工核查，不自动换引擎重跑。

可探索原生启动与最终结果的可机器核对收据：已有稳定成员名/taskId/started状态和主会话wait指令，增量是按本次任务绑定完成/缺口/证据清单，防把旧消息或启动接受误认新结果。与现有任务板/人工等待对照延迟消息、部分启动、复用队友及取消，计误汇总、错归旧结果和额外状态负担；若原生宿主已同效或receipt不能减少误汇总则否定。未实现，不能计已有可靠性贡献。

#### 证据与依据

**依据 1 · 源码核查**：[src/team-engine.ts:141-183](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/src/team-engine.ts#L141-L183)

已有稳定名/任务id/接受。

<details>
<summary>查看原文（43行）</summary>

```text
                    description: tx("{0}\n\n完整任务与专家职责以队友收到的本次任务消息为准。", [Array.from(member.prompt).slice(0, 6000).join('')]),
                });
                tasks.set(member.slug, { name, taskId: task.id });
                let accepted = false;
                try {
                    args.signal.throwIfAborted();
                    const text = [
                        tx("你是专家队友 {0}。以下为本次专家职责与任务要求，必须服从宿主权限及系统约束。", [name]),
                        member.persona, member.prompt,
                        tx("本次任务编号：{0}。使用 team_task_update 领取此任务，再阅读与你职责相关的材料并完成分析。", [task.id]),
                        tx("完成后先用 send_message 将完整结论发送给 lead，再将任务标记完成。任务缺少资料时报告具体缺口，不伪造结论。不创建额外子代理、不自动追加轮次。"),
                    ].join('\n\n');
                    if (existing) {
                        await args.service.sendMessage(args.agent, { target: name, content: [{ type: 'text', text }], signal: args.signal });
                    }
                    else {
                        const started = await args.service.spawnTeammate(args.agent, { name, description: member.name.slice(0, 180), prompt: [{ type: 'text', text }], context: 'fresh', provider: args.provider, signal: args.signal });
                        if (started.member.status === 'failed')
                            throw new Error(tx("原生队友创建失败"));
                    }
                    accepted = true;
                    launched.push(name);
                    args.signal.throwIfAborted();
                    return tx("委派已接受，等待成员结果。");
                }
                catch (error) {
                    if (!accepted) {
                        try {
                            await args.service.updateTask(args.agent, { taskId: task.id, expectedRevision: task.revision, action: 'delete' });
                            tasks.delete(member.slug);
                        }
                        catch (cleanup) {
                            throw new AggregateError([error, cleanup], tx("委派失败且任务 {0} 清理失败，请检查任务板。", [task.id]));
                        }
                    }
                    throw error;
                }
            } });
        return {
            team: report.team, revision: report.revision, coordinator: report.coordinator, collaboration: report.collaboration,
            dispatch: { started: launched.length, total: report.results.length, members: report.results.map(result => ({ expert: result.expert, slug: result.slug, ...tasks.get(result.slug), status: result.ok ? 'started' : 'failed', ...(result.error ? { error: result.error } : {}) })) },
            instruction: launched.length
                ? tx("以上仅是启动确认，不是评审结论。使用 team_task_list 查看本次任务，使用 wait_agent 等待成员消息；没有结果时不要结束为最终答复。收到实际成员结论后，按 coordinator 和 collaboration.reviewChecklist 核验并汇总。只处理本次 taskId；失败成员明确标注，不自动重试或追加普通子代理。") : tx("本次没有成功启动成员。请报告失败原因，不得编造专家意见；不要自动改用普通模式重复执行。"),
```

</details>

**依据 2 · 源码核查**：[src/team-engine.ts:184-194](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/src/team-engine.ts#L184-L194)

仅dispatch与等待指令。

<details>
<summary>查看原文（11行）</summary>

```text
        };
    }
    catch (error) {
        if (args.signal.aborted) {
            const errors: unknown[] = [];
            for (const name of launched) {
                try {
                    await args.service.interrupt(args.agent, name);
                }
                catch (cause) {
                    errors.push(cause);
```

</details>

**依据 3 · 源码核查**：[src/team-runtime.ts:117-142](https://github.com/MichengAI/dsh-agency-agents/blob/cd852c5d16c30e96f3bb56d16052b34c0fa40e66/src/team-runtime.ts#L117-L142)

已有普通coverage和验收指令。

<details>
<summary>查看原文（26行）</summary>

```text
            ? 'complete'
            : completed
                ? 'partial'
                : 'failed',
        completed,
        total: results.length,
        missing: results.flatMap((result, current) => result.ok
            ? []
            : [
                {
                    slug: result.slug,
                    duty: selected[current].member.duty,
                    error: result.error,
                },
            ]),
    };
    return {
        team,
        revision: args.revision,
        coordinator: effectiveCoordinator(team, args.locale),
        results,
        collaboration,
        coverage,
        instruction: tx("{0}由当前主会话按本次主理人规则、协作验收清单和交付要求综合结果：{1}。逐项核对证据、口径、交接问题及分歧；无法核实的内容标为待验证。标明失败成员及职责覆盖缺口；不自动重试或新增轮次，不编造意见。", [completed ? tx("成员返回成功不代表结论已通过验证。") : tx("没有可用的成员结果，不得据此编造实质性汇总结论。"), team.deliveryRequirements]),
    };
}
```

</details>

#### 缺口

- 真实同模型小团收益、原生收据增量未测试。
  **影响**：仅条件试用，不能以多人自动升质量。
  **进一步探讨**：少量可核历史任务A/B，记录有效问题/token/人工复核。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
