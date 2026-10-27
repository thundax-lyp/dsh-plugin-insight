# dsh-reasoning-tiers

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[fe642c8](https://github.com/1069137617/dsh-reasoning-tiers/tree/fe642c8ec878b6ba46a7c1831fc6cea557083e5b)

<!-- BEGIN META -->
[![npm 30d 1,017](https://img.shields.io/static/v1?label=npm+30d&message=1%2C017&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-reasoning-tiers) [![最新发布 2026-09-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-reasoning-tiers)
<!-- END META -->

> **实现功能**：按模型知识规则补齐pi-ai推理档位声明，并提供模型上下文、输出与图片能力编辑页。

> **核心亮点**：不接管adapter而补齐能力声明/选择器接线，尊重已有档位并显示来源，未证明模型推理增强。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：重试实际patch与原plan记录可能不同，revert失败仍消费remaining，journal缺profile身份；有undo不等所有失败可恢复。详见[Q02](#research-q02)。

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
  - [Q01 · 适用什么场景，匹配到配置写入怎样运行？](#detail-section-11)
  - [Q02 · 集成贡献和最关键恢复缺口是什么？](#detail-section-12)
  - [Q03 · 依赖、配置与退出条件是什么？](#detail-section-13)
  - [Q04 · 首次、持续和失败恢复成本效果怎样判断？](#detail-section-14)
  - [Q05 · 可复用机制与版本绑定写收据假设如何证伪？](#detail-section-15)
  - [Q06 · 当前建议和停止标准是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护DSH第三方pi-ai模型metadata缺口，需真实协议支持与可恢复配置。

手工按provider协议给模型最小配置patch可替代；插件减少规则接线但增知识/自动写/恢复责任。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 档位填充 | 补reasoningEfforts | metadata声明不证明远端支持 |
| compat | 适配协议思考字段 | 默认开启，规则需按模型核 |
| 能力页 | context/max/image声明 | 不是测得真实模型极限 |
| journal/revert | 记录与移除插件写入 | 重试/失败/profile边界待修 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20、DSH settings/llm及Cordis peers | Host必需 | 读配置/能力并写pi-ai section | 宿主契约版本需固定核对 |
| llm-pi-ai配置模型与协议 | 生效必需 | reasoningEfforts/dialect声明 | 其他adapter不能推断同样适用 |
| 可写当前profile settings与DSH_HOME journal | 自动填充/撤销必需 | 真实配置与撤销依据 | 两者不是原子事务，先备份 |
| DSH0.2 configForms/Client | 能力页必需 | 编辑context/max/image | Host兼容旧版不等Client同样可用 |
| 真实provider支持 | 实际推理必需 | 解释所发effort字段 | metadata可选不证明远端接受或效果 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份profile与journal，先关闭autofill/revert核对计划 | 默认会自动写，不能无感装入生产profile |
| 核对 | 维护者确认目标模型/协议/已有设置 | 区分知识表推测与真实支持 |
| 写入 | 明确开启后检查实际settings差异与journal | revision冲突重算后记录要对应实际写集 |
| 撤销/退出 | 核对revert返回及原配置，不单看完成日志 | 停用/卸载不自动删已写配置 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 构建/peer、备份空间，金额未知 | 模型协议、知识表、计划与配置核对 | 默认最多200次能力探测非生成任务 |
| 持续使用 | 设置事件重算、元数据探测与journal读写 | 模型变更/真实支持维护 | 真实更高effort可能改变模型耗时/费用，未测 |
| 失败恢复 | 配置回滚、journal恢复与重新核对 | 区分设置已写/记录失败/撤销失败 | journal缺失或坏文件按空处理 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 档位可选 | 写reasoningEfforts及协议compat计划 | 远端是否接受/语义相同 |
| 能力编辑 | context/max/image有纯编辑逻辑 | 声明值与真实模型极限一致性 |
| 恢复 | 有journal与按值比较撤销设计 | 重试、失败与跨profile时依据不丢失 |

> **思考**：重试实际patch与原plan记录可能不同，revert失败仍消费remaining，journal缺profile身份；有undo不等所有失败可恢复。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：不接管adapter而补齐能力声明/选择器接线，尊重已有档位并显示来源，未证明模型推理增强。详见[Q01](#research-q01)与[Q02](#research-q02)。

不接管adapter而补齐能力声明/选择器接线，尊重已有档位并显示来源，未证明模型推理增强。详见[Q01](#research-q01)与[Q02](#research-q02)。

可复用的是pure plan/ladder验证、区分用户层与resolved值、尊重已有能力、revision写入和来源/置信度日志；这些减少盲目覆盖。journal原子rename能防半文件，但不把settings和日志变事务，也不解决多profile所有权。

<a id="detail-section-5"></a>

### 1.4 主要限制

重试实际patch与原plan记录可能不同，revert失败仍消费remaining，journal缺profile身份；有undo不等所有失败可恢复。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，关闭自动写并备份，先修最终写集/撤销失败保留，再评估单profile单模型。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持推理参数规则、能力探测与配置patch/journal接线；冲突重规划的实际写集和撤销状态不完全一致，不能证明可靠回滚或推理质量提升。profile/版本绑定写入收据尚未验证。

- 已检查：作者 README、包清单、源码路径 src/config.ts、src/index.ts、src/knowledge.ts、src/capabilities.ts、src/journal.ts、package.json、README.md、src/ladder.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定Host提交/重试/撤销、journal、默认配置、knowledge/ladder/plan契约与能力草稿；未调用provider或全面审计Client表单，不读全部规则外部文档。
- 下一步：进一步探讨可用settings/journal桩覆盖冲突换计划、compat降级、两profile与失败消费，再看单模型远端接受/效果。

**分析版本**

- **仓库**：[1069137617/dsh-reasoning-tiers](https://github.com/1069137617/dsh-reasoning-tiers)
- **版本号**：0.3.1（[固定提交 fe642c8](https://github.com/1069137617/dsh-reasoning-tiers/tree/fe642c8ec878b6ba46a7c1831fc6cea557083e5b)）
- **版本日期**：2026-10-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨profile/版本绑定实际写收据，commit返回最终写集，失败保留撤销依据；有迁移/恢复状态成本，未验证。详见[Q05](#research-q05)。

进一步探讨可用settings/journal桩覆盖冲突换计划、compat降级、两profile与失败消费，再看单模型远端接受/效果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1416 | — | — | 10572 |
| .mjs | source | 3 | 526 | 382 | 98 | — |
| .ts | source | 11 | 2640 | 1770 | 671 | — |
| .tsx | source | 1 | 245 | 209 | 25 | — |
| .mjs | test | 9 | 1330 | 1133 | 68 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1069137617/dsh-reasoning-tiers/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/1069137617/dsh-reasoning-tiers/issues?q=is%3Aissue+created%3A2026-09-22T05%3A57%3A26.118Z..2026-10-22T05%3A57%3A26.118Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1069137617/dsh-reasoning-tiers/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A57%3A26.118Z..2026-10-22T05%3A57%3A26.118Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查模型档位/能力声明到settings写入与撤销的实际所有权及成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 适用什么场景，匹配到配置写入怎样运行？

**研究主题**：场景与需求、功能与机制

#### 完整回答

面向在DSH用第三方pi-ai模型、已有模型缺reasoning metadata而档位选择无效的维护者，也给0.2客户端提供模型能力编辑页。输入是用户层provider/model配置、live能力元数据、知识表和可选自定义规则，输出最小设置patch与journal。合格交付需可选项对应实际协议/模型支持，保留已有设置且撤销可追溯；不是提高模型推理本身。

Host默认autofill/compatAutofill/respectExisting=true，订阅settings新旧事件合并重算，plan按模型名/协议匹配规则并探测已有能力，跳过已有档位。commit带revision更新llm-pi-ai，成功后写DSH_HOME journal；revert由记录与当前设置比较生成删除操作。Client能力页编辑provider自己的contextWindow/maxTokens/input配置，不截获模型请求。

#### 证据与依据

**依据 1 · 源码核查**：[src/config.ts:22-35](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/config.ts#L22-L35)

默认自动写、保守项与探测上限。

<details>
<summary>查看原文（14行）</summary>

```text
export const DEFAULTS = {
  autofill: true,
  revert: false,
  compatAutofill: true,
  respectExisting: true,
  alignGlobalEffort: false,
  diagnose: true,
  widenToGlobalEffort: false,
  excludeProviders: [] as string[],
  excludeModels: [] as string[],
  bootRetryDelaysMs: [1000, 2000, 4000, 8000, 16000, 30000],
  debounceMs: 250,
  maxProbes: 200,
}
```

</details>

**依据 2 · 源码核查**：[src/index.ts:130-146](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/index.ts#L130-L146)

新旧设置事件。

<details>
<summary>查看原文（17行）</summary>

```text
  // 0.2.0 renamed the document event: `settings/document-updated` announces the
  // raw section moving as `(ns, revision)`, while 0.1.x's `settings/updated`
  // carried the resolved value as `(ns, next, prev, source)`. Both name the
  // namespace first, which is all this listener reads, so both are registered:
  // a host emits exactly one of them, and an event with no emitter is inert.
  const onSettingsChanged = (ns: unknown): void => {
    if (String(ns) !== PI_AI_NS) return
    // Guard against self-excitation: our own write lands while `running` is
    // still set, and a pass with nothing left to write emits nothing anyway.
    if (running) return
    schedule('settings')
  }
  ctx.on('settings/document-updated', (ns) => {
    onSettingsChanged(ns)
  })
  ;(ctx as unknown as { on(name: string, listener: (ns: unknown) => void): unknown }).on(
    'settings/updated',
```

</details>

**依据 3 · 源码核查**：[src/index.ts:256-276](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/index.ts#L256-L276)

计划提交后journal。

<details>
<summary>查看原文（21行）</summary>

```text
/** One autofill pass: plan, write, record, report. */
async function autofillOnce(
  ctx: Context,
  config: ResolvedConfig,
  logger: Logger,
  why: string,
  tableBroken: boolean,
): Promise<void> {
  if (tableBroken) return
  const outcome = await planPass(ctx, config)
  if (outcome === undefined) return
  const { plan, revision } = outcome

  report(logger, plan, why)
  if (config.diagnose) reportTierAudit(ctx, plan, logger)
  if (Object.keys(plan.patch).length === 0) return

  const path = journalPath()
  const journal = await readJournal(path)
  if (!(await commit(ctx, config, plan.patch, revision, logger, 0))) return
  await writeJournal(path, mergeJournal(journal, plan.writes))
```

</details>

**依据 4 · 源码核查**：[src/knowledge.ts:41-59](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/knowledge.ts#L41-L59)

匹配与confidence/source字段。

<details>
<summary>查看原文（19行）</summary>

```text
/** One family's declaration. */
export interface FamilyEntry {
  /** Stable identifier for logs and tests. */
  readonly id: string
  /** Full model ids (normalized) this entry answers for. Checked first. */
  readonly exact?: readonly string[]
  /** Normalized id prefixes. Checked second. */
  readonly prefix?: readonly string[]
  /** Source text of a case-insensitive regular expression. Checked last. */
  readonly pattern?: string
  /** Declared tiers and their wire spellings. */
  readonly ladder: Ladder
  /** Dialect switches, applied only to a protocol that can carry them. */
  readonly dialect?: Dialect
  /** Protocols this entry may serve; absent means any protocol. */
  readonly protocols?: readonly KnownProtocol[]
  readonly confidence: Confidence
  /** Where the claim comes from. */
  readonly source: string
```

</details>

**依据 5 · 源码核查**：[src/capabilities.ts:71-77](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/capabilities.ts#L71-L77)

模型能力字段草稿。

```text
function draftOf(id: string, raw: Record<string, unknown>): ModelDraft {
  return {
    id,
    contextText: countText(raw.contextWindow),
    maxText: countText(raw.maxTokens),
    image: imageModeOf(raw.input),
    raw,
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 集成贡献和最关键恢复缺口是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是在不接管adapter或请求流的前提下，填补第三方模型metadata与官方选择器之间的配置空隙，保留已有档位、给规则来源/置信度和撤销记录。只是声明可选能力，不证明远端接受effort、窗口或图片，也没有任务效果对照；知识表source需逐模型核对，本轮没有读取其所有外部文档。

最关键缺口是实际设置写入与journal不是同一事务。autofill先commit再保存原plan.writes，设置revision冲突时commit内部另算新plan后仅返回boolean，外层仍记旧写集；compat失败降级去字段也仍可能记录原计划。写成功但journal失败/损坏时撤销依据可能丢失。

revert更直接地忽略commit返回false，mutate捕获失败仅日志且不向上传递，随后仍写plan.remaining，可能清掉尚未撤销字段的记录并宣告完成。journalPath仅DSH_HOME、不含profile身份，多个profile相同route/model会共享撤销记录；按当前值相等检查不能证明字段归属。以上为静态路径推导，未实际改配置。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:273-276](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/index.ts#L273-L276)

设置成功后保存原plan.writes。

```text
  const path = journalPath()
  const journal = await readJournal(path)
  if (!(await commit(ctx, config, plan.patch, revision, logger, 0))) return
  await writeJournal(path, mergeJournal(journal, plan.writes))
```

**依据 2 · 源码核查**：[src/index.ts:292-317](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/index.ts#L292-L317)

冲突重算/compat降级只返回boolean。

<details>
<summary>查看原文（26行）</summary>

```text
  try {
    await ctx.settings.update(PI_AI_NS, patch, revision)
    return true
  } catch (error) {
    const message = errorMessage(error)
    if (isConflict(error) && depth < 1) {
      // The user wrote while this pass was running: recompute against their
      // document rather than overwrite it with a stale one.
      logger.info('settings moved mid-pass; recomputing once')
      const again = await planPass(ctx, config)
      if (again === undefined || Object.keys(again.plan.patch).length === 0) return false
      return commit(ctx, config, again.plan.patch, again.revision, logger, depth + 1)
    }
    if (depth < 1 && config.compatAutofill) {
      // The provider refuses a compat switch its model's protocol does not
      // take. Retry with ladders only: the tier list is what restores the
      // control, and a rejected dialect guess should not cost it.
      logger.warn(`write refused (${message}); retrying without compat switches`)
      return commit(
        ctx,
        { ...config, compatAutofill: false },
        stripCompat(patch),
        revision,
        logger,
        depth + 1,
      )
```

</details>

**依据 3 · 源码核查**：[src/index.ts:398-408](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/index.ts#L398-L408)

忽略写结果后落remaining并完成。

<details>
<summary>查看原文（11行）</summary>

```text
  const plan = buildRevert(layer.section, journal)
  for (const entry of plan.left) logger.info(`left ${entry.route}/${entry.model} in place (${entry.reason})`)

  const quiet: ResolvedConfig = { ...config, compatAutofill: false }
  if (Object.keys(plan.patch).length > 0)
    await commit(ctx, quiet, plan.patch, layer.revision, logger, 0)
  if (plan.ops.length > 0) await mutate(ctx, plan.ops, logger)

  await writeJournal(path, plan.remaining)
  if (plan.remaining.ladders.length === 0 && plan.remaining.compat.length === 0)
    logger.info('revert complete; ledger cleared')
```

</details>

**依据 4 · 源码核查**：[src/index.ts:412-419](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/index.ts#L412-L419)

mutate失败吞成日志。

```text
async function mutate(ctx: Context, ops: readonly SettingsPathOp[], logger: Logger): Promise<void> {
  const layer = readLayer(ctx)
  if (layer === undefined) return
  try {
    await ctx.settings.mutate(PI_AI_NS, ops, layer.revision)
  } catch (error) {
    logger.error(`revert write refused: ${errorMessage(error)}`)
  }
```

**依据 5 · 源码核查**：[src/journal.ts:68-94](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/journal.ts#L68-L94)

全局路径与损坏按空。

<details>
<summary>查看原文（27行）</summary>

```text
/** Where the ledger lives. */
export function journalPath(env: Record<string, string | undefined> = process.env): string {
  return join(resolveDshHome(undefined, env), 'dsh-reasoning-tiers', 'journal.json')
}

/** An empty ledger. */
export function emptyJournal(): Journal {
  return { version: JOURNAL_VERSION, ladders: [], compat: [] }
}

/**
 * Read the ledger, tolerating absence and corruption.
 * @param path - journal location.
 * @returns the stored ledger, or an empty one.
 */
export async function readJournal(path: string): Promise<Journal> {
  let raw: string
  try {
    raw = await readFile(path, 'utf8')
  } catch {
    return emptyJournal()
  }
  try {
    return parseJournal(JSON.parse(raw))
  } catch {
    return emptyJournal()
  }
```

</details>

**依据 6 · 源码核查**：[src/journal.ts:148-160](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/journal.ts#L148-L160)

记录身份为route/model/mode。

<details>
<summary>查看原文（13行）</summary>

```text
export function mergeJournal(journal: Journal, writes: readonly WriteLike[]): Journal {
  for (const write of writes) {
    const at = journal.ladders.findIndex(
      (entry) => entry.route === write.route && entry.model === write.model && entry.mode === write.mode,
    )
    const record: LadderRecord = {
      route: write.route,
      model: write.model,
      mode: write.mode,
      ladder: write.ladder,
    }
    if (at === -1) journal.ladders.push(record)
    else journal.ladders[at] = record
```

</details>

#### 缺口

- 失败重试、journal写失败及revert拒绝未做实际故障注入。
  **影响**：不能把有撤销功能称为所有失败下可恢复。
  **进一步探讨**：可用settings/journal桩分别拒绝update/mutate/write，比较实际字段和保留写集，不改真实profile。
- 模型规则及能力声明与真实provider协议/限制未逐项验证。
  **影响**：可选档位不等远端有效或任务更好。
  **进一步探讨**：可从实际需要的单模型固定provider文档/协议和请求字段入手，区分声明、接受与任务效果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、配置与退出条件是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

包Node>=20及DSH settings/llm/home paths peers，Host支持0.1.x/0.2形状，能力页需0.2 configForms。需要当前profile的pi-ai模型设置，不把所有adapter一概套用。journal位于DSH_HOME的共享目录，备份需与实际profile成对。默认自动填充/compat开启，安装就可能写配置，停用和卸载只停止继续处理，不自动撤销旧写入。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20、DSH settings/llm及Cordis peers | Host必需 | 读配置/能力并写pi-ai section | 宿主契约版本需固定核对 |
| llm-pi-ai配置模型与协议 | 生效必需 | reasoningEfforts/dialect声明 | 其他adapter不能推断同样适用 |
| 可写当前profile settings与DSH_HOME journal | 自动填充/撤销必需 | 真实配置与撤销依据 | 两者不是原子事务，先备份 |
| DSH0.2 configForms/Client | 能力页必需 | 编辑context/max/image | Host兼容旧版不等Client同样可用 |
| 真实provider支持 | 实际推理必需 | 解释所发effort字段 | metadata可选不证明远端接受或效果 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份profile与journal，先关闭autofill/revert核对计划 | 默认会自动写，不能无感装入生产profile |
| 核对 | 维护者确认目标模型/协议/已有设置 | 区分知识表推测与真实支持 |
| 写入 | 明确开启后检查实际settings差异与journal | revision冲突重算后记录要对应实际写集 |
| 撤销/退出 | 核对revert返回及原配置，不单看完成日志 | 停用/卸载不自动删已写配置 |


#### 证据与依据

**依据 1 · 源码核查**：[package.json:50-76](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/package.json#L50-L76)

引擎与peer。

<details>
<summary>查看原文（27行）</summary>

```text
  "engines": {
    "node": ">=20"
  },
  "os": [
    "darwin",
    "linux",
    "win32"
  ],
  "license": "MIT",
  "scripts": {
    "prepare": "npm run build",
    "build": "npm run build:host && npm run build:client",
    "build:host": "tsc -p tsconfig.json",
    "build:client": "node scripts/build.mjs",
    "watch": "node scripts/build.mjs --watch",
    "clean": "node -e \"require('node:fs').rmSync('lib',{recursive:true,force:true})\"",
    "typecheck": "tsc -p tsconfig.json --noEmit && tsc -p tsconfig.client.json --noEmit",
    "pretest": "npm run build",
    "test": "node --test",
    "verify:install": "node scripts/verify-install.mjs",
    "prepublishOnly": "npm test"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.2",
    "@deepseek-ai/dsh-home-paths": ">=0.1.5-rc.1 || >=0.2.0-rc.1",
    "@deepseek-ai/dsh-llm": ">=0.1.5-rc.1 || >=0.2.0-rc.1",
    "@deepseek-ai/dsh-settings": ">=0.1.5-rc.1 || >=0.2.0-rc.1"
```

</details>

**依据 2 · 作者声明**：[README.md:15-22](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/README.md#L15-L22)

作者版本与能力页边界。

```text
0.3.1 adapts to **DSH 0.2.0** (desktop 0.2.0-rc.2): the host half rides the renamed
`settings/document-updated` event and reads resolved sections off `describe()` (0.2.0 dropped
`settings.get`), and the browser half registers through the `configForms` service that replaced
`settingsScope`. The 0.1.x event and `get()` stay supported in the host half; the capabilities
page requires a 0.2.0 host.

No adapter takeover, no request interception. The tier writes happen once, conservatively, and
with an undo; the capabilities page only edits the provider's own settings through the standard
```

**依据 3 · 源码核查**：[src/config.ts:22-35](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/config.ts#L22-L35)

默认自动填充。

<details>
<summary>查看原文（14行）</summary>

```text
export const DEFAULTS = {
  autofill: true,
  revert: false,
  compatAutofill: true,
  respectExisting: true,
  alignGlobalEffort: false,
  diagnose: true,
  widenToGlobalEffort: false,
  excludeProviders: [] as string[],
  excludeModels: [] as string[],
  bootRetryDelaysMs: [1000, 2000, 4000, 8000, 16000, 30000],
  debounceMs: 250,
  maxProbes: 200,
}
```

</details>

**依据 4 · 源码核查**：[src/journal.ts:68-70](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/journal.ts#L68-L70)

共享journal路径。

```text
/** Where the ledger lives. */
export function journalPath(env: Record<string, string | undefined> = process.env): string {
  return join(resolveDshHome(undefined, env), 'dsh-reasoning-tiers', 'journal.json')
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续和失败恢复成本效果怎样判断？

**研究主题**：效果与总成本

#### 完整回答

插件主要做设置/metadata探测，不直接推理生成；因此自身不能给出模型效果提升。声明更高effort或上下文只是改变可选配置，真实请求耗时/费用和任务质量仍需单模型对照，不能因为选择器出现max就计为成功。配置事件、boot重试和最多200探测有资源/维护成本。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 构建/peer、备份空间，金额未知 | 模型协议、知识表、计划与配置核对 | 默认最多200次能力探测非生成任务 |
| 持续使用 | 设置事件重算、元数据探测与journal读写 | 模型变更/真实支持维护 | 真实更高effort可能改变模型耗时/费用，未测 |
| 失败恢复 | 配置回滚、journal恢复与重新核对 | 区分设置已写/记录失败/撤销失败 | journal缺失或坏文件按空处理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 档位可选 | 写reasoningEfforts及协议compat计划 | 远端是否接受/语义相同 |
| 能力编辑 | context/max/image有纯编辑逻辑 | 声明值与真实模型极限一致性 |
| 恢复 | 有journal与按值比较撤销设计 | 重试、失败与跨profile时依据不丢失 |

与手工最小设置patch比较，应统计实际字段正确率、远端接受、完整任务质量/资源和撤销人时，不按知识表覆盖模型数评优。

#### 证据与依据

**依据 1 · 源码核查**：[src/config.ts:22-35](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/config.ts#L22-L35)

事件/boot/探测参数。

<details>
<summary>查看原文（14行）</summary>

```text
export const DEFAULTS = {
  autofill: true,
  revert: false,
  compatAutofill: true,
  respectExisting: true,
  alignGlobalEffort: false,
  diagnose: true,
  widenToGlobalEffort: false,
  excludeProviders: [] as string[],
  excludeModels: [] as string[],
  bootRetryDelaysMs: [1000, 2000, 4000, 8000, 16000, 30000],
  debounceMs: 250,
  maxProbes: 200,
}
```

</details>

**依据 2 · 源码核查**：[src/ladder.ts:15-17](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/ladder.ts#L15-L17)

显式dict替换能力而非继承。

```text
 * Declaring a dict **replaces** the inherited capability: a level absent from
 * the dict is pinned unsupported, not inherited. That asymmetry is why this
 * plugin never rewrites a model that already offers a tier — see `plan.ts`.
```

**依据 3 · 源码核查**：[src/index.ts:273-276](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/index.ts#L273-L276)

配置/记录两步成本。

```text
  const path = journalPath()
  const journal = await readJournal(path)
  if (!(await commit(ctx, config, plan.patch, revision, logger, 0))) return
  await writeJournal(path, mergeJournal(journal, plan.writes))
```

**依据 4 · 源码核查**：[src/journal.ts:83-94](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/journal.ts#L83-L94)

失败/坏文件为空。

<details>
<summary>查看原文（12行）</summary>

```text
export async function readJournal(path: string): Promise<Journal> {
  let raw: string
  try {
    raw = await readFile(path, 'utf8')
  } catch {
    return emptyJournal()
  }
  try {
    return parseJournal(JSON.parse(raw))
  } catch {
    return emptyJournal()
  }
```

</details>

#### 缺口

- 没有同模型同任务真实请求接受、质量、耗时/tokens与手工配置对照。
  **影响**：不能承诺推理能力/质量改善或省成本。
  **进一步探讨**：可先核字段和provider接受，再按明确授权比较相同任务的effort输出及完整资源，不只看UI档位。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可复用机制与版本绑定写收据假设如何证伪？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可复用的是pure plan/ladder验证、区分用户层与resolved值、尊重已有能力、revision写入和来源/置信度日志；这些减少盲目覆盖。journal原子rename能防半文件，但不把settings和日志变事务，也不解决多profile所有权。

可探讨未验证的“profile/版本绑定实际写收据”。commit返回最终实际写集/前后revision，重试后使用新计划记录；先写待执行意图，提交后标完成，撤销仅在全部对应写成功后消耗记录，失败保留待恢复。journal加profile/settings文档身份与跨进程协调。相对当前boolean，它明确哪次副作用由谁拥有。代价是迁移、崩溃恢复与部分完成状态。最小夹具包括revision冲突换计划、compat降级、日志失败、update/mutate拒绝与两profile同名模型，比较丢失记录/错误撤销；若失败后仍宣告完成或丢依据，应否定当前收据协议。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:292-317](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/index.ts#L292-L317)

重试计划只返回boolean。

<details>
<summary>查看原文（26行）</summary>

```text
  try {
    await ctx.settings.update(PI_AI_NS, patch, revision)
    return true
  } catch (error) {
    const message = errorMessage(error)
    if (isConflict(error) && depth < 1) {
      // The user wrote while this pass was running: recompute against their
      // document rather than overwrite it with a stale one.
      logger.info('settings moved mid-pass; recomputing once')
      const again = await planPass(ctx, config)
      if (again === undefined || Object.keys(again.plan.patch).length === 0) return false
      return commit(ctx, config, again.plan.patch, again.revision, logger, depth + 1)
    }
    if (depth < 1 && config.compatAutofill) {
      // The provider refuses a compat switch its model's protocol does not
      // take. Retry with ladders only: the tier list is what restores the
      // control, and a rejected dialect guess should not cost it.
      logger.warn(`write refused (${message}); retrying without compat switches`)
      return commit(
        ctx,
        { ...config, compatAutofill: false },
        stripCompat(patch),
        revision,
        logger,
        depth + 1,
      )
```

</details>

**依据 2 · 源码核查**：[src/index.ts:398-418](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/index.ts#L398-L418)

撤销失败仍消费依据的起点。

<details>
<summary>查看原文（21行）</summary>

```text
  const plan = buildRevert(layer.section, journal)
  for (const entry of plan.left) logger.info(`left ${entry.route}/${entry.model} in place (${entry.reason})`)

  const quiet: ResolvedConfig = { ...config, compatAutofill: false }
  if (Object.keys(plan.patch).length > 0)
    await commit(ctx, quiet, plan.patch, layer.revision, logger, 0)
  if (plan.ops.length > 0) await mutate(ctx, plan.ops, logger)

  await writeJournal(path, plan.remaining)
  if (plan.remaining.ladders.length === 0 && plan.remaining.compat.length === 0)
    logger.info('revert complete; ledger cleared')
}

/** Apply path-addressed unsets; a merge alone cannot delete a dict key. */
async function mutate(ctx: Context, ops: readonly SettingsPathOp[], logger: Logger): Promise<void> {
  const layer = readLayer(ctx)
  if (layer === undefined) return
  try {
    await ctx.settings.mutate(PI_AI_NS, ops, layer.revision)
  } catch (error) {
    logger.error(`revert write refused: ${errorMessage(error)}`)
```

</details>

**依据 3 · 源码核查**：[src/journal.ts:126-130](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/journal.ts#L126-L130)

原子journal写。

```text
export async function writeJournal(path: string, journal: Journal): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  const temp = `${path}.${String(process.pid)}.tmp`
  await writeFile(temp, `${JSON.stringify(journal, null, 2)}\n`, 'utf8')
  await rename(temp, path)
```

**依据 4 · 源码核查**：[src/journal.ts:148-160](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/journal.ts#L148-L160)

当前记录身份。

<details>
<summary>查看原文（13行）</summary>

```text
export function mergeJournal(journal: Journal, writes: readonly WriteLike[]): Journal {
  for (const write of writes) {
    const at = journal.ladders.findIndex(
      (entry) => entry.route === write.route && entry.model === write.model && entry.mode === write.mode,
    )
    const record: LadderRecord = {
      route: write.route,
      model: write.model,
      mode: write.mode,
      ladder: write.ladder,
    }
    if (at === -1) journal.ladders.push(record)
    else journal.ladders[at] = record
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前建议和停止标准是什么？

**研究主题**：采用判断

#### 完整回答

推荐observe。metadata补齐和能力页有清楚用途，但默认自动配置写入与撤销依据不一致影响采用，不能靠“有undo”口号放心安装。优先备份并关闭autofill/revert做源码/计划核对，先修实际写集和失败保留，再评估单profile trial。

继续探讨可用无真实settings桩验证冲突/失败/两profile，再固定单模型provider协议。出现journal缺失/坏文件、实际patch与记录不同、revert拒绝却宣告完成、已有能力被压缩或远端不接受字段，应停止自动写与反复撤销，保存原profile/journal盘点。依据Q02/Q04，不把出现档位当模型增强，本轮未调用模型或写配置。

#### 证据与依据

**依据 1 · 源码核查**：[src/config.ts:22-29](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/config.ts#L22-L29)

默认动作与关闭选项。

```text
export const DEFAULTS = {
  autofill: true,
  revert: false,
  compatAutofill: true,
  respectExisting: true,
  alignGlobalEffort: false,
  diagnose: true,
  widenToGlobalEffort: false,
```

**依据 2 · 源码核查**：[src/index.ts:273-276](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/index.ts#L273-L276)

实际写与记录顺序。

```text
  const path = journalPath()
  const journal = await readJournal(path)
  if (!(await commit(ctx, config, plan.patch, revision, logger, 0))) return
  await writeJournal(path, mergeJournal(journal, plan.writes))
```

**依据 3 · 源码核查**：[src/index.ts:398-418](https://github.com/1069137617/dsh-reasoning-tiers/blob/fe642c8ec878b6ba46a7c1831fc6cea557083e5b/src/index.ts#L398-L418)

撤销失败边界。

<details>
<summary>查看原文（21行）</summary>

```text
  const plan = buildRevert(layer.section, journal)
  for (const entry of plan.left) logger.info(`left ${entry.route}/${entry.model} in place (${entry.reason})`)

  const quiet: ResolvedConfig = { ...config, compatAutofill: false }
  if (Object.keys(plan.patch).length > 0)
    await commit(ctx, quiet, plan.patch, layer.revision, logger, 0)
  if (plan.ops.length > 0) await mutate(ctx, plan.ops, logger)

  await writeJournal(path, plan.remaining)
  if (plan.remaining.ladders.length === 0 && plan.remaining.compat.length === 0)
    logger.info('revert complete; ledger cleared')
}

/** Apply path-addressed unsets; a merge alone cannot delete a dict key. */
async function mutate(ctx: Context, ops: readonly SettingsPathOp[], logger: Logger): Promise<void> {
  const layer = readLayer(ctx)
  if (layer === undefined) return
  try {
    await ctx.settings.mutate(PI_AI_NS, ops, layer.revision)
  } catch (error) {
    logger.error(`revert write refused: ${errorMessage(error)}`)
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
