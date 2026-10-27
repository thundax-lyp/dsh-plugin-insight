# helm-d

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c0820c7](https://github.com/ADWMC/helm-d/tree/c0820c76202cde0dde952706381cd7921a68fe14)

<!-- BEGIN META -->
[![GitHub ★ 700](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=700&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ADWMC/helm-d)
<!-- END META -->

> **功能**：为 DSH 提供领域参考、分析工具和带编号证据的安全分析案卷

> **亮点**：[Q01](#research-q01) 表明样本哈希、工具输出编号、时间线和恢复清单形成了可交接案卷，这是集成贡献；底层分析效果来自实际工具、模型和人工判断，不能归于“不拒绝输出”。

> **主要限制**：[Q02](#research-q02) 中编号存在性检查允许空引用，也不验证关联性；关闭案卷只检查数量。因此案卷关闭不能作为安全分析正确性的验收决定。

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
  - [Q01 · 安全分析案卷相比手工目录与报告多约束了什么？](#detail-section-11)
  - [Q02 · 工具结果如何入链，找不到证据及失败后如何处理？](#detail-section-12)
  - [Q03 · 人设、领域工具与宿主依赖是否改变可控性和复用成本？](#detail-section-13)
  - [Q04 · 一次可复核的分析交付需要多少配置与复核，谁适合试用？](#detail-section-14)
  - [Q05 · 从编号校验能否推导更强的证据验收机制？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：对反复做授权样本分析且需要向同事交接结论的人，合格结果应当包含样本身份、实际观察、结论依据和可恢复进度。原办法可以是一个手工目录加 Markdown 报告。helm-d 把建目录、复制样本、SHA-256 记录、时间线和恢复清单组成固定案卷，减少模型把依据只留在聊天中的机会。这是流程集成贡献，不是新的分析算法。

关键反例是证据编号存在并不证明证据支持结论。validateEvidenceIds 只扫描文件名，再检查传入数组中是否有未知编号；空数组也没有 missing。record_finding 随后直接追加 title 和 detail。因此 README 所称“幻觉无处落脚”超出了实际约束。它能拒绝不存在的编号，不能阻止不引用证据或引用无关证据的结论，人工语义复核仍是验收主体。

基线是独立目录、样本 SHA-256 清单和人工 Markdown 证据表。插件减少案卷组织动作，但证据语义核查没有被自动替代。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 文件案卷 | 保存样本哈希、结果编号与进度 | 需要可写目录，部分输出才自动保存 |
| 编号检查 | 拒绝不存在的证据编号 | 不拒绝空引用，不验证语义关联 |
| 宿主集成 | 提示、工具与模型流接线 | 需要匹配版本，可能改变调用与成本 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node >=22.19 与匹配 DSH 工具/设置 peer 范围 | 启动必需 | 加载 Cordis 插件与预设 | 先核对包范围，不能以根 workspace 安装代替 |
| 可写工作目录 | 案卷必需 | 样本副本、证据与时间线 | 落盘失败须核对原工具是否已执行 |
| 模型与所选领域工具 | 任务必需 | 实际分析与结果产生 | 退回原工具及手工证据表 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 维护者隔离配置并核对 DSH 与包范围 | 工具、提示与模型请求变化可记录 |
| 开案 | 分析人员指定目录和授权样本 | 样本哈希与案卷文件匹配 |
| 分析 | 工具执行后保存输出，人工补存外部结果 | 每条结论实际引用支持材料 |
| 验收 | 复核者检查内容后关闭并备份 | 关闭标记不代替语义验收，失败回到手工表 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH、模型及存储资源，金额未知 | 配置版本、工作目录和隔离检查，时间未知 | 未安装目标代码 |
| 持续使用 | 模型调用、可能额外重试及样本存储 | 逐条证据语义复核与恢复清单维护 | 无同任务账单及耗时 |
| 失败恢复 | 重跑或重建可能增加调用 | 核对工具已执行副作用、截断和时间线 | 写文件与时间线无事务 |
| 退出 | 保留样本和文本案卷占用磁盘 | 禁用插件并验证钩子还原 | 同版禁用未验收 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 案卷组织 | 自动样本哈希、证据编号与时间线 | 对交接耗时的实际改善 |
| 结论约束 | 拒绝不存在编号 | 空引用与无关引用能通过，不能保证正确性 |
| 总成本 | 存在额外模型调用路径 | 每份合格案卷的 token 与人工成本 |

> **思考**：[Q02](#research-q02) 中编号存在性检查允许空引用，也不验证关联性；关闭案卷只检查数量。因此案卷关闭不能作为安全分析正确性的验收决定。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 表明样本哈希、工具输出编号、时间线和恢复清单形成了可交接案卷，这是集成贡献；底层分析效果来自实际工具、模型和人工判断，不能归于“不拒绝输出”。

[Q02](#research-q02) 的纯文件案卷易于检查，持久化包装减少逐工具重复代码；但其范围有限、写入无跨文件事务。空引用和文件名集合检查是已确认边界；跨进程编号竞争与宿主钩子兼容是待验证风险，不能混作已发生事故。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 中编号存在性检查允许空引用，也不验证关联性；关闭案卷只检查数量。因此案卷关闭不能作为安全分析正确性的验收决定。

<a id="detail-section-6"></a>

### 1.5 使用建议

采用单位是一份可由他人复核的授权样本案卷，不是一次工具输出或一条 finding。需要已能维护 DSH 的分析人员配置匹配版本、指定工作目录、开案、保存外部命令输出、逐条核查结论与证据，再关闭并归档。工具保存只覆盖部分字符串输出，人工仍须识别未入链、长内容截断、落盘失败后原操作是否完成。 当前整体建议观察。已有机制足以借鉴文件案卷组织，但核心“强制证据”主张有空引用和语义不检查的反例，整体还带来提示与模型流干预。已有 DSH 维护经验且愿意专门评估这些副作用的授权分析人员可以设计隔离对照，不能把正式业务案卷直接托付给关闭状态。若存在结论没有对应材料、文件截断影响复核、模型请求意外增加或停用行为不还原，就停止整体使用，回到独立目录加人工证据表。现金、时间及合格率均缺同任务实测，不能宣布节省 token 或人工。 依据见 [Q04](#research-q04)。

关键反例是证据编号存在并不证明证据支持结论。validateEvidenceIds 只扫描文件名，再检查传入数组中是否有未知编号；空数组也没有 missing。record_finding 随后直接追加 title 和 detail。因此 README 所称“幻觉无处落脚”超出了实际约束。它能拒绝不存在的编号，不能阻止不引用证据或引用无关证据的结论，人工语义复核仍是验收主体。

最小验证不必安装整个插件。用当前案卷结构准备不存在编号、空数组、无关有效编号、正确引用及被修改证据五类样例，比较原编号检查与新增结构加人工逐题复核的漏放率、误拒率和复核时间。如果空引用挡住了但无关引用仍大量漏放，或者新增成本没有降低纠错负担，就否定当前扩展方案。现有代码仅支持推导这一缺口，未证明需求持续性、采用意愿或产品市场。 具体依据见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

案卷组织与编号检查有源码支持；事实正确性、宿主兼容和成本效果未验证。新验收扩展仅为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/helmd/package.json、packages/helmd/src/index.ts、packages/helmd/src/case.ts、packages/helmd/src/persist.ts、packages/helmd/src/tools/caseflow.ts、packages/helmd/src/llm-stream-hook.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交 c0820c76202cde0dde952706381cd7921a68fe14，检查 README、包入口、案卷、工具包装与模型流调用边界；不声称覆盖全部领域工具内部实现。
- 下一步：实际完成固定源码检查。未安装插件、未执行目标代码或其测试、未运行攻击样本；作者输出表现未视为本轮独立验证。建议只在授权隔离材料上核对案卷完整性与退出。

**分析版本**

- **仓库**：[ADWMC/helm-d](https://github.com/ADWMC/helm-d)
- **版本号**：未声明（[固定提交 c0820c7](https://github.com/ADWMC/helm-d/tree/c0820c76202cde0dde952706381cd7921a68fe14)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可以提出未验证的案卷验收扩展。先要求每条 finding 至少一个有效引用，再保存不可变证据摘要、引用范围和“此材料支持哪一步”的解释，并让独立复核者给出接受或退回决定后才关闭。相对现有文件名集合检查，增量在于把“文件存在”推进到“结论对材料的关系已审查”，而不是增加更多领域工具。

最小验证不必安装整个插件。用当前案卷结构准备不存在编号、空数组、无关有效编号、正确引用及被修改证据五类样例，比较原编号检查与新增结构加人工逐题复核的漏放率、误拒率和复核时间。如果空引用挡住了但无关引用仍大量漏放，或者新增成本没有降低纠错负担，就否定当前扩展方案。现有代码仅支持推导这一缺口，未证明需求持续性、采用意愿或产品市场。 具体依据见 [Q05](#research-q05)。

实际完成固定源码检查。未安装插件、未执行目标代码或其测试、未运行攻击样本；作者输出表现未视为本轮独立验证。建议只在授权隔离材料上核对案卷完整性与退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 613 | 147501 | — | — | 899986 |
| .ts | source | 54 | 7482 | 6097 | 894 | — |
| .js | source | 13 | 2990 | 2222 | 532 | — |
| .mjs | source | 31 | 3315 | 2602 | 441 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/ADWMC/helm-d/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/ADWMC/helm-d/issues?q=is%3Aissue+created%3A2026-09-27T08%3A28%3A34.000Z..2026-10-27T08%3A28%3A34Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/ADWMC/helm-d/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A28%3A34.000Z..2026-10-27T08%3A28%3A34Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：授权安全分析人员能否用 helm-d 的案卷证据约束替代手工记录，而不把输出顺畅等同于事实正确？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 安全分析案卷相比手工目录与报告多约束了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对反复做授权样本分析且需要向同事交接结论的人，合格结果应当包含样本身份、实际观察、结论依据和可恢复进度。原办法可以是一个手工目录加 Markdown 报告。helm-d 把建目录、复制样本、SHA-256 记录、时间线和恢复清单组成固定案卷，减少模型把依据只留在聊天中的机会。这是流程集成贡献，不是新的分析算法。

关键反例是证据编号存在并不证明证据支持结论。validateEvidenceIds 只扫描文件名，再检查传入数组中是否有未知编号；空数组也没有 missing。record_finding 随后直接追加 title 和 detail。因此 README 所称“幻觉无处落脚”超出了实际约束。它能拒绝不存在的编号，不能阻止不引用证据或引用无关证据的结论，人工语义复核仍是验收主体。

#### 证据与依据

**依据 1 · 源码核查**：[packages/helmd/src/case.ts:87-127](https://github.com/ADWMC/helm-d/blob/c0820c76202cde0dde952706381cd7921a68fe14/packages/helmd/src/case.ts#L87-L127)

建案复制样本、计算哈希并写入时间线和恢复清单。

<details>
<summary>查看原文（41行）</summary>

```text
  const dir = join(base, name)
  for (const sub of ['sample', 'evidence', 'scripts']) {
    await mkdir(join(dir, sub), { recursive: true })
  }

  const lines: string[] = []
  let id = 0
  for (const sample of opts.samples) {
    if (!existsSync(sample)) throw new Error(`sample not found: ${sample}`)
    const dest = join(dir, 'sample', basename(sample))
    await copyFile(sample, dest)
    const sha = await sha256File(dest)
    id++
    const eid = `E-${String(id).padStart(3, '0')}`
    await writeFile(join(dir, 'evidence', `${eid}-sha256.txt`),
      `${sha}  ${basename(sample)}\nsource: ${resolve(sample)}\n`, 'utf8')
    lines.push(`  - sample/${basename(sample)} sha256:${sha}`)
  }

  const caseMd = [
    `# CASE ${name}`,
    `status: open`,
    `mode: ${opts.mode}`,
    `route: ${opts.route}`,
    `goal: ${opts.goal}`,
    ...(lines.length ? ['samples:', ...lines] : []),
    '',
    '## timeline',
    `- [${nowStamp()}] BEGIN — created by begin_case`,
    '',
    '## resume（压缩恢复契约：恢复时先 case_status()；压缩前把 1-6 更新到当前）',
    '1. 目标与用户约束：goal + 用户说过的范围/边界（安全相关约束逐字保留，不要转述）',
    '2. 已确认事实：验证过的结论 + 对应 E-id（未验证的猜测不要写进来）',
    '3. 关键参数：命令 / 偏移 / 哈希 / 工具版本 —— 正文只写 E-id，细节留在 evidence/',
    '4. 已排除的路线：试过且失败的路子（同步进 DEAD_ENDS，写明根因）',
    '5. 当前进展：正在做的这一步、做到哪、下一步的最小动作',
    '6. 待办与阻塞：等材料 / 等外部结果 / 等用户技术选择（写明等什么、由谁给）',
    '',
  ].join('\n')
  await writeFile(join(dir, 'CASE.md'), caseMd, 'utf8')
  await writeFile(join(dir, 'findings.md'), `# FINDINGS ${name}\n`, 'utf8')
```

</details>

**依据 2 · 源码核查**：[packages/helmd/src/case.ts:197-220](https://github.com/ADWMC/helm-d/blob/c0820c76202cde0dde952706381cd7921a68fe14/packages/helmd/src/case.ts#L197-L220)

编号校验只做已知集合包含检查，空数组可以通过，正文直接追加。

<details>
<summary>查看原文（24行）</summary>

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
}

export async function appendFinding(
  caseDir: string,
  title: string,
  detail: string,
  ids: string[],
): Promise<void> {
  await appendFile(
    join(caseDir, 'findings.md'),
    `\n## ${title}\n${detail}\nevidence: ${ids.join(', ')}\n`,
    'utf8',
  )
  await appendTimeline(caseDir, `FINDING — ${title} (${ids.join(', ')})`)
```

</details>

**依据 3 · 源码核查**：[packages/helmd/src/tools/caseflow.ts:186-209](https://github.com/ADWMC/helm-d/blob/c0820c76202cde0dde952706381cd7921a68fe14/packages/helmd/src/tools/caseflow.ts#L186-L209)

实际注册入口将编号交给集合检查后写入结论。

<details>
<summary>查看原文（24行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'record_finding',
    description:
      'Record a conclusion into findings.md. Every evidence id you cite is validated against the evidence/ directory — ' +
      'citing ids that do not exist is rejected. This is how conclusions stay guess-free.',
    parameters: {
      title: { type: 'string', required: true },
      detail: { type: 'string', required: true },
      evidence_ids: { type: 'array', items: { type: 'string' }, required: true, description: 'e.g. ["E-002","E-005"]' },
    },
    output: { schema: { type: 'string' }, render: (_a: unknown, v: string) => [{ type: 'text', text: v }] },
    async execute(args: { title: string; detail: string; evidence_ids: string[] }, exec?: ExecLike) {
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
      await appendFinding(active.dir, args.title, args.detail, args.evidence_ids ?? [])
      return `finding recorded: ${args.title} [${(args.evidence_ids ?? []).join(', ')}]`
```

</details>

#### 缺口

- 没有同任务手工案卷对照及实际交接记录。
  **影响**：无法确认格式集成是否减少遗漏及人工交接时间。
  **进一步探讨**：让两位分析人员用相同授权样本分别整理案卷，比较复核者找回依据和纠错的耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具结果如何入链，找不到证据及失败后如何处理？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

主入口先包裹 tools.register，再注册领域工具，最后还原注册函数。包装器只给后续注册且不在排除清单内的工具追加持久化；不是对全部宿主调用做不可绕过的审计。工具先执行，只有返回字符串才尝试保存。没有活动案卷时结果仍然返回，只附未保存提示；工具抛错或返回非字符串不会自动形成证据。保存失败发生在工具完成之后，不能据返回异常推断原工具没有副作用。

saveEvidence 将文本限制在 256KB，并写文件后追加时间线；缺少跨文件事务。结束案卷时 deep 模式要求至少一个 Markdown finding 标题，有证据文件或说明 no-evidence 理由即可关闭。结合空引用可通过这一事实，关闭代表流程状态，不代表事实已被证据充分支撑。并发方面编号计数是进程内缓存，首次目录扫描期间可有竞争，而且多进程并不共享锁；当前源码不支持跨进程案卷写入的可靠性承诺。

#### 证据与依据

**依据 1 · 源码核查**：[packages/helmd/src/index.ts:25-32](https://github.com/ADWMC/helm-d/blob/c0820c76202cde0dde952706381cd7921a68fe14/packages/helmd/src/index.ts#L25-L32)

持久化包装在领域注册前启用。

```text
export function apply(ctx: Context): void {
  // Description wash FIRST: normalize any "denial is final" tool wording before
  // any domain tool registers (defensive layer — current helmd descriptions are clean).
  const unwash = applyDescriptionWash(ctx)
  // Persistence wrap FIRST: every later-registered domain tool gains
  // evidence persistence without per-tool edits (soft gate).
  const unwrap = applyPersistenceWrap(ctx)
  try {
```

**依据 2 · 源码核查**：[packages/helmd/src/index.ts:54-72](https://github.com/ADWMC/helm-d/blob/c0820c76202cde0dde952706381cd7921a68fe14/packages/helmd/src/index.ts#L54-L72)

工具注册后还原包装，仅覆盖这一注册窗口。

<details>
<summary>查看原文（19行）</summary>

```text
    // Case lifecycle: begin_case / case_status / record_finding / save_evidence / end_case
    registerCaseflowTools(ctx)

    // External tool discovery: find_tool (GitHub + local shelf)
    registerToolDiscoveryTools(ctx)

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
  }
```

</details>

**依据 3 · 源码核查**：[packages/helmd/src/persist.ts:8-55](https://github.com/ADWMC/helm-d/blob/c0820c76202cde0dde952706381cd7921a68fe14/packages/helmd/src/persist.ts#L8-L55)

排除清单、字符串限制、软提示和先执行后持久化路径均可核对。

<details>
<summary>查看原文（48行）</summary>

```text
const NO_PERSIST = new Set([
  // knowledge / router / session tools — outputs are not case artifacts
  'skill_catalog', 'read_reference', 'analysis_mode', 'route_task',
  'evidence_reference', 'native_reference', 'web_reference',
  'malware_reference', 'ai_reference', 'protocol_reference',
  'tool_recommend', 'find_tool',
  // case lifecycle itself
  'begin_case', 'case_status', 'record_finding', 'end_case', 'save_evidence',
])

export function isNoPersist(toolName: string): boolean {
  return NO_PERSIST.has(toolName)
}

async function persistHook(sessionId: string | undefined, toolName: string, result: unknown): Promise<unknown> {
  if (typeof result !== 'string') return result
  const active = getCase(sessionId)
  if (!active) {
    return result + '\n[no active case — output NOT persisted. begin_case(goal, samples) keeps evidence.]'
  }
  const firstLine = result.split('\n').find((l) => l.trim()) ?? ''
  const { id } = await saveEvidence(active.dir, toolName, result, firstLine)
  return result + `\n[evidence: ${id} saved to ${active.name}]`
}

/**
 * Wrap register so every later-registered tool executes through the hook.
 * Must be called BEFORE any register*Tools(ctx) in apply().
 */
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
      return await persistHook(exec?.agent?.id, def.name, result)
    }
    return originalRegister.call(ctx.tools, def)
  }
  return () => {
    target.register = originalRegister
  }
```

</details>

**依据 4 · 源码核查**：[packages/helmd/src/case.ts:147-185](https://github.com/ADWMC/helm-d/blob/c0820c76202cde0dde952706381cd7921a68fe14/packages/helmd/src/case.ts#L147-L185)

计数缓存与落盘次序没有跨进程事务，并明确截断长内容。

<details>
<summary>查看原文（39行）</summary>

```text
const evidenceCounters = new Map<string, number>()

/** Next E-number = max existing + 1; the scan happens once per case directory. */
export async function nextEvidenceId(caseDir: string): Promise<string> {
  const cached = evidenceCounters.get(caseDir)
  if (cached !== undefined) {
    const next = cached + 1
    evidenceCounters.set(caseDir, next)
    return `E-${String(next).padStart(3, '0')}`
  }
  const files = await readdir(join(caseDir, 'evidence')).catch(() => [] as string[])
  let max = 0
  for (const f of files) {
    const m = /^E-(\d{3})-/.exec(f)
    if (m) max = Math.max(max, parseInt(m[1], 10))
  }
  evidenceCounters.set(caseDir, max + 1)
  return `E-${String(max + 1).padStart(3, '0')}`
}

/** Drop a case directory's counter (called when its case closes). */
export function resetEvidenceCounter(caseDir: string): void {
  evidenceCounters.delete(caseDir)
}

export async function saveEvidence(
  caseDir: string,
  toolLabel: string,
  content: string,
  summary: string,
): Promise<{ id: string; path: string }> {
  const id = await nextEvidenceId(caseDir)
  const safeTool = toolLabel.replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 40) || 'output'
  const capped = content.length > 256 * 1024
    ? content.slice(0, 256 * 1024) + `\n[truncated at 256KB; full length ${content.length}]\n`
    : content
  const path = join(caseDir, 'evidence', `${id}-${safeTool}.txt`)
  await writeFile(path, capped, 'utf8')
  await appendTimeline(caseDir, `${toolLabel} → ${id} — ${summary.slice(0, 80)}`)
```

</details>

**依据 5 · 源码核查**：[packages/helmd/src/tools/caseflow.ts:222-247](https://github.com/ADWMC/helm-d/blob/c0820c76202cde0dde952706381cd7921a68fe14/packages/helmd/src/tools/caseflow.ts#L222-L247)

结束检查 finding 标题数量和证据数量，允许说明无证据后关闭。

<details>
<summary>查看原文（26行）</summary>

```text
    async execute(args: { summary?: string }, exec?: ExecLike) {
      const active = getCase(exec?.agent?.id)
      if (!active) return 'No active case bound to this session.'
      const mode = getLevel(exec?.agent?.id)
      if (mode === 'deep') {
        const fm = await import('node:fs/promises').then((m) => m.readFile(join(active.dir, 'findings.md'), 'utf8'))
        const count = (fm.match(/^## /gm) ?? []).length
        if (count === 0) {
          return 'DEEP mode requires at least one record_finding before end_case. Evidence chain incomplete.'
        }
      }
      // Completion is an external fact, not a self-report: a closed case must point at
      // evidence on disk, or say in words why it has none.
      const evidence = await countEvidence(active.dir)
      if (evidence === 0 && !/\(no-evidence:\s*\S/i.test(args.summary ?? '')) {
        return [
          'REJECTED — 关闭前必须交代证据：evidence/ 里一条 E-xxx 都没有。',
          '两条路径：① 先落地证据（跑工具，或 save_evidence(label, ...)）再关闭；',
          '② 本次确实无证据（纯咨询 / 被阻塞）就在 summary 里写明：',
          '   summary: "… (no-evidence: 用户仅咨询，未接触样本)"。',
        ].join('\n')
      }
      await closeCase(active.dir, args.summary)
      unbindCase(exec?.agent?.id)
      const stats = renderAdvisoryStats()
      return [`case closed: ${active.name}${args.summary ? ` — ${args.summary}` : ''}`, ...(stats ? ['', stats] : [])].join('\n')
```

</details>

#### 缺口

- 并发写同一案卷的竞争是否在真实宿主中可发生尚无执行材料。
  **影响**：不能把进程内缓存当作多 worker 并发证据存储。
  **进一步探讨**：对单进程并发首写和两个进程写同一目录分别检查编号、文件内容和时间线是否一致。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 人设、领域工具与宿主依赖是否改变可控性和复用成本？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

它是通过 Cordis 服务接入的 DSH 插件集合，根仓库是私有 workspace，真正发布组件位于 packages/helmd。该包通过 dsh.bundle 注入补丁和预设，agent 子路径才导出工具注册入口，不能把根 package 当作独立插件安装包。Node 至少 22.19，Cordis 和 DSH 工具、设置包均有 peer 范围约束。

案卷模块用文件系统实现，不直接依赖 Cordis，较适合单独借鉴；但整体插件同时注册提示上下文、工具描述变换、首轮工具过滤与模型流监听。流监听能再次调用 llm.stream，因此“不改宿主磁盘文件”不等于“不影响宿主行为”或“没有额外模型消耗”。实际机制依赖宿主事件和 LLM 适配器语义，工具编排与输出变化都应纳入试用。源码含测试脚本只说明有检查入口，本轮没有执行，也不认可作者输出率作为正确性证据。

#### 证据与依据

**依据 1 · 源码核查**：[packages/helmd/src/index.ts:22-46](https://github.com/ADWMC/helm-d/blob/c0820c76202cde0dde952706381cd7921a68fe14/packages/helmd/src/index.ts#L22-L46)

必需服务与提示、过滤、模型流钩子实际接线。

<details>
<summary>查看原文（25行）</summary>

```text
export const name = 'helmd'
export const inject = ['tools', 'systemPrompt']

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

    // Bootstrap filter: first request only exposes shell + read
    applyBootstrapFilter(ctx, {
      shellTools: ['bash', 'pwsh'],
      commonTools: ['read'],
      promoteOn: 'either',
    })

    // Advisory ledger: producers submit before the renderer runs its post-next render.
    registerAdvisoryHook(ctx)
    registerLlmStreamHook(ctx)
```

</details>

**依据 2 · 源码核查**：[packages/helmd/src/llm-stream-hook.ts:534-556](https://github.com/ADWMC/helm-d/blob/c0820c76202cde0dde952706381cd7921a68fe14/packages/helmd/src/llm-stream-hook.ts#L534-L556)

流监听可再次调用宿主 LLM 服务，存在额外请求路径。

<details>
<summary>查看原文（23行）</summary>

```text
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
        const route = routeRefusal(failureClass, nextAttempt, { userText: latestUserText(options?.messages) })
        appendLedger({
          kind: 'retry', model: options?.model, provider: options?.provider, attempt: nextAttempt,
          form: route.form, failureClass, strategy: route.strategy,
        })
        yield* llm.stream(buildNestedRequest(options, nextAttempt, failureClass))
        return
      }
      // 无 llm 服务（宿主形态异常）：无法重入，只能如实结束本轮
```

</details>

**依据 3 · 源码核查**：[packages/helmd/package.json:1-21](https://github.com/ADWMC/helm-d/blob/c0820c76202cde0dde952706381cd7921a68fe14/packages/helmd/package.json#L1-L21)

实际子包导出健康检查与 agent 子入口，根包不是唯一入口。

<details>
<summary>查看原文（21行）</summary>

```text
{
  "name": "@adwmc/helm-d",
  "version": "0.5.1fix",
  "type": "module",
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
    "./dist/*": "./dist/*",
    "./package.json": "./package.json"
  },
  "files": [
    "dist",
```

</details>

**依据 4 · 源码核查**：[packages/helmd/package.json:40-69](https://github.com/ADWMC/helm-d/blob/c0820c76202cde0dde952706381cd7921a68fe14/packages/helmd/package.json#L40-L69)

补丁接线、宿主 peer 范围和 Node 要求。

<details>
<summary>查看原文（30行）</summary>

```text
    "bundle": {
      "patch": [
        "./cordis.patch.yml",
        "./preset.generated.patch.yml"
      ]
    },
    "client": {
      "platform": "web",
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
  }
}
```

</details>

#### 缺口

- 没有同版 DSH 和模型适配器的安装、调用、禁用验收。
  **影响**：无法据“零宿主修改”推断升级无需适配或停用后行为一定还原。
  **进一步探讨**：在隔离配置下记录安装前后工具、提示及模型请求，禁用后复查相同任务。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 一次可复核的分析交付需要多少配置与复核，谁适合试用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

采用单位是一份可由他人复核的授权样本案卷，不是一次工具输出或一条 finding。需要已能维护 DSH 的分析人员配置匹配版本、指定工作目录、开案、保存外部命令输出、逐条核查结论与证据，再关闭并归档。工具保存只覆盖部分字符串输出，人工仍须识别未入链、长内容截断、落盘失败后原操作是否完成。

当前整体建议观察。已有机制足以借鉴文件案卷组织，但核心“强制证据”主张有空引用和语义不检查的反例，整体还带来提示与模型流干预。已有 DSH 维护经验且愿意专门评估这些副作用的授权分析人员可以设计隔离对照，不能把正式业务案卷直接托付给关闭状态。若存在结论没有对应材料、文件截断影响复核、模型请求意外增加或停用行为不还原，就停止整体使用，回到独立目录加人工证据表。现金、时间及合格率均缺同任务实测，不能宣布节省 token 或人工。

#### 证据与依据

**依据 1 · 源码核查**：[packages/helmd/src/tools/caseflow.ts:36-42](https://github.com/ADWMC/helm-d/blob/c0820c76202cde0dde952706381cd7921a68fe14/packages/helmd/src/tools/caseflow.ts#L36-L42)

外部输出须手动保存，压缩恢复依赖人工维护清单。

```text
const RULES = [
  '1. Built-in tools first; missing capability → find_tool() (GitHub); custom scripts LAST, only in <case>/scripts/.',
  '2. External CLI output → save_evidence(label, ...) before citing it.',
  '3. Parameters come from prior tool output in evidence/. Findings cite E ids via record_finding.',
  '4. Resume after compaction → case_status(); before compaction, bring the CASE.md `## resume` block up to date.',
  '5. Installed a tool or learned a verified usage → tool_memory(register/note) with evidence id; a tactic failing 3 times in a row on the same target (no new evidence) → tool_memory note target=deadend, and never retry a filed dead end without new evidence.',
].join('\n')
```

**依据 2 · 源码核查**：[packages/helmd/src/persist.ts:22-30](https://github.com/ADWMC/helm-d/blob/c0820c76202cde0dde952706381cd7921a68fe14/packages/helmd/src/persist.ts#L22-L30)

没有案卷时依然执行，只提示未保存。

```text
async function persistHook(sessionId: string | undefined, toolName: string, result: unknown): Promise<unknown> {
  if (typeof result !== 'string') return result
  const active = getCase(sessionId)
  if (!active) {
    return result + '\n[no active case — output NOT persisted. begin_case(goal, samples) keeps evidence.]'
  }
  const firstLine = result.split('\n').find((l) => l.trim()) ?? ''
  const { id } = await saveEvidence(active.dir, toolName, result, firstLine)
  return result + `\n[evidence: ${id} saved to ${active.name}]`
```

**依据 3 · 源码核查**：[packages/helmd/src/case.ts:178-185](https://github.com/ADWMC/helm-d/blob/c0820c76202cde0dde952706381cd7921a68fe14/packages/helmd/src/case.ts#L178-L185)

截断及写入顺序增加复核与恢复要求。

```text
  const id = await nextEvidenceId(caseDir)
  const safeTool = toolLabel.replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 40) || 'output'
  const capped = content.length > 256 * 1024
    ? content.slice(0, 256 * 1024) + `\n[truncated at 256KB; full length ${content.length}]\n`
    : content
  const path = join(caseDir, 'evidence', `${id}-${safeTool}.txt`)
  await writeFile(path, capped, 'utf8')
  await appendTimeline(caseDir, `${toolLabel} → ${id} — ${summary.slice(0, 80)}`)
```

**依据 4 · 源码核查**：[packages/helmd/src/llm-stream-hook.ts:544-556](https://github.com/ADWMC/helm-d/blob/c0820c76202cde0dde952706381cd7921a68fe14/packages/helmd/src/llm-stream-hook.ts#L544-L556)

额外模型调用是持续成本来源。

<details>
<summary>查看原文（13行）</summary>

```text
    const streamNested = async function* (nextAttempt: number, failureClass: FailureClass): AsyncGenerator<Chunk> {
      const llm = safeService<{ stream?: (req: any) => AsyncIterable<Chunk> }>(ctx, 'llm')
      if (llm != null && typeof llm.stream === 'function') {
        retryCount++
        const route = routeRefusal(failureClass, nextAttempt, { userText: latestUserText(options?.messages) })
        appendLedger({
          kind: 'retry', model: options?.model, provider: options?.provider, attempt: nextAttempt,
          form: route.form, failureClass, strategy: route.strategy,
        })
        yield* llm.stream(buildNestedRequest(options, nextAttempt, failureClass))
        return
      }
      // 无 llm 服务（宿主形态异常）：无法重入，只能如实结束本轮
```

</details>

#### 缺口

- 合格案卷数、总模型调用量、人工复核与恢复时间没有实际记录。
  **影响**：无法计算单位交付成本，不能证明比手工记录更经济。
  **进一步探讨**：固定一批授权样本，记录全部尝试、完整证据率、复核纠错时间和模型账单；有遗漏即计入失败。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 从编号校验能否推导更强的证据验收机制？

**研究主题**：新假设与验证

#### 完整回答

可以提出未验证的案卷验收扩展。先要求每条 finding 至少一个有效引用，再保存不可变证据摘要、引用范围和“此材料支持哪一步”的解释，并让独立复核者给出接受或退回决定后才关闭。相对现有文件名集合检查，增量在于把“文件存在”推进到“结论对材料的关系已审查”，而不是增加更多领域工具。

最小验证不必安装整个插件。用当前案卷结构准备不存在编号、空数组、无关有效编号、正确引用及被修改证据五类样例，比较原编号检查与新增结构加人工逐题复核的漏放率、误拒率和复核时间。如果空引用挡住了但无关引用仍大量漏放，或者新增成本没有降低纠错负担，就否定当前扩展方案。现有代码仅支持推导这一缺口，未证明需求持续性、采用意愿或产品市场。

#### 证据与依据

**依据 1 · 源码核查**：[packages/helmd/src/case.ts:197-220](https://github.com/ADWMC/helm-d/blob/c0820c76202cde0dde952706381cd7921a68fe14/packages/helmd/src/case.ts#L197-L220)

缺乏非空和语义关系约束是新验收设计的直接依据。

<details>
<summary>查看原文（24行）</summary>

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
}

export async function appendFinding(
  caseDir: string,
  title: string,
  detail: string,
  ids: string[],
): Promise<void> {
  await appendFile(
    join(caseDir, 'findings.md'),
    `\n## ${title}\n${detail}\nevidence: ${ids.join(', ')}\n`,
    'utf8',
  )
  await appendTimeline(caseDir, `FINDING — ${title} (${ids.join(', ')})`)
```

</details>

**依据 2 · 源码核查**：[packages/helmd/src/tools/caseflow.ts:226-244](https://github.com/ADWMC/helm-d/blob/c0820c76202cde0dde952706381cd7921a68fe14/packages/helmd/src/tools/caseflow.ts#L226-L244)

当前关闭只检查数量，支持考虑独立验收决定。

<details>
<summary>查看原文（19行）</summary>

```text
      if (mode === 'deep') {
        const fm = await import('node:fs/promises').then((m) => m.readFile(join(active.dir, 'findings.md'), 'utf8'))
        const count = (fm.match(/^## /gm) ?? []).length
        if (count === 0) {
          return 'DEEP mode requires at least one record_finding before end_case. Evidence chain incomplete.'
        }
      }
      // Completion is an external fact, not a self-report: a closed case must point at
      // evidence on disk, or say in words why it has none.
      const evidence = await countEvidence(active.dir)
      if (evidence === 0 && !/\(no-evidence:\s*\S/i.test(args.summary ?? '')) {
        return [
          'REJECTED — 关闭前必须交代证据：evidence/ 里一条 E-xxx 都没有。',
          '两条路径：① 先落地证据（跑工具，或 save_evidence(label, ...)）再关闭；',
          '② 本次确实无证据（纯咨询 / 被阻塞）就在 summary 里写明：',
          '   summary: "… (no-evidence: 用户仅咨询，未接触样本)"。',
        ].join('\n')
      }
      await closeCase(active.dir, args.summary)
```

</details>

#### 缺口

- 新增验收能否减少错误结论而不增加不可接受的复核负担。
  **影响**：不能将扩展设计计入插件当前能力和创新分。
  **进一步探讨**：在同一案卷样例上盲评两种流程，记录漏放、误拒与人工分钟数。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
