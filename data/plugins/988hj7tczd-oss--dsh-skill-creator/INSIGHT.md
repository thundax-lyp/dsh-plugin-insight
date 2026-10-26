# dsh-skill-creator

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[f9ff567](https://github.com/988hj7tczd-oss/dsh-skill-creator/tree/f9ff56714decd8d604d97dced494206937c8f907)

<!-- BEGIN META -->
[![npm 30d 762](https://img.shields.io/static/v1?label=npm+30d&message=762&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-skill-creator) [![最新发布 2026-08-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-skill-creator)
<!-- END META -->

> **实现功能**：DSH 内四个模型工具，用确定性规则草拟、校验、打包和改写技能描述，可挂载输出目录。

> **核心亮点**：提供从工作流描述到 SKILL.md、校验、ZIP 分发和目录挂载的一站式入口；详见[Q01](#research-q01)。

> **风险与缺陷**：fromSession 只改变 sessionNote，不改变草稿；ZIP 对所有文件做 UTF-8 解码/重编码，二进制资源不保真。详见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 四个工具实际生成什么？](#detail-section-11)
  - [Q02 · fromSession 真正进入生成内容吗？](#detail-section-12)
  - [Q03 · 文件安全和打包保真度怎样？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：把已有工作流固化为 DSH SKILL.md 并在会话中分发或使用。

人工写 SKILL.md 并手动校验/zip；插件将常见步骤合一。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| skill_new | 由 goal 规则抽取并生成 SKILL.md；默认 dry-run | confirm=true 才写文件；fromSession 仅改变说明，不进入草稿 |
| skill_validate | 检查既有技能的 frontmatter/结构 | 不验证语义质量或运行效果 |
| skill_package | 把技能目录输出 ZIP | readText→TextEncoder 不保二进制，失败目录可能跳过 |
| skill_improve_description | 按规则改写 description | commit=true 才写回 SKILL.md；需审变更 |
| 运行期 provider | 从输出目录向 ctx.skills 提供技能 | 仅 ctx.skills 可用时挂载；不是第五个模型工具 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH tools 与可写 outputDir | 生成/校验/打包必需 | 四工具及文件输出 | 工具不可完成写入 |
| ctx.skills | 仅运行期挂载需要 | 发布新 Skill provider | 工具返回 mountHint |
| 二进制资源 | 可选输入 | 技能资产打包 | 当前文本 ZIP 不保真 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| dry-run | 查看抽取/缺口 | 意图正确 |
| confirm | 写入隔离目录 | SKILL.md 可审 |
| 打包 | 解包对比 | 内容逐字节完整 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH tools/skills 与可写 outputDir，宿主上下文与存储费用依使用量，未知 | 写清 goal、审 dry-run、选择隔离输出目录；耗时未知 | 会话尾巴不进入草稿，二进制打包不保真 |
| 持续使用 | 工具本身为确定性生成/校验/改写/ZIP，占文件IO与存储；工具schema、参数和结果进入宿主模型上下文的费用另依使用量，金额/频率未知 | 人工校对步骤、frontmatter 与资源哈希；工时未知 | validate 只验证结构，非技能质量 |
| 失败恢复 | 重新打包或恢复被 commit=true 改写的 SKILL.md 需存储/备份；费用未知 | 找出被跳过目录/损坏二进制，回滚文件并重审；耗时未知 | 无已验证打包保真率 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 草稿生成 | 正则/固定正文 | 语义质量 |
| fromSession | 只显示 note | 内容未利用 |
| ZIP | 文本文件可写 | 二进制损坏 |

> **思考**：fromSession 只改变 sessionNote，不改变草稿；ZIP 对所有文件做 UTF-8 解码/重编码，二进制资源不保真。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：提供从工作流描述到 SKILL.md、校验、ZIP 分发和目录挂载的一站式入口；详见[Q01](#research-q01)。

提供从工作流描述到 SKILL.md、校验、ZIP 分发和目录挂载的一站式入口；详见[Q01](#research-q01)。

插件注入 tools，ctx.skills 可用时挂载目录；HostFs 优先服务但二进制与目录操作回退 Node。

<a id="detail-section-5"></a>

### 1.4 主要限制

fromSession 只改变 sessionNote，不改变草稿；ZIP 对所有文件做 UTF-8 解码/重编码，二进制资源不保真。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离 outputDir，先 dry-run 再人工核对 SKILL.md；文本技能再打包并解包核查文件，二进制资源不用当前打包路径。详见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

四工具结构可核，但 fromSession 文本未进入生成、二进制资源打包可能损坏；真实会话效果未测。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/tools/skill-new.ts、src/lib/draft.ts、src/lib/tool-env.ts、src/lib/fs-adapter.ts、src/lib/package-skill.ts、src/lib/provider.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交的 README、四工具装配、草稿/环境/FS/打包源码；未运行目标插件或打包。 普通安装、宿主加载及目标测试属本轮范围边界，具体机制/效果未知仍在逐题缺口保留。
- 下一步：同 goal 开关 fromSession 比较输出；含 PNG 的技能打包解包比哈希；隔离 DSH profile 核对 provider 挂载。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-skill-creator](https://github.com/988hj7tczd-oss/dsh-skill-creator)
- **版本号**：0.1.0（[固定提交 f9ff567](https://github.com/988hj7tczd-oss/dsh-skill-creator/tree/f9ff56714decd8d604d97dced494206937c8f907)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

让会话摘要显式进入 dry-run 审阅后再生成，并按原字节打包、校验哈希，可提高可信度；待验证。详见[Q02](#research-q02)、[Q03](#research-q03)。

同 goal 开关 fromSession 比较输出；含 PNG 的技能打包解包比哈希；隔离 DSH profile 核对 provider 挂载。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 299 | — | — | 3753 |
| .ts | source | 16 | 2129 | 1706 | 272 | — |
| .ts | test | 1 | 212 | 158 | 29 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-skill-creator/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-skill-creator/issues?q=is%3Aissue+created%3A2026-09-22T06%3A39%3A39.587Z..2026-10-22T06%3A39%3A39.587Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-skill-creator/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A39%3A39.587Z..2026-10-22T06%3A39%3A39.587Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实四工具技能创建链路、会话上下文实际使用与打包/文件写入完整性。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 四个工具实际生成什么？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

插件注册 skill_new、skill_validate、skill_package、skill_improve_description 四个模型工具，并可把输出目录作为运行期 skill provider。skill_new 默认 dry-run 抽取步骤/工具/格式/缺口与澄清问题，confirm=true 用确定性规则写 SKILL.md；description 改写同样是规则引擎，不调用模型。输出文本提供标准栏目，但抽取只识别编号/列表步骤、特定正则工具名和格式词，复杂散文流程会落入通用占位步骤。运行期 provider 在 ctx.skills 存在时挂载，实际加载效果未测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:41-45](https://github.com/988hj7tczd-oss/dsh-skill-creator/blob/f9ff56714decd8d604d97dced494206937c8f907/README.md#L41-L45)

作者列四工具与目录挂载。

```text
### 插件行为

- **4 个模型工具**通过 `defineTool` 注册（`tools` 服务，effect 式注册，卸载自动清理）。
- **自带"输出目录挂载"**：`apply` 时若 `skills` 注册表可用，将输出根（`outputDir` + `customSkillDirs`）注册为一个运行期 skill provider（`registerProvider`，rank 300 / source `custom`），因此 `skill_new` 写出的技能立即能被 `skill` 工具列出并加载，无需手工改配置。
- 若注册表不可用（未安装 `@deepseek-ai/dsh-skill`），插件在日志与 `skill_new` 返回里给出 **mountHint**：在 profile 的 `skill-filesystem` 配置中增加 `customSkillDirs`。
```

**依据 2 · 源码核查**：[src/index.ts:52-116](https://github.com/988hj7tczd-oss/dsh-skill-creator/blob/f9ff56714decd8d604d97dced494206937c8f907/src/index.ts#L52-L116)

四工具注册及 provider 挂载。

<details>
<summary>查看原文（65行）</summary>

```text
const TOOL_SPECS: readonly ToolSpec[] = [
  skillNewTool,
  skillValidateTool,
  skillPackageTool,
  skillImproveDescriptionTool,
]

function defaultOutputRoot(): string {
  const dshHome = process.env.DSH_HOME !== undefined && process.env.DSH_HOME.length > 0
    ? process.env.DSH_HOME
    : join(homedir(), '.dsh')
  return join(dshHome, 'skills')
}

export function apply(ctx: Context, rawConfig: Partial<Config> = {}): void {
  const config: Config = { ...DEFAULTS, ...rawConfig }
  const customSkillDirs = config.customSkillDirs ?? []
  const outputDir = config.outputDir && config.outputDir.trim().length > 0
    ? config.outputDir.trim()
    : customSkillDirs.length > 0
      ? customSkillDirs[0]!
      : defaultOutputRoot()
  const allRoots = [outputDir, ...customSkillDirs.filter((root) => root !== outputDir)]

  // Tool context: expose plugin config through the same `get` surface.
  const toolCtx: ToolRunContext = {
    get(key: string): unknown {
      if (key === 'skill-creator/config') {
        return { outputDir, customSkillDirs: allRoots, mountRuntimeProvider: config.mountRuntimeProvider !== false }
      }
      return ctx.get(key)
    },
  }

  for (const spec of TOOL_SPECS) {
    ctx.tools.register(defineTool({
      name: spec.name,
      description: spec.description,
      parameters: spec.parameters as never,
      output: {
        schema: spec.outputSchema as never,
        render: (args, value) => spec.render(args as never, value) as never,
        ...(spec.presentationMeta !== undefined
          ? { presentationMeta: (args: never, value: never) => spec.presentationMeta!(args, value) as never }
          : {}),
      },
      async execute(args, exec) {
        return (await spec.run(toolCtx, args as never, exec.signal)) as never
      },
    }))
  }

  // Built-in output-directory mount (best effort).
  if (config.mountRuntimeProvider !== false) {
    const fs = makeHostFs(ctx)
    const report = mountRuntimeProvider(ctx, fs, allRoots)
    if (report.mounted) {
      ctx.logger.info(`[skill-creator] runtime skill provider mounted on ${allRoots.join(', ')}`)
    } else {
      ctx.logger.warn(`[skill-creator] ${report.reason ?? 'runtime provider not mounted'}; fall back to customSkillDirs=${allRoots.join(', ')}`)
    }
  } else {
    ctx.logger.info(`[skill-creator] runtime provider disabled; rely on skill-filesystem customSkillDirs (${allRoots.join(', ')})`)
  }
  ctx.logger.info(`[skill-creator] loaded: ${TOOL_SPECS.length} tools (${TOOL_SPECS.map((spec) => spec.name).join(', ')}); outputDir=${outputDir}`)
```

</details>

**依据 3 · 源码核查**：[src/tools/skill-new.ts:61-105](https://github.com/988hj7tczd-oss/dsh-skill-creator/blob/f9ff56714decd8d604d97dced494206937c8f907/src/tools/skill-new.ts#L61-L105)

dry-run 与 confirm 写入。

<details>
<summary>查看原文（45行）</summary>

```text
  async run(ctx: ToolRunContext, args: Record<string, unknown>, signal?: AbortSignal) {
    const goal = typeof args.goal === 'string' ? args.goal.trim() : ''
    if (goal.length === 0) return errorResult('goal is required')
    const confirm = args.confirm === true
    const fromSession = args.fromSession === true
    const fs = makeHostFs(ctx, signal)

    let sessionNote: string
    if (fromSession) {
      const tail = extractSessionTail(ctx.get('session'))
      sessionNote = tail !== undefined
        ? `已从会话历史抽取最近片段（约 ${tail.length} 字符）并入分析。`
        : '当前上下文未提供会话历史（session 服务不可用），仅按 goal 抽取。'
    } else {
      sessionNote = '未请求会话历史（fromSession=false）。'
    }

    const extraction = extractIntent(goal)
    if (!confirm) {
      const questions = buildClarifyingQuestions(goal, extraction)
      return {
        status: 'needs-confirmation',
        extraction,
        questions,
        sessionNote,
        message: '请先确认意图：回答上方澄清问题（或直接补充 goal 后重试）；确认无误后以 confirm=true 重新调用以生成 SKILL.md。',
      }
    }

    const outputRoot = resolveOutputRoot(ctx, optString(args, 'outputDir'))
    const draft = buildSkillDraft(goal, {
      name: optString(args, 'name'),
      description: optString(args, 'description'),
    })
    const written = await writeSkillDraft(fs, outputRoot, draft)
    return {
      status: 'created',
      skillName: draft.name,
      dir: written.dir,
      path: written.path,
      extraction,
      mountHint: mountHintYaml(written.dir, outputRoot),
      message: 'SKILL.md 已写入。若启用 mountRuntimeProvider，该目录已由插件运行期注册到 ctx.skills；否则请按 mountHint 将输出根加入 skill-filesystem 的 customSkillDirs。',
    }
  },
```

</details>

**依据 4 · 源码核查**：[src/lib/draft.ts:20-64](https://github.com/988hj7tczd-oss/dsh-skill-creator/blob/f9ff56714decd8d604d97dced494206937c8f907/src/lib/draft.ts#L20-L64)

正则抽取范围。

<details>
<summary>查看原文（45行）</summary>

```text
const STEP_LINE = /^\s*(?:[-*•]|\d+[.)])\s+(.*)$/
const NUMBERED_STEP = /^\d+[.、]\s*(.*)$/
const TOOL_BACKTICK = /`([a-zA-Z][a-zA-Z0-9_.-]*)`/g
const TOOL_PHRASE = /(?:使用|用|调用|运行|跑)\s*([a-zA-Z][a-zA-Z0-9_.-]*)/
const FORMAT_LINE = /(?:输入|输出|格式)[:：]?\s*([^。;；,，\n]+)/
const GAP_PATTERN = /TODO|待定|待补充|待确认|未知|\?\?\?|FIXME|不确定|需要确认|请确认|需用户/

function trimSentenceEnd(text: string): string {
  return text.replace(/[。.；;，,、\s]+$/, '')
}

/**
 * Lightweight intent extraction from a free-text workflow description.
 * Heuristic and deterministic (no model required); the model/user may refine
 * the result through the clarification questions.
 */
export function extractIntent(goal: string): IntentExtraction {
  const lines = goal.split(/\n+/).map((line) => line.trim()).filter((line) => line.length > 0)
  const steps: string[] = []
  const tools = new Set<string>()
  const formats = new Set<string>()
  const gaps = new Set<string>()

  for (const line of lines) {
    const step = STEP_LINE.exec(line) ?? NUMBERED_STEP.exec(line)
    if (step !== null) steps.push(trimSentenceEnd(step[1]!))
    for (const match of line.matchAll(TOOL_BACKTICK)) tools.add(match[1]!)
    const toolPhrase = TOOL_PHRASE.exec(line)
    if (toolPhrase !== null) {
      tools.add(toolPhrase[1]!.replace(/(工具|命令|脚本)$/, '').trim())
    }
    if (/(输入|输出|格式|sample|example)/i.test(line)) {
      const format = FORMAT_LINE.exec(line)
      if (format !== null) formats.add(trimSentenceEnd(format[1]!))
    }
    if (GAP_PATTERN.test(line)) gaps.add(trimSentenceEnd(line))
  }

  return {
    steps: unique(steps),
    tools: [...tools],
    formats: [...formats],
    gaps: [...gaps],
  }
}
```

</details>

**依据 5 · 源码核查**：[src/lib/draft.ts:111-187](https://github.com/988hj7tczd-oss/dsh-skill-creator/blob/f9ff56714decd8d604d97dced494206937c8f907/src/lib/draft.ts#L111-L187)

生成 SKILL.md 并写盘。

<details>
<summary>查看原文（77行）</summary>

```text
function renderSkillMarkdown(draft: Omit<SkillDraft, 'content'>): string {
  const { name, description, extraction } = draft
  const sections: string[] = []
  sections.push(`# ${name}`)
  sections.push('')
  sections.push(description)
  sections.push('')
  sections.push('## Workflow / 工作流')
  sections.push('')
  const steps = extraction.steps.length > 0 ? extraction.steps : []
  if (steps.length === 0) {
    sections.push('1. 明确任务输入（必要时向用户确认缺失信息）。')
    sections.push('2. 按下方输入/输出约定执行核心处理。')
    sections.push('3. 校验结果完整性并汇报产出。')
  } else {
    steps.forEach((step, index) => sections.push(`${index + 1}. ${step}`))
  }
  if (extraction.tools.length > 0) {
    sections.push('')
    sections.push(`**Tools**: ${extraction.tools.map((tool) => `\`${tool}\``).join(', ')}`)
  }
  sections.push('')
  sections.push('## Inputs and outputs / 输入与输出')
  sections.push('')
  if (extraction.formats.length === 0) {
    sections.push('- 输入 / 输出格式按实际任务确定；关键信息缺失时先向用户确认，不擅自假设。')
  } else {
    extraction.formats.forEach((format) => sections.push(`- ${format}`))
  }
  sections.push('')
  sections.push('## Boundaries / 边界与排除')
  sections.push('')
  sections.push('- 只在本技能声明的范围内工作；超出范围时明确说明并停止。')
  sections.push('- 不修改与任务无关的文件；改动任何文件前先读取目标内容。')
  sections.push('- 涉及持久化产物时，写出目录/格式遵循用户或项目的既有约定。')
  sections.push('')
  sections.push('## Example / 示例')
  sections.push('')
  sections.push(`> 请用 "${name}" 技能处理：<输入样例>`)
  sections.push('')
  sections.push('按"工作流"逐步执行，并在过程中报告关键中间结果与最终产出。')
  sections.push('')
  return sections.join('\n')
}

/**
 * Build a complete skill draft from a goal description plus optional explicit
 * name/description overrides.
 */
export function buildSkillDraft(
  goal: string,
  opts: { name?: string; description?: string } = {},
): SkillDraft {
  const extraction = extractIntent(goal)
  let name: string
  if (opts.name !== undefined && opts.name.length > 0) {
    const slug = slugifySkillName(opts.name)
    const candidate = slug.length > 0 ? slug : suggestSkillName(goal)
    name = isSkillName(candidate) ? candidate : suggestSkillName(goal)
  } else {
    name = suggestSkillName(goal)
  }
  const description = opts.description !== undefined && opts.description.trim().length > 0
    ? opts.description.trim()
    : buildTriggerDescription(goal, extraction)
  return { name, description, content: renderSkillMarkdown({ name, description, extraction }), extraction }
}

/** Write a draft as `<outputDir>/<name>/SKILL.md`; returns created paths. */
export async function writeSkillDraft(fs: HostFs, outputDir: string, draft: SkillDraft): Promise<{ dir: string; path: string }> {
  const dir = join(outputDir, draft.name)
  await fs.mkdirp(dir)
  const path = join(dir, 'SKILL.md')
  const file = formatFrontmatter({ name: draft.name, description: draft.description }) + draft.content
  await fs.writeText(path, file)
  return { dir, path }
}
```

</details>

#### 缺口

- 生成技能与目标任务的契合程度及触发稳定性缺少对照。
  **影响**：结构化草稿不代表技能合意或有效。
  **进一步探讨**：对固定结构化/散文goal逐条审阅任务步骤，再区分发现、触发与任务质量。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · fromSession 真正进入生成内容吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

skill_new 在 fromSession=true 时调用 extractSessionTail，并把是否找到、长度写入 sessionNote；随后 extractIntent(goal) 和 buildSkillDraft(goal, ...) 仍只传 goal，既没有将 tail 注入抽取，也没有写入草稿。因此 README 所说从会话抽取并入分析在这个提交中与数据流不符：会话仅影响返回文案，不影响 SKILL.md。模型若在调用前自己改写 goal 可以间接带入会话，但那不是工具的 fromSession 能力。建议明确标为仅提示，或在用户许可下真正以可审阅的会话摘要参与草稿生成。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:60-73](https://github.com/988hj7tczd-oss/dsh-skill-creator/blob/f9ff56714decd8d604d97dced494206937c8f907/README.md#L60-L73)

作者声称 fromSession 抽取上下文。

<details>
<summary>查看原文（14行）</summary>

```text
### 2.1 `skill_new` — 捕获意图生成草稿

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `goal` | string (必填) | 要固化成技能的工作流描述：步骤、工具、输入/输出格式、边界 |
| `fromSession` | boolean | 尽力从当前会话历史抽取上下文（session 服务不可用时降级） |
| `name` / `description` | string | 可选覆盖；默认由 goal 生成 |
| `outputDir` | string | 输出根；默认 `插件 config.outputDir` → `customSkillDirs[0]` → `$DSH_HOME/skills` |
| `confirm` | boolean | `false`（默认）= 干跑：返回意图抽取 + 澄清问题，不写盘；`true` = 写盘 |

流程（对齐上游 Capture Intent 迭代闭环的第 1–2 步）：

1. `confirm=false` 干跑 → 返回从 goal / 会话抽取的 `steps / tools / formats / gaps` 与**澄清问题**（缺口处让用户补）；
2. 确认后 `confirm=true` → 生成 `SKILL.md`（frontmatter `name` + `description` + 正文结构：**Workflow / Inputs and outputs / Boundaries / Example**）并写入，同时返回挂载提示。
```

</details>

**依据 2 · 源码核查**：[src/tools/skill-new.ts:68-95](https://github.com/988hj7tczd-oss/dsh-skill-creator/blob/f9ff56714decd8d604d97dced494206937c8f907/src/tools/skill-new.ts#L68-L95)

tail 只用于 sessionNote，生成用 goal。

<details>
<summary>查看原文（28行）</summary>

```text
    let sessionNote: string
    if (fromSession) {
      const tail = extractSessionTail(ctx.get('session'))
      sessionNote = tail !== undefined
        ? `已从会话历史抽取最近片段（约 ${tail.length} 字符）并入分析。`
        : '当前上下文未提供会话历史（session 服务不可用），仅按 goal 抽取。'
    } else {
      sessionNote = '未请求会话历史（fromSession=false）。'
    }

    const extraction = extractIntent(goal)
    if (!confirm) {
      const questions = buildClarifyingQuestions(goal, extraction)
      return {
        status: 'needs-confirmation',
        extraction,
        questions,
        sessionNote,
        message: '请先确认意图：回答上方澄清问题（或直接补充 goal 后重试）；确认无误后以 confirm=true 重新调用以生成 SKILL.md。',
      }
    }

    const outputRoot = resolveOutputRoot(ctx, optString(args, 'outputDir'))
    const draft = buildSkillDraft(goal, {
      name: optString(args, 'name'),
      description: optString(args, 'description'),
    })
    const written = await writeSkillDraft(fs, outputRoot, draft)
```

</details>

**依据 3 · 源码核查**：[src/lib/tool-env.ts:58-82](https://github.com/988hj7tczd-oss/dsh-skill-creator/blob/f9ff56714decd8d604d97dced494206937c8f907/src/lib/tool-env.ts#L58-L82)

extractSessionTail 返回文本。

<details>
<summary>查看原文（25行）</summary>

```text
/** Best-effort recent-session tail extraction (session service duck typing). */
export function extractSessionTail(session: unknown): string | undefined {
  if (typeof session !== 'object' || session === null) return undefined
  const candidate = session as { messages?: unknown; history?: unknown; turns?: unknown }
  const messages = Array.isArray(candidate.messages)
    ? candidate.messages
    : Array.isArray(candidate.history)
      ? candidate.history
      : Array.isArray(candidate.turns)
        ? candidate.turns
        : undefined
  if (messages === undefined || messages.length === 0) return undefined
  const tail: string[] = []
  for (const message of messages.slice(-6)) {
    const entry = message as { content?: unknown; text?: unknown }
    const content = typeof entry.content === 'string'
      ? entry.content
      : typeof entry.text === 'string'
        ? entry.text
        : undefined
    if (content !== undefined) tail.push(content)
  }
  const text = tail.join('\n').trim()
  return text.length > 0 ? text.slice(-3000) : undefined
}
```

</details>

#### 缺口

- 未观察模型调用 skill_new 前是否自行将会话写进 goal。
  **影响**：终端用户感知与实际内容差异待实测。
  **进一步探讨**：同一 goal 分别以 fromSession false/true 生成并比较字节。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 文件安全和打包保真度怎样？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

生成默认写 DSH_HOME/skills，也允许参数直接指定 outputDir；服务端文本写入会先读已有文件，但二进制 ZIP、mkdir/remove 走 Node fs，未见对 outputDir/outDir 的工作区边界限制。打包遍历文件时一律 fs.readText 再 TextEncoder 编入 ZIP，图片、PDF、可执行资源等二进制资产会被 UTF-8 损坏；read 失败的目录会被静默跳过，仍可能产出缺文件包。README 说可打包分发，实际适用于文本型技能，带资源技能需先验证文件清单与哈希。运行期写路径权限、第三方许可、同名覆盖也需按环境评估。

成本分期：首次使用涉及DSH tools/skills 与可写 outputDir，宿主上下文与存储费用依使用量，未知，人工需写清 goal、审 dry-run、选择隔离输出目录；耗时未知；持续使用涉及工具本身为确定性生成/校验/改写/ZIP，占文件IO与存储；工具schema、参数和结果进入宿主模型上下文的费用另依使用量，金额/频率未知，人工需人工校对步骤、frontmatter 与资源哈希；工时未知；失败恢复涉及重新打包或恢复被 commit=true 改写的 SKILL.md 需存储/备份；费用未知，人工需找出被跳过目录/损坏二进制，回滚文件并重审；耗时未知。金额、频次、实际耗时均未有同条件证据，不能填0或推算单位收益。

创新假设推导：Q02 中 fromSession 仅生成 sessionNote、草稿仍只用 goal，Q03 中 readText→TextEncoder 会损坏二进制；相对当前文本型生成/ZIP，若先向用户展示受控会话摘要并按原字节打包且做哈希对比，可扩大可分发资源的可信范围。条件是会话内容授权、字节级 fs 接口和文件清单维护，代价为额外审阅/校验。最小证伪：给同一 goal 两段不同授权摘要及含 PNG 的技能目录，比对草稿差异、ZIP 解包字节哈希；摘要不受控进入、图片哈希不等或静默漏文件即推翻。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/tool-env.ts:26-43](https://github.com/988hj7tczd-oss/dsh-skill-creator/blob/f9ff56714decd8d604d97dced494206937c8f907/src/lib/tool-env.ts#L26-L43)

输出路径优先级及显式任意路径。

<details>
<summary>查看原文（18行）</summary>

```text
/** Default skill output root: `$DSH_HOME/skills` or `~/.dsh/skills`. */
export function defaultSkillsRoot(): string {
  const dshHome = typeof process !== 'undefined' && process.env.DSH_HOME !== undefined && process.env.DSH_HOME.length > 0
    ? process.env.DSH_HOME
    : join(homedir(), '.dsh')
  return join(dshHome, 'skills')
}

/** Resolve the skill output root: arg > config.outputDir > customSkillDirs[0] > default. */
export function resolveOutputRoot(ctx: ToolRunContext, explicit?: string): string {
  if (explicit !== undefined && explicit.trim().length > 0) return explicit.trim()
  const config = readCreatorConfig(ctx)
  if (config.outputDir !== undefined && config.outputDir.trim().length > 0) return config.outputDir.trim()
  if (config.customSkillDirs !== undefined && config.customSkillDirs.length > 0 && config.customSkillDirs[0]!.trim().length > 0) {
    return config.customSkillDirs[0]!.trim()
  }
  return defaultSkillsRoot()
}
```

</details>

**依据 2 · 源码核查**：[src/lib/fs-adapter.ts:99-143](https://github.com/988hj7tczd-oss/dsh-skill-creator/blob/f9ff56714decd8d604d97dced494206937c8f907/src/lib/fs-adapter.ts#L99-L143)

服务写前读，二进制/目录走 Node。

<details>
<summary>查看原文（45行）</summary>

```text
/** Adapter over the fs service; mutations honour read-before-write. */
export function serviceHostFs(fs: FileSystemLike, signal?: AbortSignal): HostFs {
  return {
    async stat(path) {
      abortIf(signal)
      const target = await fs.resolve(path, { signal })
      const info = await fs.stat(target, signal)
      if (info === undefined) return undefined
      const type: FsTargetType = info.type === 'file' ? 'file' : info.type === 'directory' ? 'dir' : 'other'
      return { type, size: info.size ?? 0 }
    },
    async readText(path) {
      abortIf(signal)
      const target = await fs.resolve(path, { signal })
      return await fs.readText(target, signal)
    },
    async writeText(path, content) {
      abortIf(signal)
      const target = await fs.resolve(path, { signal })
      const existing = await fs.stat(target, signal)
      if (existing !== undefined) {
        // Observation policy: read the current content before overwriting it.
        await fs.readText(target, signal)
      }
      await fs.writeText(target, content, undefined, signal)
    },
    async writeBin(path, data) {
      // The fs service is text-only; binary artifacts are host-side.
      abortIf(signal)
      await mkdir(dirname(path), { recursive: true })
      await writeFile(path, data)
    },
    async listDir(path) {
      abortIf(signal)
      const target = await fs.resolve(path, { signal })
      const entries = await fs.listDir(target, signal)
      return entries.map((entry) => entry.name)
    },
    async mkdirp(path) {
      await mkdir(path, { recursive: true })
    },
    async remove(path) {
      await rm(path, { recursive: true, force: true })
    },
  }
```

</details>

**依据 3 · 源码核查**：[src/lib/package-skill.ts:60-94](https://github.com/988hj7tczd-oss/dsh-skill-creator/blob/f9ff56714decd8d604d97dced494206937c8f907/src/lib/package-skill.ts#L60-L94)

遍历读取失败跳过。

<details>
<summary>查看原文（35行）</summary>

```text
/** Recursively collect packageable files under a skill directory. */
export async function collectSkillFiles(fs: HostFs, skillDir: string): Promise<CollectedSkill> {
  const name = basename(skillDir)
  const files: CollectedFile[] = []
  async function walk(current: string): Promise<void> {
    let entries: string[]
    try {
      entries = await fs.listDir(current)
    } catch {
      return
    }
    for (const entry of entries) {
      const abs = join(current, entry)
      const rel = relative(skillDir, abs).split(sep).join('/')
      let isDir = false
      let isFile = false
      try {
        const info = await fs.stat(abs)
        if (info === undefined) continue
        isDir = info.type === 'dir'
        isFile = info.type === 'file'
      } catch {
        // unreadable entry: skip
      }
      if (shouldExcludeSkillPath(rel, isDir)) continue
      if (isDir) {
        await walk(abs)
      } else if (isFile) {
        files.push({ abs, rel })
      }
    }
  }
  await walk(skillDir)
  return { name, files }
}
```

</details>

**依据 4 · 源码核查**：[src/lib/package-skill.ts:108-129](https://github.com/988hj7tczd-oss/dsh-skill-creator/blob/f9ff56714decd8d604d97dced494206937c8f907/src/lib/package-skill.ts#L108-L129)

打包一律 readText/TextEncoder。

<details>
<summary>查看原文（22行）</summary>

```text
export async function packSkillDir(fs: HostFs, skillDir: string, outDir?: string): Promise<SkillPackageResult> {
  const validation = await validateSkillDir(fs, skillDir)
  if (!validation.ok) {
    throw new Error(`packSkill: validation failed:\n${formatChecks(validation.checks)}`)
  }
  const collected = await collectSkillFiles(fs, skillDir)
  if (collected.files.length === 0) {
    throw new Error('packSkill: no files to package')
  }

  const entries: ZipEntry[] = [{ name: `${collected.name}/`, data: new Uint8Array(0) }]
  for (const file of collected.files) {
    const content = await fs.readText(file.abs)
    entries.push({ name: `${collected.name}/${file.rel}`, data: new TextEncoder().encode(content) })
  }
  const zipBytes = buildZip(entries)

  const outPath = outDir !== undefined && outDir.length > 0
    ? join(outDir, `${collected.name}.skill`)
    : join(dirname(skillDir), `${collected.name}.skill`)
  await fs.mkdirp(dirname(outPath))
  await fs.writeBin(outPath, zipBytes)
```

</details>

**依据 5 · 作者声明**：[README.md:90-96](https://github.com/988hj7tczd-oss/dsh-skill-creator/blob/f9ff56714decd8d604d97dced494206937c8f907/README.md#L90-L96)

作者称打包 skill zip。

```text
### 2.3 `skill_package` — 打包 `.skill`（zip）

参数：`path`（必填）、`outDir`（可选，默认技能目录的父目录）。**打包前先跑 `skill_validate`，校验失败拒绝打包。**

排除规则（移植自上游 `package_skill.py`）：`__pycache__/`、`node_modules/`（任意深度）、`*.pyc`（任意深度）、`.DS_Store`（任意深度）、技能根级 `evals/`（仅根级；深层 `evals` 保留）。

产物结构：`<skill-name>/ + 内容`，输出 `<outDir>/<skill-name>.skill`。zip 使用 store 方式（`src/lib/zip.ts` 内建最小 ZIP 读写，零依赖，便于离线测试与验证）。
```

#### 缺口

- 文本化打包的资源受损范围、漏文件覆盖与目标环境路径权限缺少对照。
  **影响**：源码已识别字节保真风险，不能据此界定所有资源和部署的实际损失范围。
  **进一步探讨**：以合成二进制及目录清单做原/解包字节对照，并单独核路径策略与覆盖。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
