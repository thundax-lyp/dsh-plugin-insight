# dsh-scrape-webpage

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[7485af1](https://github.com/131CDA1/dsh-scrape-webpage/tree/7485af10c063579323058583c7f13e69c4c8bd21)

<!-- BEGIN META -->
[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/131CDA1/dsh-scrape-webpage) [![npm 30d 1,067](https://img.shields.io/static/v1?label=npm+30d&message=1%2C067&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-scrape-webpage) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-scrape-webpage)
<!-- END META -->

> **实现功能**：抓取网页并在静态解析、curl 与浏览器路径间选择，返回适合模型消费的内容。

> **核心亮点**：相对直接 curl 或 fetch，它将多获取路径与正文规整封装为单一 DSH 工具，贡献是降低网页材料进入会话的接线负担，而不是替代完整浏览器自动化。 [Q03](#research-q03)

> **风险与缺陷**：静态抓取对登录、脚本渲染、反爬和页面结构变化敏感；源码结构能证明降级路径存在，但没有同站点样本证明正文完整性和稳定性。 [Q04](#research-q04)

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 谁在何种任务中使用，原有办法和合格结果是什么？](#detail-section-11)
  - [Q02 · 能力如何从入口、注册、调用到状态变化实现？](#detail-section-12)
  - [Q03 · 相对原生能力或简单替代，固定版本增加了什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使核心价值不成立？](#detail-section-14)
  - [Q05 · 启动、持续生效和失败恢复分别依赖什么？](#detail-section-15)
  - [Q06 · 首次、持续与失败恢复成本及效果证据如何？](#detail-section-16)
  - [Q07 · 实现有哪些可靠性取舍和可复用设计？](#detail-section-17)
  - [Q08 · 由贡献和限制能推导什么未验证方向？](#detail-section-18)
  - [Q09 · 对什么人值得观察或试用，成功与停止条件是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要把公开网页正文交给模型分析的 DSH 用户，用一个工具完成抓取、正文提取与失败降级。 [Q01](#research-q01)

基线是终端 curl、宿主浏览器工具或手工复制页面；插件用统一参数和内容清洗减少步骤，但不覆盖交互式网页。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 网页抓取 | 从 URL 获取页面内容并返回模型可读结果。 | 仅由固定版本源码确认；运行效果未验证 |
| 内容清洗 | 解析 HTML 并压缩无关结构。 | 仅由固定版本源码确认；运行效果未验证 |
| 降级获取 | 在不同获取后端间处理失败。 | 仅由固定版本源码确认；运行效果未验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools 与 Node 网络 | 必需 | 注册工具并发起请求 | 无法抓取 |
| 目标 URL 可公开访问 | 必需 | 获取 HTML/文本 | 登录、验证码或付费墙返回不完整结果 |
| curl/备用获取路径 | 条件必需 | 主路径失败时降级 | 只剩单一路径，失败覆盖收窄 |
| 人工来源核对 | 研究使用必需 | 检查正文遗漏与错误页面 | HTTP 成功可能被误当作证据完整 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 选择页面 | 用户提供公开 http(s) URL | 明确无需登录且允许访问 |
| 获取与解析 | 工具尝试 fetch/curl 并清洗 HTML | 返回标题、正文和来源而非挑战页 |
| 证据抽查 | 用户核对关键段落与原页面 | 关键内容缺失则切换浏览器/手工复制 |
| 失败退出 | 工具返回具体错误和已试路径 | 不循环轰炸站点，不把空文本写入研究 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地 Node 与网络，无已知独立订阅 | 选超时、核对备用后端 | 安装分钟数未知 |
| 持续使用 | 每页 HTTP 请求、响应字节与上下文 token | 抽查正文和来源链接 | 不同站点请求次数与 token 未测 |
| 失败恢复 | 备用请求可能重复消耗带宽 | 切浏览器、登录或手工复制 | 反爬时应停止而非持续重试 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 接线简化 | 单工具封装获取、解析与分析 | 是否比浏览器复制节时 |
| 正文压缩 | HTML 清洗减少结构噪声 | 关键段落召回和误删率 |
| 降级覆盖 | 存在多个获取模块 | 动态站点、登录页与反爬成功率 |

> **思考**：静态抓取对登录、脚本渲染、反爬和页面结构变化敏感；源码结构能证明降级路径存在，但没有同站点样本证明正文完整性和稳定性。 [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对直接 curl 或 fetch，它将多获取路径与正文规整封装为单一 DSH 工具，贡献是降低网页材料进入会话的接线负担，而不是替代完整浏览器自动化。 [Q03](#research-q03)

相对直接 curl 或 fetch，它将多获取路径与正文规整封装为单一 DSH 工具，贡献是降低网页材料进入会话的接线负担，而不是替代完整浏览器自动化。 [Q03](#research-q03)

获取、解析和分析职责拆分清楚，便于替换单一后端；主要维护风险来自站点差异、超时和正文抽取启发式，试用需保留原链接并抽查遗漏。

<a id="detail-section-5"></a>

### 1.4 主要限制

静态抓取对登录、脚本渲染、反爬和页面结构变化敏感；源码结构能证明降级路径存在，但没有同站点样本证明正文完整性和稳定性。 [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

适合公开、无需登录且正文可抽查的研究页面小范围试用；登录态、强脚本渲染或付费墙继续使用宿主浏览器。成功标准是关键段落召回、标题与链接保留达到预定样本门槛，且人工修正少于复制粘贴；连续出现空正文、错正文或反爬重试时应停止并切换浏览器。 [Q09](#research-q09)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为固定版本源码支持的实现与集成增量；效果和真实宿主可用性未验证。未来设计假设保持未验证，不计入插件现有能力。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定提交的作者材料、入口和关键实现；未运行插件、测试、外部服务或真实宿主，也未核验独立用户反馈。
- 下一步：选取公开静态页、长文页、脚本渲染页和反爬页各若干，人工标注关键段落；比较插件、curl 与浏览器复制的召回率、噪声比例、请求数、处理秒数和人工修正分钟。关键段落召回低于预设门槛或重试多于基线即限定为静态页工具。

**分析版本**

- **仓库**：[131CDA1/dsh-scrape-webpage](https://github.com/131CDA1/dsh-scrape-webpage)
- **版本号**：1.0.0（[固定提交 7485af1](https://github.com/131CDA1/dsh-scrape-webpage/tree/7485af10c063579323058583c7f13e69c4c8bd21)）
- **版本日期**：2026-08-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可增加“证据保真模式”，同时返回正文、关键 DOM 定位和被删除区块摘要，让研究任务在压缩上下文时仍能回查来源。 [Q08](#research-q08)

选取公开静态页、长文页、脚本渲染页和反爬页各若干，人工标注关键段落；比较插件、curl 与浏览器复制的召回率、噪声比例、请求数、处理秒数和人工修正分钟。关键段落召回低于预设门槛或重试多于基线即限定为静态页工具。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 139 | — | — | 1522 |
| .js | source | 5 | 716 | 622 | 65 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/131CDA1/dsh-scrape-webpage/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：研究 dsh-scrape-webpage 在固定版本中的实现贡献、成立条件、关键限制、采用价值与可证伪的新设计方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种任务中使用，原有办法和合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

面向需要把公开网页正文交给模型分析的 DSH 用户，用一个工具完成抓取、正文提取与失败降级。 合格结果不是“工具被调用”，而是用户能在既定边界内得到可复核产物。基线是终端 curl、宿主浏览器工具或手工复制页面；插件用统一参数和内容清洗减少步骤，但不覆盖交互式网页。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-20](https://github.com/131CDA1/dsh-scrape-webpage/blob/7485af10c063579323058583c7f13e69c4c8bd21/README.md#L1-L20)

作者材料说明目标用户、安装方式、主要能力和已知边界。

<details>
<summary>查看原文（20行）</summary>

```text
# dsh-scrape-webpage

网页抓取与分析插件 —— DeepSeek Harness 组合插件(Host-only,零依赖)。

用爬虫读取网站内容并做分析:注册模型工具 `scrape_webpage`,抓取网页正文,提取标题、页面描述、H1–H6 标题结构、链接列表,统计字符数/词数/预计阅读时长与语言倾向,计算高频关键词(中文二元组 + 英文单词,含停用词过滤);可选下载页面内容图片供视觉分析,并提供 `scrape.imageAnalyzer` 扩展服务供识图插件接入。

## ✨ 功能特性

- **网页抓取**:http/https,自动重定向,非 2xx 状态码优雅返回
- **内容提取**:标题、页面描述、正文(截断可调)、H1–H6 标题结构、链接列表(上限 100)
- **自动分析**:字符数、词/字数、标题数、链接数、预计阅读时长、语言倾向(中/英/混合)、高频关键词 Top30
- **图片下载**:提取 `<img src/data-src/srcset>`(相对路径自动归一化,过滤图标/logo 等噪音),下载到会话工作区 `.scrape-images\`,返回本地路径供视觉模型 `read_image` 分析
- **识图插件接口**:发布 `scrape.imageAnalyzer` 服务,识图插件注册分析器后,图片自动交给分析器并把结果附在工具输出中
- **安全模型**:默认沙箱内抓取;HTTPS 沙箱 TLS 受限时按 pwsh 工具的升级契约,显式 `sandbox_permissions` + 审批一次性授权
- **bundle 打包**:package.json 声明 `dsh.bundle.patch`,`dsh plugin --profile <name> add` 安装后自动注册为组合层,无需手动编辑 cordis.patch.yml

## 📦 安装

本包是 **bundle 包**(`package.json` 中 `dsh.bundle.patch` 指向 `cordis.patch.yml`)。`dsh plugin` 安装成功后会**自动**把它加入 profile 的 `dsh.profile.bundles`,重启即加载。

```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 能力如何从入口、注册、调用到状态变化实现？

**研究主题**：功能与机制

#### 完整回答

`scrape_webpage` 接收 URL，先按配置获取内容，再对 HTML 清洗和分析；实现把 fetch、curl、HTML 解析与策略判断拆成独立模块。 源码可以确认注册和数据流存在，但不能据此推断宿主加载、外部服务或最终效果已经通过。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/131CDA1/dsh-scrape-webpage/blob/7485af10c063579323058583c7f13e69c4c8bd21/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * dsh-scrape-webpage —— 网页抓取与分析插件（宿主组合行，Host-only，零依赖）。
 *
 * 模块结构（低耦合：纯函数层 ← 服务层 ← 组合层）：
 *  - html.js     HTML/文本解析（纯函数）
 *  - analyze.js  统计与关键词分析（纯函数）
 *  - curl.js     curl 命令构建与结果解析（纯函数）
 *  - fetch.js    抓取执行层（会话沙箱策略、shell/curl 执行、审批升级）
 *  - index.js    插件主体（工具注册、编排、识图分析器服务）
 *
 * 能力：
 *  - 注册模型工具 `scrape_webpage`：抓取网页并提取标题/描述/正文/标题结构/链接，
 *    统计字符数、词数、预计阅读时长，计算高频关键词（中文二元组 + 英文单词，含停用词过滤）。
 *  - 可选下载页面内容图片（images 参数，上限 6 张）到会话工作区 .scrape-images 目录，
 *    返回本地路径供视觉模型 read_image 分析。
 *  - 提供 `scrape.imageAnalyzer` 服务（register/list/analyze）：识图插件注册分析器后，
 *    下载的图片自动交给分析器，结果附在工具输出的 imageAnalysis 中。
 *
 * 抓取链路与安全：
 *  - 优先使用宿主 web 服务的 fetch provider（若部署了）；否则经 shell 服务调用 curl.exe。
 *  - 默认在沙箱内（会话策略）执行；HTTPS 因沙箱 TLS 凭据受限失败时返回
 *    escalation available 提示，模型可用 sandbox_permissions="danger-full-access"
 *    + justification 重试一次，由审批弹窗决定（与 pwsh 工具的升级契约一致）。
 *  - 依赖宿主服务：tools、systemPrompt、timer（硬依赖）；web、shell、sandboxPolicy、
 *    approval、sessions（可选，缺失时优雅降级报错）。
 */

import { normalizeUrl, extractImages, extractFromHtml } from './html.js'
import { computeStats, topKeywords, formatScrapeText } from './analyze.js'
import { createFetchLayer } from './fetch.js'

export const name = 'dsh-scrape-webpage'
export const inject = ['timer', 'tools', 'systemPrompt']

export function apply(ctx) {
  const { resolveSessionPolicy, fetchViaShell, downloadImages, resolveEscalationPolicy } = createFetchLayer(ctx)

  // ===== 识图分析器扩展接口（发布到宿主 realm，供识图插件注册） =====
  const analyzerRegistry = {
    analyzers: new Map(),
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对原生能力或简单替代，固定版本增加了什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对直接 curl 或 fetch，它将多获取路径与正文规整封装为单一 DSH 工具，贡献是降低网页材料进入会话的接线负担，而不是替代完整浏览器自动化。 参照是宿主原生工具、直接脚本或手工流程，现有证据支持实现增量，不支持全球首创或收益排名。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/131CDA1/dsh-scrape-webpage/blob/7485af10c063579323058583c7f13e69c4c8bd21/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * dsh-scrape-webpage —— 网页抓取与分析插件（宿主组合行，Host-only，零依赖）。
 *
 * 模块结构（低耦合：纯函数层 ← 服务层 ← 组合层）：
 *  - html.js     HTML/文本解析（纯函数）
 *  - analyze.js  统计与关键词分析（纯函数）
 *  - curl.js     curl 命令构建与结果解析（纯函数）
 *  - fetch.js    抓取执行层（会话沙箱策略、shell/curl 执行、审批升级）
 *  - index.js    插件主体（工具注册、编排、识图分析器服务）
 *
 * 能力：
 *  - 注册模型工具 `scrape_webpage`：抓取网页并提取标题/描述/正文/标题结构/链接，
 *    统计字符数、词数、预计阅读时长，计算高频关键词（中文二元组 + 英文单词，含停用词过滤）。
 *  - 可选下载页面内容图片（images 参数，上限 6 张）到会话工作区 .scrape-images 目录，
 *    返回本地路径供视觉模型 read_image 分析。
 *  - 提供 `scrape.imageAnalyzer` 服务（register/list/analyze）：识图插件注册分析器后，
 *    下载的图片自动交给分析器，结果附在工具输出的 imageAnalysis 中。
 *
 * 抓取链路与安全：
 *  - 优先使用宿主 web 服务的 fetch provider（若部署了）；否则经 shell 服务调用 curl.exe。
 *  - 默认在沙箱内（会话策略）执行；HTTPS 因沙箱 TLS 凭据受限失败时返回
 *    escalation available 提示，模型可用 sandbox_permissions="danger-full-access"
 *    + justification 重试一次，由审批弹窗决定（与 pwsh 工具的升级契约一致）。
 *  - 依赖宿主服务：tools、systemPrompt、timer（硬依赖）；web、shell、sandboxPolicy、
 *    approval、sessions（可选，缺失时优雅降级报错）。
 */

import { normalizeUrl, extractImages, extractFromHtml } from './html.js'
import { computeStats, topKeywords, formatScrapeText } from './analyze.js'
import { createFetchLayer } from './fetch.js'

export const name = 'dsh-scrape-webpage'
export const inject = ['timer', 'tools', 'systemPrompt']

export function apply(ctx) {
  const { resolveSessionPolicy, fetchViaShell, downloadImages, resolveEscalationPolicy } = createFetchLayer(ctx)

  // ===== 识图分析器扩展接口（发布到宿主 realm，供识图插件注册） =====
  const analyzerRegistry = {
    analyzers: new Map(),
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

最强支持是固定版本实现确有完整入口和防御分支。最关键限制是：静态抓取对登录、脚本渲染、反爬和页面结构变化敏感；源码结构能证明降级路径存在，但没有同站点样本证明正文完整性和稳定性。 这会直接收窄采用范围，而不是否定所有能力。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/131CDA1/dsh-scrape-webpage/blob/7485af10c063579323058583c7f13e69c4c8bd21/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * dsh-scrape-webpage —— 网页抓取与分析插件（宿主组合行，Host-only，零依赖）。
 *
 * 模块结构（低耦合：纯函数层 ← 服务层 ← 组合层）：
 *  - html.js     HTML/文本解析（纯函数）
 *  - analyze.js  统计与关键词分析（纯函数）
 *  - curl.js     curl 命令构建与结果解析（纯函数）
 *  - fetch.js    抓取执行层（会话沙箱策略、shell/curl 执行、审批升级）
 *  - index.js    插件主体（工具注册、编排、识图分析器服务）
 *
 * 能力：
 *  - 注册模型工具 `scrape_webpage`：抓取网页并提取标题/描述/正文/标题结构/链接，
 *    统计字符数、词数、预计阅读时长，计算高频关键词（中文二元组 + 英文单词，含停用词过滤）。
 *  - 可选下载页面内容图片（images 参数，上限 6 张）到会话工作区 .scrape-images 目录，
 *    返回本地路径供视觉模型 read_image 分析。
 *  - 提供 `scrape.imageAnalyzer` 服务（register/list/analyze）：识图插件注册分析器后，
 *    下载的图片自动交给分析器，结果附在工具输出的 imageAnalysis 中。
 *
 * 抓取链路与安全：
 *  - 优先使用宿主 web 服务的 fetch provider（若部署了）；否则经 shell 服务调用 curl.exe。
 *  - 默认在沙箱内（会话策略）执行；HTTPS 因沙箱 TLS 凭据受限失败时返回
 *    escalation available 提示，模型可用 sandbox_permissions="danger-full-access"
 *    + justification 重试一次，由审批弹窗决定（与 pwsh 工具的升级契约一致）。
 *  - 依赖宿主服务：tools、systemPrompt、timer（硬依赖）；web、shell、sandboxPolicy、
 *    approval、sessions（可选，缺失时优雅降级报错）。
 */

import { normalizeUrl, extractImages, extractFromHtml } from './html.js'
import { computeStats, topKeywords, formatScrapeText } from './analyze.js'
import { createFetchLayer } from './fetch.js'

export const name = 'dsh-scrape-webpage'
export const inject = ['timer', 'tools', 'systemPrompt']

export function apply(ctx) {
  const { resolveSessionPolicy, fetchViaShell, downloadImages, resolveEscalationPolicy } = createFetchLayer(ctx)

  // ===== 识图分析器扩展接口（发布到宿主 realm，供识图插件注册） =====
  const analyzerRegistry = {
    analyzers: new Map(),
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复分别依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要 DSH tools 服务、Node 网络访问及目标站点允许访问；curl 或浏览器相关能力只在对应分支可用，登录态和付费墙没有通用保证。 启动成功、持续有用和失败恢复是三类不同条件；缺少依赖时不能把“已注册”当作任务已办结。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/131CDA1/dsh-scrape-webpage/blob/7485af10c063579323058583c7f13e69c4c8bd21/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * dsh-scrape-webpage —— 网页抓取与分析插件（宿主组合行，Host-only，零依赖）。
 *
 * 模块结构（低耦合：纯函数层 ← 服务层 ← 组合层）：
 *  - html.js     HTML/文本解析（纯函数）
 *  - analyze.js  统计与关键词分析（纯函数）
 *  - curl.js     curl 命令构建与结果解析（纯函数）
 *  - fetch.js    抓取执行层（会话沙箱策略、shell/curl 执行、审批升级）
 *  - index.js    插件主体（工具注册、编排、识图分析器服务）
 *
 * 能力：
 *  - 注册模型工具 `scrape_webpage`：抓取网页并提取标题/描述/正文/标题结构/链接，
 *    统计字符数、词数、预计阅读时长，计算高频关键词（中文二元组 + 英文单词，含停用词过滤）。
 *  - 可选下载页面内容图片（images 参数，上限 6 张）到会话工作区 .scrape-images 目录，
 *    返回本地路径供视觉模型 read_image 分析。
 *  - 提供 `scrape.imageAnalyzer` 服务（register/list/analyze）：识图插件注册分析器后，
 *    下载的图片自动交给分析器，结果附在工具输出的 imageAnalysis 中。
 *
 * 抓取链路与安全：
 *  - 优先使用宿主 web 服务的 fetch provider（若部署了）；否则经 shell 服务调用 curl.exe。
 *  - 默认在沙箱内（会话策略）执行；HTTPS 因沙箱 TLS 凭据受限失败时返回
 *    escalation available 提示，模型可用 sandbox_permissions="danger-full-access"
 *    + justification 重试一次，由审批弹窗决定（与 pwsh 工具的升级契约一致）。
 *  - 依赖宿主服务：tools、systemPrompt、timer（硬依赖）；web、shell、sandboxPolicy、
 *    approval、sessions（可选，缺失时优雅降级报错）。
 */

import { normalizeUrl, extractImages, extractFromHtml } from './html.js'
import { computeStats, topKeywords, formatScrapeText } from './analyze.js'
import { createFetchLayer } from './fetch.js'

export const name = 'dsh-scrape-webpage'
export const inject = ['timer', 'tools', 'systemPrompt']

export function apply(ctx) {
  const { resolveSessionPolicy, fetchViaShell, downloadImages, resolveEscalationPolicy } = createFetchLayer(ctx)

  // ===== 识图分析器扩展接口（发布到宿主 realm，供识图插件注册） =====
  const analyzerRegistry = {
    analyzers: new Map(),
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 首次、持续与失败恢复成本及效果证据如何？

**研究主题**：效果与总成本

#### 完整回答

首次成本是安装插件并确定网络、超时和可用获取后端；单次持续成本主要是一次或多次 HTTP/curl 请求、HTML 解析占用和模型上下文中的正文长度；失败时可能依次尝试备用获取路径并由用户回到浏览器手工复制。合格单位应是一篇“关键正文和来源链接均可回查”的页面，而不是 HTTP 200。当前缺少不同站点类型的正文召回率、请求次数、字节数和人工补录分钟数。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/131CDA1/dsh-scrape-webpage/blob/7485af10c063579323058583c7f13e69c4c8bd21/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * dsh-scrape-webpage —— 网页抓取与分析插件（宿主组合行，Host-only，零依赖）。
 *
 * 模块结构（低耦合：纯函数层 ← 服务层 ← 组合层）：
 *  - html.js     HTML/文本解析（纯函数）
 *  - analyze.js  统计与关键词分析（纯函数）
 *  - curl.js     curl 命令构建与结果解析（纯函数）
 *  - fetch.js    抓取执行层（会话沙箱策略、shell/curl 执行、审批升级）
 *  - index.js    插件主体（工具注册、编排、识图分析器服务）
 *
 * 能力：
 *  - 注册模型工具 `scrape_webpage`：抓取网页并提取标题/描述/正文/标题结构/链接，
 *    统计字符数、词数、预计阅读时长，计算高频关键词（中文二元组 + 英文单词，含停用词过滤）。
 *  - 可选下载页面内容图片（images 参数，上限 6 张）到会话工作区 .scrape-images 目录，
 *    返回本地路径供视觉模型 read_image 分析。
 *  - 提供 `scrape.imageAnalyzer` 服务（register/list/analyze）：识图插件注册分析器后，
 *    下载的图片自动交给分析器，结果附在工具输出的 imageAnalysis 中。
 *
 * 抓取链路与安全：
 *  - 优先使用宿主 web 服务的 fetch provider（若部署了）；否则经 shell 服务调用 curl.exe。
 *  - 默认在沙箱内（会话策略）执行；HTTPS 因沙箱 TLS 凭据受限失败时返回
 *    escalation available 提示，模型可用 sandbox_permissions="danger-full-access"
 *    + justification 重试一次，由审批弹窗决定（与 pwsh 工具的升级契约一致）。
 *  - 依赖宿主服务：tools、systemPrompt、timer（硬依赖）；web、shell、sandboxPolicy、
 *    approval、sessions（可选，缺失时优雅降级报错）。
 */

import { normalizeUrl, extractImages, extractFromHtml } from './html.js'
import { computeStats, topKeywords, formatScrapeText } from './analyze.js'
import { createFetchLayer } from './fetch.js'

export const name = 'dsh-scrape-webpage'
export const inject = ['timer', 'tools', 'systemPrompt']

export function apply(ctx) {
  const { resolveSessionPolicy, fetchViaShell, downloadImages, resolveEscalationPolicy } = createFetchLayer(ctx)

  // ===== 识图分析器扩展接口（发布到宿主 realm，供识图插件注册） =====
  const analyzerRegistry = {
    analyzers: new Map(),
```

</details>

#### 缺口

- 缺少静态页、脚本页、反爬页与长文页的正文完整率、请求次数、抓取字节和人工补录时间。
  **影响**：无法判断多后端降级是否比直接 curl 或浏览器复制更省时。
  **进一步探讨**：建立含已知正文的站点样本，对 scrape_webpage、curl 和手工复制比较关键段落召回、噪声比例、总请求数和人工修正分钟。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现有哪些可靠性取舍和可复用设计？

**研究主题**：工程质量与复用

#### 完整回答

获取、解析和分析职责拆分清楚，便于替换单一后端；主要维护风险来自站点差异、超时和正文抽取启发式，试用需保留原链接并抽查遗漏。 这些判断来自结构与错误路径抽读，不等于完整安全审计或生产可靠性证明。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/131CDA1/dsh-scrape-webpage/blob/7485af10c063579323058583c7f13e69c4c8bd21/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * dsh-scrape-webpage —— 网页抓取与分析插件（宿主组合行，Host-only，零依赖）。
 *
 * 模块结构（低耦合：纯函数层 ← 服务层 ← 组合层）：
 *  - html.js     HTML/文本解析（纯函数）
 *  - analyze.js  统计与关键词分析（纯函数）
 *  - curl.js     curl 命令构建与结果解析（纯函数）
 *  - fetch.js    抓取执行层（会话沙箱策略、shell/curl 执行、审批升级）
 *  - index.js    插件主体（工具注册、编排、识图分析器服务）
 *
 * 能力：
 *  - 注册模型工具 `scrape_webpage`：抓取网页并提取标题/描述/正文/标题结构/链接，
 *    统计字符数、词数、预计阅读时长，计算高频关键词（中文二元组 + 英文单词，含停用词过滤）。
 *  - 可选下载页面内容图片（images 参数，上限 6 张）到会话工作区 .scrape-images 目录，
 *    返回本地路径供视觉模型 read_image 分析。
 *  - 提供 `scrape.imageAnalyzer` 服务（register/list/analyze）：识图插件注册分析器后，
 *    下载的图片自动交给分析器，结果附在工具输出的 imageAnalysis 中。
 *
 * 抓取链路与安全：
 *  - 优先使用宿主 web 服务的 fetch provider（若部署了）；否则经 shell 服务调用 curl.exe。
 *  - 默认在沙箱内（会话策略）执行；HTTPS 因沙箱 TLS 凭据受限失败时返回
 *    escalation available 提示，模型可用 sandbox_permissions="danger-full-access"
 *    + justification 重试一次，由审批弹窗决定（与 pwsh 工具的升级契约一致）。
 *  - 依赖宿主服务：tools、systemPrompt、timer（硬依赖）；web、shell、sandboxPolicy、
 *    approval、sessions（可选，缺失时优雅降级报错）。
 */

import { normalizeUrl, extractImages, extractFromHtml } from './html.js'
import { computeStats, topKeywords, formatScrapeText } from './analyze.js'
import { createFetchLayer } from './fetch.js'

export const name = 'dsh-scrape-webpage'
export const inject = ['timer', 'tools', 'systemPrompt']

export function apply(ctx) {
  const { resolveSessionPolicy, fetchViaShell, downloadImages, resolveEscalationPolicy } = createFetchLayer(ctx)

  // ===== 识图分析器扩展接口（发布到宿主 realm，供识图插件注册） =====
  const analyzerRegistry = {
    analyzers: new Map(),
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献和限制能推导什么未验证方向？

**研究主题**：新假设与验证

#### 完整回答

从已确认机制与关键限制可推导：可增加“证据保真模式”，同时返回正文、关键 DOM 定位和被删除区块摘要，让研究任务在压缩上下文时仍能回查来源。 最小验证应与现有简单流程在相同任务、模型、预算和验收标准下比较，并在人工投入或失败率上升时否定该方向。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/131CDA1/dsh-scrape-webpage/blob/7485af10c063579323058583c7f13e69c4c8bd21/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * dsh-scrape-webpage —— 网页抓取与分析插件（宿主组合行，Host-only，零依赖）。
 *
 * 模块结构（低耦合：纯函数层 ← 服务层 ← 组合层）：
 *  - html.js     HTML/文本解析（纯函数）
 *  - analyze.js  统计与关键词分析（纯函数）
 *  - curl.js     curl 命令构建与结果解析（纯函数）
 *  - fetch.js    抓取执行层（会话沙箱策略、shell/curl 执行、审批升级）
 *  - index.js    插件主体（工具注册、编排、识图分析器服务）
 *
 * 能力：
 *  - 注册模型工具 `scrape_webpage`：抓取网页并提取标题/描述/正文/标题结构/链接，
 *    统计字符数、词数、预计阅读时长，计算高频关键词（中文二元组 + 英文单词，含停用词过滤）。
 *  - 可选下载页面内容图片（images 参数，上限 6 张）到会话工作区 .scrape-images 目录，
 *    返回本地路径供视觉模型 read_image 分析。
 *  - 提供 `scrape.imageAnalyzer` 服务（register/list/analyze）：识图插件注册分析器后，
 *    下载的图片自动交给分析器，结果附在工具输出的 imageAnalysis 中。
 *
 * 抓取链路与安全：
 *  - 优先使用宿主 web 服务的 fetch provider（若部署了）；否则经 shell 服务调用 curl.exe。
 *  - 默认在沙箱内（会话策略）执行；HTTPS 因沙箱 TLS 凭据受限失败时返回
 *    escalation available 提示，模型可用 sandbox_permissions="danger-full-access"
 *    + justification 重试一次，由审批弹窗决定（与 pwsh 工具的升级契约一致）。
 *  - 依赖宿主服务：tools、systemPrompt、timer（硬依赖）；web、shell、sandboxPolicy、
 *    approval、sessions（可选，缺失时优雅降级报错）。
 */

import { normalizeUrl, extractImages, extractFromHtml } from './html.js'
import { computeStats, topKeywords, formatScrapeText } from './analyze.js'
import { createFetchLayer } from './fetch.js'

export const name = 'dsh-scrape-webpage'
export const inject = ['timer', 'tools', 'systemPrompt']

export function apply(ctx) {
  const { resolveSessionPolicy, fetchViaShell, downloadImages, resolveEscalationPolicy } = createFetchLayer(ctx)

  // ===== 识图分析器扩展接口（发布到宿主 realm，供识图插件注册） =====
  const analyzerRegistry = {
    analyzers: new Map(),
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对什么人值得观察或试用，成功与停止条件是什么？

**研究主题**：采用判断

#### 完整回答

适合公开、无需登录且正文可抽查的研究页面小范围试用；登录态、强脚本渲染或付费墙继续使用宿主浏览器。成功标准是关键段落召回、标题与链接保留达到预定样本门槛，且人工修正少于复制粘贴；连续出现空正文、错正文或反爬重试时应停止并切换浏览器。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/131CDA1/dsh-scrape-webpage/blob/7485af10c063579323058583c7f13e69c4c8bd21/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * dsh-scrape-webpage —— 网页抓取与分析插件（宿主组合行，Host-only，零依赖）。
 *
 * 模块结构（低耦合：纯函数层 ← 服务层 ← 组合层）：
 *  - html.js     HTML/文本解析（纯函数）
 *  - analyze.js  统计与关键词分析（纯函数）
 *  - curl.js     curl 命令构建与结果解析（纯函数）
 *  - fetch.js    抓取执行层（会话沙箱策略、shell/curl 执行、审批升级）
 *  - index.js    插件主体（工具注册、编排、识图分析器服务）
 *
 * 能力：
 *  - 注册模型工具 `scrape_webpage`：抓取网页并提取标题/描述/正文/标题结构/链接，
 *    统计字符数、词数、预计阅读时长，计算高频关键词（中文二元组 + 英文单词，含停用词过滤）。
 *  - 可选下载页面内容图片（images 参数，上限 6 张）到会话工作区 .scrape-images 目录，
 *    返回本地路径供视觉模型 read_image 分析。
 *  - 提供 `scrape.imageAnalyzer` 服务（register/list/analyze）：识图插件注册分析器后，
 *    下载的图片自动交给分析器，结果附在工具输出的 imageAnalysis 中。
 *
 * 抓取链路与安全：
 *  - 优先使用宿主 web 服务的 fetch provider（若部署了）；否则经 shell 服务调用 curl.exe。
 *  - 默认在沙箱内（会话策略）执行；HTTPS 因沙箱 TLS 凭据受限失败时返回
 *    escalation available 提示，模型可用 sandbox_permissions="danger-full-access"
 *    + justification 重试一次，由审批弹窗决定（与 pwsh 工具的升级契约一致）。
 *  - 依赖宿主服务：tools、systemPrompt、timer（硬依赖）；web、shell、sandboxPolicy、
 *    approval、sessions（可选，缺失时优雅降级报错）。
 */

import { normalizeUrl, extractImages, extractFromHtml } from './html.js'
import { computeStats, topKeywords, formatScrapeText } from './analyze.js'
import { createFetchLayer } from './fetch.js'

export const name = 'dsh-scrape-webpage'
export const inject = ['timer', 'tools', 'systemPrompt']

export function apply(ctx) {
  const { resolveSessionPolicy, fetchViaShell, downloadImages, resolveEscalationPolicy } = createFetchLayer(ctx)

  // ===== 识图分析器扩展接口（发布到宿主 realm，供识图插件注册） =====
  const analyzerRegistry = {
    analyzers: new Map(),
```

</details>

#### 缺口

- 未对多类网站测量正文召回和错误抽取。
  **影响**：无法确定“统一抓取工具”在目标站点组合上的可靠采用范围。
  **进一步探讨**：用带人工金标的公开页面样本测关键段落召回、噪声比例、失败率和人工修正时间。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
