# awesome-gpt-image-2

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[63e6176](https://github.com/freestylefly/awesome-gpt-image-2/tree/63e6176fa01be51c000108dacd72716d3e46784b)

<!-- BEGIN META -->
[![GitHub ★ 35,006](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35%2C006&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/freestylefly/awesome-gpt-image-2)
<!-- END META -->

> **实现功能**：社区图像案例与结构化提示词模板库，附Agent风格选择Skill和在线画廊。

> **核心亮点**：相对散收藏提示词，将案例、模板和约束组织成可检索Skill参考；增量是表达与分发，未证明新图像算法或稳定生产收益。[Q01](#research-q01)

> **风险与缺陷**：单次案例缺具体模型与原始条件，不能支持同条件版本排名；MIT不覆盖所有社区素材，安装默认all会覆盖同名技能目录。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 根仓库是什么，结构化提示词贡献到哪里？](#detail-section-11)
  - [Q02 · 生成与安装如何保持资源一致，有何副作用？](#detail-section-12)
  - [Q03 · 版本复现和商用主张应怎样收窄？](#detail-section-13)
  - [Q04 · 如何采用并检验可生产复用的假设？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向重复制作海报/产品图/信息图的用户与Agent；主要交付可复制提示词资源，实际成片另验。[Q01](#research-q01)

普通结构化提示词加手工收藏文件，不安装Skill；同任务、同模型参数与预算比较合格图率和人工选择时间。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

|能力|主要用途|使用条件与边界|
|---|---|---|
|模板/案例资源|找视觉方向及约束|来源许可和模型效果另核|
|风格Skill|Agent选择模板并写提示词|不自动等于生图接线|
|网站生成辅助|任务状态结算|仅抽读辅助，非全链验收|

#### 启动与依赖

|依赖或条件|是否必需|用途|缺失或不满足时|
|---|---|---|---|
|可读模板与案例参考|资源选择必需|定位方向和约束|先固定本地文本|
|有权素材和明确输出标准|生产试用必需|许可与合格验收|不用于商业交付|
|所选图像模型/账号|生图必需|执行提示词|库本身不生成图片|
|Node和技能目录权限|安装时必需|复制Skill|可直接手工读资源|

#### 启动步骤

|步骤|执行者与成功判据|失败处理|
|---|---|---|
|选择类别和模板|用户确认目标/来源|改用简单提示基线|
|填主体文字尺寸约束|用户核对授权及准确文本|补需求再生成|
|小批生成记录失败|用户盲评并算总成本|保留任务ID核对，避免重复提交|

**效果与成本**

#### 成本

|阶段|现金与资源|人工与时间|未知|
|---|---|---|---|
|首次|模型环境及有权素材|选模板、核来源授权、备份Skill|准备时间|
|持续|生图、重试和可能平台费用|文字布局检查与修图|每合格图成本|
|失败恢复|过期结果、结算与重试|查任务ID、恢复覆盖技能|重复收费及回滚时间|

#### 效果

|效果项|抽读支持|未知|
|---|---|---|
|结构复用|选择顺序及约束分块|实际成片成功率|
|资源一致|ID/锚点/图片校验|提示语义及模型泛化|
|案例复现|作者4组单次记录|具体模型、同条件优势|

> **思考**：单次案例缺具体模型与原始条件，不能支持同条件版本排名；MIT不覆盖所有社区素材，安装默认all会覆盖同名技能目录。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对散收藏提示词，将案例、模板和约束组织成可检索Skill参考；增量是表达与分发，未证明新图像算法或稳定生产收益。[Q01](#research-q01)

相对散收藏提示词，将案例、模板和约束组织成可检索Skill参考；增量是表达与分发，未证明新图像算法或稳定生产收益。[Q01](#research-q01)

从单一结构数据生成Skill参考并校验断链值得借鉴；复用需保留固定版本、许可和失败样本，安装应控制覆盖范围。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

单次案例缺具体模型与原始条件，不能支持同条件版本排名；MIT不覆盖所有社区素材，安装默认all会覆盖同名技能目录。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

作为资源先手工选单模板，以有权素材和固定模型小批试用；安装前选目标备份，不把案例或广告当成片/收费保证。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

抽读支持资源组织、生成与安装机制；图像质量、模型比较及商用许可未独立验证；元数据/失败卡假设未验证。

- 已检查：作者 README、包清单、源码路径 agents/skills/gpt-image-2-style-library/SKILL.md、agents/skills/gpt-image-2-style-library/bin/install.mjs、scripts/generate-style-skill.mjs、docs/disclaimer.md、docs/design/gpt-image-2-5/real-cases.md、api/_lib/generation.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：partial clone固定版本抽读Skill、生成/安装器、复现/来源说明和平台结算辅助；inventory仅子集，未独立查看全部案例图、全量库或网站授权/计费链，未生图安装。
- 下一步：使用授权素材，固定模型/参数/提示词与预算记录全部尝试，盲评文字布局及每合格图总成本；网站结算另做任务ID对账。

**分析版本**

- **仓库**：[freestylefly/awesome-gpt-image-2](https://github.com/freestylefly/awesome-gpt-image-2)
- **版本号**：1.0.0（[固定提交 63e6176](https://github.com/freestylefly/awesome-gpt-image-2/tree/63e6176fa01be51c000108dacd72716d3e46784b)）
- **版本日期**：2026-10-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是给模板绑定模型/参数/合格标准和失败卡，比美图目录更能选择生产方案；固定预算盲评合格率与总成本，无改善则否定。[Q04](#research-q04)

使用授权素材，固定模型/参数/提示词与预算记录全部尝试，盲评文字布局及每合格图总成本；网站结算另做任务ID对账。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

统计范围：partial inspected snapshot; not whole-plugin LOC；组件：根；内容摘要：7f756228c052e2c4d12e740a5372198b25cfa9a47c3c2bfb57b3683ed15dbb0a。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 2 | 261 | 228 | 1 | — |
| .md | source | 4 | 652 | — | — | 6184 |
| .js | source | 1 | 85 | 77 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/freestylefly/awesome-gpt-image-2/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：结构化案例/模板到Skill的复用提供什么增量，生成与许可证据的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根仓库是什么，结构化提示词贡献到哪里？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根仓库以社区图像案例、工业模板和可安装Skill资源为主，并包含在线画廊/生成计费网站代码，不是DSH原生插件。目标用户是反复制作海报/产品图/信息图的设计者与Agent，合格资源交付是可复制、明确主体/布局/文字/比例/负约束的提示词，而图像能否合格必须另验。Skill要求按模板类别、风格、场景、案例匹配，并输出模板名/案例ID及分块提示词；相对散收藏示例，贡献是统一检索和约束组织，降低遗漏。案例“reverse-engineered”指人工/AI归纳结构，不证明原图真实生成条件被恢复，也不能把样例数量计作有效方法数量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:74-90](https://github.com/freestylefly/awesome-gpt-image-2/blob/63e6176fa01be51c000108dacd72716d3e46784b/README.md#L74-L90)

作者Prompt-as-Code目标和资源入口

<details>
<summary>查看原文（17行）</summary>

```text
## ⚡️ Project Vision

After GPT-Image2 became widely available, AI image generation moved from "can it make an image?" to "can it make stable, controllable, reusable images?" This project turns scattered community examples into Prompt-as-Code assets that are easier for agents and automation workflows to reuse.

The core goal is simple: compress prose-style prompts into structured protocols. When you need batch generation, template systems, or production workflows, this structure is more valuable than a pile of isolated examples.

- 🧱 Atomic schema: split subjects, lighting, materials, layout, and visual details into composable parts
- ⚙️ Workflow friendly: designed for agents, scripts, and automation systems
- 🧬 Structured control: improve controllability for layout, copy, and information hierarchy

## 📖 Quick Links

- [Full case gallery](docs/gallery.md)
- [Gallery Part 1: cases 1-165](docs/gallery-part-1.md)
- [Gallery Part 2: cases 166-544](docs/gallery-part-2.md)
- [Industrial prompt templates and pitfalls guide](docs/templates.md)
- [Agent skill: GPT-Image2 Style Library](agents/skills/gpt-image-2-style-library/SKILL.md)
```

</details>

**依据 2 · 源码核查**：[agents/skills/gpt-image-2-style-library/SKILL.md:22-46](https://github.com/freestylefly/awesome-gpt-image-2/blob/63e6176fa01be51c000108dacd72716d3e46784b/agents/skills/gpt-image-2-style-library/SKILL.md#L22-L46)

分类选择和分块提示词流程

<details>
<summary>查看原文（25行）</summary>

```text
## Workflow

1. Detect the user's language and answer in that language.
2. Identify the user's target output: product, poster, UI, infographic, brand, photo, illustration, character, scene, history, document, or special task.
3. Match the request in this order: template category, visual style tag, scene tag, then nearest example cases.
4. If one template is clearly strongest, use it directly. If several are plausible, present 2-3 options with short reasons and ask the user to choose.
5. Build the final prompt with these blocks:
   - subject and task
   - composition and layout
   - visual style and materials
   - text and label requirements
   - aspect ratio and output format
   - constraints and negative details
6. Include the selected template name and any useful example case IDs.

## Output Defaults

- Provide a copyable prompt first.
- Keep constraints concrete: exact text, aspect ratio, readable labels, layout hierarchy, and avoided artifacts.
- For Chinese requests, write the final prompt in Chinese unless the user asks for English.
- For English requests, write the final prompt in English unless the user asks for Chinese.
- When the user asks for multiple concepts, reuse one template and vary subject, composition, palette, and scene.

## Maintenance

```

</details>

#### 缺口

- 结构化提示相对简单提示的成片效果没有独立对照
  **影响**：不能证明提示词复用提高成片成功率或商业可用
  **进一步探讨**：用授权素材和固定模型参数、同预算对照普通提示词，记录盲评合格率、重试及人工时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 生成与安装如何保持资源一致，有何副作用？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

generate-style-skill从data/style-library.json和templates文档建立引用，校验模板/分类/风格/场景ID唯一、锚点和封面存在，再输出参考索引，避免Skill人工副本漂移。这是数据一致性校验，不验证提示词语义或图片效果，输出链接使用main也不能自动保持未来版本可复现。install.mjs复制SKILL/agents/assets/references到目标技能目录，默认all，执行前rmSync目标同名目录；因此安装会覆盖已有本地定制，需用户显式选择目标并备份，不是只读浏览资源。目标包括CODEX_HOME/CLAUDE_HOME/AGENTS_HOME，本轮仅阅读没有调用。平台generation辅助函数将pending任务按完成/失败走数据库RPC结算，说明网站生成是带持久/计费状态的另一流程，不能与纯提示词Skill混为同一能力。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/generate-style-skill.mjs:36-73](https://github.com/freestylefly/awesome-gpt-image-2/blob/63e6176fa01be51c000108dacd72716d3e46784b/scripts/generate-style-skill.mjs#L36-L73)

唯一性、锚点及图片存在校验

<details>
<summary>查看原文（38行）</summary>

```text

function validateLibrary(library) {
  const templateText = readFileSync(templatesFile, 'utf8');
  const templateAnchors = new Set([...templateText.matchAll(/<a name="([^"]+)"><\/a>/g)].map((match) => match[1]));

  if (!Array.isArray(library.templates) || library.templates.length === 0) {
    throw new Error('style-library.json must include templates');
  }

  assertUnique(library.templates, 'id', 'templates');
  assertUnique(library.categories, 'value', 'categories');
  assertUnique(library.styles, 'value', 'styles');
  assertUnique(library.scenes, 'value', 'scenes');

  const templateCovers = new Set();
  for (const template of library.templates) {
    if (!templateAnchors.has(template.anchor)) {
      throw new Error(`template anchor not found in docs/templates.md: ${template.anchor}`);
    }
    const cover = localImagePath(template.cover);
    if (!cover || !existsSync(cover)) {
      throw new Error(`template cover missing: ${template.cover}`);
    }
    if (templateCovers.has(template.cover)) {
      throw new Error(`template cover is duplicated: ${template.cover}`);
    }
    templateCovers.add(template.cover);
  }

  for (const category of library.categories) {
    const cover = localImagePath(category.cover);
    if (!cover || !existsSync(cover)) {
      throw new Error(`category cover missing: ${category.cover}`);
    }
    if (!templateAnchors.has(category.templateAnchor)) {
      throw new Error(`category template anchor not found: ${category.templateAnchor}`);
    }
  }
```

</details>

**依据 2 · 源码核查**：[scripts/generate-style-skill.mjs:82-125](https://github.com/freestylefly/awesome-gpt-image-2/blob/63e6176fa01be51c000108dacd72716d3e46784b/scripts/generate-style-skill.mjs#L82-L125)

生成索引和main链接

<details>
<summary>查看原文（44行）</summary>

```text
function linkForTemplate(library, template) {
  return `${library.repository}/blob/main/${library.templateDocument}#${template.anchor}`;
}

function list(values) {
  return values?.length ? values.join(', ') : 'None';
}

function bulletList(values, language) {
  return (values || []).map((value) => `  - ${label(value, language)}`).join('\n');
}

function renderReference(library) {
  const lines = [
    '# GPT-Image2 Style Library Reference',
    '',
    'Generated from `data/style-library.json`. Use this file as the detailed index for choosing GPT-Image2 prompt templates, visual styles, categories, and scene tags.',
    '',
    '## Selection Rules',
    '',
    '- Match explicit product types to template categories first, such as product, poster, UI, infographic, brand, photography, character, or document.',
    '- Match visual words to style tags next, such as realistic, 3D, illustration, classical, brand, poster, or UI.',
    '- Match context words to scene tags next, such as commerce, education, social, food, travel, story, history, tech, or creative.',
    '- If a request is vague, offer 2-3 strong template directions and ask the user to choose before writing the final prompt.',
    '- Final output should include the selected template name, a copyable GPT-Image2 prompt, and concise constraints for text, aspect ratio, layout, and negative details.',
    '',
    '## Template Index',
    ''
  ];

  for (const template of library.templates) {
    lines.push(`### ${label(template.title, 'en')} / ${label(template.title, 'zh')}`);
    lines.push('');
    lines.push(`- ID: \`${template.id}\``);
    lines.push(`- Category: ${template.category}`);
    lines.push(`- Styles: ${list(template.styles)}`);
    lines.push(`- Scenes: ${list(template.scenes)}`);
    lines.push(`- Tags: ${list(template.tags)}`);
    lines.push(`- Cover: \`${template.cover}\``);
    lines.push(`- Template source: ${linkForTemplate(library, template)}`);
    lines.push(`- Example cases: ${list((template.exampleCases || []).map((id) => `case ${id}`))}`);
    lines.push('');
    lines.push('Use when:');
    lines.push(`- EN: ${label(template.useWhen, 'en')}`);
```

</details>

**依据 3 · 源码核查**：[agents/skills/gpt-image-2-style-library/bin/install.mjs:32-46](https://github.com/freestylefly/awesome-gpt-image-2/blob/63e6176fa01be51c000108dacd72716d3e46784b/agents/skills/gpt-image-2-style-library/bin/install.mjs#L32-L46)

目标目录

<details>
<summary>查看原文（15行）</summary>

```text
const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const entries = ['SKILL.md', 'agents', 'assets', 'references'];
const targetDefinitions = {
  codex: {
    label: 'Codex',
    root: join(process.env.CODEX_HOME || join(homedir(), '.codex'), 'skills')
  },
  'claude-code': {
    label: 'Claude Code',
    root: join(process.env.CLAUDE_HOME || join(homedir(), '.claude'), 'skills')
  },
  agents: {
    label: 'Shared agent skills',
    root: join(process.env.AGENTS_HOME || join(homedir(), '.agents'), 'skills')
  }
```

</details>

**依据 4 · 源码核查**：[agents/skills/gpt-image-2-style-library/bin/install.mjs:83-92](https://github.com/freestylefly/awesome-gpt-image-2/blob/63e6176fa01be51c000108dacd72716d3e46784b/agents/skills/gpt-image-2-style-library/bin/install.mjs#L83-L92)

安装覆盖行为

<details>
<summary>查看原文（10行）</summary>

```text
  mkdirSync(targetDefinition.root, { recursive: true });
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });

  for (const entry of entries) {
    cpSync(join(packageRoot, entry), join(target, entry), { recursive: true });
  }

  console.log(`Installed ${skillName} for ${targetDefinition.label}: ${target}`);
}
```

</details>

**依据 5 · 源码核查**：[api/_lib/generation.js:60-85](https://github.com/freestylefly/awesome-gpt-image-2/blob/63e6176fa01be51c000108dacd72716d3e46784b/api/_lib/generation.js#L60-L85)

平台任务结算辅助链

<details>
<summary>查看原文（26行）</summary>

```text
export async function settlePlatformGeneration(client, reservation, task) {
  if (!reservation || !['completed', 'failed'].includes(task?.status)) return false;
  if (reservation.status !== 'pending') return false;

  const { error: updateError } = await client
    .from('generation_reservations')
    .update(providerFieldsForTask(task))
    .eq('id', reservation.id)
    .eq('status', 'pending');
  if (updateError) throw updateError;

  if (task.status === 'completed' && task.image) {
    const { error } = await client.rpc('complete_generation_reservation', {
      p_reservation_id: reservation.id
    });
    if (error) throw error;
    return true;
  }

  const { error } = await client.rpc('release_generation_reservation', {
    p_reservation_id: reservation.id,
    p_error_code: task.errorCode || 'GENERATION_FAILED'
  });
  if (error) throw error;
  return true;
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 版本复现和商用主张应怎样收窄？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

固定README的2.5 spotlight明确没有新增live 2.5生成；real-cases记录4组首次单张、无参考图的作者复现，并说明工具未返回具体模型ID/质量/费用，原图条件未核验。所以不能作为2.0对2.5同条件基准、不能断言固定模型普遍改善。disclaimer承认社区来源及第三方版权，不保证商用；仓库MIT不自动覆盖示例图/原作者素材授权。资源使用需可访问参考与有权使用的素材，真正生成还需另选模型/账号/API及预算；网站登录/结算依赖不同于Skill纯文本选择。generation中completed且image存在才complete reservation，无图或failed则release，但辅助函数检查本身不证明所有回调/并发结算幂等与退款已验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-31](https://github.com/freestylefly/awesome-gpt-image-2/blob/63e6176fa01be51c000108dacd72716d3e46784b/README.md#L23-L31)

spotlight范围和不确定性

```text
## GPT Image 2.5 Spotlight

[Explore the 2.5 spotlight](https://gpt-image2.canghe.ai/gpt-image-2-5/?lang=en): learn about Sunburst and Flare, then explore a shared-prompt comparison with a draggable divider, side-by-side view, image enlargement, and generation settings.

- [Sunburst](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst): image generation and precise editing.
- [Flare](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare): fast, high-quality everyday image generation.
- **4 real recreations**: [#532 lemon campaign](https://gpt-image2.canghe.ai/gpt-image-2-5/?lang=en&case=gallery-532-test), [#527 Rio diorama](https://gpt-image2.canghe.ai/gpt-image-2-5/?lang=en&case=gallery-527-test), [#523 Manhattan watercolor](https://gpt-image2.canghe.ai/gpt-image-2-5/?lang=en&case=gallery-523-test), and [#510 Bichon Shop icon](https://gpt-image2.canghe.ai/gpt-image-2-5/?lang=en&case=gallery-510-test). Each preserves its original gallery image and uses the full gallery prompt for one new built-in image generation, without a reference image. A case selector opens any example directly. [Images, prompts and generation records](docs/design/gpt-image-2-5/real-cases.md). Original generation conditions and exact tool model IDs remain unverified; demonstration examples are labeled separately.

The spotlight runs independently. Existing GPT-Image2 cases, templates, Skill, and generation tools remain available. This update does not add live 2.5 image generation.
```

**依据 2 · 作者声明**：[docs/design/gpt-image-2-5/real-cases.md:1-18](https://github.com/freestylefly/awesome-gpt-image-2/blob/63e6176fa01be51c000108dacd72716d3e46784b/docs/design/gpt-image-2-5/real-cases.md#L1-L18)

作者单次复现及模型元信息缺失

<details>
<summary>查看原文（18行）</summary>

```text
# GPT 2.0 / GPT 2.5 案例对比记录

现有 4 组真实复现。左侧保留站内原图，右侧由 Codex 内置生图工具使用完整站内提示词生成；每组首次生成 1 张，无参考图，也未对结果进行后期修改。显示版本沿用项目负责人指定的 GPT 2.0 / GPT 2.5 标签，工具实际返回的信息单独记录。

| 案例 | 本次生成原图 | 完整提示词 | 生成记录 |
| --- | --- | --- | --- |
| [#532 六宫格柠檬饮料微缩广告](https://gpt-image2.canghe.ai/gpt-image-2-5/?case=gallery-532-test) | [PNG](../../../src/assets/image25-case532-run1.png) | [完整输入](case532-test-input.json) | [参数与来源](case532-test-record.json) |
| [#527 Rio 旅行票据纸雕立体海报](https://gpt-image2.canghe.ai/gpt-image-2-5/?case=gallery-527-test) | [PNG](../../../src/assets/image25-case527-run1.png) | [完整输入](case527-test-input.json) | [参数与来源](case527-test-record.json) |
| [#523 曼哈顿公园水彩旅行插画](https://gpt-image2.canghe.ai/gpt-image-2-5/?case=gallery-523-test) | [PNG](../../../src/assets/image25-case523-run1.png) | [完整输入](case523-test-input.json) | [参数与来源](case523-test-record.json) |
| [#510 Bichon Shop 拟物 App 图标](https://gpt-image2.canghe.ai/gpt-image-2-5/?case=gallery-510-test) | [PNG](../../../src/assets/image25-case510-run1.png) | [完整输入](case510-test-input.json) | [参数与来源](case510-test-record.json) |

本次新增的观察：

- #527：票据、基督像、黄色出租车和纸质底座完整，街道立面更醒目，周边注记更密集。
- #523：石桥与池塘变成更明显的前景，树木覆盖更满，保留水彩与钢笔风格和无字画面。
- #510：单个圆角图标与白底留白保留，毛发、绳把和纸袋材质更细，底色与品牌字体变化明显。

这些是单次结果的视觉观察。原图生成条件未独立核验，工具未返回具体模型 ID、质量档位或费用。
```

</details>

**依据 3 · 作者声明**：[docs/disclaimer.md:3-19](https://github.com/freestylefly/awesome-gpt-image-2/blob/63e6176fa01be51c000108dacd72716d3e46784b/docs/disclaimer.md#L3-L19)

第三方来源和商用限制

<details>
<summary>查看原文（17行）</summary>

```text
## 致谢与来源声明

本项目在整理与研究过程中，参考并使用了 [YouMind](https://youmind.com/) 与 [OpenNana](https://opennana.com/) 的公开提示词库内容，仅用于学习、归纳与方法论研究。相关内容版权归原作者或原平台所有，如有侵权或不当使用请联系处理，我们将第一时间修正或下线。

<a name="section-disclaimer"></a>

## 声明 (Disclaimer)

本项目仅整理公开可访问的社区提示词与示例图片，默认用于学习与研究，不主张对第三方原创内容的任何所有权。

本项目里的所有提示词案例和生成的图片，最初的灵感和数据来源均来自公开社区（特别是 [YouMind](https://youmind.com/) 与 [OpenNana](https://opennana.com/)）。我们做这个项目，纯粹是想把”好看的皮囊”拆解成”可复用的代码灵魂”，仅供大家学习、归纳和做大模型 Agent 接入的自动化测试。

- 我们尽最大努力保留原始来源（作者主页、原帖链接、原仓库链接）。
- 涉及第三方内容时，遵循来源仓库声明（含 `CC BY 4.0` 等）及对应平台规则。
- 若你是原作者或权利人，认为某条内容不应展示，请在本仓库发起 Issue 并附上条目链接，我们将在核验后快速下架。
- 本仓库不保证第三方内容可用于商业用途；商业使用前请自行取得原权利方授权。

```

</details>

**依据 4 · 源码核查**：[api/_lib/generation.js:60-85](https://github.com/freestylefly/awesome-gpt-image-2/blob/63e6176fa01be51c000108dacd72716d3e46784b/api/_lib/generation.js#L60-L85)

结算只覆盖所读辅助函数

<details>
<summary>查看原文（26行）</summary>

```text
export async function settlePlatformGeneration(client, reservation, task) {
  if (!reservation || !['completed', 'failed'].includes(task?.status)) return false;
  if (reservation.status !== 'pending') return false;

  const { error: updateError } = await client
    .from('generation_reservations')
    .update(providerFieldsForTask(task))
    .eq('id', reservation.id)
    .eq('status', 'pending');
  if (updateError) throw updateError;

  if (task.status === 'completed' && task.image) {
    const { error } = await client.rpc('complete_generation_reservation', {
      p_reservation_id: reservation.id
    });
    if (error) throw error;
    return true;
  }

  const { error } = await client.rpc('release_generation_reservation', {
    p_reservation_id: reservation.id,
    p_error_code: task.errorCode || 'GENERATION_FAILED'
  });
  if (error) throw error;
  return true;
}
```

</details>

#### 缺口

- 案例来源、生成条件、许可及平台并发结算未完整核验
  **影响**：不能证明提示词复用提高成片成功率或商业可用
  **进一步探讨**：用授权素材和固定模型参数、同预算对照普通提示词，记录盲评合格率、重试及人工时间

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何采用并检验可生产复用的假设？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议先作为资源库手工取一个与任务接近的模板，用有权素材和既有模型试用，保留准确提示词、模型/质量/尺寸、种子可用性及每次失败；不因Skill名称就假定已接生图工具，不先默认all覆盖本地技能。首次是筛模板、核来源/授权和适配，持续为模型调用、重试与人工修图/文字复核，恢复包括结果链接过期、计费状态核对及安装覆盖回滚；实时API价格和成功成本未知，本项不引用赞助广告折扣为可核价格。未验证假设是给模板增加模型版本/参数/合格标准和失败样本卡，能比漂亮案例目录更可靠地选择生产方案。对照固定任务、模型与总调用预算，盲评文字准确、布局、主体一致和授权合规证据，同时算每合格图总费用与人工分钟；若不改善合格率或选择成本更高则否定。

#### 证据与依据

**依据 1 · 源码核查**：[agents/skills/gpt-image-2-style-library/SKILL.md:27-46](https://github.com/freestylefly/awesome-gpt-image-2/blob/63e6176fa01be51c000108dacd72716d3e46784b/agents/skills/gpt-image-2-style-library/SKILL.md#L27-L46)

具体约束可作为验收输入

<details>
<summary>查看原文（20行）</summary>

```text
4. If one template is clearly strongest, use it directly. If several are plausible, present 2-3 options with short reasons and ask the user to choose.
5. Build the final prompt with these blocks:
   - subject and task
   - composition and layout
   - visual style and materials
   - text and label requirements
   - aspect ratio and output format
   - constraints and negative details
6. Include the selected template name and any useful example case IDs.

## Output Defaults

- Provide a copyable prompt first.
- Keep constraints concrete: exact text, aspect ratio, readable labels, layout hierarchy, and avoided artifacts.
- For Chinese requests, write the final prompt in Chinese unless the user asks for English.
- For English requests, write the final prompt in English unless the user asks for Chinese.
- When the user asks for multiple concepts, reuse one template and vary subject, composition, palette, and scene.

## Maintenance

```

</details>

**依据 2 · 作者声明**：[docs/design/gpt-image-2-5/real-cases.md:1-18](https://github.com/freestylefly/awesome-gpt-image-2/blob/63e6176fa01be51c000108dacd72716d3e46784b/docs/design/gpt-image-2-5/real-cases.md#L1-L18)

缺条件的案例记录形成元数据卡假设依据

<details>
<summary>查看原文（18行）</summary>

```text
# GPT 2.0 / GPT 2.5 案例对比记录

现有 4 组真实复现。左侧保留站内原图，右侧由 Codex 内置生图工具使用完整站内提示词生成；每组首次生成 1 张，无参考图，也未对结果进行后期修改。显示版本沿用项目负责人指定的 GPT 2.0 / GPT 2.5 标签，工具实际返回的信息单独记录。

| 案例 | 本次生成原图 | 完整提示词 | 生成记录 |
| --- | --- | --- | --- |
| [#532 六宫格柠檬饮料微缩广告](https://gpt-image2.canghe.ai/gpt-image-2-5/?case=gallery-532-test) | [PNG](../../../src/assets/image25-case532-run1.png) | [完整输入](case532-test-input.json) | [参数与来源](case532-test-record.json) |
| [#527 Rio 旅行票据纸雕立体海报](https://gpt-image2.canghe.ai/gpt-image-2-5/?case=gallery-527-test) | [PNG](../../../src/assets/image25-case527-run1.png) | [完整输入](case527-test-input.json) | [参数与来源](case527-test-record.json) |
| [#523 曼哈顿公园水彩旅行插画](https://gpt-image2.canghe.ai/gpt-image-2-5/?case=gallery-523-test) | [PNG](../../../src/assets/image25-case523-run1.png) | [完整输入](case523-test-input.json) | [参数与来源](case523-test-record.json) |
| [#510 Bichon Shop 拟物 App 图标](https://gpt-image2.canghe.ai/gpt-image-2-5/?case=gallery-510-test) | [PNG](../../../src/assets/image25-case510-run1.png) | [完整输入](case510-test-input.json) | [参数与来源](case510-test-record.json) |

本次新增的观察：

- #527：票据、基督像、黄色出租车和纸质底座完整，街道立面更醒目，周边注记更密集。
- #523：石桥与池塘变成更明显的前景，树木覆盖更满，保留水彩与钢笔风格和无字画面。
- #510：单个圆角图标与白底留白保留，毛发、绳把和纸袋材质更细，底色与品牌字体变化明显。

这些是单次结果的视觉观察。原图生成条件未独立核验，工具未返回具体模型 ID、质量档位或费用。
```

</details>

**依据 3 · 源码核查**：[agents/skills/gpt-image-2-style-library/bin/install.mjs:83-92](https://github.com/freestylefly/awesome-gpt-image-2/blob/63e6176fa01be51c000108dacd72716d3e46784b/agents/skills/gpt-image-2-style-library/bin/install.mjs#L83-L92)

安装需保留回滚依据

<details>
<summary>查看原文（10行）</summary>

```text
  mkdirSync(targetDefinition.root, { recursive: true });
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });

  for (const entry of entries) {
    cpSync(join(packageRoot, entry), join(target, entry), { recursive: true });
  }

  console.log(`Installed ${skillName} for ${targetDefinition.label}: ${target}`);
}
```

</details>

#### 缺口

- 模板元数据/失败卡没有生产任务对照结果
  **影响**：不能证明提示词复用提高成片成功率或商业可用
  **进一步探讨**：用授权素材和固定模型参数、同预算对照普通提示词，记录盲评合格率、重试及人工时间

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
