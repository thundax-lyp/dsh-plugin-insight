# dsh-math-olympiad

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[b04fadf](https://github.com/988hj7tczd-oss/dsh-math-olympiad/tree/b04fadfeaf88f8f98ba09ab57e9379eb36f05ea0)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-math-olympiad) [![npm 30d 104](https://img.shields.io/static/v1?label=npm+30d&message=104&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-math-olympiad) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-math-olympiad)
<!-- END META -->

> **功能**：挂载竞赛数学解题 Skill，要求独立验证证明、诚实弃权，并可选编译 PDF。

> **亮点**：把求解、对抗验证、最多两轮修复和弃权写成可加载流程；详见[Q01](#research-q01)。

> **主要限制**：验证器隔离只由 Skill 文本纪律和模拟测试示例体现，生产期未见执行性保证；详见[Q02](#research-q02)。

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
  - [Q01 · Skill 如何挂载，解题和验证由谁执行？](#detail-section-11)
  - [Q02 · 测试是否证明验证器新鲜上下文、防泄漏和正确率？](#detail-section-12)
  - [Q03 · 安装、PDF 输出和使用成本如何界定？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：辅助 IMO/Putnam 等竞赛题解题、证明校验和讲解输出。

普通模型单轮解题或自检，无显式新上下文及弃权协议。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 数学 Skill 挂载 | 为模型提供五步解题/验证指引 | 依赖 DSH base，非自动求解器 |
| 对抗验证协议 | 要求独立 subagent 攻击证明 | 文本纪律，真实隔离未验证 |
| LaTeX PDF 脚本 | 两遍编译 tex | 需 TeX；失败退 Markdown |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH base 与 skill-filesystem | 挂载必需 | 发现 SKILL.md | 技能不可用 |
| 独立 subagent | 完整验证流程必需 | 新鲜上下文攻击证明 | 只能人工或单模型核查 |
| TeX 引擎 | 仅 PDF 必需 | 编译 tex | 使用 Markdown 数学 |
| 相邻 dsh-src | 仅开发 link 形态 | 构建依赖 | 开发安装受阻 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 管理员核 base、subagent、可选 TeX 与构建授权 | 依赖路径清楚 |
| 加载 | 安装 bundle 并确认 Skill 可发现 | locator/skill provider 均出现 |
| 解题 | 模型解题后只给验证器证明正文，最多两轮 | 验证器列具体缺口 |
| 验收/恢复 | 用户核标准解和入参；错误时重解/弃权 | 无 TeX 改 Markdown，不把 high 当保证 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH base/skill-filesystem、可选 TeX 与磁盘；价格未知 | 安装、核 prepare 授权、选择题目与输出，耗时未知 | 开发需要相邻 dsh-src；发布形态另核 |
| 持续使用 | 求解模型与额外 subagent 轮次、可选 TeX CPU；用量未知 | 核证明与验证缺口、校准信心；耗时未知 | 最多两轮但真实调用未测 |
| 失败恢复 | 重解或 TeX 失败改 Markdown，可能追加模型/CPU；费用未知 | 人工检查错误证明、弃权原因和 PDF 错误；耗时未知 | 无正确率或单位成本数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 流程与弃权 | SKILL 文本明确五步/两轮（Q01） | 真实执行与正确率 |
| 隔离验证 | 测试 stub 模拟 proof-only（Q02） | 生产 subagent 是否真正隔离 |
| PDF | 脚本支持 TeX 两遍编译（Q03） | 目标机器编译成功率 |

> **思考**：验证器隔离只由 Skill 文本纪律和模拟测试示例体现，生产期未见执行性保证；详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把求解、对抗验证、最多两轮修复和弃权写成可加载流程；详见[Q01](#research-q01)。

locator 仅供路径，测试用本地 stub 模拟协议；TeX 脚本有引擎白名单和退出码。

<a id="detail-section-5"></a>

### 1.4 主要限制

验证器隔离只由 Skill 文本纪律和模拟测试示例体现，生产期未见执行性保证；详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有可信 subagent 与 DSH base 的团队可隔离试题，逐题核验证器入参、标准解与弃权；详见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

挂载、指令与模拟 smoke 可核；真实 subagent 隔离、数学正确率和信心校准未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/locator.ts、skills/dsh-math-olympiad/SKILL.md、skills/dsh-math-olympiad/scripts/compile_pdf.sh、tests/smoke.e2e.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态审阅；未启动 DSH、真实 subagent 或 TeX。
- 下一步：用标准答案题集盲测错误通过率、弃权和额外 token/时间；核真实 subagent 入参。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-math-olympiad](https://github.com/988hj7tczd-oss/dsh-math-olympiad)
- **版本号**：0.1.0（[固定提交 b04fadf](https://github.com/988hj7tczd-oss/dsh-math-olympiad/tree/b04fadfeaf88f8f98ba09ab57e9379eb36f05ea0)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

若真实独立验证器仅接证明正文，错误证明通过率或可下降；需盲测并核入参，详见[Q03](#research-q03)。

用标准答案题集盲测错误通过率、弃权和额外 token/时间；核真实 subagent 入参。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 545 | — | — | 6592 |
| .ts | source | 1 | 76 | 36 | 34 | — |
| .ts | test | 1 | 509 | 413 | 63 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-math-olympiad/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-math-olympiad/issues?q=is%3Aissue+created%3A2026-09-22T08%3A03%3A44.820Z..2026-10-22T08%3A03%3A44.820Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-math-olympiad/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T08%3A03%3A44.820Z..2026-10-22T08%3A03%3A44.820Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实竞赛数学 Skill 的挂载、对抗验证/弃权是否由实际代码保证，以及 PDF/安装成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Skill 如何挂载，解题和验证由谁执行？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

bundle patch 插入 locator 与独立 skill-filesystem provider；locator 只定位 skills 目录并发布服务。SKILL.md 要求模型纯推理解题、剥离思考链后调用新上下文 subagent 对抗验证，最多两轮；仓库没有自动求解器或生产期强制验证器，实际流程遵循取决于模型与宿主提供的 subagent。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-30](https://github.com/988hj7tczd-oss/dsh-math-olympiad/blob/b04fadfeaf88f8f98ba09ab57e9379eb36f05ea0/cordis.patch.yml#L1-L30)

双行挂载、隔离默认 root。

<details>
<summary>查看原文（30行）</summary>

```text
# dsh-math-olympiad bundle layer.
#
# Mounts the competition-math skill into a deployment by:
#  1. `dsh-math-olympiad-locator` — resolves this package's own `skills/`
#     directory (runs from the installed `lib/locator.js`) and publishes the
#     `mathOlympiadSkills` service;
#  2. `dsh-math-olympiad-skill` — an additional `@deepseek-ai/dsh-skill-filesystem`
#     provider (distinct `providerName` so it never collides with the base row)
#     that scans the located skills root.
#
# Requires the `skill` registry and the `@deepseek-ai/dsh-skill-filesystem`
# package — i.e. `@deepseek-ai/dsh-base` must be an earlier bundle layer (it is
# the default first bundle of every profile).
- insert:
    - id: dsh-math-olympiad-locator
      name: 'dsh-math-olympiad/lib/locator.js'
    - id: dsh-math-olympiad-skill
      name: '@deepseek-ai/dsh-skill-filesystem'
      inject:
        - mathOlympiadSkills
      config:
        providerName: math-olympiad
        # Isolate default roots: this provider must see only customSkillDirs
        # (this package's skills/), or the second provider would re-discover
        # and re-watch every project/user/bundled default root — duplicate
        # candidates dropped with a de-dup warning plus doubled refresh cost
        # (dsh-skill-filesystem's Config.includeDefaultRoots defaults to true).
        includeDefaultRoots: false
        customSkillDirs:
          - !!js ctx.mathOlympiadSkills.skillsDir
```

</details>

**依据 2 · 源码核查**：[src/locator.ts:51-76](https://github.com/988hj7tczd-oss/dsh-math-olympiad/blob/b04fadfeaf88f8f98ba09ab57e9379eb36f05ea0/src/locator.ts#L51-L76)

只提供技能路径服务。

<details>
<summary>查看原文（26行）</summary>

```text
/** Register the locator service. */
export function apply(ctx: Context): void {
  const skillsDir = resolveSkillsDir()
  ctx.provide('mathOlympiadSkills', {
    skillsDir,
    referencesDir: join(skillsDir, 'references'),
    scriptsDir: join(skillsDir, 'scripts'),
  })
  if (!existsSync(skillsDir)) {
    ctx.logger.warn(`[dsh-math-olympiad] skills dir not found: ${skillsDir}`)
  } else {
    ctx.logger.info(`[dsh-math-olympiad] skill located at ${skillsDir}`)
  }
}

/** Resolve the package root from this module's own location. */
function resolvePackageRoot(): string {
  const here = dirname(fileURLToPath(import.meta.url))
  // src/locator.ts -> parent is the package root; lib/locator.js -> parent too.
  const candidate = dirname(here)
  return existsSync(join(candidate, 'package.json')) ? candidate : here
}

function resolveSkillsDir(): string {
  return join(resolvePackageRoot(), 'skills', 'dsh-math-olympiad')
}
```

</details>

**依据 3 · 作者声明**：[skills/dsh-math-olympiad/SKILL.md:21-87](https://github.com/988hj7tczd-oss/dsh-math-olympiad/blob/b04fadfeaf88f8f98ba09ab57e9379eb36f05ea0/skills/dsh-math-olympiad/SKILL.md#L21-L87)

模型侧五步/两轮与信心规则。

<details>
<summary>查看原文（67行）</summary>

```text
## 定位与边界

本技能用于 IMO / Putnam / USAMO / AIME 与各类数学竞赛题的分步求解与证明校验。
核心不是"解得多快"，而是两条纪律：

1. **对抗验证**：解完之后，剥离思考链，只把干净的证明正文交给**新鲜上下文的
   subagent 验证器**，用具体失败模式逐一攻击，而不是泛泛"检查一下逻辑"。
2. **诚实弃权**：信心是**校准过**的（high / medium），不确定就直说
   "no confident solution"，绝不为了显得有用而硬编一个答案。

**不承诺正确率。** 本技能的价值在流程严谨与弃权诚实，不在正确率担保；
输出永远以"解 + 验证结论 + 信心"三位一体呈现，供你自行判断。

## 触发条件

对话中出现以下任一情形即触发（与 frontmatter 一致）：

- 用户明确说：`solve this IMO problem`、`prove this olympiad inequality`、
  `verify this competition proof`、`find a counterexample`、
  `is this proof correct`；
- 文本含 `IMO`、`Putnam`、`USAMO`、`AIME`、`olympiad`、`competition math`
  或中文：数学竞赛、竞赛数学、奥林匹克、竞赛不等式/数论/几何/组合、
  证明校验、证明是否正确、找一个反例。

## 工作流程（五步）

### 第 1 步 — 解（纯推理，不求快）

只用推理，不调用任何外部工具。按 `references/solver_heuristics.md`
（Pólya 六板斧）找路：类比相关问题、特化到小情形手工算、泛化、放宽条件、
逆向、换一种表述。草稿、试探、犹豫都是**思考链**，保留在你自己这里，
不要写进最终文本里。

### 第 2 步 — 剥离思考链，只留证明正文

把解整理成**干净的证明正文**：定理与前提、定义、每一步推理、结论。
删掉所有"我试了 X 不行""感觉应该…""这里可能…"之类的叙述。
验证器只能看到这一份正文——**思考链一旦泄露给验证器，它会被带偏去附和
你的结论，验证就失效了。**

### 第 3 步 — 对抗验证（subagent，新鲜上下文）

调用 **subagent** 跑验证器，关键纪律：

- **新鲜上下文**：子代理不共享本会话上下文、不共享第 1、2 步的任何推理轨迹；
  它只收到第 2 步的证明正文 + 攻击指令。
- 攻击指令必须**具体**：附上 `references/verifier_patterns.md` 的失败模式
  清单，要求逐条对照、指出**具体缺口**（漏的情形、隐含假设、未证步骤、
  等号条件、方向错误…），禁止"整体逻辑没问题"式的泛泛结论。
- 给验证器两个必查项：**"这能证 RH 吗？"式的开放问题特化测试**
  （见下"红旗启发式"第 2 条）与**已知构造 / 反例冲突检查**。

### 第 4 步 — 判定与循环

- 验证器报**致命缺口** → 回到第 1 步重解，**最多 2 轮**；
- 2 轮后仍存在致命缺口 → 走第 5 步的弃权输出；
- 只有验证器零缺口通过，才给出 high；有缺口但已修补、或修补未被二次
  验证确认 → medium。

### 第 5 步 — 输出

固定结构（模板见 `references/presentation_prompts.md`）：

1. **解**：证明正文（只此一份，不混入思考链）；
2. **验证结论**：验证器发现了什么、修了什么、还留了什么；
3. **信心**：`high` / `medium` / 诚实弃权 `no confident solution`（附卡点与
   需要补的条件）。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 测试是否证明验证器新鲜上下文、防泄漏和正确率？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

smoke 测试自行定义 runFlow 与 verify stub，VerifyInput 只有 proof，检查的是模拟协议和坏题弃权路径。测试说明生产流程由模型按 Skill 执行，真正防泄漏依赖正文纪律；不能把 stub 入参结构断言当真实 subagent 隔离，也不能以零缺口→high 当经统计校准的正确率。Skill 的开放问题陷阱是启发式，不是数学正确性证明。

#### 证据与依据

**依据 1 · 源码核查**：[tests/smoke.e2e.ts:9-29](https://github.com/988hj7tczd-oss/dsh-math-olympiad/blob/b04fadfeaf88f8f98ba09ab57e9379eb36f05ea0/tests/smoke.e2e.ts#L9-L29)

测试明确区分模拟 harness 与真实 subagent。

<details>
<summary>查看原文（21行）</summary>

```text
 * 覆盖的验收点：
 *   1. 交付物结构完整（skills/SKILL.md + references/* + scripts/* + README +
 *      tests + 插件脚手架 package.json / cordis.yml / cordis.patch.yml /
 *      src/*），shell 脚本可执行。
 *   2. SKILL.md frontmatter 触发词覆盖 IMO/Putnam/USAMO/olympiad/竞赛/证明校验
 *      等；5 条红旗启发式（含"无自信解"弃权条款）原样保留；流程写明
 *      "最多 2 轮"。
 *   3. 验证器协议：技能正文明示 subagent + 新鲜上下文；本测试把 subagent
 *      调用替换为受控 stub 并**断言其被调用**；"只收到剥离后的证明正文"
 *      由 harness 只转发 `opts.solve().proof` 这一结构保证（思考链无转发
 *      通道），测试以结构断言锁定该契约——注意这是构造性保证，不是对真实
 *      泄漏的检测（真正防泄漏依赖 SKILL.md 第 2 步的正文纪律）。
 *   4. 弃权路径：构造坏题 → 输出 no confident solution 而不硬编。
 *   5. 无 LaTeX 时不崩溃并提示安装；check_latex.sh / compile_pdf.sh 退出码
 *      语义正确；"无引擎"分支用构造的引擎隔离 PATH 在任何机器上确定性触发；
 *      引擎**可用**时用 node:test 真实调用 compile_pdf.sh 验证退出码 0 与
 *      PDF 产物存在（引擎不可用时该用例显式 skip 并打印原因，不假绿）。
 *
 * 说明：生产环境里"解→验证→结论"由模型按 SKILL.md 执行（真实 subagent
 * 工具）；本测试以确定性 harness 复现同一协议（MAX_VERIFY_ROUNDS = 2、
 * 置信标定规则与 SKILL.md 一致），保证链路离线可复现、不崩。
```

</details>

**依据 2 · 源码核查**：[tests/smoke.e2e.ts:85-146](https://github.com/988hj7tczd-oss/dsh-math-olympiad/blob/b04fadfeaf88f8f98ba09ab57e9379eb36f05ea0/tests/smoke.e2e.ts#L85-L146)

本地 stub 接口、两轮与信心映射。

<details>
<summary>查看原文（62行）</summary>

```text
const MAX_VERIFY_ROUNDS = 2
type Confidence = 'high' | 'medium' | 'no confident solution'

interface SolveResult {
  /** 私有思考链（测试中用于断言不泄漏）。 */
  chain: string[]
  /** 干净证明正文。 */
  proof: string
}

interface VerifyInput {
  proof: string
}

interface VerifyOutput {
  fatal: string[]
  gaps: string[]
}

interface FlowOptions {
  solve: () => SolveResult
  /** 生产 = 调用 subagent（新鲜上下文）；测试 = 受控 stub。 */
  verify: (input: VerifyInput) => Promise<VerifyOutput>
  latexAvailable: boolean
}

interface FlowResult {
  proof: string
  confidence: Confidence
  conclusion: string
  verifyRounds: number
  rendered: { kind: 'pdf' | 'markdown'; value: string }
}

/** 与 SKILL.md 五步协议一致的确定性流程（验证最多 2 轮）。 */
async function runFlow(opts: FlowOptions): Promise<FlowResult> {
  let rounds = 0
  let proof = opts.solve().proof
  let last: VerifyOutput | null = null
  for (;;) {
    rounds++
    last = await opts.verify({ proof })
    if (last.fatal.length === 0) break
    if (rounds >= MAX_VERIFY_ROUNDS) break
    proof = opts.solve().proof // 验证失败 → 回到第 1 步重解
  }
  const fatal = last?.fatal ?? []
  const gaps = last?.gaps ?? []
  let confidence: Confidence
  if (fatal.length > 0) confidence = 'no confident solution'
  else if (gaps.length === 0) confidence = 'high'
  else confidence = 'medium'
  const conclusion =
    confidence === 'no confident solution'
      ? `卡点：${fatal.join('；')}。${rounds} 轮修复后仍未通过，按诚实弃权条款不硬编答案。`
      : gaps.length === 0
        ? '验证器零缺口通过（含退化/等号/边界检查）。'
        : `验证器指出非致命缺口：${gaps.join('；')}。`
  const rendered = opts.latexAvailable
    ? { kind: 'pdf' as const, value: `${SKILL_DIR}/solution.pdf` }
    : { kind: 'markdown' as const, value: proof }
  return { proof, confidence, conclusion, verifyRounds: rounds, rendered }
```

</details>

**依据 3 · 作者声明**：[skills/dsh-math-olympiad/SKILL.md:93-119](https://github.com/988hj7tczd-oss/dsh-math-olympiad/blob/b04fadfeaf88f8f98ba09ab57e9379eb36f05ea0/skills/dsh-math-olympiad/SKILL.md#L93-L119)

五条红旗及新鲜上下文纪律。

<details>
<summary>查看原文（27行）</summary>

```text
## 红旗启发式（5 条，改变结果的原则）

这几条不是建议，是**纪律**。任一命中，默认按对应动作执行，除非你能说明
为什么不适用。

1. **验证前剥离思考链。** 验证器看到推理会被带偏附和。新鲜上下文、只给
   干净的证明正文——这是整个流程的前提，省不得。
2. **"这能证 RH 吗？"** 把定理特化到 ζ 函数如果是著名开放问题（黎曼猜想
   RH 及同类），那证明**必有缺口**——这是最可靠的红旗。验证器必须主动跑
   这个测试，而不是等它自然暴露。
3. **短证明 → 提取一般引理。** 先试 2×2 反例。一般形式若假，找出本例的
   特别处（是哪个额外假设救了它）；若引理为真，写下来单独验证。
4. **同一缺口出现两次 → 退一步。** 同一个缺口修完又出现，case split 可能
   在掩盖一个统一论证/统一反例。三行有时胜过十二页——先找统一视角，别再
   打补丁。
5. **诚实说"无自信解"。** 错而自信比诚实弃权更糟。走到第 4 步仍不合格就
   弃权，输出卡点与所需条件，绝不硬编。

## 验证器运行规范（subagent 调用细则）

- 每次验证开一次新 subagent；**不共享本会话历史**，参数里只放：
  `证明正文`、`失败模式清单（verifier_patterns.md 全文）`、
  `攻击指令`（逐条对照，给出具体反例/缺口，禁止泛泛肯定）、
  `已知构造提示`（如 RH 特化陷阱、经典反例族）。
- 验证器输出结构：`[致命缺口列表] / [非致命缺口列表] / [通过项] / 结论`。
  有致命缺口时给**最小反例或缺口定位**，方便你回到第 1 步。
- 你自己（会话侧）只做调度与归纳，**不要替验证器回答"对还是错"**。
```

</details>

#### 缺口

- 未有独立题集对照验证正确率、弃权率和泄漏率
  **影响**：无法证实“校准”或对抗验证提升效果
  **进一步探讨**：以带标准解和无解/开放陷阱的盲测题集对照普通流程

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 安装、PDF 输出和使用成本如何界定？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

开发形态 README 要求相邻 dsh-src 检出；发布形态依赖 dsh-base/skill-filesystem，git 直装在 pnpm≥10 可能需显式允许 prepare。PDF 需本地 TeX 引擎，compile_pdf.sh 选白名单引擎并在 tex 所在目录运行两遍，失败可退 Markdown；脚本运行来自模型按 Skill 指令，非 locator 自动触发。首次成本是 profile/依赖及可选 TeX 安装和权限审阅；持续成本是求解模型、额外 subagent 验证轮次与人工复核；失败恢复包括两轮重解或弃权、TeX 故障改 Markdown。现金/模型调用量、耗时与正确率未知。创新假设：相对单模型自检，独立上下文只给证明与具体失败模式，或可减少验证器对解题轨迹的附和；条件是宿主真正隔离且模型确实调用，代价为额外轮次。最小证伪用带标准答案的盲测题集，对照单模型自检与此流程，统计错误证明通过率、弃权率、token/时间，并审实际 subagent 入参；若错误通过不降或轨迹进入验证器，则假设不成立。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH base/skill-filesystem、可选 TeX 与磁盘；价格未知 | 安装、核 prepare 授权、选择题目与输出，耗时未知 | 开发需要相邻 dsh-src；发布形态另核 |
| 持续使用 | 求解模型与额外 subagent 轮次、可选 TeX CPU；用量未知 | 核证明与验证缺口、校准信心；耗时未知 | 最多两轮但真实调用未测 |
| 失败恢复 | 重解或 TeX 失败改 Markdown，可能追加模型/CPU；费用未知 | 人工检查错误证明、弃权原因和 PDF 错误；耗时未知 | 无正确率或单位成本数据 |

以人工核对正确的证明和可解释验证结论为成本单位，而非high标签或PDF生成即合格。引擎名白名单仅限定调用程序，未限制TeX正文读写权限；脚本直接在输入目录运行且无超时/隔离，具体TeX能力由引擎和宿主权限决定。长编译、辅助文件和不可信tex的处置是额外恢复成本，不能因不用外部API推零成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-9](https://github.com/988hj7tczd-oss/dsh-math-olympiad/blob/b04fadfeaf88f8f98ba09ab57e9379eb36f05ea0/README.md#L3-L9)

开发 link 前提。

```text
> [!IMPORTANT]
> **依赖前置：相邻 `dsh-src` 检出（`link:` 依赖）**
> 本项目在开发形态下使用 `link:` 依赖指向相邻的 DeepSeek Harness 源码检出（`dsh-src`），
> 与当前仓库保持同一父目录布局（`<parent>/dsh-src`）。克隆本仓库后：
> 1. 先把官方 `deepseek-ai/deepseek-harness` 检出到与本仓库同级的 `dsh-src/` 目录，并执行其 `pnpm install && pnpm run build`；
> 2. 再按下方「安装」一节执行本仓库的 `pnpm install --offline && pnpm build` 与测试。
> 发布到 npm 的版本会尽量把 `link:` 依赖替换为 registry 真实版本；无法替换的内部包保持 `link:`，见各包 README 说明。
```

**依据 2 · 作者声明**：[README.md:43-76](https://github.com/988hj7tczd-oss/dsh-math-olympiad/blob/b04fadfeaf88f8f98ba09ab57e9379eb36f05ea0/README.md#L43-L76)

profile 挂载与 pnpm prepare 授权。

<details>
<summary>查看原文（34行）</summary>

````text
## 安装（发布形态：profile bundle）

技能以 `@deepseek-ai/dsh-skill-filesystem` 的 `customSkillDirs` 挂载
（PROMPT 指定的 DSH 侧集成方式）：

```sh
cd dsh-math-olympiad 的父目录
dsh plugin --profile <name> add ./dsh-math-olympiad
dsh --profile <name>
```

- 前置：profile 需含 `@deepseek-ai/dsh-base`（默认第一个 bundle，提供
  `skill` 注册表与 `@deepseek-ai/dsh-skill-filesystem` 包）。
- `package.json` 的 `dsh.bundle.patch` 指向 `cordis.patch.yml`；该层插入两个
  行：`dsh-math-olympiad-locator`（把技能目录暴露为 `mathOlympiadSkills`
  服务，构造时从 `import.meta.url` 定位包内 `skills/`）与
  `dsh-math-olympiad-skill`（独立的 `providerName: math-olympiad`
  skill-filesystem 提供者，避免与 base 行冲突；配置
  `includeDefaultRoots: false`，只扫本包的 `customSkillDirs`，不重复扫描
  默认根）。
- git 直装只取**源码**：`prepare` 负责构建 `lib/`（自包含 tsc，无需
  monorepo 上下文）。但 **pnpm ≥10 默认拒绝运行 git 依赖的 `prepare`**，
  首次 `add` 会失败——先允许构建再重跑 `add`：在 profile 的
  `pnpm-workspace.yaml` 里加

  ```yaml
  allowBuilds:
    dsh-math-olympiad: true
  ```

  （或用交互式 `pnpm approve-builds`）。注意这是"允许该包源码在安装期于你
  的机器上执行"的授权，只对信任的包放开。若不想走这一步，直接
  `dsh plugin add ./dsh-math-olympiad-0.1.0.tgz`（`pnpm pack` 产物）或从
  npm 安装——这两种分发自带 `lib/` 构建产物，无需任何构建许可。
````

</details>

**依据 3 · 源码核查**：[skills/dsh-math-olympiad/scripts/compile_pdf.sh:19-100](https://github.com/988hj7tczd-oss/dsh-math-olympiad/blob/b04fadfeaf88f8f98ba09ab57e9379eb36f05ea0/skills/dsh-math-olympiad/scripts/compile_pdf.sh#L19-L100)

参数白名单、两次编译、失败码。

<details>
<summary>查看原文（82行）</summary>

```text
if [ $# -lt 1 ] || [ $# -gt 2 ]; then
  usage
  exit 3
fi

input="$1"

if [ ! -f "$input" ]; then
  echo "compile_pdf: 输入文件不存在: $input" >&2
  exit 3
fi

case "$input" in
  *.tex) ;;
  *) echo "compile_pdf: 输入必须是 .tex 文件: $input" >&2; exit 3 ;;
esac

engine="${2:-}"

if [ -z "$engine" ]; then
  for cand in pdflatex xelatex lualatex; do
    if command -v "$cand" >/dev/null 2>&1; then
      engine="$cand"
      break
    fi
  done
fi

if [ -z "$engine" ]; then
  echo "compile_pdf: 找不到 TeX 引擎（自动探测 pdflatex/xelatex/lualatex 均无），无法编译。" >&2
  echo "compile_pdf: 先运行 skills/dsh-math-olympiad/scripts/check_latex.sh 获取安装提示。" >&2
  echo "compile_pdf: 或改用 Markdown 数学输出（\$...\$ / \$\$...\$\$），流程不受影响。" >&2
  exit 1
fi

# 引擎白名单：只允许受支持的 TeX 引擎，避免任意 PATH 可执行文件被当作引擎执行。
case "$engine" in
  pdflatex|xelatex|lualatex) ;;
  *) echo "compile_pdf: 不支持的引擎: ${engine}（仅支持 pdflatex | xelatex | lualatex）" >&2
     usage
     exit 3 ;;
esac

if ! command -v "$engine" >/dev/null 2>&1; then
  echo "compile_pdf: 引擎 $engine 不在 PATH 中，无法编译。" >&2
  echo "compile_pdf: 先运行 skills/dsh-math-olympiad/scripts/check_latex.sh 获取安装提示。" >&2
  echo "compile_pdf: 或改用 Markdown 数学输出（\$...\$ / \$\$...\$\$），流程不受影响。" >&2
  exit 1
fi

dir=$(dirname "$input")
base=$(basename "$input" .tex)

if ! cd "$dir" 2>/dev/null; then
  echo "compile_pdf: 无法进入目录: $dir" >&2
  exit 3
fi

# 两遍编译以解析交叉引用；非交互 + 遇错即停，第一遍失败立即报告。
"$engine" -interaction=nonstopmode -halt-on-error "$base.tex" >/dev/null 2>&1
status=$?
if [ $status -ne 0 ]; then
  echo "compile_pdf: $engine 第一遍编译失败（退出码 ${status}）；" >&2
  echo "compile_pdf: 不带输出重定向手动重跑以查看错误日志:" >&2
  echo "  cd \"$dir\" && $engine -interaction=nonstopmode -halt-on-error \"$base.tex\"" >&2
  exit 2
fi

"$engine" -interaction=nonstopmode -halt-on-error "$base.tex" >/dev/null 2>&1
status=$?
if [ $status -ne 0 ]; then
  echo "compile_pdf: $engine 第二遍编译失败（退出码 ${status}）。" >&2
  exit 2
fi

if [ ! -f "$base.pdf" ]; then
  echo "compile_pdf: $engine 运行结束但未产出 ${base}.pdf。" >&2
  exit 2
fi

echo "compile_pdf: 已生成 $dir/$base.pdf"
exit 0
```

</details>

**依据 4 · 作者声明**：[skills/dsh-math-olympiad/SKILL.md:73-91](https://github.com/988hj7tczd-oss/dsh-math-olympiad/blob/b04fadfeaf88f8f98ba09ab57e9379eb36f05ea0/skills/dsh-math-olympiad/SKILL.md#L73-L91)

两轮、弃权与 PDF 回退指引。

<details>
<summary>查看原文（19行）</summary>

```text
### 第 4 步 — 判定与循环

- 验证器报**致命缺口** → 回到第 1 步重解，**最多 2 轮**；
- 2 轮后仍存在致命缺口 → 走第 5 步的弃权输出；
- 只有验证器零缺口通过，才给出 high；有缺口但已修补、或修补未被二次
  验证确认 → medium。

### 第 5 步 — 输出

固定结构（模板见 `references/presentation_prompts.md`）：

1. **解**：证明正文（只此一份，不混入思考链）；
2. **验证结论**：验证器发现了什么、修了什么、还留了什么；
3. **信心**：`high` / `medium` / 诚实弃权 `no confident solution`（附卡点与
   需要补的条件）。

渲染：先跑 `scripts/check_latex.sh`；有 TeX 引擎则用 `scripts/compile_pdf.sh`
编译 PDF；没有则输出 Markdown 数学（行内 `$…$`、行间 `$$…$$`），并提示
安装 TeX（脚本会给出各平台安装命令，见 `scripts/check_latex.sh`）。
```

</details>

**依据 5 · 源码核查**：[skills/dsh-math-olympiad/scripts/compile_pdf.sh:67-100](https://github.com/988hj7tczd-oss/dsh-math-olympiad/blob/b04fadfeaf88f8f98ba09ab57e9379eb36f05ea0/skills/dsh-math-olympiad/scripts/compile_pdf.sh#L67-L100)

输入目录直接两遍编译，无本脚本超时或TeX正文沙箱

<details>
<summary>查看原文（34行）</summary>

```text
fi

dir=$(dirname "$input")
base=$(basename "$input" .tex)

if ! cd "$dir" 2>/dev/null; then
  echo "compile_pdf: 无法进入目录: $dir" >&2
  exit 3
fi

# 两遍编译以解析交叉引用；非交互 + 遇错即停，第一遍失败立即报告。
"$engine" -interaction=nonstopmode -halt-on-error "$base.tex" >/dev/null 2>&1
status=$?
if [ $status -ne 0 ]; then
  echo "compile_pdf: $engine 第一遍编译失败（退出码 ${status}）；" >&2
  echo "compile_pdf: 不带输出重定向手动重跑以查看错误日志:" >&2
  echo "  cd \"$dir\" && $engine -interaction=nonstopmode -halt-on-error \"$base.tex\"" >&2
  exit 2
fi

"$engine" -interaction=nonstopmode -halt-on-error "$base.tex" >/dev/null 2>&1
status=$?
if [ $status -ne 0 ]; then
  echo "compile_pdf: $engine 第二遍编译失败（退出码 ${status}）。" >&2
  exit 2
fi

if [ ! -f "$base.pdf" ]; then
  echo "compile_pdf: $engine 运行结束但未产出 ${base}.pdf。" >&2
  exit 2
fi

echo "compile_pdf: 已生成 $dir/$base.pdf"
exit 0
```

</details>

#### 缺口

- 未取得同条件题集、模型开销及 TeX 部署数据
  **影响**：单位正确解成本与节时未知
  **进一步探讨**：记录每题模型调用与人工复核、PDF 成功率

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
