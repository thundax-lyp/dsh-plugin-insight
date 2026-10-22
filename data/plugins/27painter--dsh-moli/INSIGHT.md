# dsh-moli

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[16b5886](https://github.com/27painter/dsh-moli/tree/16b5886d35827047e3e8736da356c8c55c9ae564)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/27painter/dsh-moli) [![npm 30d 1,514](https://img.shields.io/static/v1?label=npm+30d&message=1%2C514&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-moli) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-moli)
<!-- END META -->

> **实现功能**：把 Moli 无头浏览器封装成网页抓取、探测和按需安装工具。

> **核心亮点**：同一工具覆盖 Markdown、HTML、语义树、JSON、截图和 PDF，价值在浏览器渲染与可编程提取，而非替代所有网页读取。 详见[Q03](#research-q03)。

> **风险与缺陷**：约 101MB 的独立二进制与下载执行扩大供应链；安装器只报告 SHA256，未内置可信期望值，登录页效果也取决于 Moli 配置。 详见[Q04](#research-q04)。

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
  - [Q01 · 场景：面向 JavaScript 渲染、选择器抽取、登录态页面和截图/PDF？](#detail-section-11)
  - [Q02 · 机制：moli_fetch 组装格式、选择器、脚本与输出参数调用外部 Moli？](#detail-section-12)
  - [Q03 · 贡献：同一工具覆盖 Markdown、HTML、语义树、JSON、截图和 PDF，价值在浏览器渲染与可编程提取，而非替代所有网页读取。？](#detail-section-13)
  - [Q04 · 局限：约 101MB 的独立二进制与下载执行扩大供应链？](#detail-section-14)
  - [Q05 · 依赖：Node 20.12+、可执行 Moli 与浏览器环境是主链？](#detail-section-15)
  - [Q06 · 成本与效果：插件本体很小，但首次安装约下载 101MB，渲染每页消耗浏览器进程、时间与内存？](#detail-section-16)
  - [Q07 · 工程：探测与抓取拆开、参数边界和错误回传清楚？](#detail-section-17)
  - [Q08 · 假设：若把期望 SHA256 绑定到发行版本，并记录冷启动/选择器成功率，可把“自动装浏览器”从便利功能变成可审计依赖。？](#detail-section-18)
  - [Q09 · 采用：仅在确需 SPA、截图或登录态抽取时于隔离 profile 小范围试用？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向 JavaScript 渲染、选择器抽取、登录态页面和截图/PDF；静态公开页用普通 fetch 更短、更少供应链。 详见[Q01](#research-q01)。

面向 JavaScript 渲染、选择器抽取、登录态页面和截图/PDF；静态公开页用普通 fetch 更短、更少供应链。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

#### 能力明细

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 模型工具 | moli_fetch 抓取渲染页，moli_probe 探测或安装 Moli | 目标系统中 Moli 二进制、浏览器沙箱与复杂站点兼容未验证 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| Moli 可执行文件 | 必需 | 渲染与导出 | 工具返回不可用 |
| 官方 release/安装器 | 自动安装时 | 下载约 101MB 依赖 | 离线时手工安装 |
| 浏览器会话 | 登录页时 | 承载 cookie/脚本 | 退回公开页抓取 |

#### 启动步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 探测 | 调用 moli_probe | 记录版本、HTTPS 与路径 |
| 固定依赖 | 校验下载 SHA256 | 不匹配即停止 |
| 抓取 | moli_fetch 指定 format/selector | 失败保留 URL 与错误 |
| 回退 | 改用普通 fetch | 仅适用于无需渲染页面 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 准备 | 约 101MB 二进制下载 | 固定版本/哈希 | 带宽与磁盘按 release 计 |
| 单页 | 浏览器进程与渲染等待 | 选 selector/format | P95 与 RSS 未测 |
| 失败 | 重装或退回 fetch | 排查站点/证书 | 登录态恢复未测 |

#### 效果

| 效果项 | 源码支持 | 验证指标 |
| --- | --- | --- |
| SPA 正文 | 渲染后再转 Markdown | 20 页正文完整率 |
| 定点提取 | selector 与 eval 可组合 | 20 次字段命中率 |
| 简单静态页 | 没有明显优势 | 与普通 fetch 的耗时差 |

> **思考**：约 101MB 的独立二进制与下载执行扩大供应链；安装器只报告 SHA256，未内置可信期望值，登录页效果也取决于 Moli 配置。 详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：同一工具覆盖 Markdown、HTML、语义树、JSON、截图和 PDF，价值在浏览器渲染与可编程提取，而非替代所有网页读取。 详见[Q03](#research-q03)。

同一工具覆盖 Markdown、HTML、语义树、JSON、截图和 PDF，价值在浏览器渲染与可编程提取，而非替代所有网页读取。 详见[Q03](#research-q03)。

探测与抓取拆开、参数边界和错误回传清楚；安装完整性仍需要固定版本哈希或签名策略。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

约 101MB 的独立二进制与下载执行扩大供应链；安装器只报告 SHA256，未内置可信期望值，登录页效果也取决于 Moli 配置。 详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅在确需 SPA、截图或登录态抽取时于隔离 profile 小范围试用；先手工固定 Moli 版本和哈希，静态页继续用普通 fetch。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定提交可确认 moli_fetch、moli_probe 与下载器的接线，但未启动 Moli 或浏览器，也未验证约 101MB 发行物、站点渲染和登录态兼容；结论限于外置浏览器工具的源码设计。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/moli.js、lib/install.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 README.md、index.js、lib/moli.js、lib/install.js 与 prepared inventory；未安装、未运行、未访问真实账号/设备/服务。目标系统中 Moli 二进制、浏览器沙箱与复杂站点兼容未验证。
- 下一步：下一步只做本项可证伪实验：固定一个 Moli release 哈希，分别对静态页、SPA、登录页各跑 20 次并记录成功率、P95 延迟和峰值 RSS。

**分析版本**

- **仓库**：[27painter/dsh-moli](https://github.com/27painter/dsh-moli)
- **版本号**：1.1.20（[固定提交 16b5886](https://github.com/27painter/dsh-moli/tree/16b5886d35827047e3e8736da356c8c55c9ae564)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

若把期望 SHA256 绑定到发行版本，并记录冷启动/选择器成功率，可把“自动装浏览器”从便利功能变成可审计依赖。 详见[Q08](#research-q08)。

下一步只做本项可证伪实验：固定一个 Moli release 哈希，分别对静态页、SPA、登录页各跑 20 次并记录成功率、P95 延迟和峰值 RSS。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 2756 | 1810 | 846 | — |
| .md | source | 2 | 1176 | — | — | 13129 |
| .mjs | source | 14 | 1908 | 1390 | 405 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/27painter/dsh-moli/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Moli 外置浏览器能否以可控安装与失败恢复成本补足普通 HTTP 抓取？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 场景：面向 JavaScript 渲染、选择器抽取、登录态页面和截图/PDF？

**研究主题**：场景与需求

#### 完整回答

面向 JavaScript 渲染、选择器抽取、登录态页面和截图/PDF；静态公开页用普通 fetch 更短、更少供应链。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-30](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/README.md#L1-L30)

固定提交复核：场景相关声明与实现入口。

<details>
<summary>查看原文（30行）</summary>

```text
# dsh-moli

[![npm version](https://img.shields.io/npm/v/dsh-moli)](https://www.npmjs.com/package/dsh-moli)
[![license](https://img.shields.io/npm/l/dsh-moli)](LICENSE)
[![listed in awesome-dsh-plugin](https://img.shields.io/badge/awesome--dsh--plugin-listed-3964fe)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)

**Two tools that let a DeepSeek Harness agent drive a real headless browser.** They wrap
[Moli](https://github.com/lexmount/moli) — a Rust headless browser built for AI agents — so an agent can
read pages that only exist after JavaScript runs, and can produce pictures of them.

English | [中文](README.zh.md)

## What it does, and when you want it

A plain HTTP fetch returns the HTML the server sent. That is enough for articles, docs and APIs, and
DSH already covers it with `web_fetch`. It is not enough for anything a browser has to build:

- **Single-page apps** — a client-rendered news site, dashboard or docs site. The response is an empty
  shell; the content appears only after scripts run.
- **Logins and consent walls** — a page that needs a session or cookie before it shows anything.
- **Pictures** — a screenshot to see what a page looks like, or a PDF to keep.
- **One value from deep inside a page** — a price, a count, a title, read with a selector instead of
  pulling the whole document.
- **A list you can read for 7% of the page** — `selector` returns only the matched containers, which
  on a real feed measured 1,779 characters against 139,338 for the same page as Markdown. If you are
  about to fetch a listing page and skim it, read the `selector` section under Usage first.

For those jobs this plugin gives the agent two tools:

| Tool | What it does |
```

</details>

#### 缺口

- 目标系统中 Moli 二进制、浏览器沙箱与复杂站点兼容未验证
  **影响**：场景结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：固定一个 Moli release 哈希，分别对静态页、SPA、登录页各跑 20 次并记录成功率、P95 延迟和峰值 RSS

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 机制：moli_fetch 组装格式、选择器、脚本与输出参数调用外部 Moli？

**研究主题**：功能与机制

#### 完整回答

moli_fetch 组装格式、选择器、脚本与输出参数调用外部 Moli；moli_probe 检查版本、HTTPS 能力并可下载发行版安装器。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-20](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/index.js#L1-L20)

固定提交复核：机制相关声明与实现入口。

<details>
<summary>查看原文（20行）</summary>

```text
/** Host half of dsh-moli: expose the local `moli` headless browser as callable tools. */
import { MANUAL_INSTALL, installMoli, uninstallMoli } from './lib/install.js';
import { findMoli, moliCandidates, moliVersion, probe, runFetch } from './lib/moli.js';

export const name = 'dsh-moli';
export const inject = ['tools'];

/**
 * `@deepseek-ai/schemastery` powers the live Config schema and therefore the
 * settings namespace. A profile plugin is loaded from its real path on disk (a
 * `link:` dependency stays a symlink target), so a bare specifier must resolve
 * against the plugin's own `node_modules` chain — which does not exist when the
 * plugin is installed as a `link:`/junction (the README's first install route).
 * The import is therefore optional: without schemastery the settings form does
 * not appear and the plugin degrades to plain patch-layer configuration, while
 * `moli_fetch` / `moli_probe` keep registering — those are the plugin's reason
 * to exist, and losing them would be worse than losing the form.
 */
let z;
try {
```

</details>

#### 缺口

- 目标系统中 Moli 二进制、浏览器沙箱与复杂站点兼容未验证
  **影响**：机制结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：固定一个 Moli release 哈希，分别对静态页、SPA、登录页各跑 20 次并记录成功率、P95 延迟和峰值 RSS

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 贡献：同一工具覆盖 Markdown、HTML、语义树、JSON、截图和 PDF，价值在浏览器渲染与可编程提取，而非替代所有网页读取。？

**研究主题**：贡献与相对优势

#### 完整回答

同一工具覆盖 Markdown、HTML、语义树、JSON、截图和 PDF，价值在浏览器渲染与可编程提取，而非替代所有网页读取。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-30](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/README.md#L1-L30)

固定提交复核：贡献相关声明与实现入口。

<details>
<summary>查看原文（30行）</summary>

```text
# dsh-moli

[![npm version](https://img.shields.io/npm/v/dsh-moli)](https://www.npmjs.com/package/dsh-moli)
[![license](https://img.shields.io/npm/l/dsh-moli)](LICENSE)
[![listed in awesome-dsh-plugin](https://img.shields.io/badge/awesome--dsh--plugin-listed-3964fe)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)

**Two tools that let a DeepSeek Harness agent drive a real headless browser.** They wrap
[Moli](https://github.com/lexmount/moli) — a Rust headless browser built for AI agents — so an agent can
read pages that only exist after JavaScript runs, and can produce pictures of them.

English | [中文](README.zh.md)

## What it does, and when you want it

A plain HTTP fetch returns the HTML the server sent. That is enough for articles, docs and APIs, and
DSH already covers it with `web_fetch`. It is not enough for anything a browser has to build:

- **Single-page apps** — a client-rendered news site, dashboard or docs site. The response is an empty
  shell; the content appears only after scripts run.
- **Logins and consent walls** — a page that needs a session or cookie before it shows anything.
- **Pictures** — a screenshot to see what a page looks like, or a PDF to keep.
- **One value from deep inside a page** — a price, a count, a title, read with a selector instead of
  pulling the whole document.
- **A list you can read for 7% of the page** — `selector` returns only the matched containers, which
  on a real feed measured 1,779 characters against 139,338 for the same page as Markdown. If you are
  about to fetch a listing page and skim it, read the `selector` section under Usage first.

For those jobs this plugin gives the agent two tools:

| Tool | What it does |
```

</details>

#### 缺口

- 目标系统中 Moli 二进制、浏览器沙箱与复杂站点兼容未验证
  **影响**：贡献结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：固定一个 Moli release 哈希，分别对静态页、SPA、登录页各跑 20 次并记录成功率、P95 延迟和峰值 RSS

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 局限：约 101MB 的独立二进制与下载执行扩大供应链？

**研究主题**：缺陷与关键质疑

#### 完整回答

约 101MB 的独立二进制与下载执行扩大供应链；安装器只报告 SHA256，未内置可信期望值，登录页效果也取决于 Moli 配置。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-20](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/index.js#L1-L20)

固定提交复核：局限相关声明与实现入口。

<details>
<summary>查看原文（20行）</summary>

```text
/** Host half of dsh-moli: expose the local `moli` headless browser as callable tools. */
import { MANUAL_INSTALL, installMoli, uninstallMoli } from './lib/install.js';
import { findMoli, moliCandidates, moliVersion, probe, runFetch } from './lib/moli.js';

export const name = 'dsh-moli';
export const inject = ['tools'];

/**
 * `@deepseek-ai/schemastery` powers the live Config schema and therefore the
 * settings namespace. A profile plugin is loaded from its real path on disk (a
 * `link:` dependency stays a symlink target), so a bare specifier must resolve
 * against the plugin's own `node_modules` chain — which does not exist when the
 * plugin is installed as a `link:`/junction (the README's first install route).
 * The import is therefore optional: without schemastery the settings form does
 * not appear and the plugin degrades to plain patch-layer configuration, while
 * `moli_fetch` / `moli_probe` keep registering — those are the plugin's reason
 * to exist, and losing them would be worse than losing the form.
 */
let z;
try {
```

</details>

#### 缺口

- 目标系统中 Moli 二进制、浏览器沙箱与复杂站点兼容未验证
  **影响**：局限结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：固定一个 Moli release 哈希，分别对静态页、SPA、登录页各跑 20 次并记录成功率、P95 延迟和峰值 RSS

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 依赖：Node 20.12+、可执行 Moli 与浏览器环境是主链？

**研究主题**：依赖、兼容与流程

#### 完整回答

Node 20.12+、可执行 Moli 与浏览器环境是主链；自动安装还依赖官方 release 网络和本机写入权限。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-30](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/README.md#L1-L30)

固定提交复核：依赖相关声明与实现入口。

<details>
<summary>查看原文（30行）</summary>

```text
# dsh-moli

[![npm version](https://img.shields.io/npm/v/dsh-moli)](https://www.npmjs.com/package/dsh-moli)
[![license](https://img.shields.io/npm/l/dsh-moli)](LICENSE)
[![listed in awesome-dsh-plugin](https://img.shields.io/badge/awesome--dsh--plugin-listed-3964fe)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)

**Two tools that let a DeepSeek Harness agent drive a real headless browser.** They wrap
[Moli](https://github.com/lexmount/moli) — a Rust headless browser built for AI agents — so an agent can
read pages that only exist after JavaScript runs, and can produce pictures of them.

English | [中文](README.zh.md)

## What it does, and when you want it

A plain HTTP fetch returns the HTML the server sent. That is enough for articles, docs and APIs, and
DSH already covers it with `web_fetch`. It is not enough for anything a browser has to build:

- **Single-page apps** — a client-rendered news site, dashboard or docs site. The response is an empty
  shell; the content appears only after scripts run.
- **Logins and consent walls** — a page that needs a session or cookie before it shows anything.
- **Pictures** — a screenshot to see what a page looks like, or a PDF to keep.
- **One value from deep inside a page** — a price, a count, a title, read with a selector instead of
  pulling the whole document.
- **A list you can read for 7% of the page** — `selector` returns only the matched containers, which
  on a real feed measured 1,779 characters against 139,338 for the same page as Markdown. If you are
  about to fetch a listing page and skim it, read the `selector` section under Usage first.

For those jobs this plugin gives the agent two tools:

| Tool | What it does |
```

</details>

#### 缺口

- 目标系统中 Moli 二进制、浏览器沙箱与复杂站点兼容未验证
  **影响**：依赖结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：固定一个 Moli release 哈希，分别对静态页、SPA、登录页各跑 20 次并记录成功率、P95 延迟和峰值 RSS

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本与效果：插件本体很小，但首次安装约下载 101MB，渲染每页消耗浏览器进程、时间与内存？

**研究主题**：效果与总成本

#### 完整回答

插件本体很小，但首次安装约下载 101MB，渲染每页消耗浏览器进程、时间与内存；本轮没有计量每页延迟。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-30](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/README.md#L1-L30)

固定提交复核：成本与效果相关声明与实现入口。

<details>
<summary>查看原文（30行）</summary>

```text
# dsh-moli

[![npm version](https://img.shields.io/npm/v/dsh-moli)](https://www.npmjs.com/package/dsh-moli)
[![license](https://img.shields.io/npm/l/dsh-moli)](LICENSE)
[![listed in awesome-dsh-plugin](https://img.shields.io/badge/awesome--dsh--plugin-listed-3964fe)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)

**Two tools that let a DeepSeek Harness agent drive a real headless browser.** They wrap
[Moli](https://github.com/lexmount/moli) — a Rust headless browser built for AI agents — so an agent can
read pages that only exist after JavaScript runs, and can produce pictures of them.

English | [中文](README.zh.md)

## What it does, and when you want it

A plain HTTP fetch returns the HTML the server sent. That is enough for articles, docs and APIs, and
DSH already covers it with `web_fetch`. It is not enough for anything a browser has to build:

- **Single-page apps** — a client-rendered news site, dashboard or docs site. The response is an empty
  shell; the content appears only after scripts run.
- **Logins and consent walls** — a page that needs a session or cookie before it shows anything.
- **Pictures** — a screenshot to see what a page looks like, or a PDF to keep.
- **One value from deep inside a page** — a price, a count, a title, read with a selector instead of
  pulling the whole document.
- **A list you can read for 7% of the page** — `selector` returns only the matched containers, which
  on a real feed measured 1,779 characters against 139,338 for the same page as Markdown. If you are
  about to fetch a listing page and skim it, read the `selector` section under Usage first.

For those jobs this plugin gives the agent two tools:

| Tool | What it does |
```

</details>

#### 缺口

- 目标系统中 Moli 二进制、浏览器沙箱与复杂站点兼容未验证
  **影响**：成本与效果结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：固定一个 Moli release 哈希，分别对静态页、SPA、登录页各跑 20 次并记录成功率、P95 延迟和峰值 RSS

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 工程：探测与抓取拆开、参数边界和错误回传清楚？

**研究主题**：工程质量与复用

#### 完整回答

探测与抓取拆开、参数边界和错误回传清楚；安装完整性仍需要固定版本哈希或签名策略。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-20](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/index.js#L1-L20)

固定提交复核：工程相关声明与实现入口。

<details>
<summary>查看原文（20行）</summary>

```text
/** Host half of dsh-moli: expose the local `moli` headless browser as callable tools. */
import { MANUAL_INSTALL, installMoli, uninstallMoli } from './lib/install.js';
import { findMoli, moliCandidates, moliVersion, probe, runFetch } from './lib/moli.js';

export const name = 'dsh-moli';
export const inject = ['tools'];

/**
 * `@deepseek-ai/schemastery` powers the live Config schema and therefore the
 * settings namespace. A profile plugin is loaded from its real path on disk (a
 * `link:` dependency stays a symlink target), so a bare specifier must resolve
 * against the plugin's own `node_modules` chain — which does not exist when the
 * plugin is installed as a `link:`/junction (the README's first install route).
 * The import is therefore optional: without schemastery the settings form does
 * not appear and the plugin degrades to plain patch-layer configuration, while
 * `moli_fetch` / `moli_probe` keep registering — those are the plugin's reason
 * to exist, and losing them would be worse than losing the form.
 */
let z;
try {
```

</details>

#### 缺口

- 目标系统中 Moli 二进制、浏览器沙箱与复杂站点兼容未验证
  **影响**：工程结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：固定一个 Moli release 哈希，分别对静态页、SPA、登录页各跑 20 次并记录成功率、P95 延迟和峰值 RSS

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 假设：若把期望 SHA256 绑定到发行版本，并记录冷启动/选择器成功率，可把“自动装浏览器”从便利功能变成可审计依赖。？

**研究主题**：新假设与验证

#### 完整回答

若把期望 SHA256 绑定到发行版本，并记录冷启动/选择器成功率，可把“自动装浏览器”从便利功能变成可审计依赖。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-30](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/README.md#L1-L30)

固定提交复核：假设相关声明与实现入口。

<details>
<summary>查看原文（30行）</summary>

```text
# dsh-moli

[![npm version](https://img.shields.io/npm/v/dsh-moli)](https://www.npmjs.com/package/dsh-moli)
[![license](https://img.shields.io/npm/l/dsh-moli)](LICENSE)
[![listed in awesome-dsh-plugin](https://img.shields.io/badge/awesome--dsh--plugin-listed-3964fe)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)

**Two tools that let a DeepSeek Harness agent drive a real headless browser.** They wrap
[Moli](https://github.com/lexmount/moli) — a Rust headless browser built for AI agents — so an agent can
read pages that only exist after JavaScript runs, and can produce pictures of them.

English | [中文](README.zh.md)

## What it does, and when you want it

A plain HTTP fetch returns the HTML the server sent. That is enough for articles, docs and APIs, and
DSH already covers it with `web_fetch`. It is not enough for anything a browser has to build:

- **Single-page apps** — a client-rendered news site, dashboard or docs site. The response is an empty
  shell; the content appears only after scripts run.
- **Logins and consent walls** — a page that needs a session or cookie before it shows anything.
- **Pictures** — a screenshot to see what a page looks like, or a PDF to keep.
- **One value from deep inside a page** — a price, a count, a title, read with a selector instead of
  pulling the whole document.
- **A list you can read for 7% of the page** — `selector` returns only the matched containers, which
  on a real feed measured 1,779 characters against 139,338 for the same page as Markdown. If you are
  about to fetch a listing page and skim it, read the `selector` section under Usage first.

For those jobs this plugin gives the agent two tools:

| Tool | What it does |
```

</details>

#### 缺口

- 目标系统中 Moli 二进制、浏览器沙箱与复杂站点兼容未验证
  **影响**：假设结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：固定一个 Moli release 哈希，分别对静态页、SPA、登录页各跑 20 次并记录成功率、P95 延迟和峰值 RSS

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 采用：仅在确需 SPA、截图或登录态抽取时于隔离 profile 小范围试用？

**研究主题**：采用判断

#### 完整回答

仅在确需 SPA、截图或登录态抽取时于隔离 profile 小范围试用；先手工固定 Moli 版本和哈希，静态页继续用普通 fetch。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-30](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/README.md#L1-L30)

固定提交复核：采用相关声明与实现入口。

<details>
<summary>查看原文（30行）</summary>

```text
# dsh-moli

[![npm version](https://img.shields.io/npm/v/dsh-moli)](https://www.npmjs.com/package/dsh-moli)
[![license](https://img.shields.io/npm/l/dsh-moli)](LICENSE)
[![listed in awesome-dsh-plugin](https://img.shields.io/badge/awesome--dsh--plugin-listed-3964fe)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)

**Two tools that let a DeepSeek Harness agent drive a real headless browser.** They wrap
[Moli](https://github.com/lexmount/moli) — a Rust headless browser built for AI agents — so an agent can
read pages that only exist after JavaScript runs, and can produce pictures of them.

English | [中文](README.zh.md)

## What it does, and when you want it

A plain HTTP fetch returns the HTML the server sent. That is enough for articles, docs and APIs, and
DSH already covers it with `web_fetch`. It is not enough for anything a browser has to build:

- **Single-page apps** — a client-rendered news site, dashboard or docs site. The response is an empty
  shell; the content appears only after scripts run.
- **Logins and consent walls** — a page that needs a session or cookie before it shows anything.
- **Pictures** — a screenshot to see what a page looks like, or a PDF to keep.
- **One value from deep inside a page** — a price, a count, a title, read with a selector instead of
  pulling the whole document.
- **A list you can read for 7% of the page** — `selector` returns only the matched containers, which
  on a real feed measured 1,779 characters against 139,338 for the same page as Markdown. If you are
  about to fetch a listing page and skim it, read the `selector` section under Usage first.

For those jobs this plugin gives the agent two tools:

| Tool | What it does |
```

</details>

#### 缺口

- 目标系统中 Moli 二进制、浏览器沙箱与复杂站点兼容未验证
  **影响**：采用结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：固定一个 Moli release 哈希，分别对静态页、SPA、登录页各跑 20 次并记录成功率、P95 延迟和峰值 RSS

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
