# Awesome GPT-Image2

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[0ebea1f](https://github.com/freestylefly/awesome-gpt-image-2/tree/0ebea1f83ccdc6b06def3ce3ee51ad42ec53daf3)

<!-- BEGIN META -->
[![GitHub ★ 35,670](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35%2C670&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/freestylefly/awesome-gpt-image-2)
<!-- END META -->

> **功能**：收录 GPT-Image2 画廊案例和工业提示词模板，并提供辅助选择模板与风格的 Skill。

> **亮点**：[Q01](#research-q01) 将按类别选例、提示词分块和案例号交接连成一条可查路径，便于编辑复用构图与文案约束。

> **主要限制**：[Q02](#research-q02) 专题的复刻只给出单次结果，原图条件和工具返回模型 ID 缺失限制了模型归因。

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
  - [Q01 · 相比个人收藏或直接写提示词，模板和案例怎样帮助编辑交付一份能复用的简报？](#detail-section-11)
  - [Q02 · 复刻专区怎样选择样例，能否由此判断两个模型的质量差异？](#detail-section-12)
  - [Q03 · 只读参考、安装 Skill 与实际生成各依赖什么，如何回退和估算每份合格简报的代价？](#detail-section-13)
  - [Q04 · 怎样判定模板参考值得保留，并检验来源标记能否改善使用判断？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常制作商品海报和活动视觉的编辑可以查找模板、保留案例号并交接一份待审阅的提示词。

团队现有简报或个人收藏已经可以约束文字与版式。这里增加按类别、风格、场景和案例选择参照的路径，收益取决于原有参考资产是否足够。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 图像风格参考 | 找构图和文案约束相近的案例 | 输出需要由编辑复核 |
| 同提示词案例对照 | 查看原图、复刻图或示意图及其说明 | 单次样例和未知模型标识限制归因 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 固定提交的案例和模板 | 只读试用需要 | 找参照并保留引用 | 使用团队原简报 |
| 支持读取 Skill 的宿主 | 自动选例时需要 | 载入 Skill 与索引 | 人工浏览模板 |
| 图像生成环境和相应权限 | 要交付图稿时需要 | 将改写后的提示词用于出图 | 只交提示词供审阅 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 选择 | 编辑按用途选择一个模板和相近案例 | 案例号与来源可找回 |
| 改写 | 编辑填入自有商品文字、画幅与构图限制 | 审稿人能逐项核对，无关示例细节可去掉 |
| 审阅 | 审稿人用原简报标准复核 | 约束遗漏或返工变多时退回原流程 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 只读路径不触发生图 | 选例、改写及核对 | 首次耗时未知 |
| 持续 | 实际生图与重试费用取决于模型 | 检查模板是否仍匹配品牌简报 | 重试频率未知 |
| 失败恢复 | 若已生图，另计重试资源 | 回原文手工复制或回原简报 | 安装前另行备份同名技能目录 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 提示词交接 | Skill 指定分块并建议带案例号 | 字段缺漏率和耗时是否降低 |
| 案例差异检查 | 页面可按案例展示原图、复刻或示意，并查看参数说明 | 同条件下各模型输出质量 |

> **思考**：[Q02](#research-q02) 专题的复刻只给出单次结果，原图条件和工具返回模型 ID 缺失限制了模型归因。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将按类别选例、提示词分块和案例号交接连成一条可查路径，便于编辑复用构图与文案约束。

生成器核验分类与模板标识、锚点和封面；专题以结果对象有无决定说明类型。安装脚本覆盖原目录前没有备份步骤。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 专题的复刻只给出单次结果，原图条件和工具返回模型 ID 缺失限制了模型归因。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用一份商品海报简报对比两种写法，再按文案、比例、构图和返工次数决定是否继续参考。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查模板选择、索引生成、复刻结果展示与技能安装脚本。提示词复用效果与模型归因仍需各自的对照证据。

- 已检查：作者 README、包清单、源码路径 agents/skills/gpt-image-2-style-library/SKILL.md、scripts/generate-style-skill.mjs、src/image25/App.jsx、docs/design/gpt-image-2-5/case532-test-record.json、docs/design/gpt-image-2-5/real-cases.md、agents/skills/gpt-image-2-style-library/bin/install.mjs、.claude-plugin/marketplace.json、gpt-image-2-5/index.html、src/image25/main.jsx 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本只读核查集中在案例库参考、技能安装及专题前端；不据此判断线上生图服务、宿主加载、模型结果或购买成本。
- 下一步：以现有简报为对照，先检查提示词字段缺漏与返工；模型判断另使用记录模型 ID、输入和设置的多次配对生成。

**分析版本**

- **仓库**：[freestylefly/awesome-gpt-image-2](https://github.com/freestylefly/awesome-gpt-image-2)
- **版本号**：1.0.0（[固定提交 0ebea1f](https://github.com/freestylefly/awesome-gpt-image-2/tree/0ebea1f83ccdc6b06def3ce3ee51ad42ec53daf3)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 图片旁直接标出未知模型与原图条件，可能减少将复刻误读为版本排名的情况，需用归因题和提示词查找任务验证。

以现有简报为对照，先检查提示词字段缺漏与返工；模型判断另使用记录模型 ID、输入和设置的多次配对生成。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 7 | 928 | 827 | 8 | — |
| .md | source | 14 | 23856 | — | — | 206478 |
| .js | source | 51 | 5980 | 5363 | 23 | — |
| .js | test | 7 | 920 | 846 | 31 | — |
| .ts | source | 1 | 76 | 56 | 8 | — |
| .jsx | source | 4 | 5196 | 4895 | 9 | — |

</details>

**活跃度**

[![Issue 未关闭 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=14&color=737b86&logo=github)](https://github.com/freestylefly/awesome-gpt-image-2/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/freestylefly/awesome-gpt-image-2/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/freestylefly/awesome-gpt-image-2/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：需要反复制作商业图的编辑，能否用这个画廊和风格参考稳定交付一份可审核的提示词，复刻专区的结果对选择模板或模型各能提供什么依据？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相比个人收藏或直接写提示词，模板和案例怎样帮助编辑交付一份能复用的简报？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

负责反复交付商品广告概念图或海报的编辑，可以从类别和案例出发，把一段任务描述拆成构图、材质、可见文字、比例与排除项，并把所用模板和案例号随交稿交给同事。合格的提示词应让同事找到所用构图依据，读出必须保留的商品文案和画幅，并能换掉主体后复用。个人收藏也能提供视觉参照，差别在于资源把选例和交接字段放进同一套参考：仓库的库数据生成 Skill 所读索引，Skill 先匹配任务类别，再看风格、场景和相邻案例，然后提示输出这些区块。它提供写作指令，成品是否遵循字段仍由宿主输出与人工检查决定。已有完整品牌简报模板的小组可能只需要其中个别案例。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:76-93](https://github.com/freestylefly/awesome-gpt-image-2/blob/0ebea1f83ccdc6b06def3ce3ee51ad42ec53daf3/README.md#L76-L93)

作者说明将案例转成可复用的提示词结构，并给出图库、模板及 Skill 入口。

<details>
<summary>查看原文（18行）</summary>

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
- [MIT License](LICENSE)
```

</details>

**依据 2 · 源码核查**：[agents/skills/gpt-image-2-style-library/SKILL.md:18-35](https://github.com/freestylefly/awesome-gpt-image-2/blob/0ebea1f83ccdc6b06def3ce3ee51ad42ec53daf3/agents/skills/gpt-image-2-style-library/SKILL.md#L18-L35)

选例顺序、字段区块与案例号交接来自 Skill 文本。

<details>
<summary>查看原文（18行）</summary>

```text
- Read `references/style-library.md` before choosing a template or style.
- The reference is generated from `data/style-library.json` in the repository.
- Prefer the reference over memory when template names, categories, covers, or style tags matter.

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
```

</details>

**依据 3 · 源码核查**：[scripts/generate-style-skill.mjs:164-168](https://github.com/freestylefly/awesome-gpt-image-2/blob/0ebea1f83ccdc6b06def3ce3ee51ad42ec53daf3/scripts/generate-style-skill.mjs#L164-L168)

脚本读取结构化库、验证、渲染并写出参考文档。

```text
const library = readJson(libraryFile);
validateLibrary(library);
const reference = renderReference(library);
mkdirSync(dirname(referenceFile), { recursive: true });
writeFileSync(referenceFile, reference);
```

#### 缺口

- 缺少编辑使用现有简报与该资源的配对任务记录。
  **影响**：无法量化选例耗时、返工变化或模板在相近任务间的迁移效果。
  **进一步探讨**：让同一组编辑分别使用现有收藏和固定模板，记录交稿字段缺漏及审阅退回原因。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 复刻专区怎样选择样例，能否由此判断两个模型的质量差异？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

专题页可以用于观察同一公开提示词下的构图差异和可见文案，现有样例无法归因模型版本的质量差异。前端从网址参数读案例 ID，以已导入的对比案例对象决定真实复刻或示意说明；参数弹窗对复刻展示该结果已登记的参数和模型说明，对示意内容展示未实测状态。标签选择或拖动对照属于呈现动作。以 #532 为例，作者记录只有一张用完整提示词新生成的图，原图生成参数未验证，工具返回模型、质量及费用字段为空，原图与新图画幅也不同。源案例可提供观察线索，不能控制随机种子、画幅、参考图或上游条件。即使读者能明确看见网格或文案差异，这些条件仍可能解释差异。

#### 证据与依据

**依据 1 · 源码核查**：[src/image25/App.jsx:53-77](https://github.com/freestylefly/awesome-gpt-image-2/blob/0ebea1f83ccdc6b06def3ce3ee51ad42ec53daf3/src/image25/App.jsx#L53-L77)

网址参数选定静态案例，显示状态由案例是否有 result 决定。

<details>
<summary>查看原文（25行）</summary>

```text
function initialState() {
  const params = new URLSearchParams(window.location.search);
  return { language: params.get('lang') === 'en' ? 'en' : 'zh', caseIndex: Math.max(0, comparisonCases.findIndex(item => item.id === params.get('case'))) };
}

export default function App() {
  const [initial] = useState(initialState);
  const [language, setLanguage] = useState(initial.language);
  const [caseIndex, setCaseIndex] = useState(initial.caseIndex);
  const [model, setModel] = useState('sunburst');
  const [view, setView] = useState(comparisonCases[initial.caseIndex].result ? 'side' : 'slider');
  const [position, setPosition] = useState(50);
  const [copyState, setCopyState] = useState('');
  const [modal, setModal] = useState(null);
  const dialogRef = useRef(null);
  const copyTimer = useRef(null);
  const t = text[language];
  const item = comparisonCases[caseIndex];
  const modelName = model === 'sunburst' ? 'Sunburst' : 'Flare';
  const result = item.result;
  const notice = result ? t.testNotice : t.demoNotice;
  const explanation = result ? t.testExplanation : t.demoExplanation;
  const beforeLabel = 'GPT 2.0';
  const afterLabel = result ? result.label[language] : `GPT 2.5 · ${modelName}`;
  const sourceCaseId = result?.caseId || item.sourceCaseId;
```

</details>

**依据 2 · 源码核查**：[src/image25/App.jsx:184-189](https://github.com/freestylefly/awesome-gpt-image-2/blob/0ebea1f83ccdc6b06def3ce3ee51ad42ec53daf3/src/image25/App.jsx#L184-L189)

弹窗根据结果状态展示参数记录或未实测信息。

```text
    <dialog className={`image25-dialog ${modal === 'images' ? 'image25-dialog-images' : ''}`} ref={dialogRef} aria-labelledby="image25-dialog-title" onCancel={() => setModal(null)} onClick={event => { if (event.target === event.currentTarget) setModal(null); }}>
      <div className="image25-dialog-inner"><header><h2 id="image25-dialog-title">{modal === 'images' ? item.title[language] : t.params}</h2><button autoFocus type="button" className="image25-icon-button" onClick={() => setModal(null)} aria-label={t.close}><X size={23} /></button></header>
        {modal === 'images' ? <><p className="image25-modal-notice">{notice}</p><div className="image25-enlarged">{picture(beforeLabel, 'before')}{picture(afterLabel, 'after')}</div></> : result ? <>
          <p className="image25-modal-notice">{explanation}</p><dl>{result.parameters[language].map(row => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl><p className="image25-methodology">{result.modelNote[language]}</p>
        </> : <>
          <p className="image25-modal-notice">{t.demoExplanation}</p><dl><div><dt>{t.status}</dt><dd>{t.pending}</dd></div><div><dt>{t.model}</dt><dd>gpt-image-2<br />gpt-image-2.5-{model}</dd></div><div><dt>{t.settings}</dt><dd>{t.notRecorded}</dd></div><div><dt>{t.source}</dt><dd>{item.source[language]}</dd></div></dl><p className="image25-methodology">{t.methodology}</p><a className="image25-doc-link" href={modelDocs[model]} target="_blank" rel="noreferrer">{t.modelDetails}<ArrowUpRight size={16} /></a>
```

**依据 3 · 作者声明**：[docs/design/gpt-image-2-5/case532-test-record.json:5-27](https://github.com/freestylefly/awesome-gpt-image-2/blob/0ebea1f83ccdc6b06def3ce3ee51ad42ec53daf3/docs/design/gpt-image-2-5/case532-test-record.json#L5-L27)

作者记录原图条件、一次采样及未知模型字段，画幅和计时有明确边界。

<details>
<summary>查看原文（23行）</summary>

```text
  "sourceImage": "data/images/case532.jpg",
  "sourceDimensions": {
    "width": 3277,
    "height": 4096
  },
  "sourceGenerationParametersVerified": false,
  "inputPromptPath": "docs/design/gpt-image-2-5/case532-test-input.json",
  "promptModified": false,
  "referenceImages": [],
  "sampleCount": 1,
  "tool": "image_gen.imagegen",
  "userStatedModel": "GPT Image 2.5",
  "toolReportedModel": null,
  "toolReportedQuality": null,
  "toolReportedCost": null,
  "startedAt": "2026-09-09T01:44:03.991Z",
  "finishedAt": "2026-09-09T01:46:15.733Z",
  "approximateCallWallClockSeconds": 132,
  "durationNote": "Wall-clock wait includes orchestration, queueing and transfer; not an isolated inference benchmark.",
  "outputImage": "src/assets/image25-case532-run1.png",
  "outputDimensions": {
    "width": 1024,
    "height": 1536
```

</details>

**依据 4 · 作者声明**：[docs/design/gpt-image-2-5/real-cases.md:12-18](https://github.com/freestylefly/awesome-gpt-image-2/blob/0ebea1f83ccdc6b06def3ce3ee51ad42ec53daf3/docs/design/gpt-image-2-5/real-cases.md#L12-L18)

作者把结果限定为单次视觉观察。

```text
本次新增的观察：

- #527：票据、基督像、黄色出租车和纸质底座完整，街道立面更醒目，周边注记更密集。
- #523：石桥与池塘变成更明显的前景，树木覆盖更满，保留水彩与钢笔风格和无字画面。
- #510：单个圆角图标与白底留白保留，毛发、绳把和纸袋材质更细，底色与品牌字体变化明显。

这些是单次结果的视觉观察。原图生成条件未独立核验，工具未返回具体模型 ID、质量档位或费用。
```

#### 缺口

- 原图模型、生成设置和新图确切模型 ID 未核验。
  **影响**：无法把对照图差异归因到 Sunburst、Flare 或不同世代的模型。
  **进一步探讨**：用可记录模型 ID 和参数的入口，以相同画幅、输入和设置进行多次配对生成，盲评提示词约束满足率。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 只读参考、安装 Skill 与实际生成各依赖什么，如何回退和估算每份合格简报的代价？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

最短路径是读固定版本的案例和模板，编辑自己完成提示词改写，无须运行项目脚本。专题复制按钮调用浏览器剪贴板，异常只显示失败，仍可从原始文档读取。自动选例需要宿主识别 Skill 和参考文件；安装器支持多目标并默认全选，目标是对应宿主配置下的技能目录。它先删除同名技能目录再复制，既有本地改动可能丢失，复制中断也可能留下不完整目录。需要保留定制内容时，可继续只读参考，或在独立目标备份后再试。维护侧生成器检查唯一键、锚点和封面存在性，这有助于发现坏链接，提示词效果仍需另验。每份合格简报应计入挑选、改写、检查与返工的人工时间；若交付要求包含图稿，还需单列每次生成及重试的模型费用，现有单次复刻记录不足以测得这些成本。

#### 证据与依据

**依据 1 · 源码核查**：[src/image25/App.jsx:99-104](https://github.com/freestylefly/awesome-gpt-image-2/blob/0ebea1f83ccdc6b06def3ce3ee51ad42ec53daf3/src/image25/App.jsx#L99-L104)

复制直接写剪贴板，捕获异常后更新失败状态。

```text
  async function copyPrompt() {
    clearTimeout(copyTimer.current);
    try { await navigator.clipboard.writeText(item.prompt); setCopyState('copied'); }
    catch { setCopyState('failed'); }
    copyTimer.current = setTimeout(() => setCopyState(''), 2500);
  }
```

**依据 2 · 源码核查**：[agents/skills/gpt-image-2-style-library/bin/install.mjs:32-46](https://github.com/freestylefly/awesome-gpt-image-2/blob/0ebea1f83ccdc6b06def3ce3ee51ad42ec53daf3/agents/skills/gpt-image-2-style-library/bin/install.mjs#L32-L46)

安装目标分别位于 Codex、Claude Code 和共享技能根目录。

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

**依据 3 · 源码核查**：[agents/skills/gpt-image-2-style-library/bin/install.mjs:64-89](https://github.com/freestylefly/awesome-gpt-image-2/blob/0ebea1f83ccdc6b06def3ce3ee51ad42ec53daf3/agents/skills/gpt-image-2-style-library/bin/install.mjs#L64-L89)

默认选择所有目标，先递归删除原目录再复制文件。

<details>
<summary>查看原文（26行）</summary>

```text
function selectedTargets(rawTargets) {
  const names = rawTargets.length ? rawTargets : ['all'];
  const selected = new Set();

  for (const name of names) {
    const normalized = name.toLowerCase();
    const matches = targetAliases[normalized];
    if (!matches) {
      console.error(usage);
      throw new Error(`Unknown target: ${name}`);
    }
    for (const match of matches) selected.add(match);
  }

  return [...selected].map((name) => targetDefinitions[name]);
}

for (const targetDefinition of selectedTargets(targetArgs)) {
  const target = join(targetDefinition.root, skillName);
  mkdirSync(targetDefinition.root, { recursive: true });
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });

  for (const entry of entries) {
    cpSync(join(packageRoot, entry), join(target, entry), { recursive: true });
  }
```

</details>

**依据 4 · 源码核查**：[scripts/generate-style-skill.mjs:37-73](https://github.com/freestylefly/awesome-gpt-image-2/blob/0ebea1f83ccdc6b06def3ce3ee51ad42ec53daf3/scripts/generate-style-skill.mjs#L37-L73)

维护者生成参考前验证键、锚点和封面，不评估图像质量。

<details>
<summary>查看原文（37行）</summary>

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

#### 缺口

- 未获得多人交付任务的人工计时与重试分布。
  **影响**：无法估算每份合格简报的总投入。
  **进一步探讨**：按阶段记录任务耗时，图稿交付再单列每次生成账单。
- 未在目标宿主安装或执行。
  **影响**：安装成功与当前宿主识别尚无实际结果。
  **进一步探讨**：在隔离宿主目录验收发现、执行和退出。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样判定模板参考值得保留，并检验来源标记能否改善使用判断？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可试用的任务是为一次商品海报交付带画幅、标题文案和构图约束的提示词。先用现有模板完成一个版本，再用案例库选一份相近模板完成另一版本，由同事在看不到来源的情况下检查字段完整度、改写轮次和能否复用。若缺少品牌约束、反复需要删改不相关的示例细节，或审阅总时间增加，就继续使用团队原简报。页面已经区分示意图与复刻，参数却需要打开弹窗。由此可提出待验证的方向：把“原图条件未知”和“工具未报告模型 ID”放到图片旁边，或能减少读者把单次复刻理解为模型排名的次数。给读者随机分配两种标注布局，问哪一种证据可支持模型归因，并记录正确答题率和定位原提示词的时间。若误判未减少，或找提示词明显变慢，这个标注改动的收益不足。

#### 证据与依据

**依据 1 · 源码核查**：[agents/skills/gpt-image-2-style-library/SKILL.md:24-35](https://github.com/freestylefly/awesome-gpt-image-2/blob/0ebea1f83ccdc6b06def3ce3ee51ad42ec53daf3/agents/skills/gpt-image-2-style-library/SKILL.md#L24-L35)

案例号和分块输出可作为两份简报共同的审核字段。

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[src/image25/App.jsx:70-77](https://github.com/freestylefly/awesome-gpt-image-2/blob/0ebea1f83ccdc6b06def3ce3ee51ad42ec53daf3/src/image25/App.jsx#L70-L77)

页面已有结果类别，展示标签仍可包含模型名。

```text
  const item = comparisonCases[caseIndex];
  const modelName = model === 'sunburst' ? 'Sunburst' : 'Flare';
  const result = item.result;
  const notice = result ? t.testNotice : t.demoNotice;
  const explanation = result ? t.testExplanation : t.demoExplanation;
  const beforeLabel = 'GPT 2.0';
  const afterLabel = result ? result.label[language] : `GPT 2.5 · ${modelName}`;
  const sourceCaseId = result?.caseId || item.sourceCaseId;
```

**依据 3 · 源码核查**：[src/image25/App.jsx:184-189](https://github.com/freestylefly/awesome-gpt-image-2/blob/0ebea1f83ccdc6b06def3ce3ee51ad42ec53daf3/src/image25/App.jsx#L184-L189)

参数与模型说明在弹窗内，构成可比较的信息位置。

```text
    <dialog className={`image25-dialog ${modal === 'images' ? 'image25-dialog-images' : ''}`} ref={dialogRef} aria-labelledby="image25-dialog-title" onCancel={() => setModal(null)} onClick={event => { if (event.target === event.currentTarget) setModal(null); }}>
      <div className="image25-dialog-inner"><header><h2 id="image25-dialog-title">{modal === 'images' ? item.title[language] : t.params}</h2><button autoFocus type="button" className="image25-icon-button" onClick={() => setModal(null)} aria-label={t.close}><X size={23} /></button></header>
        {modal === 'images' ? <><p className="image25-modal-notice">{notice}</p><div className="image25-enlarged">{picture(beforeLabel, 'before')}{picture(afterLabel, 'after')}</div></> : result ? <>
          <p className="image25-modal-notice">{explanation}</p><dl>{result.parameters[language].map(row => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl><p className="image25-methodology">{result.modelNote[language]}</p>
        </> : <>
          <p className="image25-modal-notice">{t.demoExplanation}</p><dl><div><dt>{t.status}</dt><dd>{t.pending}</dd></div><div><dt>{t.model}</dt><dd>gpt-image-2<br />gpt-image-2.5-{model}</dd></div><div><dt>{t.settings}</dt><dd>{t.notRecorded}</dd></div><div><dt>{t.source}</dt><dd>{item.source[language]}</dd></div></dl><p className="image25-methodology">{t.methodology}</p><a className="image25-doc-link" href={modelDocs[model]} target="_blank" rel="noreferrer">{t.modelDetails}<ArrowUpRight size={16} /></a>
```

**依据 4 · 作者声明**：[docs/design/gpt-image-2-5/case532-test-record.json:36-44](https://github.com/freestylefly/awesome-gpt-image-2/blob/0ebea1f83ccdc6b06def3ce3ee51ad42ec53daf3/docs/design/gpt-image-2-5/case532-test-record.json#L36-L44)

作者记录给出明确的模型归因边界和展示标签来源。

```text
  "interpretation": "One new generation compared with an existing gallery image using its documented prompt. Original generation settings and actual model IDs are unverified, so this is not a controlled model benchmark.",
  "promptSha256": "fb302b56879b7f824d551b1f7b6d87135fffab5b34635b24301102c65ead3e17",
  "outputSha256": "e79583d6003f3b01e62166ae5cb95e2020ed348d5a924e7af9e321ae8d39dc80",
  "sourceImageSha256": "da0294912cd02ddc180aadb419095c9d72e06fd90f5f002c76869c461a9905c9",
  "displayLabels": {
    "left": "GPT 2.0",
    "right": "GPT 2.5",
    "basis": "Project owner requested these display labels. Original tool-reported model metadata remains unchanged."
  }
```

#### 缺口

- 没有观察用户如何理解页面标签。
  **影响**：标注位置能否减少误判仍不确定。
  **进一步探讨**：比较现行弹窗和图片旁标注，检查归因题与查找任务的结果。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
