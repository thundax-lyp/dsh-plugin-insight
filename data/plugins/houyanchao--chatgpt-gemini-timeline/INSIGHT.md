# Timeline

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[c1496dd](https://github.com/houyanchao/chatgpt-gemini-timeline/tree/c1496dd107ade3d4e9ae815f6645986eb288bbdf)

<!-- BEGIN META -->
[![GitHub ★ 469](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=469&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/houyanchao/chatgpt-gemini-timeline)
<!-- END META -->

> **功能**：为 AI 网页长对话提供时间轴导航、收藏、提示词、内容导出、高亮与数据备份的浏览器扩展。

> **亮点**：在浏览器页面内组织提问节点及整理入口，ChatGPT针对虚拟DOM引入接口历史补齐、稳定ID导航与滚动采集。[Q01](#research-q01)、[Q02](#research-q02)、[Q03](#research-q03)

> **主要限制**：列表、导出非空和代码运行success都不能直接等于完整或正确；有界采集可能留部分结果，JS runner还会将失败COMPLETE映成success:true，备份覆盖也非事务。[Q03](#research-q03)、[Q04](#research-q04)、[Q05](#research-q05)

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
  - [Q01 · 谁需要什么，根组件属于哪种入口？](#detail-section-11)
  - [Q02 · 虚拟化长对话如何建立列表并跳到正文？](#detail-section-12)
  - [Q03 · 导出与高亮能保证完整保存内容吗？](#detail-section-13)
  - [Q04 · 本地备份和云恢复怎样处理隐私、冲突与失败？](#detail-section-14)
  - [Q05 · 代码运行的成功与隔离边界是什么？](#detail-section-15)
  - [Q06 · 如何采用，哪些设计可迁移，什么假设待检验？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向常回看网页 AI 长对话的用户，在浏览器内按提问导航，并整理和导出有用内容；根组件是浏览器扩展，DSH 原生版本另仓。[Q01](#research-q01)

参照网页内手动滚动和复制保存，以问题节点导航和统一整理降低查找步骤；没有实际效率对照，也未比较所有平台当前原生能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 提问时间轴 | 从节点回到原正文 | 平台适配/接口/DOM，虚拟化跳转有界 |
| 问题列表 | 按提问浏览和回看 | 作者声明支持跳转、收藏及标记，非全站实测 |
| 收藏文件夹 | 组织问答与会话 | 作者功能声明，本轮未逐项跟完收藏管理 |
| 提示词库 | 复用常用输入 | 作者功能声明，本轮未逐项跟完输入链 |
| 高亮与备注 | 保存片段并重载定位 | 文本/位置匹配，须核原文对应 |
| 对话导出 | 输出PNG/PDF/Markdown/TXT/CSV/JSON | 分格式输出不等于全历史或附件无损 |
| JSON导出 | 保存本地独立备份 | 排除内部键与gdriveToken，仍可能含资料文本 |
| JSON导入 | 合并或覆盖恢复 | 同ID导入覆盖；覆盖模式clear后set非事务 |
| Google Drive上传 | 用户授权备份到云文件 | 资料含文本，无另行加密承诺 |
| Google Drive下载 | 从云文件恢复本地 | 校验后合并，同ID覆盖，非实时双向同步 |
| JavaScript运行 | 主动运行选定代码并看日志 | 30秒等待清理，成功语义与消息来源存在边界 |
| 其它语言运行与预览 | 处理TS/SQL/HTML等代码 | 作者分发声明，非本轮全量安全或兼容核查 |
| 公式复制 | 带走可识别公式 | 作者功能声明，普通网页可按需加载 |
| 智能输入与快捷追问 | 辅助网页输入 | 作者支持表分平台有差异，本轮未逐项核查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 支持MV3的浏览器与扩展权限 | 根组件必需 | 内容脚本、存储和后台 | 不能当DSH包安装 |
| 平台DOM、私有接口与登录会话 | 导航条件 | 节点识别及历史补齐 | 缓存/占位或导航失败 |
| 浏览器本地存储 | 整理必需 | 收藏、提示词、高亮、备份 | 写失败需独立备份恢复 |
| Google账号、identity授权与网络 | 云备份可选 | drive.file上传下载 | 保持本地JSON方式，实际服务未测 |
| 随包语言运行器与sandbox | 代码运行可选 | 执行用户选择代码 | 可不用该能力，JS成功语义须单独核查 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 安装与范围 | 用户核浏览器扩展权限，选一个平台 | 根浏览器入口，与DSH另仓分开 |
| 样本核查 | 用户在非敏感长会话核首中末和分支 | 列表、落点和正文一致 |
| 保存 | 用户导出并核问答、附件与顺序 | 有文件不等于全量，缺失回原页面 |
| 迁移 | 先留JSON，再在样本上试合并/恢复 | 同ID导入覆盖，冲突先停止 |
| 退出 | 用户禁用平台功能或扩展 | 回原页面；保留需要的独立备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 浏览器扩展和本地存储，金额未知 | 核权限、平台与样本 | 浏览器实测耗时未知 |
| 持续 | DOM观察、页面缓存、历史请求 | 整理及平台改版后复核 | 无内存、节时或ROI测量 |
| 云备份 | 网络和Google存储费用未知 | 授权、检查载荷及冲突 | 用户资料可能含文本，不是端到端加密承诺 |
| 失败恢复 | 重试及备份资源未知 | 核部分导出、超时、旧状态 | 覆盖clear后set失败需外部备份 |
| 退出 | 备份文件继续占存储 | 禁用并保留必要文件 | 迁移往返完整性需自验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 找回问题 | 接口补齐、稳定ID与有界导航 | 各站和分支的实际完整性、速度 |
| 带走内容 | DOM边滚边采与多格式输出 | 附件、历史、公式是否无损 |
| 数据迁移 | JSON及授权云上传/合并 | 往返恢复及多设备冲突正确性 |
| 代码运行 | 主动执行与30秒等待清理 | 安全隔离；success存在语义缺口 |

> **思考**：列表、导出非空和代码运行success都不能直接等于完整或正确；有界采集可能留部分结果，JS runner还会将失败COMPLETE映成success:true，备份覆盖也非事务。[Q03](#research-q03)、[Q04](#research-q04)、[Q05](#research-q05)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：在浏览器页面内组织提问节点及整理入口，ChatGPT针对虚拟DOM引入接口历史补齐、稳定ID导航与滚动采集。[Q01](#research-q01)、[Q02](#research-q02)、[Q03](#research-q03)

[Q02](#research-q02) 请求序号、稳定ID和共同期限应与[Q06](#research-q06) 分层加载一起理解；[Q05](#research-q05) 不能让消息type代替来源验证，也不能忽略子执行的失败标记。

<a id="detail-section-5"></a>

### 1.4 主要限制

列表、导出非空和代码运行success都不能直接等于完整或正确；有界采集可能留部分结果，JS runner还会将失败COMPLETE映成success:true，备份覆盖也非事务。[Q03](#research-q03)、[Q04](#research-q04)、[Q05](#research-q05)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在单站非敏感长会话核对首、中、末问题的列表、落点与导出，并留独立 JSON 备份后再试恢复。缺失、误跳、错配或冲突时关闭对应能力，回原页面与备份；代码运行须独立审查。[Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持浏览器内导航与整理链；跨平台兼容、完整性、节时和全面隐私未实测，JS结构化成功存在明确语义缺口。

- 已检查：作者 README、包清单、源码路径 README.md、manifest.json、js/content/bootstrap.js、js/content/page-features.js、js/timeline/index.js、js/apiCapture/chatgpt.js、js/timeline/adapters/chatgpt.js、js/timeline/timeline-manager.js、js/conversationExport/adapters/chatgpt.js、js/conversationExport/export-manager.js、js/highlight/highlight-manager.js、js/background.js、js/panelModal/tabs/dataSync/index.js、js/runner/index.js、js/runner/runner-manager.js、js/runner/languages/javascript/index.js、js/runner/languages/javascript/sandbox-manager.js、js/runner/languages/javascript/sandbox-script.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交源码核查：浏览器身份、按需入口、ChatGPT时间轴/导出、高亮恢复、备份及JS runner主要链。未执行目标、浏览器、OAuth或代码；未全面审计其它站点、其它语言运行器、提示词/输入、宠物和水印。
- 下一步：固定非敏感长会话和分支，核首中末列表、落点、导出；再测JSON往返及冲突和覆盖失败，单独用抛错代码核运行结果，不由本文执行。

**分析版本**

- **仓库**：[houyanchao/chatgpt-gemini-timeline](https://github.com/houyanchao/chatgpt-gemini-timeline)
- **版本号**：包版本未声明；扩展版本 4.8.1（manifest.json:5；[固定提交 c1496dd](https://github.com/houyanchao/chatgpt-gemini-timeline/tree/c1496dd107ade3d4e9ae815f6645986eb288bbdf)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

将历史与导出的完整性、停止原因和运行真实结果共同显示，检验能否降低误判完成及人工漏项；未实现与验证。[Q06](#research-q06)

固定非敏感长会话和分支，核首中末列表、落点、导出；再测JSON往返及冲突和覆盖失败，单独用抛错代码核运行结果，不由本文执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 190 | 108358 | 76689 | 19333 | — |
| .md | source | 10 | 2128 | — | — | 14862 |

</details>

**活跃度**

[![Issue 未关闭 107](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=107&color=737b86&logo=github)](https://github.com/houyanchao/chatgpt-gemini-timeline/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=14&color=737b86&logo=github)](https://github.com/houyanchao/chatgpt-gemini-timeline/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/houyanchao/chatgpt-gemini-timeline/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：区分根浏览器扩展与DSH另仓，核查长对话导航、保存、迁移的贡献及正确性边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要什么，根组件属于哪种入口？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向反复回看网页AI长对话、保存片段并跨浏览器迁移个人整理资料的用户。参照原页面滚动和手工复制，本扩展把提问节点、问题列表、收藏整理、提示词与内容导出放进页面；合格结果是找到正确问题及其原正文，并带走用户确实选定的内容。本仓根是Manifest V3浏览器扩展4.8.1，真实类型tool；README所指DSH原生dsh-timeline在另一仓，本次不能把浏览器源码当作DSH接线。作者提供多平台支持表，但各功能格不同，NotebookLM没有时间轴支持声明；没有本轮浏览器实测，不能称所有平台兼容或效率翻倍。与手动滚动的增量是按提问组织导航与后续整理，未独立比较其他扩展或平台最新原生功能。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-95](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/README.md#L24-L95)

作者列出另仓DSH、场景、功能和分平台支持表。

<details>
<summary>查看原文（72行）</summary>

```text
## DeepSeek Harness

Timeline 现已支持 DeepSeek Harness。如果你在用 DeepSeek Harness，可以安装原生插件 **dsh-timeline** —— 时间轴、收藏文件夹、提示词库、对话导出、公式复制，熟悉的功能都在，主题跟随、开箱即用。

仓库地址：<https://github.com/houyanchao/dsh-timeline>

## Timeline是什么？

Timeline 是专为 ChatGPT、Gemini、DeepSeek 等 AI 对话页面打造的浏览器提效插件。它不改平台原有界面，只在页面里补上长对话真正缺的能力：时间轴导航、收藏整理、提示词库、对话导出、公式复制和数据备份。

和 AI 聊得越久，翻找就越费劲：

- 想回看某次提问，只能一路往上滚。
- 有价值的结论散落在不同会话里，事后很难再找到。
- 公式、代码、图表不好带走，复制粘贴也费事。
- 各平台输入习惯不一样，常用提示词和追问流程要反复操作。
- 插件数据困在单个浏览器里，换设备或换浏览器不好迁移。

## 安装

推荐通过浏览器官方商店安装：

| 浏览器 | 安装入口 |
| --- | --- |
| Chrome | **[安装 Chrome 版](https://chromewebstore.google.com/detail/timeline-ai-chat/fgebdnlceacaiaeikopldglhffljjlhh)** |
| Microsoft Edge | **[安装 Edge 版](https://microsoftedge.microsoft.com/addons/detail/ai-timeline%EF%BC%9A%E5%8A%A9%E4%BD%A0%E4%BD%BF%E7%94%A8-ai-%E6%95%88%E7%8E%87%E7%BF%BB%E5%80%8D-/ekednjjojnhlajfobalaaihkibbdcbab)** |
| Firefox | **[安装 Firefox 版](https://addons.mozilla.org/en-US/firefox/addon/ai-timeline/)** |
| DeepSeek Harness | **[前往 GitHub 安装 dsh-timeline](https://github.com/houyanchao/dsh-timeline)** |

安装后打开受支持的 AI 对话页面即可使用。大多数功能默认开启，也可以在扩展设置面板中按平台或功能关闭。

## 功能

| 分类 | 说明 |
| --- | --- |
| 对话导航 | 在页面右侧生成时间轴，每个节点对应一次用户提问，支持点击跳转、键盘导航、回到底部和提问时间标签。 |
| 问题列表 | 将当前会话中的问题集中展示，支持跳转、收藏和标记重点，适合按问题维度回顾长对话。 |
| 收藏与归档 | 支持收藏单条问答或整页会话，并使用文件夹、备注和搜索进行管理。部分平台支持在原生侧边栏中展示收藏入口。 |
| 输入增强 | 支持提示词库、快捷追问、智能 Enter 行为、输入框动画和常用设置入口。 |
| 阅读与复制 | 支持文本高亮、LaTeX / MathML 公式复制、Mermaid 图表预览和代码块辅助操作。 |
| 代码运行 | 支持 JavaScript、TypeScript、SQL、HTML、JSON、Markdown 等常见代码块的运行或预览。 |
| 数据管理 | 支持 JSON 导入导出、Google Drive 备份与恢复，用于数据迁移和多设备同步。 |
| 个性化设置 | 支持时间轴主题色、对话宽度调整、多语言界面和细粒度功能开关。 |

## 支持平台

| 平台 | 时间轴 | 高亮 | 智能输入 | 输入动画 | 快捷追问 | 提问时间 | 侧边栏收藏 | 回到底部 |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| ChatGPT | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 | - |
| Gemini | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 |
| DeepSeek | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 | - |
| Claude | 支持 | 支持 | 支持 | - | 支持 | - | 支持 | - |
| Kimi | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 | - |
| 豆包 | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 | - |
| 通义千问 | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 | - |
| Qwen 国际版 | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 | - |
| Grok | 支持 | 支持 | 支持 | 支持 | 支持 | - | - | - |
| Perplexity | 支持 | 支持 | 支持 | - | 支持 | - | - | - |
| 腾讯元宝 | 支持 | 支持 | 支持 | 支持 | 支持 | - | - | - |
| 文心一言 | 支持 | 支持 | - | - | 支持 | - | - | - |
| NotebookLM | - | 支持 | 支持 | - | 支持 | - | - | - |

公式复制、代码运行和 Mermaid 图表能力不依赖特定 AI 平台。只要页面中存在可识别内容，扩展会尽量提供对应操作。

## 数据与隐私

Timeline 的核心数据默认保存在浏览器本地，包括收藏、文件夹、提示词、设置项、时间标签和笔记内容。

可选的 Google Drive 同步只会在用户主动授权后使用，并用于备份和恢复扩展数据。扩展不会收集、上传或分享用户的对话内容和个人信息。

本项目已开源，所有数据处理逻辑都可以在仓库中审查。

```

</details>

**依据 2 · 源码核查**：[manifest.json:1-39](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/manifest.json#L1-L39)

MV3、4.8.1、权限及service worker入口。

<details>
<summary>查看原文（39行）</summary>

```text
{
  "manifest_version": 3,
  "name": "__MSG_extName__",
  "short_name": "Timeline",
  "version": "4.8.1",
  "description": "__MSG_extDescription__",
  "default_locale": "en",
  "author": "yanchao hou",
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "permissions": [
    "storage",
    "unlimitedStorage",
    "identity",
    "activeTab",
    "scripting"
  ],
  "host_permissions": [
    "https://*.chatgpt.com/*",
    "https://chat.openai.com/*",
    "https://gemini.google.com/*",
    "https://*.doubao.com/*",
    "https://chat.deepseek.com/*",
    "https://yiyan.baidu.com/*",
    "https://*.qianwen.com/*",
    "https://chat.qwen.ai/*",
    "https://*.kimi.com/*",
    "https://kimi.moonshot.cn/*",
    "https://yuanbao.tencent.com/*",
    "https://*.grok.com/*",
    "https://*.perplexity.ai/*",
    "https://*.claude.ai/*",
    "https://notebooklm.google.com/*"
  ],
  "background": {
    "service_worker": "js/background.js"
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 虚拟化长对话如何建立列表并跳到正文？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

平台识别后时间轴入口按版本号去重初始化，旧URL或失败manager被销毁。ChatGPT在MAIN世界document_start补丁fetch，克隆匹配响应而返回原Promise；旧mapping沿current_node父链取当前分支，新分页源则在时间轴pull后先尝试完整mapping，再沿before游标补历史，沿用页面认证头。请求序号防止过期快照覆盖；重复游标、无新增消息或200页停止，已读内容保留。历史读取有AbortController，切换对话或显式重试可abort，但read fetch/JSON未设置自己的时间期限，网络悬挂可让加载保持，需要重试或离页。接口捕获失败时adapter退到渲染文本缓存和占位；列表存在不代表目标正文已挂载。点击导航沿marker稳定ID重新找节点，外层共用120秒期限；adapter正常导航20秒无进展可提前失败、waitForTarget收藏定位不适用该20秒短路，单轮等渲染最多2秒，目标卸载后仍在原期限内重找。显式取消、换目标与销毁中止；手动滚动本身不取消，失败/显式取消在同会话恢复初始位置。列表是受接口、分支和DOM共同约束的视图，不是全量对话正确性的保证。

#### 证据与依据

**依据 1 · 源码核查**：[js/timeline/index.js:154-188](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/timeline/index.js#L154-L188)

版本隔离、实例创建和失败销毁。

<details>
<summary>查看原文（35行）</summary>

```text
async function initializeTimeline(version = initVersion) {
    if (timelineInitInFlight) {
        if (timelineInitInFlightVersion === version) {
            return timelineInitInFlight;
        }
    }

    timelineInitInFlightVersion = version;
    timelineInitInFlight = (async () => {
        // Detect current site adapter
        const adapter = await resolveCurrentAdapter();
        if (!adapter || version !== initVersion) {
            return false;
        }

        destroyTimelineInstance();

        const manager = new TimelineManager(adapter);
        timelineManagerInstance = manager;

        try {
            const initialized = await manager.init();
            if (!initialized || version !== initVersion || timelineManagerInstance !== manager) {
                try { manager.destroy(); } catch {}
                if (timelineManagerInstance === manager) {
                    timelineManagerInstance = null;
                }
                return false;
            }
        } catch (err) {
            if (timelineManagerInstance === manager) {
                timelineManagerInstance = null;
            }
            try { manager.destroy(); } catch {}
            return false;
```

</details>

**依据 2 · 源码核查**：[js/apiCapture/chatgpt.js:117-180](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/apiCapture/chatgpt.js#L117-L180)

历史补齐真实请求、游标上限、abort和保留部分结果。

<details>
<summary>查看原文（64行）</summary>

```text
  // 历史请求沿用页面请求的认证头，仅在时间轴请求数据后启动；不修改页面响应。
  const ensureFullHistory = async (conversationId) => {
    const source = sectionedSources.get(conversationId);
    if (!location.pathname.split('/').includes(conversationId) || !source || historyLoads.has(conversationId)
      || latestSnapshotRequestByConversation.get(conversationId) !== source.requestSequence
      || timelineEntriesByConversation.get(conversationId)?.complete) return;
    const controller = new AbortController();
    historyLoads.set(conversationId, controller);
    // 等同步拉取返回后再通知，避免状态被外层尚未处理的桥接结果覆盖。
    Promise.resolve().then(() => emitHistoryLoading(conversationId));
    const isCurrent = () => !controller.signal.aborted && sectionedSources.get(conversationId) === source
      && latestSnapshotRequestByConversation.get(conversationId) === source.requestSequence
      && location.pathname.split('/').includes(conversationId);
    const read = async url => {
      const response = await origFetch(new Request(url, {
        headers: source.headers, credentials: source.credentials, signal: controller.signal
      }));
      if (!response.ok) throw new Error(`History HTTP ${response.status}`);
      return response.json();
    };
    try {
      // 兼容仍提供完整 mapping 的服务端，优先一份快照，避免逐页请求。
      try {
        const fullUrl = new URL(`/backend-api/conversation/${encodeURIComponent(conversationId)}`, location.origin);
        const full = await read(fullUrl);
        if (!isCurrent()) return;
        if (full?.mapping && full.mapping[full.current_node]) {
          const chain = linearize(full);
          if (chain.length < 10000 && !(chain[0]?.parent && !full.mapping[chain[0].parent])) {
            publishEntries(conversationId, userEntries(chain.filter(node => node.message).map(node => ({ ...node.message, id: node.id }))), true, source.requestSequence);
            return;
          }
        }
      } catch (error) {
        if (!isCurrent()) return;
      }
      let page = source.json;
      let messages = [...page.messages];
      const seenCursors = new Set();
      for (let pageIndex = 0; page.page_info?.has_previous_page; pageIndex++) {
        if (!isCurrent()) return;
        const cursor = page.page_info.start_cursor;
        if (!cursor || seenCursors.has(cursor) || pageIndex >= 200) throw new Error('History pagination made no progress');
        seenCursors.add(cursor);
        const url = new URL(source.url);
        url.searchParams.set('num_turns', '100');
        url.searchParams.set('before', cursor);
        const previous = await read(url);
        if (!isCurrent()) return;
        if (!Array.isArray(previous.messages)) throw new Error('History response has no messages');
        const known = new Set(messages.map(message => message.id));
        const older = previous.messages.filter(message => message.id && !known.has(message.id));
        if (!older.length) throw new Error('History pagination returned no older messages');
        messages = [...older, ...messages];
        page = previous;
        publishEntries(conversationId, userEntries(messages), page.page_info?.has_previous_page === false, source.requestSequence);
      }
    } catch {
      // 保留已读取的历史，结束加载状态，后续可重新尝试。
    } finally {
      if (historyLoads.get(conversationId) === controller) {
        historyLoads.delete(conversationId);
        emitHistoryLoading(conversationId);
      }
```

</details>

**依据 3 · 源码核查**：[js/apiCapture/chatgpt.js:184-198](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/apiCapture/chatgpt.js#L184-L198)

沿当前节点回溯，缺失时叶子兜底。

<details>
<summary>查看原文（15行）</summary>

```text
  // ---- mapping 线性化：沿 current_node 父链回溯出当前显示分支 ----
  const linearize = (json) => {
    const mapping = json?.mapping || {};
    let cur = json?.current_node;
    if (!cur || !mapping[cur]) {
      // 兜底：任取一个叶子节点（无 children）
      cur = Object.keys(mapping).find(id => !(mapping[id]?.children?.length));
    }
    const chain = [];
    let guard = 0;
    while (cur && mapping[cur] && guard++ < 10000) {
      chain.push(mapping[cur]);
      cur = mapping[cur].parent;
    }
    return chain.reverse();
```

</details>

**依据 4 · 源码核查**：[js/apiCapture/chatgpt.js:264-311](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/apiCapture/chatgpt.js#L264-L311)

fetch补丁匹配响应与原Promise返回。

<details>
<summary>查看原文（48行）</summary>

```text
  // ---- fetch 补丁 ----
  // 匹配 GET /backend-api/conversation/{uuid}（POST /backend-api/conversation 是发消息的 SSE 流，排除）
  const CONV_URL_RE = /\/backend-api\/conversation\/([0-9a-f][0-9a-f-]{18,})(?:[?#]|$)/i;
  const SECTIONED_URL_RE = /\/backend-api\/conversations\/([0-9a-f][0-9a-f-]{18,})(?:[?#]|$)/i;
  const origFetch = window.fetch;
  window.fetch = function (...args) {
    const p = origFetch.apply(this, args);
    try {
      const rawUrl = typeof args[0] === 'string' ? args[0] : (args[0]?.url || args[0]?.href || '');
      const method = String(args[1]?.method || (typeof args[0] === 'object' ? args[0]?.method : '') || 'GET').toUpperCase();
      const match = rawUrl.match(CONV_URL_RE);
      const sectionedMatch = rawUrl.match(SECTIONED_URL_RE);
      if (sectionedMatch && method === 'GET') {
        const conversationId = sectionedMatch[1];
        const url = new URL(rawUrl, location.href);
        // 页面自身分页只补 DOM，不能替换分支快照或打断扩展的历史补齐。
        const isPagination = url.searchParams.has('before') || url.searchParams.has('cursor');
        if (isPagination && latestSnapshotRequestByConversation.has(conversationId)) return p;
        const headers = new Headers(args[1]?.headers || args[0]?.headers || {});
        const credentials = args[1]?.credentials || args[0]?.credentials || 'same-origin';
        const requestSequence = beginSnapshotRequest(conversationId);
        p.then(async response => {
          if (!response?.ok) return;
          const json = await response.clone().json();
          if (!Array.isArray(json.messages)) return;
          if (latestSnapshotRequestByConversation.get(conversationId) !== requestSequence) return;
          latestAppliedRequestByConversation.set(conversationId, requestSequence);
          sectionedSources.set(conversationId, { url: url.href, headers, credentials, json, requestSequence });
          const entries = userEntries(json.messages);
          publishEntries(conversationId, entries, json.page_info?.has_previous_page === false, requestSequence);
          if (requestedHistories.has(conversationId)) void ensureFullHistory(conversationId);
        }).catch(() => {});
      }
      if (match && method === 'GET') {
        const conversationId = match[1];
        const requestSequence = beginSnapshotRequest(conversationId);
        p.then(resp => {
          if (resp && resp.ok) {
            resp.clone().json()
              .then(json => {
                capture(conversationId, json, requestSequence);
              })
              .catch(() => {});
          }
        }).catch(() => {});
      }
    } catch { /* 补丁逻辑绝不影响页面请求本身 */ }
    return p;
```

</details>

**依据 5 · 源码核查**：[js/timeline/adapters/chatgpt.js:49-89](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/timeline/adapters/chatgpt.js#L49-L89)

事件桥、快照与文本缓存合并。

<details>
<summary>查看原文（41行）</summary>

```text
    _pullConvTexts(conversationId, { restartHistory = false } = {}) {
        let received = null;
        const handler = (event) => {
            if (typeof event.detail !== 'string') return;
            try {
                const payload = JSON.parse(event.detail);
                if (payload?.conversationId === conversationId) received = payload;
            } catch {
                received = null;
            }
        };
        document.addEventListener('ait-gpt-user-texts-result', handler, { once: true });
        document.dispatchEvent(new CustomEvent('ait-gpt-user-texts-pull', {
            detail: restartHistory ? JSON.stringify({ conversationId, restartHistory: true }) : conversationId
        }));
        document.removeEventListener('ait-gpt-user-texts-result', handler);

        const texts = received ? received.texts : null;
        const previousTimeline = JSON.stringify(this._capturedTimeline);
        this._capturedTimeline = received?.timeline || null;
        this._capturedTimelineConvId = conversationId;
        this._historyLoading = { conversationId, loading: received?.historyLoading === true };
        const timelineChanged = JSON.stringify(this._capturedTimeline) !== previousTimeline;
        if (!texts) return timelineChanged ? 1 : 0;

        const nextCapturedTextIds = new Set(Object.keys(texts));
        let changedCount = timelineChanged ? 1 : 0;
        // 只清理上一份 API 快照拥有、但最新快照已不存在的键。
        // DOM 机会性缓存的新增消息不在 _capturedTextIds 中，因此会被保留。
        this._capturedTextIds.forEach(id => {
            if (!nextCapturedTextIds.has(id) && this._turnTextCache.delete(id)) {
                changedCount++;
            }
        });
        Object.entries(texts).forEach(([id, txt]) => {
            const previous = this._turnTextCache.get(id);
            this._cacheTurnText(id, txt);
            if (this._turnTextCache.get(id) !== previous) changedCount++;
        });
        this._capturedTextIds = nextCapturedTextIds;
        return changedCount;
```

</details>

**依据 6 · 源码核查**：[js/timeline/adapters/chatgpt.js:249-371](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/timeline/adapters/chatgpt.js#L249-L371)

渲染等待、总期限、20秒无进展与初始位置恢复。

<details>
<summary>查看原文（123行）</summary>

```text
    // 与导出相同：先给虚拟内容启动渲染的时间，再等待 DOM 安静，设置硬超时。
    _waitForTimelineRender(signal) {
        if (signal.aborted) return Promise.resolve();
        return new Promise(resolve => {
            const startedAt = Date.now();
            let quietTimer, maxTimer, done = false;
            const finish = () => {
                if (done) return;
                done = true;
                observer.disconnect(); clearTimeout(quietTimer); clearTimeout(maxTimer);
                signal.removeEventListener('abort', finish); resolve();
            };
            const schedule = () => {
                clearTimeout(quietTimer);
                quietTimer = setTimeout(finish, Math.max(180, 580 - (Date.now() - startedAt)));
            };
            const observer = new MutationObserver(schedule);
            observer.observe(document.querySelector('[data-thread-find-target="conversation"]') || document.body, {
                childList: true, subtree: true, attributes: true,
                attributeFilter: ['data-is-intersecting', 'data-turn', 'data-turn-key']
            });
            signal.addEventListener('abort', finish, { once: true });
            maxTimer = setTimeout(finish, 2000);
            schedule();
            if (signal.aborted) finish();
        });
    }

    async resolveTimelineTarget(marker, scrollContainer, signal, onProgress, navigation = {}) {
        const conversationId = this.extractConversationId(location.pathname);
        const targetId = marker.id.slice('chatgpt-'.length);
        const initialScrollTop = scrollContainer.scrollTop;
        // 多次重挂载仍属于同一次导航，共用总超时，避免不断重新计时。
        const deadline = Math.min(Date.now() + 120000, navigation.deadline ?? Infinity);
        const checkedIds = new Set();
        let maxKnownEntries = 0, seenTargetShell = false, maxTargetChildren = 0;
        let foundTarget = null, lastSignature = '', lastProgressAt = Date.now();
        let lowerPosition = null, upperPosition = null, searchSnapshot = '';
        try {
            while (!signal.aborted && Date.now() < deadline
                && this.extractConversationId(location.pathname) === conversationId) {
                const target = this._findTimelineTarget(targetId);
                if (this.isTimelineTargetReady(target)) {
                    foundTarget = target;
                    return target;
                }
                const userElements = [...document.querySelectorAll(this.getUserMessageSelector())];
                const entries = this.getCapturedTimelineEntries(userElements) || userElements.map((element, index) => ({
                    id: this.generateTurnId(element, index), element
                }));
                const targetIndex = entries.findIndex(entry => entry.id === marker.id);
                const entryTarget = entries[targetIndex]?.element;
                if (this.isTimelineTargetReady(entryTarget)) {
                    foundTarget = entryTarget;
                    return entryTarget;
                }
                const loadedIndexes = [];
                entries.forEach((entry, index) => {
                    if (!this.isTimelineTargetReady(entry.element)) return;
                    checkedIds.add(entry.id); loadedIndexes.push(index);
                });
                onProgress?.({ checked: checkedIds.size, targetIndex, total: entries.length });
                maxKnownEntries = Math.max(maxKnownEntries, entries.length);
                seenTargetShell ||= !!target;
                maxTargetChildren = Math.max(maxTargetChildren, target?.childElementCount || 0);
                // 仅新内容或目标结构变化算进展；顶底切换、空白高度变化不能反复延长加载。
                const signature = `${checkedIds.size}:${maxKnownEntries}:${seenTargetShell}:${maxTargetChildren}`;
                if (signature !== lastSignature) {
                    lastProgressAt = Date.now(); lastSignature = signature;
                }
                // 收藏定位由外层两分钟期限控制，不能因正文暂未到达在 20 秒提前结束。
                else if (!navigation.waitForTarget && Date.now() - lastProgressAt > 20000) {
                    return null;
                }
                if (!target && (targetIndex < 0 || !loadedIndexes.length)) {
                    // 虚拟列表重排时可能暂时没有可用锚点，等待恢复，不盲目滚动。
                    await this._waitForTimelineRender(signal);
                    continue;
                }
                window.__aitPreventAutoScroll?.notifyUserNavigation?.({ durationMs: 2500 });
                const from = scrollContainer.scrollTop;
                if (target) {
                    // 已有目标空壳时直接锚定它；重排后每轮重新读取其位置。
                    scrollContainer.scrollTop += target.getBoundingClientRect().top
                        - scrollContainer.getBoundingClientRect().top - 80;
                } else {
                    const containerTop = scrollContainer.getBoundingClientRect().top;
                    // 首次向顶/底查找；两侧都越过目标后，在两次落点之间查找。
                    // 虚拟列表只挂载附近消息，反复跳顶底会始终跳过中间目标。
                    const preceding = loadedIndexes.filter(index =>
                        entries[index].element.getBoundingClientRect().top <= containerTop);
                    const currentIndex = preceding.length ? preceding[preceding.length - 1] : loadedIndexes[0];
                    const direction = targetIndex < currentIndex ? 'top' : 'bottom';
                    const maxScrollTop = Math.max(0, scrollContainer.scrollHeight
                        - (scrollContainer.clientHeight || window.innerHeight));
                    const snapshot = `${entries.length}:${targetIndex}`;
                    if (snapshot !== searchSnapshot) {
                        lowerPosition = upperPosition = null;
                        searchSnapshot = snapshot;
                    }
                    // 保存比例，避免懒加载图片或历史插入改变总高度后沿用旧像素位置。
                    const position = maxScrollTop > 0 ? Math.max(0, Math.min(1, from / maxScrollTop)) : 0;
                    if (direction === 'top') {
                        if (lowerPosition !== null && position <= lowerPosition) lowerPosition = null;
                        upperPosition = position;
                    } else {
                        if (upperPosition !== null && position >= upperPosition) upperPosition = null;
                        lowerPosition = position;
                    }
                    if (lowerPosition !== null && upperPosition !== null) {
                        scrollContainer.scrollTop = (lowerPosition + upperPosition) / 2 * maxScrollTop;
                    } else {
                        scrollContainer.scrollTop = direction === 'top' ? 0 : maxScrollTop;
                    }
                }
                await this._waitForTimelineRender(signal);
            }
            return null;
        } finally {
            // 手动取消或加载失败时回到出发位置；切换目标或离开页面时不抢位置。
            if (!foundTarget && this.extractConversationId(location.pathname) === conversationId
                && (!signal.aborted || signal.reason === 'cancel-navigation')) scrollContainer.scrollTop = initialScrollTop;
        }
```

</details>

**依据 7 · 源码核查**：[js/timeline/timeline-manager.js:2578-2627](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/timeline/timeline-manager.js#L2578-L2627)

取消前次导航、120秒共用期限及按ID重新解析。

<details>
<summary>查看原文（50行）</summary>

```text
        if (!marker) return false;
        this._markerNavigationController?.abort('superseded-navigation');
        const controller = new AbortController();
        this._markerNavigationController = controller;
        const deadline = Date.now() + 120000;
        const isReady = element => element?.isConnected
            && (this.adapter.isTimelineTargetReady?.(element) ?? true);
        if (!isReady(marker.element) && !this.adapter.resolveTimelineTarget) return false;

        let loading = null;
        const closeLoading = () => {
            if (!loading) return;
            loading.close();
            loading = null;
        };
        const cleanup = () => {
            closeLoading();
            controller.signal.removeEventListener('abort', cleanup);
        };
        // 手动滚动不取消导航；仅显式取消、切换目标或销毁页面时中止。
        controller.signal.addEventListener('abort', cleanup, { once: true });
        const navigate = async () => {
            let element = marker.element;
            while (!controller.signal.aborted && !this._destroyed && Date.now() < deadline) {
                if (!isReady(element)) {
                    if (!this.adapter.resolveTimelineTarget) return false;
                    loading = this._showNodeNavigationLoading(controller);
                    element = await this.adapter.resolveTimelineTarget(marker, this.scrollContainer,
                        controller.signal, undefined, { deadline });
                    closeLoading();
                    if (controller.signal.aborted || this._destroyed || !isReady(element)) return false;
                }
                const reached = await this.smoothScrollTo(element, 400, {
                    signal: controller.signal,
                    onComplete: () => {
                        if (controller.signal.aborted || this._destroyed || !this.markerMap.has(marker.id)) return;
                        const previousId = this.activeTurnId;
                        this.activeChangeTimer = TimelineUtils.clearTimerSafe(this.activeChangeTimer);
                        this.pendingActiveId = null;
                        this.activeTurnId = marker.id;
                        this.updateActiveDotUI(); this.syncTimelineTrackToMain();
                        if (previousId !== marker.id) this._emitActiveChange(previousId, marker.id);
                    }
                });
                if (reached) return true;
                // 动画中途被虚拟列表卸载后，继续按原 ID 查找，不使用旧元素或旧序号。
                element = null;
            }
            return false;
        };
```

</details>

#### 缺口

- 没有实际长会话、分支切换或平台接口变更下的列表完整性和落点测试。
  **影响**：只能确认防竞态与导航设计，不能确认每次都找到全部正确轮次。
  **进一步探讨**：准备已知首中末与分支问题的长会话，逐项核列表、落点、取消和悬挂重试。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 导出与高亮能保证完整保存内容吗？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

导出与时间轴API捕获是不同路径：ChatGPT导出逐个虚拟空壳滚动、边渲染边收集用户与助手，以稳定ID合并顺序再配对，避免只读取最后窗口。当前URL/请求和取消标志在manager端阻止旧结果进入弹窗；采集上限800轮、连续5轮无新增可停止，顶端预加载亦有有限重试，所以得到非空turns不等于全历史完整，必须抽核首中末和问答配对。输出manager可选PNG、打印PDF、Markdown、TXT、CSV、JSON，完成提示代表输出调用返回，不能当所有附件、公式和历史被无损保存。高亮保存原文、前后文、位置与备注，恢复有精确/模糊匹配并在DOM重建后重找；重复原文、渲染变化或未挂载内容可能匹配失败或需要用户核对，不能当不可变文档引用。作者另外声明提示词、智能输入、公式复制等，本轮未逐项跟完这些入口，不将其完整行为纳入源码确认。

#### 证据与依据

**依据 1 · 源码核查**：[js/conversationExport/adapters/chatgpt.js:185-260](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/conversationExport/adapters/chatgpt.js#L185-L260)

有界滚动采集、无进展停止、按完整顺序配对和恢复滚动。

<details>
<summary>查看原文（76行）</summary>

```text
        let stableTop = 0;
        for (let attempt = 0; attempt < 30 && stableTop < 2; attempt++) {
            if (shouldCancel?.()) {
                try { scrollTo(initialScrollTop); } catch {}
                return [];
            }
            const beforeRange = scrollRange();
            scrollTo(reverse ? -beforeRange : 0);
            await this._wait(1000);
            await this._waitWhileLoading(2000);
            const range = scrollRange();
            const atTop = Math.abs(getScrollTop() - (reverse ? -range : 0)) <= 2;
            stableTop = atTop && Math.abs(range - beforeRange) <= 2 ? stableTop + 1 : 0;
        }
        collectRendered();

        // 逐个把未处理空壳滚进视口渲染并采集
        const maxRounds = 800;
        let stagnantRounds = 0;
        for (let round = 0; round < maxRounds; round++) {
            if (shouldCancel?.()) {
                try { scrollTo(initialScrollTop); } catch { /* ignore */ }
                return [];
            }

            const shell = nextPendingShell();
            if (!shell) {
                // 当前 DOM 已采完不代表历史已采完；向下扫屏触发下一窗口渲染。
                const bottom = reverse ? 0 : scrollRange();
                const current = getScrollTop();
                if (bottom - current <= 1) break;
                const viewport = isWin ? window.innerHeight : (scroller.clientHeight || window.innerHeight);
                scrollTo(Math.min(bottom, current + Math.max(1, viewport * 0.8)));
                await this._wait(400);
                await this._waitWhileLoading(2000);
                collectRendered();
                if (Math.abs(getScrollTop() - current) < 1) {
                    if (++stagnantRounds >= 5) break;
                } else stagnantRounds = 0;
                continue;
            }

            const beforeCaptured = capturedMessages.size;
            const beforeProcessed = processedIds.size;

            // 元素锚定滚动：按空壳当前实时位置，把它滚到视口上沿附近
            const rect = shell.getBoundingClientRect();
            const viewTop = isWin ? 0 : scroller.getBoundingClientRect().top;
            scrollTo(getScrollTop() + (rect.top - viewTop) - 80);
            await this._wait(400);              // 渲染启动
            await this._waitWhileLoading(2000); // DOM 稳定确认
            collectRendered();
            // 新版每轮都滚动到一次，触发虚拟内容渲染后才标记完成。
            const modernTurnId = shell.getAttribute('data-turn-key');
            if (modernTurnId && capturedMessages.has(modernTurnId)) {
                processedIds.add(modernTurnId);
            }

            // 连续多轮既无新采集也无新渲染 → 虚拟化不再响应，避免死循环
            if (capturedMessages.size === beforeCaptured && processedIds.size === beforeProcessed) {
                stagnantRounds++;
                if (stagnantRounds >= 5) break;
            } else {
                stagnantRounds = 0;
            }
        }
        collectRendered(); // 结束前最后再采一次

        // 用户和助手独立采集，最后才按完整顺序配对，避免虚拟窗口边界漏回复。
        const turns = this._pairCapturedMessages(capturedMessages, masterOrder, capturedOrder);

        // 恢复用户原始滚动位置（尽量不打扰）
        try { scrollTo(initialScrollTop); } catch { /* ignore */ }

        turns.forEach((turn, index) => { turn.order = index + 1; });
        return turns;
```

</details>

**依据 2 · 源码核查**：[js/conversationExport/export-manager.js:229-252](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/conversationExport/export-manager.js#L229-L252)

按URL请求和取消决定结果是否展示。

<details>
<summary>查看原文（24行）</summary>

```text
    async _loadConversation(requestId, url) {
        const modal = this.modal;
        const isCurrent = () => this._isCurrentRequest(requestId, url) && this.modal === modal;
        let turns = [];
        try {
            turns = await this.adapter.collectAllTurns({
                onProgress: (count) => { if (isCurrent()) modal.updateProgress(count); },
                shouldCancel: () => this._loadCancelled || !isCurrent(),
            });
        } catch (error) {
        }

        // 加载期间弹窗已被关闭
        if (!isCurrent()) return;

        if (this._loadCancelled) {
            this._closeModal();
            return;
        }

        if (!turns.length) {
            window.globalToastManager?.error(CE_TEXT.noConversation);
            this._closeModal();
            return;
```

</details>

**依据 3 · 源码核查**：[js/conversationExport/export-manager.js:283-304](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/conversationExport/export-manager.js#L283-L304)

各输出格式分支及成功/失败提示。

<details>
<summary>查看原文（22行）</summary>

```text
            const filenameBase = ceSanitizeFilename(meta.title);

            if (request.formatId === 'png') {
                const blob = await this.pngExporter.export(job, request.themeId);
                ceTriggerDownload(filenameBase, format, blob);
            } else if (request.formatId === 'pdf') {
                // 文字排版方案：构建 HTML → 浏览器打印为 PDF（复用 PNG 的 markdown 解析）
                await this.pdfExporter.export(job, request.themeId, this.pngExporter);
            } else {
                let content;
                if (request.formatId === 'markdown') content = CETextExporters.buildMarkdown(job);
                else if (request.formatId === 'txt') content = CETextExporters.buildTxt(job);
                else if (request.formatId === 'csv') content = CETextExporters.buildCsv(job);
                else content = CETextExporters.buildJson(job);
                ceTriggerDownload(filenameBase, format, content);
            }

            window.globalToastManager?.success(CE_TEXT.done);
            this._closeModal();
        } catch (error) {
            window.globalToastManager?.error(CE_TEXT.failed);
            this.modal?.setExporting(false);
```

</details>

**依据 4 · 源码核查**：[js/highlight/highlight-manager.js:1-23](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/highlight/highlight-manager.js#L1-L23)

高亮序列化字段和匹配策略。

<details>
<summary>查看原文（23行）</summary>

```text
/**
 * Highlight Manager
 *
 * 网页文字标注功能核心模块
 * - 选中文字后创建高亮标注（<mark> 包裹）
 * - 序列化：TextQuoteSelector (exact + prefix + suffix) + TextPositionSelector (start + end)
 * - 页面加载及正文重建时恢复高亮，节流并跳过自身 DOM 修改
 * - 三级匹配（精确 → 模糊前缀锚定 → 模糊直接匹配）
 * - 使用 diff-match-patch 做模糊匹配，容忍页面渲染差异
 *
 * 存储结构（chrome.storage.local）：
 *   highlightEnabled  — boolean，功能开关
 *   highlightColor    — string，当前高亮颜色
 *   highlightData     — { [url]: [ {id, text, prefix, suffix, start, end, color, style, annotation, createdAt} ] }
 */

const _HL_INVISIBLE_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'IFRAME']);
const _HL_RESTORE_IGNORE_SELECTOR = [
    'input', 'textarea', 'select', '[contenteditable="true"]',
    '.ait-hl-popover', '.ait-highlight-standalone-btn', '.ait-quick-ask-btn',
    '.ait-panel-modal', '.ait-notepad-panel', '.ait-chat-timeline-wrapper',
    '.timeline-tooltip-overlay'
].join(',');
```

</details>

**依据 5 · 源码核查**：[js/highlight/highlight-manager.js:370-418](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/highlight/highlight-manager.js#L370-L418)

DOM恢复中重定位与失败跳过。

<details>
<summary>查看原文（49行）</summary>

```text
        this._restoreDeferred = window.getSelection()?.isCollapsed === false
            || !!document.querySelector('mark.ait-highlight-pending');
        if (this._restoreDeferred) return;

        // 同步/导入可能用新 ID 替换同一段文字，先移除旧标记，再定位新高亮。
        // 空列表也要执行清理；选区和临时标注则沿用上面的延后处理。
        for (const id of this._obsoleteHighlightIds) this._unwrapHighlight(id);
        this._obsoleteHighlightIds.clear();
        if (!highlights.length) {
            this._stopObserving();
            return;
        }

        const marksById = new Map();
        document.querySelectorAll('mark.ait-highlight[data-hl-id]').forEach(mark => {
            const id = mark.dataset.hlId;
            if (!marksById.has(id)) marksById.set(id, []);
            marksById.get(id).push(mark);
        });
        let content = null;
        for (const hl of highlights) {
            if (this._removedHighlightIds.has(hl.id)) continue;
            // wrap/unwrap 会移动其它 ID 的 mark，节点引用仍有效；跳过已移除的节点。
            const marks = (marksById.get(hl.id) || []).filter(mark => mark.isConnected);
            const markedText = marks.map(mark => mark.textContent).join('');
            if (marks.length && (markedText === hl.text || markedText === hl.text.replace(/\*\*|__/g, ''))) continue;

            // 尚未挂载的多条消息共用一次正文扫描；只有修改 DOM 后才重新采集节点。
            if (!content) content = this._collectTextNodes();
            let range = this._findRangeIn(content.text, content.textArr, content.nodes, hl);
            if (range && marks.length) {
                this._unwrapHighlight(hl.id);
                content = this._collectTextNodes();
                range = this._findRangeIn(content.text, content.textArr, content.nodes, hl);
            }
            if (range) {
                const hlStyle = hl.style || 'solid';
                const hlNote = hl.annotation || '';
                try {
                    this._wrapRange(range, hl.id, hl.color, hlStyle, hlNote);
                } catch (e1) {
                    try {
                        this._wrapRangeComplex(range, hl.id, hl.color, hlStyle, hlNote);
                    } catch { /* skip */ }
                }
                // mark 会切分文本节点，后面的高亮不能沿用本轮修改前的节点。
                content = null;
            }
        }
```

</details>

#### 缺口

- 未验证长会话导出完整性、附件保留及模糊高亮误配率。
  **影响**：不适合将导出或高亮视作无损归档凭据。
  **进一步探讨**：以人工已知会话比较导出首中末与附件，重载页面检查同文重复片段的定位。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 本地备份和云恢复怎样处理隐私、冲突与失败？

**研究主题**：依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

收藏、笔记和高亮等扩展资料默认本地存储；可选云备份是用户点击上传后读取几乎全部本地键，排除下划线内部键与gdriveToken，加meta后交background。OAuth使用drive.file范围，token在storage.local缓存；后台以JSON multipart更新或创建ait-backup.json，未见该链对数据另行加密。故作者“不上传对话内容”不能解释为主动云备份也不含文本：高亮数据本身含选中文字、上下文和备注，用户应将备份按其资料敏感度处理。这不是已证实存在隐蔽收集；本次只界定明确的用户授权上传链，未完成全仓隐私审计。云下载校验顶层data对象与可选source指纹后自动合并，非双向实时同步；同key/id导入覆盖，其他键新值覆盖，没有逐条冲突选择或并发版本合并。校验接受缺meta旧格式，不逐项验证所有字段。JSON导入允许覆盖模式，先clear再set，若后写失败旧数据已清，非事务性恢复；合并模式保留其他本地键但冲突同样以导入值为准。上传、下载HTTP错误有报错，fetch未设应用超时，等待时长及Google账号可用性未实测；应先留独立备份并试恢复，不能把云上传成功当恢复可用证明。

#### 证据与依据

**依据 1 · 源码核查**：[js/background.js:28-70](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/background.js#L28-L70)

OAuth范围、缓存token和验证请求。

<details>
<summary>查看原文（43行）</summary>

```text
const OAUTH_SCOPES = 'https://www.googleapis.com/auth/drive.file';

/**
 * 获取 OAuth2 Access Token
 * 统一使用 identity.launchWebAuthFlow 方式
 */
async function getAuthToken(interactive = true) {
    const stored = await browserAPI.storage.local.get('gdriveToken');
    if (stored.gdriveToken?.access_token) {
        const isValid = await validateToken(stored.gdriveToken.access_token);
        if (isValid) return stored.gdriveToken.access_token;
    }

    if (!interactive) throw new Error('Not authenticated');

    const redirectUrl = browserAPI.identity.getRedirectURL();
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth` +
        `?client_id=${encodeURIComponent(OAUTH_CLIENT_ID)}` +
        `&response_type=token` +
        `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
        `&scope=${encodeURIComponent(OAUTH_SCOPES)}`;

    const responseUrl = await browserAPI.identity.launchWebAuthFlow({
        url: authUrl,
        interactive: true
    });

    const params = new URL(responseUrl.replace('#', '?')).searchParams;
    const accessToken = params.get('access_token');
    if (!accessToken) throw new Error('OAuth failed: no access_token');

    await browserAPI.storage.local.set({
        gdriveToken: { access_token: accessToken, obtained_at: Date.now() }
    });

    return accessToken;
}

async function validateToken(token) {
    try {
        const resp = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`);
        return resp.ok;
    } catch { return false; }
```

</details>

**依据 2 · 源码核查**：[js/background.js:129-191](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/background.js#L129-L191)

JSON上传与下载实际载荷及HTTP错误。

<details>
<summary>查看原文（63行）</summary>

```text
async function uploadToDrive(token, data) {
    const folderId = await ensureFolder(token);
    const fileId = await findFile(token, GDRIVE_DATA_FILE, null, folderId);
    
    // 构建 multipart body
    const boundary = 'ait_boundary_' + Date.now();
    const metadata = {
        name: GDRIVE_DATA_FILE,
        mimeType: 'application/json',
        ...(!fileId && { parents: [folderId] }) // 新建时指定父文件夹
    };
    
    const body = [
        `--${boundary}`,
        'Content-Type: application/json; charset=UTF-8',
        '',
        JSON.stringify(metadata),
        `--${boundary}`,
        'Content-Type: application/json',
        '',
        JSON.stringify(data),
        `--${boundary}--`
    ].join('\r\n');
    
    // 更新已有文件 or 创建新文件
    const url = fileId
        ? `${GDRIVE_API}/upload/drive/v3/files/${fileId}?uploadType=multipart`
        : `${GDRIVE_API}/upload/drive/v3/files?uploadType=multipart`;
    
    const resp = await fetch(url, {
        method: fileId ? 'PATCH' : 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: body
    });
    
    if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Upload failed: ${resp.status} ${errText}`);
    }
    
    return await resp.json();
}

/**
 * 从 Google Drive 下载数据
 */
async function downloadFromDrive(token) {
    const folderId = await findFile(token, GDRIVE_FOLDER_NAME, 'application/vnd.google-apps.folder');
    if (!folderId) return null; // 文件夹不存在，说明从未上传过
    
    const fileId = await findFile(token, GDRIVE_DATA_FILE, null, folderId);
    if (!fileId) return null; // 文件不存在
    
    const resp = await fetch(`${GDRIVE_API}/drive/v3/files/${fileId}?alt=media`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!resp.ok) throw new Error(`Download failed: ${resp.status}`);
    
    return await resp.json();
```

</details>

**依据 3 · 源码核查**：[js/panelModal/tabs/dataSync/index.js:187-205](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/panelModal/tabs/dataSync/index.js#L187-L205)

用户上传读取数据并发后台。

<details>
<summary>查看原文（19行）</summary>

```text
    async handleGDriveUpload() {
        const uploadBtn = document.getElementById('gdrive-upload-btn');
        if (uploadBtn) {
            uploadBtn.disabled = true;
            uploadBtn.textContent = TimelineI18n.getMessage('gdriveUploading') || '上传中...';
        }
        
        try {
            const data = await this.getAllStorageData();
            const exportData = {
                _meta: this._buildMeta(),
                data: data
            };
            
            const resp = await chrome.runtime.sendMessage({ type: 'GDRIVE_UPLOAD', data: exportData });
            if (resp?.success) {
                if (window.globalToastManager) {
                    window.globalToastManager.success(TimelineI18n.getMessage('gdriveUploadSuccess') || '已上传到 Google Drive', null, { color: this.toastColors });
                }
```

</details>

**依据 4 · 源码核查**：[js/panelModal/tabs/dataSync/index.js:237-264](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/panelModal/tabs/dataSync/index.js#L237-L264)

云下载校验后合并并要求刷新。

<details>
<summary>查看原文（28行）</summary>

```text
        try {
            const resp = await chrome.runtime.sendMessage({ type: 'GDRIVE_DOWNLOAD' });
            if (!resp?.success) {
                throw new Error(resp?.error || (TimelineI18n.getMessage('gdriveDownloadFailed') || '下载失败'));
            }
            
            if (!resp.data) {
                if (window.globalToastManager) {
                    window.globalToastManager.info(TimelineI18n.getMessage('gdriveNoBackup') || '云端暂无备份数据', null, { color: this.toastColors });
                }
                return;
            }
            
            // 验证数据格式
            const importData = resp.data;
            if (!this._isValidBackup(importData)) {
                throw new Error(TimelineI18n.getMessage('gdriveDataInvalid') || '云端数据格式无效');
            }
            
            // 使用合并模式导入
            await this.mergeData(importData.data);
            
            // 提醒用户刷新
            if (window.globalPopconfirmManager) {
                const confirmed = await window.globalPopconfirmManager.show({
                    title: TimelineI18n.getMessage('gdriveMergeSuccess') || '云端数据已合并',
                    content: TimelineI18n.getMessage('gdriveMergeHint') || '数据已成功从 Google Drive 下载并合并，需要刷新页面后生效',
                    confirmText: TimelineI18n.getMessage('refreshPage') || '刷新页面',
```

</details>

**依据 5 · 源码核查**：[js/panelModal/tabs/dataSync/index.js:409-454](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/panelModal/tabs/dataSync/index.js#L409-L454)

有限格式判别、排除token与clear后写入。

<details>
<summary>查看原文（46行）</summary>

```text
    _isValidBackup(importData) {
        if (!importData || typeof importData !== 'object') return false;
        if (!importData.data || typeof importData.data !== 'object') return false;
        const meta = importData._meta;
        if (meta && meta.source !== undefined && meta.source !== 'AIChatTimeline') return false;
        return true;
    }

    /**
     * 获取所有存储数据（过滤掉 _ 开头的内部数据）
     */
    async getAllStorageData() {
        return new Promise((resolve) => {
            chrome.storage.local.get(null, (items) => {
                const filtered = {};
                for (const [key, value] of Object.entries(items)) {
                    if (!key.startsWith('_') && key !== 'gdriveToken') {
                        filtered[key] = value;
                    }
                }
                resolve(filtered);
            });
        });
    }
    
    /**
     * 覆盖模式：清空并写入新数据
     */
    async overwriteData(newData) {
        return new Promise((resolve, reject) => {
            // 先清空
            chrome.storage.local.clear(() => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }
                // 再写入
                chrome.storage.local.set(newData, () => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve();
                    }
                });
            });
        });
```

</details>

**依据 6 · 源码核查**：[js/panelModal/tabs/dataSync/index.js:468-527](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/panelModal/tabs/dataSync/index.js#L468-L527)

按key合并、id合并及新值覆盖策略。

<details>
<summary>查看原文（60行）</summary>

```text
    async mergeData(newData) {
        const existingData = await this.getAllStorageData();
        const mergedData = { ...existingData };
        
        for (const [key, newValue] of Object.entries(newData)) {
            const existingValue = existingData[key];
            
            // 本地不存在，直接使用新值
            if (existingValue === undefined) {
                mergedData[key] = newValue;
                continue;
            }
            
            // 根据 key 类型选择合并策略
            mergedData[key] = this.mergeByKey(key, existingValue, newValue);
        }
        
        return new Promise((resolve, reject) => {
            chrome.storage.local.set(mergedData, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve();
                }
            });
        });
    }
    
    /**
     * 根据 key 类型选择合并策略
     */
    mergeByKey(key, existing, newValue) {
        // chatTimelineStars - 按 key 字段合并
        if (key === 'chatTimelineStars') {
            return this.mergeArrayByField(existing, newValue, 'key');
        }
        
        // chatTimelinePins - 按 key 字段合并
        if (key === 'chatTimelinePins') {
            return this.mergeArrayByField(existing, newValue, 'key');
        }
        
        // prompts（提示词）- 按 id 字段合并
        if (key === 'prompts') {
            return this.mergeArrayByField(existing, newValue, 'id');
        }
        
        // folders（文件夹）- 按 id 字段合并
        if (key === 'folders') {
            return this.mergeArrayByField(existing, newValue, 'id');
        }
        
        // *PlatformSettings - 对象按 key 合并
        if (key.endsWith('PlatformSettings')) {
            return { ...existing, ...newValue };
        }
        
        // 其他类型 - 新值覆盖
        return newValue;
    }
```

</details>

**依据 7 · 源码核查**：[js/highlight/highlight-manager.js:11-14](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/highlight/highlight-manager.js#L11-L14)

本地高亮内容含选中文字和上下文。

```text
 * 存储结构（chrome.storage.local）：
 *   highlightEnabled  — boolean，功能开关
 *   highlightColor    — string，当前高亮颜色
 *   highlightData     — { [url]: [ {id, text, prefix, suffix, start, end, color, style, annotation, createdAt} ] }
```

#### 缺口

- 未授权Google账号或实际恢复备份，未全仓审计所有网络路径。
  **影响**：云服务可用性、备份往返完整性及全面隐私性质仍未知。
  **进一步探讨**：用非敏感样本比对JSON往返、冲突与set失败恢复，确认授权范围和实际云文件内容。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 代码运行的成功与隔离边界是什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

代码运行入口把用户选择的代码交RunnerManager，再委派语言runner，属主动执行能力。JS runner在扩展sandbox iframe中用AsyncFunction执行并回传日志；manager设30秒等待超时，超时或cleanup移除iframe和消息监听，提供基本退出机制，但这不是CPU硬隔离或恶意代码安全证明。消息处理只核对象和type，未将event.source绑定当前iframe；页面可发送同名消息，不能把SANDBOX_COMPLETE当可信来源的验收信号。还存在确定的结果语义缺口：sandbox脚本在异常时先发ERROR再发COMPLETE(success:false)，sandbox-manager仍resolve(data)，而JS runner对任何resolve返回success:true，未检查result.success；因此错误日志可能可见，但结构化成功不能证明代码执行成功。运行代码来自网页和模型，试用时先关闭或不用此能力，仅单独核已审查代码；不将此问题推定为已发生跨沙箱逃逸。TS/SQL/HTML等其它语言只确认作者分发声明，未逐一审计执行隔离。

#### 证据与依据

**依据 1 · 源码核查**：[js/runner/index.js:275-301](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/runner/index.js#L275-L301)

代码入口调用manager并接输出。

<details>
<summary>查看原文（27行）</summary>

```text
    async function executeCode(code, contentEl, runButton, language = 'javascript') {
        if (!code.trim()) {
            contentEl.innerHTML = '<div class="runner-output-empty">（无代码）</div>';
            return;
        }

        contentEl.innerHTML = '<div class="runner-result-loading">执行中...</div>';
        runButton.classList.add('loading');
        runButton.disabled = true;

        try {
            const manager = getRunnerManager();
            const outputs = [];

            await manager.run(code, language, {
                onOutput: (output) => {
                    // 特殊处理各种输出类型
                    if (output.level === 'table') {
                        // SQL 表格
                        outputs.push({ 
                            type: 'table', 
                            columns: output.data.columns, 
                            values: output.data.values 
                        });
                    } else if (output.level === 'html-preview') {
                        // HTML 预览
                        outputs.push({ type: 'html-preview', html: output.data.html });
```

</details>

**依据 2 · 源码核查**：[js/runner/runner-manager.js:75-98](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/runner/runner-manager.js#L75-L98)

实际委派语言runner与结果转发。

<details>
<summary>查看原文（24行）</summary>

```text
        this.isRunning = true;
        onStart();

        try {
            // 执行代码（使用各语言默认的超时时间）
            const result = await runner.execute(code, {
                onOutput: (output) => {
                    this.handleOutput(output, onOutput);
                }
            });

            this.isRunning = false;
            onComplete(result);
            return result;

        } catch (error) {
            this.isRunning = false;
            const errorResult = {
                success: false,
                error: error.message
            };
            onError(errorResult);
            return errorResult;
        }
```

</details>

**依据 3 · 源码核查**：[js/runner/languages/javascript/sandbox-script.js:119-148](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/runner/languages/javascript/sandbox-script.js#L119-L148)

AsyncFunction与失败success:false的COMPLETE。

<details>
<summary>查看原文（30行）</summary>

```text
    function executeCode(code) {
        startTime = Date.now();
        
        try {
            var AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
            var fn = new AsyncFunction(code);
            
            fn().then(function() {
                setTimeout(function() {
                    send('SANDBOX_COMPLETE', { success: true, duration: Date.now() - startTime });
                }, 10);
            }).catch(function(e) {
                send('SANDBOX_ERROR', { message: e.message, stack: e.stack });
                send('SANDBOX_COMPLETE', { success: false, duration: Date.now() - startTime });
            });
        } catch (e) {
            send('SANDBOX_ERROR', { message: e.message, stack: e.stack });
            send('SANDBOX_COMPLETE', { success: false, duration: Date.now() - startTime });
        }
    }
    
    window.addEventListener('message', function(event) {
        if (!event.data || typeof event.data !== 'object') return;
        
        if (event.data.type === 'EXECUTE_CODE') {
            executeCode(event.data.code);
        }
    });
    
    send('SANDBOX_READY', { ready: true });
```

</details>

**依据 4 · 源码核查**：[js/runner/languages/javascript/sandbox-manager.js:53-70](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/runner/languages/javascript/sandbox-manager.js#L53-L70)

只检查type后处理消息，没有source绑定。

<details>
<summary>查看原文（18行）</summary>

```text
            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'display:none;position:absolute;width:0;height:0;border:none;';
            
            this.messageHandler = (event) => {
                if (!event.data || typeof event.data !== 'object') return;
                
                const { type, data } = event.data;
                const validTypes = ['SANDBOX_READY', 'SANDBOX_OUTPUT', 'SANDBOX_ERROR', 'SANDBOX_COMPLETE'];
                if (!validTypes.includes(type)) return;
                
                switch (type) {
                    case 'SANDBOX_READY':
                        this.isReady = true;
                        if (this.currentSandbox && this.pendingCode) {
                            this.currentSandbox.contentWindow.postMessage({
                                type: 'EXECUTE_CODE',
                                code: this.pendingCode
                            }, '*');
```

</details>

**依据 5 · 源码核查**：[js/runner/languages/javascript/sandbox-manager.js:89-115](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/runner/languages/javascript/sandbox-manager.js#L89-L115)

收到COMPLETE就resolve，30秒超时销毁。

<details>
<summary>查看原文（27行）</summary>

```text
                    case 'SANDBOX_COMPLETE':
                        clearTimeout(this.timeoutId);
                        const savedResolve = this.pendingResolve;
                        // 延迟 destroy，确保所有消息都已处理
                        setTimeout(() => {
                            this.destroy();
                        }, 50);
                        if (savedResolve) {
                            savedResolve(data);
                        }
                        break;
                }
            };
            
            window.addEventListener('message', this.messageHandler);
            
            this.timeoutId = setTimeout(() => {
                const savedReject = this.pendingReject;
                this.destroy();
                if (savedReject) {
                    savedReject(new Error('代码执行超时（30秒）'));
                }
            }, timeout);
            
            document.body.appendChild(iframe);
            this.currentSandbox = iframe;
            iframe.src = sandboxUrl;
```

</details>

**依据 6 · 源码核查**：[js/runner/languages/javascript/index.js:34-64](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/runner/languages/javascript/index.js#L34-L64)

resolve后无条件返回success:true。

<details>
<summary>查看原文（31行）</summary>

```text
    async execute(code, options = {}) {
        await this.initialize();
        
        const {
            onOutput = () => {},
            timeout = 30000  // JavaScript 超时 30 秒
        } = options;
        
        try {
            const result = await this.sandboxManager.execute(
                code,
                onOutput,
                timeout
            );
            
            return {
                success: true,
                duration: result.duration,
                language: this.language
            };
        } catch (error) {
            onOutput({
                level: 'error',
                data: [error.message]
            });
            
            return {
                success: false,
                error: error.message,
                language: this.language
            };
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何采用，哪些设计可迁移，什么假设待检验？

**研究主题**：采用判断、新假设与验证、工程质量与复用、效果与总成本

#### 完整回答

接受扩展权限且常回看网页AI长会话的用户，可先在单站非敏感会话只用时间轴和导出；准备已知首中末问题，比较列表、落点与导出，备份原始JSON后才试恢复或换浏览器。出现缺失、误跳、配对错位或备份冲突时停止依赖，关闭该平台功能或禁用扩展，回原页面滚动和手工保存；不要让代码运行结果承担任务验收。按需common/core/panel/export/runner包加载是可复用工程点：bootstrap区分代码加载与平台启动，失败清除activationTask以允许重试；但manifest全网址注入轻入口，普通网页划词/公式/已有同源高亮也能加载common，不能说不支持页面完全不运行扩展。首次需核权限及平台设置，持续占浏览器缓存与DOM观察资源；历史捕获按会话保存在页面内存，长标签页资源成本和实际节时未知；云账号、流量和存储费用未知，覆盖失败恢复有额外人工。可推导尚未实现的完整性标记：将时间轴历史complete、导出停止原因和实际采集ID覆盖展示给用户，并把运行success与语言结果统一，减少部分结果被误当完成。最小实验在固定长会话上比较有无标记的漏项发现率、误判完成率和额外核查时间；若标记无法反映真实漏项或增加核查负担则否定。

#### 证据与依据

**依据 1 · 源码核查**：[js/content/bootstrap.js:137-161](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/content/bootstrap.js#L137-L161)

按支持状态启动、共享activationTask及失败重试。

<details>
<summary>查看原文（25行）</summary>

```text
    async function isSupported() {
        const platforms = await getSiteInfoList();
        if (platforms.some(platform => platform.sites.some(matchesDomain))) return true;
        return (globalThis.CUSTOM_SITE_INFO || []).some(site => site.enabled !== false && site.sites?.some(matchesDomain));
    }

    async function startPlatformFeatures() {
        if (!(await isSupported()) || session?.active === false) return false;
        await load('core');
        if (session?.active === false) return false;
        // Core may already be cached because a generic settings panel needed it.
        // Importing code and starting platform features have separate lifecycles.
        return window.AITPlatformFeatures.start();
    }

    function activate() {
        if (!session) return startPlatformFeatures();
        activationTask ||= startPlatformFeatures().then(started => {
            if (!started) activationTask = null;
            return started;
        }, error => {
            activationTask = null;
            throw error;
        });
        return activationTask;
```

</details>

**依据 2 · 源码核查**：[js/content/page-features.js:42-61](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/content/page-features.js#L42-L61)

普通页选择与同源高亮触发common。

<details>
<summary>查看原文（20行）</summary>

```text
    function onSelection(event) {
        if (stopped || loading || !highlightEnabled) return;
        if (event?.type === 'keyup' && !event.shiftKey) return;
        const selection = window.getSelection();
        if (!selection?.rangeCount || !selection.toString().trim()) return;
        const node = selection.getRangeAt(0).commonAncestorContainer;
        const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
        if (!element || element.isContentEditable
            || element.closest('input, textarea, select, [contenteditable="true"], .ait-panel-modal, .floating-runner-container')) return;
        loadCommon();
    }

    function hasOriginHighlights(data) {
        // Load on an annotated origin even if its current path has no notes yet:
        // common's URL monitor will then restore notes after SPA navigation.
        return Object.entries(data || {}).some(([url, highlights]) => {
            if (!Array.isArray(highlights) || !highlights.length) return false;
            try { return new URL(url).origin === location.origin; } catch { return false; }
        });
    }
```

</details>

**依据 3 · 源码核查**：[js/content/page-features.js:132-146](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/content/page-features.js#L132-L146)

默认公式与高亮开关及入口注册。

<details>
<summary>查看原文（15行）</summary>

```text
    try {
        const settings = await chrome.storage.local.get(['formulaLatexEnabled', 'formulaMathMLEnabled', 'highlightEnabled']);
        latexEnabled = settings.formulaLatexEnabled !== false;
        mathmlEnabled = settings.formulaMathMLEnabled === true;
        highlightEnabled = settings.highlightEnabled !== false;
    } catch {}

    chrome.storage.onChanged.addListener(onStorageChanged);
    document.addEventListener('mouseup', onSelection);
    document.addEventListener('keyup', onSelection);
    if (loader.isLoaded('common')) loadCommon();
    updateFormulaDiscovery();
    void checkSavedHighlights();
    // Preserve a selection made while the settings read was in progress.
    onSelection();
```

</details>

**依据 4 · 源码核查**：[js/apiCapture/chatgpt.js:24-25](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/apiCapture/chatgpt.js#L24-L25)

捕获文本按标签页生命周期释放。

```text
// 【存储】按 convId 分桶保存消息 id → 提问文本。同一标签页内不限制跨对话总条目数，
// 刷新页面或关闭标签页后由页面生命周期统一释放。
```

**依据 5 · 源码核查**：[js/conversationExport/adapters/chatgpt.js:201-260](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/conversationExport/adapters/chatgpt.js#L201-L260)

有界采集实际停止条件支持完整性提示的推导。

<details>
<summary>查看原文（60行）</summary>

```text
        // 逐个把未处理空壳滚进视口渲染并采集
        const maxRounds = 800;
        let stagnantRounds = 0;
        for (let round = 0; round < maxRounds; round++) {
            if (shouldCancel?.()) {
                try { scrollTo(initialScrollTop); } catch { /* ignore */ }
                return [];
            }

            const shell = nextPendingShell();
            if (!shell) {
                // 当前 DOM 已采完不代表历史已采完；向下扫屏触发下一窗口渲染。
                const bottom = reverse ? 0 : scrollRange();
                const current = getScrollTop();
                if (bottom - current <= 1) break;
                const viewport = isWin ? window.innerHeight : (scroller.clientHeight || window.innerHeight);
                scrollTo(Math.min(bottom, current + Math.max(1, viewport * 0.8)));
                await this._wait(400);
                await this._waitWhileLoading(2000);
                collectRendered();
                if (Math.abs(getScrollTop() - current) < 1) {
                    if (++stagnantRounds >= 5) break;
                } else stagnantRounds = 0;
                continue;
            }

            const beforeCaptured = capturedMessages.size;
            const beforeProcessed = processedIds.size;

            // 元素锚定滚动：按空壳当前实时位置，把它滚到视口上沿附近
            const rect = shell.getBoundingClientRect();
            const viewTop = isWin ? 0 : scroller.getBoundingClientRect().top;
            scrollTo(getScrollTop() + (rect.top - viewTop) - 80);
            await this._wait(400);              // 渲染启动
            await this._waitWhileLoading(2000); // DOM 稳定确认
            collectRendered();
            // 新版每轮都滚动到一次，触发虚拟内容渲染后才标记完成。
            const modernTurnId = shell.getAttribute('data-turn-key');
            if (modernTurnId && capturedMessages.has(modernTurnId)) {
                processedIds.add(modernTurnId);
            }

            // 连续多轮既无新采集也无新渲染 → 虚拟化不再响应，避免死循环
            if (capturedMessages.size === beforeCaptured && processedIds.size === beforeProcessed) {
                stagnantRounds++;
                if (stagnantRounds >= 5) break;
            } else {
                stagnantRounds = 0;
            }
        }
        collectRendered(); // 结束前最后再采一次

        // 用户和助手独立采集，最后才按完整顺序配对，避免虚拟窗口边界漏回复。
        const turns = this._pairCapturedMessages(capturedMessages, masterOrder, capturedOrder);

        // 恢复用户原始滚动位置（尽量不打扰）
        try { scrollTo(initialScrollTop); } catch { /* ignore */ }

        turns.forEach((turn, index) => { turn.order = index + 1; });
        return turns;
```

</details>

**依据 6 · 源码核查**：[js/runner/languages/javascript/index.js:43-52](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/c1496dd107ade3d4e9ae815f6645986eb288bbdf/js/runner/languages/javascript/index.js#L43-L52)

运行成功语义缺口支持统一结果假设。

<details>
<summary>查看原文（10行）</summary>

```text
            const result = await this.sandboxManager.execute(
                code,
                onOutput,
                timeout
            );
            
            return {
                success: true,
                duration: result.duration,
                language: this.language
```

</details>

#### 缺口

- 完整性标记方案尚未实现或验证，用户频次和节时未测。
  **影响**：不计入已有贡献或收益，建议仍限制于自行核样本的试用。
  **进一步探讨**：固定样本与会话版本做可推翻对照，记录漏项、误判与核查时间。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
