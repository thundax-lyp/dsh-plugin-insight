# Awesome AI Pedia

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[1784247](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/tree/178424754f23f30d544de203903539a00f1cc064)

<!-- BEGIN META -->
[![GitHub ★ 583](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=583&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia)
<!-- END META -->

> **功能**：按主题整理 AI 工具、Agent、Skill 和 DSH 相关文章的中文知识库。

> **亮点**：[Q01](#research-q01) 形成中文主题组织，[Q02](#research-q02) 以目录生成导航；不提供 DSH 运行能力。

> **主要限制**：[Q03](#research-q03) 文章中的绝对化陈述未绑定明确源码版本，站点忽略死链，需逐项回源。

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
  - [Q01 · 对需要学习 DSH 和 AI 工具的读者，相比直接查官方文档有什么作用？](#detail-section-11)
  - [Q02 · 站点如何从目录产生导航？](#detail-section-12)
  - [Q03 · 文章事实和链接的可信度有什么边界？](#detail-section-13)
  - [Q04 · 如何采用和维护该知识库？](#detail-section-14)
  - [Q05 · 如何帮助读者识别过期 DSH 文章？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要查找中文 AI 工具或 DSH 介绍并回源的读者。

直接搜索和阅读官方文档或独立收藏资料。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 中文 AI 知识文章 | 查找工具和概念 | 内容与当前版本需回源 |
| DSH 文章 | 了解运行时及插件 | 样例未绑定源码提交 |
| 侧栏生成 | 导航 Markdown 目录 | 构建与死链未验证 |

**流程与依赖**

| 依赖 | 条件 | 作用 | 缺失影响 |
|---|---|---|---|
| Markdown 阅读器 | 源码阅读需要 | 查看文章 | 无法正常阅读 |
| Node 与 VitePress | 本地站点构建需要 | 生成站点 | 无法构建 |
| 上游项目资料 | 实际采用前需要 | 核验版本与行为 | 结论无法独立确认 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 查找 | 读者按主题浏览 | 确认目标项目 |
| 阅读 | 读者提取具体主张 | 标记版本和条件 |
| 回源 | 查项目源码与文档 | 无依据不当事实 |
| 使用 | 在隔离环境验证配置 | 与当前版本不符则停止 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | 浏览器或 Markdown 阅读器 | 查找主题 | 线上可用性未知 |
| 持续 | 官方资料与维护 | 核验版本和链接 | 内容更新成本未知 |
| 故障 | 原文和来源 | 检查失效或错误 | 链接完整性未知 |

| 效果 | 材料 | 未知 |
|---|---|---|
| 主题组织 | README 和目录结构 | 文章质量和时效 |
| 动态侧栏 | VitePress 代码 | 构建和链接行为 |
| DSH 入门 | 两份内容样例 | 全部文章准确性 |

> **思考**：[Q03](#research-q03) 文章中的绝对化陈述未绑定明确源码版本，站点忽略死链，需逐项回源。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 形成中文主题组织，[Q02](#research-q02) 以目录生成导航；不提供 DSH 运行能力。

[Q02](#research-q02) 动态侧栏和有限白名单索引各自维护；[Q03](#research-q03) 忽略死链不保证可导航。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 文章中的绝对化陈述未绑定明确源码版本，站点忽略死链，需逐项回源。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先作为线索入口，再按任务核对官方固定版本，不直接执行未经验证的命令。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本内容与站点配置静态检查；未运行构建或验证所有文章。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、docs/.vitepress/config.ts、docs/.vitepress/utils/sidebar.ts、scripts/generate-indexes.cjs、deepseek harness/什么是deepseek harness.md、deepseek harness plugins/插件市场dsh-market.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 README、两份 DSH 文章样例、VitePress 配置、侧栏与索引脚本；未穷尽文章、上游事实或站点链接。
- 下一步：抽查文章及链接并在隔离环境验证站点构建；本轮未执行。

**分析版本**

- **仓库**：[Awesome-AI-Pedia/Awesome-AI-Pedia](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia)
- **版本号**：1.0.0（[固定提交 1784247](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/tree/178424754f23f30d544de203903539a00f1cc064)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 通过版本与复核日期提示过期风险，仍需验证维护与效果。

抽查文章及链接并在隔离环境验证站点构建；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 314 | 25518 | — | — | 219144 |
| .ts | source | 4 | 728 | 492 | 127 | — |
| .cjs | source | 1 | 126 | 105 | 5 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查知识库的 DSH 内容、站点导航与引用可信边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 对需要学习 DSH 和 AI 工具的读者，相比直接查官方文档有什么作用？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

仓库是中文 AI 知识库和 VitePress 站点，包含 DSH 架构与社区插件介绍；读者可浏览按目录组织的文章，再回到对应项目官方资料。直接官方文档往往能提供版本一致的一手细节，本仓库的增量是中文主题组织和导航，不提供 DSH 运行能力，也不证明所有内容及时正确。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-24](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/178424754f23f30d544de203903539a00f1cc064/README.md#L13-L24)

知识库定位及本地搜索。

<details>
<summary>查看原文（12行）</summary>

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
```

</details>

**依据 2 · 作者声明**：[README.md:28-64](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/178424754f23f30d544de203903539a00f1cc064/README.md#L28-L64)

主题分类。

<details>
<summary>查看原文（37行）</summary>

```text
## 📂 知识库分类

> 以下分类均对应仓库根目录的实际目录，可直接进入查看原始 Markdown。

### 🤖 AI 编码助手

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

**依据 3 · 作者声明**：[deepseek harness plugins/插件市场dsh-market.md:1-17](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/178424754f23f30d544de203903539a00f1cc064/deepseek%20harness%20plugins/%E6%8F%92%E4%BB%B6%E5%B8%82%E5%9C%BAdsh-market.md#L1-L17)

具体 DSH 插件综述及项目地址。

<details>
<summary>查看原文（17行）</summary>

```text
# dsh-market 插件市场总结

仓库地址：https://github.com/dsh-market/dsh-market

## 定位

DeepSeek Harness (DSH) 内置的可视化插件市场。用户通过 **Settings → Plugin Market** 浏览、搜索并一键安装社区插件。独立于具体客户端，兼容任何遵循标准 DSH 协议的宿主（如 dsh-desktop、deepseek-harness-desktop）。

## 核心功能

- **浏览与搜索**：覆盖 1550+ 插件的社区目录，支持分类过滤、按星数/新旧排序、双语描述
- **截图预览**：AppStore 风格截图，多图自动轮播，可点击放大
- **主题市场**：独立标签页，一键切换社区主题，互斥且持久化
- **一键安装**：实时进度显示，大多数插件刷新页面即生效
- **备份与恢复**：导出 JSON、跨机导入；支持 WebDAV 每日自动备份或 GitHub Gist 同步；恢复采用合并策略并可回滚
- **更新管理**：按 npm 版本或 commit 检查更新，支持单个/批量更新，市场自身也走同一通道
- **卸载 / 热禁用启用**：通过写入 `cordis.patch.yml`，DSH HMR 约 1 秒内重组，无需重启
```

</details>

#### 缺口

- 未核对所有文章与当前官方版本
  **影响**：不能视全部陈述为当前事实
  **进一步探讨**：选定任务逐项回源固定版本的官方源码和文档。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 站点如何从目录产生导航？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

VitePress 将仓库根目录作为源并排除指定目录，使用 generateNav 与 generateAllSidebars；sidebar 递归读取 Markdown 文件和非隐藏子目录并排序，按根目录创建对应导航。独立 generate-indexes 脚本只处理写死的部分目录并覆盖对应 index.md；这两个机制不同，无法由自动导航推断所有目录索引均由脚本同步。

#### 证据与依据

**依据 1 · 源码核查**：[docs/.vitepress/config.ts:52-77](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/178424754f23f30d544de203903539a00f1cc064/docs/.vitepress/config.ts#L52-L77)

文档源、排除规则及忽略死链。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[docs/.vitepress/config.ts:80-89](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/178424754f23f30d544de203903539a00f1cc064/docs/.vitepress/config.ts#L80-L89)

导航和侧栏调用。

<details>
<summary>查看原文（10行）</summary>

```text
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

**依据 3 · 源码核查**：[docs/.vitepress/utils/sidebar.ts:180-219](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/178424754f23f30d544de203903539a00f1cc064/docs/.vitepress/utils/sidebar.ts#L180-L219)

递归扫描和排序。

<details>
<summary>查看原文（40行）</summary>

```text
function generateDynamicSidebarItems(dirPath: string, urlBasePath: string): Array<any> {
  const items: Array<any> = []
  
  if (!fs.existsSync(dirPath)) return items
  
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  
  // 先添加 md 文件
  const mdFiles = entries
    .filter((e: fs.Dirent) => e.isFile() && e.name.endsWith('.md') && e.name !== 'index.md')
    .map((e: fs.Dirent) => e.name)
    .sort()
  
  mdFiles.forEach((file: string) => {
    const fileName = stripMarkdownExtension(file)
    items.push({
      text: fileName,
      link: `${urlBasePath}/${fileName}`
    })
  })
  
  // 再添加子目录
  const subDirs = entries
    .filter((e: fs.Dirent) => e.isDirectory() && !e.name.startsWith('.'))
    .map((e: fs.Dirent) => e.name)
    .sort()
  
  subDirs.forEach((subDir: string) => {
    const subDirPath = path.join(dirPath, subDir)
    const subItems = generateDynamicSidebarItems(subDirPath, `${urlBasePath}/${subDir}`)
    
    if (subItems.length > 0) {
      items.push({
        text: subDir,
        // text: getDisplayName(subDir),
        collapsed: true,
        items: subItems
      })
    }
  })
```

</details>

**依据 4 · 源码核查**：[scripts/generate-indexes.cjs:4-17](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/178424754f23f30d544de203903539a00f1cc064/scripts/generate-indexes.cjs#L4-L17)

索引脚本目录白名单。

<details>
<summary>查看原文（14行）</summary>

```text
const rootDir = path.join(__dirname, '..');
const contentDirs = [
  'claudeCode',
  'cursor',
  'mcp',
  'prompt',
  'rules',
  'skills',
  '部署ai',
  '使用ai技巧',
  '开发ai应用相关问题',
  '好的rules',
  '常用skills'
];
```

</details>

**依据 5 · 源码核查**：[scripts/generate-indexes.cjs:59-65](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/178424754f23f30d544de203903539a00f1cc064/scripts/generate-indexes.cjs#L59-L65)

仅扫描一级 Markdown。

```text
function generateIndex() {
  contentDirs.forEach(dir => {
    const dirPath = path.join(rootDir, dir);
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
      const files = fs.readdirSync(dirPath)
        .filter(f => f.endsWith('.md') && f !== 'index.md')
        .sort();
```

#### 缺口

- 未构建站点或验证全部路由
  **影响**：不能确认构建成功和链接可达
  **进一步探讨**：隔离构建后检查中文路径、嵌套页面和死链。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 文章事实和链接的可信度有什么边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

示例 DSH 文章使用宽泛的架构和“完美重放”等论断，但文本没有绑定明确 DSH 源码提交，不能直接把其作为运行时保证。站点配置 ignoreDeadLinks=true，意味着构建配置不会以死链阻止生成；内容覆盖广也不等于各条已被维护或验证。需要访问文章所指原始仓库并核对具体版本。

#### 证据与依据

**依据 1 · 作者声明**：[deepseek harness/什么是deepseek harness.md:1-10](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/178424754f23f30d544de203903539a00f1cc064/deepseek%20harness/%E4%BB%80%E4%B9%88%E6%98%AFdeepseek%20harness.md#L1-L10)

架构概括与启动示例。

<details>
<summary>查看原文（10行）</summary>

````text
# DeepSeek Harness 深读：一个把"Agent 内核"完全拆掉的运行时

## 一句话结论

**DeepSeek Harness（`dsh`）不是又一个 Agent 框架，而是一个"没有内核"的 Agent 操作系统——从模型适配器到主循环、从工具执行到会话记录，每一个部件都是可以随时替换的插件；所有能力都通过统一的事件总线协作，任何行为都能被拦截、改写或彻底换掉，而不需要 fork 任何代码。**

一行启动：

```sh
npx @deepseek-ai/dsh web
````

</details>

**依据 2 · 作者声明**：[deepseek harness/什么是deepseek harness.md:76-88](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/178424754f23f30d544de203903539a00f1cc064/deepseek%20harness/%E4%BB%80%E4%B9%88%E6%98%AFdeepseek%20harness.md#L76-L88)

绝对化的重放与 fork 声明。

<details>
<summary>查看原文（13行）</summary>

```text
### 3. 硬性不变量："模型可见 ⟺ 已记录"

`dsh` 有一条**运行时会 assert 的不变量**：

> **任何进入模型请求的东西，必须能从会话日志里重建出来。**

也就是说，你想给模型加一段隐藏系统提示词？可以，但**必须先扩展 `SessionEventMap` 加一个新事件类型，把这段内容写进日志**，然后再从日志渲染。

这看起来很麻烦，但换来的是三个几乎"免费"的能力：

1. **完美重放**：任何一次会话都能字节级重现
2. **完美 fork**：任意时点分叉出一个新会话
3. **完美审计/迁移**：日志就是唯一真源，替换存储只是换一个 provider
```

</details>

**依据 3 · 源码核查**：[docs/.vitepress/config.ts:74-77](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/178424754f23f30d544de203903539a00f1cc064/docs/.vitepress/config.ts#L74-L77)

忽略死链配置。

```text
  base: '/Awesome-AI-Pedia/',
  lastUpdated: true,
  cleanUrls: false, // 🔧 修复：关闭 cleanUrls 避免 404
  ignoreDeadLinks: true,
```

#### 缺口

- 未核查 DSH 原项目全部源码与页面链接
  **影响**：不能确认其论断、时效或链接可用性
  **进一步探讨**：对需要使用的条目固定版本回源并逐项验证。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何采用和维护该知识库？

**研究主题**：效果与总成本、采用判断

#### 完整回答

直接阅读源码或网站无需在 DSH 中安装插件；本地构建需要 Node 和 VitePress 依赖，文章应根据任务重新核对版本。自动侧栏按文件组织，但忽略死链和文档来源漂移会增加维护与复核负担。先把内容当检索入口，不可核实的配置或运行安全声明回到官方资料验证；不应执行未经审核的安装命令。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-31](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/178424754f23f30d544de203903539a00f1cc064/package.json#L1-L31)

站点项目和 VitePress 命令。

<details>
<summary>查看原文（31行）</summary>

```text
{
  "name": "awesome-ai-pedia",
  "version": "1.0.0",
  "description": "基于 VitePress 的 AI 知识库与博客平台，涵盖 Claude Code、Cursor、MCP、Prompt、Rules、Skills 等 AI 工具的实战经验与最佳实践。",
  "type": "module",
  "keywords": [
    "ai",
    "vitepress",
    "knowledge-base",
    "claude-code",
    "cursor",
    "mcp",
    "prompt-engineering",
    "blog"
  ],
  "author": "qdleader",
  "license": "MIT",
  "homepage": "https://awesome-ai-pedia.github.io/Awesome-AI-Pedia/",
  "repository": {
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
```

</details>

**依据 2 · 源码核查**：[package.json:32-45](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/178424754f23f30d544de203903539a00f1cc064/package.json#L32-L45)

依赖及 Node 版本。

<details>
<summary>查看原文（14行）</summary>

```text
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
  },
  "volta": {
    "node": "22.22.0"
```

</details>

**依据 3 · 源码核查**：[docs/.vitepress/config.ts:74-89](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/178424754f23f30d544de203903539a00f1cc064/docs/.vitepress/config.ts#L74-L89)

站点导航与死链设置。

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

#### 缺口

- 未检验站点构建、死链数量或维护成本
  **影响**：不能证明当前版本可用或低维护
  **进一步探讨**：在隔离环境构建并检查代表性文章来源和链接。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何帮助读者识别过期 DSH 文章？

**研究主题**：新假设与验证

#### 完整回答

该目录包含产品分析但示例文章未在开头绑定源码提交，站点允许忽略死链。可假设给 DSH 文章增加项目版本、固定源码链接及最后核验日期，能降低读者误用旧说明的概率；这是一项待验证建议，非仓库已覆盖的机制。对照原文章与带来源状态的文章，记录读者发现过期内容的准确率、维护时间与错误信任，若无改善或维护失效则否定。

#### 证据与依据

**依据 1 · 作者声明**：[deepseek harness/什么是deepseek harness.md:1-27](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/178424754f23f30d544de203903539a00f1cc064/deepseek%20harness/%E4%BB%80%E4%B9%88%E6%98%AFdeepseek%20harness.md#L1-L27)

文章开头的 DSH 架构陈述。

<details>
<summary>查看原文（27行）</summary>

````text
# DeepSeek Harness 深读：一个把"Agent 内核"完全拆掉的运行时

## 一句话结论

**DeepSeek Harness（`dsh`）不是又一个 Agent 框架，而是一个"没有内核"的 Agent 操作系统——从模型适配器到主循环、从工具执行到会话记录，每一个部件都是可以随时替换的插件；所有能力都通过统一的事件总线协作，任何行为都能被拦截、改写或彻底换掉，而不需要 fork 任何代码。**

一行启动：

```sh
npx @deepseek-ai/dsh web
# → http://127.0.0.1:3080
```

---

## 一、坐标系：`dsh` 到底站在哪儿？

| 项目 | 隐喻 | 你能改动的边界 |
|---|---|---|
| LangChain / LlamaIndex | 脚本 + 工具箱 | 拼流程 |
| Claude Code / Codex | 打包好的"应用" | 加 hooks、写 skill |
| Cursor | 编辑器里嵌 Agent | 极少 |
| **DeepSeek Harness** | **微内核操作系统** | **一切皆插件，包括主循环** |

DeepSeek 官方给自己的定位是"**a plugin-first agent harness**"。技术上它构建在 [Cordis](https://github.com/cordiverse/cordis) 之上——Cordis 是一个"时空可组合"的插件框架，可以把它理解为 **Agent 世界的 Kubernetes 或 systemd**：负责挂载/卸载模块、事件路由、生命周期管理、副作用回滚。

`dsh` 的所有代码几乎都住在 `packages/` 下面，我数了一下，**大约 60+ 个独立包**，每一个都是一个 Cordis 插件。真正的入口只是一个几十行的 boot loader，把这些插件按 profile 组装起来。
````

</details>

**依据 2 · 源码核查**：[docs/.vitepress/config.ts:74-77](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/blob/178424754f23f30d544de203903539a00f1cc064/docs/.vitepress/config.ts#L74-L77)

站点构建的死链处理。

```text
  base: '/Awesome-AI-Pedia/',
  lastUpdated: true,
  cleanUrls: false, // 🔧 修复：关闭 cleanUrls 避免 404
  ignoreDeadLinks: true,
```

#### 缺口

- 没有过期误用频率和建议效果数据
  **影响**：不能证明新增元数据值得维护
  **进一步探讨**：抽样文章做版本审查并对照读者识别结果。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
