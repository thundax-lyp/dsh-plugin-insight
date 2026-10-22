# dsh-media-studio

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[4fb706a](https://github.com/1497105876/dsh-media-studio/tree/4fb706a3fb2b68cdbb81e951885d2178905d6ca2)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：在 DSH 中统一发起图像与视频生成任务，并通过作业、附件和界面展示结果。

> **核心亮点**：相对直接调用各家 API，它统一媒体任务、提供商、作业进度、附件交付和会话 UI，业务增量是把生成与交付放在同一对话链路。 [Q03](#research-q03)

> **风险与缺陷**：生成质量、费用、内容政策和可重复性主要由外部提供商决定；插件统一入口并不能证明不同提供商的结果可比，后台降级为 detached 时取消与追踪也更弱。 [Q04](#research-q04)

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

> **用途**：面向在对话中制作图片或视频的内容团队，把提供商配置、异步生成、媒体发送和预设收进 DSH 工作流。 [Q01](#research-q01)

基线是各提供商网页或脚本；插件减少切换和回传步骤，但仍需人工选择、内容审核和费用控制。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 图像生成 | 通过统一工具和命令提交图像任务。 | 仅由固定版本源码确认；运行效果未验证 |
| 视频生成 | 异步执行视频任务并报告进度。 | 仅由固定版本源码确认；运行效果未验证 |
| 媒体交付 | 将生成结果作为会话媒体或附件发送。 | 仅由固定版本源码确认；运行效果未验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| tools/jobs/commands/attachments/credentials | 必需 | 注册生成、后台任务、媒体交付和密钥 | 对应入口无法工作 |
| 至少一个外部 provider 与额度 | 必需 | 实际生成图像或视频 | 工具可注册但不能产出媒体 |
| 可写附件/媒体存储 | 必需 | 保存和发送大文件 | job 完成也无法交付 |
| 内容与费用验收规则 | 安全采用必需 | 控制版权、品牌和重试预算 | 可能反复生成或交付不合格内容 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|---|
| 定规格 | 用户给出尺寸、格式、内容、预算和停止条件 | provider/预设能满足约束 |
| 提交 | Agent 调 generate_image/video，job 记录 owner 与进度 | 获得可追踪 job id |
| 取消/失败 | 用户取消或 provider 返回错误 | AbortSignal 生效；部分文件可定位清理 |
| 验收交付 | 用户审查媒体并调用 send_media | 附件可访问且符合规格；不合格计入重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | provider 账户、密钥和本地存储 | 配预设、模型和交付规格 | 初始化分钟未知 |
| 持续使用 | 每次图/视频请求费、带宽、媒体 MB | 等待、筛选、提示修订和内容审核 | 单价与合格尝试数未采集 |
| 失败恢复 | 失败/取消请求可能仍计费 | 清理部分文件、重提 job | detached 降级的取消与追踪较弱 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话内交付 | 工具、job、附件与 UI 接线存在 | 真实 provider 到附件的完整成功率 |
| 异步控制 | jobs 路径使用 AbortController | provider 取消是否停止计费 |
| 统一提供商 | provider 与 preset 分层 | 不同模型的质量、政策和可比性 |

> **思考**：生成质量、费用、内容政策和可重复性主要由外部提供商决定；插件统一入口并不能证明不同提供商的结果可比，后台降级为 detached 时取消与追踪也更弱。 [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对直接调用各家 API，它统一媒体任务、提供商、作业进度、附件交付和会话 UI，业务增量是把生成与交付放在同一对话链路。 [Q03](#research-q03)

相对直接调用各家 API，它统一媒体任务、提供商、作业进度、附件交付和会话 UI，业务增量是把生成与交付放在同一对话链路。 [Q03](#research-q03)

provider、media、jobs 与 UI 分层便于扩展，AbortController 贯穿取消路径；需重点验证 detached 降级、凭据隔离、失败重试和大文件生命周期。

<a id="detail-section-5"></a>

### 1.4 主要限制

生成质量、费用、内容政策和可重复性主要由外部提供商决定；插件统一入口并不能证明不同提供商的结果可比，后台降级为 detached 时取消与追踪也更弱。 [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

适合已有受控媒体 API 账户、能定义尺寸/格式/内容验收并接受人工审核的团队先观察；涉及版权、品牌或高额视频生成时不应直接自动化。只有取消、凭据隔离、附件交付和费用上限在目标 provider 上通过，且每个合格媒体的重试数低于网页手工流程，才进入试用；费用失控或 detached job 无法追踪应停用。 [Q09](#research-q09)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为固定版本源码支持的实现与集成增量；效果和真实宿主可用性未验证。未来设计假设保持未验证，不计入插件现有能力。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定提交的作者材料、入口和关键实现；未运行插件、测试、外部服务或真实宿主，也未核验独立用户反馈。
- 下一步：在低额度账户按固定规格生成一张图和 5 秒视频，记录每次价格、秒数、文件 MB、失败/取消和人工评分；中途取消一次并模拟 jobs 不可用的 detached 降级，核对是否停止请求、是否残留文件及结果能否交付。无法限定费用或追踪 detached 任务即保持观察。

**分析版本**

- **仓库**：[1497105876/dsh-media-studio](https://github.com/1497105876/dsh-media-studio)
- **版本号**：0.6.0（[固定提交 4fb706a](https://github.com/1497105876/dsh-media-studio/tree/4fb706a3fb2b68cdbb81e951885d2178905d6ca2)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可增加“交付规格优先”的生成计划，先固定尺寸、格式、版权与验收项，再并行低成本草图和高质量定稿，减少无效重生成。 [Q08](#research-q08)

在低额度账户按固定规格生成一张图和 5 秒视频，记录每次价格、秒数、文件 MB、失败/取消和人工评分；中途取消一次并模拟 jobs 不可用的 detached 降级，核对是否停止请求、是否残留文件及结果能否交付。无法限定费用或追踪 detached 任务即保持观察。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 10 | 2674 | 2570 | 224 | — |
| .md | source | 1 | 151 | — | — | 1661 |
| .mjs | source | 1 | 50 | 33 | 13 | — |
| .tsx | source | 5 | 1303 | 1095 | 140 | — |
| .ts | source | 11 | 1733 | 1390 | 244 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/1497105876/dsh-media-studio/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：研究 dsh-media-studio 在固定版本中的实现贡献、成立条件、关键限制、采用价值与可证伪的新设计方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种任务中使用，原有办法和合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

面向在对话中制作图片或视频的内容团队，把提供商配置、异步生成、媒体发送和预设收进 DSH 工作流。 合格结果不是“工具被调用”，而是用户能在既定边界内得到可复核产物。基线是各提供商网页或脚本；插件减少切换和回传步骤，但仍需人工选择、内容审核和费用控制。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-20](https://github.com/1497105876/dsh-media-studio/blob/4fb706a3fb2b68cdbb81e951885d2178905d6ca2/README.md#L1-L20)

作者材料说明目标用户、安装方式、主要能力和已知边界。

<details>
<summary>查看原文（20行）</summary>

```text
# dsh-media-studio

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![dsh](https://img.shields.io/badge/dsh-0.2.1--rc.2-4b8bbe)](https://github.com/deepseek-ai/deepseek-harness)
[![node](https://img.shields.io/badge/node-%3E%3D22.19-339933)](https://nodejs.org)

在 dsh（DeepSeek Harness）聊天里**直接生成图片 / 视频**并发送到会话的插件。
模型侧拿到 `generate_image` / `generate_video` / `send_media` 三个工具，人侧拿到
内联画廊、可播放的视频卡片，支持下载与用系统默认应用打开；长耗时生成默认走
后台任务，完成后自动把结果推送回会话。

生成后端可插拔：内置 **Agnes**（免费额度，图生图 / 首尾帧 / 参考图视频）与
**OpenAI 兼容**两种适配器，预设硅基流动、阿里百炼、Gemini（OpenAI 兼容端点）、
Sora 2 等条目，也可以在配置里加任意 `baseURL + model + apiKeyEnv` 的自定义条目。

## 功能

| 能力 | 说明 |
|---|---|
| 文生图 / 图生图 | `generate_image`：本地路径、https URL、data URI 均可作参考图 |
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 能力如何从入口、注册、调用到状态变化实现？

**研究主题**：功能与机制

#### 完整回答

入口注册 generate_image、generate_video、send_media 及命令；provider 层适配外部服务，jobs 层用 AbortController 管理后台任务，附件与客户端 slot 呈现结果。 源码可以确认注册和数据流存在，但不能据此推断宿主加载、外部服务或最终效果已经通过。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-10](https://github.com/1497105876/dsh-media-studio/blob/4fb706a3fb2b68cdbb81e951885d2178905d6ca2/lib/index.js#L1-L10)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（10行）</summary>

```text
import { Config } from './config.js';
import { registerMediaCommands } from './commands.js';
import { registerMediaTools } from './tools.js';
export const name = 'media-studio';
export const inject = ['tools', 'jobs', 'commands', 'attachments', 'credentials'];
export { Config };
export function apply(ctx, config) {
    registerMediaTools(ctx, config);
    registerMediaCommands(ctx, config);
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对原生能力或简单替代，固定版本增加了什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对直接调用各家 API，它统一媒体任务、提供商、作业进度、附件交付和会话 UI，业务增量是把生成与交付放在同一对话链路。 参照是宿主原生工具、直接脚本或手工流程，现有证据支持实现增量，不支持全球首创或收益排名。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-10](https://github.com/1497105876/dsh-media-studio/blob/4fb706a3fb2b68cdbb81e951885d2178905d6ca2/lib/index.js#L1-L10)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（10行）</summary>

```text
import { Config } from './config.js';
import { registerMediaCommands } from './commands.js';
import { registerMediaTools } from './tools.js';
export const name = 'media-studio';
export const inject = ['tools', 'jobs', 'commands', 'attachments', 'credentials'];
export { Config };
export function apply(ctx, config) {
    registerMediaTools(ctx, config);
    registerMediaCommands(ctx, config);
}
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

最强支持是固定版本实现确有完整入口和防御分支。最关键限制是：生成质量、费用、内容政策和可重复性主要由外部提供商决定；插件统一入口并不能证明不同提供商的结果可比，后台降级为 detached 时取消与追踪也更弱。 这会直接收窄采用范围，而不是否定所有能力。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-10](https://github.com/1497105876/dsh-media-studio/blob/4fb706a3fb2b68cdbb81e951885d2178905d6ca2/lib/index.js#L1-L10)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（10行）</summary>

```text
import { Config } from './config.js';
import { registerMediaCommands } from './commands.js';
import { registerMediaTools } from './tools.js';
export const name = 'media-studio';
export const inject = ['tools', 'jobs', 'commands', 'attachments', 'credentials'];
export { Config };
export function apply(ctx, config) {
    registerMediaTools(ctx, config);
    registerMediaCommands(ctx, config);
}
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复分别依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

依赖 DSH tools、jobs、commands、attachments、credentials 和至少一个外部媒体提供商；需要密钥、网络、额度与本地结果存储。 启动成功、持续有用和失败恢复是三类不同条件；缺少依赖时不能把“已注册”当作任务已办结。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-10](https://github.com/1497105876/dsh-media-studio/blob/4fb706a3fb2b68cdbb81e951885d2178905d6ca2/lib/index.js#L1-L10)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（10行）</summary>

```text
import { Config } from './config.js';
import { registerMediaCommands } from './commands.js';
import { registerMediaTools } from './tools.js';
export const name = 'media-studio';
export const inject = ['tools', 'jobs', 'commands', 'attachments', 'credentials'];
export { Config };
export function apply(ctx, config) {
    registerMediaTools(ctx, config);
    registerMediaCommands(ctx, config);
}
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 首次、持续与失败恢复成本及效果证据如何？

**研究主题**：效果与总成本

#### 完整回答

首次成本是配置至少一个图像/视频提供商、密钥、模型、预设和附件存储；持续成本按每次生成的提供商计费、等待时间、媒体文件大小及人工筛选重生成次数累积；失败恢复包括取消 job、识别 provider 错误、清理部分媒体并重新提交。合格单位应是一份满足尺寸、格式、内容和可交付链接要求的媒体，而不是 job completed。当前缺每种 provider 的单次价格、成功率、生成秒数、文件 MB 与平均重生成次数。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-10](https://github.com/1497105876/dsh-media-studio/blob/4fb706a3fb2b68cdbb81e951885d2178905d6ca2/lib/index.js#L1-L10)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（10行）</summary>

```text
import { Config } from './config.js';
import { registerMediaCommands } from './commands.js';
import { registerMediaTools } from './tools.js';
export const name = 'media-studio';
export const inject = ['tools', 'jobs', 'commands', 'attachments', 'credentials'];
export { Config };
export function apply(ctx, config) {
    registerMediaTools(ctx, config);
    registerMediaCommands(ctx, config);
}
```

</details>

#### 缺口

- 缺少图像/视频提供商的实际请求价格、生成时长、失败率、输出 MB、人工筛选分钟和达到合格结果的尝试数。
  **影响**：无法计算每个合格媒体的总成本，也无法判断统一入口是否减少重生成。
  **进一步探讨**：固定图片和视频各一份交付规格，记录每次 provider 请求、金额、秒数、输出大小、失败/取消和人工评分，按总支出除以合格件数。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现有哪些可靠性取舍和可复用设计？

**研究主题**：工程质量与复用

#### 完整回答

provider、media、jobs 与 UI 分层便于扩展，AbortController 贯穿取消路径；需重点验证 detached 降级、凭据隔离、失败重试和大文件生命周期。 这些判断来自结构与错误路径抽读，不等于完整安全审计或生产可靠性证明。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-10](https://github.com/1497105876/dsh-media-studio/blob/4fb706a3fb2b68cdbb81e951885d2178905d6ca2/lib/index.js#L1-L10)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（10行）</summary>

```text
import { Config } from './config.js';
import { registerMediaCommands } from './commands.js';
import { registerMediaTools } from './tools.js';
export const name = 'media-studio';
export const inject = ['tools', 'jobs', 'commands', 'attachments', 'credentials'];
export { Config };
export function apply(ctx, config) {
    registerMediaTools(ctx, config);
    registerMediaCommands(ctx, config);
}
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献和限制能推导什么未验证方向？

**研究主题**：新假设与验证

#### 完整回答

从已确认机制与关键限制可推导：可增加“交付规格优先”的生成计划，先固定尺寸、格式、版权与验收项，再并行低成本草图和高质量定稿，减少无效重生成。 最小验证应与现有简单流程在相同任务、模型、预算和验收标准下比较，并在人工投入或失败率上升时否定该方向。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-10](https://github.com/1497105876/dsh-media-studio/blob/4fb706a3fb2b68cdbb81e951885d2178905d6ca2/lib/index.js#L1-L10)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（10行）</summary>

```text
import { Config } from './config.js';
import { registerMediaCommands } from './commands.js';
import { registerMediaTools } from './tools.js';
export const name = 'media-studio';
export const inject = ['tools', 'jobs', 'commands', 'attachments', 'credentials'];
export { Config };
export function apply(ctx, config) {
    registerMediaTools(ctx, config);
    registerMediaCommands(ctx, config);
}
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对什么人值得观察或试用，成功与停止条件是什么？

**研究主题**：采用判断

#### 完整回答

适合已有受控媒体 API 账户、能定义尺寸/格式/内容验收并接受人工审核的团队先观察；涉及版权、品牌或高额视频生成时不应直接自动化。只有取消、凭据隔离、附件交付和费用上限在目标 provider 上通过，且每个合格媒体的重试数低于网页手工流程，才进入试用；费用失控或 detached job 无法追踪应停用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-10](https://github.com/1497105876/dsh-media-studio/blob/4fb706a3fb2b68cdbb81e951885d2178905d6ca2/lib/index.js#L1-L10)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（10行）</summary>

```text
import { Config } from './config.js';
import { registerMediaCommands } from './commands.js';
import { registerMediaTools } from './tools.js';
export const name = 'media-studio';
export const inject = ['tools', 'jobs', 'commands', 'attachments', 'credentials'];
export { Config };
export function apply(ctx, config) {
    registerMediaTools(ctx, config);
    registerMediaCommands(ctx, config);
}
```

</details>

#### 缺口

- 未核实任何真实 provider 的费用、内容政策、取消语义和附件生命周期。
  **影响**：媒体生成具有外部费用与大文件副作用，源码接线不足以支持直接试用。
  **进一步探讨**：用低额度沙箱分别执行一张图和一段短视频，验证取消、失败、凭据、附件删除并核算每个合格产物的总成本。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
