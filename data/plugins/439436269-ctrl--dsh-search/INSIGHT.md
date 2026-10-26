# dsh-search

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[24bc2e4](https://github.com/439436269-ctrl/dsh-search/tree/24bc2e4b985559fe05497530b5c4484bc9168d71)

<!-- BEGIN META -->
[![npm 30d 239](https://img.shields.io/static/v1?label=npm+30d&message=239&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@vfvrpq/dsh-search) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@vfvrpq/dsh-search)
<!-- END META -->

> **实现功能**：以 DeepSeek Search/Fetch API 提供检索、正文抓取和多页研究工具。

> **核心亮点**：搜索与正文抓取在同一 API 方言下串成可预算研究，优势是字段一致与权威度/日期等元数据。 详见[Q03](#research-q03)。

> **风险与缺陷**：无法替代登录、点击和强 SPA 浏览器；转义标点、HTML 壳与正文缺失会影响结果，摘要也不是独立事实验证。 详见[Q04](#research-q04)。

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
  - [Q01 · 场景：适合需要搜索语法、结果条数、正文和多页汇总可控的研究任务？](#detail-section-11)
  - [Q02 · 机制：三个工具分别检索、抓正文和执行 1+N 次研究链，带鉴权、超时、重试、QPS 限制和结构化结果。？](#detail-section-12)
  - [Q03 · 贡献：搜索与正文抓取在同一 API 方言下串成可预算研究，优势是字段一致与权威度/日期等元数据。？](#detail-section-13)
  - [Q04 · 局限：无法替代登录、点击和强 SPA 浏览器？](#detail-section-14)
  - [Q05 · 依赖：需要 DeepSeek Search API key、网络和服务配额？](#detail-section-15)
  - [Q06 · 成本与效果：作者口径成功请求每千次 5 元，即约 0.005 元/次？](#detail-section-16)
  - [Q07 · 工程：密钥分层、超时重试与显式 count 让预算可控？](#detail-section-17)
  - [Q08 · 假设：给 research 增加 maxCost 和逐 URL 去重/停止条件，可把“自动多页”变成可证明不超预算的检索单元。？](#detail-section-18)
  - [Q09 · 采用：可用公开、非敏感查询小范围试用？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合需要搜索语法、结果条数、正文和多页汇总可控的研究任务；已有 web_search/fetch 且需求简单时不必增加供应商。 详见[Q01](#research-q01)。

适合需要搜索语法、结果条数、正文和多页汇总可控的研究任务；已有 web_search/fetch 且需求简单时不必增加供应商。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

#### 能力明细

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 模型工具 | search、fetch、research 三个官方 API 工具 | 服务端计费失败规则、当前索引覆盖和真实正文成功率未核 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| Search API key | 必需 | 鉴权 search/fetch | 工具报认证错误 |
| 服务网络/配额 | 必需 | 返回搜索与正文 | 超时/限流重试 |
| 目标网页可抓取性 | fetch 时 | 正文解析 | 登录/SPA 失败 |

#### 启动步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 预算 | 设置 count 与 research N | 先算最大 1+N 次 |
| 检索 | search 得结构化结果 | 核日期/来源 |
| 抓取 | fetch 选少量 URL | 保留失败原因 |
| 对账 | 比较请求日志与账单 | 超预算即停 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| search/fetch | 约 0.005 元/成功请求 | 管理 key/配额 | 失败计费待核 |
| research | 1+N 次调用 | 选择 N/去重 | 成本随页面线性增加 |
| 人工复核 | 核来源和正文 | 排除摘要误导 | 每题耗时未测 |

#### 效果

| 效果项 | 源码支持 | 验证指标 |
| --- | --- | --- |
| 检索召回 | 结构化字段和语法 | Recall@10 |
| 正文可用 | 同供应商 fetch | 正文成功率 |
| 通用搜索对照 | 可能更可控但收费 | 每个合格来源成本 |

> **思考**：无法替代登录、点击和强 SPA 浏览器；转义标点、HTML 壳与正文缺失会影响结果，摘要也不是独立事实验证。 详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：搜索与正文抓取在同一 API 方言下串成可预算研究，优势是字段一致与权威度/日期等元数据。 详见[Q03](#research-q03)。

搜索与正文抓取在同一 API 方言下串成可预算研究，优势是字段一致与权威度/日期等元数据。 详见[Q03](#research-q03)。

密钥分层、超时重试与显式 count 让预算可控；应输出 request id、实际调用数与计费成功数以便对账。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

无法替代登录、点击和强 SPA 浏览器；转义标点、HTML 壳与正文缺失会影响结果，摘要也不是独立事实验证。 详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可用公开、非敏感查询小范围试用；先设 count/N 上限并以 100 个查询对照内置搜索的召回、正文成功率与实际账单。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可确认 search、fetch、research 的请求预算、重试与限流接线；本轮没有 API key、搜索请求或账单记录，作者给出的每千次价格和正文质量尚未成为当前服务效果证据。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/tools.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 README.md、lib/index.js、lib/tools.js 与 prepared inventory；未安装、未运行、未访问真实账号/设备/服务。服务端计费失败规则、当前索引覆盖和真实正文成功率未核。
- 下一步：下一步只做本项可证伪实验：固定 100 个带期望来源的查询，记录 search/fetch 请求数、成功数、账单元、召回@10、正文可读率和 P95。

**分析版本**

- **仓库**：[439436269-ctrl/dsh-search](https://github.com/439436269-ctrl/dsh-search)
- **版本号**：0.1.0（[固定提交 24bc2e4](https://github.com/439436269-ctrl/dsh-search/tree/24bc2e4b985559fe05497530b5c4484bc9168d71)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

给 research 增加 maxCost 和逐 URL 去重/停止条件，可把“自动多页”变成可证明不超预算的检索单元。 详见[Q08](#research-q08)。

下一步只做本项可证伪实验：固定 100 个带期望来源的查询，记录 search/fetch 请求数、成功数、账单元、召回@10、正文可读率和 P95。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 157 | — | — | 1549 |
| .js | source | 13 | 1001 | 622 | 312 | — |
| .js | test | 2 | 307 | 232 | 46 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/439436269-ctrl/dsh-search/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：按次计费的 Search/Fetch 工具能否以可控请求预算换来比通用搜索更稳定的结构化证据？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 场景：适合需要搜索语法、结果条数、正文和多页汇总可控的研究任务？

**研究主题**：场景与需求

#### 完整回答

适合需要搜索语法、结果条数、正文和多页汇总可控的研究任务；已有 web_search/fetch 且需求简单时不必增加供应商。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/439436269-ctrl/dsh-search/blob/24bc2e4b985559fe05497530b5c4484bc9168d71/README.md#L1-L5)

固定提交复核：场景相关声明与实现入口。

```text
# @vfvrpq/dsh-search

DeepSeek 官方 Search / Fetch 接口的 DeepSeek Harness 插件：三个工具、一个配置项、零运行时依赖。

给 agent 的是**结构化**网页结果——rerank 分、权威度、发布时间、模型友好长摘要——而不是一坨 HTML。
```

#### 缺口

- 服务端计费失败规则、当前索引覆盖和真实正文成功率未核
  **影响**：场景结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：固定 100 个带期望来源的查询，记录 search/fetch 请求数、成功数、账单元、召回@10、正文可读率和 P95

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 机制：三个工具分别检索、抓正文和执行 1+N 次研究链，带鉴权、超时、重试、QPS 限制和结构化结果。？

**研究主题**：功能与机制

#### 完整回答

三个工具分别检索、抓正文和执行 1+N 次研究链，带鉴权、超时、重试、QPS 限制和结构化结果。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tools.js:1-10](https://github.com/439436269-ctrl/dsh-search/blob/24bc2e4b985559fe05497530b5c4484bc9168d71/lib/tools.js#L1-L10)

固定提交复核：机制相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Tool registry: one tool per file, in the order the model should see them.
 *
 * @module dsh-search/tools
 */

import { clampInt, guarded, requireText } from "./tools/shared.js";
import { createSearchTool } from "./tools/search.js";
import { createFetchTool } from "./tools/fetch.js";
import { createResearchTool } from "./tools/research.js";
```

</details>

#### 缺口

- 服务端计费失败规则、当前索引覆盖和真实正文成功率未核
  **影响**：机制结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：固定 100 个带期望来源的查询，记录 search/fetch 请求数、成功数、账单元、召回@10、正文可读率和 P95

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 贡献：搜索与正文抓取在同一 API 方言下串成可预算研究，优势是字段一致与权威度/日期等元数据。？

**研究主题**：贡献与相对优势

#### 完整回答

搜索与正文抓取在同一 API 方言下串成可预算研究，优势是字段一致与权威度/日期等元数据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/439436269-ctrl/dsh-search/blob/24bc2e4b985559fe05497530b5c4484bc9168d71/README.md#L1-L5)

固定提交复核：贡献相关声明与实现入口。

```text
# @vfvrpq/dsh-search

DeepSeek 官方 Search / Fetch 接口的 DeepSeek Harness 插件：三个工具、一个配置项、零运行时依赖。

给 agent 的是**结构化**网页结果——rerank 分、权威度、发布时间、模型友好长摘要——而不是一坨 HTML。
```

#### 缺口

- 服务端计费失败规则、当前索引覆盖和真实正文成功率未核
  **影响**：贡献结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：固定 100 个带期望来源的查询，记录 search/fetch 请求数、成功数、账单元、召回@10、正文可读率和 P95

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 局限：无法替代登录、点击和强 SPA 浏览器？

**研究主题**：缺陷与关键质疑

#### 完整回答

无法替代登录、点击和强 SPA 浏览器；转义标点、HTML 壳与正文缺失会影响结果，摘要也不是独立事实验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tools.js:1-10](https://github.com/439436269-ctrl/dsh-search/blob/24bc2e4b985559fe05497530b5c4484bc9168d71/lib/tools.js#L1-L10)

固定提交复核：局限相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Tool registry: one tool per file, in the order the model should see them.
 *
 * @module dsh-search/tools
 */

import { clampInt, guarded, requireText } from "./tools/shared.js";
import { createSearchTool } from "./tools/search.js";
import { createFetchTool } from "./tools/fetch.js";
import { createResearchTool } from "./tools/research.js";
```

</details>

#### 缺口

- 服务端计费失败规则、当前索引覆盖和真实正文成功率未核
  **影响**：局限结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：固定 100 个带期望来源的查询，记录 search/fetch 请求数、成功数、账单元、召回@10、正文可读率和 P95

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 依赖：需要 DeepSeek Search API key、网络和服务配额？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要 DeepSeek Search API key、网络和服务配额；search/fetch 各 5 QPS，research 的 N 决定调用放大。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/439436269-ctrl/dsh-search/blob/24bc2e4b985559fe05497530b5c4484bc9168d71/README.md#L1-L5)

固定提交复核：依赖相关声明与实现入口。

```text
# @vfvrpq/dsh-search

DeepSeek 官方 Search / Fetch 接口的 DeepSeek Harness 插件：三个工具、一个配置项、零运行时依赖。

给 agent 的是**结构化**网页结果——rerank 分、权威度、发布时间、模型友好长摘要——而不是一坨 HTML。
```

#### 缺口

- 服务端计费失败规则、当前索引覆盖和真实正文成功率未核
  **影响**：依赖结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：固定 100 个带期望来源的查询，记录 search/fetch 请求数、成功数、账单元、召回@10、正文可读率和 P95

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本与效果：作者口径成功请求每千次 5 元，即约 0.005 元/次？

**研究主题**：效果与总成本

#### 完整回答

作者口径成功请求每千次 5 元，即约 0.005 元/次；research 至少 1+N 次，失败/重试是否计费要向服务账单核对。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/439436269-ctrl/dsh-search/blob/24bc2e4b985559fe05497530b5c4484bc9168d71/README.md#L1-L5)

固定提交复核：成本与效果相关声明与实现入口。

```text
# @vfvrpq/dsh-search

DeepSeek 官方 Search / Fetch 接口的 DeepSeek Harness 插件：三个工具、一个配置项、零运行时依赖。

给 agent 的是**结构化**网页结果——rerank 分、权威度、发布时间、模型友好长摘要——而不是一坨 HTML。
```

#### 缺口

- 服务端计费失败规则、当前索引覆盖和真实正文成功率未核
  **影响**：成本与效果结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：固定 100 个带期望来源的查询，记录 search/fetch 请求数、成功数、账单元、召回@10、正文可读率和 P95

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 工程：密钥分层、超时重试与显式 count 让预算可控？

**研究主题**：工程质量与复用

#### 完整回答

密钥分层、超时重试与显式 count 让预算可控；应输出 request id、实际调用数与计费成功数以便对账。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tools.js:1-10](https://github.com/439436269-ctrl/dsh-search/blob/24bc2e4b985559fe05497530b5c4484bc9168d71/lib/tools.js#L1-L10)

固定提交复核：工程相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Tool registry: one tool per file, in the order the model should see them.
 *
 * @module dsh-search/tools
 */

import { clampInt, guarded, requireText } from "./tools/shared.js";
import { createSearchTool } from "./tools/search.js";
import { createFetchTool } from "./tools/fetch.js";
import { createResearchTool } from "./tools/research.js";
```

</details>

#### 缺口

- 服务端计费失败规则、当前索引覆盖和真实正文成功率未核
  **影响**：工程结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：固定 100 个带期望来源的查询，记录 search/fetch 请求数、成功数、账单元、召回@10、正文可读率和 P95

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 假设：给 research 增加 maxCost 和逐 URL 去重/停止条件，可把“自动多页”变成可证明不超预算的检索单元。？

**研究主题**：新假设与验证

#### 完整回答

给 research 增加 maxCost 和逐 URL 去重/停止条件，可把“自动多页”变成可证明不超预算的检索单元。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/439436269-ctrl/dsh-search/blob/24bc2e4b985559fe05497530b5c4484bc9168d71/README.md#L1-L5)

固定提交复核：假设相关声明与实现入口。

```text
# @vfvrpq/dsh-search

DeepSeek 官方 Search / Fetch 接口的 DeepSeek Harness 插件：三个工具、一个配置项、零运行时依赖。

给 agent 的是**结构化**网页结果——rerank 分、权威度、发布时间、模型友好长摘要——而不是一坨 HTML。
```

#### 缺口

- 服务端计费失败规则、当前索引覆盖和真实正文成功率未核
  **影响**：假设结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：固定 100 个带期望来源的查询，记录 search/fetch 请求数、成功数、账单元、召回@10、正文可读率和 P95

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 采用：可用公开、非敏感查询小范围试用？

**研究主题**：采用判断

#### 完整回答

可用公开、非敏感查询小范围试用；先设 count/N 上限并以 100 个查询对照内置搜索的召回、正文成功率与实际账单。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/439436269-ctrl/dsh-search/blob/24bc2e4b985559fe05497530b5c4484bc9168d71/README.md#L1-L5)

固定提交复核：采用相关声明与实现入口。

```text
# @vfvrpq/dsh-search

DeepSeek 官方 Search / Fetch 接口的 DeepSeek Harness 插件：三个工具、一个配置项、零运行时依赖。

给 agent 的是**结构化**网页结果——rerank 分、权威度、发布时间、模型友好长摘要——而不是一坨 HTML。
```

#### 缺口

- 服务端计费失败规则、当前索引覆盖和真实正文成功率未核
  **影响**：采用结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：固定 100 个带期望来源的查询，记录 search/fetch 请求数、成功数、账单元、召回@10、正文可读率和 P95

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
