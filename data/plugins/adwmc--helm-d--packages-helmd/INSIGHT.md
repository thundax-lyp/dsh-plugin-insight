# Helm D

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[e5a68f8](https://github.com/ADWMC/helm-d/tree/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd)

<!-- BEGIN META -->
[![GitHub ★ 827](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=827&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ADWMC/helm-d) [![npm 30d 463](https://img.shields.io/static/v1?label=npm+30d&message=463&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@adwmc/helm-d) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@adwmc/helm-d)
<!-- END META -->

> **功能**：在 DSH 中组织安全分析案例、工具输出证据、引用结论与资料路由，并组合多层提示策略。

> **亮点**：横切持久化、磁盘恢复与finding结构检查使证据整理集中；health把生成preset和宿主指纹关联并尝试重生成，备份/写入/重启边界见 [Q05](#research-q05)，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：编号存在/命令非空不证明蕴含与复现，长证据截断与完整hash不同；行为干预不是授权或安全边界，见 [Q02](#research-q02) 和 [Q03](#research-q03)。

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
  - [Q01 · 固定组件在授权分析中交付什么，相对人工记录多做什么？](#detail-section-11)
  - [Q02 · 工具输出、恢复和结论门控能保证多少？](#detail-section-12)
  - [Q03 · 提示和工具描述干预是否等于权限与可信边界？](#detail-section-13)
  - [Q04 · 采用和退出如何界定，可提出什么可证伪改进？](#detail-section-14)
  - [Q05 · 健康入口何时自动写preset，备份与生效边界是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为授权样本分析人员集中建案、留存受包裹工具输出并登记引用结论，合格标准仍是证据相关且结论正确，见 [Q01](#research-q01)。

手工脚本、证据表和聊天记录；宿主与解释器提供实际分析能力，自动编号/恢复组织是本组件增量，拒绝减少不算正确性。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 案例组织 | 证据编号和恢复 | 字符串、活动案、非完整事务 |
| finding | 引用及复现文本登记 | 不验蕴含或实际命令执行 |
| health | 漂移检测及策略化重生成 | .bak非强制，实际生效仍需重启核目录 |
| 领域工具/策略 | 分析入口和行为干预 | 提示不授权，脚本须独立审 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配宿主与生成preset | 必需 | health/Agent组合 | 默认有来源指纹漂移可重写，.bak尽力而为；仍需重启 |
| tools/systemPrompt及案例目录 | 核心必需 | 包装、提示和磁盘绑定 | 无活动案仅软提醒 |
| 解释器/领域脚本/样本 | 对应分析必需 | 真正执行分析 | 缺宿主subprocess会本地fallback，须审边界 |
| 完整提示审阅与范围授权 | 正式交付必需 | 判断实际行为 | star/编号不能代授权 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 人审preset/脚本/样本 | 固定范围与执行边界 |
| 加载 | health按策略检测/备份/重写，Agent注册 | 核patch与真实备份，重启核目录 |
| 组织 | 开案、执行、记录引用 | 查实际工件与相关性 |
| 恢复 | 读磁盘绑定和resume | 先核部分动作，勿盲重试 |
| 交付 | 人复核命令及结论 | 不用编号或少拒绝替代 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 运行时/存储/模型金额未知 | 审preset写策略、原文件/真实备份、人设与脚本 | 默认auto可能写入，未确认隔离证据层 |
| 持续使用 | 重试/进程/证据增长未知 | 结论相关性及正确性审查 | 无合格任务费用/耗时 |
| 失败恢复 | 部分工件与重复进程未知 | 查.bak是否成功、还原patch并重启，重绑定案例 | 备份可失败，直接写/动作非事务 |
| 退出 | 案例迁移存储未知 | 禁用并核副作用/资料归属 | 卸载不撤分析动作 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 出处组织 | 活动案字符串记录/编号 | 完整产物覆盖 |
| finding结构 | 编号与命令文本检查 | 蕴含、真实复现、正确率 |
| 恢复 | 磁盘案例与resume | 重复动作与恢复节时 |
| preset修复 | 默认auto来源校验、生成和重评 | .bak成功、写盘中断及重启后实际目录 |
| 行为策略 | 模型/描述干预存在 | 减少拒绝不证明质量 |

> **思考**：编号存在/命令非空不证明蕴含与复现，长证据截断与完整hash不同；行为干预不是授权或安全边界，见 [Q02](#research-q02) 和 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：横切持久化、磁盘恢复与finding结构检查使证据整理集中；health把生成preset和宿主指纹关联并尝试重生成，备份/写入/重启边界见 [Q05](#research-q05)，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

[Q02](#research-q02) 注册包装集中组织有效，需清楚字符串/案绑定契约和长输出hash；[Q03](#research-q03) 提示与请求改写要独立归因，不能混作证据可信度。

<a id="detail-section-5"></a>

### 1.4 主要限制

编号存在/命令非空不证明蕴含与复现，长证据截断与完整hash不同；行为干预不是授权或安全边界，见 [Q02](#research-q02) 和 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察为主，先审提示/脚本及health默认写策略，确认独立原patch备份与重启退路，再决定离线验证证据层；不接重要交付，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定入口与证据/提示代表链已核，已有工程贡献与未来分离复核假设分开；建议观察，未运行目标或审完封印正文/全部领域脚本。

- 已检查：作者 README、包清单、源码路径 packages/helmd/package.json、packages/helmd/src/case.ts、packages/helmd/src/gate.ts、packages/helmd/src/health.ts、packages/helmd/src/index.ts、packages/helmd/src/llm-stream-hook.ts、packages/helmd/src/persist.ts、packages/helmd/src/seam.ts、packages/helmd/src/tool-wash.ts、packages/helmd/src/tools/caseflow.ts、scripts/gen-preset.mjs 及固定范围 inventory；组件：packages/helmd。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：组件完整inventory复用；读health/package/index、persist/case/caseflow、seam、gate及描述/stream代表链。baseline原稿、完整问题及11 findings/自code依赖均复核；未运行、补追health自动修复、gen-preset写入/备份；未全审封印/领域脚本。
- 下一步：固定离线授权样本比较人工表、当前与分离+复核方案，覆盖长输出、timeline失败及中断，并用副本核auto/off/force、备份失败、直接写中断及重启目录，盲审支持率/遗漏/重试/人工与模型成本。本轮无目标运行。

**分析版本**

- **仓库**：[ADWMC/helm-d](https://github.com/ADWMC/helm-d)
- **版本号**：0.5.2（[固定提交 e5a68f8](https://github.com/ADWMC/helm-d/tree/e5a68f88a6017dd1bb393e2d020c2c1bf091154c)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

分离可审证据层与模型干预，明确原始/留存hash并为finding加入摘录和独立支持复核；新样本对照失败则否定，见 [Q04](#research-q04)。

固定离线授权样本比较人工表、当前与分离+复核方案，覆盖长输出、timeline失败及中断，并用副本核auto/off/force、备份失败、直接写中断及重启目录，盲审支持率/遗漏/重试/人工与模型成本。本轮无目标运行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 7 | 2356 | 1926 | 306 | — |
| .md | source | 366 | 95370 | — | — | 523478 |
| .mjs | source | 3 | 671 | 488 | 138 | — |
| .ts | source | 37 | 6360 | 5044 | 877 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/ADWMC/helm-d/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/ADWMC/helm-d/issues?q=is%3Aissue+created%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/ADWMC/helm-d/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：案例证据结构如何约束结论，提示/工具干预及恢复边界能否支持授权分析交付？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 固定组件在授权分析中交付什么，相对人工记录多做什么？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

@adwmc/helm-d 0.5.2是DSH原生插件子包。main指向health，而实际工具放在生成preset组合，不能把仅加载健康卡视为Agent工具已激活。包同时交付客户端、生成preset、封印资料和人设；核心目标可分为案例证据组织、领域工具路由和模型行为干预。针对自有或已授权样本的分析人员，合格交付是可定位证据、可复现过程和正确结论，不能用拒绝减少、输出变长或编号增多验收。

相对手动建目录、复制脚本输出和维护证据表，注册边界自动记录及磁盘案例恢复可减少分散接线；分析脚本、系统解释器和宿主能力仍是直接依赖。health比较安装宿主standard与生成preset指纹，还可自动重写生成文件；这不是只读检测，详细策略和恢复代价见本项健康检查分析。该处理不能证明所有工具或实际任务通过。领域覆盖和封印资料未逐项验收，来源固定不是公开发布包与源码一致性的证明。

#### 证据与依据

**依据 1 · 源码核查**：[packages/helmd/package.json:2-35](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/package.json#L2-L35)

版本、health主入口及子入口。

<details>
<summary>查看原文（34行）</summary>

```text
  "name": "@adwmc/helm-d",
  "version": "0.5.2",
  "type": "module",
  "license": "MIT",
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
```

</details>

**依据 2 · 源码核查**：[packages/helmd/src/health.ts:4-24](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/health.ts#L4-L24)

健康面与preset实际工具层分工。

<details>
<summary>查看原文（21行）</summary>

```text
 * Evaluates the package-internal preset patch (`preset.generated.patch.yml`,
 * written by gen-preset.mjs and loaded through `dsh.bundle.patch`) against the
 * hash of the INSTALLED host's own `standard` preset patch, and serves the
 * verdict at `GET /api/helmd/health`.
 *
 * 0.1.7 moved presets from a deployed `.agent-presets/<name>/agent.cordis.yml`
 * to a composition row, so this package now carries its own preset artifact and
 * there is no deployment step to drift: drift here means the shipped artifact
 * was generated against a different host standard (HOST_UPGRADED) or no longer
 * satisfies the structural assertion (STALE).
 *
 * Evaluation runs once per process start — deliberately. The standing-mount
 * semantics mean a preset change is only safe after a harness restart
 * (incident 2026-08-26: generation replacement collides in the same preset
 * scope), so boot time is exactly the moment this verdict is true.
 *
 * The verdict is derived state, not configuration: 0.1.7's settings document
 * only carries Config schemas of profile entries, so the card reads the HTTP
 * route instead of a settings namespace. Agent tools are mounted by the preset
 * row; keeping this row on the host plane makes the health card available
 * without exposing helmd tools to other agents.
```

</details>

**依据 3 · 源码核查**：[packages/helmd/src/index.ts:30-50](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/index.ts#L30-L50)

工具包装与多层提示接线。

<details>
<summary>查看原文（21行）</summary>

```text
export function apply(ctx: Context): void {
  // Description wash FIRST: normalize any "denial is final" tool wording before
  // any domain tool registers (defensive layer — current helmd descriptions are clean).
  const unwash = applyDescriptionWash(ctx)
  // Persistence wrap FIRST: every later-registered domain tool gains
  // evidence persistence without per-tool edits (soft gate).
  const unwrap = applyPersistenceWrap(ctx)
  try {
    // ICA context: behavior demonstrations as durable user-role snapshot (L2).
    // Registered before everything else — it needs systemPrompt only.
    registerIcaContext(ctx)

    // Bootstrap filter: first request only exposes the platform shell + read
    applyBootstrapFilter(ctx, {
      shellTools: [NATIVE_SHELL],
      commonTools: ['read'],
      promoteOn: 'either',
    })

    // Advisory ledger: producers submit before the renderer runs its post-next render.
    registerAdvisoryHook(ctx)
```

</details>

**依据 4 · 源码核查**：[packages/helmd/src/seam.ts:107-123](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/seam.ts#L107-L123)

领域执行依赖宿主subprocess。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

#### 缺口

- 没有同条件独立合格报告、宿主版本及依赖安装验收。
  **影响**：不据静态结构推断实际分析准确性或宿主执行保障。
  **进一步探讨**：先静态审阅完整提示与工具脚本，再以离线授权样本比较人工证据表的结论支持率和整理负担。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具输出、恢复和结论门控能保证多少？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

apply在注册领域工具前包装ctx.tools.register，豁免路由、参考及案例管理工具；受包裹execute先执行再persistHook。只有字符串且有活动案例才saveEvidence，无案例只附未持久化提醒，非字符串直接通过，因此不是全工具强制审计。saveEvidence写证据再appendTimeline，后续失败不撤实际分析动作；长内容按256*1024字符截断，返回sha却按完整内容算，不能拿这个sha直接验证已截断文件。去重读已有文件算hash，对超长原始输出也不等价；这些是可核设计边界，不把文件存在当完整留证。

record_finding拒未知编号并要求非空repro_cmd，之后把调用者的title/detail和命令字符串直接appendFinding。它既不验证证据蕴含结论，也不执行复现命令；DEEP关案要求finding与命令文本，仍只是结构门控。case_status按磁盘案例重绑定及摘要resume有明确恢复思路，但副作用的已执行/已记录/是否重试不是事务。证据组织可追溯的贡献成立，无幻觉或可靠自动恢复不成立为已证效果。

#### 证据与依据

**依据 1 · 源码核查**：[packages/helmd/src/persist.ts:65-83](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/persist.ts#L65-L83)

字符串、活动案例、先写盘再nudge。

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

**依据 2 · 源码核查**：[packages/helmd/src/persist.ts:90-108](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/persist.ts#L90-L108)

注册包装实际链。

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

**依据 3 · 源码核查**：[packages/helmd/src/case.ts:232-258](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/case.ts#L232-L258)

原文hash、截断文件与timeline次序。

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

**依据 4 · 源码核查**：[packages/helmd/src/case.ts:269-278](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/case.ts#L269-L278)

只校编号存在。

<details>
<summary>查看原文（10行）</summary>

```text
export async function validateEvidenceIds(
  caseDir: string,
  ids: string[],
): Promise<{ ok: boolean; missing: string[]; known: string[] }> {
  const files = await readdir(join(caseDir, 'evidence')).catch(() => [] as string[])
  const known = files
    .map((f) => /^(E-\d{3})-/.exec(f)?.[1])
    .filter((x): x is string => Boolean(x))
  const missing = ids.filter((id) => !known.includes(id))
  return { ok: missing.length === 0, missing, known }
```

</details>

**依据 5 · 源码核查**：[packages/helmd/src/tools/caseflow.ts:202-230](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/tools/caseflow.ts#L202-L230)

命令非空而不执行或语义核验。

<details>
<summary>查看原文（29行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'record_finding',
    description:
      'Record a conclusion into findings.md. Every evidence id you cite is validated against the evidence/ directory — ' +
      'citing ids that do not exist is rejected. Pass repro_cmd (a command that reproduces the result); ' +
      'DEEP mode requires it before the case can close.',
    parameters: {
      title: { type: 'string', required: true },
      detail: { type: 'string', required: true },
      evidence_ids: { type: 'array', items: { type: 'string' }, required: true, description: 'e.g. ["E-002","E-005"]' },
      repro_cmd: { type: 'string', required: true, description: 'Reusable command/tool call that reproduces the conclusion.' },
    },
    output: { schema: { type: 'string' }, render: (_a: unknown, v: string) => [{ type: 'text', text: v }] },
    async execute(args: { title: string; detail: string; evidence_ids: string[]; repro_cmd: string }, exec?: ExecLike) {
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
      await appendFinding(active.dir, args.title, args.detail, args.evidence_ids ?? [], args.repro_cmd)
      return `finding recorded: ${args.title} [${(args.evidence_ids ?? []).join(', ')}]\nrepro: ${args.repro_cmd.trim()}`
```

</details>

**依据 6 · 源码核查**：[packages/helmd/src/tools/caseflow.ts:304-323](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/tools/caseflow.ts#L304-L323)

DEEP关案结构要求。

<details>
<summary>查看原文（20行）</summary>

```text
      'Close the active case: stamps CASE.md completed and unbinds the session. ' +
      'In deep mode at least one recorded finding is required, and every finding must carry repro_cmd. ' +
      'Closing also requires at least one evidence entry on disk, unless the summary states why there is none ' +
      'with "(no-evidence: …)".',
    parameters: { summary: { type: 'string', description: 'One-line closing summary.' } },
    output: { schema: { type: 'string' }, render: (_a: unknown, v: string) => [{ type: 'text', text: v }] },
    async execute(args: { summary?: string }, exec?: ExecLike) {
      const active = getCase(exec?.agent?.id)
      if (!active) return 'No active case bound to this session.'
      const mode = getLevel(exec?.agent?.id)
      if (mode === 'deep') {
        const findings = await loadFindings(active.dir)
        if (findings.length === 0) {
          return 'DEEP mode requires at least one record_finding before end_case. Evidence chain incomplete.'
        }
        const missingRepro = findings.filter((finding) => (finding.repro ?? '').trim() === '')
        if (missingRepro.length > 0) {
          return [
            `REJECTED — DEEP mode requires repro_cmd on every finding: ${missingRepro.map((f) => f.title).join(', ')}.`,
            'Re-record the finding with repro_cmd (a command that reproduces it) before closing.',
```

</details>

#### 缺口

- 并发编号、长输出与写盘失败后的真实恢复结果未验证。
  **影响**：不据静态结构推断实际分析准确性或宿主执行保障。
  **进一步探讨**：离线样本制造长/非字符串输出、timeline失败和中断，分别核实际工件、hash、索引与是否重复执行，并盲审引用支持。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 提示和工具描述干预是否等于权限与可信边界？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

不是。index注册工具描述wash、bootstrap过滤、advisory与llm/stream hook；wash不只包内未来注册，还处理已注册宿主工具描述和参数说明。stream hook默认reactive，监测拒绝后能重新请求模型并改变历史上下文，最终仍依赖模型输出。该策略是绕过拒绝的行为干预，不是证明任务被授权、工具获得额外能力或结论更正确。此处仅核其存在和作用，不提供绕过优化或复现操作。

域工具执行还在seam优先调用宿主subprocess而缺失时回本地Node进程，不能把宿主接口描述当唯一执行隔离。Star gate的弹窗/设备流与persona是不同层，源码明确persona不被star门控；star不是分析授权凭证。封印提示与多层请求/说明改写使操作者难从原始聊天归因最终行为，审计须保存实际生效提示和执行证据，不应仅看CASE编号或拒绝统计。运行重试也可能增加模型费用，效果与实际次数需测，不能承诺节省。

#### 证据与依据

**依据 1 · 源码核查**：[packages/helmd/src/index.ts:30-51](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/index.ts#L30-L51)

实际注册多层改写。

<details>
<summary>查看原文（22行）</summary>

```text
export function apply(ctx: Context): void {
  // Description wash FIRST: normalize any "denial is final" tool wording before
  // any domain tool registers (defensive layer — current helmd descriptions are clean).
  const unwash = applyDescriptionWash(ctx)
  // Persistence wrap FIRST: every later-registered domain tool gains
  // evidence persistence without per-tool edits (soft gate).
  const unwrap = applyPersistenceWrap(ctx)
  try {
    // ICA context: behavior demonstrations as durable user-role snapshot (L2).
    // Registered before everything else — it needs systemPrompt only.
    registerIcaContext(ctx)

    // Bootstrap filter: first request only exposes the platform shell + read
    applyBootstrapFilter(ctx, {
      shellTools: [NATIVE_SHELL],
      commonTools: ['read'],
      promoteOn: 'either',
    })

    // Advisory ledger: producers submit before the renderer runs its post-next render.
    registerAdvisoryHook(ctx)
    registerLlmStreamHook(ctx)
```

</details>

**依据 2 · 源码核查**：[packages/helmd/src/tool-wash.ts:85-124](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/tool-wash.ts#L85-L124)

既有/后续工具与参数说明改写范围。

<details>
<summary>查看原文（40行）</summary>

```text
export function applyDescriptionWash(ctx: unknown, verbose = false): () => void {
  const target = (ctx as { tools: unknown }).tools as {
    register: (def: Record<string, unknown>) => void
    get?: (name: string, scope?: unknown) => { description?: unknown; parameters?: unknown; name?: unknown } | undefined
  }
  // 追溯清洗（retro-wash）：先于 wrap 执行，覆盖在 helmd apply 之前注册的宿主工具。
  if (typeof target.get === 'function') {
    for (const name of HOST_TOOL_NAMES) {
      try {
        const def = target.get(name)
        if (def && washDefinitionInPlace(def) && verbose) {
          console.log(`[helmd/tool-wash] ${name}: retro-washed`)
        }
      } catch {
        // registry 拒绝/未注册 — 跳过，宿主版本差异不应让插件装载失败
      }
    }
  }
  const originalRegister = target.register
  target.register = (def) => {
    if (def && typeof def.description === 'string') {
      const washed = washDescription(def.description)
      if (washed !== def.description) {
        if (verbose) console.log(`[helmd/tool-wash] ${def.name}: description washed`)
        def.description = washed
      }
      const params = def.parameters as Record<string, { description?: string }> | undefined
      if (params) {
        for (const [key, param] of Object.entries(params)) {
          if (param && typeof param.description === 'string') {
            const p = washDescription(param.description)
            if (p !== param.description) {
              if (verbose) console.log(`[helmd/tool-wash] ${def.name}.${key}: description washed`)
              param.description = p
            }
          }
        }
      }
    }
    return originalRegister.call(target, def)
```

</details>

**依据 3 · 源码核查**：[packages/helmd/src/llm-stream-hook.ts:139-140](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/llm-stream-hook.ts#L139-L140)

默认模式和重试预算。

```text
const MAX_RETRIES = Math.max(1, Number(process.env.HELMD_STREAM_RETRIES ?? 3))
const MODE = (process.env.HELMD_STREAM_MODE ?? 'reactive').toLowerCase()
```

**依据 4 · 源码核查**：[packages/helmd/src/llm-stream-hook.ts:530-547](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/llm-stream-hook.ts#L530-L547)

hook注册与嵌套模型调用。

<details>
<summary>查看原文（18行）</summary>

```text
export function registerLlmStreamHook(ctx: Context): void {
  const host = ctx as any
  if (typeof host?.on !== 'function') return

  host.on('llm/stream', async function* (options: any, next: () => AsyncIterable<Chunk>) {
    if (MODE === 'off') {
      yield* next()
      return
    }

    const attempt = Math.max(0, Number(options?.__helmdAttempt ?? 0))
    const isLastAttempt = attempt >= MAX_RETRIES
    const abortable = !isLastAttempt

    const streamNested = async function* (nextAttempt: number, failureClass: FailureClass): AsyncGenerator<Chunk> {
      const llm = safeService<{ stream?: (req: any) => AsyncIterable<Chunk> }>(ctx, 'llm')
      if (llm != null && typeof llm.stream === 'function') {
        retryCount++
```

</details>

**依据 5 · 源码核查**：[packages/helmd/src/seam.ts:107-146](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/seam.ts#L107-L146)

宿主执行到本地fallback。

<details>
<summary>查看原文（40行）</summary>

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
  } catch (error) {
    const e = error as any
    throw new Error(`${program} failed: ${e?.stderr ?? e?.message ?? String(e)}`)
  }
```

</details>

**依据 6 · 源码核查**：[packages/helmd/src/gate.ts:1-9](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/gate.ts#L1-L9)

persona不由star门控。

```text
// Star gate for helm-d.
//
// The persona is never gated: the active profile body always loads. The only
// surface is the web panel popup (GET /api/helmd/gate) plus the CLI code file;
// no model-facing tool is registered, so nothing about the ask enters a session.
//
// The device-flow session is a module singleton: one user_code at a time, polled
// in the background, re-issued on expiry. The token is discarded inside
// star-gate.ts (verifyStar) — nothing credential-shaped crosses this module.
```

#### 缺口

- 封印人设正文和全部领域执行脚本没有完整独立审计。
  **影响**：不据静态结构推断实际分析准确性或宿主执行保障。
  **进一步探讨**：由具审计能力者在无网络离线样本环境记录最终提示、工具定义与实际调用，确认授权边界和结果正确性，不能靠减少拒绝验收。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用和退出如何界定，可提出什么可证伪改进？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议观察。证据组织与行为干预捆绑，本轮没有确认只启用证据层且负担可控的交付路径；不把它直接接入重要安全报告。首次需核宿主指纹、preset、人设、脚本、解释器和样本范围；持续有模型重试、进程资源、证据增长及人工审阅；失败需重绑定并核部分动作与工件，禁用不会自动迁走案例或撤销脚本副作用。现金/时间均未知，不能用MIT、目录或按钮状态填成零成本。

可借鉴横切持久化与磁盘resume，但应分离已执行动作、原始完整hash、留存截断hash、引用摘录和人工支持判定。当前只有编号和非空命令，未验证假设是增加逐finding摘录与独立复核，并让证据层可不启用描述/模型干预。固定离线样本、模型及总预算，对照人工证据表、当前机制和分离+复核方案，盲审结论支持率、遗漏、重复执行、人工时间及模型费用。若支持率不提高，或新增复核/接线负担超过减少的返工，就否定，不把未做方案计成当前能力。

#### 证据与依据

**依据 1 · 源码核查**：[packages/helmd/src/persist.ts:90-108](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/persist.ts#L90-L108)

可独立思考的注册横切层。

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

**依据 2 · 源码核查**：[packages/helmd/src/case.ts:238-258](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/case.ts#L238-L258)

完整hash与留存范围的界面需求。

<details>
<summary>查看原文（21行）</summary>

```text
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

**依据 3 · 源码核查**：[packages/helmd/src/tools/caseflow.ts:215-230](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/tools/caseflow.ts#L215-L230)

当前finding校验不足语义判断。

<details>
<summary>查看原文（16行）</summary>

```text
    async execute(args: { title: string; detail: string; evidence_ids: string[]; repro_cmd: string }, exec?: ExecLike) {
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
      await appendFinding(active.dir, args.title, args.detail, args.evidence_ids ?? [], args.repro_cmd)
      return `finding recorded: ${args.title} [${(args.evidence_ids ?? []).join(', ')}]\nrepro: ${args.repro_cmd.trim()}`
```

</details>

**依据 4 · 源码核查**：[packages/helmd/src/index.ts:30-51](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/index.ts#L30-L51)

证据与行为干预捆绑。

<details>
<summary>查看原文（22行）</summary>

```text
export function apply(ctx: Context): void {
  // Description wash FIRST: normalize any "denial is final" tool wording before
  // any domain tool registers (defensive layer — current helmd descriptions are clean).
  const unwash = applyDescriptionWash(ctx)
  // Persistence wrap FIRST: every later-registered domain tool gains
  // evidence persistence without per-tool edits (soft gate).
  const unwrap = applyPersistenceWrap(ctx)
  try {
    // ICA context: behavior demonstrations as durable user-role snapshot (L2).
    // Registered before everything else — it needs systemPrompt only.
    registerIcaContext(ctx)

    // Bootstrap filter: first request only exposes the platform shell + read
    applyBootstrapFilter(ctx, {
      shellTools: [NATIVE_SHELL],
      commonTools: ['read'],
      promoteOn: 'either',
    })

    // Advisory ledger: producers submit before the renderer runs its post-next render.
    registerAdvisoryHook(ctx)
    registerLlmStreamHook(ctx)
```

</details>

#### 缺口

- 没有分离证据层的已验收配置、真实采用与合格任务成本。
  **影响**：不据静态结构推断实际分析准确性或宿主执行保障。
  **进一步探讨**：先核可审完整源码与隔离方案，再用新离线样本对照；未改善正确性或恢复负担时停止。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 健康入口何时自动写preset，备份与生效边界是什么？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

health的apply在webServer/tools就绪后调用evaluateHealth并保存启动期结果。evaluateHealth先判断healable状态，再读实际healPolicy：默认auto对带本生成器指纹的STALE/HOST_UPGRADED尝试修复，无header不默认覆盖；off不写，force可对可修复状态强制生成。函数上方仍有“default report-only”的陈旧注释，实际分支以healPolicy/shouldRepair为准。修复先尝试copyFileSync到同名.bak，但备份失败被吞而不阻止后续写入，因此不能承诺一定保有恢复点。

resolveGenerator只在预期安装布局找到脚本时生效；找不到返回unavailable。找到后spawnSync当前Node运行gen-preset --out目标，限60秒；生成器读取宿主standard，去除原persona再加入本包persona/helmd行，构成带宿主hash的patch。已有内容相同只保mtime，否则mkdir后writeFileSync直接覆盖，并非原子rename或全局事务。脚本失败、写盘/备份权限、宿主standard不兼容都可能使修复未完成；强制覆盖尤其要防手工文件。生成后只重评静态结构，仍须用户重启Host并核首请求工具目录，不能把healed当运行中preset已正确替换。首次接入和失败恢复都应记录原patch、.bak是否确实存在、实际新内容和重启结果。

#### 证据与依据

**依据 1 · 源码核查**：[packages/helmd/src/health.ts:120-143](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/health.ts#L120-L143)

真实auto/off/force策略。

<details>
<summary>查看原文（24行）</summary>

```text
/**
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
```

</details>

**依据 2 · 源码核查**：[packages/helmd/src/health.ts:153-160](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/health.ts#L153-L160)

安装布局与生成器可得性。

```text
/** Locate the bundled generator that rewrites the deployed preset from the host standard. */
function resolveGenerator(): string | null {
  try {
    const p = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', 'scripts', 'gen-preset.mjs')
    return existsSync(p) ? p : null
  } catch {
    return null
  }
```

**依据 3 · 源码核查**：[packages/helmd/src/health.ts:237-261](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/health.ts#L237-L261)

备份失败不阻止、同步生成与超时。

<details>
<summary>查看原文（25行）</summary>

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
  } catch (e) {
    return { healed: false, verdict: `failed (${(e as Error).message})` }
```

</details>

**依据 4 · 源码核查**：[packages/helmd/src/health.ts:351-365](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/health.ts#L351-L365)

判状态后写入并重评。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[packages/helmd/src/health.ts:373-385](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/packages/helmd/src/health.ts#L373-L385)

apply实际调用健康评估。

<details>
<summary>查看原文（13行）</summary>

```text
export function apply(ctx: Context): void {
  // tools 必须在列：api-routes 的 /api/helmd/tools 读 ctx.tools，cordis 的注入守卫
  // 会对未声明的服务抛 `cannot get property "tools" without inject`（路由处理器
  // 接住后对外表现为 HTTP 500）。
  ctx.inject(['webServer', 'tools'], (webCtx) => {
    try {
      // Once per boot — the standing-mount semantics make boot the only
      // moment this verdict is true (see module comment).
      const health = evaluateHealth()
      registerHelmdApi(webCtx, () => health)
    } catch (e) {
      console.error(`[helmd-health] webServer route registration failed: ${String((e as Error)?.message ?? e)}`)
    }
```

</details>

**依据 6 · 源码核查**：[scripts/gen-preset.mjs:3-12](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/scripts/gen-preset.mjs#L3-L12)

生成内容来源与替换职责。

<details>
<summary>查看原文（10行）</summary>

```text
 * gen-preset.mjs — generate the package-internal preset patch
 * (`preset.generated.patch.yml`) from the HOST's own installed standard preset.
 *
 * 0.1.7 shape: a preset is ONE composition entry (`name: '@deepseek-ai/dsh-agent-preset'`)
 * whose `config.plugins` list carries the platform rows; the standard lives at
 * `<dsh>/…/dsh-web-app/presets/standard.patch.yml`. Our generated file is a
 * sibling insert-patch declaring preset id `helmd`, loaded through the bundle's
 * `dsh.bundle.patch` array — there is no `.agent-presets/` deployment step anymore.
 *
 * Output = host `config.plugins` − host persona + luna persona + helmd row.
```

</details>

**依据 7 · 源码核查**：[scripts/gen-preset.mjs:380-400](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/scripts/gen-preset.mjs#L380-L400)

相同内容保持mtime，否则直接写目标。

<details>
<summary>查看原文（21行）</summary>

```text
let wroteAny = false
for (const p of outPaths) {
  const oldFp = fileFingerprint(p)
  mkdirSync(dirname(p), { recursive: true })
  // Avoid changing mtime when the generated bytes are already current. dsh
  // uses the composition file stamp to decide whether to rebuild a standing
  // mount; a no-op install must not trigger a second registration attempt.
  let current = null
  try { current = readFileSync(p, 'utf8') } catch { /* new output */ }
  if (current !== null && normalizeEol(current) === generated) {
    console.log(`unchanged: ${p}`)
    continue
  }
  writeFileSync(p, generated, 'utf8')
  wroteAny = true
  console.log(`generated: ${p}`)
  if (oldFp !== null && oldFp !== hostHash) {
    console.log(`  note: host standard changed since last generation (${oldFp.slice(0, 12)}… → ${hostHash.slice(0, 12)}…)`)
  }
}
if (!wroteAny) console.log('nothing to write')
```

</details>

#### 缺口

- 生成脚本与宿主布局/权限、备份失败、写盘中断和重启后的实际目录尚未验收。
  **影响**：不据静态结构推断实际分析准确性或宿主执行保障。
  **进一步探讨**：在独立副本分别触发auto/off/force、缺header、备份失败及生成中断，逐文件核旧/新/.bak，再重启检查目录，不能以healed代通过。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
