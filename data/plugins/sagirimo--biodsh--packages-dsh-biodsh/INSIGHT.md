# BioDSH

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[77f5b17](https://github.com/sagirimo/BioDSH/tree/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh)

<!-- BEGIN META -->
[![GitHub ★ 65](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=65&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sagirimo/BioDSH) [![npm 30d 1,434](https://img.shields.io/static/v1?label=npm+30d&message=1%2C434&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-biodsh) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-biodsh)
<!-- END META -->

> **功能**：为生信分析组合技能选择、步数收敛、公共输出合同与重放检查的 DSH 预设包

> **亮点**：[Q01](#research-q01) 和 [Q04](#research-q04) 把生信方法组织与公共合同、固定原始输入规则和干净重放连成可追溯修复循环，超过只有persona的包装；引用/规则仍由模型解释，不等于完整科学验证。

> **主要限制**：[Q04](#research-q04) 默认coverage关闭且部分列检查可accepted，重放一致不能排同算法错误；[Q03](#research-q03) 时间提示非总预算，[Q05](#research-q05) MAGI非隔离盲法且发布有非原子恢复窗口。应明确每次究竟核过哪些科学主张。

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
  - [Q01 · 生信用户得到的是人设，还是有可检查的交付流程？](#detail-section-11)
  - [Q02 · 技能如何发现与注入，依赖和额外成本是什么？](#detail-section-12)
  - [Q03 · 收敛护栏是否能保证时限、预算与安全执行？](#detail-section-13)
  - [Q04 · 交付门验证了什么，accepted有什么未覆盖？](#detail-section-14)
  - [Q05 · MAGI与作者效果能支持怎样采用、恢复和退出？](#detail-section-15)
  - [Q06 · 能提出什么最小可证伪交付改进？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：生信分析者希望从自然语言完成数据分析并保留规范化可查交付，见 [Q01](#research-q01)，实际采用仍需统计与合同审阅能力。

通用DSH编码agent、人工挑方法/Skill、脚本运行后人工核合同与重跑；基础工具、PTC、模型和子agent继承宿主，不把全流程算新算法。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 两种preset | 自然语言生信分析 | 继承DSH/PTC，非新执行引擎 |
| 技能库/selector | 提供方法指导 | 需打包资源和模型，数量/适配未实测 |
| guard | 保存、核验与停止下一步 | 时限只提示，非总费用预算 |
| delivery | 表结构、claims绑定、修复 | 需公开机器合同，开放任务不触发 |
| semantic/replay | 部分原始数据规则与清洁重跑 | 不证解释/算法正确，未核列仍可accepted |
| coverage/MAGI | 可选额外审阅 | 默认off/false、非OS隔离，费用和恢复另验 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 缺失或边界 |
|---|---|---|
| target DSH0.2.1-rc.2接口与pnpm | 安装/preset/hostImport | README≥0.2.1非跨新版验收 |
| 模型route/凭据与网络 | 分析/selector/coverage/child | 错误不总静默，资源额外 |
| official/library打包目录 | Skill实际可用 | build缺源warn跳过，checkout不含skills |
| Python3.11+与numpy/scipy/pandas | semantic/file_digest及replay | 不支持的生信依赖重放失败 |
| 新鲜公共任务目录与合同/inputs | delivery验收 | 完整性非OS隔离，敏感数据须另管 |

#### 启动步骤

| 步骤 | 用户/组件动作 | 验收/恢复 |
|---|---|---|
| 准备 | 专家去敏金标数据、合同与原始inputs | 固定target/模型/资源与技能包 |
| 配置 | 安装选BioDSH，MAGI off，明确coverage需求 | 核已打包Skill及Python依赖 |
| 分析 | Agent按规范产出submission/analysis.py | 不将steps或运行成功当科学通过 |
| 交付 | 校验receipt覆盖/未核列、replay及人工统计审阅 | 失败反馈修复，接受标签分层理解 |
| 恢复/退出 | 保存原数据、代码、receipt和MAGI备份后换preset | 查临时目录/子进程；发布中断手工恢复 |

**效果与成本**

#### 成本

| 阶段 | 现金与资源 | 人工时间/未知 |
|---|---|---|
| 首次 | 模型/DSH/Python与技能资源 | 环境安装、合同与方法审阅，工时费用未知 |
| 持续 | selector额外调用、分析计算、replay临时副本 | 解释规则、未核列与统计诊断 |
| 失败恢复 | 最多多轮修复、子分析/重跑、保留目录 | 对账原结果/新结果与进程，成本未知 |
| MAGI可选 | 作者称约倍增时间/费用，非本次实测 | 同账号盲法与arbiter额外审阅 |
| 退出 | 留存数据/日志/备份 | 停用不撤外发/脚本副作用 |

#### 效果

| 效果 | 当前支持 | 尚未知 |
|---|---|---|
| 方法组织 | persona/Skill注入与适应合同 | 实际技能数、选择质量与领域适用 |
| 结构一致 | 合同/claims/原数据规则 | 未核列和错误解释仍可能通过 |
| 可重复 | clean replay+容差比较 | 稳定错误算法与科学正确性 |
| 效率 | 作者PTC15开发题中位23→16步、129→97秒 | 原始配对/当前任务/全部费用未复现 |
| MAGI | 多阶段门控实现 | 作者少量救题不等普适增益，默认关闭 |

> **思考**：[Q04](#research-q04) 默认coverage关闭且部分列检查可accepted，重放一致不能排同算法错误；[Q03](#research-q03) 时间提示非总预算，[Q05](#research-q05) MAGI非隔离盲法且发布有非原子恢复窗口。应明确每次究竟核过哪些科学主张。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q04](#research-q04) 把生信方法组织与公共合同、固定原始输入规则和干净重放连成可追溯修复循环，超过只有persona的包装；引用/规则仍由模型解释，不等于完整科学验证。

hostImport共享宿主模块身份、turn快照/receipt修复链、固定原始源声明式检查与明确unverified字段是具体可借鉴工程。门覆盖范围与科学正确必须分离；guard只在步边界观察、MAGI目录盲法/rename-copy恢复和缺技能warn都需单独验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q04](#research-q04) 默认coverage关闭且部分列检查可accepted，重放一致不能排同算法错误；[Q03](#research-q03) 时间提示非总预算，[Q05](#research-q05) MAGI非隔离盲法且发布有非原子恢复窗口。应明确每次究竟核过哪些科学主张。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议观察，先由熟悉统计的用户在新鲜去敏金标合同上核打包资源、覆盖、重放及恢复。accepted含未核关键列、规则解释错误或MAGI发布中断时停止扩大，回专家脚本与独立审阅；不用作临床决策或唯一科学审稿。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

仅源码支持方法选择与合同/重放交付门；技能打包数量、科学正确、基准收益及真实宿主运行未验证，默认与实验模式分开。

- 已检查：作者 README、包清单、源码路径 packages/dsh-biodsh/README.md、packages/dsh-biodsh/scripts/build.mjs、packages/dsh-biodsh/lib/persona.js、packages/dsh-biodsh/lib/skills.js、packages/dsh-biodsh/lib/select.js、packages/dsh-biodsh/lib/task_policy.js、packages/dsh-biodsh/lib/guard.js、packages/dsh-biodsh/lib/settings.js、packages/dsh-biodsh/lib/semantic_plan.js、packages/dsh-biodsh/lib/delivery_check.py、packages/dsh-biodsh/lib/delivery.js、packages/dsh-biodsh/lib/semantic_check.py、packages/dsh-biodsh/lib/coverage_review.js、packages/dsh-biodsh/lib/magi.js、packages/dsh-biodsh/package.json 及固定范围 inventory；组件：packages/dsh-biodsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向读取build composition/技能复制、persona、技能扫描/搜索、selector、settings默认、guard、delivery及Python合同/semantic/replay、coverage和MAGI关键路径；未审所有2000+外部技能、完整生信数值算法、宿主OS权限或作者原始基准。Python不计本仓JS/TS统计不代表其不重要。
- 下一步：本轮未构建、安装、运行目标Python/JS、模型、科学基准或MAGI。README评价仅作者主张，源码机制不升级为真实科学验收或临床效果。

**分析版本**

- **仓库**：[sagirimo/BioDSH](https://github.com/sagirimo/BioDSH)
- **版本号**：1.0.0（[固定提交 77f5b17](https://github.com/sagirimo/BioDSH/tree/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 未验证的关键列覆盖、全尝试预算与带manifest原子发布契约，以错误分母未核、稳定错误重放和复制中断反例检验。

本轮未构建、安装、运行目标Python/JS、模型、科学基准或MAGI。README评价仅作者主张，源码机制不升级为真实科学验收或临床效果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 14 | 914 | 776 | 90 | — |
| .md | source | 2 | 109 | — | — | 2219 |
| .mjs | source | 2 | 254 | 217 | 28 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/sagirimo/BioDSH/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/sagirimo/BioDSH/issues?q=is%3Aissue+created%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/sagirimo/BioDSH/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查技能到科学交付门的实际保证及采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 生信用户得到的是人设，还是有可检查的交付流程？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

BioDSH面向医生/湿实验科学家描述生信任务，但实际交付是DSH bundle的两个preset：biodsh及PTC变体。生成脚本从目标DSH standard复制完整composition，加入persona/context、技能provider/选择器、delivery和guard；PTC只是继承宿主programmatic tool calling，不是BioDSH新执行引擎。相对通用编码agent+人工挑Skill，实质增量是把方法选择、原始数据/输出规范提示、收敛和保存后合同/replay检查连起来。遇到机器可读合同会缩成人设一句，开放问答才用完整生信persona，不能把实验改善一概归因长提示。README说17个验证流程和2000+库是作者包内容主张；本组件checkout没有skills目录，运行scanner缺目录返回空，build才从desktop资源复制，源缺失只warn跳过，故当前交付不能确认数量或科学验证，不以0伪造已确认能力数。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-biodsh/README.md:5-17](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/README.md#L5-L17)

作者功能描述及范围。

<details>
<summary>查看原文（13行）</summary>

```text
BioDSH for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness): a bundle that adds a **BioDSH agent preset** for bioinformatics work. Your other presets are not changed.

The BioDSH preset is the standard preset of your dsh release plus:

| Part | What it does |
|---|---|
| BioDSH persona | Answers for doctors and wet-lab scientists, in the user's language; keeps raw data untouched; reports what was actually computed. When the working folder contains a machine-readable output specification (`TABLE_CONTRACT.json`, `CLAIMS.json`, …), a one-line persona and a specification-first instruction replace it. |
| BioDSH skills | 17 validated BioDSH workflows in the session skill catalog: single-cell QC, clustering, annotation and treatment response; bulk RNA-seq limma-voom; survival (KM, Cox), regression with robust SEs and ANOVA designs, each checked against R; workflow building, and more. |
| Skill library | 2000+ community bioinformatics, clinical and data skills. Kept out of the catalog so it stays small and cacheable; the model searches it with the `skill_library` tool, and you can still run any of them with `/name`. |
| Skill selection | On each new message, a model reads the whole catalog (BioDSH skills and library) and injects the one or two skills that fit the request, in the same form as `/name`. |
| Convergence guard | In a long turn, asks the agent to save its code and finish the needed checks (900 s, or 60 steps), then to report honestly what is unfinished (1100 s, or 80 steps); ends a turn past 90 steps. It never asks the agent to guess. |
| Delivery gate | For tasks that come with a public output specification (table contract, claims), checks the saved outputs against it, checks declared columns against the original inputs, and replays the analysis script in a clean folder before the turn may end; on failure it returns the concrete errors for repair. |
| BioDSH-MAGI | **Experimental, off by default.** **Multi-Analyst Gated Inspection.** When an analysis with an output specification shows a risk signal (the delivery gate needed repairs, a source check failed, or the run was long), a second analyst redoes it from the original inputs in a separate folder without seeing the first result, and an arbiter compares both and delivers only after its own executable, cell-by-cell checks pass the delivery gate. Modes: `off` (default), `adaptive`, `always`. In our evaluation it rescued only a few tasks while roughly doubling time and cost. The first analyst's result is kept under `.biodsh-magi/`. |
```

</details>

**依据 2 · 源码核查**：[packages/dsh-biodsh/scripts/build.mjs:61-94](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/scripts/build.mjs#L61-L94)

继承standard、新增行与PTC变体。

<details>
<summary>查看原文（34行）</summary>

```text

// ---- read the shipped standard preset (keep !!js values) ----
const YAML = createRequire(path.join(runtime, 'package.json'))('yaml');
const src = path.join(runtime, 'node_modules', '@deepseek-ai', 'dsh-web-app', 'presets', 'standard.patch.yml');
const dshVersion = JSON.parse(readFileSync(path.join(runtime, 'node_modules', '@deepseek-ai', 'dsh', 'package.json'), 'utf8')).version;
const JS = Symbol('js');
const rows = YAML.parse(readFileSync(src, 'utf8'), { customTags: [{ tag: 'tag:yaml.org,2002:js', resolve: (s) => ({ [JS]: s }) }] });
const standard = rows[0].insert.find((r) => r.id === 'preset-standard');
if (!standard) throw new Error(`no preset-standard in ${src}`);
// shallow copies: structuredClone would drop the symbol that marks !!js values
const plugins = standard.config.plugins.map((p) => ({ ...p, ...(p.config && !Array.isArray(p.config) ? { config: { ...p.config } } : {}) }));
const at = (id) => { const i = plugins.findIndex((p) => p.id === id); if (i < 0) throw new Error(`standard preset has no ${id}`); return i; };
plugins[at('persona')].config = { ...(plugins[at('persona')].config || {}), prefix: PERSONA };
// The BioDSH persona row picks a one-line persona when the folder ships a written specification (lib/persona.js).
plugins[at('persona')].name = 'dsh-biodsh/persona';
plugins.splice(at('tool-skill') + 1, 0,
  { id: 'biodsh-skills', name: 'dsh-biodsh/skills' },
  { id: 'biodsh-skill-select', name: 'dsh-biodsh/select' },
  // Delivery gate + BioDSH-MAGI (lib/delivery.js, lib/magi.js), before the guard as in the v18 evaluated configuration.
  { id: 'biodsh-delivery', name: 'dsh-biodsh/delivery' },
  { id: 'biodsh-step-guard', name: 'dsh-biodsh/guard' });
plugins.splice(at('persona') + 1, 0, { id: 'biodsh-context', name: 'dsh-biodsh/context' });
const preset = { id: 'preset-biodsh', name: '@deepseek-ai/dsh-agent-preset', config: {
  id: 'biodsh', name: 'BioDSH', order: 0.5,
  description: 'Bioinformatics assistant: BioDSH skills in the catalog, a 2000+ skill library, automatic skill selection and a convergence guard.',
  plugins } };
// PTC variant, like the official `ptc` preset (standard + tool-presentation ptc): the model sees one run_code tool and
// writes a program that calls the other tools, so writing a script, running it and printing checks take one step.
const ptcPlugins = [...plugins];
ptcPlugins.splice(at('tool-web') + 1, 0, { id: 'tool-presentation', name: '@deepseek-ai/dsh-agent-tool-presentation', config: { mode: 'ptc' } });
const ptcPreset = { id: 'preset-biodsh-ptc', name: '@deepseek-ai/dsh-agent-preset', config: {
  id: 'biodsh-ptc', name: 'BioDSH (PTC)', order: 0.6,
  description: 'BioDSH with programmatic tool calling: tools are called from one program per step (fewer model calls).',
  plugins: ptcPlugins } };
```

</details>

**依据 3 · 源码核查**：[packages/dsh-biodsh/scripts/build.mjs:113-124](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/scripts/build.mjs#L113-L124)

技能复制缺源跳过。

<details>
<summary>查看原文（12行）</summary>

```text
// ---- skills ----
if (!process.argv.includes('--no-skills')) {
  const out = path.join(pkgDir, 'skills');
  rmSync(out, { recursive: true, force: true });
  for (const [from, to] of [[official, 'official'], [library, 'library']]) {
    if (!existsSync(from)) { console.warn(`skip ${to}: ${from} missing`); continue; }
    mkdirSync(path.join(out, to), { recursive: true });
    for (const d of readdirSync(from)) if (existsSync(path.join(from, d, 'SKILL.md'))) cpSync(path.join(from, d), path.join(out, to, d), { recursive: true });
    console.log(`skills/${to}: ${readdirSync(path.join(out, to)).length}`);
  }
}
console.log(`cordis.patch.yml built from dsh ${dshVersion} standard preset (${plugins.length} plugins)`);
```

</details>

**依据 4 · 源码核查**：[packages/dsh-biodsh/lib/persona.js:27-43](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/persona.js#L27-L43)

合同存在时简短persona。

<details>
<summary>查看原文（17行）</summary>

```text
export function hasSpecification(root, hasFile = existsSync) {
  return Boolean(root) && CONTRACT_FILES.some(n => hasFile(path.join(root, n)));
}

export function apply(ctx, config) {
  const prefix = (context) => (hasSpecification(workspaceRoot(ctx, context?.agent)) ? SPEC_PERSONA : config.prefix);
  ctx.effect(() => ctx.systemPrompt.section({
    name: PREFIX_SECTION,
    order: ctx.systemPrompt.getSectionOrder('DEPLOYMENT_PERSONA_PREFIX'),
    text: prefix,
  }), 'biodsh-persona.section()');
  ctx.effect(() => ctx.systemPrompt.section({
    name: SUFFIX_SECTION,
    order: ctx.systemPrompt.getSectionOrder('DEPLOYMENT_PERSONA_SUFFIX'),
    text: config.suffix ?? '',
  }), 'biodsh-persona.suffix()');
}
```

</details>

**依据 5 · 源码核查**：[packages/dsh-biodsh/lib/skills.js:35-48](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/skills.js#L35-L48)

不存在技能目录返回空。

<details>
<summary>查看原文（14行）</summary>

```text

function scan(dir, modelInvocable) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const file = path.join(dir, entry, 'SKILL.md');
    if (!existsSync(file) || !statSync(path.join(dir, entry)).isDirectory()) continue;
    try {
      const parsed = frontmatter(readFileSync(file, 'utf8'));
      const n = parsed?.fm.name;
      if (!n || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(n) || !parsed.fm.description) continue;
      out.push({ name: n, description: parsed.fm.description.trim(), whenToUse: parsed.fm.whenToUse || undefined,
        file, base: path.join(dir, entry), modelInvocable });
    } catch { /* unreadable skill: skip, like skill-filesystem */ }
```

</details>

#### 缺口

- 本轮没有安装、目标测试、模型/科学任务或作者原始基准复现。
  **影响**：不能证明技能数量、实际统计正确、平台兼容与净费用收益。
  **进一步探讨**：固定打包资源、依赖和金标小任务，先查覆盖/重放/故障状态，再开展受控领域验收。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 技能如何发现与注入，依赖和额外成本是什么？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

skills provider把official标modelInvocable、library隐藏于普通catalog但仍可/name与skill_library词法检索加载；词法基于名字/描述与中文双字片段，不是向量检索，也不保证方法适用。all第一次扫描缓存、library开关需重启，项目/用户同名rank优先可改变实际加载内容。select对新user文本单独调用模型，query只前3000字符，catalog摘要前160字符，选择至多3再只注入high且默认最多2；有合同或明确method+schema时adaptive跳过，避免额外方法冲突。60秒AbortController请求不保证所有供应商实际立即停；一般错误回普通流程，取消/402/429等向上抛，不能照注释说任何失败都静默降级。catalogCache键只由skill名字列表构成，同名描述/provider/tag变更可能继续旧system。需要可用模型route/凭据、宿主skills/tools/llm和真实技能资源；完整库虽不在主catalog，selector仍把全部摘要发给另一次模型请求，不等于零token。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-biodsh/lib/skills.js:51-91](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/skills.js#L51-L91)

词法搜索与provider两种invocation。

<details>
<summary>查看原文（41行）</summary>

```text
}

// ---- lexical search over the library (names weigh most; CJK text as character pairs) ----
function terms(q) {
  const s = String(q || '').toLowerCase();
  const out = new Set(s.match(/[a-z0-9][a-z0-9.+-]*/g) || []);
  const cjk = s.replace(/[^㐀-鿿]/g, '');
  for (let i = 0; i < cjk.length - 1; i++) out.add(cjk.slice(i, i + 2));
  return [...out].filter((t) => t.length > 1);
}
function score(skill, ts) {
  const nm = skill.name.toLowerCase(), hay = `${nm} ${skill.description.toLowerCase()} ${(skill.whenToUse || '').toLowerCase()}`;
  let sc = 0;
  for (const t of ts) { if (nm.includes(t)) sc += 3; else if (hay.includes(t)) sc += 1; }
  return sc;
}

export function apply(ctx) {
  const library = setting(ctx, 'library');
  let cache = null;
  const dir = (key, sub) => setting(ctx, key) || path.join(ROOT, sub);
  const all = () => (cache ??= [...scan(dir('officialSkillsDir', 'official'), true), ...(library ? scan(dir('librarySkillsDir', 'library'), false) : [])]);
  const candidate = (s) => ({
    name: s.name, description: s.description, ...(s.whenToUse ? { whenToUse: s.whenToUse } : {}),
    invocation: { modelInvocable: s.modelInvocable, userInvocable: true }, source: 'bundled', provider: 'biodsh',
    path: s.file, resourceBase: { kind: 'directory', path: s.base }, rank: RANK, locator: s,
  });
  // registerProvider takes a factory: (control: { signal, invalidate }) => provider
  ctx.skills.registerProvider(() => ({
    name: 'biodsh',
    list: async () => all().map(candidate),
    get: async (c) => {
      const s = c.locator;
      const parsed = frontmatter(readFileSync(s.file, 'utf8'));
      return { ...candidate(s), content: parsed ? parsed.body : '' };
    },
  }));
  if (!library) return;

  const tool = defineTool({
    name: 'skill_library',
```

</details>

**依据 2 · 源码核查**：[packages/dsh-biodsh/lib/skills.js:94-122](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/skills.js#L94-L122)

tool检索/加载。

<details>
<summary>查看原文（29行）</summary>

```text
    parameters: {
      query: { type: 'string', description: 'Keywords describing the method, tool or data type, e.g. "cox proportional hazards time-varying".' },
      load: { type: 'string', description: 'Exact skill name from a previous search result to load its full instructions.' },
    },
    output: { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: value }] },
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      if (args.load) {
        const lookup = { signal: exec.signal, scope: exec.agent };
        const skill = await ctx.skills.get(String(args.load), lookup);
        if (!skill) throw new Error(`skill "${args.load}" is unknown`);
        const b = skill.resourceBase;
        return [`<skill_content name="${skill.name}">`, '<skill_resources>',
          b?.kind === 'directory' ? `Base directory for this skill: ${b.path}\nResolve relative paths mentioned by this skill against the base directory before using them. Load referenced resources only as needed.` : '',
          '</skill_resources>', '', '<skill_instructions>', skill.content, '</skill_instructions>', '</skill_content>'].join('\n');
      }
      const ts = terms(args.query);
      if (!ts.length) throw new Error('give a query (keywords) or load (a skill name)');
      const hits = all().map((s) => [score(s, ts), s]).filter(([sc]) => sc > 0)
        .sort((a, b) => b[0] - a[0] || (a[1].name < b[1].name ? -1 : 1)).slice(0, setting(ctx, 'librarySearchLimit'));
      if (!hits.length) return `No library skill matches "${args.query}". Proceed without one.`;
      return hits.map(([, s]) => `- ${s.name}: ${s.description.replace(/\s+/g, ' ').slice(0, 220)}`).join('\n')
        + '\n\nLoad one with skill_library {"load": "<name>"} only if it clearly fits the task.';
    },
    presentCall(args) {
      return { card: 'generic', title: args.load ? `Load library skill ${args.load}` : `Search skill library: ${args.query ?? ''}`, kind: 'read', rawInput: args.load ?? args.query ?? '' };
    },
  });
  ctx.tools.register(tool);
```

</details>

**依据 3 · 源码核查**：[packages/dsh-biodsh/lib/select.js:68-110](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/select.js#L68-L110)

摘要与名字键缓存、独立请求/截断。

<details>
<summary>查看原文（43行）</summary>

```text
  async function catalog(agent, signal) {
    const snap = await ctx.skills.snapshot({ scope: agent, signal });
    // Official BioDSH skills (validated, in the session catalog) are tagged so the selector can prefer them.
    const list = (snap?.skills || [])
      .map((s) => [s.name, (s.provider === 'biodsh' && s.invocation?.modelInvocable ? '[BioDSH] ' : '')
        + String(s.description || '').replace(/\s+/g, ' ').trim().slice(0, DESCRIPTION_CHARS)])
      .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
    const key = list.map((x) => x[0]).join(',');
    if (catalogCache?.key !== key) {
      catalogCache = { key, known: new Set(list.map((x) => x[0])), system: SYSTEM_HEAD + list.map(([n, d]) => `- ${n}: ${d}`).join('\n') + SYSTEM_TAIL };
    }
    return catalogCache;
  }

  async function select(agent, query, outer) {
    const r = route(agent);
    if (!r) throw new Error('no model route for the selector');
    const ac = new AbortController();
    const to = setTimeout(() => ac.abort(new Error('selector timeout')), TIMEOUT_MS);
    const onAbort = () => ac.abort(outer.reason);
    outer?.addEventListener?.('abort', onAbort, { once: true });
    let usage=null, failure=null;
    try {
      const { system, known } = await catalog(agent, ac.signal);
      let text = '';
      for await (const chunk of ctx.llm.stream({ ...r, system, maxTokens: 6000, signal: ac.signal,
        messages: [{ role: 'user', content: [{ type: 'text', text: 'USER REQUEST:\n' + query.slice(0, 3000) }] }] })) {
        if (chunk.type === 'usage') usage=chunk.usage;
        if (chunk.type === 'text-delta') text += chunk.text;
        else if (chunk.type === 'finish' && (chunk.reason?.kind === 'error' || chunk.reason?.kind === 'aborted')) {
          throw new Error(`${chunk.reason.failure?.code || chunk.reason.kind}: ${chunk.reason.failure?.message || ''}`);
        }
      }
      dbg(`route ${r.provider}/${r.model}`);
      return parseSelection(text, known);
    } catch (e) { failure=String(e?.message || e); throw e; }
    finally {
      clearTimeout(to); outer?.removeEventListener?.('abort', onAbort);
      // Benchmark accounting only (env set by the evaluation runner); never writes into a user's folder otherwise.
      const root=process.env.BIODSH_USAGE_FILE ? workspaceRoot(ctx,agent) : null;
      if (root) {
        const file=path.join(root,'.biodsh-selector-usage.json');
        const previous=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{requests:[]};
```

</details>

**依据 4 · 源码核查**：[packages/dsh-biodsh/lib/select.js:118-153](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/select.js#L118-L153)

adaptive、错误与high注入。

<details>
<summary>查看原文（36行）</summary>

```text
    let picked = null;
    try {
      const query = payload?.agent ? humanText(payload.messages) : '';
      if (query) {
        const policy=selectorPolicy({enabled:get('selectEnabled'),adaptive:get('selectAdaptive'),root:workspaceRoot(ctx,payload.agent),query});
        dbg('policy '+policy.reason);
        if (!policy.enabled) return next();
        const t0 = Date.now();
        picked = await select(payload.agent, query, payload.signal);
        dbg(`picked ${JSON.stringify(picked)} in ${Date.now() - t0}ms`);
      }
    } catch (e) {
      if (payload?.signal?.aborted || /\b(?:402|429)\b|insufficient.balance|rate.limit/i.test(String(e?.message || e))) throw e;
      dbg('fallback: ' + (e?.message || e));
    }
    const decision = await next();
    if (!picked?.length || !decision || decision.kind !== 'enter') return decision;
    try {
      // Skip skills already in this step (an explicit /name of the same skill, or a repeat).
      const present = new Set((decision.messages || []).filter((m) => m.source?.kind === 'skill-invocation').map((m) => m.source.name));
      const injections = [];
      for (const s of picked.filter((x) => x.fit === 'high' && !present.has(x.name)).slice(0, get('selectMaxInject'))) {
        const def = await ctx.skills.get(s.name, { scope: payload.agent, signal: payload.signal });
        if (!def) continue;
        injections.push({ id: globalThis.crypto.randomUUID(), role: 'user', content: [{ type: 'text', text: renderSkillContent(def) }],
          source: { kind: 'skill-invocation', name: def.name, form: 'instructions' } });
      }
      dbg(`injected ${injections.map((m) => m.source.name).join(', ') || 'none'}`);
      return injections.length ? { ...decision, messages: [...decision.messages, ...injections] } : decision;
    } catch (e) {
      if (payload?.signal?.aborted) throw e;
      dbg('inject failed: ' + (e?.message || e));
      return decision;
    }
  });
}
```

</details>

**依据 5 · 源码核查**：[packages/dsh-biodsh/lib/task_policy.js:9-18](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/task_policy.js#L9-L18)

合同或方法/schema条件禁selector。

<details>
<summary>查看原文（10行）</summary>

```text
export function selectorPolicy({ enabled = true, adaptive = true, root, query = '', hasFile = existsSync }) {
  if (!enabled) return { enabled: false, reason: 'disabled-by-setting' };
  if (!adaptive) return { enabled: true, reason: 'adaptive-disabled' };
  if (root && CONTRACT_FILES.some(n => hasFile(path.join(root, n)))) return { enabled: false, reason: 'public-output-contract' };
  // Text-only requests must explicitly supply both a method and an output schema.
  // A mere mention of CSV, ANSWER or a desired number is insufficient.
  const method = /(?:use exactly|method\s*:|prescribed method|严格使用|指定方法\s*[:：])/i.test(query);
  const schema = /(?:required columns\s*:|primary key\s*:|output schema\s*:|列名\s*[:：]|主键\s*[:：])/i.test(query);
  return { enabled: !(method && schema), reason: method && schema ? 'explicit-method-and-schema' : 'open-request' };
}
```

</details>

#### 缺口

- 本轮没有安装、目标测试、模型/科学任务或作者原始基准复现。
  **影响**：不能证明技能数量、实际统计正确、平台兼容与净费用收益。
  **进一步探讨**：固定打包资源、依赖和金标小任务，先查覆盖/重放/故障状态，再开展受控领域验收。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 收敛护栏是否能保证时限、预算与安全执行？

**研究主题**：缺陷与关键质疑、工程质量与复用、效果与总成本

#### 完整回答

guard在agent/pre-step读步数，step>guardMaxSteps默认90才reject下一步；soft/hard默认60/80步或900/1100秒只注入保存和如实收尾提醒。时间从首次进入step记起，在下次pre-step才观察，不能中断当前长模型/工具调用，也非总token/现金/CPU硬预算。PTC一步可做多个工具，降低step不自动等于同等工作量更便宜。子agent同样受自身角色阈值，arbiter更紧；MAGI额外分析和delivery replay在主guard之外有各自成本。persona“不要改原始数据/越界”是指导，preset仍继承bash/fs等权限，source manifest是完整性比对，不是OS读写/网络沙箱；replay -I与import白名单/资源限制也不构成恶意Python安全隔离，stdlib仍有进程/文件/网络能力。不能用“收敛”承诺无副作用或科学正确。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-biodsh/lib/guard.js:7-48](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/guard.js#L7-L48)

角色阈值、下一步拒绝及时间提示。

<details>
<summary>查看原文（42行）</summary>

```text
const ARBITER = { guardSoftSteps: 45, guardSoftSeconds: 800, guardHardSteps: 60, guardHardSeconds: 1000, guardMaxSteps: 70 };

export const name = 'biodsh-step-guard';

const SOURCE = 'biodsh-step-guard';
const SOFT = (step, sec) => `本轮已用 ${step} 步、约 ${sec} 秒。优先保存完整代码，集中处理必要核验和已发现的问题，跑完核验再收尾。`
  + '遵循公开方法和输出规范；不能用近似值满足精确合同。开放问答按要求输出末行 ANSWER，数值科学计数使用 ASCII e，保留题面要求的比例或百分比。';
const HARD = (step, sec) => `本轮已用 ${step} 步、约 ${sec} 秒，剩余预算有限。先保存代码和已有结果，优先完成关键核验。`
  + '无法在预算内完成时如实报告未完成的部分与失败检查；不要猜数、跳过合同或宣称尚未完成的验证通过。';

export function apply(ctx) {
  const base = (k) => setting(ctx, k);
  const get = base;
  const roles = new WeakMap();
  const dbg = (s) => { if (get('debug') || process.env.BIODSH_GUARD_DEBUG) { try { process.stderr.write(`[biodsh-guard] ${s}\n`); } catch {} } };
  const state = new WeakMap(); // agent -> { turn, t0, soft, hard }
  const notice = (text, summary) => ({ id: globalThis.crypto.randomUUID(), role: 'user', content: [{ type: 'text', text }],
    source: { kind: SOURCE, form: 'notice', summary } });

  ctx.on('agent/pre-step', async (payload, next) => {
    if (payload?.agent && !roles.has(payload.agent)) roles.set(payload.agent, roleOf(workspaceRoot(ctx, payload.agent) || '.'));
    const role = payload?.agent ? roles.get(payload.agent) : null;
    const get = (k) => (role === 'arbiter' && k in ARBITER) ? ARBITER[k] : base(k);
    if (!get('guardEnabled')) return next();
    const step = Number(payload?.step) || 0;
    const max = get('guardMaxSteps');
    if (max > 0 && step > max) {
      dbg(`turn ${payload.turn}: step ${step} > ${max}, rejecting`);
      return { kind: 'reject' };
    }
    const decision = await next();
    try {
      if (!decision || decision.kind !== 'enter' || !payload?.agent) return decision;
      let st = state.get(payload.agent);
      if (!st || st.turn !== payload.turn) { st = { turn: payload.turn, t0: Date.now(), soft: false, hard: false }; state.set(payload.agent, st); }
      const sec = Math.round((Date.now() - st.t0) / 1000);
      let m = null;
      if (!st.hard && (step >= get('guardHardSteps') || sec >= get('guardHardSeconds'))) { st.hard = st.soft = true; m = notice(HARD(step, sec), `final answer now (${step} steps, ${sec}s)`); }
      else if (!st.soft && (step >= get('guardSoftSteps') || sec >= get('guardSoftSeconds'))) { st.soft = true; m = notice(SOFT(step, sec), `wrap up (${step} steps, ${sec}s)`); }
      if (!m) return decision;
      dbg(`turn ${payload.turn} step ${step} ${sec}s -> ${st.hard ? 'hard' : 'soft'}`);
      return { ...decision, messages: [...(decision.messages || []), m] };
```

</details>

**依据 2 · 源码核查**：[packages/dsh-biodsh/lib/settings.js:15-22](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/settings.js#L15-L22)

默认步时/开关。

```text
export const DEFAULTS = {
  coverageReviewEnabled: false,
  semanticEnabled: true,
  selectEnabled: true, selectAdaptive: true,
  deliveryEnabled: true, reconcileChecks: false, magiMode: 'off', magiSteps: 60, magiSeconds: 900, deliveryMaxRepairs: 3, deliveryReplaySeconds: 120, deliveryPython: '', deliveryPythonArgs: [], selectProvider: '', selectModel: '', selectMaxInject: 2,
  guardEnabled: true, guardSoftSteps: 60, guardSoftSeconds: 900, guardHardSteps: 80, guardHardSeconds: 1100, guardMaxSteps: 90,  // v18 (evaluated) thresholds
  library: true, librarySearchLimit: 8, officialSkillsDir: '', librarySkillsDir: '', appContext: '', debug: false,
};
```

**依据 3 · 源码核查**：[packages/dsh-biodsh/lib/semantic_plan.js:19-33](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/semantic_plan.js#L19-L33)

public快照明确非OS sandbox。

<details>
<summary>查看原文（15行）</summary>

```text
// The caller must supply a fresh public-only workspace. This is integrity checking,
// not an OS read sandbox and not a private-answer leakage detector.
export function snapshotPublicSources(root) {
  const state={public_files:{},plan:null,plan_history:[],applicable:false,error:null};
  function visit(dir) {
    for(const ent of fs.readdirSync(dir,{withFileTypes:true})) {
      if(ent.name.startsWith('.biodsh') || ['submission','.git','node_modules'].includes(ent.name))continue;
      const file=path.join(dir,ent.name), rel=path.relative(root,file).split(path.sep).join('/');
      if(ent.isSymbolicLink())throw new Error('public source symlink unsupported: '+rel);
      if(ent.isDirectory())visit(file);
      else if(ent.isFile()) {state.public_files[rel]=digest(file);if(/\.(csv|tsv)$/i.test(rel))state.applicable=true;}
    }
  }
  try {visit(root);}catch(e){state.error=String(e);state.applicable=true;}
  return state;
```

</details>

**依据 4 · 源码核查**：[packages/dsh-biodsh/lib/delivery_check.py:209-250](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/delivery_check.py#L209-L250)

replay导入约束、env及POSIX资源/timeout。

<details>
<summary>查看原文（42行）</summary>

```text
        source=safe_path(submission,'analysis.py')
        if not source.is_file():raise ValueError('analysis.py missing')
        shutil.copy2(source,root/'submitted.py')
        source_inputs=Path(public)/'inputs'
        if any(p.is_symlink() for p in source_inputs.rglob('*')):raise ValueError('input symlink unsupported')
        shutil.copytree(source_inputs,inp)
        bootstrap=root/'replay_bootstrap.py'
        bootstrap.write_text('''import sys, runpy, importlib.abc
class AllowedImports(importlib.abc.MetaPathFinder):
 def find_spec(self, fullname, path=None, target=None):
  top=fullname.split('.')[0]
  if not top.startswith('_sysconfigdata_') and top not in sys.stdlib_module_names and top not in {'numpy','scipy','pandas','dateutil','pytz','tzdata','six'}:
   raise ImportError('Replay dependency outside numpy/scipy/pandas: '+top)
sys.meta_path.insert(0,AllowedImports())
script=sys.argv.pop(1)
runpy.run_path(script,run_name='__main__')
''')
        env={k:v for k,v in os.environ.items() if k in ('PATH','SYSTEMROOT','WINDIR','LANG','LC_ALL')}
        env.update(OPENBLAS_NUM_THREADS='1',OMP_NUM_THREADS='1',MKL_NUM_THREADS='1',NUMEXPR_NUM_THREADS='1',PYTHONDONTWRITEBYTECODE='1',HOME=str(root))
        def limits():
            import resource
            resource.setrlimit(resource.RLIMIT_CPU,(max(1,int(seconds)),max(2,int(seconds)+1)))
            resource.setrlimit(resource.RLIMIT_AS,(1024**3,1024**3))
            resource.setrlimit(resource.RLIMIT_FSIZE,(8*1024**2,8*1024**2))
        cmd=[sys.executable,'-I','-B',str(bootstrap),str(root/'submitted.py'),'--inputs',str(inp),'--out',str(out)]
        with (root/'stdout.log').open('wb') as so,(root/'stderr.log').open('wb') as se:
            p=subprocess.Popen(cmd,cwd=cwd,env=env,stdout=so,stderr=se,start_new_session=(os.name=='posix'),preexec_fn=limits if os.name=='posix' else None)
            try:p.wait(timeout=seconds)
            except subprocess.TimeoutExpired:
                if os.name=='posix':os.killpg(p.pid,signal.SIGKILL)
                else:p.kill()
                p.wait();raise ValueError('replay wall-clock timeout')
        result['returncode']=p.returncode
        if p.returncode:raise ValueError('replay exit '+str(p.returncode)+': '+(root/'stderr.log').read_text(errors='replace')[-2000:])
        structure=validate(public,out,docs);result['validation']=structure
        comparison=compare_deliveries(public,submission,out,docs,use_contract_tolerance=True);result['comparison']=comparison
        if not (out/'analysis.py').is_file():structure['errors'].append('replay did not deliver analysis.py');structure['ok']=False
        result['ok']=structure['ok'] and comparison['agree']
    except (OSError,ValueError) as e:result['error']=str(e)
    result['seconds']=round(time.monotonic()-start,3)
    return result

```

</details>

#### 缺口

- 本轮没有安装、目标测试、模型/科学任务或作者原始基准复现。
  **影响**：不能证明技能数量、实际统计正确、平台兼容与净费用收益。
  **进一步探讨**：固定打包资源、依赖和金标小任务，先查覆盖/重放/故障状态，再开展受控领域验收。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 交付门验证了什么，accepted有什么未覆盖？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

delivery在每turn开始快照四类合同；没有合同不运行门，普通child跳过，只有MAGI角色child纳入。turn-stopping验证合同未变、submission表头/键/类型/声明claims绑定，失败注入具体反馈最多默认3修复后抛拒绝，并保存receipt。原始CSV/TSV存在时semantic要求模型写声明式preserve/predicate/aggregate规则，原始文件hash+原文quote可核、固定数字容差，不执行任意eval，这是比纯模型自称验证更可查的增量。但模型仍自己解释规则与引用，quote存在不证明语义正确；只需有正checked_cells且无错误即可ok，unverified_columns可非空。coverageReview默认false，即accepted可能仅覆盖一列，不能称所有科学结果已核。即便开启coverage，也是模型审code+抽样packet，程序只验证列覆盖声明及引用真实存在，返回scientific_correctness_verified:false。clean replay把analysis.py复制改名，给新inputs/out，限制库为numpy/scipy/pandas等并比对结构/值；复现一致可排一些隐藏状态，无法发现同一错误算法。非支持科学依赖会失败是范围取舍；未声明missing规则等仅warning，也不能补全未知含义。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-biodsh/lib/delivery.js:42-85](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/delivery.js#L42-L85)

合同快照、child范围和检查触发。

<details>
<summary>查看原文（44行）</summary>

```text
// Exported controller lets offline tests exercise the real turn-stopping callback without an LLM.
export function registerDelivery(ctx, get, check=checkDelivery) {
  const states=new WeakMap();
  // BioDSH-MAGI needs the user's request of the turn: the latest user-authored message (source kind 'user' or none).
  const prompts=new Map();
  ctx.on?.('session/event',(session,event)=>{
    if(event?.type!=='user/message' || (event.data?.source && event.data.source.kind!=='user'))return;
    const text=(event.data?.content||[]).filter(c=>c.type==='text').map(c=>c.text).join('\n');
    if(text)prompts.set(session?.id??session?.header?.id,text);
  });
  ctx.on('agent/pre-step',async(payload,next)=>{
    const roots=ctx.get?.('agents')?.roots?.();
    // Child agents are skipped, except BioDSH-MAGI's Replicator and Arbiter (marked by a role file in their workspace).
    if (roots && !roots.includes(payload?.agent) && !roleOf(workspaceRoot(ctx,payload?.agent) || '.')) return next();
    if (get('deliveryEnabled') && payload?.agent) {
      const previous=states.get(payload.agent);
      if (!previous || previous.turn!==payload.turn) {
        const root=workspaceRoot(ctx,payload.agent);
        if (root) {
          let docs={},error=null;try{docs=snapshotContracts(root);}catch(e){error=String(e);}
          const semantic=get('semanticEnabled') && Object.keys(docs).length ? snapshotPublicSources(root) : null;
          states.set(payload.agent,{turn:payload.turn,root,docs,error,semantic,repairs:0,steps:0,t0:Date.now(),role:roleOf(root)});
          if(semantic?.applicable || (semantic && get('coverageReviewEnabled')))payload.agent.inject({id:randomUUID(),role:'user',content:[{type:'text',text:SEMANTIC_INSTRUCTIONS}],source:{kind:'biodsh-semantic-plan',form:'notice',summary:'declare public source consistency checks'}});
        }
      }
      const st=states.get(payload.agent);
      if(st?.semantic?.applicable)observePlan(st.root,st.semantic,'pre-step:'+st.steps++);
    }
    return next();
  });
  ctx.on('agent/turn-stopping',async({agent,turn,signal})=>{
    if (!get('deliveryEnabled')) return;
    const st=states.get(agent);
    if (!st || st.turn!==turn || (!st.error && !Object.keys(st.docs).length))return;
    let result;
    try {
      if(st.error)throw new Error(st.error);
      if(st.semantic?.error)throw new Error(st.semantic.error);
      if(st.semantic?.applicable)observePlan(st.root,st.semantic,'turn-stopping');
      result=await check(st.root,st.docs,{python:get('deliveryPython') || process.env.BIODSH_PYTHON || 'python3',
        args:get('deliveryPythonArgs') || [],seconds:get('deliveryReplaySeconds'),reconcileChecks:get('reconcileChecks') || st.role==='arbiter',semantic:st.semantic?.applicable ? st.semantic : null},signal);
      if(result.ok && st.semantic && get('coverageReviewEnabled')){
        result.coverage_review=await reviewCoverage(ctx,agent,st.root,st.docs,st.semantic,result,{python:get('deliveryPython')||process.env.BIODSH_PYTHON||'python3',args:get('deliveryPythonArgs')||[]},signal);
        if(!result.coverage_review.ok){result.ok=false;result.errors.push('Independent public-contract coverage review requires repair: '+JSON.stringify({issues:result.coverage_review.issues,uncertain_columns:result.coverage_review.uncertain_columns,error:result.coverage_review.error}));}
```

</details>

**依据 2 · 源码核查**：[packages/dsh-biodsh/lib/delivery.js:86-117](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/delivery.js#L86-L117)

receipt、修复/拒绝与MAGI路径。

<details>
<summary>查看原文（32行）</summary>

```text
      }
    } catch(e) {
      if(signal?.aborted)throw e;
      result={ok:false,errors:[String(e)],infrastructureError:true};
    }
    const reviewError=Boolean(result.coverage_review?.error);
    if(reviewError)result.infrastructureError=true;
    const exhausted=!result.ok && (reviewError || st.repairs>=get('deliveryMaxRepairs'));
    const receipt={...result,turn,recorded_at:new Date().toISOString(),repairs:st.repairs,semantic_applicable:st.semantic?.applicable ?? false,semantic_source_manifest:st.semantic?.public_files ?? {},semantic_plan_history:st.semantic?.plan_history ?? [],status:result.ok?'accepted':exhausted?'rejected':'repair-required'};
    fs.appendFileSync(path.join(st.root,'.biodsh-delivery-events.jsonl'),JSON.stringify(receipt)+'\n');
    fs.writeFileSync(path.join(st.root,'.biodsh-delivery.json'),JSON.stringify(receipt,null,2));
    // BioDSH-MAGI: once the Analyst's delivery is final (accepted or rejected), review it if its own records show risk.
    const mode=get('magiMode');
    if(mode && mode!=='off' && !st.role && (result.ok || exhausted)) {
      const reasons=mode==='always' ? ['always'] : triggerReasons(st.root,receipt,{steps:st.steps,seconds:(Date.now()-st.t0)/1000,stepLimit:get('magiSteps'),secondLimit:get('magiSeconds')});
      const prompt=prompts.get(agent?.session?.header?.id);
      if(reasons.length && prompt) {
        const report=await runMagi(ctx,agent,{root:st.root,prompt,reasons,python:get('deliveryPython') || process.env.BIODSH_PYTHON || 'python3',pythonArgs:get('deliveryPythonArgs') || [],signal});
        if(report.status==='arbiter_delivery_adopted')return;
      }
    }
    if(result.ok)return;
    if(exhausted)throw new Error('BIODSH_DELIVERY_REJECTED: public contract/replay check failed; repair limit reached');
    st.repairs++;
    const feedback=result.coverage_review ? {...result,coverage_review:{ok:result.coverage_review.ok,issues:result.coverage_review.issues,uncertain_columns:result.coverage_review.uncertain_columns,error:result.coverage_review.error,required_columns:result.coverage_review.required_columns,reviewed_columns:result.coverage_review.reviewed_columns}} : result;
    // A deterministic tool-result notice. Do not fabricate a tool-call ID absent from the transcript.
    agent.inject({id:randomUUID(),role:'user',content:[{type:'text',text:
      'Delivery validator result: '+JSON.stringify(feedback)+'\nDelivery is blocked. Fix these public-contract/source-consistency/replay errors, save the code and rerun before finishing. Do not alter the contracts or source inputs. Repair round '+st.repairs+'/'+get('deliveryMaxRepairs')+'.'}],
      source:{kind:'biodsh-delivery',form:'notice',summary:'deterministic delivery validation failed'}});
  });
}
export function apply(ctx) { registerDelivery(ctx,k=>setting(ctx,k)); }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-biodsh/lib/delivery_check.py:74-104](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/delivery_check.py#L74-L104)

合同结构/键集与warning。

<details>
<summary>查看原文（31行）</summary>

```text
    return float(found[0][binding['column']])

def validate(public,submission,docs=None):
    docs=contracts(public) if docs is None else docs
    result={'triggered':bool(docs),'ok':True,'errors':[],'warnings':[],'tables':{}}
    if not docs:return result
    errors=result['errors'];warn=result['warnings'];loaded={}
    try:specs,defs=table_specs(docs)
    except (KeyError,ValueError,TypeError) as e:
        result.update(ok=False,errors=['invalid public contract: '+str(e)]);return result
    if not specs:warn.append('No machine-readable table schema; only declared JSON checks apply.')
    for name,spec in specs.items():
        try:
            header,rows,issues=load_table(safe_path(submission,name),spec)
            loaded[name]=(spec,rows)
            errors.extend(name+': '+i for i in issues[:10])
            entry={'rows':len(rows),'key_set_checked':False};result['tables'][name]=entry
            for r in [spec.get('row_set',{}),spec.get('external_row_set',{})]:
                if not r:continue
                try:expected=expected_keys(dict(spec,row_set=r),defs)
                except (KeyError,ValueError,TypeError,RecursionError) as e:
                    errors.append(name+': cannot expand declared row set: '+str(e));continue
                if expected is not None:
                    entry['key_set_checked']=True;actual=set(rows)
                    if actual!=expected:
                        errors.append(name+': key_set mismatch '+json.dumps({'missing_count':len(expected-actual),'extra_count':len(actual-expected),'missing':sorted(expected-actual)[:5],'extra':sorted(actual-expected)[:5]},ensure_ascii=False))
                if type(r.get('row_count')) is int and r['row_count']!=len(rows):errors.append(name+': row_count mismatch')
                elif 'row_count' in r and type(r['row_count']) is not int:warn.append(name+': prose row-count rule not executable')
            if not entry['key_set_checked']:warn.append(name+': no public exact key set; uniqueness only')
            cell_errors=[];unspecified_missing=set()
            for key,row in rows.items():
```

</details>

**依据 4 · 源码核查**：[packages/dsh-biodsh/lib/delivery_check.py:139-170](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/delivery_check.py#L139-L170)

claims类型/绑定/规则验证。

<details>
<summary>查看原文（32行）</summary>

```text
    for name,spec in naming.get('delivery',{}).items():
        if not name.endswith('.json') or not isinstance(spec,dict):continue
        try:check_json_schema(read_json(safe_path(submission,name)),spec,name,errors)
        except (OSError,ValueError):errors.append(name+': missing or invalid JSON')
    if 'CLAIMS.json' in docs:
        try:
            c=read_json(safe_path(submission,'interpretation_claims.json'))
            if not isinstance(c,dict) or set(c)!={'schema_version','claims','narrative'}:raise ValueError('expected schema_version, claims, narrative object')
            if type(c['schema_version']) is not int or c['schema_version']!=2:raise ValueError('schema_version must be integer 2')
            if not isinstance(c['narrative'],str) or not c['narrative'].strip():raise ValueError('narrative must be nonempty')
            declarations=docs['CLAIMS.json']['claims']
            if not isinstance(c['claims'],dict) or set(c['claims'])!={s['id'] for s in declarations}:raise ValueError('claims exact key set mismatch')
            for s in declarations:
                name=s['id'];v=c['claims'][name];typ=s['type']
                if typ=='number':
                    if type(v) not in (int,float) or not math.isfinite(v):errors.append('claim '+name+': expected finite number');continue
                    if 'binding' in s:
                        try:
                            n=binding_value(s['binding'],loaded)
                            if not math.isclose(v,n,rel_tol=s.get('rel_tol',0),abs_tol=s.get('abs_tol',0)):errors.append('claim '+name+': table binding mismatch')
                        except (ValueError,KeyError,TypeError):errors.append('claim '+name+': invalid table binding')
                elif typ in ('derived','choice'):
                    if not isinstance(v,str) or v not in s.get('options',[]):errors.append('claim '+name+': not a declared option')
                    if typ=='derived' and 'rule' in s:
                        rule=s['rule'];ops={'lt':operator.lt,'le':operator.le,'gt':operator.gt,'ge':operator.ge,'eq':operator.eq,'ne':operator.ne}
                        try:
                            flag=ops[rule['op']](binding_value(rule['binding'],loaded),rule['threshold'])
                            if v!=rule['outcomes'][str(flag).lower()]:errors.append('claim '+name+': public derived rule mismatch')
                        except (ValueError,KeyError,TypeError):errors.append('claim '+name+': unsupported or invalid public rule')
                else:errors.append('claim '+name+': unsupported type')
        except (OSError,ValueError,KeyError,TypeError) as e:errors.append('interpretation_claims.json: '+str(e))
    result['ok']=not errors
```

</details>

**依据 5 · 源码核查**：[packages/dsh-biodsh/lib/delivery_check.py:209-250](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/delivery_check.py#L209-L250)

clean replay和对比。

<details>
<summary>查看原文（42行）</summary>

```text
        source=safe_path(submission,'analysis.py')
        if not source.is_file():raise ValueError('analysis.py missing')
        shutil.copy2(source,root/'submitted.py')
        source_inputs=Path(public)/'inputs'
        if any(p.is_symlink() for p in source_inputs.rglob('*')):raise ValueError('input symlink unsupported')
        shutil.copytree(source_inputs,inp)
        bootstrap=root/'replay_bootstrap.py'
        bootstrap.write_text('''import sys, runpy, importlib.abc
class AllowedImports(importlib.abc.MetaPathFinder):
 def find_spec(self, fullname, path=None, target=None):
  top=fullname.split('.')[0]
  if not top.startswith('_sysconfigdata_') and top not in sys.stdlib_module_names and top not in {'numpy','scipy','pandas','dateutil','pytz','tzdata','six'}:
   raise ImportError('Replay dependency outside numpy/scipy/pandas: '+top)
sys.meta_path.insert(0,AllowedImports())
script=sys.argv.pop(1)
runpy.run_path(script,run_name='__main__')
''')
        env={k:v for k,v in os.environ.items() if k in ('PATH','SYSTEMROOT','WINDIR','LANG','LC_ALL')}
        env.update(OPENBLAS_NUM_THREADS='1',OMP_NUM_THREADS='1',MKL_NUM_THREADS='1',NUMEXPR_NUM_THREADS='1',PYTHONDONTWRITEBYTECODE='1',HOME=str(root))
        def limits():
            import resource
            resource.setrlimit(resource.RLIMIT_CPU,(max(1,int(seconds)),max(2,int(seconds)+1)))
            resource.setrlimit(resource.RLIMIT_AS,(1024**3,1024**3))
            resource.setrlimit(resource.RLIMIT_FSIZE,(8*1024**2,8*1024**2))
        cmd=[sys.executable,'-I','-B',str(bootstrap),str(root/'submitted.py'),'--inputs',str(inp),'--out',str(out)]
        with (root/'stdout.log').open('wb') as so,(root/'stderr.log').open('wb') as se:
            p=subprocess.Popen(cmd,cwd=cwd,env=env,stdout=so,stderr=se,start_new_session=(os.name=='posix'),preexec_fn=limits if os.name=='posix' else None)
            try:p.wait(timeout=seconds)
            except subprocess.TimeoutExpired:
                if os.name=='posix':os.killpg(p.pid,signal.SIGKILL)
                else:p.kill()
                p.wait();raise ValueError('replay wall-clock timeout')
        result['returncode']=p.returncode
        if p.returncode:raise ValueError('replay exit '+str(p.returncode)+': '+(root/'stderr.log').read_text(errors='replace')[-2000:])
        structure=validate(public,out,docs);result['validation']=structure
        comparison=compare_deliveries(public,submission,out,docs,use_contract_tolerance=True);result['comparison']=comparison
        if not (out/'analysis.py').is_file():structure['errors'].append('replay did not deliver analysis.py');structure['ok']=False
        result['ok']=structure['ok'] and comparison['agree']
    except (OSError,ValueError) as e:result['error']=str(e)
    result['seconds']=round(time.monotonic()-start,3)
    return result

```

</details>

**依据 6 · 源码核查**：[packages/dsh-biodsh/lib/semantic_check.py:68-102](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/semantic_check.py#L68-L102)

固定manifest、规则及引用检查。

<details>
<summary>查看原文（35行）</summary>

```text
    result={'ok':False,'scope':'selected public-source consistency checks','scientific_correctness_verified':False,
            'independent_reimplementation':False,'errors':[],'rules':[],'checked_cells':0,'checked_columns':[],
            'unverified_columns':[],'interpretation_limit':'A valid public quotation does not prove the model interpreted it correctly.'}
    errors=result['errors'];cache={};verified=set();plan=snapshot.get('plan');manifest=snapshot.get('public_files',{})
    def source(name):
        if name not in manifest:raise ValueError('source was not in initial public snapshot: '+str(name))
        p=within(public,name)
        if name not in verified:
            if sha(p)!=manifest[name]:raise ValueError('public input changed: '+name)
            verified.add(name)
        return p
    def table(p):
        key=str(p)
        if key not in cache:
            with p.open(encoding='utf-8-sig',newline='') as f:
                reader=csv.DictReader(f,delimiter='\t' if p.suffix.lower()=='.tsv' else ',')
                names=reader.fieldnames
                if not names or len(names)!=len(set(names)):raise ValueError('missing or duplicate CSV header')
                rows=[]
                for r in reader:
                    if None in r or any(v is None for v in r.values()):raise ValueError('malformed CSV row')
                    rows.append(r)
                    if len(rows)>max_rows:raise ValueError('semantic checker row limit exceeded; no silent sampling')
            cache[key]=(names,rows)
        return cache[key]
    try:
        if not isinstance(plan,dict) or plan.get('version')!=1:raise ValueError('semantic plan version 1 required')
        if set(plan)-{'version','rules','unverified'}:raise ValueError('unknown semantic plan member')
        rules=plan.get('rules')
        if not isinstance(rules,list) or not rules:raise ValueError('at least one executable source check required')
        if len(rules)>300:raise ValueError('semantic rule limit exceeded')
        if any(not isinstance(r,dict) for r in rules):raise ValueError('rules must be objects')
        ids=[r.get('id') for r in rules]
        if any(not isinstance(x,str) or not x for x in ids) or len(set(ids))!=len(ids):raise ValueError('unique nonempty rule IDs required')
        checked=set()
```

</details>

**依据 7 · 源码核查**：[packages/dsh-biodsh/lib/semantic_check.py:149-158](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/semantic_check.py#L149-L158)

未验证列不阻止有checked_cells的ok。

<details>
<summary>查看原文（10行）</summary>

```text
                if not outputs:raise ValueError('no output cells checked')
                record['ok']=not record['mismatches'];checked.add((target,column))
                result['checked_cells']+=record['checked_cells']
                if not record['ok']:errors.append(rule['id']+': source-derived value mismatch')
            except (OSError,KeyError,TypeError,ValueError,InvalidOperation) as e:
                record['ok']=False;record['error']=str(e);errors.append(rule['id']+': '+str(e))
        result['checked_columns']=[{'table':t,'column':c} for t,c in sorted(checked)]
        result['unverified_columns']=[{'table':t,'column':c} for t,s in declared_tables.items() for c in s['columns'] if (t,c) not in checked]
        result['model_declared_unverified']=plan.get('unverified',[])
        result['ok']=not errors and result['checked_cells']>0
```

</details>

**依据 8 · 源码核查**：[packages/dsh-biodsh/lib/settings.js:15-20](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/settings.js#L15-L20)

coverage默认false。

```text
export const DEFAULTS = {
  coverageReviewEnabled: false,
  semanticEnabled: true,
  selectEnabled: true, selectAdaptive: true,
  deliveryEnabled: true, reconcileChecks: false, magiMode: 'off', magiSteps: 60, magiSeconds: 900, deliveryMaxRepairs: 3, deliveryReplaySeconds: 120, deliveryPython: '', deliveryPythonArgs: [], selectProvider: '', selectModel: '', selectMaxInject: 2,
  guardEnabled: true, guardSoftSteps: 60, guardSoftSeconds: 900, guardHardSteps: 80, guardHardSeconds: 1100, guardMaxSteps: 90,  // v18 (evaluated) thresholds
```

**依据 9 · 源码核查**：[packages/dsh-biodsh/lib/coverage_review.js:28-45](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/coverage_review.js#L28-L45)

模型覆盖与引用检查不证明科学正确。

<details>
<summary>查看原文（18行）</summary>

```text
 if(!value || !Array.isArray(value.reviewed)||!Array.isArray(value.issues)||!Array.isArray(value.uncertain_columns))throw Error('review schema invalid');
 for(const group of value.reviewed){
  if(typeof group.basis!=='string'||group.basis.trim().length<20||!Array.isArray(group.columns))throw Error('review basis missing');
  for(const column of group.columns){const k=key({table:group.table,column});if(!required.has(k)||seen.has(k))throw Error('unknown/duplicate review column');seen.add(k);}
 }
 const missing=[...required].filter(k=>!seen.has(k));if(missing.length)throw Error('unreviewed contract columns: '+missing.join(', '));
 const publicText=Object.values(packet.public_definitions).join('\n'),code=Object.values(packet.submission_code).join('\n');
 for(const item of value.issues){
  if(!required.has(key(item))||typeof item.reason!=='string'||item.reason.length<15||typeof item.repair!=='string'||item.repair.length<10)throw Error('ungrounded issue target or explanation');
  if(typeof item.public_quote!=='string'||item.public_quote.length<12||!publicText.includes(item.public_quote))throw Error('issue public quote not found');
  if(typeof item.code_quote!=='string'||item.code_quote.length<12||!code.includes(item.code_quote))throw Error('issue code quote not found');
 }
 for(const item of value.uncertain_columns)if(!required.has(key(item))||typeof item.reason!=='string'||item.reason.length<15)throw Error('invalid unresolved coverage entry');
 return {ok:!value.issues.length&&!value.uncertain_columns.length,required_columns:required.size,reviewed_columns:seen.size,issues:value.issues,uncertain_columns:value.uncertain_columns,reviewed:value.reviewed,scientific_correctness_verified:false,coverage_basis:'independent model contract/code review, not independent numerical validation'};
}
function makePacket(root,docs,semantic,checkResult,config,signal) {
 return new Promise((resolve,reject)=>{
  const child=spawn(config.python,[...config.args,fileURLToPath(new URL('./coverage_packet.py',import.meta.url)),'--public',root],{cwd:root,windowsHide:true,signal,stdio:['pipe','pipe','pipe']});let out='',err='';
```

</details>

#### 缺口

- 本轮没有安装、目标测试、模型/科学任务或作者原始基准复现。
  **影响**：不能证明技能数量、实际统计正确、平台兼容与净费用收益。
  **进一步探讨**：固定打包资源、依赖和金标小任务，先查覆盖/重放/故障状态，再开展受控领域验收。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · MAGI与作者效果能支持怎样采用、恢复和退出？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

MAGI默认off；adaptive看修复/失败/长run信号，先replicator在复制公共材料的子目录重做，再arbiter看两候选并执行reconcile检查。源码明确同OS用户/父权限根，所谓盲法是目录/会话约定，不是不能读取primary的安全隔离；角色由文件标识，fresh public-only workspace是前提。arbiter accepted才把原submission rename到备份再copy新结果，两步非事务，若copy失败状态可写review_failed_analyst_kept而原结果已移到备份，需人工按目录恢复，不能信状态字面。比较子进程也没有独立timeout/signal，取消/挂起需外层验收。README作者称MAGI只救少数且约双倍时间费用，PTC15开发任务中位步23→16、秒129→97准确率相同；本轮未拿原始逐任务、版本/配对/价格证据，不升级为当前真实收益或普适生信质量。需要精确target0.2.1-rc.2及Host接口、pnpm、Python（semantic hashlib.file_digest需3.11+）、numpy/scipy/pandas和工作区合同/输入。首次安装/技能构建与统计合同编写、持续selector/模型及replay计算、失败多轮/临时目录和人工复核均成本，金额/净节时未知。建议观察，先专业用户用去敏合成且已知答案小合同验证，再考虑新方法；不用真实病人数据或临床结论。退出换原preset并备份submission、receipt与原始数据；停用不撤模型外发或脚本副作用。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-biodsh/lib/magi.js:1-13](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/magi.js#L1-L13)

MAGI独立性边界。

<details>
<summary>查看原文（13行）</summary>

```text
// BioDSH-MAGI (Multi-Analyst Gated Inspection): in-app form of the independent double analysis evaluated as v18.
//
// After the Analyst's turn on a contracted task, the run's own records decide whether to review it (same rule as the
// evaluation harness, report/continuation_20261028/pilot_v18w/trigger.py): delivery not accepted or repaired, a failed
// source-consistency check, >= magiSteps steps or >= magiSeconds seconds. Mode 'always' reviews every contracted turn.
// A Replicator then solves the same request in a fresh copy of the public inputs, without the Analyst's files, and an
// Arbiter reconciles the two frozen candidates under the v18 instructions (magi_reconcile.md). The delivery gate
// requires the Arbiter's executable checks (reconcile_checks.py) on a clean replay. Only an accepted Arbiter delivery
// replaces the Analyst's submission; the Analyst's original is kept under .biodsh-magi/.
//
// Difference from the evaluation (documented in the paper): the children are in-process dsh subagents under the same
// OS account, in their own directories under .biodsh-magi/, so the Replicator's blindness is by separation of
// directories and sessions, not by an OS namespace. Open requests without a public output contract are not reviewed.
```

</details>

**依据 2 · 源码核查**：[packages/dsh-biodsh/lib/magi.js:49-74](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/magi.js#L49-L74)

compare进程无timeout及child激活。

<details>
<summary>查看原文（26行）</summary>

```text
  const skip = n => n.startsWith('.biodsh') || ['submission', '.git', 'node_modules', '__pycache__'].includes(n);
  const visit = (dir, out) => {
    fs.mkdirSync(out, { recursive: true });
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (skip(ent.name) || ent.isSymbolicLink()) continue;
      const src = path.join(dir, ent.name), dst = path.join(out, ent.name);
      if (ent.isDirectory()) visit(src, dst); else if (ent.isFile()) fs.copyFileSync(src, dst);
    }
  };
  visit(root, dest);
}

function copyTree(src, dst) { if (fs.existsSync(src)) fs.cpSync(src, dst, { recursive: true }); }

function compare(python, args, contract, left, right, out) {
  return new Promise(resolve => {
    const child = spawn(python, [...args, COMPARE, contract, left, right, out], { windowsHide: true, stdio: 'ignore' });
    child.on('error', () => resolve(false)); child.on('close', c => resolve(c === 0));
  });
}

async function child(ctx, parent, { cwd, prompt, label, signal }) {
  const subagents = ctx.get?.('subagents') || ctx.subagents;
  if (!subagents?.startActivation) throw new Error('MAGI needs the dsh subagent service with the spawn provider');
  const activation = await subagents.startActivation({ provider: 'spawn', label, signal, delivery: 'caller',
    request: { cwd, prompt: [{ type: 'text', text: prompt }], parent, maxDepth: 1 } });  // depth 1 = direct children only
```

</details>

**依据 3 · 源码核查**：[packages/dsh-biodsh/lib/magi.js:93-129](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/magi.js#L93-L129)

两阶段与rename/copy失败状态。

<details>
<summary>查看原文（37行）</summary>

```text
    const rep = path.join(base, 'replicator');
    copyPublic(root, rep); fs.writeFileSync(path.join(rep, ROLE_FILE), 'replicator');
    log('MAGI 2/3: replicator'); report.replicator = { cwd: rep };
    await child(ctx, agent, { cwd: rep, prompt, label: 'BioDSH-MAGI replicator', signal });
    report.replicator.delivery = readJson(path.join(rep, '.biodsh-delivery.json'))?.status ?? null; save();

    const arb = path.join(base, 'arbiter');
    copyPublic(root, arb); fs.writeFileSync(path.join(arb, ROLE_FILE), 'arbiter');
    copyTree(path.join(root, 'submission'), path.join(arb, '.biodsh-candidates/primary/submission'));
    copyTree(path.join(rep, 'submission'), path.join(arb, '.biodsh-candidates/blind/submission'));
    copyTree(path.join(root, 'submission'), path.join(arb, 'submission'));
    for (const [from, label] of [[root, 'primary'], [rep, 'blind']]) {
      const plan = path.join(from, '.biodsh-semantic-plan.json');
      if (fs.existsSync(plan)) fs.copyFileSync(plan, path.join(arb, '.biodsh-candidates', label, 'semantic-plan.json'));
    }
    if (fs.existsSync(path.join(root, '.biodsh-semantic-plan.json'))) fs.copyFileSync(path.join(root, '.biodsh-semantic-plan.json'), path.join(arb, '.biodsh-semantic-plan.json'));
    if (fs.existsSync(path.join(arb, 'TABLE_CONTRACT.json')))
      await compare(python, pythonArgs, path.join(arb, 'TABLE_CONTRACT.json'), path.join(arb, '.biodsh-candidates/primary/submission'),
                    path.join(arb, '.biodsh-candidates/blind/submission'), path.join(arb, '.biodsh-candidates/comparison.json'));
    const arbPrompt = prompt + '\n\n' + fs.readFileSync(RECONCILE, 'utf8');
    log('MAGI 3/3: arbiter'); report.arbiter = { cwd: arb };
    await child(ctx, agent, { cwd: arb, prompt: arbPrompt, label: 'BioDSH-MAGI arbiter', signal });
    const gate = readJson(path.join(arb, '.biodsh-delivery.json'));
    report.arbiter.delivery = gate?.status ?? null;
    report.arbiter.reconcile_checks = gate?.reconcile_checks ? { ok: gate.reconcile_checks.ok, checks: gate.reconcile_checks.checks } : null;
    if (gate?.status === 'accepted') {
      // Move (never delete) the Analyst's delivery aside, then place the Arbiter's.
      if (fs.existsSync(path.join(root, 'submission'))) fs.renameSync(path.join(root, 'submission'), path.join(keep, 'analyst-submission'));
      copyTree(path.join(arb, 'submission'), path.join(root, 'submission'));
      report.status = 'arbiter_delivery_adopted';
    } else report.status = 'arbiter_not_accepted_analyst_kept';
  } catch (e) {
    if (signal?.aborted) { report.status = 'cancelled'; save(); throw e; }
    report.status = 'review_failed_analyst_kept'; report.error = String(e?.message || e);
  }
  report.ended_at = new Date().toISOString(); save();
  return report;
```

</details>

**依据 4 · 作者声明**：[packages/dsh-biodsh/README.md:15-21](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/README.md#L15-L21)

作者MAGI效果及安装主张。

```text
| Convergence guard | In a long turn, asks the agent to save its code and finish the needed checks (900 s, or 60 steps), then to report honestly what is unfinished (1100 s, or 80 steps); ends a turn past 90 steps. It never asks the agent to guess. |
| Delivery gate | For tasks that come with a public output specification (table contract, claims), checks the saved outputs against it, checks declared columns against the original inputs, and replays the analysis script in a clean folder before the turn may end; on failure it returns the concrete errors for repair. |
| BioDSH-MAGI | **Experimental, off by default.** **Multi-Analyst Gated Inspection.** When an analysis with an output specification shows a risk signal (the delivery gate needed repairs, a source check failed, or the run was long), a second analyst redoes it from the original inputs in a separate folder without seeing the first result, and an arbiter compares both and delivers only after its own executable, cell-by-cell checks pass the delivery gate. Modes: `off` (default), `adaptive`, `always`. In our evaluation it rescued only a few tasks while roughly doubling time and cost. The first analyst's result is kept under `.biodsh-magi/`. |

## Install

Requires DeepSeek Harness 0.2.1 or later and [pnpm](https://pnpm.io/installation) on `PATH` (dsh's plugin manager runs pnpm).
```

**依据 5 · 作者声明**：[packages/dsh-biodsh/README.md:41-41](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/README.md#L41-L41)

作者15开发任务PTC主张。

```text
**BioDSH (PTC)** (`biodsh-ptc`) is the same preset with programmatic tool calling, like dsh's own `ptc` preset: the model calls tools from one program per step, so writing a script, running it and checking its output take one step instead of three. On 15 development tasks it cut the median from 23 to 16 steps and from 129 s to 97 s at the same accuracy.
```

**依据 6 · 源码核查**：[packages/dsh-biodsh/lib/semantic_check.py:11-13](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/semantic_check.py#L11-L13)

hashlib.file_digest依赖。

```text

def sha(path):
    with path.open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()
```

**依据 7 · 源码核查**：[packages/dsh-biodsh/package.json:52-61](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/package.json#L52-L61)

peer/target声明。

<details>
<summary>查看原文（10行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.0.5"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "dshTarget": "0.2.1-rc.2"
}
```

</details>

#### 缺口

- 本轮没有安装、目标测试、模型/科学任务或作者原始基准复现。
  **影响**：不能证明技能数量、实际统计正确、平台兼容与净费用收益。
  **进一步探讨**：固定打包资源、依赖和金标小任务，先查覆盖/重放/故障状态，再开展受控领域验收。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能提出什么最小可证伪交付改进？

**研究主题**：新假设与验证、采用判断

#### 完整回答

由Q03-Q05推导未验证的覆盖预算与发布契约：accepted必须拆为schema/replay/已核列覆盖/科学判断四状态，关键列由用户或独立公共定义清单固定，未核关键列阻止“科学验收”；对unsupported method显式人工判定而非添加易过规则。总预算单独累计所有selector、分析/child/coverage模型尝试与replay资源，超限进入unknown/停止新请求，不用step替token；MAGI先写新目录并验证后以带manifest的切换发布，失败保留原primary在位。最小实验是两输出列仅检查一列且另一列分母错、引用原文但predicate颠倒、重放稳定错误、PTC一步长工具、arbiter复制中断。若仍accepted被呈现为全科学通过、超限继续新请求或原结果缺位，即推翻充分性。完整性改进会增加合同/审核/存储成本，需与专家手写脚本+独立核验同任务比较，不算已有科学或经济创新。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-biodsh/lib/semantic_check.py:155-158](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/semantic_check.py#L155-L158)

覆盖与ok分离引出反例。

```text
        result['checked_columns']=[{'table':t,'column':c} for t,c in sorted(checked)]
        result['unverified_columns']=[{'table':t,'column':c} for t,s in declared_tables.items() for c in s['columns'] if (t,c) not in checked]
        result['model_declared_unverified']=plan.get('unverified',[])
        result['ok']=not errors and result['checked_cells']>0
```

**依据 2 · 源码核查**：[packages/dsh-biodsh/lib/guard.js:29-44](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/guard.js#L29-L44)

step拒绝/时间提醒不能总预算。

<details>
<summary>查看原文（16行）</summary>

```text
    const get = (k) => (role === 'arbiter' && k in ARBITER) ? ARBITER[k] : base(k);
    if (!get('guardEnabled')) return next();
    const step = Number(payload?.step) || 0;
    const max = get('guardMaxSteps');
    if (max > 0 && step > max) {
      dbg(`turn ${payload.turn}: step ${step} > ${max}, rejecting`);
      return { kind: 'reject' };
    }
    const decision = await next();
    try {
      if (!decision || decision.kind !== 'enter' || !payload?.agent) return decision;
      let st = state.get(payload.agent);
      if (!st || st.turn !== payload.turn) { st = { turn: payload.turn, t0: Date.now(), soft: false, hard: false }; state.set(payload.agent, st); }
      const sec = Math.round((Date.now() - st.t0) / 1000);
      let m = null;
      if (!st.hard && (step >= get('guardHardSteps') || sec >= get('guardHardSeconds'))) { st.hard = st.soft = true; m = notice(HARD(step, sec), `final answer now (${step} steps, ${sec}s)`); }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-biodsh/lib/magi.js:118-126](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/magi.js#L118-L126)

发布非原子。

```text
    if (gate?.status === 'accepted') {
      // Move (never delete) the Analyst's delivery aside, then place the Arbiter's.
      if (fs.existsSync(path.join(root, 'submission'))) fs.renameSync(path.join(root, 'submission'), path.join(keep, 'analyst-submission'));
      copyTree(path.join(arb, 'submission'), path.join(root, 'submission'));
      report.status = 'arbiter_delivery_adopted';
    } else report.status = 'arbiter_not_accepted_analyst_kept';
  } catch (e) {
    if (signal?.aborted) { report.status = 'cancelled'; save(); throw e; }
    report.status = 'review_failed_analyst_kept'; report.error = String(e?.message || e);
```

**依据 4 · 源码核查**：[packages/dsh-biodsh/lib/coverage_review.js:40-41](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/coverage_review.js#L40-L41)

科学正确明确非承诺。

```text
 for(const item of value.uncertain_columns)if(!required.has(key(item))||typeof item.reason!=='string'||item.reason.length<15)throw Error('invalid unresolved coverage entry');
 return {ok:!value.issues.length&&!value.uncertain_columns.length,required_columns:required.size,reviewed_columns:seen.size,issues:value.issues,uncertain_columns:value.uncertain_columns,reviewed:value.reviewed,scientific_correctness_verified:false,coverage_basis:'independent model contract/code review, not independent numerical validation'};
```

#### 缺口

- 本轮没有安装、目标测试、模型/科学任务或作者原始基准复现。
  **影响**：不能证明技能数量、实际统计正确、平台兼容与净费用收益。
  **进一步探讨**：固定打包资源、依赖和金标小任务，先查覆盖/重放/故障状态，再开展受控领域验收。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
