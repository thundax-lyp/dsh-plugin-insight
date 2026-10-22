# dsh-vision-web

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[f8b2619](https://github.com/54xkeee/dsh-vision/tree/f8b26198aff85bc72c3bb12a2e843ebec68c04d1)

<!-- BEGIN META -->
[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/54xkeee/dsh-vision) [![npm 30d 1,391](https://img.shields.io/static/v1?label=npm+30d&message=1%2C391&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-vision-web) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-vision-web)
<!-- END META -->

> **实现功能**：以豆包网页桥接、多类 API/CLI 通道为纯文本模型提供结构化视觉证据。

> **核心亮点**：多通道降级、证据记忆和任务模式组合完整，尤其豆包网页队列把已登录浏览器额度接入 Host。 详见[Q03](#research-q03)。

> **风险与缺陷**：默认零 API key 不等于零成本或低风险：需 Windows bridge、调试 Chrome 和豆包登录，网页 DOM 自动化及第三方留存都可能变化。 详见[Q04](#research-q04)。

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
  - [Q01 · 场景：适合纯文本 DeepSeek 需要 OCR、区域、比较和跨轮视觉证据？](#detail-section-11)
  - [Q02 · 机制：vision 工具在 web/Antigravity/Gemini/Cockpit/CLI 通道中选择，标准检查可升级 deep，结构化证据写入会话并以哈希缓存复用。？](#detail-section-12)
  - [Q03 · 贡献：多通道降级、证据记忆和任务模式组合完整，尤其豆包网页队列把已登录浏览器额度接入 Host。？](#detail-section-13)
  - [Q04 · 局限：默认零 API key 不等于零成本或低风险：需 Windows bridge、调试 Chrome 和豆包登录，网页 DOM 自动化及第三方留存都可能变化。？](#detail-section-14)
  - [Q05 · 依赖：Node=20、DSH 视觉包装接口？](#detail-section-15)
  - [Q06 · 成本与效果：网页通道无显式 API 单价但占浏览器、轮询和账号？](#detail-section-16)
  - [Q07 · 工程：内容哈希、结构化不确定性、允许图片目录和证据恢复值得借鉴？](#detail-section-17)
  - [Q08 · 假设：按敏感等级和任务类型做显式通道路由，并把每次升级/缓存/供应商写入证据，可验证“自动降级”是否真的省钱且不串数据。？](#detail-section-18)
  - [Q09 · 采用：保持观察？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合纯文本 DeepSeek 需要 OCR、区域、比较和跨轮视觉证据；可直接使用原生视觉模型时链路明显更短。 详见[Q01](#research-q01)。

适合纯文本 DeepSeek 需要 OCR、区域、比较和跨轮视觉证据；可直接使用原生视觉模型时链路明显更短。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

#### 能力明细

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 模型工具 | vision 工具执行 OCR、区域、比较与分档识图 | 网页 DOM 稳定、账号政策、多通道数据去向和 evidence 恢复准确性未在本轮运行 |
| Host 路由 | 视觉 API、网页队列与包装模型路由 | 网页 DOM 稳定、账号政策、多通道数据去向和 evidence 恢复准确性未在本轮运行 |
| 界面 | 会话头部识图面板 | 网页 DOM 稳定、账号政策、多通道数据去向和 evidence 恢复准确性未在本轮运行 |
| 事件监听 | 持久化并恢复 session 视觉证据 | 网页 DOM 稳定、账号政策、多通道数据去向和 evidence 恢复准确性未在本轮运行 |
| 后台 | Windows 桥接轮询已登录 Chrome | 网页 DOM 稳定、账号政策、多通道数据去向和 evidence 恢复准确性未在本轮运行 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| Windows bridge + Chrome CDP | 默认 web | 驱动已登录豆包 | 队列超时 |
| 视觉 API/IDE 凭据 | 替代通道 | Gemini/Antigravity等 | 按通道失败 |
| 会话/输出目录 | 必需 | 证据记忆与图片路径 | 恢复或读取失败 |

#### 启动步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 隔离账号 | 专用 Chrome profile 登录 | 不复用主浏览器 |
| 启动桥接 | bridge 轮询 9340 队列 | 先核健康/超时 |
| 识图 | 选模式/档位/通道 | 记录供应商与升级 |
| 恢复 | 重启后追问同图 | 核证据而非重新外发 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| web 通道 | 无显式 API 费；浏览器/账号 | 维护 bridge/CDP | 网页变更成本高 |
| API/IDE | 各自额度或订阅 | 管理多套凭据 | 单图费未统一 |
| auto deep | 复杂图可能两次识别 | 检查升级原因 | 调用放大率待测 |

#### 效果

| 效果项 | 源码支持 | 验证指标 |
| --- | --- | --- |
| 结构化视觉证据 | OCR/布局/不确定性 | 字段 F1 |
| 跨轮记忆 | 同图证据复用 | 重调率/一致率 |
| 原生视觉对照 | 本方案通道多、部署重 | 每题成本与正确率 |

> **思考**：默认零 API key 不等于零成本或低风险：需 Windows bridge、调试 Chrome 和豆包登录，网页 DOM 自动化及第三方留存都可能变化。 详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：多通道降级、证据记忆和任务模式组合完整，尤其豆包网页队列把已登录浏览器额度接入 Host。 详见[Q03](#research-q03)。

多通道降级、证据记忆和任务模式组合完整，尤其豆包网页队列把已登录浏览器额度接入 Host。 详见[Q03](#research-q03)。

内容哈希、结构化不确定性、允许图片目录和证据恢复值得借鉴；通道众多也扩大配置、凭据与故障矩阵。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认零 API key 不等于零成本或低风险：需 Windows bridge、调试 Chrome 和豆包登录，网页 DOM 自动化及第三方留存都可能变化。 详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

保持观察；不要以主 Chrome profile 或敏感截图试用，先用专用账号/临时 profile 固定一个通道，验证后再增加降级链。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可确认 vision 工具、结构化证据、会话恢复及 web/API/IDE 多通道框架；未启动 Windows bridge、Chrome CDP 或任何视觉上游，所谓零 API 费用不代表账号、隐私和维护成本已验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/vision-core.ts、src/web-channels.ts、src/client/plugin.tsx 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 README.md、src/index.ts、src/vision-core.ts、src/web-channels.ts、src/client/plugin.tsx 与 prepared inventory；未安装、未运行、未访问真实账号/设备/服务。网页 DOM 稳定、账号政策、多通道数据去向和 evidence 恢复准确性未在本轮运行。
- 下一步：下一步只做本项可证伪实验：用专用 profile 对 40 张 OCR/表格/多图样本跑单一 web 通道，记录升级率、缓存命中、P95、账号异常和证据恢复一致率。

**分析版本**

- **仓库**：[54xkeee/dsh-vision](https://github.com/54xkeee/dsh-vision)
- **版本号**：0.1.0（[固定提交 f8b2619](https://github.com/54xkeee/dsh-vision/tree/f8b26198aff85bc72c3bb12a2e843ebec68c04d1)）
- **版本日期**：2026-08-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

按敏感等级和任务类型做显式通道路由，并把每次升级/缓存/供应商写入证据，可验证“自动降级”是否真的省钱且不串数据。 详见[Q08](#research-q08)。

下一步只做本项可证伪实验：用专用 profile 对 40 张 OCR/表格/多图样本跑单一 web 通道，记录升级率、缓存命中、P95、账号异常和证据恢复一致率。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 2 | 221 | 192 | 18 | — |
| .md | source | 2 | 514 | — | — | 3946 |
| .ts | source | 5 | 1728 | 1517 | 131 | — |
| .tsx | source | 1 | 358 | 343 | 2 | — |
| .mjs | test | 1 | 215 | 195 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/54xkeee/dsh-vision/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/54xkeee/dsh-vision/issues?q=is%3Aissue+created%3A2026-09-22T16%3A03%3A11.920Z..2026-10-22T16%3A03%3A11.920Z)

暂未获取：近30天关闭。

统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多通道视觉桥接与证据记忆是否能在隐私、稳定性和复杂部署下优于直接视觉模型？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 场景：适合纯文本 DeepSeek 需要 OCR、区域、比较和跨轮视觉证据？

**研究主题**：场景与需求

#### 完整回答

适合纯文本 DeepSeek 需要 OCR、区域、比较和跨轮视觉证据；可直接使用原生视觉模型时链路明显更短。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/54xkeee/dsh-vision/blob/f8b26198aff85bc72c3bb12a2e843ebec68c04d1/README.md#L1-L5)

固定提交复核：场景相关声明与实现入口。

```text
# 👁️ dsh-vision

**给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的纯文本 DeepSeek 一双眼睛——默认走豆包 Web，零成本、免 API key。**

[English](README.en.md) | [简体中文](README.md)
```

#### 缺口

- 网页 DOM 稳定、账号政策、多通道数据去向和 evidence 恢复准确性未在本轮运行
  **影响**：场景结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用专用 profile 对 40 张 OCR/表格/多图样本跑单一 web 通道，记录升级率、缓存命中、P95、账号异常和证据恢复一致率

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 机制：vision 工具在 web/Antigravity/Gemini/Cockpit/CLI 通道中选择，标准检查可升级 deep，结构化证据写入会话并以哈希缓存复用。？

**研究主题**：功能与机制

#### 完整回答

vision 工具在 web/Antigravity/Gemini/Cockpit/CLI 通道中选择，标准检查可升级 deep，结构化证据写入会话并以哈希缓存复用。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1-10](https://github.com/54xkeee/dsh-vision/blob/f8b26198aff85bc72c3bb12a2e843ebec68c04d1/src/index.ts#L1-L10)

固定提交复核：机制相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
import { execFile } from "node:child_process";
import { readFileSync, existsSync, writeFileSync, unlinkSync, mkdirSync, statSync, openSync, readSync, closeSync, realpathSync } from "node:fs";
import { join, dirname, resolve, sep } from "node:path";
import { homedir } from "node:os";
import z from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { createUserMessage } from "@deepseek-ai/dsh-llm";
import {
	VISION_MODEL,
	VISION_PROMPT_VERSION,
```

</details>

#### 缺口

- 网页 DOM 稳定、账号政策、多通道数据去向和 evidence 恢复准确性未在本轮运行
  **影响**：机制结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用专用 profile 对 40 张 OCR/表格/多图样本跑单一 web 通道，记录升级率、缓存命中、P95、账号异常和证据恢复一致率

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 贡献：多通道降级、证据记忆和任务模式组合完整，尤其豆包网页队列把已登录浏览器额度接入 Host。？

**研究主题**：贡献与相对优势

#### 完整回答

多通道降级、证据记忆和任务模式组合完整，尤其豆包网页队列把已登录浏览器额度接入 Host。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/54xkeee/dsh-vision/blob/f8b26198aff85bc72c3bb12a2e843ebec68c04d1/README.md#L1-L5)

固定提交复核：贡献相关声明与实现入口。

```text
# 👁️ dsh-vision

**给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的纯文本 DeepSeek 一双眼睛——默认走豆包 Web，零成本、免 API key。**

[English](README.en.md) | [简体中文](README.md)
```

#### 缺口

- 网页 DOM 稳定、账号政策、多通道数据去向和 evidence 恢复准确性未在本轮运行
  **影响**：贡献结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用专用 profile 对 40 张 OCR/表格/多图样本跑单一 web 通道，记录升级率、缓存命中、P95、账号异常和证据恢复一致率

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 局限：默认零 API key 不等于零成本或低风险：需 Windows bridge、调试 Chrome 和豆包登录，网页 DOM 自动化及第三方留存都可能变化。？

**研究主题**：缺陷与关键质疑

#### 完整回答

默认零 API key 不等于零成本或低风险：需 Windows bridge、调试 Chrome 和豆包登录，网页 DOM 自动化及第三方留存都可能变化。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1-10](https://github.com/54xkeee/dsh-vision/blob/f8b26198aff85bc72c3bb12a2e843ebec68c04d1/src/index.ts#L1-L10)

固定提交复核：局限相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
import { execFile } from "node:child_process";
import { readFileSync, existsSync, writeFileSync, unlinkSync, mkdirSync, statSync, openSync, readSync, closeSync, realpathSync } from "node:fs";
import { join, dirname, resolve, sep } from "node:path";
import { homedir } from "node:os";
import z from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { createUserMessage } from "@deepseek-ai/dsh-llm";
import {
	VISION_MODEL,
	VISION_PROMPT_VERSION,
```

</details>

#### 缺口

- 网页 DOM 稳定、账号政策、多通道数据去向和 evidence 恢复准确性未在本轮运行
  **影响**：局限结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用专用 profile 对 40 张 OCR/表格/多图样本跑单一 web 通道，记录升级率、缓存命中、P95、账号异常和证据恢复一致率

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 依赖：Node>=20、DSH 视觉包装接口？

**研究主题**：依赖、兼容与流程

#### 完整回答

Node>=20、DSH 视觉包装接口；默认还需 bridge.mjs、puppeteer-core、Chrome CDP/豆包会话，其他通道各有 IDE/API 凭据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/54xkeee/dsh-vision/blob/f8b26198aff85bc72c3bb12a2e843ebec68c04d1/README.md#L1-L5)

固定提交复核：依赖相关声明与实现入口。

```text
# 👁️ dsh-vision

**给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的纯文本 DeepSeek 一双眼睛——默认走豆包 Web，零成本、免 API key。**

[English](README.en.md) | [简体中文](README.md)
```

#### 缺口

- 网页 DOM 稳定、账号政策、多通道数据去向和 evidence 恢复准确性未在本轮运行
  **影响**：依赖结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用专用 profile 对 40 张 OCR/表格/多图样本跑单一 web 通道，记录升级率、缓存命中、P95、账号异常和证据恢复一致率

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本与效果：网页通道无显式 API 单价但占浏览器、轮询和账号？

**研究主题**：效果与总成本

#### 完整回答

网页通道无显式 API 单价但占浏览器、轮询和账号；API/IDE 通道按各自额度，auto 深度升级最多多一轮识别。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/54xkeee/dsh-vision/blob/f8b26198aff85bc72c3bb12a2e843ebec68c04d1/README.md#L1-L5)

固定提交复核：成本与效果相关声明与实现入口。

```text
# 👁️ dsh-vision

**给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的纯文本 DeepSeek 一双眼睛——默认走豆包 Web，零成本、免 API key。**

[English](README.en.md) | [简体中文](README.md)
```

#### 缺口

- 网页 DOM 稳定、账号政策、多通道数据去向和 evidence 恢复准确性未在本轮运行
  **影响**：成本与效果结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用专用 profile 对 40 张 OCR/表格/多图样本跑单一 web 通道，记录升级率、缓存命中、P95、账号异常和证据恢复一致率

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 工程：内容哈希、结构化不确定性、允许图片目录和证据恢复值得借鉴？

**研究主题**：工程质量与复用

#### 完整回答

内容哈希、结构化不确定性、允许图片目录和证据恢复值得借鉴；通道众多也扩大配置、凭据与故障矩阵。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1-10](https://github.com/54xkeee/dsh-vision/blob/f8b26198aff85bc72c3bb12a2e843ebec68c04d1/src/index.ts#L1-L10)

固定提交复核：工程相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
import { execFile } from "node:child_process";
import { readFileSync, existsSync, writeFileSync, unlinkSync, mkdirSync, statSync, openSync, readSync, closeSync, realpathSync } from "node:fs";
import { join, dirname, resolve, sep } from "node:path";
import { homedir } from "node:os";
import z from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { createUserMessage } from "@deepseek-ai/dsh-llm";
import {
	VISION_MODEL,
	VISION_PROMPT_VERSION,
```

</details>

#### 缺口

- 网页 DOM 稳定、账号政策、多通道数据去向和 evidence 恢复准确性未在本轮运行
  **影响**：工程结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用专用 profile 对 40 张 OCR/表格/多图样本跑单一 web 通道，记录升级率、缓存命中、P95、账号异常和证据恢复一致率

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 假设：按敏感等级和任务类型做显式通道路由，并把每次升级/缓存/供应商写入证据，可验证“自动降级”是否真的省钱且不串数据。？

**研究主题**：新假设与验证

#### 完整回答

按敏感等级和任务类型做显式通道路由，并把每次升级/缓存/供应商写入证据，可验证“自动降级”是否真的省钱且不串数据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/54xkeee/dsh-vision/blob/f8b26198aff85bc72c3bb12a2e843ebec68c04d1/README.md#L1-L5)

固定提交复核：假设相关声明与实现入口。

```text
# 👁️ dsh-vision

**给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的纯文本 DeepSeek 一双眼睛——默认走豆包 Web，零成本、免 API key。**

[English](README.en.md) | [简体中文](README.md)
```

#### 缺口

- 网页 DOM 稳定、账号政策、多通道数据去向和 evidence 恢复准确性未在本轮运行
  **影响**：假设结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用专用 profile 对 40 张 OCR/表格/多图样本跑单一 web 通道，记录升级率、缓存命中、P95、账号异常和证据恢复一致率

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 采用：保持观察？

**研究主题**：采用判断

#### 完整回答

保持观察；不要以主 Chrome profile 或敏感截图试用，先用专用账号/临时 profile 固定一个通道，验证后再增加降级链。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/54xkeee/dsh-vision/blob/f8b26198aff85bc72c3bb12a2e843ebec68c04d1/README.md#L1-L5)

固定提交复核：采用相关声明与实现入口。

```text
# 👁️ dsh-vision

**给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的纯文本 DeepSeek 一双眼睛——默认走豆包 Web，零成本、免 API key。**

[English](README.en.md) | [简体中文](README.md)
```

#### 缺口

- 网页 DOM 稳定、账号政策、多通道数据去向和 evidence 恢复准确性未在本轮运行
  **影响**：采用结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用专用 profile 对 40 张 OCR/表格/多图样本跑单一 web 通道，记录升级率、缓存命中、P95、账号异常和证据恢复一致率

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
