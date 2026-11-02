# DSH Research Report

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[d850f06](https://github.com/PerryLink/dsh-research-report/tree/d850f067c320ab1f8eaae243e19714d644961e1b)

<!-- BEGIN META -->
[![GitHub ★ 213](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=213&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-research-report) [![npm 30d 5,581](https://img.shields.io/static/v1?label=npm+30d&message=5%2C581&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-research-report) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-research-report)
<!-- END META -->

> **功能**：以证据快照、claim 绑定、字节核验和 manifest 哈希生成版本化研究报告。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将快照/claim/字节判据/反证与报告seal串联，提供可回查工程交付。

> **主要限制**：[Q03](#research-q03) substring verified非事实支持且段落可不绑定；核心ok不合claimChecks而CLI信封合；[Q04](#research-q04)后台killed不证明封存停写。

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
  - [Q01 · 可验证报告比Markdown加hash多什么？](#detail-section-11)
  - [Q02 · 快照、再审、封存的真实链是什么？](#detail-section-12)
  - [Q03 · verified、DOI与全报告核验可解释到哪一层？](#detail-section-13)
  - [Q04 · 数据/网络、作业和退出的负担？](#detail-section-14)
  - [Q05 · 怎么试用，下一步假设怎样被推翻？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：研究者和上游插件需要可移交/复算的材料与claim核验日志。

Markdown+手工引用/hash脚本；插件增加关系/日志与模型工具协议，非语义事实鉴定。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 内容快照ledger | 保存/读验材料字节 | 不认证来源真实/主机可信 |
| claim字面核验 | 数字/引文可定位 | 非语义支持/全段覆盖 |
| 封存与反证日志 | 回溯版本/漂移 | 多文件非事务，外存seal |
| verifier CLI | 复核hash/字节判据 | 缺ledger跳过，缺seal不比较 |
| 作业/note | 后台交付/确定性复验 | killed非停止，非独立模型审阅 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node^22.19或>=24/匹配DSH | 必需 | 服务/三工具 | lib/Host兼容未验 |
| ledger/report目录与权限 | 必需 | 快照/封存 | 非自动会话隔离 |
| ctx.web/jobs/dataQuality | 可选 | URL/gather/后台/数据桥 | 影响路径明确失败/未核 |
| 原文人工语义核查/外存seal | 采用前提 | 真支持/可信比对 | 自重算不证事实或作者 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 登记 | 用户/Agent给原件或捕获 | 内容/来源/权限清楚 |
| 绑定 | Agent列claim与段落引用 | 人工核覆盖/语义 |
| 封存 | 引擎再审/写包 | 核日志/外存seal |
| 复核 | CLI给ledger和expected seal | 区分skipped/不比较 |
| 异常退出 | 等在途核最终目录 | 不把killed当无写，保原包 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 原件/宿主/目录 | 权限/版本/外部seal治理 | 工时未知 |
| 持续 | 快照/日志/版本；可选web/模型 | 语义与覆盖审查 | 存储/价格/延迟未测 |
| 失败恢复 | 不完整包/重验 | 对账ledger/目录/后台 | 多文件非事务 |
| 退出 | 材料仍保留 | 等在途/导出/授权清理 | 停用不撤销写入 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 材料完整性 | hash/读验/外部seal比较入口 | 来源真实性/主机攻击 |
| 引用字面 | 数字/引文presence | 单位/主体/语义 |
| 报告覆盖 | 已填claim绑定检查 | 无claim段落真实性 |
| 恢复复核 | CLI/日志/机器note | 强退/取消最终状态和净节时 |

> **思考**：[Q03](#research-q03) substring verified非事实支持且段落可不绑定；核心ok不合claimChecks而CLI信封合；[Q04](#research-q04)后台killed不证明封存停写。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将快照/claim/字节判据/反证与报告seal串联，提供可回查工程交付。

[Q02](#research-q02) hash读验/ID冲突/漂移阻seal和负知识真实存在；事后note/job标签不等独立模型review或事务完成。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) substring verified非事实支持且段落可不绑定；核心ok不合claimChecks而CLI信封合；[Q04](#research-q04)后台killed不证明封存停写。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 公开非敏感副本试字节回溯，外存seal并人工审所有段落/语义；不符停发布回手工对账。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持快照/字节封存机制，未执行目标/CLI/模型；限定公开材料人工语义验收试用，分层收据未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/service.ts、src/gather.ts、src/doi.ts、src/ledger.ts、src/verify.ts、src/provider-local.ts、src/verify-sealed.ts、src/tools/research-report.ts、src/assemble.ts、src/config.ts、src/cli.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读声明/index/service契约、gather路径捕获、ledger对象/读验、verify全文关键算法、provider注册/核验/封存/job、assemble引用/渲染、CLI和sealed判据；未全审compiled lib/Host/数据桥接/全部journal并发，不执行目标。
- 下一步：对照数字子串/错单位主体/无claim段落、篡改/缺ledger/外部seal、桥接复核差异与后台取消最终文件，记录审者误信与人工成本。

**分析版本**

- **仓库**：[PerryLink/dsh-research-report](https://github.com/PerryLink/dsh-research-report)
- **版本号**：0.3.30（[固定提交 d850f06](https://github.com/PerryLink/dsh-research-report/tree/d850f067c320ab1f8eaae243e19714d644961e1b)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 分开完整性/覆盖/语义/最终状态收据，若文案/手工等效或负担更大即否定。

对照数字子串/错单位主体/无claim段落、篡改/缺ledger/外部seal、桥接复核差异与后台取消最终文件，记录审者误信与人工成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 2485 | — | — | 29695 |
| .md | example | 3 | 38 | — | — | 315 |
| .mjs | source | 10 | 660 | 479 | 133 | — |
| .ts | source | 17 | 4293 | 2888 | 1139 | — |
| .ts | test | 17 | 2510 | 2014 | 264 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/PerryLink/dsh-research-report/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：区分报告封存的字节可回溯性、语义支持、覆盖与执行结果。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 可验证报告比Markdown加hash多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需复核/移交研究材料的用户和上游插件，它提供evidence_add、research_report、ledger_query及researchReport服务，把claim绑定不可变内容快照、重算hash、记录核验并封成版本目录；独立CLI可复核。相对手工Markdown/单文件hash，增加证据-claim关系、可见缺口/反证日志与封存前再审，不是自动深度研究或语义事实鉴定。合格交付须材料可取、外部可信seal可比、结论确受原文支持，三者不能以单一verified替代。

index真实挂service、三工具和工作流prompt，是原生插件。内容存储/哈希为成熟机制，其贡献是把它们接成模型可消费/可回查的协议。已有严谨材料管理和人工引用流程者，也可用简单hash脚本；真实省时/审查准确率未验。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:128-148](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/index.ts#L128-L148)

原生挂载和prompt。

<details>
<summary>查看原文（21行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  const resolved = resolveConfig(config)
  const logger = ctx.logger('research-report')
  if (!resolved.enabled) {
    logger.info('disabled: enabled is false — no service, tools, or prompt section are mounted')
    return
  }

  // Service Provider — the provider registers itself as ctx.researchReport on
  // construction and is unregistered with this fiber (Service base semantics).
  const service = new LocalResearchReportService(ctx, resolved, process.cwd())

  ctx.effect(() => ctx.tools.register(makeEvidenceAddTool(service)), 'research-report: evidence_add tool')
  ctx.effect(() => ctx.tools.register(makeResearchReportTool({ ctx, service })), 'research-report: research_report tool')
  ctx.effect(() => ctx.tools.register(makeLedgerQueryTool(service)), 'research-report: ledger_query tool')

  ctx.systemPrompt.section({
    name: 'dsh-research-report:workflow',
    order: 10,
    text: PROMPT_SECTION,
  })
```

</details>

**依据 2 · 源码核查**：[package.json:1-24](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/package.json#L1-L24)

引擎与独立CLI。

<details>
<summary>查看原文（24行）</summary>

```text
{
  "name": "dsh-research-report",
  "version": "0.3.30",
  "description": "Verifiable research-report engine for DeepSeek Harness: a content-addressed evidence ledger (claim — snapshot binding, tamper-evident) plus versioned sealed reports where every claim carries a verification verdict and the manifest hash seals the directory. Retrieval orchestration reuses the official ctx.web / ctx.jobs seams — no deep-research loop.",
  "author": "dsh-research-report contributors",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/PerryLink/dsh-research-report.git"
  },
  "homepage": "https://github.com/PerryLink/dsh-research-report#readme",
  "bugs": {
    "url": "https://github.com/PerryLink/dsh-research-report/issues"
  },
  "private": false,
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/types/index.d.ts",
  "bin": {
    "dsh-research-verify": "./lib/cli.js"
  },
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
```

</details>

**依据 3 · 源码核查**：[README.md:75-88](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/README.md#L75-L88)

作者能力与不做deep loop。

<details>
<summary>查看原文（14行）</summary>

```text
- **Evidence ledger** — a content-addressed snapshot store (`<ledgerRoot>/objects/<sha256>` + JSONL journals). The same content is stored exactly once; snapshots are immutable; every read recomputes the hash, so tampering or deletion is detected instead of trusted.
- **Claim ↔ evidence binding** — claims register with the evidence ids they rely on; the ledger keeps the binding and every verification verdict (latest wins).
- **Byte-level verification** — every number and quoted span in a claim must be locatable verbatim in the bound snapshots. No bound evidence, or no checkable literal, marks the claim `unverified`; bound evidence that cannot confirm or deny the claimed literals marks it `insufficient`; a label whose snapshot value differs (the claimed value absent) marks it `disproven`; tampered/missing snapshots mark it `contradicted`. No semantics, no embeddings — auditable byte checks.
- **Optional numeric bridge** — when a claim cites a structured workspace dataset (CSV/JSON) and `dsh-data-quality` is mounted, citations are cross-checked with tolerances through its frozen `verifyCitations` contract; a dataset mismatch disproves the claim.
- **DOI evidence (zero network)** — DOI origins are validated deterministically (`10.xxxx/xxxx` structure, a prefix whitelist, and a DOI character set); invalid DOIs fail loud. Optional journal/year metadata is accepted, and `requireJournalMetadata` gates academic DOI evidence only when enabled.
- **Versioned sealed reports** — `<reportRoot>/<slug(topic)>/<YYYYMMDD-HHmmss>/report.md` + `manifest.json` + `verification.jsonl` + `disconfirmation.jsonl`; the seal hash is the SHA-256 of the manifest, which itself carries the report hash, every evidence hash, and the hash of each audit journal.
- **Pre-delivery re-audit & seal interception** — before sealing, every bound claim is re-verified offline and journaled to `verification.jsonl`; verdict drift, tampered/missing bound evidence, or a journal serialization failure blocks the seal (fail loud, no tunable).
- **Falsification ledger** — every contradicted or disproven claim is recorded in `disconfirmation.jsonl` (claim + evidence references + reason) and listed in the report's `falsification log` appendix.
- **Negative knowledge** — a disproven claim is remembered by its content hash (`disproofs.jsonl`); the same text re-reported against unchanged evidence is forced back to `disproven` and only re-verifies once the evidence changes.
- **Read-only verifier loop** — after sealing, a deterministic `verifySealedReport` fallback (zero network, zero model) recomputes the seal and audit hashes and re-checks every claim, writing the machine check to `verifier-note.md`; when `ctx.jobs` is mounted a read-only verifier job is also spawned (the model review is an enhancement, never a replacement).
- **Standalone verifier CLI** — `dsh-research-verify --report <dir> [--seal <sha256>] [--ledger <dir>] [--format json|sarif]` recomputes the seal hash + per-claim re-checks from the sealed directory alone and prints a JSON envelope or a SARIF 2.1.0 document (see [Verifier CLI](#verifier-cli)).
- **Session-anchored evidence** — `evidence_add` accepts an optional `sessionRef` (`sessionId` + `eventRange`, validated loud); the anchor is stored, rendered in Appendix B, and registered in the manifest and `verification.jsonl`. Session-anchored evidence verifies honestly as `unverified` (`session-anchored evidence requires a manual check against the session log`).
- **Honest gaps** — unverified, insufficient, contradicted, and disproven claims keep a visible `[未核实]` / `[证据不足]` / `[与证据矛盾]` / `[已证伪]` marker in the report body and are listed in Appendix A. Nothing is silently passed.
- **No deep-research loop** — retrieval orchestration is deliberately reused: `ctx.web` for search/fetch, `ctx.jobs` for long runs. Planning and synthesis stay with the model (or an upstream plugin).
```

</details>

#### 缺口

- 与手工材料/hash的复核任务对照未验。
  **影响**：不能证明交付更准确或更省时。
  **进一步探讨**：同材料交给盲审者比较定位原件、发现篡改和解释缺口时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 快照、再审、封存的真实链是什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

文件/URL捕获后addEvidence限内容尺寸并验DOI/sessionRef形状，ledger按内容hash对象存储/ID冲突拒绝，临时rename落对象，readContent每次重算hash。assemble校验引用、登记claim并读原快照核字节；已有verified退化、缺/坏对象或审计序列化失败会阻seal。已有反证相同文本/证据保持disproven，负知识不是空口号。

报告/manifest/两日志按顺序写入新目录，manifest封report和日志hash，逻辑不可变而非文件系统不可写。成功后机器verifier重算并写note，失败记录note而不撤销已写seal；不等每次成功输出都有外部验收。可选“Model review”job真实只是再跑同一deterministic verifier并附note，没有模型调用，不能据标题认独立审阅。进程内ledger队列有序，但报告多文件非单一事务，强退/磁盘失败会留不完整目录；外部可信seal应另存，若所有文件与manifest一起被改而无外部期望hash，仅自重算无法认证原作者。

#### 证据与依据

**依据 1 · 源码核查**：[src/gather.ts:85-124](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/gather.ts#L85-L124)

真实URL/文件捕获。

<details>
<summary>查看原文（40行）</summary>

```text
export async function captureFromWeb(deps: CaptureDeps, url: string, signal?: AbortSignal): Promise<CapturedSnapshot> {
  if (deps.web === undefined) {
    throw new CaptureError(
      'WEB_UNAVAILABLE',
      'the web capability (ctx.web) is not mounted in this composition; pass `content` explicitly or load @deepseek-ai/dsh-web with a fetch provider',
    )
  }
  const timeout = AbortSignal.timeout(deps.fetchTimeoutMs)
  const linked = signal === undefined ? timeout : AbortSignal.any([signal, timeout])
  let result
  try {
    result = await deps.web.fetch({ url }, linked)
  } catch (error) {
    if (timeout.aborted && (signal === undefined || !signal.aborted)) {
      throw new CaptureError('FETCH_TIMEOUT', `fetch of ${url} exceeded the configured fetchTimeoutMs ${deps.fetchTimeoutMs}`)
    }
    const message = error instanceof Error ? error.message : String(error)
    throw new CaptureError('FETCH_FAILED', `fetch of ${url} failed: ${message}`)
  }
  if (result.statusCode < 200 || result.statusCode >= 300) {
    throw new CaptureError('FETCH_STATUS', `fetch of ${url} returned HTTP ${result.statusCode}; no snapshot captured`)
  }
  return { content: result.body.content, origin: result.url }
}

/**
 * Capture one workspace file snapshot.
 * @param deps - workspace root (the web fields are unused here).
 * @param origin - the workspace-relative path.
 * @returns the snapshot (throws {@link CaptureError} when unreadable).
 */
export async function captureFromFile(deps: CaptureDeps, origin: string): Promise<CapturedSnapshot> {
  const absolute = resolveWorkspacePath(deps.workspaceRoot, origin)
  let content: string
  try {
    content = await readFile(absolute, 'utf8')
  } catch (error) {
    throw new CaptureError('ORIGIN_UNREADABLE', `cannot read ${JSON.stringify(origin)}: ${(error as Error).message}`)
  }
  return { content, origin: toWorkspaceRelative(deps.workspaceRoot, absolute) }
```

</details>

**依据 2 · 源码核查**：[src/provider-local.ts:324-359](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/provider-local.ts#L324-L359)

尺寸/DOI/sessionRef与ledger注册。

<details>
<summary>查看原文（36行）</summary>

```text
  async addEvidence(input: AddEvidenceInput, session?: Session): Promise<{ record: EvidenceRecord; deduplicated: boolean }> {
    const bytes = Buffer.byteLength(input.content, 'utf8')
    if (bytes > this.config.maxEvidenceBytes) {
      throw new ResearchReportError(
        'EVIDENCE_TOO_LARGE',
        `evidence content is ${bytes} bytes, above the configured maxEvidenceBytes ${this.config.maxEvidenceBytes}`,
      )
    }
    if (isDoiOrigin(input.origin)) {
      const validation = validateDoi(input.origin)
      if (!validation.valid) {
        throw new ResearchReportError('INVALID_DOI', `invalid DOI: ${validation.reason}`)
      }
      if (this.config.requireJournalMetadata && (input.journal === undefined || input.journal.trim() === '' || input.year === undefined || input.year.trim() === '')) {
        throw new ResearchReportError(
          'MISSING_JOURNAL_METADATA',
          `DOI evidence "${input.origin}" requires a journal name and publication year (requireJournalMetadata is enabled)`,
        )
      }
    }
    if (input.sessionRef !== undefined) {
      validateSessionRef(input.sessionRef)
    }
    const capturedAt = input.capturedAt ?? new Date().toISOString()
    let outcome
    try {
      outcome = await this.ledger.putEvidence({
        ...(input.id === undefined ? {} : { id: input.id }),
        title: input.title,
        origin: input.origin,
        content: input.content,
        capturedAt,
        ...(input.journal === undefined ? {} : { journal: input.journal }),
        ...(input.year === undefined ? {} : { year: input.year }),
        ...(input.sessionRef === undefined ? {} : { sessionRef: input.sessionRef }),
      })
```

</details>

**依据 3 · 源码核查**：[src/ledger.ts:180-204](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/ledger.ts#L180-L204)

对象临时rename。

<details>
<summary>查看原文（25行）</summary>

```text
  /** Write one snapshot object atomically (tmp + rename); no-op when present. */
  private async writeObject(hash: string, content: string): Promise<void> {
    const target = path.join(this.objectsDir, hash)
    try {
      await readFile(target)
      return // object exists — content-addressed storage is immutable
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw new LedgerError('IO', `cannot stat object ${hash}: ${(error as Error).message}`)
      }
    }
    const temporary = path.join(this.objectsDir, `.${hash}.tmp-${process.pid}-${randomBytes(4).toString('hex')}`)
    await writeFile(temporary, content, 'utf8')
    try {
      await rename(temporary, target)
    } catch (error) {
      // A concurrent writer may have won the rename; the object is identical
      // either way (same hash ⇒ same content), so only non-exists errors matter.
      try {
        await readFile(target)
      } catch {
        throw new LedgerError('IO', `cannot commit object ${hash}: ${(error as Error).message}`)
      }
    }
  }
```

</details>

**依据 4 · 源码核查**：[src/ledger.ts:385-397](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/ledger.ts#L385-L397)

读时重算hash。

<details>
<summary>查看原文（13行）</summary>

```text
  async readContent(id: string): Promise<{ content: string; integrity: 'ok' | 'tampered' | 'missing' } | undefined> {
    const record = await this.getEvidence(id)
    if (record === undefined) return undefined
    let content: string
    try {
      content = await readFile(path.join(this.objectsDir, record.hash), 'utf8')
    } catch (error) {
      // A deleted object degrades to the `missing` integrity state, never an
      // unhandled failure; anything else is loud.
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { content: '', integrity: 'missing' }
      throw new LedgerError('IO', `cannot read object ${record.hash}: ${(error as Error).message}`)
    }
    return { content, integrity: sha256Of(content) === record.hash ? 'ok' : 'tampered' }
```

</details>

**依据 5 · 源码核查**：[src/provider-local.ts:553-583](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/provider-local.ts#L553-L583)

旧ID冲突。

<details>
<summary>查看原文（31行）</summary>

```text
  async assembleDetailed(request: AssembleReportRequest, context?: AssembleContext): Promise<AssembleReportDetail> {
    validateAssembleRequest(request, this.config)

    // Evidence: the ledger is authoritative and immutable. New ids register;
    // an existing id whose incoming content still matches the index is a
    // no-op; a mismatch against an INTACT object is a loud conflict, while a
    // mismatch explained by tampering flows into verification (contradicted).
    const records: EvidenceRecord[] = []
    for (const item of request.evidence) {
      const existing = await this.ledger.getEvidence(item.id)
      if (existing === undefined) {
        const added = await this.addEvidence(
          { id: item.id, title: item.title, origin: item.origin, content: item.content, capturedAt: item.capturedAt },
          context?.session,
        )
        records.push(added.record)
        continue
      }
      const incomingHash = sha256Of(item.content)
      if (incomingHash !== existing.hash) {
        const stored = await this.ledger.readContent(item.id)
        if (stored !== undefined && stored.integrity === 'ok') {
          throw new ResearchReportError(
            'LEDGER',
            `evidence id "${item.id}" is already registered with different content; snapshots are immutable — choose a new id`,
          )
        }
        // Tampered/missing object: verification over the current bytes will
        // produce the contradicted verdict; the index keeps the original hash.
      }
      records.push(existing)
```

</details>

**依据 6 · 源码核查**：[src/provider-local.ts:630-729](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/provider-local.ts#L630-L729)

负知识/漂移和seal拦截。

<details>
<summary>查看原文（100行）</summary>

```text
      if (priorDisproof !== undefined && sameEvidenceSet(priorDisproof.evidenceHashes, evidenceHashes) && fresh.status === 'verified') {
        final = {
          claimId: claim.id,
          status: 'disproven',
          note: `previously disproven against unchanged evidence: ${priorDisproof.note}`,
        }
      } else if (drifted) {
        final = { claimId: claim.id, status: 'contradicted', note: `drift from prior verified verdict: ${fresh.note}` }
      } else {
        final = fresh
      }

      if (drifted) {
        driftCount += 1
        driftedClaims.push(claim.id)
      }
      await this.ledger.recordVerdict(
        { claimId: final.claimId, status: final.status, ...(final.note === undefined ? {} : { note: final.note }) },
        generatedAt,
      )
      appendAudit(context?.session, 'research-report/verify', () => {
        context?.session?.append('research-report/verify', {
          claimId: final.claimId,
          status: final.status,
          ...(final.note === undefined ? {} : { note: final.note }),
          evidenceIds: registration.evidenceIds,
        })
      })
      verdicts.push(final)
      verificationEntries.push({
        claimId: claim.id,
        claimHash,
        evidenceHashes,
        at: generatedAt,
        status: fresh.status,
        priorStatus: prior?.status ?? null,
        drifted,
        ...(sessionRefs.length === 0 ? {} : { sessionRefs }),
      })

      // Record negative knowledge whenever the re-audit explicitly falsifies
      // the claim against its evidence content.
      if (fresh.status === 'disproven') {
        await this.ledger.recordDisproof(
          {
            claimHash,
            claimId: claim.id,
            text: registration.text,
            evidenceHashes: [...evidenceHashes].sort(),
            note: fresh.note ?? 'disproven',
          },
          generatedAt,
        )
      }
    }

    const disconfirmationEntries: DisconfirmationEntry[] = verdicts
      .filter(verdict => verdict.status === 'contradicted' || verdict.status === 'disproven')
      .map(verdict => {
        const claim = requestClaimById.get(verdict.claimId)!
        return {
          claimId: verdict.claimId,
          claimHash: sha256Of(claim.text),
          evidenceIds: claim.evidenceIds,
          evidenceHashes: claim.evidenceIds.map(id => evidenceHashById.get(id)!),
          at: generatedAt,
          status: verdict.status === 'disproven' ? 'disproven' as const : 'contradicted' as const,
          note: verdict.note ?? '',
        }
      })

    // Pre-seal interception: hard re-audit signals block delivery. No tunable —
    // tampering, regression, or an un-journalable audit is never silently sealed.
    const blockedReasons: string[] = []
    if (driftedClaims.length > 0) {
      blockedReasons.push(`verdict drift: ${driftedClaims.map(id => `claim "${id}"`).join(', ')} regressed from a prior verified verdict`)
    }
    const integrityFailures: string[] = []
    for (const record of records) {
      const read = await this.ledger.readContent(record.id)
      if (read !== undefined && read.integrity !== 'ok') {
        integrityFailures.push(`evidence "${record.id}" is ${read.integrity}`)
      }
    }
    if (integrityFailures.length > 0) {
      blockedReasons.push(`bound evidence integrity failure: ${integrityFailures.join('; ')}`)
    }
    const verificationText = serializeJournalOrThrow(
      () => serializeVerificationJournal(verificationEntries),
      'verification journal',
      blockedReasons,
    )
    const disconfirmationText = serializeJournalOrThrow(
      () => serializeDisconfirmationJournal(disconfirmationEntries),
      'disconfirmation journal',
      blockedReasons,
    )
    if (blockedReasons.length > 0) {
      throw new SealBlockedError(blockedReasons)
    }
```

</details>

**依据 7 · 源码核查**：[src/provider-local.ts:747-795](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/provider-local.ts#L747-L795)

多文件写/事后verifier结果。

<details>
<summary>查看原文（49行）</summary>

```text
    const reportText = renderReportMarkdown(plan)
    const manifestText = serializeManifest(buildManifest(plan, sha256Of(reportText)))
    const sealHash = sha256Of(manifestText)

    const reportDir = await this.freshReportDir(request.topic, new Date(generatedAt))
    await writeFile(path.join(reportDir, 'report.md'), reportText, 'utf8')
    await writeFile(path.join(reportDir, 'manifest.json'), manifestText, 'utf8')
    await writeFile(path.join(reportDir, 'verification.jsonl'), verificationText, 'utf8')
    await writeFile(path.join(reportDir, 'disconfirmation.jsonl'), disconfirmationText, 'utf8')

    // Read-only verifier: the deterministic machine check always runs and is
    // written first; the optional model-review job is an enhancement. The seal
    // is already durable here, so a verifier failure must not turn a successful
    // seal into a tool error (issue #11) — record the failure in the note.
    const notePath = path.join(reportDir, 'verifier-note.md')
    let machineCheck: string
    let modelStatus: string
    try {
      const machineResult = await this.verifySealedReport(reportDir, sealHash)
      machineCheck = renderMachineCheckMarkdown(machineResult)
      modelStatus = this.spawnVerifier(reportDir, sealHash, notePath)
    } catch (error) {
      machineCheck = `**Verifier failed after the seal was written.** ${error instanceof Error ? error.message : String(error)}`
      modelStatus = 'skipped: machine verifier failed'
    }
    const verifierNote = [
      '# Verifier note',
      '',
      '## Machine check (deterministic)',
      '',
      machineCheck,
      '',
      '## Model review (read-only)',
      '',
      modelStatus,
      '',
    ].join('\n')
    await writeFile(notePath, verifierNote, 'utf8')

    appendAudit(context?.session, 'research-report/seal', () => {
      context?.session?.append('research-report/seal', {
        reportDir,
        sealHash,
        topic: request.topic,
        title: request.title,
        verdicts,
      })
    })
    return { reportDir, sealHash, verdicts, driftCount }
```

</details>

**依据 8 · 源码核查**：[src/provider-local.ts:198-228](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/provider-local.ts#L198-L228)

所谓model review实际确定性重验。

<details>
<summary>查看原文（31行）</summary>

````text
function startVerifierJob(
  job: JobHandle,
  service: LocalResearchReportService,
  reportDir: string,
  expectedSealHash: string,
  notePath: string,
): JobHooks {
  const done = Promise.withResolvers<JobOutcome>()
  let settled = false
  const settle = (outcome: JobOutcome): void => {
    if (settled) return
    settled = true
    done.resolve(outcome)
  }
  void service.verifySealedReport(reportDir, expectedSealHash)
    .then(async (result) => {
      const review = [
        '',
        '### Re-verification (read-only, deterministic)',
        '',
        'Model review is an enhancement over the machine check above; this re-run',
        'recomputes the same deterministic verification from the sealed directory.',
        '',
        '```',
        renderMachineCheckMarkdown(result),
        '```',
        '',
      ].join('\n')
      await appendFile(notePath, review, 'utf8')
      job.append(review)
      settle({ status: 'completed', detail: 'verifier note appended' })
````

</details>

#### 缺口

- 真实强退/并发多进程及外部seal保管未验。
  **影响**：不能承诺事务恢复、独立模型审阅或作者身份认证。
  **进一步探讨**：副本测试中途写失败/篡改/外部seal比较和两个进程竞争，保留不完整包。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · verified、DOI与全报告核验可解释到哪一层？

**研究主题**：缺陷与关键质疑

#### 完整回答

verifyClaimText把所有绑定文本拼成haystack，逐数字/引号substring查找；数字只要出现在任何位置便先通过，只有该数字完全缺失才用左侧label找不同值判disproven。单位、主体、否定、时间或出处不对应仍可能字面verified，短数字可命中长数字内部。这是可从分支推导的语义边界，未运行样例；无可查字面会unverified，不能全称“任何claim都已事实证明”。

paragraph.claimIds可省，校验仅检查所填id存在，render仅对引用到的非verified打标；无绑定段落的事实不自动抽为claim，报告正文可能超出claim核验范围。DOI零网络只验证前缀/字符形状，inline content可自供，不证论文存在、期刊或同行评审；sessionRef证据明确unverified需人工查日志，已有诚实边界应保留。

封存后核心verifySealedReport的ok只合hash/附录等，不合claimChecks.match；CLI buildVerificationReport则确实将claimsOk纳入，且没--ledger诚实skipped、没--seal不比较。二者不可混用，一个ok不等所有claim复查一致；即使全一致也仅重复同一字节规则。

#### 证据与依据

**依据 1 · 源码核查**：[src/verify.ts:114-129](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/verify.ts#L114-L129)

引用抽取。

<details>
<summary>查看原文（16行）</summary>

```text
export function extractCitations(claimText: string): Citation[] {
  const citations: Citation[] = []
  const seen = new Set<string>()
  for (const match of claimText.matchAll(NUMBER_PATTERN)) {
    const text = match[0]
    if (seen.has(`number:${text}`)) continue
    seen.add(`number:${text}`)
    const context = contextLabelOf(claimText, match.index)
    citations.push(context === undefined ? { kind: 'number', text } : { kind: 'number', text, context })
  }
  for (const pattern of QUOTE_PATTERNS) {
    for (const match of claimText.matchAll(pattern)) {
      const text = match[1]!
      if (seen.has(`quote:${text}`)) continue
      seen.add(`quote:${text}`)
      citations.push({ kind: 'quote', text })
```

</details>

**依据 2 · 源码核查**：[src/verify.ts:173-240](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/verify.ts#L173-L240)

presence-first substring与标签反证。

<details>
<summary>查看原文（68行）</summary>

```text
export function verifyClaimText(claimText: string, evidenceContents: readonly string[]): ByteCheckOutcome {
  if (evidenceContents.length === 0) {
    return { status: 'unverified', note: 'claim binds no evidence snapshot', missing: [], contradictions: [] }
  }
  const haystack = evidenceContents.join('\n')
  const citations = extractCitations(claimText)
  if (citations.length === 0) {
    return {
      status: 'unverified',
      note: 'claim carries no checkable citation (number or quoted span); byte-level verification needs a literal to locate',
      missing: [],
      contradictions: [],
    }
  }
  const missing: string[] = []
  const contradictions: string[] = []
  for (const citation of citations) {
    if (citation.kind === 'quote') {
      if (!haystack.includes(citation.text)) missing.push(`"${citation.text}"`)
      continue
    }
    // Number citation, presence-first: a number locatable verbatim supports
    // the claim. The contradiction check runs only when the claimed number is
    // ABSENT — then a label occurrence carrying a different number means the
    // snapshot explicitly contradicts the claim (the audit-critical signal).
    if (haystack.includes(citation.text)) continue
    if (citation.context !== undefined) {
      let searchFrom = 0
      let different: string | undefined
      for (;;) {
        const at = haystack.indexOf(citation.context, searchFrom)
        if (at === -1) break
        const found = numberAfter(haystack, at + citation.context.length)
        if (found !== undefined && normalizeNumber(found) !== normalizeNumber(citation.text)) {
          different = found
          break
        }
        searchFrom = at + citation.context.length
      }
      if (different !== undefined) {
        contradictions.push(`${citation.context}: claim says ${citation.text}, snapshot says ${different}`)
        continue
      }
    }
    missing.push(citation.text)
  }
  if (contradictions.length > 0) {
    return {
      status: 'disproven',
      note: `disproves the claim: ${contradictions.slice(0, NOTE_LIST_CAP).join('; ')}`,
      missing,
      contradictions,
    }
  }
  if (missing.length > 0) {
    return {
      status: 'insufficient',
      note: `insufficient evidence: citation(s) not found in bound evidence: ${missing.slice(0, NOTE_LIST_CAP).join(', ')}`,
      missing,
      contradictions,
    }
  }
  return {
    status: 'verified',
    note: `${citations.length} citation(s) located verbatim in the bound snapshot(s)`,
    missing,
    contradictions,
  }
```

</details>

**依据 3 · 源码核查**：[src/assemble.ts:122-143](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/assemble.ts#L122-L143)

只验已填引用，无覆盖要求。

<details>
<summary>查看原文（22行）</summary>

```text
  const claimIds = new Set<string>()
  for (const claim of request.claims) {
    if (claim.id.trim() === '') throw new RequestValidationError('claim id must be non-empty')
    if (claimIds.has(claim.id)) throw new RequestValidationError(`duplicate claim id "${claim.id}"`)
    claimIds.add(claim.id)
    for (const evidenceId of claim.evidenceIds) {
      if (!evidenceIds.has(evidenceId)) {
        throw new RequestValidationError(`claim "${claim.id}" binds unknown evidence id "${evidenceId}"`)
      }
    }
  }
  for (const [sectionIndex, section] of request.sections.entries()) {
    for (const [paragraphIndex, paragraph] of section.paragraphs.entries()) {
      for (const claimId of paragraph.claimIds ?? []) {
        if (!claimIds.has(claimId)) {
          throw new RequestValidationError(
            `sections[${sectionIndex}].paragraphs[${paragraphIndex}] cites unregistered claim id "${claimId}"`,
          )
        }
      }
    }
  }
```

</details>

**依据 4 · 源码核查**：[src/assemble.ts:209-228](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/assemble.ts#L209-L228)

仅引用claim打标。

<details>
<summary>查看原文（20行）</summary>

```text
  for (const section of plan.request.sections) {
    lines.push(`## ${section.heading}`, '')
    for (const paragraph of section.paragraphs) {
      const marks: string[] = []
      for (const claimId of paragraph.claimIds ?? []) {
        const verdict = verdictByClaim.get(claimId)
        if (verdict?.status === 'unverified') marks.push(UNVERIFIED_MARK)
        if (verdict?.status === 'insufficient') marks.push(INSUFFICIENT_MARK)
        if (verdict?.status === 'contradicted') marks.push(CONTRADICTED_MARK)
        if (verdict?.status === 'disproven') marks.push(DISPROVEN_MARK)
      }
      lines.push(marks.length === 0 ? paragraph.text : `${paragraph.text} ${marks.join(' ')}`, '')
    }
  }

  lines.push('## Appendix A: Claim verification', '')
  if (plan.verdicts.length === 0) {
    lines.push('No claims were registered.', '')
  } else {
    lines.push('| Claim | Verdict | Evidence | Note |', '|---|---|---|---|')
```

</details>

**依据 5 · 源码核查**：[src/doi.ts:27-76](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/doi.ts#L27-L76)

语法无网络。

<details>
<summary>查看原文（50行）</summary>

```text
/** Canonical structure: `10.` + 4–9 digit registrant + `/` + DOI-charset suffix. */
const DOI_STRUCTURE = /^10\.\d{4,9}\/[A-Za-z0-9._;()/-]+$/u

/** Whether `origin` is a DOI: a bare `10.…` or a recognized DOI resolver prefix. */
export function isDoiOrigin(origin: string): boolean {
  const trimmed = origin.trim()
  if (trimmed.startsWith('10.')) return true
  if (trimmed.toLowerCase().startsWith(DOI_SCHEME_PREFIX)) return true
  return DOI_URL_PREFIXES.some(prefix => trimmed.toLowerCase().startsWith(prefix.toLowerCase()))
}

/**
 * Extract the canonical `10.xxxx/xxxx` DOI from an origin string, stripping
 * any recognized resolver prefix.
 * @param origin - the origin string.
 * @returns the canonical DOI, or undefined when the origin is not a DOI.
 */
export function normalizeDoi(origin: string): string | undefined {
  const trimmed = origin.trim()
  const lower = trimmed.toLowerCase()
  for (const prefix of DOI_URL_PREFIXES) {
    if (lower.startsWith(prefix.toLowerCase())) return trimmed.slice(prefix.length)
  }
  if (lower.startsWith(DOI_SCHEME_PREFIX)) return trimmed.slice(DOI_SCHEME_PREFIX.length)
  if (trimmed.startsWith('10.')) return trimmed
  return undefined
}

/** The outcome of {@link validateDoi}. */
export type DoiValidation = { valid: true; doi: string } | { valid: false; reason: string }

/**
 * Deterministically validate one DOI origin (no network). A valid DOI returns
 * its canonical form; an invalid one returns the concrete reason.
 * @param origin - the origin string.
 * @returns the validation outcome.
 */
export function validateDoi(origin: string): DoiValidation {
  const doi = normalizeDoi(origin)
  if (doi === undefined) {
    return {
      valid: false,
      reason: `origin ${JSON.stringify(origin)} is not a DOI (expected 10.xxxx/xxxx, a doi: URN, or a doi.org / dx.doi.org URL)`,
    }
  }
  if (DOI_STRUCTURE.test(doi)) return { valid: true, doi }
  if (!/^10\.\d{4,9}\//u.test(doi)) {
    return { valid: false, reason: `DOI ${JSON.stringify(doi)} must match "10.<4-9 digit registrant>/<suffix>"` }
  }
  return { valid: false, reason: `DOI ${JSON.stringify(doi)} contains characters outside the DOI set [A-Za-z0-9._;()/-]` }
```

</details>

**依据 6 · 源码核查**：[src/provider-local.ts:465-497](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/provider-local.ts#L465-L497)

session锚定人工要求。

<details>
<summary>查看原文（33行）</summary>

```text
    for (const evidenceId of claim.evidenceIds) {
      const record = await this.ledger.getEvidence(evidenceId)
      if (record?.sessionRef !== undefined) {
        sessionAnchored.push(`${evidenceId} → session ${record.sessionRef.sessionId} [${record.sessionRef.eventRange.start}-${record.sessionRef.eventRange.end}]`)
      }
      const read = await this.ledger.readContent(evidenceId)
      if (read === undefined) {
        broken.push(`${evidenceId} (not in the ledger)`)
        continue
      }
      if (read.integrity !== 'ok') {
        broken.push(`${evidenceId} (${read.integrity}: object bytes no longer match the indexed hash)`)
        continue
      }
      contents.push(read.content)
    }
    let byte
    if (sessionAnchored.length > 0) {
      byte = {
        status: 'unverified' as const,
        note: `会话锚定证据需人工回查会话日志 (session-anchored evidence requires manual session-log review): ${sessionAnchored.join('; ')}`,
        missing: [],
        contradictions: [],
      }
    } else if (broken.length > 0) {
      byte = {
        status: 'contradicted' as const,
        note: `bound evidence failed the integrity check: ${broken.join('; ')}`,
        missing: [],
        contradictions: broken,
      }
    } else {
      byte = verifyClaimText(claim.text, contents)
```

</details>

**依据 7 · 源码核查**：[src/verify-sealed.ts:103-131](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/verify-sealed.ts#L103-L131)

核心ok未含claimChecks。

<details>
<summary>查看原文（29行）</summary>

```text
  for (const claim of claims) {
    const recorded = verdicts.find(verdict => verdict.claimId === claim.id)?.status ?? 'unverified'
    const contents: string[] = []
    let integrityFailed = false
    for (const evidenceId of claim.evidenceIds) {
      const read = await deps.readEvidenceContent(evidenceId)
      if (read === undefined || read.integrity !== 'ok') {
        integrityFailed = true
        break
      }
      contents.push(read.content)
    }
    const recomputed: VerdictStatus = integrityFailed ? 'contradicted' : verifyClaimText(claim.text, contents).status
    claimChecks.push({ claimId: claim.id, recorded, recomputed, match: recorded === recomputed })
  }

  const gapSectionPresent = reportText.includes('## Appendix A: Claim verification')
  const disproofSectionPresent = reportText.includes('## Appendix D: Disconfirmation log')
  const sealHashMatches = sealHash === expectedSealHash
  const ok = sealHashMatches && reportHashMatches && journalHashesMatch && gapSectionPresent && disproofSectionPresent
  return {
    sealHash,
    sealHashMatches,
    reportHashMatches,
    journalHashesMatch,
    claimChecks,
    gapSectionPresent,
    disproofSectionPresent,
    ok,
```

</details>

**依据 8 · 源码核查**：[src/verify-sealed.ts:216-227](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/verify-sealed.ts#L216-L227)

CLI信封包含claimsOk。

<details>
<summary>查看原文（12行）</summary>

```text
  reportDir: string,
  expectedSealHash: string | null,
  claimRecheck: 'rechecked' | 'skipped-no-ledger' = 'rechecked',
): VerificationReport {
  const sealHashMatches = expectedSealHash === null ? null : result.sealHashMatches
  const claimsOk = claimRecheck === 'skipped-no-ledger' || result.claimChecks.every(check => check.match)
  const ok = (sealHashMatches === null || sealHashMatches)
    && result.reportHashMatches
    && result.journalHashesMatch
    && result.gapSectionPresent
    && result.disproofSectionPresent
    && claimsOk
```

</details>

**依据 9 · 源码核查**：[src/cli.ts:95-105](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/cli.ts#L95-L105)

无ledger跳过。

<details>
<summary>查看原文（11行）</summary>

```text
  const evidenceById = new Map((Array.isArray(manifest.evidence) ? manifest.evidence : []).map(record => [record.id, record]))

  // Without a ledger root, claim re-checks are skipped honestly (the seal/report/
  // journal hashes still recompute from the sealed directory alone).
  const claimRecheck = args.ledger === null ? 'skipped-no-ledger' as const : 'rechecked' as const

  const deps: SealedVerificationDeps = {
    readFile: (file: string) => readFile(file, 'utf8'),
    readEvidenceContent: async (id: string) => {
      if (args.ledger === null) return undefined
      const record = evidenceById.get(id)
```

</details>

#### 缺口

- 真实语义误判率、claim覆盖率及桥接差异未验。
  **影响**：不可无人审核发布为事实认证报告。
  **进一步探讨**：构造错主体/单位/否定、短数字子串、无claim段落和桥接不同结果，分别看核心/CLI信封。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 数据/网络、作业和退出的负担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需Node^22.19或>=24与匹配DSH，lib发布入口源码对应关系未运行构建验收；web/jobs/dataQuality可选。本地inline/文件证据和字节核验无需模型/网络，但URL捕获/一次gather用web，结构化数据桥接另有依赖，不应称全流程零网络。workspaceRoot显式优先、workingDirectory(session)其次、缺服务回启动cwd；文件containment仅path.resolve，未realpath，不等多租户隔离。ledger/report根在挂载时resolve，不随会话自动分库。

首次整理原件/权限/目录/外部seal保存，持续快照/JSONL/版本增长和人工语义审查，2MiB每证据/200证据默认只是预算非成本测量。后台cancel只abort一个未传给assembleDetailed的controller并settle killed，实际封存Promise仍可写；前台也只入门查signal，不能把job killed当无文件。失败核最终目录/ledger再重试，保留不完整包；退出先查在途与导出快照/可信seal，停插件不删材料或撤销已泄露内容。现金/工时未测。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:65-71](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/README.md#L65-L71)

运行/可选依赖声明。

```text
## Compatibility

- DeepSeek Harness `dsh-v0.2.1-alpha.1` (verified 2026-09-25). npm dev/test line `0.1.7-rc.2`; peers `>=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0`. The compat matrix pins all four declared peer lines. On this line `Session.append`'s third parameter is a `SurfaceIntent` for surface-eligible types only, so `research-report/*` events still do not land in the session log: the ledger journals are the durable source of truth and the audit mirror activates only once a host knows the vocabulary (the regression lock in `test/events-gate.spec.ts` pins that).
0.1.5-alpha.1 (adapted 2026-09-09): the session envelope keeps its ignorable field for stored-log read compatibility only - Session.append still cannot stamp it, so audit-gate behavior is unchanged. Verified 2026-09-11 against the published 0.1.5-rc.2 types (full local gate chain); the compat workflow pins both declared peer lines.
- Node `^22.19.0 || >=24.0.0`, ESM only (`"type": "module"`).
- Peer dependencies: `@deepseek-ai/cordis ^4.0.2`, `@deepseek-ai/schemastery ^3.18.2`, and `@deepseek-ai/dsh-session`, `@deepseek-ai/dsh-tools`, `@deepseek-ai/dsh-system-prompt`, `@deepseek-ai/dsh-web`, `@deepseek-ai/dsh-jobs` at `>=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0`.
- Optional siblings (never required): `ctx.web` providers for URL capture/gather, `ctx.jobs` for background assembly, `ctx.dataQuality` (dsh-data-quality) for dataset citation cross-checks.
```

**依据 2 · 源码核查**：[src/provider-local.ts:300-312](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/provider-local.ts#L300-L312)

workspace回退。

<details>
<summary>查看原文（13行）</summary>

```text
  private workspaceRootFor(session?: Session): string {
    if (this.config.workspaceRoot !== undefined) return this.config.workspaceRoot
    if (session !== undefined) {
      try {
        const service = (this.ctx as unknown as { get(name: string): unknown }).get('workingDirectory') as WorkingDirectoryReader | undefined
        const directory = service?.get(session)
        if (typeof directory === 'string' && directory !== '') return directory
      } catch {
        // A missing or throwing host service is a deployment fact: keep the
        // documented fallback instead of failing evidence capture.
      }
    }
    return this.workspaceRoot
```

</details>

**依据 3 · 源码核查**：[src/gather.ts:63-69](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/gather.ts#L63-L69)

词法边界。

```text
export function resolveWorkspacePath(workspaceRoot: string, origin: string): string {
  const root = path.resolve(workspaceRoot)
  const resolved = path.resolve(root, origin)
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new CaptureError('ORIGIN_OUTSIDE_WORKSPACE', `origin ${JSON.stringify(origin)} resolves outside the workspace`)
  }
  return resolved
```

**依据 4 · 源码核查**：[src/config.ts:61-69](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/config.ts#L61-L69)

尺寸/数量预算。

```text
export const Config: z<Config> = z.object({
  enabled: z.boolean().default(true),
  ledgerRoot: z.string().default('.research-ledger'),
  reportRoot: z.string().default('research-reports'),
  workspaceRoot: z.string(),
  maxEvidenceBytes: z.number().default(2 * 1024 * 1024),
  maxEvidencePerReport: z.number().default(200),
  fetchTimeoutMs: z.number().default(20_000),
  requireJournalMetadata: z.boolean().default(false),
```

**依据 5 · 源码核查**：[src/config.ts:100-115](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/config.ts#L100-L115)

固定根解析。

<details>
<summary>查看原文（16行）</summary>

```text
export function resolveConfig(config: Config = {}): ResolvedConfig {
  const maxEvidenceBytes = config.maxEvidenceBytes ?? 2 * 1024 * 1024
  assertPositiveInt('maxEvidenceBytes', maxEvidenceBytes)
  const maxEvidencePerReport = config.maxEvidencePerReport ?? 200
  assertPositiveInt('maxEvidencePerReport', maxEvidencePerReport)
  const fetchTimeoutMs = config.fetchTimeoutMs ?? 20_000
  assertPositiveInt('fetchTimeoutMs', fetchTimeoutMs)
  return {
    enabled: config.enabled ?? true,
    ledgerRoot: resolveRoot(config.ledgerRoot ?? '.research-ledger', 'ledgerRoot'),
    reportRoot: resolveRoot(config.reportRoot ?? 'research-reports', 'reportRoot'),
    workspaceRoot: config.workspaceRoot === undefined ? undefined : resolveRoot(config.workspaceRoot, 'workspaceRoot'),
    maxEvidenceBytes,
    maxEvidencePerReport,
    fetchTimeoutMs,
    requireJournalMetadata: config.requireJournalMetadata ?? false,
```

</details>

**依据 6 · 源码核查**：[src/tools/research-report.ts:264-296](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/tools/research-report.ts#L264-L296)

前台/后台入口。

<details>
<summary>查看原文（33行）</summary>

```text
    async execute(args, exec) {
      exec.signal.throwIfAborted()
      const session = exec.agent?.session

      if (args.gather === true) {
        const outcome = await service.gather(args.topic, args.depth ?? 'standard', exec.signal, session)
        return {
          kind: 'gathered' as const,
          topic: outcome.topic,
          candidates: outcome.candidates,
          gaps: outcome.gaps,
        }
      }

      const request = await buildRequest(service, args)
      if (args.background === true) {
        const jobs = deps.ctx.get('jobs')
        if (jobs === undefined) {
          throw new Error('background jobs unavailable: this composition mounts no ctx.jobs (load @deepseek-ai/dsh-jobs-local and @deepseek-ai/dsh-tool-jobs), or call without background')
        }
        if (exec.signal.aborted) throw new Error('tool call aborted')
        const jobId = jobs.start({
          kind: 'research-report',
          label: `assemble report: ${args.topic}`,
          // JobSpec.owner is a SessionId; Agent.id is exactly that brand.
          ...exec.agent === undefined ? {} : { owner: exec.agent.id },
          run: (job: JobHandle): JobHooks => startAssembleJob(job, service, request, session === undefined ? {} : { session }),
        })
        return { kind: 'background' as const, jobId }
      }

      const detail = await service.assembleDetailed(request, session === undefined ? {} : { session })
      return sealedValue(detail.reportDir, detail.sealHash, detail.verdicts, request.evidence.length, detail.driftCount)
```

</details>

**依据 7 · 源码核查**：[src/tools/research-report.ts:397-428](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/tools/research-report.ts#L397-L428)

cancel controller未传assemble。

<details>
<summary>查看原文（32行）</summary>

```text
function startAssembleJob(
  job: JobHandle,
  service: LocalResearchReportService,
  request: AssembleReportRequest,
  context: { session?: import('@deepseek-ai/dsh-session').Session },
): JobHooks {
  const abort = new AbortController()
  job.updateProgress(`assembling report: ${request.topic}`)
  const done = Promise.withResolvers<JobOutcome>()
  let settled = false
  const settle = (outcome: JobOutcome): void => {
    if (settled) return
    settled = true
    done.resolve(outcome)
  }
  void service.assembleDetailed(request, context)
    .then((detail) => {
      const value = sealedValue(detail.reportDir, detail.sealHash, detail.verdicts, request.evidence.length, detail.driftCount)
      job.append(renderSealed(value))
      settle({ status: 'completed', detail: `sealed ${detail.sealHash.slice(0, 12)}` })
    })
    .catch((error: unknown) => {
      const message = error instanceof CaptureError || error instanceof Error ? error.message : String(error)
      job.append(`assemble failed: ${message}`)
      settle({ status: 'failed', detail: message.length > 200 ? `${message.slice(0, 197)}…` : message })
    })
  return {
    cancel(reason?: string): void {
      abort.abort(reason ?? 'cancelled')
      settle({ status: 'killed', detail: `cancelled: ${reason ?? 'no reason given'}` })
    },
    done: done.promise,
```

</details>

#### 缺口

- Host/lib兼容、取消最终文件和多会话目录权限未验。
  **影响**：可能误认作业停止/隔离与总成本。
  **进一步探讨**：独立目录在取消/磁盘失败后等待并查最终文件，核分库/权限与增长。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎么试用，下一步假设怎样被推翻？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议以公开非敏感材料试用字节回溯/封存，而由研究者人工审主体/时间/单位和全部未绑定段落；把verified读作字面可定位，把外部seal/ledger一同交接。先做篡改、缺快照、无ledger和取消后文件核查。若核心ok与claimChecks冲突、原文不支持或任务killed仍有输出，保留证据停发布，回手工核引用/最终目录，而非反复封存洗掉问题。

可探索分层核验收据：分别显示字节完整、claim覆盖、语义支持和执行最终状态，默认不把非空数字命中等同事实支持。已有五状态、session人工边界、CLI skipped标志是基线，增量是防止跨层推断而非再加一个“更可信”分数。用错主体/单位、子串数字、无claim段落、取消写入及无外部seal样本，比较审者误信/漏查、恢复时间和审阅负担；若只改文案已有同效，或语义自动化误报/成本更大，应否定复杂方案。未实现。

#### 证据与依据

**依据 1 · 源码核查**：[src/verify.ts:194-237](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/verify.ts#L194-L237)

字面presence语义。

<details>
<summary>查看原文（44行）</summary>

```text
    // Number citation, presence-first: a number locatable verbatim supports
    // the claim. The contradiction check runs only when the claimed number is
    // ABSENT — then a label occurrence carrying a different number means the
    // snapshot explicitly contradicts the claim (the audit-critical signal).
    if (haystack.includes(citation.text)) continue
    if (citation.context !== undefined) {
      let searchFrom = 0
      let different: string | undefined
      for (;;) {
        const at = haystack.indexOf(citation.context, searchFrom)
        if (at === -1) break
        const found = numberAfter(haystack, at + citation.context.length)
        if (found !== undefined && normalizeNumber(found) !== normalizeNumber(citation.text)) {
          different = found
          break
        }
        searchFrom = at + citation.context.length
      }
      if (different !== undefined) {
        contradictions.push(`${citation.context}: claim says ${citation.text}, snapshot says ${different}`)
        continue
      }
    }
    missing.push(citation.text)
  }
  if (contradictions.length > 0) {
    return {
      status: 'disproven',
      note: `disproves the claim: ${contradictions.slice(0, NOTE_LIST_CAP).join('; ')}`,
      missing,
      contradictions,
    }
  }
  if (missing.length > 0) {
    return {
      status: 'insufficient',
      note: `insufficient evidence: citation(s) not found in bound evidence: ${missing.slice(0, NOTE_LIST_CAP).join(', ')}`,
      missing,
      contradictions,
    }
  }
  return {
    status: 'verified',
    note: `${citations.length} citation(s) located verbatim in the bound snapshot(s)`,
```

</details>

**依据 2 · 源码核查**：[src/assemble.ts:133-143](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/assemble.ts#L133-L143)

coverage缺口。

<details>
<summary>查看原文（11行）</summary>

```text
  for (const [sectionIndex, section] of request.sections.entries()) {
    for (const [paragraphIndex, paragraph] of section.paragraphs.entries()) {
      for (const claimId of paragraph.claimIds ?? []) {
        if (!claimIds.has(claimId)) {
          throw new RequestValidationError(
            `sections[${sectionIndex}].paragraphs[${paragraphIndex}] cites unregistered claim id "${claimId}"`,
          )
        }
      }
    }
  }
```

</details>

**依据 3 · 源码核查**：[src/verify-sealed.ts:216-227](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/verify-sealed.ts#L216-L227)

现有分层CLI基线。

<details>
<summary>查看原文（12行）</summary>

```text
  reportDir: string,
  expectedSealHash: string | null,
  claimRecheck: 'rechecked' | 'skipped-no-ledger' = 'rechecked',
): VerificationReport {
  const sealHashMatches = expectedSealHash === null ? null : result.sealHashMatches
  const claimsOk = claimRecheck === 'skipped-no-ledger' || result.claimChecks.every(check => check.match)
  const ok = (sealHashMatches === null || sealHashMatches)
    && result.reportHashMatches
    && result.journalHashesMatch
    && result.gapSectionPresent
    && result.disproofSectionPresent
    && claimsOk
```

</details>

**依据 4 · 源码核查**：[src/tools/research-report.ts:412-426](https://github.com/PerryLink/dsh-research-report/blob/d850f067c320ab1f8eaae243e19714d644961e1b/src/tools/research-report.ts#L412-L426)

执行最终状态动机。

<details>
<summary>查看原文（15行）</summary>

```text
  void service.assembleDetailed(request, context)
    .then((detail) => {
      const value = sealedValue(detail.reportDir, detail.sealHash, detail.verdicts, request.evidence.length, detail.driftCount)
      job.append(renderSealed(value))
      settle({ status: 'completed', detail: `sealed ${detail.sealHash.slice(0, 12)}` })
    })
    .catch((error: unknown) => {
      const message = error instanceof CaptureError || error instanceof Error ? error.message : String(error)
      job.append(`assemble failed: ${message}`)
      settle({ status: 'failed', detail: message.length > 200 ? `${message.slice(0, 197)}…` : message })
    })
  return {
    cancel(reason?: string): void {
      abort.abort(reason ?? 'cancelled')
      settle({ status: 'killed', detail: `cancelled: ${reason ?? 'no reason given'}` })
```

</details>

#### 缺口

- 分层收据/语义审阅无实现或任务对照。
  **影响**：不能计现有事实可靠性收益。
  **进一步探讨**：先与明确文案+人工全段核查比较，再评自动语义层。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
