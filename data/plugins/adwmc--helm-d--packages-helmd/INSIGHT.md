# Helm D

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[1e6b954](https://github.com/ADWMC/helm-d/tree/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd)

<!-- BEGIN META -->
[![GitHub ★ 1,024](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C024&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ADWMC/helm-d) [![npm 30d 545](https://img.shields.io/static/v1?label=npm+30d&message=545&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@adwmc/helm-d) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@adwmc/helm-d)
<!-- END META -->

> **功能**：为 DSH 提供安全分析工具、案例证据记录及相关工作流。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示案例绑定、部分工具输出编号和恢复入口的集中接线；它有助于组织材料，但不能代替原件和结论审核。

> **主要限制**：[Q03](#research-q03) 的编号、命令文本及可选调用轨迹检查不验证证据蕴含或实际复现；[Q02](#research-q02) 长输出可能只留截断片段，需独立保存原始材料。

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
  - [Q01 · 授权安全分析人员使用这个组件，相对手工证据表增加什么？](#detail-section-11)
  - [Q02 · 哪些工具结果进入案例，文件与摘要能否代表完整证据？](#detail-section-12)
  - [Q03 · 发现引用和复现命令检查能否证明结论正确？](#detail-section-13)
  - [Q04 · 启动健康检查会否写配置，失败后有什么恢复条件？](#detail-section-14)
  - [Q05 · 什么情况下应暂停使用并退回手工证据流程？](#detail-section-15)
  - [Q06 · 把可审证据与行为干预拆开能否改善结果可信度？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：授权安全分析人员可将样本分析的部分工具输出和发现组织到案例中，并在后续会话恢复。

原始工具日志、手工证据表与独立复核可完成相同留证；此组件集中部分流程，未证明结果更可信。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 案例记录 | 组织任务和留存证据编号 | 无活动案例或非字符串结果不自动保存 |
| 发现登记 | 关联证据编号和复现文本 | 不证明证据支持结论或实际复现 |
| 案例恢复 | 从磁盘查找并重新绑定案例 | 实际恢复与并发未验证 |
| preset 健康检查 | 对照宿主并按策略修复 | 默认可写入，备份失败不阻止修复 |
| 领域分析工具 | 调用本地程序处理授权样本 | 执行权限、工具与目标需独立核实 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 与 Node | 加载需要 | Host、Agent、工具和系统提示 | 版本不符不能假定可用 |
| 活动案例及可写目录 | 自动留证需要 | 保存字符串输出与编号 | 无案例时结果不保存 |
| 解释器或外部程序 | 对应分析需要 | 执行所选工具 | 缺服务时可能回退本地进程 |
| 授权范围和独立审阅 | 使用与交付需要 | 确认目标、证据和结论 | 编号与提示不能代替授权 |
| 独立 preset 备份 | 配置修复前需要 | 恢复原文件 | 内置备份失败仍可能继续修复 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 分析人员确认授权并备份配置 | 目标和可恢复副本均明确 |
| 收集 | 在隔离案例保存完整原始工具结果 | 回读编号、原文与截断情况 |
| 复核 | 独立人员对照发现与证据 | 验证相关性和实际复现 |
| 恢复 | 发现写入、权限或证据异常 | 停止并恢复配置，回到手工证据表 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主、模型和工具资源费用未知 | 审查提示、脚本、授权和备份 | 默认策略可能修复带指纹 preset |
| 持续 | 工具执行与证据存储费用未知 | 核原件、相关性与复现 | 不知合格任务成本 |
| 恢复 | 重试和存储资源未知 | 查备份并核部分写入和实际状态 | 内置备份可能失败 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 证据组织 | 活动案例可保存部分字符串输出 | 全部原件覆盖及独立可信度 |
| 发现记录 | 验证编号、非空命令及可选调用轨迹 | 证据蕴含、真实复现和结论正确率 |
| preset 维护 | 条件下重生成并复核文件 | 备份成功和重启后运行 |

> **思考**：[Q03](#research-q03) 的编号、命令文本及可选调用轨迹检查不验证证据蕴含或实际复现；[Q02](#research-q02) 长输出可能只留截断片段，需独立保存原始材料。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示案例绑定、部分工具输出编号和恢复入口的集中接线；它有助于组织材料，但不能代替原件和结论审核。

[Q02](#research-q02) 将部分插件工具留证集中到注册包装；[Q03](#research-q03) 的结构约束不应被误读成语义或独立安全验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的编号、命令文本及可选调用轨迹检查不验证证据蕴含或实际复现；[Q02](#research-q02) 长输出可能只留截断片段，需独立保存原始材料。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议先观察并审阅完整行为，确认授权、独立备份和执行边界后再考虑隔离验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持条件性留证和配置修复机制；完整覆盖、授权、独立复现与实际收益未经本次验证。

- 已检查：作者 README、包清单、源码路径 packages/helmd/package.json、packages/helmd/src/index.ts、packages/helmd/src/persist.ts、packages/helmd/src/case.ts、packages/helmd/src/tools/caseflow.ts、packages/helmd/src/health.ts、packages/helmd/src/seam.ts、packages/helmd/src/llm-stream-hook.ts 及固定范围 inventory；组件：packages/helmd。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向核查包入口、案例包装、发现记录、健康修复及执行接口；未全面审计封装内容、模型干预、所有工具与宿主权限，不运行目标。
- 下一步：获得明确授权后在隔离环境对照手工证据表，核非字符串、长输出、实际复现、备份失败及重启结果。

**分析版本**

- **仓库**：[ADWMC/helm-d](https://github.com/ADWMC/helm-d)
- **版本号**：0.5.3（[固定提交 1e6b954](https://github.com/ADWMC/helm-d/tree/1e6b954dd290267ce330e19cea6368f7d2184683)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出可审证据层与行为干预分离的未验证假设，需对照完整原始日志及人工审查。

获得明确授权后在隔离环境对照手工证据表，核非字符串、长输出、实际复现、备份失败及重启结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 7 | 3015 | 2568 | 309 | — |
| .md | source | 367 | 96189 | — | — | 548153 |
| .mjs | source | 3 | 688 | 497 | 146 | — |
| .ts | source | 47 | 9236 | 7529 | 1192 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/ADWMC/helm-d/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/ADWMC/helm-d/issues?q=is%3Aissue+created%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/ADWMC/helm-d/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查授权样本分析的案例留证、发现校验及宿主配置和执行边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 授权安全分析人员使用这个组件，相对手工证据表增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对自有或获授权样本开展分析的人员，可以用案例目录集中保存部分工具输出与编号，并记录引用这些编号的发现。包的插件 patch 与 Agent 导出声明、入口注册案例和领域工具，说明它是 DSH 插件组件。手工证据表、原始工具日志和人工复核也能组织同一工作；这里的增量是将案例绑定、部分工具输出留存和结构化记录接到 Agent 流程，而不是证明分析结果可靠或安全评估更有效。权限范围和真实需求仍需人工独立确认。

#### 证据与依据

**依据 1 · 源码核查**：[packages/helmd/package.json:1-36](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/package.json#L1-L36)

包身份和 Agent 导出。

<details>
<summary>查看原文（36行）</summary>

```text
{
  "name": "@adwmc/helm-d",
  "version": "0.5.3",
  "type": "module",
  "license": "AGPL-3.0-or-later",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ADWMC/helm-d.git",
    "directory": "packages/helmd"
  },
  "homepage": "https://github.com/ADWMC/helm-d#readme",
  "bugs": {
    "url": "https://github.com/ADWMC/helm-d/issues"
  },
  "keywords": [
    "dsh",
    "dsh-plugin",
    "deepseek-harness",
    "security-analysis",
    "reverse-engineering",
    "pentest",
    "malware-analysis",
    "ai-security"
  ],
  "main": "dist/health.js",
  "types": "dist/health.d.ts",
  "exports": {
    ".": {
      "types": "./dist/health.d.ts",
      "default": "./dist/health.js"
    },
    "./agent": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./client": "./client.js",
```

</details>

**依据 2 · 源码核查**：[packages/helmd/package.json:50-68](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/package.json#L50-L68)

bundle 和客户端声明。

<details>
<summary>查看原文（19行）</summary>

```text
    "!presets/profiles"
  ],
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "prepublishOnly": "node ../../scripts/verify-pack.mjs --require-sealed"
  },
  "dsh": {
    "bundle": {
      "patch": [
        "./cordis.patch.yml",
        "./preset.generated.patch.yml"
      ]
    },
    "client": {
```

</details>

**依据 3 · 源码核查**：[packages/helmd/src/index.ts:24-38](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/index.ts#L24-L38)

Agent 注入与持久化包装。

<details>
<summary>查看原文（15行）</summary>

```text
export const name = 'helmd'
export const inject = ['tools', 'systemPrompt']

/** The host's native shell tool on this platform. Selecting one (instead of
 *  listing both) keeps the bootstrap anchor unambiguous when a machine has
 *  both bash and pwsh installed — on Linux, `win32` never enters the list. */
const NATIVE_SHELL = process.platform === 'win32' ? 'pwsh' : 'bash'

export function apply(ctx: Context): void {
  // Description wash FIRST: normalize any "denial is final" tool wording before
  // any domain tool registers (defensive layer — current helmd descriptions are clean).
  const unwash = applyDescriptionWash(ctx)
  // Persistence wrap FIRST: every later-registered domain tool gains
  // evidence persistence without per-tool edits (soft gate).
  const unwrap = applyPersistenceWrap(ctx)
```

</details>

**依据 4 · 源码核查**：[packages/helmd/src/index.ts:59-79](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/index.ts#L59-L79)

案例及领域工具注册。

<details>
<summary>查看原文（21行）</summary>

```text
    // Local team protocol: role guard + orchestrator contract + dispatch.
    registerTeamPolicy(ctx)
    registerTeamContext(ctx)
    registerTeamTools(ctx)

    // Case lifecycle: begin_case / case_status / record_finding / save_evidence / end_case
    registerCaseflowTools(ctx)
    // Per-turn [helm-d case] section: the model sees the case it is bound to,
    // not just a tool it may forget to call after compaction.
    registerCaseContext(ctx)


    // Domain tools
    registerAndroidTools(ctx)
    registerWebTools(ctx)
    registerNativeTools(ctx)
    registerProtocolTools(ctx)
    registerMalwareTools(ctx)
    registerAiSecurityTools(ctx)
    registerEvidenceTools(ctx)
    registerToolboxTools(ctx)
```

</details>

#### 缺口

- 没有同任务分析人员对照
  **影响**：不能证明节时、覆盖或结论质量提升
  **进一步探讨**：以授权测试样本比较手工证据表与插件的完整审核成本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 哪些工具结果进入案例，文件与摘要能否代表完整证据？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Agent 入口在注册插件工具之前临时包装 tools.register，之后恢复原注册函数；排除清单和非字符串结果不经持久化，没有活动案例时仍返回结果并提示未保存。因此不能将其理解为覆盖所有宿主工具或所有输出。活动案例下包装器将字符串交给 saveEvidence 并返回编号。saveEvidence 对完整字符串计算 SHA-256，但超过 256×1024 字符时只写前段与截断提示，再返回完整内容的摘要；仅有落盘片段不能重建完整原文。case_status 可查磁盘并重新绑定案例，但恢复效率及并发行为未实测。

#### 证据与依据

**依据 1 · 源码核查**：[packages/helmd/src/index.ts:32-38](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/index.ts#L32-L38)

注册前包装。

```text
export function apply(ctx: Context): void {
  // Description wash FIRST: normalize any "denial is final" tool wording before
  // any domain tool registers (defensive layer — current helmd descriptions are clean).
  const unwash = applyDescriptionWash(ctx)
  // Persistence wrap FIRST: every later-registered domain tool gains
  // evidence persistence without per-tool edits (soft gate).
  const unwrap = applyPersistenceWrap(ctx)
```

**依据 2 · 源码核查**：[packages/helmd/src/index.ts:64-82](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/index.ts#L64-L82)

注册案例及领域工具后解除包装。

<details>
<summary>查看原文（19行）</summary>

```text
    // Case lifecycle: begin_case / case_status / record_finding / save_evidence / end_case
    registerCaseflowTools(ctx)
    // Per-turn [helm-d case] section: the model sees the case it is bound to,
    // not just a tool it may forget to call after compaction.
    registerCaseContext(ctx)


    // Domain tools
    registerAndroidTools(ctx)
    registerWebTools(ctx)
    registerNativeTools(ctx)
    registerProtocolTools(ctx)
    registerMalwareTools(ctx)
    registerAiSecurityTools(ctx)
    registerEvidenceTools(ctx)
    registerToolboxTools(ctx)
  } finally {
    unwrap()
    unwash()
```

</details>

**依据 3 · 源码核查**：[packages/helmd/src/persist.ts:13-24](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/persist.ts#L13-L24)

排除的工具集合。

<details>
<summary>查看原文（12行）</summary>

```text
const NO_PERSIST = new Set([
  // knowledge / router / session tools — outputs are not case artifacts
  'skill_catalog', 'read_reference', 'analysis_mode', 'route_task',
  'evidence_reference', 'native_reference', 'web_reference',
  'malware_reference', 'ai_reference', 'protocol_reference',
  'tool_recommend',
  // coordination, not an artifact of the analysis
  'team_dispatch',
  // case lifecycle / ledger bookkeeping itself
  'begin_case', 'case_status', 'record_finding', 'end_case', 'save_evidence',
  'record_hypothesis', 'update_hypothesis',
])
```

</details>

**依据 4 · 源码核查**：[packages/helmd/src/persist.ts:69-87](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/persist.ts#L69-L87)

非字符串和无活动案分支、保存与返回编号。

<details>
<summary>查看原文（19行）</summary>

```text
async function persistHook(
  sessionId: string | undefined,
  toolName: string,
  result: unknown,
  agent: unknown,
): Promise<unknown> {
  if (typeof result !== 'string') return result
  const active = getCase(sessionId)
  if (!active) {
    return result + '\n[no active case — output NOT persisted. begin_case(goal, samples) keeps evidence.]'
  }
  const firstLine = result.split('\n').find((l) => l.trim()) ?? ''
  const { id } = await saveEvidence(active.dir, toolName, result, firstLine)
  try {
    await nudgeCaseState(sessionId, agent, active)
  } catch {
    // The nudge is best-effort; a case/ledger read failure must not break the tool result.
  }
  return result + `\n[evidence: ${id} saved to ${active.name}]`
```

</details>

**依据 5 · 源码核查**：[packages/helmd/src/persist.ts:94-112](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/persist.ts#L94-L112)

临时注册包装和恢复。

<details>
<summary>查看原文（19行）</summary>

```text
export function applyPersistenceWrap(ctx: Context): () => void {
  const target = ctx.tools as unknown as {
    register: (def: { name: string; execute?: (...a: any[]) => any }) => void
  }
  const originalRegister = target.register
  target.register = (def) => {
    if (!def || typeof def.execute !== 'function' || isNoPersist(def.name)) {
      return originalRegister.call(ctx.tools, def)
    }
    const original = def.execute.bind(def)
    ;(def as any).execute = async (args: unknown, exec?: { agent?: { id?: string } }) => {
      const result = await original(args, exec)
      return await persistHook(exec?.agent?.id, def.name, result, exec?.agent)
    }
    return originalRegister.call(ctx.tools, def)
  }
  return () => {
    target.register = originalRegister
  }
```

</details>

**依据 6 · 源码核查**：[packages/helmd/src/case.ts:232-258](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/case.ts#L232-L258)

全内容摘要和截断落盘。

<details>
<summary>查看原文（27行）</summary>

```text
export async function saveEvidence(
  caseDir: string,
  toolLabel: string,
  content: string,
  summary: string,
): Promise<{ id: string; path: string; sha256: string; dedup?: string }> {
  const sha = createHash('sha256').update(content, 'utf8').digest('hex')
  // Dedup: if an evidence file with the same content hash exists, return it.
  const files = await readdir(join(caseDir, 'evidence')).catch(() => [] as string[])
  for (const f of files) {
    if (!/^E-\d{3,}-/.test(f)) continue
    const existing = await readFile(join(caseDir, 'evidence', f), 'utf8').catch(() => '')
    const existingSha = createHash('sha256').update(existing, 'utf8').digest('hex')
    if (existingSha === sha) {
      const existingId = /^E-(\d{3,})-/.exec(f)?.[1]
      if (existingId) return { id: `E-${existingId}`, path: join(caseDir, 'evidence', f), sha256: sha, dedup: `E-${existingId}` }
    }
  }
  const id = await nextEvidenceId(caseDir)
  const safeTool = toolLabel.replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 40) || 'output'
  const capped = content.length > 256 * 1024
    ? content.slice(0, 256 * 1024) + `\n[truncated at 256KB; full length ${content.length}]\n`
    : content
  const path = join(caseDir, 'evidence', `${id}-${safeTool}.txt`)
  await writeFile(path, capped, 'utf8')
  await appendTimeline(caseDir, `${toolLabel} → ${id} — ${summary.slice(0, 80)}`)
  return { id, path, sha256: sha }
```

</details>

**依据 7 · 源码核查**：[packages/helmd/src/tools/caseflow.ts:117-124](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/tools/caseflow.ts#L117-L124)

磁盘案例状态与恢复入口。

```text
  ctx.tools.register(defineTool({
    name: 'case_status',
    description:
      'Re-read the active case state from disk (CASE.md header, samples, recent timeline). ' +
      'Call this FIRST when resuming a task after context compaction — disk state survives what the conversation loses. ' +
      'Can also resume an existing case by name or inspect cases on disk.',
    parameters: {
      name: { type: 'string', description: 'Optional case folder name to resume (or "open"/"latest" to rebind the most recent open case).' },
```

#### 缺口

- 没有运行或并发与长输出故障实验
  **影响**：不能确认实际宿主中全部留存、恢复或完整性
  **进一步探讨**：隔离案例以长字符串、非字符串和无案例结果验证原件与返回摘要。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 发现引用和复现命令检查能否证明结论正确？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

record_finding 检查活动案例、引用编号存在及复现命令文本非空；启用相应纪律设置时，还检查至少一项非自写来源文件和会话中有参考文档工具调用。实现根据证据数量和置信度等处理严重程度。这些检查比任意文本记账更有结构，但没有在该入口执行所写命令，也没有判断证据是否蕴含结论或验证工具输出本身正确。另有工具描述及模型流拦截与重试行为，会影响模型呈现与调用，不能把拒绝减少等同于授权成立、风险降低或事实正确。应由独立审核者核对原件、目标及真实复现。

#### 证据与依据

**依据 1 · 源码核查**：[packages/helmd/src/tools/caseflow.ts:227-248](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/tools/caseflow.ts#L227-L248)

发现输入与严重程度规则说明。

<details>
<summary>查看原文（22行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'record_finding',
    description:
      'Register a finding in the case register (findings.json + findings.md). severity is required; CVSS (when given) is ' +
      'authoritative and the asserted value is kept for audit. critical/high need >= 2 evidence ids and non-unverified ' +
      'confidence, otherwise the severity is downgraded. Identical vuln_class+target+title merges into the existing finding. ' +
      'Every evidence id is validated; citing unknown ids or self-authored evidence is rejected.',
    parameters: {
      title: { type: 'string', required: true, description: 'Finding title, e.g. "License check is a plaintext base64 compare".' },
      detail: { type: 'string', required: true, description: 'What was found, how it was observed, and the impact.' },
      evidence_ids: { type: 'array', items: { type: 'string' }, required: true, description: 'e.g. ["E-002","E-005"].' },
      repro_cmd: { type: 'string', required: true, description: 'Reusable command/tool call that reproduces the conclusion.' },
      severity: {
        type: 'string',
        required: true,
        description: `One of: ${FINDING_SEVERITIES.join(' | ')}. critical/high require >= 2 evidence ids.`,
      },
      vuln_class: { type: 'string', description: 'Vulnerability class, e.g. auth-bypass / xss / license-bypass; used for dedup.' },
      target: { type: 'string', description: 'Affected target/endpoint/file; used for dedup.' },
      confidence: { type: 'string', description: `One of: ${FINDING_CONFIDENCES.join(' | ')} (default probable). unverified caps severity at medium.` },
      cvss: { type: 'number', description: 'CVSS v3 score 0-10; when supplied it overrides severity by the standard bands.' },
      status: { type: 'string', description: `Initial triage state: ${FINDING_STATUSES.join(' | ')} (default verified after the gates).` },
```

</details>

**依据 2 · 源码核查**：[packages/helmd/src/tools/caseflow.ts:264-278](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/tools/caseflow.ts#L264-L278)

检查活动案例、编号和非空命令。

<details>
<summary>查看原文（15行）</summary>

```text
      exec?: ExecLike,
    ) {
      const active = getCase(exec?.agent?.id)
      if (!active) return 'No active case. begin_case() first — findings need an evidence chain.'
      const check = await validateEvidenceIds(active.dir, args.evidence_ids ?? [])
      if (!check.ok) {
        return [
          `REJECTED — unknown evidence ids: ${check.missing.join(', ')}`,
          `known ids: ${check.known.join(', ') || '(none)'}`,
          'Cite only ids that exist in evidence/. Run the tool that produces the proof first.',
        ].join('\n')
      }
      if ((args.repro_cmd ?? '').trim() === '') {
        return 'REJECTED — repro_cmd is required: a finding without a reproducible command is not a conclusion.'
      }
```

</details>

**依据 3 · 源码核查**：[packages/helmd/src/tools/caseflow.ts:279-306](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/tools/caseflow.ts#L279-L306)

可配置的工具证据与文档调用检查。

<details>
<summary>查看原文（28行）</summary>

```text
      // Anti-pretence gates. The model can CLAIM it read references or ran a
      // tool; these checks read the actual evidence filenames (produced by the
      // persisting wrapper) and the session's real tool/call trace instead.
      const discipline = loadSettings().advisory
      if (discipline.requireToolEvidence) {
        const onDisk = await listEvidence(active.dir)
        const byId = new Map(onDisk.map((entry) => [entry.id, entry.file]))
        const citedFiles = (args.evidence_ids ?? []).map((id) => byId.get(id)).filter((file): file is string => file !== undefined)
        // `manual_` is the reserved prefix save_evidence stamps on every
        // model-authored capture, so a spoofed label can never pass as tool output.
        const selfAuthored = /^E-\d+-(manual_|save_evidence|team_report)/
        if (!citedFiles.some((file) => !selfAuthored.test(file))) {
          return [
            'REJECTED — every cited evidence id is self-authored (save_evidence/team_report).',
            `cited: ${citedFiles.join(', ') || '(none)'}`,
            'Run a real analysis tool first; its output is auto-captured as evidence with the tool name in the filename.',
          ].join('\n')
        }
      }
      if (discipline.requireDocRead) {
        const calls = toolCalls(sessionEvents(exec?.agent as unknown as Parameters<typeof sessionEvents>[0], 'caseflow'))
        if (!calls.some((call) => call.name === 'read_reference')) {
          return [
            'REJECTED — no read_reference call found in this session\'s real tool trace.',
            'Call route_task(goal) and then read_reference(<matched refs>) before recording a conclusion;',
            'the claim "I read the docs" is not evidence.',
          ].join('\n')
        }
```

</details>

**依据 4 · 源码核查**：[packages/helmd/src/tools/caseflow.ts:308-320](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/tools/caseflow.ts#L308-L320)

写入用户提供的发现与命令。

<details>
<summary>查看原文（13行）</summary>

```text
      try {
        const recorded = await recordFinding(active.dir, {
          title: args.title,
          detail: args.detail,
          evidenceIds: args.evidence_ids ?? [],
          severity: args.severity as FindingSeverity,
          vulnClass: args.vuln_class,
          target: args.target,
          confidence: args.confidence as FindingConfidence | undefined,
          cvss: typeof args.cvss === 'number' ? args.cvss : undefined,
          status: args.status as FindingStatus | undefined,
          repro: args.repro_cmd,
        })
```

</details>

**依据 5 · 源码核查**：[packages/helmd/src/index.ts:32-38](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/index.ts#L32-L38)

描述改写与证据包装的注册顺序。

```text
export function apply(ctx: Context): void {
  // Description wash FIRST: normalize any "denial is final" tool wording before
  // any domain tool registers (defensive layer — current helmd descriptions are clean).
  const unwash = applyDescriptionWash(ctx)
  // Persistence wrap FIRST: every later-registered domain tool gains
  // evidence persistence without per-tool edits (soft gate).
  const unwrap = applyPersistenceWrap(ctx)
```

**依据 6 · 源码核查**：[packages/helmd/src/llm-stream-hook.ts:1-18](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/llm-stream-hook.ts#L1-L18)

模型流拦截和重试机制概述。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * LLM Stream Refusal Interception & Retry Hook
 *
 * Single `llm/stream` listener owning the retry loop. The host hands the
 * waterfall a DEEP-FROZEN request (dsh-agent-loop buildRequest freezes the
 * request object, the message array and every message), so mutating the
 * outbound request in place is impossible — assignment throws "Cannot assign
 * to read only property". Each retry therefore re-enters the `llm` service
 * with a request object this plugin owns:
 *
 *   monitoring (inbound)  — buffers the first window of reasoning/content deltas,
 *                           aborts refusal streams before they finish;
 *   re-entry  (outbound)  — on refusal, builds an unfrozen request copy with
 *                           laundered history + prefill carrier + refusal
 *                           stop-strings and calls `llm.stream(nested)`; the
 *                           nested dispatch re-runs this listener (marked via
 *                           `__helmdAttempt`), so the ladder recurses with a
 *                           hard budget of MAX_RETRIES.
```

</details>

#### 缺口

- 未对实际记录做独立复现或调用级权限测试
  **影响**：编号、轨迹与非空命令无法证明事实或授权
  **进一步探讨**：在隔离授权样本中逐条回读完整原件并独立复现。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动健康检查会否写配置，失败后有什么恢复条件？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包默认入口是 health，bundle 同时包含生成的 preset。健康检查比较宿主标准 preset 的摘要与部署文件；策略默认 auto，仅对带生成指纹且被判定为 STALE 或 HOST_UPGRADED 的状态修复，off 不写，force 扩大修复范围。修复先尝试复制 .bak，但复制失败被吞掉仍继续调用生成器；成功提示需重启并核对宿主加载，不能把“已修复”当作备份完整或重启验收。重生成和任何部分写入失败都可能要求用户从独立备份恢复。

#### 证据与依据

**依据 1 · 源码核查**：[packages/helmd/package.json:22-35](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/package.json#L22-L35)

包默认 health 入口与 Agent 导出。

<details>
<summary>查看原文（14行）</summary>

```text
    "malware-analysis",
    "ai-security"
  ],
  "main": "dist/health.js",
  "types": "dist/health.d.ts",
  "exports": {
    ".": {
      "types": "./dist/health.d.ts",
      "default": "./dist/health.js"
    },
    "./agent": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
```

</details>

**依据 2 · 源码核查**：[packages/helmd/package.json:59-68](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/package.json#L59-L68)

bundle 引用 preset。

<details>
<summary>查看原文（10行）</summary>

```text
    "prepublishOnly": "node ../../scripts/verify-pack.mjs --require-sealed"
  },
  "dsh": {
    "bundle": {
      "patch": [
        "./cordis.patch.yml",
        "./preset.generated.patch.yml"
      ]
    },
    "client": {
```

</details>

**依据 3 · 源码核查**：[packages/helmd/src/health.ts:152-175](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/health.ts#L152-L175)

默认、关闭、强制策略与状态范围。

<details>
<summary>查看原文（24行）</summary>

```text
 * Drift-repair policy:
 *   unset → repair a deployed preset that carries our fingerprint header (provenance is
 *           provable: it is an artifact we generated), and only report one without a
 *           header (it may be hand-written, so overwriting it is the user's call);
 *   `0`   → never write — escape hatch for a locked-down or hand-managed deployment;
 *   `1`   → repair every healable status, header or not.
 * A repair keeps the previous file as `.bak` first. Restarting dsh and asserting the
 * catalog (MAINTENANCE §8) stays the user's step: this only re-syncs the file.
 */
function healPolicy(): 'auto' | 'off' | 'force' {
  const flag = process.env.HELMD_AUTO_HEAL?.trim().toLowerCase()
  if (flag === '0' || flag === 'false' || flag === 'no') return 'off'
  if (flag === '1' || flag === 'true' || flag === 'yes') return 'force'
  return 'auto'
}

/** Statuses whose deployed file carries the gen-preset header, i.e. provably our artifact. */
const DERIVED_STATUSES = new Set(['STALE', 'HOST_UPGRADED'])

function shouldRepair(status: string, policy: 'auto' | 'off' | 'force'): boolean {
  if (policy === 'off') return false
  if (policy === 'force') return true
  return DERIVED_STATUSES.has(status)
}
```

</details>

**依据 4 · 源码核查**：[packages/helmd/src/health.ts:266-295](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/health.ts#L266-L295)

尽力备份、调用生成器和重启提示。

<details>
<summary>查看原文（30行）</summary>

```text
/**
 * Regenerate this package's preset patch from the installed host standard. The caller has
 * already decided (via {@link shouldRepair}) that writing is allowed; this only performs it
 * and keeps the previous file as `.bak` first.
 */
function autoHealPreset(): { healed: boolean; verdict: string } {
  const gen = resolveGenerator()
  if (gen === null) return { healed: false, verdict: 'unavailable (no generator)' }
  const target = presetPatchPath()
  if (target === '') return { healed: false, verdict: 'failed (preset patch path is unresolved)' }
  try {
    if (existsSync(target)) {
      try {
        copyFileSync(target, `${target}.bak`)
      } catch {
        // A failed backup must not block the repair; the exit status below still reports it.
      }
    }
    const res = spawnSync(process.execPath, [gen, '--out', target], {
      encoding: 'utf8',
      timeout: 60_000,
    })
    if (res.status !== 0) {
      const why = String(res.stderr || res.error?.message || '').trim().split('\n').slice(-1)[0] ?? ''
      return { healed: false, verdict: `failed (exit ${String(res.status)}${why ? `: ${why}` : ''})` }
    }
    const anchor = process.platform === 'win32' ? '[pwsh, read]' : '[bash, read]'
    return { healed: true, verdict: `restart dsh and assert the first request is ${anchor} (MAINTENANCE §8)` }
  } catch (e) {
    return { healed: false, verdict: `failed (${(e as Error).message})` }
```

</details>

**依据 5 · 源码核查**：[packages/helmd/src/health.ts:384-399](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/health.ts#L384-L399)

检查、按策略修复与再次评估。

<details>
<summary>查看原文（16行）</summary>

```text
export function evaluateHealth(): HelmdHealth {
  const first = evaluateHealthCore()
  if (!HEALABLE.has(first.status)) return first
  const policy = healPolicy()
  if (!shouldRepair(first.status, policy)) {
    first.autoHeal = reportOnlyVerdict(first.status, policy)
    return first
  }
  const outcome = autoHealPreset()
  if (!outcome.healed) {
    first.autoHeal = outcome.verdict
    return first
  }
  const healed = evaluateHealthCore()
  healed.autoHeal = `healed (${first.status} → ${healed.status}) — ${artifactVerdict(healed)}; ${outcome.verdict}`
  return healed
```

</details>

#### 缺口

- 没有执行健康修复、备份失败或重启验收
  **影响**：不能确认实际部署中的写入、备份及加载结果
  **进一步探讨**：先独立备份隔离 profile，模拟缺备份权限和生成失败后回读。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么情况下应暂停使用并退回手工证据流程？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

该组件需要兼容 DSH、Node、工具与系统提示服务；域分析还可能依赖解释器和外部程序。runSeam 优先使用宿主 subprocess，缺少时回退 Node 本地进程，因此需先核清部署的执行权限和被调用工具，不应由插件名称推断边界。建议先观察，不把它接入重要安全交付；先确认授权、审查提示及脚本、独立备份 preset，并使用隔离样本比对原始证据与案例记录。若证据被截断、目标或授权不清、自动写入无法恢复或发现缺少独立复现，应停止该流程并回到手工证据表。模型、工具和人工复核费用及时间均未知。

#### 证据与依据

**依据 1 · 源码核查**：[packages/helmd/package.json:70-89](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/package.json#L70-L89)

宿主 peer 与 Node 版本。

<details>
<summary>查看原文（20行）</summary>

```text
      "inject": [
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-sidebar-right"
      ]
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.2",
    "@deepseek-ai/dsh-settings": ">=0.1.5-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.2.2-0",
    "@deepseek-ai/dsh-tools": ">=0.1.5-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.2.2-0",
    "@deepseek-ai/schemastery": "^3.18.2"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "^4.0.2",
    "@deepseek-ai/dsh-settings": ">=0.1.5-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.2.2-0",
    "@deepseek-ai/dsh-tools": ">=0.1.5-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.2.2-0",
    "@deepseek-ai/schemastery": "^3.18.2"
  },
  "engines": {
    "node": ">=22.19.0"
```

</details>

**依据 2 · 源码核查**：[packages/helmd/src/index.ts:24-25](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/index.ts#L24-L25)

工具和系统提示依赖。

```text
export const name = 'helmd'
export const inject = ['tools', 'systemPrompt']
```

**依据 3 · 源码核查**：[packages/helmd/src/seam.ts:154-189](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/seam.ts#L154-L189)

宿主 subprocess 优先和本地回退。

<details>
<summary>查看原文（36行）</summary>

```text
/**
 * Prefer the ctx.subprocess capability seam; fall back to a local Node
 * spawn when the host has no provider.
 */
export async function runSeam(ctx: Context, argv: string[], cwd: string): Promise<string> {
  const program = await resolveCommand(ctx, argv[0])
  const resolvedArgv = [program, ...argv.slice(1)]
  const subprocess = ctx.get('subprocess')
  if (subprocess != null && typeof subprocess.spawn === 'function') {
    const handle = subprocess.spawn({
      argv: resolvedArgv,
      cwd,
      stdio: {
        stdin: 'ignore',
        stdout: { maxBytes: MAX_OUTPUT_BYTES, spill: { maxBytes: MAX_OUTPUT_BYTES * 8 } },
        stderr: { maxBytes: MAX_OUTPUT_BYTES },
      },
      graceMs: GRACE_MS,
      env: { PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8' },
    }) as SubprocessHandleLike
    const outcome = await handle.done
    const out = handle.collected?.stdout?.readFrom(0)?.text ?? ''
    const err = handle.collected?.stderr?.readFrom(0)?.text ?? ''
    if (outcome.exitCode !== 0) {
      throw new Error(`${program} exited with code ${outcome.exitCode}${err ? `: ${err.trim()}` : ''}`)
    }
    return out
  }
  try {
    const { stdout } = await execFileAsync(resolvedArgv[0], resolvedArgv.slice(1), {
      cwd,
      maxBuffer: MAX_OUTPUT_BYTES,
      timeout: GRACE_MS,
      env: { ...process.env, PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8' },
    })
    return stdout
```

</details>

**依据 4 · 源码核查**：[packages/helmd/src/case.ts:250-258](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/case.ts#L250-L258)

长输出截断。

```text
  const id = await nextEvidenceId(caseDir)
  const safeTool = toolLabel.replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 40) || 'output'
  const capped = content.length > 256 * 1024
    ? content.slice(0, 256 * 1024) + `\n[truncated at 256KB; full length ${content.length}]\n`
    : content
  const path = join(caseDir, 'evidence', `${id}-${safeTool}.txt`)
  await writeFile(path, capped, 'utf8')
  await appendTimeline(caseDir, `${toolLabel} → ${id} — ${summary.slice(0, 80)}`)
  return { id, path, sha256: sha }
```

**依据 5 · 源码核查**：[packages/helmd/src/health.ts:271-293](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/health.ts#L271-L293)

备份与修复边界。

<details>
<summary>查看原文（23行）</summary>

```text
function autoHealPreset(): { healed: boolean; verdict: string } {
  const gen = resolveGenerator()
  if (gen === null) return { healed: false, verdict: 'unavailable (no generator)' }
  const target = presetPatchPath()
  if (target === '') return { healed: false, verdict: 'failed (preset patch path is unresolved)' }
  try {
    if (existsSync(target)) {
      try {
        copyFileSync(target, `${target}.bak`)
      } catch {
        // A failed backup must not block the repair; the exit status below still reports it.
      }
    }
    const res = spawnSync(process.execPath, [gen, '--out', target], {
      encoding: 'utf8',
      timeout: 60_000,
    })
    if (res.status !== 0) {
      const why = String(res.stderr || res.error?.message || '').trim().split('\n').slice(-1)[0] ?? ''
      return { healed: false, verdict: `failed (exit ${String(res.status)}${why ? `: ${why}` : ''})` }
    }
    const anchor = process.platform === 'win32' ? '[pwsh, read]' : '[bash, read]'
    return { healed: true, verdict: `restart dsh and assert the first request is ${anchor} (MAINTENANCE §8)` }
```

</details>

#### 缺口

- 未核所有脚本、目标权限和真实恢复成本
  **影响**：不能断言适合重要交付或有净节时
  **进一步探讨**：在获得授权的隔离环境比对执行权限和独立证据表。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 把可审证据与行为干预拆开能否改善结果可信度？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

未验证假设是单独提供可选择的留证层，保留原始完整输出及其摘要，并要求发现关联具体摘录和独立复核，再将模型行为设置作为独立可审选择。相较当前编号、命令文本与工具轨迹检查，潜在增量是更容易核对证据是否支持结论，但增加存储、隐私与审核负担；如果手工日志和独立审核已同样可靠或额外流程增加错误，则不推广。应以同一批授权样本比较原始证据完整性、错误结论通过率与审核人时；当前没有原型或效果数据。

#### 证据与依据

**依据 1 · 源码核查**：[packages/helmd/src/persist.ts:69-87](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/persist.ts#L69-L87)

实际字符串留存路径。

<details>
<summary>查看原文（19行）</summary>

```text
async function persistHook(
  sessionId: string | undefined,
  toolName: string,
  result: unknown,
  agent: unknown,
): Promise<unknown> {
  if (typeof result !== 'string') return result
  const active = getCase(sessionId)
  if (!active) {
    return result + '\n[no active case — output NOT persisted. begin_case(goal, samples) keeps evidence.]'
  }
  const firstLine = result.split('\n').find((l) => l.trim()) ?? ''
  const { id } = await saveEvidence(active.dir, toolName, result, firstLine)
  try {
    await nudgeCaseState(sessionId, agent, active)
  } catch {
    // The nudge is best-effort; a case/ledger read failure must not break the tool result.
  }
  return result + `\n[evidence: ${id} saved to ${active.name}]`
```

</details>

**依据 2 · 源码核查**：[packages/helmd/src/case.ts:232-258](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/case.ts#L232-L258)

原始输出摘要和截断存储。

<details>
<summary>查看原文（27行）</summary>

```text
export async function saveEvidence(
  caseDir: string,
  toolLabel: string,
  content: string,
  summary: string,
): Promise<{ id: string; path: string; sha256: string; dedup?: string }> {
  const sha = createHash('sha256').update(content, 'utf8').digest('hex')
  // Dedup: if an evidence file with the same content hash exists, return it.
  const files = await readdir(join(caseDir, 'evidence')).catch(() => [] as string[])
  for (const f of files) {
    if (!/^E-\d{3,}-/.test(f)) continue
    const existing = await readFile(join(caseDir, 'evidence', f), 'utf8').catch(() => '')
    const existingSha = createHash('sha256').update(existing, 'utf8').digest('hex')
    if (existingSha === sha) {
      const existingId = /^E-(\d{3,})-/.exec(f)?.[1]
      if (existingId) return { id: `E-${existingId}`, path: join(caseDir, 'evidence', f), sha256: sha, dedup: `E-${existingId}` }
    }
  }
  const id = await nextEvidenceId(caseDir)
  const safeTool = toolLabel.replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 40) || 'output'
  const capped = content.length > 256 * 1024
    ? content.slice(0, 256 * 1024) + `\n[truncated at 256KB; full length ${content.length}]\n`
    : content
  const path = join(caseDir, 'evidence', `${id}-${safeTool}.txt`)
  await writeFile(path, capped, 'utf8')
  await appendTimeline(caseDir, `${toolLabel} → ${id} — ${summary.slice(0, 80)}`)
  return { id, path, sha256: sha }
```

</details>

**依据 3 · 源码核查**：[packages/helmd/src/tools/caseflow.ts:264-278](https://github.com/ADWMC/helm-d/blob/1e6b954dd290267ce330e19cea6368f7d2184683/packages/helmd/src/tools/caseflow.ts#L264-L278)

现有编号与命令文本检查。

<details>
<summary>查看原文（15行）</summary>

```text
      exec?: ExecLike,
    ) {
      const active = getCase(exec?.agent?.id)
      if (!active) return 'No active case. begin_case() first — findings need an evidence chain.'
      const check = await validateEvidenceIds(active.dir, args.evidence_ids ?? [])
      if (!check.ok) {
        return [
          `REJECTED — unknown evidence ids: ${check.missing.join(', ')}`,
          `known ids: ${check.known.join(', ') || '(none)'}`,
          'Cite only ids that exist in evidence/. Run the tool that produces the proof first.',
        ].join('\n')
      }
      if ((args.repro_cmd ?? '').trim() === '') {
        return 'REJECTED — repro_cmd is required: a finding without a reproducible command is not a conclusion.'
      }
```

</details>

#### 缺口

- 没有独立证据层原型与比较实验
  **影响**：不能证明提高可信度或降低总成本
  **进一步探讨**：以隔离样本盲审原始日志与候选完整证据，统计错误通过及时间。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
