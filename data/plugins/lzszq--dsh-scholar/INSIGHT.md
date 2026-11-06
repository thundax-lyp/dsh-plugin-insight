# DSH Scholar

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[086b19a](https://github.com/lzszq/dsh-scholar/tree/086b19a2fbd7824dd71dde7ea2043f22888606e0)

<!-- BEGIN META -->
[![GitHub ★ 57](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=57&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lzszq/dsh-scholar)
<!-- END META -->

> **功能**：计算研究工作台，将项目对话、资料、受控实验、证据关系与 TeX 写作放在持久项目中。

> **亮点**：将批准责任、不可变输入、租约作业与证据验收串成持久项目；这是工程与工作组织增量，非自动科学发现的验证。见 [Q02](#research-q02)至[Q04](#research-q04)。

> **主要限制**：full-auto只执行限定fixture的survey_run，来源已验不代表科学正确；部署身份、远程隔离和人类复核负担仍决定价值。见 [Q02](#research-q02)至[Q04](#research-q04)。

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
  - [Q01 · 研究者怎样从 DSH 进入一个持久科研项目？](#detail-section-11)
  - [Q02 · Human Gate 与 full-auto 是否有执行约束，谁能批准？](#detail-section-12)
  - [Q03 · 正式作业如何从合同与输入快照成为可接受证据，失败如何处理？](#detail-section-13)
  - [Q04 · 相对实验脚本加笔记，新增价值及维护负担是什么？](#detail-section-14)
  - [Q05 · 何种研究可试用，下一步生产方向如何证伪？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：监督式计算研究中管理反复变化的假设、代码数据、作业和论文依据。见 [Q01](#research-q01)。

聊天、脚本作业、实验跟踪、证据笔记和TeX分开维护；未测与既有完整科研平台的效果差异。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 角色工具ACL | 约束阶段Agent | 依赖宿主执行前钩子 |
| Human Gate | 人批准研究决策 | BFF身份/成员/CSRF及service凭据 |
| full-auto | 固定fixture受限推进 | 自动动作仅survey_run，非无人论文 |
| 合同/Protocol作业 | 绑定输入和执行环境 | 正式作业要求冻结批准 |
| Runner完成 | 回传manifest/metrics | exit0不自动成功 |
| Evidence接受 | 重验来源/作业/合同 | 不证明科学正确 |
| 研究工作台 | 查看项目/运行/TeX等 | 非所有路径已独立验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Linux/Node24/pnpm11.20 | 本地工作台必需 | 构建与运行 | 不按作者支持环境使用 |
| Kernel/BFF及各类身份凭据 | 必需 | 持久状态与Human批准 | 内部写接口拒绝；浏览器token须保留，no-token仅隔离开发例外 |
| Runner Profile/Target | 作业必需 | 执行环境和能力 | 未登记/离线/不匹配拒绝 |
| 固定Docker镜像 | 正式作业必需 | 隔离与重建环境 | 禁止退宿主子进程 |
| 模型/OCR/检索/SSH/GPU | 特定路径 | 研究扩展与计算 | 另有费用及部署验收 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 研究者备份并登记fixture/Runner | 身份/镜像准备通过 |
| 定义 | Agent提合同/Protocol，人批准 | 精确revision且同项目 |
| 执行 | Kernel admission后Runner领租约 | CAS输入绑定，metrics合格 |
| 核验 | 校manifest与Evidence关系 | 来源verified后再accept |
| 判断 | 人审结论、再决定方向/Release | 不以日志或full-auto替代责任 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 服务/镜像/存储未知 | 构建部署、迁入合同数据 | 需容器维护能力 |
| 持续使用 | 模型/OCR/算力未知 | Gate、证据和版本维护 | 未测总项目收益 |
| 失败恢复 | 重跑/保存快照未知 | 查租约/manifest、恢复备份 | 远程故障未全验 |
| 退出 | 持久项目仍占空间 | 保留原数据、CAS、TeX再卸载 | 不把移除UI当删/备份项目 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 批准治理 | BFF身份到事务Gate | 所有部署安全 |
| 正式运行 | 合同/Protocol及租约绑定 | 远程SSH/GPU实效 |
| 证据追溯 | manifest/作业/合同重验 | 科学结论有效性 |
| 工作组织 | 责任与材料同项目 | 人工负担和总成本改善 |

> **思考**：full-auto只执行限定fixture的survey_run，来源已验不代表科学正确；部署身份、远程隔离和人类复核负担仍决定价值。见 [Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将批准责任、不可变输入、租约作业与证据验收串成持久项目；这是工程与工作组织增量，非自动科学发现的验证。见 [Q02](#research-q02)至[Q04](#research-q04)。

内部服务凭据与浏览器身份分离、CAS输入和租约完成、Evidence再验可借鉴；仍须把可追溯与科学正确分开。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

full-auto只执行限定fixture的survey_run，来源已验不代表科学正确；部署身份、远程隔离和人类复核负担仍决定价值。见 [Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

保留浏览器token，在监督且隔离的本地环境用已知fixture试gate-only；先故意未批/缺metrics核拒绝与终态，异常备份Kernel和原数据回独立脚本。--no-token仅属受限开发例外。见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码已检查治理和正式作业主链；计算效果、部署验收和新设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/dsh-research-ui/src/standalone/server.ts、packages/research-kernel/src/full-auto.ts、packages/research-kernel/src/kernel.ts、packages/research-kernel/src/server.ts、src/plugin/acl.ts、src/plugin/index.ts、workers/research-orchestrator/src/engine.ts、workers/runner-gateway/src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：深查DSH工具ACL、人类Gate BFF/内部门禁、full-auto allowlist、正式提交/Runner物化/完成与Evidence接受。未全审所有Kernel/连接器/OCR/写作、Docker参数及SSH/GPU身份；未运行目标。
- 下一步：隔离local-Docker已知fixture做未批/错profile/缺metrics/重启恢复对照，再核远程链和科研结果；Gate差异视图另测，未执行。

**分析版本**

- **仓库**：[lzszq/dsh-scholar](https://github.com/lzszq/dsh-scholar)
- **版本号**：0.1.0（[固定提交 086b19a](https://github.com/lzszq/dsh-scholar/tree/086b19a2fbd7824dd71dde7ea2043f22888606e0)）
- **版本日期**：2026-09-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

以版本差异视图减少Human Gate重复阅读，同时不漏掉代码/数据/指标变化；现有UI已等效或误批增加就推翻。见 [Q05](#research-q05)。

隔离local-Docker已知fixture做未批/错profile/缺metrics/重启恢复对照，再核远程链和科研结果；Gate差异视图另测，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 39 | 10199 | — | — | 305179 |
| .js | source | 2 | 197 | 115 | 69 | — |
| .mjs | source | 6 | 576 | 475 | 52 | — |
| .ts | source | 244 | 96050 | 78908 | 12405 | — |
| .ts | test | 162 | 50906 | 44910 | 3115 | — |
| .tsx | source | 1 | 1271 | 1220 | 9 | — |
| .mjs | test | 1 | 183 | 171 | 2 | — |
| .mjs | example | 1 | 243 | 214 | 24 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/lzszq/dsh-scholar/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：研究治理是否沿真实链路约束Agent，并把计算运行变成可追溯证据？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 研究者怎样从 DSH 进入一个持久科研项目？

**研究主题**：场景与需求、功能与机制

#### 完整回答

它面向需要反复改代码、跑计算、整理证据和写论文的计算研究者，目的是让研究决策与实验材料留在同一可恢复项目。替代办法是聊天记录、脚本/作业系统、实验跟踪和TeX分开维护；合格结果不是多轮聊天，而是能查清某个结论所用的输入、运行和批准依据。产品自己排除临床、人体和湿实验，本研究也不把其治理替代科学判断。

根包确有DSH bundle与Web客户端，同时包含独立工作台、Kernel和Runner。插件把Kernel client、角色、项目scope与stage subagents交给工具注册，并接入tools/pre-execute。常规未分配角色只获受限入口，子Agent按角色使用对应工具；项目scope还检查显式project_id和job所属项目。Kernel而非聊天文本持久保存状态。面板只是状态和交互入口，不能据工具名直接当已执行科研成果。

本次沿正式作业、Gate和Evidence链深入核查，未完整审查所有文献连接器、OCR/图像输入、写作和拓扑功能；这些保留项目声明及范围边界，不合并成“全自动科研已验证”。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin/index.ts:644-685](https://github.com/lzszq/dsh-scholar/blob/086b19a2fbd7824dd71dde7ea2043f22888606e0/src/plugin/index.ts#L644-L685)

工具实际注入及执行前ACL。

<details>
<summary>查看原文（42行）</summary>

```text
  registerResearchTools({ tools: ctx.tools }, {
    client,
    cache,
    ctx: ctx as never,
    roles,
    projectScopes,
    modelFor: role => modelForRole(effectiveConfig, role),
    stageSubagents,
    defaultMode: effectiveConfig.defaultMode ?? 'gate-only',
    operatorPrincipal: sidecar.operatorPrincipal,
  })

  // Role-based ACL: deny research tools outside the caller role's surface.
  const researchToolSet = new Set<string>(RESEARCH_TOOLS)
  const humanConfirmationToolSet = new Set<string>(RESEARCH_HUMAN_CONFIRMATION_TOOLS)
  ctx.on('tools/pre-execute', async (exec, next) => {
    const agentId = exec.agent?.id
    if (agentId !== undefined && researchToolSet.has(exec.name)) {
      const role = roles.get(agentId)
      if (!roles.allows(role, exec.name)) {
        return { kind: 'deny', reason: `research tool ${exec.name} is outside the ${role} role's tool surface (least privilege, design §4.1)` }
      }
      if (exec.name === 'research_panel') {
        return { kind: 'ask', reason: 'Start the stage-aware subagent panel for the current ready research action?' }
      }
      if (humanConfirmationToolSet.has(exec.name)) {
        return {
          kind: 'ask',
          reason: exec.name === 'research_assurance_run'
            ? 'Run the revision/hash-bound writing assurance for the project linked to the current DSH session?'
            : exec.name === 'research_knowledge_deactivate'
              ? 'Deactivate this Knowledge activation for the project linked to the current DSH session?'
              : 'Activate this evaluated local Knowledge package for the project linked to the current DSH session?',
        }
      }
      const projectScope = projectScopes.get(agentId)
      if (projectScope !== undefined) {
        const denial = await stageProjectScopeDenial(projectScope, exec.arguments, async jobId => (await client.getJob(jobId)).project_id)
        if (denial !== undefined) return { kind: 'deny', reason: denial }
      }
    }
    return next()
```

</details>

**依据 2 · 源码核查**：[src/plugin/acl.ts:103-127](https://github.com/lzszq/dsh-scholar/blob/086b19a2fbd7824dd71dde7ea2043f22888606e0/src/plugin/acl.ts#L103-L127)

角色工具表与默认none。

<details>
<summary>查看原文（25行）</summary>

```text
  'idea-panel': ['idea_create', 'idea_compare', 'novelty_audit', 'literature_search', 'research_status'],
  architect: ['experiment_register', 'research_status', 'research_methodology_status', 'research_protocol_record', 'experiment_status'],
  engineer: ['workspace_snapshot', 'patch_apply', 'baseline_prepare', 'baseline_verify', 'test_run', 'research_status', 'experiment_status'],
  operator: ['experiment_submit', 'experiment_status', 'experiment_cancel', 'research_status'],
  statistician: ['evidence_note_create', 'claim_create', 'claim_verify_request', 'analysis_request', 'research_status', 'experiment_status'],
  writer: ['manuscript_build', 'research_status', 'research_methodology_status', 'research_writing_review_record'],
  reviewer: ['manuscript_review', 'claim_verify_request', 'research_status', 'research_methodology_status', 'research_writing_review_record'],
  auditor: ['claim_verify_request', 'manuscript_review', 'research_status', 'research_methodology_status', 'research_writing_review_record'],
}

/** v2 §3.1: unknown/unregistered agents default to `none` (deny), NOT director. */
export const DEFAULT_ROLE: ResearchRole = 'none'

/** Fail-closed project fence for stage-subagent tool calls. The child may
 * name its bound project explicitly, but may never use an arbitrary project
 * or job id to escape that scope. */
export async function stageProjectScopeDenial(
  projectScope: string,
  args: unknown,
  projectForJob: (jobId: string) => Promise<string>,
): Promise<string | undefined> {
  const record = args !== null && typeof args === 'object' && !Array.isArray(args)
    ? args as Record<string, unknown>
    : {}
  if (typeof record.project_id === 'string' && record.project_id !== '' && record.project_id !== projectScope) {
```

</details>

**依据 3 · 源码核查**：[package.json:1-32](https://github.com/lzszq/dsh-scholar/blob/086b19a2fbd7824dd71dde7ea2043f22888606e0/package.json#L1-L32)

根包为插件加客户端。

<details>
<summary>查看原文（32行）</summary>

```text
{
  "name": "@dsh-scholar/research-plugin",
  "version": "0.1.0",
  "description": "DSH Research OS — a fully automated scientific research plugin for DSH (DeepSeek Harness): survey, idea, experiment contract, durable runner jobs, claim-evidence ledger, manuscript and release bundle.",
  "packageManager": "pnpm@11.20.0",
  "type": "module",
  "license": "BSD-3-Clause",
  "private": true,
  "files": [
    "lib",
    "cordis.patch.yml",
    "skills",
    "README.md"
  ],
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-settings-plugins",
        "@deepseek-ai/dsh-client-ui-settings"
      ],
      "platform": "web"
    }
  },
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Human Gate 与 full-auto 是否有执行约束，谁能批准？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

在检查的HTTP路径中，Human Gate并非Agent自行写一句approve。独立BFF只在options.token非null时验证浏览器token；--no-token会跳过这一Bearer检查，README仅允许隔离、监督、回环开发实例使用。保留token的配置再检查CSRF/Origin、持久principal，再获取Gate所属项目、检查成员和pi/operator角色；浏览器只交业务字段，BFF构造身份并访问内部决策路由。Kernel内部接口还验证独立service token，不能只伪造x-service-principal。决策事务用pending条件更新防并发重复，合同批准在同事务内冻结。这些是源码可见授权接线，不等于已完成部署安全验收。

full-auto是受限fixture自动化：必须已确认Brief、精确项目revision、pending且同项目Gate、登记Fixture/Profile/Target及镜像匹配；allowlist只有scope/idea/contract/budget，Release保留Human。Orchestrator只有ready且required_by=agent的survey_run会产生执行计划，其他动作park。因此包description的fully automated不能理解为任意问题到实验论文无人执行。

这些保证依赖正确部署BFF、Kernel服务凭据和Runner身份；若直接持有内部服务凭据，可信边界已经改变。检查不是全系统渗透或所有内部方法审计，不能把一条拒绝链推广为绝对不可绕过。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-research-ui/src/standalone/server.ts:1328-1416](https://github.com/lzszq/dsh-scholar/blob/086b19a2fbd7824dd71dde7ea2043f22888606e0/packages/dsh-research-ui/src/standalone/server.ts#L1328-L1416)

浏览器认证、CSRF、项目成员/角色到内部决策。

<details>
<summary>查看原文（89行）</summary>

```text
      // GOV-01: browser Gate decisions use a dedicated Human BFF route.
      // The browser submits business fields only; this adapter resolves the
      // Gate's project, checks fresh membership/role, injects the durable
      // Principal + request id, then calls the service-only Kernel bridge.
      if (method === 'POST' && humanGateMatch !== null) {
        const requestId = `req_${randomBytes(12).toString('hex')}`
        if (options.token !== null) {
          const auth = req.headers.authorization
          const match = typeof auth === 'string' ? /^Bearer\s+(.+)$/i.exec(auth) : null
          if (!tokenMatches(match?.[1], options.token)) {
            sendJson(res, 401, humanGateBffError(requestId, 'unauthorized', 'unauthorized'))
            return
          }
        }
        if (!verifyCsrfToken(csrfHeader(req), csrfToken)) {
          sendJson(res, 403, humanGateBffError(requestId, 'csrf_rejected', 'missing or invalid csrf token'))
          return
        }
        if (!isAllowedOrigin(req.headers.origin, req.headers.host)) {
          sendJson(res, 403, humanGateBffError(requestId, 'csrf_rejected', 'cross-origin write rejected'))
          return
        }
        if (options.principal === null) {
          sendJson(res, 401, humanGateBffError(requestId, 'principal_required', 'principal required'))
          return
        }
        let gateId = ''
        try {
          gateId = decodeURIComponent(humanGateMatch[1] ?? '')
        } catch {
          sendJson(res, 400, humanGateBffError(requestId, 'invalid_gate_id', 'invalid gate id'))
          return
        }
        if (gateId === '' || gateId.includes('/')) {
          sendJson(res, 400, humanGateBffError(requestId, 'invalid_gate_id', 'invalid gate id'))
          return
        }
        const gateProjectId = await fetch(`${endpoint}/v1/gates/${encodeURIComponent(gateId)}`, {
          headers: { accept: 'application/json', ...upstreamAuthHeaders },
        }).then(async response => {
          if (!response.ok) return null
          const gate = await response.json() as { project_id?: unknown }
          return typeof gate.project_id === 'string' && gate.project_id !== '' ? gate.project_id : null
        }).catch(() => null)
        if (gateProjectId === null || !(await isProjectMember(gateProjectId))) {
          sendJson(res, 404, humanGateBffError(requestId, 'project_not_found', 'project not found or access denied'))
          return
        }
        const role = await projectRole(gateProjectId)
        if (role !== 'pi' && role !== 'operator') {
          sendJson(res, 403, humanGateBffError(requestId, 'role_forbidden', 'role forbidden'))
          return
        }
        const read = await readBody(req)
        if (read.tooLarge) {
          sendJson(res, 413, humanGateBffError(requestId, 'payload_too_large', 'payload too large'))
          return
        }
        let parsed: unknown
        try {
          parsed = JSON.parse(read.body)
        } catch {
          sendJson(res, 400, humanGateBffError(requestId, 'invalid_json', 'bad request'))
          return
        }
        const opSession = operatorSession(options.dataDir, options.principal)
        const decisionBody = humanGateDecisionBody(parsed, opSession)
        if (decisionBody === null) {
          sendJson(res, 422, humanGateBffError(requestId, 'validation_error', 'invalid gate decision'))
          return
        }
        let upstream: Response
        try {
          upstream = await fetch(`${endpoint}/internal/human-gates/${encodeURIComponent(gateId)}/decisions`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              accept: 'application/json',
              ...upstreamAuthHeaders,
              'x-service-principal': 'standalone-human-bff',
              'x-principal-id': opSession.principal_id,
              'x-principal-role': role,
              'x-principal-session': opSession.session_id,
              'x-request-id': requestId,
            },
            body: JSON.stringify(decisionBody),
          })
        } catch {
          sendJson(res, 502, humanGateBffError(requestId, 'kernel_unreachable', 'research kernel unavailable'))
```

</details>

**依据 2 · 源码核查**：[packages/research-kernel/src/server.ts:1287-1301](https://github.com/lzszq/dsh-scholar/blob/086b19a2fbd7824dd71dde7ea2043f22888606e0/packages/research-kernel/src/server.ts#L1287-L1301)

内部服务token门禁。

<details>
<summary>查看原文（15行）</summary>

```text
  // §4 P0 (API-01/EVID-01): internal service routes require the configured
  // service token via `x-service-token` — the loopback bearer (Authorization)
  // and any self-reported x-service-principal do NOT unlock these routes.
  // A missing/wrong/misplaced credential is 403 service_token_required.
  if (version === 'internal' || isServiceRoute(method, canonicalPath)) {
    const expected = kernel.serviceToken?.trim()
    const provided = req.headers['x-service-token']
    if (expected === undefined || expected === '' || typeof provided !== 'string' || !serviceTokenEquals(provided, expected)) {
      send(res, 403, {
        error: errorEnvelope('service_token_required',
          'internal route requires a configured x-service-token service identity; browser bearer credentials are not accepted'),
      })
      return
    }
  }
```

</details>

**依据 3 · 源码核查**：[packages/research-kernel/src/server.ts:1343-1371](https://github.com/lzszq/dsh-scholar/blob/086b19a2fbd7824dd71dde7ea2043f22888606e0/packages/research-kernel/src/server.ts#L1343-L1371)

独立Human服务入口。

<details>
<summary>查看原文（29行）</summary>

```text
  if (version === 'internal' && resource === 'human-gates' && id !== undefined
    && sub === 'decisions' && method === 'POST') {
    if (kernel.serviceToken === undefined) {
      send(res, 403, { error: errorEnvelope('service_token_required', 'Human Gate decisions require a configured service token') })
      return
    }
    if (req.headers['x-service-principal'] !== 'standalone-human-bff') {
      send(res, 403, { error: errorEnvelope('service_identity_required', 'Human Gate decisions require x-service-principal: standalone-human-bff') })
      return
    }
    void readJson(req).then((body) => {
      try {
        const input = decisionSchema.parse(body)
        const forwardedSession = req.headers['x-principal-session']
        if ((input.session_id === undefined || input.session_id === null)
          && typeof forwardedSession === 'string' && forwardedSession !== '') {
          input.session_id = forwardedSession
        }
        ok(res, kernel.decideGate({
          gate_id: id,
          actor: input.actor ?? input.principal.principal_id,
          ...input,
        }))
      } catch (error) {
        fail(res, error)
      }
    }).catch((error: unknown) => fail(res, error))
    return
  }
```

</details>

**依据 4 · 源码核查**：[packages/research-kernel/src/kernel.ts:2707-2757](https://github.com/lzszq/dsh-scholar/blob/086b19a2fbd7824dd71dde7ea2043f22888606e0/packages/research-kernel/src/kernel.ts#L2707-L2757)

决策事务与pending CAS。

<details>
<summary>查看原文（51行）</summary>

```text
  decideGate(input: GateDecisionInput): { gate: Gate; decision: Decision; project: ResearchProject } {
    return withTransaction(this.db, () => this.decideGateInTransaction(input))
  }

  private decideGateInTransaction(input: GateDecisionInput): { gate: Gate; decision: Decision; project: ResearchProject } {
    const gate = this.getGate(input.gate_id)
    if (gate.status !== 'pending') {
      throw new KernelError(409, 'gate_already_decided', `gate ${input.gate_id} already ${gate.status}`)
    }
    const budgetResumeTo = input.decision === 'approved' && gate.type === 'budget'
      ? this.budgetBlockResumeTo(gate)
      : null
      const decision: Decision = {
        decision_id: randomId('dec'),
        gate_id: gate.gate_id,
        project_id: gate.project_id,
        gate_type: gate.type,
        actor: input.actor,
        // v2 §6.4: authenticated principal record; missing principal is only
        // tolerated for legacy rows (actor == 'legacy_unverified').
        principal: input.principal === undefined && input.actor === 'legacy_unverified'
          ? undefined
          : {
              principal_id: input.principal?.principal_id ?? input.actor,
              tenant_id: input.principal?.tenant_id ?? '',
              auth_method: input.principal?.auth_method ?? 'unverified',
              session_id: input.principal?.session_id ?? input.session_id ?? null,
            },
        decision: input.decision,
        reason: input.reason ?? '',
        diff: input.diff ?? '',
        session_id: input.session_id ?? null,
        event_id: input.event_id ?? null,
        decided_at: nowIso(),
      }
      this.db.prepare(
        'INSERT INTO decisions (decision_id, gate_id, project_id, gate_type, actor, decision, reason, diff, session_id, event_id, decided_at, principal_id, principal_tenant_id, principal_auth_method, principal_session_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ).run(
        decision.decision_id, decision.gate_id, decision.project_id, decision.gate_type, decision.actor,
        decision.decision, decision.reason, decision.diff, decision.session_id, decision.event_id, decision.decided_at,
        decision.principal?.principal_id ?? null,
        decision.principal?.tenant_id ?? null,
        decision.principal?.auth_method ?? null,
        decision.principal?.session_id ?? null,
      )
      const gateUpdate = this.db.prepare('UPDATE gates SET status = ?, decided_at = ? WHERE gate_id = ? AND status = ?')
        .run(input.decision, decision.decided_at, gate.gate_id, 'pending')
      if (Number(gateUpdate.changes) !== 1) {
        // Lost the CAS race to a concurrent decision (design §11.2).
        throw new KernelError(409, 'gate_already_decided', `gate ${input.gate_id} was decided concurrently (CAS race)`)
      }
```

</details>

**依据 5 · 源码核查**：[packages/research-kernel/src/full-auto.ts:206-225](https://github.com/lzszq/dsh-scholar/blob/086b19a2fbd7824dd71dde7ea2043f22888606e0/packages/research-kernel/src/full-auto.ts#L206-L225)

fixture、revision及Gate白名单约束。

<details>
<summary>查看原文（20行）</summary>

```text
  const { project, gate, fixture, runner_profile: runnerProfile, runner_target: runnerTarget } = input
  if (project.mode !== 'full-auto' || fixture === null || project.execution.fixture_id !== fixture.fixture_id) {
    return failure('full_auto_fixture_required', 'automatic Gate decisions require a persisted full-auto project bound to a registered FixtureProfile')
  }
  if (project.brief_status !== 'confirmed') {
    return failure('full_auto_fixture_required', 'automatic Gate decisions cannot confirm or bypass a collecting Research Brief')
  }
  if (project.revision !== input.expected_project_revision) {
    return failure('revision_conflict', `expected project revision ${input.expected_project_revision}, got ${project.revision}`)
  }
  if (gate.project_id !== project.project_id || gate.status !== 'pending') {
    return failure('full_auto_gate_target_invalid', 'automatic Gate decision requires a pending Gate of the exact project')
  }
  if (!(FULL_AUTO_GATE_ALLOWLIST as readonly string[]).includes(gate.type)) {
    return failure('full_auto_gate_not_allowed', `Gate type ${gate.type} is not in the fixture full-auto allowlist; Release always stays Human`)
  }
  if (runnerProfile === null || project.execution.runner_profile_id !== runnerProfile.profile_id
    || runnerTarget === null || project.execution.runner_target_id !== runnerTarget.target_id
    || runnerProfile.image !== fixture.image || input.runner_failures.length > 0) {
    return failure('full_auto_runner_not_ready', `fixture runner is not exactly ready: ${input.runner_failures.join(',') || 'profile/target/image binding mismatch'}`)
```

</details>

**依据 6 · 源码核查**：[workers/research-orchestrator/src/engine.ts:174-191](https://github.com/lzszq/dsh-scholar/blob/086b19a2fbd7824dd71dde7ea2043f22888606e0/workers/research-orchestrator/src/engine.ts#L174-L191)

唯一survey_run动作执行计划。

<details>
<summary>查看原文（18行）</summary>

```text
function actionPlan(project: ResearchProjectValue, action: NextActionValue): FullAutoPlan {
  if (action.state !== 'ready' || action.required !== true || action.required_by !== 'agent') {
    return parkForAction(project, action)
  }
  if (action.code !== 'survey_run' || !FULL_AUTO_ACTION_EXECUTOR_ALLOWLIST.has(action.code)) {
    return parkForAction(project, action)
  }
  const revision = action.revision ?? project.revision
  return {
    kind: 'action-execute',
    type: 'full-auto-action:survey_run',
    idempotency_key: `full-auto-action:survey_run:${encodeURIComponent(action.id)}:r${revision}`,
    action_id: action.id,
    action_code: 'survey_run',
    action_revision: revision,
    expected_project_revision: project.revision,
  }
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 正式作业如何从合同与输入快照成为可接受证据，失败如何处理？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

submitJob先按项目+idempotency_key找已有作业，要求注册Runner Profile/Target并检查离线、未认证心跳、能力不符、禁用/排空。baseline/pilot/formal/reproduce/TeX等安全作业必须容器profile，正式计算类还要求同项目、Human Gate冻结的合同；formal或confirmatory要求精确冻结Protocol pin，代码和不可变数据绑定后才进方法论admission。它改变“聊天说跑过”到正式作业的门槛，但本次未逐个审计全部admission规则。

Runner从Kernel领取的run_id和lease_generation/token开始，不自造另一套运行身份；从CAS取绑定代码快照并在临时目录物化，失败就不执行。完成后汇集manifest和metrics，安全作业即使进程exit0，缺/坏metrics也强制failed；完成请求携lease字段，避免把旧租约输出当新结果。核查覆盖了提交和完成主链，Docker/SSH实际隔离和断线恢复仍未运行。

Evidence接受还有第二层：须已verified、属同项目；run_ids必须对应成功作业和manifest，重新校验manifest及批准合同。因此普通stdout/终端输出不自动等于accepted Evidence。然而来源签名、正确文件和合格metrics仅证明可追溯性及契约满足，不能证明实验设计无偏、论文结论成立或独立重复成功；科学判断仍要由研究者承担。

#### 证据与依据

**依据 1 · 源码核查**：[packages/research-kernel/src/kernel.ts:6434-6497](https://github.com/lzszq/dsh-scholar/blob/086b19a2fbd7824dd71dde7ea2043f22888606e0/packages/research-kernel/src/kernel.ts#L6434-L6497)

幂等、注册profile和执行准备拒绝。

<details>
<summary>查看原文（64行）</summary>

```text
    created_by_principal_id?: string | null
  }): JobSpecBound {
    const project = this.getProject(input.project_id)
    // reconstruction-contracts.md §5 / security-baseline.md §1: full-auto is
    // fixture-only. A full-auto project must stay bound to its REGISTERED
    // FixtureProfile and every job input must stay INSIDE the profile:
    // pinned image digest, data artifact content hashes and (when the
    // profile pins one) the code archive hash. Referencing anything outside
    // the profile is 422 — never queued.
    const fixtureProfile = project.mode === 'full-auto' ? getFixtureProfile(project.execution.fixture_id ?? '') : null
    if (project.mode === 'full-auto' && fixtureProfile === null) {
      throw new KernelError(422, 'fixture_required',
        `full-auto project ${project.project_id} is not bound to a REGISTERED FixtureProfile (reconstruction-contracts.md §5)`)
    }
    // v2 §3.4: idempotency is project-scoped — the same key in two projects
    // yields two independent jobs.
    const existing = this.db.prepare('SELECT * FROM jobs WHERE project_id = ? AND idempotency_key = ?')
      .get(input.project_id, input.idempotency_key) as JobRow | undefined
    if (existing !== undefined) return jobFromRow(existing, this.db, this.leaseTokens.get(existing.job_id) ?? null)
    // v2 §3.2 / §12.3: formal-class jobs require a container runner profile;
    // isolated-subprocess is rejected at submission time (kernel layer).
    // domain-model.md §2/§9.1: Job 只引用已登记的 opaque profile id ——
    // 显式 runner_profile_id（job 级 > project 级）优先；未配置/null 或未知 id
    // → 422（fail closed，零落库）。解析出的
    // profile 的 config_hash 与 image digest 一起固定进 Job payload，runner
    // 按注册表复算校验。
    const SECURE_KINDS: readonly string[] = ['baseline', 'pilot', 'formal', 'reproduce', 'latex-compile']
    // job override > project default; both are registered opaque ids.
    const profileRef = input.runner_profile_id ?? project.execution.runner_profile_id
    if (profileRef === null) {
      throw new KernelError(422, 'runner_profile_required',
        `project ${project.project_id} has no configured RunnerProfile; select one in Settings or provide an explicit registered runner_profile_id`)
    }
    const resolvedProfileId = profileRef === null ? null : resolveRunnerProfileId(profileRef)
    const runnerProfile = resolvedProfileId !== null ? getRunnerProfile(resolvedProfileId) : null
    if (runnerProfile === null) {
      throw new KernelError(422, 'runner_profile_unknown',
        `runner profile '${profileRef}' is not a registered opaque profile id (domain-model.md §9.1); jobs reference only registered RunnerProfile ids, never docker flags/endpoints`)
    }
    const targetRef = input.runner_target_id ?? project.execution.runner_target_id
    const runnerTarget = this.listRunnerTargets().find(target => target.target_id === targetRef)
    if (runnerTarget === undefined) {
      throw new KernelError(422, 'runner_target_unknown', `runner target '${targetRef}' is not registered`)
    }
    const runnerAssessment = assessRunnerEnvironment(runnerProfile, runnerTarget, ref => this.secretRefAvailable(ref))
    if (runnerAssessment.hardFailures.includes('target_offline')) {
      throw new KernelError(409, 'runner_target_offline', `runner target ${runnerTarget.target_id} is offline`)
    }
    if (runnerAssessment.hardFailures.includes('target_unprobed')) {
      throw new KernelError(409, 'runner_target_unprobed', `remote runner target ${runnerTarget.target_id} has no fresh authenticated heartbeat`)
    }
    if (runnerAssessment.hardFailures.includes('target_capability_mismatch')) {
      throw new KernelError(422, 'runner_target_capability_mismatch', `runner target ${runnerTarget.target_id} cannot satisfy its configured compute mode`)
    }
    if (!runnerTarget.enabled || runnerTarget.draining) {
      throw new KernelError(409, runnerTarget.draining ? 'runner_target_draining' : 'runner_target_disabled',
        `runner target ${runnerTarget.target_id} is not accepting new jobs`)
    }
    // Preserve the primary execution-safety error: secure kinds are
    // container-only regardless of which target happens to be selected.
    if (SECURE_KINDS.includes(input.kind) && runnerProfile.runner_mode !== 'local-docker') {
      throw new KernelError(422, 'container_execution_required',
        `job kind ${input.kind} requires a container runner profile (got ${runnerProfile.profile_id}); host subprocess is prohibited (v2 §3.2)`)
    }
```

</details>

**依据 2 · 源码核查**：[packages/research-kernel/src/kernel.ts:6604-6631](https://github.com/lzszq/dsh-scholar/blob/086b19a2fbd7824dd71dde7ea2043f22888606e0/packages/research-kernel/src/kernel.ts#L6604-L6631)

同项目批准合同。

<details>
<summary>查看原文（28行）</summary>

```text
      }
    }
    // P0 (acceptance-tests.md §4): formal-class jobs MUST bind an approved
    // contract of the SAME project, frozen by a Human Gate Decision.
    // draft/foreign/missing contracts are 422, never queued.
    const CONTRACT_BOUND_KINDS: readonly string[] = ['baseline', 'pilot', 'formal', 'reproduce']
    let contractMetricNames: string[] | undefined
    let approvedContractBinding: ExperimentContract | null = null
    if (CONTRACT_BOUND_KINDS.includes(input.kind)) {
      const contractId = input.contract_id ?? null
      if (contractId === null || contractId === '') {
        throw new KernelError(422, 'contract_required', `job kind ${input.kind} requires an approved contract binding`)
      }
      let contract: ExperimentContract
      try {
        contract = this.getContract(contractId)
      } catch {
        throw new KernelError(422, 'contract_unknown', `contract ${contractId} not found for ${input.kind} job`)
      }
      if (contract.project_id !== project.project_id) {
        throw new KernelError(422, 'contract_foreign', `contract ${contractId} belongs to another project (cannot bind to ${project.project_id})`)
      }
      if (contract.status !== 'approved' || contract.approval?.gate_decision_id === undefined || contract.approval.gate_decision_id === '') {
        throw new KernelError(422, 'contract_not_approved', `contract ${contractId} is ${contract.status} and not frozen by a Human Gate Decision`)
      }
      approvedContractBinding = contract
      contractMetricNames = [contract.metrics.primary, ...contract.metrics.secondary]
    }
```

</details>

**依据 3 · 源码核查**：[packages/research-kernel/src/kernel.ts:6709-6745](https://github.com/lzszq/dsh-scholar/blob/086b19a2fbd7824dd71dde7ea2043f22888606e0/packages/research-kernel/src/kernel.ts#L6709-L6745)

冻结Protocol、代码及数据要求。

<details>
<summary>查看原文（37行）</summary>

```text
    // must bind an exact, earlier frozen ProtocolRevision.  The protocol's
    // Contract/Code/Data/Environment pins are recomputed from authoritative
    // Kernel objects here; caller-supplied descriptions never establish
    // readiness.  This check deliberately precedes every Job/Run/outbox
    // write, so a failed admission is a zero-write failure.
    const runIntent = ResearchIntent.parse(input.run_intent ?? 'exploratory')
    const protocolRequired = input.kind === 'formal' || runIntent === 'confirmatory'
    const requestedProtocolPin = input.protocol_pin ?? null
    if (protocolRequired || requestedProtocolPin !== null) {
      if (requestedProtocolPin === null) {
        throw new KernelError(422, 'protocol_required', 'formal or confirmatory jobs require an exact frozen protocol_pin')
      }
      let protocol: import('@dsh-scholar/research-schemas').ProtocolRevision
      try {
        protocol = this.methodology.getProtocolRevision(
          project.project_id,
          requestedProtocolPin.protocol_id,
        ).record
      } catch {
        throw new KernelError(422, 'protocol_not_found', `protocol ${requestedProtocolPin.protocol_id} is not registered in project ${project.project_id}`)
      }
      const contract = approvedContractBinding
      if (contract === null) {
        throw new KernelError(422, 'protocol_contract_required', 'protocol-bound jobs require an approved contract_id')
      }
      if (boundCodeSnapshotId === null || boundCodeSnapshotId === '') {
        throw new KernelError(422, 'protocol_code_required', 'protocol-bound jobs require a materialized code snapshot')
      }
      let codeArtifact: ArtifactRecord
      try {
        codeArtifact = this.getArtifact(project.project_id, boundCodeSnapshotId)
      } catch {
        throw new KernelError(422, 'protocol_code_required', 'protocol code pin could not be resolved to an in-project Artifact')
      }
      if (dataArtifactIds.length !== 1) {
        throw new KernelError(422, 'protocol_data_required', 'protocol-bound jobs require exactly one immutable data Artifact (use a dataset bundle Artifact for multiple files)')
      }
```

</details>

**依据 4 · 源码核查**：[workers/runner-gateway/src/index.ts:682-700](https://github.com/lzszq/dsh-scholar/blob/086b19a2fbd7824dd71dde7ea2043f22888606e0/workers/runner-gateway/src/index.ts#L682-L700)

Kernel运行身份与租约fencing。

<details>
<summary>查看原文（19行）</summary>

```text
export async function executeJob(job: JobRecord, options: RunnerOptions): Promise<{ job: JobRecord; run: RunOutcome }> {
  const { client, owner, mode = 'subprocess', timeoutMs = 60000, maxLogBytes = 4 * 1024 * 1024, signal, signingKey } = options
  // §6 terminal frames: the run identity is fixed BEFORE execution so live
  // chunks can be uploaded while the process is still running. RUN-01 (P0):
  // the run identity is the KERNEL'S durable runs row — claimJobs returns
  // `run_id` (run_<12 hex>, one per attempt) and the manifest, metrics
  // provenance and terminal frames must ALL use it; the runner never mints a
  // parallel run id. Missing claim identity is a protocol violation.
  const claimed = job as ClaimedJobRecord
  if (typeof claimed.run_id !== 'string' || claimed.run_id === '') {
    throw new Error(`job ${job.job_id} is missing the Kernel claim run_id`)
  }
  if (typeof claimed.lease_generation !== 'number' || claimed.lease_generation < 1 || claimed.lease_token === null) {
    throw new Error(`job ${job.job_id} is missing the Kernel claim lease fencing fields`)
  }
  const runId = claimed.run_id
  const leaseGeneration = claimed.lease_generation
  const leaseToken = claimed.lease_token
  const pendingFrames: Array<{
```

</details>

**依据 5 · 源码核查**：[workers/runner-gateway/src/index.ts:868-886](https://github.com/lzszq/dsh-scholar/blob/086b19a2fbd7824dd71dde7ea2043f22888606e0/workers/runner-gateway/src/index.ts#L868-L886)

CAS代码物化失败不执行。

<details>
<summary>查看原文（19行）</summary>

```text

  // §11.3 (SCH-EXEC-002): materialize the bound code snapshot from the
  // Artifact Store. The Runner ONLY executes this materialized content —
  // agent host directories are never mounted into the container.
  const codeSnapshotId = (job as JobRecord & { code_snapshot_id?: string | null }).code_snapshot_id
  try {
    if (codeSnapshotId !== null && codeSnapshotId !== undefined && codeSnapshotId !== '') {
      const archiveText = await client.fetchArtifact(job.project_id, codeSnapshotId)
      if (archiveText === null) {
        throw new Error(`code snapshot artifact unreadable from CAS: ${codeSnapshotId} (project ${job.project_id})`)
      }
      const files = unpackCodeSnapshot(archiveText)
      const materialized = materializeCodeSnapshot(files, workDir)
      if (materialized === 0) {
        throw new Error(`code snapshot ${codeSnapshotId} materialized zero files`)
      }
    }
  } catch (error) {
    // Materialization failure: never run the job, clean up the temp dir.
```

</details>

**依据 6 · 源码核查**：[workers/runner-gateway/src/index.ts:1208-1247](https://github.com/lzszq/dsh-scholar/blob/086b19a2fbd7824dd71dde7ea2043f22888606e0/workers/runner-gateway/src/index.ts#L1208-L1247)

metrics失败不成功、manifest及租约完成请求。

<details>
<summary>查看原文（40行）</summary>

```text
    const { failure_class, error: failureError } = classifyFailure(run)
    // P0 (acceptance-tests.md §4): a secure job whose metrics file is
    // missing/invalid must NEVER be marked succeeded — force a failed
    // completion even when the process exited 0.
    const metricsFailure = metricsFileError !== null && failure_class === null
      ? { failure_class: 'code_error' as const, error: metricsFileError }
      : null
    // §12.6 fencing: record the claim's generation inside the manifest so the
    // kernel can reject stale runners that somehow complete late.
    manifest.lease = { generation: job.lease_generation }
    // Sign the final manifest (design §12.7): signature over the canonical
    // JSON excluding `signature`; payload_sha256 over the canonical JSON
    // before the signing fields are attached. The kernel verifies both.
    const finalManifest = signingKey !== undefined
      ? signManifest({ ...manifest, signed_by: owner }, signingKey)
      : { ...manifest, signed_by: owner }
    if (run.exit_code === 0 && failure_class === null && metricsFailure === null) {
      const completed = await client.completeJob({
        job_id: job.job_id,
        owner,
        status: 'succeeded',
        run_manifest: finalManifest,
        lease_generation: job.lease_generation,
        lease_token: job.lease_token,
      })
      return { job: completed, run }
    }
    const completed = await client.completeJob({
      job_id: job.job_id,
      owner,
      status: 'failed',
      failure_class: metricsFailure?.failure_class ?? failure_class,
      error: metricsFailure?.error ?? (failureError || run.error || `exit code ${run.exit_code}`),
      run_manifest: finalManifest,
      lease_generation: job.lease_generation,
      lease_token: job.lease_token,
    })
    return { job: completed, run }
  } finally {
    rmSync(workDir, { recursive: true, force: true })
```

</details>

**依据 7 · 源码核查**：[packages/research-kernel/src/kernel.ts:8946-9003](https://github.com/lzszq/dsh-scholar/blob/086b19a2fbd7824dd71dde7ea2043f22888606e0/packages/research-kernel/src/kernel.ts#L8946-L9003)

接受Evidence的来源/作业/合同复核。

<details>
<summary>查看原文（58行）</summary>

```text
    // Service identity: only Verifier/Auditor service principals may accept.
    if (typeof input.service_principal !== 'string' || input.service_principal === '') {
      throw new KernelError(403, 'service_identity_required',
        'accept requires a non-empty service principal (x-service-principal: verifier|auditor)')
    }
    const inProject = this.listEvidence(input.project_id).find(e => e.evidence_id === input.evidence_id)
    if (inProject === undefined) {
      // Distinguish 404 (unknown id) from 422 (exists in ANOTHER project).
      const anywhere = this.db.prepare('SELECT body FROM evidence WHERE evidence_id = ?').get(input.evidence_id) as { body?: string } | undefined
      if (anywhere?.body !== undefined) {
        throw new KernelError(422, 'evidence_foreign',
          `evidence ${input.evidence_id} belongs to another project (cross-project accept is rejected)`)
      }
      throw new KernelError(404, 'evidence_not_found', `evidence ${input.evidence_id} not found`)
    }
    if (inProject.project_id !== input.project_id) {
      throw new KernelError(422, 'evidence_foreign',
        `evidence ${input.evidence_id} belongs to project ${inProject.project_id}, not ${input.project_id}`)
    }
    const provenance = (inProject as { provenance_status?: string }).provenance_status
    if (provenance !== 'verified') {
      throw new KernelError(409, 'provenance_not_verified',
        `evidence ${input.evidence_id} has provenance_status '${provenance ?? 'unknown'}'; only verified evidence may transition to accepted (verified → accepted)`)
    }
    // ── Revalidation (acceptance-tests.md §6) ──────────────────────────────
    // RunManifest: every run_id must resolve to a same-project SUCCEEDED job
    // with a run manifest, and the manifest must re-verify against the job.
    const jobs = this.listJobs(input.project_id)
    for (const runId of inProject.run_ids) {
      const job = jobs.find(j =>
        j.job_id === runId
        || j.idempotency_key === runId
        || (j.run_manifest !== null && typeof j.run_manifest.run_id === 'string' && j.run_manifest.run_id === runId),
      )
      if (job === undefined) {
        throw new KernelError(422, 'evidence_revalidation_failed',
          `accept revalidation failed: run_id ${runId} does not resolve to a job of project ${input.project_id}`)
      }
      if (job.status !== 'succeeded' || job.run_manifest === null) {
        throw new KernelError(422, 'evidence_revalidation_failed',
          `accept revalidation failed: run_id ${runId} resolves to job ${job.job_id} in status '${job.status}' without a run manifest`)
      }
      this.verifyRunManifest(job.run_manifest, job)
      // Contract: the job's (or manifest's) contract must exist and be approved.
      const contractId = job.contract_id ?? (typeof job.run_manifest.contract_id === 'string' ? job.run_manifest.contract_id : null)
      if (contractId === null || contractId === '') {
        throw new KernelError(422, 'evidence_revalidation_failed',
          `accept revalidation failed: job ${job.job_id} (run ${runId}) has no bound contract`)
      }
      let contract: ExperimentContract
      try {
        contract = this.getContract(contractId)
      } catch {
        throw new KernelError(422, 'evidence_revalidation_failed',
          `accept revalidation failed: contract ${contractId} of run ${runId} not found`)
      }
      if (contract.status !== 'approved') {
        throw new KernelError(422, 'evidence_revalidation_failed',
```

</details>

#### 缺口

- 未完整审Docker参数、SSH/GPU目标身份、所有manifest校验与失租约重启边界。
  **影响**：不能承诺所有部署隔离、故障恢复或远程复现实效。
  **进一步探讨**：固定local-Docker fixture先逐项检查目标身份和失败终态；远程路径另核完整链。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 相对实验脚本加笔记，新增价值及维护负担是什么？

**研究主题**：贡献与相对优势、效果与总成本、依赖、兼容与流程

#### 完整回答

贡献在把人类决策、合同/Protocol revision、不可变输入、租约作业和Evidence接成同一持久状态体系；这是可复用的科研责任和验收组织，超过多一个聊天面板。模型、Docker/SSH、TeX及文献/OCR连接器仍是既有技术，组件没有证明更强发现能力。正式Evidence与普通日志分开尤其可借鉴，但误把“来源已验”读成“科学已证”会抵消价值。

首次要有Linux、Node24、pnpm11.20、Kernel和工作台token、Runner Profile/Target及固定镜像；研究者还要将已有代码/数据/合同迁入治理。持续有模型/OCR/检索服务、存储、容器和可能GPU现金成本，外加批准、维护证据关系及版本升级的时间。正式路径减少临时手工拼接，但把更多定义和维护责任前置；没有同等研究任务总账，不推算ROI。

恢复需要保持canonical Kernel项目目录和备份，再核作业/证据终态；界面可重建不等于丢失原始数据也可自动恢复。退出可移除插件但应独立保留项目、CAS/manifest、源数据及TeX。README列出远程SSH/GPU、真实视觉/reviewer和mTLS等手工验收边界；本研究没有将作者自动测试声明升级为运行通过。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:37-72](https://github.com/lzszq/dsh-scholar/blob/086b19a2fbd7824dd71dde7ea2043f22888606e0/README.md#L37-L72)

环境、共享canonical目录与Runner配置说明。

<details>
<summary>查看原文（36行）</summary>

````text
pnpm install --frozen-lockfile
pnpm run build
```

### 2. Start the standalone workspace

```bash
bash scripts/start-standalone-ui.sh
```

Open <http://127.0.0.1:18610> and paste the token from:

```text
~/.dsh-scholar-standalone/research-ui-standalone/standalone-token
```

The standalone workspace and DSH use the same Research Kernel at `127.0.0.1:7412` and the same canonical project data directory at `~/.dsh/research-kernel`. Upgrading either surface must keep that directory unchanged so existing projects remain accessible. Browser tokens and display preferences live separately in the standalone BFF directory. Use `--no-token` only on an isolated, supervised, loopback-only development instance.

### 3. Configure an execution environment

Open **Settings → Execution environment** and select an explicit Runner Profile:

- local machine for trusted development and smoke checks;
- local Docker with a pinned image, optionally requiring the NVIDIA runtime and GPU capability;
- remote SSH with server-side endpoint, credential, known-hosts, and target-identity SecretRefs.

Formal Jobs do not execute until the selected profile and target pass readiness checks. A missing Runner, offline target, unavailable SecretRef, capability mismatch, or incomplete Contract/Protocol is shown as preparation or a blocker instead of being treated as ready. See the [runtime guide](docs/test-instance-plan.md) for target registration, target-scoped heartbeat credentials, Runner startup, ports, and security constraints.

### 4. Install the plugin in DSH

Install the current DSH prerelease through its moving `next` tag, then record the exact installed version:

```bash
npm install -g @deepseek-ai/dsh@next
npm ls -g @deepseek-ai/dsh --depth=0
```
````

</details>

**依据 2 · 源码核查**：[packages/research-kernel/src/kernel.ts:6434-6459](https://github.com/lzszq/dsh-scholar/blob/086b19a2fbd7824dd71dde7ea2043f22888606e0/packages/research-kernel/src/kernel.ts#L6434-L6459)

持久作业幂等与输入绑定。

<details>
<summary>查看原文（26行）</summary>

```text
    created_by_principal_id?: string | null
  }): JobSpecBound {
    const project = this.getProject(input.project_id)
    // reconstruction-contracts.md §5 / security-baseline.md §1: full-auto is
    // fixture-only. A full-auto project must stay bound to its REGISTERED
    // FixtureProfile and every job input must stay INSIDE the profile:
    // pinned image digest, data artifact content hashes and (when the
    // profile pins one) the code archive hash. Referencing anything outside
    // the profile is 422 — never queued.
    const fixtureProfile = project.mode === 'full-auto' ? getFixtureProfile(project.execution.fixture_id ?? '') : null
    if (project.mode === 'full-auto' && fixtureProfile === null) {
      throw new KernelError(422, 'fixture_required',
        `full-auto project ${project.project_id} is not bound to a REGISTERED FixtureProfile (reconstruction-contracts.md §5)`)
    }
    // v2 §3.4: idempotency is project-scoped — the same key in two projects
    // yields two independent jobs.
    const existing = this.db.prepare('SELECT * FROM jobs WHERE project_id = ? AND idempotency_key = ?')
      .get(input.project_id, input.idempotency_key) as JobRow | undefined
    if (existing !== undefined) return jobFromRow(existing, this.db, this.leaseTokens.get(existing.job_id) ?? null)
    // v2 §3.2 / §12.3: formal-class jobs require a container runner profile;
    // isolated-subprocess is rejected at submission time (kernel layer).
    // domain-model.md §2/§9.1: Job 只引用已登记的 opaque profile id ——
    // 显式 runner_profile_id（job 级 > project 级）优先；未配置/null 或未知 id
    // → 422（fail closed，零落库）。解析出的
    // profile 的 config_hash 与 image digest 一起固定进 Job payload，runner
    // 按注册表复算校验。
```

</details>

**依据 3 · 源码核查**：[packages/research-kernel/src/kernel.ts:8946-9003](https://github.com/lzszq/dsh-scholar/blob/086b19a2fbd7824dd71dde7ea2043f22888606e0/packages/research-kernel/src/kernel.ts#L8946-L9003)

Evidence与日志的责任边界。

<details>
<summary>查看原文（58行）</summary>

```text
    // Service identity: only Verifier/Auditor service principals may accept.
    if (typeof input.service_principal !== 'string' || input.service_principal === '') {
      throw new KernelError(403, 'service_identity_required',
        'accept requires a non-empty service principal (x-service-principal: verifier|auditor)')
    }
    const inProject = this.listEvidence(input.project_id).find(e => e.evidence_id === input.evidence_id)
    if (inProject === undefined) {
      // Distinguish 404 (unknown id) from 422 (exists in ANOTHER project).
      const anywhere = this.db.prepare('SELECT body FROM evidence WHERE evidence_id = ?').get(input.evidence_id) as { body?: string } | undefined
      if (anywhere?.body !== undefined) {
        throw new KernelError(422, 'evidence_foreign',
          `evidence ${input.evidence_id} belongs to another project (cross-project accept is rejected)`)
      }
      throw new KernelError(404, 'evidence_not_found', `evidence ${input.evidence_id} not found`)
    }
    if (inProject.project_id !== input.project_id) {
      throw new KernelError(422, 'evidence_foreign',
        `evidence ${input.evidence_id} belongs to project ${inProject.project_id}, not ${input.project_id}`)
    }
    const provenance = (inProject as { provenance_status?: string }).provenance_status
    if (provenance !== 'verified') {
      throw new KernelError(409, 'provenance_not_verified',
        `evidence ${input.evidence_id} has provenance_status '${provenance ?? 'unknown'}'; only verified evidence may transition to accepted (verified → accepted)`)
    }
    // ── Revalidation (acceptance-tests.md §6) ──────────────────────────────
    // RunManifest: every run_id must resolve to a same-project SUCCEEDED job
    // with a run manifest, and the manifest must re-verify against the job.
    const jobs = this.listJobs(input.project_id)
    for (const runId of inProject.run_ids) {
      const job = jobs.find(j =>
        j.job_id === runId
        || j.idempotency_key === runId
        || (j.run_manifest !== null && typeof j.run_manifest.run_id === 'string' && j.run_manifest.run_id === runId),
      )
      if (job === undefined) {
        throw new KernelError(422, 'evidence_revalidation_failed',
          `accept revalidation failed: run_id ${runId} does not resolve to a job of project ${input.project_id}`)
      }
      if (job.status !== 'succeeded' || job.run_manifest === null) {
        throw new KernelError(422, 'evidence_revalidation_failed',
          `accept revalidation failed: run_id ${runId} resolves to job ${job.job_id} in status '${job.status}' without a run manifest`)
      }
      this.verifyRunManifest(job.run_manifest, job)
      // Contract: the job's (or manifest's) contract must exist and be approved.
      const contractId = job.contract_id ?? (typeof job.run_manifest.contract_id === 'string' ? job.run_manifest.contract_id : null)
      if (contractId === null || contractId === '') {
        throw new KernelError(422, 'evidence_revalidation_failed',
          `accept revalidation failed: job ${job.job_id} (run ${runId}) has no bound contract`)
      }
      let contract: ExperimentContract
      try {
        contract = this.getContract(contractId)
      } catch {
        throw new KernelError(422, 'evidence_revalidation_failed',
          `accept revalidation failed: contract ${contractId} of run ${runId} not found`)
      }
      if (contract.status !== 'approved') {
        throw new KernelError(422, 'evidence_revalidation_failed',
```

</details>

**依据 4 · 源码核查**：[package.json:54-65](https://github.com/lzszq/dsh-scholar/blob/086b19a2fbd7824dd71dde7ea2043f22888606e0/package.json#L54-L65)

仓内Kernel/client/orchestrator依赖。

<details>
<summary>查看原文（12行）</summary>

```text
  "dependencies": {
    "@dsh-scholar/research-client": "workspace:^",
    "@dsh-scholar/research-kernel": "workspace:^",
    "@dsh-scholar/research-orchestrator": "workspace:^",
    "@dsh-scholar/research-schemas": "workspace:^",
    "@dsh-scholar/scholar-connectors": "workspace:^",
    "zod": "^3.24.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=4.0.0-rc.7 <4.0.1 || >=4.0.1-rc.1 <5",
    "@deepseek-ai/schemastery": ">=3.18.0 <3.18.1 || >=3.18.1-rc.1 <4",
    "@deepseek-ai/dsh-commands": "^0.1.1-rc.2",
```

</details>

#### 缺口

- 没有真实研究项目的迁移、人工Gate负担、结论质量和全部费用对照。
  **影响**：无法确认净收益或长期维护可承受程度。
  **进一步探讨**：相同小型计算课题对比现有实验跟踪/笔记流程，计结果可追溯性、误接受、恢复与人工总时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 何种研究可试用，下一步生产方向如何证伪？

**研究主题**：采用判断、新假设与验证

#### 完整回答

适合能维护本地容器、愿意监督每次科研决定的计算研究者，保留浏览器token，用非敏感、已知预期结果的fixture试用gate-only；不采用--no-token开发例外作为常规试用配置。先故意提交未批合同/错profile确认拒绝，再批准精确合同运行，核metrics、manifest与Evidence关联；模拟缺metrics不应成功。不要以full-auto名称规划无人论文生产，远程SSH/GPU及真实研究结论另做验收。状态或证据关联不明时停作业，保留Kernel目录及原始数据，回独立脚本和人工证据账本。

值得验证的方向是面向人类Gate的“决策差异视图”：每次批准只展示相对上次已批准版本真正变化的假设、数据/代码pin、预算及证据缺口，并把批准绑定到这份差异。依据是现有精确revision/合同及多阶段批准会产生复核负担；新增应减少重复阅读而不放宽Gate。用刻意混入代码pin/指标变化的相同项目比较漏批风险、批准耗时和全部调用；如果现有Gate页面已同样明确，或差异视图隐藏关键整体背景导致误批，就推翻方向。

#### 证据与依据

**依据 1 · 源码核查**：[packages/research-kernel/src/full-auto.ts:206-225](https://github.com/lzszq/dsh-scholar/blob/086b19a2fbd7824dd71dde7ea2043f22888606e0/packages/research-kernel/src/full-auto.ts#L206-L225)

精确版本批准依据。

<details>
<summary>查看原文（20行）</summary>

```text
  const { project, gate, fixture, runner_profile: runnerProfile, runner_target: runnerTarget } = input
  if (project.mode !== 'full-auto' || fixture === null || project.execution.fixture_id !== fixture.fixture_id) {
    return failure('full_auto_fixture_required', 'automatic Gate decisions require a persisted full-auto project bound to a registered FixtureProfile')
  }
  if (project.brief_status !== 'confirmed') {
    return failure('full_auto_fixture_required', 'automatic Gate decisions cannot confirm or bypass a collecting Research Brief')
  }
  if (project.revision !== input.expected_project_revision) {
    return failure('revision_conflict', `expected project revision ${input.expected_project_revision}, got ${project.revision}`)
  }
  if (gate.project_id !== project.project_id || gate.status !== 'pending') {
    return failure('full_auto_gate_target_invalid', 'automatic Gate decision requires a pending Gate of the exact project')
  }
  if (!(FULL_AUTO_GATE_ALLOWLIST as readonly string[]).includes(gate.type)) {
    return failure('full_auto_gate_not_allowed', `Gate type ${gate.type} is not in the fixture full-auto allowlist; Release always stays Human`)
  }
  if (runnerProfile === null || project.execution.runner_profile_id !== runnerProfile.profile_id
    || runnerTarget === null || project.execution.runner_target_id !== runnerTarget.target_id
    || runnerProfile.image !== fixture.image || input.runner_failures.length > 0) {
    return failure('full_auto_runner_not_ready', `fixture runner is not exactly ready: ${input.runner_failures.join(',') || 'profile/target/image binding mismatch'}`)
```

</details>

**依据 2 · 源码核查**：[packages/research-kernel/src/kernel.ts:6604-6631](https://github.com/lzszq/dsh-scholar/blob/086b19a2fbd7824dd71dde7ea2043f22888606e0/packages/research-kernel/src/kernel.ts#L6604-L6631)

合同批准与作业依赖。

<details>
<summary>查看原文（28行）</summary>

```text
      }
    }
    // P0 (acceptance-tests.md §4): formal-class jobs MUST bind an approved
    // contract of the SAME project, frozen by a Human Gate Decision.
    // draft/foreign/missing contracts are 422, never queued.
    const CONTRACT_BOUND_KINDS: readonly string[] = ['baseline', 'pilot', 'formal', 'reproduce']
    let contractMetricNames: string[] | undefined
    let approvedContractBinding: ExperimentContract | null = null
    if (CONTRACT_BOUND_KINDS.includes(input.kind)) {
      const contractId = input.contract_id ?? null
      if (contractId === null || contractId === '') {
        throw new KernelError(422, 'contract_required', `job kind ${input.kind} requires an approved contract binding`)
      }
      let contract: ExperimentContract
      try {
        contract = this.getContract(contractId)
      } catch {
        throw new KernelError(422, 'contract_unknown', `contract ${contractId} not found for ${input.kind} job`)
      }
      if (contract.project_id !== project.project_id) {
        throw new KernelError(422, 'contract_foreign', `contract ${contractId} belongs to another project (cannot bind to ${project.project_id})`)
      }
      if (contract.status !== 'approved' || contract.approval?.gate_decision_id === undefined || contract.approval.gate_decision_id === '') {
        throw new KernelError(422, 'contract_not_approved', `contract ${contractId} is ${contract.status} and not frozen by a Human Gate Decision`)
      }
      approvedContractBinding = contract
      contractMetricNames = [contract.metrics.primary, ...contract.metrics.secondary]
    }
```

</details>

**依据 3 · 源码核查**：[workers/runner-gateway/src/index.ts:1208-1247](https://github.com/lzszq/dsh-scholar/blob/086b19a2fbd7824dd71dde7ea2043f22888606e0/workers/runner-gateway/src/index.ts#L1208-L1247)

可用于已知失败试用的metrics边界。

<details>
<summary>查看原文（40行）</summary>

```text
    const { failure_class, error: failureError } = classifyFailure(run)
    // P0 (acceptance-tests.md §4): a secure job whose metrics file is
    // missing/invalid must NEVER be marked succeeded — force a failed
    // completion even when the process exited 0.
    const metricsFailure = metricsFileError !== null && failure_class === null
      ? { failure_class: 'code_error' as const, error: metricsFileError }
      : null
    // §12.6 fencing: record the claim's generation inside the manifest so the
    // kernel can reject stale runners that somehow complete late.
    manifest.lease = { generation: job.lease_generation }
    // Sign the final manifest (design §12.7): signature over the canonical
    // JSON excluding `signature`; payload_sha256 over the canonical JSON
    // before the signing fields are attached. The kernel verifies both.
    const finalManifest = signingKey !== undefined
      ? signManifest({ ...manifest, signed_by: owner }, signingKey)
      : { ...manifest, signed_by: owner }
    if (run.exit_code === 0 && failure_class === null && metricsFailure === null) {
      const completed = await client.completeJob({
        job_id: job.job_id,
        owner,
        status: 'succeeded',
        run_manifest: finalManifest,
        lease_generation: job.lease_generation,
        lease_token: job.lease_token,
      })
      return { job: completed, run }
    }
    const completed = await client.completeJob({
      job_id: job.job_id,
      owner,
      status: 'failed',
      failure_class: metricsFailure?.failure_class ?? failure_class,
      error: metricsFailure?.error ?? (failureError || run.error || `exit code ${run.exit_code}`),
      run_manifest: finalManifest,
      lease_generation: job.lease_generation,
      lease_token: job.lease_token,
    })
    return { job: completed, run }
  } finally {
    rmSync(workDir, { recursive: true, force: true })
```

</details>

#### 缺口

- 试用与Gate差异视图实验未执行，现有全部Gate UI未穷尽。
  **影响**：新增方向只是待核必要性与效果。
  **进一步探讨**：先审现有Gate呈现再做相同任务和错误pin检出对照。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
