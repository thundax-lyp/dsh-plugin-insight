# Claude Paper

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[0af55d0](https://github.com/alaliqing/claude-paper/tree/0af55d0daeae8e86571700fd1839feb6be9440a6)

<!-- BEGIN META -->
[![GitHub ★ 353](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=353&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/alaliqing/claude-paper) [![npm 30d 307](https://img.shields.io/static/v1?label=npm+30d&message=307&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zlzliqing/claude-paper) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zlzliqing/claude-paper)
<!-- END META -->

> **功能**：跨宿主论文阅读 Skill 组合：下载解析 PDF，生成摘要或学习材料，并以本地网页库组织笔记。

> **亮点**：完整文本与截断元数据分离，摘要/深读规范和目录复用，见 [Q01](#research-q01)。

> **主要限制**：生成材料不等原文/理解验收；Viewer有未净化主动内容、词法路径和非事务删除边界，安装标志也不证明依赖全就绪，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 跨宿主论文功能是原生插件还是Skill，产出链真实在哪里？](#detail-section-11)
  - [Q02 · 本地文件和网页库的写入、渲染、删除边界是什么？](#detail-section-12)
  - [Q03 · 怎样有限采用，哪些丰富材料不能当论文理解证明？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：筛论文/深读论文的研究者，把PDF与笔记按目录索引归档；宿主模型负责理解，见 [Q01](#research-q01)。

原PDF+人工摘要/普通Markdown目录。当前增加解析和学习产出规范、浏览库，不自动证明知识正确。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 摘要/深读 | 模型论文学习材料 | 原文核实，非准确保证 |
| PDF脚本 | 完整text/meta | 提取顺序/图表仍需核 |
| Web库 | 本地查看/标签/删除 | 有写入/主动渲染，另验防护 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 宿主Skill与shell/文件 | 必需 | 执行阅读工作流 | 无自动模型笔记 |
| Node/npm/pdf-parse | PDF解析必需 | 提取全文 | 需核版本，标志不够 |
| Python/PyMuPDF | 图片可选 | 提取图像 | pip失败可仍标installed |
| ~/claude-papers及写权限 | 归档必需 | 原文/笔记/index | 覆写/并发需人工核 |
| Nuxt/loopback服务 | Viewer可选 | 渲染/改删 | 非只读库，需防护 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 安装 | 用户核adapter/依赖 | 不凭installed推齐备 |
| 解析 | PDF脚本产全文/meta | 核原文/页表/扫描件 |
| 笔记 | 模型生成并改index | 人工逐条核主张/数字 |
| 浏览 | 可选本地Web库 | 先核路径/主动内容/删除 |
| 退出 | 停自身服务/保备份 | 分管Skill与论文库 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Node/Python/模型未知 | 装adapter/依赖与一篇原文核对 | pip用户写入非无成本 |
| 持续使用 | 长文token/PDF图片未知 | 查错漏/index/版本 | 无学习收益对照 |
| 失败恢复 | 重解析/备份未知 | 修meta/text与index目录 | 多文件非事务 |
| 退出 | 论文库/依赖留存未知 | 停服务，分管笔记/包 | 删除需备份 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 文本 | 完整paper.txt可读 | PDF抽取准确/页表关联 |
| 学习 | 摘要/问答/演示规范 | 理解/忠实/复现实验 |
| 整理 | 本地目录/Web库 | 安全/恢复/净节时 |

> **思考**：生成材料不等原文/理解验收；Viewer有未净化主动内容、词法路径和非事务删除边界，安装标志也不证明依赖全就绪，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：完整文本与截断元数据分离，摘要/深读规范和目录复用，见 [Q01](#research-q01)。

[Q01](#research-q01) 全文独立产物避免meta截断；[Q02](#research-q02) 主动内容/路径与索引删除一致性是Viewer独立工程问题。

<a id="detail-section-5"></a>

### 1.4 主要限制

生成材料不等原文/理解验收；Viewer有未净化主动内容、词法路径和非事务删除边界，安装标志也不证明依赖全就绪，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

一篇公开PDF的summary对照人工原文，study/Web库逐步另验；依赖和资料都备份，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定Skill与PDF/Viewer代码已核，建议公开PDF的summary有限试用；深读效果与Viewer防护未验收。

- 已检查：作者 README、包清单、源码路径 .agents/skills/claude-paper-study/SKILL.md、.agents/skills/claude-paper-summary/SKILL.md、.agents/skills/claude-paper-webui/SKILL.md、bin/claude-paper.mjs、package.json、plugin/skills/study/scripts/parse-pdf-core.js、plugin/skills/study/scripts/parse-pdf.js、plugin/src/web/pages/papers/[slug].vue、plugin/src/web/server/api/papers/[slug]/delete.delete.ts、plugin/src/web/server/api/papers/[slug]/file.get.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：四材料固定身份一致、catalog无旧研究；读跨宿主Skill、bin、parse/core、代表Viewer文件/删除/渲染与启动。排除vendor node_modules、未全审下载器/adapter写入/所有组件与演示，不执行目标。
- 下一步：未运行解析/论文/代码/Viewer；建议公开PDF逐页核、测试库边界/故障以及用户学习对照，不能称复现成功。

**分析版本**

- **仓库**：[alaliqing/claude-paper](https://github.com/alaliqing/claude-paper)
- **版本号**：1.2.1（[固定提交 0af55d0](https://github.com/alaliqing/claude-paper/tree/0af55d0daeae8e86571700fd1839feb6be9440a6)）
- **版本日期**：2026-08-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

洞察/数字/演示绑定页表与提取/运行证据，测错漏/纠正时间与留存理解，未实现，见 [Q03](#research-q03)。

未运行解析/论文/代码/Viewer；建议公开PDF逐页核、测试库边界/故障以及用户学习对照，不能称复现成功。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 3466 | — | — | 13188 |
| .mjs | source | 3 | 488 | 420 | 0 | — |
| .cjs | source | 1 | 219 | 141 | 47 | — |
| .js | source | 2 | 173 | 153 | 0 | — |
| .ts | source | 10 | 704 | 580 | 25 | — |
| .mjs | test | 2 | 285 | 259 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/alaliqing/claude-paper/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/alaliqing/claude-paper/issues?q=is%3Aissue+created%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/alaliqing/claude-paper/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：完整论文到模型笔记/学习材料与本地Web库的证据、文件和成本边界是否清晰？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨宿主论文功能是原生插件还是Skill，产出链真实在哪里？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、依赖、兼容与流程

#### 完整回答

根包@zlzliqing/claude-paper1.2.1通过CLI把summary/study/webui三个Skill分发到不同宿主，bin说明其安装既有Skills而非MCP；研究动作由宿主模型按summary/study/webui指令调用脚本，不是DSH Host/工具服务。summary用于筛论文，study组织摘要/洞察/问答/代码/交互材料，WebUI浏览~/claude-papers知识库。相对人工读PDF+散落笔记，它把解析产物与学习目录/索引串起；理解和准确性仍是模型与人工责任。

真实parse-pdf读完整PDF给pdf-parse，再buildMetadata并把fullText写paper.txt；metadata中的content可截断且有标志，Skill已明确读paper.txt，不应沿用旧的“只有截断文本”批评。标题/作者/摘要靠文本正则，扫描件/复杂排版或公式仍需人工原PDF对照；完整文本不等提取正确。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-8](https://github.com/alaliqing/claude-paper/blob/0af55d0daeae8e86571700fd1839feb6be9440a6/package.json#L2-L8)

根包/CLI分发入口。

```text
  "name": "@zlzliqing/claude-paper",
  "version": "1.2.1",
  "description": "Cross-agent distribution for Claude Paper research workflows and web viewer",
  "type": "module",
  "bin": {
    "claude-paper": "bin/claude-paper.mjs"
  },
```

**依据 2 · 源码核查**：[bin/claude-paper.mjs:18-29](https://github.com/alaliqing/claude-paper/blob/0af55d0daeae8e86571700fd1839feb6be9440a6/bin/claude-paper.mjs#L18-L29)

跨宿主安装与非MCP说明。

<details>
<summary>查看原文（12行）</summary>

```text
  claude-paper install [--target all|claude-code,codex,opencode,deepseek-harness] [--dry-run]
  claude-paper upgrade [--target all|claude-code,codex,opencode,deepseek-harness] [--dry-run]
  claude-paper --version
  claude-paper --help

Examples:
  claude-paper install
  claude-paper install --target claude-code
  claude-paper install --target codex
  claude-paper upgrade --target opencode,deepseek-harness

This package installs the existing Skills-based capabilities. It does not install an MCP server.`);
```

</details>

**依据 3 · 作者声明**：[.agents/skills/claude-paper-summary/SKILL.md:94-113](https://github.com/alaliqing/claude-paper/blob/0af55d0daeae8e86571700fd1839feb6be9440a6/.agents/skills/claude-paper-summary/SKILL.md#L94-L113)

完整文本来源与库拷贝指令。

<details>
<summary>查看原文（20行）</summary>

````text
  --output-dir "$PARSE_OUTPUT_DIR"
```

The command prints a small, strict JSON summary to stdout and writes:
- `meta.json` — title, authors, abstract, links, page count, and a context-safe content preview
- `paper.txt` — complete extracted text without the 50k preview limit

Use `paper.txt` as the source for the quick summary. Do not treat `meta.json.content` as the complete paper when `contentTruncated` is true.

---

# Step 2: Generate Quick Summary

Create the paper folder:

```bash
mkdir -p ~/claude-papers/papers/{paper-slug}
cp "<metaPath-from-parser-output>" ~/claude-papers/papers/{paper-slug}/meta.json
cp "<fullTextPath-from-parser-output>" ~/claude-papers/papers/{paper-slug}/paper.txt
cp "$INPUT_PATH" ~/claude-papers/papers/{paper-slug}/paper.pdf
````

</details>

**依据 4 · 作者声明**：[.agents/skills/claude-paper-study/SKILL.md:198-238](https://github.com/alaliqing/claude-paper/blob/0af55d0daeae8e86571700fd1839feb6be9440a6/.agents/skills/claude-paper-study/SKILL.md#L198-L238)

组织学习材料要求。

<details>
<summary>查看原文（41行）</summary>

```text
## Required Files

### README.md

* What the paper is about (one paragraph)
* Difficulty level
* How to navigate materials
* Key takeaways
* Estimated study time
* Folder structure overview

---

### summary.md

* Background context
* Problem statement
* Main contributions
* Key results
* Quantitative metrics

---

### insights.md (Most Important)

* Core idea explained plainly
* Why this works
* What conceptual shift it introduces
* Trade-offs
* Limitations
* Comparison to prior work
* Practical implications

---

### qa.md

15 questions:

* 5 basic
* 5 intermediate
```

</details>

**依据 5 · 源码核查**：[plugin/skills/study/scripts/parse-pdf.js:50-64](https://github.com/alaliqing/claude-paper/blob/0af55d0daeae8e86571700fd1839feb6be9440a6/plugin/skills/study/scripts/parse-pdf.js#L50-L64)

真实解析和产物调用。

<details>
<summary>查看原文（15行）</summary>

```text
(async () => {
  const dataBuffer = fs.readFileSync(options.pdfPath);
  const { value: data, diagnostics } = await captureParserDiagnostics(() => pdf(dataBuffer));
  for (const diagnostic of diagnostics) process.stderr.write(`${diagnostic}\n`);

  const metadata = buildMetadata(data);
  if (options.outputDir) {
    const artifacts = await writeParseArtifacts(options.outputDir, metadata, data.text || '');
    process.stdout.write(`${JSON.stringify(buildArtifactSummary(metadata, artifacts), null, 2)}\n`);
  } else {
    process.stdout.write(`${JSON.stringify(metadata, null, 2)}\n`);
  }
})().catch((error) => {
  process.stderr.write(`Error parsing PDF: ${error.stack || error.message}\n`);
  process.exit(1);
```

</details>

**依据 6 · 源码核查**：[plugin/skills/study/scripts/parse-pdf-core.js:28-59](https://github.com/alaliqing/claude-paper/blob/0af55d0daeae8e86571700fd1839feb6be9440a6/plugin/skills/study/scripts/parse-pdf-core.js#L28-L59)

正则元信息与截断标记。

<details>
<summary>查看原文（32行）</summary>

```text
  const abstractMatch = fullText.match(/Abstract\s+(.+?)\s+(?=1\. Introduction|Introduction|$)/is);
  const abstract = abstractMatch ? abstractMatch[1].trim() : '';
  const githubMatch = fullText.match(/https?:\/\/github\.com\/[^\s\)]+/g);
  const githubLinks = githubMatch || [];
  const codeUrlPatterns = [
    /https?:\/\/(?:www\.)?arxiv\.org\/(?:code|src)\/[^\s\)]+/gi,
    /https?:\/\/(?:www\.)?codeocean\.com\/[^\s\)]+/gi,
    /https?:\/\/(?:www\.)?openreview\.net\/code[^\s\)]+/gi,
    /https?:\/\/(?:www\.)?paperswithcode\.com\/[^\s\)]+/gi,
    /\[code[\^\]]*\]\(https?:\/\/[^\)]+\)/gi,
  ];

  const codeLinks = [];
  for (const pattern of codeUrlPatterns) {
    const matches = fullText.match(pattern);
    if (matches) codeLinks.push(...matches.filter((link) => !githubLinks.includes(link)));
  }

  const authorMatch = fullText.match(/^([A-Z][a-z]+ [A-Z][a-z]+(?:,\s*[A-Z][a-z]+ [A-Z][a-z]+)*)/m);
  const authors = authorMatch ? authorMatch[1].split(',').map((author) => author.trim()) : [];
  const contentTruncated = fullText.length > MAX_CONTENT_LENGTH;
  const content = contentTruncated
    ? `${fullText.substring(0, MAX_CONTENT_LENGTH)}... [content truncated; see paper.txt for full text]`
    : fullText;

  return {
    title,
    authors,
    abstract,
    content,
    contentTruncated,
    fullTextLength: fullText.length,
```

</details>

#### 缺口

- 没有独立PDF提取/论文事实/学习收益验证。
  **影响**：未独立比对PDF提取与主张，不能把全文文件生成或材料齐全当论文事实正确/理解已提升。
  **进一步探讨**：选一篇公开文本PDF核完整文本、页码、表公式与主要结论，再与人工原文检查摘要。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本地文件和网页库的写入、渲染、删除边界是什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

解析产物各写临时文件再分别rename，避免单文件直接半写，但text→meta两次rename不是跨文件事务。知识库index追加由模型照Skill读改写，不是解析器的事务日志。Viewer是有变更能力的本地服务，不止只读：DELETE先写index再rmSync论文目录，第二步失败可能索引和目录不一致；未在该route看到认证或Origin检查，不能称多用户/公网安全服务。

文件API只用fullPath.startsWith(paperDir)做词法包含，不是realpath+路径分段边界；真实papers/[slug]页面用file API取内容，renderedContent与renderedNotebook经marked或原HTML返回后直入v-html，本页无净化；HTML srcdoc的sandbox还允许scripts与same-origin；notebook服务端text/html也直拼。这里只确认代码边界，不宣称已运行利用或所有上层防护不存在。Viewer指令用127.0.0.1:5815和PID文件，更新按PID停止旧服务；成功health只curl命令成功，不检查HTTP状态和响应结构，不能当库正确加载。不要把信任PDF或模型生成HTML的假设隐藏在“本地”二字里。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/skills/study/scripts/parse-pdf-core.js:66-89](https://github.com/alaliqing/claude-paper/blob/0af55d0daeae8e86571700fd1839feb6be9440a6/plugin/skills/study/scripts/parse-pdf-core.js#L66-L89)

两个文件各rename非同事务。

<details>
<summary>查看原文（24行）</summary>

```text
export async function writeParseArtifacts(outputDir, metadata, fullText) {
  const resolvedOutputDir = path.resolve(outputDir);
  await mkdir(resolvedOutputDir, { recursive: true });

  const metaPath = path.join(resolvedOutputDir, 'meta.json');
  const fullTextPath = path.join(resolvedOutputDir, 'paper.txt');
  const unique = `${process.pid}-${randomUUID()}`;
  const temporaryMetaPath = path.join(resolvedOutputDir, `.meta.json.${unique}.tmp`);
  const temporaryTextPath = path.join(resolvedOutputDir, `.paper.txt.${unique}.tmp`);
  const persistedMetadata = { ...metadata, fullTextFile: 'paper.txt' };

  try {
    await Promise.all([
      writeFile(temporaryMetaPath, `${JSON.stringify(persistedMetadata, null, 2)}\n`, 'utf8'),
      writeFile(temporaryTextPath, fullText, 'utf8'),
    ]);
    await rename(temporaryTextPath, fullTextPath);
    await rename(temporaryMetaPath, metaPath);
  } finally {
    await Promise.all([
      rm(temporaryMetaPath, { force: true }),
      rm(temporaryTextPath, { force: true }),
    ]);
  }
```

</details>

**依据 2 · 作者声明**：[.agents/skills/claude-paper-summary/SKILL.md:168-176](https://github.com/alaliqing/claude-paper/blob/0af55d0daeae8e86571700fd1839feb6be9440a6/.agents/skills/claude-paper-summary/SKILL.md#L168-L176)

索引由模型按指令维护。

````text
**CRITICAL**: Read existing index.json first, then append the new paper. Never overwrite the entire file.

If index.json does not exist, create:

```json
{"papers": []}
```

Append new entry to the papers array:
````

**依据 3 · 源码核查**：[plugin/src/web/server/api/papers/[slug]/delete.delete.ts:15-47](https://github.com/alaliqing/claude-paper/blob/0af55d0daeae8e86571700fd1839feb6be9440a6/plugin/src/web/server/api/papers/%5Bslug%5D/delete.delete.ts#L15-L47)

先改索引再删目录，无本路由认证检查。

<details>
<summary>查看原文（33行）</summary>

```text
  try {
    const papersDir = path.join(homedir(), 'claude-papers/papers')
    const paperDir = path.join(papersDir, slug)
    const indexPath = path.join(homedir(), 'claude-papers/index.json')

    if (!fs.existsSync(paperDir)) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Paper not found'
      })
    }

    // Update index.json first (supports both array and { papers: [] } formats)
    if (fs.existsSync(indexPath)) {
      const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'))
      const isArray = Array.isArray(index)
      const papers = isArray
        ? index
        : (Array.isArray(index?.papers) ? index.papers : null)

      if (papers) {
        const filtered = papers.filter((p: any) => p.slug !== slug)
        if (isArray) {
          fs.writeFileSync(indexPath, JSON.stringify(filtered, null, 2))
        } else {
          index.papers = filtered
          fs.writeFileSync(indexPath, JSON.stringify(index, null, 2))
        }
      }
    }

    // Then delete the paper directory
    fs.rmSync(paperDir, { recursive: true, force: true })
```

</details>

**依据 4 · 源码核查**：[plugin/src/web/server/api/papers/[slug]/file.get.ts:182-192](https://github.com/alaliqing/claude-paper/blob/0af55d0daeae8e86571700fd1839feb6be9440a6/plugin/src/web/server/api/papers/%5Bslug%5D/file.get.ts#L182-L192)

词法prefix路径判断。

<details>
<summary>查看原文（11行）</summary>

```text
    const paperDir = path.join(homedir(), 'claude-papers/papers', slug)
    const fullPath = path.join(paperDir, filePath)

    // Security: ensure the path is within the paper directory
    if (!fullPath.startsWith(paperDir)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied'
      })
    }

```

</details>

**依据 5 · 源码核查**：[plugin/src/web/pages/papers/[slug].vue:99-111](https://github.com/alaliqing/claude-paper/blob/0af55d0daeae8e86571700fd1839feb6be9440a6/plugin/src/web/pages/papers/%5Bslug%5D.vue#L99-L111)

真实HTML srcdoc sandbox及Notebook/Content v-html。

<details>
<summary>查看原文（13行）</summary>

```text
              <iframe
                v-if="showHtmlPreview"
                :srcdoc="processedHtmlContent"
                frameborder="0"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              ></iframe>
              <pre v-else><code class="language-html" v-html="highlightedHtmlCode"></code></pre>
            </div>
            <div v-else-if="fileType === 'code'" class="file-viewer code-viewer">
              <pre><code :class="`language-${fileLanguage}`" v-html="highlightedCode"></code></pre>
            </div>
            <div v-else-if="fileType === 'notebook'" class="file-viewer notebook-viewer" v-html="renderedNotebook"></div>
            <div v-else-if="fileContent" v-html="renderedContent" class="markdown-body"></div>
```

</details>

**依据 6 · 源码核查**：[plugin/src/web/pages/papers/[slug].vue:213-219](https://github.com/alaliqing/claude-paper/blob/0af55d0daeae8e86571700fd1839feb6be9440a6/plugin/src/web/pages/papers/%5Bslug%5D.vue#L213-L219)

实际页面loadFile消费file API。

```text
// Load a specific file
const loadFile = async (path: string) => {
  fileLoading.value = true
  try {
    const data = await $fetch(`/api/papers/${slug}/file`, {
      params: { path }
    })
```

**依据 7 · 源码核查**：[plugin/src/web/pages/papers/[slug].vue:373-408](https://github.com/alaliqing/claude-paper/blob/0af55d0daeae8e86571700fd1839feb6be9440a6/plugin/src/web/pages/papers/%5Bslug%5D.vue#L373-L408)

真实computed内容到marked/rawHTML，未净化。

<details>
<summary>查看原文（36行）</summary>

```text
const renderedNotebook = computed(() => {
  if (!fileContent.value || fileType.value !== 'notebook') return ''

  // The server returns pre-structured HTML with class markers.
  // We parse markdown cells with marked and highlight code cells with hljs.
  let html = fileContent.value

  // Render markdown cells: content between <div class="nb-cell nb-markdown"> tags
  html = html.replace(/<div class="nb-cell nb-markdown">([\s\S]*?)<\/div>/g, (_match, md) => {
    return `<div class="nb-cell nb-markdown">${marked.parse(md)}</div>`
  })

  // Highlight code cells
  const lang = fileLanguage.value || 'python'
  html = html.replace(/<code class="language-[^"]*">([\s\S]*?)<\/code>/g, (_match, code) => {
    // Unescape HTML entities back to raw text for hljs
    const raw = code.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    try {
      return `<code class="language-${lang}">${hljs.highlight(raw, { language: lang }).value}</code>`
    } catch {
      return `<code class="language-${lang}">${code}</code>`
    }
  })

  return html
})

const renderedContent = computed(() => {
  if (!fileContent.value) return ''
  if (fileType.value === 'markdown') {
    return marked.parse(fileContent.value)
  }
  if (fileType.value === 'text') {
    return `<pre>${fileContent.value}</pre>`
  }
  return fileContent.value
```

</details>

**依据 8 · 源码核查**：[plugin/src/web/server/api/papers/[slug]/file.get.ts:91-100](https://github.com/alaliqing/claude-paper/blob/0af55d0daeae8e86571700fd1839feb6be9440a6/plugin/src/web/server/api/papers/%5Bslug%5D/file.get.ts#L91-L100)

notebook富文本直拼。

<details>
<summary>查看原文（10行）</summary>

```text
        } else if (out.output_type === 'execute_result' || out.output_type === 'display_data') {
          const data = out.data || {}
          if (data['text/html']) {
            const html = Array.isArray(data['text/html']) ? data['text/html'].join('') : data['text/html']
            parts.push(`<div class="nb-output nb-rich">${html}</div>`)
          } else if (data['image/png']) {
            parts.push(`<div class="nb-output nb-image"><img src="data:image/png;base64,${data['image/png']}" /></div>`)
          } else if (data['image/jpeg']) {
            parts.push(`<div class="nb-output nb-image"><img src="data:image/jpeg;base64,${data['image/jpeg']}" /></div>`)
          } else if (data['image/svg+xml']) {
```

</details>

**依据 9 · 作者声明**：[.agents/skills/claude-paper-webui/SKILL.md:99-128](https://github.com/alaliqing/claude-paper/blob/0af55d0daeae8e86571700fd1839feb6be9440a6/.agents/skills/claude-paper-webui/SKILL.md#L99-L128)

loopback/PID与弱curl health指令。

<details>
<summary>查看原文（30行）</summary>

````text
## Step 4: Start Production Server

Start the server in background:
```bash
HOST=127.0.0.1 PORT=5815 node .output/server/index.mjs &
SERVER_PID=$!

# Save PID for later cleanup
echo $SERVER_PID > /tmp/claude-paper-webui.pid
echo "Server PID: $SERVER_PID"
```

## Step 5: Verify Server Health

Wait for server to be ready:
```bash
timeout=10
while [ $timeout -gt 0 ]; do
  if curl -s http://localhost:5815/api/papers > /dev/null 2>&1; then
    echo "Server is ready!"
    break
  fi
  sleep 1
  timeout=$((timeout - 1))
done

if [ $timeout -eq 0 ]; then
  echo "ERROR: Server failed to start properly"
  kill $SERVER_PID 2>/dev/null
  rm -f /tmp/claude-paper-webui.pid
````

</details>

#### 缺口

- 未核实际暴露/上层防护、文件边界/主动内容和删除故障恢复。
  **影响**：文件边界、主动内容和删除一致性未验，不能向重要论文库或多人环境承诺无数据丢失/暴露。
  **进一步探讨**：只用可替代测试库，核真实path边界、主动内容隔离、请求授权及索引-目录失败一致性；Viewer不外网开放。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样有限采用，哪些丰富材料不能当论文理解证明？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议对公开文本PDF先有限试用summary，保存原文与笔记并人工查主张，暂不默认启动可删改/渲染主动内容的Web库。study要求代码演示与真实数据交互HTML，只是作者要求，不证明生成代码跑通、数字忠实或用户理解；复述/模拟不等复现实验。原生读PDF+人工摘要是低配置对照。

首次按Skill会npm install及pip --user PyMuPDF，还把.installed写为总标志，pip失败仅警告仍touch；不能据标志断言图片提取依赖齐备。成本包括Node版本、npm/Python、模型长文token、磁盘PDF/图片/网页、索引维护、Web构建和服务/PID退出；未见耗时/金额和净收益对照。退出需要停止自己服务，Skill/依赖与~/claude-papers库分别保留/清理，勿把删论文当可撤销动作。

可证伪方向是每项洞察/数字/演示绑定原PDF页/表、提取置信与运行记录，用户能区分作者结果、模型解释、独立复核。用新PDF比较人工笔记、当前、证据绑定版的错数/漏限/纠正时间和一周后解释能力；无收益或标注成本过高则停止，未实现。

#### 证据与依据

**依据 1 · 作者声明**：[.agents/skills/claude-paper-summary/SKILL.md:40-52](https://github.com/alaliqing/claude-paper/blob/0af55d0daeae8e86571700fd1839feb6be9440a6/.agents/skills/claude-paper-summary/SKILL.md#L40-L52)

npm/pip用户安装与失败仍标记。

<details>
<summary>查看原文（13行）</summary>

````text
# Step 0: Check Dependencies (First Run Only)

```bash
if [ ! -f "${CLAUDE_PAPER_PLUGIN_ROOT}/.installed" ]; then
  echo "First run - installing dependencies..."
  cd "${CLAUDE_PAPER_PLUGIN_ROOT}"
  npm install || exit 1

  # Install Python dependencies for image extraction
  python3 -m pip install pymupdf --user 2>/dev/null || pip3 install pymupdf --user 2>/dev/null || echo "Warning: Failed to install pymupdf"

  touch "${CLAUDE_PAPER_PLUGIN_ROOT}/.installed"
  echo "Dependencies installed!"
````

</details>

**依据 2 · 作者声明**：[.agents/skills/claude-paper-study/SKILL.md:293-306](https://github.com/alaliqing/claude-paper/blob/0af55d0daeae8e86571700fd1839feb6be9440a6/.agents/skills/claude-paper-study/SKILL.md#L293-L306)

代码演示要求非运行证据。

<details>
<summary>查看原文（14行）</summary>

````text
# Step 4: Code Demonstrations (Mandatory)

At least one runnable demo must be created.

**All code demos must be placed in:**
```
~/claude-papers/papers/{paper-slug}/code/
```

Create the code directory first:

```bash
mkdir -p ~/claude-papers/papers/{paper-slug}/code
```
````

</details>

**依据 3 · 作者声明**：[.agents/skills/claude-paper-study/SKILL.md:333-350](https://github.com/alaliqing/claude-paper/blob/0af55d0daeae8e86571700fd1839feb6be9440a6/.agents/skills/claude-paper-study/SKILL.md#L333-L350)

真实数据HTML只是生成规范。

<details>
<summary>查看原文（18行）</summary>

````text
# Step 5: Generate Interactive HTML Explorer

Create a single self-contained HTML file for interactively exploring the paper's core concepts.

**Output path:**
```
~/claude-papers/papers/{paper-slug}/index.html
```

## Requirements

* Single HTML file, all CSS/JS inline, zero external dependencies
* Uses **real data from the paper** (actual metrics, hyperparameters, comparisons) — never invent numbers
* Must work in a sandboxed iframe (no external fetches, no localStorage)

## Guidelines

Choose the interaction pattern that best fits the paper — architecture diagrams, parameter explorers, result dashboards, formula breakdowns, comparison matrices, etc. Let the paper's content dictate the format rather than forcing a fixed layout, focusing on the core ideas of the paper.
````

</details>

**依据 4 · 作者声明**：[.agents/skills/claude-paper-webui/SKILL.md:99-128](https://github.com/alaliqing/claude-paper/blob/0af55d0daeae8e86571700fd1839feb6be9440a6/.agents/skills/claude-paper-webui/SKILL.md#L99-L128)

持续服务/退出成本。

<details>
<summary>查看原文（30行）</summary>

````text
## Step 4: Start Production Server

Start the server in background:
```bash
HOST=127.0.0.1 PORT=5815 node .output/server/index.mjs &
SERVER_PID=$!

# Save PID for later cleanup
echo $SERVER_PID > /tmp/claude-paper-webui.pid
echo "Server PID: $SERVER_PID"
```

## Step 5: Verify Server Health

Wait for server to be ready:
```bash
timeout=10
while [ $timeout -gt 0 ]; do
  if curl -s http://localhost:5815/api/papers > /dev/null 2>&1; then
    echo "Server is ready!"
    break
  fi
  sleep 1
  timeout=$((timeout - 1))
done

if [ $timeout -eq 0 ]; then
  echo "ERROR: Server failed to start properly"
  kill $SERVER_PID 2>/dev/null
  rm -f /tmp/claude-paper-webui.pid
````

</details>

#### 缺口

- 未运行演示、论文对照与用户理解收益，真实viewer防护未验。
  **影响**：未测演示/用户学习和Viewer防护，无法确认深读收益或服务风险是否值得依赖/token与维护成本。
  **进一步探讨**：一篇公开论文先summary逐条核原文，再决定是否增加study；viewer先修文件/主动内容/删除边界并测试库故障恢复。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
