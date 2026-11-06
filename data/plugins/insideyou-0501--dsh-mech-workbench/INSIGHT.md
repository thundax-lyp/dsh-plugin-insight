# dsh-mech-workbench

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[0c0789f](https://github.com/insideyou-0501/dsh-mech-workbench/tree/0c0789fd65d34cf895e23f5019c8076d517b0022)

<!-- BEGIN META -->
[![GitHub ★ 58](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=58&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/insideyou-0501/dsh-mech-workbench) [![npm 30d 1,178](https://img.shields.io/static/v1?label=npm+30d&message=1%2C178&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mech-workbench) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mech-workbench)
<!-- END META -->

> **功能**：在 DSH 提供工科题图处理、符号数值求解、可视化、校核及题目卡片工具。

> **亮点**：把题图、求解、图形、警告和卡片接到DSH，展示求解降级与残差；数学库和视觉模型能力为继承。见 [Q01](#research-q01)、[Q03](#research-q03)。

> **主要限制**：校核失败仍可ok:true，硬关卡没有跨工具状态约束；局部残差不能验证题面建模，视觉检查也非确定性正确性证明。见 [Q02](#research-q02)。

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
  - [Q01 · 谁怎样调用题解能力，结果怎样到达对话与本地？](#detail-section-11)
  - [Q02 · “独立复核”和硬关卡能保证什么，失败在哪里仍会返回结果？](#detail-section-12)
  - [Q03 · 相对直接使用Python和视觉模型，增量与全周期负担是什么？](#detail-section-13)
  - [Q04 · 什么题目值得小范围试用，怎样验证更可靠的流程？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：工科自学/讲解中把题图变成可核对的数值、图与假设。见 [Q01](#research-q01)。

人工抄题后运行Python/SymPy绘图并复核；未与专业求解器比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| mech_read_problem | 预处理题图 | 不是题面正确证明 |
| mech_verify_reading | 生成转写对照图 | 人核对并确认 |
| mech_analyze | 静定反力/内力/应力 | 超范围明确未求解 |
| solve_math | 符号数值运算 | 降级/失败checks需人看 |
| mech_diagram/viz_figure | 依据数据出图 | 图不独立求力学结论 |
| viz_check | 模型图面评审 | 非确定性，可UNKNOWN |
| viz_annotate | 原图讲解标注 | 文件写入需可信范围 |
| mech_card | 保存取回题目字段 | 非原子并发合并 |
| 题解技能 | 提示顺序与诚实表达 | 不是强制状态机 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools | 必需 | 注册模型工具 | 无法使用 |
| Python+numpy/Pillow | 计算/图片必需 | 执行本地脚本 | 探测失败明确报错 |
| SymPy/matplotlib | 相应路径 | 精确计算/绘图 | 数值或Pillow降级，保留限制 |
| 视觉模型凭据 | 视觉评审必需 | 转写与图面检查 | 失败，不证明已核图 |
| skills/attachments | 特定操作 | 流程提示/图片回传 | 工具或路径仍可能可用，非完整体验 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核解释器和非敏感题图 | 支持题型及单位清楚 |
| 读题 | 模型生成对照图，人确认 | 低置信不继续 |
| 求解 | 工具执行数值/符号脚本 | 看checks及unsupported，不只ok |
| 出图 | 模型交计算数据绘图再评审 | 图与spec一致；UNKNOWN停核 |
| 验收 | 人对标准解/原题 | 失败回独立计算 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地依赖/视觉服务金额未知 | 配Python、字体、凭据 | 不运行目标验证 |
| 持续使用 | CPU/磁盘/模型调用未知 | 核题、检查残差与图 | 无正确率/节时对照 |
| 失败恢复 | 重算/模型调用未知 | 留spec和原题独立复算 | 超时不保证整树已停 |
| 退出 | 本地文件继续占用 | 清图片卡片及凭据分开处理 | 卸载不删产物 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 结果可核对 | 数值/残差/警告回传 | 题面建模和全算法正确 |
| 流程整合 | 九工具与可选技能 | 顺序不能强制保证 |
| 图面检查 | 外部模型评审与原文 | 视觉判断可靠性 |
| 学习效率 | 少搬运机制 | 合格题成本及学习效果 |

> **思考**：校核失败仍可ok:true，硬关卡没有跨工具状态约束；局部残差不能验证题面建模，视觉检查也非确定性正确性证明。见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把题图、求解、图形、警告和卡片接到DSH，展示求解降级与残差；数学库和视觉模型能力为继承。见 [Q01](#research-q01)、[Q03](#research-q03)。

显式unsupported、残差和降级可借鉴；成功返回与数学通过应分开，提示关卡需状态绑定才可能强制。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

校核失败仍可ok:true，硬关卡没有跨工具状态约束；局部残差不能验证题面建模，视觉检查也非确定性正确性证明。见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

标准答案小题先人工核题，再看checks与图，失败/超范围即退独立计算；不用于真实设计放行。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码已检查；现有集成贡献可解释，题解效果与新增状态门槛未验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/cards.js、lib/python.js、package.json、scripts/analyze.py、scripts/symbolic.py、skills/engineering-problem-solving/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查Host注册、读题对照、数值/符号返回、Python运行失败、卡片写入及技能。未全审全部算法/表达式/图形/视觉服务；未运行宿主或题目。
- 下一步：标准题及错单位/错载荷/变spec对照独立结果和人工负担；视觉与状态门槛另核，未执行。

**分析版本**

- **仓库**：[insideyou-0501/dsh-mech-workbench](https://github.com/insideyou-0501/dsh-mech-workbench)
- **版本号**：0.3.1（[固定提交 0c0789f](https://github.com/insideyou-0501/dsh-mech-workbench/tree/0c0789fd65d34cf895e23f5019c8076d517b0022)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

以题面确认/spec摘要绑定计算和图，失败校核只能形成未完成交付；验证是否减少错单位、改题不重算和跳检。见 [Q04](#research-q04)。

标准题及错单位/错载荷/变spec对照独立结果和人工负担；视觉与状态门槛另核，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1102 | — | — | 16468 |
| .js | source | 4 | 1537 | 1215 | 261 | — |
| .mjs | test | 3 | 990 | 829 | 98 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/insideyou-0501/dsh-mech-workbench/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/insideyou-0501/dsh-mech-workbench/issues?q=is%3Aissue+created%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/insideyou-0501/dsh-mech-workbench/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本的题解工具怎样产生可核验结果，哪些条件限制采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁怎样调用题解能力，结果怎样到达对话与本地？

**研究主题**：场景与需求、功能与机制

#### 完整回答

它实际上是面向工科题目学习与讲解的工具包，而非生产CAD工作台。适合将题图转成可核对的数值、公式与图示；原办法是人工抄题后分别运行Python/SymPy和绘图，再把结果贴回对话。合格结果应保留题面假设、单位、计算残差和图的依据，不能只看一张正确外观的图。

Host入口注册九个工具，并在skills服务可用时提供四个流程技能。solve_math选带numpy/sympy的解释器，失败退基础解释器，spec写临时JSON交symbolic.py，返回精确/数值/LaTeX/校核和unsupported。mech_analyze实际执行analyze.py，回传反力、应力、极值和检查，不靠模型心算。图像工具把文件交附件服务回传，题目卡片把转写、假设等落成工作区JSON。

读题自检的实际产物是原图与转写的对照图，加提示让学生确认，并没有自动判断转写准确。视觉检查另调vision.py和视觉模型，返回模型判定及原文；它与确定性残差是两类证据，不应统称确定性工具。工具之间没有强制状态机，流程顺序主要靠随包技能约束模型。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:901-932](https://github.com/insideyou-0501/dsh-mech-workbench/blob/0c0789fd65d34cf895e23f5019c8076d517b0022/index.js#L901-L932)

求解真实脚本及显式降级。

<details>
<summary>查看原文（32行）</summary>

```text
    async execute(args) {
      const spec = args.spec ?? {}
      // 先找带 sympy 的解释器（随包 .pylibs 里有 sympy）；找不到就退回基础解释器，
      // 由 symbolic.py 自己降级并如实上报 —— 这样"没有 sympy"不会让整个工具不可用。
      let python = null
      let symbolic = false
      try {
        python = await resolvePython('numpy,sympy')
        symbolic = true
      } catch (error) {
        python = await resolvePython('base')
        void error
      }
      const result = await runScript('symbolic.py', spec, { timeoutMs: 240000, python })
      const exact = (result.exact ?? []).filter((item) => item !== null && item !== undefined)
      const numeric = (result.numeric ?? []).filter((item) => item !== null && item !== undefined)
      const checks = (result.checks ?? []).map(
        (check) => `${check.pass ? 'PASS' : 'FAIL'} ${check.name}${check.note ? ` (${check.note})` : ''}`,
      )
      const summary = [
        `op=${result.op ?? spec.op}　解释器：${symbolic ? '带 sympy（精确符号路径）' : '无 sympy（数值降级路径）'}`,
        exact.length ? `精确解：${exact.join('；')}` : '',
        numeric.length ? `数值：${numeric.map((v) => (typeof v === 'number' ? String(v) : JSON.stringify(v))).join('；')}` : '',
        (result.latex ?? []).length ? `LaTeX：${result.latex.join('　')}` : '',
        (result.steps ?? []).length
          ? `过程：${result.steps.map(describeStep).filter(Boolean).join('；')}` : '',
        result.unsupported?.length ? `本环境做不到（如实标注）：${result.unsupported.join('；')}` : '',
        result.warnings?.length ? `提示：${result.warnings.join('；')}` : '',
        checks.length ? `验算：${checks.join(' | ')}` : '',
        `原始结果 JSON：${JSON.stringify(result)}`,
      ].filter(Boolean).join('\n')
      return { ...result, python, sympy: symbolic, summary }
```

</details>

**依据 2 · 源码核查**：[index.js:500-521](https://github.com/insideyou-0501/dsh-mech-workbench/blob/0c0789fd65d34cf895e23f5019c8076d517b0022/index.js#L500-L521)

力学脚本到结果摘要。

<details>
<summary>查看原文（22行）</summary>

```text
    async execute(args) {
      const result = await runScript('analyze.py', args.spec ?? {}, { timeoutMs: 120000 })
      const checks = (result.checks ?? []).map(
        (check) => `${check.pass ? 'PASS' : 'FAIL'} ${check.name}${check.note ? ` (${check.note})` : ''}`,
      )
      const reactions = (result.reactions ?? [])
        .map((item) => `${item.type}@x=${item.x}: Rx=${item.Rx ?? 0}, Ry=${item.Ry ?? 0}, M=${item.M ?? 0}`)
        .join('；')
      const summary = [
        `kind=${result.kind} 静定=${result.determinate}`,
        reactions ? `反力：${reactions}` : '',
        result.extrema ? `极值：${extremaText(result.extrema)}` : '',
        result.stresses ? `应力：σmax=${result.stresses.sigma_max} @x=${result.stresses.sigma_max_x}，τmax=${result.stresses.tau_max}` : '',
        result.section ? `截面：A=${result.section.A}, Iy=${result.section.Iy}, W=${result.section.W}, Sy=${result.section.Sy}, Ip=${result.section.Ip}, Wp=${result.section.Wp}` : '',
        result.unsupported?.length ? `未覆盖：${result.unsupported.join('；')}` : '',
        result.warnings?.length ? `提示：${result.warnings.join('；')}` : '',
        checks.length ? `校核：${checks.join(' | ')}` : '',
        `原始结果 JSON：${JSON.stringify(result)}`,
      ]
        .filter(Boolean)
        .join('\n')
      return { ...result, summary }
```

</details>

**依据 3 · 源码核查**：[index.js:452-477](https://github.com/insideyou-0501/dsh-mech-workbench/blob/0c0789fd65d34cf895e23f5019c8076d517b0022/index.js#L452-L477)

读题自检生成对照图而非正确性判定。

<details>
<summary>查看原文（26行）</summary>

```text
    async execute(args, exec) {
      const workspace = workspaceOf(args, exec, ctx)
      const out = args.out ? resolve(workspace, args.out) : join(workspace, 'mech-images', `compare-${stamp()}.png`)
      const spec = {
        original: resolve(workspace, args.original),
        transcription: args.transcription,
        out,
      }
      if (args.crop_original) spec.crop_original = args.crop_original
      if (args.font_size) spec.font_size = args.font_size
      const result = await runScript('render_math.py', spec, { timeoutMs: 120000 })
      const { image, note } = await saveImageRef(ctx, result.out ?? out)
      return {
        ok: true,
        path: result.out ?? out,
        renderer: result.renderer ?? null,
        warnings: result.warnings ?? [],
        substitutions: result.substitutions ?? [],
        image,
        imageNote: note,
        summary: [
          `对照图已生成（渲染器 ${result.renderer ?? '未知'}）：${result.out ?? out}`,
          '请逐项核对：题干文字、每个数值与单位、支座类型与位置、载荷方向与大小、截面尺寸。',
          '凡两边读法不一致或低置信的字段，应向学生复述并请其确认后再解题。',
        ].join('\n'),
      }
```

</details>

**依据 4 · 源码核查**：[index.js:292-316](https://github.com/insideyou-0501/dsh-mech-workbench/blob/0c0789fd65d34cf895e23f5019c8076d517b0022/index.js#L292-L316)

视觉评审来自模型且可UNKNOWN。

<details>
<summary>查看原文（25行）</summary>

```text
async function visionReview(path, options = {}) {
  const spec = { src: [resolve(path)], prompt: options.prompt ?? QA_PROMPT }
  if (options.provider) spec.provider = options.provider
  const result = await runScript('vision.py', spec, { timeoutMs: 300000 })
  const parsed =
    result.parsed && result.transcription && typeof result.transcription === 'object'
      ? result.transcription
      : null
  const text = parsed ? JSON.stringify(parsed, null, 2) : String(result.raw ?? '')
  const verdict = parsed?.verdict
    ? String(parsed.verdict).toUpperCase()
    : /\bFAIL\b/i.test(text)
      ? 'FAIL'
      : /\bPASS\b/i.test(text)
        ? 'PASS'
        : 'UNKNOWN'
  return {
    provider: result.provider ?? null,
    model: result.model ?? null,
    parsed: Boolean(parsed),
    verdict,
    text,
    evidence: parsed,
    raw: result.raw ?? null,
    attempts: result.attempts ?? [],
```

</details>

**依据 5 · 源码核查**：[index.js:951-962](https://github.com/insideyou-0501/dsh-mech-workbench/blob/0c0789fd65d34cf895e23f5019c8076d517b0022/index.js#L951-L962)

工具注册及可选技能。

<details>
<summary>查看原文（12行）</summary>

```text
export function apply(ctx) {
  registerTools(ctx)
  try {
    const skills = typeof ctx.get === 'function' ? ctx.get('skills') : ctx.skills
    if (skills && typeof skills.registerProvider === 'function') {
      skills.registerProvider(createSkillProvider)
    }
  } catch (error) {
    // 技能目录有问题时只降级技能，工具仍须可用。
    ctx.logger?.warn?.('dsh-mech-workbench: 技能注册失败：%s', error?.message ?? error)
  }
}
```

</details>

**依据 6 · 源码核查**：[lib/cards.js:44-67](https://github.com/insideyou-0501/dsh-mech-workbench/blob/0c0789fd65d34cf895e23f5019c8076d517b0022/lib/cards.js#L44-L67)

题目卡片实际持久化。

<details>
<summary>查看原文（24行）</summary>

```text
export async function saveCard(payload, options = {}) {
  const dir = cardsDir(options)
  await mkdir(dir, { recursive: true })
  const id = payload?.id || slug(payload?.title) || `problem-${Date.now()}`
  const path = cardPath(dir, id)
  let existing = {}
  if (payload?.merge !== false) {
    try {
      existing = JSON.parse(await readFile(path, 'utf8'))
    } catch {
      existing = {}
    }
  }
  const now = new Date().toISOString()
  const merged = {
    ...existing,
    ...payload,
    id,
    created: existing.created ?? now,
    updated: now,
  }
  delete merged.merge
  await writeFile(path, `${JSON.stringify(merged, null, 2)}\n`, 'utf8')
  return { path, card: merged }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · “独立复核”和硬关卡能保证什么，失败在哪里仍会返回结果？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

源码确实提供数值复核：力学checks计算合力/力矩残差，symbolic.check把失败追加warnings；静不定明确不返回反力/内力。这比只让模型重复解释更可核对。但残差只检验给定数学模型的局部自洽，不能证明抄题、支座、载荷、材料假设正确，也不能从几条残差推出任意学科求解有效。

静不定返回ok:true、determinate:false、空反力和警告；符号求解即便check失败仍返回ok:true及数值。runScript仅对parsed.ok===false抛错，不把checks中的false当阻断；viz_check同样返回ok:true和verdict。技能写“验算未通过不许交付”，但没有跨工具状态账本阻止模型跳过或忽略。所谓硬关卡属于提示规范，不能当宿主执行保证。

文件路径通过resolve取工作区相对或绝对路径，卡片可指定dir；本组件没有把这些操作接进宿主沙箱/审批服务。Python子进程直接spawn，超时kill后即返回超时，未等待整棵进程树确认退出，调用也未传exec.signal。对可信个人题目可收窄使用，但不能把工具参数当任意多用户隔离域。未穷尽所有表达式解析与图形边界，不声称已有可利用漏洞。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/analyze.py:982-1009](https://github.com/insideyou-0501/dsh-mech-workbench/blob/0c0789fd65d34cf895e23f5019c8076d517b0022/scripts/analyze.py#L982-L1009)

平衡残差的真实计算。

<details>
<summary>查看原文（28行）</summary>

```text


def build_checks(model, geo, solve, evs, diagrams, extrema):
    checks = []
    L = model["L"]
    tol = model["tol"]
    reactions = solve["reactions"]
    sums = solve["sums"]
    load_scale = solve["load_scale"]

    # 1) ΣFx = 0 / 2) ΣFy = 0 / 3) ΣM(左端) = 0
    act_fx = sum(r["Rx"] for r in reactions) + sums["Fx_l"]
    act_fy = sum(r["Ry"] for r in reactions) + sums["Fy_l"]
    act_m0 = sum(r["Mz"] + r["x"] * r["Ry"] for r in reactions) + sums["M0_l"]
    sc_f = max(load_scale, abs(sums["Fx_l"]), 1e-12)
    sc_m = max(load_scale * max(L, 1e-9), abs(sums["M0_l"]), 1e-12)
    for name, act, sc in (("ΣFx=0", act_fx, sc_f), ("ΣFy=0", act_fy, sc_f),
                          ("ΣM(对左端)=0", act_m0, sc_m)):
        e = _rerr(act, 0.0, sc)
        checks.append({"name": name, "expected": 0.0, "actual": act, "rel_error": e,
                       "pass": e < 1e-8, "note": ""})

    if solve.get("torsion_active"):
        act_mx = sum(r.get("Mx", 0.0) for r in reactions) + sums["Mx_l"]
        e = _rerr(act_mx, 0.0, max(load_scale, abs(sums["Mx_l"]), 1e-12))
        checks.append({"name": "ΣMx=0(扭转)", "expected": 0.0, "actual": act_mx,
                       "rel_error": e, "pass": e < 1e-8, "note": "轴类模型"})

```

</details>

**依据 2 · 源码核查**：[scripts/analyze.py:1164-1190](https://github.com/insideyou-0501/dsh-mech-workbench/blob/0c0789fd65d34cf895e23f5019c8076d517b0022/scripts/analyze.py#L1164-L1190)

静不定返回ok且明确未求解。

<details>
<summary>查看原文（27行）</summary>

```text
    if not solve["determinate"]:
        checks = geometric_checks(geo)
        n_u, n_e = solve["total_unknowns"], solve["n_eq"]
        checks.append({
            "name": "静定判定（未知反力数 ≤ 平衡方程数）",
            "expected": float(n_e), "actual": float(n_u),
            "rel_error": (n_u - n_e) / float(n_e), "pass": False,
            "note": "未知反力 %d > 方程 %d，Phase 1 不支持静不定" % (n_u, n_e),
        })
        warnings.append("静不定：未求解反力与内力，仅给出截面几何与可核验的几何 checks")
        if geo["Ip"] is None:
            warnings.append("非圆截面：Ip/Wp 不适用，已返回 null（扭转切应力需查表或数值方法）")
        return {
            "ok": True,
            "kind": model["kind"],
            "determinate": False,
            "unsupported": solve["unsupported"],
            "conventions": conventions,
            "units": units["declared"],
            "reactions": [],
            "section": sec_out,
            "diagrams": {},
            "extrema": {},
            "stresses": {},
            "checks": checks,
            "warnings": warnings,
        }
```

</details>

**依据 3 · 源码核查**：[scripts/symbolic.py:402-421](https://github.com/insideyou-0501/dsh-mech-workbench/blob/0c0789fd65d34cf895e23f5019c8076d517b0022/scripts/symbolic.py#L402-L421)

失败校核写警告但结果ok。

<details>
<summary>查看原文（20行）</summary>

```text
    def check(self, name, passed, note):
        self.checks.append({"name": name, "pass": bool(passed), "note": str(note)})
        if not passed:
            self.warnings.append("复核未通过：%s（%s）" % (name, note))
        return bool(passed)

    def need_sympy(self, what):
        if sympy is None:
            self.unsupported.append("没有 sympy：%s 不可用（%s）" % (what, SYMPY_ERROR))
            return False
        return True

    def to_dict(self):
        if self.unsupported and not self.exact and not self.numeric:
            self.warnings.append("本 op 在当前环境只能降级或不可用：" + "；".join(self.unsupported))
        return {
            "ok": True, "op": self.op, "latex": self.latex, "exact": self.exact,
            "numeric": self.numeric, "steps": self.steps, "checks": self.checks,
            "unsupported": self.unsupported, "warnings": self.warnings,
        }
```

</details>

**依据 4 · 源码核查**：[lib/python.js:258-281](https://github.com/insideyou-0501/dsh-mech-workbench/blob/0c0789fd65d34cf895e23f5019c8076d517b0022/lib/python.js#L258-L281)

只按顶层ok拒绝。

<details>
<summary>查看原文（24行）</summary>

```text
 * @throws 脚本失败、输出非 JSON 或 `ok: false` 时抛出带原因的 Error。
 */
export async function runScript(script, spec, options = {}) {
  const timeoutMs = options.timeoutMs ?? 180000
  const python = options.python ?? (await resolvePython(options.requirement ?? 'base'))
  const dir = await mkdtemp(join(tmpdir(), 'dsh-mech-'))
  const specPath = join(dir, 'spec.json')
  try {
    await writeFile(specPath, JSON.stringify(spec), 'utf8')
    const run = await runProcess(python, [join(SCRIPTS_DIR, script), '--spec', specPath], {
      dir,
      timeoutMs,
    })
    if (run.spawnError) throw new Error(`无法启动 ${script}：${run.spawnError.message ?? run.spawnError}`)
    if (run.timedOut) throw new Error(`${script} 执行超过 ${Math.round(timeoutMs / 1000)} 秒，已终止`)
    const parsed = parseJsonObject(run.stdout)
    if (!parsed) {
      throw new Error(
        `${script} 没有输出可解析的 JSON（退出码 ${run.code}）。stderr：` +
          `${String(run.stderr).trim().slice(0, 800) || '(空)'}`,
      )
    }
    if (parsed.ok === false) throw new Error(parsed.error ?? `${script} 报告失败`)
    return parsed
```

</details>

**依据 5 · 源码核查**：[skills/engineering-problem-solving/SKILL.md:29-48](https://github.com/insideyou-0501/dsh-mech-workbench/blob/0c0789fd65d34cf895e23f5019c8076d517b0022/skills/engineering-problem-solving/SKILL.md#L29-L48)

关卡是技能规范。

<details>
<summary>查看原文（20行）</summary>

```text
# 流水线（硬性关卡，不许跳步）

1. **图片题**：`mech_read_problem` → 自己再核一遍关键数值 → 输出「题目复述」→ **等学生确认**。
   - 数值/单位看不清或读法有疑问，先 `mech_verify_reading` 出对照图，或 `viz_annotate` 放大那一小块。
   - 现在你能直接看图，所以"我看过了"不是理由——不确定就复述给学生确认。
2. **确认后 / 文字题**：分步求解。凡能交给工具的部分必须交给工具（`solve_math` / `mech_analyze`），
   不能"我记得等于 10"。
3. **可视化**：把求解得到的**数值表**交给绘图工具（`viz_figure` / `mech_diagram`）。
   图里的每个数字都必须能回溯到计算或题面。
4. **验算**：引用工具返回的 `checks`（带残差/余量）。验算未通过不许交付。
5. **交付**：题目复述 → 分步推导（每步写依据）→ 图（如有）→ **答案（加粗 + 单位）** → 验算结果。
6. **存档**（多轮或复杂题）：`mech_card` 存下图片路径、转写、假设、答案、存疑点。

# 表述与诚实

- 答案必须带单位与有效数字；量纲/数量级自检要写出来。
- 工具**做不到**的事（静不定、塑性、稳定、超出覆盖的学科、没有 sympy 时的符号积分…）：
  明确说出缺哪个能力，给出可行解法路径，**不要给看起来很确定但无依据的数字**。
- 工具返回的 `unsupported` / `warnings` / `checks[i].pass=false` 是对学生的承诺，必须如实转达。
- 图表、转写、公式与题面不一致时，先在回应里指出不一致并请学生确认，再继续。
```

</details>

**依据 6 · 源码核查**：[index.js:774-797](https://github.com/insideyou-0501/dsh-mech-workbench/blob/0c0789fd65d34cf895e23f5019c8076d517b0022/index.js#L774-L797)

视觉检查无阻断账本。

<details>
<summary>查看原文（24行）</summary>

```text
    async execute(args, exec) {
      const workspace = workspaceOf(args, exec, ctx)
      const path = resolve(workspace, args.image)
      if (!existsSync(path)) throw new Error(`图片不存在：${path}`)
      const review = await visionReview(path, { provider: args.provider, prompt: args.prompt })
      const summary = [
        `视觉评审（${review.provider ?? '未知引擎'}${review.model ? ` / ${review.model}` : ''}）：${review.verdict}`,
        review.parsed ? '' : '（引擎未按 JSON 返回，以下为原文）',
        review.text,
      ]
        .filter(Boolean)
        .join('\n')
      return {
        ok: true,
        path,
        verdict: review.verdict,
        provider: review.provider,
        model: review.model,
        parsed: review.parsed,
        evidence: review.evidence,
        raw: review.raw,
        attempts: review.attempts,
        summary,
      }
```

</details>

**依据 7 · 源码核查**：[lib/python.js:150-200](https://github.com/insideyou-0501/dsh-mech-workbench/blob/0c0789fd65d34cf895e23f5019c8076d517b0022/lib/python.js#L150-L200)

直接spawn和超时终止顺序。

<details>
<summary>查看原文（51行）</summary>

```text
async function runProcess(command, args, options) {
  const dir = options.dir ?? (await mkdtemp(join(tmpdir(), 'dsh-mech-')))
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const outPath = join(dir, `out-${stamp}.log`)
  const errPath = join(dir, `err-${stamp}.log`)
  const outHandle = await open(outPath, 'w')
  const errHandle = await open(errPath, 'w')
  let child
  try {
    child = spawn(command, args, {
      stdio: ['ignore', outHandle.fd, errHandle.fd],
      windowsHide: true,
      env: childEnv(options.env),
    })
  } catch (error) {
    await outHandle.close().catch(() => {})
    await errHandle.close().catch(() => {})
    return { code: null, stdout: '', stderr: '', timedOut: false, spawnError: error }
  }
  const outcome = await new Promise((resolve) => {
    let settled = false
    const finish = (value) => {
      if (!settled) {
        settled = true
        resolve(value)
      }
    }
    const timer = setTimeout(() => {
      try {
        child.kill()
      } catch {
        /* 进程可能已退出 */
      }
      finish({ code: null, timedOut: true, spawnError: undefined })
    }, options.timeoutMs ?? 180000)
    child.once('error', (error) => {
      clearTimeout(timer)
      finish({ code: null, timedOut: false, spawnError: error })
    })
    child.once('close', (code) => {
      clearTimeout(timer)
      finish({ code, timedOut: false, spawnError: undefined })
    })
  })
  await outHandle.close().catch(() => {})
  await errHandle.close().catch(() => {})
  const stdout = await readFile(outPath, 'utf8').catch(() => '')
  const stderr = await readFile(errPath, 'utf8').catch(() => '')
  await rm(outPath, { force: true }).catch(() => {})
  await rm(errPath, { force: true }).catch(() => {})
  return { ...outcome, stdout, stderr }
```

</details>

**依据 8 · 源码核查**：[lib/cards.js:15-19](https://github.com/insideyou-0501/dsh-mech-workbench/blob/0c0789fd65d34cf895e23f5019c8076d517b0022/lib/cards.js#L15-L19)

显式卡片目录可超出默认工作区。

```text
/** 解析卡片目录：显式 `dir` 优先，否则 `<workspace>/.mech-cards`。 */
function cardsDir(options = {}) {
  if (options.dir) return resolve(options.dir)
  const workspace = options.workspace ? resolve(options.workspace) : process.cwd()
  return join(workspace, DEFAULT_DIR)
```

#### 缺口

- 所有求解操作、表达式安全和多种图形边界尚未完整核查。
  **影响**：不能推广为任意工科题或不可信输入执行服务。
  **进一步探讨**：选择明确支持的题型，逐个核算法及输入约束，再用已知解和恶意/无效表达式作隔离验证。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对直接使用Python和视觉模型，增量与全周期负担是什么？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

主要增量是把读题、求解、出图、校核和题目卡片组织成DSH可调用接口，显式展示降级和unsupported，并把专业画图预设与通用绘图引擎分开。精确代数继承SymPy，数值与图片基础继承numpy/Pillow，视觉判断来自外部模型；“独立”只表示不同检查路径或另一次模型调用，不等于独立机构验证。

启动硬依赖tools，技能和附件按需；Python必须能import所需模块，优先显式配置与桌面Office运行时，后退系统解释器，随包.pylibs提供符号库。视觉处理还可能读取环境变量或本地凭据并把题图交外部服务，未配key则失败；不应把包没有npm依赖理解为没有运行依赖或外发。

首次要核Python、字体、附件回传和视觉服务，持续有模型调用/磁盘/计算资源与结果复核；金额和工时未知。失败需区分unsupported、校核失败、视觉UNKNOWN与脚本超时，保留题图和原始spec再回独立计算工具，卡片写入非原子且并发合并没有锁。卸载插件不自动删除工作区图片/卡片。作者自测数字保留作者性质，本次未运行，不以测试数量证明题解正确率或节时。

#### 证据与依据

**依据 1 · 源码核查**：[lib/python.js:64-105](https://github.com/insideyou-0501/dsh-mech-workbench/blob/0c0789fd65d34cf895e23f5019c8076d517b0022/lib/python.js#L64-L105)

解释器依赖与候选。

<details>
<summary>查看原文（42行）</summary>

```text
/** 依赖档位 → 模块清单。 */
const REQUIREMENT_ALIASES = {
  base: ['numpy', 'PIL'],
  image: ['numpy', 'PIL'],
  matplotlib: ['numpy', 'PIL', 'matplotlib'],
  viz: ['numpy', 'PIL', 'matplotlib'],
  sympy: ['numpy', 'sympy'],
  symbolic: ['numpy', 'sympy'],
  math: ['numpy', 'sympy'],
  'sympy+matplotlib': ['numpy', 'sympy', 'matplotlib'],
  full: ['numpy', 'PIL', 'matplotlib', 'sympy'],
}

/**
 * 把 `requirement` 归一化成模块清单。
 *
 * @param requirement - 档位名、模块名数组，或逗号分隔的模块名。
 * @returns 模块名数组（非空）。
 */
export function requiredModules(requirement = 'base') {
  if (Array.isArray(requirement)) {
    const list = requirement.map((name) => String(name).trim()).filter(Boolean)
    return list.length ? list : REQUIREMENT_ALIASES.base
  }
  const key = String(requirement ?? 'base').trim()
  if (REQUIREMENT_ALIASES[key]) return REQUIREMENT_ALIASES[key]
  const list = key.split(',').map((name) => name.trim()).filter(Boolean)
  return list.length ? list : REQUIREMENT_ALIASES.base
}

/** 候选解释器，按优先级排列。 */
function pythonCandidates() {
  const list = []
  if (process.env.DSH_VIZ_PYTHON) list.push(process.env.DSH_VIZ_PYTHON)
  if (process.env.DSH_SYMPY_PYTHON) list.push(process.env.DSH_SYMPY_PYTHON)
  if (process.env.DSH_MECH_PYTHON) list.push(process.env.DSH_MECH_PYTHON)
  const resources = process.env.DSH_DESKTOP_OFFICE_RESOURCES
  if (resources) list.push(join(resources, 'primary-runtime', 'dependencies', 'python', 'python.exe'))
  const bundled = desktopBundledPython()
  if (bundled) list.push(bundled)
  list.push(process.platform === 'win32' ? 'py' : 'python3', 'python')
  return list
```

</details>

**依据 2 · 源码核查**：[lib/python.js:127-139](https://github.com/insideyou-0501/dsh-mech-workbench/blob/0c0789fd65d34cf895e23f5019c8076d517b0022/lib/python.js#L127-L139)

随包符号库进入Python环境。

<details>
<summary>查看原文（13行）</summary>

```text
/** 子进程环境：把 .pylibs 放进 PYTHONPATH，任何脚本都能直接 import sympy。 */
function childEnv(extra) {
  const parts = [PYLIBS]
  if (process.env.PYTHONPATH) parts.push(process.env.PYTHONPATH)
  return {
    ...process.env,
    PYTHONPATH: parts.join(delimiter),
    // stdout 被重定向到文件时 Python 默认用系统区域编码（这里是 GBK），
    // 会让返回的路径/中文变成乱码。强制 UTF-8，脚本侧无需各自处理。
    PYTHONIOENCODING: 'utf-8',
    PYTHONUTF8: '1',
    ...extra,
  }
```

</details>

**依据 3 · 源码核查**：[index.js:943-962](https://github.com/insideyou-0501/dsh-mech-workbench/blob/0c0789fd65d34cf895e23f5019c8076d517b0022/index.js#L943-L962)

硬依赖与技能降级。

<details>
<summary>查看原文（20行）</summary>

```text
/** 工具注册表是本插件唯一的硬依赖；attachments 与 skills 都按可选取用。 */
export const inject = ['tools']

/**
 * 注册工具与随包技能。
 *
 * @param ctx - 插件上下文。
 */
export function apply(ctx) {
  registerTools(ctx)
  try {
    const skills = typeof ctx.get === 'function' ? ctx.get('skills') : ctx.skills
    if (skills && typeof skills.registerProvider === 'function') {
      skills.registerProvider(createSkillProvider)
    }
  } catch (error) {
    // 技能目录有问题时只降级技能，工具仍须可用。
    ctx.logger?.warn?.('dsh-mech-workbench: 技能注册失败：%s', error?.message ?? error)
  }
}
```

</details>

**依据 4 · 源码核查**：[lib/cards.js:44-67](https://github.com/insideyou-0501/dsh-mech-workbench/blob/0c0789fd65d34cf895e23f5019c8076d517b0022/lib/cards.js#L44-L67)

卡片读改写且无原子替换。

<details>
<summary>查看原文（24行）</summary>

```text
export async function saveCard(payload, options = {}) {
  const dir = cardsDir(options)
  await mkdir(dir, { recursive: true })
  const id = payload?.id || slug(payload?.title) || `problem-${Date.now()}`
  const path = cardPath(dir, id)
  let existing = {}
  if (payload?.merge !== false) {
    try {
      existing = JSON.parse(await readFile(path, 'utf8'))
    } catch {
      existing = {}
    }
  }
  const now = new Date().toISOString()
  const merged = {
    ...existing,
    ...payload,
    id,
    created: existing.created ?? now,
    updated: now,
  }
  delete merged.merge
  await writeFile(path, `${JSON.stringify(merged, null, 2)}\n`, 'utf8')
  return { path, card: merged }
```

</details>

**依据 5 · 源码核查**：[README.md:82-90](https://github.com/insideyou-0501/dsh-mech-workbench/blob/0c0789fd65d34cf895e23f5019c8076d517b0022/README.md#L82-L90)

环境和视觉凭据的作者说明。

```text
- **Python + numpy + Pillow**：优先用随 DSH Desktop 的 Office 运行时（自带 numpy 2.3.5、Pillow 12.3.0），
  也可用 `DSH_MECH_PYTHON` 指定解释器。除 `figure.py` 外都不依赖 matplotlib
  （`analyze.py`、`annotate.py`、`preprocess.py`、`render_math.py` 都是纯 Pillow/numpy）。
- **sympy（可选，随包自带）**：`.pylibs/` 内含 sympy 1.14.0 + mpmath 1.4.1（约 41 MB），
  两个解释器实测都能从包内加载，**不依赖全局环境**。想验证降级路径：设 `SYMBOLIC_NO_SYMPY=1`。
- **视觉引擎**（`mech_read_problem` 的第二次转写、`viz_check`、`render_math.py` 的公式排版需要）：
  按 `siliconflow-qwen → zhipu-glm → deepseek → sensenova → gemini → VISION_FALLBACKS` 依次尝试，
  只用已配 key 的引擎；key 从环境变量、`~/.dsh/secrets/media-tools.env`、`~/.dsh/.credentials.yaml` 读取，
  **从不写入任何产物**。未配任何 key 时该能力如实报失败，其余工具照常可用。
```

#### 缺口

- 题解质量、外部视觉服务及总调用/人工费用没有同任务对照。
  **影响**：不能确认净学习效果或单位合格题成本。
  **进一步探讨**：固定已知题集，对比手工Python+人工核题，统计正确结果、遗漏假设、复核时间与全部调用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么题目值得小范围试用，怎样验证更可靠的流程？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可在教学/自学中选择有标准答案、模型假设清楚的静定题或简单代数题试用。先复述题面并让人核数值单位，再调用求解，逐项看checks/unsupported，最后对照标准解和图；不把ok:true当校核通过，不用于真实结构设计放行。低置信题图、超范围材料/稳定问题、失败校核或视觉UNKNOWN时停在人工确认，退回原题、独立计算和教师解释。

有依据的新方向是可执行的题目证据门槛：题图确认绑定到规范化spec及其摘要，求解/图形绑定同一输入，失败校核或模型UNKNOWN只能形成未完成交付，人工改题后失效旧核验。它比当前技能“不许跳步”增加状态约束，不增加新求解算法。先在同一已知题集注入错单位、错载荷、spec改后未重算与漏检，看是否降低无依据交付及增加多少复核/调用负担；若人工流程已同样检出或新门槛只是阻碍修题，假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[skills/engineering-problem-solving/SKILL.md:29-48](https://github.com/insideyou-0501/dsh-mech-workbench/blob/0c0789fd65d34cf895e23f5019c8076d517b0022/skills/engineering-problem-solving/SKILL.md#L29-L48)

现有流程规范。

<details>
<summary>查看原文（20行）</summary>

```text
# 流水线（硬性关卡，不许跳步）

1. **图片题**：`mech_read_problem` → 自己再核一遍关键数值 → 输出「题目复述」→ **等学生确认**。
   - 数值/单位看不清或读法有疑问，先 `mech_verify_reading` 出对照图，或 `viz_annotate` 放大那一小块。
   - 现在你能直接看图，所以"我看过了"不是理由——不确定就复述给学生确认。
2. **确认后 / 文字题**：分步求解。凡能交给工具的部分必须交给工具（`solve_math` / `mech_analyze`），
   不能"我记得等于 10"。
3. **可视化**：把求解得到的**数值表**交给绘图工具（`viz_figure` / `mech_diagram`）。
   图里的每个数字都必须能回溯到计算或题面。
4. **验算**：引用工具返回的 `checks`（带残差/余量）。验算未通过不许交付。
5. **交付**：题目复述 → 分步推导（每步写依据）→ 图（如有）→ **答案（加粗 + 单位）** → 验算结果。
6. **存档**（多轮或复杂题）：`mech_card` 存下图片路径、转写、假设、答案、存疑点。

# 表述与诚实

- 答案必须带单位与有效数字；量纲/数量级自检要写出来。
- 工具**做不到**的事（静不定、塑性、稳定、超出覆盖的学科、没有 sympy 时的符号积分…）：
  明确说出缺哪个能力，给出可行解法路径，**不要给看起来很确定但无依据的数字**。
- 工具返回的 `unsupported` / `warnings` / `checks[i].pass=false` 是对学生的承诺，必须如实转达。
- 图表、转写、公式与题面不一致时，先在回应里指出不一致并请学生确认，再继续。
```

</details>

**依据 2 · 源码核查**：[scripts/symbolic.py:402-421](https://github.com/insideyou-0501/dsh-mech-workbench/blob/0c0789fd65d34cf895e23f5019c8076d517b0022/scripts/symbolic.py#L402-L421)

校核失败仍可返回结果。

<details>
<summary>查看原文（20行）</summary>

```text
    def check(self, name, passed, note):
        self.checks.append({"name": name, "pass": bool(passed), "note": str(note)})
        if not passed:
            self.warnings.append("复核未通过：%s（%s）" % (name, note))
        return bool(passed)

    def need_sympy(self, what):
        if sympy is None:
            self.unsupported.append("没有 sympy：%s 不可用（%s）" % (what, SYMPY_ERROR))
            return False
        return True

    def to_dict(self):
        if self.unsupported and not self.exact and not self.numeric:
            self.warnings.append("本 op 在当前环境只能降级或不可用：" + "；".join(self.unsupported))
        return {
            "ok": True, "op": self.op, "latex": self.latex, "exact": self.exact,
            "numeric": self.numeric, "steps": self.steps, "checks": self.checks,
            "unsupported": self.unsupported, "warnings": self.warnings,
        }
```

</details>

**依据 3 · 源码核查**：[index.js:452-477](https://github.com/insideyou-0501/dsh-mech-workbench/blob/0c0789fd65d34cf895e23f5019c8076d517b0022/index.js#L452-L477)

题图确认与后续spec尚无状态绑定。

<details>
<summary>查看原文（26行）</summary>

```text
    async execute(args, exec) {
      const workspace = workspaceOf(args, exec, ctx)
      const out = args.out ? resolve(workspace, args.out) : join(workspace, 'mech-images', `compare-${stamp()}.png`)
      const spec = {
        original: resolve(workspace, args.original),
        transcription: args.transcription,
        out,
      }
      if (args.crop_original) spec.crop_original = args.crop_original
      if (args.font_size) spec.font_size = args.font_size
      const result = await runScript('render_math.py', spec, { timeoutMs: 120000 })
      const { image, note } = await saveImageRef(ctx, result.out ?? out)
      return {
        ok: true,
        path: result.out ?? out,
        renderer: result.renderer ?? null,
        warnings: result.warnings ?? [],
        substitutions: result.substitutions ?? [],
        image,
        imageNote: note,
        summary: [
          `对照图已生成（渲染器 ${result.renderer ?? '未知'}）：${result.out ?? out}`,
          '请逐项核对：题干文字、每个数值与单位、支座类型与位置、载荷方向与大小、截面尺寸。',
          '凡两边读法不一致或低置信的字段，应向学生复述并请其确认后再解题。',
        ].join('\n'),
      }
```

</details>

#### 缺口

- 教学试用和状态门槛实验未执行。
  **影响**：采用收益和新方向仍是可检验判断。
  **进一步探讨**：先用标准答案题集做错误检出/复核负担对照。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
