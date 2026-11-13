# Agency Agents

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[f4cfe5c](https://github.com/MichengAI/dsh-agency-agents/tree/f4cfe5c088072ca2c061ac0bf919565514e042ee)

<!-- BEGIN META -->
[![GitHub ★ 240](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=240&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-agency-agents) [![npm 30d 72,802](https://img.shields.io/static/v1?label=npm+30d&message=72%2C802&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-agency-agents) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-agency-agents)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供专家角色名册、单专家召唤和专家团协作。

> **亮点**：[Q01](#research-q01) 提供固定团队职责、缺席状态和两种宿主执行接入。[Q02](#research-q02) 原生分派将角色与任务 ID 衔接。

> **主要限制**：[Q02](#research-q02) 启动、任务板、实际结果与取消分别核验，递归守卫只限制部分工具。

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
  - [Q01 · 普通团队何时执行完，原生团队何时只启动？](#detail-section-11)
  - [Q02 · 新宿主如何复用队友与清理，是否实际限制权限？](#detail-section-12)
  - [Q03 · 如何验收一次双人审查并测试更明确的回执？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者需要将评审分成互补职责，并在主会话核对最终结论。

人工给多个代理分配职责、等待回复，再按原始证据汇总。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 普通团队 | 获得带缺席说明的结果 | 需要兼容 provider |
| 原生团队 | 在宿主任务板分派职责 | 启动后等待成员 |
| 工具限制 | 限制专家继续委派 | 仍受宿主权限管理 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 与 subagents provider | 必需 | 实际执行角色 | 报能力不足 |
| agentTeams 与当前工具 | 原生路径 | 任务、消息、等待 | 按探测选普通 |
| 隔离材料与人工验收 | 试用需要 | 限制权限并核证据 | 改手工 |

| 步骤 | 谁操作 | 操作与结果 | 失败处理 |
| --- | --- | --- | --- |
| 定义 | 主会话 | 给两位角色不同职责 | 缩减为单 Agent |
| 分派 | 宿主 | 普通等结果或原生记 taskId | 标缺席并核任务板 |
| 验收 | 开发者 | 读真实成员证据 | 不凭 started 下结论 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主、provider 资源 | 选角色和隔离材料 | 兼容未验 |
| 持续 | 多个模型调用 | 复核重合意见和证据 | 单位审查成本未知 |
| 恢复 | 在途任务 | 核取消与缺席 | 不重复分派 |
| 退出 | 已有任务和日志 | 回单 Agent | 已发生副作用需核 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 职责分解 | 名册版本与分项状态 | 结论准确率 |
| 原生协作 | 任务 ID 与 started | 成员真实完成 |
| 取消 | 尝试中断及失败回执 | 外部副作用 |

> **思考**：[Q02](#research-q02) 启动、任务板、实际结果与取消分别核验，递归守卫只限制部分工具。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 提供固定团队职责、缺席状态和两种宿主执行接入。[Q02](#research-q02) 原生分派将角色与任务 ID 衔接。

[Q02](#research-q02) 按宿主能力选择模式，受理前清理与已启动取消采用不同分支，失败保留状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 启动、任务板、实际结果与取消分别核验，递归守卫只限制部分工具。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 用两个互补角色对照单 Agent 审查小改动，先验任务和证据，再扩大范围。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认双路径、角色和任务连接、取消尝试。真实宿主行为、权限及多人评审增益未验。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/team-engine.ts、src/team-runtime.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查团队入口、普通聚合、V2 复用和清理及工具守卫；未全面评估素材、语言、界面或真实宿主。
- 下一步：用隔离副本让一个成员忙碌、一个中断，对照任务 ID、实际权限及最终分析。

**分析版本**

- **仓库**：[MichengAI/dsh-agency-agents](https://github.com/MichengAI/dsh-agency-agents)
- **版本号**：1.2.31（[固定提交 f4cfe5c](https://github.com/MichengAI/dsh-agency-agents/tree/f4cfe5c088072ca2c061ac0bf919565514e042ee)）
- **版本日期**：2026-11-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 对照已有 taskId 及成员消息，尝试显示从启动到实际验收的同一条任务进展。尚未验证。

用隔离副本让一个成员忙碌、一个中断，对照任务 ID、实际权限及最终分析。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 674 | 160806 | — | — | 1437004 |
| .js | source | 4 | 5613 | 5310 | 276 | — |
| .ts | source | 62 | 14234 | 13099 | 515 | — |
| .mjs | source | 4 | 285 | 241 | 9 | — |
| .ts | test | 39 | 8514 | 7665 | 184 | — |
| .tsx | source | 9 | 1719 | 1633 | 34 | — |
| .tsx | test | 4 | 432 | 423 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/MichengAI/dsh-agency-agents/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 20](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=20&color=737b86&logo=github)](https://github.com/MichengAI/dsh-agency-agents/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=21&color=737b86&logo=github)](https://github.com/MichengAI/dsh-agency-agents/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：专家团怎样把一项评审分发到角色、任务板和最终答复，什么证据能区分启动、完成与权限范围？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 普通团队何时执行完，原生团队何时只启动？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

开发者希望按不同职责重复审查同一个改动。插件先核名册与团队快照 revision 和启用状态。普通路径调用 provider，等待成员回执且只接收 completed；runtime 最多四个工作者并发，汇总 complete、partial 或 failed，主会话仍要核实成员材料。原生路径交由 agentTeams；返回 started 和 taskId 时只是启动。相比手工逐个提示专家，固定角色与缺席清单能改善交接，但角色文本没有证明评审质量或独立资质。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:27-32](https://github.com/MichengAI/dsh-agency-agents/blob/f4cfe5c088072ca2c061ac0bf919565514e042ee/README.md#L27-L32)

作者描述任务与名册用途。

```text
遇到代码审查、设计、运营或研究任务时，在 DSH 中选一位合适的专家，让它从专业角度协助你完成工作。内置 331 名专家，安装后即可选择使用。

- **多端与双入口访问**：支持原有「设置 → 专家」弹窗管理，亦可在插件详情页开启主导航栏常驻「专家」大面板（960px 居中版心，彻底摆脱弹窗视口滚动限制）。
- **自然语言对话创建（Create with AI）**：新建专家与专家团队支持「通过对话创建」双入口，自动跳转主会话预填提示词；智能体在对话中出具结构化图文预览，支持多轮自然微调，满意后经宿主原生 Ask 卡片把关，全量回填反显至编辑弹窗/抽屉（Human-in-the-Loop）。
- **专家管理智能批量操作（Batch Actions）**：在管理筛选条右侧引入原生紧凑批量菜单。与来源、分类、状态及关键词检索动态联动，自适应提供「启用筛选 (N) / 停用筛选 (M)」及「启用全部 (331) / 停用全部」；具备二次确认与原子调度保护。
- **331 位全领域专家名册**：涵盖工程、设计、产品、营销、法务、金融等 22 个标准分区，支持中英文关键词与拼音前缀秒级即时检索。
```

**依据 2 · 源码核查**：[src/index.ts:1194-1210](https://github.com/MichengAI/dsh-agency-agents/blob/f4cfe5c088072ca2c061ac0bf919565514e042ee/src/index.ts#L1194-L1210)

快照、启用判断及原生入口。

<details>
<summary>查看原文（17行）</summary>

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
                signal: exec.signal, agent: exec.agent!, service: engine.service, subagents: engine.subagents, ctx, provider: config.provider,
                readPersona: async (expert) => sanitize((await personaSource.getPrompt(expert.slug, expert.division, locale)).prompt) });
            return { report: JSON.stringify({ ...result, engine: engine.status }) };
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1212-1232](https://github.com/MichengAI/dsh-agency-agents/blob/f4cfe5c088072ca2c061ac0bf919565514e042ee/src/index.ts#L1212-L1232)

普通执行与停止状态检查。

<details>
<summary>查看原文（21行）</summary>

```text
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
                const run = await startSubagentRun(config.provider, { slug: member.slug, label: member.name, parent: exec.agent!,
                    prompt: [{ type: 'text', text: member.prompt }], persona: sanitize(member.persona),
                    toolFilter: { deny: [...EXPERT_TOOL_DENY] },
                    ...(maxDepth === undefined ? {} : { maxDepth }), signal: exec.signal });
                const value = await awaitSubagentRun(run, exec.signal);
                if (value.stopReason !== 'completed')
                    throw new Error(teamTx("成员未完成：{0}。{1}", [value.stopReason, textBlocks(value.output)]));
                return textBlocks(value.output);
            },
        });
        return { report: JSON.stringify({ ...result, engine: engine.status }) };
```

</details>

**依据 4 · 源码核查**：[src/team-runtime.ts:82-131](https://github.com/MichengAI/dsh-agency-agents/blob/f4cfe5c088072ca2c061ac0bf919565514e042ee/src/team-runtime.ts#L82-L131)

最多四路、收集独立错误及覆盖。

<details>
<summary>查看原文（50行）</summary>

```text
    let index = 0;
    await Promise.allSettled(Array.from({ length: Math.min(4, prepared.length) }, async () => {
        while (index < prepared.length) {
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
```

</details>

**依据 5 · 源码核查**：[src/team-engine.ts:353-358](https://github.com/MichengAI/dsh-agency-agents/blob/f4cfe5c088072ca2c061ac0bf919565514e042ee/src/team-engine.ts#L353-L358)

原生结果明确只是启动。

```text
            return {
                team: report.team, revision: report.revision, coordinator: report.coordinator, collaboration: report.collaboration,
                dispatch: { started: launched.length, total: report.results.length, members: report.results.map(result => ({ expert: result.expert, slug: result.slug, ...tasks.get(result.slug), status: result.ok ? 'started' : 'failed', ...(result.error ? { error: result.error } : {}) })) },
                instruction: launched.length
                    ? tx("以上仅是启动确认，不是评审结论。使用 team_task_list 查看本次任务，使用 wait_agent 等待成员消息；没有结果时不要结束为最终答复。收到实际成员结论后，按 coordinator 和 collaboration.reviewChecklist 核验并汇总。只处理本次 taskId；失败成员明确标注，不自动重试或追加普通子代理。") : tx("本次没有成功启动成员。请报告失败原因，不得编造专家意见；不要自动改用普通模式重复执行。"),
            };
```

#### 缺口

- 审查准确率、意见重复及宿主运行未知
  **影响**：不能用名册或 completed 保证质量
  **进一步探讨**：以两个固定职责对照人工逐条验结论

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 新宿主如何复用队友与清理，是否实际限制权限？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、工程质量与复用

#### 完整回答

引擎按宿主 service、subagents 与当前 agent 可见工具选择 V1、V2 或普通模式。V2 对已运行同名队友拒绝新派，空闲可复用 sendMessage；新建则以 childId 记录 persona 与 deny list 后激活。两路都在任务文本加入本次职责。未接受的异常尝试按 expectedRevision 删任务，删失败会报告聚合异常；取消仅尽力中断已启动项，不能据此推断所有任务或外部副作用已清。pre-execute 只拦继续召唤等指定工具，工具 restrict 失败也可能只打日志，因此不是只读工作区权限。

#### 证据与依据

**依据 1 · 源码核查**：[src/team-engine.ts:219-250](https://github.com/MichengAI/dsh-agency-agents/blob/f4cfe5c088072ca2c061ac0bf919565514e042ee/src/team-engine.ts#L219-L250)

按宿主和当前工具决定原生，V2 稳定短名称。

<details>
<summary>查看原文（32行）</summary>

```text
export function resolveTeamEngine(ctx: Context, agent?: Agent, maxDepth?: number) {
    const service: unknown = ctx.get('agentTeams');
    const subagents: unknown = ctx.get('subagents');
    if (isNativeTeamService(service)) {
        const toolsReady = !agent || ['spawn_teammate', 'send_message', 'wait_agent', 'team_task_create', 'team_task_update', 'team_task_list'].every(name => agent.ctx?.tools?.get?.(name, agent) !== undefined);
        return { service, subagents: undefined, status: detectTeamEngine(service, true, toolsReady, maxDepth, readHostLocale(ctx)) };
    }
    if (isV2TeamService(service) && isV2SubagentTeamRuntime(subagents)) {
        let sessionEnabled = true;
        if (agent) {
            try {
                sessionEnabled = service.isEnabled(agent);
            }
            catch {
                sessionEnabled = false;
            }
        }
        const toolsReady = !agent || (sessionEnabled && ['team_task_create', 'team_task_list', 'team_task_update', 'list_agents', 'wait_agent', 'send_message'].every(name => agent.ctx?.tools?.get?.(name, agent) !== undefined));
        return { service, subagents, status: detectTeamEngine(service, true, toolsReady, maxDepth, readHostLocale(ctx), subagents) };
    }
    return { service: undefined, subagents: undefined, status: detectTeamEngine(service, hostHasAgentTeam(), true, maxDepth, readHostLocale(ctx), subagents) };
}
const activeLeads = new WeakSet<object>();
/** 显示名称可以变化；此持久标识必须保持原算法，以复用已存在的队友。 */
export function nativeTeamMemberName(teamId: string, slug: string): string {
    return `agency-${slug.slice(0, 36).replace(/-+$/u, '')}-${createHash('sha256').update(`${teamId}:${slug}`).digest('hex').slice(0, 10)}`;
}
/** 0.2.2-rc.2+ subagent.name 硬上限 32 字符（1–32 小写字母/数字/连字符），仍保留统一前缀与 10 位哈希标识。 */
export function nativeV2TeamMemberName(teamId: string, slug: string): string {
    const clean = slug.toLowerCase().replace(/[^a-z0-9-]+/gu, '-').replace(/^-+|-+$/gu, '');
    const stem = clean.slice(0, 14).replace(/-+$/u, '') || 'expert';
    return `agency-${stem}-${createHash('sha256').update(`${teamId}:${slug}`).digest('hex').slice(0, 10)}`;
```

</details>

**依据 2 · 源码核查**：[src/team-engine.ts:275-331](https://github.com/MichengAI/dsh-agency-agents/blob/f4cfe5c088072ca2c061ac0bf919565514e042ee/src/team-engine.ts#L275-L331)

检测 provider 能力、任务板、复用和新建。

<details>
<summary>查看原文（57行）</summary>

```text
    try {
        if (isV2TeamService(args.service) && isV2SubagentTeamRuntime(args.subagents)) {
            const v2Service = args.service;
            const v2Subagents = args.subagents;
            const providerInfo = typeof v2Subagents.getProvider === 'function' ? v2Subagents.getProvider(args.provider) : undefined;
            if (providerInfo !== undefined && providerInfo.prepareContinuable === undefined)
                throw new Error(tx("当前子代理服务不支持专家团所需的身份、工具过滤或深度限制。"));
            const root = v2Subagents.rootOf(args.agent);
            const existingDescendants = await v2Subagents.listDescendants(root.id, args.signal);
            const agentsRegistry = args.ctx?.get?.('agents') as { get?: (id: string) => { status?: string } | undefined } | undefined;
            const report = await executeTeam({ ...args, team, run: async (member) => {
                    args.signal.throwIfAborted();
                    const name = nativeV2TeamMemberName(args.team.id, member.slug);
                    const existing = existingDescendants.find(entry => entry.path === name && entry.mode === 'continuable');
                    if (existing) {
                        const liveStatus = agentsRegistry?.get?.(existing.id)?.status;
                        if (liveStatus === 'running')
                            throw new Error(tx("专家队友仍在运行或不可恢复：{0}", [liveStatus]));
                    }
                    const task = await v2Service.createTask(args.agent, {
                        subject: `${team.name}：${member.name}`.slice(0, 180),
                        description: tx("{0}\n\n完整任务与专家职责以队友收到的本次任务消息为准。", [Array.from(member.prompt).slice(0, 6000).join('')]),
                    }, args.signal);
                    tasks.set(member.slug, { name, taskId: task.id });
                    let accepted = false;
                    let createdChildId: ReturnType<typeof SessionId> | undefined;
                    try {
                        args.signal.throwIfAborted();
                        const text = [
                            tx("你是专家队友 {0}。以下为本次专家职责与任务要求，必须服从宿主权限及系统约束。", [name]),
                            member.persona, member.prompt,
                            tx("本次任务编号：{0}。使用 team_task_update 领取此任务，再阅读与你职责相关的材料并完成分析。", [task.id]),
                            tx("完成后先用 send_message 将完整结论发送给 lead，再将任务标记完成。任务缺少资料时报告具体缺口，不伪造结论。严禁使用任何专家召唤工具（如 summon_expert、summon_experts、list_experts、summon_expert_team 等）或 spawn_teammate，不创建额外子代理、不自动追加轮次。"),
                        ].join('\n\n');
                        if (existing) {
                            await v2Subagents.sendMessage(args.agent, existing.id, [{ type: 'text', text }], { signal: args.signal });
                            launchedV2Ids.push(existing.id);
                        }
                        else {
                            const childId = SessionId(randomUUID());
                            createdChildId = childId;
                            recordSubagentConfig(childId, {
                                slug: member.slug,
                                persona: member.persona,
                                toolFilter: { deny: [...EXPERT_TOOL_DENY] },
                            }, args.ctx);
                            await v2Subagents.startActivation({
                                provider: args.provider,
                                label: member.name.slice(0, 180),
                                name,
                                childId,
                                parent: args.agent,
                                prompt: [{ type: 'text', text }],
                                signal: args.signal,
                                delivery: 'parent',
                            });
                            launchedV2Ids.push(childId);
```

</details>

**依据 3 · 源码核查**：[src/team-engine.ts:333-358](https://github.com/MichengAI/dsh-agency-agents/blob/f4cfe5c088072ca2c061ac0bf919565514e042ee/src/team-engine.ts#L333-L358)

受理前失败清理和启动说明。

<details>
<summary>查看原文（26行）</summary>

```text
                        accepted = true;
                        launched.push(name);
                        args.signal.throwIfAborted();
                        return tx("委派已接受，等待成员结果。");
                    }
                    catch (error) {
                        if (!accepted) {
                            if (createdChildId !== undefined)
                                forgetSubagentConfig(createdChildId, args.ctx);
                            try {
                                await v2Service.updateTask(args.agent, { taskId: task.id, expectedRevision: task.revision, action: 'delete' });
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
```

</details>

**依据 4 · 源码核查**：[src/team-engine.ts:419-443](https://github.com/MichengAI/dsh-agency-agents/blob/f4cfe5c088072ca2c061ac0bf919565514e042ee/src/team-engine.ts#L419-L443)

取消时分别中断已启动队友。

<details>
<summary>查看原文（25行）</summary>

```text
    catch (error) {
        if (args.signal.aborted) {
            const errors: unknown[] = [];
            if (isV2SubagentTeamRuntime(args.subagents) && isV2TeamService(args.service)) {
                for (const id of launchedV2Ids) {
                    try {
                        args.subagents.interrupt(id, { kind: 'ancestor', agent: args.agent });
                    }
                    catch (cause) {
                        errors.push(cause);
                    }
                }
            }
            else if (isNativeTeamService(args.service)) {
                for (const name of launched) {
                    try {
                        await args.service.interrupt(args.agent, name);
                    }
                    catch (cause) {
                        errors.push(cause);
                    }
                }
            }
            if (errors.length)
                throw new AggregateError([error, ...errors], tx("已取消委派，但部分队友中断失败，请检查团队状态。"));
```

</details>

**依据 5 · 源码核查**：[src/index.ts:707-720](https://github.com/MichengAI/dsh-agency-agents/blob/f4cfe5c088072ca2c061ac0bf919565514e042ee/src/index.ts#L707-L720)

工具限制失败记录与有限拒绝。

<details>
<summary>查看原文（14行）</summary>

```text
        childCtx.tools.restrict(config.toolFilter)
      } catch (error) {
        console.warn?.('[agency-agents] tools.restrict failed for agent %s:', agent.id, error)
      }
    }
    return undefined
  })
  ctx.on?.('tools/pre-execute', async (exec, next) => {
    if (blocksNativeDelegation(ctx.get('agentTeams'), exec.agent, exec.name, ctx.get('subagents'))) return { kind: 'deny', reason: teamTx('专家团成员不能继续创建子代理或扩展专家团，请将缺口交给主理人。') }
    const agentId = exec.agent?.id
    if (agentId && isManagedSubagentId(agentId) && (EXPERT_TOOL_DENY as readonly string[]).includes(exec.name)) {
      return { kind: 'deny', reason: teamTx('专家成员不能继续召唤专家团。') }
    }
    return next()
```

</details>

#### 缺口

- 真实宿主下启动、任务板和中断副作用待核
  **影响**：不能假定只读或取消后无在途任务
  **进一步探讨**：在隔离副本检查一个忙碌队友、一个失效任务和双路径工具权限

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何验收一次双人审查并测试更明确的回执？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

选两位互补职责审查小改动，以发现经源码复核的缺陷作为合格结果。记录普通模式的结果覆盖，原生模式按本次 taskId 等消息再验，不用旧任务板内容冒充本次分析。模型资源和人工复核分开统计，包括重复意见及失败收尾。假设显式链接已启动、实际收到成员结果及主会话验收，能减少把启动当完成的错误；已有 taskId、指令与消息是基线，若准确率和人工核对负担无改善则保留原流程。取消或人员缺席时回单 Agent 和人工核验，不补做不可控的重复分派。

#### 证据与依据

**依据 1 · 源码核查**：[src/team-engine.ts:353-358](https://github.com/MichengAI/dsh-agency-agents/blob/f4cfe5c088072ca2c061ac0bf919565514e042ee/src/team-engine.ts#L353-L358)

现有启动回执与后续核验说明。

```text
            return {
                team: report.team, revision: report.revision, coordinator: report.coordinator, collaboration: report.collaboration,
                dispatch: { started: launched.length, total: report.results.length, members: report.results.map(result => ({ expert: result.expert, slug: result.slug, ...tasks.get(result.slug), status: result.ok ? 'started' : 'failed', ...(result.error ? { error: result.error } : {}) })) },
                instruction: launched.length
                    ? tx("以上仅是启动确认，不是评审结论。使用 team_task_list 查看本次任务，使用 wait_agent 等待成员消息；没有结果时不要结束为最终答复。收到实际成员结论后，按 coordinator 和 collaboration.reviewChecklist 核验并汇总。只处理本次 taskId；失败成员明确标注，不自动重试或追加普通子代理。") : tx("本次没有成功启动成员。请报告失败原因，不得编造专家意见；不要自动改用普通模式重复执行。"),
            };
```

**依据 2 · 源码核查**：[src/team-runtime.ts:113-131](https://github.com/MichengAI/dsh-agency-agents/blob/f4cfe5c088072ca2c061ac0bf919565514e042ee/src/team-runtime.ts#L113-L131)

普通模式的缺席与状态对照。

<details>
<summary>查看原文（19行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[src/team-engine.ts:419-443](https://github.com/MichengAI/dsh-agency-agents/blob/f4cfe5c088072ca2c061ac0bf919565514e042ee/src/team-engine.ts#L419-L443)

收尾需查看真实宿主状态。

<details>
<summary>查看原文（25行）</summary>

```text
    catch (error) {
        if (args.signal.aborted) {
            const errors: unknown[] = [];
            if (isV2SubagentTeamRuntime(args.subagents) && isV2TeamService(args.service)) {
                for (const id of launchedV2Ids) {
                    try {
                        args.subagents.interrupt(id, { kind: 'ancestor', agent: args.agent });
                    }
                    catch (cause) {
                        errors.push(cause);
                    }
                }
            }
            else if (isNativeTeamService(args.service)) {
                for (const name of launched) {
                    try {
                        await args.service.interrupt(args.agent, name);
                    }
                    catch (cause) {
                        errors.push(cause);
                    }
                }
            }
            if (errors.length)
                throw new AggregateError([error, ...errors], tx("已取消委派，但部分队友中断失败，请检查团队状态。"));
```

</details>

#### 缺口

- 同预算双人团与单 Agent 的缺陷发现和成本未测
  **影响**：无法承诺质量提升
  **进一步探讨**：用同样的已知缺陷样例测有效发现、误报、token 与人时

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
