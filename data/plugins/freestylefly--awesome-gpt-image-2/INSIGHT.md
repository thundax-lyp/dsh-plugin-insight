# GPT-Image2 提示词画廊

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[53d3927](https://github.com/freestylefly/awesome-gpt-image-2/tree/53d3927ee3c45f6c54a12d86aabcf5c921670e11)

<!-- BEGIN META -->
[![GitHub ★ 35,459](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35%2C459&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/freestylefly/awesome-gpt-image-2)
<!-- END META -->

> **功能**：提供可浏览、复制的图像提示词案例、模板及衍生风格 Skill。

> **亮点**：[Q01](#research-q01) 把模板和样例整理为可复用结构。

> **主要限制**：[Q03](#research-q03) 单次复刻且条件不齐，无法推断模型质量。

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
  - [Q01 · 创作者能用它做什么？](#detail-section-11)
  - [Q02 · 风格参考怎样从模板生成？](#detail-section-12)
  - [Q03 · 2.5 复刻能作为模型对照吗？](#detail-section-13)
  - [Q04 · 如何采用而不依赖在线生成？](#detail-section-14)
  - [Q05 · 分类模板能提高一次合格率吗？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要为商业图或插画找提示词参考的人可查画廊。

零散案例可用但要自行筛选。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 案例 | 比较构图和提示 | 复刻条件不全 |
| 模板 | 搭建提示结构 | 需按目标修改 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 固定模板资料 | 浏览需要 | 读取案例 | 手工写提示词 |
| 生成模型 | 实际生成需要 | 试用提示词 | 只参考资料 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 选题 | 浏览案例 | 核对出处 |
| 改写 | 按需求修改提示 | 固定测试条件 |
| 退出 | 保留自己的提示结构 | 无宿主变更 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 生成预算未知 | 选案例耗时未知 | 可先只读 |
| 持续 | 模型费用未知 | 迭代耗时未知 | 效果未证 |
| 恢复 | 重试费用未知 | 替换耗时未知 | 保持人工核验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 案例复用 | 可复制完整提示词 | 质量及成功率 |

> **思考**：[Q03](#research-q03) 单次复刻且条件不齐，无法推断模型质量。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把模板和样例整理为可复用结构。

唯一键、锚点和封面校验限制结构缺漏。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 单次复刻且条件不齐，无法推断模型质量。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先浏览和改写模板，生成另行核对。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的画廊、模板索引和复刻案例的证据边界。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/image25/App.jsx、package.json、scripts/generate-style-skill.mjs、src/image25/additionalCases.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的画廊、模板索引和复刻案例的证据边界。未执行目标代码或实际宿主验证。
- 下一步：开展固定模型的盲评

**分析版本**

- **仓库**：[freestylefly/awesome-gpt-image-2](https://github.com/freestylefly/awesome-gpt-image-2)
- **版本号**：1.0.0（[固定提交 53d3927](https://github.com/freestylefly/awesome-gpt-image-2/tree/53d3927ee3c45f6c54a12d86aabcf5c921670e11)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 比较模板对一次合格率的影响。

开展固定模型的盲评

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 7 | 928 | 827 | 8 | — |
| .md | source | 14 | 23853 | — | — | 205913 |
| .js | source | 51 | 5980 | 5363 | 23 | — |
| .js | test | 7 | 920 | 846 | 31 | — |
| .ts | source | 1 | 76 | 56 | 8 | — |
| .jsx | source | 4 | 5196 | 4895 | 9 | — |

</details>

**活跃度**

[![Issue 未关闭 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=14&color=737b86&logo=github)](https://github.com/freestylefly/awesome-gpt-image-2/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/freestylefly/awesome-gpt-image-2/issues?q=is%3Aissue+created%3A2026-10-06T03%3A25%3A48.280Z..2026-11-05T03%3A25%3A48.280Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/freestylefly/awesome-gpt-image-2/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T03%3A25%3A48.280Z..2026-11-05T03%3A25%3A48.280Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：画廊、模板索引和复刻案例的证据边界

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 创作者能用它做什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

画廊把主题、图和完整提示词放在一起，可复制作为构图起点。相对逐条搜索社交帖子，它提供可查的模板组织，但一张输出不能承诺提示词可重复得到相同画面。根包是站点工作区。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-41](https://github.com/freestylefly/awesome-gpt-image-2/blob/53d3927ee3c45f6c54a12d86aabcf5c921670e11/README.md#L23-L41)

作者说明画廊和复刻

<details>
<summary>查看原文（19行）</summary>

```text
## GPT Image 2.5 Spotlight

[Explore the 2.5 spotlight](https://gpt-image2.canghe.ai/gpt-image-2-5/?lang=en): learn about Sunburst and Flare, then explore a shared-prompt comparison with a draggable divider, side-by-side view, image enlargement, and generation settings.

- [Sunburst](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst): image generation and precise editing.
- [Flare](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare): fast, high-quality everyday image generation.
- **4 real recreations**: [#532 lemon campaign](https://gpt-image2.canghe.ai/gpt-image-2-5/?lang=en&case=gallery-532-test), [#527 Rio diorama](https://gpt-image2.canghe.ai/gpt-image-2-5/?lang=en&case=gallery-527-test), [#523 Manhattan watercolor](https://gpt-image2.canghe.ai/gpt-image-2-5/?lang=en&case=gallery-523-test), and [#510 Bichon Shop icon](https://gpt-image2.canghe.ai/gpt-image-2-5/?lang=en&case=gallery-510-test). Each preserves its original gallery image and uses the full gallery prompt for one new built-in image generation, without a reference image. A case selector opens any example directly. [Images, prompts and generation records](docs/design/gpt-image-2-5/real-cases.md). Original generation conditions and exact tool model IDs remain unverified; demonstration examples are labeled separately.

The spotlight runs independently. Existing GPT-Image2 cases, templates, Skill, and generation tools remain available. This update does not add live 2.5 image generation.

<p align="center">
  <a href="https://gpt-image2.canghe.ai/gpt-image-2-5/?lang=en">
    <img src="docs/design/gpt-image-2-5/case532-preview.jpg" alt="GPT Image 2.5 spotlight preview — case 532 recreation" width="900">
  </a>
</p>

## 🌐 Visual Website

Use the live site at [gpt-image2.canghe.ai](https://gpt-image2.canghe.ai/) to browse the gallery as a product experience: open large previews, copy full prompts, filter by style or scenario, test generation after Google sign-in, and jump back to the source case on GitHub.
```

</details>

**依据 2 · 源码核查**：[src/image25/App.jsx:96-105](https://github.com/freestylefly/awesome-gpt-image-2/blob/53d3927ee3c45f6c54a12d86aabcf5c921670e11/src/image25/App.jsx#L96-L105)

复制当前案例提示词

<details>
<summary>查看原文（10行）</summary>

```text

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  async function copyPrompt() {
    clearTimeout(copyTimer.current);
    try { await navigator.clipboard.writeText(item.prompt); setCopyState('copied'); }
    catch { setCopyState('failed'); }
    copyTimer.current = setTimeout(() => setCopyState(''), 2500);
  }

```

</details>

**依据 3 · 源码核查**：[package.json:1-18](https://github.com/freestylefly/awesome-gpt-image-2/blob/53d3927ee3c45f6c54a12d86aabcf5c921670e11/package.json#L1-L18)

站点构建与独立 Skill

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "awesome-gpt-image-2-site",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "generate:site-data": "node scripts/generate-site-data.mjs",
    "generate:style-skill": "node scripts/generate-style-skill.mjs",
    "ga4:oauth": "node scripts/google-analytics-oauth.mjs",
    "install:skill": "node scripts/install-style-skill.mjs",
    "pack:skill": "npm pack ./agents/skills/gpt-image-2-style-library --dry-run",
    "publish:skill:npm": "npm publish ./agents/skills/gpt-image-2-style-library --access public",
    "predev": "npm run generate:site-data && npm run generate:style-skill",
    "dev": "vite",
    "dev:alipay-sandbox": "node scripts/alipay-webpay-sandbox-server.mjs",
    "prebuild": "npm run generate:site-data && npm run generate:style-skill",
    "build": "vite build",
    "preview": "vite preview",
```

</details>

#### 缺口

- 未验证使用效率
  **影响**：不能量化创作节省
  **进一步探讨**：比较按主题寻找合适模板的耗时

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 风格参考怎样从模板生成？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

脚本读取风格库，检查类别、样式、场景和模板键唯一，并验证模板锚点及图片存在，随后输出参考。它能减少断链和重复键，不检查图片质量、许可证或提示语义。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/generate-style-skill.mjs:37-74](https://github.com/freestylefly/awesome-gpt-image-2/blob/53d3927ee3c45f6c54a12d86aabcf5c921670e11/scripts/generate-style-skill.mjs#L37-L74)

完整性检查

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
}
```

</details>

**依据 2 · 源码核查**：[scripts/generate-style-skill.mjs:159-169](https://github.com/freestylefly/awesome-gpt-image-2/blob/53d3927ee3c45f6c54a12d86aabcf5c921670e11/scripts/generate-style-skill.mjs#L159-L169)

生成参考

<details>
<summary>查看原文（11行）</summary>

```text
  const output = `${lines.join('\n')}\n`;
  assertNoPattern(output, 'generated style-library reference');
  return output;
}

const library = readJson(libraryFile);
validateLibrary(library);
const reference = renderReference(library);
mkdirSync(dirname(referenceFile), { recursive: true });
writeFileSync(referenceFile, reference);
console.log(`Generated GPT-Image2 style skill reference at ${referenceFile}`);
```

</details>

#### 缺口

- 未执行生成
  **影响**：当前产物一致性未验
  **进一步探讨**：只读对照模板和参考

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 2.5 复刻能作为模型对照吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

复刻页将图库原图与一张新图放在一起，记录说明提示词复用且无参考图，但原图模型和条件未知，新图具体模型 ID、质量和费用未返回。比较仅能观察这对样本，不能归因给确定模型或推断稳定质量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:25-31](https://github.com/freestylefly/awesome-gpt-image-2/blob/53d3927ee3c45f6c54a12d86aabcf5c921670e11/README.md#L25-L31)

作者标注条件

```text
[Explore the 2.5 spotlight](https://gpt-image2.canghe.ai/gpt-image-2-5/?lang=en): learn about Sunburst and Flare, then explore a shared-prompt comparison with a draggable divider, side-by-side view, image enlargement, and generation settings.

- [Sunburst](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst): image generation and precise editing.
- [Flare](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare): fast, high-quality everyday image generation.
- **4 real recreations**: [#532 lemon campaign](https://gpt-image2.canghe.ai/gpt-image-2-5/?lang=en&case=gallery-532-test), [#527 Rio diorama](https://gpt-image2.canghe.ai/gpt-image-2-5/?lang=en&case=gallery-527-test), [#523 Manhattan watercolor](https://gpt-image2.canghe.ai/gpt-image-2-5/?lang=en&case=gallery-523-test), and [#510 Bichon Shop icon](https://gpt-image2.canghe.ai/gpt-image-2-5/?lang=en&case=gallery-510-test). Each preserves its original gallery image and uses the full gallery prompt for one new built-in image generation, without a reference image. A case selector opens any example directly. [Images, prompts and generation records](docs/design/gpt-image-2-5/real-cases.md). Original generation conditions and exact tool model IDs remain unverified; demonstration examples are labeled separately.

The spotlight runs independently. Existing GPT-Image2 cases, templates, Skill, and generation tools remain available. This update does not add live 2.5 image generation.
```

**依据 2 · 源码核查**：[src/image25/additionalCases.js:11-42](https://github.com/freestylefly/awesome-gpt-image-2/blob/53d3927ee3c45f6c54a12d86aabcf5c921670e11/src/image25/additionalCases.js#L11-L42)

页面展示输入、样本与未知项

<details>
<summary>查看原文（32行）</summary>

```text
function recreation(input, record, image, content) {
  const dimensions = value => `${value.width} × ${value.height}`;
  return {
    id: `gallery-${input.caseId}-test`,
    title: content.title,
    prompt: input.prompt,
    image: `/images/case${input.caseId}.jpg`,
    alt: { zh: `图库原图：${input.title}`, en: `Gallery original: ${content.title.en}` },
    source: { zh: `案例 #${input.caseId} · ${content.sourceLabel}`, en: `Case #${input.caseId} · ${content.sourceLabel}` },
    sourceUrl: input.source,
    focus: content.focus,
    result: {
      caseId: input.caseId,
      image,
      label: { zh: 'GPT 2.5', en: 'GPT 2.5' },
      alt: { zh: `本次生成：${input.title}`, en: `New generation: ${content.title.en}` },
      summary: content.summary,
      modelNote: {
        zh: '本次使用 Codex 内置生图。工具未返回具体型号、质量档位或费用。',
        en: 'Generated with the built-in Codex image tool. The exact model, quality setting and cost were not returned.'
      },
      parameters: {
        zh: [
          { label: '生成日期', value: record.date },
          { label: '输入', value: `站内案例 #${input.caseId} 完整 Prompt；未改写；无参考图` },
          { label: '样本', value: '首次生成 1 张；保留原始结果' },
          { label: '原图尺寸', value: dimensions(record.sourceDimensions) },
          { label: '本次输出', value: dimensions(record.outputDimensions) },
          { label: '调用等待', value: `约 ${record.approximateCallWallClockSeconds} 秒（含队列与传输）` },
          { label: '模型与质量档位', value: 'Codex 内置生图；具体 ID 与档位未返回' },
          { label: '费用', value: '工具未返回' },
          { label: '原图生成条件', value: '来源为站内案例；原始模型 ID、输入与设置未独立核验' }
```

</details>

#### 缺口

- 缺同模型多次运行
  **影响**：不能给出模型排名
  **进一步探讨**：固定模型与参数后做多种子对照

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何采用而不依赖在线生成？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先从固定页面或模板读样例，复制后按自己的目标和授权改写。无需运行仓库或接到 DSH；若使用生成服务，凭据、生成费用和参考图去向另行核对。若案例出处不清，改用自己的结构化提示词。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-41](https://github.com/freestylefly/awesome-gpt-image-2/blob/53d3927ee3c45f6c54a12d86aabcf5c921670e11/README.md#L39-L41)

浏览和生成条件不同

```text
## 🌐 Visual Website

Use the live site at [gpt-image2.canghe.ai](https://gpt-image2.canghe.ai/) to browse the gallery as a product experience: open large previews, copy full prompts, filter by style or scenario, test generation after Google sign-in, and jump back to the source case on GitHub.
```

**依据 2 · 源码核查**：[package.json:6-18](https://github.com/freestylefly/awesome-gpt-image-2/blob/53d3927ee3c45f6c54a12d86aabcf5c921670e11/package.json#L6-L18)

站点与参考脚本

<details>
<summary>查看原文（13行）</summary>

```text
  "scripts": {
    "generate:site-data": "node scripts/generate-site-data.mjs",
    "generate:style-skill": "node scripts/generate-style-skill.mjs",
    "ga4:oauth": "node scripts/google-analytics-oauth.mjs",
    "install:skill": "node scripts/install-style-skill.mjs",
    "pack:skill": "npm pack ./agents/skills/gpt-image-2-style-library --dry-run",
    "publish:skill:npm": "npm publish ./agents/skills/gpt-image-2-style-library --access public",
    "predev": "npm run generate:site-data && npm run generate:style-skill",
    "dev": "vite",
    "dev:alipay-sandbox": "node scripts/alipay-webpay-sandbox-server.mjs",
    "prebuild": "npm run generate:site-data && npm run generate:style-skill",
    "build": "vite build",
    "preview": "vite preview",
```

</details>

#### 缺口

- 未运行模型或站点
  **影响**：实际服务条件和成本未知
  **进一步探讨**：用获准素材核对可复现性

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 分类模板能提高一次合格率吗？

**研究主题**：新假设与验证

#### 完整回答

给创作者同一品牌规格，比较自由提示词和从库中选模板两组，固定模型、参数与样本数。评估盲选合格率、调整次数与版权审阅，若改善不足则使用原流程。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/generate-style-skill.mjs:148-168](https://github.com/freestylefly/awesome-gpt-image-2/blob/53d3927ee3c45f6c54a12d86aabcf5c921670e11/scripts/generate-style-skill.mjs#L148-L168)

参考区分样式场景

<details>
<summary>查看原文（21行）</summary>

```text
    lines.push(`- ${style.value}: ${label(style.title, 'zh')} | Keywords: ${list(style.keywords)}`);
  }
  lines.push('');

  lines.push('## Scenes');
  lines.push('');
  for (const scene of library.scenes) {
    lines.push(`- ${scene.value}: ${label(scene.title, 'zh')} | Keywords: ${list(scene.keywords)}`);
  }
  lines.push('');

  const output = `${lines.join('\n')}\n`;
  assertNoPattern(output, 'generated style-library reference');
  return output;
}

const library = readJson(libraryFile);
validateLibrary(library);
const reference = renderReference(library);
mkdirSync(dirname(referenceFile), { recursive: true });
writeFileSync(referenceFile, reference);
```

</details>

**依据 2 · 源码核查**：[src/image25/additionalCases.js:32-42](https://github.com/freestylefly/awesome-gpt-image-2/blob/53d3927ee3c45f6c54a12d86aabcf5c921670e11/src/image25/additionalCases.js#L32-L42)

现有单样本条件

<details>
<summary>查看原文（11行）</summary>

```text
      parameters: {
        zh: [
          { label: '生成日期', value: record.date },
          { label: '输入', value: `站内案例 #${input.caseId} 完整 Prompt；未改写；无参考图` },
          { label: '样本', value: '首次生成 1 张；保留原始结果' },
          { label: '原图尺寸', value: dimensions(record.sourceDimensions) },
          { label: '本次输出', value: dimensions(record.outputDimensions) },
          { label: '调用等待', value: `约 ${record.approximateCallWallClockSeconds} 秒（含队列与传输）` },
          { label: '模型与质量档位', value: 'Codex 内置生图；具体 ID 与档位未返回' },
          { label: '费用', value: '工具未返回' },
          { label: '原图生成条件', value: '来源为站内案例；原始模型 ID、输入与设置未独立核验' }
```

</details>

#### 缺口

- 无对照数据
  **影响**：收益待测
  **进一步探讨**：开展固定模型的盲评

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
