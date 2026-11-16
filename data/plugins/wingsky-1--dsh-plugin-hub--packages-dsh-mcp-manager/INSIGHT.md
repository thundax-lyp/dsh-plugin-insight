# dsh-mcp-manager

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[62d5343](https://github.com/wingsky-1/dsh-plugin-hub/tree/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager)

<!-- BEGIN META -->
[![GitHub ★ 32](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=32&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/wingsky-1/dsh-plugin-hub) [![npm 30d 2,638](https://img.shields.io/static/v1?label=npm+30d&message=2%2C638&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wingsky-1/dsh-mcp-manager) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wingsky-1/dsh-mcp-manager)
<!-- END META -->

> **功能**：在 DSH Web 中管理 MCP 服务目录、配置和生命周期。

> **亮点**：目录发现接到宿主配置读写，并用固定项目根完成更新和删除。读模型把敏感配置与状态展示分开，SSE 通知变更后由客户端重取摘要。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：非回环管理请求接宿主 admission，缺失便拒绝。读模型脱敏及路由围栏只能约束该入口，第三方 MCP 的进程权限和配置仍由使用者核对。[Q03](#research-q03)

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
  - [Q01 · 它解决哪些 MCP 管理任务，相对手工配置文件有什么变化？](#detail-section-11)
  - [Q02 · 服务目录/API/客户端如何连接，运行时需要什么依赖？](#detail-section-12)
  - [Q03 · 服务包来源、凭据和生命周期有哪些风险？](#detail-section-13)
  - [Q04 · 何时值得采用，维护和失败成本如何设定？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需在 DSH Web 中添加、搜索、配置或管理 MCP 服务的用户。插件把目录浏览、条目详情/搜索、设置和服务管理集成到界面；相比手动编辑配置，更容易发现并管理已知条目。目录存在并不代表服务安全、兼容或可用，具体执行结果仍取决于用户配置、依赖安装和 MCP 服务端。

手动维护 MCP 配置可以保留明确的版本、文件和目标根，服务状态可单独检查。管理器把目录、配置和状态关联，价值取决于作用域是否可核对及停止是否有效。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 主要用途 | 条件与边界 |
| --- | --- | --- |
| MCP 目录 | 搜索和查看可配置条目 | 目录只说明候选，需要另核来源 |
| 服务器配置与作用域 | 在目标项目添加、修改、删除 MCP | 见项目根解析和管理路由准入 |
| 状态流 | 通知客户端连接状态发生变化 | SSE 推事件并引导重读摘要，非回环需要获准 Peer |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| DSH webServer、tools 与 systemPrompt | 注册管理路由和宿主工具上下文 | 宿主及子包版本需配套 |
| Connection 短请求 admission 与 Peer | 控制非回环管理入口、追踪远端 SSE | 缺 admission、异常或无法绑定 Peer 时拒绝 |
| 本地 MCP 进程或已授权 HTTP endpoint | 产生实际工具调用 | 配置列表出现不代表连接及操作已成功 |

| 阶段 | 操作 | 异常与退出 |
| --- | --- | --- |
| 试用配置 | 独立回环 profile 添加无需凭据的可信本地 MCP 示例 | 明确写入项目根，保护已有配置 |
| 核对结果 | 观察管理摘要、连接，再调用一次预期工具 | 健康状态和工具回执分别检查 |
| 退出 | 在同一项目根断开并移除示例，停用管理入口 | 检查子进程、路由和配置是否仍有残留 |

**效果与成本**

| 阶段 | 现金与资源 | 人工投入 | 未知 |
| --- | --- | --- | --- |
| 准备 | 需要可用的测试 MCP 和 DSH Web 环境 | 人工审核进程、参数、配置作用域 | 首次接入工时未测 |
| 运行 | 子进程或远程服务消耗由具体 MCP 决定 | 维护版本、凭据和实际工具结果 | 无法从目录条目推出费用与稳定性 |
| 退出 | 关连接及删除测试配置 | 核对进程退出、全局配置和已有工具绑定 | 应用外部副作用需独立补救 |

| 效果项 | 当前源码可支持 | 未验证项 |
| --- | --- | --- |
| 在一个界面回查目录与配置 | 受守卫的 API 对项目根增删改并返回投影 | 团队运维节省未对照 |
| 观察连接或配置异常 | 宿主状态变化提示客户端重新读摘要 | 工具是否实际可用需用真实连接另验 |

> **思考**：非回环管理请求接宿主 admission，缺失便拒绝。读模型脱敏及路由围栏只能约束该入口，第三方 MCP 的进程权限和配置仍由使用者核对。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：目录发现接到宿主配置读写，并用固定项目根完成更新和删除。读模型把敏感配置与状态展示分开，SSE 通知变更后由客户端重取摘要。[Q01](#research-q01) [Q02](#research-q02)

非回环的管理请求以动态 Connection 权限判断，在 405 和写体处理前拒绝。SSE 要有 Peer 生命周期，并支持卸载时回收连接。配置返回采用读模型，stdio 隐去 env、HTTP 隐去 headers，项目写入经请求目标根定位。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

非回环管理请求接宿主 admission，缺失便拒绝。读模型脱敏及路由围栏只能约束该入口，第三方 MCP 的进程权限和配置仍由使用者核对。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在回环的独立 profile 配置一个无需凭据的可信本地示例，核对作用域、连接与一次工具响应。结束后按同一项目根移除并确认子进程及路由关闭，发现无法停止或误写全局配置时，停用管理器并回到人工配置。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码核实项目配置路由、非回环准入和 SSE 生命周期。实际模型工具输出、服务器停止与第三方配置安全留给目标宿主验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-mcp-manager/README.md、packages/dsh-mcp-manager/src/index.ts、packages/dsh-mcp-manager/src/server/api/routes.ts、packages/dsh-mcp-manager/src/server/catalog/impl/service/index.ts、packages/dsh-mcp-manager/src/server/api/routes-controllers.ts、shared/host-utils.ts、packages/dsh-mcp-manager/src/server/connection/orchestrator/manager.ts 及固定范围 inventory；组件：packages/dsh-mcp-manager。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 wingsky-1/dsh-plugin-hub packages/dsh-mcp-manager 的固定提交、README/manifest、入口和直接调用的关键模块；未安装或执行目标插件、宿主、浏览器、模型/API或第三方服务。
- 下一步：在回环隔离 profile 建立一个测试服务器，发起一次已知工具调用，核对预期输出，然后断开并按原项目根移除。另用无效凭据和非白名单方法确认权限、方法和作用域错误分别可识别。移除后检查文件与进程。[Q03](#research-q03) [Q04](#research-q04)

**分析版本**

- **仓库**：[wingsky-1/dsh-plugin-hub](https://github.com/wingsky-1/dsh-plugin-hub)
- **版本号**：0.2.11（[固定提交 62d5343](https://github.com/wingsky-1/dsh-plugin-hub/tree/62d5343c0021d115e350875157f6b33a23072d28)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在多项目重复配置同一可信 MCP 的团队中，按项目根显示写入对象和连接回执可能减少误改全局配置。让两组用户用手工配置与管理器各完成一次添加、调用及移除，记录写错根、工具可用及残留进程，准确率或恢复时间无改善则保留手工方式。[Q04](#research-q04)

在回环隔离 profile 建立一个测试服务器，发起一次已知工具调用，核对预期输出，然后断开并按原项目根移除。另用无效凭据和非白名单方法确认权限、方法和作用域错误分别可识别。移除后检查文件与进程。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 4400 | — | — | 122191 |
| .ts | source | 118 | 19665 | 12848 | 5654 | — |
| .tsx | source | 1 | 195 | 133 | 53 | — |
| .ts | test | 146 | 39162 | 32575 | 3488 | — |

</details>

**活跃度**

[![Issue 未关闭 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=14&color=737b86&logo=github)](https://github.com/wingsky-1/dsh-plugin-hub/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-16。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：该宿主插件如何发现、配置并管理 MCP 服务，服务目录和实际运行状态之间的信任、兼容及故障边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它解决哪些 MCP 管理任务，相对手工配置文件有什么变化？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需在 DSH Web 中添加、搜索、配置或管理 MCP 服务的用户。插件把目录浏览、条目详情/搜索、设置和服务管理集成到界面；相比手动编辑配置，更容易发现并管理已知条目。目录存在并不代表服务安全、兼容或可用，具体执行结果仍取决于用户配置、依赖安装和 MCP 服务端。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-mcp-manager/README.md:1-70](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager/README.md#L1-L70)

README 说明目录管理和用户操作入口。

<details>
<summary>查看原文（70行）</summary>

````text
# @wingsky-1/dsh-mcp-manager
[![npm](https://img.shields.io/npm/v/@wingsky-1/dsh-mcp-manager)](https://www.npmjs.com/package/@wingsky-1/dsh-mcp-manager)
[![GitHub Releases](https://img.shields.io/github/v/release/wingsky-1/dsh-plugin-hub)](https://github.com/wingsky-1/dsh-plugin-hub/releases)

DSH（DeepSeek Harness）的 **MCP 服务器管理插件**：会话界面右上角浮窗 + 分级面板 +
快速接入（手工表单 + 粘贴 mcpServers JSON 导入，**不预设任何服务器**）。
连接与协议交官方 `@deepseek-ai/dsh-mcp-client`（宿主 cordis loader 按包名装载到 dsh 安装内的副本），本插件只留配置面与模型可见面；官方客户端不随包分发，也无需额外安装。

模型可见面只有四个原子工具（`ws_mcp_list` / `ws_mcp_detail` / `ws_mcp_search` /
`ws_mcp_call`）：项目级、全局级与运行时注入的封装定义条目**一律经中间层访问**，两级发现
（`ws_mcp_list` 完整盘点 → `ws_mcp_detail` 按需拉完整 schema）；cwd 无项目时回落全局虚拟
root `@global`。宿主仍按 `mcp__<id>__<tool>` 注册工具（`id` 是本次装配按
(工作空间, 服务器名) 分配的不透明短串，不能由服务器名推导），但这些名字**会被从模型的
工具列表中摘除**，禁止直呼。
两级配置文件中的服务器列表（增删/启停/改配置）支持热加载、即时生效，无需重启。
（`middleware` / `middlewarePolicy` 两个配置键已在 #767 笔 2 废除——旧配置里写了不生效、
也不会被本插件改写。）

**项目根怎么定（#1137）**：项目级 MCP 跟随**调用 agent 在调用开始时的有效活动
workingDirectory**——每次工具调用开始时取一次目录快照，并在本次调用内固定该 root；
切目录后的新调用才采用新 root，已在飞的调用仍在旧 root 完成（或按既有取消协议取消）。
会话创建目录 `header.cwd` 只是初始项目身份，**不再**作为活动目录猜测值。没有有效活动
目录时项目级操作 fail-closed（报「无法确定工作空间」），不回退 `header.cwd` /
`process.cwd` / UI 最近 session / 另一个已连接工作区；显式 `@global` 仍可达（全局
来源存在服务器时），且**不把未知项目名偷换成同名全局服务器**。

> **升级后历史会话打不开？**
> 当前版本只生成 producer-owned V4 source；旧 source 仅通过一次性维护脚本处理，详见[升级与历史会话边界](#升级与历史会话边界)。

## 一键安装

```sh
dsh plugin --profile web add @wingsky-1/dsh-mcp-manager
```

> 安装 / 卸载 / 更新后都需**重启一次** `dsh web`（bundle 层只在启动时组合）生效。

## 核心优势

- **上下文成本可控**：全部 MCP 经中间层收敛，模型面只占 `ws_mcp_list` /
  `ws_mcp_detail` / `ws_mcp_search` / `ws_mcp_call` 四个原子工具位——接多少台
  服务器、多少个工具都不膨胀系统提示词（两级发现：`ws_mcp_list` 完整盘点 →
  `ws_mcp_detail` 按需拉完整 schema）
- **分工作目录维护**：项目级配置 `<项目根>/.dsh/@wingsky-1/dsh-mcp-manager/mcp.json` 随仓库走、可提交 git 团队共享；
  全局配置 `<DSH_HOME>/@wingsky-1/dsh-mcp-manager/mcp.json` 常连；切换会话自动加载当前目录的 MCP 集
- **工作空间隔离**：中间层按调用方会话**活动目录快照**路由到对应连接池（每次调用开始取
  一次快照并在本次调用内固定），server 全名一致性校验防跨空间串台；不同目录注入同名
  server 也互不冲突
- **安全的默认值**：配置只存 `${ENV}` 引用、不落盘密钥本身（0600 权限 + 原子写入）；
  stdio 子进程环境净化，宿主凭据形状变量不透传；目录摘要与错误路径经 redactor 脱敏
- **运维省心**：运行中/连接中/失败等分级状态一目了然；断线有界指数退避自动重连；
  调用超时可按 server 覆盖（`toolCallTimeoutMs`），中间层调用按在用服务器的最大值 + 25s
  内部尾结算（默认 15s + 25s = 40s）

## 安装

前提：已安装 DeepSeek Harness 且 `dsh web` 可正常启动（未全局安装 dsh 见下方「未全局安装 dsh」）。

### 安装插件（add）

```sh
dsh plugin --profile web add @wingsky-1/dsh-mcp-manager
```

### 卸载插件（remove）

```sh
dsh plugin --profile web remove @wingsky-1/dsh-mcp-manager
```

````

</details>

**依据 2 · 源码核查**：[packages/dsh-mcp-manager/src/index.ts:1-60](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager/src/index.ts#L1-L60)

插件入口装配宿主 API、catalog 和客户端。

<details>
<summary>查看原文（60行）</summary>

```text
/**
 * dsh-mcp-manager — 主机端（组合根）。
 *
 * 管理本机的 MCP（Model Context Protocol）服务器并桥接到 DSH：
 *  - 服务器配置持久化在本插件私有目录（路径与权限的单一事实源是 server/shared/paths.ts，
 *    版本化，原子写入）；
 *  - 连接与协议交官方 @deepseek-ai/dsh-mcp-client（经宿主 cordis loader 按包名装载，
 *    stdio / streamable-http 两种传输），本插件只留配置面与模型可见面；有界退避重连由
 *    官方插件承担（自研连接栈已随 #767 S1-5c 整体退役）；
 *  - 每个已连接服务器的工具以 mcp__<id>__<rawName> 注册进 ctx.tools（与官方 dsh-mcp-client
 *    的装载路径同形）；`id` 是本次装配按 (工作空间, 服务器名) 现分配的不透明短串，`/api/dsh-mcp/servers`
 *    的 summary.tools 才是注册名以外的裸名口径；
 *  - /api/dsh-mcp/* 路由（loopback-only）供 web GUI 分级展示、快速接入、粘贴
 *    mcpServers JSON 导入；
 *  - 零运行时依赖：官方客户端不随包分发（不经 import 值引用，避免打包副本），由宿主
 *    解析到 dsh 安装内的副本。
 *
 * 激活：安装进 profile（见 cordis.patch.yml 注释），重启一次 dsh web 后，侧边栏出现
 * 「MCP」入口。
 *
 * 结构：#767 W11a 起本文件是唯一的组合根与 apply 装配体——静态端口的模块求值期装配、
 * apply 主流程与配置解析、存量存储迁移的接线、包导出面与声明合并都在这里（原
 * src/bootstrap/** 六文件并入；src 顶层只允许 client / index.ts / server / shared 四项）。
 * 各落点域端口化之后才谈把它再拆出去。
 */

// 类型面加载（declare module 合并）：dsh-agent 注入 agent/* 事件（含 pre-step
// waterfall）、dsh-tools 注入 ctx.tools、dsh-system-prompt 注入 ctx.systemPrompt。
import type { PreStepDecision } from "@deepseek-ai/dsh-agent";
import type {} from "@deepseek-ai/dsh-system-prompt";
import type {} from "@deepseek-ai/dsh-tools";
import type { Context } from "@deepseek-ai/cordis";
import { dirname } from "node:path";
import { installSettingsNamespace } from "../../../shared/settings-namespace.js";
import {
  liveConnectionAdmission,
  liveConnectionPeerAdmission,
  sseData,
} from "../../../shared/host-utils.js";
import type { McpManagerService } from "./shared/interface.ts";
import { installOrchestrator, McpManager } from "./server/connection/orchestrator/interface.ts";
import * as apiApi from "./server/api/interface.ts";
import {
  makeEventsRouteWithAccess,
  makeHealthRouteWithAccess,
  makeRoutesWithAccess,
  uiConfigChangedFrame,
} from "./server/api/interface.ts";
import * as catalogApi from "./server/catalog/interface.ts";
import {
  DEFAULT_ANNOUNCE_CATALOG,
  DEFAULT_CATALOG_MAX_ENTRIES,
  resolveCatalogInjection,
} from "./server/catalog/interface.ts";
import type {
  CatalogAgent,
  CatalogDecision,
  CatalogMessage,
  SupervisorLite,
} from "./server/catalog/interface.ts";
```

</details>

**依据 3 · 源码核查**：[packages/dsh-mcp-manager/src/server/api/routes.ts:1-80](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager/src/server/api/routes.ts#L1-L80)

API 路由提供目录/服务管理通道。

<details>
<summary>查看原文（80行）</summary>

```text
/**
 * dsh-mcp-manager — HTTP 路由装配层（依赖 import 模块与仓库共享层）。
 *
 * /api/dsh-mcp/* 路由供 web GUI 分级展示、快速接入、导入 mcpServers JSON；
 * events 为 SSE 状态推送通道。loopback 保持快路径；非回环统一接官方 connection
 * admission，不复制认证算法。
 * 由 lib/index.js 组合根 re-export（ROUTES / makeRoutes）。
 *
 * #592 阶段二 Batch A 消峰：各端点 handler 已拆离至 routes-controllers.ts
 * 的独立控制器工厂（原 makeRoutes 单函数圈复杂度 84 → 装配后 <= 15）；
 * 本文件只保留 ROUTES 常量、装配函数与 SSE/health 工厂（SSE/health 原本
 * 即独立工厂形态，复杂度低，随装配层同文件保留）。
 */

// 辅助函数统一来自仓库共享层（loopback 围栏 / writeJson / readJsonBody / sseData）。

import {
  admitLongLivedRequest,
  bindPeerLifecycle,
  guardLoopbackMethod,
  sseData,
  writeJson,
} from "../../../../../shared/host-utils.js";
import { createSseHub } from "../../../../../shared/sse-hub.js";
import type { SseHub } from "../../../../../shared/sse-hub.js";
import { ROUTES, SSE_FRAMES, SERVER_STATES } from "../../shared/interface.ts";
import type { SseFramePayload } from "../../shared/interface.ts";
import type { RoutesManager } from "../connection/interface.ts";
import type { WebRoute } from "@deepseek-ai/dsh-host-webserver";
import type { ServerResponse } from "node:http";
import {
  buildConfigRoute,
  buildServersRoute,
  buildSessionRoute,
  buildResumeRoute,
  buildConnectRoute,
  buildDisconnectRoute,
  buildReconnectRoute,
  buildImportJsonRoute,
  buildToolDisableRoute,
  type RouteAccess,
  type RouteHelpers,
} from "./routes-controllers.ts";
import { queryParam } from "./routes-helpers.ts";
import { apiPorts } from "./impl/service/index.ts";

// ------------------------------------------------------------ HTTP 路由

// 路由路径清单的物理定义在 shared/routes.ts（两端同一份）；此处只转出，
// api/interface.ts 与包入口的导出面不变。
export { ROUTES };

export { queryParam };

/** 组装 /api/dsh-mcp/* 路由。cwd 参数仅用于兼容旧调用（不再被路由使用）。 */
export function makeRoutes(manager: RoutesManager, _cwd = process.cwd()): WebRoute[] {
  return makeRoutesWithAccess(manager, _cwd);
}

/** API 域内部入口：组合根注入官方动态 admission，不进入包根公开 ABI。 */
export function makeRoutesWithAccess(
  manager: RoutesManager,
  _cwd = process.cwd(),
  access: RouteAccess = {},
): WebRoute[] {
  /** 统一错误边界（#770-A2）：全部控制器经 helpers.handleError 收口，文案先经
   * manager.redactError 脱敏（C 快照：全局 store + 全部 projectStores 缓存 +
   * runtimeRegistry，含 disabled/unconnected；400 校验类错误无秘密，脱敏恒等无害）。
   * 缺省回落原文：外部 RoutesManager 实现未提供时自身无秘密可泄；脱敏实现抛错
   * 同样回落原文（错误边界自身不得再抛）。 */
  const handleError = (res: Parameters<WebRoute["handler"]>[1], error: unknown) => {
    let message: string;
    try {
      message =
        typeof manager.redactError === "function"
          ? manager.redactError(error)
          : error instanceof Error
            ? error.message
            : String(error);
    } catch {
```

</details>

**依据 4 · 源码核查**：[packages/dsh-mcp-manager/src/index.ts:406-425](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager/src/index.ts#L406-L425)

实际注册管理、健康与 SSE 路由，并在卸载时撤回。

<details>
<summary>查看原文（20行）</summary>

```text
function setupRoutesAndBroadcast(ctx: Context, manager: McpManager): () => void {
  // 两类源都只闭包 Context；每次请求/连接现取 ctx.connection，不缓存 service。
  const remoteAdmission = liveConnectionAdmission(ctx);
  const remotePeerAdmission = liveConnectionPeerAdmission(ctx);
  const routes = makeRoutesWithAccess(manager, undefined, { remoteAdmission });
  const eventsRoute = makeEventsRouteWithAccess(manager, { remotePeerAdmission });
  const healthRoute = makeHealthRouteWithAccess(manager, { remoteAdmission });
  const disposers = [...routes, eventsRoute, healthRoute].map((route) =>
    ctx.webServer.register(route),
  );
  const unsubscribeStatus = manager.onStatus(() => {
    manager.sseHub?.broadcast(sseData({ type: SSE_FRAMES.summary } satisfies SseFramePayload));
  });
  return () => {
    unsubscribeStatus();
    for (const dispose of disposers) dispose();
    // #515：hub.dispose() 统一停心跳 + destroy 全部连接（幂等，不依赖
    // close 事件异步时序）；取代旧 sseHeartbeatCleanups 逐连接清理。
    manager.sseHub?.dispose();
    manager.sseHub = undefined;
```

</details>

**依据 5 · 源码核查**：[packages/dsh-mcp-manager/src/server/api/routes-controllers.ts:149-194](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager/src/server/api/routes-controllers.ts#L149-L194)

POST 进入应用管理器，从负载确定作用域后新增服务器，回投影摘要。

<details>
<summary>查看原文（46行）</summary>

```text
/** 服务器集合变更（POST 添加 / PATCH 更新 / DELETE 删除）：写操作面，与 GET 快照分离。
 *
 * 回答「如何变更集合？」——读快照（GET）留在 handler 内，方法分流后写操作整体下沉。
 * 返回 true 表示已处理并应答；false 表示方法不在写集合内（调用方继续 405）。 */
async function handleServersMutation(
  method: string,
  url: URL,
  req: Req,
  res: Res,
  manager: RoutesManager,
  helpers: RouteHelpers,
): Promise<boolean> {
  if (method === "POST") {
    await createServer(req, res, manager, helpers);
    return true;
  }
  if (method !== "PATCH" && method !== "DELETE") return false;
  const name = requireNameParam(url, res);
  if (name === undefined) return true;
  await changeServer(method, name, url, req, res, manager, helpers);
  return true;
}

/** POST /servers：新增单台（201 + 投影 + 快照）。 */
async function createServer(
  req: Req,
  res: Res,
  manager: RoutesManager,
  helpers: RouteHelpers,
): Promise<void> {
  const body = await readJsonBody(req);
  if (body === undefined) {
    writeJson(res, 400, { error: "invalid JSON body" });
    return;
  }
  const { workspace } = apiPorts.get();
  try {
    const rec = body as Record<string, unknown>;
    const scope = workspace.normalizeScope(rec.scope as string);
    if (typeof rec.cwd === "string" && rec.cwd !== "") await manager.setSession(rec.cwd);
    const created = await manager.add(rec, scope);
    // #770-L3 只读投影：200 响应 server 字段不再明文回显写路径原文（与 A3 同一红线伞）。
    // 缺省回落原文：外部 RoutesManager 实现未提供 summarize 时自身无秘密可泄（同 redactError 兼容口径）。
    const server =
      typeof manager.summarize === "function" ? manager.summarize(created, scope) : created;
    writeJson(res, 201, { server, summary: manager.summary() });
```

</details>

#### 缺口

- 没有真实 MCP 服务安装/运行任务和手工基线对照。
  **影响**：采用价值和误配置率未知
  **进一步探讨**：用两类本地测试服务比较手工配置与界面流程。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 服务目录/API/客户端如何连接，运行时需要什么依赖？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

入口以宿主 webServer/connection 等服务装配 API 与目录域，客户端调用本地管理路由展示 MCP server catalog 并执行管理操作。目录实现提供条目/缓存/历史/搜索模块；运行依赖 DSH、MCP 配置与 server 进程环境。界面可发起操作，但不代表 server 启动或外部工具调用成功。

代表性写入是 POST /servers：解析 JSON、归一 scope、可按 cwd 选择会话后调用 manager.add，并返回 201 和投影。PATCH 或 DELETE 另按请求解析并固定目标项目根。响应只确认请求所处阶段，仍须核对连接和工具调用状态。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-mcp-manager/src/index.ts:1-90](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager/src/index.ts#L1-L90)

入口装配 Web 客户端和服务 API。

<details>
<summary>查看原文（90行）</summary>

```text
/**
 * dsh-mcp-manager — 主机端（组合根）。
 *
 * 管理本机的 MCP（Model Context Protocol）服务器并桥接到 DSH：
 *  - 服务器配置持久化在本插件私有目录（路径与权限的单一事实源是 server/shared/paths.ts，
 *    版本化，原子写入）；
 *  - 连接与协议交官方 @deepseek-ai/dsh-mcp-client（经宿主 cordis loader 按包名装载，
 *    stdio / streamable-http 两种传输），本插件只留配置面与模型可见面；有界退避重连由
 *    官方插件承担（自研连接栈已随 #767 S1-5c 整体退役）；
 *  - 每个已连接服务器的工具以 mcp__<id>__<rawName> 注册进 ctx.tools（与官方 dsh-mcp-client
 *    的装载路径同形）；`id` 是本次装配按 (工作空间, 服务器名) 现分配的不透明短串，`/api/dsh-mcp/servers`
 *    的 summary.tools 才是注册名以外的裸名口径；
 *  - /api/dsh-mcp/* 路由（loopback-only）供 web GUI 分级展示、快速接入、粘贴
 *    mcpServers JSON 导入；
 *  - 零运行时依赖：官方客户端不随包分发（不经 import 值引用，避免打包副本），由宿主
 *    解析到 dsh 安装内的副本。
 *
 * 激活：安装进 profile（见 cordis.patch.yml 注释），重启一次 dsh web 后，侧边栏出现
 * 「MCP」入口。
 *
 * 结构：#767 W11a 起本文件是唯一的组合根与 apply 装配体——静态端口的模块求值期装配、
 * apply 主流程与配置解析、存量存储迁移的接线、包导出面与声明合并都在这里（原
 * src/bootstrap/** 六文件并入；src 顶层只允许 client / index.ts / server / shared 四项）。
 * 各落点域端口化之后才谈把它再拆出去。
 */

// 类型面加载（declare module 合并）：dsh-agent 注入 agent/* 事件（含 pre-step
// waterfall）、dsh-tools 注入 ctx.tools、dsh-system-prompt 注入 ctx.systemPrompt。
import type { PreStepDecision } from "@deepseek-ai/dsh-agent";
import type {} from "@deepseek-ai/dsh-system-prompt";
import type {} from "@deepseek-ai/dsh-tools";
import type { Context } from "@deepseek-ai/cordis";
import { dirname } from "node:path";
import { installSettingsNamespace } from "../../../shared/settings-namespace.js";
import {
  liveConnectionAdmission,
  liveConnectionPeerAdmission,
  sseData,
} from "../../../shared/host-utils.js";
import type { McpManagerService } from "./shared/interface.ts";
import { installOrchestrator, McpManager } from "./server/connection/orchestrator/interface.ts";
import * as apiApi from "./server/api/interface.ts";
import {
  makeEventsRouteWithAccess,
  makeHealthRouteWithAccess,
  makeRoutesWithAccess,
  uiConfigChangedFrame,
} from "./server/api/interface.ts";
import * as catalogApi from "./server/catalog/interface.ts";
import {
  DEFAULT_ANNOUNCE_CATALOG,
  DEFAULT_CATALOG_MAX_ENTRIES,
  resolveCatalogInjection,
} from "./server/catalog/interface.ts";
import type {
  CatalogAgent,
  CatalogDecision,
  CatalogMessage,
  SupervisorLite,
} from "./server/catalog/interface.ts";
import * as configModelApi from "./server/config/interface.ts";
import { Config } from "./server/config/interface.ts";
import * as dispatchApi from "./server/servers/dispatch/interface.ts";
import * as lifecycleApi from "./server/servers/lifecycle/interface.ts";
import {
  installLifecycle,
  mountLedger,
  releaseLifecycle,
} from "./server/servers/lifecycle/interface.ts";
import * as pipelineApi from "./server/pipeline/interface.ts";
import * as runtimeApi from "./server/connection/runtime/interface.ts";
import * as statsApi from "./server/stats/interface.ts";
import type { DebugConfig } from "./server/stats/interface.ts";
import * as storeApi from "./server/store/interface.ts";
import { defaultStorePath, McpStore } from "./server/store/interface.ts";
import {
  installInject,
  registerMiddlewareTools,
  resolveMiddlewareCallTimeoutMs,
} from "./server/inject/interface.ts";
import { installUpgrade, releaseUpgrade } from "./server/upgrade/interface.ts";
import * as upgradeApi from "./server/upgrade/interface.ts";
import { bindHost, type HostFaces } from "./server/shared/interface.ts";
import { startAgentVisibility } from "./server/visibility/interface.ts";
import { startSdkErasure } from "./server/erasure/interface.ts";
import { MCP_MANAGER_IDENTITY, SSE_FRAMES } from "./shared/interface.ts";
import type { McpServerSummary, SseFramePayload } from "./shared/interface.ts";
import { makeResolveRoot, makeServerIdTable } from "./server/workspace/interface.ts";
import * as workspaceApi from "./server/workspace/interface.ts";

```

</details>

**依据 2 · 源码核查**：[packages/dsh-mcp-manager/src/server/api/routes.ts:1-100](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager/src/server/api/routes.ts#L1-L100)

API 路由把宿主请求映射到服务控制器。

<details>
<summary>查看原文（100行）</summary>

```text
/**
 * dsh-mcp-manager — HTTP 路由装配层（依赖 import 模块与仓库共享层）。
 *
 * /api/dsh-mcp/* 路由供 web GUI 分级展示、快速接入、导入 mcpServers JSON；
 * events 为 SSE 状态推送通道。loopback 保持快路径；非回环统一接官方 connection
 * admission，不复制认证算法。
 * 由 lib/index.js 组合根 re-export（ROUTES / makeRoutes）。
 *
 * #592 阶段二 Batch A 消峰：各端点 handler 已拆离至 routes-controllers.ts
 * 的独立控制器工厂（原 makeRoutes 单函数圈复杂度 84 → 装配后 <= 15）；
 * 本文件只保留 ROUTES 常量、装配函数与 SSE/health 工厂（SSE/health 原本
 * 即独立工厂形态，复杂度低，随装配层同文件保留）。
 */

// 辅助函数统一来自仓库共享层（loopback 围栏 / writeJson / readJsonBody / sseData）。

import {
  admitLongLivedRequest,
  bindPeerLifecycle,
  guardLoopbackMethod,
  sseData,
  writeJson,
} from "../../../../../shared/host-utils.js";
import { createSseHub } from "../../../../../shared/sse-hub.js";
import type { SseHub } from "../../../../../shared/sse-hub.js";
import { ROUTES, SSE_FRAMES, SERVER_STATES } from "../../shared/interface.ts";
import type { SseFramePayload } from "../../shared/interface.ts";
import type { RoutesManager } from "../connection/interface.ts";
import type { WebRoute } from "@deepseek-ai/dsh-host-webserver";
import type { ServerResponse } from "node:http";
import {
  buildConfigRoute,
  buildServersRoute,
  buildSessionRoute,
  buildResumeRoute,
  buildConnectRoute,
  buildDisconnectRoute,
  buildReconnectRoute,
  buildImportJsonRoute,
  buildToolDisableRoute,
  type RouteAccess,
  type RouteHelpers,
} from "./routes-controllers.ts";
import { queryParam } from "./routes-helpers.ts";
import { apiPorts } from "./impl/service/index.ts";

// ------------------------------------------------------------ HTTP 路由

// 路由路径清单的物理定义在 shared/routes.ts（两端同一份）；此处只转出，
// api/interface.ts 与包入口的导出面不变。
export { ROUTES };

export { queryParam };

/** 组装 /api/dsh-mcp/* 路由。cwd 参数仅用于兼容旧调用（不再被路由使用）。 */
export function makeRoutes(manager: RoutesManager, _cwd = process.cwd()): WebRoute[] {
  return makeRoutesWithAccess(manager, _cwd);
}

/** API 域内部入口：组合根注入官方动态 admission，不进入包根公开 ABI。 */
export function makeRoutesWithAccess(
  manager: RoutesManager,
  _cwd = process.cwd(),
  access: RouteAccess = {},
): WebRoute[] {
  /** 统一错误边界（#770-A2）：全部控制器经 helpers.handleError 收口，文案先经
   * manager.redactError 脱敏（C 快照：全局 store + 全部 projectStores 缓存 +
   * runtimeRegistry，含 disabled/unconnected；400 校验类错误无秘密，脱敏恒等无害）。
   * 缺省回落原文：外部 RoutesManager 实现未提供时自身无秘密可泄；脱敏实现抛错
   * 同样回落原文（错误边界自身不得再抛）。 */
  const handleError = (res: Parameters<WebRoute["handler"]>[1], error: unknown) => {
    let message: string;
    try {
      message =
        typeof manager.redactError === "function"
          ? manager.redactError(error)
          : error instanceof Error
            ? error.message
            : String(error);
    } catch {
      message = error instanceof Error ? error.message : String(error);
    }
    writeJson(res, 400, { error: message });
  };
  /**
   * 解析 scope 查询参数（缺省 global）。
   *
   * #767 S1-5b：缺省/非法值一律经 workspace 域归一化再下传。归一化前空串会让「缺 scope」的
   * 直呼落进另一条引擎分支，注册名与 userDisabled 清理都与显式 `scope=global` 分叉
   * （S1-4d-3 实测建档）。五条吃 scope 的路由（connect/disconnect/reconnect/remove/update）
   * 由这一处同时受益；disconnect 内的 normalizeScope 因此成为幂等冗余。
   */
  const scopeParam = (url: URL) =>
    apiPorts.get().workspace.normalizeScope(queryParam(url, "scope") ?? "");
  /** 若带 cwd 参数则先切换会话（跟随会话的项目级 MCP）。 */
  const maybeSession = async (url: URL): Promise<void> => {
    const cwdParam = queryParam(url, "cwd");
    if (cwdParam !== undefined && cwdParam !== "") await manager.setSession(cwdParam);
  };
  const helpers: RouteHelpers = {
```

</details>

**依据 3 · 源码核查**：[packages/dsh-mcp-manager/src/server/catalog/impl/service/index.ts:1-42](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager/src/server/catalog/impl/service/index.ts#L1-L42)

目录域依赖由组合根显式安装一次。

<details>
<summary>查看原文（42行）</summary>

```text
/**
 * dsh-mcp-manager — catalog/impl/service/index.ts：目录域端口持有者（#767 B2a-wire W4）。
 *
 * 域内实现经 `catalogPorts.get()` 取数，写入只发生在组合根入口顶层的 `installCatalog`
 * （见 `src/index.ts`）。形态照 `server/upgrade/impl/service/` 的 runner：模块级只有一个
 * `const` 实例、状态收进实例字段（I9），装配与复位只经方法（方法内赋值）。
 */
import type { CatalogDeps } from "../../deps.ts";

/** 目录域端口表：装配一次、域内多处读。 */
class CatalogPorts {
  /** 未装配时保持 undefined——「没装配」与「装配了空实现」必须可区分（I6）。 */
  private deps: CatalogDeps | undefined;

  /** 装配：组合根递入静态模块引用；重复装配是编程错误，当场暴露。 */
  install(deps: CatalogDeps): void {
    if (this.deps !== undefined) throw new Error("dsh-mcp-manager: catalog 域只能装配一次");
    this.deps = deps;
  }

  /** 卸载：只复位装配标记，本域没有别的活资源要释放。 */
  release(): void {
    this.deps = undefined;
  }

  /**
   * 域内取数的唯一入口。未装配即抛错而不是回落默认值：默认值会让「组合根漏装」表现成
   * 行为正常但参数不对（目录 TTL 与检索/装箱限额静默换值），症状与本插件毫无字面关联。
   */
  get(): CatalogDeps {
    const deps = this.deps;
    if (deps === undefined) {
      throw new Error(
        "dsh-mcp-manager: catalog 域未装配——组合根未在入口调用 installCatalog（src/index.ts）",
      );
    }
    return deps;
  }
}

/** 本域唯一的装配实例：类不外放，外部 new 不出第二份端口表。 */
export const catalogPorts = new CatalogPorts();
```

</details>

**依据 4 · 作者声明**：[packages/dsh-mcp-manager/README.md:35-75](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager/README.md#L35-L75)

文档说明使用条件和操作。

<details>
<summary>查看原文（41行）</summary>

````text

> 安装 / 卸载 / 更新后都需**重启一次** `dsh web`（bundle 层只在启动时组合）生效。

## 核心优势

- **上下文成本可控**：全部 MCP 经中间层收敛，模型面只占 `ws_mcp_list` /
  `ws_mcp_detail` / `ws_mcp_search` / `ws_mcp_call` 四个原子工具位——接多少台
  服务器、多少个工具都不膨胀系统提示词（两级发现：`ws_mcp_list` 完整盘点 →
  `ws_mcp_detail` 按需拉完整 schema）
- **分工作目录维护**：项目级配置 `<项目根>/.dsh/@wingsky-1/dsh-mcp-manager/mcp.json` 随仓库走、可提交 git 团队共享；
  全局配置 `<DSH_HOME>/@wingsky-1/dsh-mcp-manager/mcp.json` 常连；切换会话自动加载当前目录的 MCP 集
- **工作空间隔离**：中间层按调用方会话**活动目录快照**路由到对应连接池（每次调用开始取
  一次快照并在本次调用内固定），server 全名一致性校验防跨空间串台；不同目录注入同名
  server 也互不冲突
- **安全的默认值**：配置只存 `${ENV}` 引用、不落盘密钥本身（0600 权限 + 原子写入）；
  stdio 子进程环境净化，宿主凭据形状变量不透传；目录摘要与错误路径经 redactor 脱敏
- **运维省心**：运行中/连接中/失败等分级状态一目了然；断线有界指数退避自动重连；
  调用超时可按 server 覆盖（`toolCallTimeoutMs`），中间层调用按在用服务器的最大值 + 25s
  内部尾结算（默认 15s + 25s = 40s）

## 安装

前提：已安装 DeepSeek Harness 且 `dsh web` 可正常启动（未全局安装 dsh 见下方「未全局安装 dsh」）。

### 安装插件（add）

```sh
dsh plugin --profile web add @wingsky-1/dsh-mcp-manager
```

### 卸载插件（remove）

```sh
dsh plugin --profile web remove @wingsky-1/dsh-mcp-manager
```

### 更新插件（update）

```sh
dsh plugin --profile web update @wingsky-1/dsh-mcp-manager
```
````

</details>

**依据 5 · 源码核查**：[packages/dsh-mcp-manager/src/index.ts:406-425](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager/src/index.ts#L406-L425)

实际将管理器状态变化广播给 SSE 客户端。

<details>
<summary>查看原文（20行）</summary>

```text
function setupRoutesAndBroadcast(ctx: Context, manager: McpManager): () => void {
  // 两类源都只闭包 Context；每次请求/连接现取 ctx.connection，不缓存 service。
  const remoteAdmission = liveConnectionAdmission(ctx);
  const remotePeerAdmission = liveConnectionPeerAdmission(ctx);
  const routes = makeRoutesWithAccess(manager, undefined, { remoteAdmission });
  const eventsRoute = makeEventsRouteWithAccess(manager, { remotePeerAdmission });
  const healthRoute = makeHealthRouteWithAccess(manager, { remoteAdmission });
  const disposers = [...routes, eventsRoute, healthRoute].map((route) =>
    ctx.webServer.register(route),
  );
  const unsubscribeStatus = manager.onStatus(() => {
    manager.sseHub?.broadcast(sseData({ type: SSE_FRAMES.summary } satisfies SseFramePayload));
  });
  return () => {
    unsubscribeStatus();
    for (const dispose of disposers) dispose();
    // #515：hub.dispose() 统一停心跳 + destroy 全部连接（幂等，不依赖
    // close 事件异步时序）；取代旧 sseHeartbeatCleanups 逐连接清理。
    manager.sseHub?.dispose();
    manager.sseHub = undefined;
```

</details>

**依据 6 · 源码核查**：[packages/dsh-mcp-manager/src/server/api/routes-controllers.ts:172-216](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager/src/server/api/routes-controllers.ts#L172-L216)

新增时按 scope、cwd 建立上下文，删除时固定请求目标项目根。

<details>
<summary>查看原文（45行）</summary>

```text
/** POST /servers：新增单台（201 + 投影 + 快照）。 */
async function createServer(
  req: Req,
  res: Res,
  manager: RoutesManager,
  helpers: RouteHelpers,
): Promise<void> {
  const body = await readJsonBody(req);
  if (body === undefined) {
    writeJson(res, 400, { error: "invalid JSON body" });
    return;
  }
  const { workspace } = apiPorts.get();
  try {
    const rec = body as Record<string, unknown>;
    const scope = workspace.normalizeScope(rec.scope as string);
    if (typeof rec.cwd === "string" && rec.cwd !== "") await manager.setSession(rec.cwd);
    const created = await manager.add(rec, scope);
    // #770-L3 只读投影：200 响应 server 字段不再明文回显写路径原文（与 A3 同一红线伞）。
    // 缺省回落原文：外部 RoutesManager 实现未提供 summarize 时自身无秘密可泄（同 redactError 兼容口径）。
    const server =
      typeof manager.summarize === "function" ? manager.summarize(created, scope) : created;
    writeJson(res, 201, { server, summary: manager.summary() });
  } catch (error) {
    helpers.handleError(res, error);
  }
}

/** PATCH /servers（更新）/ DELETE /servers（移除）：按请求固定目标项目根。 */
async function changeServer(
  method: string,
  name: string,
  url: URL,
  req: Req,
  res: Res,
  manager: RoutesManager,
  helpers: RouteHelpers,
): Promise<void> {
  try {
    const scope = helpers.scopeParam(url);
    const cwd = queryParam(url, "cwd");
    const root = await manager.rootForRequest(scope, cwd);
    if (method === "DELETE") {
      await manager.remove(name, scope, scope === SCOPE_PROJECT ? root : cwd);
      writeJson(res, 200, { ok: true, summary: manager.summaryForRoot(root) });
```

</details>

**依据 7 · 源码核查**：[packages/dsh-mcp-manager/src/server/api/routes-controllers.ts:224-233](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager/src/server/api/routes-controllers.ts#L224-L233)

更新按已解析作用域写入，再生成面向客户端的状态投影。

<details>
<summary>查看原文（10行）</summary>

```text
    const updated = await manager.update(
      name,
      body as Record<string, unknown>,
      scope,
      scope === SCOPE_PROJECT ? root : cwd,
    );
    // #770-L3 只读投影：同 POST 分支（与 A3 同一红线伞；缺省回落原文口径同上）。
    const server = manager.summarizeForRoot(updated, scope, root);
    const status = typeof (body as Record<string, unknown>).enabled === "boolean" ? 202 : 200;
    writeJson(res, status, { server, summary: manager.summaryForRoot(root) });
```

</details>

#### 缺口

- 本轮未安装或启动任一 MCP server，未验证凭据/协议兼容。
  **影响**：不能判断安装成功、权限和网络可达
  **进一步探讨**：在隔离 profile 使用无凭据 demo server 验证启动/停止/错误显示。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 服务包来源、凭据和生命周期有哪些风险？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

MCP server 可访问其宿主进程获准的工具/网络/文件资源；目录元数据不能代替代码审查。管理器的安装/启动操作可能执行第三方包，需核对来源、参数、凭据暴露及停止后子进程清理。API 服务与客户端是管理面，认证/路由 fence 和 profile 隔离必须按源码验证，不能假设 LAN 或本机请求可信。

回环请求仍需通过本地围栏；非回环先交给 Connection admission，服务缺失、抛错或返回未知值走 403，明确 401/403 保留。连配置 GET 也先过这层。远端 SSE 另依赖有效 Peer，并随 Peer 生命周期断开。 stdio 的读取投影省略环境变量并遮蔽部分参数，HTTP 投影省略头并脱敏 URL；这只限制摘要字段，第三方进程及持久配置仍需单独检视。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-mcp-manager/src/server/api/routes.ts:1-100](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager/src/server/api/routes.ts#L1-L100)

管理 API 路由结构和入口。

<details>
<summary>查看原文（100行）</summary>

```text
/**
 * dsh-mcp-manager — HTTP 路由装配层（依赖 import 模块与仓库共享层）。
 *
 * /api/dsh-mcp/* 路由供 web GUI 分级展示、快速接入、导入 mcpServers JSON；
 * events 为 SSE 状态推送通道。loopback 保持快路径；非回环统一接官方 connection
 * admission，不复制认证算法。
 * 由 lib/index.js 组合根 re-export（ROUTES / makeRoutes）。
 *
 * #592 阶段二 Batch A 消峰：各端点 handler 已拆离至 routes-controllers.ts
 * 的独立控制器工厂（原 makeRoutes 单函数圈复杂度 84 → 装配后 <= 15）；
 * 本文件只保留 ROUTES 常量、装配函数与 SSE/health 工厂（SSE/health 原本
 * 即独立工厂形态，复杂度低，随装配层同文件保留）。
 */

// 辅助函数统一来自仓库共享层（loopback 围栏 / writeJson / readJsonBody / sseData）。

import {
  admitLongLivedRequest,
  bindPeerLifecycle,
  guardLoopbackMethod,
  sseData,
  writeJson,
} from "../../../../../shared/host-utils.js";
import { createSseHub } from "../../../../../shared/sse-hub.js";
import type { SseHub } from "../../../../../shared/sse-hub.js";
import { ROUTES, SSE_FRAMES, SERVER_STATES } from "../../shared/interface.ts";
import type { SseFramePayload } from "../../shared/interface.ts";
import type { RoutesManager } from "../connection/interface.ts";
import type { WebRoute } from "@deepseek-ai/dsh-host-webserver";
import type { ServerResponse } from "node:http";
import {
  buildConfigRoute,
  buildServersRoute,
  buildSessionRoute,
  buildResumeRoute,
  buildConnectRoute,
  buildDisconnectRoute,
  buildReconnectRoute,
  buildImportJsonRoute,
  buildToolDisableRoute,
  type RouteAccess,
  type RouteHelpers,
} from "./routes-controllers.ts";
import { queryParam } from "./routes-helpers.ts";
import { apiPorts } from "./impl/service/index.ts";

// ------------------------------------------------------------ HTTP 路由

// 路由路径清单的物理定义在 shared/routes.ts（两端同一份）；此处只转出，
// api/interface.ts 与包入口的导出面不变。
export { ROUTES };

export { queryParam };

/** 组装 /api/dsh-mcp/* 路由。cwd 参数仅用于兼容旧调用（不再被路由使用）。 */
export function makeRoutes(manager: RoutesManager, _cwd = process.cwd()): WebRoute[] {
  return makeRoutesWithAccess(manager, _cwd);
}

/** API 域内部入口：组合根注入官方动态 admission，不进入包根公开 ABI。 */
export function makeRoutesWithAccess(
  manager: RoutesManager,
  _cwd = process.cwd(),
  access: RouteAccess = {},
): WebRoute[] {
  /** 统一错误边界（#770-A2）：全部控制器经 helpers.handleError 收口，文案先经
   * manager.redactError 脱敏（C 快照：全局 store + 全部 projectStores 缓存 +
   * runtimeRegistry，含 disabled/unconnected；400 校验类错误无秘密，脱敏恒等无害）。
   * 缺省回落原文：外部 RoutesManager 实现未提供时自身无秘密可泄；脱敏实现抛错
   * 同样回落原文（错误边界自身不得再抛）。 */
  const handleError = (res: Parameters<WebRoute["handler"]>[1], error: unknown) => {
    let message: string;
    try {
      message =
        typeof manager.redactError === "function"
          ? manager.redactError(error)
          : error instanceof Error
            ? error.message
            : String(error);
    } catch {
      message = error instanceof Error ? error.message : String(error);
    }
    writeJson(res, 400, { error: message });
  };
  /**
   * 解析 scope 查询参数（缺省 global）。
   *
   * #767 S1-5b：缺省/非法值一律经 workspace 域归一化再下传。归一化前空串会让「缺 scope」的
   * 直呼落进另一条引擎分支，注册名与 userDisabled 清理都与显式 `scope=global` 分叉
   * （S1-4d-3 实测建档）。五条吃 scope 的路由（connect/disconnect/reconnect/remove/update）
   * 由这一处同时受益；disconnect 内的 normalizeScope 因此成为幂等冗余。
   */
  const scopeParam = (url: URL) =>
    apiPorts.get().workspace.normalizeScope(queryParam(url, "scope") ?? "");
  /** 若带 cwd 参数则先切换会话（跟随会话的项目级 MCP）。 */
  const maybeSession = async (url: URL): Promise<void> => {
    const cwdParam = queryParam(url, "cwd");
    if (cwdParam !== undefined && cwdParam !== "") await manager.setSession(cwdParam);
  };
  const helpers: RouteHelpers = {
```

</details>

**依据 2 · 源码核查**：[packages/dsh-mcp-manager/src/index.ts:1-90](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager/src/index.ts#L1-L90)

入口注入 Web/宿主服务。

<details>
<summary>查看原文（90行）</summary>

```text
/**
 * dsh-mcp-manager — 主机端（组合根）。
 *
 * 管理本机的 MCP（Model Context Protocol）服务器并桥接到 DSH：
 *  - 服务器配置持久化在本插件私有目录（路径与权限的单一事实源是 server/shared/paths.ts，
 *    版本化，原子写入）；
 *  - 连接与协议交官方 @deepseek-ai/dsh-mcp-client（经宿主 cordis loader 按包名装载，
 *    stdio / streamable-http 两种传输），本插件只留配置面与模型可见面；有界退避重连由
 *    官方插件承担（自研连接栈已随 #767 S1-5c 整体退役）；
 *  - 每个已连接服务器的工具以 mcp__<id>__<rawName> 注册进 ctx.tools（与官方 dsh-mcp-client
 *    的装载路径同形）；`id` 是本次装配按 (工作空间, 服务器名) 现分配的不透明短串，`/api/dsh-mcp/servers`
 *    的 summary.tools 才是注册名以外的裸名口径；
 *  - /api/dsh-mcp/* 路由（loopback-only）供 web GUI 分级展示、快速接入、粘贴
 *    mcpServers JSON 导入；
 *  - 零运行时依赖：官方客户端不随包分发（不经 import 值引用，避免打包副本），由宿主
 *    解析到 dsh 安装内的副本。
 *
 * 激活：安装进 profile（见 cordis.patch.yml 注释），重启一次 dsh web 后，侧边栏出现
 * 「MCP」入口。
 *
 * 结构：#767 W11a 起本文件是唯一的组合根与 apply 装配体——静态端口的模块求值期装配、
 * apply 主流程与配置解析、存量存储迁移的接线、包导出面与声明合并都在这里（原
 * src/bootstrap/** 六文件并入；src 顶层只允许 client / index.ts / server / shared 四项）。
 * 各落点域端口化之后才谈把它再拆出去。
 */

// 类型面加载（declare module 合并）：dsh-agent 注入 agent/* 事件（含 pre-step
// waterfall）、dsh-tools 注入 ctx.tools、dsh-system-prompt 注入 ctx.systemPrompt。
import type { PreStepDecision } from "@deepseek-ai/dsh-agent";
import type {} from "@deepseek-ai/dsh-system-prompt";
import type {} from "@deepseek-ai/dsh-tools";
import type { Context } from "@deepseek-ai/cordis";
import { dirname } from "node:path";
import { installSettingsNamespace } from "../../../shared/settings-namespace.js";
import {
  liveConnectionAdmission,
  liveConnectionPeerAdmission,
  sseData,
} from "../../../shared/host-utils.js";
import type { McpManagerService } from "./shared/interface.ts";
import { installOrchestrator, McpManager } from "./server/connection/orchestrator/interface.ts";
import * as apiApi from "./server/api/interface.ts";
import {
  makeEventsRouteWithAccess,
  makeHealthRouteWithAccess,
  makeRoutesWithAccess,
  uiConfigChangedFrame,
} from "./server/api/interface.ts";
import * as catalogApi from "./server/catalog/interface.ts";
import {
  DEFAULT_ANNOUNCE_CATALOG,
  DEFAULT_CATALOG_MAX_ENTRIES,
  resolveCatalogInjection,
} from "./server/catalog/interface.ts";
import type {
  CatalogAgent,
  CatalogDecision,
  CatalogMessage,
  SupervisorLite,
} from "./server/catalog/interface.ts";
import * as configModelApi from "./server/config/interface.ts";
import { Config } from "./server/config/interface.ts";
import * as dispatchApi from "./server/servers/dispatch/interface.ts";
import * as lifecycleApi from "./server/servers/lifecycle/interface.ts";
import {
  installLifecycle,
  mountLedger,
  releaseLifecycle,
} from "./server/servers/lifecycle/interface.ts";
import * as pipelineApi from "./server/pipeline/interface.ts";
import * as runtimeApi from "./server/connection/runtime/interface.ts";
import * as statsApi from "./server/stats/interface.ts";
import type { DebugConfig } from "./server/stats/interface.ts";
import * as storeApi from "./server/store/interface.ts";
import { defaultStorePath, McpStore } from "./server/store/interface.ts";
import {
  installInject,
  registerMiddlewareTools,
  resolveMiddlewareCallTimeoutMs,
} from "./server/inject/interface.ts";
import { installUpgrade, releaseUpgrade } from "./server/upgrade/interface.ts";
import * as upgradeApi from "./server/upgrade/interface.ts";
import { bindHost, type HostFaces } from "./server/shared/interface.ts";
import { startAgentVisibility } from "./server/visibility/interface.ts";
import { startSdkErasure } from "./server/erasure/interface.ts";
import { MCP_MANAGER_IDENTITY, SSE_FRAMES } from "./shared/interface.ts";
import type { McpServerSummary, SseFramePayload } from "./shared/interface.ts";
import { makeResolveRoot, makeServerIdTable } from "./server/workspace/interface.ts";
import * as workspaceApi from "./server/workspace/interface.ts";

```

</details>

**依据 3 · 作者声明**：[packages/dsh-mcp-manager/README.md:70-110](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager/README.md#L70-L110)

作者描述配置/服务管理边界。

<details>
<summary>查看原文（41行）</summary>

````text

### 更新插件（update）

```sh
dsh plugin --profile web update @wingsky-1/dsh-mcp-manager
```

> 安装 / 卸载 / 更新后都需**重启一次** `dsh web`（bundle 层只在启动时组合）生效。

### 指定版本号（@version）

省略 `@版本号` 即安装默认 latest（推荐）。仅当 registry 尚未同步到最新、或最新版在你的环境有问题时，在包名后追加 `@版本号`：

```sh
dsh plugin --profile web add @wingsky-1/dsh-mcp-manager@<版本号>
```

### 未全局安装 dsh

若本机没有全局 `dsh` 命令，用 `npx` 临时拉起（底层调用 `pnpm`，仍需本机装好 `pnpm` 与 `Node.js`）：

```sh
npx @deepseek-ai/dsh plugin --profile web add @wingsky-1/dsh-mcp-manager
npx @deepseek-ai/dsh plugin --profile web remove @wingsky-1/dsh-mcp-manager
npx @deepseek-ai/dsh plugin --profile web update @wingsky-1/dsh-mcp-manager
```

## 能力

| 能力 | 说明 |
| --- | --- |
| 右上角浮窗 | 状态点 + 计数摘要（`MCP 2/3`），点击展开下拉面板；随会话切换自动刷新 |
| 项目级 MCP | 服务器分「项目级 / 全局」两级：项目级存 `<项目根>/.dsh/@wingsky-1/dsh-mcp-manager/mcp.json`（随项目走、可提交 git），全局存 `<DSH_HOME>/@wingsky-1/dsh-mcp-manager/mcp.json` 常连 |
| 分级展示 | 运行中 / 连接中 / 重连中 / 未连接 / 已停用 / 失败；每台显示传输、端点、工具数；客户端未知状态按「未连接」投影、不丢卡（C13 统一口径） |
| 服务器管理 | 增删改查（可选项目级/全局）、连接 / 断开 / 重连；配置版本化 JSON，原子写入 |
| 连接请求 | 界面连接、重连和停止请求异步受理：连接期间显示「连接中」，失败后显示「失败」及错误；刷新页面或切换会话时重新读取宿主内存中的状态。宿主直接调用 `connect` 仍等待连接完成。停止是逻辑停止，不保证底层连接或进程已完全释放；这些运行状态不跨宿主进程重启保留。HTTP `202 Accepted` 表示请求已受理而非操作已完成；兼容调用方应接受所有 2xx 成功响应，并通过状态确认结果。 |
| 两种传输 | stdio（本地子进程，env 支持 `${ENV}` 引用）与 streamable-http（远程，header 支持 `${ENV}` 引用，自动回传 `Mcp-Session-Id`） |
| JSON 导入 | 粘贴 mcpServers JSON 文本导入（仅 JSON 格式；不扫描任何应用配置文件） |
| 模型工具 | 全部服务器（项目级 / 全局 / runtime 注入）一律经中间层四个原子工具访问：`ws_mcp_list` / `ws_mcp_detail` / `ws_mcp_search` / `ws_mcp_call`，不同工作空间互不冲突；宿主注册名 `mcp__<id>__<tool>`（`id` 按 (工作空间, 服务器名) 随机分配、同一次装配内稳定、不透明；工具名仍受 64 字符 / `[A-Za-z0-9_-]` / 冲突哈希后缀约束）会被从模型工具列表摘除——模型不可见、不得直呼 |
| 工作空间隔离 | 中间层按调用方会话**调用开始时的活动目录快照**路由到对应工作空间的连接池（在飞调用固定旧 root，新调用取新 root）；server 全名 `@<root>/<server>` 一致性校验防跨空间串台 |
| 断线重连 | 有界指数退避（500ms 起、30s 上限、10 次后停止后台重试；用户手动连接或 ws_mcp_call 触发可再试） |
````

</details>

**依据 4 · 源码核查**：[shared/host-utils.ts:268-279](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/shared/host-utils.ts#L268-L279)

本地需通过回环限定；非回环缺官方 admission 或发生异常一律为 403。

<details>
<summary>查看原文（12行）</summary>

```text
  if (isLoopbackPeerAddress(request)) {
    return isLoopbackRequest(request, options) ? undefined : 403;
  }

  const admission = currentRemoteSource(options.remoteAdmission);
  if (typeof admission !== "function") return 403;

  try {
    return normalizeRemoteRejection(admission(request));
  } catch {
    return 403;
  }
```

</details>

**依据 5 · 源码核查**：[shared/host-utils.ts:297-316](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/shared/host-utils.ts#L297-L316)

拒绝检查先于方法白名单，保留 401 和 403。

<details>
<summary>查看原文（20行）</summary>

```text
export function guardLoopbackMethod(
  req: IncomingMessage,
  res: ServerResponse,
  methods: string[],
  loopbackOptions?: LoopbackOptions,
): boolean {
  const rejection = routeFenceRejection(req, loopbackOptions);
  if (rejection !== undefined) {
    writeJson(res, rejection, {
      error: rejection === 401 ? "unauthorized" : "forbidden: loopback-only",
    });
    return false;
  }
  // `req.method` 在 @types/node 上是 `string | undefined`。断言不改变运行时取值：
  // 缺 method 时 includes 仍为 false，照原样落 405，不存在被误放行的分支。
  if (!methods.includes(req.method as string)) {
    writeJson(res, 405, { error: `method not allowed: ${req.method}` });
    return false;
  }
  return true;
```

</details>

**依据 6 · 源码核查**：[packages/dsh-mcp-manager/src/server/api/routes-controllers.ts:90-104](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager/src/server/api/routes-controllers.ts#L90-L104)

配置 GET 同样先走远程 admission，不能以历史只读豁免解释。

<details>
<summary>查看原文（15行）</summary>

```text
/** UI 配置读写（loopback 快路径；非回环先经官方 admission，之后才分方法和校体）。 */
export function buildConfigRoute(manager: RoutesManager, helpers: RouteHelpers): WebRoute {
  return {
    kind: "exact",
    path: ROUTES.config,
    handler: async (req: Req, res: Res) => {
      const method = String(req.method);
      const methods = [...ROUTE_FENCE.config.loopbackExempt, ...ROUTE_FENCE.config.guarded];
      // GET 的读取面、POST 的写入面和未知方法的 405 都排在认证之后。非回环 GET
      // 不再因历史只读豁免绕过官方 Host/Origin/credential admission。
      if (!guardRouteAccess(req, res, methods, helpers)) return;
      if (ROUTE_FENCE.config.loopbackExempt.includes(method)) {
        try {
          writeJson(res, 200, manager.uiConfig());
        } catch (error) {
```

</details>

**依据 7 · 源码核查**：[packages/dsh-mcp-manager/src/server/api/routes.ts:193-228](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager/src/server/api/routes.ts#L193-L228)

SSE 另要求经核实的 peer，生命周期绑定失败返回 403。

<details>
<summary>查看原文（36行）</summary>

```text
    kind: "exact",
    path: ROUTES.events,
    handler: (req, res) => {
      const admission = admitLongLivedRequest(req, {
        remotePeerAdmission: options?.remotePeerAdmission,
      });
      if ("rejection" in admission) {
        writeJson(res, admission.rejection, {
          error: admission.rejection === 401 ? "unauthorized" : "forbidden: loopback-only",
        });
        return;
      }
      if (req.method !== "GET") {
        writeJson(res, 405, { error: `method not allowed: ${req.method}` });
        return;
      }

      let lifecycleSettled = false;
      let disposePeer: (() => void) | undefined;
      const closeForPeer = () => {
        if (lifecycleSettled) return;
        lifecycleSettled = true;
        disposePeer = undefined;
        hub.unregister(res);
        if (!res.writableEnded && !res.destroyed) res.destroy();
      };
      if (admission.peer !== undefined) {
        try {
          disposePeer = bindPeerLifecycle(
            admission.peer,
            closeForPeer,
            "dsh-mcp-manager: raw SSE bound to admitted Peer",
          );
        } catch {
          writeJson(res, 403, { error: "forbidden: peer-unavailable" });
          return;
```

</details>

**依据 8 · 源码核查**：[packages/dsh-mcp-manager/src/server/connection/orchestrator/manager.ts:271-300](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager/src/server/connection/orchestrator/manager.ts#L271-L300)

配置投影省略 env 和 headers，掩码参数及 URL；不说明已删除真实存储或限制外部命令所能访问的数据。

<details>
<summary>查看原文（30行）</summary>

```text
/**
 * stdio 分支投影（ServerConfig[`transport`] 的 stdio 一侧）：command/args/cwd。
 * env 整体省略（见本块头注释）；有无秘密只经 hasSecrets 告知 GUI。
 * argsHadSecret：凭据形 flag 的参数值确被掩码过（#925，与 pipeline redact 同口径，
 * 掩码口经参数递入以便直测）；flag 名与非秘密元素保留可诊断，掩码值回写时由
 * stripProjectionPatch 丢弃。
 */
export function projectStdioFieldsForSummary(
  server: ServerConfig,
  maskSecretArgsForDisplay: (args: readonly string[]) => string[],
): { fields: Record<string, unknown>; argsHadSecret: boolean } {
  const fields: Record<string, unknown> = {};
  if (server.command !== undefined) fields.command = server.command;
  let argsHadSecret = false;
  if (server.args !== undefined) {
    const masked = maskSecretArgsForDisplay(server.args);
    fields.args = masked;
    argsHadSecret = masked.some((entry) => entry.includes("[REDACTED]"));
  }
  if (server.cwd !== undefined) fields.cwd = server.cwd;
  return { fields, argsHadSecret };
}

/** streamable-http 分支投影（ServerConfig[`transport`] 的 http 一侧）：url 按 B8 脱敏。headers 整体省略（同 env）。 */
export function projectHttpFieldsForSummary(server: ServerConfig): Record<string, unknown> {
  const fields: Record<string, unknown> = {};
  const redactedUrl = redactUrlForSummary(server.url);
  if (redactedUrl !== undefined) fields.url = redactedUrl;
  return fields;
}
```

</details>

#### 缺口

- 未审核每个 server 的权限或验证卸载时子进程/凭据处理。
  **影响**：影响是否可对不可信条目开放
  **进一步探讨**：只用已审阅 server，检查子进程环境、文件/网络权限与关闭结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时值得采用，维护和失败成本如何设定？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

适合需要多次管理 MCP 服务且有能力审核服务来源的 DSH 用户。试用仅选一个可信的本地示例，验证添加、配置、启动、错误显示、停止和移除；维护成本包括 server 版本、凭据和宿主兼容，不能以界面一键操作推断更安全或省时。若无来源审查或无法确认服务停止，应回到手工配置并停用管理入口。

用无凭据、受控的本地 MCP 示例在隔离 profile 核对添加、连接、工具、停止和按同一根删除。停用后检查局部配置、监听与子进程，管理页下线不证明进程已结束。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-mcp-manager/README.md:1-70](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager/README.md#L1-L70)

目标功能和操作范围。

<details>
<summary>查看原文（70行）</summary>

````text
# @wingsky-1/dsh-mcp-manager
[![npm](https://img.shields.io/npm/v/@wingsky-1/dsh-mcp-manager)](https://www.npmjs.com/package/@wingsky-1/dsh-mcp-manager)
[![GitHub Releases](https://img.shields.io/github/v/release/wingsky-1/dsh-plugin-hub)](https://github.com/wingsky-1/dsh-plugin-hub/releases)

DSH（DeepSeek Harness）的 **MCP 服务器管理插件**：会话界面右上角浮窗 + 分级面板 +
快速接入（手工表单 + 粘贴 mcpServers JSON 导入，**不预设任何服务器**）。
连接与协议交官方 `@deepseek-ai/dsh-mcp-client`（宿主 cordis loader 按包名装载到 dsh 安装内的副本），本插件只留配置面与模型可见面；官方客户端不随包分发，也无需额外安装。

模型可见面只有四个原子工具（`ws_mcp_list` / `ws_mcp_detail` / `ws_mcp_search` /
`ws_mcp_call`）：项目级、全局级与运行时注入的封装定义条目**一律经中间层访问**，两级发现
（`ws_mcp_list` 完整盘点 → `ws_mcp_detail` 按需拉完整 schema）；cwd 无项目时回落全局虚拟
root `@global`。宿主仍按 `mcp__<id>__<tool>` 注册工具（`id` 是本次装配按
(工作空间, 服务器名) 分配的不透明短串，不能由服务器名推导），但这些名字**会被从模型的
工具列表中摘除**，禁止直呼。
两级配置文件中的服务器列表（增删/启停/改配置）支持热加载、即时生效，无需重启。
（`middleware` / `middlewarePolicy` 两个配置键已在 #767 笔 2 废除——旧配置里写了不生效、
也不会被本插件改写。）

**项目根怎么定（#1137）**：项目级 MCP 跟随**调用 agent 在调用开始时的有效活动
workingDirectory**——每次工具调用开始时取一次目录快照，并在本次调用内固定该 root；
切目录后的新调用才采用新 root，已在飞的调用仍在旧 root 完成（或按既有取消协议取消）。
会话创建目录 `header.cwd` 只是初始项目身份，**不再**作为活动目录猜测值。没有有效活动
目录时项目级操作 fail-closed（报「无法确定工作空间」），不回退 `header.cwd` /
`process.cwd` / UI 最近 session / 另一个已连接工作区；显式 `@global` 仍可达（全局
来源存在服务器时），且**不把未知项目名偷换成同名全局服务器**。

> **升级后历史会话打不开？**
> 当前版本只生成 producer-owned V4 source；旧 source 仅通过一次性维护脚本处理，详见[升级与历史会话边界](#升级与历史会话边界)。

## 一键安装

```sh
dsh plugin --profile web add @wingsky-1/dsh-mcp-manager
```

> 安装 / 卸载 / 更新后都需**重启一次** `dsh web`（bundle 层只在启动时组合）生效。

## 核心优势

- **上下文成本可控**：全部 MCP 经中间层收敛，模型面只占 `ws_mcp_list` /
  `ws_mcp_detail` / `ws_mcp_search` / `ws_mcp_call` 四个原子工具位——接多少台
  服务器、多少个工具都不膨胀系统提示词（两级发现：`ws_mcp_list` 完整盘点 →
  `ws_mcp_detail` 按需拉完整 schema）
- **分工作目录维护**：项目级配置 `<项目根>/.dsh/@wingsky-1/dsh-mcp-manager/mcp.json` 随仓库走、可提交 git 团队共享；
  全局配置 `<DSH_HOME>/@wingsky-1/dsh-mcp-manager/mcp.json` 常连；切换会话自动加载当前目录的 MCP 集
- **工作空间隔离**：中间层按调用方会话**活动目录快照**路由到对应连接池（每次调用开始取
  一次快照并在本次调用内固定），server 全名一致性校验防跨空间串台；不同目录注入同名
  server 也互不冲突
- **安全的默认值**：配置只存 `${ENV}` 引用、不落盘密钥本身（0600 权限 + 原子写入）；
  stdio 子进程环境净化，宿主凭据形状变量不透传；目录摘要与错误路径经 redactor 脱敏
- **运维省心**：运行中/连接中/失败等分级状态一目了然；断线有界指数退避自动重连；
  调用超时可按 server 覆盖（`toolCallTimeoutMs`），中间层调用按在用服务器的最大值 + 25s
  内部尾结算（默认 15s + 25s = 40s）

## 安装

前提：已安装 DeepSeek Harness 且 `dsh web` 可正常启动（未全局安装 dsh 见下方「未全局安装 dsh」）。

### 安装插件（add）

```sh
dsh plugin --profile web add @wingsky-1/dsh-mcp-manager
```

### 卸载插件（remove）

```sh
dsh plugin --profile web remove @wingsky-1/dsh-mcp-manager
```

````

</details>

**依据 2 · 源码核查**：[packages/dsh-mcp-manager/src/server/api/routes.ts:1-100](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager/src/server/api/routes.ts#L1-L100)

管理操作经过宿主 API。

<details>
<summary>查看原文（100行）</summary>

```text
/**
 * dsh-mcp-manager — HTTP 路由装配层（依赖 import 模块与仓库共享层）。
 *
 * /api/dsh-mcp/* 路由供 web GUI 分级展示、快速接入、导入 mcpServers JSON；
 * events 为 SSE 状态推送通道。loopback 保持快路径；非回环统一接官方 connection
 * admission，不复制认证算法。
 * 由 lib/index.js 组合根 re-export（ROUTES / makeRoutes）。
 *
 * #592 阶段二 Batch A 消峰：各端点 handler 已拆离至 routes-controllers.ts
 * 的独立控制器工厂（原 makeRoutes 单函数圈复杂度 84 → 装配后 <= 15）；
 * 本文件只保留 ROUTES 常量、装配函数与 SSE/health 工厂（SSE/health 原本
 * 即独立工厂形态，复杂度低，随装配层同文件保留）。
 */

// 辅助函数统一来自仓库共享层（loopback 围栏 / writeJson / readJsonBody / sseData）。

import {
  admitLongLivedRequest,
  bindPeerLifecycle,
  guardLoopbackMethod,
  sseData,
  writeJson,
} from "../../../../../shared/host-utils.js";
import { createSseHub } from "../../../../../shared/sse-hub.js";
import type { SseHub } from "../../../../../shared/sse-hub.js";
import { ROUTES, SSE_FRAMES, SERVER_STATES } from "../../shared/interface.ts";
import type { SseFramePayload } from "../../shared/interface.ts";
import type { RoutesManager } from "../connection/interface.ts";
import type { WebRoute } from "@deepseek-ai/dsh-host-webserver";
import type { ServerResponse } from "node:http";
import {
  buildConfigRoute,
  buildServersRoute,
  buildSessionRoute,
  buildResumeRoute,
  buildConnectRoute,
  buildDisconnectRoute,
  buildReconnectRoute,
  buildImportJsonRoute,
  buildToolDisableRoute,
  type RouteAccess,
  type RouteHelpers,
} from "./routes-controllers.ts";
import { queryParam } from "./routes-helpers.ts";
import { apiPorts } from "./impl/service/index.ts";

// ------------------------------------------------------------ HTTP 路由

// 路由路径清单的物理定义在 shared/routes.ts（两端同一份）；此处只转出，
// api/interface.ts 与包入口的导出面不变。
export { ROUTES };

export { queryParam };

/** 组装 /api/dsh-mcp/* 路由。cwd 参数仅用于兼容旧调用（不再被路由使用）。 */
export function makeRoutes(manager: RoutesManager, _cwd = process.cwd()): WebRoute[] {
  return makeRoutesWithAccess(manager, _cwd);
}

/** API 域内部入口：组合根注入官方动态 admission，不进入包根公开 ABI。 */
export function makeRoutesWithAccess(
  manager: RoutesManager,
  _cwd = process.cwd(),
  access: RouteAccess = {},
): WebRoute[] {
  /** 统一错误边界（#770-A2）：全部控制器经 helpers.handleError 收口，文案先经
   * manager.redactError 脱敏（C 快照：全局 store + 全部 projectStores 缓存 +
   * runtimeRegistry，含 disabled/unconnected；400 校验类错误无秘密，脱敏恒等无害）。
   * 缺省回落原文：外部 RoutesManager 实现未提供时自身无秘密可泄；脱敏实现抛错
   * 同样回落原文（错误边界自身不得再抛）。 */
  const handleError = (res: Parameters<WebRoute["handler"]>[1], error: unknown) => {
    let message: string;
    try {
      message =
        typeof manager.redactError === "function"
          ? manager.redactError(error)
          : error instanceof Error
            ? error.message
            : String(error);
    } catch {
      message = error instanceof Error ? error.message : String(error);
    }
    writeJson(res, 400, { error: message });
  };
  /**
   * 解析 scope 查询参数（缺省 global）。
   *
   * #767 S1-5b：缺省/非法值一律经 workspace 域归一化再下传。归一化前空串会让「缺 scope」的
   * 直呼落进另一条引擎分支，注册名与 userDisabled 清理都与显式 `scope=global` 分叉
   * （S1-4d-3 实测建档）。五条吃 scope 的路由（connect/disconnect/reconnect/remove/update）
   * 由这一处同时受益；disconnect 内的 normalizeScope 因此成为幂等冗余。
   */
  const scopeParam = (url: URL) =>
    apiPorts.get().workspace.normalizeScope(queryParam(url, "scope") ?? "");
  /** 若带 cwd 参数则先切换会话（跟随会话的项目级 MCP）。 */
  const maybeSession = async (url: URL): Promise<void> => {
    const cwdParam = queryParam(url, "cwd");
    if (cwdParam !== undefined && cwdParam !== "") await manager.setSession(cwdParam);
  };
  const helpers: RouteHelpers = {
```

</details>

**依据 3 · 源码核查**：[packages/dsh-mcp-manager/src/index.ts:1-90](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager/src/index.ts#L1-L90)

插件服务/客户端依赖。

<details>
<summary>查看原文（90行）</summary>

```text
/**
 * dsh-mcp-manager — 主机端（组合根）。
 *
 * 管理本机的 MCP（Model Context Protocol）服务器并桥接到 DSH：
 *  - 服务器配置持久化在本插件私有目录（路径与权限的单一事实源是 server/shared/paths.ts，
 *    版本化，原子写入）；
 *  - 连接与协议交官方 @deepseek-ai/dsh-mcp-client（经宿主 cordis loader 按包名装载，
 *    stdio / streamable-http 两种传输），本插件只留配置面与模型可见面；有界退避重连由
 *    官方插件承担（自研连接栈已随 #767 S1-5c 整体退役）；
 *  - 每个已连接服务器的工具以 mcp__<id>__<rawName> 注册进 ctx.tools（与官方 dsh-mcp-client
 *    的装载路径同形）；`id` 是本次装配按 (工作空间, 服务器名) 现分配的不透明短串，`/api/dsh-mcp/servers`
 *    的 summary.tools 才是注册名以外的裸名口径；
 *  - /api/dsh-mcp/* 路由（loopback-only）供 web GUI 分级展示、快速接入、粘贴
 *    mcpServers JSON 导入；
 *  - 零运行时依赖：官方客户端不随包分发（不经 import 值引用，避免打包副本），由宿主
 *    解析到 dsh 安装内的副本。
 *
 * 激活：安装进 profile（见 cordis.patch.yml 注释），重启一次 dsh web 后，侧边栏出现
 * 「MCP」入口。
 *
 * 结构：#767 W11a 起本文件是唯一的组合根与 apply 装配体——静态端口的模块求值期装配、
 * apply 主流程与配置解析、存量存储迁移的接线、包导出面与声明合并都在这里（原
 * src/bootstrap/** 六文件并入；src 顶层只允许 client / index.ts / server / shared 四项）。
 * 各落点域端口化之后才谈把它再拆出去。
 */

// 类型面加载（declare module 合并）：dsh-agent 注入 agent/* 事件（含 pre-step
// waterfall）、dsh-tools 注入 ctx.tools、dsh-system-prompt 注入 ctx.systemPrompt。
import type { PreStepDecision } from "@deepseek-ai/dsh-agent";
import type {} from "@deepseek-ai/dsh-system-prompt";
import type {} from "@deepseek-ai/dsh-tools";
import type { Context } from "@deepseek-ai/cordis";
import { dirname } from "node:path";
import { installSettingsNamespace } from "../../../shared/settings-namespace.js";
import {
  liveConnectionAdmission,
  liveConnectionPeerAdmission,
  sseData,
} from "../../../shared/host-utils.js";
import type { McpManagerService } from "./shared/interface.ts";
import { installOrchestrator, McpManager } from "./server/connection/orchestrator/interface.ts";
import * as apiApi from "./server/api/interface.ts";
import {
  makeEventsRouteWithAccess,
  makeHealthRouteWithAccess,
  makeRoutesWithAccess,
  uiConfigChangedFrame,
} from "./server/api/interface.ts";
import * as catalogApi from "./server/catalog/interface.ts";
import {
  DEFAULT_ANNOUNCE_CATALOG,
  DEFAULT_CATALOG_MAX_ENTRIES,
  resolveCatalogInjection,
} from "./server/catalog/interface.ts";
import type {
  CatalogAgent,
  CatalogDecision,
  CatalogMessage,
  SupervisorLite,
} from "./server/catalog/interface.ts";
import * as configModelApi from "./server/config/interface.ts";
import { Config } from "./server/config/interface.ts";
import * as dispatchApi from "./server/servers/dispatch/interface.ts";
import * as lifecycleApi from "./server/servers/lifecycle/interface.ts";
import {
  installLifecycle,
  mountLedger,
  releaseLifecycle,
} from "./server/servers/lifecycle/interface.ts";
import * as pipelineApi from "./server/pipeline/interface.ts";
import * as runtimeApi from "./server/connection/runtime/interface.ts";
import * as statsApi from "./server/stats/interface.ts";
import type { DebugConfig } from "./server/stats/interface.ts";
import * as storeApi from "./server/store/interface.ts";
import { defaultStorePath, McpStore } from "./server/store/interface.ts";
import {
  installInject,
  registerMiddlewareTools,
  resolveMiddlewareCallTimeoutMs,
} from "./server/inject/interface.ts";
import { installUpgrade, releaseUpgrade } from "./server/upgrade/interface.ts";
import * as upgradeApi from "./server/upgrade/interface.ts";
import { bindHost, type HostFaces } from "./server/shared/interface.ts";
import { startAgentVisibility } from "./server/visibility/interface.ts";
import { startSdkErasure } from "./server/erasure/interface.ts";
import { MCP_MANAGER_IDENTITY, SSE_FRAMES } from "./shared/interface.ts";
import type { McpServerSummary, SseFramePayload } from "./shared/interface.ts";
import { makeResolveRoot, makeServerIdTable } from "./server/workspace/interface.ts";
import * as workspaceApi from "./server/workspace/interface.ts";

```

</details>

**依据 4 · 源码核查**：[packages/dsh-mcp-manager/src/server/api/routes-controllers.ts:200-217](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager/src/server/api/routes-controllers.ts#L200-L217)

删除路径限定请求解析出来的项目根。

<details>
<summary>查看原文（18行）</summary>

```text
/** PATCH /servers（更新）/ DELETE /servers（移除）：按请求固定目标项目根。 */
async function changeServer(
  method: string,
  name: string,
  url: URL,
  req: Req,
  res: Res,
  manager: RoutesManager,
  helpers: RouteHelpers,
): Promise<void> {
  try {
    const scope = helpers.scopeParam(url);
    const cwd = queryParam(url, "cwd");
    const root = await manager.rootForRequest(scope, cwd);
    if (method === "DELETE") {
      await manager.remove(name, scope, scope === SCOPE_PROJECT ? root : cwd);
      writeJson(res, 200, { ok: true, summary: manager.summaryForRoot(root) });
      return;
```

</details>

**依据 5 · 源码核查**：[packages/dsh-mcp-manager/src/index.ts:419-425](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-mcp-manager/src/index.ts#L419-L425)

效果撤销会移除路由，并释放已有 SSE 连接。

```text
  return () => {
    unsubscribeStatus();
    for (const dispose of disposers) dispose();
    // #515：hub.dispose() 统一停心跳 + destroy 全部连接（幂等，不依赖
    // close 事件异步时序）；取代旧 sseHeartbeatCleanups 逐连接清理。
    manager.sseHub?.dispose();
    manager.sseHub = undefined;
```

#### 缺口

- 没有真实用户、持续维护或服务生命周期测量。
  **影响**：以审核过的 server 做小范围使用，记录设置时间、失败恢复和残留进程
  **进一步探讨**：任何来源/权限无法解释即退出。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
