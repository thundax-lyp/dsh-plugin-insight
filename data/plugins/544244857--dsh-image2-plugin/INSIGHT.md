# dsh-image2-plugin

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[fc44d3f](https://github.com/544244857/dsh-image2-plugin/tree/fc44d3feb4be5b7b4d0e0c20bd2b4d09c925dc1e)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/544244857/dsh-image2-plugin) [![npm 30d 582](https://img.shields.io/static/v1?label=npm+30d&message=582&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-image2-tool) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-image2-tool)
<!-- END META -->

> **功能**：通过 OpenAI 兼容中继生成或编辑图片，并把结果保存到会话。

> **亮点**：工具、文件落盘和内联预览接通了会话交付；竞争力取决于中继模型/价格，而非协议兼容本身。 详见[Q03](#research-q03)。

> **主要限制**：下载 URL 不带 API key 是好边界，但 read_image 检查与重试预算主要靠提示文字，非强制运行时策略；中继隐私与内容政策未知。 详见[Q04](#research-q04)。

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
  - [Q01 · 场景：适合从对话生成草图或编辑非敏感图片并直接预览？](#detail-section-11)
  - [Q02 · 机制：image2_generate 调 OpenAI 兼容中继，接受文字及图片 URL/base64，校验魔数和 20MB 上限，把输出写到 session/outputDir 并交客户端展示。？](#detail-section-12)
  - [Q03 · 贡献：工具、文件落盘和内联预览接通了会话交付？](#detail-section-13)
  - [Q04 · 局限：下载 URL 不带 API key 是好边界，但 read_image 检查与重试预算主要靠提示文字，非强制运行时策略？](#detail-section-14)
  - [Q05 · 依赖：需要 OpenAI 兼容 base URL/key/模型、外网和可写输出目录？](#detail-section-15)
  - [Q06 · 成本与效果：每次生成/编辑费用由中继决定，base64 与 20MB 输入增加内存和带宽？](#detail-section-16)
  - [Q07 · 工程：魔数、大小、落盘范围和错误处理可见？](#detail-section-17)
  - [Q08 · 假设：增加 per-request 预算、下载 allowlist 和结果 manifest（prompt、模型、费用、哈希），可把生成图从临时附件升级为可追溯产物。？](#detail-section-18)
  - [Q09 · 采用：可用公开图片和硬性单次预算试用？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合从对话生成草图或编辑非敏感图片并直接预览；已有图像应用时可用其原生历史、费用和内容控制。 详见[Q01](#research-q01)。

适合从对话生成草图或编辑非敏感图片并直接预览；已有图像应用时可用其原生历史、费用和内容控制。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

#### 能力明细

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 模型工具 | image2_generate 文生图与图生图 | 中继计费/留存政策、真实模型质量和旧版 inline viewer 兼容未核 |
| 界面 | 在会话内预览生成结果 | 中继计费/留存政策、真实模型质量和旧版 inline viewer 兼容未核 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| 兼容中继/key | 必需 | 生成/编辑 API | 认证或网络失败 |
| 模型与配额 | 必需 | 图像输出 | 限额/内容拒绝 |
| session/outputDir + viewer | 必需 | 持久化与预览 | 仅返回错误/路径 |

#### 启动步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 设预算 | 固定模型与单次上限 | 记录供应商政策 |
| 调用 | image2_generate 提交公开素材 | 核输入≤20MB |
| 验收 | 看预览并记文件哈希 | 不满意不盲目重试 |
| 清理 | 删除会话输出/撤销 key | 核无残留 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 单次生成 | 中继按模型计费 | 控制 prompt/尺寸 | 价格未核 |
| 输入传输 | base64/URL 最多 20MB | 筛选公开素材 | 内存峰值未知 |
| 失败重试 | 可能再次计费 | 核 request id | 提示预算非硬约束 |

#### 效果

| 效果项 | 源码支持 | 验证指标 |
| --- | --- | --- |
| 会话内创作 | 工具到预览闭环 | 合格图/总调用 |
| 图片编辑 | 复用输入图片 | 目标修改成功率 |
| 原生图像应用对照 | 协议统一但治理较少 | 每张合格图成本 |

> **思考**：下载 URL 不带 API key 是好边界，但 read_image 检查与重试预算主要靠提示文字，非强制运行时策略；中继隐私与内容政策未知。 详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：工具、文件落盘和内联预览接通了会话交付；竞争力取决于中继模型/价格，而非协议兼容本身。 详见[Q03](#research-q03)。

魔数、大小、落盘范围和错误处理可见；应把最大重试、允许域名和 request/cost id 变成代码级约束。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

下载 URL 不带 API key 是好边界，但 read_image 检查与重试预算主要靠提示文字，非强制运行时策略；中继隐私与内容政策未知。 详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可用公开图片和硬性单次预算试用；不要上传客户素材，先验证失败重试只计一次、文件落在会话目录且能完整删除。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 image2_generate、中继请求、20MB/魔数检查、会话落盘与预览接线；本轮没有上传素材、调用模型或产生费用，生成质量、重试计费和供应商留存政策均未获验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 README.md、index.js、lib/client.js 与 prepared inventory；未安装、未运行、未访问真实账号/设备/服务。中继计费/留存政策、真实模型质量和旧版 inline viewer 兼容未核。
- 下一步：下一步只做本项可证伪实验：用 10 个公开 prompt 加 5 个编辑样本，记录 request id、费用、重试次数、文件哈希、P95 与会话清理结果。

**分析版本**

- **仓库**：[544244857/dsh-image2-plugin](https://github.com/544244857/dsh-image2-plugin)
- **版本号**：0.4.1（[固定提交 fc44d3f](https://github.com/544244857/dsh-image2-plugin/tree/fc44d3feb4be5b7b4d0e0c20bd2b4d09c925dc1e)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

增加 per-request 预算、下载 allowlist 和结果 manifest（prompt、模型、费用、哈希），可把生成图从临时附件升级为可追溯产物。 详见[Q08](#research-q08)。

下一步只做本项可证伪实验：用 10 个公开 prompt 加 5 个编辑样本，记录 request id、费用、重试次数、文件哈希、P95 与会话清理结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 466 | — | — | 4770 |
| .js | source | 2 | 743 | 644 | 54 | — |
| .js | test | 1 | 206 | 198 | 8 | — |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/544244857/dsh-image2-plugin/issues?q=is%3Aissue+created%3A2026-09-22T16%3A03%3A09.398Z..2026-10-22T16%3A03%3A09.398Z)

暂未获取：Issue 未关闭、近30天关闭。

统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：兼容中继图像生成能否在费用、输入校验和结果可追溯性上形成安全的创作闭环？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 场景：适合从对话生成草图或编辑非敏感图片并直接预览？

**研究主题**：场景与需求

#### 完整回答

适合从对话生成草图或编辑非敏感图片并直接预览；已有图像应用时可用其原生历史、费用和内容控制。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/544244857/dsh-image2-plugin/blob/fc44d3feb4be5b7b4d0e0c20bd2b4d09c925dc1e/README.md#L1-L5)

固定提交复核：场景相关声明与实现入口。

```text
# dsh-image2-tool

![Version](https://img.shields.io/github/v/release/544244857/dsh-image2-plugin?display_name=tag&sort=semver&label=release)
![npm](https://img.shields.io/npm/v/dsh-image2-tool?label=npm)
![Downloads](https://img.shields.io/npm/dm/dsh-image2-tool?label=downloads)
```

#### 缺口

- 中继计费/留存政策、真实模型质量和旧版 inline viewer 兼容未核
  **影响**：场景结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用 10 个公开 prompt 加 5 个编辑样本，记录 request id、费用、重试次数、文件哈希、P95 与会话清理结果

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 机制：image2_generate 调 OpenAI 兼容中继，接受文字及图片 URL/base64，校验魔数和 20MB 上限，把输出写到 session/outputDir 并交客户端展示。？

**研究主题**：功能与机制

#### 完整回答

image2_generate 调 OpenAI 兼容中继，接受文字及图片 URL/base64，校验魔数和 20MB 上限，把输出写到 session/outputDir 并交客户端展示。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-10](https://github.com/544244857/dsh-image2-plugin/blob/fc44d3feb4be5b7b4d0e0c20bd2b4d09c925dc1e/index.js#L1-L10)

固定提交复核：机制相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
import { mkdir, open, readFile, realpath, stat, unlink } from 'node:fs/promises'
import path from 'node:path'
import { defineTool } from '@deepseek-ai/dsh-tools'
import Schema from '@deepseek-ai/schemastery'

export const name = 'dsh-image2-tool'
export const inject = ['tools']

// Every field is marked `.volatile()` so the official settings service publishes it
// as an editable form: the Plugins page row config (client half in lib/client.js)
```

</details>

#### 缺口

- 中继计费/留存政策、真实模型质量和旧版 inline viewer 兼容未核
  **影响**：机制结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用 10 个公开 prompt 加 5 个编辑样本，记录 request id、费用、重试次数、文件哈希、P95 与会话清理结果

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 贡献：工具、文件落盘和内联预览接通了会话交付？

**研究主题**：贡献与相对优势

#### 完整回答

工具、文件落盘和内联预览接通了会话交付；竞争力取决于中继模型/价格，而非协议兼容本身。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/544244857/dsh-image2-plugin/blob/fc44d3feb4be5b7b4d0e0c20bd2b4d09c925dc1e/README.md#L1-L5)

固定提交复核：贡献相关声明与实现入口。

```text
# dsh-image2-tool

![Version](https://img.shields.io/github/v/release/544244857/dsh-image2-plugin?display_name=tag&sort=semver&label=release)
![npm](https://img.shields.io/npm/v/dsh-image2-tool?label=npm)
![Downloads](https://img.shields.io/npm/dm/dsh-image2-tool?label=downloads)
```

#### 缺口

- 中继计费/留存政策、真实模型质量和旧版 inline viewer 兼容未核
  **影响**：贡献结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用 10 个公开 prompt 加 5 个编辑样本，记录 request id、费用、重试次数、文件哈希、P95 与会话清理结果

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 局限：下载 URL 不带 API key 是好边界，但 read_image 检查与重试预算主要靠提示文字，非强制运行时策略？

**研究主题**：缺陷与关键质疑

#### 完整回答

下载 URL 不带 API key 是好边界，但 read_image 检查与重试预算主要靠提示文字，非强制运行时策略；中继隐私与内容政策未知。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-10](https://github.com/544244857/dsh-image2-plugin/blob/fc44d3feb4be5b7b4d0e0c20bd2b4d09c925dc1e/index.js#L1-L10)

固定提交复核：局限相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
import { mkdir, open, readFile, realpath, stat, unlink } from 'node:fs/promises'
import path from 'node:path'
import { defineTool } from '@deepseek-ai/dsh-tools'
import Schema from '@deepseek-ai/schemastery'

export const name = 'dsh-image2-tool'
export const inject = ['tools']

// Every field is marked `.volatile()` so the official settings service publishes it
// as an editable form: the Plugins page row config (client half in lib/client.js)
```

</details>

#### 缺口

- 中继计费/留存政策、真实模型质量和旧版 inline viewer 兼容未核
  **影响**：局限结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用 10 个公开 prompt 加 5 个编辑样本，记录 request id、费用、重试次数、文件哈希、P95 与会话清理结果

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 依赖：需要 OpenAI 兼容 base URL/key/模型、外网和可写输出目录？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要 OpenAI 兼容 base URL/key/模型、外网和可写输出目录；内联展示依赖客户端版本与图片 viewer。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/544244857/dsh-image2-plugin/blob/fc44d3feb4be5b7b4d0e0c20bd2b4d09c925dc1e/README.md#L1-L5)

固定提交复核：依赖相关声明与实现入口。

```text
# dsh-image2-tool

![Version](https://img.shields.io/github/v/release/544244857/dsh-image2-plugin?display_name=tag&sort=semver&label=release)
![npm](https://img.shields.io/npm/v/dsh-image2-tool?label=npm)
![Downloads](https://img.shields.io/npm/dm/dsh-image2-tool?label=downloads)
```

#### 缺口

- 中继计费/留存政策、真实模型质量和旧版 inline viewer 兼容未核
  **影响**：依赖结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用 10 个公开 prompt 加 5 个编辑样本，记录 request id、费用、重试次数、文件哈希、P95 与会话清理结果

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本与效果：每次生成/编辑费用由中继决定，base64 与 20MB 输入增加内存和带宽？

**研究主题**：效果与总成本

#### 完整回答

每次生成/编辑费用由中继决定，base64 与 20MB 输入增加内存和带宽；失败重试是否重复计费和输出清理成本未核。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/544244857/dsh-image2-plugin/blob/fc44d3feb4be5b7b4d0e0c20bd2b4d09c925dc1e/README.md#L1-L5)

固定提交复核：成本与效果相关声明与实现入口。

```text
# dsh-image2-tool

![Version](https://img.shields.io/github/v/release/544244857/dsh-image2-plugin?display_name=tag&sort=semver&label=release)
![npm](https://img.shields.io/npm/v/dsh-image2-tool?label=npm)
![Downloads](https://img.shields.io/npm/dm/dsh-image2-tool?label=downloads)
```

#### 缺口

- 中继计费/留存政策、真实模型质量和旧版 inline viewer 兼容未核
  **影响**：成本与效果结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用 10 个公开 prompt 加 5 个编辑样本，记录 request id、费用、重试次数、文件哈希、P95 与会话清理结果

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 工程：魔数、大小、落盘范围和错误处理可见？

**研究主题**：工程质量与复用

#### 完整回答

魔数、大小、落盘范围和错误处理可见；应把最大重试、允许域名和 request/cost id 变成代码级约束。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-10](https://github.com/544244857/dsh-image2-plugin/blob/fc44d3feb4be5b7b4d0e0c20bd2b4d09c925dc1e/index.js#L1-L10)

固定提交复核：工程相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
import { mkdir, open, readFile, realpath, stat, unlink } from 'node:fs/promises'
import path from 'node:path'
import { defineTool } from '@deepseek-ai/dsh-tools'
import Schema from '@deepseek-ai/schemastery'

export const name = 'dsh-image2-tool'
export const inject = ['tools']

// Every field is marked `.volatile()` so the official settings service publishes it
// as an editable form: the Plugins page row config (client half in lib/client.js)
```

</details>

#### 缺口

- 中继计费/留存政策、真实模型质量和旧版 inline viewer 兼容未核
  **影响**：工程结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用 10 个公开 prompt 加 5 个编辑样本，记录 request id、费用、重试次数、文件哈希、P95 与会话清理结果

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 假设：增加 per-request 预算、下载 allowlist 和结果 manifest（prompt、模型、费用、哈希），可把生成图从临时附件升级为可追溯产物。？

**研究主题**：新假设与验证

#### 完整回答

增加 per-request 预算、下载 allowlist 和结果 manifest（prompt、模型、费用、哈希），可把生成图从临时附件升级为可追溯产物。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/544244857/dsh-image2-plugin/blob/fc44d3feb4be5b7b4d0e0c20bd2b4d09c925dc1e/README.md#L1-L5)

固定提交复核：假设相关声明与实现入口。

```text
# dsh-image2-tool

![Version](https://img.shields.io/github/v/release/544244857/dsh-image2-plugin?display_name=tag&sort=semver&label=release)
![npm](https://img.shields.io/npm/v/dsh-image2-tool?label=npm)
![Downloads](https://img.shields.io/npm/dm/dsh-image2-tool?label=downloads)
```

#### 缺口

- 中继计费/留存政策、真实模型质量和旧版 inline viewer 兼容未核
  **影响**：假设结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用 10 个公开 prompt 加 5 个编辑样本，记录 request id、费用、重试次数、文件哈希、P95 与会话清理结果

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 采用：可用公开图片和硬性单次预算试用？

**研究主题**：采用判断

#### 完整回答

可用公开图片和硬性单次预算试用；不要上传客户素材，先验证失败重试只计一次、文件落在会话目录且能完整删除。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/544244857/dsh-image2-plugin/blob/fc44d3feb4be5b7b4d0e0c20bd2b4d09c925dc1e/README.md#L1-L5)

固定提交复核：采用相关声明与实现入口。

```text
# dsh-image2-tool

![Version](https://img.shields.io/github/v/release/544244857/dsh-image2-plugin?display_name=tag&sort=semver&label=release)
![npm](https://img.shields.io/npm/v/dsh-image2-tool?label=npm)
![Downloads](https://img.shields.io/npm/dm/dsh-image2-tool?label=downloads)
```

#### 缺口

- 中继计费/留存政策、真实模型质量和旧版 inline viewer 兼容未核
  **影响**：采用结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用 10 个公开 prompt 加 5 个编辑样本，记录 request id、费用、重试次数、文件哈希、P95 与会话清理结果

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
