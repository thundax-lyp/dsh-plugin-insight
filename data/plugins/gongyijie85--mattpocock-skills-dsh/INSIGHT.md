# Matt Pocock 技能集 DSH 适配

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[dd6b2dd](https://github.com/gongyijie85/mattpocock-skills-dsh/tree/dd6b2dde1e78cf9d937ac3b49796dd38d4d504c4)

<!-- BEGIN META -->
[![GitHub ★ 30](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=30&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/gongyijie85/mattpocock-skills-dsh) [![npm 30d 2,011](https://img.shields.io/static/v1?label=npm+30d&message=2%2C011&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/mattpocock-skills-dsh) [![最新发布 2026-09-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/mattpocock-skills-dsh)
<!-- END META -->

> **功能**：把 Matt Pocock 的工程技能集注册到 DSH，支持技能发现、按需加载和相对参考文件。

> **亮点**：贡献是将上游技能通过host provider接入DSH，保存用户调用标记和目录资源基址；这是分发/适配增量，不是新执行引擎或上游方法原创。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：关键限制是发现与可加载不等于具体工程可办结，部分技能会要求提交或外发；此外list仍读完整文件、读取错误可能静默缺席，不能将按需返回正文解释为完全免I/O或强权限门禁。见 [Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 用户获得的是自动工程执行还是可发现的技能集，贡献归属于谁？](#detail-section-11)
  - [Q02 · list/get 如何处理正文、调用标记、资源基址和同名优先级？](#detail-section-12)
  - [Q03 · 技能中的交付动作依赖哪些宿主能力，失败由谁承担？](#detail-section-13)
  - [Q04 · 打包方式如何改变首次、持续、失败与退出成本？](#detail-section-14)
  - [Q05 · 哪类项目适合受控试用，怎样证伪整包适配的价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有 DSH 开发环境的软件开发者，把上游设计澄清、规格、测试和评审技能统一提供给 profile 内的 Agent；具体任务仍由模型、工具和用户共同完成。

原生技能目录可逐个复制、审阅和固定所需技能；本包统一分发与provider注册，技能方法归属上游。见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 技能目录提供器 | 发现25个打包技能入口 | host skills服务，读取失败可能缺席 |
| 完整技能加载与资源定位 | 返回正文及相对参考目录 | 模型还需实际调用和读取 |
| 用户调用语义映射 | 保留显式调用技能标记 | 不等同于全工作流权限门禁 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH skills服务与兼容Cordis | 必需 | 注册host provider | 插件无法提供候选 |
| 包内skills目录 | 必需 | list/get正文和资源 | 读取失败时缺席，不是自动修复 |
| 模型与skill读取工具 | 效果条件 | 理解并执行具体流程 | 可发现不等于已执行 |
| 项目测试/tracker/权限 | 按技能任务必需 | 工程验收或外部交付 | 缺配置需补齐或收窄任务 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户审阅目标技能、项目约定与包版本 | 不把技能文本当授权 |
| 加载 | 安装到profile并重启，核对候选及正文 | 不只检查dump-config |
| 执行 | Agent加载选定技能，用户决定设计分支 | 具体工具仍受项目授权限制 |
| 验收/退出 | 用户检查合格产物、失败引用和副作用 | 不合适则移除整包并保留少数本地技能 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包存储和安装资源，金额未知 | 审阅正文、配置profile、重启 | 准备时长未测 |
| 持续使用 | list读全部技能文件，任务模型费用未知 | 决策、验收、升级审阅 | 没有合格任务成本对照 |
| 失败恢复 | 重试模型/工具成本未知 | 检查缺席、资源和同名候选 | 外发/提交由各系统处理 |
| 退出 | 停止provider加载 | 移除包并重启 | 已创建产物不自动撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 技能发现与完整加载 | provider list/get和目录资源基址 | 特定宿主运行结果 |
| 显式用户调用 | true映射为模型不可调用 | 跨技能间接调用的任务效果 |
| 工程交付 | 代表性技能给出测试/评审/规格流程 | 合格率、返工和总投入改善 |

> **思考**：关键限制是发现与可加载不等于具体工程可办结，部分技能会要求提交或外发；此外list仍读完整文件、读取错误可能静默缺席，不能将按需返回正文解释为完全免I/O或强权限门禁。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：贡献是将上游技能通过host provider接入DSH，保存用户调用标记和目录资源基址；这是分发/适配增量，不是新执行引擎或上游方法原创。见 [Q01](#research-q01)、[Q02](#research-q02)。

可借鉴lib/index.js 167–195的资源基址和122–126的调用标记适配，能让普通SKILL包保留宿主语义。自写frontmatter解析和静默读取失败则要求内容检查与诊断，不能将注释中的惰性加载当I/O事实，见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

关键限制是发现与可加载不等于具体工程可办结，部分技能会要求提交或外发；此外list仍读完整文件、读取错误可能静默缺席，不能将按需返回正文解释为完全免I/O或强权限门禁。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有DSH和项目验收惯例的开发者，可先在独立分支加载一项澄清技能，检查候选、参考和用户确认是否正常。涉及提交或外部issue时先按项目规则取得授权；若额外流程和冲突增加返工，移除整包并保留所需本地技能。具体对照与退出判据见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持provider适配和调用语义；技能执行、任务收益及新假设未验证。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、lib/index.js、README.md、skills/grill-me/SKILL.md、skills/grilling/SKILL.md、skills/implement/SKILL.md、skills/to-spec/SKILL.md、skills/wait-what/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整读取195行provider、根清单与补丁；核对25个SKILL目录，定向检查grill-me/grilling/implement/to-spec/wait-what正文；未逐字验证全部上游一致性。
- 下一步：- 已检查固定源码及代表性技能正文。
- 未安装或运行目标技能、插件、模型和真实宿主。
- 调用效果、特定项目权限和净收益未验证。

**分析版本**

- **仓库**：[gongyijie85/mattpocock-skills-dsh](https://github.com/gongyijie85/mattpocock-skills-dsh)
- **版本号**：0.1.10（[固定提交 dd6b2dd](https://github.com/gongyijie85/mattpocock-skills-dsh/tree/dd6b2dde1e78cf9d937ac3b49796dd38d4d504c4)）
- **版本日期**：2026-11-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证方向是保留调用语义与相对资源的打包provider能否减少手工技能同步漂移；按 [Q05](#research-q05)用同模型任务对照失败引用、人工维护与合格交付，若冲突及返工增加则否定。

- 已检查固定源码及代表性技能正文。
- 未安装或运行目标技能、插件、模型和真实宿主。
- 调用效果、特定项目权限和净收益未验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 50 | 3448 | — | — | 34321 |
| .js | source | 1 | 195 | 129 | 57 | — |
| .mjs | source | 1 | 89 | 69 | 13 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-19），可前往 [GitHub Issues](https://github.com/gongyijie85/mattpocock-skills-dsh/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查上游技能的DSH发现/加载适配与具体采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户获得的是自动工程执行还是可发现的技能集，贡献归属于谁？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户获得的是面向 DSH 软件开发对话的打包技能提供器，不是自动完成工程的执行引擎。README 明确将正文归属 Matt Pocock 上游，本仓新增的是 DSH Cordis host 层注册、相对资源定位和调用语义适配。用户不必把每份 SKILL.md 手动复制进本地目录，安装一个包后可在所用 profile 的技能目录中发现它们，并在需要时加载。

固定树有25个技能入口，包含从澄清设计、原型交接到规格与实现的说明。但25个文档入口不等于25个已验证成功的工作流；例如 grill-me 只有转调 grilling 的指令，真正交互方式取决于其目标正文与模型。原生技能文件目录也是可行替代，适合只需少数技能、希望自行审阅和控制更新的团队。这里可识别的是分发和宿主适配便利，不将上游方法当本仓原创，也不因目录能看到技能就声称任务收益成立。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:16-27](https://github.com/gongyijie85/mattpocock-skills-dsh/blob/dd6b2dde1e78cf9d937ac3b49796dd38d4d504c4/README.md#L16-L27)

作者自述上游来源、host注册与非官方适配。

<details>
<summary>查看原文（12行）</summary>

```text
为 **DeepSeek Harness (DSH)** 打造的 Matt Pocock 技能插件包:把
[mattpocock/skills](https://github.com/mattpocock/skills)(来自
[aihero.dev/skills](https://www.aihero.dev/skills) 的"真实工程师"技能集)
移植到 DSH 的 Cordis 插件架构上。

插件会向 `ctx.skills` 注册表的 **host 层** 注册一个技能提供者,因此每个
agent preset 的作用域链都会合并这些技能。技能正文随包分发
(`skills/<name>/SKILL.md`),通过 `import.meta.url` 定位——这是包的
组装事实,不需要任何用户配置。

> **非官方移植**:技能内容改编自 [mattpocock/skills](https://github.com/mattpocock/skills)(MIT,
> © Matt Pocock)。上游以 Claude Code 插件格式发布;本包做的是 DSH 适配。
```

</details>

**依据 2 · 源码核查**：[lib/index.js:167-195](https://github.com/gongyijie85/mattpocock-skills-dsh/blob/dd6b2dde1e78cf9d937ac3b49796dd38d4d504c4/lib/index.js#L167-L195)

真实提供器注册，只提供技能定义。

<details>
<summary>查看原文（29行）</summary>

```text
/** Register the packaged matt-pocock provider on `ctx.skills`. */
function apply(ctx) {
  const skillsRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'skills')
  ctx.skills.registerProvider((control) => ({
    name,
    async list(options) {
      return discoverCandidates(skillsRoot, options.signal)
    },
    async get(candidate, options) {
      const parsed = await parseSkillFile(candidate.path, options.signal)
      if (parsed === undefined) return undefined
      return {
        name: parsed.name,
        description: parsed.description,
        ...(parsed.whenToUse !== undefined ? { whenToUse: parsed.whenToUse } : {}),
        invocation: invocationFrom(parsed.metadata),
        source: SOURCE,
        provider: name,
        resourceBase: { kind: 'directory', path: candidate.locator },
        path: candidate.path,
        ...(Object.keys(parsed.metadata).length > 0 ? { metadata: parsed.metadata } : {}),
        content: parsed.content
      }
    }
  }))
}

export { apply, name, inject }
export default { apply, name, inject }
```

</details>

**依据 3 · 源码核查**：[skills/grill-me/SKILL.md:1-7](https://github.com/gongyijie85/mattpocock-skills-dsh/blob/dd6b2dde1e78cf9d937ac3b49796dd38d4d504c4/skills/grill-me/SKILL.md#L1-L7)

入口为用户显式调用并转到grilling，不是独立执行器。

```text
---
name: grill-me
description: A relentless interview to sharpen a plan or design.
disable-model-invocation: true
---

Call the Skill tool with "grilling".
```

#### 缺口

- 没有本团队真实任务的使用/返工对照。
  **影响**：不能证明整包比只复制所需技能更省总投入。
  **进一步探讨**：选择同一已决策规格任务，比对返工次数、人工决策时间和最终测试结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · list/get 如何处理正文、调用标记、资源基址和同名优先级？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

根 bundle 补丁装入同名包，apply 注入 skills 服务，在固定 package skills 目录注册 provider。list 遍历子目录并调用 parseSkillFile，提取name、description、whenToUse、invocation、rank=550及locator/path；get 再读候选文件，返回完整正文和目录资源基址，使相对参考能定位到该技能目录。disable-model-invocation 的字符串 true 被映射为 modelInvocable=false、userInvocable=true，其余候选允许模型和用户调用。

源码注释说正文按需加载，但 list 实际会 readFile 读取每个完整 SKILL.md 后才丢弃正文；延迟的是完整内容对宿主/模型的返回，不是首次发现阶段的文件I/O。provider rank 是优先级声明，真正同名覆盖由宿主注册表决定，本轮不推断550必然获胜。目录读取失败返回空数组，单文件失败返回undefined，取消后停止或不返回文件；这避免抛出扫描错误，却也可能让缺少技能表现为静默缺席。前置解析器只支持它实现的标量与folded文本，不应泛称完整YAML解析器。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:7-9](https://github.com/gongyijie85/mattpocock-skills-dsh/blob/dd6b2dde1e78cf9d937ac3b49796dd38d4d504c4/cordis.patch.yml#L7-L9)

bundle挂载同名provider。

```text
- insert:
    - id: mattpocock-skills-dsh
      name: 'mattpocock-skills-dsh'
```

**依据 2 · 源码核查**：[lib/index.js:47-87](https://github.com/gongyijie85/mattpocock-skills-dsh/blob/dd6b2dde1e78cf9d937ac3b49796dd38d4d504c4/lib/index.js#L47-L87)

实际标量frontmatter解析器。

<details>
<summary>查看原文（41行）</summary>

```text
function parseFrontmatter(text) {
  if (!text.startsWith('---')) return null
  const end = text.indexOf('\n---', 3)
  if (end === -1) return null
  const block = text.slice(3, end)
  const body = text.slice(end + 4).replace(/^\n+/, '')
  const metadata = {}
  let currentKey = null
  let folded = false
  for (const rawLine of block.split('\n')) {
    const line = rawLine.trimEnd()
    if (/^[ \t]/.test(line) && currentKey !== null) {
      // Indented continuation of a folded scalar.
      const value = line.trim()
      if (value) {
        metadata[currentKey] = folded
          ? `${metadata[currentKey]} ${value}`
          : `${metadata[currentKey]}\n${value}`
      }
      continue
    }
    const match = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line)
    if (!match) {
      currentKey = null
      folded = false
      continue
    }
    let value = match[2].trim()
    folded = value === '>' || value === '>-' || value === '>+'
    if (folded) {
      value = ''
    } else if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    metadata[match[1]] = value
    currentKey = folded ? match[1] : null
  }
  return { metadata, body }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:96-126](https://github.com/gongyijie85/mattpocock-skills-dsh/blob/dd6b2dde1e78cf9d937ac3b49796dd38d4d504c4/lib/index.js#L96-L126)

整文件读取和调用标记映射。

<details>
<summary>查看原文（31行）</summary>

```text
async function parseSkillFile(skillFile, signal) {
  let text
  try {
    text = await readFile(skillFile, 'utf8')
  } catch {
    return undefined
  }
  if (signal?.aborted) return undefined
  const parsed = parseFrontmatter(text)
  if (parsed === null) return undefined
  return {
    name: parsed.metadata.name ?? '',
    description: parsed.metadata.description ?? '',
    whenToUse: parsed.metadata.whenToUse,
    metadata: parsed.metadata,
    content: parsed.body
  }
}

/**
 * Upstream `disable-model-invocation: true` marks a user-invoked skill
 * (reachable only by the human). Map it onto DSH's invocation flags;
 * anything else stays model- and user-invocable.
 * @param metadata - parsed frontmatter metadata.
 * @returns the DSH invocation record.
 */
function invocationFrom(metadata) {
  if (metadata['disable-model-invocation'] === 'true') {
    return { modelInvocable: false, userInvocable: true }
  }
  return { modelInvocable: true, userInvocable: true }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:136-164](https://github.com/gongyijie85/mattpocock-skills-dsh/blob/dd6b2dde1e78cf9d937ac3b49796dd38d4d504c4/lib/index.js#L136-L164)

list确实解析每个文件，读取失败为空。

<details>
<summary>查看原文（29行）</summary>

```text
async function discoverCandidates(skillsRoot, signal) {
  let entries
  try {
    entries = await readdir(skillsRoot, { withFileTypes: true })
  } catch {
    return []
  }
  const candidates = []
  for (const entry of entries) {
    if (signal?.aborted) break
    if (!entry.isDirectory()) continue
    const skillDir = join(skillsRoot, entry.name)
    const skillFile = join(skillDir, 'SKILL.md')
    const parsed = await parseSkillFile(skillFile, signal)
    if (parsed === undefined) continue
    candidates.push({
      name: parsed.name,
      description: parsed.description,
      ...(parsed.whenToUse !== undefined ? { whenToUse: parsed.whenToUse } : {}),
      invocation: invocationFrom(parsed.metadata),
      source: SOURCE,
      provider: name,
      rank: PACKAGED_SKILL_RANK,
      locator: skillDir,
      path: skillFile,
      ...(Object.keys(parsed.metadata).length > 0 ? { metadata: parsed.metadata } : {})
    })
  }
  return candidates
```

</details>

**依据 5 · 源码核查**：[lib/index.js:167-195](https://github.com/gongyijie85/mattpocock-skills-dsh/blob/dd6b2dde1e78cf9d937ac3b49796dd38d4d504c4/lib/index.js#L167-L195)

get及resourceBase返回。

<details>
<summary>查看原文（29行）</summary>

```text
/** Register the packaged matt-pocock provider on `ctx.skills`. */
function apply(ctx) {
  const skillsRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'skills')
  ctx.skills.registerProvider((control) => ({
    name,
    async list(options) {
      return discoverCandidates(skillsRoot, options.signal)
    },
    async get(candidate, options) {
      const parsed = await parseSkillFile(candidate.path, options.signal)
      if (parsed === undefined) return undefined
      return {
        name: parsed.name,
        description: parsed.description,
        ...(parsed.whenToUse !== undefined ? { whenToUse: parsed.whenToUse } : {}),
        invocation: invocationFrom(parsed.metadata),
        source: SOURCE,
        provider: name,
        resourceBase: { kind: 'directory', path: candidate.locator },
        path: candidate.path,
        ...(Object.keys(parsed.metadata).length > 0 ? { metadata: parsed.metadata } : {}),
        content: parsed.content
      }
    }
  }))
}

export { apply, name, inject }
export default { apply, name, inject }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 技能中的交付动作依赖哪些宿主能力，失败由谁承担？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

skills 服务可用只保证提供器能注册。具体技能还依赖模型正确读取其正文与相对参考、项目测试命令和领域文档，以及任务所需的工具权限。grilling 用设计树分轮提问，要求用户确认后才行动；grill-me 是显式用户入口，内部再调用可由模型触发的grilling。调用标记不把后者限制为人类独占，也不能当成整个工程的审批系统。

implement 正文明写定期类型检查、最后评审并提交当前分支；to-spec 要把规格发布到项目issue tracker，并在缺配置时转向setup技能。这些是会引导Agent写入Git或外部系统的说明，不是provider自身调用或不可绕过权限门禁；实际授权仍由宿主和用户规则决定。README还明确七课流程的Sandcastle是外部工具，不在本包内。若模型没有合适工具、tracker不可用或项目约定冲突，用户仍要补配置、收窄任务或退回手工流程，不能把流程文档称为已闭环交付。

#### 证据与依据

**依据 1 · 源码核查**：[skills/grilling/SKILL.md:6-28](https://github.com/gongyijie85/mattpocock-skills-dsh/blob/dd6b2dde1e78cf9d937ac3b49796dd38d4d504c4/skills/grilling/SKILL.md#L6-L28)

分轮澄清、用户决策与确认边界。

<details>
<summary>查看原文（23行）</summary>

````text
Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

Format a round like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it; don't ask the user for anything you could look up yourself. Don't block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the sub-agent to report; ask the rest of the frontier now. The _decisions_ are the user's: put each to them and wait.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding.
````

</details>

**依据 2 · 源码核查**：[skills/implement/SKILL.md:7-15](https://github.com/gongyijie85/mattpocock-skills-dsh/blob/dd6b2dde1e78cf9d937ac3b49796dd38d4d504c4/skills/implement/SKILL.md#L7-L15)

测试/评审及commit是正文要求，不是本插件执行。

```text
Implement the work described by the user in the spec or tickets.

Use tdd where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once done, use code-review to review the work.

Commit your work to the current branch.
```

**依据 3 · 源码核查**：[skills/to-spec/SKILL.md:7-19](https://github.com/gongyijie85/mattpocock-skills-dsh/blob/dd6b2dde1e78cf9d937ac3b49796dd38d4d504c4/skills/to-spec/SKILL.md#L7-L19)

tracker配置、用户确认和发布动作。

<details>
<summary>查看原文（13行）</summary>

```text
This skill takes the current conversation context and codebase understanding and produces a spec. Do NOT interview the user; just synthesize what you already know.

The issue tracker and triage label vocabulary should have been provided to you. If not, tell the user to run `setup-matt-pocock-skills`.

## Process

1. Explore the repo to understand the current state of the codebase, if you haven't already. Use the project's domain glossary vocabulary throughout the spec, and respect any ADRs in the area you're touching.

2. Sketch out the seams at which you're going to test the feature. Existing seams should be preferred to new ones. Use the highest seam possible. If new seams are needed, propose them at the highest point you can. The fewer seams across the codebase, the better - the ideal number is one.

Check with the user that these seams match their expectations.

3. Write the spec using the template below, then publish it to the project issue tracker. Apply the `ready-for-agent` triage label - no need for additional triage.
```

</details>

**依据 4 · 作者声明**：[README.md:41-49](https://github.com/gongyijie85/mattpocock-skills-dsh/blob/dd6b2dde1e78cf9d937ac3b49796dd38d4d504c4/README.md#L41-L49)

Sandcastle为外部工具。

```text
| Step | 原文 | 对照中文 |
| --- | --- | --- |
| 0 | This email. Pick your path. | 这封邮件就是起点:选一条路。 |
| 1 | `/grill-with-docs` , so the agent is not building from fog | 先把想法拷问清楚,agent 才不会在迷雾中开工 |
| 2 | `/prototype` and `/handoff` , to test the uncertain part in a toy version | 用玩具原型验证不确定的部分,并留好交接 |
| 3 | `/to-spec` and `/to-tickets` , to break big work into reviewable slices | 把大工作拆成可评审的切片 |
| 4 | `Sandcastle` , to run AFK agents somewhere safe | 在安全的地方跑挂机(AFK)agent(外部工具,不在本包) |
| 5 | `/code-review` , so each run teaches the next one | 每一次评审,都让下一次运行变得更好 |
| 6 | The full loop, start to finish | 从起点到终点,跑完整条循环 |
```

#### 缺口

- 未核验特定项目的技能工具、tracker权限和冲突规则。
  **影响**：不能保证选任一技能就能在该项目安全办结。
  **进一步探讨**：逐项核对任务所需工具和授权，先在独立分支选择无需外发的一项文档任务。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 打包方式如何改变首次、持续、失败与退出成本？

**研究主题**：效果与总成本

#### 完整回答

相对逐个复制25个目录，整包把版本固定、安装、挂载与卸载统一到一个profile包；少量技能使用者仍可以选择原生目录，避免整包带来的候选和更新负担。首次需兼容DSH、Cordis skills服务及包管理工具，重启profile并确认挂载，再核对实际候选，而不是只看dump-config一行。provider本身没有请求模型或外部HTTP，实际模型token和业务支出由加载后的技能任务产生；不能把JS适配器无网络调用说成整项任务免费。

持续发现会读每个SKILL.md，完整get再读一次，取消会截断发现；维护者更新技能正文会影响后续执行语义，需要用户审阅。文件读取失败静默缺席时要检查包内容、同名优先级与加载日志，不能仅反复重启。退出可移除包并重启，但技能已经引导创建的文档、issue和Git提交不会自动撤销，须按各系统流程处理。没有同任务成本记录，不能计算单位合格交付费用或声称节时。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:98-114](https://github.com/gongyijie85/mattpocock-skills-dsh/blob/dd6b2dde1e78cf9d937ac3b49796dd38d4d504c4/README.md#L98-L114)

作者提供重启核对与卸载步骤。

<details>
<summary>查看原文（17行）</summary>

````text
### 重启并验证

bundle 层在 profile 启动时挂载,所以需要**重启 profile**(停掉后重新运行
`dsh web` / `npx @deepseek-ai/dsh web`,再刷新浏览器)。确认层已组合:

```sh
dsh --profile web --dump-config     # 必须出现 `mattpocock-skills-dsh` 行
```

之后技能会出现在 agent 技能目录中,可以用 `skill` 工具加载。

### 卸载

```sh
dsh plugin --profile web remove mattpocock-skills-dsh
# 卸载后同样需要重启 profile
```
````

</details>

**依据 2 · 源码核查**：[lib/index.js:96-112](https://github.com/gongyijie85/mattpocock-skills-dsh/blob/dd6b2dde1e78cf9d937ac3b49796dd38d4d504c4/lib/index.js#L96-L112)

文件解析失败返回undefined。

<details>
<summary>查看原文（17行）</summary>

```text
async function parseSkillFile(skillFile, signal) {
  let text
  try {
    text = await readFile(skillFile, 'utf8')
  } catch {
    return undefined
  }
  if (signal?.aborted) return undefined
  const parsed = parseFrontmatter(text)
  if (parsed === null) return undefined
  return {
    name: parsed.metadata.name ?? '',
    description: parsed.metadata.description ?? '',
    whenToUse: parsed.metadata.whenToUse,
    metadata: parsed.metadata,
    content: parsed.body
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:136-164](https://github.com/gongyijie85/mattpocock-skills-dsh/blob/dd6b2dde1e78cf9d937ac3b49796dd38d4d504c4/lib/index.js#L136-L164)

list整文件I/O与取消。

<details>
<summary>查看原文（29行）</summary>

```text
async function discoverCandidates(skillsRoot, signal) {
  let entries
  try {
    entries = await readdir(skillsRoot, { withFileTypes: true })
  } catch {
    return []
  }
  const candidates = []
  for (const entry of entries) {
    if (signal?.aborted) break
    if (!entry.isDirectory()) continue
    const skillDir = join(skillsRoot, entry.name)
    const skillFile = join(skillDir, 'SKILL.md')
    const parsed = await parseSkillFile(skillFile, signal)
    if (parsed === undefined) continue
    candidates.push({
      name: parsed.name,
      description: parsed.description,
      ...(parsed.whenToUse !== undefined ? { whenToUse: parsed.whenToUse } : {}),
      invocation: invocationFrom(parsed.metadata),
      source: SOURCE,
      provider: name,
      rank: PACKAGED_SKILL_RANK,
      locator: skillDir,
      path: skillFile,
      ...(Object.keys(parsed.metadata).length > 0 ? { metadata: parsed.metadata } : {})
    })
  }
  return candidates
```

</details>

**依据 4 · 源码核查**：[skills/implement/SKILL.md:7-15](https://github.com/gongyijie85/mattpocock-skills-dsh/blob/dd6b2dde1e78cf9d937ac3b49796dd38d4d504c4/skills/implement/SKILL.md#L7-L15)

可能产生Git修改的技能任务。

```text
Implement the work described by the user in the spec or tickets.

Use tdd where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once done, use code-review to review the work.

Commit your work to the current branch.
```

**依据 5 · 源码核查**：[skills/to-spec/SKILL.md:7-19](https://github.com/gongyijie85/mattpocock-skills-dsh/blob/dd6b2dde1e78cf9d937ac3b49796dd38d4d504c4/skills/to-spec/SKILL.md#L7-L19)

外部写入不会随provider卸载回滚。

<details>
<summary>查看原文（13行）</summary>

```text
This skill takes the current conversation context and codebase understanding and produces a spec. Do NOT interview the user; just synthesize what you already know.

The issue tracker and triage label vocabulary should have been provided to you. If not, tell the user to run `setup-matt-pocock-skills`.

## Process

1. Explore the repo to understand the current state of the codebase, if you haven't already. Use the project's domain glossary vocabulary throughout the spec, and respect any ADRs in the area you're touching.

2. Sketch out the seams at which you're going to test the feature. Existing seams should be preferred to new ones. Use the highest seam possible. If new seams are needed, propose them at the highest point you can. The fewer seams across the codebase, the better - the ideal number is one.

Check with the user that these seams match their expectations.

3. Write the spec using the template below, then publish it to the project issue tracker. Apply the `ready-for-agent` triage label - no need for additional triage.
```

</details>

#### 缺口

- 缺乏实际任务调用量、人工跟进、失败和升级维护耗时。
  **影响**：不能量化整包相对手工技能的净节省或合格任务成本。
  **进一步探讨**：记录同批任务总token、人工决策、返工和升级审阅时间，按合格交付数对比。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪类项目适合受控试用，怎样证伪整包适配的价值？

**研究主题**：新假设与验证、采用判断

#### 完整回答

适合已有DSH profile和项目测试/评审惯例、希望统一使用上游工程技能的开发者，在独立分支先试一项范围明确的任务。先检查技能正文与仓库规则，特别是implement的提交要求和to-spec的发布要求；没有相应授权就收窄为本地草稿，不能把技能文本当权限。首次可只加载grilling澄清一个边界明确的设计，并要求最终输出能被人复述和确认，而不是直接让整条七课链运行。

待验证假设是provider保留显式调用语义并共享参考目录，比手动复制多个技能减少版本漂移与失效引用。选固定版本、相同模型和同组项目任务，对照打包provider与只复制所需技能；检查错误加载、资源读取失败、未经确认动作、人工修正与合格任务率。若打包组引用更稳定且总维护不升高才支持假设；若同名冲突、静默缺席或多余流程增加返工，就移除整包、保留审阅过的少数本地技能。这个比较尚未执行，不能计作现有业务收益。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:122-126](https://github.com/gongyijie85/mattpocock-skills-dsh/blob/dd6b2dde1e78cf9d937ac3b49796dd38d4d504c4/lib/index.js#L122-L126)

明确调用语义映射。

```text
function invocationFrom(metadata) {
  if (metadata['disable-model-invocation'] === 'true') {
    return { modelInvocable: false, userInvocable: true }
  }
  return { modelInvocable: true, userInvocable: true }
```

**依据 2 · 源码核查**：[lib/index.js:167-195](https://github.com/gongyijie85/mattpocock-skills-dsh/blob/dd6b2dde1e78cf9d937ac3b49796dd38d4d504c4/lib/index.js#L167-L195)

共享provider与资源基址。

<details>
<summary>查看原文（29行）</summary>

```text
/** Register the packaged matt-pocock provider on `ctx.skills`. */
function apply(ctx) {
  const skillsRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'skills')
  ctx.skills.registerProvider((control) => ({
    name,
    async list(options) {
      return discoverCandidates(skillsRoot, options.signal)
    },
    async get(candidate, options) {
      const parsed = await parseSkillFile(candidate.path, options.signal)
      if (parsed === undefined) return undefined
      return {
        name: parsed.name,
        description: parsed.description,
        ...(parsed.whenToUse !== undefined ? { whenToUse: parsed.whenToUse } : {}),
        invocation: invocationFrom(parsed.metadata),
        source: SOURCE,
        provider: name,
        resourceBase: { kind: 'directory', path: candidate.locator },
        path: candidate.path,
        ...(Object.keys(parsed.metadata).length > 0 ? { metadata: parsed.metadata } : {}),
        content: parsed.content
      }
    }
  }))
}

export { apply, name, inject }
export default { apply, name, inject }
```

</details>

**依据 3 · 源码核查**：[skills/grilling/SKILL.md:24-28](https://github.com/gongyijie85/mattpocock-skills-dsh/blob/dd6b2dde1e78cf9d937ac3b49796dd38d4d504c4/skills/grilling/SKILL.md#L24-L28)

用户决策确认的具体控制点。

```text
Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it; don't ask the user for anything you could look up yourself. Don't block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the sub-agent to report; ask the rest of the frontier now. The _decisions_ are the user's: put each to them and wait.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding.
```

#### 缺口

- 整包维护便利是否抵消更多候选和流程负担未知。
  **影响**：源码支持受控试用，不支持持续安装或效率排名。
  **进一步探讨**：按固定任务对照，结合合格率、权限错误、资源失败及人工维护决定继续或退出。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
