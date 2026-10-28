# Awesome AI Pedia

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[16b5092](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/tree/16b509286924399e49371f8933972d64426f1b8b)

<!-- BEGIN META -->
[![GitHub ★ 504](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=504&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia)
<!-- END META -->

> **功能**：中文 AI 工具指南、实践笔记与规则的 VitePress 知识库

> **亮点**：[Q02](#research-q02) 将散落中文资料组织为可导航站点，自动侧栏减少部分维护；VitePress能力归框架。

> **主要限制**：[Q03](#research-q03) 构建忽略死链且笔记可能滞后，资料可读不能证明上游命令和能力仍有效。

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
  - [Q01 · 它给谁提供什么，是否是可安装DSH插件？](#detail-section-11)
  - [Q02 · 文章怎样形成导航，实际增量在哪里？](#detail-section-12)
  - [Q03 · 构建成功能否说明资料当前可靠、链接完整？](#detail-section-13)
  - [Q04 · 怎样采用，成本和可证伪改进是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向中文开发者，按主题查找AI工具资料与实践笔记；根条目是知识资源。

直接阅读上游文档或仓库搜索；本资源提供中文组织便利，不提供上游功能实现。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 分类导航 | 查找中文AI工具文章 | 须回原始来源确认版本 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Markdown阅读器 | 阅读必需 | 查看原始文章 | 直接用GitHub原文 |
| Node>=18、VitePress/Vue | 本地站点必需 | 构建/预览 | 保留原文浏览 |
| 上游资料可访问 | 正确采用必需 | 核实版本/命令 | 暂缓照做 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 读者按主题选文章 | 找到任务与原始出处 |
| 2 | 读者回查上游版本 | 条件匹配才使用；冲突回上游 |
| 3 | 维护者可选构建站点 | 页面可达仍需另查链接 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 直接阅读无新增部署资源 | 筛选适用内容 | 阅读时间未测 |
| 持续 | 可选站点托管 | 核实上游变化 | 维护工时未知 |
| 失败恢复 | 重新查找资料 | 纠正失效命令/链接 | 错误代价未测 |
| 退出 | 原文可保留 | 改用官方文档 | 无独占研究状态迁移 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 资料发现 | 分类与自动导航 | 同任务查找节时 |
| 可用性 | 部分文章记录上游和限制 | 全库时效及外链完整性 |

> **思考**：[Q03](#research-q03) 构建忽略死链且笔记可能滞后，资料可读不能证明上游命令和能力仍有效。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将散落中文资料组织为可导航站点，自动侧栏减少部分维护；VitePress能力归框架。

[Q02](#research-q02) 自动导航易复用；[Q03](#research-q03) 弱链接门禁需要独立内容核验流程补足。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 构建忽略死链且笔记可能滞后，资料可读不能证明上游命令和能力仍有效。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 可将其作为中文资料线索小范围试读；具体命令与官方原文冲突时停止照做并回上游。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

导航接线和内容来源可核查；资料时效与学习效率尚未独立验证。

- 已检查：作者 README、包清单、源码路径 README.md、docs/.vitepress/config.ts、docs/.vitepress/utils/sidebar.ts、AI视频/多平台自动发布social-auto-upload.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查根说明、包清单、VitePress配置、侧栏算法与一篇外部工具笔记；未全面核实全库文章或上游功能。
- 下一步：用同一批查找任务比较带版本核验信息前后找到正确版本的比例、外链失效与人工耗时；无改善则停止该编辑扩展。

**分析版本**

- **仓库**：[Awesome-AI-Pedia/Awesome-AI-Pedia](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia)
- **版本号**：1.0.0（[固定提交 16b5092](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/tree/16b509286924399e49371f8933972d64426f1b8b)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出按文章记录上游版本与定向外链核验的未验证假设；以版本匹配和回查耗时比较，改善不足则否定。

用同一批查找任务比较带版本核验信息前后找到正确版本的比例、外链失效与人工耗时；无改善则停止该编辑扩展。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 310 | 25000 | — | — | 213558 |
| .ts | source | 4 | 728 | 492 | 127 | — |
| .cjs | source | 1 | 126 | 105 | 5 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/issues?q=is%3Aissue+created%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z)



统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：资源整理与站点导航能否改善中文工具资料发现，同时保留来源边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它给谁提供什么，是否是可安装DSH插件？

**研究主题**：场景与需求

#### 完整回答

这是面向开发者的中文AI知识资源与博客站点，真实类型resource。README将编码助手、MCP、规则、技能和实战笔记按目录组织；合格结果是找到一条适用资料并回到其原始来源核实，而非安装后得到新的DSH能力。直接浏览上游文档或仓库搜索是基线。中文整理能降低资料发现摩擦，但目录覆盖广不等于每篇结论已验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-30](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/16b509286924399e49371f8933972d64426f1b8b/README.md#L13-L30)

作者定义知识库和站点能力

<details>
<summary>查看原文（18行）</summary>

```text
## ✨ 项目简介

**Awesome AI Pedia** 是一个现代化 AI 知识库，
旨在为开发者提供全面的 AI 工具使用指南、最佳实践和实战经验分享。

### 🎯 核心特性

- **📚 全方位覆盖** — 从 Claude Code、Cursor、MCP，到 Agent、Skills、Prompt 工程等主流 AI 方向
- **💡 实战导向** — 从真实项目出发，提供可落地的解决方案
- **🔍 本地搜索** — 内置全文搜索，快速定位所需内容
- **🌙 暗黑主题** — 默认暗色界面，长时间阅读不刺眼
- **🚀 自动部署** — 推送到 `master` 自动构建并发布到 GitHub Pages

---

## 📂 知识库分类

> 以下分类均对应仓库根目录的实际目录，可直接进入查看原始 Markdown。
```

</details>

**依据 2 · 源码核查**：[README.md:34-64](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/16b509286924399e49371f8933972d64426f1b8b/README.md#L34-L64)

主题目录入口

<details>
<summary>查看原文（31行）</summary>

```text
| 目录 | 说明 |
| --- | --- |
| [`claudeCode/`](./claudeCode) | Claude Code 完整使用指南：安装配置、常用命令、Browser 工具、Settings.json 详解 |
| [`cursor/`](./cursor) | Cursor 编辑器：功能详解、中文对话、区域限制、菜单栏自定义、版本管理 |
| [`codex/`](./codex) | OpenAI Codex 相关实践 |
| [`antigravity/`](./antigravity) | Antigravity 相关笔记 |
| [`openclaw/`](./openclaw) | Openclaw 相关内容 |

### 🔌 生态与协议

| 目录 | 说明 |
| --- | --- |
| [`mcp/`](./mcp) | Model Context Protocol：Figma / 蓝湖 / 飞书 / Playwright / Context7 / Chrome DevTools 等 MCP 实战 |
| [`Agent/`](./Agent) | AI Agent 相关内容 |
| [`Harness Engineering/`](./Harness%20Engineering) | 提示词/Agent 编排工程 |

### 💬 提示词与规则

| 目录 | 说明 |
| --- | --- |
| [`prompt/`](./prompt) | Prompt 工程：React + UI 设计师、SVG 海报设计、提示词最佳实践 |
| [`rules/`](./rules) | Next.js / Vue / NuxtJS / Flutter / Expo / Spring Boot / HTML & CSS 等 AI 编码规则 |
| [`好的rules/`](./好的rules) | 精选优质 Rules 集合 |

### 🛠️ 技能与工具

| 目录 | 说明 |
| --- | --- |
| [`skills/`](./skills) | Skills 概念、与 MCP 的区别、安装、自定义开发 |
| [`常用skills/`](./常用skills) | 高频使用的 Skills 工具集 |
| [`工具/`](./工具) | 常用辅助工具集合 |
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文章怎样形成导航，实际增量在哪里？

**研究主题**：功能与机制、贡献与相对优势、工程质量与复用

#### 完整回答

VitePress配置把仓库根目录设为内容源，将README改写为首页，导航与侧栏由generateNav/generateAllSidebars构造。sidebar通过文件系统读取Markdown并排序，提供目录到页面的稳定映射。相较手工维护链接清单，这减少一部分重复导航维护；内容选择与中文解释仍由作者承担。框架的渲染、主题和搜索不应归为该资源独立发明，实际贡献是内容组织和工程配置。

#### 证据与依据

**依据 1 · 源码核查**：[docs/.vitepress/config.ts:52-89](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/16b509286924399e49371f8933972d64426f1b8b/docs/.vitepress/config.ts#L52-L89)

内容源、排除、首页改写和侧栏接线

<details>
<summary>查看原文（38行）</summary>

```text
  // 🆕 指定源目录为项目根目录（srcDir 相对于 docs/ 目录）
  srcDir: '../',
  
  // 🆕 排除不需要的目录和文件
  srcExclude: [
    'node_modules/**',
    'scripts/**',
    '.git/**',
    '.github/**',
    'dist/**',
    'anime-video/**',
    '.agent/**',
    '.claude/**',
    '.vscode/**',
    '*.lock',
    'package.json',
    'package-lock.json',
    '*.sh',
    // 包含大量未闭合的标签示例（Claude 提示词原文），VitePress/Vue 解析会失败
    'vibe design/claude design/claude design 提示词.md'
  ],
  
  base: '/Awesome-AI-Pedia/',
  lastUpdated: true,
  cleanUrls: false, // 🔧 修复：关闭 cleanUrls 避免 404
  ignoreDeadLinks: true,
  appearance: 'dark', // 默认使用暗黑主题

  // 🔧 添加路由重写规则，修复 404 问题
  rewrites: {
    'README.md': 'index.md'
  },

  themeConfig: {
    nav: generateNav(projectRoot),

    // 🆕 动态生成所有内容目录的侧边栏
    sidebar: generateAllSidebars(projectRoot),
```

</details>

**依据 2 · 源码核查**：[docs/.vitepress/utils/sidebar.ts:13-24](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/16b509286924399e49371f8933972d64426f1b8b/docs/.vitepress/utils/sidebar.ts#L13-L24)

Markdown读取与排序

<details>
<summary>查看原文（12行）</summary>

```text
// 获取目录下的所有markdown文件
export function getMarkdownFiles(dirPath: string): string[] {
  const files: string[] = []
  if (fs.existsSync(dirPath)) {
    const items = fs.readdirSync(dirPath, { withFileTypes: true })
    items.forEach((item: fs.Dirent) => {
      if (item.isFile() && item.name.endsWith('.md')) {
        files.push(item.name)
      }
    })
  }
  return files.sort()
```

</details>

**依据 3 · 源码核查**：[docs/.vitepress/utils/sidebar.ts:78-96](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/16b509286924399e49371f8933972d64426f1b8b/docs/.vitepress/utils/sidebar.ts#L78-L96)

目录首篇链接选择

<details>
<summary>查看原文（19行）</summary>

```text
// 获取目录下第一篇文章的链接（按字母序）
function getFirstArticleLink(dirPath: string, urlBasePath: string): string | null {
  if (!fs.existsSync(dirPath)) return null

  const entries = fs.readdirSync(dirPath, { withFileTypes: true })

  // 获取所有 .md 文件，按字母序排序
  const mdFiles = entries
    .filter((e: fs.Dirent) => e.isFile() && e.name.endsWith('.md'))
    .map((e: fs.Dirent) => e.name)
    .sort()

  // 跳过 index.md，返回第一个文章
  const firstArticle = mdFiles.find((file: string) => file !== 'index.md')

  if (!firstArticle) return null

  const fileName = stripMarkdownExtension(firstArticle)
  return `${urlBasePath}/${fileName}`
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 构建成功能否说明资料当前可靠、链接完整？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能。配置ignoreDeadLinks=true，构建不会把失效链接作为同等强制门禁；部分材料还被明确排除以避开解析失败。抽样文章对social-auto-upload注明功能覆盖不一和重构状态，也列出了上游仓库，这有助于识别条件，但文章内Star和维护状态属于本资源记录时的二手说明，不是本轮对上游的独立核查。适用性取决于读者回查上游版本。

#### 证据与依据

**依据 1 · 源码核查**：[docs/.vitepress/config.ts:55-77](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/16b509286924399e49371f8933972d64426f1b8b/docs/.vitepress/config.ts#L55-L77)

内容排除和ignoreDeadLinks

<details>
<summary>查看原文（23行）</summary>

```text
  // 🆕 排除不需要的目录和文件
  srcExclude: [
    'node_modules/**',
    'scripts/**',
    '.git/**',
    '.github/**',
    'dist/**',
    'anime-video/**',
    '.agent/**',
    '.claude/**',
    '.vscode/**',
    '*.lock',
    'package.json',
    'package-lock.json',
    '*.sh',
    // 包含大量未闭合的标签示例（Claude 提示词原文），VitePress/Vue 解析会失败
    'vibe design/claude design/claude design 提示词.md'
  ],
  
  base: '/Awesome-AI-Pedia/',
  lastUpdated: true,
  cleanUrls: false, // 🔧 修复：关闭 cleanUrls 避免 404
  ignoreDeadLinks: true,
```

</details>

**依据 2 · 作者声明**：[AI视频/多平台自动发布social-auto-upload.md:3-20](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/16b509286924399e49371f8933972d64426f1b8b/AI%E8%A7%86%E9%A2%91/%E5%A4%9A%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%8F%91%E5%B8%83social-auto-upload.md#L3-L20)

有来源和能力差异声明

<details>
<summary>查看原文（18行）</summary>

```text
仓库地址：https://github.com/dreammis/social-auto-upload
作者：dreammis ｜ 许可证：MIT ｜ Star：14.4k

## 是什么

一款视频**一键多平台自动发布**工具，面向管理多平台分发的内容创作者，用脚本化流程替代重复手动上传和易碎的浏览器 Agent 截图方案。

原作者用途：**提前一天定时发布**，因此很多默认时间逻辑围绕"次日"设计。

## 支持平台

抖音、B 站、小红书、快手、微信视频号（tencent）、百家号、支付宝生活号、微博、虎扑、TikTok、YouTube

**能力覆盖不一**：
- 抖音在当前重构分支上最完善
- 图文（"图文"）仅支持：抖音、快手、小红书、B 站
- TikTok、百家号无定时发布
- 只有部分平台有 Skills
```

</details>

**依据 3 · 作者声明**：[AI视频/多平台自动发布social-auto-upload.md:62-69](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/16b509286924399e49371f8933972d64426f1b8b/AI%E8%A7%86%E9%A2%91/%E5%A4%9A%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%8F%91%E5%B8%83social-auto-upload.md#L62-L69)

作者记录的重构及使用限制

```text
## 注意事项与限制

- 项目**处于重构中**：统一上传器结构、统一 CLI、推进 headless-first
- Web UI 代码保留但**不再是主线**
- 部分平台标题长度限制：微博 ≤ 30、虎扑 4–40
- YouTube 上传需等到 100% 才点发布——提前关闭会中断传输
- 作者因创业维护带宽下降，但会有一波重构更新
- 赞助方：DolOffer、chilltion、ClawPower（AI 模型代理商），README 中含推广码
```

#### 缺口

- 文章对上游版本、价格和可用性的时效覆盖未知
  **影响**：不能把笔记当当前安装/使用保证
  **进一步探讨**：从目标文章链接回上游固定版本逐项核实

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样采用，成本和可证伪改进是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

读者可先直接阅读原Markdown，无需部署；维护者若本地运行则需Node和VitePress/Vue，package.json要求Node>=18。首次阅读成本是筛选适用文章，持续成本是回查上游，失败可退回原文和官方资料；无实测节时。由弱链接门禁推导未验证假设：给文章加上游版本和最后核验范围，再定向检查外链，可能比扩大条目数更减少误用。用一组真实查找任务比较现有页面与带核验信息页面，记录找对版本、失效链接和回查耗时；若正确率不升且维护负担增加，则否定。可小范围试读；发现命令与上游冲突就以原始文档为准。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:20-42](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/16b509286924399e49371f8933972d64426f1b8b/package.json#L20-L42)

站点脚本、依赖和Node约束

<details>
<summary>查看原文（23行）</summary>

```text
    "type": "git",
    "url": "https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia.git"
  },
  "bugs": {
    "url": "https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/issues"
  },
  "scripts": {
    "dev": "vitepress dev docs",
    "build": "vitepress build docs",
    "preview": "vitepress preview docs",
    "serve": "vitepress preview docs"
  },
  "dependencies": {
    "vitepress": "^1.3.4",
    "vue": "^3.5.11",
    "@vueuse/core": "^11.1.0"
  },
  "devDependencies": {
    "gray-matter": "^4.0.3",
    "glob": "^11.0.0"
  },
  "engines": {
    "node": ">=18"
```

</details>

**依据 2 · 源码核查**：[docs/.vitepress/config.ts:74-89](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/16b509286924399e49371f8933972d64426f1b8b/docs/.vitepress/config.ts#L74-L89)

链接门禁和生成导航为假设依据

<details>
<summary>查看原文（16行）</summary>

```text
  base: '/Awesome-AI-Pedia/',
  lastUpdated: true,
  cleanUrls: false, // 🔧 修复：关闭 cleanUrls 避免 404
  ignoreDeadLinks: true,
  appearance: 'dark', // 默认使用暗黑主题

  // 🔧 添加路由重写规则，修复 404 问题
  rewrites: {
    'README.md': 'index.md'
  },

  themeConfig: {
    nav: generateNav(projectRoot),

    // 🆕 动态生成所有内容目录的侧边栏
    sidebar: generateAllSidebars(projectRoot),
```

</details>

**依据 3 · 作者声明**：[AI视频/多平台自动发布social-auto-upload.md:3-10](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/16b509286924399e49371f8933972d64426f1b8b/AI%E8%A7%86%E9%A2%91/%E5%A4%9A%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%8F%91%E5%B8%83social-auto-upload.md#L3-L10)

保留原始来源便于退路

```text
仓库地址：https://github.com/dreammis/social-auto-upload
作者：dreammis ｜ 许可证：MIT ｜ Star：14.4k

## 是什么

一款视频**一键多平台自动发布**工具，面向管理多平台分发的内容创作者，用脚本化流程替代重复手动上传和易碎的浏览器 Agent 截图方案。

原作者用途：**提前一天定时发布**，因此很多默认时间逻辑围绕"次日"设计。
```

#### 缺口

- 试读收益与定向核验维护成本未测
  **影响**：无法证明资料整理降低总任务成本
  **进一步探讨**：对同一资料查找任务记录正确率与人工回查时间

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
