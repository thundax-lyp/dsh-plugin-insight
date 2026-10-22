# amoji-dsh-adapter

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[833cfc8](https://github.com/5101good/amoji/tree/833cfc8a332810ef195a1e0466259ef7687b3a65/adapters/dsh)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：把 Amoji 不可变语义表情资产、市场和可靠投递接入 DSH。

> **核心亮点**：把图像身份与模型语义解耦，版本归档和可重试投递适合协作；组件自身只有接线，核心能力主要在仓库其他共享运行时。 详见[Q03](#research-q03)。

> **风险与缺陷**：该组件锁定较旧 DSH/Node 组合且作者主要验证 macOS；共享数据库、浏览器 RPC 和未知结果协调增加故障面。 详见[Q04](#research-q04)。

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
  - [Q01 · 场景：适合需要人看图、模型只看稳定语义的表情资产创作、检索和投递？](#detail-section-11)
  - [Q02 · 机制：薄适配器连接 SharedClient/runtime/collaboration/publisher 并 installDsh？](#detail-section-12)
  - [Q03 · 贡献：把图像身份与模型语义解耦，版本归档和可重试投递适合协作？](#detail-section-13)
  - [Q04 · 局限：该组件锁定较旧 DSH/Node 组合且作者主要验证 macOS？](#detail-section-14)
  - [Q05 · 依赖：需要 Node 24、特定 DSH 基线、本机共享服务/数据库与浏览器认证环境？](#detail-section-15)
  - [Q06 · 成本与效果：48 个资产和版本历史占本地存储，市场/发布带网络与账号管理？](#detail-section-16)
  - [Q07 · 工程：accepted/observed/rendered 区分和 immutable version 是强契约？](#detail-section-17)
  - [Q08 · 假设：以 crash-after-accepted 故障注入证明相同 operation 可协调恢复，才足以支持“可靠投递”而非普通重试。？](#detail-section-18)
  - [Q09 · 采用：保持观察？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合需要人看图、模型只看稳定语义的表情资产创作、检索和投递；少量静态贴图用目录加说明更简单。 详见[Q01](#research-q01)。

适合需要人看图、模型只看稳定语义的表情资产创作、检索和投递；少量静态贴图用目录加说明更简单。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

#### 能力明细

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 模型工具 | 以文本工具搜索、选择和投递 Amoji | 共享 runtime 的跨平台行为、数据库迁移和投递 exactly-once 性质未在组件范围验证 |
| Host 路由 | 连接本机共享 Amoji 服务和认证 RPC | 共享 runtime 的跨平台行为、数据库迁移和投递 exactly-once 性质未在组件范围验证 |
| 界面 | 管理表情、草稿、版本与市场 | 共享 runtime 的跨平台行为、数据库迁移和投递 exactly-once 性质未在组件范围验证 |
| 后台 | 共享运行时维护本地数据库和投递状态 | 共享 runtime 的跨平台行为、数据库迁移和投递 exactly-once 性质未在组件范围验证 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| Amoji shared runtime/DB | 必需 | 资产、版本与状态 | 适配器无核心能力 |
| 匹配 DSH/Node | 必需 | 加载 adapter | 版本不符可能失败 |
| 浏览器认证/市场 | 发布时 | RPC 与分发 | 离线仅本地 |

#### 启动步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 启动 | 连接共享服务 | 核 schema/版本 |
| 选择 | 模型按语义找资产 | 人确认图像 |
| 投递 | 追踪 accepted→observed→rendered | 未知结果先协调 |
| 恢复 | 重启后查 operation | 禁止盲目重发 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 本地库 | 资产与不可变版本 | 备份/迁移 | 增长率未知 |
| 共享服务 | 常驻进程/数据库 | 维护生命周期 | 跨平台未核 |
| 投递异常 | 协调状态与人工复核 | 按 operation 恢复 | 重复发送代价 |

#### 效果

| 效果项 | 源码支持 | 验证指标 |
| --- | --- | --- |
| 语义稳定 | 模型不依赖像素识别 | 错误选图率 |
| 版本治理 | 归档/导入导出 | 恢复成功率 |
| 可靠投递 | 三段状态可追踪 | 重复率与未知结果收敛时间 |

> **思考**：该组件锁定较旧 DSH/Node 组合且作者主要验证 macOS；共享数据库、浏览器 RPC 和未知结果协调增加故障面。 详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把图像身份与模型语义解耦，版本归档和可重试投递适合协作；组件自身只有接线，核心能力主要在仓库其他共享运行时。 详见[Q03](#research-q03)。

把图像身份与模型语义解耦，版本归档和可重试投递适合协作；组件自身只有接线，核心能力主要在仓库其他共享运行时。 详见[Q03](#research-q03)。

accepted/observed/rendered 区分和 immutable version 是强契约；但研究组件未包含完整 runtime 源码，不能从 27 行入口推断全链质量。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

该组件锁定较旧 DSH/Node 组合且作者主要验证 macOS；共享数据库、浏览器 RPC 和未知结果协调增加故障面。 详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

保持观察；仅在匹配的 macOS/DSH 隔离环境检查共享服务生命周期、备份与未知结果恢复，不用于唯一资产库。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定组件的 27 行适配入口可确认 SharedClient、runtime、协作与发布器接线，README 则描述不可变资产和三段投递状态；共享服务没有在本组件范围运行，跨平台和故障恢复仍属未验证。

- 已检查：作者 README、包清单、源码路径 README.md、adapters/dsh/README.md、adapters/dsh/index.mjs 及固定范围 inventory；组件：adapters/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 README.md、adapters/dsh/README.md、adapters/dsh/index.mjs 与 prepared inventory；未安装、未运行、未访问真实账号/设备/服务。共享 runtime 的跨平台行为、数据库迁移和投递 exactly-once 性质未在组件范围验证。
- 下一步：下一步只做本项可证伪实验：复制一份资产库，分别在 accepted/observed/rendered 后杀进程，重启协调同一 operation 并核重复投递与数据库一致性。

**分析版本**

- **仓库**：[5101good/amoji](https://github.com/5101good/amoji)
- **版本号**：1.1.0（[固定提交 833cfc8](https://github.com/5101good/amoji/tree/833cfc8a332810ef195a1e0466259ef7687b3a65)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

以 crash-after-accepted 故障注入证明相同 operation 可协调恢复，才足以支持“可靠投递”而非普通重试。 详见[Q08](#research-q08)。

下一步只做本项可证伪实验：复制一份资产库，分别在 accepted/observed/rendered 后杀进程，重启协调同一 operation 并核重复投递与数据库一致性。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 27 | 27 | 1 | — |
| .md | source | 2 | 106 | — | — | 2145 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/5101good/amoji/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Amoji 的不可变语义和可靠投递能否抵消共享服务、版本锁与跨平台复杂度？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 场景：适合需要人看图、模型只看稳定语义的表情资产创作、检索和投递？

**研究主题**：场景与需求

#### 完整回答

适合需要人看图、模型只看稳定语义的表情资产创作、检索和投递；少量静态贴图用目录加说明更简单。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/5101good/amoji/blob/833cfc8a332810ef195a1e0466259ef7687b3a65/README.md#L1-L5)

固定提交复核：场景相关声明与实现入口。

```text
# Amoji

[English](README.en.md) · [开始使用](#安装) · [文档](docs/README.md) · [下载 1.1](https://github.com/5101good/amoji/releases/tag/v1.1.0)

**人机协作，也需要表情。**
```

#### 缺口

- 共享 runtime 的跨平台行为、数据库迁移和投递 exactly-once 性质未在组件范围验证
  **影响**：场景结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：复制一份资产库，分别在 accepted/observed/rendered 后杀进程，重启协调同一 operation 并核重复投递与数据库一致性

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 机制：薄适配器连接 SharedClient/runtime/collaboration/publisher 并 installDsh？

**研究主题**：功能与机制

#### 完整回答

薄适配器连接 SharedClient/runtime/collaboration/publisher 并 installDsh；共享服务维护版本化资产、市场和 accepted/observed/rendered 状态。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/index.mjs:1-10](https://github.com/5101good/amoji/blob/833cfc8a332810ef195a1e0466259ef7687b3a65/adapters/dsh/index.mjs#L1-L10)

固定提交复核：机制相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
import {DshPublisher,MARKET_ORIGIN} from './runtime/src/dsh/publisher.js';
import { dshHomePath } from '@deepseek-ai/dsh-home-paths';
import { loadProfileIdentity } from './runtime/src/dsh/profile-identity.js';
import { DshCollaboration } from './runtime/src/dsh/collaboration.js';
import { defineTool } from '@deepseek-ai/dsh-tools';
import { SharedClient } from './runtime/src/shared-client.js';
import { ConnectedRuntime } from './runtime/src/adapter-runtime.js';
import { DSH_RELIABILITY_CAPABILITY, DSH_NATIVE_CAPABILITY, LIBRARY_MANAGEMENT_CAPABILITY, PACKS_CAPABILITY } from './runtime/src/shared-contract.js';
import { installDsh } from './runtime/src/dsh/host.js';
export const inject = ['tools', 'sessions', 'sessionProjections', 'sessionController', 'connection', 'llm', 'agents', 'systemPrompt'];
```

</details>

#### 缺口

- 共享 runtime 的跨平台行为、数据库迁移和投递 exactly-once 性质未在组件范围验证
  **影响**：机制结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：复制一份资产库，分别在 accepted/observed/rendered 后杀进程，重启协调同一 operation 并核重复投递与数据库一致性

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 贡献：把图像身份与模型语义解耦，版本归档和可重试投递适合协作？

**研究主题**：贡献与相对优势

#### 完整回答

把图像身份与模型语义解耦，版本归档和可重试投递适合协作；组件自身只有接线，核心能力主要在仓库其他共享运行时。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/5101good/amoji/blob/833cfc8a332810ef195a1e0466259ef7687b3a65/README.md#L1-L5)

固定提交复核：贡献相关声明与实现入口。

```text
# Amoji

[English](README.en.md) · [开始使用](#安装) · [文档](docs/README.md) · [下载 1.1](https://github.com/5101good/amoji/releases/tag/v1.1.0)

**人机协作，也需要表情。**
```

#### 缺口

- 共享 runtime 的跨平台行为、数据库迁移和投递 exactly-once 性质未在组件范围验证
  **影响**：贡献结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：复制一份资产库，分别在 accepted/observed/rendered 后杀进程，重启协调同一 operation 并核重复投递与数据库一致性

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 局限：该组件锁定较旧 DSH/Node 组合且作者主要验证 macOS？

**研究主题**：缺陷与关键质疑

#### 完整回答

该组件锁定较旧 DSH/Node 组合且作者主要验证 macOS；共享数据库、浏览器 RPC 和未知结果协调增加故障面。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/index.mjs:1-10](https://github.com/5101good/amoji/blob/833cfc8a332810ef195a1e0466259ef7687b3a65/adapters/dsh/index.mjs#L1-L10)

固定提交复核：局限相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
import {DshPublisher,MARKET_ORIGIN} from './runtime/src/dsh/publisher.js';
import { dshHomePath } from '@deepseek-ai/dsh-home-paths';
import { loadProfileIdentity } from './runtime/src/dsh/profile-identity.js';
import { DshCollaboration } from './runtime/src/dsh/collaboration.js';
import { defineTool } from '@deepseek-ai/dsh-tools';
import { SharedClient } from './runtime/src/shared-client.js';
import { ConnectedRuntime } from './runtime/src/adapter-runtime.js';
import { DSH_RELIABILITY_CAPABILITY, DSH_NATIVE_CAPABILITY, LIBRARY_MANAGEMENT_CAPABILITY, PACKS_CAPABILITY } from './runtime/src/shared-contract.js';
import { installDsh } from './runtime/src/dsh/host.js';
export const inject = ['tools', 'sessions', 'sessionProjections', 'sessionController', 'connection', 'llm', 'agents', 'systemPrompt'];
```

</details>

#### 缺口

- 共享 runtime 的跨平台行为、数据库迁移和投递 exactly-once 性质未在组件范围验证
  **影响**：局限结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：复制一份资产库，分别在 accepted/observed/rendered 后杀进程，重启协调同一 operation 并核重复投递与数据库一致性

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 依赖：需要 Node 24、特定 DSH 基线、本机共享服务/数据库与浏览器认证环境？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要 Node 24、特定 DSH 基线、本机共享服务/数据库与浏览器认证环境；卸载适配器不等于删除共享数据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/5101good/amoji/blob/833cfc8a332810ef195a1e0466259ef7687b3a65/README.md#L1-L5)

固定提交复核：依赖相关声明与实现入口。

```text
# Amoji

[English](README.en.md) · [开始使用](#安装) · [文档](docs/README.md) · [下载 1.1](https://github.com/5101good/amoji/releases/tag/v1.1.0)

**人机协作，也需要表情。**
```

#### 缺口

- 共享 runtime 的跨平台行为、数据库迁移和投递 exactly-once 性质未在组件范围验证
  **影响**：依赖结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：复制一份资产库，分别在 accepted/observed/rendered 后杀进程，重启协调同一 operation 并核重复投递与数据库一致性

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本与效果：48 个资产和版本历史占本地存储，市场/发布带网络与账号管理？

**研究主题**：效果与总成本

#### 完整回答

48 个资产和版本历史占本地存储，市场/发布带网络与账号管理；可靠投递需保存 operation 状态并处理未知结果。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/5101good/amoji/blob/833cfc8a332810ef195a1e0466259ef7687b3a65/README.md#L1-L5)

固定提交复核：成本与效果相关声明与实现入口。

```text
# Amoji

[English](README.en.md) · [开始使用](#安装) · [文档](docs/README.md) · [下载 1.1](https://github.com/5101good/amoji/releases/tag/v1.1.0)

**人机协作，也需要表情。**
```

#### 缺口

- 共享 runtime 的跨平台行为、数据库迁移和投递 exactly-once 性质未在组件范围验证
  **影响**：成本与效果结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：复制一份资产库，分别在 accepted/observed/rendered 后杀进程，重启协调同一 operation 并核重复投递与数据库一致性

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 工程：accepted/observed/rendered 区分和 immutable version 是强契约？

**研究主题**：工程质量与复用

#### 完整回答

accepted/observed/rendered 区分和 immutable version 是强契约；但研究组件未包含完整 runtime 源码，不能从 27 行入口推断全链质量。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/index.mjs:1-10](https://github.com/5101good/amoji/blob/833cfc8a332810ef195a1e0466259ef7687b3a65/adapters/dsh/index.mjs#L1-L10)

固定提交复核：工程相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
import {DshPublisher,MARKET_ORIGIN} from './runtime/src/dsh/publisher.js';
import { dshHomePath } from '@deepseek-ai/dsh-home-paths';
import { loadProfileIdentity } from './runtime/src/dsh/profile-identity.js';
import { DshCollaboration } from './runtime/src/dsh/collaboration.js';
import { defineTool } from '@deepseek-ai/dsh-tools';
import { SharedClient } from './runtime/src/shared-client.js';
import { ConnectedRuntime } from './runtime/src/adapter-runtime.js';
import { DSH_RELIABILITY_CAPABILITY, DSH_NATIVE_CAPABILITY, LIBRARY_MANAGEMENT_CAPABILITY, PACKS_CAPABILITY } from './runtime/src/shared-contract.js';
import { installDsh } from './runtime/src/dsh/host.js';
export const inject = ['tools', 'sessions', 'sessionProjections', 'sessionController', 'connection', 'llm', 'agents', 'systemPrompt'];
```

</details>

#### 缺口

- 共享 runtime 的跨平台行为、数据库迁移和投递 exactly-once 性质未在组件范围验证
  **影响**：工程结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：复制一份资产库，分别在 accepted/observed/rendered 后杀进程，重启协调同一 operation 并核重复投递与数据库一致性

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 假设：以 crash-after-accepted 故障注入证明相同 operation 可协调恢复，才足以支持“可靠投递”而非普通重试。？

**研究主题**：新假设与验证

#### 完整回答

以 crash-after-accepted 故障注入证明相同 operation 可协调恢复，才足以支持“可靠投递”而非普通重试。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/5101good/amoji/blob/833cfc8a332810ef195a1e0466259ef7687b3a65/README.md#L1-L5)

固定提交复核：假设相关声明与实现入口。

```text
# Amoji

[English](README.en.md) · [开始使用](#安装) · [文档](docs/README.md) · [下载 1.1](https://github.com/5101good/amoji/releases/tag/v1.1.0)

**人机协作，也需要表情。**
```

#### 缺口

- 共享 runtime 的跨平台行为、数据库迁移和投递 exactly-once 性质未在组件范围验证
  **影响**：假设结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：复制一份资产库，分别在 accepted/observed/rendered 后杀进程，重启协调同一 operation 并核重复投递与数据库一致性

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 采用：保持观察？

**研究主题**：采用判断

#### 完整回答

保持观察；仅在匹配的 macOS/DSH 隔离环境检查共享服务生命周期、备份与未知结果恢复，不用于唯一资产库。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/5101good/amoji/blob/833cfc8a332810ef195a1e0466259ef7687b3a65/README.md#L1-L5)

固定提交复核：采用相关声明与实现入口。

```text
# Amoji

[English](README.en.md) · [开始使用](#安装) · [文档](docs/README.md) · [下载 1.1](https://github.com/5101good/amoji/releases/tag/v1.1.0)

**人机协作，也需要表情。**
```

#### 缺口

- 共享 runtime 的跨平台行为、数据库迁移和投递 exactly-once 性质未在组件范围验证
  **影响**：采用结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：复制一份资产库，分别在 accepted/observed/rendered 后杀进程，重启协调同一 operation 并核重复投递与数据库一致性

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
